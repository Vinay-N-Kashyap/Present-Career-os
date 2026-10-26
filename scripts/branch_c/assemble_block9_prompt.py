import json
import os

ts_path = r'C:/Users/Admin/Desktop/projects/Present-Career-os-platform/src/lib/data/promptPythonLongLessons.ts'

with open(ts_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Verify that day 41 is not already in the file
if '"day": 41' in text or 'day: 41' in text:
    print("Warning: Day 41 already present in promptPythonLongLessons.ts!")
    exit(1)

# Find the last closing bracket of PROMPT_PYTHON_LONG_LESSONS
idx = text.rfind('];')
if idx == -1:
    raise ValueError("Could not find closing '];' in promptPythonLongLessons.ts")

# Load days 41-45
days_json = []
for day in [41, 42, 43, 44, 45]:
    path1 = f'C:/Users/Admin/Desktop/projects/Present-Career-os-platform/scripts/branch_c/prompt_day{day}_lesson.json'
    path2 = f'C:/Users/Admin/Desktop/projects/Present-Career-os-platform/src/lib/data/prompt_day{day}_lesson.json'
    if os.path.exists(path1):
        with open(path1, 'r', encoding='utf-8') as f:
            days_json.append(json.load(f))
    elif os.path.exists(path2):
        with open(path2, 'r', encoding='utf-8') as f:
            days_json.append(json.load(f))
    else:
        raise FileNotFoundError(f"Neither {path1} nor {path2} found!")

assert len(days_json) == 5, f"Expected 5 days, got {len(days_json)}"

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

print("Successfully assembled Days 41 to 45 into promptPythonLongLessons.ts!")
