import asyncio

from config import CLIENT_ID, CLIENT_SECRET, DATABASE_URL
from storage import TokenStorage
from bot import MultiAccountBot


async def main():
    token_storage = TokenStorage()
    await token_storage.connect(DATABASE_URL)

    try:
        bot = MultiAccountBot(CLIENT_ID, CLIENT_SECRET, token_storage)

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
        await token_storage.close()


if __name__ == "__main__":
    asyncio.run(main())