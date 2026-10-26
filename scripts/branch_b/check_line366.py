file_path = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\scripts\branch_b\generate_ecom_day32.py'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines[350:380], start=351):
    print(f"{i}: {repr(l)}")
