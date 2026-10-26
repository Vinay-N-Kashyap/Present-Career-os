with open('scripts/branch_b/generate_ecom_day50.py', 'r', encoding='utf-8') as f:
    content = f.read()

target = '''day_50_data = {
    "day": 50,
    "title": "Milestone 10 Capstone: Global Enterprise B2B Composable Commerce & Procurement Command Tower",
    "coursePrefix": "bcom_ecom",
    "recap":'''

replacement = '''day_50_data = {
    "day": 50,
    "title": "Milestone 10 Capstone: Global Enterprise B2B Composable Commerce & Procurement Command Tower",
    "coursePrefix": "bcom_ecom",
    "goal": "Synthesize sovereign enterprise B2B composable commerce architecture across cXML PunchOut gateways, corporate organizational hierarchies with SOX 404 Separation of Duties, revolving trade credit risk engines with Net-terms settlements, dynamic CPQ margin hurdle gatekeepers with ASC 606 volume rebate ledgers, and the Global Procurement Command Tower conferring CBCA-EPA professional accreditation.",
    "minutes": 60,
    "recap":'''

assert target in content, "Target not found in generate_ecom_day50.py"
new_content = content.replace(target, replacement, 1)

with open('scripts/branch_b/generate_ecom_day50.py', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Updated generate_ecom_day50.py successfully")
