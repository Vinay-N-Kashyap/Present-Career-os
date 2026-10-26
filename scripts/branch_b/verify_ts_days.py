import re

with open("src/lib/data/bcomEcomLongLessons.ts", "r", encoding="utf-8") as f:
    c = f.read()

pattern = r'\{\s*(?:["\']?coursePrefix["\']?\s*:\s*["\']bcom_ecom["\']\s*,\s*)?["\']?day["\']?\s*:\s*(\d+)'
matches = re.findall(pattern, c)
days = [int(m) for m in matches]
print("Top-level lesson days found:", len(days))
print("Min day:", min(days), "Max day:", max(days))
expected = list(range(1, 61))
assert sorted(days) == expected, f"Mismatch in days! Missing: {[d for d in expected if d not in days]}"
print("VERIFICATION SUCCESS: Contiguous Days 1 to 60 (100% COMPLETE) present in bcomEcomLongLessons.ts!")
