import json

total_block_words = 0
for day_num in range(56, 61):
    file_path = f"scripts/branch_b/day{day_num}_ban_data.json"
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    assert data["day"] == day_num, f"Day mismatch: {data['day']} vs {day_num}"
    assert data["coursePrefix"] == "bcom_ban", f"Prefix mismatch: {data['coursePrefix']}"
    assert len(data["parts"]) == 5, f"Parts count != 5 in day {day_num}"
    expected_minutes = 60 if day_num == 60 else 45
    assert data["minutes"] == expected_minutes, f"Minutes mismatch: {data['minutes']} vs {expected_minutes}"
    
    part_words = []
    for p in data["parts"]:
        w = len(" ".join(p["say"]).split())
        part_words.append(w)
        assert w >= 600, f"Day {day_num} Part {p['part']} word count {w} < 600"
        assert p.get("example"), f"Day {day_num} Part {p['part']} missing example"
        assert p.get("tryIt"), f"Day {day_num} Part {p['part']} missing tryIt"
        assert p.get("code"), f"Day {day_num} Part {p['part']} missing code"
        assert p.get("output"), f"Day {day_num} Part {p['part']} missing output"
        chk = p.get("check", {})
        assert chk.get("answer") == 0, f"Day {day_num} Part {p['part']} answer != 0"
        assert chk.get("answerIndex") == 0, f"Day {day_num} Part {p['part']} answerIndex != 0"
        assert len(chk.get("options", [])) == 4, f"Day {day_num} Part {p['part']} options != 4"
        assert len(chk.get("why", "")) >= 50, f"Day {day_num} Part {p['part']} why < 50 chars"
    
    day_total = sum(part_words)
    total_block_words += day_total
    print(f"Day {day_num}: Total {day_total}w (Parts: {part_words}) -> ALL INVARIANTS PASS!")

print(f"=== BLOCK 12 AUDIT COMPLETE: Total Words = {total_block_words}w across 25 parts ===")
