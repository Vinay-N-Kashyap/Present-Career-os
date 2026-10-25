# -*- coding: utf-8 -*-
"""
Assemble Month 2 Block 9 (Days 41-45 & Milestone 9 Capstone)
Course: Statutory Audit & Corporate Assurance (bcom_aud)
Files affected:
- src/lib/data/lessonVisuals/bcom_aud/day-41.json to day-45.json
- src/lib/data/bcomAudLongLessons.ts
"""

import json
import hashlib
import os
import sys

sys.path.insert(0, os.getcwd())
sys.path.insert(0, os.path.join(os.getcwd(), 'scripts', 'branch_b'))

# Load day datasets
with open('scripts/branch_b/day41_data.json', 'r', encoding='utf-8') as f:
    day41_data = json.load(f)
with open('scripts/branch_b/day42_data.json', 'r', encoding='utf-8') as f:
    day42_data = json.load(f)
with open('scripts/branch_b/day43_data.json', 'r', encoding='utf-8') as f:
    day43_data = json.load(f)
with open('scripts/branch_b/day44_data.json', 'r', encoding='utf-8') as f:
    day44_data = json.load(f)
with open('scripts/branch_b/day45_data.json', 'r', encoding='utf-8') as f:
    day45_data = json.load(f)

days = [day41_data, day42_data, day43_data, day44_data, day45_data]

# 1. Audit Word Counts and Invariants
print("=== AUDITING BLOCK 9 INVARIANTS (DAYS 41 TO 45) ===")
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

print(f"\nALL 25 PARTS PASSED! Total Block 9 Words: {total_block_words} words (avg {total_block_words/5:.1f} words/day)\n")

# 2. Captions mapping for Gate v2 visual envelopes
# Strict rules: ending with period, <= 75 chars, NO digits!
step_metadata = {
    41: [
        [
            ("intro", "Corporate governance mandates established across public exchanges.", "top"),
            ("say1", "Board oversight structures holding management strictly accountable.", "qual"),
            ("example", "Executive certifications enforcing direct officer legal responsibility.", "target"),
            ("tryIt", "Ethical tone at the top safeguarding transparent capital markets.", "final")
        ],
        [
            ("intro", "Executive quarterly certification workflows submitted for assurance.", "top"),
            ("say1", "Evaluating disclosure controls and procedures for operational rigor.", "qual"),
            ("example", "Subsidiary controllers submitting formal quarterly sign-offs.", "target"),
            ("tryIt", "Uncompromised corporate certifications submitted to regulators.", "final")
        ],
        [
            ("intro", "Annual management assessment of internal control frameworks.", "top"),
            ("say1", "Direct testing of design adequacy and operational effectiveness.", "qual"),
            ("example", "Independent external auditor attestation verifying assertions.", "target"),
            ("tryIt", "Transparent internal control reporting clearing public filings.", "final")
        ],
        [
            ("intro", "International corporate governance models emphasizing stakeholder trust.", "top"),
            ("say1", "Comparing comply-or-explain principles against statutory mandates.", "qual"),
            ("example", "Integrated sustainability reporting aligning societal outcomes.", "target"),
            ("tryIt", "Comprehensive ethical governance protecting global stakeholders.", "final")
        ],
        [
            ("intro", "Multi-jurisdictional compliance data ingested by governance engines.", "top"),
            ("say1", "Automated scoring of board composition and committee independence.", "qual"),
            ("example", "Evaluating quarterly sub-certifications across global subsidiaries.", "target"),
            ("tryIt", "Flawless governance dossier ready for audit committee inspection.", "final")
        ]
    ],
    42: [
        [
            ("intro", "Financial statement populations scoped through risk-based models.", "top"),
            ("say1", "Prioritizing significant accounts and pervasive entity controls.", "qual"),
            ("example", "Directing audit fieldwork toward areas of highest misstatement risk.", "target"),
            ("tryIt", "Efficient audit scoping delivering focused assurance coverage.", "final")
        ],
        [
            ("intro", "Pervasive control environment establishing enterprise discipline.", "top"),
            ("say1", "Direct testing of indirect and direct entity-level mechanisms.", "qual"),
            ("example", "Whistleblower triage and management override safeguards verified.", "target"),
            ("tryIt", "Resilient control environment shielding process-level operations.", "final")
        ],
        [
            ("intro", "Balance sheet accounts interrogated against materiality thresholds.", "top"),
            ("say1", "Assessing account volume complexity and valuation subjectivity.", "qual"),
            ("example", "Mapping identified financial risks to relevant ledger assertions.", "target"),
            ("tryIt", "Targeted account scoping focusing substantive testing procedures.", "final")
        ],
        [
            ("intro", "Automated application controls executing business logic in ledgers.", "top"),
            ("say1", "Verifying underlying technical general controls remain uncompromised.", "qual"),
            ("example", "Establishing baseline configuration to permit control benchmarking.", "target"),
            ("tryIt", "Validated automated controls streamlining recurring audit cycles.", "final")
        ],
        [
            ("intro", "Enterprise trial balance data ingested into scoping engines.", "top"),
            ("say1", "Automated calculation of planning and performance materiality.", "qual"),
            ("example", "Correlating entity-level strength with process testing intensity.", "target"),
            ("tryIt", "Defensible integrated audit plan aligned with statutory standards.", "final")
        ]
    ],
    43: [
        [
            ("intro", "Enterprise digital architecture supporting corporate ledger balances.", "top"),
            ("say1", "Symbiotic relationship connecting technical and business controls.", "qual"),
            ("example", "Scoping applications databases operating systems and cloud hosts.", "target"),
            ("tryIt", "Robust technical foundation ensuring automated control reliance.", "final")
        ],
        [
            ("intro", "User access permissions granted across enterprise financial systems.", "top"),
            ("say1", "Testing user provisioning de-provisioning and periodic reviews.", "qual"),
            ("example", "Detecting toxic role conflicts between master files and payments.", "target"),
            ("tryIt", "Segregated logical access preventing internal ledger manipulation.", "final")
        ],
        [
            ("intro", "Software code modifications submitted for production migration.", "top"),
            ("say1", "Enforcing segregated development environments and approval boards.", "qual"),
            ("example", "Prohibiting direct developer code transports into live ledgers.", "target"),
            ("tryIt", "Mathematical code integrity preserved through controlled releases.", "final")
        ],
        [
            ("intro", "Automated batch processing jobs executing overnight ledger runs.", "top"),
            ("say1", "Monitoring job execution alerts and annual backup restore drills.", "qual"),
            ("example", "Evaluating third-party cloud service organization control reports.", "target"),
            ("tryIt", "Resilient continuous operations ensuring uninterrupted reporting.", "final")
        ],
        [
            ("intro", "Comprehensive enterprise IT infrastructure scanned by audit tools.", "top"),
            ("say1", "Cross-referencing human resources records against active users.", "qual"),
            ("example", "Reconciling production transports against authorized tickets.", "target"),
            ("tryIt", "Uncompromised technical assurance dossier clearing inspections.", "final")
        ]
    ],
    44: [
        [
            ("intro", "Identified control exceptions evaluated through diagnostic matrices.", "top"),
            ("say1", "Distinguishing control deficiencies from significant deficiencies.", "qual"),
            ("example", "Prospective evaluation of misstatement likelihood and magnitude.", "target"),
            ("tryIt", "Precise statutory classification guiding public disclosure actions.", "final")
        ],
        [
            ("intro", "Qualitative circumstances contextualizing raw numerical exceptions.", "top"),
            ("say1", "Examining senior executive fraud and prior period restatements.", "qual"),
            ("example", "Applying prudent official standards to evaluate control health.", "target"),
            ("tryIt", "Objective severity determinations upholding capital market trust.", "final")
        ],
        [
            ("intro", "Proffered compensating controls evaluated for operational precision.", "top"),
            ("say1", "Testing detection thresholds against performance materiality caps.", "qual"),
            ("example", "Aggregating multi-deficiency interactions across financial cycles.", "target"),
            ("tryIt", "Comprehensive aggregation analysis exposing systemic vulnerabilities.", "final")
        ],
        [
            ("intro", "Control remediation initiatives deployed by corporate management.", "top"),
            ("say1", "Enforcing adequate operational seasoning windows prior to year-end.", "qual"),
            ("example", "Executing roll-forward testing to verify ongoing effectiveness.", "target"),
            ("tryIt", "Validated remediation restoring internal control effectiveness.", "final")
        ],
        [
            ("intro", "Multi-cycle control exceptions ingested into diagnostic engines.", "top"),
            ("say1", "Automated screening against statutory rebuttable presumption rules.", "qual"),
            ("example", "Validating remediation seasoning runway and roll-forward proofs.", "target"),
            ("tryIt", "Authoritative internal control audit opinion ready for filing.", "final")
        ]
    ],
    45: [
        [
            ("intro", "Global aerospace conglomerate launching integrated assurance review.", "top"),
            ("say1", "Establishing planning and performance materiality across accounts.", "qual"),
            ("example", "Deploying integrated audit teams across three global service hubs.", "target"),
            ("tryIt", "Comprehensive war room framework directing multi-domain fieldwork.", "final")
        ],
        [
            ("intro", "Corporate governance structures and digital infrastructure audited.", "top"),
            ("say1", "Reconciling active user populations against personnel terminations.", "qual"),
            ("example", "Flagging emergency code transports deployed without formal review.", "target"),
            ("tryIt", "Technical audit findings defining downstream testing requirements.", "final")
        ],
        [
            ("intro", "Core business process transactions traced through ledger systems.", "top"),
            ("say1", "Uncovering automated matching breakdowns and unapproved journals.", "qual"),
            ("example", "Rejecting imprecise executive flux analyses as compensating controls.", "target"),
            ("tryIt", "Rigorous process testing substantiating operational vulnerabilities.", "final")
        ],
        [
            ("intro", "Multi-cycle control exceptions triaged through severity matrices.", "top"),
            ("say1", "Aggregating unapproved manual journal entries into a major defect.", "qual"),
            ("example", "Testing automated hard-lock remediation over adequate seasoning.", "target"),
            ("tryIt", "Verified year-end remediation extinguishing the material weakness.", "final")
        ],
        [
            ("intro", "Consolidated audit telemetry synthesized across five audit phases.", "top"),
            ("say1", "Presenting authoritative audit conclusions to the audit committee.", "qual"),
            ("example", "Certifying clean opinions on financial statements and controls.", "target"),
            ("tryIt", "Elite capstone assurance dossier proving uncompromised quality.", "final")
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

# 4. Append Days 41-45 to bcomAudLongLessons.ts
lessons_file = os.path.join(os.getcwd(), 'src', 'lib', 'data', 'bcomAudLongLessons.ts')

with open(lessons_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Check if Day 41 already present
if 'day: 41' in content or '"day": 41' in content:
    print("Day 41 already exists in bcomAudLongLessons.ts. Skipping append.")
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

    print(f"Successfully appended Block 9 (Days 41-45) to {lessons_file}!")

print("\n=== BLOCK 9 ASSEMBLY COMPLETE! ===")
