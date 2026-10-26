import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open("src/lib/data/bcomEcomLongLessons.ts", "r", encoding="utf-8") as f:
    ts_content = f.read()

# Let's check Day 40 in ts_content
# Specifically let's check Part 5 word count and coursePrefix in TS content
for day_num in range(36, 41):
    data_file = f"scripts/branch_b/day{day_num}_ecom_data.json"
    with open(data_file, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    # Check if Day title is present
    day_title = data["title"]
    assert day_title in ts_content, f"Day {day_num} title '{day_title}' not in TS file!"
    
    # Check coursePrefix
    prefix_str = f'"coursePrefix": "bcom_ecom"'
    # We want to ensure each day has coursePrefix
    for p in data["parts"]:
        part_title = p["title"]
        assert part_title in ts_content, f"Part '{part_title}' not in TS file!"

print("All titles present. Now let's check exact Day 40 Part 5 text...")
if "Ultimately, the Capstone Boardroom Defense concludes that enterprise composable commerce is not merely an engineering migration" in ts_content:
    print("Day 40 Part 5 updated text IS in TS file!")
else:
    print("WARNING: Day 40 Part 5 updated text is NOT in TS file!")
