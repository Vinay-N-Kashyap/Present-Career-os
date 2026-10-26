import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
ts_file = os.path.join(commerce_dir, "src", "lib", "data", "bcomEcomLongLessons.ts")

with open(ts_file, "r", encoding="utf-8") as f:
    text = f.read()

# Locate the exact boundary where Day 45 ends and old Day 46 begins
pos_d45 = text.rfind('"day": 45,')
if pos_d45 == -1:
    pos_d45 = text.rfind("'day': 45,")
if pos_d45 == -1:
    pos_d45 = text.rfind("day: 45,")

assert pos_d45 != -1, "Could not find Day 45"

end_d45 = text.find('},\n{\n  "day": 46,', pos_d45)
if end_d45 == -1:
    end_d45 = text.find('},\n{\n  day: 46,', pos_d45)

assert end_d45 != -1, "Could not find Day 45 / Day 46 boundary"

# Base text up to the closing brace of Day 45
base_text = text[:end_d45 + 1]

# Load Days 46 to 50
block10_days = []
for day_num in range(46, 51):
    file_path = os.path.join(commerce_dir, "scripts", "branch_b", f"day{day_num}_ecom_data.json")
    with open(file_path, "r", encoding="utf-8") as f:
        d = json.load(f)
        # Ensure goal and minutes for Day 50
        if day_num == 50:
            d["minutes"] = 60
            d["goal"] = "Defend the Global Enterprise B2B Composable Commerce & Procurement Command Tower before the corporate boardroom: synthesizing cXML PunchOut integrations, corporate RBAC with SOX 404 Separation of Duties, revolving trade credit with 2/10 Net 30 cash discount optimization, CPQ margin hurdle gatekeeping with ASC 606 volume rebate accruals, and achieving CBCA-EPA boardroom accreditation with $14.85M in audited enterprise ROI."
        else:
            d["minutes"] = 38
            d["goal"] = f"Master enterprise B2B composable commerce architecture: {d['title']}."
        block10_days.append(d)

# Serialize each day as formatted JSON
serialized_days = ",\n".join(json.dumps(d, indent=2, ensure_ascii=False) for d in block10_days)

new_content = base_text + ",\n" + serialized_days + "\n];\n"

with open(ts_file, "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"Successfully replaced Block 10 (Days 46-50) in {ts_file}!")
