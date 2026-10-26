import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/data/bcomEcomLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Find each day object
day_blocks = re.split(r'\{\s*[\'"]?day[\'"]?\s*:\s*', text)

for block in day_blocks[1:]:
    match = re.match(r'(\d+)', block)
    if match:
        day_num = int(match.group(1))
        if day_num >= 45:
            title_match = re.search(r'[\'"]?title[\'"]?\s*:\s*[\'"]([^\'"]+)[\'"]', block)
            title = title_match.group(1) if title_match else "UNKNOWN"
            # count parts
            part_titles = re.findall(r'[\'"]?title[\'"]?\s*:\s*[\'"]([^\'"]+)[\'"]', block)
            # Find word counts
            say_blocks = re.findall(r'[\'"]?say[\'"]?\s*:\s*\[(.*?)\]\s*,\s*[\'"]?example', block, re.DOTALL)
            words = []
            for sb in say_blocks:
                paras = re.findall(r'[\'"]([^\'"]+)[\'"]', sb)
                words.append(sum(len(p.split()) for p in paras))
            print(f"Day {day_num}: {title} | Parts: {len(words)} | Words: {words} (Total: {sum(words)})")
