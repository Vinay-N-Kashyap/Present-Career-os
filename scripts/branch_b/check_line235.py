file_path = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\scripts\branch_b\generate_ecom_day34.py'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines[225:245], start=226):
    print(f"{i}: {repr(l)}")
