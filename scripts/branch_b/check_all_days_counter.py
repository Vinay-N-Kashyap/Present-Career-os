import re
import sys

with open('src/lib/data/bcomEcomLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

days = re.findall(r'["\']day["\']\s*:\s*(\d+)', text)
day_ints = [int(x) for x in days]
print(f"Quoted days count: {len(day_ints)}")
from collections import Counter
c = Counter(day_ints)
print(f"Counter: {sorted(c.items())}")
