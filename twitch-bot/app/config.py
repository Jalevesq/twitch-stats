import os
from twitchAPI.type import AuthScope

CLIENT_ID = os.environ["TWITCH_CLIENT_ID"]
CLIENT_SECRET = os.environ["TWITCH_CLIENT_SECRET"]
DATABASE_URL = os.environ["DATABASE_URL"]

SCOPES = [
    AuthScope.BITS_READ,
    AuthScope.CHANNEL_READ_SUBSCRIPTIONS,
    AuthScope.CHANNEL_READ_REDEMPTIONS,
    AuthScope.MODERATOR_READ_FOLLOWERS,
    # for future use
    # AuthScope.CHANNEL_READ_GOALS,
    # AuthScope.CHANNEL_READ_HYPE_TRAIN,
    # AuthScope.CHANNEL_READ_POLLS,
    # AuthScope.CHANNEL_READ_PREDICTIONS,
    # AuthScope.CHANNEL_READ_VIPS,
]