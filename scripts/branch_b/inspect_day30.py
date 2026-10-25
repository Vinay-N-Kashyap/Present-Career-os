file_path = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\src\lib\data\bcomEcomLongLessons.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Find Day 30 start
idx = text.rfind('"day": 30')
if idx == -1:
    idx = text.rfind("'day': 30")
if idx == -1:
    idx = text.rfind("day: 30")

print('Day 30 found at index:', idx)
print(text[idx-50:idx+400])
