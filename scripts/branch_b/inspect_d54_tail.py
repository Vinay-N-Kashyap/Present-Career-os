import sys

sys.stdout.reconfigure(encoding='utf-8')

with open("scripts/branch_b/generate_ecom_day54.py", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, l in enumerate(lines[-50:]):
    print(f"{len(lines)-50+i}: {l}", end="")
