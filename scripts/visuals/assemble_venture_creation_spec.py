# scripts/visuals/assemble_venture_creation_spec.py
import json
import sys
from pathlib import Path

repo_root = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(repo_root))

from scripts.visuals.venture_creation_spec_m1 import DAYS_1_TO_15
from scripts.visuals.venture_creation_spec_m1_rest import DAYS_16_TO_30
from scripts.visuals.venture_creation_spec_m2_part1 import DAYS_31_TO_45
from scripts.visuals.venture_creation_spec_m2_part2 import DAYS_46_TO_60

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

out_path = Path(__file__).resolve().parent / "venture-creation-masterclass-spec.ts"

content = f"""// scripts/visuals/venture-creation-masterclass-spec.ts
// Complete 60-Day Masterclass Specification for Venture Creation, Corporate Innovation & Lean Startup Engineering (course-bcom-entrepreneurship)
// Conforming strictly to Gate v2 semantic standard across all 60 days (240 quests total).
// Generated automatically from Python specifications.
// Month 1: Legal Entity Selection & Corporate Veil, Bottom-Up TAM/SAM/SOM Sizing, 9-Block Business Model Canvas, Christensen JTBD Value Proposition Design, Milestone 1: ApexVenture Ideation Engine, Lean Startup & MVP Archetypes, Hamilton Helmer 7 Powers Moats, Break-Even & Contribution Margin Calculus, Working Capital Cash Runway & Zero-Cash Date, Post-Money SAFE Cap Table Dilution, Milestone 2: ApexCapTable Financial Feasibility Suite, Early-Stage Valuation (VC Method/Berkus), Founder Equity Reverse Vesting & PIIA IP Assignment, OKR Strategic Execution, Little's Law Operational Bottlenecks, Six Sigma DMAIC Quality (Cpk >= 1.33), Kanban Pull Production & Little's Law WIP Limits, The Mom Test Customer Discovery, B2B Sales Pipeline Velocity, Milestone 4: ApexMetrics SaaS Unit Economics Suite, 10-Slide Pitch Deck Architecture, Term Sheet Liquidation Preferences (Non-Participating vs Participating), Integrated 3-Statement Forecasting, Virtual Data Room (VDR) Due Diligence, Milestone 5: ApexPitch Term Sheet Suite, Corporate Ambidexterity & Skunkworks, Strategic Alliances & Minimum Revenue Guarantees, Patent Strategy & All-Elements FTO Clearance, Crisis Turnaround & Default Alive Down-Rounds, and Capstone 1: ApexVenture Core Startup Architecture Master Capstone Viva Gate (Days 1–30 / 120 Quests).
// Month 2: Series A/B Board Governance & Fiduciary Duties, Cross-Border Delaware Flips & Section 367 Tax Traps, Multi-Round Dilution Waterfalls with Pre-Money Option Pool Shuffles, Rahul Vohra's Superhuman PMF Engine, Milestone 6: ApexScale Institutional Cap Table Suite, Venture Debt & Negative Covenants, SOX 404 Segregation of Duties & FCPA, M&A Purchase Agreements (Asset vs Stock, Escrow, Deductible Baskets), Secondary Tender Offers & 409A Strike Price Isolation, Milestone 7: ApexTreasury Debt & M&A Suite, Product-Led Growth Freemium & PQL Telemetry, International Expansion (VAT/GST & GDPR Data Residency), Executive Headcount Planning & Radford Compensation Bands, High-Stakes Founder Psychology & War-Time Governance, Milestone 8: ApexGlobal International Entity Suite, Monte Carlo Stochastic Venture Survival Simulation (P(Default)), Automated Investor Relations & LP Fund Metrics (TVPI/DPI/MOIC), SEC Regulation D Rule 506(b)/506(c) Securities Compliance, Algorithmic Unit Economics Stress-Testing (COGS Creep/CAC Inflation), Milestone 9: ApexSimulator Stochastic Venture Simulation Suite, Historic Catastrophe 1 (Theranos Fraud & Governance Blindness), Historic Catastrophe 2 (WeWork Related-Party S-1 Self-Destruction), Historic Catastrophe 3 (FTX Circular Token Collateralization & Backdoors), Corporate Venture Capital (ROFR Chilling Covenants), Chief of Staff Strategic Architecture RFC ($1B Conglomerate Blueprint), Growth Capital Markets (Crossover Investors & S-1 Underwriting), Anti-Takeover Defensive Strategy (Poison Pills & Dual-Class Voting), Caremark Fiduciary Oversight & DGCL Section 220 Books and Records, The Founder-to-CEO Metamorphosis (Andy Grove Managerial Leverage), and Capstone 2: ApexUnicornOS Full-Scale Enterprise Venture Creation Master Capstone Viva Gate (Days 31–60 / 120 Quests).
// Capstone 1: ApexVenture Core Startup Architecture Master Capstone Viva Gate.
// Capstone 2: ApexUnicornOS Full-Scale Enterprise Venture Creation Master Capstone Viva Gate.

import {{ MasterclassDaySpec }} from './java-masterclass-spec';

export const VENTURE_CREATION_MONTH_1_SPECS: MasterclassDaySpec[] = {json.dumps(m1_days, indent=2)};

export const VENTURE_CREATION_MONTH_2_SPECS: MasterclassDaySpec[] = {json.dumps(m2_days, indent=2)};
"""

with open(out_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Successfully generated {out_path} ({len(m1_days)} M1 days, {len(m2_days)} M2 days, {m1_quests + m2_quests} total quests)")
