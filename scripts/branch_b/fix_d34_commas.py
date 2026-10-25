file_path = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\scripts\branch_b\generate_ecom_day34.py'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('security vulnerabilities.",\n,\n', 'security vulnerabilities.",\n')
text = text.replace('multi-tenant inventory engineering.",\n,\n', 'multi-tenant inventory engineering.",\n')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Cleaned up standalone commas.")
