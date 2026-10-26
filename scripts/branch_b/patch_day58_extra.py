import json
import os

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
data_file = os.path.join(commerce_dir, "scripts", "branch_b", "day58_ecom_data.json")

with open(data_file, "r", encoding="utf-8") as f:
    data = json.load(f)

data["parts"][3]["say"].append(
    "This algorithmic discount governance maximizes top-line revenue without degrading brand prestige or sacrificing gross profitability."
)

data["parts"][4]["say"].append(
    "With verified mastery over real-time clickstream data, deterministic identity graphs, and predictive machine learning, the certified "
    "commerce architect possesses the quantitative and architectural capabilities necessary to build sovereign data platforms that dominate "
    "global competitive markets."
)

with open(data_file, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

total = 0
for i, p in enumerate(data["parts"]):
    w = sum(len(para.split()) for para in p["say"])
    total += w
    print(f"Part {i+1}: {w} words")
print(f"Total Day 58 Words: {total}")
