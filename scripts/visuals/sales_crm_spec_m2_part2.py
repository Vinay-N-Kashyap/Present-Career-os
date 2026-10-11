# scripts/visuals/sales_crm_spec_m2_part2.py
# Month 2: Days 46 to 60 Specification for Course 30: Enterprise B2B Sales, Customer Success & CRM Systems Architecture (course-sales-crm-success)
# Conforms strictly to Gate v2 / True 9.8 standard across all 15 days (60 Quests).

DAYS_46_TO_60 = [
  {
    "day": 46,
    "month": 2,
    "blockNum": 10,
    "title": "RevOps Data Engineering: Snowflake/BigQuery CRM Data Pipelines & dbt Transformations",
    "stageNum": 4,
    "stageName": "Stage 4: Global Scale & RevOps Architecture",
    "pedagogicalRole": "Revenue Operations Data Engineering (CRM ELT Ingestion, dbt Dimensional Modeling & Data Contracts)",
    "spokenGoal": "Enterprise sales reporting in CRM native dashboards is notoriously fragile and slow. Today we engineer the modern RevOps Data Stack\u2014extracting raw CRM data via Fivetran/Airbyte, loading into Snowflake/BigQuery, and transforming it via dbt dimensional models with strict data contracts.",
    "conceptInvariant": "Revenue Dimensionality Invariant: RevOps analytics pipelines must implement slowly changing dimensions (SCD Type 2) to preserve historical stage snapshots and point-in-time quota assignments across fiscal quarters.",
    "failureMode": "The Overwritten Historical Pipeline Disaster: A naive ELT pipeline overwrites historical opportunity stage dates with current timestamps during an update; all historical pipeline velocity, conversion rate, and cohort analysis metrics across 3 years are permanently obliterated.",
    "tryItFriction": "Run a dbt transformation model where null foreign-key account references cause fan-out duplicate rows when joining opportunities with product line items.",
    "socraticHints": [
      "Why is Slowly Changing Dimension Type 2 (SCD2) mandatory for tracking opportunity stage progressions over time?",
      "How do Data Contracts (dbt tests, Great Expectations) prevent upstream CRM field changes from breaking executive revenue dashboards?",
      "Design a dimensional star schema featuring Fact_Opportunity_Snapshots, Dim_Account, Dim_Sales_Rep, and Dim_Date."
    ],
    "situationalPuzzle": {
      "scenario": "Your CRM administrator renames a standard field from 'Annual_Contract_Value__c' to 'ARR__c' directly in Salesforce production. The overnight Snowflake ELT pipeline fails, and the morning executive revenue dashboard shows $0 for all quarterly metrics during a live board meeting.",
      "options": [
        "Blame the CRM administrator and cancel the board meeting.",
        "Implement robust RevOps Data Contracts: 1) Deploy schema-drift monitoring that catches upstream field mutations; 2) Enforce dbt staging layer abstraction with fallback aliases; 3) Build automated alerting on ELT pipeline schema anomalies before dashboard rendering.",
        "Manually edit the executive dashboard numbers using Photoshop.",
        "Require all executives to log directly into Salesforce instead of looking at dashboards."
      ],
      "correctOptionIndex": 1,
      "debrief": "Unannounced upstream schema mutations in CRMs are the number-one cause of RevOps data failures. Staging layer abstraction in dbt combined with automated schema contracts and alerting shields executive reporting from breaking changes, guaranteeing continuous visibility into company financial health."
    },
    "quests": [
      {
        "id": "Q30.181",
        "name": "RevOps Modern Data Stack Architecture & Star Schemas",
        "type": "Concept",
        "desc": "Map out the complete RevOps data pipeline: ELT ingestion (Fivetran/Airbyte), Cloud Data Warehouse (Snowflake/BigQuery), dbt modeling (SCD Type 2), and BI layers."
      },
      {
        "id": "Q30.182",
        "name": "The Broken Historical Snapshot Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Audit an enterprise revenue warehouse; uncover how an SCD Type 1 overwrite destroyed 2 years of stage conversion history, invalidating all sales cycle duration calculations."
      },
      {
        "id": "Q30.183",
        "name": "dbt RevOps Data Pipeline & Revenue Contract Engine",
        "type": "Mastery Assignment",
        "desc": "Build a production dbt data transformation model for CRM data: staging layers, SCD2 historical opportunity snapshots, dimensional fact tables, and automated schema tests."
      },
      {
        "id": "Q30.184",
        "name": "3 AM Broken Pipeline Board Emergency Recovery Lab",
        "type": "Production Incident Lab",
        "desc": "Recover from an overnight RevOps pipeline crash where corrupted foreign keys severed opportunity links 3 hours before the quarterly earnings call; restore data integrity."
      }
    ]
  },
  {
    "day": 47,
    "month": 2,
    "blockNum": 10,
    "title": "Full-Funnel Revenue Attribution: Multi-Touch (W-Shaped), Markov Chains & Shapley Values",
    "stageNum": 4,
    "stageName": "Stage 4: Global Scale & RevOps Architecture",
    "pedagogicalRole": "Attribution Science (Multi-Touch Attribution Models, Algorithmic Markov Chains & Game-Theoretic Shapley Values)",
    "spokenGoal": "Marketing claims they drove 100% of pipeline; Sales claims they closed 100% of revenue; Partners claim they introduced the deal. Today we engineer Revenue Attribution as an algorithmic science\u2014replacing simplistic first/last-touch models with W-shaped, Markov chain removal effects, and Shapley values.",
    "conceptInvariant": "Attribution Conservation Invariant: Across any enterprise deal, the sum of attributed fractional revenue weights across all touchpoints must strictly equal 100% of closed Annual Contract Value ($ACV$); over-attribution violates financial conservation.",
    "failureMode": "The 300% Attributed Pipeline Fantasy: Marketing, Sales, and Channel teams each present independent attribution reports to the board, claiming credit for $15M, $18M, and $12M of pipeline respectively on a company that only generated $15M total, resulting in executive ridicule.",
    "tryItFriction": "Construct a multi-touch attribution algorithm where touchpoints occurring after the Opportunity Closed-Won date are erroneously assigned credit for the deal creation.",
    "socraticHints": [
      "Why are First-Touch and Last-Touch attribution models fundamentally flawed in long (6\u201312 month) enterprise B2B sales cycles?",
      "How does W-Shaped attribution distribute credit (e.g., 30% First Touch, 30% Lead Creation, 30% Opportunity Creation, 10% Middle Touches)?",
      "Formulate the Markov Chain Removal Effect: calculate the probability drop in deal completion when a specific marketing/sales channel touchpoint is removed."
    ],
    "situationalPuzzle": {
      "scenario": "Your enterprise company closes a $1,000,000 contract. The touchpoint history shows: 1) Executive reads whitepaper on LinkedIn (First Touch), 2) VP attends webinar (Lead Creation), 3) Director attends dinner hosted by GSI Partner (Opportunity Creation), 4) AE hosts 8 product demos and ROI reviews, 5) Prospect attends annual customer conference right before signing.",
      "options": [
        "Give 100% credit to the AE because they held the final negotiations.",
        "Apply algorithmic attribution: use a W-shaped or Markov model that assigns 30% to LinkedIn discovery, 30% to webinar qualification, 30% to the GSI partner dinner milestone, and distributes the remaining 10% across ongoing AE meetings and conference attendance, reflecting collaborative multi-channel execution.",
        "Give 100% credit to the conference because it was the last interaction before the contract was signed.",
        "Do not track attribution because marketing and sales should not compete."
      ],
      "correctOptionIndex": 1,
      "debrief": "Single-touch attribution creates destructive departmental silos and misallocates marketing capital. In multi-stakeholder enterprise deals, success requires initial brand awareness, educational qualification, partner credibility, and relentless sales execution. Multi-touch and Markov models objectively allocate capital to the channels that actually move deals forward."
    },
    "quests": [
      {
        "id": "Q30.185",
        "name": "Attribution Mathematics: W-Shaped, Markov Chains & Shapley Values",
        "type": "Concept",
        "desc": "Derive the mathematical formulas of B2B revenue attribution: Linear, Time-Decay, W-Shaped, Markov transition removal effects, and cooperative game-theoretic Shapley values."
      },
      {
        "id": "Q30.186",
        "name": "The Double-Counted Pipeline Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Audit an enterprise marketing and sales attribution dataset; identify 50 deals where disconnected attribution tools double-counted $8M in revenue across marketing and SDR teams."
      },
      {
        "id": "Q30.187",
        "name": "Algorithmic Multi-Touch & Markov Revenue Attribution Engine",
        "type": "Mastery Assignment",
        "desc": "Build an algorithmic attribution microservice in Python/TypeScript that ingests multi-channel buyer touchpoint graphs and computes Markov removal effects and Shapley revenue weights."
      },
      {
        "id": "Q30.188",
        "name": "Executive GTM Budget Allocation War Room",
        "type": "Production Incident Lab",
        "desc": "Lead an executive budget allocation review between CMO, CRO, and CFO; use objective Markov attribution data to reallocate $5M in marketing budget to highest-yield channels."
      }
    ]
  },
  {
    "day": 48,
    "month": 2,
    "blockNum": 10,
    "title": "Sales Capacity Planning & Ramp-Time Erlang Queueing: Quota Capacity & Attrition Buffers",
    "stageNum": 4,
    "stageName": "Stage 4: Global Scale & RevOps Architecture",
    "pedagogicalRole": "Capacity Planning Science (Headcount Ramp Models, Erlang Queueing & Quota Over-Assignment Physics)",
    "spokenGoal": "You cannot hit a $50M revenue plan with a $30M sales team. Today we engineer Sales Capacity Planning\u2014modeling rep ramp curves, Erlang queueing for inbound opportunities, quota over-assignment ratios, and voluntary attrition buffers.",
    "conceptInvariant": "Capacity Coverage Invariant: Total ramp-adjusted sales quota capacity must provide $\\ge 1.25\\times$ (125%) coverage of corporate annual revenue targets to absorb inevitable rep ramp delays and historical turnover.",
    "failureMode": "The 100% Quota Coverage Fallacy: A CRO builds next year's $20M revenue plan by hiring 20 reps with $1M quotas each, assuming 100% capacity coverage. Because new reps take 6 months to ramp and 4 reps quit mid-year, actual productive capacity is only $13M, resulting in a disastrous 35% plan miss.",
    "tryItFriction": "Build a sales capacity model where newly hired reps are assumed to produce 100% of full quota starting on Day 1 of employment.",
    "socraticHints": [
      "What is the standard enterprise AE ramp schedule (e.g., Month 1\u20133: 0%, Month 4: 25%, Month 5: 50%, Month 6: 75%, Month 7+: 100%)?",
      "Why must quota capacity include an intentional over-assignment buffer (typically 20\u201330% above the corporate board plan)?",
      "Formulate the Erlang queueing model determining how many active opportunities an enterprise AE can manage without quality collapse."
    ],
    "situationalPuzzle": {
      "scenario": "Your board approves a $40M Annual Recurring Revenue target for next fiscal year. The average enterprise rep quota is $1.5M. The CEO says: 'Great, we just need $40M / $1.5M = 27 reps.' Historical data reveals: 1) Rep ramp takes 6 months, 2) Annual sales rep turnover is 20%, and 3) Average historical quota attainment is 80%.",
      "options": [
        "Hire 27 reps and assume everyone will hit 100% of quota.",
        "Engineer realistic capacity coverage: 1) Adjust for 80% attainment ($1.5M quota = $1.2M expected output); 2) Add 25% over-assignment buffer ($40M plan requires $50M in street quota = ~34 fully ramped reps); 3) Factor in 6-month ramp curves and 20% attrition, demonstrating that 42 total reps must be hired by Q1 to deliver the $40M plan.",
        "Double all existing rep quotas to $3.0M without hiring anyone.",
        "Tell the board the $40M target is mathematically impossible and demand a $20M target."
      ],
      "correctOptionIndex": 1,
      "debrief": "Building a sales plan on 100% quota coverage with zero ramp delay or attrition is financial suicide. Top RevOps architects design with realistic assumptions: discounting for historical attainment (~80%), factoring in non-productive ramp months, and over-assigning street quota by 20\u201330% to guarantee that board targets are securely met."
    },
    "quests": [
      {
        "id": "Q30.189",
        "name": "Sales Capacity Mathematics: Ramp Curves & Erlang Queueing",
        "type": "Concept",
        "desc": "Formalize the quantitative formulas of sales capacity planning: non-linear ramp curves, Erlang C opportunity load models, quota over-assignment ratios, and attrition buffers."
      },
      {
        "id": "Q30.190",
        "name": "The Under-Capacity Revenue Miss Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Audit an enterprise SaaS company's failed fiscal year; demonstrate how unrealistic zero-ramp assumptions and unbudgeted rep turnover directly caused a $12M revenue shortfall."
      },
      {
        "id": "Q30.191",
        "name": "Algorithmic Sales Capacity & Headcount Planning Simulator",
        "type": "Mastery Assignment",
        "desc": "Build an interactive sales capacity planning engine in TypeScript/Python: cohort ramp curves, hiring pacing schedules, quota over-assignment sliders, and Monte Carlo revenue forecasts."
      },
      {
        "id": "Q30.192",
        "name": "Board-Level Annual Sales Capacity Defense Lab",
        "type": "Production Incident Lab",
        "desc": "Defend next year's 50-rep sales hiring plan before the CFO and Board of Directors; prove that aggressive headcount ramp is required to hit corporate growth targets."
      }
    ]
  },
  {
    "day": 49,
    "month": 2,
    "blockNum": 10,
    "title": "Algorithmic Churn Prediction: Survival Analysis, Cox Proportional Hazards & Logistic Decay",
    "stageNum": 4,
    "stageName": "Stage 4: Global Scale & RevOps Architecture",
    "pedagogicalRole": "Advanced Machine Learning in RevOps (Survival Analysis, Cox Proportional Hazards & Time-to-Event Churn Modeling)",
    "spokenGoal": "Standard classification models predict whether a customer will churn; Survival Analysis predicts WHEN they will churn and what factors accelerate decay. Today we engineer algorithmic churn prediction\u2014implementing Kaplan-Meier survival curves and Cox Proportional Hazards models.",
    "conceptInvariant": "Hazard Function Invariant: Customer churn risk is a continuous hazard function $h(t) = h_0(t) \\exp(\\sum \\beta_i X_i)$; changes in covariates (e.g., executive sponsor departure, API error spikes) dynamically shift the baseline hazard curve.",
    "failureMode": "The Blind Fixed-Timeframe Classifier: A data science team builds a binary logistic regression model predicting 'Will churn in next 30 days'. Because the model ignores temporal exposure and contract durations, it flags customers on 3-year non-cancelable contracts as high risk while missing annual renewal churn.",
    "tryItFriction": "Execute a survival analysis script where censored data (active customers who haven't churned yet) is dropped, biasing churn probability upward by 400%.",
    "socraticHints": [
      "Why is Survival Analysis uniquely suited for subscription SaaS where active customers are right-censored observations?",
      "How does the Cox Proportional Hazards model quantify the relative hazard multiplier (e.g., $HR = 2.4$) of an executive departure?",
      "Formulate the Kaplan-Meier estimator: $\\hat{S}(t) = \\prod_{t_i \\le t} (1 - \\frac{d_i}{n_i})$."
    ],
    "situationalPuzzle": {
      "scenario": "Your machine learning churn model flags an enterprise account as having an 85% churn probability because user logins declined 20%. When Customer Success investigates, they discover the customer just migrated to your new automated API integration, meaning users no longer need to log into the web UI manually to perform tasks.",
      "options": [
        "Trust the ML model blindly and fire the CSM.",
        "Refactor the hazard covariates: update the model to incorporate API call volume, webhook throughput, and automated workflow events alongside UI logins, preventing false-positive churn alerts for deeply integrated enterprise users.",
        "Force the customer to stop using the API and log into the UI daily.",
        "Delete the churn prediction model entirely."
      ],
      "correctOptionIndex": 1,
      "debrief": "Machine learning models in Customer Success must account for modern software usage patterns. Deeply integrated enterprise customers frequently migrate from manual web UI interactions to automated headless APIs. Treating UI login drops without checking API telemetry creates severe false-positive alarms."
    },
    "quests": [
      {
        "id": "Q30.193",
        "name": "Survival Analysis Mathematics & Cox Proportional Hazards",
        "type": "Concept",
        "desc": "Derive the mathematics of customer survival analysis: Kaplan-Meier estimators, hazard functions, right-censoring mechanics, and Cox regression covariate weights."
      },
      {
        "id": "Q30.194",
        "name": "The Biased Binary Churn Model Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Audit an enterprise data science model that failed to predict 3 major account cancellations; demonstrate how omitting temporal right-censoring distorted hazard coefficients."
      },
      {
        "id": "Q30.195",
        "name": "Algorithmic Churn Prediction & Survival Analysis Engine",
        "type": "Mastery Assignment",
        "desc": "Build a customer survival analysis engine in Python: Kaplan-Meier curve generation, Cox Proportional Hazards regression, dynamic risk scoring, and automated alerting."
      },
      {
        "id": "Q30.196",
        "name": "High-Risk Portfolio Survival Analysis War Room",
        "type": "Production Incident Lab",
        "desc": "Analyze an enterprise portfolio of 500 accounts approaching their contract renewal cliff; use survival hazard models to prioritize CSM intervention resources and preserve $15M in ARR."
      }
    ]
  },
  {
    "day": 50,
    "month": 2,
    "blockNum": 10,
    "title": "Milestone 9: ApexRevOps Revenue Intelligence & Full-Funnel BI Suite",
    "stageNum": 4,
    "stageName": "Stage 4: Global Scale & RevOps Architecture",
    "pedagogicalRole": "Milestone Architectural Synthesis (Integrated RevOps ELT, Markov Attribution, Capacity Planning & Survival ML Suite)",
    "spokenGoal": "Milestone 9: You will architect and deploy ApexRevOps\u2014an enterprise Revenue Operations intelligence platform uniting warehouse data pipelines, Markov multi-touch attribution, Erlang sales capacity planning, and Cox hazard churn prediction models.",
    "conceptInvariant": "Revenue Intelligence Invariant: ApexRevOps must maintain automated, point-in-time financial coherence across the entire funnel\u2014connecting marketing spend, pipeline velocity, rep capacity, and customer churn hazard into a single deterministic ledger.",
    "failureMode": "Disconnected Metric Drift: Marketing, Sales, and Finance dashboards calculate customer lifetime value (LTV) and CAC using three different conflicting formulas, resulting in contradictory guidance during an SEC audit.",
    "tryItFriction": "Execute the ApexRevOps data pipeline with mismatched currency conversion exchange rates across global subsidiaries, corrupting executive aggregate revenue reporting.",
    "socraticHints": [
      "How does ApexRevOps bridge the gap between transactional CRM databases and analytical data warehouses?",
      "What automated sanity checks ensure that total attributed revenue matches GAAP financial statements?",
      "Architect ApexRevOps with high scalability: Ingestion Connector, dbt Transformation Runner, Attribution Model, Capacity Simulator, and Churn ML Engine."
    ],
    "situationalPuzzle": {
      "scenario": "You are presenting the completed ApexRevOps platform to the Board of Directors. The CEO notes that the marketing attribution module recommends cutting spend on Google Ads by 40% and reallocating it to GSI co-marketing events, while the Capacity Planning engine indicates the enterprise sales team is 15% under-staffed for next year's growth plan. The VP of Marketing resists the budget cut.",
      "options": [
        "Abandon the algorithmic recommendations and keep historical budgets unchanged.",
        "Defend the integrated RevOps architecture: demonstrate using Markov removal effects and survival data that GSI-sourced deals yield 3x higher contract value ($V_{avg}$) and 25% higher Net Retention Rate ($NRR$) compared to search ads, and show that reallocating budget to hire 5 Enterprise AEs maximizes net enterprise valuation.",
        "Fire the VP of Marketing on the spot.",
        "Let the board members vote on marketing budgets based on personal preference."
      ],
      "correctOptionIndex": 1,
      "debrief": "A sovereign RevOps platform transforms corporate budgeting from an emotional political battle into an objective, data-driven optimization exercise. Integrating attribution science with capacity modeling and retention telemetry proves mathematically how capital reallocation generates the highest risk-adjusted enterprise growth."
    },
    "quests": [
      {
        "id": "Q30.197",
        "name": "ApexRevOps System Architecture Specification",
        "type": "Concept",
        "desc": "Author the complete system specification for ApexRevOps: warehouse ELT pipeline topology, Markov attribution schemas, Erlang capacity equations, and Cox hazard ML pipelines."
      },
      {
        "id": "Q30.198",
        "name": "The Conflicting Revenue Metric Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Audit an enterprise company's disparate BI reports; uncover 5 conflicting definitions of CAC and LTV that obscured a structural $6M operational cash burn."
      },
      {
        "id": "Q30.199",
        "name": "ApexRevOps Platform Core Implementation",
        "type": "Mastery Assignment",
        "desc": "Build the complete ApexRevOps platform in TypeScript/Python: dbt pipeline integration, multi-touch Markov attribution engine, sales capacity simulator, and Cox survival churn predictor."
      },
      {
        "id": "Q30.200",
        "name": "Enterprise IPO Readiness Revenue Audit Lab",
        "type": "Production Incident Lab",
        "desc": "Subject the entire ApexRevOps engine to an adversarial mock SEC audit prior to a company IPO; defend data lineage, metric reconciliation, and forecasting accuracy."
      }
    ]
  },
  {
    "day": 51,
    "month": 2,
    "blockNum": 11,
    "title": "Historic Enterprise Sales Catastrophe 1: The 'Vapourware' Custom Architecture POC Disaster",
    "stageNum": 4,
    "stageName": "Stage 4: Global Scale & RevOps Architecture",
    "pedagogicalRole": "Forensic Post-Mortem Architecture (Over-Promised Architectural Capabilities, Uncapped Liquidated Damages & Breach of Contract)",
    "spokenGoal": "Those who do not study historical enterprise sales disasters are doomed to bankrupt their companies repeating them. Today we conduct a forensic post-mortem on the classic 'Vapourware' POC catastrophe\u2014where sales executives promised non-existent custom capabilities, bound the company to impossible SLAs, and triggered a $15M breach-of-contract lawsuit.",
    "conceptInvariant": "Roadmap Integrity Invariant: Sales contracts must never include binding delivery commitments for unreleased roadmap features without formal Engineering VP and General Counsel dual co-signatures and explicit financial liability caps.",
    "failureMode": "The Vapourware Lawsuit Default: An enterprise sales team commits in an executed contract that their product will support multi-region active-active database replication within 90 days. When engineering admits the feature requires a 2-year rewrite, the customer sues for fraud and breach, securing a $12M settlement.",
    "tryItFriction": "Simulate a contract clause scanner that flags custom development promises but fails to detect ambiguous language like 'Vendor shall use commercially reasonable efforts to deliver bespoke features.'",
    "socraticHints": [
      "Why must roadmaps shared during sales cycles always carry prominent 'Forward-Looking Statements / Non-Binding' legal disclaimers?",
      "What architectural checks prevent sales reps from promising custom bespoke engineering during high-stakes RFP negotiations?",
      "Reconstruct the timeline of a landmark software fraud case (e.g., Computer Associates, MicroStrategy)."
    ],
    "situationalPuzzle": {
      "scenario": "A tier-1 global bank offers your company a $5,000,000 contract if you agree to add a clause to the MSA stating: 'Vendor warrants that the software will achieve sub-millisecond end-to-end encryption across all transactions by Q3, failing which Vendor shall pay $10,000,000 in liquidated damages.' Your engineering team says this is theoretically possible but has never been tested at scale.",
      "options": [
        "Sign the contract immediately because $5,000,000 is transformative revenue for the company.",
        "Fiercely reject the liquidated damages clause: explain that while sub-millisecond encryption is on the roadmap, enterprise SaaS agreements cannot warrant experimental performance thresholds with existential liquidated damages; offer a phased joint innovation charter with clear off-ramps and standard service credits instead.",
        "Sign the contract and hope the bank forgets about the sub-millisecond requirement.",
        "Tell engineering to cancel all other projects and work 100 hours a week."
      ],
      "correctOptionIndex": 1,
      "debrief": "Promising unbuilt, untested engineering capabilities backed by massive liquidated damages is corporate Russian roulette. Sales leadership must protect the company from existential liabilities. Offering non-binding innovation milestones with clean contractual off-ramps allows strategic co-development without gambling the company's survival."
    },
    "quests": [
      {
        "id": "Q30.201",
        "name": "Forensic Anatomy of Vapourware & Breach of Contract",
        "type": "Concept",
        "desc": "Deconstruct historical landmark enterprise software lawsuits: breach of warranty, fraudulent inducement, liquidated damages triggers, and roadmap governance standards."
      },
      {
        "id": "Q30.202",
        "name": "The Unauthorized Roadmap Commitment Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Audit an archive of executed customer contracts and email trails; identify 3 hidden side-agreements where sales reps committed to bespoke features that engineering never built."
      },
      {
        "id": "Q30.203",
        "name": "Automated Roadmap Compliance & Contract Disclaimers Engine",
        "type": "Mastery Assignment",
        "desc": "Build an automated contract review tool that scans proposed client agreements, flags unauthorized roadmap commitments, and automatically inserts non-binding forward-looking disclaimers."
      },
      {
        "id": "Q30.204",
        "name": "Live Breach of Contract Settlement War Room",
        "type": "Production Incident Lab",
        "desc": "Negotiate an emergency settlement with an angry enterprise client after your platform failed to deliver a bespoke contractually promised feature; avoid litigation and preserve the contract."
      }
    ]
  },
  {
    "day": 52,
    "month": 2,
    "blockNum": 11,
    "title": "Historic Enterprise Sales Catastrophe 2: The Rogue Rep Uncapped Commission Scandal",
    "stageNum": 4,
    "stageName": "Stage 4: Global Scale & RevOps Architecture",
    "pedagogicalRole": "Incentive Failure Forensics (Flawed Compensation Mechanics, Uncapped Accelerator Loops & Financial Restatements)",
    "spokenGoal": "Bad incentive plans don't just demotivate reps\u2014they can bankrupt corporations. Today we conduct a forensic autopsy on the Rogue Rep Uncapped Commission Scandal\u2014where flawed accelerator mechanics and missing margin gates caused a single sales rep to earn an unearned multi-million-dollar payout on a loss-making contract.",
    "conceptInvariant": "Margin-Gated Compensation Invariant: Sales commission payouts must be mathematically bounded by gross margin dollar contribution ($Commission \\le k \\times Gross\\_Margin\\_\\$$); deals with negative or sub-threshold gross margins must earn zero commission.",
    "failureMode": "The $3M Commission on a $1M Loss Deal: An AE exploits a comp plan that pays accelerators on Total Contract Value (TCV) regardless of payment terms; they sell a 10-year contract with a 75% discount and Net 180 payment terms, pocketing a $3M commission check while the customer goes bankrupt before paying Invoice #1.",
    "tryItFriction": "Construct a commission calculation script where accelerator multipliers compound infinitely on multi-year contract values without applying contractual payment receipt gates.",
    "socraticHints": [
      "Why must commission plans pay upon cash collection (or include strict 90-day clawbacks) rather than paying 100% on contract signature?",
      "How do multi-year TCV incentives distort rep behavior compared to Annual Contract Value (ACV) incentives?",
      "Reconstruct a historical compensation gaming scandal in enterprise software."
    ],
    "situationalPuzzle": {
      "scenario": "A top-performing Enterprise AE closes an enormous $10,000,000 5-year contract on the last day of the year. Under the company's poorly drafted commission plan, their accelerator pays a staggering $1,800,000 commission. The CFO discovers that to close the deal, the AE secretly agreed to custom on-premise hardware hosting and dedicated 24/7 engineers that will cost the company $11,500,000 to deliver, generating a net loss of $1.5M.",
      "options": [
        "Pay the $1,800,000 commission immediately and congratulate the rep at the annual sales kickoff.",
        "Enforce fiduciary governance: General Counsel and CFO review the transaction; because the AE made unauthorized side commitments that violated corporate delegation of authority and resulted in a negative-margin contract, freeze commission payout pending contract restructuring and enforce formal margin-gated audit policies.",
        "Quietly fire the CFO for raising questions about the company's biggest deal.",
        "Declare corporate bankruptcy."
      ],
      "correctOptionIndex": 1,
      "debrief": "Comp plans that reward top-line revenue without margin gating incentivize reps to sell unprofitable business. When reps commit company resources to unvetted operational costs, executive leadership must step in. Strong RevOps architecture aligns sales commissions directly with gross margin profitability and enforceable cash collection."
    },
    "quests": [
      {
        "id": "Q30.205",
        "name": "Compensation Plan Vulnerability & Incentive Gaming Topology",
        "type": "Concept",
        "desc": "Analyze the structural vulnerabilities of sales compensation plans: TCV vs ACV distortions, unearned accelerator compounding, missing margin floors, and cash-collection timing."
      },
      {
        "id": "Q30.206",
        "name": "The Commission Gaming & Margin Destruction Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Audit an enterprise software compensation ledger; uncover how 4 sales reps exploited multi-year proration loopholes to claim $2.5M in unearned commissions on deeply discounted deals."
      },
      {
        "id": "Q30.207",
        "name": "Automated Margin-Gated Commission & Audit Platform",
        "type": "Mastery Assignment",
        "desc": "Build an enterprise incentive compensation engine in TypeScript: automated gross margin verification, cash-collection milestone gates, multi-tier accelerator bounds, and clawback enforcement."
      },
      {
        "id": "Q30.208",
        "name": "Executive Compensation Dispute & Audit Defense Lab",
        "type": "Production Incident Lab",
        "desc": "Mediate a high-stakes legal dispute with a terminated sales rep demanding an unearned $1.2M commission on a cancelled contract; defend the company's margin-gated comp policy in arbitration."
      }
    ]
  },
  {
    "day": 53,
    "month": 2,
    "blockNum": 11,
    "title": "Historic Enterprise Sales Catastrophe 3: The 40% Churn Cliff Post-Acquisition",
    "stageNum": 4,
    "stageName": "Stage 4: Global Scale & RevOps Architecture",
    "pedagogicalRole": "Post-Merger Customer Retention Forensics (M&A Integration Shock, CSM Disbanding & Enterprise Account Revolts)",
    "spokenGoal": "Most software acquisitions fail not because of technology, but because the acquirer destroys the customer success fabric. Today we conduct a forensic autopsy on the 40% Churn Cliff Post-Acquisition\u2014where private equity buyers cut Customer Success headcount, forcing an enterprise customer revolt.",
    "conceptInvariant": "M&A Retention Invariant: Post-acquisition customer retention requires maintaining dedicated Customer Success ratios and product continuity roadmaps; abrupt forced migrations trigger catastrophic enterprise churn cascades.",
    "failureMode": "The Private Equity CS Liquidation Disaster: A private equity firm acquires a beloved enterprise SaaS startup and immediately lays off 70% of Customer Success Managers to boost short-term EBITDA. Within 12 months, 40% of the enterprise customer base churns, destroying $30M in recurring revenue and cratering the investment.",
    "tryItFriction": "Construct an M&A retention modeling tool where assumed cost-cutting synergies fail to model the non-linear relationship between CSM headcount cuts and customer churn acceleration.",
    "socraticHints": [
      "Why do enterprise customers panic during software acquisitions (fear of price hikes, product deprecation, loss of relationship trust)?",
      "What retention covenants and communication playbooks preserve enterprise trust during corporate M&A transitions?",
      "Reconstruct a historical post-merger customer revolt (e.g., Broadcom/VMware, Oracle/Sun, CA Technologies)."
    ],
    "situationalPuzzle": {
      "scenario": "Your enterprise software company is acquired by a private equity conglomerate. The new management announces: 1) A mandatory 50% price increase on all renewals, 2) The immediate sunset of the on-premise product within 6 months, and 3) The replacement of dedicated CSMs with an outsourced offshore ticketing portal. Five of your largest enterprise accounts totaling $8M ARR schedule an emergency joint meeting.",
      "options": [
        "Ignore the customers and tell them to pay the higher price or leave.",
        "Execute an M&A Customer Retention Strategy: 1) Advocate to executive leadership with churn modeling data showing that abrupt forced price hikes will liquidate $15M in ARR; 2) Structure grandfathered multi-year transition agreements for top enterprise accounts; 3) Retain dedicated Senior CSMs for Tier-1 accounts to guide cloud migration smoothly.",
        "Advise the customers to sue the private equity firm.",
        "Resign immediately without speaking to anyone."
      ],
      "correctOptionIndex": 1,
      "debrief": "Aggressive post-merger extraction strategies (abrupt price spikes, eliminating dedicated CSMs, forced migrations) trigger immediate enterprise account revolts. Presenting empirical churn risk modeling to corporate leadership justifies retention covenants, grandfathered transition roadmaps, and dedicated account management that protects recurring enterprise revenue."
    },
    "quests": [
      {
        "id": "Q30.209",
        "name": "M&A Customer Retention Dynamics & Churn Cascades",
        "type": "Concept",
        "desc": "Analyze the mechanics of post-merger customer dynamics: integration shock, forced migration friction, relationship capital destruction, and retention covenant design."
      },
      {
        "id": "Q30.210",
        "name": "The Post-Acquisition Churn Cascade Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Audit a 2-year post-acquisition customer ledger; demonstrate how cutting 12 CSM salaries ($1.4M saved) triggered $14.2M in enterprise contract cancellations."
      },
      {
        "id": "Q30.211",
        "name": "M&A Customer Retention & Migration Risk Simulator",
        "type": "Mastery Assignment",
        "desc": "Build an M&A customer retention simulator that models price elasticity, migration friction, and CSM coverage ratios to project post-acquisition ARR trajectories."
      },
      {
        "id": "Q30.212",
        "name": "Post-Merger Enterprise Customer Revolt War Room",
        "type": "Production Incident Lab",
        "desc": "Lead an emergency retention summit with 10 furious enterprise clients following an aggressive acquisition announcement; negotiate transition terms that halt customer defections."
      }
    ]
  },
  {
    "day": 54,
    "month": 2,
    "blockNum": 11,
    "title": "Account-Based Marketing (ABM) Orchestration: Intent Telemetry & Dynamic Account Tiering",
    "stageNum": 4,
    "stageName": "Stage 4: Global Scale & RevOps Architecture",
    "pedagogicalRole": "Enterprise Go-To-Market Alignment (ABM Orchestration, Intent Surges & 1-to-1 Account Personalization)",
    "spokenGoal": "Enterprise sales and marketing must act as a single coordinated strike team. Today we architect Account-Based Marketing (ABM)\u2014integrating intent data (Bombora/6sense), dynamic account tiering (Tier 1: 1-to-1, Tier 2: 1-to-Few, Tier 3: 1-to-Many), and multi-channel air cover.",
    "conceptInvariant": "ABM Orchestration Invariant: Marketing spend and sales outreach must be dynamically concentrated on accounts exhibiting simultaneous technographic fit, intent surge velocity, and active executive trigger events.",
    "failureMode": "The Disconnected ABM Money Pit: An enterprise marketing team spends $250,000 on custom personalized ads and direct-mail gift boxes to 50 target accounts; because the sales team was never briefed and did not follow up, zero meetings are booked, wasting 100% of marketing capital.",
    "tryItFriction": "Run an ABM account tiering script where intent score surges fail to promote accounts from Tier 3 to Tier 1, leaving high-intent buyers without dedicated sales coverage.",
    "socraticHints": [
      "What is the operational distinction between Tier 1 (1-to-1 bespoke campaigns), Tier 2 (1-to-few industry clusters), and Tier 3 (1-to-many programmatic aircover)?",
      "How do you establish a unified Sales-Marketing Service Level Agreement (SLA) requiring outbound AE follow-up within 24 hours of an ABM intent surge?",
      "Design an automated ABM orchestration flow connecting intent surges to targeted LinkedIn ads and personalized SDR cadences."
    ],
    "situationalPuzzle": {
      "scenario": "Your ABM intent platform detects that a Fortune 500 retailer has surged by 400% on intent topics related to your software category over the last 72 hours, with 12 distinct IP addresses from their corporate network reading case studies. The assigned AE is on a beach vacation and hasn't logged in.",
      "options": [
        "Wait until the AE returns from vacation next week to do anything.",
        "Trigger automated ABM swarm protocols: 1) Elevate account to 'Surging Priority'; 2) Immediately deploy targeted 1-to-1 executive LinkedIn ads and IP-personalized website experiences; 3) Route an urgent high-intent task to the backup Enterprise AE or SDR Lead to initiate multi-threaded outreach within 4 hours.",
        "Send an automated cold email template with generic copy.",
        "Call the retailer's front desk and ask to speak to the CEO."
      ],
      "correctOptionIndex": 1,
      "debrief": "Enterprise buying windows are fleeting. When an enterprise account surges in intent, they are actively conducting competitive evaluations. Waiting a week means losing the deal to a competitor who responds immediately. Automated ABM swarm protocols ensure immediate digital air cover and rapid sales engagement."
    },
    "quests": [
      {
        "id": "Q30.213",
        "name": "ABM Architecture & Dynamic Account Tiering Taxonomy",
        "type": "Concept",
        "desc": "Map out the strategic framework of Account-Based Marketing: 1-to-1 vs 1-to-Few vs 1-to-Many tiers, intent data integration, and sales-marketing orchestration SLAs."
      },
      {
        "id": "Q30.214",
        "name": "The Wasted ABM Campaign Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Audit an expensive $300k ABM campaign across 100 target accounts; uncover why the lack of sales follow-up and disconnected SDR cadences resulted in an 85% drop-off in conversion."
      },
      {
        "id": "Q30.215",
        "name": "Enterprise ABM Swarm & Intent Orchestration Engine",
        "type": "Mastery Assignment",
        "desc": "Build an automated ABM orchestration service that ingests intent surges, classifies accounts into dynamic tiers, triggers personalized digital ads, and routes priority SDR tasks."
      },
      {
        "id": "Q30.216",
        "name": "Fortune 100 Target Account ABM Infiltration Lab",
        "type": "Production Incident Lab",
        "desc": "Orchestrate an end-to-end 1-to-1 ABM campaign to penetrate a resistant Fortune 100 target account; coordinate intent telemetry, bespoke executive assets, and multi-threaded outreach."
      }
    ]
  },
  {
    "day": 55,
    "month": 2,
    "blockNum": 11,
    "title": "Enterprise CPQ (Configure, Price, Quote) Engineering: Hierarchical Bundles & Proration",
    "stageNum": 4,
    "stageName": "Stage 4: Global Scale & RevOps Architecture",
    "pedagogicalRole": "CPQ Systems Architecture (Product Catalog Graphs, Rule Dependency Engines & Dynamic Proration Calculus)",
    "spokenGoal": "Enterprise quoting cannot happen in static spreadsheets. Today we engineer Enterprise CPQ (Configure, Price, Quote)\u2014building relational product catalogs, hierarchical bundle dependencies, multi-currency proration algorithms, and automated quote generation.",
    "conceptInvariant": "CPQ Rule Invariant: A generated quote must satisfy all product dependency DAGs (e.g., Module B requires Module A) and pricing constraints (min/max seat bounds, tier discounts); contradictory or unprorated configurations are mathematically invalid.",
    "failureMode": "The $800k Spreadsheet Math Error: An enterprise rep uses an outdated Excel quoting sheet to calculate a 3-year contract with mid-term co-terming additions. A formula error calculates proration as simple subtraction rather than daily day-count fraction, undercharging the customer by $800,000.",
    "tryItFriction": "Construct a CPQ proration calculator where leap-year day counts (366 days) produce off-by-one daily rate rounding discrepancies across multi-year contracts.",
    "socraticHints": [
      "Why do enterprise software companies migrate from spreadsheet quoting to dedicated CPQ engines (Salesforce CPQ, DealHub)?",
      "How do Product Dependency DAGs enforce required bundle components and mutually exclusive product options?",
      "Formulate the daily proration formula for mid-term subscription co-terming: $Prorated\\_Fee = Annual\\_Fee \\times \\frac{\\text{Days Remaining in Term}}{\\text{Total Days in Year}}$."
    ],
    "situationalPuzzle": {
      "scenario": "An existing customer paying $200,000/year for 500 seats on a contract expiring in 142 days wants to add 250 additional seats today and co-term them to the existing renewal date. The rep attempts to calculate the price manually by guessing a flat 50% discount.",
      "options": [
        "Allow the rep to guess the price and email the customer an unvetted quote.",
        "Execute the CPQ automated proration engine: calculate the exact daily rate ($Annual\\_Per\\_Seat = \\$400/yr = \\$1.09589/day$), multiply by 250 seats across exactly 142 days ($250 \\times 1.09589 \\times 142 = \\$38,904.10$), apply approved volume discount tiers, and generate a certified co-termed quote artifact.",
        "Tell the customer they must wait until their annual renewal to add any seats.",
        "Give them the 250 seats for free until next year."
      ],
      "correctOptionIndex": 1,
      "debrief": "Manual quoting spreadsheets in enterprise sales lead to massive revenue leakage and contract disputes. Enterprise CPQ engines automate exact daily proration, co-terming additions, and hierarchical bundle rules, ensuring that quotes are mathematically exact, compliant with revenue recognition standards, and legally defensible."
    },
    "quests": [
      {
        "id": "Q30.217",
        "name": "Enterprise CPQ Architecture & Product Catalog Graphs",
        "type": "Concept",
        "desc": "Map out the architecture of enterprise CPQ systems: hierarchical product schemas, option constraints, pricing rule engines, discounting waterfalls, and daily proration mathematics."
      },
      {
        "id": "Q30.218",
        "name": "The Erroneous Proration Revenue Leakage Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Audit 50 historical mid-term co-termed contracts; uncover 8 instances where manual spreadsheet proration errors caused a cumulative $640k in unbilled software usage."
      },
      {
        "id": "Q30.219",
        "name": "Automated Enterprise CPQ Rule & Proration Engine",
        "type": "Mastery Assignment",
        "desc": "Build an enterprise CPQ microservice in TypeScript: hierarchical bundle validator, product dependency DAG resolver, multi-currency proration engine, and PDF quote generator."
      },
      {
        "id": "Q30.220",
        "name": "Complex Multi-Product Enterprise Quote War Room",
        "type": "Production Incident Lab",
        "desc": "Configure and generate a complex $3.5M multi-product quote for a global enterprise with 12 add-on modules, multi-currency billing, and custom co-terming under 2 hours to deadline."
      }
    ]
  },
  {
    "day": 56,
    "month": 2,
    "blockNum": 12,
    "title": "Chief Revenue Officer (CRO) Strategic Architecture RFC: Unified Go-To-Market Alignment",
    "stageNum": 4,
    "stageName": "Stage 4: Global Scale & RevOps Architecture",
    "pedagogicalRole": "Executive GTM Architecture (CRO Strategic RFC Authoring, Cross-Functional Alignment & Multi-Year Scaling Blueprints)",
    "spokenGoal": "At the highest executive level, revenue is an engineering discipline. Today we author the Chief Revenue Officer (CRO) Strategic Architecture Request for Comments (RFC)\u2014a unified, 50-page enterprise Go-To-Market blueprint aligning Sales, Marketing, Customer Success, and RevOps for a $100M ARR company.",
    "conceptInvariant": "GTM Alignment Invariant: An executive Go-To-Market strategy is sound if and only if Customer Acquisition Cost ($CAC$), Customer Lifetime Value ($LTV$), Net Retention Rate ($NRR$), and Sales Velocity ($V$) are mathematically linked in a unified balance sheet model.",
    "failureMode": "The Siloed Executive Civil War: Sales, Marketing, and Customer Success leaders run separate, competing operational playbooks. Marketing blames Sales for dropping leads; Sales blames Product for missing features; CS blames Sales for selling bad-fit customers; company burn rate triples and the board replaces all three executives.",
    "tryItFriction": "Construct a multi-year GTM financial projection model where marketing pipeline generation rates fail to scale dynamically with sales headcount expansion.",
    "socraticHints": [
      "What core sections constitute a master CRO Strategic Architecture RFC (Executive Thesis, Market Segmentation, Full-Funnel Math, Capacity & Headcount, RevOps Infrastructure, Retention & Expansion)?",
      "How do you design a cross-functional GTM Operating Rhythm (Weekly Pipeline Review, Monthly Business Review, Quarterly QBR, Annual Strategy)?",
      "Structure the formal RFC template following senior enterprise engineering standards."
    ],
    "situationalPuzzle": {
      "scenario": "You are appointed Chief Revenue Officer of a $30M ARR SaaS company tasked with scaling to $100M ARR in 3 years. Marketing is generating 5,000 MQLs/month with $< 1\\%$ conversion; Sales has a 6-month cycle with a 18% win rate; Customer Success is losing 20% of revenue to churn annually. The CEO asks for your strategic architecture plan.",
      "options": [
        "Tell the sales team to double their outbound cold calls and hope things improve.",
        "Author and execute the comprehensive CRO Strategic Architecture RFC: 1) Shift marketing from generic volume to Account-Based Marketing (ABM) targeting high-ICP accounts; 2) Enforce strict MEDDPICC qualification and Deal Desk margin gates to raise win rates to 28%; 3) Restructure Customer Success into proactive onboarding and health monitoring to drive NRR to 118%; 4) Unify all revenue data under a centralized RevOps team with real-time analytics.",
        "Demand a 50% marketing budget increase without changing operational processes.",
        "Lower the price of the software to make deals easier to close."
      ],
      "correctOptionIndex": 1,
      "debrief": "Scaling to $100M ARR requires systemic alignment, not brute force. Simply pouring more leads into a leaking funnel burns capital. A unified CRO Strategic RFC addresses the entire customer lifecycle: focusing marketing on high-intent accounts, equipping sales with rigorous qualification, and engineering customer success to turn existing accounts into compounding growth engines."
    },
    "quests": [
      {
        "id": "Q30.221",
        "name": "CRO Strategic RFC Architecture & GTM Operating Principles",
        "type": "Concept",
        "desc": "Deconstruct the master architecture of an executive Go-To-Market RFC: organizational design, unified funnel metrics, compensation alignment, and board governance."
      },
      {
        "id": "Q30.222",
        "name": "The Siloed GTM Misalignment Forensic Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Audit an enterprise company's operational records; trace how unaligned incentives between sales, marketing, and CS led to an unhedged $18M cash burn over 18 months."
      },
      {
        "id": "Q30.223",
        "name": "Master CRO Strategic Architecture RFC Blueprint",
        "type": "Mastery Assignment",
        "desc": "Author the complete, publication-grade Chief Revenue Officer Strategic Architecture RFC for scaling an enterprise B2B company from $30M to $100M ARR with full financial models."
      },
      {
        "id": "Q30.224",
        "name": "Executive Board GTM Architecture Defense Lab",
        "type": "Production Incident Lab",
        "desc": "Defend your CRO Strategic Architecture RFC before an adversarial Board of Directors and private equity investors; answer tough questions on payback periods and capital efficiency."
      }
    ]
  },
  {
    "day": 57,
    "month": 2,
    "blockNum": 12,
    "title": "Global Enterprise Data Privacy in CRM: GDPR Article 17 Erasure vs Immutable Audit Ledgers",
    "stageNum": 4,
    "stageName": "Stage 4: Global Scale & RevOps Architecture",
    "pedagogicalRole": "Data Governance Architecture (GDPR/CCPA Compliance, Right to Erasure, Immutable Financial Auditing & Privacy Shield)",
    "spokenGoal": "Enterprise sales operations must obey global privacy laws. Today we engineer the tension between GDPR Article 17 ('Right to be Forgotten') and corporate financial auditability\u2014building automated Data Subject Access Request (DSAR) workflows that pseudonymize PII while preserving immutable revenue ledgers.",
    "conceptInvariant": "Privacy-Auditability Invariant: A GDPR Article 17 erasure request must redact or cryptographically hash all Personally Identifiable Information (PII) across CRM leads and contacts while preserving immutable financial transaction records required for tax and statutory auditing.",
    "failureMode": "The Illegal Record Wipe Disaster: A junior CRM administrator receives a GDPR 'Right to be Forgotten' request from an executive who was previously a customer. The admin physically deletes the Contact and parent Opportunity records from the database, destroying $2M in historical tax audit trails and violating corporate accounting laws.",
    "tryItFriction": "Build a GDPR erasure script where deleting customer PII cascades into corrupted foreign-key violations across closed-won historical invoice tables.",
    "socraticHints": [
      "How does GDPR Article 17 explicitly permit retention of financial and legal contract records under Article 17(3)(b) ('compliance with a legal obligation')?",
      "What technical architecture (Cryptographic Shredding, Field-Level Salted Hashes) redacts names and emails while maintaining referential integrity in data warehouses?",
      "Design an automated DSAR processing pipeline that fulfills erasure requests within statutory 30-day deadlines."
    ],
    "situationalPuzzle": {
      "scenario": "A European enterprise executive sends a formal GDPR Article 17 Right to Erasure demand requiring complete deletion of all personal data from your systems. In your CRM, this executive was the primary contact on three closed-won contracts totaling $1,200,000 executed over the past 3 years.",
      "options": [
        "Physically delete the entire Account, Contact, and Opportunity records from the database immediately.",
        "Execute compliant Pseudonymization Architecture: 1) Verify identity of data subject; 2) Delete or cryptographically hash all personal marketing tracking data, phone numbers, and email addresses from active marketing and sales systems; 3) Retain executed PDF contracts and anonymized financial transaction records in an immutable archive citing statutory tax compliance exceptions (GDPR Art. 17(3)(b)); 4) Issue formal completion certificate within 30 days.",
        "Ignore the email because US companies don't need to follow European laws.",
        "Reply to the executive with an automated marketing email asking them to reconsider."
      ],
      "correctOptionIndex": 1,
      "debrief": "Complying with GDPR does not mean destroying historical accounting records. European privacy law explicitly recognizes statutory record-keeping exceptions. Proper architectural execution pseudonymizes marketing and communication PII while retaining anonymized transaction ledgers and signed legal artifacts necessary for corporate tax and statutory audit compliance."
    },
    "quests": [
      {
        "id": "Q30.225",
        "name": "Global Privacy Jurisprudence: GDPR, CCPA/CPRA & CAN-SPAM",
        "type": "Concept",
        "desc": "Map out the legal architecture of global data privacy in CRM: GDPR Articles 6, 17, and 30, CCPA/CPRA consumer rights, CASL/CAN-SPAM regulations, and cross-border transfer frameworks."
      },
      {
        "id": "Q30.226",
        "name": "The Corrupted Audit Ledger Erasure Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Investigate a regulatory audit failure where an overzealous DSAR deletion script wiped out 150 customer contact records, severing historical billing links and triggering a tax audit penalty."
      },
      {
        "id": "Q30.227",
        "name": "Automated GDPR DSAR & Cryptographic Shredding Engine",
        "type": "Mastery Assignment",
        "desc": "Build an automated DSAR fulfillment microservice in TypeScript/SQL: PII identification, cryptographic field shredding, anonymized foreign key preservation, and compliance log generation."
      },
      {
        "id": "Q30.228",
        "name": "Live EU Data Protection Authority Regulatory Audit Lab",
        "type": "Production Incident Lab",
        "desc": "Defend your CRM data architecture and DSAR processing pipeline during a simulated audit by an EU Data Protection Authority; prove full GDPR compliance and avoid regulatory fines."
      }
    ]
  },
  {
    "day": 58,
    "month": 2,
    "blockNum": 12,
    "title": "Sales Engineering Architecture & Solution Architect Co-Ownership",
    "stageNum": 4,
    "stageName": "Stage 4: Global Scale & RevOps Architecture",
    "pedagogicalRole": "Technical Sales Leadership (Sales Engineering Ratios, Sandbox Architecture & Security Response Velocity)",
    "spokenGoal": "In complex B2B sales, the Sales Engineer (SE) is the conscience of the deal. Today we engineer Sales Engineering Architecture\u2014managing SE-to-AE staffing ratios, building automated demo sandbox provisioning systems, and driving security questionnaire response velocity.",
    "conceptInvariant": "SE Technical Authority Invariant: A Sales Engineer possesses absolute veto power over technical solution scope; an Account Executive cannot override an SE's architectural non-feasibility assessment.",
    "failureMode": "The Demo Environment Crash During Keynote: A sales team attempts to run a live product demo for a Fortune 50 prospect using a shared, unisolated staging cluster. A developer pushes broken code mid-call, causing the demo to crash on screen in front of 40 client executives.",
    "tryItFriction": "Construct an automated demo sandbox provisioner where orphaned cloud resources fail to be garbage-collected after 72 hours, generating massive cloud hosting bills.",
    "socraticHints": [
      "What is the optimal SE-to-AE ratio across deal complexity tiers (e.g., Enterprise: 1:1 or 1:2; Mid-Market: 1:3 or 1:4)?",
      "How do isolated containerized demo sandboxes (Kubernetes/Terraform) guarantee deterministic demo performance?",
      "Design an automated SE engagement matrix defining when a Sales Engineer is brought into the deal cycle."
    ],
    "situationalPuzzle": {
      "scenario": "An Enterprise AE is working a $1.2M contract and brings in the Principal Sales Engineer for a technical deep-dive. The customer's Chief Architect insists on a technical feature that would require custom modification of your multi-tenant database partitioning. The SE concludes this is technically unfeasible and will destabilize core infrastructure. The AE begs the SE: 'Just say yes so we can close the deal, we will figure it out later.'",
      "options": [
        "The SE agrees to say yes to help the AE hit their quarterly quota.",
        "The SE upholds technical governance: exercises technical veto, explains the architectural constraint clearly to the customer, and proposes a robust, supported alternative pattern using event streaming and external webhooks that solves the business requirement without breaking platform integrity.",
        "The SE insults the customer architect for asking for a bad feature.",
        "The SE stays silent and lets the AE answer the technical questions."
      ],
      "correctOptionIndex": 1,
      "debrief": "Sales Engineers exist to ensure technical truth and long-term customer viability. Allowing sales pressure to override engineering reality results in catastrophic implementation failures, breach of contract, and customer churn. A great SE exercises firm technical authority while proposing creative, supported architectural alternatives that preserve the deal."
    },
    "quests": [
      {
        "id": "Q30.229",
        "name": "Sales Engineering Operating Models & Organizational Ratios",
        "type": "Concept",
        "desc": "Map out the strategic operating model for enterprise Sales Engineering: AE-to-SE ratios, technical discovery frameworks, demo engineering, and technical gatekeeping governance."
      },
      {
        "id": "Q30.230",
        "name": "The Unchecked AE Technical Commitment Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Audit an enterprise software company's customer escalations; uncover 6 major operational crises caused by sales reps bypassing SE technical review during contract negotiations."
      },
      {
        "id": "Q30.231",
        "name": "Automated Ephemeral Demo Sandbox Provisioning Engine",
        "type": "Mastery Assignment",
        "desc": "Build an automated demo sandbox orchestration tool using container APIs: instant single-tenant workspace provisioning, realistic mock data seeding, and automated 48-hour teardown."
      },
      {
        "id": "Q30.232",
        "name": "Live Fortune 50 Architectural Evaluation Defense Lab",
        "type": "Production Incident Lab",
        "desc": "Lead a grueling 3-hour technical architecture interrogation with enterprise security and infrastructure architects on a $2.5M deal; defend multi-tenant isolation and data residency."
      }
    ]
  },
  {
    "day": 59,
    "month": 2,
    "blockNum": 12,
    "title": "High-Performance Sales Behavioral Psychology: Cialdini Vectors & Tactical Empathy",
    "stageNum": 4,
    "stageName": "Stage 4: Global Scale & RevOps Architecture",
    "pedagogicalRole": "Behavioral Sales Psychology (Cialdini Influence Vectors, Voss Tactical Empathy & Sustainable High Performance)",
    "spokenGoal": "Enterprise sales is human decision-making under intense pressure. Today we master advanced behavioral psychology\u2014applying Robert Cialdini's 7 Vectors of Influence, Chris Voss's Tactical Empathy and calibrated questions, and building psychological resilience against burnout.",
    "conceptInvariant": "Psychological Alignment Invariant: Persuasion in enterprise sales is not manipulation; it is the ethical alignment of emotional safety, perceived status, and shared mission achieved through tactical empathy and socratic labeling.",
    "failureMode": "The Manipulative High-Pressure Blowup: A sales rep uses transparent, sleazy pressure tactics ('If you don't buy today, your competitor will crush you!') on a seasoned enterprise buyer; the buyer is disgusted, cancels the evaluation, and shares the interaction publicly on LinkedIn as an example of toxic sales culture.",
    "tryItFriction": "Analyze a sales conversation transcript where aggressive 'closing questions' trigger defensive withdrawal from the prospective buyer.",
    "socraticHints": [
      "How does Chris Voss's 'Mirroring and Labeling' ('It seems like you feel unappreciated by your executive leadership') defuse defensive hostility?",
      "How do Cialdini's 7 Vectors (Reciprocity, Commitment/Consistency, Social Proof, Authority, Liking, Scarcity, Unity) operate in enterprise buying committees?",
      "What psychological strategies prevent sales executive burnout during prolonged multi-quarter negotiations?"
    ],
    "situationalPuzzle": {
      "scenario": "During a tense contract negotiation, an enterprise procurement lead slams their hand on the table and shouts: 'Your pricing is an insult to our intelligence! You are trying to rip us off, and this deal is dead!'",
      "options": [
        "Shout back that your pricing is fair and threaten to walk away.",
        "Apply Tactical Empathy (Chris Voss): maintain calm late-night FM DJ voice, label the negative emotion: 'It sounds like you feel that we are not respecting your budgetary constraints, and it feels like this proposal makes you look bad in front of your leadership.' Let them vent, then ask a calibrated question: 'How am I supposed to lower pricing without stripping out the 24/7 dedicated support team your engineers specifically mandated?'",
        "Immediately slash pricing by 50% to stop them from yelling.",
        "Burst into tears and apologize profusely."
      ],
      "correctOptionIndex": 1,
      "debrief": "When enterprise buyers exhibit intense anger, it is almost always driven by underlying fear (fear of looking bad to superiors, fear of budget deficits). Counter-aggression escalates the impasse; premature capitulation destroys pricing power. Tactical empathy defuses emotional tension by demonstrating profound understanding, while calibrated 'How' questions guide the buyer to solve the constraint collaboratively."
    },
    "quests": [
      {
        "id": "Q30.233",
        "name": "Behavioral Sales Psychology: Cialdini & Voss Frameworks",
        "type": "Concept",
        "desc": "Analyze the psychological mechanics of enterprise negotiations: Cialdini's 7 Influence Vectors, Voss's Tactical Empathy, calibrated open-ended questions, and cognitive bias neutralization."
      },
      {
        "id": "Q30.234",
        "name": "The Aggressive Pressure Tactics Backfire Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Audit audio recordings of 10 failed high-stakes enterprise sales calls; identify how manipulative high-pressure closing tactics triggered psychological reactance and destroyed deal trust."
      },
      {
        "id": "Q30.235",
        "name": "AI Conversation Psychology & Tactical Empathy Coach",
        "type": "Mastery Assignment",
        "desc": "Build an AI conversation analysis tool that ingests call transcripts, evaluates rep psychological framing (listening vs talking ratio, labeling frequency, pressure tactics), and provides coaching tips."
      },
      {
        "id": "Q30.236",
        "name": "High-Tension Hostile Negotiation Simulation Lab",
        "type": "Production Incident Lab",
        "desc": "Step into a simulated high-stakes negotiation with an aggressively hostile procurement officer on a $2M deal; defuse emotional anger using tactical empathy and close the contract."
      }
    ]
  },
  {
    "day": 60,
    "month": 2,
    "blockNum": 12,
    "title": "Capstone 2: ApexRevenueOS Full-Scale Enterprise GTM, Sales Engineering & RevOps Master Capstone Viva Gate",
    "stageNum": 4,
    "stageName": "Stage 4: Global Scale & RevOps Architecture",
    "pedagogicalRole": "Month 2 Master Capstone Defense (Comprehensive Enterprise GTM, Sales Engineering, RevOps & Retention Operating System)",
    "spokenGoal": "Welcome to the ultimate graduation summit: the Month 2 Master Capstone Viva Gate. You will defend ApexRevenueOS\u2014a sovereign, full-scale enterprise Revenue Operating System uniting the entire 60-day curriculum: prospecting, qualification, value architecture, deal desk, legal redlines, CRM data architecture, customer success, NRR expansion, RevOps data warehousing, and executive GTM governance\u2014before the Senior Evaluation Board.",
    "conceptInvariant": "Total Revenue Operating System Invariant: ApexRevenueOS must maintain absolute end-to-end operational, legal, and mathematical integrity across the entire customer lifecycle\u2014from initial lead intent surge through multi-year expansion, GAAP revenue recognition, and global privacy compliance.",
    "failureMode": "Catastrophic Systemic GTM Collapse: A multi-billion-dollar enterprise software company collapses post-IPO due to simultaneous failures across unvetted contract SLAs, flawed un-gated commission payouts, hidden customer churn cascades, and fraudulent attribution metrics, resulting in complete executive removal and class-action litigation.",
    "tryItFriction": "Execute the comprehensive ApexRevenueOS end-to-end stress test under maximum concurrent load with simultaneous hostile contract redlines, M&A churn shocks, and database schema mutations.",
    "socraticHints": [
      "How does ApexRevenueOS achieve architectural synergy between front-line sales execution (MEDDPICC, MAPs) and back-office revenue engineering (dbt pipelines, Markov attribution)?",
      "What automated circuit breakers prevent rogue rep concessions, legal liability creep, and unearned commission payouts?",
      "Prepare to defend every mathematical equation, legal clause fallback, and architectural diagram across all 60 days before the Senior Board."
    ],
    "situationalPuzzle": {
      "scenario": "You are on the stage defending ApexRevenueOS before the Senior Evaluation Board (acting as Chief Executive Officer, Chief Revenue Officer, Chief Financial Officer, Chief Information Security Officer, and General Counsel). The board simulates a concurrent enterprise crisis: 1) A $3M deal has stalled over uncapped liability redlines; 2) A major customer with $2M ARR is showing high churn hazard on survival curves; 3) A top rep has requested an unauthorized 40% discount; 4) A GDPR erasure request has arrived for a historical customer. How does ApexRevenueOS resolve the crisis?",
      "options": [
        "Panic and attempt to handle each issue manually while ignoring corporate policies.",
        "Demonstrate the unified power of ApexRevenueOS: 1) ApexLegal activates the pre-approved super-cap fallback; 2) ApexSuccess dispatches the automated Churn Rescue workflow and executive briefing; 3) ApexDealDesk rejects the unauthorized discount and enforces margin-gated concession trade-offs; 4) ApexPrivacy executes cryptographic pseudonymization while preserving immutable financial audit ledgers.",
        "Shut down the software and state that enterprise management cannot be automated.",
        "Resign from the viva defense."
      ],
      "correctOptionIndex": 1,
      "debrief": "This is the ultimate triumph of enterprise revenue architecture. When crises strike simultaneously across legal, customer retention, pricing discipline, and regulatory compliance, ApexRevenueOS does not break. Its deterministic state machines, automated governance gates, and rigorous data pipelines orchestrate a synchronized, legally defensible, and financially sound resolution\u2014proving that you have mastered enterprise revenue engineering at the highest elite standard."
    },
    "quests": [
      {
        "id": "Q30.237",
        "name": "ApexRevenueOS Master Architecture Blueprint",
        "type": "Concept",
        "desc": "Author the complete, sovereign Architectural Blueprint for ApexRevenueOS, detailing the end-to-end unification of all 10 milestones across the 60-day curriculum."
      },
      {
        "id": "Q30.238",
        "name": "The Systemic Enterprise Collapse Forensic Autopsy",
        "type": "Detective Challenge",
        "desc": "Conduct an exhaustive forensic audit on a fictional $100M SaaS enterprise failure; identify the cascading points of failure across sales qualification, deal desk, comp plans, and retention."
      },
      {
        "id": "Q30.239",
        "name": "ApexRevenueOS Full-Scale Enterprise Platform Implementation",
        "type": "Mastery Assignment",
        "desc": "Implement the complete, production-grade ApexRevenueOS platform in TypeScript/Python: unified UI, CRM relational engine, Deal Desk, RevOps dbt models, and predictive ML churn modules."
      },
      {
        "id": "Q30.240",
        "name": "ApexRevenueOS Master Capstone Senior Board Viva Defense",
        "type": "Production Incident Lab",
        "desc": "Defend the entire 60-day ApexRevenueOS enterprise operating system in a live adversarial viva voce examination before the Senior Evaluation Board; achieve unanimous master certification."
      }
    ]
  }
]
