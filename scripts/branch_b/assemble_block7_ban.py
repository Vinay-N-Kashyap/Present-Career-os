# -*- coding: utf-8 -*-
"""
Assemble Month 2 Block 7 (Days 31-35 & Milestone 7 Capstone)
Course: Banking, Treasury & Credit Operations (bcom_ban)
Files affected:
- src/lib/data/lessonVisuals/bcom_ban/day-31.json to day-35.json
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
with open('scripts/branch_b/day31_data.json', 'r', encoding='utf-8') as f:
    day31_data = json.load(f)
with open('scripts/branch_b/day32_data.json', 'r', encoding='utf-8') as f:
    day32_data = json.load(f)
with open('scripts/branch_b/day33_data.json', 'r', encoding='utf-8') as f:
    day33_data = json.load(f)
with open('scripts/branch_b/day34_data.json', 'r', encoding='utf-8') as f:
    day34_data = json.load(f)
with open('scripts/branch_b/day35_data.json', 'r', encoding='utf-8') as f:
    day35_data = json.load(f)

days = [day31_data, day32_data, day33_data, day34_data, day35_data]

# 1. Audit Word Counts and Invariants
print("=== AUDITING BLOCK 7 INVARIANTS (DAYS 31 TO 35) ===")
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

print(f"\nALL 25 PARTS PASSED! Total Block 7 Words: {total_block_words} words (avg {total_block_words/5:.1f} words/day)\n")

# 2. Captions mapping for Gate v2 visual envelopes
# Strict rules: ending with period, <= 75 chars, NO digits!
step_metadata = {
    31: [
        [
            ("intro", "Corporate working capital appraisal framework initiated.", "top"),
            ("say1", "Applying first and second committee methods of lending.", "qual"),
            ("example", "Enforcing mandatory promoter net working capital margins.", "target"),
            ("tryIt", "Tandon method two maintains benchmark current ratio thresholds.", "final")
        ],
        [
            ("intro", "Industrial production cash cycle stages analyzed.", "top"),
            ("say1", "Quantifying holding velocity across inventories and book debts.", "qual"),
            ("example", "Offsetting trade credit from gross working capital requirements.", "target"),
            ("tryIt", "Net operating cycle dictates core enterprise liquidity demand.", "final")
        ],
        [
            ("intro", "Collateral drawing power assessment protocol deployed.", "top"),
            ("say1", "Deducting unpaid vendor payables from gross inventory values.", "qual"),
            ("example", "Empanelled chartered accountants conduct quarterly inventory audits.", "target"),
            ("tryIt", "Certified drawing power forms govern daily revolving credit limits.", "final")
        ],
        [
            ("intro", "Monthly cash flow forecasting architecture established.", "top"),
            ("say1", "Tracking lumpy revenue receipts against ongoing payroll disbursements.", "qual"),
            ("example", "Sizing short term demand loans to bridge seasonal peaks.", "target"),
            ("tryIt", "Dynamic cash budgets prevent borrowing beyond genuine operational needs.", "final")
        ],
        [
            ("intro", "Enterprise working capital underwriting engine launched.", "top"),
            ("say1", "Computing maximum permissible bank finance across balance sheets.", "qual"),
            ("example", "Stress testing receivables collection slowdowns and margin buffers.", "target"),
            ("tryIt", "Comprehensive working capital memorandum cleared for credit approval.", "final")
        ]
    ],
    32: [
        [
            ("intro", "Off balance sheet credit facility frameworks structured.", "top"),
            ("say1", "Bank pledges institutional creditworthiness for corporate clients.", "qual"),
            ("example", "Converting contingent exposures under international capital rules.", "target"),
            ("tryIt", "Risk weighted capital reserves set aside for contingent commitments.", "final")
        ],
        [
            ("intro", "Independent demand guarantee instruments examined.", "top"),
            ("say1", "Distinguishing direct monetary substitutes from performance bonds.", "qual"),
            ("example", "Enforcing mandatory statutory claim periods under domestic contract law.", "target"),
            ("tryIt", "Unconditional bank guarantees protect project authorities against default.", "final")
        ],
        [
            ("intro", "International documentary trade credit mechanisms engaged.", "top"),
            ("say1", "Examining export shipping documents under standard practice.", "qual"),
            ("example", "Confirming strict compliance across invoices and bills of lading.", "target"),
            ("tryIt", "Irrevocable letters of credit eliminate cross border settlement risks.", "final")
        ],
        [
            ("intro", "Contingent credit devolvement risk mitigation protocols active.", "top"),
            ("say1", "Securing pre funded cash margin deposits under restricted lien.", "qual"),
            ("example", "Crystallizing defaulted trade credits into forced corporate advances.", "target"),
            ("tryIt", "Cash collateral reserves absorb initial letter of credit losses.", "final")
        ],
        [
            ("intro", "Comprehensive contingent credit appraisal platform activated.", "top"),
            ("say1", "Structuring mixed trade and guarantee limits for industrial clients.", "qual"),
            ("example", "Simulating supplier document presentations and guarantee calls.", "target"),
            ("tryIt", "Non fund based credit memorandum finalized for committee sanction.", "final")
        ]
    ],
    33: [
        [
            ("intro", "Multi bank syndicated credit architecture initialized.", "top"),
            ("say1", "Mandated lead arranger distributes large enterprise credit risk.", "qual"),
            ("example", "Consortium members share common loan terms and repayment schedules.", "target"),
            ("tryIt", "Syndicated structures distribute large industrial debt exposures.", "final")
        ],
        [
            ("intro", "Unified security perimeter established for multiple lenders.", "top"),
            ("say1", "Corporate trustee holds shared mortgages over plant and equipment.", "qual"),
            ("example", "Statutory registration completed on national electronic registries.", "target"),
            ("tryIt", "Perfected pari passu charges grant super priority in liquidation.", "final")
        ],
        [
            ("intro", "Centralized revenue escrow and distribution mechanisms deployed.", "top"),
            ("say1", "All enterprise receivables route into single monitored accounts.", "qual"),
            ("example", "Immutable five tier waterfall protocol prioritizes senior debt.", "target"),
            ("tryIt", "Automated cash sweeps trap excess liquidity upon covenant breach.", "final")
        ],
        [
            ("intro", "Syndicate resolution decision frameworks enacted.", "top"),
            ("say1", "Mandating qualified voting majorities by value and lender count.", "qual"),
            ("example", "Binding inter creditor agreements coordinate debt restructurings.", "target"),
            ("tryIt", "Dissenting lenders bound by statutory majority resolution plans.", "final")
        ],
        [
            ("intro", "Industrial syndicate structuring simulator launched.", "top"),
            ("say1", "Allocating pro rata loan tranches across participating banks.", "qual"),
            ("example", "Simulating debtor distress and escrow account cash distributions.", "target"),
            ("tryIt", "Syndicated loan facility agreement approved by consortium partners.", "final")
        ]
    ],
    34: [
        [
            ("intro", "Non recourse infrastructure financing architecture initiated.", "top"),
            ("say1", "Bankruptcy remote special purpose vehicles insulate parent sponsors.", "qual"),
            ("example", "Project contract web contractually shifts construction and market risks.", "target"),
            ("tryIt", "Direct tripartite agreements grant lenders essential step in rights.", "final")
        ],
        [
            ("intro", "Public private partnership concession structures examined.", "top"),
            ("say1", "Hybrid annuity models allocate traffic volume risks to authorities.", "qual"),
            ("example", "Semi annual government annuities provide inflation indexed revenues.", "target"),
            ("tryIt", "Secondary asset recycling facilitates long term debt refinancing.", "final")
        ],
        [
            ("intro", "Dynamic cash flow coverage metrics computed across project lives.", "top"),
            ("say1", "Sizing senior loan debt against unencumbered project cash flows.", "qual"),
            ("example", "Sculpted amortization schedules maintain constant coverage ratios.", "target"),
            ("tryIt", "Sculpted repayments optimize long term infrastructure debt capacity.", "final")
        ],
        [
            ("intro", "Greenfield infrastructure construction hazard mitigations deployed.", "top"),
            ("say1", "Fixed price turnkey engineering contracts enforce liquidated damages.", "qual"),
            ("example", "Parent sponsors execute unconditional cost overrun undertakings.", "target"),
            ("tryIt", "Independent engineers certify physical project milestones for drawdowns.", "final")
        ],
        [
            ("intro", "Utility scale renewable infrastructure underwriting platform active.", "top"),
            ("say1", "Modeling multi decade cash flows under power purchase agreements.", "qual"),
            ("example", "Stress testing climatic solar irradiance drops against debt reserves.", "target"),
            ("tryIt", "Non recourse infrastructure loan package cleared for financial close.", "final")
        ]
    ],
    35: [
        [
            ("intro", "Milestone seven capstone credit underwriting war room opens.", "top"),
            ("say1", "Applying second committee method to large industrial conglomerate.", "qual"),
            ("example", "Mandatory promoter net working capital margins verified.", "target"),
            ("tryIt", "Fund based working capital facility approved under prudential limits.", "final")
        ],
        [
            ("intro", "Structuring multi facility documentary credits and demand bonds.", "top"),
            ("say1", "Modeling off balance sheet equivalent exposures under global rules.", "qual"),
            ("example", "Enforcing international uniform rules for demand guarantees.", "target"),
            ("tryIt", "Cash collateral liens provide immediate loss absorption cushions.", "final")
        ],
        [
            ("intro", "Four bank credit syndication structure finalized by lead arranger.", "top"),
            ("say1", "Apex security trustee registers first pari passu charge at registry.", "qual"),
            ("example", "Inter creditor agreement establishes statutory majority voting rules.", "target"),
            ("tryIt", "Pro rata syndication schedule spreads industrial exposure safely.", "final")
        ],
        [
            ("intro", "Trust and retention account five tier cash waterfall activated.", "top"),
            ("say1", "Central collection account prioritizes taxes and senior bank interest.", "qual"),
            ("example", "Quarterly cash budget verifies strong debt service coverage ratios.", "target"),
            ("tryIt", "Automated distribution lockup protects lenders during revenue stress.", "final")
        ],
        [
            ("intro", "Executive credit sanction committee convenes for docket interrogation.", "top"),
            ("say1", "Simulating severe revenue contraction and letter of credit devolvement.", "qual"),
            ("example", "Cash margin reserves and debt service buffers absorb credit shocks.", "target"),
            ("tryIt", "Unanimous credit sanction approved for landmark industrial financing.", "final")
        ]
    ]
}

# Audit caption invariants
for day_num, parts_meta in step_metadata.items():
    assert len(parts_meta) == 5, f"Day {day_num} metadata must have 5 parts"
    for p_idx, steps in enumerate(parts_meta):
        assert len(steps) == 4, f"Day {day_num} Part {p_idx} must have 4 steps"
        for at_step, caption, active_stage in steps:
            assert caption.endswith("."), f"Day {day_num} Part {p_idx} caption must end with period: '{caption}'"
            assert len(caption) <= 75, f"Day {day_num} Part {p_idx} caption > 75 chars ({len(caption)}): '{caption}'"
            assert not re.search(r'\d', caption), f"Day {day_num} Part {p_idx} caption contains digits: '{caption}'"

print("ALL VISUAL CAPTIONS VALIDATED (<= 75 chars, period-terminated, ZERO digits)!")

# 3. Generate Gate v2 Visual Envelopes with SHA-256 bindings
standard_stages = [
    {"id": "top", "label": "Credit Scoping"},
    {"id": "qual", "label": "Facility Structuring"},
    {"id": "target", "label": "Risk Modeling"},
    {"id": "final", "label": "Committee Clearance"}
]

visuals_dir = os.path.join(os.getcwd(), "src", "lib", "data", "lessonVisuals", "bcom_ban")
os.makedirs(visuals_dir, exist_ok=True)

for d in days:
    day_num = d["day"]
    entries = []
    for p_idx, part in enumerate(d["parts"]):
        # Compute SHA-256 code hash
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
                "title": f"{short_title} \u2014 Credit Underwriting Review",
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

# 4. Append Days 31-35 to bcomBanLongLessons.ts
lessons_file = os.path.join(os.getcwd(), 'src', 'lib', 'data', 'bcomBanLongLessons.ts')

with open(lessons_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Check if Day 31 already present
if 'day: 31' in content or '"day": 31' in content:
    print("Day 31 already exists in bcomBanLongLessons.ts. Skipping append.")
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

    print(f"Successfully appended Block 7 (Days 31-35) to {lessons_file}!")

print("\n=== BLOCK 7 ASSEMBLY COMPLETE! ===")
