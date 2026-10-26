import json
import re

with open('src/lib/data/bcomDmktLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

d50_start = text.rfind('"day": 50')
bracket_pos = text.rfind('{', 0, d50_start)
end_pos = text.rfind('];')
d50_str = text[bracket_pos:end_pos].strip()
if d50_str.endswith(','):
    d50_str = d50_str[:-1].strip()

d50_obj = json.loads(d50_str)
safe_title = d50_obj.get("title", "").encode("ascii", "replace").decode("ascii")
print(f"Day 50 title: {safe_title}")
print(f"Minutes: {d50_obj.get('minutes')}")
print(f"Visual binding: {d50_obj.get('visualBinding')}")
for idx, p in enumerate(d50_obj.get("parts", [])):
    say_text = " ".join(p["say"]) if isinstance(p["say"], list) else p["say"]
    wc = len(say_text.strip().split())
    safe_part_title = p.get("title", "").encode("ascii", "replace").decode("ascii")
    print(f"  Part {idx+1} ({safe_part_title}): {wc} words")
