import datetime

mac_file = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
row = f'AGENT-526,Branch B Enterprise Commerce Lead,Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,"Claimed Course 06: Digital Marketing Analytics & Performance (bcom_dmkt) Month 2 Block 11 (Days 51-55 & Milestone 11 Capstone: Retail Media Networks, Sponsored Ads & Omnichannel Attribution). In Progress.",Active,{now_str}\n'

with open(mac_file, "a", encoding="utf-8") as f:
    f.write(row)
print("AGENT-526 registered successfully.")
