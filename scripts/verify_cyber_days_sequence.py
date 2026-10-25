# scripts/verify_cyber_days_sequence.py
import re

with open('src/lib/data/cyberWebLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

days = [int(m) for m in re.findall(r'"day":\s*(\d+)', text)]
print(f'Found days count: {len(days)}')
print(f'Days range: {days[0]} to {days[-1]}')
assert days == list(range(1, 36)), f'Sequence mismatch! Expected 1..35, got {days}'
print('All 35 days in cyberWebLongLessons.ts are perfectly sequential 1 to 35!')
