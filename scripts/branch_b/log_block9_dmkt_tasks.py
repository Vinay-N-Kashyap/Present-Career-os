import datetime

tasks_csv = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def log_tasks(commit_hash):
    new_rows = [
        f'TASK-2158,"bcom_dmkt Day 41: Real-Time Bidding (RTB) Protocols: OpenRTB 2.5/3.0, Auction Mechanics & Latency Budgets",Completed,{commit_hash},Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,{now_str}\n',
        f'TASK-2159,"bcom_dmkt Day 42: Header Bidding & Prebid.js Architecture: Client-Side vs Server-Side & Wrapper Optimization",Completed,{commit_hash},Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,{now_str}\n',
        f'TASK-2160,"bcom_dmkt Day 43: Supply Path Optimization (SPO) & Ad Fraud Mitigation: ads.txt, app-ads.txt, sellers.json & Schain",Completed,{commit_hash},Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,{now_str}\n',
        f'TASK-2161,"bcom_dmkt Day 44: Programmatic Yield Management & Dynamic Flooring: Bid Shading, Floor Optimization & Take Rates",Completed,{commit_hash},Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,{now_str}\n',
        f'TASK-2162,"bcom_dmkt Day 45: Milestone 9 Capstone: The Enterprise Programmatic Monetization & Supply Chain Architecture",Completed,{commit_hash},Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,{now_str}\n',
    ]

    with open(tasks_csv, "a", encoding="utf-8") as f:
        f.writelines(new_rows)
    print("Logged TASK-2158 through TASK-2162 in agent_tasks.csv successfully.")

if __name__ == "__main__":
    import sys
    commit = sys.argv[1] if len(sys.argv) > 1 else "PENDING"
    log_tasks(commit)
