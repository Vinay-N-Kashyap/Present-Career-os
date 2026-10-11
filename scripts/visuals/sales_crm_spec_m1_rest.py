# scripts/visuals/sales_crm_spec_m1_rest.py
# Month 1: Days 16 to 30 Specification for Course 30: Enterprise B2B Sales, Customer Success & CRM Systems Architecture (course-sales-crm-success)
# Conforms strictly to Gate v2 / True 9.8 standard across all 15 days (60 Quests).

DAYS_16_TO_30 = [
  {
    "day": 16,
    "month": 1,
    "blockNum": 4,
    "title": "Enterprise MSA & SOW Redlining: Contract Topology & Fallback Positions",
    "stageNum": 3,
    "stageName": "Stage 3: Systems Stress-Testing",
    "pedagogicalRole": "Contractual Legal Architecture (Master Service Agreements, SOW Scope Definition & Redline Playbooks)",
    "spokenGoal": "Deals aren't closed when sales says yes; they are closed when legal signs the Master Service Agreement. Today we engineer the contract negotiation redlining playbook, establishing primary, secondary, and walk-away fallback positions for every contractual clause.",
    "conceptInvariant": "Contract Fallback Invariant: Every redline negotiation must operate within a bounded clause fallback graph; deviations beyond predetermined walk-away boundaries require formal General Counsel and CFO dual authorization.",
    "failureMode": "Unlimited liability trap: An AE accepts customer procurement redlines striking out the standard 12-month limitation of liability cap; 8 months later, a customer data breach occurs, and the software company faces an uninsurable $50M liability claim.",
    "tryItFriction": "Simulate a contract clause redline analyzer that flags modified payment terms but fails to alert when a mutual indemnification clause is made unilateral.",
    "socraticHints": [
      "Why is Limitation of Liability (LoL) typically capped at 12 months of fees paid, and what are the standard 'super-cap' carve-outs (gross negligence, data privacy, confidentiality)?",
      "What is the operational distinction between a Master Service Agreement (governing legal terms) and a Statement of Work (governing deliverables and timelines)?",
      "Construct a fallback table mapping clause categories to approved legal alternate language."
    ],
    "situationalPuzzle": {
      "scenario": "An enterprise client's general counsel redlines your standard SaaS Master Service Agreement, demanding: 1) An uncapped limitation of liability for any system outage, 2) Net 90 payment terms instead of Net 30, and 3) A clause granting them complete ownership of any software improvements or custom configurations developed during the contract term.",
      "options": [
        "Sign the redlines immediately without changes because the deal is worth $500,000.",
        "Execute the standard fallback playbook: cap liability at 2x annual contract value (ACV) for data breaches and 1x ACV for general claims, compromise on Net 45 payment terms, and firmly reject IP transfer while offering an irrevocable, non-exclusive license to utilize custom configurations during the subscription term.",
        "Cross out all customer redlines and return the original contract with a note saying 'take it or leave it.'",
        "Agree to the uncapped liability but ask for an extra $5,000 in software fees."
      ],
      "correctOptionIndex": 1,
      "debrief": "Uncapped liability and assignment of intellectual property are existential company risks. A skilled enterprise negotiator uses structured fallbacks: offering reasonable super-caps (e.g., 2x ACV) for security events while fiercely protecting core IP ownership and compromising on operational terms like Net 45."
    },
    "quests": [
      {
        "id": "Q30.61",
        "name": "Contract Architecture & Clause Fallback Framework",
        "type": "Concept",
        "desc": "Deconstruct core enterprise SaaS contract clauses: Limitation of Liability, Indemnification, Intellectual Property, Warranties, Termination for Convenience, and Payment Terms."
      },
      {
        "id": "Q30.62",
        "name": "The Toxic Contract Redline Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Audit 5 customer-redlined enterprise contracts; identify 4 subtle clauses where procurement attempted to transfer core IP and slip in unlimited consequential damages."
      },
      {
        "id": "Q30.63",
        "name": "Automated Contract Redline & Fallback Recommendation Engine",
        "type": "Mastery Assignment",
        "desc": "Build an automated contract analysis tool that ingests redlined Word/PDF documents, identifies clause deviations from standard MSAs, and recommends pre-approved legal fallback language."
      },
      {
        "id": "Q30.64",
        "name": "Midnight Quarter-End Legal Standoff War Room",
        "type": "Production Incident Lab",
        "desc": "Resolve a high-stakes midnight contract dispute with Fortune 100 enterprise legal counsel over data privacy indemnification 2 hours before fiscal year close."
      }
    ]
  },
  {
    "day": 17,
    "month": 1,
    "blockNum": 4,
    "title": "Legal Risk Allocation: Indemnification, Limitation of Liability & SLA Carve-Outs",
    "stageNum": 3,
    "stageName": "Stage 3: Systems Stress-Testing",
    "pedagogicalRole": "Risk Engineering (Indemnity Obligations, Consequential Damage Exclusions & Service Level Credit Physics)",
    "spokenGoal": "Enterprise sales contracts are risk-allocation instruments. Today we master the mechanics of indemnification, consequential damage waivers, and SLA service credits to ensure our software company never assumes unhedged operational risk.",
    "conceptInvariant": "Risk Allocation Invariant: Service Level Agreement (SLA) remedies must strictly be limited to tiered service credits as the sole and exclusive financial remedy, explicitly excluding consequential damages and contract breach claims.",
    "failureMode": "SLA Cash Payout Disaster: A sales team agrees to customer-drafted SLA terms where system downtime results in direct cash refunds rather than service credits against future renewals; an AWS multi-AZ outage results in a $1.2M cash drain that triggers liquidity distress.",
    "tryItFriction": "Execute an SLA service credit calculator where downtime during scheduled maintenance windows fails to be excluded, resulting in false credit penalties of 50%.",
    "socraticHints": [
      "Why must scheduled maintenance and third-party upstream cloud outages (AWS/GCP/Azure) be explicitly carved out of SLA uptime calculations?",
      "What is the crucial legal distinction between direct damages and indirect/consequential damages (lost profits, lost business opportunities)?",
      "Draft a standard SLA credit matrix showing uptime tiers (e.g., 99.9% = 0 credit, 99.0\u201399.89% = 10% credit, <95% = 25% credit)."
    ],
    "situationalPuzzle": {
      "scenario": "A prospective enterprise bank demands that your SLA include a 100% uptime guarantee, with an agreement that if the system experiences more than 15 minutes of cumulative downtime in any month, the bank has the right to immediately terminate the contract and claim $2,000,000 in liquidated damages for lost trading revenue.",
      "options": [
        "Accept the clause because the engineering team claims the software runs in a redundant multi-region cloud cluster.",
        "Counter with standard enterprise SaaS risk architecture: commit to a 99.9% monthly uptime target (allowing ~43 minutes of unplanned downtime), carve out force majeure and scheduled maintenance, establish tiered service credits as the sole and exclusive remedy, and maintain an explicit mutual exclusion of consequential damages and lost profits.",
        "Offer a 99.999% SLA with no exclusions if the bank pays a 5% price premium.",
        "Agree to the $2,000,000 liquidated damages clause but ask for 48 hours notice before downtime."
      ],
      "correctOptionIndex": 1,
      "debrief": "No cloud system is immune to catastrophic failure. Agreeing to liquidated damages for lost third-party revenue creates uncapped existential liability. Enterprise software standard practice mandates service credits as the sole and exclusive remedy, paired with rigorous consequential damage waivers."
    },
    "quests": [
      {
        "id": "Q30.65",
        "name": "Indemnity & Consequential Damage Legal Topology",
        "type": "Concept",
        "desc": "Map the legal taxonomy of indemnification (IP infringement defense vs data breach indemnity), consequential damage waivers, and sole-remedy SLA provisions."
      },
      {
        "id": "Q30.66",
        "name": "The Uncapped Liquidated Damages Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Examine 8 legacy customer MSAs to identify 2 hidden agreements that failed to include sole-remedy clauses, exposing the company to breach lawsuits during past outages."
      },
      {
        "id": "Q30.67",
        "name": "Algorithmic SLA Credit & Risk Exposure Simulator",
        "type": "Mastery Assignment",
        "desc": "Build an SLA financial exposure simulator that models uptime distribution probabilities, scheduled maintenance windows, and calculates maximum annual service credit liabilities."
      },
      {
        "id": "Q30.68",
        "name": "Global Cloud Outage SLA Credit Settlement Lab",
        "type": "Production Incident Lab",
        "desc": "Simulate customer negotiations following a 4-hour global cloud outage; calculate SLA service credits across 120 enterprise accounts and defend against 5 claims for cash damages."
      }
    ]
  },
  {
    "day": 18,
    "month": 1,
    "blockNum": 4,
    "title": "Security & Compliance Audits: SOC 2 Type II, ISO 27001 & Vendor Risk Assessments",
    "stageNum": 3,
    "stageName": "Stage 3: Systems Stress-Testing",
    "pedagogicalRole": "Information Security Clearance Architecture (SOC 2 Reports, ISO 27001 Certification & 300-Question Vendor Risk Assessments)",
    "spokenGoal": "Enterprise software sales cannot cross the finish line without passing the CISO's Vendor Risk Assessment (VRA). Today we engineer the automated compliance architecture\u2014streamlining SOC 2 Type II reports, penetration test disclosures, and SIG questionnaire responses.",
    "conceptInvariant": "Security Clearance Invariant: A security questionnaire response must never deviate from verified third-party audit artifacts (SOC 2 Type II, ISO 27001, FedRAMP, penetration test summaries); ungrounded security affirmations create fraud liability.",
    "failureMode": "Security Misrepresentation Disaster: A sales rep checks 'Yes' to 'Do you encrypt data at rest with customer-managed keys (BYOK)?' on a bank's security questionnaire. During an annual security audit, the bank discovers keys are managed globally by AWS KMS without customer rotation, triggering an immediate security breach declaration and contract termination.",
    "tryItFriction": "Run an automated security questionnaire answering script where conflicting answers regarding data retention policies trigger automated compliance audit rejections.",
    "socraticHints": [
      "What is the difference between a SOC 2 Type I report (point-in-time design) and a SOC 2 Type II report (operating effectiveness over 6\u201312 months)?",
      "How do you streamline standard security questionnaires (CAIQ, SIG, VSAQ) using a verified, single-source-of-truth compliance repository?",
      "Structure an enterprise Trust Center architecture with NDA-gated document access."
    ],
    "situationalPuzzle": {
      "scenario": "A prospective global healthcare client sends a 450-question Vendor Risk Assessment (VRA) requiring answers within 5 business days. The AE is anxious to close the deal before month-end and suggests that the sales team 'just check YES to everything' so procurement can issue the purchase order.",
      "options": [
        "Follow the AE's suggestion and check 'Yes' to all questions to eliminate friction.",
        "Intervene immediately: mandate that all 450 questions be answered using verified Trust Center documentation and SOC 2 Type II controls; for unsupported features (e.g., on-premise air-gapped deployment), accurately answer 'No' while highlighting compensating cloud controls and HIPAA BAA compliance.",
        "Send back an empty questionnaire and tell the healthcare client that SOC 2 makes questions redundant.",
        "Hire an external freelancer on Upwork to fill out the security questionnaire without review."
      ],
      "correctOptionIndex": 1,
      "debrief": "Falsifying security questionnaires constitutes legal fraud and voids cyber insurance coverage. In regulated industries (healthcare, finance), audits will uncover false claims, leading to immediate termination, public reputational damage, and massive regulatory fines. Truthful responses backed by compensating controls build enduring enterprise trust."
    },
    "quests": [
      {
        "id": "Q30.69",
        "name": "Enterprise Security Certification Taxonomy (SOC 2, ISO, FedRAMP)",
        "type": "Concept",
        "desc": "Map out the core security frameworks governing enterprise software procurement: SOC 2 Trust Services Criteria, ISO 27001 ISMS, GDPR/HIPAA mandates, and CAIQ/SIG standards."
      },
      {
        "id": "Q30.70",
        "name": "The Fraudulent Security Questionnaire Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Audit 10 completed vendor security assessments against actual engineering architecture; uncover 5 false positive answers that misstated encryption key management."
      },
      {
        "id": "Q30.71",
        "name": "Automated Trust Center & Security Questionnaire Engine",
        "type": "Mastery Assignment",
        "desc": "Build an AI-grounded Vendor Risk Assessment responder that ingests raw questionnaires (SIG, VSAQ, CAIQ), matches questions against verified SOC 2 audit policies, and exports audit-ready responses."
      },
      {
        "id": "Q30.72",
        "name": "Live CISO Deep-Dive Security Interrogation Lab",
        "type": "Production Incident Lab",
        "desc": "Participate in a simulated live security audit with a hostile enterprise CISO; defend multi-tenant database isolation, RBAC controls, and disaster recovery RTO/RPO metrics."
      }
    ]
  },
  {
    "day": 19,
    "month": 1,
    "blockNum": 4,
    "title": "B2B Sales Forecasting Calculus & Pipeline Velocity Physics",
    "stageNum": 3,
    "stageName": "Stage 3: Systems Stress-Testing",
    "pedagogicalRole": "Quantitative Pipeline Science (Sales Velocity Equation, Stage Conversion Matrices & Weighted Probability Modeling)",
    "spokenGoal": "Forecasting is an applied mathematical science, not a guessing game. Today we implement the Sales Velocity Equation and stochastic Markov pipeline transition matrices to forecast enterprise revenue with less than 5% variance.",
    "conceptInvariant": "Sales Velocity Invariant: Revenue generation rate is strictly defined by $V = \\frac{N \\times W \\times V_{avg}}{L}$, where $N$ is qualified opportunities, $W$ is win rate, $V_{avg}$ is average deal size, and $L$ is sales cycle length in days.",
    "failureMode": "The 50% Forecast Miss: A VP of Sales reports a $10M quarterly commit to the board by simply multiplying pipeline stage probabilities by deal sizes ($P \\times ACV$). Because stalled 'zombie' deals with cycle lengths $> 360$ days were included without age-decay penalties, actual closed revenue is $4.8M, resulting in the VP's immediate termination.",
    "tryItFriction": "Run a pipeline velocity calculation script where sales cycle length ($L$) in the denominator is measured in months instead of days, exaggerating velocity by a factor of 30.",
    "socraticHints": [
      "Why does the classical static probability model (e.g., Stage 3 = always 50%) fail catastrophically when applied to aging deals?",
      "How does applying an exponential age-decay half-life ($P(t) = P_0 \\cdot e^{-\\lambda t}$) protect forecasting integrity?",
      "Formulate the Markov chain transition matrix for opportunity progression and absorption into Closed-Won or Closed-Lost."
    ],
    "situationalPuzzle": {
      "scenario": "Your sales organization has $20,000,000 in unweighted pipeline. The team currently wins 25% of deals, with an average deal size of $100,000 and an average sales cycle of 90 days (100 active opportunities). The CEO demands a plan to double revenue velocity next quarter.",
      "options": [
        "Tell sales reps to work twice as many hours to double deal volume ($N$).",
        "Model the Sales Velocity equation: double velocity ($V$) by achieving four simultaneous 19% improvements across all levers (increase qualified deals $N$ by 19%, improve win rate $W$ from 25% to 30%, increase $V_{avg}$ to $119k via multi-product bundling, and shorten cycle length $L$ from 90 to 73 days via Mutual Action Plans).",
        "Double the list price of the software to $200,000 while keeping all other variables constant.",
        "Artificially mark all deals in the CRM as having a 90% probability of closing."
      ],
      "correctOptionIndex": 1,
      "debrief": "Because Sales Velocity is multiplicative ($V = \\frac{N \\times W \\times V_{avg}}{L}$), attempting to double a single variable (e.g., doubling lead volume) causes severe diminishing returns and rep burnout. Compound engineering\u2014small, disciplined gains of ~19% across all 4 levers ($1.19^4 \\approx 2.0$)\u2014safely doubles velocity without systemic collapse."
    },
    "quests": [
      {
        "id": "Q30.73",
        "name": "Sales Velocity Dynamics & Markov Pipeline Physics",
        "type": "Concept",
        "desc": "Derive the mathematics of the Sales Velocity Equation and formulate Markov chain state transitions for enterprise pipeline forecasting."
      },
      {
        "id": "Q30.74",
        "name": "The Distorted Forecast Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Audit a historical CRM database containing 500 opportunities; identify how static probability scoring masked pipeline rot and caused a $4M quarterly forecast miss."
      },
      {
        "id": "Q30.75",
        "name": "Algorithmic Pipeline Velocity & Stochastic Forecast Engine",
        "type": "Mastery Assignment",
        "desc": "Build a Python/TypeScript pipeline forecasting simulator that applies deal age decay, rep win-rate history, and Monte Carlo iterations to project revenue distributions."
      },
      {
        "id": "Q30.76",
        "name": "Board-Level Quarterly Forecast Restatement Lab",
        "type": "Production Incident Lab",
        "desc": "Step into a simulated board meeting where mid-quarter pipeline slippage threatens public guidance; re-forecast revenue with 95% confidence intervals and present an emergency pipeline acceleration plan."
      }
    ]
  },
  {
    "day": 20,
    "month": 1,
    "blockNum": 4,
    "title": "Milestone 4: ApexLegal Contract Redlining & Velocity Forecasting Engine",
    "stageNum": 3,
    "stageName": "Stage 3: Systems Stress-Testing",
    "pedagogicalRole": "Milestone Architectural Synthesis (Integrated Contract Analysis, Risk Gating & Pipeline Velocity Analytics)",
    "spokenGoal": "Milestone 4: You will architect and deploy ApexLegal\u2014a dual-engine platform uniting contract redline risk analysis with algorithmic sales velocity forecasting, providing real-time deal risk scoring and board-grade revenue projections.",
    "conceptInvariant": "Contract-Velocity Coherence Invariant: ApexLegal must ensure that no forecasted revenue is categorized as 'Commit' if the associated contract artifact carries unapproved legal or SLA risk flags.",
    "failureMode": "Phantom Commit Board Crash: ApexLegal forecasts $8M in commit revenue, but 3 deals totaling $4.5M carry critical uncapped indemnity redlines that general counsel subsequently refuses to sign on the final day of the quarter, triggering board outrage.",
    "tryItFriction": "Execute the integrated ApexLegal suite with misaligned stage-to-contract schema definitions, causing legal risk flags to be ignored in the executive pipeline dashboard.",
    "socraticHints": [
      "How do you mathematically integrate legal redline risk scores into weighted pipeline probability distributions?",
      "What automated alerts trigger when a deal's sales cycle length exceeds $2 \\times$ the historical cohort mean?",
      "Architect ApexLegal with decoupled micro-modules: Contract Ingestion, Clause Risk Scorer, Velocity Calculator, and Monte Carlo Predictor."
    ],
    "situationalPuzzle": {
      "scenario": "You are presenting the ApexLegal dashboard to the Executive Committee. A $1.5M deal is listed in 'Commit' for closing this Friday. The ApexLegal Contract Risk Scorer flags that the customer's legal team has inserted an unapproved uncapped liability clause that General Counsel has already rejected twice. The VP of Sales demands that General Counsel 'just sign it' to hit the quarterly target.",
      "options": [
        "Force General Counsel to sign the contract because hitting the quarterly revenue target is the company's highest priority.",
        "Support General Counsel: downgrade the deal from 'Commit' to 'Best Case' in the board forecast, and dispatch the VP of Sales and General Counsel together to hold an executive-to-executive call with the customer's Chief Legal Officer to execute a pre-approved super-cap compromise.",
        "Allow the AE to sign the contract without General Counsel's signature.",
        "Delete the contract from ApexLegal so the risk flag disappears from the executive dashboard."
      ],
      "correctOptionIndex": 1,
      "debrief": "Never compromise enterprise fiduciary integrity for end-of-quarter revenue. Uncapped liability can liquidate a growing tech company in a single breach. Downgrading the forecast protects board honesty, while senior executive alignment (pairing sales leadership with legal leadership) resolves legal stalemates without accepting catastrophic terms."
    },
    "quests": [
      {
        "id": "Q30.77",
        "name": "ApexLegal System Specification & Domain Schemas",
        "type": "Concept",
        "desc": "Author the complete architectural specification for ApexLegal: clause ontology, legal risk scoring algorithms, velocity math, and Monte Carlo forecast parameters."
      },
      {
        "id": "Q30.78",
        "name": "The Hidden Redline & Rotting Deal Audit",
        "type": "Detective Challenge",
        "desc": "Audit an integrated dataset of 40 active contracts and pipeline opportunities; uncover 4 deals with hidden uncapped liability redlines and 6 deals suffering from severe pipeline rot."
      },
      {
        "id": "Q30.79",
        "name": "ApexLegal Core Engine Implementation",
        "type": "Mastery Assignment",
        "desc": "Build the complete ApexLegal platform in TypeScript/Python: automated redline clause scoring, risk-adjusted pipeline weighting, and Monte Carlo revenue distribution outputs."
      },
      {
        "id": "Q30.80",
        "name": "Live Quarter-End Revenue Guidance Defense War Room",
        "type": "Production Incident Lab",
        "desc": "Defend the quarterly revenue forecast before simulated board directors under extreme volatility; adjust for 2 slipped mega-deals in real time using ApexLegal analytics."
      }
    ]
  },
  {
    "day": 21,
    "month": 1,
    "blockNum": 5,
    "title": "Multi-Year Enterprise Closing Dynamics: Prepayment vs Annual Invoicing & Escrow",
    "stageNum": 3,
    "stageName": "Stage 3: Systems Stress-Testing",
    "pedagogicalRole": "Contract Commercial Structuring (Multi-Year Contract Economics, Upfront Cash Flow Optimization & Escrow Arrangements)",
    "spokenGoal": "Annual recurring revenue is great, but multi-year upfront cash is king. Today we engineer commercial contract structuring\u2014evaluating the trade-offs between annual billing, multi-year prepayment discounts, source code escrow, and working capital acceleration.",
    "conceptInvariant": "Working Capital Invariant: A multi-year prepayment discount is economically rational if and only if the discounted upfront cash flow yields a lower cost of capital than the company's alternative cost of debt or equity financing.",
    "failureMode": "The 50% Cash Drain Multi-Year Trap: An AE offers a 40% discount for a 3-year commitment, but allows annual payment terms with a termination-for-convenience clause; the customer cancels after 12 months, locking in the 40% discount while denying the company upfront cash or multi-year revenue.",
    "tryItFriction": "Construct a contract cash-flow discounting model where discount rates are applied to nominal contract values without compounding annual inflation uplifts.",
    "socraticHints": [
      "Why must a multi-year contract with annual billing always explicitly prohibit termination for convenience (or require 100% early termination fee liquidated damages)?",
      "Under what conditions should an enterprise software company offer a source code escrow agreement (e.g., NCC Group/Iron Mountain)?",
      "Formulate the Net Present Value trade-off between receiving $100k/year for 3 years versus $250k upfront on Day 1."
    ],
    "situationalPuzzle": {
      "scenario": "An enterprise client negotiating a 3-year software contract asks for: 1) A 25% discount off the $100,000 annual list price ($75,000/yr), 2) Annual invoicing instead of multi-year upfront, and 3) The right to terminate the contract at any time for convenience with 30 days notice.",
      "options": [
        "Accept all terms immediately to book the $225,000 Total Contract Value (TCV).",
        "Reject the package: explain that a 25% multi-year discount is conditional upon either 100% upfront payment ($225,000 cash on Day 1) or, if billed annually, must be non-cancelable with zero termination for convenience, ensuring a legally binding 3-year revenue guarantee.",
        "Offer a 40% discount if they agree to pay semi-annually.",
        "Agree to termination for convenience but ask them to promise verbally that they won't cancel."
      ],
      "correctOptionIndex": 1,
      "debrief": "A multi-year contract that permits termination for convenience without early termination fees is simply a 1-year contract masquerading as a multi-year deal with an unearned discount. True multi-year commitments require either upfront cash acceleration or non-cancelable annual commitments that guarantee enforceable revenue."
    },
    "quests": [
      {
        "id": "Q30.81",
        "name": "Multi-Year Contract Structuring & Working Capital Math",
        "type": "Concept",
        "desc": "Analyze the financial mechanics of multi-year contracts: Annual Contract Value (ACV) vs Total Contract Value (TCV), upfront cash discounting physics, and termination clause structuring."
      },
      {
        "id": "Q30.82",
        "name": "The Illusory Multi-Year Commitment Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Audit 20 multi-year contracts in a SaaS portfolio; uncover 6 agreements that contained termination-for-convenience loopholes that cost the company $1.8M in lost backlog."
      },
      {
        "id": "Q30.83",
        "name": "Multi-Year Commercial Deal Structuring & NPV Simulator",
        "type": "Mastery Assignment",
        "desc": "Build an interactive contract pricing simulator that models customer cash flows, calculates vendor working capital benefits of multi-year prepayments, and generates optimal discount tiers."
      },
      {
        "id": "Q30.84",
        "name": "High-Stakes Source Code Escrow Negotiation Lab",
        "type": "Production Incident Lab",
        "desc": "Negotiate a software escrow agreement with a paranoid enterprise bank; establish rigorous release condition triggers (bankruptcy, liquidation) while shielding proprietary trade secrets."
      }
    ]
  },
  {
    "day": 22,
    "month": 1,
    "blockNum": 5,
    "title": "CFO Capital Allocation & Budget Cycles: CapEx vs OpEx Accounting",
    "stageNum": 3,
    "stageName": "Stage 3: Systems Stress-Testing",
    "pedagogicalRole": "Corporate Financial Navigation (Capital vs Operating Expenditure, Fiscal Calendar Cycles & Budget Exhaustion)",
    "spokenGoal": "To sell to the enterprise, you must think like the CFO. Today we deconstruct corporate financial accounting\u2014distinguishing between Capital Expenditures (CapEx) and Operating Expenditures (OpEx), capitalizing software development, and exploiting fiscal year-end budget flush dynamics.",
    "conceptInvariant": "Budget Cycle Invariant: Enterprise buying friction drops to near zero during 'use-it-or-lose-it' fiscal year-end budget flushes, provided the contract structure perfectly aligns with the customer's available expenditure category (CapEx vs OpEx).",
    "failureMode": "The Wrong Budget Bucket Rejection: A sales rep pitches a multi-year on-premise perpetual license requiring $1M in CapEx to a company whose board has mandated a freeze on all capital expenditures, completely unaware that the customer had $2M in unspent operational OpEx budget.",
    "tryItFriction": "Build an enterprise fiscal calendar tracker where customer fiscal years ending in January (retail) or September (federal government) fail to trigger timely year-end budget flush playbooks.",
    "socraticHints": [
      "Why do some enterprises prefer OpEx (subscription SaaS) while others prefer CapEx (capitalized perpetual software with amortized depreciation)?",
      "What creates the 'use-it-or-lose-it' dynamic in enterprise departmental budgets at the close of Q4?",
      "How do you structure contract invoices to split licensing across multiple fiscal budget periods?"
    ],
    "situationalPuzzle": {
      "scenario": "It is November 15th. You are working with a Fortune 500 retailer whose fiscal year ends January 31st. The VP of IT has $350,000 in unallocated departmental OpEx budget that will expire and be swept away by corporate finance on January 31st if unspent. Your standard contract is $500,000 for a 1-year license starting in March.",
      "options": [
        "Wait until March to start negotiations when their next annual budget becomes active.",
        "Structure a two-phase commercial agreement: execute an immediate $350,000 invoice for enterprise onboarding, architectural design, and Q4 software access to exhaust their expiring budget before January 31st, paired with a $150,000 renewal invoice co-termed for the new fiscal year.",
        "Tell the VP to return the $350,000 to corporate finance to show fiscal discipline.",
        "Ask the customer to pay you the $350,000 into a personal holding account."
      ],
      "correctOptionIndex": 1,
      "debrief": "Departmental leaders hate losing budget because finance will reduce their allocation for the following year ('use-it-or-lose-it'). By structuring an immediate year-end invoice to absorb the expiring funds, you solve their internal political problem while securing $350k in immediate cash flow and locking in the long-term enterprise relationship."
    },
    "quests": [
      {
        "id": "Q30.85",
        "name": "Corporate Capital Allocation & Fiscal Calendars",
        "type": "Concept",
        "desc": "Map out the corporate finance landscape: CapEx vs OpEx accounting rules (ASC 350-40, ASC 606), departmental budget allocation cycles, and fiscal calendar variations."
      },
      {
        "id": "Q30.86",
        "name": "The Misaligned Expenditure Bucket Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Investigate 12 lost enterprise opportunities; identify 5 deals that stalled because the vendor attempted to bill as CapEx during an enterprise capital freeze."
      },
      {
        "id": "Q30.87",
        "name": "Fiscal Calendar & Budget Flush Timing Orchestrator",
        "type": "Mastery Assignment",
        "desc": "Build a target account fiscal calendar tracker that maps 500 enterprise fiscal year-ends, predicts budget flush windows, and triggers automated executive sales campaigns."
      },
      {
        "id": "Q30.88",
        "name": "48-Hour Year-End Budget Flush Capture Lab",
        "type": "Production Incident Lab",
        "desc": "Execute a live transaction sprint where a government agency client notifies you on December 29th that they have $600k in unspent funds that must be invoiced and paid before midnight December 31st."
      }
    ]
  },
  {
    "day": 23,
    "month": 1,
    "blockNum": 5,
    "title": "Partner & Channel Sales Co-Selling Dynamics: Resellers, SIs & Technology Alliances",
    "stageNum": 3,
    "stageName": "Stage 3: Systems Stress-Testing",
    "pedagogicalRole": "Ecosystem Distribution Architecture (Channel Partners, Global Systems Integrators (GSIs) & Co-Selling Dynamics)",
    "spokenGoal": "Enterprise sales at scale is played through ecosystems. Today we architect channel sales and technology alliances\u2014aligning with Global Systems Integrators (Accenture, Deloitte, PwC), cloud hyperscalers (AWS/Azure/GCP), and value-added resellers (VARs).",
    "conceptInvariant": "Channel Alignment Invariant: A channel partner or Systems Integrator will co-sell your software if and only if every $1 of software licensing drives $\\ge $3 to $5 of high-margin professional services for their consulting practice.",
    "failureMode": "The GSI Channel Cannibalization War: An enterprise sales rep sells proprietary implementation services directly to an account, cutting out the lead Deloitte consulting team that introduced the opportunity; Deloitte immediately introduces a competitor software into 15 other enterprise accounts in retaliation.",
    "tryItFriction": "Run a channel deal registration portal where duplicate lead submissions from competing partners trigger unhandled database locking deadlocks.",
    "socraticHints": [
      "What is the 'Services-to-Software Multiple' (Attach Rate) that drives GSI partner motivation?",
      "How does Cloud Marketplace procurement (e.g., AWS EDP / Azure MACC drawdown) eliminate enterprise procurement and legal friction?",
      "Formulate deal registration conflict resolution rules protecting partner investment."
    ],
    "situationalPuzzle": {
      "scenario": "An enterprise client has a $10M cloud commitment drawdown agreement with AWS (EDP) and insists that they can only buy your $400,000 software if it is procured through the AWS Marketplace. Your direct sales commission plan currently penalizes marketplace deals by 20%.",
      "options": [
        "Refuse to sell through AWS Marketplace and demand that the customer sign a direct paper contract.",
        "Embrace the marketplace transaction: demonstrate to executive leadership that routing through AWS Marketplace accelerates procurement from 12 weeks to 48 hours, draws down the customer's pre-allocated budget, and eliminates security/vendor onboarding friction; advocate for commission parity for marketplace co-sell deals.",
        "Tell the customer to cancel their AWS EDP agreement.",
        "Offer a 50% discount if the customer agrees to bypass AWS."
      ],
      "correctOptionIndex": 1,
      "debrief": "Hyperscaler marketplaces (AWS, Azure, GCP) are the modern fast lane of enterprise software procurement. Because enterprise customers already have pre-committed budgets (EDP/MACC) that they must burn to avoid penalties, buying through the marketplace bypasses legal, infosec, and procurement hurdles. Modern RevOps teams ensure full commission parity on marketplace transactions."
    },
    "quests": [
      {
        "id": "Q30.89",
        "name": "Ecosystem Partner Architecture & Economic Attach Models",
        "type": "Concept",
        "desc": "Map out channel partner archetypes: Global Systems Integrators (GSIs), Value Added Resellers (VARs), Hyperscaler Marketplaces, and ISV Technology Alliances."
      },
      {
        "id": "Q30.90",
        "name": "The Channel Conflict Collision Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Investigate a high-stakes channel dispute where a direct AE and a premier partner registered the same $2M healthcare opportunity on the same day; analyze audit logs to determine origin."
      },
      {
        "id": "Q30.91",
        "name": "Partner Portal & Deal Registration Orchestrator",
        "type": "Mastery Assignment",
        "desc": "Build an enterprise Partner Portal supporting automated deal registration, conflict detection, co-sell tagging, and cloud marketplace private offer generation."
      },
      {
        "id": "Q30.92",
        "name": "Global GSI Co-Selling Steering Committee Lab",
        "type": "Production Incident Lab",
        "desc": "Lead a high-stakes alignment session with an Accenture partner team on a $5M digital transformation deal; structure the software vs professional services boundary to achieve partner buy-in."
      }
    ]
  },
  {
    "day": 24,
    "month": 1,
    "blockNum": 5,
    "title": "Territory Design, Account Balancing & Gini Coefficient Quota Distribution",
    "stageNum": 3,
    "stageName": "Stage 3: Systems Stress-Testing",
    "pedagogicalRole": "Territory Engineering (Algorithmic Territory Balancing, Total Addressable Opportunity & Quota Gini Minimization)",
    "spokenGoal": "Unfair sales territories create demotivated reps, high attrition, and sub-optimal revenue. Today we engineer territory design as an optimization problem\u2014using account potential scoring, industry clustering, and Gini coefficient minimization to distribute quota equitably.",
    "conceptInvariant": "Territory Equity Invariant: Sales territories are balanced if and only if the Gini coefficient of Total Addressable Account Potential across all rep patches satisfies $G \\le 0.15$, ensuring equal earning opportunity.",
    "failureMode": "The 'Golden Territory' Mutiny: A sales leader assigns all Tier-1 Fortune 100 accounts to their favorite senior rep while giving mid-tier accounts to other reps. The favored rep hits 400% of quota without cold-calling, while 7 top reps fail quota and quit simultaneously, cratering regional performance.",
    "tryItFriction": "Run a territory optimization script where geographic zip-code partitioning assigns 90% of tech accounts to Silicon Valley reps, starving East Coast reps of qualified pipeline.",
    "socraticHints": [
      "Why is geographic territory design obsolete for enterprise B2B software compared to industry-verticalized, account-tier balancing?",
      "How does the Gini coefficient ($G = \\frac{\\sum_{i=1}^n \\sum_{j=1}^n |x_i - x_j|}{2n^2 \\bar{x}}$) measure inequality in sales territory potential?",
      "Design an integer programming model that balances account potential while minimizing rep transition disruption."
    ],
    "situationalPuzzle": {
      "scenario": "You are redesigning sales territories for 20 Enterprise AEs. The existing structure is purely geographic (States). The California rep has $45M in addressable pipeline potential in their patch, while the Ohio rep has only $3.5M. The Ohio rep is a top performer who missed quota, while the California rep is an underperformer who exceeded quota.",
      "options": [
        "Leave territories unchanged because geographic boundaries are clean and easy to understand.",
        "Transition from geographic territories to an algorithmic named-account tiering model: calculate enterprise account potential scores nationwide, distribute equal portfolios of Tier 1 (Enterprise), Tier 2 (Growth), and Tier 3 (Nurture) accounts to each rep, driving the Gini coefficient below 0.12.",
        "Fire the Ohio rep for missing quota.",
        "Give all 20 reps the entire United States as an open territory with no boundaries."
      ],
      "correctOptionIndex": 1,
      "debrief": "Purely geographic territories in software create massive structural inequality because tech and enterprise headquarters cluster heavily in specific regions. Moving to balanced named-account portfolios equalizes addressable opportunity, aligns rep effort with performance, and prevents top-talent attrition."
    },
    "quests": [
      {
        "id": "Q30.93",
        "name": "Territory Design Mathematics & Gini Inequality Metrics",
        "type": "Concept",
        "desc": "Formulate the quantitative mathematics of sales territory planning: Account Scoring Index, Gini coefficient optimization, workload constraints, and named account models."
      },
      {
        "id": "Q30.94",
        "name": "The Unbalanced Territory Attrition Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Analyze historical rep quota attainment and territory data across 50 sales reps; demonstrate how territory inequality (Gini > 0.45) directly caused an 80% sales rep turnover."
      },
      {
        "id": "Q30.95",
        "name": "Algorithmic Territory Optimization & Balancing Engine",
        "type": "Mastery Assignment",
        "desc": "Build an algorithmic territory balancing platform in Python/TypeScript that ingests 5,000 corporate accounts and partitions them into 20 equalized patches minimizing the Gini coefficient."
      },
      {
        "id": "Q30.96",
        "name": "Annual Territory Realignment Conflict War Room",
        "type": "Production Incident Lab",
        "desc": "Manage the contentious annual sales territory rollout; resolve 5 executive disputes from senior reps resisting named-account carve-outs with mathematical equity proofs."
      }
    ]
  },
  {
    "day": 25,
    "month": 1,
    "blockNum": 5,
    "title": "Sales Compensation Engineering & Milestone 5: ApexComp Incentive Suite",
    "stageNum": 3,
    "stageName": "Stage 3: Systems Stress-Testing",
    "pedagogicalRole": "Incentive Mechanics & Milestone Synthesis (On-Target Earnings, Non-Linear Accelerators, Clawbacks & ApexComp Suite)",
    "spokenGoal": "Show me how a rep is paid, and I will show you how they behave. Today we engineer compensation plans\u2014structuring On-Target Earnings (OTE), base-to-variable splits, commission accelerators, decelerators, and clawbacks, culminating in Milestone 5: ApexComp.",
    "conceptInvariant": "Incentive Alignment Invariant: An enterprise compensation plan must produce positive margin contributions at every quota tier; accelerators must be funded by fixed-cost operating leverage without eroding gross product margin.",
    "failureMode": "The Uncapped Commission Bankruptcy: A startup designs a comp plan with a 3x accelerator for deals over 150% of quota, but omits gross margin gating; a rogue rep sells a $5M custom implementation at a 90% discount, earning a $1.2M commission while the company loses $2M delivering the project.",
    "tryItFriction": "Execute a compensation plan simulation where a rep with a 120% quota attainment receives no accelerator payout due to an off-by-one error in tier threshold logic.",
    "socraticHints": [
      "What is the standard enterprise SaaS On-Target Earnings (OTE) split (typically 50% base / 50% variable commission)?",
      "Why must compensation plans include explicit clawback provisions (e.g., if a customer churns or fails to pay within 90\u2013120 days)?",
      "Formulate the mathematical commission curve with tiered step functions and margin floors."
    ],
    "situationalPuzzle": {
      "scenario": "Your company is rolling out next year's compensation plan. The VP of Sales proposes: 'Let's pay a flat 20% commission on all revenue with no caps and no accelerators.' The CFO objects that under-performing reps who hit only 30% of quota will drain cash, while top performers will have no incentive to push past 100%.",
      "options": [
        "Implement the flat 20% commission plan because simplicity is all that matters.",
        "Architect a structured tiered comp plan: 50/50 OTE split; 0\u201380% attainment pays at a base commission rate (e.g., 8%); 80\u2013100% attainment pays standard commission (10%); 100\u2013150% accelerates to 15%; >150% accelerates to 20%, paired with a 90-day clawback clause on customer default and a 65% minimum gross margin gate.",
        "Pay reps 100% base salary with zero sales commission to avoid compensation disputes.",
        "Cap total rep commissions at $50,000 per year regardless of deal size."
      ],
      "correctOptionIndex": 1,
      "debrief": "Incentive plans must balance downside protection with upside acceleration. Paying underperformers standard rates subsidizes failure, while capping top performers encourages sandbagging deals into the next year. Tiered step-function accelerators funded by corporate operating leverage motivate elite performance while margin gates and clawbacks protect company solvency."
    },
    "quests": [
      {
        "id": "Q30.97",
        "name": "Sales Incentive Mechanics & Commission Mathematics",
        "type": "Concept",
        "desc": "Deconstruct the economics of sales compensation: OTE architecture, pay mixes (50/50, 60/40), tiered accelerators, cliffs, decelerators, clawbacks, and SPIFF dynamics."
      },
      {
        "id": "Q30.98",
        "name": "The Distorted Commission Payout Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Audit an end-of-year commission payout ledger across 100 sales reps; uncover 3 instances where ambiguous multi-year proration resulted in an accidental $450k overpayment."
      },
      {
        "id": "Q30.99",
        "name": "Milestone 5: ApexComp Territory & Compensation Suite",
        "type": "Mastery Assignment",
        "desc": "Build the complete ApexComp platform in TypeScript/Python: territory Gini balancer, dynamic quota calculator, multi-tier commission engine with accelerators, and clawback tracking."
      },
      {
        "id": "Q30.100",
        "name": "Contested Commission Dispute & Audit Defense Lab",
        "type": "Production Incident Lab",
        "desc": "Mediate a high-stakes commission dispute where a top enterprise AE claims a $350k accelerator payout on a multi-entity deal that customer procurement split across two quarters."
      }
    ]
  },
  {
    "day": 26,
    "month": 1,
    "blockNum": 6,
    "title": "High-Stakes Quarter-Close Sprints: Concession Deadlines & Executive Alignment",
    "stageNum": 3,
    "stageName": "Stage 3: Systems Stress-Testing",
    "pedagogicalRole": "Closing Sprint Orchestration (Quarter-End Cadence, Time-Bound Concessions & Peer-to-Peer Executive Closing)",
    "spokenGoal": "The final 72 hours of a fiscal quarter are a high-speed game of commercial chess. Today we engineer the closing sprint\u2014executing time-bound concession deadlines, orchestrating peer-to-peer executive alignment calls, and preventing procurement stall tactics.",
    "conceptInvariant": "Concession Expiry Invariant: Any commercial discount or concession offered during a quarter-end sprint must carry a strict, non-negotiable written expiration date; open-ended concessions destroy future negotiating leverage.",
    "failureMode": "The Phantom Deadline Bluff Call: An AE tells a customer: 'This 20% discount is only good until Friday at 5 PM.' On Monday morning, the deal hasn't signed, and the AE immediately emails: 'Good news, I got my boss to extend the discount another week!' Procurement realizes the deadline was fake and demands another 10% discount.",
    "tryItFriction": "Implement an automated quote expiration engine where quotes set to expire on the 30th continue to allow digital signature execution on the 31st without re-approval.",
    "socraticHints": [
      "Why does extending an expired discount deadline without extracting an equal customer concession permanently destroy seller credibility?",
      "How do you execute an 'Executive-to-Executive' (CEO-to-CEO or CRO-to-COO) closing call to bypass mid-level procurement deadlocks?",
      "Draft the standard 'Quarter-End Concession Expiry Memorandum' locking in pricing to midnight of the fiscal close."
    ],
    "situationalPuzzle": {
      "scenario": "It is 4:00 PM on the final day of Q4. You have a $600,000 deal pending signature. The customer's procurement director calls and says: 'Our Vice President is on a flight and cannot sign before midnight. If you extend this quarter's 15% discount into next quarter, we will sign on Tuesday.'",
      "options": [
        "Agree immediately and email an extended quote valid for next month.",
        "Execute the disciplined closing protocol: 'Our executive board authorized this commercial concession strictly for Q4 revenue recognition. If we cross into Q1, pricing automatically reverts to standard list price. However, our e-signature portal supports mobile execution\u2014can we send the DocuSign link directly to the VP's phone to sign upon landing before midnight, or execute under an authorized interim delegation of authority?'",
        "Withdraw the offer completely and refuse to speak with the customer ever again.",
        "Sign the contract yourself on behalf of the customer VP."
      ],
      "correctOptionIndex": 1,
      "debrief": "Procurement often tests whether deadlines are real by inventing last-minute administrative obstacles. Standing firm on the commercial boundary while offering operational bridges (mobile DocuSign execution, delegation of authority) separates real delays from bluffing and preserves pricing integrity."
    },
    "quests": [
      {
        "id": "Q30.101",
        "name": "Quarter-Close Sprint Choreography & Executive Protocols",
        "type": "Concept",
        "desc": "Map out the tactical choreography of the final 72 hours of an enterprise sales quarter: war room cadence, signature tracking, and peer-to-peer executive closing calls."
      },
      {
        "id": "Q30.102",
        "name": "The Procurement Stall Bluff Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Review audio recordings and email exchanges of 5 stalled end-of-quarter negotiations; identify the exact moment where sales reps blinked and surrendered pricing power."
      },
      {
        "id": "Q30.103",
        "name": "Automated Quarter-Close War Room & Signature Tracker",
        "type": "Mastery Assignment",
        "desc": "Build a real-time Quarter-Close War Room dashboard that tracks real-time document view telemetry, contract signature velocity, and alerts on impending deadline expirations."
      },
      {
        "id": "Q30.104",
        "name": "Midnight Fiscal Year-End Live Closing Lab",
        "type": "Production Incident Lab",
        "desc": "Run a simulated live sprint for three enterprise deals totaling $2.8M within 4 hours to midnight; navigate signing bottlenecks, procurement delays, and payment routing."
      }
    ]
  },
  {
    "day": 27,
    "month": 1,
    "blockNum": 6,
    "title": "Multi-Threading Under Executive Churn: Re-Anchoring At-Risk Enterprise Deals",
    "stageNum": 3,
    "stageName": "Stage 3: Systems Stress-Testing",
    "pedagogicalRole": "Account Resilience Architecture (Executive Churn Defense, Multi-Threaded Re-Anchoring & Leadership Transition Playbooks)",
    "spokenGoal": "The average tenure of a B2B Chief Information Officer is only 24 to 30 months. If your deal depends on a single executive, it is living on borrowed time. Today we engineer the Multi-Threaded Churn Defense\u2014re-anchoring deals when your primary champion departs mid-sales cycle.",
    "conceptInvariant": "Multi-Threaded Resilience Invariant: An enterprise account is resilient to executive churn if and only if independent political relationships and quantified business cases are established with $\\ge 3$ distinct executive sponsors across business, technical, and financial leadership.",
    "failureMode": "The New CIO Reboot: A $1.5M deal is 90% complete when the sponsoring CIO resigns. The incoming CIO immediately cancels all pending vendor selections, mandates a '100-day architectural review,' and brings in the competitor vendor they used at their previous company.",
    "tryItFriction": "Construct an executive churn alert webhook that triggers on LinkedIn job updates but fails to parse corporate email auto-responders like 'I am no longer with the company.'",
    "socraticHints": [
      "What automated signals (out-of-office auto-responders, LinkedIn title updates, executive meeting cancellations) provide early detection of executive churn?",
      "How do you approach a newly appointed executive without sounding like a desperate legacy vendor defending past territory?",
      "Structure the 'Executive Transition Onboarding Briefing' framing your project as an asset for the incoming leader's 100-day agenda."
    ],
    "situationalPuzzle": {
      "scenario": "You receive an out-of-office notification from your primary Champion (VP of Engineering) on a $700,000 deal stating: 'I have left the company. For all inquiries, contact the newly appointed Chief Technology Officer.'",
      "options": [
        "Panic and immediately send an urgent contract to procurement hoping they sign it before the new CTO notices.",
        "Execute the Executive Transition Playbook: 1) Immediately map the remaining buying center relationships (Head of Architecture, Director of Security); 2) Reach out to the incoming CTO with a strategic 'Briefing on Current Infrastructure Initiatives,' positioning the project as a verified solution to achieve their first-100-days efficiency mandate; 3) Leverage your departed champion to connect with the incoming CTO or champion your product at their new firm.",
        "Wait 6 months for the new CTO to settle in before reaching out again.",
        "Complain to the CEO that the previous VP wasted your time."
      ],
      "correctOptionIndex": 1,
      "debrief": "Executive transitions happen constantly in enterprise sales. Panicking or attempting to sneak contracts past new leaders creates instant hostility. Professional sales architects leverage their existing multi-threaded relationships, brief the incoming leader on strategic context, and turn the departed champion into an immediate new opportunity at their next destination."
    },
    "quests": [
      {
        "id": "Q30.105",
        "name": "Executive Churn Telemetry & Multi-Threaded Defense",
        "type": "Concept",
        "desc": "Model the organizational dynamics of executive turnover: transition lifecycle, the first 100 days psychology, competitor displacement tactics, and multi-threaded account insulation."
      },
      {
        "id": "Q30.106",
        "name": "The Blindsided Deal Decapitation Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Investigate 6 high-value deals that collapsed post-executive churn; identify 3 early warning indicators in communication metadata that the account team overlooked."
      },
      {
        "id": "Q30.107",
        "name": "Executive Churn Early Warning & Re-Anchoring Platform",
        "type": "Mastery Assignment",
        "desc": "Build an automated account monitoring system that detects stakeholder departures via email bounces and social signals, calculates churn risk index, and generates transition briefs."
      },
      {
        "id": "Q30.108",
        "name": "Incoming Hostile CTO Re-Pitch War Room",
        "type": "Production Incident Lab",
        "desc": "Present your pending $1.2M project to an incoming external CTO who wants to scrap the evaluation; re-anchor the business case to align with their strategic corporate goals."
      }
    ]
  },
  {
    "day": 28,
    "month": 1,
    "blockNum": 6,
    "title": "Post-Mortem Loss Analysis: Win/Loss Ratio Decomposition & Root-Cause Telemetry",
    "stageNum": 3,
    "stageName": "Stage 3: Systems Stress-Testing",
    "pedagogicalRole": "Empirical Loss Telemetry (Third-Party Win/Loss Interviews, Root-Cause Factor Decomposition & Countermeasure Engineering)",
    "spokenGoal": "Every lost deal contains the blueprint for your next ten wins\u2014if you have the humility and discipline to conduct an objective autopsy. Today we engineer Post-Mortem Loss Analysis, replacing rep excuses with third-party customer interviews and root-cause loss telemetry.",
    "conceptInvariant": "Loss Telemetry Invariant: Sales rep self-reported loss reasons (e.g., 'price was too high') are assumed false until verified by independent customer buyer interviews or procurement post-award debriefs.",
    "failureMode": "The 'Price Blame' Delusion: A sales org records 85% of lost deals as 'Lost on Price' in the CRM based on AE notes. As a result, executive leadership slashes list prices by 30%. Win rates remain completely unchanged because third-party interviews reveal customers actually left due to poor product UI and missing SOC 2 compliance.",
    "tryItFriction": "Analyze a CRM loss reason dataset where free-text notes containing 'Too expensive' mask underlying product deficiencies like 'Lacks multi-tenant SSO support.'",
    "socraticHints": [
      "Why is 'Price' the easiest polite excuse for a customer to give a sales rep when the real reason was lack of trust or perceived complexity?",
      "What structured methodology (Third-Party Double-Blind Interviews) extracts truthful feedback from departed prospects?",
      "Build an Ishikawa (Fishbone) root-cause diagram decomposing sales losses across Product, Process, People, and Pricing."
    ],
    "situationalPuzzle": {
      "scenario": "Your enterprise sales team lost a $900,000 deal to an early-stage startup competitor. The AE logs the loss in the CRM as 'Lost to competitor due to predatory 50% price dumping.' When the VP of Sales conducts a third-party debrief with the customer's Chief Information Officer, what is the most common reality discovered?",
      "options": [
        "The competitor actually gave the product away for free.",
        "The pricing was nearly identical, but the competitor had a modern API with clean developer documentation and completed the security review in 3 days, whereas your sales team took 4 weeks to provide a SOC 2 report and insisted on 5 sales meetings before allowing a technical demo.",
        "The customer decided not to solve the problem at all.",
        "The AE's CRM notes were 100% accurate and complete."
      ],
      "correctOptionIndex": 1,
      "debrief": "Sales reps frequently blame price because it shifts responsibility away from sales execution and product gaps. In enterprise B2B sales, friction in the buying experience (delays in security reviews, refusal to share technical docs, gatekeeping demos) loses more deals than price differentials. Objective win/loss debriefs uncover operational bottlenecks."
    },
    "quests": [
      {
        "id": "Q30.109",
        "name": "Win/Loss Analytical Methodology & Root-Cause Topology",
        "type": "Concept",
        "desc": "Formalize the methodology of enterprise win/loss analysis: double-blind third-party interview frameworks, quantitative loss tagging schemas, and Ishikawa root-cause modeling."
      },
      {
        "id": "Q30.110",
        "name": "The Biased Rep Loss Reason Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Compare 50 rep-logged CRM loss explanations against independent customer debrief recordings; uncover 32 misclassified losses where product/process issues were blamed on price."
      },
      {
        "id": "Q30.111",
        "name": "Automated Win/Loss Intelligence & Telemetry Platform",
        "type": "Mastery Assignment",
        "desc": "Build an automated Win/Loss intelligence pipeline that ingests customer debrief transcripts, extracts standardized root causes via NLP, and updates competitive battlecards."
      },
      {
        "id": "Q30.112",
        "name": "Executive Post-Mortem Board Review Lab",
        "type": "Production Incident Lab",
        "desc": "Deliver an uncompromising post-mortem analysis to the executive board following the loss of the company's largest $3M RFP deal; identify 3 systemic organizational flaws and present fixes."
      }
    ]
  },
  {
    "day": 29,
    "month": 1,
    "blockNum": 6,
    "title": "Global Account Management (GAM): Cross-Border Contracting & Multi-Entity Billing",
    "stageNum": 3,
    "stageName": "Stage 3: Systems Stress-Testing",
    "pedagogicalRole": "Global Sales Operations (Cross-Border Contracting, Multi-Entity Tax Structuring & Currency Risk Hedging)",
    "spokenGoal": "Selling to a multinational conglomerate requires global account architecture. Today we engineer Global Account Management (GAM)\u2014structuring cross-border Master Service Agreements, subsidiary participation agreements, local tax withholding (W-8BEN-E), and multi-currency billing.",
    "conceptInvariant": "Global Invoicing Invariant: A global enterprise contract must establish a unified Global MSA with decentralized Local Country Agreements (LCAs) allowing regional subsidiaries to draw down licenses under local tax, privacy, and currency laws.",
    "failureMode": "The 30% Foreign Tax Withholding Trap: A US software vendor signs a $1M global contract with an enterprise client's Brazilian subsidiary without verifying local cross-border service taxes; the customer withholds 30% for Brazilian withholding tax (IRRF/PIS/COFINS), leaving the vendor with an unexpected $300k revenue deficit.",
    "tryItFriction": "Execute a multi-currency invoicing generator where exchange rate fluctuations between quote creation and payment settlement result in unhedged accounts receivable deficits.",
    "socraticHints": [
      "Why is a two-tier contract structure (Global MSA + Local Country Agreement) essential for multinational enterprise customers?",
      "How do cross-border withholding tax treaties (e.g., W-8BEN-E, Double Tax Avoidance Agreements) affect software license cash collection?",
      "Formulate the multi-currency contract clause pegging invoicing to fixed baseline FX corridors."
    ],
    "situationalPuzzle": {
      "scenario": "A multinational financial services client headquartered in London wants to purchase your enterprise platform for its entities in the UK, the United States, Germany, and Singapore. The procurement team demands a single contract signed in London in GBP, with licenses deployed across all global entities.",
      "options": [
        "Sign the single UK contract in GBP and let the client manage internal deployment however they like.",
        "Structure a Global Framework Agreement (GFA) in London setting global volume pricing and standards, supplemented by Local Country Agreements (LCAs) for each subsidiary (US, Germany, Singapore) to address local data residency (GDPR), local currency billing (USD, EUR, SGD), and local tax compliance (VAT, GST), avoiding cross-border tax withholding traps.",
        "Demand that all 4 entities sign 4 completely separate, uncoordinated contracts at full retail price.",
        "Refuse to sell to any entity outside the United States."
      ],
      "correctOptionIndex": 1,
      "debrief": "Multinational corporations operate under distinct legal and tax jurisdictions. Attempting to deploy global software through a single parent contract creates severe cross-border tax withholding liabilities, VAT compliance failures, and GDPR cross-border transfer violations. A Global Framework Agreement paired with Local Country Agreements provides unified pricing with localized legal compliance."
    },
    "quests": [
      {
        "id": "Q30.113",
        "name": "Global Account Management Architecture & Legal Hierarchy",
        "type": "Concept",
        "desc": "Map out the legal and operational architecture of global enterprise accounts: Global MSAs, Local Country Agreements, VAT/GST considerations, and cross-border data transfer safeguards."
      },
      {
        "id": "Q30.114",
        "name": "The Foreign Tax Withholding Shock Detective Challenge",
        "type": "Detective Challenge",
        "desc": "Audit an international enterprise contract portfolio; identify 3 contracts where failure to account for local withholding taxes resulted in a $420k net revenue loss."
      },
      {
        "id": "Q30.115",
        "name": "Multi-Entity Global Invoicing & Tax Calculation Engine",
        "type": "Mastery Assignment",
        "desc": "Build a multi-entity enterprise billing engine that generates localized subsidiary invoices, computes applicable VAT/GST/withholding taxes, and applies automated FX rate hedges."
      },
      {
        "id": "Q30.116",
        "name": "Multinational Enterprise Cross-Border Dispute Lab",
        "type": "Production Incident Lab",
        "desc": "Resolve a high-stakes tax and data governance dispute with a European conglomerate's German subsidiary demanding local GDPR storage and EU-specific billing under a US master agreement."
      }
    ]
  },
  {
    "day": 30,
    "month": 1,
    "blockNum": 6,
    "title": "Capstone 1: ApexRevenue Core B2B Sales Execution & Deal Desk Master Capstone Viva Gate",
    "stageNum": 3,
    "stageName": "Stage 3: Systems Stress-Testing",
    "pedagogicalRole": "Month 1 Master Capstone Defense (Comprehensive Enterprise B2B Sales, Scoping, Deal Desk & Contract Governance Architecture)",
    "spokenGoal": "Welcome to the Month 1 Capstone Viva Gate. You will defend ApexRevenue\u2014an integrated, sovereign enterprise sales execution engine combining lead qualification (ApexProspect), value engineering (ApexDiscovery), deal governance (ApexDealDesk), and legal velocity forecasting (ApexLegal)\u2014before the Senior Review Board.",
    "conceptInvariant": "End-to-End Sales Governance Invariant: ApexRevenue must maintain an unbroken chain of verified customer evidence from initial MEDDPICC qualification through technical POC gates, Mutual Action Plans, Deal Desk margin approvals, and executable contract redlines.",
    "failureMode": "Catastrophic Systemic Pipeline Collapse: An enterprise software company books a record $20M quarter; within 90 days, $8M in contracts unravel due to unauthorized custom SLAs, unhedged tax withholdings, and unverified economic buyers, forcing an SEC inquiry and executive resignation.",
    "tryItFriction": "Execute the complete ApexRevenue end-to-end integration test suite with adversarial data inputs representing rogue sales rep overrides, triggering comprehensive audit alerts.",
    "socraticHints": [
      "How does ApexRevenue synthesize qualitative sales interactions into deterministic, audit-proof enterprise pipeline forecasts?",
      "What architectural boundaries ensure that sales reps cannot bypass Deal Desk margin gates or legal liability thresholds?",
      "Prepare to defend every equation: MEDDPICC vector scoring, Sales Velocity $V = \\frac{N \\times W \\times V_{avg}}{L}$, NPV cash flows, and Gini territory balancing."
    ],
    "situationalPuzzle": {
      "scenario": "You are defending the complete ApexRevenue architecture in a live viva examination before the Senior Review Board (acting as Chief Revenue Officer, Chief Financial Officer, and General Counsel). The board presents a multi-million-dollar deal that bypassed standard channels, contains an uncapped indemnity clause, and is forecasted at 90% probability without an identified Economic Buyer. How does ApexRevenue protect the enterprise?",
      "options": [
        "Allow the deal to proceed because the revenue is urgently needed to meet quarterly investor expectations.",
        "Demonstrate ApexRevenue's automated governance gates: the system flags the missing Economic Buyer, automatically caps probability at 20%, triggers a Deal Desk block on the quote, alerts General Counsel to the uncapped indemnity redline, and prevents executive commit forecasting until multi-threaded validation occurs.",
        "Disable all automated alerts to avoid irritating the sales team.",
        "Blame the junior account executive and terminate their employment without fixing the system."
      ],
      "correctOptionIndex": 1,
      "debrief": "A sovereign enterprise revenue engine enforces systemic governance over individual desperation. When deals lack verifiable customer commitments or introduce existential legal liabilities, ApexRevenue's deterministic state machines and risk gates intervene automatically, protecting company solvency and valuation from end-of-quarter chaos."
    },
    "quests": [
      {
        "id": "Q30.117",
        "name": "ApexRevenue Sovereign Architecture Blueprint",
        "type": "Concept",
        "desc": "Author the complete Master Architectural Specification for ApexRevenue, detailing the integration of Prospecting, Value Architecture, Deal Desk, and Legal Velocity engines."
      },
      {
        "id": "Q30.118",
        "name": "The Systemic Enterprise Deal Collapse Forensic Audit",
        "type": "Detective Challenge",
        "desc": "Perform an exhaustive forensic audit on a $15M enterprise pipeline collapse; trace failures across qualification, scoping, legal redlines, and compensation incentives."
      },
      {
        "id": "Q30.119",
        "name": "ApexRevenue Core Enterprise Sales Platform Implementation",
        "type": "Mastery Assignment",
        "desc": "Implement the complete, unified ApexRevenue platform in TypeScript/Python, featuring end-to-end pipeline FSM, MEDDPICC scoring, Deal Desk quoting, and Monte Carlo velocity forecasting."
      },
      {
        "id": "Q30.120",
        "name": "ApexRevenue Month 1 Master Capstone Viva Defense",
        "type": "Production Incident Lab",
        "desc": "Defend the entire ApexRevenue platform under live adversarial viva voce interrogation by the Senior Review Board, resolving complex commercial, legal, and operational scenarios."
      }
    ]
  }
]
