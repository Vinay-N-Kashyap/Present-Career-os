# scripts/verify_dist_days_sequence.py
import re

file_path = "src/lib/data/distributedWebLongLessons.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Match `"day": <num>`
day_matches = re.findall(r'"day":\s*(\d+)', content)
days = [int(x) for x in day_matches]

print(f"Total days found in distributedWebLongLessons.ts: {len(days)}")
print(f"Days sequence: {days[:10]} ... {days[-10:]}")

expected = list(range(1, 36))
assert days == expected, f"Days sequence mismatch! Expected {expected}, got {days}"

print("All days 1 through 35 are present in strict sequential order with zero gaps or duplicates! PASS")
