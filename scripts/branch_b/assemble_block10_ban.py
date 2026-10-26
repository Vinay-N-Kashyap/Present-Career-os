# -*- coding: utf-8 -*-
"""
Assemble Month 2 Block 10 (Days 46-50 & Milestone 10 Capstone)
Course: Banking, Treasury & Credit Operations (bcom_ban)
Files affected:
- src/lib/data/lessonVisuals/bcom_ban/day-46.json to day-50.json
- src/lib/data/bcomBanLongLessons.ts
"""

import json
import hashlib
import os
import re
import sys

# Load day datasets
with open('scripts/branch_b/day46_ban_data.json', 'r', encoding='utf-8') as f:
    day46_data = json.load(f)
with open('scripts/branch_b/day47_ban_data.json', 'r', encoding='utf-8') as f:
    day47_data = json.load(f)
with open('scripts/branch_b/day48_ban_data.json', 'r', encoding='utf-8') as f:
    day48_data = json.load(f)
with open('scripts/branch_b/day49_ban_data.json', 'r', encoding='utf-8') as f:
    day49_data = json.load(f)
with open('scripts/branch_b/day50_ban_data.json', 'r', encoding='utf-8') as f:
    day50_data = json.load(f)

days = [day46_data, day47_data, day48_data, day49_data, day50_data]

# 1. Audit Word Counts and Invariants
print("=== AUDITING BLOCK 10 INVARIANTS (DAYS 46 TO 50) ===")
total_block_words = 0
for d in days:
    day_num = d["day"]
    parts = d["parts"]
    assert len(parts) == 5, f"Day {day_num} must have 5 parts, found {len(parts)}"
    assert d.get("coursePrefix") == "bcom_ban", f"Day {day_num} must have coursePrefix 'bcom_ban'"
    assert d.get("minutes") in [45, 55, 60], f"Day {day_num} minutes must be 45, 55, or 60"
    assert d.get("goal"), f"Day {day_num} missing goal"
    assert d.get("recap"), f"Day {day_num} missing recap"
    
    day_words = 0
    for p_idx, part in enumerate(parts):
        # strip 'id' or 'courseId' if present
        part.pop("id", None)
        part.pop("courseId", None)
            
        wc = sum(len(re.findall(r'\b\w+\b', p)) for p in part["say"])
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
            ("intro", "Quantitative credit expected loss decomposition deployed.", "top"),
            ("say1", "Probability of default models borrower insolvency likelihood.", "qual"),
            ("example", "Loss given default discounts collateral recovery values.", "target"),
            ("tryIt", "Credit conversion factors measure undrawn facility exposure.", "final")
        ],
        [
            ("intro", "Multivariate credit scoring and discriminant models active.", "top"),
            ("say1", "Working capital and profitability ratios benchmark health.", "qual"),
            ("example", "Distress cutoffs differentiate solvent firms from failures.", "target"),
            ("tryIt", "Non linear credit migration models track balance sheets.", "final")
        ],
        [
            ("intro", "Merton structural credit default framework calibrated.", "top"),
            ("say1", "Corporate equity is modeled as a call option on assets.", "qual"),
            ("example", "Asset volatility determines structural distance to default.", "target"),
            ("tryIt", "Market equity pricing signals borrower credit deterioration.", "final")
        ],
        [
            ("intro", "Multi stage expected credit loss provisioning automated.", "top"),
            ("say1", "Staging migration rules classify significant credit deterioration.", "qual"),
            ("example", "Forward looking macro overlays expand lifetime provisions.", "target"),
            ("tryIt", "Proactive loan provisioning preserves core equity capital.", "final")
        ],
        [
            ("intro", "Master enterprise credit portfolio risk simulation run.", "top"),
            ("say1", "Vasicek single factor equations size unexpected credit loss.", "qual"),
            ("example", "Concentration add ons allocate economic capital buffers.", "target"),
            ("tryIt", "Comprehensive credit metrics insulate commercial balance sheets.", "final")
        ]
    ],
    47: [
        [
            ("intro", "Value at risk and expected shortfall metrics deployed.", "top"),
            ("say1", "Parametric models calculate trading book tail volatility.", "qual"),
            ("example", "Expected shortfall captures severe losses beyond thresholds.", "target"),
            ("tryIt", "Multi horizon liquidity adjustments scale market exposure.", "final")
        ],
        [
            ("intro", "Historical simulation and extreme value theory active.", "top"),
            ("say1", "Full revaluation models capture non linear option deltas.", "qual"),
            ("example", "Stressed value at risk incorporates historical market shocks.", "target"),
            ("tryIt", "Empirical return distributions model market tail risk.", "final")
        ],
        [
            ("intro", "Basel operational risk measurement framework audited.", "top"),
            ("say1", "Business indicator components aggregate financial volumes.", "qual"),
            ("example", "Internal loss multipliers scale operational capital charges.", "target"),
            ("tryIt", "Standardized measurement replaces legacy internal models.", "final")
        ],
        [
            ("intro", "Operational risk management framework controls reviewed.", "top"),
            ("say1", "Key risk indicators signal emerging operational vulnerabilities.", "qual"),
            ("example", "Risk control self assessments document process weaknesses.", "target"),
            ("tryIt", "Continuous operational monitoring defends business resilience.", "final")
        ],
        [
            ("intro", "Enterprise market and operational risk simulation run.", "top"),
            ("say1", "Aggregated risk weighted assets size total capital demand.", "qual"),
            ("example", "Trading book hedges mitigate market volatility drawdowns.", "target"),
            ("tryIt", "Robust capital buffers absorb combined operational shocks.", "final")
        ]
    ],
    48: [
        [
            ("intro", "Regulatory capital adequacy stacks and tiers structured.", "top"),
            ("say1", "Common equity tier one capital forms the core loss buffer.", "qual"),
            ("example", "Additional tier one debt provides going concern absorption.", "target"),
            ("tryIt", "Tier two subordinated debt absorbs gone concern insolvency.", "final")
        ],
        [
            ("intro", "Macroprudential capital conservation buffers deployed.", "top"),
            ("say1", "Mandatory capital conservation cushions economic stress.", "qual"),
            ("example", "Countercyclical buffers accumulate during credit booms.", "target"),
            ("tryIt", "Domestic systemically important banks hold extra equity.", "final")
        ],
        [
            ("intro", "Basel non risk based leverage ratio framework active.", "top"),
            ("say1", "Tier one capital is evaluated against total exposure.", "qual"),
            ("example", "Off balance sheet commitments expand leverage denominator.", "target"),
            ("tryIt", "Leverage floors restrict excessive balance sheet gearing.", "final")
        ],
        [
            ("intro", "Basel output floors and standardized benchmarks audited.", "top"),
            ("say1", "Output floors restrict internal model capital reductions.", "qual"),
            ("example", "Standardized risk weight floors bound internal estimates.", "target"),
            ("tryIt", "Standardized floors ensure global banking comparability.", "final")
        ],
        [
            ("intro", "Master regulatory capital adequacy simulation run.", "top"),
            ("say1", "Full capital stacks verify compliance above all floors.", "qual"),
            ("example", "Risk weighted asset inflation tests buffer sustainability.", "target"),
            ("tryIt", "Comprehensive capital planning guarantees bank solvency.", "final")
        ]
    ],
    49: [
        [
            ("intro", "Internal capital adequacy assessment framework initiated.", "top"),
            ("say1", "Board approved risk appetite defines operational boundaries.", "qual"),
            ("example", "Non pillar one risks demand dedicated economic capital.", "target"),
            ("tryIt", "Supervisory review evaluates internal capital governance.", "final")
        ],
        [
            ("intro", "Multi quarter macroeconomic stress scenarios simulated.", "top"),
            ("say1", "Severe recession projections test balance sheet resilience.", "qual"),
            ("example", "Net interest margins compress while credit losses surge.", "target"),
            ("tryIt", "Trough equity ratios measure peak stress capital depletion.", "final")
        ],
        [
            ("intro", "Sensitivity factor shocks and reverse stress diagnostics.", "top"),
            ("say1", "Instantaneous factor testing exposes localized weaknesses.", "qual"),
            ("example", "Reverse stress testing uncovers shortest path to failure.", "target"),
            ("tryIt", "Targeted balance sheet caps prevent failure threshold breaches.", "final")
        ],
        [
            ("intro", "Supervisory review and evaluation process surcharges.", "top"),
            ("say1", "Pillar two add ons mandate extra capital for concentration.", "qual"),
            ("example", "Pillar two guidance establishes stress absorption expectation.", "target"),
            ("tryIt", "Living wills outline autonomous crisis recovery actions.", "final")
        ],
        [
            ("intro", "Master enterprise internal capital simulation executed.", "top"),
            ("say1", "Comprehensive risk models affirm multi year balance sheets.", "qual"),
            ("example", "Stressed trough capital maintains regulatory headroom.", "target"),
            ("tryIt", "Proactive capital steering secures supervisory approval.", "final")
        ]
    ],
    50: [
        [
            ("intro", "Enterprise risk aggregation and solvency war room active.", "top"),
            ("say1", "Unifying credit market and operational risks across tiers.", "qual"),
            ("example", "Macroprudential buffers reinforce statutory equity minimums.", "target"),
            ("tryIt", "Integrated capital stacks defend against systemic contagion.", "final")
        ],
        [
            ("intro", "Vasicek portfolio credit risk decomposition executed.", "top"),
            ("say1", "Correlated default modeling captures portfolio tail risk.", "qual"),
            ("example", "Multi stage expected loss migrations deplete net earnings.", "target"),
            ("tryIt", "Concentration add ons allocate economic capital buffers.", "final")
        ],
        [
            ("intro", "Market risk and interest rate duration stress evaluated.", "top"),
            ("say1", "Standardized yield curve shocks measure economic value.", "qual"),
            ("example", "Trading book expected shortfall captures market panic tails.", "target"),
            ("tryIt", "Derivative macro hedging stabilizes net interest margins.", "final")
        ],
        [
            ("intro", "Reverse stress testing and supervisory scoring deployed.", "top"),
            ("say1", "Maximum loss capacity identifies absolute failure points.", "qual"),
            ("example", "Supervisory review affirms robust capital buffer headroom.", "target"),
            ("tryIt", "Living will recovery playbooks guarantee autonomy in crisis.", "final")
        ],
        [
            ("intro", "Milestone capstone war room simulation successfully run.", "top"),
            ("say1", "Comprehensive solvency dashboard affirms capital fortress.", "qual"),
            ("example", "Trough equity ratios clear all baseline and buffer hurdles.", "target"),
            ("tryIt", "Mastery of enterprise risk architecture officially certified.", "final")
        ]
    ]
}

# Verify caption invariants
for day_num, parts_meta in step_metadata.items():
    for p_idx, steps in enumerate(parts_meta):
        for at_step, caption, active_stage in steps:
            assert len(caption) <= 75, f"Day {day_num} P{p_idx+1} {at_step} caption exceeds 75 chars: '{caption}' ({len(caption)})"
            assert caption.endswith("."), f"Day {day_num} P{p_idx+1} {at_step} caption must end with period: '{caption}'"
            assert not any(c.isdigit() for c in caption), f"Day {day_num} P{p_idx+1} {at_step} caption has digits: '{caption}'"

print("ALL BLOCK 10 VISUAL CAPTION INVARIANTS CONFIRMED!\n")

# 3. Generate Gate v2 visual envelopes
visuals_dir = os.path.join(os.getcwd(), 'src', 'lib', 'data', 'lessonVisuals', 'bcom_ban')
os.makedirs(visuals_dir, exist_ok=True)

standard_stages = [
    {"id": "top", "label": "Macro Liquidity Intake"},
    {"id": "qual", "label": "Treasury Risk Screening"},
    {"id": "target", "label": "Balance Sheet Allocation"},
    {"id": "final", "label": "Solvency Affirmation"}
]

for d in days:
    day_num = d["day"]
    entries = []
    for p_idx, part in enumerate(d["parts"]):
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
                "title": f"{short_title} \u2014 Treasury Risk Operations",
                "steps": steps
            }
        }
        entries.append(entry)
        
    day_visual = {
        "schemaVersion": 1,
        "prefix": "bcom_ban",
        "day": day_num,
        "entries": entries
    }
    
    out_path = os.path.join(visuals_dir, f"day-{day_num}.json")
    with open(out_path, "w", encoding="utf-8") as vf:
        json.dump(day_visual, vf, indent=2)
    print(f"Generated {out_path} with 5 entries and SHA-256 bindings.")

# 4. Append Days 46-50 to bcomBanLongLessons.ts
lessons_file = os.path.join(os.getcwd(), 'src', 'lib', 'data', 'bcomBanLongLessons.ts')

with open(lessons_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Check if Day 46 already present
if 'day: 46' in content or '"day": 46' in content:
    print("Day 46 already exists in bcomBanLongLessons.ts. Skipping append.")
else:
    last_bracket_idx = content.rfind('];')
    if last_bracket_idx == -1:
        print("Could not find closing '];' in bcomBanLongLessons.ts!")
        sys.exit(1)

    formatted_days = []
    for d in days:
        # Guarantee no 'id' or 'courseId' in root or parts
        d.pop("id", None)
        d.pop("courseId", None)
        for p in d["parts"]:
            p.pop("id", None)
            p.pop("courseId", None)
        json_str = json.dumps(d, indent=2, ensure_ascii=False)
        formatted_days.append(json_str)

    days_payload = ",\n" + ",\n".join(formatted_days) + "\n];\n"
    new_content = content[:last_bracket_idx].rstrip() + days_payload

    with open(lessons_file, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"Successfully appended Block 10 (Days 46-50) to {lessons_file}!")

print("\n=== BLOCK 10 ASSEMBLY COMPLETE! ===")
