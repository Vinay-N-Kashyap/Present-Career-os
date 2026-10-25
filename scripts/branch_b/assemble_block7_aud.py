# -*- coding: utf-8 -*-
"""
Assemble Month 2 Block 7 (Days 31-35 & Milestone 7 Capstone)
Course: Statutory Audit & Corporate Assurance (bcom_aud)
Files affected:
- src/lib/data/lessonVisuals/bcom_aud/day-31.json to day-35.json
- src/lib/data/bcomAudLongLessons.ts
"""

import json
import hashlib
import os
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

print(f"\nALL 25 PARTS PASSED! Total Block 7 Words: {total_block_words} words (avg {total_block_words/5:.1f} words/day)\n")

# 2. Captions mapping for Gate v2 visual envelopes
# Strict rules: ending with period, <= 75 chars, NO digits!
step_metadata = {
    31: [
        [
            ("intro", "Gross transactional volume passing into statutory assurance reviews.", "top"),
            ("say1", "Spectrum of inherent risk mapping complexity and subjective estimates.", "qual"),
            ("example", "Audit risk model deriving allowable detection risk for accounts.", "target"),
            ("tryIt", "Surgically focused substantive testing plans protecting public markets.", "final")
        ],
        [
            ("intro", "Enterprise resource planning databases recording commercial journal lines.", "top"),
            ("say1", "General IT controls securing logical access and change authorizations.", "qual"),
            ("example", "Automated application controls verified through infrastructure testing.", "target"),
            ("tryIt", "Reliable automated processing reducing substantive sample sizes.", "final")
        ],
        [
            ("intro", "Broad financial statement accounts evaluated by external assurance teams.", "top"),
            ("say1", "Assertion level risk traceability mapping occurrence and valuation.", "qual"),
            ("example", "Significant risks isolated for specialized forensic modeling review.", "target"),
            ("tryIt", "Transparent audit paper trail satisfying international oversight bodies.", "final")
        ],
        [
            ("intro", "Corporate business model interacting with volatile market conditions.", "top"),
            ("say1", "Debt covenant headroom analysis quantifying management bias pressures.", "qual"),
            ("example", "Related party transactions screened for commercial economic substance.", "target"),
            ("tryIt", "Preemptive fraud risk detection penetrating aggressive reporting.", "final")
        ],
        [
            ("intro", "Multi divisional general ledger balances ingested by audit engines.", "top"),
            ("say1", "Algorithmic inherent risk scoring evaluating multidimensional vectors.", "qual"),
            ("example", "Dynamic detection risk formulas allocating technical specialists.", "target"),
            ("tryIt", "Objective risk assessment memorandum approved by lead audit partners.", "final")
        ]
    ],
    32: [
        [
            ("intro", "Consolidated corporate financial records submitted for statutory audit.", "top"),
            ("say1", "Quantitative benchmark thresholds establishing initial audit scope.", "qual"),
            ("example", "Qualitative materiality triggers capturing debt covenant violations.", "target"),
            ("tryIt", "Balanced materiality baseline protecting reasonable investor decisions.", "final")
        ],
        [
            ("intro", "Alternative financial metrics evaluated across commercial entities.", "top"),
            ("say1", "Normalized operating earnings isolating sustainable ongoing scale.", "qual"),
            ("example", "Revenue and asset benchmarks applied for volatile growth sectors.", "target"),
            ("tryIt", "Defensible planning materiality documented in the engagement file.", "final")
        ],
        [
            ("intro", "Overall financial statement materiality governing consolidated accounts.", "top"),
            ("say1", "Conservative performance haircuts mitigating cumulative error risks.", "qual"),
            ("example", "Tolerable misstatement limits calibrating substantive sample sizes.", "target"),
            ("tryIt", "Controlled aggregation risk ensuring uncompromised audit precision.", "final")
        ],
        [
            ("intro", "Audit differences uncovered across transaction sample testing.", "top"),
            ("say1", "Clearly trivial thresholds dismissing unmistakably trifling items.", "qual"),
            ("example", "Summary of unadjusted differences accumulating qualifying variances.", "target"),
            ("tryIt", "Executive schedule of uncorrected errors presented to the board.", "final")
        ],
        [
            ("intro", "Consolidated enterprise balance sheet audited by assurance systems.", "top"),
            ("say1", "Multi benchmark decision engines selecting statutory reference points.", "qual"),
            ("example", "Automated haircut algorithms adapting to internal control scores.", "target"),
            ("tryIt", "Certified materiality strategy memorandum delivered to regulators.", "final")
        ]
    ],
    33: [
        [
            ("intro", "Assessed risks of material misstatement categorized by assurance teams.", "top"),
            ("say1", "Overall financial statement responses deploying technical specialists.", "qual"),
            ("example", "Assertion level audit programs tailoring tests of details and analytics.", "target"),
            ("tryIt", "Comprehensive assurance framework reducing residual audit risk.", "final")
        ],
        [
            ("intro", "Internal accounting control procedures operating across business cycles.", "top"),
            ("say1", "Attribute sampling evaluating manual managerial approval signatures.", "qual"),
            ("example", "Automated controls validated via certified general computer systems.", "target"),
            ("tryIt", "Verified control effectiveness justifying substantive work reductions.", "final")
        ],
        [
            ("intro", "High volume predictable business revenues evaluated by auditors.", "top"),
            ("say1", "Independent mathematical expectations constructed from baseline data.", "qual"),
            ("example", "Tolerable difference boundaries isolating material account variances.", "target"),
            ("tryIt", "Corroborated analytical procedures providing efficient substantive proof.", "final")
        ],
        [
            ("intro", "General ledger balances requiring empirical documentary verification.", "top"),
            ("say1", "Directional testing enforcing vouching and tracing protocols.", "qual"),
            ("example", "Dual purpose testing concurrently evaluating controls and balances.", "target"),
            ("tryIt", "Unshakeable empirical evidence confirming balance sheet assertions.", "final")
        ],
        [
            ("intro", "Enterprise operating cycles evaluated across global subsidiaries.", "top"),
            ("say1", "Dynamic testing mix balancing analytics and detailed inspection.", "qual"),
            ("example", "Statistical sampling formulas deriving required substantive sizes.", "target"),
            ("tryIt", "Defensible fieldwork execution plan satisfying international standards.", "final")
        ]
    ],
    34: [
        [
            ("intro", "Corporate financial reporting environment subject to fraud evaluation.", "top"),
            ("say1", "Fraud triangle analysis identifying executive pressures and motives.", "qual"),
            ("example", "Presumption of fraud in revenue recognition mandating forensic tests.", "target"),
            ("tryIt", "Heightened professional skepticism uncovering covert manipulations.", "final")
        ],
        [
            ("intro", "Massive general ledger databases containing millions of transactions.", "top"),
            ("say1", "Automated anomaly filters detecting weekend and executive entries.", "qual"),
            ("example", "Benford digital frequency analysis plotting leading digit patterns.", "target"),
            ("tryIt", "Surgically flagged journal lines subjected to voucher subpoena.", "final")
        ],
        [
            ("intro", "Subjective management accounting estimates and corporate provisions.", "top"),
            ("say1", "Retrospective reviews comparing past estimates to realized outcomes.", "qual"),
            ("example", "Cookie jar reserve patterns exposed across alternating fiscal cycles.", "target"),
            ("tryIt", "Independent valuation ranges dismantling biased accounting reserves.", "final")
        ],
        [
            ("intro", "Complex corporate transactions negotiated outside ordinary operations.", "top"),
            ("say1", "Forensic investigations scrutinizing counterparty economic substance.", "qual"),
            ("example", "Confidential whistleblower allegations corroborated by audit teams.", "target"),
            ("tryIt", "Decisive governance escalations shielding investors from sham schemes.", "final")
        ],
        [
            ("intro", "Enterprise transaction populations scanned by forensic engines.", "top"),
            ("say1", "Multi factor algorithms synthesizing anomalies and biased reserves.", "qual"),
            ("example", "Automated management override alerts flagging critical exposures.", "target"),
            ("tryIt", "Comprehensive fraud dossier empowering independent board actions.", "final")
        ]
    ],
    35: [
        [
            ("intro", "Multi billion dollar conglomerate entering statutory assurance reviews.", "top"),
            ("say1", "Debt covenant proximity and bonus cliffs activating fraud risks.", "qual"),
            ("example", "Compromised general IT controls demanding substantive expansions.", "target"),
            ("tryIt", "Lead partner executive strategy directing war room investigations.", "final")
        ],
        [
            ("intro", "Complex multi divisional operational accounts assessed for inherent risk.", "top"),
            ("say1", "Severe general IT weaknesses forcing control risk to maximum tiers.", "qual"),
            ("example", "Significant risks isolated across long term construction and reserves.", "target"),
            ("tryIt", "Rigorous detection risk calibration dictating audit fieldwork scope.", "final")
        ],
        [
            ("intro", "Consolidated group financial metrics evaluated for user materiality.", "top"),
            ("say1", "Normalized pre tax earnings establishing overall planning thresholds.", "qual"),
            ("example", "Conservative performance haircuts containing multi account risk.", "target"),
            ("tryIt", "Specific materiality benchmarks protecting sensitive disclosures.", "final")
        ],
        [
            ("intro", "Full general ledger population interrogated via automated analytics.", "top"),
            ("say1", "Forensic queries exposing fictitious revenue and unauthorized entries.", "qual"),
            ("example", "Retrospective reserve reviews uncovering intentional income smoothing.", "target"),
            ("tryIt", "Accumulated audit differences breaching overall group materiality.", "final")
        ],
        [
            ("intro", "Lead audit engagement partner presenting findings to the board.", "top"),
            ("say1", "Refusal of horse trading maintaining uncompromised auditor integrity.", "qual"),
            ("example", "Audit committee ordering full adjustment of all identified errors.", "target"),
            ("tryIt", "Unqualified opinion issued on restated records with governance notes.", "final")
        ]
    ]
}

# Validate captions strictly
print("=== VALIDATING GATE V2 VISUAL CAPTIONS ===")
for day_num, parts_meta in step_metadata.items():
    assert len(parts_meta) == 5, f"Day {day_num} must have 5 parts meta, found {len(parts_meta)}"
    for p_idx, steps_meta in enumerate(parts_meta):
        assert len(steps_meta) == 4, f"Day {day_num} Part {p_idx+1} must have 4 steps meta"
        for at_step, caption, active_stage in steps_meta:
            assert at_step in ["intro", "say1", "example", "tryIt"], f"Invalid at_step: {at_step}"
            assert active_stage in ["top", "qual", "target", "final"], f"Invalid active_stage: {active_stage}"
            assert caption.endswith("."), f"Caption must end with a period: '{caption}'"
            assert len(caption) <= 75, f"Caption too long ({len(caption)} > 75 chars): '{caption}'"
            assert not any(char.isdigit() for char in caption), f"Caption contains digits: '{caption}'"

print("All 100 captions 100% compliant with Gate v2 visual rules!\n")

# Standard stages definition for funnel template
standard_stages = [
    {
        "id": "top",
        "label": "Gross Population Scope",
        "value": 50000,
        "percentage": 100,
        "tone": "data"
    },
    {
        "id": "qual",
        "label": "Risk Filtered Population",
        "value": 25000,
        "percentage": 50,
        "dropoffRate": 50,
        "tone": "ok"
    },
    {
        "id": "target",
        "label": "Substantive Sample Focus",
        "value": 10000,
        "percentage": 20,
        "dropoffRate": 60,
        "tone": "ok"
    },
    {
        "id": "final",
        "label": "Audited Statutory Assurance",
        "value": 4000,
        "percentage": 8,
        "dropoffRate": 60,
        "tone": "idle"
    }
]

# 3. Generate Gate v2 Visual Files
visuals_dir = os.path.join(os.getcwd(), 'src', 'lib', 'data', 'lessonVisuals', 'bcom_aud')
os.makedirs(visuals_dir, exist_ok=True)

print("=== GENERATING GATE V2 VISUAL ENVELOPES ===")
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

# 4. Append Days 31-35 to bcomAudLongLessons.ts
lessons_file = os.path.join(os.getcwd(), 'src', 'lib', 'data', 'bcomAudLongLessons.ts')

with open(lessons_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Check if Day 31 already present
if 'day: 31' in content or '"day": 31' in content:
    print("Day 31 already exists in bcomAudLongLessons.ts. Skipping append.")
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

    print(f"Successfully appended Block 7 (Days 31-35) to {lessons_file}!")

print("\n=== BLOCK 7 ASSEMBLY COMPLETE! ===")
