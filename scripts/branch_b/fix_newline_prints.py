import re

for fname in ['scripts/branch_b/generate_day56.py', 'scripts/branch_b/generate_day57.py']:
    with open(fname, 'r', encoding='utf-8') as f:
        text = f.read()

    # In python source code, look for print("\n...") inside multi-line strings
    # We want to replace it with print() and print("...")
    def fix_chunk(t):
        lines = t.splitlines(True)
        new_lines = []
        for l in lines:
            if 'print("\\n' in l:
                # Replace print("\nSome Text") with print()\nprint("Some Text")
                prefix = l[:l.find('print("\\n')]
                rest = l[l.find('print("\\n') + len('print("\\n'):]
                new_lines.append(f'{prefix}print()\n')
                new_lines.append(f'{prefix}print("{rest}')
            else:
                new_lines.append(l)
        return ''.join(new_lines)

    fixed = fix_chunk(text)
    if fixed != text:
        with open(fname, 'w', encoding='utf-8') as f:
            f.write(fixed)
        print(f"Fixed {fname}")
    else:
        print(f"No changes in {fname}")
