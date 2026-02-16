import json
# path = r"D:\AI Kosh\OCR\backend\outputs\pc.json"
# with open(path, "r", encoding="utf-8") as f:
#     data = json.load(f)

# print(data)

combined_data = {
    "file0": {
        "file_name": "aadh.pdf",
        "doc_type": "aadhaar_card",
        "extracted_data": {
            "aadhaar_number": "6",
            "name_on_aadhaar": "Muthumariyamman",
            "date_of_birth": "1999-11-09",
            "address": "C/O S/O Elumalai, NO 219, SREE RAMA ANJANEYAR TEMPLE, VASANTHAPURAM,MANGADU, Kancheepuram, Tamil Nadu-600122",
            "registration_id": "aadh",
            "file_name": "aadh.pdf"
        },
        "validation_errors": []
    },
    "file1": {
        "file_name": "gst.pdf",
        "doc_type": "udyam_registration_certificate",
        "extracted_data": {
            "udyam_registration_number": "33AABTC0738L1ZV",
            "enterprise_name": "CENTRAL UNIVERSITY OF TAMILNADU",
            "enterprise_type": "",
            "major_activity": "",
            "Name_of_unit": "",
            "address_of_enterprise": "NEELAKUDI Business CAMPUS, KANGALANCHERRY, TIRUVARUR, Tiruvarur, 5",
            "registration_id": "gst",
            "file_name": "gst.pdf"
        },
        "validation_errors": [
            "Missing mandatory field: enterprise_type",
            "Missing mandatory field: major_activity",
            "Missing mandatory field: Name_of_unit"
        ]
    },
    "file2": {
        "file_name": "pc.jpg",
        "doc_type": "pan_card",
        "extracted_data": {
            "Permanent Account Number Card": "DCVPJ3055C",
            "Name": "Jain Harshil Navinkumar",
            "ABCDE1234F": "",
            "registration_id": "pc",
            "file_name": "pc.jpg"
        },
        "validation_errors": [
            "Missing mandatory field: ABCDE1234F"
        ]
    },
    "file3": {
        "file_name": "uc.pdf",
        "doc_type": "udyam_registration_certificate",
        "extracted_data": {
            "udyam_registration_number": "UDYAM-GJ-24-0037086",
            "enterprise_name": "K P ENTERPRISE",
            "enterprise_type": "MICRO",
            "major_activity": "SERVICES",
            "Name_of_unit": "K P ENTERPRISE",
            "address_of_enterprise": "Flat/Door/Block No. FF-15 Name of Premises/ Building Maruti Complex Village/Town Vadodara Block OFFICAL ADDRESS OF ENTERPRISE Road/Street/Lane G.I.D.C Road, Manjalpur City Vadodara State GUJARAT District VADODARA , Pin 390011",
            "is_digilocker_verified": "no",
            "is_computer_generated": "yes",
            "date_of_udyam_registration": "08/10/2021",
            "registration_id": "uc",
            "file_name": "uc.pdf"
        },
        "validation_errors": []
    }
}

def extract_required_fields(combined_json):
    final_data = {}

    for file_data in combined_json.values():
        doc_type = file_data.get("doc_type")
        extracted = file_data.get("extracted_data", {})

        # ✅ Aadhaar
        if doc_type == "aadhaar_card":
            final_data["aadhaar_number"] = extracted.get("aadhaar_number")
            final_data["name_on_aadhaar"] = extracted.get("name_on_aadhaar")

        # ✅ PAN
        elif doc_type == "pan_card":
            final_data["pan_number"] = extracted.get("Permanent Account Number Card")

        # ✅ GST (first udyam-like number)
        elif doc_type == "udyam_registration_certificate" and extracted.get("registration_id") == "gst":
            final_data["gst_udyam_registration_number"] = extracted.get("udyam_registration_number")

        # ✅ Real UDYAM (second one)
        elif doc_type == "udyam_registration_certificate" and extracted.get("enterprise_type"):
            final_data["udyam_registration_number"] = extracted.get("udyam_registration_number")
            final_data["enterprise_name"] = extracted.get("enterprise_name")
            final_data["enterprise_type"] = extracted.get("enterprise_type")
            final_data["major_activity"] = extracted.get("major_activity")
            final_data["address_of_enterprise"] = extracted.get("address_of_enterprise")

    print(final_data)

extract_required_fields(combined_data)


