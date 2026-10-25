import os

mac_file = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
row = 'AGENT-522,Branch B Enterprise Commerce Lead,Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,"Course 06: Digital Marketing Analytics & Performance (bcom_dmkt) Month 2 Block 8 (Days 36-40 & Milestone 8 Capstone) Complete & Pushed (353f86c3). Progress: 40/60 Days (66.67%). Advancing to Block 9 (Days 41-45).",Active,2026-10-26 01:18:00\n'

with open(mac_file, "a", encoding="utf-8") as f:
    f.write(row)
print("AGENT-522 appended successfully.")
