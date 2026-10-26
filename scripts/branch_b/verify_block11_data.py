# -*- coding: utf-8 -*-
import json
import re

total_block_words = 0
for day_num in range(51, 56):
    path = f"scripts/branch_b/day{day_num}_ban_data.json"
    with open(path, "r", encoding="utf-8") as f:
        d = json.load(f)
    day_words = 0
    print(f"=== Day {day_num} ===")
    for idx, p in enumerate(d["parts"]):
        wc = sum(len(re.findall(r'\b\w+\b', s)) for s in p["say"])
        day_words += wc
        print(f"Part {idx+1}: {p['title'][:45]} -> {wc} words")
        assert wc >= 600, f"Day {day_num} Part {idx+1} under 600 ({wc})"
        assert p.get("example"), f"Day {day_num} Part {idx+1} missing example"
        assert p.get("tryIt"), f"Day {day_num} Part {idx+1} missing tryIt"
        assert p.get("code"), f"Day {day_num} Part {idx+1} missing code"
        assert p.get("output"), f"Day {day_num} Part {idx+1} missing output"
        assert p["check"]["answer"] == 0
        assert p["check"]["answerIndex"] == 0
        assert len(p["check"]["why"]) >= 20
        assert len(p["check"]["options"]) == 4

    print(f"Total Day {day_num}: {day_words} words (Target >= 3000)")
    assert day_words >= 3000
    total_block_words += day_words

print(f"\nALL BLOCK 11 INVARIANTS CONFIRMED! Total Words: {total_block_words} (avg {total_block_words/5:.1f} words/day)")
