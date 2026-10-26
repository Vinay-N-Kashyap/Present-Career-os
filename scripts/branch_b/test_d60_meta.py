import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/branch_b/day60_ecom_data.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

assert d['coursePrefix'] == 'bcom_ecom'
assert d['day'] == 60
assert d['minutes'] == 60
assert isinstance(d['recap'], str) and len(d['recap']) >= 50

for idx, p in enumerate(d['parts']):
    chk = p['check']
    assert chk['answer'] == 0
    assert chk['answerIndex'] == 0
    assert len(chk['options']) == 4
    assert len(chk['why']) >= 20
    assert len(chk['explanation']) >= 20
    assert p['example'] and len(p['example']) >= 20
    assert p['tryIt'] and len(p['tryIt']) >= 10

print('Day 60 Socratic checks and metadata ALL PASS 100%!')
