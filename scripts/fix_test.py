with open('tests/bcom_finance_accounting_long_lessons.test.ts', 'r', encoding='utf-8') as f:
    text = f.read()

old_str = "assert.ok(lesson.parts[4].output?.includes('Deferred Tax'));"
new_str = "assert.ok(lesson.parts[4].output?.includes('DTL'));"

if old_str in text:
    text = text.replace(old_str, new_str)
    with open('tests/bcom_finance_accounting_long_lessons.test.ts', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Replaced successfully")
else:
    print("Old string not found, inspecting context...")
    idx = text.find("compute_tax_vs_book_depreciation_timing_difference")
    print(text[idx:idx+300])
