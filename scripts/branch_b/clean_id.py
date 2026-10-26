with open('scripts/branch_b/create_day46_tax.py', 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.splitlines()
clean_lines = [l for l in lines if not l.strip().startswith('"id":')]
with open('scripts/branch_b/create_day46_tax.py', 'w', encoding='utf-8') as f:
    f.write('\n'.join(clean_lines))

print("Successfully stripped 'id' from create_day46_tax.py")
