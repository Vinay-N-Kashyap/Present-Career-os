with open('BRANCH_B_TASK_ASSIGNMENT.md', 'r', encoding='utf-8') as f:
    text = f.read()

for l in text.splitlines():
    if 'bcom_dmkt' in l or 'Course 06' in l or 'Course 6' in l or 'Digital Marketing' in l:
        print(l.encode('ascii', 'replace').decode('ascii'))
