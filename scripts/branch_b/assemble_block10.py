# -*- coding: utf-8 -*-
"""
Assemble Month 2 Block 10 (Days 46-50 & Milestone 10 Capstone)
Course: Strategic Marketing & Brand Systems (bcom-marketing)
Files affected:
- src/lib/data/lessonVisuals/bcom-marketing/day-46.json to day-50.json
- src/lib/data/bcomMktLongLessons.ts
"""

import json
import hashlib
import os
import sys
import re

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
    assert d.get("coursePrefix") == "bcom-marketing", f"Day {day_num} must have coursePrefix 'bcom-marketing'"
    assert d.get("minutes") in [45, 55, 60], f"Day {day_num} minutes must be 45, 55, or 60"
    assert d.get("goal"), f"Day {day_num} missing goal"
    assert d.get("recap"), f"Day {day_num} missing recap"
    
    day_words = 0
    for p_idx, part in enumerate(parts):
        # strip 'id' if present
        if "id" in part:
            del part["id"]
            
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
step_metadata = {
    46: [
        [
            ("intro", "Initial user visual gaze landing on unstructured page canvas.", "top"),
            ("say1", "Bottom up feature maps prioritizing luminance and color contrast.", "qual"),
            ("example", "Attentional spotlight focusing foveal vision on primary elements.", "target"),
            ("tryIt", "Optimized visual hierarchy channeling gaze to conversion points.", "final")
        ],
        [
            ("intro", "Raw eye tracking scanpath tracking initial gaze fixation point.", "top"),
            ("say1", "Gutenberg layout structuring scanpaths along natural visual axes.", "qual"),
            ("example", "Pupillometric telemetry confirming balanced mental processing.", "target"),
            ("tryIt", "Optimized layout arresting cognitive fatigue across reading steps.", "final")
        ],
        [
            ("intro", "Prospect evaluating complex multi option subscription packages.", "top"),
            ("say1", "Simplified three choice structure eliminating decision fatigue.", "qual"),
            ("example", "Asymmetric dominance decoy framing flagship bundle as premium.", "target"),
            ("tryIt", "Consumer choice converging on high margin complete package.", "final")
        ],
        [
            ("intro", "Prospect initiating digital onboarding evaluation journey.", "top"),
            ("say1", "Loss aversion messaging framing value preservation benefits.", "qual"),
            ("example", "Endowed progress indicator providing initial momentum boost.", "target"),
            ("tryIt", "Accelerated completion velocity securing active subscription.", "final")
        ],
        [
            ("intro", "Automated computer vision scanner evaluating candidate designs.", "top"),
            ("say1", "Visual saliency heatmaps highlighting cognitive clutter risks.", "qual"),
            ("example", "Iterative typographic tuning eliminating regression saccades.", "target"),
            ("tryIt", "Automated design gate certifying visual layout for production.", "final")
        ]
    ],
    47: [
        [
            ("intro", "Total customer transaction logs trapped in legacy databases.", "top"),
            ("say1", "Composable data warehouse establishing central source of truth.", "qual"),
            ("example", "Decoupled compute and storage unlocking modular flexibility.", "target"),
            ("tryIt", "Single customer view orchestrating agile digital experiences.", "final")
        ],
        [
            ("intro", "Disparate anonymous session events streaming from mobile web.", "top"),
            ("say1", "Server side telemetry proxy securing first party event streams.", "qual"),
            ("example", "Identity resolution graph stitching deterministic user keys.", "target"),
            ("tryIt", "Authoritative golden customer profile powering personalization.", "final")
        ],
        [
            ("intro", "Transformed customer intelligence stored in central warehouse.", "top"),
            ("say1", "Change data capture detecting updated customer trait deltas.", "qual"),
            ("example", "Reverse pipeline dispatching synchronized cohorts to ad tools.", "target"),
            ("tryIt", "Real time audience activation recovering defecting accounts.", "final")
        ],
        [
            ("intro", "Omnichannel customer interaction touchpoints across media paths.", "top"),
            ("say1", "Markov chain state transition matrix modeling journey paths.", "qual"),
            ("example", "Channel removal effect measuring true marginal conversions.", "target"),
            ("tryIt", "Reallocated marketing budget maximizing return on spend.", "final")
        ],
        [
            ("intro", "High volume incoming event payload stream entering gateway.", "top"),
            ("say1", "Schema validation layer trapping corrupted tracking events.", "qual"),
            ("example", "Token bucket traffic shaping smoothing downstream transfers.", "target"),
            ("tryIt", "Reliable event pipeline synchronizing audiences with low delay.", "final")
        ]
    ],
    48: [
        [
            ("intro", "Consumer subscription enrollment initiated with minimal steps.", "top"),
            ("say1", "Asymmetrical cancellation friction trapping active subscribers.", "qual"),
            ("example", "Regulatory scrutiny identifying deceptive design violations.", "target"),
            ("tryIt", "Symmetrical choice architecture restoring transparent cancel.", "final")
        ],
        [
            ("intro", "Incoming international web traffic subject to privacy laws.", "top"),
            ("say1", "Browser header signal requesting universal privacy opt out.", "qual"),
            ("example", "Equal visual prominence banner honoring consumer autonomy.", "target"),
            ("tryIt", "Verified privacy compliance protecting corporate operations.", "final")
        ],
        [
            ("intro", "Machine learning recommendation models scoring user profiles.", "top"),
            ("say1", "Disparate impact analysis auditing subgroup selection rates.", "qual"),
            ("example", "Algorithmic debiasing techniques restoring demographic parity.", "target"),
            ("tryIt", "Audited machine learning engine delivering ethical targeting.", "final")
        ],
        [
            ("intro", "Collaborative enterprise audience pools prepared for analysis.", "top"),
            ("say1", "Isolated data clean room preventing raw record disclosure.", "qual"),
            ("example", "Calibrated statistical noise preserving individual privacy.", "target"),
            ("tryIt", "Joint audience insights unlocked without sharing private data.", "final")
        ],
        [
            ("intro", "Digital deployment release candidate evaluated in pipeline.", "top"),
            ("say1", "Automated scanner checking consent parity and roach motels.", "qual"),
            ("example", "Regulatory balance sheet risk quantified across statutes.", "target"),
            ("tryIt", "Automated compliance gate blocking deceptive design changes.", "final")
        ]
    ],
    49: [
        [
            ("intro", "Audience discovering spreadable social creative snippet.", "top"),
            ("say1", "Deep narrative lore inviting devoted fans into the universe.", "qual"),
            ("example", "Cross platform story elements expanding world building depth.", "target"),
            ("tryIt", "Immersive narrative ecosystem driving sustained engagement.", "final")
        ],
        [
            ("intro", "Societal contradiction generating widespread identity tension.", "top"),
            ("say1", "Radical brand mythology performing symbolic identity solace.", "qual"),
            ("example", "Archetypal brand positioning elevating products to symbols.", "target"),
            ("tryIt", "Impregnable cultural moat insulating company from price wars.", "final")
        ],
        [
            ("intro", "Individual consumers discovering shared brand enthusiasm.", "top"),
            ("say1", "Consciousness of kind forging emotional bonds between peers.", "qual"),
            ("example", "Shared rituals and moral responsibility cementing solidarity.", "target"),
            ("tryIt", "Devoted brand community lowering churn and expanding advocacy.", "final")
        ],
        [
            ("intro", "Active customer base invited into collaborative creation.", "top"),
            ("say1", "User generated content production replacing agency overhead.", "qual"),
            ("example", "Organic referral virality accelerating customer acquisition.", "target"),
            ("tryIt", "Self sustaining co creation flywheel compounding brand reach.", "final")
        ],
        [
            ("intro", "Customer discourse streaming across diverse community hubs.", "top"),
            ("say1", "Natural language processing measuring tribal sentiment index.", "qual"),
            ("example", "Crisis resilience modeling proving brand durability in shock.", "target"),
            ("tryIt", "Valuation multiple expansion rewarding defensible brand equity.", "final")
        ]
    ],
    50: [
        [
            ("intro", "Confusing product storefront audited under eye tracking gaze.", "top"),
            ("say1", "Visual saliency re engineering channeling attention clearly.", "qual"),
            ("example", "Asymmetric decoy pricing focusing choice on premium package.", "target"),
            ("tryIt", "Streamlined onboarding funnel delivering conversion lift.", "final")
        ],
        [
            ("intro", "Fragmented customer data isolated across operational systems.", "top"),
            ("say1", "Centralized cloud warehouse establishing single customer view.", "qual"),
            ("example", "Identity graph stitching records into golden customer profile.", "target"),
            ("tryIt", "Reverse data pipeline synchronizing triggers with low latency.", "final")
        ],
        [
            ("intro", "Regulatory inquiry auditing deceptive checkout flow patterns.", "top"),
            ("say1", "Symmetrical cancellation and consent banners implemented.", "qual"),
            ("example", "Data clean room enabling secure partner collaboration.", "target"),
            ("tryIt", "Statutory penalties averted and consumer trust fully salvaged.", "final")
        ],
        [
            ("intro", "Commoditized wellness devices facing severe price pressure.", "top"),
            ("say1", "Transmedia storytelling universe launched across platforms.", "qual"),
            ("example", "Active longevity guild establishing shared tribal rituals.", "target"),
            ("tryIt", "Impregnable cultural moat slashing churn and expanding margin.", "final")
        ],
        [
            ("intro", "Turnaround strategy presented before corporate director board.", "top"),
            ("say1", "Integrated financial gains proven across all business units.", "qual"),
            ("example", "Valuation multiple expansion creating billions in net value.", "target"),
            ("tryIt", "Master executive credential conferred by unanimous decree.", "final")
        ]
    ]
}

# Verify caption invariants
for d_num, parts_meta in step_metadata.items():
    assert len(parts_meta) == 5, f"Day {d_num} metadata must have 5 parts"
    for p_i, steps in enumerate(parts_meta):
        assert len(steps) == 4, f"Day {d_num} part {p_i} must have 4 steps"
        for at_step, caption, act_stage in steps:
            assert len(caption) <= 75, f"Caption too long ({len(caption)}): {caption}"
            assert caption.endswith("."), f"Caption must end with dot: {caption}"
            assert not re.search(r'\d', caption), f"Caption contains digit: {caption}"

print("All captions verified: <= 75 chars, ends with dot, zero digits!")

# Standard stages definition for funnel template
standard_stages = [
    {
        "id": "top",
        "label": "Total Audience Reach",
        "value": 50000,
        "percentage": 100,
        "tone": "data"
    },
    {
        "id": "qual",
        "label": "Qualified Cohort Intent",
        "value": 25000,
        "percentage": 50,
        "dropoffRate": 50,
        "tone": "ok"
    },
    {
        "id": "target",
        "label": "Target Segment Evaluation",
        "value": 10000,
        "percentage": 20,
        "dropoffRate": 60,
        "tone": "ok"
    },
    {
        "id": "final",
        "label": "Retained Active Customers",
        "value": 4000,
        "percentage": 8,
        "dropoffRate": 60,
        "tone": "idle"
    }
]

# 3. Generate Gate v2 Visual Files
visuals_dir = os.path.join(os.getcwd(), 'src', 'lib', 'data', 'lessonVisuals', 'bcom-marketing')
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
                "title": f"{short_title} \u2014 Conversion Funnel",
                "steps": steps
            }
        }
        entries.append(entry)
        
    day_visual = {
        "schemaVersion": 1,
        "prefix": "bcom-marketing",
        "day": day_num,
        "entries": entries
    }
    
    out_path = os.path.join(visuals_dir, f"day-{day_num}.json")
    with open(out_path, "w", encoding="utf-8") as vf:
        json.dump(day_visual, vf, indent=2)
    print(f"Generated {out_path} with 5 entries and SHA-256 bindings.")

# 4. Append Days 46-50 to bcomMktLongLessons.ts
lessons_file = os.path.join(os.getcwd(), 'src', 'lib', 'data', 'bcomMktLongLessons.ts')

with open(lessons_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Check if Day 46 already present
if 'day: 46' in content or '"day": 46' in content:
    print("Day 46 already exists in bcomMktLongLessons.ts. Skipping append.")
else:
    last_bracket_idx = content.rfind('];')
    if last_bracket_idx == -1:
        print("Could not find closing '];' in bcomMktLongLessons.ts!")
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
        json_str = json.dumps(d, indent=2, ensure_ascii=False)
        formatted_days.append(json_str)

    days_payload = ",\n" + ",\n".join(formatted_days) + "\n];\n"
    new_content = content[:last_bracket_idx].rstrip() + days_payload

    with open(lessons_file, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"Successfully appended Block 10 (Days 46-50) to {lessons_file}!")

print("\n=== BLOCK 10 ASSEMBLY COMPLETE! ===")
