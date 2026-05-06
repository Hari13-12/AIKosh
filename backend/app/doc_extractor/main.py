from classifier import _upload_pdf_to_gemini
from extractor import extract_group
from models import PageGroup, DocumentRole

# STEP 1: Upload PDF
pdf_path = r"D:\AI Kosh\OCR\aadh.pdf"
client, file_ref = _upload_pdf_to_gemini(pdf_path)

# STEP 2: Create PageGroup manually (VERY IMPORTANT)
# group = PageGroup(
#     pages=[1],  # change if multiple pages
#     primary_role=DocumentRole.PAYMENT_PROOF,
#     subtype="UPI",  # or "Cheque", "Bank Transfer"
#     description="Payment proof document"
# )




doc_type = "aadhar"   # or "payment"

if doc_type == "payment":
    group = PageGroup(
        pages=[1],
        primary_role=DocumentRole.PAYMENT_PROOF,
        subtype="UPI",
        description="Payment proof"
    )

elif doc_type == "aadhar":
    group = PageGroup(
        pages=[1],
        primary_role=DocumentRole.IDENTITY_PROOF,
        subtype="AADHAR",
        description="Aadhar card"
    )
# STEP 3: Extract
result = extract_group(
    client=client,
    file_ref=file_ref,
    group=group,
    model_id="gemini-2.5-flash"
)

# STEP 4: Print result
print(result)