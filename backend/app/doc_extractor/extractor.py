import json
import logging
import re
import time
import os

from .models import DocumentRole, PaymentProofFields, PaymentSubtype, PageGroup


log = logging.getLogger(__name__)



def _build_identity_prompt(pages: list[int], subtype: str) -> str:
    
    page_str = f"page {pages[0]}" if len(pages) == 1 else f"pages {', '.join(map(str, pages))}"
    return (
        f"Focus ONLY on {page_str} of the PDF. This is an Identity Proof document ({subtype}).\n\n"
        "Extract the following fields. Return ONLY a valid JSON object. "
        "Set missing fields to null. No explanation, no markdown.\n\n"
        "Keys to extract:\n"
        f"  document_type: The type of identity document. Set to '{subtype}'.\n"
        "  full_name: Full name of the person as printed on the document.\n"
        "  date_of_birth: Date of birth. Use DD/MM/YYYY format.\n"
        "  gender: Gender as printed (Male / Female / M / F).\n"
        "  id_number: The primary ID number — Aadhar: 12-digit number; PAN: 10-char alphanumeric; "
        "Passport: 1 letter + 7 digits; Voter ID or DL: as printed.\n"
        "  address: Full address printed on the document if visible. Null if no address shown.\n"
    )
    
    
def _build_payment_prompt(pages: list[int], subtype: str) -> str:
    page_str = f"page {pages[0]}" if len(pages) == 1 else f"pages {', '.join(map(str, pages))}"
    return (
        f"Focus ONLY on {page_str} of the PDF. This is a Payment Proof document ({subtype}).\n\n"
        "Extract the following fields. Return ONLY a valid JSON object. "
        "Set missing fields to null. No explanation, no markdown.\n\n"
        "Keys to extract:\n"
        f"  payment_type: Type of payment. Set to '{subtype}'.\n"
        "  payer_name: Name of the person making the payment.\n"
        "  payee_name: Name of the recipient (Mahanagar Gas Ltd or similar).\n"
        "  amount: Amount paid in rupees.\n"
        "  transaction_id: Cheque number, UPI transaction ID, or bank reference number.\n"
        "  bank_name: Bank name from cheque or receipt.\n"
        "  payment_date: Date of payment.\n"
    )
    
    
def _build_address_prompt(pages: list[int], subtype: str) -> str:
    page_str = f"page {pages[0]}" if len(pages) == 1 else f"pages {', '.join(map(str, pages))}"
    return (
        f"Focus ONLY on {page_str} of the PDF. This is an Address Proof document ({subtype}).\n\n"
        "Extract the following fields. Return ONLY a valid JSON object. "
        "Set missing fields to null. No explanation, no markdown.\n\n"
        "Keys to extract:\n"
        f"  document_type: The type of address document. Set to '{subtype}'.\n"
        "  name: Full name of the person the document belongs to or is addressed to.\n"
        "  address: Complete residential address — flat number, floor, wing, building name, "
        "society, area, city, pincode. Do NOT extract the issuer/company address.\n"
        "  issuer: Name of the issuing authority or company.\n"
        "  document_date: Date on the document (bill date, issue date, etc.).\n"
        "  reference_no: Account number, consumer number, or reference number.\n"
    )



def _get_extraction_prompt(role: DocumentRole, pages: list[int], subtype: str) -> str:
    """Route to the correct prompt builder based on role."""
    if role == DocumentRole.PAYMENT_PROOF:
        return _build_payment_prompt(pages, subtype or "Payment Document")
    if role == DocumentRole.ADDRESS_PROOF:
        return _build_address_prompt(pages, subtype or "Address Document")
    if role == DocumentRole.IDENTITY_PROOF:
        return _build_identity_prompt(pages, subtype or "Identity Document")
    else:
        return ""
    
    
def _extract_json(text: str) -> str:
    if not text:
        return ""
    text = re.sub(r"^```(?:json)?\s*", "", text.strip(), flags=re.IGNORECASE)
    text = re.sub(r"\s*```$", "", text)
    start, end = text.find("{"), text.rfind("}")
    if start == -1 or end == -1 or end < start:
        return text.strip()
    return text[start:end + 1].strip()




def _error_result(group: PageGroup, error: str) -> dict:
    return {
        "role":           group.primary_role.value,
        "dual_role":      group.dual_role.value if group.dual_role else None,
        "subtype":        group.subtype,
        "pages":          group.pages,
        "description":    group.description,
        "fields":         {},
        "display_fields": [],
        "error":          error,
    }

def extract_group(
    client,
    file_ref,
    group: PageGroup,
    model_id: str,
) -> dict:
    """
    Run one extraction call for a single document group.

    Returns a dict with keys:
      role          : DocumentRole value string
      dual_role     : DocumentRole value string or None
      subtype       : subtype string or None
      pages         : list of page numbers
      description   : description string
      fields        : extracted key-value dict (all raw fields)
      display_fields: list of (label, value) tuples for curated display
      error         : error string if extraction failed, else None
    """
    from google.genai import types as gtypes

    role = group.primary_role
    pages = group.pages
    subtype = group.subtype or ""

    log.info(
        "[extractor] Extracting group | role=%s | pages=%s | subtype=%s",
        role.value, pages, subtype,
    )

    prompt = _get_extraction_prompt(role, pages, subtype)
    if not prompt:
        return _error_result(group, "No extraction prompt for role: " + role.value)

    t0 = time.time()
    try:
        response = client.models.generate_content(
            model=model_id,
            contents=[
                gtypes.Part.from_uri(
                    file_uri=file_ref.uri,
                    mime_type="application/pdf",
                ),
                gtypes.Part.from_text(text=prompt),
            ],
        )
        raw_text = response.text or ""
    except Exception as e:
        log.error("[extractor] API call failed for pages %s: %s", pages, e)
        return _error_result(group, f"Extraction API error: {e}")

    elapsed = round(time.time() - t0, 2)

    try:
        fields = json.loads(_extract_json(raw_text))
        if not isinstance(fields, dict):
            raise ValueError(f"Non-dict response: {type(fields).__name__}")
    except Exception as e:
        log.error("[extractor] JSON parse error for pages %s: %s | raw: %s", pages, e, raw_text[:200])
        return _error_result(group, f"Could not parse extraction response: {e}")

    log.info(
        "[extractor] Extracted %d fields for pages %s in %ss",
        len(fields), pages, elapsed,
    )


    return {
        "role":          role.value,
        "dual_role":     group.dual_role.value if group.dual_role else None,
        "subtype":       subtype,
        "pages":         pages,
        "description":   group.description,
        "fields":        fields,
        "error":         None,
    }