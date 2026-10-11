# scripts/visuals/generate_sales_crm_m1.py
"""
Generator script for Course 30: Enterprise B2B Sales, Customer Success & CRM Systems Architecture (course-sales-crm-success / course-bcom-sales-crm)
Month 1: Days 1 to 15 (60 Quests).
Conforms strictly to the Gate v2 / True 9.8 Pedagogical Standard:
- Exact 3-Tier Socratic Hint Ladder (Tier 1: Socratic Question, Tier 2: Conceptual Guidance, Tier 3: Concrete Solution/Formula)
- Situational Production Puzzle (with 4 options and detailed debrief)
- Exactly 4 Quests per day (Concept, Detective Challenge, Mastery Assignment, Production Incident Lab)
- Real 3 AM Production Incident Failure Modes
- TryIt Live Friction Challenges with reproduction bugs
- Zero markdown backticks inside strings (using HTML <code>...</code> tags)
"""

import json
from pathlib import Path

days_data = [
    {
        "day": 1,
        "month": 1,
        "blockNum": 1,
        "title": "Enterprise B2B Sales Pipeline Topology & Opportunity FSM",
        "stageNum": 1,
        "stageName": "Stage 1: Mental Model Grounding",
        "pedagogicalRole": "Foundational Pipeline Architecture (Pipeline Stages, Stage Exit Criteria & Atomic State Transitions)",
        "spokenGoal": "Look, pipeline management isn't wishful thinking in an Excel sheet. We are building a deterministic finite state machine where deals don't advance because an account executive feels good—they advance only when verifiable customer commitments pass strict exit gates.",
        "conceptInvariant": "Pipeline Health Invariant: A deal stage transition is valid if and only if verifiable external customer commitment artifacts exist for every prerequisite exit criterion; internal seller activity never qualifies stage promotion.",
        "failureMode": "End-of-quarter pipeline collapse: An AE marks $3.2M in opportunities as 'Commit' based on verbal enthusiasm; when procurement is contacted at 3 AM on the 30th, no MSA redlines exist, zero legal review has occurred, and 85% of forecasted revenue evaporates overnight.",
        "tryItFriction": "Simulate opportunity progression in a pipeline validator script where moving from Stage 2 (Discovery) to Stage 3 (Solution Validation) succeeds even when the customer confirmation memo field is null.",
        "socraticHints": [
            "What distinguishes an internal seller milestone (e.g., 'Sent presentation') from an external customer commitment (e.g., 'Customer confirmed business case in writing')?",
            "If an opportunity advances without verifiable customer proof, what mathematical distortion occurs to the weighted pipeline forecast?",
            "Implement a strict state machine validator requiring customer-signed artifact hashes before allowing the opportunity state enum to increment."
        ],
        "situationalPuzzle": {
            "scenario": "An enterprise sales rep reports a $750,000 deal in Stage 4 ('Executive Presentation Done') and insists on forecasting it for this month because the VP of Engineering loves the product demo. However, the Chief Information Security Officer (CISO) and Procurement Director have not attended any meetings and no Mutual Action Plan exists.",
            "options": [
                "Mark the deal as Commit in the CRM because the VP of Engineering is the primary technical sponsor and budget owner.",
                "Downgrade the opportunity to Stage 2 (Discovery) until a multi-stakeholder meeting with the Economic Buyer and Procurement is executed and a signed Mutual Action Plan is established.",
                "Leave the deal in Stage 4 but apply a 50% discount to the opportunity amount to balance the risk.",
                "Send an immediate contract with a 20% end-of-month discount to force the VP of Engineering to sign unilaterally."
            ],
            "correctOptionIndex": 1,
            "debrief": "In enterprise B2B sales, technical champions cannot unilaterally bind corporations. Without engagement from the Economic Buyer (with budget authority) and Legal/Procurement, forecasting the deal as late-stage creates false pipeline toxicity. The deal must be gated at Discovery until multi-threading and mutual commitments are verified."
        },
        "quests": [
            {
                "id": "Q30.1",
                "name": "Pipeline Stage Taxonomy & Verifiable Exit Gates",
                "type": "Concept",
                "desc": "Define the 6 canonical enterprise sales stages (Prospecting, Discovery, Solution Validation, Business Justification, Negotiation, Closed-Won) and formalize mathematical exit criteria for each."
            },
            {
                "id": "Q30.2",
                "name": "The Phantom Pipeline Audit Challenge",
                "type": "Detective Challenge",
                "desc": "Audit a raw CRM pipeline extract of 100 enterprise deals, identify 42 phantom opportunities masquerading as late-stage deals without customer verification, and calculate the actual risk-adjusted forecast."
            },
            {
                "id": "Q30.3",
                "name": "Deterministic Opportunity State Machine Engine",
                "type": "Mastery Assignment",
                "desc": "Build a TypeScript/Python finite state machine that enforces atomic stage progressions, rejecting illegal transitions and logging immutable audit trails of customer evidence."
            },
            {
                "id": "Q30.4",
                "name": "Quarter-End Pipeline Slippage Incident Lab",
                "type": "Production Incident Lab",
                "desc": "Diagnose an enterprise CRM outage where automated stage progression scripts erroneously promoted 250 stalled deals to 90% probability, causing an executive revenue restatement."
            }
        ]
    },
    {
        "day": 2,
        "month": 1,
        "blockNum": 1,
        "title": "Deal Qualification Physics: MEDDPICC & Economic Buyer Verification",
        "stageNum": 1,
        "stageName": "Stage 1: Mental Model Grounding",
        "pedagogicalRole": "Rigorous Deal Qualification Architecture (MEDDPICC Decomposition & Objective Vector Scoring)",
        "spokenGoal": "Every lost enterprise deal was lost in the first two weeks—you just didn't realize it until month six. Today we implement MEDDPICC as an analytical vector score, stripping away optimism and verifying the true Economic Buyer.",
        "conceptInvariant": "MEDDPICC Vector Invariant: An opportunity cannot be classified as qualified unless all 8 dimensions (Metrics, Economic Buyer, Decision Criteria, Decision Process, Paper Process, Identify Pain, Champion, Competition) have verified empirical evidence, with the Economic Buyer confirmed by direct engagement.",
        "failureMode": "The False Champion Trap: An account team spends 5 months co-designing an architecture with an enthusiastic Director of IT whom they labeled the 'Economic Buyer'. When the contract reaches signing, the true CFO cancels the project, stating the problem was never an enterprise priority.",
        "tryItFriction": "Execute a MEDDPICC qualification scoring script where a deal receives a 100% qualification score despite the Economic Buyer field containing only a LinkedIn profile URL with zero verified interactions.",
        "socraticHints": [
            "What test proves whether a contact is a genuine Economic Buyer versus merely a well-intentioned technical sponsor?",
            "How does identifying the Paper Process (legal, infosec, procurement routing) prevent quarter-end closing delays?",
            "Build a qualification matrix function that multiplies dimensional scores such that an unverified Economic Buyer zeros out the entire late-stage deal weight."
        ],
        "situationalPuzzle": {
            "scenario": "Your sales team has spent three months running a pilot with an enterprise logistics provider. The Senior Engineering Manager praises the software daily and promises to approve the $400k purchase. When asked to introduce the team to the CFO or VP of Supply Chain, the manager hesitates and says, 'Don't worry, I have full discretionary sign-off under my operating budget.'",
            "options": [
                "Trust the Senior Engineering Manager and proceed straight to sending the formal contract for signature.",
                "Politely challenge the manager by requesting corporate signing authority documentation or requiring a joint value briefing with the CFO before allocating further engineering POC resources.",
                "Offer a 10% discount if the Senior Engineering Manager signs the contract today.",
                "Secretly cold-email the CEO to complain that the Engineering Manager is blocking executive access."
            ],
            "correctOptionIndex": 1,
            "debrief": "Departmental managers almost never have $400k discretionary sign-off without VP/CFO approval. Believing 'I have budget' without verifying the corporate delegation of authority matrix leads to disastrous dead ends. Requiring a joint briefing with the real economic buyer protects vital company resources."
        },
        "quests": [
            {
                "id": "Q30.5",
                "name": "MEDDPICC Framework Analytical Decomposition",
                "type": "Concept",
                "desc": "Deconstruct all 8 pillars of MEDDPICC into concrete, auditable criteria and contrast MEDDPICC with legacy qualification frameworks (BANT, SPICED)."
            },
            {
                "id": "Q30.6",
                "name": "The Imposter Economic Buyer Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Analyze recorded sales notes, org charts, and email metadata across 10 active enterprise opportunities to detect 3 imposter champions who lack signing authority."
            },
            {
                "id": "Q30.7",
                "name": "Algorithmic MEDDPICC Deal Health Scoring Engine",
                "type": "Mastery Assignment",
                "desc": "Develop a multi-attribute MEDDPICC scoring engine that computes deal health index (0–100), highlights blind spots in paper process, and generates prescriptive deal intervention alerts."
            },
            {
                "id": "Q30.8",
                "name": "The Unqualified $2M Commit Wipeout Incident Lab",
                "type": "Production Incident Lab",
                "desc": "Conduct a post-mortem on a $2M enterprise deal that slipped 4 consecutive quarters; trace root causes back to unverified decision criteria and lack of access to the economic buyer."
            }
        ]
    },
    {
        "day": 3,
        "month": 1,
        "blockNum": 1,
        "title": "Buying Center Graph Theory & Multi-Stakeholder Influence Mapping",
        "stageNum": 1,
        "stageName": "Stage 1: Mental Model Grounding",
        "pedagogicalRole": "Organizational Network Analysis (Graph Topology of Corporate Buying Centers & Power Clusters)",
        "spokenGoal": "Enterprise sales is not a 1-to-1 conversation; it is a multi-agent consensus problem with an average of 11.4 stakeholders. We will model the enterprise buying center as a directed graph of influence, authority, and covert resistance.",
        "conceptInvariant": "Consensus Graph Invariant: A multi-stakeholder enterprise purchase is closed if and only if the directed path from Champion to Economic Buyer is unblocked and the negative influence weight of internal Blockers is neutralized by executive sponsorship.",
        "failureMode": "Single-threaded deal decapitation: The lead sponsor at a Fortune 500 account resigns 3 days before contract execution. Because the account executive was entirely single-threaded, all institutional memory and advocacy vanish, terminating the $1.5M deal instantly.",
        "tryItFriction": "Construct a buying center network visualization script where circular reference loops between internal evaluators cause an infinite traversal recursion when calculating voting consensus.",
        "socraticHints": [
            "Why is a deal with only one internal contact inherently fragile, regardless of how senior that contact is?",
            "How do you mathematically represent a 'Blocker' whose covert veto power outweighs three enthusiastic user advocates?",
            "Write an adjacency graph representation calculating the minimum cut required to secure board authorization."
        ],
        "situationalPuzzle": {
            "scenario": "You are navigating a $1.2M banking software deal. You have mapped the buying center: Head of Fraud (Champion, +3), Chief Risk Officer (Influencer, +1), and Head of Architecture (Blocker, -4, preferring to build internally). The Chief Operating Officer (Economic Buyer) is neutral (0) but relies heavily on the Head of Architecture for technical vetoes.",
            "options": [
                "Ignore the Head of Architecture and push the Head of Fraud to force a vote at the executive committee.",
                "Engage the Head of Architecture directly in a technical co-design workshop, addressing build-vs-buy career risks, offering roadmap integration, while having the CRO emphasize regulatory compliance deadlines.",
                "Offer the Head of Architecture personal advisory shares or consulting fees to change their mind.",
                "File an executive complaint with the COO accusing the Head of Architecture of slowing down company innovation."
            ],
            "correctOptionIndex": 1,
            "debrief": "Bypassing an influential technical blocker with veto power is fatal. Technical blockers often fear loss of control, obsolescence, or headcount reductions. Co-designing the architecture and leveraging regulatory pressure from peer executives (CRO) neutralizes the blocker constructively without burning political capital."
        },
        "quests": [
            {
                "id": "Q30.9",
                "name": "Buying Center Roles & Directed Graph Taxonomy",
                "type": "Concept",
                "desc": "Formalize the mathematical roles in an enterprise buying center (Champion, Economic Buyer, Technical Gatekeeper, User Influencer, Legal Counsel, Procurement Blocker) and their edge weights."
            },
            {
                "id": "Q30.10",
                "name": "The Hidden Saboteur Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Inspect meeting transcripts, email response latencies, and sentiment telemetry across 20 stakeholders to uncover a covert internal blocker sabotaging a healthcare SaaS RFP."
            },
            {
                "id": "Q30.11",
                "name": "Buying Center Influence Graph & Multi-Threading Engine",
                "type": "Mastery Assignment",
                "desc": "Build an interactive graph model that visualizes stakeholder sentiment, calculates consensus centrality, and computes multi-threading resilience scores across enterprise accounts."
            },
            {
                "id": "Q30.12",
                "name": "Sponsor Resignation Executive Recovery Incident Lab",
                "type": "Production Incident Lab",
                "desc": "Respond to a live simulation where the sole enterprise champion announces their departure on LinkedIn 48 hours before quarter close; execute a rapid multi-threaded re-anchoring playbook."
            }
        ]
    },
    {
        "day": 4,
        "month": 1,
        "blockNum": 1,
        "title": "Outbound Prospecting Calculus: Intent Data & Trigger-Based Multi-Threading",
        "stageNum": 1,
        "stageName": "Stage 1: Mental Model Grounding",
        "pedagogicalRole": "Precision Outbound Infrastructure (Intent Signal Aggregation, Trigger Event Mining & Deliverability Architecture)",
        "spokenGoal": "Blasting 10,000 generic cold emails is spam, not sales. Senior revenue architects synthesize intent signals, financial filings, and executive hiring triggers into hyper-personalized, value-first multi-threading cadences.",
        "conceptInvariant": "Relevance Physics Invariant: Outbound engagement probability is a direct function of problem immediacy and trigger relevance; generic outreach decays domain sender reputation and yields asymptotically zero enterprise pipeline.",
        "failureMode": "Domain burn catastrophe: An SDR team ramps up automated email sequences to 5,000 emails/day using primary corporate domains without proper warmup or SPF/DKIM/DMARC alignment; corporate domains are blacklisted globally by Google and Microsoft Workspace, halting all company email communication.",
        "tryItFriction": "Run an outbound cadence email validator that erroneously sends plain-text emails containing unescaped template tags like 'Hi {{first_name}}' directly to executive prospects.",
        "socraticHints": [
            "What technical safeguards (SPF, DKIM, DMARC, secondary domain pools, volume ramping) protect corporate email deliverability?",
            "How does a 10-K regulatory filing or executive leadership change act as an empirical trigger event for B2B problem urgency?",
            "Design an intent scoring algorithm that weights Bombora surge data, job postings, and website deanonymization."
        ],
        "situationalPuzzle": {
            "scenario": "A newly appointed VP of Sales wants to generate $5M in pipeline in 30 days and instructs the SDR team to purchase 50,000 email addresses from an unverified broker and blast them from the main company domain (company.com) with a generic 20% discount offer.",
            "options": [
                "Execute the campaign immediately as instructed to meet executive pipeline quotas.",
                "Intervene and mandate an enterprise outbound architecture: isolate cold traffic on secondary domains (e.g., company-labs.com), verify email deliverability, implement DMARC, and segment accounts by intent signals and trigger events.",
                "Send the 50,000 emails but split them evenly across all existing employee Gmail accounts.",
                "Replace cold emails with automated LinkedIn connection bots sending 500 invitations per hour per rep."
            ],
            "correctOptionIndex": 1,
            "debrief": "Blasting unverified lists from a primary corporate domain causes immediate spam flagging, blacklisting by major mail exchange filters, and catastrophic domain reputation destruction. Enterprise outbound requires secondary domain infrastructure, strict DNS authentication (SPF/DKIM/DMARC), and intent-driven targeting."
        },
        "quests": [
            {
                "id": "Q30.13",
                "name": "Intent Signal Taxonomy & Trigger Event Mining",
                "type": "Concept",
                "desc": "Catalog primary intent data sources (first-party telemetry, second-party review sites, third-party Bombora surges, 10-K/10-Q risk disclosures, executive churn) and their conversion multipliers."
            },
            {
                "id": "Q30.14",
                "name": "The Burnt Domain Post-Mortem Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Analyze DNS headers, bounce reports, and IP spamhaus listings to reconstruct how an SDR agency destroyed a SaaS startup's email domain reputation in 72 hours."
            },
            {
                "id": "Q30.15",
                "name": "Trigger-Based Multi-Touch Cadence Engine",
                "type": "Mastery Assignment",
                "desc": "Build an automated prospecting orchestration engine that ingests company trigger events (e.g., new CTO hired), identifies the 4 top stakeholders, and drafts tailored value-first cadences."
            },
            {
                "id": "Q30.16",
                "name": "Production DNS Blacklist & Deliverability Recovery Lab",
                "type": "Production Incident Lab",
                "desc": "Resolve a live production incident where corporate outbound deliverability dropped from 98% to 12%; configure SPF, DKIM, DMARC records, implement Google Postmaster monitoring, and re-warm IP pools."
            }
        ]
    },
    {
        "day": 5,
        "month": 1,
        "blockNum": 1,
        "title": "Milestone 1: ApexProspect Sovereign Lead Qualification & Buying Center Engine",
        "stageNum": 1,
        "stageName": "Stage 1: Mental Model Grounding",
        "pedagogicalRole": "Milestone Architectural Synthesis (Integrated Prospecting, Account Mapping & MEDDPICC Validation Suite)",
        "spokenGoal": "Welcome to Milestone 1. You will architect and deploy ApexProspect—an enterprise-grade prospecting and qualification engine that aggregates intent signals, maps buying centers as directed graphs, and computes rigorous MEDDPICC vectors.",
        "conceptInvariant": "Pipeline Purity Invariant: ApexProspect must guarantee that no account transitions into an active pipeline opportunity without passing automated MEDDPICC verification and multi-stakeholder identity resolution.",
        "failureMode": "Fictitious pipeline poisoning: Marketing pushes 1,000 MQLs into the sales pipeline based on whitepaper downloads; SDRs spam them blindly without account mapping, creating $10M in fictitious pipeline that fails 100% of executive audits.",
        "tryItFriction": "Run the ApexProspect end-to-end qualification pipeline with ungrounded intent inputs, resulting in a divide-by-zero crash in the composite ICP matching algorithm.",
        "socraticHints": [
            "How do you synthesize disparate signals (firmographic, technographic, intent, buying center breadth) into a unified Ideal Customer Profile (ICP) fit score?",
            "What automated checks verify that an Economic Buyer contact has legitimate corporate fiduciary signing power?",
            "Structure ApexProspect with clean domain separation between signal ingestion, graph resolution, and MEDDPICC scoring."
        ],
        "situationalPuzzle": {
            "scenario": "You are presenting the ApexProspect deployment to the Chief Revenue Officer. The SDR Director complains that the engine filtered out 80% of raw inbound leads, arguing that 'any lead with an email address is an opportunity.' Meanwhile, the Enterprise AE team reports that the 20% of accounts that passed ApexProspect closed at 4x the historical win rate.",
            "options": [
                "Lower the ApexProspect filter thresholds to zero so SDRs have more volume to dial.",
                "Defend the architectural gating: demonstrate mathematically that pipeline velocity and AE quota capacity are destroyed by low-intent noise, and establish an automated nurture track for rejected leads.",
                "Allow SDRs to manually bypass all ApexProspect qualification checks whenever they are behind on monthly targets.",
                "Eliminate the SDR team entirely and rely 100% on unassisted self-serve product signups."
            ],
            "correctOptionIndex": 1,
            "debrief": "High-performing B2B sales organizations maximize Sales Velocity ($V = \frac{N \times W \times V_{avg}}{L}$) by protecting AE capacity. Flooding AEs with low-intent MQLs balloons sales cycle length ($L$) and collapses win rate ($W$). Rigorous qualification preserves focus on high-probability buying centers while automated nurture handles early-stage prospects."
        },
        "quests": [
            {
                "id": "Q30.17",
                "name": "ApexProspect Architectural Specification",
                "type": "Concept",
                "desc": "Author the complete system specification for ApexProspect, detailing entity relationship schemas, graph traversal models, and MEDDPICC validation gates."
            },
            {
                "id": "Q30.18",
                "name": "The Corrupted Prospecting Feed Audit",
                "type": "Detective Challenge",
                "desc": "Audit an integrated dataset of 500 company accounts with conflicting intent signals and identify 45 spoofed accounts generating false positive buying surges."
            },
            {
                "id": "Q30.19",
                "name": "ApexProspect Lead & Buying Center Engine Implementation",
                "type": "Mastery Assignment",
                "desc": "Implement the complete ApexProspect suite in TypeScript: multi-source signal ingestion, buying center graph mapping, automated MEDDPICC vector scoring, and CRM export."
            },
            {
                "id": "Q30.20",
                "name": "Enterprise Buying Center Re-Qualification War Room",
                "type": "Production Incident Lab",
                "desc": "Simulate a live M&A event where an existing enterprise target is acquired by a conglomerate; re-evaluate buying center graphs and re-qualify the $3.5M pipeline in real time."
            }
        ]
    },
    {
        "day": 6,
        "month": 1,
        "blockNum": 2,
        "title": "Discovery Call Engineering: Socratic Funnel & Pain Quantification",
        "stageNum": 2,
        "stageName": "Stage 2: Defensive Fluency",
        "pedagogicalRole": "Diagnostic Discovery Architecture (Socratic Questioning Funnel, Latent Pain Uncovering & Financial Quantification)",
        "spokenGoal": "Amateurs pitch products; masters conduct diagnostic autopsies. Today we engineer the Socratic discovery call, guiding the customer through open-ended inquiry until they articulate their own quantified financial agony.",
        "conceptInvariant": "Quantified Agony Invariant: An identified operational problem is not a commercial pain until it is explicitly converted into quantified financial impact (wasted capital, lost revenue, or unhedged risk) by the customer's own admission.",
        "failureMode": "The 'Show-and-Tell' Premature Demo: An AE opens the first call with 45 slides and a live product demonstration. The prospect politely says 'that looks really cool, send us some pricing,' never responds again, and the deal dies of zero compelling event.",
        "tryItFriction": "Implement a discovery transcript parser where questions containing leading words like 'Wouldn't it be great if...' are misclassified as open-ended diagnostic inquiries.",
        "socraticHints": [
            "What is the difference between surface pain ('our reporting is slow') and commercial agony ('we missed financial closing deadlines resulting in a $200k audit penalty')?",
            "How does the Socratic Funnel progress from Situation to Problem, Implication, and Need-Payoff?",
            "Write a formula that calculates annualized operational loss based on customer-admitted labor hours and error rates."
        ],
        "situationalPuzzle": {
            "scenario": "During an initial discovery call with the VP of Engineering at a fintech company, the VP states: 'Our developers spend too much time dealing with broken CI/CD pipelines.' Many sales reps immediately say, 'Our tool automates CI/CD! Let me show you a demo!' What is the senior diagnostic response?",
            "options": [
                "Immediately launch into a screen share showing the pipeline configuration UI.",
                "Probe deeper: 'When you say too much time, how many engineering hours per week are lost across your team, what releases have been delayed, and what does that mean for your quarterly product delivery commitments to the board?'",
                "Offer a 30-day free trial so their developers can test the software without talking further.",
                "Ask for the company's annual budget for developer tooling immediately."
            ],
            "correctOptionIndex": 1,
            "debrief": "Jumping to solution presentation before quantifying the business implication trivializes the problem. Socratic diagnostic questions reveal the true organizational cost (e.g., 20 engineers wasting 5 hours/week = 100 hrs/wk = $500k/yr in unbuilt roadmap features), transforming a minor technical annoyance into an urgent strategic priority."
        },
        "quests": [
            {
                "id": "Q30.21",
                "name": "Socratic Discovery Architecture & Question Taxonomy",
                "type": "Concept",
                "desc": "Map out the complete taxonomy of discovery questions (Situation, Problem, Implication, Need-Payoff) with strict guidelines for eliminating confirmation bias and premature pitching."
            },
            {
                "id": "Q30.22",
                "name": "The Superficial Discovery Call Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Review audio transcripts of 5 failed discovery calls, identify the exact moments where reps missed latent pain cues and collapsed into feature-dumping, and calculate the lost deal probability."
            },
            {
                "id": "Q30.23",
                "name": "Dynamic Pain Quantification & Business Case Generator",
                "type": "Mastery Assignment",
                "desc": "Build an algorithmic discovery tool that takes raw customer operational metrics (headcount, hourly rates, downtime frequency) and calculates total annual cost of the problem."
            },
            {
                "id": "Q30.24",
                "name": "Hostile Executive Discovery Recovery Lab",
                "type": "Production Incident Lab",
                "desc": "Handle a simulated discovery incident where a cynical CTO interrupts the call 5 minutes in saying 'You have 10 minutes, just show me the software'; pivot gracefully into high-value diagnostic inquiry."
            }
        ]
    },
    {
        "day": 7,
        "month": 1,
        "blockNum": 2,
        "title": "The Challenger Sale: Commercial Teaching & Constructive Tension",
        "stageNum": 2,
        "stageName": "Stage 2: Defensive Fluency",
        "pedagogicalRole": "Commercial Teaching Architecture (Challenger Methodology, Cognitive Re-Framing & Constructive Tension Management)",
        "spokenGoal": "Customers don't know what they don't know. If you only ask them what they need, they will ask for a faster horse. Today we implement Commercial Teaching—challenging existing assumptions, reframing industry trends, and creating constructive tension.",
        "conceptInvariant": "Challenger Re-Framing Invariant: A commercial teaching insight must lead directly to your unique architectural differentiator, but must first educate the customer about an unrecognized risk or hidden cost without mentioning your product.",
        "failureMode": "Aggressive Alienation: An AE misunderstands 'constructive tension' as argumentative hostility, insults the customer's current architecture as 'antiquated and incompetent,' causing the prospective CIO to immediately terminate the vendor relationship and escort the team out.",
        "tryItFriction": "Construct a pitch deck evaluator script where commercial teaching claims that fail to link to proprietary product capabilities still receive high differentiated value scores.",
        "socraticHints": [
            "What constitutes the 6-step Challenger choreography (The Warmer, The Reframe, Rational Drowning, Emotional Impact, A New Way, Our Solution)?",
            "How do you introduce constructive cognitive dissonance without triggering psychological defensiveness?",
            "Structure an insight framework showing the hidden second-order costs of an industry-standard best practice."
        ],
        "situationalPuzzle": {
            "scenario": "You are selling enterprise data integration software to a Chief Data Officer who proudly asserts: 'We follow best practices—we centralize all enterprise data into a single global Snowflake data lake before allowing any downstream analytics access.' You know this architecture causes an average 6-day data latency for operational fraud detection.",
            "options": [
                "Agree with the CDO and validate their approach, then try to pitch your tool as a generic Snowflake connector.",
                "Deliver a commercial teaching reframe: share anonymized benchmark data showing that while centralized warehousing works for retrospective BI, modern real-time fraud vectors exploit the 6-day ETL batch window, costing peer banks an average of $4.2M annually in unintercepted chargebacks.",
                "Tell the CDO that their Snowflake architecture is completely broken and that they should fire their data engineering leads.",
                "Wait until the contract negotiation stage to point out that their architecture cannot support your software."
            ],
            "correctOptionIndex": 1,
            "debrief": "The Challenger approach uses commercial teaching to expose an unrecognized vulnerability (ETL latency in fraud prevention) backed by industry benchmark data ('Rational Drowning'). It reframes the customer's definition of the problem before introducing the solution, establishing immense domain credibility without attacking the executive personally."
        },
        "quests": [
            {
                "id": "Q30.25",
                "name": "Challenger 6-Stage Choreography & Pedagogical Architecture",
                "type": "Concept",
                "desc": "Deconstruct the 6 stages of commercial teaching (Warmer, Reframe, Rational Drowning, Emotional Impact, A New Way, Solution) and define exit gates for each stage."
            },
            {
                "id": "Q30.26",
                "name": "The Flawed Commercial Insight Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Audit 10 commercial teaching pitches across enterprise sales teams; identify 4 presentations where the 'insight' was merely an disguised product feature and 3 where the tension turned hostile."
            },
            {
                "id": "Q30.27",
                "name": "Commercial Teaching Reframe & Narrative Engine",
                "type": "Mastery Assignment",
                "desc": "Develop an automated pitch synthesis engine that transforms technical product advantages into an industry benchmark report that reframes executive perspective."
            },
            {
                "id": "Q30.28",
                "name": "Steering Committee Tension De-Escalation Incident Lab",
                "type": "Production Incident Lab",
                "desc": "Navigate an executive steering committee incident where a defensive VP of Infrastructure pushes back aggressively on your reframe; de-escalate tension while maintaining insight integrity."
            }
        ]
    },
    {
        "day": 8,
        "month": 1,
        "blockNum": 2,
        "title": "Competitive Intelligence: Battlecards, Landmines & Objection Inversion",
        "stageNum": 2,
        "stageName": "Stage 2: Defensive Fluency",
        "pedagogicalRole": "Adversarial Market Positioning (Competitive Battlecards, Cognitive Landmine Placement & Objection Inversion)",
        "spokenGoal": "Never badmouth a competitor—it makes you look weak and unprofessional. Instead, lay strategic landmines: guide the customer to ask your competitor questions about architectural tradeoffs that your rival cannot answer without admitting failure.",
        "conceptInvariant": "Landmine Positioning Invariant: An effective competitive trap consists of framing a customer evaluation criterion around a fundamental architectural limitation of the rival that cannot be fixed without a complete rewrite of their platform.",
        "failureMode": "FUD Defamation Lawsuit: A sales team circulates unverified competitor attack sheets claiming a rival's platform violates SOC 2 compliance; the competitor's legal counsel issues a cease-and-desist with threatened defamation litigation, forcing executive retractions.",
        "tryItFriction": "Build an objection classifier that matches common customer objections (e.g., 'Your price is too high') but misclassifies them into product feature gaps rather than value articulation failures.",
        "socraticHints": [
            "Why is planting a verification question (e.g., 'Ask vendor X how their distributed state handles network partitions') infinitely more powerful than stating a negative claim yourself?",
            "How do you invert an objection like 'You are a smaller startup compared to Legacy Vendor Y' into a decisive strategic advantage?",
            "Formulate an objection inversion calculus mapping objections to core architectural principles."
        ],
        "situationalPuzzle": {
            "scenario": "You are competing against a massive 20-year-old legacy incumbent for an enterprise core banking contract. During the committee review, the prospective CIO states: 'The incumbent vendor has been in business for 30 years and has 10,000 employees. You are a 6-year-old growth company. How do we know you won't disappear or get acquired?'",
            "options": [
                "Denounce the incumbent as an ancient, dying dinosaur whose stock price is plummeting.",
                "Invert the objection: 'That 30-year legacy is their biggest asset and their greatest liability. Their architecture is built on on-premise mainframe code that requires 18 months for simple schema changes. Our modern cloud-native engine deploys weekly. Furthermore, ask them what percentage of their R&D budget goes to maintaining legacy technical debt versus modern innovation.'",
                "Offer to deposit your entire company source code into escrow and slash your price by 50% immediately.",
                "Tell the CIO that if they choose the incumbent, their career will stagnate."
            ],
            "correctOptionIndex": 1,
            "debrief": "Attacking an incumbent directly triggers corporate conservatism ('Nobody gets fired for buying IBM'). Inverting the objection re-frames the incumbent's size and age as rigidity and technical debt, while turning your relative youth into architectural agility and focused R&D innovation. Socratic landmine questions allow the customer to discover the competitor's weakness themselves."
        },
        "quests": [
            {
                "id": "Q30.29",
                "name": "Competitive Battlecard & Landmine Physics",
                "type": "Concept",
                "desc": "Author a comprehensive competitive battlecard architecture, detailing architectural landmines, competitor attack vectors, and objection inversion scripts."
            },
            {
                "id": "Q30.30",
                "name": "The Competitor FUD Disinformation Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate recorded customer calls where a major rival spread false architectural FUD regarding your multi-tenant database security; trace the origin and engineer counter-evidence briefs."
            },
            {
                "id": "Q30.31",
                "name": "Automated Dynamic Battlecard & Landmine Engine",
                "type": "Mastery Assignment",
                "desc": "Build an interactive battlecard application that prompts sales reps with contextual landmines and objection inversion frameworks based on real-time competitor mentions."
            },
            {
                "id": "Q30.32",
                "name": "Live RFP Competitor Ambush Incident Lab",
                "type": "Production Incident Lab",
                "desc": "Respond to a live simulation where a competitor slashes their bid by 60% on the final day of an enterprise RFP; execute a non-price value defense that preserves full deal margin."
            }
        ]
    },
    {
        "day": 9,
        "month": 1,
        "blockNum": 2,
        "title": "Cost of Inaction (COI) Calculus & Defensible Enterprise ROI Models",
        "stageNum": 2,
        "stageName": "Stage 2: Defensive Fluency",
        "pedagogicalRole": "Quantitative Financial Justification (Cost of Inaction Calculus, NPV/IRR Hurdle Rates & CFO Defense)",
        "spokenGoal": "Your biggest competitor isn't another software vendor—it is 'Do Nothing.' Enterprise budgets aren't spent unless the Cost of Inaction (COI) mathematically dwarfs the implementation cost and surpasses the corporate hurdle rate.",
        "conceptInvariant": "Hurdle Rate Invariant: A business case is approved by the CFO if and only if the Net Present Value (NPV) is strictly positive, the Internal Rate of Return (IRR) exceeds the corporate Weighted Average Cost of Capital (WACC), and the payback period is under 12 months.",
        "failureMode": "The CFO Guillotine: An AE presents a fluffy 'ROI calculator' claiming 500% ROI based on vague 'employee productivity gains'; the CFO rejects the proposal in 90 seconds, noting that saved minutes do not equate to reduced payroll or cash generation.",
        "tryItFriction": "Execute a financial ROI script where discount rate compounding calculations use an inverted time exponent, producing negative present values for profitable investments.",
        "socraticHints": [
            "Why do CFOs routinely discount 'soft productivity gains' (e.g., 'saves 10 minutes per day') to $0 in capital budget reviews?",
            "What three financial categories do CFOs actually accept: hard headcount redeployment/avoidance, hard vendor consolidation, and hard revenue uplift?",
            "Formulate the NPV equation: $NPV = \sum_{t=1}^{T} \frac{CF_t}{(1 + r)^t} - C_0$ with clear cash flow definitions."
        ],
        "situationalPuzzle": {
            "scenario": "You are building a $500,000 enterprise software business case for a Chief Financial Officer. The sales engineer proposes claiming $2,000,000 in ROI based on '2,000 employees saving 15 minutes each day.' How will the CFO evaluate this, and how should you re-engineer the financial model?",
            "options": [
                "Keep the 15-minute productivity calculation because it produces an impressive 400% ROI figure.",
                "Discard the soft productivity metric completely; re-anchor the model on hard, auditable cash savings: retiring three redundant legacy software contracts ($280k/yr), eliminating third-party contractor spend ($350k/yr), and preventing compliance fines ($150k/yr), yielding a cash payback in 7.8 months.",
                "Double the assumed hourly rate of the employees to make the soft savings even higher.",
                "Bypass the CFO entirely and ask the Head of HR to approve the budget using discretionary training funds."
            ],
            "correctOptionIndex": 1,
            "debrief": "CFOs view soft time savings as imaginary because companies cannot fire fractional employees or directly convert 15 saved minutes into corporate cash. Grounding business cases in hard vendor displacement, contractor reduction, and direct cost avoidance creates an ironclad, audit-proof ROI model that easily clears executive investment committees."
        },
        "quests": [
            {
                "id": "Q30.33",
                "name": "Financial Hurdle Rates & Hard vs Soft ROI Calculus",
                "type": "Concept",
                "desc": "Formalize the financial mathematics of enterprise software justification: Net Present Value (NPV), Internal Rate of Return (IRR), Payback Period, and hard vs soft cash savings."
            },
            {
                "id": "Q30.34",
                "name": "The Bogus ROI Model Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Audit an AE's spreadsheet model that promised an enterprise prospect an 800% ROI; identify 6 mathematical and economic fallacies that would guarantee immediate CFO rejection."
            },
            {
                "id": "Q30.35",
                "name": "CFO-Defensible Enterprise ROI & COI Engine",
                "type": "Mastery Assignment",
                "desc": "Build an algorithmic financial modeling tool that ingests customer financials, projects 3-year cash flows with sensitivity analysis, and generates a CFO-ready investment deck."
            },
            {
                "id": "Q30.36",
                "name": "The Mid-Year Budget Freeze Crisis Lab",
                "type": "Production Incident Lab",
                "desc": "Handle a sudden corporate spending freeze on a $900k deal; re-frame the proposal from an expansion expenditure to an urgent Cost of Inaction cash-conservation shield."
            }
        ]
    },
    {
        "day": 10,
        "month": 1,
        "blockNum": 2,
        "title": "Milestone 2: ApexDiscovery Value Architecture & ROI Calculator Suite",
        "stageNum": 2,
        "stageName": "Stage 2: Defensive Fluency",
        "pedagogicalRole": "Milestone Architectural Synthesis (Integrated Discovery Call Structuring, Value Maps & Financial ROI Suite)",
        "spokenGoal": "Milestone 2: You will build ApexDiscovery—a comprehensive value engineering suite that converts raw diagnostic call transcripts into structured business case models, financial ROI equations, and Challenger pitch assets.",
        "conceptInvariant": "Value Architecture Invariant: ApexDiscovery must ensure that every generated economic business case links each dollar of projected ROI directly to a customer-admitted operational pain point recorded in discovery telemetry.",
        "failureMode": "Disconnected business case repudiation: An account team generates a beautiful $1.5M ROI report, but when the Economic Buyer reviews it, they state: 'We never gave you these cost numbers; these are your industry averages, not our reality,' destroying deal trust.",
        "tryItFriction": "Execute the ApexDiscovery automated report generator when customer citation tags are missing, leading to ungrounded placeholder values like '$NaN' in executive summary tables.",
        "socraticHints": [
            "How do you establish verifiable traceability between a customer quote in a discovery call and an input parameter in a financial model?",
            "What sensitivity toggles (Conservative, Moderate, Aggressive) must be included to survive adversarial finance interrogations?",
            "Architect ApexDiscovery with modular components: Transcript Parser, Value Matrix Mapper, and Financial Cash-Flow Simulator."
        ],
        "situationalPuzzle": {
            "scenario": "You are defending an ApexDiscovery financial model in front of an enterprise customer's Finance Committee. The Senior Controller challenges your assumptions, saying: 'We believe your projected 25% efficiency gain in database queries is overly optimistic.' How should ApexDiscovery respond?",
            "options": [
                "Argue with the Controller and insist that your industry data is 100% accurate.",
                "Activate live sensitivity toggles: show that even if query efficiency gains are reduced to an ultra-conservative 5%, the hard vendor displacement savings alone still yield an 11-month payback and a 38% IRR, far exceeding their 15% hurdle rate.",
                "Offer an immediate 50% software discount to compensate for their skepticism.",
                "Withdraw the financial model and state that software value cannot be measured in numbers."
            ],
            "correctOptionIndex": 1,
            "debrief": "A professional financial model never relies on a single brittle assumption. By having parameterized sensitivity analysis, you can concede conservative haircuts to the customer during live review while demonstrating that the deal's economic justification remains rock-solid based on hard displaced costs alone."
        },
        "quests": [
            {
                "id": "Q30.37",
                "name": "ApexDiscovery Technical Specification",
                "type": "Concept",
                "desc": "Design the technical architecture of ApexDiscovery: transcript tagging schema, value proposition taxonomy, and multi-variable cash-flow projection algorithms."
            },
            {
                "id": "Q30.38",
                "name": "The Unsubstantiated ROI Audit",
                "type": "Detective Challenge",
                "desc": "Audit an archive of 25 enterprise business cases generated across sales teams and identify 8 reports that used ungrounded industry averages instead of customer telemetry."
            },
            {
                "id": "Q30.39",
                "name": "ApexDiscovery End-to-End Platform Implementation",
                "type": "Mastery Assignment",
                "desc": "Implement the complete ApexDiscovery suite in TypeScript/Python: transcript extraction, parameterized cash-flow models, sensitivity sliders, and automated PDF executive briefing generation."
            },
            {
                "id": "Q30.40",
                "name": "Live CFO Investment Committee Defense Lab",
                "type": "Production Incident Lab",
                "desc": "Defend a $1.8M enterprise business case under adversarial questioning by a simulated CFO; adjust sensitivity parameters in real time to secure unanimous capital approval."
            }
        ]
    },
    {
        "day": 11,
        "month": 1,
        "blockNum": 3,
        "title": "Technical Solution Scoping & Enterprise Architecture Alignment",
        "stageNum": 2,
        "stageName": "Stage 2: Defensive Fluency",
        "pedagogicalRole": "Solution Engineering Architecture (Technical Scoping, Integration Topology & Architectural Review Boards)",
        "spokenGoal": "If you don't scope the technical boundary conditions rigorously, your customer success team will inherit an unmaintainable disaster. Today we engineer technical solution scoping, aligning API protocols, data pipelines, and security perimeters with enterprise architecture.",
        "conceptInvariant": "Scoping Boundary Invariant: A technical solution scope is valid if and only if all system boundaries, API throughput limits, identity federation protocols, and legacy database integrations are explicitly defined with binary acceptance criteria.",
        "failureMode": "The 'Yes-Man' Technical Catastrophe: An overeager sales engineer verbally promises a prospective client that the SaaS product can ingest 100,000 Kafka events per second and sync bidirectionally with their custom 1995 on-premise mainframe. Post-contract, the engineering team cannot deliver, resulting in breach of contract and lawsuit threats.",
        "tryItFriction": "Validate an enterprise technical architecture questionnaire where missing data residency fields (GDPR/HIPAA) fail to flag compliance redlines.",
        "socraticHints": [
            "What are the 4 non-negotiable pillars of an Enterprise Architecture Review Board (Integration, Security, Performance/SLA, Governance)?",
            "How do you document integration out-of-scope clauses to protect engineering capacity?",
            "Write a formal Statement of Architecture capturing authentication (SAML/SCIM), data flow, and throughput quotas."
        ],
        "situationalPuzzle": {
            "scenario": "During technical scoping with a tier-1 retail enterprise, the customer's Chief Architect insists that your platform must support bidirectional real-time inventory synchronization with an on-premises AS/400 DB2 database using proprietary socket protocols not supported in your product.",
            "options": [
                "Verbally agree to build the custom AS/400 driver during implementation to get the contract signed.",
                "Clearly delineate the architectural boundary: specify that your platform exposes standard REST/gRPC/Kafka webhooks, and partner with a certified systems integrator (or provide standard middleware specifications) to bridge the AS/400 system, formally documenting it in the Statement of Work.",
                "Walk away from the $800k deal immediately without exploring alternatives.",
                "Tell the Chief Architect that AS/400 is obsolete and refuse to discuss integration."
            ],
            "correctOptionIndex": 1,
            "debrief": "Never commit core product engineering to one-off legacy integration drivers. Delineating boundaries by defining modern API/event standards while positioning certified integration partners or middleware adapters protects your core roadmap while maintaining deal momentum."
        },
        "quests": [
            {
                "id": "Q30.41",
                "name": "Enterprise Architecture Alignment & Integration Schemas",
                "type": "Concept",
                "desc": "Map out enterprise technical evaluation frameworks (Identity Federation via SCIM/SAML, Network Perimeters via PrivateLink, Data Ingestion via Kafka/gRPC, and SOC 2/ISO 27001)."
            },
            {
                "id": "Q30.42",
                "name": "The Unvetted Technical Promise Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Audit recorded sales engineer notes and Slack channels to identify 5 unauthorized custom architectural commitments made to prospective clients that violate engineering roadmaps."
            },
            {
                "id": "Q30.43",
                "name": "Enterprise Technical Architecture Scoping Engine",
                "type": "Mastery Assignment",
                "desc": "Build an automated scoping tool that ingests customer infrastructure specs, compares against platform capabilities, and generates a formal Architectural Scope Matrix."
            },
            {
                "id": "Q30.44",
                "name": "Live Architectural Review Board (ARB) Defense Lab",
                "type": "Production Incident Lab",
                "desc": "Defend your platform's security and latency SLAs in a high-stakes simulation before a hostile Enterprise Architectural Review Board; resolve 3 critical security objections."
            }
        ]
    },
    {
        "day": 12,
        "month": 1,
        "blockNum": 3,
        "title": "Technical Proof of Concept (POC) Physics & Binary Gate Governance",
        "stageNum": 2,
        "stageName": "Stage 2: Defensive Fluency",
        "pedagogicalRole": "Proof of Concept Governance (Time-Boxed POC Charters, Objective Success Criteria & Production Sandbox Isolation)",
        "spokenGoal": "An unmanaged POC is where deals go to die a slow, lingering death. We will engineer Proof of Concept governance with mathematical precision: time-boxed, gated by binary pass/fail criteria, and pre-committed to commercial execution upon technical success.",
        "conceptInvariant": "POC Binary Invariant: A technical Proof of Concept must never commence without a signed POC Agreement that specifies exactly $\le 5$ measurable, binary success criteria, a fixed duration ($\le 21$ days), and written commitment to execute the commercial contract upon passing all criteria.",
        "failureMode": "The 9-Month Zombie POC: A sales team grants a prospect an open-ended trial with no defined success criteria. The customer continuously shifts goalposts, tests edge cases for 9 months, burns 300 sales engineering hours, and finally decides to postpone the project indefinitely.",
        "tryItFriction": "Run a POC milestone tracker where test criteria containing qualitative terms like 'Fast query response' pass automated evaluation without requiring numeric millisecond latency thresholds.",
        "socraticHints": [
            "Why is a signed commercial commitment contingent on POC success critical before provisioning technical sandbox environments?",
            "How do you convert qualitative expectations ('system must be easy to use') into unambiguous binary criteria ('a junior engineer deploys an app in $< 15$ minutes without vendor assistance')?",
            "Draft a POC Charter template that includes explicit kill dates and auto-conversion triggers."
        ],
        "situationalPuzzle": {
            "scenario": "A potential enterprise customer agrees to run a POC for your security monitoring software. They send a draft agreement stating: 'The POC will run for an indefinite evaluation period until the security team feels comfortable with system stability.'",
            "options": [
                "Sign the agreement immediately because getting into the customer's environment is the most important step.",
                "Reject indefinite terms and redline the POC charter: fix duration to exactly 14 business days, define 3 binary success metrics (e.g., ingest 50k EPS with zero dropped packets, detect simulated CVE-2024 exploit within 30 seconds), and include pre-agreed commercial contract execution upon passing.",
                "Offer to extend the indefinite POC to a full 12 months for free.",
                "Refuse to do any POC and demand an upfront payment of $500,000 without testing."
            ],
            "correctOptionIndex": 1,
            "debrief": "Indefinite POCs turn sales teams into unpaid consulting teams. High-performing enterprise sales organizations require strict, time-boxed charters (14–21 days) with explicit binary criteria. If the product passes, the commercial contract automatically proceeds to signature."
        },
        "quests": [
            {
                "id": "Q30.45",
                "name": "POC Charter Architecture & Binary Criteria Formulation",
                "type": "Concept",
                "desc": "Deconstruct the anatomy of an enterprise POC Charter: duration time-boxing, sandbox isolation, data privacy rules, and formulation of unambiguous binary success criteria."
            },
            {
                "id": "Q30.46",
                "name": "The Scope-Creep Zombie POC Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Analyze 15 historical POC logs to identify how shifting goalposts, unmonitored test parameters, and lack of commercial gating inflated sales cycles by an average of 140 days."
            },
            {
                "id": "Q30.47",
                "name": "Automated POC Success & Telemetry Tracking Suite",
                "type": "Mastery Assignment",
                "desc": "Build a real-time POC tracking dashboard that monitors customer test runs against pre-defined success metrics, logs automated test assertions, and generates binary pass/fail verification certificates."
            },
            {
                "id": "Q30.48",
                "name": "Live POC Performance Benchmark Recovery Lab",
                "type": "Production Incident Lab",
                "desc": "Resolve a live crisis where your system fails a critical POC throughput benchmark on Day 12 of a 14-day trial due to an unindexed database query; diagnose the bottleneck and salvage the deal."
            }
        ]
    },
    {
        "day": 13,
        "month": 1,
        "blockNum": 3,
        "title": "Mutual Action Plans (MAP): Backward Scheduling & Shared Ownership",
        "stageNum": 3,
        "stageName": "Stage 3: Systems Stress-Testing",
        "pedagogicalRole": "Coordinated Execution Architecture (Mutual Action Plans, Backward Scheduling from Go-Live & Critical Path Analysis)",
        "spokenGoal": "Enterprise sales is project management masquerading as persuasion. Today we construct Mutual Action Plans (MAPs)—collaborative, backward-scheduled roadmaps co-authored with the Economic Buyer that turn closing dates into inevitable operational milestones.",
        "conceptInvariant": "Mutual Ownership Invariant: A closing timeline is fictional unless backward-scheduled from the customer's compelling business event (go-live deadline), shared as a live collaborative artifact, and actively co-managed by both vendor and client leads.",
        "failureMode": "The Phantom Quarter-End Slip: An AE forecasts a deal to close on March 31st based on 'gut feeling.' On March 28th, they discover that enterprise procurement requires a 4-week vendor onboarding board review and security review takes 30 business days, delaying closing by two months.",
        "tryItFriction": "Implement a critical-path project scheduling script where dependent tasks with legal review bottlenecks fail to recalculate the forecasted contract execution date.",
        "socraticHints": [
            "Why must a Mutual Action Plan always be backward-scheduled from the customer's compelling event rather than forward-scheduled from today?",
            "What critical enterprise milestones must be explicitly mapped (InfoSec review, Legal redlines, Procurement vendor setup, Board budget approval)?",
            "Build a DAG dependency graph that calculates slack time and highlights the critical path to contract execution."
        ],
        "situationalPuzzle": {
            "scenario": "Your customer's VP of Operations says: 'We must have this software fully deployed in production by October 1st to support our peak Q4 holiday retail volume.' Today is July 1st. Implementation takes 6 weeks. Historical legal and security review at this customer takes 8 weeks.",
            "options": [
                "Assume the deal will close on September 15th and tell implementation engineers to work weekends to make October 1st.",
                "Build a backward-scheduled Mutual Action Plan: October 1st Go-Live requires August 15th Implementation Kickoff, which requires August 1st Contract Execution, which requires June 15th Legal/Security Kickoff; demonstrate to the customer that legal review must start immediately today to protect their holiday deadline.",
                "Tell the customer October 1st is impossible and suggest postponing the deployment to next year.",
                "Skip legal and security review entirely to ensure the software is deployed on time."
            ],
            "correctOptionIndex": 1,
            "debrief": "Backward scheduling from the customer's compelling event (Q4 retail holiday) creates urgency rooted in their business interests rather than the seller's quota. Demonstrating that contract signature must occur by August 1st to achieve October 1st deployment compels the client's internal team to fast-track legal and security reviews."
        },
        "quests": [
            {
                "id": "Q30.49",
                "name": "Mutual Action Plan Theory & Backward Scheduling Mathematics",
                "type": "Concept",
                "desc": "Formalize the methodology of Mutual Action Plans: critical path analysis, backward scheduling algorithms, milestone ownership matrices, and executive alignment gates."
            },
            {
                "id": "Q30.50",
                "name": "The Missed Critical Path Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Audit 10 enterprise deals that missed their forecasted close dates; identify hidden dependency chains in legal, procurement, and data privacy that were omitted from initial plans."
            },
            {
                "id": "Q30.51",
                "name": "Collaborative Mutual Action Plan Orchestration Engine",
                "type": "Mastery Assignment",
                "desc": "Build a full-featured Mutual Action Plan application supporting live multi-party editing, automated dependency rescheduling, and automated milestone escalation notifications."
            },
            {
                "id": "Q30.52",
                "name": "Critical Legal Bottleneck Escalation Lab",
                "type": "Production Incident Lab",
                "desc": "Manage a high-stakes crisis where a customer's legal team sits on contract redlines for 3 weeks with 10 days remaining before the hard go-live cutoff; execute a joint executive escalation playbook."
            }
        ]
    },
    {
        "day": 14,
        "month": 1,
        "blockNum": 3,
        "title": "Deal Desk Operations: Discount Governance & Gross Margin Protection",
        "stageNum": 3,
        "stageName": "Stage 3: Systems Stress-Testing",
        "pedagogicalRole": "Deal Desk Engineering (Discount Authorization Matrices, Multi-Year Structuring & Gross Margin Integrity)",
        "spokenGoal": "Discounting is a tax paid for poor value articulation. Today we engineer Deal Desk Operations—building mathematical discount authorization matrices, multi-year prepayment structuring, and concession exchange rules that protect gross margin.",
        "conceptInvariant": "Concession Equivalence Invariant: Every price concession granted to an enterprise customer must extract an equal or greater contractual value concession (multi-year term, upfront payment, logo rights, case study commitment, or reduced payment terms).",
        "failureMode": "The 'Race to the Bottom' Margin Collapse: An AE panicking at end-of-quarter grants a 45% discount on an annual contract with zero concessions in return. Word spreads among industry procurement networks, establishing a discounted benchmark that destroys market pricing power across all peer accounts.",
        "tryItFriction": "Execute a quote calculator script where multi-year proration logic fails to compound annual price uplifts, resulting in a 25% revenue loss over a 3-year term.",
        "socraticHints": [
            "Why is granting a unilateral price concession without demanding something in return psychologically destructive to deal perceived value?",
            "How does a multi-tier discount approval matrix (e.g., 0–10% AE, 11–20% VP, 21–35% CRO, >35% CFO/Board) maintain organizational pricing discipline?",
            "Formulate the Net Present Value trade-off between a 1-year annual contract and a 3-year upfront cash discounted contract."
        ],
        "situationalPuzzle": {
            "scenario": "On the 28th of the month, an enterprise procurement officer calls and says: 'We have approved your software, but our policy requires an across-the-board 20% discount on your $200,000 annual price, or we will not sign this quarter.'",
            "options": [
                "Immediately grant the 20% discount to secure the revenue before the quarter ends.",
                "Refuse outright and hang up the phone to show strength.",
                "Execute the concession exchange protocol: 'We cannot discount our annual price, but if you commit to a 3-year agreement with upfront annual billing and agree to participate in a public case study, I can take that package to our Deal Desk for a 15% discount approval.'",
                "Offer a 30% discount if they promise to renew next year at full price."
            ],
            "correctOptionIndex": 2,
            "debrief": "Procurement officers are incentivized to test vendor discipline with arbitrary discount demands. Never concede price unilaterally. Anchoring concessions on structural value exchanges (extending term from 1 to 3 years, securing upfront cash flow, and acquiring public marketing rights) preserves unit economics and increases customer lifetime value (LTV)."
        },
        "quests": [
            {
                "id": "Q30.53",
                "name": "Discount Authorization Matrices & Margin Floor Economics",
                "type": "Concept",
                "desc": "Formulate corporate Deal Desk governance: multi-tier approval thresholds, gross margin hurdle rates, ACV vs TCV trade-offs, and non-price concession playbooks."
            },
            {
                "id": "Q30.54",
                "name": "The Rogue Sales Rep Concession Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Audit 50 executed enterprise contracts; uncover 7 unapproved side-letters and verbal discount promises made by sales reps that violated corporate revenue recognition standards."
            },
            {
                "id": "Q30.55",
                "name": "Enterprise Deal Desk Quoting & Approval Suite",
                "type": "Mastery Assignment",
                "desc": "Build an automated Deal Desk CPQ engine that calculates contract gross margin, evaluates proposed discounts against policy matrices, and routes multi-level approval workflows."
            },
            {
                "id": "Q30.56",
                "name": "Hostile Procurement Hardball Negotiation Lab",
                "type": "Production Incident Lab",
                "desc": "Handle an aggressive quarter-end procurement negotiation for a $750k deal demanding 40% price reduction; execute strategic trade-offs to preserve 92% of deal value."
            }
        ]
    },
    {
        "day": 15,
        "month": 1,
        "blockNum": 3,
        "title": "Milestone 3: ApexDealDesk Scoping & Mutual Action Plan Suite",
        "stageNum": 3,
        "stageName": "Stage 3: Systems Stress-Testing",
        "pedagogicalRole": "Milestone Architectural Synthesis (Integrated Scoping, POC Charters, MAP Orchestration & Deal Desk Governance)",
        "spokenGoal": "Milestone 3: You will architect and ship ApexDealDesk—a mission-critical enterprise deal management platform that unifies technical scoping, time-boxed POC tracking, backward-scheduled Mutual Action Plans, and automated Deal Desk approval workflows.",
        "conceptInvariant": "Deal Governance Invariant: ApexDealDesk must guarantee that no quote is issued to procurement without an approved technical scoping sign-off, a verified POC pass certificate (if applicable), and an authorized Deal Desk discount signature.",
        "failureMode": "Unvetted Contract Ingestion: A rep creates a manual PDF quote overriding standard terms, inserting custom SLA guarantees and 50% discounts; procurement signs it, and the company is legally bound to catastrophic liabilities that cost $2.4M in penalties.",
        "tryItFriction": "Run the ApexDealDesk quote generation pipeline with unapproved concession overrides, causing the cryptographic contract signing service to throw an unhandled security exception.",
        "socraticHints": [
            "How do you enforce cryptographic immutability between Deal Desk approval and the generated client contract artifact?",
            "What automated checks ensure that custom legal and SLA redlines are routed to general counsel before quote generation?",
            "Architect ApexDealDesk with strict role-based access control (RBAC) separating sales reps, sales engineers, and deal desk managers."
        ],
        "situationalPuzzle": {
            "scenario": "A high-performing Enterprise Account Executive bypasses the newly installed ApexDealDesk software, sending an unapproved Word document quote with an unauthorized 35% discount and custom 99.999% uptime SLA directly to an enterprise client on the last day of the fiscal year. The client immediately signs and returns it.",
            "options": [
                "Honor the deal silently and reprimand the rep privately next month.",
                "Enforce executive governance: the Chief Revenue Officer and General Counsel review the contract; if the 99.999% SLA creates existential engineering liability, issue an immediate contract correction addendum to the client explaining the unauthorized terms, while placing the AE on formal disciplinary probation.",
                "Fire the entire engineering team if they fail to achieve 99.999% uptime.",
                "Cancel the contract unilaterally and sue the client for accepting an unauthorized quote."
            ],
            "correctOptionIndex": 1,
            "debrief": "Rogue sales reps committing companies to impossible operational SLAs (99.999% uptime allows only 5 minutes of downtime per year) can bankrupt software companies through SLA breach damages. Strong corporate governance requires immediate executive intervention, contract correction before service delivery, and strict enforcement of deal desk boundaries."
        },
        "quests": [
            {
                "id": "Q30.57",
                "name": "ApexDealDesk Architecture & Domain Model",
                "type": "Concept",
                "desc": "Specify the domain architecture of ApexDealDesk: contract entity schemas, approval state machines, discount policy engines, and cryptographic document stamping."
            },
            {
                "id": "Q30.58",
                "name": "The Unvetted SLA Breach Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Audit an executed customer agreement with ambiguous service level agreements; identify 4 conflicting liability clauses that expose the company to unlimited liquidated damages."
            },
            {
                "id": "Q30.59",
                "name": "ApexDealDesk Platform Core Implementation",
                "type": "Mastery Assignment",
                "desc": "Build the complete ApexDealDesk platform in TypeScript: integration of Technical Scope matrix, POC pass validator, collaborative Mutual Action Plan, and automated approval matrix."
            },
            {
                "id": "Q30.60",
                "name": "Multi-Million Dollar Global Deal Desk War Room",
                "type": "Production Incident Lab",
                "desc": "Lead a live Deal Desk review for a complex $4.2M global multi-subsidiary contract under 3 hours to quarter close; balance pricing, multi-currency invoicing, and SLA risk."
            }
        ]
    }
]

out_path = Path(__file__).resolve().parent / "sales_crm_spec_m1.py"

content = f'''# scripts/visuals/sales_crm_spec_m1.py
# Month 1: Days 1 to 15 Specification for Course 30: Enterprise B2B Sales, Customer Success & CRM Systems Architecture (course-sales-crm-success)
# Conforms strictly to Gate v2 / True 9.8 standard across all 15 days (60 Quests).

DAYS_1_TO_15 = {json.dumps(days_data, indent=2)}
'''

with open(out_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Successfully generated {out_path} with {len(days_data)} days ({sum(len(d['quests']) for d in days_data)} quests).")
