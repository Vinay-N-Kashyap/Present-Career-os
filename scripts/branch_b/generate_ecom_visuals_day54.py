"""
Generate Gate v2 visual envelope for Day 54 (bcom_ecom).
Schema: schemaVersion: 1, prefix: 'bcom_ecom', day: 54, entries: 5
Captions: zero numeric digits (!/\\d/), period-terminated, length <= 75.
"""
import json
import hashlib
import os
import re

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
data_file = os.path.join(commerce_dir, "scripts", "branch_b", "day54_ecom_data.json")
visuals_dir = os.path.join(commerce_dir, "src", "lib", "data", "lessonVisuals", "bcom_ecom")
os.makedirs(visuals_dir, exist_ok=True)

with open(data_file, "r", encoding="utf-8") as f:
    day_data = json.load(f)

captions_day54 = [
    # Part 1
    {
        "intro": "Statutory withdrawal engines evaluate international return eligibility.",
        "say1": "Mandatory cooling off directives enforce unconditional return policies.",
        "example": "Unsealed hygiene items trigger statutory return policy exemptions.",
        "tryIt": "Automated return portals issue compliant labels and statutory notices."
    },
    # Part 2
    {
        "intro": "Duty drawback calculators track original import entry declarations.",
        "say1": "Verified re exportations unlock statutory customs tariff refunds.",
        "example": "Cross border returns re claim paid value added tax assessments.",
        "tryIt": "Electronic drawback dossiers eliminate margin leaks on returned units."
    },
    # Part 3
    {
        "intro": "Regional privacy validators enforce jurisdictional consent mandates.",
        "say1": "Transnational data pipelines require verified contractual protections.",
        "example": "Non essential tracking scripts halt pending explicit consumer opt in.",
        "tryIt": "Decoupled privacy gates route customer profiles into sovereign zones."
    },
    # Part 4
    {
        "intro": "Internationalization formatters configure localized typographic styles.",
        "say1": "Bidirectional text wrappers protect complex scripts from layout shift.",
        "example": "Locale aware rules position currency symbols and numeric separators.",
        "tryIt": "Culturally native presentation layers boost global checkout confidence."
    },
    # Part 5
    {
        "intro": "Governance command towers monitor cross border fulfillment metrics.",
        "say1": "Consent compliance audits shield platforms from regulatory penalties.",
        "example": "Automated customs duty drawback maximizes net enterprise capital recovery.",
        "tryIt": "Synthetic multi market audits confirm seamless global operations."
    }
]

entries = []
for p_idx, part in enumerate(day_data["parts"]):
    code = part["code"]
    code_hash = hashlib.sha256(code.encode("utf-8")).hexdigest()
    caps = captions_day54[p_idx]
    
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
                "label": "Policy Assessment",
                "caption": caps["intro"],
                "data": {"stage": "intake", "status": "active"}
            },
            {
                "id": "say1",
                "label": "Statutory Verification",
                "caption": caps["say1"],
                "data": {"stage": "rules", "status": "processing"}
            },
            {
                "id": "example",
                "label": "Audit Execution",
                "caption": caps["example"],
                "data": {"stage": "compliance", "status": "verified"}
            },
            {
                "id": "tryIt",
                "label": "System Settlement",
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
    "day": 54,
    "entries": entries
}

out_path = os.path.join(visuals_dir, "day-54.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(visual_envelope, f, indent=2, ensure_ascii=False)

print(f"Generated Gate v2 visual envelope: {out_path}")
