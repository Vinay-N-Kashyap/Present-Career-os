"""
Generate Gate v2 visual envelope for Day 47 (bcom_ecom).
Schema: schemaVersion: 1, prefix: 'bcom_ecom', day: 47, entries: 5
Captions: zero numeric digits (!/\\d/), period-terminated, length <= 75.
"""
import json
import hashlib
import os
import re

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
data_file = os.path.join(commerce_dir, "scripts", "branch_b", "day47_ecom_data.json")
visuals_dir = os.path.join(commerce_dir, "src", "lib", "data", "lessonVisuals", "bcom_ecom")
os.makedirs(visuals_dir, exist_ok=True)

with open(data_file, "r", encoding="utf-8") as f:
    day_data = json.load(f)

captions_day47 = [
    # Part 1
    {
        "intro": "Multi seller shopping carts require atomic split payment allocation.",
        "say1": "The split ledger calculates item subtotals and sales tax withholdings.",
        "example": "Platform commission take rates are deducted before net payouts.",
        "tryIt": "Integer arithmetic prevents rounding leakage across multi vendor orders."
    },
    # Part 2
    {
        "intro": "Custodial accounts segregate merchant funds from operational revenues.",
        "say1": "Compliance with money transmission laws protects customer balances.",
        "example": "Merchant balances remain shielded in bankruptcy protected escrow vaults.",
        "tryIt": "Segregated depository ledgers guarantee complete financial isolation."
    },
    # Part 3
    {
        "intro": "Rolling reserve policies mitigate counterparty fraud and default risk.",
        "say1": "Escrow tranches lock a portion of seller funds for dispute coverage.",
        "example": "Mature reserve tranches release automatically as hold windows expire.",
        "tryIt": "Risk adjusted reserve schedules scale dynamically based on dispute rates."
    },
    # Part 4
    {
        "intro": "Platform payout orchestrators coordinate asynchronous merchant transfers.",
        "say1": "Transfer jobs dispatch to verified seller connected account endpoints.",
        "example": "Idempotent event webhooks track payout lifecycle state transitions.",
        "tryIt": "Automated destination charges distribute funds without manual wiring."
    },
    # Part 5
    {
        "intro": "Marketplace treasury command towers monitor continuous platform solvency.",
        "say1": "Three way ledger reconciliations confirm zero balance sheet variance.",
        "example": "Annual tax reporting pipelines automate merchant compliance filings.",
        "tryIt": "Comprehensive solvency audits confer official platform accreditation."
    }
]

entries = []
for p_idx, part in enumerate(day_data["parts"]):
    code = part["code"]
    code_hash = hashlib.sha256(code.encode("utf-8")).hexdigest()
    caps = captions_day47[p_idx]
    
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
                "label": "Cart Ingestion",
                "caption": caps["intro"],
                "data": {"stage": "cart", "status": "active"}
            },
            {
                "id": "say1",
                "label": "Splits Evaluation",
                "caption": caps["say1"],
                "data": {"stage": "calculation", "status": "processing"}
            },
            {
                "id": "example",
                "label": "Escrow Allocation",
                "caption": caps["example"],
                "data": {"stage": "holding", "status": "escrow"}
            },
            {
                "id": "tryIt",
                "label": "Payout Clearance",
                "caption": caps["tryIt"],
                "data": {"stage": "payout", "status": "complete"}
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
    "day": 47,
    "entries": entries
}

out_path = os.path.join(visuals_dir, "day-47.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(visual_envelope, f, indent=2, ensure_ascii=False)

print(f"Generated Gate v2 visual envelope: {out_path}")
