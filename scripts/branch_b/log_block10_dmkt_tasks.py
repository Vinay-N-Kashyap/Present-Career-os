import datetime
import sys

tasks_csv = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def log_tasks(commit_hash):
    new_rows = [
        f'TASK-2163,"bcom_dmkt Day 46: Search Engine Crawling, Inverted Indexing & PageRank Mathematics",Completed,{commit_hash},Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,{now_str}\n',
        f'TASK-2164,"bcom_dmkt Day 47: Modern Semantic Search & Dense Retrieval: Vector Embeddings, Bi-Encoders & Approximate Nearest Neighbors (ANN)",Completed,{commit_hash},Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,{now_str}\n',
        f'TASK-2165,"bcom_dmkt Day 48: Search Intent Classification, Query Understanding & Knowledge Graph Entities",Completed,{commit_hash},Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,{now_str}\n',
        f'TASK-2166,"bcom_dmkt Day 49: Google Search Console API, BigQuery Data Warehousing & Algorithmic CTR Modeling",Completed,{commit_hash},Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,{now_str}\n',
        f'TASK-2167,"bcom_dmkt Day 50: Milestone 10 Capstone: Enterprise Semantic Search Engine, Neural Vector Retrieval & Search Console Analytics Control Tower",Completed,{commit_hash},Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,{now_str}\n',
    ]

    with open(tasks_csv, "a", encoding="utf-8") as f:
        f.writelines(new_rows)
    print("Logged TASK-2163 through TASK-2167 in agent_tasks.csv successfully.")

if __name__ == "__main__":
    commit = sys.argv[1] if len(sys.argv) > 1 else "PENDING"
    log_tasks(commit)
