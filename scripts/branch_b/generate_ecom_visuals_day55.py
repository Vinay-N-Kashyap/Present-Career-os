"""
Generate Gate v2 visual envelope for Day 55 (bcom_ecom Milestone 11 Capstone).
Schema: schemaVersion: 1, prefix: 'bcom_ecom', day: 55, entries: 5
Captions: zero numeric digits (!/\\d/), period-terminated, length <= 75.
"""
import json
import hashlib
import os
import re

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
data_file = os.path.join(commerce_dir, "scripts", "branch_b", "day55_ecom_data.json")
visuals_dir = os.path.join(commerce_dir, "src", "lib", "data", "lessonVisuals", "bcom_ecom")
os.makedirs(visuals_dir, exist_ok=True)

with open(data_file, "r", encoding="utf-8") as f:
    day_data = json.load(f)

captions_day55 = [
    # Part 1
    {
        "intro": "Treasury pricing systems monitor foreign exchange market volatility.",
        "say1": "Institutional forward contracts lock in guaranteed conversion rates.",
        "example": "Localized psychological rounding preserves catalog price stability.",
        "tryIt": "Automated liquidity sweeping routines shield balance sheet margins."
    },
    # Part 2
    {
        "intro": "Algorithmic classification maps products to destination customs tariffs.",
        "say1": "Penny perfect landed cost engines calculate destination value added tax.",
        "example": "Compounded tax bases prevent retroactive customs audit liabilities.",
        "tryIt": "Prepaid duty clearance delivers frictionless doorstep parcel arrivals."
    },
    # Part 3
    {
        "intro": "Logistics routers evaluate national statutory de minimis thresholds.",
        "say1": "Chartered direct air flights inject low value parcels tariff free.",
        "example": "Bonded warehousing defers duty until domestic commercial entry.",
        "tryIt": "Consolidated weekly entries slash administrative customs expenses."
    },
    # Part 4
    {
        "intro": "Automated return portals enforce statutory cooling off withdrawal rights.",
        "say1": "Electronic duty drawback dossiers recover previously paid customs fees.",
        "example": "Destination tax credits offset open value added tax balance sheets.",
        "tryIt": "Decoupled edge privacy gates guarantee sovereign data protection."
    },
    # Part 5
    {
        "intro": "The executive capstone board evaluates total global commerce yield.",
        "say1": "Foreign exchange hedging and tariff avoidance preserve operating capital.",
        "example": "Automated duty drawback and tax credits deliver massive annual savings.",
        "tryIt": "The defense certifies chief global commerce architect accreditation."
    }
]

entries = []
for p_idx, part in enumerate(day_data["parts"]):
    code = part["code"]
    code_hash = hashlib.sha256(code.encode("utf-8")).hexdigest()
    caps = captions_day55[p_idx]
    
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
                "label": "Synthesis Intake",
                "caption": caps["intro"],
                "data": {"stage": "tier1", "status": "active"}
            },
            {
                "id": "say1",
                "label": "Customs Evaluation",
                "caption": caps["say1"],
                "data": {"stage": "tier2", "status": "processing"}
            },
            {
                "id": "example",
                "label": "Regulatory Verification",
                "caption": caps["example"],
                "data": {"stage": "tier3", "status": "verified"}
            },
            {
                "id": "tryIt",
                "label": "Executive Defense",
                "caption": caps["tryIt"],
                "data": {"stage": "accreditation", "status": "complete"}
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
    "day": 55,
    "entries": entries
}

out_path = os.path.join(visuals_dir, "day-55.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(visual_envelope, f, indent=2, ensure_ascii=False)

print(f"Generated Gate v2 visual envelope: {out_path}")
