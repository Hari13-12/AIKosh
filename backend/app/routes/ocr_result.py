# from fastapi import APIRouter, UploadFile, File, HTTPException
# import tempfile
# import shutil
# import os

# from app.doc_extractor.classifier import _upload_pdf_to_gemini
# from app.doc_extractor.extractor import extract_group
# from app.doc_extractor.models import PageGroup, DocumentRole

# import logging

# logger = logging.getLogger(__name__)

# router = APIRouter(tags = ["Generating livekit token"])

# @router.post("/extract/payment-proof")
# async def extract_payment_proof(file: UploadFile = File(...)):
#     try:
#         # ✅ Step 1: Save uploaded file temporarily
#         with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
#             shutil.copyfileobj(file.file, temp_file)
#             temp_path = temp_file.name

#         # ✅ Step 2: Upload to Gemini
#         client, file_ref = _upload_pdf_to_gemini(temp_path)

#         # ✅ Step 3: Create PageGroup
#         group = PageGroup(
#             pages=[1],  # can be dynamic later
#             primary_role=DocumentRole.PAYMENT_PROOF,
#             subtype="UPI",  # you can also pass this dynamically
#             description="Payment proof document"
#         )

#         # ✅ Step 4: Extract
#         result = extract_group(
#             client=client,
#             file_ref=file_ref,
#             group=group,
#             model_id="gemini-3.1-flash-lite-preview"
#         )


#         try:
#             with open(r"D:\AI Kosh\Assistant\backend\agents-result\data.json", "w") as f:
#                 import json
#                 json.dump(result, f, indent=4)  
#         except Exception as e:
#             logger.error(f"Failed to save extraction result: {e}")
#         return {
#             "success": True,
#             "data": result
#         }

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

#     finally:
#         # ✅ Cleanup temp file
#         if "temp_path" in locals() and os.path.exists(temp_path):
#             os.remove(temp_path)




from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
import tempfile
import shutil
import os
import json
import uuid
import logging

from app.doc_extractor.classifier import _upload_pdf_to_gemini
from app.doc_extractor.extractor import extract_group
from app.doc_extractor.models import PageGroup, DocumentRole

router = APIRouter()
logger = logging.getLogger(__name__)


# 🔹 Background function
def process_payment_proof(temp_path: str, job_id: str, doc_type:str):
    try:
        client, file_ref = _upload_pdf_to_gemini(temp_path)
        if doc_type == "payment":
            group = PageGroup(
                pages=[1],
                primary_role=DocumentRole.PAYMENT_PROOF,
                subtype="UPI",
                description="Payment proof document"
            )

            result = extract_group(
                client=client,
                file_ref=file_ref,
                group=group,
                model_id="gemini-3.1-flash-lite-preview"
            )
        if doc_type == "aadhar":
            group = PageGroup(
                pages=[1],
                primary_role=DocumentRole.IDENTITY_PROOF,
                subtype="AADHAR",
                description="Identity proof document"
            )

            result = extract_group(
                client=client,
                file_ref=file_ref,
                group=group,
                model_id="gemini-3.1-flash-lite-preview"
            )

        # ✅ Save result using job_id
        output_path = "D:/AI Kosh/Assistant/backend/agents-result/data.json"
        with open(output_path, "w") as f:
            json.dump(result, f, indent=4)

        logger.info(f"✅ Job {job_id} completed")

    except Exception as e:
        logger.error(f"❌ Job {job_id} failed: {e}")

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


# 🔹 API
@router.post("/process-files")
async def extract_payment_proof(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    doc_type:str = None
):
    try:
        # ✅ Generate job ID
        job_id = str(uuid.uuid4())

        # ✅ Save file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            shutil.copyfileobj(file.file, temp_file)
            temp_path = temp_file.name

        # ✅ Run in background
        background_tasks.add_task(process_payment_proof, temp_path, job_id, doc_type = "payment")

        # ✅ Return immediately
        return {
            "success": True,
            "message": "Processing started",
            "job_id": job_id
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.post("/upload-files")
async def upload_files():
    return {"message": "Files are uploaded successfully."}