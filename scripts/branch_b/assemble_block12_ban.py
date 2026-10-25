# -*- coding: utf-8 -*-
"""
Assemble Month 2 Block 12 (Days 56-60 & Milestone 12 Grand Master Capstone)
Course: Banking, Treasury & Credit Operations (bcom_ban)
Files affected:
- src/lib/data/lessonVisuals/bcom_ban/day-56.json to day-60.json
- src/lib/data/bcomBanLongLessons.ts
"""

import json
import hashlib
import os
import re
import sys

# Load day datasets
with open('scripts/branch_b/day56_ban_data.json', 'r', encoding='utf-8') as f:
    day56_data = json.load(f)
with open('scripts/branch_b/day57_ban_data.json', 'r', encoding='utf-8') as f:
    day57_data = json.load(f)
with open('scripts/branch_b/day58_ban_data.json', 'r', encoding='utf-8') as f:
    day58_data = json.load(f)
with open('scripts/branch_b/day59_ban_data.json', 'r', encoding='utf-8') as f:
    day59_data = json.load(f)
with open('scripts/branch_b/day60_ban_data.json', 'r', encoding='utf-8') as f:
    day60_data = json.load(f)

days = [day56_data, day57_data, day58_data, day59_data, day60_data]

# 1. Audit Word Counts and Invariants
print("=== AUDITING BLOCK 12 INVARIANTS (DAYS 56 TO 60) ===")
total_block_words = 0
for d in days:
    day_num = d["day"]
    parts = d["parts"]
    assert len(parts) == 5, f"Day {day_num} must have 5 parts, found {len(parts)}"
    assert d.get("coursePrefix") == "bcom_ban", f"Day {day_num} must have coursePrefix 'bcom_ban'"
    assert d.get("minutes") in [45, 55, 60], f"Day {day_num} minutes must be 45, 55, or 60"
    if day_num == 60:
        assert d.get("minutes") == 60, f"Day 60 Capstone must have minutes: 60, found {d.get('minutes')}"
    assert d.get("goal"), f"Day {day_num} missing goal"
    assert d.get("recap"), f"Day {day_num} missing recap"
    
    day_words = 0
    for p_idx, part in enumerate(parts):
        # strip 'id' or 'courseId' if present
        part.pop("id", None)
        part.pop("courseId", None)
            
        say_text = " ".join(part["say"]) if isinstance(part["say"], list) else str(part["say"])
        wc = len(say_text.strip().split())
        day_words += wc
        print(f"Day {day_num} Part {p_idx+1}: {part['title'][:40]} -> {wc} words")
        assert wc >= 600, f"Day {day_num} Part {p_idx+1} under 600 words ({wc} words)!"
        
        # Check questions
        check = part.get("check")
        assert check, f"Day {day_num} Part {p_idx+1} missing check"
        assert len(check.get("options", [])) == 4, f"Day {day_num} Part {p_idx+1} check must have 4 options"
        assert check.get("answer") == 0, f"Day {day_num} Part {p_idx+1} check answer must be 0"
        assert check.get("answerIndex") == 0, f"Day {day_num} Part {p_idx+1} check answerIndex must be 0"
        assert len(check.get("why", "")) >= 20, f"Day {day_num} Part {p_idx+1} check why must be >= 20 chars"
        
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
            ("intro", "Central bank balance sheet liquidity framework initialized.", "top"),
            ("say1", "Autonomous factors alter commercial bank reserve deposits.", "qual"),
            ("example", "Quarterly tax revenues temporarily drain systemic liquidity.", "target"),
            ("tryIt", "Reserve money forecasts guide monetary intervention size.", "final")
        ],
        [
            ("intro", "Liquidity adjustment facility policy corridor deployed.", "top"),
            ("say1", "Repo auctions provide primary market liquidity benchmark.", "qual"),
            ("example", "Standing deposit window absorbs uncollateralized cash.", "target"),
            ("tryIt", "Corridor boundaries prevent excessive overnight volatility.", "final")
        ],
        [
            ("intro", "Open market operations steer durable financial liquidity.", "top"),
            ("say1", "Simultaneous buy and sell trades flatten sovereign yields.", "qual"),
            ("example", "Sterilized open market operations preserve reserve neutrality.", "target"),
            ("tryIt", "Asset purchase volumes influence long term borrowing costs.", "final")
        ],
        [
            ("intro", "Monetary policy transmission channels systematically audited.", "top"),
            ("say1", "Policy interest rate adjustments reprice commercial loans.", "qual"),
            ("example", "Asset prices adjust to shifting central bank expectations.", "target"),
            ("tryIt", "Transmission lag models track macroeconomic policy impacts.", "final")
        ],
        [
            ("intro", "Master central banking liquidity simulation completed.", "top"),
            ("say1", "Algorithmic reserve steering stabilizes money market rates.", "qual"),
            ("example", "Asset sensitivity buffers net interest income from shocks.", "target"),
            ("tryIt", "Central bank operating framework certified with distinction.", "final")
        ]
    ],
    57: [
        [
            ("intro", "Sovereign primary dealer institutional network mobilized.", "top"),
            ("say1", "Underwriting obligations ensure complete auction absorption.", "qual"),
            ("example", "Mandatory market making guarantees secondary market trading.", "target"),
            ("tryIt", "Primary dealer capital buffers absorb auction inventory risk.", "final")
        ],
        [
            ("intro", "Government debt auction bidding mechanisms evaluated.", "top"),
            ("say1", "Uniform pricing shields competitive bidders from overpayment.", "qual"),
            ("example", "Multiple price formats reward superior market intelligence.", "target"),
            ("tryIt", "Non competitive bidding expands retail sovereign ownership.", "final")
        ],
        [
            ("intro", "Coupon bond stripping and decoupling framework initiated.", "top"),
            ("say1", "Zero coupon cash flows trade as independent securities.", "qual"),
            ("example", "Principal strips eliminate reinvestment risk for pensions.", "target"),
            ("tryIt", "Two way reconstitution maintains sovereign law of one price.", "final")
        ],
        [
            ("intro", "Sovereign zero coupon spot yield curve constructed.", "top"),
            ("say1", "Nelson Siegel structural equations decompose yield factors.", "qual"),
            ("example", "Level slope and curvature parameters fit observed yields.", "target"),
            ("tryIt", "Arbitrage free discount curves price institutional debt.", "final")
        ],
        [
            ("intro", "Industrial sovereign treasury simulation successfully run.", "top"),
            ("say1", "Devolved primary bond inventory is converted into strips.", "qual"),
            ("example", "Institutional placement locks in distribution trading alpha.", "target"),
            ("tryIt", "Mastery of sovereign primary debt architecture certified.", "final")
        ]
    ],
    58: [
        [
            ("intro", "Open banking regulatory architecture deployed across rails.", "top"),
            ("say1", "Statutory rules empower customers with financial data control.", "qual"),
            ("example", "Account information and payment services operate via apis.", "target"),
            ("tryIt", "Digital public infrastructure drives financial democratization.", "final")
        ],
        [
            ("intro", "Granular electronic consent artifacts formally structured.", "top"),
            ("say1", "Consent terms define data attributes and retention lifespans.", "qual"),
            ("example", "Cryptographic signatures guarantee consent non repudiation.", "target"),
            ("tryIt", "Automated revocation controls enforce customer data rights.", "final")
        ],
        [
            ("intro", "Financial grade application programming security audited.", "top"),
            ("say1", "Mutual transport layer security verifies server certificates.", "qual"),
            ("example", "Application layer encryption secures private financial data.", "target"),
            ("tryIt", "Token binding defenses prevent credential interception risks.", "final")
        ],
        [
            ("intro", "Digital cash flow credit decisioning engine initialized.", "top"),
            ("say1", "Verified banking transactions replace physical paper audits.", "qual"),
            ("example", "Operating cash flow coverage calculates debt service health.", "target"),
            ("tryIt", "Automated forensic screens eliminate circular transaction risk.", "final")
        ],
        [
            ("intro", "End to end account aggregator pipeline simulation run.", "top"),
            ("say1", "Instant credit underwriting reduces loan processing time.", "qual"),
            ("example", "Verified cash flow histories support digital loan disbursals.", "target"),
            ("tryIt", "Open banking credit architecture officially certified.", "final")
        ]
    ],
    59: [
        [
            ("intro", "Climate financial risk architecture and scenarios mapped.", "top"),
            ("say1", "Physical weather extremes damage physical collateral values.", "qual"),
            ("example", "Carbon taxation and policy shifts trigger transition risks.", "target"),
            ("tryIt", "Macroeconomic scenario models evaluate bank solvency risks.", "final")
        ],
        [
            ("intro", "Portfolio financed emissions accounting framework audited.", "top"),
            ("say1", "Attribution factors allocate borrower greenhouse gas totals.", "qual"),
            ("example", "Audited emissions disclosures improve data quality scoring.", "target"),
            ("tryIt", "Standardized carbon metrics benchmark portfolio decarbonization.", "final")
        ],
        [
            ("intro", "Sustainable finance classification taxonomy calibrated.", "top"),
            ("say1", "Green asset ratios measure taxonomy aligned balance sheets.", "qual"),
            ("example", "Certified green bonds fund eligible environmental projects.", "target"),
            ("tryIt", "Sustainability linked covenants align corporate incentives.", "final")
        ],
        [
            ("intro", "Transition risk credit underwriting models activated.", "top"),
            ("say1", "Shadow carbon pricing stress tests borrower debt capacity.", "qual"),
            ("example", "Stranded asset risks depress collateral liquidation values.", "target"),
            ("tryIt", "Decarbonization covenants safeguard loan portfolio quality.", "final")
        ],
        [
            ("intro", "Industrial sustainable finance simulation completed.", "top"),
            ("say1", "Climate stress loss provisions deplete core equity buffers.", "qual"),
            ("example", "Green bond issuance expands sustainable asset ratios.", "target"),
            ("tryIt", "Mastery of climate risk and sustainable finance confirmed.", "final")
        ]
    ],
    60: [
        [
            ("intro", "Strategic enterprise banking command console activated.", "top"),
            ("say1", "Coordinating liquidity sovereign debt and digital platforms.", "qual"),
            ("example", "Holistic capital steering preserves institutional solvency.", "target"),
            ("tryIt", "Enterprise executive leadership defends balance sheet health.", "final")
        ],
        [
            ("intro", "Central banking and sovereign treasury operations executed.", "top"),
            ("say1", "Term repo facilities resolve systemic clearing deficits.", "qual"),
            ("example", "Sovereign bond strips capture institutional trading margins.", "target"),
            ("tryIt", "Active collateral optimization enhances net interest returns.", "final")
        ],
        [
            ("intro", "Digital public infrastructure credit pipeline engaged.", "top"),
            ("say1", "Automated account aggregator algorithms underwrite loans.", "qual"),
            ("example", "Instant credit sanctions expand high margin commercial assets.", "target"),
            ("tryIt", "Real time cash flow analysis eliminates manual delays.", "final")
        ],
        [
            ("intro", "Climate risk stress testing and capital defense deployed.", "top"),
            ("say1", "Sustainability linked debt restructurings mitigate losses.", "qual"),
            ("example", "Green bond refinancing restores regulatory capital cushions.", "target"),
            ("tryIt", "Forward looking scenario models protect bank tier one equity.", "final")
        ],
        [
            ("intro", "Grand master milestone capstone simulation completed.", "top"),
            ("say1", "Integrated multi asset defense preserves capital fortress.", "qual"),
            ("example", "Enterprise capital adequacy clears all regulatory hurdles.", "target"),
            ("tryIt", "Graduation of commercial banking curriculum officially certified.", "final")
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

print("ALL BLOCK 12 VISUAL CAPTION INVARIANTS CONFIRMED!\n")

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
                "title": f"{short_title} \u2014 Central Banking & Treasury Operations",
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

# 4. Append Days 56-60 to bcomBanLongLessons.ts
lessons_file = os.path.join(os.getcwd(), 'src', 'lib', 'data', 'bcomBanLongLessons.ts')

with open(lessons_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Check if Day 56 already present
if 'day: 56' in content or '"day": 56' in content:
    print("Day 56 already exists in bcomBanLongLessons.ts. Skipping append.")
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
    print("Successfully appended Days 56-60 to src/lib/data/bcomBanLongLessons.ts!")

print("\n=== BLOCK 12 (DAYS 56-60) ASSEMBLY COMPLETE! ===")
