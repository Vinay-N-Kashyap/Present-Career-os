import sys

sys.stdout.reconfigure(encoding='utf-8')
with open('src/lib/data/bcomEcomLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

pos_d45 = text.rfind('"day": 45,')
if pos_d45 == -1:
    pos_d45 = text.rfind("'day': 45,")
if pos_d45 == -1:
    pos_d45 = text.rfind("day: 45,")

print("Last Day 45 pos:", pos_d45)

pos_d46 = text.rfind('"day": 46,')
if pos_d46 == -1:
    pos_d46 = text.rfind("'day': 46,")
if pos_d46 == -1:
    pos_d46 = text.rfind("day: 46,")

print("Last Day 46 pos:", pos_d46)

# Find where Day 45 ends
end_d45 = text.find('},\n{\n  "day": 46,', pos_d45)
print("End of Day 45 pos:", end_d45)
if end_d45 != -1:
    print("Following text length from Day 46 to end:", len(text) - end_d45)
    print("Tail 500 chars:")
    print(text[-500:])
