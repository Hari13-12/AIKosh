from fastapi import APIRouter
import logging
import json

logger = logging.getLogger(__name__)

result_path = r"D:\AI Kosh\Assistant\backend\agents-result\data.json"
router = APIRouter(tags = ["To send the agent stored results by enquiring about business"])

@router.get("/agent-result")
async def return_agent_results():
    logger.info("Inside Agent response")
    try:
        logger.info("Agent Data present")
        with open(result_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return {"agent_response" : data}
    except Exception:
        logger.info("No agent data")
        return {"agent_response" : "no agent data"}
