# scripts/visuals/fullstack_spec_m1.py
# Course 13: Full-Stack JavaScript Engineering (course-fullstack-js)
# Month 1: Days 1-15 (Blocks 1-3) - 60 Quests Total

FULLSTACK_M1_PART1 = [
  # =========================================================================
  # BLOCK 1: FULL-STACK FOUNDATIONS & HTTP/2/3 WIRE PROTOCOLS (Days 1-5)
  # =========================================================================
  {
    "day": 1,
    "month": 1,
    "blockNum": 1,
    "title": "Client-Server Decoupling, HTTP/1.1 vs HTTP/2 Multiplexing & HTTP/3 QUIC Physics",
    "stageName": "Stage 1: Mental Model Grounding",
    "stageNum": 1,
    "pedagogicalRole": "Foundational Intuition (Network Transport & Wire Protocols)",
    "spokenGoal": "Deconstruct modern full-stack web transport: understand client-server decoupling across browser runtimes (V8/DOM) and server runtimes (Node.js/libuv). Analyze HTTP/1.1 pipelining and Head-of-Line (HoL) blocking, dissect HTTP/2 binary framing and multiplexed streams over a single TCP connection, and analyze HTTP/3 UDP-based QUIC transport that eliminates transport-layer packet loss stalls.",
    "conceptInvariant": "Transport Layer Multiplexing Invariant: HTTP/2 multiplexes logical request streams into interleaved binary frames over one TCP socket; HTTP/3 moves multiplexing down to UDP via QUIC, ensuring packet loss on stream A never stalls independent stream B.",
    "failureMode": "Serving high-asset web applications over HTTP/1.1 without asset bundling, causing browsers to hit their 6-connection-per-domain limit, resulting in 4,000ms asset queuing delays (waterfall stalling) on initial page load.",
    "tryItFriction": "Build an HTTP/2 vs HTTP/1.1 connection benchmark simulator in TypeScript: simulate downloading 50 small API and asset payloads over a simulated 50ms latency link, measuring total transfer time across 6-socket HTTP/1.1 versus single-socket HTTP/2 multiplexing.",
    "socraticHints": [
      "Why did web developers bundle 50 JavaScript files into 1 massive bundle in the HTTP/1.1 era?",
      "Because HTTP/1.1 can only download one asset at a time per TCP connection, and browsers limit concurrent connections to 6 per domain!",
      "HTTP/2 multiplexes hundreds of concurrent requests over 1 connection, making granular modular loading fast."
    ],
    "situationalPuzzle": {
      "scenario": "A mobile web app experiences severe latency spikes for users on train networks with 2% packet loss. Switching from HTTP/1.1 to HTTP/2 actually worsened tail latency. An engineer migrates the edge CDN to HTTP/3 (QUIC). P99 latency immediately drops from 2,800ms to 420ms. What fundamental networking problem did HTTP/3 resolve?",
      "options": [
        "HTTP/3 removed all TLS encryption.",
        "TCP Head-of-Line Blocking Elimination: In HTTP/2, all streams share ONE TCP connection. When a single TCP packet is dropped, the OS kernel pauses ALL streams until the lost packet is retransmitted. HTTP/3 runs over UDP with QUIC, isolating stream recovery so packet loss on one stream does not block others.",
        "HTTP/3 compresses HTML by 99%.",
        "The mobile device bought a faster CPU."
      ],
      "answerIdx": 1,
      "debrief": "HTTP/2 solved application-layer Head-of-Line blocking, but retained transport-layer TCP HoL blocking. On lossy mobile networks, a single dropped TCP segment blocks all multiplexed streams. HTTP/3 runs over QUIC/UDP, providing true independent stream recovery."
    },
    "quests": [
      {
        "id": "fs-m1-d01-q1",
        "name": "HTTP Protocol Evolution Matrix",
        "type": "concept",
        "desc": "Map wire protocol differences, binary framing, and congestion control across HTTP/1.1, HTTP/2, and HTTP/3."
      },
      {
        "id": "fs-m1-d01-q2",
        "name": "Network Waterfall Waterfall Analyzer",
        "type": "detective",
        "desc": "Analyze browser DevTools HAR logs to identify domain connection limit stalls and asset blocking."
      },
      {
        "id": "fs-m1-d01-q3",
        "name": "TypeScript Multiplexed Stream Simulator",
        "type": "mastery",
        "desc": "Implement a binary stream multiplexer in TypeScript interleaving chunked frames over a mock socket."
      },
      {
        "id": "fs-m1-d01-q4",
        "name": "3 AM SRE: Mobile Checkout Waterfall Outage",
        "type": "incident",
        "desc": "Diagnose an e-commerce checkout stall caused by 60 unbundled micro-requests saturating mobile TCP sockets."
      }
    ]
  },
  {
    "day": 2,
    "month": 1,
    "blockNum": 1,
    "title": "RESTful API Architectural Principles: Idempotence, HTTP Verbs & Status Code Physics",
    "stageName": "Stage 1: Mental Model Grounding",
    "stageNum": 1,
    "pedagogicalRole": "API Architecture (REST Semantics & Idempotency)",
    "spokenGoal": "Master industrial RESTful API design: dissect Roy Fielding's REST constraints. Understand true HTTP method semantics: Safe methods (GET, HEAD), Idempotent methods (PUT, DELETE), and Non-idempotent methods (POST, PATCH). Master HTTP status code precision (201 Created vs 202 Accepted vs 204 No Content; 401 Unauthorized vs 403 Forbidden; 409 Conflict vs 422 Unprocessable Entity), and implement Idempotency-Key headers.",
    "conceptInvariant": "HTTP Idempotence Invariant: An HTTP method is idempotent if executing N identical requests (N >= 1) produces the exact same server resource state as executing it once; network retries on idempotent methods must never create duplicate records or duplicate financial charges.",
    "failureMode": "Designing a billing charge endpoint as a POST request without Idempotency-Key headers, causing mobile users on fluctuating networks to retry timed-out requests and trigger double-billing credit card charges.",
    "tryItFriction": "Build an Idempotency Middleware in TypeScript: intercept incoming requests with an Idempotency-Key header, check an in-memory/Redis store, return cached responses for in-flight or completed keys, and prevent duplicate database mutations.",
    "socraticHints": [
      "What is the semantic difference between 401 Unauthorized and 403 Forbidden?",
      "401 means 'Authentication required / Who are you?'; 403 means 'Authenticated, but access denied / You cannot touch this resource!'",
      "Never return 401 if the user has a valid login token but lacks permission—return 403."
    ],
    "situationalPuzzle": {
      "scenario": "A payments microservice handles POST /v1/charges. An unstable mobile client sends a charge request ($50). The server executes the charge in Stripe, but the mobile connection drops before receiving the 200 OK response. The mobile client retries the exact same POST request. How does an Idempotency-Key header prevent double billing?",
      "options": [
        "It cancels the customer's credit card.",
        "Atomic Idempotency Locking & Response Replay: The server checks the Idempotency-Key in Redis before charging. On the retry, it discovers the key is already marked 'COMPLETED' with the saved Stripe charge ID and cached HTTP 200 payload, immediately returning the saved receipt without re-executing the charge.",
        "It converts the POST request into a GET request.",
        "Idempotency keys only work with MySQL databases."
      ],
      "answerIdx": 1,
      "debrief": "Idempotency keys (standardized by Stripe and IETF) protect against network retry duplication. The server uses an atomic lock (Redis SET NX) on the key. If already processed, it re-serves the cached response without re-triggering the underlying financial side effect."
    },
    "quests": [
      {
        "id": "fs-m1-d02-q1",
        "name": "REST Resource State & Method Invariants",
        "type": "concept",
        "desc": "Formalize the mathematical state transition matrices for GET, PUT, POST, PATCH, and DELETE operations."
      },
      {
        "id": "fs-m1-d02-q2",
        "name": "Status Code Semantic Compliance Auditor",
        "type": "detective",
        "desc": "Audit an enterprise API specification to eliminate anti-patterns (e.g., returning HTTP 200 with an error object inside)."
      },
      {
        "id": "fs-m1-d02-q3",
        "name": "Production Idempotency Middleware Engine",
        "type": "mastery",
        "desc": "Implement a full TypeScript idempotency middleware with Redis locking, payload hashing, and response replay."
      },
      {
        "id": "fs-m1-d02-q4",
        "name": "3 AM SRE: Double-Billing Duplicate Charge Crisis",
        "type": "incident",
        "desc": "Remediate a production billing emergency where network retry storms duplicated $120,000 in customer subscriptions."
      }
    ]
  },
  {
    "day": 3,
    "month": 1,
    "blockNum": 1,
    "title": "Fastify Architecture: High-Performance JSON Schema Validation (Ajv) & Request Lifecycle Hooks",
    "stageName": "Stage 1: Mental Model Grounding",
    "stageNum": 1,
    "pedagogicalRole": "Backend Systems (Fastify Lifecycle & JIT Serialization)",
    "spokenGoal": "Upgrade from Express to high-performance Node.js: analyze the Fastify architecture. Understand how JSON Schema compilation via Ajv compiles validators into JIT JavaScript functions, explore fast-json-stringify which avoids expensive JSON.stringify() reflection, and trace the complete Fastify request lifecycle (onRequest -> preParsing -> preValidation -> preHandler -> handler -> onSend -> onResponse).",
    "conceptInvariant": "Compiled Schema Invariant: Declaring explicit JSON schemas for route params, query, body, and responses allows Fastify to compile JIT validation functions and pre-calculated string serialization templates, achieving 2x-4x higher requests/sec over un-schematized Express apps.",
    "failureMode": "Relying on ad-hoc runtime if-else checks inside route handlers rather than declarative Ajv schemas, allowing unvalidated prototype pollution payloads or missing fields to penetrate business logic.",
    "tryItFriction": "Build a Fastify Route with Strict Ajv Schemas in TypeScript: define request body, query params, and response 200 schemas using TypeBox/Zod, register onRequest logging hooks, and verify that invalid payloads are rejected with 400 Bad Request before the handler executes.",
    "socraticHints": [
      "Why is fast-json-stringify so much faster than JSON.stringify()?",
      "Standard JSON.stringify inspects object keys dynamically via runtime reflection. fast-json-stringify uses the pre-defined schema to generate a string concatenation function (e.g., '{\"id\":' + obj.id + '}') that runs at native V8 speed!",
      "Always declare the response schema in your Fastify route options."
    ],
    "situationalPuzzle": {
      "scenario": "A legacy Express backend serves 8,000 req/sec at 95% CPU load. An engineering team migrates the service to Fastify with full JSON schemas. CPU utilization drops to 32% under the exact same traffic, and P99 latency drops from 45ms to 8ms. What architectural optimization caused this massive efficiency boost?",
      "options": [
        "Fastify runs in C++ instead of Node.js.",
        "JIT Schema Compilation & Zero-Reflection Serialization: Fastify compiles JSON Schemas into optimized V8 bytecode via Ajv at startup, eliminating runtime object traversal, and uses fast-json-stringify to serialize JSON without dynamic reflection, eliminating GC pressure and CPU cycles.",
        "Fastify disabled all error handling.",
        "The server hardware was upgraded."
      ],
      "answerIdx": 1,
      "debrief": "Fastify's speed comes from upfront compilation. By compiling schemas at boot time, it eliminates redundant runtime object checking and string reflection during high-throughput request handling, drastically reducing garbage collection and CPU overhead."
    },
    "quests": [
      {
        "id": "fs-m1-d03-q1",
        "name": "Fastify Request Lifecycle State Machine",
        "type": "concept",
        "desc": "Diagram the complete execution lifecycle hooks and error propagation boundaries of Fastify."
      },
      {
        "id": "fs-m1-d03-q2",
        "name": "Serialization Benchmark: Express vs Fastify",
        "type": "detective",
        "desc": "Benchmark JSON serialization throughput across JSON.stringify versus fast-json-stringify across large payloads."
      },
      {
        "id": "fs-m1-d03-q3",
        "name": "TypeScript TypeBox Fastify Service",
        "type": "mastery",
        "desc": "Build a modular Fastify microservice with end-to-end static type inference via TypeBox and custom error formatters."
      },
      {
        "id": "fs-m1-d03-q4",
        "name": "3 AM SRE: Prototype Pollution via Unchecked Payload",
        "type": "incident",
        "desc": "Diagnose an exploit where an attacker injected __proto__ properties through an un-schematized JSON body."
      }
    ]
  },
  {
    "day": 4,
    "month": 1,
    "blockNum": 1,
    "title": "CORS (Cross-Origin Resource Sharing) Physics: Preflight OPTIONS, Headers & Credentials",
    "stageName": "Stage 1: Mental Model Grounding",
    "stageNum": 1,
    "pedagogicalRole": "Security & Network Physics (CORS & Browser Origin Isolation)",
    "spokenGoal": "Demystify Cross-Origin Resource Sharing (CORS): understand the browser's Same-Origin Policy (SOP). Differentiate between Simple Requests (GET/HEAD/POST with basic headers) and Preflighted Requests (PUT, DELETE, custom headers like Authorization). Master the OPTIONS preflight handshake, Access-Control-Allow-Origin, Access-Control-Allow-Credentials, and understand why Access-Control-Allow-Origin: '*' fails when cookies are sent.",
    "conceptInvariant": "Origin Isolation & Credential Invariant: The browser will strictly block reading a cross-origin response if Access-Control-Allow-Origin is '*' and withCredentials is true; credentialed cross-origin requests mandate an exact reflected origin match and Access-Control-Allow-Credentials: true.",
    "failureMode": "Configuring Access-Control-Allow-Origin: '*' on an API that uses HttpOnly session cookies, causing frontend fetch requests with credentials: 'include' to fail in the browser with an unreadable CORS network error.",
    "tryItFriction": "Build a CORS Middleware Validator in TypeScript: parse incoming Origin and Access-Control-Request-Headers headers on OPTIONS requests, match against an allowed origin whitelist, return appropriate CORS headers with Max-Age caching, and safely reject disallowed origins.",
    "socraticHints": [
      "Does CORS protect the backend server from being called by curl or Postman?",
      "NO! CORS is strictly a browser-side security enforcement policy. Curl, Postman, and backend servers ignore CORS completely!",
      "CORS protects USERS from malicious third-party websites reading data from your API via their authenticated browser session."
    ],
    "situationalPuzzle": {
      "scenario": "A single-page app on app.company.com calls api.company.com. The API sends a custom header X-Request-ID: 12345 in the response. The frontend JavaScript code calls response.headers.get('X-Request-ID'), but it returns null, even though the header is visible in browser DevTools. What CORS header is missing from the backend response?",
      "options": [
        "Access-Control-Allow-Origin.",
        "Access-Control-Expose-Headers: By default, browsers only expose simple response headers (Cache-Control, Content-Language, Content-Type, Expires, Last-Modified, Pragma) to JavaScript. To allow client scripts to read custom headers, the server must explicitly return Access-Control-Expose-Headers: X-Request-ID.",
        "Access-Control-Max-Age.",
        "The header was blocked by the ad-blocker."
      ],
      "answerIdx": 1,
      "debrief": "Even if an API response succeeds, browsers sanitize the headers exposed to frontend JavaScript unless explicitly whitelisted via Access-Control-Expose-Headers. Custom correlation IDs or pagination headers must be included in this header to be readable via response.headers.get()."
    },
    "quests": [
      {
        "id": "fs-m1-d04-q1",
        "name": "CORS Preflight Handshake State Diagram",
        "type": "concept",
        "desc": "Diagram the complete browser-to-server handshake for simple requests versus preflighted OPTIONS requests."
      },
      {
        "id": "fs-m1-d04-q2",
        "name": "CORS Misconfiguration Vulnerability Scanner",
        "type": "detective",
        "desc": "Analyze 20 API CORS configurations to detect wildcard credential traps, origin reflection bugs, and null origin bypasses."
      },
      {
        "id": "fs-m1-d04-q3",
        "name": "Production Fastify CORS Plugin",
        "type": "mastery",
        "desc": "Implement a robust CORS plugin in TypeScript with dynamic origin regex validation, credentials support, and preflight caching."
      },
      {
        "id": "fs-m1-d04-q4",
        "name": "3 AM SRE: Global Checkout Blocked by CORS Error",
        "type": "incident",
        "desc": "Resolve a production deployment outage where an erroneous CDN header override stripped Access-Control-Allow-Origin."
      }
    ]
  },
  {
    "day": 5,
    "month": 1,
    "blockNum": 1,
    "title": "Milestone 1: High-Throughput Type-Safe Fastify Gateway",
    "stageName": "Stage 2: Applied Architecture",
    "stageNum": 2,
    "pedagogicalRole": "Architectural Synthesis (Milestone Gate 1)",
    "spokenGoal": "Synthesize full-stack gateway foundations: engineer a production-grade High-Throughput Type-Safe Fastify Gateway in TypeScript. Implement Ajv/TypeBox compiled request/response validation, preflight-cached CORS origin handling, idempotent request deduplication via Redis, structured request logging with correlation IDs, and global RFC 7807 Problem Details error formatting.",
    "conceptInvariant": "Gateway Conformance Invariant: Every incoming HTTP request must pass compiled schema validation, idempotency checks, and CORS origin verification prior to reaching business route handlers; errors must adhere to standard RFC 7807 JSON formats.",
    "failureMode": "Returning unstructured raw JavaScript Error stack traces in HTTP 500 responses, leaking internal file paths, database connection strings, and library versions to external attackers.",
    "tryItFriction": "Execute the Milestone 1 benchmark suite: launch your Fastify gateway, send 500 concurrent requests across valid payloads, invalid schemas, duplicate idempotency keys, and cross-origin preflight checks, verifying 100% compliance and zero unhandled exceptions.",
    "socraticHints": [
      "What is RFC 7807 Problem Details for HTTP APIs?",
      "An IETF standard format for API error responses: { type, title, status, detail, instance }! It replaces messy custom error shapes with a universally predictable format.",
      "Fastify's setErrorHandler can map all internal validation and runtime errors to RFC 7807 JSON."
    ],
    "situationalPuzzle": {
      "scenario": "Under load testing, your Fastify gateway handles 12,000 req/sec. However, P99 latency spikes because thousands of repeated OPTIONS preflight requests hit the server. How does the server instruct browsers to cache preflight decisions so clients don't send OPTIONS before every single API call?",
      "options": [
        "Return Cache-Control: max-age=3600 on the GET request.",
        "Access-Control-Max-Age Header: Return Access-Control-Max-Age: 86400 (24 hours) on successful OPTIONS preflight responses. Browsers cache the preflight result locally, executing subsequent PUT/DELETE/custom-header requests directly without sending redundant OPTIONS roundtrips.",
        "Disable preflight checks by turning off CORS.",
        "Use localStorage to store CORS headers."
      ],
      "answerIdx": 1,
      "debrief": "Access-Control-Max-Age tells the browser how long (in seconds) it can cache the results of a preflight OPTIONS request. Setting this header (e.g., to 86400) eliminates thousands of redundant preflight network round-trips for repeat users, cutting latency by 50%."
    },
    "quests": [
      {
        "id": "fs-m1-d05-q1",
        "name": "Milestone 1 Architectural Blueprint",
        "type": "concept",
        "desc": "Document the complete gateway architecture, schema pipelines, and RFC 7807 error taxonomy for the Fastify Gateway."
      },
      {
        "id": "fs-m1-d05-q2",
        "name": "Idempotency & Preflight Stress Harness",
        "type": "detective",
        "desc": "Build an automated test suite verifying concurrent idempotent locking, CORS header caching, and schema rejections."
      },
      {
        "id": "fs-m1-d05-q3",
        "name": "Milestone 1 Core Implementation",
        "type": "mastery",
        "desc": "Deliver the complete TypeScript High-Throughput Type-Safe Fastify Gateway with Ajv schemas and error handlers."
      },
      {
        "id": "fs-m1-d05-q4",
        "name": "Milestone 1 Viva Defense Gate",
        "type": "incident",
        "desc": "Defend the gateway throughput benchmarks, RFC 7807 compliance, and CORS security before the Staff Backend Architect."
      }
    ]
  },

  # =========================================================================
  # BLOCK 2: RELATIONAL DATA MODELING, ORMS & SCHEMA MIGRATIONS (Days 6-10)
  # =========================================================================
  {
    "day": 6,
    "month": 1,
    "blockNum": 2,
    "title": "Relational Data Modeling: Foreign Keys, Cascades & Normalization (1NF through BCNF)",
    "stageName": "Stage 2: Applied Architecture",
    "stageNum": 2,
    "pedagogicalRole": "Data Architecture (Relational Normalization & Integrity)",
    "spokenGoal": "Design bulletproof relational schemas: master relational database normalization. Walk through First Normal Form (1NF: atomic values, no repeating groups), Second Normal Form (2NF: full functional dependency on primary key), Third Normal Form (3NF: no transitive dependencies), and Boyce-Codd Normal Form (BCNF). Analyze Foreign Key constraints, referential integrity, and evaluate ON DELETE CASCADE vs ON DELETE RESTRICT vs ON DELETE SET NULL.",
    "conceptInvariant": "Referential Integrity Invariant: A foreign key value must either match an existing primary key in the referenced parent table or be explicitly NULL; orphaned child rows violate relational integrity and corrupt transactional data models.",
    "failureMode": "Configuring ON DELETE CASCADE on an enterprise Organization table, causing an accidental deletion of a test tenant to cascade recursively and wipe out 500,000 associated customer invoices, payments, and audit logs.",
    "tryItFriction": "Design and validate a normalized e-commerce database schema in SQL/TypeScript: model Users, Orders, OrderItems, Products, and Categories adhering to 3NF, apply proper composite foreign keys, and enforce ON DELETE RESTRICT on financial records.",
    "socraticHints": [
      "Why is storing comma-separated values (e.g., tags = 'tech,news,coding') in a single column a violation of 1NF?",
      "Because 1NF requires atomic values! Comma-separated strings prevent the database from indexing individual tags, enforcing foreign keys, or executing fast joins!",
      "Create a junction table (e.g., PostTags) with foreign keys to Posts and Tags."
    ],
    "situationalPuzzle": {
      "scenario": "A SaaS database stores billing data. An engineer designs an Invoice table with columns: [id, user_id, user_address, total_amount]. Later, a user updates their shipping address in the User table, but their past historical invoices still show the old address, while newly generated invoices show the new address. Is this an anomaly or correct domain modeling?",
      "options": [
        "It is a catastrophic 3NF normalization violation that must be deleted.",
        "Intentional Historical Snapshot Modeling: While 3NF discourages duplicating user_address, financial invoices are legal legal documents that must record the exact billing address at the time of purchase! Normalization theory must be balanced with temporal snapshot immutability.",
        "The database should run autovacuum.",
        "Foreign keys cannot link users to invoices."
      ],
      "answerIdx": 1,
      "debrief": "Domain-driven design sometimes calls for intentional denormalization. In financial and legal domains, an invoice must capture an immutable snapshot of the user's address at the exact instant the transaction occurred, rather than pointing to a mutable user record."
    },
    "quests": [
      {
        "id": "fs-m1-d06-q1",
        "name": "Normalization Forms (1NF to BCNF) Proof",
        "type": "concept",
        "desc": "Prove step-by-step normalization decomposition of a denormalized spreadsheet schema into BCNF relations."
      },
      {
        "id": "fs-m1-d06-q2",
        "name": "Referential Cascade Vulnerability Audit",
        "type": "detective",
        "desc": "Scan a complex schema definition to identify dangerous ON DELETE CASCADE chains on financial and audit tables."
      },
      {
        "id": "fs-m1-d06-q3",
        "name": "Normalized Multi-Tenant Relational Schema",
        "type": "mastery",
        "desc": "Implement a fully normalized PostgreSQL schema in TypeScript supporting tenants, users, roles, and immutable audits."
      },
      {
        "id": "fs-m1-d06-q4",
        "name": "3 AM SRE: Catastrophic Cascade Delete Outage",
        "type": "incident",
        "desc": "Recover from a production disaster where deleting an employee record recursively deleted 5 years of customer contracts."
      }
    ]
  },
  {
    "day": 7,
    "month": 1,
    "blockNum": 2,
    "title": "Prisma ORM Internals: Rust Query Engine, Data Modeling & Relation Filters",
    "stageName": "Stage 2: Applied Architecture",
    "stageNum": 2,
    "pedagogicalRole": "ORM Mechanics (Prisma Architecture & Query Translation)",
    "spokenGoal": "Demystify Prisma ORM: look under the hood of the Prisma Client and Rust Query Engine. Understand how prisma.schema compiles into TypeScript types, analyze how Prisma transforms nested relation queries (include / select) into SQL JOINs or batched WHERE IN queries, and diagnose the N+1 query problem in naive ORM code.",
    "conceptInvariant": "Query Engine Batching Invariant: Prisma avoids the classic N+1 query trap by batching nested relation reads into two single SQL queries (e.g., SELECT * FROM users followed by SELECT * FROM posts WHERE user_id IN (...)) and stitching relations together in the Rust engine.",
    "failureMode": "Looping through an array of 500 records and calling prisma.user.findUnique() inside an async for-loop, triggering 500 individual network roundtrips to PostgreSQL, blowing past connection pool limits and locking the database.",
    "tryItFriction": "Write an optimized Prisma query module in TypeScript: query complex nested relations with selective field projections (select instead of include), apply pagination with cursor-based cursors, and inspect generated SQL queries using Prisma query event logging.",
    "socraticHints": [
      "Why is cursor-based pagination (take: 10, skip: 1, cursor: { id: lastId }) faster than offset pagination (skip: 100000)?",
      "Offset pagination (OFFSET 100000) forces PostgreSQL to physically scan and discard 100,000 rows on disk! Cursor pagination uses a B+ tree index seek (WHERE id > lastId) running in O(log N) time!",
      "Always use cursor-based pagination for large datasets."
    ],
    "situationalPuzzle": {
      "scenario": "A developer runs prisma.user.findMany({ include: { posts: true, profile: true } }) on a table with 50,000 users. The Node.js server experiences a massive latency spike and throws JavaScript Heap Out of Memory. Why did this query crash Node.js despite running only 3 SQL queries?",
      "options": [
        "PostgreSQL crashed during the read.",
        "Unbounded Data Hydration & In-Memory Stitching: The query returned 50,000 users, 200,000 posts, and 50,000 profiles. The Prisma Rust engine transferred hundreds of megabytes of raw JSON over IPC, and Node.js instantiated 300,000 complex JavaScript objects in V8 heap simultaneously, exceeding the 2GB heap limit.",
        "Prisma cannot handle more than 10 records.",
        "The database had no indexes."
      ],
      "answerIdx": 1,
      "debrief": "Never fetch unbounded datasets. Even when SQL queries are efficient, hydrating hundreds of thousands of active JavaScript objects into V8 memory will cause garbage collection freezes and Out-Of-Memory heap crashes. Enforce pagination (take / skip) on all queries."
    },
    "quests": [
      {
        "id": "fs-m1-d07-q1",
        "name": "Prisma Rust Query Engine IPC Architecture",
        "type": "concept",
        "desc": "Diagram the IPC communication boundary between Node.js JavaScript bindings and the compiled Prisma Rust query engine binary."
      },
      {
        "id": "fs-m1-d07-q2",
        "name": "N+1 Query vs Batched IN Profiler",
        "type": "detective",
        "desc": "Capture and inspect raw SQL queries emitted by Prisma across nested include operations versus raw joins."
      },
      {
        "id": "fs-m1-d07-q3",
        "name": "TypeScript Cursor-Based Prisma Repository",
        "type": "mastery",
        "desc": "Implement a high-performance repository in TypeScript using Prisma with cursor pagination and strict field selection."
      },
      {
        "id": "fs-m1-d07-q4",
        "name": "3 AM SRE: Unbounded FindMany V8 Heap Crash",
        "type": "incident",
        "desc": "Fix a production crash where an admin dashboard query fetched an unpaginated 500,000-row table into Node.js memory."
      }
    ]
  },
  {
    "day": 8,
    "month": 1,
    "blockNum": 2,
    "title": "Drizzle ORM: SQL-like Mental Model, Zero-Overhead Type Inference & Edge Compatibility",
    "stageName": "Stage 2: Applied Architecture",
    "stageNum": 2,
    "pedagogicalRole": "Modern ORMs (Drizzle Architecture & Zero-Overhead SQL)",
    "spokenGoal": "Explore the next generation of TypeScript data layers: Drizzle ORM. Contrast heavy abstraction ORMs (Prisma with Rust binaries) with lightweight query builders (Drizzle with pure TypeScript SQL compilers). Understand zero-overhead type inference (InferSelectModel, InferInsertModel), analyze edge runtime compatibility (Cloudflare Workers, Vercel Edge), and write expressive SQL joins without query engine IPC overhead.",
    "conceptInvariant": "Zero-Overhead SQL Invariant: Drizzle is a lightweight TypeScript dialect of SQL; if you know SQL, you know Drizzle. Drizzle generates exactly the SQL you wrote with zero background daemon processes, zero binary dependencies, and near-zero runtime CPU overhead.",
    "failureMode": "Attempting to deploy an ORM that requires heavy native binary engines (like Prisma's Rust engine) to low-memory edge runtimes or V8 isolates, causing cold-start timeouts and deployment package size rejections.",
    "tryItFriction": "Build a Drizzle ORM Schema and Query Layer in TypeScript: define pgTable tables with strict column types, infer TypeScript models, execute type-safe inner and left joins, and assert that the generated SQL matches handwritten raw SQL.",
    "socraticHints": [
      "Why is Drizzle ORM popular for serverless and edge computing?",
      "Drizzle has ZERO binary engines and tiny bundle size (< 50KB)! It compiles directly to parameterized SQL strings, executing in milliseconds on edge runtimes without cold starts.",
      "Use drizzle-orm/pg-core to declare schemas in pure TypeScript."
    ],
    "situationalPuzzle": {
      "scenario": "A high-frequency trading dashboard queries a PostgreSQL database. Benchmarks show Prisma has a P99 query overhead of 4.2ms per query (Node.js -> Rust IPC -> SQL -> Rust -> Node.js serialization). When replaced with Drizzle ORM, query overhead drops to 0.4ms. Why did latency drop by 10x?",
      "options": [
        "Drizzle writes data to disk faster than PostgreSQL.",
        "Zero-IPC Direct Driver Communication: Drizzle compiles directly to native SQL strings inside the Node.js V8 process and hands them straight to the node-postgres (pg) driver. There is no intermediate Rust engine, no inter-process communication, and no secondary JSON serialization layer.",
        "Drizzle skips all data validation.",
        "Drizzle uses WebSockets instead of TCP."
      ],
      "answerIdx": 1,
      "debrief": "Drizzle has no external runtime engine. It functions as a type-safe TypeScript compiler that emits native SQL directly into the underlying database driver (pg or neon), eliminating the IPC serialization and deserialization tax of external query engines."
    },
    "quests": [
      {
        "id": "fs-m1-d08-q1",
        "name": "Prisma vs Drizzle Architectural Comparison",
        "type": "concept",
        "desc": "Compare runtime architecture, memory footprint, cold starts, and typing models of Prisma versus Drizzle."
      },
      {
        "id": "fs-m1-d08-q2",
        "name": "Edge Bundle Size & Cold Start Profiler",
        "type": "detective",
        "desc": "Profile bundle sizes and cold-start latency of serverless functions using Drizzle vs traditional ORMs."
      },
      {
        "id": "fs-m1-d08-q3",
        "name": "TypeScript Drizzle Relations & Query Builder",
        "type": "mastery",
        "desc": "Implement a full Drizzle ORM data access layer with relational queries, prepared statements, and transactions."
      },
      {
        "id": "fs-m1-d08-q4",
        "name": "3 AM SRE: Edge Runtime Binary Incompatibility Crash",
        "type": "incident",
        "desc": "Migrate an edge microservice that failed deployment due to incompatible native engine binaries to Drizzle."
      }
    ]
  },
  {
    "day": 9,
    "month": 1,
    "blockNum": 2,
    "title": "Database Migrations: Zero-Downtime Expand-Contract Patterns & Shadow Database Validation",
    "stageName": "Stage 2: Applied Architecture",
    "stageNum": 2,
    "pedagogicalRole": "Production Reliability (Zero-Downtime Schema Migrations)",
    "spokenGoal": "Execute schema migrations without downtime: understand why naive migrations (e.g., dropping or renaming a column directly) crash live application pods. Master the Expand-Contract (Parallel Run) migration pattern across 4 distinct deployments: 1) Expand (add new column as nullable); 2) Dual-Write (app writes to both old and new columns); 3) Backfill (copy old data); 4) Contract (switch reads to new column, drop old column).",
    "conceptInvariant": "Backward-Compatibility Invariant: At any instant during a rolling deployment, both Version N (old app code) and Version N+1 (new app code) must be able to read and write to the database simultaneously without runtime errors.",
    "failureMode": "Renaming a column from email to email_address in a single migration script, immediately crashing all active Version N server pods because their SELECT queries still reference the now-nonexistent email column.",
    "tryItFriction": "Simulate an Expand-Contract Migration Pipeline in TypeScript: write a 3-step migration plan to split a full_name column into first_name and last_name, implement dual-write logic in the ORM, run a backfill script, and execute the final cleanup drop.",
    "socraticHints": [
      "Why can't you rename a database column in production in one step?",
      "Because during a rolling deployment, old pods are still running! If you rename the column in the database, old pods immediately crash on every single query!",
      "Add the new column first (Expand), deploy code that writes to both, backfill, and only drop the old column once all old pods are terminated."
    ],
    "situationalPuzzle": {
      "scenario": "A developer runs a migration on a 20-million-row PostgreSQL Users table: ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT false NOT NULL;. The migration locks the entire table for 45 seconds, causing hundreds of HTTP 504 Gateway Timeouts across the website. What PostgreSQL locking mechanism caused this, and how is it avoided in modern PostgreSQL?",
      "options": [
        "The migration ran out of disk space.",
        "Table Rewrite & AccessExclusiveLock: In older PostgreSQL versions, adding a column with a default value required a full table rewrite, acquiring an AccessExclusiveLock that blocked all reads and writes. In modern PostgreSQL (11+), adding a column with a constant default is metadata-only and instantaneous; otherwise, add nullable first and backfill in batches.",
        "PostgreSQL requires restarting the server to add columns.",
        "The table had too many foreign keys."
      ],
      "answerIdx": 1,
      "debrief": "Dangerous DDL migrations acquire an AccessExclusiveLock on tables. If a migration requires rewriting rows or validating unindexed constraints on millions of rows, it blocks all concurrent application queries. Safe migrations add nullable columns without default locks, backfill in batches, and validate constraints asynchronously."
    },
    "quests": [
      {
        "id": "fs-m1-d09-q1",
        "name": "Expand-Contract State Transition Timeline",
        "type": "concept",
        "desc": "Map the 4-phase deployment timeline showing database state, old code behavior, and new code behavior at each step."
      },
      {
        "id": "fs-m1-d09-q2",
        "name": "DDL Lock Level & Table Rewrite Inspector",
        "type": "detective",
        "desc": "Inspect PostgreSQL pg_locks and analyze lock levels acquired by ALTER TABLE, CREATE INDEX, and DROP COLUMN."
      },
      {
        "id": "fs-m1-d09-q3",
        "name": "TypeScript Batched Data Backfill Engine",
        "type": "mastery",
        "desc": "Implement a background backfill worker in TypeScript that migrates data in 1,000-row chunks with sleep intervals."
      },
      {
        "id": "fs-m1-d09-q4",
        "name": "3 AM SRE: Exclusive Lock Freezing Production Database",
        "type": "incident",
        "desc": "Resolve a production outage where an unindexed foreign key migration locked a primary table during peak traffic."
      }
    ]
  },
  {
    "day": 10,
    "month": 1,
    "blockNum": 2,
    "title": "Milestone 2: Production Multi-Tenant ORM Data Access Layer",
    "stageName": "Stage 2: Applied Architecture",
    "stageNum": 2,
    "pedagogicalRole": "Architectural Synthesis (Milestone Gate 2)",
    "spokenGoal": "Synthesize data architecture: engineer a production-ready Multi-Tenant ORM Data Access Layer in TypeScript using Drizzle or Prisma. Enforce strict row-level tenant isolation (tenant_id) across all queries, implement dynamic tenant context propagation via Node.js AsyncLocalStorage, build zero-downtime expand-contract migration scripts, and verify multi-tenant leak prevention under automated security audits.",
    "conceptInvariant": "Row-Level Tenant Isolation Invariant: Every database query executed on behalf of a tenant must automatically enforce a WHERE tenant_id = context.tenantId filter; an un-scoped query represents a critical vulnerability allowing cross-tenant data leakage.",
    "failureMode": "Writing a query like db.select().from(invoices).where(eq(invoices.id, id)) without scoping by tenant_id, allowing Tenant A to view Tenant B's confidential invoices by guessing invoice IDs (Insecure Direct Object Reference / IDOR).",
    "tryItFriction": "Build and verify the Milestone 2 data layer: wrap Drizzle/Prisma with AsyncLocalStorage to extract tenantId from request context, automatically inject tenant_id into all INSERT and SELECT operations, and run a penetration test asserting that Tenant A cannot access Tenant B's data under any condition.",
    "socraticHints": [
      "How do you automatically pass the current tenant_id to your database repository without passing it manually into every function parameter?",
      "Use Node.js AsyncLocalStorage! Set the tenantId in your Fastify request hook, and read it anywhere in your repository code via storage.getStore()!",
      "This guarantees tenant context across asynchronous call chains."
    ],
    "situationalPuzzle": {
      "scenario": "During a SOC 2 security compliance audit, an auditor asks: 'If a junior developer forgets to include where(eq(users.tenantId, tenantId)) in a new endpoint, what automated architectural safeguard prevents cross-tenant data leaks?' What is the gold-standard architectural answer?",
      "options": [
        "We rely on developers to always remember.",
        "PostgreSQL Row-Level Security (RLS) & ORM Extension Interceptors: 1) At the ORM layer, a custom client extension automatically intercepts all queries and injects the tenant filter; 2) At the database layer, PostgreSQL native Row-Level Security (RLS) policies enforce USING (tenant_id = current_setting('app.current_tenant_id')), mathematically blocking leaks even on raw SQL.",
        "We create a separate physical server for every customer.",
        "Data leaks are acceptable in multi-tenant systems."
      ],
      "answerIdx": 1,
      "debrief": "Defense-in-depth requires enforcing isolation at both the ORM query interceptor layer and the database kernel layer using PostgreSQL Row-Level Security (RLS). Even if a developer forgets the WHERE clause in application code, the database kernel automatically enforces tenant filtering."
    },
    "quests": [
      {
        "id": "fs-m1-d10-q1",
        "name": "Multi-Tenant Isolation Architecture Specification",
        "type": "concept",
        "desc": "Document tenant isolation models: Shared Database / Shared Schema vs Separate Schemas vs Separate Databases."
      },
      {
        "id": "fs-m1-d10-q2",
        "name": "Cross-Tenant IDOR Penetration Harness",
        "type": "detective",
        "desc": "Execute an automated penetration test attempting to read and mutate cross-tenant records across 100 endpoints."
      },
      {
        "id": "fs-m1-d10-q3",
        "name": "Milestone 2 Core Implementation",
        "type": "mastery",
        "desc": "Deliver the complete TypeScript Multi-Tenant Data Access Layer with AsyncLocalStorage and Drizzle/RLS enforcement."
      },
      {
        "id": "fs-m1-d10-q4",
        "name": "Milestone 2 Viva Defense Gate",
        "type": "incident",
        "desc": "Defend the tenant isolation guarantees, migration safety patterns, and RLS performance before the Security Board."
      }
    ]
  },

  # =========================================================================
  # BLOCK 3: AUTHENTICATION, AUTHORIZATION & SESSION MANAGEMENT (Days 11-15)
  # =========================================================================
  {
    "day": 11,
    "month": 1,
    "blockNum": 3,
    "title": "Stateful Sessions vs Stateless Tokens: Cookies (HttpOnly, Secure, SameSite) vs JWTs",
    "stageName": "Stage 3: Systems & Optimization",
    "stageNum": 3,
    "pedagogicalRole": "Security Foundations (Session Physics & Token Security)",
    "spokenGoal": "Debunk authentication myths: evaluate Stateful Sessions (opaque session IDs in Redis) vs Stateless Tokens (JSON Web Tokens / JWTs). Analyze browser cookie security flags: HttpOnly (blocks XSS theft), Secure (enforces HTTPS), and SameSite=Lax/Strict (blocks CSRF attacks). Understand JWT revocation challenges, and contrast database lookups with cryptographic signature verification.",
    "conceptInvariant": "Token Revocation & Storage Invariant: Storing JWTs in browser localStorage exposes them to instant theft via Cross-Site Scripting (XSS); authentication tokens must be stored in signed, HttpOnly, Secure, SameSite=Lax cookies, paired with server-side revocation lists.",
    "failureMode": "Storing access tokens in window.localStorage, allowing a single compromised third-party npm package or minor XSS flaw on a blog page to read localStorage.getItem('token') and exfiltrate user credentials to an attacker server.",
    "tryItFriction": "Build a Secure Cookie Session Manager in TypeScript: generate cryptographically random 256-bit session IDs (crypto.randomBytes), store session metadata in Redis with TTL expiration, set signed HttpOnly cookies in Fastify responses, and implement instant session revocation.",
    "socraticHints": [
      "Why is localStorage dangerous for storing authentication tokens?",
      "Any JavaScript running on the page—including third-party analytics, chat widgets, or malicious XSS scripts—can read localStorage directly! JavaScript cannot touch HttpOnly cookies.",
      "Always store sensitive session tokens in HttpOnly cookies."
    ],
    "situationalPuzzle": {
      "scenario": "A company uses stateless JWTs with a 7-day expiration time. An employee's laptop is stolen. The IT department disables the employee's account in the database. However, the thief continues to access internal company APIs for the next 6 days using the stolen JWT. Why did disabling the database account fail to block the thief?",
      "options": [
        "The database was not saved.",
        "Stateless Token Verification Bypass: Because the JWT is stateless and verified purely via cryptographic signature (jwt.verify), API gateways never check the database! The token remains valid until its exp timestamp passes. Fixing this requires short-lived access tokens (15 min) or a Redis token revocation blocklist.",
        "JWTs cannot be stolen.",
        "The thief cracked the secret key."
      ],
      "answerIdx": 1,
      "debrief": "Stateless JWTs cannot be revoked without state. If verified solely by signature, a stolen JWT remains valid until expiration. Production architectures use short-lived access tokens (10-15 minutes) paired with refresh tokens that check server revocation lists, or employ an instant Redis revocation blocklist."
    },
    "quests": [
      {
        "id": "fs-m1-d11-q1",
        "name": "Stateful Sessions vs JWT Trade-off Matrix",
        "type": "concept",
        "desc": "Compare memory cost, revocation latency, horizontal scalability, and security posture of Redis sessions vs JWTs."
      },
      {
        "id": "fs-m1-d11-q2",
        "name": "Cookie Flag Vulnerability Auditor",
        "type": "detective",
        "desc": "Inspect Set-Cookie headers across 50 applications to identify missing HttpOnly, Secure, or SameSite protections."
      },
      {
        "id": "fs-m1-d11-q3",
        "name": "TypeScript Secure Cookie Session Engine",
        "type": "mastery",
        "desc": "Implement a full session management module in TypeScript with Redis persistence, sliding expiration, and revocation."
      },
      {
        "id": "fs-m1-d11-q4",
        "name": "3 AM SRE: Stolen Token Exfiltration Breach",
        "type": "incident",
        "desc": "Contain a security breach where an XSS bug leaked thousands of tokens stored insecurely in browser localStorage."
      }
    ]
  },
  {
    "day": 12,
    "month": 1,
    "blockNum": 3,
    "title": "OAuth 2.1 & OpenID Connect (OIDC): PKCE Flow, Identity Providers & Claims Verification",
    "stageName": "Stage 3: Systems & Optimization",
    "stageNum": 3,
    "pedagogicalRole": "Federated Identity (OAuth 2.1 & OIDC Architecture)",
    "spokenGoal": "Implement enterprise federated identity: master OAuth 2.1 and OpenID Connect (OIDC). Understand why OAuth 2.1 deprecates the Implicit Grant and Resource Owner Password Credentials flows in favor of Authorization Code Flow with PKCE (Proof Key for Code Exchange). Walk through Code Verifier, Code Challenge (SHA-256), ID Token verification via JWKS (JSON Web Key Sets), and access token exchange.",
    "conceptInvariant": "PKCE Code Interception Invariant: Proof Key for Code Exchange (PKCE) generates a cryptographically random code_verifier and passes its SHA-256 hash (code_challenge) to the authorization server; a malicious app intercepting the authorization code cannot exchange it for tokens without the secret verifier.",
    "failureMode": "Implementing OAuth without PKCE or state validation, exposing users to Authorization Code Interception attacks and CSRF login attacks where an attacker links their own account to the victim's session.",
    "tryItFriction": "Implement an OIDC Client with PKCE in TypeScript: generate a 128-byte code_verifier, compute the base64url SHA-256 code_challenge, construct the authorization URL with state and nonce, exchange the authorization code for tokens, and verify the ID Token signature against a public JWKS endpoint.",
    "socraticHints": [
      "Why is the state parameter mandatory in OAuth authorization requests?",
      "To prevent CSRF login attacks! The client generates a random state token, stores it in a secure cookie, and verifies that the state returned by the authorization server matches exactly!",
      "If the state parameter does not match, reject the callback immediately."
    ],
    "situationalPuzzle": {
      "scenario": "A mobile application implements Google OAuth login. An attacker installs a rogue app on the victim's phone that registers the same custom URI scheme (myapp://oauth-callback). The rogue app intercepts the authorization code emitted by Google. However, when the rogue app attempts to exchange the code for tokens at Google's token endpoint, the request fails with 400 Bad Request. Why did the attack fail?",
      "options": [
        "Google blocked the phone's IP address.",
        "PKCE Verification Barrier: The legitimate app generated a random code_verifier and sent only code_challenge = SHA256(verifier) to Google. The rogue app intercepted the authorization code, but does NOT possess the in-memory code_verifier stored in the legitimate app's isolated memory space, rendering the stolen code useless.",
        "Custom URI schemes are encrypted by iOS/Android.",
        "OAuth codes only work once every 24 hours."
      ],
      "answerIdx": 1,
      "debrief": "This is precisely why PKCE was created. Even if an attacker or rogue app intercepts the authorization code on a device, they cannot exchange it for an access token without the unhashed code_verifier secret, which never left the original app's memory."
    },
    "quests": [
      {
        "id": "fs-m1-d12-q1",
        "name": "OAuth 2.1 PKCE Mathematical Flow Diagram",
        "type": "concept",
        "desc": "Diagram the complete sequence diagram of User, Browser, Client Backend, and Identity Provider under OAuth 2.1 PKCE."
      },
      {
        "id": "fs-m1-d12-q2",
        "name": "JWKS Signature Verification Engine",
        "type": "detective",
        "desc": "Fetch public RSA/ECDSA keys from a mock Google/Auth0 JWKS endpoint and verify JWT signature headers."
      },
      {
        "id": "fs-m1-d12-q3",
        "name": "TypeScript Full OIDC PKCE Client",
        "type": "mastery",
        "desc": "Implement a full OIDC client module in TypeScript handling PKCE generation, state validation, and token exchange."
      },
      {
        "id": "fs-m1-d12-q4",
        "name": "3 AM SRE: JWKS Key Rotation Token Verification Outage",
        "type": "incident",
        "desc": "Resolve a production authentication outage where an unhandled IdP public key rotation caused all user logins to fail."
      }
    ]
  },
  {
    "day": 13,
    "month": 1,
    "blockNum": 3,
    "title": "Role-Based Access Control (RBAC) vs Attribute-Based Access Control (ABAC) in Middleware",
    "stageName": "Stage 3: Systems & Optimization",
    "stageNum": 3,
    "pedagogicalRole": "Authorization Architecture (RBAC vs ABAC & Policy Engines)",
    "spokenGoal": "Architect scalable authorization: contrast Role-Based Access Control (RBAC: static roles like Admin, Editor, Viewer) with Attribute-Based Access Control (ABAC: dynamic rules evaluating Subject, Action, Resource, and Environment attributes). Implement permission middleware, avoid role explosion, and build fine-grained policy evaluation engines.",
    "conceptInvariant": "Authorization Principle of Least Privilege: Access decisions must evaluate attributes of both the actor and the target resource; static role checks alone fail to enforce resource ownership (e.g., 'User is an Editor, but do they own THIS specific document?').",
    "failureMode": "Using simple role checks like if (user.role === 'ADMIN') for all access control, leading to role explosion (e.g., BILLING_ADMIN, HR_ADMIN, AUDIT_ADMIN) and failing to prevent unauthorized access across organizational boundaries.",
    "tryItFriction": "Build an ABAC Policy Enforcement Middleware in TypeScript: define declarative policies (e.g., can(user, 'update', document) if document.ownerId === user.id OR user.role === 'ADMIN'), evaluate policy rules in Fastify preHandler hooks, and enforce fine-grained permissions.",
    "socraticHints": [
      "Why does RBAC fail when business rules require 'Doctors can only view medical records of patients assigned to them'?",
      "Because RBAC only knows the doctor's role! It cannot evaluate the dynamic relationship between the doctor and the specific patient record!",
      "ABAC evaluates attributes of both the subject (doctor ID) and the resource (assigned patient ID)."
    ],
    "situationalPuzzle": {
      "scenario": "A SaaS collaboration platform uses RBAC: roles = ['ADMIN', 'MEMBER']. A user with role 'MEMBER' in Company A sends a request: PATCH /api/projects/999 (a project owned by Company B). The endpoint code checks: if (user.role !== 'MEMBER') throw 403. The request succeeds and mutates Company B's project! What security vulnerability occurred?",
      "options": [
        "A buffer overflow attack.",
        "BOLA / IDOR Vulnerability (Missing ABAC Ownership Check): The endpoint checked the user's generic role (MEMBER) but completely failed to check resource ownership (project.companyId === user.companyId). This is Broken Object Level Authorization (OWASP API #1).",
        "The user's password was too short.",
        "RBAC requires 5 or more roles."
      ],
      "answerIdx": 1,
      "debrief": "Broken Object Level Authorization (BOLA/IDOR) is the #1 API security vulnerability. Checking that a user is an authorized 'MEMBER' is useless if you don't verify that the specific resource they are accessing belongs to their organization."
    },
    "quests": [
      {
        "id": "fs-m1-d13-q1",
        "name": "RBAC vs ABAC Formal Logic Formulations",
        "type": "concept",
        "desc": "Formalize access control decision functions in first-order logic for RBAC matrices versus ABAC policy predicates."
      },
      {
        "id": "fs-m1-d13-q2",
        "name": "BOLA / IDOR Endpoint Vulnerability Scanner",
        "type": "detective",
        "desc": "Audit 50 REST endpoints to identify routes checking roles but omitting resource ownership validation."
      },
      {
        "id": "fs-m1-d13-q3",
        "name": "TypeScript ABAC Policy Enforcement Engine",
        "type": "mastery",
        "desc": "Implement a full ABAC policy engine in TypeScript supporting subject, resource, and environmental rule evaluation."
      },
      {
        "id": "fs-m1-d13-q4",
        "name": "3 AM SRE: Cross-Tenant Project Mutation Incident",
        "type": "incident",
        "desc": "Remediate a critical security breach where a BOLA vulnerability allowed one enterprise customer to edit another's data."
      }
    ]
  },
  {
    "day": 14,
    "month": 1,
    "blockNum": 3,
    "title": "Password Hashing Physics: Argon2id vs Bcrypt vs PBKDF2 & Salt Entropy Mechanics",
    "stageName": "Stage 3: Systems & Optimization",
    "stageNum": 3,
    "pedagogicalRole": "Cryptographic Engineering (Password Storage & Key Derivation)",
    "spokenGoal": "Secure user credentials against GPU supercomputing cracking: understand password hashing physics. Compare general cryptographic hashes (MD5, SHA-256—which are catastrophically fast and crackable at billions of guesses/sec on GPUs) with slow Key Derivation Functions (KDFs). Dissect Bcrypt (CPU-hard), PBKDF2, and Argon2id (the winner of the Password Hashing Competition—both memory-hard and time-hard). Tune memory costs (m), time iterations (t), and parallelism (p).",
    "conceptInvariant": "Memory-Hard KDF Invariant: Argon2id enforces memory-hardness by requiring 64MB+ of RAM per hash calculation; this makes dedicated ASIC and GPU password-cracking rigs economically unviable due to memory bandwidth starvation.",
    "failureMode": "Hashing user passwords using SHA-256 or MD5 with a salt, allowing an attacker with a single modern RTX 4090 GPU to crack 8-character passwords at a rate of 25 billion hashes per second.",
    "tryItFriction": "Benchmark and configure Argon2id in TypeScript: generate cryptographically secure 16-byte random salts, hash passwords with calibrated parameters (timeCost = 3, memoryCost = 65536 KB, parallelism = 1), verify hashes against timing attacks, and measure computation latency (target: 250-500ms).",
    "socraticHints": [
      "Why is SHA-256 completely unsuitable for hashing passwords, even if you add a salt?",
      "Because SHA-256 was designed to be FAST! A single GPU can compute billions of SHA-256 hashes per second, making brute-force cracking trivial!",
      "Password hashing requires algorithms intentionally designed to be SLOW and MEMORY-INTENSIVE (Argon2id)."
    ],
    "situationalPuzzle": {
      "scenario": "A development team tunes Argon2id for user logins. An engineer sets memoryCost: 1024 KB and timeCost: 1 to make logins fast (5ms). During a penetration test, a security consultant cracks 92% of company passwords from a stolen database dump in 4 hours. What was the engineering defect?",
      "options": [
        "Argon2id has a known backdoor.",
        "Under-Parameterized KDF Tuning: Memory cost was set to only 1MB and timeCost to 1. At 1MB, the hash easily fits into the tiny L2/L3 cache of modern GPUs, eliminating the memory bandwidth bottleneck and allowing high-speed parallel GPU cracking. Recommended production parameters are at least 64MB RAM and timeCost >= 3.",
        "The passwords were not stored in plaintext.",
        "Salt length must be 1,000 bytes."
      ],
      "answerIdx": 1,
      "debrief": "Argon2id's strength comes from memory-hardness. If you set memoryCost too low (1MB), the memory buffer fits into GPU cache, rendering the memory-hard defense useless. Production configurations must use 64MB (65536 KB) of RAM and calibrated iterations to achieve ~300ms compute time."
    },
    "quests": [
      {
        "id": "fs-m1-d14-q1",
        "name": "Argon2id Memory-Hard Graph Mathematics",
        "type": "concept",
        "desc": "Explain how Argon2id combines Argon2d (data-dependent indexing) and Argon2i (data-independent indexing) to resist side-channel attacks."
      },
      {
        "id": "fs-m1-d14-q2",
        "name": "GPU Password Cracking Throughput Benchmark",
        "type": "detective",
        "desc": "Calculate theoretical cracking times across SHA-256, Bcrypt (cost 12), and Argon2id (64MB) against an 8x RTX 4090 cluster."
      },
      {
        "id": "fs-m1-d14-q3",
        "name": "TypeScript Argon2id Authentication Module",
        "type": "mastery",
        "desc": "Build a production-grade password hashing and constant-time verification module in TypeScript using Argon2id."
      },
      {
        "id": "fs-m1-d14-q4",
        "name": "3 AM SRE: DoS Attack via Password Hashing Saturation",
        "type": "incident",
        "desc": "Mitigate a denial-of-service attack where an attacker flooded the login endpoint to starve server CPU via heavy Argon2id computation."
      }
    ]
  },
  {
    "day": 15,
    "month": 1,
    "blockNum": 3,
    "title": "Milestone 3: End-to-End Secure Auth & Session Engine",
    "stageName": "Stage 3: Systems & Optimization",
    "stageNum": 3,
    "pedagogicalRole": "Architectural Synthesis (Milestone Gate 3)",
    "spokenGoal": "Synthesize security and authentication: engineer a complete End-to-End Secure Auth & Session Engine in TypeScript. Implement Argon2id password hashing with calibrated memory cost, OIDC PKCE federated login, stateful Redis session management with signed HttpOnly cookies, ABAC resource ownership validation middleware, rate-limiting on login routes, and automated token revocation.",
    "conceptInvariant": "Zero-Trust Session Invariant: Every authenticated request must cryptographically verify session validity, check real-time Redis revocation status, and enforce resource ownership; no client token is trusted without server-side validation.",
    "failureMode": "Failing to implement rate limiting on the login endpoint, allowing credential stuffing attacks to test 100,000 compromised passwords against user accounts and exhausting server CPU via Argon2id computation.",
    "tryItFriction": "Execute the Milestone 3 security verification suite: test credential registration, login with secure cookie generation, session invalidation across all devices, ABAC permission enforcement on protected routes, and verify that rate limiters block brute-force attempts after 5 failures.",
    "socraticHints": [
      "Why must password hashing endpoints have aggressive rate limiting?",
      "Because password hashing is intentionally CPU-intensive! An attacker sending 100 requests per second to /login can easily cause 100% CPU starvation and crash your server without ever guessing a password!",
      "Enforce IP and account rate limiting (e.g., 5 attempts per minute) on all authentication endpoints."
    ],
    "situationalPuzzle": {
      "scenario": "A user clicks 'Log out of all devices' on their account settings. In an architecture using stateless JWTs stored in cookies, how can the server instantly invalidate active access tokens on all other devices without changing the JWT signing secret?",
      "options": [
        "Tell the other devices to delete their cookies.",
        "Token Versioning / Min-Issued-At Timestamp in Redis: The user record stores a tokenVersion integer (or minIssuedAt timestamp). When 'Log out all' is clicked, the server increments tokenVersion in Redis. Incoming requests must verify that the version claim in their JWT matches the current tokenVersion in Redis; mismatches are rejected immediately.",
        "Restart the entire backend server.",
        "Wait 7 days for tokens to naturally expire."
      ],
      "answerIdx": 1,
      "debrief": "Token versioning is the standard pattern for revoking JWTs across devices. Storing a simple tokenVersion integer or passwordChangedAt timestamp in Redis allows instant invalidation. When verified against the token's payload, all older tokens are immediately rejected."
    },
    "quests": [
      {
        "id": "fs-m1-d15-q1",
        "name": "Milestone 3 Architecture & Threat Model Blueprint",
        "type": "concept",
        "desc": "Document the end-to-end authentication flow, session state machine, and STRIDE threat model for the Auth Engine."
      },
      {
        "id": "fs-m1-d15-q2",
        "name": "Credential Stuffing & Brute-Force Stress Suite",
        "type": "detective",
        "desc": "Subject the authentication endpoints to automated credential stuffing attacks to verify rate-limiting protection."
      },
      {
        "id": "fs-m1-d15-q3",
        "name": "Milestone 3 Core Implementation",
        "type": "mastery",
        "desc": "Deliver the complete TypeScript Auth & Session Engine with Argon2id, secure cookies, and ABAC middleware."
      },
      {
        "id": "fs-m1-d15-q4",
        "name": "Milestone 3 Viva Defense Gate",
        "type": "incident",
        "desc": "Defend the cryptographic parameters, session revocation strategy, and BOLA prevention before the Chief Security Architect."
      }
    ]
  }
]
