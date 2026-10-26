import glob
import os
import re

base = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\src\lib\data'
for f in sorted(glob.glob(os.path.join(base, 'bcom*LongLessons.ts'))):
    fname = os.path.basename(f)
    with open(f, 'r', encoding='utf-8') as fp:
        t = fp.read()
    days = sorted(list(set(int(d) for d in re.findall(r'[\'"]?day[\'"]?\s*:\s*(\d+)', t))))
    m1_days = [d for d in days if 1 <= d <= 30]
    m2_days = [d for d in days if 31 <= d <= 60]
    print(f"{fname:30} | M1 (1-30): {len(m1_days):2d}/30 | M2 (31-60): {len(m2_days):2d}/30 | Total (1-60): {len(m1_days)+len(m2_days):2d}/60")
