# -*- coding: utf-8 -*-
"""
Assemble Month 2 Block 9 (Days 41-45 & Milestone 9 Capstone)
Course: Strategic Marketing & Brand Systems (bcom-marketing)
Files affected:
- src/lib/data/lessonVisuals/bcom-marketing/day-41.json to day-45.json
- src/lib/data/bcomMktLongLessons.ts
"""

import json
import hashlib
import os
import sys

sys.path.insert(0, os.getcwd())
sys.path.insert(0, os.path.join(os.getcwd(), 'scripts', 'branch_b'))

from build_block9_mkt import day41_data, day42_data
from build_block9_days43_45 import day43_data
from day44_data import day44_data
from day45_data import day45_data

days = [day41_data, day42_data, day43_data, day44_data, day45_data]

# 1. Audit Word Counts and Invariants
print("=== AUDITING BLOCK 9 INVARIANTS (DAYS 41 TO 45) ===")
total_block_words = 0
for d in days:
    day_num = d["day"]
    parts = d["parts"]
    assert len(parts) == 5, f"Day {day_num} must have 5 parts, found {len(parts)}"
    assert d.get("coursePrefix") == "bcom-marketing", f"Day {day_num} must have coursePrefix 'bcom-marketing'"
    assert d.get("minutes") in [45, 55], f"Day {day_num} minutes must be 45 or 55"
    assert d.get("goal"), f"Day {day_num} missing goal"
    assert d.get("recap"), f"Day {day_num} missing recap"
    
    day_words = 0
    for p_idx, part in enumerate(parts):
        # strip 'id' if present
        if "id" in part:
            del part["id"]
            
        wc = sum(len(p.split()) for p in part["say"])
        day_words += wc
        print(f"Day {day_num} Part {p_idx+1}: {part['title']} -> {wc} words")
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
step_metadata = {
    41: [
        [
            ("intro", "Total raw prospect cohort entering customer acquisition funnel.", "top"),
            ("say1", "Infinite horizon retention mathematics expanding active lifetime.", "qual"),
            ("example", "Discounted cash flow model projecting future customer equity.", "target"),
            ("tryIt", "Final compounding customer equity maximizing balance sheet value.", "final")
        ],
        [
            ("intro", "Initial active subscriber cohort monitored across time intervals.", "top"),
            ("say1", "Survival probability curve modeling gradual customer retention.", "qual"),
            ("example", "Weibull hazard rate identifying acute early onboarding friction.", "target"),
            ("tryIt", "Final stabilized customer base delivering predictable cash flows.", "final")
        ],
        [
            ("intro", "Total gross marketing capital deployed across prospect segments.", "top"),
            ("say1", "Qualified acquired customer cohort generating margin dollars.", "qual"),
            ("example", "Balanced ratio preserving growth without capital destruction.", "target"),
            ("tryIt", "Final rapid payback period recycling capital for expansion.", "final")
        ],
        [
            ("intro", "Entire enterprise customer database evaluated across dimensions.", "top"),
            ("say1", "Recency frequency and monetary scoring segmenting client base.", "qual"),
            ("example", "Markov transition matrix projecting segment migration paths.", "target"),
            ("tryIt", "Final targeted loyalty treatment preserving champion accounts.", "final")
        ],
        [
            ("intro", "Total commercial retention budget allocated across accounts.", "top"),
            ("say1", "Whale curve accounting identifying high profit customer tiers.", "qual"),
            ("example", "Dedicated account management serving high lifetime value tiers.", "target"),
            ("tryIt", "Final optimized customer portfolio maximizing enterprise value.", "final")
        ]
    ],
    42: [
        [
            ("intro", "Market baseline price testing prospect demand responsiveness.", "top"),
            ("say1", "Point elasticity modeling identifying optimal price boundaries.", "qual"),
            ("example", "Lerner index markup maximizing operational gross contribution.", "target"),
            ("tryIt", "Final profit maximizing price floor capturing consumer surplus.", "final")
        ],
        [
            ("intro", "Total inbound product inquiries monitored in digital systems.", "top"),
            ("say1", "Algorithmic demand surge detection evaluating buying pressure.", "qual"),
            ("example", "Automated dynamic price adjustment balancing order volume.", "target"),
            ("tryIt", "Final capacity utilization clearing inventory at peak margins.", "final")
        ],
        [
            ("intro", "Total perishable capacity units released into booking windows.", "top"),
            ("say1", "Protection level calculations reserving space for late buyers.", "qual"),
            ("example", "Littlewood boundary rule rejecting low fare dilution risk.", "target"),
            ("tryIt", "Final high yield seat allocations capturing premium prices.", "final")
        ],
        [
            ("intro", "Total market landscape evaluating competitor baseline cost.", "top"),
            ("say1", "Economic value calculation measuring customer efficiency gains.", "qual"),
            ("example", "Differentiation value sharing dividing surplus with client.", "target"),
            ("tryIt", "Final value based pricing capturing defensible contract fees.", "final")
        ],
        [
            ("intro", "Prospect audience evaluating software subscription tiers.", "top"),
            ("say1", "Core entry tier capturing price sensitive market segments.", "qual"),
            ("example", "Flagship enterprise tier offering optimal commercial value.", "target"),
            ("tryIt", "Final mission critical tier securing top tier client contracts.", "final")
        ]
    ],
    43: [
        [
            ("intro", "Initial enterprise organizational requirement entering review.", "top"),
            ("say1", "Buying center role mapping aligning diverse stakeholder goals.", "qual"),
            ("example", "Multi threaded engagement resolving gatekeeper objections.", "target"),
            ("tryIt", "Final executive committee consensus unlocking contract signoff.", "final")
        ],
        [
            ("intro", "Total corporate market filtered through ideal customer criteria.", "top"),
            ("say1", "Tiered account allocation matching marketing resources to value.", "qual"),
            ("example", "Bespoke account value blueprints engaging enterprise buyers.", "target"),
            ("tryIt", "Final strategic account conversion generating marquee contracts.", "final")
        ],
        [
            ("intro", "Digital intent surge detection identifying active buying signals.", "top"),
            ("say1", "Demand unit qualification validating organizational interest.", "qual"),
            ("example", "Automated service level agreement routing hot target accounts.", "target"),
            ("tryIt", "Final pipeline acceleration converting verified opportunities.", "final")
        ],
        [
            ("intro", "Total inbound enterprise inquiry pool entering scoring engine.", "top"),
            ("say1", "Explicit firmographic fit combined with implicit intent points.", "qual"),
            ("example", "Marketing qualified lead handoff enforcing sales response.", "target"),
            ("tryIt", "Final rapid sales follow up maximizing pipeline conversion.", "final")
        ],
        [
            ("intro", "Enterprise opportunity entering complex evaluation pipeline.", "top"),
            ("say1", "Concurrent technical financial and legal evaluation streams.", "qual"),
            ("example", "Executive sponsorship securing multi stakeholder conviction.", "target"),
            ("tryIt", "Final sales cycle compression unlocking high contract value.", "final")
        ]
    ],
    44: [
        [
            ("intro", "Initial corporate crisis event detected across media channels.", "top"),
            ("say1", "Crisis cluster attribution evaluating enterprise culpability.", "qual"),
            ("example", "Situational communication posture selected to arrest outrage.", "target"),
            ("tryIt", "Final transparent crisis response preserving brand goodwill.", "final")
        ],
        [
            ("intro", "Crisis telemetry trigger mobilizing executive incident command.", "top"),
            ("say1", "Golden hour protocol launching pre staged dark site portal.", "qual"),
            ("example", "Centralized media relations desk coordinating hourly updates.", "target"),
            ("tryIt", "Final unified corporate messaging halting speculative panic.", "final")
        ],
        [
            ("intro", "Viral outrage wave expanding across real time social platforms.", "top"),
            ("say1", "Social listening telemetry tracking sentiment velocity indices.", "qual"),
            ("example", "Targeted influencer engagement clarifying verified facts.", "target"),
            ("tryIt", "Final outrage de escalation restoring normal discourse tone.", "final")
        ],
        [
            ("intro", "Material corporate event triggering statutory disclosure audit.", "top"),
            ("say1", "Regulatory compliance coordination preparing public filings.", "qual"),
            ("example", "Strategic empathy messaging balancing legal and public needs.", "target"),
            ("tryIt", "Final verified regulatory submission fulfilling legal duties.", "final")
        ],
        [
            ("intro", "Post crisis enterprise landscape evaluating brand damage.", "top"),
            ("say1", "Comprehensive structural restitution program announced.", "qual"),
            ("example", "Independent oversight board verifying operational reforms.", "target"),
            ("tryIt", "Final corporate reputation score recovering to baseline levels.", "final")
        ]
    ],
    45: [
        [
            ("intro", "Enterprise client cohort audit identifying churn leakages.", "top"),
            ("say1", "Predictive health scoring engine detecting early churn risks.", "qual"),
            ("example", "Red account intervention protocol deploying expert architects.", "target"),
            ("tryIt", "Final cohort net retention rate expanding past baseline goals.", "final")
        ],
        [
            ("intro", "Legacy flat price software accounts audited across portfolio.", "top"),
            ("say1", "Price sensitivity survey determining optimal willingness to pay.", "qual"),
            ("example", "Value metric migration tying pricing to freight throughput.", "target"),
            ("tryIt", "Final three tier pricing adoption lifting recurring revenues.", "final")
        ],
        [
            ("intro", "Target marquee enterprise accounts identified for outbound push.", "top"),
            ("say1", "Buying center orchestration engaging all executive roles.", "qual"),
            ("example", "Intent velocity telemetry triggering executive briefings.", "target"),
            ("tryIt", "Final sales cycle compression securing major SaaS contracts.", "final")
        ],
        [
            ("intro", "Critical global database outage triggering emergency war room.", "top"),
            ("say1", "Golden hour holding statement calming affected client networks.", "qual"),
            ("example", "Comprehensive customer restitution charter deployed publicly.", "target"),
            ("tryIt", "Final client defection prevented and corporate trust salvaged.", "final")
        ],
        [
            ("intro", "Comprehensive turnaround portfolio presented to executive board.", "top"),
            ("say1", "Retention pricing and account based marketing gains proven.", "qual"),
            ("example", "Market capitalization expansion confirmed by financial metrics.", "target"),
            ("tryIt", "Final master credential conferred by unanimous board decree.", "final")
        ]
    ]
}

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

# 4. Append Days 41-45 to bcomMktLongLessons.ts
lessons_file = os.path.join(os.getcwd(), 'src', 'lib', 'data', 'bcomMktLongLessons.ts')

with open(lessons_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Check if Day 41 already present
if 'day: 41' in content or '"day": 41' in content:
    print("Day 41 already exists in bcomMktLongLessons.ts. Skipping append.")
else:
    last_bracket_idx = content.rfind('];')
    if last_bracket_idx == -1:
        print("Could not find closing '];' in bcomMktLongLessons.ts!")
        sys.exit(1)

    formatted_days = []
    for d in days:
        json_str = json.dumps(d, indent=2, ensure_ascii=False)
        formatted_days.append(json_str)

    days_payload = ",\n" + ",\n".join(formatted_days) + "\n];\n"
    new_content = content[:last_bracket_idx].rstrip() + days_payload

    with open(lessons_file, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"Successfully appended Block 9 (Days 41-45) to {lessons_file}!")

print("\n=== BLOCK 9 ASSEMBLY COMPLETE! ===")
