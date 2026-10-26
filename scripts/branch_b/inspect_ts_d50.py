import json
import re

with open('src/lib/data/bcomEcomLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's check Day 50 in the ts file
match_d50 = re.search(r'\{\s*"coursePrefix":\s*"bcom_ecom",\s*"day":\s*50.*?"parts":\s*\[(.*?)\]\s*\}', text, re.DOTALL)
if match_d50:
    print("Found Day 50 in bcomEcomLongLessons.ts")
    content = match_d50.group(0)
    for kw in ['CPRA', 'Payment & Risk', 'chargeback', 'Visa', 'Mastercard', 'CEBA', 'CBCA-EPA', 'PunchOut']:
        print(f"Keyword '{kw}': {content.count(kw)}")
else:
    print("Could not regex Day 50")
