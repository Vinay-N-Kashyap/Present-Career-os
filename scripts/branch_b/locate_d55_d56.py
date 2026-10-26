with open('src/lib/data/bcomEcomLongLessons.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

d55_idx = None
d56_idx = None
for i, l in enumerate(lines):
    if '"day": 55,' in l:
        d55_idx = i
    if '"day": 56,' in l:
        d56_idx = i

print(f"Day 55 line: {d55_idx + 1}")
print(f"Day 56 line: {d56_idx + 1}")

print("\nLines between Day 55 and Day 56:")
for i in range(d56_idx - 10, d56_idx + 5):
    print(f"{i+1}: {repr(lines[i])}")
