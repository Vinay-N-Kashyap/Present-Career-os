with open('src/lib/data/devopsWebLongLessons.ts', 'r', encoding='utf-8') as f:
    text = f.read()

idx45 = text.find('"day": 45')
# print from end of say of part 1
idx_check = text.find('"check"', idx45)
print(text[idx_check-500:idx_check+500])
