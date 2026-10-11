# scripts/visuals/patch_compiler_fullstack.py
# Inserts Course 13 (Full-Stack JavaScript Engineering) into compile-500p-srs-pdf.mts

with open("scripts/visuals/compile-500p-srs-pdf.mts", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add import
old_import = "import { AI_MONTH_1_SPECS, AI_MONTH_2_SPECS } from './ai-masterclass-spec';"
new_import = """import { AI_MONTH_1_SPECS, AI_MONTH_2_SPECS } from './ai-masterclass-spec';
import { FULLSTACK_MONTH_1_SPECS, FULLSTACK_MONTH_2_SPECS } from './fullstack-masterclass-spec';"""

if old_import not in content:
    raise Exception("Could not find AI import in compiler")

content = content.replace(old_import, new_import, 1)

# 2. Add renderFullStackDayCard function
render_fn = """
function renderFullStackDayCard(day: any): string {
  const questsHtml = day.quests.map((q: any) => `
    <div style="margin-bottom: 2px;">
      <span style="font-family: monospace; font-size: 6.8pt; background: #f1f5f9; padding: 1px 3px; border-radius: 2px;">${q.id}</span>
      <strong>${q.name}</strong> <em>(${q.type})</em>: <span style="color: #475569;">${q.desc}</span>
    </div>
  `).join('');

  return `
    <div class="daily-card" style="margin-bottom: 10pt; page-break-inside: avoid; border-left: 3px solid #059669;">
      <div class="daily-card-header">
        <div>
          <span style="background: #059669; color: #ffffff; font-size: 7.5pt; font-weight: 700; padding: 1px 5px; border-radius: 2px;">Day ${day.day}</span>
          <strong style="margin-left: 6pt; font-size: 8.8pt; color: #0f172a;">${day.title}</strong>
          <span class="stage-pill" style="background: #d1fae5; color: #065f46;">${day.stageName}</span>
        </div>
        <span style="font-size: 7.2pt; color: #64748b;">Month ${day.month} &bull; Block ${day.blockNum} &bull; <strong>${day.quests.length} Quests</strong></span>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5pt; margin-bottom: 4pt; font-size: 7.2pt;">
        <div style="background: #f8fafc; padding: 4pt 6pt; border-radius: 3px; border: 1px solid #e2e8f0;">
          <strong>🎯 Spoken Goal &amp; Invariant:</strong><br>
          <span style="color: #059669; font-weight: 600;">Goal:</span> ${day.spokenGoal}<br>
          <span style="color: #047857; font-weight: 600;">Invariant:</span> <code>${day.conceptInvariant}</code>
        </div>
        <div style="background: #fef2f2; padding: 4pt 6pt; border-radius: 3px; border: 1px solid #fecaca; color: #991b1b;">
          <strong>⚠️ Failure Mode &amp; tryIt Bug:</strong><br>
          <strong>Failure:</strong> ${day.failureMode}<br>
          <strong>tryIt Friction:</strong> ${day.tryItFriction}
        </div>
      </div>

      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 3px; padding: 3pt 6pt; margin-bottom: 4pt; font-size: 7.0pt;">
        <strong style="color: #166534;">🪜 3-Tier Socratic Hint Ladder:</strong>
        <span style="color: #059669;">[1. Nudge: "${day.socraticHints[0]}"]</span> &rarr;
        <span style="color: #b45309;">[2. Memory: "${day.socraticHints[1]}"]</span> &rarr;
        <span style="color: #15803d;">[3. Fix: "${day.socraticHints[2]}"]</span>
      </div>

      <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 3px; padding: 3pt 6pt; margin-bottom: 4pt; font-size: 7.0pt;">
        <strong style="color: #065f46;">🧩 Situational Diagnostic Puzzle:</strong>
        <em>"${day.situationalPuzzle.scenario}"</em><br>
        <strong>Correct:</strong> Option ${String.fromCharCode(65 + day.situationalPuzzle.answerIdx)}) ${day.situationalPuzzle.options[day.situationalPuzzle.answerIdx]} &bull;
        <span style="color: #047857;"><strong>Debrief:</strong> ${day.situationalPuzzle.debrief}</span>
      </div>

      <div style="border-top: 1px dashed #cbd5e1; padding-top: 3pt; font-size: 7.1pt;">
        <strong style="color: #334155;">Quests Scheduled for Day ${day.day} (${day.quests.length} Quests):</strong>
        <div style="margin-top: 2pt;">
          ${questsHtml}
        </div>
      </div>
    </div>
  `;
}
"""

anchor_renderer = "function renderAIDayCard(day: any): string {"
if anchor_renderer not in content:
    raise Exception("Could not find renderAIDayCard in compiler")

content = content.replace(anchor_renderer, render_fn + "\n" + anchor_renderer, 1)

# 3. Add Part XVII HTML block before return h; at end of buildDeepMasterclassesHtml()
part_xvii = """
  <!-- PART XVII: DEEP MASTERCLASS BLUEPRINT - FULL-STACK JAVASCRIPT ENGINEERING (DAYS 1-60 / 240 QUESTS) -->
  <div class="page-break">
    <div style="background: #064e3b; color: #ffffff; padding: 8pt 12pt; border-radius: 4pt; margin-bottom: 8pt; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h1 style="color: #ffffff; margin: 0; font-size: 14pt; border: none; padding: 0;">Part XVII: Deep Masterclass Blueprint — Full-Stack JavaScript Engineering</h1>
        <span style="font-size: 8.2pt; color: #a7f3d0;">Course ID: <code>course-fullstack-js</code> &bull; 60-Day Full Curriculum (Days 1-60) &bull; <strong>240 Total Quests</strong></span>
      </div>
      <div style="text-align: right;">
        <span style="background: #059669; color: #ffffff; font-size: 7.5pt; font-weight: 700; padding: 2px 6px; border-radius: 2px;">True 9.8 Standard</span><br>
        <span style="font-size: 7.5pt; color: #6ee7b7;">Month 1 (120 Quests) &bull; Month 2 (120 Quests)</span>
      </div>
    </div>

    <h2>17.1 Course Architectural Overview &amp; 4-Stage Pedagogical Progression</h2>
    <p>
      Modern enterprise full-stack engineering demands mastery across the entire vertical stack—from browser rendering physics and hydration boundaries to edge compute, relational data modeling, distributed queues, and real-time synchronization. In PinIT Career OS, <strong>Course 13: Full-Stack JavaScript Engineering</strong> develops students into Staff Full-Stack Engineers across 60 intensive days:
    </p>
    <div class="quote-box" style="border-left-color: #059669;">
      &bull; <strong>Month 1 (Days 1–30 &bull; 120 Quests): Protocols, Relational ORMs, Auth, RPC, Next.js App Router &amp; NexusStack Commerce Capstone:</strong><br>
      Full-Stack Systems Architecture &amp; Request-Response Physics, HTTP/1.1 vs HTTP/2 Multiplexing &amp; HTTP/3 QUIC Streams, RESTful Resource Modeling, Status Codes &amp; Content Negotiation, Zod Schema Validation &amp; Runtime Type Boundaries, <strong>Milestone 1: HTTP/2 Multiplexing &amp; Request/Response Protocol Engine</strong>, Relational Modeling &amp; Normalization (1NF to BCNF) with PostgreSQL, Type-Safe ORMs (Prisma vs Drizzle) &amp; Query Plan Optimization, Zero-Downtime Database Migrations (Expand-Contract Pattern), Advanced PostgreSQL Indices (B-Tree, GIN, Partial) &amp; N+1 Dataloaders, <strong>Milestone 2: Zero-Downtime Expand/Contract Migration &amp; High-Throughput ORM Engine</strong>, Stateful Sessions vs Stateless Tokens &amp; Cookie Security Flags (HttpOnly, Secure, SameSite), Password Hashing Physics: Argon2id, Salt Rounds &amp; Memory Cost (m_cost), Modern Authentication: OAuth 2.0, OIDC &amp; PKCE Flow, Role-Based Access Control (RBAC) &amp; Attribute-Based Access Control (ABAC), <strong>Milestone 3: OIDC PKCE &amp; Argon2id High-Security Authentication Engine</strong>, End-to-End Type Safety: tRPC Architecture &amp; Shared Schema Contracts, Client Data Synchronization: TanStack Query (React Query) SWR &amp; Invalidation, Optimistic UI Updates &amp; Deterministic Rollbacks, Full-Stack Real-Time: WebSockets (ws / Socket.io) &amp; Heartbeat Reconnection, <strong>Milestone 4: End-to-End Type-Safe RPC &amp; Real-Time WebSocket Gateway</strong>, Next.js App Router Architecture: Server Components (RSC) vs Client Components, Streaming SSR with Suspense &amp; Progressive Hydration, Server Actions, Form Mutations &amp; Progressive Enhancement, Next.js 4-Tier Caching Architecture (Request Memoization, Data Cache, Full Route Cache, Router Cache), <strong>Milestone 5: Next.js App Router Streaming SSR &amp; 4-Tier Cache Engine</strong>, Full-Stack Testing Pyramid: Unit, Integration (Vitest/Supertest) &amp; E2E (Playwright), Core Web Vitals (LCP, INP, CLS) &amp; Bundle Budget Auditing, Full-Stack Security Hardening: CSP, CORS, CSRF &amp; Rate Limiting, Production Containerization: Multi-Stage Distroless Docker &amp; CI/CD, and the <strong>NexusStack Enterprise Full-Stack Commerce Engine Capstone Viva Gate</strong>.<br><br>
      &bull; <strong>Month 2 (Days 31–60 &bull; 120 Quests): Distributed Queues, Edge Compute, CRDTs, Multi-Tenancy, SRE War Rooms &amp; ApexCommerce Master Capstone:</strong><br>
      Background Processing Physics: Event Loop Offloading &amp; BullMQ Architecture, Job Lifecycle, Exponential Backoff Retries &amp; Dead-Letter Queues (DLQ), Sandboxed Workers, Concurrency Limits &amp; Thread Starvation Prevention, Scheduled Jobs (Cron), Delayed Queues &amp; Repeatable Job State, Transactional Outbox Pattern &amp; Debezium Change Data Capture (CDC), <strong>Milestone 6: Resilient Distributed Job Queue &amp; Debezium Outbox Worker Engine</strong>, Edge Runtime Physics: V8 Isolates vs Node.js Containers &amp; Cold Starts, Edge CDN Caching: Stale-While-Revalidate, Cache-Control &amp; Surrogate Keys, Serverless Database Drivers, Connection Pooling (Hyperdrive/Neon) &amp; Cold Latency, Distributed Edge Rate Limiting: Redis Sliding Window &amp; Token Bucket, <strong>Milestone 7: Globally Distributed Edge V8 Isolate &amp; Multi-Tier CDN Caching Gateway</strong>, Local-First Software Architecture &amp; The Offline-First Manifesto, Client-Side Persistence: IndexedDB, Dexie.js &amp; Storage Quotas, Conflict-Free Replicated Data Types (CRDTs): State-based vs Operation-based Math, Collaborative State Sync with Yjs &amp; Binary Update Deltas, WebRTC DataChannels P2P Sync &amp; Signaling Server Architecture, <strong>Milestone 8: Local-First Offline-Ready CRDT Sync Engine</strong>, Multi-Tenant Architecture Topologies: Database-per-tenant vs Schema-per-tenant vs Shared-Table RLS, Read-Write Database Splitting, Read-Replicas &amp; Replication Lag Consistency, Horizontal Database Sharding, Partitioning &amp; Cross-Shard Queries, Polyglot Persistence Architecture: PostgreSQL, Redis, Meilisearch &amp; CDC Pipelines, <strong>Milestone 9: Sovereign Multi-Tenant Database Router &amp; Read-Replica Engine</strong>, Distributed Tracing, OpenTelemetry (OTel) &amp; W3C TraceContext Propagation, High-Performance Structured Logging (Pino) &amp; RED Metric Telemetry (Prometheus), Error Tracking, Breadcrumbs, Sentry Forensics &amp; Production Source Maps, 3 AM SRE War Room Simulation: Memory Leaks, Event Loop Starvation &amp; Connection Pool Outages, <strong>Milestone 10: Autonomous Full-Stack SRE Diagnostic Watchdog Engine</strong>, Micro-Frontend Architectures, Module Federation &amp; Shared Dependency Singletons, Real-World Architecture Deep Dive: High-Scale E-Commerce Checkout Engine, Real-World Architecture Deep Dive: Enterprise Real-Time Collaborative Workspaces, Principal Full-Stack Engineer RFC: Architectural Trade-Off Analysis, and the <strong>ApexCommerce Globally Distributed Omnichannel Full-Stack Enterprise Platform Master Capstone Viva Gate</strong>.
    </div>

    <h2>17.2 Full-Stack JavaScript Engineering Month 1 Day-by-Day Masterclass Specifications (Days 1–30 / 120 Quests)</h2>
  </div>
  `;

  FULLSTACK_MONTH_1_SPECS.forEach((day: any) => {
    h += renderFullStackDayCard(day);
  });

  h += `
  <div class="page-break">
    <div style="background: #064e3b; color: #ffffff; padding: 8pt 12pt; border-radius: 4pt; margin-bottom: 8pt; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h1 style="color: #ffffff; margin: 0; font-size: 14pt; border: none; padding: 0;">Part XVII: Full-Stack Engineering Month 2 — Distributed Queues, Edge Compute, CRDTs, Multi-Tenancy &amp; ApexCommerce Master Capstone</h1>
        <span style="font-size: 8.2pt; color: #a7f3d0;">Course ID: <code>course-fullstack-js</code> &bull; Days 31-60 &bull; <strong>120 Advanced Quests</strong></span>
      </div>
      <div style="text-align: right;">
        <span style="background: #059669; color: #ffffff; font-size: 7.5pt; font-weight: 700; padding: 2px 6px; border-radius: 2px;">Advanced Full-Stack Systems</span><br>
        <span style="font-size: 7.5pt; color: #6ee7b7;">Staff Full-Stack Architect Target</span>
      </div>
    </div>

    <h2>17.3 Full-Stack JavaScript Engineering Month 2 Day-by-Day Masterclass Specifications (Days 31–60 / 120 Quests)</h2>
  </div>
  `;

  FULLSTACK_MONTH_2_SPECS.forEach((day: any) => {
    h += renderFullStackDayCard(day);
  });

  h += `
  <div class="page-break"></div>
  <h2>17.4 Full-Stack Engineering Milestone &amp; Capstone Viva Gates (Milestones 1–10 + Capstone Viva)</h2>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 12%;">Milestone</th>
        <th style="width: 10%;">Day</th>
        <th style="width: 28%;">Milestone Gate Title</th>
        <th style="width: 50%;">Architectural Deliverable &amp; Invariant Defense</th>
      </tr>
    </thead>
    <tbody>
      <tr><td><strong>Milestone 1</strong></td><td>Day 05</td><td>HTTP/2 Multiplexing &amp; Request/Response Protocol Engine</td><td>Multiplexed HTTP/2 streams with Zod schema validation, content negotiation, and binary frame benchmarks.</td></tr>
      <tr><td><strong>Milestone 2</strong></td><td>Day 10</td><td>Zero-Downtime Expand/Contract Migration &amp; ORM Engine</td><td>Multi-phase expand/contract PostgreSQL migration pipeline in Drizzle with composite index optimization.</td></tr>
      <tr><td><strong>Milestone 3</strong></td><td>Day 15</td><td>OIDC PKCE &amp; Argon2id High-Security Auth Engine</td><td>Complete authentication service with Argon2id hashing, encrypted session cookies, and PKCE token exchange.</td></tr>
      <tr><td><strong>Milestone 4</strong></td><td>Day 20</td><td>End-to-End Type-Safe RPC &amp; WebSocket Gateway</td><td>tRPC API router integrated with Fastify, React Query optimistic updates, and heartbeat-protected WebSockets.</td></tr>
      <tr><td><strong>Milestone 5</strong></td><td>Day 25</td><td>Next.js App Router Streaming SSR &amp; 4-Tier Cache Engine</td><td>Next.js App Router application leveraging React Server Components, Suspense streaming, and cache revalidation tags.</td></tr>
      <tr><td><strong>Capstone 1</strong></td><td>Day 30</td><td><strong>Month 1 Capstone Viva Gate</strong></td><td><strong>NexusStack Enterprise Full-Stack Commerce Engine:</strong> End-to-end commerce platform uniting RSC streaming, tRPC, PostgreSQL, and oral defense before Senior Full-Stack Architects.</td></tr>
      <tr><td><strong>Milestone 6</strong></td><td>Day 35</td><td>Resilient Distributed Job Queue &amp; Debezium Outbox Worker</td><td>BullMQ job queue with sandboxed workers, exponential backoff retries, dead-letter queues, and transactional outbox.</td></tr>
      <tr><td><strong>Milestone 7</strong></td><td>Day 40</td><td>Globally Distributed Edge V8 Isolate Gateway</td><td>Cloudflare Workers / V8 isolate API gateway with surrogate key caching, Redis sliding window rate limiting, and Hyperdrive pools.</td></tr>
      <tr><td><strong>Milestone 8</strong></td><td>Day 45</td><td>Local-First Offline-Ready CRDT Sync Engine</td><td>IndexedDB-backed local-first workspace synchronizing Yjs binary update deltas over WebRTC DataChannels and WebSockets.</td></tr>
      <tr><td><strong>Milestone 9</strong></td><td>Day 50</td><td>Sovereign Multi-Tenant Database Router Engine</td><td>Multi-tenant routing gateway with AsyncLocalStorage tenant propagation, PostgreSQL RLS, and read-replica primary stickiness.</td></tr>
      <tr><td><strong>Milestone 10</strong></td><td>Day 55</td><td>Autonomous Full-Stack SRE Diagnostic Watchdog Engine</td><td>Real-time SRE monitor scraping Prometheus RED metrics, tracking OTel spans, and triggering automated circuit breakers.</td></tr>
      <tr><td><strong>Master Capstone</strong></td><td>Day 60</td><td><strong>Month 2 Master Capstone Viva</strong></td><td><strong>ApexCommerce Globally Distributed Omnichannel Full-Stack Enterprise Platform:</strong> Complete enterprise commerce ecosystem uniting Next.js App Router, tRPC, PostgreSQL RLS, BullMQ, Yjs CRDTs, OpenTelemetry, and live chaos defense before Faculty Review Board.</td></tr>
    </tbody>
  </table>
  `;
"""

# Place part_xvii right before `return h;` in buildDeepMasterclassesHtml()
# Let's locate the return h; right after 16.4 table
anchor_ai_table = "ApexIntelligence Globally Distributed Autonomous AI Foundation Platform"
pos_ai = content.find(anchor_ai_table)
if pos_ai == -1:
    raise Exception("Could not find ApexIntelligence table anchor in compiler")

pos_return = content.find("return h;", pos_ai)
if pos_return == -1:
    raise Exception("Could not find return h; after AI section")

content = content[:pos_return] + part_xvii + "\n  " + content[pos_return:]

with open("scripts/visuals/compile-500p-srs-pdf.mts", "w", encoding="utf-8") as f:
    f.write(content)

print("Successfully patched compile-500p-srs-pdf.mts with Part XVII!")
