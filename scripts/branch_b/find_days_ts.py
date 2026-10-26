with open("src/lib/data/bcomEcomLongLessons.ts", "r", encoding="utf-8") as f:
    text = f.read()

import re
matches = list(re.finditer(r'\{\s*"day":\s*(\d+)', text))
for m in matches:
    d = int(m.group(1))
    print(f"Found Day {d}")
