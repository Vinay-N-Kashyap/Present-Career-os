# -*- coding: utf-8 -*-
with open('scripts/branch_b/generate_ecom_day36.py', 'r', encoding='utf-8') as f:
    text = f.read()

p5_extra2 = '''    "From an executive governance and audit readiness perspective, the Global Payment Orchestrator generates real-time telemetry metrics directly consumed by Chief Financial Officers (CFOs) and Payment Risk Committees. The orchestrator's analytics dashboard tracks granular Key Performance Indicators (KPIs): Gross Authorization Rate (GAR), Net Conversion Rate (NCR), Average Interchange Cost (AIC in basis points), False Positive Fraud Decline Rates, and Multi-Currency Foreign Exchange Spread Slippage. By providing continuous mathematical transparency into payment economics, the enterprise optimizes transaction routing contracts during annual supplier negotiations with major payment gateways and acquiring banks.",'''
text = text.replace('p5_say = [', 'p5_say = [\n' + p5_extra2)

with open('scripts/branch_b/generate_ecom_day36.py', 'w', encoding='utf-8') as f:
    f.write(text)

print('Topped up Part 5 successfully!')
