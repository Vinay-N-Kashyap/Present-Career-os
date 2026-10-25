# -*- coding: utf-8 -*-
"""
Assemble Month 2 Block 8 (Days 36-40 & Milestone 8 Capstone)
Course: Banking, Treasury & Credit Operations (bcom_ban)
Files affected:
- src/lib/data/lessonVisuals/bcom_ban/day-36.json to day-40.json
- src/lib/data/bcomBanLongLessons.ts
"""

import json
import hashlib
import os
import re
import sys

sys.path.insert(0, os.getcwd())
sys.path.insert(0, os.path.join(os.getcwd(), 'scripts', 'branch_b'))

# Load day datasets
with open('scripts/branch_b/day36_ban_data.json', 'r', encoding='utf-8') as f:
    day36_data = json.load(f)
with open('scripts/branch_b/day37_ban_data.json', 'r', encoding='utf-8') as f:
    day37_data = json.load(f)
with open('scripts/branch_b/day38_ban_data.json', 'r', encoding='utf-8') as f:
    day38_data = json.load(f)
with open('scripts/branch_b/day39_ban_data.json', 'r', encoding='utf-8') as f:
    day39_data = json.load(f)
with open('scripts/branch_b/day40_ban_data.json', 'r', encoding='utf-8') as f:
    day40_data = json.load(f)

days = [day36_data, day37_data, day38_data, day39_data, day40_data]

# 1. Audit Word Counts and Invariants
print("=== AUDITING BLOCK 8 INVARIANTS (DAYS 36 TO 40) ===")
total_block_words = 0
for d in days:
    day_num = d["day"]
    parts = d["parts"]
    assert len(parts) == 5, f"Day {day_num} must have 5 parts, found {len(parts)}"
    assert d.get("coursePrefix") == "bcom_ban", f"Day {day_num} must have coursePrefix 'bcom_ban'"
    assert d.get("minutes") in [45, 55, 60], f"Day {day_num} minutes must be 45, 55, or 60"
    assert d.get("goal"), f"Day {day_num} missing goal"
    assert d.get("recap"), f"Day {day_num} missing recap"
    
    day_words = 0
    for p_idx, part in enumerate(parts):
        # strip 'id' or 'courseId' if present
        if "id" in part:
            del part["id"]
        if "courseId" in part:
            del part["courseId"]
            
        wc = sum(len(p.split()) for p in part["say"])
        day_words += wc
        print(f"Day {day_num} Part {p_idx+1}: {part['title'][:40]} -> {wc} words")
        assert wc >= 600, f"Day {day_num} Part {p_idx+1} under 600 words ({wc} words)!"
        
        # Check assessment
        check = part.get("check")
        assert check, f"Day {day_num} Part {p_idx+1} missing check!"
        assert len(check["options"]) == 4, f"Day {day_num} Part {p_idx+1} check must have 4 options"
        assert check["answer"] == 0, f"Day {day_num} Part {p_idx+1} check.answer must be 0"
        assert check["answerIndex"] == 0, f"Day {day_num} Part {p_idx+1} check.answerIndex must be 0"
        assert len(check["why"]) >= 20, f"Day {day_num} Part {p_idx+1} check.why must be >= 20 chars"
        
        # Code & Output
        assert part.get("code"), f"Day {day_num} Part {p_idx+1} missing code"
        assert part.get("output"), f"Day {day_num} Part {p_idx+1} missing output"
        assert part.get("tryIt"), f"Day {day_num} Part {p_idx+1} missing tryIt"
        assert part.get("example"), f"Day {day_num} Part {p_idx+1} missing example"

    total_block_words += day_words
    print(f"-> Day {day_num} Total Words: {day_words}")

print(f"\nALL 25 PARTS PASSED! Total Block 8 Words: {total_block_words} words (avg {total_block_words/5:.1f} words/day)\n")

# 2. Captions mapping for Gate v2 visual envelopes
# Strict rules: ending with period, <= 75 chars, NO digits!
step_metadata = {
    36: [
        [
            ("intro", "Integrated treasury operating architecture initiated.", "top"),
            ("say1", "Enforcing statutory reserve ratios and liquidity pools.", "qual"),
            ("example", "Segregating front middle and back office clearing duties.", "target"),
            ("tryIt", "Autonomous treasury divisions maintain institutional solvency.", "final")
        ],
        [
            ("intro", "Dealing room organizational perimeter deployed.", "top"),
            ("say1", "Front office dealers execute interbank wholesale transactions.", "qual"),
            ("example", "Independent middle office risk units monitor trading exposures.", "target"),
            ("tryIt", "Back office operations guarantee swift settlement execution.", "final")
        ],
        [
            ("intro", "Cash reserve ratio compliance mechanisms activated.", "top"),
            ("say1", "Monitoring daily balances at the sovereign central bank.", "qual"),
            ("example", "Averaging fortnight balances avoids compounding penalty charges.", "target"),
            ("tryIt", "Central bank reserves anchor systemic payment clearing.", "final")
        ],
        [
            ("intro", "Statutory liquidity ratio investment mandates enforced.", "top"),
            ("say1", "Allocating eligible sovereign paper to statutory liquidity books.", "qual"),
            ("example", "Unencumbered government securities fulfill regulatory quotas.", "target"),
            ("tryIt", "Pledging excess sovereign debt provides overnight liquidity.", "final")
        ],
        [
            ("intro", "Enterprise treasury command simulation initialized.", "top"),
            ("say1", "Synthesizing reserve compliance across dealing desks.", "qual"),
            ("example", "Rebalancing cash reserves mitigates liquidity deficits.", "target"),
            ("tryIt", "Comprehensive treasury controls ensure regulatory compliance.", "final")
        ]
    ],
    37: [
        [
            ("intro", "Wholesale interbank money market structure evaluated.", "top"),
            ("say1", "Navigating call notice and term money funding channels.", "qual"),
            ("example", "Primary dealers and commercial banks clear bilateral liquidity.", "target"),
            ("tryIt", "Unsecured borrowing limits constrain interbank exposures.", "final")
        ],
        [
            ("intro", "Corporate commercial paper issuance dynamics audited.", "top"),
            ("say1", "Evaluating credit rating mandates and standalone liquidity.", "qual"),
            ("example", "Issuing and paying agents verify promissory note execution.", "target"),
            ("tryIt", "Discounted money market debt diversifies working capital.", "final")
        ],
        [
            ("intro", "Bank certificates of deposit issuance framework deployed.", "top"),
            ("say1", "Wholesale deposit instruments mobilize institutional funds.", "qual"),
            ("example", "Dematerialized bearer deposits offer secondary negotiability.", "target"),
            ("tryIt", "Fixed term wholesale deposits lock in bank liquidity.", "final")
        ],
        [
            ("intro", "Tri-party repo and collateralized lending protocols activated.", "top"),
            ("say1", "Central clearing counterparties eliminate bilateral default.", "qual"),
            ("example", "Sovereign bond baskets serve as eligible repo collateral.", "target"),
            ("tryIt", "Collateralized borrowing secures lowest interbank interest rates.", "final")
        ],
        [
            ("intro", "Enterprise wholesale funding optimization simulation run.", "top"),
            ("say1", "Synthesizing blended costs across money market instruments.", "qual"),
            ("example", "Repositioning collateralized repo optimizes interest margins.", "target"),
            ("tryIt", "Diversified wholesale funding protects enterprise solvency.", "final")
        ]
    ],
    38: [
        [
            ("intro", "Sovereign debt instruments architecture categorized.", "top"),
            ("say1", "Analyzing treasury bills and central government dated paper.", "qual"),
            ("example", "Sub-national development loans offer institutional yield spreads.", "target"),
            ("tryIt", "Government bonds anchor the risk-free sovereign curve.", "final")
        ],
        [
            ("intro", "Central bank primary auction mechanics modeled.", "top"),
            ("say1", "Comparing uniform price Dutch and multiple price French bids.", "qual"),
            ("example", "Uniform price clearing mitigates the aggressive winners curse.", "target"),
            ("tryIt", "When-issued trading hedges primary dealer underwriting risk.", "final")
        ],
        [
            ("intro", "Secondary electronic trading on negotiated platforms audited.", "top"),
            ("say1", "Anonymous limit order books match bids on price time priority.", "qual"),
            ("example", "Multilateral netting settles both cash and bonds on next day.", "target"),
            ("tryIt", "Central counterparties novate trades to guarantee completion.", "final")
        ],
        [
            ("intro", "Quantitative fixed income analytics engine calibrated.", "top"),
            ("say1", "Formulating yield to maturity and weighted cash flow timing.", "qual"),
            ("example", "Linear modified duration estimates interest rate volatility.", "target"),
            ("tryIt", "Positive convexity cushions bond prices against rate spikes.", "final")
        ],
        [
            ("intro", "Comprehensive sovereign debt trading simulator executed.", "top"),
            ("say1", "Simulating bear flattening shifts across benchmark tenors.", "qual"),
            ("example", "Held to maturity accounting buffers marked to market losses.", "target"),
            ("tryIt", "Derivative swap hedges and capital reserves preserve equity.", "final")
        ]
    ],
    39: [
        [
            ("intro", "Asset liability committee governance charter deployed.", "top"),
            ("say1", "Mapping cash flows into statutory chronological buckets.", "qual"),
            ("example", "Prudential limits restrict short-term cumulative outflows.", "target"),
            ("tryIt", "Behavioral modeling captures sticky non-maturity deposits.", "final")
        ],
        [
            ("intro", "Interest rate sensitivity statement framework structured.", "top"),
            ("say1", "Classifying balance sheet items into rate sensitive tiers.", "qual"),
            ("example", "Repricing gap measures quarterly net interest income exposure.", "target"),
            ("tryIt", "Liability sensitive profiles face margin compression on hikes.", "final")
        ],
        [
            ("intro", "Dynamic duration gap and economic equity modeling deployed.", "top"),
            ("say1", "Measuring balance sheet leverage and cash flow durations.", "qual"),
            ("example", "Supervisory outlier thresholds flag extreme equity erosion.", "target"),
            ("tryIt", "Duration gap immunization protects long-term net worth.", "final")
        ],
        [
            ("intro", "Earnings at risk and net interest margin stress tested.", "top"),
            ("say1", "Simulating non-parallel term structure and curve twist shocks.", "qual"),
            ("example", "Deposit pass-through beta drives incremental funding costs.", "target"),
            ("tryIt", "Dynamic reinvestment assumptions reflect realistic margins.", "final")
        ],
        [
            ("intro", "Enterprise asset liability command simulator launched.", "top"),
            ("say1", "Resolving sudden deposit run-offs with repo facilities.", "qual"),
            ("example", "Pay-fixed interest rate swaps inject synthetic duration.", "target"),
            ("tryIt", "Restoring tolerance compliance affirms regulatory standing.", "final")
        ]
    ],
    40: [
        [
            ("intro", "Institutional dealing room architecture mobilized.", "top"),
            ("say1", "Front middle and back office units coordinate response.", "qual"),
            ("example", "Pledging sovereign debt into repo halts liquidity deficits.", "target"),
            ("tryIt", "Real-time collateral mobilization restores statutory ratios.", "final")
        ],
        [
            ("intro", "Primary sovereign auction underwriting defense deployed.", "top"),
            ("say1", "Primary dealer obligations absorb auction bidding deficits.", "qual"),
            ("example", "When-issued forward sales lock in positive arbitrage gains.", "target"),
            ("tryIt", "Positive carry repo financing turns devolution into income.", "final")
        ],
        [
            ("intro", "Secondary bond portfolio valuation stress evaluated.", "top"),
            ("say1", "Partitioning portfolios into amortized and fair value books.", "qual"),
            ("example", "Positive convexity softens linear duration price drops.", "target"),
            ("tryIt", "Overnight index swaps and reserves protect common equity.", "final")
        ],
        [
            ("intro", "Enterprise asset liability committee war room convened.", "top"),
            ("say1", "Pre-hedge duration gaps threaten severe capital depletion.", "qual"),
            ("example", "Off-balance-sheet interest rate swaps slash duration gap.", "target"),
            ("tryIt", "Synthetic duration immunization keeps equity inside limits.", "final")
        ],
        [
            ("intro", "Master treasury war room solvency audit concluded.", "top"),
            ("say1", "Verifying multi-pillar defense across liquidity and capital.", "qual"),
            ("example", "Clean regulatory inspection awards top institutional rating.", "target"),
            ("tryIt", "Enterprise balance sheet controls ensure enduring solvency.", "final")
        ]
    ]
}

# Verify caption invariants
for day_num, parts_meta in step_metadata.items():
    for p_idx, steps in enumerate(parts_meta):
        for at_step, caption, active_stage in steps:
            assert len(caption) <= 75, f"Day {day_num} P{p_idx+1} {at_step} caption exceeds 75 chars: '{caption}' ({len(caption)})"
            assert caption.endswith("."), f"Day {day_num} P{p_idx+1} {at_step} caption must end with period: '{caption}'"
            assert not any(c.isdigit() for c in caption), f"Day {day_num} P{p_idx+1} {at_step} caption has digits: '{caption}'"

print("ALL VISUAL CAPTION INVARIANTS CONFIRMED!\n")

# 3. Generate Gate v2 visual envelopes
visuals_dir = os.path.join(os.getcwd(), 'src', 'lib', 'data', 'lessonVisuals', 'bcom_ban')
os.makedirs(visuals_dir, exist_ok=True)

standard_stages = [
    {"id": "top", "label": "Macro Liquidity Intake"},
    {"id": "qual", "label": "Treasury Risk Screening"},
    {"id": "target", "label": "Balance Sheet Allocation"},
    {"id": "final", "label": "Solvency Affirmation"}
]

for d in days:
    day_num = d["day"]
    entries = []
    for p_idx, part in enumerate(d["parts"]):
        full_part_str = part["title"] + "".join(part["say"]) + part.get("code", "")
        code_hash = hashlib.sha256(full_part_str.encode("utf-8")).hexdigest()
        
        steps = []
        meta_steps = step_metadata[day_num][p_idx]
        for at_step, caption, active_stage in meta_steps:
            steps.append({
                "at": at_step,
                "caption": caption,
                "activeStageId": active_stage,
                "stages": standard_stages
            })
            
        short_title = part["title"]
        if len(short_title) > 40:
            short_title = short_title[:38] + "..."
            
        entry = {
            "partTitle": part["title"],
            "codeHash": code_hash,
            "spec": {
                "template": "funnel",
                "title": f"{short_title} \u2014 Treasury Risk Operations",
                "steps": steps
            }
        }
        entries.append(entry)
        
    day_visual = {
        "schemaVersion": 1,
        "prefix": "bcom_ban",
        "day": day_num,
        "entries": entries
    }
    
    out_path = os.path.join(visuals_dir, f"day-{day_num}.json")
    with open(out_path, "w", encoding="utf-8") as vf:
        json.dump(day_visual, vf, indent=2)
    print(f"Generated {out_path} with 5 entries and SHA-256 bindings.")

# 4. Append Days 36-40 to bcomBanLongLessons.ts
lessons_file = os.path.join(os.getcwd(), 'src', 'lib', 'data', 'bcomBanLongLessons.ts')

with open(lessons_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Check if Day 36 already present
if 'day: 36' in content or '"day": 36' in content:
    print("Day 36 already exists in bcomBanLongLessons.ts. Skipping append.")
else:
    last_bracket_idx = content.rfind('];')
    if last_bracket_idx == -1:
        print("Could not find closing '];' in bcomBanLongLessons.ts!")
        sys.exit(1)

    formatted_days = []
    for d in days:
        # Guarantee no 'id' or 'courseId' in root or parts
        if "id" in d:
            del d["id"]
        if "courseId" in d:
            del d["courseId"]
        for p in d["parts"]:
            if "id" in p:
                del p["id"]
            if "courseId" in p:
                del p["courseId"]
        json_str = json.dumps(d, indent=2, ensure_ascii=False)
        formatted_days.append(json_str)

    days_payload = ",\n" + ",\n".join(formatted_days) + "\n];\n"
    new_content = content[:last_bracket_idx].rstrip() + days_payload

    with open(lessons_file, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"Successfully appended Block 8 (Days 36-40) to {lessons_file}!")

print("\n=== BLOCK 8 ASSEMBLY COMPLETE! ===")
