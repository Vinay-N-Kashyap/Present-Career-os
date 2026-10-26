with open('src/lib/data/bcomEcomLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = list(re.finditer(r'["\']?day["\']?:\s*46\b', text))
print(f"Total occurrences of day 46: {len(matches)}")
for idx, m in enumerate(matches):
    start = max(0, m.start() - 50)
    end = min(len(text), m.start() + 200)
    print(f"Occurrence {idx+1} at {m.start()}:")
    print(text[start:end])
