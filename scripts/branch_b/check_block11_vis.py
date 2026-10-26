import json
import re

for d in [51, 52, 53]:
    vis_path = f'src/lib/data/lessonVisuals/bcom_ecom/day-{d}.json'
    with open(vis_path, 'r', encoding='utf-8') as f:
        vis = json.load(f)
    print(f"=== DAY {d} VISUALS ===")
    print(f"  schemaVersion: {vis.get('schemaVersion')}, prefix: {vis.get('prefix')}, entries: {len(vis.get('entries', []))}")
    for idx, e in enumerate(vis['entries']):
        for s in e['spec']['steps']:
            cap = s['caption']
            assert not re.search(r'\d', cap), f"Day {d} P{idx+1} has digit: {cap}"
            assert cap.endswith('.'), f"Day {d} P{idx+1} missing period: {cap}"
            assert len(cap) <= 75, f"Day {d} P{idx+1} too long: {cap}"
    print(f"  All 20 captions validated with zero digits, period-terminated, <= 75 chars!")
