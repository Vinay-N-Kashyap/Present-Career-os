import json
import os
import re

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
ts_file = os.path.join(commerce_dir, "src", "lib", "data", "bcomDmktLongLessons.ts")

with open(ts_file, "r", encoding="utf-8") as f:
    content = f.read()

# Verify that Days 31-35 are not already present
assert "day: 31," not in content, "Day 31 already present in bcomDmktLongLessons.ts"

new_lessons_ts = []

for day_num in range(31, 36):
    data_file = os.path.join(commerce_dir, "scripts", "branch_b", f"day{day_num}_dmkt_data.json")
    with open(data_file, "r", encoding="utf-8") as f:
        lesson = json.load(f)
    
    lesson_json_str = json.dumps(lesson, indent=2)
    new_lessons_ts.append(lesson_json_str)

combined_new_lessons = ",\n" + ",\n".join(new_lessons_ts)

# Find the last "];"
last_bracket_idx = content.rfind("];")
assert last_bracket_idx != -1, "Could not find closing '];' in bcomDmktLongLessons.ts"

new_content = content[:last_bracket_idx].rstrip() + combined_new_lessons + "\n];\n"

with open(ts_file, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Successfully appended Days 31-35 to bcomDmktLongLessons.ts!")
