# -*- coding: utf-8 -*-
with open('scripts/branch_b/generate_ecom_day41.py', 'r', encoding='utf-8') as f:
    text = f.read()

p2_extra = '''    "Furthermore, the sourcing engine applies Dynamic Surcharge Smoothing when evaluating peak-season carrier rate charts, ensuring that unexpected holiday parcel surcharges or temporary fuel index adjustments do not trigger erratic routing oscillations between regional warehouse nodes.",'''

p3_extra = '''    "Additionally, the order management system coordinates with enterprise warehouse management systems to implement Wave Consolidation Buffering, grouping orders destined for identical metropolitan zip codes into synchronized batch fulfillment waves.",'''

p4_extra = '''    "Moreover, the store associate fulfillment console maintains real-time integration with in-store electronic shelf labels (ESLs), triggering visual LED flash prompts on physical display shelves to accelerate associate item localization during high-volume peak picking hours.",'''

text = text.replace('p2_say = [\n', 'p2_say = [\n' + p2_extra + '\n')
text = text.replace('p3_say = [\n', 'p3_say = [\n' + p3_extra + '\n')
text = text.replace('p4_say = [\n', 'p4_say = [\n' + p4_extra + '\n')

with open('scripts/branch_b/generate_ecom_day41.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Added extra sentences to Day 41 Parts 2, 3, and 4!")
