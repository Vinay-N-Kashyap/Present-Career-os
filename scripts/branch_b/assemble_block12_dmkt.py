import json
import hashlib
import os

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
dmkt_path = os.path.join(commerce_dir, "src", "lib", "data", "bcomDmktLongLessons.ts")
scripts_dir = os.path.join(commerce_dir, "scripts", "branch_b")

days_data = []
for d_num in range(56, 61):
    file_path = os.path.join(scripts_dir, f"day{d_num}_dmkt_data.json")
    with open(file_path, "r", encoding="utf-8") as f:
        d = json.load(f)
    days_data.append(d)

print("=== AUDITING AND FORMATTING BLOCK 12 DAYS (56 TO 60) ===")
for d in days_data:
    day_num = d["day"]
    assert d.get("coursePrefix") == "bcom_dmkt"
    expected_minutes = 60 if day_num == 60 else 38
    assert d.get("minutes") == expected_minutes, f"Day {day_num} minutes must be {expected_minutes}"
    
    parts = d["parts"]
    assert len(parts) == 5, f"Day {day_num} must have 5 parts"
    
    # Visual binding hash from part 0 code
    p0_code = parts[0].get("code", "")
    p0_hash = hashlib.sha256(p0_code.encode("utf-8")).hexdigest()
    d["visualBinding"] = {
        "schemaVersion": 1,
        "type": "funnel",
        "visualHash": p0_hash
    }
    
    for p_idx, part in enumerate(parts):
        if "check" in part:
            part["check"]["answer"] = 0
            part["check"]["answerIndex"] = 0
            if "why" in part["check"] and "explanation" not in part["check"]:
                part["check"]["explanation"] = part["check"]["why"]
            elif "explanation" in part["check"] and "why" not in part["check"]:
                part["check"]["why"] = part["check"]["explanation"]

print("Formatting JSON representations for appending...")
formatted_days = []
for d in days_data:
    formatted_days.append(json.dumps(d, indent=2))

with open(dmkt_path, "r", encoding="utf-8") as f:
    content = f.read()

# Verify that Days 56-60 are not already in content
if '"day": 56' in content or 'day: 56' in content:
    print("Warning: Day 56 already in file! Aborting append to prevent duplication.")
else:
    last_bracket_idx = content.rfind("];")
    if last_bracket_idx == -1:
        raise ValueError("Could not find closing '];' in bcomDmktLongLessons.ts")
    
    before_closing = content[:last_bracket_idx].rstrip()
    if before_closing.endswith(","):
        before_closing = before_closing[:-1].rstrip()
        
    new_days_str = ",\n" + ",\n".join(formatted_days) + "\n"
    new_content = before_closing + new_days_str + "];\n"
    
    with open(dmkt_path, "w", encoding="utf-8") as f:
        f.write(new_content)
        
    print(f"Successfully appended Days 56 to 60 into {dmkt_path}!")
