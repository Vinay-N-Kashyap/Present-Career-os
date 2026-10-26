import json
with open('scripts/branch_b/day55_data.json', 'r', encoding='utf-8') as f:
    d = json.load(f)
print('coursePrefix:', d.get('coursePrefix'), 'title:', d.get('title'))
