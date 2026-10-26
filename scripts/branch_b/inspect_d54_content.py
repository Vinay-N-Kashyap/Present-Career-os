import sys

sys.stdout.reconfigure(encoding='utf-8')

with open("scripts/branch_b/generate_ecom_day54.py", "r", encoding="utf-8") as f:
    text = f.read()

import re
contents = re.findall(r'p\d_content\s*=\s*[\'"]{3}(.*?)[\'"]{3}', text, re.DOTALL)
print(f"Found {len(contents)} content blocks")
for i, c in enumerate(contents):
    words = len(c.strip().split())
    print(f"Content {i+1}: {words} words")
