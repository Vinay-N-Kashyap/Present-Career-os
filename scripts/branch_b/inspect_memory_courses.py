import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

with open(r"C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md", "r", encoding="utf-8") as f:
    text = f.read()

courses = [
    "bcom_acc", "bcom_accounting",
    "bcom_fin", "bcom_finance",
    "bcom_mkt",
    "bcom_aud",
    "bcom_ban",
    "bcom_dmkt",
    "bcom_ecom"
]

for c in courses:
    matches = re.findall(rf'(Course \d+.*{c}.*?Complete.*)', text, re.IGNORECASE)
    print(f"=== {c} ===")
    for m in set(matches[:5]):
        print("  *", m.strip()[:100])
