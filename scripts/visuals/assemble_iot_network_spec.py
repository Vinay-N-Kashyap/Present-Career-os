# scripts/visuals/assemble_iot_network_spec.py
# Combines iot_network_spec_m1, iot_network_spec_m1_rest, iot_network_spec_m2_part1, and iot_network_spec_m2_part2
# into scripts/visuals/iot-network-masterclass-spec.ts

import json
import sys
import os

# Add scripts/visuals to sys.path so we can import modules
sys.path.append(os.path.abspath("scripts/visuals"))

from iot_network_spec_m1 import DAYS_1_TO_15
from iot_network_spec_m1_rest import DAYS_16_TO_30
from iot_network_spec_m2_part1 import DAYS_31_TO_45
from iot_network_spec_m2_part2 import DAYS_46_TO_60

month1 = DAYS_1_TO_15 + DAYS_16_TO_30
month2 = DAYS_31_TO_45 + DAYS_46_TO_60

print(f"Month 1: {len(month1)} days")
print(f"Month 2: {len(month2)} days")

# Validate day sequence and quest count
for i, d in enumerate(month1, 1):
    assert d['day'] == i, f"Month 1 Day mismatch at index {i}: expected {i}, got {d['day']}"
    assert len(d['quests']) == 4, f"Month 1 Day {i} quests count != 4"

for i, d in enumerate(month2, 31):
    assert d['day'] == i, f"Month 2 Day mismatch at index {i}: expected {i}, got {d['day']}"
    assert len(d['quests']) == 4, f"Month 2 Day {i} quests count != 4"

header = """// scripts/visuals/iot-network-masterclass-spec.ts
// Exhaustive 60-Day Masterclass Specification for IoT Wireless Networks & Protocols (course-iot-network)
// Total Quests: 240 Quests (Month 1: 120 Quests, Month 2: 120 Quests)
// Conforming strictly to Gate v2 semantic standard, 3-Tier Socratic Hint Ladders, RF Physics, IEEE 802.15.4, BLE 5.x Stack, LoRa/LoRaWAN, LwIP Zero-Copy Sockets, MQTT QoS 2, CoAP RFC 7252/7959/7641, 6LoWPAN, RPL DODAG, Thread/Matter, Cellular NB-IoT/LTE-M PSM, and LEO Satellite NTN.

import { MasterclassDaySpec } from './java-masterclass-spec';

export const IOT_NETWORK_MONTH_1_SPECS: MasterclassDaySpec[] = """

body_m1 = json.dumps(month1, indent=2)

divider = """;

export const IOT_NETWORK_MONTH_2_SPECS: MasterclassDaySpec[] = """

body_m2 = json.dumps(month2, indent=2)

footer = """;
"""

with open("scripts/visuals/iot-network-masterclass-spec.ts", "w", encoding="utf-8") as f:
    f.write(header + body_m1 + divider + body_m2 + footer)

print(f"Successfully assembled scripts/visuals/iot-network-masterclass-spec.ts with {len(month1) + len(month2)} days and {(len(month1) + len(month2)) * 4} quests!")
