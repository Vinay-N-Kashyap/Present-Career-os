# -*- coding: utf-8 -*-
with open('scripts/branch_b/generate_ecom_day39.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace € with EUR in p2 and p5 code and output
text = text.replace('VAT: €{v1', 'VAT: €{v1') # wait, let's look at how € is used

# Let's replace € with EUR in code and output strings for p2 and p5
# In p2_code and p2_output:
text = text.replace('€{v1[\'vat_due_eur\']}', '€{v1[\'vat_due_eur\']}')
# Actually, if we add import sys; sys.stdout.reconfigure(encoding='utf-8') to each code snippet, Python will always emit utf-8!
# Let's add that to all 5 parts codes:
for p in range(1, 6):
    old_def = f'p{p}_code = """'
    new_def = f'p{p}_code = """import sys\\nsys.stdout.reconfigure(encoding=\\\'utf-8\\\')\\n'
    # But let's check if old_def exists
    if old_def in text:
        text = text.replace(old_def, f'p{p}_code = """import sys\nsys.stdout.reconfigure(encoding=\'utf-8\')\n', 1)

with open('scripts/branch_b/generate_ecom_day39.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated generate_ecom_day39.py with utf-8 reconfigure!")
