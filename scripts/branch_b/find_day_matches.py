import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/data/bcomEcomLongLessons.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    for m in re.finditer(r'(?:[\'"]day[\'"]|\bday)\s*:\s*(\d+)', line):
        val = int(m.group(1))
        if val in [51, 52, 53, 54, 55]:
            print(f'Line {idx+1}: matched {val} -> {line.strip()[:100]}')
