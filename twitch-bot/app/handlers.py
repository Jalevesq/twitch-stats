from twitchAPI.object.eventsub import (
    ChannelFollowEvent,
    ChannelSubscribeEvent,
    ChannelCheerEvent,
    StreamOnlineEvent,
    StreamOfflineEvent,
    ChannelRaidEvent,
    ChannelPointsCustomRewardRedemptionAddEvent,
)

from models import TwitchAccount


async def handle_event(account: TwitchAccount, event_type: str, event):
    """Central event handler - customize this for your needs."""

    print(f"\n{'=' * 60}")
    print(f"Event: {event_type.upper()} on {account.display_name} ({account.login})")
    print(f"{'=' * 60}")

    match event_type:
        case "follow":
            event: ChannelFollowEvent
            print(f"New follower: {event.event.user_name}")

        case "subscribe":
            event: ChannelSubscribeEvent
            print(f"New sub: {event.event.user_name} (Tier {event.event.tier})")

        case "cheer":
            event: ChannelCheerEvent
            print(f"Cheer from {event.event.user_name}: {event.event.bits} bits")
            if event.event.message:
                print(f"Message: {event.event.message}")

        case "stream_online":
            event: StreamOnlineEvent
            print(f"Stream went LIVE! Type: {event.event.type}")

        case "stream_offline":
            event: StreamOfflineEvent
            print(f"Stream went OFFLINE")

        case "raid":
            event: ChannelRaidEvent
            print(f"Raid from {event.event.from_broadcaster_user_name}")
            print(f"Viewers: {event.event.viewers}")

        case "redemption":
            event: ChannelPointsCustomRewardRedemptionAddEvent
            print(f"Redemption by {event.event.user_name}")
            print(f"Reward: {event.event.reward.title}")
            if event.event.user_input:
                print(f"Input: {event.event.user_input}")

        case _:
            print(f"Unknown event type: {event_type}")