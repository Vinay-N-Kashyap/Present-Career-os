import json

with open(r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\scripts\branch_b\day48_ecom_data.json", "r", encoding="utf-8") as f:
    d = json.load(f)

test_code = """# -*- coding: utf-8 -*-
\"\"\"
Deterministic Python test suite for Course 07: bcom_ecom Day 48
Enterprise Invoicing, Credit Limit Engines, Net-Terms Financing (Net 30/60/90) & Automated Dunning
\"\"\"
import sys
sys.stdout.reconfigure(encoding='utf-8')

"""

for p_idx, part in enumerate(d["parts"]):
    test_code += f"print('=== PART {p_idx+1}: {part[\"title\"].upper()} ===')\n"
    test_code += part["code"] + "\n\n"

with open(r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\scripts\branch_b\test_ecom_day48_codes.py", "w", encoding="utf-8") as f:
    f.write(test_code)

print("Synchronized test_ecom_day48_codes.py with day48_ecom_data.json!")
