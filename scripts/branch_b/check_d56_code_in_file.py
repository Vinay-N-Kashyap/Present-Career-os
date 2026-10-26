import re

with open('src/lib/data/bcomEcomLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

m56 = re.search(r'("day": 56,.*?"day": 57,)', text, re.DOTALL)
if m56:
    chunk56 = m56.group(1)
    codes = re.findall(r'"code":\s*"([^"\\]*(?:\\.[^"\\]*)*)"', chunk56)
    print("Day 56 in file code count:", len(codes))
    if codes:
        print("Day 56 Part 1 code in file preview:")
        print(codes[0][:200].replace('\\n', '\n'))
