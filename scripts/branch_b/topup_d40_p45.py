# -*- coding: utf-8 -*-
with open('scripts/branch_b/generate_ecom_day40.py', 'r', encoding='utf-8') as f:
    text = f.read()

p4_sentence = '''    "Additionally, Tier 4 maintains automated reconciliation pipelines connecting with national customs broker electronic data interchange (EDI) systems, verifying that estimated duties collected at checkout match final customs entry liquidations down to the exact penny.",'''

p5_sentence = '''    "This milestone achievement cements our organization's standing as a premier global commerce powerhouse, combining bleeding-edge technology with unassailable fiscal and regulatory discipline.",'''

text = text.replace('p4_say = [\n', 'p4_say = [\n' + p4_sentence + '\n')
text = text.replace('p5_say = [\n', 'p5_say = [\n' + p5_sentence + '\n')

with open('scripts/branch_b/generate_ecom_day40.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Added topup sentences to Day 40 Part 4 and Part 5!")
