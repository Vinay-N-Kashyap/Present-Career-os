import re

with open("src/lib/data/bcomEcomLongLessons.ts", "r", encoding="utf-8") as f:
    text = f.read()

matches = re.findall(r'"day":\s*(2[6-9]|30),\s*"title":\s*"([^"]+)"', text)
for d, t in matches:
    print(f"Day {d}: {t}")
