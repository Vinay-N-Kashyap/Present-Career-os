import json
import re

with open("src/lib/data/bcomDmktLongLessons.ts", "r", encoding="utf-8") as f:
    text = f.read()

# Let's extract from the start of Day 51 to the end
idx_51 = text.find('"day": 51')
if idx_51 == -1:
    idx_51 = text.find('day: 51')
print("Index of day 51:", idx_51)

block11_str = text[idx_51-10:]
# Let's parse each day from the JSON in the file
# Or let's check git diff on bcomDmktLongLessons.ts
