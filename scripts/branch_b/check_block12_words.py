"""
Check Block 12 word counts and invariants across Days 56 to 60.
"""
import importlib
import sys
import os

sys.path.insert(0, os.getcwd())
sys.path.insert(0, os.path.join(os.getcwd(), 'scripts', 'branch_b'))

days = [
    ("create_day56_tax", "get_day56_data"),
    ("create_day57_tax", "get_day57_data"),
    ("create_day58_tax", "get_day58_data"),
    ("create_day59_tax", "get_day59_data"),
    ("create_day60_tax", "get_day60_data"),
]

all_passed = True

for mod_name, func_name in days:
    mod = importlib.import_module(mod_name)
    data = getattr(mod, func_name)()
    day_num = data["day"]
    title = data["title"]
    parts = data["parts"]
    print(f"\n=== Day {day_num}: {title} ===")
    total_words = 0
    for idx, part in enumerate(parts):
        say_text = " ".join(part["say"]) if isinstance(part["say"], list) else part["say"]
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
    print("\n>>> ALL BLOCK 12 DAYS (56-60) 100% PASS INVARIANTS! <<<")
else:
    print("\n>>> SOME INVARIANTS FAILED! <<<")
