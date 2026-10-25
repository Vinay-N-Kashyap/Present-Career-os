import json
import glob

files = [
    "scripts/branch_b/day31_dmkt_data.json",
    "scripts/branch_b/day32_dmkt_data.json",
    "scripts/branch_b/day33_dmkt_data.json",
    "scripts/branch_b/day34_dmkt_data.json",
    "scripts/branch_b/day35_dmkt_data.json"
]

total_block_words = 0

print("=== AUDITING BLOCK 7 (DAYS 31-35) PEDAGOGICAL INVARIANTS ===")

for path in files:
    with open(path, "r", encoding="utf-8") as f:
        day = json.load(f)
    
    day_num = day["day"]
    title = day["title"]
    minutes = day["minutes"]
    expected_minutes = 45 if day_num == 35 else 38
    assert minutes == expected_minutes, f"Day {day_num} minutes {minutes} != {expected_minutes}"
    
    parts = day["parts"]
    assert len(parts) == 5, f"Day {day_num} parts count {len(parts)} != 5"
    
    day_words = 0
    part_word_counts = []
    
    for idx, p in enumerate(parts):
        part_num = p.get("part", idx + 1)
        words = len(" ".join(p["say"]).split())
        day_words += words
        part_word_counts.append(words)
        assert words >= 600, f"Day {day_num} Part {part_num} is under 600 words: {words}"
        
        # Check invariants
        assert p.get("example"), f"Day {day_num} Part {part_num} missing example"
        assert p.get("code"), f"Day {day_num} Part {part_num} missing code"
        assert p.get("output"), f"Day {day_num} Part {part_num} missing output"
        assert p.get("tryIt"), f"Day {day_num} Part {part_num} missing tryIt"
        
        chk = p.get("check")
        assert chk, f"Day {day_num} Part {part_num} missing check"
        assert len(chk["options"]) == 4, f"Day {day_num} Part {part_num} check options {len(chk['options'])} != 4"
        assert chk["answer"] == 0, f"Day {day_num} Part {part_num} check answer != 0"
        assert chk.get("answerIndex") == 0, f"Day {day_num} Part {part_num} check answerIndex != 0"
        assert len(chk["why"]) >= 20, f"Day {day_num} Part {part_num} check why too short: {len(chk['why'])}"
    
    total_block_words += day_words
    print(f"Day {day_num} ({title[:40]}...): Total {day_words} words | Parts: {part_word_counts} | Minutes: {minutes} [PASSED]")

print(f"Total Block 7 Words across Days 31-35: {total_block_words} words (avg {total_block_words/5:.1f} words/day) [PERFECT]")
print("ALL PEDAGOGICAL INVARIANTS PERFECTLY VERIFIED!")
