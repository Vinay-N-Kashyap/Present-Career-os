import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Let's inspect BCOM_ECOM_LONG_LESSONS via node/tsx or ts-node or parse it in python
with open('src/lib/data/bcomEcomLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's find each day block for 56-60
for d in range(56, 61):
    m_day = re.search(rf'["\']day["\']\s*:\s*{d}\b', text)
    if not m_day:
        print(f"Day {d} not found!")
        continue
    start_pos = m_day.start()
    # find where this day ends
    if d < 60:
        m_next = re.search(rf'["\']day["\']\s*:\s*{d+1}\b', text)
        end_pos = m_next.start() if m_next else len(text)
    else:
        end_pos = len(text)
    
    chunk = text[start_pos:end_pos]
    title_m = re.search(r'["\']title["\']\s*:\s*["\']([^"\']+)["\']', chunk)
    title = title_m.group(1) if title_m else "UNKNOWN"
    
    # find parts
    # parts are objects with title and say
    parts = re.findall(r'{\s*["\']title["\']\s*:\s*["\']([^"\']+)["\']\s*,\s*["\']say["\']\s*:\s*\[(.*?)\]\s*,\s*["\']example["\']', chunk, re.DOTALL)
    print(f"\n=================== DAY {d}: {title} ===================")
    print(f"Parts found: {len(parts)}")
    day_words = 0
    for p_idx, (p_title, p_say) in enumerate(parts):
        # count words in p_say
        # extract strings inside say array
        strings = re.findall(r'"([^"\\]*(?:\\.[^"\\]*)*)"', p_say)
        p_text = " ".join(strings)
        words = len(p_text.split())
        day_words += words
        print(f"  Part {p_idx+1}: {p_title[:45]}... | Words: {words}")
    print(f"Total Day {d} Words: {day_words}")
