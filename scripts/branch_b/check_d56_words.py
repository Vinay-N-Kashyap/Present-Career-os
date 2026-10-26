import json
import os
import sys

# Test word counts
import generate_ecom_day56 as g

for idx, p in enumerate(g.parts):
    words = sum(len(s.split()) for s in p["say"])
    print(f"Part {idx+1}: {words} words")
