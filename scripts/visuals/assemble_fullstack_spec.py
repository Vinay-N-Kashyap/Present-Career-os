# scripts/visuals/assemble_fullstack_spec.py
# Combines fullstack_spec_m1, fullstack_spec_m1_rest, fullstack_spec_m2_part1, and fullstack_spec_m2_part2
# into scripts/visuals/fullstack-masterclass-spec.ts

import json
from fullstack_spec_m1 import FULLSTACK_M1_PART1
from fullstack_spec_m1_rest import FULLSTACK_M1_PART2
from fullstack_spec_m2_part1 import FULLSTACK_M2_PART1
from fullstack_spec_m2_part2 import FULLSTACK_M2_PART2

month1 = FULLSTACK_M1_PART1 + FULLSTACK_M1_PART2
month2 = FULLSTACK_M2_PART1 + FULLSTACK_M2_PART2

print(f"Month 1: {len(month1)} days")
print(f"Month 2: {len(month2)} days")

# Validate day sequence
for i, d in enumerate(month1, 1):
    assert d['day'] == i, f"Month 1 Day mismatch at index {i}: expected {i}, got {d['day']}"
    assert len(d['quests']) == 4, f"Month 1 Day {i} quests count != 4"

for i, d in enumerate(month2, 31):
    assert d['day'] == i, f"Month 2 Day mismatch at index {i}: expected {i}, got {d['day']}"
    assert len(d['quests']) == 4, f"Month 2 Day {i} quests count != 4"

header = """// scripts/visuals/fullstack-masterclass-spec.ts
// Exhaustive 60-Day Masterclass Specification for Full-Stack JavaScript Engineering (course-fullstack-js)
// Total Quests: 240 Quests (Month 1: 120 Quests, Month 2: 120 Quests)
// Conforming strictly to Gate v2 semantic standard, 3-Tier Socratic Hint Ladders, Next.js App Router, tRPC, PostgreSQL RLS, BullMQ, CRDTs, and SRE War Rooms.

import { MasterclassDaySpec } from './java-masterclass-spec';

export const FULLSTACK_MONTH_1_SPECS: MasterclassDaySpec[] = """

body_m1 = json.dumps(month1, indent=2)

divider = """;

export const FULLSTACK_MONTH_2_SPECS: MasterclassDaySpec[] = """

body_m2 = json.dumps(month2, indent=2)

footer = """;
"""

with open("scripts/visuals/fullstack-masterclass-spec.ts", "w", encoding="utf-8") as f:
    f.write(header + body_m1 + divider + body_m2 + footer)

print(f"Successfully assembled scripts/visuals/fullstack-masterclass-spec.ts with {len(month1) + len(month2)} days and {(len(month1) + len(month2)) * 4} quests!")
