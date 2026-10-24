import csv
import datetime

print("=== UPDATING CENTRAL SHARED MEMORY FOR BLOCK 9 ===")

# 1. Update PROJECT_MEMORY.md
pm_path = r"C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md"
with open(pm_path, "r", encoding="utf-8") as f:
    pm_content = f.read()

block9_entry = """
### Milestone Record: Course 01 (Corporate & Financial Accounting - `bcom_acc`) Month 2 Block 9 Complete (Days 41-45)
- **Agent**: AGENT-501 (Branch B - Commerce & IoT)
- **Branch**: `agent/branch-b-curriculum-commerce-iot` (Commit `bcd4bcd0`)
- **Scope**: Days 41–45 (5 Days, 25 Parts)
  - **Day 41**: Ind AS 103 / IFRS 3: Business Combinations (Acquisition Method, Purchase Price Allocation, Tangible/Intangible Step-Ups, Section 115BAA DTL at 25.168%, and Proportionate Goodwill) (3,028 words). Emitted confirmation: `IND_AS_103_BUSINESS_COMBINATIONS_PASS`.
  - **Day 42**: Ind AS 110 / IFRS 10: Consolidated Financial Statements (Single Control Model, Line-by-Line Aggregation, Intra-Group Turnover/COGS Elimination, Downstream Unrealized Inventory Profit Stripping, Financing Eliminations & NCI Profit Attribution) (3,094 words). Emitted confirmation: `IND_AS_110_CONSOLIDATION_ELIMINATIONS_PASS`.
  - **Day 43**: Ind AS 111 / IFRS 11: Joint Arrangements & Ind AS 28: Investments in Associates (Joint Operation Direct Asset/Expense Recognition, Equity Method Single-Line Accounting & Downstream Unrealized Profit Elimination) (3,000 words). Emitted confirmation: `IND_AS_111_JOINT_ARRANGEMENTS_EQUITY_METHOD_PASS`.
  - **Day 44**: Ind AS 112 / IFRS 12: Disclosure of Interests in Other Entities (Material NCI Subsidiary Schedules, Restricted Cash Banking Covenants, Material Associate Disclosures & Unconsolidated Structured Entity Maximum Loss Exposure) (3,071 words). Emitted confirmation: `IND_AS_112_GROUP_DISCLOSURES_SUITE_PASS`.
  - **Day 45**: Milestone 9 Capstone: Multi-National Enterprise Group Consolidation & M&A Reporting Simulator (3,045 words). Emitted confirmation: `GROUP_CONSOLIDATION_MA_SUITE_PASS`.
- **Invariants**: 100% adherence to 5-part architecture, >= 580 words per part, >= 3,000 words per day, `check.answer: 0`, `check.answerIndex: 0`, Gate v2 visual envelopes in `src/lib/data/lessonVisuals/bcom-accounting/day-41.json` through `day-45.json` (ledger-sheet template with balanced postings and SHA-256 code hashes).
- **Verification**: All 12 tests in `tests/bcom_accounting_days41_45_expansion.test.ts` passed. All 112 tests across legacy and regression test suites passed. `npx tsc --noEmit` exited cleanly with 0 errors. Pushed to remote branch `agent/branch-b-curriculum-commerce-iot`.
"""

if "Course 01 (Corporate & Financial Accounting - `bcom_acc`) Month 2 Block 9" not in pm_content:
    with open(pm_path, "a", encoding="utf-8") as f:
        f.write("\n" + block9_entry.strip() + "\n")
    print("Appended Block 9 to PROJECT_MEMORY.md")
else:
    print("Block 9 already noted in PROJECT_MEMORY.md")

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
            # Mark TASK-1876 to TASK-1880 as Completed
            if tid in [f"TASK-{i}" for i in range(1876, 1881)]:
                r[4] = "Completed"
        rows.append(r)

# Register Block 10 tasks TASK-1881 to TASK-1885 as Active
existing_tids = {r[0].strip() for r in rows if r}
block10_tasks = [
    ("TASK-1881", "bcom_acc Day 46: Financial Statement Diagnostics & Advanced Ratio Analysis (Liquidity, Solvency & Working Capital Cycles)", "Course 01 Block 10", "AGENT-501", "Active"),
    ("TASK-1882", "bcom_acc Day 47: DuPont Analysis & Return on Equity (ROE) Decomposition (3-Stage & 5-Stage Extended Models)", "Course 01 Block 10", "AGENT-501", "Active"),
    ("TASK-1883", "bcom_acc Day 48: Operating & Financial Leverage Analysis (DOL, DFL, DCL, EBIT-EPS Indifference & Financial Distress Models)", "Course 01 Block 10", "AGENT-501", "Active"),
    ("TASK-1884", "bcom_acc Day 49: Quality of Earnings & Forensic Accounting Diagnostics (Beneish M-Score, Sloan Accrual Anomaly & Cash Flow Realism)", "Course 01 Block 10", "AGENT-501", "Active"),
    ("TASK-1885", "bcom_acc Day 50: Milestone 10 Capstone: Advanced Corporate Financial Diagnostics & Forensic Audit Simulator", "Course 01 Block 10", "AGENT-501", "Active"),
]

for t in block10_tasks:
    if t[0] not in existing_tids:
        rows.append(list(t))

with open(tasks_csv_path, "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(fieldnames)
    writer.writerows(rows)
print("Updated agent_tasks.csv (TASK-1876..1880 Completed, TASK-1881..1885 Active)")

# 3. Update multi_agent_control.csv
mac_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
mac_rows = []
with open(mac_path, "r", encoding="utf-8", newline="") as f:
    reader = csv.reader(f)
    header = next(reader)
    for r in reader:
        if r and len(r) >= 3 and r[0].strip() == "AGENT-501":
            r[2] = "Active: Course 01 bcom_acc Block 10 (Days 46-50)"
        mac_rows.append(r)

with open(mac_path, "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(header)
    writer.writerows(mac_rows)
print("Updated multi_agent_control.csv for AGENT-501")
