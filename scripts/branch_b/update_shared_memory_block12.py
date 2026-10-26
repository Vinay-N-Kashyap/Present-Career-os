# -*- coding: utf-8 -*-
import os

csv_path = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
tasks = [
    'TASK-2033,"bcom-marketing Day 56: Generative AI in Marketing, Synthetic Audiences, LLM Brand Voice Fine-Tuning & Algorithmic Dynamic Creative Optimization (DCO)",Completed,671c3e2a,Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,2026-10-25 18:13:00\n',
    'TASK-2034,"bcom-marketing Day 57: Decentralized Brand Ecosystems, Tokenomics, Web3 Loyalty Architecture & Zero-Knowledge Verification",Completed,671c3e2a,Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,2026-10-25 18:13:00\n',
    'TASK-2035,"bcom-marketing Day 58: Marketing Financial Engineering: Econometric Media Mix Modeling (MMM), Hierarchical Bayesian Regression & Robyn/Meridian Synthesis",Completed,671c3e2a,Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,2026-10-25 18:13:00\n',
    'TASK-2036,"bcom-marketing Day 59: Global CMO Executive Leadership: Boardroom Fiduciary Governance, M&A Brand Integration & C-Suite Capital Allocation",Completed,671c3e2a,Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,2026-10-25 18:13:00\n',
    'TASK-2037,"bcom-marketing Day 60: Milestone 12 Grand Capstone: The Global Enterprise Chief Marketing Officer (CMO) Autonomous Ecosystem & Boardroom Simulator",Completed,671c3e2a,Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,2026-10-25 18:13:00\n'
]

with open(csv_path, 'a', encoding='utf-8') as f:
    for t in tasks:
        f.write(t)

print("Appended TASK-2033 to TASK-2037 to agent_tasks.csv successfully!")
