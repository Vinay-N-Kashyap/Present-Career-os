import re
import json

with open('src/lib/data/bcomBanLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's extract the days in bcomBanLongLessons.ts
# Strip 'export const BCOM_BAN_LONG_LESSONS = ' and trailing ';'
start_idx = text.find('[')
end_idx = text.rfind(']') + 1
json_like = text[start_idx:end_idx]

# Parse json
try:
    lessons = json.loads(json_like)
    print(f"Parsed {len(lessons)} lessons from TS file.")
    for l in lessons:
        d = l['day']
        if d >= 56:
            parts = l['parts']
            words = [len(" ".join(p['say']).split()) for p in parts]
            print(f"Day {d}: Total {sum(words)} words, Parts: {words}")
except Exception as e:
    print("JSON load failed:", e)
