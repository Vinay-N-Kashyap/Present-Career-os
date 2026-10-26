import sys
sys.stdout.reconfigure(encoding='utf-8')

with open("scripts/branch_b/generate_ecom_day43.py", "r", encoding="utf-8") as f:
    text = f.read()

import re
for i in range(1, 6):
    pattern = rf'p{i}_say\s*=\s*\[(.*?)\]\np{i}_example'
    match = re.search(pattern, text, re.DOTALL)
    if match:
        content = match.group(1)
        paragraphs = re.findall(r'"(.*?)"', content, re.DOTALL)
        total_text = " ".join(paragraphs)
        words = len(total_text.split())
        print(f"p{i}_say: {words} words (needs {max(0, 620 - words)} more)")
