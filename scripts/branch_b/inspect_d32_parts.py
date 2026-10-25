file_path = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\scripts\branch_b\generate_ecom_day32.py'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Let's see the word counts of all parts in day 32 if we evaluate them
# Let's inspect where p1_say, p2_say, etc. are
import re
parts = re.findall(r'p\d+_title = [^\n]+', text)
print('Titles found:', parts)
