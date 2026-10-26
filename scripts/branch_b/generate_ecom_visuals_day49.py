"""
Generate Gate v2 visual envelope for Day 49 (bcom_ecom).
Schema: schemaVersion: 1, prefix: 'bcom_ecom', day: 49, entries: 5
Captions: zero numeric digits (!/\\d/), period-terminated, length <= 75.
"""
import json
import hashlib
import os
import re

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
data_file = os.path.join(commerce_dir, "scripts", "branch_b", "day49_ecom_data.json")
visuals_dir = os.path.join(commerce_dir, "src", "lib", "data", "lessonVisuals", "bcom_ecom")
os.makedirs(visuals_dir, exist_ok=True)

with open(data_file, "r", encoding="utf-8") as f:
    day_data = json.load(f)

captions_day49 = [
    # Part 1
    {
        "intro": "Inbound card disputes trigger strict statutory response deadlines.",
        "say1": "The dispute lifecycle engine monitors formal representment windows.",
        "example": "Automated countdown monitors prevent catastrophic default losses.",
        "tryIt": "State machines transition claims through representment and arbitration."
    },
    # Part 2
    {
        "intro": "Card network dispute portals enforce codified reason code frameworks.",
        "say1": "Reason codes map programmatically to mandatory evidentiary checklists.",
        "example": "Address verification and carrier signatures satisfy card absent rules.",
        "tryIt": "Automated scheme mappers retrieve exact rebuttal requirements."
    },
    # Part 3
    {
        "intro": "Historical customer footprints establish friendly fraud defenses.",
        "say1": "Prior undisputed transactions are evaluated for matching identifiers.",
        "example": "Matching device hashes and delivery coordinates disqualify fraud claims.",
        "tryIt": "Compelling evidence rules automate pre arbitration dispute dismissal."
    },
    # Part 4
    {
        "intro": "Event driven workers assemble multi document representment packets.",
        "say1": "Delivery proofs and checkout logs compile into structured dossiers.",
        "example": "Embedded exhibits undergo optical character recognition verification.",
        "tryIt": "Cryptographic manifests validate transmission readiness for scheme APIs."
    },
    # Part 5
    {
        "intro": "Dispute command towers monitor fleet wide win rates and recovery yield.",
        "say1": "Economic models balance claim values against arbitration filing fees.",
        "example": "Early warning alerts resolve inquiries before formal disputes register.",
        "tryIt": "Comprehensive dispute audits confer official legal defense accreditation."
    }
]

entries = []
for p_idx, part in enumerate(day_data["parts"]):
    code = part["code"]
    code_hash = hashlib.sha256(code.encode("utf-8")).hexdigest()
    caps = captions_day49[p_idx]
    
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
                "label": "Notice Ingestion",
                "caption": caps["intro"],
                "data": {"stage": "inbound", "status": "active"}
            },
            {
                "id": "say1",
                "label": "Evidence Gathering",
                "caption": caps["say1"],
                "data": {"stage": "mapping", "status": "processing"}
            },
            {
                "id": "example",
                "label": "Dossier Compilation",
                "caption": caps["example"],
                "data": {"stage": "compilation", "status": "verified"}
            },
            {
                "id": "tryIt",
                "label": "Scheme Adjudication",
                "caption": caps["tryIt"],
                "data": {"stage": "ruling", "status": "complete"}
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
    "day": 49,
    "entries": entries
}

out_path = os.path.join(visuals_dir, "day-49.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(visual_envelope, f, indent=2, ensure_ascii=False)

print(f"Generated Gate v2 visual envelope: {out_path}")
