import subprocess
import tempfile
import os
import sys

sys.path.append(os.path.abspath('scripts/branch_a'))
from snippets_data_block11 import SNIPPETS_DATA

outputs = {}

print("Running and capturing terminal output for all 25 snippets in Block 11...")

for day, parts in SNIPPETS_DATA.items():
    outputs[day] = []
    print(f"\n--- Day {day} ---")
    for i, p in enumerate(parts):
        code = p["code"]
        with tempfile.NamedTemporaryFile("w", suffix=".ts", delete=False, encoding="utf-8") as f:
            f.write(code)
            temp_path = f.name
        
        try:
            res = subprocess.run(
                ["npx", "tsx", temp_path],
                capture_output=True,
                text=True,
                encoding="utf-8",
                timeout=15,
                shell=True
            )
            stdout = res.stdout.strip()
            stderr = res.stderr.strip()
            if res.returncode != 0:
                print(f"ERROR on Day {day} Part {i+1}:")
                print("STDERR:", stderr)
                sys.exit(1)
            print(f"Day {day} Part {i+1} Output:\n{stdout}\n")
            outputs[day].append(stdout)
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)

with open('scripts/branch_a/verified_outputs_block11.py', 'w', encoding='utf-8') as f:
    f.write("# Verified terminal outputs for DevOps Block 11 (Days 51-55)\n\nVERIFIED_OUTPUTS = " + repr(outputs) + "\n")

print("\nSuccessfully captured all 25 snippet outputs into scripts/branch_a/verified_outputs_block11.py!")
