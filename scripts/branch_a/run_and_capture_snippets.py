import subprocess
import os
import sys

sys.path.append(os.path.dirname(__file__))
from snippets_data import SNIPPETS

outputs = {}

for (day, part), data in sorted(SNIPPETS.items()):
    code = data['code']
    # Write to a temporary file
    temp_file = f"scripts/branch_a/temp_test_{day}_{part}.ts"
    with open(temp_file, "w", encoding="utf-8") as f:
        f.write(code)
    
    # Run with npx tsx
    proc = subprocess.run(
        ["npx", "tsx", temp_file],
        capture_output=True,
        text=True,
        shell=True
    )
    
    if os.path.exists(temp_file):
        os.remove(temp_file)
        
    if proc.returncode != 0:
        print(f"Error running Day {day} Part {part}:")
        print(proc.stderr)
        sys.exit(1)
        
    out = proc.stdout.strip()
    outputs[(day, part)] = out
    print(f"Day {day} Part {part} Output: {out}")

print("\nALL 25 SNIPPETS COMPILED AND EXECUTED CLEANLY!")

# Write verified outputs back to snippets_data.py or a companion file
with open("scripts/branch_a/verified_outputs.py", "w", encoding="utf-8") as f:
    f.write("# Verified outputs for Days 46 to 50 snippets\nVERIFIED_OUTPUTS = {\n")
    for k, v in sorted(outputs.items()):
        f.write(f"    {k}: {repr(v)},\n")
    f.write("}\n")

print("Saved verified outputs to scripts/branch_a/verified_outputs.py")
