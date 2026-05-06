import json
from fastapi import APIRouter
import logging  

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/final-result")
async def return_final_result():
    with open(r"D:\MGL-Form\frontend\backend\response.json", "r", encoding="utf-8") as f:
        json_1 = json.load(f)
        
    
    with open(r"D:\AI Kosh\Assistant\backend\agents-result\data.json", "r", encoding="utf-8") as f:
        json_2 = json.load(f)
    
    # result = json_1.get("agent_response", {}).copy()
    result =  json_1.copy()

    # Extract required payment fields
    payment_fields = json_2.get("fields", {})

    required_keys = ["payee_name", "transaction_id", "bank_name", "payment_date"]

    for key in required_keys:
        result[key] = payment_fields.get(key)
        
    return {
        "final_result": result
        }