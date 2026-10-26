import json
import re

with open("src/lib/data/bcomDmktLongLessons.ts", "r", encoding="utf-8") as f:
    c = f.read()

# Let's find Day 45
idx = c.rfind('"day": 45')
print("Index of '\"day\": 45':", idx)
print(c[idx:idx+1000])
