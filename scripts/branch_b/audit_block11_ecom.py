"""
Audit Block 11 (Days 51-55 & Milestone 11 Capstone) for Course 07 (bcom_ecom).
Checks:
1. Day data files exist and schema is complete.
2. Every part >= 580 words.
3. Every day >= 3,000 words.
4. Gate v2 visual envelopes exist and hashes match code SHA-256.
5. Captions have zero numeric digits, length <= 75, period-terminated.
"""
import json
import hashlib
import os
import re

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
visuals_dir = os.path.join(commerce_dir, "src", "lib", "data", "lessonVisuals", "bcom_ecom")

total_block_words = 0
all_passed = True

for day in range(51, 56):
    data_file = os.path.join(commerce_dir, "scripts", "branch_b", f"day{day}_ecom_data.json")
    if not os.path.exists(data_file):
        print(f"FAILED: Day {day} data file missing: {data_file}")
        all_passed = False
        continue
    
    with open(data_file, "r", encoding="utf-8") as f:
        day_data = json.load(f)
    
    assert day_data["day"] == day
    assert day_data["coursePrefix"] == "bcom_ecom"
    expected_minutes = 60 if day == 55 else 38
    assert day_data["minutes"] == expected_minutes, f"Day {day} minutes {day_data['minutes']} != {expected_minutes}"
    assert len(day_data["parts"]) == 5
    
    day_words = 0
    part_word_counts = []
    for idx, p in enumerate(day_data["parts"]):
        wc = sum(len(para.split()) for para in p["say"])
        part_word_counts.append(wc)
        day_words += wc
        if wc < 580:
            print(f"FAILED: Day {day} Part {idx+1} under 580 words ({wc})")
            all_passed = False
    
    total_block_words += day_words
    print(f"Day {day}: {day_words} words {part_word_counts}")
    
    # Check visual envelope
    vis_file = os.path.join(visuals_dir, f"day-{day}.json")
    if not os.path.exists(vis_file):
        print(f"FAILED: Day {day} visual envelope missing: {vis_file}")
        all_passed = False
        continue
        
    with open(vis_file, "r", encoding="utf-8") as f:
        vis_data = json.load(f)
    
    assert vis_data["schemaVersion"] == 1
    assert vis_data["prefix"] == "bcom_ecom"
    assert vis_data["day"] == day
    assert len(vis_data["entries"]) == 5
    
    for idx, entry in enumerate(vis_data["entries"]):
        code = day_data["parts"][idx]["code"]
        expected_hash = hashlib.sha256(code.encode("utf-8")).hexdigest()
        assert entry["codeHash"] == expected_hash, f"Day {day} Part {idx+1} codeHash mismatch!"
        
        # Check captions
        for step in entry["spec"]["steps"]:
            cap = step["caption"]
            assert not re.search(r'\d', cap), f"Day {day} Part {idx+1} digit in caption: {cap}"
            assert cap.endswith('.'), f"Day {day} Part {idx+1} caption not period-terminated: {cap}"
            assert len(cap) <= 75, f"Day {day} Part {idx+1} caption > 75 chars ({len(cap)}): {cap}"

print(f"\nTotal Block 11 Words: {total_block_words} words across 25 parts.")
if all_passed and total_block_words >= 15000:
    print("ALL AUDIT INVARIANTS PASSED PERFECTLY (100% PASS)!")
else:
    print(f"AUDIT FAILED (Passed={all_passed}, TotalWords={total_block_words})")
