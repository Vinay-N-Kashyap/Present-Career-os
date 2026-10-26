for fname in ['topup_day51_extra.py', 'topup_day52_extra.py', 'topup_day53_extra.py']:
    with open('scripts/branch_b/' + fname, 'r', encoding='utf-8') as f:
        content = f.read()
    print(f"=== {fname} ===")
    for line in content.splitlines()[:20]:
        print(' ', line)
