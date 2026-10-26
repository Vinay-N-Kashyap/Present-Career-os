# -*- coding: utf-8 -*-
"""
Enrich day52_ban_data.json with example, tryIt, answer: 0, and verify all invariants.
"""

import json

with open('scripts/branch_b/day52_ban_data.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

# Ensure coursePrefix, minutes, goal, recap
d["coursePrefix"] = "bcom_ban"
d["minutes"] = 45
d["goal"] = "Master asset securitization structuring, bankruptcy-remote special purpose vehicles (SPV), true sale legal doctrines, internal/external credit enhancement sizing, and multi-tranche cash flow waterfall engines."
d["recap"] = "In Day 51, we conquered single-name CDS, hazard rate Poisson intensity calibration, CDX/iTraxx index basis arbitrage, and ISDA auction settlement protocols. Today in Day 52, we advance into physical asset-backed securitization, legal isolation of loan portfolios, and multi-tiered cash flow waterfalls."

examples = [
    "Titan Capital Bank originates $100,000,000 in prime auto loans. To achieve balance sheet deleveraging, it transfers the loans to an independent SPV trust (Titan Auto Trust 2026-A). The originator retains a 5% ($5,000,000) horizontal risk retention piece to satisfy Regulation RR skin-in-the-game rules, issuing $95,000,000 in credit-rated ABS notes to institutional investors.",
    "A commercial lender sells a $50,000,000 mortgage pool to an SPV with non-recourse terms and arm's-length pricing. Legal counsel delivers a reasoned 'True Sale' and 'Substantive Non-Consolidation' opinion. When the originator subsequently files for Chapter 11 bankruptcy, the bankruptcy court upholds asset isolation, ensuring mortgage collections flow unhindered to noteholders.",
    "An SPV issues $100,000,000 in ABS notes supported by an initial collateral pool of $106,000,000 (creating $6,000,000 or 6.0% Overcollateralization). The capital stack is structured with 82% Senior Class A (AAA), 10% Mezzanine Class B (BBB), and 8% Equity Certificate. The Senior tranche enjoys 24.0% total credit protection (10% Mezzanine + 8% Equity + 6% Overcollateralization).",
    "Titan Auto Trust 2026-A operates a sequential-pay waterfall. In Month 14, cumulative losses reach 4.8%, breaching the 4.0% performance trigger. The structure flips into Turbo Amortization mode: the trustee seizes 100% of excess spread ($125,000) and halts equity dividend distributions, channeling all cash flow to accelerate Senior Class A principal retirement.",
    "An investment banking syndicate models a $50,000,000 consumer ABS pool across 12 months with 12% CPR prepayment and 3.5% CDR default. Senior Class A notes amortize from $42,500,000 to $23,797,896, while Mezzanine Class B notes receive interest only, preserving $5,000,000 principal. Total cumulative default losses are $808,610, absorbed entirely by excess spread ($1,475,257) and equity."
]

try_its = [
    "Change mhp_months_req to 12 in the sample loan evaluation to observe how newer loans fail seasoning and are rejected from the eligible pool.",
    "Adjust the originator_recourse_retained flag to True to observe how true sale criteria fail and the asset transfer is recharacterized as a secured financing.",
    "Modify equity_tranche_pct to 4.0% to evaluate how senior subordination contracts, requiring higher external letters of credit to maintain AAA ratings.",
    "Lower cumulative_losses_pct to 3.2% to see the structure clear the trigger test, remain in pro-rata mode, and disburse excess spread dividends to equity holders.",
    "Increase cdr_annual to 0.08 (8% annual default rate) to observe how default losses surge past $1,800,000, exhausting excess spread and eroding the equity tranche."
]

for idx, p in enumerate(d["parts"]):
    p.pop("id", None)
    p.pop("courseId", None)
    p["example"] = examples[idx]
    p["tryIt"] = try_its[idx]
    check = p["check"]
    check["answer"] = 0
    check["answerIndex"] = 0
    assert len(check["options"]) == 4
    assert len(check["why"]) >= 20
    assert len(p["example"]) > 10
    assert len(p["tryIt"]) > 5
    assert len(p["code"]) > 20
    assert len(p["output"]) > 5

    words = sum(len(x.strip().split()) for x in p["say"])
    print(f"Part {idx+1}: {p['title'][:40]} -> {words} TS words")
    assert words >= 600

with open('scripts/branch_b/day52_ban_data.json', 'w', encoding='utf-8') as f:
    json.dump(d, f, indent=2)

print("Saved enriched scripts/branch_b/day52_ban_data.json successfully!")
