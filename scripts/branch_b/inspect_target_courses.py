import os
import re

courses = [
    'bcomAnaLongLessons.ts',
    'bcomMktLongLessons.ts',
    'bcomDmktLongLessons.ts',
    'bcomEcomLongLessons.ts',
    'bcomScrmLongLessons.ts'
]

base_dir = os.path.join(os.getcwd(), 'src', 'lib', 'data')

for c in courses:
    full_path = os.path.join(base_dir, c)
    if not os.path.exists(full_path):
        print(f"File not found: {c}")
        continue
    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()
    days = re.findall(r'[\'"]?day[\'"]?\s*:\s*(\d+)', content)
    int_days = sorted(list(set(int(d) for d in days)))
    print(f"{c:25} -> {len(int_days)} days: min={min(int_days) if int_days else 0}, max={max(int_days) if int_days else 0}")
    if int_days:
        print(f"   First 5: {int_days[:5]}, Last 5: {int_days[-5:]}")
