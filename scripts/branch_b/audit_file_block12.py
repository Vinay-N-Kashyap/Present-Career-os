import re

with open('src/lib/data/bcomBanLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's find each day block in bcomBanLongLessons.ts
# Days start with `  {\n    "day": ` or `  {\n    day: `
day_matches = list(re.finditer(r'{\s*["\']?day["\']?:\s*(\d+)', text))
print("Found day matches:", len(day_matches))

day_spans = []
for i in range(len(day_matches)):
    start = day_matches[i].start()
    day_num = int(day_matches[i].group(1))
    end = day_matches[i+1].start() if i + 1 < len(day_matches) else text.rfind('];')
    day_spans.append((day_num, start, end))

for day_num, start, end in day_spans:
    if day_num >= 56:
        chunk = text[start:end]
        # find say blocks
        say_matches = re.findall(r'["\']?say["\']?:\s*\[(.*?)\](?=\s*,\s*["\']?(?:example|code|tryIt|check))', chunk, re.DOTALL)
        part_words = []
        for s in say_matches:
            # find strings inside say
            strings = re.findall(r'"((?:[^"\\]|\\.)*)"', s)
            total_words = sum(len(st.split()) for st in strings)
            part_words.append(total_words)
        print(f"Day {day_num} in file: Parts={part_words}, Total={sum(part_words)}")
