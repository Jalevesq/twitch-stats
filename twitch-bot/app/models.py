from dataclasses import dataclass
from twitchAPI.twitch import Twitch
from twitchAPI.eventsub.websocket import EventSubWebsocket


@dataclass
class TwitchAccount:
    """Holds all objects related to a single Twitch account."""
    twitch_id: str
    display_name: str
    twitch: Twitch
    eventsub: EventSubWebsocket