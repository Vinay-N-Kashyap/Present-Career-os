import json

with open("scripts/branch_b/day45_dmkt_data.json", "r", encoding="utf-8") as f:
    d = json.load(f)

print("Title in day45_dmkt_data.json:", d.get("title"))
for i, p in enumerate(d.get("parts", [])):
    words = len(" ".join(p["say"]).split())
    print(f"Part {i+1} ({p.get('title')}): {words} words")
