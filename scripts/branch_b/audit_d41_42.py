import sys, os
sys.path.insert(0, os.getcwd())
sys.path.insert(0, os.path.join(os.getcwd(), 'scripts', 'branch_b'))

from build_block9_mkt import day41_data, day42_data
from build_block9_days43_45 import day43_data
from day44_data import day44_data
from day45_data import day45_data

for d in [day41_data, day42_data, day43_data, day44_data, day45_data]:
    print(f"=== Day {d['day']} ===")
    for i, p in enumerate(d['parts']):
        wc = sum(len(s.split()) for s in p['say'])
        status = "PASS" if wc >= 600 else f"FAIL ({wc} < 600)"
        print(f"  Part {i+1}: {p['title'][:40]} -> {wc} words [{status}]")
