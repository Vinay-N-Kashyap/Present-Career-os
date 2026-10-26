import sys

sys.stdout.reconfigure(encoding='utf-8')

with open("scripts/branch_b/generate_ecom_day54.py", "r", encoding="utf-8") as f:
    lines = f.readlines()

print(f"Total lines in generate_ecom_day54.py: {len(lines)}")
for l in lines[30:90]:
    print(l, end="")
