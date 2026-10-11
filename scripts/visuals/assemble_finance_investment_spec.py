# scripts/visuals/assemble_finance_investment_spec.py
import json
import sys
from pathlib import Path

repo_root = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(repo_root))

from scripts.visuals.finance_investment_spec_m1 import DAYS_1_TO_15
from scripts.visuals.finance_investment_spec_m1_rest import DAYS_16_TO_30
from scripts.visuals.finance_investment_spec_m2_part1 import DAYS_31_TO_45
from scripts.visuals.finance_investment_spec_m2_part2 import DAYS_46_TO_60

m1_days = DAYS_1_TO_15 + DAYS_16_TO_30
m2_days = DAYS_31_TO_45 + DAYS_46_TO_60

assert len(m1_days) == 30, f"Expected 30 days in M1, got {len(m1_days)}"
assert len(m2_days) == 30, f"Expected 30 days in M2, got {len(m2_days)}"

m1_quests = sum(len(d["quests"]) for d in m1_days)
m2_quests = sum(len(d["quests"]) for d in m2_days)

assert m1_quests == 120, f"Expected 120 quests in M1, got {m1_quests}"
assert m2_quests == 120, f"Expected 120 quests in M2, got {m2_quests}"

out_path = Path(__file__).resolve().parent / "finance-investment-masterclass-spec.ts"

content = f"""// scripts/visuals/finance-investment-masterclass-spec.ts
// Complete 60-Day Masterclass Specification for Business Finance & Investment Management (course-finance-investment)
// Conforming strictly to Gate v2 semantic standard across all 60 days (240 quests total).
// Generated automatically from Python specifications.
// Month 1: Corporate Financial Management, Capital Budgeting, Capital Structure & Working Capital (Days 1–30 / 120 Quests).
// Month 2: Investment Analysis, Portfolio Theory, Derivatives & Strategic Corporate Finance (Days 31–60 / 120 Quests).
// Capstone 1: ApexTreasury Enterprise Corporate Finance & Working Capital Optimization Suite.
// Capstone 2: ApexInvest Global Multi-Asset Investment Management, Corporate Valuation, M&A & Sovereign Treasury Suite.

import {{ MasterclassDaySpec }} from './java-masterclass-spec';

export const FINANCE_INVESTMENT_MONTH_1_SPECS: MasterclassDaySpec[] = {json.dumps(m1_days, indent=2)};

export const FINANCE_INVESTMENT_MONTH_2_SPECS: MasterclassDaySpec[] = {json.dumps(m2_days, indent=2)};
"""

with open(out_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Successfully generated {out_path} ({len(m1_days)} M1 days, {len(m2_days)} M2 days, {m1_quests + m2_quests} total quests)")
