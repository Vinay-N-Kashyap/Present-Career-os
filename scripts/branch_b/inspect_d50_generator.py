import re

with open('scripts/branch_b/generate_ecom_day50.py', 'r', encoding='utf-8') as f:
    code = f.read()

# Let's execute the definitions of p1_say..p5_say
ns = {}
exec(compile(code[:code.find('def make_part')], 'gen', 'exec'), ns)
# Now execute the p1..p5 sections without calling make_part
# Just find the parts
import ast
tree = ast.parse(code)
for node in tree.body:
    if isinstance(node, ast.Assign):
        for target in node.targets:
            if isinstance(target, ast.Name) and target.id.endswith('_say') and target.id.startswith('p'):
                val = eval(compile(ast.Expression(node.value), '<string>', 'eval'))
                full_text = ' '.join(val)
                wc = len(full_text.strip().split())
                print(f"{target.id}: {wc} words")
