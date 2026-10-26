with open('src/lib/data/bcomEcomLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

pos = 2350690
print(text[pos:pos+500])
