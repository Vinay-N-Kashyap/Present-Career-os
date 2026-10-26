import sys

with open('src/lib/data/bcomEcomLongLessons.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"Total lines: {len(lines)}")
for i in range(max(0, len(lines)-250), len(lines)):
    line = lines[i].strip()
    if any(k in line for k in ['"day"', 'day:', '"title"', 'title:']):
        print(f"Line {i+1}: {line}")
