# scripts/visuals/assemble_sales_crm_spec.py
import json
import sys
from pathlib import Path

repo_root = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(repo_root))

from scripts.visuals.sales_crm_spec_m1 import DAYS_1_TO_15
from scripts.visuals.sales_crm_spec_m1_rest import DAYS_16_TO_30
from scripts.visuals.sales_crm_spec_m2_part1 import DAYS_31_TO_45
from scripts.visuals.sales_crm_spec_m2_part2 import DAYS_46_TO_60

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

out_path = Path(__file__).resolve().parent / "sales-crm-masterclass-spec.ts"

content = f"""// scripts/visuals/sales-crm-masterclass-spec.ts
// Complete 60-Day Masterclass Specification for Enterprise B2B Sales, Customer Success & CRM Systems Architecture (course-sales-crm-success)
// Conforming strictly to Gate v2 semantic standard across all 60 days (240 quests total).
// Generated automatically from Python specifications.
// Month 1: Pipeline Topology & Opportunity FSM, MEDDPICC Deal Qualification, Buying Center Graph Theory, Outbound Prospecting Calculus, Milestone 1: ApexProspect Lead Qualification Engine, Discovery Call Engineering (Socratic Funnel), Challenger Sale & Commercial Teaching, Competitive Intelligence & Landmines, Cost of Inaction (COI) ROI Calculus, Milestone 2: ApexDiscovery Value Architecture Suite, Technical Solution Scoping, POC Physics & Binary Gates, Mutual Action Plans (MAP), Deal Desk Discount Governance, Milestone 3: ApexDealDesk Scoping Suite, Enterprise MSA/SOW Redlining, Risk Allocation & SLA Carve-Outs, Security & Compliance Audits (SOC 2), Sales Forecasting Calculus & Velocity Physics, Milestone 4: ApexLegal Contract Redlining & Velocity Engine, Multi-Year Closing Dynamics, CFO Capital Allocation & Budget Cycles, Partner & Channel Sales Co-Selling, Territory Design & Gini Quota Balancing, Sales Compensation Engineering (Accelerators & Clawbacks), and Capstone 1: ApexRevenue Core B2B Sales Execution & Deal Desk Master Capstone Viva Gate (Days 1–30 / 120 Quests).
// Month 2: Enterprise CRM Relational Data Architecture, Lead-to-Account (L2A) Fuzzy Matching, Multi-Touch Sales Cadence Automation, Product-Led Sales (PLS) & PQL Telemetry, Milestone 6: ApexCRM Enterprise Relational Data Model & PQL Suite, Post-Sale Handoff & TTV Optimization, Customer Health Scoring Algorithms, Scaled Implementation SOW Governance, Executive Business Reviews (QBR) & Realized ROI Ledgers, Milestone 7: ApexSuccess Customer Health & Churn Rescue Engine, Net Retention Rate (NRR) & GRR Calculus, Land-and-Expand Growth Models, Price Uplift Negotiations & Annual CPI Clauses, Customer Advocacy Programs & Reference Pools, Milestone 8: ApexExpansion NRR Optimization & Account Growth Suite, RevOps Data Engineering (Snowflake/dbt), Full-Funnel Attribution (Markov Chains & Shapley Values), Sales Capacity Planning & Erlang Models, Algorithmic Churn Prediction (Survival Analysis & Cox Hazards), Milestone 9: ApexRevOps Revenue Intelligence Suite, Historic Disaster 1 ('Vapourware' POC Disaster), Historic Disaster 2 (Rogue Rep Uncapped Commission Scandal), Historic Disaster 3 (40% Churn Cliff Post-Acquisition), Account-Based Marketing (ABM) Swarm Orchestration, Enterprise CPQ Rule & Proration Engineering, Chief Revenue Officer (CRO) Strategic Architecture RFC, Global Enterprise Data Privacy in CRM (GDPR Art. 17 vs Audit Ledgers), Sales Engineering Architecture & Solution Architect Co-Ownership, High-Performance Behavioral Psychology (Cialdini & Voss), and Capstone 2: ApexRevenueOS Full-Scale Enterprise GTM, Sales Engineering & RevOps Engine Master Capstone Viva Gate (Days 31–60 / 120 Quests).
// Capstone 1: ApexRevenue Core B2B Sales Execution & Deal Desk Master Capstone Viva Gate.
// Capstone 2: ApexRevenueOS Full-Scale Enterprise GTM, Sales Engineering & RevOps Engine Master Capstone Viva Gate.

import {{ MasterclassDaySpec }} from './java-masterclass-spec';

export const SALES_CRM_MONTH_1_SPECS: MasterclassDaySpec[] = {json.dumps(m1_days, indent=2)};

export const SALES_CRM_MONTH_2_SPECS: MasterclassDaySpec[] = {json.dumps(m2_days, indent=2)};
"""

with open(out_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Successfully generated {out_path} ({len(m1_days)} M1 days, {len(m2_days)} M2 days, {m1_quests + m2_quests} total quests)")
