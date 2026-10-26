import json
import hashlib

for d in range(51, 56):
    data_path = f'scripts/branch_b/day{d}_ecom_data.json'
    vis_path = f'src/lib/data/lessonVisuals/bcom_ecom/day-{d}.json'
    with open(data_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    with open(vis_path, 'r', encoding='utf-8') as f:
        vis = json.load(f)
    for idx, p in enumerate(data['parts']):
        say_str = ''.join(p['say']) if isinstance(p['say'], list) else p['say']
        raw = p['title'] + say_str + p.get('code', '')
        exp_hash = hashlib.sha256(raw.encode('utf-8')).hexdigest()
        actual_hash = vis['entries'][idx]['codeHash']
        assert exp_hash == actual_hash, f"Day {d} P{idx+1} HASH MISMATCH: expected {exp_hash}, got {actual_hash}"
    print(f"Day {d} hashes match 100%!")
