"""
run_tax_days41_45_pipeline.py
Pipeline to generate visual envelopes, append Days 41-45 to bcomTaxLongLessons.ts,
and create the test suite.
"""

import json
import os
import re
import sys
from create_day41_tax import get_day41_data
from create_day42_tax import get_day42_data
from create_day43_tax import get_day43_data
from create_day44_tax import get_day44_data
from create_day45_tax import get_day45_data

WORKSPACE_ROOT = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
VISUALS_DIR = os.path.join(WORKSPACE_ROOT, "src", "lib", "data", "lessonVisuals", "bcom_tax")
LESSONS_FILE = os.path.join(WORKSPACE_ROOT, "src", "lib", "data", "bcomTaxLongLessons.ts")
TESTS_FILE = os.path.join(WORKSPACE_ROOT, "tests", "bcom_tax_days41_45_expansion.test.ts")

os.makedirs(VISUALS_DIR, exist_ok=True)

def generate_visual_envelopes():
    visuals_data = {
        41: [
            {
                "title": "Customs Boundary & Taxable Event",
                "steps": [
                    {"label": "Territorial Waters", "caption": "Vessel crosses the maritime boundary into national territorial waters."},
                    {"label": "Customs Boundary", "caption": "Customs jurisdiction attaches under the statutory charging provision."},
                    {"label": "Continuous Process", "caption": "Importation continues until goods cross the physical customs barrier."},
                    {"label": "Tariff Date Lock", "caption": "Tariff rates lock on the presentation date of bill of entry."}
                ]
            },
            {
                "title": "Import Clearance Lifecycle",
                "steps": [
                    {"label": "Arrival Manifest", "caption": "Master delivers the electronic cargo manifest prior to vessel arrival."},
                    {"label": "Entry Inwards", "caption": "Proper customs officer reviews records and grants entry inwards order."},
                    {"label": "Bill of Entry", "caption": "Importer files white bill of entry for immediate home consumption."},
                    {"label": "Out of Charge", "caption": "Inspector completes examination and issues the out of charge release."}
                ]
            },
            {
                "title": "High Seas Sales Contract Mechanics",
                "steps": [
                    {"label": "Title Endorsement", "caption": "Consignee endorses negotiable bill of lading while goods are on high seas."},
                    {"label": "Contract Transfer", "caption": "Contract transfers title to buyer prior to customs port clearance."},
                    {"label": "Schedule Three Scope", "caption": "Transaction qualifies as statutory non-supply exempt from sales tax."},
                    {"label": "Customs Assessment", "caption": "Customs assessment calculates duties on the final contract price."}
                ]
            },
            {
                "title": "Export Clearance & Let Export Order",
                "steps": [
                    {"label": "Trade Code Setup", "caption": "Exporter registers verified trade identification code on customs portal."},
                    {"label": "Entry Outwards", "caption": "Master secures entry outwards authorization before embarking cargo."},
                    {"label": "Inspection Review", "caption": "Officer inspects goods and verifies mandatory non-prohibition checks."},
                    {"label": "Let Export Order", "caption": "Proper officer issues let export order allowing loading onto vessel."}
                ]
            },
            {
                "title": "Deterministic Customs Assessment Engine",
                "steps": [
                    {"label": "Currency Conversion", "caption": "Simulator converts foreign invoice currency at notified exchange rates."},
                    {"label": "Basic Customs Duty", "caption": "Engine computes basic customs duty on the statutory assessable base."},
                    {"label": "Social Welfare Fee", "caption": "Surcharge attaches at ten percent on the primary basic customs duty."},
                    {"label": "Integrated Tax Base", "caption": "Integrated tax applies on cumulative sum of assessable base and duties."}
                ]
            }
        ],
        42: [
            {
                "title": "Harmonized System Coding Architecture",
                "steps": [
                    {"label": "Chapter Code", "caption": "First two digits identify commodity chapter within tariff schedule."},
                    {"label": "Heading Code", "caption": "Four digits designate specific heading description under convention."},
                    {"label": "Subheading Level", "caption": "Six digits establish international standard harmonized commodity code."},
                    {"label": "National Tariff Line", "caption": "Eight digits establish national statutory tariff item and duties."}
                ]
            },
            {
                "title": "General Rules of Interpretation",
                "steps": [
                    {"label": "Primary Rule", "caption": "Terms of headings and chapter notes govern primary classification."},
                    {"label": "Unassembled Articles", "caption": "Unassembled knocked down kits classify under the finished article."},
                    {"label": "Essential Character", "caption": "Composite goods classify by component providing essential character."},
                    {"label": "Numerical Order", "caption": "Tie breaker assigns heading occurring last in numerical order."}
                ]
            },
            {
                "title": "Transaction Valuation & Mandatory Additions",
                "steps": [
                    {"label": "Commercial Invoice", "caption": "Transaction value serves as statutory basis where parties are unrelated."},
                    {"label": "Production Assists", "caption": "Engineering and design services performed overseas must be added."},
                    {"label": "Transport Ceiling", "caption": "Air freight additions are strictly capped at twenty percent of value."},
                    {"label": "Insurance Provision", "caption": "Unstated marine insurance defaults to statutory percentage factor."}
                ]
            },
            {
                "title": "Alternative Valuation Sequential Rules",
                "steps": [
                    {"label": "Identical Goods", "caption": "Appraising officer matches transaction value of identical goods first."},
                    {"label": "Similar Goods", "caption": "Similar merchandise with equivalent functional characteristics applies."},
                    {"label": "Deductive Method", "caption": "Domestic resale price is adjusted backward by deducting local costs."},
                    {"label": "Computed Value", "caption": "Production fabrication and foreign manufacturer profit are aggregated."}
                ]
            },
            {
                "title": "Algorithmic Classification Engine",
                "steps": [
                    {"label": "Heading Matching", "caption": "Algorithmic decision tree checks headings and statutory exclusions."},
                    {"label": "Character Score", "caption": "System calculates component weight and functional utility scores."},
                    {"label": "Statutory Duty Total", "caption": "Engine computes basic duty and surcharge with rounding safeguards."},
                    {"label": "Audit Exhibit", "caption": "Platform generates forensic valuation exhibits for customs review."}
                ]
            }
        ],
        43: [
            {
                "title": "Statutory Exemption Framework",
                "steps": [
                    {"label": "Exemption Power", "caption": "Central government issues statutory notifications in public interest."},
                    {"label": "Strict Construction", "caption": "Constitutional bench rules ambiguity resolves in favor of revenue."},
                    {"label": "Sunset Clause", "caption": "Conditional customs exemptions expire after two financial years."},
                    {"label": "End Use Monitoring", "caption": "Concessional rate rules require digital bonds and consumption logs."}
                ]
            },
            {
                "title": "Pilferage, Abatement & Remission",
                "steps": [
                    {"label": "Pilferage Relief", "caption": "Importer bears no liability for goods pilfered before clearance."},
                    {"label": "Custodian Liability", "caption": "Terminal custodian assumes statutory liability for pilfered cargo."},
                    {"label": "Proportional Abatement", "caption": "Damaged goods duty is abated in direct ratio to diminution in value."},
                    {"label": "Duty Remission", "caption": "Accrued customs duty is fully remitted upon accidental destruction."}
                ]
            },
            {
                "title": "Bonded Manufacturing Under MOOWR",
                "steps": [
                    {"label": "Facility Licensing", "caption": "Manufacturing unit receives bonded warehouse license under statute."},
                    {"label": "Capital Deferment", "caption": "Customs duties on imported machinery are deferred indefinitely."},
                    {"label": "Export Duty Waiver", "caption": "Raw material customs duties are completely waived upon final export."},
                    {"label": "Domestic Clearance", "caption": "Domestic clearances pay duty solely on consumed raw material fraction."}
                ]
            },
            {
                "title": "Duty Drawback Channels",
                "steps": [
                    {"label": "Unused Re-Exports", "caption": "Ninety-eight percent of customs duty is refunded on unused goods."},
                    {"label": "Used Goods Scale", "caption": "Sliding scale reduces drawback based on duration of domestic use."},
                    {"label": "Industry Rates", "caption": "All industry rates provide standardized average drawback percentages."},
                    {"label": "Market Value Cap", "caption": "Drawback is denied if claimed amount exceeds domestic market value."}
                ]
            },
            {
                "title": "Bonded Inventory Optimization Engine",
                "steps": [
                    {"label": "Abatement Formula", "caption": "Engine computes proportional duty abatement for damaged consignments."},
                    {"label": "Bonded Lot Tracking", "caption": "Software tracks capital assets and raw material inventory batches."},
                    {"label": "Drawback Optimizer", "caption": "System evaluates industry rates against brand rate cost records."},
                    {"label": "Statutory Ledger", "caption": "Automated engine generates compliance registers for customs audit."}
                ]
            }
        ],
        44: [
            {
                "title": "Foreign Trade Policy Architecture",
                "steps": [
                    {"label": "Statutory Authority", "caption": "Commerce ministry formulates foreign trade policy under trade statute."},
                    {"label": "Dynamic Policy", "caption": "Policy establishes dynamic framework supporting digital trade."},
                    {"label": "Input Output Norms", "caption": "Standard norms establish allowable duty-free input consumption ratios."},
                    {"label": "Actual User Mandate", "caption": "Imported duty-free raw materials must be consumed in own facility."}
                ]
            },
            {
                "title": "Advance Authorization & Transferable DFIA",
                "steps": [
                    {"label": "Duty Free Entitlement", "caption": "Advance authorization permits duty-free import of physical inputs."},
                    {"label": "Minimum Value Addition", "caption": "Exporter must achieve minimum fifteen percent value addition on inputs."},
                    {"label": "Export Obligation", "caption": "Mandatory export obligation must be fulfilled within eighteen months."},
                    {"label": "Transferable Scrip", "caption": "Duty free import authorization scrip becomes transferable post export."}
                ]
            },
            {
                "title": "Export Promotion Capital Goods Scheme",
                "steps": [
                    {"label": "Zero Duty Capital", "caption": "Manufacturers import production machinery at zero customs duty rate."},
                    {"label": "Specific Obligation", "caption": "Exporter must fulfill export obligation equal to six times duty saved."},
                    {"label": "Block Milestones", "caption": "Half of export obligation must be fulfilled within first four years."},
                    {"label": "Average Maintenance", "caption": "Company must maintain historical average export turnover alongside."}
                ]
            },
            {
                "title": "WTO Compliant Remission Framework",
                "steps": [
                    {"label": "Embedded Tax Rebate", "caption": "Scheme reimburses embedded uncredited taxes incurred on production."},
                    {"label": "Fuel and Power Taxes", "caption": "Rebate covers non-credited fuel excise and electricity duty costs."},
                    {"label": "Electronic Ledger", "caption": "Rebates are credited to electronic customs duty ledger on portal."},
                    {"label": "Scrip Transferability", "caption": "Duty credit scrips are freely transferable in commercial market."}
                ]
            },
            {
                "title": "Export Incentive Monitoring Engine",
                "steps": [
                    {"label": "Value Addition Check", "caption": "Engine validates statutory value addition before approving imports."},
                    {"label": "Obligation Ledger", "caption": "System allocates export turnover to baseline average obligation first."},
                    {"label": "Block Deadline Tracker", "caption": "Automated tracker alerts corporate treasury to milestone deadlines."},
                    {"label": "Redemption Package", "caption": "Engine produces electronic redemption exhibits for license discharge."}
                ]
            }
        ],
        45: [
            {
                "title": "Enterprise Supply Chain Architecture",
                "steps": [
                    {"label": "Global Sourcing Hub", "caption": "Enterprise imports precision components across multimodal trade lanes."},
                    {"label": "Tariff Engineering", "caption": "Supply chain aligns knocked down assemblies with statutory rules."},
                    {"label": "Valuation Defense", "caption": "Special valuation branch dossier substantiates transfer pricing terms."},
                    {"label": "Trusted Trader Tier", "caption": "Accreditation grants green channel clearance and bond fee waivers."}
                ]
            },
            {
                "title": "Multi-Consignment Valuation Audit",
                "steps": [
                    {"label": "Firmware Assist", "caption": "Foreign software development assist is added to assessable value."},
                    {"label": "Air Freight Cap", "caption": "Excess air freight is statutorily capped at twenty percent of value."},
                    {"label": "High Seas Contract", "caption": "Consignment is assessed on final contract price without sales tax."},
                    {"label": "Cumulative Duties", "caption": "Engine aggregates basic duty and trade remedies before integrated tax."}
                ]
            },
            {
                "title": "Bonded Manufacturing Facility Ledger",
                "steps": [
                    {"label": "Perpetual Deferment", "caption": "Machinery duties remain deferred throughout factory operating life."},
                    {"label": "Export Duty Waiver", "caption": "Sixty percent of production exported receives complete duty waiver."},
                    {"label": "Domestic Tax Base", "caption": "Domestic clearances pay customs duty solely on raw material content."},
                    {"label": "Industrial Scrap", "caption": "Scrap metal clearances pay duty at lower waste tariff rates."}
                ]
            },
            {
                "title": "Export Incentive Portfolio Audit",
                "steps": [
                    {"label": "Capital Scheme Audit", "caption": "Export realization exceeds block milestone over baseline average."},
                    {"label": "Advance Scheme Check", "caption": "Thirty percent value addition comfortably surpasses statutory rule."},
                    {"label": "Bank Certificate Match", "caption": "Electronic realization certificates match shipping bill declarations."},
                    {"label": "Collateral Release", "caption": "Discharge certificates trigger full cancellation of customs bonds."}
                ]
            },
            {
                "title": "Enterprise Customs Command Tower",
                "steps": [
                    {"label": "Integrated Pipeline", "caption": "Command tower integrates valuation and classification and incentives."},
                    {"label": "Bonded Optimization", "caption": "System models working capital savings and perpetual duty deferral."},
                    {"label": "Treasury Dashboard", "caption": "Dashboard provides executive visibility over customs duty exposure."},
                    {"label": "Master Certification", "caption": "Simulation concludes with enterprise customs bonded master pass."}
                ]
            }
        ]
    }

    print("Generating visual envelopes...")
    for day, entries in visuals_data.items():
        envelope = {
            "schemaVersion": "2.0.0",
            "prefix": "bcom_tax",
            "day": day,
            "entries": []
        }
        for idx, entry in enumerate(entries):
            # Validate each step caption
            for s_idx, s in enumerate(entry["steps"]):
                caption = s["caption"]
                assert len(caption) <= 75, f"Day {day} P{idx+1}S{s_idx+1} caption too long ({len(caption)}): {caption}"
                assert caption.endswith("."), f"Day {day} P{idx+1}S{s_idx+1} caption must end with '.': {caption}"
                assert not re.search(r"\d", caption), f"Day {day} P{idx+1}S{s_idx+1} caption contains digits: {caption}"

            envelope["entries"].append({
                "partIndex": idx,
                "spec": {
                    "title": entry["title"],
                    "steps": entry["steps"]
                }
            })

        v_path = os.path.join(VISUALS_DIR, f"day-{day}.json")
        with open(v_path, "w", encoding="utf-8") as f:
            json.dump(envelope, f, indent=2)
        print(f"  Wrote {v_path}")

def append_days_to_lessons():
    print("Gathering day objects...")
    days = [
        get_day41_data(),
        get_day42_data(),
        get_day43_data(),
        get_day44_data(),
        get_day45_data()
    ]

    with open(LESSONS_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    # Check if Day 41 is already in file
    if "day: 41," in content:
        print("Day 41 already in bcomTaxLongLessons.ts, skipping append.")
        return

    # Find the closing ]; at the end of the array
    # bcomTaxLongLessons.ts ends with:
    #     }
    #     ]
    #   }
    # ];

    # We need to find the last occurrence of `];`
    idx = content.rfind("];")
    if idx == -1:
        raise ValueError("Could not find closing '];' in bcomTaxLongLessons.ts")

    prefix = content[:idx].rstrip()
    if not prefix.endswith(","):
        prefix += ","

    # Format the 5 days into TS objects
    days_ts = []
    for d in days:
        day_str = json.dumps(d, indent=2)
        # Convert JSON string to clean TS format
        # replace "day": with day:, "coursePrefix": with coursePrefix:, etc.
        # json is valid TS object!
        days_ts.append("  " + day_str.replace("\n", "\n  "))

    all_days_str = "\n" + ",\n".join(days_ts) + "\n];\n"

    new_content = prefix + all_days_str
    with open(LESSONS_FILE, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Successfully appended Days 41-45 to bcomTaxLongLessons.ts")

def create_tests_file():
    test_code = """import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BCOM_TAX_LONG_LESSONS } from '../src/lib/data/bcomTaxLongLessons';
import fs from 'node:fs';
import path from 'node:path';

describe('B.Com Corporate Tax Month 2 (Days 41-45) Expansion Suite', () => {

  it('Day 41: Structural integrity, word counts, and pedagogical invariants', () => {
    const day = BCOM_TAX_LONG_LESSONS.find((l) => l.day === 41);
    assert.ok(day, 'Day 41 must be present in BCOM_TAX_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom_tax');
    assert.equal(day.minutes, 38);
    assert.equal(day.parts.length, 5, 'Day 41 must have exactly 5 parts');

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
      `Day 41 total word count (${totalWords}) must be >= 3,000 words`
    );
  });

  it('Day 42: Structural integrity, word counts, and pedagogical invariants', () => {
    const day = BCOM_TAX_LONG_LESSONS.find((l) => l.day === 42);
    assert.ok(day, 'Day 42 must be present in BCOM_TAX_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom_tax');
    assert.equal(day.minutes, 38);
    assert.equal(day.parts.length, 5, 'Day 42 must have exactly 5 parts');

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
      `Day 42 total word count (${totalWords}) must be >= 3,000 words`
    );
  });

  it('Day 43: Structural integrity, word counts, and pedagogical invariants', () => {
    const day = BCOM_TAX_LONG_LESSONS.find((l) => l.day === 43);
    assert.ok(day, 'Day 43 must be present in BCOM_TAX_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom_tax');
    assert.equal(day.minutes, 38);
    assert.equal(day.parts.length, 5, 'Day 43 must have exactly 5 parts');

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
      `Day 43 total word count (${totalWords}) must be >= 3,000 words`
    );
  });

  it('Day 44: Structural integrity, word counts, and pedagogical invariants', () => {
    const day = BCOM_TAX_LONG_LESSONS.find((l) => l.day === 44);
    assert.ok(day, 'Day 44 must be present in BCOM_TAX_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom_tax');
    assert.equal(day.minutes, 38);
    assert.equal(day.parts.length, 5, 'Day 44 must have exactly 5 parts');

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
      `Day 44 total word count (${totalWords}) must be >= 3,000 words`
    );
  });

  it('Day 45: Structural integrity, word counts, and pedagogical invariants', () => {
    const day = BCOM_TAX_LONG_LESSONS.find((l) => l.day === 45);
    assert.ok(day, 'Day 45 must be present in BCOM_TAX_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom_tax');
    assert.equal(day.minutes, 38);
    assert.equal(day.parts.length, 5, 'Day 45 must have exactly 5 parts');

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
      `Day 45 total word count (${totalWords}) must be >= 3,000 words`
    );
  });

  // Visual Envelope Tests (Gate v2)
  [41, 42, 43, 44, 45].forEach((day) => {
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
    with open(TESTS_FILE, "w", encoding="utf-8") as f:
        f.write(test_code)
    print(f"Wrote test suite to {TESTS_FILE}")

if __name__ == "__main__":
    generate_visual_envelopes()
    append_days_to_lessons()
    create_tests_file()
    print("Pipeline executed successfully!")
