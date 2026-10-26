# -*- coding: utf-8 -*-
import json
with open('scripts/branch_b/day52_ban_data.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

for idx, p in enumerate(d['parts']):
    print(f"Part {idx+1}: example={bool(p.get('example'))}, tryIt={bool(p.get('tryIt'))}, code={bool(p.get('code'))}, output={bool(p.get('output'))}")
