from fastapi import APIRouter
import logging
import json

logging.getLogger(__name__)

result_path = r"D:\AI Kosh\Assistant\backend\agents-result\data.json"
router = APIRouter(tags = ["To send the agent stored results by enquiring about business"])

@router.get("/agent-result")
async def return_agent_results():
    with open(result_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return {"agent_response" : data}
