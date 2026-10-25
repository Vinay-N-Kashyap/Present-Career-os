import json
import re

file_path = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\scripts\branch_b\generate_ecom_day32.py'

# Let's inspect the exact lines where p1_say, p2_say, p3_say, p4_say, p5_say end
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Let's print the length and see how each say is defined
print("Content length:", len(content))
