import json
import os

ecom_ts_path = 'src/lib/data/bcomEcomLongLessons.ts'

with open(ecom_ts_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find where Day 46 starts
idx_d46 = content.find('"day": 46')
assert idx_d46 != -1, "Could not find Day 46 in bcomEcomLongLessons.ts"

# Backtrack to the opening brace of Day 46 object
# It should look like: ',\n{\n  "day": 46'
prefix_cut = content[:idx_d46].rfind('{')
assert prefix_cut != -1, "Could not find opening brace before Day 46"

# Check if there is a comma before the opening brace
base_content = content[:prefix_cut].rstrip()
if base_content.endswith(','):
    base_content = base_content[:-1].rstrip()

# Now load Days 46 to 50
formatted_days = []
for d in range(46, 51):
    with open(f'scripts/branch_b/day{d}_ecom_data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    formatted_days.append(json.dumps(data, indent=2, ensure_ascii=False))

days_block = ',\n' + ',\n'.join(formatted_days) + '\n];\n'

new_ts_content = base_content + days_block

with open(ecom_ts_path, 'w', encoding='utf-8') as f:
    f.write(new_ts_content)

print(f"Successfully replaced Days 46-50 in {ecom_ts_path}!")
