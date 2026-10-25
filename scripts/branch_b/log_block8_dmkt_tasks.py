import datetime

tasks_csv = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def log_tasks(commit_hash):
    new_rows = [
        f'TASK-2148,"bcom_dmkt Day 36: Server-Side Tagging & Conversions API (CAPI): Server GTM, Cloud Run, Event Deduplication & Event Quality Score (EQS)",Completed,{commit_hash},Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,{now_str}\n',
        f'TASK-2149,"bcom_dmkt Day 37: Privacy-Preserving Ad Tech & The Privacy Sandbox: Topics API, Protected Audience API (PAAPI), Attribution Reporting API & Consent Mode v2",Completed,{commit_hash},Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,{now_str}\n',
        f'TASK-2150,"bcom_dmkt Day 38: Customer Data Clean Rooms (CDCR): Snowflake, AWS Clean Rooms, Habu, Differential Privacy & Secure Multiparty Computation (SMPC)",Completed,{commit_hash},Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,{now_str}\n',
        f'TASK-2151,"bcom_dmkt Day 39: Advanced Predictive Customer Lifetime Value (pCLV): Buy \'Til You Die (BTYD), Pareto/NBD, BG/NBD & Gamma-Gamma Spend Models",Completed,{commit_hash},Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,{now_str}\n',
        f'TASK-2152,"bcom_dmkt Day 40: Milestone 8 Capstone: Enterprise Privacy-Safe Ad Architecture, Clean Room Collaboration & Predictive Lifetime Value War Room",Completed,{commit_hash},Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,{now_str}\n',
    ]

    with open(tasks_csv, "a", encoding="utf-8") as f:
        f.writelines(new_rows)
    print("Logged TASK-2148 through TASK-2152 in agent_tasks.csv successfully.")

if __name__ == "__main__":
    import sys
    commit = sys.argv[1] if len(sys.argv) > 1 else "PENDING"
    log_tasks(commit)
