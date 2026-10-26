# -*- coding: utf-8 -*-
"""
Audit all 5 days of Block 8 (Days 36-40) for Course 07: bcom_ecom
"""
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
grand_total_words = 0

for day_num in range(36, 41):
    file_path = os.path.join(commerce_dir, "scripts", "branch_b", f"day{day_num}_ecom_data.json")
    assert os.path.exists(file_path), f"File {file_path} missing!"
    
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    assert data["day"] == day_num, f"Day mismatch in {file_path}: {data['day']} != {day_num}"
    assert data.get("coursePrefix") == "bcom_ecom", f"coursePrefix missing or invalid in Day {day_num}: {data.get('coursePrefix')}"
    
    expected_minutes = 60 if day_num == 40 else 38
    assert data.get("minutes") == expected_minutes, f"Minutes invalid for Day {day_num}: {data.get('minutes')} != {expected_minutes}"
    
    assert isinstance(data.get("recap"), str) and len(data["recap"].strip()) > 20, f"Recap invalid in Day {day_num}"
    
    parts = data["parts"]
    assert len(parts) == 5, f"Day {day_num} must have exactly 5 parts, found {len(parts)}"
    
    day_words = 0
    part_word_counts = []
    
    for idx, part in enumerate(parts):
        words = len(" ".join(part["say"]).split())
        part_word_counts.append(words)
        day_words += words
        assert words >= 600, f"Day {day_num} Part {idx+1} under 600 words ({words})"
        assert part.get("example"), f"Day {day_num} Part {idx+1} missing example"
        assert part.get("tryIt"), f"Day {day_num} Part {idx+1} missing tryIt"
        assert part.get("code"), f"Day {day_num} Part {idx+1} missing code"
        assert part.get("output"), f"Day {day_num} Part {idx+1} missing output"
        
        check = part.get("check")
        assert check, f"Day {day_num} Part {idx+1} missing check"
        assert len(check["options"]) == 4, f"Day {day_num} Part {idx+1} options count != 4"
        assert check["answer"] == 0, f"Day {day_num} Part {idx+1} answer != 0"
        assert check["answerIndex"] == 0, f"Day {day_num} Part {idx+1} answerIndex != 0"
        assert len(check["why"]) >= 30, f"Day {day_num} Part {idx+1} why < 30 chars"
        assert check["why"] == check["explanation"], f"Day {day_num} Part {idx+1} why != explanation"

    assert day_words >= 3000, f"Day {day_num} total words < 3000 ({day_words})"
    grand_total_words += day_words
    print(f"Day {day_num} PASSED audit: {day_words} words. Parts: {part_word_counts}")

print("=" * 60)
print(f"ALL 5 DAYS (36-40) PASSED AUDIT! Grand total words: {grand_total_words}")
print("=" * 60)
