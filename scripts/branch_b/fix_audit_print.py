path = 'scripts/branch_b/audit_block11_dmkt.py'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace("print(f\"\\n--- Day {day_num}: {data.get('title')} ---\")", "title_safe = data.get('title', '').encode('ascii', 'replace').decode('ascii')\n        print(f\"\\n--- Day {day_num}: {title_safe} ---\")")

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)
print('Fixed audit script print encoding!')
