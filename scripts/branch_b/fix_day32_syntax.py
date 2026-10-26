with open("scripts/branch_b/generate_ecom_day32.py", "r", encoding="utf-8") as f:
    text = f.read()

# Replace unescaped "item_12"
text = text.replace('"item_12"', "'item_12'")

with open("scripts/branch_b/generate_ecom_day32.py", "w", encoding="utf-8") as f:
    f.write(text)

print("Fixed syntax in generate_ecom_day32.py")
