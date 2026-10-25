# -*- coding: utf-8 -*-
"""
Assemble Month 2 Block 10 (Days 46-50 & Milestone 10 Capstone)
Course: Statutory Audit & Corporate Assurance (bcom_aud)
Files affected:
- src/lib/data/lessonVisuals/bcom_aud/day-46.json to day-50.json
- src/lib/data/bcomAudLongLessons.ts
"""

import json
import hashlib
import os
import sys

sys.path.insert(0, os.getcwd())
sys.path.insert(0, os.path.join(os.getcwd(), 'scripts', 'branch_b'))

# Load day datasets
with open('scripts/branch_b/day46_data.json', 'r', encoding='utf-8') as f:
    day46_data = json.load(f)
with open('scripts/branch_b/day47_data.json', 'r', encoding='utf-8') as f:
    day47_data = json.load(f)
with open('scripts/branch_b/day48_data.json', 'r', encoding='utf-8') as f:
    day48_data = json.load(f)
with open('scripts/branch_b/day49_data.json', 'r', encoding='utf-8') as f:
    day49_data = json.load(f)
with open('scripts/branch_b/day50_data.json', 'r', encoding='utf-8') as f:
    day50_data = json.load(f)

days = [day46_data, day47_data, day48_data, day49_data, day50_data]

# 1. Audit Word Counts and Invariants
print("=== AUDITING BLOCK 10 INVARIANTS (DAYS 46 TO 50) ===")
total_block_words = 0
for d in days:
    day_num = d["day"]
    parts = d["parts"]
    assert len(parts) == 5, f"Day {day_num} must have 5 parts, found {len(parts)}"
    assert d.get("coursePrefix") == "bcom_aud", f"Day {day_num} must have coursePrefix 'bcom_aud'"
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

print(f"\nALL 25 PARTS PASSED! Total Block 10 Words: {total_block_words} words (avg {total_block_words/5:.1f} words/day)\n")

# 2. Captions mapping for Gate v2 visual envelopes
# Strict rules: ending with period, <= 75 chars, NO digits!
step_metadata = {
    46: [
        [
            ("intro", "Multi-element customer contracts evaluated under statutory standards.", "top"),
            ("say1", "Bifurcating distinct performance deliverables across the contract.", "qual"),
            ("example", "Allocating consideration based on relative standalone selling prices.", "target"),
            ("tryIt", "Appropriate deferral of service revenues preserving reporting rigor.", "final")
        ],
        [
            ("intro", "Dual-direction shipping cut-off procedures executed across year-end.", "top"),
            ("say1", "Inspecting carrier bills of lading and electronic dispatch stamps.", "qual"),
            ("example", "Identifying premature billing on shipments prior to destination.", "target"),
            ("tryIt", "Derecognition of unearned sales entries correcting trade receivables.", "final")
        ],
        [
            ("intro", "Third-party customer accounts selected for direct verification.", "top"),
            ("say1", "Positive confirmation requests dispatched to major trade debtors.", "qual"),
            ("example", "Alternative procedures validating subsequent cash receipts in bank.", "target"),
            ("tryIt", "Trade receivable balances verified through independent confirmations.", "final")
        ],
        [
            ("intro", "Current expected credit loss econometric models scrutinized.", "top"),
            ("say1", "Evaluating lifetime default probabilities and economic forecasts.", "qual"),
            ("example", "Auditor model identifying reserve shortfall across trade balances.", "target"),
            ("tryIt", "Statutory credit loss allowances fully booked in financial ledgers.", "final")
        ],
        [
            ("intro", "Automated substantive revenue testing engine launched across ledgers.", "top"),
            ("say1", "Ingesting transaction populations across enterprise resource systems.", "qual"),
            ("example", "Quantifying aggregate cut-off and standalone price misstatements.", "target"),
            ("tryIt", "Proposed revenue audit adjustments compiled for governance review.", "final")
        ]
    ],
    47: [
        [
            ("intro", "Purchasing transaction cycles scrutinized for understated liabilities.", "top"),
            ("say1", "Evaluating completeness of obligations recorded in corporate ledgers.", "qual"),
            ("example", "Sampling subsequent disbursements across post-closing periods.", "target"),
            ("tryIt", "Directional audit testing establishing expenditure completeness.", "final")
        ],
        [
            ("intro", "Subsequent cash disbursements searched for unrecorded obligations.", "top"),
            ("say1", "Matching vendor invoices against receiving reports and work orders.", "qual"),
            ("example", "Uncovering manufacturing component deliveries omitted at year-end.", "target"),
            ("tryIt", "Proposed audit journal entries posted to capture all liabilities.", "final")
        ],
        [
            ("intro", "Goods received not invoiced suspense clearing balances extracted.", "top"),
            ("say1", "Analyzing aging distribution to identify stale clearing records.", "qual"),
            ("example", "Investigating duplicate receiving records and canceled shipments.", "target"),
            ("tryIt", "Stale clearing entries reversed to credit cost of goods sold.", "final")
        ],
        [
            ("intro", "Contingent liabilities and legal litigation claims interrogated.", "top"),
            ("say1", "Inquiring of external legal counsel regarding probable exposures.", "qual"),
            ("example", "Patent settlement agreement in principle evaluated under standards.", "target"),
            ("tryIt", "Loss contingencies fully accrued protecting transparent disclosures.", "final")
        ],
        [
            ("intro", "Enterprise procure-to-pay substantive engine auditing all accounts.", "top"),
            ("say1", "Consolidating unrecorded liabilities and stale suspense items.", "qual"),
            ("example", "Cross-referencing disbursements against receiving log databases.", "target"),
            ("tryIt", "Accounts payable lead schedules cleared for audit committee review.", "final")
        ]
    ],
    48: [
        [
            ("intro", "Physical inventory counts observed across global manufacturing hubs.", "top"),
            ("say1", "Verifying physical count tag controls and movement freeze protocols.", "qual"),
            ("example", "Executing dual-direction test counts between floor and summaries.", "target"),
            ("tryIt", "Physical existence of raw materials and finished goods confirmed.", "final")
        ],
        [
            ("intro", "Manufacturing absorption costing and overhead models inspected.", "top"),
            ("say1", "Recalculating standard cost rolls and material bill structures.", "qual"),
            ("example", "Allocating production variances between inventory and expense.", "target"),
            ("tryIt", "Inventoriable cost pools substantiated against actual invoices.", "final")
        ],
        [
            ("intro", "Lower of cost or net realizable value testing executed on stock.", "top"),
            ("say1", "Comparing carrying unit costs against recent post-year-end sales.", "qual"),
            ("example", "Detecting obsolete components where cost exceeds recoverable value.", "target"),
            ("tryIt", "Inventory valuation reserves recorded to capture obsolescence.", "final")
        ],
        [
            ("intro", "High-frequency perpetual inventory cycle counting systems audited.", "top"),
            ("say1", "Evaluating automated warehouse management barcode track systems.", "qual"),
            ("example", "Assessing statistical accuracy across inventory classification tiers.", "target"),
            ("tryIt", "Perpetual cycle records validated for annual balance sheet reliance.", "final")
        ],
        [
            ("intro", "Substantive inventory assurance platform analyzing all stock items.", "top"),
            ("say1", "Consolidating book-to-physical count variance and scrap metrics.", "qual"),
            ("example", "Recalculating unit-level net realizable value reserve schedules.", "target"),
            ("tryIt", "Defensible inventory valuation schedules ready for engagement sign-off.", "final")
        ]
    ],
    49: [
        [
            ("intro", "Capital asset additions and disposals vouched to source records.", "top"),
            ("say1", "Physical inspection of machinery confirming operating existence.", "qual"),
            ("example", "Recalculating straight-line depreciation across all asset classes.", "target"),
            ("tryIt", "Fixed asset registers reconciled to general ledger balance sheets.", "final")
        ],
        [
            ("intro", "Operating repair and maintenance ledgers scrubbed for boundaries.", "top"),
            ("say1", "Evaluating economic useful life expansion and capacity criteria.", "qual"),
            ("example", "Distinguishing routine upkeep from long-term capital enhancements.", "target"),
            ("tryIt", "Improperly capitalized operating costs reclassified to expenses.", "final")
        ],
        [
            ("intro", "Right-of-use asset and lease liability agreements audited in depth.", "top"),
            ("say1", "Interrogating incremental borrowing rates and contract durations.", "qual"),
            ("example", "Recalculating present value of contractual lease obligations.", "target"),
            ("tryIt", "Off-balance sheet lease obligations captured on corporate ledgers.", "final")
        ],
        [
            ("intro", "Cash-generating units screened for potential economic impairment.", "top"),
            ("say1", "Discounted cash flow valuation models scrutinized by specialists.", "qual"),
            ("example", "Recalculating risk-adjusted cost of capital and terminal growth.", "target"),
            ("tryIt", "Impairment losses allocated first to eliminate unviable goodwill.", "final")
        ],
        [
            ("intro", "Master capital asset assurance engine consolidating audit findings.", "top"),
            ("say1", "Aggregating depreciation fixes lease adjustments and impairments.", "qual"),
            ("example", "Synthesizing proposed audit entries for long-lived balance items.", "target"),
            ("tryIt", "Capital asset audit workpapers finalized for partner clearance.", "final")
        ]
    ],
    50: [
        [
            ("intro", "War room briefing establishing multi-cycle quantitative governance.", "top"),
            ("say1", "Deriving planning and performance materiality across revenue.", "qual"),
            ("example", "Setting clearly trivial de minimis thresholds for tracking errors.", "target"),
            ("tryIt", "Audit materiality boundaries guiding substantive field operations.", "final")
        ],
        [
            ("intro", "Order-to-cash substantive testing executed across sales streams.", "top"),
            ("say1", "Bifurcating multi-element software and hardware revenue contracts.", "qual"),
            ("example", "Reversing premature shipping cut-offs delivered after year-end.", "target"),
            ("tryIt", "Credit loss allowances adjusted to reflect economic forecast risks.", "final")
        ],
        [
            ("intro", "Procure-to-pay substantive testing executed on liabilities.", "top"),
            ("say1", "Uncovering unrecorded liabilities through subsequent disbursements.", "qual"),
            ("example", "Reversing stagnant suspense clearing items and accruing claims.", "target"),
            ("tryIt", "Accounts payable completeness established through rigorous testing.", "final")
        ],
        [
            ("intro", "Supply chain conversion and capital infrastructure cycles audited.", "top"),
            ("say1", "Reconciling physical inventory shrinkage and obsolescence reserves.", "qual"),
            ("example", "Recalculating right-of-use lease debt and impairment write-downs.", "target"),
            ("tryIt", "Asset valuation and lease obligations aligned with global standards.", "final")
        ],
        [
            ("intro", "War room master engine compiling summary of unadjusted errors.", "top"),
            ("say1", "Aggregating multi-cycle misstatements against planning materiality.", "qual"),
            ("example", "Presenting proposed adjustments to senior corporate leadership.", "target"),
            ("tryIt", "Flawless audit clearance and unqualified statutory opinion issued.", "final")
        ]
    ]
}

# Validate captions
for d_num, part_steps in step_metadata.items():
    for p_i, steps in enumerate(part_steps):
        for s_at, caption, s_stage in steps:
            assert len(caption) <= 75, f"Caption too long in Day {d_num} Part {p_i+1}: {caption} ({len(caption)} chars)"
            assert caption.endswith("."), f"Caption must end with period in Day {d_num} Part {p_i+1}: {caption}"
            for ch in caption:
                assert not ch.isdigit(), f"Caption contains digit '{ch}' in Day {d_num} Part {p_i+1}: {caption}"

print("ALL VISUAL CAPTIONS VALIDATED (<= 75 chars, period-terminated, ZERO digits)!")

# 3. Generate Gate v2 Visual Envelopes with SHA-256 bindings
standard_stages = [
    {"id": "top", "label": "Planning & Scoping"},
    {"id": "qual", "label": "Audit Execution"},
    {"id": "target", "label": "Evidence Evaluation"},
    {"id": "final", "label": "Assurance Clearance"}
]

visuals_dir = os.path.join(os.getcwd(), "src", "lib", "data", "lessonVisuals", "bcom_aud")
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
                "title": f"{short_title} \u2014 Assurance Review",
                "steps": steps
            }
        }
        entries.append(entry)
        
    day_visual = {
        "schemaVersion": 1,
        "prefix": "bcom_aud",
        "day": day_num,
        "entries": entries
    }
    
    out_path = os.path.join(visuals_dir, f"day-{day_num}.json")
    with open(out_path, "w", encoding="utf-8") as vf:
        json.dump(day_visual, vf, indent=2)
    print(f"Generated {out_path} with 5 entries and SHA-256 bindings.")

# 4. Append Days 46-50 to bcomAudLongLessons.ts
lessons_file = os.path.join(os.getcwd(), 'src', 'lib', 'data', 'bcomAudLongLessons.ts')

with open(lessons_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Check if Day 46 already present
if 'day: 46' in content or '"day": 46' in content:
    print("Day 46 already exists in bcomAudLongLessons.ts. Skipping append.")
else:
    last_bracket_idx = content.rfind('];')
    if last_bracket_idx == -1:
        print("Could not find closing '];' in bcomAudLongLessons.ts!")
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

    print(f"Successfully appended Block 10 (Days 46-50) to {lessons_file}!")

print("\n=== BLOCK 10 ASSEMBLY COMPLETE! ===")
