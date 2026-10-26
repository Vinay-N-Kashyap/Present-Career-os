"""
Patch Block 12 (Days 56-60) into src/lib/data/bcomEcomLongLessons.ts
"""
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
ts_file = os.path.join(commerce_dir, "src", "lib", "data", "bcomEcomLongLessons.ts")

with open(ts_file, "r", encoding="utf-8") as f:
    lines = f.readlines()

print(f"Total lines in current file: {len(lines)}")
# Line 10551 (index 10550) is '},\n' ending Day 55
assert lines[10550].strip() in ['},', '}'], f"Expected closing of Day 55 at line 10551, found: {repr(lines[10550])}"
assert '"day": 56,' in lines[10553], f"Expected Day 56 at line 10554, found: {repr(lines[10553])}"

clean_prefix = lines[:10551]
# Ensure trailing comma on line 10551
if not clean_prefix[-1].rstrip().endswith(','):
    clean_prefix[-1] = clean_prefix[-1].rstrip() + ',\n'

# Load verified Days 56 to 60
block12_json_strs = []
for d in range(56, 61):
    data_path = os.path.join(commerce_dir, "scripts", "branch_b", f"day{d}_ecom_data.json")
    with open(data_path, "r", encoding="utf-8") as f:
        obj = json.load(f)
        block12_json_strs.append(json.dumps(obj, indent=2, ensure_ascii=False))

block12_body = ",\n".join(block12_json_strs) + "\n];\n"
new_content = "".join(clean_prefix) + block12_body

with open(ts_file, "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"Successfully patched Block 12 into {ts_file}!")
