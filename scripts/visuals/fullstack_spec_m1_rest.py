# scripts/visuals/fullstack_spec_m1_rest.py
# Course 13: Full-Stack JavaScript Engineering (course-fullstack-js)
# Month 1: Days 16-30 (Blocks 4-6) - 60 Quests Total

FULLSTACK_M1_PART2 = [
  # =========================================================================
  # BLOCK 4: FRONTEND-BACKEND BRIDGE & TYPE-SAFE RPC (Days 16-20)
  # =========================================================================
  {
    "day": 16,
    "month": 1,
    "blockNum": 4,
    "title": "End-to-End Type Safety: tRPC Architecture, Query/Mutation Handlers & Client Proxies",
    "stageName": "Stage 3: Systems & Optimization",
    "stageNum": 4,
    "pedagogicalRole": "Full-Stack Contract (tRPC & End-to-End Types)",
    "spokenGoal": "Eliminate API drift forever: master tRPC. Understand how TypeScript compiler type inference allows frontend clients to call backend procedures with zero code generation and zero build steps. Analyze how AppRouter type exports provide compile-time autocompletion, input validation via Zod, and compile-time error detection when backend API schemas change.",
    "conceptInvariant": "Zero-Drift Type Contract Invariant: Backend input schemas and procedure return types must be inferred directly by the frontend TypeScript compiler via import type { AppRouter }; any breaking backend change must immediately cause a TypeScript compilation error in the frontend build.",
    "failureMode": "Renaming a backend database field in a traditional REST API without updating frontend interfaces, causing the client code to silently read undefined in production, rendering blank user profiles.",
    "tryItFriction": "Build an end-to-end tRPC router in TypeScript: declare queries and mutations with strict Zod input validation, export the AppRouter type, instantiate a createTRPCProxyClient, and execute typed calls with full IDE autocompletion.",
    "socraticHints": [
      "Why does tRPC require 'import type { AppRouter }' rather than a standard value import?",
      "Because you must NEVER import backend runtime code into frontend bundles! 'import type' tells the compiler to extract only type declarations and completely erase the import during compilation, adding 0 bytes to the client bundle!",
      "The client uses a JavaScript Proxy to translate function calls into HTTP fetch requests."
    ],
    "situationalPuzzle": {
      "scenario": "A development team uses tRPC. An engineer updates a procedure input: id: z.string().uuid() to id: z.number(). When the developer builds the frontend Next.js app, the build immediately halts with: 'Type string is not assignable to type number in UserCard.tsx'. What full-stack guarantee just saved the team from a production bug?",
      "options": [
        "Docker stopped the build.",
        "Compile-Time Contract Enforcement: Because the frontend directly references the inferred AppRouter type contract, breaking schema changes are caught by the TypeScript compiler during local development and CI/CD, mathematically preventing runtime client-server type drift.",
        "The browser blocked the request.",
        "tRPC regenerated all frontend files."
      ],
      "answerIdx": 1,
      "debrief": "In traditional REST APIs, type drift is only caught at runtime by angry users or broken integration tests. With tRPC, type contracts are checked at compile time. If the backend changes an input or output type, any mismatched frontend component fails to compile."
    },
    "quests": [
      {
        "id": "fs-m1-d16-q1",
        "name": "Proxy-Based RPC Protocol Mechanics",
        "type": "concept",
        "desc": "Diagram how JavaScript Proxy objects intercept property access (trpc.user.getById.query) and serialize HTTP requests."
      },
      {
        "id": "fs-m1-d16-q2",
        "name": "Client Bundle Leakage Auditor",
        "type": "detective",
        "desc": "Audit Webpack/Vite bundle outputs to ensure backend database libraries are never bundled into client bundles."
      },
      {
        "id": "fs-m1-d16-q3",
        "name": "TypeScript tRPC Router & Client Suite",
        "type": "mastery",
        "desc": "Implement a full tRPC backend with middleware context, Zod validation, and typed client proxies in TypeScript."
      },
      {
        "id": "fs-m1-d16-q4",
        "name": "3 AM SRE: Silent Runtime Null Bug After REST API Change",
        "type": "incident",
        "desc": "Diagnose an outage where an untyped REST field rename caused production checkout forms to submit null prices."
      }
    ]
  },
  {
    "day": 17,
    "month": 1,
    "blockNum": 4,
    "title": "TanStack Query (React Query): Stale-While-Revalidate, Garbage Collection & Cache Invalidation",
    "stageName": "Stage 3: Systems & Optimization",
    "stageNum": 4,
    "pedagogicalRole": "State Management (Server State vs Client State)",
    "spokenGoal": "Master server state synchronization: analyze TanStack Query. Differentiate between Client State (ephemeral UI toggles) and Server State (asynchronously cached remote data). Understand the Stale-While-Revalidate (SWR) cache lifecycle: fresh -> stale -> inactive -> deleted. Master query keys, staleTime vs gcTime, and targeted cache invalidation via queryClient.invalidateQueries().",
    "conceptInvariant": "Server State Ownership Invariant: Data fetched from an external API is not owned by the client; it is an ephemeral local cache of server state. Setting staleTime > 0 prevents redundant network roundtrips, while structured query keys enable surgical cache invalidation.",
    "failureMode": "Storing server data in global Redux/Zustand stores and manually dispatching fetch actions inside useEffect, causing duplicate network requests on every re-render and displaying stale, desynchronized data after mutations.",
    "tryItFriction": "Build an in-memory SWR Query Cache in TypeScript: implement a query client that caches fetch promises by composite key (['posts', id]), serves stale cache immediately while triggering background revalidation, and garbage-collects unused keys after gcTime.",
    "socraticHints": [
      "What is the difference between staleTime and gcTime in TanStack Query?",
      "staleTime controls WHEN data needs refetching (while fresh, it serves from cache without network calls); gcTime controls HOW LONG inactive data stays in memory before being garbage collected!",
      "If staleTime is 0 (default), queries refetch in the background on every component mount or window focus."
    ],
    "situationalPuzzle": {
      "scenario": "A dashboard has 4 widgets displaying the current logged-in user's profile. When the page loads, the browser network tab shows 4 identical requests to GET /api/user. An engineer wraps the calls in TanStack Query with queryKey: ['currentUser']. The network tab now shows exactly 1 request. What mechanism consolidated the calls?",
      "options": [
        "The browser blocked 3 requests.",
        "Automatic Request Deduplication & In-Flight Promise Sharing: TanStack Query identifies identical query keys across concurrent component mounts. Instead of firing 4 network calls, it initiates ONE network request and shares the in-flight Promise across all 4 components, updating them simultaneously upon resolution.",
        "React Query cached the data in cookies.",
        "The server combined the requests."
      ],
      "answerIdx": 1,
      "debrief": "TanStack Query automatically deduplicates requests sharing the same query key. If multiple components mount and request ['currentUser'] at the same time, TanStack Query executes a single network call and broadcasts the resolved data to all subscribers."
    },
    "quests": [
      {
        "id": "fs-m1-d17-q1",
        "name": "SWR Cache State Machine Formalism",
        "type": "concept",
        "desc": "Diagram state transitions between Fresh, Stale, Fetching, Inactive, and Garbage Collected in TanStack Query."
      },
      {
        "id": "fs-m1-d17-q2",
        "name": "Redundant Network Fetch Profiler",
        "type": "detective",
        "desc": "Profile an un-cached React application to measure wasted network bytes caused by redundant component mounts."
      },
      {
        "id": "fs-m1-d17-q3",
        "name": "TypeScript In-Memory SWR Cache Client",
        "type": "mastery",
        "desc": "Implement a lightweight server state cache in TypeScript supporting composite keys, staleTime, and invalidation."
      },
      {
        "id": "fs-m1-d17-q4",
        "name": "3 AM SRE: Stale Cart Quantity Purchase Outage",
        "type": "incident",
        "desc": "Fix an e-commerce incident where a stale cache allowed users to purchase out-of-stock items due to missing invalidation."
      }
    ]
  },
  {
    "day": 18,
    "month": 1,
    "blockNum": 4,
    "title": "Optimistic UI Updates: Rollback Mechanics, Cache Patches & Race Condition Prevention",
    "stageName": "Stage 3: Systems & Optimization",
    "stageNum": 3,
    "pedagogicalRole": "User Experience Physics (Optimistic Updates & Rollbacks)",
    "spokenGoal": "Deliver instant, zero-latency user experiences: master Optimistic UI Updates. Understand how to mutate local cache state immediately upon user action (e.g., liking a post or toggling a checkbox) before the network request finishes. Implement rollback snapshots to restore exact prior state if the server returns an error, and prevent race conditions using AbortController and mutation timestamps.",
    "conceptInvariant": "Optimistic State Invertibility Invariant: Every optimistic cache mutation must capture an immutable snapshot of previous state prior to mutation; if the server request fails, the cache must roll back atomically to the snapshot to prevent UI-database desynchronization.",
    "failureMode": "Updating local UI state optimistically on a 'Delete Account' button without rollback handling, causing the UI to show the account deleted even though the backend returned a 500 error, leaving the user with a broken phantom state.",
    "tryItFriction": "Implement an Optimistic Mutation Handler with Rollback in TypeScript: capture previous cache state in onMutate, patch the cache optimistically, simulate an asynchronous network failure in the mutation, and execute onError rollback restoring the exact original cache.",
    "socraticHints": [
      "What happens if a user clicks 'Like' twice rapidly with optimistic updates?",
      "If the first mutation fails after the second succeeds, an out-of-order rollback could overwrite the newer successful state! You must cancel outgoing refetches (queryClient.cancelQueries) before applying optimistic updates!",
      "Always cancel in-flight queries for that key before taking your snapshot."
    ],
    "situationalPuzzle": {
      "scenario": "A task management app allows users to reorder to-do items via drag-and-drop. An engineer implements optimistic UI updates. When a user drags 3 items quickly on a flaky 3G connection, the items jump around erratically and settle in the wrong order. What race condition occurred, and how is it fixed?",
      "options": [
        "The drag-and-drop library had a CSS bug.",
        "Out-of-Order Network Response Race Condition: Rapid successive mutations fired overlapping requests. Request 1 resolved AFTER Request 3, overwriting the newer state with older data. The fix: 1) Cancel active queries for that key before applying new optimistic updates; 2) Tag mutations with monotonic sequence timestamps and discard stale responses.",
        "The database dropped the updates.",
        "Optimistic UI should never be used for sorting."
      ],
      "answerIdx": 1,
      "debrief": "Rapid concurrent mutations on flaky networks produce out-of-order responses. Canceling in-flight background queries before applying new updates and attaching sequence timestamps ensure that older, lagging responses cannot overwrite newer optimistic state."
    },
    "quests": [
      {
        "id": "fs-m1-d18-q1",
        "name": "Optimistic Mutation Lifecycle Mechanics",
        "type": "concept",
        "desc": "Diagram the chronological interaction between User Action, Cache Patch, Network Dispatch, Server Response, and Rollback."
      },
      {
        "id": "fs-m1-d18-q2",
        "name": "Race Condition Mutation Fuzzer",
        "type": "detective",
        "desc": "Simulate 50 rapid concurrent optimistic mutations over variable network latency to detect state inversion bugs."
      },
      {
        "id": "fs-m1-d18-q3",
        "name": "TypeScript Optimistic Mutation Engine",
        "type": "mastery",
        "desc": "Implement an optimistic mutation pipeline in TypeScript with snapshot rollback, query cancellation, and toast alerts."
      },
      {
        "id": "fs-m1-d18-q4",
        "name": "3 AM SRE: Ghost Data Desync in Collaborative Kanban",
        "type": "incident",
        "desc": "Resolve a production bug where failed optimistic updates left phantom tasks visible on customer project boards."
      }
    ]
  },
  {
    "day": 19,
    "month": 1,
    "blockNum": 4,
    "title": "Real-Time Bidirectional Synchronization: WebSockets, Socket.IO & Heartbeat Keepalive",
    "stageName": "Stage 3: Systems & Optimization",
    "stageNum": 3,
    "pedagogicalRole": "Real-Time Protocols (WebSockets & Socket.IO Architecture)",
    "spokenGoal": "Implement real-time collaboration: contrast HTTP polling, Long-Polling, Server-Sent Events (SSE), and WebSockets (RFC 6455). Walk through the WebSocket HTTP Upgrade handshake (Connection: Upgrade, Sec-WebSocket-Key). Implement binary framing, heartbeat ping/pong keepalives to detect zombie connections, room-based broadcasting, and horizontal scaling across multiple servers using Redis Pub/Sub adapters.",
    "conceptInvariant": "WebSocket Statefulness & Heartbeat Invariant: WebSockets are persistent, stateful TCP connections; dead sockets (caused by client power loss or network drops) do not send TCP FIN packets and must be detected and pruned via periodic server-initiated Ping/Pong heartbeat frames.",
    "failureMode": "Deploying a WebSocket server without heartbeat keepalives, allowing thousands of dead client sockets to accumulate in OS memory indefinitely, exhausting file descriptors and blocking new connections.",
    "tryItFriction": "Build a WebSocket Server with Heartbeat and Reconnection in TypeScript: implement the HTTP upgrade handler, send ping frames every 30s, terminate unacknowledged sockets, broadcast typed messages to named rooms, and implement exponential backoff reconnection on the client.",
    "socraticHints": [
      "Why does a WebSocket cluster with 2 servers require Redis Pub/Sub to broadcast messages?",
      "Because Client A is connected to Server 1, and Client B is connected to Server 2! Server 1 has no direct socket connection to Client B without a shared message broker like Redis!",
      "The Redis adapter broadcasts messages across all server nodes in the cluster."
    ],
    "situationalPuzzle": {
      "scenario": "A collaborative whiteboard app runs on 4 Kubernetes pods behind an Application Load Balancer. Users report that when User A draws on the board, User B does not see the drawings unless they refresh the page. Both users are connected to WebSockets. What architectural component is missing from the WebSocket cluster?",
      "options": [
        "The load balancer needs more bandwidth.",
        "Distributed Pub/Sub Adapter (Redis Streams / Socket.IO Redis Adapter): Load balancing distributes WebSocket connections across different server pods. Server 1 holds User A's socket, but Server 3 holds User B's socket. Without a distributed message broker (Redis Pub/Sub) linking the pods, broadcasts remain trapped on the local pod.",
        "WebSockets do not support drawings.",
        "Kubernetes pods cannot talk to each other."
      ],
      "answerIdx": 1,
      "debrief": "WebSockets are stateful. When traffic is load-balanced across multiple pods, clients are partitioned across different servers. To broadcast messages to all connected clients regardless of which pod they are on, servers must publish events to a shared message broker (Redis Pub/Sub) subscribed to by all pods."
    },
    "quests": [
      {
        "id": "fs-m1-d19-q1",
        "name": "WebSocket Upgrade & Framing Protocol Math",
        "type": "concept",
        "desc": "Diagram the HTTP 101 Switching Protocols handshake and dissect the 14-byte WebSocket binary frame header format."
      },
      {
        "id": "fs-m1-d19-q2",
        "name": "Zombie Connection & FD Leak Profiler",
        "type": "detective",
        "desc": "Simulate 5,000 ungraceful client disconnects and monitor server file descriptor leaks under varying ping intervals."
      },
      {
        "id": "fs-m1-d19-q3",
        "name": "TypeScript Multi-Node WebSocket Gateway",
        "type": "mastery",
        "desc": "Build a scalable WebSocket gateway in TypeScript with Redis Pub/Sub multi-pod broadcasting and room channels."
      },
      {
        "id": "fs-m1-d19-q4",
        "name": "3 AM SRE: File Descriptor Exhaustion Outage",
        "type": "incident",
        "desc": "Recover from an outage where accumulating zombie WebSocket connections crashed an enterprise collaboration server."
      }
    ]
  },
  {
    "day": 20,
    "month": 1,
    "blockNum": 4,
    "title": "Milestone 4: Type-Safe Real-Time Collaboration Gateway",
    "stageName": "Stage 3: Systems & Optimization",
    "stageNum": 3,
    "pedagogicalRole": "Architectural Synthesis (Milestone Gate 4)",
    "spokenGoal": "Synthesize type-safe real-time communication: engineer a Type-Safe Real-Time Collaboration Gateway in TypeScript. Unify tRPC procedure calls with WebSocket subscriptions (tRPC WebSockets), deliver end-to-end typed event broadcasting across multi-user document rooms, integrate TanStack Query optimistic cache patches with automatic rollback, and scale room events via Redis Pub/Sub.",
    "conceptInvariant": "End-to-End Real-Time Contract Invariant: Real-time event payloads broadcast over WebSockets must adhere to the exact same compiled TypeScript schema and Zod validation contracts as standard REST/RPC procedures; un-typed event streams are strictly prohibited.",
    "failureMode": "Broadcasting raw unvalidated JSON payloads over WebSockets, causing a client on an older version of the frontend to crash with TypeError: Cannot read properties of undefined upon receiving an unexpected payload shape.",
    "tryItFriction": "Execute the Milestone 4 verification suite: connect 3 simulated browser clients to a collaborative document room, execute concurrent tRPC mutations, verify optimistic UI updates on client 1, assert real-time WebSocket broadcast to clients 2 and 3 under 25ms, and test graceful reconnection after network disconnection.",
    "socraticHints": [
      "How does tRPC support real-time WebSocket subscriptions?",
      "tRPC procedures can use observable subscriptions: t.procedure.subscription(() => observable(emit => ...)). The client subscribes using trpc.roomEvents.useSubscription() with full type safety!",
      "Events emitted on the server are fully typed on the client."
    ],
    "situationalPuzzle": {
      "scenario": "During the Milestone 4 review, an architect asks: 'If Client A and Client B concurrently edit the same text block at the exact same millisecond, how does your gateway resolve the write conflict and ensure both screens show identical text without data loss?' What is the architectural solution?",
      "options": [
        "The server randomly picks one edit and deletes the other.",
        "Conflict-Free Replicated Data Types (CRDTs) or Operational Transformation (OT): The gateway applies deterministic convergence logic (like Yjs or Automerge). Edits are modeled as commutative operations with Lamport timestamps, allowing concurrent edits to merge deterministically on all clients without data loss.",
        "The server locks the document for 1 hour.",
        "WebSockets do not support simultaneous typing."
      ],
      "answerIdx": 1,
      "debrief": "Concurrent text collaboration requires deterministic conflict resolution. Passing raw replacement strings causes race conditions where the last writer clobbers earlier text. Using CRDTs (like Yjs) or Operational Transformation (OT) ensures mathematical convergence across all connected peers."
    },
    "quests": [
      {
        "id": "fs-m1-d20-q1",
        "name": "Milestone 4 Architecture Blueprint",
        "type": "concept",
        "desc": "Document data flows, WebSocket subscriptions, Redis Pub/Sub topology, and CRDT convergence for the Gateway."
      },
      {
        "id": "fs-m1-d20-q2",
        "name": "Concurrent Document Edit Conflict Tester",
        "type": "detective",
        "desc": "Simulate 100 simultaneous keystrokes across 5 distributed clients to verify deterministic text convergence."
      },
      {
        "id": "fs-m1-d20-q3",
        "name": "Milestone 4 Core Implementation",
        "type": "mastery",
        "desc": "Deliver the complete TypeScript Type-Safe Real-Time Collaboration Gateway with tRPC subscriptions and Redis scaling."
      },
      {
        "id": "fs-m1-d20-q4",
        "name": "Milestone 4 Viva Defense Gate",
        "type": "incident",
        "desc": "Defend the real-time latency budgets, connection lifecycle bounds, and type safety before the Principal Architect."
      }
    ]
  },

  # =========================================================================
  # BLOCK 5: MODERN FULL-STACK FRAMEWORKS: NEXT.JS APP ROUTER & SERVER ACTIONS (Days 21-25)
  # =========================================================================
  {
    "day": 21,
    "month": 2,
    "blockNum": 5,
    "title": "React Server Components (RSC) Wire Protocol & Streaming Server-Side Rendering (SSR)",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Modern Framework Architecture (RSC & Streaming SSR)",
    "spokenGoal": "Demystify React Server Components (RSC): understand the revolutionary boundary between Server Components (zero client JavaScript bundle impact, direct access to databases and backend secrets) and Client Components ('use client' directive, interactive event handlers, hooks). Analyze the RSC Wire Protocol (JSON-like serialized flight stream of component trees) and implement Streaming SSR with React Suspense.",
    "conceptInvariant": "Zero-Bundle Server Component Invariant: Code executed in React Server Components is stripped completely from client JavaScript bundles; heavy dependencies (parsers, database drivers, markdown renderers) run exclusively on the server, shipping zero bytes of JavaScript to the browser.",
    "failureMode": "Adding 'use client' at the top of a page layout containing a 2MB markdown parser, causing the entire 2MB library to be bundled and sent to every mobile user, destroying page load speed and Core Web Vitals.",
    "tryItFriction": "Build an RSC Wire Protocol parser in TypeScript: take an RSC flight stream containing component tags, props, and client module references (e.g., 0:[\"$\",\"div\",null,{\"children\":...}]), parse the serialized tree, and simulate streaming rendering via React Suspense.",
    "socraticHints": [
      "Can a Server Component import a Client Component? Can a Client Component import a Server Component?",
      "Server Components CAN import Client Components directly. But Client Components CANNOT import Server Components directly—they can only receive them as 'children' props!",
      "This preserves the server-only execution boundary."
    ],
    "situationalPuzzle": {
      "scenario": "A Next.js e-commerce page has a slow database query that takes 1,500ms to fetch user reviews. In legacy SSR (Pages Router), the entire page remained blank for 1,500ms before returning any HTML. With Next.js App Router and Streaming SSR, the hero product image, title, and price render on the user's screen in 80ms, while a spinner renders over reviews until they resolve. What React primitive enabled this?",
      "options": [
        "The database was moved to the browser.",
        "React Suspense & HTTP Transfer-Encoding: Chunked: The reviews component is wrapped in <Suspense fallback={<ReviewsSkeleton />}>. The server immediately streams the initial HTML shell to the browser in 80ms, leaves the HTTP connection open, and streams the resolved reviews HTML chunk over the wire when the database query completes.",
        "The reviews were deleted.",
        "Server Components disable HTML streaming."
      ],
      "answerIdx": 1,
      "debrief": "Streaming SSR uses React Suspense and HTTP chunked transfer encoding. Slow components wrapped in Suspense do not block the page shell. The browser displays the fast interactive content immediately, and the server streams the slow components as they finish, dramatically improving Time-To-First-Byte (TTFB) and Largest Contentful Paint (LCP)."
    },
    "quests": [
      {
        "id": "fs-m1-d21-q1",
        "name": "RSC Wire Protocol Serialization Mechanics",
        "type": "concept",
        "desc": "Analyze the format of the React flight stream and explain how client module references are resolved on the browser."
      },
      {
        "id": "fs-m1-d21-q2",
        "name": "Client Bundle Weight Auditor",
        "type": "detective",
        "desc": "Analyze Next.js build stats across pure Client Components vs Server Components with heavy dependencies."
      },
      {
        "id": "fs-m1-d21-q3",
        "name": "TypeScript Streaming HTML & Suspense Simulator",
        "type": "mastery",
        "desc": "Implement a streaming SSR HTTP server in TypeScript that emits chunked HTML shells with Suspense placeholders."
      },
      {
        "id": "fs-m1-d21-q4",
        "name": "3 AM SRE: Accidental Secret Leakage via Client Component",
        "type": "incident",
        "desc": "Investigate a security incident where placing 'use client' on a config file accidentally exposed private API keys."
      }
    ]
  },
  {
    "day": 22,
    "month": 1,
    "blockNum": 5,
    "title": "Next.js App Router Architecture: Route Handlers, Layouts & Intercepting Routes",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Framework Mastery (App Router Layouts & Routing Topologies)",
    "spokenGoal": "Master the Next.js App Router: understand file-system routing conventions (page.tsx, layout.tsx, template.tsx, loading.tsx, error.tsx, not-found.tsx). Design Nested Layouts that preserve state across route navigations, build Route Handlers (route.ts) with custom HTTP verbs, and implement advanced routing topologies: Parallel Routes (@slot) and Intercepting Routes ((..)photo) for modal navigation.",
    "conceptInvariant": "Layout State Preservation Invariant: In the Next.js App Router, layout.tsx components do not re-render or re-mount during child route navigations; layouts preserve their local state and scroll position while child pages swap seamlessly.",
    "failureMode": "Placing stateful modal dialogs in root layout with global search params rather than Intercepting Routes, causing page refreshes to lose the background page context and breaking browser Back button navigation.",
    "tryItFriction": "Build an Intercepting Route Modal in Next.js/TypeScript: create a feed page with photos, intercept clicks on /photo/[id] to render a modal overlay on top of the feed while updating the URL, and ensure refreshing the page directly loads the standalone photo page.",
    "socraticHints": [
      "Why does Next.js have both layout.tsx and template.tsx?",
      "layout.tsx persists state and does NOT re-mount when navigating between child pages. template.tsx creates a NEW instance and re-mounts on every navigation (useful for enter/exit animations or logging page views)!",
      "Use layout for persistent sidebars; use template when you want fresh component state."
    ],
    "situationalPuzzle": {
      "scenario": "A dashboard has an analytics page at /dashboard/analytics. An unhandled exception occurs inside a chart component on this page. In legacy web apps, the entire browser window crashed to a blank white screen. In Next.js App Router, the sidebar, header, and user profile remain fully functional, and only the chart area displays a 'Failed to load chart' card with a retry button. What component boundary achieved this?",
      "options": [
        "The browser sandbox.",
        "Nested error.tsx Error Boundaries: Next.js automatically wraps route segments in React Error Boundaries defined by error.tsx. When a child component throws, the error boundary catches it locally, isolating the failure to that route subtree while keeping parent layouts fully interactive.",
        "V8 try/catch global handler.",
        "Next.js disabled all exceptions."
      ],
      "answerIdx": 1,
      "debrief": "The App Router uses nested error boundaries (error.tsx). If a single widget or sub-page crashes, the error is isolated to that specific layout slot. The user can still navigate the sidebar, access settings, or click 'Try Again' without a global white-screen crash."
    },
    "quests": [
      {
        "id": "fs-m1-d22-q1",
        "name": "App Router File-System Conventions & Hierarchy",
        "type": "concept",
        "desc": "Map how Next.js wraps nested routes inside Error, Suspense, Template, and Layout boundaries."
      },
      {
        "id": "fs-m1-d22-q2",
        "name": "Layout Re-Mounting & State Loss Inspector",
        "type": "detective",
        "desc": "Inspect component lifecycle logs to verify that layout state is strictly preserved during sub-route navigation."
      },
      {
        "id": "fs-m1-d22-q3",
        "name": "Parallel & Intercepting Modal Route Suite",
        "type": "mastery",
        "desc": "Implement a full Instagram-style photo feed with URL-intercepted modal views and direct-link fallbacks in Next.js."
      },
      {
        "id": "fs-m1-d22-q4",
        "name": "3 AM SRE: Global White-Screen Crash via Missing Error Boundary",
        "type": "incident",
        "desc": "Resolve a high-severity incident where an unhandled third-party script error crashed an un-isolated root layout."
      }
    ]
  },
  {
    "day": 23,
    "month": 1,
    "blockNum": 5,
    "title": "Server Actions: Progressive Enhancement, Form Submissions & Server Mutations",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Data Mutation Architecture (Server Actions & Progressive Enhancement)",
    "spokenGoal": "Mutate server state with modern primitives: master React Server Actions ('use server'). Understand how Server Actions eliminate manual API boilerplate (fetch, URLs, route handlers) by compiling into POST endpoints with encrypted action IDs. Build forms that function even with JavaScript disabled (Progressive Enhancement), implement optimistic pending states with useActionState and useOptimistic, and revalidate cache tags.",
    "conceptInvariant": "Progressive Enhancement Invariant: Server Actions bound to HTML <form action={action}> must execute successfully via standard browser HTTP POST form submissions even if JavaScript fails to load or is disabled on the client.",
    "failureMode": "Writing a Server Action that takes untrusted client objects directly without validation, assuming that TypeScript types provide runtime security, allowing malicious callers to invoke the POST endpoint with arbitrary JSON payloads.",
    "tryItFriction": "Build a Server Action Form with Validation in TypeScript: define a Server Action with 'use server', validate formData using Zod, return structured form state { errors, success }, bind to useActionState in a client component, and display inline field errors.",
    "socraticHints": [
      "Are Server Actions private internal functions that only your frontend can call?",
      "NO! A Server Action compiles into a public HTTP POST endpoint with a unique action ID! Anyone can send POST requests to it with curl or Postman!",
      "You MUST authenticate the user and validate all input arguments inside the Server Action just like a REST endpoint."
    ],
    "situationalPuzzle": {
      "scenario": "A developer updates a user's role using a Server Action: export async function updateRole(userId: string, role: string) { 'use server'; await db.user.update(...); }. The developer only renders the role dropdown for admins in the UI. A regular user discovers the action ID in network devtools and uses curl to send a POST request upgrading themselves to admin. What security vulnerability was exposed?",
      "options": [
        "A cross-site scripting attack.",
        "Missing Server-Side Authorization Barrier: Server Actions are public HTTP endpoints accessible by anyone on the internet! Hiding the UI button on the client provides zero security. The Server Action must verify the caller's session and permissions (if (!session.isAdmin) throw new Error('Unauthorized')) on every invocation.",
        "Server Actions only work over HTTPS.",
        "The developer should use Express instead."
      ],
      "answerIdx": 1,
      "debrief": "Server Actions are publicly reachable HTTP endpoints created by the framework. Never rely on client UI hiding for security. Every Server Action that mutates data must explicitly authenticate the caller and verify authorization before executing database queries."
    },
    "quests": [
      {
        "id": "fs-m1-d23-q1",
        "name": "Server Action Wire Protocol Mechanics",
        "type": "concept",
        "desc": "Diagram how Next.js compiles 'use server' directives into internal POST endpoints with action hashes and boundary cookies."
      },
      {
        "id": "fs-m1-d23-q2",
        "name": "Server Action Authorization Penetration Suite",
        "type": "detective",
        "desc": "Audit 20 Server Actions to identify missing authentication checks and unvalidated parameter bindings."
      },
      {
        "id": "fs-m1-d23-q3",
        "name": "TypeScript Progressive Enhancement Form Engine",
        "type": "mastery",
        "desc": "Implement a full form submission system in Next.js using Server Actions, Zod validation, and useActionState."
      },
      {
        "id": "fs-m1-d23-q4",
        "name": "3 AM SRE: Privilege Escalation via Exposed Server Action",
        "type": "incident",
        "desc": "Fix a critical vulnerability where an unauthorized user upgraded their tier via an unauthenticated Server Action."
      }
    ]
  },
  {
    "day": 24,
    "month": 1,
    "blockNum": 5,
    "title": "Full-Stack Caching Layers: Request Memoization, Data Cache, Full Route Cache & Invalidation",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Performance Engineering (Next.js Multi-Tier Caching & Invalidation)",
    "spokenGoal": "Demystify the 4 caching tiers of Next.js: 1) Request Memoization (deduplicating identical fetch() calls within a single render pass); 2) Data Cache (persistent cross-request fetch caching with revalidate options); 3) Full Route Cache (static HTML/RSC caching at build or revalidation time); 4) Router Cache (in-memory client-side route navigation cache). Master cache tags and revalidateTag() vs revalidatePath().",
    "conceptInvariant": "Cache Tier Decoupling Invariant: Request Memoization lasts for the lifetime of a single render; Data Cache persists across user sessions and server restarts; Full Route Cache serves static HTML; client Router Cache avoids refetching recently visited layouts.",
    "failureMode": "Failing to pass revalidate or cache tags to fetch() calls on an admin inventory page, causing the page to be statically pre-rendered at build time and serving outdated inventory levels permanently to shoppers.",
    "tryItFriction": "Build a Multi-Tier Cache Simulator in TypeScript: implement request memoization deduplication, a persistent data cache with TTL revalidation, and a tag-based invalidator where revalidateTag('products') atomically purges all matching cache entries.",
    "socraticHints": [
      "Why is revalidateTag('products') better than revalidatePath('/products')?",
      "revalidatePath only invalidates that specific URL. If products appear on the homepage, search page, and category page, revalidateTag invalidates all data fetches tagged with 'products' across the ENTIRE website in one call!",
      "Use granular cache tags on all fetch requests."
    ],
    "situationalPuzzle": {
      "scenario": "An e-commerce site updates a product's price from $100 to $80 in the database using a Server Action. The Server Action calls revalidateTag('product-123'). However, when the user navigates back to the product page using the browser Back button, the price still shows $100 for 30 seconds. What caching layer is serving the old price?",
      "options": [
        "The database failed to save the price.",
        "Client-Side Router Cache: Next.js stores recently visited route segments in the browser's in-memory Router Cache for 30 seconds (or 5 minutes for static routes). The Back button reads from this local browser memory. Calling router.refresh() or setting dynamic server revalidation forces the client cache to sync.",
        "The user's computer cached the DNS record.",
        "Next.js does not support price updates."
      ],
      "answerIdx": 1,
      "debrief": "The client-side Router Cache lives entirely in the browser memory of the active session. When navigating back, the browser displays the cached route payload without hitting the server. Triggering router.refresh() clears this client cache and fetches the newly invalidated server state."
    },
    "quests": [
      {
        "id": "fs-m1-d24-q1",
        "name": "Next.js 4-Tier Caching Architecture Taxonomy",
        "type": "concept",
        "desc": "Diagram the complete lifecycle, storage location, and invalidation mechanisms of the 4 Next.js caching tiers."
      },
      {
        "id": "fs-m1-d24-q2",
        "name": "Cache Tag Invalidation Audit Suite",
        "type": "detective",
        "desc": "Audit 50 API endpoints to verify that all data mutations trigger proper revalidateTag() events across dependent pages."
      },
      {
        "id": "fs-m1-d24-q3",
        "name": "TypeScript Multi-Tier Cache Manager",
        "type": "mastery",
        "desc": "Implement a full 4-tier cache simulator in TypeScript with request deduplication, persistent storage, and tag invalidation."
      },
      {
        "id": "fs-m1-d24-q4",
        "name": "3 AM SRE: Stale Price Quoted to 50,000 Black Friday Shoppers",
        "type": "incident",
        "desc": "Resolve a production disaster where an un-invalidated Data Cache served an incorrect promotion price during flash sales."
      }
    ]
  },
  {
    "day": 25,
    "month": 1,
    "blockNum": 5,
    "title": "Milestone 5: Production Next.js App Router Enterprise Suite",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Architectural Synthesis (Milestone Gate 5)",
    "spokenGoal": "Synthesize modern full-stack web applications: engineer a complete Next.js App Router Enterprise Suite in TypeScript. Deliver nested layouts with state preservation, React Server Components streaming data over Suspense boundaries, authenticated Server Actions with Zod validation, granular cache tagging with instant tag invalidation, and isolated error.tsx recovery.",
    "conceptInvariant": "Full-Stack Separation of Concerns Invariant: Server Components fetch data securely without API roundtrips; Client Components handle interactive UI state; Server Actions execute validated mutations; caching layers maximize performance while guaranteeing consistency.",
    "failureMode": "Mixing database connection code inside Client Components, causing build failures and leaking database credentials into client bundles.",
    "tryItFriction": "Execute the Milestone 5 benchmark: run an automated end-to-end integration test deploying the App Router suite, verify that Server Components stream in < 100ms, execute Server Action mutations with optimistic UI feedback, and assert that revalidateTag purges cached listings across all pages.",
    "socraticHints": [
      "How do you ensure zero database credentials leak into client bundles in Next.js?",
      "Use the 'server-only' package! Adding 'import server-only' at the top of your database files causes the Next.js compiler to throw a build error if any Client Component accidentally imports it!",
      "This acts as an automated compiler firewall."
    ],
    "situationalPuzzle": {
      "scenario": "During the Milestone 5 architecture review, an architect asks: 'In Next.js App Router, how do you prevent an expensive database query in a Server Component from blocking the page rendering if the database is running slowly?' What is the architectural solution?",
      "options": [
        "Delete the database query.",
        "Granular Streaming with React Suspense: Wrap the slow database-fetching component in <Suspense fallback={<Skeleton />}>. The page shell and fast components stream to the browser immediately in < 50ms, while the slow component streams its HTML asynchronously once the database query resolves.",
        "Run the database query in a client useEffect.",
        "Next.js cannot stream with databases."
      ],
      "answerIdx": 1,
      "debrief": "React Suspense enables out-of-order HTML streaming. Slow database operations wrapped in Suspense boundaries do not hold up the initial page render. The user receives the full page shell and navigation immediately, with fallback skeletons replaced seamlessly upon data arrival."
    },
    "quests": [
      {
        "id": "fs-m1-d25-q1",
        "name": "Milestone 5 Architecture Specification",
        "type": "concept",
        "desc": "Document the complete Next.js App Router architecture including RSC streaming, Server Actions, and cache strategies."
      },
      {
        "id": "fs-m1-d25-q2",
        "name": "Server-Only Boundary Verification Suite",
        "type": "detective",
        "desc": "Scan client bundles and component dependency trees to verify zero database or secret leakage."
      },
      {
        "id": "fs-m1-d25-q3",
        "name": "Milestone 5 Core Implementation",
        "type": "mastery",
        "desc": "Deliver the complete Next.js App Router enterprise application with streaming SSR, Server Actions, and tag caching."
      },
      {
        "id": "fs-m1-d25-q4",
        "name": "Milestone 5 Viva Defense Gate",
        "type": "incident",
        "desc": "Defend the streaming performance, caching invalidation reliability, and security boundaries before the Web Directorate."
      }
    ]
  },

  # =========================================================================
  # BLOCK 6: TESTING, PERFORMANCE & MONTH 1 CAPSTONE (Days 26-30)
  # =========================================================================
  {
    "day": 26,
    "month": 1,
    "blockNum": 6,
    "title": "Full-Stack Testing Pyramid: Unit (Vitest), API Integration (Supertest) & E2E (Playwright)",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Quality Assurance (Testing Pyramid & Automated Verification)",
    "spokenGoal": "Build unbreakable full-stack systems: master the testing pyramid. Write fast, isolated Unit tests with Vitest (testing business logic, data transformers, and validation schemas in milliseconds); write API Integration tests with Supertest/Fastify inject (testing full HTTP request/response lifecycles, auth middleware, and real database transactions with rollback); and write End-to-End (E2E) tests with Playwright (driving headless Chromium to test critical user flows).",
    "conceptInvariant": "Testing Pyramid Economics Invariant: Unit tests are cheap, fast, and test algorithmic correctness; Integration tests verify database and middleware contracts; E2E tests are expensive and test critical user journeys; balance test volume 70% Unit, 20% Integration, 10% E2E.",
    "failureMode": "Relying exclusively on 500 slow E2E Playwright tests that take 45 minutes to run in CI and frequently fail with flaky network timeouts, causing engineers to ignore CI failures and merge broken code.",
    "tryItFriction": "Build an Automated Full-Stack Test Suite in TypeScript: implement unit tests in Vitest for pricing calculation algorithms, write API integration tests with Supertest against an ephemeral database testing the checkout endpoint, and write a Playwright E2E script executing user login and cart addition.",
    "socraticHints": [
      "How do you ensure database integration tests do not pollute data across tests?",
      "Run each test inside an isolated database transaction, and ROLL BACK the transaction at the end of the test! Or spin up an ephemeral containerized database per test run with Testcontainers!",
      "Rollbacks leave the database pristine for subsequent tests."
    ],
    "situationalPuzzle": {
      "scenario": "A development team runs Playwright E2E tests in GitHub Actions. The checkout test fails randomly 8% of the time with: 'TimeoutError: locator.click() timed out waiting for element button#submit-order'. The app works perfectly when tested manually. What is causing the flaky test, and how is it resolved?",
      "options": [
        "Delete the checkout test.",
        "Asynchronous Animation / Hydration Race Condition: The test clicked the button before React hydration completed or while an animation was active. Replacing arbitrary sleep timers with web-first assertions (await expect(button).toBeEnabled()) and waiting for network idle stabilizes the test.",
        "Playwright cannot click buttons.",
        "The computer ran out of RAM."
      ],
      "answerIdx": 1,
      "debrief": "Flaky E2E tests almost always stem from race conditions with DOM hydration or network calls. Playwright's web-first assertions auto-wait for elements to be visible, enabled, and stable before clicking, eliminating flaky sleep timers."
    },
    "quests": [
      {
        "id": "fs-m1-d26-q1",
        "name": "Testing Pyramid Economics & Cost Formulation",
        "type": "concept",
        "desc": "Calculate execution cost, execution time, and failure diagnostic precision across Unit, Integration, and E2E tiers."
      },
      {
        "id": "fs-m1-d26-q2",
        "name": "Flaky Test Detector & Trace Analyzer",
        "type": "detective",
        "desc": "Analyze Playwright execution traces to identify hydration race conditions and un-awaited asynchronous promises."
      },
      {
        "id": "fs-m1-d26-q3",
        "name": "Full-Stack Test Suite Implementation",
        "type": "mastery",
        "desc": "Implement a full multi-tier test suite in TypeScript uniting Vitest, Fastify inject, and Playwright workflows."
      },
      {
        "id": "fs-m1-d26-q4",
        "name": "3 AM SRE: Broken Checkout Merged Due to Bypassed CI",
        "type": "incident",
        "desc": "Respond to a critical production outage where an engineer bypassed flaky CI tests to merge a broken checkout release."
      }
    ]
  },
  {
    "day": 27,
    "month": 1,
    "blockNum": 6,
    "title": "Performance Optimization & Core Web Vitals: LCP, INP, CLS & Code Splitting",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Frontend Performance (Core Web Vitals & Bundle Optimization)",
    "spokenGoal": "Engineer high-performance web experiences: master Google's Core Web Vitals (CWV). Optimize Largest Contentful Paint (LCP < 2.5s: hero images, fetch priority, streaming SSR), Interaction to Next Paint (INP < 200ms: long tasks, main thread yielding via scheduler.yield(), debouncing), and Cumulative Layout Shift (CLS < 0.1: aspect-ratio boxes, font-display: swap with size-adjust). Implement dynamic imports and route-based code splitting.",
    "conceptInvariant": "Main Thread Yielding Invariant: The browser main thread must never be blocked by JavaScript execution for more than 50ms (Long Task); long-running computations must yield control to the browser event loop using scheduler.yield() or setTimeout to guarantee sub-200ms INP responsiveness.",
    "failureMode": "Rendering images without width and height attributes or aspect-ratio CSS, causing content below the images to jump erratically as images load, driving CLS to 0.42 and tanking Google search rankings.",
    "tryItFriction": "Optimize a Slow Web Application in TypeScript/CSS: fix layout shifts by applying aspect-ratio to media containers, yield heavy calculations to the event loop using scheduler.yield(), preload hero images with fetchpriority='high', and split heavy vendor libraries using dynamic imports (import()).",
    "socraticHints": [
      "What is the new INP (Interaction to Next Paint) metric that replaced FID?",
      "INP measures the responsiveness of ALL user interactions (clicks, taps, typing) across the ENTIRE lifespan of the page! A single frozen frame during a click creates a bad INP score!",
      "Break long tasks into small chunks so the browser can paint frame updates quickly."
    ],
    "situationalPuzzle": {
      "scenario": "A mobile website has an LCP of 4.8 seconds (failing Google's CWV threshold). Auditing shows that the Largest Contentful Paint is a hero product image. The image is lazy-loaded with loading='lazy' and loaded via a CSS background-image in an external stylesheet. What two changes fix the LCP score immediately?",
      "options": [
        "Delete the hero image.",
        "Fetch Priority High & Standard Img Preloading: 1) Remove loading='lazy' from above-the-fold hero images (never lazy-load the LCP element!); 2) Replace CSS background-image with a standard <img fetchpriority='high' priority> tag with an explicit <link rel='preload'> in the HTML head.",
        "Convert the image to GIF format.",
        "Wait 5 seconds before loading the page."
      ],
      "answerIdx": 1,
      "debrief": "Never lazy-load the hero image! loading='lazy' instructs the browser to wait until layout is computed, delaying image download. For the LCP element, use standard <img> tags with fetchpriority='high' and <link rel='preload'> to trigger downloads before stylesheets finish parsing."
    },
    "quests": [
      {
        "id": "fs-m1-d27-q1",
        "name": "Core Web Vitals Metric Physics & Math",
        "type": "concept",
        "desc": "Deconstruct the mathematical formulas and 75th percentile thresholds for LCP, INP, and CLS."
      },
      {
        "id": "fs-m1-d27-q2",
        "name": "Long Task Event Loop Profiler",
        "type": "detective",
        "desc": "Profile a CPU-heavy component using Chrome Performance DevTools to identify long tasks blocking INP."
      },
      {
        "id": "fs-m1-d27-q3",
        "name": "CWV-Optimized Media & Yielding Engine",
        "type": "mastery",
        "desc": "Implement a full optimization module in TypeScript featuring scheduler.yield() chunking and zero-CLS image containers."
      },
      {
        "id": "fs-m1-d27-q4",
        "name": "3 AM SRE: Google Search Traffic Drop via Degraded CWV",
        "type": "incident",
        "desc": "Diagnose an organic traffic plunge caused by an un-optimized third-party chat widget destroying INP and CLS."
      }
    ]
  },
  {
    "day": 28,
    "month": 1,
    "blockNum": 6,
    "title": "Security Hardening: Helmet Headers, CSP Level 3, CSRF Protection & Distributed Rate Limiting",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Production Security (Hardening & Edge Defenses)",
    "spokenGoal": "Harden full-stack web applications against modern cyber threats: configure Helmet security headers (Strict-Transport-Security, X-Content-Type-Options: nosniff, X-Frame-Options: DENY). Implement a strict Content Security Policy (CSP Level 3 with nonces and strict-dynamic to eliminate XSS), configure anti-CSRF double-submit cookies, and deploy distributed rate limiting using Redis token buckets.",
    "conceptInvariant": "Content Security Policy Nonce Invariant: Under CSP Level 3 strict-dynamic, browsers execute scripts only if they carry a cryptographically random, per-request nonce attribute (nonce='{random}'); inline scripts injected by attackers via XSS lack the secret nonce and are blocked by the browser engine.",
    "failureMode": "Omitting CSP headers and relying solely on HTML escaping, allowing a stored XSS vulnerability in a user bio field to execute an inline script that steals session cookies.",
    "tryItFriction": "Build a Security Hardening Middleware in TypeScript: generate a 128-bit random CSP nonce per request, inject the nonce into Helmet CSP headers and React script tags, enforce HSTS, and implement an IP rate limiter with Redis sliding windows.",
    "socraticHints": [
      "Why is 'unsafe-inline' dangerous in Content Security Policy?",
      "Because 'unsafe-inline' allows ANY inline <script> tag on the page to execute—which completely defeats the purpose of CSP, as attackers inject inline scripts via XSS!",
      "Use per-request cryptographic nonces (script-src 'nonce-{random}' 'strict-dynamic')."
    ],
    "situationalPuzzle": {
      "scenario": "A banking web app protects against CSRF using SameSite=Lax session cookies. A security auditor points out that top-level GET navigations (e.g., clicking a link on a malicious site) still send SameSite=Lax cookies, and asks how the bank protects state-changing endpoints from CSRF. What architectural practice is required?",
      "options": [
        "Allow state changes on GET requests.",
        "Strict HTTP Verb Discipline & Synchronizer Token Pattern: 1) State-changing operations must NEVER use GET requests (strictly use POST, PUT, DELETE); 2) For sensitive state mutations, require an anti-CSRF synchronizer token header (X-CSRF-Token) validated on the server alongside the cookie.",
        "Disable all cookies across the bank.",
        "Use HTTP instead of HTTPS."
      ],
      "answerIdx": 1,
      "debrief": "SameSite=Lax cookies are sent on top-level GET requests from external links. If a developer mistakenly implements a state-changing operation (like a funds transfer) via GET, it remains vulnerable to CSRF. All mutations must use POST/PUT/DELETE, reinforced with CSRF tokens."
    },
    "quests": [
      {
        "id": "fs-m1-d28-q1",
        "name": "CSP Level 3 Nonce Execution Model",
        "type": "concept",
        "desc": "Diagram how modern browser JavaScript engines evaluate script execution under strict-dynamic and nonce rules."
      },
      {
        "id": "fs-m1-d28-q2",
        "name": "Security Header Conformance Auditor",
        "type": "detective",
        "desc": "Scan 50 production websites using an automated security analyzer to detect missing HSTS, CSP, and framing headers."
      },
      {
        "id": "fs-m1-d28-q3",
        "name": "TypeScript Full Helmet & CSP Nonce Engine",
        "type": "mastery",
        "desc": "Implement a full security middleware in TypeScript generating per-request CSP nonces, HSTS, and CSRF protection."
      },
      {
        "id": "fs-m1-d28-q4",
        "name": "3 AM SRE: Clickjacking Exploit on Customer Payment Page",
        "type": "incident",
        "desc": "Respond to a critical security incident where missing X-Frame-Options allowed attackers to iframe a checkout form."
      }
    ]
  },
  {
    "day": 29,
    "month": 1,
    "blockNum": 6,
    "title": "Production Dockerization: Multi-Stage Builds, Distroless Images & Standalone Output",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "DevOps & Containerization (Docker Multi-Stage & Distroless)",
    "spokenGoal": "Ship full-stack applications to container orchestration platforms: master production Dockerization. Implement Multi-Stage Dockerfiles: Stage 1 (Dependencies with caching), Stage 2 (Builder compiling Next.js standalone output and pruning devDependencies), and Stage 3 (Runner using Google Distroless or Alpine non-root images). Slash image sizes from 1.4 GB down to 85 MB, eliminate package manager vulnerabilities, and handle graceful shutdown SIGTERM signals.",
    "conceptInvariant": "Minimalist Distroless Container Invariant: Production container images must contain ONLY the compiled application runtime and production dependencies; compilers, package managers, package.json files, and shell binaries (bash/sh) must be excluded to minimize attack surfaces and image size.",
    "failureMode": "Deploying a single-stage Dockerfile based on node:latest containing full npm cache, typescript compiler, and build tools (1.8 GB image), leaking development secrets and vulnerable to container escape exploits due to root execution.",
    "tryItFriction": "Write a 3-Stage Distroless Dockerfile in Docker/TypeScript: configure output: 'standalone' in next.config.js, copy compiled public and static assets, run as an unprivileged non-root user (USER nextjs), and verify that image size is < 120 MB with zero shell access.",
    "socraticHints": [
      "Why is Next.js output: 'standalone' so powerful for containerization?",
      "It uses static analysis to trace and copy ONLY the exact node_modules packages your application actually imports, leaving the rest of the 500MB node_modules folder behind!",
      "This produces an ultra-lean server.js entry point that runs anywhere with minimal footprint."
    ],
    "situationalPuzzle": {
      "scenario": "A Kubernetes deployment rolls out a new Next.js pod. During deployment, the pod immediately receives SIGTERM from Kubernetes during a rolling update. The Node.js application abruptly terminates active in-flight checkout transactions, resulting in corrupted database rows. How do you implement graceful shutdown in Node.js?",
      "options": [
        "Ignore the SIGTERM signal.",
        "SIGTERM Graceful Drain Handler: Listen for process.on('SIGTERM', () => { server.close(() => { db.disconnect(); process.exit(0); }); }). The server stops accepting new connections, allows in-flight requests to complete up to a 30-second timeout, drains database connection pools, and exits cleanly.",
        "Use process.exit(1) immediately upon SIGTERM.",
        "Kubernetes pods cannot be shut down gracefully."
      ],
      "answerIdx": 1,
      "debrief": "Graceful shutdown requires listening for SIGTERM and SIGINT. When received, the application stops accepting new traffic, waits for in-flight requests to finish, drains database and Redis connection pools, and exits cleanly before the Kubernetes termination grace period expires."
    },
    "quests": [
      {
        "id": "fs-m1-d29-q1",
        "name": "Docker Multi-Stage Caching Layer Mechanics",
        "type": "concept",
        "desc": "Diagram how Docker layer caching optimizes build times by isolating package.json from source code modifications."
      },
      {
        "id": "fs-m1-d29-q2",
        "name": "Container Vulnerability CVE Scanner",
        "type": "detective",
        "desc": "Scan single-stage node:latest images vs 3-stage distroless images with Trivy to compare CVE vulnerabilities."
      },
      {
        "id": "fs-m1-d29-q3",
        "name": "Production Distroless Next.js Dockerfile",
        "type": "mastery",
        "desc": "Author an industrial-grade 3-stage Dockerfile for Next.js standalone output with non-root security and health checks."
      },
      {
        "id": "fs-m1-d29-q4",
        "name": "3 AM SRE: Abrupt Pod Termination Dropping Customer Orders",
        "type": "incident",
        "desc": "Fix an outage where lack of SIGTERM handling caused Kubernetes rolling deployments to drop in-flight purchases."
      }
    ]
  },
  {
    "day": 30,
    "month": 1,
    "blockNum": 6,
    "title": "Capstone 1: NexusStack Enterprise Full-Stack Commerce Engine Capstone Viva Gate",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Architectural Defense (Month 1 Master Capstone)",
    "spokenGoal": "Crown your Month 1 mastery: defend the NexusStack Enterprise Full-Stack Commerce Engine. Present your unified architecture—uniting Next.js App Router streaming SSR, Fastify high-throughput API gateway, Drizzle multi-tenant ORM data layer, tRPC end-to-end type safety, optimistic UI mutations with rollback, secure Argon2id/cookie authentication, and distroless Dockerization—live before a panel of Staff Full-Stack Systems Architects.",
    "conceptInvariant": "Full-Stack Enterprise Cohesion Invariant: A production web architecture must enforce end-to-end type safety, sub-second Core Web Vitals, row-level multi-tenant security, and zero-downtime database evolvability in a unified, containerized deployment.",
    "failureMode": "Failing the Capstone Viva by building a system that breaks under concurrent load, leaks cross-tenant records, or cannot mathematically explain caching invalidation and database transaction lifecycles under cross-examination.",
    "tryItFriction": "Execute the Month 1 Capstone verification test: deploy NexusStack via Docker Compose, simulate 100 concurrent shopping carts, test checkout with optimistic UI updates and instant rollback on card failure, assert < 100ms LCP on product pages, and verify zero cross-tenant data leaks.",
    "socraticHints": [
      "What is the single most important skill tested during the Staff Full-Stack Viva?",
      "The ability to defend trade-offs across the entire vertical stack! Why Fastify over Express? Why Drizzle over Prisma? Why tRPC over REST? How do your multi-tier caches invalidate without stale pricing?",
      "Staff Architects evaluate first-principles reasoning and failure-mode resilience above all else."
    ],
    "situationalPuzzle": {
      "scenario": "During the final Viva defense, the panel asks: 'If a massive marketing campaign floods your commerce platform with 100,000 concurrent users browsing and buying simultaneously, how does your architecture prevent database connection pool exhaustion while ensuring shoppers always see live inventory counts?' What is the optimal architectural answer?",
      "options": [
        "Increase PostgreSQL max_connections to 100,000.",
        "Multi-Tiered Concurrency Defense: 1) Static/RSC Route Caching with Edge CDNs absorbs 95%+ of product page reads with zero database hits; 2) Connection Pooling via PgBouncer multiplexes thousands of app connections into 50 physical PostgreSQL connections; 3) Inventory reservations use atomic Redis DECR with conditional Lua scripts before hitting the primary database.",
        "Shut down the checkout page during the sale.",
        "Switch from TypeScript to Python."
      ],
      "answerIdx": 1,
      "debrief": "A Staff Full-Stack Architect delivers a layered systems response: edge CDN and RSC caching absorb read traffic, PgBouncer protects PostgreSQL from thread exhaustion, and fast atomic in-memory counters (Redis Lua) absorb flash-sale inventory reservation locks before writing to relational storage."
    },
    "quests": [
      {
        "id": "fs-m1-d30-q1",
        "name": "NexusStack Architectural RFC & System Blueprint",
        "type": "concept",
        "desc": "Deliver the comprehensive architectural blueprint for the NexusStack Enterprise Commerce Engine."
      },
      {
        "id": "fs-m1-d30-q2",
        "name": "End-to-End Synthetic Concurrency & Security Suite",
        "type": "detective",
        "desc": "Run an automated 1,000-user stress test verifying Core Web Vitals, tenant isolation, and zero-downtime rollback."
      },
      {
        "id": "fs-m1-d30-q3",
        "name": "NexusStack Production Commerce Engine Core",
        "type": "mastery",
        "desc": "Deliver the complete TypeScript codebase uniting Next.js, Fastify, Drizzle, tRPC, and distroless Dockerization."
      },
      {
        "id": "fs-m1-d30-q4",
        "name": "Month 1 Capstone Viva Oral Defense Gate",
        "type": "incident",
        "desc": "Defend the entire 30-day Full-Stack architecture live before the Staff Systems Review Board."
      }
    ]
  }
]
