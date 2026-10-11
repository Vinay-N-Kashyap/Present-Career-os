# scripts/visuals/generate_venture_m1_rest.py
# Generates scripts/visuals/venture_creation_spec_m1_rest.py for Days 16 to 30 (Course 29: Venture Creation & Lean Startup Engineering)

import json

DAYS_16_TO_30 = [
  {
    "day": 16,
    "month": 1,
    "blockNum": 4,
    "title": "Lean Operations & Six Sigma Quality Control: TIMWOODS 8 Wastes, DMAIC & Process Capability ($C_{pk} \\ge 1.33$)",
    "stageName": "Stage 2: Lean Operations, Unit Economics & Customer Discovery",
    "stageNum": 2,
    "pedagogicalRole": "Lean Quality Engineering, Defect Reduction & Statistical Process Control Invariants",
    "spokenGoal": "Startups love to move fast and break things, until broken things bankrupt the company. When customer onboarding workflows suffer 15% error rates and invoice billing creates customer refund disputes, your growth engine stalls on operational debt. Today we engineer Lean Operations & Six Sigma Quality Control for high-growth ventures. We master the 8 Wastes of Lean (TIMWOODS: Transportation, Inventory, Motion, Waiting, Overproduction, Overprocessing, Defects, Skills). We apply the DMAIC framework (Define, Measure, Analyze, Improve, Control) to startup business processes. We calculate the Process Capability Index ($C_{pk} = \\min(\\frac{USL - \\mu}{3\\sigma}, \\frac{\\mu - LSL}{3\\sigma})$), proving why a 4-Sigma capability ($C_{pk} \\ge 1.33$) is the non-negotiable benchmark for enterprise B2B service delivery.",
    "conceptInvariant": "Process Capability & Zero-Defect Invariant: An operational business process satisfies 4-Sigma commercial quality standards if and only if its Process Capability Index satisfies $C_{pk} \\ge 1.33$: $C_{pk} = \\min \\left( \\frac{USL - \\mu}{3\\sigma}, \\frac{\\mu - LSL}{3\\sigma} \\right) \\ge 1.33$; where $USL$ and $LSL$ are Upper and Lower Specification Limits defined by customer SLAs, $\\mu$ is process mean, and $\\sigma$ is operational standard deviation; when $C_{pk} < 1.0$, process defect rate exceeds 2,700 defects per million opportunities (DPMO), triggering catastrophic SLA customer churn.",
    "failureMode": "A B2B payroll SaaS startup scales rapidly from 50 to 500 corporate clients. To keep up with demand, customer onboarding specialists manually enter bank routing numbers and employee tax withholding data. Process standard deviation $\\sigma$ explodes to 4.2 errors per batch ($C_{pk} = 0.42$). On the first payroll run of the month, 38 client companies suffer payroll processing failures, resulting in 1,200 employees not receiving paychecks on Friday. Five corporate clients immediately cancel their contracts, sue for breach of SLA, and report the startup to state labor regulators.",
    "tryItFriction": "Build an Enterprise Lean DMAIC & Process Capability Engine in Python: 1) Ingest operational cycle time and defect logs from customer onboarding, invoice billing, or ticket resolution; 2) Classify observed process delays into the TIMWOODS 8 Wastes taxonomy; 3) Compute sample mean ($\\mu$), standard deviation ($\\sigma$), and Process Capability indices ($C_p$ and $C_{pk}$) against customer SLA specification limits; 4) Calculate expected Defect Rate in DPMO; 5) Generate automated Six Sigma control charts (X-bar and R charts) flagging out-of-control operational drift.",
    "socraticHints": [
      "Why is a process with $C_p = 2.0$ but $C_{pk} = 0.5$ considered a catastrophic operational hazard?",
      "Because $C_p$ measures only process spread relative to specification width, ignoring whether the process is centered!",
      "A process with low spread that is centered off-target ($C_{pk} = 0.5$) will consistently produce defective output beyond the specification limit."
    ],
    "situationalPuzzle": {
      "scenario": "A B2B SaaS company promises an SLA Upper Specification Limit (USL) of 60 minutes for customer data ingestion. The engineering team measures 1,000 ingestion jobs: Mean cycle time mu = 42 minutes, Standard Deviation sigma = 4 minutes. (Lower limit is 0). The VP of Operations claims: 'Since our average is 42 minutes, which is well below 60 minutes, our process is flawless.' What is the true Process Capability C_pk and operational quality grade?",
      "options": [
        "C_pk = 42 / 60 = 0.70; poor quality.",
        "C_pk = (USL - mu) / (3 * sigma) = (60 - 42) / (3 * 4) = 18 / 12 = 1.50. Since C_pk >= 1.33, the process operates at superior 4.5-Sigma capability, with an expected defect rate under 3.4 defects per million operations.",
        "C_pk = 60 / 4 = 15.0; perfect quality.",
        "Six Sigma cannot be applied to cloud software because servers don't have standard deviations."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Calculating Process Capability: $C_{pk} = (USL - \\mu) / (3\\sigma) = (60 - 42) / (3 \\times 4) = 18 / 12 = 1.50$. In industrial quality engineering, a $C_{pk} \\ge 1.33$ represents a capable 4-Sigma process, and $C_{pk} \\ge 1.50$ represents a world-class 4.5-Sigma process. The team's data ingestion pipeline operates well within acceptable statistical tolerance limits."
    },
    "quests": [
      {
        "id": "Q16.1",
        "title": "Concept: The TIMWOODS Taxonomy, DMAIC Roadmap & Process Capability Mathematics",
        "type": "Concept",
        "description": "Analyze the mathematical foundations of Six Sigma: normal distribution tails, Defect per Million Opportunities (DPMO) calculations, $C_p$ vs $C_{pk}$ process indices, and the DMAIC continuous improvement cycle."
      },
      {
        "id": "Q16.2",
        "title": "Detective Challenge: The High-Churn Onboarding Quality Forensic Audit",
        "type": "Detective Challenge",
        "description": "Audit an enterprise software startup where 24% of new customers cancel during onboarding: write a Python forensics script that analyzes onboarding task completion logs, identifies 3 hidden TIMWOODS waste loops, and reveals a $C_{pk}$ of 0.38 at the data migration step."
      },
      {
        "id": "Q16.3",
        "title": "Mastery Assignment: Production-Grade DMAIC Statistical Process Control Suite",
        "type": "Mastery Assignment",
        "description": "Build an enterprise operational quality platform in Python: ingest simulated process telemetry streams, compute real-time $\\mu$, $\\sigma$, and $C_{pk}$ metrics, generate interactive Shewhart X-bar/R control charts, and flag statistical rule violations."
      },
      {
        "id": "Q16.4",
        "title": "Production Incident Lab: Emergency Operational Triage on Escalating SLA Breaches",
        "type": "Production Incident Lab",
        "description": "A surge in enterprise orders drives customer support ticket resolution $C_{pk}$ down to 0.62, triggering $50,000 in SLA penalty clauses: execute an automated DMAIC triage protocol that eliminates overprocessing waste, re-centers the process mean, and restores $C_{pk} \\ge 1.33$ within 24 hours."
      }
    ]
  },
  {
    "day": 17,
    "month": 1,
    "blockNum": 4,
    "title": "Kanban Production Systems & Pull Physics: WIP Limits, Little's Law Buffer Sizing & Toyota Production System (TPS)",
    "stageName": "Stage 2: Lean Operations, Unit Economics & Customer Discovery",
    "stageNum": 2,
    "pedagogicalRole": "Pull Production Engineering, WIP Constraint Physics & Toyota Production System (TPS)",
    "spokenGoal": "Traditional management pushes work onto workers: 'Here are 20 tasks, get them all done!' The result is multitasking chaos, half-finished projects, and long delivery cycles. Taiichi Ohno and the Toyota Production System (TPS) revolutionized global manufacturing by replacing push systems with Pull Production and Kanban. In a pull system, work is never started until downstream capacity is available. Today we engineer Kanban Production Systems & Pull Physics for technology startups. We master Work-in-Progress (WIP) Limits, Little's Law buffer sizing, Lead Time vs Cycle Time physics, and Cumulative Flow Diagrams (CFD). You will learn why reducing WIP limits by 50% paradoxically increases engineering and sales throughput while slashing delivery cycle times.",
    "conceptInvariant": "Kanban Pull & WIP Little's Law Invariant: Average cycle time $W$ is directly proportional to Work-in-Progress ($L$) for a constant throughput rate $\\lambda$: $W = \\frac{L}{\\lambda}$; imposing strict WIP limits $L \\le L_{\\max}$ prevents queue explosion and eliminates context-switching multitasking penalties: $\\text{Multitasking Penalty} = 1 - (1 - p)^{n-1}$; in a balanced Kanban system, the departure of a completed item upstream triggers a pull signal (Kanban card) authorizing the induction of exactly one new item: $\\Delta L = 0$.",
    "failureMode": "A software engineering team of 8 developers has 45 user stories simultaneously marked 'In Progress' on their Jira board (an average of 5.6 active tasks per engineer). Because engineers constantly context-switch between coding, debugging, and review requests, task cycle time blows out from 3 days to 28 days. Merge conflicts multiply, code reviews sit un-reviewed for 2 weeks, and the team misses their quarterly product release deadline. The CEO assumes the team is lazy and tries to hire more engineers, worsening the communication overhead.",
    "tryItFriction": "Build an Automated Kanban Pull Engine & Cumulative Flow Diagram (CFD) Simulator in Python: 1) Model a 4-stage Kanban workflow (Backlog, In-Dev, Review, Deployed); 2) Impose configurable WIP limits on In-Dev and Review; 3) Simulate incoming task arrivals under stochastic service times; 4) Calculate Little's Law metrics ($L, \\lambda, W$) and multitasking penalty curves; 5) Plot an interactive Cumulative Flow Diagram (CFD) identifying process starvation vs bottleneck accumulation.",
    "socraticHints": [
      "Why does letting developers work on 5 tasks at once make each task take $10\\times$ longer to finish?",
      "Because human cognitive context switching incurs massive cognitive load: every time an engineer switches tasks, 20-30% of mental focus is burned reloading mental state.",
      "Finishing one task before starting the next (Stop Starting, Start Finishing) collapses cycle times."
    ],
    "situationalPuzzle": {
      "scenario": "A startup engineering team has a steady throughput rate of 10 completed pull requests per week. Currently, there are 40 pull requests marked 'In Progress' across the team. The VP of Engineering implements strict Kanban WIP limits, capping total 'In Progress' work at 10 pull requests. Assuming throughput rate remains at 10 PRs/week, what happens to the average cycle time (lead time) of a pull request?",
      "options": [
        "Cycle time remains 4 weeks because engineers write the same lines of code.",
        "Under Little's Law (W = L / lambda): Initial Cycle Time W_1 = 40 / 10 = 4.0 weeks. With WIP capped at 10 (L_2 = 10): New Cycle Time W_2 = 10 / 10 = 1.0 week! Average cycle time collapses from 4 weeks to 1 week—a 75% reduction in delivery delay with zero change in team headcount!",
        "Cycle time increases to 10 weeks because WIP limits restrict freedom.",
        "Throughput drops to zero because engineers are idle."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Little's Law ($W = L / \\lambda$) governs operational cycle times. When WIP ($L$) is 40, tasks sit waiting in queues and context-switching buffers for an average of 4.0 weeks. Capping WIP at 10 immediately reduces cycle time to 1.0 week ($10 / 10$). Tasks fly through the pipeline because engineers focus on finishing open work rather than opening new stalled threads."
    },
    "quests": [
      {
        "id": "Q17.1",
        "title": "Concept: Toyota Production System (TPS) Foundations, Pull Signals & Cumulative Flow Dynamics",
        "type": "Concept",
        "description": "Deconstruct Taiichi Ohno's pull production physics: analyze physical vs virtual Kanban cards, WIP limit mathematics, Cumulative Flow Diagram (CFD) band divergence, and lead time probability distributions."
      },
      {
        "id": "Q17.2",
        "title": "Detective Challenge: The Stalled Engineering Mezzanine CFD Forensic Audit",
        "type": "Detective Challenge",
        "description": "Analyze 6 months of Jira event logs from a struggling tech startup: write a Python script that constructs a Cumulative Flow Diagram, detects widening lead-time bands at Code Review, and proves how eliminating WIP limits caused cycle time to quadruple."
      },
      {
        "id": "Q17.3",
        "title": "Mastery Assignment: Production-Grade Kanban Pull Simulation & CFD Engine",
        "type": "Mastery Assignment",
        "description": "Build an enterprise Kanban simulation platform in Python: implement strict stage WIP bounds, model stochastic task flow, track Little's Law compliance, compute cycle time percentiles (p50, p90, p99), and generate automated CFD visual ledgers."
      },
      {
        "id": "Q17.4",
        "title": "Production Incident Lab: Emergency WIP Limit Enforcement during Release Lockup",
        "type": "Production Incident Lab",
        "description": "A mission-critical product launch stalls with 60 open pull requests and 18 un-merged hotfixes: execute an automated emergency pull protocol that freezes all new feature development, caps WIP at 6, and clears the deployment pipeline within 36 hours."
      }
    ]
  },
  {
    "day": 18,
    "month": 1,
    "blockNum": 4,
    "title": "Customer Discovery Interview Architecture: Rob Fitzpatrick's 'The Mom Test', Anti-Bias Questioning & Unvarnished Truth Extraction",
    "stageName": "Stage 2: Lean Operations, Unit Economics & Customer Discovery",
    "stageNum": 2,
    "pedagogicalRole": "Customer Research Engineering, Behavioral Interview Physics & Anti-Bias Truth Extraction",
    "spokenGoal": "The easiest person to fool is yourself, and when you ask friends, family, or prospective customers: 'Would you buy a product that does X?', they will almost always lie to you to be polite. This polite validation is lethal. Rob Fitzpatrick's 'The Mom Test' formulated the definitive protocol for talking to customers when everyone is lying to you: ask questions that even your own mother couldn't lie to you about. Today we engineer Customer Discovery Interview Architecture. We master the 3 golden rules of The Mom Test: 1) Talk about their life, not your idea; 2) Ask about specific past behavior, not hypothetical future promises; 3) Talk less and listen more. You will learn how to design interview scripts that extract unvarnished customer truth, identify workarounds, and measure actual willingness to pay.",
    "conceptInvariant": "The Mom Test Truth-Extraction Invariant: A customer discovery interview yields valid predictive signal if and only if all questions query empirical past behavior rather than hypothetical future intentions: $\\text{Query}(t) \\in \\text{PastBehavior}(t < t_{\\text{interview}})$ and $\\text{Query}(t) \\cap \\text{FutureOpinion} = \\emptyset$; predictive validity decays to zero when asking speculative questions ($P(\\text{Truth} | \\text{'Would you buy?'}) \\approx 0$); customer pain severity is measured strictly by historical expenditure of time, money, or manual workarounds: $\\text{Severity} \\propto \\text{Cost}(\\text{Current Workaround})$.",
    "failureMode": "Two founders interview 30 marketing directors and ask: 'If we built an AI tool that automated your social media copywriting for $100/month, would you buy it?' All 30 directors say 'Yes, that sounds incredible!' The founders spend 6 months building the product. When they launch and email the 30 directors with a Stripe payment link, 29 ignore the email and 1 says 'We don't have budget right now.' The founders asked a hypothetical question that invited polite lies rather than extracting past behavioral reality.",
    "tryItFriction": "Build an Automated Mom Test Interview Auditor in Python: 1) Ingest customer interview transcripts; 2) Implement an NLP bias detector identifying toxic hypothetical questions (e.g., 'Would you...', 'Do you think...', 'How much would you pay for...'); 3) Detect valid behavioral probes (e.g., 'When was the last time you...', 'How do you currently solve...', 'How much did you spend on...'); 4) Extract and quantify existing customer workarounds and budget allocations; 5) Compute an Interview Signal-to-Noise Score (0-100%).",
    "socraticHints": [
      "Why is asking 'How much would you pay for this software?' a completely useless question in customer discovery?",
      "Because customers have no idea what they would pay for an imaginary product and will quote random numbers, usually lower to anchor or higher to be polite.",
      "Ask instead: 'What do you currently spend to solve this problem today?' If they spend $0 and use a free Excel sheet they don't care about, they will not pay you."
    ],
    "situationalPuzzle": {
      "scenario": "A startup founder is interviewing a VP of Supply Chain about a new warehouse route optimization tool. The founder wants to know if the company has budget for logistics software. Which of the following questions strictly adheres to The Mom Test?",
      "options": [
        "Would you be willing to pay $5,000 a month if our software could reduce your warehouse travel time by 20%?",
        "How do you currently route your warehouse pickers today, when was the last time you bought software to improve that process, and how much did your team spend on that purchase?",
        "Don't you agree that existing warehouse management systems are outdated and frustrating?",
        "What features would your dream warehouse software have?"
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Under The Mom Test, valid questions query past factual behavior: 'How do you do it today? When was the last time you bought software for this? How much did you spend?'. This extracts whether the customer actively experiences the pain, whether they have spent actual money solving it, and reveals their real procurement hurdles without pitching your idea or inviting polite hypothetical lies."
    },
    "quests": [
      {
        "id": "Q18.1",
        "title": "Concept: The Mom Test Framework & The Epistemology of Customer Discovery",
        "type": "Concept",
        "description": "Analyze Rob Fitzpatrick's Mom Test principles; formulate the three core rules of unvarnished truth extraction; analyze cognitive biases (Courtesy Bias, Confirmation Bias, Hypothetical Bias) in customer research."
      },
      {
        "id": "Q18.2",
        "title": "Detective Challenge: The Biased Discovery Transcript Forensic Audit",
        "type": "Detective Challenge",
        "description": "Audit transcripts of 20 customer discovery interviews conducted by an over-enthusiastic founder: write a Python script that tags 45 leading questions, strips polite compliment noise, and proves that zero customers possess an active, funded workaround."
      },
      {
        "id": "Q18.3",
        "title": "Mastery Assignment: Enterprise Customer Discovery Analysis & Workaround Scoring Engine",
        "type": "Mastery Assignment",
        "description": "Construct an automated interview intelligence platform in Python: ingest raw audio transcripts, classify question types (Hypothetical vs Behavioral), score customer pain intensity based on documented past financial spend, and generate executive Problem Validation Reports."
      },
      {
        "id": "Q18.4",
        "title": "Production Incident Lab: Live Customer Interview Pivot during Floundering Sales Discovery",
        "type": "Production Incident Lab",
        "description": "During a live enterprise discovery call, the prospect becomes defensive and dismissive of your pitch: execute a real-time conversational pivot script that halts the presentation, transitions to Mom Test historical inquiry, and extracts a critical $250,000 unaddressed compliance struggle."
      }
    ]
  },
  {
    "day": 19,
    "month": 1,
    "blockNum": 4,
    "title": "B2B Enterprise Sales Pipeline Engineering: MQL to SQL Conversion, Pipeline Velocity, ACV & Staged Funnels",
    "stageName": "Stage 2: Lean Operations, Unit Economics & Customer Discovery",
    "stageNum": 2,
    "pedagogicalRole": "Enterprise Sales Engineering, Pipeline Velocity Mechanics & Funnel Invariants",
    "spokenGoal": "Enterprise sales is not charismatic schmoozing over golf; it is an algorithmic, predictable conversion engine. If you treat sales as an art rather than an engineering pipeline, your startup will suffer wild quarterly revenue swings and burn out sales reps. Today we engineer B2B Enterprise Sales Pipelines. We define staged funnel architectures: Marketing Qualified Lead (MQL), Sales Qualified Lead (SQL), Opportunity, Technical Validation / POC, Proposal, and Closed-Won. We master the Pipeline Velocity Equation ($V = \\frac{N \\times ACV \\times \\text{WinRate}}{L}$), quantifying how deal count ($N$), Average Contract Value ($ACV$), Win Rate, and Sales Cycle Length ($L$) combine to determine daily revenue generation. You will learn how to design BANT/MEDDIC qualification frameworks and diagnose pipeline blockages.",
    "conceptInvariant": "Pipeline Velocity & Conversion Equilibrium Invariant: B2B Enterprise Pipeline Velocity $V_{\\text{sales}}$ (revenue generated per day) is defined by the fundamental pipeline equation: $V_{\\text{sales}} = \\frac{N \\times ACV \\times \\text{WinRate}}{L}$; where $N$ is active qualified opportunities, $ACV$ is Average Contract Value ($), $\\text{WinRate} \\in [0, 1]$ is staged historical win probability, and $L$ is average sales cycle length in days; a healthy enterprise pipeline maintains $3\\times - 4\\times$ pipeline coverage relative to quarterly quota: $\\sum_{i} \\text{OpportunityValue}_i \\ge 3.5 \\times \\text{QuarterlyQuota}$.",
    "failureMode": "An enterprise security startup boasts a $12,000,000 sales pipeline to its board. However, the VP of Sales does not enforce MEDDIC qualification. Of the 40 deals in the pipeline, 32 have been sitting in 'Technical Evaluation' for over 180 days with no Economic Buyer identified. Average sales cycle $L$ blows out from 60 days to 240 days, causing Pipeline Velocity to crash by 75%. At the end of Q3, the company closes only $350,000 against a $2,500,000 quota, burning through cash reserves and triggering executive layoffs.",
    "tryItFriction": "Build an Enterprise Sales Pipeline Velocity & Funnel Simulator in Python: 1) Ingest B2B CRM deal logs with stage entry timestamps and deal values; 2) Compute stage-by-stage conversion probabilities (MQL -> SQL -> Demo -> POC -> Closed-Won); 3) Calculate Average Contract Value ($ACV$), Win Rate, and Sales Cycle Length ($L$) by deal size tier; 4) Compute Pipeline Velocity ($V$) in dollars per day; 5) Implement MEDDIC qualification scoring and identify stalled 'zombie deals' older than $2\\times$ average cycle length.",
    "socraticHints": [
      "What happens to your sales revenue velocity if you double your average sales cycle length ($L$) from 30 days to 60 days?",
      "Revenue velocity cuts in half! Cycle length is in the denominator of the pipeline velocity equation: $V = (N \\times ACV \\times \\text{WinRate}) / L$.",
      "Shortening sales cycles by eliminating procurement friction is often much easier and more lucrative than trying to double lead volume."
    ],
    "situationalPuzzle": {
      "scenario": "A B2B SaaS startup has 50 active qualified enterprise opportunities in its sales pipeline. Average Contract Value ACV = $40,000. Historical win rate is 25%. Average sales cycle length L = 100 days. The sales team proposes two initiatives: Initiative 1: Increase lead count N from 50 to 70 (keeping other metrics constant). Initiative 2: Streamline legal contracts to reduce sales cycle L from 100 days to 60 days (keeping N=50). Which initiative yields higher daily Pipeline Velocity?",
      "options": [
        "Both initiatives produce identical revenue because pipeline metrics are linear.",
        "Initiative 1 Velocity: V_1 = (70 * $40k * 0.25) / 100 = $7,000/day. Initiative 2 Velocity: V_2 = (50 * $40k * 0.25) / 60 = $8,333/day. Initiative 2 generates $1,333 more per day ($3.04M/yr vs $2.55M/yr), proving that compressing sales cycle time is significantly more powerful than simply stuffing more top-of-funnel leads.",
        "Initiative 1 is better because more leads always guarantee higher enterprise valuation.",
        "Sales velocity cannot be measured in dollars per day."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Calculating Pipeline Velocity: Current baseline = (50 * $40k * 0.25) / 100 = $5,000/day. Under Initiative 1 (more leads): V_1 = (70 * $40k * 0.25) / 100 = $7,000/day (+40%). Under Initiative 2 (shorter cycle): V_2 = (50 * $40k * 0.25) / 60 = $8,333/day (+66.7%). Compressing sales cycle length has a non-linear compounding impact on velocity because the same sales team can run more cycles per year."
    },
    "quests": [
      {
        "id": "Q19.1",
        "title": "Concept: The Pipeline Velocity Equation & MEDDIC Qualification Architecture",
        "type": "Concept",
        "description": "Derive the B2B Pipeline Velocity equation; analyze staged funnel conversion physics; formalize the MEDDIC qualification framework (Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion)."
      },
      {
        "id": "Q19.2",
        "title": "Detective Challenge: The Stalled Enterprise Pipeline Zombie Deal Audit",
        "type": "Detective Challenge",
        "description": "Audit an enterprise CRM database with $20M in reported pipeline: write a Python forensics script that analyzes stage dwell times, email response latencies, and flags 28 'zombie deals' lacking an Economic Buyer, cutting real pipeline value to $4.2M."
      },
      {
        "id": "Q19.3",
        "title": "Mastery Assignment: Production-Grade B2B Sales Pipeline Analytics Suite",
        "type": "Mastery Assignment",
        "description": "Build an enterprise sales analytics platform in Python: ingest synthetic CRM deal stages, calculate dynamic stage conversion matrices, compute multi-tier Pipeline Velocity, model quota coverage ratios, and generate executive sales forecasting waterfall charts."
      },
      {
        "id": "Q19.4",
        "title": "Production Incident Lab: Emergency End-of-Quarter Pipeline Acceleration Sprints",
        "type": "Production Incident Lab",
        "description": "With 14 days remaining in Q4, your startup is $300,000 short of its ARR target: execute an automated deal triage script that scores the top 10 late-stage opportunities on close probability, deploys executive sponsor intervention, and closes 3 key accounts before midnight."
      }
    ]
  },
  {
    "day": 20,
    "month": 1,
    "blockNum": 4,
    "title": "Milestone 4: ApexMetrics Enterprise SaaS Unit Economics & Sales Velocity Engine (CAC, LTV, NDR & Rule of 40)",
    "stageName": "Stage 2: Lean Operations, Unit Economics & Customer Discovery",
    "stageNum": 2,
    "pedagogicalRole": "Enterprise Software Engineering Milestone: SaaS Unit Economics & Sales Velocity Engine",
    "spokenGoal": "You have reached Milestone 4! Over Days 16 to 19, you mastered Lean Six Sigma Quality Control, Kanban Pull Systems, The Mom Test Customer Discovery, and Enterprise B2B Sales Pipeline Velocity. Today you integrate these disciplines into an executive software suite: ApexMetrics. ApexMetrics is a production-grade Python platform that computes and audits institutional SaaS unit economics and sales velocity. It ingests subscription billing and CRM transaction feeds to compute Customer Acquisition Cost (CAC), Lifetime Value (LTV), LTV/CAC ratio, CAC Payback Period, Net Dollar Retention (NDR), Gross Dollar Retention (GDR), the SaaS Magic Number, and the Rule of 40.",
    "conceptInvariant": "ApexMetrics SaaS Unit Economics Invariant: A healthy venture-scale subscription business must satisfy 5 simultaneous unit economic invariants: 1) LTV/CAC ratio $\\frac{\\text{LTV}}{\\text{CAC}} \\ge 3.0$ where $\\text{LTV} = \\frac{\\text{ARPU} \\times \\text{GrossMargin}}{\\text{ChurnRate}}$; 2) CAC Payback Period $T_{\\text{payback}} = \\frac{\\text{CAC}}{\\text{ARPU} \\times \\text{GrossMargin}} \\le 12 \\text{ months}$; 3) Net Dollar Retention $\\text{NDR} = \\frac{\\text{Starting ARR} + \\text{Expansions} - \\text{Contractions} - \\text{Churn}}{\\text{Starting ARR}} \\ge 110\\%$; 4) SaaS Magic Number $\\frac{\\Delta \\text{ARR}_Q \\times 4}{\\text{Sales \\& Mktg Spend}_{Q-1}} \\ge 0.75$; 5) Rule of 40: $\\text{YoY ARR Growth Rate} + \\text{Free Cash Flow Margin} \\ge 40\\%$.",
    "failureMode": "A Series B software company reports rapid ARR growth from $3M to $8M. However, an audit reveals their Net Dollar Retention is only 78% (customers are churning fast), and CAC Payback Period is 38 months because they spend $4.20 on Google ads for every $1.00 of new ARR. The company's Rule of 40 score is -25% (166% growth minus 191% cash burn). When venture markets tighten, the company cannot raise a Series C, burns through its remaining $4M in cash within 6 months, and shuts down.",
    "tryItFriction": "Engineer the Complete ApexMetrics Software Suite in Python: 1) `engine/unit_economics.py`: Ingests cohort data, computes CAC, LTV, LTV/CAC, and Payback Period; 2) `engine/retention.py`: Computes cohort retention matrices, Net Dollar Retention (NDR), and Gross Dollar Retention (GDR); 3) `engine/sales_velocity.py`: Models staged pipeline conversion and daily Pipeline Velocity ($V = \\frac{N \\times ACV \\times WR}{L}$); 4) `engine/rule_of_40.py`: Evaluates SaaS Magic Number and Rule of 40 compliance; 5) `api/server.py`: Exposes FastAPI endpoints serving `/metrics/saas-health`.",
    "socraticHints": [
      "Why is Net Dollar Retention (NDR) considered the single most predictive metric of decacorn venture potential?",
      "Because when NDR > 120%, the business grows by 20%+ annually even if the sales team signs zero new customers!",
      "Expansion revenue from existing happy customers completely overcomes churn and compounds ARR exponentially with zero incremental acquisition cost."
    ],
    "situationalPuzzle": {
      "scenario": "ApexMetrics audits a SaaS startup with the following metrics: Annual ARR Growth Rate = 65%, Free Cash Flow Margin = -30%, CAC = $12,000, ARPU = $10,000/yr, Gross Margin = 80%, Annual Logo Churn = 10%, Expansion ARR from cohort = 25%. What is the company's Rule of 40 score, and does it satisfy the institutional LTV/CAC benchmark?",
      "options": [
        "Rule of 40 = 35%; LTV/CAC = 2.0; fails both benchmarks.",
        "Rule of 40 = 65% + (-30%) = 35% (slightly below the 40% benchmark). LTV calculation: LTV = ($10,000 * 0.80) / 0.10 = $80,000. LTV/CAC = $80,000 / $12,000 = 6.67x! Since LTV/CAC (6.67x) far exceeds the 3.0x benchmark, and NDR = 100% - 10% + 25% = 115% is strong, the unit economics are highly profitable despite aggressive growth burn.",
        "Rule of 40 = 95%; LTV/CAC = 15x; passes all benchmarks effortlessly.",
        "Rule of 40 is only for public companies and cannot be calculated for startups."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Rule of 40 = 65% (Growth) + (-30% FCF Margin) = 35%, which is slightly below the 40% threshold. However, the atomic unit economics are stellar: Unit Contribution Margin = $8,000/yr. At 10% churn, customer lifetime is 10 years, yielding LTV = $80,000. With CAC = $12,000, LTV/CAC is 6.67x (well above the 3.0x industry benchmark), and CAC payback is only 1.5 years ($12k / $8k). The startup has fundamentally sound unit economics."
    },
    "quests": [
      {
        "id": "Q20.1",
        "title": "Concept: The SaaS Metrics Taxonomy & Institutional Investment Benchmark Physics",
        "type": "Concept",
        "description": "Analyze the mathematical formulation of core SaaS metrics: CAC, LTV, Payback Period, Net Dollar Retention (NDR), Gross Dollar Retention (GDR), Magic Number, and the Rule of 40."
      },
      {
        "id": "Q20.2",
        "title": "Detective Challenge: The Masked Churn & Inflated LTV Forensic Audit",
        "type": "Detective Challenge",
        "description": "Audit an enterprise SaaS company claiming an 8x LTV/CAC ratio: write a Python script that recalculates true blended CAC (including sales salaries), replaces gross revenue with gross margin in LTV, and reveals true LTV/CAC is only 1.4x."
      },
      {
        "id": "Q20.3",
        "title": "Mastery Assignment: Full-Scale ApexMetrics SaaS Platform Implementation",
        "type": "Mastery Assignment",
        "description": "Build and unit-test the complete ApexMetrics Python platform: implement unit economics, cohort retention, pipeline velocity, and Rule of 40 modules; achieve 100% test coverage; deliver interactive REST API endpoints and visual dashboards."
      },
      {
        "id": "Q20.4",
        "title": "Production Incident Lab: Emergency Unit Economics Defense during Investor Due Diligence",
        "type": "Production Incident Lab",
        "description": "An auditor from a lead venture firm questions your customer payback period calculation during Series A diligence: execute ApexMetrics across 24 months of raw cohort billing logs, generate verified cohort survival curves, and secure unanimous partner sign-off."
      }
    ]
  },
  {
    "day": 21,
    "month": 1,
    "blockNum": 5,
    "title": "Institutional Venture Pitch Architecture & Storytelling: The 10-Slide YC/Sequoia Archetype & Traction Proof",
    "stageName": "Stage 3: Venture Financing, Term Sheets & Governance",
    "stageNum": 3,
    "pedagogicalRole": "Venture Capital Communications, Pitch Deck Engineering & Narrative Architecture",
    "spokenGoal": "Venture capitalists review over 1,000 pitch decks a year and invest in perhaps four. If your pitch deck is a 40-slide technical treatise filled with dense paragraphs, the partner will close the tab in 45 seconds. A venture pitch deck is not a user manual; it is an economic narrative engineered to generate FOMO (Fear Of Missing Out), prove undeniable customer traction, and demonstrate a credible path to a $100M+ revenue business. Today we engineer Institutional Venture Pitch Architecture. We dissect the canonical 10-Slide Y Combinator / Sequoia Archetype: Problem, Solution, Why Now, Market Size, Product Architecture, Traction, Business Model, Competition, Team, and The Ask. You will learn the cognitive psychology of partner meetings, how to craft crisp say-lines, and how to present hard traction proof that compels partners to issue a term sheet.",
    "conceptInvariant": "Venture Narrative & Traction Velocity Invariant: A venture pitch deck achieves institutional investment resonance if and only if it demonstrates verifiable traction velocity $V_{\\text{traction}} = \\frac{d\\text{ARR}}{dt}$ that outpaces market comparables, mapped across the canonical 10-slide cognitive structure; slide cognitive density must obey the 3-second comprehension rule: $\\forall \\text{Slide}_i, T_{\\text{comprehension}} \\le 3.0 \\text{ seconds}$; the core narrative must establish an undeniable macro market tailwind ('Why Now?'): $\\Delta \\text{MacroRegulation} \\vee \\Delta \\text{TechnologyPlatform} \\to \\text{NewMarketOpportunity}$.",
    "failureMode": "Two brilliant AI PhDs build a 35-slide pitch deck describing the mathematical tensor equations of their neural network architecture. Slides 1 through 15 are dense academic literature reviews. Slide 28 mentions that they have 3 paying enterprise pilot customers generating $45,000 MRR. In 20 partner pitch meetings, the partners get bored and confused by slide 8, ask academic theoretical questions, and pass. A competing startup with half the technology puts their $30k MRR growth chart on Slide 2, explains their simple value proposition, and raises a $4M seed round in 10 days.",
    "tryItFriction": "Build an Automated Pitch Deck Readiness & Structural Auditor in Python: 1) Ingest structured pitch deck metadata (slide titles, word counts, traction charts, financial projections); 2) Audit compliance against the 10-Slide Sequoia/YC archetype; 3) Compute cognitive density scores (flagging text-heavy slides exceeding 40 words); 4) Validate bottom-up market sizing and growth velocity metrics; 5) Generate a Venture Pitch Deck Scorecard with specific editorial improvements.",
    "socraticHints": [
      "Why is the 'Why Now?' slide considered the single most important strategic slide in a modern venture pitch?",
      "Because every good idea has already been attempted in the past! If your idea is great, why didn't it succeed 5 years ago?",
      "A great 'Why Now?' explains the recent technological, regulatory, or behavioral inflection point (e.g., LLM breakthroughs, remote work, open banking APIs) that suddenly makes your solution possible today."
    ],
    "situationalPuzzle": {
      "scenario": "A founder presents a pitch deck to a top VC firm. Slide 1: Title. Slide 2: The Problem. Slide 3: The Solution. Slide 4: Market Size ($80B). Slide 5: Features. Slide 6: More Features. Slide 7: Competitors. Slide 8: Team. Slide 9: The Ask ($2M). The partner asks: 'Why didn't someone build this 3 years ago, and why can't Google copy you in 6 months?' The founder has no answer. Which critical narrative components were missing from the deck?",
      "options": [
        "The deck needed more animations and better color gradients.",
        "The deck completely lacked the 'Why Now?' inflection slide (explaining the structural market catalyst that makes this possible today) and the 'Economic Moat / Defensibility' slide (explaining Hamilton Helmer's powers that prevent Google or copycats from replicating the solution).",
        "The founder should have asked for $10M instead of $2M.",
        "Pitch decks should never mention competition."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Without a compelling 'Why Now?' slide, investors assume the idea is either chronically unviable or has already failed multiple times. Without a clear 'Defensibility / Moat' slide, investors assume big tech or well-funded copycats will commoditize the product once traction is proven. These two strategic pillars are mandatory for institutional venture backing."
    },
    "quests": [
      {
        "id": "Q21.1",
        "title": "Concept: The 10-Slide Venture Archetype & Cognitive Narrative Architecture",
        "type": "Concept",
        "description": "Analyze the structural anatomy of the canonical YC/Sequoia 10-slide deck; evaluate narrative arc progression, cognitive load reduction, and the psychology of venture partner investment committees."
      },
      {
        "id": "Q21.2",
        "title": "Detective Challenge: The Bloated 40-Slide Pitch Deck Forensic Audit",
        "type": "Detective Challenge",
        "description": "Inspect a 40-slide investor pitch deck that suffered 30 consecutive VC rejections: write a Python script that analyzes slide text density, detects missing strategic pillars (Why Now, Unit Economics), and condenses the deck into a high-impact 10-slide narrative."
      },
      {
        "id": "Q21.3",
        "title": "Mastery Assignment: Automated Venture Pitch Deck Validator & Storytelling Platform",
        "type": "Mastery Assignment",
        "description": "Construct an automated pitch deck evaluation tool in Python: ingest slide outline JSONs, audit compliance with the Sequoia standard, evaluate traction velocity metrics, score narrative clarity, and generate publication-ready pitch critiques."
      },
      {
        "id": "Q21.4",
        "title": "Production Incident Lab: 60-Minute Emergency Pitch Deck Restructuring for Sequoia Partner Meeting",
        "type": "Production Incident Lab",
        "description": "You receive a surprise invitation to present at a Tier-1 VC Monday Partner Meeting in 60 minutes: execute an automated deck optimization script that restructures your traction charts, highlights your 140% NDR, and delivers a flawless 10-slide presentation."
      }
    ]
  },
  {
    "day": 22,
    "month": 1,
    "blockNum": 5,
    "title": "Term Sheet Anatomy & Liquidation Preferences: 1x Non-Participating vs Participating Preferred, Pay-to-Play & Protective Provisions",
    "stageName": "Stage 3: Venture Financing, Term Sheets & Governance",
    "stageNum": 3,
    "pedagogicalRole": "Venture Capital Deal Mechanics, Liquidation Preference Waterfalls & Governance Rights",
    "spokenGoal": "Headline valuation is a vanity metric; term sheet deal terms dictate who actually walks away with the money. If a founder signs a term sheet with a high valuation but accepts a 2x Participating Preferred liquidation preference, the founder can sell the company for $50,000,000 and walk away with zero dollars. Today we engineer Term Sheet Anatomy & Liquidation Preferences. We master the difference between 1x Non-Participating Preferred (the industry standard) and Participating Preferred ('double-dipping'). We examine Liquidation Preference Waterfalls, Senior vs Pari Passu ranking, Pay-to-Play clauses, Protective Provisions (veto rights over hiring, debt, or acquisitions), and Board of Directors control structures. You will learn how to model an exit waterfall to 4 decimal places.",
    "conceptInvariant": "Liquidation Preference Waterfall Invariant: At exit valuation $E$, Preferred Stockholders with investment $I$, participation cap $C$, and liquidation multiple $m$ receive proceeds $P_{\\text{pref}}$ according to: Non-Participating: $P_{\\text{pref}} = \\max(m \\cdot I, \\text{Ownership} \\cdot E)$; Participating: $P_{\\text{pref}} = m \\cdot I + \\text{Ownership} \\cdot (E - m \\cdot I)$ (subject to cap $C$ if capped); Common stockholders receive the residual: $P_{\\text{common}} = \\max(0, E - \\sum P_{\\text{pref}})$; accepting participating preferred guarantees that in modest exits ($E \\le 2 \\times \\sum I$), common founder equity is virtually extinguished.",
    "failureMode": "A founder raises $10,000,000 Series A at a lofty $40,000,000 post-money valuation, but accepts a 2x Participating Preferred liquidation preference without understanding the legal mechanics. Four years later, after intense work, the company is acquired for $25,000,000. Under 2x Participating Preferred, the VC takes their first $20,000,000 off the top (2x $10M), and then participates pro-rata (25%) in the remaining $5,000,000 ($1,250,000). The VC collects $21,250,000 of the $25M exit! Common shareholders and founders are left with only $3,750,000 to split after taxes and legal fees. If the stock had been standard 1x Non-Participating, the VC would have taken $10M, leaving $15M for founders.",
    "tryItFriction": "Build an Enterprise Liquidation Preference Waterfall Simulator in Python: 1) Model multi-tier capital structures (Common, Series Seed, Series A, Series B Preferred); 2) Support preference multiples (1x, 2x), structures (Non-Participating, Fully Participating, Capped Participating), and seniorities (Standard Seniority vs Pari Passu); 3) Simulate exit valuations from $1M to $100M; 4) Compute exact dollar proceeds and effective returns (MOIC) for every share class; 5) Plot exit proceeds distribution curves contrasting founder vs investor payout.",
    "socraticHints": [
      "Why is 'Participating Preferred' stock colloquially called 'double-dipping' in venture finance?",
      "Because the investor gets their money back first (liquidation preference), and THEN 'double-dips' by sharing in the remaining proceeds as if they were a common shareholder!",
      "Standard venture capital should almost always be 1x Non-Participating Preferred, where the investor chooses EITHER their money back OR their pro-rata share, but never both."
    ],
    "situationalPuzzle": {
      "scenario": "A startup raises $5,000,000 from VC Fund A for 25% ownership. The startup is later acquired for $12,000,000. Scenario 1: VC has standard 1x Non-Participating Preferred. Scenario 2: VC has 1x Fully Participating Preferred. What are the VC's proceeds under each scenario, and how much is left for common founders?",
      "options": [
        "In both scenarios, the VC receives $3,000,000 (25% of $12M).",
        "Scenario 1 (Non-Participating): VC chooses greater of 1x preference ($5M) vs 25% pro-rata ($3M). VC takes $5,000,000. Founders receive $12M - $5M = $7,000,000. Scenario 2 (Fully Participating): VC takes $5M preference first, PLUS 25% of the remaining $7M ($1.75M), totaling $6,750,000. Founders receive only $5,250,000. The participating clause costs founders $1,750,000 in cash!",
        "VC receives $12,000,000 in both scenarios.",
        "Liquidation preferences only apply if the company goes bankrupt."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Under 1x Non-Participating Preferred, the VC chooses between their $5M preference or their $3M pro-rata share; they choose $5M, leaving $7M for founders. Under Participating Preferred, the VC gets their $5M back AND takes 25% of the remaining $7M ($1.75M), collecting $6.75M total and reducing founder proceeds to $5.25M. This demonstrates why term sheet terms often matter more than headline valuation."
    },
    "quests": [
      {
        "id": "Q22.1",
        "title": "Concept: The Liquidation Preference Waterfall Mechanics & Legal Covenant Architecture",
        "type": "Concept",
        "description": "Deconstruct NVCA model term sheet covenants: analyze 1x Non-Participating vs Participating vs Capped Preferred, Pari Passu vs Tiered Seniority, Pay-to-Play, and Protective Provisions."
      },
      {
        "id": "Q22.2",
        "title": "Detective Challenge: The Predatory Term Sheet Toxic Clause Forensic Audit",
        "type": "Detective Challenge",
        "description": "Audit an incoming $4M Series A term sheet: write a Python script that parses deal terms, detects a hidden 2x participating preference and aggressive redemption right, and models how a $20M acquisition yields less than $2M for founders."
      },
      {
        "id": "Q22.3",
        "title": "Mastery Assignment: Full-Scale Multi-Tier Exit Waterfall Simulation Engine",
        "type": "Mastery Assignment",
        "description": "Construct an enterprise liquidation waterfall platform in Python: model multi-round capitalization stacks across Series Seed through Series C, simulate variable exit valuations from $1M to $500M, calculate payout distributions for each class, and plot interactive waterfall charts."
      },
      {
        "id": "Q22.4",
        "title": "Production Incident Lab: Live Term Sheet Counter-Offer Redlining under Deal Deadline",
        "type": "Production Incident Lab",
        "description": "A venture fund offers a term sheet with a 48-hour exploding deadline containing participating preferred and board majority control: execute an automated redline model that removes predatory covenants, proposes clean 1x non-participating terms, and preserves founder control."
      }
    ]
  },
  {
    "day": 23,
    "month": 1,
    "blockNum": 5,
    "title": "Financial Modeling & 3-Statement Forecasting: Integrated P&L, Balance Sheet, Cash Flow with Headcount Rosters",
    "stageName": "Stage 3: Venture Financing, Term Sheets & Governance",
    "stageNum": 3,
    "pedagogicalRole": "Corporate Financial Modeling, Integrated 3-Statement Architecture & Cash Flow Physics",
    "spokenGoal": "In professional venture finance, a financial model is not a single revenue tab with arbitrary growth percentages typed into cells; it is an integrated, dynamic 3-Statement Financial Engine: Income Statement (P&L), Balance Sheet, and Cash Flow Statement, tied together by double-entry accounting invariants. Today we engineer Financial Modeling & 3-Statement Forecasting. We build a dynamic bottom-up financial model driven by actual operational drivers: Headcount Rosters (fully-burdened salaries, benefits, payroll taxes), Customer Acquisition Cohorts (churn, expansion, ACV), and working capital payment terms. You will learn how Net Income flows into Retained Earnings, how Capital Expenditures flow through Depreciation into Cash Flow from Investing, and how the Cash balance on the Balance Sheet ties directly to the ending Cash Flow from Operations.",
    "conceptInvariant": "3-Statement Accounting Equilibrium Invariant: In an integrated 3-statement financial model, the Fundamental Accounting Equation must hold identically at every period $t$: $\\text{Assets}(t) = \\text{Liabilities}(t) + \\text{Equity}(t)$; where $\\text{Cash}(t)$ on the Balance Sheet equals ending cash from the Cash Flow Statement: $\\text{Cash}_{BS}(t) = \\text{Cash}_{BS}(t-1) + \\Delta \\text{Cash}_{CFS}(t)$; Retained Earnings on the Balance Sheet updates strictly via: $\\text{RE}(t) = \\text{RE}(t-1) + \\text{NetIncome}_{PL}(t) - \\text{Dividends}(t)$; any model where the balance sheet does not balance without an un-modeled plug is structurally broken.",
    "failureMode": "A founder builds a standalone Excel P&L projecting $5,000,000 revenue and $800,000 net profit in Year 2, convincing themselves the company is self-sustaining. However, they fail to build a Cash Flow Statement or Balance Sheet. Because their enterprise contracts have Net-120 payment terms and require upfront hardware server purchases ($1,200,000 CapEx), the company's bank account drops into negative $650,000 cash in Month 18 despite accounting profits. The bank freezes operations, and the startup suffers a catastrophic cash crunch.",
    "tryItFriction": "Build an Automated 3-Statement Financial Modeling Engine in Python: 1) Model a dynamic Headcount Roster with hire dates, salaries, and 22% tax/benefit overhead; 2) Build a SaaS Revenue Cohort engine generating MRR/ARR with expansion and churn; 3) Compute the Income Statement (Revenue, COGS, OpEx, EBITDA, Net Income); 4) Compute the Balance Sheet (Cash, Accounts Receivable, Fixed Assets, Accounts Payable, Equity); 5) Compute the Cash Flow Statement and verify that Assets == Liabilities + Equity across all 36 projected months.",
    "socraticHints": [
      "Why is a company that shows $1,000,000 in Net Income on its Income Statement still at risk of going bankrupt that same month?",
      "Because Net Income records revenue when invoiced, not when cash is collected, and ignores capital expenditures, debt principal repayments, and accounts receivable delays!",
      "Cash is reality; Net Income is an accounting opinion."
    ],
    "situationalPuzzle": {
      "scenario": "In month 12 of a financial model, a startup has: Net Income = $50,000; Depreciation = $10,000; Accounts Receivable increases by $40,000; Capital Expenditures (purchasing laptops) = $30,000. Assuming zero debt and zero equity financing, what is the net change in cash (Delta Cash) for Month 12?",
      "options": [
        "Delta Cash = +$50,000 (equal to Net Income).",
        "Calculate step by step: 1) Cash Flow from Operations = Net Income ($50,000) + Depreciation ($10,000) - Increase in AR ($40,000) = $20,000. 2) Cash Flow from Investing = -CapEx ($30,000). 3) Net Change in Cash = Operating Cash Flow ($20,000) - CapEx ($30,000) = -$10,000. Cash decreased by $10,000 despite a $50,000 accounting profit!",
        "Delta Cash = +$70,000.",
        "Cash flow cannot be calculated without corporate tax returns."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. In corporate financial modeling: Operating Cash Flow = Net Income ($50k) + Non-Cash Depreciation ($10k) - Working Capital drain of uncollected revenue ($40k AR increase) = $20k. Subtracting $30k for laptop CapEx yields a net cash drain of -$10,000. This illustrates why integrated 3-statement models are essential: cash dropped by $10,000 in a month where the P&L reported a $50,000 profit."
    },
    "quests": [
      {
        "id": "Q23.1",
        "title": "Concept: The 3-Statement Architecture & Financial Statement Linkages",
        "type": "Concept",
        "description": "Analyze the mechanics linking Income Statement, Balance Sheet, and Cash Flow Statement; master working capital timing, CapEx depreciation schedules, and headcount roster burden rates."
      },
      {
        "id": "Q23.2",
        "title": "Detective Challenge: The Unbalanced Balance Sheet & Broken Plug Forensic Audit",
        "type": "Detective Challenge",
        "description": "Audit an investment bank's financial model for a Series B SaaS startup: write a Python script that analyzes cell dependencies, detects a $1.2M unlinked plug in accounts receivable, and restores proper double-entry accounting balance."
      },
      {
        "id": "Q23.3",
        "title": "Mastery Assignment: Full-Scale Dynamic 36-Month 3-Statement Financial Engine",
        "type": "Mastery Assignment",
        "description": "Develop a production-ready 3-statement financial forecasting model in Python: implement dynamic headcount rosters, cohort ARR drivers, automated working capital adjustments, verify Assets == Liabilities + Equity across 36 months, and export formatted financial statements."
      },
      {
        "id": "Q23.4",
        "title": "Production Incident Lab: Emergency 3-Statement Reforecasting under 40% Churn Spike",
        "type": "Production Incident Lab",
        "description": "A sudden customer churn spike wipes out $1.5M in projected ARR: execute an automated financial reforecasting script that updates P&L, freezes hiring rosters, adjusts cash flow burn, and presents a revised 24-month survival forecast to the board within 2 hours."
      }
    ]
  },
  {
    "day": 24,
    "month": 1,
    "blockNum": 5,
    "title": "Venture Due Diligence Virtual Data Room (VDR): Legal, Financial, IP, Tax, HR & Cap Table Audit Architecture",
    "stageName": "Stage 3: Venture Financing, Term Sheets & Governance",
    "stageNum": 3,
    "pedagogicalRole": "Institutional Due Diligence Engineering, Virtual Data Room Architecture & Legal Audit Readiness",
    "spokenGoal": "Signing a term sheet is only the halfway mark; closing the funding round requires surviving the legal and financial due diligence colonoscopy. Once the term sheet is signed, the lead investor dispatches legal counsel (Gunderson, Cooley, Wilson Sonsini) and forensic accountants to dissect your company down to the atomic level. If your Virtual Data Room (VDR) is disorganized, missing contractor IP assignments, or contains unsigned board consents, closing will drag on for months, legal fees will balloon, and nervous investors may invoke material adverse change clauses to walk away. Today we engineer Venture Due Diligence Virtual Data Room Architecture. We construct the institutional 6-Folder VDR standard: Corporate Governance & Legal, Capitalization & Securities, Financials & Tax, Intellectual Property & Tech, Commercial Contracts & Customers, and HR & Employment.",
    "conceptInvariant": "Due Diligence Completeness & Zero-Defect Invariant: An enterprise Virtual Data Room achieves due diligence sign-off if and only if the completeness ratio $\\rho_{\\text{VDR}} = \\frac{|\\text{VerifiedDocuments}|}{|\\text{RequiredDocuments}|} = 1.0$ across all 6 legal folders; every equity grant is corroborated by a written Board Consent and signed Stock Purchase Agreement; every employee and contractor has an executed PIIA with zero third-party IP contamination; and all financial tax filings (Form 1120, state franchise tax) reconcile identically to general ledger records.",
    "failureMode": "A healthcare software startup signs a $6,000,000 Series A term sheet. During due diligence, the VC's law firm requests contractor IP assignment agreements for an offshore development agency in Romania that built the initial backend in 2021. The founders discover they never signed an IP assignment agreement with the agency, only paying them via PayPal. When the founders contact the agency, the agency owner realizes the startup is raising $6M and demands $450,000 to sign the retroactive IP assignment. The dispute delays the closing by 90 days, the macro market crashes, the VC rescinds the term sheet, and the startup dies.",
    "tryItFriction": "Build an Automated Virtual Data Room (VDR) Audit & Readiness Engine in Python: 1) Model the 6-folder institutional VDR document taxonomy; 2) Ingest corporate document metadata (contracts, board consents, tax filings, PIIAs, cap table ledgers); 3) Verify legal cross-references: matching every shareholder on the cap table to an executed stock purchase agreement and 83(b) election; 4) Detect red flags (missing contractor IP assignments, expired customer NDAs, delinquent state tax filings); 5) Compute a Due Diligence Readiness Score (0-100%).",
    "socraticHints": [
      "What is an IRS Section 83(b) election, and why does a missing 83(b) filing terrify venture capital investors?",
      "An 83(b) election allows founders to pay income tax on unvested stock at the nominal incorporation value ($0.0001/share).",
      "If a founder forgets to file Form 83(b) with the IRS within 30 days of incorporation, the IRS will tax the founder on the FAIR MARKET VALUE of the stock every month as it vests—creating a catastrophic, unpayable tax bill when the company raises venture capital at a high valuation!"
    ],
    "situationalPuzzle": {
      "scenario": "During Series A due diligence, legal counsel audits the startup's HR and Cap Table folder. They discover that Founder Alice received 4,000,000 shares of common stock at incorporation 2 years ago, but never filed an 83(b) election with the IRS. The Series A round prices the company stock at $2.00 per share. What is the tax and investment risk?",
      "options": [
        "There is no risk; 83(b) elections are optional guidelines.",
        "Without an 83(b) election, as Alice's stock vests over 4 years, the IRS treats the vesting as ordinary income taxed at fair market value. At $2.00/share, the vesting of 1,000,000 shares creates $2,000,000 of taxable income in Year 2, triggering an immediate personal tax bill of ~$740,000 on illiquid stock! Investors fear Alice will be forced to sell shares or bankrupt herself, stalling the Series A closing until tax indemnifications are resolved.",
        "The IRS will automatically convert Alice's stock to preferred stock.",
        "Alice can file the 83(b) form 5 years later with a $20 late fee."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. The 83(b) election is one of the most dangerous traps in venture creation: it MUST be filed within 30 days of receiving stock, with zero exceptions or extensions allowed by the IRS. Failing to file means the founder incurs ordinary income tax on the fair market value of the stock as it vests. When a venture round increases share price to $2.00, vesting triggers massive phantom tax liabilities on illiquid shares. VCs require this to be audited before investing."
    },
    "quests": [
      {
        "id": "Q24.1",
        "title": "Concept: The 6-Folder Virtual Data Room Architecture & Legal Due Diligence Standards",
        "type": "Concept",
        "description": "Analyze institutional due diligence checklists: Corporate Governance, Cap Table & Securities, Financials/Tax, IP & Technology, Material Contracts, and Employment/HR; evaluate Section 83(b) elections and Delaware General Corporation Law compliance."
      },
      {
        "id": "Q24.2",
        "title": "Detective Challenge: The Series A Due Diligence Red Flag Forensic Audit",
        "type": "Detective Challenge",
        "description": "Inspect a simulated Virtual Data Room containing 80 legal documents for an enterprise SaaS startup: write a Python forensics script that cross-references cap table shareholders with board consents, discovering an unassigned patent and an un-filed 83(b) election."
      },
      {
        "id": "Q24.3",
        "title": "Mastery Assignment: Enterprise Virtual Data Room Verification & Scoring Platform",
        "type": "Mastery Assignment",
        "description": "Develop a production-grade Python VDR compliance engine: verify folder structure completeness, validate document signature metadata, check contractor IP assignments, reconcile tax filings to balance sheets, and generate institutional Due Diligence Readiness Dossiers."
      },
      {
        "id": "Q24.4",
        "title": "Production Incident Lab: 48-Hour Legal Clean-Up under Exploding Series A Closing Window",
        "type": "Production Incident Lab",
        "description": "Lead investor's legal counsel issues a 14-item due diligence deficiency notice threatening to delay wire transfer: execute an automated remediation engine drafting retroactive board resolutions, contractor IP ratification covenants, and clearing all 14 flags within 36 hours."
      }
    ]
  },
  {
    "day": 25,
    "month": 1,
    "blockNum": 5,
    "title": "Milestone 5: ApexPitch Venture Capital Diligence & Term Sheet Orchestration Suite",
    "stageName": "Stage 3: Venture Financing, Term Sheets & Governance",
    "stageNum": 3,
    "pedagogicalRole": "Enterprise Software Engineering Milestone: Pitch Deck, Term Sheet & Diligence Suite",
    "spokenGoal": "You have reached Milestone 5! Over Days 21 to 24, you mastered Institutional Pitch Deck Narrative Architecture, Term Sheet Liquidation Preferences & Governance Provisions, Integrated 3-Statement Financial Forecasting, and Virtual Data Room (VDR) Due Diligence Engineering. Today you unite these financing capabilities into an institutional software suite: ApexPitch. ApexPitch is an enterprise Python platform designed for venture fundraising execution. It audits pitch deck cognitive density, models complex multi-tier liquidation preference waterfalls, validates integrated 3-statement financial balance sheets, and verifies 6-folder Virtual Data Room compliance to generate an Investor Due Diligence Certification.",
    "conceptInvariant": "ApexPitch Architectural Invariant: The venture financing suite must enforce end-to-end mathematical, legal, and narrative consistency: 1) Pitch narrative verifies the 10-slide Sequoia archetype with slide comprehension times $\\le 3.0$ seconds; 2) Term sheet waterfall models 1x Non-Participating vs Participating Preferred payouts with zero residual leaks: $\\sum P_{\\text{class}} = E$; 3) 3-statement model satisfies Assets == Liabilities + Equity identically across all 36 periods; 4) VDR engine verifies 100% document completeness with zero unassigned IP or missing 83(b) flags.",
    "failureMode": "A founder enters Series A negotiations with disjointed materials: the pitch deck promises a $10M exit will yield $6M for founders, but the draft term sheet contains a 2x Participating Preferred clause that gives the VC $8M of that exit. Meanwhile, the financial model P&L shows $4M ARR in Year 3, while the pitch deck traction slide claims $6M ARR. During partner review, the VC's associates catch these contradictions in 10 minutes. The firm drops the deal, concluding the management team lacks operational competence.",
    "tryItFriction": "Engineer the Complete ApexPitch Software Suite in Python: 1) `engine/pitch_auditor.py`: Evaluates slide structure against the 10-slide YC/Sequoia archetype and calculates cognitive density scores; 2) `engine/term_sheet.py`: Models liquidation preference waterfalls (1x/2x, Participating vs Non-Participating, Pari Passu); 3) `engine/financial_3statement.py`: Integrated 3-statement financial forecast ensuring Balance Sheet equilibrium; 4) `engine/vdr_auditor.py`: 6-folder Virtual Data Room completeness checker; 5) `api/server.py`: Exposes FastAPI endpoints serving `/fundraise/due-diligence-package`.",
    "socraticHints": [
      "Why must the financial model, pitch deck, cap table, and term sheet waterfall agree with 100% mathematical precision across all documents?",
      "Because discrepancies between documents signal to sophisticated investors that the founders either do not understand their own numbers or are attempting to conceal unfavorable terms.",
      "A unified software platform ensures that every single metric—from traction ARR to liquidation preference payouts—is derived from a single source of truth."
    ],
    "situationalPuzzle": {
      "scenario": "ApexPitch runs an automated audit on a Series A fundraising package. Module 1: Pitch deck scores 92/100 (Clean 10-slide narrative). Module 2: Financial model balances across all 36 months with $1.2M ending cash. Module 3: Term Sheet Waterfall identifies a 1.5x Participating Preferred clause on a $4M investment. Module 4: VDR audit flags 1 missing PIIA agreement from an early offshore contractor. What should ApexPitch's executive recommendation be?",
      "options": [
        "Issue an immediate Green Approval because the pitch deck and financial model are outstanding.",
        "Issue a Conditional Flag with Two Hard Directives: 1) REDLINE the Term Sheet to remove the 1.5x Participating Preferred clause and replace with standard 1x Non-Participating Preferred, protecting $3M+ in founder exit equity; 2) REMEDIATE the VDR by securing an executed retroactive IP Assignment Agreement from the offshore contractor before signing the term sheet.",
        "Cancel the fundraising process and lay off the offshore contractor.",
        "Accept the 1.5x participating preferred because 1.5 is lower than 2.0."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. ApexPitch acts as an automated Chief of Staff and General Counsel. While the pitch deck and financial model are strong, the 1.5x participating preferred clause would severely diminish founder returns in a mid-sized exit, and the missing contractor PIIA is a lethal due diligence red flag that could stall closing or invite extortion. Fixing these two specific items secures clean financing."
    },
    "quests": [
      {
        "id": "Q25.1",
        "title": "Concept: The Grand Unified Architecture of Venture Financing Execution",
        "type": "Concept",
        "description": "Synthesize the mechanics of Days 21-24: pitch deck cognitive engineering, liquidation preference mathematics, integrated 3-statement financial models, and Virtual Data Room due diligence standards."
      },
      {
        "id": "Q25.2",
        "title": "Detective Challenge: The Conflicting Venture Package Forensic Audit",
        "type": "Detective Challenge",
        "description": "Inspect a complete Series A fundraising submission packet: write a Python script that cross-references pitch deck projections, 3-statement models, and term sheet waterfalls, uncovering 4 hidden contradictions and an un-hedged liquidation preference trap."
      },
      {
        "id": "Q25.3",
        "title": "Mastery Assignment: Full-Scale ApexPitch Venture Platform Implementation",
        "type": "Mastery Assignment",
        "description": "Build and unit-test the complete ApexPitch software platform in Python: integrate pitch auditing, term sheet waterfall simulation, 3-statement forecasting, and VDR compliance checking; achieve 100% test coverage; deliver automated Investor Due Diligence Dossiers."
      },
      {
        "id": "Q25.4",
        "title": "Production Incident Lab: Live 24-Hour Term Sheet Counter-Offer Negotiation Defense",
        "type": "Production Incident Lab",
        "description": "A lead VC delivers a term sheet with a 24-hour deadline containing participating preferred and aggressive board seat terms: execute ApexPitch, generate an automated counter-proposal package with revised waterfall models, and secure institutional signing."
      }
    ]
  },
  {
    "day": 26,
    "month": 1,
    "blockNum": 6,
    "title": "Corporate Innovation & Ambidextrous Organizations: O'Reilly-Tushman Dual-Operating Systems & Skunkworks",
    "stageName": "Stage 3: Venture Financing, Term Sheets & Governance",
    "stageNum": 3,
    "pedagogicalRole": "Corporate Innovation Systems, Ambidextrous Governance & Skunkworks Architecture",
    "spokenGoal": "Why do giant, well-funded corporations almost always get disrupted by tiny startups? Clayton Christensen called it the Innovator's Dilemma: listening to your best current customers and optimizing your existing cash-cow business model blinds you to radical technological shifts. To survive, large enterprises must become 'Ambidextrous Organizations'—simultaneously exploiting existing mature business lines (efficiency, Six Sigma, incremental margin) while exploring disruptive, unproven ventures (experimentation, high failure tolerance, venture velocity). Today we engineer Corporate Innovation & Ambidextrous Organizations. We master Charles O'Reilly and Michael Tushman's Dual-Operating System, Corporate Venture Capital (CVC) structures, Internal Incubators, and Lockheed Martin-style Skunkworks architectures.",
    "conceptInvariant": "Ambidextrous Corporate Innovation Invariant: A sustainable corporate enterprise maintains operational ambidexterity by partitioning organizational structures into two decoupled subsystems: 1) Exploitation Core (mature cash cow, low variance, Six Sigma, KPI = margin and quarterly EPS); 2) Exploration Unit / Skunkworks (emerging ventures, high variance, Lean Startup, KPI = validated learning velocity and options value); structural ambidexterity succeeds if and only if the units are structurally separated with independent cultures and incentive compensation, yet integrated at the senior executive leadership level: $\\text{Governance}_{\\text{bridge}} = \\text{Executive Committee}$.",
    "failureMode": "A Fortune 500 financial services firm sets up an 'Internal Innovation Lab' to build an AI robo-advisor. However, the firm forces the lab to use the corporate IT procurement process (6-month vendor approval), comply with 40-page legacy compliance checklists, and assigns middle managers who are judged on quarterly cost reduction. When the lab's prototype crashes during an experiment, the managers are penalized on their annual performance reviews. The lab retreats to building safe, trivial incremental features, and three years later a venture-backed fintech startup captures 35% of the firm's millennial wealth management clients.",
    "tryItFriction": "Build an Ambidextrous Corporate Innovation Portfolio Simulator in Python: 1) Model an enterprise with an Exploit Core (mature cash-cow revenue) and an Explore Skunkworks Unit (3 early-stage ventures); 2) Allocate corporate capital between Core optimization and Venture exploration; 3) Model market disruption shocks that decay Core revenues by 15% annually; 4) Simulate venture success probabilities and option valuations; 5) Compute 10-year enterprise market capitalization under Pure Exploit vs Ambidextrous Dual-Operating models.",
    "socraticHints": [
      "Why does housing an internal startup inside a corporate business unit almost always suffocate the startup?",
      "Because the business unit leader is compensated on quarterly profit and loss (P&L); any early-stage venture that loses money in year 1 will be cannibalized or defunded to meet quarterly profit targets.",
      "Disruptive innovation units must report directly to the CEO/Board and have a ring-fenced balance sheet protected from business unit politics."
    ],
    "situationalPuzzle": {
      "scenario": "A legacy automotive manufacturer creates an internal software division to build an autonomous vehicle operating system. The CFO insists that the autonomous software division must be housed inside the existing powertrain manufacturing business unit and achieve break-even profitability within 12 months. How does organizational ambidexterity theory evaluate this decision?",
      "options": [
        "The CFO's strategy is sound because accountability to an established business unit prevents reckless spending.",
        "The decision guarantees project failure: forcing an early-stage deep-tech venture into an existing mature business unit subjects it to legacy cost-cutting incentives and unrealistic short-term break-even mandates; the exploration unit must be structurally segregated into a dedicated Skunkworks with distinct KPIs (milestone progression, technical validation) and separate executive reporting.",
        "Autonomous driving software requires zero capital and should be built on weekends.",
        "The manufacturer should cancel all software development and focus solely on diesel engines."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Under O'Reilly and Tushman's Ambidextrous Organization framework, radical innovation cannot survive inside mature exploitation units. Mature business units optimize for efficiency, cost control, and immediate quarterly margin. Subjecting an exploratory deep-tech R&D project to short-term break-even targets guarantees that the project will be starved of capital and killed before achieving technological maturity. Structural separation with executive-level sponsorship is required."
    },
    "quests": [
      {
        "id": "Q26.1",
        "title": "Concept: The Innovator's Dilemma, Ambidextrous Organizations & Skunkworks Architecture",
        "type": "Concept",
        "description": "Analyze Clayton Christensen's Innovator's Dilemma; deconstruct O'Reilly and Tushman's Ambidextrous Organization model; analyze Lockheed Martin Skunkworks operating rules and Corporate Venture Capital (CVC) structures."
      },
      {
        "id": "Q26.2",
        "title": "Detective Challenge: The Suffocated Corporate Innovation Lab Forensic Audit",
        "type": "Detective Challenge",
        "description": "Audit an enterprise corporate innovation incubator that burned $25M with zero commercialized products: write a Python script that analyzes budget approval latencies, KPI structures, and exposes how business unit transfer-pricing rules paralyzed product launches."
      },
      {
        "id": "Q26.3",
        "title": "Mastery Assignment: Enterprise Ambidextrous Innovation Portfolio Simulator",
        "type": "Mastery Assignment",
        "description": "Develop an enterprise innovation portfolio modeling suite in Python: simulate cash-cow decay curves under technological disruption, model real options valuation on internal R&D ventures, evaluate capital allocation policies, and output executive strategic resilience scorecards."
      },
      {
        "id": "Q26.4",
        "title": "Production Incident Lab: Emergency Skunkworks Ring-Fencing during Corporate Cost Cut",
        "type": "Production Incident Lab",
        "description": "Corporate activist investors demand an immediate 20% across-the-board R&D budget cut: execute an automated strategic restructuring plan that legally spins off your breakthrough AI venture into a ring-fenced joint venture, securing external venture capital while retaining 40% corporate equity."
      }
    ]
  },
  {
    "day": 27,
    "month": 1,
    "blockNum": 6,
    "title": "Strategic Alliances, Joint Ventures & Distribution Partnerships: Bilateral Value Capture, IP Licensing & Co-Marketing Moats",
    "stageName": "Stage 3: Venture Financing, Term Sheets & Governance",
    "stageNum": 3,
    "pedagogicalRole": "Strategic Partnership Engineering, Joint Venture Governance & Distribution Moats",
    "spokenGoal": "Startups have breakthrough products but zero distribution. Large incumbents have millions of customers but slow, outdated products. When a startup partners with an incumbent, the partnership can generate explosive commercial scale—or it can result in the incumbent stealing your IP, tying you up in exclusive distribution restrictions, and leaving you with zero revenue. Today we engineer Strategic Alliances, Joint Ventures (JVs), and Distribution Partnerships. We dissect bilateral value capture models, non-exclusive vs exclusive distribution covenants, IP licensing architectures, Minimum Revenue Guarantees, and Joint Venture equity structures. You will learn how to negotiate win-win strategic alliances while legally insulating your startup's core technology.",
    "conceptInvariant": "Bilateral Alliance Equilibrium & IP Protection Invariant: A strategic alliance is commercially sustainable if and only if incremental value creation $\\Delta V$ exceeds partner transaction friction and satisfies the bilateral participation constraint: $\\Delta V_{\\text{startup}} \\ge \\text{OpportunityCost}_{\\text{startup}}$ and $\\Delta V_{\\text{partner}} \\ge \\text{Cost}_{\\text{distribution}}$; core intellectual property must remain strictly quarantined via unilateral licensing with explicit field-of-use restrictions: $\\text{IP}_{\\text{background}} \\cap \\text{IP}_{\\text{partner}} = \\emptyset$; any exclusivity clause must be bound to non-waivable Minimum Guaranteed Revenue ($MGR$) hurdles: if $\\text{Revenue} < MGR$, exclusivity terminates immediately.",
    "failureMode": "A voice AI startup signs an 'Exclusive Global Distribution Agreement' with a multinational telecom equipment provider. The contract grants the telecom giant exclusive rights to distribute the startup's AI product across 40 countries, but contains no minimum sales quotas or revenue guarantees. The telecom's enterprise sales team finds the product complex and focuses on selling their own legacy hardware. The startup is legally barred from selling to any other enterprise or partner in those 40 countries. With sales paralyzed and no legal right to sell directly, the startup runs out of cash in 14 months.",
    "tryItFriction": "Build an Automated Strategic Partnership & Distribution Agreement Evaluator in Python: 1) Ingest contract covenants (exclusivity, territory, field of use, IP ownership, revenue sharing); 2) Model partner sales distribution capacity against direct sales alternatives; 3) Enforce automated red-flag detection on unhedged exclusivity clauses lacking Minimum Revenue Guarantees; 4) Compute net present value (NPV) of partnership royalties vs direct margin; 5) Generate a partnership risk-adjusted negotiation term sheet.",
    "socraticHints": [
      "Why should a startup NEVER grant an exclusive distribution agreement without strict, non-waivable Minimum Revenue Guarantees (MRGs)?",
      "Because an exclusive agreement without performance minimums gives the partner a free option to 'shelf' your product, preventing you from selling to anyone else while paying you zero dollars!",
      "If the partner insists on exclusivity, make them pay a high guaranteed annual fee that sustains your business even if they make zero sales."
    ],
    "situationalPuzzle": {
      "scenario": "A Fortune 100 enterprise offers a startup a 3-year Exclusive Global Distribution Partnership. The contract promises a 60/40 revenue split in the startup's favor, but the partner refuses to include any Minimum Annual Revenue commitments. What should the startup's Chief Commercial Officer do?",
      "options": [
        "Sign the contract immediately because having a Fortune 100 partner guarantees massive sales.",
        "Reject or redline the exclusivity clause: propose either A) Non-exclusive distribution (allowing the startup to sign other distribution partners and sell directly), or B) Exclusivity contingent on strict quarterly Minimum Revenue Guarantees (e.g., $1.5M in Year 1, $3M in Year 2), where failure to meet the minimum automatically converts the agreement to non-exclusive.",
        "Sign the contract, but secretly sell the product to competitors under a different company name.",
        "Exclusivity clauses are illegal in commercial business and have no legal effect."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Never grant unconditional exclusivity to any partner. Large enterprises often enter partnerships with great enthusiasm, but when executive priorities shift, the partner's sales reps may fail to promote the product. Without minimum revenue milestones that trigger termination of exclusivity, the startup is legally locked into an underperforming partner and prevented from generating revenue elsewhere. Converting exclusivity to non-exclusive upon missed targets is the gold standard protection."
    },
    "quests": [
      {
        "id": "Q27.1",
        "title": "Concept: The Economics of Strategic Alliances, Joint Ventures & Distribution Channels",
        "type": "Concept",
        "description": "Analyze the strategic architecture of enterprise alliances: bilateral value capture models, equity joint ventures vs contractual alliances, IP licensing mechanisms, and exclusivity covenants."
      },
      {
        "id": "Q27.2",
        "title": "Detective Challenge: The Shelved Product Distribution Agreement Forensic Audit",
        "type": "Detective Challenge",
        "description": "Audit an exclusive distribution contract that paralyzed a robotics startup for 18 months: write a Python script that analyzes revenue clawbacks, identifies missing minimum performance triggers, and drafts an emergency contract termination dossier."
      },
      {
        "id": "Q27.3",
        "title": "Mastery Assignment: Enterprise Strategic Partnership & Licensing Valuation Engine",
        "type": "Mastery Assignment",
        "description": "Build an enterprise partnership valuation platform in Python: model revenue-share economics, calculate NPV trade-offs between direct sales vs partner channel reach, simulate Minimum Revenue Guarantee thresholds, and generate executive partnership contracts."
      },
      {
        "id": "Q27.4",
        "title": "Production Incident Lab: Emergency Exclusivity Revocation upon Partner Default",
        "type": "Production Incident Lab",
        "description": "Your primary enterprise distributor misses their Q3 minimum sales quota by 65%: execute an automated legal covenant notice that formally terminates exclusive rights, activates your direct enterprise sales pipeline, and protects $2M in pending customer deals within 24 hours."
      }
    ]
  },
  {
    "day": 28,
    "month": 1,
    "blockNum": 6,
    "title": "Intellectual Property Strategy & Patent Moats: Patents, Trademarks, Trade Secrets, Freedom to Operate (FTO) & Prior Art Search",
    "stageName": "Stage 3: Venture Financing, Term Sheets & Governance",
    "stageNum": 3,
    "pedagogicalRole": "IP Legal Engineering, Patent Moat Architecture & Freedom to Operate (FTO)",
    "spokenGoal": "Technology is easy to copy; defensible Intellectual Property (IP) creates durable enterprise moats. But IP strategy is fraught with dangerous misconceptions: founders spend $50,000 patenting trivial software ideas that any engineer can work around in an afternoon, while completely neglecting trade secrets, trademarks, and open-source license compliance. Today we engineer Intellectual Property Strategy & Patent Moats. We master the 4 pillars of IP: Patents (utility vs design, patentable subject matter under Alice Corp, independent vs dependent claims), Trade Secrets (Defend Trade Secrets Act DTSA, reasonable measures of secrecy), Trademarks (brand goodwill, trademark clearing), and Copyrights. You will learn how to conduct Freedom to Operate (FTO) audits, search prior art databases, and build an IP fortress that commands premium venture valuations.",
    "conceptInvariant": "Patent Defensibility & Freedom to Operate (FTO) Invariant: A commercial product possesses Freedom to Operate (FTO) in jurisdiction $J$ if and only if it does not infringe any valid, active patent claim: $\\forall c_k \\in \\text{ActiveClaims}(J), \\neg \\text{Infringes}(\\text{Product}, c_k)$; where literal infringement occurs if the product embodies every single element of an independent patent claim (All-Elements Rule); an offensive patent creates an economic moat if and only if the claim scope $\\Omega$ encompasses all commercially viable engineering alternatives: $\\text{Cost}(\\text{Design-Around}) > \\text{Cost}(\\text{Licensing})$.",
    "failureMode": "A medical diagnostics startup raises $4,000,000 based on an 'exclusive patent application' for a blood testing sensor. However, the founders never conducted a professional Freedom to Operate (FTO) search. Two weeks before commercial launch, they receive a cease-and-desist letter from a giant medical device conglomerate that holds a broad utility patent issued 6 years earlier covering optical sensor flow-cells. The startup's product literally infringes Claim 1 of the competitor's patent. A federal judge issues a preliminary injunction halting sales, and the startup is forced to liquidate.",
    "tryItFriction": "Build an Automated Patent Claim & Freedom to Operate (FTO) Analyzer in Python: 1) Ingest structured patent claim texts from USPTO/EPO JSON feeds; 2) Parse independent vs dependent claims and extract claim element limitation trees; 3) Ingest your product technical specification; 4) Execute the 'All-Elements Rule' matching algorithm: determine if your product practices every element of any competitor claim; 5) Generate an FTO Clearance Report identifying high-risk claim overlaps and design-around recommendations.",
    "socraticHints": [
      "What is the 'All-Elements Rule' in patent infringement jurisprudence?",
      "To literally infringe an independent patent claim, your product must contain EVERY SINGLE ELEMENT recited in that claim.",
      "If the patent claim recites elements A, B, and C, and your product uses only elements A and B with a completely different mechanism for C, your product does NOT literally infringe that claim."
    ],
    "situationalPuzzle": {
      "scenario": "A robotics startup designs an automated drone delivery system. Competitor X holds a patent with Claim 1: 'A delivery apparatus comprising: (a) a quadcopter airframe; (b) an onboard GPS module; (c) a motorized winch cable; and (d) a mechanical claw gripper.' The startup's drone uses a hexacopter airframe, onboard GPS, a winch cable, and an electromagnet gripper (no mechanical claw). Does the startup literally infringe Claim 1?",
      "options": [
        "Yes, because both drones deliver packages using winches.",
        "No, under the All-Elements Rule of patent law, literal infringement requires the accused product to embody every single limitation of the claim. Because the startup uses an electromagnet gripper rather than element (d) 'a mechanical claw gripper', it does not literally infringe Claim 1 (though the Doctrine of Equivalents must still be evaluated).",
        "All software and drone patents were invalidated by the Supreme Court.",
        "The startup must pay 50% of its revenue to Competitor X automatically."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Under the All-Elements Rule, every limitation of an independent claim is material. If an accused product omits even one claim limitation (omitting the 'mechanical claw' in favor of an electromagnet), literal infringement is defeated. However, patent counsel must also analyze the 'Doctrine of Equivalents' to ensure the substitution does not perform substantially the same function in substantially the same way to achieve the same result."
    },
    "quests": [
      {
        "id": "Q28.1",
        "title": "Concept: Patent Jurisprudence, The All-Elements Rule & Trade Secret Law",
        "type": "Concept",
        "description": "Analyze utility patent mechanics: patentable subject matter (Alice Corp v CLS Bank), independent vs dependent claim hierarchies, the All-Elements Rule, the Doctrine of Equivalents, and the Defend Trade Secrets Act (DTSA)."
      },
      {
        "id": "Q28.2",
        "title": "Detective Challenge: The Prior Art Patent Invalidation Forensic Audit",
        "type": "Detective Challenge",
        "description": "A competitor threatens patent infringement litigation over your core database caching algorithm: write a Python forensics script that searches international open-source repositories and arXiv papers, unearthing prior art published 14 months before the patent filing to invalidate the claim."
      },
      {
        "id": "Q28.3",
        "title": "Mastery Assignment: Production-Grade Freedom to Operate (FTO) & Claim Tree Analysis Engine",
        "type": "Mastery Assignment",
        "description": "Build an enterprise IP intelligence platform in Python: parse USPTO XML/JSON patent files, construct hierarchical claim dependency trees, evaluate product specifications against claim limitations, calculate infringement risk scores, and output executive FTO Clearance Dossiers."
      },
      {
        "id": "Q28.4",
        "title": "Production Incident Lab: Emergency 48-Hour Design-Around Engineering Sprint",
        "type": "Production Incident Lab",
        "description": "An aggressive patent troll files a patent infringement lawsuit on your IoT sensor communication protocol 3 days before commercial launch: execute an emergency engineering design-around script that modifies the communication handshake, skirts Claim 1 limitations, and clears FTO within 48 hours."
      }
    ]
  },
  {
    "day": 29,
    "month": 1,
    "blockNum": 6,
    "title": "Crisis Management, Down-Rounds & Startup Restructuring: Default Alive vs Default Dead, Pay Cuts, Layoffs & The Structured Pivot",
    "stageName": "Stage 3: Venture Financing, Term Sheets & Governance",
    "stageNum": 3,
    "pedagogicalRole": "Startup Crisis Governance, Capital Restructuring & Turnaround Engineering",
    "spokenGoal": "Every great startup encounters the existential abyss. Ben Horowitz called it 'The Struggle': when your core product loses traction, your biggest customer cancels, cash is running out, and investors stop answering your emails. How do you lead an organization when the ship is sinking? Today we engineer Crisis Management, Down-Rounds & Startup Restructuring. We master Paul Graham's framework of 'Default Alive vs Default Dead' ($Runway \\times Growth \\ge Breakeven$). We analyze the brutal mechanics of down-round financings, Full-Ratchet vs Broad-Based Weighted Average anti-dilution adjustments, and pay cuts. You will learn how to execute compassionate, high-integrity Reduction in Force (RIF) layoffs in a single day, and architect a structured product pivot that saves the company.",
    "conceptInvariant": "Default Alive Invariant & Anti-Dilution Adjustment Physics: A venture is Default Alive if and only if existing cash runway $R$ allows reaching break-even profitability at current growth trajectory $g$: $\\text{Revenue}(0) \\times (1 + g)^R \\ge \\text{OperatingExpenses}(R)$; otherwise the startup is Default Dead and requires immediate burn reduction or capital restructuring; in a down round at price $P_2 < P_1$, Broad-Based Weighted Average anti-dilution adjusts conversion price $P_{\\text{new}}$ via: $P_{\\text{new}} = P_1 \\times \\frac{A + B}{A + C}$; where $A$ is total shares pre-round, $B$ is shares issuable at old price, and $C$ is new shares actually issued; mitigating dilution requires swift operational restructuring.",
    "failureMode": "A Series A startup has $900,000 in cash and burns $150,000/month (6 months of runway). The CEO refuses to cut costs, hoping a miracle Series B term sheet will materialize. At month 4, with only $300,000 remaining, the CEO conducts a tiny 10% layoff (cutting $15k/mo). Three weeks later, cash hits zero. The company cannot make payroll, has no runway left to negotiate with investors, and is forced into abrupt, messy liquidation. Doing 'trickle layoffs' over months destroys company morale while failing to extend runway.",
    "tryItFriction": "Build an Enterprise Startup Crisis Turnaround & Down-Round Simulator in Python: 1) Model a distressed startup with current cash balance, monthly burn rate, and revenue growth; 2) Compute Paul Graham's 'Default Alive vs Default Dead' status; 3) Simulate a 35% headcount reduction (RIF) computing severance payouts, salary savings, and extended runway; 4) Model a 50% down-round financing, calculating Broad-Based Weighted Average vs Full-Ratchet anti-dilution equity adjustments; 5) Output an executive Board Restructuring Memorandum.",
    "socraticHints": [
      "Why is doing multiple small layoffs ('drip-drip cuts') across several months considered the ultimate management failure?",
      "Because every round of layoffs terrorizes the surviving team: employees spend all day updating resumes and gossiping rather than working, assuming another layoff is coming next month.",
      "If you must cut, cut deep ONCE (20-30%), provide generous severance, explain the complete Default Alive plan to survivors, and guarantee stability."
    ],
    "situationalPuzzle": {
      "scenario": "A venture-backed startup has $600,000 in cash and burns $100,000/month (6 months of runway). Monthly revenue is $20,000, growing at 5% monthly. To reach break-even ($100k/mo revenue) at 5% growth takes 33 months—far longer than the 6 months of cash remaining. Paul Graham's formula classifies the startup as 'Default Dead'. What immediate action must the CEO take?",
      "options": [
        "Ignore the numbers and spend $50,000 on Facebook ads to try to grow faster.",
        "Immediately execute a restructuring plan: cut monthly operating expenses from $100,000 to $35,000 (reducing net burn to $15,000/mo), extending cash runway to 40 months; this gives the company ample time for revenue to grow and reach Default Alive without relying on external venture rescue.",
        "Close the company immediately on Monday morning.",
        "Promise employees 50% salary increases if they work on weekends."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. A startup that is Default Dead cannot rely on venture capital during a crisis. The CEO's primary duty is to keep the company alive. Cutting burn immediately from $100k to $35k reduces net burn from $80k/mo to $15k/mo, extending runway from 6 months to 40 months. This gives the business the time it needs to compound revenue and achieve self-sustaining profitability."
    },
    "quests": [
      {
        "id": "Q29.1",
        "title": "Concept: The Default Alive Framework, Down-Round Math & Turnaround Governance",
        "type": "Concept",
        "description": "Analyze Paul Graham's Default Alive vs Default Dead mathematical formulation; derive the Broad-Based Weighted Average anti-dilution formula; analyze the legal and operational mechanics of startup restructuring."
      },
      {
        "id": "Q29.2",
        "title": "Detective Challenge: The Trickle-Layoff Death Spiral Forensic Audit",
        "type": "Detective Challenge",
        "description": "Inspect operational logs of a startup that conducted three 10% layoffs in 6 months before failing: write a Python script that analyzes employee churn velocity, severance cash drains, and proves how a single decisive 25% cut on day 1 would have preserved $1.8M in cash."
      },
      {
        "id": "Q29.3",
        "title": "Mastery Assignment: Full-Scale Startup Crisis Turnaround & Down-Round Engine",
        "type": "Mastery Assignment",
        "description": "Build an enterprise restructuring platform in Python: evaluate Default Alive status, model dynamic headcount reduction scenarios with severance liabilities, calculate Broad-Based vs Full-Ratchet down-round cap table dilution, and generate executive Turnaround Plans."
      },
      {
        "id": "Q29.4",
        "title": "Production Incident Lab: 24-Hour Emergency Board Restructuring & Bridge Financing Defense",
        "type": "Production Incident Lab",
        "description": "Your lead investor offers an emergency $500,000 convertible bridge note with a 50% discount and full-ratchet anti-dilution: execute an automated restructuring engine modeling a deep burn reduction plan that eliminates the need for predatory bridge capital within 24 hours."
      }
    ]
  },
  {
    "day": 30,
    "month": 1,
    "blockNum": 6,
    "title": "Capstone 1: ApexVenture Core Startup Architecture & Seed Financing Master Capstone Viva Gate",
    "stageName": "Stage 3: Venture Financing, Term Sheets & Governance",
    "stageNum": 3,
    "pedagogicalRole": "Comprehensive Month 1 Master Capstone Viva Examination & Seed Financing Defense",
    "spokenGoal": "Welcome to Day 30, the culmination of Month 1 of Venture Creation & Lean Startup Engineering. You have traveled a remarkable journey: from Legal Corporate Veil Mechanics, Bottom-Up TAM/SAM/SOM Sizing, Business Model Canvas Economics, and JTBD Value Proposition Design, to Lean MVP Experiments, Hamilton Helmer's 7 Powers, Break-Even Physics, Cash Runway Dynamics, Post-Money SAFE Modeling, Early-Stage Valuation, Founder Vesting, OKR Execution, Little's Law Operations, Six Sigma Quality, B2B Sales Pipelines, Pitch Deck Storytelling, Term Sheet Liquidation Preferences, Integrated 3-Statement Forecasting, VDR Due Diligence, Corporate Innovation, Distribution Alliances, Patent Law, and Crisis Restructuring. Today is Capstone 1: the ApexVenture Master Capstone Viva Gate. You will present and defend your complete venture architecture and seed financing package before a simulated institutional venture investment committee.",
    "conceptInvariant": "ApexVenture Month 1 Comprehensive Architectural Invariant: The complete startup venture architecture must demonstrate end-to-end mathematical, legal, and operational coherence across all 5 core subsystems: 1) Legal & Governance: Delaware C-Corp / Pvt Ltd with un-commingled accounts, 4-year reverse vesting with 1-year cliff, and executed PIIA IP assignment; 2) Market & Economics: Bottom-up TAM/SAM/SOM waterfall with positive unit contribution margin $CM = P - VC > 0$ and $LTV/CAC \\ge 3.0$; 3) Operations & Quality: Kanban WIP limits, Little's Law throughput balance, and Six Sigma $C_{pk} \\ge 1.33$; 4) Financials: 3-statement model satisfying Assets == Liabilities + Equity identically across 36 months with verified Cash Runway $R \\ge 12 \\text{ months}$; 5) Capitalization: Clean post-money SAFE conversions and 1x non-participating preferred term sheets.",
    "failureMode": "A founder presents a seed financing capstone that is full of polished marketing buzzwords but collapses under technical cross-examination. When asked how an increase in customer onboarding cycle time impacts cash runway under Little's Law, the founder cannot connect operational queueing to working capital drain. When the committee discovers a participating preferred clause in their draft term sheet, the founder does not know it gives away $2,000,000 of common equity in a modest exit. The investment committee rejects the application, issuing a failing grade.",
    "tryItFriction": "Deliver and Defend the Complete ApexVenture Month 1 Master Suite: 1) Deploy the unified Python software codebase integrating all 5 milestones: Venture Ideation Engine, Cap Table Dilution Suite, Governance & Vesting Platform, SaaS Metrics Engine, and ApexPitch Due Diligence Suite; 2) Pass 100% of automated integration test suites (120+ unit tests across equity, financial statements, and operations); 3) Deliver a live 10-slide pitch presentation and defend financial statements under adversarial questioning; 4) Pass the 45-minute technical viva examination.",
    "socraticHints": [
      "How do you synthesize the fundamental connection between operational cycle time (Little's Law) and venture capital survival (Cash Runway)?",
      "When operational cycle time expands, Work-in-Progress inventory (un-onboarded customers or stalled deals) increases proportionally ($L = \\lambda W$), locking up accounts receivable and delaying cash collections.",
      "Delayed cash collections increase monthly Net Burn, accelerating the Zero-Cash Date and forcing the startup into distressed financing rounds."
    ],
    "situationalPuzzle": {
      "scenario": "During your Capstone 1 Viva examination, a venture partner challenges your startup plan: 'Your financial model shows you burn $80,000 a month with 14 months of cash runway. You project reaching break-even in 18 months. What happens if your B2B sales cycle length expands from 60 days to 120 days due to enterprise procurement delays?' How do you defend your venture's survival architecture?",
      "options": [
        "Promise the partner that sales cycles will never expand because your software is irresistible.",
        "Defend using Pipeline Velocity and Default Alive modeling: under the pipeline equation $V = (N \\times ACV \\times WR) / L$, doubling sales cycle length from 60 to 120 days cuts daily revenue velocity in half, delaying cash collections and expanding net burn; our ApexVenture architecture includes a pre-modeled 'Default Alive Contingency Plan' that reduces discretionary marketing spend and pauses secondary hiring to cut monthly burn to $45,000, extending runway to 24 months and ensuring break-even is achieved without emergency dilutive capital.",
        "Ask the investor to give you an extra $2,000,000 today just in case.",
        "Argue that sales cycle length has no impact on cash burn."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Demonstrating mastery in an executive viva defense requires connecting mathematical principles (Pipeline Velocity $V \\propto 1/L$) directly to treasury survival (Default Alive runway management). Proving that your venture architecture includes pre-modeled operational levers to throttle burn and absorb macroeconomic shocks without dilutive capital distress proves that you possess the systems thinking of a world-class CEO."
    },
    "quests": [
      {
        "id": "Q30.1",
        "title": "Concept: The Grand Unified Theory of Venture Creation & Lean Startup Engineering",
        "type": "Concept",
        "description": "Synthesize the complete 30-day Month 1 curriculum: the mathematical and legal linkages connecting corporate entity law, bottom-up TAM sizing, Lean experimentation, unit economics, 3-statement financial modeling, and venture capital governance into a unified enterprise systems ontology."
      },
      {
        "id": "Q30.2",
        "title": "Detective Challenge: Comprehensive 30-Day Venture Architecture Forensic Audit",
        "type": "Detective Challenge",
        "description": "Perform an end-to-end technical and legal audit of a simulated Series Seed venture: identify 10 subtle defects spanning commingled corporate funds, top-down TAM hallucinations, unassigned founder IP, negative contribution margins, and un-hedged liquidation preferences."
      },
      {
        "id": "Q30.3",
        "title": "Mastery Assignment: ApexVenture Master Production Codebase Release",
        "type": "Mastery Assignment",
        "description": "Package, document, and release the complete ApexVenture Month 1 software suite: verify 100% code coverage across legal, valuation, treasury, SaaS metrics, and term sheet modules; deliver interactive Swagger/OpenAPI documentation and automated deployment scripts."
      },
      {
        "id": "Q30.4",
        "title": "Production Incident Lab: Final Seed Investment Committee Viva Defense Simulation",
        "type": "Production Incident Lab",
        "description": "Face the final Month 1 Master Viva Examination: deliver your 10-slide venture pitch, defend your integrated 3-statement financial model, withstand aggressive adversarial cross-examination on liquidation waterfalls and unit economics, and secure unanimous Seed Investment Committee certification."
      }
    ]
  }
]

output_path = "scripts/visuals/venture_creation_spec_m1_rest.py"
with open(output_path, "w", encoding="utf-8") as f:
    f.write("# scripts/visuals/venture_creation_spec_m1_rest.py\n")
    f.write("# Days 16 to 30 for Course 29: Venture Creation & Lean Startup Engineering (course-bcom-entrepreneurship)\n")
    f.write("# Conforms to Gate v2 / 9.8 pedagogical standard.\n\n")
    f.write("DAYS_16_TO_30 = ")
    json_str = json.dumps(DAYS_16_TO_30, indent=2, ensure_ascii=False)
    f.write(json_str)
    f.write("\n")

print(f"Successfully generated {output_path} with {len(DAYS_16_TO_30)} days.")
