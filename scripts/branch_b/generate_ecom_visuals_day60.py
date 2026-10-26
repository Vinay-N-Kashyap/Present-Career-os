"""
Generate Gate v2 visual envelope for Day 60 (bcom_ecom Grand Master Milestone 12 Capstone).
Schema: schemaVersion: 1, prefix: 'bcom_ecom', day: 60, entries: 5
Captions: zero numeric digits (!/\\d/), period-terminated, length <= 75.
"""
import json
import hashlib
import os
import re

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
data_file = os.path.join(commerce_dir, "scripts", "branch_b", "day60_ecom_data.json")
visuals_dir = os.path.join(commerce_dir, "src", "lib", "data", "lessonVisuals", "bcom_ecom")
os.makedirs(visuals_dir, exist_ok=True)

with open(data_file, "r", encoding="utf-8") as f:
    day_data = json.load(f)

captions_day60 = [
    # Part 1
    {
        "intro": "Payment orchestration platforms evaluate multi acquirer approval rates.",
        "say1": "Multi party escrow sub accounts hold merchant disbursements securely.",
        "example": "Automated delivery confirmations release verified seller disbursements.",
        "tryIt": "Integrated fraud engines eliminate unauthorized chargeback liabilities."
    },
    # Part 2
    {
        "intro": "Customs classification engines determine accurate destination tariffs.",
        "say1": "Compounded consumption tax bases ensure flawless duty paid arrivals.",
        "example": "Electronic duty drawback dossiers recover previously paid customs fees.",
        "tryIt": "Pre cleared air manifests deliver frictionless international fulfillment."
    },
    # Part 3
    {
        "intro": "Omnichannel routing engines calculate single source store availability.",
        "say1": "Localized store fulfillment slashes last mile parcel freight expenses.",
        "example": "In store mobile apps guide associates along optimal walking paths.",
        "tryIt": "Express curbside handoffs complete delivery directly into vehicle trunks."
    },
    # Part 4
    {
        "intro": "Streaming ingestion gateways validate incoming customer click events.",
        "say1": "Identity graph resolvers map anonymous cookies to authenticated accounts.",
        "example": "Predictive lifetime value models project future customer margins.",
        "tryIt": "Edge feature stores personalize shopping journeys with low latency."
    },
    # Part 5
    {
        "intro": "The grand master capstone board evaluates total enterprise commerce yield.",
        "say1": "Payment and trade optimization preserve multi million operating margins.",
        "example": "Omnichannel store fulfillment and data platforms maximize lifetime value.",
        "tryIt": "The defense certifies chief commerce technology officer grand master."
    }
]

entries = []
for p_idx, part in enumerate(day_data["parts"]):
    code = part["code"]
    code_hash = hashlib.sha256(code.encode("utf-8")).hexdigest()
    caps = captions_day60[p_idx]
    
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
                "label": "Trade & Logistics",
                "caption": caps["say1"],
                "data": {"stage": "tier2", "status": "processing"}
            },
            {
                "id": "example",
                "label": "Omnichannel Routing",
                "caption": caps["example"],
                "data": {"stage": "tier3", "status": "verified"}
            },
            {
                "id": "tryIt",
                "label": "Grand Defense",
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
    "day": 60,
    "entries": entries
}

out_path = os.path.join(visuals_dir, "day-60.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(visual_envelope, f, indent=2, ensure_ascii=False)

print(f"Generated Gate v2 visual envelope: {out_path}")
