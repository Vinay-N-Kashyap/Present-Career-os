import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/branch_b/day56_ecom_data.json', 'r', encoding='utf-8') as f:
    d56 = json.load(f)

for idx, p in enumerate(d56['parts']):
    print(f'Testing Day 56 Part {idx+1} code...')
    code = p['code']
    expected_output = p['output'].strip()
    
    # Capture output
    import io
    old_stdout = sys.stdout
    sys.stdout = buffer = io.StringIO()
    try:
        exec(code, {})
        actual_output = buffer.getvalue().strip()
    finally:
        sys.stdout = old_stdout
        
    assert actual_output == expected_output, f"Output mismatch in Part {idx+1}:\nExpected:\n{expected_output}\nActual:\n{actual_output}"
    print(f'Part {idx+1} PASS!')

print('All 5 codes for Day 56 PASS 100%!')
