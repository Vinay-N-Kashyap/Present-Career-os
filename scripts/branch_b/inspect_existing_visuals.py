import json
import os

for d in range(56, 61):
    fpath = f"src/lib/data/lessonVisuals/bcom_dmkt/day-{d}.json"
    print(f"=== day-{d}.json ===")
    if os.path.exists(fpath):
        with open(fpath, "r", encoding="utf-8") as f:
            v = json.load(f)
        print("Schema:", v.get("schemaVersion"), "Prefix:", v.get("prefix"), "Entries:", len(v.get("entries", [])))
        for e in v.get("entries", []):
            print("  partTitle:", e.get("partTitle")[:40])
    else:
        print("Does not exist!")
