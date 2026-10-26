import re
import json

with open("src/lib/data/bcomDmktLongLessons.ts", "r", encoding="utf-8") as f:
    text = f.read()

# Let's see how days 51-55 look in the file
for d in range(51, 56):
    m = re.search(rf'("day":\s*{d},.*?)(?="day":\s*{d+1}|\];)', text, re.DOTALL)
    if m:
        snippet = m.group(1)
        title_m = re.search(r'"title":\s*"(.*?)"', snippet)
        title = title_m.group(1) if title_m else "UNKNOWN"
        parts_matches = re.findall(r'"title":\s*"(.*?)"', snippet)
        print(f"Day {d}: {title} (found {len(parts_matches)-1} parts)")
    else:
        print(f"Day {d}: NOT FOUND in regex match")
