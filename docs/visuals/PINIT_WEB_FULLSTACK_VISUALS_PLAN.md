# PinIT Web Full-Stack Certification: Lesson Visuals for All 12 Courses

**Scope:** Every lesson part of every course in the Web Full-Stack certification plans:

| Plan | Courses Included | Certification Focus |
| :--- | :--- | :--- |
| **1 month** | Course 1 (Frontend Architecture) | React, Next.js & Modern UI |
| **3 months** | Courses 1–3 | Full-Stack Node.js, TypeScript & PostgreSQL |
| **6 months** | Courses 1–6 | Algorithms, DevOps, CI/CD & AWS Cloud |
| **9 months** | Courses 1–9 | Distributed Systems, Cybersecurity & Applied AI |
| **12 months** | Courses 1–12 | Multi-Cloud SRE, Streaming & AI Deployment |

**Total Program Volume:** 12 courses &times; 30 days &times; 6 parts = **2,160 lesson parts**.  
**Builder:** Antigravity. **Reviewer:** Claude. **Approver:** The Owner.  
**Version:** 2.0 (Masterclass Production Edition), 8 October 2026. Built on the proven architecture of `PINIT_PY_CERT_VISUALS_PLAN.pdf`.  
**Generated PDF Artifact:** `docs/visuals/PINIT_WEB_FULLSTACK_VISUALS_PLAN.pdf` (197 Pages, 9.78 MB).

---

## 🏛️ Contents
1. **Part A. For the owner (read only this part)**
   - A1. What students get: The Golden Triad (Content &harr; Output &harr; Visuals)
   - A2. Release order and Plan Milestones (M-1m through M-12m)
   - A3. Why this plan avoids past mistakes
   - A4. How you check progress without coding
   - A5. Total size of the work
2. **Part B. Antigravity's past mistakes and the rules that now prevent each**
3. **Part C. The system (what the engine does)**
   - C1. Picture templates (14 templates in total, including 3 new Web templates)
   - C2. Where the values come from (TypeScript, React, HTTP & SQL bindings)
   - C3. File layout and directory architecture
   - C4. The generator pipeline (`npm run visuals:generate`)
   - C5. Gate v2: 14 strict rules checked automatically in CI for every day file
   - C6. Change & Run: How students play with code and watch diagrams re-animate live
   - C7. Release switch architecture (`enabledCourses.ts`)
   - C8. Building further without rework
4. **Part D. Allowed templates per course & pedagogical whiteboard models (Months 1–12)**
5. **Part E. Tasks breakdown**
   - Phase 0: Safety & Scope (4 tasks)
   - Phase 1: Engine Buildout (23 tasks)
   - Phase 2: Content Generation (357 daily tasks + 72 checkpoints + 12 releases + 5 milestones)
6. **Part F. How Claude reviews each task**
7. **Part G. Master task registry summary across all 12 courses**

---

## 🌟 Part A. For the Owner (Read Only This Part)

### A1. What students get: The Golden Triad
When a student learns full-stack engineering, abstract text and code alone cause high drop-off rates.
Every lesson part that can be clarified with a diagram gets one on the left of the lesson player.
The picture moves step by step with the teacher's voice.

#### The Golden Triad: Content &harr; Output &harr; Visuals
1. **Visuals connected to Content:** Every diagram step corresponds directly to what the teacher is saying in that exact sentence (the `say` line). When the teacher explains component state updating, the diagram highlights that exact component.
2. **Content connected to Output:** Every lesson shows runnable code and its exact real-world console or terminal output.
3. **Output connected to Visuals:** The numbers, variable names, HTTP status codes, and DOM text in the picture are **never typed by an AI**. They come from actually compiling and running the code in a sandbox. A picture can never display an incorrect value.
4. **Change & Run:** When a student modifies the code in the browser editor and clicks *Run*, the engine re-runs the code, re-extracts the bindings, and smoothly re-animates the diagram using the student's own values.

A part where no diagram would genuinely aid comprehension receives `none`. A confusing diagram is worse than none.

### A2. Release order

| Milestone | Courses That Must Be Finished | Plan Unlocked for Students |
| :--- | :--- | :--- |
| **M-1m** | 1. React Frontend Architecture (`react-basics`) | 1-month Fast-Track Sprint |
| **M-3m** | + 2. Node.js Backend (`node-web`), 3. Databases / SQL (`sql-mastery`) | 3-month Career Accelerator |
| **M-6m** | + 4. System DSA (`dsa-optim`), 5. DevOps (`devops`), 6. Cloud Native (`cloud`) | 6-month Professional Program |
| **M-9m** | + 7. Distributed Systems (`dist`), 8. Cybersecurity (`cyber`), 9. AI Integration (`ai`) | 9-month Master Program |
| **M-12m** | + 10. Multi-Cloud SRE (`sre-web`), 11. Streaming (`stream-web`), 12. AI Deploy (`aideploy-web`) | 12-month Industry Fellowship |

### A3. Why this plan avoids past mistakes
Antigravity is never asked to decide or type anything that an automated test cannot verify. Every task follows a strict 4-step routine:
1. Run one deterministic command (e.g., `npm run visuals:generate -- --course node-web --day 4`).
2. Run the gate check command and confirm it outputs `PASS`.
3. Commit strictly and exclusively the files allowed by that task card.
4. Send the GitHub CI link. GitHub CI automatically rejects the push if any unauthorized file is touched.

### A4. How you check progress (no coding required)
* **GitHub CI Summary:** Every CI run prints an aggregated progress table (e.g. `react-basics 180/180 · node-web 120/180...`). This table is the single source of truth for completion.
* **Playwright Screenshots:** After every 5 lesson days, CI automatically captures screenshots of 6 randomly chosen diagrams across both mobile (390px) and desktop (1440px) viewports in light and dark themes. Claude inspects them, and you can open them directly.
* **Owner Sign-Off:** At each milestone (M-1m through M-12m), you open 3 lessons on your phone and laptop, verify visual clarity, and approve or request adjustments.

### A5. Total size of the work
* **Phase 0: Safety:** 4 tasks (API keys, secret scanner, task-scope guard, protected files list).
* **Phase 1: Engine:** 23 tasks (TypeScript tracer, React VM sandbox, new web templates, fill adapters, generator, Gate v2).
* **Phase 2: Content:** 448 tasks (357 daily generation tasks + 72 5-day screenshot checkpoints + 12 course release switches + 5 owner sign-off milestones).
* **Total:** **475 tasks** covering all 2,160 lesson parts.

---

## 🛡️ Part B. Past Mistakes & The Rules That Prevent Each

| # | Past Mistake (Documented in Earlier Phases) | Architectural Rule That Makes It Impossible |
| :---: | :--- | :--- |
| **1** | Invented diagrams for the wrong lessons or wrong parts | Diagrams are generated strictly from the lesson file itself. Gate rule R1 verifies key and part title against AST. |
| **2** | Typed arbitrary numbers/strings that did not match code output | No value is ever typed. Every value is a programmatic binding to the runtime execution output (Rule R6). |
| **3** | Screenshots captured the wrong parts due to 0-index offset | Screenshots select parts strictly by canonical key (e.g. `react-basics:1:2`), never by slide index. |
| **4** | Claimed "0 failed" and "verified on CI" without proof | Only a green GitHub CI link is accepted. Reports lacking a verifiable link are automatically rejected. |
| **5** | Changed files outside the assigned task boundaries (sandbox, guard) | CI task-scope guard (S-03) inspects every commit in the push. Any unauthorized file fails CI immediately. |
| **6** | Weakened or skipped tests to force a pass | Test files, CI configs, and guard scripts are strictly protected. Only tasks that explicitly name them may touch them. |
| **7** | Pushed secret API keys to git repository | Gitleaks scanner runs in CI before `npm ci`. Keys reside exclusively in GitHub Action secrets and `.env.local`. |
| **8** | Fixed one feature while silently breaking another | Every commit triggers the full CI suite (typechecks, unit tests, Gate v2, Playwright E2E) across all 4 shards. |
| **9** | Executed multi-day bulk commits with ambiguous judgment calls | Strict 1-day-per-commit protocol. Each daily task executes one deterministic command and checks for `PASS`. |

---

## ⚙️ Part C. The System (What the Engine Does)

### C1. Visual Templates (14 Templates in Total)

| Template | Visual Representation | Typical Web Full-Stack Use Case |
| :--- | :--- | :--- |
| `flow` | 2–5 rectangular stages connected by directional arrows | Build pipelines, middleware chains, data transformation flows |
| `boxes` | Named memory boxes, each holding an active value | State variables, props, configuration objects, environment values |
| `table` | 2–5 columns, 1–6 rows filled row-by-row or cell-by-cell | SQL query result sets, HTTP headers table, benchmark metrics |
| `letters` | Individual character cells with active range and pointers | String operations, JWT tokens, URL route parsing, regex matches |
| `compare` | Side-by-side comparative panels with green/red status indicators | Before vs After, Good vs Bad practice, Sync vs Async, Client vs Server |
| `cells` | Indexed array cells with up to 3 named moving pointers | Array manipulation, sliding windows, buffer offsets, pagination |
| `stack-queue` | Vertical stack (LIFO) or horizontal queue (FIFO) with push/pop | JavaScript Call Stack, Microtask queue, SQS/Kafka message queues |
| `tree-graph` | Up to 6 nodes with directional edges; visited nodes highlighted | DOM hierarchy, React component trees, AST nodes, dependency DAGs |
| `bars` | Up to 6 labeled quantitative bars with numeric values | Latency percentiles (p50/p95/p99), memory consumption, bundle sizes |
| `sequence` | 2–4 actor columns with chronological message arrows flowing down | Client/Server/Database HTTP lifecycles, OAuth2 handshakes, WebSocket RPC |
| `states` | 2–5 interconnected state bubbles with the active state illuminated | Promise states (pending/resolved/rejected), circuit breakers, connection states |
| `workflow` *(New)* | Multi-tier architecture topology (Client &rarr; Ingress &rarr; Pods &rarr; DB) | Microservice topologies, Kubernetes cluster architecture, CDN caching |
| `component-tree` *(New)* | React component tree showing props flowing down and events flowing up | React state lifting, context provider tree, re-render cascading |
| `wireframe` *(New)* | Nested UI box-model layout with active styling boundaries | Flexbox/Grid layout visualizer, CSS box model (margin/border/padding) |

### C2. Deterministic Runtime Bindings

| Binding Syntax | Runtime Value Extracted |
| :--- | :--- |
| `{"var": "user", "line": 4}` | Value of variable `user` immediately after line 4 executes |
| `{"out": 1}` | Line 1 of stdout (e.g. `console.log` output) |
| `{"table": 1, "row": 0, "col": "status"}` | Cell value at row 0, column `status` in the first SQL result table |
| `{"http": "status"}` / `{"http": "body.id"}` | HTTP response status code or JSON response payload property |
| `{"dom": "#title.text"}` | Text content of DOM node `#title` rendered by React component |
| `{"error": true}` | Name and message of the error thrown by the code (e.g. `TypeError`) |
| `{"text": "const [val, setVal] = useState(0)"}` | Verbatim code snippet or phrase extracted from the lesson text |

### C5. Gate v2: 14 Strict Rules Checked Automatically in CI
* **R1:** The day file has exactly 6 entries, and each entry's `partTitle` matches the real lesson AST.
* **R2:** The template is `none` or is on the course's allowed template list (Part D).
* **R3:** Between 2 and 5 steps; at most 6 shapes per step. Tables have 2–5 columns and &le; 6 rows.
* **R4:** `at` values are valid (`sayN` only if part has &ge; N say lines) and strictly monotonically increasing.
* **R5:** Each caption is a single sentence of at most 80 characters, ending in a period, containing zero emojis.
* **R6:** Every value is a valid binding. Filling the spec from a fresh code run reproduces `filled` exactly.
* **R7:** Every number in a caption appears in the bound values or in the part's code.
* **R8:** Every tappable word/label appears as a whole word in the lesson text or code.
* **R9:** Visual tones are restricted to the 4 design tokens: `data`, `ok`, `error`, `idle`.
* **R10:** At least 3 of the 6 parts in a day have a picture; otherwise the day is flagged `needs-review`.
* **R11:** The manifest status matches the day file: `passed`, `none`, or `needs-review`.
* **R12:** On-concept check: Each caption shares at least one 4+ letter word with the attached lesson text.
* **R13:** Freshness check: Each entry's `codeHash` equals the SHA-256 of the part's current code.
* **R14:** Stability check: No binding points to an unstable variable that differs across runs.

---

## 🎨 Part D. Allowed Templates Per Course & Teaching Hints

| Month | Prefix | Course Title | Allowed Templates | Pedagogical Whiteboard Model (Sent to AI) |
| :---: | :--- | :--- | :--- | :--- |
| **1** | `react-basics` | Frontend Architecture | `component-tree`, `wireframe`, `flow`, `boxes`, `compare`, `states` | Draw component trees showing props passing down and event callbacks bubbling up; show state changing and triggering virtual DOM updates |
| **2** | `node-web` | Node.js & TypeScript Backend | `sequence`, `event-loop`, `stack-queue`, `flow`, `boxes`, `table` | Show request/response lifecycles, middleware pipelines, Call Stack &rarr; Event Loop &rarr; Task Queues, and buffer chunks |
| **3** | `sql-mastery` | Database Engineering | `table`, `flow`, `compare`, `bars` | Show database tables, join operations connecting foreign keys, row filtering, and aggregation summaries |
| **4** | `dsa-optim` | System DSA & Optimizations | `cells`, `stack-queue`, `tree-graph`, `table`, `bars`, `compare` | Show memory arrays with two pointers moving, call stack frames during recursion, and asymptotic Big-O comparisons |
| **5** | `devops` | DevOps & CI/CD Pipelines | `flow`, `workflow`, `states`, `sequence`, `compare` | Draw CI/CD pipeline stages (Lint &rarr; Build &rarr; Test &rarr; Containerize &rarr; Deploy) and Docker image layering |
| **6** | `cloud` | Cloud Native Architectures | `workflow`, `sequence`, `states`, `table`, `bars`, `compare` | Draw cloud infrastructure topologies (VPC, Subnets, ALB, ECS Tasks, S3 buckets, IAM policies) and request routing |
| **7** | `dist` | Distributed Systems Design | `sequence`, `workflow`, `states`, `table`, `cells`, `compare` | Show message routing across distributed services, Kafka partition logs, circuit breaker state machines, and cache invalidation |
| **8** | `cyber` | Cybersecurity & AppSec | `flow`, `sequence`, `table`, `compare`, `states` | Draw attack vectors, token authentication handshakes (OAuth/JWT), sanitization pipelines, and encryption/hashing steps |
| **9** | `ai` | Applied AI Integrations | `flow`, `table`, `bars`, `sequence`, `compare`, `boxes` | Show the RAG pipeline (Query &rarr; Embedding &rarr; Vector Search &rarr; Context Assembly &rarr; LLM Response) and token usage |
| **10** | `sre-web` | Multi-Cloud Reliability & SRE | `bars`, `states`, `sequence`, `table`, `workflow`, `compare` | Display latency percentiles, error budgets, SLO health gauges, distributed trace spans, and multi-region failover |
| **11** | `stream-web` | High-Throughput Streaming | `cells`, `flow`, `sequence`, `bars`, `table`, `states` | Draw append-only commit logs, partition offsets, consumer group lag, sliding time windows, and backpressure buffers |
| **12** | `aideploy-web` | Production AI Deployment | `workflow`, `flow`, `bars`, `table`, `states`, `compare` | Show AI gateway routing, token rate limiters, semantic cache hits vs misses, safety guardrail checks, and model evaluation |

---

## 📋 PDF Artifact Location

The complete, unabridged, 197-page SRS specification PDF with all 360 individual daily task cards, commands, and 2,160 keys is compiled and available at:

* **Repository Path:** `docs/visuals/PINIT_WEB_FULLSTACK_VISUALS_PLAN.pdf`
* **Artifact Path:** `C:\Users\Admin\.gemini\antigravity\brain\c7b35c15-f056-4dc6-888b-f56621a809c1\PINIT_WEB_FULLSTACK_VISUALS_PLAN.pdf`
* **File Size:** **9.78 MB** (10,260,300 bytes)
* **Total Pages:** **197 Pages** (Rendered via Headless Chromium)
