# -*- coding: utf-8 -*-
import json

with open('scripts/branch_b/day39_ecom_data.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

d['coursePrefix'] = 'bcom_ecom'

# Also ensure recap is single string
if isinstance(d.get('recap'), list):
    d['recap'] = " ".join(d['recap'])

with open('scripts/branch_b/day39_ecom_data.json', 'w', encoding='utf-8') as f:
    json.dump(d, f, indent=2, ensure_ascii=False)

# Also fix generate_ecom_day39.py
with open('scripts/branch_b/generate_ecom_day39.py', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace('"day": 39,', '"coursePrefix": "bcom_ecom",\n    "day": 39,')

with open('scripts/branch_b/generate_ecom_day39.py', 'w', encoding='utf-8') as f:
    f.write(code)

print("Fixed coursePrefix in day39_ecom_data.json and generate_ecom_day39.py!")
