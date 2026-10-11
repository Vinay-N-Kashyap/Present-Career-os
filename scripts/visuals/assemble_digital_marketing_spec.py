# scripts/visuals/assemble_digital_marketing_spec.py
import json
import sys
from pathlib import Path

repo_root = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(repo_root))

from scripts.visuals.digital_marketing_spec_m1 import DAYS_1_TO_15
from scripts.visuals.digital_marketing_spec_m1_rest import DAYS_16_TO_30
from scripts.visuals.digital_marketing_spec_m2_part1 import DAYS_31_TO_45
from scripts.visuals.digital_marketing_spec_m2_part2 import DAYS_46_TO_60

m1_days = DAYS_1_TO_15 + DAYS_16_TO_30
m2_days = DAYS_31_TO_45 + DAYS_46_TO_60

assert len(m1_days) == 30, f"Expected 30 days in M1, got {len(m1_days)}"
assert len(m2_days) == 30, f"Expected 30 days in M2, got {len(m2_days)}"

m1_quests = sum(len(d["quests"]) for d in m1_days)
m2_quests = sum(len(d["quests"]) for d in m2_days)

assert m1_quests == 120, f"Expected 120 quests in M1, got {m1_quests}"
assert m2_quests == 120, f"Expected 120 quests in M2, got {m2_quests}"

for d in m1_days + m2_days:
    assert len(d["quests"]) == 4, f"Day {d['day']} has {len(d['quests'])} quests"
    assert "situationalPuzzle" in d, f"Day {d['day']} missing situationalPuzzle"
    assert len(d["socraticHints"]) == 3, f"Day {d['day']} has {len(d['socraticHints'])} socraticHints"
    assert "conceptInvariant" in d, f"Day {d['day']} missing conceptInvariant"
    assert "failureMode" in d, f"Day {d['day']} missing failureMode"
    assert "tryItFriction" in d, f"Day {d['day']} missing tryItFriction"

out_path = Path(__file__).resolve().parent / "digital-marketing-masterclass-spec.ts"

content = f"""// scripts/visuals/digital-marketing-masterclass-spec.ts
// Complete 60-Day Masterclass Specification for Digital Marketing & Growth Strategy (course-digital-marketing)
// Conforming strictly to Gate v2 semantic standard across all 60 days (240 quests total).
// Generated automatically from Python specifications.
// Month 1: Attribution Modeling, Advanced Technical SEO, Core Web Vitals, Semantic Entity Clusters, Paid Search (Ad Rank & PMax), Paid Social (Meta Total Value), Programmatic RTB & Full-Funnel Paid Acquisition (Days 1–30 / 120 Quests).
// Month 2: Scientific CRO, Bayesian Testing, Lifecycle Email/SMS & RFM, Mobile Push, Viral Loops (PLG), GA4 BigQuery Telemetry, CDP Identity Graphs, Server-Side Tagging & CAPI, Econometric Bayesian MMM, Synthetic Control Geo-Holdouts, Markov MTA, KKT Budget Portfolios, Forensic Disaster Audits, Regulatory Privacy & CGO Boardroom Strategy (Days 31–60 / 120 Quests).
// Capstone 1: ApexAcquisition Full-Funnel Paid Acquisition Engine Master Capstone Viva Gate.
// Capstone 2: ApexGrowthOS Sovereign Enterprise Growth Engine, Omnichannel MarTech Ecosystem, Predictive Incrementality & Boardroom Strategy Master Capstone Viva Gate.

import {{ MasterclassDaySpec }} from './java-masterclass-spec';

export const DIGITAL_MARKETING_MONTH_1_SPECS: MasterclassDaySpec[] = {json.dumps(m1_days, indent=2)};

export const DIGITAL_MARKETING_MONTH_2_SPECS: MasterclassDaySpec[] = {json.dumps(m2_days, indent=2)};
"""

with open(out_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Successfully generated {out_path} ({len(m1_days)} M1 days, {len(m2_days)} M2 days, {m1_quests + m2_quests} total quests)")
