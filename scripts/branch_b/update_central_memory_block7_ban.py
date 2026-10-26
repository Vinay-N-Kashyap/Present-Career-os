# -*- coding: utf-8 -*-
"""
De-collide and update agent_tasks.csv and PROJECT_MEMORY.md for bcom_ban Month 2 Block 7
"""

import os

tasks_csv = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
project_memory = r"C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md"

with open(tasks_csv, "r", encoding="utf-8") as f:
    lines = f.readlines()

# The last 5 lines currently have duplicate TASK-2093..TASK-2097
base_lines = lines[:-5]
renumbered_tasks = [
    'TASK-2098,"bcom_ban Day 31: Advanced Wholesale & Corporate Banking: Working Capital Assessment (Tandon / Chore Committee Models), MPBF & Cash Budget Systems",Completed,b179b3bf,Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,2026-10-25 21:56:00\n',
    'TASK-2099,"bcom_ban Day 32: Non-Fund-Based Credit Facilities: Bank Guarantees (Financial vs Performance), Inland / Foreign Letters of Credit (LCs) & UCP 600 Compliance",Completed,b179b3bf,Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,2026-10-25 21:56:00\n',
    'TASK-2100,"bcom_ban Day 33: Consortium Lending & Multiple Banking Arrangements: Pari-Passu Charge Creation, Joint Lenders Forum (JLF) & Escrow / TRA Waterfall Accounts",Completed,b179b3bf,Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,2026-10-25 21:56:00\n',
    'TASK-2101,"bcom_ban Day 34: Project Finance & Infrastructure Loan Structuring: Concession Agreements, SPV Debt Sizing, DSCR / LLCR Modeling & Cost Overrun Hedging",Completed,b179b3bf,Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,2026-10-25 21:56:00\n',
    'TASK-2102,"bcom_ban Day 35: Milestone 7 Capstone: Corporate Wholesale Banking Credit Underwriting, Multi-Facility Loan Syndication & Cash Budget War Room Simulator",Completed,b179b3bf,Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,2026-10-25 21:56:00\n'
]
base_lines.extend(renumbered_tasks)

with open(tasks_csv, "w", encoding="utf-8", newline="") as f:
    f.writelines(base_lines)

print("De-collided tasks to TASK-2098..TASK-2102 successfully in agent_tasks.csv!")

with open(project_memory, "r", encoding="utf-8") as f:
    mem_text = f.read()

mem_text = mem_text.replace("TASK-2093` to `TASK-2097", "TASK-2098` to `TASK-2102")

with open(project_memory, "w", encoding="utf-8", newline="") as f:
    f.write(mem_text)

print("Updated PROJECT_MEMORY.md successfully!")
