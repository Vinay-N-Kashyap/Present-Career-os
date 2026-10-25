import json
import hashlib

with open('scripts/branch_b/day46_dmkt_data.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

p0 = d["parts"][0]
raw_input = p0["title"] + "".join(p0["say"]) + (p0.get("code") or "")
h = hashlib.sha256(raw_input.encode("utf-8")).hexdigest()

with open('src/lib/data/lessonVisuals/bcom_dmkt/day-46.json', 'r', encoding='utf-8') as f:
    vis = json.load(f)

entry_0_hash = vis["entries"][0]["codeHash"]

print("Computed hash:", h)
print("Visual hash:  ", entry_0_hash)
print("Matches?", h == entry_0_hash)
