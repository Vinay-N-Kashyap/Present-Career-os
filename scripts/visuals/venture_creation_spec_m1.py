# scripts/visuals/venture_creation_spec_m1.py
# Days 1 to 15 for Course 29: Venture Creation & Lean Startup Engineering (course-bcom-entrepreneurship)
# Conforms to Gate v2 / 9.8 pedagogical standard.

DAYS_1_TO_15 = [
  {
    "day": 1,
    "month": 1,
    "blockNum": 1,
    "title": "Legal Business Entities & Corporate Veil Mechanics: Sole Proprietorship, LLP vs Private Limited (Pvt Ltd) Governance",
    "stageName": "Stage 1: Venture Ideation, Legal Entity Structuring & Problem-Solution Fit",
    "stageNum": 1,
    "pedagogicalRole": "Corporate Legal Structuring, Limited Liability Invariants & VC Investability Bedrock",
    "spokenGoal": "Welcome to Venture Creation & Lean Startup Engineering! In this masterclass, we engineer the strategic, legal, financial, and product architecture of high-growth technology companies. You are not building a weekend lifestyle hobby; you are architecting a scalable enterprise engineered to raise institutional venture capital, withstand rigorous legal due diligence, and compound enterprise value. Today we lay the legal bedrock: Business Entity Structuring and Corporate Veil Mechanics. Why will no Tier-1 VC write a check to a Sole Proprietorship or General Partnership? Because an enterprise requires a distinct legal persona. We dissect Sole Proprietorship, Limited Liability Partnership (LLP), and the Private Limited Company (Pvt Ltd / Delaware C-Corp). You will learn how limited liability insulates personal assets, how authorized vs issued share capital functions, and the exact operational compliance required to prevent the devastating legal doctrine of 'Piercing the Corporate Veil'.",
    "conceptInvariant": "Corporate Veil & Limited Liability Invariant: A Private Limited Company is a separate legal person distinct from its shareholders (Salomon v A Salomon & Co Ltd); liability of shareholders is strictly bounded by unpaid nominal share capital: $\\text{Liability}_{shareholder} \\le \\text{Unpaid Capital}$; this liability shield holds if and only if corporate governance separateness is maintained: $\\text{Asset}_{personal} \\cap \\text{Asset}_{corporate} = \\emptyset$, board resolutions authorize transactions, and arm's-length commercial dealings prevent alter-ego piercing: $P(\\text{Veil Pierced}) = 1$ upon commingling or undercapitalized fraud.",
    "failureMode": "Two college founders launch a peer-to-peer equipment rental startup as an informal general partnership to avoid $1,200 in incorporation legal fees. A rented industrial generator catches fire, burning down a commercial warehouse and inflicting $3,400,000 in property damages. Because a general partnership offers zero limited liability, the plaintiff's lawyers win a joint-and-several liability judgment against the founders personally. The court garnishes the founders' personal bank accounts, seizes their personal vehicles, and forces both 22-year-olds into personal bankruptcy for the next decade.",
    "tryItFriction": "Build an Automated Corporate Entity Selection & Compliance Verifier in Python: 1) Model 4 legal structures: Sole Proprietorship, General Partnership, LLP, and Pvt Ltd; 2) Ingest founder risk profiles (personal net worth, fundraising plans, liability exposure); 3) Compute liability risk surface and VC equity readiness score; 4) Implement an arm's-length transaction compliance auditor checking bank account commingling flags, missing board resolutions, and authorized capital limits; 5) Generate a legal incorporation readiness dossier.",
    "socraticHints": [
      "Why will institutional venture capital firms (like Sequoia or a16z) never invest in an LLP or LLC for high-growth tech startups?",
      "Because institutional VCs require C-Corporation / Pvt Ltd structures with standardized common/preferred stock classes, tax-exempt LP flow-through restrictions, and standardized stock option incentive pools (ESOPs).",
      "LLPs and LLCs pass through profits and losses as partnership taxation, which creates severe tax complications for institutional endowment and pension fund LPs."
    ],
    "situationalPuzzle": {
      "scenario": "A tech founder incorporates a Pvt Ltd company with $10,000 in authorized equity capital. To pay for server hosting and contractor invoices, the founder frequently swipes their personal credit card and transfers company subscription revenues directly into their personal savings account to pay home rent, recording it as 'informal founder draws'. When a major client sues the company for a $1,500,000 data breach, the client's litigation attorney files to Pierce the Corporate Veil. Will the court hold the founder personally liable?",
      "options": [
        "No, because the Pvt Ltd certificate of incorporation provides absolute, unconditional immunity to shareholders regardless of accounting practices.",
        "Yes, the court will Pierce the Corporate Veil under the 'Alter Ego' doctrine: commingling personal and business funds, failing to maintain corporate formalities, and treating corporate revenue as a personal piggy bank legally proves the company is a mere instrumentality, stripping away limited liability.",
        "The court will only fine the company $500 for poor bookkeeping, leaving the founder's personal assets completely safe.",
        "Limited liability is governed by federal copyright law and has nothing to do with bank account transfers."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Limited liability is a legal privilege granted on the condition that the corporation is operated as an independent legal entity. When a founder commingles personal and corporate bank accounts, fails to document board authorizations, and treats company funds as personal cash, courts invoke the 'Alter Ego' doctrine to Pierce the Corporate Veil, stripping away the liability shield and holding the founder personally liable for corporate debts."
    },
    "quests": [
      {
        "id": "Q1.1",
        "title": "Concept: The Legal Personhood Invariant & Corporate Veil Jurisprudence",
        "type": "Concept",
        "description": "Deconstruct the foundational legal doctrine of Salomon v Salomon; analyze corporate legal personhood, authorized vs issued share capital, par value mechanics, and the strict conditions governing Alter Ego corporate veil piercing in common law."
      },
      {
        "id": "Q1.2",
        "title": "Detective Challenge: The Commingled Ledger & Pierced Corporate Shield Audit",
        "type": "Detective Challenge",
        "description": "Audit the financial records of a failed B2B SaaS startup facing a $2M creditor lawsuit: write a Python forensics script that analyzes bank statements and general ledger entries, detecting 24 commingled personal expense transactions and missing board meeting minutes that jeopardize limited liability."
      },
      {
        "id": "Q1.3",
        "title": "Mastery Assignment: Enterprise Corporate Entity Structuring & Governance Engine",
        "type": "Mastery Assignment",
        "description": "Engineer a production-ready Python governance platform: model corporate entity architectures (Delaware C-Corp / India Pvt Ltd), track authorized vs paid-up share capital, automate board resolution workflows, validate arm's-length commercial contracts, and issue corporate compliance health ratings."
      },
      {
        "id": "Q1.4",
        "title": "Production Incident Lab: 3 AM Emergency Co-Founder Liability Fire Drill",
        "type": "Production Incident Lab",
        "description": "An errant AI trading bot launched by your startup executes unauthorized market transactions, triggering an emergency $500,000 regulatory margin call: execute an automated legal triage protocol verifying limited liability status, drafting emergency board resolutions, and quarantining personal founder assets from corporate exposure."
      }
    ]
  },
  {
    "day": 2,
    "month": 1,
    "blockNum": 1,
    "title": "Opportunity Sizing Physics: Total Addressable Market (TAM), SAM & SOM Bottom-Up Calculus",
    "stageName": "Stage 1: Venture Ideation, Legal Entity Structuring & Problem-Solution Fit",
    "stageNum": 1,
    "pedagogicalRole": "Market Opportunity Quantification, Top-Down vs Bottom-Up Calculus & TAM Waterfall Invariants",
    "spokenGoal": "Every pitch deck opens with a generic slide claiming 'The global market is $500 billion, and if we capture just 1%, we are a $5 billion business!' To institutional venture capitalists, this top-down fantasy is an instant rejection flag. Today we engineer Opportunity Sizing Physics: Total Addressable Market (TAM), Serviceable Available Market (SAM), and Serviceable Obtainable Market (SOM). We banish naive top-down Gartner report quoting and master rigorous Bottom-Up Calculus ($TAM = N \\times ACV$). You will quantify customer unit counts, geographic filters, regulatory constraints, Average Contract Value (ACV), and build bottom-up waterfall models that prove your startup addresses a venture-scale market with mathematical rigor.",
    "conceptInvariant": "Market Sizing Bottom-Up Invariant: Top-down market estimation ($M_{top} = \\text{IndustrySpend} \\times k$) is non-verifiable and induces false venture conviction; Bottom-Up TAM is defined strictly by the atomic product of verifiable total potential customer units ($N_{total}$) and annual average contract value ($ACV$): $\\text{TAM} = N_{total} \\times ACV$; where $\\text{SAM} = N_{addressable} \\times ACV$ (geography, platform, compliance filtered), and $\\text{SOM} = \\min(N_{obtainable}, \\text{SalesCapacity}) \\times ACV \\times \\text{WinRate}$ over a 3-5 year operating horizon; $\\text{SOM} \\le \\text{SAM} \\le \\text{TAM}$ must hold monotonically.",
    "failureMode": "A healthcare AI startup raises $3,000,000 seed capital based on a pitch deck claiming a $120,000,000,000 global market for radiology software. After building the product for 18 months, the founders discover that only tertiary hospital networks with over 500 beds can afford their on-premise GPU infrastructure. In their domestic market, there are only 142 such hospitals, with an achievable ACV of $40,000. True domestic SOM is $142 \\times \\$40,000 = \\$5,680,000 total revenue—not even enough to sustain their annual engineering payroll. The startup runs out of cash and liquidates.",
    "tryItFriction": "Build an Enterprise Bottom-Up TAM/SAM/SOM Calculator in Python: 1) Ingest census/firmographic business distributions across industries and employee headcount tiers; 2) Define pricing tiers ($ACV$) by customer size; 3) Apply addressability filters (geography, regulatory certifications, tech stack); 4) Model realistic market share capture dynamics over 5 years based on sales headcount and quota capacity; 5) Plot the TAM-SAM-SOM waterfall and verify venture-scale ($TAM > \\$1B$, $SOM > \\$50M$) investment criteria.",
    "socraticHints": [
      "Why do venture capitalists heavily discount 'Top-Down' market sizing based on industry analyst reports?",
      "Because top-down market sizing assumes market demand can be captured merely by taking a tiny percentage, ignoring distribution bottlenecks, customer segmentation, and willingness to pay.",
      "A bottom-up calculation proves you know exactly who the customer is, how many exist in the real world, and exactly what dollar price you can extract annually."
    ],
    "situationalPuzzle": {
      "scenario": "A B2B SaaS startup builds cybersecurity compliance software for US community banks. Top-Down calculation: Global banking IT spend is $600B; if the startup captures 0.1%, revenue is $600M. Bottom-Up calculation: There are 4,200 FDIC-insured community banks in the US. The startup charges $25,000/year ACV. A venture scout evaluates these two numbers. What is the real TAM?",
      "options": [
        "The real TAM is $600,000,000 because top-down banking IT budgets reflect broader expansion potential.",
        "The real TAM is 4,200 banks * $25,000 = $105,000,000. The top-down $600M figure is a dangerous hallucination. With a total addressable market of only $105M, capturing 10% market share yields $10.5M ARR, which may support a profitable boutique software business but is fundamentally too small for a traditional $1B+ venture-scale fund return.",
        "The TAM is infinite because community banks will expand globally into Europe.",
        "TAM cannot be calculated until the company completes its Series B fundraising."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Bottom-up calculus reveals the hard physical limits of market size: 4,200 potential buyers * $25,000 ACV = $105M total addressable market. Even if the company achieves market dominance (20% share), annual revenue is capped at $21M. Venture capital firms require portfolio companies to have a TAM of at least $1B+ so that a winning company can reach $100M+ ARR and generate a fund-returning exit."
    },
    "quests": [
      {
        "id": "Q2.1",
        "title": "Concept: Bottom-Up Market Microeconomics & The Fallacy of the 1% Top-Down Capture",
        "type": "Concept",
        "description": "Derive the mathematical principles of bottom-up TAM modeling; analyze firmographic segmentation, pricing power elasticity, customer adoption curves, and why top-down market sizing leads to catastrophic capital misallocation."
      },
      {
        "id": "Q2.2",
        "title": "Detective Challenge: The Inflated $50B Market Sizing Deck Forensic Audit",
        "type": "Detective Challenge",
        "description": "Audit an early-stage investor pitch deck claiming a $50B TAM for AI legal contract review: write a Python verification script that strips away consumer legal spend, isolates target corporate legal departments, matches achievable ACV, and exposes that true serviceable TAM is only $380M."
      },
      {
        "id": "Q2.3",
        "title": "Mastery Assignment: Full-Scale Multi-Segment Bottom-Up TAM/SAM/SOM Modeling Engine",
        "type": "Mastery Assignment",
        "description": "Construct an enterprise market sizing engine in Python: ingest US Bureau of Labor Statistics / Census enterprise data across 20 NAICS codes, calculate multi-tier ACV pricing ladders, model 5-year sales capacity constraints, and output publication-grade waterfall charts."
      },
      {
        "id": "Q2.4",
        "title": "Production Incident Lab: Emergency Market Pivot after TAM Contraction",
        "type": "Production Incident Lab",
        "description": "A new federal regulation wipes out your primary target customer segment overnight, shrinking your SOM by 78%: execute an automated opportunity rescoring script that re-evaluates adjacent market verticals, recalculates TAM/SAM/SOM within 30 minutes, and selects the optimal pivot trajectory."
      }
    ]
  },
  {
    "day": 3,
    "month": 1,
    "blockNum": 1,
    "title": "Business Model Canvas (BMC) Architecture: Osterwalder's 9 Strategic Building Blocks & System Feasibility",
    "stageName": "Stage 1: Venture Ideation, Legal Entity Structuring & Problem-Solution Fit",
    "stageNum": 1,
    "pedagogicalRole": "Strategic Enterprise Architecture, Business Model Canvas Mechanics & System Coupling",
    "spokenGoal": "A business model is not a vague business plan collecting dust on a shelf; it is an integrated systems architecture that maps how an organization creates, delivers, and captures economic value. Today we architect Alexander Osterwalder's Business Model Canvas (BMC). We examine the 9 Strategic Building Blocks: Customer Segments, Value Propositions, Channels, Customer Relationships, Revenue Streams, Key Resources, Key Activities, Key Partnerships, and Cost Structure. We treat the BMC as a balanced double-entry engineering equation: front-stage market value must strictly finance and balance back-stage operational cost feasibility. You will learn how to stress-test business models against margin collapse, channel dependency, and operational bottlenecks.",
    "conceptInvariant": "Business Model Canvas Value-Capture Equilibrium: A viable business model architecture satisfies the value-capture equilibrium condition: $\\sum \\text{Revenue Streams}(t) - \\sum \\text{Cost Structure}(t) > 0$ for $t \\ge t_{breakeven}$; front-stage value propositions ($VP$) delivered to customer segments ($CS$) via channels ($CH$) create economic willingness-to-pay ($WTP$); back-stage key activities ($KA$), resources ($KR$), and partnerships ($KP$) incur operational costs ($C$); the system is architecturally coherent if and only if every element in $VP$ has a corresponding feasibility pathway in $\\{KA, KR, KP\\}$ and an economically viable distribution channel in $CH$.",
    "failureMode": "A direct-to-consumer meal kit startup designs a Business Model Canvas with high front-stage appeal: gourmet organic chef-prepared meals for $12/dinner. However, their back-stage architecture relies on cold-chain refrigerated couriers ($8/box shipping) and expensive certified commercial kitchens ($6/meal food + labor). Total cost per meal delivered is $14, creating a negative contribution margin of -$2 per meal. As customer order volume quadruples from 10,000 to 40,000 meals a month, monthly losses explode from $20,000 to $80,000. Scaling a fundamentally broken business model accelerates corporate death.",
    "tryItFriction": "Build an Executable Business Model Canvas Validator in Python: 1) Model the 9 BMC building blocks as a connected dependency graph; 2) Map customer willingness to pay against revenue stream pricing; 3) Compute cost structure line items derived from key activities and resources; 4) Implement an automated coherence audit checking for 'orphan value propositions' (promises lacking operational activities) and 'dead channels' (unfunded acquisition paths); 5) Calculate contribution margin and net margin across the entire canvas.",
    "socraticHints": [
      "What is the difference between an 'orphan value proposition' and an engineered business model?",
      "An orphan value proposition is a marketing claim that has no operational backing in Key Activities, Key Resources, or Key Partnerships.",
      "If you promise '24/7 sub-5-minute AI customer response' but have zero automated RAG pipelines in Key Activities and zero GPUs in Key Resources, your canvas is mathematically decoupled and invalid."
    ],
    "situationalPuzzle": {
      "scenario": "A health-tech startup proposes a 'freemium' B2B business model: free AI diagnostics to individual doctors (Customer Segment 1), monetizing by selling aggregated pharmaceutical market intelligence to drug manufacturers (Customer Segment 2). The pitch claims 'viral zero-cost adoption'. An enterprise evaluator audits the BMC. What critical architectural risk threatens this multi-sided model?",
      "options": [
        "Selling to pharma is illegal in all countries under international copyright treaties.",
        "The model is a multi-sided platform requiring strict HIPAA/GDPR data-privacy consent architectures; if doctors use the free tool without explicit enterprise patient-data transfer waivers, the data cannot be legally commercialized to pharma, causing the entire monetization block to collapse while the startup bears 100% of the compute costs.",
        "Doctors never use free software because they prefer expensive legacy systems.",
        "The Business Model Canvas does not support two customer segments simultaneously."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. In multi-sided platform business models, value creation for Segment A (free users) must legally and technically connect to value capture from Segment B (paying customers). In healthcare, patient data cannot be simply 'monetized' without exhaustive HIPAA/GDPR patient consent, institutional review board approvals, and de-identification infrastructure. If the regulatory/legal bridge fails, the startup provides free compute to doctors with zero monetization revenue."
    },
    "quests": [
      {
        "id": "Q3.1",
        "title": "Concept: The 9 Strategic Building Blocks & System Coherence Physics",
        "type": "Concept",
        "description": "Deconstruct Osterwalder's 9 Building Blocks: map front-stage market desirability to back-stage operational feasibility and financial viability; analyze systemic feedback loops and multi-sided platform dynamics."
      },
      {
        "id": "Q3.2",
        "title": "Detective Challenge: The Decoupled BMC Contribution Margin Collapse Audit",
        "type": "Detective Challenge",
        "description": "Audit an on-demand logistics startup's Business Model Canvas: write a Python graph verification script that identifies 3 orphan value propositions, calculates true unit cost structures including hidden packaging waste, and proves negative gross unit margins."
      },
      {
        "id": "Q3.3",
        "title": "Mastery Assignment: Interactive Graph-Based Business Model Canvas Optimization Engine",
        "type": "Mastery Assignment",
        "description": "Build an executable Python/NetworkX business model simulation suite: represent the 9 BMC components as a bipartite graph, evaluate resource allocation constraints, compute sensitivity of net profit to channel cost spikes, and generate automated strategic audit scorecards."
      },
      {
        "id": "Q3.4",
        "title": "Production Incident Lab: Immediate Business Model Canvas Restructuring under Partner Severance",
        "type": "Production Incident Lab",
        "description": "Your exclusive cloud infrastructure partner terminates a $100k credit sponsorship, spiking monthly Key Resource hosting costs by 400%: execute an emergency BMC restructuring script that reallocates activities, reconfigures paid tiers, and restores positive contribution margin within 60 minutes."
      }
    ]
  },
  {
    "day": 4,
    "month": 1,
    "blockNum": 1,
    "title": "Value Proposition Design & Jobs to Be Done (JTBD): Christensen's Framework & Pain-Reliever Alignment",
    "stageName": "Stage 1: Venture Ideation, Legal Entity Structuring & Problem-Solution Fit",
    "stageNum": 4,
    "pedagogicalRole": "Customer Psychology, Jobs to Be Done (JTBD) Theory & Problem-Solution Fit Engineering",
    "spokenGoal": "Customers do not buy products; they hire products to get a job done in their lives. This was Harvard Business School Professor Clayton Christensen's breakthrough insight in Jobs to Be Done (JTBD) theory. If you design software based on user demographics (e.g., '35-year-old male living in Chicago'), you build generic bloatware. But if you design software around the functional, emotional, and social job the customer is desperately trying to solve, you build magnetic, high-retention products. Today we engineer Value Proposition Design. We map the Customer Profile (Customer Jobs, Pains, and Gains) against your Value Map (Products/Services, Pain Relievers, and Gain Creators). You will learn how to interview customers to extract unarticulated struggles and achieve genuine Problem-Solution Fit.",
    "conceptInvariant": "Problem-Solution Fit & JTBD Alignment Invariant: Value Proposition Fit occurs if and only if the set of product Pain Relievers ($PR$) and Gain Creators ($GC$) forms a bijective, high-intensity mapping to the top-quartile Customer Pains ($CP$) and Customer Gains ($CG$): $\\forall cp_i \\in CP_{\\text{acute}}, \\exists pr_j \\in PR \\text{ s.t. } \\text{Efficacy}(pr_j, cp_i) \\ge \\theta_{\\text{relief}}$; customer hiring velocity is governed by the JTBD equation: $V_{switch} = \\frac{\\text{Push} + \\text{Pull}}{\\text{Anxiety} + \\text{Habit}} > 1$; where switching occurs only when the combined push of current pain and pull of new solution overcomes the friction of habit and anxiety of adoption.",
    "failureMode": "A SaaS startup spends $800,000 building an 'All-in-One AI Social Media Management Platform' with 42 features (scheduling, analytics, auto-replies, meme generator). When launching, conversion is near zero. Customer interviews reveal that social media managers do not want an all-in-one platform—their acute #1 daily pain was that client approval emails took 4 days. A competitor launched a simple single-feature tool that just generated 1-click client approval links: it hit $100k MRR in 4 months because it solved the acute job while the 42-feature platform drowned in feature clutter.",
    "tryItFriction": "Build an Automated JTBD & Pain-Reliever Scoring Engine in Python: 1) Ingest customer interview transcripts containing raw customer statements; 2) Parse and classify statements into Functional Jobs, Emotional Jobs, Social Jobs, Pains (severity 1-10), and Gains (relevance 1-10); 3) Score product features on Pain Relief Intensity and Gain Creation Efficacy; 4) Compute the Christensen Switching Force ratio ($(\\text{Push} + \\text{Pull}) / (\\text{Habit} + \\text{Anxiety})$); 5) Generate a Problem-Solution Fit ranking report.",
    "socraticHints": [
      "What did Clayton Christensen mean by the famous 'Milkshake Marketing' case study?",
      "Commuters did not buy milkshakes at 8:00 AM because of the chocolate flavor; they hired a thick milkshake to solve a specific job: keep their commute interesting and stave off hunger until lunch with one hand on the steering wheel.",
      "Understand the job in the customer's context, not just the physical attributes of the product."
    ],
    "situationalPuzzle": {
      "scenario": "A B2B software team builds a tool that saves finance teams 4 hours per month on invoice reconciliation. The team prices it at $50/month. Sales demo feedback is polite, but no CFO will sign the contract. The sales team says: 'They all say they are too busy right now.' What does JTBD switching force analysis reveal about why customers aren't buying?",
      "options": [
        "The price is too high and should be dropped to $5/month.",
        "Saving 4 hours/month is a mild inconvenience, not an acute burning pain. The 'Push' of the current pain is weak, while the 'Anxiety' of onboarding a new vendor and the 'Habit' of existing Excel workflows are high. Since (Push + Pull) < (Anxiety + Habit), switching force is < 1, and inertia wins.",
        "The CFOs do not understand software and should be sent automated daily sales emails until they reply.",
        "The product should add 15 more features to make it more appealing."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. In Christensen's JTBD framework, customers do not switch just because a new tool is slightly better. Existing behavior has massive inertia: Habit (using Excel for 10 years) + Anxiety (fear of data leaks, software crashes, onboarding pain). If the pain of the current state is mild (saving 4 hours a month), the Push + Pull force is insufficient to overcome the denominator. Startups must target hair-on-fire problems where Push + Pull massively exceeds Habit + Anxiety."
    },
    "quests": [
      {
        "id": "Q4.1",
        "title": "Concept: Jobs to Be Done (JTBD) Theory, The 4 Forces of Progress & Milkshake Economics",
        "type": "Concept",
        "description": "Analyze Clayton Christensen's Jobs to Be Done framework; derive the 4 Forces of Progress (Push of Current Situation, Pull of New Solution, Anxiety of the New, Habit of the Present); formalize pain severity vs frequency ranking models."
      },
      {
        "id": "Q4.2",
        "title": "Detective Challenge: The Low-Converting Enterprise B2B Value Proposition Audit",
        "type": "Detective Challenge",
        "description": "Inspect 50 customer discovery interview transcripts for an enterprise HR software startup: write a Python NLP script that extracts customer complaints, categorizes jobs into functional/emotional/social, and proves why 80% of current roadmap features address non-acute pains."
      },
      {
        "id": "Q4.3",
        "title": "Mastery Assignment: Value Proposition Canvas & Four Forces Switching Engine",
        "type": "Mastery Assignment",
        "description": "Build an enterprise customer discovery platform in Python: model customer profile matrices, compute pain-reliever alignment coefficients, calculate the 4 Forces switching index for 5 competitor alternatives, and generate an executive value proposition design dossier."
      },
      {
        "id": "Q4.4",
        "title": "Production Incident Lab: Emergency Feature Pruning during Critical Conversion Slump",
        "type": "Production Incident Lab",
        "description": "Your SaaS onboarding completion rate plummets to 4% due to cognitive feature overload: execute an automated JTBD telemetry audit that identifies zero-utility features, strips 22 secondary settings from the core UI, and re-centers the customer on the primary functional job within 24 hours."
      }
    ]
  },
  {
    "day": 5,
    "month": 1,
    "blockNum": 1,
    "title": "Milestone 1: ApexVenture Ideation, Business Model Canvas & Problem-Solution Fit Engine",
    "stageName": "Stage 1: Venture Ideation, Legal Entity Structuring & Problem-Solution Fit",
    "stageNum": 1,
    "pedagogicalRole": "Enterprise Software Engineering Milestone: Venture Architecture & Problem-Solution Fit Engine",
    "spokenGoal": "You have reached Milestone 1! Over the last 4 days, you mastered Legal Business Entity Governance, Bottom-Up TAM/SAM/SOM Calculus, Osterwalder's Business Model Canvas Architecture, and Christensen's JTBD Value Proposition Design. Today you integrate these disciplines into a unified enterprise software artifact: ApexVenture. ApexVenture is a production-grade Python platform that evaluates and validates early-stage startup ventures. It verifies legal corporate separateness, computes bottom-up market sizing waterfalls, models connected 9-block business model graph economics, and scores JTBD problem-solution fit to produce an institutional Venture Validation Dossier.",
    "conceptInvariant": "ApexVenture Architecture Invariant: The validation suite must enforce deterministic mathematical consistency across all 4 foundations: 1) Legal entity validation proves limited liability separateness with zero commingling flags; 2) Market sizing strictly adheres to bottom-up monotonic order $\\text{SOM} \\le \\text{SAM} \\le \\text{TAM} = N_{total} \\times ACV$; 3) BMC graph models contribution margin equilibrium with zero orphan value propositions; 4) JTBD switching ratio $(\\text{Push} + \\text{Pull}) / (\\text{Habit} + \\text{Anxiety}) > 1.25$ guarantees demand velocity.",
    "failureMode": "An incubation studio builds an automated venture scoring tool using unverified LLM text generation. The tool produces an ungrounded report certifying a startup with an impossible top-down TAM ($1.4 trillion), a business model with negative $4 unit contribution margins, and an unincorporated legal structure. Based on this hallucinated report, the studio invests $250,000 in pre-seed funding. Within 6 months, the startup burns through the entire investment on unviable customer acquisition and gets sued for lack of legal entity protection. A rigorous software engine with deterministic mathematical constraints prevents catastrophic investment mistakes.",
    "tryItFriction": "Engineer the Complete ApexVenture Software Suite: 1) `engine/legal_verifier.py`: Entity structuring model validating corporate veil separateness and authorized share capital; 2) `engine/tam_calculator.py`: Bottom-up market sizing engine ingesting firmographic tables and computing TAM/SAM/SOM waterfalls; 3) `engine/bmc_validator.py`: Directed graph representation of the 9 BMC building blocks verifying unit economics and contribution margins; 4) `engine/jtbd_scorer.py`: Customer discovery matrix scoring pain relief intensity and Christensen switching forces; 5) `api/server.py`: FastAPI endpoints serving `/validate/venture` returning composite venture investability scores.",
    "socraticHints": [
      "Why must an enterprise venture validation engine rely on deterministic math rather than subjective founder pitch enthusiasm?",
      "Because founders are naturally biased to believe their idea is revolutionary, their market is infinite, and customers will buy effortlessly.",
      "An automated engineering framework applies cold, objective physical invariants—contract law, bottom-up census data, unit contribution margins, and switching friction—to separate viable businesses from financial mirages."
    ],
    "situationalPuzzle": {
      "scenario": "ApexVenture processes a prospective venture application for a B2B logistics SaaS platform. Module 1 verifies Delaware C-Corp status (PASS). Module 2 computes Bottom-Up TAM = $1.4B, SAM = $240M, SOM = $18M (PASS). Module 3 audits the BMC and finds Unit Revenue = $400/mo, Unit Cost = $480/mo (FAIL: Negative $80 Contribution Margin). Module 4 scores JTBD Switching Ratio = 0.85 (FAIL: Habit + Anxiety exceeds Push + Pull). What should ApexVenture's composite engine output?",
      "options": [
        "Issue an Investment Approval Certificate because the $1.4B TAM is large enough to absorb early operational losses.",
        "Issue an Investability Block with Remediation Directives: Fail gates on Module 3 and Module 4; flag negative unit contribution margin requiring pricing or cost restructuring; flag switching ratio < 1.0 indicating customer inertia will stall sales cycles; require restructuring before venture capital readiness.",
        "Round the contribution margin to zero and approve the startup.",
        "Recommend that the founders abandon software and open a retail store."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. High market potential (TAM) is completely meaningless if unit contribution margin is negative (scaling will accelerate bankruptcy) and the switching ratio is below 1.0 (customers will not overcome existing inertia). ApexVenture must enforce hard gate boundaries, issuing actionable remediation directives to fix pricing economics and sharpen the value proposition before capital is deployed."
    },
    "quests": [
      {
        "id": "Q5.1",
        "title": "Concept: Venture Architecture Engineering & Multi-Dimensional Due Diligence",
        "type": "Concept",
        "description": "Architect the software modularity of ApexVenture: legal compliance verification, bottom-up market sizing, graph-based business model validation, and quantitative problem-solution fit scoring."
      },
      {
        "id": "Q5.2",
        "title": "Detective Challenge: Stress-Testing ApexVenture against 10 Historical Seed Failures",
        "type": "Detective Challenge",
        "description": "Run ApexVenture across historical dataset logs of 10 failed startup ventures from 2018-2022: verify that the engine's deterministic invariant checks successfully catch all 10 failures at pre-seed stage, isolating their specific root-cause failure modes."
      },
      {
        "id": "Q5.3",
        "title": "Mastery Assignment: Full-Scale ApexVenture Python Platform Implementation",
        "type": "Mastery Assignment",
        "description": "Construct and unit-test the complete ApexVenture Python codebase: implement legal, market sizing, BMC, and JTBD modules with 100% automated test coverage; expose FastAPI endpoints; generate automated PDF/Markdown Venture Validation Dossiers."
      },
      {
        "id": "Q5.4",
        "title": "Production Incident Lab: Live Due Diligence Certification under Boardroom Deadline",
        "type": "Production Incident Lab",
        "description": "An angel investment syndicate requires an immediate quantitative validation report for a $500,000 pre-seed investment within 45 minutes: execute ApexVenture on live application data, isolate a hidden unit-cost flaw, and deliver an executive board decision memorandum."
      }
    ]
  },
  {
    "day": 6,
    "month": 1,
    "blockNum": 2,
    "title": "Lean Startup Methodology & MVP Archetypes: Build-Measure-Learn Loop, Concierge vs Wizard of Oz",
    "stageName": "Stage 1: Venture Ideation, Legal Entity Structuring & Problem-Solution Fit",
    "stageNum": 1,
    "pedagogicalRole": "Agile Product Discovery, Lean Experimentation & MVP Archetype Taxonomy",
    "spokenGoal": "The greatest waste in human endeavor is building with great efficiency a product that nobody wants. This is the core thesis of Eric Ries' Lean Startup Methodology. Traditional waterfall engineering spends 12 months writing specifications and coding in stealth, only to discover on launch day that customers do not care. Lean Startup replaces speculative planning with the Build-Measure-Learn scientific feedback loop. Today we engineer Minimum Viable Product (MVP) Archetypes. We dissect the Concierge MVP (manually executing the service behind the scenes), the Wizard of Oz MVP (front-end automation illusion with manual back-end fulfillment), the Smoke Test / Landing Page MVP, and the Single-Feature MVP. You will learn how to design falsifiable hypotheses and establish rigorous Pivot vs Persevere decision gates.",
    "conceptInvariant": "Build-Measure-Learn Cycle Time Invariant: The speed of validated learning $V_{learning}$ is inversely proportional to the end-to-end cycle time of the Build-Measure-Learn feedback loop: $V_{learning} \\propto \\frac{1}{T_{BML}} = \\frac{1}{t_{build} + t_{measure} + t_{learn}}$; a valid MVP minimizes $t_{build}$ while maximizing the signal-to-noise ratio of validated behavioral commitment ($C_{behavior}$ vs $C_{opinion}$); where behavioral currency (email signup, pre-payment deposit, time invested) carries $10\\times$ higher predictive validity than qualitative verbal praise.",
    "failureMode": "A software engineering team spends 14 months and $450,000 building an automated AI scheduling assistant with complex microservices, NLP parsers, and custom calendar integrations. Upon launch, they discover users find AI calendar permissions intrusive. A competing solo founder spent $50 on a simple landing page with a Calendly link and a manual email inbox (Wizard of Oz MVP), validated customer demand in 7 days, pivoted to executive recruiting scheduling, and reached $30k MRR before the first team even deployed their v1 backend.",
    "tryItFriction": "Build an Automated Lean Experiment & Hypothesis Testing Tracker in Python: 1) Model falsifiable startup hypotheses (e.g., 'At least 15% of visiting CFOs will submit their work email to request a compliance demo'); 2) Implement experiment archetypes: Smoke Test, Concierge, Wizard of Oz; 3) Compute statistical confidence intervals on conversion rates using Wilson score intervals; 4) Implement an automated Pivot vs Persevere evaluation gate based on pre-defined hypothesis thresholds; 5) Generate an experiment audit trail.",
    "socraticHints": [
      "Why is customer verbal feedback ('This sounds like an awesome product, I would totally buy it!') considered toxic waste in Lean Startup experimentation?",
      "Because verbal praise costs the user zero effort, zero money, and zero reputation, creating false validation that blinds founders.",
      "Only skin-in-the-game behavioral currency—pre-orders, credit card deposits, signed LOIs, or invested workflow time—counts as validated learning."
    ],
    "situationalPuzzle": {
      "scenario": "A startup builds an on-demand laundry app. The founders are deciding how to build their MVP. Option 1: Spend 6 months coding mobile apps for iOS and Android with automated driver routing and payment processing ($60,000 cost). Option 2: Build a 1-page website with a phone number; when orders arrive, the founders drive to the customer's house in their own car, pick up the laundry, wash it at the local laundromat, and return it personally (Concierge MVP, $300 cost). How does Lean Startup evaluate these options?",
      "options": [
        "Option 1 is mandatory because customers will not use a service that doesn't have native mobile apps.",
        "Option 2 is the optimal Lean MVP: it immediately tests whether customers are willing to hand their clothes to strangers, allows founders to interact directly with users to discover unarticulated needs, and achieves validated learning in 48 hours with minimal capital expenditure.",
        "Neither option works; the founders should buy an industrial commercial dry cleaner facility first.",
        "Option 1 is better because it looks more professional to venture capital investors."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. A Concierge MVP manually delivers the service to directly test core value hypotheses without writing automated code. In the early stage, the primary risk is NOT 'Can we write code?'; the primary risk is 'Do customers actually want this service?'. Operating manually allows founders to discover customer pain points (e.g., clothes folding preferences, turnaround times) firsthand and validates demand before investing tens of thousands in software automation."
    },
    "quests": [
      {
        "id": "Q6.1",
        "title": "Concept: The Build-Measure-Learn Engine & Behavioral Currency Validation",
        "type": "Concept",
        "description": "Analyze Eric Ries' Lean Startup framework; evaluate the mathematics of validated learning cycle time ($T_{BML}$); contrast vanity metrics vs actionable metrics; formalize the taxonomy of MVP archetypes."
      },
      {
        "id": "Q6.2",
        "title": "Detective Challenge: The Vanity Metrics Smoke-Screen Audit",
        "type": "Detective Challenge",
        "description": "Inspect an analytics dashboard for a failing mobile consumer app: write a Python forensics script that strips away vanity metrics (100,000 total downloads, pageviews) to reveal true engagement (Day 30 retention of 1.2%, zero repeat transactions)."
      },
      {
        "id": "Q6.3",
        "title": "Mastery Assignment: Quantitative Lean Experimentation & Hypothesis Testing Suite",
        "type": "Mastery Assignment",
        "description": "Engineer a production-grade Python experimentation framework: define structured hypotheses, calculate Wilson score confidence bounds on small sample conversion rates, track behavioral vs opinion currency, and automate Pivot vs Persevere decision gates."
      },
      {
        "id": "Q6.4",
        "title": "Production Incident Lab: Emergency 48-Hour Concierge MVP Pivot Deployment",
        "type": "Production Incident Lab",
        "description": "Your core product launch fails with 0.2% signups: execute an emergency 48-hour protocol deploying a manual Concierge MVP workflow to service 10 high-value pilot customers, capturing live user feedback and saving the venture from shutdown."
      }
    ]
  },
  {
    "day": 7,
    "month": 1,
    "blockNum": 2,
    "title": "Competitive Strategy & Economic Moats: Hamilton Helmer's 7 Powers & Sustained Margin Defensibility",
    "stageName": "Stage 1: Venture Ideation, Legal Entity Structuring & Problem-Solution Fit",
    "stageNum": 1,
    "pedagogicalRole": "Strategic Moat Architecture, Economic Moat Invariants & 7 Powers Defense",
    "spokenGoal": "Every high-margin business attracts an army of aggressive competitors. If your startup lacks an economic moat, competitors will copy your features, bid up your advertising costs, undercut your prices, and compress your economic profits to zero. This is the law of perfect competition. Today we engineer Competitive Strategy & Economic Moats using Hamilton Helmer's 7 Powers framework: Scale Economies, Network Effects, Counter-Positioning, Switching Costs, Branding, Cornered Resource, and Process Power. We examine how each power creates a structural barrier that prevents competitors from replicating your profit margins even when they know exactly what you are doing. You will learn why Counter-Positioning allows tiny startups to paralyze massive incumbents like Netflix vs Blockbuster.",
    "conceptInvariant": "Helmer 7 Powers Defensibility Invariant: An enterprise possesses Power if and only if it achieves a structural Benefit (increased price or reduced cost) coupled with a credible Barrier that prevents competitor arbitrage: $\\text{Power} = \\text{Benefit} \\wedge \\text{Barrier}$; without a structural barrier, supernormal economic profit $\\Pi > 0$ decays to zero at rate $\\frac{d\\Pi}{dt} = -k \\cdot N_{competitors}$; Counter-Positioning holds when adopting the challenger's business model inflicts catastrophic collateral damage on the incumbent's existing profit cash cow: $\\Delta \\Pi_{incumbent}^{\\text{copy}} < 0$.",
    "failureMode": "A food delivery startup spends $15,000,000 in venture capital acquiring customers through $10 discount coupons. The founders claim they have 'Network Effects'. However, consumers switch instantly to whichever app has the cheapest coupon that evening, and restaurant delivery drivers run three competing apps simultaneously. The startup has zero switching costs, zero network effects, and zero scale advantage. When venture funding dries up and coupons stop, 85% of active users vanish in 60 days.",
    "tryItFriction": "Build an Enterprise 7 Powers Strategic Moat Scoring Engine in Python: 1) Model the 7 Powers as quantitative structural vectors; 2) Ingest competitor market share, gross margins, and customer switching costs; 3) Compute Counter-Positioning collateral damage indices for legacy incumbents; 4) Calculate two-sided Network Effect direct and indirect utility functions; 5) Output an economic moat resilience scorecard forecasting 5-year operating margin stability.",
    "socraticHints": [
      "Why was Blockbuster completely paralyzed when Netflix introduced online DVD subscriptions with no late fees?",
      "Because Blockbuster's business model relied on late fees for 16% of their total revenue ($800M/year)! Copying Netflix would require Blockbuster to cannibalize their own primary profit engine.",
      "That is the essence of Counter-Positioning: the incumbent CANNOT copy you because copying you destroys their existing core business."
    ],
    "situationalPuzzle": {
      "scenario": "A B2B SaaS startup provides enterprise ERP software. A rival startup launches an alternative that is 30% faster and 20% cheaper. However, the incumbent ERP has deep integrations into the customer's warehouse scanners, accounting ledgers, and 12 years of historical audit records. Retraining staff and migrating databases takes 9 months and costs $250,000 in contractor fees. Which of Helmer's 7 Powers protects the incumbent?",
      "options": [
        "Network Effects, because warehouse workers talk to each other.",
        "High Switching Costs: The customer cannot switch to the cheaper/faster alternative because the financial, operational, and psychological friction of migration ($250k + 9 months) vastly exceeds the marginal product improvement.",
        "Counter-Positioning, because the rival startup refuses to charge late fees.",
        "Cornered Resource, because the incumbent owns all computer monitors."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Switching Costs arise when a customer must incur significant financial, procedural, or relational friction to transition to a competitor. In enterprise software, high switching costs (custom workflows, database schema locks, employee training, integration middleware) create immensely durable economic moats, allowing incumbents to retain customers and raise prices even when competitors build objectively superior point solutions."
    },
    "quests": [
      {
        "id": "Q7.1",
        "title": "Concept: Hamilton Helmer's 7 Powers Taxonomy & The Economics of Moat Durability",
        "type": "Concept",
        "description": "Deconstruct the 7 Powers framework: Scale Economies, Network Effects, Counter-Positioning, Switching Costs, Branding, Cornered Resource, Process Power; formalize the Benefit-Barrier condition for sustainable economic rent."
      },
      {
        "id": "Q7.2",
        "title": "Detective Challenge: The Fake Network Effect Illusion Audit",
        "type": "Detective Challenge",
        "description": "Audit a marketplace startup's pitch deck claiming 2-sided network effects: write a Python forensics script analyzing user churn vs supply density, proving that cross-side network effects are negligible and user retention is driven entirely by unprofitable subsidization."
      },
      {
        "id": "Q7.3",
        "title": "Mastery Assignment: Quantitative Enterprise 7 Powers Competitive Defense Engine",
        "type": "Mastery Assignment",
        "description": "Construct an enterprise moat modeling platform in Python: quantify switching cost hurdles, model Metcalfe's Law network utility, compute incumbent cannibalization penalties in Counter-Positioning scenarios, and project 10-year operating margin defensibility."
      },
      {
        "id": "Q7.4",
        "title": "Production Incident Lab: Countering Aggressive Big-Tech Feature Clones",
        "type": "Production Incident Lab",
        "description": "A tech giant announces an identical free clone of your core software feature at their annual developer conference: execute an automated strategic response playbook activating proprietary integrations, increasing switching costs, and fortifying your enterprise moat within 72 hours."
      }
    ]
  },
  {
    "day": 8,
    "month": 1,
    "blockNum": 2,
    "title": "Break-Even Analysis & Contribution Margin Physics: Fixed vs Variable Cost Dynamics & Margin of Safety ($BEU = \\frac{FC}{P - VC}$)",
    "stageName": "Stage 1: Venture Ideation, Legal Entity Structuring & Problem-Solution Fit",
    "stageNum": 1,
    "pedagogicalRole": "Financial Unit Economics, Contribution Margin Calculus & Break-Even Physics",
    "spokenGoal": "Every business starts with negative cash flow: you pay office rent, engineering salaries, and server bills before making a single dollar of sales. How many units must you sell before your company stops bleeding cash and achieves commercial solvency? Today we engineer Break-Even Analysis & Contribution Margin Physics. We master the fundamental equations of commercial viability: Fixed Costs ($FC$), Variable Cost per Unit ($VC$), Selling Price per Unit ($P$), Unit Contribution Margin ($CM = P - VC$), Contribution Margin Ratio ($CMR = \\frac{CM}{P}$), Break-Even Units ($BEU = \\frac{FC}{P - VC}$), and Margin of Safety ($MOS$). You will learn why software companies with 85% gross margins achieve explosive operating leverage compared to hardware businesses with high variable costs.",
    "conceptInvariant": "Break-Even Equilibrium & Operating Leverage Invariant: Profit $\\Pi(Q)$ is a linear function of production volume $Q$: $\\Pi(Q) = Q \\cdot (P - VC) - FC$; Break-Even Units ($BEU$) represents the exact volume where net profit equals zero: $BEU = \\frac{FC}{P - VC} = \\frac{FC}{CM}$; Degree of Operating Leverage ($DOL$) measures profit sensitivity to revenue shifts: $DOL = \\frac{Q \\cdot CM}{\\Pi} = \\frac{\\text{Contribution Margin}}{\\text{EBITDA}}$; as fixed costs rise relative to variable costs, $BEU$ increases, but operating leverage compounds profit exponentially once $Q > BEU$.",
    "failureMode": "A hardware IoT startup prices its smart sensor device at $120. They calculate bill-of-materials component cost at $65, assuming a healthy $55 unit margin. However, their financial model ignores variable cloud telemetry fees ($18/unit), payment processing ($4/unit), warranty returns ($10/unit), and packaging freight ($15/unit). True variable cost is $65 + $18 + $4 + $10 + $15 = $112, leaving an anemic contribution margin of only $8 per unit. With annual fixed engineering overhead of $960,000, their break-even volume is $960,000 / 8 = 120,000 units/year—a volume 10x higher than their factory's total manufacturing capacity. The startup collapses into insolvency.",
    "tryItFriction": "Build an Enterprise Break-Even & Contribution Margin Simulator in Python: 1) Model multi-product revenue lines with custom price tiers and variable cost breakdowns (COGS, payment fees, cloud usage, shipping); 2) Ingest fixed operating expenditures (headcount payroll, rent, SaaS subscriptions, legal); 3) Compute Unit Contribution Margin ($CM$), Contribution Margin Ratio ($CMR$), Break-Even Volume ($BEU$), and Break-Even Revenue ($BER$); 4) Calculate Margin of Safety ($MOS$) against projected demand; 5) Plot interactive CVP (Cost-Volume-Profit) charts.",
    "socraticHints": [
      "Why is Contribution Margin ($P - VC$) infinitely more important than simple Gross Margin in startup decision making?",
      "Because Gross Margin includes only direct production costs, while Contribution Margin accounts for ALL variable costs incurred to generate that incremental unit of sale (e.g., payment gateway fees, sales commissions, packaging, freight).",
      "Contribution margin tells you the exact dollar amount that each new unit contributes toward paying off the fixed overhead bills."
    ],
    "situationalPuzzle": {
      "scenario": "A B2B SaaS company has annual fixed costs of $1,200,000. It sells an annual software subscription for $10,000. Variable costs per customer (cloud compute, onboarding support, payment fees) are $2,000 per year. The VP of Sales projects selling 180 subscriptions this year. What is the company's Break-Even Volume, and what is its Margin of Safety percentage?",
      "options": [
        "BEU = 120 units; Margin of Safety = 50%.",
        "Calculate step by step: 1) Unit Contribution Margin CM = $10,000 - $2,000 = $8,000. 2) Break-Even Units BEU = $1,200,000 / $8,000 = 150 units. 3) Projected sales = 180 units. 4) Margin of Safety MOS = (180 - 150) / 180 = 30 / 180 = 16.67%.",
        "BEU = 200 units; Margin of Safety = -10%.",
        "Software companies have zero fixed costs, so break-even is always zero units."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Unit Contribution Margin is $10,000 - $2,000 = $8,000. Break-Even Units = Fixed Costs / CM = $1,200,000 / $8,000 = 150 subscriptions. With projected sales of 180 units, Margin of Safety is (180 - 150) / 180 = 16.67%. This means sales can drop by at most 16.67% (or 30 customers) before the company starts burning cash and operating at a net loss."
    },
    "quests": [
      {
        "id": "Q8.1",
        "title": "Concept: Cost-Volume-Profit (CVP) Mathematics & Degree of Operating Leverage",
        "type": "Concept",
        "description": "Derive Cost-Volume-Profit equations: analyze fixed vs variable cost categorization, contribution margin ratios, multi-product sales mix break-even calculations, and the mechanics of operating leverage."
      },
      {
        "id": "Q8.2",
        "title": "Detective Challenge: The Hidden Variable Cost Drain Forensic Audit",
        "type": "Detective Challenge",
        "description": "Audit an e-commerce subscription box company reporting an apparent 60% gross margin: write a Python script that exposes 5 unallocated variable cost line items (unboxing labor, packaging fill, chargeback fees), proving true CM is only 8% and BEU is 8x higher than reported."
      },
      {
        "id": "Q8.3",
        "title": "Mastery Assignment: Enterprise Multi-Tier CVP Financial Modeling Suite",
        "type": "Mastery Assignment",
        "description": "Develop a production-grade Python CVP engine: model multi-product subscription tiers, compute sensitivity to variable cloud cost inflation, calculate dynamic break-even points, and render executive Cost-Volume-Profit visualization dashboards."
      },
      {
        "id": "Q8.4",
        "title": "Production Incident Lab: Emergency Overhead Restructuring during Sales Contraction",
        "type": "Production Incident Lab",
        "description": "Macroeconomic recession causes projected sales to drop 35%, pushing operations into a $40,000/month loss below break-even: execute an automated cost restructuring algorithm that identifies non-essential fixed costs, reduces BEU by 40%, and restores positive Margin of Safety within 24 hours."
      }
    ]
  },
  {
    "day": 9,
    "month": 1,
    "blockNum": 2,
    "title": "Working Capital Management & Cash Runway Dynamics: Net Burn, Zero-Cash Date & The Cash Conversion Cycle ($Runway = \\frac{\\text{Cash}}{\\text{Burn}}$)",
    "stageName": "Stage 1: Venture Ideation, Legal Entity Structuring & Problem-Solution Fit",
    "stageNum": 1,
    "pedagogicalRole": "Startup Treasury Management, Cash Runway Physics & Solvency Governance",
    "spokenGoal": "Startups rarely fail because their product idea was bad; they fail because they ran out of cash. Cash is the oxygen of an early-stage company. You can have magnificent customer reviews and millions in accounting revenue, but if your bank account hits zero on Friday at 5:00 PM, your company is legally dead and payroll bounces. Today we engineer Working Capital Management & Cash Runway Dynamics. We dissect Gross Burn vs Net Burn ($Net Burn = \\text{Cash Inflows} - \\text{Cash Outflows}$), Cash Runway ($Runway = \\frac{\\text{Current Cash Balance}}{\\text{Monthly Net Burn}}$), and the Zero-Cash Date (ZCD). We model the Cash Conversion Cycle (CCC), Days Sales Outstanding (DSO), and Days Payable Outstanding (DPO). You will learn how to build an early-warning treasury dashboard that prevents premature startup demise.",
    "conceptInvariant": "Cash Runway & Solvency Invariant: Solvency at timestamp $t$ requires strictly positive cash reserves: $\\text{Cash}(t) = \\text{Cash}(0) + \\int_0^t (\\text{Inflows}(\\tau) - \\text{Outflows}(\\tau)) d\\tau > 0$; Zero-Cash Date ($t_{\\text{ZCD}}$) is the earliest future root: $t_{\\text{ZCD}} = \\inf \\{ t > 0 : \\text{Cash}(t) \\le 0 \\}$; Cash Runway is defined by $R(t) = \\frac{\\text{Cash}(t)}{\\text{Net Burn Rate}(t)}$; fundraising must be initiated when $R(t) \\ge 6 \\text{ months}$ because institutional venture capital closing cycles require $T_{\\text{closing}} \\in [3, 6] \\text{ months}$; entering $R(t) < 3 \\text{ months}$ triggers distressed down-round terms.",
    "failureMode": "A fast-growing B2B software startup celebrates booking $2,000,000 in annual contracts. The CEO immediately hires 15 engineers, increasing monthly payroll burn to $180,000 against a $720,000 cash balance. However, the enterprise customers negotiate Net-90 payment terms and procurement red-tape delays invoice processing by another 60 days. Cash collections are zero for 5 months. At month 4, the bank balance hits zero before customer checks clear. Despite $2M in paper sales, the company cannot make payroll, employees walk out, and the company enters emergency liquidation.",
    "tryItFriction": "Build an Enterprise Cash Runway & Treasury Forecasting Engine in Python: 1) Ingest monthly historical cash inflows and outflows from bank transaction feeds; 2) Compute Gross Burn, Net Burn, and rolling 3-month burn velocity; 3) Model delayed customer accounts receivable (DSO = 45 days) and accounts payable (DPO = 30 days); 4) Calculate the exact Zero-Cash Date (ZCD) under varying revenue growth scenarios; 5) Implement automated Slack/Email threshold alerts when runway drops below 6 months and 3 months.",
    "socraticHints": [
      "Why must an enterprise startup track Net Burn rather than GAAP Net Income to judge survival?",
      "Because GAAP Net Income is based on accrual accounting (recording revenue when an invoice is sent), while Net Burn tracks actual physical cash movement into and out of the bank account.",
      "You cannot pay payroll or rent with an unpaid accounts receivable invoice sitting on a spreadsheet."
    ],
    "situationalPuzzle": {
      "scenario": "A venture-backed startup has $1,800,000 in the bank on January 1st. Monthly expenses are $220,000. Monthly customer cash collections are $70,000. The CEO plans to start raising a Series A round in September (8 months later). An institutional board member reviews the numbers. How much cash runway does the company have, and is the CEO's fundraising schedule realistic?",
      "options": [
        "Runway is $1,800,000 / $220,000 = 8.18 months; raising in September is perfectly timed.",
        "Monthly Net Burn = $220,000 - $70,000 = $150,000. Cash Runway = $1,800,000 / $150,000 = 12.0 months. In September (8 months elapsed), the company will have only 4 months of cash remaining ($600,000). Since Series A fundraising takes 3-6 months to close, starting in September is dangerously late; the company risks running out of cash mid-fundraise and being forced into predatory down-round terms.",
        "Runway is infinite because customer revenue will automatically double every month.",
        "The startup should immediately stop paying all engineers to extend runway to 20 years."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Monthly Net Burn is $150,000, yielding 12.0 months of runway on Jan 1. By September, 8 months of burn ($1,200,000) will have been spent, leaving only $600,000 (4 months of runway). Starting a fundraise with only 4 months of runway places the founders in an extreme position of weakness: VCs know the company will die in 120 days, allowing them to stall negotiations and dictate punitive terms. Fundraises should always be launched with at least 6-9 months of runway."
    },
    "quests": [
      {
        "id": "Q9.1",
        "title": "Concept: Cash Flow Physics, Working Capital Dynamics & The Zero-Cash Date",
        "type": "Concept",
        "description": "Analyze accrual vs cash accounting mechanics; derive formulas for Gross Burn, Net Burn, Cash Runway, Cash Conversion Cycle (CCC = DSO + DIO - DPO), and institutional venture fundraising lead times."
      },
      {
        "id": "Q9.2",
        "title": "Detective Challenge: The Insolvent High-Growth Startup Forensic Audit",
        "type": "Detective Challenge",
        "description": "Audit the general ledger of a SaaS startup that collapsed while booking 200% YoY growth: write a Python forensics script that analyzes invoice payment delays, vendor prepayment liabilities, and reveals how working capital gaps caused bank insolvency."
      },
      {
        "id": "Q9.3",
        "title": "Mastery Assignment: Enterprise Treasury Runway & Working Capital Simulation Platform",
        "type": "Mastery Assignment",
        "description": "Construct an automated Python treasury engine: ingest simulated bank transaction streams, model working capital timing delays across accounts receivable and payable, compute exact Zero-Cash Dates, and simulate headcount hiring impacts on runway."
      },
      {
        "id": "Q9.4",
        "title": "Production Incident Lab: Emergency Cash Burn Curtailment under Sudden Macro Freeze",
        "type": "Production Incident Lab",
        "description": "A lead VC term sheet is abruptly pulled during a banking crisis with 4.5 months of runway remaining: execute an emergency capital preservation workflow that models 3 restructuring scenarios (Default Alive plan), cuts net burn by 55%, and extends runway to 14 months within 48 hours."
      }
    ]
  },
  {
    "day": 10,
    "month": 1,
    "blockNum": 2,
    "title": "Startup Funding & Cap Table Dilution: Post-Money SAFE Modeling & Pre vs Post-Money Valuation Mechanics",
    "stageName": "Stage 1: Venture Ideation, Legal Entity Structuring & Problem-Solution Fit",
    "stageNum": 1,
    "pedagogicalRole": "Venture Equity Modeling, Cap Table Engineering & Post-Money SAFE Conversion Mechanics",
    "spokenGoal": "Equity is the most expensive currency on Earth. Once you give away a percentage of your company to an investor, you can never buy it back. Today we engineer Startup Funding & Cap Table Dilution. We master Pre-Money vs Post-Money Valuation mechanics ($\text{Post-Money} = \text{Pre-Money} + \text{Investment}$), Investor Ownership % ($Ownership = \frac{\text{Investment}}{\text{Post-Money}}$), and founder dilution math. We examine why Y Combinator revolutionized early-stage fundraising by creating the Post-Money Simple Agreement for Future Equity (SAFE). You will learn how valuation caps, conversion discounts, and unallocated option pools impact founder ownership, and how multiple cascading SAFEs can secretly dilute founders out of their own company.",
    "conceptInvariant": "Post-Money SAFE Ownership Invariant: A Post-Money SAFE with investment amount $I$ and valuation cap $V_{\\text{cap}}$ guarantees the investor an exact non-dilutable ownership fraction in the company capitalization immediately prior to the next priced equity round: $\\text{Ownership}_{\\text{safe}} = \\frac{I}{V_{\\text{cap}}}$; total founder ownership after $K$ independent post-money SAFEs is governed by: $\\text{Ownership}_{\\text{founders}} = (1 - \\sum_{k=1}^K \\frac{I_k}{V_{\\text{cap}, k}}) \\times (1 - \\text{OptionPool}_{\\text{new}})$; stacking SAFEs without tracking cumulative dilution creates irreversible founder equity destruction.",
    "failureMode": "Two first-time founders raise pre-seed capital by signing 8 separate Post-Money SAFEs across 12 months from angel investors: $200k at $4M cap, $300k at $5M cap, $500k at $6M cap, $600k at $8M cap, etc. The founders thought they were only giving away small slivers. When a venture fund leads their Series A at a $12M valuation, the lawyers convert all SAFEs and require a 15% new employee stock option pool (ESOP). The founders discover that the SAFEs and option pool diluted them down to 32% combined ownership before Series A shares are even issued! They enter Series A as minority shareholders in their own company.",
    "tryItFriction": "Build an Enterprise Cap Table & Post-Money SAFE Dilution Simulator in Python: 1) Model initial founder common stock allocations (10,000,000 authorized shares); 2) Model multiple Post-Money SAFEs with varying investment amounts and valuation caps; 3) Simulate a priced Series A equity round with pre-money valuation, new capital, and unallocated option pool sizing (10-15%); 4) Compute exact share counts, ownership percentages, and share price for every stakeholder; 5) Plot waterfall dilution charts across pre-seed, seed, and Series A.",
    "socraticHints": [
      "Why did Y Combinator switch its standard SAFE template from 'Pre-Money' to 'Post-Money' in 2018?",
      "Because Pre-Money SAFEs diluted each other unpredictably depending on how many other notes were raised, creating complex circular math that confused founders.",
      "Post-Money SAFEs provide total transparency: an investor putting $500k on a $5M Post-Money cap knows with 100% mathematical certainty they own exactly 10% of the company as of that seed stage."
    ],
    "situationalPuzzle": {
      "scenario": "Two founders own 100% of their startup (10,000,000 shares). They raise $1,000,000 on a Post-Money SAFE with a $5,000,000 valuation cap from Angel A. Later that year, they raise another $1,000,000 on a Post-Money SAFE with a $10,000,000 cap from Angel B. How much combined equity do the two angels own after these two SAFEs convert, and what is the founders' remaining ownership percentage?",
      "options": [
        "Angels own 20% combined; founders own 80%.",
        "Angel A owns: $1,000,000 / $5,000,000 = 20.0%. Angel B owns: $1,000,000 / $10,000,000 = 10.0%. Total angel ownership = 20.0% + 10.0% = 30.0%. Founders' remaining ownership = 100% - 30.0% = 70.0% (before any priced round option pool expansion).",
        "Angel B dilutes Angel A so Angel A only owns 5%.",
        "SAFEs do not represent real equity and can be cancelled by the founders at any time."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Under Y Combinator's Post-Money SAFE mechanics, each safe converts into an exact fixed ownership percentage calculated as Investment / Valuation Cap. Angel A holds 20.0% ($1M / $5M) and Angel B holds 10.0% ($1M / $10M). The total SAFE dilution is simply the arithmetic sum of the post-money percentages: 20% + 10% = 30%. The founders' equity is diluted to 70%. When the next priced round creates an option pool, that pool will further dilute the founders."
    },
    "quests": [
      {
        "id": "Q10.1",
        "title": "Concept: Pre-Money vs Post-Money SAFE Mechanics & Capitalization Modeling",
        "type": "Concept",
        "description": "Derive the mathematical mechanics of Pre-Money vs Post-Money SAFEs; analyze valuation caps, conversion discounts, Most Favored Nation (MFN) clauses, pro-rata rights, and circular option pool expansion algorithms."
      },
      {
        "id": "Q10.2",
        "title": "Detective Challenge: The Cascading SAFE Dilution Catastrophe Audit",
        "type": "Detective Challenge",
        "description": "Audit a messy seed cap table with 12 un-coordinated convertible instruments: write a Python script that models the conversion waterfall into a Series A priced round, identifying an unexpected 28% excess founder dilution caused by mismatched valuation caps."
      },
      {
        "id": "Q10.3",
        "title": "Mastery Assignment: Full-Scale Enterprise Cap Table & SAFE Dilution Engine",
        "type": "Mastery Assignment",
        "description": "Construct a production-grade Python cap table management platform: track shareholder ledgers, model multi-round SAFE and convertible note conversions, simulate priced Series A/B rounds with pre-money vs post-money option pool shuffles, and generate publication-grade waterfall capitalization tables."
      },
      {
        "id": "Q10.4",
        "title": "Production Incident Lab: Emergency Cap Table Restructuring before Series A Signing",
        "type": "Production Incident Lab",
        "description": "A Series A lead investor threatens to walk away because excessive seed SAFE dilution has left founders with under 40% equity: execute an automated cap table optimization script that models warrant adjustments, SAFE note amendments, and management equity carve-outs within 36 hours."
      }
    ]
  },
  {
    "day": 11,
    "month": 1,
    "blockNum": 3,
    "title": "Early-Stage Startup Valuation Methodologies: Discounted Cash Flow (DCF), VC Method & The Berkus Rule",
    "stageName": "Stage 1: Venture Ideation, Legal Entity Structuring & Problem-Solution Fit",
    "stageNum": 1,
    "pedagogicalRole": "Venture Valuation Calculus, Early-Stage Risk Adjustments & Pricing Physics",
    "spokenGoal": "How do you put a dollar value on a company that has zero revenue, three engineers, and a prototype written in Python? If you apply traditional discounted cash flow (DCF) models from investment banking, you get meaningless numbers because early-stage cash flows are completely unpredictable. Today we engineer Early-Stage Startup Valuation Methodologies. We master the Venture Capital (VC) Method (calculating terminal value at exit divided by target ROI multiplier), the Berkus Method for pre-revenue startups (valuing 5 risk-reduction pillars up to $500k each), the Scorecard Valuation Method, the First Chicago Method, and Revenue Multiple comparables. You will learn how venture capitalists price risk, negotiate valuations, and structure rounds that avoid future down-round traps.",
    "conceptInvariant": "VC Method Valuation & Target Return Invariant: In the Venture Capital Method, Post-Money Valuation ($V_{\\text{post}}$) is derived backward from expected Exit Valuation ($V_{\\text{exit}}$) and target return multiple ($M_{\\text{target}} = (1 + r)^T$): $V_{\\text{post}} = \\frac{V_{\\text{exit}}}{M_{\\text{target}} \\times (1 + \\text{Dilution}_{\\text{future}})}$; Pre-Money Valuation satisfies $V_{\\text{pre}} = V_{\\text{post}} - I$; where early-stage venture funds require target multiples $M_{\\text{target}} \\ge 10\\times - 30\\times$ over 5-7 years to account for portfolio failure rates ($P(\\text{Failure}) \\approx 80\\%$).",
    "failureMode": "A hot AI startup with $200k in ARR negotiates an astronomical $50,000,000 valuation for its seed round from an inexperienced angel syndicate. The founders celebrate their high valuation. However, to justify that valuation in a subsequent Series A, the company needs to reach at least $4,000,000 in ARR within 18 months. When the market softens and the startup reaches only $1,200,000 ARR, prospective Series A investors refuse to invest at a higher valuation. The company faces a brutal 'Down Round', existing investor anti-dilution ratchets trigger, founders are heavily diluted, and employee stock options become worthless.",
    "tryItFriction": "Build a Multi-Method Early-Stage Startup Valuation Engine in Python: 1) Implement the VC Method: project 5-year exit valuation using industry EV/Revenue multiples, target VC fund return (25x), and expected dilution (30%); 2) Implement the Berkus Method scoring 5 risk pillars ($0-$500k each); 3) Implement the Scorecard Method weighting average regional valuations against team, market, and product strength; 4) Implement the First Chicago Method weighting Best, Base, and Worst-case cash flow scenarios; 5) Compute a weighted synthesis valuation corridor.",
    "socraticHints": [
      "Why is raising money at too high a valuation often the single most dangerous mistake a startup founder can make?",
      "Because valuation is a milestone hurdle rate! A high valuation sets expectations for explosive revenue growth; if you miss those targets, raising your next round will require a devastating Down Round.",
      "A down round triggers legal anti-dilution protections, wipes out employee stock morale, and often leads to company liquidation."
    ],
    "situationalPuzzle": {
      "scenario": "A B2B SaaS startup projects reaching $20,000,000 in ARR in year 5. Comparable public SaaS companies trade at an enterprise value multiple of 8x ARR ($160M exit valuation). A venture capital fund aims for a 20x return on its pre-seed investment over 5 years and anticipates 25% dilution from subsequent funding rounds. Using the VC Method, what is the maximum Post-Money Valuation the VC should offer today?",
      "options": [
        "$160,000,000, because exit valuation defines current worth.",
        "Post-Money Valuation = $160,000,000 / (20 * (1 / (1 - 0.25)))? Let's calculate: Required final exit ownership = 20x / ($160M / Investment). More directly: Discounted exit value = $160M / 20 = $8M. Accounting for 25% future dilution: $8M * (1 - 0.25) = $6,000,000 Post-Money Valuation today.",
        "$50,000,000, based on market enthusiasm.",
        "Valuation cannot be modeled mathematically and is purely a gut feeling."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. In the VC Method: Terminal Exit Value = $20M ARR * 8x = $160M. To achieve a 20x return on capital, the VC's exit equity value must be 20x the entry value, meaning total post-money valuation at entry (before future dilution) is $160M / 20 = $8M. Since subsequent funding rounds will dilute the initial stake by an estimated 25%, the maximum post-money valuation today is $8M * (1 - 0.25) = $6,000,000. If the startup seeks a $1M investment, the pre-money valuation is $5,000,000."
    },
    "quests": [
      {
        "id": "Q11.1",
        "title": "Concept: The Mathematics of Venture Valuation & Risk-Adjusted Discount Rates",
        "type": "Concept",
        "description": "Analyze the mathematical foundations of early-stage valuation: derive the VC Method equation, analyze Berkus risk-weighting matrices, Scorecard comparative adjustments, and the probability-weighted First Chicago framework."
      },
      {
        "id": "Q11.2",
        "title": "Detective Challenge: The Down-Round Death Spiral Audit",
        "type": "Detective Challenge",
        "description": "Audit the capitalization history of a startup that raised at an inflated $40M pre-money valuation and then missed revenue targets: write a Python script modeling the full-ratchet anti-dilution impact of a subsequent $15M down round on founder ownership."
      },
      {
        "id": "Q11.3",
        "title": "Mastery Assignment: Multi-Model Startup Valuation Suite in Python",
        "type": "Mastery Assignment",
        "description": "Develop an enterprise valuation platform in Python: integrate VC Method, Berkus Method, Scorecard Method, and First Chicago DCF probability trees; compute valuation corridors, and output executive investment committee valuation memos."
      },
      {
        "id": "Q11.4",
        "title": "Production Incident Lab: Live Term Sheet Valuation Negotiation Defense",
        "type": "Production Incident Lab",
        "description": "A venture fund offers a low-ball $3M pre-money valuation citing macro tech multiple compression: execute your valuation suite on live customer pipeline data, run a sensitivity analysis on your 220% NDR metric, and defend a $7M pre-money valuation in the final term sheet negotiation."
      }
    ]
  },
  {
    "day": 12,
    "month": 1,
    "blockNum": 3,
    "title": "Founder Equity Vesting, IP Assignment & Shareholders' Agreements (SHA): ROFR, Tag-Along & Anti-Dilution",
    "stageName": "Stage 1: Venture Ideation, Legal Entity Structuring & Problem-Solution Fit",
    "stageNum": 1,
    "pedagogicalRole": "Founder Legal Protection, Equity Vesting Invariants & Shareholders' Agreement Architecture",
    "spokenGoal": "Nothing destroys an early-stage startup faster than a co-founder departure when there is no vesting agreement. Imagine two founders split equity 50/50 on day 1. Three months later, Founder B decides they are burned out and leaves to take a corporate job, keeping their 50% ownership forever. Founder A is left doing 100% of the work while a ghost co-founder owns half the company. No investor will touch the company, and the startup dies. Today we engineer Founder Equity Vesting, Intellectual Property (IP) Assignment, and Shareholders' Agreements (SHA). We master the standard 4-year vesting schedule with a 1-year cliff, Single vs Double Trigger acceleration, Proprietary Information and Inventions Assignment (PIIA), Right of First Refusal (ROFR), Tag-Along, Drag-Along, and Anti-Dilution protections.",
    "conceptInvariant": "Founder Equity Vesting & IP Assignment Invariant: All founder and employee equity must be subject to reverse vesting: $\\text{VestedShares}(t) = 0$ for $t < T_{\\text{cliff}}$ (typically 12 months); upon reaching the cliff: $\\text{VestedShares}(T_{\\text{cliff}}) = \\frac{T_{\\text{cliff}}}{T_{\\text{total}}} \\times \\text{TotalShares}$; unvested shares are repurchasable by the company at nominal par value ($0.0001) upon termination; furthermore, all pre-incorporation and ongoing inventions belong strictly to the company via executing a comprehensive PIIA: $\\text{IP}_{\\text{creator}} \\to \\text{IP}_{\\text{company}}$ at $t=0$; unassigned IP prevents all venture equity financing.",
    "failureMode": "Two software engineers create a proprietary computer vision algorithm while in university and incorporate a startup. They do not sign PIIA / IP assignment agreements. Eighteen months later, a Tier-1 VC offers a $5,000,000 Series A term sheet. During legal due diligence, the VC's lawyers discover that the patent filing and codebase are registered in Founder B's personal name, and Founder B had previously done consulting work for a competitor while using university lab equipment. The university claims ownership of the core IP. The VC immediately rescinds the $5M term sheet, and the startup collapses into legal chaos.",
    "tryItFriction": "Build an Automated Founder Vesting & Cap Table Governance Engine in Python: 1) Model founder equity allocations with configurable vesting schedules (4 years, 1-year cliff, monthly vesting thereafter); 2) Simulate co-founder departure at month 9, 14, and 36, computing company repurchase of unvested shares; 3) Model Double-Trigger acceleration upon acquisition and involuntary termination; 4) Implement an IP assignment verification auditor checking PIIA signatures and third-party IP contamination flags; 5) Generate a comprehensive Shareholders' Agreement (SHA) terms checklist.",
    "socraticHints": [
      "What is the difference between Single-Trigger and Double-Trigger equity vesting acceleration?",
      "Single-Trigger accelerates vesting automatically upon a change of control (acquisition), which acquirers hate because key employees can take their money and quit immediately.",
      "Double-Trigger accelerates vesting ONLY if the company is acquired AND the employee is terminated without cause within 12 months, protecting founders while aligning incentives with the acquirer."
    ],
    "situationalPuzzle": {
      "scenario": "Founders Alice and Bob each receive 5,000,000 shares of common stock subject to standard 4-year vesting with a 1-year cliff (25% at month 12, monthly thereafter for 36 months). At Month 9, Bob announces he is leaving the startup to join Google. Bob demands to keep all 5,000,000 of his shares. What happens under the vesting agreement?",
      "options": [
        "Bob keeps all 5,000,000 shares because he is a co-founder and worked for 9 months.",
        "Under the 1-year cliff clause, Bob has completed 0% of his vesting schedule (t = 9 months < 12 months cliff). 100% of Bob's 5,000,000 shares remain unvested. The company exercises its contractual repurchase right, buying back all 5,000,000 shares at nominal par value ($0.0001/share), returning the equity to the company treasury and leaving Alice with an intact, investable cap table.",
        "Bob receives 75% of his shares because 9 months is 75% of a year.",
        "Alice must resign and give the company to Bob."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. The 1-year cliff is designed precisely for this scenario: if a founder or employee departs before completing 12 full months of service, zero equity vests. The company has the legal right to repurchase all unvested shares at nominal cost. This protects the surviving founder and the enterprise from being paralyzed by a departed co-founder holding dead equity."
    },
    "quests": [
      {
        "id": "Q12.1",
        "title": "Concept: Reverse Vesting Mechanics, PIIA IP Assignment & SHA Architecture",
        "type": "Concept",
        "description": "Analyze the legal and mathematical mechanics of founder reverse vesting: 1-year cliff, monthly vesting curves, 83(b) tax elections, PIIA IP assignment covenants, and key Shareholders' Agreement clauses (ROFR, Tag-Along, Drag-Along)."
      },
      {
        "id": "Q12.2",
        "title": "Detective Challenge: The Hostage Co-Founder Cap Table Forensic Audit",
        "type": "Detective Challenge",
        "description": "Audit an early-stage startup cap table where a departed co-founder claims 40% unvested equity without a signed cliff agreement: write a Python script analyzing equity agreements and board consents, formulating a legal recapitalization and clean-up strategy."
      },
      {
        "id": "Q12.3",
        "title": "Mastery Assignment: Enterprise Founder Vesting & Governance Simulation Platform",
        "type": "Mastery Assignment",
        "description": "Build an enterprise vesting and governance engine in Python: model multi-stakeholder vesting schedules, simulate departure events, execute company share repurchases, calculate Double-Trigger acceleration, and audit IP assignment compliance."
      },
      {
        "id": "Q12.4",
        "title": "Production Incident Lab: Emergency M&A Double-Trigger Acceleration Dispute",
        "type": "Production Incident Lab",
        "description": "An acquirer terminates you 60 days post-acquisition while claiming your unvested 35% equity is forfeited under an obscure retention clause: execute an automated legal covenant audit verifying Double-Trigger acceleration enforcement, securing $3.2M in vested proceeds."
      }
    ]
  },
  {
    "day": 13,
    "month": 1,
    "blockNum": 3,
    "title": "Strategic Planning & Goal Alignment: Objectives & Key Results (OKRs) & Agile Execution Mechanics",
    "stageName": "Stage 1: Venture Ideation, Legal Entity Structuring & Problem-Solution Fit",
    "stageNum": 1,
    "pedagogicalRole": "Strategic Enterprise Execution, OKR Architecture & Goal Cascading Physics",
    "spokenGoal": "Ideas are easy; execution is everything. In early-stage startups, the greatest danger is not working too slowly—it is working furiously on the wrong things. When every team member works toward a different priority, the startup spins its wheels in fragmented chaos. Today we engineer Strategic Planning & Goal Alignment using John Doerr's Objectives and Key Results (OKRs) framework, pioneered at Intel and Google. We master the architectural distinction between an inspirational, qualitative Objective ('What do we want to accomplish?') and 3-5 quantitative, measurable Key Results ('How do we know if we succeeded?'). You will learn how to cascade company OKRs to engineering and product squads, implement weekly commitments, and score Key Results on the canonical 0.0 to 1.0 scale.",
    "conceptInvariant": "OKR Measurement & Cascading Invariant: An OKR structure is valid if and only if every Objective $O_i$ is accompanied by a set of Key Results $\\{KR_{i,j}\\}$ where every $KR$ is objectively measurable with a verifiable baseline and target: $KR_{i,j} = \\langle \\text{Metric}, \\text{Start}, \\text{Target}, t_{\\text{deadline}} \\rangle$; Key Results must measure outcomes (e.g., 'Increase conversion from 2% to 5%'), never inputs or tasks (e.g., 'Work on redesign'); OKR scoring follows a normalized stretch scale where achievement score $S \\in [0.6, 0.7]$ represents target success, $S < 0.4$ represents failure, and $S = 1.0$ indicates sandbagged non-stretch targets.",
    "failureMode": "A Series A startup establishes 24 company OKRs for Q3. Every department head submits 5 objectives with 4 key results each, resulting in 120 tracking metrics across 35 employees. Half of the key results are vague activities ('Improve customer satisfaction', 'Attend 3 marketing conferences'). By week 6, nobody looks at the spreadsheet, engineers build random features, and marketing spends budget on unaligned campaigns. The company misses its primary revenue milestone and burns $400,000 without achieving a single measurable strategic outcome.",
    "tryItFriction": "Build an Enterprise OKR Alignment & Scoring Platform in Python: 1) Model hierarchical OKR trees (Company Level -> Department Level -> Individual Level); 2) Enforce strict validation rules: Key Results must contain quantitative target metrics and deadlines; 3) Implement weekly check-in progress updates computing confidence scores (1-10); 4) Calculate quarterly achievement scores on the 0.0 to 1.0 scale; 5) Detect unaligned orphan objectives and render an executive alignment graph.",
    "socraticHints": [
      "Why is achieving an OKR score of 1.0 (100%) across all Key Results often considered an institutional failure in top technology firms?",
      "Because OKRs are designed as stretch goals! If a team hits 100% of its targets, it means the targets were set too conservatively (sandbagged) rather than pushing the envelope.",
      "The optimal sweet spot is an average score of 0.7 (70%), indicating ambitious goals that pushed the team to peak performance."
    ],
    "situationalPuzzle": {
      "scenario": "A VP of Product submits the following Key Result for Q2: 'Launch the new payment processing feature on June 15th.' The CEO reviews the submission. How should the CEO grade this Key Result under OKR engineering standards?",
      "options": [
        "Approve it immediately because it has a specific feature name and a deadline.",
        "Reject it as an Activity/Task rather than an Outcome-based Key Result. Launching a feature has zero business value if nobody uses it. The Key Result should be rewritten as: 'Increase checkout conversion rate from 2.4% to 4.0% and process $500,000 in transaction volume via the new payment processor by June 30th.'",
        "Change the deadline to June 1st to add pressure.",
        "OKRs should never have dates or numbers."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. A fundamental rule of OKR engineering is that Key Results must measure business outcomes, not operational outputs or tasks. Shipping code is an output; increasing conversion and transaction volume is the outcome. Rewriting the KR around measurable customer behavior ensures the team focuses on solving customer problems rather than blindly deploying features."
    },
    "quests": [
      {
        "id": "Q13.1",
        "title": "Concept: The OKR Architecture, Goal Cascading & The Mathematics of Stretch Targets",
        "type": "Concept",
        "description": "Analyze John Doerr's Measure What Matters framework; formalize the structural difference between KPIs, MBOs, and OKRs; analyze hierarchical goal alignment trees and 0.0-1.0 scoring distributions."
      },
      {
        "id": "Q13.2",
        "title": "Detective Challenge: The Sandbagged Corporate OKR Audit",
        "type": "Detective Challenge",
        "description": "Audit an enterprise engineering organization's quarterly OKR ledger: write a Python script that analyzes 80 Key Results, detects 62 disguised task checklists and zero-stretch targets, and exposes why 100% completion produced zero revenue growth."
      },
      {
        "id": "Q13.3",
        "title": "Mastery Assignment: Enterprise Hierarchical OKR Management Platform",
        "type": "Mastery Assignment",
        "description": "Build a production-ready OKR tracking platform in Python/FastAPI: model cascading goal hierarchies, validate outcome-based syntax, compute weekly confidence-weighted progress trajectories, and render executive goal alignment heatmaps."
      },
      {
        "id": "Q13.4",
        "title": "Production Incident Lab: Mid-Quarter OKR Pivot during Competitive Threat",
        "type": "Production Incident Lab",
        "description": "A competitor launches a disruptive zero-fee product mid-quarter: execute an automated OKR adjustment protocol that re-aligns 4 departmental goal trees, reprioritizes engineering capacity, and updates executive tracking dashboards within 24 hours."
      }
    ]
  },
  {
    "day": 14,
    "month": 1,
    "blockNum": 3,
    "title": "Operations Management: Process Mapping, Theory of Constraints (ToC) & Bottleneck Little's Law ($L = \\lambda \\times W$)",
    "stageName": "Stage 1: Venture Ideation, Legal Entity Structuring & Problem-Solution Fit",
    "stageNum": 1,
    "pedagogicalRole": "Operational Process Engineering, Little's Law Invariants & Constraint Bottleneck Optimization",
    "spokenGoal": "Every startup is an operational factory: customer leads flow through sales pipelines, customer support tickets flow through triage queues, and pull requests flow through CI/CD pipelines. When work-in-progress piles up and cycle time explodes, your startup grinds to a halt. Today we engineer Operations Management for Startups. We master Eliyahu Goldratt's Theory of Constraints (ToC), Process Cycle Efficiency, and the foundational physical law of operational queuing: Little's Law ($L = \\lambda \\times W$). Little's Law connects Work-in-Progress ($L$), Throughput Arrival Rate ($\\lambda$), and Average Flow Time ($W$). You will learn why optimizing a non-bottleneck workstation is an illusion that produces zero system throughput improvement, and how to identify and exploit the single true bottleneck in your startup's operations.",
    "conceptInvariant": "Little's Law & Theory of Constraints System Invariant: In any operational process at steady-state, average Work-in-Progress ($L$) equals average throughput rate ($\\lambda$) multiplied by average cycle time ($W$): $L = \\lambda W$; system throughput rate is fundamentally bounded by the capacity of the bottleneck station ($B$): $\\lambda_{\\text{system}} = \\min_{i} \\{\\mu_i\\} = \\mu_B$; any optimization applied to a non-bottleneck station ($i \\ne B$) yields zero increase in system throughput: $\\frac{\\partial \\lambda_{\\text{system}}}{\\partial \\mu_i} = 0$ for $i \\ne B$; maximum system efficiency requires balancing flow, not balancing capacity.",
    "failureMode": "A fintech startup suffers from a 14-day customer onboarding cycle time. The CEO hires 5 additional sales reps to generate more leads, increasing lead throughput from 50 to 150 accounts per week. However, the legal compliance team has only 1 compliance officer who can review at most 40 accounts per week. Under Little's Law, as arrival rate surges against a rigid bottleneck, Work-in-Progress explodes from 100 to 600 backlogged accounts, and onboarding cycle time jumps from 14 days to 45 days. Frustrated customers cancel, and the company wastes $40,000/month on extra sales salaries while revenue remains completely flat.",
    "tryItFriction": "Build an Enterprise Process Flow & Little's Law Optimizer in Python: 1) Model a multi-stage startup pipeline (Lead -> Demo -> Proposal -> Legal Review -> Onboarding); 2) Assign service capacities ($\\mu_i$) to each station; 3) Solve for system bottleneck station and calculate maximum system throughput; 4) Verify Little's Law across all stages ($L = \\lambda W$); 5) Simulate the impact of adding capacity to non-bottlenecks vs the bottleneck station, plotting cycle time curves.",
    "socraticHints": [
      "What is Goldratt's famous rule about the value of an hour saved at a non-bottleneck workstation?",
      "An hour saved at a non-bottleneck is a complete mirage and adds zero value to the company!",
      "Only an hour saved at the bottleneck increases total system throughput and revenue."
    ],
    "situationalPuzzle": {
      "scenario": "A B2B SaaS onboarding process has 4 sequential stages: 1) Account Setup (capacity: 20 clients/day); 2) Data Ingestion (capacity: 15 clients/day); 3) Security Audit (capacity: 6 clients/day); 4) User Training (capacity: 18 clients/day). The operations manager spends $50,000 to double the capacity of Account Setup from 20 to 40 clients/day. How does this investment affect the company's daily onboarding throughput?",
      "options": [
        "Daily throughput doubles from 6 to 12 clients per day.",
        "Daily throughput remains completely unchanged at 6 clients per day. Stage 3 (Security Audit) is the system bottleneck with a capacity of 6 clients/day. Increasing Stage 1 capacity only causes un-audited client files to pile up faster in front of the Security Audit queue, wasting $50,000 without delivering a single additional onboarded client.",
        "Daily throughput increases to 40 clients per day.",
        "Little's Law does not apply to software companies."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Under the Theory of Constraints, total system throughput is strictly bounded by the bottleneck: min(20, 15, 6, 18) = 6 clients/day. Doubling Stage 1 capacity to 40 clients/day does nothing to relieve the Stage 3 bottleneck. In fact, it worsens operational health by piling up work-in-progress inventory. The only way to increase system throughput is to add capacity to Stage 3 (Security Audit)."
    },
    "quests": [
      {
        "id": "Q14.1",
        "title": "Concept: Little's Law Physics, Theory of Constraints & Goldratt's 5 Focusing Steps",
        "type": "Concept",
        "description": "Formulate the mathematical proof of Little's Law ($L = \\lambda W$); deconstruct Goldratt's 5 Focusing Steps (Identify, Exploit, Subordinate, Elevate, Repeat); analyze WIP queue explosion dynamics."
      },
      {
        "id": "Q14.2",
        "title": "Detective Challenge: The Blocked Sales Pipeline Bottleneck Forensic Audit",
        "type": "Detective Challenge",
        "description": "Inspect an enterprise sales CRM where deal cycle time surged from 21 days to 75 days: write a Python forensics script that analyzes stage transition timestamps across 500 deals, identifying an un-monitored legal redlining bottleneck that stalls $8M in pipeline value."
      },
      {
        "id": "Q14.3",
        "title": "Mastery Assignment: Enterprise Operational Process Simulation & Bottleneck Engine",
        "type": "Mastery Assignment",
        "description": "Develop a discrete-event process simulator in Python: model multi-stage workflows with stochastic arrival and service distributions, calculate WIP inventory accumulation, identify dynamic bottlenecks, and recommend optimal resource reallocation schedules."
      },
      {
        "id": "Q14.4",
        "title": "Production Incident Lab: Live Queue Clearance during Massive Customer Surge",
        "type": "Production Incident Lab",
        "description": "A viral marketing campaign floods your onboarding pipeline with 1,000 new client applications, creating a 30-day queue backlog at manual identity verification: execute an emergency subordinate-and-elevate workflow that reallocates internal engineering staff to clear the bottleneck within 48 hours."
      }
    ]
  },
  {
    "day": 15,
    "month": 1,
    "blockNum": 3,
    "title": "Milestone 2: ApexCapTable Financial Feasibility, Valuation & Operations Engine",
    "stageName": "Stage 1: Venture Ideation, Legal Entity Structuring & Problem-Solution Fit",
    "stageNum": 1,
    "pedagogicalRole": "Enterprise Software Engineering Milestone: Cap Table Dilution, Valuation & Operations Engine",
    "spokenGoal": "You have reached Milestone 2! Over Days 6 to 14, you mastered Lean Startup Experimentation, Hamilton Helmer's 7 Powers, Break-Even & Contribution Margin Physics, Cash Runway Dynamics, Post-Money SAFE Cap Table Dilution, Early-Stage Valuation, Founder Vesting & IP Protection, OKR Strategic Execution, and Little's Law Operational Bottlenecks. Today you synthesize these financial, legal, and operational disciplines into an integrated enterprise software suite: ApexCapTable. ApexCapTable is a production-grade Python platform that models multi-round startup capitalization tables, converts Post-Money SAFEs with option pool shuffles, computes multi-method early-stage valuations, simulates working capital cash runway, and optimizes operational pipeline bottlenecks.",
    "conceptInvariant": "ApexCapTable System Invariant: The financial engine must demonstrate end-to-end mathematical coherence: 1) Cap table capitalization strictly conserves share counts and ownership sums: $\\sum \\text{Ownership}_i = 100.0\\%$ across all convertible conversions and option pool shuffles; 2) Post-Money SAFE dilution math satisfies $O_{\\text{safe}} = I / V_{\\text{cap}}$ exactly; 3) Break-even volume satisfies $BEU = FC / (P - VC)$; 4) Treasury runway verifies $R = \\text{Cash} / \\text{NetBurn}$ with exact Zero-Cash Date projection; 5) Operational queues satisfy Little's Law $L = \\lambda W$.",
    "failureMode": "A fintech startup raises a $2,000,000 Series Seed round using manual spreadsheets maintained by an outside contractor. The spreadsheet contains a formula error in the post-money SAFE conversion cell, double-counting the unallocated employee option pool. When the lead VC's legal counsel conducts pre-closing cap table reconciliation, they discover a 12% equity discrepancy. The dispute delays the funding closing by 8 weeks, pushing the startup past its Zero-Cash Date and forcing the company to accept punitive emergency debt terms to avoid missing payroll.",
    "tryItFriction": "Engineer the Complete ApexCapTable Software Suite: 1) `engine/cap_table.py`: Multi-round equity ledger modeling common stock, options, Post-Money SAFEs, and priced Series A rounds; 2) `engine/valuation.py`: Multi-model early-stage valuation engine (VC Method, Berkus, Scorecard, First Chicago); 3) `engine/treasury.py`: Working capital cash flow and runway simulator computing exact Zero-Cash Dates; 4) `engine/operations.py`: Process bottleneck optimizer applying Little's Law ($L = \\lambda W$) and Theory of Constraints; 5) `api/server.py`: FastAPI endpoints serving `/cap-table/convert` and `/treasury/runway`.",
    "socraticHints": [
      "Why is manual spreadsheet capitalization modeling considered a critical operational hazard by institutional investors?",
      "Because spreadsheets lack unit testing, type safety, and version control; circular option pool dependencies and complex convertible instruments inevitably introduce rounding errors and miscalculated share prices.",
      "A code-based programmatic engine guarantees deterministic mathematical precision, automated regression testing, and auditable transaction ledgers."
    ],
    "situationalPuzzle": {
      "scenario": "ApexCapTable executes a stress-test simulation on a seed-stage startup: 1) Initial Shares = 10,000,000 (Founders own 100%). 2) Seed Round: $1,000,000 raised on Post-Money SAFE at $5,000,000 cap (Investor A). 3) Series A Round: $3,000,000 raised at $12,000,000 Pre-Money valuation, requiring a 10% new unallocated option pool created in the pre-money capitalization. What is Investor A's exact ownership percentage immediately after the Series A closing?",
      "options": [
        "Investor A owns 20.0%, because post-money SAFEs are protected from all future dilution.",
        "Investor A owns 20% prior to Series A ($1M / $5M). In the Series A round ($12M pre-money + $3M new cash = $15M post-money), new investors purchase $3M / $15M = 20.0% of the company. The new capital dilutes all pre-existing shareholders proportionally: Investor A's ownership becomes 20.0% * (1 - 0.20) = 16.0% (assuming the option pool was factored into the pre-money base).",
        "Investor A owns 50%, because SAFEs double in value during priced rounds.",
        "Investor A's shares are wiped out by the Series A preferred stock."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is correct. Under Post-Money SAFE mechanics, Investor A owns exactly 20.0% of the seed-stage company ($1M / $5M). However, when the subsequent priced Series A round takes place, the post-money SAFE does NOT protect the investor from dilution caused by the NEW Series A cash! The Series A investors purchase 20.0% of the new post-money entity ($3M / $15M). Consequently, Investor A is diluted by 20%, resulting in 20.0% * 0.80 = 16.0% ownership post-closing."
    },
    "quests": [
      {
        "id": "Q15.1",
        "title": "Concept: The Grand Architecture of Startup Financial & Operational Systems",
        "type": "Concept",
        "description": "Synthesize the financial and operational mechanics of Days 6-14: multi-round cap table dilution, early-stage valuation mathematics, working capital runway physics, and Theory of Constraints operational flow."
      },
      {
        "id": "Q15.2",
        "title": "Detective Challenge: Cap Table Discrepancy & Runway Collapse Forensic Audit",
        "type": "Detective Challenge",
        "description": "Audit a venture portfolio company facing conflicting cap table records between legal counsel and founders: write a Python forensics script that reconciles 15 investment agreements, uncovers a $400k misallocated SAFE note, and calculates the corrected Zero-Cash Date."
      },
      {
        "id": "Q15.3",
        "title": "Mastery Assignment: Full-Scale ApexCapTable Production Platform Implementation",
        "type": "Mastery Assignment",
        "description": "Build and unit-test the complete ApexCapTable software suite in Python: implement cap table dilution, multi-model valuation, treasury runway, and Little's Law operations modules; achieve 100% test coverage; deliver interactive REST API endpoints."
      },
      {
        "id": "Q15.4",
        "title": "Production Incident Lab: Emergency Cap Table Reconciliation for Lead Term Sheet Signing",
        "type": "Production Incident Lab",
        "description": "A top-tier venture firm issues an exploding Series A term sheet requiring fully verified cap table certification within 2 hours: execute ApexCapTable, generate verified shareholder schedules with option pool conversions, and secure the lead investment."
      }
    ]
  }
]
