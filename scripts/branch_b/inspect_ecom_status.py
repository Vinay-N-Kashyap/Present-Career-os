import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/data/bcomEcomLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Match top-level day properties in lesson objects
lesson_days = re.findall(r'(?:{\s*|\n\s*)"?day"?\s*:\s*(\d+)', text)
print(f"Total lesson day matches: {len(lesson_days)}")
counts = {}
for d in lesson_days:
    val = int(d)
    counts[val] = counts.get(val, 0) + 1

print("Days and counts:", sorted(counts.items()))
