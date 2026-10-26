import re

with open("src/lib/data/bcomEcomLongLessons.ts", "r", encoding="utf-8") as f:
    c = f.read()

# Match top-level day properties inside lesson objects:
# e.g., \n  {\n    "coursePrefix": "bcom_ecom",\n    "day": 51
# or \n  {\n    coursePrefix: 'bcom_ecom',\n    day: 1
pattern = r'\{\s*(?:["\']?coursePrefix["\']?\s*:\s*["\']bcom_ecom["\']\s*,\s*)?["\']?day["\']?\s*:\s*(\d+)'
matches = re.findall(pattern, c)
days = [int(m) for m in matches]
print("Top-level lesson days found:", len(days))
print("Days:", sorted(days))
assert sorted(days) == list(range(1, 56)), f"Mismatch: {sorted(days)}"
print("VERIFICATION SUCCESS: Contiguous Days 1 to 55 perfectly present in bcomEcomLongLessons.ts!")
