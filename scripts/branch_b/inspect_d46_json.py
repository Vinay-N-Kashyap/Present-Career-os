import json

with open("scripts/branch_b/day46_ecom_data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for idx, p in enumerate(data["parts"], 1):
    words = len(" ".join(p["say"]).split())
    print(f"Part {idx} ('{p['title'][:35]}...'): {words} words")

total = sum(len(" ".join(p["say"]).split()) for p in data["parts"])
print(f"Total Day 46 words: {total}")
