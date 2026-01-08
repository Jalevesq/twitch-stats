from datetime import datetime, timezone, timedelta
from typing import Optional

import asyncpg


class TokenStorage:
    """PostgreSQL token storage for Twitch OAuth tokens."""

    def __init__(self):
        self.pool: Optional[asyncpg.Pool] = None

    async def connect(self, database_url: str):
        self.pool = await asyncpg.create_pool(database_url)
        print("[TokenStorage] Connected to database")

    async def close(self):
        if self.pool:
            await self.pool.close()

    async def get_all_valid_users(self) -> list[dict]:
        """Fetch all valid users with their Twitch accounts."""
        rows = await self.pool.fetch("""
            SELECT 
                a."providerAccountId" as id,
                a."access_token" as "accessToken",
                a."refresh_token" as "refreshToken",
                u."name" as "displayName"
            FROM "Account" a
            JOIN "User" u ON a."userId" = u.id
            WHERE u."isValid" = true
              AND a."provider" = 'twitch'
              AND a."refresh_token" IS NOT NULL
        """)
        return [dict(row) for row in rows]

    async def get_tokens(self, twitch_user_id: str) -> tuple[str, str] | None:
        """Get tokens for a specific Twitch user."""
        row = await self.pool.fetchrow("""
            SELECT a."access_token", a."refresh_token"
            FROM "Account" a
            JOIN "User" u ON a."userId" = u.id
            WHERE a."providerAccountId" = $1
              AND a."provider" = 'twitch'
              AND u."isValid" = true
        """, twitch_user_id)
        return (row["access_token"], row["refresh_token"]) if row else None

    async def save_tokens(
            self,
            twitch_user_id: str,
            access_token: str,
            refresh_token: str,
            expires_in: int = 14400,
    ):
        """Update tokens after refresh."""
        expires_at = int((datetime.now(timezone.utc) + timedelta(seconds=expires_in)).timestamp())

        await self.pool.execute("""
            UPDATE "Account"
            SET "access_token" = $2,
                "refresh_token" = $3,
                "expires_at" = $4
            WHERE "providerAccountId" = $1
              AND "provider" = 'twitch'
        """, twitch_user_id, access_token, refresh_token, expires_at)
        print(f"[TokenStorage] Updated tokens for Twitch user {twitch_user_id}")

    async def mark_invalid(self, twitch_user_id: str):
        """Mark a user as invalid."""
        await self.pool.execute("""
            UPDATE "User"
            SET "isValid" = false
            WHERE id = (
                SELECT "userId" FROM "Account"
                WHERE "providerAccountId" = $1
                  AND "provider" = 'twitch'
            )
        """, twitch_user_id)
        print(f"[TokenStorage] Marked user invalid for Twitch ID {twitch_user_id}")