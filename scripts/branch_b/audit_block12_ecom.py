import json
import sys
import io

sys.stdout.reconfigure(encoding='utf-8')

print("=== STARTING FULL AUDIT OF BCOM_ECOM BLOCK 12 (DAYS 56-60) ===")
total_words = 0

for day_num in range(56, 61):
    data_path = f"scripts/branch_b/day{day_num}_ecom_data.json"
    with open(data_path, "r", encoding="utf-8") as f:
        d = json.load(f)

    assert d["coursePrefix"] == "bcom_ecom", f"Day {day_num} prefix invalid"
    assert d["day"] == day_num, f"Day {day_num} day number invalid"
    exp_min = 60 if day_num == 60 else 38
    assert d["minutes"] == exp_min, f"Day {day_num} minutes invalid: {d['minutes']} vs {exp_min}"
    assert isinstance(d["recap"], str) and len(d["recap"]) >= 50, f"Day {day_num} recap invalid"
    assert len(d["parts"]) == 5, f"Day {day_num} parts count != 5"

    day_words = 0
    words_per_part = []
    for p_idx, p in enumerate(d["parts"]):
        say_text = " ".join(p["say"]) if isinstance(p["say"], list) else p["say"]
        w = len(say_text.split())
        assert w >= 600, f"Day {day_num} Part {p_idx+1} has {w} words, below 600!"
        day_words += w
        words_per_part.append(w)

        # Check invariants
        chk = p["check"]
        assert chk["answer"] == 0 and chk["answerIndex"] == 0, f"Day {day_num} Part {p_idx+1} answer != 0"
        assert len(chk["options"]) == 4, f"Day {day_num} Part {p_idx+1} options != 4"
        assert len(chk["why"]) >= 20, f"Day {day_num} Part {p_idx+1} why < 20 chars"

        # Code execution verification
        old_stdout = sys.stdout
        sys.stdout = buffer = io.StringIO()
        try:
            exec(p["code"], {})
            actual = buffer.getvalue().strip()
        finally:
            sys.stdout = old_stdout
        assert actual == p["output"].strip(), f"Day {day_num} Part {p_idx+1} code output mismatch"

    total_words += day_words
    print(f"Day {day_num}: {day_words} words {words_per_part} - PASS")

print(f"\nTotal Block 12 Words: {total_words} across 25 parts (All >= 600 words)!")
print("ALL BLOCK 12 INVARIANTS PASS 100%!")
