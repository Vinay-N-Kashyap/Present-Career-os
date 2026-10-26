import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"

for day_num in range(46, 51):
    file_path = os.path.join(commerce_dir, "scripts", "branch_b", f"day{day_num}_ecom_data.json")
    with open(file_path, "r", encoding="utf-8") as f:
        d = json.load(f)
    d["minutes"] = 60 if day_num == 50 else 38
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(d, f, indent=2, ensure_ascii=False)

print("Updated minutes in day46-50 json files!")
