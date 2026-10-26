import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
ts_file = os.path.join(commerce_dir, "src", "lib", "data", "bcomEcomLongLessons.ts")

with open(ts_file, "r", encoding="utf-8") as f:
    content = f.read()

# Verify that Days 41-45 are not already present
for d in range(41, 46):
    assert f'"day": {d}' not in content, f"Day {d} already exists in {ts_file}!"

# Read Day 41..45 data
days_to_add = []
for d in range(41, 46):
    data_path = os.path.join(commerce_dir, "scripts", "branch_b", f"day{d}_ecom_data.json")
    with open(data_path, "r", encoding="utf-8") as f:
        days_to_add.append(json.load(f))

# Serialize days to TS JSON
serialized_days = []
for day in days_to_add:
    serialized_days.append(json.dumps(day, indent=2, ensure_ascii=False))

new_block_str = ",\n" + ",\n".join(serialized_days)

# Find last occurrence of ];
pos = content.rfind("];")
assert pos != -1, "Could not find closing '];' in bcomEcomLongLessons.ts"

new_content = content[:pos].rstrip() + new_block_str + "\n];\n"

with open(ts_file, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Successfully appended Block 9 (Days 41-45) to bcomEcomLongLessons.ts!")
