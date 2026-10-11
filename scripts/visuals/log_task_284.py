import os
import csv
from datetime import datetime

# 1. Update agent_tasks.csv
csv_path = r'C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv'
now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

task_row = [
    'TASK-284',
    'Architect Course 36 (Professional Tech Communication & Interview Mastery) 60-Day Masterclass (240 Quests) & Expand PDF to Part XL',
    'Completed',
    'Antigravity',
    now_str,
    now_str,
    'course-softskills-communication specs complete (240 quests: Q36.1 to Q36.240), compiled Part XL into Master PDF (22.43 MB DOM, 8,622 total quests across 36 courses).'
]

with open(csv_path, 'a', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(task_row)

print("Updated agent_tasks.csv with TASK-284")

# 2. Update PROJECT_MEMORY.md
memory_path = r'C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md'

memory_entry = f"""
### Task Record: TASK-284 & Course 36 Masterclass Completion ({now_str})
- **Course**: Course 36: Professional Tech Communication & Interview Mastery (`course-softskills-communication`) &mdash; Part XL (60 Days &bull; 240 Quests Total: Q36.1 to Q36.240).
- **Month 1 Scope (Days 01&ndash;30 / 120 Quests: Q36.1 to Q36.60)**:
  - Information Theory in Engineering Discourse (Shannon Entropy, Signal-to-Noise Ratio, Cognitive Load Minimization), Structured Verbal Frameworks (PREP: Point Reason Example Point, Barbara Minto's Pyramid Principle, MECE Arguments), Technical Precision vs Jargon Across Cross-Functional Domains (Metaphorical Isomorphism), Active Listening, Psychological Safety (Amy Edmondson) and Non-Violent Communication (NVC) in High-Stakes Reviews, Milestone 1: ApexVoice Technical Executive Briefing Engine Suite, The Art of De-risking Technical Questioning (Socratic Inquiry, Boundary Discovery), Constructive Feedback and Conventional Comments PR Review Etiquette, Architecture Decision Records (ADRs: Context, Decision, Consequences, Anti-Amnesia), Request for Comments (RFC) Engineering and Multi-Stakeholder Consensus Building, Milestone 2: ApexRFC Enterprise Architectural Consensus Engine Suite, Production Runbooks and Zero-Ambiguity Disaster Recovery Procedures, Asynchronous Written Communication Hygiene (No-Hello, Self-Contained Dispatches, RACI Matrices), Technical Release Notes and Breaking API Deprecation Workflows, Blameless Engineering Post-Mortems (Sydney Dekker Systems Safety, Five Whys, Closed-Loop Action Items), Milestone 3: ApexIncident Institutional Blameless Post-Mortem & Runbook Suite, Behavioral Interview Architecture and Engineering Leveling Matrices (L4 to L7 Scope), The STAR+L Framework (15/10/50/15/10 Time Allocation Rule), Story Mining and the 15-Story Career Master Matrix, Mastering Conflict Resolution Stories (Andy Grove's Disagree and Commit), Quantifying Engineering Impact into Revenue and Cost Metrics, Addressing Production Failure and Vulnerability Authentically, Milestone 4: ApexBehavioral Institutional Behavioral Interview Simulation & Story Bank Suite, Facilitating Architecture Review Boards (ARBs: Nemawashi, Timeboxing, Parking Lots), Engineering 1-on-1 Upward Management, Principled Technical Negotiation (Iron Triangle, Chris Voss Tactical Empathy), Crisis Incident Command Communication (ICS Bridge Discipline, Status Pages), Cross-Functional Alignment (Product, Design, Legal, Compliance), Technical Presentations and Edward Tufte Visual Storytelling, High-Signal Reverse-Interviewing to Detect Toxic Teams, and Capstone 1: ApexSpeaker Institutional Executive Technical Communication & Behavioral Leadership Master Capstone Viva Gate.
- **Month 2 Scope (Days 31&ndash;60 / 120 Quests: Q36.121 to Q36.240)**:
  - System Design Interview Protocol (Scope Clarification, Functional/Non-Functional Bounds, Back-of-the-Envelope Capacity Estimations), Driving the Virtual Whiteboard (Top-Down Visual Hierarchy, API Contracts, Iterative Deep Dives), Communicating Architectural Trade-Offs Under Pressure (CAP, PACELC, Latency vs Consistency, Cost vs Throughput), Handling Interviewer Pushback and Curveballs (Graceful Pivots, Intellectual Flexibility), Milestone 4 (M2): ApexDesign System Design Whiteboard Communication & Live Trade-Off Suite, Live Coding Communication During Pair Programming (Thinking Out Loud Without Syntactic Noise, Milestone Narration, Test-Driven Exposition), Scientific Debugging Under Interview Pressure (Methodical Hypothesis Testing, Trace Tables), The Four Staff Engineer Archetypes (Will Larson: Tech Lead, Architect, Solver, Right Hand) and Style Modulation, Building Grassroots Coalitions and Bottom-Up Technology Adoption (Lighthouse Teams, Diffusion Curves), Milestone 5: ApexInfluence Grassroots Engineering Coalition & Tech Strategy Suite, Managing Executive C-Suite Stakeholders (Amazon 6-Page Narrative Memos, Risk Heat Maps, Financial ROI Translation), Authoring 3-Year North Star Engineering Strategy Documents (Richard Rumelt Strategy Kernel, Phased Roadmaps), Organizational Culture and Technical Sponsorship (Engineering Career Ladders, Multiplication), Navigating Reorganizations, Layoffs, and Strategy Pivots (Preserving Morale, Asset Salvage), Milestone 6: ApexStrategy Multi-Year Technical Vision & Strategic Alignment Suite, Tech Offer Evaluation (Base, Liquid RSUs, ISO/NSO Options, 409A, Liquidation Preferences, AMT Taxes), The Compensation Negotiation Playbook (Competing Offers, Non-Monetary Dials, Polite Closing Triggers), Navigating Difficult Performance Conversations (Radical Candor, Objective Documentation, PIPs), Delivering Bad News to Leadership (Early Escalation, Mitigation Options), Milestone 7: ApexNegotiation High-Stakes Tech Compensation & Executive Negotiation Engine Suite, Public Speaking and Tech Conference CFPs, Viral Technical Writing for Publication (Hacker News Mechanics, Reproducible Benchmarks), Remote and Distributed Asynchronous Sovereignty (GitLab Handbook-First, Loom Walkthroughs, Global Time Zone Hygiene), The Complete Staff+ 5-Round Onsite Interview Gauntlet (Bayesian Independence, Mental Resets), Historic Communication Catastrophe 1: Space Shuttle Challenger O-Ring Disaster (Edward Tufte Data Visualization Critique), Historic Communication Catastrophe 2: Three Mile Island Nuclear Meltdown (Command vs Verified Physical State Telemetry), Historic Communication Catastrophe 3: Knight Capital $440M 45-Minute Algorithmic Bankruptcy (Failed Deployment Communication, Missing Circuit Breakers), Historic Communication Catastrophe 4: Mars Climate Orbiter Metric/Imperial Crash (Unvalidated Interface Units, Type-Level Dimensional Branding), The Principal Engineer Modernization RFC: Restructuring Global Communication, ARBs & Promotion Ladders ($5M Blueprint), and Capstone 2: ApexExecutiveComms Enterprise Cross-Functional Alignment, Crisis Escalation & Principal Engineer Interview Portfolio Master Capstone Viva Gate.
- **Master PDF Expansion**: Part XL compiled successfully. HTML characters: 22,431,398 (~22.43 MB DOM), 14,358,805 bytes PDF, exit code 0. Cumulative: 36 courses completed, 8,622 quests total across 2,160 days.
"""

with open(memory_path, 'a', encoding='utf-8') as f:
    f.write(memory_entry)

print("Updated PROJECT_MEMORY.md with TASK-284")
