from enum import Enum
from typing import Optional, Union
from pydantic import BaseModel, Field


# ── Document roles ────────────────────────────────────────────────────────────
class DocumentRole(str, Enum):
    PAYMENT_PROOF = "Payment Proof"
    UNKNOWN       = "Unknown"
    ADDRESS_PROOF  = "Address Proof"
    IDENTITY_PROOF = "Identity Proof"
    

# ── Document subtypes per role ────────────────────────────────────────────────
class IdentitySubtype(str, Enum):
    AADHAR          = "Aadhar Card"
    VOTER_ID        = "Voter ID"
    PASSPORT        = "Passport"
    DRIVING_LICENSE = "Driving License"
    PAN_CARD        = "PAN Card"
    OTHER           = "Other"
    
    
class AddressSubtype(str, Enum):
    # Category 1: Govt ID with installation address
    AADHAR_WITH_ADDRESS          = "Aadhar Card with Address"
    VOTER_ID_WITH_ADDRESS        = "Voter ID with Address"
    PASSPORT_WITH_ADDRESS        = "Passport with Address"
    DRIVING_LICENSE_WITH_ADDRESS = "Driving License with Address"
    PAN_WITH_ADDRESS             = "PAN Card with Address"
    # Category 2: Society documents
    SHARE_CERTIFICATE            = "Share Certificate"
    SOCIETY_LETTER               = "Society Letter"
    MAINTENANCE_BILL             = "Maintenance Bill"
    # Category 3: Property documents
    SALE_DEED                    = "Sale Deed"
    LEASE_DEED                   = "Lease Deed"
    AGREEMENT_TO_SALE            = "Agreement to Sale"
    # Category 4: Utility / Official
    ELECTRICITY_BILL             = "Electricity Bill"
    HOUSE_TAX_RECEIPT            = "House Tax Receipt"
    COMPANY_LETTER               = "Company Letter"
    OTHER                        = "Other"






# ── Payment subtype ───────────────────────────────────────────────────────────
class PaymentSubtype(str, Enum):
    CHEQUE        = "Cheque"
    UPI           = "UPI"
    BANK_TRANSFER = "Bank Transfer"
    OTHER         = "Other"

# ── Document subtypes per role ────────────────────────────────────────────────
class IdentitySubtype(str, Enum):
    AADHAR          = "Aadhar Card"
    VOTER_ID        = "Voter ID"
    PASSPORT        = "Passport"
    DRIVING_LICENSE = "Driving License"
    PAN_CARD        = "PAN Card"
    OTHER           = "Other"



# ── Extraction schema ─────────────────────────────────────────────────────────
class PaymentProofFields(BaseModel):
    """Payment proof fields for cheque scan, UPI screenshot, bank transfer receipt."""

    payment_type:   Optional[PaymentSubtype] = Field(
        None,
        description="Type of payment: Cheque / UPI / Bank Transfer."
    )
    payer_name:     Optional[str] = Field(
        None,
        description="Name of the person making the payment."
    )
    payee_name:     Optional[str] = Field(
        None,
        description="Name of the recipient (should be Mahanagar Gas Ltd or similar)."
    )
    amount:         Optional[str] = Field(
        None,
        description="Amount paid in rupees."
    )
    transaction_id: Optional[str] = Field(
        None,
        description="Cheque number, UPI transaction ID, or bank reference number."
    )
    bank_name:      Optional[str] = Field(
        None,
        description="Bank name from cheque or transaction receipt."
    )
    payment_date:   Optional[str] = Field(
        None,
        description="Date of payment."
    )
    
class PageGroup(BaseModel):
    """
    Represents one logical document group as returned by the classifier.
    pages: 1-indexed list of PDF pages belonging to this document.
    roles: list because one document can serve dual roles
           (e.g. Aadhar with address = Identity Proof + Address Proof)
    """
    pages:          list[int]
    primary_role:   DocumentRole
    dual_role:      Optional[DocumentRole] = None   # set if doc serves 2 roles
    subtype:        Optional[str]          = None   # free string from constrained list
    description:    str     
    
# ── Identity Proof Fields ─────────────────────────────────────────────────────
class IdentityProofFields(BaseModel):
    document_type: Optional[IdentitySubtype] = Field(
        None,
        description="Identity document type."
    )

    full_name: Optional[str] = Field(
        None,
        description="Full name as printed on document."
    )

    date_of_birth: Optional[str] = Field(
        None,
        description="DOB from document."
    )

    gender: Optional[str] = Field(
        None,
        description="Gender from document."
    )

    id_number: Optional[str] = Field(
        None,
        description="Aadhar / PAN / Passport number."
    )

    address: Optional[str] = Field(
        None,
        description="Address if available."
    )



# ── Generic Extraction Result ─────────────────────────────────────────────────
class ExtractionResult(BaseModel):
    role: DocumentRole

    subtype: Optional[str] = None

    fields: Optional[
        Union[
            PaymentProofFields,
            IdentityProofFields
        ]
    ] = None