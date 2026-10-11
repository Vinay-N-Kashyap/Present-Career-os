# scripts/visuals/assemble_digital_accounting_spec.py
import json
import sys
from pathlib import Path

repo_root = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(repo_root))

from scripts.visuals.digital_accounting_spec_m1 import DAYS_1_TO_15
from scripts.visuals.digital_accounting_spec_m1_rest import DAYS_16_TO_30
from scripts.visuals.digital_accounting_spec_m2_part1 import DAYS_31_TO_45
from scripts.visuals.digital_accounting_spec_m2_part2 import DAYS_46_TO_60

m1_days = DAYS_1_TO_15 + DAYS_16_TO_30
m2_days = DAYS_31_TO_45 + DAYS_46_TO_60

assert len(m1_days) == 30, f"Expected 30 days in M1, got {len(m1_days)}"
assert len(m2_days) == 30, f"Expected 30 days in M2, got {len(m2_days)}"

m1_quests = sum(len(d["quests"]) for d in m1_days)
m2_quests = sum(len(d["quests"]) for d in m2_days)
assert m1_quests == 120, f"Expected 120 quests in M1, got {m1_quests}"
assert m2_quests == 120, f"Expected 120 quests in M2, got {m2_quests}"

out_path = repo_root / "scripts" / "visuals" / "digital-accounting-masterclass-spec.ts"

content = f"""// scripts/visuals/digital-accounting-masterclass-spec.ts
// Exhaustive 60-Day Masterclass Specification for Digital Accounting & Taxation (course-digital-accounting)
// Total Quests: 240 Quests (Month 1: 120 Quests, Month 2: 120 Quests)
// Conforming strictly to Gate v2 semantic standard, 3-Tier Socratic Hint Ladders,
// Double-Entry Bookkeeping Principles & Accounting Equation Physics (Assets = Liabilities + Equity),
// Multi-Tier Chart of Accounts (COA) Engineering, Gapless Digital Voucher Sequences,
// Sub-Ledger & General Ledger Control Reconciliation, Automated Bank Reconciliation (BRS),
// Petty Cash Imprest Float Management, Accrual Accounting & Prepaid Amortization Schedules,
// Depreciation & Fixed Asset Register (FAR) Schedule II Standards, ERP Topologies (Tally Prime, SAP FICO, Zoho Books API),
// Multi-Currency Accounting (Ind AS 21 Forex Translation), Cost Center Allocation & Activity-Based Costing,
// Inventory Valuation & FIFO/WAC COGS (Ind AS 2), MCA Audit Trail Mandate (Sec 143(3)(j) & CARO 2020),
// Forensic Accounting & Benford's Law Fraud Detection, Segregation of Duties (SoD) & 3-Way Matching,
// Year-End Fiscal Close & Automated Reversing Entries, GST Constitutional Framework (CGST/SGST/IGST),
// Rule 46 Tax Invoice Mandates, HSN/SAC Classification & Reverse Charge Mechanism (RCM),
// E-Invoicing Schema v1.1 & SHA-256 IRN Hashes, E-Way Bill Logistics Compliance,
// Input Tax Credit (ITC) Mechanics & Section 17(5) Blocked Credits, GSTR-2B vs Books Fuzzy Reconciliation,
// GSTR-1 / GSTR-3B Tax Offsets & Electronic Ledgers, GSTR-9/9C Annual Reconciliation,
// Direct Tax Framework & Residential Status (POEM Rules), PGBP Business Profits (Sec 28-44DB, 40(a)(ia), 43B),
// Corporate Concessional Tax Regimes (Section 115BAA 22% vs Section 115BAB 15%),
// Minimum Alternate Tax (MAT) Section 115JB Book Profits & 15-Year Credit Ledgers,
// TDS Withholding Framework (194C, 194J, 194I, 194Q), TCS & Section 206C Provisions,
// Section 206AB/206CCA Non-Filer Penal Withholding, Quarterly TDS Returns (Form 26Q/24Q/27Q & TRACES),
// Salary Structuring & HRA Section 10(13A), EPF 12% Contribution Splits & ECR Generation,
// ESIC, Payment of Gratuity Act 15/26 Rule & Multi-State Professional Tax, Form 16 & Section 115BAC Regime Choice,
// Advance Tax Quarterly Installments & Section 234B/234C Interest, International Taxation DTAA & Form 15CA/CB,
// Transfer Pricing Arm's Length Pricing (TNMM 3% Tolerance Band & Form 3CEB), Equalisation Levy & SEP,
// Schedule III Division II Ind AS Financial Statements, Statement of Cash Flows (Ind AS 7 Indirect Method),
// DuPont 5-Way Return on Equity Decomposition, Financial Close Orchestration DAGs,
// Industrial Case Studies (Satyam 2009, Vodafone Retrospective Tax, GST Circular Invoicing),
// Principal Financial Controller RFC, and Sovereign Institutional Financial & Tax Systems.

import {{ MasterclassDaySpec }} from './java-masterclass-spec';

export const DIGITAL_ACCOUNTING_MONTH_1_SPECS: MasterclassDaySpec[] = {json.dumps(m1_days, indent=2)};

export const DIGITAL_ACCOUNTING_MONTH_2_SPECS: MasterclassDaySpec[] = {json.dumps(m2_days, indent=2)};
"""

with open(out_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Successfully generated {out_path} ({len(m1_days)} M1 days, {len(m2_days)} M2 days, {m1_quests + m2_quests} total quests)")
