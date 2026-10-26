with open('src/lib/data/bcomEcomLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

idx_d46 = text.find('"day": 46')
idx_d50 = text.find('"day": 50')
print("idx d46:", idx_d46, "idx d50:", idx_d50)
if idx_d50 != -1:
    print(text[idx_d50-50:idx_d50+300])
