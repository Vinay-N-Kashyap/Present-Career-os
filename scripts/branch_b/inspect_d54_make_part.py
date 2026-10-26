import sys

sys.stdout.reconfigure(encoding='utf-8')

with open("scripts/branch_b/generate_ecom_day54.py", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i in range(10, 30):
    print(f"{i}: {lines[i]}", end="")
