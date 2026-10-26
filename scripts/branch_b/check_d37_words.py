file_path = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\scripts\branch_b\generate_ecom_day37.py'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

text_no_assert = text.replace('assert words >= 600', '# assert words >= 600')
local_vars = {}
exec(text_no_assert, {}, local_vars)

for i in range(1, 6):
    say = local_vars.get(f'p{i}_say', [])
    words = len(" ".join(say).split())
    title = local_vars.get(f'p{i}_title', '')
    print(f"Part {i} ('{title}'): {words} words")
