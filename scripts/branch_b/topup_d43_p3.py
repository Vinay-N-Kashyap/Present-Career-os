# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')

file_path = "scripts/branch_b/generate_ecom_day43.py"
with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

extra_p3 = '''    "Furthermore, the B2B wholesale clearance platform incorporates automated Tiered Buyer Vetting and KYC Compliance workflows. Because liquidated merchandise carries strict regulatory obligations—including international export controls and hazardous materials restrictions for battery products—wholesale bidders must undergo automated corporate verification. The platform cross-references buyer business licenses against international denied-party watchlists, ensuring full statutory trade compliance before granting access to bidding consoles.",'''

text = text.replace('p3_say = [\n', 'p3_say = [\n' + extra_p3 + '\n')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(text)

print("Applied extra p3 paragraph successfully!")
