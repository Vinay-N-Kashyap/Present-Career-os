/**
 * Picks the student's career track (role label, roadmap course, skills, weak areas) from their
 * onboarding goal. The goal is either an option id from the onboarding questions
 * (diagnosticRegistry*.ts: Q2_PRIMARY_ROLE, Q1_COMMERCE_GOAL, Q1_BBA_CAREER_DIRECTION,
 * Q3_GEN_CAREER_CONSIDERATION), mapped exactly, or free text typed in the chat, matched on whole
 * words and phrases so short keywords never match inside other words ("ml" in "html", "ui" in
 * "build", "next" in any sentence, "front" in "front office").
 */

export interface ResolvedTrack {
  targetRoleLabel: string;
  courseId: string;
  skillsList: string;
  weakAreas: string[];
}

export type TrackKey =
  | 'ai' | 'analytics' | 'cyber' | 'frontend' | 'devops' | 'uiux' | 'fullstack' | 'accounting' | 'banking'
  | 'investment' | 'hr' | 'digitalMarketing' | 'marketing' | 'ecommerce' | 'entrepreneur' | 'sales'
  | 'digitalTransformation' | 'finance' | 'consulting' | 'product' | 'operations' | 'iot' | 'qa' | 'research'
  | 'policy' | 'education' | 'healthcare' | 'media' | 'hardware' | 'creative' | 'social' | 'java'
  | 'mobile' | 'blockchain' | 'pythonBackend' | 'dsa'
  // Extended tracks for full platform course catalog parity
  | 'nodeWeb' | 'sre' | 'streaming' | 'aideploy' | 'cloudNative' | 'cloudPython' | 'vectorPython'
  | 'safetyPython' | 'dsaPython' | 'cyberPython' | 'databaseEng' | 'distributedSys' | 'distributedPython'
  | 'trainPython' | 'aiPython' | 'graphics3d' | 'iotNetwork' | 'iotEdgeAi' | 'iotSecurity'
  | 'quantSystems' | 'quantPython' | 'computerFundamentals' | 'promptLiteracy' | 'promptPython'
  | 'excelDataViz' | 'gitVersionControl' | 'softSkills' | 'nlp' | 'nlpPython';

export const TRACKS: Record<TrackKey, ResolvedTrack> = {
  ai: {
    targetRoleLabel: 'AI & LLM Systems Engineer',
    courseId: 'course-ai-eng',
    skillsList: 'Python 3.12, PyTorch, LangChain, Vector Databases (pgvector/Pinecone), RAG Architecture, LLM Prompt Engineering',
    weakAreas: ['Vector Index Tuning', 'Model Evaluation & Grounding', 'Async Agent Pipelines'],
  },
  analytics: {
    targetRoleLabel: 'Data & Business Analytics Specialist',
    courseId: 'course-business-analytics',
    skillsList: 'SQL Analytics, Advanced Excel, Python Data Science, Pandas, PowerBI Dashboarding, Statistical Modeling',
    weakAreas: ['A/B Test Design', 'Data Pipeline ETL', 'Predictive Modeling'],
  },
  cyber: {
    targetRoleLabel: 'Cybersecurity Analyst',
    courseId: 'course-cybersecurity',
    skillsList: 'Network Defense, OWASP Top 10, Penetration Testing, SIEM Log Analysis, Cryptography, Vulnerability Assessment',
    weakAreas: ['Zero Trust Architecture', 'Cloud Security Posture', 'Incident Response Playbooks'],
  },
  frontend: {
    targetRoleLabel: 'React Frontend Web SDE',
    courseId: 'course-react-web',
    skillsList: 'React 18, Next.js SSR, TypeScript, TailwindCSS, CSS Architecture, State Management (Zustand), Web Performance',
    weakAreas: ['Webpack / Vite Bundling', 'Core Web Vitals Optimization', 'React Testing Library'],
  },
  devops: {
    targetRoleLabel: 'Cloud & DevOps Engineer',
    courseId: 'course-devops-cicd',
    skillsList: 'Docker Containers, Kubernetes, CI/CD GitHub Actions, AWS Cloud Infrastructure, Terraform IaC, Prometheus Monitoring',
    weakAreas: ['Kubernetes Security Policies', 'Terraform State Management', 'Multi-Region High Availability'],
  },
  uiux: {
    targetRoleLabel: 'UI/UX Product Designer',
    courseId: 'course-design-systems',
    skillsList: 'Figma Wireframing & Prototyping, Design Systems & Tokens, User Research, Usability Testing, Micro-interactions',
    weakAreas: ['Design System Tokens Architecture', 'Accessibility (WCAG 2.1 AA)', 'A/B Testing Experiments'],
  },
  fullstack: {
    targetRoleLabel: 'Full-Stack Software Developer',
    courseId: 'course-fullstack-js',
    skillsList: 'JavaScript ES6+, TypeScript, Next.js, Node.js REST APIs, PostgreSQL, Prisma/Drizzle, Docker Basics',
    weakAreas: ['Database Indexing & Transactions', 'Serverless Cold Starts', 'Authentication Security'],
  },
  accounting: {
    targetRoleLabel: 'Audit, Taxation & Digital Accounting Specialist',
    courseId: 'course-digital-accounting',
    skillsList: 'Double-Entry Bookkeeping, Tally Prime ERP, GST Return Filing, Statutory Audit Checklists, Internal Controls, Indian Income Tax',
    weakAreas: ['Input Tax Credit (ITC) Reconciliations', 'Transfer Pricing Basics', 'Audit Sampling Procedures'],
  },
  banking: {
    targetRoleLabel: 'Banking & Financial Services Specialist',
    courseId: 'course-finance-investment',
    skillsList: 'Credit Appraisal, Commercial Lending, KYC/AML Compliance, Treasury Management, Retail Banking Operations, Financial Products',
    weakAreas: ['Credit Risk Scoring', 'NPA Provisioning Norms', 'Forex Hedging Operations'],
  },
  investment: {
    targetRoleLabel: 'Investment & Equity Research Analyst',
    courseId: 'course-finance-investment',
    skillsList: 'Discounted Cash Flow (DCF), Equity Research, Company Valuation, Financial Modeling, Portfolio Theory, Technical Analysis',
    weakAreas: ['WACC Calculation Variations', 'Monte Carlo Simulation', 'M&A Accretion/Dilution Analysis'],
  },
  hr: {
    targetRoleLabel: 'Human Resources & Talent Lead',
    courseId: 'course-operations-supplychain-compliance',
    skillsList: 'Talent Acquisition, Statutory HR Compliance, Payroll Management, Performance Appraisal Frameworks, Employee Relations',
    weakAreas: ['Labor Law Compliance', 'Attrition Predictive Modeling', 'Compensation & Benefits Benchmarking'],
  },
  digitalMarketing: {
    targetRoleLabel: 'Digital Marketing & Growth Strategist',
    courseId: 'course-digital-marketing',
    skillsList: 'Growth Marketing Funnels, SEO & Search Strategy, Conversion Rate Optimization (CRO), Google Analytics 4, Paid Performance Ads',
    weakAreas: ['Attribution Modeling', 'Paid Acquisition Unit Economics', 'Lifecycle Marketing Automation'],
  },
  marketing: {
    targetRoleLabel: 'Marketing & Brand Manager',
    courseId: 'course-marketing-branding',
    skillsList: 'Customer Research, Market Segmentation, Brand Development, Product Management, Pricing Strategy, Campaign Strategy',
    weakAreas: ['Consumer Psychology Analytics', 'Brand Equity Measurement', 'Multi-Channel Media Mix'],
  },
  ecommerce: {
    targetRoleLabel: 'E-Commerce & Digital Business Specialist',
    courseId: 'course-ecommerce-digital-biz',
    skillsList: 'E-Commerce Strategy, Catalog Architecture, Payment Gateways (UPI/COD), Logistics Fulfillment, Conversion Rate Analytics',
    weakAreas: ['Cart Abandonment Optimization', 'Inventory Turnover Analytics', 'Cross-Border Logistics'],
  },
  entrepreneur: {
    targetRoleLabel: 'Entrepreneur & Business Manager',
    courseId: 'course-entrepreneurship-biz-mgmt',
    skillsList: 'Business Model Canvas (BMC), Startup Finance, Break-Even Analysis, Strategic Planning, Operations, Leadership',
    weakAreas: ['Investor Pitch Valuation', 'Working Capital Management', 'Go-To-Market Execution'],
  },
  sales: {
    targetRoleLabel: 'Sales, Customer Success & CRM Specialist',
    courseId: 'course-sales-crm-success',
    skillsList: 'Consultative Selling, BANT Qualification, LAER Objection Handling, CRM Management, Sales Velocity Analytics',
    weakAreas: ['Quota Forecasting Models', 'Enterprise Contract Negotiation', 'Churn Mitigation Playbooks'],
  },
  digitalTransformation: {
    targetRoleLabel: 'AI & Digital Transformation Business Specialist',
    courseId: 'course-ai-digital-transformation',
    skillsList: 'AI Business Literacy, Prompt Engineering, RPA Automation, Business Intelligence Dashboards, AI Governance',
    weakAreas: ['RPA Workflow Optimization', 'Enterprise AI Risk Auditing', 'Change Management Architecture'],
  },
  finance: {
    targetRoleLabel: 'Financial & Investment Analyst',
    courseId: 'course-finance-investment',
    skillsList: 'Financial Modeling, Corporate Valuation, Excel Analysis, SQL, Financial Statement Analysis, Auditing & Compliance',
    weakAreas: ['Derivatives Valuation', 'Regulatory Tech (RegTech)', 'Corporate Restructuring Modeling'],
  },
  consulting: {
    targetRoleLabel: 'Management Consultant & Business Strategist',
    courseId: 'course-entrepreneurship-biz-mgmt',
    skillsList: 'Hypothesis-Driven Problem Solving, MECE Structuring, Market Sizing, Corporate Valuation, Executive Presentation Storytelling',
    weakAreas: ['Market Sizing Estimation', 'M&A Synergy Modeling', 'Executive Slide Architecture'],
  },
  product: {
    targetRoleLabel: 'Product Manager (Tech & Business Strategy)',
    courseId: 'course-design-systems',
    skillsList: 'Product Strategy, User Research, PRD Authoring, Agile Sprint Planning, North Star Metrics, Feature Prioritization (RICE)',
    weakAreas: ['RICE Prioritization Trade-offs', 'Telemetry Funnel Drop-off Auditing', 'Technical Architecture Feasibility'],
  },
  operations: {
    targetRoleLabel: 'Operations, Supply Chain & Compliance Specialist',
    courseId: 'course-operations-supplychain-compliance',
    skillsList: 'Business Process Mapping, Inventory Management (EOQ/ROP), Logistics, Lean & Six Sigma, Business Compliance',
    weakAreas: ['Supply Chain Bottleneck Analysis', 'Lean Six Sigma Root Cause', 'Regulatory Audit Preparation'],
  },
  iot: {
    targetRoleLabel: 'IoT & Embedded Systems Engineer',
    courseId: 'course-iot-embedded',
    skillsList: 'Embedded C/C++, ESP32/Arduino, GPIO Sensor Interfacing, MQTT & Wireless Protocols, TinyML, Hardware Security',
    weakAreas: ['Low-Power Duty Cycling', 'Secure Boot & Co-Processors', 'Firmware Over-The-Air (FOTA) Updates'],
  },
  qa: {
    targetRoleLabel: 'QA & Test Automation Engineer',
    courseId: 'course-fullstack-js',
    skillsList: 'Jest Unit Testing, Playwright E2E, Cypress, API Integration Testing, CI/CD Test Automation, Performance Testing',
    weakAreas: ['Flaky Test Isolation', 'Contract Testing', 'Load & Stress Testing'],
  },
  research: {
    targetRoleLabel: 'Scientific & Quantitative Research Specialist',
    courseId: 'course-business-analytics',
    skillsList: 'Research Methodology, Quantitative Analysis, Statistical Modeling, Python for Research, Data Visualization, Report Writing',
    weakAreas: ['Statistical Hypothesis Testing', 'Large Dataset Wrangling', 'Peer-Review Publication Standards'],
  },
  policy: {
    targetRoleLabel: 'Public Policy, Compliance & Legal Specialist',
    courseId: 'course-operations-supplychain-compliance',
    skillsList: 'Regulatory Compliance, Statutory Analysis, Policy Evaluation, Governance Frameworks, Legal Research & Documentation',
    weakAreas: ['Statutory Interpretation Nuances', 'Cross-Border Regulatory Alignment', 'Administrative Hearing Procedures'],
  },
  education: {
    targetRoleLabel: 'Education & Learning Technology Specialist',
    courseId: 'course-operations-supplychain-compliance',
    skillsList: 'Instructional Design, Pedagogical Assessment, Learning Outcomes Measurement, Curriculum Scaffolding, Educational Tech',
    weakAreas: ['Formative Assessment Rubrics', 'Differentiated Instruction Delivery', 'EdTech Analytics Integration'],
  },
  healthcare: {
    targetRoleLabel: 'Healthcare & Clinical Operations Analyst',
    courseId: 'course-business-analytics',
    skillsList: 'Healthcare Data Management, Clinical Trial Analytics, Health Informatics, Patient Journey Mapping, Quality Standards',
    weakAreas: ['Healthcare Compliance (HIPAA/NABH)', 'Electronic Health Records (EHR) Auditing', 'Clinical KPI Dashboards'],
  },
  media: {
    targetRoleLabel: 'Digital Media & Communications Specialist',
    courseId: 'course-digital-marketing',
    skillsList: 'Investigative Journalism, Multimedia Content Creation, Digital Publishing, Editorial Standards, Audience Analytics',
    weakAreas: ['Fact-Checking Protocols', 'SEO Content Architecture', 'Digital Media Ethics & Defamation'],
  },
  hardware: {
    targetRoleLabel: 'Core Systems & Hardware Engineer',
    courseId: 'course-iot-embedded',
    skillsList: 'Embedded Systems, Circuit Design, Microcontroller Interfacing, Hardware Debugging, RTOS Basics, Hardware-Software Integration',
    weakAreas: ['Real-Time Operating Systems (RTOS)', 'PCB Layout & Noise Mitigation', 'Hardware Security Modules'],
  },
  creative: {
    targetRoleLabel: 'Creative & Digital Arts Specialist',
    courseId: 'course-design-systems',
    skillsList: 'Visual Design, Digital Illustration, Creative Direction, Concept Art, UI/UX Prototyping, Brand Storytelling',
    weakAreas: ['Interactive Prototyping', '3D Asset Optimization', 'Cross-Platform Responsive Design'],
  },
  social: {
    targetRoleLabel: 'Social Impact & Non-Profit Program Manager',
    courseId: 'course-operations-supplychain-compliance',
    skillsList: 'Program Management, Grant Writing, Stakeholder Alignment, Impact Measurement, Non-Profit Governance',
    weakAreas: ['Monitoring & Evaluation (M&E) Frameworks', 'Donor Reporting Metrics', 'Statutory NGO Compliance'],
  },
  mobile: {
    targetRoleLabel: 'Mobile App Developer',
    courseId: 'course-mobile-dev',
    skillsList: 'React Native, Cross-Platform UI, Touch & Gesture Handling, Device Hardware APIs, App Store Deployment',
    weakAreas: ['Offline Sync & Caching', 'Mobile Performance Profiling', 'Push Notifications'],
  },
  blockchain: {
    targetRoleLabel: 'Blockchain & Web3 Developer',
    courseId: 'course-blockchain-web3',
    skillsList: 'Solidity Smart Contracts, Ethereum & EVM, Merkle Trees & Hashing, Wallet Integration (MetaMask / JSON-RPC), Web3 dApps',
    weakAreas: ['Smart Contract Security Audits', 'Gas Optimization', 'Layer-2 Scaling'],
  },
  pythonBackend: {
    targetRoleLabel: 'Python Backend Developer',
    courseId: 'course-python-backend',
    skillsList: 'Python Data Models, FastAPI (Async ASGI), SQLAlchemy ORM, Token Authentication, Production Deployment',
    weakAreas: ['Async Concurrency Pitfalls', 'Database Migrations', 'API Rate Limiting'],
  },
  dsa: {
    targetRoleLabel: 'Software Engineer (DSA & Problem Solving)',
    courseId: 'course-dsa-optim',
    skillsList: 'Arrays & Hash Tables, Trees & Graph Traversals, Dynamic Programming, Complexity Analysis (Big-O), Competitive Problem Solving',
    weakAreas: ['Dynamic Programming State Design', 'Graph Shortest Paths', 'Amortized Complexity'],
  },
  java: {
    targetRoleLabel: 'Java Backend SDE',
    courseId: 'course-java-logic',
    skillsList: 'Java Standard Library, OOP Principles, Spring Boot REST, SQL Databases, System Design',
    weakAreas: ['Docker Containers', 'System Design', 'Microservices Architecture'],
  },
  // Additional specialized course tracks
  nodeWeb: {
    targetRoleLabel: 'Backend Node.js & TypeScript SDE',
    courseId: 'course-node-web',
    skillsList: 'Node.js, Express, TypeScript, RESTful API Design, JWT & Auth Middleware, PostgreSQL, Prisma ORM, Redis Caching',
    weakAreas: ['Event Loop Saturation', 'Database Connection Pooling', 'Graceful Error Taxonomy'],
  },
  sre: {
    targetRoleLabel: 'Site Reliability & Observability Engineer',
    courseId: 'course-sre-web',
    skillsList: 'TypeScript, OpenTelemetry, Prometheus & Grafana, Incident Response Playbooks, Distributed Tracing, Multi-Cloud SRE',
    weakAreas: ['Error Budget Calculation', 'Cascading Failure Mitigation', 'High-Cardinality Metric Costs'],
  },
  streaming: {
    targetRoleLabel: 'Real-Time Streaming Systems Architect',
    courseId: 'course-stream-web',
    skillsList: 'TypeScript, Apache Kafka, Event-Driven Architecture, Stream Processing, WebSockets, Redis Streams, Backpressure Control',
    weakAreas: ['Exactly-Once Delivery Guarantees', 'Consumer Lag Monitoring', 'Partition Rebalancing Impact'],
  },
  aideploy: {
    targetRoleLabel: 'Production AI Deployment Engineer',
    courseId: 'course-aideploy-web',
    skillsList: 'TypeScript, Model Serving, LLM Ingestion Gateways, Streaming Token Delivery, vLLM / Ollama APIs, Rate Limiting & Failover',
    weakAreas: ['Token Cost Governance', 'Cold Start Optimization', 'Streaming Backpressure Handling'],
  },
  cloudNative: {
    targetRoleLabel: 'Cloud Solutions Architect & AWS DevOps Engineer',
    courseId: 'course-cloud-native',
    skillsList: 'AWS Architecture (EC2, ECS, Lambda), Terraform IaC, IAM Security Policies, VPC Peering, S3 / DynamoDB, CloudFront CDN',
    weakAreas: ['Multi-AZ Failover Orchestration', 'Cost Allocation & Tagging', 'Cross-Account IAM Roles'],
  },
  cloudPython: {
    targetRoleLabel: 'Cloud Systems Engineer (Python / AWS)',
    courseId: 'course-cloud-python',
    skillsList: 'Python Boto3, AWS Lambda Serverless, CloudFormation, API Gateway, S3 Automation, CloudWatch Alarms',
    weakAreas: ['Serverless Concurrency Limits', 'Asynchronous Event Sourcing', 'Security Group Hardening'],
  },
  vectorPython: {
    targetRoleLabel: 'Vector Database & Retrieval Engineer',
    courseId: 'course-vector-python',
    skillsList: 'Python, pgvector, Pinecone, Qdrant, Dense & Sparse Embeddings, Hybrid Search, HNSW Indexing, FAISS Clustering',
    weakAreas: ['HNSW Graph Construction Tuning', 'Re-ranking Latency Trade-offs', 'Vector Drift & Re-indexing'],
  },
  safetyPython: {
    targetRoleLabel: 'AI Safety, Alignment & Red-Teaming Engineer',
    courseId: 'course-safety-python',
    skillsList: 'Python, LlamaGuard, Prompt Injection Mitigation, Constitutional AI, Toxic Output Detection, Hallucination Auditing',
    weakAreas: ['Adversarial Jailbreak Detection', 'Safety Benchmark Evaluation', 'Differential Privacy Guarantees'],
  },
  dsaPython: {
    targetRoleLabel: 'Software Engineer (Python DSA & Algorithms)',
    courseId: 'course-dsa-python',
    skillsList: 'Python Data Structures, Binary Search, Graph BFS/DFS, Heaps & Priority Queues, Dynamic Programming, Memoization',
    weakAreas: ['Recursion Limit & Call Stack Tuning', 'Trie Space Complexity', 'Bit Manipulation Optimization'],
  },
  cyberPython: {
    targetRoleLabel: 'Cybersecurity Automation Engineer (Python / SecOps)',
    courseId: 'course-cyber-python',
    skillsList: 'Python Scapy, Network Packet Sniffing, Threat Hunting Scripts, Automated Vulnerability Scanners, Malware Analysis Basics',
    weakAreas: ['Custom Protocol Dissection', 'Evasion Technique Detection', 'Automated Triage Workflows'],
  },
  databaseEng: {
    targetRoleLabel: 'Database Architect & Query Optimization Specialist',
    courseId: 'course-database-eng',
    skillsList: 'PostgreSQL Internals, B-Tree & GIN Indexing, Query Plan EXPLAIN ANALYZE, ACID Isolation Levels, WAL & Replication, Sharding',
    weakAreas: ['Lock Contention Mitigation', 'Vacuum Tuning & Bloat Control', 'Distributed Transaction Protocols (2PC)'],
  },
  distributedSys: {
    targetRoleLabel: 'Distributed Systems Architect & Scale Engineer',
    courseId: 'course-distributed-sys',
    skillsList: 'Consensus Protocols (Raft/Paxos), Distributed Key-Value Stores, Partitioning & Gossip, Load Balancing, Circuit Breakers',
    weakAreas: ['Split-Brain Prevention', 'CAP Theorem Trade-Off Design', 'Idempotency in Distributed Pipelines'],
  },
  distributedPython: {
    targetRoleLabel: 'Distributed Systems Engineer (Python)',
    courseId: 'course-distributed-python',
    skillsList: 'Python Celery, Distributed Task Queues, Redis Cluster, gRPC Microservices, AsyncIO Concurrency, Distributed Tracing',
    weakAreas: ['Deadlock Detection in Distributed Queues', 'Backpressure Propagation', 'Network Jitter Fault Tolerance'],
  },
  trainPython: {
    targetRoleLabel: 'Deep Learning Training & Fine-Tuning Engineer',
    courseId: 'course-train-python',
    skillsList: 'PyTorch Distributed (DDP / FSDP), Mixed Precision (bf16/fp16), LoRA / QLoRA Fine-Tuning, Gradient Accumulation, Deepspeed',
    weakAreas: ['GPU Memory OOM Profiling', 'Learning Rate Scheduling & Warmup', 'Data Pipeline Bottleneck Elimination'],
  },
  aiPython: {
    targetRoleLabel: 'AI & Machine Learning Engineer (Python)',
    courseId: 'course-ai-python',
    skillsList: 'Python ML, Scikit-Learn, Feature Engineering, Supervised & Unsupervised Learning, Model Evaluation Metrics, ONNX Inference',
    weakAreas: ['Data Leakage Prevention', 'Hyperparameter Bayesian Optimization', 'Model Drift Detection'],
  },
  graphics3d: {
    targetRoleLabel: '3D Graphics & Spatial Computing Engineer',
    courseId: 'course-3d-graphics',
    skillsList: 'WebGL, Three.js, GLSL Shader Programming, 3D Mesh Geometry, Animation Rigging & Morphs, WebXR / Spatial Computing',
    weakAreas: ['Draw Call Batching & GPU Draw Bounds', 'Shader Precision & Fragment Overhead', 'LOD Asset Streaming'],
  },
  iotNetwork: {
    targetRoleLabel: 'IoT Network & Industrial Edge Protocol Engineer',
    courseId: 'course-iot-network',
    skillsList: 'LoRaWAN, Zigbee, BLE Mesh, Thread / Matter Protocols, Industrial Modbus, CoAP / MQTT-SN, Network Topologies',
    weakAreas: ['RF Interference & Path Loss Modeling', 'Mesh Routing Overhead', 'Gateway Edge Synchronization'],
  },
  iotEdgeAi: {
    targetRoleLabel: 'Edge AI & TinyML Embedded Engineer',
    courseId: 'course-iot-edge-ai',
    skillsList: 'TensorFlow Lite for Microcontrollers (TFLM), Edge TPU, Quantization (INT8), Audio Spectrogram DSP, Accelerometer Anomaly Detection',
    weakAreas: ['SRAM-Constrained Model Pruning', 'Quantization-Aware Training (QAT)', 'Real-Time Inference Jitter'],
  },
  iotSecurity: {
    targetRoleLabel: 'Embedded & Hardware Security Engineer',
    courseId: 'course-iot-security',
    skillsList: 'Hardware Root of Trust (RoT), Cryptographic Co-Processors (ATECC608), Secure Element, JTAG/UART Lockdown, Firmware Encryption',
    weakAreas: ['Side-Channel Attack Mitigation', 'Physical Tamper Detection', 'Public Key Infrastructure (PKI) for IoT'],
  },
  quantSystems: {
    targetRoleLabel: 'Quantitative Trading Systems Engineer',
    courseId: 'course-quant-systems',
    skillsList: 'C++ / Low-Latency Systems, Order Book Matching Engines, Market Data Feeds (FIX/FAST), High-Frequency Trading Architecture, Slippage Modeling',
    weakAreas: ['Kernel Bypass & NIC Tuning', 'Lock-Free Queue Synchronization', 'Risk Gate Pre-Trade Latency'],
  },
  quantPython: {
    targetRoleLabel: 'Quantitative Finance & Algorithmic Trading Specialist',
    courseId: 'course-quant-python',
    skillsList: 'Python, NumPy & Pandas, Vectorized Backtesting, Monte Carlo Simulation, Black-Scholes Pricing, Sharpe & Sortino Optimization',
    weakAreas: ['Lookahead & Survivorship Bias', 'Regime Shift Adaptation', 'Transaction Cost Drag Modeling'],
  },
  computerFundamentals: {
    targetRoleLabel: 'Computer Systems & IT Fundamentals Specialist',
    courseId: 'course-computer-fundamentals',
    skillsList: 'Operating System Internals (Linux/Windows), CLI & Bash Scripting, File System Hierarchy, Networking Basics (DNS/TCP/IP), Process Management',
    weakAreas: ['Linux File Permission Hardening', 'Process Signal Handling', 'Network Subnetting & CIDR'],
  },
  promptLiteracy: {
    targetRoleLabel: 'Generative AI & Prompt Engineering Specialist',
    courseId: 'course-ai-prompt-literacy',
    skillsList: 'Few-Shot Prompting, Chain-of-Thought (CoT), Markdown Output Formatting, Persona Framing, System Message Steering, Ethical AI Boundaries',
    weakAreas: ['Hallucination Verification Protocols', 'Prompt Drift Over Model Versions', 'Complex Multi-Constraint Prompting'],
  },
  promptPython: {
    targetRoleLabel: 'LLM Application & Prompt Developer (Python)',
    courseId: 'course-ai-prompt-python',
    skillsList: 'Python OpenAI / Anthropic / Gemini SDKs, Structured JSON Output, Function Calling & Tool Use, Dynamic Few-Shot Retrieval, Async Batching',
    weakAreas: ['Pydantic Schema Validation Fallbacks', 'Token Budget Rate Limiting', 'Streaming Parser Interruption'],
  },
  excelDataViz: {
    targetRoleLabel: 'Business Intelligence & Excel Analytics Specialist',
    courseId: 'course-excel-data-viz',
    skillsList: 'Advanced Excel, Dynamic Array Formulas (XLOOKUP/FILTER/UNIQUE), Pivot Tables & Slicers, Power Query ETL, Executive Charting',
    weakAreas: ['Nested Array Performance Drops', 'Data Model Relationship Ambiguity', 'Dashboard Visual Clutter Reduction'],
  },
  gitVersionControl: {
    targetRoleLabel: 'Software Tools & Version Control Specialist',
    courseId: 'course-git-version-control',
    skillsList: 'Git CLI, Branching Strategies (GitFlow / Trunk), Interactive Rebase, Conflict Resolution, Git Submodules, Pull Request Code Review',
    weakAreas: ['Detached HEAD State Recovery', 'Reflog Disaster Restoration', 'Cherry-Pick Merge Conflict Cleanups'],
  },
  softSkills: {
    targetRoleLabel: 'Professional Tech Communicator & Leadership Specialist',
    courseId: 'course-softskills-communication',
    skillsList: 'Technical Presentation Storytelling, Executive Email Synthesis, Cross-Functional Stakeholder Alignment, Active Listening, STAR Interview Delivery',
    weakAreas: ['Non-Technical Jargon Translation', 'Conflict Resolution Frameworks', 'Timeboxed Architectural Pitches'],
  },
  nlp: {
    targetRoleLabel: 'NLP Engineer & Computational Linguist',
    courseId: 'course-nlp',
    skillsList: 'Tokenization (BPE/WordPiece), TF-IDF, Word Embeddings, Multi-Head Attention, Transformers (BERT/GPT), Named Entity Recognition (NER)',
    weakAreas: ['Subword Boundary Ambiguity', 'Attention Quadratic Complexity at Scale', 'Low-Resource Language Tokenization'],
  },
  nlpPython: {
    targetRoleLabel: 'NLP & Language Model Engineer (Python)',
    courseId: 'course-nlp-python',
    skillsList: 'Python HuggingFace Transformers, PyTorch NLP, Spacy Pipelines, Text Classification, LoRA PEFT Fine-Tuning, Sentence Transformers',
    weakAreas: ['Fine-Tuning Catastrophic Forgetting', 'Batch Token Padding Waste', 'Cross-Encoder Re-Ranking Latency'],
  },
};

/**
 * Authoritative Course-to-Track mapping covering all courses and canonical aliases.
 */
export const COURSE_TRACK_MAP: Record<string, ResolvedTrack> = {
  // Core Software Engineering
  'course-java-logic': TRACKS.java,
  'course-java': TRACKS.java,
  'course-react-web': TRACKS.frontend,
  'course-react': TRACKS.frontend,
  'course-node-web': TRACKS.nodeWeb,
  'course-fullstack-js': TRACKS.fullstack,
  'course-fullstack': TRACKS.fullstack,
  'course-fullstack-dev': TRACKS.fullstack,
  'course-dsa-optim': TRACKS.dsa,
  'course-dsa': TRACKS.dsa,
  'course-dsa-python': TRACKS.dsaPython,
  'course-python-backend': TRACKS.pythonBackend,
  'course-python': TRACKS.pythonBackend,
  'course-python-fullstack': TRACKS.pythonBackend,

  // Cloud & Reliability
  'course-cloud-native': TRACKS.cloudNative,
  'course-cloud-python': TRACKS.cloudPython,
  'course-devops-cicd': TRACKS.devops,
  'course-devops': TRACKS.devops,
  'course-cloud-devops': TRACKS.devops,
  'course-sre-web': TRACKS.sre,
  'course-stream-web': TRACKS.streaming,
  'course-aideploy-web': TRACKS.aideploy,
  'course-database-eng': TRACKS.databaseEng,
  'course-database': TRACKS.databaseEng,
  'course-distributed-sys': TRACKS.distributedSys,
  'course-distributed': TRACKS.distributedSys,
  'course-distributed-python': TRACKS.distributedPython,

  // AI & Advanced Computing
  'course-ai-eng': TRACKS.ai,
  'course-ai': TRACKS.ai,
  'course-ai-python': TRACKS.aiPython,
  'course-vector-python': TRACKS.vectorPython,
  'course-safety-python': TRACKS.safetyPython,
  'course-train-python': TRACKS.trainPython,
  'course-nlp': TRACKS.nlp,
  'course-nlp-python': TRACKS.nlpPython,
  'course-ai-prompt-literacy': TRACKS.promptLiteracy,
  'course-ai-prompt-python': TRACKS.promptPython,

  // Mobile, Hardware & Graphics
  'course-mobile-dev': TRACKS.mobile,
  'course-iot-embedded': TRACKS.iot,
  'course-iot-network': TRACKS.iotNetwork,
  'course-iot-edge-ai': TRACKS.iotEdgeAi,
  'course-iot-security': TRACKS.iotSecurity,
  'course-3d-graphics': TRACKS.graphics3d,
  'course-blockchain-web3': TRACKS.blockchain,
  'course-cybersecurity': TRACKS.cyber,
  'course-cyber-python': TRACKS.cyberPython,

  // Quantitative Finance & Systems
  'course-quant-systems': TRACKS.quantSystems,
  'course-quant-python': TRACKS.quantPython,

  // Commerce & Management
  'course-digital-accounting': TRACKS.accounting,
  'course-accounting': TRACKS.accounting,
  'course-finance-investment': TRACKS.investment,
  'course-finance': TRACKS.finance,
  'course-business-analytics': TRACKS.analytics,
  'course-marketing-branding': TRACKS.marketing,
  'course-marketing': TRACKS.marketing,
  'course-digital-marketing': TRACKS.digitalMarketing,
  'course-ecommerce-digital-biz': TRACKS.ecommerce,
  'course-ecommerce': TRACKS.ecommerce,
  'course-entrepreneurship-biz-mgmt': TRACKS.entrepreneur,
  'course-entrepreneurship': TRACKS.entrepreneur,
  'course-sales-crm-success': TRACKS.sales,
  'course-sales': TRACKS.sales,
  'course-operations-supplychain-compliance': TRACKS.operations,
  'course-operations': TRACKS.operations,
  'course-ai-digital-transformation': TRACKS.digitalTransformation,

  // Foundations & Professional Skills
  'course-design-systems': TRACKS.uiux,
  'course-computer-fundamentals': TRACKS.computerFundamentals,
  'course-excel-data-viz': TRACKS.excelDataViz,
  'course-git-version-control': TRACKS.gitVersionControl,
  'course-softskills-communication': TRACKS.softSkills,
  'course-soft-skills': TRACKS.softSkills,
};

/**
 * Deterministically resolves a track for ANY course ID, with safe fallback.
 */
export function resolveTrackForCourse(courseId: string): ResolvedTrack {
  const normalized = (courseId || '').trim().toLowerCase();
  if (COURSE_TRACK_MAP[normalized]) return COURSE_TRACK_MAP[normalized];
  if (COURSE_TRACK_MAP[`course-${normalized}`]) return COURSE_TRACK_MAP[`course-${normalized}`];

  // If formatted as a course-id, generate a deterministic fallback preserving courseId
  if (normalized.startsWith('course-')) {
    const rawName = normalized.replace(/^course-/, '').replace(/[-_]/g, ' ');
    const titleCase = rawName.replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      targetRoleLabel: `${titleCase} Specialist`,
      courseId: normalized,
      skillsList: 'Core Architecture, Industry Best Practices, Production Reliability, Automated Testing, Technical Documentation',
      weakAreas: ['Production Scalability', 'Advanced System Patterns', 'Performance Benchmarking'],
    };
  }

  return TRACKS.java;
}

/** Onboarding option ids (the four goal questions) → track. Options not listed ("exploring", "other", …) use the degree fallback. */
const OPTION_TRACK: Record<string, TrackKey> = {
  // Q2_PRIMARY_ROLE (tech)
  frontend_developer: 'frontend',
  backend_developer: 'java',
  full_stack_developer: 'fullstack',
  ai_ml_engineer: 'ai',
  data_analyst: 'analytics',
  ui_ux_designer: 'uiux',
  qa_engineer: 'qa',
  cybersecurity: 'cyber',
  cloud_devops: 'devops',
  product_manager: 'product',
  financial_analyst: 'finance',
  digital_marketing: 'digitalMarketing',
  sre_engineer: 'sre',
  blockchain_developer: 'blockchain',
  mobile_developer: 'mobile',
  nlp_engineer: 'nlp',
  quant_engineer: 'quantSystems',
  // Q1_COMMERCE_GOAL
  accounting_finance: 'accounting',
  banking_services: 'banking',
  audit_taxation: 'accounting',
  business_analytics: 'analytics',
  investment_markets: 'investment',
  corporate_management: 'consulting',
  human_resources: 'hr',
  marketing_sales: 'marketing',
  entrepreneurship: 'entrepreneur',
  higher_education: 'research',
  // Q1_BBA_CAREER_DIRECTION
  management_strategy: 'consulting',
  marketing_growth: 'digitalMarketing',
  sales_bizdev: 'sales',
  corporate_finance: 'finance',
  consulting: 'consulting',
  operations_supplychain: 'operations',
  product_management: 'product',
  entrepreneurship_startup: 'entrepreneur',
  banking_financial_services: 'banking',
  // Q3_GEN_CAREER_CONSIDERATION
  technology: 'fullstack',
  research: 'research',
  data: 'analytics',
  design: 'uiux',
  media: 'media',
  education: 'education',
  healthcare: 'healthcare',
  public_sector: 'policy',
  business: 'entrepreneur',
  finance: 'finance',
  marketing: 'marketing',
  operations: 'operations',
  law: 'policy',
  engineering: 'hardware',
  scientific: 'research',
  creative: 'creative',
  social_sector: 'social',
  // Express onboarding trajectories (useOnboardingWizard `trajectory`)
  java_sde: 'java',
  react_frontend: 'frontend',
  devops_cloud: 'devops',
  business_analyst: 'analytics',
};

interface KeywordRule {
  track: TrackKey;
  /** Whole words. */
  words?: string[];
  /** Whole phrases (words separated by single spaces, after the text is tokenized). */
  phrases?: string[];
  /** The rule does not apply when one of these phrases is present. */
  unless?: string[];
}

/** Free-text rules, most specific first. */
const KEYWORD_RULES: KeywordRule[] = [
  { track: 'digitalTransformation', words: ['rpa'], phrases: ['digital transformation', 'ai transformation', 'ai business', 'ai strategy'] },
  { track: 'sre', words: ['sre', 'opentelemetry'], phrases: ['site reliability', 'site reliability engineer', 'reliability engineer', 'error budget'] },
  { track: 'streaming', words: ['kafka'], phrases: ['stream processing', 'event driven', 'real time streaming', 'redis streams'] },
  { track: 'aideploy', words: ['mlops', 'ollama', 'vllm'], phrases: ['ai deployment', 'model serving', 'llm deployment', 'model deployment'] },
  { track: 'vectorPython', words: ['pgvector', 'pinecone', 'qdrant', 'milvus', 'weaviate'], phrases: ['vector database', 'vector search', 'dense retrieval', 'hybrid search'] },
  { track: 'safetyPython', words: ['guardrails', 'redteaming'], phrases: ['ai safety', 'model alignment', 'red teaming', 'prompt injection'] },
  { track: 'databaseEng', words: ['postgres', 'postgresql', 'dba', 'sql'], phrases: ['database engineer', 'database engineering', 'query optimization', 'database architect', 'query performance'] },
  { track: 'distributedSys', words: ['raft', 'paxos'], phrases: ['distributed systems', 'distributed system', 'high scale system', 'distributed architecture'] },
  { track: 'graphics3d', words: ['webgl', 'threejs', 'three.js', 'glsl', 'shader', 'shaders', 'webxr'], phrases: ['3d graphics', 'spatial computing', 'avatar animation'] },
  { track: 'quantSystems', words: ['hft', 'quant'], phrases: ['quantitative trading', 'quant developer', 'quant systems', 'algorithmic trading', 'matching engine'] },
  { track: 'nlp', words: ['nlp', 'transformers', 'bert', 'tokenization'], phrases: ['natural language processing', 'computational linguistics'] },
  { track: 'promptLiteracy', words: ['prompting'], phrases: ['prompt engineering', 'prompt literacy', 'generative literacy'] },
  { track: 'excelDataViz', words: ['excel', 'vlookup', 'xlookup', 'pivot'], phrases: ['data visualization', 'excel analytics', 'spreadsheet modeling'] },
  { track: 'gitVersionControl', words: ['git', 'github'], phrases: ['version control'] },
  { track: 'softSkills', words: ['communication', 'presentation'], phrases: ['soft skills', 'tech communication', 'interview mastery'] },
  { track: 'computerFundamentals', phrases: ['computer fundamentals', 'operating systems', 'os fundamentals', 'computer literacy'] },
  { track: 'ai', words: ['ai', 'ml', 'llm', 'llms', 'genai', 'nlp', 'aiml'], phrases: ['artificial intelligence', 'machine learning', 'deep learning', 'computer vision', 'generative ai'] },
  {
    track: 'analytics',
    words: ['analytics', 'bi', 'powerbi', 'tableau', 'data'],
    phrases: ['data analyst', 'data analysis', 'data science', 'data scientist', 'data engineer', 'data engineering', 'business analyst', 'big data', 'power bi'],
    unless: ['data structure', 'data structures'],
  },
  { track: 'dsa', words: ['dsa', 'algorithm', 'algorithms', 'leetcode'], phrases: ['data structure', 'data structures', 'competitive programming'] },
  { track: 'blockchain', words: ['blockchain', 'web3', 'solidity', 'crypto', 'ethereum', 'dapp', 'dapps'], phrases: ['smart contract', 'smart contracts'] },
  { track: 'cyber', words: ['cyber', 'cybersecurity', 'security', 'infosec', 'pentester', 'pentesting'], phrases: ['cyber security', 'ethical hacking', 'penetration testing'] },
  { track: 'mobile', words: ['mobile', 'android', 'ios', 'flutter', 'kotlin', 'swift'], phrases: ['react native', 'mobile app', 'mobile apps', 'app developer'] },
  { track: 'fullstack', words: ['fullstack', 'mern', 'mean'], phrases: ['full stack'] },
  { track: 'frontend', words: ['frontend', 'react', 'reactjs', 'nextjs', 'html', 'css', 'website', 'websites'], phrases: ['front end', 'next js', 'web developer', 'web development', 'web dev'] },
  { track: 'nodeWeb', words: ['nodejs', 'expressjs'], phrases: ['node js', 'node backend', 'typescript backend'] },
  { track: 'cloudNative', phrases: ['cloud native', 'aws cloud', 'cloud architect'] },
  { track: 'pythonBackend', words: ['python', 'django', 'flask', 'fastapi'] },
  { track: 'java', words: ['backend', 'java', 'spring', 'sde'], phrases: ['back end', 'software engineer', 'software engineering', 'software developer', 'spring boot'] },
  { track: 'devops', words: ['devops', 'cloud', 'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'k8s', 'sre', 'terraform'] },
  { track: 'qa', words: ['qa', 'tester', 'testing', 'sdet'], phrases: ['quality assurance', 'test automation', 'test engineer', 'automation testing'] },
  {
    track: 'uiux',
    words: ['ui', 'ux', 'figma', 'design', 'designer'],
    phrases: ['user experience', 'user interface', 'product designer', 'interaction design'],
    unless: ['system design', 'circuit design', 'chip design', 'graphic design', 'graphic designer', 'game design'],
  },
  { track: 'iot', words: ['iot', 'embedded', 'firmware', 'arduino', 'microcontroller', 'microcontrollers'] },
  { track: 'accounting', words: ['tax', 'taxation', 'audit', 'auditor', 'auditing', 'compliance', 'accounting', 'accountant', 'tally', 'bookkeeping', 'gst'], phrases: ['chartered accountant'] },
  { track: 'banking', words: ['bank', 'banking', 'banker', 'credit', 'lending', 'loan', 'loans'] },
  { track: 'investment', words: ['investment', 'investments', 'investing', 'equity', 'trading', 'trader', 'stock', 'stocks', 'markets'], phrases: ['stock market', 'equity research', 'capital markets'] },
  { track: 'hr', words: ['hr', 'recruiter', 'recruiting', 'recruitment', 'talent'], phrases: ['human resource', 'human resources', 'people ops', 'people operations'] },
  { track: 'digitalMarketing', words: ['seo', 'sem', 'growth'], phrases: ['digital marketing', 'performance marketing', 'social media marketing', 'growth marketing'] },
  { track: 'ecommerce', words: ['ecommerce'], phrases: ['e commerce', 'online store', 'online business'] },
  { track: 'marketing', words: ['marketing', 'marketer', 'brand', 'branding', 'market'] },
  { track: 'entrepreneur', words: ['entrepreneur', 'entrepreneurship', 'startup', 'startups', 'founder', 'venture'], phrases: ['family business', 'own business', 'start a business', 'my own company'] },
  { track: 'sales', words: ['sales', 'sale', 'salesperson', 'crm', 'bizdev'], phrases: ['customer success', 'client relations', 'business development'] },
  { track: 'finance', words: ['finance', 'financial', 'fintech', 'cfa'] },
  { track: 'consulting', words: ['consultant', 'consulting', 'consult', 'strategy', 'strategist'], phrases: ['management consultant', 'business strategy'] },
  { track: 'product', phrases: ['product manager', 'product management', 'project manager', 'project management', 'product owner'] },
  { track: 'operations', words: ['operations', 'logistics', 'supplychain', 'procurement'], phrases: ['supply chain', 'front office', 'back office'] },
  {
    track: 'research',
    words: ['research', 'researcher', 'science', 'scientist', 'academic', 'academia', 'biotech', 'phd', 'lab', 'laboratory'],
    unless: ['computer science'],
  },
  { track: 'policy', words: ['law', 'legal', 'lawyer', 'advocate', 'policy', 'governance'], phrases: ['public sector', 'public policy'] },
  { track: 'education', words: ['education', 'teaching', 'teacher', 'pedagogy', 'tutor', 'edtech'] },
  { track: 'healthcare', words: ['health', 'healthcare', 'clinical', 'pharma', 'pharmacy', 'pharmaceutical', 'hospital', 'medical', 'nursing'] },
  { track: 'media', words: ['media', 'journalism', 'journalist', 'content', 'writing', 'writer', 'copywriter', 'editor'] },
  { track: 'creative', words: ['creative', 'animation', 'animator', 'illustration', 'illustrator', 'artist'], phrases: ['game art', 'graphic design', 'graphic designer', 'motion graphics', 'video editing'] },
  { track: 'hardware', words: ['engineering', 'hardware', 'robotics', 'electronics', 'vlsi'], unless: ['software engineering'] },
  { track: 'social', words: ['ngo', 'nonprofit'], phrases: ['non profit', 'social sector', 'social impact', 'social work'] },
];

/** Lowercase words of the text ("Full-Stack / Next.js" → ["full", "stack", "next", "js"]). */
function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/&/g, ' and ').split(/[^a-z0-9+#]+/).filter(Boolean);
}

function matches(rule: KeywordRule, words: Set<string>, padded: string): boolean {
  const has = (phrase: string) => padded.includes(` ${phrase} `);
  if (rule.unless?.some(has)) {
    // Only the phrase-level signals count then (e.g. "data structures" is not data analytics,
    // but "data structures and a data science career" still is).
    return Boolean(rule.phrases?.some(has));
  }
  return Boolean(rule.words?.some((w) => words.has(w)) || rule.phrases?.some(has));
}

/** The track the goal names (option id, role label or typed words), or null if it names none. */
export function matchTrackFromGoal(goalRole?: string): ResolvedTrack | null {
  const goal = (goalRole || '').trim().toLowerCase();
  if (!goal) return null;

  // Direct courseId or course alias match
  if (COURSE_TRACK_MAP[goal]) return COURSE_TRACK_MAP[goal];
  if (COURSE_TRACK_MAP[`course-${goal}`]) return COURSE_TRACK_MAP[`course-${goal}`];

  const option = OPTION_TRACK[goal];
  if (option) return TRACKS[option];

  // A saved role label (e.g. onboarding_answers.role = "Product Manager (Tech & Business Strategy)").
  const byLabel = (Object.keys(TRACKS) as TrackKey[]).find((k) => TRACKS[k].targetRoleLabel.toLowerCase() === goal);
  if (byLabel) return TRACKS[byLabel];

  const tokens = tokenize(goal);
  const words = new Set(tokens);
  const padded = ` ${tokens.join(' ')} `;
  const rule = KEYWORD_RULES.find((r) => matches(r, words, padded));
  return rule ? TRACKS[rule.track] : null;
}

export function resolveTrackFromGoal(goalRole?: string, profileType?: string): ResolvedTrack {
  const matched = matchTrackFromGoal(goalRole);
  if (matched) return matched;
  const profile = (profileType || '').toLowerCase();

  // Nothing in the goal: fall back on the degree.
  if (/\bcommerce\b|b\.?com\b|m\.?com\b/.test(profile)) return TRACKS.finance;
  if (/\bmanagement\b|\bbba\b|\bmba\b/.test(profile)) return TRACKS.operations;
  return TRACKS.java;
}
