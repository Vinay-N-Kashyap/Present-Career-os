# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')

file_path = "scripts/branch_b/generate_ecom_day44.py"
with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

extra_p4 = '''    "Furthermore, the notification architecture integrates with modern conversational AI and two-way messaging channels. When a delivery exception alert is dispatched to a customer via SMS or WhatsApp, the message is not a static one-way broadcast. The customer can reply directly with natural language commands—such as 'Hold at carrier depot' or 'Deliver to my neighbor at Apartment 4B'—which are parsed by intent recognition models and relayed directly to the carrier dispatch API, enabling proactive resolution of delivery friction without human customer support involvement.",'''

extra_p5 = '''    "From a corporate financial governance perspective, the Post-Purchase Command Tower continuously benchmarks carrier delivery performance against contractual freight billing rates. By cross-referencing carrier invoices against verified tracking scan event timestamps, the system automatically detects billing discrepancies—such as unearned Saturday delivery surcharges or incorrect residential delivery classification fees—and submits automated audit claims that protect corporate operating margins from billing creep.",'''

text = text.replace('p4_say = [\n', 'p4_say = [\n' + extra_p4 + '\n')
text = text.replace('p5_say = [\n', 'p5_say = [\n' + extra_p5 + '\n')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(text)

print("Applied extra p4 and p5 paragraphs successfully!")
