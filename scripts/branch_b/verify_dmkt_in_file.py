import json
import re
import os

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
dmkt_path = os.path.join(commerce_dir, "src", "lib", "data", "bcomDmktLongLessons.ts")

with open(dmkt_path, "r", encoding="utf-8") as f:
    content = f.read()

quoted = re.findall(r'"day":\s*(\d+)', content)
unquoted = re.findall(r'(?<!\w)day:\s*(\d+)', content)
print(f"Quoted count: {len(quoted)}, unquoted count: {len(unquoted)}")

all_days = sorted(list(set([int(x) for x in quoted + unquoted if int(x) > 0])))
print(f"Total positive distinct days: {len(all_days)}")
print(f"All distinct days: {all_days}")

