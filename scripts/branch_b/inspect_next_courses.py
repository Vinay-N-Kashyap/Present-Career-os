# -*- coding: utf-8 -*-
import os
import re

data_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\src\lib\data"
files = [
    'bcomAudLongLessons.ts',
    'bcomBanLongLessons.ts',
    'bcomDmktLongLessons.ts',
    'bcomEcomLongLessons.ts',
    'bcomScrmLongLessons.ts'
]

print("=== Next Assigned Courses Status ===")
for f in files:
    path = os.path.join(data_dir, f)
    if os.path.exists(path):
        text = open(path, encoding='utf-8').read()
        days = sorted(set(map(int, re.findall(r'day[\'"]?\s*:\s*(\d+)', text))))
        print(f"{f:25} -> {len(days)} days (min={min(days) if days else 0}, max={max(days) if days else 0})")
