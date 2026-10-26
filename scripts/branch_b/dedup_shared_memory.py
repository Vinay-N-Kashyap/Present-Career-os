# -*- coding: utf-8 -*-
tasks_file = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
with open(tasks_file, "r", encoding="utf-8") as f:
    lines = f.readlines()

seen_tasks = set()
unique_task_lines = []
for line in lines:
    task_id = line.split(",")[0].strip()
    if task_id.startswith("TASK-"):
        if task_id in seen_tasks:
            continue
        seen_tasks.add(task_id)
    unique_task_lines.append(line)

with open(tasks_file, "w", encoding="utf-8") as f:
    f.writelines(unique_task_lines)

control_file = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
with open(control_file, "r", encoding="utf-8") as f:
    clines = f.readlines()

unique_clines = []
seen_c = set()
for line in clines:
    stripped = line.strip()
    if stripped in seen_c:
        continue
    seen_c.add(stripped)
    unique_clines.append(line)

with open(control_file, "w", encoding="utf-8") as f:
    f.writelines(unique_clines)

print("Deduplicated shared memory CSV files successfully!")
