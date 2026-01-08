import asyncio

from config import CLIENT_ID, CLIENT_SECRET, DATABASE_URL
from storage import Database, TokenStorage, EventStorage
from bot import MultiAccountBot


async def main():
    db = Database()
    await db.connect(DATABASE_URL)

    token_storage = TokenStorage(db)
    event_storage = EventStorage(db)

    try:
        bot = MultiAccountBot(CLIENT_ID, CLIENT_SECRET, token_storage, event_storage)

        await bot.load_accounts_from_db()

        if not bot.accounts:
            print("No valid accounts found. Exiting.")
            return

        await bot.start()

        while True:
            await asyncio.sleep(1)

    except KeyboardInterrupt:
        print("\nShutting down...")
    finally:
        await bot.stop()
        await db.close()


if __name__ == "__main__":
    asyncio.run(main())