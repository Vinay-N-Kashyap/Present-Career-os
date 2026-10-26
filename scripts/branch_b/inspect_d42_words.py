# -*- coding: utf-8 -*-
with open('scripts/branch_b/generate_ecom_day42.py', 'r', encoding='utf-8') as f:
    text = f.read()

scope = {}
exec(text[:text.find('day42_data = {')], scope)
for p in range(1, 6):
    words = len(' '.join(scope[f'p{p}_say']).split())
    print(f"p{p}_say words: {words}")
