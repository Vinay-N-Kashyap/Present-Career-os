import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/data/bcomEcomLongLessons.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f'Total lines: {len(lines)}')

# Let's find occurrences of "day: 51" or '"day": 51'
for idx, line in enumerate(lines):
    if '51' in line and ('day' in line.lower()):
        print(f'Line {idx+1}: {line.strip()[:80]}')
    if '55' in line and ('day' in line.lower()):
        print(f'Line {idx+1}: {line.strip()[:80]}')
