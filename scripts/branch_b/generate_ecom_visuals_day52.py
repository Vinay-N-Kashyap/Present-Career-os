"""
Generate Gate v2 visual envelope for Day 52 (bcom_ecom).
Schema: schemaVersion: 1, prefix: 'bcom_ecom', day: 52, entries: 5
Captions: zero numeric digits (!/\\d/), period-terminated, length <= 75.
"""
import json
import hashlib
import os
import re

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
data_file = os.path.join(commerce_dir, "scripts", "branch_b", "day52_ecom_data.json")
visuals_dir = os.path.join(commerce_dir, "src", "lib", "data", "lessonVisuals", "bcom_ecom")
os.makedirs(visuals_dir, exist_ok=True)

with open(data_file, "r", encoding="utf-8") as f:
    day_data = json.load(f)

captions_day52 = [
    # Part 1
    {
        "intro": "Landed cost calculation engines model international customs valuations.",
        "say1": "Freight and insurance allocations establish the dutiable valuation base.",
        "example": "Compounding customs duties and import taxes are calculated precisely.",
        "tryIt": "All inclusive landed cost figures eliminate post shipment fee variances."
    },
    # Part 2
    {
        "intro": "Harmonized tariff schedules classify physical merchandise commodities.",
        "say1": "National tariff lines determine specific statutory import duty rates.",
        "example": "Rules of origin under trade agreements unlock preferential duty rates.",
        "tryIt": "Automated classification registries verify tariff eligibility rules."
    },
    # Part 3
    {
        "intro": "Incoterms decision routers evaluate cross border fulfillment models.",
        "say1": "Delivered duty paid terms collect all duties and taxes at checkout.",
        "example": "Pre cleared customs shipments prevent unexpected doorstep collections.",
        "tryIt": "Eliminating surprise delivery surcharges collapses parcel refusal rates."
    },
    # Part 4
    {
        "intro": "Customs documentation generators produce structured export manifests.",
        "say1": "Paperless trade integrations transmit commercial invoices electronically.",
        "example": "High value export consignments trigger automated statutory filings.",
        "tryIt": "Electronic export documentation accelerates international air clearance."
    },
    # Part 5
    {
        "intro": "Trade compliance command towers screen international consignments.",
        "say1": "Real time watchlists intercept prohibited parties before dispatch.",
        "example": "Continuous audits defend low landed cost quote billing variances.",
        "tryIt": "Comprehensive trade reviews confer official trade compliance status."
    }
]

entries = []
for p_idx, part in enumerate(day_data["parts"]):
    code = part["code"]
    code_hash = hashlib.sha256(code.encode("utf-8")).hexdigest()
    caps = captions_day52[p_idx]
    
    # Verify captions
    for k, cap in caps.items():
        assert not re.search(r'\d', cap), f"Digit found in {p_idx+1} {k}: {cap}"
        assert cap.endswith('.'), f"Missing period in {p_idx+1} {k}: {cap}"
        assert len(cap) <= 75, f"Caption > 75 chars ({len(cap)}) in {p_idx+1} {k}: {cap}"
    
    spec = {
        "template": "funnel",
        "title": part["title"],
        "steps": [
            {
                "id": "intro",
                "label": "Customs Assessment",
                "caption": caps["intro"],
                "data": {"stage": "inbound", "status": "active"}
            },
            {
                "id": "say1",
                "label": "Tariff Resolution",
                "caption": caps["say1"],
                "data": {"stage": "valuation", "status": "processing"}
            },
            {
                "id": "example",
                "label": "Clearance Execution",
                "caption": caps["example"],
                "data": {"stage": "documentation", "status": "verified"}
            },
            {
                "id": "tryIt",
                "label": "Compliance Audit",
                "caption": caps["tryIt"],
                "data": {"stage": "certified", "status": "complete"}
            }
        ]
    }
    
    entries.append({
        "partTitle": part["title"],
        "codeHash": code_hash,
        "spec": spec
    })

visual_envelope = {
    "schemaVersion": 1,
    "prefix": "bcom_ecom",
    "day": 52,
    "entries": entries
}

out_path = os.path.join(visuals_dir, "day-52.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(visual_envelope, f, indent=2, ensure_ascii=False)

print(f"Generated Gate v2 visual envelope: {out_path}")
