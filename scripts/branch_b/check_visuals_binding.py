import json
import hashlib
import os
import re

for d in range(46, 51):
    data_file = f'scripts/branch_b/day{d}_ecom_data.json'
    vis_file = f'src/lib/data/lessonVisuals/bcom_ecom/day-{d}.json'
    
    with open(data_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    with open(vis_file, 'r', encoding='utf-8') as f:
        vis = json.load(f)
        
    assert vis['schemaVersion'] == 1
    assert vis['prefix'] == 'bcom_ecom'
    assert vis['day'] == d
    assert len(vis['entries']) == 5
    
    for idx in range(5):
        part = data['parts'][idx]
        ventry = vis['entries'][idx]
        code_hash = hashlib.sha256(part['code'].encode('utf-8')).hexdigest()
        assert ventry['codeHash'] == code_hash, f"Day {d} Part {idx+1} code hash mismatch: expected {code_hash}, got {ventry['codeHash']}"
        assert ventry['partTitle'] == part['title'], f"Day {d} Part {idx+1} partTitle mismatch"
        for step in ventry['spec']['steps']:
            cap = step['caption']
            assert not re.search(r'\d', cap), f"Day {d} Part {idx+1} caption has digit: {cap}"
            assert cap.endswith('.'), f"Day {d} Part {idx+1} caption missing period: {cap}"
            assert len(cap) <= 75, f"Day {d} Part {idx+1} caption > 75 chars: {cap}"
    print(f"Day {d} visual envelope PASS: schemaVersion=1, 5 entries, exact SHA-256 bindings, valid captions.")
