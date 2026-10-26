import re

with open('src/lib/data/bcomDmktLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

for target in [37, 40]:
    matches = list(re.finditer(rf'day["\']?\s*:\s*{target}\b', text))
    print(f"Day {target} matches: {len(matches)}")
    for m in matches:
        start = max(0, m.start() - 50)
        end = min(len(text), m.end() + 150)
        print(f"Context around Day {target}:\n{text[start:end]}\n---")
