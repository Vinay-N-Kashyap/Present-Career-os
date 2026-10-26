for fname in ['generate_ecom_day51.py', 'generate_ecom_day52.py', 'generate_ecom_day53.py']:
    with open('scripts/branch_b/' + fname, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    print(f"=== {fname} ===")
    for line in lines[:15]:
        if 'Title:' in line or 'day =' in line or 'day_5' in line:
            print(' ', line.strip())
