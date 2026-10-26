file_path = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\src\lib\data\bcomEcomLongLessons.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.rfind('"day": 30')
print(text[idx-50:idx+600])
