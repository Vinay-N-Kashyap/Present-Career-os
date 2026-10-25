import re

with open('src/lib/data/bcomTaxLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Match day without quotes or with quotes: day: 1 or "day": 1
matches = re.findall(r'(?:["\']?day["\']?\s*:\s*(\d+))', text)
days = [int(m) for m in matches]
print(f"Total day occurrences: {len(days)}")
print(f"Unique days: {sorted(list(set(days)))}")
print(f"All days found: {days}")
