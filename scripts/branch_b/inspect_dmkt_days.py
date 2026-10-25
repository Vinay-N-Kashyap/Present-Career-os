import re

with open('src/lib/data/bcomDmktLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

matches = re.findall(r'"day":\s*(\d+)', text)
if not matches:
    matches = re.findall(r'day:\s*(\d+)', text)

found = sorted(list(set(int(m) for m in matches)))
print('Total days found in bcomDmktLongLessons.ts:', len(found))
print('Days range:', min(found) if found else None, 'to', max(found) if found else None)
print('Days list:', found)
