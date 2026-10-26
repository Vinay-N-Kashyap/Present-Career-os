# -*- coding: utf-8 -*-
"""
Assemble Month 2 Block 8 (Days 36-40 & Milestone 8 Capstone)
Course: Statutory Audit & Corporate Assurance (bcom_aud)
Files affected:
- src/lib/data/lessonVisuals/bcom_aud/day-36.json to day-40.json
- src/lib/data/bcomAudLongLessons.ts
"""

import json
import hashlib
import os
import sys

sys.path.insert(0, os.getcwd())
sys.path.insert(0, os.path.join(os.getcwd(), 'scripts', 'branch_b'))

# Load day datasets
with open('scripts/branch_b/day36_data.json', 'r', encoding='utf-8') as f:
    day36_data = json.load(f)
with open('scripts/branch_b/day37_data.json', 'r', encoding='utf-8') as f:
    day37_data = json.load(f)
with open('scripts/branch_b/day38_data.json', 'r', encoding='utf-8') as f:
    day38_data = json.load(f)
with open('scripts/branch_b/day39_data.json', 'r', encoding='utf-8') as f:
    day39_data = json.load(f)
with open('scripts/branch_b/day40_data.json', 'r', encoding='utf-8') as f:
    day40_data = json.load(f)

days = [day36_data, day37_data, day38_data, day39_data, day40_data]

# 1. Audit Word Counts and Invariants
print("=== AUDITING BLOCK 8 INVARIANTS (DAYS 36 TO 40) ===")
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

print(f"\nALL 25 PARTS PASSED! Total Block 8 Words: {total_block_words} words (avg {total_block_words/5:.1f} words/day)\n")

# 2. Captions mapping for Gate v2 visual envelopes
# Strict rules: ending with period, <= 75 chars, NO digits!
step_metadata = {
    36: [
        [
            ("intro", "Raw documentation submitted for external assurance verification.", "top"),
            ("say1", "Evaluating evidentiary hierarchy and independent source credibility.", "qual"),
            ("example", "Direct counterparty confirmation establishing factual validity.", "target"),
            ("tryIt", "Uncompromised audit evidence supporting statutory audit conclusions.", "final")
        ],
        [
            ("intro", "Complex electronic data queries extracted from enterprise systems.", "top"),
            ("say1", "Testing report logic and query parameters for completeness.", "qual"),
            ("example", "Reconciling extracted sub-ledger reports to core general ledgers.", "target"),
            ("tryIt", "Verified management information forming sound evidentiary files.", "final")
        ],
        [
            ("intro", "Subjective actuarial valuations and asset appraisal reports.", "top"),
            ("say1", "Assessing specialist objectivity competence and underlying models.", "qual"),
            ("example", "Independent sensitivity testing challenging valuation assumptions.", "target"),
            ("tryIt", "Objective valuation assurance shielding financial reports.", "final")
        ],
        [
            ("intro", "Millions of transactional journals ingested into analytics tools.", "top"),
            ("say1", "Automated anomaly detection screening for weekend postings.", "qual"),
            ("example", "Forensic pattern matching isolating unauthorized manual entries.", "target"),
            ("tryIt", "Comprehensive electronic testing replacing haphazard sampling.", "final")
        ],
        [
            ("intro", "Corporate ledger populations processed through assurance engines.", "top"),
            ("say1", "Scoring evidentiary reliability across distinct assurance streams.", "qual"),
            ("example", "Corroborating documentary streams against third-party records.", "target"),
            ("tryIt", "Mathematically defensible evidentiary files clearing inspections.", "final")
        ]
    ],
    37: [
        [
            ("intro", "Customer account listings selected for direct external inquiry.", "top"),
            ("say1", "Positive confirmation requests demanding explicit verification.", "qual"),
            ("example", "Managing non-response risks through mandatory second requests.", "target"),
            ("tryIt", "Direct external proof substantiating account receivable values.", "final")
        ],
        [
            ("intro", "Confirmation request letters prepared for delivery to counterparties.", "top"),
            ("say1", "Strict transmission control preventing management interception.", "qual"),
            ("example", "Verifying secure digital channels and direct postal dispatches.", "target"),
            ("tryIt", "Independent audit custody ensuring uncompromised confirmation flow.", "final")
        ],
        [
            ("intro", "Complex treasury operations and multiple corporate bank facilities.", "top"),
            ("say1", "Digital confirmation platforms providing secure authenticated links.", "qual"),
            ("example", "Validating compensating balances debt covenants and credit lines.", "target"),
            ("tryIt", "Comprehensive treasury assurance eliminating undisclosed liabilities.", "final")
        ],
        [
            ("intro", "Customer exception letters reporting disputed invoice balances.", "top"),
            ("say1", "Distinguishing in-transit timing differences from actual errors.", "qual"),
            ("example", "Alternative testing inspecting subsequent cash receipts and PODs.", "target"),
            ("tryIt", "Reconciled confirmation differences resolving ledger misstatements.", "final")
        ],
        [
            ("intro", "High-volume confirmation batches dispatched across debtors.", "top"),
            ("say1", "Real-time tracking of response rates and exception categories.", "qual"),
            ("example", "Executing automated alternative testing workflows on holdouts.", "target"),
            ("tryIt", "Defensible confirmation files proving asset existence.", "final")
        ]
    ],
    38: [
        [
            ("intro", "Broad transaction populations subject to substantive inspection.", "top"),
            ("say1", "Quantifying acceptable risk of incorrect acceptance and rejection.", "qual"),
            ("example", "Deriving mathematically defensible statistical sample sizes.", "target"),
            ("tryIt", "Rigorous probability sampling protecting financial statements.", "final")
        ],
        [
            ("intro", "Every individual currency unit treated as an independent item.", "top"),
            ("say1", "Value-weighted sampling automatically selecting large exposures.", "qual"),
            ("example", "Deriving sampling intervals and projecting sample taintings.", "target"),
            ("tryIt", "Upper error limits computed to evaluate tolerable misstatement.", "final")
        ],
        [
            ("intro", "Inventory SKU populations exhibiting high variance and returns.", "top"),
            ("say1", "Normal distribution models evaluating population central limits.", "qual"),
            ("example", "Calculating standard errors and precision buffers with correction.", "target"),
            ("tryIt", "Accurate population estimates derived from physical sample units.", "final")
        ],
        [
            ("intro", "Factual errors uncovered during substantive sample testing.", "top"),
            ("say1", "Extrapolating sample misstatements across unexamined accounts.", "qual"),
            ("example", "Adding precision allowances for sampling risk to projections.", "target"),
            ("tryIt", "Determining whether cumulative exposure breaches materiality.", "final")
        ],
        [
            ("intro", "Multi-cycle balance sheet accounts analyzed by sampling engines.", "top"),
            ("say1", "Automated sampling interval calculations across cycles.", "qual"),
            ("example", "Evaluating sample exceptions and computing upper error limits.", "target"),
            ("tryIt", "Statistically validated balances clearing regulatory reviews.", "final")
        ]
    ],
    39: [
        [
            ("intro", "Multinational group entities operating across foreign territories.", "top"),
            ("say1", "Single undivided statutory responsibility of group auditors.", "qual"),
            ("example", "Evaluating component auditor ethical independence and competence.", "target"),
            ("tryIt", "Structured group audit instructions directing overseas teams.", "final")
        ],
        [
            ("intro", "Group overall materiality established for consolidated reporting.", "top"),
            ("say1", "Managing aggregation risk across multiple operating subsidiaries.", "qual"),
            ("example", "Applying square root allocation rules to derive component limits.", "target"),
            ("tryIt", "Defensible component materiality protecting consolidated accounts.", "final")
        ],
        [
            ("intro", "Global corporate network analyzed for statutory audit scoping.", "top"),
            ("say1", "Categorizing entities by financial benchmark contributions.", "qual"),
            ("example", "Isolating complex treasury units for specific risk procedures.", "target"),
            ("tryIt", "Comprehensive substantive coverage across multinational units.", "final")
        ],
        [
            ("intro", "Consolidation schedules combining subsidiary trial balances.", "top"),
            ("say1", "Testing top-side journal entries and management adjustments.", "qual"),
            ("example", "Eliminating internal trading volumes and unrealized markups.", "target"),
            ("tryIt", "Accurate consolidated financial reports reflecting third parties.", "final")
        ],
        [
            ("intro", "Multi-jurisdictional financial data processed by group engines.", "top"),
            ("say1", "Real-time tracking of component audit packs and misstatements.", "qual"),
            ("example", "Reconciling inter-company mismatches and eliminating profits.", "target"),
            ("tryIt", "Unmodified group clearance memorandum approved for audit boards.", "final")
        ]
    ],
    40: [
        [
            ("intro", "Multi-billion dollar conglomerate launching annual assurance review.", "top"),
            ("say1", "Establishing group materiality and square root allocation caps.", "qual"),
            ("example", "Vetting component teams across five international hubs.", "target"),
            ("tryIt", "Unified global engagement framework governing overseas audits.", "final")
        ],
        [
            ("intro", "Large receivables and inventory populations undergoing sampling.", "top"),
            ("say1", "Executing value-weighted intervals to capture major balances.", "qual"),
            ("example", "Computing taintings and upper error limits for sample errors.", "target"),
            ("tryIt", "Remediating sampling exceptions to restore statistical validity.", "final")
        ],
        [
            ("intro", "Cross-border trade schedules submitted for group elimination.", "top"),
            ("say1", "Reconciling in-transit shipping and currency discrepancies.", "qual"),
            ("example", "Eliminating internal inventory profit markups and deferred taxes.", "target"),
            ("tryIt", "Consolidated asset values reduced to pure economic cost.", "final")
        ],
        [
            ("intro", "Component audit reporting packages aggregated onto the ledger.", "top"),
            ("say1", "Evaluating cumulative unadjusted misstatements against buffers.", "qual"),
            ("example", "Reviewing qualitative risk factors and key audit disclosures.", "target"),
            ("tryIt", "Independent quality review concurrence granting clean opinion.", "final")
        ],
        [
            ("intro", "Consolidated enterprise data ingested into the war room engine.", "top"),
            ("say1", "End-to-end telemetry coordinating global audit milestones.", "qual"),
            ("example", "Synthesizing sampling results and consolidation eliminations.", "target"),
            ("tryIt", "Flawless group assurance dossier ready for board presentation.", "final")
        ]
    ]
}

# Verify caption rules
print("=== VERIFYING CAPTION RULES (PERIOD TERMINATION, <= 75 CHARS, ZERO DIGITS) ===")
caption_errors = 0
for day_num, day_parts in step_metadata.items():
    for p_idx, steps in enumerate(day_parts):
        for at_step, caption, active_stage in steps:
            if not caption.endswith('.'):
                print(f"ERROR: Day {day_num} Part {p_idx+1} {at_step} caption does not end with period: '{caption}'")
                caption_errors += 1
            if len(caption) > 75:
                print(f"ERROR: Day {day_num} Part {p_idx+1} {at_step} caption > 75 chars ({len(caption)}): '{caption}'")
                caption_errors += 1
            if any(char.isdigit() for char in caption):
                print(f"ERROR: Day {day_num} Part {p_idx+1} {at_step} caption contains digit: '{caption}'")
                caption_errors += 1

assert caption_errors == 0, f"Found {caption_errors} caption rule errors!"
print("ALL 100 CAPTIONS (5 DAYS * 5 PARTS * 4 STEPS) PASS STRICT GATE V2 RULES!\n")

# 3. Generate Visuals
visuals_dir = os.path.join(os.getcwd(), 'src', 'lib', 'data', 'lessonVisuals', 'bcom_aud')
os.makedirs(visuals_dir, exist_ok=True)

standard_stages = [
    {"id": "top", "label": "Population Intake", "color": "blue"},
    {"id": "qual", "label": "Risk Screening", "color": "amber"},
    {"id": "target", "label": "Substantive Execution", "color": "purple"},
    {"id": "final", "label": "Audit Clearance", "color": "emerald"}
]

for d in days:
    day_num = d["day"]
    entries = []
    for p_idx, part in enumerate(d["parts"]):
        code = part.get("code", "")
        code_hash = hashlib.sha256(code.encode("utf-8")).hexdigest()
        
        # Build 4 steps
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

# 4. Append Days 36-40 to bcomAudLongLessons.ts
lessons_file = os.path.join(os.getcwd(), 'src', 'lib', 'data', 'bcomAudLongLessons.ts')

with open(lessons_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Check if Day 36 already present
if 'day: 36' in content or '"day": 36' in content:
    print("Day 36 already exists in bcomAudLongLessons.ts. Skipping append.")
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

    print(f"Successfully appended Block 8 (Days 36-40) to {lessons_file}!")

print("\n=== BLOCK 8 ASSEMBLY COMPLETE! ===")
