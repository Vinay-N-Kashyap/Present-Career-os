import json

with open(r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\scripts\branch_b\day36_ecom_data.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

for p_idx, p in enumerate(d['parts']):
    print(f"Part {p_idx+1}: {p['title']}")
    print(f"  Code len: {len(p['code'])}, Output len: {len(p['output'])}")
