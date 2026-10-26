import json
for d in range(46, 51):
    with open(f'scripts/branch_b/day{d}_ecom_data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    print(f"Day {d} JSON minutes: {data.get('minutes')}")
