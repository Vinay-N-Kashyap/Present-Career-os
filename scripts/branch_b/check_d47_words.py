import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
with open('scripts/branch_b/generate_ecom_day47.py', 'r', encoding='utf-8') as f:
    text = f.read()

matches = re.findall(r'p(\d)_say\s*=\s*\[(.*?)\]\np\1_example', text, re.DOTALL)
for p_num, say_block in matches:
    items = re.findall(r'"(.*?)"', say_block, re.DOTALL)
    words = sum(len(it.split()) for it in items)
    print(f'Part {p_num}: {words} words across {len(items)} paragraphs (needs {max(0, 620-words)} more)')
