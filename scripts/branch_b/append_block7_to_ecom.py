import json
import os
import re

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
ecom_lessons_file = os.path.join(commerce_dir, "src", "lib", "data", "bcomEcomLongLessons.ts")

with open(ecom_lessons_file, "r", encoding="utf-8") as f:
    original_content = f.read()

# Load Days 31 to 35
days_to_add = []
for day_num in range(31, 36):
    data_file = os.path.join(commerce_dir, "scripts", "branch_b", f"day{day_num}_ecom_data.json")
    with open(data_file, "r", encoding="utf-8") as f:
        d = json.load(f)
    days_to_add.append(d)

print(f"Loaded {len(days_to_add)} days (31 to 35).")

# Format into TypeScript / JSON strings
formatted_days = []
for d in days_to_add:
    # Serialize day to json with indent
    day_json = json.dumps(d, indent=2)
    formatted_days.append(day_json)

days_ts_block = ",\n" + ",\n".join(formatted_days)

# Find trailing ];
last_bracket_idx = original_content.rfind("];")
if last_bracket_idx == -1:
    raise ValueError("Could not find trailing '];' in bcomEcomLongLessons.ts")

new_content = original_content[:last_bracket_idx].rstrip() + days_ts_block + "\n];\n"

with open(ecom_lessons_file, "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"Successfully appended Days 31 to 35 to {ecom_lessons_file}!")
print(f"New file length: {len(new_content)} characters.")
