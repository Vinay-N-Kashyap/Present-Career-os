# -*- coding: utf-8 -*-
with open('scripts/branch_b/generate_ecom_day39.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's inspect p1_say, p2_say, p3_say, p4_say, p5_say
import re
for num in range(1, 6):
    m = re.search(rf'p{num}_say\s*=\s*\[(.*?)\]\np{num}_example', text, re.DOTALL)
    if m:
        content = m.group(1)
        # extract string literals
        strings = re.findall(r'\"(.*?)\"', content, re.DOTALL)
        total_words = sum(len(s.split()) for s in strings)
        print(f"p{num}_say: {total_words} words ({len(strings)} paragraphs)")
    else:
        print(f"p{num}_say not found")
