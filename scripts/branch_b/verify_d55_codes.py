import json
import subprocess

with open('scripts/branch_b/day55_ecom_data.json', 'r', encoding='utf-8') as f:
    d55 = json.load(f)

for idx, p in enumerate(d55['parts']):
    res = subprocess.run(['python', '-c', p['code']], capture_output=True, text=True)
    assert res.returncode == 0, f"Part {idx+1} code failed: {res.stderr}"
    clean_out = res.stdout.strip().replace('\r\n', '\n')
    expected_out = p['output'].strip().replace('\r\n', '\n')
    assert clean_out == expected_out, f"Part {idx+1} output mismatch:\nExpected:\n{expected_out}\nGot:\n{clean_out}"
    print(f"Part {idx+1} code and output verified 100% match!")
