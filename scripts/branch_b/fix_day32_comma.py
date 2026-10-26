with open("scripts/branch_b/generate_ecom_day32.py", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace('architecture.",\n,\n', 'architecture.",\n')

with open("scripts/branch_b/generate_ecom_day32.py", "w", encoding="utf-8") as f:
    f.write(text)

print("Fixed comma in generate_ecom_day32.py")
