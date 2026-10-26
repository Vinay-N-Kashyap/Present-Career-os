"""
Audit Block 10 (Days 46-50 & Milestone 10 Capstone) for Course 07 (bcom_ecom).
"""
import json
import hashlib
import os
import re

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
scripts_dir = os.path.join(commerce_dir, "scripts", "branch_b")
visuals_dir = os.path.join(commerce_dir, "src", "lib", "data", "lessonVisuals", "bcom_ecom")

total_block10_words = 0
all_passed = True

print("=" * 60)
print("AUDITING COURSE 07 BLOCK 10 (DAYS 46-50 & MILESTONE 10 CAPSTONE)")
print("=" * 60)

for day_num in range(46, 51):
    data_file = os.path.join(scripts_dir, f"day{day_num}_ecom_data.json")
    visual_file = os.path.join(visuals_dir, f"day-{day_num}.json")
    
    assert os.path.exists(data_file), f"Missing data file: {data_file}"
    assert os.path.exists(visual_file), f"Missing visual file: {visual_file}"
    
    with open(data_file, "r", encoding="utf-8") as f:
        day_data = json.load(f)
        
    with open(visual_file, "r", encoding="utf-8") as f:
        visual_data = json.load(f)
        
    assert day_data["coursePrefix"] == "bcom_ecom"
    assert day_data["day"] == day_num
    expected_minutes = 60 if day_num == 50 else 38
    assert day_data["minutes"] == expected_minutes, f"Day {day_num} minutes expected {expected_minutes}, got {day_data['minutes']}"
    assert len(day_data["parts"]) == 5, f"Day {day_num} parts count != 5"
    
    # Audit parts and word counts
    day_words = 0
    part_counts = []
    for p_idx, part in enumerate(day_data["parts"]):
        text = " ".join(part["say"]) if isinstance(part["say"], list) else part["say"]
        w_cnt = len(text.strip().split())
        part_counts.append(w_cnt)
        day_words += w_cnt
        total_block10_words += w_cnt
        
        assert w_cnt >= 580, f"Day {day_num} Part {p_idx+1} has {w_cnt} words (< 580w)!"
        assert part["check"]["answer"] == 0
        assert len(part["check"]["options"]) == 4
        assert len(part["check"]["why"]) >= 20
        assert len(part["code"]) > 10
        assert len(part["output"]) > 5
        
        # Verify visual hash binding
        v_entry = visual_data["entries"][p_idx]
        expected_hash = hashlib.sha256(part["code"].encode("utf-8")).hexdigest()
        assert v_entry["codeHash"] == expected_hash, f"Hash mismatch in Day {day_num} Part {p_idx+1}"
        assert v_entry["partTitle"] == part["title"]
        
        # Verify captions
        for step in v_entry["spec"]["steps"]:
            cap = step["caption"]
            assert not re.search(r'\d', cap), f"Digit found in Day {day_num} Part {p_idx+1} caption: {cap}"
            assert cap.endswith('.'), f"Missing period in Day {day_num} Part {p_idx+1} caption: {cap}"
            assert len(cap) <= 75, f"Caption > 75 chars ({len(cap)}) in Day {day_num} Part {p_idx+1}: {cap}"

    print(f"Day {day_num} PASSED audit: {day_words} words. Parts: {part_counts}")

print("=" * 60)
print(f"ALL 5 DAYS (46-50) PASSED AUDIT! Grand total words: {total_block10_words}")
print("=" * 60)
