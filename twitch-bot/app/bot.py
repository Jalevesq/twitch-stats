import asyncio

from twitchAPI.twitch import Twitch
from twitchAPI.eventsub.websocket import EventSubWebsocket
from twitchAPI.type import InvalidRefreshTokenException, UnauthorizedException

from config import SCOPES
from models import TwitchAccount
from storage import TokenStorage, EventStorage
from handlers import handle_event


class MultiAccountBot:
    """Manages multiple Twitch accounts and their EventSub connections."""

    def __init__(self, client_id: str, client_secret: str, token_storage: TokenStorage, event_storage: EventStorage):
        self.client_id = client_id
        self.client_secret = client_secret
        self.token_storage = token_storage
        self.event_storage = event_storage
        self.accounts: list[TwitchAccount] = []

    async def add_account(
            self,
            user_id: str,
            display_name: str,
            access_token: str,
            refresh_token: str,
    ) -> TwitchAccount | None:
        """Initialize a Twitch instance for an account and set up EventSub."""

        try:
            twitch = await Twitch(self.client_id, self.client_secret)

            def make_token_callback(uid: str):
                def callback(new_access_token: str, new_refresh_token: str):
                    asyncio.create_task(
                        self.token_storage.save_tokens(uid, new_access_token, new_refresh_token)
                    )
                return callback

            await twitch.set_user_authentication(
                access_token,
                SCOPES,
                refresh_token,
            )
            twitch.user_auth_refresh_callback = make_token_callback(user_id)

            eventsub = EventSubWebsocket(twitch)

            account = TwitchAccount(
                user_id=user_id,
                display_name=display_name,
                twitch=twitch,
                eventsub=eventsub,
            )
            self.accounts.append(account)

            print(f"[{display_name}] Account initialized successfully")
            return account

        except (InvalidRefreshTokenException, UnauthorizedException) as e:
            print(f"[{display_name}] Token invalid/revoked: {e}")
            await self.token_storage.mark_invalid(user_id)
            return None
        except Exception as e:
            print(f"[{display_name}] Failed to initialize: {e}")
            return None

    async def subscribe_to_events(self, account: TwitchAccount):
        """Subscribe to various EventSub events for an account."""

        es = account.eventsub
        user_id = account.user_id
        name = account.display_name
        event_storage = self.event_storage

        def make_callback(event_type: str):
            async def callback(event):
                await handle_event(account, event_type, event, event_storage)
            return callback

        subscriptions = [
            ("follow", lambda: es.listen_channel_follow_v2(
                broadcaster_user_id=user_id,
                moderator_user_id=user_id,
                callback=make_callback("follow"),
            )),
            ("subscribe", lambda: es.listen_channel_subscribe(
                broadcaster_user_id=user_id,
                callback=make_callback("subscribe"),
            )),
            ("cheer", lambda: es.listen_channel_cheer(
                broadcaster_user_id=user_id,
                callback=make_callback("cheer"),
            )),
            ("stream_online", lambda: es.listen_stream_online(
                broadcaster_user_id=user_id,
                callback=make_callback("stream_online"),
            )),
            ("stream_offline", lambda: es.listen_stream_offline(
                broadcaster_user_id=user_id,
                callback=make_callback("stream_offline"),
            )),
            ("raid", lambda: es.listen_channel_raid(
                to_broadcaster_user_id=user_id,
                callback=make_callback("raid"),
            )),
            ("redemption", lambda: es.listen_channel_points_custom_reward_redemption_add(
                broadcaster_user_id=user_id,
                callback=make_callback("redemption"),
            )),
            ("channel_update", lambda: es.listen_channel_update(
                broadcaster_user_id=user_id,
                callback=make_callback("channel_update"),
            )),
        ]

        for event_name, subscribe_fn in subscriptions:
            try:
                await subscribe_fn()
                print(f"[{name}] Subscribed to {event_name}")
            except Exception as e:
                print(f"[{name}] Could not subscribe to {event_name}: {e}")

    async def load_accounts_from_db(self):
        """Load all valid accounts from the database."""
        users = await self.token_storage.get_all_valid_users()
        print(f"Found {len(users)} valid user(s) in database")

        for user in users:
            await self.add_account(
                user_id=user["id"],
                display_name=user["displayName"],
                access_token=user["accessToken"],
                refresh_token=user["refreshToken"],
            )
            await asyncio.sleep(0.5)

    async def start(self):
        """Start all EventSub connections."""
        for account in self.accounts:
            account.eventsub.start()
            await asyncio.sleep(0.5)
            await self.subscribe_to_events(account)

        print(f"\n{'='*60}")
        print(f"Bot started! Listening on {len(self.accounts)} account(s)")
        print(f"{'='*60}\n")

    async def stop(self):
        """Stop all connections and cleanup."""
        for account in self.accounts:
            try:
                await account.eventsub.stop()
                await account.twitch.close()
            except Exception as e:
                print(f"Error closing {account.display_name}: {e}")
        print("Bot stopped.")