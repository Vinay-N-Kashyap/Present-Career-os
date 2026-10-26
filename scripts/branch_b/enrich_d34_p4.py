import json
import os

commerce_dir = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce'
data_file = os.path.join(commerce_dir, 'scripts', 'branch_b', 'day34_dmkt_data.json')

with open(data_file, 'r', encoding='utf-8') as f:
    d = json.load(f)

d['parts'][3]['say'].append(
    "Furthermore, machine-learning-enhanced probabilistic linkage models employ Expectation-Maximization (EM) algorithms to dynamically estimate the conditional m and u probabilities directly from unlabelled data. This unsupervised parameter learning eliminates subjective manual tuning, allowing the probabilistic linkage engine to adapt autonomously as consumer device configurations evolve."
)

with open(data_file, 'w', encoding='utf-8') as f:
    json.dump(d, f, indent=2)

print("Enriched Day 34 Part 4 successfully.")
