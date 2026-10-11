# scripts/visuals/assemble_graphics_spec.py
# Combines graphics_spec_m1, graphics_spec_m1_rest, graphics_spec_m2_part1, and graphics_spec_m2_part2
# into scripts/visuals/graphics-masterclass-spec.ts

import json
import sys
import os

# Add scripts/visuals to sys.path so we can import modules
sys.path.append(os.path.abspath("scripts/visuals"))

from graphics_spec_m1 import GRAPHICS_M1_PART1
from graphics_spec_m1_rest import GRAPHICS_M1_PART2
from graphics_spec_m2_part1 import GRAPHICS_M2_PART1
from graphics_spec_m2_part2 import GRAPHICS_M2_PART2

month1 = GRAPHICS_M1_PART1 + GRAPHICS_M1_PART2
month2 = GRAPHICS_M2_PART1 + GRAPHICS_M2_PART2

print(f"Month 1: {len(month1)} days")
print(f"Month 2: {len(month2)} days")

# Validate day sequence and quest count
for i, d in enumerate(month1, 1):
    assert d['day'] == i, f"Month 1 Day mismatch at index {i}: expected {i}, got {d['day']}"
    assert len(d['quests']) == 4, f"Month 1 Day {i} quests count != 4"

for i, d in enumerate(month2, 31):
    assert d['day'] == i, f"Month 2 Day mismatch at index {i}: expected {i}, got {d['day']}"
    assert len(d['quests']) == 4, f"Month 2 Day {i} quests count != 4"

header = """// scripts/visuals/graphics-masterclass-spec.ts
// Exhaustive 60-Day Masterclass Specification for 3D Interactive Graphics & Avatar Animation (course-3d-graphics)
// Total Quests: 240 Quests (Month 1: 120 Quests, Month 2: 120 Quests)
// Conforming strictly to Gate v2 semantic standard, 3-Tier Socratic Hint Ladders, WebGL 2.0 / WebGPU, Three.js, Cook-Torrance PBR, Dual Quaternion Skinning, VRM 1.0 Avatars, FACS 52 Blendshapes, and Rapier3D Physics.

import { MasterclassDaySpec } from './java-masterclass-spec';

export const GRAPHICS_MONTH_1_SPECS: MasterclassDaySpec[] = """

body_m1 = json.dumps(month1, indent=2)

divider = """;

export const GRAPHICS_MONTH_2_SPECS: MasterclassDaySpec[] = """

body_m2 = json.dumps(month2, indent=2)

footer = """;
"""

with open("scripts/visuals/graphics-masterclass-spec.ts", "w", encoding="utf-8") as f:
    f.write(header + body_m1 + divider + body_m2 + footer)

print(f"Successfully assembled scripts/visuals/graphics-masterclass-spec.ts with {len(month1) + len(month2)} days and {(len(month1) + len(month2)) * 4} quests!")
