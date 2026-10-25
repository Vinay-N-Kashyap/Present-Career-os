import json

with open('scripts/branch_b/day31_dmkt_data.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

print('Day:', d.get('day'))
print('Prefix:', d.get('coursePrefix'))
print('Title:', d.get('title'))
print('Minutes:', d.get('minutes'))
print('Goal:', bool(d.get('goal')))
print('Recap:', bool(d.get('recap')))
print('Parts count:', len(d.get('parts', [])))

for i, p in enumerate(d.get('parts', [])):
    words = len(' '.join(p['say']).split())
    c = p.get('check', {})
    print(f'Part {i+1}: {p["title"][:45]} ({words} words) -> Ans: {c.get("answer")}, AnsIdx: {c.get("answerIndex")}, Opts: {len(c.get("options", []))}, Why: {len(c.get("why", ""))}')
    assert bool(p.get('example')), 'Missing example'
    assert bool(p.get('tryIt')), 'Missing tryIt'
    assert bool(p.get('code')), 'Missing code'
    assert bool(p.get('output')), 'Missing output'
    if c.get('answerIndex') is None:
        c['answerIndex'] = 0
    assert c.get('answer') == 0, 'Answer must be 0'
    assert c.get('answerIndex') == 0, 'AnswerIndex must be 0'

# Save if modified answerIndex
with open('scripts/branch_b/day31_dmkt_data.json', 'w', encoding='utf-8') as f:
    json.dump(d, f, indent=2)
print("Day 31 verified and normalized!")
