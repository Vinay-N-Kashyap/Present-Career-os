"""
Generate Gate v2 visual envelope for Day 50 (bcom_ecom).
Schema: schemaVersion: 1, prefix: 'bcom_ecom', day: 50, entries: 5
Captions: zero numeric digits (!/\\d/), period-terminated, length <= 75.
"""
import json
import hashlib
import os
import re

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
data_file = os.path.join(commerce_dir, "scripts", "branch_b", "day50_ecom_data.json")
visuals_dir = os.path.join(commerce_dir, "src", "lib", "data", "lessonVisuals", "bcom_ecom")
os.makedirs(visuals_dir, exist_ok=True)

with open(data_file, "r", encoding="utf-8") as f:
    day_data = json.load(f)

captions_day50 = [
    # Part 1
    {
        "intro": "The tier one audit evaluates payment orchestration layer performance.",
        "say1": "Smart routing across acquiring partners optimizes authorization yield.",
        "example": "Network token adoption drives substantial interchange margin savings.",
        "tryIt": "Automated circuit breakers confirm high availability failover health."
    },
    # Part 2
    {
        "intro": "The tier two audit inspects multi party marketplace split calculations.",
        "say1": "Segregated custodial accounts prevent corporate fund co mingling.",
        "example": "Rolling reserves maintain dispute coverage against merchant default.",
        "tryIt": "Three way reconciliations confirm zero balance sheet variance."
    },
    # Part 3
    {
        "intro": "The tier three audit reviews machine learning fraud risk scoring.",
        "say1": "Hardware entropy harvesting and behavioral biometrics unmask bots.",
        "example": "Modern authentication protocols maximize frictionless checkout flow.",
        "tryIt": "Statutory liability shifts protect merchant margins from chargebacks."
    },
    # Part 4
    {
        "intro": "The tier four audit examines automated chargeback litigation pipelines.",
        "say1": "Compelling evidence matching deflects friendly fraud pre dispute.",
        "example": "Structured digital dossiers substantiate legitimate delivery proofs.",
        "tryIt": "High representment win rates recover substantial disputed capital."
    },
    # Part 5
    {
        "intro": "The sovereign boardroom defense synthesizes all four audit tiers.",
        "say1": "Enterprise return on investment combines savings and fraud deflection.",
        "example": "Perfect scorecard marks confirm institutional regulatory standing.",
        "tryIt": "The corporate boardroom confers chief payment and risk accreditation."
    }
]

entries = []
for p_idx, part in enumerate(day_data["parts"]):
    code = part["code"]
    code_hash = hashlib.sha256(code.encode("utf-8")).hexdigest()
    caps = captions_day50[p_idx]
    
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
                "label": "Audit Review",
                "caption": caps["intro"],
                "data": {"stage": "inbound", "status": "active"}
            },
            {
                "id": "say1",
                "label": "Verification",
                "caption": caps["say1"],
                "data": {"stage": "telemetry", "status": "processing"}
            },
            {
                "id": "example",
                "label": "Accreditation",
                "caption": caps["example"],
                "data": {"stage": "defense", "status": "verified"}
            },
            {
                "id": "tryIt",
                "label": "Conferral",
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
    "day": 50,
    "entries": entries
}

out_path = os.path.join(visuals_dir, "day-50.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(visual_envelope, f, indent=2, ensure_ascii=False)

print(f"Generated Gate v2 visual envelope: {out_path}")
