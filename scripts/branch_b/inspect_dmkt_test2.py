file_path = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\tests\bcom_dmkt_days56_60_expansion.test.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

print(text[1500:].encode('ascii', errors='replace').decode('ascii'))
