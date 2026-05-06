import json
import logging
import re
import time
import os
from dotenv import load_dotenv


load_dotenv()  # Load environment variables from .env file
log = logging.getLogger(__name__)

def _upload_pdf_to_gemini(pdf_path: str):
    """
    Upload PDF to Gemini File API. Returns the file object.
    The file reference can be reused across multiple generate_content calls.
    """
    from google import genai as genai_new
    from google.genai import types

    # api_key = os.environ.get("GEMINI_API_KEY", "")
    api_key = os.getenv("GEMINI_API_KEY", "AIzaSyBdCwNL1qQiqRs_KhC5VCdG5lx0J-v448I")
    if not api_key:
        raise ValueError("GEMINI_API_KEY is not set")

    client = genai_new.Client(api_key=api_key)

    log.info("[classifier] Uploading PDF to Gemini File API: %s", pdf_path)
    t0 = time.time()

    with open(pdf_path, "rb") as f:
        file_ref = client.files.upload(
            file=f,
            config=types.UploadFileConfig(mime_type="application/pdf"),
        )

    elapsed = round(time.time() - t0, 2)
    log.info("[classifier] PDF uploaded in %ss | file_name=%s", elapsed, file_ref.name)
    return client, file_ref


