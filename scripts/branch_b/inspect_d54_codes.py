import sys

sys.stdout.reconfigure(encoding='utf-8')

with open("scripts/branch_b/generate_ecom_day54.py", "r", encoding="utf-8") as f:
    text = f.read()

import re
code_blocks = re.findall(r'p\d_code\s*=\s*[\'"]{3}(.*?)[\'"]{3}', text, re.DOTALL)
output_blocks = re.findall(r'p\d_output\s*=\s*[\'"]{3}(.*?)[\'"]{3}', text, re.DOTALL)

print(f"Found {len(code_blocks)} code blocks and {len(output_blocks)} output blocks")
for i, (c, o) in enumerate(zip(code_blocks, output_blocks)):
    print(f"\n--- PART {i+1} ---")
    print("Code head:", c.strip().split("\n")[:3])
    print("Output head:", o.strip().split("\n")[:2])
