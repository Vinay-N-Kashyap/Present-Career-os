import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/branch_b/day60_ecom_data.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

t3_out = '''Tier 3 Seller Governance & Buy Box Synthesis:
  Buy Box Winner:          SEL-VET-01
  Winning Offer Price:     $199.00
  Composite Buy Box Score: 64.9 pts
  Optimization Status:     [TIER3_BUY_BOX_ALLOCATION_OPTIMAL]'''

d['parts'][2]['output'] = t3_out

with open('scripts/branch_b/day60_ecom_data.json', 'w', encoding='utf-8') as f:
    json.dump(d, f, indent=2, ensure_ascii=False)

print("Updated Day 60 Tier 3 output.")
