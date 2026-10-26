import json

for d in range(46, 51):
    fpath = f'scripts/branch_b/day{d}_ecom_data.json'
    with open(fpath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    print(f"=== DAY {d} ===")
    print(f"TITLE: {data.get('title')}")
    print(f"GOAL:  {data.get('goal')}")
    print(f"RECAP: {data.get('recap')}")
