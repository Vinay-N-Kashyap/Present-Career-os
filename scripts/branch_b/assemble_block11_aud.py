# -*- coding: utf-8 -*-
"""
Assemble Month 2 Block 11 (Days 51-55 & Milestone 11 Capstone)
Course: Statutory Audit & Corporate Assurance (bcom_aud)
Files affected:
- src/lib/data/lessonVisuals/bcom_aud/day-51.json to day-55.json
- src/lib/data/bcomAudLongLessons.ts
"""

import json
import hashlib
import os
import sys

sys.path.insert(0, os.getcwd())
sys.path.insert(0, os.path.join(os.getcwd(), 'scripts', 'branch_b'))

# Load day datasets
with open('scripts/branch_b/day51_data.json', 'r', encoding='utf-8') as f:
    day51_data = json.load(f)
with open('scripts/branch_b/day52_data.json', 'r', encoding='utf-8') as f:
    day52_data = json.load(f)
with open('scripts/branch_b/day53_data.json', 'r', encoding='utf-8') as f:
    day53_data = json.load(f)
with open('scripts/branch_b/day54_data.json', 'r', encoding='utf-8') as f:
    day54_data = json.load(f)
with open('scripts/branch_b/day55_data.json', 'r', encoding='utf-8') as f:
    day55_data = json.load(f)

days = [day51_data, day52_data, day53_data, day54_data, day55_data]

# 1. Audit Word Counts and Invariants
print("=== AUDITING BLOCK 11 INVARIANTS (DAYS 51 TO 55) ===")
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

print(f"\nALL 25 PARTS PASSED! Total Block 11 Words: {total_block_words} words (avg {total_block_words/5:.1f} words/day)\n")

# 2. Captions mapping for Gate v2 visual envelopes
# Strict rules: ending with period, <= 75 chars, NO digits!
step_metadata = {
    51: [
        [
            ("intro", "Statutory completion phase launched across corporate financial ledgers.", "top"),
            ("say1", "Reviewing closing trial balances against prior periods and forecast.", "qual"),
            ("example", "Investigating unexpected variances between operating results and budget.", "target"),
            ("tryIt", "Corroborated analytical conclusions documented in final audit files.", "final")
        ],
        [
            ("intro", "Comprehensive financial ratios calculated across all operating cycles.", "top"),
            ("say1", "Evaluating gross margins and turnover across balance sheet lines.", "qual"),
            ("example", "Confirming ratio movements align with substantive audit working papers.", "target"),
            ("tryIt", "Auditor analytical review provides overall financial statement comfort.", "final")
        ],
        [
            ("intro", "Subsequent transactions investigated following balance sheet closure.", "top"),
            ("say1", "Distinguishing conditions existing at year end from subsequent shocks.", "qual"),
            ("example", "Customer insolvency confirming pre existing bad debt reserve needs.", "target"),
            ("tryIt", "Adjusting subsequent events recorded directly to general ledger balances.", "final")
        ],
        [
            ("intro", "Post year end events evaluated for transparent footnote disclosures.", "top"),
            ("say1", "Reviewing casualty losses and debt refinancing agreements after year end.", "qual"),
            ("example", "Footnote disclosures structured to prevent misleading financial reports.", "target"),
            ("tryIt", "Dual dating restricts post closing auditor liability to specific notes.", "final")
        ],
        [
            ("intro", "Statutory subsequent events engine auditing post balance sheet journals.", "top"),
            ("say1", "Scanning board meeting minutes and subsequent bank cash receipts.", "qual"),
            ("example", "Compiling proposed audit adjustments for recognized subsequent events.", "target"),
            ("tryIt", "Subsequent events lead schedules cleared for partner sign off.", "final")
        ]
    ],
    52: [
        [
            ("intro", "Corporate litigation and legal contingencies evaluated under standards.", "top"),
            ("say1", "Scrutinizing client dispute dockets and board governance records.", "qual"),
            ("example", "Determining whether legal claims meet probable recognition criteria.", "target"),
            ("tryIt", "Loss contingencies classified under strict accounting definitions.", "final")
        ],
        [
            ("intro", "Formal audit inquiry requests dispatched to external legal counsel.", "top"),
            ("say1", "Inquiry letters conform to established legal treaty guidelines.", "qual"),
            ("example", "External counsel confirms litigation exposure and potential ranges.", "target"),
            ("tryIt", "Legal responses substantiate completeness of recorded legal accruals.", "final")
        ],
        [
            ("intro", "Equally likely litigation loss ranges evaluated under statutory guidance.", "top"),
            ("say1", "Accruing minimum point of estimated damage range on the balance sheet.", "qual"),
            ("example", "Disclosing remaining exposure beyond the minimum recorded balance.", "target"),
            ("tryIt", "Litigation accrual reserves aligned with accounting standards.", "final")
        ],
        [
            ("intro", "Superfund environmental liabilities assessed at industrial cleanup sites.", "top"),
            ("say1", "Independent environmental engineering specialists quantify remediation.", "qual"),
            ("example", "Allocating orphan shares among solvent potentially responsible parties.", "target"),
            ("tryIt", "Undiscounted environmental liabilities booked in financial statements.", "final")
        ],
        [
            ("intro", "Enterprise legal contingencies audit engine consolidating all matters.", "top"),
            ("say1", "Reconciling outside attorney response letters against general ledgers.", "qual"),
            ("example", "Quantifying litigation reserve shortfalls across all corporate cases.", "target"),
            ("tryIt", "Litigation lead schedules finalized for audit committee clearance.", "final")
        ]
    ],
    53: [
        [
            ("intro", "Statutory going concern evaluation initiated over prospective horizon.", "top"),
            ("say1", "Evaluating cash runway and operational burn across upcoming periods.", "qual"),
            ("example", "Identifying negative operating cash flows raising substantial doubt.", "target"),
            ("tryIt", "Baseline liquidity runway models establish prospective going concern risk.", "final")
        ],
        [
            ("intro", "Corporate debt covenants inspected across syndicated credit facilities.", "top"),
            ("say1", "Testing leverage and interest coverage against contractual ceilings.", "qual"),
            ("example", "Debt covenant breach requiring balance sheet liability reclassification.", "target"),
            ("tryIt", "Unwaived debt defaults reclassified to current liabilities on ledgers.", "final")
        ],
        [
            ("intro", "Management prospective mitigating plans scrutinized under standards.", "top"),
            ("say1", "Differentiating legally binding agreements from speculative intent.", "qual"),
            ("example", "Executed debt refinancing qualified while unapproved asset sales fail.", "target"),
            ("tryIt", "Only probable management plans accepted to alleviate substantial doubt.", "final")
        ],
        [
            ("intro", "Statutory audit report explanatory wording drafted under standards.", "top"),
            ("say1", "Emphasizing substantial doubt without modifying the audit opinion.", "qual"),
            ("example", "Referencing comprehensive liquidity footnote disclosures in reports.", "target"),
            ("tryIt", "Mandatory statutory phrases embedded in auditor report paragraphs.", "final")
        ],
        [
            ("intro", "Enterprise going concern liquidity stress defense platform executed.", "top"),
            ("say1", "Synthesizing baseline cash deficits with qualified mitigating inflows.", "qual"),
            ("example", "Determining whether remaining unmitigated deficit triggers disclosure.", "target"),
            ("tryIt", "Going concern lead schedules approved for engagement quality review.", "final")
        ]
    ],
    54: [
        [
            ("intro", "Written executive management representation letters drafted for signing.", "top"),
            ("say1", "Mandating executive signatures matching the definitive audit report date.", "qual"),
            ("example", "Tailoring specific representation clauses for complex estimates.", "target"),
            ("tryIt", "Executive representations provide crucial corroborative audit evidence.", "final")
        ],
        [
            ("intro", "Schedule of unadjusted differences bound to representation letter.", "top"),
            ("say1", "Evaluating uncorrected misstatements against planning materiality.", "qual"),
            ("example", "Executive officers certify uncorrected differences are immaterial.", "target"),
            ("tryIt", "Misstatement schedules documented in accordance with federal rules.", "final")
        ],
        [
            ("intro", "Year end audit results docket compiled for audit committee review.", "top"),
            ("say1", "Presenting significant accounting policies and complex transactions.", "qual"),
            ("example", "Discussing auditor judgments regarding critical accounting estimates.", "target"),
            ("tryIt", "Corporate governance dialogue promotes financial reporting oversight.", "final")
        ],
        [
            ("intro", "Annual auditor independence affirmation delivered to board committees.", "top"),
            ("say1", "Confirming compliance with professional independence regulations.", "qual"),
            ("example", "Holding private executive sessions excluding corporate management.", "target"),
            ("tryIt", "Uncompromised auditor independence reaffirmed for public stakeholders.", "final")
        ],
        [
            ("intro", "Enterprise audit governance platform synthesizing final deliverables.", "top"),
            ("say1", "Reconciling signed representation exhibits against audit lead schedules.", "qual"),
            ("example", "Audit committee recommends filing financial statements with regulators.", "target"),
            ("tryIt", "Governance clearance granted authorizing independent report issuance.", "final")
        ]
    ],
    55: [
        [
            ("intro", "War room briefing establishing enterprise audit completion mandate.", "top"),
            ("say1", "Synthesizing materiality benchmarks across global operational cycles.", "qual"),
            ("example", "Deploying integrated completion protocols before statutory filing.", "target"),
            ("tryIt", "Audit completion governance framework initialized for full execution.", "final")
        ],
        [
            ("intro", "Final analytical procedures and subsequent events testing executed.", "top"),
            ("say1", "Recording bankruptcy write down for recognized subsequent default.", "qual"),
            ("example", "Dual dating audit report signature for catastrophic casualty loss.", "target"),
            ("tryIt", "Balance sheet integrity preserved through subsequent events review.", "final")
        ],
        [
            ("intro", "Corporate litigation reserves and environmental exposures audited.", "top"),
            ("say1", "Evaluating outside legal counsel responses and expert estimations.", "qual"),
            ("example", "Quantifying reserve shortfalls across patent and environmental claims.", "target"),
            ("tryIt", "Litigation audit adjustments posted to summary of differences.", "final")
        ],
        [
            ("intro", "Going concern liquidity stress defense tested under severe assumptions.", "top"),
            ("say1", "Reclassifying defaulted debt and stress testing rolling cash burn.", "qual"),
            ("example", "Qualifying binding credit agreements while rejecting speculative bids.", "target"),
            ("tryIt", "Statutory going concern explanatory paragraph prepared for release.", "final")
        ],
        [
            ("intro", "War room master completion simulator clearing final governance gates.", "top"),
            ("say1", "Securing executive representation signatures and committee clearance.", "qual"),
            ("example", "Engagement quality review partner grants concurring release approval.", "target"),
            ("tryIt", "Unqualified audit report authorized for annual regulatory filing.", "final")
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

# 4. Append Days 51-55 to bcomAudLongLessons.ts
lessons_file = os.path.join(os.getcwd(), 'src', 'lib', 'data', 'bcomAudLongLessons.ts')

with open(lessons_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Check if Day 51 already present
if 'day: 51' in content or '"day": 51' in content:
    print("Day 51 already exists in bcomAudLongLessons.ts. Skipping append.")
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

    print(f"Successfully appended Block 11 (Days 51-55) to {lessons_file}!")

print("\n=== BLOCK 11 ASSEMBLY COMPLETE! ===")
