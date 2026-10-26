import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/data/bcomDmktLongLessons.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if any(f'"day": {d}' in l for d in range(56, 61)):
        print(l.strip())
        for j in range(1, 10):
            if 'title' in lines[i+j]:
                print(lines[i+j].strip())
                break
