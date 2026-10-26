import sys
import json
import io

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/branch_b/day60_ecom_data.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

for idx, p in enumerate(d['parts']):
    print(f'Testing Day 60 Tier {idx+1} code...')
    code = p['code']
    expected_output = p['output'].strip()

    old_stdout = sys.stdout
    sys.stdout = buffer = io.StringIO()
    try:
        exec(code, {})
        actual_output = buffer.getvalue().strip()
    finally:
        sys.stdout = old_stdout

    assert actual_output == expected_output, f"Output mismatch in Tier {idx+1}:\nExpected:\n{expected_output}\nActual:\n{actual_output}"
    print(f'Tier {idx+1} PASS!')

print('All 5 codes for Day 60 PASS 100%!')
