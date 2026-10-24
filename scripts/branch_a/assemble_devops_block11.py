# Assembly script for DevOps Days 51 to 55 (Block 11)
import json
import sys
import os
import re

sys.path.append(os.path.dirname(__file__))
from day51_content import DAY_51
from day52_content import DAY_52
from day53_content import DAY_53
from day54_content import DAY_54
from day55_content import DAY_55
from snippets_data_block11 import SNIPPETS_DATA
from verified_outputs_block11 import VERIFIED_OUTPUTS

days = [DAY_51, DAY_52, DAY_53, DAY_54, DAY_55]

for d in days:
    day_num = d["day"]
    d["course"] = "devops"
    d["coursePrefix"] = "devops"
    for p_idx, p in enumerate(d.get("parts", [])):
        snippet = SNIPPETS_DATA[day_num][p_idx]
        p["example"] = snippet["example"]
        p["code"] = snippet["code"]
        p["output"] = VERIFIED_OUTPUTS[day_num][p_idx]
        
        # Parse codeNotes into { line: number, note: string }
        parsed_notes = []
        for raw_note in snippet.get("codeNotes", []):
            m = re.match(r"Line\s+(\d+).*?:\s*(.*)", raw_note)
            if m:
                parsed_notes.append({"line": int(m.group(1)), "note": m.group(2)})
            else:
                parsed_notes.append({"line": len(parsed_notes) + 1, "note": raw_note})
        p["codeNotes"] = parsed_notes
        p["tryIt"] = snippet["tryIt"]
        
        # Invariants for quiz
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

# If Day 51 is already in content, strip back to end of Day 50
m = re.search(r',\s*\{\s*\"day\":\s*51,', content)
if m:
    content = content[:m.start()].rstrip() + "\n];\n"
    print("Stripped previous Days 51-55 for clean update.")

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
new_content = content[:idx].rstrip() + days_ts + "];\n"

with open(target_file, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Successfully assembled Block 11 (Days 51-55) into {target_file}!")
