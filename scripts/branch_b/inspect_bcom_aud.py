# -*- coding: utf-8 -*-
import os
import re

ts_path = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\src\lib\data\bcomAudLongLessons.ts"
with open(ts_path, 'r', encoding='utf-8') as f:
    text = f.read()

print("File size:", len(text))
prefix = re.search(r'["\']?coursePrefix["\']?\s*:\s*["\']([^"\']+)["\']', text)
print("coursePrefix:", prefix.group(1) if prefix else "None")

export_name = re.search(r'export\s+const\s+(\w+)', text)
print("Export name:", export_name.group(1) if export_name else "None")

days = sorted(set(map(int, re.findall(r'["\']?day["\']?\s*:\s*(\d+)', text))))
print(f"Days: count={len(days)}, min={min(days) if days else 0}, max={max(days) if days else 0}")

# Check sample day (e.g. Day 30)
d30 = re.search(r'["\']?day["\']?\s*:\s*30\b.*?(?=day["\']?\s*:|\Z)', text, re.DOTALL)
if d30:
    block = d30.group(0)
    title = re.search(r'["\']?title["\']?\s*:\s*["\']([^"\']+)["\']', block)
    print("Day 30 Title:", title.group(1) if title else "None")
    minutes = re.search(r'["\']?minutes["\']?\s*:\s*(\d+)', block)
    print("Day 30 Minutes:", minutes.group(1) if minutes else "None")
