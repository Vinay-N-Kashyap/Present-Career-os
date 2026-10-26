file_path = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\src\lib\data\bcomEcomLongLessons.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

print('File length:', len(text))
# Print the last 500 characters
print('--- Last 500 chars ---')
print(text[-500:])
