import json
import os

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
scripts_dir = os.path.join(commerce_dir, "scripts", "branch_b")

days = [46, 47, 48, 49, 50]
expected_minutes = {46: 38, 47: 38, 48: 38, 49: 38, 50: 60}

total_block_words = 0
all_passed = True

print("=" * 60)
print("AUDIT BLOCK 10: Course 06 (bcom_dmkt) Days 46-50")
print("=" * 60)

for d in days:
    filepath = os.path.join(scripts_dir, f"day{d}_dmkt_data.json")
    if not os.path.exists(filepath):
        print(f"FAILED: Missing file {filepath}")
        all_passed = False
        continue
        
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    # Check coursePrefix
    assert data["coursePrefix"] == "bcom_dmkt", f"Day {d}: invalid coursePrefix {data['coursePrefix']}"
    # Check day
    assert data["day"] == d, f"Day mismatch: {data['day']} vs {d}"
    # Check minutes
    assert data["minutes"] == expected_minutes[d], f"Day {d}: minutes {data['minutes']} != {expected_minutes[d]}"
    # Check parts count
    assert len(data["parts"]) == 5, f"Day {d}: expected 5 parts, found {len(data['parts'])}"
    
    day_words = 0
    safe_title = data["title"].encode("ascii", "replace").decode("ascii")
    print(f"\n--- Day {d}: {safe_title} ({data['minutes']} mins) ---")
    
    for idx, p in enumerate(data["parts"], 1):
        say_text = " ".join(p["say"]) if isinstance(p["say"], list) else p["say"]
        wc = len(say_text.strip().split())
        day_words += wc
        
        safe_part_title = p["title"].encode("ascii", "replace").decode("ascii")
        print(f"  Part {idx}: '{safe_part_title}' - {wc} words")
        if wc < 600:
            print(f"    ERROR: Part {idx} under 600 words ({wc} < 600)")
            all_passed = False
            
        assert p.get("example"), f"Day {d} Part {idx}: missing example"
        assert p.get("tryIt"), f"Day {d} Part {idx}: missing tryIt"
        assert p.get("code"), f"Day {d} Part {idx}: missing code"
        assert p.get("output"), f"Day {d} Part {idx}: missing output"
        
        chk = p.get("check")
        assert chk, f"Day {d} Part {idx}: missing check"
        assert chk.get("question"), f"Day {d} Part {idx}: missing check question"
        assert len(chk.get("options", [])) == 4, f"Day {d} Part {idx}: check options != 4"
        assert chk.get("answer") == 0, f"Day {d} Part {idx}: check answer != 0"
        assert chk.get("answerIndex") == 0, f"Day {d} Part {idx}: check answerIndex != 0"
        assert len(chk.get("why", "")) >= 30, f"Day {d} Part {idx}: why < 30 chars"
        assert len(chk.get("explanation", "")) >= 30, f"Day {d} Part {idx}: explanation < 30 chars"
        
    print(f"  Total Day {d} Words: {day_words}")
    if day_words < 3000:
        print(f"    ERROR: Day {d} under 3000 words ({day_words} < 3000)")
        all_passed = False
        
    total_block_words += day_words

print("\n" + "=" * 60)
print(f"BLOCK 10 AUDIT SUMMARY: Total Words = {total_block_words}")
print(f"Audit Status: {'ALL PASS' if all_passed else 'FAILED'}")
print("=" * 60)

if not all_passed:
    exit(1)
