// scripts/visuals/dsa-masterclass-spec.ts
// Exhaustive 60-Day Masterclass Specification for Data Structures & Algorithmic Optimizations (course-dsa-optim)
// Total Quests: 240 Quests (Month 1: 120 Quests, Month 2: 120 Quests)
// Conforming strictly to Gate v2 semantic standard, 3-Tier Socratic Hint Ladders, Cache-Conscious Systems, and Big Tech FAANG/Staff rubrics.

import { MasterclassDaySpec } from './java-masterclass-spec';

export const DSA_MONTH_1_SPECS: MasterclassDaySpec[] = [
  // ─── BLOCK 1: Computational Complexity, Arrays & Linked Lists (Days 1–5) ────────────────
  {
    day: 1,
    month: 1,
    blockNum: 1,
    title: "Computational Complexity: Big-O, Big-Omega, Big-Theta, Amortized Analysis & The Potential Method",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Asymptotic Complexity & Amortized Cost)",
    spokenGoal: "Deconstruct the mathematical foundations of algorithmic efficiency: move beyond naive loop counting to master Big-O (upper bound), Big-Omega (lower bound), and Big-Theta (tight bound), and calculate amortized time complexity using the Aggregate and Potential Accounting methods.",
    conceptInvariant: "Asymptotic Dominance Invariant: Big-O characterizes the limiting behavior of a function as input size $N \\to \\infty$. Lower-order terms ($3N$, $100$) and constant coefficients are dominated by the highest-order term ($N^2$), but in practical low-latency systems, constant factors ($c \\cdot N$) dictate real-world cache line performance.",
    failureMode: "Assuming an algorithm that runs in $O(1)$ amortized time has a guaranteed sub-millisecond worst-case latency, causing high-frequency trading engines to suffer a 50ms stop-the-world freeze when dynamic array reallocation triggers at market open.",
    tryItFriction: "Perform amortized analysis on a custom resizable array using the banker's coin accounting method, proving why doubling capacity yields $O(1)$ amortized appends while incrementing capacity by 10 yields $O(N)$ appends.",
    socraticHints: [
      "Why is growing an array by a fixed +10 elements catastrophic for large datasets?",
      "Because inserting $N$ elements requires $N/10$ reallocations, copying $(10 + 20 + 30 + ... + N)$ items, which sums to $O(N^2)$ total work!",
      "Multiply capacity geometrically (e.g. $\\times 2$) so copies form a converging geometric series $\\sum N/2^k \\le 2N$, yielding $O(1)$ amortized cost."
    ],
    situationalPuzzle: {
      scenario: "An engineer builds a log ingestion buffer using an array that starts at capacity 10 and increases by 50 elements whenever full. At 1,000,000 ingested logs, the buffer becomes unusably slow, taking several minutes to complete ingestion. What mathematical complexity trap did the engineer fall into?",
      options: [
        "The computer ran out of hard disk space.",
        "Arithmetic Expansion Trap: Resizing by a constant additive delta (+50) causes the total copy operations to scale quadratically as $O(N^2)$. Geometric expansion ($\\times 2$) is required to achieve $O(1)$ amortized insertion time.",
        "JavaScript arrays do not support more than 10,000 items.",
        "The CPU branch predictor failed."
      ],
      answerIdx: 1,
      debrief: "Additive resizing ($+C$) requires copying $\\sum_{k=1}^{N/C} kC = O(N^2)$ elements. Only geometric multiplication ($\\times 2$) guarantees that total copies over $N$ insertions never exceed $2N$, achieving $O(1)$ amortized time."
    },
    quests: [
      { id: "dsa-m1-d01-q1", name: "Asymptotic Complexity Bounds: O vs Omega vs Theta Matrix", type: "concept", desc: "Map formal definitions of asymptotic upper, lower, and tight bounds across common algorithmic functions." },
      { id: "dsa-m1-d01-q2", name: "Detective Lab: Profiling the Additive vs Geometric Resizing Spike", type: "detective", desc: "Profile memory allocation and time complexity between additive array growth (+100) and geometric growth (*2) up to 1M items." },
      { id: "dsa-m1-d01-q3", name: "Mastery Assignment: Potential Method Amortized Complexity Verifier", type: "assignment", desc: "Implement a TypeScript simulation tracking credit/debit tokens across 50,000 array push operations verifying amortized O(1)." },
      { id: "dsa-m1-d01-q4", name: "Production Incident Lab: Trading Feed P99 Latency Spike on Vector Reallocation", type: "detective", desc: "Triage a live trading incident where an unexpected vector capacity doubling caused a 42ms freeze during market opening volatility." }
    ]
  },
  {
    day: 2,
    month: 1,
    blockNum: 1,
    title: "Dynamic Arrays: Geometric Resizing Factor (x2 vs x1.5), Capacity Doubling Math & Memory Fragmentation",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Contiguous Memory Runtimes & Growth Factors)",
    spokenGoal: "Engineer production-grade dynamic arrays: master contiguous memory layout, compare growth factors ($2.0$ vs $1.5$ in C++ `std::vector` and folly `fbvector`), and understand how memory allocators (jemalloc) reuse deallocated memory pages.",
    conceptInvariant: "Memory Reuse Invariant: A growth factor of $2.0$ guarantees that newly allocated buffer space ($2^k$) is strictly greater than the sum of all previously deallocated buffers ($\\sum_{i=0}^{k-1} 2^i = 2^k - 1$). A growth factor $g < \\frac{1 + \\sqrt{5}}{2} \\approx 1.618$ (such as $1.5$) allows the memory allocator to reuse previously freed memory blocks.",
    failureMode: "Using a growth factor of 2.0 in a long-running high-memory service, causing the heap allocator to never reuse previously freed chunks, resulting in severe virtual memory fragmentation and early Out-Of-Memory termination.",
    tryItFriction: "Build a custom `DynamicArray<T>` class from scratch in TypeScript/C++ that implements capacity growth by 1.5x, memory trimming, and fast contiguous buffer copying.",
    socraticHints: [
      "Why did Facebook's `fbvector` choose a growth factor of 1.5 instead of 2.0?",
      "Because when an array grows from 100 to 200, the freed 100-byte block cannot fit the new 200-byte block!",
      "With a factor of 1.5, previous deallocated memory blocks accumulate to become larger than the next requested block, allowing allocator reuse."
    ],
    situationalPuzzle: {
      scenario: "A low-latency database buffer pool uses dynamic arrays. The lead systems engineer notices that under high allocation churn, memory fragmentation reaches 65%, even though active data only occupies 2 GB of RAM. The array implementation uses a 2.0x growth factor. Why does switching the growth factor to 1.5x eliminate memory fragmentation?",
      options: [
        "1.5 is a smaller number, so it uses less CPU.",
        "With growth factor $g < 1.618$, the sum of previously freed buffer sizes eventually exceeds the size of the next requested buffer, enabling jemalloc / glibc to reuse freed contiguous memory addresses rather than requesting new pages from the kernel.",
        "The operating system disables paging for factor 1.5.",
        "1.5 avoids floating point arithmetic."
      ],
      answerIdx: 1,
      debrief: "When $g = 2.0$, $2^k > \\sum_{i=0}^{k-1} 2^i$. The allocator can never reuse the cumulative space of previous allocations for the next buffer. A factor like 1.5 allows memory consolidation and reuse, eliminating fragmentation."
    },
    quests: [
      { id: "dsa-m1-d02-q1", name: "Dynamic Array Contiguous Memory & Allocator Page Allocation", type: "concept", desc: "Analyze heap allocation boundaries, OS virtual memory pages, and cache line prefetching in contiguous memory arrays." },
      { id: "dsa-m1-d02-q2", name: "Detective Lab: Memory Fragmentation Profiling in 2.0x Growth Buffers", type: "detective", desc: "Simulate 500,000 array allocations, measure heap fragmentation between growth factors 2.0 and 1.5, and chart memory efficiency." },
      { id: "dsa-m1-d02-q3", name: "Mastery Assignment: Production-Grade DynamicArray<T> with 1.5x Resizing", type: "assignment", desc: "Implement `DynamicArray<T>` with bounds checking, capacity growth, in-place element removal, and shrink-to-fit compaction." },
      { id: "dsa-m1-d02-q4", name: "Production Incident Lab: Buffer OOM Crash Due to Inefficient Pre-Allocation", type: "detective", desc: "Resolve a production crash where repeatedly pushing into un-sized arrays caused 18 reallocations during an API request surge." }
    ]
  },
  {
    day: 3,
    month: 1,
    blockNum: 1,
    title: "Singly & Doubly Linked Lists: Pointer Invariants, Sentinel Dummy Nodes & In-Place Reversals",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Pointer Topologies & Sentinel Node Invariants)",
    spokenGoal: "Master pointer manipulation and node-based linked structures: implement singly and doubly linked lists, eliminate NULL pointer exceptions using sentinel dummy nodes, and execute $O(N)$ time, $O(1)$ space in-place reversals.",
    conceptInvariant: "Sentinel Node Invariant: Initializing a list with static dummy head and tail sentinel nodes eliminates all edge cases for empty lists, head insertions, and tail deletions. Pointer updates become uniform without needing branching `if (head == null)` checks.",
    failureMode: "Updating a node's pointer without saving its next reference (`curr.next = prev` before `next = curr.next`), severing the remaining linked chain in memory and leaking the rest of the list.",
    tryItFriction: "Reverse a singly linked list in-place using the 3-pointer technique (`prev`, `curr`, `next`) in strict $O(N)$ time and $O(1)$ memory without allocating any new nodes.",
    socraticHints: [
      "What order of pointer assignments guarantees you never lose the rest of the linked list during reversal?",
      "Save `next = curr.next` first! Then flip `curr.next = prev`, shift `prev = curr`, and finally advance `curr = next`.",
      "Repeat until `curr` becomes null; `prev` is your new head node."
    ],
    situationalPuzzle: {
      scenario: "A junior developer writes a function to delete a node from a singly linked list. When testing deletion of the head node, the code throws `NullPointerException` because it attempted to access `prev.next` when `prev` was null. How does a Staff Systems Engineer permanently eliminate head-node special-casing?",
      options: [
        "Wrap the entire function in a try/catch block.",
        "Introduce a Sentinel Dummy Node whose `next` pointer points to the true `head`. The dummy node guarantees that every legitimate node (including the head) always has a valid preceding `prev` node.",
        "Prevent users from deleting the head node.",
        "Convert the list into an array."
      ],
      answerIdx: 1,
      debrief: "Sentinel dummy nodes eliminate conditional branching for boundary elements. Because every valid node has a preceding node (at least the sentinel), deletion and insertion algorithms operate uniformly with zero null-pointer edge cases."
    },
    quests: [
      { id: "dsa-m1-d03-q1", name: "Pointer Graph Topology: Singly vs Doubly vs Circular Lists", type: "concept", desc: "Diagram pointer references, memory overhead (node pointers vs array indices), and garbage collection challenges in linked lists." },
      { id: "dsa-m1-d03-q2", name: "Detective Lab: The Severed Pointer Chain Memory Leak", type: "detective", desc: "Fix 4 buggy linked list functions where improper pointer reassignments caused list truncation and infinite loops." },
      { id: "dsa-m1-d03-q3", name: "Mastery Assignment: Doubly Linked List with Sentinel Boundaries", type: "assignment", desc: "Build a complete `DoublyLinkedList<T>` with sentinel head/tail nodes, supporting $O(1)$ head/tail pushes and $O(1)$ node removals." },
      { id: "dsa-m1-d03-q4", name: "Production Incident Lab: Cyclic Linked List Crashing JSON Serializer", type: "detective", desc: "Triage a production bug where a circular pointer reference in a domain model caused a recursive JSON serializer to crash with stack overflow." }
    ]
  },
  {
    day: 4,
    month: 1,
    blockNum: 1,
    title: "Fast/Slow Pointer Mechanics: Floyd's Tortoise and Hare Cycle Finding & Midpoint Invariants",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Two-Speed Pointer Mathematics)",
    spokenGoal: "Master two-pointer pointer kinematics: implement Floyd's Cycle-Finding Algorithm (Tortoise and Hare), mathematically prove cycle detection in $O(N)$ time and $O(1)$ space, locate the exact cycle entry node, and find list midpoints in a single pass.",
    conceptInvariant: "Cycle Catch-Up Invariant: In a cycle of length $C$, with the slow pointer advancing by 1 step and the fast pointer by 2 steps, the distance between them increases by 1 step per iteration. Therefore, the fast pointer is guaranteed to catch the slow pointer in at most $C$ steps without an infinite loop.",
    failureMode: "Using a hash set to track visited node references to detect cycles in a 10,000,000-node graph, consuming 160 MB of auxiliary RAM and triggering GC pauses when Floyd's algorithm solves it in $O(1)$ memory.",
    tryItFriction: "Implement Floyd's algorithm to find the exact entry node of a linked list cycle: after slow and fast collide, reset slow to head and advance both by 1 step until they meet at the cycle origin.",
    socraticHints: [
      "Why does resetting one pointer to `head` and advancing both at 1 step/tick find the exact cycle start?",
      "Let distance to cycle start be $D$, cycle entry to collision be $K$, and cycle length be $C$. Fast traveled $2 \\times$ slow's distance: $2(D+K) = D + nC + K$!",
      "Simplifying yields $D = nC - K$. Moving $D$ steps from head and $D$ steps from collision point lands both pointers at the exact cycle entrance!"
    ],
    situationalPuzzle: {
      scenario: "In an operating system process scheduler, thread task descriptors are linked in a queue. A corrupted task accidentally links its `next` pointer back to an ancestor, creating an infinite scheduling loop. The diagnostic monitor needs to detect this cycle and report the offending node ID with zero auxiliary heap allocations. What algorithm must be deployed?",
      options: [
        "Recursion with a global counter.",
        "Floyd's Tortoise and Hare Cycle-Finding Algorithm: Run slow (1 step) and fast (2 steps) pointers. If `fast == slow`, a cycle exists. Reset `slow = head` and advance both at 1 step to identify the exact entry node in $O(N)$ time and $O(1)$ memory.",
        "Dijkstra's shortest path algorithm.",
        "Store all pointers in a database table."
      ],
      answerIdx: 1,
      debrief: "Floyd's algorithm provides a rigorous, zero-allocation cycle detection mechanism. It mathematically guarantees detection within $O(N)$ steps and identifies the cycle origin using pure pointer geometry."
    },
    quests: [
      { id: "dsa-m1-d04-q1", name: "Mathematical Proof of Floyd's Cycle Detection Algorithm", type: "concept", desc: "Write out the formal algebraic proof for cycle collision and entry point convergence ($D = nC - K$)." },
      { id: "dsa-m1-d04-q2", name: "Detective Lab: Locating the Hidden Memory Leak in a Cyclic Node Graph", type: "detective", desc: "Identify a cycle in a 100,000-node object graph without modifying node structures or allocating sets." },
      { id: "dsa-m1-d04-q3", name: "Mastery Assignment: Fast/Slow Pointer Utilities Suite", type: "assignment", desc: "Implement functions for list cycle detection, cycle origin retrieval, list middle finding, and palindrome verification via fast/slow pointers." },
      { id: "dsa-m1-d04-q4", name: "Production Incident Lab: Fast Pointer Null-Deref Panic on Odd-Length Lists", type: "detective", desc: "Fix an edge-case crash where checking `fast.next.next` without checking `fast.next != null` caused an unhandled panic on odd-length lists." }
    ]
  },
  {
    day: 5,
    month: 1,
    blockNum: 1,
    title: "Memory Locality vs Pointer Chasing: CPU L1/L2/L3 Cache Lines, Prefetching & Milestone 1: Cache-Conscious Array Engine",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Hardware Architecture & Milestone 1 Gate)",
    spokenGoal: "Bridge algorithms with hardware physics: benchmark contiguous arrays vs linked lists on modern CPUs, understand 64-byte CPU cache lines, eliminate L1/L2 cache misses, and deliver Milestone 1 by engineering a cache-conscious contiguous array engine.",
    conceptInvariant: "Hardware Locality Invariant: Modern CPUs do not read single bytes from RAM; they fetch 64-byte cache lines. Traversing a contiguous array exploits sequential prefetching with ~1ns L1 access. Traversing a linked list causes pointer chasing across fragmented heap addresses with ~100ns main memory stall penalties.",
    failureMode: "Choosing a linked list for an in-memory queue because 'insertions are $O(1)$', only to find it runs 20x slower than a dynamic array due to a 95% CPU L1 cache miss rate.",
    tryItFriction: "Write a benchmark comparing iteration through 10,000,000 integers in a contiguous array vs a linked list, measuring CPU cache miss penalties and nanoseconds per element.",
    socraticHints: [
      "Why is iterating an array 10x-50x faster than iterating a linked list of the same size?",
      "Because when the CPU loads `arr[0]`, the hardware prefetcher automatically loads `arr[1]` through `arr[15]` into the 64-byte L1 cache line!",
      "A linked list scatters nodes randomly in heap memory, causing the CPU pipeline to stall waiting for RAM on almost every single step."
    ],
    situationalPuzzle: {
      scenario: "A financial risk engine evaluates 5,000,000 trade records every second. A developer refactors the internal trade storage from a flat contiguous array to a doubly linked list to make insertions $O(1)$. In production, throughput plummets from 8,000,000 ops/sec to 400,000 ops/sec, and CPU usage hits 100%. Hardware counters reveal L3 cache miss rate jumped from 2% to 48%. What happened?",
      options: [
        "The CPU fan failed.",
        "Pointer Chasing Cache Penalty: The linked list scattered 5,000,000 node structs randomly across the heap. Each pointer traversal incurred a ~100ns main memory latency stall, destroying CPU pipelining and hardware prefetcher efficiency.",
        "The linked list had too many items.",
        "The array was faster because of compiler optimizations only."
      ],
      answerIdx: 1,
      debrief: "Theoretical Big-O assumes all memory accesses cost $O(1)$ time. In reality, an L1 cache hit costs ~1ns while a main RAM fetch costs ~100ns. Contiguous arrays leverage hardware prefetching, outperforming pointer-based lists by orders of magnitude."
    },
    quests: [
      { id: "dsa-m1-d05-q1", name: "CPU Cache Hierarchy & Memory Latency Numbers Every Engineer Should Know", type: "concept", desc: "Analyze the latency numbers: L1 (~1ns), L2 (~4ns), L3 (~10ns), Main Memory (~100ns), and 64-byte cache lines." },
      { id: "dsa-m1-d05-q2", name: "Detective Lab: Profiling Cache Miss Rates with Linux Perf / Instruments", type: "detective", desc: "Profile array traversal vs linked list traversal, analyze `perf stat` cache-miss counters, and identify bottleneck causes." },
      { id: "dsa-m1-d05-q3", name: "Mastery Assignment: Cache-Conscious Flat Vector Engine", type: "assignment", desc: "Build a high-performance contiguous array wrapper optimized for cache-line alignment and vector processing." },
      { id: "dsa-m1-d05-q4", name: "Milestone 1 Gate: High-Throughput Contiguous Array & Pointer Engine", type: "assignment", desc: "Deliver Milestone 1: A validated contiguous array engine outperforming linked structures by 15x under streaming benchmarks." }
    ]
  },

  // ─── BLOCK 2: Stacks, Queues & Monotonic Structures (Days 6–10) ───────────────────────────
  {
    day: 6,
    month: 1,
    blockNum: 2,
    title: "Stacks (LIFO): Call Stack Simulation, Bracket Parsers & Arithmetic Expression Evaluation (Shunting Yard)",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (LIFO Mechanics & Syntax Parsing)",
    spokenGoal: "Master Last-In First-Out (LIFO) stacks: understand the relationship between software stacks and hardware call stacks, build industrial-strength bracket matching parsers, and implement Dijkstra's Shunting Yard algorithm for arithmetic expression parsing.",
    conceptInvariant: "Matching LIFO Invariant: In any syntactically valid nested grammar, the most recently opened delimiter must be the first delimiter closed. Storing opening tokens on a LIFO stack guarantees that closing tokens match their immediate enclosing scope.",
    failureMode: "Attempting to validate nested parentheses by counting opening and closing brackets (`count++` / `count--`), failing catastrophically on mixed bracket sequences like `'([)]'` which has equal counts but invalid nesting.",
    tryItFriction: "Implement Dijkstra's Shunting Yard algorithm that converts an infix arithmetic expression (`'3 + 4 * 2 / ( 1 - 5 ) ^ 2'`) into Reverse Polish Notation (RPN) and evaluates it using a stack.",
    socraticHints: [
      "Why does a simple counter fail to validate `'([)]'`?",
      "Because a counter only tracks quantity, not nesting order!",
      "A stack tracks the exact type of opening bracket and verifies that the top element matches the incoming closing bracket."
    ],
    situationalPuzzle: {
      scenario: "A SQL query parser crashes when evaluating mathematical expressions inside `WHERE` clauses. The existing code uses a regex-based replacement that mis-evaluates operator precedence (`2 + 3 * 4` evaluates as `(2 + 3) * 4 = 20` instead of `2 + (3 * 4) = 14`). How must the parser evaluate nested expressions correctly?",
      options: [
        "Add parentheses around every number.",
        "Implement Dijkstra's Shunting Yard algorithm using an operator stack and an output queue. Compare incoming operator precedence against the stack top to preserve multiplication/division precedence before addition.",
        "Evaluate operations strictly from right to left.",
        "Use JavaScript `eval()`."
      ],
      answerIdx: 1,
      debrief: "Dijkstra's Shunting Yard algorithm uses an operator stack to resolve mathematical operator precedence and associativity, converting infix expressions into Reverse Polish Notation (RPN) for deterministic linear evaluation."
    },
    quests: [
      { id: "dsa-m1-d06-q1", name: "Stack Architecture: Call Stacks, Activation Records & LIFO Mechanics", type: "concept", desc: "Analyze stack frame layout, return addresses, local variables, and stack overflow conditions." },
      { id: "dsa-m1-d06-q2", name: "Detective Lab: The Escaped SQL Injection in a Flawed Bracket Parser", type: "detective", desc: "Audit a buggy SQL sanitization parser that failed to detect unmatched brackets in `'SELECT * FROM (users WHERE id=1))'`, and patch it." },
      { id: "dsa-m1-d06-q3", name: "Mastery Assignment: Shunting Yard Arithmetic Expression Calculator", type: "assignment", desc: "Build an expression evaluator in TypeScript supporting `+`, `-`, `*`, `/`, `^`, parentheses, and multi-digit numbers via stacks." },
      { id: "dsa-m1-d06-q4", name: "Production Incident Lab: Stack Overflow on Deeply Nested JSON Input", type: "detective", desc: "Resolve a production vulnerability where an adversary crashed an API server by sending a payload with 50,000 nested brackets." }
    ]
  },
  {
    day: 7,
    month: 1,
    blockNum: 2,
    title: "Monotonic Stacks: Next Greater Element, Daily Temperatures & Largest Rectangle in Histogram (O(N) Amortized)",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Monotonic Stack Dynamics & Amortized Proofs)",
    spokenGoal: "Master one of the most powerful algorithmic patterns: Monotonic Stacks. Reduce $O(N^2)$ brute-force comparisons to strictly linear $O(N)$ amortized time, solve Next Greater Element and Daily Temperatures, and conquer the classic Largest Rectangle in Histogram problem.",
    conceptInvariant: "Monotonic Invariant: A stack maintains elements in strictly monotonically increasing (or decreasing) order. When a new element violates the monotonicity invariant, stack elements are popped and processed until the invariant is restored. Because each element is pushed once and popped at most once, total runtime across $N$ elements is strictly $O(N)$.",
    failureMode: "Using nested loops to search forward for the next greater element for every index in an array of 500,000 stock prices, resulting in $(500,000)^2 / 2 \\approx 1.25 \\times 10^{11}$ operations and freezing the server for 45 minutes.",
    tryItFriction: "Solve the Largest Rectangle in Histogram problem in $O(N)$ time by maintaining a monotonic increasing stack of bar heights and calculating rectangle areas upon popping smaller heights.",
    socraticHints: [
      "Why is the monotonic stack guaranteed to run in $O(N)$ time even with a `while` loop inside a `for` loop?",
      "Because an element can only be popped from the stack if it was previously pushed!",
      "Across the entire algorithm, there are at most $N$ pushes and at most $N$ pops. $N + N = 2N = O(N)$ amortized operations."
    ],
    situationalPuzzle: {
      scenario: "A weather monitoring system calculates for each day how many days you would have to wait until a warmer temperature occurs. An intern writes a nested loop solution (`for i ... for j = i+1 ...`). When historical data with 200,000 days of temperatures is processed in winter (monotonically decreasing temperatures), the script times out. How does a Senior Algorithmist fix this?",
      options: [
        "Filter out winter days.",
        "Deploy a Monotonic Decreasing Stack storing indices. When a warmer day is encountered, pop all colder days from the stack, calculating their day difference in a single $O(N)$ linear pass.",
        "Use multi-threading to speed up the $O(N^2)$ loops.",
        "Sort the temperatures array first."
      ],
      answerIdx: 1,
      debrief: "A monotonic decreasing stack keeps track of days awaiting a warmer temperature. When a warmer temperature appears, it resolves all pending smaller temperatures in $O(1)$ amortized time per element, achieving optimal $O(N)$ total complexity."
    },
    quests: [
      { id: "dsa-m1-d07-q1", name: "Monotonic Stack Patterns & Amortized Linear Complexity Proof", type: "concept", desc: "Formalize the four monotonic stack archetypes: next greater right/left, and next smaller right/left." },
      { id: "dsa-m1-d07-q2", name: "Detective Lab: Optimizing an O(N^2) Stock Price Peak Detector", type: "detective", desc: "Profile a slow financial indicator calculation, identify the $O(N^2)$ forward-scan bottleneck, and rewrite it with a monotonic stack." },
      { id: "dsa-m1-d07-q3", name: "Mastery Assignment: Largest Rectangle in Histogram & Maximal Rectangle Engine", type: "assignment", desc: "Implement the $O(N)$ histogram solver and extend it to find the maximal rectangle of 1s in a 2D binary matrix." },
      { id: "dsa-m1-d07-q4", name: "Production Incident Lab: Monotonic Stack Index Out-of-Bounds on Flat Landscapes", type: "detective", desc: "Fix an edge-case bug where an array with all identical heights caused an empty stack underflow during area calculation." }
    ]
  },
  {
    day: 8,
    month: 1,
    blockNum: 2,
    title: "Queues (FIFO): Array-Based Circular Ring Buffers, Modulo Arithmetic & Buffer Wrap Invariants",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Ring Buffers & Modular Indexing)",
    spokenGoal: "Engineer lock-free and bounded queues: understand First-In First-Out (FIFO) mechanics, design fixed-capacity Circular Ring Buffers using modulo indexing, and eliminate memory reallocations in high-throughput network and audio streams.",
    conceptInvariant: "Modulo Wrapping Invariant: In a fixed buffer of capacity $K$, pointers advance via $index = (index + 1) \\pmod K$. Full vs Empty disambiguation requires either tracking an explicit `size` counter or reserving one sentinel slot ($head == (tail + 1) \\pmod K$).",
    failureMode: "Implementing a queue in JavaScript using `array.shift()`. Each `shift()` operation copies all remaining $N-1$ elements in memory, turning an $O(1)$ queue operation into an $O(N)$ copy penalty and crippling throughput.",
    tryItFriction: "Build a `CircularQueue` class from scratch using a fixed-size typed array, maintaining `head`, `tail`, and `size` variables to guarantee $O(1)$ `enqueue()` and `dequeue()` without memory allocations.",
    socraticHints: [
      "Why is `array.shift()` disastrous for queue performance in JavaScript/Python?",
      "Because removing the first element requires moving every single other element one position to the left in memory!",
      "A circular buffer keeps the elements in place and simply advances the `head` pointer forward."
    ],
    situationalPuzzle: {
      scenario: "An IoT telemetry gateway receives 100,000 sensor readings per second. The developer queues incoming readings using `queue.push(item)` and processes them with `queue.shift()`. Under peak load, CPU usage spikes to 100%, and incoming packets are dropped. Profiling reveals 92% of CPU time is spent inside `Array.prototype.shift`. How does the systems team fix this?",
      options: [
        "Drop half of the sensor readings.",
        "Replace the standard array with a fixed-size Circular Ring Buffer with pre-allocated memory. Enqueue and dequeue advance head and tail pointers using modulo arithmetic in $O(1)$ time with zero element copying.",
        "Upgrade the server to 128 cores.",
        "Serialize the queue to Redis."
      ],
      answerIdx: 1,
      debrief: "`Array.shift()` has $O(N)$ time complexity because it shifts all remaining elements in memory. A Circular Ring Buffer achieves strict $O(1)$ operations with zero memory allocations by moving pointer indices with modulo arithmetic."
    },
    quests: [
      { id: "dsa-m1-d08-q1", name: "Circular Buffer Topology: Modulo Arithmetic & Buffer State Proofs", type: "concept", desc: "Diagram circular ring buffers, head/tail wrapping math, full vs empty boundary disambiguation, and cache locality." },
      { id: "dsa-m1-d08-q2", name: "Detective Lab: The Shift() Bottleneck in a High-Volume Packet Buffer", type: "detective", desc: "Profile an event queue suffering from $O(N)$ array shifts, replace it with a circular ring buffer, and benchmark throughput." },
      { id: "dsa-m1-d08-q3", name: "Mastery Assignment: Production CircularBuffer<T> Implementation", type: "assignment", desc: "Build a zero-allocation `CircularBuffer<T>` with overwrite policies, peek methods, iterator support, and typed arrays." },
      { id: "dsa-m1-d08-q4", name: "Production Incident Lab: Off-By-One Modulo Overflow Corrupting Audio Ring Buffer", type: "detective", desc: "Fix an off-by-one bug in a real-time WebRTC audio buffer where `tail % capacity` overwrote unread audio frames, causing harsh audio clicks." }
    ]
  },
  {
    day: 9,
    month: 1,
    blockNum: 2,
    title: "Double-Ended Queues (Deques) & Monotonic Sliding Window Maximum",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Deques & Sliding Window Extremas)",
    spokenGoal: "Master Double-Ended Queues (Deques): implement $O(1)$ operations at both ends, combine deques with monotonicity to solve the classic Sliding Window Maximum in $O(N)$ time, and track running minimum/maximum values over streaming data.",
    conceptInvariant: "Monotonic Deque Invariant: The deque maintains indices in monotonically decreasing order of their corresponding values. The front of the deque always holds the maximum value of the current window. Indices that fall outside the active window $[i - k + 1, i]$ are evicted from the front in $O(1)$.",
    failureMode: "Recomputing the maximum value of a sliding window of size $K$ by scanning all $K$ elements at every step, degrading performance to $O(N \\times K)$ and timing out when $K = 50,000$ and $N = 1,000,000$.",
    tryItFriction: "Implement `maxSlidingWindow(nums, k)` in TypeScript using a monotonic deque, ensuring every element is pushed and popped at most once to guarantee optimal $O(N)$ time.",
    socraticHints: [
      "What elements in a sliding window can never possibly be the maximum in any future window?",
      "Any element that is smaller than a newly arrived element to its right! It will be evicted before the new element and is smaller than it.",
      "Pop elements from the back of the deque as long as they are smaller than the incoming element."
    ],
    situationalPuzzle: {
      scenario: "A real-time network telemetry dashboard monitors the maximum packet latency observed in the last 60 seconds (a sliding window of 60,000 samples). The current code re-scans the 60,000 samples on every incoming packet (60,000 ops $\\times$ 1,000 packets/sec = 60,000,000 operations per second), consuming 100% CPU. How does the architecture achieve $O(1)$ per-packet updates?",
      options: [
        "Reduce the sliding window to 5 seconds.",
        "Maintain a Monotonic Decreasing Deque of indices. Evict expired indices from the front, evict smaller values from the back when new samples arrive, and read the running maximum from the front in $O(1)$ time.",
        "Store samples in a SQL database with a MAX() query.",
        "Average the values instead of finding the maximum."
      ],
      answerIdx: 1,
      debrief: "A monotonic deque maintains candidate maximums in decreasing order. Each sample enters and leaves the deque at most once, reducing the running maximum computation from $O(K)$ per packet to $O(1)$ amortized per packet."
    },
    quests: [
      { id: "dsa-m1-d09-q1", name: "Deque Architecture: Doubly-Linked vs Chunked Array Rings", type: "concept", desc: "Compare deque implementations: circular ring buffers vs C++ `std::deque` multi-chunk map allocations." },
      { id: "dsa-m1-d09-q2", name: "Detective Lab: Optimizing a Lagging Sliding Window Telemetry Monitor", type: "detective", desc: "Replace an $O(N \\times K)$ brute-force window scanner with an $O(N)$ monotonic deque, benchmarking execution time." },
      { id: "dsa-m1-d09-q3", name: "Mastery Assignment: Streaming Window Quantile & Maximum Engine", type: "assignment", desc: "Build a generic streaming sliding window processor supporting running maximum, minimum, and moving averages." },
      { id: "dsa-m1-d09-q4", name: "Production Incident Lab: Stale Index Retention in Deque Causing False Max Values", type: "detective", desc: "Fix an edge-case bug where expired timestamps were not properly popped from the deque front during discontinuous stream bursts." }
    ]
  },
  {
    day: 10,
    month: 1,
    blockNum: 2,
    title: "Least Recently Used (LRU) Cache: Combining Doubly Linked List & Hash Map in Strict O(1) Time",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Composite Data Structures & LRU Invariants)",
    spokenGoal: "Architect the universal caching primitive: engineer an enterprise Least Recently Used (LRU) Cache combining a Doubly Linked List with sentinel nodes and a Hash Map to achieve strict $O(1)$ time complexity for both `get()` and `put()` operations.",
    conceptInvariant: "LRU Composite Invariant: The Hash Map maps keys to Doubly Linked List node pointers ($O(1)$ lookup). The Doubly Linked List maintains access recency ($O(1)$ node relocation to head upon access, $O(1)$ node eviction from tail when capacity is exceeded).",
    failureMode: "Using a single array or single linked list where finding or relocating an element requires linear scanning ($O(N)$), causing cache hits to degrade linearly as cache size scales.",
    tryItFriction: "Implement class `LRUCache` with `constructor(capacity)`, `get(key)`, and `put(key, value)` with zero memory leaks, using sentinel dummy nodes (`head` and `tail`) to eliminate boundary null checks.",
    socraticHints: [
      "Why is a singly linked list insufficient for an $O(1)$ LRU cache?",
      "Because removing a node from the middle of a singly linked list requires finding its previous node, which takes $O(N)$ time!",
      "A doubly linked list allows a node to remove itself in $O(1)$ time using its own `node.prev` and `node.next` pointers."
    ],
    situationalPuzzle: {
      scenario: "An API gateway caches user authentication tokens using an in-memory LRU cache of capacity 10,000. Under sustained high traffic, profiling reveals that `cache.get()` operations are taking up to 1.8 milliseconds. Code inspection reveals the cache was implemented using a JavaScript `Map` where eviction was done by sorting entries by an accessed timestamp. What architectural change is required?",
      options: [
        "Increase the server memory.",
        "Implement the classic Doubly Linked List + Hash Map structure: on access, splice the node and insert it at the head in $O(1)$ time; on capacity overflow, evict `tail.prev` in $O(1)$ time without sorting.",
        "Disable caching.",
        "Use a Redis cache over the network."
      ],
      answerIdx: 1,
      debrief: "Sorting entries by timestamp takes $O(N \\log N)$ time. Combining a Hash Map with a Doubly Linked List enables instantaneous $O(1)$ updates and evictions via pointer splicing, completely eliminating sorting overhead."
    },
    quests: [
      { id: "dsa-m1-d10-q1", name: "LRU Cache Composite Architecture: Hash Map + Doubly Linked List", type: "concept", desc: "Diagram pointer relationships between Hash Map entries, doubly linked list nodes, and sentinel boundaries." },
      { id: "dsa-m1-d10-q2", name: "Detective Lab: Fixing Orphaned Nodes in a Leaky LRU Cache", type: "detective", desc: "Audit an LRU cache implementation where updating existing keys created duplicate linked list nodes, causing memory leaks." },
      { id: "dsa-m1-d10-q3", name: "Mastery Assignment: Production-Grade Thread-Safe LRUCache Engine", type: "assignment", desc: "Build a robust `LRUCache<K, V>` with TTL expiration support, capacity limits, and eviction telemetry metrics." },
      { id: "dsa-m1-d10-q4", name: "Production Incident Lab: Deadlock in Multi-Threaded LRU Cache Eviction", type: "detective", desc: "Triage a concurrency incident where two threads simultaneously evicted the tail node, corrupting the doubly linked list." }
    ]
  },

  // ─── BLOCK 3: Hash Tables, Collisions & Two-Pointer Strategies (Days 11–15) ───────────────
  {
    day: 11,
    month: 1,
    blockNum: 3,
    title: "Hash Functions: Uniform Distribution, Avalanche Effect, Collision Resolution (Chaining vs Open Addressing)",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Hash Physics & Collision Topologies)",
    spokenGoal: "Deconstruct hash table physics: master uniform distribution, the avalanche effect (1-bit change flips 50% of hash bits), hash table sizing with prime numbers, and compare collision resolution strategies: Separate Chaining vs Open Addressing (Linear & Quadratic Probing).",
    conceptInvariant: "Uniform Distribution Invariant: A hash function $h(k)$ must map keys uniformly across $M$ buckets such that $P(h(k_1) = h(k_2)) = 1/M$. Poor hash functions cluster keys into identical buckets, degrading hash table lookups from $O(1)$ to $O(N)$ linked list scans.",
    failureMode: "Using a naive hash function like `key.length % M` or sum of ASCII values, clustering all anagrams ('eat', 'tea', 'ate') into the exact same bucket and creating an accidental $O(N)$ denial-of-service vulnerability.",
    tryItFriction: "Implement MurmurHash3 or FNV-1a in TypeScript, hash 100,000 strings, and measure the bit distribution variance across 1,024 buckets to verify uniform spread.",
    socraticHints: [
      "What is the Avalanche Effect in hashing?",
      "A property where changing a single bit in the input key causes approximately half of the bits in the output hash to flip randomly!",
      "This prevents clustering when hashing sequential keys (like user IDs 101, 102, 103)."
    ],
    situationalPuzzle: {
      scenario: "A backend service uses an in-memory hash map with Open Addressing (Linear Probing). Over time, as elements are inserted and deleted, lookup latency slows down dramatically. Profiling reveals huge chains of occupied slots called 'Primary Clustering'. How does Primary Clustering occur in Linear Probing?",
      options: [
        "The computer memory has bad sectors.",
        "In Linear Probing, when a collision occurs, the item is placed in the next adjacent slot. As clusters grow, the probability of an incoming key hitting any slot in the cluster increases, causing clusters to merge and lookups to degrade.",
        "The keys were encrypted.",
        "Linear probing requires infinite RAM."
      ],
      answerIdx: 1,
      debrief: "Primary Clustering is a fundamental flaw of Linear Probing: longer contiguous blocks of occupied slots are more likely to be hit by subsequent hashes, causing exponential cluster growth. Quadratic probing or Robin Hood hashing mitigates this."
    },
    quests: [
      { id: "dsa-m1-d11-q1", name: "Hashing Mathematics: FNV-1a, MurmurHash3 & The Avalanche Effect", type: "concept", desc: "Analyze bitwise mixing operations (XOR, shift, multiplication by primes) and measure bit independence." },
      { id: "dsa-m1-d11-q2", name: "Detective Lab: Identifying Hash Clustering in a Flawed Modulo Table", type: "detective", desc: "Analyze a hash table with 10,000 entries where 80% of items clustered into 10 buckets due to non-prime table sizes." },
      { id: "dsa-m1-d11-q3", name: "Mastery Assignment: Hash Map with Separate Chaining & Dynamic Buckets", type: "assignment", desc: "Implement `HashMap<K, V>` from scratch with bucket chaining, dynamic load factor resizing, and FNV-1a hashing." },
      { id: "dsa-m1-d11-q4", name: "Production Incident Lab: Tombstone Accumulation in Open-Addressing Table", type: "detective", desc: "Fix an issue where deleted entries marked with 'tombstones' were never reclaimed, causing linear probing to search the entire array." }
    ]
  },
  {
    day: 12,
    month: 1,
    blockNum: 3,
    title: "Hash Table Resizing, Load Factor Thresholds & Robin Hood Hashing (Variance Minimization)",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Load Factor Engineering & Robin Hood Probing)",
    spokenGoal: "Engineer high-performance hash tables: master load factor thresholds ($\alpha = N/M$), implement geometric table doubling and re-hashing, and master Robin Hood Hashing (stealing from the rich to give to the poor) to minimize search distance variance.",
    conceptInvariant: "Robin Hood Invariant: When inserting a key with probe distance $D_{new}$ into a slot occupied by an element with probe distance $D_{existing}$, if $D_{new} > D_{existing}$, the new element steals the slot and the existing element continues probing. This minimizes the variance of probe lengths, preventing long lookup tails.",
    failureMode: "Allowing a hash table's load factor to exceed 0.9 in an open-addressing table, causing probe sequences to degrade exponentially and triggering worst-case $O(N)$ lookup stalls.",
    tryItFriction: "Implement a Robin Hood Hash Map in TypeScript, tracking 'distance from initial hash' (DIB) for each entry and swapping elements when an incoming key has traveled farther than the occupant.",
    socraticHints: [
      "Why is Robin Hood hashing superior to standard linear probing for lookup performance?",
      "Because it dramatically reduces the variance of probe lengths, keeping the maximum probe count low!",
      "If you search for a key and encounter an occupant whose distance from initial hash is *smaller* than your current distance, you can terminate search immediately (early exit)!"
    ],
    situationalPuzzle: {
      scenario: "An in-memory key-value store experiences unpredictable P99 latency spikes (some lookups take 2 microseconds, but 1% take 450 microseconds). The hash table uses linear probing. Why does migrating to Robin Hood Hashing flatten the P99 latency tail without increasing memory usage?",
      options: [
        "Robin Hood hashing uses a faster hashing algorithm.",
        "Robin Hood hashing redistributes probe distances so all elements have roughly equal probe lengths. By eliminating the extreme outliers (long probe chains), it dramatically reduces worst-case P99 search distances and enables early search termination.",
        "Robin Hood hashing deletes old keys automatically.",
        "It uses GPU acceleration."
      ],
      answerIdx: 1,
      debrief: "Standard linear probing allows some keys to suffer very long probe sequences. Robin Hood hashing balances probe lengths across all elements, dramatically lowering maximum probe distance and stabilizing P99 lookup latency."
    },
    quests: [
      { id: "dsa-m1-d12-q1", name: "Robin Hood Hashing: Probe Sequence Length (PSL) Mathematics", type: "concept", desc: "Derive the mathematical distribution of probe lengths in Robin Hood hashing vs standard linear probing." },
      { id: "dsa-m1-d12-q2", name: "Detective Lab: Profiling the Rehashing Freeze in an Un-Preallocated Map", type: "detective", desc: "Capture a 150ms server freeze caused by re-hashing 2,000,000 entries during a burst of writes, and implement incremental re-hashing." },
      { id: "dsa-m1-d12-q3", name: "Mastery Assignment: Robin Hood Hash Table from Scratch", type: "assignment", desc: "Build a complete `RobinHoodTable<K, V>` with DIB tracking, early search termination, and backward-shift deletion." },
      { id: "dsa-m1-d12-q4", name: "Production Incident Lab: Backward-Shift Deletion Bug Severing Probe Sequences", type: "detective", desc: "Fix an implementation bug in Robin Hood deletion where failing to shift subsequent elements left caused subsequent keys to become unreachable." }
    ]
  },
  {
    day: 13,
    month: 1,
    blockNum: 3,
    title: "Two Pointers (Opposite Direction): Two Sum Sorted, Container With Most Water & Palindrome Verification",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Greedy Convergence & Two-Pointer Invariants)",
    spokenGoal: "Master the Opposite-Direction Two-Pointer paradigm: prove why converging pointers eliminate the quadratic search space without missing optimal solutions, solve Two Sum in sorted arrays, Container With Most Water, and Trapping Rain Water.",
    conceptInvariant: "Monotonic Elimination Invariant: In a sorted array, if $arr[left] + arr[right] > target$, decreasing $right$ is the *only* move that can reduce the sum; moving $left$ can only increase it. This allows discarding an entire row of combinations at every step, reducing $O(N^2)$ to $O(N)$ with mathematical certainty.",
    failureMode: "Using a hash table to solve Two Sum on an already sorted 100,000,000-element array, wasting 800 MB of auxiliary RAM when opposite-direction two pointers solve it in $O(1)$ space.",
    tryItFriction: "Solve the Container With Most Water problem: start pointers at opposite ends of the array, calculate area, and advance the pointer with the *shorter* height, proving why moving the taller pointer can never produce a larger area.",
    socraticHints: [
      "In Container With Most Water, why do you always move the pointer pointing to the shorter vertical line?",
      "Because the area is limited by the shorter line ($area = min(h_l, h_r) \\times width$)!",
      "Moving the taller line reduces width without any possibility of increasing the height bound, so it can never increase area."
    ],
    situationalPuzzle: {
      scenario: "A developer solves the Trapping Rain Water problem using a 2D grid matrix simulation, which runs in $O(N \\times \\max(height))$ time and crashes on an array with height $10^9$. How does a Staff Algorithmist solve Trapping Rain Water in a single $O(N)$ pass with $O(1)$ auxiliary space?",
      options: [
        "Sort the heights array.",
        "Use two opposite-direction pointers (`left = 0`, `right = N-1`) tracking `left_max` and `right_max`. Advance the pointer with the smaller max, adding `max - height` to total water at each step.",
        "Store all water values in a priority queue.",
        "Use recursion."
      ],
      answerIdx: 1,
      debrief: "The two-pointer approach maintains `left_max` and `right_max`. Since water trapped at any position is bounded by $\\min(left\\_max, right\\_max)$, processing from the smaller boundary guarantees that the opposite side is tall enough to contain the water."
    },
    quests: [
      { id: "dsa-m1-d13-q1", name: "Two-Pointer Greedy Search Space Elimination Proof", type: "concept", desc: "Formally prove why converging pointers in Container With Most Water and Two Sum never skip optimal pairs." },
      { id: "dsa-m1-d13-q2", name: "Detective Lab: Refactoring an O(N^2) 3Sum Algorithm to O(N^2) with O(1) Space", type: "detective", desc: "Refactor a brute-force $O(N^3)$ 3Sum algorithm into sorted two-pointer convergence, handling duplicate elements." },
      { id: "dsa-m1-d13-q3", name: "Mastery Assignment: Trapping Rain Water Two-Pointer Engine", type: "assignment", desc: "Implement the $O(N)$ time, $O(1)$ space Trapping Rain Water algorithm with real-time elevation profile visualizations." },
      { id: "dsa-m1-d13-q4", name: "Production Incident Lab: Duplicate Triplets Exploding API Response Payload", type: "detective", desc: "Fix an issue in 3Sum where failing to skip identical adjacent elements resulted in 40,000 duplicate triplets in a financial report." }
    ]
  },
  {
    day: 14,
    month: 1,
    blockNum: 3,
    title: "Sliding Window (Dynamic & Fixed): Longest Substring Without Repeating Characters & Minimum Window Substring",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Linear Window Expansion & Contraction)",
    spokenGoal: "Master the Sliding Window algorithmic archetype: distinguish fixed-size windows from dynamic-size expanding/contracting windows, maintain window frequency hash maps, and solve Longest Substring Without Repeating Characters and Minimum Window Substring in $O(N)$ time.",
    conceptInvariant: "Linear Amortization Invariant: The window boundaries `left` and `right` only ever advance forward ($0 \\le left \\le right < N$). Because both pointers increment at most $N$ times each, the algorithm executes in strictly $2N = O(N)$ time regardless of how many contractions occur.",
    failureMode: "Resetting the `left` pointer back to `start + 1` whenever an invalid condition occurs, degrading the sliding window into an $O(N^2)$ brute-force re-scanner.",
    tryItFriction: "Implement `minWindow(s, t)` (Minimum Window Substring) using a frequency map and a `formed` match counter, ensuring the window expands with `right` and contracts with `left` in strict $O(N)$ time.",
    socraticHints: [
      "How do you check if all required characters from string $T$ are present in the current window in $O(1)$ time?",
      "Maintain a variable `matchCount` representing how many unique characters in $T$ have satisfied their required frequency!",
      "When `matchCount === targetUniqueChars`, the window is valid; contract `left` to find the minimal valid window."
    ],
    situationalPuzzle: {
      scenario: "A security scanner inspects a stream of 10,000,000 characters for the presence of any permutation of a 500-character malicious signature pattern. A junior developer slices substrings of length 500 and sorts them to compare against the signature ($O(N \\times K \\log K)$), freezing the firewall pipeline. How does a Staff Engineer solve this in $O(N)$ linear time?",
      options: [
        "Increase firewall memory.",
        "Fixed-Size Sliding Window with Character Frequency Counting: Maintain a 26-element array of character deltas. As the window slides by 1 character, update only the entering and exiting character counts in $O(1)$ time.",
        "Use regular expressions.",
        "Store the signature in a database."
      ],
      answerIdx: 1,
      debrief: "A fixed-size sliding window of size $K$ only changes by 2 characters per step (1 exits on left, 1 enters on right). Updating a frequency delta counter takes $O(1)$ operations per character, processing 10M characters in milliseconds."
    },
    quests: [
      { id: "dsa-m1-d14-q1", name: "Sliding Window Mathematical Framework: Fixed vs Dynamic Windows", type: "concept", desc: "Formalize window state invariants, expansion conditions, contraction triggers, and amortized complexity." },
      { id: "dsa-m1-d14-q2", name: "Detective Lab: Fixing an O(N^2) Reset Bug in a Longest Substring Scanner", type: "detective", desc: "Refactor a buggy string scanner that restarted from index 0 on duplicate characters, achieving true linear $O(N)$ time." },
      { id: "dsa-m1-d14-q3", name: "Mastery Assignment: Production-Grade Minimum Window Substring Engine", type: "assignment", desc: "Build an optimized `minWindow` algorithm supporting Unicode character sets, frequency matching, and zero allocations." },
      { id: "dsa-m1-d14-q4", name: "Production Incident Lab: Substring Index Slicing Triggering V8 String Allocations", type: "detective", desc: "Fix an issue where calling `s.substring()` inside a high-throughput loop allocated 500 MB of intermediate strings." }
    ]
  },
  {
    day: 15,
    month: 1,
    blockNum: 3,
    title: "Least Frequently Used (LFU) Cache & Milestone 2: Double-Linked Frequency Bucket Engine",
    stageName: "Stage 3: Systems Hardening",
    stageNum: 3,
    pedagogicalRole: "High Autonomy (Complex Composite Data Structures & Milestone 2)",
    spokenGoal: "Conquer the most challenging caching structure: engineer an enterprise Least Frequently Used (LFU) Cache operating in strict $O(1)$ time for both `get()` and `put()` operations using a frequency-to-doubly-linked-list map, tie-breaking by recency, and deliver Milestone 2.",
    conceptInvariant: "LFU $O(1)$ Invariant: An LFU cache requires three coordinated structures: (1) Key-to-Node map ($O(1)$ lookup), (2) Frequency-to-DoublyLinkedList map ($O(1)$ insertion by frequency), and (3) `minFrequency` integer tracker. Eviction removes the LRU element from the list at `minFrequency` in strict $O(1)$ time.",
    failureMode: "Using a min-heap sorted by access frequency to implement an LFU cache. Updating an element's frequency requires updating the heap in $O(\\log N)$ time, failing the strict $O(1)$ enterprise caching requirement.",
    tryItFriction: "Implement `LFUCache` with capacity handling, where accessing an element increments its frequency, removes it from its old frequency bucket list, inserts it into the new frequency bucket list, and updates `minFrequency`.",
    socraticHints: [
      "How do you maintain the `minFrequency` tracker in $O(1)$ time when an item is accessed?",
      "If the item accessed was at `minFrequency` and its old frequency list is now empty, `minFrequency` must increment by 1!",
      "When a new item is inserted, its frequency is always 1, so `minFrequency` simply resets to 1."
    ],
    situationalPuzzle: {
      scenario: "During an interview for a Staff Infrastructure Engineer role at a Big Tech firm, the candidate is asked: 'Design an in-memory LFU cache where `get` and `put` run in $O(1)$ worst-case time.' The candidate proposes using a balanced binary search tree or priority queue. The interviewer replies: 'That takes $O(\\log N)$. We require strict $O(1)$ time.' What data structure architecture must the candidate present?",
      options: [
        "A hash map mapping to an array of integers.",
        "A 2D composite structure: A `keyToNode` map for $O(1)$ item lookup, and a `freqToList` map where each frequency bucket is a Doubly Linked List of items with that frequency, paired with a `minFreq` tracker to evict the oldest item with the lowest frequency in $O(1)$ time.",
        "Tell the interviewer that $O(1)$ LFU is mathematically impossible.",
        "Use Redis."
      ],
      answerIdx: 1,
      debrief: "An $O(1)$ LFU cache requires grouping nodes by frequency into doubly linked lists. When an item's frequency increases, it transitions from bucket $F$ to $F+1$ in $O(1)$ time. Evicting the least frequently and least recently used item is a direct $O(1)$ tail removal from `freqToList[minFreq]`."
    },
    quests: [
      { id: "dsa-m1-d15-q1", name: "LFU Cache Architecture: Frequency Buckets & Doubly Linked Chains", type: "concept", desc: "Diagram the composite graph of `keyToNode`, `freqToList`, and `minFreq` transitions upon access and eviction." },
      { id: "dsa-m1-d15-q2", name: "Detective Lab: The Desynchronized minFrequency Bug in an LFU Cache", type: "detective", desc: "Debug an LFU implementation where `minFreq` failed to advance when the last item in frequency bucket 1 was accessed." },
      { id: "dsa-m1-d15-q3", name: "Mastery Assignment: Production Strict O(1) LFUCache Engine", type: "assignment", desc: "Build an industrial `LFUCache<K, V>` with zero allocations, tie-breaking by recency, and performance benchmarks." },
      { id: "dsa-m1-d15-q4", name: "Milestone 2 Gate: High-Performance Composite Caching Suite (LRU + LFU)", type: "assignment", desc: "Deliver Milestone 2: A validated composite caching library implementing both $O(1)$ LRU and $O(1)$ LFU with comprehensive test suites." }
    ]
  },

  // ─── BLOCK 4: Binary Search, Recursion & Backtracking (Days 16–20) ────────────────────────
  {
    day: 16,
    month: 1,
    blockNum: 4,
    title: "Binary Search: Monotonic Search Space Reduction, Boundary Invariants (low <= high vs low < high), Rotated Arrays",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Logarithmic Bisecting & Boundary Invariants)",
    spokenGoal: "Master logarithmic search: understand why binary search applies to any monotonic predicate function (not just sorted arrays), prevent integer overflow in midpoint calculation (`low + (high - low) / 2`), master boundary invariants (`low <= high` vs `low < high`), and solve Search in Rotated Sorted Array.",
    conceptInvariant: "Search Space Bisecting Invariant: At every iteration, testing the midpoint against a monotonic condition $P(mid)$ eliminates at least half of the remaining candidate indices. Therefore, the search terminates in at most $\\lfloor \\log_2 N \\rfloor + 1$ iterations.",
    failureMode: "Calculating midpoints using `(low + high) / 2`, which causes a catastrophic 32-bit integer overflow bug when `low + high > 2,147,483,647`, producing negative indices and crashing arrays.",
    tryItFriction: "Implement binary search in a rotated sorted array (`[4,5,6,7,0,1,2]`) in $O(\\log N)$ time by determining which half of the array is normally sorted and bisecting accordingly.",
    socraticHints: [
      "How do you determine which half of a rotated sorted array is normally sorted?",
      "Compare `arr[low]` with `arr[mid]`! If `arr[low] <= arr[mid]`, the left half is guaranteed to be sorted.",
      "Check if the target lies within the boundaries of the sorted half; if yes, search that half, otherwise search the opposite half."
    ],
    situationalPuzzle: {
      scenario: "In an enterprise Java service with an array of 1,500,000,000 items, binary search throws `ArrayIndexOutOfBoundsException: Index -1073741824 out of bounds` when searching for items in the upper half of the array. The code calculates `int mid = (low + high) / 2;`. What historically famous bug occurred?",
      options: [
        "Java arrays cannot exceed 100,000 items.",
        "32-Bit Signed Integer Overflow: In 32-bit signed integers, when `low + high` exceeds $2^{31}-1$, the value overflows into negative numbers. The calculation must be written as `low + (high - low) / 2` or `(low + high) >>> 1`.",
        "The array was corrupted by garbage collection.",
        "The CPU ALU had a hardware defect."
      ],
      answerIdx: 1,
      debrief: "This famous bug existed in Java's `java.util.Arrays.binarySearch` for nearly a decade. When `low + high` overflows 32 bits, it becomes negative, producing an illegal negative array index. Using `low + (high - low) / 2` avoids overflow."
    },
    quests: [
      { id: "dsa-m1-d16-q1", name: "Binary Search Boundary Matrix: [low, high] vs [low, high)", type: "concept", desc: "Map exact loop termination invariants, insertion bisecting (left-insert vs right-insert), and edge-case handling." },
      { id: "dsa-m1-d16-q2", name: "Detective Lab: Resolving the Infinite Loop in an Asymmetric Binary Search", type: "detective", desc: "Debug a binary search function stuck in an infinite loop on 2-element arrays due to mismatched `mid = (low + high) / 2` and `low = mid`." },
      { id: "dsa-m1-d16-q3", name: "Mastery Assignment: Search in Rotated Sorted Array & Duplicate Elements", type: "assignment", desc: "Implement $O(\\log N)$ search in rotated arrays, handling duplicates gracefully with worst-case linear fallbacks." },
      { id: "dsa-m1-d16-q4", name: "Production Incident Lab: Integer Overflow Crashing Binary Search on Large Datasets", type: "detective", desc: "Fix an integer overflow bug in a large in-memory database index using bitwise unsigned shifts `(low + high) >>> 1`." }
    ]
  },
  {
    day: 17,
    month: 1,
    blockNum: 4,
    title: "Binary Search on Answer: Finding Median of Two Sorted Arrays, Capacity Optimization & Square Roots",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Binary Search over Monotonic Function Spaces)",
    spokenGoal: "Elevate binary search from array lookups to optimization algorithms: master 'Binary Search on the Answer' over abstract monotonic function spaces, solve Ship Within Days, Koko Eating Bananas, and master the legendary $O(\\log(\\min(M, N)))$ Median of Two Sorted Arrays.",
    conceptInvariant: "Answer Space Monotonicity Invariant: If a feasibility check function $feasible(X)$ satisfies the property that $feasible(X) = true \\implies feasible(X+1) = true$ (monotonic boolean output), then the minimum $X$ can be found via binary search over the range $[\min, \max]$ in $O(\\log(\\text{range}) \\times \\text{cost}(feasible))$ time.",
    failureMode: "Incrementing candidate capacity $X$ linearly by $+1$ from 1 to $1,000,000,000$ to find the minimum ship capacity, executing 1 billion slow database simulation passes instead of 30 binary search steps.",
    tryItFriction: "Implement the $O(\\log(\\min(M, N)))$ algorithm to find the Median of Two Sorted Arrays by partitioning both arrays simultaneously such that the left halves and right halves are equal in length and ordered.",
    socraticHints: [
      "How do you find the median of two sorted arrays without merging them?",
      "Binary search the partition cut in the *smaller* array!",
      "If you cut the smaller array at index $i$, the cut in the larger array is automatically $j = (M + N + 1)/2 - i$. Verify boundary conditions: $L_1 \\le R_2$ and $L_2 \\le R_1$."
    ],
    situationalPuzzle: {
      scenario: "A logistics company needs to ship packages across $D$ days. The package weights are given in an array. The system needs to find the minimum ship capacity required so all packages are shipped within $D$ days without splitting packages across days. The maximum package weight is $10^9$. How does a Senior Algorithmist solve this in under 1 millisecond?",
      options: [
        "Sort the packages in descending order.",
        "Binary Search on Answer: The capacity search space is $[\max(weights), \\sum(weights)]$. Use binary search: for each midpoint capacity, run a greedy $O(N)$ check to see if packages can be shipped in $\\le D$ days. Total time is $O(N \\log(\\sum weights))$.",
        "Brute-force every possible capacity starting from 1.",
        "Use dynamic programming with an $O(N \\times D)$ matrix."
      ],
      answerIdx: 1,
      debrief: "Binary Search on Answer turns optimization problems into feasibility checks. Since feasibility is monotonic (if capacity $C$ works, any capacity $> C$ also works), binary search finds the optimal minimum in $\\log(\\text{range})$ steps."
    },
    quests: [
      { id: "dsa-m1-d17-q1", name: "Binary Search on Answer Archetype: Feasibility Predicates", type: "concept", desc: "Map problems suitable for answer binary search: capacity planning, speed optimization, and resource allocation." },
      { id: "dsa-m1-d17-q2", name: "Detective Lab: Optimizing an O(N * Range) Logistics Cargo Pipeline", type: "detective", desc: "Refactor a linear cargo capacity search into binary search on answer, reducing query latency from 8 seconds to 1ms." },
      { id: "dsa-m1-d17-q3", name: "Mastery Assignment: Median of Two Sorted Arrays in Strict O(log(min(M,N)))", type: "assignment", desc: "Implement the dual-partition binary search algorithm for the median of two sorted arrays with complete edge-case handling." },
      { id: "dsa-m1-d17-q4", name: "Production Incident Lab: Infinite Loop in Binary Search Floating-Point Midpoint", type: "detective", desc: "Fix an infinite loop in a continuous fractional binary search where floating-point precision prevented `low < high` from converging." }
    ]
  },
  {
    day: 18,
    month: 1,
    blockNum: 4,
    title: "Recursion Fundamentals: Base Cases, Recursion Tree Visualizations & Call Stack Depth Limits",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Recursive Inductive Proofs & Stack Frames)",
    spokenGoal: "Master recursive thinking: understand mathematical induction, establish unambiguous base cases, visualize recursion execution trees and branch factor explosions, and manage OS call stack limits (handling $10^4$ depth limits via iteration).",
    conceptInvariant: "Inductive Termination Invariant: A valid recursive function must satisfy two mathematical criteria: (1) An explicit Base Case that returns without recursion, and (2) An Inductive Step that strictly moves state closer to the base case. If the state distance does not strictly decrease, the recursion diverges into infinite stack exhaustion.",
    failureMode: "Writing a recursive directory tree traversal that encounters a symbolic link pointing to a parent directory, causing infinite recursive cycles until the V8 engine crashes with `Maximum call stack size exceeded`.",
    tryItFriction: "Convert a deep recursive tree traversal function that crashes on 20,000-deep linear trees into an iterative algorithm using an explicit heap-allocated stack with zero call-stack overhead.",
    socraticHints: [
      "Why does a recursive function crash with stack overflow while an iterative function with an array stack does not?",
      "Because the OS thread call stack is tiny (typically 1 MB to 8 MB), while heap memory can use gigabytes!",
      "Simulate the call stack using a heap-allocated array to support arbitrarily deep traversals."
    ],
    situationalPuzzle: {
      scenario: "A microservice parses deeply nested mathematical formulas. A client submits a payload containing 25,000 nested expressions: `f(f(f(...)))`. The Node.js service crashes instantly with `RangeError: Maximum call stack size exceeded`. How does Staff Architecture harden the parser against call stack crashes?",
      options: [
        "Increase the server RAM.",
        "Refactor the recursive parsing function into an iterative loop using an explicit heap-allocated stack (`const stack = []`), bypassing the OS/V8 execution call-stack depth limits completely.",
        "Reject all user formulas longer than 50 characters.",
        "Run the code inside a Docker container."
      ],
      answerIdx: 1,
      debrief: "V8 and OS threads have strict call-stack depth limits (typically ~10,000 frames). Replacing runtime language recursion with an explicit heap-allocated stack structure eliminates stack overflow crashes regardless of input depth."
    },
    quests: [
      { id: "dsa-m1-d18-q1", name: "Recursion Trees, Stack Frames & Tail Call Optimization (TCO)", type: "concept", desc: "Analyze the anatomy of recursive call trees, memory allocation per frame, and the compiler mechanics of TCO." },
      { id: "dsa-m1-d18-q2", name: "Detective Lab: The Symbolic Link Infinite Recursive Loop", type: "detective", desc: "Debug a recursive file crawler that hung indefinitely on circular symlinks, and implement a visited inode set." },
      { id: "dsa-m1-d18-q3", name: "Mastery Assignment: Recursive-to-Iterative AST Transformer", type: "assignment", desc: "Build an iterative AST traversal engine capable of processing 100,000-level deep nested trees without stack overflow." },
      { id: "dsa-m1-d18-q4", name: "Production Incident Lab: Uncaught Recursion Divergence Freezing Production Worker", type: "detective", desc: "Fix an issue where a recursive currency converter failed to terminate due to cyclical foreign exchange rate pairs." }
    ]
  },
  {
    day: 19,
    month: 1,
    blockNum: 4,
    title: "Backtracking Foundations: Subsets, Permutations & Combinations (State Reversals)",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Exhaustive Search Spaces & Backtracking)",
    spokenGoal: "Master exhaustive combinatorial search: understand the Backtracking template (Choose, Explore, Unchoose), solve Subsets ($2^N$), Permutations ($N!$), and Combinations ($C(N, K)$), and maintain strict state reversal invariants to prevent memory mutation contamination.",
    conceptInvariant: "State Reversal Invariant: Any state modification made during candidate exploration (`path.push(x)`) MUST be symmetrically reversed upon returning from the recursive branch (`path.pop()`). This allows exploring a massive search space using a single shared mutable buffer with zero memory allocations.",
    failureMode: "Cloning arrays on every recursive call (`path.concat([x])`), creating $O(N! \\times N)$ temporary array copies in memory, triggering aggressive garbage collection pauses and slowing execution by 50x.",
    tryItFriction: "Implement Permutations of an array with duplicate elements (`[1, 1, 2]`) using backtracking, sorting the array first and pruning duplicate branches to guarantee unique permutations.",
    socraticHints: [
      "How do you prune duplicate branches in backtracking without using a hash set?",
      "Sort the array first so identical elements are adjacent!",
      "If `nums[i] === nums[i-1]` and the previous element has NOT been used in the current branch, skip the current element."
    ],
    situationalPuzzle: {
      scenario: "A developer generates all permutations of a 10-element list using backtracking. They use `backtrack([...current, item])` on every recursive step. The Node.js process consumes 1.4 GB of RAM and crashes with out-of-memory. Why did this happen, and how is it fixed?",
      options: [
        "10 elements cannot be permuted.",
        "Array Cloning Allocation Explosion: Spreading `[...current, item]` creates a new array at every node in the $10! = 3,628,800$ tree. Using a single shared `current` array with `push()` before recursion and `pop()` after recursion uses $O(N)$ total memory.",
        "The computer needs more swap space.",
        "JavaScript numbers are 64-bit."
      ],
      answerIdx: 1,
      debrief: "Creating new array copies at every step in a combinatorial tree of size $N!$ creates millions of short-lived objects. Mutating a single shared array with `push()` and `pop()` (backtracking) keeps auxiliary memory strictly at $O(N)$."
    },
    quests: [
      { id: "dsa-m1-d19-q1", name: "Backtracking Search Space Trees: Power Sets vs Permutations Math", type: "concept", desc: "Calculate exact state space tree node counts for Subsets ($2^N$), Permutations ($N!$), and Combinations ($C(N, K)$)." },
      { id: "dsa-m1-d19-q2", name: "Detective Lab: Eliminating Duplicate Sets in a Permutation Generator", type: "detective", desc: "Audit a combinatorial generator producing duplicate sets on inputs with repeated elements, and implement sorting prune gates." },
      { id: "dsa-m1-d19-q3", name: "Mastery Assignment: High-Performance Zero-Allocation Combinatorics Engine", type: "assignment", desc: "Build a combinatorics generator for Subsets, Permutations, and Combinations utilizing in-place swaps and single-array backtracking." },
      { id: "dsa-m1-d19-q4", name: "Production Incident Lab: Un-Popped State Polluting Parallel Backtracking Workers", type: "detective", desc: "Fix an elusive bug where an early `return` bypassed the `path.pop()` cleanup step, corrupting all subsequent permutation branches." }
    ]
  },
  {
    day: 20,
    month: 1,
    blockNum: 4,
    title: "Constraint Satisfaction Backtracking: N-Queens, Sudoku Solver & Pruning Branch Strategies (Milestone 3)",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Constraint Propagation & Milestone 3 Gate)",
    spokenGoal: "Conquer constraint satisfaction problems and deliver Milestone 3: master constraint propagation and branch pruning, solve the N-Queens problem using $O(1)$ bitmasks / lookup sets for diagonals, engineer an optimal Sudoku Solver, and pass Milestone 3.",
    conceptInvariant: "Pruning Invariant: In a constraint satisfaction tree, as soon as a partial assignment violates any constraint, the entire subtree beneath it is pruned immediately. Never explore deeper into provably invalid branches.",
    failureMode: "Checking queen diagonal collisions in N-Queens by iterating through the entire 2D board at each step ($O(N)$ check), slowing down the solver by 10x compared to $O(1)$ diagonal set lookups (`row - col` and `row + col`).",
    tryItFriction: "Solve the N-Queens problem using bitmasks to track occupied columns, positive diagonals, and negative diagonals in $O(1)$ bitwise operations, finding all solutions for $N=14$ in under 1 second.",
    socraticHints: [
      "What mathematical property is identical for all cells on the same positive diagonal?",
      "The sum of their coordinates is constant: `row + col = constant`!",
      "For negative diagonals, their difference is constant: `row - col = constant`. Use sets or bitmasks of size $2N$ for $O(1)$ collision checks."
    ],
    situationalPuzzle: {
      scenario: "An airline flight scheduling engine needs to assign crews to flights subject to 15 complex FAA rest and qualification constraints. A naive backtracking search takes 4 hours to solve a single day's schedule. A Senior Algorithmist introduces the 'Minimum Remaining Values' (MRV) heuristic: always assign the flight with the fewest legal crew choices first. Why does this speed up search by 1,000x?",
      options: [
        "MRV uses parallel threads.",
        "Fail-First Principle: By selecting variables with the fewest legal choices first, invalid branches fail immediately at the top of the search tree rather than after exploring millions of useless deep subtrees.",
        "MRV changes the FAA regulations.",
        "It eliminates backtracking completely."
      ],
      answerIdx: 1,
      debrief: "The Minimum Remaining Values (MRV) heuristic embodies the 'Fail-First' principle of constraint satisfaction. Pruning impossible branches as early as possible near the root of the search tree cuts off massive subtrees before they can be explored."
    },
    quests: [
      { id: "dsa-m1-d20-q1", name: "Constraint Satisfaction Problems (CSP): Backtracking & Pruning Math", type: "concept", desc: "Analyze CSP formulations, forward checking, constraint propagation, and MRV heuristics." },
      { id: "dsa-m1-d20-q2", name: "Detective Lab: Eliminating the 2D Board Scan in an N-Queens Solver", type: "detective", desc: "Refactor an $O(N)$ diagonal collision checker in N-Queens to use $O(1)$ bitwise registers, benchmarking a 12x speedup." },
      { id: "dsa-m1-d20-q3", name: "Mastery Assignment: Bitwise N-Queens & Industrial Sudoku Solver", type: "assignment", desc: "Build an ultra-fast Sudoku solver using backtracking with MRV heuristic capable of solving hard 9x9 grids in <5ms." },
      { id: "dsa-m1-d20-q4", name: "Milestone 3 Gate: Advanced Backtracking & Constraint Satisfaction Engine", type: "assignment", desc: "Deliver Milestone 3: A validated constraint solver engine handling N-Queens, Sudoku, and word search grids with optimal pruning." }
    ]
  },

  // ─── BLOCK 5: Trees, Heaps & Disjoint Sets (Days 21–25) ───────────────────────────────────
  {
    day: 21,
    month: 1,
    blockNum: 5,
    title: "Binary Trees: In/Pre/Post-Order Traversal Invariants, Breadth-First Level-Order Traversal (BFS)",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Hierarchical Data & Traversal Mathematics)",
    spokenGoal: "Master hierarchical data structures: understand recursive vs iterative Depth-First Search (Pre-Order, In-Order, Post-Order), implement Breadth-First Search (Level-Order) using queues, and reconstruct binary trees from traversal pairs.",
    conceptInvariant: "Traversal Uniqueness Invariant: An In-Order traversal alone cannot uniquely reconstruct a binary tree. A tree can be uniquely reconstructed if and only if you have either (In-Order + Pre-Order) OR (In-Order + Post-Order), because In-Order separates left/right subtrees while Pre/Post identifies the root.",
    failureMode: "Attempting to serialize and deserialize a binary tree using only its In-Order traversal, discovering that multiple completely different trees produce the exact identical in-order sequence.",
    tryItFriction: "Implement Morris In-Order Traversal, which visits all nodes of a binary tree in strict $O(N)$ time and $O(1)$ auxiliary memory by temporarily threading right child pointers to in-order predecessors.",
    socraticHints: [
      "How can you traverse a binary tree in $O(1)$ auxiliary memory without a call stack or heap stack?",
      "Use Morris Traversal: if a node has a left child, find its in-order predecessor and point its right child back to the current node (threading)!",
      "When returning via the thread, restore the original pointer to null, achieving zero auxiliary space."
    ],
    situationalPuzzle: {
      scenario: "A developer builds an enterprise organizational hierarchy browser. To display employees by seniority levels, they write a recursive DFS function that groups employees by depth. When rendering a 50,000-node company tree, the app crashes with a stack overflow. How must Level-Order traversal be structured cleanly?",
      options: [
        "Sort all employees alphabetically.",
        "Implement Breadth-First Search (BFS) using a FIFO Queue: enqueue the root, then loop while the queue is not empty, popping all nodes at the current level length before enqueuing their children. This uses $O(W)$ memory (where $W$ is maximum level width) and never overflows the call stack.",
        "Convert the tree into a linked list.",
        "Delete leaf nodes."
      ],
      answerIdx: 1,
      debrief: "BFS with a FIFO queue processes tree levels iteratively. It guarantees level-by-level evaluation, avoids call stack overflow on deep trees, and requires auxiliary memory proportional only to the widest tree level."
    },
    quests: [
      { id: "dsa-m1-d21-q1", name: "Tree Traversal Mathematics: Pre, In, Post & Level-Order Invariants", type: "concept", desc: "Map traversal sequences to prefix, infix, and postfix expression trees and verify reconstruction proofs." },
      { id: "dsa-m1-d21-q2", name: "Detective Lab: Reconstructing a Corrupted Binary Tree from Pre+In Traversal", type: "detective", desc: "Build an $O(N)$ tree reconstruction algorithm using an in-order index hash map, fixing index out-of-bounds edge cases." },
      { id: "dsa-m1-d21-q3", name: "Mastery Assignment: Iterative DFS & Morris In-Order Traversal Engine", type: "assignment", desc: "Implement iterative pre/in/post-order traversals using explicit stacks, plus Morris Traversal with strict $O(1)$ memory." },
      { id: "dsa-m1-d21-q4", name: "Production Incident Lab: Unbalanced Skewed Tree Crashing Recursive Tree Depth Calculation", type: "detective", desc: "Fix an incident where a 30,000-node skewed linear binary tree crashed a production microservice with stack overflow." }
    ]
  },
  {
    day: 22,
    month: 1,
    blockNum: 5,
    title: "Binary Search Trees (BST): Validation Invariants, In-Order Successor/Predecessor & Lowest Common Ancestor (LCA)",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (BST Invariants & Tree Geometry)",
    spokenGoal: "Master Binary Search Trees (BST): enforce strict left-less/right-greater invariants across whole subtrees, validate BSTs with dynamic range boundaries ($-\infty, +\infty$), locate in-order successors/predecessors, and find the Lowest Common Ancestor (LCA) in $O(H)$ time.",
    conceptInvariant: "Global BST Invariant: For every node $X$, ALL nodes in $X$'s left subtree must be strictly less than $X.val$, and ALL nodes in $X$'s right subtree must be strictly greater than $X.val$. Checking only local child relationships ($left < node < right$) is a fatal flaw that permits invalid BSTs.",
    failureMode: "Validating a BST by asserting only `node.left.val < node.val < node.right.val` locally, falsely validating a tree where a left-subtree descendant is larger than the root (e.g. root 10, left child 5, right child of 5 is 15).",
    tryItFriction: "Write a BST validation function that passes dynamic allowable value bounds `(min, max)` down recursive calls, ensuring every node strictly satisfies `min < node.val < max`.",
    socraticHints: [
      "Why is `node.left.val < node.val` insufficient to validate a BST?",
      "Because a node deep in the left subtree could be larger than an ancestor root!",
      "Pass valid ranges `(minBound, maxBound)` down the tree. When traversing left, update `maxBound = node.val`; when traversing right, update `minBound = node.val`."
    ],
    situationalPuzzle: {
      scenario: "In an in-memory database index structured as a BST, a developer deletes a node with two children. To maintain the BST invariant, which node must replace the deleted node, and in what time complexity can it be found?",
      options: [
        "The root of the tree.",
        "Either the In-Order Predecessor (maximum node in the left subtree) OR the In-Order Successor (minimum node in the right subtree), which can be found in $O(H)$ time by taking one step right and following left pointers to the leaf.",
        "Any random leaf node.",
        "The parent node."
      ],
      answerIdx: 1,
      debrief: "Replacing a deleted two-child node with its in-order successor (the smallest value greater than the node) guarantees that all left subtree nodes remain smaller and all right subtree nodes remain greater, preserving the BST invariant."
    },
    quests: [
      { id: "dsa-m1-d22-q1", name: "BST Mathematical Invariants & Lowest Common Ancestor Geometry", type: "concept", desc: "Analyze the mathematical proof for LCA in a BST: the first node $X$ where $p \\le X \\le q$ or $q \\le X \\le p$ is guaranteed to be the LCA." },
      { id: "dsa-m1-d22-q2", name: "Detective Lab: Uncovering the Flawed Local BST Validator", type: "detective", desc: "Audit a production test suite with a flawed local-only BST validator that allowed invalid trees into production, and rewrite with bounds." },
      { id: "dsa-m1-d22-q3", name: "Mastery Assignment: Full-Featured Binary Search Tree Implementation", type: "assignment", desc: "Build `BinarySearchTree<T>` supporting insert, delete with 2-child splicing, successor lookup, and range query filtering." },
      { id: "dsa-m1-d22-q4", name: "Production Incident Lab: Unbalanced BST Degenerating to O(N) Linked List", type: "detective", desc: "Triage a database index slowdown where inserting pre-sorted sequential user IDs degraded search latency from $O(\\log N)$ to $O(N)$." }
    ]
  },
  {
    day: 23,
    month: 1,
    blockNum: 5,
    title: "Binary Heaps & Priority Queues: Complete Binary Tree Array Representation, Sift-Up/Sift-Down & Heapify in O(N)",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Array-Based Heaps & Linear Construction)",
    spokenGoal: "Engineer priority-based scheduling primitives: master the Complete Binary Tree array representation (parent at $\\lfloor(i-1)/2\\rfloor$, children at $2i+1$ and $2i+2$), implement sift-up and sift-down mechanics, and mathematically prove why `heapify` builds a heap in $O(N)$ time, not $O(N \\log N)$.",
    conceptInvariant: "Heap Order Invariant: In a Min-Heap, for every node $i$ other than root, $arr[parent(i)] \\le arr[i]$. Because a complete binary tree has no gaps, it is mapped into a flat array with zero pointer overhead, guaranteeing optimal cache locality.",
    failureMode: "Building a heap from an array of $N$ items by repeatedly calling `insert()` $N$ times ($O(N \\log N)$), rather than running bottom-up `siftDown()` from $\\lfloor N/2 \\rfloor$ down to 0, which builds the heap in linear $O(N)$ time.",
    tryItFriction: "Implement `siftDown` and `heapify` from scratch, mathematically verifying the sum of heights $\\sum_{h=0}^{\\log N} \\frac{N}{2^{h+1}} \\times h = O(N)$ to prove linear heap construction.",
    socraticHints: [
      "Why is bottom-up `heapify` $O(N)$ while $N$ sequential inserts is $O(N \\log N)$?",
      "Because half of the nodes are leaves (height 0) and do 0 sift-downs! One-quarter are at height 1 and do 1 sift-down.",
      "Most nodes have very small heights, so the weighted sum of work converges to $O(N)$."
    ],
    situationalPuzzle: {
      scenario: "A video streaming platform receives 2,000,000 video segments that must be organized into a Min-Heap for bitrate transcoding. The junior developer writes a loop calling `heap.push(segment)` for each item ($O(N \\log N)$), taking 4.2 seconds. A Senior Systems Engineer replaces it with bottom-up `heapify` ($O(N)$). Execution time drops to 0.3 seconds. What mathematical principle explains this 14x speedup?",
      options: [
        "The compiler skipped type checking.",
        "Bottom-Up Heapify Complexity: In bottom-up construction, the number of nodes at height $h$ is $N/2^{h+1}$. Since work is proportional to height, the infinite series $\\sum h/2^h$ converges to 2, yielding strictly $O(N)$ total comparisons.",
        "Heapify uses parallel threads.",
        "The array was already sorted."
      ],
      answerIdx: 1,
      debrief: "Repeated insertion performs $O(\\log N)$ work for the leaves (the largest group of nodes). Bottom-up `heapify` starts at the bottom where work is zero for leaves and increases only for the exponentially smaller tiers of ancestors, achieving $O(N)$ total time."
    },
    quests: [
      { id: "dsa-m1-d23-q1", name: "Binary Heap Mathematics & The O(N) Heapify Convergence Proof", type: "concept", desc: "Write out the formal mathematical proof using geometric series for bottom-up $O(N)$ heap construction." },
      { id: "dsa-m1-d23-q2", name: "Detective Lab: Profiling Heapify vs N Sequential Inserts", type: "detective", desc: "Benchmark 5,000,000 items comparing sequential insert ($O(N \\log N)$) vs bottom-up heapify ($O(N)$), measuring CPU cycles." },
      { id: "dsa-m1-d23-q3", name: "Mastery Assignment: Production PriorityQueue<T> with Custom Comparators", type: "assignment", desc: "Build a generic `PriorityQueue<T>` with heapify constructor, peek, poll, and dynamic array backing." },
      { id: "dsa-m1-d23-q4", name: "Production Incident Lab: Sift-Down Index Corruption in Priority Dispatcher", type: "detective", desc: "Fix an off-by-one bug where `2*i + 2` accessed out-of-bounds array memory on nodes having only a single left child." }
    ]
  },
  {
    day: 24,
    month: 1,
    blockNum: 5,
    title: "Top-K Streaming Queries, Median in a Stream (Two-Heap Pattern) & Priority Queue Schedules",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Streaming Top-K & Two-Heap Balancing)",
    spokenGoal: "Master streaming priority patterns: implement Top-K largest elements using a bounded Min-Heap of size $K$ ($O(N \\log K)$ time and $O(K)$ space), engineer the Dual-Heap pattern (Max-Heap + Min-Heap) for finding the running Median in a stream in $O(1)$ time, and architect task schedulers.",
    conceptInvariant: "Dual-Heap Median Invariant: Maintain two heaps: a Max-Heap for the smaller half of numbers and a Min-Heap for the larger half. Invariant: sizes differ by at most 1, and `maxHeap.top() <= minHeap.top()`. The median is either the top of the larger heap, or the average of both tops.",
    failureMode: "Sorting a 1,000,000-element stream on every incoming item to find the median ($O(N^2 \\log N)$), freezing the system when the Dual-Heap pattern maintains the exact median in $O(\\log N)$ insert and $O(1)$ query time.",
    tryItFriction: "Build a `MedianFinder` class using the two-heap pattern, ensuring heaps remain balanced in size after every insertion and verifying correct median retrieval across 100,000 random floating-point numbers.",
    socraticHints: [
      "Why use a Min-Heap of size $K$ to find the Top-K *largest* elements?",
      "Because the top of the Min-Heap is the *smallest* of the Top-K largest candidates!",
      "If a new element is larger than the Min-Heap top, pop the top and push the new element. At the end, the heap contains the $K$ largest items."
    ],
    situationalPuzzle: {
      scenario: "A real-time financial market analytics service needs to compute the median execution price across millions of trades arriving continuously. Re-sorting the trade history on every trade is impossible. A developer implements a Two-Heap system: `max_heap` for lower values, `min_heap` for upper values. What balancing invariant must be maintained after every `addNum()`?",
      options: [
        "The heaps must have exactly equal sizes always.",
        "The size difference must be at most 1 (`|max_heap.size() - min_heap.size()| <= 1`) AND every element in `max_heap` must be $\\le$ every element in `min_heap`. If an invariant is broken, pop the root of the larger heap and push it into the other.",
        "All numbers must be integers.",
        "The heaps must be rebuilt from scratch every 10 seconds."
      ],
      answerIdx: 1,
      debrief: "The Two-Heap pattern partitions data into lower and upper halves. Ensuring that size differs by at most 1 and that the maximum of the lower half is $\\le$ the minimum of the upper half allows finding the median in instantaneous $O(1)$ time."
    },
    quests: [
      { id: "dsa-m1-d24-q1", name: "Streaming Priority Architectures: Top-K Bounded Heaps vs Sorting", type: "concept", desc: "Compare time and memory complexities: Quickselect ($O(N)$ offline) vs Bounded Min-Heap ($O(N \\log K)$ online)." },
      { id: "dsa-m1-d24-q2", name: "Detective Lab: Resolving Heap Balance Drift in a Streaming Median Tracker", type: "detective", desc: "Audit a MedianFinder implementation where heaps drifted by 3 elements during skewed monotonic input streams." },
      { id: "dsa-m1-d24-q3", name: "Mastery Assignment: Dual-Heap Median & Top-K Event Frequency Tracker", type: "assignment", desc: "Build a streaming processor maintaining both top-100 high-frequency events and the exact running median in $O(1)$ query time." },
      { id: "dsa-m1-d24-q4", name: "Production Incident Lab: Priority Inversion in Distributed Task Scheduler", type: "detective", desc: "Resolve a bug where low-priority tasks with older timestamps starved critical high-priority jobs in a priority queue dispatcher." }
    ]
  },
  {
    day: 25,
    month: 1,
    blockNum: 5,
    title: "Disjoint Set Union (DSU / Union-Find): Path Compression, Union by Rank/Size & Cycle Detection (Milestone 4)",
    stageName: "Stage 3: Systems Hardening",
    stageNum: 3,
    pedagogicalRole: "High Autonomy (Disjoint Sets & Inverse Ackermann Complexity)",
    spokenGoal: "Deliver Milestone 4: master Disjoint Set Union (DSU / Union-Find), implement Path Compression and Union by Rank/Size, prove why operations run in near-constant $O(\\alpha(N))$ time (Inverse Ackermann function), and solve dynamic connectivity and cycle detection in undirected graphs.",
    conceptInvariant: "Inverse Ackermann Invariant: Combining Path Compression (`find(x)` points node directly to root) and Union by Rank (flatter trees attach under deeper trees) bounds tree depth so aggressively that the amortized cost per operation is $O(\\alpha(N))$, where $\\alpha(N) < 5$ for any input size up to the number of atoms in the observable universe ($10^{80}$).",
    failureMode: "Implementing Union-Find without Path Compression or Union by Rank. The trees degenerate into linear linked lists, causing `find()` operations to degrade from $O(1)$ to $O(N)$ and timing out on large graphs.",
    tryItFriction: "Build a complete `DisjointSet` class in TypeScript with path compression and union by rank, and use it to detect cycles in an undirected network graph of 100,000 edges in under 50ms.",
    socraticHints: [
      "What single line of code implements Path Compression in `find(i)`?",
      "`parent[i] = find(parent[i]); return parent[i];`!",
      "This single assignment flattens the tree completely, pointing every visited node directly to the representative root."
    ],
    situationalPuzzle: {
      scenario: "A social network tracks dynamic friendships across 50,000,000 users. The system needs to query whether User A and User B are connected in the same social network cluster in real-time (< 1 microsecond). The developer considers BFS, which takes $O(V + E)$ time per query. What data structure provides near-instantaneous $O(\\alpha(N))$ connectivity checks?",
      options: [
        "A relational database with JOINs.",
        "Disjoint Set Union (Union-Find) with Path Compression and Union by Rank. Connecting two users takes $O(\\alpha(N))$ amortized time, and checking if two users share the same cluster root (`find(A) == find(B)`) takes $O(\\alpha(N)) \\approx O(1)$ time.",
        "Store all friendships in a flat text file.",
        "Dijkstra's algorithm."
      ],
      answerIdx: 1,
      debrief: "Disjoint Set Union with path compression and rank union solves dynamic equivalence relations in near-constant time ($O(\\alpha(N))$). For all practical purposes on Earth, $\\alpha(N) \\le 4$, providing instantaneous sub-microsecond connectivity checks."
    },
    quests: [
      { id: "dsa-m1-d25-q1", name: "Disjoint Set Union Mathematics: Path Compression & Inverse Ackermann", type: "concept", desc: "Derive the mathematical bounds of the Ackermann function $A(m, n)$ and its inverse $\\alpha(n)$." },
      { id: "dsa-m1-d25-q2", name: "Detective Lab: Profiling the O(N) Degeneration in Naive Union-Find", type: "detective", desc: "Compare execution times of naive union-find vs path-compressed DSU across 1,000,000 sequential union operations." },
      { id: "dsa-m1-d25-q3", name: "Mastery Assignment: Production DisjointSet Engine with Component Counting", type: "assignment", desc: "Build a high-performance `DisjointSet` class tracking cluster sizes, connected component counts, and cycle detection." },
      { id: "dsa-m1-d25-q4", name: "Milestone 4 Gate: Dynamic Connectivity & Priority Queue Suite Delivery", type: "assignment", desc: "Deliver Milestone 4: A validated DSU and PriorityQueue library with verified cycle detection and streaming median capabilities." }
    ]
  },

  // ─── BLOCK 6: Graphs, Shortest Paths & Month 1 Capstone (Days 26–30) ───────────────────────
  {
    day: 26,
    month: 1,
    blockNum: 6,
    title: "Graph Representations: Adjacency List vs Adjacency Matrix & BFS/DFS Connected Components",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Graph Representations & Traversal Topologies)",
    spokenGoal: "Master graph foundations: evaluate Adjacency List ($O(V+E)$ space) vs Adjacency Matrix ($O(V^2)$ space), implement iterative and recursive Breadth-First Search (BFS) and Depth-First Search (DFS), and identify connected components and bipartite graph coloring.",
    conceptInvariant: "Graph Traversal Invariant: In any graph with cycles, a `visited` set or boolean bitset must record visited vertex IDs *before* exploring neighbors. Failing to mark visited status upon queue insertion in BFS causes duplicate node enqueueing and exponential memory blowouts.",
    failureMode: "Marking a node as visited *after* popping it from the BFS queue rather than *when adding it* to the queue. Multiple neighbors enqueue the same node dozens of times, causing the queue size to explode exponentially ($O(B^D)$) and crashing with OOM.",
    tryItFriction: "Build a Graph BFS traversal in TypeScript that detects if an undirected graph is Bipartite (2-colorable) using two-color alternate assignment (`0` vs `1`), returning false immediately if any neighbor has the same color.",
    socraticHints: [
      "In BFS, when should you mark a node as `visited`?",
      "The exact moment you push it into the queue!",
      "If you wait until you pop it, other nodes in the same level will see it as unvisited and push duplicate copies of it into the queue."
    ],
    situationalPuzzle: {
      scenario: "A developer builds a web crawler graph traversing 1,000,000 URLs using BFS. After crawling 50,000 pages, the server crashes with out-of-memory. Heap analysis reveals 40,000,000 duplicate URL objects queued in the FIFO queue. Why did duplicate URLs overwhelm the queue?",
      options: [
        "The Internet has too many websites.",
        "The crawler marked URLs as 'visited' only when popping them from the queue, allowing thousands of pages linking to common URLs (like 'index.html' or 'privacy.html') to enqueue duplicate copies before the first copy was processed. Marking visited upon enqueue prevents duplicates.",
        "BFS cannot be used for web crawling.",
        "The server port was blocked."
      ],
      answerIdx: 1,
      debrief: "In BFS, nodes must be marked visited immediately upon being enqueued. If marking is delayed until node dequeuing, all concurrent neighbors pointing to that node will enqueue duplicate entries, causing exponential queue explosion."
    },
    quests: [
      { id: "dsa-m1-d26-q1", name: "Graph Representations: Adjacency List vs Matrix Space/Time Trade-offs", type: "concept", desc: "Compare memory footprints, edge existence checks ($O(1)$ vs $O(degree)$), and sparse vs dense graph suitability." },
      { id: "dsa-m1-d26-q2", name: "Detective Lab: Fixing the BFS Queue Duplicate Enqueue Explosion", type: "detective", desc: "Profile a memory-exploding BFS crawler, identify late visited-marking, and fix the timing to cap memory at $O(V)$." },
      { id: "dsa-m1-d26-q3", name: "Mastery Assignment: Graph Traversal Suite with Bipartite Coloring & Connected Components", type: "assignment", desc: "Implement adjacency list graph representations with BFS shortest-hops, DFS component counting, and 2-color bipartite validation." },
      { id: "dsa-m1-d26-q4", name: "Production Incident Lab: Infinite DFS Loop in Circular Dependency Graph", type: "detective", desc: "Fix an issue where a package dependency resolver hung indefinitely on circular package dependencies due to missing cycle guards." }
    ]
  },
  {
    day: 27,
    month: 1,
    blockNum: 6,
    title: "Directed Acyclic Graphs (DAGs): Topological Sort (Kahn's In-Degree BFS & DFS Post-Order) & Cycle Detection",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (DAG Dependencies & Topological Ordering)",
    spokenGoal: "Engineer dependency resolution engines: master Directed Acyclic Graphs (DAGs), implement Topological Sorting using Kahn's In-Degree Algorithm (BFS queue of 0-in-degree nodes) and DFS Reverse Post-Order (3-color state cycle detection), and build build-system task schedulers.",
    conceptInvariant: "DAG Dependency Invariant: A directed graph possesses a valid topological ordering if and only if it contains NO directed cycles. If Kahn's algorithm terminates and the count of processed nodes is $< V$, the graph contains at least one cycle and cannot be topologically sorted.",
    failureMode: "Using a naive 2-state boolean visited array (`visited[u]`) to detect cycles in a directed graph with DFS, falsely flagging cross-edges (nodes visited in an earlier independent branch) as illegal cycles.",
    tryItFriction: "Implement a build task orchestrator using Kahn's algorithm: calculate `inDegree` for each task, enqueue all 0-in-degree tasks, process dependencies, and detect if a circular build dependency exists.",
    socraticHints: [
      "Why does directed cycle detection require 3 states (White, Gray, Black) rather than a simple boolean visited flag?",
      "Because visiting a node that is already completed (Black, in another branch) is completely legal in a DAG!",
      "A cycle exists if and only if you encounter a Gray node (a node currently on the active recursion call stack)."
    ],
    situationalPuzzle: {
      scenario: "A cloud build system (like Turborepo or Bazel) compiles 500 packages. Package A depends on B, B depends on C, and C accidentally adds an import to A. A junior developer's build script runs forever without terminating. How does the build orchestrator detect circular dependencies and report the exact cyclic path?",
      options: [
        "Timeout the build after 10 minutes.",
        "Run Kahn's Topological Sort Algorithm: Track in-degrees of all packages. If the number of packages processed is less than 500 when the 0-in-degree queue empties, a cycle exists. Trace back-edges in the remaining non-zero in-degree subgraph to identify the cycle.",
        "Compile all packages in random order.",
        "Delete package C."
      ],
      answerIdx: 1,
      debrief: "Kahn's algorithm decrements neighbor in-degrees as dependencies are satisfied. If circular dependencies exist, those nodes never reach 0 in-degree and remain un-popped, mathematically proving the existence of a dependency deadlock."
    },
    quests: [
      { id: "dsa-m1-d27-q1", name: "DAG Mathematics: Topological Ordering Proof & 3-Color DFS States", type: "concept", desc: "Map formal proofs: Unvisited (0 / White), Active Call Stack (1 / Gray), and Finished (2 / Black) cycle detection." },
      { id: "dsa-m1-d27-q2", name: "Detective Lab: Uncovering the False Positive Cycle in a Directed Graph", type: "detective", desc: "Fix a directed graph validator that falsely flagged cross-edges as cycles because it used a single boolean visited flag." },
      { id: "dsa-m1-d27-q3", name: "Mastery Assignment: Enterprise Build System Task DAG Scheduler", type: "assignment", desc: "Build a topological task runner in TypeScript that compiles packages in parallel batches of zero-in-degree dependencies." },
      { id: "dsa-m1-d27-q4", name: "Production Incident Lab: Circular Package Dependency Deadlocking Production CI", type: "detective", desc: "Diagnose an enterprise CI pipeline deadlock where an accidental circular import caused build runners to hang indefinitely." }
    ]
  },
  {
    day: 28,
    month: 1,
    blockNum: 6,
    title: "Graph Shortest Paths: Dijkstra's Algorithm with Min-Heap, Non-Negative Weight Invariants & Edge Relaxation",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Shortest Path Physics & Edge Relaxation)",
    spokenGoal: "Master single-source shortest path routing: engineer Dijkstra's Algorithm using a Min-Heap priority queue, understand the fundamental edge relaxation condition ($dist[v] > dist[u] + weight$), prove why Dijkstra fails on negative edge weights, and achieve $O((V + E) \\log V)$ performance.",
    conceptInvariant: "Non-Negative Weight Invariant: Dijkstra's algorithm relies on the greedy property that once a node with minimum provisional distance is popped from the priority queue, its shortest path is final and immutable. This invariant holds IF AND ONLY IF all edge weights are non-negative ($w(u, v) \\ge 0$).",
    failureMode: "Running Dijkstra's algorithm on a graph containing negative edge weights, causing the greedy assumption to fail and returning incorrect routing distances, or triggering infinite loops in graphs with negative cycles.",
    tryItFriction: "Implement Dijkstra's Algorithm from scratch using a Min-Heap, maintaining an array of distances `dist[]` initialized to $\\infty$, relaxing edges, and reconstructing the exact shortest path from source to destination.",
    socraticHints: [
      "What is edge relaxation in shortest path algorithms?",
      "Testing if `dist[v] > dist[u] + weight(u, v)`. If yes, update `dist[v] = dist[u] + weight(u, v)` and push `(dist[v], v)` into the Min-Heap!",
      "If you pop a node whose popped distance is greater than the current `dist[u]`, skip it immediately (stale entry optimization)."
    ],
    situationalPuzzle: {
      scenario: "A ride-sharing navigation app routes drivers across a road network of 2,000,000 intersections. Running Dijkstra naively pushes relaxed nodes into a priority queue without checking for stale entries. The priority queue accumulates 15,000,000 redundant entries, causing memory exhaustion and slow routing. What one-line optimization in Dijkstra eliminates stale node processing?",
      options: [
        "Delete the priority queue.",
        "Add stale entry check: `if (d > dist[u]) continue;` immediately upon popping from the priority queue. This discards previously queued longer paths in $O(1)$ time without exploring their neighbors.",
        "Cap the road network to 1,000 intersections.",
        "Use BFS."
      ],
      answerIdx: 1,
      debrief: "Since priority queues rarely support efficient decrease-key operations in standard libraries, relaxed nodes are pushed as duplicates. Adding `if (d > dist[u]) continue;` skips stale entries instantly, keeping runtime at $O((V + E) \\log V)$."
    },
    quests: [
      { id: "dsa-m1-d28-q1", name: "Dijkstra's Algorithm Mathematical Proof & Min-Heap Complexity", type: "concept", desc: "Formally prove the greedy choice property and derive the time complexity $O((V + E) \\log V)$." },
      { id: "dsa-m1-d28-q2", name: "Detective Lab: Why Dijkstra Fails on Negative Weights", type: "detective", desc: "Construct a 3-node counterexample demonstrating why Dijkstra produces incorrect results on graphs with negative edges." },
      { id: "dsa-m1-d28-q3", name: "Mastery Assignment: High-Performance Routing Engine with Path Reconstruction", type: "assignment", desc: "Build an optimized Dijkstra router returning shortest distances, full path node sequences, and alternative route bounds." },
      { id: "dsa-m1-d28-q4", name: "Production Incident Lab: Network Packet Routing Loop on Zero-Weight Edges", type: "detective", desc: "Fix an issue where a graph containing multiple 0-weight edges triggered a cyclic infinite relaxation loop in an un-guarded router." }
    ]
  },
  {
    day: 29,
    month: 1,
    blockNum: 6,
    title: "Dynamic Programming 1D Foundations: Memoization vs Tabulation, House Robber, Coin Change & State Compression",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Optimal Substructure & Overlapping Subproblems)",
    spokenGoal: "Master Dynamic Programming foundations: understand the two hallmarks of DP (Optimal Substructure and Overlapping Subproblems), compare Top-Down Memoization with Bottom-Up Tabulation, solve House Robber, Coin Change, and Longest Increasing Subsequence, and compress space from $O(N)$ to $O(1)$.",
    conceptInvariant: "State Space Compression Invariant: If a recurrence relation $dp[i]$ depends only on a fixed number of preceding states ($dp[i] = f(dp[i-1], dp[i-2])$), the full $O(N)$ array can be compressed into $O(1)$ scalar variables, eliminating heap allocations and cache misses.",
    failureMode: "Solving the Fibonacci or House Robber problem using naive recursion without memoization, generating an $O(2^N)$ binary recursion tree that requires $2^{50} \\approx 1.12 \\times 10^{15}$ operations and freezes the server forever.",
    tryItFriction: "Solve the Coin Change problem ($dp[amount] = \min(dp[amount - coin] + 1)$) using bottom-up tabulation, initializing the DP table to $\\infty$ and proving why greedy choices (taking the largest coin first) fail on non-canonical currency denominations (e.g. coins `[1, 3, 4]`, amount 6).",
    socraticHints: [
      "Why does a greedy algorithm fail on Coin Change with coins `[1, 3, 4]` and amount 6?",
      "Greedy takes 4 first, leaving 2, which requires two 1s: $4 + 1 + 1 = 3$ coins!",
      "Dynamic programming checks all subproblems and finds $3 + 3 = 6$ using only 2 coins."
    ],
    situationalPuzzle: {
      scenario: "A payment gateway calculates minimum processing fees using dynamic programming. An intern writes a bottom-up DP solution allocating `new Array(10,000,000)` on every API transaction. The Node.js service experiences catastrophic GC pauses and crashes with Out-Of-Memory under load. The recurrence relation is $dp[i] = \min(dp[i-1], dp[i-2]) + cost[i]$. How does a Staff Engineer fix this?",
      options: [
        "Increase the V8 max heap size.",
        "Apply Space Compression: Because $dp[i]$ only depends on the previous two values ($dp[i-1]$ and $dp[i-2]$), replace the 10,000,000-element array with two local scalar variables (`prev1`, `prev2`), reducing memory from 80 MB to $O(1)$ zero-allocation registers.",
        "Disable the fee calculation.",
        "Switch to top-down recursion."
      ],
      answerIdx: 1,
      debrief: "When a recurrence relation only references a fixed window of preceding states, allocating a full array is wasteful. Compressing the state into scalar variables reduces space from $O(N)$ to $O(1)$ with zero GC impact."
    },
    quests: [
      { id: "dsa-m1-d29-q1", name: "Dynamic Programming Foundations: Subproblem DAGs & State Formulations", type: "concept", desc: "Map how dynamic programming transforms exponential recursion trees into Directed Acyclic Graphs (DAGs) of states." },
      { id: "dsa-m1-d29-q2", name: "Detective Lab: Why Greedy Fails on Non-Canonical Coin Systems", type: "detective", desc: "Analyze currency systems where greedy choice fails, and write an optimal DP solver returning coin counts and selected coin lists." },
      { id: "dsa-m1-d29-q3", name: "Mastery Assignment: Longest Increasing Subsequence (LIS) in O(N log N)", type: "assignment", desc: "Implement LIS using Patience Sorting and binary search (`bisect_left`) to achieve $O(N \\log N)$ time complexity." },
      { id: "dsa-m1-d29-q4", name: "Production Incident Lab: Integer Overflow in DP Table Initialization", type: "detective", desc: "Fix an overflow bug where initializing DP arrays to `Number.MAX_VALUE` caused `dp[i] + 1` to become negative or Infinity." }
    ]
  },
  {
    day: 30,
    month: 1,
    blockNum: 6,
    title: "Month 1 Capstone Viva Gate: AlgoCore High-Throughput In-Memory Index & Routing Engine",
    stageName: "Stage 4: Autonomous Production Defense",
    stageNum: 4,
    pedagogicalRole: "Autonomous Execution (Month 1 Capstone Viva Defense)",
    spokenGoal: "Defend the Month 1 Capstone: present AlgoCore, an ultra-fast in-memory routing and indexing platform combining cache-conscious arrays, monotonic window processors, an $O(1)$ composite LRU/LFU cache, and a Dijkstra routing graph engine before the senior architectural review board.",
    conceptInvariant: "AlgoCore Master Contract: The engine must satisfy four strict mathematical SLAs: (1) In-memory LRU cache hit/eviction in $< 50$ nanoseconds ($O(1)$), (2) Graph route discovery across 100,000 edges in $< 15$ milliseconds ($O((V+E) \\log V)$), (3) Zero memory allocation during streaming window queries, and (4) Strict Big-O compliance verified by automated benchmark assertion suites.",
    failureMode: "Failing the Capstone viva by using pointer-chasing linked lists in the hot loop, experiencing call stack overflow on deep graphs, or suffering memory allocation spikes during window queries.",
    tryItFriction: "Subject AlgoCore to a live adversarial review: inject 1,000,000 streaming events, verify $O(1)$ LRU eviction order, trigger graph edge relaxations across a massive synthetic road network, and defend every algorithmic trade-off.",
    socraticHints: [
      "What distinguishes a junior LeetCode solver from a Staff Algorithmic Systems Engineer?",
      "A junior developer memorizes puzzle tricks; a Staff Engineer analyzes hardware memory hierarchies, amortized invariants, cache locality, and zero-allocation execution paths!",
      "Defend every choice using concrete Big-O proofs, memory benchmarks, and low-latency system principles."
    ],
    situationalPuzzle: {
      scenario: "During the Month 1 Capstone Viva Defense, the architectural committee asks: 'Your AlgoCore platform routes delivery vehicles using Dijkstra with a priority queue. If the road network experiences dynamic traffic updates where some edge weights change every 100ms, how does AlgoCore update existing edge weights without rebuilding the entire priority queue from scratch?' How do you defend your architecture?",
      options: [
        "Tell the board that road networks cannot change dynamically.",
        "AlgoCore uses the Lazy Insertion pattern: when an edge weight improves, push the new `(new_dist, node)` tuple into the Min-Heap without modifying existing entries. When popping from the heap, discard any popped node if its popped distance is greater than the current `dist[node]`. This supports dynamic updates in $O(\\log V)$ time with zero decrease-key overhead.",
        "Rebuild the graph from scratch on every vehicle tick.",
        "Use linear search over an array."
      ],
      answerIdx: 1,
      debrief: "Standard heaps do not support efficient $O(1)$ decrease-key. Lazy insertion pushes updated distances and discards stale entries upon pop in $O(1)$ time, maintaining optimal $O((V+E) \\log V)$ performance under dynamic streaming updates."
    },
    quests: [
      { id: "dsa-m1-d30-q1", name: "AlgoCore Platform Architecture & Algorithmic Contract Documentation", type: "concept", desc: "Document the formal specification, data structure topologies, and asymptotic bounds of AlgoCore." },
      { id: "dsa-m1-d30-q2", name: "Adversarial Lab: Live Stress Testing Across 1M Graph Operations", type: "detective", desc: "Stress-test AlgoCore under heavy streaming loads, asserting zero memory leaks and sub-millisecond routing response times." },
      { id: "dsa-m1-d30-q3", name: "Mastery Assignment: AlgoCore Integration Benchmark & Telemetry Suite", type: "assignment", desc: "Implement end-to-end telemetry tracking p50, p99, and p99.9 latency percentiles across all algorithmic components." },
      { id: "dsa-m1-d30-q4", name: "Month 1 Capstone Viva Gate: AlgoCore Live Oral Architectural Defense", type: "assignment", desc: "Defend AlgoCore live before the Senior Architectural Review Board, proving mastery of contiguous memory, Big-O, and routing." }
    ]
  }
];

export const DSA_MONTH_2_SPECS: MasterclassDaySpec[] = [
  // ─── BLOCK 7: Advanced Graph Algorithms & Network Topologies (Days 31–35) ─────────────────
  {
    day: 31,
    month: 2,
    blockNum: 7,
    title: "Minimum Spanning Trees (MST): Kruskal's (DSU) vs Prim's Algorithm & Cut Property Proofs",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Cut Property & Greedy Spanning Trees)",
    spokenGoal: "Master graph optimization: understand the fundamental Cut Property of graphs, implement Kruskal's Algorithm using Disjoint Set Union (DSU) in $O(E \\log E)$ time, implement Prim's Algorithm using Min-Heaps in $O((V + E) \\log V)$ time, and compare sparse vs dense graph performance.",
    conceptInvariant: "Cut Property Invariant: For any cut in a connected undirected graph, the minimum-weight edge that crosses the cut is guaranteed to belong to some Minimum Spanning Tree (MST). Both Kruskal's and Prim's algorithms are greedy realizations of the Cut Property.",
    failureMode: "Using Prim's algorithm with an adjacency matrix on a massive sparse graph of 100,000 nodes and 200,000 edges ($O(V^2)$), consuming 40 GB of RAM when Kruskal's solves it in 15MB and 80 milliseconds.",
    tryItFriction: "Implement Kruskal's Algorithm in TypeScript: sort all edges by weight, iterate through edges, and use DSU with path compression to add edges that do not form a cycle until exactly $V - 1$ edges are selected.",
    socraticHints: [
      "When should you choose Kruskal's vs Prim's algorithm for MST?",
      "Use Kruskal's for sparse graphs ($E \\ll V^2$) because sorting edges is fast!",
      "Use Prim's (with Fibonacci/Min-Heap) for dense graphs ($E \\approx V^2$) where edge count approaches complete connectivity."
    ],
    situationalPuzzle: {
      scenario: "A telecommunications infrastructure company needs to lay optical fiber cables connecting 5,000 remote radio towers with minimal total cable length. The network has 15,000 possible candidate links (a sparse graph). The junior engineer builds an adjacency matrix and runs a nested-loop Prim's algorithm. The script takes 25 seconds. How does a Staff Algorithmist reduce this to under 10 milliseconds?",
      options: [
        "Delete half of the radio towers.",
        "Deploy Kruskal's Algorithm with Disjoint Set Union (DSU): Sort the 15,000 edges in $O(E \\log E)$ time and greedily unite disjoint sets. On sparse graphs, this completes in a few milliseconds with tiny memory footprint.",
        "Use BFS.",
        "Use a genetic algorithm."
      ],
      answerIdx: 1,
      debrief: "Kruskal's algorithm shines on sparse graphs because sorting $E$ edges takes minimal time ($15,000 \\log 15,000 \\approx 200,000$ operations), and DSU operations are near $O(1)$. It avoids the $O(V^2)$ overhead of adjacency matrix Prim's."
    },
    quests: [
      { id: "dsa-m2-d31-q1", name: "The Cut Property & Minimum Spanning Tree Mathematical Proofs", type: "concept", desc: "Write out the formal mathematical proof of the Cut Property and prove why greedy selection never traps the MST in suboptimal local minima." },
      { id: "dsa-m2-d31-q2", name: "Detective Lab: Profiling Kruskal vs Prim on Sparse and Dense Graphs", type: "detective", desc: "Benchmark Kruskal's (DSU) vs Prim's (Min-Heap) across sparse graphs ($E=2V$) and dense graphs ($E=V^2/4$), measuring crossover points." },
      { id: "dsa-m2-d31-q3", name: "Mastery Assignment: High-Scale Kruskal MST Engine with Disjoint Sets", type: "assignment", desc: "Implement Kruskal's algorithm supporting edge-weight deduplication, disconnected forest spanning trees, and total weight verification." },
      { id: "dsa-m2-d31-q4", name: "Production Incident Lab: Fiber Route Disconnection on Duplicate Minimum Edges", type: "detective", desc: "Fix an issue where multiple edges with identical weights caused an un-guarded MST selector to terminate with $< V-1$ edges." }
    ]
  },
  {
    day: 32,
    month: 2,
    blockNum: 7,
    title: "Negative Weight Shortest Paths: Bellman-Ford Algorithm, SPFA & Arbitrage Negative Cycle Detection",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Dynamic Graph Relaxation & Negative Cycles)",
    spokenGoal: "Solve routing in graphs with negative weights: master the Bellman-Ford algorithm ($O(V \\times E)$), understand the Shortest Path Faster Algorithm (SPFA) queue optimization, and implement real-time currency arbitrage detection by identifying negative cycles in logarithmic exchange rate graphs.",
    conceptInvariant: "Negative Cycle Invariant: In a graph without negative cycles, the shortest simple path contains at most $V - 1$ edges. Therefore, relaxing all edges $V - 1$ times finds all shortest paths. If a further relaxation occurs on the $V$-th iteration, a negative weight cycle exists.",
    failureMode: "Attempting to detect foreign exchange arbitrage using Dijkstra's algorithm, failing because currency triangular arbitrage requires multiplying exchange rates ($R_1 \\times R_2 \\times R_3 > 1$), which transforms via $-\\log(R)$ into negative weight cycles.",
    tryItFriction: "Transform a currency exchange rate matrix into a directed graph using $w(u, v) = -\\ln(\\text{rate}(u, v))$ and run Bellman-Ford to detect profitable triangular currency arbitrage cycles.",
    socraticHints: [
      "How do you transform currency multiplication ($r_1 \\times r_2 \\times r_3 > 1$) into an additive shortest path problem?",
      "Take the negative natural logarithm! $-\\ln(r_1 \\times r_2 \\times r_3) = -\\ln(r_1) - \\ln(r_2) - \\ln(r_3) < 0$.",
      "Finding a profitable arbitrage cycle is mathematically identical to finding a negative weight cycle in the logarithmic graph!"
    ],
    situationalPuzzle: {
      scenario: "A quantitative trading fund monitors 50 global currency pairs. The quantitative researcher wants to execute triangular arbitrage whenever exchanging USD $\\to$ EUR $\\to$ JPY $\\to$ USD yields $> 1.000$ USD. A software engineer suggests running Dijkstra. Why does Dijkstra fail, and what algorithm must be used?",
      options: [
        "Dijkstra is too slow.",
        "Dijkstra assumes non-negative edge weights and fails when edge weights are negative. Arbitrage requires finding negative cycles in a $-\\ln(\\text{rate})$ graph. The Bellman-Ford algorithm or SPFA must be used because they correctly handle negative weights and detect negative cycles.",
        "Dijkstra only works on undirected graphs.",
        "Trading requires machine learning, not graphs."
      ],
      answerIdx: 1,
      debrief: "By taking $-\\ln(\\text{rate})$, multiplying exchange rates turns into adding weights, and profitable opportunities become negative cycles. Bellman-Ford relaxes edges $V$ times; any edge that can still be relaxed on the $V$-th pass proves the existence of an arbitrage cycle."
    },
    quests: [
      { id: "dsa-m2-d32-q1", name: "Bellman-Ford Dynamic Programming Proof & The Negative Cycle Principle", type: "concept", desc: "Analyze the DP recurrence of Bellman-Ford ($dp[k][v] = \min(dp[k-1][v], dp[k-1][u] + w)$) and prove cycle detection." },
      { id: "dsa-m2-d32-q2", name: "Detective Lab: Profiling SPFA Worst-Case O(V * E) Degeneration", type: "detective", desc: "Construct a grid graph where the Shortest Path Faster Algorithm (SPFA) degrades to $O(V \\times E)$ due to cyclic queue churn." },
      { id: "dsa-m2-d32-q3", name: "Mastery Assignment: Quantitative Currency Arbitrage Detection Engine", type: "assignment", desc: "Build an arbitrage detector in TypeScript converting live exchange rates via $-\\ln(x)$ and extracting profitable cycle paths." },
      { id: "dsa-m2-d32-q4", name: "Production Incident Lab: Infinite Loop in Unbounded Arbitrage Cycle Execution", type: "detective", desc: "Triage a live trading bot incident where discovering an infinite negative cycle caused an uncontrolled recursive execution loop." }
    ]
  },
  {
    day: 33,
    month: 2,
    blockNum: 7,
    title: "All-Pairs Shortest Paths: Floyd-Warshall Algorithm (O(V^3) DP Matrix) & Transitive Closure",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (3D Dynamic Programming & Dense Path Matrices)",
    spokenGoal: "Master dense all-pairs routing: implement the Floyd-Warshall algorithm in $O(V^3)$ time, understand the intermediate node dynamic programming recurrence $dist[i][j] = \min(dist[i][j], dist[i][k] + dist[k][j])$, compute Transitive Closure (reachability matrix), and reconstruct exact path sequences.",
    conceptInvariant: "Intermediate Node Invariant: In the $k$-th iteration of Floyd-Warshall, $dist[i][j]$ represents the shortest path from $i$ to $j$ using ONLY vertices in the subset $\\{1, 2, ..., k\\}$ as intermediate hops. The outer loop $k$ MUST iterate before loops $i$ and $j$ to preserve the optimal substructure invariant.",
    failureMode: "Placing the $k$ loop inside the $i$ and $j$ loops (`for i ... for j ... for k`), violating the DP intermediate vertex invariant and producing completely incorrect shortest path calculations.",
    tryItFriction: "Implement Floyd-Warshall with path reconstruction: maintain a `next[i][j]` matrix that records the intermediate vertex to step toward, allowing full path reconstruction in $O(H)$ time.",
    socraticHints: [
      "Why must the intermediate vertex loop `k` be the OUTERMOST loop in Floyd-Warshall?",
      "Because $dist[i][j]$ at step $k$ depends on values computed at step $k-1$ for all pairs $(i, j)$!",
      "If $k$ is inside, you try to use vertex $k$ before all intermediate paths through $k-1$ have been globally established."
    ],
    situationalPuzzle: {
      scenario: "A cloud network topology planner computes latency matrices between 300 datacenter clusters. A developer implements Floyd-Warshall, but writes the loops as `for (i = 0; ...) for (j = 0; ...) for (k = 0; ...)`. The latency tests fail: paths with 3 hops report higher latencies than direct 1-hop routes that were actually slower. What was the algorithmic defect?",
      options: [
        "The computer ran out of memory.",
        "Loop Order Invariant Violation: In Floyd-Warshall, the intermediate vertex loop `k` must be the outermost loop. The state transition $D^k[i, j] = \min(D^{k-1}[i, j], D^{k-1}[i, k] + D^{k-1}[k, j])$ requires that step $k-1$ is complete for all pairs before considering vertex $k$.",
        "Floyd-Warshall does not work for datacenters.",
        "The network had too many edges."
      ],
      answerIdx: 1,
      debrief: "Floyd-Warshall is a dynamic programming algorithm where state $k$ builds on state $k-1$. Placing $k$ on the outside guarantees that all sub-paths using intermediate nodes up to $k-1$ are fully optimized before considering node $k$."
    },
    quests: [
      { id: "dsa-m2-d33-q1", name: "Floyd-Warshall DP Proof & Transitive Closure Reachability Matrices", type: "concept", desc: "Derive the mathematical formulation of the reachability matrix using bitwise OR and AND operations." },
      { id: "dsa-m2-d33-q2", name: "Detective Lab: Fixing the Scrambled Loop Order in a Routing Matrix", type: "detective", desc: "Audit a broken all-pairs routing engine, fix the loop nesting order, and verify against Dijkstra runs across all nodes." },
      { id: "dsa-m2-d33-q3", name: "Mastery Assignment: Floyd-Warshall Engine with Path Sequence Reconstruction", type: "assignment", desc: "Build an all-pairs shortest path engine in TypeScript supporting negative cycle detection and full step-by-step path recovery." },
      { id: "dsa-m2-d33-q4", name: "Production Incident Lab: Int32 Overflow Turning Large Distance into Negative Infinity", type: "detective", desc: "Fix an overflow issue where `dist[i][k] + dist[k][j]` with $\\infty$ values wrapped around to negative numbers in 32-bit math." }
    ]
  },
  {
    day: 34,
    month: 2,
    blockNum: 7,
    title: "Strongly Connected Components (SCCs): Tarjan's Low-Link Value Algorithm & Kosaraju's 2-Pass DFS",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Directed Connectivity & Low-Link Values)",
    spokenGoal: "Decompose complex directed networks: master Strongly Connected Components (SCCs), implement Tarjan's Low-Link Value Algorithm using a single DFS pass with node discovery timestamps, implement Kosaraju's Two-Pass DFS algorithm on reversed graphs, and condense directed networks into DAGs.",
    conceptInvariant: "Low-Link Invariant: In Tarjan's algorithm, `low[u]` represents the smallest discovery timestamp reachable from $u$ through its DFS subtree and at most one back-edge. A node $u$ is the root of an SCC if and only if `low[u] == disc[u]`. All nodes currently on the active stack above $u$ belong to $u$'s SCC.",
    failureMode: "Updating a node's low-link value with a neighbor that has already been assigned to an earlier SCC (a cross-edge node no longer on the stack), corrupting SCC boundary calculations.",
    tryItFriction: "Implement Tarjan's SCC algorithm from scratch, tracking `disc[]`, `low[]`, an active `stack`, and an `onStack[]` boolean array, decomposing a 10,000-node microservice dependency graph into isolated SCC components.",
    socraticHints: [
      "Why must Tarjan's algorithm check `onStack[v]` before updating `low[u] = min(low[u], disc[v])`?",
      "Because node $v$ might be a cross-edge to a node that was already popped and assigned to a different SCC!",
      "Only back-edges to nodes *currently on the stack* belong to the current strongly connected cycle."
    ],
    situationalPuzzle: {
      scenario: "An enterprise microservices platform has 800 services. The platform team wants to identify clusters of services that mutually depend on each other (circular dependency loops) so they can refactor them into isolated domains. What algorithm condenses the directed dependency graph into a DAG of Strongly Connected Components in linear $O(V + E)$ time?",
      options: [
        "Breadth-First Search (BFS).",
        "Tarjan's Strongly Connected Components Algorithm: A single DFS pass tracking discovery times and low-link values partitions the services into SCC clusters and condenses the inter-cluster dependencies into an acyclic DAG.",
        "Floyd-Warshall algorithm.",
        "Binary search."
      ],
      answerIdx: 1,
      debrief: "Tarjan's algorithm identifies all Strongly Connected Components in a single $O(V + E)$ DFS pass. Condensing each SCC into a single super-node transforms any complex cyclical directed graph into a clean Directed Acyclic Graph (DAG)."
    },
    quests: [
      { id: "dsa-m2-d34-q1", name: "Tarjan's vs Kosaraju's Algorithm: Low-Link Math vs Transpose Graphs", type: "concept", desc: "Compare Tarjan's single-pass DFS stack approach with Kosaraju's two-pass DFS on the transposed graph $G^T$." },
      { id: "dsa-m2-d34-q2", name: "Detective Lab: The Corrupted Low-Link Cross-Edge Update Bug", type: "detective", desc: "Fix an SCC implementation that merged unrelated components because it failed to check `onStack` before updating low-links." },
      { id: "dsa-m2-d34-q3", name: "Mastery Assignment: Microservice Architecture Dependency Condensation Engine", type: "assignment", desc: "Build a TypeScript tool that parses package dependencies, computes SCCs via Tarjan's, and outputs a condensed DAG." },
      { id: "dsa-m2-d34-q4", name: "Production Incident Lab: Deep Recursion Stack Overflow in Massive Web Graph SCC", type: "detective", desc: "Refactor Tarjan's algorithm from language recursion to an explicit heap-allocated DFS stack to process a 500,000-node graph." }
    ]
  },
  {
    day: 35,
    month: 2,
    blockNum: 7,
    title: "Eulerian Paths & Bipartite Matching: Hierholzer's Algorithm, Hopcroft-Karp & Milestone 6: Distributed Graph Topology Engine",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Network Flow & Milestone 6 Gate)",
    spokenGoal: "Deliver Milestone 6: master Eulerian circuits (Hierholzer's Algorithm visiting every edge exactly once), Maximum Bipartite Matching (Hopcroft-Karp algorithm in $O(E \\sqrt{V})$ time), and construct an enterprise Distributed Graph Topology Engine.",
    conceptInvariant: "Eulerian Circuit Invariant: An undirected connected graph contains an Eulerian Circuit (visiting every edge exactly once and returning to start) if and only if EVERY vertex has an even degree. A directed graph has an Eulerian Circuit if and only if every vertex satisfies $inDegree(u) == outDegree(u)$.",
    failureMode: "Attempting to find an Eulerian circuit using standard DFS without removing traversed edges, resulting in infinite loops across cycles and failing to cover disjoint edge loops.",
    tryItFriction: "Implement Hierholzer's algorithm to reconstruct an itinerary from airline flight tickets (`[['JFK', 'SFO'], ['SFO', 'ATL'], ['ATL', 'JFK']]`), traversing every ticket edge in lexicographical order.",
    socraticHints: [
      "How does Hierholzer's algorithm splice sub-tours together?",
      "Follow unused edges until stuck at a node with no outgoing edges. Push that node to the result stack!",
      "Backtrack and explore remaining edges from prior nodes; reversing the result stack yields the complete Eulerian path."
    ],
    situationalPuzzle: {
      scenario: "A ride-sharing platform needs to assign 10,000 drivers to 10,000 ride requests. Each driver is only willing to accept rides within a 5-mile radius (a bipartite graph). The platform needs to find the maximum possible number of matched driver-rider pairs in under 100 milliseconds. What algorithm provides optimal bipartite matching?",
      options: [
        "A greedy first-come first-served assignment.",
        "Hopcroft-Karp Algorithm: Combines BFS and DFS to find multiple shortest augmenting paths simultaneously, computing the maximum cardinality bipartite matching in optimal $O(E \\sqrt{V})$ time.",
        "Dijkstra's algorithm.",
        "Sort drivers by rating."
      ],
      answerIdx: 1,
      debrief: "Greedy matching traps assignments in suboptimal local matches. The Hopcroft-Karp algorithm finds augmenting paths in phases, swapping matched/unmatched edges to guarantee the maximum global cardinality matching in $O(E \\sqrt{V})$ time."
    },
    quests: [
      { id: "dsa-m2-d35-q1", name: "Eulerian Path Mathematics & Augmenting Path Theorems in Bipartite Matching", type: "concept", desc: "Formulate Euler's 1736 Seven Bridges of Königsberg proof and Berge's Lemma on augmenting paths." },
      { id: "dsa-m2-d35-q2", name: "Detective Lab: Optimizing Greedy Job Dispatching with Hopcroft-Karp", type: "detective", desc: "Compare a naive greedy job assignment algorithm (achieving only 65% match rate) with Hopcroft-Karp (achieving 98% match rate)." },
      { id: "dsa-m2-d35-q3", name: "Mastery Assignment: Hierholzer Flight Itinerary & Hopcroft-Karp Matcher", type: "assignment", desc: "Build an itinerary reconstruction engine and a maximum bipartite matching assignment platform in TypeScript." },
      { id: "dsa-m2-d35-q4", name: "Milestone 6 Gate: Advanced Graph Optimization & Network Topology Engine", type: "assignment", desc: "Deliver Milestone 6: A complete graph engine implementing MST (Kruskal), Arbitrage (Bellman-Ford), SCC (Tarjan), and Bipartite Matching." }
    ]
  },

  // ─── BLOCK 8: Advanced Tree Structures & Range Queries (Days 36–40) ───────────────────────
  {
    day: 36,
    month: 2,
    blockNum: 7,
    title: "Self-Balancing Trees: AVL Trees, Tree Rotations (LL, RR, LR, RL), Height Balance Factor Invariants",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Strict Height Balance & Tree Rotations)",
    spokenGoal: "Master strictly balanced trees: understand AVL tree invariants (balance factor $bf = height(left) - height(right) \\in \\{-1, 0, 1\\}$), implement the 4 fundamental tree rotations (Left-Left, Right-Right, Left-Right, Right-Left), and guarantee strict $O(\\log N)$ search, insert, and deletion.",
    conceptInvariant: "AVL Balance Invariant: For EVERY node in an AVL tree, $|height(left) - height(right)| \\le 1$. If an insertion or deletion causes $|bf| > 1$, a single rotation (LL or RR) or double rotation (LR or RL) restores the balance factor to 0 in $O(1)$ pointer adjustments.",
    failureMode: "Failing to update node heights during tree rotations, causing subsequent ancestor nodes to calculate erroneous balance factors and miss necessary rebalancing rotations.",
    tryItFriction: "Implement Left Rotation and Right Rotation functions from scratch in TypeScript, verifying that in-order traversal ordering is strictly preserved while root height decreases.",
    socraticHints: [
      "When is a double rotation (e.g. Left-Right / LR) required in an AVL tree?",
      "When a node is Left-Heavy ($bf = +2$) but its left child is Right-Heavy ($bf = -1$)!",
      "Perform a Left Rotation on the left child first to convert it to Left-Left, then perform a Right Rotation on the parent node."
    ],
    situationalPuzzle: {
      scenario: "An in-memory database index requires guaranteed maximum search latency. The lead architect rejects standard Red-Black trees in favor of AVL trees. What mathematical characteristic of AVL trees justifies this decision for a read-heavy workload?",
      options: [
        "AVL trees use less memory.",
        "Strict Height Bound: AVL trees enforce a strict height difference $\\le 1$, bounding maximum tree height to $\\approx 1.44 \\log_2 N$. Red-Black trees permit paths to be up to twice as long (height $\\approx 2 \\log_2 N$). AVL trees guarantee faster read lookups.",
        "AVL trees do not require pointers.",
        "Red-Black trees cannot store strings."
      ],
      answerIdx: 1,
      debrief: "Because AVL trees are more rigidly balanced than Red-Black trees ($|bf| \\le 1$ vs 2x path lengths), their tree height is strictly smaller. In read-heavy workloads where lookups vastly outnumber writes, AVL trees provide superior lookup speeds."
    },
    quests: [
      { id: "dsa-m2-d36-q1", name: "AVL Tree Mathematics: Fibonacci Bound & Balance Factor Proofs", type: "concept", desc: "Derive the worst-case minimum node count $N(h) = N(h-1) + N(h-2) + 1$ and prove maximum height $h \\le 1.44 \\log_2 N$." },
      { id: "dsa-m2-d36-q2", name: "Detective Lab: Debugging the Broken Double-Rotation Pointer Flip", type: "detective", desc: "Debug an AVL tree implementation where an LR rotation dropped the inner sub-tree, corrupting search for 20% of keys." },
      { id: "dsa-m2-d36-q3", name: "Mastery Assignment: Self-Balancing AVLTree<T> Implementation", type: "assignment", desc: "Build an `AVLTree<T>` with $O(1)$ height caching, LL/RR/LR/RL rotations, and rebalancing upon both insert and delete." },
      { id: "dsa-m2-d36-q4", name: "Production Incident Lab: Rebalancing Cascade Degenerating Deletion Throughput", type: "detective", desc: "Fix an issue where deleting a node in an AVL tree triggered rotations all the way to the root, optimizing rotation early exits." }
    ]
  },
  {
    day: 37,
    month: 2,
    blockNum: 7,
    title: "Red-Black Trees: 5 Color Invariants, Black-Height Equality, Insertion Recoloring & Rotations",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Black-Height Balance & Amortized O(1) Rebalancing)",
    spokenGoal: "Deconstruct the engine behind `std::map`, `TreeMap`, and Linux kernel `rbtree`: master the 5 Red-Black Tree invariants, prove why the longest path is at most twice the shortest path, implement insertion recoloring and rotations, and understand why Red-Black trees require at most 2 rotations per insert.",
    conceptInvariant: "Black-Height Invariant: Every path from the root to any leaf null pointer must contain the exact same number of Black nodes. Combined with the rule that Red nodes cannot have Red children, this guarantees that no path is more than twice as long as any other path.",
    failureMode: "Violating Invariant 4 (No two consecutive Red nodes) by coloring a newly inserted node Black, which immediately destroys the Black-Height invariant across the entire tree.",
    tryItFriction: "Trace an insertion into a Red-Black tree where the parent and uncle are both Red: execute recoloring (parent and uncle become Black, grandparent becomes Red) and propagate balance checks up to the root.",
    socraticHints: [
      "Why are newly inserted nodes in a Red-Black tree always colored RED by default?",
      "Because adding a Red node never violates the Black-Height invariant (Invariant 5)!",
      "It only potentially violates the 'No two consecutive Red nodes' rule, which is much easier to fix via local recoloring or rotations."
    ],
    situationalPuzzle: {
      scenario: "The Linux kernel uses Red-Black trees (`rbtree`) for its CFS process scheduler, virtual memory area (VMA) tracking, and epoll file descriptors. Why did kernel architects choose Red-Black trees over AVL trees for OS-level data structures?",
      options: [
        "AVL trees cannot be compiled in C.",
        "Write Performance: In Red-Black trees, an insertion requires at most 2 rotations, and deletion at most 3 rotations. AVL trees may require $O(\\log N)$ rotations propagating to the root on deletion. Red-Black trees provide faster writes under heavy churn.",
        "Red-Black trees do not need memory allocation.",
        "Red-Black trees have lower height."
      ],
      answerIdx: 1,
      debrief: "Red-Black trees prioritize faster insertion and deletion. While AVL trees provide slightly faster reads due to stricter height balance, Red-Black trees limit rotations to at most $O(1)$ per modification, making them the standard for general-purpose OS kernels."
    },
    quests: [
      { id: "dsa-m2-d37-q1", name: "Red-Black Tree 5 Invariants & 2-3-4 Tree Isomorphism Proof", type: "concept", desc: "Map Red-Black trees to 2-3-4 B-Trees, demonstrating how Red nodes represent elements grouped in 3-nodes and 4-nodes." },
      { id: "dsa-m2-d37-q2", name: "Detective Lab: Triaging the Black-Height Violation in a Custom Tree", type: "detective", desc: "Inspect a corrupted Red-Black tree, trace paths to leaves with unequal black counts, and repair recoloring logic." },
      { id: "dsa-m2-d37-q3", name: "Mastery Assignment: Production RedBlackTree<T> Implementation", type: "assignment", desc: "Implement `RedBlackTree<K, V>` supporting insert recoloring, case 1/2/3 rotation cascades, and iterator traversals." },
      { id: "dsa-m2-d37-q4", name: "Production Incident Lab: Linux Kernel CFS Scheduler Starvation on Corrupted rbtree", type: "detective", desc: "Simulate a kernel scheduler failure where a concurrent write without locking corrupted the rbtree root color, locking thread dispatch." }
    ]
  },
  {
    day: 38,
    month: 2,
    blockNum: 7,
    title: "Segment Trees I: Segment Tree Construction, Range Sum/Min Queries in O(log N) & Point Updates",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Range Query Trees & Divide-and-Conquer)",
    spokenGoal: "Master range query structures: understand why prefix sum arrays fail on dynamic arrays with updates, construct array-based Segment Trees ($4N$ size bound), implement $O(\\log N)$ Range Sum and Range Minimum queries, and execute $O(\\log N)$ point updates.",
    conceptInvariant: "Segment Tree Decomposition Invariant: A Segment Tree partitions an array into canonical power-of-two intervals. Any arbitrary query interval $[L, R]$ can be decomposed into at most $2 \\log_2 N$ canonical disjoint segments, guaranteeing $O(\\log N)$ query time.",
    failureMode: "Allocating a segment tree array of size $2N$ instead of $4N$. Because a segment tree is a complete binary tree over the next power of two ($2^{\\lceil \\log_2 N \\rceil + 1}$), sizing it at $2N$ causes fatal out-of-bounds index errors on inputs that are not powers of two.",
    tryItFriction: "Build a Segment Tree in TypeScript backed by a flat array `tree[4 * N]`, implementing `build(node, start, end)`, `update(node, start, end, idx, val)`, and `query(node, start, end, L, R)` in $O(\\log N)$ time.",
    socraticHints: [
      "Why is a Segment Tree sized at $4N$ when an array has only $N$ elements?",
      "If $N$ is not a power of two, the tree extends to the next power of two $2^k$. In the worst case ($N = 2^k + 1$), the next power of two is $2^{k+1} \\approx 2N$.",
      "A complete binary tree with $2N$ leaves requires $2(2N) - 1 \\approx 4N$ total nodes."
    ],
    situationalPuzzle: {
      scenario: "A financial exchange stores tick prices for 1,000,000 transactions. The engine needs to support two real-time operations: (1) `updatePrice(index, newPrice)`, and (2) `queryMinPrice(rangeStart, rangeEnd)`. If a flat array is used, updates are $O(1)$ but queries are $O(N)$ (too slow). If a prefix min array is used, queries are $O(1)$ but updates are $O(N)$ (too slow). What data structure achieves $O(\\log N)$ for BOTH operations?",
      options: [
        "A doubly linked list.",
        "Segment Tree: Represents hierarchical intervals in a flat $4N$ array. Both point updates and range minimum queries execute in strict $O(\\log N)$ time, handling thousands of updates and queries per millisecond.",
        "Sort the prices every time.",
        "Store prices in an SQL database."
      ],
      answerIdx: 1,
      debrief: "Prefix arrays provide $O(1)$ queries but require $O(N)$ rebuild on updates. Flat arrays provide $O(1)$ updates but $O(N)$ queries. Segment Trees balance the trade-off, executing both point updates and range queries in optimal $O(\\log N)$ time."
    },
    quests: [
      { id: "dsa-m2-d38-q1", name: "Segment Tree Mathematics: Canonical Interval Decomposition Proof", type: "concept", desc: "Prove mathematically that any interval $[L, R]$ intersects at most 2 nodes per level, bounding queries to $O(\\log N)$." },
      { id: "dsa-m2-d38-q2", name: "Detective Lab: Fixing the 2N Array Out-of-Bounds Segment Tree Crash", type: "detective", desc: "Debug a segment tree that crashed with index out of bounds on array length 100,001, and prove why $4N$ is required." },
      { id: "dsa-m2-d38-q3", name: "Mastery Assignment: Production Range Minimum & Sum SegmentTree Class", type: "assignment", desc: "Implement a generic `SegmentTree<T>` in TypeScript with pluggable merge operators (Sum, Min, Max, GCD)." },
      { id: "dsa-m2-d38-q4", name: "Production Incident Lab: Precision Loss in Floating-Point Range Sum Segment Tree", type: "detective", desc: "Fix an issue where repeatedly adding small floating-point numbers in a segment tree accumulated catastrophic rounding drift." }
    ]
  },
  {
    day: 39,
    month: 2,
    blockNum: 7,
    title: "Segment Trees II: Lazy Propagation for O(log N) Range Interval Updates & Interval Multiplication",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Lazy Propagation & Deferred Computation)",
    spokenGoal: "Scale Segment Trees to range updates: understand why updating an interval $[L, R]$ naively takes $O(N \\log N)$ time, implement Lazy Propagation to defer updates until child intervals are queried, and achieve $O(\\log N)$ range updates and queries simultaneously.",
    conceptInvariant: "Lazy Propagation Invariant: When an update spans an entire segment represented by node $u$, update $u$'s value immediately, store the pending delta in $lazy[u]$, and return. Defer pushing $lazy[u]$ down to children until a subsequent query or update explicitly visits $u$'s subtrees.",
    failureMode: "Calling `pushDown()` on lazy nodes without updating the current node's value or neglecting to propagate the lazy tag to children, causing subsequent queries to return stale pre-update values.",
    tryItFriction: "Implement Lazy Propagation for range additions: add $+10$ to all elements in range $[100, 50,000]$ in an array of $1,000,000$ items, and verify that subsequent range sum queries execute in $< 50$ microseconds.",
    socraticHints: [
      "What is the core intuition behind Lazy Propagation?",
      "Procrastination! Don't do work updating leaf nodes until someone actually asks to read them!",
      "Mark the parent node with a 'lazy' tag recording what needs to be added, and only push it down to children when a query traverses deeper."
    ],
    situationalPuzzle: {
      scenario: "An airline seat pricing platform manages 500,000 seats. During a flash sale, the marketing team applies a promotion: 'Add \$15 discount to all seats between flight index 10,000 and 200,000' (a range update). The current Segment Tree updates every leaf node individually ($190,000 \\times \\log N \\approx 3,600,000$ operations), freezing the pricing API for 800ms. How does a Staff Algorithmist reduce this range update to under 1 millisecond?",
      options: [
        "Cancel the promotion.",
        "Implement Lazy Propagation on the Segment Tree: Instead of updating all 190,000 leaf nodes, update only the $O(\\log N)$ canonical ancestor nodes covering the range, storing a pending $+15$ lazy delta to push down on demand. Range update drops to $O(\\log N)$ time.",
        "Update the seats in a background cron job at midnight.",
        "Use a hash map."
      ],
      answerIdx: 1,
      debrief: "Lazy Propagation prevents updating deep leaves until necessary. Storing pending deltas at canonical ancestor nodes turns an $O(K \\log N)$ range update into a lightning-fast $O(\\log N)$ operation."
    },
    quests: [
      { id: "dsa-m2-d39-q1", name: "Lazy Propagation State Machine: PushDown & PushUp Dynamics", type: "concept", desc: "Trace the state transition lifecycle of lazy tags during nested range updates, overlapping ranges, and interval queries." },
      { id: "dsa-m2-d39-q2", name: "Detective Lab: The Stale Range Sum Query Bug in a Lazy Tree", type: "detective", desc: "Triage a lazy segment tree returning incorrect sums because `pushDown` was not called before querying left/right children." },
      { id: "dsa-m2-d39-q3", name: "Mastery Assignment: LazySegmentTree with Dual Add & Multiply Operations", type: "assignment", desc: "Build an advanced `LazySegmentTree` supporting both range addition and range multiplication modulo $10^9 + 7$." },
      { id: "dsa-m2-d39-q4", name: "Production Incident Lab: Memory Footprint Explosion in Dynamic Lazy Node Trees", type: "detective", desc: "Fix an out-of-memory issue in a sparse pointer-based lazy segment tree by pooling nodes in a flat pre-allocated buffer." }
    ]
  },
  {
    day: 40,
    month: 2,
    blockNum: 7,
    title: "Fenwick Trees (Binary Indexed Tree / BIT): Two's Complement Bit Manipulation (i & -i), Prefix Sums & Milestone 7: Staff Range Query Engine",
    stageName: "Stage 3: Systems Hardening",
    stageNum: 3,
    pedagogicalRole: "High Autonomy (Two's Complement Trees & Milestone 7 Gate)",
    spokenGoal: "Deliver Milestone 7: master Fenwick Trees (Binary Indexed Tree / BIT), understand the two's complement bit trick `i & (-i)` (isolating the Lowest Significant Bit), achieve $O(\\log N)$ prefix sum queries and point updates in an array of size $N$ (requiring $1/4$ the memory of a Segment Tree), and construct a Staff Range Query Engine.",
    conceptInvariant: "Lowest Significant Bit (LSB) Invariant: In a Fenwick Tree, `tree[i]` stores the sum of elements in the half-open interval $(i - LSB(i), i]$, where $LSB(i) = i \\ \\& \\ (-i)$. To compute a prefix sum, peel off LSBs via $i \\mathrel{-}= (i \\ \\& \\ -i)$; to propagate an update, add LSBs via $i \\mathrel{+}= (i \\ \\& \\ -i)$.",
    failureMode: "Indexing a Fenwick Tree starting at index 0. Because $0 \\ \\& \\ (-0) = 0$, calling `i += (i & -i)` on 0 produces an infinite loop and crashes the program immediately. Fenwick Trees MUST use 1-based indexing.",
    tryItFriction: "Implement a Fenwick Tree (BIT) in TypeScript with 1-based indexing, implementing `add(idx, val)` and `query(idx)` in 15 lines of code, and benchmarking its 3x speedup over Segment Trees due to cache efficiency.",
    socraticHints: [
      "Why does `i & (-i)` extract the lowest set bit in two's complement arithmetic?",
      "In two's complement, $-i = \\sim i + 1$. Inverting $i$ flips all bits, and adding 1 ripples a carry bit up to the first set bit!",
      "Bitwise ANDing $i$ with $\\sim i + 1$ cancels out all higher bits, leaving only the lowest set bit."
    ],
    situationalPuzzle: {
      scenario: "A high-frequency algorithmic matching engine requires computing running cumulative order volumes and updating point quantities millions of times per second. A Segment Tree works in $O(\\log N)$ but requires $4N$ memory (16 MB) and pointer/recursion overhead. How does a Staff Systems Engineer achieve $O(\\log N)$ with only $1N$ memory (4 MB) and no recursion?",
      options: [
        "Use a hash table.",
        "Fenwick Tree (Binary Indexed Tree): Uses an iterative flat array of size $N+1$. It performs prefix sum queries and point updates in strict $O(\\log N)$ time using bitwise `i & -i` operations with zero recursion, fitting entirely inside CPU L2 cache.",
        "Use a linked list.",
        "Store volumes in Redis."
      ],
      answerIdx: 1,
      debrief: "A Fenwick Tree requires only $1N$ memory (compared to $4N$ for a Segment Tree) and executes iteratively with fast bitwise operations. Its compact memory layout maximizes CPU L1/L2 cache locality, making it up to 3x faster in practice."
    },
    quests: [
      { id: "dsa-m2-d40-q1", name: "Two's Complement Arithmetic & The Fenwick Tree LSB Theorem", type: "concept", desc: "Derive the mathematical proof of two's complement arithmetic and verify interval coverage across binary representations." },
      { id: "dsa-m2-d40-q2", name: "Detective Lab: Debugging the Zero-Index Infinite Loop in a Fenwick Tree", type: "detective", desc: "Audit a buggy Fenwick Tree that froze when passed index 0, and implement safe 1-based index translation wrappers." },
      { id: "dsa-m2-d40-q3", name: "Mastery Assignment: 2D Fenwick Tree for Matrix Range Sum Queries", type: "assignment", desc: "Build a 2D Binary Indexed Tree supporting $O(\\log N \\log M)$ submatrix sum queries and point updates in flat arrays." },
      { id: "dsa-m2-d40-q4", name: "Milestone 7 Gate: Staff Range Query & Dynamic Tree Engine Delivery", type: "assignment", desc: "Deliver Milestone 7: A unified range query suite featuring Segment Trees (with Lazy Propagation) and Fenwick Trees (1D and 2D)." }
    ]
  },

  // ─── BLOCK 9: String Algorithms & Pattern Matching Automata (Days 41–45) ──────────────────
  {
    day: 41,
    month: 2,
    blockNum: 8,
    title: "Trie (Prefix Tree): Node Topologies, Autocomplete Engines, Wildcard Matching & Radix Tree Compression",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Prefix Trees & Compressed Radix Topologies)",
    spokenGoal: "Engineer search and autocomplete systems: implement a Trie (Prefix Tree), compare array-based children (`next[26]`) vs hash-map children for unicode support, implement prefix autocomplete search and wildcard pattern matching, and compress single-child chains using Radix Trees (Patricia Tries).",
    conceptInvariant: "Prefix Sharing Invariant: In a Trie, all descendants of a node share a common string prefix associated with that node. Lookup and insertion of a key of length $L$ runs in strictly $O(L)$ time, completely independent of the total number of words $N$ stored in the dictionary.",
    failureMode: "Using a flat `next[26]` array of pointers on every Trie node when supporting 1,000,000 Unicode terms, causing 99% of pointer slots to be NULL and consuming 2.5 GB of wasted memory.",
    tryItFriction: "Build a Trie-based autocomplete engine that inserts 100,000 dictionary words with frequencies, returning the top-5 most frequent suggestions for any prefix query in $< 100$ microseconds.",
    socraticHints: [
      "Why is a Trie faster than a Hash Table for autocomplete prefix queries?",
      "Because a Hash Table cannot find all words starting with 'car' without scanning every single key in the dictionary ($O(N)$)!",
      "A Trie navigates to the 'car' node in $O(L)$ steps and immediately explores only the matching descendant subtree."
    ],
    situationalPuzzle: {
      scenario: "An IP router table matches 32-bit IPv4 addresses against longest prefix routing rules (e.g. `192.168.0.0/16` vs `192.168.1.0/24`). A standard Trie creates 32 individual nodes for every single IP address, consuming excessive RAM and causing cache misses. How does a Staff Network Algorithmist compress the tree?",
      options: [
        "Delete routes with long prefixes.",
        "Radix Tree (Patricia Trie) Compression: Merge consecutive nodes that have only a single child into a single edge containing a multi-bit string/slice. This reduces tree node count by up to 80% and accelerates longest-prefix matching.",
        "Store IP addresses in a linked list.",
        "Use regular expressions."
      ],
      answerIdx: 1,
      debrief: "Radix Trees (Patricia Tries) compress chains of non-branching nodes into single edges. This saves substantial memory and reduces the number of pointer dereferences during longest prefix matching."
    },
    quests: [
      { id: "dsa-m2-d41-q1", name: "Trie vs Radix Tree vs Hash Table: Time, Space & Memory Locality", type: "concept", desc: "Analyze pointer density, memory overhead per node, and cache line performance across Trie architectures." },
      { id: "dsa-m2-d41-q2", name: "Detective Lab: Memory Optimization in a 500,000-Word Dictionary Trie", type: "detective", desc: "Profile a bloated Trie consuming 800 MB, replace sparse pointer arrays with compact hash maps, and reduce footprint to 90 MB." },
      { id: "dsa-m2-d41-q3", name: "Mastery Assignment: Autocomplete Trie with Fuzzy Search & Wildcards", type: "assignment", desc: "Build an industrial `Trie` supporting prefix matching, wildcard queries (`'b.t'`), and Levenshtein distance-1 fuzzy matching." },
      { id: "dsa-m2-d41-q4", name: "Production Incident Lab: Unbounded Memory Leak in Dynamic IP Routing Radix Tree", type: "detective", desc: "Fix a memory leak where deleting expired routing prefixes failed to prune orphaned parent nodes in a Radix tree." }
    ]
  },
  {
    day: 42,
    month: 2,
    blockNum: 8,
    title: "Knuth-Morris-Pratt (KMP): Longest Prefix Suffix (LPS) Array Construction & Linear O(N+M) Substring Search",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Deterministic Pattern Matching Automata)",
    spokenGoal: "Conquer linear-time substring search: deconstruct the Knuth-Morris-Pratt (KMP) algorithm, construct the Longest Prefix Suffix (LPS / $\pi$) array in $O(M)$ time, understand why KMP never backtracks the text pointer, and guarantee strictly linear $O(N + M)$ search time.",
    conceptInvariant: "Never-Backtrack Invariant: When a mismatch occurs at pattern index $j$ against text index $i$, KMP never decrements $i$. It shifts the pattern forward by consulting $lps[j-1]$, resuming comparison from the longest proper prefix that is also a suffix, guaranteeing that text index $i$ advances monotonically.",
    failureMode: "Using naive nested substring search on pathological inputs (e.g. searching `'AAAAAB'` in a text of 1,000,000 `'A'`s), causing $O(N \\times M)$ quadratic execution time that freezes the text editor.",
    tryItFriction: "Construct the LPS array for pattern `'ABABCABAB'` by hand and verify with code, explaining how the self-overlap pointers prevent redundant character comparisons.",
    socraticHints: [
      "What does `lps[i]` actually represent in KMP?",
      "The length of the longest proper prefix of `pattern[0...i]` that is also a suffix of `pattern[0...i]`!",
      "When a mismatch occurs at $j$, characters prior to $j$ that match the prefix don't need to be re-checked; jump directly to $j = lps[j-1]$."
    ],
    situationalPuzzle: {
      scenario: "A genomic analysis software searches for a 500-base-pair DNA sequence inside a 3-billion-base-pair human genome. The naive search algorithm backtracks whenever a partial match fails at position 499, taking days to run. The bioinformatics team switches to KMP. How does KMP guarantee linear $O(N + M)$ time without ever backtracking the genome text pointer?",
      options: [
        "KMP translates DNA into binary numbers.",
        "KMP pre-computes the LPS array of the pattern. When a mismatch occurs, it uses prior knowledge of matching characters to slide the pattern forward to the next valid prefix alignment, never moving the genome text pointer backwards.",
        "KMP uses multi-threading.",
        "DNA sequences cannot contain mismatches."
      ],
      answerIdx: 1,
      debrief: "The genius of KMP is the LPS table: it encodes the self-symmetry of the pattern. When a mismatch occurs, the text pointer never resets backwards. It continues moving strictly forward, processing the 3-billion-character genome in a single linear pass."
    },
    quests: [
      { id: "dsa-m2-d42-q1", name: "KMP State Machine: Finite State Automaton Interpretation of the LPS Table", type: "concept", desc: "Map the LPS array to a deterministic finite automaton (DFA) state transition diagram." },
      { id: "dsa-m2-d42-q2", name: "Detective Lab: Profiling the O(N * M) Worst-Case Degeneration of Naive Search", type: "detective", desc: "Construct adversarial test strings triggering worst-case $O(N \\times M)$ behavior in naive search, and benchmark KMP's linear immunity." },
      { id: "dsa-m2-d42-q3", name: "Mastery Assignment: Production-Grade KMP Substring Matcher Engine", type: "assignment", desc: "Implement the complete KMP algorithm in TypeScript returning all occurrence indices and match count metrics." },
      { id: "dsa-m2-d42-q4", name: "Production Incident Lab: Index Out-of-Bounds on Zero-Length Pattern Edge Case", type: "detective", desc: "Fix an unhandled edge case in KMP where passing an empty pattern string `\"\"` caused negative index access in `lps[j-1]`." }
    ]
  },
  {
    day: 43,
    month: 2,
    blockNum: 8,
    title: "Rabin-Karp Rolling Hash: Polynomial Hashing, Prime Modulo Arithmetic & Multiple Pattern Matching",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Rolling Polynomial Hashing & Collision Spurious Matches)",
    spokenGoal: "Master probabilistic string search: implement the Rabin-Karp algorithm using polynomial rolling hashes ($H = \\sum s[i] \\cdot B^{k-i} \\pmod M$), understand how rolling hashes advance in $O(1)$ time by subtracting the exiting character and adding the entering character, and handle spurious hash collisions safely.",
    conceptInvariant: "Rolling Hash Update Invariant: A rolling hash of window size $K$ updates in strict $O(1)$ time: $H_{new} = ((H_{old} - s[left] \\cdot B^{K-1}) \\cdot B + s[right]) \\pmod M$. Hash equality is a necessary condition for a match; an exact character verification is required to guard against spurious hash collisions.",
    failureMode: "Assuming that equal hash values guarantee identical strings without performing a full character check, causing a security scanner to falsely identify clean code as malware due to a spurious hash collision.",
    tryItFriction: "Implement Rabin-Karp in TypeScript using a large 64-bit prime modulo ($M = 10^9 + 7$ or $2^{61}-1$), searching for a pattern across 1,000,000 characters in $O(N + M)$ average time.",
    socraticHints: [
      "Why is Rabin-Karp especially powerful compared to KMP when searching for MULTIPLE patterns of the same length?",
      "Because you can store the hashes of 1,000 patterns in a Hash Set!",
      "As you roll through the text in $O(1)$ time per window, a single $O(1)$ set lookup tests whether the current window matches ANY of the 1,000 patterns."
    ],
    situationalPuzzle: {
      scenario: "An anti-plagiarism system checks student essays against a database of 50,000 known stolen phrases, all of length 20 words. Running KMP 50,000 times takes 25 minutes per essay. How does a Staff Algorithmist use the Rabin-Karp Rolling Hash algorithm to check all 50,000 phrases simultaneously in a single pass?",
      options: [
        "Delete phrases from the database.",
        "Multi-Pattern Rabin-Karp: Compute the 20-word rolling hash of all 50,000 phrases and store them in a Hash Set. Slide a single 20-word rolling hash window across the essay in $O(N)$ time, checking the set in $O(1)$ at each step. Total search time drops to 50 milliseconds.",
        "Use full-text search in PostgreSQL.",
        "Translate the essays to French."
      ],
      answerIdx: 1,
      debrief: "Rabin-Karp is uniquely suited for multi-pattern matching. Computing a single rolling hash across the text allows testing against thousands of candidate pattern hashes simultaneously via a hash set in $O(1)$ time per window."
    },
    quests: [
      { id: "dsa-m2-d43-q1", name: "Polynomial Rolling Hashing Mathematics: Base Selection & Mersenne Primes", type: "concept", desc: "Analyze modulo arithmetic, Fermat's Little Theorem, and why using $2^{61}-1$ avoids 64-bit integer overflow." },
      { id: "dsa-m2-d43-q2", name: "Detective Lab: Spurious Collision Denial-of-Service in a Flawed Hash Table", type: "detective", desc: "Analyze a hash collision vulnerability where an adversary engineered strings with identical rolling hashes to force $O(N \\times M)$ checks." },
      { id: "dsa-m2-d43-q3", name: "Mastery Assignment: Multi-Pattern Plagiarism Detection Engine", type: "assignment", desc: "Build an industrial multi-pattern plagiarism scanner using Rabin-Karp with double hashing to eliminate spurious collisions." },
      { id: "dsa-m2-d43-q4", name: "Production Incident Lab: Negative Modulo Arithmetic in Rolling Hash Window Slide", type: "detective", desc: "Fix an elusive bug where `(H - old_char) % M` produced negative numbers in JavaScript/C++, corrupting rolling hash values." }
    ]
  },
  {
    day: 44,
    month: 2,
    blockNum: 8,
    title: "Aho-Corasick Automaton: Trie-Based Finite State Automaton with Failure Links & Dictionary Pattern Matching",
    stageName: "Stage 3: Systems Hardening",
    stageNum: 3,
    pedagogicalRole: "High Autonomy (Multi-Pattern Automata & Failure Links)",
    spokenGoal: "Engineer the gold standard of multi-pattern string search: the Aho-Corasick Automaton (the algorithm behind `fgrep` and Snort IDS). Build a Trie of dictionary patterns, compute BFS failure links (equivalent to KMP failure transitions), and search for thousands of variable-length patterns in a single linear $O(N + \\text{matches})$ pass.",
    conceptInvariant: "Failure Link Invariant: In an Aho-Corasick automaton, the failure link of a node $u$ representing string $S$ points to the node representing the longest proper suffix of $S$ that exists in the Trie. This allows the automaton to seamlessly transition between partially matching patterns without resetting search state.",
    failureMode: "Running separate regex or KMP searches sequentially for 10,000 virus signatures across incoming network packets, taking $10,000 \\times N$ operations and completely stalling a 10 Gbps network gateway.",
    tryItFriction: "Construct the Aho-Corasick automaton for dictionary `['he', 'she', 'his', 'hers']`, trace the BFS failure links and dictionary output links, and stream-scan text `'ushers'` in linear time.",
    socraticHints: [
      "How does Aho-Corasick combine Tries and KMP?",
      "It organizes all dictionary patterns into a single Trie, then computes KMP-style failure links between Trie nodes using BFS!",
      "When a character mismatch occurs on an edge, it follows the failure link to the longest valid suffix node without backtracking."
    ],
    situationalPuzzle: {
      scenario: "An enterprise Intrusion Detection System (Snort / Suricata) monitors 10 Gbps network traffic for 50,000 known malware signature strings of varying lengths. Matching incoming packets with naive string searches requires billions of operations per packet, dropping 95% of network traffic. What algorithm does the IDS engine use to inspect every packet in a single linear pass?",
      options: [
        "A sequence of 50,000 regex tests.",
        "Aho-Corasick Automaton: Pre-compiles all 50,000 signatures into a Trie with failure links. Incoming packet bytes feed into the finite state machine, finding all matching signatures simultaneously in $O(N + \\text{matches})$ time, independent of the number of signatures.",
        "Hash all packets with SHA-256.",
        "Save packets to disk and run grep."
      ],
      answerIdx: 1,
      debrief: "Aho-Corasick processes text in strictly linear time $O(N)$ regardless of whether you have 10 patterns or 100,000 patterns. It streams characters directly through a pre-computed state automaton, making it the bedrock of real-time firewalls and virus scanners."
    },
    quests: [
      { id: "dsa-m2-d44-q1", name: "Aho-Corasick Automata Theory: Trie Construction, Failure Links & Output Links", type: "concept", desc: "Trace BFS construction of failure links and dictionary output shortcuts in Aho-Corasick state graphs." },
      { id: "dsa-m2-d44-q2", name: "Detective Lab: Profiling Snort IDS Rule Matching with Aho-Corasick", type: "detective", desc: "Benchmark 10,000 signature matching across network payloads, comparing individual KMP runs vs Aho-Corasick automaton." },
      { id: "dsa-m2-d44-q3", name: "Mastery Assignment: Production Aho-Corasick Multi-Pattern Search Engine", type: "assignment", desc: "Build an industrial `AhoCorasick` class in TypeScript supporting case-insensitive multi-pattern search and match offsets." },
      { id: "dsa-m2-d44-q4", name: "Production Incident Lab: Cyclic Failure Link Bug Freezing Packet Inspector", type: "detective", desc: "Fix an implementation bug where root node failure links pointed to themselves, trapping the stream scanner in an infinite loop." }
    ]
  },
  {
    day: 45,
    month: 2,
    blockNum: 8,
    title: "Suffix Arrays & LCP Arrays: Suffix Sorting, Longest Common Prefix & Milestone 8: High-Scale Text Indexing Engine",
    stageName: "Stage 3: Systems Hardening",
    stageNum: 3,
    pedagogicalRole: "High Autonomy (Suffix Structures & Milestone 8 Gate)",
    spokenGoal: "Deliver Milestone 8: master advanced text indexing with Suffix Arrays (lexicographically sorted array of all string suffixes), construct the Longest Common Prefix (LCP) array in $O(N)$ time using Kasai's algorithm, and solve Longest Repeated Substring and Substring Counting across gigabyte-scale corpora.",
    conceptInvariant: "Suffix Array Invariant: The Suffix Array $SA$ stores the starting indices of all suffixes of string $S$ in lexicographical order. Any substring of $S$ is a prefix of some suffix. Therefore, finding all occurrences of pattern $P$ is a binary search over $SA$ in $O(P \\log N)$ time, requiring only $4N$ bytes of memory (compared to $20N$ for Suffix Trees).",
    failureMode: "Using Suffix Trees to index a 500 MB genome file, consuming 15 GB of RAM due to pointer overhead, when a Suffix Array paired with an LCP array solves the same queries in 2 GB of flat contiguous memory.",
    tryItFriction: "Construct the Suffix Array and LCP array for `'banana'` using Kasai's algorithm, proving why the length of the Longest Repeated Substring is simply the maximum element in the LCP array.",
    socraticHints: [
      "Why is a Suffix Array preferred over a Suffix Tree in modern enterprise systems?",
      "Because Suffix Trees use heavy pointer nodes that consume 20x the text size in memory!",
      "A Suffix Array is a simple flat array of integers, using only 4 bytes per character and maximizing CPU cache locality."
    ],
    situationalPuzzle: {
      scenario: "A digital library archives 100,000,000 books. Researchers want to find the longest repeated phrase across the entire corpus. An engineer tries brute-force hashing of all substrings, crashing the cluster with petabytes of hash keys. How does a Staff Information Retrieval Engineer find the longest repeated substring in linear $O(N)$ time?",
      options: [
        "Index the books with an SQL LIKE query.",
        "Construct the Suffix Array and compute the Longest Common Prefix (LCP) array using Kasai's algorithm in $O(N)$ time. The maximum value in the LCP array represents the length and location of the longest repeated substring.",
        "Sort all sentences alphabetically in an Excel spreadsheet.",
        "Delete common words."
      ],
      answerIdx: 1,
      debrief: "Because identical substrings must appear as prefixes of adjacent suffixes in the sorted Suffix Array, the Longest Repeated Substring is mathematically guaranteed to be the maximum element in the LCP array, computable in $O(N)$ time via Kasai's algorithm."
    },
    quests: [
      { id: "dsa-m2-d45-q1", name: "Suffix Array & Kasai's LCP Theorem Mathematical Proof", type: "concept", desc: "Prove Kasai's lemma ($lcp[i] \\ge lps[i-1] - 1$) and demonstrate why LCP construction runs in strictly $O(N)$ time." },
      { id: "dsa-m2-d45-q2", name: "Detective Lab: Profiling Suffix Tree Memory Blowout vs Suffix Array", type: "detective", desc: "Measure memory consumption between pointer-based Suffix Trees and flat integer Suffix Arrays on a 50 MB text file." },
      { id: "dsa-m2-d45-q3", name: "Mastery Assignment: SuffixArray & Kasai LCP Class Implementation", type: "assignment", desc: "Build an optimized `SuffixArray` class in TypeScript with binary search pattern matching and longest repeated substring extraction." },
      { id: "dsa-m2-d45-q4", name: "Milestone 8 Gate: High-Scale Text Indexing & String Automata Engine", type: "assignment", desc: "Deliver Milestone 8: A comprehensive string processing platform implementing KMP, Rabin-Karp, Aho-Corasick, and Suffix Arrays." }
    ]
  },

  // ─── BLOCK 10: Advanced Dynamic Programming & Spatial Structures (Days 46–50) ─────────────
  {
    day: 46,
    month: 2,
    blockNum: 9,
    title: "2D Dynamic Programming: Longest Common Subsequence (LCS), Edit Distance (Levenshtein) & 0/1 Knapsack",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (2D Grid Recurrences & Space Reduction)",
    spokenGoal: "Master multi-dimensional Dynamic Programming: formulate 2D state spaces, implement Longest Common Subsequence (LCS), Edit Distance (Levenshtein distance for fuzzy diffing), and the 0/1 Knapsack problem, and optimize memory from $O(M \\times N)$ to $O(N)$ using rolling 1D buffers.",
    conceptInvariant: "2D Rolling Row Invariant: In a 2D DP matrix where $dp[i][j]$ depends only on the current row $i$ and previous row $i-1$, the full $M \\times N$ matrix can be compressed into two 1D rows (`curr` and `prev`), reducing memory from $O(M \\times N)$ to $O(N)$. For 0/1 Knapsack, iterating backwards allows using a single 1D array.",
    failureMode: "Allocating a full $100,000 \\times 100,000$ 2D integer array for Edit Distance, consuming 40 GB of RAM and crashing the server with an out-of-memory error when two 1D rows require only 800 KB.",
    tryItFriction: "Implement Levenshtein Edit Distance in TypeScript with space optimization, calculating the minimum insertions, deletions, and substitutions to transform string $A$ to string $B$ using only two 1D rows.",
    socraticHints: [
      "Why must the inner loop iterate BACKWARDS in the 1D space-optimized 0/1 Knapsack algorithm?",
      "Because each item can only be used once! Iterating backwards ensures you update $dp[w]$ using values from the previous step ($dp[w - weight]$), preventing the same item from being used multiple times in the same step.",
      "If you iterate forwards, you solve the Unbounded Knapsack problem instead!"
    ],
    situationalPuzzle: {
      scenario: "A git diff engine computes the differences between two 50,000-line source code files using Longest Common Subsequence (LCS). The naive 2D matrix $dp[50000][50000]$ would require 10 GB of RAM. The lead engineer compresses the space to two 1D rows (400 KB) to find the LCS length. But how does the diff engine reconstruct the exact sequence of insertions and deletions without the full matrix?",
      options: [
        "It cannot be done; 10 GB is required.",
        "Hirschberg's Algorithm (Divide-and-Conquer DP): Combines forward and backward 1D DP to find the midpoint split where the optimal path crosses the center row, recursively finding the full edit path in $O(M \\times N)$ time and strictly $O(N)$ space.",
        "Use random guessing.",
        "Run Git on a mainframe."
      ],
      answerIdx: 1,
      debrief: "Hirschberg's algorithm is an elegant application of divide-and-conquer to 2D dynamic programming. It achieves the exact full path reconstruction of a 2D matrix while maintaining the tiny $O(N)$ memory footprint of a 1D rolling array."
    },
    quests: [
      { id: "dsa-m2-d46-q1", name: "2D Dynamic Programming Recurrences: LCS, Edit Distance & Knapsack", type: "concept", desc: "Map formal state transitions, boundary conditions, and matrix dependency DAGs across 2D DP archetypes." },
      { id: "dsa-m2-d46-q2", name: "Detective Lab: Fixing Forward-Iteration Mutation in a 0/1 Knapsack Solver", type: "detective", desc: "Audit a buggy 0/1 Knapsack solver that accidentally allowed duplicate items because the capacity loop ran forwards instead of backwards." },
      { id: "dsa-m2-d46-q3", name: "Mastery Assignment: Production Levenshtein Diffing Engine with Rolling Rows", type: "assignment", desc: "Build an industrial string and file diffing engine using space-optimized Levenshtein distance and backtracking." },
      { id: "dsa-m2-d46-q4", name: "Production Incident Lab: Out-Of-Memory Crash on Large Document Diff Calculation", type: "detective", desc: "Resolve a memory blowout incident where diffing two large legal documents allocated a 500 MB 2D array on the web server." }
    ]
  },
  {
    day: 47,
    month: 2,
    blockNum: 9,
    title: "Bitmask Dynamic Programming: State Representation in Integers, Traveling Salesperson Problem (TSP) & Assignment",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Bitwise State Packing & Exponential Optimization)",
    spokenGoal: "Solve NP-hard problems on small inputs: master Bitmask Dynamic Programming, represent subsets of visited elements as 32-bit integers, manipulate state via bitwise operations (`mask | (1 << i)` to visit, `mask & (1 << i)` to check), and solve the Traveling Salesperson Problem (TSP) in $O(N^2 2^N)$ time instead of $O(N!)$.",
    conceptInvariant: "Bitmask State Packing Invariant: A subset of $N$ items ($N \\le 30$) can be represented as a single 32-bit integer `mask`. Checking membership takes 1 CPU cycle (`(mask >> i) & 1`), adding an element takes 1 cycle (`mask | (1 << i)`), and iterating all $2^N$ subsets runs with zero memory pointer overhead.",
    failureMode: "Using a `Set<number>` serialized to a string (`'1,3,7'`) as the DP memoization key in TSP, multiplying runtime by 200x due to string hashing and allocation overhead when a single integer bitmask evaluates in a single CPU cycle.",
    tryItFriction: "Implement the Held-Karp algorithm for the Traveling Salesperson Problem in TypeScript using bitmask DP: `dp[mask][u] = min(dp[mask][u], dp[mask ^ (1<<u)][v] + dist[v][u])`, solving a 20-city TSP in under 500ms.",
    socraticHints: [
      "How do you iterate through all subsets of a bitmask `mask` efficiently?",
      "Use the submask enumeration trick: `for (let sub = mask; sub > 0; sub = (sub - 1) & mask)`!",
      "This iterates through all valid submasks in strictly $O(3^N)$ total operations across all masks, rather than $O(4^N)$."
    ],
    situationalPuzzle: {
      scenario: "A logistics drone needs to visit 18 delivery drop-off points and return to base with minimum battery consumption. The developer writes a recursive permutation solver ($N! = 18! \\approx 6.4 \\times 10^{15}$ operations), which would take 74 days to compute. How does a Staff Algorithmist calculate the exact optimal route in under 2 seconds on a laptop?",
      options: [
        "Wait 74 days.",
        "Deploy the Held-Karp Bitmask DP Algorithm: Represent visited cities as an 18-bit integer mask. Store `dp[mask][last_city]` representing the minimum cost to visit the subset of cities ending at `last_city`. Total operations drop from $18!$ to $18^2 \\times 2^{18} \\approx 8.5 \\times 10^7$ operations.",
        "Fly to the nearest city at random.",
        "Use a quantum computer."
      ],
      answerIdx: 1,
      debrief: "Bitmask dynamic programming (Held-Karp) solves the Traveling Salesperson Problem by exploiting overlapping subproblems: the shortest path to visit a subset of cities ending at city $U$ does not depend on the order in which earlier cities were visited. This reduces complexity from $O(N!)$ to $O(N^2 2^N)$."
    },
    quests: [
      { id: "dsa-m2-d47-q1", name: "Bitmask State Representation & Submask Enumeration Mathematics", type: "concept", desc: "Prove why the submask enumeration trick `sub = (sub - 1) & mask` iterates all submasks in $\\sum C(N, k) 2^k = 3^N$ operations." },
      { id: "dsa-m2-d47-q2", name: "Detective Lab: Profiling the Set String Hashing Bottleneck in TSP", type: "detective", desc: "Compare execution speed between string-keyed memoization (`'1,2,5'`) and integer bitmask memoization on a 16-city TSP." },
      { id: "dsa-m2-d47-q3", name: "Mastery Assignment: Held-Karp Traveling Salesperson Engine with Bitmasks", type: "assignment", desc: "Build an optimal TSP route solver in TypeScript supporting up to 22 cities with path reconstruction and bitmask DP." },
      { id: "dsa-m2-d47-q4", name: "Production Incident Lab: Bitwise Shift Overflow on 32-Bit Integer Boundaries", type: "detective", desc: "Fix an integer overflow bug in JavaScript where `1 << 31` produced a negative 32-bit signed integer, corrupting bitmask logic." }
    ]
  },
  {
    day: 48,
    month: 2,
    blockNum: 9,
    title: "Tree Dynamic Programming & Interval DP: Diameter of Tree, Binary Lifting (LCA in O(log N)) & Matrix Chain",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Tree Topologies & Binary Lifting Power Steps)",
    spokenGoal: "Master structural Dynamic Programming: solve Tree DP (Diameter of Tree, Maximum Path Sum, Subtree Aggregations), implement Binary Lifting to compute Lowest Common Ancestor (LCA) in $O(\\log N)$ query time using $up[node][k] = 2^k$-th ancestors, and master Interval DP (Matrix Chain Multiplication).",
    conceptInvariant: "Binary Lifting Invariant: In a tree, precompute $up[u][i]$ representing the $2^i$-th ancestor of node $u$ using the recurrence $up[u][i] = up[up[u][i-1]][i-1]$. Any ancestor jump of distance $K$ can be decomposed into powers of two in $O(\\log N)$ time, enabling lightning-fast $O(\\log N)$ LCA queries.",
    failureMode: "Finding the Lowest Common Ancestor (LCA) in an unbalanced tree by traversing parent pointers step-by-step ($O(N)$ per query), causing a 100,000-query batch to take 45 seconds when Binary Lifting answers each query in 80 nanoseconds.",
    tryItFriction: "Implement Binary Lifting in TypeScript: precompute the $up[N][20]$ table using DFS in $O(N \\log N)$ time, and write `getLCA(u, v)` that lifts nodes to equal depth and binary-searches their common ancestor in $O(\\log N)$ time.",
    socraticHints: [
      "How does Binary Lifting find the LCA of two nodes $u$ and $v$?",
      "First, lift the deeper node until both nodes are at the exact same tree depth using binary powers of two!",
      "Then, lift both nodes together: if $up[u][i] \\ne up[v][i]$, lift both by $2^i$. The parent of $u$ at the end is the LCA."
    ],
    situationalPuzzle: {
      scenario: "A cloud access control system evaluates corporate permissions organized in a 200,000-node company management tree. An authorization check requires finding the Lowest Common Manager (LCA) between any two employees 50,000 times per second. Step-by-step parent traversal times out under load. What algorithmic data structure solves this?",
      options: [
        "Traverse to the root for every query.",
        "Binary Lifting: Precompute $2^k$-th ancestors using a table of size $N \\times \\log_2 N$. Each LCA query lifts nodes in powers-of-two steps, answering queries in strictly $O(\\log N)$ time with sub-microsecond latency.",
        "Store all pairs in a 200,000 x 200,000 matrix.",
        "Flatten the tree into a list."
      ],
      answerIdx: 1,
      debrief: "Binary Lifting precomputes $2^k$-th ancestors using dynamic programming: the $2^i$-th ancestor is the $2^{i-1}$-th ancestor of the $2^{i-1}$-th ancestor. This allows jumping through the tree in binary logarithmic steps, answering LCA queries in $O(\\log N)$ time."
    },
    quests: [
      { id: "dsa-m2-d48-q1", name: "Binary Lifting Recurrence & Tree Dynamic Programming Formulations", type: "concept", desc: "Derive the mathematical proof of Binary Lifting and contrast with Eulerian Tour + RMQ Segment Tree LCA." },
      { id: "dsa-m2-d48-q2", name: "Detective Lab: Debugging Unequal Depth Alignment in Binary Lifting LCA", type: "detective", desc: "Fix an LCA implementation that returned incorrect ancestors because it failed to lift nodes to identical depths before binary searching." },
      { id: "dsa-m2-d48-q3", name: "Mastery Assignment: Production Binary Lifting Tree Engine & Diameter Solver", type: "assignment", desc: "Build a tree analytics engine in TypeScript computing tree diameter, maximum path sums, and $O(\\log N)$ LCA queries." },
      { id: "dsa-m2-d48-q4", name: "Production Incident Lab: Out-of-Bounds Ancestor Access on Root Node Over-Lifting", type: "detective", desc: "Fix an unhandled boundary where lifting a node above the root accessed undefined table cells, returning invalid LCAs." }
    ]
  },
  {
    day: 49,
    month: 2,
    blockNum: 9,
    title: "Spatial Data Structures: QuadTrees & K-D Trees for 2D/3D Nearest Neighbor Search & Range Bounding Boxes",
    stageName: "Stage 2: Guided Construction",
    stageNum: 2,
    pedagogicalRole: "Supported Construction (Spatial Partitioning & K-Dimensional Trees)",
    spokenGoal: "Engineer spatial indexing engines: master spatial decomposition using QuadTrees (2D quadrant partitioning) and K-D Trees (K-Dimensional space partitioning alternating splitting axes), implement $O(\\log N)$ Nearest Neighbor Search, and execute bounding-box range queries.",
    conceptInvariant: "Spatial Pruning Invariant: In Nearest Neighbor Search on a K-D tree, search the half-space containing the query point first. Only inspect the opposite half-space IF the distance from the query point to the splitting hyperplane is LESS than the current best minimum distance. This prunes massive regions of space geometrically.",
    failureMode: "Searching for the nearest delivery driver among 500,000 active vehicles by calculating Euclidean distances to all 500,000 drivers ($O(N)$ scan), causing API latency to hit 400ms when a K-D tree finds the nearest driver in $O(\\log N) \\approx 19$ steps.",
    tryItFriction: "Build a 2D K-D Tree in TypeScript from scratch: alternate splitting by X and Y coordinates at each depth, and implement Nearest Neighbor search with geometric sphere-box intersection pruning.",
    socraticHints: [
      "How does a K-D Tree alternate splitting dimensions?",
      "At depth $D$, split along axis $D \\pmod K$!",
      "For 2D points: level 0 splits vertically (X-axis), level 1 splits horizontally (Y-axis), level 2 splits X-axis, and so forth."
    ],
    situationalPuzzle: {
      scenario: "A geospatial delivery application displays nearby restaurants within a 2-kilometer radius of a user's smartphone. The database contains 2,000,000 restaurants. Querying every restaurant using the Haversine distance formula causes severe CPU saturation. How does Staff Architecture optimize spatial radius queries to execute in under 1 millisecond?",
      options: [
        "Sort restaurants by name.",
        "QuadTree or 2D K-D Tree Spatial Index: Partition 2D space hierarchically. Range queries recursively test bounding box intersections, completely pruning quadrants that do not overlap with the search radius, evaluating only candidate restaurants in $O(\\log N + \\text{matches})$ time.",
        "Query all restaurants and filter in the browser.",
        "Store coordinates as text strings."
      ],
      answerIdx: 1,
      debrief: "Spatial data structures (QuadTrees, K-D Trees) recursively partition geographic space. Bounding box intersection tests prune entire quadrants that fall outside the query radius, reducing search complexity from linear scans to logarithmic traversals."
    },
    quests: [
      { id: "dsa-m2-d49-q1", name: "Spatial Partitioning Mathematics: QuadTrees vs K-D Trees vs R-Trees", type: "concept", desc: "Compare spatial indexing structures: point QuadTrees, alternating K-D trees, and bounding-box R-Trees for geospatial data." },
      { id: "dsa-m2-d49-q2", name: "Detective Lab: Profiling the Un-Pruned Hyperplane Scan in a K-D Tree", type: "detective", desc: "Audit a slow K-D tree implementation where missing hyperplane boundary checks caused nearest neighbor search to visit every single leaf." },
      { id: "dsa-m2-d49-q3", name: "Mastery Assignment: Production 2D K-D Tree with Nearest Neighbor & Range Queries", type: "assignment", desc: "Build a `KDTree` class in TypeScript supporting median-split construction, k-nearest neighbors, and radius range queries." },
      { id: "dsa-m2-d49-q4", name: "Production Incident Lab: Unbalanced K-D Tree Degenerating on Skewed Urban Data", type: "detective", desc: "Fix performance degradation in a spatial index where non-median splitting in densely populated cities created deeply skewed trees." }
    ]
  },
  {
    day: 50,
    month: 2,
    blockNum: 9,
    title: "Convex Hull Trick & Monotonic Queue Optimizations in DP (O(N^2) -> O(N)) (Milestone 9)",
    stageName: "Stage 3: Systems Hardening",
    stageNum: 3,
    pedagogicalRole: "High Autonomy (Advanced DP Optimization & Milestone 9 Gate)",
    spokenGoal: "Deliver Milestone 9: conquer Big Tech Staff-level algorithmic optimization: master the Convex Hull Trick (CHT) and Monotonic Queue Optimizations, transforming quadratic dynamic programming recurrences of form $dp[i] = \min_{j < i}(dp[j] + b[j] \\cdot a[i])$ from $O(N^2)$ to optimal $O(N)$ or $O(N \\log N)$.",
    conceptInvariant: "Convex Hull Slope Invariant: In the recurrence $dp[i] = \min(m_j \\cdot x + c_j)$, each candidate $j$ forms a linear function $y = m_j x + c_j$. By maintaining the lower convex hull of lines in a deque and discarding lines that become suboptimal, the minimum for any $x$ is queried in $O(1)$ amortized time.",
    failureMode: "Leaving a production resource scheduling algorithm as an $O(N^2)$ dynamic program for $N = 100,000$, resulting in $10^{10}$ operations and taking 35 minutes when Convex Hull Trick evaluates the exact optimal solution in 15 milliseconds.",
    tryItFriction: "Implement the Convex Hull Trick using a deque of lines `Line(m, c)`: verify when a newly added line renders the previous line completely redundant by calculating intersection x-coordinates, achieving $O(N)$ total time.",
    socraticHints: [
      "When does a line $L_2$ become redundant when inserting line $L_3$ after $L_1$?",
      "When the intersection of $L_1$ and $L_3$ occurs to the left of the intersection of $L_1$ and $L_2$ ($intersect(L_1, L_3) \\le intersect(L_1, L_2)$)!",
      "In that case, $L_2$ will never be the minimum for any $x$; pop $L_2$ from the deque."
    ],
    situationalPuzzle: {
      scenario: "An enterprise manufacturing optimization problem calculates minimal batch costs across 50,000 production runs. The recurrence relation is $dp[i] = \min_{j < i}(dp[j] + (A[i] - B[j])^2)$. Expanding the quadratic yields an $O(N^2)$ nested loop that takes 8 minutes to run. The lines have monotonically decreasing slopes. How does a Principal Algorithmist reduce the runtime to 12 milliseconds?",
      options: [
        "Delete manufacturing steps.",
        "Convex Hull Trick (CHT) Optimization: Expand the term into $dp[j] + B[j]^2 - 2A[i]B[j] + A[i]^2$. Treat $-2B[j]$ as slope $m$ and $dp[j] + B[j]^2$ as y-intercept $c$. Maintain the lower convex hull of lines in a monotonic deque, reducing total computation from $O(N^2)$ to strictly $O(N)$.",
        "Use multi-threading.",
        "Round the numbers to the nearest integer."
      ],
      answerIdx: 1,
      debrief: "Expanding quadratic cost expressions frequently yields linear terms $m_j x + c_j$. The Convex Hull Trick maintains the envelope of optimal lines, reducing quadratic DP search to an amortized $O(N)$ single pass."
    },
    quests: [
      { id: "dsa-m2-d50-q1", name: "Convex Hull Trick Mathematics: Line Intersections & Envelopes", type: "concept", desc: "Derive the mathematical intersection formula and prove line elimination conditions on monotonic envelopes." },
      { id: "dsa-m2-d50-q2", name: "Detective Lab: Profiling O(N^2) vs O(N) in a Batch Splitting Pipeline", type: "detective", desc: "Benchmark an $O(N^2)$ DP cost optimizer against an $O(N)$ Convex Hull Trick solver up to 100,000 elements." },
      { id: "dsa-m2-d50-q3", name: "Mastery Assignment: Production ConvexHullTrick Line Container", type: "assignment", desc: "Implement a fully optimized `ConvexHullOptimizer` class in TypeScript supporting line insertion and $O(1)$ amortized minimum queries." },
      { id: "dsa-m2-d50-q4", name: "Milestone 9 Gate: Advanced 2D/Spatial & Dynamic Programming Optimization Suite", type: "assignment", desc: "Deliver Milestone 9: A production-grade optimization suite featuring 2D space-compressed DP, K-D Trees, and Convex Hull DP solvers." }
    ]
  },

  // ─── BLOCK 11: Probabilistic, Hardware-Conscious & Lock-Free Data Structures (Days 51–55) ───
  {
    day: 51,
    month: 2,
    blockNum: 10,
    title: "Probabilistic Data Structures: Bloom Filters, Optimal Bit Array Size Math, False Positive Probability & Counting Bloom Filters",
    stageName: "Stage 4: Autonomous Production Defense",
    stageNum: 4,
    pedagogicalRole: "Autonomous Execution (Probabilistic Space Optimization)",
    spokenGoal: "Master probabilistic data structures: engineer a Bloom Filter, mathematically derive optimal bit array size $m = -\\frac{n \\ln p}{(\\ln 2)^2}$ and optimal hash function count $k = \\frac{m}{n} \\ln 2$ for target false positive probability $p$, implement Counting Bloom Filters for deletions, and protect databases from disk I/O.",
    conceptInvariant: "Bloom Filter One-Way Invariant: A Bloom Filter has ZERO false negatives ($P(x \\in S | \\text{test}(x) = false) = 0$). If the filter returns false, the element is guaranteed to NOT be in the set. If it returns true, the element MIGHT be in the set with false positive probability $p$.",
    failureMode: "Attempting to delete an item from a standard Bloom Filter by zeroing out its hash bits, inadvertently deleting shared bits and causing catastrophic false negatives for other valid elements.",
    tryItFriction: "Calculate the exact number of bits $m$ and hash functions $k$ required to store 10,000,000 URLs with a false positive rate $p \\le 1\\%$, and build a working Bloom Filter in TypeScript using MurmurHash3.",
    socraticHints: [
      "How many bytes does a Bloom filter need to store 10,000,000 items with a 1% false positive rate?",
      "Formula: $m \\approx 9.6$ bits per item! $10,000,000 \\times 9.6$ bits $\\approx 96$ megabits $\\approx 12$ megabytes!",
      "Storing 10M raw URLs in a hash set would consume 500 MB. A Bloom Filter accomplishes it in 12 MB with zero disk reads."
    ],
    situationalPuzzle: {
      scenario: "An LSM-tree database (like RocksDB, Cassandra, or Bigtable) stores terabytes of data on SSDs. When a user queries for a non-existent key, the database must scan multiple SSTable files on disk, causing heavy I/O latency. How do storage engines prevent reading disk for non-existent keys in 99% of cases?",
      options: [
        "Store all data in RAM.",
        "Attach an in-memory Bloom Filter to each SSTable. Before performing any expensive disk I/O, query the Bloom Filter in RAM. If it returns false, the key is guaranteed not to exist, bypassing disk read entirely.",
        "Disable queries for missing keys.",
        "Use faster SSDs."
      ],
      answerIdx: 1,
      debrief: "LSM-tree storage engines store an in-memory Bloom filter for each on-disk SSTable. Because Bloom filters have zero false negatives, negative lookups immediately skip disk reads, protecting databases from I/O starvation."
    },
    quests: [
      { id: "dsa-m2-d51-q1", name: "Bloom Filter Mathematics: False Positive Probability & Optimal Bit Calculations", type: "concept", desc: "Derive the mathematical equations for false positive rate $p = (1 - e^{-kn/m})^k$ and optimal hash count $k = (m/n) \\ln 2$." },
      { id: "dsa-m2-d51-q2", name: "Detective Lab: Profiling False Negative Corruption from Naive Bloom Deletions", type: "detective", desc: "Demonstrate how zeroing bits to 'delete' items breaks the zero-false-negative invariant, and implement a Counting Bloom Filter." },
      { id: "dsa-m2-d51-q3", name: "Mastery Assignment: Production BloomFilter & CountingBloomFilter Engine", type: "assignment", desc: "Build an optimized Bloom Filter in TypeScript with MurmurHash3 bit mixing and verified false positive bounds." },
      { id: "dsa-m2-d51-q4", name: "Production Incident Lab: Sub-Optimal Hash Count Triggering 25% False Positive Rate", type: "detective", desc: "Triage a production database where using too few hash functions caused the false positive rate to spike to 25%, saturating disk I/O." }
    ]
  },
  {
    day: 52,
    month: 2,
    blockNum: 10,
    title: "Streaming Cardinality & Frequency: HyperLogLog (LogLog Counting via Leading Zeros) & Count-Min Sketch",
    stageName: "Stage 4: Autonomous Production Defense",
    stageNum: 4,
    pedagogicalRole: "Autonomous Execution (HyperLogLog & Stream Summaries)",
    spokenGoal: "Estimate massive scale with tiny memory: master HyperLogLog (HLL) for cardinality estimation (counting 1 billion unique visitors using only 1.5 KB of memory via leading-zero distribution physics), and implement Count-Min Sketch for tracking high-frequency heavy hitters in network streams.",
    conceptInvariant: "LogLog Observation Invariant: In a uniform random binary stream, observing a hash with $k$ leading zeros indicates that approximately $2^k$ unique elements have been observed. By averaging maximum leading zeros across $m$ sub-registers using harmonic mean, HyperLogLog achieves a standard error of $\\approx 1.04 / \\sqrt{m}$.",
    failureMode: "Counting unique visitors on an enterprise analytics portal using a Redis `Set` (`SADD`), consuming 12 GB of expensive Redis RAM for 200,000,000 user IDs when Redis `PFADD` (HyperLogLog) computes it with 0.81% error in 12 KB.",
    tryItFriction: "Implement a simplified HyperLogLog in TypeScript: hash strings to 64-bit integers, use the first 10 bits to address 1,024 registers, calculate leading zeros of remaining bits, and estimate cardinality using the harmonic mean.",
    socraticHints: [
      "Why does HyperLogLog use the HARMONIC mean instead of the arithmetic mean across registers?",
      "Because arithmetic mean is easily distorted by a single rare outlier (e.g. an element that coincidentally has 30 leading zeros)!",
      "The harmonic mean discounts extreme positive outliers, providing an accurate, robust estimate."
    ],
    situationalPuzzle: {
      scenario: "An e-commerce giant needs to track the number of unique daily visitors to 500,000 product pages. Using exact sets (`Set<userId>`) would require 80 GB of RAM. The business requires an accuracy of within 2% error. How does a Staff Data Architect store unique visitor metrics in under 600 MB total memory?",
      options: [
        "Sample 1% of visitors and multiply by 100.",
        "HyperLogLog (HLL): Deploy an HLL register array (e.g. 1,024 6-bit registers = 768 bytes per product). 500,000 products $\\times$ 768 bytes $\\approx$ 384 MB of memory, guaranteeing $\\approx 1.04 / \\sqrt{1024} \\approx 3.25\\%$ standard error with near-zero memory footprint.",
        "Store user IDs in a CSV file.",
        "Delete yesterday's data."
      ],
      answerIdx: 1,
      debrief: "HyperLogLog estimates unique cardinalities into the billions using a tiny fixed array of registers. Storing only the count of leading zeros provides mathematically bounded estimates with sub-2% error in under 1 KB per key."
    },
    quests: [
      { id: "dsa-m2-d52-q1", name: "HyperLogLog Mathematics: Harmonic Means & Flajolet-Martin Foundations", type: "concept", desc: "Deconstruct the Flajolet-Martin algorithm, stochastic averaging, and the bias correction constants of HyperLogLog." },
      { id: "dsa-m2-d52-q2", name: "Detective Lab: Profiling Memory Blowout in a Redis Set Unique Counter", type: "detective", desc: "Benchmark 50,000,000 unique IDs in a standard Hash Set (3.2 GB) vs HyperLogLog (12 KB), measuring accuracy and speed." },
      { id: "dsa-m2-d52-q3", name: "Mastery Assignment: Production HyperLogLog & Count-Min Sketch Implementation", type: "assignment", desc: "Build `HyperLogLog` and `CountMinSketch` classes in TypeScript with bias correction and frequency tracking." },
      { id: "dsa-m2-d52-q4", name: "Production Incident Lab: Small Cardinality Estimation Distortion in Raw HLL", type: "detective", desc: "Fix an estimation error on small sets ($N < 2.5m$) by implementing linear counting register-zero correction." }
    ]
  },
  {
    day: 53,
    month: 2,
    blockNum: 10,
    title: "Probabilistic Search: Skip Lists (Geometric Coin Flipping, O(log N) Expected Search/Insert without Rebalancing)",
    stageName: "Stage 4: Autonomous Production Defense",
    stageNum: 4,
    pedagogicalRole: "Autonomous Execution (Probabilistic Self-Balancing & Lock-Free Topologies)",
    spokenGoal: "Master probabilistic search structures: engineer a Skip List (the structure powering Redis Sorted Sets and LevelDB MemTables), understand geometric distribution coin flipping ($P = 0.5$) for tower heights, achieve $O(\\log N)$ expected search, insert, and delete without tree rotations, and understand lock-free concurrency.",
    conceptInvariant: "Probabilistic Layer Invariant: Each level $k$ acts as an express lane skipping over elements below it, with approximately $N / 2^k$ elements. Because tower heights follow a geometric distribution ($P=0.5$), expected search time is $O(\\log N)$ without requiring complex tree rebalancing rotations.",
    failureMode: "Using a single global lock around a Red-Black tree for a high-concurrency in-memory database, causing massive thread contention during rebalancing rotations, when a Skip List allows lock-free compare-and-swap pointer splicing.",
    tryItFriction: "Implement a Skip List in TypeScript from scratch: generate tower heights using `while (Math.random() < 0.5 && level < MAX_LEVEL) level++`, maintain an `update[]` array during search, and splice pointers across multiple levels in $O(\\log N)$ time.",
    socraticHints: [
      "Why did Antirez choose Skip Lists over Red-Black trees for Redis ZSETs?",
      "Because Skip Lists are much simpler to implement, faster to perform range queries over (just walk the level 0 forward pointers), and much easier to make concurrent!",
      "Tree rotations in Red-Black trees require locking large subtrees; Skip Lists only update local forward pointers."
    ],
    situationalPuzzle: {
      scenario: "Redis stores sorted sets (ZSET) using a Skip List combined with a Hash Table. A database engineer asks: 'Why didn't Redis use a B-Tree or Red-Black Tree for sorted sets?' What architectural characteristic of Skip Lists makes them superior for Redis's operational model?",
      options: [
        "Skip Lists use zero memory.",
        "Range Query Simplicity & Concurrency: In a Skip List, once the start of a range is found, iterating through the range is a fast linear traversal of the bottom linked list (`node.forward[0]`). Unlike balanced trees, Skip Lists require no complex rotations upon modification, making memory management and serialization straightforward.",
        "Skip Lists are built into the C compiler.",
        "Red-Black trees cannot sort floating point numbers."
      ],
      answerIdx: 1,
      debrief: "Skip Lists achieve $O(\\log N)$ search, insertion, and deletion through probabilistic leveling rather than rigid structural invariants. Range scans in a Skip List are simple linked list walks at level 0, eliminating the complex parent-pointer gymnastics of tree range traversals."
    },
    quests: [
      { id: "dsa-m2-d53-q1", name: "Skip List Probabilistic Proof & Geometric Distribution Tower Heights", type: "concept", desc: "Prove that expected search path length in a Skip List with parameter $p=0.5$ is at most $2 \\log_2 N$ steps." },
      { id: "dsa-m2-d53-q2", name: "Detective Lab: Fixing Dangling Forward Pointers in a Skip List Deletion", type: "detective", desc: "Audit a Skip List implementation where deleting an element failed to update higher-level forward pointers, causing zombie lookups." },
      { id: "dsa-m2-d53-q3", name: "Mastery Assignment: Production-Grade SkipList<K, V> Implementation", type: "assignment", desc: "Build a complete `SkipList<K, V>` in TypeScript with custom comparators, range scans (`getRange(min, max)`), and metrics." },
      { id: "dsa-m2-d53-q4", name: "Production Incident Lab: Unbounded Tower Height Starving Memory in Poor RNG", type: "detective", desc: "Fix an issue where a broken pseudo-random number generator produced tower heights exceeding maximum level, corrupting memory." }
    ]
  },
  {
    day: 54,
    month: 2,
    blockNum: 10,
    title: "Cache-Conscious B+ Trees: B+ Tree Fanout, Leaf Node Pointers, 64-Byte Cache Line Alignment & Disk Page I/O",
    stageName: "Stage 4: Autonomous Production Defense",
    stageNum: 4,
    pedagogicalRole: "Autonomous Execution (Hardware Cache-Conscious Storage Structures)",
    spokenGoal: "Architect the fundamental storage structure of relational databases (PostgreSQL, MySQL InnoDB): master B+ Trees, calculate high fanout ($M = 100$ to $500$) to minimize tree height ($H \\le 3$ for billions of records), link leaf nodes in a doubly linked list for fast range scans, and align node blocks to 64-byte CPU cache lines and 4 KB OS disk pages.",
    conceptInvariant: "Page & Cache Alignment Invariant: In a B+ Tree, internal nodes store ONLY keys and child pointers (maximizing fanout); data records live exclusively in leaf nodes. Sizing node buffers to exact OS disk page boundaries (4 KB) or CPU cache lines (64 bytes) guarantees that each node fetch requires exactly 1 disk I/O or 1 memory read.",
    failureMode: "Using a binary search tree ($fanout = 2$) for on-disk database indexing, requiring $\\log_2(1,000,000,000) \\approx 30$ disk read operations per query (300ms) when a B+ Tree ($fanout = 500$) requires only 3 disk reads (3ms).",
    tryItFriction: "Design a B+ Tree node layout in TypeScript/C++ where keys and child pointers are stored in flat contiguous arrays, calculating node splits when an internal node exceeds capacity $M$.",
    socraticHints: [
      "Why do databases use B+ Trees instead of B-Trees?",
      "In a B+ Tree, internal nodes don't store data records, only routing keys, so fanout is MUCH higher!",
      "Furthermore, all leaf nodes are linked in a linked list, making `SELECT * WHERE age BETWEEN 20 AND 30` a simple horizontal scan without tree traversals."
    ],
    situationalPuzzle: {
      scenario: "A MySQL database stores 500,000,000 rows in an InnoDB table. A junior DBA asks: 'How can MySQL find any record in an index of 500 million rows with only 3 or 4 page reads?' How does a Principal Database Architect explain the mathematical geometry of B+ Trees?",
      options: [
        "MySQL uses AI to guess the location.",
        "High Fanout Geometry: A 16 KB InnoDB page can hold ~1,000 index keys (fanout $B \\approx 1000$). At height 1, it holds $1,000$ keys; height 2 holds $1,000,000$; height 3 holds $1,000,000,000$ keys. Therefore, a 3-level B+ Tree indexes 1 billion rows in at most 3 page reads.",
        "The entire database is cached in CPU registers.",
        "B+ trees don't use disk pages."
      ],
      answerIdx: 1,
      debrief: "Because B+ Tree internal nodes store only routing keys, a single 16 KB page holds hundreds or thousands of keys. With a fanout of 1,000, tree height remains at $\\le 3$ even for a billion rows, requiring at most 3 page lookups per query."
    },
    quests: [
      { id: "dsa-m2-d54-q1", name: "B+ Tree Fanout Mathematics & Storage Engine Page Sizing", type: "concept", desc: "Derive the mathematical relationship between page size, key size, pointer size, fanout, and tree height." },
      { id: "dsa-m2-d54-q2", name: "Detective Lab: Profiling Node Split Cascade in an Overfilled B+ Tree", type: "detective", desc: "Trace an insert that triggers a leaf split, propagating splits to internal nodes up to the root, creating a new root." },
      { id: "dsa-m2-d54-q3", name: "Mastery Assignment: In-Memory Cache-Aligned B+ Tree Engine", type: "assignment", desc: "Build an in-memory `BPlusTree` in TypeScript with configurable fanout, contiguous array nodes, and leaf range iterators." },
      { id: "dsa-m2-d54-q4", name: "Production Incident Lab: B+ Tree Re-Balancing Contention in High-Write Ingestion", type: "detective", desc: "Fix an issue where sequential key insertions caused continuous single-sided node splitting, underutilizing page space by 50%." }
    ]
  },
  {
    day: 55,
    month: 2,
    blockNum: 10,
    title: "Low-Latency Systems Optimization: Branchless Algorithms, SIMD Vectorization Scans, Memory Pools & Milestone 10: Low-Latency Systems Platform",
    stageName: "Stage 4: Autonomous Production Defense",
    stageNum: 4,
    pedagogicalRole: "Autonomous Execution (Low-Latency Mechanical Sympathy & Milestone 10 Gate)",
    spokenGoal: "Deliver Milestone 10: master mechanical sympathy for ultra-low-latency execution: eliminate branch misprediction penalties using branchless coding techniques (conditional moves `cmov`, bitwise arithmetic), accelerate array scans using SIMD vectorization concepts, eliminate garbage collection pauses with pre-allocated Memory Pools and Arena Allocators, and finalize Milestone 10.",
    conceptInvariant: "Mechanical Sympathy Invariant: A branch misprediction incurs a ~15-20 cycle CPU pipeline flush penalty. Replacing conditional branches (`if (x > 0)`) in hot inner loops with bitwise operations (`x & -(x > 0)`) or conditional moves keeps the CPU instruction pipeline full and executes in 1 cycle.",
    failureMode: "Sorting a million integers using a branchy comparison inside a hot loop, causing 15% branch misprediction rate and running 4x slower than branchless bit-manipulation sorting networks.",
    tryItFriction: "Write a branchless binary search in TypeScript/C++ that eliminates the `if (arr[mid] < target)` conditional branch using bit arithmetic, benchmarking its speed against standard branchy binary search.",
    socraticHints: [
      "Why is a branchless binary search faster on large arrays than standard binary search?",
      "Because on every iteration, standard binary search branches left or right with 50% probability, which is the WORST possible case for CPU branch predictors!",
      "A branchless version updates the index unconditionally using arithmetic, eliminating pipeline flushes entirely."
    ],
    situationalPuzzle: {
      scenario: "A high-frequency trading firm processes 50,000,000 order price updates per second. The order routing engine filters orders using: `if (order.price >= minPrice && order.price <= maxPrice) validOrders.push(order)`. CPU profilers report that branch mispredictions account for 42% of total CPU cycles. How does an ultra-low-latency systems engineer optimize this hot loop?",
      options: [
        "Upgrade to a higher gigahertz CPU.",
        "Branchless Filtering & Pre-Allocated Output Buffer: Replace the `if` condition with bitwise comparisons `const valid = (order.price >= minPrice) & (order.price <= maxPrice);`, and increment the pre-allocated buffer index by `valid` unconditionally, eliminating CPU branch prediction stalls completely.",
        "Add more if statements.",
        "Use multi-threading."
      ],
      answerIdx: 1,
      debrief: "In unpredictable data streams, conditional `if` branches trigger continuous CPU branch mispredictions, stalling the execution pipeline for 15-20 clock cycles each time. Branchless bitwise arithmetic executes uniformly in 1-2 cycles without pipeline flushes."
    },
    quests: [
      { id: "dsa-m2-d55-q1", name: "Mechanical Sympathy: CPU Pipelining, Branch Predictors & SIMD Lanes", type: "concept", desc: "Analyze modern CPU instruction pipelines, branch target buffers (BTB), and AVX-512 vector parallel lanes." },
      { id: "dsa-m2-d55-q2", name: "Detective Lab: Profiling Branch Mispredictions with Hardware PMU Counters", type: "detective", desc: "Profile a branchy algorithm using Linux `perf stat`, measure `branch-misses`, and rewrite using branchless bit manipulation." },
      { id: "dsa-m2-d55-q3", name: "Mastery Assignment: Zero-Allocation Arena Allocator & Branchless Search Suite", type: "assignment", desc: "Build an `ArenaAllocator` managing a flat memory buffer with $O(1)$ allocations, plus a branchless binary search utility." },
      { id: "dsa-m2-d55-q4", name: "Milestone 10 Gate: Ultra-Low-Latency Systems Architecture Platform", type: "assignment", desc: "Deliver Milestone 10: A low-latency platform integrating Bloom Filters, HyperLogLog, Skip Lists, B+ Trees, and Arena Allocators." }
    ]
  },

  // ─── BLOCK 12: Algorithmic SRE War Rooms, RFC Defense & Master Capstone Viva (Days 56–60) ───
  {
    day: 56,
    month: 2,
    blockNum: 11,
    title: "Algorithmic Denial of Service (DoS): Hash Flooding Attacks (SipHash defense), ReDoS Regular Expression Exploits",
    stageName: "Stage 4: Autonomous Production Defense",
    stageNum: 4,
    pedagogicalRole: "Autonomous Execution (Algorithmic Security & Adversarial Complexity)",
    spokenGoal: "Protect production infrastructure from algorithmic attacks: analyze Algorithmic Complexity Denial of Service (AC-DoS), understand Hash Flooding attacks that force hash maps into $O(N)$ linked list degeneration, implement cryptographically keyed hash functions (SipHash), and neutralize Regular Expression Denial of Service (ReDoS) catastrophic backtracking.",
    conceptInvariant: "Algorithmic Security Invariant: Publicly exposed endpoints must never use deterministic, predictable hash functions for hash tables. Hash tables exposed to untrusted user input MUST be seeded with a cryptographically random per-process secret key (SipHash-2-4) to prevent attackers from crafting collision payloads.",
    failureMode: "Using default Java `String.hashCode()` in a public API receiving JSON objects. An attacker sends an HTTP POST with 50,000 keys engineered to have identical hash codes, locking the server CPU at 100% for 30 minutes parsing a single request.",
    tryItFriction: "Craft a set of 1,000 colliding strings for a simple polynomial hash function, demonstrate that inserting them into a standard hash map degrades lookups from 1 microsecond to 50 milliseconds, and neutralize it using a keyed hash function.",
    socraticHints: [
      "How does an attacker execute a Hash Flooding attack?",
      "By pre-computing thousands of string keys that produce the exact same hash code under the victim's known hash function!",
      "When sent in a single JSON payload, the hash map puts all keys into the same bucket, turning $O(1)$ lookups into $O(N^2)$ comparisons."
    ],
    situationalPuzzle: {
      scenario: "A major payment gateway experiences an emergency outage: an attacker sends an HTTP request with an authorization header validated by a regex: `/^([a-zA-Z0-9]+)*$/`. When the attacker sends a string of 35 'a's followed by an exclamation mark `'!'`, the Node.js event loop thread freezes completely for 4 minutes with 100% CPU usage. What vulnerability occurred?",
      options: [
        "The server ran out of disk space.",
        "Regular Expression Denial of Service (ReDoS): The regex contains nested quantifiers `(A+)*`. When matching against a non-matching suffix `'!'`, the Nondeterministic Finite Automaton (NFA) evaluates all $2^{35} \\approx 34$ billion possible backtracking combinations, locking the thread.",
        "The string was too long for memory.",
        "The SSL certificate expired."
      ],
      answerIdx: 1,
      debrief: "ReDoS occurs when regex engines with backtracking encounter ambiguous nested quantifiers. Suffix mismatches force the engine to explore exponential permutations ($O(2^N)$), freezing single-threaded runtimes. Rewriting regexes to eliminate ambiguity or using DFA engines (like Google RE2) neutralizes the exploit."
    },
    quests: [
      { id: "dsa-m2-d56-q1", name: "Algorithmic Complexity Attacks: Hash Flooding & NFA Catastrophic Backtracking", type: "concept", desc: "Deconstruct the mathematics of SipHash-2-4, Thompson NFA construction, and DFA linear regex guarantees." },
      { id: "dsa-m2-d56-q2", name: "War Room Lab: Neutralizing an Active ReDoS Attack on an Auth Gateway", type: "detective", desc: "Audit 20 production regular expressions, identify 4 vulnerable to catastrophic backtracking, and rewrite with linear DFA patterns." },
      { id: "dsa-m2-d56-q3", name: "Mastery Assignment: Keyed SipHash-Protected Secure HashMap Implementation", type: "assignment", desc: "Build a `SecureHashMap<K, V>` in TypeScript incorporating per-instance random cryptographic seeding to defeat hash flooding." },
      { id: "dsa-m2-d56-q4", name: "Production Incident Lab: Hash Collisions Crashing Production Load Balancer", type: "detective", desc: "Triage an incident where malicious HTTP header keys engineered for collision locked HAProxy/Nginx worker processes." }
    ]
  },
  {
    day: 57,
    month: 2,
    blockNum: 11,
    title: "Algorithmic SRE War Room: Stack Overflow Recursion Crashes, Memory Leaks in Cyclic Graph References, Integer Overflows",
    stageName: "Stage 4: Autonomous Production Defense",
    stageNum: 4,
    pedagogicalRole: "Autonomous Execution (SRE War Room Incident Forensics)",
    spokenGoal: "Survive 3 AM algorithmic production war rooms: triage emergency crashes caused by recursive call-stack exhaustion, diagnose memory leaks resulting from cyclic object references in graph structures, and resolve silent arithmetic wrap-around defects in critical financial calculations.",
    conceptInvariant: "Production Resiliency Invariant: Critical algorithmic infrastructure must never rely on unbounded recursion, unchecked integer math, or un-isolated graph references. All algorithms must include bounded recursion depth limits, safe overflow guards, and cycle-breaking weak references.",
    failureMode: "Computing compound interest or geometric growth using standard 32-bit signed integers, causing numbers exceeding $2^{31}-1$ to wrap into negative numbers and crediting millions of dollars to debtor accounts.",
    tryItFriction: "Debug a simulated production incident where a circular reference in an organizational tree structure caused a serialization worker to consume 100% CPU and 4 GB of RAM in an infinite traversal loop.",
    socraticHints: [
      "What is the first operational step in a 3 AM algorithmic crash war room?",
      "Identify the blast radius and isolate the input payload that triggered the pathological behavior!",
      "Apply immediate rate limiting or payload validation while root-cause debugging begins."
    ],
    situationalPuzzle: {
      scenario: "At 3:30 AM, an e-commerce platform's inventory service begins throwing continuous crashes: `Process terminated: out of memory`. Memory heap snapshots show that a graph representing 'Product Accessories' has grown to 500,000 nodes, but 90% of them are orphaned clusters from products deleted months ago that were never garbage collected. Why did the GC fail to collect them?",
      options: [
        "The garbage collector was turned off.",
        "Retained Root References in Cyclic Graphs: A global event listener or cache map held an active reference to one node in the cyclic accessory cluster, preventing the V8/JVM mark-and-sweep garbage collector from reclaiming any node in the connected cycle. Using WeakRefs or explicit disconnects resolves it.",
        "The hard drive was full.",
        "JSON does not support products."
      ],
      answerIdx: 1,
      debrief: "Even modern mark-and-sweep garbage collectors cannot collect cyclic graphs if a single node in the cluster remains reachable from a root reference (such as an uncleaned cache entry or event listener). Breaking references on deletion or using `WeakRef` prevents memory exhaustion."
    },
    quests: [
      { id: "dsa-m2-d57-q1", name: "Algorithmic Incident Management: Blast Radius & Hotfix Deployment Runbooks", type: "concept", desc: "Formulate emergency runbooks for algorithmic outages: circuit breaking, input payload size caps, and fallback bypasses." },
      { id: "dsa-m2-d57-q2", name: "War Room Lab: Triaging the 3 AM Call Stack Exhaustion Crash", type: "detective", desc: "Triage a simulated production crash where deeply nested user comments caused a stack overflow, refactoring to iterative loops." },
      { id: "dsa-m2-d57-q3", name: "Mastery Assignment: Safe Math & Cycle-Resistant Graph Serialization Suite", type: "assignment", desc: "Build a safe-math utility library with overflow detection and a cycle-resistant object graph serializer with depth bounds." },
      { id: "dsa-m2-d57-q4", name: "Production Incident Lab: Integer Wrap Turning Account Balances Negative", type: "detective", desc: "Fix an arithmetic bug where an integer wrap-around in cumulative loyalty point calculation credited debtor balances." }
    ]
  },
  {
    day: 58,
    month: 2,
    blockNum: 11,
    title: "High-Throughput Concurrent Data Structures: Lock-Free Queues (Michael-Scott Queue), Compare-And-Swap (CAS) Loops & ABA Problem",
    stageName: "Stage 4: Autonomous Production Defense",
    stageNum: 4,
    pedagogicalRole: "Autonomous Execution (Lock-Free Synchronization & Atomic Primitives)",
    spokenGoal: "Engineer lock-free concurrent data structures: master atomic Compare-And-Swap (CAS) primitives, implement the classic Michael-Scott Lock-Free Queue, solve the treacherous ABA problem using tagged pointers / version counters, and achieve high-throughput multi-threaded synchronization without mutex locks.",
    conceptInvariant: "Lock-Free Progress Invariant: A concurrent system is Lock-Free if at least one thread is guaranteed to make progress in a finite number of steps, even if other threads stall. Lock-free algorithms rely on atomic CAS loops (`compareAndSwap(expected, desired)`) instead of blocking mutexes.",
    failureMode: "Implementing a lock-free stack with simple atomic pointers without version tags, falling victim to the ABA problem where an address is freed, reallocated, and modified, causing the CAS to succeed falsely and corrupting the stack.",
    tryItFriction: "Implement a Lock-Free Stack (Treiber Stack) using atomic CAS in TypeScript/C++, and demonstrate how adding a 64-bit version counter (`TaggedPointer = { ptr, version }`) completely eliminates the ABA problem.",
    socraticHints: [
      "What is the ABA problem in lock-free concurrency?",
      "Thread 1 reads value A. Before Thread 1 can execute CAS, Thread 2 changes A to B and then back to A. Thread 1's CAS sees 'A' and succeeds, unaware that the underlying memory state was altered!",
      "Use tagged pointers with a monotonic version counter: `(A, 1) -> (B, 2) -> (A, 3)`. Thread 1's CAS expects `(A, 1)` and safely fails."
    ],
    situationalPuzzle: {
      scenario: "A financial trading gateway handles 1,000,000 concurrent trade orders across 32 CPU cores. The original design used a mutex lock around a shared queue. Profiling reveals that threads spend 78% of their time blocked waiting for the mutex lock (lock contention). What data structure architecture eliminates lock contention completely?",
      options: [
        "Use 32 separate queues.",
        "Michael-Scott Lock-Free Queue: Uses atomic Compare-And-Swap (CAS) primitives on head and tail pointers. Threads update pointers concurrently without blocking, guaranteeing that at least one thread makes progress on every CPU cycle.",
        "Disable multi-threading.",
        "Store orders in a database table."
      ],
      answerIdx: 1,
      debrief: "Mutexes put threads to sleep via OS kernel context switches when contention occurs (~1-5 microseconds penalty). Lock-free structures use hardware-level atomic CAS instructions in user space, allowing concurrent access with zero kernel lock overhead."
    },
    quests: [
      { id: "dsa-m2-d58-q1", name: "Lock-Free Concurrency Theory: CAS Loops, Memory Barriers & ABA Proofs", type: "concept", desc: "Analyze atomic hardware instructions (CMPXCHG), acquire/release memory fences, and tagged pointer structures." },
      { id: "dsa-m2-d58-q2", name: "Detective Lab: Reproducing the ABA Memory Corruption in a Treiber Stack", type: "detective", desc: "Simulate a race condition demonstrating how the ABA problem causes node corruption, and verify the tagged pointer fix." },
      { id: "dsa-m2-d58-q3", name: "Mastery Assignment: Michael-Scott Lock-Free Queue Implementation", type: "assignment", desc: "Implement a lock-free queue supporting concurrent `enqueue()` and `dequeue()` using atomic CAS simulation and tagged pointers." },
      { id: "dsa-m2-d58-q4", name: "Production Incident Lab: Live-Lock Starvation in Highly Contended CAS Loops", type: "detective", desc: "Triage a live-lock incident where 64 threads spinning on a single CAS variable starved memory bus bandwidth, and add exponential backoff." }
    ]
  },
  {
    day: 59,
    month: 2,
    blockNum: 11,
    title: "Staff Algorithmic RFC & Architectural Review Board: Writing & Defending an Ultra-Low-Latency Order Matching Engine RFC",
    stageName: "Stage 4: Autonomous Production Defense",
    stageNum: 4,
    pedagogicalRole: "Autonomous Execution (Staff Engineering Governance & RFC Defense)",
    spokenGoal: "Lead algorithmic systems strategy at the Staff level: author a comprehensive Request for Comments (RFC) designing an ultra-low-latency In-Memory Matching Engine, justify every data structure choice (Skip Lists vs B+ Trees vs Binary Heaps), articulate hardware cache trade-offs, and defend the design before the Architectural Review Board.",
    conceptInvariant: "Algorithmic RFC Contract: A production algorithmic RFC must specify: (1) Worst-Case vs Amortized Big-O Bounds, (2) Hardware Memory Footprint and Cache Alignment (64-byte boundaries), (3) Concurrency Model and Contention Resistance, (4) Failure Modes and Algorithmic DoS Defenses, and (5) Fallback and Rollback Strategy.",
    failureMode: "Proposing an algorithmic overhaul based solely on theoretical Big-O notation without benchmarking real-world CPU cache misses, memory allocations, or garbage collection overhead, leading to rejection by the architectural board.",
    tryItFriction: "Write a 5-page formal Engineering RFC proposing a replacement of a legacy relational order book with an in-memory B+ Tree and Skip List matching engine, articulating latency targets, data structures, and migration phases.",
    socraticHints: [
      "Why is theoretical Big-O notation insufficient when presenting to an architectural review board?",
      "Because an $O(N)$ algorithm with great cache locality can outperform an $O(\\log N)$ algorithm that causes random pointer cache misses!",
      "Provide concrete latency benchmarks (p50, p99, p99.9), memory footprint numbers, and hardware counter profiles."
    ],
    situationalPuzzle: {
      scenario: "A Senior Engineer presents an RFC proposing to replace a legacy order book with a balanced AVL tree. The Principal Architect challenges the proposal: 'An order book receives 500,000 order cancellations and limit orders per second, with frequent range scans for price-depth levels. Why is a combination of a Hash Map, B+ Tree, and Circular Ring Buffer superior to an AVL tree for this specific workload?' How do you defend the architecture?",
      options: [
        "Say that AVL trees are easier to code.",
        "Defend using Hardware & Workload Alignment: AVL trees have high rotation overhead on cancellations and poor cache locality. A Hash Map provides $O(1)$ direct order cancel by ID; a B+ Tree provides massive fanout ($H \\le 3$) and linked leaves for instant price-depth range scans; a Circular Ring Buffer provides zero-allocation FIFO execution. This composite architecture optimizes every distinct workload path.",
        "Agree to keep the legacy system.",
        "Tell the architect that AVL trees were invented first."
      ],
      answerIdx: 1,
      debrief: "Staff Engineering requires matching data structures to specific access patterns. Composite architectures—leveraging Hash Maps for lookups, B+ Trees for range depth scans, and ring buffers for FIFO execution—vastly outperform any single generic tree."
    },
    quests: [
      { id: "dsa-m2-d59-q1", name: "The Anatomy of a Production Algorithmic RFC", type: "concept", desc: "Deconstruct high-impact algorithmic RFCs from Jane Street, Citadel, and Google, analyzing latency contracts and trade-offs." },
      { id: "dsa-m2-d59-q2", name: "Detective Lab: Auditing Flaws in a Rejected Low-Latency RFC", type: "detective", desc: "Review a rejected RFC that ignored cache lines and memory allocation, rewrite with PMU benchmarks, and secure approval." },
      { id: "dsa-m2-d59-q3", name: "Mastery Assignment: Authoring a Staff Low-Latency Matching Engine RFC", type: "assignment", desc: "Write a formal 5-section RFC for an ultra-low-latency financial matching engine with full Big-O and memory specifications." },
      { id: "dsa-m2-d59-q4", name: "Production Incident Lab: Un-Benchmarked Algorithmic Rewrite Causing Production Regressions", type: "detective", desc: "Post-mortem an incident where a theoretically 'faster' algorithm ran 3x slower in production due to unmeasured memory allocation churn." }
    ]
  },
  {
    day: 60,
    month: 2,
    blockNum: 11,
    title: "Month 2 Master Capstone Viva Gate: TitanEngine Ultra-Low-Latency In-Memory Matching & Algorithmic Index Engine & Live Oral Defense",
    stageName: "Stage 4: Autonomous Production Defense",
    stageNum: 4,
    pedagogicalRole: "Autonomous Execution (Master Capstone Viva Defense)",
    spokenGoal: "Defend the ultimate algorithmic masterwork: present TitanEngine before a panel of Principal Systems Architects. Defend your ultra-low-latency order matching and indexing engine (10,000,000 ops/sec, cache-conscious B+ Tree, lock-free skip lists, probabilistic Bloom filters, SIMD bitset scans, and zero-allocation arena allocators) in a live adversarial oral defense.",
    conceptInvariant: "TitanEngine Master Contract: The engine must withstand live adversarial cross-examination: (1) P99.9 latency under 2 microseconds across 10,000,000 streaming operations, (2) Zero dynamic heap allocations in hot matching loops ($O(1)$ memory pool operations), (3) Immune to Algorithmic DoS attacks (SipHash keying and linear matching automata), and (4) Strict mathematical correctness verified by automated fuzzing.",
    failureMode: "Failing the Master Capstone Viva by being unable to justify data structure trade-offs, demonstrating memory fragmentation, failing under adversarial collision attacks, or collapsing during live oral defense.",
    tryItFriction: "Subject TitanEngine to an adversarial stress test: inject 10,000,000 mixed orders, cancel requests, and range scans, trigger malicious hash collision payloads, and defend every design boundary before the panel.",
    socraticHints: [
      "What separates an elite Algorithmist from an ordinary developer?",
      "An ordinary developer knows how data structures work in theory; an elite Algorithmist knows how data structures interact with CPU cache lines, memory allocators, instruction pipelines, and adversarial environments!",
      "Defend TitanEngine with mathematical proofs, hardware mechanical sympathy, and production battle scars."
    ],
    situationalPuzzle: {
      scenario: "During the Master Capstone Viva Defense, the Chief Systems Architect asks: 'TitanEngine achieves 10 million operations per second using an in-memory B+ Tree and Arena Allocator. If the machine experiences an abrupt power failure, how does your architecture guarantee zero data loss without slowing down the hot in-memory matching loop with synchronous disk I/O?' How do you defend your architecture?",
      options: [
        "Tell the architect that in-memory engines don't care about power failures.",
        "TitanEngine uses a Sequential Write-Ahead Log (WAL) with Group Commit and Memory-Mapped Files (mmap): mutations append to a sequential ring buffer that flushes to NVMe storage asynchronously in batches, ensuring strict $O(1)$ append latency in the hot loop while meeting ACID durability guarantees.",
        "Save the entire database to a JSON file every second.",
        "Use battery-backed RAM only."
      ],
      answerIdx: 1,
      debrief: "Ultra-low-latency in-memory engines achieve durability via Write-Ahead Logging (WAL) with group commit. Sequential disk appends avoid random I/O stalls, allowing the in-memory matching engine to operate at pure RAM/cache speeds while guaranteeing crash recoverability."
    },
    quests: [
      { id: "dsa-m2-d60-q1", name: "TitanEngine Master Architecture Specification & Hardware Contract", type: "concept", desc: "Document the complete mathematical specification, data structure layouts, cache line boundaries, and benchmarks of TitanEngine." },
      { id: "dsa-m2-d60-q2", name: "Adversarial Stress Lab: The 10,000,000-Operation Throughput & DoS Audit", type: "detective", desc: "Subject TitanEngine to 10M operations, verify zero memory allocation, and test resistance against hash flooding attacks." },
      { id: "dsa-m2-d60-q3", name: "Mastery Assignment: TitanEngine Production Engine Packaging & Caching Suite", type: "assignment", desc: "Package TitanEngine with comprehensive benchmark telemetry, automated fuzz tests, and documentation." },
      { id: "dsa-m2-d60-q4", name: "Month 2 Master Capstone Viva Gate: Live Oral Architectural Defense", type: "assignment", desc: "Defend TitanEngine live before the Senior Architectural Review Board, proving mastery across all 60 days of data structures and algorithms." }
    ]
  }
];
