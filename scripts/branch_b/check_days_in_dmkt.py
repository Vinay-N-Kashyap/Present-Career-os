import re

with open("src/lib/data/bcomDmktLongLessons.ts", "r", encoding="utf-8") as f:
    text = f.read()

days_json = [int(m) for m in re.findall(r'"day":\s*(\d+)', text)]
days_ts = [int(m) for m in re.findall(r'(?<!")day:\s*(\d+)', text)]
all_days = sorted(set(days_json + days_ts))

print("Total days found:", len(days_json + days_ts))
print("Unique days count:", len(all_days))
print("Unique days:", all_days)

for d in range(50, 56):
    print(f"Day {d} present:", d in all_days)
