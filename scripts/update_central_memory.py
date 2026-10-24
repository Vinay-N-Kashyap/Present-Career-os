# scripts/update_central_memory.py
import sys
import os
import datetime

sys.stdout.reconfigure(encoding="utf-8")

memory_dir = r"C:\Users\Admin\Desktop\projects\memory of agent"
project_memory_file = os.path.join(memory_dir, "PROJECT_MEMORY.md")
agent_tasks_file = os.path.join(memory_dir, "agent_tasks.csv")
control_file = os.path.join(memory_dir, "multi_agent_control.csv")

now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
date_str = datetime.datetime.now().strftime("%Y-%m-%d")
time_str = datetime.datetime.now().strftime("%H:%M:%S")

# 1. Update PROJECT_MEMORY.md
milestone_entry = f"""
### Milestone Update ({now_str}) - Course 06 (bcom_law) Month 2 Block 10 (Days 46-50 & Milestone 10 Capstone) 100% COMPLETE & PUSHED
- **Branch**: agent/branch-b-curriculum-commerce-iot in workspace Present-Career-os-commerce
- **Commit**: 08f76397
- **Scope Completed**: Course 06: Corporate Law, IBC & Compliance (bcom_law) Month 2 Block 10 (Days 46-50):
  - **Day 46**: UNCITRAL Model Law on Cross-Border Insolvency & Centre of Main Interests (COMI) (3,203 words).
  - **Day 47**: Foreign Main vs. Foreign Non-Main Proceedings, Establishment Verification & Section 234/235 Treaties (3,313 words).
  - **Day 48**: Cross-Border Asset Recovery, Extraterritorial Discovery & Article 21 Discretionary Relief (3,502 words).
  - **Day 49**: Cross-Border Enterprise Group Insolvency, Judicial Cooperation Protocols & Joint Hearings (3,162 words).
  - **Day 50**: 🏆 Milestone 10 Capstone: Global Cross-Border Insolvency & Multinational Asset Shield Simulator (3,166 words) - Certifies `GLOBAL_CROSS_BORDER_INSOLVENCY_SHIELD_PASS`.
- **Verification Metrics**:
  - **Total Block 10 Spoken Word Count**: 16,346 words across 25 parts (All 25 parts >= 580 words; all 5 days >= 3,000 words).
  - **Python Standard Library Code**: 25 standalone pure-Python snippets executing in <2s with 100% exact stdout match.
  - **Gate v2 Visual JSON Envelopes**: day-46.json through day-50.json generated with dual-padded filenames, 4 steps each, and bound SHA-256 code hashes.
  - **TypeScript Compilation**: `npx tsc --noEmit` exited 0 with 0 errors.
  - **Unit Tests**: `tests/bcom_law_days46_50_expansion.test.ts` passed 12/12 tests; `tests/bcom_ban_law_long_lessons.test.ts` passed 51/51 tests.
- **Course 06 (bcom_law) Status**: **50 / 60 Days Complete (83.3%)** (Only Days 51-60 remaining).
"""

with open(project_memory_file, "a", encoding="utf-8") as f:
    f.write(milestone_entry)
print("Appended milestone to PROJECT_MEMORY.md")

# 2. Append to agent_tasks.csv
tasks = [
    f'TASK-1846,{date_str},{time_str},COMPLETED,Course 06 (bcom_law),Agent Branch B,"Day 46: UNCITRAL Model Law on Cross-Border Insolvency & COMI Determination (Articles 2, 16, 17)",python,scripts/bcom_law_day46.json,Completed,agent/branch-b-curriculum-commerce-iot,\n',
    f'TASK-1847,{date_str},{time_str},COMPLETED,Course 06 (bcom_law),Agent Branch B,"Day 47: Foreign Main vs. Non-Main Proceedings, Article 2(f) Establishment & S.234/235 Comity",python,scripts/bcom_law_day47.json,Completed,agent/branch-b-curriculum-commerce-iot,\n',
    f'TASK-1848,{date_str},{time_str},COMPLETED,Course 06 (bcom_law),Agent Branch B,"Day 48: Cross-Border Asset Recovery, Norwich Pharmacal Discovery & Art 21 Discretionary Relief",python,scripts/bcom_law_day48.json,Completed,agent/branch-b-curriculum-commerce-iot,\n',
    f'TASK-1849,{date_str},{time_str},COMPLETED,Course 06 (bcom_law),Agent Branch B,"Day 49: Cross-Border Enterprise Group Insolvency, Videocon Consolidation & JIN Joint Hearings",python,scripts/bcom_law_day49.json,Completed,agent/branch-b-curriculum-commerce-iot,\n',
    f'TASK-1850,{date_str},{time_str},COMPLETED,Course 06 (bcom_law),Agent Branch B,"Day 50: 🏆 Milestone 10 Capstone: Global Cross-Border Insolvency & Multinational Asset Shield Simulator (GLOBAL_CROSS_BORDER_INSOLVENCY_SHIELD_PASS)",python,scripts/bcom_law_day50.json,Completed,agent/branch-b-curriculum-commerce-iot,\n'
]

with open(agent_tasks_file, "a", encoding="utf-8") as f:
    for t in tasks:
        f.write(t)
print("Appended TASK-1846 through TASK-1850 to agent_tasks.csv")

# 3. Update multi_agent_control.csv
with open(control_file, "a", encoding="utf-8") as f:
    f.write(f'AGENT-501,Agent Branch B,agent/branch-b-curriculum-commerce-iot,Present-Career-os-commerce,TASK-1846..1850,Completed,{now_str},"Block 10: Days 46-50 & Milestone 10 Capstone (bcom_law) completed, tested, and pushed (commit 08f76397). Course 06 at 50/60 days.",,,,\n')
print("Updated multi_agent_control.csv")
