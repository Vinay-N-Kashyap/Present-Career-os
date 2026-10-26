import datetime
import sys

mac_file = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
commit_hash = sys.argv[1] if len(sys.argv) > 1 else "PENDING"
now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

row = f'AGENT-524,Branch B Enterprise Commerce Lead,Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,"Course 06: Digital Marketing Analytics & Performance (bcom_dmkt) Month 2 Block 10 (Days 46-50 & Milestone 10 Capstone) Complete & Pushed ({commit_hash}). Progress: 50/60 Days (83.33%). Advancing to Block 11 (Days 51-55).",Active,{now_str}\n'

with open(mac_file, "a", encoding="utf-8") as f:
    f.write(row)
print("AGENT-524 appended successfully to multi_agent_control.csv.")
