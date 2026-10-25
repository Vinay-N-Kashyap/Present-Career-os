import json

for d_num in range(31, 36):
    path = f"scripts/branch_b/day{d_num}_dmkt_data.json"
    with open(path, "r", encoding="utf-8") as f:
        d = json.load(f)
    print(f"\n=== Day {d['day']}: {d['title']} ===")
    total_say = 0
    for i, p in enumerate(d['parts']):
        say_words = len(" ".join(p['say']).split())
        total_say += say_words
        chk = p.get('check', {})
        print(f"  Part {i+1} ({p['title'][:35]}...): say={say_words}w, opts={len(chk.get('options', []))}, ans={chk.get('answer')}, ansIdx={chk.get('answerIndex')}, whyLen={len(chk.get('why', ''))}")
    print(f"Total Day {d['day']} say words: {total_say}")
