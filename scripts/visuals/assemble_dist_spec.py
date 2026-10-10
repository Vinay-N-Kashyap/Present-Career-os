# scripts/visuals/assemble_dist_spec.py
import sys
import json
import os

sys.path.append(os.path.dirname(__file__))

import dist_spec_m1
import dist_spec_m1_rest
import dist_spec_m2_part1
import dist_spec_m2_part2

m1 = dist_spec_m1.DIST_M1_PART1 + dist_spec_m1_rest.DIST_M1_PART2
m2 = dist_spec_m2_part1.DIST_M2_PART1 + dist_spec_m2_part2.DIST_M2_PART2

assert len(m1) == 30, f"M1 length is {len(m1)}"
assert len(m2) == 30, f"M2 length is {len(m2)}"

all_quests = []
for d in m1 + m2:
    day_num = d["day"]
    assert len(d["socraticHints"]) == 3, f"Day {day_num} socraticHints count {len(d['socraticHints'])}"
    assert len(d["situationalPuzzle"]["options"]) == 4, f"Day {day_num} options count {len(d['situationalPuzzle']['options'])}"
    assert len(d["quests"]) == 4, f"Day {day_num} quests count {len(d['quests'])}"
    for q in d["quests"]:
        all_quests.append(q["id"])

assert len(all_quests) == 240, f"Quest count {len(all_quests)}"
assert len(set(all_quests)) == 240, f"Duplicate quest IDs found! Total unique: {len(set(all_quests))}"

header = """// scripts/visuals/distributed-masterclass-spec.ts
// Exhaustive 60-Day Masterclass Specification for High-Scale Distributed System Design (course-distributed-sys)
// Total Quests: 240 Quests (Month 1: 120 Quests, Month 2: 120 Quests)
// Conforming strictly to Gate v2 semantic standard, 3-Tier Socratic Hint Ladders, Consensus Protocols, and High-Scale System Design.

import { MasterclassDaySpec } from './java-masterclass-spec';

"""

m1_json = json.dumps(m1, indent=2)
m2_json = json.dumps(m2, indent=2)

ts_content = f"""{header}export const DISTRIBUTED_MONTH_1_SPECS: MasterclassDaySpec[] = {m1_json};

export const DISTRIBUTED_MONTH_2_SPECS: MasterclassDaySpec[] = {m2_json};
"""

target_file = os.path.join(os.path.dirname(__file__), "distributed-masterclass-spec.ts")
with open(target_file, "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Successfully generated {target_file}")
print(f"M1: {len(m1)} days, {sum(len(d['quests']) for d in m1)} quests")
print(f"M2: {len(m2)} days, {sum(len(d['quests']) for d in m2)} quests")
print(f"Total Quests: {len(all_quests)}")
print(f"File size: {os.path.getsize(target_file):,} bytes")
