import re

file_path = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\scripts\branch_b\generate_ecom_day37.py'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

titles = re.findall(r'p\d+_title = [^\n]+', text)
for t in titles:
    print(t)

print("Title in day37_data:", re.findall(r'"title": "[^"]+"', text)[:2])
