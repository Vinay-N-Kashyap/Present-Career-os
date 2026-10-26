import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
grand_total_words = 0

print("=== AUDIT BLOCK 10 (DAYS 46-50) FOR BCOM_ECOM ===")

for day_num in range(46, 51):
    file_path = os.path.join(commerce_dir, "scripts", "branch_b", f"day{day_num}_ecom_data.json")
    assert os.path.exists(file_path), f"Missing data file: {file_path}"
    
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    assert data["day"] == day_num, f"Day mismatch: expected {day_num}, got {data['day']}"
    assert data["coursePrefix"] == "bcom_ecom", f"Prefix mismatch: {data.get('coursePrefix')}"
    assert isinstance(data["recap"], str) and len(data["recap"]) > 30, f"Recap invalid for day {day_num}"
    assert len(data["parts"]) == 5, f"Day {day_num} must have exactly 5 parts"
    
    day_words = 0
    part_word_list = []
    for p_idx, part in enumerate(data["parts"], 1):
        words = len(" ".join(part["say"]).split())
        part_word_list.append(words)
        day_words += words
        assert words >= 600, f"Day {day_num} Part {p_idx} has {words} words (<600)!"
        assert len(part["check"]["options"]) == 4, f"Day {day_num} Part {p_idx} must have 4 options"
        assert part["check"]["answer"] == 0 and part["check"]["answerIndex"] == 0, f"Day {day_num} Part {p_idx} answer must be 0"
        assert len(part["check"]["why"]) >= 30, f"Day {day_num} Part {p_idx} why must be >= 30 chars"
        assert len(part["code"].strip()) > 0, f"Day {day_num} Part {p_idx} code missing"
        assert len(part["output"].strip()) > 0, f"Day {day_num} Part {p_idx} output missing"
        
    assert day_words >= 3000, f"Day {day_num} total words {day_words} < 3000"
    grand_total_words += day_words
    print(f"Day {day_num}: {data['title'][:45]}... | Words: {day_words} | Parts: {part_word_list}")

print(f"\nGrand Total Block 10 Words: {grand_total_words} words (Target: >= 15,000)")
assert grand_total_words >= 15000, f"Grand total {grand_total_words} < 15,000 words"
print("ALL BLOCK 10 INVARIANTS PASS PERFECTLY! READY FOR VISUALS & APPEND!")
