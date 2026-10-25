import json
import re

with open("src/lib/data/bcomDmktLongLessons.ts", "r", encoding="utf-8") as f:
    c = f.read()

# Let's find Day 45 in the ts file
idx = c.rfind('"day": 45')
day45_str = c[idx:]
# The end of day 45 is the last closing bracket before ];
print("Snippet of day 45:")
print(day45_str[:500])

# Parse day 45 JSON
# Find opening { before "day": 45
open_brace = c.rfind('{', 0, idx)
# Find matching close brace
close_brace = c.rfind('}')
d45_json_str = c[open_brace:close_brace+1]
d45 = json.loads(d45_json_str)

for idx, p in enumerate(d45["parts"]):
    words = len(" ".join(p["say"]).split())
    print(f"TS File Day 45 Part {idx+1}: {words} words")
