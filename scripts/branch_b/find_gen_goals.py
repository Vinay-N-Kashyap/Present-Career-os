for fname in ['generate_ecom_day47.py', 'generate_ecom_day48.py']:
    with open('scripts/branch_b/' + fname, 'r', encoding='utf-8') as f:
        c = f.read()
    for line in c.splitlines():
        if '"goal"' in line:
            print(fname, ':', line[:100])
