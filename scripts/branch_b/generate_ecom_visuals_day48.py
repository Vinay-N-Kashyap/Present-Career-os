"""
Generate Gate v2 visual envelope for Day 48 (bcom_ecom).
Schema: schemaVersion: 1, prefix: 'bcom_ecom', day: 48, entries: 5
Captions: zero numeric digits (!/\\d/), period-terminated, length <= 75.
"""
import json
import hashlib
import os
import re

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
data_file = os.path.join(commerce_dir, "scripts", "branch_b", "day48_ecom_data.json")
visuals_dir = os.path.join(commerce_dir, "src", "lib", "data", "lessonVisuals", "bcom_ecom")
os.makedirs(visuals_dir, exist_ok=True)

with open(data_file, "r", encoding="utf-8") as f:
    day_data = json.load(f)

captions_day48 = [
    # Part 1
    {
        "intro": "Inbound transactions undergo real time velocity anomaly detection.",
        "say1": "Sliding time windows monitor card attempt frequency and IP bursts.",
        "example": "Rapid card rotations trigger automated account takeover alarms.",
        "tryIt": "Configurable velocity thresholds isolate automated card testing runs."
    },
    # Part 2
    {
        "intro": "Client browser environments emit deep hardware entropy signals.",
        "say1": "Canvas rendering and graphics card drivers construct unique signatures.",
        "example": "Emulated rendering environments unmask automated headless browsers.",
        "tryIt": "Behavioral biometrics measure natural physical keystroke dynamics."
    },
    # Part 3
    {
        "intro": "Machine learning risk scoring ensembles ingest hundreds of features.",
        "say1": "Gradient boosted trees calculate calibrated fraud probabilities.",
        "example": "Graph networks detect distributed syndicates across linked entities.",
        "tryIt": "Calibrated risk scores drive dynamic multi tier decision frontiers."
    },
    # Part 4
    {
        "intro": "Modern secure authentication protocols evaluate cardholder risk profiles.",
        "say1": "Issuer risk engines permit frictionless background authentication flows.",
        "example": "Elevated transaction risks trigger native responsive mobile challenges.",
        "tryIt": "Successful authentication transfers chargeback liability to card issuers."
    },
    # Part 5
    {
        "intro": "Anti fraud command towers balance loss prevention against conversion.",
        "say1": "Defending low false positive ratios prevents legitimate customer loss.",
        "example": "Pre dispute deflection networks resolve inquiries before chargebacks.",
        "tryIt": "Comprehensive risk audits confer official fraud defense accreditation."
    }
]

entries = []
for p_idx, part in enumerate(day_data["parts"]):
    code = part["code"]
    code_hash = hashlib.sha256(code.encode("utf-8")).hexdigest()
    caps = captions_day48[p_idx]
    
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
                "label": "Analysis",
                "caption": caps["say1"],
                "data": {"stage": "entropy", "status": "processing"}
            },
            {
                "id": "example",
                "label": "Evaluation",
                "caption": caps["example"],
                "data": {"stage": "scoring", "status": "evaluated"}
            },
            {
                "id": "tryIt",
                "label": "Decision",
                "caption": caps["tryIt"],
                "data": {"stage": "verdict", "status": "complete"}
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
    "day": 48,
    "entries": entries
}

out_path = os.path.join(visuals_dir, "day-48.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(visual_envelope, f, indent=2, ensure_ascii=False)

print(f"Generated Gate v2 visual envelope: {out_path}")
