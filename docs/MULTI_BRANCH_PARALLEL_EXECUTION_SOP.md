# PinIT Career OS — Multi-Branch Scaled Parallel Execution SOP & Operating Manual

**Document ID:** `MULTI_BRANCH_PARALLEL_EXECUTION_SOP`  
**Version:** 1.0  
**Target Audience:** Autonomous Agents, Sub-Agents, Branches A, B, and C, and Engineering Leads  
**Master Memory Location:** `C:\Users\Admin\Desktop\projects\memory of agent`  

---

## 1. Executive Summary & Objective

PinIT Career OS is an enterprise-grade Career Operating System combining 37 university-grade engineering and business curricula, an AI-guided interactive 3D mentor, realistic mock interviews, virtual internships, and multi-tenant university administration.

To accelerate completion of the remaining workload without collisions, race conditions, or unverified merges, the development pipeline is partitioned into **Three Independent, Collision-Free Streams**:

1. **Branch A (Curriculum Tech & Launchpad)**: Focuses on core technical launchpad courses (`excel_viz`, `comp_fund`, `git_vcs`, `soft_skills`).
2. **Branch B (Curriculum Commerce & IoT)**: Focuses on the 14 B.Com / BBA tracks and 4 IoT engineering tracks.
3. **Branch C (Institutional & Platform Systems)**: Focuses on non-curriculum features: Campus Admin Portal, Faculty/Teacher Tools, University Multi-Tenant Isolation, Analytics, and Moderation.

---

## 2. Master Curriculum Completion Status (Audit vs. Bible PDF)

According to the **Master Architecture Bible** (`PINIT_ALL_IN_ONE_MASTER_SRS_AND_VISUALS_BIBLE.pdf` and `PINIT_36_COURSES_MASTERCLASS_SRS_500P.md`):

### 2.1 The Two Completion Tiers
* **Tier 1: 30-Day Foundation Masterclass Standard (Production Target)**
  * Total Track Modules in System: **53 Modules**
  * Target Days to Day 30: **1,590 Days** (53 modules × 30 days)
  * Currently Completed in Codebase: **1,045 Days**
  * **Current Completion:** **65.72% Complete**
  * **Remaining Work:** **34.28% Work Remaining (545 Days)**
* **Tier 2: 60-Day Full Enterprise Specification (Exhaustive Masterclass)**
  * Total Track Modules: **37 Master Courses**
  * Target Days: **2,220 Days** (37 courses × 60 days / 240 quests)
  * Currently Completed: **1,045 Days**
  * **Current Completion:** **47.07% Complete**
  * **Remaining Work:** **52.93% Work Remaining (1,175 Days)**
* **Gate v2 Interactive Visual Specs:**
  * Generated on Disk: **990 JSON Specifications** across 52 course directories.
  * Remaining to Day 30: **600 Visual Specifications**.

---

## 3. The 3-Branch Tri-Stream Division Matrix (Zero Overlap & Zero Collision)

```
                                  MASTER PLATFORM ROADMAP
                                             │
         ┌───────────────────────────────────┼───────────────────────────────────┐
         │                                   │                                   │
         ▼                                   ▼                                   ▼
    [BRANCH A]                          [BRANCH B]                          [BRANCH C]
Curriculum Stream 1                 Curriculum Stream 2                 Platform & Institutional
Tech & Launchpad Tracks             Commerce & IoT Tracks               Admin & Faculty Systems
Worktree: Present-Career-os         Worktree: Present-Career-os-b       Worktree: Present-Career-os-c
Branch: codex/interview-tab         Branch: agent/branch-b-commerce     Branch: agent/branch-c-platform
Tasks: TASK-688 to TASK-750         Tasks: TASK-751 to TASK-850         Tasks: TASK-851 to TASK-950
```

### 3.1 Strict File Ownership Matrix

To prevent git conflicts, each branch has exclusive write permissions over specific files. **No branch may touch files assigned to another branch.**

| Stream / Branch | Scope & Targets | Exclusive Source Files | Exclusive Tests & Visuals |
| :--- | :--- | :--- | :--- |
| **Branch A**<br>*(Curriculum Tech)* | • `excel_viz` (Days 11–30)<br>• `comp_fund` (Days 6–30)<br>• `git_vcs` (Days 6–30)<br>• `soft_skills` (Days 6–30)<br>**Total: 95 Days** | `src/lib/data/excelVizLongLessons.ts`<br>`src/lib/data/compFundLongLessons.ts`<br>`src/lib/data/gitVcsLongLessons.ts`<br>`src/lib/data/softSkillsLongLessons.ts` | `src/lib/data/lessonVisuals/excel_viz/*`<br>`src/lib/data/lessonVisuals/comp_fund/*`<br>`src/lib/data/lessonVisuals/git_vcs/*`<br>`src/lib/data/lessonVisuals/soft_skills/*`<br>`tests/quant_excel_long_lessons.test.ts`<br>`tests/systems_long_lessons_parity.test.ts`<br>`tests/java_softskills_long_lessons.test.ts` |
| **Branch B**<br>*(Curriculum Commerce & IoT)* | • 14 B.Com Tracks (Days 6–30 = 350 Days)<br>• 4 IoT Tracks (`iot_net`, `iot_edge`, `iot_sec`, `iot_emb`) (Days 6–30 = 100 Days)<br>**Total: 450 Days** | `src/lib/data/bcom*LongLessons.ts`<br>`src/lib/data/iot*LongLessons.ts` | `src/lib/data/lessonVisuals/bcom_*/*`<br>`src/lib/data/lessonVisuals/iot_*/*`<br>`tests/bcom_*.test.ts`<br>`tests/iot_*.test.ts` |
| **Branch C**<br>*(Admin, Faculty & Platform)* | • Campus Admin Portal (`/campus-admin/*`)<br>• Teacher & Faculty Dashboard (`/teacher/*`)<br>• University Multi-Tenant Isolation & RLS<br>• Placement & Student Analytics<br>• Moderation & Guardrails | `src/app/campus-admin/*`<br>`src/app/teacher/*`<br>`src/app/university/*`<br>`src/components/admin/*`<br>`src/components/teacher/*`<br>`src/lib/admin/*`<br>`src/lib/teacher/*` | `tests/campus_admin_*.test.ts`<br>`tests/teacher_portal_*.test.ts`<br>`tests/multitenant_branding_parity.test.ts` |

**Collision-Free Mathematical Guarantee:**
* Branch A and Branch B write to **completely distinct source files** in `src/lib/data/`.
* Branch A and Branch B write to **completely distinct visual subdirectories** in `src/lib/data/lessonVisuals/`.
* Branch C writes **zero lines** of curriculum or visual code.
* Merging all three branches into `main` produces **zero merge conflicts**.

---

## 4. Git Worktree & Branch Setup Instructions

Every sub-agent or engineer must spin up their assigned branch in a dedicated Git Worktree:

### For Branch B (Curriculum Commerce & IoT):
```powershell
# From the root repository:
git worktree add ../Present-Career-os-commerce -b agent/branch-b-curriculum-commerce-iot
cd ../Present-Career-os-commerce
npm install --legacy-peer-deps
```

### For Branch C (Platform, Admin & Faculty):
```powershell
# From the root repository:
git worktree add ../Present-Career-os-platform -b agent/branch-c-platform-admin-faculty
cd ../Present-Career-os-platform
npm install --legacy-peer-deps
```

### Critical Branch Rules:
1. **Never switch branches inside another agent's worktree.**
2. **Never push directly to `main` without completing the full block audit.**
3. **Do not pull other active branches into your branch while work is in flight.**

---

## 5. Central Shared Memory Protocols

All agents must coordinate through the central memory directory:
📁 **`C:\Users\Admin\Desktop\projects\memory of agent\`**

### 5.1 Pre-Flight Registration (`multi_agent_control.csv`)
Before touching any file, verify in `multi_agent_control.csv` that no other agent is working on the same files. Append an active status record:
```csv
AGENT-XXX,AgentName,agent/branch-b-curriculum-commerce-iot,Present-Career-os-commerce,TASK-XXX,In-Progress,2026-10-XX HH:MM:SS,"Working on B.Com Marketing Days 6-10"
```

### 5.2 Task Range Reservation (`agent_tasks.csv`)
Use the assigned task ID ranges to prevent duplicate IDs:
* **Branch A**: `TASK-688` to `TASK-750`
* **Branch B**: `TASK-751` to `TASK-850`
* **Branch C**: `TASK-851` to `TASK-950`

Log completion in `agent_tasks.csv`:
```csv
TASK-751,AgentName,Complete,Expand B.Com Marketing Day 6 to 35m with Consumer Segmentation & K-Means,2026-10-XX
```

### 5.3 Milestone Ledger (`PROJECT_MEMORY.md`)
Upon finishing a 5-day block or major feature:
1. Append a formatted entry to `PROJECT_MEMORY.md`.
2. State the exact word count, test pass counts, commit SHA, and files touched.

---

## 6. Strict Curriculum Invariants (Branch A & Branch B)

Every curriculum lesson must comply with the **LongLesson Standard**:

### 6.1 5-Part Lesson Invariant
Each day consists of exactly 5 parts:
* `part1_hook`: Real-world dilemma, operational stakes, senior intuition.
* `part2_analogy`: Physical-world mechanical bridge (e.g. airport hub, warehouse queue).
* `part3_deep`: Deep mathematical/systems theory with formal equations & invariants.
* `part4_code`: Self-contained interactive code with step-by-step line walkthrough.
* `part5_wrap`: Capstone summary, production checklist, key takeaways.

### 6.2 Word Count & Duration Standard
* **Words per Part:** Minimum **560 words** (strictly enforced).
* **Words per Day:** Minimum **2,940 words** total spoken audio (strictly enforced).
* **Duration:** Exactly **35 minutes** (21.0 min spoken audio @ 120 wpm + 14.0 min activity).

### 6.3 Gate v2 Visual JSON Invariant
Each lesson day must have an accompanying on-disk JSON file:
`src/lib/data/lessonVisuals/<course_prefix>/day-XX.json`
* **Valid Template:** One of `bars`, `flow`, `table`, `register-bits`, `ledger-sheet`, `funnel`, `tree-graph`, `stack-queue`, `cells`, `component-tree`, `states`, `sequence`.
* **4 Synchronized Steps:** Exactly `intro`, `say1`, `example`, `tryIt`.
* **SHA-256 Code Hash:** `hashSnippet(interactiveCode)` matching the exact code snippet in part 4.

### 6.4 Verification Before Commit
```bash
# Verify TypeScript compiles with zero errors:
npx tsc --noEmit

# Run the dedicated test suite:
npx vitest run tests/<your_test_file>.test.ts
```

---

## 7. Platform & Institutional Invariants (Branch C)

Branch C develops administrative, faculty, and institutional capabilities:

1. **Multi-Tenant Security:** All database queries and API routes must filter strictly by `institutionId`. Never allow cross-institution data leaks.
2. **Role-Based Access Control (RBAC):** Restrict `/campus-admin/*` to `role === 'campus_admin'` and `/teacher/*` to `role === 'teacher' || role === 'faculty'`.
3. **Graceful Fallbacks:** If Supabase tables do not yet exist, provide graceful in-memory mock fallbacks so the UI remains interactive.
4. **Clean Design System:** Use existing PinIT Tailwind tokens, Card components, and Avatar components.

---

## 8. Anti-Hanging & Watchdog Rules

1. **6-Minute Watchdog:** Never let any command run for longer than 360,000ms (6 minutes). If a process does not complete, kill it immediately.
2. **PowerShell Quote Escaping:** Never run multi-line inline scripts using `npx tsx -e "..."` in Windows PowerShell. Write a small script file in `scripts/` and run `npx tsx scripts/<script_name>.ts`.
3. **One-by-One Commits:** Commit incrementally after each 5-day block or feature. Never accumulate massive uncommitted working trees.
