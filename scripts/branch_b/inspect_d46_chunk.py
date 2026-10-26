with open('src/lib/data/bcomEcomLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

idx_d46 = text.find('"day": 46')
print(text[idx_d46:idx_d46+400])
