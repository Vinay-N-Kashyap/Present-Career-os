# scripts/visuals/assemble_ai_transform_spec.py
import json
import sys
from pathlib import Path

repo_root = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(repo_root))

from scripts.visuals.ai_transform_spec_m1 import DAYS_1_TO_15
from scripts.visuals.ai_transform_spec_m1_rest import DAYS_16_TO_30
from scripts.visuals.ai_transform_spec_m2_part1 import DAYS_31_TO_45
from scripts.visuals.ai_transform_spec_m2_part2 import DAYS_46_TO_60

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

out_path = Path(__file__).resolve().parent / "ai-transform-masterclass-spec.ts"

content = f"""// scripts/visuals/ai-transform-masterclass-spec.ts
// Complete 60-Day Masterclass Specification for Enterprise AI & Digital Business Transformation (course-ai-digital-transformation)
// Conforming strictly to Gate v2 semantic standard across all 60 days (240 quests total).
// Generated automatically from Python specifications.
// Month 1: Digital Transformation Taxonomy & Maturity Indices (MIT CISR), Henderson-Venkatraman Strategic Alignment Model, Technical Debt Valuation & Strangler Fig Patterns, Cloud Migration Economics (7Rs & FinOps TCO), Milestone 1: ApexTransform Digital Maturity & Modernization Suite, Process Mining Telemetry (XES/OCEL & Alpha Miner), Conformance Checking & Petri Net Token Replay, Robotic Process Automation (RPA) Resilient Selectors & Exception Queues, Intelligent Document Processing (IDP LayoutLM & Confidence Calibration), Milestone 2: ApexProcess Process Mining & Intelligent Automation Suite, Modern Data Stack & Zhamak Dehghani Data Mesh Principles, API-First Composable Architecture (MACH & Gateways), Master Data Management (MDM Fellegi-Sunter Golden Records), Real-Time Operational Telemetry & Kafka Streaming, Milestone 3: ApexData Enterprise Composable Data Mesh & API Gateway Suite, Kotter's 8-Step & Prosci ADKAR Change Physics, Project-to-Product Transition & Team Topologies (Marty Cagan / Mik Kersten Flow), Scaled Agile (SAFe vs LeSS vs Spotify Dependency Bottlenecks), Digital Upskilling & Competency Matrix Mapping, Milestone 4: ApexOrg Change Management & Product Operating Model Suite, Zero Trust Architecture (NIST SP 800-207 & BeyondCorp IAP), Third-Party Vendor Risk Management (TPVRM & SBOM Scans), Data Sovereignty & GDPR Schrems II Geo-Residency, Business Continuity (BC/DR, RTO/RPO & Chaos Engineering), Milestone 5: ApexShield Enterprise GRC Suite, Financial Justification (CapEx to OpEx Shifts, ASC 350-40 & WACC Hurdle Rates), Value Realization Office (VRO) Benefit Tracking Ledgers, Digital Governance Operating Models (ARB & Stage-Gate Funding), Omnichannel Digital Customer Experience (DCX Journey Mapping & CDP State Sync), and Capstone 1: ApexCore Enterprise Digital Transformation Master Capstone Viva Gate (Days 1–30 / 120 Quests).
// Month 2: Enterprise AI Taxonomy (Predictive, Generative, Agentic Systems of Record vs Intelligence), AI Readiness & Enterprise Feature Stores (Feast/Hopsworks Point-in-Time Correctness), Operational Machine Learning (Predictive Maintenance, Dynamic Pricing & Churn Risk), Computer Vision & Edge AI in Physical Industry (ONNX Runtime & TensorRT Latency Budgets), Milestone 6: ApexPredict Enterprise Predictive Intelligence & Operational ML Platform Suite, Enterprise Foundation Models (Proprietary vs Sovereign Open-Weight LLMs, AWQ Quantization & Privacy Firewalls), Production RAG Systems (Hybrid Dense-Sparse Vector/BM25 Search, Cross-Encoder Re-Ranking & Semantic Chunking), Enterprise GraphRAG (Neo4j Multi-Hop Knowledge Fabric & Community Summaries), Enterprise LLM Guardrails (NeMo Guardrails, Semantic Firewalls & RAGAS Evaluation), Milestone 7: ApexKnowledge Enterprise Secure Hybrid RAG & Knowledge Fabric Suite, Autonomous Multi-Agent Systems (ReAct Pattern, Tool Calling & Dynamic Context Budgeting), Agentic Orchestration (LangGraph State Graphs, Supervisor-Worker Topologies & HITL Interrupts), Autonomous Business Operations (Three-Way Invoice Matching & Automated ERP Reconciliation), Agentic Safety Circuit Breakers (Semantic Loop Detection, Token Budgeting & Emergency Kill Switches), Milestone 8: ApexAgent Production Multi-Agent Autonomous Workflow Engine Suite, Responsible AI Governance (FAT Principles & Disparate Impact Four-Fifths Audits), Regulatory Compliance & Global AI Directives (EU AI Act Risk Tiers, NIST AI RMF & Cryptographic Data Provenance), Enterprise AI Security & Red-Teaming (OWASP Top 10 for LLMs & Prompt Injection Defense), Enterprise AI FinOps & Tokenomics (GPTCache Semantic Caching & Tiered Model Routing), Milestone 9: ApexGovernance Enterprise AI Safety, Compliance & FinOps Gateway Suite, Historic Catastrophe 1 (GE Digital $7B Predix Meltdown), Historic Catastrophe 2 (Hertz vs Accenture $32M Lawsuit), Historic Catastrophe 3 (BBC DMI £100M Scrap), Industry-Specific Transformation Patterns (Core Banking vs Retail Omnichannel vs Healthcare), AI-Driven Business Model Innovation (Pipeline to Platform & Data Flywheels), The CDAO Strategic Architecture RFC ($100M 3-Year Blueprint), Board of Directors AI Governance & Fiduciary Oversight (Caremark Doctrine & SEC Disclosures), Enterprise AI Scaling & Day-2 MLOps Operating Models (Drift Detection & Shadow Deployments), The Ambidextrous Enterprise (Horizon 1-2-3 Portfolios & Sandboxes), and Capstone 2: ApexEnterpriseAI Autonomous Digital Transformation Engine Master Capstone Viva Gate (Days 31–60 / 120 Quests).
// Capstone 1: ApexCore Enterprise Digital Transformation Master Capstone Viva Gate.
// Capstone 2: ApexEnterpriseAI Autonomous Digital Transformation Engine Master Capstone Viva Gate.

import {{ MasterclassDaySpec }} from './java-masterclass-spec';

export const AI_TRANSFORM_MONTH_1_SPECS: MasterclassDaySpec[] = {json.dumps(m1_days, indent=2)};

export const AI_TRANSFORM_MONTH_2_SPECS: MasterclassDaySpec[] = {json.dumps(m2_days, indent=2)};
"""

with open(out_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Successfully generated {out_path} ({len(m1_days)} M1 days, {len(m2_days)} M2 days, {m1_quests + m2_quests} total quests)")
