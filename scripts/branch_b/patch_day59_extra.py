import json
import os

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
data_file = os.path.join(commerce_dir, "scripts", "branch_b", "day59_ecom_data.json")

with open(data_file, "r", encoding="utf-8") as f:
    data = json.load(f)

data["parts"][3]["say"].append(
    "This defensive posture guarantees that flash sales generate record-breaking profitability without operational failure or customer "
    "frustration, turning high-concurrency peak events into celebrated organizational triumphs."
)

data["parts"][4]["say"].append(
    "By establishing clear architectural principles and fostering an engineering culture of excellence, the technology organization transforms "
    "from a traditional back-office support department into the principal driver of enterprise innovation, agility, and global digital dominance."
)

with open(data_file, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

total = 0
for i, p in enumerate(data["parts"]):
    w = sum(len(para.split()) for para in p["say"])
    total += w
    print(f"Part {i+1}: {w} words")
print(f"Total Day 59 Words: {total}")
