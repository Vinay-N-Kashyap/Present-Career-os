# -*- coding: utf-8 -*-
with open('scripts/branch_b/generate_ecom_day39.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Add extra paragraph to p5_say
p5_extra5 = '''    "Under modern microservice architectures, the global tax engine operates with zero runtime dependency on external payment gateways or storefront frameworks. By communicating through standardized JSON and Protocol Buffer contracts, the tax engine can be invoked seamlessly across mobile checkout applications, B2B wholesale portals, and headless voice commerce interfaces, providing consistent, mathematically audited tax and landed duty calculations across every commercial sales channel.",'''
text = text.replace('p5_say = [', 'p5_say = [\n' + p5_extra5)

with open('scripts/branch_b/generate_ecom_day39.py', 'w', encoding='utf-8') as f:
    f.write(text)

print('Topped up Part 5 of Day 39 successfully!')
