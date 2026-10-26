import json
import os

ecom_ts_path = 'src/lib/data/bcomEcomLongLessons.ts'

with open(ecom_ts_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find trailing '];'
last_bracket = content.rfind('];')
assert last_bracket != -1, "Could not find trailing '];'"

base_content = content[:last_bracket].rstrip()
if base_content.endswith(','):
    base_content = base_content[:-1].rstrip()

# Load Days 51 to 55
formatted_days = []
for d in range(51, 56):
    data_file = f'scripts/branch_b/day{d}_ecom_data.json'
    with open(data_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    formatted_days.append(json.dumps(data, indent=2, ensure_ascii=False))

days_block = ',\n' + ',\n'.join(formatted_days) + '\n];\n'

new_ts_content = base_content + days_block

with open(ecom_ts_path, 'w', encoding='utf-8') as f:
    f.write(new_ts_content)

print(f"Successfully appended Days 51-55 to {ecom_ts_path}!")
