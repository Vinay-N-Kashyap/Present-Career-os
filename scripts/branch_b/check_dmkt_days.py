import re

with open("src/lib/data/bcomDmktLongLessons.ts", "r", encoding="utf-8") as f:
    text = f.read()

days = [int(x) for x in re.findall(r'"day":\s*(\d+)', text)]
print("Total days in file:", len(days))
print("Days list:", days)
