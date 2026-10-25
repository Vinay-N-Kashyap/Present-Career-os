import json
import os

commerce_dir = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce'
data_file = os.path.join(commerce_dir, 'scripts', 'branch_b', 'day31_dmkt_data.json')

with open(data_file, 'r', encoding='utf-8') as f:
    d = json.load(f)

d['parts'][4]['say'].append(
    "Moreover, by continuously feeding weekly sales updates back into the optimization pipeline, growth teams transition from static annual budgeting to dynamic rolling reallocations. If a specific digital channel begins experiencing sudden saturation or ad fatigue, the algorithm immediately reallocates capital into channels with higher unexhausted marginal returns, sustaining peak marketing capital productivity throughout the fiscal year."
)

with open(data_file, 'w', encoding='utf-8') as f:
    json.dump(d, f, indent=2)

print("Enriched Day 31 Part 5 successfully.")
