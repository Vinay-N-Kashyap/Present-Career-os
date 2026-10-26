with open('src/lib/data/bcomEcomLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

idx_d46 = text.find('"day": 46')
print("Surrounding text around d46:")
print(repr(text[idx_d46-100:idx_d46+50]))
