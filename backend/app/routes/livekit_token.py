from fastapi import APIRouter, BackgroundTasks
from pathlib import Path
from livekit import api
import logging

logger = logging.getLogger(__name__)

router = APIRouter(tags = ["Generating livekit token"])

@router.get("/get-livekit-token")
async def get_token():
    logger.info("Inside livekit token")
    try:
        token = api.AccessToken(
            "APIvq2E4Tzfo2C8",
            "WhJhvJRQXpz8NfiyA8T2edCoFzGkMbg5W5bDqzbdZAD",
        ) \
            .with_identity("aikosh") \
            .with_name("AI Kosh Agent") \
            .with_grants(
                api.VideoGrants(
                    room_join=True,
                    room="my-room"
                )
            )
        return {"token": token.to_jwt()}
    except Exception:
        logger.error("Error while fetching livekit token")