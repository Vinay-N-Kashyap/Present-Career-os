import os

file_path = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\scripts\branch_b\generate_ecom_day33.py'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

print('Length of existing generate_ecom_day33.py:', len(text))
print(text[:500])
