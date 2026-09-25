# PinIT Career OS — Antigravity IDE Master Context File

> **Last Updated**: September 2026 — Post folder-structure reorganization.
> Read this file fully before touching any code. It is the single source of truth for working on this codebase.

---

## 🧭 What is This Project?

**PinIT Career OS** is a full-stack, AI-powered campus & career operating system for Indian colleges.
It is a platform-of-platforms that serves **Students, Teachers, Parents, Recruiters, Admissions, Consultants,
Admins, and University portals** — all from one monorepo.

Core purpose: Replace disconnected college ERP systems with a unified, gamified, AI-native OS that tracks
a student's entire academic-to-employment journey.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript 5, Zustand, TanStack Query |
| **Styling** | Custom CSS (no Tailwind), design tokens via CSS variables |
| **Backend (API)** | Next.js Route Handlers in `src/app/api/` |
| **Database** | Supabase (PostgreSQL) — primary, with Supabase RLS |
| **ORM** | Prisma 7 (secondary, for schema migrations) |
| **Auth** | Supabase Auth + custom PIN gate system |
| **AI / LLM** | Gemini API via `src/lib/llm/`, smart routing via `src/lib/smartVoiceRouter.ts` |
| **Voice / TTS** | Kokoro ONNX via `voice-service/` (Python FastAPI microservice) |
| **Payments** | Razorpay (`src/lib/razorpay.ts`) |
| **Caching** | Redis (BullMQ queues), multi-tier TTS cache (Redis → SSD → Supabase) |
| **Storage** | Supabase Storage + Firebase Storage |
| **3D / Avatar** | Three.js (`three`), Draco compressed models |
| **Code Runner** | Docker-sandboxed Java/Python judge (`docker/`, `cloud-run/`) |
| **Testing** | tsx native test runner, scripts/tests/ for integration tests |
| **Deploy** | Vercel (primary) / Firebase App Hosting / Docker |

---

## 📂 Canonical Folder Structure (Post-Cleanup — September 2026)

```
Present-Career-os/
│
├── 📄 CLAUDE.md                   ← YOU ARE HERE. Read before coding.
├── 📄 package.json                ← All npm scripts defined here
├── 📄 next.config.js
├── 📄 tsconfig.json
├── 📄 .env.example                ← Copy to .env.local for local dev
├── 📄 firebase.json / .firebaserc
├── 📄 apphosting.yaml             ← Firebase App Hosting config
├── 📄 vercel.json                 ← Vercel deployment config
├── 📄 prisma.config.ts
│
├── 📁 src/                        ← ALL Next.js frontend code lives here
│   ├── 📁 app/                    ← App Router pages & API routes
│   │   ├── 📁 api/                ← 66 route handler folders (Next.js API)
│   │   ├── 📁 dashboard/
│   │   ├── 📁 learning/
│   │   ├── 📁 career-builder/
│   │   ├── 📁 interview/
│   │   ├── 📁 arena/              ← Competitive coding
│   │   ├── 📁 admin/
│   │   ├── 📁 teacher/
│   │   ├── 📁 recruiter/
│   │   ├── 📁 university/
│   │   ├── 📁 parent/
│   │   ├── 📁 _legacy/            ← DO NOT TOUCH (user will handle)
│   │   └── ... (68 route folders total)
│   │
│   ├── 📁 components/             ← Reusable UI components by domain
│   │   ├── 📁 ui/                 ← Base design system components
│   │   ├── 📁 nav/                ← Navigation / sidebar
│   │   ├── 📁 career/
│   │   ├── 📁 learning/
│   │   ├── 📁 interview/
│   │   ├── 📁 friends/
│   │   ├── 📁 avatar/             ← 3D floating avatar / mentor
│   │   ├── 📁 _legacy/            ← DO NOT TOUCH (user will handle)
│   │   └── ... (28 component folders total)
│   │
│   ├── 📁 hooks/                  ← ALL React hooks (consolidated here)
│   │   ├── useAuth.ts
│   │   ├── usePinBalance.ts       ← PIN economy hook
│   │   ├── usePins.ts
│   │   ├── useVault.ts
│   │   ├── useItemLocks.ts
│   │   ├── useArenaPvP.ts
│   │   ├── useCareerProfile.ts
│   │   ├── useExport.ts
│   │   ├── useKeyboard.ts
│   │   ├── useLockBodyScroll.ts
│   │   ├── useTTS.js
│   │   └── dsaiHooks.js
│   │
│   ├── 📁 lib/                    ← Business logic, services, utilities
│   │   ├── 📁 curriculum/         ← Course content engine & validators
│   │   ├── 📁 services/           ← Server-side service layer (Supabase calls)
│   │   ├── 📁 context/            ← React Context providers
│   │   ├── 📁 store/              ← Zustand stores
│   │   ├── 📁 types/              ← TypeScript type definitions
│   │   ├── 📁 schemas/            ← Zod validation schemas
│   │   ├── 📁 server/             ← Server-only utilities
│   │   ├── 📁 api/                ← API client helpers
│   │   ├── 📁 interview/
│   │   ├── 📁 learning/
│   │   ├── 📁 missions/
│   │   ├── 📁 quests/
│   │   ├── 📁 friends/
│   │   ├── 📁 pathway/
│   │   ├── 📁 portfolio/
│   │   ├── firebase.ts
│   │   ├── supabaseClient.ts
│   │   ├── smartVoiceRouter.ts
│   │   ├── tts.ts
│   │   ├── sanitizeLLM.ts         ← ALWAYS use this before rendering LLM output
│   │   └── ... (21 top-level lib files, 38 sub-folders)
│   │
│   ├── 📁 styles/                 ← Global CSS files
│   └── 📄 middleware.ts           ← Auth + route protection middleware
│
├── 📁 content/                    ← Static course/curriculum content
│   └── 📁 courses/                ← 36 *now.md course reference files
│       ├── pythonnow.md
│       ├── dsanow.md
│       ├── reactnow.md
│       └── ... (36 total)
│
├── 📁 backend/                    ← Python FastAPI backend service
│   ├── main.py
│   ├── requirements.txt
│   └── 📁 app/
│       ├── 📁 api/
│       ├── 📁 models/
│       ├── 📁 services/
│       └── 📁 utils/
│
├── 📁 voice-service/              ← AI TTS microservice (Kokoro ONNX)
│   ├── main.py                    ← FastAPI entry point
│   ├── speech_server.py           ← Speech server
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── 📁 core/                   ← Kokoro engine + audio processor
│   ├── 📁 api/                    ← TTS + health routes
│   ├── 📁 cache/                  ← Multi-tier cache (Redis→SSD→Supabase)
│   ├── 📁 workers/                ← Task queue + worker pool
│   └── 📁 schemas/
│
├── 📁 supabase/                   ← Supabase migrations & edge functions
│   ├── schema.sql
│   ├── campus_tables.sql
│   ├── 📁 migrations/
│   └── 📁 functions/              ← Supabase Edge Functions
│
├── 📁 prisma/                     ← Prisma schema + migrations
│   ├── schema.prisma
│   └── 📁 migrations/
│
├── 📁 public/                     ← Static assets served by Next.js
│   ├── manifest.json
│   ├── favicon.ico
│   ├── tts-worker.js              ← Web Worker for TTS
│   ├── voices.bin                 ← ONNX voice model
│   ├── 📁 audio/
│   ├── 📁 avatar/                 ← 3D avatar assets
│   ├── 📁 brand/
│   └── 📁 draco/                  ← Draco 3D compression files
│
├── 📁 scripts/                    ← Dev/CI/test scripts (NOT app code)
│   ├── 📁 tests/    (117 files)   ← test_*.ts/js — integration test runners
│   ├── 📁 verify/    (52 files)   ← verify_*.ts/js — verification scripts
│   ├── 📁 audit/     (13 files)   ← audit_*.ts/js — security & compliance
│   ├── 📁 migrations/ (6 files)   ← migrate_*.js, fix-*.js — DB migrations
│   ├── 📁 utils/     (42 files)   ← CI guards, generators, content QA
│   ├── 📁 batches/                ← Batch processing
│   └── 📁 browser_security_audit/
│
├── 📁 tests/                      ← Formal test suite (tsx test runner)
├── 📁 audit/                      ← Contract & header audit tools
├── 📁 docs/                       ← All documentation
│   ├── ARCHITECTURE.md
│   ├── ADR.md
│   ├── API.md
│   ├── 📁 assets/                 ← PDFs, images, Word docs
│   ├── 📁 course/                 ← Course-specific docs
│   └── ... (40+ docs files)
│
├── 📁 docker/                     ← Docker configs for code runner sandbox
├── 📁 cloud-run/                  ← Cloud Run configs (Java judge)
├── 📁 redis/                      ← Redis config
├── 📁 server/                     ← Experimental labs (perf, prisma, queue, realtime)
├── 📁 storage/                    ← Storage helpers
├── 📁 video/                      ← Video assets
├── 📁 dark-gracity/               ← Internal tooling (gitignored)
├── 📁 voice-engine-build/         ← Voice engine build artifacts
└── 📁 _legacy folders             ← DO NOT TOUCH (in src/app/ and src/components/)
```

---

## 🔑 Critical Rules — Read Before Every Task

### 1. Import Paths

- **Hooks** → always import from `@/hooks/` (NOT `@/lib/hooks/` — that was the old location, now consolidated)
- **Services** → `@/lib/services/`
- **Types** → `@/lib/types/`
- **Supabase client** → `@/lib/supabaseClient`
- **Context** → `@/lib/context/`

### 2. TypeScript Standards

- **Strict TypeScript**: No `any`. No duplicate block-scoped variables in same scope.
- **No implicit any**: Always provide explicit types for function parameters and return values.
- **Zod schemas** → use `src/lib/schemas/` for all API input validation.
- Run `npx tsc --noEmit` to check types before finishing any task.

### 3. LLM / AI Safety

- **ALWAYS** pass LLM output through `sanitizeLLM()` from `@/lib/sanitizeLLM` before rendering.
- Never render raw AI-generated HTML directly. Use `react-markdown` with sanitization.

### 4. Supabase / Database Rules

- All Supabase writes in services MUST go through the service layer (`src/lib/services/`).
- **No bare `await supabase.from(...).insert/update/delete()`** directly in components or API routes.
- RLS (Row Level Security) is enforced — always pass `user_id` context; never bypass with service role key in client code.
- The CI lint guard `scripts/utils/check_bare_writes.js` will fail the build if you violate this.

### 5. PIN Economy

- The PIN system is the in-app currency. **Never** modify PIN balance directly in components.
- Always use `usePinBalance` hook (`@/hooks/usePinBalance`) for reading.
- All PIN deductions go through `/api/payment/verify` or the backend service layer.

### 6. Design System & Layout

- **Active (Expanded) Sidebar**: `15vw` (`--sidebar-w: 15vw`)
- **Collapsed Sidebar**: `5vw` (`--sidebar-collapsed-w: 5vw`)
- **Middle Content**: `flex: 1; min-width: 0` — fills remaining space
- **Both sidebars are mutually exclusive** — expanding one collapses the other. Never open both simultaneously.
- **Floating Avatar**: Resting → `left: 50%, transform: translateX(-50%), bottom: 24px, opacity: 0.4`
  Shifts right when left sidebar opens. Shifts left when right sidebar opens.
- **No Tailwind** — use CSS variables and class-based styles.

### 7. Audio / TTS Rules

- `stopSpeaking()` must **NEVER** trigger fake completion callbacks (`activeOnEndCallback = null`).
- Tour auto-advance must be route-guarded: `cleanPath === expectedRoute`.
- TTS is multi-tier: Web Worker → Kokoro ONNX voice-service → browser fallback.

### 8. Security Boundaries

- Never expose service role keys in client-side code or API responses.
- All API routes must check auth via `middleware.ts` — do not skip it.
- Biometric face data (`src/lib/data/face_biometrics_db.json`) is gitignored — never commit it.

---

## 📜 npm Scripts Reference

```bash
npm run dev             # Start Next.js dev server on :3000
npm run build           # Production build (Vercel/App Hosting)
npm run build:static    # Static export (scripts/utils/build.js)
npm run lint            # ESLint + bare-write CI guard
npm run audit:contracts # API contract parity check
npm run audit:headers   # HTTP headers audit
npm run test:security   # P0 security + RLS + bare-write tests
npm test                # Run formal test suite (tests/**/*.test.ts)
```

---

## 🔬 scripts/ — What They Are & How to Run Them

The `scripts/` folder has **228 standalone test/audit/verify runners**. They are:
- **NOT imported by app code** — they are dev/CI tools only.
- **DO import from `../src/lib/`** — they test real business logic.
- Run with: `npx tsx scripts/tests/test_batch001.ts`

| Folder | Count | Purpose |
|---|---|---|
| `scripts/tests/` | 117 | Integration tests for curriculum, security, RLS, exams |
| `scripts/verify/` | 52 | Data integrity & feature verification |
| `scripts/audit/` | 13 | Security, CSP, bundle, evidence audits |
| `scripts/migrations/` | 6 | One-time DB and content fixes |
| `scripts/utils/` | 42 | CI guards, content QA, generators, runners |

---

## 🤖 Autonomous Agent Rules (Antigravity Specific)

### Working Approach
- Work continuously through multi-step tasks without stopping for minor confirmations.
- Follow the spec → implement → self-validate loop.
- Target only files relevant to the assigned task. Do not crawl the entire codebase.

### Self-Validation Before Declaring Done
1. Run `npx tsc --noEmit` — must exit 0.
2. Run `npm run lint` — must exit 0.
3. Confirm no `@/lib/hooks/` imports remain (use `@/hooks/` instead).
4. Confirm no bare Supabase writes in components.

### Legacy Folders
- `src/app/_legacy/` and `src/components/_legacy/` — **DO NOT TOUCH**. The user will handle these separately.
- `scratch/` and `scratch_java_test/` — temporary, safe to ignore.
- `dark-gracity/` — internal tooling, gitignored, do not modify.

### File Creation Rules
- New components → `src/components/<domain>/`
- New pages → `src/app/<route>/page.tsx`
- New API routes → `src/app/api/<resource>/route.ts`
- New hooks → `src/hooks/`
- New services → `src/lib/services/`
- New types → `src/lib/types/`
- Documentation → `docs/`
- Test scripts → `scripts/tests/`

---

## 🌐 Key Portals & Their Routes

| Portal | Route | Who Uses It |
|---|---|---|
| Student Dashboard | `/dashboard` | Students |
| Learning | `/learning` | Students |
| Career Builder | `/career-builder` | Students |
| Interview Prep | `/interview` | Students |
| Arena (Competitive) | `/arena` | Students |
| Missions & Quests | `/missions`, `/quests` | Students |
| Teacher Portal | `/teacher` | Faculty |
| Parent Portal | `/parent` | Parents |
| Recruiter Portal | `/recruiter` | Companies |
| University Portal | `/university` | Institutions |
| Admin Panel | `/admin` | Platform Admins |
| Consultant | `/consultant` | Career Consultants |
| Admissions | `/admissions` | Admissions Teams |

---

## ⚠️ Known Gotchas

1. **`exam` vs `exams`** both exist in `src/app/api/` — treat them as separate concerns, do not merge without explicit instruction.
2. **`quest` vs `quests`** — same situation.
3. **`gd` vs `group-discussion`** in API — `gd` is a shorthand alias, both are live.
4. **`voice-service/`** is a completely independent Python FastAPI microservice — do not mix its code with the Next.js backend.
5. **`dump.rdb`** at root is a Redis dump file — it is now in `.gitignore` and should never be committed.
6. **`tsconfig.tsbuildinfo`** is now in `.gitignore` — delete it locally if it conflicts.
7. **`content/courses/*.md`** files are static reference material for the LLM curriculum engine — do NOT modify them without explicit instruction.
