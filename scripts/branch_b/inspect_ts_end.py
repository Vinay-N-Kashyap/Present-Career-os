with open('src/lib/data/bcomEcomLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

print("File length:", len(text))
print("Last 200 chars:")
print(repr(text[-200:]))
