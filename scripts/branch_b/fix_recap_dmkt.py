import json
import os

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
dmkt_path = os.path.join(commerce_dir, "src", "lib", "data", "bcomDmktLongLessons.ts")

# 1. Fix in JSON files
for day in range(46, 51):
    json_path = os.path.join(commerce_dir, "scripts", "branch_b", f"day{day}_dmkt_data.json")
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    if isinstance(data.get("recap"), list):
        data["recap"] = " ".join(data["recap"])
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        print(f"Fixed recap in day{day}_dmkt_data.json")

# 2. Fix in bcomDmktLongLessons.ts
# Let's re-assemble or patch bcomDmktLongLessons.ts
# Notice that Days 46-50 are at the end of bcomDmktLongLessons.ts
with open(dmkt_path, "r", encoding="utf-8") as f:
    content = f.read()

# Find where Day 46 starts
day46_marker = '"day": 46'
idx = content.find(day46_marker)
if idx != -1:
    # Find the object start before "day": 46
    obj_start = content.rfind("{", 0, idx)
    # The previous content up to obj_start
    before_day46 = content[:obj_start].rstrip()
    if before_day46.endswith(","):
        before_day46 = before_day46[:-1].rstrip()

    # Read formatted days from json files
    formatted_days = []
    for day in range(46, 51):
        json_path = os.path.join(commerce_dir, "scripts", "branch_b", f"day{day}_dmkt_data.json")
        with open(json_path, "r", encoding="utf-8") as f:
            d = json.load(f)
        # Ensure visualBinding and check answers
        p0_code = d["parts"][0].get("code", "")
        import hashlib
        p0_hash = hashlib.sha256(p0_code.encode("utf-8")).hexdigest()
        d["visualBinding"] = {
            "schemaVersion": 1,
            "type": "funnel",
            "visualHash": p0_hash
        }
        for part in d["parts"]:
            if "check" in part:
                part["check"]["answer"] = 0
                part["check"]["answerIndex"] = 0
                if "why" in part["check"] and "explanation" not in part["check"]:
                    part["check"]["explanation"] = part["check"]["why"]
        formatted_days.append(json.dumps(d, indent=2))

    new_content = before_day46 + ",\n" + ",\n".join(formatted_days) + "\n];\n"
    with open(dmkt_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Re-assembled Days 46-50 with string recap in bcomDmktLongLessons.ts successfully!")
