file_path = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\scripts\branch_b\generate_ecom_day37.py'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines[295:315], start=296):
    print(f"{i}: {repr(l)}")
