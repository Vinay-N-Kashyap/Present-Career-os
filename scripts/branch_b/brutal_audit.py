import json
import os
import re
import sys
import hashlib

sys.stdout.reconfigure(encoding='utf-8')

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"

courses_meta = [
    {
        "id": "Course 01",
        "prefix": "bcom_acc",
        "file": "src/lib/data/bcomAccountingLongLessons.ts",
        "var_name": "BCOM_ACCOUNTING_LONG_LESSONS",
        "vis_dir": "src/lib/data/lessonVisuals/bcom-accounting",
        "vis_prefix": "bcom_acc"
    },
    {
        "id": "Course 02",
        "prefix": "bcom_fin",
        "file": "src/lib/data/bcomFinanceLongLessons.ts",
        "var_name": "BCOM_FINANCE_LONG_LESSONS",
        "vis_dir": "src/lib/data/lessonVisuals/bcom-finance",
        "vis_prefix": "bcom_fin"
    },
    {
        "id": "Course 03",
        "prefix": "bcom_mkt",
        "file": "src/lib/data/bcomMktLongLessons.ts",
        "var_name": "BCOM_MKT_LONG_LESSONS",
        "vis_dir": "src/lib/data/lessonVisuals/bcom-marketing",
        "vis_prefix": "bcom_mkt"
    },
    {
        "id": "Course 04",
        "prefix": "bcom_aud",
        "file": "src/lib/data/bcomAudLongLessons.ts",
        "var_name": "BCOM_AUD_LONG_LESSONS",
        "vis_dir": "src/lib/data/lessonVisuals/bcom_aud",
        "vis_prefix": "bcom_aud"
    },
    {
        "id": "Course 05",
        "prefix": "bcom_ban",
        "file": "src/lib/data/bcomBanLongLessons.ts",
        "var_name": "BCOM_BAN_LONG_LESSONS",
        "vis_dir": "src/lib/data/lessonVisuals/bcom_ban",
        "vis_prefix": "bcom_ban"
    },
    {
        "id": "Course 06",
        "prefix": "bcom_dmkt",
        "file": "src/lib/data/bcomDmktLongLessons.ts",
        "var_name": "BCOM_DMKT_LONG_LESSONS",
        "vis_dir": "src/lib/data/lessonVisuals/bcom_dmkt",
        "vis_prefix": "bcom_dmkt"
    },
    {
        "id": "Course 07",
        "prefix": "bcom_ecom",
        "file": "src/lib/data/bcomEcomLongLessons.ts",
        "var_name": "BCOM_ECOM_LONG_LESSONS",
        "vis_dir": "src/lib/data/lessonVisuals/bcom_ecom",
        "vis_prefix": "bcom_ecom"
    }
]

print("=" * 80)
print("     BRANCH B BRUTAL FORENSIC AUDIT: 7 COURSES × 60 DAYS = 420 DAYS     ")
print("=" * 80)

total_branch_words = 0
total_branch_parts = 0
total_branch_visual_files = 0
under_580_parts = []
missing_days = []
missing_visuals = []
malformed_quizzes = []
placeholder_findings = []
digit_in_captions = []

for c_info in courses_meta:
    c_id = c_info["id"]
    prefix = c_info["prefix"]
    ts_file = os.path.join(commerce_dir, c_info["file"])
    vis_dir = os.path.join(commerce_dir, c_info["vis_dir"])

    print(f"\nScanning {c_id} ({prefix}) in {c_info['file']}...")
    if not os.path.exists(ts_file):
        print(f"FATAL: {ts_file} does not exist!")
        continue

    # Read and parse days
    with open(ts_file, "r", encoding="utf-8") as f:
        content = f.read()

    # Search for placeholder tokens
    for p_word in ["TODO", "TBD", "placeholder", "lorem ipsum", "FIXME"]:
        matches = [m.start() for m in re.finditer(r'\b' + p_word + r'\b', content, re.IGNORECASE)]
        if matches:
            placeholder_findings.append((c_id, p_word, len(matches)))

    # Check visuals directory
    if os.path.exists(vis_dir):
        vis_files = [f for f in os.listdir(vis_dir) if f.startswith("day-") and f.endswith(".json")]
        total_branch_visual_files += len(vis_files)
        for d in range(1, 61):
            vf = os.path.join(vis_dir, f"day-{d}.json")
            if not os.path.exists(vf):
                missing_visuals.append((prefix, d))
            else:
                try:
                    with open(vf, "r", encoding="utf-8") as vfp:
                        vdata = json.load(vfp)
                    entries = vdata.get("entries", [])
                    for e_idx, e in enumerate(entries):
                        for step in e.get("spec", {}).get("steps", []):
                            cap = step.get("caption", "")
                            if re.search(r'\d', cap):
                                digit_in_captions.append((prefix, d, e_idx+1, cap))
                except Exception as ex:
                    print(f"Error reading visual {vf}: {ex}")
    else:
        missing_visuals.append((prefix, "ALL_VISUALS_MISSING"))

    print(f"  Visuals found in {c_info['vis_dir']}: {len(os.listdir(vis_dir)) if os.path.exists(vis_dir) else 0} files")

print("\n" + "=" * 80)
print("                  DEEP TS AST / TSX RUNNER CHECK                  ")
print("=" * 80)
