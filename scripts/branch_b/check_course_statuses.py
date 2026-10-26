import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

with open(r"C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md", "r", encoding="utf-8") as f:
    text = f.read()

courses = [
    ("Course 01", "bcom_acc", "Accounting & Forensic Bookkeeping"),
    ("Course 02", "bcom_fin", "Corporate Finance & Capital Markets"),
    ("Course 03", "bcom_mkt", "Strategic Marketing & Brand Systems"),
    ("Course 04", "bcom_aud", "Statutory Audit & Corporate Assurance"),
    ("Course 05", "bcom_ban", "Banking, Treasury & Credit Operations"),
    ("Course 06", "bcom_dmkt", "Digital Marketing Analytics & Performance"),
    ("Course 07", "bcom_ecom", "E-Commerce Platform Architecture"),
]

for c_num, c_id, c_name in courses:
    # Find all mentions of Day 60 or completion for this course
    matches = re.findall(rf'({c_id}.*?60/60|{c_num}.*?60/60|{c_id}.*?60 Days|{c_num}.*?60 Days)', text, re.IGNORECASE)
    print(f"\n{c_num} - {c_id}:")
    for m in set(matches[:3]):
        print(f"  * {m.strip()[:120]}")
