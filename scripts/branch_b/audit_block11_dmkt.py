import json
import os
import sys

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
scripts_dir = os.path.join(commerce_dir, "scripts", "branch_b")

total_block_words = 0

print("================================================================================")
print("  BLOCK 11 AUDIT (Course 06: bcom_dmkt, Days 51-55)")
print("================================================================================")

for day_num in range(51, 56):
    file_path = os.path.join(scripts_dir, f"day{day_num}_dmkt_data.json")
    if not os.path.exists(file_path):
        print(f"ERROR: Missing file {file_path}")
        sys.exit(1)

    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    day_words = 0
    parts = data.get("parts", [])
    title_safe = data.get('title', '').encode('ascii', 'replace').decode('ascii')
    print(f"\n--- Day {day_num}: {title_safe} ---")
    print(f"Minutes: {data.get('minutes')} | Parts Count: {len(parts)}")
    
    expected_min = 60 if day_num == 55 else 38
    assert data.get("minutes") == expected_min, f"Day {day_num} minutes expected {expected_min}, got {data.get('minutes')}"
    assert len(parts) == 5, f"Day {day_num} must have exactly 5 parts, got {len(parts)}"
    assert isinstance(data.get("recap"), str), f"Day {day_num} recap must be a string"

    for idx, part in enumerate(parts):
        say_text = " ".join(part.get("say", []))
        part_wc = len(say_text.strip().split())
        day_words += part_wc
        
        # Check invariants
        assert part_wc >= 600, f"Day {day_num} Part {idx+1} under 600 words ({part_wc})"
        assert part.get("example"), f"Day {day_num} Part {idx+1} missing example"
        assert part.get("tryIt"), f"Day {day_num} Part {idx+1} missing tryIt"
        assert part.get("code"), f"Day {day_num} Part {idx+1} missing code"
        assert part.get("output"), f"Day {day_num} Part {idx+1} missing output"
        
        check = part.get("check", {})
        assert check.get("question"), f"Day {day_num} Part {idx+1} missing check question"
        assert len(check.get("options", [])) == 4, f"Day {day_num} Part {idx+1} check options != 4"
        assert check.get("answer") == 0, f"Day {day_num} Part {idx+1} answer != 0"
        assert check.get("answerIndex") == 0, f"Day {day_num} Part {idx+1} answerIndex != 0"
        assert len(check.get("why", "")) >= 30, f"Day {day_num} Part {idx+1} why < 30 chars"

        title_sub = part.get('title')[:45].encode('ascii', 'replace').decode('ascii')
        print(f"  Part {idx+1}: {title_sub}... ({part_wc} words) - PASS")

    assert day_words >= 3000, f"Day {day_num} total words under 3000 ({day_words})"
    print(f"Day {day_num} Total: {day_words} words - PASS")
    total_block_words += day_words

print("\n================================================================================")
print(f"BLOCK 11 GRAND TOTAL: {total_block_words} WORDS ACROSS 25 PARTS (ALL >= 600 WORDS)")
print("================================================================================")
assert total_block_words >= 15000, f"Block 11 total words under 15000 ({total_block_words})"
print("ALL PEDAGOGICAL INVARIANTS DETERMINISTICALLY VERIFIED: 100% PASS!")
