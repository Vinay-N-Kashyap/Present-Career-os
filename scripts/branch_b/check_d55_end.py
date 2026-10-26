with open('src/lib/data/bcomEcomLongLessons.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(10545, 10565):
    print(f"{i+1}: {lines[i]}", end='')
