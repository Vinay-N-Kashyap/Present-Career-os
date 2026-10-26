with open("BRANCH_B_TASK_ASSIGNMENT.md", "r", encoding="utf-8") as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r"Course 07|bcom_ecom", text)]
for idx in matches:
    print(text[idx:idx+1500].encode("ascii", "replace").decode("ascii"))
    print("="*60)
