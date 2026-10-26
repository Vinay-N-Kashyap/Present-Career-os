file_path = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\src\lib\data\longLessons.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('export interface LongLesson {')
print(text[idx:idx+600])
