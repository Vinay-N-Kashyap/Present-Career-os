file_path = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\scripts\branch_b\generate_ecom_day32.py'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace unescaped quotes in the mutation string
text = text.replace('id: "item_12", qty: 3', "id: 'item_12', qty: 3")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed line 367 unescaped quotes.")
