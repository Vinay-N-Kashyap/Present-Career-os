"""
Append Block 12 (Days 56-60) to src/lib/data/bcomTaxLongLessons.ts.
"""

import os
import sys
import json

sys.path.insert(0, os.getcwd())
sys.path.insert(0, os.path.join(os.getcwd(), 'scripts', 'branch_b'))

from create_day56_tax import get_day56_data
from create_day57_tax import get_day57_data
from create_day58_tax import get_day58_data
from create_day59_tax import get_day59_data
from create_day60_tax import get_day60_data

days = [
    get_day56_data(),
    get_day57_data(),
    get_day58_data(),
    get_day59_data(),
    get_day60_data()
]

# Ensure no 'id' in parts
for d in days:
    for p in d['parts']:
        if 'id' in p:
            del p['id']

ts_file_path = os.path.join(os.getcwd(), 'src', 'lib', 'data', 'bcomTaxLongLessons.ts')

with open(ts_file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content_stripped = content.rstrip()
if content_stripped.endswith('];'):
    prefix_content = content_stripped[:-2].rstrip()
else:
    raise ValueError("File does not end with '];'!")

# Serialize days into JSON-compatible TS format
days_json_strings = []
for d in days:
    formatted_json = json.dumps(d, indent=2, ensure_ascii=False)
    days_json_strings.append(formatted_json)

all_days_block = ",\n" + ",\n".join(days_json_strings) + "\n];\n"

new_content = prefix_content + all_days_block

with open(ts_file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Successfully appended Days 56-60 to {ts_file_path}!")
