import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/data/bcomEcomLongLessons.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    m = re.search(r'(?:[\'"]day[\'"]|\bday)\s*:\s*(\d+)', line)
    if m:
        day_num = int(m.group(1))
        if day_num >= 45:
            print(f'Line {idx+1}: day {day_num} -> {line.strip()[:60]}')
