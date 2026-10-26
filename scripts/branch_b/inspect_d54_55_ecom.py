import os
import json
import glob
import sys

sys.stdout.reconfigure(encoding='utf-8')

for f in sorted(glob.glob("scripts/branch_b/*ecom*54*") + glob.glob("scripts/branch_b/*ecom*55*")):
    print(f)

for day in [54, 55]:
    fpath = f"scripts/branch_b/day{day}_ecom_data.json"
    if os.path.exists(fpath):
        with open(fpath, "r", encoding="utf-8") as f:
            d = json.load(f)
        parts = d.get("parts", [])
        words = [sum(len(s.split()) for s in p.get("say", [])) for p in parts]
        print(f"Day {day}: {d.get('title')} | Parts: {len(parts)} | Words: {words} (Total: {sum(words)})")
    else:
        print(f"Day {day}: Not found")
