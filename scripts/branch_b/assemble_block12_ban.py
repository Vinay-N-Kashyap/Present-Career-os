# -*- coding: utf-8 -*-
"""
Assemble Month 2 Block 12 (Days 56-60 & Milestone 12 Grand Master Capstone)
Course: Banking, Treasury & Credit Operations (bcom_ban)
Files affected:
- src/lib/data/lessonVisuals/bcom_ban/day-56.json to day-60.json
- src/lib/data/bcomBanLongLessons.ts
- tests/bcom_ban_days56_60_expansion.test.ts
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
    expected_minutes = 60 if day_num == 60 else 45
    assert d.get("minutes") == expected_minutes, f"Day {day_num} minutes must be {expected_minutes}"
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

print(f"\nALL 25 PARTS PASSED! Total Block 12 Words: {total_block_words} words (avg {total_block_words/5:.1f} words/day)\n")

# 2. Captions mapping for Gate v2 visual envelopes
# Strict rules: ending with period, <= 75 chars, NO digits!
step_metadata = {
    56: [
        [
            ("intro", "Central bank balance sheet architecture and base money surveyed.", "top"),
            ("say1", "Monetary base expansion anchors commercial bank credit creation.", "qual"),
            ("example", "Reserve money calculations quantify sovereign liquidity injections.", "target"),
            ("tryIt", "Reserve balance ratios calibrate monetary multiplier velocity.", "final")
        ],
        [
            ("intro", "Liquidity adjustment facility and policy interest rate corridor set.", "top"),
            ("say1", "Standing deposit facilities absorb market cash without collateral.", "qual"),
            ("example", "Overnight repurchase agreements inject emergency liquidity buffers.", "target"),
            ("tryIt", "Asymmetric interest corridors constrain interbank volatility.", "final")
        ],
        [
            ("intro", "Open market operations and permanent sovereign bond actions active.", "top"),
            ("say1", "Outright secondary purchases expand domestic commercial reserves.", "qual"),
            ("example", "Simultaneous purchase and sale operations flatten sovereign curves.", "target"),
            ("tryIt", "Sterilized bond transactions neutralize inflationary capital flows.", "final")
        ],
        [
            ("intro", "Marginal standing facilities and emergency discount windows open.", "top"),
            ("say1", "Penal borrowing rates deter reckless treasury asset mismatches.", "qual"),
            ("example", "Statutory liquidity dips provide emergency cash during market panic.", "target"),
            ("tryIt", "Central bank lender of last resort interventions halt bank runs.", "final")
        ],
        [
            ("intro", "Industrial interbank clearing and corridor simulation initialized.", "top"),
            ("say1", "Automated liquidity sweeps balance real time gross settlement.", "qual"),
            ("example", "Emergency standing facilities resolve intraday interbank deficits.", "target"),
            ("tryIt", "Calibrated monetary policy operations maintain systemic stability.", "final")
        ]
    ],
    57: [
        [
            ("intro", "Sovereign debt issuance calendars and auction architectures set.", "top"),
            ("say1", "Treasury bill auctions fund short term national cash deficits.", "qual"),
            ("example", "Competitive institutional bidding establishes market discount rates.", "target"),
            ("tryIt", "Non competitive retail windows democratize government debt access.", "final")
        ],
        [
            ("intro", "Uniform and multiple price sovereign bond auctions evaluated.", "top"),
            ("say1", "Multiple price formats incentivize aggressive yield discrimination.", "qual"),
            ("example", "Discriminatory pricing risks penalizing aggressive primary bidders.", "target"),
            ("tryIt", "Dutch uniform auctions reduce strategic winner curse distortions.", "final")
        ],
        [
            ("intro", "Primary dealer institutional underwriting networks deployed.", "top"),
            ("say1", "Mandatory bidding quotas guarantee complete sovereign bond clearance.", "qual"),
            ("example", "Devolved auction allocations transfer unsold debt onto dealer books.", "target"),
            ("tryIt", "Two way market quotes provide deep secondary liquidity depth.", "final")
        ],
        [
            ("intro", "Nelson Siegel zero coupon yield curve modeling engine active.", "top"),
            ("say1", "Decoupled coupon and principal strips trade as zero coupon bonds.", "qual"),
            ("example", "Parametric yield curves interpolate benchmark sovereign spreads.", "target"),
            ("tryIt", "Separate trading of coupon and principal strips unlocks arbitrage.", "final")
        ],
        [
            ("intro", "Industrial sovereign bond auction and yield fitting lab running.", "top"),
            ("say1", "Primary dealer bid allocation algorithms resolve market demand.", "qual"),
            ("example", "Fitted zero curves price sovereign securities across maturities.", "target"),
            ("tryIt", "Comprehensive treasury auctions fund national fiscal development.", "final")
        ]
    ],
    58: [
        [
            ("intro", "Open banking regulatory architectures and digital protocols reviewed.", "top"),
            ("say1", "Customer data sovereignty dismantles legacy banking data monopolies.", "qual"),
            ("example", "Account information and payment service providers expand access.", "target"),
            ("tryIt", "Digital public infrastructure connects multi bank ecosystems.", "final")
        ],
        [
            ("intro", "Granular electronic consent artifacts and permissions configured.", "top"),
            ("say1", "Open revocable conditional and auditable standards protect users.", "qual"),
            ("example", "Cryptographic tokens enforce purpose and retention boundaries.", "target"),
            ("tryIt", "Real time consent revocation terminates unauthorized data streams.", "final")
        ],
        [
            ("intro", "Financial grade application programming interface security set.", "top"),
            ("say1", "Mutual transport layer security binds authenticated client certs.", "qual"),
            ("example", "Application layer public key cryptography protects transaction data.", "target"),
            ("tryIt", "Sender constrained access tokens eliminate token theft risks.", "final")
        ],
        [
            ("intro", "Digital cash flow underwriting and transaction analytics active.", "top"),
            ("say1", "Forensic revenue filters isolate true commercial customer sales.", "qual"),
            ("example", "Debt service coverage ratios and bounce audits screen defaults.", "target"),
            ("tryIt", "Algorithmic credit decisioning enables instant loan approvals.", "final")
        ],
        [
            ("intro", "Industrial account aggregator credit underwriting lab initialized.", "top"),
            ("say1", "End to end consent and data pipelines process banking records.", "qual"),
            ("example", "Forensic cash flow analysis proves borrower repayment capacity.", "target"),
            ("tryIt", "Instant digital lending facilities transform enterprise financing.", "final")
        ]
    ],
    59: [
        [
            ("intro", "Climate risk supervisory frameworks and green swan hazards reviewed.", "top"),
            ("say1", "Forward looking scenario analysis models radical climate shifts.", "qual"),
            ("example", "Double materiality evaluates inside out and outside in risks.", "target"),
            ("tryIt", "Supervisory capital buffers insulate banks against climate shocks.", "final")
        ],
        [
            ("intro", "Physical catastrophe and economic transition risk channels mapped.", "top"),
            ("say1", "Geospatial coordinate mapping assesses physical hazard exposure.", "qual"),
            ("example", "Carbon taxation models quantify stranded asset balance sheet hits.", "target"),
            ("tryIt", "Stressed debt service ratios reveal vulnerable corporate obligors.", "final")
        ],
        [
            ("intro", "Partnership for carbon accounting financials standard deployed.", "top"),
            ("say1", "Enterprise value attribution factors allocate client emissions.", "qual"),
            ("example", "Weighted carbon intensity benchmarks track portfolio progress.", "target"),
            ("tryIt", "Audited greenhouse gas data improves portfolio accounting scores.", "final")
        ],
        [
            ("intro", "Sustainable finance taxonomies and green bond standards audited.", "top"),
            ("say1", "Ring fenced proceeds dedicate capital to certified green projects.", "qual"),
            ("example", "Second party opinions verify environmental mitigation impact.", "target"),
            ("tryIt", "Greenium pricing concessions lower sustainable borrowing costs.", "final")
        ],
        [
            ("intro", "Industrial climate stress testing and financed emissions lab active.", "top"),
            ("say1", "Disorderly transition scenarios model corporate credit impairment.", "qual"),
            ("example", "Green bond issuances rebalance high carbon wholesale portfolios.", "target"),
            ("tryIt", "Sustainable finance frameworks defend long term banking solvency.", "final")
        ]
    ],
    60: [
        [
            ("intro", "Enterprise commercial banking master architecture operational.", "top"),
            ("say1", "Unified balance sheet consoles balance return liquidity and capital.", "qual"),
            ("example", "Prudential regulatory triad maintains systemic banking safety.", "target"),
            ("tryIt", "Robust capital buffers absorb compounding macroeconomic shocks.", "final")
        ],
        [
            ("intro", "Sovereign treasury war room and monetary policy engine active.", "top"),
            ("say1", "Emergency policy rate hikes trigger secondary bond yield surges.", "qual"),
            ("example", "Interest rate swaps immunize available for sale portfolio losses.", "target"),
            ("tryIt", "Central bank standing facilities balance interbank cash reserves.", "final")
        ],
        [
            ("intro", "Open banking credit origination and account aggregator rails open.", "top"),
            ("say1", "Cryptographic consent tokens authorize encrypted data extraction.", "qual"),
            ("example", "Algorithmic forensic filters eliminate circular transfer revenue.", "target"),
            ("tryIt", "Instant working capital approvals disburse prime corporate loans.", "final")
        ],
        [
            ("intro", "Supervisory climate stress testing and carbon pricing active.", "top"),
            ("say1", "Disorderly carbon taxes stress borrower debt service capability.", "qual"),
            ("example", "Green bond issuances rotate capital into renewable energy loans.", "target"),
            ("tryIt", "Portfolio decarbonization eliminates supervisory capital surcharges.", "final")
        ],
        [
            ("intro", "Grand master solvency war room and graduation console running.", "top"),
            ("say1", "Integrated multi phase defense proves institutional resilience.", "qual"),
            ("example", "Basel capital adequacy ratios affirm total enterprise solvency.", "target"),
            ("tryIt", "Sixty day commercial banking masterclass successfully completed.", "final")
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
                "title": f"{short_title} \u2014 Central Banking & Solvency",
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

    print(f"Successfully appended Block 12 (Days 56-60) to {lessons_file}!")

# 5. Create Test Suite: tests/bcom_ban_days56_60_expansion.test.ts
test_content = """import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { BCOM_BAN_LONG_LESSONS } from '../src/lib/data/bcomBanLongLessons';

describe('BCOM Banking Month 2 Block 12 Expansion (Days 56-60 & Milestone 12 Grand Master Capstone)', () => {
  it('should contain Days 56 through 60 in BCOM_BAN_LONG_LESSONS', () => {
    assert(BCOM_BAN_LONG_LESSONS.length >= 60, `Expected >= 60 days, found ${BCOM_BAN_LONG_LESSONS.length}`);
    for (let dayNum = 56; dayNum <= 60; dayNum++) {
      const lesson = BCOM_BAN_LONG_LESSONS.find((l) => l.day === dayNum);
      assert(lesson, `Day ${dayNum} not found in BCOM_BAN_LONG_LESSONS`);
      assert.strictEqual(lesson.coursePrefix, 'bcom_ban');
      assert(lesson.title && lesson.title.length > 5, `Day ${dayNum} missing title`);
      assert(lesson.goal && lesson.goal.length > 10, `Day ${dayNum} missing goal`);
      assert(lesson.recap && lesson.recap.length > 10, `Day ${dayNum} missing recap`);
      const expectedMinutes = dayNum === 60 ? 60 : 45;
      assert.strictEqual(lesson.minutes, expectedMinutes, `Day ${dayNum} minutes invalid: ${lesson.minutes}`);
    }
  });

  it('should have exactly 5 parts per day for Days 56 through 60', () => {
    for (let dayNum = 56; dayNum <= 60; dayNum++) {
      const lesson = BCOM_BAN_LONG_LESSONS.find((l) => l.day === dayNum)!;
      assert.strictEqual(lesson.parts.length, 5, `Day ${dayNum} must have exactly 5 parts`);
    }
  });

  it('should satisfy strict word count threshold (>= 600 words per part) across all 25 parts', () => {
    for (let dayNum = 56; dayNum <= 60; dayNum++) {
      const lesson = BCOM_BAN_LONG_LESSONS.find((l) => l.day === dayNum)!;
      let dayWords = 0;
      lesson.parts.forEach((part, pIdx) => {
        const words = part.say.join(' ').trim().split(/\\s+/).length;
        dayWords += words;
        assert(
          words >= 600,
          `Day ${dayNum} Part ${pIdx + 1} has ${words} words, strictly under 600 words threshold!`
        );
      });
      assert(
        dayWords >= 3000,
        `Day ${dayNum} total words ${dayWords} is under 3000 words!`
      );
    }
  });

  it('should enforce Socratic check quiz invariants (answer: 0, answerIndex: 0, 4 options, why >= 20)', () => {
    for (let dayNum = 56; dayNum <= 60; dayNum++) {
      const lesson = BCOM_BAN_LONG_LESSONS.find((l) => l.day === dayNum)!;
      lesson.parts.forEach((part, pIdx) => {
        const check = (part as any).check;
        assert(check, `Day ${dayNum} Part ${pIdx + 1} missing check`);
        assert.strictEqual(check.options.length, 4, `Day ${dayNum} Part ${pIdx + 1} options != 4`);
        assert.strictEqual(check.answer, 0, `Day ${dayNum} Part ${pIdx + 1} check.answer != 0`);
        assert.strictEqual(check.answerIndex, 0, `Day ${dayNum} Part ${pIdx + 1} check.answerIndex != 0`);
        assert(
          check.why && check.why.length >= 20,
          `Day ${dayNum} Part ${pIdx + 1} check.why must be >= 20 chars`
        );
      });
    }
  });

  it('should enforce presence of example, tryIt, code and output in every part', () => {
    for (let dayNum = 56; dayNum <= 60; dayNum++) {
      const lesson = BCOM_BAN_LONG_LESSONS.find((l) => l.day === dayNum)!;
      lesson.parts.forEach((part, pIdx) => {
        assert(part.example && part.example.length > 20, `Day ${dayNum} Part ${pIdx + 1} missing example`);
        assert(part.tryIt && part.tryIt.length > 20, `Day ${dayNum} Part ${pIdx + 1} missing tryIt`);
        assert(part.code && part.code.length > 20, `Day ${dayNum} Part ${pIdx + 1} missing code`);
        assert(part.output && part.output.length > 10, `Day ${dayNum} Part ${pIdx + 1} missing output`);
      });
    }
  });

  it('should have valid Gate v2 visual envelopes with matching SHA-256 codeHash bindings', () => {
    const visualsDir = path.join(process.cwd(), 'src', 'lib', 'data', 'lessonVisuals', 'bcom_ban');
    const standardStages = [
      'Macro Liquidity Intake',
      'Treasury Risk Screening',
      'Balance Sheet Allocation',
      'Solvency Affirmation'
    ];

    for (let dayNum = 56; dayNum <= 60; dayNum++) {
      const visualPath = path.join(visualsDir, `day-${dayNum}.json`);
      assert(fs.existsSync(visualPath), `Visual file not found: ${visualPath}`);
      const raw = fs.readFileSync(visualPath, 'utf-8');
      const visual = JSON.parse(raw);

      assert.strictEqual(visual.schemaVersion, 1);
      assert.strictEqual(visual.prefix, 'bcom_ban');
      assert.strictEqual(visual.day, dayNum);
      assert.strictEqual(visual.entries.length, 5);

      const lesson = BCOM_BAN_LONG_LESSONS.find((l) => l.day === dayNum)!;

      visual.entries.forEach((entry: any, eIdx: number) => {
        const part = lesson.parts[eIdx];
        assert.strictEqual(entry.partTitle, part.title);
        assert.strictEqual(entry.spec.template, 'funnel');
        assert.strictEqual(entry.spec.steps.length, 4);

        // Check stages and captions
        entry.spec.steps.forEach((step: any) => {
          assert(['intro', 'say1', 'example', 'tryIt'].includes(step.at));
          assert(step.caption.endsWith('.'), `Caption must end with period: ${step.caption}`);
          assert(step.caption.length <= 75, `Caption exceeds 75 chars: ${step.caption}`);
          assert(!/\\d/.test(step.caption), `Caption contains numeric digits: ${step.caption}`);
          assert.strictEqual(step.stages.length, 4);
          step.stages.forEach((st: any, sIdx: number) => {
            assert.strictEqual(st.label, standardStages[sIdx]);
          });
        });

        // Verify SHA-256 hash binding
        const crypto = require('crypto');
        const expectedHash = crypto
          .createHash('sha256')
          .update(part.title + part.say.join('') + (part.code || ''))
          .digest('hex');
        assert.strictEqual(entry.codeHash, expectedHash, `Hash mismatch in Day ${dayNum} Part ${eIdx + 1}`);
      });
    }
  });
});
"""

test_path = os.path.join(os.getcwd(), 'tests', 'bcom_ban_days56_60_expansion.test.ts')
with open(test_path, 'w', encoding='utf-8') as tf:
    tf.write(test_content)
print(f"Created unit test suite: {test_path}")
print("=== BLOCK 12 ASSEMBLY SCRIPT COMPLETE ===")
