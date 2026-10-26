# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')

file_path = "scripts/branch_b/generate_ecom_day42.py"
with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

# Add a rich paragraph to p3_say (~60 words)
extra_p3 = '''    "Moreover, the ASN reconciliation engine interfaces with dynamic yard inventory visualization platforms, allowing facility managers to view real-time 3D digital twins of dock receiving staging areas. When a discrepancy is detected, the affected pallet is highlighted in red on the facility digital twin, directing autonomous mobile robots (AMRs) to transport the pallet to the quality control holding area without human intervention.",'''

# Add an extra paragraph to p4_say and p5_say if needed
extra_p4 = '''    "In addition, modern 3PL integration layers utilize standardized Webhook Signature Verification using HMAC-SHA256 headers. When a 3PL fires an event webhook to the enterprise gateway, the system computes the cryptographic hash using a pre-shared secret, verifying message authenticity and origin before updating core order status ledgers.",'''

extra_p5 = '''    "Ultimately, the Sourcing Command Tower enables prescriptive supply chain decision-making by combining predictive machine learning models with real-time operational telemetry, turning raw logistics data into actionable business resilience across global fulfillment networks.",'''

text = text.replace('p3_say = [\n', 'p3_say = [\n' + extra_p3 + '\n')
text = text.replace('p4_say = [\n', 'p4_say = [\n' + extra_p4 + '\n')
text = text.replace('p5_say = [\n', 'p5_say = [\n' + extra_p5 + '\n')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(text)

print("Applied extra paragraphs to Day 42 successfully!")
