import csv
import datetime

print("=== UPDATING CENTRAL SHARED MEMORY FOR BLOCK 8 ===")

# 1. Update PROJECT_MEMORY.md
pm_path = r"C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md"
with open(pm_path, "r", encoding="utf-8") as f:
    pm_content = f.read()

block8_entry = """
### Milestone Record: Course 01 (Corporate & Financial Accounting - `bcom_acc`) Month 2 Block 8 Complete (Days 36-40)
- **Agent**: AGENT-501 (Branch B - Commerce & IoT)
- **Branch**: `agent/branch-b-curriculum-commerce-iot` (Commit `3b8bb0df`)
- **Scope**: Days 36–40 (5 Days, 25 Parts)
  - **Day 36**: Ind AS 102 / IFRS 2: Share-Based Payments (ESOPs, SARs, Equity vs Cash-Settled, Graded Vesting IG11) (3,127 words).
  - **Day 37**: Ind AS 12 / IAS 12: Income Taxes, Balance Sheet Liability Method & Section 115BAA Deferred Taxation (25.168% rate) (3,023 words).
  - **Day 38**: Ind AS 33 / IAS 33: Earnings Per Share (Basic EPS, Diluted EPS, Treasury Stock Method & Anti-Dilution Principle) (3,170 words).
  - **Day 39**: Ind AS 37 / IAS 37: Provisions, Contingent Liabilities, Decommissioning Present Value Unwinding & Restructuring Reserves (3,104 words).
  - **Day 40**: Milestone 8 Capstone: Complex Corporate Tax, Equity & Capital Reporting Simulator (3,012 words). Emitted confirmation: `CORPORATE_TAX_EQUITY_CAPITAL_SUITE_PASS`.
- **Invariants**: 100% adherence to 5-part architecture, >= 580 words per part, >= 3,000 words per day, `check.answer: 0`, `check.answerIndex: 0`, Gate v2 visual envelopes in `src/lib/data/lessonVisuals/bcom-accounting/day-36.json` through `day-40.json` (ledger-sheet template with balanced postings and SHA-256 code hashes).
- **Verification**: All 12 tests in `tests/bcom_accounting_days36_40_expansion.test.ts` passed. All 100 tests in legacy and flagship test suites passed. `npx tsc --noEmit` exited cleanly with 0 errors. Pushed to remote branch `agent/branch-b-curriculum-commerce-iot`.
"""

if "Course 01 (Corporate & Financial Accounting - `bcom_acc`) Month 2 Block 8" not in pm_content:
    with open(pm_path, "a", encoding="utf-8") as f:
        f.write("\n" + block8_entry.strip() + "\n")
    print("Appended Block 8 to PROJECT_MEMORY.md")
else:
    print("Block 8 already noted in PROJECT_MEMORY.md")

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
            # Mark TASK-1871 to TASK-1875 as Completed
            if tid in [f"TASK-{i}" for i in range(1871, 1876)]:
                r[4] = "Completed"
        rows.append(r)

# Register Block 9 tasks TASK-1876 to TASK-1880 as Active
existing_tids = {r[0].strip() for r in rows if r}
block9_tasks = [
    ("TASK-1876", "bcom_acc Day 41: Ind AS 103 Business Combinations (Acquisition Method, Purchase Price Allocation, Goodwill/Gain on Bargain Purchase)", "Course 01 Block 9", "AGENT-501", "Active"),
    ("TASK-1877", "bcom_acc Day 42: Ind AS 110 Consolidated Financial Statements (Single Control Model, Non-Controlling Interest, Intra-Group Eliminations)", "Course 01 Block 9", "AGENT-501", "Active"),
    ("TASK-1878", "bcom_acc Day 43: Ind AS 111 Joint Arrangements (Joint Operations vs Joint Ventures & Equity Method Transition under Ind AS 28)", "Course 01 Block 9", "AGENT-501", "Active"),
    ("TASK-1879", "bcom_acc Day 44: Ind AS 112 Disclosure of Interests in Other Entities (Subsidiaries, Joint Ventures, Associates & Structured Entities)", "Course 01 Block 9", "AGENT-501", "Active"),
    ("TASK-1880", "bcom_acc Day 45: Milestone 9 Capstone: Multi-National Enterprise Group Consolidation & M&A Reporting Simulator", "Course 01 Block 9", "AGENT-501", "Active"),
]

for t in block9_tasks:
    if t[0] not in existing_tids:
        rows.append(list(t))

with open(tasks_csv_path, "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(fieldnames)
    writer.writerows(rows)
print("Updated agent_tasks.csv (TASK-1871..1875 Completed, TASK-1876..1880 Active)")

# 3. Update multi_agent_control.csv
mac_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
mac_rows = []
with open(mac_path, "r", encoding="utf-8", newline="") as f:
    reader = csv.reader(f)
    header = next(reader)
    for r in reader:
        if r and len(r) >= 3 and r[0].strip() == "AGENT-501":
            r[2] = "Active: Course 01 bcom_acc Block 9 (Days 41-45)"
        mac_rows.append(r)

with open(mac_path, "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(header)
    writer.writerows(mac_rows)
print("Updated multi_agent_control.csv for AGENT-501")
