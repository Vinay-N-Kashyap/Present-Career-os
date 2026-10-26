file_path = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\src\lib\data\bcomDmktLongLessons.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

print('DMKT length:', len(text))
# Check if it imports block files or if everything is in one file
lines = text.split('\n')
for line in lines[:30]:
    print(line)
