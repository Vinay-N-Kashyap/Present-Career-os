# Assembly script for DevOps Days 46 to 50
import json
import sys
import os

sys.path.append(os.path.dirname(__file__))
from day46_content import DAY_46
from day47_content import DAY_47
from day48_content import DAY_48
from day49_content import DAY_49
from day50_content import DAY_50

days = [DAY_46, DAY_47, DAY_48, DAY_49, DAY_50]

for d in days:
    d["course"] = "devops"
    d["coursePrefix"] = "devops"
    for p in d.get("parts", []):
        chk = p.get("check", {})
        chk["answerIndex"] = 0
        chk["answer"] = 0
        if "why" in chk and "explanation" not in chk:
            chk["explanation"] = chk["why"]
        elif "explanation" in chk and "why" not in chk:
            chk["why"] = chk["explanation"]

# Check words across all 5 days
total_words = 0
for d in days:
    day_num = d["day"]
    day_words = 0
    print(f"Checking Day {day_num}...")
    for idx, p in enumerate(d.get("parts", []), 1):
        say = p.get("say", [])
        text = " ".join(say) if isinstance(say, list) else str(say)
        w = len(text.split())
        day_words += w
        if w < 600:
            print(f"  Part {idx} FAIL: {w} words < 600!")
            sys.exit(1)
        else:
            print(f"  Part {idx} PASS: {w} words.")
    total_words += day_words
    print(f"Day {day_num} Total: {day_words} words.")

print(f"\nALL 5 DAYS VERIFIED! Total words: {total_words} (Average: {total_words/5:.1f} words/day)")

# Now read src/lib/data/devopsWebLongLessons.ts
target_file = 'src/lib/data/devopsWebLongLessons.ts'
with open(target_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Check if day 46 is already present
if '"day": 46' in content or 'day: 46' in content:
    print("Warning: Day 46 already found in target file! Checking where...")
    sys.exit(1)

# Find the last '];'
idx = content.rfind('];')
if idx == -1:
    print("Error: Could not find closing '];' in devopsWebLongLessons.ts")
    sys.exit(1)

# Format the 5 days into JSON / TS strings
new_content_blocks = []
for d in days:
    formatted_day = json.dumps(d, indent=2, ensure_ascii=False)
    new_content_blocks.append(formatted_day)

days_ts = ",\n" + ",\n".join(new_content_blocks) + "\n"

updated_content = content[:idx].rstrip() + days_ts + "];\n"

with open(target_file, 'w', encoding='utf-8') as f:
    f.write(updated_content)

print(f"Successfully assembled Days 46 to 50 into {target_file}!")
