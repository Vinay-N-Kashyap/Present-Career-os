# -*- coding: utf-8 -*-
"""
Assemble Month 2 Block 12 (Days 56-60 & Grand Master Capstone)
Course: Statutory Audit & Corporate Assurance (bcom_aud)
Files affected:
- src/lib/data/lessonVisuals/bcom_aud/day-56.json to day-60.json
- src/lib/data/bcomAudLongLessons.ts
"""

import json
import hashlib
import os
import sys

sys.path.insert(0, os.getcwd())
sys.path.insert(0, os.path.join(os.getcwd(), 'scripts', 'branch_b'))

# Load day datasets
with open('scripts/branch_b/day56_data.json', 'r', encoding='utf-8') as f:
    day56_data = json.load(f)
with open('scripts/branch_b/day57_data.json', 'r', encoding='utf-8') as f:
    day57_data = json.load(f)
with open('scripts/branch_b/day58_data.json', 'r', encoding='utf-8') as f:
    day58_data = json.load(f)
with open('scripts/branch_b/day59_data.json', 'r', encoding='utf-8') as f:
    day59_data = json.load(f)
with open('scripts/branch_b/day60_data.json', 'r', encoding='utf-8') as f:
    day60_data = json.load(f)

days = [day56_data, day57_data, day58_data, day59_data, day60_data]

# 1. Audit Word Counts and Invariants
print("=== AUDITING BLOCK 12 INVARIANTS (DAYS 56 TO 60) ===")
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

print(f"\nALL 25 PARTS PASSED! Total Block 12 Words: {total_block_words} words (avg {total_block_words/5:.1f} words/day)\n")

# 2. Captions mapping for Gate v2 visual envelopes
# Strict rules: ending with period, <= 75 chars, NO digits!
step_metadata = {
    56: [
        [
            ("intro", "Modern independent auditor reporting standards initiated.", "top"),
            ("say1", "Mandating opinion placement at the start of the report.", "qual"),
            ("example", "Auditor clarifies reasonable assurance over financial statements.", "target"),
            ("tryIt", "Standard reporting templates provide capital market transparency.", "final")
        ],
        [
            ("intro", "Standard unqualified report architecture examined in detail.", "top"),
            ("say1", "Verifying mandatory registered public accounting firm titles.", "qual"),
            ("example", "Affirming independent status under federal securities regulations.", "target"),
            ("tryIt", "Auditor tenure disclosure documented in concluding report sections.", "final")
        ],
        [
            ("intro", "International auditing standards harmonized for cross border filings.", "top"),
            ("say1", "Contrasting true and fair view with fair presentation frameworks.", "qual"),
            ("example", "Structuring component sections under global statutory formats.", "target"),
            ("tryIt", "International audit report templates cleared for cross border use.", "final")
        ],
        [
            ("intro", "Explanatory paragraphs evaluated under regulatory standards.", "top"),
            ("say1", "Distinguishing non discretionary explanations from emphasis of matter.", "qual"),
            ("example", "Highlighting accounting changes and restatements without modifying.", "target"),
            ("tryIt", "Appropriate explanatory paragraphs added to unmodified reports.", "final")
        ],
        [
            ("intro", "Enterprise auditor report generation engine initialized.", "top"),
            ("say1", "Validating structural report sections against regulatory rules.", "qual"),
            ("example", "Assembling unqualified opinion with mandatory explanatory text.", "target"),
            ("tryIt", "Finalized independent auditor report ready for regulatory release.", "final")
        ]
    ],
    57: [
        [
            ("intro", "Regulatory origin of critical and key audit matters examined.", "top"),
            ("say1", "Eliminating boiler plate language through tailored disclosures.", "qual"),
            ("example", "Communicating significant matters directly to financial markets.", "target"),
            ("tryIt", "Enhanced auditor reporting provides insights into audit judgment.", "final")
        ],
        [
            ("intro", "Three step statutory evaluation filter applied to audit matters.", "top"),
            ("say1", "Filtering accounts communicated to the audit committee.", "qual"),
            ("example", "Isolating complex items requiring especially challenging judgment.", "target"),
            ("tryIt", "Documenting matters qualifying as critical audit matters.", "final")
        ],
        [
            ("intro", "Four part structural framework applied to drafting audit matters.", "top"),
            ("say1", "Identifying relevant financial statement accounts and disclosures.", "qual"),
            ("example", "Describing principal considerations that led to audit determination.", "target"),
            ("tryIt", "Summarizing specific procedures performed to address the matter.", "final")
        ],
        [
            ("intro", "International key audit matters compared with domestic standards.", "top"),
            ("say1", "Evaluating scope differences across public reporting frameworks.", "qual"),
            ("example", "Addressing going concern matters within designated report sections.", "target"),
            ("tryIt", "Dual filing dockets harmonized across international standards.", "final")
        ],
        [
            ("intro", "Enterprise audit matter simulation platform launched.", "top"),
            ("say1", "Evaluating candidate audit matters across high risk accounts.", "qual"),
            ("example", "Drafting bespoke critical audit matters for complex estimates.", "target"),
            ("tryIt", "Critical audit matters docket finalized for audit committee review.", "final")
        ]
    ],
    58: [
        [
            ("intro", "Audit opinion modification decision matrix established.", "top"),
            ("say1", "Distinguishing material misstatements from pervasive conditions.", "qual"),
            ("example", "Evaluating departures from financial reporting frameworks.", "target"),
            ("tryIt", "Selecting appropriate audit opinion based on evidential findings.", "final")
        ],
        [
            ("intro", "Qualified opinion criteria analyzed under statutory rules.", "top"),
            ("say1", "Drafting except for explanatory paragraphs before the opinion.", "qual"),
            ("example", "Quantifying financial statement effects of uncorrected departures.", "target"),
            ("tryIt", "Qualified audit opinion structured to communicate specific errors.", "final")
        ],
        [
            ("intro", "Adverse opinion standards applied to pervasively distorted books.", "top"),
            ("say1", "Evaluating pervasive misstatements undermining financial integrity.", "qual"),
            ("example", "Stating financial statements do not present fairly in any respect.", "target"),
            ("tryIt", "Adverse report issued when distortions contaminate entire reports.", "final")
        ],
        [
            ("intro", "Disclaimer of opinion conditions evaluated under statutory rules.", "top"),
            ("say1", "Identifying severe scope limitations preventing audit conclusions.", "qual"),
            ("example", "Refusal to sign representation letters triggering report disclaimer.", "target"),
            ("tryIt", "Auditor declines to express an opinion due to lack of evidence.", "final")
        ],
        [
            ("intro", "Enterprise audit opinion modification engine initialized.", "top"),
            ("say1", "Processing audit scenarios across scope and accounting errors.", "qual"),
            ("example", "Determining precise opinion type and drafting explanatory text.", "target"),
            ("tryIt", "Modified auditor report finalized for regulatory communication.", "final")
        ]
    ],
    59: [
        [
            ("intro", "Post issuance discovery of facts investigated under audit rules.", "top"),
            ("say1", "Determining whether discovered facts existed at original report date.", "qual"),
            ("example", "Assessing whether omitted evidence would have altered audit opinion.", "target"),
            ("tryIt", "Investigating newly surfaced facts to protect financial markets.", "final")
        ],
        [
            ("intro", "Executive notification and non reliance disclosures initiated.", "top"),
            ("say1", "Advising immediate board action to issue non reliance warnings.", "qual"),
            ("example", "Filing regulatory disclosures when financial statements are flawed.", "target"),
            ("tryIt", "Independent notification dispatched if client refuses retraction.", "final")
        ],
        [
            ("intro", "Restatement taxonomy classified under accounting guidance.", "top"),
            ("say1", "Distinguishing material errors from immaterial revision items.", "qual"),
            ("example", "Evaluating prior period misstatements under dual testing methods.", "target"),
            ("tryIt", "Proper restatement mechanism selected based on materiality tests.", "final")
        ],
        [
            ("intro", "Accounting mechanics of restatement executed across periods.", "top"),
            ("say1", "Adjusting beginning retained earnings for cumulative past errors.", "qual"),
            ("example", "Disclosing restated line items and associated material weakness.", "target"),
            ("tryIt", "Restated comparative statements prepared for public reissuance.", "final")
        ],
        [
            ("intro", "Enterprise restatement governance platform launched.", "top"),
            ("say1", "Evaluating discovery of hidden liabilities and accounting fraud.", "qual"),
            ("example", "Classifying error as major restatement requiring immediate notice.", "target"),
            ("tryIt", "Restatement docket cleared for public reissuance with regulators.", "final")
        ]
    ],
    60: [
        [
            ("intro", "Global enterprise group audit war room convened.", "top"),
            ("say1", "Allocating component materiality across international hubs.", "qual"),
            ("example", "Supervising component audit teams under international standards.", "target"),
            ("tryIt", "Group audit materiality hierarchy established for all operations.", "final")
        ],
        [
            ("intro", "Worldwide consolidation and intercompany ledgers audited.", "top"),
            ("say1", "Eliminating unrealized intercompany inventory markups fully.", "qual"),
            ("example", "Testing manual consolidation journals and tax deferrals.", "target"),
            ("tryIt", "Proposed audit journal entries compiled on master summary sheet.", "final")
        ],
        [
            ("intro", "Enterprise going concern liquidity stress defense tested.", "top"),
            ("say1", "Reclassifying defaulted debt and testing operating cash runway.", "qual"),
            ("example", "Evaluating management mitigating plans under strict criteria.", "target"),
            ("tryIt", "Substantial doubt confirmed requiring statutory explanatory text.", "final")
        ],
        [
            ("intro", "Critical audit matters formulated across high risk areas.", "top"),
            ("say1", "Evaluating uncorrected misstatements against materiality limits.", "qual"),
            ("example", "Drafting bespoke matters for goodwill and complex revenue.", "target"),
            ("tryIt", "Unqualified opinion authorized with going concern disclosure.", "final")
        ],
        [
            ("intro", "Grand master war room simulator executing final clearance.", "top"),
            ("say1", "Securing signed representation letters and committee approval.", "qual"),
            ("example", "Engagement quality review partner grants concurring sign off.", "target"),
            ("tryIt", "Dual dated independent auditor report released for public filing.", "final")
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

# 4. Append Days 56-60 to bcomAudLongLessons.ts
lessons_file = os.path.join(os.getcwd(), 'src', 'lib', 'data', 'bcomAudLongLessons.ts')

with open(lessons_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Check if Day 56 already present
if 'day: 56' in content or '"day": 56' in content:
    print("Day 56 already exists in bcomAudLongLessons.ts. Skipping append.")
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

    print(f"Successfully appended Block 12 (Days 56-60) to {lessons_file}!")

print("\n=== BLOCK 12 ASSEMBLY COMPLETE! ===")
