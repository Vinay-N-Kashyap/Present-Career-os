import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/branch_b/day59_ecom_data.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

print('Day 59 Word Counts:')
total = 0
for idx, p in enumerate(d['parts']):
    say_text = ' '.join(p['say']) if isinstance(p['say'], list) else p['say']
    w = len(say_text.split())
    total += w
    print(f'Part {idx+1}: {w} words | {p["title"]}')

print(f'Total words: {total} (Average: {total/5:.1f})')
assert all(len((' '.join(p['say']) if isinstance(p['say'], list) else p['say']).split()) >= 600 for p in d['parts']), "Word count check failed"
print("ALL PARTS >= 600 WORDS!")
