# PinIT Career OS — 36+ Individual 1-Month Courses Master Visuals & Lesson Duration Architecture Plan

**Document:** `PINIT_36_INDIVIDUAL_COURSES_VISUALS_PLAN`  
**Version:** 3.0 (Zero-Hallucination Production Standard & Lesson Duration Audit)  
**Date:** 10 October 2026  
**System:** PinIT Career OS Learning Engine (`VisualStage.tsx`, `longLessons.ts`, `curriculumEnricher.ts`, Gate v2)  
**Total Volume:** 37 Master Courses &times; 6 Blocks &times; 5 Days = **1,110 Lesson Days** &times; 6 Parts = **6,660 Interactive Lesson Parts**  
**Primary Standard:** **18–25 Minutes Lesson Duration** + **100% Gate v2 Deterministic Visual Bindings**  
**Compiled PDF Location:** `docs/visuals/PINIT_36_INDIVIDUAL_COURSES_VISUALS_PLAN.pdf`  

---

## 🎯 1. Honest Reality Audit: Already Built vs. To Be Built

A rigorous, line-by-line programmatic audit of the codebase reveals that the 37 individual courses fall into **4 distinct architectural categories**:

| Category | Description | Course Count | Visual Status | Duration (Target: 18–25m) |
| :--- | :--- | :---: | :---: | :---: |
| **Category A: Ready to Ship** | Fully built 30/30 visuals (from Python & Web tracks) + 6-part LongLessons | **12 Courses** | ✅ 30/30 Complete | 🎯 **21.2–24.4 min** (PERFECT) |
| **Category B: Tuning Required** | Visuals 30/30 built (`sql-mastery`), but duration slightly over 25m | **1 Course** | ✅ 30/30 Complete | ⚠️ **26.1 min** (Needs minor trim) |
| **Category C: Visuals Needed** | Duration perfect (22.5 min via LongLessons), but visuals need generation | **1 Course** | ⏳ 0/30 Needed | 🎯 **22.5 min** (PERFECT) |
| **Category D: Standalone Expansion** | New Standalone courses currently in short pilot format (~6m); needs LongLessons + Visuals | **23 Courses** | ⏳ 0/30 Needed | ⚠️ **6.0–6.5 min** (Expansion needed) |
| **TOTAL** | **All Catalog Courses** | **37 Courses** | **13 Built / 24 Needed** | **13 Compliant / 24 Needed** |

### Breakdown of Already Built Visuals (13 Courses)
Because these courses were built during the flagship Python Full-Stack and Web Full-Stack certification tracks, their visuals are **already 100% complete, Gate v2 compliant, and tested on disk**:
1. **React Web** (`react-basics`): 30/30 days on disk.
2. **Node.js Backend** (`node-web`): 30/30 days on disk.
3. **Cloud Native AWS** (`cloud` / `cloud-py`): 30/30 days on disk.
4. **DevOps CI/CD** (`devops`): 30/30 days on disk.
5. **DSA & Optimization** (`dsa-optim` / `dsa-py`): 30/30 days on disk.
6. **Cybersecurity** (`cyber` / `cyber-py`): 30/30 days on disk.
7. **Database Engineering** (`sql-mastery`): 30/30 days on disk.
8. **Distributed Systems** (`dist` / `dist-py`): 30/30 days on disk.
9. **AI Engineering & LLMs** (`ai` / `ai-py`): 30/30 days on disk.
10. **Python Backend Systems** (`python`): 30/30 days on disk.
11. **Quantitative Systems** (`quant-py`): 30/30 days on disk.
12. **AI Prompt Literacy** (`prompt-py`): 30/30 days on disk.
13. **Natural Language Processing** (`nlp-py`): 30/30 days on disk.

---

## ⏱️ 2. The 18–25 Minute Pedagogical Duration Standard

In PinIT Career OS, a lesson is neither a brief video snippet nor a multi-hour lecture. It is calibrated strictly to the **18–25 minute cognitive retention window**:

$$\text{Total Lesson Duration} = \text{Spoken Audio Time} + \text{Hands-On Interactive Activity Time}$$

### Formula Implementation (from `src/lib/data/longLessons.ts`):
1. **Spoken Narration Time (`estimateSpokenMinutes`):**
   - Spoken words from the instructor's `say` lines, concept explanations, and quiz rationales.
   - Calculated at a deliberate teaching pace of **120 words per minute** ($\text{words} / 120$).
   - Target word count per day: **1,200 to 1,500 words** &rarr; **10 to 12.5 minutes of spoken teaching**.
2. **Hands-On Interactive Time (`estimateActivityMinutes`):**
   - Reading and executing code examples: **0.5 min per part**.
   - Solving the active `tryIt` coding challenge: **1.0 min per part**.
   - Diagnostic concept check quiz question: **0.5 min per part**.
   - Total per part: **2.0 minutes** &times; 6 parts = **12.0 minutes of active student engagement**.
3. **Combined Experience:**
   - **10–12.5 min spoken** + **12 min hands-on activity** = **22 to 24.5 minutes**.
   - **Result:** Perfectly centered inside the 18–25 minute window!

---

## 📊 3. Master Course-by-Course Duration & Visuals Audit Table (All 37 Courses)

Below is the complete, course-by-course audit of all 37 individual courses, reporting exact measured times and current visual status:

| # | Course ID | Canonical Title | Spoken Min | Activity Min | Total Min | Duration Status | Visuals Status | Action Required |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **01** | `course-java-logic` | Java Fundamentals & Core Logic | 1m | 5.5m | ⚠️ 6.5m (Short) | REMEDIATE | ⏳ Needed (0/30) | Expand to 6-part LongLesson (18-25m) + Generate Visuals |
| **02** | `course-react-web` | Full-Stack React Web Development | 9.5m | 11.9m | ✅ **21.4m** | PASS | ✅ Complete (30/30) | Ready to ship; link existing visuals |
| **03** | `course-node-web` | Node.js & TypeScript Backend Engineering | 11.6m | 12m | ✅ **23.6m** | PASS | ✅ Complete (30/30) | Ready to ship; link existing visuals |
| **04** | `course-cloud-native` | Cloud Native Architectures (AWS) | 12.1m | 12m | ✅ **24.1m** | PASS | ✅ Complete (30/30) | Ready to ship; link existing visuals |
| **05** | `course-devops-cicd` | DevOps & CI/CD Pipeline Automation | 10.6m | 12m | ✅ **22.6m** | PASS | ✅ Complete (30/30) | Ready to ship; link existing visuals |
| **06** | `course-design-systems` | UI/UX Design Systems & Visual Frontend | 10.5m | 12m | ✅ **22.5m** | PASS | ⏳ Needed (0/30) | Generate 30-day visual suite (Gate v2) |
| **07** | `course-dsa-optim` | Data Structures & Algorithmic Optimizations | 11.3m | 12m | ✅ **23.3m** | PASS | ✅ Complete (30/30) | Ready to ship; link existing visuals |
| **08** | `course-mobile-dev` | Mobile Application Development | 1m | 5m | ⚠️ 6m (Short) | REMEDIATE | ⏳ Needed (0/30) | Expand to 6-part LongLesson (18-25m) + Generate Visuals |
| **09** | `course-cybersecurity` | Cybersecurity Principles & Secure Systems | 12.4m | 12m | ✅ **24.4m** | PASS | ✅ Complete (30/30) | Ready to ship; link existing visuals |
| **10** | `course-database-eng` | Database Engineering & Query Performance | 14.1m | 12m | ⚠️ 26.1m (Long) | REMEDIATE | ✅ Complete (30/30) | Trim lesson text slightly to hit &le;25m |
| **11** | `course-distributed-sys` | High-Scale Distributed System Design | 10.8m | 12m | ✅ **22.8m** | PASS | ✅ Complete (30/30) | Ready to ship; link existing visuals |
| **12** | `course-ai-eng` | AI Engineering & LLM Integration | 10.6m | 12m | ✅ **22.6m** | PASS | ✅ Complete (30/30) | Ready to ship; link existing visuals |
| **13** | `course-fullstack-js` | Full-Stack JavaScript Engineering | 1m | 5m | ⚠️ 6m (Short) | REMEDIATE | ⏳ Needed (0/30) | Expand to 6-part LongLesson (18-25m) + Generate Visuals |
| **14** | `course-iot-embedded` | IoT, Firmware & Embedded Systems | 1m | 5m | ⚠️ 6m (Short) | REMEDIATE | ⏳ Needed (0/30) | Expand to 6-part LongLesson (18-25m) + Generate Visuals |
| **15** | `course-3d-graphics` | 3D Interactive Graphics & Avatar Animation | 1m | 5m | ⚠️ 6m (Short) | REMEDIATE | ⏳ Needed (0/30) | Expand to 6-part LongLesson (18-25m) + Generate Visuals |
| **16** | `course-blockchain-web3` | Blockchain, Web3 & Smart Contracts | 1m | 5m | ⚠️ 6m (Short) | REMEDIATE | ⏳ Needed (0/30) | Expand to 6-part LongLesson (18-25m) + Generate Visuals |
| **17** | `course-iot-network` | IoT Wireless Networks & Protocols | 1m | 5m | ⚠️ 6m (Short) | REMEDIATE | ⏳ Needed (0/30) | Expand to 6-part LongLesson (18-25m) + Generate Visuals |
| **18** | `course-iot-edge-ai` | Edge AI, DSP & TinyML Systems | 1m | 5m | ⚠️ 6m (Short) | REMEDIATE | ⏳ Needed (0/30) | Expand to 6-part LongLesson (18-25m) + Generate Visuals |
| **19** | `course-iot-security` | Industrial IoT Security & Device Lifecycle | 1m | 5m | ⚠️ 6m (Short) | REMEDIATE | ⏳ Needed (0/30) | Expand to 6-part LongLesson (18-25m) + Generate Visuals |
| **20** | `course-python-backend` | Python Programming & Backend Systems | 10.6m | 12m | ✅ **22.6m** | PASS | ✅ Complete (30/30) | Ready to ship; link existing visuals |
| **21** | `course-quant-systems` | Quantitative Engineering & Low-Latency Trading Systems | 9.4m | 12m | ✅ **21.4m** | PASS | ✅ Complete (30/30) | Ready to ship; link existing visuals |
| **22** | `course-digital-accounting` | Digital Accounting & Taxation (B.Com / BBA) | 1m | 5m | ⚠️ 6m (Short) | REMEDIATE | ⏳ Needed (0/30) | Expand to 6-part LongLesson (18-25m) + Generate Visuals |
| **23** | `course-finance-investment` | Business Finance & Investment Management (B.Com / BBA) | 1m | 5m | ⚠️ 6m (Short) | REMEDIATE | ⏳ Needed (0/30) | Expand to 6-part LongLesson (18-25m) + Generate Visuals |
| **24** | `course-business-analytics` | Business Analytics & Decision Intelligence (B.Com / BBA / MBA) | 1m | 5m | ⚠️ 6m (Short) | REMEDIATE | ⏳ Needed (0/30) | Expand to 6-part LongLesson (18-25m) + Generate Visuals |
| **25** | `course-marketing-branding` | Marketing & Brand Management (B.Com / BBA / MBA) | 1m | 5m | ⚠️ 6m (Short) | REMEDIATE | ⏳ Needed (0/30) | Expand to 6-part LongLesson (18-25m) + Generate Visuals |
| **26** | `course-digital-marketing` | Digital Marketing & Growth Strategy (B.Com / BBA / MBA) | 1m | 5m | ⚠️ 6m (Short) | REMEDIATE | ⏳ Needed (0/30) | Expand to 6-part LongLesson (18-25m) + Generate Visuals |
| **27** | `course-ecommerce-digital-biz` | E-Commerce & Digital Business (B.Com / BBA / MBA) | 1m | 5m | ⚠️ 6m (Short) | REMEDIATE | ⏳ Needed (0/30) | Expand to 6-part LongLesson (18-25m) + Generate Visuals |
| **28** | `course-entrepreneurship-biz-mgmt` | Entrepreneurship & Business Management (B.Com / BBA / MBA) | 1m | 5m | ⚠️ 6m (Short) | REMEDIATE | ⏳ Needed (0/30) | Expand to 6-part LongLesson (18-25m) + Generate Visuals |
| **29** | `course-sales-crm-success` | Sales, Customer Success & CRM (B.Com / BBA / MBA) | 1m | 5m | ⚠️ 6m (Short) | REMEDIATE | ⏳ Needed (0/30) | Expand to 6-part LongLesson (18-25m) + Generate Visuals |
| **30** | `course-operations-supplychain-compliance` | Operations, Supply Chain & Business Compliance (B.Com / BBA / MBA) | 1m | 5m | ⚠️ 6m (Short) | REMEDIATE | ⏳ Needed (0/30) | Expand to 6-part LongLesson (18-25m) + Generate Visuals |
| **31** | `course-ai-digital-transformation` | AI & Digital Transformation for Business (B.Com / BBA / MBA) | 1m | 5m | ⚠️ 6m (Short) | REMEDIATE | ⏳ Needed (0/30) | Expand to 6-part LongLesson (18-25m) + Generate Visuals |
| **32** | `course-computer-fundamentals` | Computer Literacy, Digital Productivity & OS Fundamentals | 1m | 5m | ⚠️ 6m (Short) | REMEDIATE | ⏳ Needed (0/30) | Expand to 6-part LongLesson (18-25m) + Generate Visuals |
| **33** | `course-ai-prompt-literacy` | Everyday AI Literacy & Prompt Engineering | 9.2m | 12m | ✅ **21.2m** | PASS | ✅ Complete (30/30) | Ready to ship; link existing visuals |
| **34** | `course-excel-data-viz` | Excel & Data Analysis Fundamentals | 1m | 5m | ⚠️ 6m (Short) | REMEDIATE | ⏳ Needed (0/30) | Expand to 6-part LongLesson (18-25m) + Generate Visuals |
| **35** | `course-git-version-control` | Git, GitHub & Version Control Basics | 1m | 5m | ⚠️ 6m (Short) | REMEDIATE | ⏳ Needed (0/30) | Expand to 6-part LongLesson (18-25m) + Generate Visuals |
| **36** | `course-softskills-communication` | Professional Tech Communication & Interview Mastery | 1m | 5m | ⚠️ 6m (Short) | REMEDIATE | ⏳ Needed (0/30) | Expand to 6-part LongLesson (18-25m) + Generate Visuals |
| **37** | `course-nlp` | Natural Language Processing & Computational Linguistics | 9.5m | 12m | ✅ **21.5m** | PASS | ✅ Complete (30/30) | Ready to ship; link existing visuals |

---

## 🏛️ 4. Master Visual Templates Catalog (17 Interactive Diagram Engines)

| Template Key | Engine Name | Primary Domain | Interactive Function & Pedagogical Role |
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

## 🔬 5. Deep Course-by-Course Blueprint & Roadmap (All 37 Courses)

### Course 01: [course-java-logic] Java Fundamentals & Core Logic

* **Domain Cluster:** Beginner | **Duration:** 4 Weeks / 30 Days | **Total Quests:** 96 quests  
* **Prefix Mapping:** `java-basics` (Visuals Dir: `java-basics`)  
* **Visual Suite Status:** ⏳ **0/30 Days Needed** (New Generation Required)  
* **Measured Lesson Time:** Spoken: **1 min** + Interactive: **5.5 min** = **Total: 6.5 min** (⚠️ EXPANSION TO 18-25 MIN REQUIRED)  
* **Allowed Visual Templates:** `boxes`, `flow`, `table`, `cells`, `stack-queue`, `compare`  

#### Pedagogical Whiteboard Mental Model
> Illustrate JVM Stack frame pushes/pops, heap reference allocations, and variable mutations during loops. Visuals clarify value vs reference semantics.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus | Visual Engine Architecture & Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **JVM Bytecode execution, Primitive boxing & System.out printing flow** | Template `boxes`: Animated step-by-step state progression with deterministic tokens. |
| **Block 2** | Days 6–10 | **Conditional branching, Relational operators & Boolean logic tables** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |
| **Block 3** | Days 11–15 | **While/Do-While loops, Iterative counters & Array indexing cells** | Template `table`: Animated step-by-step state progression with deterministic tokens. |
| **Block 4** | Days 16–20 | **For loops, Nested iteration patterns & Matrix coordinate grids** | Template `cells`: Animated step-by-step state progression with deterministic tokens. |
| **Block 5** | Days 21–25 | **Method call frames, Parameter pass-by-value & Return value routing** | Template `stack-queue`: Animated step-by-step state progression with deterministic tokens. |
| **Block 6** | Days 26–30 | **OOP Class blueprints, Encapsulation & Milestone Financial Engine** | Template `compare`: Animated step-by-step state progression with deterministic tokens. |

#### Capstone Milestone Deliverable
* **Milestone Project:** Milestone Financial Utility Engine: A multi-module Java application modeling bank accounts, compound interest calculators, and transactional debit/credit validation.

---

### Course 02: [course-react-web] Full-Stack React Web Development

* **Domain Cluster:** Intermediate | **Duration:** 4 Weeks / 30 Days | **Total Quests:** 96 quests  
* **Prefix Mapping:** `react-basics` (Visuals Dir: `react-basics`)  
* **Visual Suite Status:** ✅ **30/30 Days Complete** (Built in Cert Track)  
* **Measured Lesson Time:** Spoken: **9.5 min** + Interactive: **11.9 min** = **Total: 21.4 min** (🎯 PERFECT (18–25 min))  
* **Allowed Visual Templates:** `component-tree`, `wireframe`, `flow`, `boxes`, `compare`, `states`  

#### Pedagogical Whiteboard Mental Model
> Show component trees with props cascading downwards and callback events bubbling up. Highlight component re-renders triggered by state setter dispatches.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus | Visual Engine Architecture & Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Declarative JSX parsing, Component composition & Virtual DOM tree** | Template `component-tree`: Animated step-by-step state progression with deterministic tokens. |
| **Block 2** | Days 6–10 | **useState hook closures, Immutable state updates & Re-render triggers** | Template `wireframe`: Animated step-by-step state progression with deterministic tokens. |
| **Block 3** | Days 11–15 | **Props contract interfaces, Prop drilling vs Context & Children nodes** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |
| **Block 4** | Days 16–20 | **useEffect dependency arrays, Async fetch cycles & Cleanup timers** | Template `boxes`: Animated step-by-step state progression with deterministic tokens. |
| **Block 5** | Days 21–25 | **Controlled forms, Validation state machines & UI layout wireframes** | Template `compare`: Animated step-by-step state progression with deterministic tokens. |
| **Block 6** | Days 26–30 | **Next.js App Router hybrid rendering, Server vs Client components** | Template `states`: Animated step-by-step state progression with deterministic tokens. |

#### Capstone Milestone Deliverable
* **Milestone Project:** Production Enterprise SaaS Portal: High-performance Next.js application with dynamic dashboard routing, dark/light theme tokens, and live analytics telemetry.

---

### Course 03: [course-node-web] Node.js & TypeScript Backend Engineering

* **Domain Cluster:** Intermediate | **Duration:** 4 Weeks / 30 Days | **Total Quests:** 96 quests  
* **Prefix Mapping:** `node-web` (Visuals Dir: `node-web`)  
* **Visual Suite Status:** ✅ **30/30 Days Complete** (Built in Cert Track)  
* **Measured Lesson Time:** Spoken: **11.6 min** + Interactive: **12 min** = **Total: 23.6 min** (🎯 PERFECT (18–25 min))  
* **Allowed Visual Templates:** `sequence`, `stack-queue`, `flow`, `boxes`, `table`, `states`  

#### Pedagogical Whiteboard Mental Model
> Map incoming HTTP request flows through Express middleware waterfalls. Show database connection pool acquisitions and async non-blocking I/O queues.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus | Visual Engine Architecture & Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **V8 Engine Call Stack, libuv Event Loop & Microtask/Macrotask queues** | Template `sequence`: Animated step-by-step state progression with deterministic tokens. |
| **Block 2** | Days 6–10 | **TypeScript strict typing, Interface schemas & Compile-time validation** | Template `stack-queue`: Animated step-by-step state progression with deterministic tokens. |
| **Block 3** | Days 11–15 | **HTTP Request-Response lifecycles, RESTful routes & Express middleware** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |
| **Block 4** | Days 16–20 | **Relational PostgreSQL queries, Connection pooling & ACID transactions** | Template `boxes`: Animated step-by-step state progression with deterministic tokens. |
| **Block 5** | Days 21–25 | **JWT HMAC-SHA256 authentication, Bcrypt password hashing & Auth guards** | Template `table`: Animated step-by-step state progression with deterministic tokens. |
| **Block 6** | Days 26–30 | **Containerized production Docker build & Health-check endpoint telemetry** | Template `states`: Animated step-by-step state progression with deterministic tokens. |

#### Capstone Milestone Deliverable
* **Milestone Project:** High-Concurrency REST Microservice: Authenticated backend API with role-based access control, connection-pooled PostgreSQL persistence, and Docker multi-stage deployment.

---

### Course 04: [course-cloud-native] Cloud Native Architectures (AWS)

* **Domain Cluster:** Advanced | **Duration:** 4 Weeks / 30 Days | **Total Quests:** 96 quests  
* **Prefix Mapping:** `cloud` (Visuals Dir: `cloud`)  
* **Visual Suite Status:** ✅ **30/30 Days Complete** (Built in Cert Track)  
* **Measured Lesson Time:** Spoken: **12.1 min** + Interactive: **12 min** = **Total: 24.1 min** (🎯 PERFECT (18–25 min))  
* **Allowed Visual Templates:** `workflow`, `sequence`, `states`, `table`, `bars`, `compare`  

#### Pedagogical Whiteboard Mental Model
> Visualize cloud architecture topologies: VPC subnets, Internet Gateways, Application Load Balancers, and ECS tasks. Clarify IAM role evaluation logic.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus | Visual Engine Architecture & Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **AWS Global Cloud Infrastructure, Regions, Availability Zones & IAM Policies** | Template `workflow`: Animated step-by-step state progression with deterministic tokens. |
| **Block 2** | Days 6–10 | **VPC CIDR subnets, Public vs Private routing & Security Group firewalls** | Template `sequence`: Animated step-by-step state progression with deterministic tokens. |
| **Block 3** | Days 11–15 | **Compute scaling: EC2 instances, Application Load Balancers & Auto Scaling** | Template `states`: Animated step-by-step state progression with deterministic tokens. |
| **Block 4** | Days 16–20 | **Serverless computing: AWS Lambda triggers, API Gateway & DynamoDB NoSQL** | Template `table`: Animated step-by-step state progression with deterministic tokens. |
| **Block 5** | Days 21–25 | **Container orchestration: ECR image registries & ECS/Fargate task definitions** | Template `bars`: Animated step-by-step state progression with deterministic tokens. |
| **Block 6** | Days 26–30 | **Multi-AZ High Availability, Route53 DNS failover & Terraform IaC blueprints** | Template `compare`: Animated step-by-step state progression with deterministic tokens. |

#### Capstone Milestone Deliverable
* **Milestone Project:** Multi-AZ Serverless Cloud Infrastructure: Terraform-provisioned VPC architecture with ALB traffic distribution, ECS Fargate microservices, and automated health checks.

---

### Course 05: [course-devops-cicd] DevOps & CI/CD Pipeline Automation

* **Domain Cluster:** Advanced | **Duration:** 4 Weeks / 30 Days | **Total Quests:** 96 quests  
* **Prefix Mapping:** `devops` (Visuals Dir: `devops`)  
* **Visual Suite Status:** ✅ **30/30 Days Complete** (Built in Cert Track)  
* **Measured Lesson Time:** Spoken: **10.6 min** + Interactive: **12 min** = **Total: 22.6 min** (🎯 PERFECT (18–25 min))  
* **Allowed Visual Templates:** `flow`, `workflow`, `states`, `sequence`, `compare`  

#### Pedagogical Whiteboard Mental Model
> Diagram Docker layer caching trees, GitHub Actions stage execution waterfalls, and Kubernetes ReplicaSet pod reconciliation loops.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus | Visual Engine Architecture & Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **POSIX Linux administration, Shell piping & Systemd daemon services** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |
| **Block 2** | Days 6–10 | **Git trunk-based branching, Semantic versioning & GitOps workflows** | Template `workflow`: Animated step-by-step state progression with deterministic tokens. |
| **Block 3** | Days 11–15 | **Docker engine internals, Multi-stage image builds & Layer caching DAGs** | Template `states`: Animated step-by-step state progression with deterministic tokens. |
| **Block 4** | Days 16–20 | **GitHub Actions runners, Lint-Test-Build matrix workflows & Secret vaults** | Template `sequence`: Animated step-by-step state progression with deterministic tokens. |
| **Block 5** | Days 21–25 | **Kubernetes cluster architecture: Control plane, Pods, Services & Ingress** | Template `compare`: Animated step-by-step state progression with deterministic tokens. |
| **Block 6** | Days 26–30 | **Zero-downtime Blue/Green deployments, Canary rollouts & Prometheus alerts** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |

#### Capstone Milestone Deliverable
* **Milestone Project:** Enterprise Automated GitOps Pipeline: Multi-stage Docker containerization pipeline with automated GitHub Actions testing, security vulnerability scanning, and Kubernetes deployment.

---

### Course 06: [course-design-systems] UI/UX Design Systems & Visual Frontend

* **Domain Cluster:** Beginner | **Duration:** 4 Weeks / 30 Days | **Total Quests:** 96 quests  
* **Prefix Mapping:** `design` (Visuals Dir: `design`)  
* **Visual Suite Status:** ⏳ **0/30 Days Needed** (New Generation Required)  
* **Measured Lesson Time:** Spoken: **10.5 min** + Interactive: **12 min** = **Total: 22.5 min** (🎯 PERFECT (18–25 min))  
* **Allowed Visual Templates:** `wireframe`, `component-tree`, `compare`, `boxes`, `bars`  

#### Pedagogical Whiteboard Mental Model
> Draw CSS box-model margins/borders/padding, Flexbox/Grid spatial coordinates, and accessibility contrast verification ratios across light and dark modes.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus | Visual Engine Architecture & Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Visual hierarchy principles, Modular typography scales & 8pt grid geometry** | Template `wireframe`: Animated step-by-step state progression with deterministic tokens. |
| **Block 2** | Days 6–10 | **Color space tokens, HSL palette generation & WCAG AAA contrast ratios** | Template `component-tree`: Animated step-by-step state progression with deterministic tokens. |
| **Block 3** | Days 11–15 | **Atomic Design methodology: Atoms, Molecules, Organisms & Templates** | Template `compare`: Animated step-by-step state progression with deterministic tokens. |
| **Block 4** | Days 16–20 | **CSS Layout mechanics: Flexbox axes, CSS Grid fr tracks & Responsive breakpoints** | Template `boxes`: Animated step-by-step state progression with deterministic tokens. |
| **Block 5** | Days 21–25 | **Interactive component state machines: Hover, Focus-visible, Active & Disabled** | Template `bars`: Animated step-by-step state progression with deterministic tokens. |
| **Block 6** | Days 26–30 | **Design Token architecture: Style Dictionary, JSON token exports & Figma sync** | Template `wireframe`: Animated step-by-step state progression with deterministic tokens. |

#### Capstone Milestone Deliverable
* **Milestone Project:** Production Design System Library: Documented, accessible UI component kit featuring tokens, atomic components, and responsive mobile-to-desktop wireframe layouts.

---

### Course 07: [course-dsa-optim] Data Structures & Algorithmic Optimizations

* **Domain Cluster:** Intermediate | **Duration:** 4 Weeks / 30 Days | **Total Quests:** 96 quests  
* **Prefix Mapping:** `dsa-optim` (Visuals Dir: `dsa-optim`)  
* **Visual Suite Status:** ✅ **30/30 Days Complete** (Built in Cert Track)  
* **Measured Lesson Time:** Spoken: **11.3 min** + Interactive: **12 min** = **Total: 23.3 min** (🎯 PERFECT (18–25 min))  
* **Allowed Visual Templates:** `cells`, `stack-queue`, `tree-graph`, `table`, `bars`, `compare`  

#### Pedagogical Whiteboard Mental Model
> Show memory array buffers with dual pointers shifting, recursion stack frame winding/unwinding, and 2D memoization grids populating optimal substructure solutions.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus | Visual Engine Architecture & Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Big-O Asymptotic Space-Time analysis, Linear arrays & In-place operations** | Template `cells`: Animated step-by-step state progression with deterministic tokens. |
| **Block 2** | Days 6–10 | **Two-pointer convergence, Sliding window bounds & Prefix sum caching** | Template `stack-queue`: Animated step-by-step state progression with deterministic tokens. |
| **Block 3** | Days 11–15 | **Linked memory lists, LIFO Call Stacks & FIFO Circular Queue buffers** | Template `tree-graph`: Animated step-by-step state progression with deterministic tokens. |
| **Block 4** | Days 16–20 | **Hierarchical Trees, Binary Search Tree balancing & Binary Heap priorities** | Template `table`: Animated step-by-step state progression with deterministic tokens. |
| **Block 5** | Days 21–25 | **Graph topologies, Adjacency lists, BFS/DFS traversal & Dijkstra shortest paths** | Template `bars`: Animated step-by-step state progression with deterministic tokens. |
| **Block 6** | Days 26–30 | **Dynamic Programming: Memoization tables, Tabulation & Knapsack optimization** | Template `compare`: Animated step-by-step state progression with deterministic tokens. |

#### Capstone Milestone Deliverable
* **Milestone Project:** High-Performance Algorithmic Optimization Suite: Benchmark-validated implementations of cache-conscious searching, graph pathfinding, and dynamic programming schedulers.

---

### Course 08: [course-mobile-dev] Mobile Application Development

* **Domain Cluster:** Intermediate | **Duration:** 4 Weeks / 30 Days | **Total Quests:** 96 quests  
* **Prefix Mapping:** `mobile` (Visuals Dir: `mobile`)  
* **Visual Suite Status:** ⏳ **0/30 Days Needed** (New Generation Required)  
* **Measured Lesson Time:** Spoken: **1 min** + Interactive: **5 min** = **Total: 6 min** (⚠️ EXPANSION TO 18-25 MIN REQUIRED)  
* **Allowed Visual Templates:** `wireframe`, `component-tree`, `flow`, `sequence`, `states`  

#### Pedagogical Whiteboard Mental Model
> Illustrate JavaScript-to-Native bridge execution, Yoga Flexbox layout reflows, and touch gesture responder state transitions.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus | Visual Engine Architecture & Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **React Native architecture: JavaScript thread, JSI, Shadow Tree & Native UI** | Template `wireframe`: Animated step-by-step state progression with deterministic tokens. |
| **Block 2** | Days 6–10 | **Core UI primitives: View, Text, FlatList virtualization & Yoga flex layouts** | Template `component-tree`: Animated step-by-step state progression with deterministic tokens. |
| **Block 3** | Days 11–15 | **Navigation architectures: Native Stack, Bottom Tabs & Deep-link URI routing** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |
| **Block 4** | Days 16–20 | **Offline state persistence: MMKV fast key-value & SQLite local transactions** | Template `sequence`: Animated step-by-step state progression with deterministic tokens. |
| **Block 5** | Days 21–25 | **Native hardware bridges: Camera capture, GPS Geolocation & Biometric auth** | Template `states`: Animated step-by-step state progression with deterministic tokens. |
| **Block 6** | Days 26–30 | **Performance profiling: Hermes bytecode compilation & Release bundle packaging** | Template `wireframe`: Animated step-by-step state progression with deterministic tokens. |

#### Capstone Milestone Deliverable
* **Milestone Project:** Cross-Platform Mobile Utility App: Feature-complete React Native application featuring virtualized infinite feeds, offline SQLite synchronization, and biometric authentication.

---

### Course 09: [course-cybersecurity] Cybersecurity Principles & Secure Systems

* **Domain Cluster:** Advanced | **Duration:** 4 Weeks / 30 Days | **Total Quests:** 96 quests  
* **Prefix Mapping:** `cyber` (Visuals Dir: `cyber`)  
* **Visual Suite Status:** ✅ **30/30 Days Complete** (Built in Cert Track)  
* **Measured Lesson Time:** Spoken: **12.4 min** + Interactive: **12 min** = **Total: 24.4 min** (🎯 PERFECT (18–25 min))  
* **Allowed Visual Templates:** `flow`, `sequence`, `table`, `compare`, `states`  

#### Pedagogical Whiteboard Mental Model
> Diagram packet inspection sequences, TLS 1.3 cryptographic key exchanges, JWT tampering detection, and SQL injection sanitization barriers.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus | Visual Engine Architecture & Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Threat modeling methodologies, Attack vectors & OWASP Top 10 vulnerabilities** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |
| **Block 2** | Days 6–10 | **Authentication architecture: Multi-factor auth, Salted Bcrypt & Session stores** | Template `sequence`: Animated step-by-step state progression with deterministic tokens. |
| **Block 3** | Days 11–15 | **Cryptographic systems: Symmetric AES-GCM, Asymmetric RSA & ECC key pairs** | Template `table`: Animated step-by-step state progression with deterministic tokens. |
| **Block 4** | Days 16–20 | **Web application hardening: CSP headers, CORS policies & CSRF token validation** | Template `compare`: Animated step-by-step state progression with deterministic tokens. |
| **Block 5** | Days 21–25 | **Network defense: TLS 1.3 handshake, WAF firewall rules & DDoS rate limiters** | Template `states`: Animated step-by-step state progression with deterministic tokens. |
| **Block 6** | Days 26–30 | **Security incident response: Penetration testing workflows & SIEM audit logs** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |

#### Capstone Milestone Deliverable
* **Milestone Project:** Zero-Trust Secure Authentication Gateway: End-to-end hardened authentication microservice with Argon2id password hashing, rotating JWT signing keys, and brute-force rate limiting.

---

### Course 10: [course-database-eng] Database Engineering & Query Performance

* **Domain Cluster:** Advanced | **Duration:** 4 Weeks / 30 Days | **Total Quests:** 96 quests  
* **Prefix Mapping:** `sql-mastery` (Visuals Dir: `sql-mastery`)  
* **Visual Suite Status:** ✅ **30/30 Days Complete** (Built in Cert Track)  
* **Measured Lesson Time:** Spoken: **14.1 min** + Interactive: **12 min** = **Total: 26.1 min** (⚠️ EXPANSION TO 18-25 MIN REQUIRED)  
* **Allowed Visual Templates:** `table`, `tree-graph`, `flow`, `compare`, `bars`  

#### Pedagogical Whiteboard Mental Model
> Illustrate B+ Tree node splits, Write-Ahead Log (WAL) sequential flushes, and query execution plans comparing sequential table scans with index lookups.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus | Visual Engine Architecture & Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Relational algebra, Entity-Relationship schemas & Normalization (1NF–BCNF)** | Template `table`: Animated step-by-step state progression with deterministic tokens. |
| **Block 2** | Days 6–10 | **SQL Query execution engine: Parsing, Query planning & AST optimization** | Template `tree-graph`: Animated step-by-step state progression with deterministic tokens. |
| **Block 3** | Days 11–15 | **Indexing data structures: B+ Tree page balancing, Hash indexes & Covering indexes** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |
| **Block 4** | Days 16–20 | **ACID properties, MVCC concurrency control & Transaction isolation anomalies** | Template `compare`: Animated step-by-step state progression with deterministic tokens. |
| **Block 5** | Days 21–25 | **Query profiling: EXPLAIN ANALYZE interpretation & Buffer cache hit ratios** | Template `bars`: Animated step-by-step state progression with deterministic tokens. |
| **Block 6** | Days 26–30 | **Horizontal scaling: Table partitioning, Read replication & Connection pools** | Template `table`: Animated step-by-step state progression with deterministic tokens. |

#### Capstone Milestone Deliverable
* **Milestone Project:** High-Throughput Financial Ledger Database: Production-tuned PostgreSQL schema with B+ tree composite indexes, strict MVCC isolation, and sub-millisecond query execution plans.

---

### Course 11: [course-distributed-sys] High-Scale Distributed System Design

* **Domain Cluster:** Advanced | **Duration:** 4 Weeks / 30 Days | **Total Quests:** 96 quests  
* **Prefix Mapping:** `dist` (Visuals Dir: `dist`)  
* **Visual Suite Status:** ✅ **30/30 Days Complete** (Built in Cert Track)  
* **Measured Lesson Time:** Spoken: **10.8 min** + Interactive: **12 min** = **Total: 22.8 min** (🎯 PERFECT (18–25 min))  
* **Allowed Visual Templates:** `sequence`, `workflow`, `states`, `table`, `cells`, `compare`  

#### Pedagogical Whiteboard Mental Model
> Show consistent hashing token rings, Raft leader election heartbeat sequences, and 2-Phase Commit prepare/commit transaction message flows.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus | Visual Engine Architecture & Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Fallacies of distributed computing, Network partitions & CAP/PACELC theorems** | Template `sequence`: Animated step-by-step state progression with deterministic tokens. |
| **Block 2** | Days 6–10 | **RPC protocols, Protocol Buffers schema compilation & gRPC streaming channels** | Template `workflow`: Animated step-by-step state progression with deterministic tokens. |
| **Block 3** | Days 11–15 | **Data partitioning: Consistent hashing rings, Virtual nodes & Key distribution** | Template `states`: Animated step-by-step state progression with deterministic tokens. |
| **Block 4** | Days 16–20 | **Consensus algorithms: Paxos & Raft leader election, Term leases & Log commits** | Template `table`: Animated step-by-step state progression with deterministic tokens. |
| **Block 5** | Days 21–25 | **Distributed transactions: Two-Phase Commit (2PC) & Saga compensating patterns** | Template `cells`: Animated step-by-step state progression with deterministic tokens. |
| **Block 6** | Days 26–30 | **Resilience patterns: Circuit breakers, Distributed rate limiting & Jaeger tracing** | Template `compare`: Animated step-by-step state progression with deterministic tokens. |

#### Capstone Milestone Deliverable
* **Milestone Project:** Fault-Tolerant Distributed Key-Value Store: Raft-replicated cluster featuring automated leader failover, consistent hashing shard allocation, and vector clock conflict detection.

---

### Course 12: [course-ai-eng] AI Engineering & LLM Integration

* **Domain Cluster:** Intermediate | **Duration:** 4 Weeks / 30 Days | **Total Quests:** 96 quests  
* **Prefix Mapping:** `ai` (Visuals Dir: `ai`)  
* **Visual Suite Status:** ✅ **30/30 Days Complete** (Built in Cert Track)  
* **Measured Lesson Time:** Spoken: **10.6 min** + Interactive: **12 min** = **Total: 22.6 min** (🎯 PERFECT (18–25 min))  
* **Allowed Visual Templates:** `flow`, `table`, `bars`, `sequence`, `compare`, `boxes`  

#### Pedagogical Whiteboard Mental Model
> Draw token embedding coordinate spaces, RAG vector retrieval cosine similarity rankings, and agentic tool dispatching request/response loops.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus | Visual Engine Architecture & Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Transformer architecture fundamentals: Tokenization, Embeddings & Self-Attention** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |
| **Block 2** | Days 6–10 | **Prompt engineering patterns: Few-shot context, System framing & Chain-of-Thought** | Template `table`: Animated step-by-step state progression with deterministic tokens. |
| **Block 3** | Days 11–15 | **Vector databases: Dense embeddings, HNSW indexing & Cosine similarity search** | Template `bars`: Animated step-by-step state progression with deterministic tokens. |
| **Block 4** | Days 16–20 | **Retrieval-Augmented Generation (RAG): Document chunking & Context injection** | Template `sequence`: Animated step-by-step state progression with deterministic tokens. |
| **Block 5** | Days 21–25 | **Agentic tool calling: JSON function signatures, API dispatch & ReAct loops** | Template `compare`: Animated step-by-step state progression with deterministic tokens. |
| **Block 6** | Days 26–30 | **Evaluation & Guardrails: Hallucination detection, Token budgets & Model routing** | Template `boxes`: Animated step-by-step state progression with deterministic tokens. |

#### Capstone Milestone Deliverable
* **Milestone Project:** Enterprise Document Intelligence Copilot: Production RAG pipeline with semantic document chunking, hybrid vector search, citation synthesis, and guardrail verification.

---

### Course 13: [course-fullstack-js] Full-Stack JavaScript Engineering

* **Domain Cluster:** Intermediate | **Duration:** 4 Weeks / 30 Days | **Total Quests:** 384 quests  
* **Prefix Mapping:** `fullstack-js` (Visuals Dir: `fullstack-js`)  
* **Visual Suite Status:** ⏳ **0/30 Days Needed** (New Generation Required)  
* **Measured Lesson Time:** Spoken: **1 min** + Interactive: **5 min** = **Total: 6 min** (⚠️ EXPANSION TO 18-25 MIN REQUIRED)  
* **Allowed Visual Templates:** `flow`, `component-tree`, `sequence`, `table`, `states`, `compare`  

#### Pedagogical Whiteboard Mental Model
> Show Next.js Server Component streaming hydration boundaries, WebSocket bidirectional frame ping-pong, and database mutation waterfalls.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus | Visual Engine Architecture & Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Modern ESNext language features, Microtasks, Async/Await & Generator functions** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |
| **Block 2** | Days 6–10 | **Next.js 14 App Router: Server Components, Streaming Suspense & Route Handlers** | Template `component-tree`: Animated step-by-step state progression with deterministic tokens. |
| **Block 3** | Days 11–15 | **Server Actions, Client component boundaries & Optimistic UI updates** | Template `sequence`: Animated step-by-step state progression with deterministic tokens. |
| **Block 4** | Days 16–20 | **Type-safe ORM persistence: Prisma schemas, Relational joins & DB migrations** | Template `table`: Animated step-by-step state progression with deterministic tokens. |
| **Block 5** | Days 21–25 | **Real-time communication: WebSocket duplex channels & Server-Sent Events (SSE)** | Template `states`: Animated step-by-step state progression with deterministic tokens. |
| **Block 6** | Days 26–30 | **Production deployment: Edge middleware, Vercel serverless & Dockerized images** | Template `compare`: Animated step-by-step state progression with deterministic tokens. |

#### Capstone Milestone Deliverable
* **Milestone Project:** Real-Time Collaborative Workspace: Full-stack application with live multi-user WebSocket editing, Prisma database synchronization, and optimistic UI transitions.

---

### Course 14: [course-iot-embedded] IoT, Firmware & Embedded Systems

* **Domain Cluster:** Intermediate | **Duration:** 4 Weeks / 30 Days | **Total Quests:** 96 quests  
* **Prefix Mapping:** `iot_emb` (Visuals Dir: `iot_emb`)  
* **Visual Suite Status:** ⏳ **0/30 Days Needed** (New Generation Required)  
* **Measured Lesson Time:** Spoken: **1 min** + Interactive: **5 min** = **Total: 6 min** (⚠️ EXPANSION TO 18-25 MIN REQUIRED)  
* **Allowed Visual Templates:** `flow`, `states`, `cells`, `boxes`, `sequence`, `register-bits`  

#### Pedagogical Whiteboard Mental Model
> Diagram microcontroller memory-mapped registers, bitwise mask operations, interrupt vector dispatching, and FreeRTOS task priority preemption.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus | Visual Engine Architecture & Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **MCU architectures (ARM Cortex-M), Memory map & GPIO register addressing** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |
| **Block 2** | Days 6–10 | **Bitwise register manipulation: Bitmasking, Atomic Set/Reset (BSRR) & Pull-ups** | Template `states`: Animated step-by-step state progression with deterministic tokens. |
| **Block 3** | Days 11–15 | **Timers, PWM signal generation & Hardware Interrupt Service Routines (ISR)** | Template `cells`: Animated step-by-step state progression with deterministic tokens. |
| **Block 4** | Days 16–20 | **Analog-to-Digital Conversion (ADC): Quantization step sizing & Two-point scaling** | Template `boxes`: Animated step-by-step state progression with deterministic tokens. |
| **Block 5** | Days 21–25 | **Serial protocols: UART baud rates, I2C 7-bit bus addressing & SPI clock polarity** | Template `sequence`: Animated step-by-step state progression with deterministic tokens. |
| **Block 6** | Days 26–30 | **Real-Time Operating Systems: FreeRTOS preemptive scheduler, Queues & Semaphores** | Template `register-bits`: Animated step-by-step state progression with deterministic tokens. |

#### Capstone Milestone Deliverable
* **Milestone Project:** Embedded Industrial Telemetry Controller: FreeRTOS firmware implementing multi-channel ADC sensor acquisition, lock-free ring buffers, and I2C peripheral telemetry.

---

### Course 15: [course-3d-graphics] 3D Interactive Graphics & Avatar Animation

* **Domain Cluster:** Advanced | **Duration:** 4 Weeks / 30 Days | **Total Quests:** 96 quests  
* **Prefix Mapping:** `g3d` (Visuals Dir: `g3d`)  
* **Visual Suite Status:** ⏳ **0/30 Days Needed** (New Generation Required)  
* **Measured Lesson Time:** Spoken: **1 min** + Interactive: **5 min** = **Total: 6 min** (⚠️ EXPANSION TO 18-25 MIN REQUIRED)  
* **Allowed Visual Templates:** `tree-graph`, `boxes`, `flow`, `compare`, `bars`  

#### Pedagogical Whiteboard Mental Model
> Visualize the 3D Model-View-Projection (MVP) matrix transformation pipeline, shader rasterization stages, and hierarchical skeletal bone transforms.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus | Visual Engine Architecture & Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **3D Coordinate geometry: Cartesian vectors, Dot/Cross products & Matrix transforms** | Template `tree-graph`: Animated step-by-step state progression with deterministic tokens. |
| **Block 2** | Days 6–10 | **WebGL rendering pipeline: Vertex Shaders, Fragment Shaders & Rasterization** | Template `boxes`: Animated step-by-step state progression with deterministic tokens. |
| **Block 3** | Days 11–15 | **Three.js scene graph architecture: Object3D hierarchy, Meshes & Geometry buffers** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |
| **Block 4** | Days 16–20 | **Material physics & Lighting: Ambient, Point, Directional & Physically Based Rendering** | Template `compare`: Animated step-by-step state progression with deterministic tokens. |
| **Block 5** | Days 21–25 | **Skeletal animation: Rigged bone hierarchies, Skinning weights & Keyframe tracks** | Template `bars`: Animated step-by-step state progression with deterministic tokens. |
| **Block 6** | Days 26–30 | **Rendering optimizations: Draw call batching, Frustum culling & LOD geometries** | Template `tree-graph`: Animated step-by-step state progression with deterministic tokens. |

#### Capstone Milestone Deliverable
* **Milestone Project:** Interactive 3D Avatar Animation Studio: WebGL-accelerated 3D viewport featuring custom PBR lighting shaders, skeletal bone transforms, and interactive orbital controls.

---

### Course 16: [course-blockchain-web3] Blockchain, Web3 & Smart Contracts

* **Domain Cluster:** Intermediate | **Duration:** 4 Weeks / 30 Days | **Total Quests:** 96 quests  
* **Prefix Mapping:** `blockchain` (Visuals Dir: `blockchain`)  
* **Visual Suite Status:** ⏳ **0/30 Days Needed** (New Generation Required)  
* **Measured Lesson Time:** Spoken: **1 min** + Interactive: **5 min** = **Total: 6 min** (⚠️ EXPANSION TO 18-25 MIN REQUIRED)  
* **Allowed Visual Templates:** `tree-graph`, `stack-queue`, `flow`, `sequence`, `compare`, `states`  

#### Pedagogical Whiteboard Mental Model
> Show Merkle tree cryptographic proof verification, EVM memory/stack gas consumption charts, and reentrancy attack state transition barriers.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus | Visual Engine Architecture & Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Cryptographic hash functions (SHA-256, Keccak), Asymmetric signatures & P2P networks** | Template `tree-graph`: Animated step-by-step state progression with deterministic tokens. |
| **Block 2** | Days 6–10 | **Blockchain ledger structure: Block headers, Merkle Patricia Tries & Consensus** | Template `stack-queue`: Animated step-by-step state progression with deterministic tokens. |
| **Block 3** | Days 11–15 | **Ethereum Virtual Machine (EVM): Execution stack, Storage slots & Gas accounting** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |
| **Block 4** | Days 16–20 | **Solidity contract development: Value types, Access modifiers & Event emissions** | Template `sequence`: Animated step-by-step state progression with deterministic tokens. |
| **Block 5** | Days 21–25 | **Smart contract security: Checks-Effects-Interactions, Reentrancy & Integer safety** | Template `compare`: Animated step-by-step state progression with deterministic tokens. |
| **Block 6** | Days 26–30 | **Decentralized frontend: Ethers.js / Viem, Metamask wallet RPC & Token transactions** | Template `states`: Animated step-by-step state progression with deterministic tokens. |

#### Capstone Milestone Deliverable
* **Milestone Project:** Decentralized Escrow Protocol & dApp: Production Solidity smart contract with multi-signature release conditions, reentrancy guards, and reactive Web3 frontend.

---

### Course 17: [course-iot-network] IoT Wireless Networks & Protocols

* **Domain Cluster:** Intermediate | **Duration:** 4 Weeks / 30 Days | **Total Quests:** 96 quests  
* **Prefix Mapping:** `iot_net` (Visuals Dir: `iot_net`)  
* **Visual Suite Status:** ⏳ **0/30 Days Needed** (New Generation Required)  
* **Measured Lesson Time:** Spoken: **1 min** + Interactive: **5 min** = **Total: 6 min** (⚠️ EXPANSION TO 18-25 MIN REQUIRED)  
* **Allowed Visual Templates:** `flow`, `sequence`, `states`, `table`, `compare`  

#### Pedagogical Whiteboard Mental Model
> Map BLE GATT Service/Characteristic hierarchies, LoRaWAN chirp spread spectrum uplinks, and MQTT publish/subscribe broker message routing.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus | Visual Engine Architecture & Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Wireless RF propagation fundamentals, Frequencies (ISM bands) & Network topologies** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |
| **Block 2** | Days 6–10 | **Bluetooth Low Energy (BLE): GAP advertising, GATT Services & Characteristics** | Template `sequence`: Animated step-by-step state progression with deterministic tokens. |
| **Block 3** | Days 11–15 | **IEEE 802.15.4 & Zigbee Mesh: Multi-hop routing & Self-healing network trees** | Template `states`: Animated step-by-step state progression with deterministic tokens. |
| **Block 4** | Days 16–20 | **LoRa & LoRaWAN: Chirp Spread Spectrum (CSS), Gateway uplinks & Join procedures** | Template `table`: Animated step-by-step state progression with deterministic tokens. |
| **Block 5** | Days 21–25 | **IoT Application protocols: MQTT QoS 0/1/2 handshakes, CoAP & Lightweight M2M** | Template `compare`: Animated step-by-step state progression with deterministic tokens. |
| **Block 6** | Days 26–30 | **Ultra-low-power optimization: Deep sleep modes, Duty cycling & Energy budgets** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |

#### Capstone Milestone Deliverable
* **Milestone Project:** Low-Power LoRaWAN Environmental Gateway: Edge mesh network firmware routing environmental sensor telemetry through encrypted LoRaWAN packets to an MQTT cloud broker.

---

### Course 18: [course-iot-edge-ai] Edge AI, DSP & TinyML Systems

* **Domain Cluster:** Advanced | **Duration:** 4 Weeks / 30 Days | **Total Quests:** 96 quests  
* **Prefix Mapping:** `iot_edge` (Visuals Dir: `iot_edge`)  
* **Visual Suite Status:** ⏳ **0/30 Days Needed** (New Generation Required)  
* **Measured Lesson Time:** Spoken: **1 min** + Interactive: **5 min** = **Total: 6 min** (⚠️ EXPANSION TO 18-25 MIN REQUIRED)  
* **Allowed Visual Templates:** `flow`, `bars`, `cells`, `table`, `compare`  

#### Pedagogical Whiteboard Mental Model
> Show sliding window sensor buffers, Fast Fourier Transform (FFT) spectrograms, and INT8 quantized weight matrices mapped to MCU memory arenas.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus | Visual Engine Architecture & Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Edge intelligence paradigms, Microcontroller resource budgets (SRAM/Flash)** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |
| **Block 2** | Days 6–10 | **Digital Signal Processing (DSP): Discrete filtering, Windowing & Fast Fourier Transform** | Template `bars`: Animated step-by-step state progression with deterministic tokens. |
| **Block 3** | Days 11–15 | **Time-series feature extraction: Spectral power, Zero-crossing rates & Peak detection** | Template `cells`: Animated step-by-step state progression with deterministic tokens. |
| **Block 4** | Days 16–20 | **Model optimization for edge: Post-training INT8 quantization & Weight pruning** | Template `table`: Animated step-by-step state progression with deterministic tokens. |
| **Block 5** | Days 21–25 | **TensorFlow Lite for Microcontrollers (TFLM): Memory arenas & Flatbuffer models** | Template `compare`: Animated step-by-step state progression with deterministic tokens. |
| **Block 6** | Days 26–30 | **Real-time inference pipeline: Accelerometer gesture recognition & Anomaly detection** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |

#### Capstone Milestone Deliverable
* **Milestone Project:** Edge TinyML Gesture Recognition Engine: Microcontroller-deployed model classifying continuous IMU sensor streams in real-time under a 32 KB SRAM memory constraint.

---

### Course 19: [course-iot-security] Industrial IoT Security & Device Lifecycle

* **Domain Cluster:** Advanced | **Duration:** 4 Weeks / 30 Days | **Total Quests:** 96 quests  
* **Prefix Mapping:** `iot_sec` (Visuals Dir: `iot_sec`)  
* **Visual Suite Status:** ⏳ **0/30 Days Needed** (New Generation Required)  
* **Measured Lesson Time:** Spoken: **1 min** + Interactive: **5 min** = **Total: 6 min** (⚠️ EXPANSION TO 18-25 MIN REQUIRED)  
* **Allowed Visual Templates:** `flow`, `sequence`, `states`, `compare`, `table`  

#### Pedagogical Whiteboard Mental Model
> Diagram secure boot cryptographic signature verification chains, mTLS certificate exchanges, and dual-bank OTA firmware flash memory rollback safety.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus | Visual Engine Architecture & Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Industrial IoT threat vectors, Purdue Enterprise Reference Model & Attack surfaces** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |
| **Block 2** | Days 6–10 | **Hardware Root of Trust: Secure Elements (ATECC608), TPMs & Cryptographic coprocessors** | Template `sequence`: Animated step-by-step state progression with deterministic tokens. |
| **Block 3** | Days 11–15 | **Secure Boot architectures: Cryptographic hash validation & Anti-rollback eFuses** | Template `states`: Animated step-by-step state progression with deterministic tokens. |
| **Block 4** | Days 16–20 | **Identity & Transport security: X.509 Device certificates & Mutual TLS (mTLS)** | Template `compare`: Animated step-by-step state progression with deterministic tokens. |
| **Block 5** | Days 21–25 | **Secure Over-The-Air (OTA) updates: Dual-bank flash partitions & Rollback protection** | Template `table`: Animated step-by-step state progression with deterministic tokens. |
| **Block 6** | Days 26–30 | **Industrial communication security: Encrypted Modbus-TCP, OPC UA & IEC 62443** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |

#### Capstone Milestone Deliverable
* **Milestone Project:** Hardened Industrial Edge Controller: Secure boot-verified firmware implementing mutual TLS cloud authentication and failsafe dual-bank OTA update recovery.

---

### Course 20: [course-python-backend] Python Programming & Backend Systems

* **Domain Cluster:** Intermediate | **Duration:** 4 Weeks / 30 Days | **Total Quests:** 96 quests  
* **Prefix Mapping:** `python` (Visuals Dir: `python`)  
* **Visual Suite Status:** ✅ **30/30 Days Complete** (Built in Cert Track)  
* **Measured Lesson Time:** Spoken: **10.6 min** + Interactive: **12 min** = **Total: 22.6 min** (🎯 PERFECT (18–25 min))  
* **Allowed Visual Templates:** `flow`, `sequence`, `boxes`, `table`, `states`, `compare`  

#### Pedagogical Whiteboard Mental Model
> Illustrate asyncio event loop coroutine yields, Pydantic JSON schema validations, and Celery asynchronous task distribution across Redis workers.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus | Visual Engine Architecture & Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Advanced Python paradigms: Context managers, Decorators & Generator iterables** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |
| **Block 2** | Days 6–10 | **Asynchronous programming: asyncio event loops, Coroutine tasks & Non-blocking I/O** | Template `sequence`: Animated step-by-step state progression with deterministic tokens. |
| **Block 3** | Days 11–15 | **FastAPI architecture: Path operations, Pydantic type models & Dependency Injection** | Template `boxes`: Animated step-by-step state progression with deterministic tokens. |
| **Block 4** | Days 16–20 | **Database persistence: SQLAlchemy 2.0 Async Session, PostgreSQL & Alembic migrations** | Template `table`: Animated step-by-step state progression with deterministic tokens. |
| **Block 5** | Days 21–25 | **Distributed task execution: Celery workers, Redis message brokers & Background tasks** | Template `states`: Animated step-by-step state progression with deterministic tokens. |
| **Block 6** | Days 26–30 | **Production engineering: Docker containerization, Pytest unit tests & Rate limiters** | Template `compare`: Animated step-by-step state progression with deterministic tokens. |

#### Capstone Milestone Deliverable
* **Milestone Project:** High-Performance Asynchronous FastAPI Service: Production microservice featuring async database connection pooling, background Celery processing, and OpenAPI contracts.

---

### Course 21: [course-quant-systems] Quantitative Engineering & Low-Latency Trading Systems

* **Domain Cluster:** Advanced | **Duration:** 4 Weeks / 30 Days | **Total Quests:** 96 quests  
* **Prefix Mapping:** `quant-systems` (Visuals Dir: `quant-py`)  
* **Visual Suite Status:** ✅ **30/30 Days Complete** (Built in Cert Track)  
* **Measured Lesson Time:** Spoken: **9.4 min** + Interactive: **12 min** = **Total: 21.4 min** (🎯 PERFECT (18–25 min))  
* **Allowed Visual Templates:** `stack-queue`, `table`, `bars`, `flow`, `cells`, `compare`  

#### Pedagogical Whiteboard Mental Model
> Show Limit Order Book (LOB) bid/ask price queues, execution algorithms slicing volume over time, and kernel-bypass zero-copy socket buffer flows.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus | Visual Engine Architecture & Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Market microstructure: Limit Order Books (LOB), Depth of market & Bid-Ask spreads** | Template `stack-queue`: Animated step-by-step state progression with deterministic tokens. |
| **Block 2** | Days 6–10 | **Financial timeseries analytics: Returns, Rolling volatility & Log price transforms** | Template `table`: Animated step-by-step state progression with deterministic tokens. |
| **Block 3** | Days 11–15 | **Algorithmic execution strategies: VWAP, TWAP, Implementation shortfall & Slippage** | Template `bars`: Animated step-by-step state progression with deterministic tokens. |
| **Block 4** | Days 16–20 | **Low-latency system engineering: Zero-copy buffers, Cache locality & Kernel bypass** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |
| **Block 5** | Days 21–25 | **Risk modeling & Portfolio metrics: Value at Risk (VaR), Sharpe Ratio & Max Drawdown** | Template `cells`: Animated step-by-step state progression with deterministic tokens. |
| **Block 6** | Days 26–30 | **High-frequency backtesting engine: Event-driven matching simulation & FIX protocol** | Template `compare`: Animated step-by-step state progression with deterministic tokens. |

#### Capstone Milestone Deliverable
* **Milestone Project:** Microsecond Limit Order Book Matching Engine: High-frequency order matching engine simulating sub-millisecond price-time priority execution and real-time PnL tracking.

---

### Course 22: [course-digital-accounting] Digital Accounting & Taxation (B.Com / BBA)

* **Domain Cluster:** Beginner | **Duration:** 4 Weeks / 30 Days | **Total Quests:** 96 quests  
* **Prefix Mapping:** `bcom-accounting` (Visuals Dir: `bcom-accounting`)  
* **Visual Suite Status:** ⏳ **0/30 Days Needed** (New Generation Required)  
* **Measured Lesson Time:** Spoken: **1 min** + Interactive: **5 min** = **Total: 6 min** (⚠️ EXPANSION TO 18-25 MIN REQUIRED)  
* **Allowed Visual Templates:** `table`, `flow`, `compare`, `bars`, `ledger-sheet`  

#### Pedagogical Whiteboard Mental Model
> Draw double-entry debit/credit ledger columns maintaining balancing equality, 3-way invoice matching flows, and GST tax credit cascading waterfalls.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus | Visual Engine Architecture & Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Accounting equation fundamentals: Assets = Liabilities + Equity & Business Entity rule** | Template `table`: Animated step-by-step state progression with deterministic tokens. |
| **Block 2** | Days 6–10 | **Golden rules of accounting: Real, Personal & Nominal accounts & Journal posting** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |
| **Block 3** | Days 11–15 | **Ledger posting: T-Accounts balancing, Closing balances & Trial Balance checksums** | Template `compare`: Animated step-by-step state progression with deterministic tokens. |
| **Block 4** | Days 16–20 | **Financial reporting: Trading Account, Profit & Loss statement & Balance Sheet layout** | Template `bars`: Animated step-by-step state progression with deterministic tokens. |
| **Block 5** | Days 21–25 | **Taxation architecture: GST Input Tax Credit cascading & TDS statutory deductions** | Template `ledger-sheet`: Animated step-by-step state progression with deterministic tokens. |
| **Block 6** | Days 26–30 | **Modern ERP workflows: Automated bank reconciliations & Suspense account resolution** | Template `table`: Animated step-by-step state progression with deterministic tokens. |

#### Capstone Milestone Deliverable
* **Milestone Project:** Automated Corporate Accounting & GST Audit Engine: End-to-end digital accounting ledger with automated journal entries, balancing trial balances, and GST compliance validation.

---

### Course 23: [course-finance-investment] Business Finance & Investment Management (B.Com / BBA)

* **Domain Cluster:** Beginner | **Duration:** 4 Weeks / 30 Days | **Total Quests:** 96 quests  
* **Prefix Mapping:** `bcom-finance` (Visuals Dir: `bcom-finance`)  
* **Visual Suite Status:** ⏳ **0/30 Days Needed** (New Generation Required)  
* **Measured Lesson Time:** Spoken: **1 min** + Interactive: **5 min** = **Total: 6 min** (⚠️ EXPANSION TO 18-25 MIN REQUIRED)  
* **Allowed Visual Templates:** `table`, `bars`, `flow`, `compare`  

#### Pedagogical Whiteboard Mental Model
> Visualize Discounted Cash Flow (DCF) timelines, DuPont 3-stage ROE breakdowns, and debt vs equity cost weights in WACC capital structure models.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus | Visual Engine Architecture & Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Time Value of Money (TVM): Present Value, Future Value & Compounding schedules** | Template `table`: Animated step-by-step state progression with deterministic tokens. |
| **Block 2** | Days 6–10 | **Capital budgeting evaluation: Net Present Value (NPV), IRR & Payback period hurdles** | Template `bars`: Animated step-by-step state progression with deterministic tokens. |
| **Block 3** | Days 11–15 | **Cost of Capital: Weighted Average Cost of Capital (WACC) & Optimal Debt-Equity mix** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |
| **Block 4** | Days 16–20 | **Working capital dynamics: Cash Conversion Cycle, Operating cycle & Liquidity ratios** | Template `compare`: Animated step-by-step state progression with deterministic tokens. |
| **Block 5** | Days 21–25 | **Corporate Valuation: DCF terminal values, Multiples analysis & DuPont 3-stage ROE** | Template `table`: Animated step-by-step state progression with deterministic tokens. |
| **Block 6** | Days 26–30 | **Modern Portfolio Theory: Efficient frontier, Sharpe ratio & Beta risk sensitivity** | Template `bars`: Animated step-by-step state progression with deterministic tokens. |

#### Capstone Milestone Deliverable
* **Milestone Project:** Corporate Financial Valuation & Investment Model: Comprehensive DCF valuation model with dynamic WACC sensitivity matrices, scenario planning, and working capital forecasts.

---

### Course 24: [course-business-analytics] Business Analytics & Decision Intelligence (B.Com / BBA / MBA)

* **Domain Cluster:** Beginner | **Duration:** 4 Weeks / 30 Days | **Total Quests:** 96 quests  
* **Prefix Mapping:** `bcom_ana` (Visuals Dir: `bcom_ana`)  
* **Visual Suite Status:** ⏳ **0/30 Days Needed** (New Generation Required)  
* **Measured Lesson Time:** Spoken: **1 min** + Interactive: **5 min** = **Total: 6 min** (⚠️ EXPANSION TO 18-25 MIN REQUIRED)  
* **Allowed Visual Templates:** `bars`, `table`, `flow`, `compare`  

#### Pedagogical Whiteboard Mental Model
> Show descriptive distribution curves, Pareto 80/20 ABC classification breakdowns, and linear regression trendlines against executive scorecard KPIs.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus | Visual Engine Architecture & Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Data-driven decision framework: Descriptive statistics, Mean, Median & Standard deviation** | Template `bars`: Animated step-by-step state progression with deterministic tokens. |
| **Block 2** | Days 6–10 | **Data distributions: Normal curves, Skewness, Outlier detection & Interquartile range** | Template `table`: Animated step-by-step state progression with deterministic tokens. |
| **Block 3** | Days 11–15 | **Business KPI architecture: Balanced scorecards, Attribution & Performance variance** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |
| **Block 4** | Days 16–20 | **Predictive analytics: Simple & Multiple OLS Linear regression & Trend forecasting** | Template `compare`: Animated step-by-step state progression with deterministic tokens. |
| **Block 5** | Days 21–25 | **Classification & Segmentation: Customer RFM analysis & Logistic regression odds** | Template `bars`: Animated step-by-step state progression with deterministic tokens. |
| **Block 6** | Days 26–30 | **Executive data storytelling: Automated KPI dashboards & Decision intelligence reports** | Template `table`: Animated step-by-step state progression with deterministic tokens. |

#### Capstone Milestone Deliverable
* **Milestone Project:** Executive Business Intelligence & Decision Dashboard: End-to-end analytics report synthesizing customer segmentation, revenue regression forecasts, and automated KPI alert metrics.

---

### Course 25: [course-marketing-branding] Marketing & Brand Management (B.Com / BBA / MBA)

* **Domain Cluster:** Beginner | **Duration:** 4 Weeks / 30 Days | **Total Quests:** 96 quests  
* **Prefix Mapping:** `bcom-marketing` (Visuals Dir: `bcom-marketing`)  
* **Visual Suite Status:** ⏳ **0/30 Days Needed** (New Generation Required)  
* **Measured Lesson Time:** Spoken: **1 min** + Interactive: **5 min** = **Total: 6 min** (⚠️ EXPANSION TO 18-25 MIN REQUIRED)  
* **Allowed Visual Templates:** `flow`, `compare`, `table`, `bars`  

#### Pedagogical Whiteboard Mental Model
> Map customer journey stages, Keller brand equity pyramid levels, BCG growth-share matrix quadrants, and omnichannel campaign ROI bar charts.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus | Visual Engine Architecture & Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Strategic marketing foundations: 4Ps Marketing Mix, STP & Porter’s Five Forces** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |
| **Block 2** | Days 6–10 | **Consumer psychology: Cognitive decision journey, Perception biases & Social proof** | Template `compare`: Animated step-by-step state progression with deterministic tokens. |
| **Block 3** | Days 11–15 | **Brand identity architecture: Brand personality, Archetypes & Keller’s Brand Equity** | Template `table`: Animated step-by-step state progression with deterministic tokens. |
| **Block 4** | Days 16–20 | **Product portfolio management: Boston Consulting Group (BCG) Matrix & Product Life Cycle** | Template `bars`: Animated step-by-step state progression with deterministic tokens. |
| **Block 5** | Days 21–25 | **Integrated Marketing Communications (IMC): Omnichannel messaging & Content strategies** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |
| **Block 6** | Days 26–30 | **Marketing performance measurement: Customer Lifetime Value (CLV) & Brand sentiment** | Template `compare`: Animated step-by-step state progression with deterministic tokens. |

#### Capstone Milestone Deliverable
* **Milestone Project:** Comprehensive Brand Strategy & Go-To-Market Blueprint: Multi-channel brand positioning framework complete with customer persona journeys, messaging matrices, and ROI forecasts.

---

### Course 26: [course-digital-marketing] Digital Marketing & Growth Strategy (B.Com / BBA / MBA)

* **Domain Cluster:** Beginner | **Duration:** 4 Weeks / 30 Days | **Total Quests:** 96 quests  
* **Prefix Mapping:** `bcom_dmkt` (Visuals Dir: `bcom_dmkt`)  
* **Visual Suite Status:** ⏳ **0/30 Days Needed** (New Generation Required)  
* **Measured Lesson Time:** Spoken: **1 min** + Interactive: **5 min** = **Total: 6 min** (⚠️ EXPANSION TO 18-25 MIN REQUIRED)  
* **Allowed Visual Templates:** `flow`, `bars`, `table`, `compare`, `funnel`  

#### Pedagogical Whiteboard Mental Model
> Diagram conversion funnel drop-off waterfalls, ad auction rank bid vs quality score calculations, and CAC payback period bar comparisons.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus | Visual Engine Architecture & Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Digital acquisition landscape: Inbound vs Outbound & Customer acquisition funnels** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |
| **Block 2** | Days 6–10 | **Search Engine Optimization (SEO): Crawl budgets, Technical SEO, On-page & Backlinks** | Template `bars`: Animated step-by-step state progression with deterministic tokens. |
| **Block 3** | Days 11–15 | **Search Engine Marketing (SEM): Google Ads auction mechanics, Quality Score & CPC bidding** | Template `table`: Animated step-by-step state progression with deterministic tokens. |
| **Block 4** | Days 16–20 | **Paid Social Advertising: Meta Ad pixel tracking, Lookalike audiences & ROAS targets** | Template `compare`: Animated step-by-step state progression with deterministic tokens. |
| **Block 5** | Days 21–25 | **Email marketing automation: Behavioral drip sequences, Open rate & Churn telemetry** | Template `funnel`: Animated step-by-step state progression with deterministic tokens. |
| **Block 6** | Days 26–30 | **Growth analytics: Multi-touch attribution models, A/B testing & CAC-to-LTV payback** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |

#### Capstone Milestone Deliverable
* **Milestone Project:** Growth Marketing & Performance Campaign Architecture: Complete multi-channel digital acquisition campaign with SEO keyword architecture, ad auction bidding models, and CAC/LTV funnels.

---

### Course 27: [course-ecommerce-digital-biz] E-Commerce & Digital Business (B.Com / BBA / MBA)

* **Domain Cluster:** Beginner | **Duration:** 4 Weeks / 30 Days | **Total Quests:** 96 quests  
* **Prefix Mapping:** `bcom_ecom` (Visuals Dir: `bcom_ecom`)  
* **Visual Suite Status:** ⏳ **0/30 Days Needed** (New Generation Required)  
* **Measured Lesson Time:** Spoken: **1 min** + Interactive: **5 min** = **Total: 6 min** (⚠️ EXPANSION TO 18-25 MIN REQUIRED)  
* **Allowed Visual Templates:** `flow`, `table`, `sequence`, `bars`, `compare`, `funnel`  

#### Pedagogical Whiteboard Mental Model
> Illustrate e-commerce checkout conversion funnels, payment gateway authorization handshakes, and dimensional weight shipping cost calculations.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus | Visual Engine Architecture & Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **E-Commerce business models: Direct-to-Consumer (D2C), B2B & Multi-vendor marketplaces** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |
| **Block 2** | Days 6–10 | **Product catalog engineering: Parent-child SKU variants, Attributes & Inventory sync** | Template `table`: Animated step-by-step state progression with deterministic tokens. |
| **Block 3** | Days 11–15 | **Checkout optimization: Cart abandonment mitigation, Payment gateways & Webhooks** | Template `sequence`: Animated step-by-step state progression with deterministic tokens. |
| **Block 4** | Days 16–20 | **Supply chain fulfillment: 3PL logistics, Dimensional weight & Last-mile delivery** | Template `bars`: Animated step-by-step state progression with deterministic tokens. |
| **Block 5** | Days 21–25 | **Marketplace scaling: Amazon Buy Box algorithms, Seller metrics & Commission fees** | Template `compare`: Animated step-by-step state progression with deterministic tokens. |
| **Block 6** | Days 26–30 | **Cross-border digital commerce: Currency localization, Duties, Taxes & Compliance** | Template `funnel`: Animated step-by-step state progression with deterministic tokens. |

#### Capstone Milestone Deliverable
* **Milestone Project:** Scalable E-Commerce Operations Blueprint: Full operational framework for high-volume digital commerce, including SKU catalog architecture, checkout conversion funnels, and logistics routing.

---

### Course 28: [course-entrepreneurship-biz-mgmt] Entrepreneurship & Business Management (B.Com / BBA / MBA)

* **Domain Cluster:** Beginner | **Duration:** 4 Weeks / 30 Days | **Total Quests:** 96 quests  
* **Prefix Mapping:** `bcom_ent` (Visuals Dir: `bcom_ent`)  
* **Visual Suite Status:** ⏳ **0/30 Days Needed** (New Generation Required)  
* **Measured Lesson Time:** Spoken: **1 min** + Interactive: **5 min** = **Total: 6 min** (⚠️ EXPANSION TO 18-25 MIN REQUIRED)  
* **Allowed Visual Templates:** `flow`, `table`, `compare`, `bars`  

#### Pedagogical Whiteboard Mental Model
> Show Business Model Canvas component linkages, bottom-up TAM/SAM/SOM concentric circles, equity dilution round-by-round cap tables, and monthly burn rate runway curves.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus | Visual Engine Architecture & Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Entrepreneurial mindset, Problem-Solution fit & Lean Startup iterative hypothesis** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |
| **Block 2** | Days 6–10 | **Business Model Canvas (BMC): Revenue streams, Cost structures & Value propositions** | Template `table`: Animated step-by-step state progression with deterministic tokens. |
| **Block 3** | Days 11–15 | **Market opportunity sizing: Total Addressable Market (TAM, SAM, SOM) calculation** | Template `compare`: Animated step-by-step state progression with deterministic tokens. |
| **Block 4** | Days 16–20 | **Startup financial modeling: Unit economics, Burn rate & Cash runway forecasting** | Template `bars`: Animated step-by-step state progression with deterministic tokens. |
| **Block 5** | Days 21–25 | **Venture financing mechanics: Term sheets, Convertible notes, SAFEs & Cap table dilution** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |
| **Block 6** | Days 26–30 | **Operational scaling: Hiring frameworks, Agile organizational design & Milestone gates** | Template `table`: Animated step-by-step state progression with deterministic tokens. |

#### Capstone Milestone Deliverable
* **Milestone Project:** Venture Creation & Investor-Ready Business Plan: Comprehensive startup plan featuring validated Business Model Canvas, bottom-up market sizing, unit economics, and 5-year pro forma financials.

---

### Course 29: [course-sales-crm-success] Sales, Customer Success & CRM (B.Com / BBA / MBA)

* **Domain Cluster:** Beginner | **Duration:** 4 Weeks / 30 Days | **Total Quests:** 96 quests  
* **Prefix Mapping:** `bcom_scrm` (Visuals Dir: `bcom_scrm`)  
* **Visual Suite Status:** ⏳ **0/30 Days Needed** (New Generation Required)  
* **Measured Lesson Time:** Spoken: **1 min** + Interactive: **5 min** = **Total: 6 min** (⚠️ EXPANSION TO 18-25 MIN REQUIRED)  
* **Allowed Visual Templates:** `flow`, `table`, `states`, `bars`, `compare`, `funnel`  

#### Pedagogical Whiteboard Mental Model
> Diagram sales velocity formula components, MEDDIC qualification scorecards, lead-to-opportunity state progression, and customer health score distributions.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus | Visual Engine Architecture & Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Modern B2B sales methodologies: Consultative selling, Challenger sales & Inbound leads** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |
| **Block 2** | Days 6–10 | **Opportunity qualification frameworks: BANT (Budget, Authority, Need, Timing) & MEDDIC** | Template `table`: Animated step-by-step state progression with deterministic tokens. |
| **Block 3** | Days 11–15 | **Sales pipeline mechanics: Deal stages, Probability weightings & Sales Velocity formula** | Template `states`: Animated step-by-step state progression with deterministic tokens. |
| **Block 4** | Days 16–20 | **CRM systems architecture: Lead routing workflows, Activity tracking & Pipeline automation** | Template `bars`: Animated step-by-step state progression with deterministic tokens. |
| **Block 5** | Days 21–25 | **Commercial negotiation: Objection handling frameworks, Value selling & Closing tactics** | Template `compare`: Animated step-by-step state progression with deterministic tokens. |
| **Block 6** | Days 26–30 | **Customer Success & Retention: Net Retention Rate (NRR), Churn telemetry & Health scores** | Template `funnel`: Animated step-by-step state progression with deterministic tokens. |

#### Capstone Milestone Deliverable
* **Milestone Project:** Enterprise B2B Sales & CRM Operational Playbook: Configured CRM pipeline architecture with automated MEDDIC qualification scoring, sales velocity tracking, and retention playbooks.

---

### Course 30: [course-operations-supplychain-compliance] Operations, Supply Chain & Business Compliance (B.Com / BBA / MBA)

* **Domain Cluster:** Beginner | **Duration:** 4 Weeks / 30 Days | **Total Quests:** 96 quests  
* **Prefix Mapping:** `bcom_ops` (Visuals Dir: `bcom_ops`)  
* **Visual Suite Status:** ⏳ **0/30 Days Needed** (New Generation Required)  
* **Measured Lesson Time:** Spoken: **1 min** + Interactive: **5 min** = **Total: 6 min** (⚠️ EXPANSION TO 18-25 MIN REQUIRED)  
* **Allowed Visual Templates:** `flow`, `table`, `bars`, `compare`  

#### Pedagogical Whiteboard Mental Model
> Draw SIPOC value stream process flows, Economic Order Quantity (EOQ) cost trade-off curves, Kraljic matrix supplier quadrants, and Six Sigma defect distributions.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus | Visual Engine Architecture & Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Operations strategy: Process architecture, Capacity planning & Bottleneck identification** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |
| **Block 2** | Days 6–10 | **Value Stream Mapping: SIPOC diagrams, Lead time reduction & Waste elimination (Muda)** | Template `table`: Animated step-by-step state progression with deterministic tokens. |
| **Block 3** | Days 11–15 | **Inventory optimization: Economic Order Quantity (EOQ), Safety stock & Reorder points** | Template `bars`: Animated step-by-step state progression with deterministic tokens. |
| **Block 4** | Days 16–20 | **Strategic procurement: Kraljic purchasing portfolio matrix & Vendor SLA evaluations** | Template `compare`: Animated step-by-step state progression with deterministic tokens. |
| **Block 5** | Days 21–25 | **Total Quality Management (TQM): Six Sigma DMAIC cycle, Statistical process control & Kaizen** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |
| **Block 6** | Days 26–30 | **Business compliance: Supply chain ethics, ISO certifications & Regulatory audit governance** | Template `table`: Animated step-by-step state progression with deterministic tokens. |

#### Capstone Milestone Deliverable
* **Milestone Project:** End-to-End Supply Chain Optimization Plan: Operations master plan featuring value stream mapping, automated EOQ inventory replenishment models, and supplier quality audits.

---

### Course 31: [course-ai-digital-transformation] AI & Digital Transformation for Business (B.Com / BBA / MBA)

* **Domain Cluster:** Beginner | **Duration:** 4 Weeks / 30 Days | **Total Quests:** 96 quests  
* **Prefix Mapping:** `bcom_ait` (Visuals Dir: `bcom_ait`)  
* **Visual Suite Status:** ⏳ **0/30 Days Needed** (New Generation Required)  
* **Measured Lesson Time:** Spoken: **1 min** + Interactive: **5 min** = **Total: 6 min** (⚠️ EXPANSION TO 18-25 MIN REQUIRED)  
* **Allowed Visual Templates:** `workflow`, `flow`, `table`, `compare`, `bars`  

#### Pedagogical Whiteboard Mental Model
> Illustrate enterprise AI value creation frameworks, RPA bot automation process flows, AI governance risk-level classifications, and digital maturity phase roadmaps.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus | Visual Engine Architecture & Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Digital Transformation imperatives: Legacy modernization vs Digital-first paradigms** | Template `workflow`: Animated step-by-step state progression with deterministic tokens. |
| **Block 2** | Days 6–10 | **Enterprise AI Value Equation: Cost reduction, Revenue acceleration & Customer experience** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |
| **Block 3** | Days 11–15 | **Robotic Process Automation (RPA): Workflow orchestration & Repetitive task bot automation** | Template `table`: Animated step-by-step state progression with deterministic tokens. |
| **Block 4** | Days 16–20 | **Generative AI workplace deployment: Departmental copilot adoption & Prompt standards** | Template `compare`: Animated step-by-step state progression with deterministic tokens. |
| **Block 5** | Days 21–25 | **AI Governance & Ethics: Bias auditing, Privacy protection, IP safety & EU AI Act compliance** | Template `bars`: Animated step-by-step state progression with deterministic tokens. |
| **Block 6** | Days 26–30 | **Organizational Change Management: Cultural readiness, Upskilling roadmaps & ROI dashboards** | Template `workflow`: Animated step-by-step state progression with deterministic tokens. |

#### Capstone Milestone Deliverable
* **Milestone Project:** Enterprise AI Transformation Roadmap & Governance Charter: Multi-year digital transformation strategic roadmap with departmental RPA automation blueprints and ethical AI policies.

---

### Course 32: [course-computer-fundamentals] Computer Literacy, Digital Productivity & OS Fundamentals

* **Domain Cluster:** Beginner | **Duration:** 4 Weeks / 30 Days | **Total Quests:** 96 quests  
* **Prefix Mapping:** `comp_fund` (Visuals Dir: `comp_fund`)  
* **Visual Suite Status:** ⏳ **0/30 Days Needed** (New Generation Required)  
* **Measured Lesson Time:** Spoken: **1 min** + Interactive: **5 min** = **Total: 6 min** (⚠️ EXPANSION TO 18-25 MIN REQUIRED)  
* **Allowed Visual Templates:** `flow`, `boxes`, `tree-graph`, `table`, `compare`  

#### Pedagogical Whiteboard Mental Model
> Diagram Input-Process-Output CPU bus flows, Unix command pipe data streams, file system inode permission trees, and TCP/IP 4-layer packet traversals.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus | Visual Engine Architecture & Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Computer architecture: CPU registers, Arithmetic Logic Unit (ALU), RAM & Bus topology** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |
| **Block 2** | Days 6–10 | **Operating Systems fundamentals: Kernel mode vs User mode, System calls & Process threads** | Template `boxes`: Animated step-by-step state progression with deterministic tokens. |
| **Block 3** | Days 11–15 | **POSIX Command Line: Terminal navigation, File permissions (chmod/chown) & Pipe redirection** | Template `tree-graph`: Animated step-by-step state progression with deterministic tokens. |
| **Block 4** | Days 16–20 | **Memory and storage hierarchy: L1/L2/L3 CPU Caches, Virtual memory paging & RAID arrays** | Template `table`: Animated step-by-step state progression with deterministic tokens. |
| **Block 5** | Days 21–25 | **Computer networking basics: TCP/IP 4-layer model, IPv4 subnetting, DNS & Port routing** | Template `compare`: Animated step-by-step state progression with deterministic tokens. |
| **Block 6** | Days 26–30 | **Digital security & System health: Process monitoring, SSH keys & Preventive maintenance** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |

#### Capstone Milestone Deliverable
* **Milestone Project:** Systems Administration & Networking Verification Suite: Practical command-line and systems automation project demonstrating process monitoring, shell scripting, and network diagnostics.

---

### Course 33: [course-ai-prompt-literacy] Everyday AI Literacy & Prompt Engineering

* **Domain Cluster:** Beginner | **Duration:** 4 Weeks / 30 Days | **Total Quests:** 96 quests  
* **Prefix Mapping:** `ai_prompt` (Visuals Dir: `prompt-py`)  
* **Visual Suite Status:** ✅ **30/30 Days Complete** (Built in Cert Track)  
* **Measured Lesson Time:** Spoken: **9.2 min** + Interactive: **12 min** = **Total: 21.2 min** (🎯 PERFECT (18–25 min))  
* **Allowed Visual Templates:** `flow`, `compare`, `boxes`, `table`, `bars`  

#### Pedagogical Whiteboard Mental Model
> Show prompt before/after optimization comparisons, Chain-of-Thought reasoning step paths, temperature sampling spaces, and fact-checking verification scorecards.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus | Visual Engine Architecture & Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Generative AI mechanics: Probabilistic language modeling, Tokens & Prediction spaces** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |
| **Block 2** | Days 6–10 | **Prompt structuring foundations: Context, Persona, Instruction & Constraint frameworks** | Template `compare`: Animated step-by-step state progression with deterministic tokens. |
| **Block 3** | Days 11–15 | **Advanced prompting techniques: Few-shot examples, Chain-of-Thought (CoT) & Decomposition** | Template `boxes`: Animated step-by-step state progression with deterministic tokens. |
| **Block 4** | Days 16–20 | **Multimodal AI capabilities: Text-to-image prompting, Audio transcription & Visual analysis** | Template `table`: Animated step-by-step state progression with deterministic tokens. |
| **Block 5** | Days 21–25 | **Workplace productivity automation: Research synthesis, Executive drafting & Data extraction** | Template `bars`: Animated step-by-step state progression with deterministic tokens. |
| **Block 6** | Days 26–30 | **Cognitive guardrails: Hallucination identification, Source grounding & Ethical evaluation** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |

#### Capstone Milestone Deliverable
* **Milestone Project:** Master Prompt Engineering Playbook: Production-grade collection of verified, structured prompt templates for workplace research, communication, data analysis, and validation.

---

### Course 34: [course-excel-data-viz] Excel & Data Analysis Fundamentals

* **Domain Cluster:** Beginner | **Duration:** 4 Weeks / 30 Days | **Total Quests:** 96 quests  
* **Prefix Mapping:** `excel_viz` (Visuals Dir: `excel_viz`)  
* **Visual Suite Status:** ⏳ **0/30 Days Needed** (New Generation Required)  
* **Measured Lesson Time:** Spoken: **1 min** + Interactive: **5 min** = **Total: 6 min** (⚠️ EXPANSION TO 18-25 MIN REQUIRED)  
* **Allowed Visual Templates:** `table`, `cells`, `bars`, `compare`, `flow`  

#### Pedagogical Whiteboard Mental Model
> Illustrate 2D grid cell referencing, XLOOKUP array search traversals, Pivot Table multidimensional aggregations, and executive waterfall chart components.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus | Visual Engine Architecture & Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Spreadsheet grid architecture: 2D coordinate referencing, Absolute ($) vs Relative locks** | Template `table`: Animated step-by-step state progression with deterministic tokens. |
| **Block 2** | Days 6–10 | **Statistical functions: SUM, AVERAGE, COUNT, MIN/MAX & Weighted average calculations** | Template `cells`: Animated step-by-step state progression with deterministic tokens. |
| **Block 3** | Days 11–15 | **Logical evaluations: Single IF, Nested IF statements & Multi-condition AND/OR formulas** | Template `bars`: Animated step-by-step state progression with deterministic tokens. |
| **Block 4** | Days 16–20 | **Text sanitization & Date calculations: TRIM, CLEAN, TEXTJOIN, CONCAT & DATEDIF math** | Template `compare`: Animated step-by-step state progression with deterministic tokens. |
| **Block 5** | Days 21–25 | **Lookup & Reference functions: Classic VLOOKUP vs Modern XLOOKUP & 2-Way INDEX-MATCH** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |
| **Block 6** | Days 26–30 | **Data visualization & Reporting: Pivot Tables, Multi-dimensional slicing & Executive charts** | Template `table`: Animated step-by-step state progression with deterministic tokens. |

#### Capstone Milestone Deliverable
* **Milestone Project:** Executive Financial & Operational Excel Model: Fully automated corporate spreadsheet workbook featuring dynamic XLOOKUP models, Pivot Table aggregations, and executive visual dashboards.

---

### Course 35: [course-git-version-control] Git, GitHub & Version Control Basics

* **Domain Cluster:** Beginner | **Duration:** 4 Weeks / 30 Days | **Total Quests:** 96 quests  
* **Prefix Mapping:** `git_vcs` (Visuals Dir: `git_vcs`)  
* **Visual Suite Status:** ⏳ **0/30 Days Needed** (New Generation Required)  
* **Measured Lesson Time:** Spoken: **1 min** + Interactive: **5 min** = **Total: 6 min** (⚠️ EXPANSION TO 18-25 MIN REQUIRED)  
* **Allowed Visual Templates:** `tree-graph`, `flow`, `states`, `compare`, `boxes`  

#### Pedagogical Whiteboard Mental Model
> Draw 3-tier Git architecture (Working directory -> Staging -> Repository), Directed Acyclic Graph (DAG) commit trees, and 3-way merge conflict marker resolutions.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus | Visual Engine Architecture & Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Version control architecture: Working Directory, Staging Area (Index) & Local Repository** | Template `tree-graph`: Animated step-by-step state progression with deterministic tokens. |
| **Block 2** | Days 6–10 | **Core versioning operations: Commit SHA hashes, Atomic commits, Git log & History inspection** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |
| **Block 3** | Days 11–15 | **Branching dynamics: Pointer movements, Fast-forward merges & Feature branch isolation** | Template `states`: Animated step-by-step state progression with deterministic tokens. |
| **Block 4** | Days 16–20 | **Branch reconciliation: 3-way merge algorithms, Merge conflict resolution & Interactive rebase** | Template `compare`: Animated step-by-step state progression with deterministic tokens. |
| **Block 5** | Days 21–25 | **Remote collaboration: Git remotes, Push/Pull mechanics, Upstream tracking & Fetching** | Template `boxes`: Animated step-by-step state progression with deterministic tokens. |
| **Block 6** | Days 26–30 | **GitHub team workflows: Pull requests, Code review etiquettes, Branch protection & Tags** | Template `tree-graph`: Animated step-by-step state progression with deterministic tokens. |

#### Capstone Milestone Deliverable
* **Milestone Project:** Multi-Branch Collaborative Repository Simulation: Realistic engineering project demonstrating trunk-based branching, clean rebase histories, resolved merge conflicts, and peer-reviewed PRs.

---

### Course 36: [course-softskills-communication] Professional Tech Communication & Interview Mastery

* **Domain Cluster:** Beginner | **Duration:** 4 Weeks / 30 Days | **Total Quests:** 96 quests  
* **Prefix Mapping:** `soft-skills` (Visuals Dir: `soft-skills`)  
* **Visual Suite Status:** ⏳ **0/30 Days Needed** (New Generation Required)  
* **Measured Lesson Time:** Spoken: **1 min** + Interactive: **5 min** = **Total: 6 min** (⚠️ EXPANSION TO 18-25 MIN REQUIRED)  
* **Allowed Visual Templates:** `flow`, `compare`, `table`, `states`  

#### Pedagogical Whiteboard Mental Model
> Diagram Minto Pyramid top-down communication hierarchies, STAR method (Situation, Task, Action, Result) storytelling flows, and email tone before/after comparison tables.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus | Visual Engine Architecture & Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Foundations of technical communication: Clarity, Conciseness & The BLUF principle** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |
| **Block 2** | Days 6–10 | **Structured thinking models: Minto Pyramid, MECE principle & Executive summaries** | Template `compare`: Animated step-by-step state progression with deterministic tokens. |
| **Block 3** | Days 11–15 | **Professional written correspondence: High-impact emails, Slack etiquette & Documentation** | Template `table`: Animated step-by-step state progression with deterministic tokens. |
| **Block 4** | Days 16–20 | **Verbal presentations: Agile standup updates, Technical demos & Slide design principles** | Template `states`: Animated step-by-step state progression with deterministic tokens. |
| **Block 5** | Days 21–25 | **Interpersonal dynamics: Active listening, Constructive feedback loops & Conflict de-escalation** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |
| **Block 6** | Days 26–30 | **Interview mastery: The STAR method, Behavioral question responses & Salary negotiation** | Template `compare`: Animated step-by-step state progression with deterministic tokens. |

#### Capstone Milestone Deliverable
* **Milestone Project:** Executive Career Portfolio & Interview Masterclass: Comprehensive career communication asset package featuring structured technical project demos, STAR behavioral interview decks, and executive writing samples.

---

### Course 37: [course-nlp] Natural Language Processing & Computational Linguistics

* **Domain Cluster:** Advanced | **Duration:** 4 Weeks / 30 Days | **Total Quests:** 96 quests  
* **Prefix Mapping:** `nlp` (Visuals Dir: `nlp-py`)  
* **Visual Suite Status:** ✅ **30/30 Days Complete** (Built in Cert Track)  
* **Measured Lesson Time:** Spoken: **9.5 min** + Interactive: **12 min** = **Total: 21.5 min** (🎯 PERFECT (18–25 min))  
* **Allowed Visual Templates:** `letters`, `cells`, `table`, `flow`, `bars`, `tree-graph`  

#### Pedagogical Whiteboard Mental Model
> Show token sequence sliding windows, word embedding vector spaces with cosine distance, and Transformer Query-Key-Value self-attention matrix products.

#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)

| Block | Day Range | Real Curriculum Focus | Visual Engine Architecture & Bindings |
| :---: | :---: | :--- | :--- |
| **Block 1** | Days 1–5 | **Text preprocessing pipelines: Unicode normalization, Tokenization, Stemming & Lemmatization** | Template `letters`: Animated step-by-step state progression with deterministic tokens. |
| **Block 2** | Days 6–10 | **Statistical representation: Bag-of-Words, N-grams & Term Frequency-Inverse Document Frequency** | Template `cells`: Animated step-by-step state progression with deterministic tokens. |
| **Block 3** | Days 11–15 | **Distributed vector embeddings: Continuous Bag of Words (CBOW), Skip-gram & Word2Vec geometry** | Template `table`: Animated step-by-step state progression with deterministic tokens. |
| **Block 4** | Days 16–20 | **Sequence modeling: Recurrent Neural Networks (RNN), Hidden states & LSTM/GRU gating mechanisms** | Template `flow`: Animated step-by-step state progression with deterministic tokens. |
| **Block 5** | Days 21–25 | **Transformer architecture: Scaled dot-product Self-Attention, Multi-head matrices & Positional encodings** | Template `bars`: Animated step-by-step state progression with deterministic tokens. |
| **Block 6** | Days 26–30 | **Computational language applications: Named Entity Recognition (NER), Sentiment scoring & Summarization** | Template `tree-graph`: Animated step-by-step state progression with deterministic tokens. |

#### Capstone Milestone Deliverable
* **Milestone Project:** Production Natural Language Processing Engine: End-to-end computational linguistic pipeline performing text preprocessing, TF-IDF/Dense embedding extraction, and sentiment/NER classification.

---

## 🚀 6. Phased Implementation Plan for the 24 Standalone Courses

To elevate all 24 standalone courses to the **18–25 minute standard** and equip them with **100% Gate v2 compliant visual suites**, execution proceeds in structured phases:

### Phase 1: LongLesson Curriculum Expansion (Days 1–30)
* Author 6-part LongLessons for the 23 legacy pilot courses, expanding each day's content to **1,200–1,500 words** across `title`, `say`, `example`, `code`, `tryIt`, and `check`.
* Enforce that every expanded day verifies at **18.0 to 24.5 minutes** using `estimateLessonMinutes`.

### Phase 2: Visual Suite Generation in 5-Day Atomic Blocks
* Generate visual suites for the 24 courses across 144 blocks (24 courses &times; 6 blocks = 720 days).
* Every 5-day block undergoes Gate v2 audit (R1–R14) with immediate in-situ remediation until `PASS 5/6` or `PASS 6/6`.

### Phase 3: Runtime Verification & Full Matrix Release
* Run `simulate-student-view.mts` across all 1,110 days.
* Ensure 0 broken bindings, 0 render crashes, and full release in `enabledCourses.ts`.

