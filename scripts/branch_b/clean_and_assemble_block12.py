import json
import hashlib
import os

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
dmkt_path = os.path.join(commerce_dir, "src", "lib", "data", "bcomDmktLongLessons.ts")
scripts_dir = os.path.join(commerce_dir, "scripts", "branch_b")

# Read existing bcomDmktLongLessons.ts
with open(dmkt_path, "r", encoding="utf-8") as f:
    content = f.read()

# Clean out any partial/existing Days 56-60 if present
# Find where Day 55 ends
idx_day55 = content.find('"day": 55')
if idx_day55 == -1:
    raise ValueError("Day 55 not found in bcomDmktLongLessons.ts")

# Find the object boundary after day 55
# Looking for "day": 56 if present
idx_day56 = content.find('"day": 56')
if idx_day56 != -1:
    # Truncate content right before the object for day 56
    # Go backwards from idx_day56 to the previous "{"
    prev_brace = content.rfind("{", 0, idx_day56)
    # Go backwards to preceding comma
    prev_comma = content.rfind(",", 0, prev_brace)
    content = content[:prev_comma].rstrip() + "\n];\n"
    print("Truncated previous Days 56-60 entries from bcomDmktLongLessons.ts")

# Now load Days 56-60 clean data
allowed_keys = {
    "coursePrefix", "day", "title", "description", "goal",
    "minutes", "recap", "parts", "visualBinding"
}

days_data = []
for d_num in range(56, 61):
    file_path = os.path.join(scripts_dir, f"day{d_num}_dmkt_data.json")
    with open(file_path, "r", encoding="utf-8") as f:
        raw_d = json.load(f)
        
    cleaned_d = {
        "coursePrefix": "bcom_dmkt",
        "day": d_num,
        "title": raw_d["title"],
        "goal": raw_d.get("goal") or raw_d.get("description") or f"Master Day {d_num} advanced concepts in digital marketing analytics.",
        "minutes": 60 if d_num == 60 else 38,
        "recap": raw_d["recap"],
        "parts": raw_d["parts"]
    }
    
    # Standardize parts check
    for p in cleaned_d["parts"]:
        if "check" in p:
            p["check"]["answer"] = 0
            p["check"]["answerIndex"] = 0
            why_text = p["check"].get("why") or p["check"].get("explanation")
            p["check"]["why"] = why_text
            p["check"]["explanation"] = why_text
            
    p0_code = cleaned_d["parts"][0].get("code", "")
    p0_hash = hashlib.sha256(p0_code.encode("utf-8")).hexdigest()
    cleaned_d["visualBinding"] = {
        "schemaVersion": 1,
        "type": "funnel",
        "visualHash": p0_hash
    }
    
    days_data.append(cleaned_d)

formatted_days = [json.dumps(d, indent=2) for d in days_data]

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

print("Successfully cleaned and assembled Days 56-60 into bcomDmktLongLessons.ts!")
