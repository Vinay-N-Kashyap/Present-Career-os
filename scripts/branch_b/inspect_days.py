import json
import re

content = open("src/lib/data/bcomBanLongLessons.ts", "r", encoding="utf-8").read()
# Find all occurrences of "day": X
matches = re.findall(r'"day":\s*(\d+)', content)
print("Found days:", [int(m) for m in matches])
print("Count:", len(matches))
