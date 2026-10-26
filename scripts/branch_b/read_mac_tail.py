import sys

sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print('Tail of multi_agent_control.csv (last 10 lines):')
for line in lines[-10:]:
    print(line.strip())
