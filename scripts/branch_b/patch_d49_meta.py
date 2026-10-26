with open('scripts/branch_b/generate_ecom_day49.py', 'r', encoding='utf-8') as f:
    content = f.read()

target = '''day_49_data = {
    "day": 49,
    "title": "Contract Pricing Engines, Complex Tiered Volume Rebates & Dynamic B2B Quoting Workflows (CPQ)",
    "coursePrefix": "bcom_ecom",
    "recap":'''

replacement = '''day_49_data = {
    "day": 49,
    "title": "Contract Pricing Engines, Complex Tiered Volume Rebates & Dynamic B2B Quoting Workflows (CPQ)",
    "coursePrefix": "bcom_ecom",
    "goal": "Architect enterprise B2B contract pricing resolution engines, deterministic stepped and marginal volume calculators, retrospective rebate accrual ledgers under ASC 606, CPQ quotation workflows with automated margin hurdle approval gatekeepers, and executive pocket margin pricing waterfalls.",
    "minutes": 38,
    "recap":'''

assert target in content, "Target not found in generate_ecom_day49.py"
new_content = content.replace(target, replacement, 1)

with open('scripts/branch_b/generate_ecom_day49.py', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Updated generate_ecom_day49.py successfully")
