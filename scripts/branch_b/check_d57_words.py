import json

with open('scripts/branch_b/generate_ecom_day57.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's count words in p1_say through p5_say
for i in range(1, 6):
    start = text.find(f"p{i}_say = [")
    end = text.find(f"# Part {i+1} Code" if i < 5 else "parts = [")
    chunk = text[start:end]
    # rough count
    words = [w for w in chunk.split() if not w.startswith('p') and not w.startswith('#')]
    print(f"p{i}_say lines: {chunk.count('\n')} | rough words: {len(words)}")
