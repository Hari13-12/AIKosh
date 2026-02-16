from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from livekit import api
from fastapi import UploadFile, File
from typing import List
import json

result_path = r"D:\AI Kosh\Assistant\backend\agents-result\data.json"
app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/get-livekit-token")
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

@app.get("/agent-result")
async def return_agent_results():
    with open(result_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return {"ocr_response" : data}






