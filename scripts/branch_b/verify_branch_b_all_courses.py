import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

courses = [
    ("Course 01", "bcom_acc", "src/lib/data/bcomAccountingLongLessons.ts"),
    ("Course 02", "bcom_fin", "src/lib/data/bcomFinanceLongLessons.ts"),
    ("Course 03", "bcom_mkt", "src/lib/data/bcomMktLongLessons.ts"),
    ("Course 04", "bcom_aud", "src/lib/data/bcomAudLongLessons.ts"),
    ("Course 05", "bcom_ban", "src/lib/data/bcomBanLongLessons.ts"),
    ("Course 06", "bcom_dmkt", "src/lib/data/bcomDmktLongLessons.ts"),
    ("Course 07", "bcom_ecom", "src/lib/data/bcomEcomLongLessons.ts"),
]

print("=== VERIFYING EXACT DAY COUNTS PER COURSE IN BRANCH B ===")
for c_num, c_id, fpath in courses:
    with open(fpath, "r", encoding="utf-8") as f:
        txt = f.read()
    days = [int(m) for m in re.findall(r'[\'"]?day[\'"]?\s*:\s*(\d+)', txt)]
    valid_days = sorted(list(set(d for d in days if 1 <= d <= 60)))
    total_valid = len(valid_days)
    missing = [d for d in range(1, 61) if d not in valid_days]
    print(f"\n{c_num}: {c_id}")
    print(f"  File: {fpath}")
    print(f"  Days present ({total_valid}/60): {valid_days[:5]} ... {valid_days[-5:] if len(valid_days) >= 5 else valid_days}")
    if missing:
        print(f"  ⚠️ MISSING DAYS: {missing} ({len(missing)} days remaining)")
    else:
        print(f"  ✅ 100% COMPLETE! (60/60 Days)")
