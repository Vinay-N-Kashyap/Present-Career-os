import json
import os

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
data_file = os.path.join(commerce_dir, "scripts", "branch_b", "day57_ecom_data.json")

with open(data_file, "r", encoding="utf-8") as f:
    data = json.load(f)

data["parts"][4]["say"].append(
    "By fostering customer trust across physical and digital touchpoints, the platform establishes an enduring competitive "
    "moat in the evolving retail landscape, cementing sustained market leadership and exceptional shareholder returns."
)

with open(data_file, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

total = 0
for i, p in enumerate(data["parts"]):
    w = sum(len(para.split()) for para in p["say"])
    total += w
    print(f"Part {i+1}: {w} words")
print(f"Total Day 57 Words: {total}")
