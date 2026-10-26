"""
strip_ids.py
Removes "id" from parts in bcomTaxLongLessons.ts
"""

FILE = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\src\lib\data\bcomTaxLongLessons.ts"

with open(FILE, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
removed = 0
for line in lines:
    stripped = line.strip()
    if stripped.startswith('"id": "bcom_tax_d4') or stripped.startswith("'id': 'bcom_tax_d4"):
        removed += 1
        continue
    new_lines.append(line)

with open(FILE, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print(f"Removed {removed} id lines. Total lines: {len(lines)} -> {len(new_lines)}")
