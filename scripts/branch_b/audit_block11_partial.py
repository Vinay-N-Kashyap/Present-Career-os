import json
import os

for d in [51, 52, 53]:
    fpath = f'scripts/branch_b/day{d}_ecom_data.json'
    if os.path.exists(fpath):
        with open(fpath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        words = []
        for p in data['parts']:
            text = ' '.join(p['say']) if isinstance(p['say'], list) else p['say']
            words.append(len(text.strip().split()))
        print(f"Day {d} ({data.get('minutes')} mins): total {sum(words)} words, parts: {words}")
        print(f"  title: {data.get('title')[:60]}...")
        print(f"  goal:  {data.get('goal')[:60]}...")
    else:
        print(f"Day {d} JSON NOT FOUND")
