import os
import csv
from datetime import datetime

tasks_csv = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
memory_md = r"C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md"

now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
task_row = [
    "TASK-291",
    "Block 3 Course Track Parity: Enabled Prefixes, Universal Fallback Visuals & 37 Masterclass Catalog Integration",
    "Completed",
    "Antigravity",
    now_str,
    now_str,
    "Implemented Block 3 of the sovereign runtime plan: (1) Added all 37 course prefixes to ENABLED_COURSES in enabledCourses.ts including IoT, security, systems, B.Com and business tracks, (2) Upgraded useLessonEngine.ts to generate active contextual visuals (register-bits, ledger-sheet, funnel, flow) for all pilot days and static syllabus slides eliminating visual-starved lessons, (3) Synchronized COURSES_CATALOG and COURSES_REGISTRY, (4) Verified with tests/course_track_parity.test.ts and tests/visual_loader.test.ts, (5) Re-indexed Graphify knowledge graph."
]

with open(tasks_csv, "a", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(task_row)

print("Appended TASK-291 to agent_tasks.csv")

milestone_entry = f"""* **2026-10-11 (Antigravity - 📚 BLOCK 3 COURSE TRACK PARITY & VISUAL COVERAGE COMPLETED & VERIFIED):**
  - **Item 1: Complete Visual Prefix Parity:** Expanded `ENABLED_COURSES` in `enabledCourses.ts` to include all course prefixes across software engineering, IoT, security, AI, systems, and commerce tracks (`iot_edge`, `iot_sec`, `iot_net`, `iot_emb`, `bcom_ops`, `bcom_scrm`, `bcom_ent`, `bcom_ecom`, `bcom_dmkt`, `bcom-marketing`, `bcom_ana`, `bcom-finance`, `bcom-accounting`, `bcom_ait`, `quant-systems`, `g3d`, `blockchain`, `mobile`, `design`, `fullstack-js`, `java-basics`, `excel_viz`, `git_vcs`, `soft-skills`, `comp_fund`, `ai_prompt`).
  - **Item 2: Dynamic Visual Coverage for Pilot & Static Slides:** Updated `useLessonEngine.ts` to assign `visual` and `visualKey` to all pilot slides and static syllabus slides. Dynamically mounts contextual visuals (RegisterBits for IoT/hardware, LedgerSheet for commerce/finance, Funnel for marketing/sales, Flow for systems). Eliminates blank visual cards across the curriculum.
  - **Item 3: Catalog & Registry Integrity:** Verified `COURSES_CATALOG` (37 masterclasses) and `COURSES_REGISTRY` (51 registered courses with 100% block tests).
  - **Item 4: Comprehensive Test Verification:** Created `tests/course_track_parity.test.ts` (all 3 passing). Verified with `tests/visual_loader.test.ts` (7 passing). Re-indexed Graphify AST graph.
  - **Logged under TASK-291.**
"""

with open(memory_md, "r", encoding="utf-8") as f:
    content = f.read()

target_marker = "* **2026-10-11 (Antigravity - 🎨 BLOCK 2 VISUAL ENGINE PARITY COMPLETED & VERIFIED):"
if target_marker in content:
    content = content.replace(target_marker, milestone_entry + "\n" + target_marker, 1)
    with open(memory_md, "w", encoding="utf-8") as f:
        f.write(content)
    print("Prepend milestone to PROJECT_MEMORY.md")
else:
    print("Warning: target marker not found in PROJECT_MEMORY.md")
