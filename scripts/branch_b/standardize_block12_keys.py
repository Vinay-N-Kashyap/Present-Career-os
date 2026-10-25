import json

for d in [56, 57, 58, 59, 60]:
    fpath = f"scripts/branch_b/day{d}_dmkt_data.json"
    with open(fpath, "r", encoding="utf-8") as f:
        data = json.load(f)

    if "description" in data and "goal" not in data:
        data["goal"] = data.pop("description")
    if "course" in data:
        data.pop("course")
    if "coursePrefix" not in data:
        data["coursePrefix"] = "bcom_dmkt"

    # Reorder keys canonically
    ordered = {
        "coursePrefix": "bcom_dmkt",
        "day": d,
        "title": data["title"],
        "goal": data["goal"],
        "minutes": data["minutes"],
        "recap": data["recap"],
        "parts": data["parts"]
    }

    with open(fpath, "w", encoding="utf-8") as f:
        json.dump(ordered, f, indent=2)

print("Standardized Block 12 JSON keys successfully!")
