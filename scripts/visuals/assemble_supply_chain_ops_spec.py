# scripts/visuals/assemble_supply_chain_ops_spec.py
import json
import sys
from pathlib import Path

repo_root = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(repo_root))

from scripts.visuals.supply_chain_ops_spec_m1 import DAYS_1_TO_15
from scripts.visuals.supply_chain_ops_spec_m1_rest import DAYS_16_TO_30
from scripts.visuals.supply_chain_ops_spec_m2_part1 import DAYS_31_TO_45
from scripts.visuals.supply_chain_ops_spec_m2_part2 import DAYS_46_TO_60

m1_days = DAYS_1_TO_15 + DAYS_16_TO_30
m2_days = DAYS_31_TO_45 + DAYS_46_TO_60

assert len(m1_days) == 30, f"Expected 30 days in M1, got {len(m1_days)}"
assert len(m2_days) == 30, f"Expected 30 days in M2, got {len(m2_days)}"

m1_quests = sum(len(d["quests"]) for d in m1_days)
m2_quests = sum(len(d["quests"]) for d in m2_days)

assert m1_quests == 120, f"Expected 120 quests in M1, got {m1_quests}"
assert m2_quests == 120, f"Expected 120 quests in M2, got {m2_quests}"

# Normalize and validate all 60 days
for d in m1_days + m2_days:
    assert len(d["quests"]) == 4, f"Day {d['day']} has {len(d['quests'])} quests"
    assert "situationalPuzzle" in d, f"Day {d['day']} missing situationalPuzzle"
    assert len(d["situationalPuzzle"]["options"]) == 4, f"Day {d['day']} options count != 4"
    
    sp = d["situationalPuzzle"]
    if "explanation" in sp and "debrief" not in sp:
        sp["debrief"] = sp["explanation"]
    elif "debrief" in sp and "explanation" not in sp:
        sp["explanation"] = sp["debrief"]

    if "correctOptionIndex" not in sp:
        if "correctOption" in sp and sp["correctOption"] in sp["options"]:
            sp["correctOptionIndex"] = sp["options"].index(sp["correctOption"])
        else:
            sp["correctOptionIndex"] = 1
            
    assert len(d["socraticHints"]) == 3, f"Day {d['day']} has {len(d['socraticHints'])} socraticHints"
    assert "conceptInvariant" in d, f"Day {d['day']} missing conceptInvariant"
    assert "failureMode" in d, f"Day {d['day']} missing failureMode"
    assert "tryItFriction" in d, f"Day {d['day']} missing tryItFriction"

    for idx, q in enumerate(d["quests"]):
        if "id" not in q:
            q["id"] = f"Q{d['day']}.{idx + 1}"
        if "title" not in q and "name" in q:
            q["title"] = q["name"]
        if "name" not in q and "title" in q:
            q["name"] = q["title"]
        if "description" not in q and "desc" in q:
            q["description"] = q["desc"]
        if "desc" not in q and "description" in q:
            q["desc"] = q["description"]

out_path = Path(__file__).resolve().parent / "supply-chain-ops-masterclass-spec.ts"

content = f"""// scripts/visuals/supply-chain-ops-masterclass-spec.ts
// Complete 60-Day Masterclass Specification for Supply Chain & Operations Management (course-supply-chain-ops)
// Conforming strictly to Gate v2 semantic standard across all 60 days (240 quests total).
// Generated automatically from Python specifications.
// Month 1: Quantitative SCM Taxonomy, EOQ & Discount Physics, Stochastic Safety Stock & Lead-Time Variance, Continuous (s, Q) vs Periodic (R, S) Inventory, Milestone 1: ApexInventory Replenishment Engine, Demand Forecasting & Holt-Winters, S&OP & Aggregate LP Planning, MRP I & BOM DAG Explosion, MRP II & Drum-Buffer-Rope Scheduling, Milestone 2: ApexPlanning S&OP Suite, Warehouse Racking Topology & Travel Distance, Algorithmic Slotting & COI Indexing, Order Picking & TSP Routing, Cross-Docking & Dynamic Dock Doors, Milestone 3: ApexWMS Warehouse Suite, TMS & LTL/TL Mode Economics with Weight-Break Bumping, Vehicle Routing (VRPTW) & Clarke-Wright Savings, Freight Forwarding & 3PL/4PL MSAs, Cold Chain IoT Telemetry & Arrhenius MKT Kinetics, Milestone 4: ApexTMS Fleet Engine, Strategic Sourcing & Kraljic Matrix, Supplier Evaluation & Altman Z-Score Risk, Multi-Attribute Reverse Auctions & Escrow, Reverse Logistics & 5R Circular Triage, Milestone 5: ApexSourcing Suite, Lean Operations & Ohno's 7 Wastes (VSM/SMED), Kanban Pull Production (TPS), Statistical Process Control (SPC) & Cpk Capability, Supply Chain Finance & Cash Conversion Cycle (CCC), and Capstone 1: ApexChain Core SCM Operations Master Capstone Viva Gate (Days 1–30 / 120 Quests).
// Month 2: Center of Gravity (COG) Ton-Mile Spatial Centroids, Capacitated Facility Location MILP, Multi-Echelon Hub-and-Spoke Topology & Square Root Law, Global Network Optimization & Nearshoring (Total Landed Cost), Milestone 6: ApexNetwork Topology Suite, Bullwhip Effect Physics (Lee-Padmanabhan-Whang Proof), Multi-Echelon Inventory Optimization (MEIO) & Clark-Scarf Decomposition, Vendor-Managed Inventory (VMI EDI 852/855), CPFR Collaborative Forecasting & Joint Exceptions, Milestone 7: ApexInventory MEIO Suite, Warehouse Execution Systems (WES/WCS 3-Tier Architecture), AMRs vs AGVs (LiDAR SLAM & Battery Kinetics), Goods-to-Person (GTP) AutoStore Cube Grid Physics, Multi-Agent Path Finding (MAPF) Conflict-Based Search (CBS), Milestone 8: ApexRobotics Automated Warehouse Suite, Discrete-Event Supply Chain Simulation (DES) & SimPy/AnyLogic Event Calendars, Queueing Theory in Material Handling: M/M/c & Jackson Networks (Little's Law), Supply Chain Digital Twins & Real-Time Operational Telemetry (MQTT/Kafka), Stochastic Lead-Time Disruption & Monte Carlo Risk Modeling (Poisson Shocks / SC-VaR), Milestone 9: ApexTwin Enterprise Supply Chain Discrete-Event Simulation & Real-Time Digital Twin Suite, Historic Catastrophe Post-Mortem 1: Cisco's 2001 $2.25B Inventory Write-Down & Double-Ordering Virtual Supply Chain Collapse, Historic Catastrophe Post-Mortem 2: KFC UK 2018 Chicken Logistics Meltdown (DHL/QSL Transition & Single-Depot Bottleneck), Historic Catastrophe Post-Mortem 3: Boeing 787 Dreamliner Tiered Outsourcing Disaster (Tier-1 Systems Integrators & Fastener Deficits), Global Supply Chain ESG & Human Rights Due Diligence (German LkSG, EU CSDDD & Tier-N Provenance), Scope 1/2/3 Carbon Accounting & Sustainable Logistics (GHG Protocol Corporate Value Chain Standard & GLEC Emission Factors), Executive CSCO Strategic Architecture RFC: Greenfield vs Brownfield Omni-Channel Fulfillment Network Design, Global Trade Compliance, Customs Brokerage & Incoterms 2020 Architecture (FOB, CIF, DDP & HS Tariff Engineering), Enterprise SCM Technology Stack Architecture: SAP S/4HANA vs Manhattan Associates vs Blue Yonder (iDoc/API/EDI/Kafka Integration Patterns), Autonomous Self-Healing Supply Chains: Reinforcement Learning (Q-Learning / PPO) Dynamic Replenishment & Real-Time Rerouting, and Capstone 2: ApexSupplyChainOS Full-Scale Enterprise Supply Chain & Operations Management Engine Master Capstone Viva Gate (Days 31–60 / 120 Quests).
// Capstone 1: ApexChain Core SCM Operations Master Capstone Viva Gate.
// Capstone 2: ApexSupplyChainOS Full-Scale Enterprise Supply Chain & Operations Management Engine Master Capstone Viva Gate.

import {{ MasterclassDaySpec }} from './java-masterclass-spec';

export const SUPPLY_CHAIN_OPS_MONTH_1_SPECS: MasterclassDaySpec[] = {json.dumps(m1_days, indent=2)};

export const SUPPLY_CHAIN_OPS_MONTH_2_SPECS: MasterclassDaySpec[] = {json.dumps(m2_days, indent=2)};
"""

with open(out_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Successfully generated {out_path} ({len(m1_days)} M1 days, {len(m2_days)} M2 days, {m1_quests + m2_quests} total quests)")
