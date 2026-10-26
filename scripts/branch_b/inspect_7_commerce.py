import os
import re
import glob
import sys

sys.stdout.reconfigure(encoding='utf-8')

commerce_files = [
    # Accounting
    ("Course 01", "bcom_acc", ["bcomAccounting", "bcom_acc", "bcomAcc"]),
    # Corporate Finance
    ("Course 02", "bcom_fin", ["bcomFinance", "bcom_fin", "bcomFin"]),
    # Marketing
    ("Course 03", "bcom_mkt", ["bcomMkt", "bcom_mkt", "bcomMarketing"]),
    # Auditing
    ("Course 04", "bcom_aud", ["bcomAud", "bcom_aud", "bcomAudit"]),
    # Banking
    ("Course 05", "bcom_ban", ["bcomBan", "bcom_ban", "bcomBanking"]),
    # Digital Marketing
    ("Course 06", "bcom_dmkt", ["bcomDmkt", "bcom_dmkt", "bcomDigitalMarketing"]),
    # E-Commerce
    ("Course 07", "bcom_ecom", ["bcomEcom", "bcom_ecom", "bcomEcommerce"]),
]

print("=== CHECKING THE 7 BRANCH B COMMERCE COURSES ===")

all_ts_files = glob.glob("src/lib/data/**/*.ts", recursive=True) + glob.glob("src/lib/data/*.ts")

for c_num, c_id, patterns in commerce_files:
    matched_files = set()
    for f in all_ts_files:
        basename = os.path.basename(f)
        for p in patterns:
            if p.lower() in basename.lower():
                matched_files.add(f)
    print(f"\n{c_num}: {c_id}")
    for mf in sorted(matched_files):
        with open(mf, "r", encoding="utf-8") as f:
            txt = f.read()
        days = set(int(m) for m in re.findall(r'[\'"]?day[\'"]?\s*:\s*(\d+)', txt))
        valid_days = [d for d in days if d <= 60]
        max_d = max(valid_days) if valid_days else 0
        min_d = min(valid_days) if valid_days else 0
        print(f"  {os.path.basename(mf):35} -> Range: Day {min_d} to {max_d} ({len(valid_days)} days)")
