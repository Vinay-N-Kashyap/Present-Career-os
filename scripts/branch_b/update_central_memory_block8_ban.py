# -*- coding: utf-8 -*-
"""
Update central memory files for Block 8 (bcom_ban Days 36-40):
- C:/Users/Admin/Desktop/projects/memory of agent/agent_tasks.csv
- C:/Users/Admin/Desktop/projects/memory of agent/PROJECT_MEMORY.md
"""

import os
import datetime

memory_dir = r"C:\Users\Admin\Desktop\projects\memory of agent"
tasks_csv_path = os.path.join(memory_dir, "agent_tasks.csv")
project_memory_path = os.path.join(memory_dir, "PROJECT_MEMORY.md")

commit_hash = "17d5855a"
now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

new_tasks = [
    ('TASK-2103', 'bcom_ban Day 36: Bank Treasury Architecture: Integrated Treasury Operations, Dealing Room Protocols, Front-Mid-Back Office Segregation & CRR / SLR Compliance', 'Completed', commit_hash, 'Present-Career-os-commerce', 'agent/branch-b-curriculum-commerce-iot', now_str),
    ('TASK-2104', 'bcom_ban Day 37: Money Market Operations & Short-Term Funding: Call/Notice Money, Commercial Paper (CP), Certificates of Deposit (CD) & Tri-Party Repo (TREPS)', 'Completed', commit_hash, 'Present-Career-os-commerce', 'agent/branch-b-curriculum-commerce-iot', now_str),
    ('TASK-2105', 'bcom_ban Day 38: Sovereign Debt & Government Securities (G-Sec) Management: Primary Auctions, Yield Curves, NDS-OM Platform & Modified Duration Risk', 'Completed', commit_hash, 'Present-Career-os-commerce', 'agent/branch-b-curriculum-commerce-iot', now_str),
    ('TASK-2106', 'bcom_ban Day 39: Asset-Liability Management (ALM) & Interest Rate Risk: Structural Liquidity Statements, Dynamic Duration Gap Modeling & Earning at Risk (EaR) Simulations', 'Completed', commit_hash, 'Present-Career-os-commerce', 'agent/branch-b-curriculum-commerce-iot', now_str),
    ('TASK-2107', 'bcom_ban Day 40: Milestone 8 Capstone: Institutional Treasury Dealing Room, ALM Liquidity Crisis & Sovereign Yield Curve Shock War Room Simulator', 'Completed', commit_hash, 'Present-Career-os-commerce', 'agent/branch-b-curriculum-commerce-iot', now_str),
]

# Append to agent_tasks.csv
with open(tasks_csv_path, 'a', encoding='utf-8') as f:
    for task_id, title, status, c_hash, worktree, branch, t_time in new_tasks:
        f.write(f'{task_id},"{title}",{status},{c_hash},{worktree},{branch},{t_time}\n')

print(f"Appended TASK-2103..2107 to {tasks_csv_path}")

# Append to PROJECT_MEMORY.md
memory_entry = f"""

### Session Update: 2026-10-25 (Branch B - Commerce Month 2 Expansion)
- **Course**: Course 05: Banking, Treasury & Credit Operations (`bcom_ban`)
- **Block**: Month 2 Block 8 (Days 36–40 & Milestone 8 Capstone)
- **Tasks Logged**: `TASK-2103` to `TASK-2107`
- **Worktree**: `Present-Career-os-commerce` (Branch `agent/branch-b-curriculum-commerce-iot`)
- **Commit Hash**: `{commit_hash}`
- **Curriculum Delivered**:
  - **Day 36**: Bank Treasury Architecture: Integrated Treasury Operations, Dealing Room Protocols, Front-Mid-Back Office Segregation & CRR / SLR Compliance (3,315 words, all 5 parts >= 600w).
  - **Day 37**: Money Market Operations & Short-Term Funding: Call/Notice Money, Commercial Paper (CP), Certificates of Deposit (CD) & Tri-Party Repo (TREPS) (3,183 words, all 5 parts >= 600w).
  - **Day 38**: Sovereign Debt & Government Securities (G-Sec) Management: Primary Auctions, Yield Curves, NDS-OM Platform & Modified Duration Risk (3,192 words, all 5 parts >= 600w).
  - **Day 39**: Asset-Liability Management (ALM) & Interest Rate Risk: Structural Liquidity Statements, Dynamic Duration Gap Modeling & Earning at Risk (EaR) Simulations (3,294 words, all 5 parts >= 600w).
  - **Day 40**: Milestone 8 Capstone: Institutional Treasury Dealing Room, ALM Liquidity Crisis & Sovereign Yield Curve Shock War Room Simulator (3,200 words, all 5 parts >= 600w).
- **Total Block Words**: 16,184 words added (avg 3,236.8 words/day, all 25 parts >= 600w).
- **Visuals**: On-disk Gate v2 envelopes `day-36.json` through `day-40.json` generated in `src/lib/data/lessonVisuals/bcom_ban/` with `funnel` template, zero numeric digits in captions (`!/\\d/`), and SHA-256 bindings.
- **Verification**:
  - `tests/bcom_ban_days36_40_expansion.test.ts` (6/6 pass, 100%).
  - `tests/bcom_ban_days31_35_expansion.test.ts` (6/6 pass, 100%).
  - Full `tests/bcom_ban_law_long_lessons.test.ts` suite (51/51 pass, 100%).
  - `npx tsc --noEmit` exited code 0 with 0 errors across the entire repository.
- **Status of Course 05 (`bcom_ban`)**: **40 / 60 Days Complete (66.7%)**.
- **Next Target**: Block 9 (Days 41–45 & Milestone 9 Capstone: Foreign Exchange Operations, Cross-Border Trade Finance, FEMA Compliance & Nostro/Vostro Account Management).
"""

with open(project_memory_path, 'a', encoding='utf-8') as f:
    f.write(memory_entry)

print(f"Updated {project_memory_path} with Block 8 delivery record!")
