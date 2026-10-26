with open("src/lib/data/bcomDmktLongLessons.ts", "r", encoding="utf-8") as f:
    c = f.read()

idx40 = c.find('"day": 40')
idx41 = c.find('"day": 41')
print("Index of Day 40:", idx40)
print("Index of Day 41:", idx41)

# Let's inspect between Day 40 and Day 41
print("Context around Day 40 end and Day 41 start:")
print(c[idx41-200:idx41+200])
