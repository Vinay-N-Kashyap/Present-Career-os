import json, os, sys

sys.stdout.reconfigure(encoding='utf-8')

for day in [56, 57, 58, 59, 60]:
    path = f"scripts/branch_b/day{day}_ban_data.json"
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            d = json.load(f)
        print(f"=== DAY {day}: {d.get('title')} ===")
        print(f"Minutes: {d.get('minutes')}")
        total_w = 0
        for i, p in enumerate(d.get("parts", [])):
            say_content = p.get("say", "")
            if isinstance(say_content, list):
                full_text = " ".join(say_content)
            else:
                full_text = str(say_content)
            wc = len(full_text.strip().split())
            total_w += wc
            has_check = "check" in p and p["check"].get("answerIndex") == 0
            opt_cnt = len(p.get("check", {}).get("options", []))
            print(f"  Part {i+1}: {wc} words | Title: {p.get('title')} | check valid: {has_check} ({opt_cnt} opts)")
        print(f"Total words: {total_w}\n")
    else:
        print(f"Day {day} file does NOT exist.\n")
