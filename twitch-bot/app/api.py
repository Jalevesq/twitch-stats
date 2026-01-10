from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from bot import MultiAccountBot
from logger import log

app = FastAPI(title="Twitch Bot API")
bot: MultiAccountBot


def set_bot(bot_instance: MultiAccountBot):
    global bot
    bot = bot_instance

class AddAccountRequest(BaseModel):
    twitch_id: str

@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/accounts")
async def add_account(request: AddAccountRequest):
    existing = next((a for a in bot.accounts if a.twitch_id == request.twitch_id), None)
    if existing:
        log.error(f"[API - /accounts] Account {request.twitch_id} already connected")
        raise HTTPException(status_code=409, detail="Account already connected")

    user = await bot.token_storage.get_user_by_twitch_id(request.twitch_id)
    if not user:
        log.error(f"[API - /accounts] User {request.twitch_id} not found")
        raise HTTPException(status_code=404, detail="User not found in database")

    new_account = await bot.add_account(
        twitch_id=user["twitchId"],
        display_name=user["displayName"],
        access_token=user["accessToken"],
        refresh_token=user["refreshToken"],
    )

    if not new_account:
        log.error(f"[API - /accounts] Failed to add account {request.twitch_id} - invalid tokens")
        raise HTTPException(status_code=400, detail="Failed to add account - invalid tokens")

    new_account.eventsub.start()
    await bot.subscribe_to_events(new_account)

    log.debug(f"Added new account via API: {user['displayName']}")

    return { "status": "ok", }


# @app.delete("/accounts/{user_id}")
# async def remove_account(user_id: str):
#     account = next((a for a in bot.accounts if a.user_id == user_id), None)
#     if not account:
#         raise HTTPException(status_code=404, detail="Account not found")
#
#     try:
#         await account.eventsub.stop()
#         await account.twitch.close()
#     except Exception as e:
#         log.error(f"Error stopping account {user_id}: {e}")
#
#     bot.accounts.remove(account)
#     log.info(f"Removed account via API: {account.display_name}")
#
#     return {"status": "ok", "user_id": user_id}