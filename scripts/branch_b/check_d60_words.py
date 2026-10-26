import json

with open('scripts/branch_b/generate_ecom_day60.py', 'r', encoding='utf-8') as f:
    text = f.read()

for i in range(1, 6):
    start = text.find(f"p{i}_say = [")
    end = text.find(f"# Part {i+1} Code" if i < 5 else "parts = [")
    chunk = text[start:end]
    words = [w for w in chunk.split() if not w.startswith('p') and not w.startswith('#')]
    print(f"p{i}_say rough words: {len(words)}")
