import re

with open('scripts/branch_b/test_ecom_day54_codes.py', 'r', encoding='utf-8') as f:
    text = f.read()

parts = re.split(r'=== PART \d:.*? ===', text)
print(f"Parts found in test_ecom_day54_codes.py: {len(parts)-1}")
for idx, p in enumerate(parts[1:]):
    print(f"Part {idx+1} lines: {len(p.strip().splitlines())}")
