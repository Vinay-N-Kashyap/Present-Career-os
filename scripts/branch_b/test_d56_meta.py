import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/branch_b/day56_ecom_data.json', 'r', encoding='utf-8') as f:
    d56 = json.load(f)

assert d56['coursePrefix'] == 'bcom_ecom'
assert d56['day'] == 56
assert d56['minutes'] == 38
assert isinstance(d56['recap'], str) and len(d56['recap']) >= 50

for idx, p in enumerate(d56['parts']):
    chk = p['check']
    assert chk['answer'] == 0
    assert chk['answerIndex'] == 0
    assert len(chk['options']) == 4
    assert len(chk['why']) >= 20
    assert len(chk['explanation']) >= 20
    assert p['example'] and len(p['example']) >= 20
    assert p['tryIt'] and len(p['tryIt']) >= 10

print('Day 56 Socratic checks and metadata ALL PASS 100%!')
