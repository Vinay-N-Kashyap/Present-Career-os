import re
import json

with open("src/lib/data/bcomDmktLongLessons.ts", "r", encoding="utf-8") as f:
    text = f.read()

for d in range(56, 61):
    pos = text.find(f'"day": {d}')
    if pos == -1:
        pos = text.find(f'day: {d}')
    print(f"--- Day {d} in bcomDmktLongLessons.ts ---")
    if pos != -1:
        snippet = text[pos:pos+350]
        print(snippet)
    else:
        print("Not found!")
