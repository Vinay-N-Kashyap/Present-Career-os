file_path = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\src\lib\data\bcomEcomLongLessons.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Let's see what is around index 180000 - 250000
print("--- Chunk around 180000 ---")
print(repr(text[180000:182000]))

# Search for "coursePrefix"
import re
prefixes = list(re.finditer(r'coursePrefix', text))
print("Total coursePrefix matches:", len(prefixes))
for p in prefixes:
    print("Match at", p.start(), repr(text[p.start():p.start()+80]))
