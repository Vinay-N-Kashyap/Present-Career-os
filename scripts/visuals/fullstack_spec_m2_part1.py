# scripts/visuals/fullstack_spec_m2_part1.py
# Course 13: Full-Stack JavaScript Engineering (course-fullstack-js)
# Month 2: Days 31-45 (Blocks 7-9) - 60 Quests Total

FULLSTACK_M2_PART1 = [
  # =========================================================================
  # BLOCK 7: ASYNCHRONOUS BACKGROUND JOBS, QUEUES & MICROSERVICES (Days 31-35)
  # =========================================================================
  {
    "day": 31,
    "month": 2,
    "blockNum": 7,
    "title": "Background Processing Physics: Offloading Long Tasks, Event Loop Unblocking & BullMQ Architecture",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Asynchronous Architecture (Job Queues & Event Loop Offloading)",
    "spokenGoal": "Eliminate web server stalls: understand the physics of asynchronous background processing. Analyze why running heavy tasks (video encoding, PDF generation, CSV exports, bulk emails) inside HTTP request handlers blocks the single-threaded Node.js event loop and triggers gateway timeouts. Master BullMQ over Redis: understand job queues, producer-consumer decoupling, and Redis Streams/sorted sets for job scheduling.",
    "conceptInvariant": "Event Loop Liberation Invariant: An HTTP request handler must never execute CPU-intensive or unbounded I/O tasks synchronously; long-running operations must be enqueued as persistent background jobs within < 10ms, returning an immediate 202 Accepted with a tracking jobId.",
    "failureMode": "Generating a 50-page customer PDF invoice synchronously inside an Express route handler, locking the Node.js event loop for 4.2 seconds, causing 800 concurrent HTTP requests from other users to stall and time out.",
    "tryItFriction": "Build an Asynchronous Job Producer and Consumer in TypeScript using BullMQ: accept an export request in Fastify, enqueue a job to a Redis-backed queue within 5ms, return 202 Accepted, and process the job in an independent worker with progress updates.",
    "socraticHints": [
      "Why can't you just use setImmediate() or setTimeout() to run background tasks in Node.js?",
      "Because if the Node.js process crashes, restarts during deployment, or runs out of memory, all tasks scheduled via setTimeout() are permanently lost without recovery!",
      "BullMQ persists jobs in Redis, guaranteeing durability across server restarts."
    ],
    "situationalPuzzle": {
      "scenario": "A photo-sharing service allows users to upload avatars. An engineer writes the avatar resizing logic (using Sharp) directly inside the POST /api/avatar handler. Under normal traffic, it works. During a marketing spike, 200 users upload avatars at once. Suddenly, all health checks fail and the server stops responding to any requests. What happened to Node.js?",
      "options": [
        "PostgreSQL ran out of storage.",
        "Event Loop Starvation / Thread Pool Exhaustion: Image resizing is CPU-heavy and saturates the libuv thread pool (default 4 threads). With 200 concurrent image transforms, all worker threads and the main V8 event loop were blocked, preventing the server from handling incoming HTTP sockets or responding to Kubernetes health probes.",
        "Sharp deleted the uploaded images.",
        "Fastify does not support images."
      ],
      "answerIdx": 1,
      "debrief": "CPU-bound tasks (like image processing or cryptography) saturate the libuv worker thread pool and freeze the Node.js event loop. Offloading these tasks to dedicated BullMQ worker processes or worker_threads keeps the web server's event loop free to handle thousands of concurrent I/O requests."
    },
    "quests": [
      {
        "id": "fs-m2-d31-q1",
        "name": "Event Loop Blocking Latency Formulation",
        "type": "concept",
        "desc": "Calculate the mathematical queuing delay multiplier when an HTTP thread blocks for T milliseconds under arrival rate lambda."
      },
      {
        "id": "fs-m2-d31-q2",
        "name": "Libuv Thread Pool Saturation Profiler",
        "type": "detective",
        "desc": "Profile event loop delay and thread pool utilization when running concurrent synchronous cryptographic operations."
      },
      {
        "id": "fs-m2-d31-q3",
        "name": "TypeScript BullMQ Job Pipeline",
        "type": "mastery",
        "desc": "Implement a full producer-consumer queue in TypeScript using BullMQ with job progress tracking and status endpoints."
      },
      {
        "id": "fs-m2-d31-q4",
        "name": "3 AM SRE: Health Probe Timeout During Bulk PDF Export",
        "type": "incident",
        "desc": "Resolve a production outage where synchronous PDF rendering caused Kubernetes to declare pods dead and restart them."
      }
    ]
  },
  {
    "day": 32,
    "month": 2,
    "blockNum": 7,
    "title": "Job Lifecycle & State Machines: Active, Delayed, Waiting, Failed & Dead-Letter Queues (DLQ)",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Resilient Queue Engineering (State Machines & Dead-Letter Queues)",
    "spokenGoal": "Engineer fault-tolerant background pipelines: master the complete BullMQ job state machine (Waiting -> Active -> Completed / Failed / Delayed). Implement exponential backoff retry policies with jitter, handle transient third-party API errors, build Dead-Letter Queues (DLQ) to quarantine permanently poison jobs, and set up alert triggers for manual operational replay.",
    "conceptInvariant": "Poison Pill Quarantine Invariant: A malformed job that repeatedly fails after maximum retries must be quarantined into a Dead-Letter Queue (DLQ); failing to quarantine allows poison pills to consume infinite worker retries and starve healthy jobs.",
    "failureMode": "Configuring infinite retries with 0 backoff on a payment webhook worker, causing a single corrupt payload to crash the worker in a continuous loop, accumulating 500,000 failed attempts and filling Redis memory.",
    "tryItFriction": "Build a Resilient Retry & Dead-Letter Queue Pipeline in TypeScript: configure BullMQ with attempts: 3 and backoff: { type: 'exponential', delay: 1000 }, simulate a failing job, verify that failed attempts back off exponentially, and trap final exhaustion into a dedicated DLQ with Sentry alerts.",
    "socraticHints": [
      "Why must exponential backoff include randomness (jitter)?",
      "Because if a third-party service recovers after an outage, 10,000 retrying workers without jitter will all fire at the exact same millisecond, hammering the service with a 'thundering herd' retry storm that immediately knocks it down again!",
      "Full jitter disperses retries uniformly across the retry window."
    ],
    "situationalPuzzle": {
      "scenario": "A background queue processes 100,000 daily email notifications. An external email provider experiences a 20-minute outage. Without backoff, 50 workers retry failed emails every 5 seconds, exhausting rate limits and getting the company's API key permanently banned. How does proper queue configuration prevent this disaster?",
      "options": [
        "Delete all pending emails during outages.",
        "Exponential Backoff with Full Jitter & Circuit Breaker: Configure attempts: 5 with exponential backoff (e.g., 2s, 4s, 8s, 16s, 32s) plus full jitter. If failure rates exceed 50%, a Circuit Breaker trips and pauses the queue entirely for 5 minutes, protecting both external APIs and internal workers.",
        "Increase worker concurrency to 500.",
        "Switch to sending emails over WebSockets."
      ],
      "answerIdx": 1,
      "debrief": "Resilient queues combine exponential backoff with jitter and automated circuit breakers. When an external dependency fails, the queue slows down its retry cadence and can automatically pause itself, preventing thundering herds and API key bans."
    },
    "quests": [
      {
        "id": "fs-m2-d32-q1",
        "name": "Queue State Machine Formal Specification",
        "type": "concept",
        "desc": "Formally specify the state transitions, Redis data structures (ZSET, HASH, STREAM), and locks of the BullMQ state machine."
      },
      {
        "id": "fs-m2-d32-q2",
        "name": "Thundering Herd Retry Storm Simulator",
        "type": "detective",
        "desc": "Simulate 1,000 retrying jobs to visualize request spike distributions with fixed backoff versus exponential backoff with jitter."
      },
      {
        "id": "fs-m2-d32-q3",
        "name": "TypeScript DLQ Quarantine & Replay Manager",
        "type": "mastery",
        "desc": "Implement an automated Dead-Letter Queue system in TypeScript with Slack alerts and programmatic replay endpoints."
      },
      {
        "id": "fs-m2-d32-q4",
        "name": "3 AM SRE: Redis Memory Collapse via Poison Pill Loop",
        "type": "incident",
        "desc": "Recover from an operational emergency where a bug in an unquarantined job accumulated 1.2 million error logs in Redis."
      }
    ]
  },
  {
    "day": 33,
    "month": 2,
    "blockNum": 7,
    "title": "Worker Concurrency, Sandboxed Child Processes & Graceful Shutdown Draining",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Production Infrastructure (Worker Scaling & Process Isolation)",
    "spokenGoal": "Scale background worker clusters: tune worker concurrency (I/O-bound vs CPU-bound concurrency math). Run CPU-heavy tasks in Sandboxed Child Processes (forked processes) to prevent worker crashes from killing the queue manager. Master graceful shutdown draining: intercept SIGTERM, pause the queue, allow active jobs to finish or move back to waiting, and close Redis connections cleanly.",
    "conceptInvariant": "Worker Drain Invariant: Upon receiving SIGTERM, a worker must immediately stop picking up new jobs, wait for in-flight jobs to finish up to a grace period (e.g., 25s), and move uncompleted jobs back to 'waiting' state in Redis before exiting.",
    "failureMode": "Terminating a worker process abruptly during deployment with SIGKILL while it is mid-way through generating a large bank wire transaction, leaving the job permanently locked in 'active' state in Redis.",
    "tryItFriction": "Build a Sandboxed Worker Cluster in TypeScript: spawn 4 child worker processes, dispatch CPU-intensive tasks, simulate a SIGTERM signal during active job processing, and verify that the worker drains cleanly without losing in-flight jobs.",
    "socraticHints": [
      "What is a Sandboxed Processor in BullMQ?",
      "Instead of running the job function in the main thread, BullMQ forks a separate Node.js child process to execute the job! If the job causes a segmentation fault or unhandled error, only the child process dies—the main queue stays healthy!",
      "Use sandboxed processors for risky third-party scripts or CPU-heavy parsing."
    ],
    "situationalPuzzle": {
      "scenario": "A Kubernetes cluster runs 10 BullMQ worker pods. During a rolling deployment, Kubernetes terminates old pods. 40 jobs that were actively running fail with: 'Job stalled more than maxStalledCount times'. The jobs were retried from scratch, duplicating half-finished work. How should the worker handle Kubernetes deployments?",
      "options": [
        "Disable Kubernetes rolling updates.",
        "SIGTERM Graceful Queue Draining: Configure a preStop hook and SIGTERM handler: worker.close(). This pauses the worker so it accepts 0 new jobs, allows current jobs up to 25 seconds to complete, and safely unlocks and re-queues any jobs that cannot finish before termination, preventing stalled lock penalties.",
        "Set stallInterval to 0.",
        "Workers should never run in containers."
      ],
      "answerIdx": 1,
      "debrief": "Workers in Kubernetes must participate in graceful draining. Calling worker.close() stops accepting new jobs while waiting for in-flight tasks to finish. Kubernetes terminationGracePeriodSeconds should be set higher than the job timeout to allow all active work to complete."
    },
    "quests": [
      {
        "id": "fs-m2-d33-q1",
        "name": "Worker Concurrency Little's Law Math",
        "type": "concept",
        "desc": "Calculate optimal worker concurrency C = arrival_rate * service_time across I/O-bound and CPU-bound pipelines."
      },
      {
        "id": "fs-m2-d33-q2",
        "name": "Stalled Job Lock Expiration Analyzer",
        "type": "detective",
        "desc": "Inspect how BullMQ uses Redis distributed locks (lockDuration, maxStalledCount) to detect dead workers."
      },
      {
        "id": "fs-m2-d33-q3",
        "name": "TypeScript Sandboxed Worker Cluster",
        "type": "mastery",
        "desc": "Build a production multi-core worker manager in TypeScript with process sandboxing and SIGTERM draining."
      },
      {
        "id": "fs-m2-d33-q4",
        "name": "3 AM SRE: Stalled Job Duplication Cascade",
        "type": "incident",
        "desc": "Fix a production incident where long database locks caused BullMQ to declare jobs stalled and execute them twice."
      }
    ]
  },
  {
    "day": 34,
    "month": 2,
    "blockNum": 7,
    "title": "Event-Driven Microservices: Transactional Outbox Pattern & Change Data Capture (Debezium)",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Distributed Data Consistency (Transactional Outbox & CDC)",
    "spokenGoal": "Solve the Dual-Write Problem in microservices: understand why saving to a database and publishing to a message broker (RabbitMQ/Kafka) in the same function cannot guarantee atomicity (if the broker is down, the DB is saved but the event is lost; if the DB rolls back, the event was already published). Implement the Transactional Outbox Pattern: write the domain entity AND the outbox event in the same ACID database transaction, and tail the outbox via Change Data Capture (Debezium / pg_logical).",
    "conceptInvariant": "Transactional Outbox Invariant: A business state change and its corresponding domain event must be committed within the exact same database transaction; asynchronous outbox tailers guarantee at-least-once event delivery to the message broker without dual-write race conditions.",
    "failureMode": "Executing await db.orders.create() followed by await kafka.send(), where the network drops before Kafka send succeeds, leaving an order saved in the database that was never broadcast to inventory or payment services.",
    "tryItFriction": "Build a Transactional Outbox Worker in TypeScript: inside a single PostgreSQL transaction, insert an Order row and an OutboxEvent row; write a background poller using SELECT FOR UPDATE SKIP LOCKED that reads pending outbox events, publishes them to a mock message broker, and marks them processed.",
    "socraticHints": [
      "Why is a 2-Phase Commit (2PC) between PostgreSQL and Kafka undesirable in modern web apps?",
      "2PC requires distributed coordinators, causes blocking locks across services, is not supported natively by modern message brokers like Kafka, and introduces severe latency bottlenecks!",
      "The Transactional Outbox pattern achieves reliable eventual consistency using standard local database transactions."
    ],
    "situationalPuzzle": {
      "scenario": "An order management system saves an order to PostgreSQL and publishes an 'OrderCreated' event to RabbitMQ. Occasionally, when the database is under heavy load, orders are created in the database, but no event ever arrives in RabbitMQ, leaving customers with charged cards but no shipped orders. What architectural pattern eliminates this dual-write bug?",
      "options": [
        "Publish to RabbitMQ first, then save to the database.",
        "Transactional Outbox with Debezium CDC: Write the order and an outbox record into PostgreSQL in ONE local transaction. A Change Data Capture (CDC) tool like Debezium reads the PostgreSQL write-ahead log (WAL) and streams the event to RabbitMQ with at-least-once delivery guarantees.",
        "Use setTimeout(1000) before sending to RabbitMQ.",
        "Microservices should never use events."
      ],
      "answerIdx": 1,
      "debrief": "Writing to both a database and a message broker separately is the classic dual-write anti-pattern. Writing the event to an outbox table in the same local transaction ensures that if the database write commits, the event is guaranteed to exist and will be published by CDC."
    },
    "quests": [
      {
        "id": "fs-m2-d34-q1",
        "name": "Dual-Write Failure Mode Proof",
        "type": "concept",
        "desc": "Prove mathematically why dual-write architectures over independent non-atomic systems guarantee eventual inconsistency."
      },
      {
        "id": "fs-m2-d34-q2",
        "name": "PostgreSQL WAL CDC Pipeline Inspector",
        "type": "detective",
        "desc": "Inspect PostgreSQL pg_logical replication slots to understand how Debezium streams row mutations from the WAL."
      },
      {
        "id": "fs-m2-d34-q3",
        "name": "TypeScript Transactional Outbox Engine",
        "type": "mastery",
        "desc": "Implement a full Transactional Outbox system in TypeScript with SKIP LOCKED polling and idempotent dispatch."
      },
      {
        "id": "fs-m2-d34-q4",
        "name": "3 AM SRE: Orphaned Orders via Dual-Write Network Partition",
        "type": "incident",
        "desc": "Resolve a production desync where a network glitch dropped events for 4,000 paid customer orders."
      }
    ]
  },
  {
    "day": 35,
    "month": 2,
    "blockNum": 7,
    "title": "Milestone 6: Distributed Event-Driven Job Processor Engine",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Architectural Synthesis (Milestone Gate 6)",
    "spokenGoal": "Synthesize asynchronous event architectures: build a production-grade Distributed Event-Driven Job Processor Engine in TypeScript. Deliver a BullMQ queue infrastructure with sandboxed worker processes, exponential backoff retries with jitter, a Dead-Letter Queue (DLQ) with automated alert webhooks, a Transactional Outbox pipeline with SKIP LOCKED polling, and graceful SIGTERM drain handling.",
    "conceptInvariant": "End-to-End Event Durability Invariant: No business event or background task may be lost due to worker crashes, server restarts, or external API outages; all tasks must guarantee at-least-once delivery and idempotent execution.",
    "failureMode": "Failing to implement idempotency in background event workers, causing a replayed payment event from the outbox to charge the customer a second time.",
    "tryItFriction": "Execute the Milestone 6 verification suite: enqueue 500 mixed jobs (instant tasks, heavy PDF transforms, intentionally failing tasks, and transactional outbox events), simulate a worker SIGKILL crash during processing, and assert that 100% of jobs complete or quarantine into the DLQ with zero lost tasks and zero duplicate executions.",
    "socraticHints": [
      "How do workers ensure that processing an event twice doesn't cause bugs?",
      "Every event carries a unique event_id or idempotency key! The worker checks if event_id was already processed in a processed_events table before running any side effects!",
      "This turns at-least-once delivery into effectively-once processing."
    ],
    "situationalPuzzle": {
      "scenario": "During the Milestone 6 architecture defense, an evaluator asks: 'Your outbox processor polls the outbox table every 500ms using SELECT FOR UPDATE SKIP LOCKED. What happens if traffic spikes to 50,000 events/sec? Does polling still scale?' How do you evolve the architecture?",
      "options": [
        "Increase polling frequency to every 1ms.",
        "Transition from Polling to PostgreSQL LISTEN/NOTIFY or Debezium WAL Streaming: For massive event volumes, replace active table polling with PostgreSQL LISTEN/NOTIFY (for push notifications on commit) or zero-overhead Debezium CDC streaming directly from the database write-ahead log (WAL).",
        "Drop half of the events to maintain speed.",
        "Switch back to synchronous HTTP calls."
      ],
      "answerIdx": 1,
      "debrief": "Polling tables with SKIP LOCKED works great for moderate throughput, but creates database query overhead at high scale. Transitioning to push-based CDC (like Debezium reading the database WAL) eliminates polling entirely, streaming events to Kafka at tens of thousands of events per second."
    },
    "quests": [
      {
        "id": "fs-m2-d35-q1",
        "name": "Milestone 6 System Architecture Blueprint",
        "type": "concept",
        "desc": "Document the complete event-driven architecture, queue state machines, outbox tables, and recovery procedures."
      },
      {
        "id": "fs-m2-d35-q2",
        "name": "Worker Crash & Event Replay Stress Suite",
        "type": "detective",
        "desc": "Simulate 50 worker container crashes and verify that 100% of outbox events are safely re-processed without duplicates."
      },
      {
        "id": "fs-m2-d35-q3",
        "name": "Milestone 6 Core Implementation",
        "type": "mastery",
        "desc": "Deliver the complete TypeScript Distributed Event-Driven Job Processor Engine with BullMQ and Transactional Outbox."
      },
      {
        "id": "fs-m2-d35-q4",
        "name": "Milestone 6 Viva Defense Gate",
        "type": "incident",
        "desc": "Defend the queue concurrency bounds, DLQ operational playbooks, and idempotency guarantees before the Systems Board."
      }
    ]
  },

  # =========================================================================
  # BLOCK 8: EDGE COMPUTING, GLOBAL CACHING & SERVERLESS (Days 36-40)
  # =========================================================================
  {
    "day": 36,
    "month": 2,
    "blockNum": 8,
    "title": "Edge Runtimes vs Node.js: V8 Isolates, Cold Starts & Microsecond Execution Bounds",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Edge Systems (V8 Isolates & Edge Latency Physics)",
    "spokenGoal": "Master edge computing: contrast traditional server runtimes (Node.js/Docker with full OS virtualization, requiring 500MB RAM and 2-second cold starts) with Edge Runtimes (Cloudflare Workers, Vercel Edge, Deno based on lightweight V8 Isolates). Understand V8 Isolate memory sandboxing (running thousands of isolated customer scripts inside ONE OS process with 5ms cold starts), and navigate edge constraints (no native fs module, no child_process, Web Standards APIs only).",
    "conceptInvariant": "V8 Isolate Sandboxing Invariant: Edge runtimes execute code inside lightweight V8 Isolates rather than full OS processes or virtual machines; startup cold starts drop from seconds to < 5ms, but code is strictly sandboxed to Web Standards APIs (fetch, Request, Response, Crypto).",
    "failureMode": "Importing a Node.js-specific library (like fs or path or crypto without globalThis.crypto) into an edge middleware function, causing deployment rejection or fatal runtime crashes on edge CDN nodes.",
    "tryItFriction": "Build an Edge Runtime Compatible Micro-Service in TypeScript: write a standalone handler using standard Request and Response objects, verify zero Node.js native dependencies, implement edge geolocation header inspection (cf-ipcountry), and run locally in a simulated V8 Isolate environment (Miniflare/Workerd).",
    "socraticHints": [
      "Why can a server run 10,000 V8 Isolates simultaneously, but struggles to run 100 Docker containers?",
      "Because Docker virtualizes an entire operating system kernel and filesystem! A V8 Isolate is just a lightweight memory context inside a single running Chrome V8 process, taking only ~5MB of RAM!",
      "Isolates spin up in under 5 milliseconds with minimal memory overhead."
    ],
    "situationalPuzzle": {
      "scenario": "A company deploys an edge middleware to geolocate users and route them to regional backends. An engineer imports a heavy third-party user-agent parsing library. Suddenly, edge requests fail with: 'Worker exceeded CPU time limit (50ms)'. The server was not out of RAM. What constraint of edge runtimes was triggered?",
      "options": [
        "The edge server ran out of disk space.",
        "Edge CPU Time Quotas: Edge runtimes enforce strict wall-clock and CPU time budgets (typically 10ms-50ms CPU time per request) to prevent rogue scripts from starving the shared V8 process. Running expensive regex parsers or synchronous loops violates the microsecond execution budget.",
        "Edge runtimes cannot parse text.",
        "The user-agent string was too short."
      ],
      "answerIdx": 1,
      "debrief": "Edge workers operate under strict CPU limits (e.g., 50ms active CPU time). While waiting for asynchronous I/O (like fetch) does not count against CPU time, expensive synchronous computations (like regexes over massive strings or heavy compilation) will cause the edge runtime to terminate the worker."
    },
    "quests": [
      {
        "id": "fs-m2-d36-q1",
        "name": "OS Processes vs V8 Isolates Memory Formulation",
        "type": "concept",
        "desc": "Compare memory overhead, context switching costs, and cold-start latency between Docker containers and V8 Isolates."
      },
      {
        "id": "fs-m2-d36-q2",
        "name": "Node.js Native Dependency Edge Compatibility Scanner",
        "type": "detective",
        "desc": "Scan package.json dependencies to flag packages that depend on Node.js native C++ addons or non-edge modules."
      },
      {
        "id": "fs-m2-d36-q3",
        "name": "TypeScript V8 Isolate Edge Service",
        "type": "mastery",
        "desc": "Implement an edge service in TypeScript running on Web Standards APIs with geo-routing and headers."
      },
      {
        "id": "fs-m2-d36-q4",
        "name": "3 AM SRE: Edge CPU Limit Termination Outage",
        "type": "incident",
        "desc": "Fix an edge outage where an un-optimized regex in user authentication exceeded the 50ms edge CPU quota."
      }
    ]
  },
  {
    "day": 37,
    "month": 2,
    "blockNum": 8,
    "title": "Global CDN Caching & Edge Middleware: Stale-While-Revalidate, Surrogate Keys & Geo-Routing",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Edge Performance (CDN Caching & Surrogate Key Purging)",
    "spokenGoal": "Deliver sub-10ms global web experiences: master Edge CDN caching. Understand HTTP Cache-Control headers (s-maxage, stale-while-revalidate, stale-if-error). Master Surrogate Keys (Cache-Tag): tagging CDN cache entries with entity IDs (e.g., product-456) and executing instantaneous API-driven cache purges globally in < 150ms. Implement edge middleware for A/B testing, auth gatekeeping, and regional geo-routing.",
    "conceptInvariant": "Edge Surrogate Key Invariant: Caching dynamic HTML/JSON at the CDN edge requires tagging responses with Surrogate-Key (or Cache-Tag) headers; mutating a resource must trigger an atomic edge API purge by tag to prevent stale data delivery globally.",
    "failureMode": "Setting Cache-Control: s-maxage=86400 on an e-commerce product page without Surrogate Keys or purge webhooks, leaving a discounted flash-sale price permanently cached on 200 global CDN edge nodes after the promotion ended.",
    "tryItFriction": "Build an Edge Caching & Purging Middleware in TypeScript: generate Cache-Control: public, s-maxage=3600, stale-while-revalidate=60 headers, attach Surrogate-Key tags, simulate edge CDN cache hit/miss behavior, and implement an edge purge webhook handler.",
    "socraticHints": [
      "What does 'stale-while-revalidate=60' tell the CDN edge node?",
      "It tells the CDN: 'If the cache is older than s-maxage, serve the stale cached version to the user IMMEDIATELY (0ms latency), and fetch the fresh version from the origin server asynchronously in the background!'",
      "The user never experiences a slow page load."
    ],
    "situationalPuzzle": {
      "scenario": "A media publishing platform caches news articles on Fastly/Cloudflare edge nodes. An editor fixes a libelous typo in an article headline. If they purge the entire CDN cache, origin servers will be overwhelmed by millions of requests (CDN cache stampede). How does Surrogate Key purging resolve this?",
      "options": [
        "Change the domain name of the website.",
        "Targeted Surrogate Key Purge: The article was cached with header Surrogate-Key: article-789 author-42. The CMS triggers an API call: PURGE /tags/article-789. The CDN purges ONLY the cache entries associated with that exact article across all edge nodes worldwide in ~150ms, leaving all other articles cached.",
        "Wait 24 hours for the cache to expire.",
        "Surrogate keys cannot be purged via API."
      ],
      "answerIdx": 1,
      "debrief": "Surrogate Keys (or Cache-Tags) allow granular, targeted invalidation. Instead of purging URLs one-by-one or wiping the entire CDN (which triggers a catastrophic cache stampede on your backend origin), you purge only the specific entity tag across all edge locations worldwide."
    },
    "quests": [
      {
        "id": "fs-m2-d37-q1",
        "name": "CDN Cache-Control & SWR Protocol Mathematics",
        "type": "concept",
        "desc": "Diagram edge cache hit/miss/revalidate lifecycles under max-age, s-maxage, and stale-while-revalidate."
      },
      {
        "id": "fs-m2-d37-q2",
        "name": "Global Cache Stampede Risk Auditor",
        "type": "detective",
        "desc": "Calculate backend origin load spikes during full CDN cache flushes versus targeted surrogate key purges."
      },
      {
        "id": "fs-m2-d37-q3",
        "name": "TypeScript Edge Caching & Purge Simulator",
        "type": "mastery",
        "desc": "Implement an edge CDN simulator in TypeScript supporting surrogate key tagging, SWR, and instant tag purges."
      },
      {
        "id": "fs-m2-d37-q4",
        "name": "3 AM SRE: Stale Price Disaster on Global Edge Nodes",
        "type": "incident",
        "desc": "Recover from an incident where missing surrogate keys served outdated pricing across 40 international CDN points of presence."
      }
    ]
  },
  {
    "day": 38,
    "month": 2,
    "blockNum": 8,
    "title": "Serverless Database Drivers: WebSocket Pooling, HTTP Hyperdrive & Connection Multiplexing",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Database Architecture (Serverless Connections & Pooling)",
    "spokenGoal": "Solve the serverless database connection crisis: understand why traditional TCP database connection pooling fails in serverless/edge environments (10,000 ephemeral function instances opening 10,000 separate TCP connections instantly crashes PostgreSQL max_connections). Master modern serverless database drivers: Neon/Supabase WebSocket drivers, Cloudflare Hyperdrive connection pooling, and HTTP-based query endpoints with connection multiplexing.",
    "conceptInvariant": "Serverless Connection Multiplexing Invariant: Ephemeral serverless functions must not establish direct persistent TCP connections to relational databases; queries must be routed through connection poolers (PgBouncer) or multiplexed over WebSocket/HTTP proxies at the edge.",
    "failureMode": "Deploying a serverless Lambda function connecting directly to PostgreSQL with new Client() on every invocation, causing a sudden spike of 2,000 concurrent lambdas to exhaust PostgreSQL max_connections, taking down the entire database cluster.",
    "tryItFriction": "Build a Serverless Database Driver Simulator in TypeScript: compare connection latency across raw TCP connection establishment (TCP handshake + TLS + Postgres Auth = 180ms) versus edge WebSocket multiplexing (< 15ms) across 100 ephemeral function calls.",
    "socraticHints": [
      "Why can't edge runtimes (like Cloudflare Workers) connect to standard PostgreSQL over TCP directly?",
      "Historically, V8 Isolates did not support raw TCP sockets! Modern drivers tunnel PostgreSQL wire protocols over WebSockets to an edge proxy, which holds persistent TCP connections to the database!",
      "Tools like Cloudflare Hyperdrive maintain persistent pools close to your database."
    ],
    "situationalPuzzle": {
      "scenario": "A Next.js application deployed on Vercel Serverless crashes with: 'FATAL: remaining connection slots are reserved for non-replication superuser connections' during a marketing launch. PostgreSQL max_connections is set to 200, but Vercel scaled to 800 concurrent serverless lambdas. What architectural component resolves this connection bottleneck permanently?",
      "options": [
        "Increase max_connections to 50,000 in postgresql.conf.",
        "Transaction-Mode Connection Pooling (PgBouncer / AWS RDS Proxy): Deploy a connection pooler in Transaction Mode between the serverless lambdas and PostgreSQL. PgBouncer allows 800+ serverless functions to share a pool of only 20 physical PostgreSQL connections, releasing the connection immediately after each query transaction commits.",
        "Restart the database every 5 minutes.",
        "Switch to SQLite in memory."
      ],
      "answerIdx": 1,
      "debrief": "Serverless functions scale elastically, easily exceeding database connection limits. A transaction-mode connection pooler (like PgBouncer or Supabase Pooler) multiplexes hundreds of ephemeral serverless connections over a small pool of physical database connections, protecting PostgreSQL from exhaustion."
    },
    "quests": [
      {
        "id": "fs-m2-d38-q1",
        "name": "Serverless Connection Handshake Latency Math",
        "type": "concept",
        "desc": "Calculate roundtrip latency budgets: compare cold TCP/TLS handshakes vs pooled WebSocket connections."
      },
      {
        "id": "fs-m2-d38-q2",
        "name": "Connection Pool Starvation Simulator",
        "type": "detective",
        "desc": "Simulate 500 concurrent serverless lambdas querying a database with max_connections = 50 to observe connection rejection."
      },
      {
        "id": "fs-m2-d38-q3",
        "name": "TypeScript Serverless Database Client Wrapper",
        "type": "mastery",
        "desc": "Implement a serverless database connection wrapper in TypeScript with automated connection reuse and pooling."
      },
      {
        "id": "fs-m2-d38-q4",
        "name": "3 AM SRE: Max Connections Exhaustion During Flash Sale",
        "type": "incident",
        "desc": "Remediate a production database crash where unpooled serverless functions overwhelmed PostgreSQL connection limits."
      }
    ]
  },
  {
    "day": 39,
    "month": 2,
    "blockNum": 8,
    "title": "Distributed Rate Limiting & Edge Firewalls: Sliding Window Counters via Redis & KV",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Edge Security (Distributed Rate Limiting & Edge WAF)",
    "spokenGoal": "Protect global web platforms from scrapers, credential stuffers, and DDoS attacks: implement Distributed Rate Limiting. Contrast Fixed Window algorithms (vulnerable to 2x boundary bursts) with Sliding Window Log and Sliding Window Counter algorithms. Implement atomic rate limit checks in Redis using Lua scripts, and deploy edge rate limiting via Cloudflare Workers and Upstash KV with global sub-5ms latency.",
    "conceptInvariant": "Sliding Window Atomicity Invariant: Rate limiting checks and counter increments must execute atomically (via Redis Lua script or edge KV transactions) to prevent race conditions from allowing parallel concurrent requests to bypass quota ceilings.",
    "failureMode": "Implementing rate limiting with separate GET and SET calls in JavaScript (non-atomic), allowing a botnet executing 100 concurrent requests to read count = 0 simultaneously, bypassing a 10 req/min limit completely.",
    "tryItFriction": "Implement an Atomic Sliding Window Rate Limiter in TypeScript/Lua: write a Redis Lua script that records request timestamps in a Sorted Set (ZSET), trims entries older than (now - window), counts active elements (ZCARD), and conditionally adds the current request or returns 429 Too Many Requests.",
    "socraticHints": [
      "Why is a Fixed Window Counter vulnerable to traffic spikes at window boundaries?",
      "If the limit is 100 req/min, an attacker can send 100 requests at 00:59 and another 100 requests at 01:00! That's 200 requests in 2 seconds, completely overwhelming the server while passing the fixed window check!",
      "Sliding window algorithms evaluate a continuous rolling 60-second window."
    ],
    "situationalPuzzle": {
      "scenario": "A malicious scraper rotates 5,000 residential IP addresses to bypass standard IP-based rate limiting on an e-commerce catalog API. Each IP sends only 2 requests per minute. How does an edge rate limiter detect and block this distributed scraping attack without blocking legitimate users?",
      "options": [
        "Block all residential internet providers.",
        "Multi-Dimensional Fingerprinting & Behavioral Rate Limiting: Combine IP with device fingerprinting (JA4 TLS fingerprint, HTTP/2 header order, browser canvas hash) and session tokens. Enforce global rate limits across the entire anonymous session and trigger edge cryptographic proof-of-work challenges (Cloudflare Turnstile) on suspicious fingerprint clusters.",
        "Turn off the website for 1 hour.",
        "Rate limiting cannot stop distributed botnets."
      ],
      "answerIdx": 1,
      "debrief": "IP-only rate limiting fails against botnets using rotating residential proxies. Modern edge security employs multi-dimensional rate limiting: tracking TLS fingerprints (JA4), request patterns, and behavioral headers. When a distributed pattern is detected, the edge issues proof-of-work challenges (like Turnstile)."
    },
    "quests": [
      {
        "id": "fs-m2-d39-q1",
        "name": "Rate Limiting Algorithm Comparison Proof",
        "type": "concept",
        "desc": "Compare memory complexity, accuracy, and boundary vulnerabilities across Fixed Window, Token Bucket, and Sliding Window."
      },
      {
        "id": "fs-m2-d39-q2",
        "name": "Non-Atomic Race Condition Exploit Tracer",
        "type": "detective",
        "desc": "Demonstrate how concurrent requests bypass non-atomic GET-then-SET rate limiters across 50 simulated threads."
      },
      {
        "id": "fs-m2-d39-q3",
        "name": "TypeScript Atomic Redis Sliding Window Limiter",
        "type": "mastery",
        "desc": "Implement an industrial-grade sliding window rate limiter in TypeScript using Redis ZSETs and atomic Lua scripts."
      },
      {
        "id": "fs-m2-d39-q4",
        "name": "3 AM SRE: Scraper Botnet Scraping Entire Product Catalog",
        "type": "incident",
        "desc": "Mitigate a live distributed scraping attack by deploying edge fingerprint-based rate limiting rules."
      }
    ]
  },
  {
    "day": 40,
    "month": 2,
    "blockNum": 8,
    "title": "Milestone 7: Global Multi-Region Edge Caching Gateway",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Architectural Synthesis (Milestone Gate 7)",
    "spokenGoal": "Synthesize edge infrastructure: engineer a production-grade Global Multi-Region Edge Caching Gateway in TypeScript. Deliver an edge router running on V8 Isolates, enforcing atomic sliding-window rate limiting, serving dynamic content via Stale-While-Revalidate with Surrogate Keys, routing database queries over serverless WebSocket connection pools, and executing instant tag-based edge cache purges under 150ms globally.",
    "conceptInvariant": "Global Edge Cohesion Invariant: Edge nodes must protect backend origins by absorbing 90%+ of traffic via SWR caching, enforcing atomic rate limiting before requests cross the network, and purging stale entity tags across all global points of presence instantly upon data mutation.",
    "failureMode": "Failing to handle edge-to-origin network partitions gracefully, causing edge workers to throw raw 500 errors to users instead of serving stale cached content under stale-if-error headers.",
    "tryItFriction": "Execute the Milestone 7 benchmark: simulate 1,000 requests distributed across 5 simulated global regions, assert sub-15ms cached responses, test atomic rate limiting against burst traffic, trigger an inventory mutation, and verify that Surrogate-Key purging invalidates cache entries across all 5 regions within 150ms.",
    "socraticHints": [
      "What is the role of stale-if-error in high-availability edge caching?",
      "If your backend database goes down or origin servers crash, stale-if-error instructs the CDN edge to continue serving the cached version of the page rather than showing an error page!",
      "The website stays online even during total backend origin outages."
    ],
    "situationalPuzzle": {
      "scenario": "During the Milestone 7 review, an evaluator asks: 'If your primary PostgreSQL database in us-east-1 suffers a total region outage, how does your edge gateway architecture keep product catalog browsing alive for European and Asian shoppers?' What is the architectural solution?",
      "options": [
        "Tell users to come back tomorrow.",
        "Edge SWR with stale-if-error & Read-Replica Geo-Routing: 1) Edge CDN nodes serve product listings from local edge cache with stale-if-error=86400; 2) For cache misses, edge middleware automatically fails over database read queries to read-replicas in eu-west-1 and ap-southeast-1, maintaining 100% browsing availability.",
        "Switch all databases to local file storage.",
        "Edge nodes cannot cache without origin servers."
      ],
      "answerIdx": 1,
      "debrief": "Resilient edge architectures decouple browsing from primary database availability. Combining stale-if-error with multi-region read replicas ensures that even if the primary write region suffers a total outage, global users can still browse the full catalog from local edge caches."
    },
    "quests": [
      {
        "id": "fs-m2-d40-q1",
        "name": "Milestone 7 Architecture Blueprint",
        "type": "concept",
        "desc": "Document the complete edge routing topology, surrogate key tagging schema, and serverless database pooling strategy."
      },
      {
        "id": "fs-m2-d40-q2",
        "name": "Global Multi-Region Latency Benchmark Suite",
        "type": "detective",
        "desc": "Benchmark TTFB and P99 latency across uncached origin requests vs edge SWR cached responses across 5 continents."
      },
      {
        "id": "fs-m2-d40-q3",
        "name": "Milestone 7 Core Edge Implementation",
        "type": "mastery",
        "desc": "Deliver the complete TypeScript Global Multi-Region Edge Caching Gateway with rate limiting and surrogate purges."
      },
      {
        "id": "fs-m2-d40-q4",
        "name": "Milestone 7 Viva Defense Gate",
        "type": "incident",
        "desc": "Defend the edge latency budgets, surrogate invalidation guarantees, and failover mechanics before the Edge Directorate."
      }
    ]
  },

  # =========================================================================
  # BLOCK 9: REAL-TIME WEBSOCKETS, CRDTS & LOCAL-FIRST (Days 41-45)
  # =========================================================================
  {
    "day": 41,
    "month": 2,
    "blockNum": 9,
    "title": "Local-First Software Architecture: Offline-First Mental Models & Optimistic Persistence",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Local-First Engineering (Offline Storage & Client Sovereignty)",
    "spokenGoal": "Embrace the local-first software revolution: analyze the 7 ideals of Local-First software (Ink & Switch manifesto). Contrast the traditional cloud-dependent mental model (where the browser is a dumb terminal that breaks without Wi-Fi) with the local-first model (where user data is stored primarily in local browser storage like IndexedDB, providing instant 0ms interactions, full offline functionality, and seamless background synchronization).",
    "conceptInvariant": "Local Data Sovereignty Invariant: In local-first software, the primary copy of user data resides on the client's local device (IndexedDB/OPFS); all reads and writes execute against local storage immediately (0ms latency), while network synchronization occurs asynchronously in the background.",
    "failureMode": "Designing a mobile notes app that blocks user typing with a network spinner while waiting for a server POST response, causing lost notes when users enter elevators or lose cellular signal.",
    "tryItFriction": "Build an Offline-First Persistence Store in TypeScript using IndexedDB: implement reactive queries over local IndexedDB storage, write records with zero network latency, queue outgoing changes in an offline sync queue, and sync with the backend when navigator.onLine triggers.",
    "socraticHints": [
      "Why is localStorage unsuitable for professional local-first applications?",
      "localStorage is synchronous (blocking the UI thread!), is limited to only 5MB of storage, and cannot store binary data or perform indexed queries! Local-first apps use IndexedDB or Origin Private File System (OPFS).",
      "IndexedDB is asynchronous, transactional, and supports gigabytes of data."
    ],
    "situationalPuzzle": {
      "scenario": "A field technician uses an inspection app on an iPad in an underground tunnel with zero internet connectivity. They fill out 20 equipment inspection forms and take photos. When they return to the surface, the app connects to 5G. How does local-first architecture ensure zero data loss without requiring the user to click 'Upload'?",
      "options": [
        "The technician must re-enter all data.",
        "Automatic Mutation Queue Draining & Background Sync: All forms and photo blobs were persisted immediately to local IndexedDB. An online event listener (window.addEventListener('online')) detects connectivity and automatically drains the persistent sync queue in the background with exponential backoff.",
        "The browser automatically uploads everything without code.",
        "Offline data cannot be synced to servers."
      ],
      "answerIdx": 1,
      "debrief": "Local-first applications store every mutation and binary asset in local IndexedDB first. An automated background sync manager monitors network status and drains the offline mutation queue automatically when connectivity returns, providing seamless offline usability."
    },
    "quests": [
      {
        "id": "fs-m2-d41-q1",
        "name": "Local-First 7 Ideals Architectural Framework",
        "type": "concept",
        "desc": "Analyze the Ink & Switch Local-First principles: offline availability, multi-device sync, longevity, and security."
      },
      {
        "id": "fs-m2-d41-q2",
        "name": "IndexedDB Transaction Performance Profiler",
        "type": "detective",
        "desc": "Profile read and write throughput of IndexedDB transactions across 10,000 records on low-end mobile devices."
      },
      {
        "id": "fs-m2-d41-q3",
        "name": "TypeScript Local-First IndexedDB Store",
        "type": "mastery",
        "desc": "Implement a full local-first reactive data store in TypeScript with IndexedDB persistence and offline sync queues."
      },
      {
        "id": "fs-m2-d41-q4",
        "name": "3 AM SRE: Offline Data Overwritten by Server Sync",
        "type": "incident",
        "desc": "Fix an incident where reconnecting to Wi-Fi caused the server to overwrite 8 hours of offline edits with older server data."
      }
    ]
  },
  {
    "day": 42,
    "month": 2,
    "blockNum": 9,
    "title": "Conflict-Free Replicated Data Types (CRDTs): State-Based vs Op-Based, LWW & OR-Sets",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Distributed Data Structures (CRDT Mathematics & Convergence)",
    "spokenGoal": "Solve multi-master replication without consensus locks: master Conflict-Free Replicated Data Types (CRDTs). Understand the mathematical properties of join-semilattices (Commutativity, Associativity, Idempotence). Compare State-based CRDTs (CvRDT: sending full states merged via join operator) with Operation-based CRDTs (CmRDT: sending commutative operations over causal channels). Implement PN-Counters, Last-Write-Wins Registers (LWW-Register), and Observed-Removed Sets (OR-Set).",
    "conceptInvariant": "Strong Eventual Consistency (SEC) Invariant: Replicas that have received the same set of updates must immediately possess mathematically identical state, regardless of the order in which updates were delivered over the network; no manual conflict resolution or coordinator consensus is required.",
    "failureMode": "Implementing collaborative sets using simple arrays without tombstone tracking, causing an element deleted on Client A to be resurrected when Client B's state merges back in.",
    "tryItFriction": "Implement an Observed-Removed Set (OR-Set) with Unique Tag Tokens in TypeScript: add elements with unique UUID tags (e.g., (item, tag)), remove elements by adding their tags to a tombstone set, and implement a commutative merge() function that guarantees deterministic convergence.",
    "socraticHints": [
      "Why does a simple set (Add/Remove) fail to converge in distributed systems?",
      "If Client A removes item X at the same time Client B adds item X, what is the final state? Without unique addition tags and tombstones, replicas disagree depending on which message arrived first!",
      "An OR-Set tracks unique tags per addition, ensuring that additions observed prior to a deletion stay deleted."
    ],
    "situationalPuzzle": {
      "scenario": "Two users collaborate offline on a shared shopping list. User A adds 'Apples' (tag: uuid-1). User B deletes 'Apples' (removing uuid-1). Concurrently, User A adds 'Apples' again (tag: uuid-2). When both devices connect to Wi-Fi and merge their OR-Sets, should 'Apples' be in the list or deleted?",
      "options": [
        "The app should show an error popup asking the user.",
        "Apples is PRESENT (Observed-Removed Set Semantics): User B only observed and removed uuid-1. User B never observed uuid-2! Therefore, uuid-2 survives the merge, correctly reflecting that User A intended to add Apples after or concurrently with the deletion.",
        "The list is deleted completely.",
        "Both items are converted to numbers."
      ],
      "answerIdx": 1,
      "debrief": "In an Observed-Removed Set (OR-Set), deletions only remove the specific addition tags observed by the deleting replica. A concurrent addition creates a new unique tag that was not in the deletion set, correctly preserving the newly added element."
    },
    "quests": [
      {
        "id": "fs-m2-d42-q1",
        "name": "Join-Semilattice Mathematical Proof",
        "type": "concept",
        "desc": "Prove mathematically that any data type with a binary join operator that is Associative, Commutative, and Idempotent guarantees SEC."
      },
      {
        "id": "fs-m2-d42-q2",
        "name": "CRDT Concurrent Divergence Simulator",
        "type": "detective",
        "desc": "Simulate 5 replicas partitioned across network splits applying concurrent mutations and verify identical merged states."
      },
      {
        "id": "fs-m2-d42-q3",
        "name": "TypeScript OR-Set & LWW-Register Library",
        "type": "mastery",
        "desc": "Implement a full CRDT library in TypeScript with PN-Counters, LWW-Registers, and OR-Sets with tombstone compaction."
      },
      {
        "id": "fs-m2-d42-q4",
        "name": "3 AM SRE: Tombstone Bloat Memory Leak in CRDT Cluster",
        "type": "incident",
        "desc": "Diagnose a production memory leak where accumulating deletion tombstones consumed 8GB of RAM on mobile devices."
      }
    ]
  },
  {
    "day": 43,
    "month": 2,
    "blockNum": 9,
    "title": "Yjs Deep Dive: Y.Doc Binary Encoding, Shared Types (Y.Map, Y.Array, Y.Text) & Awareness Protocol",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Production CRDTs (Yjs Architecture & Collaborative Editing)",
    "spokenGoal": "Implement industrial collaborative editing: deep dive into Yjs (the leading high-performance CRDT framework). Understand the Y.Doc internal data model (doubly-linked lists of Item structs), analyze compact binary encoding (lib0 / variable-length integers), and master Yjs Shared Types (Y.Map, Y.Array, Y.Text). Implement the Awareness Protocol for real-time cursor presence, user avatars, and selection states over WebSockets.",
    "conceptInvariant": "Yjs State Vector Compaction Invariant: Two Yjs replicas synchronize state with minimal bandwidth by exchanging State Vectors (compact maps of { clientID: clock }); the receiving replica computes a binary update containing ONLY the items missing from the sender's clock.",
    "failureMode": "Sending full document snapshots on every keystroke in a collaborative editor, generating 5MB of network traffic per second and causing browser tab crashes across all connected users.",
    "tryItFriction": "Build a Collaborative Text Editor Engine in TypeScript using Yjs: instantiate a Y.Doc, bind a Y.Text shared type, simulate concurrent insertions from two clients, compute binary update diffs via Y.encodeStateAsUpdate, apply updates, and broadcast cursor awareness states.",
    "socraticHints": [
      "Why is Yjs so much faster and smaller than other CRDT implementations like Automerge (prior to v2)?",
      "Yjs represents consecutive text characters as single struct chunks in a doubly-linked list and uses custom binary variable-length integer encoding (lib0)! It encodes updates in a few bytes rather than heavy JSON!",
      "A 100,000-character document update takes only a few kilobytes."
    ],
    "situationalPuzzle": {
      "scenario": "A collaborative document platform connects 50 users to the same document room. When User 1 types a sentence, how does Yjs broadcast the edit to the other 49 users without sending the entire document?",
      "options": [
        "It takes a screenshot of the editor and streams video.",
        "Binary Delta State Vector Update: Yjs listens to the ytext.observe event, extracts a tiny binary delta update (typically 12-40 bytes) containing the inserted characters, their clientID, clock offset, and left/right origin item pointers, and broadcasts ONLY this binary delta to all peers via WebSockets.",
        "The server refreshes the page for all 49 users.",
        "Yjs requires sending the entire document every time."
      ],
      "answerIdx": 1,
      "debrief": "Yjs is designed for extreme efficiency. Typing a character generates a binary delta of just a few bytes. Peers apply this delta directly into their local Y.Doc doubly-linked list structure, achieving real-time sub-10ms synchronization with negligible bandwidth."
    },
    "quests": [
      {
        "id": "fs-m2-d43-q1",
        "name": "Yjs Item Doubly-Linked List Architecture",
        "type": "concept",
        "desc": "Diagram how Yjs resolves concurrent character insertions at the same index using client IDs and origin pointers."
      },
      {
        "id": "fs-m2-d43-q2",
        "name": "Awareness Protocol Heartbeat & GC Tracer",
        "type": "detective",
        "desc": "Trace how cursor presence awareness states automatically time out and prune dead user cursors after 30 seconds."
      },
      {
        "id": "fs-m2-d43-q3",
        "name": "TypeScript Collaborative Rich-Text Suite",
        "type": "mastery",
        "desc": "Implement a full collaborative document suite in TypeScript uniting Y.Doc, Y.Text, WebSocket sync, and awareness."
      },
      {
        "id": "fs-m2-d43-q4",
        "name": "3 AM SRE: State Vector Desync in Collaborative Document",
        "type": "incident",
        "desc": "Fix an incident where a dropped WebSocket frame caused a client to stop receiving updates until room reconnection."
      }
    ]
  },
  {
    "day": 44,
    "month": 2,
    "blockNum": 9,
    "title": "WebRTC Data Channels: Peer-to-Peer Mesh Synchronization, STUN/TURN & Signaling",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Peer-to-Peer Networking (WebRTC DataChannels & NAT Traversal)",
    "spokenGoal": "Bypass centralized servers completely: master WebRTC DataChannels for peer-to-peer (P2P) synchronization. Understand NAT Traversal physics: STUN (Session Traversal Utilities for NAT) to discover public IP/ports, and TURN (Traversal Using Relays around NAT) relays for symmetric NAT firewalls. Implement the SDP (Session Description Protocol) offer/answer signaling exchange over WebSockets, and build P2P mesh synchronization for collaborative apps.",
    "conceptInvariant": "NAT Traversal & Fallback Invariant: Peer-to-peer connections succeed over STUN for ~85% of global internet connections; for the remaining ~15% behind restrictive enterprise symmetric NATs, connections must automatically fall back to authenticated TURN relay servers.",
    "failureMode": "Deploying a P2P application with only public STUN servers and zero TURN relay servers, causing connections to fail permanently for 15% of users on corporate office networks or mobile cellular carriers.",
    "tryItFriction": "Build a WebRTC DataChannel Signaling & Sync Engine in TypeScript: implement a WebSocket signaling server that exchanges SDP offers, answers, and ICE candidates between two simulated peers, establish a direct RTCDataChannel, and exchange binary CRDT updates with 0 server relay hops.",
    "socraticHints": [
      "Why do you still need a centralized server if WebRTC is peer-to-peer?",
      "Peers cannot find each other on the internet without a signaling server to introduce them (exchanging SDP offers and IP candidates)! Once the connection is established, the signaling server is no longer needed!",
      "Data flows directly peer-to-peer over UDP."
    ],
    "situationalPuzzle": {
      "scenario": "Two colleagues on a corporate Wi-Fi network attempt to connect via a WebRTC P2P drawing app. The connection fails with ICE Connection State: 'failed'. Diagnostics show STUN returned public IP addresses, but the corporate firewall blocks direct UDP hole punching between internal IP subnets. What architectural fix restores connectivity?",
      "options": [
        "Tell the company to disable its firewall.",
        "Deploy Authenticated TURN Relay Servers (coturn): When direct STUN P2P hole punching fails due to symmetric NAT or firewall policies, ICE automatically falls back to an authenticated TURN relay server (using credentials generated via HMAC-SHA1), relaying encrypted traffic over TLS port 443.",
        "Switch to HTTP GET polling.",
        "WebRTC cannot work on corporate networks."
      ],
      "answerIdx": 1,
      "debrief": "Direct P2P connections cannot traverse strict symmetric NATs or restrictive enterprise corporate firewalls. Production WebRTC systems mandate TURN servers (like coturn). If direct P2P fails, traffic routes securely through the TURN relay, guaranteeing 100% connection success."
    },
    "quests": [
      {
        "id": "fs-m2-d44-q1",
        "name": "NAT Traversal & ICE Protocol State Machine",
        "type": "concept",
        "desc": "Diagram the complete ICE candidate gathering process across host, srflx (STUN), and relay (TURN) candidates."
      },
      {
        "id": "fs-m2-d44-q2",
        "name": "Symmetric NAT Failure Mode Simulator",
        "type": "detective",
        "desc": "Simulate symmetric NAT port mapping behavior to demonstrate why STUN hole punching fails without TURN relays."
      },
      {
        "id": "fs-m2-d44-q3",
        "name": "TypeScript WebRTC Signaling & P2P DataChannel",
        "type": "mastery",
        "desc": "Implement a complete WebRTC DataChannel signaling client and server in TypeScript with ICE candidate negotiation."
      },
      {
        "id": "fs-m2-d44-q4",
        "name": "3 AM SRE: Corporate Firewall Blocking 10,000 Enterprise P2P Users",
        "type": "incident",
        "desc": "Mitigate a major enterprise customer outage by provisioning auto-scaling TURN relay clusters behind TLS port 443."
      }
    ]
  },
  {
    "day": 45,
    "month": 2,
    "blockNum": 9,
    "title": "Milestone 8: Local-First Offline-Ready CRDT Sync Engine",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Architectural Synthesis (Milestone Gate 8)",
    "spokenGoal": "Synthesize local-first architectures: engineer a production-grade Local-First Offline-Ready CRDT Sync Engine in TypeScript. Unify IndexedDB local persistence (y-indexeddb), real-time WebSocket synchronization (y-websocket), peer presence and cursor tracking via the Awareness protocol, automatic offline mutation queueing, and conflict-free convergence across concurrent offline edits.",
    "conceptInvariant": "Local-First Convergence Invariant: A user must be able to perform unlimited edits while completely offline with instant 0ms response times; upon reconnecting to the network, all offline edits must merge seamlessly with concurrent edits from other peers without data loss or modal conflict dialogs.",
    "failureMode": "Failing to persist local Yjs state vectors to IndexedDB before browser tab close, causing offline edits to vanish when the user closes their laptop before reconnecting to Wi-Fi.",
    "tryItFriction": "Execute the Milestone 8 benchmark: instantiate 3 simulated clients with IndexedDB storage, disconnect Client 1 from Wi-Fi, make 50 edits offline on Client 1 while Clients 2 and 3 make 50 concurrent edits online, reconnect Client 1, and assert that all 3 clients converge on mathematically identical Y.Doc states in < 50ms.",
    "socraticHints": [
      "How do you ensure that IndexedDB saves every keystroke without freezing the browser?",
      "y-indexeddb debounces disk writes and writes compact binary updates in background IndexedDB transactions! It loads the document instantly from local disk on page load before any network connection is even attempted!",
      "This guarantees instant 0ms startup times."
    ],
    "situationalPuzzle": {
      "scenario": "During the Milestone 8 defense, an architect asks: 'In your local-first collaborative editor, if a user writes a 100-page document with 50,000 edits over 6 months, does the Yjs document accumulate 50,000 individual historical item structs in IndexedDB forever? How do you prevent document bloat?' What is the architectural solution?",
      "options": [
        "Delete the document every 30 days.",
        "Document Compaction & Snapshot Garbage Collection: When all peers are synchronized or on server-side persistence, call Y.encodeStateAsUpdate() to compress the entire document into a single flattened binary snapshot. This merges consecutive deleted items and collapses historical edits into clean baseline structs, slashing document size by 85%.",
        "Disable offline editing for long documents.",
        "Yjs documents never exceed 10KB."
      ],
      "answerIdx": 1,
      "debrief": "As CRDT documents are edited, they accumulate tombstones and structural metadata. Periodic document compaction (via Y.encodeStateAsUpdate) collapses the history of consecutive edits and purges obsolete tombstones, maintaining high performance and tiny file sizes."
    },
    "quests": [
      {
        "id": "fs-m2-d45-q1",
        "name": "Milestone 8 System Architecture Blueprint",
        "type": "concept",
        "desc": "Document the complete local-first data architecture: IndexedDB storage, WebSocket signaling, and CRDT merge mathematics."
      },
      {
        "id": "fs-m2-d45-q2",
        "name": "Offline Network Partition Stress Suite",
        "type": "detective",
        "desc": "Subject 5 collaborative clients to random network drops and concurrent edits to verify zero data loss."
      },
      {
        "id": "fs-m2-d45-q3",
        "name": "Milestone 8 Core Implementation",
        "type": "mastery",
        "desc": "Deliver the complete TypeScript Local-First Offline-Ready CRDT Sync Engine with Yjs, IndexedDB, and WebSockets."
      },
      {
        "id": "fs-m2-d45-q4",
        "name": "Milestone 8 Viva Defense Gate",
        "type": "incident",
        "desc": "Defend the offline persistence guarantees, binary wire efficiency, and CRDT convergence before the Senior Systems Board."
      }
    ]
  }
]
