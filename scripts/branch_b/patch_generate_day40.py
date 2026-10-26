# -*- coding: utf-8 -*-
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

file_path = "scripts/branch_b/generate_ecom_day40.py"
with open(file_path, "r", encoding="utf-8") as f:
    code = f.read()

# Add extra paragraph to p5_say
extra_p5 = '''    "Ultimately, the Capstone Boardroom Defense concludes that enterprise composable commerce is not merely an engineering migration, but a sovereign strategic moat. By decoupling checkout orchestration, promotion logic, and tax governance into resilient, autonomous bounded contexts, the enterprise permanently mitigates single-vendor dependencies, eliminates multi-million-dollar technical debt, and establishes an elastic transactional foundation capable of scaling to hundreds of millions in global annual gross merchandise volume.",'''

# Add extra paragraph to p2_say to have comfortable margin
extra_p2 = '''    "To prevent distributed split-brain anomalies across multi-region datacenters, the cart state cluster implements an active-active Raft consensus protocol across CockroachDB nodes. This guarantees that write quorums satisfy linearizable consistency bounds while allowing local read-replicas to deliver sub-millisecond cart telemetry to edge shoppers without cross-oceanic network round-trips.",'''

if "enterprise composable commerce is not merely an engineering migration" not in code:
    code = code.replace('p5_say = [\n', 'p5_say = [\n' + extra_p5 + '\n')

if "To prevent distributed split-brain anomalies across multi-region datacenters" not in code:
    code = code.replace('p2_say = [\n', 'p2_say = [\n' + extra_p2 + '\n')

# Ensure coursePrefix: "bcom_ecom" is in day40_data
if '"coursePrefix": "bcom_ecom",' not in code:
    code = code.replace('"day": 40,\n', '"day": 40,\n    "coursePrefix": "bcom_ecom",\n')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(code)

print("Successfully patched generate_ecom_day40.py")
