with open("src/lib/data/bcomDmktLongLessons.ts", "r", encoding="utf-8") as f:
    text = f.read()

print('"day": 56 in text?', '"day": 56' in text)
print('day: 56 in text?', 'day: 56' in text)

import re
pos = text.find('56')
while pos != -1:
    print(text[max(0, pos-30):pos+40])
    pos = text.find('56', pos+1)
