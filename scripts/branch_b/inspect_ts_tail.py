import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/data/bcomEcomLongLessons.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print('Last 15 lines of bcomEcomLongLessons.ts:')
for line in lines[-15:]:
    print(line, end='')
