# -*- coding: utf-8 -*-
tasks_file = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
with open(tasks_file, "r", encoding="utf-8") as f:
    t_content = f.read()

t_content = t_content.replace(
    'Engine",Completed,a6707586,Present-Career-os,main,2026-10-26 14:27:43TASK-2198',
    'Engine",Completed,a6707586,Present-Career-os,main,2026-10-26 14:27:43\nTASK-2198'
)
with open(tasks_file, "w", encoding="utf-8") as f:
    f.write(t_content)

control_file = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
with open(control_file, "r", encoding="utf-8") as f:
    c_content = f.read()

c_content = c_content.replace(
    'Advancing to Final Block 12 (Days 56-60).",Active,2026-10-26 14:27:43AGENT-532',
    'Advancing to Final Block 12 (Days 56-60).",Active,2026-10-26 14:27:43\nAGENT-532'
)
with open(control_file, "w", encoding="utf-8") as f:
    f.write(c_content)

print("Cleaned up newlines successfully!")
