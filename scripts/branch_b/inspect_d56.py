import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/branch_b/day56_ecom_data.json', 'r', encoding='utf-8') as f:
    d56 = json.load(f)

print('Day 56 Title:', d56.get('title'))
print('Day 56 Goal:', d56.get('goal')[:150])
parts = d56.get('parts', [])
print(f'Parts count: {len(parts)}')
for idx, p in enumerate(parts):
    say_text = ''.join(p['say']) if isinstance(p['say'], list) else p['say']
    words = len(say_text.split())
    print(f'Part {idx+1}: {p["title"]} | Words: {words}')
