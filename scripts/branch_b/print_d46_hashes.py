import json
import hashlib

with open('scripts/branch_b/day46_dmkt_data.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

for idx, p in enumerate(d["parts"]):
    c = p.get("code", "")
    h = hashlib.sha256(c.encode("utf-8")).hexdigest()
    print(f"Part {idx}: code len={len(c)}, hash={h}")
