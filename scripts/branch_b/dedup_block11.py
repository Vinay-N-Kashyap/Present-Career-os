with open('src/lib/data/bcomEcomLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

idx_d50 = text.find('"day": 50')
print("idx_d50:", idx_d50)

# Find the end of Day 50 object: the first '"day": 51'
idx_d51 = text.find('"day": 51')
print("idx_d51:", idx_d51)

# Backtrack from idx_d51 to the opening '{' of Day 51
cut_pos = text[:idx_d51].rfind('{')
base_clean = text[:cut_pos].rstrip()
if base_clean.endswith(','):
    base_clean = base_clean[:-1].rstrip()

import json
formatted_days = []
for d in range(51, 56):
    with open(f'scripts/branch_b/day{d}_ecom_data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    formatted_days.append(json.dumps(data, indent=2, ensure_ascii=False))

days_block = ',\n' + ',\n'.join(formatted_days) + '\n];\n'

new_ts = base_clean + days_block

with open('src/lib/data/bcomEcomLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(new_ts)

print("Cleaned up duplicates and appended Days 51-55 cleanly!")
