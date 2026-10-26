file_path = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\scripts\branch_b\generate_ecom_day32.py'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('master enterprise federated graph architecture.",\n,\n', 'master enterprise federated graph architecture.",\n')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Cleaned up comma on line 456.")
