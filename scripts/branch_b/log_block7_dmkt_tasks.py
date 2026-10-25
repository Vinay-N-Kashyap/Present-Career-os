import datetime

tasks_csv = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def log_tasks(commit_hash):
    new_rows = [
        f'TASK-2143,"bcom_dmkt Day 31: Advanced Marketing Econometrics: Hierarchical Bayesian MMM, Adstock Decay Dynamics (Geometric vs Weibull) & Hill Saturation Curves",Completed,{commit_hash},Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,{now_str}\n',
        f'TASK-2144,"bcom_dmkt Day 32: Causal Inference & Synthetic Control Methods: Matched Markets, Difference-in-Differences (DiD) & Incrementality Testing",Completed,{commit_hash},Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,{now_str}\n',
        f'TASK-2145,"bcom_dmkt Day 33: Multi-Touch Attribution (MTA): Algorithmic Shapley Values & Markov Transition Chains",Completed,{commit_hash},Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,{now_str}\n',
        f'TASK-2146,"bcom_dmkt Day 34: Customer Data Platform (CDP) Architecture & Identity Resolution: Graph Stitching & Record Linkage",Completed,{commit_hash},Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,{now_str}\n',
        f'TASK-2147,"bcom_dmkt Day 35: Milestone 7 Capstone: Enterprise Marketing Econometrics, Causal Incrementality & Attribution War Room",Completed,{commit_hash},Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,{now_str}\n',
    ]

    with open(tasks_csv, "a", encoding="utf-8") as f:
        f.writelines(new_rows)
    print("Logged TASK-2143 through TASK-2147 in agent_tasks.csv successfully.")

if __name__ == "__main__":
    import sys
    commit = sys.argv[1] if len(sys.argv) > 1 else "PENDING"
    log_tasks(commit)
