# -*- coding: utf-8 -*-
with open('scripts/branch_b/generate_ecom_day38.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Add extra paragraph to p2_say
p2_extra3 = '''    "Moreover, enterprise RETE engines support Conflict Resolution Strategies when multiple competing rules match the same shopping cart facts. For example, if a customer qualifies for both a $15 loyalty reward and a 20% brand promotion that cannot be combined, the RETE agenda evaluates rule priorities, specificity scores (rules with more specific condition predicates take precedence over broad rules), and maximum consumer benefit heuristics to select the optimal promotion automatically, ensuring deterministic execution and eliminating rule evaluation deadlocks.",'''
text = text.replace('p2_say = [', 'p2_say = [\n' + p2_extra3)

# Add extra paragraph to p3_say
p3_extra3 = '''    "In addition to customer-facing promo codes, the stacking engine coordinates Automated Cart-Level Promotions (such as 'Free Gift with $100 Purchase'). The validator dynamically injects eligible promotional gift SKUs directly into the cart state while marking their line-item price as zero. If the customer subsequently removes items and drops their cart subtotal below the qualifying threshold, the validator automatically purges the promotional gift SKU, preventing inventory leakage.",'''
text = text.replace('p3_say = [', 'p3_say = [\n' + p3_extra3)

# Add extra paragraph to p4_say
p4_extra3 = '''    "To prevent affiliate marketing coupon hijackings, where rogue affiliate coupon sites scrape and re-publish private single-use email discount codes, the abuse defense engine binds each generated voucher code to a cryptographic hash of the recipient's customer ID. When the code is entered in checkout, the validator decrypts the token and verifies account ownership; if an unauthorized customer attempts to redeem the voucher, the coupon is rejected with an 'Invalid Account Assignment' error.",'''
text = text.replace('p4_say = [', 'p4_say = [\n' + p4_extra3)

# Add extra paragraph to p5_say
p5_extra3 = '''    "From an executive audit perspective, the enterprise promotion engine generates daily Promotion Efficiency and Margin Dilution Reports for Chief Financial Officers and Marketing Directors. These reports quantify incremental revenue lift versus margin sacrificed across every active promotional campaign, enabling corporate leadership to prune underperforming promotions and double down on high-margin customer acquisition channels.",'''
text = text.replace('p5_say = [', 'p5_say = [\n' + p5_extra3)

with open('scripts/branch_b/generate_ecom_day38.py', 'w', encoding='utf-8') as f:
    f.write(text)

print('Topped up Parts 2, 3, 4, 5 successfully!')
