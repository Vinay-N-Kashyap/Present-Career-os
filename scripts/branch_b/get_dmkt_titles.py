import os
import re

commerce_dir = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce'
dmkt_path = os.path.join(commerce_dir, 'src', 'lib', 'data', 'bcomDmktLongLessons.ts')

with open(dmkt_path, 'r', encoding='utf-8') as f:
    text = f.read()

title_pattern = re.compile(r'coursePrefix[\'"]?\s*:\s*[\'"]bcom_dmkt[\'"].*?[\'"]?day[\'"]?\s*:\s*(\d+).*?[\'"]?title[\'"]?\s*:\s*[\'"](.*?)[\'"]', re.DOTALL)
lessons = title_pattern.findall(text)
out_path = os.path.join(commerce_dir, 'scripts', 'branch_b', 'dmkt_m1_titles.txt')
with open(out_path, 'w', encoding='utf-8') as out:
    for d, t in lessons:
        out.write(f"Day {d}: {t}\n")

print(f"Wrote {len(lessons)} titles to {out_path}")
