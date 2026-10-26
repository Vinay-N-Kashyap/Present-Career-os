import json
import os

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
data_file = os.path.join(commerce_dir, "scripts", "branch_b", "day60_ecom_data.json")

with open(data_file, "r", encoding="utf-8") as f:
    data = json.load(f)

data["parts"][1]["say"].append(
    "This automated trade compliance discipline shields the enterprise from customs audit penalties while accelerating global market delivery."
)

with open(data_file, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

total = 0
for i, p in enumerate(data["parts"]):
    w = sum(len(para.split()) for para in p["say"])
    total += w
    print(f"Part {i+1}: {w} words")
print(f"Total Day 60 Words: {total}")
