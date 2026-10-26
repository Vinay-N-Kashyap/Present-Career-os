import sys
import re
from collections import Counter

sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/data/bcomEcomLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

days = [int(m) for m in re.findall(r'(?:[\'"]day[\'"]|\bday)\s*:\s*(\d+)', text)]
counts = Counter(days)
duplicates = {d: c for d, c in counts.items() if c > 1}
print('Duplicates:', duplicates)
