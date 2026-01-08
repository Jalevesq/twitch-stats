from twitchAPI.object.eventsub import (
    ChannelFollowEvent,
    ChannelSubscribeEvent,
    ChannelCheerEvent,
    StreamOnlineEvent,
    StreamOfflineEvent,
    ChannelRaidEvent,
    ChannelPointsCustomRewardRedemptionAddEvent,
    ChannelUpdateEvent,
)

from models import TwitchAccount
from storage import EventStorage


async def handle_event(account: TwitchAccount, event_type: str, event, event_storage: EventStorage):
    """Central event handler - logs and saves events to database."""

    print(f"\n{'='*60}")
    print(f"Event: {event_type.upper()} on {account.display_name}")
    print(f"{'='*60}")

    try:
        match event_type:
            case "follow":
                e: ChannelFollowEvent = event
                print(f"New follower: {e.event.user_name}")
                await event_storage.save_follow(
                    channel_id=account.user_id,
                    follower_id=e.event.user_id,
                    follower_name=e.event.user_name,
                    followed_at=e.event.followed_at,
                )

            case "subscribe":
                e: ChannelSubscribeEvent = event
                print(f"New sub: {e.event.user_name} (Tier {e.event.tier})")
                await event_storage.save_subscription(
                    channel_id=account.user_id,
                    subscriber_id=e.event.user_id,
                    subscriber_name=e.event.user_name,
                    tier=e.event.tier,
                    is_gift=e.event.is_gift,
                )

            case "cheer":
                e: ChannelCheerEvent = event
                print(f"Cheer from {e.event.user_name or 'Anonymous'}: {e.event.bits} bits")
                await event_storage.save_cheer(
                    channel_id=account.user_id,
                    bits=e.event.bits,
                    cheerer_id=e.event.user_id if e.event.is_anonymous is False else None,
                    cheerer_name=e.event.user_name if e.event.is_anonymous is False else None,
                    message=e.event.message,
                )

            case "stream_online":
                e: StreamOnlineEvent = event
                print(f"Stream went LIVE! Type: {e.event.type}")
                await event_storage.save_stream_status(
                    channel_id=account.user_id,
                    status="online",
                    stream_type=e.event.type,
                    started_at=e.event.started_at,
                )

            case "stream_offline":
                e: StreamOfflineEvent = event
                print(f"Stream went OFFLINE")
                await event_storage.save_stream_status(
                    channel_id=account.user_id,
                    status="offline",
                )

            case "raid":
                e: ChannelRaidEvent = event
                print(f"Raid from {e.event.from_broadcaster_user_name}: {e.event.viewers} viewers")
                await event_storage.save_raid(
                    channel_id=account.user_id,
                    raider_id=e.event.from_broadcaster_user_id,
                    raider_name=e.event.from_broadcaster_user_name,
                    viewers=e.event.viewers,
                )

            case "redemption":
                e: ChannelPointsCustomRewardRedemptionAddEvent = event
                print(f"Redemption by {e.event.user_name}: {e.event.reward.title}")
                await event_storage.save_redemption(
                    channel_id=account.user_id,
                    redeemer_id=e.event.user_id,
                    redeemer_name=e.event.user_name,
                    reward_id=e.event.reward.id,
                    reward_title=e.event.reward.title,
                    reward_cost=e.event.reward.cost,
                    redeemed_at=e.event.redeemed_at,
                    user_input=e.event.user_input,
                )

            case "channel_update":
                e: ChannelUpdateEvent = event
                print(f"Channel updated: {e.event.category_name} - {e.event.title}")
                await event_storage.save_channel_update(
                    channel_id=account.user_id,
                    title=e.event.title,
                    category_id=e.event.category_id,
                    category_name=e.event.category_name,
                    language=e.event.language,
                )

            case _:
                print(f"[{account.user_id}] Unknown event type: {event_type}")

    except Exception as ex:
        print(f"[ERROR] Failed to save {event_type} event: {ex}")