"""
Generate Gate v2 visual envelope for Day 59 (bcom_ecom).
Schema: schemaVersion: 1, prefix: 'bcom_ecom', day: 59, entries: 5
Captions: zero numeric digits (!/\\d/), period-terminated, length <= 75.
"""
import json
import hashlib
import os
import re

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
data_file = os.path.join(commerce_dir, "scripts", "branch_b", "day59_ecom_data.json")
visuals_dir = os.path.join(commerce_dir, "src", "lib", "data", "lessonVisuals", "bcom_ecom")
os.makedirs(visuals_dir, exist_ok=True)

with open(data_file, "r", encoding="utf-8") as f:
    day_data = json.load(f)

captions_day59 = [
    # Part 1
    {
        "intro": "Architecture strategy engines evaluate modular composability indexes.",
        "say1": "High scale and customization demands favor decoupled microservices.",
        "example": "Modular service boundaries eliminate monolithic deployment friction.",
        "tryIt": "Configured matrices recommend optimal enterprise architectural styles."
    },
    # Part 2
    {
        "intro": "Intelligent routing gateways manage incremental platform modernization.",
        "say1": "Canary traffic controllers route percentage slices to modern endpoints.",
        "example": "Decoupled domain migrations proceed without downtime or service breaks.",
        "tryIt": "Fallback routing rules preserve legacy monolith stability during cutovers."
    },
    # Part 3
    {
        "intro": "Total cost of ownership financial models compare platform architectures.",
        "say1": "Consumption software subscriptions lower fixed recurring annual costs.",
        "example": "Elastic serverless cloud hosting eliminates idle compute waste.",
        "tryIt": "Decoupled software architectures generate massive multi year savings."
    },
    # Part 4
    {
        "intro": "High concurrency scalability models evaluate peak holiday surge volumes.",
        "say1": "Global edge caching terminates static read traffic at the perimeter.",
        "example": "Asynchronous queue buffers protect transactional databases from load.",
        "tryIt": "Surge resilient systems maintain healthy compute capacity headroom."
    },
    # Part 5
    {
        "intro": "Architecture command towers monitor enterprise microservice portfolios.",
        "say1": "Rapid incident recovery maintains uninterrupted global retail uptime.",
        "example": "Migration milestones track decoupling velocity toward modern stacks.",
        "tryIt": "Disciplined architecture governance certifies apex enterprise status."
    }
]

entries = []
for p_idx, part in enumerate(day_data["parts"]):
    code = part["code"]
    code_hash = hashlib.sha256(code.encode("utf-8")).hexdigest()
    caps = captions_day59[p_idx]
    
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
                "label": "Strategy Evaluation",
                "caption": caps["intro"],
                "data": {"stage": "evaluation", "status": "active"}
            },
            {
                "id": "say1",
                "label": "Architecture Analysis",
                "caption": caps["say1"],
                "data": {"stage": "analysis", "status": "processing"}
            },
            {
                "id": "example",
                "label": "Migration Routing",
                "caption": caps["example"],
                "data": {"stage": "migration", "status": "verified"}
            },
            {
                "id": "tryIt",
                "label": "Scalability Verification",
                "caption": caps["tryIt"],
                "data": {"stage": "governance", "status": "complete"}
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
    "day": 59,
    "entries": entries
}

out_path = os.path.join(visuals_dir, "day-59.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(visual_envelope, f, indent=2, ensure_ascii=False)

print(f"Generated Gate v2 visual envelope: {out_path}")
