import json, hashlib

with open('src/lib/data/lessonVisuals/bcom_dmkt/day-56.json', 'r', encoding='utf-8') as f:
    vis = json.load(f)

with open('scripts/branch_b/day56_dmkt_data.json', 'r', encoding='utf-8') as f:
    d56 = json.load(f)

for idx, p in enumerate(d56['parts']):
    raw = p['title'] + ''.join(p['say']) + p.get('code', '')
    h = hashlib.sha256(raw.encode('utf-8')).hexdigest()
    vh = vis['entries'][idx]['codeHash']
    print(f"Part {idx+1}: visual={vh} calc={h} match={vh == h}")
