file_path = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\scripts\branch_b\generate_ecom_day32.py'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

print('Total lines in day 32:', len(lines))
# Let's print out the structure of p1_say, p2_say, etc.
for i, line in enumerate(lines[:120]):
    print(f"{i+1}: {line.rstrip()}")
