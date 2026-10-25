import json

ts_path = r'C:/Users/Admin/Desktop/projects/Present-Career-os-platform/src/lib/data/promptPythonLongLessons.ts'

with open(ts_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Find the last closing bracket of PROMPT_PYTHON_LONG_LESSONS
idx = text.rfind('];')
if idx == -1:
    raise ValueError("Could not find closing '];' in promptPythonLongLessons.ts")

# Load days 31-35
days_json = []
for day in [31, 32, 33, 34, 35]:
    path = f'C:/Users/Admin/Desktop/projects/Present-Career-os-platform/scripts/branch_c/prompt_day{day}_lesson.json'
    with open(path, 'r', encoding='utf-8') as f:
        days_json.append(json.load(f))

# Format each day as TypeScript / JSON object
appended_snippets = []
for d in days_json:
    formatted = json.dumps(d, indent=2)
    # Add indentation of 2 spaces
    indented = '\n'.join('  ' + line if line else line for line in formatted.splitlines())
    appended_snippets.append(indented)

insertion = ',\n' + ',\n'.join(appended_snippets) + '\n'

new_text = text[:idx].rstrip() + insertion + '];\n'

with open(ts_path, 'w', encoding='utf-8') as f:
    f.write(new_text)

print("Successfully assembled Days 31 to 35 into promptPythonLongLessons.ts!")
