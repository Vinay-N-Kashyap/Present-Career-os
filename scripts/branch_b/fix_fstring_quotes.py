import re

for fname in ['scripts/branch_b/generate_day56.py', 'scripts/branch_b/generate_day57.py']:
    with open(fname, 'r', encoding='utf-8') as f:
        text = f.read()

    # Pattern: print(f'... \"{var}\" ...')
    # Replace \" with ' or \\\"
    # Specifically, replace \"{ with ' + str( or replace surrounding with single quotes
    # For example: print(f"Localized Script: \"{script}\"") -> print(f"Localized Script: '{script}'")
    # or print(f"  Generated Copy: \"{copy_val}\"")
    
    # Let's replace \"{ with '{ and }\" with }' in print(f"..." statements
    lines = text.splitlines(True)
    new_lines = []
    for l in lines:
        if 'print(f"' in l and '\\"{' in l:
            # Replace \"{ with '{ and }\" with }'
            l = l.replace('\\"{', "'{").replace('}\\"', "}'")
        new_lines.append(l)

    fixed = ''.join(new_lines)
    if fixed != text:
        with open(fname, 'w', encoding='utf-8') as f:
            f.write(fixed)
        print(f"Fixed f-string quotes in {fname}")
    else:
        print(f"No f-string quote fixes in {fname}")
