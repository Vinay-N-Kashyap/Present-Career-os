# -*- coding: utf-8 -*-
"""
Check if bcomEcomLongLessons.ts matches day{31..35}_ecom_data.json
"""
import json
import hashlib
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Read bcomEcomLongLessons.ts
with open("src/lib/data/bcomEcomLongLessons.ts", "r", encoding="utf-8") as f:
    ts_text = f.read()

# Let's see if each day's exact json is in the file or if we should re-assemble cleanly
# We can check by looking for the day's title or part titles
for day_num in range(31, 36):
    data_path = f"scripts/branch_b/day{day_num}_ecom_data.json"
    with open(data_path, "r", encoding="utf-8") as df:
        ddata = json.load(df)
        
    day_title = ddata["title"]
    found = day_title in ts_text
    print(f"Day {day_num} Title found in TS: {found}")
    
    # Check part 1 say length in TS vs JSON
    p1_first_sentence = ddata["parts"][0]["say"][0][:50]
    p1_found = p1_first_sentence in ts_text
    print(f"Day {day_num} Part 1 found in TS: {p1_found}")
