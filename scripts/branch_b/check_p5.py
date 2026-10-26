file_path = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\scripts\branch_b\generate_ecom_day32.py'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

idx5 = text.find('p5_say = [')
idx5_end = text.find('p5_example =')
print(text[idx5:idx5_end])
