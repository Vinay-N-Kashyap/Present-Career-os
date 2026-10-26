import re
import subprocess
import sys

with open(r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\scripts\branch_b\generate_ecom_day48.py", "r", encoding="utf-8") as f:
    text = f.read()

for p in range(1, 6):
    m_code = re.search(rf'p{p}_code\s*=\s*\"\"\"(.*?)\"\"\"', text, re.DOTALL)
    m_out = re.search(rf'p{p}_output\s*=\s*\"\"\"(.*?)\"\"\"', text, re.DOTALL)
    if m_code and m_out:
        code = m_code.group(1).strip()
        expected = m_out.group(1).strip()
        res = subprocess.run([sys.executable, "-c", code], capture_output=True, text=True, encoding="utf-8")
        actual = res.stdout.strip()
        print(f"Part {p}: Code runs? {res.returncode == 0}. Output match? {actual == expected}")
        if actual != expected:
            print(f"MISMATCH in Part {p}!")
            print(f"Expected:\n{expected}")
            print(f"Actual:\n{actual}")
            if res.stderr:
                print(f"Stderr:\n{res.stderr}")
