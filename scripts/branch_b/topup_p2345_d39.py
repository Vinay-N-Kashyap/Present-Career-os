# -*- coding: utf-8 -*-
with open('scripts/branch_b/generate_ecom_day39.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Add extra paragraph to p2_say
p2_extra3 = '''    "To prevent international tax evasion and audit penalties, European Union tax authorities mandate continuous Transaction Tax Reporting and Electronic Invoicing (e-invoicing). In countries like Italy (Sistema di Interscambio - SdI) and Poland (KSeF), B2B and high-value B2C invoices must be transmitted in standardized XML formats directly to national tax authority gateways before goods are dispatched. The EU VAT engine formats and dispatches these compliant electronic tax manifests automatically, ensuring total alignment with European Union fiscal transparency directives.",'''
text = text.replace('p2_say = [', 'p2_say = [\n' + p2_extra3)

# Add extra paragraph to p3_say
p3_extra3 = '''    "In addition to ad valorem customs duties, landed cost engines must calculate dynamic Special Environmental Tariffs, Electronic Waste Recycling Levies (such as WEEE fees in Europe), and Carbon Border Adjustment Mechanism (CBAM) certificates. For energy-intensive or regulated product categories (such as consumer electronics, batteries, or specialized textiles), these supplemental statutory levies are computed during checkout and itemized on commercial customs invoices, ensuring smooth customs processing.",'''
text = text.replace('p3_say = [', 'p3_say = [\n' + p3_extra3)

# Add extra paragraph to p4_say
p4_extra3 = '''    "From a performance benchmarking standpoint, the tax caching gateway enforces automated Circuit Breaker Resilience Patterns using Netflix Hystrix or resilience4j semantics. If calls to an external tax API fail three consecutive times or average response times exceed five hundred milliseconds, the circuit breaker trips open, diverting all incoming tax requests to the local high-speed in-memory rate matrix for a five-minute cooldown period, preserving checkout availability without crashing worker processes.",'''
text = text.replace('p4_say = [', 'p4_say = [\n' + p4_extra3)

# Add extra paragraph to p5_say
p5_extra3 = '''    "From a customer support and order management perspective, the global tax engine supports automated Tax Adjustment and Refund Recalculation across post-purchase customer workflows. When an order is partially canceled, modified, or returned, the engine recalculates the exact proportional tax credits across state, county, and municipal jurisdictions, issuing auditable credit notes and updating corporate tax liability accounts automatically.",'''
text = text.replace('p5_say = [', 'p5_say = [\n' + p5_extra3)

with open('scripts/branch_b/generate_ecom_day39.py', 'w', encoding='utf-8') as f:
    f.write(text)

print('Topped up Parts 2, 3, 4, 5 successfully!')
