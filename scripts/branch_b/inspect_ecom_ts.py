import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
with open('src/lib/data/bcomEcomLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

matches = re.findall(r'[\'"]?day[\'"]?\s*:\s*(\d+)', text)
print(f"Total day entries found: {len(matches)}")
days = [int(x) for x in matches]
print(f"Days: {days}")

title_matches = re.findall(r'[\'"]?title[\'"]?\s*:\s*[\'"]([^\'"]+)[\'"]', text)
print(f"Sample titles ({len(title_matches)} total):")
for t in title_matches[:10]:
    print(" -", t)
