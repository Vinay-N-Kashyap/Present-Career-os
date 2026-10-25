import json
import os
import re

commerce_dir = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce'
visuals_dir = os.path.join(commerce_dir, 'src', 'lib', 'data', 'lessonVisuals', 'bcom_dmkt')

all_pass = True

for d in range(31, 36):
    vf = os.path.join(visuals_dir, f"day-{d}.json")
    with open(vf, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    assert data['schemaVersion'] == 1
    assert data['prefix'] == 'bcom_dmkt'
    assert data['day'] == d
    assert len(data['entries']) == 5
    
    for e_idx, entry in enumerate(data['entries']):
        spec = entry['spec']
        assert spec['template'] == 'funnel'
        for s_idx, step in enumerate(spec['steps']):
            cap = step['caption']
            if re.search(r'\d', cap):
                print(f"FAIL: Day {d} Entry {e_idx} Step {s_idx} contains digits: {cap}")
                all_pass = False
            if not cap.endswith('.'):
                print(f"FAIL: Day {d} Entry {e_idx} Step {s_idx} missing period: {cap}")
                all_pass = False
            if len(cap) > 75:
                print(f"FAIL: Day {d} Entry {e_idx} Step {s_idx} exceeds 75 chars ({len(cap)}): {cap}")
                all_pass = False
            for stg in step['stages']:
                if re.search(r'\d', stg['label']):
                    print(f"FAIL: Day {d} Entry {e_idx} Step {s_idx} stage label contains digits: {stg['label']}")
                    all_pass = False

if all_pass:
    print("ALL GATE V2 VISUAL INVARIANTS PASS: Zero digits, period-terminated, <= 75 chars!")
else:
    print("SOME GATE V2 VISUAL CHECKS FAILED!")
