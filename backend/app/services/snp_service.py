import json

import logging
logger = logging.getLogger(__name__)

SNPS_DATA = {
    "snps": [
        {
            "snp_id": "SNP001",
            "snp_name": "AgriFood Connect",
            "supported_sectors": ["Food Processing", "Agriculture"],
            "supported_primary_categories": ["Grocery"],
            "supported_subcategories": ["Spices", "Packaged Foods", "Snacks"],
            "supported_states": ["Tamil Nadu", "Karnataka"],
            "min_capacity": 500,
            "max_capacity": 15000,
            "provides_logistics_support": True,
            "provides_catalog_support": True
        },
        {
            "snp_id": "SNP002",
            "snp_name": "FashionBridge ",
            "supported_sectors": ["Manufacturing", "Retail"],
            "supported_primary_categories": ["Fashion"],
            "supported_subcategories": ["Sarees", "Leather Handbags"],
            "supported_states": ["Tamil Nadu", "Maharashtra"],
            "min_capacity": 200,
            "max_capacity": 8000,
            "provides_logistics_support": True,
            "provides_catalog_support": True
        },
        {
            "snp_id": "SNP003",
            "snp_name": "ElectroMart Partner",
            "supported_sectors": ["Retail"],
            "supported_primary_categories": ["Electronics"],
            "supported_subcategories": ["Mobile Accessories"],
            "supported_states": ["Pan India"],
            "min_capacity": 100,
            "max_capacity": 20000,
            "provides_logistics_support": True,
            "provides_catalog_support": False
        },
        {
            "snp_id": "SNP004",
            "snp_name": "CraftLink India",
            "supported_sectors": ["Handicrafts"],
            "supported_primary_categories": ["Home Decor"],
            "supported_subcategories": ["Handmade Crafts"],
            "supported_states": ["Rajasthan", "Tamil Nadu"],
            "min_capacity": 50,
            "max_capacity": 5000,
            "provides_logistics_support": True,
            "provides_catalog_support": True
        },
        {
            "snp_id": "SNP005",
            "snp_name": "FurniturePro Network",
            "supported_sectors": ["Manufacturing"],
            "supported_primary_categories": ["Furniture"],
            "supported_subcategories": ["Wooden Furniture"],
            "supported_states": ["Karnataka", "Tamil Nadu"],
            "min_capacity": 100,
            "max_capacity": 4000,
            "provides_logistics_support": False,
            "provides_catalog_support": True
        },
        {
            "snp_id": "SNP006",
            "snp_name": "BeautyKart Enablement",
            "supported_sectors": ["Manufacturing", "Retail"],
            "supported_primary_categories": ["Beauty"],
            "supported_subcategories": ["Cosmetics"],
            "supported_states": ["Delhi", "Maharashtra"],
            "min_capacity": 300,
            "max_capacity": 10000,
            "provides_logistics_support": True,
            "provides_catalog_support": True
        },
        {
            "snp_id": "SNP007",
            "snp_name": "SteelHome Supplies",
            "supported_sectors": ["Manufacturing"],
            "supported_primary_categories": ["Home Decor"],
            "supported_subcategories": ["Steel Utensils"],
            "supported_states": ["Gujarat", "Tamil Nadu"],
            "min_capacity": 200,
            "max_capacity": 7000,
            "provides_logistics_support": True,
            "provides_catalog_support": False
        },
        {
            "snp_id": "SNP008",
            "snp_name": "MachineryHub ONDC",
            "supported_sectors": ["Manufacturing"],
            "supported_primary_categories": ["Machinery"],
            "supported_subcategories": ["Steel Utensils"],
            "supported_states": ["Pan India"],
            "min_capacity": 50,
            "max_capacity": 2000,
            "provides_logistics_support": False,
            "provides_catalog_support": True
        },
        {
            "snp_id": "SNP009",
            "snp_name": "BuildMart Commerce",
            "supported_sectors": ["Manufacturing", "Retail"],
            "supported_primary_categories": ["Construction"],
            "supported_subcategories": ["Steel Utensils"],
            "supported_states": ["Karnataka", "Telangana"],
            "min_capacity": 500,
            "max_capacity": 15000,
            "provides_logistics_support": True,
            "provides_catalog_support": True
        },
        {
            "snp_id": "SNP010",
            "snp_name": "GroceryNation Partner",
            "supported_sectors": ["Retail", "Food Processing"],
            "supported_primary_categories": ["Grocery"],
            "supported_subcategories": ["Spices", "Snacks"],
            "supported_states": ["Pan India"],
            "min_capacity": 1000,
            "max_capacity": 50000,
            "provides_logistics_support": True,
            "provides_catalog_support": False
        },
        {
            "snp_id": "SNP011",
            "snp_name": "FloraCraft ONDC Partner",
            "supported_sectors": ["Agriculture", "Handicrafts"],
            "supported_primary_categories": ["Handicrafts"],
            "supported_subcategories": ["Handmade Crafts", "Garlands", "Flower Items"],
            "supported_states": ["Tamil Nadu", "Pan India"],
            "min_capacity": 10,
            "max_capacity": 2000,
            "provides_logistics_support": True,
            "provides_catalog_support": True
        }

    ]
}



async def is_state_supported(mse_state, snp_states):
    return mse_state in snp_states or "Pan India" in snp_states


async def calculate_capacity_score(mse_capacity, min_cap, max_cap):
    if not (min_cap <= mse_capacity <= max_cap):
        return 0

    midpoint = (min_cap + max_cap) / 2
    range_size = max_cap - min_cap

    if range_size == 0:
        return 10

    distance = abs(mse_capacity - midpoint)
    score = 10 * (1 - (distance / range_size))
    return max(score, 1)


# ==============================
# MATCHING ENGINE
# ==============================

async def match_snps(mse_profile, snps_data):
    results = []

    mse_sector = mse_profile.get("sector")
    mse_primary = mse_profile.get("primary_category")
    mse_sub = mse_profile.get("subcategory")
    mse_state = mse_profile.get("state")
    mse_capacity = mse_profile.get("monthly_capacity", 0)

    needs_logistics = mse_profile.get("logistics_support", "no").lower() == "yes"
    needs_catalog = mse_profile.get("catalog_support", "no").lower() == "yes"

    for snp in snps_data["snps"]:

        # HARD FILTERING
        if mse_sector not in snp["supported_sectors"]:
            continue

        if mse_primary not in snp["supported_primary_categories"]:
            continue

        if not await is_state_supported(mse_state, snp["supported_states"]):
            continue

        if not (snp["min_capacity"] <= mse_capacity <= snp["max_capacity"]):
            continue

        score = 0
        explanation = {}

        score += 25
        explanation["sector_match"] = True

        score += 20
        explanation["primary_category_match"] = True

        if mse_sub in snp["supported_subcategories"]:
            score += 15
            explanation["subcategory_match"] = True
        else:
            explanation["subcategory_match"] = False

        score += 15
        explanation["state_match"] = True

        cap_score = await calculate_capacity_score(
            mse_capacity,
            snp["min_capacity"],
            snp["max_capacity"]
        )
        score += cap_score
        explanation["capacity_score"] = round(cap_score, 2)

        if needs_logistics:
            if snp["provides_logistics_support"]:
                score += 10
                explanation["logistics_support"] = "Supported"
            else:
                score -= 10
                explanation["logistics_support"] = "Not Supported"
        else:
            explanation["logistics_support"] = "Not Required"

        if needs_catalog:
            if snp["provides_catalog_support"]:
                score += 5
                explanation["catalog_support"] = "Supported"
            else:
                score -= 5
                explanation["catalog_support"] = "Not Supported"
        else:
            explanation["catalog_support"] = "Not Required"

        results.append({
            "snp_id": snp["snp_id"],
            "snp_name": snp["snp_name"],
            "final_score": round(score, 2),
            "explanation": explanation
        })

    results = sorted(results, key=lambda x: x["final_score"], reverse=True)

    return results[:3]


async def recommend_snp(mse_input):
    logger.info("Inside SNP recommendation")
    try:
        matched = await match_snps(mse_input, SNPS_DATA)
        print(json.dumps({
            "recommended_snps": matched
        }, indent=4))
        logger.info("Succesfully found some SNP's")
        return matched
    except Exception as e:
        logger.error(f"Error while finding SNP's {str(e)}")
