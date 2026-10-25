with open('tests/bcom_dmkt_days41_45_expansion.test.ts', 'r', encoding='utf-8') as f:
    text = f.read()

for l in text.splitlines():
    if 'visual' in l.lower() or 'hash' in l.lower():
        print(l)
