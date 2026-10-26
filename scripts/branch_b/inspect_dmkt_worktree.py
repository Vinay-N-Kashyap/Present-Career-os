import os
import re

commerce_dir = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce'
dmkt_path = os.path.join(commerce_dir, 'src', 'lib', 'data', 'bcomDmktLongLessons.ts')

with open(dmkt_path, 'r', encoding='utf-8') as f:
    text = f.read()

pattern = re.compile(r'coursePrefix[\'"]?\s*:\s*[\'"]bcom_dmkt[\'"].*?[\'"]?day[\'"]?\s*:\s*(\d+)', re.DOTALL)
days = [int(m.group(1)) for m in pattern.finditer(text)]
print('Found days count in Branch B:', len(days))
print('Days in Branch B:', days)
