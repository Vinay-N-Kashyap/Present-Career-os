import os
import re
import glob
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Check PROJECT_MEMORY.md and BRANCH_B_TASK_ASSIGNMENT.md
memory_file = r"C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md"
assignment_file = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\BRANCH_B_TASK_ASSIGNMENT.md"

print("=== CHECKING BRANCH_B_TASK_ASSIGNMENT.md ===")
if os.path.exists(assignment_file):
    with open(assignment_file, "r", encoding="utf-8") as f:
        lines = f.readlines()
    for l in lines[:60]:
        print(l, end="")

print("\n\n=== SCANNING LONG LESSON FILES IN COMMERCE WORKTREE ===")
files = glob.glob("src/lib/data/*LongLessons*.ts") + glob.glob("src/lib/data/*30DayData*.ts")
for f_path in sorted(files):
    with open(f_path, "r", encoding="utf-8") as f:
        content = f.read()
    # find unique days
    days = set(int(m) for m in re.findall(r'[\'"]?day[\'"]?\s*:\s*(\d+)', content))
    max_day = max(days) if days else 0
    count_days = len([d for d in days if d <= 60])
    print(f"{os.path.basename(f_path):35} -> Max Day: {max_day:2d} | Valid Days Count: {count_days:2d}")
