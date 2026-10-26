import sys

sys.stdout.reconfigure(encoding='utf-8')

with open("scripts/branch_b/generate_ecom_day54.py", "r", encoding="utf-8") as f:
    text = f.read()

import re
matches = re.findall(r'p\d_\w+\s*=', text)
print("Variable definitions:", set(matches))
