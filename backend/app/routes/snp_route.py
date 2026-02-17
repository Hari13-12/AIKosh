from numpy import rec
from fastapi import APIRouter
from app.services.snp_service import recommend_snp
import logging
import json

logging.getLogger(__name__)
result_path = r"D:\AI Kosh\Assistant\backend\agents-result\data.json"

router =  APIRouter(tags = ["For recommending suitable SNP's based on MSME"])

@router.get("/ai-snp")
async def return_snp():
    with open(result_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    recommendation = await recommend_snp(data)
    return {"recommended-snps" : recommendation}
