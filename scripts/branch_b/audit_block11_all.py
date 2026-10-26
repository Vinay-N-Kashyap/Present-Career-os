import json

total_block11_words = 0
for d in range(51, 56):
    with open(f'scripts/branch_b/day{d}_ecom_data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    words = []
    for p in data['parts']:
        text = ' '.join(p['say']) if isinstance(p['say'], list) else p['say']
        words.append(len(text.strip().split()))
    day_total = sum(words)
    total_block11_words += day_total
    print(f"Day {d} ({data.get('minutes')} mins): total {day_total} words, parts: {words}")
    assert len(data['parts']) == 5
    assert data['coursePrefix'] == 'bcom_ecom'
    assert data['day'] == d
    expected_mins = 60 if d == 55 else 38
    assert data['minutes'] == expected_mins, f"Day {d} expected {expected_mins} mins, got {data['minutes']}"
    for p_idx, p in enumerate(data['parts']):
        assert words[p_idx] >= 600, f"Day {d} P{p_idx+1} under 600 words ({words[p_idx]})!"
        assert len(p['check']['options']) == 4
        assert p['check'].get('answer') == 0 or p['check'].get('answerIndex') == 0
        assert len(p['check']['why']) >= 20
        assert len(p['code']) > 20
        assert len(p['output']) > 5

print(f"\nALL 5 DAYS (51-55) VALIDATED! Total Block 11 words: {total_block11_words}")
