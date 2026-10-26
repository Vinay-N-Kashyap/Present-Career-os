import re

with open(r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\scripts\branch_b\generate_ecom_day47.py", "r", encoding="utf-8") as f:
    text = f.read()

matches = re.findall(r'p(\d)_say\s*=\s*\[(.*?)\]\s*p\1_example', text, re.DOTALL)
for p_num, say_block in matches:
    items = re.findall(r'"(.*?)"', say_block, re.DOTALL)
    words = sum(len(it.split()) for it in items)
    print(f"Part {p_num}: {words} words across {len(items)} paragraphs")
