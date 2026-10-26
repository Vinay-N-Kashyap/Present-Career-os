import sys
import os

# Add scripts directory to path
sys.path.insert(0, os.getcwd())
sys.path.insert(0, os.path.join(os.getcwd(), 'scripts', 'branch_b'))

from create_day31_mkt import day31_data
from create_day32_mkt import day32_data
from create_day33_mkt import day33_data
from create_day34_mkt import day34_data
from create_day35_mkt import day35_data

days = [day31_data, day32_data, day33_data, day34_data, day35_data]

all_passed = True
print("=== BLOCK 7 (DAYS 31-35) PEDAGOGICAL WORD COUNT AUDIT ===")

for day_obj in days:
    day_num = day_obj["day"]
    parts = day_obj["parts"]
    day_words = 0
    print(f"\n--- Day {day_num}: {day_obj['title']} ---")
    if len(parts) != 5:
        print(f"FAILED: Day {day_num} has {len(parts)} parts, expected exactly 5!")
        all_passed = False
        
    for p_idx, part in enumerate(parts):
        words = sum(len(s.split()) for s in part["say"])
        day_words += words
        status = "PASS" if words >= 600 else "FAIL (< 600)"
        if words < 600:
            all_passed = False
        print(f"  Part {p_idx + 1} ({part['title'][:40]}...): {words} words -> {status}")
        
        # Check assessment
        chk = part["check"]
        if chk["answer"] != 0 or chk["answerIndex"] != 0:
            print(f"    FAIL: Check answer/answerIndex must be 0! Got answer={chk['answer']}, answerIndex={chk['answerIndex']}")
            all_passed = False
        if len(chk["options"]) != 4:
            print(f"    FAIL: Check options count must be 4! Got {len(chk['options'])}")
            all_passed = False
        why_words = len(chk["why"].split())
        if why_words < 15:
            print(f"    FAIL: Check why explanation too short ({why_words} words)")
            all_passed = False

    day_status = "PASS" if day_words >= 3000 else "FAIL (< 3000)"
    if day_words < 3000:
        all_passed = False
    print(f"Total Day {day_num} Words: {day_words} -> {day_status}")

if all_passed:
    print("\nALL 25 PARTS IN BLOCK 7 (DAYS 31-35) FULLY SATISFY INVARIANTS (>=600 words/part, >=3,000 words/day, 4 options, answerIndex=0)!")
else:
    print("\nAUDIT FAILED: REMEDIATE SHORT PARTS!")
