# PinIT Career OS — Dual-Track Visuals Testing & Verification SRS

## Software Requirements Specification (SRS) for End-to-End Curriculum Visuals Quality Assurance

| Field | Value |
|---|---|
| Document | PINIT_DUAL_CURRICULUM_VISUALS_TESTING_SRS |
| Version | 1.0 |
| Date | 10 October 2026 |
| Target System | PinIT Career OS Visual Learning Engine (`VisualStage.tsx`, `/api/visuals`) |
| Curriculums Covered | 1. Python Full-Stack Track (12 Courses / 360 Days / 2,160 Lesson Parts)<br>2. Web Full-Stack Track (12 Courses / 360 Days / 2,160 Lesson Parts) |
| Total Scope | 24 Courses, 720 Days, 4,320 Lesson Parts, >3,500 Interactive Visual Specs |
| Master PDF References | 1. `docs/visuals/PINIT_PY_CERT_VISUALS_PLAN.pdf`<br>2. `docs/visuals/PINIT_WEB_FULLSTACK_VISUALS_PLAN.pdf` |
| Author | Google DeepMind Antigravity Pair Programming System |
| Repository & Branch | `Vinay-N-Kashyap/Present-Career-os` (`main-dis3ku`) |

---

# PART 1 — PURPOSE, SCOPE & ZERO-HALLUCINATION PRINCIPLE

## 1.1 Purpose of this Document
This Software Requirements Specification (SRS) establishes the definitive testing requirements, verification criteria, and quality assurance workflows for all visual diagrams across both of PinIT's flagship certification tracks: the **Python Full-Stack Track** and the **Web Full-Stack Track**.

Because real-world students depend on these interactive visual aids to understand foundational, systems-level, and production engineering concepts, **zero defect tolerance** is enforced:
1. Every diagram must accurately reflect the code and spoken lecture concepts.
2. No visual may cause runtime rendering crashes, undefined pointer exceptions, or unresponsive step transitions.
3. Every visual must adhere strictly to Gate v2 schema rules (R1 through R14).
4. No testing agent may report speculative, unverified, or hallucinated test results.

## 1.2 Scope of the Visual System Under Test
The system under test comprises three interrelated software layers:
- **Data Layer**: 720 daily JSON specification files located under `src/lib/data/lessonVisuals/{prefix}/day-{NN}.json`.
- **API Serving Layer**: The Next.js Route Handler at `src/app/api/visuals/route.ts` delivering cached, validated visual payloads over HTTP.
- **Client Rendering Layer**: The React component architecture rooted in `src/app/quests/lesson/components/visuals/VisualStage.tsx` and its 14 modular diagram renderers (`FlowTemplate`, `BoxesTemplate`, `TableTemplate`, `BarsTemplate`, `SequenceTemplate`, `StatesTemplate`, `CellsTemplate`, `CompareTemplate`, `LettersTemplate`, `StackQueueTemplate`, `TreeGraphTemplate`, `ComponentTreeTemplate`, `WorkflowTemplate`, `WireframeTemplate`).

---

# PART 2 — THE ZERO-HALLUCINATION 5-DAY BATCH EXECUTION PROTOCOL

## 2.1 The Problem with Monolithic Testing
Auditing 720 days (4,320 lesson parts) in a single continuous pass causes cognitive drift, superficial skimming, and AI hallucinations where failures are smoothed over or missed.

## 2.2 The 5-Day Iterative Batch Protocol
All testing must proceed strictly in **5-day contiguous batches** (Days 1–5, 6–10, 11–15, 16–20, 21–25, 26–30) per course. 

```
┌────────────────────────────────────────────────────────┐
│               5-Day Block Testing Cycle                │
└────────────────────────────────────────────────────────┘
                           │
                           ▼
          [ Step 1: PDF Ground Truth Alignment ]
          • Verify day titles & themes in master PDF
          • Confirm intended template suitability
                           │
                           ▼
          [ Step 2: Gate v2 Programmatic Audit ]
          • Execute Gate check across rules R1–R14
          • Collect any error or warning outputs
                           │
                           ▼
                { Any Flaws Detected? }
                ├── YES ──► [ Step 3: In-Situ Remediation ]
                │           • Fix code/data "there and then"
                │           • Re-verify until PASS 100%
                │           ▲
                └── NO ─────┘
                           │
                           ▼
          [ Step 4: Runtime API & UI Stage Test ]
          • Query /api/visuals for all 5 days
          • Confirm VisualStage render payload valid
                           │
                           ▼
          [ Step 5: Atomic Git Checkpoint Commit ]
          • Commit clean 5-day block to main-dis3ku
          • Log progress in agent_tasks.csv
                           │
                           ▼
         [ Advance to Next 5-Day Block (or Next Course) ]
```

### The 5 Steps of the Loop:
1. **Step 1: PDF Plan Ground Truth Alignment**
   - Check the 5 day titles and part titles against the corresponding master PDF (`PINIT_PY_CERT_VISUALS_PLAN.pdf` or `PINIT_WEB_FULLSTACK_VISUALS_PLAN.pdf`).
   - Confirm conceptual appropriateness: sequential flows for protocols, state diagrams for finite automata, tables for relational comparisons, bar charts for performance metrics.
2. **Step 2: Programmatic Gate v2 Audit**
   - Run the programmatic validation engine over the 5 days.
   - Evaluate all 14 Gate rules (R1 to R14).
3. **Step 3: Immediate In-Situ Remediation ("Fix it there and then")**
   - If ANY rule flags an issue, **stop immediately and fix the file in place**.
   - Do NOT mark the block complete, do NOT move to the next block, and do NOT bypass the failure.
   - Re-run the test to guarantee `PASS 5/6 (none: 1)` or `PASS 6/6`.
4. **Step 4: Runtime API & Stage Integration Test**
   - Confirm `/api/visuals?prefix={prefix}&day={day}` resolves status 200 with complete JSON payload.
   - Ensure props conform to `VisualStage.tsx` interfaces without missing fields.
5. **Step 5: Atomic Checkpoint Commit**
   - Stage and commit the verified block (`git commit -m "audit({course}): verify days {D}-{D+4} (100% clean)"`).
   - Record completion in `agent_tasks.csv` and `PROJECT_MEMORY.md`.

---

# PART 3 — SPECIFICATION OF QUALITY GATE RULES (GATE V2)

Every day file (`day-01.json` through `day-30.json`) must satisfy all 14 mandatory Gate v2 rules:

| Rule ID | Rule Name | Specification & Passing Criteria |
|:-------:|:----------|:--------------------------------|
| **R1** | Structural Completeness | File must contain exactly 6 entries. Each entry's `partTitle` must match the corresponding lesson part title verbatim. |
| **R2** | Template Authorization | The `spec.template` must be either `'none'` or present in the course's allowed template list (`COURSE_ALLOWED_TEMPLATES`). |
| **R3** | Complexity & Shape Bounds | Diagrams must have 2 to 5 steps. Maximum shapes: at most 6 nodes (flow, tree), 6 boxes, 6 rows (table), 6 items (cells, stack), 6 bars, or 4 actors (sequence). |
| **R4** | Step Progression Order | The `at` attribute must be strictly monotonically increasing across steps (`say1` .. `sayN`, `example`, `tryIt`). Backward or duplicate `at` lines are strictly prohibited. |
| **R5** | Caption Discipline | Captions must be a single grammatical sentence, <= 80 characters in length, terminate with a period ('.'), and contain zero emojis. |
| **R6** | Text & Value Verbatim Grounding | Variable bindings, text edits, and replacements must appear verbatim in the attached lesson code or text. |
| **R7** | Numeric Grounding | Any numeric literal appearing in a caption must either be explicitly present in the lesson code or bound in the visual step values. Speculative numbers are prohibited. |
| **R8** | Tappable Label Grounding | Any tappable interactive shape label must exist as a whole word in the lesson part's text or code. |
| **R9** | Strict Tone Taxonomy | Tone values across all elements (nodes, bars, messages, pointers) must strictly belong to the set: `['data', 'ok', 'error', 'idle']`. Custom tones (`'muted'`, `'accent'`, `'warn'`) are invalid. |
| **R10** | Visual Density Target | Each day file must contain at least 3 active picture specs (standard target: 5 pictures, 1 none). Days with fewer than 3 pictures must be marked `'needs-review'`. |
| **R11** | Manifest Consistency | If tracked in manifest, key status in file must match manifest status (`passed`, `none`, `needs-review`, `pilot`). |
| **R12** | Semantic Word Sharing | The caption of each step must share at least one important word (4+ letters, case-insensitive, non-stopword) with the attached lesson text at `step.at`. |
| **R13** | Freshness Code Hash | The entry's `codeHash` must match the current SHA-256 hash of the corresponding lesson part's code string. |
| **R14** | Variable Stability | Visual bindings must not bind to unstable runtime addresses or nondeterministic memory variables. |

---

# PART 4 — CURRICULUM INVENTORY & 144 BATCH BLOCK SCHEDULE

The complete QA matrix spans 24 courses divided into 144 distinct 5-day verification blocks:

```
[24 Courses x 6 Blocks = 144 Total Audit Blocks | 720 Days | 4,320 Lesson Parts]
```

## 4.1 Track 1: Python Full-Stack Certification Curriculum
*Master Plan Reference: `docs/visuals/PINIT_PY_CERT_VISUALS_PLAN.pdf`*

| Month | Key | Course Name | Path | Blocks (5 Days Each) |
|:-----:|:----|:------------|:-----|:---------------------|
| M01 | `python` | Python Core, OOP & Backend Internals | `src/lib/data/lessonVisuals/python/` | B01 (1-5), B02 (6-10), B03 (11-15), B04 (16-20), B05 (21-25), B06 (26-30) |
| M02 | `dsa-py` | Data Structures & Algorithms in Python | `src/lib/data/lessonVisuals/dsa-py/` | B07 (1-5), B08 (6-10), B09 (11-15), B10 (16-20), B11 (21-25), B12 (26-30) |
| M03 | `sql-mastery` | Advanced SQL, Query Plans & Modeling | `src/lib/data/lessonVisuals/sql-mastery/` | B13 (1-5), B14 (6-10), B15 (11-15), B16 (16-20), B17 (21-25), B18 (26-30) |
| M04 | `ai-py` | Applied AI, Vectors & Neural Search | `src/lib/data/lessonVisuals/ai-py/` | B19 (1-5), B20 (6-10), B21 (11-15), B22 (16-20), B23 (21-25), B24 (26-30) |
| M05 | `dist-py` | Distributed Systems & High-Scale Python | `src/lib/data/lessonVisuals/dist-py/` | B25 (1-5), B26 (6-10), B27 (11-15), B28 (16-20), B29 (21-25), B30 (26-30) |
| M06 | `cloud-py` | Cloud Infrastructure & Serverless Python | `src/lib/data/lessonVisuals/cloud-py/` | B31 (1-5), B32 (6-10), B33 (11-15), B34 (16-20), B35 (21-25), B36 (26-30) |
| M07 | `nlp-py` | NLP, Semantic Search & Tokenization | `src/lib/data/lessonVisuals/nlp-py/` | B37 (1-5), B38 (6-10), B39 (11-15), B40 (16-20), B41 (21-25), B42 (26-30) |
| M08 | `quant-py` | Quantitative Analytics & Financial Math | `src/lib/data/lessonVisuals/quant-py/` | B43 (1-5), B44 (6-10), B45 (11-15), B46 (16-20), B47 (21-25), B48 (26-30) |
| M09 | `prompt-py` | Production Prompt Engineering & Agents | `src/lib/data/lessonVisuals/prompt-py/` | B49 (1-5), B50 (6-10), B51 (11-15), B52 (16-20), B53 (21-25), B54 (26-30) |
| M10 | `train-py` | Model Fine-Tuning, LoRA & Evaluation | `src/lib/data/lessonVisuals/train-py/` | B55 (1-5), B56 (6-10), B57 (11-15), B58 (16-20), B59 (21-25), B60 (26-30) |
| M11 | `vec-py` | Vector Databases & HNSW Indexing | `src/lib/data/lessonVisuals/vec-py/` | B61 (1-5), B62 (6-10), B63 (11-15), B64 (16-20), B65 (21-25), B66 (26-30) |
| M12 | `safe-py` | AI Safety, Alignment & Red-Teaming | `src/lib/data/lessonVisuals/safe-py/` | B67 (1-5), B68 (6-10), B69 (11-15), B70 (16-20), B71 (21-25), B72 (26-30) |

## 4.2 Track 2: Web Full-Stack Certification Curriculum
*Master Plan Reference: `docs/visuals/PINIT_WEB_FULLSTACK_VISUALS_PLAN.pdf`*

| Month | Key | Course Name | Path | Blocks (5 Days Each) |
|:-----:|:----|:------------|:-----|:---------------------|
| M01 | `react-basics` | React Basics & Component Architecture | `src/lib/data/lessonVisuals/react-basics/` | B73 (1-5), B74 (6-10), B75 (11-15), B76 (16-20), B77 (21-25), B78 (26-30) |
| M02 | `node-web` | Node.js Backend & API Engineering | `src/lib/data/lessonVisuals/node-web/` | B79 (1-5), B80 (6-10), B81 (11-15), B82 (16-20), B83 (21-25), B84 (26-30) |
| M03 | `dsa-optim` | Web DSA, Memory & V8 Engine Optimization | `src/lib/data/lessonVisuals/dsa-optim/` | B85 (1-5), B86 (6-10), B87 (11-15), B88 (16-20), B89 (21-25), B90 (26-30) |
| M04 | `sql-mastery` | SQL Mastery, Transactions & Engines | `src/lib/data/lessonVisuals/sql-mastery/` | B91 (1-5), B92 (6-10), B93 (11-15), B94 (16-20), B95 (21-25), B96 (26-30) |
| M05 | `devops` | DevOps, Docker & CI/CD Pipelines | `src/lib/data/lessonVisuals/devops/` | B97 (1-5), B98 (6-10), B99 (11-15), B100 (16-20), B101 (21-25), B102 (26-30) |
| M06 | `cloud` | Cloud Architecture & Distributed Systems | `src/lib/data/lessonVisuals/cloud/` | B103 (1-5), B104 (6-10), B105 (11-15), B106 (16-20), B107 (21-25), B108 (26-30) |
| M07 | `dist` | Distributed Consensus & Microservices | `src/lib/data/lessonVisuals/dist/` | B109 (1-5), B110 (6-10), B111 (11-15), B112 (16-20), B113 (21-25), B114 (26-30) |
| M08 | `cyber` | Web Cybersecurity, OWASP & Cryptography | `src/lib/data/lessonVisuals/cyber/` | B115 (1-5), B116 (6-10), B117 (11-15), B118 (16-20), B119 (21-25), B120 (26-30) |
| M09 | `ai` | Full-Stack AI Engineering & Real-Time LLMs | `src/lib/data/lessonVisuals/ai/` | B121 (1-5), B122 (6-10), B123 (11-15), B124 (16-20), B125 (21-25), B126 (26-30) |
| M10 | `sre-web` | Multi-Cloud SRE, Observability & SLOs | `src/lib/data/lessonVisuals/sre-web/` | B127 (1-5), B128 (6-10), B129 (11-15), B130 (16-20), B131 (21-25), B132 (26-30) |
| M11 | `stream-web` | Streaming in TypeScript & Kafka Pipelines | `src/lib/data/lessonVisuals/stream-web/` | B133 (1-5), B134 (6-10), B135 (11-15), B136 (16-20), B137 (21-25), B138 (26-30) |
| M12 | `aideploy-web`| Production AI Gateway & Edge Deployment | `src/lib/data/lessonVisuals/aideploy-web/` | B139 (1-5), B140 (6-10), B141 (11-15), B142 (16-20), B143 (21-25), B144 (26-30) |

---

# PART 5 — DEFECT SEVERITY TAXONOMY & REMEDIATION PROTOCOL

When auditing any 5-day batch, defects are categorized by impact severity:

| Severity | Category | Example Triggers | Remediation Protocol |
|:--------:|:---------|:-----------------|:---------------------|
| **P0 - Blocker** | Parser / Structural Crash | • Malformed JSON syntax<br>• Missing day file<br>• Count of entries != 6 (R1)<br>• Missing title / title mismatch (R1) | Immediate remediation. Halt test runner. Fix file syntax or restore missing entries. Re-run validator. |
| **P1 - High** | Integrity & Timeline Flaw | • Invalid template for course (R2)<br>• Non-increasing `at` timeline (R4)<br>• Invalid tone property (`"accent"`, `"muted"`) (R9)<br>• Code hash mismatch (R13) | Re-align timeline attributes to strictly increasing say lines. Replace tones with `['data', 'ok', 'error', 'idle']`. Re-compute SHA-256 code hash. |
| **P2 - Medium** | Grounding & Caption Defect | • Caption > 80 chars (R5)<br>• Unbound numbers in caption (R7)<br>• Caption shares no vocabulary with attached say text (R12) | Condense caption to <= 80 characters. Bind numeric constants to code variables or remove speculative numbers. Infuse vocabulary from attached say text. |

### Strict Remediation Invariant:
**Under no circumstances may an agent disable, weaken, skip, or comment out any Gate v2 check.** Every fix must resolve the underlying file defect so that the check passes cleanly and legitimately.

---

# PART 6 — COMPLIANCE ACCEPTANCE & SIGN-OFF CRITERIA

The overall curriculum visual QA is accepted and certified production-ready only when:

1. **Gate v2 Perfect Score**: 
   - 100% of all 720 days (360 Python + 360 Web) pass Gate v2 with **0 errors**.
2. **Release Switch Validation**:
   - All 24 course keys are registered in `src/lib/visuals/enabledCourses.ts` under `ENABLED_COURSES`.
3. **End-to-End Build & Compilation**:
   - `npx tsc --noEmit` exits code 0 with zero type errors.
   - `npm run build` completes an optimized production build with code 0.
4. **Git Tree Cleanliness**:
   - Branch `main-dis3ku` is fully synchronized with `origin/main-dis3ku`.
   - Zero untracked scratch files, working directory completely clean.
5. **Memory Audit Logs**:
   - All 144 blocks documented with git commit hashes in `agent_tasks.csv` and summarized in `PROJECT_MEMORY.md`.
