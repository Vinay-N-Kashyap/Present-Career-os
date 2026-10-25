import re

file_path = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\src\lib\data\bcomEcomLongLessons.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Find all titles and days
pattern = r'[\'"]?day[\'"]?\s*:\s*(\d+)[\s\S]*?[\'"]?title[\'"]?\s*:\s*[\'"]([^\'"]+)[\'"]'
for m in re.finditer(pattern, text):
    day = int(m.group(1))
    title = m.group(2)
    if day >= 20 and day <= 30:
        print(f"Day {day}: {title}")
