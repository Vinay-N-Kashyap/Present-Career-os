"""
Append Block 11 (Days 51-55) to src/lib/data/bcomTaxLongLessons.ts.
"""

import os
import sys
import json
import importlib

sys.path.insert(0, os.getcwd())
sys.path.insert(0, os.path.join(os.getcwd(), 'scripts', 'branch_b'))

from create_day51_tax import get_day51_data
from create_day52_tax import get_day52_data
from create_day53_tax import get_day53_data
from create_day54_tax import get_day54_data
from create_day55_tax import get_day55_data

days = [
    get_day51_data(),
    get_day52_data(),
    get_day53_data(),
    get_day54_data(),
    get_day55_data()
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

print(f"Successfully appended Days 51-55 to {ts_file_path}!")
