from datetime import datetime, timezone, timedelta
from typing import Optional

from psycopg_pool import AsyncConnectionPool


class Database:
    """Single database connection manager using psycopg3."""

    def __init__(self):
        self.pool: Optional[AsyncConnectionPool] = None

    async def connect(self, database_url: str):
        self.pool = AsyncConnectionPool(database_url, min_size=2, max_size=10, open=False)
        await self.pool.open()
        print("[Database] Connected")

    async def close(self):
        if self.pool:
            await self.pool.close()

    async def execute(self, query: str, *args):
        async with self.pool.connection() as conn:
            await conn.execute(query, args)

    async def fetch(self, query: str, *args):
        async with self.pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(query, args)
                rows = await cur.fetchall()
                columns = [desc[0] for desc in cur.description]
                return [dict(zip(columns, row)) for row in rows]

    async def fetchrow(self, query: str, *args):
        async with self.pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(query, args)
                row = await cur.fetchone()
                if row:
                    columns = [desc[0] for desc in cur.description]
                    return dict(zip(columns, row))
                return None


class EventStorage:
    """PostgreSQL storage for Twitch events."""

    def __init__(self, db: Database):
        self.db = db

    async def save_follow(self, channel_id: str, follower_id: str, follower_name: str, followed_at: datetime):
        await self.db.execute("""
            INSERT INTO twitch_follows ("channelId", "followerId", "followerName", "followedAt", "createdAt")
            VALUES (%s, %s, %s, %s, NOW())
        """, channel_id, follower_id, follower_name, followed_at)
        print(f"[EventStorage] Saved follow: {follower_name}")

    async def save_subscription(self, channel_id: str, subscriber_id: str, subscriber_name: str, tier: str,
                                is_gift: bool = False, gifter_id: Optional[str] = None,
                                gifter_name: Optional[str] = None, is_anonymous: bool = False):
        await self.db.execute("""
            INSERT INTO twitch_subscriptions ("channelId", "subscriberId", "subscriberName", "tier", "isGift", "gifterId", "gifterName", "isAnonymous", "createdAt")
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW())
        """, channel_id, subscriber_id, subscriber_name, tier, is_gift, gifter_id, gifter_name, is_anonymous)
        print(f"[EventStorage] Saved subscription: {subscriber_name} (Tier {tier})")

    async def save_cheer(self, channel_id: str, bits: int, cheerer_id: Optional[str] = None,
                         cheerer_name: Optional[str] = None, message: Optional[str] = None):
        await self.db.execute("""
            INSERT INTO twitch_cheers ("channelId", "cheererId", "cheererName", "bits", "message", "createdAt")
            VALUES (%s, %s, %s, %s, %s, NOW())
        """, channel_id, cheerer_id, cheerer_name, bits, message)
        print(f"[EventStorage] Saved cheer: {bits} bits from {cheerer_name or 'Anonymous'}")

    async def save_stream_status(self, channel_id: str, status: str, stream_type: Optional[str] = None,
                                 started_at: Optional[datetime] = None):
        await self.db.execute("""
            INSERT INTO twitch_streams ("channelId", "type", "streamType", "startedAt", "createdAt")
            VALUES (%s, %s, %s, %s, NOW())
        """, channel_id, status, stream_type, started_at)
        print(f"[EventStorage] Saved stream {status}")

    async def save_raid(self, channel_id: str, raider_id: str, raider_name: str, viewers: int):
        await self.db.execute("""
            INSERT INTO twitch_raids ("channelId", "raiderId", "raiderName", "viewers", "createdAt")
            VALUES (%s, %s, %s, %s, NOW())
        """, channel_id, raider_id, raider_name, viewers)
        print(f"[EventStorage] Saved raid: {raider_name} with {viewers} viewers")

    async def save_redemption(self, channel_id: str, redeemer_id: str, redeemer_name: str, reward_id: str,
                              reward_title: str, reward_cost: int, redeemed_at: datetime,
                              user_input: Optional[str] = None):
        await self.db.execute("""
            INSERT INTO twitch_redemptions ("channelId", "redeemerId", "redeemerName", "rewardId", "rewardTitle", "rewardCost", "userInput", "redeemedAt", "createdAt")
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW())
        """, channel_id, redeemer_id, redeemer_name, reward_id, reward_title, reward_cost, user_input, redeemed_at)
        print(f"[EventStorage] Saved redemption: {redeemer_name} redeemed {reward_title}")

    async def save_channel_update(self, channel_id: str, title: str, category_id: str,
                                  category_name: str, language: str):
        await self.db.execute("""
            INSERT INTO twitch_channel_updates ("channelId", "title", "categoryId", "categoryName", "language", "createdAt")
            VALUES (%s, %s, %s, %s, %s, NOW())
        """, channel_id, title, category_id, category_name, language)
        print(f"[EventStorage] Saved channel update: {category_name}")


class TokenStorage:
    """PostgreSQL token storage for Twitch OAuth tokens."""

    def __init__(self, db: Database):
        self.db = db

    async def get_all_valid_users(self) -> list[dict]:
        return await self.db.fetch("""
            SELECT 
                a."providerAccountId" as id,
                a."access_token" as "accessToken",
                a."refresh_token" as "refreshToken",
                u."name" as "displayName"
            FROM "Account" a
            JOIN "User" u ON a."userId" = u.id
            WHERE u."isValid" = true
              AND a."provider" = 'twitch'
              AND a."access_token" IS NOT NULL
              AND a."refresh_token" IS NOT NULL
        """)

    async def get_tokens(self, twitch_user_id: str) -> tuple[str, str] | None:
        row = await self.db.fetchrow("""
            SELECT a."access_token", a."refresh_token"
            FROM "Account" a
            JOIN "User" u ON a."userId" = u.id
            WHERE a."providerAccountId" = %s
              AND a."provider" = 'twitch'
              AND u."isValid" = true
        """, twitch_user_id)
        if row:
            return (row["access_token"], row["refresh_token"])
        return None

    async def save_tokens(self, twitch_user_id: str, access_token: str, refresh_token: str, expires_in: int = 14400):
        expires_at = int((datetime.now(timezone.utc) + timedelta(seconds=expires_in)).timestamp())
        await self.db.execute("""
            UPDATE "Account"
            SET "access_token" = %s,
                "refresh_token" = %s,
                "expires_at" = %s
            WHERE "providerAccountId" = %s
              AND "provider" = 'twitch'
        """, access_token, refresh_token, expires_at, twitch_user_id)
        print(f"[TokenStorage] Updated tokens for Twitch user {twitch_user_id}")

    async def mark_invalid(self, twitch_user_id: str):
        await self.db.execute("""
            UPDATE "User"
            SET "isValid" = false
            WHERE id = (
                SELECT "userId" FROM "Account"
                WHERE "providerAccountId" = %s
                  AND "provider" = 'twitch'
            )
        """, twitch_user_id)
        print(f"[TokenStorage] Marked user invalid for Twitch ID {twitch_user_id}")