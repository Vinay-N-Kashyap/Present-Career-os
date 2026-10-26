# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')

file_path = "scripts/branch_b/generate_ecom_day42.py"
with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

extra_p5_solid = '''    "From a corporate governance and ESG regulatory perspective, the Sourcing Command Tower generates automated Scope 3 Greenhouse Gas (GHG) accounting ledgers across all inbound ocean, rail, and freight transportation legs. By tracking exact fuel consumption metrics and carrier equipment specifications, the enterprise satisfies European Union Corporate Sustainability Due Diligence Directives (CSDDD) and provides verified carbon emission audits for annual corporate shareholder sustainability filings.",'''

text = text.replace('p5_say = [\n', 'p5_say = [\n' + extra_p5_solid + '\n')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(text)

print("Applied extra p5 solid paragraph!")
