import re

file_path = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\src\lib\data\bcomEcomLongLessons.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

print('File length in chars:', len(text))

# Find all occurrences of "day:" followed by integer
day_matches = list(re.finditer(r'day:\s*(\d+)', text))
print('Total day: matches:', len(day_matches))
for m in day_matches:
    start = max(0, m.start() - 50)
    end = min(len(text), m.end() + 100)
    print(f'Match at {m.start()}:')
    print(repr(text[start:end]))
