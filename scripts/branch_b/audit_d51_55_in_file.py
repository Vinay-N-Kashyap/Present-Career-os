import json
import re

content = open("src/lib/data/bcomBanLongLessons.ts", "r", encoding="utf-8").read()
# Slice from export const BCOM_BAN_LONG_LESSONS = [ to ];
start_idx = content.find("export const BCOM_BAN_LONG_LESSONS")
brace_start = content.find("[", start_idx)
brace_end = content.rfind("];")

json_str = content[brace_start:brace_end+1]
try:
    lessons = json.loads(json_str)
    print(f"Loaded {len(lessons)} lessons successfully.")
    for l in lessons:
        d = l["day"]
        if d >= 51:
            words_per_part = [sum(len(re.findall(r'\b\w+\b', s)) for s in p["say"]) for p in l["parts"]]
            print(f"Day {d}: Total {sum(words_per_part)} words | Parts: {words_per_part}")
except Exception as e:
    print("Error parsing:", e)
