import json
import re

with open(r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\src\lib\data\bcomEcomLongLessons.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()

day_lines = []
for i, line in enumerate(lines):
    m = re.search(r'["\']?day["\']?\s*:\s*(\d+)', line)
    if m:
        day_lines.append((i+1, int(m.group(1)), line.strip()))

print(f"Total day occurrences: {len(day_lines)}")
for ln, d, text in day_lines:
    print(f"Line {ln}: Day {d} -> {text}")
