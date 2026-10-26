"""
Check Block 11 word counts and invariants across Days 51 to 55.
"""
import importlib
import sys
import os

sys.path.insert(0, os.getcwd())
sys.path.insert(0, os.path.join(os.getcwd(), 'scripts', 'branch_b'))

days = [
    ("create_day51_tax", "get_day51_data"),
    ("create_day52_tax", "get_day52_data"),
    ("create_day53_tax", "get_day53_data"),
    ("create_day54_tax", "get_day54_data"),
    ("create_day55_tax", "get_day55_data"),
]

all_passed = True

for mod_name, func_name in days:
    mod = importlib.import_module(f"scripts.branch_b.{mod_name}")
    data = getattr(mod, func_name)()
    day_num = data["day"]
    title = data["title"]
    parts = data["parts"]
    print(f"\n=== Day {day_num}: {title} ===")
    total_words = 0
    for idx, part in enumerate(parts):
        say_text = " ".join(part["say"])
        words = len(say_text.split())
        total_words += words
        has_id = "id" in part
        check = part.get("check", {})
        options = check.get("options", [])
        ans = check.get("answer")
        ans_idx = check.get("answerIndex")
        why = check.get("why", "")
        why_words = len(why.split())
        
        status = "OK"
        if words < 600:
            status = f"FAIL (< 600 words: {words})"
            all_passed = False
        if has_id:
            status += " FAIL (has 'id')"
            all_passed = False
        if len(options) != 4 or ans != 0 or ans_idx != 0:
            status += f" FAIL (quiz options={len(options)}, ans={ans}, ans_idx={ans_idx})"
            all_passed = False
        if why_words < 10:
            status += f" FAIL (why words < 10: {why_words})"
            all_passed = False
            
        print(f"  Part {idx+1} ('{part['title']}'): {words} words | why: {why_words}w | {status}")
    print(f"  Total words for Day {day_num}: {total_words}")

if all_passed:
    print("\n>>> ALL BLOCK 11 DAYS (51-55) 100% PASS INVARIANTS! <<<")
else:
    print("\n>>> SOME INVARIANTS FAILED! <<<")
