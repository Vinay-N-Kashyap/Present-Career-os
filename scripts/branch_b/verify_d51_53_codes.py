import json
import subprocess
import sys
import tempfile

sys.stdout.reconfigure(encoding='utf-8')

for day in [51, 52, 53]:
    fpath = f"scripts/branch_b/day{day}_ecom_data.json"
    with open(fpath, "r", encoding="utf-8") as f:
        d = json.load(f)
    print(f"\n=== VERIFYING CODES FOR DAY {day} ===")
    for i, p in enumerate(d['parts']):
        code = p['code']
        expected = p['output'].strip()
        with tempfile.NamedTemporaryFile('w', suffix='.py', delete=False, encoding='utf-8') as tf:
            tf.write(code)
            tf_name = tf.name
        res = subprocess.run([sys.executable, tf_name], capture_output=True, text=True, encoding='utf-8')
        actual = res.stdout.strip()
        if actual != expected:
            print(f"  MISMATCH in Day {day} Part {i+1}:")
            print(f"    Actual:   {actual}")
            print(f"    Expected: {expected}")
        else:
            print(f"  Day {day} Part {i+1} code verified deterministically!")
