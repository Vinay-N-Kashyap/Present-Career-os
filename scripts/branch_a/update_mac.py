csv_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
row = 'AGENT-500,Antigravity,main,Present-Career-os,TASK-1941..1945,Completed,2026-10-25 01:30:00,"Block 10: Days 46-50 & Milestone 10 Capstone (devops / Operators, Istio Mesh, OTel Exemplars, eBPF & Canary Rollouts) completed, tested (5/5 expansion pass, 0 tsc errors), and pushed (commit 3e2c0708). 16,322 words generated (all 25 parts >= 600 words; all days >= 3,000 words). Course 15 at 50/60 Days (83.3% Complete). Ready for Block 11 (Days 51-55).",,,,\n'
with open(csv_path, 'a', encoding='utf-8') as f:
    f.write(row)
print("Successfully appended to multi_agent_control.csv!")
