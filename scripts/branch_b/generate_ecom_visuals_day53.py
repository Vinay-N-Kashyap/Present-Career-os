"""
Generate Gate v2 visual envelope for Day 53 (bcom_ecom).
Schema: schemaVersion: 1, prefix: 'bcom_ecom', day: 53, entries: 5
Captions: zero numeric digits (!/\\d/), period-terminated, length <= 75.
"""
import json
import hashlib
import os
import re

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
data_file = os.path.join(commerce_dir, "scripts", "branch_b", "day53_ecom_data.json")
visuals_dir = os.path.join(commerce_dir, "src", "lib", "data", "lessonVisuals", "bcom_ecom")
os.makedirs(visuals_dir, exist_ok=True)

with open(data_file, "r", encoding="utf-8") as f:
    day_data = json.load(f)

captions_day53 = [
    # Part 1
    {
        "intro": "De minimis valuation rules evaluate national customs exemption ceilings.",
        "say1": "Low value consignments enter destination countries free of customs tariffs.",
        "example": "Centralized tax portals streamline low value tax remittance schedules.",
        "tryIt": "Configurable threshold matrices route international parcels compliantly."
    },
    # Part 2
    {
        "intro": "Customs bonded warehouses defer import tariffs until domestic entry.",
        "say1": "Foreign trade zones permit raw component assembly and kitting inside.",
        "example": "Inverted tariff rules yield massive savings on finished goods entry.",
        "tryIt": "Consolidated weekly entry filings slash customs administrative overhead."
    },
    # Part 3
    {
        "intro": "International line haul logistics evaluate postal versus air injection.",
        "say1": "Chartered air cargo flights pre clear customs manifests while airborne.",
        "example": "Airport gateway cross docks inject parcels directly into domestic hubs.",
        "tryIt": "Commercial direct injection achieves express global delivery speeds."
    },
    # Part 4
    {
        "intro": "Dynamic global sourcing allocators analyze individual stock turnover rates.",
        "say1": "Fast moving merchandise forward deploys into regional fulfillment hubs.",
        "example": "Long tail specialty items fulfill via centralized direct air flights.",
        "tryIt": "Hybrid inventory placement models balance speed against holding expense."
    },
    # Part 5
    {
        "intro": "Global logistics command towers monitor cross border fulfillment health.",
        "say1": "High de minimis utilization yields eliminate excessive customs duties.",
        "example": "Pre cleared air cargo manifests maintain rapid customs clearance velocity.",
        "tryIt": "Continuous logistics audits confer official global fulfillment status."
    }
]

entries = []
for p_idx, part in enumerate(day_data["parts"]):
    code = part["code"]
    code_hash = hashlib.sha256(code.encode("utf-8")).hexdigest()
    caps = captions_day53[p_idx]
    
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
                "label": "Consignment Profiling",
                "caption": caps["intro"],
                "data": {"stage": "inbound", "status": "active"}
            },
            {
                "id": "say1",
                "label": "Line-Haul Routing",
                "caption": caps["say1"],
                "data": {"stage": "routing", "status": "processing"}
            },
            {
                "id": "example",
                "label": "Customs Injection",
                "caption": caps["example"],
                "data": {"stage": "customs", "status": "verified"}
            },
            {
                "id": "tryIt",
                "label": "Delivery Hand-off",
                "caption": caps["tryIt"],
                "data": {"stage": "fulfillment", "status": "complete"}
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
    "day": 53,
    "entries": entries
}

out_path = os.path.join(visuals_dir, "day-53.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(visual_envelope, f, indent=2, ensure_ascii=False)

print(f"Generated Gate v2 visual envelope: {out_path}")
