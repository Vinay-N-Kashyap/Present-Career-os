import json

for d in range(46, 51):
    with open(f'scripts/branch_b/day{d}_ecom_data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    words = []
    for p in data['parts']:
        text = ' '.join(p['say']) if isinstance(p['say'], list) else p['say']
        words.append(len(text.strip().split()))
    print(f"Day {d} ({data.get('minutes')} mins): total {sum(words)} words, parts: {words}")
