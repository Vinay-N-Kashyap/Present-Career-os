import json

with open('src/lib/data/bcomEcomLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Load our day56 and day57
with open('scripts/branch_b/day56_ecom_data.json', 'r', encoding='utf-8') as f:
    d56 = json.load(f)

print("Checking Day 56 match:")
print("In file title matches?", d56["title"] in text)
print("In file p1 code matches?", d56["parts"][0]["code"][:50] in text)
