file_path = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\scripts\branch_b\test_ecom_day32_codes.py'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

print('Length:', len(text))
print(text[:1500])
