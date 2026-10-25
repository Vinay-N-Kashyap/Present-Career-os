# -*- coding: utf-8 -*-
import json
import os
import sys

sys.path.insert(0, os.getcwd())
sys.path.insert(0, os.path.join(os.getcwd(), 'scripts', 'branch_b'))

from create_day36_mkt import day36_data
from create_day37_mkt import day37_data
from create_day38_mkt import day38_data
from create_day39_mkt import day39_data
from create_day40_mkt import day40_data

days = [day36_data, day37_data, day38_data, day39_data, day40_data]

lessons_file = os.path.join(os.getcwd(), 'src', 'lib', 'data', 'bcomMktLongLessons.ts')

with open(lessons_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Check if Day 36 already present
if 'day: 36' in content or '"day": 36' in content:
    print("Day 36 already exists in bcomMktLongLessons.ts. Aborting append.")
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

print(f"Successfully appended Block 8 (Days 36-40) to {lessons_file}!")
