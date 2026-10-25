import re

file_path = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\src\lib\data\bcomEcomLongLessons.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

days = [int(m.group(1)) for m in re.finditer(r'[\'"]?day[\'"]?\s*:\s*(\d+)', text)]
print('Total day matches:', len(days))
print('Days list:', sorted(set(days)))
