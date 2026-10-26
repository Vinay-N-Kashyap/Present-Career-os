import json
import hashlib
import os

with open("src/lib/data/bcomDmktLongLessons.ts", "r", encoding="utf-8") as f:
    text = f.read()

# Parse days from bcomDmktLongLessons.ts using regex or tsx
# Let's inspect each day-56 to day-60 visual file
for d in range(56, 61):
    vis_file = f"src/lib/data/lessonVisuals/bcom_dmkt/day-{d}.json"
    data_file = f"scripts/branch_b/day{d}_dmkt_data.json"
    with open(vis_file, "r", encoding="utf-8") as vf:
        vdata = json.load(vf)
    with open(data_file, "r", encoding="utf-8") as df:
        ddata = json.load(df)

    for p_idx, part in enumerate(ddata["parts"]):
        expected_hash = vdata["parts"][p_idx]["codeHash"]
        part_content = part["title"] + "".join(part["say"]) + (part.get("code", "") or "")
        calc_hash = hashlib.sha256(part_content.encode("utf-8")).hexdigest()
        print(f"Day {d} Part {p_idx+1} codeHash match: {expected_hash == calc_hash}")
        assert expected_hash == calc_hash, f"Day {d} Part {p_idx+1} hash mismatch!"

print("All visual codeHashes match day data 100%!")
