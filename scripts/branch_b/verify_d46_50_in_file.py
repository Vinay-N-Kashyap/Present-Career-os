import json
import re

with open('src/lib/data/bcomDmktLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's verify Days 46 to 50 directly in bcomDmktLongLessons.ts
for d in range(46, 51):
    pattern1 = '{\\s*"coursePrefix":\\s*"bcom_dmkt",\\s*"day":\\s*' + str(d) + '\\b'
    pattern2 = '{\\s*"day":\\s*' + str(d) + ',\\s*"coursePrefix":\\s*"bcom_dmkt"'
    m = re.search(pattern1, text) or re.search(pattern2, text)
    assert m, f"Day {d} not found in bcomDmktLongLessons.ts"
    start_pos = m.start()
    
    # find next day or end of array
    next_p1 = '{\\s*"coursePrefix":\\s*"bcom_dmkt",\\s*"day":\\s*' + str(d+1) + '\\b'
    next_p2 = '{\\s*"day":\\s*' + str(d+1) + ',\\s*"coursePrefix":\\s*"bcom_dmkt"'
    next_m = re.search(next_p1, text[start_pos+1:]) or re.search(next_p2, text[start_pos+1:])
    if next_m:
        end_pos = start_pos + 1 + next_m.start()
    else:
        end_pos = text.rfind('];')
        
    day_str = text[start_pos:end_pos].strip()
    if day_str.endswith(','):
        day_str = day_str[:-1].strip()
        
    obj = json.loads(day_str)
    assert obj["day"] == d
    assert obj["coursePrefix"] == "bcom_dmkt"
    expected_min = 60 if d == 50 else 38
    assert obj["minutes"] == expected_min, f"Day {d} minutes {obj['minutes']} != {expected_min}"
    assert len(obj["parts"]) == 5, f"Day {d} parts count != 5"
    assert "visualBinding" in obj, f"Day {d} missing visualBinding"
    
    day_words = 0
    for idx, p in enumerate(obj["parts"], 1):
        say_text = " ".join(p["say"]) if isinstance(p["say"], list) else p["say"]
        wc = len(say_text.strip().split())
        day_words += wc
        assert wc >= 600, f"Day {d} Part {idx} has only {wc} words"
        chk = p["check"]
        assert chk["answer"] == 0
        assert chk["answerIndex"] == 0
        assert len(chk["options"]) == 4
        assert len(chk["why"]) >= 30
        assert len(chk["explanation"]) >= 30
        
    assert day_words >= 3000, f"Day {d} total words {day_words} < 3000"
    print(f"Verified Day {d} in bcomDmktLongLessons.ts: 5 parts, {day_words} words, visualBinding present.")

print("ALL DAYS 46 TO 50 IN bcomDmktLongLessons.ts ARE 100% COMPLIANT!")
