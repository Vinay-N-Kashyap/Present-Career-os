import json
import re

with open("src/lib/data/bcomDmktLongLessons.ts", "r", encoding="utf-8") as f:
    c = f.read()

# Let's find Day 40 end
idx41 = c.find('{\n  "coursePrefix": "bcom_dmkt",\n  "day": 41,')
if idx41 == -1:
    idx41 = c.find('{\n  "day": 41,')
if idx41 == -1:
    idx41 = c.find('"day": 41')
    idx41 = c.rfind('{', 0, idx41)

print("Day 41 starts at:", idx41)
days_41_45_str = "[" + c[idx41:].rstrip()
if days_41_45_str.endswith("];"):
    days_41_45_str = days_41_45_str[:-2] + "]"
elif days_41_45_str.endswith(";"):
    days_41_45_str = days_41_45_str[:-1]

try:
    days_list = json.loads(days_41_45_str)
    print(f"Successfully parsed {len(days_list)} days from ts file!")
    for d in days_list:
        print(f"\nDay {d['day']}: {d['title']}")
        for idx, p in enumerate(d.get("parts", [])):
            words = len(" ".join(p["say"]).split())
            print(f"  Part {idx+1}: {words} words")
except Exception as e:
    print("JSON parse error:", e)
