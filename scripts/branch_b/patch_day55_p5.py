import json
import os

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
data_file = os.path.join(commerce_dir, "scripts", "branch_b", "day55_ecom_data.json")

with open(data_file, "r", encoding="utf-8") as f:
    data = json.load(f)

p5_extra_3 = (
    "In conclusion, the completion of the Milestone 11 Capstone marks the culmination of advanced cross-border engineering, "
    "establishing the graduate as an authoritative expert in global digital commerce platforms. With verified mastery over treasury risk, "
    "customs automation, bonded fulfillment logistics, and international privacy laws, the certified architect possesses the elite technical "
    "and strategic acumen necessary to lead multi-billion-dollar global enterprises to sustained market leadership across worldwide digital frontiers."
)

data["parts"][4]["say"].append(p5_extra_3)

with open(data_file, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

total = 0
for i, p in enumerate(data["parts"]):
    w = sum(len(para.split()) for para in p["say"])
    total += w
    print(f"Part {i+1}: {w} words")
print(f"Total Day 55 Words: {total}")
