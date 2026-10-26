with open('scripts/branch_b/generate_ecom_day50.py', 'r', encoding='utf-8') as f:
    text = f.read()

import ast
tree = ast.parse(text)
for node in tree.body:
    if isinstance(node, ast.Assign):
        for target in node.targets:
            if isinstance(target, ast.Name) and target.id.endswith('_say') and target.id.startswith('p'):
                val = eval(compile(ast.Expression(node.value), '<string>', 'eval'))
                full_text = ' '.join(val)
                wc = len(full_text.strip().split())
                print(f"=== {target.id}: {len(val)} paragraphs, {wc} words ===")
                for idx, p in enumerate(val):
                    print(f"  P{idx+1} ({len(p.split())} words): {p[:75]}...")
