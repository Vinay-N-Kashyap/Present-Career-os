import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('BRANCH_B_TASK_ASSIGNMENT.md', 'r', encoding='utf-8') as f:
    text = f.read()

print('Length of BRANCH_B_TASK_ASSIGNMENT.md:', len(text))
print(text[:2500])
