import sys

sys.stdout.reconfigure(encoding='utf-8')

with open("scripts/branch_b/generate_ecom_day54.py", "r", encoding="utf-8") as f:
    lines = f.readlines()

print("generate_ecom_day54.py header:")
for l in lines[:30]:
    print(l, end="")
