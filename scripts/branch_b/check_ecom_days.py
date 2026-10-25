import re

with open("src/lib/data/bcomEcomLongLessons.ts", "r", encoding="utf-8") as f:
    text = f.read()

days = [int(x) for x in re.findall(r'"day":\s*(\d+)', text)]
print("Total days in bcomEcomLongLessons.ts:", len(days))
print("Max day:", max(days) if days else 0)
print("Days list:", days)
