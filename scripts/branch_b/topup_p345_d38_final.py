# -*- coding: utf-8 -*-
with open('scripts/branch_b/generate_ecom_day38.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Add extra paragraph to p3_say
p3_extra4 = '''    "Under European Union and United States consumer contract regulations, promotional voucher terms must be explicitly documented in legal terms-of-service registries. When a coupon code is generated, the system creates an immutable, timestamped legal snapshot defining qualifying minimum spend thresholds, eligible product category taxonomy IDs, maximum redemption limits per household, and explicit expiration deadlines. The stacking validator queries this legal registry to enforce compliance, ensuring that expired vouchers cannot be redeemed and customer service representatives have full transparency into promotional eligibility.",'''
text = text.replace('p3_say = [', 'p3_say = [\n' + p3_extra4)

# Add extra paragraph to p4_say
p4_extra4 = '''    "Furthermore, the promotional abuse engine employs graph neural networks and identity resolution clusters to detect distributed referral fraud rings. When multiple accounts share identical credit card billing addresses, shipping postal routing codes, or device canvas hashes, the graph engine links the accounts into a single synthetic entity graph. Any attempt to funnel referral bonus credits between linked nodes is automatically intercepted and suppressed, protecting customer acquisition budgets from sophisticated affiliate exploitation.",'''
text = text.replace('p4_say = [', 'p4_say = [\n' + p4_extra4)

# Add extra paragraph to p5_say
p5_extra4 = '''    "Finally, the enterprise promotion engine incorporates automated rollbacks and compensating transactions within distributed checkout Sagas. If a customer applies a single-use $50 VIP coupon and proceeds to payment, but the payment gateway transaction subsequently fails due to an expired credit card, the Saga orchestrator dispatches a compensating event to the promotion service, unlocking the consumed voucher and restoring its single-use status so the customer can re-attempt payment without losing their loyalty reward.",'''
text = text.replace('p5_say = [', 'p5_say = [\n' + p5_extra4)

with open('scripts/branch_b/generate_ecom_day38.py', 'w', encoding='utf-8') as f:
    f.write(text)

print('Topped up Parts 3, 4, 5 of Day 38 successfully!')
