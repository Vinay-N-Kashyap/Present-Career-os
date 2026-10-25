# -*- coding: utf-8 -*-
"""
Assemble Month 2 Block 11 (Days 51-55 & Milestone 11 Capstone)
Course: Banking, Treasury & Credit Operations (bcom_ban)
Files affected:
- src/lib/data/lessonVisuals/bcom_ban/day-51.json to day-55.json
- src/lib/data/bcomBanLongLessons.ts
- tests/bcom_ban_days51_55_expansion.test.ts
"""

import json
import hashlib
import os
import re
import sys

# Load day datasets
with open('scripts/branch_b/day51_ban_data.json', 'r', encoding='utf-8') as f:
    day51_data = json.load(f)
with open('scripts/branch_b/day52_ban_data.json', 'r', encoding='utf-8') as f:
    day52_data = json.load(f)
with open('scripts/branch_b/day53_ban_data.json', 'r', encoding='utf-8') as f:
    day53_data = json.load(f)
with open('scripts/branch_b/day54_ban_data.json', 'r', encoding='utf-8') as f:
    day54_data = json.load(f)
with open('scripts/branch_b/day55_ban_data.json', 'r', encoding='utf-8') as f:
    day55_data = json.load(f)

days = [day51_data, day52_data, day53_data, day54_data, day55_data]

# 1. Audit Word Counts and Invariants
print("=== AUDITING BLOCK 11 INVARIANTS (DAYS 51 TO 55) ===")
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
        
        # Code & Output & Pedagogy
        assert part.get("code"), f"Day {day_num} Part {p_idx+1} missing code"
        assert part.get("output"), f"Day {day_num} Part {p_idx+1} missing output"
        assert part.get("tryIt"), f"Day {day_num} Part {p_idx+1} missing tryIt"
        assert part.get("example"), f"Day {day_num} Part {p_idx+1} missing example"

    total_block_words += day_words
    print(f"-> Day {day_num} Total Words: {day_words}")

print(f"\nALL 25 PARTS PASSED! Total Block 11 Words: {total_block_words} words (avg {total_block_words/5:.1f} words/day)\n")

# 2. Captions mapping for Gate v2 visual envelopes
# Strict rules: ending with period, <= 75 chars, NO digits!
step_metadata = {
    51: [
        [
            ("intro", "Single name credit default swap protection framework initialized.", "top"),
            ("say1", "Premium leg payments exchange quarterly running spreads over time.", "qual"),
            ("example", "Upfront fees bridge differences between market spread and coupons.", "target"),
            ("tryIt", "Standardized market rules eliminate bilateral delivery frictions.", "final")
        ],
        [
            ("intro", "Reduced form intensity hazard rate calibration engine active.", "top"),
            ("say1", "Poisson jump processes model instantaneous corporate default risk.", "qual"),
            ("example", "Discounted cash flows equate premium leg and default protection.", "target"),
            ("tryIt", "Calibrated survival probabilities dictate credit derivative value.", "final")
        ],
        [
            ("intro", "Standardized credit default swap index families structured.", "top"),
            ("say1", "Equal weighted constituent baskets benchmark systemic credit debt.", "qual"),
            ("example", "Index basis trading captures differences with single name spreads.", "target"),
            ("tryIt", "Arbitrage strategies normalize liquid index derivative pricing.", "final")
        ],
        [
            ("intro", "Credit determinations committees and auction protocols active.", "top"),
            ("say1", "Super majority voting confirms material credit event occurrences.", "qual"),
            ("example", "Two stage centralized auctions establish market recovery prices.", "target"),
            ("tryIt", "Multilateral cash settlement terminates physical delivery squeezes.", "final")
        ],
        [
            ("intro", "Industrial credit trading pricer and sensitivity engine deployed.", "top"),
            ("say1", "Spread sensitivity measures portfolio value shifts per basis point.", "qual"),
            ("example", "Jump to default metrics evaluate instantaneous single name shocks.", "target"),
            ("tryIt", "Macro index hedges immunize commercial banking loan books.", "final")
        ]
    ],
    52: [
        [
            ("intro", "Asset backed securitization structural framework established.", "top"),
            ("say1", "Originators disaggregate corporate credit risk from asset cash flow.", "qual"),
            ("example", "Special purpose vehicles house loan collateral under trust law.", "target"),
            ("tryIt", "Independent trustees protect noteholder interests and governance.", "final")
        ],
        [
            ("intro", "True sale legal doctrines and bankruptcy remoteness audited.", "top"),
            ("say1", "Unconditional asset conveyance insulates pools from originator stress.", "qual"),
            ("example", "Separateness covenants prevent judicial substantive consolidation.", "target"),
            ("tryIt", "Legal opinions affirm bankruptcy isolation for debt noteholders.", "final")
        ],
        [
            ("intro", "Internal credit enhancement mechanisms structured across tiers.", "top"),
            ("say1", "Subordinated tranches absorb initial credit defaults in reverse order.", "qual"),
            ("example", "Overcollateralization buffers provide non debt principal cushions.", "target"),
            ("tryIt", "Excess spread cash reserves absorb unexpected default spikes.", "final")
        ],
        [
            ("intro", "Cash flow waterfall priority of payment algorithms active.", "top"),
            ("say1", "Sequential pay structures de leverage senior debt notes rapidly.", "qual"),
            ("example", "Early amortization triggers trap excess spread during stress.", "target"),
            ("tryIt", "Structural performance gates defend senior note principal safety.", "final")
        ],
        [
            ("intro", "Multi period asset backed loan cash flow simulation running.", "top"),
            ("say1", "Monthly prepayment and default decay curves amortize collateral.", "qual"),
            ("example", "Sequential waterfalls direct available cash to redeem senior debt.", "target"),
            ("tryIt", "Comprehensive cash flow audits prove tranche loss resilience.", "final")
        ]
    ],
    53: [
        [
            ("intro", "Collateralized loan obligation vehicle structure launched.", "top"),
            ("say1", "Active collateral managers trade syndicated senior secured debt.", "qual"),
            ("example", "Warehouse credit facilities fund loan portfolio accumulation.", "target"),
            ("tryIt", "Multi year reinvestment periods preserve asset scale and spread.", "final")
        ],
        [
            ("intro", "Collateral quality tests and portfolio profile metrics computed.", "top"),
            ("say1", "Weighted average rating factors constrain aggregate default risk.", "qual"),
            ("example", "Weighted average spreads ensure sufficient interest margin safety.", "target"),
            ("tryIt", "Industry diversity scores measure corporate portfolio breadth.", "final")
        ],
        [
            ("intro", "Six tier liability capital structure engineered across ratings.", "top"),
            ("say1", "Senior triple a notes benefit from thick subordination buffers.", "qual"),
            ("example", "Mezzanine tranches offer elevated floating returns to funds.", "target"),
            ("tryIt", "Subordinated equity notes capture residual spread arbitrage.", "final")
        ],
        [
            ("intro", "Par value overcollateralization coverage tests audited.", "top"),
            ("say1", "Defaulted assets and excess distressed loans face price haircuts.", "qual"),
            ("example", "Coverage test failures trigger automatic cash flow diversion.", "target"),
            ("tryIt", "Curative amortization de leverages senior debt to restore ratios.", "final")
        ],
        [
            ("intro", "Comprehensive collateral reinvestment and equity engine executed.", "top"),
            ("say1", "Quarterly floating interest collections service debt liabilities.", "qual"),
            ("example", "Automated test compliance protects senior debt note principal.", "target"),
            ("tryIt", "Lucrative cash distributions flow to subordinated equity holders.", "final")
        ]
    ],
    54: [
        [
            ("intro", "Strategic synthetic securitization balance sheet mandate set.", "top"),
            ("say1", "Credit risk is transferred synthetically without asset sales.", "qual"),
            ("example", "Core corporate banking relationships remain completely unblemished.", "target"),
            ("tryIt", "Revolving credit facilities are hedged without assignment friction.", "final")
        ],
        [
            ("intro", "Significant risk transfer supervisory frameworks evaluated.", "top"),
            ("say1", "Quantitative loss absorption tests prove genuine risk transfer.", "qual"),
            ("example", "Strict regulatory rules prohibit non contractual implicit support.", "target"),
            ("tryIt", "Independent legal opinions verify binding credit protection.", "final")
        ],
        [
            ("intro", "Funded credit linked notes compared against unfunded guarantees.", "top"),
            ("say1", "Funded notes deposit cash in escrow sovereign treasury assets.", "qual"),
            ("example", "Segregated collateral eliminates counterparty credit risk for banks.", "target"),
            ("tryIt", "Unfunded guarantees provide cost effective supranational support.", "final")
        ],
        [
            ("intro", "Securitization standardized approach capital formulas applied.", "top"),
            ("say1", "Senior retained tranches drop to the supervisory risk weight floor.", "qual"),
            ("example", "Transferred mezzanine positions absorb unexpected loss layers.", "target"),
            ("tryIt", "Dramatic risk weighted asset relief frees valuable equity capital.", "final")
        ],
        [
            ("intro", "Industrial bank capital optimization and return lab deployed.", "top"),
            ("say1", "Liberated common equity tier one capital is actively redeployed.", "qual"),
            ("example", "New corporate loan earnings exceed recurring guarantee fees.", "target"),
            ("tryIt", "Portfolio return on equity expands significantly post securitization.", "final")
        ]
    ],
    55: [
        [
            ("intro", "Enterprise structured credit command center initialized.", "top"),
            ("say1", "Synthesizing credit derivatives securitization and capital desks.", "qual"),
            ("example", "Multi module architecture coordinates balance sheet defense.", "target"),
            ("tryIt", "Systemic risk parameters benchmark institutional solvency.", "final")
        ],
        [
            ("intro", "Credit derivatives trading and index arbitrage module active.", "top"),
            ("say1", "Calibrated hazard rates model corporate default probabilities.", "qual"),
            ("example", "Portfolio credit spread sensitivity guides macro index hedging.", "target"),
            ("tryIt", "Delta neutral positioning immunizes corporate loan assets.", "final")
        ],
        [
            ("intro", "Cash securitization and collateral loan obligation engine running.", "top"),
            ("say1", "Priority of payments waterfall allocates floating debt interest.", "qual"),
            ("example", "Overcollateralization test compliance shields senior debt notes.", "target"),
            ("tryIt", "Curative cash flow diversion preserves structural stability.", "final")
        ],
        [
            ("intro", "Synthetic credit risk transfer balance sheet optimizer executing.", "top"),
            ("say1", "Basel standardized approach delivers substantial capital relief.", "qual"),
            ("example", "Mezzanine credit linked notes absorb stressed loss scenarios.", "target"),
            ("tryIt", "Accelerated capital velocity expands net bank return on equity.", "final")
        ],
        [
            ("intro", "Global credit contagion stress scenario successfully executed.", "top"),
            ("say1", "Derivative hedges generate mark to market gains amid market panic.", "qual"),
            ("example", "Collateral structures absorb defaults with zero senior note loss.", "target"),
            ("tryIt", "Mastery of enterprise structured credit architecture certified.", "final")
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

print("ALL BLOCK 11 VISUAL CAPTION INVARIANTS CONFIRMED!\n")

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
                "title": f"{short_title} \u2014 Structured Credit Operations",
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

# 4. Append Days 51-55 to bcomBanLongLessons.ts
lessons_file = os.path.join(os.getcwd(), 'src', 'lib', 'data', 'bcomBanLongLessons.ts')

with open(lessons_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Check if Day 51 already present
if 'day: 51' in content or '"day": 51' in content:
    print("Day 51 already exists in bcomBanLongLessons.ts. Skipping append.")
else:
    last_bracket_idx = content.rfind('];')
    if last_bracket_idx == -1:
        print("Could not find closing '];' in bcomBanLongLessons.ts!")
        sys.exit(1)

    formatted_days = []
    for d in days:
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

    print(f"Successfully appended Block 11 (Days 51-55) to {lessons_file}!")

# 5. Create Test Suite: tests/bcom_ban_days51_55_expansion.test.ts
test_content = """import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { BCOM_BAN_LONG_LESSONS } from '../src/lib/data/bcomBanLongLessons';

describe('BCOM Banking Month 2 Block 11 Expansion (Days 51-55 & Milestone 11 Capstone)', () => {
  it('should contain Days 51 through 55 in BCOM_BAN_LONG_LESSONS', () => {
    assert(BCOM_BAN_LONG_LESSONS.length >= 55, `Expected >= 55 days, found ${BCOM_BAN_LONG_LESSONS.length}`);
    for (let dayNum = 51; dayNum <= 55; dayNum++) {
      const lesson = BCOM_BAN_LONG_LESSONS.find((l) => l.day === dayNum);
      assert(lesson, `Day ${dayNum} not found in BCOM_BAN_LONG_LESSONS`);
      assert.strictEqual(lesson.coursePrefix, 'bcom_ban');
      assert(lesson.title && lesson.title.length > 5, `Day ${dayNum} missing title`);
      assert(lesson.goal && lesson.goal.length > 10, `Day ${dayNum} missing goal`);
      assert(lesson.recap && lesson.recap.length > 10, `Day ${dayNum} missing recap`);
      assert([45, 55, 60].includes(lesson.minutes || 0), `Day ${dayNum} minutes invalid: ${lesson.minutes}`);
    }
  });

  it('should have exactly 5 parts per day for Days 51 through 55', () => {
    for (let dayNum = 51; dayNum <= 55; dayNum++) {
      const lesson = BCOM_BAN_LONG_LESSONS.find((l) => l.day === dayNum)!;
      assert.strictEqual(lesson.parts.length, 5, `Day ${dayNum} must have exactly 5 parts`);
    }
  });

  it('should satisfy pedagogical invariants: >= 600 words per part for Days 51 to 55', () => {
    for (let dayNum = 51; dayNum <= 55; dayNum++) {
      const lesson = BCOM_BAN_LONG_LESSONS.find((l) => l.day === dayNum)!;
      let dayWords = 0;
      lesson.parts.forEach((part, idx) => {
        const sayText = Array.isArray(part.say) ? part.say.join(' ') : part.say;
        const words = sayText.trim().split(/\\s+/).filter(Boolean).length;
        dayWords += words;
        assert(
          words >= 600,
          `Day ${dayNum} Part ${idx + 1} (${part.title}) has ${words} words, must be >= 600`
        );
      });
      assert(dayWords >= 3000, `Day ${dayNum} total words (${dayWords}) must be >= 3000`);
    }
  });

  it('should satisfy assessment invariants: 4 options, answerIndex === 0, why >= 20 chars', () => {
    for (let dayNum = 51; dayNum <= 55; dayNum++) {
      const lesson = BCOM_BAN_LONG_LESSONS.find((l) => l.day === dayNum)!;
      lesson.parts.forEach((part, idx) => {
        const check = part.check;
        assert(check, `Day ${dayNum} Part ${idx + 1} missing check`);
        assert.strictEqual(check.options.length, 4, `Day ${dayNum} Part ${idx + 1} check must have 4 options`);
        assert.strictEqual(check.answerIndex, 0, `Day ${dayNum} Part ${idx + 1} answerIndex must be 0`);
        assert(check.why && check.why.length >= 20, `Day ${dayNum} Part ${idx + 1} check.why must be >= 20 chars`);
      });
    }
  });

  it('should have executable code snippets, non-empty outputs, example and tryIt in every part', () => {
    for (let dayNum = 51; dayNum <= 55; dayNum++) {
      const lesson = BCOM_BAN_LONG_LESSONS.find((l) => l.day === dayNum)!;
      lesson.parts.forEach((part, idx) => {
        assert(part.code && part.code.length > 20, `Day ${dayNum} Part ${idx + 1} missing valid code`);
        assert(part.output && part.output.length > 5, `Day ${dayNum} Part ${idx + 1} missing valid output`);
        assert(part.example && part.example.length > 20, `Day ${dayNum} Part ${idx + 1} missing valid example`);
        assert(part.tryIt && part.tryIt.length > 20, `Day ${dayNum} Part ${idx + 1} missing valid tryIt`);
      });
    }
  });

  it('should have valid Gate v2 visual envelopes in src/lib/data/lessonVisuals/bcom_ban/', () => {
    const visualsDir = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom_ban');
    for (let dayNum = 51; dayNum <= 55; dayNum++) {
      const visualPath = path.join(visualsDir, `day-${dayNum}.json`);
      assert(fs.existsSync(visualPath), `Visual file missing: ${visualPath}`);
      const raw = fs.readFileSync(visualPath, 'utf-8');
      const data = JSON.parse(raw);
      assert.strictEqual(data.schemaVersion, 1);
      assert.strictEqual(data.prefix, 'bcom_ban');
      assert.strictEqual(data.day, dayNum);
      assert.strictEqual(data.entries.length, 5);

      data.entries.forEach((entry: any, pIdx: number) => {
        assert(entry.codeHash && entry.codeHash.length === 64, `Day ${dayNum} entry ${pIdx} missing valid SHA-256 codeHash`);
        assert.strictEqual(entry.spec.template, 'funnel');
        assert(entry.spec.steps.length === 4, `Day ${dayNum} entry ${pIdx} steps must be 4`);
        entry.spec.steps.forEach((step: any) => {
          assert(!/\\d/.test(step.caption), `Caption contains digits: "${step.caption}" in Day ${dayNum}`);
          assert(step.caption.endsWith('.'), `Caption does not end with period: "${step.caption}" in Day ${dayNum}`);
          assert(step.caption.length <= 75, `Caption exceeds 75 chars: "${step.caption}" in Day ${dayNum}`);
        });
      });
    }
  });
});
"""

test_path = os.path.join(os.getcwd(), 'tests', 'bcom_ban_days51_55_expansion.test.ts')
with open(test_path, 'w', encoding='utf-8') as tf:
    tf.write(test_content)

print(f"Generated test suite at {test_path}!")
print("\n=== BLOCK 11 ASSEMBLY COMPLETE! ===")
