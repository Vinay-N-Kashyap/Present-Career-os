import json
import hashlib

with open('scripts/branch_b/day50_dmkt_data.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

with open('src/lib/data/lessonVisuals/bcom_dmkt/day-50.json', 'r', encoding='utf-8') as f:
    vis = json.load(f)

for idx, p in enumerate(d["parts"]):
    raw = p["title"] + "".join(p["say"]) + (p.get("code") or "")
    h = hashlib.sha256(raw.encode("utf-8")).hexdigest()
    vh = vis["entries"][idx]["codeHash"]
    print(f"Part {idx}: computed={h[:16]}... vs vis={vh[:16]}... match={h == vh}")
