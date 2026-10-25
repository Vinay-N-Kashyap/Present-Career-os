import re

with open('src/lib/data/bcomDmktLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = re.compile(r'coursePrefix[\'"]?\s*:\s*[\'"]bcom_dmkt[\'"].*?[\'"]?day[\'"]?\s*:\s*(\d+)', re.DOTALL)
top_days = [int(m.group(1)) for m in pattern.finditer(text)]
print(f"Top-level lesson days count: {len(top_days)}")
print(f"Days: {top_days}")

title_pattern = re.compile(r'coursePrefix[\'"]?\s*:\s*[\'"]bcom_dmkt[\'"].*?[\'"]?day[\'"]?\s*:\s*(\d+).*?[\'"]?title[\'"]?\s*:\s*[\'"](.*?)[\'"]', re.DOTALL)
lessons = title_pattern.findall(text)
for d, t in lessons:
    print(f"Day {d}: {t[:60]}")
