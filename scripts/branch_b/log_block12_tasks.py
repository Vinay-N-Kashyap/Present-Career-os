import datetime

commit = '562b3245'
now = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
tasks = [
    ('TASK-2138', '"bcom_ban Day 56: Central Banking Operations & Monetary Policy Transmission: LAF, OMO, SDF & Liquidity Management"', 'Completed', commit, 'Present-Career-os-commerce', 'agent/branch-b-curriculum-commerce-iot', now),
    ('TASK-2139', '"bcom_ban Day 57: Sovereign Debt Issuance & Primary Dealer Architecture: G-Sec Auctions, Underwriting & STRIPS Mechanics"', 'Completed', commit, 'Present-Career-os-commerce', 'agent/branch-b-curriculum-commerce-iot', now),
    ('TASK-2140', '"bcom_ban Day 58: Open Banking, API Banking & Account Aggregator Architecture: Open Finance & Consent Governance"', 'Completed', commit, 'Present-Career-os-commerce', 'agent/branch-b-curriculum-commerce-iot', now),
    ('TASK-2141', '"bcom_ban Day 59: Climate Risk, ESG Banking & Sustainable Finance Taxonomy: Green Bond Principles & Financed Emissions"', 'Completed', commit, 'Present-Career-os-commerce', 'agent/branch-b-curriculum-commerce-iot', now),
    ('TASK-2142', '"bcom_ban Day 60: Milestone 12 Grand Master Capstone: Enterprise Central Banking, Sovereign Treasury, Open Banking & ESG Solvency Master War Room Simulator (Course 05 60/60 Graduated 100%)"', 'Completed', commit, 'Present-Career-os-commerce', 'agent/branch-b-curriculum-commerce-iot', now)
]

with open(r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv', 'a', encoding='utf-8') as f:
    for t in tasks:
        f.write(','.join(t) + '\n')

print('Successfully appended tasks 2138-2142')
