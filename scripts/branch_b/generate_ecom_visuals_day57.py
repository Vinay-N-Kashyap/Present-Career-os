"""
Generate Gate v2 visual envelope for Day 57 (bcom_ecom).
Schema: schemaVersion: 1, prefix: 'bcom_ecom', day: 57, entries: 5
Captions: zero numeric digits (!/\\d/), period-terminated, length <= 75.
"""
import json
import hashlib
import os
import re

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
data_file = os.path.join(commerce_dir, "scripts", "branch_b", "day57_ecom_data.json")
visuals_dir = os.path.join(commerce_dir, "src", "lib", "data", "lessonVisuals", "bcom_ecom")
os.makedirs(visuals_dir, exist_ok=True)

with open(data_file, "r", encoding="utf-8") as f:
    day_data = json.load(f)

captions_day57 = [
    # Part 1
    {
        "intro": "Unified inventory engines aggregate real time enterprise stock pools.",
        "say1": "Dynamic safety stock buffers shield store inventories from walk ins.",
        "example": "Available to promise calculations reserve confirmed customer orders.",
        "tryIt": "Configured thresholds prevent online stockouts and phantom orders."
    },
    # Part 2
    {
        "intro": "Distributed order management evaluates multi node candidate paths.",
        "say1": "Single source routing filters identify complete package fulfillment.",
        "example": "Proximity and shipping cost ranking eliminates duplicate packages.",
        "tryIt": "Optimal fulfillment allocation slashes last mile parcel freight."
    },
    # Part 3
    {
        "intro": "In store mobile fulfillment systems guide associates through batches.",
        "say1": "Optimized walking paths streamline retail sales floor item picking.",
        "example": "Mandatory barcode scanning validates product size and color accuracy.",
        "tryIt": "Rapid packing and cartonization meet scheduled carrier pickup times."
    },
    # Part 4
    {
        "intro": "Store pickup workflows coordinate digital ordering with local staging.",
        "say1": "Geofencing triggers automated associate alerts upon vehicle arrival.",
        "example": "Express curbside handoffs complete delivery directly into vehicle trunks.",
        "tryIt": "In store returns restock inventory without reverse shipping costs."
    },
    # Part 5
    {
        "intro": "Omnichannel command towers track fleet wide store fulfillment metrics.",
        "say1": "Balanced ship from store volume shortens customer delivery transit times.",
        "example": "Low split shipment ratios maximize enterprise operating margins.",
        "tryIt": "Unified store operations achieve apex omnichannel certification."
    }
]

entries = []
for p_idx, part in enumerate(day_data["parts"]):
    code = part["code"]
    code_hash = hashlib.sha256(code.encode("utf-8")).hexdigest()
    caps = captions_day57[p_idx]
    
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
                "label": "Inventory Ingestion",
                "caption": caps["intro"],
                "data": {"stage": "intake", "status": "active"}
            },
            {
                "id": "say1",
                "label": "Buffer Allocation",
                "caption": caps["say1"],
                "data": {"stage": "allocation", "status": "processing"}
            },
            {
                "id": "example",
                "label": "Route Optimization",
                "caption": caps["example"],
                "data": {"stage": "routing", "status": "verified"}
            },
            {
                "id": "tryIt",
                "label": "Store Fulfillment",
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
    "day": 57,
    "entries": entries
}

out_path = os.path.join(visuals_dir, "day-57.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(visual_envelope, f, indent=2, ensure_ascii=False)

print(f"Generated Gate v2 visual envelope: {out_path}")
