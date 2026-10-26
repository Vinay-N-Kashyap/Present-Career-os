import json

data_file = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\scripts\branch_b\day54_ecom_data.json"
with open(data_file, "r", encoding="utf-8") as f:
    d = json.load(f)

p5_add = " Ultimately, executive leadership relies on this unified governance observatory to steer cross-border investments, maintain immaculate regulatory posture, and expand sovereign commerce operations with absolute confidence across every international market."
d["parts"][4]["explanation"] += " " + p5_add

with open(data_file, "w", encoding="utf-8") as f:
    json.dump(d, f, indent=2, ensure_ascii=False)

for i, p in enumerate(d["parts"]):
    print(f"Part {i+1}: {len(p['explanation'].split())} words")
print("Total:", sum(len(p['explanation'].split()) for p in d["parts"]))
