import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/data/bcomEcomLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

days = [int(m) for m in re.findall(r'(?:[\'"]day[\'"]|\bday)\s*:\s*(\d+)', text)]
print('Total day entries:', len(days))
print('Days present:', sorted(list(set(days))))
