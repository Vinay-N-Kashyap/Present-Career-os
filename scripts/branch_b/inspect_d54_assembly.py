import sys

sys.stdout.reconfigure(encoding='utf-8')

with open("scripts/branch_b/generate_ecom_day54.py", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i in range(max(0, len(lines)-70), len(lines)):
    print(f"{i}: {lines[i]}", end="")
