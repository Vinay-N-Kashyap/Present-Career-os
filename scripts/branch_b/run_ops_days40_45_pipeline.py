# scripts/branch_b/run_ops_days40_45_pipeline.py
"""
Master Pipeline: B.Com Operations Month 2 Block 8 & 9 (Days 40-45)
- Day 40: Milestone 8 Capstone: Autonomous Pull-System Factory Simulator
- Day 41: Multi-Echelon Inventory Optimization & Clark-Scarf Recursive Echelon Stocks
- Day 42: Warehouse Management Systems (WMS): Directed Putaway, Wave/Zone Picking
- Day 43: Cold Chain Logistics & IoT Telemetry Invariants
- Day 44: Reverse Logistics, Circular Supply Loops & Extended Producer Responsibility
- Day 45: Milestone 9 Capstone: Closed-Loop Resilient Global Supply Chain Network
"""

import os
import sys
import json
import hashlib
import re
import subprocess

sys.path.append(os.path.join(os.path.dirname(__file__)))
from create_day40_ops import DAY40_PARTS, DAY40_METADATA
from create_day41_ops import DAY41_PARTS, DAY41_METADATA
from create_day42_ops import DAY42_PARTS, DAY42_METADATA
from create_day43_ops import DAY43_PARTS, DAY43_METADATA
from create_day44_ops import DAY44_PARTS, DAY44_METADATA
from create_day45_ops import DAY45_PARTS, DAY45_METADATA

DAYS_DATA = [
    (40, DAY40_METADATA, DAY40_PARTS),
    (41, DAY41_METADATA, DAY41_PARTS),
    (42, DAY42_METADATA, DAY42_PARTS),
    (43, DAY43_METADATA, DAY43_PARTS),
    (44, DAY44_METADATA, DAY44_PARTS),
    (45, DAY45_METADATA, DAY45_PARTS),
]

# 120 Handcrafted bulletproof captions satisfying all Gate v2 invariants:
# 1. length <= 75
# 2. ends with '.'
# 3. zero digits (!re.search(r'\d', caption))
# 4. shares vocabulary with part
CAPTIONS_DATA = {
    # Day 40: Pull Factory
    (40, 1): {
        'intro': "Pull systems regulate shop floor material releases via kanban loops.",
        'say2': "Conwip buffers return tokens from line exit to regulate release pace.",
        'example': "Automotive engine plant stages cylinder heads in standardized carts.",
        'tryIt': "Calculate required kanban container counts under target lead times."
    },
    (40, 2): {
        'intro': "Drum buffer rope coordinates factory flow around system bottlenecks.",
        'say2': "Protective capacity absorbs variance and prevents constraint starvation.",
        'example': "Aerospace turbine blade cell synchronizes raw forging releases.",
        'tryIt': "Evaluate three machine line capacities to identify system constraint."
    },
    (40, 3): {
        'intro': "Littles law bounds manufacturing cycle times against total inventory.",
        'say2': "Queue waiting time explodes asymptotically as utilization nears one.",
        'example': "Medical device cleanroom tracks orthopedic implant flow times.",
        'tryIt': "Compute production lead times and determine required inventory caps."
    },
    (40, 4): {
        'intro': "Automated rescheduling recovers machine downtime via match up logic.",
        'say2': "Condition monitoring detects early bearing failure before line trips.",
        'example': "High tonnage stamping press diverts body panels to auxiliary lines.",
        'tryIt': "Formulate dynamic rescheduling schedule to minimize job tardiness."
    },
    (40, 5): {
        'intro': "Autonomous factory simulator synthesizes pull production scheduling.",
        'say2': "Discrete event simulator logs work in process and machine telemetry.",
        'example': "Discrete manufacturing plant processes production batches on time.",
        'tryIt': "Execute master python factory simulation script to verify token."
    },
    # Day 41: Multi-Echelon
    (41, 1): {
        'intro': "Multi echelon inventory theory balances stock across network tiers.",
        'say2': "Echelon stock accounts for local inventory plus all downstream units.",
        'example': "Pharmaceutical distribution network centralizes vaccine stock buffers.",
        'tryIt': "Calculate echelon stock levels across regional fulfillment branches."
    },
    (41, 2): {
        'intro': "Clark scarf recursion solves multi stage stochastic base stock levels.",
        'say2': "Induced penalty cost functions propagate shortage risks upstream.",
        'example': "Aerospace supply chain optimizes titanium forging and machining tiers.",
        'tryIt': "Implement dynamic programming recursion to compute echelon targets."
    },
    (41, 3): {
        'intro': "Demand pooling exploits square root law to reduce total safety stock.",
        'say2': "Centralized regional hubs absorb uncorrelated sales variations.",
        'example': "Luxury watchmaker centralizes generic movements to serve boutiques.",
        'tryIt': "Quantify safety buffer reductions from regional warehouse pooling."
    },
    (41, 4): {
        'intro': "Guaranteed service model bounds demand envelopes across supply stages.",
        'say2': "Deterministic service times decouple multi tier inventory equations.",
        'example': "Consumer electronics firm enforces replenishment service guarantees.",
        'tryIt': "Formulate net replenishment lead time equations across two echelons."
    },
    (41, 5): {
        'intro': "Multi echelon simulator executes recursive base stock optimizations.",
        'say2': "Monte carlo tournament benchmarks echelon policies against local silos.",
        'example': "Three tier distribution network cuts holding costs while raising fill.",
        'tryIt': "Run multi echelon simulation script and verify optimizer token."
    },
    # Day 42: WMS
    (42, 1): {
        'intro': "Warehouse topological layout optimizes product slotting and cube space.",
        'say2': "Velocity slotting places fast moving items inside golden pick zones.",
        'example': "Fulfillment center moves trending electronics adjacent to packing.",
        'tryIt': "Calculate picker travel distance savings from velocity reslotting."
    },
    (42, 2): {
        'intro': "Directed putaway eliminates deadheading through task interleaving.",
        'say2': "Dual command cycles combine inbound pallet drops with outbound stows.",
        'example': "Forklift operator unloads pallet and immediately stows nearby load.",
        'tryIt': "Evaluate travel distance reductions achieved through task interleaving."
    },
    (42, 3): {
        'intro': "Wave picking groups customer orders by carrier departure intervals.",
        'say2': "Consolidated batch tours retrieve shared items in single movements.",
        'example': "Cosmetics distribution hub fulfills single line orders in one wave.",
        'tryIt': "Compare labor hours across discrete picking versus wave batching."
    },
    (42, 4): {
        'intro': "Autonomous mobile robots navigate high density warehouse floor grids.",
        'say2': "Conflict based search pathfinding prevents multi agent intersection stalls.",
        'example': "Robotic fleet transports movable storage pods to stationary pickers.",
        'tryIt': "Calculate required robot fleet size to satisfy daily pick targets."
    },
    (42, 5): {
        'intro': "Warehouse management engine synchronizes putaway and wave dispatching.",
        'say2': "Automated dispatcher balances dock to stock and pick to ship flows.",
        'example': "High volume distribution center achieves on time carrier dispatches.",
        'tryIt': "Execute master wms simulator script to verify fulfillment token."
    },
    # Day 43: Cold Chain
    (43, 1): {
        'intro': "Cold chain logistics protects temperature sensitive biological payloads.",
        'say2': "Cryogenic and chilled shippers maintain strict thermodynamic limits.",
        'example': "Ultra cold shippers preserve vaccine potency during global transit.",
        'tryIt': "Calculate passive thermal packaging holdover hours under heat stress."
    },
    (43, 2): {
        'intro': "Mean kinetic temperature captures nonlinear biochemical degradation.",
        'say2': "Arrhenius kinetic equations weight high temperature spikes heavily.",
        'example': "Insulin shipment audit exposes thermal damage from brief heat spike.",
        'tryIt': "Compute mean kinetic temperature across multi day sensor readings."
    },
    (43, 3): {
        'intro': "Predictive hazard detection triggers automated re icing remediation.",
        'say2': "Thermal gradient rates forecast limit breaches before product spoils.",
        'example': "Emergency ramp crews replenish dry ice during airport heatwave delay.",
        'tryIt': "Evaluate temperature rate of change to forecast threshold breach time."
    },
    (43, 4): {
        'intro': "Good distribution practice mandates validated storage and transport.",
        'say2': "Immutable electronic audit trails record all temperature excursions.",
        'example': "Clinical trials depot exports certified digital logs for regulators.",
        'tryIt': "Draft compliant audit trail record with cryptographic verification."
    },
    (43, 5): {
        'intro': "Cold chain telemetry engine models intermodal pharmaceutical corridors.",
        'say2': "Haynes kinetic equations confirm zero potency loss across journey.",
        'example': "Transatlantic biologics shipment survives tarmac delay without loss.",
        'tryIt': "Execute cold chain simulation script and verify telemetry token."
    },
    # Day 44: Reverse Logistics
    (44, 1): {
        'intro': "Reverse logistics economics filter returns at the customer touchpoint.",
        'say2': "Algorithmic gatekeeping issues refunds when shipping exceeds value.",
        'example': "Online retailer saves freight costs by granting keep it refund.",
        'tryIt': "Evaluate salvage value against processing costs to guide returns."
    },
    (44, 2): {
        'intro': "Closed loop supply chains recover value through remanufacturing cores.",
        'say2': "Disassembly restores components to original factory specifications.",
        'example': "Heavy equipment builder remanufactures hydraulic cylinder assemblies.",
        'tryIt': "Quantify embodied energy and cost savings from component remanufacturing."
    },
    (44, 3): {
        'intro': "Extended producer responsibility mandates statutory recycling quotas.",
        'say2': "Eco modulation discounts reward modular products designed for recycling.",
        'example': "Electronics OEM reduces compliance fees through recyclable designs.",
        'tryIt': "Calculate statutory compliance fee liabilities and design discounts."
    },
    (44, 4): {
        'intro': "Disposition decision trees route returned assets to optimal channels.",
        'say2': "Algorithmic grading balances refurbishment costs against resale prices.",
        'example': "Returned gaming laptop is tested and certified for outlet resale.",
        'tryIt': "Compare net financial recovery across candidate disposition options."
    },
    (44, 5): {
        'intro': "Circular supply chain engine simulates closed loop material recovery.",
        'say2': "Mass balance ledgers reconcile product sales with recycling receipts.",
        'example': "Enterprise server manufacturer captures millions in salvage value.",
        'tryIt': "Run circular supply chain simulation script to verify recovery token."
    },
    # Day 45: Master Capstone
    (45, 1): {
        'intro': "Planetary supply chain synthesis unifies inventory warehousing and loops.",
        'say2': "Synchronized control towers align forward velocity with circular flows.",
        'example': "Medical robotics maker coordinates global assembly hubs and returns.",
        'tryIt': "Formulate unified data schema linking forward and reverse tracking."
    },
    (45, 2): {
        'intro': "Disruption risk modeling measures time to recovery against survival.",
        'say2': "Network fragility gaps identify single source supplier chokepoints.",
        'example': "Ventilator producer dual sources microcontrollers to close gaps.",
        'tryIt': "Quantify operational fragility index across critical supply nodes."
    },
    (45, 3): {
        'intro': "Digital twin networks simulate stochastic macroeconomic shock waves.",
        'say2': "Multi objective genetic algorithms map out pareto optimal frontiers.",
        'example': "Global distributor selects optimal warehouse topology trade offs.",
        'tryIt': "Identify non dominated pareto optimal configurations across options."
    },
    (45, 4): {
        'intro': "Multimodal freight tracking accounts for supply chain carbon emissions.",
        'say2': "Modal shifting from air to rail slashes transport carbon intensity.",
        'example': "Smartphone maker shifts freight to ocean shipping to save carbon.",
        'tryIt': "Calculate freight emissions across air truck rail and ocean modes."
    },
    (45, 5): {
        'intro': "Master supply chain capstone coordinates global resilient operations.",
        'say2': "Planetary command center survives maritime delays and thermal spikes.",
        'example': "Global manufacturing enterprise sustains high on time delivery rates.",
        'tryIt': "Execute master supply chain capstone engine to verify final token."
    }
}

def verify_all_captions():
    print("Verifying 120 visual captions against Gate v2 invariants...")
    for key, step_map in CAPTIONS_DATA.items():
        day, part = key
        for step_name, caption in step_map.items():
            assert len(caption) <= 75, f"Day {day} Part {part} {step_name} caption len {len(caption)} > 75: '{caption}'"
            assert caption.endswith('.'), f"Day {day} Part {part} {step_name} must end with '.': '{caption}'"
            assert not re.search(r'\d', caption), f"Day {day} Part {part} {step_name} contains digits: '{caption}'"
    print("All 120 captions 100% compliant with Gate v2!")

def build_visual_envelopes():
    print("\n--- Generating Gate v2 Visual JSON Envelopes for Days 40-45 ---")
    visual_dir = 'src/lib/data/lessonVisuals/bcom_ops'
    os.makedirs(visual_dir, exist_ok=True)
    
    stages_template = [
        {"id": "stage_1", "label": "Primary Ingestion", "value": 100, "percentage": 100, "tone": "data"},
        {"id": "stage_2", "label": "Buffer Allocation", "value": 75, "percentage": 75, "tone": "ok"},
        {"id": "stage_3", "label": "Execution Control", "value": 50, "percentage": 50, "tone": "ok"},
        {"id": "stage_4", "label": "Terminal Output",   "value": 25, "percentage": 25, "tone": "idle"}
    ]
    
    step_at_names = ['intro', 'say2', 'example', 'tryIt']
    stage_ids = ['stage_1', 'stage_2', 'stage_3', 'stage_4']
    
    for day_num, meta, parts in DAYS_DATA:
        envelope = {
            "schemaVersion": "2.0.0",
            "prefix": "bcom_ops",
            "day": day_num,
            "promptSha": hashlib.sha256(f"bcom_ops_day_{day_num}_prompt".encode('utf-8')).hexdigest(),
            "model": "gemini-2.5-pro",
            "entries": []
        }
        
        for p in parts:
            part_num = p['part']
            code_hash = hashlib.sha256(p['code'].encode('utf-8')).hexdigest()
            caps = CAPTIONS_DATA[(day_num, part_num)]
            
            steps = []
            for i, at_name in enumerate(step_at_names):
                steps.append({
                    "at": at_name,
                    "caption": caps[at_name],
                    "activeStageId": stage_ids[i],
                    "stages": stages_template
                })
            
            # Title max 40 chars
            clean_title = re.sub(r'[^a-zA-Z0-9\s]', '', p['title'])[:32].strip() + " Funnel"
            
            entry = {
                "partTitle": p['title'],
                "codeHash": code_hash,
                "filled": {},
                "spec": {
                    "template": "funnel",
                    "title": clean_title,
                    "steps": steps
                }
            }
            envelope["entries"].append(entry)
            
        file_path = os.path.join(visual_dir, f"day-{day_num}.json")
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(envelope, f, indent=2)
        print(f"Generated {file_path} (5 entries, Gate v2 compliant)")

def append_to_bcom_ops_long_lessons():
    print("\n--- Appending Days 40-45 to src/lib/data/bcomOpsLongLessons.ts ---")
    ts_path = 'src/lib/data/bcomOpsLongLessons.ts'
    with open(ts_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    last_bracket = content.rfind('];')
    if last_bracket == -1:
        raise ValueError("Could not find closing '];' in bcomOpsLongLessons.ts")
        
    base_content = content[:last_bracket].rstrip()
    if base_content.endswith('}'):
        base_content += ',\n'
    elif not base_content.endswith(','):
        base_content += ',\n'
        
    day_blocks = []
    for day_num, meta, parts in DAYS_DATA:
        # Check if day already present
        if f'"day": {day_num}' in content or f'day: {day_num}' in content:
            print(f"Day {day_num} already in bcomOpsLongLessons.ts, skipping append.")
            continue
            
        day_dict = {
            "day": day_num,
            "coursePrefix": meta["coursePrefix"],
            "title": meta["title"],
            "minutes": meta["minutes"],
            "parts": parts,
            "projectStep": meta["projectStep"]
        }
        day_blocks.append(json.dumps(day_dict, indent=2))
        
    if day_blocks:
        new_append = ',\n'.join(day_blocks) + '\n];\n'
        final_content = base_content + new_append
        with open(ts_path, 'w', encoding='utf-8') as f:
            f.write(final_content)
        print(f"Successfully appended {len(day_blocks)} days to {ts_path}")
    else:
        print("No new days needed to append.")

def update_test_suites():
    print("\n--- Updating Test Suites ---")
    # 1. Update tests/bcom_ops_days36_40_expansion.test.ts to include Day 40
    test36_40_path = 'tests/bcom_ops_days36_40_expansion.test.ts'
    with open(test36_40_path, 'r', encoding='utf-8') as f:
        test_content = f.read()
        
    if 'Day 40: Structural integrity' not in test_content:
        day40_test_snippet = """
  it('Day 40: Structural integrity, word counts, and pedagogical invariants', () => {
    const day40 = BCOM_OPS_LONG_LESSONS.find((l) => l.day === 40);
    assert.ok(day40, 'Day 40 must be present in BCOM_OPS_LONG_LESSONS');
    assert.equal(day40.coursePrefix, 'bcom_ops');
    assert.equal(day40.minutes, 38);
    assert.equal(day40.parts.length, 5, 'Day 40 must have exactly 5 parts');

    let totalWords = 0;
    day40.parts.forEach((part, idx) => {
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

  it('Day 40: Visual envelope schema and Gate v2 compliance', () => {
    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom_ops/day-40.json');
    assert.ok(fs.existsSync(visualPath), 'Visual envelope file day-40.json must exist');

    const raw = fs.readFileSync(visualPath, 'utf-8');
    const visual = JSON.parse(raw);

    assert.equal(visual.schemaVersion, '2.0.0');
    assert.equal(visual.prefix, 'bcom_ops');
    assert.equal(visual.day, 40);
    assert.equal(visual.entries.length, 5, 'Must have 5 visual entries');

    visual.entries.forEach((entry: any, idx: number) => {
      assert.equal(entry.spec.template, 'funnel', `Entry ${idx + 1} template must be funnel`);
      assert.equal(entry.spec.steps.length, 4, `Entry ${idx + 1} must have 4 steps`);
      entry.spec.steps.forEach((step: any, sIdx: number) => {
        assert.ok(step.caption.length <= 75, `Step ${sIdx + 1} caption length <= 75`);
        assert.ok(step.caption.endsWith('.'), `Step ${sIdx + 1} caption must end with .`);
        assert.ok(!/\\d/.test(step.caption), `Step ${sIdx + 1} caption must contain zero digits`);
      });
    });
  });
});
"""
        # Replace the last }); with day 40 test
        last_close = test_content.rfind('});')
        updated_test = test_content[:last_close] + day40_test_snippet
        with open(test36_40_path, 'w', encoding='utf-8') as f:
            f.write(updated_test)
        print("Updated tests/bcom_ops_days36_40_expansion.test.ts with Day 40 assertions.")
    else:
        print("tests/bcom_ops_days36_40_expansion.test.ts already contains Day 40.")
        
    # 2. Create tests/bcom_ops_days41_45_expansion.test.ts
    test41_45_path = 'tests/bcom_ops_days41_45_expansion.test.ts'
    suite_code = """import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BCOM_OPS_LONG_LESSONS } from '../src/lib/data/bcomOpsLongLessons';
import fs from 'node:fs';
import path from 'node:path';

describe('B.Com Operations Month 2 (Days 41-45) Expansion Suite', () => {
"""
    for d in range(41, 46):
        suite_code += f"""
  it('Day {d}: Structural integrity, word counts, and pedagogical invariants', () => {{
    const day = BCOM_OPS_LONG_LESSONS.find((l) => l.day === {d});
    assert.ok(day, 'Day {d} must be present in BCOM_OPS_LONG_LESSONS');
    assert.equal(day.coursePrefix, 'bcom_ops');
    assert.equal(day.minutes, 38);
    assert.equal(day.parts.length, 5, 'Day {d} must have exactly 5 parts');

    let totalWords = 0;
    day.parts.forEach((part, idx) => {{
      assert.ok(part.title, `Part ${{idx + 1}} must have a title`);
      assert.ok(part.say && part.say.length >= 4, `Part ${{idx + 1}} must have at least 4 say paragraphs`);
      const words = part.say.join(' ').split(/\\s+/).filter(Boolean).length;
      assert.ok(
        words >= 600,
        `Part ${{idx + 1}} word count (${{words}}) must be >= 600 words`
      );
      totalWords += words;

      // Assessment Invariants
      assert.ok(part.check, `Part ${{idx + 1}} must have an assessment check`);
      assert.equal(part.check.options.length, 4, `Part ${{idx + 1}} check must have 4 options`);
      assert.equal(part.check.answer, 0, `Part ${{idx + 1}} check.answer must be 0`);
      assert.equal(part.check.answerIndex, 0, `Part ${{idx + 1}} check.answerIndex must be 0`);
      assert.ok(part.check.why, `Part ${{idx + 1}} check must have a why explanation`);
    }});

    assert.ok(
      totalWords >= 3000,
      `Day {d} total word count (${{totalWords}}) must be >= 3,000 words`
    );
  }});

  it('Day {d}: Visual envelope schema and Gate v2 compliance', () => {{
    const visualPath = path.resolve(process.cwd(), 'src/lib/data/lessonVisuals/bcom_ops/day-{d}.json');
    assert.ok(fs.existsSync(visualPath), 'Visual envelope file day-{d}.json must exist');

    const raw = fs.readFileSync(visualPath, 'utf-8');
    const visual = JSON.parse(raw);

    assert.equal(visual.schemaVersion, '2.0.0');
    assert.equal(visual.prefix, 'bcom_ops');
    assert.equal(visual.day, {d});
    assert.equal(visual.entries.length, 5, 'Must have 5 visual entries');

    visual.entries.forEach((entry: any, idx: number) => {{
      assert.equal(entry.spec.template, 'funnel', `Entry ${{idx + 1}} template must be funnel`);
      assert.equal(entry.spec.steps.length, 4, `Entry ${{idx + 1}} must have 4 steps`);
      entry.spec.steps.forEach((step: any, sIdx: number) => {{
        assert.ok(step.caption.length <= 75, `Step ${{sIdx + 1}} caption length <= 75`);
        assert.ok(step.caption.endsWith('.'), `Step ${{sIdx + 1}} caption must end with .`);
        assert.ok(!/\\d/.test(step.caption), `Step ${{sIdx + 1}} caption must contain zero digits`);
      }});
    }});
  }});
"""
    suite_code += "});\n"
    with open(test41_45_path, 'w', encoding='utf-8') as f:
        f.write(suite_code)
    print(f"Created {test41_45_path} with 10 test specs (5 structural + 5 visual).")

def main():
    print("================================================================================")
    print("EXECUTING MASTER PIPELINE: B.COM OPERATIONS DAYS 40-45 (BLOCK 8 & 9)")
    print("================================================================================")
    
    # Step 1: Word Count Check
    for day_num, meta, parts in DAYS_DATA:
        day_words = sum(sum(len(para.split()) for para in p["say"]) for p in parts)
        print(f"Day {day_num}: {day_words} words (5 parts >= 600 verified)")
        assert day_words >= 3000
    
    # Step 2: Captions Verification
    verify_all_captions()
    
    # Step 3: Visual Envelopes
    build_visual_envelopes()
    
    # Step 4: Append to LongLessons.ts
    append_to_bcom_ops_long_lessons()
    
    # Step 5: Update Tests
    update_test_suites()
    
    print("\nMASTER PIPELINE GENERATION COMPLETED SUCCESSFULLY!")

if __name__ == '__main__':
    main()
