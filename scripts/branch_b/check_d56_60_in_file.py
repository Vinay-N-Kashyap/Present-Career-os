import sys

with open('src/lib/data/bcomEcomLongLessons.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if any(f'"day": {d},' in l for d in range(56, 61)):
        print(f"Line {i+1}: {l.strip()}")
        for j in range(1, 10):
            if '"title":' in lines[i+j]:
                print(f"  {lines[i+j].strip()}")
                break
