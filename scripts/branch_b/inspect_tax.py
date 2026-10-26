import json

with open('src/lib/data/bcomTaxLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

idx46 = text.find('"day": 46')
parts_idx = text.find('"parts": [', idx46)
print("Day 46 metadata:")
print(text[idx46-10:parts_idx])
