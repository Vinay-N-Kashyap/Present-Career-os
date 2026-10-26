import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

for day in [51, 52, 53]:
    fpath = f"scripts/branch_b/day{day}_ecom_data.json"
    if os.path.exists(fpath):
        with open(fpath, "r", encoding="utf-8") as f:
            d = json.load(f)
        parts = d.get("parts", [])
        words = [sum(len(s.split()) for s in p.get("say", [])) for p in parts]
        print(f"Day {day}: {d.get('title')} | Parts: {len(parts)} | Words: {words} (Total: {sum(words)})")
    else:
        print(f"Day {day}: Not found")
