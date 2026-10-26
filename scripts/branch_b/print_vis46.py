import json

with open('src/lib/data/lessonVisuals/bcom_dmkt/day-46.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

for idx, entry in enumerate(d['entries']):
    print(f"Entry {idx}: {entry['partTitle']} -> codeHash: {entry['codeHash']}")
