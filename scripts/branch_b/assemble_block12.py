# -*- coding: utf-8 -*-
"""
Assemble Month 2 Block 12 (Days 56-60 & Milestone 12 Grand Capstone)
Course: Strategic Marketing & Brand Systems (bcom-marketing)
Files affected:
- src/lib/data/lessonVisuals/bcom-marketing/day-56.json to day-60.json
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

print(f"\nALL 25 PARTS PASSED! Total Block 12 Words: {total_block_words} words (avg {total_block_words/5:.1f} words/day)\n")

# 2. Captions mapping for Gate v2 visual envelopes
step_metadata = {
    56: [
        [
            ("intro", "Generic corporate advertising copy suffering from brand dilution.", "top"),
            ("say1", "Frozen foundation weights augmented with low rank adapter matrices.", "qual"),
            ("example", "Modular brand adapters swapping dynamically across user segments.", "target"),
            ("tryIt", "Unified generative pipeline producing distinct brand aligned copy.", "final")
        ],
        [
            ("intro", "Traditional consumer market research facing long execution delays.", "top"),
            ("say1", "Autonomous synthetic agents conditioned on empirical census priors.", "qual"),
            ("example", "Deliberative multi agent simulation evaluating positioning options.", "target"),
            ("tryIt", "Calibrated consumer behavioral predictions guiding product strategy.", "final")
        ],
        [
            ("intro", "Combinatorial creative variations evaluated across digital touchpoints.", "top"),
            ("say1", "Contextual Thompson sampling balancing exploration and exploitation.", "qual"),
            ("example", "Bayesian posterior distributions concentrating traffic on winners.", "target"),
            ("tryIt", "Minimized cumulative regret expanding overall campaign conversions.", "final")
        ],
        [
            ("intro", "Synthetic creative media submitted for legal compliance verification.", "top"),
            ("say1", "Forensic audit ledgers establishing immutable human authorship chains.", "qual"),
            ("example", "Cryptographic provenance credentials authenticating creation paths.", "target"),
            ("tryIt", "Certified intellectual property secured under federal copyright laws.", "final")
        ],
        [
            ("intro", "Real time bidding exchange streaming incoming consumer impression calls.", "top"),
            ("say1", "Contextual bandit routing modular creative assets to match user traits.", "qual"),
            ("example", "Adaptive exploration throttling underperforming creative variants.", "target"),
            ("tryIt", "Scalable personalized ad engine maximizing marketing conversion yield.", "final")
        ]
    ],
    57: [
        [
            ("intro", "Closed loop loyalty points trapped on siloed corporate databases.", "top"),
            ("say1", "Multi token smart contracts issuing liquid on chain access passes.", "qual"),
            ("example", "Automated secondary market royalty fees routed to corporate treasury.", "target"),
            ("tryIt", "High liquidity loyalty ecosystem generating non dilutive cash flows.", "final")
        ],
        [
            ("intro", "Centralized consumer advisory boards vulnerable to wealth dominance.", "top"),
            ("say1", "Quadratic voting scaling influence by the square root of token credits.", "qual"),
            ("example", "Sybil resistant identity verification protecting democratic consensus.", "target"),
            ("tryIt", "Grassroots community alignment guiding seasonal product innovations.", "final")
        ],
        [
            ("intro", "Sensitive consumer credentials required for VIP tier qualification.", "top"),
            ("say1", "Zero knowledge succinct proofs verifying eligibility mathematically.", "qual"),
            ("example", "Cryptographic verification verifying attributes without raw data.", "target"),
            ("tryIt", "Full regulatory compliance achieved with zero personal data leakage.", "final")
        ],
        [
            ("intro", "Disparate corporate brands seeking cross promotional partnership.", "top"),
            ("say1", "Decentralized identifiers establishing sovereign customer credentials.", "qual"),
            ("example", "Smart contract escrows executing atomic cross brand benefit swaps.", "target"),
            ("tryIt", "Seamless coalition loyalty operating without central clearinghouses.", "final")
        ],
        [
            ("intro", "Simulated decentralized community navigating governance proposals.", "top"),
            ("say1", "Quadratic voting mechanics rebalancing power across token cohorts.", "qual"),
            ("example", "Automated secondary market royalty sweeps funding brand innovation.", "target"),
            ("tryIt", "Resilient decentralized brand fortress maximizing community equity.", "final")
        ]
    ],
    58: [
        [
            ("intro", "Multi channel marketing spend generating delayed consumer responses.", "top"),
            ("say1", "Flexible Weibull adstock modeling non linear awareness carryovers.", "qual"),
            ("example", "Non linear Hill saturation functions mapping diminishing returns.", "target"),
            ("tryIt", "Econometric response curves quantifying true marginal marketing lift.", "final")
        ],
        [
            ("intro", "Collinear media channels challenging traditional regression models.", "top"),
            ("say1", "Hierarchical Bayesian models drawing power across regional markets.", "qual"),
            ("example", "Hamiltonian Monte Carlo sampling converging across posterior states.", "target"),
            ("tryIt", "Robust parameter credible intervals quantifying revenue uncertainty.", "final")
        ],
        [
            ("intro", "Conflicting signals between top down models and tactical attribution.", "top"),
            ("say1", "Randomized geo lift holdout experiments anchoring empirical truth.", "qual"),
            ("example", "Causal incrementality multipliers calibrating programmatic bidding.", "target"),
            ("tryIt", "Unified measurement architecture eliminating internal budget bias.", "final")
        ],
        [
            ("intro", "Enterprise marketing portfolio constrained by overall budget bounds.", "top"),
            ("say1", "Karush Kuhn Tucker conditions identifying equimarginal spend points.", "qual"),
            ("example", "Non linear optimization shifting capital away from saturated search.", "target"),
            ("tryIt", "Equalized marginal returns unlocking substantial top line expansion.", "final")
        ],
        [
            ("intro", "Multi year omnichannel media spending data ingested by model engine.", "top"),
            ("say1", "Calibrated Bayesian response curves evaluating channel headroom.", "qual"),
            ("example", "Equimarginal optimization reallocating capital across media tiers.", "target"),
            ("tryIt", "Mathematically proven capital allocation commanding board confidence.", "final")
        ]
    ],
    59: [
        [
            ("intro", "Traditional marketing leadership evaluated solely on vanity metrics.", "top"),
            ("say1", "Economic value added frameworks deducting corporate cost of capital.", "qual"),
            ("example", "DuPont analysis linking brand equity to return on equity growth.", "target"),
            ("tryIt", "Fiduciary marketing stewardship driving audited enterprise value.", "final")
        ],
        [
            ("intro", "Multi billion dollar corporate acquisition combining brand assets.", "top"),
            ("say1", "Purchase price allocation establishing fair value for trademarks.", "qual"),
            ("example", "Phased endorsed brand migration preserving customer retention rates.", "target"),
            ("tryIt", "Accretive brand integration preventing balance sheet impairments.", "final")
        ],
        [
            ("intro", "Horizontal market consolidation evaluated by antitrust authorities.", "top"),
            ("say1", "Market concentration indices tracking competitive industry balance.", "qual"),
            ("example", "Targeted structural divestitures resolving regulatory objections.", "target"),
            ("tryIt", "Full competition clearance secured across international markets.", "final")
        ],
        [
            ("intro", "Complex multi channel marketing disbursements subject to audit review.", "top"),
            ("say1", "Automated internal controls enforcing three way invoice reconciliation.", "qual"),
            ("example", "Multi dimensional executive scorecards balancing growth and risk.", "target"),
            ("tryIt", "Flawless internal accounting integrity protecting shareholder wealth.", "final")
        ],
        [
            ("intro", "Simulated corporate merger navigating post transaction milestones.", "top"),
            ("say1", "Econometric antitrust screening evaluating market concentration.", "qual"),
            ("example", "Pro forma discounted cash flow modeling confirming value accretion.", "target"),
            ("tryIt", "Complete executive integration blueprint certified for board approval.", "final")
        ]
    ],
    60: [
        [
            ("intro", "Enterprise customer acquisition challenged by signal degradation.", "top"),
            ("say1", "Foundation model adapters generating brand aligned creative assets.", "qual"),
            ("example", "Contextual bandit algorithms dynamically concentrating on winners.", "target"),
            ("tryIt", "Accelerated acquisition velocity backed by verified copyright rights.", "final")
        ],
        [
            ("intro", "Legacy loyalty program burdened by unredeemed point liabilities.", "top"),
            ("say1", "On chain smart contracts capturing secondary market trade royalties.", "qual"),
            ("example", "Quadratic voting mechanisms empowering grassroots customer voice.", "target"),
            ("tryIt", "Zero knowledge privacy verification eliminating regulatory liabilities.", "final")
        ],
        [
            ("intro", "Corporate marketing budget allocated across saturated media vectors.", "top"),
            ("say1", "Hierarchical Bayesian econometric models calibrated via geo tests.", "qual"),
            ("example", "Equimarginal optimization reallocating capital across channels.", "target"),
            ("tryIt", "Free top line revenue expansion achieved under fixed budget caps.", "final")
        ],
        [
            ("intro", "Cross border enterprise acquisition facing regulatory antitrust review.", "top"),
            ("say1", "Targeted structural divestitures securing international clearance.", "qual"),
            ("example", "Phased endorsed brand architecture preserving customer retention.", "target"),
            ("tryIt", "Audited financial controls eliminating internal accounting defects.", "final")
        ],
        [
            ("intro", "Executive leadership presenting unified enterprise transformation.", "top"),
            ("say1", "Consolidated economic value added proving superior capital returns.", "qual"),
            ("example", "Unanimous board ratification adopting multi dimensional scorecards.", "target"),
            ("tryIt", "Master accreditation conferred for exemplary marketing leadership.", "final")
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

# 4. Append Days 56-60 to bcomMktLongLessons.ts
lessons_file = os.path.join(os.getcwd(), 'src', 'lib', 'data', 'bcomMktLongLessons.ts')

with open(lessons_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Check if Day 56 already present
if 'day: 56' in content or '"day": 56' in content:
    print("Day 56 already exists in bcomMktLongLessons.ts. Skipping append.")
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

    print(f"Successfully appended Block 12 (Days 56-60) to {lessons_file}!")

print("\n=== BLOCK 12 ASSEMBLY COMPLETE! ===")
