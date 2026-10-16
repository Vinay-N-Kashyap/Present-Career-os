import re

files = ['excelVizLongLessons.ts', 'compFundLongLessons.ts', 'gitVcsLongLessons.ts', 'softSkillsLongLessons.ts']
for f in files:
    content = open('src/lib/data/' + f, encoding='utf-8').read()
    days = re.findall(r'["\']?day["\']?:\s*(\d+)', content)
    print(f"{f}: {len(days)} days ({days})")
