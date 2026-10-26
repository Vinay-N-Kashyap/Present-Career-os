import sys

sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print('Total lines in agent_tasks.csv:', len(lines))
for line in lines[-15:]:
    print(line.strip())
