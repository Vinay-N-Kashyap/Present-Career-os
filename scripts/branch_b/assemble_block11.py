# -*- coding: utf-8 -*-
"""
Assemble Month 2 Block 11 (Days 51-55 & Milestone 11 Capstone)
Course: Strategic Marketing & Brand Systems (bcom-marketing)
Files affected:
- src/lib/data/lessonVisuals/bcom-marketing/day-51.json to day-55.json
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
    assert d.get("coursePrefix") == "bcom-marketing", f"Day {day_num} must have coursePrefix 'bcom-marketing'"
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
step_metadata = {
    51: [
        [
            ("intro", "International trademark application submitted across global offices.", "top"),
            ("say1", "Unified Madrid protocol filing harmonizing classes and jurisdictions.", "qual"),
            ("example", "Multi jurisdictional priority search verifying uncontested ownership.", "target"),
            ("tryIt", "Registered trademark rights secured across major trade territories.", "final")
        ],
        [
            ("intro", "Intangible brand assets evaluated for corporate balance sheet inclusion.", "top"),
            ("say1", "Relief from royalty methodology forecasting post tax earnings streams.", "qual"),
            ("example", "Discounted cash flow analysis establishing fair market asset valuation.", "target"),
            ("tryIt", "Certified brand valuation recognized on audited financial statements.", "final")
        ],
        [
            ("intro", "Unauthorized grey market inventory leaking across regional borders.", "top"),
            ("say1", "Customs border recordation tracking maritime cargo shipments worldwide.", "qual"),
            ("example", "Digital hash signatures confirming authentic channel provenance.", "target"),
            ("tryIt", "Seized counterfeit goods eliminating grey market revenue leakage.", "final")
        ],
        [
            ("intro", "Prospective licensee seeking geographic brand manufacturing rights.", "top"),
            ("say1", "Statutory minimum performance thresholds embedded in master contracts.", "qual"),
            ("example", "Independent third party forensic audits verifying royalty reporting.", "target"),
            ("tryIt", "Compliant licensing partnership maximizing net recurring royalty gains.", "final")
        ],
        [
            ("intro", "Global trademark portfolio subjected to legal risk stress tests.", "top"),
            ("say1", "Automated customs interdiction mitigating cross border supply fraud.", "qual"),
            ("example", "Net present value calculation aggregating protected revenue streams.", "target"),
            ("tryIt", "Enduring trademark equity shielded against international litigation.", "final")
        ]
    ],
    52: [
        [
            ("intro", "Unstructured marketing campaign requests overwhelming project teams.", "top"),
            ("say1", "Dual track agile sprints balancing discovery and rapid execution.", "qual"),
            ("example", "Continuous kanban backlog prioritization focusing team energy.", "target"),
            ("tryIt", "Streamlined sprint cadence accelerating time to market execution.", "final")
        ],
        [
            ("intro", "Fragmented legacy marketing tools creating severe operational silos.", "top"),
            ("say1", "Composable architecture decoupling frontend interfaces from databases.", "qual"),
            ("example", "Real time event brokers dispatching customer signals instantly.", "target"),
            ("tryIt", "Harmonized technical ecosystem delivering unified user journeys.", "final")
        ],
        [
            ("intro", "High volume multimedia creative assets awaiting review and approval.", "top"),
            ("say1", "Central digital asset repository applying automated usage permissions.", "qual"),
            ("example", "Algorithmic rights enforcement preventing expired media usage.", "target"),
            ("tryIt", "Verified marketing assets released for global promotional deployment.", "final")
        ],
        [
            ("intro", "Historical budget baselines driving inefficient operational allocations.", "top"),
            ("say1", "Zero based budgeting requiring bottom up return justification for spend.", "qual"),
            ("example", "Theory of constraints analysis resolving creative production blocks.", "target"),
            ("tryIt", "Optimized capital allocation maximizing working marketing investment.", "final")
        ],
        [
            ("intro", "Full enterprise marketing operation mapped across production stages.", "top"),
            ("say1", "Automated workflow engines coordinating multi functional project pods.", "qual"),
            ("example", "Cumulative flow diagrams tracking cycle time variance across sprints.", "target"),
            ("tryIt", "Highly efficient operating model delivering predictable business return.", "final")
        ]
    ],
    53: [
        [
            ("intro", "Subscription user engagement logs showing early attrition signals.", "top"),
            ("say1", "Semi parametric survival analysis modeling hazard rates over time.", "qual"),
            ("example", "Deep survival neural networks predicting individual defection windows.", "target"),
            ("tryIt", "Early warning risk scores flagging vulnerable subscriber cohorts.", "final")
        ],
        [
            ("intro", "Total at risk customer base evaluated for promotional interventions.", "top"),
            ("say1", "Causal machine learning isolating true incremental treatment lift.", "qual"),
            ("example", "Two model learners separating persuadables from sleeping dogs.", "target"),
            ("tryIt", "Precision targeting focusing incentives strictly on responsive users.", "final")
        ],
        [
            ("intro", "Available retention discount budgets bounded by capital limits.", "top"),
            ("say1", "Marginal treatment effect analysis ranking customers by net return.", "qual"),
            ("example", "Dynamic programming solver optimizing discount offer assignment.", "target"),
            ("tryIt", "Maximized retained subscriber revenue under strict budget caps.", "final")
        ],
        [
            ("intro", "Retention campaigns launched across broad recurring subscriber bases.", "top"),
            ("say1", "Isolated holdout cohorts measuring natural unassisted renewals.", "qual"),
            ("example", "Difference in differences regression validating true causal uplift.", "target"),
            ("tryIt", "Empirically verified incrementality proving marketing balance value.", "final")
        ],
        [
            ("intro", "Comprehensive customer subscription portfolio scanned by causal logic.", "top"),
            ("say1", "Automated uplift classification filtering negative responder risks.", "qual"),
            ("example", "Dynamic budget rebalancing prioritizing high margin retained users.", "target"),
            ("tryIt", "Sustainable recurring subscription revenue fortified against attrition.", "final")
        ]
    ],
    54: [
        [
            ("intro", "Proposed corporate environmental claims submitted for compliance check.", "top"),
            ("say1", "Statutory guidelines demanding third party verified lifecycle metrics.", "qual"),
            ("example", "Substantiated product durability metrics replacing vague slogans.", "target"),
            ("tryIt", "Certified green claims eliminating substantial statutory legal fines.", "final")
        ],
        [
            ("intro", "High carbon digital advertising supply chains generating emissions.", "top"),
            ("say1", "Direct publisher integrations eliminating redundant programmatic hops.", "qual"),
            ("example", "Dynamic impression throttling reducing grid electricity waste.", "target"),
            ("tryIt", "Decarbonized media delivery achieving significant emission cuts.", "final")
        ],
        [
            ("intro", "End of life consumer products entering waste disposal streams.", "top"),
            ("say1", "Closed loop reverse logistics facilitating convenient customer return.", "qual"),
            ("example", "Refurbished hardware tiers capturing secondary market revenue.", "target"),
            ("tryIt", "Circular business model lowering environmental impacts profitably.", "final")
        ],
        [
            ("intro", "Corporate reputation vulnerable to unverified sustainability claims.", "top"),
            ("say1", "Double materiality assessments evaluating financial and climate risks.", "qual"),
            ("example", "Stakeholder trust indices tracking customer brand affinity gains.", "target"),
            ("tryIt", "Audited corporate social governance driving lower cost of capital.", "final")
        ],
        [
            ("intro", "Enterprise marketing ecosystem audited across environmental metrics.", "top"),
            ("say1", "Carbon accounting software measuring digital advertising footprints.", "qual"),
            ("example", "Statutory compliance engines ensuring full international adherence.", "target"),
            ("tryIt", "Resilient sustainable brand model certified for global investment.", "final")
        ]
    ],
    55: [
        [
            ("intro", "Global corporate brand portfolio audited across international zones.", "top"),
            ("say1", "Relief from royalty calculations establishing balance sheet value.", "qual"),
            ("example", "Interdiction protocols seizing counterfeit goods at border points.", "target"),
            ("tryIt", "Fortified intellectual property portfolio generating stable royalties.", "final")
        ],
        [
            ("intro", "Enterprise marketing infrastructure overhauled for agility and scale.", "top"),
            ("say1", "Composable data architecture unifying disparate technology platforms.", "qual"),
            ("example", "Automated production pipelines collapsing asset deployment cycles.", "target"),
            ("tryIt", "Highly agile marketing operating system achieving superior velocity.", "final")
        ],
        [
            ("intro", "Large subscriber base screened using predictive survival analytics.", "top"),
            ("say1", "Causal uplift machine learning suppressing wasteful discounts.", "qual"),
            ("example", "Quarantined control groups isolating genuine incremental renewal.", "target"),
            ("tryIt", "High margin retained customer equity fueling predictable growth.", "final")
        ],
        [
            ("intro", "Corporate marketing communications checked for statutory compliance.", "top"),
            ("say1", "Decarbonized ad supply chains eliminating wasteful impression hops.", "qual"),
            ("example", "Full lifecycle assessments backing all public sustainability claims.", "target"),
            ("tryIt", "Audited green credentials insulating enterprise from legal risks.", "final")
        ],
        [
            ("intro", "Executive leadership presenting full marketing transformation plan.", "top"),
            ("say1", "Zero based budgeting models proving superior capital allocation.", "qual"),
            ("example", "Unanimous board approval validating quantified operational value.", "target"),
            ("tryIt", "Master certification conferred for exemplary marketing leadership.", "final")
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

# 4. Append Days 51-55 to bcomMktLongLessons.ts
lessons_file = os.path.join(os.getcwd(), 'src', 'lib', 'data', 'bcomMktLongLessons.ts')

with open(lessons_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Check if Day 51 already present
if 'day: 51' in content or '"day": 51' in content:
    print("Day 51 already exists in bcomMktLongLessons.ts. Skipping append.")
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
