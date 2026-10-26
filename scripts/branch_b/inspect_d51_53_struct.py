import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

for day in [51, 52, 53]:
    with open(f"scripts/branch_b/day{day}_ecom_data.json", "r", encoding="utf-8") as f:
        d = json.load(f)
    print(f"\n=== INSPECTING DAY {day} STRUCTURE ===")
    print(f"Title: {d.get('title')}")
    print(f"CoursePrefix: {d.get('coursePrefix')}")
    print(f"Minutes: {d.get('minutes')}")
    print(f"Recap type: {type(d.get('recap'))}")
    p1 = d['parts'][0]
    print(f"Part 1 keys: {list(p1.keys())}")
    print(f"Check keys: {list(p1.get('check', {}).keys())}")
    print(f"Check options count: {len(p1.get('check', {}).get('options', []))}")
    print(f"Check answer: {p1.get('check', {}).get('answer')}")
    print(f"Check why length: {len(p1.get('check', {}).get('why', ''))}")
