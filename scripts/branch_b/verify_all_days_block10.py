import json

for d in range(46, 51):
    fpath = f'scripts/branch_b/day{d}_ecom_data.json'
    with open(fpath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    print(f"=== DAY {d} ===")
    print(f"  title: {data.get('title')[:60]}...")
    print(f"  goal: {data.get('goal')[:60]}...")
    print(f"  minutes: {data.get('minutes')}")
    print(f"  parts count: {len(data.get('parts', []))}")
    for idx, p in enumerate(data['parts']):
        words = len((' '.join(p['say']) if isinstance(p['say'], list) else p['say']).split())
        assert words >= 600, f"Day {d} Part {idx+1} under 600 words ({words})!"
        assert len(p['check']['options']) == 4
        assert p['check'].get('answer') == 0 or p['check'].get('answerIndex') == 0
        assert len(p['check']['why']) >= 20
        assert len(p['code']) > 20
        assert len(p['output']) > 5
    print(f"  All 5 parts strictly >= 600 words and validated!")
