import re

with open('src/lib/data/bcomDmktLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

matches = [int(m) for m in re.findall(r'day["\']?\s*:\s*(\d+)', text)]
print("Max day in bcomDmktLongLessons.ts:", max(matches) if matches else None)
print("Days >= 50:", [d for d in matches if d >= 50])
