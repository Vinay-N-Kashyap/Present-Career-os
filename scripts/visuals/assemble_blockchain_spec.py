# scripts/visuals/assemble_blockchain_spec.py
# Combines blockchain_spec_m1, blockchain_spec_m1_rest, blockchain_spec_m2_part1, and blockchain_spec_m2_part2
# into scripts/visuals/blockchain-masterclass-spec.ts

import json
import sys
import os

# Add scripts/visuals to sys.path so we can import modules
sys.path.append(os.path.abspath("scripts/visuals"))

from blockchain_spec_m1 import BLOCKCHAIN_M1_PART1
from blockchain_spec_m1_rest import BLOCKCHAIN_M1_PART2
from blockchain_spec_m2_part1 import BLOCKCHAIN_M2_PART1
from blockchain_spec_m2_part2 import BLOCKCHAIN_M2_PART2

month1 = BLOCKCHAIN_M1_PART1 + BLOCKCHAIN_M1_PART2
month2 = BLOCKCHAIN_M2_PART1 + BLOCKCHAIN_M2_PART2

print(f"Month 1: {len(month1)} days")
print(f"Month 2: {len(month2)} days")

# Validate day sequence and quest count
for i, d in enumerate(month1, 1):
    assert d['day'] == i, f"Month 1 Day mismatch at index {i}: expected {i}, got {d['day']}"
    assert len(d['quests']) == 4, f"Month 1 Day {i} quests count != 4"

for i, d in enumerate(month2, 31):
    assert d['day'] == i, f"Month 2 Day mismatch at index {i}: expected {i}, got {d['day']}"
    assert len(d['quests']) == 4, f"Month 2 Day {i} quests count != 4"

header = """// scripts/visuals/blockchain-masterclass-spec.ts
// Exhaustive 60-Day Masterclass Specification for Blockchain, Web3 & Smart Contracts (course-blockchain-web3)
// Total Quests: 240 Quests (Month 1: 120 Quests, Month 2: 120 Quests)
// Conforming strictly to Gate v2 semantic standard, 3-Tier Socratic Hint Ladders, EVM Architecture, Solidity 0.8.20+, Foundry, ERC Standards, DeFi AMMs, Layer 2 Rollups, Zero-Knowledge Proofs, and ERC-4337 Account Abstraction.

import { MasterclassDaySpec } from './java-masterclass-spec';

export const BLOCKCHAIN_MONTH_1_SPECS: MasterclassDaySpec[] = """

body_m1 = json.dumps(month1, indent=2)

divider = """;

export const BLOCKCHAIN_MONTH_2_SPECS: MasterclassDaySpec[] = """

body_m2 = json.dumps(month2, indent=2)

footer = """;
"""

with open("scripts/visuals/blockchain-masterclass-spec.ts", "w", encoding="utf-8") as f:
    f.write(header + body_m1 + divider + body_m2 + footer)

print(f"Successfully assembled scripts/visuals/blockchain-masterclass-spec.ts with {len(month1) + len(month2)} days and {(len(month1) + len(month2)) * 4} quests!")
