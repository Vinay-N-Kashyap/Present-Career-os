import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/branch_b/day58_ecom_data.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

# Update Part 2 code with 123456789015
p2_code = '''from dataclasses import dataclass
from typing import Dict, Optional

def verify_gs1_gtin_check_digit(gtin: str) -> bool:
    if not gtin.isdigit() or len(gtin) not in (8, 12, 13, 14):
        return False
    digits = [int(d) for d in gtin]
    check = digits[-1]
    payload = digits[:-1]
    
    total = 0
    for idx, d in enumerate(reversed(payload)):
        weight = 3 if idx % 2 == 0 else 1
        total += d * weight
    calculated_check = (10 - (total % 10)) % 10
    return calculated_check == check

@dataclass
class CanonicalMasterProduct:
    master_product_id: str
    gtin: str
    canonical_title: str
    active_sellers_count: int

class MasterProductDeduplicationEngine:
    def __init__(self):
        self.catalog_by_gtin: Dict[str, CanonicalMasterProduct] = {}

    def resolve_listing(self, gtin: str, seller_title: str) -> Dict[str, any]:
        if not verify_gs1_gtin_check_digit(gtin):
            return {"status": "REJECTED_INVALID_GS1_CHECK_DIGIT", "master_id": None}

        if gtin in self.catalog_by_gtin:
            prod = self.catalog_by_gtin[gtin]
            prod.active_sellers_count += 1
            return {
                "status": "CONSOLIDATED_TO_EXISTING_MASTER_PRODUCT",
                "master_id": prod.master_product_id,
                "canonical_title": prod.canonical_title,
                "active_sellers": prod.active_sellers_count
            }
        else:
            new_id = f"MASTER-{gtin[:8]}"
            new_prod = CanonicalMasterProduct(new_id, gtin, seller_title, 1)
            self.catalog_by_gtin[gtin] = new_prod
            return {
                "status": "CREATED_NEW_MASTER_PRODUCT",
                "master_id": new_id,
                "canonical_title": seller_title,
                "active_sellers": 1
            }

engine = MasterProductDeduplicationEngine()
res1 = engine.resolve_listing("019425200193", "Sony WH-1000XM5 Headset Black")
res2 = engine.resolve_listing("019425200193", "Sony WH1000XM5 Wireless Headphones")
res3 = engine.resolve_listing("123456789015", "Fake Counterfeit Item")

print(f"Listing 1 (Seller A): {res1['status']} -> {res1['master_id']} (Sellers: {res1['active_sellers']})")
print(f"Listing 2 (Seller B): {res2['status']} -> {res2['master_id']} (Sellers: {res2['active_sellers']})")
print(f"Listing 3 (Bad GTIN): {res3['status']}")'''

p2_output = '''Listing 1 (Seller A): CREATED_NEW_MASTER_PRODUCT -> MASTER-01942520 (Sellers: 1)
Listing 2 (Seller B): CONSOLIDATED_TO_EXISTING_MASTER_PRODUCT -> MASTER-01942520 (Sellers: 2)
Listing 3 (Bad GTIN): REJECTED_INVALID_GS1_CHECK_DIGIT'''

d['parts'][1]['code'] = p2_code
d['parts'][1]['output'] = p2_output

with open('scripts/branch_b/day58_ecom_data.json', 'w', encoding='utf-8') as f:
    json.dump(d, f, indent=2, ensure_ascii=False)

print("Updated Day 58 Part 2.")
