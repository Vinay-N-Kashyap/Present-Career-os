import json

for d in [36, 37, 38, 39, 40]:
    with open(f"scripts/branch_c/day{d}_lesson.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    print(f"=== Day {d} ===")
    total = 0
    for i, p in enumerate(data["parts"]):
        wc = len(" ".join(p["say"]).split())
        total += wc
        print(f"  Part {i+1}: {wc} words ({len(p['say'])} paragraphs)")
    print(f"  Total: {total} words")
