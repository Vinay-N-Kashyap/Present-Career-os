# -*- coding: utf-8 -*-
with open('scripts/branch_b/generate_ecom_day38.py', 'r', encoding='utf-8') as f:
    text = f.read()

pos1 = text.find('class DiscountWaterfallEngine:')
end1 = text.find('engine = DiscountWaterfallEngine(')
c1 = text[pos1:end1].strip()

pos3 = text.find('class CouponStackingValidator:')
end3 = text.find('validator = CouponStackingValidator()')
c3 = text[pos3:end3].strip()

pos4 = text.find('class PromoAbuseDetector:')
end4 = text.find('detector = PromoAbuseDetector()')
c4 = text[pos4:end4].strip()

standalone_prep = c1 + "\n\n" + c3 + "\n\n" + c4 + "\n\n"

old_p5 = 'p5_code = """class EnterprisePromotionEngine:'
new_p5 = 'p5_code = """' + standalone_prep + 'class EnterprisePromotionEngine:'

assert old_p5 in text, "Target string old_p5 not found in text"
text = text.replace(old_p5, new_p5, 1)

with open('scripts/branch_b/generate_ecom_day38.py', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated p5_code in generate_ecom_day38.py successfully!')
