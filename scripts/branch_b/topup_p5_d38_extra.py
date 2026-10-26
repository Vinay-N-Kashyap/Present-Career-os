# -*- coding: utf-8 -*-
with open('scripts/branch_b/generate_ecom_day38.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Add extra paragraph to p5_say
p5_extra5 = '''    "From a developer platform and API ecosystem perspective, the enterprise promotion engine exposes declarative GraphQL mutations and REST endpoints that integrate with headless storefronts, mobile SDKs, and third-party marketplace middleware. Through strict schema typing and OpenAPI contracts, external integrations can query eligible promotion previews, simulate hypothetical cart discount totals, and display dynamic checkout banners (e.g., 'Add $12.50 more to unlock free shipping!') without executing server-side state mutations, creating an intuitive, friction-free shopping journey.",'''
text = text.replace('p5_say = [', 'p5_say = [\n' + p5_extra5)

with open('scripts/branch_b/generate_ecom_day38.py', 'w', encoding='utf-8') as f:
    f.write(text)

print('Topped up Part 5 of Day 38 successfully!')
