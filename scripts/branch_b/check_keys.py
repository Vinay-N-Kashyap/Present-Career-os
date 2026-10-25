import json

with open("scripts/branch_b/day51_ban_data.json", "r", encoding="utf-8") as f:
    d = json.load(f)

print("Top keys:", list(d.keys()))
if "parts" in d and len(d["parts"]) > 0:
    print("Part 0 keys:", list(d["parts"][0].keys()))
