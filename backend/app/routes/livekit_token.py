from fastapi import APIRouter, BackgroundTasks
from pathlib import Path
from livekit import api
import logging

logger = logging.getLogger(__name__)

router = APIRouter(tags = ["Generating livekit token"])

@router.get("/get-livekit-token")
async def get_token():
    token = api.AccessToken(
        "APIJq8fvMXTZJmi",
        "zmMSlfz2i7SocfQ1tUvHJoWSeZfRCO0EprxHpcQmhC3D",
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