# scripts/visuals/assemble_iot_spec.py
# Combines iot_spec_m1, iot_spec_m1_rest, iot_spec_m2_part1, and iot_spec_m2_part2
# into scripts/visuals/iot-masterclass-spec.ts

import json
from iot_spec_m1 import IOT_M1_PART1
from iot_spec_m1_rest import IOT_M1_PART2
from iot_spec_m2_part1 import IOT_M2_PART1
from iot_spec_m2_part2 import IOT_M2_PART2

month1 = IOT_M1_PART1 + IOT_M1_PART2
month2 = IOT_M2_PART1 + IOT_M2_PART2

print(f"Month 1: {len(month1)} days")
print(f"Month 2: {len(month2)} days")

# Validate day sequence and quest count
for i, d in enumerate(month1, 1):
    assert d['day'] == i, f"Month 1 Day mismatch at index {i}: expected {i}, got {d['day']}"
    assert len(d['quests']) == 4, f"Month 1 Day {i} quests count != 4"

for i, d in enumerate(month2, 31):
    assert d['day'] == i, f"Month 2 Day mismatch at index {i}: expected {i}, got {d['day']}"
    assert len(d['quests']) == 4, f"Month 2 Day {i} quests count != 4"

header = """// scripts/visuals/iot-masterclass-spec.ts
// Exhaustive 60-Day Masterclass Specification for IoT, Firmware & Embedded Systems (course-iot-embedded)
// Total Quests: 240 Quests (Month 1: 120 Quests, Month 2: 120 Quests)
// Conforming strictly to Gate v2 semantic standard, 3-Tier Socratic Hint Ladders, ARM Cortex-M Silicon Physics, FreeRTOS Kernel Internals, Wireless Mesh, Secure Bootloaders, and FOTA.

import { MasterclassDaySpec } from './java-masterclass-spec';

export const IOT_MONTH_1_SPECS: MasterclassDaySpec[] = """

body_m1 = json.dumps(month1, indent=2)

divider = """;

export const IOT_MONTH_2_SPECS: MasterclassDaySpec[] = """

body_m2 = json.dumps(month2, indent=2)

footer = """;
"""

with open("scripts/visuals/iot-masterclass-spec.ts", "w", encoding="utf-8") as f:
    f.write(header + body_m1 + divider + body_m2 + footer)

print(f"Successfully assembled scripts/visuals/iot-masterclass-spec.ts with {len(month1) + len(month2)} days and {(len(month1) + len(month2)) * 4} quests!")
