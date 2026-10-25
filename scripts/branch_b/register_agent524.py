import datetime

mac_file = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
row = f'AGENT-524,Branch B Enterprise Commerce Lead,Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,"Claimed Course 06: Digital Marketing Analytics and Performance (bcom_dmkt) Month 2 Block 10 (Days 46-50 and Milestone 10 Capstone: Retail Media Networks and Omnichannel Commerce Architecture). In Progress.",Active,{now_str}\n'

with open(mac_file, "a", encoding="utf-8") as f:
    f.write(row)
print("AGENT-524 registered successfully.")
