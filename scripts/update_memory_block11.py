import csv
import datetime

print("=== UPDATING CENTRAL SHARED MEMORY FOR BLOCK 11 (DAYS 51-55) ===")

# 1. Update PROJECT_MEMORY.md
pm_path = r"C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md"
with open(pm_path, "r", encoding="utf-8") as f:
    pm_content = f.read()

block11_entry = """
### Milestone Record: Course 01 (Corporate & Financial Accounting - `bcom_acc`) Month 2 Block 11 Complete (Days 51-55 & Milestone 11 Capstone)
- **Agent**: AGENT-501 (Branch B - Commerce & Financial Architecture)
- **Worktree**: `C:\\Users\\Admin\\Desktop\\projects\\Present-Career-os-commerce`
- **Branch**: `agent/branch-b-curriculum-commerce-iot`
- **Scope**: Days 51–55 (5 Days, 25 Parts)
  - **Day 51**: Ind AS 36 / IAS 36 Impairment of Assets (CGU, VIU DCF at 12% WACC $32.86M, FVLCOD $31.0M, $11.14M Impairment Loss, $4M Goodwill elimination, pro-rata allocation to machinery, software, premises, prospective depreciation recalibration; 3,443 words). Emitted confirmation: `IND_AS_36_ASSET_IMPAIRMENT_PASS`.
  - **Day 52**: Ind AS 38 / IAS 38 Intangible Assets (Identifiability, $5M Research & $2.5M Pre-PIRATE expensed to P&L, $24M Development Capitalization under PIRATE criteria, 8-year useful life $1.5M amortization, $8M indefinite-life brand, zero retroactive capitalization; 3,159 words). Emitted confirmation: `IND_AS_38_INTANGIBLE_ASSETS_PASS`.
  - **Day 53**: Ind AS 113 / IFRS 13 Fair Value Measurement (Exit price paradigm, Principal market primacy, Highest and Best Use real estate $19.5M with $11M premium over existing use, 3-tier hierarchy: Level 1 $4.50M / 8.65%, Level 2 $12.85M / 24.69%, Level 3 $34.70M / 66.67%, Portfolio $52.05M with unobservable sensitivity disclosures; 3,075 words). Emitted confirmation: `IND_AS_113_FAIR_VALUE_MEASUREMENT_PASS`.
  - **Day 54**: Ind AS 105 / IFRS 5 Non-Current Assets Held for Sale & Discontinued Operations (Available for immediate sale & highly probable within 12 months, lower of carrying and FVLCTS $27.5M, $4.5M write-down, absolute cessation of depreciation under Ind AS 105.25, single-line post-tax discontinued P&L -$1,122,480.00; 3,250 words). Emitted confirmation: `IND_AS_105_HELD_FOR_SALE_DISCONTINUED_PASS`.
  - **Day 55 (⭐ Milestone 11 Capstone)**: Enterprise Asset Valuation, Impairment & Fair Value Measurement Suite (Simultaneous 4-standard synthesis across Ind AS 36, 38, 113, and 105, registered valuer compliance under Section 247, CARO 2020 Clause 3(i)/(xvii); 3,006 words). Emitted confirmation: `CORPORATE_ASSET_VALUATION_IMPAIRMENT_SUITE_PASS`.
- **Invariants**: 100% adherence to 5-part architecture, >= 580 words per part, >= 3,000 words per day, `check.answer: 0`, `check.answerIndex: 0`, Gate v2 visual envelopes in `src/lib/data/lessonVisuals/bcom-accounting/day-51.json` through `day-55.json` (ledger-sheet template with balanced postings and SHA-256 code hashes).
- **Verification**: All 12 tests in `tests/bcom_accounting_days51_55_expansion.test.ts` passed. All 37 regression tests passed. TypeScript check (`npx tsc --noEmit`) exited cleanly with 0 errors. Pushed to remote branch `agent/branch-b-curriculum-commerce-iot`.
- **Course 01 Overall Status**: 55 / 60 Days Complete (91.7% Conquered!).
- **Next Target**: Block 12 (Days 56-60: Ind AS 1 Presentation, Ind AS 7 Cash Flows, Ind AS 8 Changes in Accounting Estimates, Ind AS 10 Events after Reporting Period, and Day 60 Course 01 Grand Capstone & Graduation!).
"""

if "Course 01 (Corporate & Financial Accounting - `bcom_acc`) Month 2 Block 11" not in pm_content:
    with open(pm_path, "a", encoding="utf-8") as f:
        f.write("\n" + block11_entry.strip() + "\n")
    print("Appended Block 11 to PROJECT_MEMORY.md")
else:
    print("Block 11 already noted in PROJECT_MEMORY.md")

# 2. Update agent_tasks.csv
tasks_csv_path = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
rows = []
fieldnames = []
with open(tasks_csv_path, "r", encoding="utf-8", newline="") as f:
    reader = csv.reader(f)
    header = next(reader)
    fieldnames = header
    for r in reader:
        if r and len(r) >= 5:
            tid = r[0].strip()
            # Mark TASK-1886 to TASK-1890 as Completed
            if tid in [f"TASK-{i}" for i in range(1886, 1891)]:
                r[4] = "Completed"
        rows.append(r)

# Register Block 12 tasks TASK-1891 to TASK-1895 as Active
existing_tids = {r[0].strip() for r in rows if r}
block12_tasks = [
    ("TASK-1891", "bcom_acc Day 56: Ind AS 1 Presentation of Financial Statements & Schedule III Division II Taxonomy", "Course 01 Block 12", "AGENT-501", "Active"),
    ("TASK-1892", "bcom_acc Day 57: Ind AS 7 Statement of Cash Flows (Direct vs Indirect Method & Non-Cash Financing)", "Course 01 Block 12", "AGENT-501", "Active"),
    ("TASK-1893", "bcom_acc Day 58: Ind AS 8 Accounting Policies, Changes in Accounting Estimates and Errors", "Course 01 Block 12", "AGENT-501", "Active"),
    ("TASK-1894", "bcom_acc Day 59: Ind AS 10 Events after the Reporting Period & Going Concern Disclosures", "Course 01 Block 12", "AGENT-501", "Active"),
    ("TASK-1895", "bcom_acc Day 60: 🏆 FINAL GRAND CAPSTONE: Global Financial Controller & Master Audit Accreditation Simulator", "Course 01 Block 12", "AGENT-501", "Active"),
]

for t in block12_tasks:
    if t[0] not in existing_tids:
        rows.append(list(t))

with open(tasks_csv_path, "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(fieldnames)
    writer.writerows(rows)
print("Updated agent_tasks.csv (TASK-1886..1890 Completed, TASK-1891..1895 Active)")

# 3. Update multi_agent_control.csv
mac_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
mac_rows = []
with open(mac_path, "r", encoding="utf-8", newline="") as f:
    reader = csv.reader(f)
    header = next(reader)
    for r in reader:
        if r and len(r) >= 3 and r[0].strip() == "AGENT-501":
            r[2] = "Active: Course 01 bcom_acc Block 12 (Days 56-60: Final Grand Capstone & Course 01 Graduation)"
        mac_rows.append(r)

with open(mac_path, "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(header)
    writer.writerows(mac_rows)
print("Updated multi_agent_control.csv for AGENT-501")
