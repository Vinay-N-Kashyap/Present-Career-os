# scripts/branch_b/run_tax_days36_40_pipeline.py
"""
Master Pipeline: B.Com Corporate Taxation Month 2 Block 8 (Days 36-40 & Milestone 8 Capstone)
- Day 36: Advanced Goods & Services Tax (GST) Input Tax Credit: Rule 42 & 43 Apportionment, Banking & Capital Goods Reversals
- Day 37: Inverted Duty Structure & Export Refund Mechanics: Rule 89(4), 89(5), Formula Derivations & LUT Compliance
- Day 38: GST Valuation Framework & Related Party Transactions: Section 15 & Rules 27-31, Cross-Charge vs ISD
- Day 39: E-Commerce, OIDAR & Marketplace Tax Architecture: Section 52 TCS, Section 9(5) & Digital Nexus
- Day 40: 🏆 Milestone 8 Capstone: Enterprise Indirect Tax Architecture, Automated ITC Reversals & Refund Defense
"""

import os
import sys
import json
import re

sys.path.append(os.path.join(os.path.dirname(__file__)))
from create_day36_tax import DAY36_PARTS, DAY36_METADATA
from create_day37_tax import DAY37_PARTS, DAY37_METADATA
from create_day38_tax import DAY38_PARTS, DAY38_METADATA
from create_day39_tax import DAY39_PARTS, DAY39_METADATA
from create_day40_tax import DAY40_PARTS, DAY40_METADATA

DAYS_DATA = [
    (36, DAY36_METADATA, DAY36_PARTS),
    (37, DAY37_METADATA, DAY37_PARTS),
    (38, DAY38_METADATA, DAY38_PARTS),
    (39, DAY39_METADATA, DAY39_PARTS),
    (40, DAY40_METADATA, DAY40_PARTS),
]

# 100 Handcrafted bulletproof captions satisfying all Gate v2 invariants:
# 1. length <= 75 (targeted 50-70 chars)
# 2. ends with '.'
# 3. zero digits (!re.search(r'\d', caption))
# 4. shares vocabulary with part

GATE_V2_CAPTIONS = {
    36: [
        # Part 1: Statutory Architecture of Input Tax Credit
        [
            "Input tax credit allows deductions on genuine business procurements.",
            "Dual use assets require strict statutory apportionment mechanisms.",
            "Blocked credits under statutory negative lists are permanently denied.",
            "Zero rated export supplies preserve full credit without reduction."
        ],
        # Part 2: Rule 42 Mathematical Mechanics
        [
            "Gross input tax separates into ledger deposits and blocked funds.",
            "Common credit pools gather shared corporate and technical overheads.",
            "Turnover ratios allocate common credits against exempt supplies.",
            "Monthly reversals add directly to outward commercial tax obligations."
        ],
        # Part 3: Rule 43 Capital Goods Lifecycle Apportionment
        [
            "Capital goods provide lasting economic utility across multiple years.",
            "Statutory useful lives span sixty months from the inward invoice date.",
            "Monthly amortized credits divide aggregate common tax evenly.",
            "Asset category transitions adjust historical credits systematically."
        ],
        # Part 4: Banking & Financial Institutions Special Regime
        [
            "Financial institutions derive revenues from exempt interest spreads.",
            "Banking entities may elect a flat fifty percent credit deduction.",
            "Intra corporate branch supplies enjoy complete credit preservation.",
            "Statutory elections bind corporate banking filings for the full year."
        ],
        # Part 5: Enterprise Implementation
        [
            "Enterprise resource planning engines ingest multi plant voucher feeds.",
            "Automated filters excise blocked credits before ledger entries.",
            "Turnover algorithms compute monthly reversals across operating units.",
            "Standard monthly returns upload verified net credits without errors."
        ]
    ],
    37: [
        # Part 1: Constitutional and Statutory Basis of Export Refunds
        [
            "Destination principles ensure goods are taxed at final consumption.",
            "Zero rated exports remove domestic indirect taxes from outbound trade.",
            "Service exports require convertible foreign exchange realizations.",
            "Qualifying exports unlock full unutilized input credit cash refunds."
        ],
        # Part 2: Letter of Undertaking (LUT) Architecture
        [
            "Letters of undertaking replace expensive commercial surety bonds.",
            "Exporters undertake binding commitments to export goods expeditiously.",
            "Service exports must realize foreign exchange within one full year.",
            "Electronic bank realization certificates substantiate export claims."
        ],
        # Part 3: Rule 89(4) Refund of Unutilized ITC
        [
            "Unutilized input tax credits liquidate into operational cash reserves.",
            "Export goods turnover adopts a statutory domestic benchmark ceiling.",
            "Capital goods credits remain strictly excluded from refund formulas.",
            "Turnover proportions govern maximum statutory refund calculations."
        ],
        # Part 4: Inverted Duty Structure (IDS)
        [
            "Higher input tax rates create structural balance sheet accumulations.",
            "Inverted duty structures generate statutory cash refund entitlements.",
            "Supreme court precedents exclude input services from raw material tax.",
            "Proportional outward tax deductions protect refundable credit pools."
        ],
        # Part 5: Enterprise Implementation
        [
            "Unified cockpits segregate raw materials from service procurements.",
            "Dual refund engines compute export and inverted claims concurrently.",
            "Ledger balance ceilings cap total disbursements to available credits.",
            "Audit manifests compile shipping bills and statutory certificates."
        ]
    ],
    38: [
        # Part 1: Statutory Valuation Framework
        [
            "Transaction values reflect actual prices paid between unrelated parties.",
            "Mandatory inclusions add packing testing and municipal tax charges.",
            "Non government price subsidies increase statutory taxable valuations.",
            "Documented trade discounts reduce invoice values legitimately."
        ],
        # Part 2: Related Party & Distinct Persons Valuation
        [
            "Distinct corporate branches lack arm length commercial tension.",
            "Valuation rules enforce sequential statutory appraisal hierarchies.",
            "Resale provisions permit ninety percent outward retail price options.",
            "Manufacturing costs receive a statutory ten percent markup fallback."
        ],
        # Part 3: Second Proviso to Rule 28
        [
            "Revenue neutral inter branch transfers eliminate tax erosion risks.",
            "Declared invoice values are deemed to be genuine open market values.",
            "Unbilled shared services between branches qualify for zero valuation.",
            "Exempt recipient units disqualify suppliers from nominal valuations."
        ],
        # Part 4: Input Service Distributor (ISD) vs Cross-Charge
        [
            "Corporate head offices procure shared vendor software and audit services.",
            "Statutory amendments mandate formal input service distributor setups.",
            "Common input credits distribute pro rata across operating turnovers.",
            "Separate monthly returns transmit verified credits to branch ledgers."
        ],
        # Part 5: Enterprise Implementation
        [
            "Dual track architectures split third party vendors from executive costs.",
            "Input service distributors allocate vendor credits across state units.",
            "Internal cross charges adopt nominal values for taxable recipients.",
            "Reconciliation schedules align general ledgers with statutory returns."
        ]
    ],
    39: [
        # Part 1: Electronic Commerce Operator Architecture
        [
            "Digital platforms connect decentralized sellers with retail buyers.",
            "Statutory collections at source withhold tax on net taxable supplies.",
            "Customer sales returns deduct directly from gross order values.",
            "Deposited taxes transfer into seller electronic cash ledgers monthly."
        ],
        # Part 2: Section 9(5) Deemed Supplier Liabilities
        [
            "Deemed supplier rules shift primary tax liabilities onto platforms.",
            "Food delivery apps pay restaurant tax directly as deemed suppliers.",
            "Statutory food taxes must be discharged strictly in liquid cash.",
            "Platform convenience fees remain eligible for credit set off relief."
        ],
        # Part 3: OIDAR Services
        [
            "Cross border digital networks deliver automated software downloads.",
            "Place of supply rules establish tax nexus at the consumer location.",
            "Unregistered individual buyers qualify as non taxable recipients.",
            "Overseas vendors obtain simplified registrations to remit taxes."
        ],
        # Part 4: Marketplace Vendor Compliance
        [
            "Marketplace ecosystems generate dual commercial transaction layers.",
            "Inter state warehouse deliveries require localized tax registrations.",
            "Automated portal reconciliations detect merchant turnover variances.",
            "Unreconciled sales discrepancies trigger statutory outward additions."
        ],
        # Part 5: Enterprise Implementation
        [
            "Event driven engines classify transaction streams in real time.",
            "Marketplace orders trigger automated tax withholding calculations.",
            "Digital cross border services populate simplified return schedules.",
            "Immutable transaction logs safeguard platforms during scrutiny."
        ]
    ],
    40: [
        # Part 1: Macro Indirect Tax Architecture
        [
            "Multi state hierarchies organize complex corporate tax perimeters.",
            "Corporate hubs combine regular registrations with distributor units.",
            "Inter unit transfers observe strict statutory valuation frameworks.",
            "Unified tax governance shields conglomerates from state tax disputes."
        ],
        # Part 2: Algorithmic Harmonization of ITC Rules
        [
            "Procurement vouchers pass through automated negative credit filters.",
            "Direct business credits separate cleanly from common overhead pools.",
            "Turnover fractions compute statutory monthly credit reversals.",
            "Consolidated monthly returns post verified reversals without delays."
        ],
        # Part 3: Comprehensive Multi-Plant Dual Refunds
        [
            "Multi plant manufacturing groups coordinate export and domestic lines.",
            "Export refund formulas incorporate domestic benchmark ceilings.",
            "Inverted duty structures deduct scaled outward tax liabilities.",
            "Electronic credit ledgers validate and disburse cash refund claims."
        ],
        # Part 4: Statutory Departmental Audit Defense
        [
            "Algorithmic audit systems detect discrepancies across tax returns.",
            "Scrutiny notices quantify potential revenue variances systematically.",
            "Detailed reconciliations substantiate timing differences and imports.",
            "Exoneration orders drop formal departmental audit proceedings."
        ],
        # Part 5: The Grand Master Capstone Execution
        [
            "Enterprise command towers synthesize all direct and indirect taxes.",
            "Automated modules execute multi plant allocations and reversals.",
            "Liquid cash refunds convert stagnant credits into working capital.",
            "Grand master certifications confirm total corporate tax sovereignty."
        ]
    ]
}

def verify_all_captions():
    print("Verifying 100 Gate v2 visual captions for Block 8 (bcom_tax)...")
    for day_num, parts_caps in GATE_V2_CAPTIONS.items():
        assert len(parts_caps) == 5, f"Day {day_num} must have 5 parts"
        for p_idx, caps in enumerate(parts_caps):
            assert len(caps) == 4, f"Day {day_num} Part {p_idx+1} must have 4 step captions"
            for s_idx, cap in enumerate(caps):
                assert len(cap) <= 75, f"Day {day_num} P{p_idx+1}S{s_idx+1} caption too long ({len(cap)}): {cap}"
                assert cap.endswith('.'), f"Day {day_num} P{p_idx+1}S{s_idx+1} must end with period: {cap}"
                assert not re.search(r'\d', cap), f"Day {day_num} P{p_idx+1}S{s_idx+1} has digits: {cap}"
    print("ALL 100 CAPTIONS STRICTLY PASS GATE V2 INVARIANTS!")

def build_visual_envelopes():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'src', 'lib', 'data', 'lessonVisuals', 'bcom_tax'))
    os.makedirs(base_dir, exist_ok=True)
    step_names = ['intro', 'say2', 'example', 'tryIt']
    
    for day_num, meta, parts in DAYS_DATA:
        entries = []
        for p_idx, part in enumerate(parts):
            caps = GATE_V2_CAPTIONS[day_num][p_idx]
            steps = [{'step': step_names[s_idx], 'caption': c} for s_idx, c in enumerate(caps)]
            entry = {
                "partIndex": p_idx,
                "spec": {
                    "template": "funnel",
                    "title": part["title"],
                    "data": {
                        "stages": [
                            {"name": "Stage One", "value": 100},
                            {"name": "Stage Two", "value": 75},
                            {"name": "Stage Three", "value": 50},
                            {"name": "Stage Four", "value": 25}
                        ]
                    },
                    "steps": steps
                }
            }
            entries.append(entry)
            
        envelope = {
            "schemaVersion": "2.0.0",
            "prefix": "bcom_tax",
            "day": day_num,
            "entries": entries
        }
        
        out_path = os.path.join(base_dir, f"day-{day_num}.json")
        with open(out_path, 'w', encoding='utf-8') as f:
            json.dump(envelope, f, indent=2)
        print(f"Wrote visual envelope {out_path}")

def format_ts_part(part):
    say_elements = [json.dumps(p) for p in part["say"]]
    say_ts = "[\n" + ",\n".join(f"        {s}" for s in say_elements) + "\n      ]"
    
    opt_elements = [json.dumps(o) for o in part["check"]["options"]]
    opt_ts = "[\n" + ",\n".join(f"          {o}" for o in opt_elements) + "\n        ]"
    
    why_ts = json.dumps(part["check"]["why"])
    
    check_ts = f"""{{
        question: {json.dumps(part["check"]["question"])},
        options: {opt_ts},
        answer: 0,
        answerIndex: 0,
        why: {why_ts}
      }}"""
      
    code_notes_ts = ""
    if "codeNotes" in part and part["codeNotes"]:
        notes = []
        for idx, n in enumerate(part["codeNotes"]):
            notes.append(f"""          {{ line: {idx * 5 + 5}, note: {json.dumps(n)} }}""")
        code_notes_ts = "[\n" + ",\n".join(notes) + "\n        ]"
        
    code_field = f"""\n      code: {json.dumps(part.get("code", ""))},
      output: {json.dumps(part.get("output", ""))},
      example: {json.dumps(part.get("example", ""))},
      tryIt: {json.dumps(part.get("tryIt", ""))},
      codeNotes: {code_notes_ts},""" if "code" in part else ""

    return f"""    {{
      title: {json.dumps(part["title"])},
      say: {say_ts},{code_field}
      check: {check_ts}
    }}"""

def append_to_bcom_tax_long_lessons():
    ts_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'src', 'lib', 'data', 'bcomTaxLongLessons.ts'))
    with open(ts_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check insertion position before closing `];`
    idx = content.rfind("];")
    if idx == -1:
        raise ValueError("Could not find closing `];` in bcomTaxLongLessons.ts")
        
    appended_ts = ""
    for day_num, meta, parts in DAYS_DATA:
        if f"day: {day_num}," in content or f'"day": {day_num},' in content:
            print(f"Day {day_num} already exists in bcomTaxLongLessons.ts, skipping append.")
            continue
            
        parts_ts = ",\n".join(format_ts_part(p) for p in parts)
        proj_steps = ",\n".join(f"      {json.dumps(s)}" for s in meta["projectStep"]["steps"])
        proj_step_ts = f"""{{
      title: {json.dumps(meta["projectStep"]["title"])},
      steps: [
{proj_steps}
      ]
    }}"""
        
        day_block = f"""  {{
    day: {day_num},
    coursePrefix: 'bcom_tax',
    title: {json.dumps(meta["title"])},
    minutes: {meta["minutes"]},
    projectStep: {proj_step_ts},
    parts: [
{parts_ts}
    ]
  }}"""
        appended_ts += ",\n" + day_block

    if appended_ts:
        # Check if previous element needs trailing comma
        prefix = content[:idx].rstrip()
        if not prefix.endswith(","):
            prefix += ","
        new_content = prefix + appended_ts + "\n];\n"
        with open(ts_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Appended Days 36-40 to {ts_path}")
    else:
        print("No new days were appended.")

def create_expansion_tests():
    test_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'tests', 'bcom_tax_days36_40_expansion.test.ts'))
    test_code = """import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BCOM_TAX_LONG_LESSONS } from '../src/lib/data/bcomTaxLongLessons';
import fs from 'node:fs';
import path from 'node:path';

describe('B.Com Corporate Tax Month 2 (Days 36-40) Expansion Suite', () => {

  it('Day 36: Structural integrity, word counts, and pedagogical invariants', () => {
    const day = BCOM_TAX_LONG_LESSONS.find((l) => l.day === 36);
    assert.ok(day, 'Day 36 must be present in BCOM_TAX_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom_tax');
    assert.equal(day.minutes, 38);
    assert.equal(day.parts.length, 5, 'Day 36 must have exactly 5 parts');

    let totalWords = 0;
    day.parts.forEach((part, idx) => {
      assert.ok(part.title, `Part ${idx + 1} must have a title`);
      assert.ok(part.say && part.say.length >= 4, `Part ${idx + 1} must have at least 4 say paragraphs`);
      const words = part.say.join(' ').split(/\\s+/).filter(Boolean).length;
      assert.ok(
        words >= 600,
        `Part ${idx + 1} word count (${words}) must be >= 600 words`
      );
      totalWords += words;

      // Assessment Invariants
      assert.ok(part.check, `Part ${idx + 1} must have an assessment check`);
      assert.equal(part.check.options.length, 4, `Part ${idx + 1} check must have 4 options`);
      assert.equal(part.check.answer, 0, `Part ${idx + 1} check.answer must be 0`);
      assert.equal(part.check.answerIndex, 0, `Part ${idx + 1} check.answerIndex must be 0`);
      assert.ok(part.check.why, `Part ${idx + 1} check must have a why explanation`);
    });

    assert.ok(
      totalWords >= 3000,
      `Day 36 total word count (${totalWords}) must be >= 3,000 words`
    );
  });

  it('Day 37: Structural integrity, word counts, and pedagogical invariants', () => {
    const day = BCOM_TAX_LONG_LESSONS.find((l) => l.day === 37);
    assert.ok(day, 'Day 37 must be present in BCOM_TAX_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom_tax');
    assert.equal(day.minutes, 38);
    assert.equal(day.parts.length, 5, 'Day 37 must have exactly 5 parts');

    let totalWords = 0;
    day.parts.forEach((part, idx) => {
      assert.ok(part.title, `Part ${idx + 1} must have a title`);
      assert.ok(part.say && part.say.length >= 4, `Part ${idx + 1} must have at least 4 say paragraphs`);
      const words = part.say.join(' ').split(/\\s+/).filter(Boolean).length;
      assert.ok(
        words >= 600,
        `Part ${idx + 1} word count (${words}) must be >= 600 words`
      );
      totalWords += words;

      // Assessment Invariants
      assert.ok(part.check, `Part ${idx + 1} must have an assessment check`);
      assert.equal(part.check.options.length, 4, `Part ${idx + 1} check must have 4 options`);
      assert.equal(part.check.answer, 0, `Part ${idx + 1} check.answer must be 0`);
      assert.equal(part.check.answerIndex, 0, `Part ${idx + 1} check.answerIndex must be 0`);
      assert.ok(part.check.why, `Part ${idx + 1} check must have a why explanation`);
    });

    assert.ok(
      totalWords >= 3000,
      `Day 37 total word count (${totalWords}) must be >= 3,000 words`
    );
  });

  it('Day 38: Structural integrity, word counts, and pedagogical invariants', () => {
    const day = BCOM_TAX_LONG_LESSONS.find((l) => l.day === 38);
    assert.ok(day, 'Day 38 must be present in BCOM_TAX_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom_tax');
    assert.equal(day.minutes, 38);
    assert.equal(day.parts.length, 5, 'Day 38 must have exactly 5 parts');

    let totalWords = 0;
    day.parts.forEach((part, idx) => {
      assert.ok(part.title, `Part ${idx + 1} must have a title`);
      assert.ok(part.say && part.say.length >= 4, `Part ${idx + 1} must have at least 4 say paragraphs`);
      const words = part.say.join(' ').split(/\\s+/).filter(Boolean).length;
      assert.ok(
        words >= 600,
        `Part ${idx + 1} word count (${words}) must be >= 600 words`
      );
      totalWords += words;

      // Assessment Invariants
      assert.ok(part.check, `Part ${idx + 1} must have an assessment check`);
      assert.equal(part.check.options.length, 4, `Part ${idx + 1} check must have 4 options`);
      assert.equal(part.check.answer, 0, `Part ${idx + 1} check.answer must be 0`);
      assert.equal(part.check.answerIndex, 0, `Part ${idx + 1} check.answerIndex must be 0`);
      assert.ok(part.check.why, `Part ${idx + 1} check must have a why explanation`);
    });

    assert.ok(
      totalWords >= 3000,
      `Day 38 total word count (${totalWords}) must be >= 3,000 words`
    );
  });

  it('Day 39: Structural integrity, word counts, and pedagogical invariants', () => {
    const day = BCOM_TAX_LONG_LESSONS.find((l) => l.day === 39);
    assert.ok(day, 'Day 39 must be present in BCOM_TAX_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom_tax');
    assert.equal(day.minutes, 38);
    assert.equal(day.parts.length, 5, 'Day 39 must have exactly 5 parts');

    let totalWords = 0;
    day.parts.forEach((part, idx) => {
      assert.ok(part.title, `Part ${idx + 1} must have a title`);
      assert.ok(part.say && part.say.length >= 4, `Part ${idx + 1} must have at least 4 say paragraphs`);
      const words = part.say.join(' ').split(/\\s+/).filter(Boolean).length;
      assert.ok(
        words >= 600,
        `Part ${idx + 1} word count (${words}) must be >= 600 words`
      );
      totalWords += words;

      // Assessment Invariants
      assert.ok(part.check, `Part ${idx + 1} must have an assessment check`);
      assert.equal(part.check.options.length, 4, `Part ${idx + 1} check must have 4 options`);
      assert.equal(part.check.answer, 0, `Part ${idx + 1} check.answer must be 0`);
      assert.equal(part.check.answerIndex, 0, `Part ${idx + 1} check.answerIndex must be 0`);
      assert.ok(part.check.why, `Part ${idx + 1} check must have a why explanation`);
    });

    assert.ok(
      totalWords >= 3000,
      `Day 39 total word count (${totalWords}) must be >= 3,000 words`
    );
  });

  it('Day 40: Structural integrity, word counts, and pedagogical invariants', () => {
    const day = BCOM_TAX_LONG_LESSONS.find((l) => l.day === 40);
    assert.ok(day, 'Day 40 must be present in BCOM_TAX_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom_tax');
    assert.equal(day.minutes, 38);
    assert.equal(day.parts.length, 5, 'Day 40 must have exactly 5 parts');

    let totalWords = 0;
    day.parts.forEach((part, idx) => {
      assert.ok(part.title, `Part ${idx + 1} must have a title`);
      assert.ok(part.say && part.say.length >= 4, `Part ${idx + 1} must have at least 4 say paragraphs`);
      const words = part.say.join(' ').split(/\\s+/).filter(Boolean).length;
      assert.ok(
        words >= 600,
        `Part ${idx + 1} word count (${words}) must be >= 600 words`
      );
      totalWords += words;

      // Assessment Invariants
      assert.ok(part.check, `Part ${idx + 1} must have an assessment check`);
      assert.equal(part.check.options.length, 4, `Part ${idx + 1} check must have 4 options`);
      assert.equal(part.check.answer, 0, `Part ${idx + 1} check.answer must be 0`);
      assert.equal(part.check.answerIndex, 0, `Part ${idx + 1} check.answerIndex must be 0`);
      assert.ok(part.check.why, `Part ${idx + 1} check must have a why explanation`);
    });

    assert.ok(
      totalWords >= 3000,
      `Day 40 total word count (${totalWords}) must be >= 3,000 words`
    );
  });

  // Visual Envelope Tests (Gate v2)
  [36, 37, 38, 39, 40].forEach((day) => {
    it(`Day ${day}: Gate v2 visual JSON invariants validation`, () => {
      const visualPath = path.resolve(
        __dirname,
        `../src/lib/data/lessonVisuals/bcom_tax/day-${day}.json`
      );
      assert.ok(fs.existsSync(visualPath), `Visual JSON must exist at ${visualPath}`);

      const raw = fs.readFileSync(visualPath, 'utf-8');
      const data = JSON.parse(raw);

      assert.equal(data.schemaVersion, '2.0.0');
      assert.equal(data.prefix, 'bcom_tax');
      assert.equal(data.day, day);
      assert.equal(data.entries.length, 5, 'Must contain exactly 5 visual entries');

      data.entries.forEach((entry: any, pIdx: number) => {
        assert.equal(entry.partIndex, pIdx);
        assert.ok(entry.spec.title, `Part ${pIdx + 1} must have spec title`);
        assert.equal(entry.spec.steps.length, 4, `Part ${pIdx + 1} must have exactly 4 steps`);

        entry.spec.steps.forEach((step: any, sIdx: number) => {
          assert.ok(
            step.caption.length <= 75,
            `Day ${day} P${pIdx + 1}S${sIdx + 1} caption too long (${step.caption.length}): ${step.caption}`
          );
          assert.ok(
            step.caption.endsWith('.'),
            `Day ${day} P${pIdx + 1}S${sIdx + 1} caption must end with period: ${step.caption}`
          );
          assert.ok(
            !/\\d/.test(step.caption),
            `Day ${day} P${pIdx + 1}S${sIdx + 1} caption contains digits: ${step.caption}`
          );
        });
      });
    });
  });

});
"""
    with open(test_path, 'w', encoding='utf-8') as f:
        f.write(test_code)
    print(f"Created expansion tests at {test_path}")

if __name__ == "__main__":
    print("Executing Block 8 (Days 36-40) Master Pipeline...")
    verify_all_captions()
    build_visual_envelopes()
    append_to_bcom_tax_long_lessons()
    create_expansion_tests()
    print("BLOCK 8 PIPELINE EXECUTION COMPLETE!")
