# scripts/update_central_memory_block10.py
import csv
import datetime
import os

now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

# 1. Update agent_tasks.csv
tasks_file = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
new_tasks = [
    ["TASK-2153", "dist Day 46: Distributed Message Brokers: Append-Only Commit Logs, Partitioning, Offsets & High Watermarks", "Completed", "HEAD", "Present-Career-os", "main", now_str],
    ["TASK-2154", "dist Day 47: Consumer Groups & Rebalancing Protocols: Range, RoundRobin & Cooperative Sticky Assignors", "Completed", "HEAD", "Present-Career-os", "main", now_str],
    ["TASK-2155", "dist Day 48: Delivery Guarantees & Fault Tolerance: At-Least-Once, At-Most-Once, Idempotent Producers & Transactional IDs", "Completed", "HEAD", "Present-Career-os", "main", now_str],
    ["TASK-2156", "dist Day 49: Stream Processing Topologies: State Stores, Tumbling/Sliding/Session Windows & Watermarks", "Completed", "HEAD", "Present-Career-os", "main", now_str],
    ["TASK-2157", "dist Day 50: Milestone 10 Capstone: The Production Exactly-Once Real-Time Stream Analytics Engine", "Completed", "HEAD", "Present-Career-os", "main", now_str],
]

with open(tasks_file, "a", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    for t in new_tasks:
        writer.writerow(t)

print("Appended TASK-2153 through TASK-2157 to agent_tasks.csv!")

# 2. Update PROJECT_MEMORY.md
project_memory_file = r"C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md"
with open(project_memory_file, "r", encoding="utf-8") as f:
    pm_content = f.read()

dist_entry = f"""
### Course 16: Distributed Systems & Cloud-Native Architecture (`dist` / `course-distributed-systems`) - Branch A
* **Current Status**: **50 / 60 Days (83.33% Complete)**
* **Month 2 Block 7 (Days 31-35 & Milestone 7 Capstone)**: Paxos, Raft Leader Election, Log Replication, Joint Consensus & SMR Key-Value Store (16,562 words, verified, commit `9c1743f0`).
* **Month 2 Block 8 (Days 36-40 & Milestone 8 Capstone)**: 2PC, 3PC, Saga Orchestration, Transactional Outbox, CDC Debezium & Distributed Saga Engine (16,108 words, verified, commit `a041a8de`).
* **Month 2 Block 9 (Days 41-45 & Milestone 9 Capstone)**: Multi-Tier Distributed Caching, Cache-Aside/Write-Behind, TTLs/Lease Invalidation, Redis Sentinel/Cluster 16384 Hash Slots, Consistent Hashing Rings with Virtual Nodes, Probabilistic XFetch Stampede Prevention & Capstone Production Multi-Tier Cache Engine (15,890 words, verified, commit `0918dd3b`).
* **Month 2 Block 10 (Days 46-50 & Milestone 10 Capstone)**: Distributed Message Brokers, Append-Only Commit Logs, Partitioning, ISR High Watermark, Linux sendfile Zero-Copy, Consumer Groups, Cooperative Sticky Assignors, Idempotent Producers (PID/Sequence), Two-Phase Transaction Coordinators, Read-Committed Isolation, Embedded RocksDB State Stores, Tumbling/Session Windows, Event-Time Watermarks & Capstone Production Exactly-Once Stream Analytics Engine (16,191 words across 25 parts, all >=600w, Gate v2 zero digits, 2/2 unit tests pass, commit in-flight, {now_str}).
* **Next Target**: Month 2 Block 11 (Days 51-55 & Milestone 11 Capstone: Observability, Service Mesh & Chaos Engineering - Distributed Tracing, W3C TraceContext, Envoy Service Mesh, OpenTelemetry & Chaos Injection).
"""

if "Course 16: Distributed Systems & Cloud-Native Architecture (`dist` / `course-distributed-systems`)" in pm_content:
    import re
    pm_content = re.sub(
        r"### Course 16: Distributed Systems & Cloud-Native Architecture \(`dist` / `course-distributed-systems`\)[\s\S]*?(?=\n###|\Z)",
        dist_entry.strip(),
        pm_content
    )
else:
    pm_content += "\n" + dist_entry

with open(project_memory_file, "w", encoding="utf-8") as f:
    f.write(pm_content)

print("Updated PROJECT_MEMORY.md with Course 16 Block 10 milestone!")

# 3. Update multi_agent_control.csv
mac_file = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
if os.path.exists(mac_file):
    rows = []
    with open(mac_file, "r", encoding="utf-8") as f:
        reader = csv.reader(f)
        for r in reader:
            if r and r[0] == "Present-Career-os":
                r[1] = "main"
                r[2] = "Course 16 (dist) Block 10 Complete (50/60 Days, 83.33%) -> Starting Block 11"
                r[3] = now_str
            rows.append(r)
    with open(mac_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerows(rows)
    print("Updated multi_agent_control.csv!")
