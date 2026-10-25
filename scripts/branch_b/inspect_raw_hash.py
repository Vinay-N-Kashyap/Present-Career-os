with open('scripts/branch_b/generate_dmkt_visuals_block10.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, l in enumerate(lines):
    if 'raw_hash_input' in l or 'codeHash' in l or 'hashlib' in l:
        print(f"Line {idx+1}: {l.strip()}")
        for k in range(max(0, idx-3), min(len(lines), idx+4)):
            print(f"  {k+1}: {lines[k].rstrip()}")
