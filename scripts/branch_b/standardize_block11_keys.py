import json
import os

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
scripts_dir = os.path.join(commerce_dir, "scripts", "branch_b")

for d in range(51, 56):
    fpath = os.path.join(scripts_dir, f"day{d}_dmkt_data.json")
    with open(fpath, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    goal_val = data.get("goal") or data.get("description") or "Master enterprise retail media operations."
    standardized = {
        "coursePrefix": "bcom_dmkt",
        "day": d,
        "title": data["title"],
        "goal": goal_val,
        "minutes": data["minutes"],
        "recap": data["recap"],
        "parts": data["parts"]
    }
    
    with open(fpath, "w", encoding="utf-8") as f:
        json.dump(standardized, f, indent=2)
    print(f"Standardized Day {d} keys.")

print("All Days 51 to 55 standardized successfully!")
