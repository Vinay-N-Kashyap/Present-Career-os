import re

with open('src/lib/data/bcomEcomLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

for d in range(46, 51):
    m = re.search(rf'"day":\s*{d},.*?"minutes":\s*(\d+)', text, re.DOTALL)
    if m:
        print(f"In bcomEcomLongLessons.ts -> Day {d} minutes: {m.group(1)}")
    else:
        print(f"In bcomEcomLongLessons.ts -> Day {d} NOT FOUND with minutes regex")
