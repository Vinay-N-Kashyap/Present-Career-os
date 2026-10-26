import re

c = open('src/lib/data/bcomEcomLongLessons.ts', encoding='utf-8').read()
d1_5 = [int(x) for x in re.findall(r'\bday:\s*(\d+)', c)]
d6_50 = [int(x) for x in re.findall(r'"day":\s*(\d+)', c)]
all_days = d1_5 + d6_50
print('Total days:', len(all_days), 'First 5:', d1_5, 'Last 5:', d6_50[-5:])
assert len(all_days) == 50
assert sorted(all_days) == list(range(1, 51))
print('DAYS 1 TO 50 ARE 100% CONTIGUOUS AND VERIFIED!')
