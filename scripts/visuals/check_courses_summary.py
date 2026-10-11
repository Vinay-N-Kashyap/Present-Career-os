import json

with open('scripts/course-curriculum-summary.json', 'r', encoding='utf-8') as f:
    courses = json.load(f)

print(f"Total courses in summary: {len(courses)}")
for i, c in enumerate(courses):
    print(f"Course {i+1}: {c.get('id')} — {c.get('title')}")
