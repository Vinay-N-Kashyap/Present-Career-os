"""
Safely apply Block 12 (Days 56-60) to src/lib/data/bcomEcomLongLessons.ts
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

# Find where Day 55 ends
day55_end_idx = None
for i in range(len(lines) - 1, -1, -1):
    if '"day": 55,' in lines[i]:
        # Search forward from here for the closing of Day 55 object: '  ]\n}\n' or '  ]\n},\n'
        for j in range(i, len(lines)):
            if lines[j].strip() == '}' and (j + 1 < len(lines) and lines[j+1].strip() in ['{', '},\n', '},']):
                day55_end_idx = j
                break
        if day55_end_idx is not None:
            break

if day55_end_idx is None:
    # Try finding line 10551
    if len(lines) > 10551 and '"day": 56,' in lines[10553]:
        day55_end_idx = 10550
        print(f"Using known index {day55_end_idx} for Day 55 end")
    else:
        raise ValueError("Could not locate clean end of Day 55 in file!")

print(f"Day 55 ends at line {day55_end_idx + 1}: {repr(lines[day55_end_idx])}")

# Keep lines 0 through day55_end_idx
clean_prefix_lines = lines[:day55_end_idx + 1]
# Ensure Day 55 has a trailing comma
if not clean_prefix_lines[-1].rstrip().endswith(','):
    clean_prefix_lines[-1] = clean_prefix_lines[-1].rstrip() + ',\n'

# Load Days 56 to 60 from JSON data
block12_objs = []
for d in range(56, 61):
    data_path = os.path.join(commerce_dir, "scripts", "branch_b", f"day{d}_ecom_data.json")
    with open(data_path, "r", encoding="utf-8") as f:
        block12_objs.append(json.load(f))

# Format block 12 objects as formatted JSON strings
formatted_lessons = []
for obj in block12_objs:
    json_str = json.dumps(obj, indent=2, ensure_ascii=False)
    formatted_lessons.append(json_str)

block12_text = ",\n".join(formatted_lessons) + "\n];\n"

new_file_content = "".join(clean_prefix_lines) + block12_text

# Write out new file
with open(ts_file, "w", encoding="utf-8") as f:
    f.write(new_file_content)

print(f"Successfully wrote updated {ts_file}!")
