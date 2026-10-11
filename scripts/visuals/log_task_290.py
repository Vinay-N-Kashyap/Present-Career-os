import os
import csv
from datetime import datetime

tasks_csv = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
memory_md = r"C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md"

now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
task_row = [
    "TASK-290",
    "Block 2 Visual Engine Parity: RegisterBitsTemplate, LedgerSheetTemplate, FunnelTemplate & 17-Engine Dispatch",
    "Completed",
    "Antigravity",
    now_str,
    now_str,
    "Implemented Block 2 of the sovereign runtime plan: (1) RegisterBitsTemplate for low-level systems & IoT registers with hex/dec formatting and bit toggles, (2) LedgerSheetTemplate for double-entry bookkeeping with balanced/unbalanced invariants and running balance, (3) FunnelTemplate for conversion pipelines with stage dropoff percentages, (4) Extended LessonVisual & VisualSpec types to full 17-engine parity, (5) Wired VisualStage, visualTokens, and visualRules with shape-tapping. Verified with tests/visual_block2_templates.test.ts and tests/visual_templates.test.ts."
]

with open(tasks_csv, "a", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(task_row)

print("Appended TASK-290 to agent_tasks.csv")

milestone_entry = f"""* **2026-10-11 (Antigravity - 🎨 BLOCK 2 VISUAL ENGINE PARITY COMPLETED & VERIFIED):**
  - **Item 1: RegisterBitsTemplate Component:** Created `RegisterBitsTemplate.tsx`. Supports 8/16/32-bit registers, hex/dec values, bitmask badges, bit flags (CF, ZF, IRQ), color tones, and interactive bit tapping.
  - **Item 2: LedgerSheetTemplate Component:** Created `LedgerSheetTemplate.tsx`. Supports double-entry debit/credit journals, auto-calculated running balance, and balanced invariant badge (`✓ Balanced (Dr = Cr)` vs `⚠️ Unbalanced`).
  - **Item 3: FunnelTemplate Component:** Created `FunnelTemplate.tsx`. Displays tapered conversion pipeline stages, conversion rates from baseline, dropoff rate badges between stages, and active stage focus.
  - **Item 4: Full 17-Engine Visual Dispatch:** Updated `src/lib/types/lessonVisual.ts`, `VisualStage.tsx`, and `visualRules.ts`. Extracted tappable labels for all 3 templates and wired storyboard/diagram rendering.
  - **Item 5: Comprehensive Test Verification:** Created `tests/visual_block2_templates.test.ts` (all 4 passing). Verified with `tests/visual_templates.test.ts`. Updated Graphify AST graph.
  - **Logged under TASK-290.**
"""

with open(memory_md, "r", encoding="utf-8") as f:
    content = f.read()

target_marker = "* **2026-10-11 (Antigravity - ⚡ BLOCK 1 RUNTIME IMPLEMENTATION COMPLETED & VERIFIED):"
if target_marker in content:
    content = content.replace(target_marker, milestone_entry + "\n" + target_marker, 1)
    with open(memory_md, "w", encoding="utf-8") as f:
        f.write(content)
    print("Prepend milestone to PROJECT_MEMORY.md")
else:
    print("Warning: target marker not found in PROJECT_MEMORY.md")
