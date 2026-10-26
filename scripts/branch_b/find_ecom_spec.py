import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('BRANCH_B_TASK_ASSIGNMENT.md', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'bcom_ecom', text, re.IGNORECASE)]
for idx in matches:
    print('--- MATCH ---')
    print(text[idx:idx+800])
