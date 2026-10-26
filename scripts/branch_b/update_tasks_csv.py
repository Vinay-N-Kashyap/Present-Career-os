import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

tasks_csv = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"

with open(tasks_csv, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if line.startswith("TASK-2218,"):
        new_lines.append('TASK-2218,"bcom_ecom Day 56: Headless Commerce Architecture, BFF Pattern, GraphQL Federation & Composable Edge APIs",Completed,HEADLESS_EDGE,Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,2026-10-26 16:38:00\n')
    elif line.startswith("TASK-2219,"):
        new_lines.append('TASK-2219,"bcom_ecom Day 57: Global Marketplace SEO, Programmatic Product Catalogs, Edge SSR & Core Web Vitals Optimization",Completed,PROGRAMMATIC_SEO,Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,2026-10-26 16:38:00\n')
    elif line.startswith("TASK-2220,"):
        new_lines.append('TASK-2220,"bcom_ecom Day 58: Unified Omnichannel Commerce, POS Synchronization, Distributed Inventory & BOPIS/BORIS Workflows",Completed,OMNICHANNEL_ATP,Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,2026-10-26 16:38:00\n')
    elif line.startswith("TASK-2221,"):
        new_lines.append('TASK-2221,"bcom_ecom Day 59: High-Concurrency Flash Sale Architecture, Distributed Queues, Virtual Waiting Rooms & Inventory Race Condition Prevention",Completed,FLASH_SALE_ZERO_OVERSELL,Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,2026-10-26 16:38:00\n')
    elif line.startswith("TASK-2222,"):
        new_lines.append('TASK-2222,"bcom_ecom Day 60: Milestone 12 Grand Master Capstone: Sovereign Enterprise Omnichannel Commerce Platform & Global Boardroom Defense (CCO-EA)",Completed,CCO_EA_GRADUATED,Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,2026-10-26 16:38:00\n')
    else:
        new_lines.append(line)

with open(tasks_csv, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print("Updated TASK-2218 to TASK-2222 in agent_tasks.csv successfully!")
