"""
Generate Gate v2 visual envelope for Day 51 (bcom_ecom).
Schema: schemaVersion: 1, prefix: 'bcom_ecom', day: 51, entries: 5
Captions: zero numeric digits (!/\\d/), period-terminated, length <= 75.
"""
import json
import hashlib
import os
import re

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
data_file = os.path.join(commerce_dir, "scripts", "branch_b", "day51_ecom_data.json")
visuals_dir = os.path.join(commerce_dir, "src", "lib", "data", "lessonVisuals", "bcom_ecom")
os.makedirs(visuals_dir, exist_ok=True)

with open(data_file, "r", encoding="utf-8") as f:
    day_data = json.load(f)

captions_day51 = [
    # Part 1
    {
        "intro": "Regional payment routers evaluate international market share metrics.",
        "say1": "Dominant local clearing methods are ranked by regional penetration.",
        "example": "Account to account rails eliminate card scheme cross border fees.",
        "tryIt": "Configurable catalogs prioritize preferred payment options per country."
    },
    # Part 2
    {
        "intro": "Multi currency engines ingest base catalog prices in domestic currency.",
        "say1": "Dynamic volatility buffers absorb foreign exchange rate fluctuations.",
        "example": "Psychological rounding rules produce clean localized retail price points.",
        "tryIt": "Edge workers inject converted currencies while preserving cache rates."
    },
    # Part 3
    {
        "intro": "Corporate treasury managers initiate rolling forward hedging contracts.",
        "say1": "Anticipated foreign sales volumes are pre sold at guaranteed rates.",
        "example": "Hedging gains protect operating profit when foreign currencies drop.",
        "tryIt": "Automated algorithmic sweeps repatriate surplus cash into base balances."
    },
    # Part 4
    {
        "intro": "Guaranteed quote lock sessions freeze exchange rates during checkout.",
        "say1": "Locked quotes prevent price slippage between browsing and payment.",
        "example": "Localized checkout forms capture mandatory regional tax identifiers.",
        "tryIt": "Session validators refresh quotes smoothly after lock windows expire."
    },
    # Part 5
    {
        "intro": "Global checkout command towers monitor international sales corridors.",
        "say1": "Localized payment rails drive superior cross border conversion yield.",
        "example": "Captured currency volatility buffers generate healthy operating margin.",
        "tryIt": "Treasury audits verify minimal settlement slippage across global rails."
    }
]

entries = []
for p_idx, part in enumerate(day_data["parts"]):
    code = part["code"]
    code_hash = hashlib.sha256(code.encode("utf-8")).hexdigest()
    caps = captions_day51[p_idx]
    
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
                "label": "Market Ingestion",
                "caption": caps["intro"],
                "data": {"stage": "inbound", "status": "active"}
            },
            {
                "id": "say1",
                "label": "FX Valuation",
                "caption": caps["say1"],
                "data": {"stage": "pricing", "status": "processing"}
            },
            {
                "id": "example",
                "label": "Quote Locking",
                "caption": caps["example"],
                "data": {"stage": "hedging", "status": "verified"}
            },
            {
                "id": "tryIt",
                "label": "Settlement",
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
    "day": 51,
    "entries": entries
}

out_path = os.path.join(visuals_dir, "day-51.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(visual_envelope, f, indent=2, ensure_ascii=False)

print(f"Generated Gate v2 visual envelope: {out_path}")
