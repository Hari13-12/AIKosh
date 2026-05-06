from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import agent_result, livekit_token, snp_route, ocr_result, final_result

import logging
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

routes = [
    agent_result.router,
    livekit_token.router,
    snp_route.router,
    ocr_result.router,
    final_result.router
]

# Include all routes
for route in routes:
    app.include_router(route)