import json
import subprocess
import sys
import os

days = [56, 57, 58, 59, 60]
total_block_words = 0
total_parts = 0

print("================================================================================")
print("  AUDIT: COURSE 06 (BCOM_DMKT) MONTH 2 BLOCK 12 (DAYS 56-60 & GRAND CAPSTONE)")
print("================================================================================")

for d in days:
    fpath = f"scripts/branch_b/day{d}_dmkt_data.json"
    assert os.path.exists(fpath), f"File {fpath} does not exist!"
    with open(fpath, "r", encoding="utf-8") as f:
        data = json.load(f)

    assert data.get("coursePrefix") == "bcom_dmkt", f"Day {d} invalid coursePrefix"
    assert data.get("day") == d, f"Day {d} mismatch day attribute"
    assert "title" in data and len(data["title"]) > 10, f"Day {d} invalid title"
    assert "goal" in data and len(data["goal"]) > 10, f"Day {d} invalid goal"
    assert "recap" in data and len(data["recap"]) > 10, f"Day {d} invalid recap"
    
    expected_minutes = 60 if d == 60 else 38
    assert data.get("minutes") == expected_minutes, f"Day {d} invalid minutes: {data.get('minutes')} vs expected {expected_minutes}"

    parts = data.get("parts", [])
    assert len(parts) == 5, f"Day {d} must have exactly 5 parts, found {len(parts)}"

    day_words = 0
    safe_title = data['title'].encode('ascii', 'replace').decode('ascii')
    print(f"\n--- Day {d}: {safe_title} ({data['minutes']} mins) ---")

    for idx, p in enumerate(parts):
        total_parts += 1
        say = p.get("say", [])
        say_text = " ".join(say)
        part_words = len(say_text.strip().split())
        day_words += part_words
        total_block_words += part_words

        safe_part_title = p['title'].encode('ascii', 'replace').decode('ascii')
        print(f"  Part {idx+1}: {safe_part_title} -> {part_words} words")
        assert part_words >= 600, f"Day {d} Part {idx+1} under 600 words ({part_words} words)!"

        # Pedagogical invariants
        assert "example" in p and len(p["example"]) > 20, f"Day {d} Part {idx+1} invalid example"
        assert "tryIt" in p and len(p["tryIt"]) > 10, f"Day {d} Part {idx+1} invalid tryIt"
        assert "code" in p and len(p["code"]) > 20, f"Day {d} Part {idx+1} invalid code"
        assert "output" in p and len(p["output"]) > 0, f"Day {d} Part {idx+1} invalid output"

        # Socratic check
        check = p.get("check", {})
        assert "question" in check and len(check["question"]) > 10, f"Day {d} Part {idx+1} invalid question"
        options = check.get("options", [])
        assert len(options) == 4, f"Day {d} Part {idx+1} options must be 4, got {len(options)}"
        assert check.get("answer") == 0, f"Day {d} Part {idx+1} answer must be 0"
        assert check.get("answerIndex") == 0, f"Day {d} Part {idx+1} answerIndex must be 0"
        assert "why" in check and len(check["why"]) >= 30, f"Day {d} Part {idx+1} why must be >= 30 chars"
        assert "explanation" in check and len(check["explanation"]) >= 30, f"Day {d} Part {idx+1} explanation must be >= 30 chars"

        # Verify code execution match
        with open("scripts/branch_b/temp_audit.py", "w", encoding="utf-8") as tf:
            tf.write(p["code"])
        res = subprocess.run([sys.executable, "scripts/branch_b/temp_audit.py"], capture_output=True, text=True)
        assert res.returncode == 0, f"Day {d} Part {idx+1} code execution failed: {res.stderr}"
        assert res.stdout.strip() == p["output"].strip(), f"Day {d} Part {idx+1} code output mismatch!"

    print(f"  >> Total Day {d} Words: {day_words:,} words (Threshold: >= 3,000 words: {'PASS' if day_words >= 3000 else 'FAIL'})")
    assert day_words >= 3000, f"Day {d} under 3,000 words ({day_words} words)!"

print("\n================================================================================")
print(f"  BLOCK 12 AUDIT COMPLETE: 100% PASS!")
print(f"  Total Days: {len(days)} | Total Parts: {total_parts} | Total Words: {total_block_words:,}")
print(f"  Average Words Per Part: {total_block_words / total_parts:.1f} words/part")
print("================================================================================")
