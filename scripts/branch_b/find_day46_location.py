import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
with open('src/lib/data/bcomEcomLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

matches = list(re.finditer(r'[\'"]?day[\'"]?\s*:\s*46\b', text))
print(f"Matches for day 46: {len(matches)}")
for m in matches:
    print("--- MATCH ---")
    print(text[m.start()-50:m.end()+300])

# Also check where Day 45 ends
m45 = list(re.finditer(r'[\'"]?day[\'"]?\s*:\s*45\b', text))
print(f"\nMatches for day 45: {len(m45)}")
for m in m45:
    print("--- MATCH 45 ---")
    print(text[m.start()-50:m.end()+300])
