# -*- coding: utf-8 -*-
"""
Audit all 5 days (Days 31-35) for Course 07: bcom_ecom Month 2 Block 7
"""
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

days = [31, 32, 33, 34, 35]
block_total_words = 0
all_passed = True

print("=" * 80)
print("AUDITING BCOM_ECOM MONTH 2 BLOCK 7 (DAYS 31-35)")
print("=" * 80)

for day_num in days:
    file_path = f"scripts/branch_b/day{day_num}_ecom_data.json"
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    expected_minutes = 60 if day_num == 35 else 38
    assert data["coursePrefix"] == "bcom_ecom", f"Day {day_num} coursePrefix mismatch: {data['coursePrefix']}"
    assert data["day"] == day_num, f"Day {day_num} day mismatch: {data['day']}"
    assert data["minutes"] == expected_minutes, f"Day {day_num} minutes mismatch: {data['minutes']} != {expected_minutes}"
    assert isinstance(data["recap"], str), f"Day {day_num} recap must be string"
    assert len(data["parts"]) == 5, f"Day {day_num} must have exactly 5 parts"
    
    part_words = []
    for p_idx, part in enumerate(data["parts"], 1):
        say = part.get("say", [])
        if isinstance(say, list):
            words = len(" ".join(say).split())
        else:
            words = len(str(say).split())
        part_words.append(words)
        
        # Verify check
        check = part.get("check", {})
        assert check.get("answer") == 0, f"Day {day_num} Part {p_idx} answer must be 0"
        assert check.get("answerIndex") == 0, f"Day {day_num} Part {p_idx} answerIndex must be 0"
        assert len(check.get("options", [])) == 4, f"Day {day_num} Part {p_idx} options must be 4"
        assert len(check.get("why", "")) >= 30, f"Day {day_num} Part {p_idx} why must be >= 30 chars"
        assert check.get("why") == check.get("explanation"), f"Day {day_num} Part {p_idx} explanation mismatch"
        
        # Verify code
        assert len(part.get("code", "").strip()) > 0, f"Day {day_num} Part {p_idx} code must not be empty"
        assert len(part.get("output", "").strip()) > 0, f"Day {day_num} Part {p_idx} output must not be empty"
        assert len(part.get("example", "").strip()) > 0, f"Day {day_num} Part {p_idx} example must not be empty"
        assert len(part.get("tryIt", "").strip()) > 0, f"Day {day_num} Part {p_idx} tryIt must not be empty"
        
        if words < 600:
            print(f"FAILED: Day {day_num} Part {p_idx} has {words} words (< 600)!")
            all_passed = False
    
    day_total = sum(part_words)
    block_total_words += day_total
    all_ge_600 = all(w >= 600 for w in part_words)
    status = "PASS" if all_ge_600 and day_total >= 3000 else "FAIL"
    print(f"Day {day_num}: {status} | Total: {day_total:4d} words | Parts: {part_words} | Minutes: {data['minutes']}")

print("=" * 80)
print(f"Block 7 Cumulative Words: {block_total_words} words (Target: >= 15,000 words)")
print(f"Block 7 Word Target Met: {block_total_words >= 15000}")
print(f"Overall Audit Status: {'100% PASSED' if all_passed and block_total_words >= 15000 else 'FAILED'}")
print("=" * 80)
