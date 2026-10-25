# -*- coding: utf-8 -*-
"""
Assemble Month 2 Block 9 (Days 41-45 & Milestone 9 Capstone)
Course: Banking, Treasury & Credit Operations (bcom_ban)
Files affected:
- src/lib/data/lessonVisuals/bcom_ban/day-41.json to day-45.json
- src/lib/data/bcomBanLongLessons.ts
"""

import json
import hashlib
import os
import re
import sys

# Load day datasets
with open('scripts/branch_b/day41_ban_data.json', 'r', encoding='utf-8') as f:
    day41_data = json.load(f)
with open('scripts/branch_b/day42_ban_data.json', 'r', encoding='utf-8') as f:
    day42_data = json.load(f)
with open('scripts/branch_b/day43_ban_data.json', 'r', encoding='utf-8') as f:
    day43_data = json.load(f)
with open('scripts/branch_b/day44_ban_data.json', 'r', encoding='utf-8') as f:
    day44_data = json.load(f)
with open('scripts/branch_b/day45_ban_data.json', 'r', encoding='utf-8') as f:
    day45_data = json.load(f)

days = [day41_data, day42_data, day43_data, day44_data, day45_data]

# 1. Audit Word Counts and Invariants
print("=== AUDITING BLOCK 9 INVARIANTS (DAYS 41 TO 45) ===")
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
            
        wc = sum(len(re.findall(r'\b\w+\b', p)) for p in part["say"])
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

print(f"\nALL 25 PARTS PASSED! Total Block 9 Words: {total_block_words} words (avg {total_block_words/5:.1f} words/day)\n")

# 2. Captions mapping for Gate v2 visual envelopes
# Strict rules: ending with period, <= 75 chars, NO digits!
step_metadata = {
    41: [
        [
            ("intro", "Global foreign exchange trading architecture initiated.", "top"),
            ("say1", "Continuous over the counter currency trading active.", "qual"),
            ("example", "Direct and indirect quotes establish base currency values.", "target"),
            ("tryIt", "Continuous settlement rails mitigate cross border credit risk.", "final")
        ],
        [
            ("intro", "Interbank two way quotation mechanics deployed.", "top"),
            ("say1", "Market makers quote bid and ask rates across tenors.", "qual"),
            ("example", "Merchant margin schedules adjust retail customer rates.", "target"),
            ("tryIt", "Early delivery protocols square off forward swap differences.", "final")
        ],
        [
            ("intro", "Triangular cross currency arbitrage engine activated.", "top"),
            ("say1", "Cross currency synthetic rates benchmark interbank pairs.", "qual"),
            ("example", "Exploiting triangular mispricing restores market equilibrium.", "target"),
            ("tryIt", "Algorithmic execution captures riskless basis point profits.", "final")
        ],
        [
            ("intro", "Forward exchange rates and parity theory calibrated.", "top"),
            ("say1", "Covered interest rate parity determines forward swap points.", "qual"),
            ("example", "Interest differentials drive forward premia or discounts.", "target"),
            ("tryIt", "Currency swap points hedge cross border maturity exposures.", "final")
        ],
        [
            ("intro", "Enterprise foreign exchange dealing simulation concluded.", "top"),
            ("say1", "Net open position limits govern aggregate currency books.", "qual"),
            ("example", "Automated hedging neutralizes intraday currency exposures.", "target"),
            ("tryIt", "Comprehensive dealing controls affirm regulatory compliance.", "final")
        ]
    ],
    42: [
        [
            ("intro", "Cross border trade finance instruments categorized.", "top"),
            ("say1", "Balancing commercial buyer risk against supplier terms.", "qual"),
            ("example", "Documentary collections route shipping bills via banks.", "target"),
            ("tryIt", "International sales terms define cross border obligations.", "final")
        ],
        [
            ("intro", "Documentary letters of credit architecture structured.", "top"),
            ("say1", "Uniform customs and practice rules govern credit operations.", "qual"),
            ("example", "Irrevocable confirmed credits guarantee exporter payment.", "target"),
            ("tryIt", "Doctrine of strict compliance governs documentary review.", "final")
        ],
        [
            ("intro", "Pre shipment export credit facilities deployed.", "top"),
            ("say1", "Packing credit mobilizes working capital for production.", "qual"),
            ("example", "Export orders establish borrowing limits and eligibility.", "target"),
            ("tryIt", "Concessional interest schemes support domestic exporters.", "final")
        ],
        [
            ("intro", "Post shipment export bill discounting executed.", "top"),
            ("say1", "Discounting accepted commercial bills accelerates cash flow.", "qual"),
            ("example", "Automated monitoring matches export receipts with filings.", "target"),
            ("tryIt", "Realization tracking safeguards export proceeds repatriation.", "final")
        ],
        [
            ("intro", "Export credit guarantee corporation claims audited.", "top"),
            ("say1", "Turnover policies protect banks against default risks.", "qual"),
            ("example", "Insolvency insurance covers political and buyer defaults.", "target"),
            ("tryIt", "Comprehensive trade credit underwriting minimizes loss.", "final")
        ]
    ],
    43: [
        [
            ("intro", "Correspondent banking network topology evaluated.", "top"),
            ("say1", "Nostro accounts represent domestic funds held overseas.", "qual"),
            ("example", "Vostro accounts hold foreign currency balances locally.", "target"),
            ("tryIt", "Bilateral relationships anchor cross border payments.", "final")
        ],
        [
            ("intro", "Global payment messaging standards migration audited.", "top"),
            ("say1", "Transitioning legacy messages to structured schema formats.", "qual"),
            ("example", "Granular data models slash compliance false positives.", "target"),
            ("tryIt", "Straight through processing enhances settlement speed.", "final")
        ],
        [
            ("intro", "Multi currency mirror accounting framework deployed.", "top"),
            ("say1", "Shadow ledgers track foreign currency nostro operations.", "qual"),
            ("example", "Dual currency bookkeeping balances domestic general ledgers.", "target"),
            ("tryIt", "Exchange rate revaluation adjusts foreign currency books.", "final")
        ],
        [
            ("intro", "Automated nostro reconciliation mechanics activated.", "top"),
            ("say1", "Algorithmic matching reconciles statement records daily.", "qual"),
            ("example", "Investigating outstanding debits prevents daylight overdrafts.", "target"),
            ("tryIt", "Unreconciled ledger items require forensic tracking.", "final")
        ],
        [
            ("intro", "Enterprise cross border settlement simulation run.", "top"),
            ("say1", "Reconciling incoming transfers against shadow balances.", "qual"),
            ("example", "Emergency liquidity lines neutralize nostro deficits.", "target"),
            ("tryIt", "Automated correspondent controls guarantee solvency.", "final")
        ]
    ],
    44: [
        [
            ("intro", "Statutory foreign exchange legislation categorized.", "top"),
            ("say1", "Differentiating current and capital account regimes.", "qual"),
            ("example", "Current account transactions remain fundamentally open.", "target"),
            ("tryIt", "Authorized dealers enforce exchange control guidelines.", "final")
        ],
        [
            ("intro", "Liberalised remittance scheme parameters audited.", "top"),
            ("say1", "Annual limits govern retail foreign currency outflows.", "qual"),
            ("example", "Tax collected at source is deducted on qualifying transfers.", "target"),
            ("tryIt", "Centralized tracking enforces annual remitter limits.", "final")
        ],
        [
            ("intro", "Overseas direct investment framework structured.", "top"),
            ("say1", "Corporate net worth limits govern outbound commitments.", "qual"),
            ("example", "Equity debt and guarantee components form total exposure.", "target"),
            ("tryIt", "Multi layer subsidiary restrictions curb round tripping.", "final")
        ],
        [
            ("intro", "External commercial borrowing guidelines evaluated.", "top"),
            ("say1", "Minimum average maturity rules prevent duration gaps.", "qual"),
            ("example", "Benchmark spread caps restrict foreign currency interest.", "target"),
            ("tryIt", "Mandatory hedging policies cushion exchange fluctuations.", "final")
        ],
        [
            ("intro", "Master foreign exchange compliance audit conducted.", "top"),
            ("say1", "Statutory reporting platforms track international flows.", "qual"),
            ("example", "Compounding procedures regularize inadvertent infractions.", "target"),
            ("tryIt", "Structured settlement fees resolve regulatory disputes.", "final")
        ]
    ],
    45: [
        [
            ("intro", "Global markets war room crisis command mobilized.", "top"),
            ("say1", "Exchange rate volatility strains dealing room positions.", "qual"),
            ("example", "Offshore basis dislocations test net open limits.", "target"),
            ("tryIt", "Emergency treasury committees coordinate market response.", "final")
        ],
        [
            ("intro", "Algorithmic currency quoting and arbitrage executed.", "top"),
            ("say1", "Widened dealer spreads manage commercial order surges.", "qual"),
            ("example", "Triangular arbitrage captures riskless cross rate gains.", "target"),
            ("tryIt", "Continuous limit surveillance defends proprietary books.", "final")
        ],
        [
            ("intro", "Trade finance documentary dispute adjudication run.", "top"),
            ("say1", "Forensic documentary review identifies cargo defects.", "qual"),
            ("example", "Statutory refusal notices legally reject invalid credits.", "target"),
            ("tryIt", "Strict compliance protects issuing banks against losses.", "final")
        ],
        [
            ("intro", "Cross border nostro clearing and liquidity defense.", "top"),
            ("say1", "Intraday correspondent debits trigger overdraft alerts.", "qual"),
            ("example", "Emergency spot currency purchases restore cash reserves.", "target"),
            ("tryIt", "Structured messaging formats confirm settlement balance.", "final")
        ],
        [
            ("intro", "Master global markets solvency scorecard finalized.", "top"),
            ("say1", "Four pillar defense synthesizes treasury and compliance.", "qual"),
            ("example", "Statutory compounding resolves capital account inquiries.", "target"),
            ("tryIt", "Comprehensive operational controls verify bank solvency.", "final")
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

print("ALL BLOCK 9 VISUAL CAPTION INVARIANTS CONFIRMED!\n")

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

# 4. Append Days 41-45 to bcomBanLongLessons.ts
lessons_file = os.path.join(os.getcwd(), 'src', 'lib', 'data', 'bcomBanLongLessons.ts')

with open(lessons_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Check if Day 41 already present
if 'day: 41' in content or '"day": 41' in content:
    print("Day 41 already exists in bcomBanLongLessons.ts. Skipping append.")
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

    print(f"Successfully appended Block 9 (Days 41-45) to {lessons_file}!")

print("\n=== BLOCK 9 ASSEMBLY COMPLETE! ===")
