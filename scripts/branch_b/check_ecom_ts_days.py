import re

with open("src/lib/data/bcomEcomLongLessons.ts", "r", encoding="utf-8") as f:
    content = f.read()

days = [int(m) for m in re.findall(r'"day":\s*(\d+)', content)]
print(f"Days count: {len(days)}")
print(f"Days found: {sorted(list(set(days)))}")
