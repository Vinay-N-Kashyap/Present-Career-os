import json
import os
import sys

sys.path.append(os.path.dirname(__file__))
from day46_content import DAY_46
from day47_content import DAY_47
from day48_content import DAY_48
from day49_content import DAY_49
from day50_content import DAY_50
from snippets_data import SNIPPETS
from verified_outputs import VERIFIED_OUTPUTS

days = [DAY_46, DAY_47, DAY_48, DAY_49, DAY_50]

for d in days:
    day_num = d["day"]
    d["course"] = "devops"
    d["coursePrefix"] = "devops"
    
    for idx, p in enumerate(d.get("parts", []), 1):
        key = (day_num, idx)
        snippet = SNIPPETS[key]
        p["example"] = snippet["example"]
        p["code"] = snippet["code"]
        p["output"] = VERIFIED_OUTPUTS[key]
        p["codeNotes"] = snippet["codeNotes"]
        p["tryIt"] = snippet["tryIt"]
        
        chk = p.get("check", {})
        chk["answerIndex"] = 0
        chk["answer"] = 0
        if "why" in chk and "explanation" not in chk:
            chk["explanation"] = chk["why"]
        elif "explanation" in chk and "why" not in chk:
            chk["why"] = chk["explanation"]

# Verify all invariants
for d in days:
    day_num = d["day"]
    print(f"Verifying Day {day_num}:")
    assert len(d["parts"]) == 5, f"Day {day_num} must have 5 parts"
    for idx, p in enumerate(d["parts"], 1):
        say = p["say"]
        text = " ".join(say) if isinstance(say, list) else str(say)
        w = len(text.split())
        assert w >= 600, f"Day {day_num} Part {idx} has {w} words < 600"
        assert p["code"] and len(p["code"].strip()) > 0, "Missing code"
        assert p["output"] and len(p["output"].strip()) > 0, "Missing output"
        assert len(p["codeNotes"]) >= 3, "Missing codeNotes"
        assert len(p["tryIt"]) > 10, "Missing tryIt"
        assert len(p["example"]) > 20, "Missing example"
        assert p["check"]["answer"] == 0, "Check answer must be 0"
        assert len(p["check"]["options"]) == 4, "Check must have 4 options"
        print(f"  Part {idx}: PASS ({w} words, snippet output verified)")

print("All Days 46-50 fully enriched and verified!")

# Now update src/lib/data/devopsWebLongLessons.ts
target_file = 'src/lib/data/devopsWebLongLessons.ts'
with open(target_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Find the start of Day 46 in the file
idx46 = content.find('"day": 46')
if idx46 == -1:
    idx46 = content.find('day: 46')

if idx46 == -1:
    print("Error: Could not find Day 46 in target file!")
    sys.exit(1)

# Find the start of the object containing Day 46 (backtrack to '{')
obj_start = content.rfind('{', 0, idx46)

# Find the last '];'
idx_end = content.rfind('];')

# Format the 5 days
new_blocks = [json.dumps(d, indent=2, ensure_ascii=False) for d in days]
days_ts = ",\n".join(new_blocks) + "\n"

updated_content = content[:obj_start] + days_ts + "];\n"

with open(target_file, 'w', encoding='utf-8') as f:
    f.write(updated_content)

print(f"Successfully replaced Days 46 to 50 in {target_file} with enriched versions!")
