# PinIT Career OS — 36+ Individual 1-Month Courses Master Visuals Architecture & Implementation Plan

**Document:** `PINIT_36_INDIVIDUAL_COURSES_VISUALS_PLAN`  
**Version:** 2.0 (Production Masterclass Edition)  
**Date:** 10 October 2026  
**System:** PinIT Career OS Visual Learning Engine (`VisualStage.tsx`, `/api/visuals`, Gate v2)  
**Scope:** All 37 Individual 1-Month Certificate Courses across 6 Distinct Domain Clusters  
**Total Volume:** 37 Courses &times; 6 Blocks &times; 5 Days = **1,110 Lesson Days** &times; 6 Parts = **6,660 Interactive Lesson Parts**  
**Compilation Output:** `docs/visuals/PINIT_36_INDIVIDUAL_COURSES_VISUALS_PLAN.pdf`  

---

## 📋 Executive Architecture & Metadata Matrix

| Attribute | Specification Details |
| :--- | :--- |
| **Master Course Count** | **37 Courses** (36+ 1-Month Professional Certifications) |
| **Domain Clusters** | 6 Distinct Clusters (Software Engineering, Systems/Mobile/Data, Hardware/Web3/Quant, Commerce/Finance, Operations/Digital Biz, Universal Foundations) |
| **Duration per Course** | **4 Weeks / 30 Curriculum Days** structured into 6 contiguous 5-day blocks |
| **Total Lesson Days** | **1,110 Days** across all 37 courses |
| **Total Lesson Parts** | **6,660 Interactive Parts** (6 parts per lesson day) |
| **Interactive Visual Quests** | **> 4,500 active diagram specifications** (with strict minimum &ge; 3 visuals per day per Gate v2 R10) |
| **Supported Templates** | **17 Production Templates** (Flow, Boxes, Table, Letters, Compare, Cells, Stack-Queue, Tree-Graph, Bars, Sequence, States, Workflow, Component-Tree, Wireframe, Register-Bits, Ledger-Sheet, Funnel) |
| **Quality Standard** | **Technical Gate v2 (Rules R1–R14)**: 100% deterministic AST & code output bindings, 0 hallucinated values, strictly monotonically increasing steps |
| **Batch Verification Protocol**| **5-Day Contiguous Batch Loop**: PDF Ground Truth &rarr; Gate Audit &rarr; In-Situ Remediation &rarr; Runtime Test &rarr; Atomic Git Checkpoint |

---

## 🏛️ Domain Cluster Taxonomy (All 37 Courses)

The 37 individual 1-month courses in PinIT Career OS are partitioned across **6 Domain Clusters** reflecting real-world career disciplines:

### CLUSTER-1: SE-WEB-CLOUD: Core Software Engineering, Web & Cloud Systems

| # | Course ID | Canonical Title | Level | Quests | Allowed Visual Templates |
| :---: | :--- | :--- | :---: | :---: | :--- |
| **01** | `course-java-logic` | Java Fundamentals & Core Logic | Beginner | 96 | `boxes`, `flow`, `table`, `cells`, `stack-queue`, `compare` |
| **02** | `course-react-web` | Full-Stack React Web Development | Intermediate | 96 | `component-tree`, `wireframe`, `flow`, `boxes`, `compare`, `states` |
| **03** | `course-node-web` | Node.js & TypeScript Backend Engineering | Intermediate | 96 | `sequence`, `stack-queue`, `flow`, `boxes`, `table`, `states` |
| **04** | `course-cloud-native` | Cloud Native Architectures (AWS) | Advanced | 96 | `workflow`, `sequence`, `states`, `table`, `bars`, `compare` |
| **05** | `course-devops-cicd` | DevOps & CI/CD Pipeline Automation | Advanced | 96 | `flow`, `workflow`, `states`, `sequence`, `compare` |
| **06** | `course-design-systems` | UI/UX Design Systems & Visual Frontend | Beginner | 96 | `wireframe`, `component-tree`, `compare`, `boxes`, `bars` |

### CLUSTER-2: SYS-SEC-DATA: Systems, Mobile, Security, DB & Distributed Systems

| # | Course ID | Canonical Title | Level | Quests | Allowed Visual Templates |
| :---: | :--- | :--- | :---: | :---: | :--- |
| **07** | `course-dsa-optim` | Data Structures & Algorithmic Optimizations | Intermediate | 96 | `cells`, `stack-queue`, `tree-graph`, `table`, `bars`, `compare` |
| **08** | `course-mobile-dev` | Mobile Application Development | Intermediate | 96 | `wireframe`, `component-tree`, `flow`, `sequence`, `states` |
| **09** | `course-cybersecurity` | Cybersecurity Principles & Secure Systems | Advanced | 96 | `flow`, `sequence`, `table`, `compare`, `states` |
| **10** | `course-database-eng` | Database Engineering & Query Performance | Advanced | 96 | `table`, `tree-graph`, `flow`, `compare`, `bars` |
| **11** | `course-distributed-sys` | High-Scale Distributed System Design | Advanced | 96 | `sequence`, `workflow`, `states`, `table`, `cells`, `compare` |
| **12** | `course-ai-eng` | AI Engineering & LLM Integration | Intermediate | 96 | `flow`, `table`, `bars`, `sequence`, `compare`, `boxes` |
| **13** | `course-fullstack-js` | Full-Stack JavaScript Engineering | Intermediate | 384 | `flow`, `component-tree`, `sequence`, `table`, `states`, `compare` |

### CLUSTER-3: EMBEDDED-QUANT: Embedded Hardware, 3D, Web3 & High-Frequency Systems

| # | Course ID | Canonical Title | Level | Quests | Allowed Visual Templates |
| :---: | :--- | :--- | :---: | :---: | :--- |
| **14** | `course-iot-embedded` | IoT, Firmware & Embedded Systems | Intermediate | 96 | `flow`, `states`, `cells`, `boxes`, `sequence`, `register-bits` |
| **15** | `course-3d-graphics` | 3D Interactive Graphics & Avatar Animation | Advanced | 96 | `tree-graph`, `boxes`, `flow`, `compare`, `bars` |
| **16** | `course-blockchain-web3` | Blockchain, Web3 & Smart Contracts | Intermediate | 96 | `tree-graph`, `stack-queue`, `flow`, `sequence`, `compare`, `states` |
| **17** | `course-iot-network` | IoT Wireless Networks & Protocols | Intermediate | 96 | `flow`, `sequence`, `states`, `table`, `compare` |
| **18** | `course-iot-edge-ai` | Edge AI, DSP & TinyML Systems | Advanced | 96 | `flow`, `bars`, `cells`, `table`, `compare` |
| **19** | `course-iot-security` | Industrial IoT Security & Device Lifecycle | Advanced | 96 | `flow`, `sequence`, `states`, `compare`, `table` |
| **20** | `course-python-backend` | Python Programming & Backend Systems | Intermediate | 96 | `flow`, `sequence`, `boxes`, `table`, `states`, `compare` |
| **21** | `course-quant-systems` | Quantitative Engineering & Low-Latency Trading Systems | Advanced | 96 | `stack-queue`, `table`, `bars`, `flow`, `cells`, `compare` |

### CLUSTER-4: FIN-ACCT-BIZ: Digital Accounting, Corporate Finance & Business Analytics

| # | Course ID | Canonical Title | Level | Quests | Allowed Visual Templates |
| :---: | :--- | :--- | :---: | :---: | :--- |
| **22** | `course-digital-accounting` | Digital Accounting & Taxation (B.Com / BBA) | Beginner | 96 | `table`, `flow`, `compare`, `bars`, `ledger-sheet` |
| **23** | `course-finance-investment` | Business Finance & Investment Management (B.Com / BBA) | Beginner | 96 | `table`, `bars`, `flow`, `compare` |
| **24** | `course-business-analytics` | Business Analytics & Decision Intelligence (B.Com / BBA / MBA) | Beginner | 96 | `bars`, `table`, `flow`, `compare` |
| **25** | `course-marketing-branding` | Marketing & Brand Management (B.Com / BBA / MBA) | Beginner | 96 | `flow`, `compare`, `table`, `bars` |
| **26** | `course-digital-marketing` | Digital Marketing & Growth Strategy (B.Com / BBA / MBA) | Beginner | 96 | `flow`, `bars`, `table`, `compare`, `funnel` |

### CLUSTER-5: ECOM-OPS-AI: Digital Commerce, Operations, Sales & AI Transformation

| # | Course ID | Canonical Title | Level | Quests | Allowed Visual Templates |
| :---: | :--- | :--- | :---: | :---: | :--- |
| **27** | `course-ecommerce-digital-biz` | E-Commerce & Digital Business (B.Com / BBA / MBA) | Beginner | 96 | `flow`, `table`, `sequence`, `bars`, `compare`, `funnel` |
| **28** | `course-entrepreneurship-biz-mgmt` | Entrepreneurship & Business Management (B.Com / BBA / MBA) | Beginner | 96 | `flow`, `table`, `compare`, `bars` |
| **29** | `course-sales-crm-success` | Sales, Customer Success & CRM (B.Com / BBA / MBA) | Beginner | 96 | `flow`, `table`, `states`, `bars`, `compare`, `funnel` |
| **30** | `course-operations-supplychain-compliance` | Operations, Supply Chain & Business Compliance (B.Com / BBA / MBA) | Beginner | 96 | `flow`, `table`, `bars`, `compare` |
| **31** | `course-ai-digital-transformation` | AI & Digital Transformation for Business (B.Com / BBA / MBA) | Beginner | 96 | `workflow`, `flow`, `table`, `compare`, `bars` |

### CLUSTER-6: FOUNDATIONS: Universal Digital Foundations, Tools & Cognitive Communication

| # | Course ID | Canonical Title | Level | Quests | Allowed Visual Templates |
| :---: | :--- | :--- | :---: | :---: | :--- |
| **32** | `course-computer-fundamentals` | Computer Literacy, Digital Productivity & OS Fundamentals | Beginner | 96 | `flow`, `boxes`, `tree-graph`, `table`, `compare` |
| **33** | `course-ai-prompt-literacy` | Everyday AI Literacy & Prompt Engineering | Beginner | 96 | `flow`, `compare`, `boxes`, `table`, `bars` |
| **34** | `course-excel-data-viz` | Excel & Data Analysis Fundamentals | Beginner | 96 | `table`, `cells`, `bars`, `compare`, `flow` |
| **35** | `course-git-version-control` | Git, GitHub & Version Control Basics | Beginner | 96 | `tree-graph`, `flow`, `states`, `compare`, `boxes` |
| **36** | `course-softskills-communication` | Professional Tech Communication & Interview Mastery | Beginner | 96 | `flow`, `compare`, `table`, `states` |
| **37** | `course-nlp` | Natural Language Processing & Computational Linguistics | Advanced | 96 | `letters`, `cells`, `table`, `flow`, `bars`, `tree-graph` |

---

## 🎨 Master Visual Templates Catalog (17 Interactive Diagram Engines)

Every diagram displayed to a student in PinIT Career OS is rendered by one of 17 specialized visual engines. No diagram is a static image; each is an interactive, stateful SVG/Canvas/DOM component that steps in sync with the instructor's spoken sentence:

| Template Key | Engine Name | Primary Domain | Visual Representation & Pedagogical Function |
| :--- | :--- | :--- | :--- |
| `flow` | **Multi-Stage Flow** | Universal | Linear and branching pipelines with stage status highlights |
| `boxes` | **Memory & State Boxes** | Systems / Web | Slots holding named variables, props, register values, or configs |
| `table` | **Relational & Ledger Table** | Data / Fin / API | Columns and rows with row-by-row or cell-by-cell step illumination |
| `letters` | **Character Array** | CompSci / NLP | Character cells with moving pointers for strings, tokens, and regex |
| `compare` | **Comparative Panels** | Universal | Side-by-side comparison with pass/fail indicators and pros/cons |
| `cells` | **1D Memory Array Buffer** | DSA / Hardware | Indexed array blocks with up to 3 named moving pointers |
| `stack-queue` | **LIFO Stack / FIFO Queue** | Systems / Trading | Vertical stack frames or horizontal queue with push/pop animations |
| `tree-graph` | **Hierarchical Tree / Graph** | DSA / Web / 3D | Up to 6 nodes with directional edges and traversal highlighting |
| `bars` | **Quantitative Metrics Bars** | Analytics / SRE | Labeled numeric bars comparing latency, ratios, or benchmarks |
| `sequence` | **Chronological Sequence** | Network / Auth | Lifeline columns with directional request/response message arrows |
| `states` | **Finite State Machine** | Protocols / Async | State bubbles with transitions and active state illumination |
| `workflow` | **Multi-Tier Topology** | Cloud / DevOps | System architecture topology connecting client, proxy, pods, DB |
| `component-tree` | **UI Component Hierarchy** | Frontend / Mobile | Component tree displaying props cascading down and events bubbling up |
| `wireframe` | **Box-Model Wireframe** | Frontend / Design | Nested UI boxes visualizing layout engines, margin, border, padding |
| `register-bits` | **Bitwise Register Simulator** | Embedded / IoT | 8/16/32-bit register cells visualizing bitmasks, set/clear operations |
| `ledger-sheet` | **Double-Entry T-Account** | Commerce / Acct | T-Account debit/credit columns maintaining balancing invariants |
| `funnel` | **Conversion Funnel** | Marketing / Sales | Multi-stage conversion stages showing drop-off percentages and cohorts |

### The Golden Triad: Content &harr; Output &harr; Visuals
1. **Visuals connected to Content:** Every diagram step corresponds directly to what the teacher is saying in that exact sentence (the `say` line). When the teacher explains component state updating, the diagram highlights that exact component.
2. **Content connected to Output:** Every lesson shows runnable code and its exact real-world console or terminal output.
3. **Output connected to Visuals:** The numbers, variable names, HTTP status codes, and DOM text in the picture are **never typed by an AI**. They come from actually compiling and running the code in a sandbox. A picture can never display an incorrect value.
4. **Change & Run:** When a student modifies the code in the browser editor and clicks *Run*, the engine re-runs the code, re-extracts the bindings, and smoothly re-animates the diagram using the student's own values.

---

## 🛡️ Technical Gate v2: 14 Strict Non-Negotiable Rules

Every daily visual specification file (`day-{NN}.json`) must strictly pass all 14 rules of Gate v2 without warnings or exceptions:

* **R1 (AST Linkage):** The day file has exactly 6 entries, and each entry's `partTitle` matches the real lesson AST.
* **R2 (Allowed Template):** The template is `none` or is on the course's allowed template list. Arbitrary templates are rejected.
* **R3 (Shape Limits):** Between 2 and 5 steps; at most 6 shapes per step. Tables have 2–5 columns and &le; 6 rows.
* **R4 (Monotonic Progression):** `at` values are valid (`sayN` only if part has &ge; N say lines) and strictly monotonically increasing.
* **R5 (Caption Typography):** Each caption is a single sentence of at most 80 characters, ending in a period, containing zero emojis.
* **R6 (Deterministic Runtime Bindings):** Every value is a valid binding (`var`, `out`, `table`, `http`, `dom`, `error`, `text`). Filling the spec from a fresh code run reproduces `filled` exactly.
* **R7 (Number Grounding):** Every number in a caption appears in the bound values or in the part's code.
* **R8 (Word Grounding):** Every tappable word/label appears as a whole word in the lesson text or code.
* **R9 (Design Token Palette):** Visual tones are strictly restricted to the 4 design tokens: `data`, `ok`, `error`, `idle`.
* **R10 (Visual Density):** At least 3 of the 6 parts in a day have a picture; otherwise the day is flagged `needs-review`.
* **R11 (Manifest Synchronization):** The manifest status matches the day file: `passed`, `none`, or `needs-review`.
* **R12 (Conceptual Overlap):** On-concept check: Each caption shares at least one 4+ letter word with the attached lesson text.
* **R13 (Freshness Cryptography):** Each entry's `codeHash` equals the SHA-256 of the part's current code.
* **R14 (Runtime Stability):** No binding points to an unstable variable that differs across runs.

---

## 🔬 Deep Course-by-Course Blueprint (All 37 Individual Courses)

Below is the complete, unabridged architectural specification for each of the 37 individual 1-month courses. Each course details the pedagogical mental model, allowed templates, the complete 6-Block breakdown across all 30 days grounded in the actual curriculum, and the capstone milestone project:

### Course 01: [course-java-logic] Java Fundamentals & Core Logic

* **Catalog ID:** `course-java-logic`  
* **Prefix / Directory:** `src/lib/data/lessonVisuals/java-logic/`  
* **Difficulty:** Beginner | **Duration:** 4 Weeks / 30 Curriculum Days | **Quests:** 96 quests  
* **Core Architectural Theme:** JVM Architecture, Primitive Typing, OOP Invariants & Enterprise Modularity  
* **Allowed Visual Templates:** `boxes`, `flow`, `table`, `cells`, `stack-queue`, `compare`  

#### Pedagogical Whiteboard Mental Model
> Illustrate JVM Stack frame pushes/pops, heap reference allocations, and variable mutations during loops. Visuals clarify value vs reference semantics.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus & Sample Topics | Primary Visual Architecture & Step Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **JVM Bytecode execution, Primitive boxing & System.out printing flow**<br>_Sample: "Day 1: What is a Program? — Writing Your First Java Instructions"_ | Template `boxes`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 2** | Days 6–10 | **Conditional branching, Relational operators & Boolean logic tables**<br>_Sample: "Day 2 Practice 2: Day 2 Assignment: Reading Number Input"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 3** | Days 11–15 | **While/Do-While loops, Iterative counters & Array indexing cells**<br>_Sample: "Day 4 Practice 1: Day 4 Challenge: Bill Splitter with Tip"_ | Template `table`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 4** | Days 16–20 | **For loops, Nested iteration patterns & Matrix coordinate grids**<br>_Sample: "Test: Days 1–5"_ | Template `cells`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 5** | Days 21–25 | **Method call frames, Parameter pass-by-value & Return value routing**<br>_Sample: "Day 7 Practice 1: Day 7 Challenge: Calculate Factorial with While Loop"_ | Template `stack-queue`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 6** | Days 26–30 | **OOP Class blueprints, Encapsulation & Milestone Financial Engine**<br>_Sample: "Day 9: Modular Programming — Custom Methods & Reusable Logic"_ | Template `compare`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |

#### Capstone Milestone Project
* **Milestone Deliverable:** Milestone Financial Utility Engine: A multi-module Java application modeling bank accounts, compound interest calculators, and transactional debit/credit validation.

---

### Course 02: [course-react-web] Full-Stack React Web Development

* **Catalog ID:** `course-react-web`  
* **Prefix / Directory:** `src/lib/data/lessonVisuals/react-basics/`  
* **Difficulty:** Intermediate | **Duration:** 4 Weeks / 30 Curriculum Days | **Quests:** 96 quests  
* **Core Architectural Theme:** Fiber Reconciliation, Hook Closures, Virtual DOM Diffing & Component Trees  
* **Allowed Visual Templates:** `component-tree`, `wireframe`, `flow`, `boxes`, `compare`, `states`  

#### Pedagogical Whiteboard Mental Model
> Show component trees with props cascading downwards and callback events bubbling up. Highlight component re-renders triggered by state setter dispatches.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus & Sample Topics | Primary Visual Architecture & Step Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Declarative JSX parsing, Component composition & Virtual DOM tree**<br>_Sample: "Day 1: How a Website Works: HTML, CSS, JavaScript and React"_ | Template `component-tree`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 2** | Days 6–10 | **useState hook closures, Immutable state updates & Re-render triggers**<br>_Sample: "Day 2 Practice 2: Is It a Good Salary?"_ | Template `wireframe`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 3** | Days 11–15 | **Props contract interfaces, Prop drilling vs Context & Children nodes**<br>_Sample: "Day 4 Practice 1: Make a Job"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 4** | Days 16–20 | **useEffect dependency arrays, Async fetch cycles & Cleanup timers**<br>_Sample: "Test: Days 1–5"_ | Template `boxes`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 5** | Days 21–25 | **Controlled forms, Validation state machines & UI layout wireframes**<br>_Sample: "Day 7 Practice 1: Count Jobs by Status"_ | Template `compare`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 6** | Days 26–30 | **Next.js App Router hybrid rendering, Server vs Client components**<br>_Sample: "Day 9: Props: Passing Data to Components"_ | Template `states`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |

#### Capstone Milestone Project
* **Milestone Deliverable:** Production Enterprise SaaS Portal: High-performance Next.js application with dynamic dashboard routing, dark/light theme tokens, and live analytics telemetry.

---

### Course 03: [course-node-web] Node.js & TypeScript Backend Engineering

* **Catalog ID:** `course-node-web`  
* **Prefix / Directory:** `src/lib/data/lessonVisuals/node-web/`  
* **Difficulty:** Intermediate | **Duration:** 4 Weeks / 30 Curriculum Days | **Quests:** 96 quests  
* **Core Architectural Theme:** Asynchronous Event Loop, Middleware Pipelines & Relational Microservices  
* **Allowed Visual Templates:** `sequence`, `stack-queue`, `flow`, `boxes`, `table`, `states`  

#### Pedagogical Whiteboard Mental Model
> Map incoming HTTP request flows through Express middleware waterfalls. Show database connection pool acquisitions and async non-blocking I/O queues.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus & Sample Topics | Primary Visual Architecture & Step Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **V8 Engine Call Stack, libuv Event Loop & Microtask/Macrotask queues**<br>_Sample: "Day 1: The Node.js Runtime, Event Loop & Process Model"_ | Template `sequence`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 2** | Days 6–10 | **TypeScript strict typing, Interface schemas & Compile-time validation**<br>_Sample: "Day 2 Practice 2: Resolve Module Import Specifier"_ | Template `stack-queue`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 3** | Days 11–15 | **HTTP Request-Response lifecycles, RESTful routes & Express middleware**<br>_Sample: "Day 4 Practice 1: Generic Pick Fields Utility"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 4** | Days 16–20 | **Relational PostgreSQL queries, Connection pooling & ACID transactions**<br>_Sample: "Test: Days 1–5"_ | Template `boxes`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 5** | Days 21–25 | **JWT HMAC-SHA256 authentication, Bcrypt password hashing & Auth guards**<br>_Sample: "Day 7 Practice 1: Create JSON Response Object"_ | Template `table`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 6** | Days 26–30 | **Containerized production Docker build & Health-check endpoint telemetry**<br>_Sample: "Day 9: Query String Parsing & Parameter Coercion"_ | Template `states`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |

#### Capstone Milestone Project
* **Milestone Deliverable:** High-Concurrency REST Microservice: Authenticated backend API with role-based access control, connection-pooled PostgreSQL persistence, and Docker multi-stage deployment.

---

### Course 04: [course-cloud-native] Cloud Native Architectures (AWS)

* **Catalog ID:** `course-cloud-native`  
* **Prefix / Directory:** `src/lib/data/lessonVisuals/cloud/`  
* **Difficulty:** Advanced | **Duration:** 4 Weeks / 30 Curriculum Days | **Quests:** 96 quests  
* **Core Architectural Theme:** AWS VPC Topologies, Serverless Lifecycles & Highly Available Cloud Systems  
* **Allowed Visual Templates:** `workflow`, `sequence`, `states`, `table`, `bars`, `compare`  

#### Pedagogical Whiteboard Mental Model
> Visualize cloud architecture topologies: VPC subnets, Internet Gateways, Application Load Balancers, and ECS tasks. Clarify IAM role evaluation logic.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus & Sample Topics | Primary Visual Architecture & Step Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **AWS Global Cloud Infrastructure, Regions, Availability Zones & IAM Policies**<br>_Sample: "Day 1: Cloud Computing Models (IaaS, PaaS, SaaS) & Shared Responsibility"_ | Template `workflow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 2** | Days 6–10 | **VPC CIDR subnets, Public vs Private routing & Security Group firewalls**<br>_Sample: "Day 2 Practice 2: Region Code Validator"_ | Template `sequence`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 3** | Days 11–15 | **Compute scaling: EC2 instances, Application Load Balancers & Auto Scaling**<br>_Sample: "Day 4 Practice 1: Security Group Stateful Traffic Evaluator"_ | Template `states`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 4** | Days 16–20 | **Serverless computing: AWS Lambda triggers, API Gateway & DynamoDB NoSQL**<br>_Sample: "Test: Days 1–5"_ | Template `table`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 5** | Days 21–25 | **Container orchestration: ECR image registries & ECS/Fargate task definitions**<br>_Sample: "Day 7 Practice 1: Auto-Scaling Target Tracking Capacity Calculator"_ | Template `bars`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 6** | Days 26–30 | **Multi-AZ High Availability, Route53 DNS failover & Terraform IaC blueprints**<br>_Sample: "Day 9: Amazon S3 Object Storage & Lifecycle Management Tiering"_ | Template `compare`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |

#### Capstone Milestone Project
* **Milestone Deliverable:** Multi-AZ Serverless Cloud Infrastructure: Terraform-provisioned VPC architecture with ALB traffic distribution, ECS Fargate microservices, and automated health checks.

---

### Course 05: [course-devops-cicd] DevOps & CI/CD Pipeline Automation

* **Catalog ID:** `course-devops-cicd`  
* **Prefix / Directory:** `src/lib/data/lessonVisuals/devops/`  
* **Difficulty:** Advanced | **Duration:** 4 Weeks / 30 Curriculum Days | **Quests:** 96 quests  
* **Core Architectural Theme:** Immutable Containerization, Automated CI/CD Pipelines & Kubernetes Orchestration  
* **Allowed Visual Templates:** `flow`, `workflow`, `states`, `sequence`, `compare`  

#### Pedagogical Whiteboard Mental Model
> Diagram Docker layer caching trees, GitHub Actions stage execution waterfalls, and Kubernetes ReplicaSet pod reconciliation loops.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus & Sample Topics | Primary Visual Architecture & Step Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **POSIX Linux administration, Shell piping & Systemd daemon services**<br>_Sample: "Day 1: DevOps Culture, CI/CD & The 12-Factor App"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 2** | Days 6–10 | **Git trunk-based branching, Semantic versioning & GitOps workflows**<br>_Sample: "Day 2 Practice 2: Linux Exit Code Status Formatter"_ | Template `workflow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 3** | Days 11–15 | **Docker engine internals, Multi-stage image builds & Layer caching DAGs**<br>_Sample: "Day 4 Practice 1: Multi-Stage Docker Image Size & Security Validator"_ | Template `states`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 4** | Days 16–20 | **GitHub Actions runners, Lint-Test-Build matrix workflows & Secret vaults**<br>_Sample: "Test: Days 1–5"_ | Template `sequence`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 5** | Days 21–25 | **Kubernetes cluster architecture: Control plane, Pods, Services & Ingress**<br>_Sample: "Day 7 Practice 1: Container Security Posture Evaluator"_ | Template `compare`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 6** | Days 26–30 | **Zero-downtime Blue/Green deployments, Canary rollouts & Prometheus alerts**<br>_Sample: "Day 9: GitHub Actions CI: Workflow Syntax, Triggers & Secret Stores"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |

#### Capstone Milestone Project
* **Milestone Deliverable:** Enterprise Automated GitOps Pipeline: Multi-stage Docker containerization pipeline with automated GitHub Actions testing, security vulnerability scanning, and Kubernetes deployment.

---

### Course 06: [course-design-systems] UI/UX Design Systems & Visual Frontend

* **Catalog ID:** `course-design-systems`  
* **Prefix / Directory:** `src/lib/data/lessonVisuals/design-systems/`  
* **Difficulty:** Beginner | **Duration:** 4 Weeks / 30 Curriculum Days | **Quests:** 96 quests  
* **Core Architectural Theme:** Atomic Component Architectures, Design Tokens & Accessible Web Layouts  
* **Allowed Visual Templates:** `wireframe`, `component-tree`, `compare`, `boxes`, `bars`  

#### Pedagogical Whiteboard Mental Model
> Draw CSS box-model margins/borders/padding, Flexbox/Grid spatial coordinates, and accessibility contrast verification ratios across light and dark modes.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus & Sample Topics | Primary Visual Architecture & Step Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Visual hierarchy principles, Modular typography scales & 8pt grid geometry**<br>_Sample: "Day 1: Design Tokens & Semantic Color Scales: Global vs Semantic Aliases"_ | Template `wireframe`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 2** | Days 6–10 | **Color space tokens, HSL palette generation & WCAG AAA contrast ratios**<br>_Sample: "Day 2 Practice 2: Display Heading Typography CSS"_ | Template `component-tree`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 3** | Days 11–15 | **Atomic Design methodology: Atoms, Molecules, Organisms & Templates**<br>_Sample: "Day 4 Practice 1: Elevation Shadow & Modal Z-Index CSS"_ | Template `compare`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 4** | Days 16–20 | **CSS Layout mechanics: Flexbox axes, CSS Grid fr tracks & Responsive breakpoints**<br>_Sample: "Test: Days 1–5"_ | Template `boxes`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 5** | Days 21–25 | **Interactive component state machines: Hover, Focus-visible, Active & Disabled**<br>_Sample: "Day 7 Practice 1: Button Component TSX"_ | Template `bars`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 6** | Days 26–30 | **Design Token architecture: Style Dictionary, JSON token exports & Figma sync**<br>_Sample: "Day 9: Card Components & Responsive Content Containers: Aspect Ratios & Padding Ramps"_ | Template `wireframe`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |

#### Capstone Milestone Project
* **Milestone Deliverable:** Production Design System Library: Documented, accessible UI component kit featuring tokens, atomic components, and responsive mobile-to-desktop wireframe layouts.

---

### Course 07: [course-dsa-optim] Data Structures & Algorithmic Optimizations

* **Catalog ID:** `course-dsa-optim`  
* **Prefix / Directory:** `src/lib/data/lessonVisuals/dsa-optim/`  
* **Difficulty:** Intermediate | **Duration:** 4 Weeks / 30 Curriculum Days | **Quests:** 96 quests  
* **Core Architectural Theme:** Asymptotic Complexity, Memory Buffers, Tree Traversal & Dynamic Programming  
* **Allowed Visual Templates:** `cells`, `stack-queue`, `tree-graph`, `table`, `bars`, `compare`  

#### Pedagogical Whiteboard Mental Model
> Show memory array buffers with dual pointers shifting, recursion stack frame winding/unwinding, and 2D memoization grids populating optimal substructure solutions.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus & Sample Topics | Primary Visual Architecture & Step Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Big-O Asymptotic Space-Time analysis, Linear arrays & In-place operations**<br>_Sample: "Day 1: Time & Space Complexity (Big-O Asymptotics & Dominant Terms)"_ | Template `cells`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 2** | Days 6–10 | **Two-pointer convergence, Sliding window bounds & Prefix sum caching**<br>_Sample: "Day 2 Practice 2: Array In-Place Element Removal"_ | Template `stack-queue`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 3** | Days 11–15 | **Linked memory lists, LIFO Call Stacks & FIFO Circular Queue buffers**<br>_Sample: "Day 4 Practice 1: Valid Parentheses String Validator"_ | Template `tree-graph`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 4** | Days 16–20 | **Hierarchical Trees, Binary Search Tree balancing & Binary Heap priorities**<br>_Sample: "Test: Days 1–5"_ | Template `table`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 5** | Days 21–25 | **Graph topologies, Adjacency lists, BFS/DFS traversal & Dijkstra shortest paths**<br>_Sample: "Day 7 Practice 1: Hash Map with Separate Chaining"_ | Template `bars`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 6** | Days 26–30 | **Dynamic Programming: Memoization tables, Tabulation & Knapsack optimization**<br>_Sample: "Day 9: Sliding Window Technique (Fixed vs Dynamic Windows)"_ | Template `compare`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |

#### Capstone Milestone Project
* **Milestone Deliverable:** High-Performance Algorithmic Optimization Suite: Benchmark-validated implementations of cache-conscious searching, graph pathfinding, and dynamic programming schedulers.

---

### Course 08: [course-mobile-dev] Mobile Application Development

* **Catalog ID:** `course-mobile-dev`  
* **Prefix / Directory:** `src/lib/data/lessonVisuals/mobile-dev/`  
* **Difficulty:** Intermediate | **Duration:** 4 Weeks / 30 Curriculum Days | **Quests:** 96 quests  
* **Core Architectural Theme:** Cross-Platform React Native, JSI Runtime, Native Modules & Offline SQLite  
* **Allowed Visual Templates:** `wireframe`, `component-tree`, `flow`, `sequence`, `states`  

#### Pedagogical Whiteboard Mental Model
> Illustrate JavaScript-to-Native bridge execution, Yoga Flexbox layout reflows, and touch gesture responder state transitions.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus & Sample Topics | Primary Visual Architecture & Step Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **React Native architecture: JavaScript thread, JSI, Shadow Tree & Native UI**<br>_Sample: "Day 1: Mobile Architecture & React Native Bridge: JS Thread, Hermes & JSI"_ | Template `wireframe`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 2** | Days 6–10 | **Core UI primitives: View, Text, FlatList virtualization & Yoga flex layouts**<br>_Sample: "Day 2 Practice 2: React Native Root Text Tag Formatter"_ | Template `component-tree`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 3** | Days 11–15 | **Navigation architectures: Native Stack, Bottom Tabs & Deep-link URI routing**<br>_Sample: "Day 4 Practice 1: Touch Target & Hit Slop Minimum Dimension Auditor"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 4** | Days 16–20 | **Offline state persistence: MMKV fast key-value & SQLite local transactions**<br>_Sample: "Test: Days 1–5"_ | Template `sequence`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 5** | Days 21–25 | **Native hardware bridges: Camera capture, GPS Geolocation & Biometric auth**<br>_Sample: "Day 7 Practice 1: Navigation Stack Route Parameter Validator"_ | Template `states`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 6** | Days 26–30 | **Performance profiling: Hermes bytecode compilation & Release bundle packaging**<br>_Sample: "Day 9: Keyboard Handling & Forms in Mobile: KeyboardAvoidingView & Scroll Dismiss"_ | Template `wireframe`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |

#### Capstone Milestone Project
* **Milestone Deliverable:** Cross-Platform Mobile Utility App: Feature-complete React Native application featuring virtualized infinite feeds, offline SQLite synchronization, and biometric authentication.

---

### Course 09: [course-cybersecurity] Cybersecurity Principles & Secure Systems

* **Catalog ID:** `course-cybersecurity`  
* **Prefix / Directory:** `src/lib/data/lessonVisuals/cyber/`  
* **Difficulty:** Advanced | **Duration:** 4 Weeks / 30 Curriculum Days | **Quests:** 96 quests  
* **Core Architectural Theme:** Cryptographic Protocols, OWASP Top 10 Mitigation & Zero-Trust Defense  
* **Allowed Visual Templates:** `flow`, `sequence`, `table`, `compare`, `states`  

#### Pedagogical Whiteboard Mental Model
> Diagram packet inspection sequences, TLS 1.3 cryptographic key exchanges, JWT tampering detection, and SQL injection sanitization barriers.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus & Sample Topics | Primary Visual Architecture & Step Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Threat modeling methodologies, Attack vectors & OWASP Top 10 vulnerabilities**<br>_Sample: "Day 1: Information Security Core: CIA Triad & STRIDE Threat Modeling"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 2** | Days 6–10 | **Authentication architecture: Multi-factor auth, Salted Bcrypt & Session stores**<br>_Sample: "Day 2 Practice 2: SQL Parameter Placeholder Generator"_ | Template `sequence`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 3** | Days 11–15 | **Cryptographic systems: Symmetric AES-GCM, Asymmetric RSA & ECC key pairs**<br>_Sample: "Day 4 Practice 1: CSRF Anti-Forgery Token Validator"_ | Template `table`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 4** | Days 16–20 | **Web application hardening: CSP headers, CORS policies & CSRF token validation**<br>_Sample: "Test: Days 1–5"_ | Template `compare`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 5** | Days 21–25 | **Network defense: TLS 1.3 handshake, WAF firewall rules & DDoS rate limiters**<br>_Sample: "Day 7 Practice 1: Password Hashing Work Factor & Argon2id Parameter Validator"_ | Template `states`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 6** | Days 26–30 | **Security incident response: Penetration testing workflows & SIEM audit logs**<br>_Sample: "Day 9: Identity & Access Management: JWT Vulnerabilities & Alg 'none' Attacks"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |

#### Capstone Milestone Project
* **Milestone Deliverable:** Zero-Trust Secure Authentication Gateway: End-to-end hardened authentication microservice with Argon2id password hashing, rotating JWT signing keys, and brute-force rate limiting.

---

### Course 10: [course-database-eng] Database Engineering & Query Performance

* **Catalog ID:** `course-database-eng`  
* **Prefix / Directory:** `src/lib/data/lessonVisuals/database-eng/`  
* **Difficulty:** Advanced | **Duration:** 4 Weeks / 30 Curriculum Days | **Quests:** 96 quests  
* **Core Architectural Theme:** Relational Theory, B+ Tree Indexes, Transaction Isolation & WAL Logging  
* **Allowed Visual Templates:** `table`, `tree-graph`, `flow`, `compare`, `bars`  

#### Pedagogical Whiteboard Mental Model
> Illustrate B+ Tree node splits, Write-Ahead Log (WAL) sequential flushes, and query execution plans comparing sequential table scans with index lookups.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus & Sample Topics | Primary Visual Architecture & Step Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Relational algebra, Entity-Relationship schemas & Normalization (1NF–BCNF)**<br>_Sample: "Day 1: What a Database Is: Tables, Rows and Your First SELECT"_ | Template `table`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 2** | Days 6–10 | **SQL Query execution engine: Parsing, Query planning & AST optimization**<br>_Sample: "Day 2 Practice 2: A Students Table"_ | Template `tree-graph`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 3** | Days 11–15 | **Indexing data structures: B+ Tree page balancing, Hash indexes & Covering indexes**<br>_Sample: "Day 4 Practice 1: Affordable and In Stock"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 4** | Days 16–20 | **ACID properties, MVCC concurrency control & Transaction isolation anomalies**<br>_Sample: "Test: Days 1–5"_ | Template `compare`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 5** | Days 21–25 | **Query profiling: EXPLAIN ANALYZE interpretation & Buffer cache hit ratios**<br>_Sample: "Day 7 Practice 1: Names in Capitals with GST"_ | Template `bars`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 6** | Days 26–30 | **Horizontal scaling: Table partitioning, Read replication & Connection pools**<br>_Sample: "Day 9: Groups: GROUP BY and HAVING"_ | Template `table`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |

#### Capstone Milestone Project
* **Milestone Deliverable:** High-Throughput Financial Ledger Database: Production-tuned PostgreSQL schema with B+ tree composite indexes, strict MVCC isolation, and sub-millisecond query execution plans.

---

### Course 11: [course-distributed-sys] High-Scale Distributed System Design

* **Catalog ID:** `course-distributed-sys`  
* **Prefix / Directory:** `src/lib/data/lessonVisuals/dist/`  
* **Difficulty:** Advanced | **Duration:** 4 Weeks / 30 Curriculum Days | **Quests:** 96 quests  
* **Core Architectural Theme:** Consensus Protocols, Consistent Hashing, Distributed State & Fault Tolerance  
* **Allowed Visual Templates:** `sequence`, `workflow`, `states`, `table`, `cells`, `compare`  

#### Pedagogical Whiteboard Mental Model
> Show consistent hashing token rings, Raft leader election heartbeat sequences, and 2-Phase Commit prepare/commit transaction message flows.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus & Sample Topics | Primary Visual Architecture & Step Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Fallacies of distributed computing, Network partitions & CAP/PACELC theorems**<br>_Sample: "Day 1: Distributed Systems Foundations & Fallacies"_ | Template `sequence`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 2** | Days 6–10 | **RPC protocols, Protocol Buffers schema compilation & gRPC streaming channels**<br>_Sample: "Day 2 Practice 2: Partition Quorum Validator"_ | Template `workflow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 3** | Days 11–15 | **Data partitioning: Consistent hashing rings, Virtual nodes & Key distribution**<br>_Sample: "Day 4 Practice 1: Consistent Hash Ring with Virtual Nodes"_ | Template `states`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 4** | Days 16–20 | **Consensus algorithms: Paxos & Raft leader election, Term leases & Log commits**<br>_Sample: "Test: Days 1–5"_ | Template `table`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 5** | Days 21–25 | **Distributed transactions: Two-Phase Commit (2PC) & Saga compensating patterns**<br>_Sample: "Day 7 Practice 1: Bully Leader Election Protocol Engine"_ | Template `cells`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 6** | Days 26–30 | **Resilience patterns: Circuit breakers, Distributed rate limiting & Jaeger tracing**<br>_Sample: "Day 9: Consensus Protocols: Raft Log Replication & Quorum Mathematics"_ | Template `compare`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |

#### Capstone Milestone Project
* **Milestone Deliverable:** Fault-Tolerant Distributed Key-Value Store: Raft-replicated cluster featuring automated leader failover, consistent hashing shard allocation, and vector clock conflict detection.

---

### Course 12: [course-ai-eng] AI Engineering & LLM Integration

* **Catalog ID:** `course-ai-eng`  
* **Prefix / Directory:** `src/lib/data/lessonVisuals/ai/`  
* **Difficulty:** Intermediate | **Duration:** 4 Weeks / 30 Curriculum Days | **Quests:** 96 quests  
* **Core Architectural Theme:** Large Language Model Systems, Vector Similarity Search, RAG & Autonomous Agents  
* **Allowed Visual Templates:** `flow`, `table`, `bars`, `sequence`, `compare`, `boxes`  

#### Pedagogical Whiteboard Mental Model
> Draw token embedding coordinate spaces, RAG vector retrieval cosine similarity rankings, and agentic tool dispatching request/response loops.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus & Sample Topics | Primary Visual Architecture & Step Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Transformer architecture fundamentals: Tokenization, Embeddings & Self-Attention**<br>_Sample: "Day 1: Generative AI Foundations & Transformer Self-Attention"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 2** | Days 6–10 | **Prompt engineering patterns: Few-shot context, System framing & Chain-of-Thought**<br>_Sample: "Day 2 Practice 2: LLM API Request Cost Calculator"_ | Template `table`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 3** | Days 11–15 | **Vector databases: Dense embeddings, HNSW indexing & Cosine similarity search**<br>_Sample: "Day 4 Practice 1: Few-Shot Exemplar Prompt Formatter"_ | Template `bars`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 4** | Days 16–20 | **Retrieval-Augmented Generation (RAG): Document chunking & Context injection**<br>_Sample: "Test: Days 1–5"_ | Template `sequence`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 5** | Days 21–25 | **Agentic tool calling: JSON function signatures, API dispatch & ReAct loops**<br>_Sample: "Day 7 Practice 1: Vector Cosine Similarity & Semantic Ranking Engine"_ | Template `compare`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 6** | Days 26–30 | **Evaluation & Guardrails: Hallucination detection, Token budgets & Model routing**<br>_Sample: "Day 9: Document Chunking Strategies & Overlap Math"_ | Template `boxes`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |

#### Capstone Milestone Project
* **Milestone Deliverable:** Enterprise Document Intelligence Copilot: Production RAG pipeline with semantic document chunking, hybrid vector search, citation synthesis, and guardrail verification.

---

### Course 13: [course-fullstack-js] Full-Stack JavaScript Engineering

* **Catalog ID:** `course-fullstack-js`  
* **Prefix / Directory:** `src/lib/data/lessonVisuals/fullstack-js/`  
* **Difficulty:** Intermediate | **Duration:** 4 Weeks / 30 Curriculum Days | **Quests:** 384 quests  
* **Core Architectural Theme:** Monolithic to Microservice JS, Next.js Server Components, ORMs & WebSockets  
* **Allowed Visual Templates:** `flow`, `component-tree`, `sequence`, `table`, `states`, `compare`  

#### Pedagogical Whiteboard Mental Model
> Show Next.js Server Component streaming hydration boundaries, WebSocket bidirectional frame ping-pong, and database mutation waterfalls.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus & Sample Topics | Primary Visual Architecture & Step Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Modern ESNext language features, Microtasks, Async/Await & Generator functions**<br>_Sample: "Day 1: Client-Server Separation, Node.js Runtime & Modern JS"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 2** | Days 6–10 | **Next.js 14 App Router: Server Components, Streaming Suspense & Route Handlers**<br>_Sample: "Day 2 Practice 2: Payload Byte Size Calculator"_ | Template `component-tree`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 3** | Days 11–15 | **Server Actions, Client component boundaries & Optimistic UI updates**<br>_Sample: "Day 4 Practice 1: Middleware Pipeline Runner (Chain of Responsibility)"_ | Template `sequence`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 4** | Days 16–20 | **Type-safe ORM persistence: Prisma schemas, Relational joins & DB migrations**<br>_Sample: "Test: Days 1–5"_ | Template `table`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 5** | Days 21–25 | **Real-time communication: WebSocket duplex channels & Server-Sent Events (SSE)**<br>_Sample: "Day 7 Practice 1: CORS Header Middleware Generator"_ | Template `states`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 6** | Days 26–30 | **Production deployment: Edge middleware, Vercel serverless & Dockerized images**<br>_Sample: "Day 9: JSON Web Tokens (JWT), Cryptographic Signatures & Verification"_ | Template `compare`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |

#### Capstone Milestone Project
* **Milestone Deliverable:** Real-Time Collaborative Workspace: Full-stack application with live multi-user WebSocket editing, Prisma database synchronization, and optimistic UI transitions.

---

### Course 14: [course-iot-embedded] IoT, Firmware & Embedded Systems

* **Catalog ID:** `course-iot-embedded`  
* **Prefix / Directory:** `src/lib/data/lessonVisuals/iot-embedded/`  
* **Difficulty:** Intermediate | **Duration:** 4 Weeks / 30 Curriculum Days | **Quests:** 96 quests  
* **Core Architectural Theme:** Hardware Registers, Memory-Mapped I/O, Interrupts & FreeRTOS Schedulers  
* **Allowed Visual Templates:** `flow`, `states`, `cells`, `boxes`, `sequence`, `register-bits`  

#### Pedagogical Whiteboard Mental Model
> Diagram microcontroller memory-mapped registers, bitwise mask operations, interrupt vector dispatching, and FreeRTOS task priority preemption.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus & Sample Topics | Primary Visual Architecture & Step Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **MCU architectures (ARM Cortex-M), Memory map & GPIO register addressing**<br>_Sample: "Day 1: Embedded Systems Architecture & Microcontrollers"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 2** | Days 6–10 | **Bitwise register manipulation: Bitmasking, Atomic Set/Reset (BSRR) & Pull-ups**<br>_Sample: "Day 2 Practice 2: GPIO Pin Bitmask Formatter"_ | Template `states`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 3** | Days 11–15 | **Timers, PWM signal generation & Hardware Interrupt Service Routines (ISR)**<br>_Sample: "Day 4 Practice 1: Precision ADC Voltage & LSB Quantization Engine"_ | Template `cells`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 4** | Days 16–20 | **Analog-to-Digital Conversion (ADC): Quantization step sizing & Two-point scaling**<br>_Sample: "Test: Days 1–5"_ | Template `boxes`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 5** | Days 21–25 | **Serial protocols: UART baud rates, I2C 7-bit bus addressing & SPI clock polarity**<br>_Sample: "Day 7 Practice 1: Lock-Free Ring Buffer for ISR Data Streaming"_ | Template `sequence`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 6** | Days 26–30 | **Real-Time Operating Systems: FreeRTOS preemptive scheduler, Queues & Semaphores**<br>_Sample: "Day 9: UART Serial Communication & Frame Framing"_ | Template `register-bits`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |

#### Capstone Milestone Project
* **Milestone Deliverable:** Embedded Industrial Telemetry Controller: FreeRTOS firmware implementing multi-channel ADC sensor acquisition, lock-free ring buffers, and I2C peripheral telemetry.

---

### Course 15: [course-3d-graphics] 3D Interactive Graphics & Avatar Animation

* **Catalog ID:** `course-3d-graphics`  
* **Prefix / Directory:** `src/lib/data/lessonVisuals/3d-graphics/`  
* **Difficulty:** Advanced | **Duration:** 4 Weeks / 30 Curriculum Days | **Quests:** 96 quests  
* **Core Architectural Theme:** Vector Math, WebGL Render Pipeline, Shaders, Scene Graphs & Skeletal Rigging  
* **Allowed Visual Templates:** `tree-graph`, `boxes`, `flow`, `compare`, `bars`  

#### Pedagogical Whiteboard Mental Model
> Visualize the 3D Model-View-Projection (MVP) matrix transformation pipeline, shader rasterization stages, and hierarchical skeletal bone transforms.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus & Sample Topics | Primary Visual Architecture & Step Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **3D Coordinate geometry: Cartesian vectors, Dot/Cross products & Matrix transforms**<br>_Sample: "Day 1: 3D Computer Graphics Fundamentals & Pipeline"_ | Template `tree-graph`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 2** | Days 6–10 | **WebGL rendering pipeline: Vertex Shaders, Fragment Shaders & Rasterization**<br>_Sample: "Day 2 Practice 2: RGBA Normalized Color Converter"_ | Template `boxes`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 3** | Days 11–15 | **Three.js scene graph architecture: Object3D hierarchy, Meshes & Geometry buffers**<br>_Sample: "Day 4 Practice 1: 4x4 Matrix TRS Translation & Scale Composer"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 4** | Days 16–20 | **Material physics & Lighting: Ambient, Point, Directional & Physically Based Rendering**<br>_Sample: "Test: Days 1–5"_ | Template `compare`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 5** | Days 21–25 | **Skeletal animation: Rigged bone hierarchies, Skinning weights & Keyframe tracks**<br>_Sample: "Day 7 Practice 1: GLSL Uniform Buffer Binding Layout Generator"_ | Template `bars`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 6** | Days 26–30 | **Rendering optimizations: Draw call batching, Frustum culling & LOD geometries**<br>_Sample: "Day 9: Phong & Blinn-Phong Lighting Models"_ | Template `tree-graph`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |

#### Capstone Milestone Project
* **Milestone Deliverable:** Interactive 3D Avatar Animation Studio: WebGL-accelerated 3D viewport featuring custom PBR lighting shaders, skeletal bone transforms, and interactive orbital controls.

---

### Course 16: [course-blockchain-web3] Blockchain, Web3 & Smart Contracts

* **Catalog ID:** `course-blockchain-web3`  
* **Prefix / Directory:** `src/lib/data/lessonVisuals/blockchain-web3/`  
* **Difficulty:** Intermediate | **Duration:** 4 Weeks / 30 Curriculum Days | **Quests:** 96 quests  
* **Core Architectural Theme:** Cryptographic Hashing, Merkle Trees, EVM Gas Mechanics & Smart Contracts  
* **Allowed Visual Templates:** `tree-graph`, `stack-queue`, `flow`, `sequence`, `compare`, `states`  

#### Pedagogical Whiteboard Mental Model
> Show Merkle tree cryptographic proof verification, EVM memory/stack gas consumption charts, and reentrancy attack state transition barriers.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus & Sample Topics | Primary Visual Architecture & Step Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Cryptographic hash functions (SHA-256, Keccak), Asymmetric signatures & P2P networks**<br>_Sample: "Day 1: Blockchain Fundamentals & Distributed Ledgers"_ | Template `tree-graph`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 2** | Days 6–10 | **Blockchain ledger structure: Block headers, Merkle Patricia Tries & Consensus**<br>_Sample: "Day 2 Practice 2: Merkle Tree Depth Calculator"_ | Template `stack-queue`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 3** | Days 11–15 | **Ethereum Virtual Machine (EVM): Execution stack, Storage slots & Gas accounting**<br>_Sample: "Day 4 Practice 1: Proof of Work Nonce Miner Simulator"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 4** | Days 16–20 | **Solidity contract development: Value types, Access modifiers & Event emissions**<br>_Sample: "Test: Days 1–5"_ | Template `sequence`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 5** | Days 21–25 | **Smart contract security: Checks-Effects-Interactions, Reentrancy & Integer safety**<br>_Sample: "Day 7 Practice 1: UTXO Transaction Balance & Change Calculator"_ | Template `compare`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 6** | Days 26–30 | **Decentralized frontend: Ethers.js / Viem, Metamask wallet RPC & Token transactions**<br>_Sample: "Day 9: Solidity Data Types, Structs & Enums"_ | Template `states`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |

#### Capstone Milestone Project
* **Milestone Deliverable:** Decentralized Escrow Protocol & dApp: Production Solidity smart contract with multi-signature release conditions, reentrancy guards, and reactive Web3 frontend.

---

### Course 17: [course-iot-network] IoT Wireless Networks & Protocols

* **Catalog ID:** `course-iot-network`  
* **Prefix / Directory:** `src/lib/data/lessonVisuals/iot-network/`  
* **Difficulty:** Intermediate | **Duration:** 4 Weeks / 30 Curriculum Days | **Quests:** 96 quests  
* **Core Architectural Theme:** Wireless RF Topologies, BLE GATT Profiles, LoRaWAN Chirps & MQTT Brokers  
* **Allowed Visual Templates:** `flow`, `sequence`, `states`, `table`, `compare`  

#### Pedagogical Whiteboard Mental Model
> Map BLE GATT Service/Characteristic hierarchies, LoRaWAN chirp spread spectrum uplinks, and MQTT publish/subscribe broker message routing.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus & Sample Topics | Primary Visual Architecture & Step Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Wireless RF propagation fundamentals, Frequencies (ISM bands) & Network topologies**<br>_Sample: "Day 1: Wireless Communication Spectrum & Protocols for IoT"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 2** | Days 6–10 | **Bluetooth Low Energy (BLE): GAP advertising, GATT Services & Characteristics**<br>_Sample: "Day 2 Practice 2: Wi-Fi RSSI Signal Quality Rater"_ | Template `sequence`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 3** | Days 11–15 | **IEEE 802.15.4 & Zigbee Mesh: Multi-hop routing & Self-healing network trees**<br>_Sample: "Day 4 Practice 1: BLE GATT Characteristic Read/Write Permission Enforcer"_ | Template `states`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 4** | Days 16–20 | **LoRa & LoRaWAN: Chirp Spread Spectrum (CSS), Gateway uplinks & Join procedures**<br>_Sample: "Test: Days 1–5"_ | Template `table`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 5** | Days 21–25 | **IoT Application protocols: MQTT QoS 0/1/2 handshakes, CoAP & Lightweight M2M**<br>_Sample: "Day 7 Practice 1: Zigbee / Thread Mesh Neighbor Table Router"_ | Template `compare`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 6** | Days 26–30 | **Ultra-low-power optimization: Deep sleep modes, Duty cycling & Energy budgets**<br>_Sample: "Day 9: LoRaWAN Network Architecture: End Devices, Gateways & Network Server"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |

#### Capstone Milestone Project
* **Milestone Deliverable:** Low-Power LoRaWAN Environmental Gateway: Edge mesh network firmware routing environmental sensor telemetry through encrypted LoRaWAN packets to an MQTT cloud broker.

---

### Course 18: [course-iot-edge-ai] Edge AI, DSP & TinyML Systems

* **Catalog ID:** `course-iot-edge-ai`  
* **Prefix / Directory:** `src/lib/data/lessonVisuals/iot-edge-ai/`  
* **Difficulty:** Advanced | **Duration:** 4 Weeks / 30 Curriculum Days | **Quests:** 96 quests  
* **Core Architectural Theme:** Digital Signal Processing, Feature Extraction, INT8 Quantization & TinyML  
* **Allowed Visual Templates:** `flow`, `bars`, `cells`, `table`, `compare`  

#### Pedagogical Whiteboard Mental Model
> Show sliding window sensor buffers, Fast Fourier Transform (FFT) spectrograms, and INT8 quantized weight matrices mapped to MCU memory arenas.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus & Sample Topics | Primary Visual Architecture & Step Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Edge intelligence paradigms, Microcontroller resource budgets (SRAM/Flash)**<br>_Sample: "Day 1: Edge AI Fundamentals & TinyML Paradigm"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 2** | Days 6–10 | **Digital Signal Processing (DSP): Discrete filtering, Windowing & Fast Fourier Transform**<br>_Sample: "Day 2 Practice 2: Peak Activation Memory Estimator"_ | Template `bars`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 3** | Days 11–15 | **Time-series feature extraction: Spectral power, Zero-crossing rates & Peak detection**<br>_Sample: "Day 4 Practice 1: Float32 to INT8 Affine Quantizer & Dequantizer Engine"_ | Template `cells`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 4** | Days 16–20 | **Model optimization for edge: Post-training INT8 quantization & Weight pruning**<br>_Sample: "Test: Days 1–5"_ | Template `table`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 5** | Days 21–25 | **TensorFlow Lite for Microcontrollers (TFLM): Memory arenas & Flatbuffer models**<br>_Sample: "Day 7 Practice 1: FFT Magnitude Spectrum & Peak Frequency Identifier"_ | Template `compare`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 6** | Days 26–30 | **Real-time inference pipeline: Accelerometer gesture recognition & Anomaly detection**<br>_Sample: "Day 9: Vibration Anomaly Detection: Mahalanobis Distance & Statistical DSP"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |

#### Capstone Milestone Project
* **Milestone Deliverable:** Edge TinyML Gesture Recognition Engine: Microcontroller-deployed model classifying continuous IMU sensor streams in real-time under a 32 KB SRAM memory constraint.

---

### Course 19: [course-iot-security] Industrial IoT Security & Device Lifecycle

* **Catalog ID:** `course-iot-security`  
* **Prefix / Directory:** `src/lib/data/lessonVisuals/iot-security/`  
* **Difficulty:** Advanced | **Duration:** 4 Weeks / 30 Curriculum Days | **Quests:** 96 quests  
* **Core Architectural Theme:** Hardware Root of Trust, Secure Boot, Mutual TLS & Secure OTA Lifecycles  
* **Allowed Visual Templates:** `flow`, `sequence`, `states`, `compare`, `table`  

#### Pedagogical Whiteboard Mental Model
> Diagram secure boot cryptographic signature verification chains, mTLS certificate exchanges, and dual-bank OTA firmware flash memory rollback safety.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus & Sample Topics | Primary Visual Architecture & Step Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Industrial IoT threat vectors, Purdue Enterprise Reference Model & Attack surfaces**<br>_Sample: "Day 1: Introduction to IoT Security — Hardware Root of Trust, Secure Boot and Digital Signatures"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 2** | Days 6–10 | **Hardware Root of Trust: Secure Elements (ATECC608), TPMs & Cryptographic coprocessors**<br>_Sample: "Day 2 Practice 2: IV Padding Size Indicator"_ | Template `sequence`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 3** | Days 11–15 | **Secure Boot architectures: Cryptographic hash validation & Anti-rollback eFuses**<br>_Sample: "Day 4 Practice 1: ECDSA P-256 Signature Coordinate & Hash Verifier"_ | Template `states`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 4** | Days 16–20 | **Identity & Transport security: X.509 Device certificates & Mutual TLS (mTLS)**<br>_Sample: "Test: Days 1–5"_ | Template `compare`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 5** | Days 21–25 | **Secure Over-The-Air (OTA) updates: Dual-bank flash partitions & Rollback protection**<br>_Sample: "Day 7 Practice 1: X.509 Certificate Validity Window & Subject Validator"_ | Template `table`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 6** | Days 26–30 | **Industrial communication security: Encrypted Modbus-TCP, OPC UA & IEC 62443**<br>_Sample: "Day 9: Hardware Debug Port Security: JTAG/SWD Disabling & Bitfuse Lockout"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |

#### Capstone Milestone Project
* **Milestone Deliverable:** Hardened Industrial Edge Controller: Secure boot-verified firmware implementing mutual TLS cloud authentication and failsafe dual-bank OTA update recovery.

---

### Course 20: [course-python-backend] Python Programming & Backend Systems

* **Catalog ID:** `course-python-backend`  
* **Prefix / Directory:** `src/lib/data/lessonVisuals/python-backend/`  
* **Difficulty:** Intermediate | **Duration:** 4 Weeks / 30 Curriculum Days | **Quests:** 96 quests  
* **Core Architectural Theme:** Python Asynchronous Systems, FastAPI, Pydantic & Distributed Task Queues  
* **Allowed Visual Templates:** `flow`, `sequence`, `boxes`, `table`, `states`, `compare`  

#### Pedagogical Whiteboard Mental Model
> Illustrate asyncio event loop coroutine yields, Pydantic JSON schema validations, and Celery asynchronous task distribution across Redis workers.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus & Sample Topics | Primary Visual Architecture & Step Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Advanced Python paradigms: Context managers, Decorators & Generator iterables**<br>_Sample: "Day 1: Your First Python Program"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 2** | Days 6–10 | **Asynchronous programming: asyncio event loops, Coroutine tasks & Non-blocking I/O**<br>_Sample: "Day 2 Practice 2: Is It a Big Expense?"_ | Template `sequence`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 3** | Days 11–15 | **FastAPI architecture: Path operations, Pydantic type models & Dependency Injection**<br>_Sample: "Day 4 Practice 1: Add GST"_ | Template `boxes`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 4** | Days 16–20 | **Database persistence: SQLAlchemy 2.0 Async Session, PostgreSQL & Alembic migrations**<br>_Sample: "Test: Days 1–5"_ | Template `table`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 5** | Days 21–25 | **Distributed task execution: Celery workers, Redis message brokers & Background tasks**<br>_Sample: "Day 7 Practice 1: Average"_ | Template `states`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 6** | Days 26–30 | **Production engineering: Docker containerization, Pytest unit tests & Rate limiters**<br>_Sample: "Day 9: Looping Over Lists and List Comprehensions"_ | Template `compare`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |

#### Capstone Milestone Project
* **Milestone Deliverable:** High-Performance Asynchronous FastAPI Service: Production microservice featuring async database connection pooling, background Celery processing, and OpenAPI contracts.

---

### Course 21: [course-quant-systems] Quantitative Engineering & Low-Latency Trading Systems

* **Catalog ID:** `course-quant-systems`  
* **Prefix / Directory:** `src/lib/data/lessonVisuals/quant-systems/`  
* **Difficulty:** Advanced | **Duration:** 4 Weeks / 30 Curriculum Days | **Quests:** 96 quests  
* **Core Architectural Theme:** Limit Order Books, VWAP Slicing, Low-Latency Sockets & Microsecond Systems  
* **Allowed Visual Templates:** `stack-queue`, `table`, `bars`, `flow`, `cells`, `compare`  

#### Pedagogical Whiteboard Mental Model
> Show Limit Order Book (LOB) bid/ask price queues, execution algorithms slicing volume over time, and kernel-bypass zero-copy socket buffer flows.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus & Sample Topics | Primary Visual Architecture & Step Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Market microstructure: Limit Order Books (LOB), Depth of market & Bid-Ask spreads**<br>_Sample: "Day 1: Quantitative Engineering & Electronic Trading Foundations"_ | Template `stack-queue`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 2** | Days 6–10 | **Financial timeseries analytics: Returns, Rolling volatility & Log price transforms**<br>_Sample: "Day 2 Practice 2: LOB Cumulative Depth Level Aggregator"_ | Template `table`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 3** | Days 11–15 | **Algorithmic execution strategies: VWAP, TWAP, Implementation shortfall & Slippage**<br>_Sample: "Day 4 Practice 1: VWAP Intraday Slicing Engine"_ | Template `bars`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 4** | Days 16–20 | **Low-latency system engineering: Zero-copy buffers, Cache locality & Kernel bypass**<br>_Sample: "Test: Days 1–5"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 5** | Days 21–25 | **Risk modeling & Portfolio metrics: Value at Risk (VaR), Sharpe Ratio & Max Drawdown**<br>_Sample: "Day 7 Practice 1: Micro-Price & Order Book Imbalance Signal Engine"_ | Template `cells`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 6** | Days 26–30 | **High-frequency backtesting engine: Event-driven matching simulation & FIX protocol**<br>_Sample: "Day 9: Financial Information eXchange (FIX 4.4) Protocol & FAST Compression"_ | Template `compare`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |

#### Capstone Milestone Project
* **Milestone Deliverable:** Microsecond Limit Order Book Matching Engine: High-frequency order matching engine simulating sub-millisecond price-time priority execution and real-time PnL tracking.

---

### Course 22: [course-digital-accounting] Digital Accounting & Taxation (B.Com / BBA)

* **Catalog ID:** `course-digital-accounting`  
* **Prefix / Directory:** `src/lib/data/lessonVisuals/digital-accounting/`  
* **Difficulty:** Beginner | **Duration:** 4 Weeks / 30 Curriculum Days | **Quests:** 96 quests  
* **Core Architectural Theme:** Double-Entry Invariants, Ledger Balancing, GST Taxation & ERP Compliance  
* **Allowed Visual Templates:** `table`, `flow`, `compare`, `bars`, `ledger-sheet`  

#### Pedagogical Whiteboard Mental Model
> Draw double-entry debit/credit ledger columns maintaining balancing equality, 3-way invoice matching flows, and GST tax credit cascading waterfalls.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus & Sample Topics | Primary Visual Architecture & Step Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Accounting equation fundamentals: Assets = Liabilities + Equity & Business Entity rule**<br>_Sample: "Day 1: Double-Entry Accounting Equation & Business Entity Framework"_ | Template `table`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 2** | Days 6–10 | **Golden rules of accounting: Real, Personal & Nominal accounts & Journal posting**<br>_Sample: "Day 2 Practice 2: Transaction Double-Entry Legs Rule Mapper"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 3** | Days 11–15 | **Ledger posting: T-Accounts balancing, Closing balances & Trial Balance checksums**<br>_Sample: "Day 4 Practice 1: T-Account Ledger Closing Balance Calculator"_ | Template `compare`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 4** | Days 16–20 | **Financial reporting: Trading Account, Profit & Loss statement & Balance Sheet layout**<br>_Sample: "Test: Days 1–5"_ | Template `bars`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 5** | Days 21–25 | **Taxation architecture: GST Input Tax Credit cascading & TDS statutory deductions**<br>_Sample: "Day 7 Practice 1: Subsidiary Day Books Net Turnover Aggregator"_ | Template `ledger-sheet`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 6** | Days 26–30 | **Modern ERP workflows: Automated bank reconciliations & Suspense account resolution**<br>_Sample: "Day 9: Trial Balance: Arithmetic Accuracy Checksum & Detection of Errors"_ | Template `table`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |

#### Capstone Milestone Project
* **Milestone Deliverable:** Automated Corporate Accounting & GST Audit Engine: End-to-end digital accounting ledger with automated journal entries, balancing trial balances, and GST compliance validation.

---

### Course 23: [course-finance-investment] Business Finance & Investment Management (B.Com / BBA)

* **Catalog ID:** `course-finance-investment`  
* **Prefix / Directory:** `src/lib/data/lessonVisuals/finance-investment/`  
* **Difficulty:** Beginner | **Duration:** 4 Weeks / 30 Curriculum Days | **Quests:** 96 quests  
* **Core Architectural Theme:** Time Value of Money, DCF Valuation, WACC Capital Structures & Portfolio Risk  
* **Allowed Visual Templates:** `table`, `bars`, `flow`, `compare`  

#### Pedagogical Whiteboard Mental Model
> Visualize Discounted Cash Flow (DCF) timelines, DuPont 3-stage ROE breakdowns, and debt vs equity cost weights in WACC capital structure models.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus & Sample Topics | Primary Visual Architecture & Step Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Time Value of Money (TVM): Present Value, Future Value & Compounding schedules**<br>_Sample: "Day 1: Introduction to Corporate Finance & The Financial Ecosystem"_ | Template `table`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 2** | Days 6–10 | **Capital budgeting evaluation: Net Present Value (NPV), IRR & Payback period hurdles**<br>_Sample: "Day 2 Practice 2: Rule of 72 & Doubling Period Estimator"_ | Template `bars`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 3** | Days 11–15 | **Cost of Capital: Weighted Average Cost of Capital (WACC) & Optimal Debt-Equity mix**<br>_Sample: "Day 4 Practice 1: Equated Monthly Installment (EMI) & Loan Amortization Engine"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 4** | Days 16–20 | **Working capital dynamics: Cash Conversion Cycle, Operating cycle & Liquidity ratios**<br>_Sample: "Test: Days 1–5"_ | Template `compare`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 5** | Days 21–25 | **Corporate Valuation: DCF terminal values, Multiples analysis & DuPont 3-stage ROE**<br>_Sample: "Day 7 Practice 1: Bond Yield to Maturity (YTM) Numerical Solver"_ | Template `table`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 6** | Days 26–30 | **Modern Portfolio Theory: Efficient frontier, Sharpe ratio & Beta risk sensitivity**<br>_Sample: "Day 9: Capital Budgeting: Net Present Value (NPV) Decision Rule"_ | Template `bars`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |

#### Capstone Milestone Project
* **Milestone Deliverable:** Corporate Financial Valuation & Investment Model: Comprehensive DCF valuation model with dynamic WACC sensitivity matrices, scenario planning, and working capital forecasts.

---

### Course 24: [course-business-analytics] Business Analytics & Decision Intelligence (B.Com / BBA / MBA)

* **Catalog ID:** `course-business-analytics`  
* **Prefix / Directory:** `src/lib/data/lessonVisuals/business-analytics/`  
* **Difficulty:** Beginner | **Duration:** 4 Weeks / 30 Curriculum Days | **Quests:** 96 quests  
* **Core Architectural Theme:** Statistical Distributions, Pareto ABC Analysis, Regression & Executive KPIs  
* **Allowed Visual Templates:** `bars`, `table`, `flow`, `compare`  

#### Pedagogical Whiteboard Mental Model
> Show descriptive distribution curves, Pareto 80/20 ABC classification breakdowns, and linear regression trendlines against executive scorecard KPIs.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus & Sample Topics | Primary Visual Architecture & Step Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Data-driven decision framework: Descriptive statistics, Mean, Median & Standard deviation**<br>_Sample: "Day 1: Introduction to Business Analytics & Data-Driven Decision Making"_ | Template `bars`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 2** | Days 6–10 | **Data distributions: Normal curves, Skewness, Outlier detection & Interquartile range**<br>_Sample: "Day 2 Practice 2: Coefficient of Variation Calculator"_ | Template `table`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 3** | Days 11–15 | **Business KPI architecture: Balanced scorecards, Attribution & Performance variance**<br>_Sample: "Day 4 Practice 1: Pearson Correlation Coefficient Engine"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 4** | Days 16–20 | **Predictive analytics: Simple & Multiple OLS Linear regression & Trend forecasting**<br>_Sample: "Test: Days 1–5"_ | Template `compare`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 5** | Days 21–25 | **Classification & Segmentation: Customer RFM analysis & Logistic regression odds**<br>_Sample: "Day 7 Practice 1: Hypothesis Testing Decision Rule Engine"_ | Template `bars`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 6** | Days 26–30 | **Executive data storytelling: Automated KPI dashboards & Decision intelligence reports**<br>_Sample: "Day 9: Simple Linear Regression: OLS Line, Slope ($\beta_1$) & $R^2$"_ | Template `table`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |

#### Capstone Milestone Project
* **Milestone Deliverable:** Executive Business Intelligence & Decision Dashboard: End-to-end analytics report synthesizing customer segmentation, revenue regression forecasts, and automated KPI alert metrics.

---

### Course 25: [course-marketing-branding] Marketing & Brand Management (B.Com / BBA / MBA)

* **Catalog ID:** `course-marketing-branding`  
* **Prefix / Directory:** `src/lib/data/lessonVisuals/marketing-branding/`  
* **Difficulty:** Beginner | **Duration:** 4 Weeks / 30 Curriculum Days | **Quests:** 96 quests  
* **Core Architectural Theme:** Strategic Frameworks, Consumer Psychology, Brand Equity & PLC Lifecycles  
* **Allowed Visual Templates:** `flow`, `compare`, `table`, `bars`  

#### Pedagogical Whiteboard Mental Model
> Map customer journey stages, Keller brand equity pyramid levels, BCG growth-share matrix quadrants, and omnichannel campaign ROI bar charts.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus & Sample Topics | Primary Visual Architecture & Step Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Strategic marketing foundations: 4Ps Marketing Mix, STP & Porter’s Five Forces**<br>_Sample: "Day 1: The Marketing Philosophy & Customer Value Equation"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 2** | Days 6–10 | **Consumer psychology: Cognitive decision journey, Perception biases & Social proof**<br>_Sample: "Day 2 Practice 2: PESTLE Macro-Environmental Risk Score Aggregator"_ | Template `compare`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 3** | Days 11–15 | **Brand identity architecture: Brand personality, Archetypes & Keller’s Brand Equity**<br>_Sample: "Day 4 Practice 1: Net Promoter Score (NPS) Calculation & Loyalty Tier Engine"_ | Template `table`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 4** | Days 16–20 | **Product portfolio management: Boston Consulting Group (BCG) Matrix & Product Life Cycle**<br>_Sample: "Test: Days 1–5"_ | Template `bars`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 5** | Days 21–25 | **Integrated Marketing Communications (IMC): Omnichannel messaging & Content strategies**<br>_Sample: "Day 7 Practice 1: Market Targeting Strategy & Coverage Matrix Selector"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 6** | Days 26–30 | **Marketing performance measurement: Customer Lifetime Value (CLV) & Brand sentiment**<br>_Sample: "Day 9: Product Strategy: The 3 Product Levels & Product Mix Hierarchy"_ | Template `compare`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |

#### Capstone Milestone Project
* **Milestone Deliverable:** Comprehensive Brand Strategy & Go-To-Market Blueprint: Multi-channel brand positioning framework complete with customer persona journeys, messaging matrices, and ROI forecasts.

---

### Course 26: [course-digital-marketing] Digital Marketing & Growth Strategy (B.Com / BBA / MBA)

* **Catalog ID:** `course-digital-marketing`  
* **Prefix / Directory:** `src/lib/data/lessonVisuals/digital-marketing/`  
* **Difficulty:** Beginner | **Duration:** 4 Weeks / 30 Curriculum Days | **Quests:** 96 quests  
* **Core Architectural Theme:** Acquisition Funnels, Ad Auction Rankings, SEO Architectures & CAC/LTV Unit Economics  
* **Allowed Visual Templates:** `flow`, `bars`, `table`, `compare`, `funnel`  

#### Pedagogical Whiteboard Mental Model
> Diagram conversion funnel drop-off waterfalls, ad auction rank bid vs quality score calculations, and CAC payback period bar comparisons.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus & Sample Topics | Primary Visual Architecture & Step Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Digital acquisition landscape: Inbound vs Outbound & Customer acquisition funnels**<br>_Sample: "Day 1: Digital Marketing Ecosystem & Multi-Touch Attribution"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 2** | Days 6–10 | **Search Engine Optimization (SEO): Crawl budgets, Technical SEO, On-page & Backlinks**<br>_Sample: "Day 2 Practice 2: Search Intent Formatter"_ | Template `bars`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 3** | Days 11–15 | **Search Engine Marketing (SEM): Google Ads auction mechanics, Quality Score & CPC bidding**<br>_Sample: "Day 4 Practice 1: Anchor Text Natural Profile Distribution Auditor"_ | Template `table`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 4** | Days 16–20 | **Paid Social Advertising: Meta Ad pixel tracking, Lookalike audiences & ROAS targets**<br>_Sample: "Test: Days 1–5"_ | Template `compare`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 5** | Days 21–25 | **Email marketing automation: Behavioral drip sequences, Open rate & Churn telemetry**<br>_Sample: "Day 7 Practice 1: Google Ads Ad Rank & Actual CPC Auction Calculator"_ | Template `funnel`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 6** | Days 26–30 | **Growth analytics: Multi-touch attribution models, A/B testing & CAC-to-LTV payback**<br>_Sample: "Day 9: Meta Ads (Facebook/Instagram): Pixel Tracking & Lookalike Audiences"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |

#### Capstone Milestone Project
* **Milestone Deliverable:** Growth Marketing & Performance Campaign Architecture: Complete multi-channel digital acquisition campaign with SEO keyword architecture, ad auction bidding models, and CAC/LTV funnels.

---

### Course 27: [course-ecommerce-digital-biz] E-Commerce & Digital Business (B.Com / BBA / MBA)

* **Catalog ID:** `course-ecommerce-digital-biz`  
* **Prefix / Directory:** `src/lib/data/lessonVisuals/ecommerce-digital-biz/`  
* **Difficulty:** Beginner | **Duration:** 4 Weeks / 30 Curriculum Days | **Quests:** 96 quests  
* **Core Architectural Theme:** SKU Variant Matrices, Volumetric Logistics, Checkout Gateways & Marketplace Scaling  
* **Allowed Visual Templates:** `flow`, `table`, `sequence`, `bars`, `compare`, `funnel`  

#### Pedagogical Whiteboard Mental Model
> Illustrate e-commerce checkout conversion funnels, payment gateway authorization handshakes, and dimensional weight shipping cost calculations.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus & Sample Topics | Primary Visual Architecture & Step Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **E-Commerce business models: Direct-to-Consumer (D2C), B2B & Multi-vendor marketplaces**<br>_Sample: "Day 1: E-Commerce Business Models: D2C Gross Margin Advantage"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 2** | Days 6–10 | **Product catalog engineering: Parent-child SKU variants, Attributes & Inventory sync**<br>_Sample: "Day 2 Practice 2: EAN-13 Barcode Digit Count Formatter"_ | Template `table`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 3** | Days 11–15 | **Checkout optimization: Cart abandonment mitigation, Payment gateways & Webhooks**<br>_Sample: "Day 4 Practice 1: PDP Conversion Readiness Auditor"_ | Template `sequence`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 4** | Days 16–20 | **Supply chain fulfillment: 3PL logistics, Dimensional weight & Last-mile delivery**<br>_Sample: "Test: Days 1–5"_ | Template `bars`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 5** | Days 21–25 | **Marketplace scaling: Amazon Buy Box algorithms, Seller metrics & Commission fees**<br>_Sample: "Day 7 Practice 1: OMS Order Lifecycle State Transition Validator"_ | Template `compare`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 6** | Days 26–30 | **Cross-border digital commerce: Currency localization, Duties, Taxes & Compliance**<br>_Sample: "Day 9: Warehousing, Pick & Pack: Volumetric Weight (L x W x H / 5000)"_ | Template `funnel`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |

#### Capstone Milestone Project
* **Milestone Deliverable:** Scalable E-Commerce Operations Blueprint: Full operational framework for high-volume digital commerce, including SKU catalog architecture, checkout conversion funnels, and logistics routing.

---

### Course 28: [course-entrepreneurship-biz-mgmt] Entrepreneurship & Business Management (B.Com / BBA / MBA)

* **Catalog ID:** `course-entrepreneurship-biz-mgmt`  
* **Prefix / Directory:** `src/lib/data/lessonVisuals/entrepreneurship-biz-mgmt/`  
* **Difficulty:** Beginner | **Duration:** 4 Weeks / 30 Curriculum Days | **Quests:** 96 quests  
* **Core Architectural Theme:** Business Model Canvas, TAM/SAM/SOM Sizing, Cap Table Dilution & Runway Dynamics  
* **Allowed Visual Templates:** `flow`, `table`, `compare`, `bars`  

#### Pedagogical Whiteboard Mental Model
> Show Business Model Canvas component linkages, bottom-up TAM/SAM/SOM concentric circles, equity dilution round-by-round cap tables, and monthly burn rate runway curves.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus & Sample Topics | Primary Visual Architecture & Step Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Entrepreneurial mindset, Problem-Solution fit & Lean Startup iterative hypothesis**<br>_Sample: "Day 1: Legal Business Entities: Private Limited (Pvt Ltd) & Limited Liability"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 2** | Days 6–10 | **Business Model Canvas (BMC): Revenue streams, Cost structures & Value propositions**<br>_Sample: "Day 2 Practice 2: SOM Acronym Full Form Formatter"_ | Template `table`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 3** | Days 11–15 | **Market opportunity sizing: Total Addressable Market (TAM, SAM, SOM) calculation**<br>_Sample: "Day 4 Practice 1: Problem-Solution Value Proposition Fit Scorer"_ | Template `compare`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 4** | Days 16–20 | **Startup financial modeling: Unit economics, Burn rate & Cash runway forecasting**<br>_Sample: "Test: Days 1–5"_ | Template `bars`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 5** | Days 21–25 | **Venture financing mechanics: Term sheets, Convertible notes, SAFEs & Cap table dilution**<br>_Sample: "Day 7 Practice 1: Competitive Moat Strength Scorer"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 6** | Days 26–30 | **Operational scaling: Hiring frameworks, Agile organizational design & Milestone gates**<br>_Sample: "Day 9: Working Capital Management & Cash Runway Dynamics (Runway = Cash / Burn)"_ | Template `table`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |

#### Capstone Milestone Project
* **Milestone Deliverable:** Venture Creation & Investor-Ready Business Plan: Comprehensive startup plan featuring validated Business Model Canvas, bottom-up market sizing, unit economics, and 5-year pro forma financials.

---

### Course 29: [course-sales-crm-success] Sales, Customer Success & CRM (B.Com / BBA / MBA)

* **Catalog ID:** `course-sales-crm-success`  
* **Prefix / Directory:** `src/lib/data/lessonVisuals/sales-crm-success/`  
* **Difficulty:** Beginner | **Duration:** 4 Weeks / 30 Curriculum Days | **Quests:** 96 quests  
* **Core Architectural Theme:** BANT/MEDDIC Qualification, Sales Velocity, CRM Workflows & Customer Retention  
* **Allowed Visual Templates:** `flow`, `table`, `states`, `bars`, `compare`, `funnel`  

#### Pedagogical Whiteboard Mental Model
> Diagram sales velocity formula components, MEDDIC qualification scorecards, lead-to-opportunity state progression, and customer health score distributions.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus & Sample Topics | Primary Visual Architecture & Step Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Modern B2B sales methodologies: Consultative selling, Challenger sales & Inbound leads**<br>_Sample: "Day 1: Sales Foundations & Buying Psychology: Value Selling & Decision-Making Units (DMU)"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 2** | Days 6–10 | **Opportunity qualification frameworks: BANT (Budget, Authority, Need, Timing) & MEDDIC**<br>_Sample: "Day 2 Practice 2: Outbound Benchmark Threshold Formatter"_ | Template `table`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 3** | Days 11–15 | **Sales pipeline mechanics: Deal stages, Probability weightings & Sales Velocity formula**<br>_Sample: "Day 4 Practice 1: Financial Cost of Inaction (COI) Business Impact Calculator"_ | Template `states`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 4** | Days 16–20 | **CRM systems architecture: Lead routing workflows, Activity tracking & Pipeline automation**<br>_Sample: "Test: Days 1–5"_ | Template `bars`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 5** | Days 21–25 | **Commercial negotiation: Objection handling frameworks, Value selling & Closing tactics**<br>_Sample: "Day 7 Practice 1: LAER Objection Resolution & ROI Payback Reframer"_ | Template `compare`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 6** | Days 26–30 | **Customer Success & Retention: Net Retention Rate (NRR), Churn telemetry & Health scores**<br>_Sample: "Day 9: Sales Pipeline Velocity & Funnel Analytics (V = (N x W x S) / L)"_ | Template `funnel`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |

#### Capstone Milestone Project
* **Milestone Deliverable:** Enterprise B2B Sales & CRM Operational Playbook: Configured CRM pipeline architecture with automated MEDDIC qualification scoring, sales velocity tracking, and retention playbooks.

---

### Course 30: [course-operations-supplychain-compliance] Operations, Supply Chain & Business Compliance (B.Com / BBA / MBA)

* **Catalog ID:** `course-operations-supplychain-compliance`  
* **Prefix / Directory:** `src/lib/data/lessonVisuals/operations-supplychain-compliance/`  
* **Difficulty:** Beginner | **Duration:** 4 Weeks / 30 Curriculum Days | **Quests:** 96 quests  
* **Core Architectural Theme:** SIPOC Value Stream Mapping, EOQ Inventory Models, Kraljic Matrices & Quality Control  
* **Allowed Visual Templates:** `flow`, `table`, `bars`, `compare`  

#### Pedagogical Whiteboard Mental Model
> Draw SIPOC value stream process flows, Economic Order Quantity (EOQ) cost trade-off curves, Kraljic matrix supplier quadrants, and Six Sigma defect distributions.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus & Sample Topics | Primary Visual Architecture & Step Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Operations strategy: Process architecture, Capacity planning & Bottleneck identification**<br>_Sample: "Day 1: Operations Foundations & Process Mapping: SIPOC & Value Stream Mapping (VSM)"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 2** | Days 6–10 | **Value Stream Mapping: SIPOC diagrams, Lead time reduction & Waste elimination (Muda)**<br>_Sample: "Day 2 Practice 2: Primary Cost Balance in EOQ Formatter"_ | Template `table`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 3** | Days 11–15 | **Inventory optimization: Economic Order Quantity (EOQ), Safety stock & Reorder points**<br>_Sample: "Day 4 Practice 1: Exponential Smoothing Forecast & MAPE Accuracy Engine"_ | Template `bars`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 4** | Days 16–20 | **Strategic procurement: Kraljic purchasing portfolio matrix & Vendor SLA evaluations**<br>_Sample: "Test: Days 1–5"_ | Template `compare`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 5** | Days 21–25 | **Total Quality Management (TQM): Six Sigma DMAIC cycle, Statistical process control & Kaizen**<br>_Sample: "Day 7 Practice 1: TIM WOODS Lean Waste Classifier & Poka-Yoke Validator"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 6** | Days 26–30 | **Business compliance: Supply chain ethics, ISO certifications & Regulatory audit governance**<br>_Sample: "Day 9: Strategic Procurement: Kraljic Matrix & On-Time In-Full (OTIF >= 95.0%)"_ | Template `table`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |

#### Capstone Milestone Project
* **Milestone Deliverable:** End-to-End Supply Chain Optimization Plan: Operations master plan featuring value stream mapping, automated EOQ inventory replenishment models, and supplier quality audits.

---

### Course 31: [course-ai-digital-transformation] AI & Digital Transformation for Business (B.Com / BBA / MBA)

* **Catalog ID:** `course-ai-digital-transformation`  
* **Prefix / Directory:** `src/lib/data/lessonVisuals/ai-digital-transformation/`  
* **Difficulty:** Beginner | **Duration:** 4 Weeks / 30 Curriculum Days | **Quests:** 96 quests  
* **Core Architectural Theme:** Enterprise AI Value Equations, Robotic Process Automation & AI Governance  
* **Allowed Visual Templates:** `workflow`, `flow`, `table`, `compare`, `bars`  

#### Pedagogical Whiteboard Mental Model
> Illustrate enterprise AI value creation frameworks, RPA bot automation process flows, AI governance risk-level classifications, and digital maturity phase roadmaps.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus & Sample Topics | Primary Visual Architecture & Step Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Digital Transformation imperatives: Legacy modernization vs Digital-first paradigms**<br>_Sample: "Day 1: AI Literacy & Business Transformation: The AI Business Value Equation"_ | Template `workflow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 2** | Days 6–10 | **Enterprise AI Value Equation: Cost reduction, Revenue acceleration & Customer experience**<br>_Sample: "Day 2 Practice 2: CREATE Framework Acronym Formatter"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 3** | Days 11–15 | **Robotic Process Automation (RPA): Workflow orchestration & Repetitive task bot automation**<br>_Sample: "Day 4 Practice 1: Expense Audit Statistical Z-Score Fraud Detector"_ | Template `table`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 4** | Days 16–20 | **Generative AI workplace deployment: Departmental copilot adoption & Prompt standards**<br>_Sample: "Test: Days 1–5"_ | Template `compare`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 5** | Days 21–25 | **AI Governance & Ethics: Bias auditing, Privacy protection, IP safety & EU AI Act compliance**<br>_Sample: "Day 7 Practice 1: Predictive Customer Lifetime Value (CLV) Engine"_ | Template `bars`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 6** | Days 26–30 | **Organizational Change Management: Cultural readiness, Upskilling roadmaps & ROI dashboards**<br>_Sample: "Day 9: Business Intelligence (BI) & Predictive Churn Analytics (Accuracy >= 85.0%)"_ | Template `workflow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |

#### Capstone Milestone Project
* **Milestone Deliverable:** Enterprise AI Transformation Roadmap & Governance Charter: Multi-year digital transformation strategic roadmap with departmental RPA automation blueprints and ethical AI policies.

---

### Course 32: [course-computer-fundamentals] Computer Literacy, Digital Productivity & OS Fundamentals

* **Catalog ID:** `course-computer-fundamentals`  
* **Prefix / Directory:** `src/lib/data/lessonVisuals/computer-fundamentals/`  
* **Difficulty:** Beginner | **Duration:** 4 Weeks / 30 Curriculum Days | **Quests:** 96 quests  
* **Core Architectural Theme:** Von Neumann Architecture, POSIX File Permissions, CLI Pipelines & TCP/IP Networking  
* **Allowed Visual Templates:** `flow`, `boxes`, `tree-graph`, `table`, `compare`  

#### Pedagogical Whiteboard Mental Model
> Diagram Input-Process-Output CPU bus flows, Unix command pipe data streams, file system inode permission trees, and TCP/IP 4-layer packet traversals.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus & Sample Topics | Primary Visual Architecture & Step Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Computer architecture: CPU registers, Arithmetic Logic Unit (ALU), RAM & Bus topology**<br>_Sample: "Day 1: What is a Computer? — The Input → Process → Output Machine"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 2** | Days 6–10 | **Operating Systems fundamentals: Kernel mode vs User mode, System calls & Process threads**<br>_Sample: "Day 2 Practice 2: Kernel Mode Privilege Evaluator"_ | Template `boxes`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 3** | Days 11–15 | **POSIX Command Line: Terminal navigation, File permissions (chmod/chown) & Pipe redirection**<br>_Sample: "Day 4 Practice 1: Unix Pipeline Line & Token Counter Simulator"_ | Template `tree-graph`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 4** | Days 16–20 | **Memory and storage hierarchy: L1/L2/L3 CPU Caches, Virtual memory paging & RAID arrays**<br>_Sample: "Test: Days 1–5"_ | Template `table`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 5** | Days 21–25 | **Computer networking basics: TCP/IP 4-layer model, IPv4 subnetting, DNS & Port routing**<br>_Sample: "Day 7 Practice 1: Memory Access Latency & Cache Hit Ratio Evaluator"_ | Template `compare`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 6** | Days 26–30 | **Digital security & System health: Process monitoring, SSH keys & Preventive maintenance**<br>_Sample: "Day 9: Computer Networking Basics: TCP/IP 4-Layer Model, IPv4 Subnetting & DNS Flow"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |

#### Capstone Milestone Project
* **Milestone Deliverable:** Systems Administration & Networking Verification Suite: Practical command-line and systems automation project demonstrating process monitoring, shell scripting, and network diagnostics.

---

### Course 33: [course-ai-prompt-literacy] Everyday AI Literacy & Prompt Engineering

* **Catalog ID:** `course-ai-prompt-literacy`  
* **Prefix / Directory:** `src/lib/data/lessonVisuals/ai-prompt-literacy/`  
* **Difficulty:** Beginner | **Duration:** 4 Weeks / 30 Curriculum Days | **Quests:** 96 quests  
* **Core Architectural Theme:** Prompt Engineering Frameworks, Chain-of-Thought Reasoning & Fact Verification  
* **Allowed Visual Templates:** `flow`, `compare`, `boxes`, `table`, `bars`  

#### Pedagogical Whiteboard Mental Model
> Show prompt before/after optimization comparisons, Chain-of-Thought reasoning step paths, temperature sampling spaces, and fact-checking verification scorecards.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus & Sample Topics | Primary Visual Architecture & Step Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Generative AI mechanics: Probabilistic language modeling, Tokens & Prediction spaces**<br>_Sample: "Day 1: What is AI? — And How Do You Talk to It?"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 2** | Days 6–10 | **Prompt structuring foundations: Context, Persona, Instruction & Constraint frameworks**<br>_Sample: "Day 2 Practice 2: C-R-E-A-T-E Acronym Pillars Formatter"_ | Template `compare`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 3** | Days 11–15 | **Advanced prompting techniques: Few-shot examples, Chain-of-Thought (CoT) & Decomposition**<br>_Sample: "Day 4 Practice 1: Self-Consistency Majority Vote Consensus Evaluator"_ | Template `boxes`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 4** | Days 16–20 | **Multimodal AI capabilities: Text-to-image prompting, Audio transcription & Visual analysis**<br>_Sample: "Test: Days 1–5"_ | Template `table`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 5** | Days 21–25 | **Workplace productivity automation: Research synthesis, Executive drafting & Data extraction**<br>_Sample: "Day 7 Practice 1: Structured JSON Output Schema Validator"_ | Template `bars`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 6** | Days 26–30 | **Cognitive guardrails: Hallucination identification, Source grounding & Ethical evaluation**<br>_Sample: "Day 9: Retrieval-Augmented Generation (RAG) for Everyday Users: Grounding & Citations"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |

#### Capstone Milestone Project
* **Milestone Deliverable:** Master Prompt Engineering Playbook: Production-grade collection of verified, structured prompt templates for workplace research, communication, data analysis, and validation.

---

### Course 34: [course-excel-data-viz] Excel & Data Analysis Fundamentals

* **Catalog ID:** `course-excel-data-viz`  
* **Prefix / Directory:** `src/lib/data/lessonVisuals/excel-data-viz/`  
* **Difficulty:** Beginner | **Duration:** 4 Weeks / 30 Curriculum Days | **Quests:** 96 quests  
* **Core Architectural Theme:** 2D Coordinate Grids, Logical Evaluation, XLOOKUP Intersections & Executive Pivot Dashboards  
* **Allowed Visual Templates:** `table`, `cells`, `bars`, `compare`, `flow`  

#### Pedagogical Whiteboard Mental Model
> Illustrate 2D grid cell referencing, XLOOKUP array search traversals, Pivot Table multidimensional aggregations, and executive waterfall chart components.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus & Sample Topics | Primary Visual Architecture & Step Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Spreadsheet grid architecture: 2D coordinate referencing, Absolute ($) vs Relative locks**<br>_Sample: "Day 1: Spreadsheet Grid Architecture: Cells, 2D Coordinates & Data Types"_ | Template `table`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 2** | Days 6–10 | **Statistical functions: SUM, AVERAGE, COUNT, MIN/MAX & Weighted average calculations**<br>_Sample: "Day 2 Practice 2: Weighted Average Metric Calculation Engine"_ | Template `cells`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 3** | Days 11–15 | **Logical evaluations: Single IF, Nested IF statements & Multi-condition AND/OR formulas**<br>_Sample: "Day 4 Practice 1: Student Grade & Attendance Logical Evaluation Engine"_ | Template `bars`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 4** | Days 16–20 | **Text sanitization & Date calculations: TRIM, CLEAN, TEXTJOIN, CONCAT & DATEDIF math**<br>_Sample: "Test: Days 1–5"_ | Template `compare`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 5** | Days 21–25 | **Lookup & Reference functions: Classic VLOOKUP vs Modern XLOOKUP & 2-Way INDEX-MATCH**<br>_Sample: "Day 7 Practice 1: Customer Name Sanitizer & Proper Case Formatter"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 6** | Days 26–30 | **Data visualization & Reporting: Pivot Tables, Multi-dimensional slicing & Executive charts**<br>_Sample: "Day 9: Classic Lookup Functions: `VLOOKUP` (Exact Match `FALSE` / `0`), `HLOOKUP` & `#N/A`"_ | Template `table`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |

#### Capstone Milestone Project
* **Milestone Deliverable:** Executive Financial & Operational Excel Model: Fully automated corporate spreadsheet workbook featuring dynamic XLOOKUP models, Pivot Table aggregations, and executive visual dashboards.

---

### Course 35: [course-git-version-control] Git, GitHub & Version Control Basics

* **Catalog ID:** `course-git-version-control`  
* **Prefix / Directory:** `src/lib/data/lessonVisuals/git-version-control/`  
* **Difficulty:** Beginner | **Duration:** 4 Weeks / 30 Curriculum Days | **Quests:** 96 quests  
* **Core Architectural Theme:** Directed Acyclic Graphs, 3-Tier Git Areas, 3-Way Merges & Collaborative PRs  
* **Allowed Visual Templates:** `tree-graph`, `flow`, `states`, `compare`, `boxes`  

#### Pedagogical Whiteboard Mental Model
> Draw 3-tier Git architecture (Working directory -> Staging -> Repository), Directed Acyclic Graph (DAG) commit trees, and 3-way merge conflict marker resolutions.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus & Sample Topics | Primary Visual Architecture & Step Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Version control architecture: Working Directory, Staging Area (Index) & Local Repository**<br>_Sample: "Day 1: What is Version Control? — Your Project's Infinite Undo Button"_ | Template `tree-graph`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 2** | Days 6–10 | **Core versioning operations: Commit SHA hashes, Atomic commits, Git log & History inspection**<br>_Sample: "Day 2 Practice 2: Modern Git Default Branch Name Formatter"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 3** | Days 11–15 | **Branching dynamics: Pointer movements, Fast-forward merges & Feature branch isolation**<br>_Sample: "Day 4 Practice 1: Conventional Commit Message Parser & Semantic Type Validator"_ | Template `states`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 4** | Days 16–20 | **Branch reconciliation: 3-way merge algorithms, Merge conflict resolution & Interactive rebase**<br>_Sample: "Test: Days 1–5"_ | Template `compare`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 5** | Days 21–25 | **Remote collaboration: Git remotes, Push/Pull mechanics, Upstream tracking & Fetching**<br>_Sample: "Day 7 Practice 1: Git Local Undo Command Dispatcher"_ | Template `boxes`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 6** | Days 26–30 | **GitHub team workflows: Pull requests, Code review etiquettes, Branch protection & Tags**<br>_Sample: "Day 9: Git Branching Architecture: Pointer Mechanics & Fast-Forward Merges"_ | Template `tree-graph`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |

#### Capstone Milestone Project
* **Milestone Deliverable:** Multi-Branch Collaborative Repository Simulation: Realistic engineering project demonstrating trunk-based branching, clean rebase histories, resolved merge conflicts, and peer-reviewed PRs.

---

### Course 36: [course-softskills-communication] Professional Tech Communication & Interview Mastery

* **Catalog ID:** `course-softskills-communication`  
* **Prefix / Directory:** `src/lib/data/lessonVisuals/softskills-communication/`  
* **Difficulty:** Beginner | **Duration:** 4 Weeks / 30 Curriculum Days | **Quests:** 96 quests  
* **Core Architectural Theme:** Minto Pyramid Structured Messaging, Active Listening, STAR Method & Tech Interviews  
* **Allowed Visual Templates:** `flow`, `compare`, `table`, `states`  

#### Pedagogical Whiteboard Mental Model
> Diagram Minto Pyramid top-down communication hierarchies, STAR method (Situation, Task, Action, Result) storytelling flows, and email tone before/after comparison tables.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus & Sample Topics | Primary Visual Architecture & Step Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Foundations of technical communication: Clarity, Conciseness & The BLUF principle**<br>_Sample: "Day 1: Professional Written Communication & Email Architecture: The BLUF Principle"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 2** | Days 6–10 | **Structured thinking models: Minto Pyramid, MECE principle & Executive summaries**<br>_Sample: "Day 2 Practice 2: README Quickstart Command Extractor"_ | Template `compare`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 3** | Days 11–15 | **Professional written correspondence: High-impact emails, Slack etiquette & Documentation**<br>_Sample: "Day 4 Practice 1: Asynchronous Message Quality & "No-Hello" Auditor"_ | Template `table`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 4** | Days 16–20 | **Verbal presentations: Agile standup updates, Technical demos & Slide design principles**<br>_Sample: "Test: Days 1–5"_ | Template `states`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 5** | Days 21–25 | **Interpersonal dynamics: Active listening, Constructive feedback loops & Conflict de-escalation**<br>_Sample: "Day 7 Practice 1: SBI Constructive Feedback Message Generator"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 6** | Days 26–30 | **Interview mastery: The STAR method, Behavioral question responses & Salary negotiation**<br>_Sample: "Day 9: Effective Agile Standups & Synchronous Meetings: The 90-Second Update"_ | Template `compare`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |

#### Capstone Milestone Project
* **Milestone Deliverable:** Executive Career Portfolio & Interview Masterclass: Comprehensive career communication asset package featuring structured technical project demos, STAR behavioral interview decks, and executive writing samples.

---

### Course 37: [course-nlp] Natural Language Processing & Computational Linguistics

* **Catalog ID:** `course-nlp`  
* **Prefix / Directory:** `src/lib/data/lessonVisuals/nlp/`  
* **Difficulty:** Advanced | **Duration:** 4 Weeks / 30 Curriculum Days | **Quests:** 96 quests  
* **Core Architectural Theme:** Tokenization, TF-IDF Vectors, Word2Vec Semantics & Transformer Self-Attention  
* **Allowed Visual Templates:** `letters`, `cells`, `table`, `flow`, `bars`, `tree-graph`  

#### Pedagogical Whiteboard Mental Model
> Show token sequence sliding windows, word embedding vector spaces with cosine distance, and Transformer Query-Key-Value self-attention matrix products.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus & Sample Topics | Primary Visual Architecture & Step Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Text preprocessing pipelines: Unicode normalization, Tokenization, Stemming & Lemmatization**<br>_Sample: "Day 1: Text Preprocessing Pipeline: Unicode Normalization & Regex Tokenization"_ | Template `letters`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 2** | Days 6–10 | **Statistical representation: Bag-of-Words, N-grams & Term Frequency-Inverse Document Frequency**<br>_Sample: "Day 2 Practice 2: POS Aware Root Form Reduction Method Name Formatter"_ | Template `cells`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 3** | Days 11–15 | **Distributed vector embeddings: Continuous Bag of Words (CBOW), Skip-gram & Word2Vec geometry**<br>_Sample: "Day 4 Practice 1: TF-IDF Term Weighting Calculator"_ | Template `table`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 4** | Days 16–20 | **Sequence modeling: Recurrent Neural Networks (RNN), Hidden states & LSTM/GRU gating mechanisms**<br>_Sample: "Test: Days 1–5"_ | Template `flow`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 5** | Days 21–25 | **Transformer architecture: Scaled dot-product Self-Attention, Multi-head matrices & Positional encodings**<br>_Sample: "Day 7 Practice 1: Word2Vec Semantic Vector Analogy Arithmetic Engine"_ | Template `bars`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |
| **Block 6** | Days 26–30 | **Computational language applications: Named Entity Recognition (NER), Sentiment scoring & Summarization**<br>_Sample: "Day 9: Global Vectors for Word Representation: GloVe Co-Occurrence Matrix Factorization"_ | Template `tree-graph`: Step-by-step state animation with `data`, `ok`, `idle` token highlighting. |

#### Capstone Milestone Project
* **Milestone Deliverable:** Production Natural Language Processing Engine: End-to-end computational linguistic pipeline performing text preprocessing, TF-IDF/Dense embedding extraction, and sentiment/NER classification.

---

## 🚀 Execution & Phased Implementation Roadmap

The generation and verification of all 37 individual courses proceeds in structured, atomic phases:

### Phase 0: Pre-Flight Safety, Scope Guard & Protected Files
* Lock down test suites, security guards, and protected directories.
* Run Gitleaks secret scanning and verify clean working tree on `main-dis3ku`.
* Initialize course directories under `src/lib/data/lessonVisuals/` for all ungenerated courses.

### Phase 1: Visual Engine Extensions & Domain Template Adaptations
* Register extended templates: `register-bits` for Embedded IoT, `ledger-sheet` for Digital Accounting, and `funnel` for Digital Marketing & Sales.
* Extend runtime binding evaluators for financial balances and hardware registers.
* Update `COURSE_ALLOWED_TEMPLATES` in `src/lib/visuals/gate.ts` to reflect all 37 courses.

### Phase 2: 5-Day Atomic Generation & In-Situ Verification Sprints
* Total Workload: **222 atomic 5-day blocks** (37 courses &times; 6 blocks).
* Each 5-day block follows the Zero-Hallucination 5-Step Loop:
  1. Align day and part titles with the Master Curriculum.
  2. Run `npm run visuals:check -- --course {prefix} --block {N}`.
  3. Remediate any non-compliant entries in place immediately until 100% PASS.
  4. Validate runtime payload via `/api/visuals?prefix={prefix}&day={day}`.
  5. Stage and commit the verified block to git repository.

### Phase 3: Global Matrix Simulation & Quality Sign-Off
* Execute `simulate-student-view.mts` across all 1,110 days and 6,660 lesson parts.
* Enforce **0 fatal errors, 0 broken bindings, and 100% matrix pass rate**.
* Final owner sign-off and milestone release.

