import sys

sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print('Tail of agent_tasks.csv (last 10 lines):')
for line in lines[-10:]:
    print(line.strip())
