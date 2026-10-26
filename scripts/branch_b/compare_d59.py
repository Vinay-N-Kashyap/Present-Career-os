import hashlib

with open('src/lib/data/bcomDmktLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's inspect Day 59 in text
import json
# Find where "day": 59 begins
d59_pos = text.find('"day": 59')
d60_pos = text.find('"day": 60')
d59_block = text[d59_pos-10:d60_pos-10]

# Find part 5 in d59_block
p5_pos = d59_block.rfind('"title":')
print("Part 5 in bcomDmktLongLessons.ts for Day 59:")
print(d59_block[p5_pos:p5_pos+300])

import json
with open('scripts/branch_b/day59_dmkt_data.json', 'r', encoding='utf-8') as f:
    d59_json = json.load(f)

print("\nPart 5 in day59_dmkt_data.json:")
print(d59_json['parts'][4]['title'])
print(d59_json['parts'][4]['say'][-1])
