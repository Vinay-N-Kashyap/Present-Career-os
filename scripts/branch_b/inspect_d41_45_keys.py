import json
import os

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
for d in [41, 42, 43, 44, 45]:
    p = os.path.join(commerce_dir, "scripts", "branch_b", f"day{d}_dmkt_data.json")
    with open(p, "r", encoding="utf-8") as f:
        data = json.load(f)
    print(f"Day {d}: {data.get('title')}")
    for idx, pt in enumerate(data.get("parts", [])):
        w = len(" ".join(pt["say"]).split()) if isinstance(pt["say"], list) else len(pt["say"].split())
        print(f"  Part {idx+1}: {w} words")

