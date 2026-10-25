import re

with open("src/lib/data/bcomDmktLongLessons.ts", "r", encoding="utf-8") as f:
    text = f.read()

days = sorted(set(int(x) for x in re.findall(r'[\'\"]?day[\'\"]?:\s*(\d+)', text)))
print("Unique days in bcomDmktLongLessons.ts:", days)
print(f"Max day: {max(days) if days else 0}")
