"""
Generate Gate v2 visual envelope for Day 46 (bcom_ecom).
Schema: schemaVersion: 1, prefix: 'bcom_ecom', day: 46, entries: 5
Captions: zero numeric digits (!/\\d/), period-terminated, length <= 75.
"""
import json
import hashlib
import os
import re

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
data_file = os.path.join(commerce_dir, "scripts", "branch_b", "day46_ecom_data.json")
visuals_dir = os.path.join(commerce_dir, "src", "lib", "data", "lessonVisuals", "bcom_ecom")
os.makedirs(visuals_dir, exist_ok=True)

with open(data_file, "r", encoding="utf-8") as f:
    day_data = json.load(f)

captions_day46 = [
    # Part 1
    {
        "intro": "Inbound checkout transactions arrive at the payment orchestration layer.",
        "say1": "The orchestration layer canonicalizes payment request schemas.",
        "example": "Normalized payment tokens decouple the store from specific gateway lock in.",
        "tryIt": "Evaluating eligible payment gateways isolates the lowest cost option."
    },
    # Part 2
    {
        "intro": "Smart routing algorithms evaluate active merchant acquiring channels.",
        "say1": "Cost basis points and authorization success rates are dynamically weighed.",
        "example": "Transactions route to localized acquirers to boost authorization yield.",
        "tryIt": "Automated cascade sequences rank primary and secondary payment pipelines."
    },
    # Part 3
    {
        "intro": "Card credentials exchange directly for scheme network tokens.",
        "say1": "Network tokens carry dynamic single use cryptograms for card security.",
        "example": "Interchange qualification rates improve through network token acceptance.",
        "tryIt": "Automated account updater webhooks seamlessly refresh expired cards."
    },
    # Part 4
    {
        "intro": "Payment gateway circuit breakers monitor outbound connection health.",
        "say1": "Consecutive processor timeouts trip the circuit to divert live traffic.",
        "example": "Canary probes verify downstream gateway recovery before traffic resumes.",
        "tryIt": "Idempotent cascading retries transparently rescue soft decline events."
    },
    # Part 5
    {
        "intro": "Payment command towers consolidate telemetry across all acquiring banks.",
        "say1": "Dashboards monitor overall authorization rates and latency curves.",
        "example": "Cascaded recovery transactions reclaim otherwise lost checkout sales.",
        "tryIt": "Platform dispute ratios remain strictly beneath card scheme thresholds."
    }
]

entries = []
for p_idx, part in enumerate(day_data["parts"]):
    code = part["code"]
    code_hash = hashlib.sha256(code.encode("utf-8")).hexdigest()
    caps = captions_day46[p_idx]
    
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
                "label": "Ingestion",
                "caption": caps["intro"],
                "data": {"stage": "inbound", "status": "active"}
            },
            {
                "id": "say1",
                "label": "Processing",
                "caption": caps["say1"],
                "data": {"stage": "evaluation", "status": "processing"}
            },
            {
                "id": "example",
                "label": "Execution",
                "caption": caps["example"],
                "data": {"stage": "dispatch", "status": "success"}
            },
            {
                "id": "tryIt",
                "label": "Verification",
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
    "day": 46,
    "entries": entries
}

out_path = os.path.join(visuals_dir, "day-46.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(visual_envelope, f, indent=2, ensure_ascii=False)

print(f"Generated Gate v2 visual envelope: {out_path}")
