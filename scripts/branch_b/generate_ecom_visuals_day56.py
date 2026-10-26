"""
Generate Gate v2 visual envelope for Day 56 (bcom_ecom).
Schema: schemaVersion: 1, prefix: 'bcom_ecom', day: 56, entries: 5
Captions: zero numeric digits (!/\\d/), period-terminated, length <= 75.
"""
import json
import hashlib
import os
import re

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
data_file = os.path.join(commerce_dir, "scripts", "branch_b", "day56_ecom_data.json")
visuals_dir = os.path.join(commerce_dir, "src", "lib", "data", "lessonVisuals", "bcom_ecom")
os.makedirs(visuals_dir, exist_ok=True)

with open(data_file, "r", encoding="utf-8") as f:
    day_data = json.load(f)

captions_day56 = [
    # Part 1
    {
        "intro": "Automated onboarding gates ingest prospective merchant identity data.",
        "say1": "Real time sanctions screening filters entities against watchlists.",
        "example": "Corporate registries verify active business legal standing records.",
        "tryIt": "Verified banking verification unlocks approved merchant selling access."
    },
    # Part 2
    {
        "intro": "Seller scorecards calculate rolling order defect rate indicators.",
        "say1": "Carrier acceptance scans track physical dispatch SLA timestamps.",
        "example": "Defect rates below statutory limits preserve merchant account health.",
        "tryIt": "Automated warnings notify sellers of operational defect thresholds."
    },
    # Part 3
    {
        "intro": "Dynamic buy box ranking engines evaluate competitive merchant offers.",
        "say1": "Landed pricing combines base merchandise with domestic shipping cost.",
        "example": "Fast delivery transit and positive feedback score higher rankings.",
        "tryIt": "Winning offers capture prime placement on product catalog storefronts."
    },
    # Part 4
    {
        "intro": "Suspension state machines hold listings upon operational SLA breaches.",
        "say1": "Transparent statements of reasons communicate detailed failure causes.",
        "example": "Structured plans of action detail permanent operational corrections.",
        "tryIt": "Approved remediation dossiers restore normal selling authorization."
    },
    # Part 5
    {
        "intro": "Marketplace command towers monitor global merchant operational health.",
        "say1": "Fleet defect rates remain below strict consumer protection targets.",
        "example": "High buy box health preserves customer checkout conversion velocity.",
        "tryIt": "Rapid appeal resolution maintains fair merchant platform relationships."
    }
]

entries = []
for p_idx, part in enumerate(day_data["parts"]):
    code = part["code"]
    code_hash = hashlib.sha256(code.encode("utf-8")).hexdigest()
    caps = captions_day56[p_idx]
    
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
                "label": "Identity Ingestion",
                "caption": caps["intro"],
                "data": {"stage": "intake", "status": "active"}
            },
            {
                "id": "say1",
                "label": "Sanctions Verification",
                "caption": caps["say1"],
                "data": {"stage": "audit", "status": "processing"}
            },
            {
                "id": "example",
                "label": "Performance Scoring",
                "caption": caps["example"],
                "data": {"stage": "evaluation", "status": "verified"}
            },
            {
                "id": "tryIt",
                "label": "Listing Activation",
                "caption": caps["tryIt"],
                "data": {"stage": "settlement", "status": "complete"}
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
    "day": 56,
    "entries": entries
}

out_path = os.path.join(visuals_dir, "day-56.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(visual_envelope, f, indent=2, ensure_ascii=False)

print(f"Generated Gate v2 visual envelope: {out_path}")
