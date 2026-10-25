import json
import os

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"

total_block_words = 0
for day_num in range(36, 41):
    path = os.path.join(commerce_dir, "scripts", "branch_b", f"day{day_num}_dmkt_data.json")
    with open(path, "r", encoding="utf-8") as f:
        d = json.load(f)
        
    assert d["day"] == day_num, f"Day {day_num} day field incorrect: {d['day']}"
    assert d["coursePrefix"] == "bcom_dmkt", f"Day {day_num} prefix incorrect: {d['coursePrefix']}"
    expected_min = 60 if day_num == 40 else 38
    assert d["minutes"] == expected_min, f"Day {day_num} minutes {d['minutes']} != {expected_min}"
    assert len(d["parts"]) == 5, f"Day {day_num} parts count != 5"
    
    day_words = 0
    for idx, p in enumerate(d["parts"]):
        w = len(" ".join(p["say"]).split())
        day_words += w
        assert w >= 600, f"Day {day_num} Part {idx+1} under 600 words: {w}"
        c = p["check"]
        assert len(c["options"]) == 4, f"Day {day_num} Part {idx+1} options != 4"
        assert c["answer"] == 0, f"Day {day_num} Part {idx+1} answer != 0"
        assert c["answerIndex"] == 0, f"Day {day_num} Part {idx+1} answerIndex != 0"
        assert len(c["why"]) >= 30, f"Day {day_num} Part {idx+1} why < 30 chars"
        assert len(p["code"]) > 20, f"Day {day_num} Part {idx+1} code < 20 chars"
        assert len(p["output"]) > 5, f"Day {day_num} Part {idx+1} output < 5 chars"
        assert len(p["example"]) > 10, f"Day {day_num} Part {idx+1} example < 10 chars"
        assert len(p["tryIt"]) > 5, f"Day {day_num} Part {idx+1} tryIt < 5 chars"
        
    assert day_words >= 3000, f"Day {day_num} total words {day_words} < 3000"
    total_block_words += day_words
    print(f"Day {day_num} PASS: {day_words} total words across 5 parts.")

print(f"ALL 5 DAYS (36 to 40) PASS INVARIANTS 100%! Total Block Words: {total_block_words} words.")
