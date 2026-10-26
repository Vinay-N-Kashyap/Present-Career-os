import re

with open('src/lib/data/bcomDmktLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

matches = [m.start() for m in re.finditer(r'"day":\s*59', text)]
print("Day 59 occurrences at indices:", matches)
for idx in matches:
    print("Around index:", text[idx:idx+80])
