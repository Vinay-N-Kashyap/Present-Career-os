# scripts/visuals/sales_crm_spec_m2_part1.py
# Month 2: Days 31 to 45 Specification for Course 30: Enterprise B2B Sales, Customer Success & CRM Systems Architecture (course-sales-crm-success)
# Conforms strictly to Gate v2 / True 9.8 standard across all 15 days (60 Quests).

DAYS_31_TO_45 = [
  {
    "day": 31,
    "month": 2,
    "blockNum": 7,
    "title": "Enterprise CRM Relational Data Architecture: Salesforce/HubSpot Object Graphs",
    "stageNum": 3,
    "stageName": "Stage 3: Systems Stress-Testing",
    "pedagogicalRole": "CRM Data Modeling (Relational Entity Topology, Custom Objects, Master-Detail Cascades & Field-Level Security)",
    "spokenGoal": "A CRM is not a Rolodex\u2014it is the operational relational database of company revenue. Today we engineer enterprise CRM architecture: modeling Leads, Accounts, Contacts, Opportunities, and Custom Objects with strict relational integrity, junction tables, and field-level security.",
    "conceptInvariant": "Relational CRM Invariant: Opportunity financial records must maintain an immutable foreign-key relationship to parent Accounts; orphaned records or multi-parent opportunity splits without explicit junction accounting violate corporate auditability.",
    "failureMode": "The Orphan Opportunity Outage: A flawed Apex trigger in Salesforce reparents 10,000 opportunities during a mass CSV upload without preserving original Account IDs, corrupting $45M in historical revenue data and halting sales operations for 36 hours.",
    "tryItFriction": "Construct a CRM entity relationship schema where deleting an Account record cascades into silent physical deletion of all closed-won historical opportunities.",
    "socraticHints": [
      "What is the architectural difference between a Lookup Relationship (loose coupling) and a Master-Detail Relationship (tight coupling with cascade delete and roll-up summaries) in enterprise CRMs?",
      "How do Junction Objects resolve Many-to-Many relationships between Accounts and Partner Resellers?",
      "Design an entity-relationship diagram linking Leads, Accounts, Contacts, Opportunities, and Product Line Items."
    ],
    "situationalPuzzle": {
      "scenario": "Your enterprise CRM administrator designs an Opportunity schema using simple loose Lookup relationships to Accounts. A junior marketing operations rep accidentally deletes an inactive parent Account, which silently severs 45 active and historical Opportunity records, leaving them as unlinked orphans with no account context.",
      "options": [
        "Restore the database from last week's backup and accept losing one week of sales notes.",
        "Re-architect the CRM schema: implement Master-Detail or strict deletion-preventing validation rules on parent Accounts with active opportunities, enforce soft-delete flags, and deploy an automated daily orphaned-record audit job.",
        "Tell sales reps to manually recreate all missing opportunities from memory.",
        "Switch from Salesforce to Google Sheets to eliminate relational complexity."
      ],
      "correctOptionIndex": 1,
      "debrief": "Loose lookup relationships without deletion locks create immense operational risk in enterprise CRMs. In production systems, deleting an account that possesses active or closed-won opportunities must be blocked by strict database triggers or validation rules, preserving historical audit trails and financial reporting integrity."
    },
    "quests": [
      {
        "id": "Q30.121",
        "name": "Enterprise CRM Relational Topology & Object Schemas",
        "type": "Concept",
        "desc": "Map out the canonical relational schema of enterprise CRMs: Standard Objects, Custom Objects, Master-Detail vs Lookup, Junction Objects, and Roll-up Summary math."
      },
      {
        "id": "Q30.122",
        "name": "The Corrupted Parent-Child Schema Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Audit an enterprise CRM database extract of 50,000 records; identify 1,200 orphaned opportunities and circular junction references caused by unvalidated CSV imports."
      },
      {
        "id": "Q30.123",
        "name": "Relational CRM Schema & Security Engine Implementation",
        "type": "Mastery Assignment",
        "desc": "Build a relational CRM data engine in TypeScript/SQL supporting custom entity definition, cascade-delete prevention, field-level security (FLS), and roll-up calculations."
      },
      {
        "id": "Q30.124",
        "name": "3 AM Production CRM Cascade Corruption Recovery Lab",
        "type": "Production Incident Lab",
        "desc": "Recover from a live production incident where a bulk API migration script corrupted account hierarchies and field-level security permissions across 5,000 enterprise accounts."
      }
    ]
  },
  {
    "day": 32,
    "month": 2,
    "blockNum": 7,
    "title": "Lead-to-Account (L2A) Fuzzy Matching, Deduplication & Routing DAGs",
    "stageNum": 3,
    "stageName": "Stage 3: Systems Stress-Testing",
    "pedagogicalRole": "Identity Resolution Engineering (Lead-to-Account Matching DAGs, Levenshtein/Jaro-Winkler Distance & Round-Robin Routing)",
    "spokenGoal": "When an executive from General Electric fills out a demo form, they shouldn't be treated as an unassigned cold lead and dialled by a random SDR. Today we engineer Lead-to-Account (L2A) matching\u2014using fuzzy text algorithms and deterministic DAGs to route leads directly to the assigned account owner.",
    "conceptInvariant": "L2A Identity Invariant: An inbound lead must be matched to an existing enterprise Account record if domain email matching or fuzzy company name similarity (Jaro-Winkler distance $\\ge 0.88$) achieves threshold confidence, preserving account executive ownership.",
    "failureMode": "The Account Stealing War: A high-value CTO from a Fortune 50 enterprise target submits a web form using a personal Gmail address; an automated round-robin engine assigns the lead to a mid-market SDR, who aggressively emails the CTO while the Enterprise AE is actively negotiating a $2M contract with the CEO, creating customer fury.",
    "tryItFriction": "Run a fuzzy matching deduplication script where corporate suffix variations (e.g., 'IBM Corp' vs 'International Business Machines Inc.') fail to resolve to the same account entity.",
    "socraticHints": [
      "Why is strict exact-string matching inadequate for enterprise company names (e.g., 'Johnson & Johnson' vs 'J&J Services')?",
      "How does combining corporate domain extraction, IP reverse lookup, and Jaro-Winkler string similarity produce deterministic match scores?",
      "Build a directed acyclic graph (DAG) routing engine that prioritizes existing Account Owner > Tier-1 Account Pool > Territory Round-Robin."
    ],
    "situationalPuzzle": {
      "scenario": "An inbound lead arrives: 'John Doe, VP of Cloud, Acme Corporation, email: jdoe@gmail.com'. In your CRM, 'Acme Corp' is an active enterprise target account assigned to an Enterprise AE with a pending $800k proposal. How should the L2A routing engine resolve this lead?",
      "options": [
        "Route the lead to a random junior SDR because the email domain is @gmail.com.",
        "Execute the multi-tier identity resolution pipeline: flag the freemail domain, run fuzzy matching on 'Acme Corporation' (Jaro-Winkler similarity to 'Acme Corp' = 0.94), cross-reference LinkedIn enrichment data to verify John Doe's employment, and route the lead directly to the assigned Enterprise AE with an urgent high-intent notification.",
        "Delete the lead because corporate buyers never use personal emails.",
        "Send an automated email asking the prospect to re-submit using their corporate email."
      ],
      "correctOptionIndex": 1,
      "debrief": "Senior enterprise executives frequently use personal emails or mobile devices when browsing tech solutions. Blindly relying on email domains causes disastrous routing collisions. Multi-stage identity resolution (fuzzy name matching + enrichment + IP telemetry) correctly attaches high-value leads to existing strategic account owners."
    },
    "quests": [
      {
        "id": "Q30.125",
        "name": "Lead-to-Account Matching Algorithms & String Metrics",
        "type": "Concept",
        "desc": "Analyze string distance metrics (Levenshtein, Jaro-Winkler, Soundex), domain normalization heuristics, and deterministic DAG routing rules for enterprise L2A resolution."
      },
      {
        "id": "Q30.126",
        "name": "The Routing Collision & Duplicate Account Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Audit a database of 20,000 inbound leads; identify 450 enterprise leads that were misrouted to junior reps due to freemail domains and fuzzy name mismatches."
      },
      {
        "id": "Q30.127",
        "name": "Automated L2A Fuzzy Matching & Round-Robin Routing Engine",
        "type": "Mastery Assignment",
        "desc": "Build an L2A resolution microservice in TypeScript: domain parsing, Jaro-Winkler scoring, tie-breaking heuristics, and weighted round-robin distribution."
      },
      {
        "id": "Q30.128",
        "name": "High-Volume Lead Flood & Routing Deadlock Recovery Lab",
        "type": "Production Incident Lab",
        "desc": "Resolve a live crisis during a global marketing event where 15,000 leads/minute caused database lock contention in the CRM routing trigger, deadlocking all inbound processing."
      }
    ]
  },
  {
    "day": 33,
    "month": 2,
    "blockNum": 7,
    "title": "Multi-Touch Sales Cadence Automation & Idempotent Webhook Orchestration",
    "stageNum": 3,
    "stageName": "Stage 3: Systems Stress-Testing",
    "pedagogicalRole": "Sales Engagement Architecture (Automated Cadence Execution, Webhook State Sync & Idempotent Event Delivery)",
    "spokenGoal": "Enterprise sales engagement platforms (Outreach, Salesloft, Apollo) orchestrate thousands of automated touchpoints. Today we engineer cadence automation\u2014building idempotent webhook handlers, multi-channel step scheduling, and automated sequence termination upon prospect reply.",
    "conceptInvariant": "Cadence Idempotency Invariant: Prospect reply detection events must trigger immediate, atomic sequence termination across all parallel channels (email, LinkedIn, SMS, call tasks); duplicate webhook deliveries must never re-trigger automated cold outreach.",
    "failureMode": "The 10-Email Spam Storm Incident: An un-idempotent webhook retry loop delivers the same automated follow-up email 10 times in 2 minutes to a Fortune 500 Chief Information Security Officer; the CISO forwards the emails to their entire network, blacklists the vendor company, and files an FTC CAN-SPAM complaint.",
    "tryItFriction": "Construct a webhook handler for email reply events where network retries from SendGrid/Mailgun trigger duplicate database inserts and un-pause terminated sequences.",
    "socraticHints": [
      "Why is an Idempotency Key (UUID or message hash) strictly required when processing inbound email webhook events?",
      "How does an event-driven architecture ensure that an email reply instantly cancels pending automated LinkedIn connection requests or call tasks?",
      "Build an event-driven sequence state machine supporting time delays, business-hour constraints, and exit conditions."
    ],
    "situationalPuzzle": {
      "scenario": "A prospective enterprise customer replies to Step 2 of an automated sales cadence saying: 'Interested. Let's schedule a call this Thursday.' The reply webhook is fired by the mail server, but due to a 5-second database lock, the reply processing experiences a timeout. A scheduled worker task wakes up 10 seconds later and sends automated Step 3: 'Just bumping this to the top of your inbox since I haven't heard back.'",
      "options": [
        "Ignore the customer's frustration and hope they don't notice the automated email.",
        "Architect an event-driven race-condition shield: 1) Require atomic Redis lock acquisition before any outbound cadence dispatch; 2) Check real-time prospect thread status immediately prior to SMTP transmission; 3) Process inbound reply webhooks via an idempotent message queue (Kafka/RabbitMQ) with sub-second priority.",
        "Shut down all automated sales tools and require reps to write every email manually.",
        "Blame the mail server provider publicly on Twitter."
      ],
      "correctOptionIndex": 1,
      "debrief": "Race conditions between customer replies and automated scheduled dispatches destroy sales credibility. Verifying thread status atomically right before SMTP packet transmission, backed by prioritized idempotent reply queues, guarantees that automated follow-ups are never dispatched to responsive prospects."
    },
    "quests": [
      {
        "id": "Q30.129",
        "name": "Sales Cadence State Machine & Webhook Topology",
        "type": "Concept",
        "desc": "Map out the architecture of multi-touch sales engagement engines: step scheduling, business-hour time zone math, channel orchestration, and reply-detection FSMs."
      },
      {
        "id": "Q30.130",
        "name": "The Un-Idempotent Webhook Spam Loop Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Audit application server logs to diagnose how a missing idempotency check caused 4,000 automated emails to be dispatched to 400 prospects simultaneously."
      },
      {
        "id": "Q30.131",
        "name": "Idempotent Sales Cadence Automation Platform",
        "type": "Mastery Assignment",
        "desc": "Build an enterprise sales cadence engine in TypeScript: multi-channel step scheduling, atomic Redis locks, idempotent webhook handlers, and instant sequence termination."
      },
      {
        "id": "Q30.132",
        "name": "Production Webhook Storm & Unsubscribe Cascade Lab",
        "type": "Production Incident Lab",
        "desc": "Handle a simulated production emergency where an external email gateway malfunctioned, firing 100,000 webhook events in 60 seconds; maintain CRM consistency and zero duplicate sends."
      }
    ]
  },
  {
    "day": 34,
    "month": 2,
    "blockNum": 7,
    "title": "Product-Led Sales (PLS) & Product-Qualified Lead (PQL) Behavioral Telemetry",
    "stageNum": 3,
    "stageName": "Stage 3: Systems Stress-Testing",
    "pedagogicalRole": "Product-Led Sales Architecture (In-Product Telemetry Ingestion, PQL Scoring Models & Reverse ETL to CRM)",
    "spokenGoal": "In the modern SaaS era, software sells itself before sales reps get involved. Today we engineer Product-Led Sales (PLS)\u2014ingesting real-time product usage telemetry, defining Product-Qualified Lead (PQL) activation thresholds, and triggering timely sales interventions via Reverse ETL.",
    "conceptInvariant": "PQL Velocity Invariant: A free or self-serve account transitions into a Product-Qualified Lead (PQL) if and only if usage crosses the 'Aha Moment' activation threshold and organizational workspace expansion reaches enterprise sales velocity gates.",
    "failureMode": "The Blind AE Spamming Active Users: An enterprise AE cold-calls the VP of Data at a target account with a generic pitch deck, completely unaware that 45 engineers at that exact company have been actively using the free tier of the product for 6 months, creating an embarrassing impression of sales incompetence.",
    "tryItFriction": "Construct a PQL scoring pipeline where event count aggregations without unique user deduplication allow a single bot script to artificially inflate product qualification scores.",
    "socraticHints": [
      "What distinguishes an MQL (content download) from a PQL (demonstrated in-product feature usage and collaboration)?",
      "How does Reverse ETL (e.g., Census, Hightouch) sync warehouse product events (Snowflake) into CRM Account objects?",
      "Formulate the PQL scoring algorithm weighting active seats, feature adoption depth, and usage velocity."
    ],
    "situationalPuzzle": {
      "scenario": "A target enterprise account signs up for a free product trial. Within 14 days, telemetry indicates: 1) 35 active seats in the workspace, 2) Workspace admin has invited 5 department heads, 3) Daily API calls have hit 85% of free tier limits, and 4) Three users have clicked on the 'Export Enterprise Security Audit Log' feature which is gated behind the Enterprise plan.",
      "options": [
        "Wait until the free tier limit is reached and automatically lock their account.",
        "Trigger the Product-Led Sales playbook: 1) Score account as high-priority PQL ($Score = 98$); 2) Sync telemetry via Reverse ETL to the assigned Enterprise AE; 3) AE reaches out to the workspace admin offering an enterprise expansion briefing and security architecture review tailored to their exact usage pattern.",
        "Send an automated email asking them to pay $20/month with a credit card.",
        "Downgrade their account to prevent server load."
      ],
      "correctOptionIndex": 1,
      "debrief": "This account exhibits massive Product-Qualified Lead (PQL) signals: viral team expansion, impending quota exhaustion, and explicit intent for enterprise-grade features (security logs). Arming sales reps with this real-time usage telemetry transforms cold outreach into high-conversion consultative expansion."
    },
    "quests": [
      {
        "id": "Q30.133",
        "name": "Product-Led Sales Architecture & Telemetry Taxonomy",
        "type": "Concept",
        "desc": "Map out the full PLS technology stack: Event Telemetry (Segment/Rudderstack), Data Warehouse (Snowflake), Reverse ETL (Census/Hightouch), and CRM PQL scoring models."
      },
      {
        "id": "Q30.134",
        "name": "The Missed Enterprise Expansion Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Analyze 100 historical self-serve customer datasets; uncover 8 mega-accounts that grew to 200+ unassisted seats before churning because sales never noticed their PQL telemetry."
      },
      {
        "id": "Q30.135",
        "name": "Real-Time PQL Scoring & Reverse ETL Pipeline",
        "type": "Mastery Assignment",
        "desc": "Build a real-time event aggregation and PQL scoring service that processes stream events (Kafka), computes account health indices, and pushes scored alerts to CRM webhooks."
      },
      {
        "id": "Q30.136",
        "name": "High-Volume Usage Spike & PQL Outage Lab",
        "type": "Production Incident Lab",
        "desc": "Diagnose an enterprise telemetry pipeline failure where a sudden surge of 50M events/day overwhelmed the warehouse transformation models, halting PQL alerts for 5 days."
      }
    ]
  },
  {
    "day": 35,
    "month": 2,
    "blockNum": 7,
    "title": "Milestone 6: ApexCRM Enterprise Relational Data Model & PQL Telemetry Suite",
    "stageNum": 3,
    "stageName": "Stage 3: Systems Stress-Testing",
    "pedagogicalRole": "Milestone Architectural Synthesis (Integrated CRM Data Modeling, L2A Matching, Cadence Orchestration & PLS Engine)",
    "spokenGoal": "Milestone 6: You will architect and deploy ApexCRM\u2014a unified enterprise revenue operations platform uniting relational CRM object schemas, fuzzy L2A routing DAGs, idempotent cadence execution, and real-time Product-Qualified Lead (PQL) telemetry.",
    "conceptInvariant": "Operational Unification Invariant: ApexCRM must ensure that every inbound prospect, cadence interaction, and in-product telemetry event resolves deterministically to a single canonical Enterprise Account record without data duplication.",
    "failureMode": "Split-brain Revenue Operations: Sales and Product operating on divergent databases, resulting in AEs cold-calling existing active users with outdated pricing while marketing automation emails unassigned leads, creating $3M in lost enterprise deals.",
    "tryItFriction": "Execute the ApexCRM end-to-end integration test suite with high-concurrency event bursts, causing unhandled transaction isolation deadlocks in the account deduplication service.",
    "socraticHints": [
      "How do you ensure transaction isolation when multiple L2A routing requests and PQL telemetry updates touch the same Account record simultaneously?",
      "What automated reconciliation jobs detect and merge duplicate Account entities without data loss?",
      "Architect ApexCRM with decoupled micro-services: Entity Store, Identity Resolver, Cadence Worker, and PLS Stream Consumer."
    ],
    "situationalPuzzle": {
      "scenario": "You are presenting ApexCRM to the Chief Revenue Officer and Chief Technology Officer. The sales reps report that lead response time has dropped from 48 hours to 4 minutes, and PQL-sourced pipeline has increased by 150%. However, the database administrator points out that during peak marketing webinars, concurrent L2A transactions spike database CPU to 95%.",
      "options": [
        "Disable all fuzzy matching and identity resolution algorithms during webinars.",
        "Implement an asynchronous message queue architecture: buffer inbound leads and telemetry events in Kafka/RabbitMQ, process L2A resolution via distributed worker pools with optimistic concurrency control, and maintain sub-minute lead routing latency under zero database strain.",
        "Tell sales reps to stop using the system during webinars.",
        "Purchase 10x larger database instances without optimizing query locking patterns."
      ],
      "correctOptionIndex": 1,
      "debrief": "High-velocity RevOps systems must withstand traffic surges without sacrificing architectural rigor. Decoupling ingestion from processing via asynchronous queues and applying optimistic locking patterns ensures that high-volume marketing surges are processed reliably without CPU exhaustion or data corruption."
    },
    "quests": [
      {
        "id": "Q30.137",
        "name": "ApexCRM System Architecture Specification",
        "type": "Concept",
        "desc": "Author the complete architectural specification for ApexCRM: entity relationship definitions, L2A routing algorithms, cadence state machines, and PQL stream processing."
      },
      {
        "id": "Q30.138",
        "name": "The Multi-Source Data Collision Audit",
        "type": "Detective Challenge",
        "desc": "Audit an integrated dataset of 30,000 CRM records and 500,000 product usage events; identify 250 routing collisions where sales outreach conflicted with in-product trial status."
      },
      {
        "id": "Q30.139",
        "name": "ApexCRM Enterprise Platform Core Implementation",
        "type": "Mastery Assignment",
        "desc": "Build the complete ApexCRM platform in TypeScript/SQL: relational schema, fuzzy L2A resolver, idempotent cadence runner, and PQL telemetry ingestion engine."
      },
      {
        "id": "Q30.140",
        "name": "Black Friday Traffic Surge & CRM Concurrency War Room",
        "type": "Production Incident Lab",
        "desc": "Manage a high-load simulation where 250,000 product events and 20,000 inbound leads hit ApexCRM in 10 minutes; tune concurrency, maintain zero message loss, and route all PQLs."
      }
    ]
  },
  {
    "day": 36,
    "month": 2,
    "blockNum": 8,
    "title": "Post-Sale Handoff & Customer Success Architecture: Accelerating Time-to-Value (TTV)",
    "stageNum": 3,
    "stageName": "Stage 3: Systems Stress-Testing",
    "pedagogicalRole": "Post-Sale Transition Architecture (Sales-to-CS Handoff Protocols, Time-to-Value (TTV) Optimization & Customer Onboarding Governance)",
    "spokenGoal": "The sales team sold the dream; now the Customer Success team must deliver the reality. Today we architect the post-sale handoff\u2014eliminating customer amnesia, aligning implementation milestones, and driving Time-to-Value (TTV) to an absolute minimum.",
    "conceptInvariant": "Handoff Completeness Invariant: A closed-won opportunity cannot transition to active Customer Success onboarding without a signed Sales-to-CS Handoff Document detailing quantified business metrics, key stakeholder profiles, and agreed implementation milestones.",
    "failureMode": "The Onboarding Amnesia Disaster: A $500,000 enterprise deal closes. On the kickoff call, the newly assigned Customer Success Manager asks the customer: 'So, tell us what you bought and what you are trying to achieve!' The customer's VP of IT responds furiously: 'We spent 4 months explaining this to your sales team!' and immediately demands a refund.",
    "tryItFriction": "Run an automated post-sale onboarding workflow where missing technical scope parameters fail to halt kickoff meeting scheduling, resulting in unprepared CSMs.",
    "socraticHints": [
      "Why is Customer Churn overwhelmingly determined during the first 90 days of the onboarding lifecycle?",
      "What structured data must transfer seamlessly from the sales opportunity to the customer success account (use case, success metrics, technical blockers, political landmines)?",
      "Formulate the Time-to-Value (TTV) equation: $TTV = t_{first\\_value} - t_{contract\\_signed}$."
    ],
    "situationalPuzzle": {
      "scenario": "An enterprise SaaS deal closes for $750k. The Account Executive marks the deal 'Closed-Won' and disappears on vacation. Two weeks later, the customer emails the CEO complaining that no one has contacted them, their engineers don't have login credentials, and their target Q1 go-live deadline is already compromised.",
      "options": [
        "Apologize to the customer and tell them the AE will be back in two weeks.",
        "Enforce systematic Post-Sale Governance: 1) Deploy an automated Salesforce trigger that instantly provisions onboarding projects upon Closed-Won; 2) Mandate an internal Sales-to-CS briefing within 24 hours; 3) Host the executive kickoff call within 5 business days, pre-populated with all discovery notes and agreed Mutual Action Plan milestones.",
        "Send the customer a link to self-serve documentation and YouTube tutorials.",
        "Blame the customer for not reaching out to support proactively."
      ],
      "correctOptionIndex": 1,
      "debrief": "Post-sale buyer remorse peaks in the first 14 days after contract signing. The moment a customer signs, the clock on Time-to-Value (TTV) starts ticking. Automated provisioning, mandatory internal handoff briefs within 24 hours, and structured kickoff calls within 5 days eliminate buyer anxiety and cement enterprise trust."
    },
    "quests": [
      {
        "id": "Q30.141",
        "name": "Customer Success Architecture & Time-to-Value Theory",
        "type": "Concept",
        "desc": "Analyze the post-sale customer lifecycle: Time-to-Value (TTV), First Value Milestones, Sales-to-CS Handoff Schemas, and executive sponsorship continuity."
      },
      {
        "id": "Q30.142",
        "name": "The Botched Handoff Churn Forensic Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Audit 15 enterprise churn cases; uncover 7 instances where poor handoffs, dropped technical context, and delayed kickoffs in the first 30 days led directly to contract non-renewal."
      },
      {
        "id": "Q30.143",
        "name": "Automated Sales-to-CS Handoff & Onboarding Engine",
        "type": "Mastery Assignment",
        "desc": "Build an automated post-sale orchestration service that extracts opportunity discovery notes, generates customer onboarding charters, and provisions collaborative tracking portals."
      },
      {
        "id": "Q30.144",
        "name": "Day-14 Post-Sale Executive Escalation Recovery Lab",
        "type": "Production Incident Lab",
        "desc": "Step into a live crisis where a newly signed $1M customer threatens immediate cancellation on Day 14 due to onboarding delays; salvage executive confidence and accelerate time-to-value."
      }
    ]
  },
  {
    "day": 37,
    "month": 2,
    "blockNum": 8,
    "title": "Customer Health Scoring: Multi-Signal Composite Health Matrices & Leading Churn Indicators",
    "stageNum": 3,
    "stageName": "Stage 3: Systems Stress-Testing",
    "pedagogicalRole": "Predictive CS Engineering (Multi-Dimensional Customer Health Scoring, Telemetry Weights & Churn Prediction)",
    "spokenGoal": "When a customer emails you to cancel, they made the decision six months ago. Today we engineer Customer Health Scoring\u2014building multi-signal composite health algorithms that synthesize product usage depth, support ticket sentiment, executive sponsor engagement, and license utilization.",
    "conceptInvariant": "Health Index Invariant: Customer Health Score must be a normalized composite index $H \\in [0, 100]$ computed from independent dimensions (Product Telemetry, Support Sentiment, Relationship Depth, Commercial Hygiene); a catastrophic score ($< 30$) in any single pillar must trigger immediate Red-Account escalation.",
    "failureMode": "The 'Green Account' Blindside Churn: A Customer Success team marks an enterprise account as '100% Healthy (Green)' because the lead user is very friendly on Zoom calls; when renewal arrives, the customer churns because actual telemetry reveals only 5 of 500 licenses were ever activated, resulting in zero business adoption.",
    "tryItFriction": "Execute a customer health calculation script where support ticket volume is treated as positive engagement rather than an indicator of product dissatisfaction.",
    "socraticHints": [
      "Why must health scores incorporate both objective product telemetry (DAU/MAU, feature breadth) and subjective relationship signals (executive sponsor access)?",
      "What leading indicators (drop in weekly logins, change in admin, unanswered QBR requests) predict churn 90\u2013120 days before contract expiry?",
      "Formulate the weighted composite equation: $H = w_1 P_{usage} + w_2 S_{support} + w_3 R_{rel} + w_4 C_{comm}$."
    ],
    "situationalPuzzle": {
      "scenario": "An enterprise account paying $300k/year is rated 'Green' by their CSM because 'they never submit support tickets and the monthly check-in call is always pleasant.' Product telemetry reveals that over the last 60 days, active daily users dropped by 75%, the primary executive sponsor hasn't logged in for 3 months, and average session duration fell to 2 minutes.",
      "options": [
        "Trust the CSM's intuition that the account is perfectly happy.",
        "Override the CSM's rating: classify the account as 'Critical Red' based on behavioral telemetry; immediately notify the VP of Customer Success and deploy a multi-threaded executive intervention to diagnose why user adoption collapsed before the renewal date.",
        "Wait for the annual renewal invoice to see if they pay.",
        "Send the customer an automated marketing survey asking them to rate their satisfaction."
      ],
      "correctOptionIndex": 1,
      "debrief": "Silence from an enterprise customer is rarely golden; it is frequently the sound of disengagement and impending churn. When users stop using the software and stop submitting support tickets, they have abandoned the platform. Objective behavioral telemetry must always override subjective rep optimism."
    },
    "quests": [
      {
        "id": "Q30.145",
        "name": "Customer Health Scoring Mathematics & Telemetry Models",
        "type": "Concept",
        "desc": "Derive the mathematics of multi-dimensional Customer Health Scoring: feature depth, license utilization ratios, ticket sentiment NLP, and executive engagement decay."
      },
      {
        "id": "Q30.146",
        "name": "The Blindside Churn Autopsy Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Audit 20 enterprise accounts that churned unexpectedly; identify the hidden telemetry warning signals present 120 days prior that the CS team failed to interpret."
      },
      {
        "id": "Q30.147",
        "name": "Predictive Customer Health Scoring Engine",
        "type": "Mastery Assignment",
        "desc": "Build an algorithmic Customer Health platform that ingests product usage metrics, support ticket data, and CRM touchpoints, generating composite health scores and automated risk alerts."
      },
      {
        "id": "Q30.148",
        "name": "Critical 'Code Red' Account Intervention Lab",
        "type": "Production Incident Lab",
        "desc": "Lead an emergency Red Account intervention for a $1.2M enterprise customer whose health score plummeted to 24; diagnose the root causes and implement a 30-day turnaround plan."
      }
    ]
  },
  {
    "day": 38,
    "month": 2,
    "blockNum": 8,
    "title": "Scaled Implementation Governance: Professional Services Milestones & SOW Margins",
    "stageNum": 3,
    "stageName": "Stage 3: Systems Stress-Testing",
    "pedagogicalRole": "Professional Services Operations (Implementation SOW Governance, Fixed-Fee vs T&M Risk & Billable Utilization)",
    "spokenGoal": "Enterprise software adoption requires complex implementation. Today we engineer Professional Services governance\u2014managing Statement of Work (SOW) deliverables, mitigating Scope Creep, protecting PS gross margins, and tracking billable utilization.",
    "conceptInvariant": "Implementation Margin Invariant: Fixed-fee Professional Services SOWs must enforce strict change-order governance; unbudgeted out-of-scope customer customization requests without signed change orders violate PS margin floors ($> 40\\%$).",
    "failureMode": "The Fixed-Fee Scope Creep Bankruptcy: A services team agrees to a $100,000 fixed-fee implementation. The customer continuously demands custom data migrations and bespoke reports; the project drags on for 14 months, burning $350,000 in engineering labor and destroying departmental profitability.",
    "tryItFriction": "Run a Professional Services project tracking script where change-order hour allocations are merged directly into baseline project hours without adjusting the customer billing cap.",
    "socraticHints": [
      "What is the operational risk profile of Fixed-Fee vs Time-and-Materials (T&M) professional services engagements?",
      "How do you formulate a watertight Change Order process when customer requirements deviate from the original SOW?",
      "Calculate billable utilization rate: $Utilization = \\frac{Billable\\_Hours}{Total\\_Available\\_Hours}$ and analyze its impact on services gross margin."
    ],
    "situationalPuzzle": {
      "scenario": "During Month 2 of a $150,000 fixed-fee enterprise implementation, the client's project lead demands: 'We need you to build custom ETL pipelines to migrate 10 years of unstructured legacy customer data from our decommissioned Oracle database.' This work was explicitly listed as 'Customer Responsibility' in the signed SOW.",
      "options": [
        "Build the custom ETL pipelines for free to keep the customer happy.",
        "Execute the formal Change Order governance: politely present the signed SOW boundary, explain that custom legacy ETL requires dedicated data engineering resources, and issue a formal Change Order adding 120 consulting hours at $250/hour ($30,000) with a 3-week milestone extension.",
        "Refuse to talk to the client and halt all implementation work immediately.",
        "Tell the client to migrate their own data using Excel spreadsheets."
      ],
      "correctOptionIndex": 1,
      "debrief": "Professional services teams are not free engineering resources. When customers request out-of-scope work, yielding without a change order trains the customer to demand endless free labor, ballooning delivery costs and delaying go-live. Professional Change Order governance protects project scope, delivery timelines, and services gross margins."
    },
    "quests": [
      {
        "id": "Q30.149",
        "name": "Professional Services Economics & SOW Governance",
        "type": "Concept",
        "desc": "Map out the operational economics of enterprise professional services: Fixed-Fee vs T&M, blended billing rates, billable utilization modeling, and change-order mechanics."
      },
      {
        "id": "Q30.150",
        "name": "The Unbilled Scope Creep Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Audit 10 enterprise implementation projects; uncover 4 projects that experienced $> 100\\%$ budget overruns due to informal rep commitments and unbilled customization requests."
      },
      {
        "id": "Q30.151",
        "name": "Professional Services SOW & Change Order Management Engine",
        "type": "Mastery Assignment",
        "desc": "Build an implementation project tracking platform that monitors milestone burndown, calculates real-time billable utilization, and flags scope deviation for automated Change Orders."
      },
      {
        "id": "Q30.152",
        "name": "High-Stakes Implementation Scope Dispute War Room",
        "type": "Production Incident Lab",
        "desc": "Resolve a high-tension implementation dispute where a client's project sponsor refuses to sign off on a go-live milestone, claiming missing features; negotiate a resolution."
      }
    ]
  },
  {
    "day": 39,
    "month": 2,
    "blockNum": 8,
    "title": "Executive Business Reviews (QBR) & Value Realization: The Realized ROI Ledger",
    "stageNum": 3,
    "stageName": "Stage 3: Systems Stress-Testing",
    "pedagogicalRole": "Strategic Customer Governance (Quarterly Business Reviews (QBR), Value Realization Ledgers & Executive Alignment)",
    "spokenGoal": "A Quarterly Business Review (QBR) is not a product support recap\u2014it is an executive commercial alignment meeting. Today we engineer Executive Business Reviews, presenting the Realized ROI Ledger to prove that our software delivered the financial promises made during the sales cycle.",
    "conceptInvariant": "Value Realization Invariant: An Executive Business Review must center on verified customer business outcomes achieved (cost avoided, revenue gained, risk mitigated) measured against initial baseline metrics; reviewing feature usage or ticket counts is strictly prohibited in executive QBRs.",
    "failureMode": "The 40-Slide Ticket Status QBR Disappointment: A CSM hosts an executive QBR with an enterprise CIO. The CSM presents 40 slides showing support ticket resolution times and product feature release notes. The CIO looks at their watch, says 'My team can read this in an email,' leaves after 15 minutes, and declines all future QBRs.",
    "tryItFriction": "Construct a QBR slide generation script that defaults to displaying raw platform login statistics when customer-validated financial outcome data is missing.",
    "socraticHints": [
      "Why do enterprise executives attend QBRs (strategic industry alignment, peer benchmarking, ROI validation) versus why they avoid them (operational status updates)?",
      "How do you co-author the Realized ROI Ledger with your internal customer champion before presenting it to the Economic Buyer?",
      "Structure an executive QBR agenda: 1) Executive Summary & Verified ROI, 2) Strategic Roadmap Alignment, 3) Joint Initiatives for Next Quarter."
    ],
    "situationalPuzzle": {
      "scenario": "You are preparing a QBR for the Chief Information Officer of a global logistics enterprise. Nine months ago, sales promised that your software would reduce shipment tracking latency by 80% and save $450,000 annually. Telemetry proves tracking latency was indeed reduced by 82%, and client logistics leads confirmed $510,000 in saved contractor costs.",
      "options": [
        "Spend the first 45 minutes of the meeting demonstrating newly released product buttons and settings.",
        "Structure the QBR around the Realized ROI Ledger: open with a 1-page executive briefing co-presented with the internal logistics director validating the $510,000 in audited savings, benchmark their performance against industry peers, and present a joint strategic initiative to expand tracking into air freight for next quarter.",
        "Send the CIO a generic satisfaction survey and cancel the QBR.",
        "Demand an immediate contract expansion before discussing any achieved results."
      ],
      "correctOptionIndex": 1,
      "debrief": "Executives care about business impact, not software mechanics. Presenting an audited Realized ROI Ledger that proves the software exceeded promised financial returns earns immense executive respect. It transforms the vendor from an operational tool into an indispensable strategic partner, paving the way for seamless renewals and multi-million-dollar expansions."
    },
    "quests": [
      {
        "id": "Q30.153",
        "name": "Executive QBR Choreography & Realized ROI Framework",
        "type": "Concept",
        "desc": "Map out the strategic architecture of executive QBRs: outcome-based agendas, baseline vs realized metrics, peer benchmarking models, and forward-looking strategic roadmaps."
      },
      {
        "id": "Q30.154",
        "name": "The Operational Status Trap QBR Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Review video recordings and slide decks from 10 failed QBRs; identify why executive sponsors stopped attending and pinpoint the exact transition from strategic value to mundane support."
      },
      {
        "id": "Q30.155",
        "name": "Automated Realized ROI Ledger & QBR Presentation Generator",
        "type": "Mastery Assignment",
        "desc": "Build an automated platform that continuously calculates realized financial customer value from telemetry data, compares against initial sales commitments, and exports executive QBR decks."
      },
      {
        "id": "Q30.156",
        "name": "Hostile Executive QBR Value Justification Defense Lab",
        "type": "Production Incident Lab",
        "desc": "Lead an intense live QBR with a skeptical enterprise CFO who challenges whether your software actually drove the recorded efficiency gains; defend the realized ROI ledger."
      }
    ]
  },
  {
    "day": 40,
    "month": 2,
    "blockNum": 8,
    "title": "Milestone 7: ApexSuccess Customer Health & Churn Rescue Engine",
    "stageNum": 3,
    "stageName": "Stage 3: Systems Stress-Testing",
    "pedagogicalRole": "Milestone Architectural Synthesis (Integrated Customer Health Scoring, Onboarding Governance & Churn Rescue Suite)",
    "spokenGoal": "Milestone 7: You will architect and deploy ApexSuccess\u2014an enterprise Customer Success platform uniting post-sale onboarding workflows, multi-dimensional health scoring algorithms, Realized ROI Ledgers, and automated Churn Rescue playbooks.",
    "conceptInvariant": "Customer Retention Invariant: ApexSuccess must automatically identify at-risk enterprise accounts $\\ge 90$ days prior to renewal and enforce mandatory executive intervention workflows before contract expiration.",
    "failureMode": "Silent Mega-Churn Blindside: ApexSuccess health scoring failure allows a $1.8M tier-1 account to drift from Green to Churned without triggering a Red-Account alert, causing the company to miss its Net Retention Rate (NRR) targets by 12%.",
    "tryItFriction": "Execute the ApexSuccess automated escalation engine with unnormalized sentiment weights, resulting in false-positive emergency alerts for hundreds of healthy accounts.",
    "socraticHints": [
      "How do you establish early warning trigger thresholds that give CS teams sufficient lead time (90\u2013120 days) to turn around failing accounts?",
      "What automated playbooks should execute when an executive sponsor leaves or active usage drops below baseline thresholds?",
      "Architect ApexSuccess with clean micro-service boundaries: Telemetry Consumer, Health Scorer, QBR Engine, and Rescue Orchestrator."
    ],
    "situationalPuzzle": {
      "scenario": "You are presenting ApexSuccess to the Chief Customer Officer and Chief Revenue Officer. The engine detects that a $900k account has slipped into 'High Risk' status 110 days before renewal due to a 40% decline in query volume and an unanswered QBR invitation. The assigned CSM insists the account is fine because they spoke to a mid-level analyst last week.",
      "options": [
        "Override the automated alert and trust the CSM's optimistic verbal assessment.",
        "Trigger the ApexSuccess Automated Churn Rescue Playbook: 1) Elevate account to Executive Watchlist; 2) Mandate an immediate multi-threaded alignment call between your VP of CS and the customer's VP of Infrastructure; 3) Dispatch a Solution Architect to conduct a complimentary architectural review and resolve operational bottlenecks.",
        "Send an automated email to the customer offering a 50% renewal discount immediately.",
        "Wait until 10 days before renewal to see if the customer sends an RFP."
      ],
      "correctOptionIndex": 1,
      "debrief": "Never allow human wishful thinking to override empirical telemetry warnings. Deploying executive sponsorship and complimentary technical architecture resources 110 days before renewal gives the organization ample time to uncover hidden dissatisfaction, fix underlying bottlenecks, and restore account health before the contract decision is locked."
    },
    "quests": [
      {
        "id": "Q30.157",
        "name": "ApexSuccess Architectural Specification",
        "type": "Concept",
        "desc": "Author the complete system specification for ApexSuccess: health scoring formulas, onboarding workflow schemas, Realized ROI calculations, and Churn Rescue state machines."
      },
      {
        "id": "Q30.158",
        "name": "The Miscalculated Customer Health Audit",
        "type": "Detective Challenge",
        "desc": "Audit an enterprise customer database of 2,000 accounts; identify 45 at-risk accounts whose health scores were artificially inflated by flawed activity weighting."
      },
      {
        "id": "Q30.159",
        "name": "ApexSuccess Platform Core Implementation",
        "type": "Mastery Assignment",
        "desc": "Build the complete ApexSuccess platform in TypeScript/Python: telemetry ingestion, composite health index calculation, automated QBR report generation, and Churn Rescue workflows."
      },
      {
        "id": "Q30.160",
        "name": "Live At-Risk $2M Enterprise Account Rescue War Room",
        "type": "Production Incident Lab",
        "desc": "Lead a live simulated intervention for a Fortune 500 account threatening immediate termination due to accumulated technical debt; execute the rescue playbook and secure renewal."
      }
    ]
  },
  {
    "day": 41,
    "month": 2,
    "blockNum": 9,
    "title": "Net Retention Rate (NRR) & Gross Retention Rate (GRR) Calculus",
    "stageNum": 4,
    "stageName": "Stage 4: Global Scale & RevOps Architecture",
    "pedagogicalRole": "Retention Economics (NRR vs GRR Mathematics, Cohort Retention Curves & Valuation Multiplier Impact)",
    "spokenGoal": "In enterprise SaaS, growth is an illusion if your bucket is leaking. Today we master the core financial physics of software valuation: Net Retention Rate (NRR) and Gross Retention Rate (GRR), deconstructing cohort retention curves and their impact on enterprise multiples.",
    "conceptInvariant": "Retention Calculus Invariant: Gross Retention Rate ($GRR = \\frac{Starting\\_ARR - Churn - Contraction}{Starting\\_ARR}$) cannot exceed 100\\%, while Net Retention Rate ($NRR = \\frac{Starting\\_ARR - Churn - Contraction + Expansion}{Starting\\_ARR}$) must exceed 120\\% for elite enterprise software companies.",
    "failureMode": "The Hidden Churn Valuation Collapse: A SaaS startup reports 130% ARR growth and raises capital at a high valuation. A private equity audit reveals that GRR was only 65%\u2014the company was losing 35% of existing revenue each year and masking the loss through hyper-aggressive new acquisition spend; valuation is slashed by 70%.",
    "tryItFriction": "Construct a cohort retention calculation script where expansion revenue is mistakenly included in the Gross Retention Rate numerator, producing impossible GRR values of 115%.",
    "socraticHints": [
      "Why is GRR the truest measure of product-market fit (measuring how well you retain existing dollars without expansion)?",
      "Why do public software markets reward companies with $> 125\\%$ NRR with 3x higher enterprise value to revenue multiples?",
      "Formulate the mathematical cohort decay model projecting 5-year customer revenue trajectories."
    ],
    "situationalPuzzle": {
      "scenario": "Your enterprise software company begins the year with $10,000,000 in Annual Recurring Revenue (ARR). Over the year: 1) $500,000 in ARR churns completely, 2) $300,000 in ARR contracts due to seat reductions, 3) Existing customers expand by $2,000,000 in new licenses, and 4) New customers add $3,000,000 in new ARR. What are your GRR and NRR?",
      "options": [
        "GRR = 112%, NRR = 142%",
        "GRR = 92% ($10M - $0.5M - $0.3M / $10M$), NRR = 112% ($10M - $0.8M + $2M / $10M$)",
        "GRR = 95%, NRR = 130%",
        "GRR = 80%, NRR = 100%"
      ],
      "correctOptionIndex": 1,
      "debrief": "Gross Retention Rate measures the percentage of recurring revenue retained from existing customers excluding expansion: $\\frac{10M - 0.5M - 0.3M}{10M} = 92\\%$. Net Retention Rate includes expansion revenue: $\\frac{10M - 0.8M + 2.0M}{10M} = 112\\%$. Top enterprise software firms maintain $GRR \\ge 90\\%$ and $NRR \\ge 120\\%$, demonstrating that expansion within healthy customers outpaces contraction and churn."
    },
    "quests": [
      {
        "id": "Q30.161",
        "name": "Retention Mathematics: NRR, GRR & Cohort Decay",
        "type": "Concept",
        "desc": "Formalize the financial formulas of retention: Gross Retention Rate (GRR), Net Retention Rate (NRR), Logo Churn, Net Dollar Retention curves, and enterprise valuation multipliers."
      },
      {
        "id": "Q30.162",
        "name": "The Masked Churn Due Diligence Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Audit the 3-year financial ledgers of an acquisition target; identify how aggressive new logo growth masked an alarming collapse in GRR from 94% down to 68%."
      },
      {
        "id": "Q30.163",
        "name": "Cohort Retention & NRR/GRR Analytics Platform",
        "type": "Mastery Assignment",
        "desc": "Build an enterprise cohort analytics engine in TypeScript/Python: monthly cohort revenue tracking, heatmaps, automatic NRR/GRR calculations, and multi-year projections."
      },
      {
        "id": "Q30.164",
        "name": "Board-Level NRR Restoration Crisis Lab",
        "type": "Production Incident Lab",
        "desc": "Respond to a board mandate when company NRR drops from 125% to 104% over two quarters; analyze segment losses and present a data-driven account expansion turnaround plan."
      }
    ]
  },
  {
    "day": 42,
    "month": 2,
    "blockNum": 9,
    "title": "Land-and-Expand Account Growth Models & White-Space Cross-Selling",
    "stageNum": 4,
    "stageName": "Stage 4: Global Scale & RevOps Architecture",
    "pedagogicalRole": "Account Expansion Engineering (Land-and-Expand Playbooks, White-Space Opportunity Matrix & Cross-Selling DAGs)",
    "spokenGoal": "Enterprise sales does not end at initial signature\u2014the first contract is merely a beachhead. Today we engineer Land-and-Expand growth models, building white-space account matrices to systematically cross-sell additional product modules and expand across departmental business units.",
    "conceptInvariant": "Expansion Timing Invariant: An expansion or cross-sell proposal must not be initiated until the customer has verified first-value realization on their initial purchase (Health Score $\\ge 80$, onboarding completed).",
    "failureMode": "The Premature Upsell Disaster: An account executive pitches a $500,000 multi-module add-on to an enterprise customer whose primary implementation is 3 months behind schedule and completely non-functional; the customer's CIO reacts with fury, freezing all vendor spending.",
    "tryItFriction": "Build an account white-space mapping tool where cross-sell opportunity recommendations ignore product dependency prerequisites (e.g., recommending Advanced Analytics module without base Platform).",
    "socraticHints": [
      "Why is the Customer Acquisition Cost (CAC) of expansion revenue typically 70\u201380% lower than the CAC of acquiring new logos?",
      "How do you construct a White-Space Matrix mapping customer departments/subsidiaries against your product portfolio?",
      "Design an automated trigger that alerts account teams when a client reaches 90% license capacity."
    ],
    "situationalPuzzle": {
      "scenario": "A Fortune 100 enterprise landed with an initial $80,000 pilot contract for your developer observability tool in their mobile team 6 months ago. The mobile team's adoption is soaring (Health Score = 92). The enterprise has 14 other engineering divisions (Cloud, Payments, Fraud, Core Banking) comprising 5,000 potential developer seats.",
      "options": [
        "Wait for the annual renewal in 6 months before asking for more business.",
        "Execute the Land-and-Expand playbook: 1) Partner with the mobile team champion to document a compelling internal case study and ROI proof; 2) Host a joint internal 'Tech Lunch & Learn' showcasing their success; 3) Present an Enterprise License Agreement (ELA) to the VP of Infrastructure to expand observability across all 14 divisions, growing the account from $80k to $1.2M.",
        "Immediately send an invoice for $1.2M to the customer's finance department.",
        "Cold-call junior engineers in the payments team without telling the mobile champion."
      ],
      "correctOptionIndex": 1,
      "debrief": "The power of the Land-and-Expand model lies in internal social proof. Once an initial division achieves outstanding success, their metrics and advocacy provide an unassailable justification for senior leadership to standardize the solution across the entire enterprise. Turning internal champions into co-advocates drives exponential account growth."
    },
    "quests": [
      {
        "id": "Q30.165",
        "name": "Land-and-Expand Economics & Account Expansion Topology",
        "type": "Concept",
        "desc": "Analyze the mechanics of account expansion: Enterprise License Agreements (ELAs), seat expansion vs module cross-selling, departmental land strategies, and expansion CAC physics."
      },
      {
        "id": "Q30.166",
        "name": "The Stagnant Beachhead Account Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Audit 50 enterprise accounts that remained stuck at $< $50k initial spend for $> 2$ years; identify why sales teams failed to expand into addressable corporate white space."
      },
      {
        "id": "Q30.167",
        "name": "Enterprise White-Space Matrix & Expansion Opportunity Engine",
        "type": "Mastery Assignment",
        "desc": "Build an automated White-Space analytics platform that visualizes customer organizational hierarchies, identifies unpenetrated departments, and generates targeted cross-sell playbooks."
      },
      {
        "id": "Q30.168",
        "name": "Mega-Account $5M Enterprise License Agreement (ELA) Lab",
        "type": "Production Incident Lab",
        "desc": "Negotiate a massive Enterprise License Agreement consolidation with a global conglomerate, rolling up 12 fragmented departmental subscriptions into a single $5M multi-year contract."
      }
    ]
  },
  {
    "day": 43,
    "month": 2,
    "blockNum": 9,
    "title": "Price Uplift Negotiations & Annual CPI Adjustment Clauses",
    "stageNum": 4,
    "stageName": "Stage 4: Global Scale & RevOps Architecture",
    "pedagogicalRole": "Contract Commercial Engineering (Annual Price Uplift Mechanisms, Consumer Price Index (CPI) Pegs & Renewal Negotiations)",
    "spokenGoal": "If your contract doesn't include an annual price uplift clause, inflation is quietly eroding your software margins every year. Today we engineer annual price adjustments\u2014embedding contractual CPI uplift clauses, negotiating renewal price hikes, and defending contract value.",
    "conceptInvariant": "Price Protection Invariant: Enterprise contracts must incorporate an annual renewal price uplift clause pegged to the Consumer Price Index (CPI) or a fixed floor ($\\ge 5\\%$) to preserve real gross margins against operational inflation.",
    "failureMode": "The 10-Year Fixed-Price Erosion Catastrophe: An enterprise software vendor signs a 5-year contract with a flat price and unconstrained renewal price caps. Over 5 years of high inflation, cloud hosting and engineering labor costs rise 45%, turning a once-profitable $1M account into a net cash-loss contract.",
    "tryItFriction": "Run a renewal contract calculator where annual compounding percentage price uplifts are erroneously calculated as simple interest, shorting long-term revenue.",
    "socraticHints": [
      "What is standard enterprise contract language for annual price adjustments (e.g., 'Prices shall increase by the greater of 5% or the Consumer Price Index (CPI-U) upon each annual renewal')?",
      "How do you negotiate against procurement clauses demanding 'Zero price increases for the lifetime of the software'?",
      "Structure a value-based defense script when enterprise customers push back against standard annual price adjustments."
    ],
    "situationalPuzzle": {
      "scenario": "A 3-year enterprise software contract paying $250,000/year is approaching its annual renewal. The contract contains a valid clause: 'Fees shall increase by 6% upon each anniversary.' Procurement sends an email stating: 'Due to corporate cost-cutting, we reject the 6% price increase and demand that pricing remain flat, or we will review alternatives.'",
      "options": [
        "Immediately capitulate and remove the price increase to avoid any conflict.",
        "Defend the contract value: 1) Reaffirm the contractual agreement and highlight that the 6% uplift funds continuous product development, citing 14 major platform enhancements and security upgrades delivered this past year; 2) Present the Realized ROI Ledger showing $800k in value delivered; 3) Offer an operational trade-off: if they commit to a 2-year contract extension, offer to cap the second year's increase at 3%.",
        "Threaten to immediately shut off the customer's software access tomorrow morning.",
        "Send an invoice with a 20% price increase out of spite."
      ],
      "correctOptionIndex": 1,
      "debrief": "Procurement routinely challenges contractual price uplifts as standard procedure. Immediately surrendering trains procurement to challenge all future terms. Re-anchoring on continuous product enhancements delivered, validating realized ROI, and offering long-term term extensions in exchange for rate compromises preserves pricing power and contractual integrity."
    },
    "quests": [
      {
        "id": "Q30.169",
        "name": "Contractual Price Uplift Architecture & Inflation Physics",
        "type": "Concept",
        "desc": "Analyze the legal and economic mechanics of price adjustment clauses: CPI pegs, fixed percentage floors, renewal notice windows, and margin erosion physics."
      },
      {
        "id": "Q30.170",
        "name": "The Flat-Pricing Margin Deficit Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Audit a cohort of 40 multi-year contracts executed during a low-inflation era; calculate the cumulative $3.2M margin loss caused by missing or waived price uplift clauses."
      },
      {
        "id": "Q30.171",
        "name": "Automated Price Uplift & Renewal Notice Engine",
        "type": "Mastery Assignment",
        "desc": "Build an automated contract renewal service that tracks upcoming renewal windows, calculates applicable CPI/contractual uplifts, and generates automated formal notification letters."
      },
      {
        "id": "Q30.172",
        "name": "Hostile Procurement Renewal Uplift Negotiation Lab",
        "type": "Production Incident Lab",
        "desc": "Navigate an aggressive renewal negotiation where an enterprise procurement director demands a 15% price cut on a $1M contract; defend the 7% contractual uplift and secure renewal."
      }
    ]
  },
  {
    "day": 44,
    "month": 2,
    "blockNum": 9,
    "title": "Customer Advocacy Programs, References & NPS/CSAT Statistical Validity",
    "stageNum": 4,
    "stageName": "Stage 4: Global Scale & RevOps Architecture",
    "pedagogicalRole": "Customer Advocacy Architecture (Net Promoter Score (NPS) Statistical Rigor, CSAT Surveys & Customer Reference Pools)",
    "spokenGoal": "Happy enterprise customers are your most lethal sales weapon. Today we engineer Customer Advocacy Architecture\u2014building statistically valid Net Promoter Score (NPS) and CSAT feedback loops, reference exchange programs, and contractual case study commitments.",
    "conceptInvariant": "Advocacy Governance Invariant: Customer reference requests must be managed through an automated reference pool with strict frequency caps ($\\le 1$ reference call per quarter per customer) to prevent advocate burnout.",
    "failureMode": "The Burned Advocate Revolt: An eager enterprise sales team gives the contact info of their favorite customer CIO to 12 prospective enterprise buyers in one month; the exhausted CIO sends an angry email stating: 'I run a company, I am not your unpaid sales rep!' and refuses all future references.",
    "tryItFriction": "Construct an NPS survey calculation script where neutral passive ratings (7\u20138) are erroneously counted as detractors, skewing the overall score into negative territory.",
    "socraticHints": [
      "How is Net Promoter Score calculated mathematically ($NPS = \\%Promoters (9-10) - \\%Detractors (0-6)$), and why are passives (7-8) excluded from the percentage difference?",
      "What incentives (advisory board seats, roadmap influence, conference speaking slots) motivate enterprise executives to participate in public case studies?",
      "Design an automated reference exchange ledger that balances reference supply and demand."
    ],
    "situationalPuzzle": {
      "scenario": "A high-stakes $1.5M enterprise prospect demands a reference call with an existing Fortune 500 customer in the exact same industry before signing. Your top enterprise reference has already completed two reference calls this month for other reps.",
      "options": [
        "Give the prospect the customer's personal cell phone number without asking.",
        "Enforce reference pool governance: 1) Protect your top reference from fatigue; 2) Review the centralized reference ledger to select an alternative qualified customer advocate who has had zero reference calls this quarter; 3) If the specific reference is non-negotiable, request permission with an executive peer-to-peer brief and offer an executive perk (e.g., roadmap advisory invitation).",
        "Tell the prospect that customer references are against corporate policy.",
        "Hire an actor to pretend to be a satisfied enterprise customer on the phone."
      ],
      "correctOptionIndex": 1,
      "debrief": "Customer references are invaluable assets that require active governance. Overusing a small handful of enthusiastic advocates causes rapid reference fatigue and damages vital executive relationships. A centralized reference management engine tracks reference frequency, caps usage, and ensures equitable rotation across a broad pool of satisfied clients."
    },
    "quests": [
      {
        "id": "Q30.173",
        "name": "NPS/CSAT Statistical Methodology & Advocacy Economics",
        "type": "Concept",
        "desc": "Analyze the mathematics and methodology of customer sentiment: Net Promoter Score (NPS), Customer Satisfaction (CSAT), Customer Effort Score (CES), and reference attribution value."
      },
      {
        "id": "Q30.174",
        "name": "The Burned Customer Reference Pool Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Audit reference request logs across 30 enterprise accounts; identify 4 major enterprise advocates who became detractors due to unmonitored sales rep reference fatigue."
      },
      {
        "id": "Q30.175",
        "name": "Enterprise Reference Management & Advocacy Ledger",
        "type": "Mastery Assignment",
        "desc": "Build an automated Customer Reference Management platform: reference request routing, frequency cap enforcement, industry matching, and advocate reward tracking."
      },
      {
        "id": "Q30.176",
        "name": "Live Crisis Reference Call Salvage Lab",
        "type": "Production Incident Lab",
        "desc": "Handle a simulated live reference call where an existing customer advocate unexpectedly mentions a past system bug to an enterprise prospect; facilitate a graceful recovery that closes the deal."
      }
    ]
  },
  {
    "day": 45,
    "month": 2,
    "blockNum": 9,
    "title": "Milestone 8: ApexExpansion NRR Optimization & Account Growth Suite",
    "stageNum": 4,
    "stageName": "Stage 4: Global Scale & RevOps Architecture",
    "pedagogicalRole": "Milestone Architectural Synthesis (Integrated NRR/GRR Analytics, White-Space Cross-Sell & Customer Advocacy Suite)",
    "spokenGoal": "Milestone 8: You will architect and deploy ApexExpansion\u2014an enterprise account expansion and retention engine uniting cohort NRR/GRR analytics, white-space cross-selling matrices, automated price uplift calculators, and centralized customer reference governance.",
    "conceptInvariant": "Expansion Integrity Invariant: ApexExpansion must ensure that every account expansion recommendation is mathematically validated by positive customer health telemetry and historical contract compliance.",
    "failureMode": "Hostile Account Upsell Outage: ApexExpansion automated recommendation engine triggers an aggressive cross-sell campaign to 50 accounts currently experiencing critical open P1 support outages, causing massive executive customer backlash.",
    "tryItFriction": "Execute the ApexExpansion recommendation pipeline when support ticket severity inputs are missing, causing active P1 outages to be ignored during expansion readiness checks.",
    "socraticHints": [
      "How does ApexExpansion establish an automated 'Expansion Readiness Gate' based on health scores, open support tickets, and realized ROI?",
      "What algorithms optimize white-space product recommendations based on peer customer industry clusters?",
      "Architect ApexExpansion with modular architecture: Cohort Engine, White-Space Mapper, Price Uplift Scheduler, and Advocacy Manager."
    ],
    "situationalPuzzle": {
      "scenario": "You are presenting ApexExpansion to the Chief Revenue Officer and Chief Customer Officer. The engine demonstrates that targeting expansion solely to accounts with Health Scores $> 85$ and zero open P1/P2 tickets increases cross-sell win rates from 22% to 64% while reducing account executive cycle times by half. However, an Enterprise AE complains that they want to pitch add-ons to an unhealthy account because their quota is behind.",
      "options": [
        "Disable the expansion gate for that AE so they can attempt the pitch.",
        "Enforce the architectural gate: demonstrate that pitching expansion to an unhealthy customer damages enterprise credibility, accelerates churn risk, and wastes AE capacity; require the AE to collaborate with Customer Success to resolve health bottlenecks first.",
        "Fire the AE immediately for complaining.",
        "Allow all reps to bypass all gates at end of quarter."
      ],
      "correctOptionIndex": 1,
      "debrief": "Pitching software expansion to an unhappy customer struggling with product issues is tone-deaf and often triggers immediate contract cancellation. Systemic governance that restricts expansion outreach to proven, healthy accounts protects corporate credibility, maximizes sales efficiency, and drives durable Net Retention Rate (NRR) expansion."
    },
    "quests": [
      {
        "id": "Q30.177",
        "name": "ApexExpansion System Architecture Specification",
        "type": "Concept",
        "desc": "Author the complete system specification for ApexExpansion: cohort retention calculation algorithms, white-space mapping schemas, price uplift scheduling, and advocacy ledger."
      },
      {
        "id": "Q30.178",
        "name": "The Flawed Expansion Readiness Audit",
        "type": "Detective Challenge",
        "desc": "Audit 500 account expansion pitches across an enterprise sales force; identify 65 premature pitches made to accounts suffering from unaddressed operational outages."
      },
      {
        "id": "Q30.179",
        "name": "ApexExpansion Platform Core Implementation",
        "type": "Mastery Assignment",
        "desc": "Build the complete ApexExpansion platform in TypeScript/Python: cohort NRR/GRR tracking, white-space cross-sell recommendation engine, automated price uplift notices, and reference pool manager."
      },
      {
        "id": "Q30.180",
        "name": "Global Enterprise NRR Turnaround War Room",
        "type": "Production Incident Lab",
        "desc": "Execute a high-stakes NRR turnaround strategy for an enterprise portfolio of 50 accounts totaling $25M ARR; deploy targeted expansion and rescue playbooks to drive NRR from 102% to 122%."
      }
    ]
  }
]
