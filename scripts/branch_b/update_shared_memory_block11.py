"""
Update shared memory for Course 07 Block 11 completion.
"""
import datetime
import os

now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
commit_hash = "998f5092"

tasks_file = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
mac_file = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
pm_file = r"C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md"

# 1. Update agent_tasks.csv
new_tasks = [
    f'TASK-2213,"bcom_ecom Day 51: Global Cross-Border E-Commerce, Multi-Currency Pricing, FX Hedging & Localized Checkout",Completed,{commit_hash},Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,{now_str}\n',
    f'TASK-2214,"bcom_ecom Day 52: International Trade Compliance, Landed Cost Calculation & Customs Automation",Completed,{commit_hash},Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,{now_str}\n',
    f'TASK-2215,"bcom_ecom Day 53: Cross-Border Logistics, De Minimis Thresholds & Bonded Warehousing",Completed,{commit_hash},Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,{now_str}\n',
    f'TASK-2216,"bcom_ecom Day 54: Cross-Border Consumer Rights, Cross-Border Returns, GDPR/CCPA Privacy & Localization Strategy",Completed,{commit_hash},Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,{now_str}\n',
    f'TASK-2217,"bcom_ecom Day 55: Milestone 11 Capstone: Sovereign Global Cross-Border Commerce Platform & Landed Cost Engine",Completed,{commit_hash},Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,{now_str}\n'
]

with open(tasks_file, "a", encoding="utf-8") as f:
    f.writelines(new_tasks)

print("Updated agent_tasks.csv with TASK-2213 to TASK-2217.")

# 2. Update multi_agent_control.csv
with open(mac_file, "r", encoding="utf-8") as f:
    mac_lines = f.readlines()

new_mac_lines = []
for line in mac_lines:
    if "AGENT-535" in line and ("Claimed" in line or "Active" in line or "In Progress" in line):
        parts = [p.strip() for p in line.split(",")]
        new_mac_lines.append(f"AGENT-535,bcom_ecom Days 51-55,Completed,agent/branch-b-curriculum-commerce-iot,Present-Career-os-commerce,{commit_hash},{now_str}\n")
    else:
        new_mac_lines.append(line)

new_mac_lines.append(f"AGENT-536,Branch B Enterprise Commerce Lead,Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,\"Claimed Course 07: E-Commerce Platform Architecture (bcom_ecom) Month 2 Final Block 12 (Days 56-60 & Grand Master Milestone 12 Capstone). 100% Course Graduation Target.\",Active,{now_str}\n")
new_mac_lines.append(f"AGENT-536,bcom_ecom Days 56-60,Claimed,agent/branch-b-curriculum-commerce-iot,Present-Career-os-commerce,,{now_str}\n")

with open(mac_file, "w", encoding="utf-8") as f:
    f.writelines(new_mac_lines)

print("Updated multi_agent_control.csv (AGENT-535 Completed, AGENT-536 Claimed).")

# 3. Update PROJECT_MEMORY.md
with open(pm_file, "r", encoding="utf-8") as f:
    pm_content = f.read()

milestone_entry = f"""
### Milestone 11 Completed: Course 07 (`bcom_ecom`) Month 2 Block 11 (Days 51-55) ({now_str})
- **Branch**: `agent/branch-b-curriculum-commerce-iot`
- **Worktree**: `Present-Career-os-commerce`
- **Commit**: `{commit_hash}` (pushed to `origin`)
- **Delivered Days**:
  - Day 51: Global Cross-Border E-Commerce, Multi-Currency Pricing, FX Hedging & Localized Checkout (3,175 words)
  - Day 52: International Trade Compliance, Landed Cost Calculation & Customs Automation (3,154 words)
  - Day 53: Cross-Border Logistics, De Minimis Thresholds & Bonded Warehousing (3,159 words)
  - Day 54: Cross-Border Consumer Rights, Cross-Border Returns, GDPR/CCPA Privacy & Localization Strategy (3,271 words)
  - Day 55: Milestone 11 Capstone: Sovereign Global Cross-Border Commerce Platform & Landed Cost Engine (3,197 words, minutes: 60)
- **Pedagogical Invariants**:
  - Total Words: **15,956 words** across 25 parts (All parts >= 580 words, average 638 words/part).
  - Gate v2 Visuals: `day-51.json` through `day-55.json` generated and bound to SHA-256 code hashes.
  - Socratic Invariants: All 25 checks verified with `answer: 0`, 4 options, and thorough `why` rationale.
  - Tests: `tests/bcom_ecom_days51_55_expansion.test.ts` passed 7/7 suites.
  - TypeScript: `npx tsc --noEmit` verified with 0 errors.
- **Course 07 Progress**: **55/60 Days Complete (91.67%)**!
- **Next Step**: Final Block 12 (Days 56-60 & Grand Master Milestone 12 Capstone) for 100% Graduation of Course 07 and all 7 Commerce courses of Branch B!
"""

pm_content += "\n" + milestone_entry

with open(pm_file, "w", encoding="utf-8") as f:
    f.write(pm_content)

print("Updated PROJECT_MEMORY.md with Milestone 11 record.")
