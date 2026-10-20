# scripts/verify_iot_sec_block6.py
import json
import subprocess
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def verify_block6():
    block6_days = []
    total_words = 0

    for day in range(26, 31):
        filename = f"scripts/iot_sec_day{day}.json"
        with open(filename, "r", encoding="utf-8") as f:
            d = json.load(f)

        assert d["coursePrefix"] == "iot_sec", f"Day {day} coursePrefix mismatch: {d['coursePrefix']}"
        assert d["day"] == day, f"Day number mismatch: expected {day}, got {d['day']}"
        assert len(d["title"]) > 10, f"Day {day} title too short"
        assert len(d["goal"]) > 25, f"Day {day} goal too short"
        assert d["minutes"] == 38, f"Day {day} minutes must be strictly 38, got {d['minutes']}"
        assert len(d["recap"]) > 20, f"Day {day} recap too short"
        assert len(d["parts"]) == 5, f"Day {day} parts must be strictly 5, got {len(d['parts'])}"
        assert len(d["summary"]) >= 4, f"Day {day} summary must have >= 4 items"
        assert len(d["projectStep"]["steps"]) >= 4, f"Day {day} projectStep steps must have >= 4 items"

        day_words = 0
        print(f"\n--- Day {day}: {d['title']} ---")
        for i, p in enumerate(d["parts"]):
            assert len(p["title"]) > 5, f"Day {day} Part {i+1} title too short"
            say_text = " ".join(p["say"]) if isinstance(p["say"], list) else p["say"]
            words = len(say_text.split())
            day_words += words
            print(f"Part {i+1} ('{p['title'][:35]}...'): {words} words")
            assert words >= 580, f"Day {day} Part {i+1} has {words} words, must be >= 580"
            assert len(p["codeNotes"]) >= 3, f"Day {day} Part {i+1} codeNotes must have >= 3 items"
            assert isinstance(p["tryIt"], str) and len(p["tryIt"]) > 15, f"Day {day} Part {i+1} tryIt must be valid string"
            chk = p["check"]
            assert len(chk["question"]) > 10, f"Day {day} Part {i+1} check question too short"
            assert len(chk["options"]) == 4, f"Day {day} Part {i+1} check must have exactly 4 options"
            assert chk["answer"] == 0, f"Day {day} Part {i+1} check answer must be 0"
            assert len(chk["why"]) > 20, f"Day {day} Part {i+1} check why too short"

            # Verify runnable python snippet
            res = subprocess.run([sys.executable, "-"], input=p["code"], text=True, capture_output=True)
            if res.returncode != 0:
                print(f"Day {day} Part {i+1} execution error:\n{res.stderr}")
                sys.exit(1)
            if res.stdout != p["output"]:
                print(f"Day {day} Part {i+1} output mismatch!\nExpected:\n{p['output']}\nGot:\n{res.stdout}")
                sys.exit(1)

        print(f"Day {day} Total Words: {day_words} words (All parts >= 580)")
        total_words += day_words
        block6_days.append(d)

    print(f"\n==========================================")
    print(f"BLOCK 6 (DAYS 26-30) 100% VERIFIED!")
    print(f"Total Block 6 Words: {total_words} words across 25 parts")
    print(f"Average Words per Day: {total_words / 5:.1f} words")
    print(f"==========================================")

    with open("scripts/block6_iot_sec_all_days.json", "w", encoding="utf-8") as f:
        json.dump(block6_days, f, indent=2)
    print("Saved combined Block 6 to scripts/block6_iot_sec_all_days.json")

if __name__ == "__main__":
    verify_block6()
