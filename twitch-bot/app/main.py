import asyncio
import uvicorn

from logger import log
from config import CLIENT_ID, CLIENT_SECRET, DATABASE_URL
from storage import Database, TokenStorage, EventStorage
from bot import MultiAccountBot
from api import app, set_bot

async def main():
    db = Database()
    await db.connect(DATABASE_URL)

    token_storage = TokenStorage(db)
    event_storage = EventStorage(db)

    bot = MultiAccountBot(CLIENT_ID, CLIENT_SECRET, token_storage, event_storage)
    set_bot(bot)

    await bot.load_accounts_from_db()

    if not bot.accounts:
        log.warning("No valid accounts found.")

    await bot.start()

    config = uvicorn.Config(app, host="0.0.0.0", port=8000, log_level="info")
    server = uvicorn.Server(config)

    try:
        await server.serve()
    except KeyboardInterrupt:
        log.info("Shutting down...")
    finally:
        await bot.stop()
        await db.close()


if __name__ == "__main__":
    asyncio.run(main())