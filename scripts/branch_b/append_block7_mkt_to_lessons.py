# -*- coding: utf-8 -*-
import json
import os
import sys

sys.path.insert(0, os.getcwd())
sys.path.insert(0, os.path.join(os.getcwd(), 'scripts', 'branch_b'))

from create_day31_mkt import day31_data
from create_day32_mkt import day32_data
from create_day33_mkt import day33_data
from create_day34_mkt import day34_data
from create_day35_mkt import day35_data

days = [day31_data, day32_data, day33_data, day34_data, day35_data]

lessons_file = os.path.join(os.getcwd(), 'src', 'lib', 'data', 'bcomMktLongLessons.ts')

with open(lessons_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Check if Day 31 already present
if 'day: 31' in content or '"day": 31' in content:
    print("Day 31 already exists in bcomMktLongLessons.ts. Aborting append.")
    sys.exit(0)

# Find the last closing bracket of BCOM_MKT_LONG_LESSONS array
# The file ends with "];\n" or "];"
last_bracket_idx = content.rfind('];')
if last_bracket_idx == -1:
    print("Could not find closing '];' in bcomMktLongLessons.ts!")
    sys.exit(1)

# Format each day as valid JSON / TypeScript object
formatted_days = []
for d in days:
    # Ensure no 'id' in parts
    for p in d['parts']:
        if 'id' in p:
            del p['id']
    json_str = json.dumps(d, indent=2, ensure_ascii=False)
    formatted_days.append(json_str)

days_payload = ",\n" + ",\n".join(formatted_days) + "\n];\n"

new_content = content[:last_bracket_idx].rstrip() + days_payload

with open(lessons_file, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Successfully appended Block 7 (Days 31-35) to {lessons_file}!")
