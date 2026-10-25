import os

mac_file = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
row = 'AGENT-523,Branch B Enterprise Commerce Lead,Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,"Course 06: Digital Marketing Analytics & Performance (bcom_dmkt) Month 2 Block 9 (Days 41-45 & Milestone 9 Capstone) Complete & Pushed. Progress: 45/60 Days (75.0%). Advancing to Block 10 (Days 46-50).",Active,2026-10-26 01:44:00\n'

with open(mac_file, "a", encoding="utf-8") as f:
    f.write(row)
print("AGENT-523 appended successfully.")
