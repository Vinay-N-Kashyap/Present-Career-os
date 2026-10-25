import re

file_path = r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv'

with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
    text = f.read()

tasks = [int(m.group(1)) for m in re.finditer(r'TASK-(\d+)', text)]
print('Total tasks:', len(tasks))
print('Max task ID:', max(tasks))
print('Min task ID:', min(tasks))
