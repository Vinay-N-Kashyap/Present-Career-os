import os
import glob
import sys

sys.stdout.reconfigure(encoding='utf-8')

for f in sorted(glob.glob("scripts/branch_b/*54*") + glob.glob("scripts/branch_b/*55*")):
    print(f)
