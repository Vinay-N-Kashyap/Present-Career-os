import csv
import datetime

print("=== UPDATING CENTRAL SHARED MEMORY FOR BLOCK 7 ===")

# 1. Update PROJECT_MEMORY.md
pm_path = r"C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md"
with open(pm_path, "r", encoding="utf-8") as f:
    pm_content = f.read()

block7_entry = """
### Milestone Record: Course 01 (Corporate & Financial Accounting - `bcom_acc`) Month 2 Block 7 Complete (Days 31-35)
- **Agent**: AGENT-501 (Branch B - Commerce & IoT)
- **Branch**: `agent/branch-b-curriculum-commerce-iot` (Commit `4e376a68`)
- **Scope**: Days 31–35 (5 Days, 25 Parts)
  - **Day 31**: Ind AS 115 / IFRS 15: Revenue from Contracts with Customers & 5-Step Model (3,254 words).
  - **Day 32**: Ind AS 116 / IFRS 16: Leases, Single Lessee Model, ROU Assets & P&L Front-Loading (3,146 words).
  - **Day 33**: Ind AS 113 / IFRS 13: Fair Value Measurement, Hierarchy Levels 1-3 & Valuation Framework (3,368 words).
  - **Day 34**: Ind AS 109 / IFRS 9: Financial Instruments, 3-Stage ECL Impairment & Hedge Accounting (3,411 words).
  - **Day 35**: Milestone 7 Capstone: Enterprise Financial Controller Ind AS Compliance & Complex Financial Statements Suite (3,079 words). Emitted confirmation: `ENTERPRISE_CONTROLLER_IND_AS_SUITE_PASS`.
- **Invariants**: 100% adherence to 5-part architecture, >= 580 words per part, >= 3,000 words per day, `check.answer: 0`, `check.answerIndex: 0`, Gate v2 visual envelopes in `src/lib/data/lessonVisuals/bcom-accounting/day-31.json` through `day-35.json` (ledger-sheet template with balanced postings and SHA-256 code hashes).
- **Verification**: All 12 tests in `tests/bcom_accounting_days31_35_expansion.test.ts` passed. All 87 tests in `tests/bcom_finance_accounting_long_lessons.test.ts` passed. `npx tsc --noEmit` exited cleanly with 0 errors. Pushed to remote branch.
"""

if "Course 01 (Corporate & Financial Accounting - `bcom_acc`) Month 2 Block 7" not in pm_content:
    with open(pm_path, "a", encoding="utf-8") as f:
        f.write("\n" + block7_entry.strip() + "\n")
    print("Appended Block 7 to PROJECT_MEMORY.md")
else:
    print("Block 7 already noted in PROJECT_MEMORY.md")

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
            # Mark TASK-1866 to TASK-1870 as Completed
            if tid in [f"TASK-{i}" for i in range(1866, 1871)]:
                r[4] = "Completed"
        rows.append(r)

# Register Block 8 tasks TASK-1871 to TASK-1875 as Active
existing_tids = {r[0].strip() for r in rows if r}
block8_tasks = [
    ("TASK-1871", "bcom_acc Day 36: Ind AS 102 Share-Based Payments (ESOPs, SARs, Equity vs Cash-Settled)", "Course 01 Block 8", "AGENT-501", "Active"),
    ("TASK-1872", "bcom_acc Day 37: Ind AS 12 Income Taxes & Balance Sheet Deferred Tax (DTA/DTL)", "Course 01 Block 8", "AGENT-501", "Active"),
    ("TASK-1873", "bcom_acc Day 38: Ind AS 33 Earnings Per Share (Basic, Diluted EPS & Treasury Stock)", "Course 01 Block 8", "AGENT-501", "Active"),
    ("TASK-1874", "bcom_acc Day 39: Ind AS 37 Provisions, Contingent Liabilities & Restructuring Reserves", "Course 01 Block 8", "AGENT-501", "Active"),
    ("TASK-1875", "bcom_acc Day 40: Milestone 8 Capstone: Corporate Tax, Equity & Capital Reporting Simulator", "Course 01 Block 8", "AGENT-501", "Active"),
]

for t in block8_tasks:
    if t[0] not in existing_tids:
        rows.append(list(t))

with open(tasks_csv_path, "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(fieldnames)
    writer.writerows(rows)
print("Updated agent_tasks.csv (TASK-1866..1870 Completed, TASK-1871..1875 Active)")

# 3. Update multi_agent_control.csv
mac_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
mac_rows = []
with open(mac_path, "r", encoding="utf-8", newline="") as f:
    reader = csv.reader(f)
    header = next(reader)
    for r in reader:
        if r and len(r) >= 3 and r[0].strip() == "AGENT-501":
            r[2] = "Active: Course 01 bcom_acc Block 8 (Days 36-40)"
        mac_rows.append(r)

with open(mac_path, "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(header)
    writer.writerows(mac_rows)
print("Updated multi_agent_control.csv for AGENT-501")
