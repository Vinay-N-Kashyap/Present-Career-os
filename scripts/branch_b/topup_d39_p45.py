# -*- coding: utf-8 -*-
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/branch_b/generate_ecom_day39.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Add an additional sentence to Part 4
p4_extra_sentence = '''    "Additionally, the tax engine gateway maintains comprehensive audit logging and telemetry pipelines for Prometheus and Grafana, tracking cache hit ratios, external API latency percentiles, and fallback rate execution frequencies across every checkout cluster.",'''

# Add an additional sentence to Part 5
p5_extra_sentence = '''    "Ultimately, this unified architecture enables the global e-commerce enterprise to scale sustainably into new international markets, ensuring that regulatory compliance functions as a competitive advantage rather than an operational bottleneck.",'''

text = text.replace('p4_say = [\n', 'p4_say = [\n' + p4_extra_sentence + '\n')
text = text.replace('p5_say = [\n', 'p5_say = [\n' + p5_extra_sentence + '\n')

with open('scripts/branch_b/generate_ecom_day39.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Added extra sentences to Part 4 and Part 5!")
