import json

ts_path = r'C:/Users/Admin/Desktop/projects/Present-Career-os-platform/src/lib/data/promptPythonLongLessons.ts'

with open(ts_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Verify that day 36 is not already in the file
if '"day": 36' in text or 'day: 36' in text:
    print("Warning: Day 36 already present in promptPythonLongLessons.ts!")
    exit(1)

# Find the last closing bracket of PROMPT_PYTHON_LONG_LESSONS
idx = text.rfind('];')
if idx == -1:
    raise ValueError("Could not find closing '];' in promptPythonLongLessons.ts")

# Load days 36-40
days_json = []
for day in [36, 37, 38, 39, 40]:
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

print("Successfully assembled Days 36 to 40 into promptPythonLongLessons.ts!")
