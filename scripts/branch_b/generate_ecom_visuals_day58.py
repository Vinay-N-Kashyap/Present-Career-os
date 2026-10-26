"""
Generate Gate v2 visual envelope for Day 58 (bcom_ecom).
Schema: schemaVersion: 1, prefix: 'bcom_ecom', day: 58, entries: 5
Captions: zero numeric digits (!/\\d/), period-terminated, length <= 75.
"""
import json
import hashlib
import os
import re

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
data_file = os.path.join(commerce_dir, "scripts", "branch_b", "day58_ecom_data.json")
visuals_dir = os.path.join(commerce_dir, "src", "lib", "data", "lessonVisuals", "bcom_ecom")
os.makedirs(visuals_dir, exist_ok=True)

with open(data_file, "r", encoding="utf-8") as f:
    day_data = json.load(f)

captions_day58 = [
    # Part 1
    {
        "intro": "Streaming ingestion gateways validate incoming customer click events.",
        "say1": "Strict schema registries reject unregistered payloads into error queues.",
        "example": "Validated event messages publish onto high throughput streaming topics.",
        "tryIt": "Partition keys guarantee chronological in order processing for profiles."
    },
    # Part 2
    {
        "intro": "Identity graph resolvers map anonymous cookies to authenticated accounts.",
        "say1": "Deterministic linkages execute atomic graph merges upon email capture.",
        "example": "Cross device touchpoints collapse into unified master customer profiles.",
        "tryIt": "Consolidated customer state replicates to edge caches with low latency."
    },
    # Part 3
    {
        "intro": "Behavioral models score customer recency frequency and monetary spend.",
        "say1": "Dynamic percentile thresholds classify shoppers into actionable cohorts.",
        "example": "High value loyalists receive exclusive early access promotional drops.",
        "tryIt": "Automated retention campaigns re engage dormant shoppers before churn."
    },
    # Part 4
    {
        "intro": "Predictive algorithms model future customer purchase frequency and churn.",
        "say1": "Stochastic process models project long term customer contribution margin.",
        "example": "Discounted cash flow formulations evaluate multi year customer value.",
        "tryIt": "Value based advertising bidding targets high predicted lifetime value."
    },
    # Part 5
    {
        "intro": "Customer data observatories track identity match rates across channels.",
        "say1": "Low edge sync latency delivers instantaneous real time personalization.",
        "example": "Machine learning recommendation engines drive direct revenue expansion.",
        "tryIt": "Omnichannel behavioral intelligence certifies apex platform status."
    }
]

entries = []
for p_idx, part in enumerate(day_data["parts"]):
    code = part["code"]
    code_hash = hashlib.sha256(code.encode("utf-8")).hexdigest()
    caps = captions_day58[p_idx]
    
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
                "label": "Event Ingestion",
                "caption": caps["intro"],
                "data": {"stage": "intake", "status": "active"}
            },
            {
                "id": "say1",
                "label": "Identity Mapping",
                "caption": caps["say1"],
                "data": {"stage": "resolution", "status": "processing"}
            },
            {
                "id": "example",
                "label": "Cohort Segmentation",
                "caption": caps["example"],
                "data": {"stage": "segmentation", "status": "verified"}
            },
            {
                "id": "tryIt",
                "label": "Predictive Scoring",
                "caption": caps["tryIt"],
                "data": {"stage": "activation", "status": "complete"}
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
    "day": 58,
    "entries": entries
}

out_path = os.path.join(visuals_dir, "day-58.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(visual_envelope, f, indent=2, ensure_ascii=False)

print(f"Generated Gate v2 visual envelope: {out_path}")
