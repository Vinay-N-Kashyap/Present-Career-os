with open('src/lib/data/bcomEcomLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [(m.start(), text[m.start()-40:m.start()+40]) for m in re.finditer(r'"minutes":\s*45', text)]
print(f"Total occurrences of '\"minutes\": 45': {len(matches)}")
for idx, (pos, ctx) in enumerate(matches):
    print(f"Match {idx+1} at {pos}: {repr(ctx)}")
