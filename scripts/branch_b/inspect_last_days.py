import re

with open("src/lib/data/bcomDmktLongLessons.ts", "r", encoding="utf-8") as f:
    c = f.read()

matches = list(re.finditer(r'"day":\s*(\d+)', c))
print(f"Total matches: {len(matches)}")
for m in matches[-10:]:
    print(f"Match at {m.start()}: day {m.group(1)}")
