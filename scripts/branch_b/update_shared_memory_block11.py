# -*- coding: utf-8 -*-
import os

csv_path = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
tasks = [
    'TASK-2028,"bcom-marketing Day 51: Global Brand Governance, Trademark Portfolios & Multi-Jurisdictional IP Valuation",Completed,01892702,Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,2026-10-25 17:48:00\n',
    'TASK-2029,"bcom-marketing Day 52: Marketing Operations (MOps), Agile Marketing Sprints & Creative Operations Governance",Completed,01892702,Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,2026-10-25 17:48:00\n',
    'TASK-2030,"bcom-marketing Day 53: Predictive Customer Analytics, Uplift Modeling & Algorithmic Churn Interventions",Completed,01892702,Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,2026-10-25 17:48:00\n',
    'TASK-2031,"bcom-marketing Day 54: Sustainable Marketing, ESG Brand Metrics, Carbon Audits & Anti-Greenwashing Compliance",Completed,01892702,Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,2026-10-25 17:48:00\n',
    'TASK-2032,"bcom-marketing Day 55: Milestone 11 Capstone: Global Omnichannel Brand Governance & Predictive MOps Simulator",Completed,01892702,Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,2026-10-25 17:48:00\n'
]

with open(csv_path, 'a', encoding='utf-8') as f:
    for t in tasks:
        f.write(t)

print("Appended TASK-2028 to TASK-2032 to agent_tasks.csv successfully!")
