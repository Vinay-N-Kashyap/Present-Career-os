# scripts/visuals/dist_spec_m1_rest.py
# Month 1 Days 16 to 30 for Course 11: High-Scale Distributed System Design (course-distributed-sys)
# Total Quests: 60 Quests (Days 16–30)

DIST_M1_PART2 = [
  # ─── BLOCK 4: Distributed Synchronization, Locks & Unique ID Generation (Days 16–20) ──
  {
    "day": 16,
    "month": 1,
    "blockNum": 4,
    "title": "Distributed Mutual Exclusion: Token Ring, Ricart-Agrawala Timestamp Algorithm & Centralized Lock Managers",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Mutual Exclusion Algorithms & Message Complexity)",
    "spokenGoal": "Coordinate access to shared distributed resources: examine distributed mutual exclusion algorithms. Compare the Token Ring algorithm (predictable latency, $O(N)$ message overhead), Ricart and Agrawala's timestamp-based decentralized algorithm (using Lamport clocks to order requests with $2(N-1)$ message complexity), and Centralized Lock Managers (low message complexity, single point of failure risk).",
    "conceptInvariant": "Mutual Exclusion Safety Invariant: At any instant in time, at most ONE distributed process may execute within the critical section for a given shared resource. Starvation must be mathematically impossible: requests must be granted in strict causal or Lamport timestamp order.",
    "failureMode": "Implementing decentralized mutual exclusion where a node fails to reply to permission requests while holding a lock: all other nodes in the cluster block indefinitely waiting for permissions, causing total distributed deadlock.",
    "tryItFriction": "Build a Ricart-Agrawala Mutual Exclusion simulator in TypeScript: model 5 nodes contending for a shared resource, verify that permission requests are granted in Lamport timestamp order, and handle node crash timeouts.",
    "socraticHints": [
      "How does the Ricart-Agrawala algorithm resolve contention between two nodes requesting the resource simultaneously?",
      "By comparing their Lamport timestamps: the node with the smaller timestamp wins! If timestamps are identical, the lower process ID breaks the tie.",
      "The losing node defers its reply until after it has exited its own critical section."
    ],
    "situationalPuzzle": {
      "scenario": "Under the Ricart-Agrawala algorithm, Node 1 (timestamp 5) and Node 2 (timestamp 8) both request access to a shared file. Node 3 receives both requests. In what order must Node 3 respond to grant access?",
      "options": [
        "Node 3 responds to Node 2 first.",
        "Reply to Node 1 Immediately, Defer Reply to Node 2: Node 3 immediately grants permission (replies OK) to Node 1 because Node 1 has the lower timestamp (5 < 8). Node 3 only replies to Node 2 after Node 1 releases the resource, enforcing deterministic priority.",
        "Node 3 broadcasts an error.",
        "Node 3 grants access to both simultaneously."
      ],
      "answerIdx": 1,
      "debrief": "Ricart-Agrawala guarantees starvation-free mutual exclusion by prioritizing requests with smaller logical timestamps. The node with the earlier timestamp is granted permission first."
    },
    "quests": [
      { "id": "dist-m1-d16-q1", "name": "Distributed Mutual Exclusion: Centralized vs Token Ring vs Ricart-Agrawala", "type": "concept", "desc": "Compare message complexity per entry/exit, synchronization delay, and fault tolerance across algorithms." },
      { "id": "dist-m1-d16-q2", "name": "Detective Lab: Profiling Message Overhead Spikes in Decentralized Lock Protocols", "type": "detective", "desc": "Measure network message volume scaling as cluster node count increases from 5 to 50 nodes." },
      { "id": "dist-m1-d16-q3", "name": "Mastery Assignment: TypeScript Ricart-Agrawala Distributed Lock Engine", "type": "assignment", "desc": "Implement the complete Ricart-Agrawala algorithm with deferred replies and failure detection." },
      { "id": "dist-m1-d16-q4", "name": "Production Incident Lab: Dead Node Silent Permission Lockout Cluster Stall Triage", "type": "detective", "desc": "Recover a distributed cluster stalled because a crashed node failed to emit lock release tokens." }
    ]
  },
  {
    "day": 17,
    "month": 1,
    "blockNum": 4,
    "title": "Distributed Leases & Locking: Redis Redlock Algorithm, Clock Drift Margins & Martin Kleppmann's Critique",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Lease Safety & The Redlock Debate)",
    "spokenGoal": "Analyze real-world distributed locking: explore Redis Redlock across $N$ independent Redis masters (acquiring locks with TTL on a majority of nodes). Deconstruct Martin Kleppmann's famous critique (How to do distributed locking): examine why GC pauses, process pauses (`SIGSTOP`), network delays, and clock drift can cause a lease to expire while a client STILL believes it holds the lock, resulting in data corruption.",
    "conceptInvariant": "Lock Lease Validity Invariant: A distributed lock lease is valid if and only if: 1) The client acquired the lock on a majority quorum (e.g. 3 of 5 nodes), AND 2) The total elapsed time to acquire the lock is strictly less than the validity time minus clock drift margins: $\\text{elapsed} < \\text{TTL} - \\text{drift}$. Once elapsed time exceeds TTL, the lock is VOID.",
    "failureMode": "A client acquires a Redis lock with a 10-second TTL to write to a storage file. The client experiences an 11-second JVM garbage collection pause. While paused, the lock expires and another client acquires it. The first client resumes and executes the write, overwriting the second client's data (Lost Update Catastrophe).",
    "tryItFriction": "Construct a Redis Redlock manager in TypeScript: simulate quorum acquisition across 5 mock Redis nodes, measure acquisition latency, and enforce lease expiration and heartbeat renewal.",
    "socraticHints": [
      "Why did Martin Kleppmann argue that Redlock is unsafe for correctness without fencing tokens?",
      "Because you cannot prevent a process from pausing (due to GC, page fault, or VM suspension) and writing to storage after its lease has silently expired on the lock server!",
      "A lock alone cannot protect storage; the storage system itself must reject writes from expired lock holders."
    ],
    "situationalPuzzle": {
      "scenario": "A payment service uses Redlock with a 5-second TTL. Node A acquires the lock. At second 4.9, Node A starts writing to S3. Network delay causes the S3 write to arrive at second 6.1. Meanwhile, at second 5.0, the lock expired and Node B acquired it. S3 accepts writes from both. What critical design principle did the developer overlook?",
      "options": [
        "S3 does not support HTTPS.",
        "The Asynchronous Network Lease Trap: Distributed locks with TTLs cannot guarantee mutual exclusion if the storage layer has no mechanism to verify lock freshness. S3 accepted Node A's stale write because S3 does not know about Redis locks. Systems requiring strict correctness MUST use Monotonic Fencing Tokens at the storage layer.",
        "Redis should have been replaced with SQLite.",
        "Node A should have locked S3 with a table lock."
      ],
      "answerIdx": 1,
      "debrief": "As Martin Kleppmann proved, distributed locks with TTLs can only be used for efficiency (avoiding duplicate work), never for correctness. If correctness is required, the storage system must enforce fencing tokens to reject stale writes from paused clients."
    },
    "quests": [
      { "id": "dist-m1-d17-q1", "name": "The Redlock Debate: Salvatore Sanfilippo vs Martin Kleppmann Analysis", "type": "concept", "desc": "Deconstruct timing assumptions, clock drift, process pauses, and quorum validity proofs in Redlock." },
      { "id": "dist-m1-d17-q2", "name": "Detective Lab: Simulating GC Pauses & Lease Expiration Races with Node.js Timers", "type": "detective", "desc": "Trigger artificial process pauses to observe concurrent execution in lock-protected critical sections." },
      { "id": "dist-m1-d17-q3", "name": "Mastery Assignment: TypeScript Multi-Master Redlock Manager with Auto-Renew Heartbeat", "type": "assignment", "desc": "Build a Redlock implementation supporting majority quorum acquisition, drift calculation, and background renew." },
      { "id": "dist-m1-d17-q4", "name": "Production Incident Lab: Garbage Collection Pause Distributed Lock Invalidation Outage", "type": "detective", "desc": "Resolve a high-severity data corruption incident caused by JVM GC pauses invalidating Redis lock leases." }
    ]
  },
  {
    "day": 18,
    "month": 1,
    "blockNum": 4,
    "title": "Fencing Tokens: Monotonic Epoch Counters, Storage Fencing & Split-Brain Mutation Prevention",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Fencing Token Invariants & End-to-End Safety)",
    "spokenGoal": "Implement the definitive solution to the distributed locking dilemma: Fencing Tokens. Understand how a lock server assigns a monotonically increasing integer token (Epoch counter $1, 2, 3, ...$) whenever a lock is granted. Learn how the underlying storage system (database, file system) checks the incoming fencing token and rejects any write whose token is less than the highest token previously seen.",
    "conceptInvariant": "Monotonic Storage Fencing Invariant: For every write operation associated with lock token $T$, the storage system must execute: `if (token < max_token_seen) { reject(); } else { max_token_seen = token; write(); }`. A paused or zombie client holding an older token $T_1$ will be rejected when attempting to write after a newer client has committed with token $T_2$ ($T_2 > T_1$).",
    "failureMode": "Failing to check the fencing token at the storage layer: assuming that receiving a token from the lock manager automatically protects the database without writing `WHERE fencing_token >= current_token` in the SQL update statement.",
    "tryItFriction": "Construct a Fencing Token Lock Server and Fenced Storage Engine in TypeScript: simulate a client experiencing a simulated 5-second sleep, prove that its subsequent write is rejected by the storage layer with `FENCING_TOKEN_STALE`.",
    "socraticHints": [
      "Where does the fencing token check actually happen?",
      "At the target resource / storage engine itself (e.g. database row, file system, or S3 object metadata)!",
      "The lock service generates the number; the storage engine enforces the check."
    ],
    "situationalPuzzle": {
      "scenario": "Client 1 acquires a lock and receives fencing token 33. Client 1 pauses. The lock expires. Client 2 acquires the lock, receives fencing token 34, and writes to the database. Client 1 wakes up and issues: `UPDATE resource SET data = 'C1', token = 33 WHERE id = 1 AND token < 33`. What does the database do?",
      "options": [
        "It overwrites Client 2's data.",
        "Zero Rows Updated (Rejection): Because Client 2 previously set `token = 34`, the condition `token < 33` evaluates to false. 0 rows are updated. Client 1's stale write is completely neutralized by the storage engine, preserving Client 2's data.",
        "The database crashes.",
        "The database merges both updates."
      ],
      "answerIdx": 1,
      "debrief": "Fencing tokens push the correctness check into the storage layer. By enforcing that writes must present a token strictly greater than the currently stored token, stale writes from paused clients are cleanly rejected."
    },
    "quests": [
      { "id": "dist-m1-d18-q1", "name": "Fencing Token Architecture: Lock Service Generation vs Storage Enforcement", "type": "concept", "desc": "Formalize the end-to-end verification protocol between client, lock coordinator, and fenced storage." },
      { "id": "dist-m1-d18-q2", "name": "Detective Lab: Inspecting Apache ZooKeeper zxid & cversion as Native Fencing Tokens", "type": "detective", "desc": "Observe how ZooKeeper sequential znodes and version numbers act as atomic monotonic fencing tokens." },
      { "id": "dist-m1-d18-q3", "name": "Mastery Assignment: TypeScript Monotonic Fencing Token Coordinator & Storage Guard", "type": "assignment", "desc": "Build an end-to-end lock server and storage repository rejecting stale writes based on epoch tokens." },
      { "id": "dist-m1-d18-q4", "name": "Production Incident Lab: Zombie Process Stale Write Data Corruption Forensic Triage", "type": "detective", "desc": "Investigate and resolve a data overwrite incident by refactoring a legacy lock system to use fencing tokens." }
    ]
  },
  {
    "day": 19,
    "month": 1,
    "blockNum": 4,
    "title": "Globally Unique Distributed ID Generation: Twitter Snowflake 64-Bit IDs, ULID & UUIDv7",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (High-Throughput Distributed ID Architecture)",
    "spokenGoal": "Generate billions of globally unique, roughly time-ordered IDs without central database bottlenecks: analyze Twitter's 64-bit Snowflake architecture (1 sign bit, 41-bit timestamp ms, 10-bit machine/datacenter ID, 12-bit sequence counter = 4,096 IDs per ms per node). Compare Snowflake against 128-bit Universally Unique Lexicographically Sortable Identifiers (ULID) and RFC 9562 UUIDv7.",
    "conceptInvariant": "Snowflake Bit-Packing & Monotonicity Invariant: A 64-bit Snowflake ID encodes: `(timestamp << 22) | (nodeId << 12) | sequence`. IDs generated across the cluster are globally unique without inter-node coordination, and sort chronologically naturally when indexed in B+ Trees, avoiding B-tree page fragmentation caused by random UUIDv4.",
    "failureMode": "A server's system clock jumps backward by 50ms due to NTP correction while generating IDs: the generator begins re-issuing timestamps it already used, causing primary key collisions and database unique constraint violations.",
    "tryItFriction": "Construct a Twitter Snowflake ID generator in TypeScript: pack 64-bit BigInts, handle sequence counter overflow within the same millisecond by waiting for the next millisecond, and detect clock backwards jumps.",
    "socraticHints": [
      "Why is random UUIDv4 catastrophic for database primary keys compared to time-ordered UUIDv7 or Snowflake?",
      "Because UUIDv4 is completely random, inserting new rows forces random writes across scattered B+ tree leaf pages, destroying CPU cache locality and causing massive page splits and table bloat!",
      "Time-ordered IDs append contiguously to the rightmost leaf of the B+ tree."
    ],
    "situationalPuzzle": {
      "scenario": "An e-commerce order service generates 10,000 orders/ms across 4 worker nodes using Snowflake. An NTP synchronization step steps the clock backward by 12ms on Node 2. What must Node 2's Snowflake generator do to preserve unique ID safety?",
      "options": [
        "Continue generating IDs normally.",
        "Refuse to Generate IDs (Wait or Error): The generator must detect `current_time < last_timestamp`. If the backward drift is small (< 5ms), it pauses execution until the clock catches up; if drift is large, it throws a fatal error (`ClockMovedBackwardsException`) to prevent duplicate ID generation.",
        "Generate random numbers.",
        "Decrement the sequence counter."
      ],
      "answerIdx": 1,
      "debrief": "Snowflake generators must strictly protect against backward clock jumps. If the clock moves backward, generating IDs with the current time would reproduce previously generated timestamp-sequence combinations, causing duplicate primary keys."
    },
    "quests": [
      { "id": "dist-m1-d19-q1", "name": "Distributed ID Architectures: Snowflake 64-Bit vs ULID 128-Bit vs UUIDv7 RFC 9562", "type": "concept", "desc": "Compare bit allocations, rollover life spans (Snowflake 69 years), entropy, and B+ tree index locality." },
      { "id": "dist-m1-d19-q2", "name": "Detective Lab: Profiling B+ Tree Page Split Bloat: UUIDv4 vs UUIDv7 Primary Keys", "type": "detective", "desc": "Benchmark insert throughput and index file size growth in PostgreSQL comparing random vs time-ordered UUIDs." },
      { "id": "dist-m1-d19-q3", "name": "Mastery Assignment: High-Throughput TypeScript Snowflake ID Generator with Clock Guard", "type": "assignment", "desc": "Build a 64-bit BigInt Snowflake generator handling sequence overflow and clock backward pause handling." },
      { "id": "dist-m1-d19-q4", "name": "Production Incident Lab: NTP Backward Clock Jump Duplicate Primary Key Outage", "type": "detective", "desc": "Triage a production database collision crisis where an un-guarded Snowflake generator produced duplicate order IDs." }
    ]
  },
  {
    "day": 20,
    "month": 1,
    "blockNum": 4,
    "title": "\u2b50 MILESTONE 4: High-Throughput 64-Bit Distributed Snowflake ID Generator with Clock Backward Protection",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Milestone Gate: Distributed Identity Engine)",
    "spokenGoal": "Assemble Milestone 4: Build an enterprise-grade Distributed ID Generator in TypeScript. Support 64-bit BigInt bit packing, 10-bit dynamic node ID coordination via ZooKeeper/etcd leases, 12-bit sequence rollover handling (up to 4,096 IDs/ms per node = 4.09 million IDs/sec), clock backward drift detection with waiting loops, and high-speed batch ID generation.",
    "conceptInvariant": "Zero-Collision Monotonicity Invariant: The generator must guarantee that across $N$ concurrent distributed nodes generating millions of IDs, every ID is strictly unique globally. Within any single node, IDs generated in successive calls must be strictly monotonically increasing: $\\text{ID}_{k+1} > \\text{ID}_k$.",
    "failureMode": "Failing to handle millisecond sequence overflow: when a single node receives 5,000 requests in a single millisecond, the sequence counter rolls over to 0 without waiting for the next millisecond, producing identical IDs to those issued at the start of that same millisecond.",
    "tryItFriction": "Pass the Milestone 4 verification battery: generate 1,000,000 IDs across 16 virtual nodes concurrently, verify zero collisions using a hash set, inject synthetic clock backward events, and prove continuous monotonic ordering.",
    "socraticHints": [
      "What happens when the 12-bit sequence counter reaches 4095 in the same millisecond?",
      "The generator must block or loop in a busy-wait until the system clock advances to the next millisecond (`timestamp > lastTimestamp`), resetting the sequence counter to 0!",
      "This guarantees that no more than 4,096 IDs can ever be produced per millisecond per node."
    ],
    "situationalPuzzle": {
      "scenario": "Your Milestone 4 generator produces 4,096 IDs in millisecond 1000. Request 4,097 arrives in the exact same millisecond. What must the generator return for request 4,097?",
      "options": [
        "Return an error immediately.",
        "Wait for Millisecond 1001 & Return ID with Sequence 0: The generator must wait until the system clock reaches at least millisecond 1001, set sequence to 0, update lastTimestamp to 1001, and emit the ID. This maintains monotonicity and prevents duplicate sequence allocations.",
        "Wrap around to sequence 0 in millisecond 1000.",
        "Generate a random UUID."
      ],
      "answerIdx": 1,
      "debrief": "When sequence capacity is exhausted within a single millisecond, the generator must pause execution until the clock advances to the next millisecond, where sequence counters reset to 0."
    },
    "quests": [
      { "id": "dist-m1-d20-q1", "name": "Milestone 4 Architecture: Snowflake System Blueprint & Node Leasing", "type": "concept", "desc": "Design bitmask layouts, dynamic node ID lease allocation via etcd, and sequence rollover logic." },
      { "id": "dist-m1-d20-q2", "name": "Detective Lab: Stress Testing 1,000,000 ID Generations for Monotonicity & Uniqueness", "type": "detective", "desc": "Execute automated multi-threaded stress tests verifying zero collisions and verifying strict bit packing." },
      { "id": "dist-m1-d20-q3", "name": "Mastery Assignment: Full TypeScript 64-Bit Distributed Snowflake ID Engine", "type": "assignment", "desc": "Build the complete Milestone 4 engine supporting BigInt bit manipulation, clock protection, and batch generation." },
      { "id": "dist-m1-d20-q4", "name": "Production Incident Lab: Sequence Rollover Collision Data Loss Forensic Triage", "type": "detective", "desc": "Resolve a high-severity production collision caused by a flawed sequence overflow implementation." }
    ]
  },

  # ─── BLOCK 5: Distributed Consensus & Leader Election (Days 21–25) ─────────────
  {
    "day": 21,
    "month": 1,
    "blockNum": 5,
    "title": "Classical Leader Election: Bully Algorithm, Ring Election Algorithm & Network Partition Flapping",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Classical Leader Election & Consensus Precursors)",
    "spokenGoal": "Study classical distributed coordination: examine Hector Garcia-Molina's 1982 Bully Algorithm (the active node with the highest ID bullies smaller nodes into submission and declares itself coordinator) and Chang & Roberts' Ring Election Algorithm. Identify why classical algorithms collapse under network partitions and flapping links, motivating modern quorum-based consensus.",
    "conceptInvariant": "Leader Uniqueness vs Partition Vulnerability Invariant: The Bully Algorithm guarantees single leadership in a fully connected network without partitions. However, if a network partition splits the cluster into two halves, both halves will independently elect their highest-ID node as leader, causing an immediate Split-Brain catastrophe.",
    "failureMode": "Deploying the Bully Algorithm in a multi-datacenter cloud environment: an intermittent network partition severs communication between US-East and US-West, causing both regions to elect local leaders and accept conflicting writes on the same customer accounts.",
    "tryItFriction": "Build a Bully Leader Election simulator in TypeScript: simulate node failures, message passing (ELECTION, ANSWER, COORDINATOR), and observe how an isolated node with the highest ID causes continuous election storms.",
    "socraticHints": [
      "Why is the Bully Algorithm called the 'Bully' algorithm?",
      "Because any node with a higher ID can bully smaller nodes by sending an 'ANSWER' message that silences them and takes over the election!",
      "The node with the highest ID always wins, assuming it is alive and reachable."
    ],
    "situationalPuzzle": {
      "scenario": "A 5-node cluster (IDs 1 to 5) uses the Bully Algorithm. Node 5 crashes. Node 2 notices the failure and starts an election. Which nodes does Node 2 send an ELECTION message to?",
      "options": [
        "To all nodes (1, 3, 4, 5).",
        "To nodes with higher IDs only (3, 4, 5): In the Bully Algorithm, a node only challenges nodes with higher IDs than itself. If any higher node responds, Node 2 steps down and waits for that higher node to conclude the election.",
        "To Node 1 only.",
        "It declares itself leader immediately."
      ],
      "answerIdx": 1,
      "debrief": "The Bully Algorithm optimizes message passing by having candidates message only nodes with higher IDs. If no higher node responds, the candidate declares itself coordinator."
    },
    "quests": [
      { "id": "dist-m1-d21-q1", "name": "Classical Election Algorithms: Bully vs Ring Complexity & Fault Models", "type": "concept", "desc": "Derive message complexity ($O(N^2)$ worst-case for Bully, $O(N \\log N)$ for Ring) and failure resilience." },
      { "id": "dist-m1-d21-q2", "name": "Detective Lab: Simulating Network Flapping & Continuous Election Storms in Bully Clusters", "type": "detective", "desc": "Model intermittent packet drop on high-ID nodes and measure CPU exhaustion caused by election storms." },
      { "id": "dist-m1-d21-q3", "name": "Mastery Assignment: TypeScript Bully & Ring Leader Election Protocol Simulator", "type": "assignment", "desc": "Build a distributed node cluster executing Bully elections with timeout detection and coordinator announcements." },
      { "id": "dist-m1-d21-q4", "name": "Production Incident Lab: Network Partition Split-Brain Dual-Leader Disaster Triage", "type": "detective", "desc": "Triage a dual-leader split-brain incident caused by relying on non-quorum classical election algorithms." }
    ]
  },
  {
    "day": 22,
    "month": 1,
    "blockNum": 5,
    "title": "Consensus Foundations: Paxos Protocol (Single-Decree Paxos: Propose, Promise, Accept, Accepted)",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (The Paxos Consensus Protocol)",
    "spokenGoal": "Conquer the foundational mountain of distributed consensus: Leslie Lamport's Paxos protocol. Deconstruct Single-Decree Paxos across Proposers, Acceptors, and Learners. Master Phase 1 (Prepare / Promise with proposal numbers $n$) and Phase 2 (Accept / Accepted), prove why majority quorums ($Q_1 \\cap Q_2 \\ne \\emptyset$) guarantee agreement, and analyze Paxos Dueling Proposer Livelocks.",
    "conceptInvariant": "Paxos Quorum Intersection Invariant: Any two majority quorums in a cluster of $2F + 1$ nodes must share at least one acceptor node ($|Q_1 \\cap Q_2| \\ge 1$). Since an acceptor only accepts a proposal if its number is $\\ge$ any promise previously granted, a previously chosen value is guaranteed to be discovered by any subsequent proposal in Phase 1.",
    "failureMode": "Two competing proposers simultaneously submit alternating higher proposal numbers in Phase 1 (Proposer 1 sends $n=1$, Proposer 2 sends $n=2$, Proposer 1 sends $n=3$, ...): neither can ever complete Phase 2, trapping the cluster in an infinite Dueling Proposer Livelock.",
    "tryItFriction": "Implement Single-Decree Paxos in TypeScript: model Proposers and Acceptors exchanging Prepare, Promise, Accept, and Accepted RPCs, proving that even with concurrent conflicting proposals, exactly one value is chosen.",
    "socraticHints": [
      "Why must proposal numbers be unique across all proposers?",
      "So that two proposers never propose the same number! Typically, proposal numbers are formatted as `(round_number << 16) | proposer_id`.",
      "The unique ID breaks ties while maintaining a total ordering across proposal numbers."
    ],
    "situationalPuzzle": {
      "scenario": "In a 5-acceptor Paxos cluster, Proposer A receives Promise messages from Acceptors {1, 2, 3}. Acceptor 2 reports it previously accepted value 'V1' at proposal number 10. Acceptors 1 and 3 report no previously accepted value. What value must Proposer A propose in Phase 2?",
      "options": [
        "It can propose any new value it wants.",
        "It MUST propose 'V1': Paxos Phase 1 rule dictates that if any acceptor in the promise quorum has previously accepted a value, the proposer is legally bound to adopt the value with the highest proposal number reported ('V1'). This preserves values that may have already been chosen.",
        "It must abort and restart.",
        "It proposes NULL."
      ],
      "answerIdx": 1,
      "debrief": "A proposer in Paxos does not have absolute freedom to choose its own value. If acceptors have already accepted a value in a previous round, the proposer must adopt that value to guarantee consistency."
    },
    "quests": [
      { "id": "dist-m1-d22-q1", "name": "Single-Decree Paxos Mathematical Proof of Consistency", "type": "concept", "desc": "Formalize the invariant proof: if a value $v$ is chosen at proposal number $n$, any proposal $m > n$ must propose $v$." },
      { "id": "dist-m1-d22-q2", "name": "Detective Lab: Tracing Paxos Message Exchanges & Dueling Proposer Livelocks", "type": "detective", "desc": "Simulate two concurrent proposers to observe the classic livelock and evaluate randomized backoff mitigations." },
      { "id": "dist-m1-d22-q3", "name": "Mastery Assignment: TypeScript Single-Decree Paxos Protocol Implementation", "type": "assignment", "desc": "Build a complete Paxos engine with Proposer, Acceptor, and Learner state machines passing majority checks." },
      { "id": "dist-m1-d22-q4", "name": "Production Incident Lab: Paxos Dueling Proposer Livelock Infinite Hang Triage", "type": "detective", "desc": "Mitigate a production consensus stall caused by competing proposers repeatedly interrupting each other's ballots." }
    ]
  },
  {
    "day": 23,
    "month": 1,
    "blockNum": 5,
    "title": "Multi-Paxos & Raft Protocol: Leader Leases, Log Compaction, Snapshots & Cluster Membership Changes",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Multi-Instance Consensus & Log Compaction)",
    "spokenGoal": "Move from single-value consensus to replicated distributed logs: analyze Multi-Paxos (amortizing Phase 1 across multiple log entries by establishing a stable leader). Compare Multi-Paxos against Raft, master Leader Leases for zero-consensus local reads, explore Log Compaction using in-memory snapshots, and examine dynamic cluster membership changes (joint consensus).",
    "conceptInvariant": "Multi-Paxos Phase 1 Amortization Invariant: Once a Multi-Paxos leader is established via a single successful Phase 1 Prepare round, it can execute Phase 2 (Accept / Accepted) directly for thousands of subsequent log slots without running Phase 1 again, achieving consensus in a single network round-trip ($1\\text{ RTT}$).",
    "failureMode": "Allowing an uncompacted consensus log to grow for 6 months: the server runs out of disk space, and restarting a crashed replica takes 8 hours because it must replay 500 million raw log entries from slot 1.",
    "tryItFriction": "Build a Log Compaction & Snapshotting manager in TypeScript: take an active state machine state, serialize an atomic snapshot to virtual disk, prune committed log entries preceding the snapshot, and stream the snapshot to a lagging peer.",
    "socraticHints": [
      "Why is a Leader Lease faster than running consensus for read queries in Raft/Multi-Paxos?",
      "Because if the leader holds a valid time-bounded lease guaranteed by majority consensus, it knows no other leader can be elected during the lease window, allowing it to serve reads locally in $0\\text{ RTT}$!",
      "Clock drift must be accounted for to prevent serving stale reads near lease expiry."
    ],
    "situationalPuzzle": {
      "scenario": "A 3-node Raft cluster wants to add 2 new nodes (expanding to 5 nodes). If the administrator simply updates the configuration file on all servers and restarts them, what race condition can violate consensus safety during the transition?",
      "options": [
        "The cluster CPU will spike.",
        "Split-Brain During Configuration Change: In the old config (3 nodes), a majority is 2. In the new config (5 nodes), a majority is 3. If nodes switch at slightly different times, 2 nodes can form a majority under the old config and elect Leader A, while 3 nodes form a majority under the new config and elect Leader B simultaneously! Raft prevents this via Joint Consensus.",
        "Node IDs must be prime numbers.",
        "Consensus clusters cannot change size."
      ],
      "answerIdx": 1,
      "debrief": "Changing cluster membership cannot be done naively in a single step because overlapping majorities can elect dual leaders. Raft solves this using Joint Consensus ($C_{\\text{old,new}}$) or single-server entry transitions."
    },
    "quests": [
      { "id": "dist-m1-d23-q1", "name": "Multi-Paxos vs Raft Protocol Deep Architectural Comparison", "type": "concept", "desc": "Compare leader election, log matching, log holes, and implementation complexity across protocols." },
      { "id": "dist-m1-d23-q2", "name": "Detective Lab: Profiling Snapshot Generation & Log Compaction Latency in Raft Engines", "type": "detective", "desc": "Measure I/O write spikes and memory usage during state machine snapshot creation under load." },
      { "id": "dist-m1-d23-q3", "name": "Mastery Assignment: TypeScript Consensus Log Compactor & Snapshot Streamer", "type": "assignment", "desc": "Build an automated log compaction module that truncates committed logs and streams snapshots to followers." },
      { "id": "dist-m1-d23-q4", "name": "Production Incident Lab: Disk Full Consensus Crash Log Compaction Failure War Room", "type": "detective", "desc": "Recover a dead consensus cluster where uncompacted WAL files filled 100% of available disk space." }
    ]
  },
  {
    "day": 24,
    "month": 1,
    "blockNum": 5,
    "title": "Coordination Services: Apache ZooKeeper (Zab Protocol, Ephemeral Nodes, Watchers) & etcd (Raft-Backed v3 MVCC)",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Production Coordination Engines)",
    "spokenGoal": "Master the nervous systems of production infrastructure: compare Apache ZooKeeper (Zab protocol, hierarchical znode tree, Ephemeral nodes, one-time Watchers) versus CoreOS etcd (Raft consensus, flat key-value namespace with range queries, MVCC revisions, persistent Watch streams, and Lease grants).",
    "conceptInvariant": "Ephemeral Node Session Invariant: In ZooKeeper / etcd, an Ephemeral node or Lease is bound to the client's active TCP heartbeat session. If the client fails to renew its heartbeat within the session timeout (e.g. node crash or network drop), the coordination cluster automatically deletes the node/lease, triggering immediate watcher events across the cluster.",
    "failureMode": "Relying on a single ZooKeeper watcher without re-registering it in application code: in ZooKeeper, watchers are strictly one-time triggers! After the first event fires, subsequent mutations to that znode trigger zero alerts, leaving the application permanently oblivious to cluster changes.",
    "tryItFriction": "Construct an etcd-style MVCC key-value store in TypeScript: support monotonic `revision` numbers, revision-based historical range queries, lease grants with TTL expiration, and event watch streams.",
    "socraticHints": [
      "Why did Kubernetes choose etcd v3 over ZooKeeper?",
      "Because etcd v3 provides a clean gRPC API, persistent multi-event Watch streams (eliminating ZooKeeper's fragile one-time watcher resets), and MVCC revisions that allow K8s controllers to resume watching from exact historical revisions!",
      "etcd v3 eliminates watcher re-registration races."
    ],
    "situationalPuzzle": {
      "scenario": "A Kubernetes cluster has 1,000 pods watching a ConfigMap via etcd. The ConfigMap is updated. What happens in etcd v3 compared to ZooKeeper 3.4?",
      "options": [
        "All pods crash.",
        "Persistent Stream vs Thundering Watcher Reset: In ZooKeeper 3.4, the update triggers 1,000 one-time watchers. All 1,000 pods must immediately issue new `getData()` calls to re-register their watchers, causing a massive thundering herd on ZooKeeper. In etcd v3, gRPC watch streams are persistent and deliver the updated key-value payload directly inside the stream event with zero re-registration requests.",
        "etcd drops 50% of the watches.",
        "ConfigMaps cannot be updated dynamically."
      ],
      "answerIdx": 1,
      "debrief": "etcd v3's persistent gRPC streaming watches include the updated data payload directly in the event, eliminating the thundering herd problem common in older coordination services like ZooKeeper where clients had to re-fetch data."
    },
    "quests": [
      { "id": "dist-m1-d24-q1", "name": "Coordination Systems: ZooKeeper Zab vs etcd v3 Raft & MVCC Architecture", "type": "concept", "desc": "Map data structures, watcher semantics, lease tracking, and high-concurrency scaling limits." },
      { "id": "dist-m1-d24-q2", "name": "Detective Lab: Inspecting etcdctl MVCC Revisions & Compacted History Windows", "type": "detective", "desc": "Query etcd revisions, test historical queries, and observe `required revision has been compacted` errors." },
      { "id": "dist-m1-d24-q3", "name": "Mastery Assignment: TypeScript etcd-Style MVCC Store with Revision Watchers", "type": "assignment", "desc": "Build an MVCC key-value repository with revision increments, lease expiration, and continuous watch emitters." },
      { "id": "dist-m1-d24-q4", "name": "Production Incident Lab: ZooKeeper One-Time Watcher Missed Event Outage Triage", "type": "detective", "desc": "Resolve a distributed worker failure where missed one-time watcher triggers caused configuration drift." }
    ]
  },
  {
    "day": 25,
    "month": 1,
    "blockNum": 5,
    "title": "\u2b50 MILESTONE 5: Distributed Leader Election & Dynamic Cluster Membership Engine with etcd Leases",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Milestone Gate: Distributed Cluster Coordination)",
    "spokenGoal": "Assemble Milestone 5: Build a production-grade Distributed Leader Election and Dynamic Cluster Membership Engine in TypeScript backed by etcd-style Lease contracts. Support TTL lease renewals with jittered heartbeats, atomic Compare-And-Swap (CAS) leader acquisition, watcher event notifications for immediate standby failover, and split-brain fencing.",
    "conceptInvariant": "Leader Lease Exclusivity Invariant: At any instant in time, at most ONE node in the cluster may hold a valid unexpired lease for the leader election key. If the leader fails to renew its lease before TTL expires, the coordination service invalidates the lease and promotes a standby node within $\\le 2\\text{ seconds}$.",
    "failureMode": "A leader thread experiences a GC pause that exceeds the lease TTL: the lease expires and a standby node promotes itself. The old leader resumes and attempts to perform leadership actions without checking lease validity, issuing conflicting commands.",
    "tryItFriction": "Pass the Milestone 5 integration battery: deploy 5 simulated worker nodes contending for leadership, inject unexpected node kills, simulate network disconnects, and verify seamless failover with zero split-brain intervals.",
    "socraticHints": [
      "How does a node acquire leadership atomically in an etcd-style system?",
      "Using a transactional Compare-And-Swap (CAS): `txn.If(CreateRevision(key) == 0).Then(Put(key, myNodeId, leaseId))`!",
      "The key is created if and only if it does not already exist, guaranteeing atomic single-winner elections."
    ],
    "situationalPuzzle": {
      "scenario": "In your Milestone 5 engine, Leader Node 1 loses network contact with the etcd cluster. Node 1's local lease timer has not yet expired, but etcd's server-side lease timer HAS expired, promoting Node 2. How must Node 1 detect that it is no longer the leader?",
      "options": [
        "It can never detect it.",
        "Client Lease Heartbeat Failure & Self-Fencing: When Node 1 attempts its next heartbeat renewal RPC and fails to reach etcd, or when its local lease validity window expires without a confirmed server renewal response, it must immediately self-fence and demote itself to standby, revoking all leadership authorities.",
        "Node 2 sends an email to Node 1.",
        "The OS terminates Node 1."
      ],
      "answerIdx": 1,
      "debrief": "A leader must actively verify its lease. If a leader cannot communicate with the coordination quorum to renew its lease, it must assume it has been deposed and immediately self-fence to avoid split-brain execution."
    },
    "quests": [
      { "id": "dist-m1-d25-q1", "name": "Milestone 5 Architecture: Lease-Backed Leader Election Blueprint", "type": "concept", "desc": "Design CAS election transactions, lease heartbeat loops, failover watcher pipelines, and fencing mechanisms." },
      { "id": "dist-m1-d25-q2", "name": "Detective Lab: Benchmarking Failover Detection Latency under Varying Lease TTLs", "type": "detective", "desc": "Measure time-to-failover across lease TTLs of 1s, 5s, and 15s to balance failover speed against heartbeat overhead." },
      { "id": "dist-m1-d25-q3", "name": "Mastery Assignment: Full TypeScript Distributed Leader Election Engine with Leases", "type": "assignment", "desc": "Implement the complete Milestone 5 coordination engine with CAS elections, heartbeat renewals, and failover." },
      { "id": "dist-m1-d25-q4", "name": "Production Incident Lab: Split-Brain Dual-Leader Cluster Outage Forensic Triage", "type": "detective", "desc": "Remediate a split-brain outage where an isolated leader continued processing writes after lease expiration." }
    ]
  },

  # ─── BLOCK 6: Edge Routing, Load Balancing & Gateway Capstone (Days 26–30) ────
  {
    "day": 26,
    "month": 1,
    "blockNum": 6,
    "title": "Load Balancing Algorithms: Consistent Hashing, Peak EWMA, Power of Two Random Choices (P2C)",
    "stageName": "Stage 3: Autonomous Synthesis",
    "stageNum": 3,
    "pedagogicalRole": "Low Guidance (Advanced Load Balancing & Traffic Dispatch)",
    "spokenGoal": "Transcend naive Round-Robin load balancing: master modern edge and service-mesh dispatch algorithms. Analyze Round-Robin, Weighted Round-Robin, Least Connections, and Michael Mitzenmacher's Power of Two Random Choices (P2C) with Peak Exponentially Weighted Moving Average (Peak EWMA) latency weighting (used in Finagle, Envoy, and Linkerd) to eliminate the herd effect.",
    "conceptInvariant": "Power of Two Random Choices (P2C) Invariant: Instead of checking all $N$ backend servers (which causes concurrent clients to pile onto the same single 'least loaded' server), P2C randomly picks TWO candidate servers and selects the one with better latency/load. This reduces maximum queue length from $O(\\ln N / \\ln \\ln N)$ to $O(\\ln \\ln N / \\ln 2)$, achieving near-perfect load balance with zero coordination.",
    "failureMode": "Using simple Least-Connections load balancing across 100 API servers: all 1,000 client instances concurrently query server metrics, all identify Server 42 as having the fewest connections, and all 1,000 clients simultaneously send requests to Server 42, crushing it into an instant CPU freeze (The Herd Effect).",
    "tryItFriction": "Implement Round-Robin, Least-Connections, and P2C with Peak EWMA in TypeScript: simulate 100,000 requests against a pool of 20 heterogeneous backend servers with varying processing latencies, measuring queue variance and P99 latency.",
    "socraticHints": [
      "Why is Peak EWMA superior to standard moving average latency in load balancers?",
      "Because Peak EWMA penalizes recent latency spikes heavily while decaying gracefully, steering traffic away from servers experiencing GC pauses or thermal throttling before they become full outages!",
      "It reacts quickly to degradation and recovers steadily."
    ],
    "situationalPuzzle": {
      "scenario": "A load balancer distributes requests across 50 servers. Server 12 suffers a memory leak and its GC pauses jump from 2ms to 500ms. Under Round-Robin, what happens to overall system P99 latency? What happens under P2C with Peak EWMA?",
      "options": [
        "Round-Robin speeds up; P2C slows down.",
        "Round-Robin P99 Collapses (Sends 2% of all traffic into the slow server, destroying P99 SLA); P2C Peak EWMA Automatically Evades Server 12: Peak EWMA detects the elevated latency on Server 12 within a few requests, driving its selection probability close to zero and protecting global P99 latency.",
        "Both algorithms perform identically.",
        "Envoy crashes."
      ],
      "answerIdx": 1,
      "debrief": "Round-Robin blindly sends an equal share of traffic to all nodes regardless of their health, allowing a single degraded server to poison global P99 latency. P2C with Peak EWMA dynamically routes traffic around struggling nodes."
    },
    "quests": [
      { "id": "dist-m1-d26-q1", "name": "Load Balancing Mathematical Foundations: P2C, EWMA & Queue Length Bounds", "type": "concept", "desc": "Formalize the balls-into-bins proof for Power of Two Random Choices and Peak EWMA decay equations." },
      { "id": "dist-m1-d26-q2", "name": "Detective Lab: Profiling Envoy Proxy Load Balancing Policies (ROUND_ROBIN vs LEAST_REQUEST vs MAGLEV)", "type": "detective", "desc": "Configure Envoy proxies and observe backend traffic distribution and latency profiles under load." },
      { "id": "dist-m1-d26-q3", "name": "Mastery Assignment: TypeScript High-Scale Load Balancer with P2C Peak EWMA Engine", "type": "assignment", "desc": "Build an intelligent traffic dispatcher implementing P2C with moving average latency and inflight tracking." },
      { "id": "dist-m1-d26-q4", "name": "Production Incident Lab: Round-Robin Slow Node P99 Latency Contagion Triage", "type": "detective", "desc": "Resolve a high-severity customer latency spike caused by round-robin routing hitting a throttling backend." }
    ]
  },
  {
    "day": 27,
    "month": 1,
    "blockNum": 6,
    "title": "Traffic Shaping & Rate Limiting: Token Bucket, Leaky Bucket, Sliding Window Counter in Redis (Lua Scripts)",
    "stageName": "Stage 3: Autonomous Synthesis",
    "stageNum": 3,
    "pedagogicalRole": "Low Guidance (Rate Limiting Algorithms & Distributed Enforcement)",
    "spokenGoal": "Protect distributed systems from resource exhaustion and DDoS: compare the four canonical rate-limiting algorithms: Token Bucket (supports bursts), Leaky Bucket (smooth constant output rate), Fixed Window Counter (vulnerable to 2x boundary spikes), and Sliding Window Counter. Implement distributed rate limiting in Redis using atomic single-roundtrip Lua scripts.",
    "conceptInvariant": "Atomic Distributed Rate Limiting Invariant: In a distributed system with dozens of API gateway instances, rate limit counters must be updated and evaluated atomically in the shared cache (Redis) in a single operation (e.g. Redis Lua script). Separating the read and write across two network calls creates race conditions that permit traffic bursts to exceed configured quotas by 10x.",
    "failureMode": "Implementing distributed rate limiting with non-atomic Redis commands (`GET count`, `if count < 100`, `INCR count`): 500 concurrent requests arriving simultaneously all read `count = 99` and all proceed, blasting through the 100-request limit by 5x.",
    "tryItFriction": "Write an atomic Sliding Window Log rate limiter in TypeScript using Redis sorted sets (ZSET) and Lua scripts: simulate 1,000 concurrent requests, verifying strict quota enforcement with zero race conditions.",
    "socraticHints": [
      "Why is Fixed Window rate limiting dangerous at time boundaries?",
      "Because if the limit is 100 req/min, a client can send 100 requests at 00:59 and another 100 requests at 01:00, sending 200 requests within a 2-second window (2x rate burst)!",
      "Sliding Window algorithms smooth this boundary spike."
    ],
    "situationalPuzzle": {
      "scenario": "An API gateway limits users to 60 requests per minute. An engineer writes an application-level check: `const current = await redis.get(key); if (current < 60) { await redis.incr(key); return 200; }`. Under a burst of 100 concurrent requests from the same user, 95 requests return 200 OK. What caused this limit leak?",
      "options": [
        "Redis has a concurrency bug.",
        "Check-Then-Act Race Condition: The `get` and `incr` operations were executed in separate network round trips without atomicity. All 100 requests read the same low value before any of the increment commands executed. Wrapping the logic in an atomic Redis Lua script evaluates and increments in a single atomic operation, enforcing the strict limit of 60.",
        "The user IP address changed.",
        "60 requests per minute is too low a threshold."
      ],
      "answerIdx": 1,
      "debrief": "Distributed rate limiting must be atomic. Executing read and write commands separately exposes the system to Check-Then-Act race conditions where concurrent requests slip through before the counter is updated. Always use atomic Lua scripts."
    },
    "quests": [
      { "id": "dist-m1-d27-q1", "name": "Rate Limiting Formal Models: Token Bucket vs Leaky Bucket vs Sliding Window Log", "type": "concept", "desc": "Compare burst accommodation, memory complexity ($O(1)$ vs $O(N)$), and precision across algorithms." },
      { "id": "dist-m1-d27-q2", "name": "Detective Lab: Profiling Redis Lua Script Execution Latency & Atomicity under Concurrency", "type": "detective", "desc": "Benchmark atomic Lua rate limiter script latency (EVALSHA) under 10,000 concurrent client requests." },
      { "id": "dist-m1-d27-q3", "name": "Mastery Assignment: TypeScript Distributed Sliding Window Rate Limiter Engine", "type": "assignment", "desc": "Build a production-grade rate limiting module using atomic Redis ZSET operations and token refill math." },
      { "id": "dist-m1-d27-q4", "name": "Production Incident Lab: Rate Limiter Boundary Burst Payment Gateway DDoS Triage", "type": "detective", "desc": "Mitigate a payment provider rate limit breach caused by fixed-window boundary spike leaks." }
    ]
  },
  {
    "day": 28,
    "month": 1,
    "blockNum": 6,
    "title": "Fault Tolerance & Resilience Patterns: Circuit Breaker (Hystrix/Resilience4j), Bulkheads & Exponential Backoff with Jitter",
    "stageName": "Stage 3: Autonomous Synthesis",
    "stageNum": 3,
    "pedagogicalRole": "Low Guidance (Resilience Engineering & Cascading Failure Defenses)",
    "spokenGoal": "Stop cascading failures across microservice chains: master Michael Nygard's Release It! resilience patterns. Implement Circuit Breakers (Closed, Open, Half-Open states with error percentage trip thresholds), Bulkheads (isolating resource thread/connection pools so failure in one downstream dependency cannot starve others), and Full Jitter Exponential Backoff.",
    "conceptInvariant": "Circuit Breaker Fail-Fast Invariant: When downstream failure rates exceed threshold (e.g. 50% errors over 10s), the Circuit Breaker trips to OPEN. In the OPEN state, all subsequent calls fail immediately (Fast-Fail) with a fallback response WITHOUT sending network requests, preventing resource exhaustion and giving the downstream service time to recover.",
    "failureMode": "Retrying failed requests immediately in a tight loop across 1,000 clients (Retry Storm): a momentary database hiccup is amplified into a catastrophic denial-of-service attack by clients retrying simultaneously, keeping the database permanently dead.",
    "tryItFriction": "Build a Circuit Breaker and Full Jitter Exponential Backoff engine in TypeScript: simulate a failing downstream service, verify state transitions (Closed -> Open -> Half-Open -> Closed), and measure retry spreading across client threads.",
    "socraticHints": [
      "Why must randomized jitter be added to exponential backoff ($t = \\text{rand}(0, \\text{base} \\times 2^{\\text{attempt}})$)?",
      "Because without jitter, all clients that failed at time $T$ will retry at the EXACT SAME future intervals ($T+1s, T+2s, T+4s$), creating periodic synchronized retry stampedes that crash the recovering server!",
      "Full Jitter spreads retry attempts uniformly across time."
    ],
    "situationalPuzzle": {
      "scenario": "A microservice calls Service B. Service B slows down, taking 10 seconds per request. Service A's thread pool exhausts, causing Service A to fail health checks and crash. Service A's callers fail next, collapsing 15 microservices across the company. What two resilience patterns should have been implemented in Service A?",
      "options": [
        "Increase thread pool to 10,000 threads.",
        "Bulkhead Isolation + Circuit Breaker: A Bulkhead allocates a dedicated isolated thread pool (e.g. 20 threads) strictly for Service B, ensuring Service B can never consume all of Service A's threads. A Circuit Breaker trips to OPEN after successive timeouts, failing immediately and preventing threads from hanging.",
        "Disable timeouts and retries.",
        "Deploy more servers."
      ],
      "answerIdx": 1,
      "debrief": "Bulkheads isolate failures so that one degraded dependency cannot exhaust all shared resources. Circuit breakers stop calling degraded services entirely, allowing calling threads to return immediately with fallbacks."
    },
    "quests": [
      { "id": "dist-m1-d28-q1", "name": "Resilience Engineering: Circuit Breaker State Machine & Bulkhead Topologies", "type": "concept", "desc": "Formalize state transition equations: failure rates, sliding window sizes, sleep windows, and half-open probes." },
      { "id": "dist-m1-d28-q2", "name": "Detective Lab: Profiling Synchronized Retry Stampedes vs Full Jitter Smoothing", "type": "detective", "desc": "Benchmark client retry traffic patterns comparing un-jittered vs full jitter backoff curves." },
      { "id": "dist-m1-d28-q3", "name": "Mastery Assignment: TypeScript Production-Grade Circuit Breaker with Bulkheads", "type": "assignment", "desc": "Build a complete resilience wrapper with state machine transitions, thread pool limits, and jittered retries." },
      { "id": "dist-m1-d28-q4", "name": "Production Incident Lab: Cascading Microservice Failure Thundering Retry Storm Triage", "type": "detective", "desc": "Lead the war room recovering a microservice cluster brought down by un-jittered client retry storms." }
    ]
  },
  {
    "day": 29,
    "month": 1,
    "blockNum": 6,
    "title": "API Gateway Architecture: Reverse Proxy, TLS Termination, JWT Validation & Distributed Tracing (W3C Trace Context)",
    "stageName": "Stage 3: Autonomous Synthesis",
    "stageNum": 3,
    "pedagogicalRole": "Low Guidance (Edge Gateway Architecture & Context Propagation)",
    "spokenGoal": "Architect the front door of distributed systems: examine API Gateway patterns (Kong, Envoy, Traefik). Master TLS 1.3 termination, cryptographic JWT validation at the edge (caching JWKS to eliminate internal auth hops), dynamic route table matching, header enrichment, and end-to-end distributed context propagation using the W3C Trace Context standard (`traceparent` header).",
    "conceptInvariant": "Distributed Trace Context Propagation Invariant: Every incoming request entering the API Gateway must receive a unique W3C `traceparent` header: `version-trace_id-parent_id-trace_flags`. When downstream services call other microservices, the `trace_id` MUST be preserved and forwarded across all RPC and HTTP hops to maintain a continuous distributed call graph.",
    "failureMode": "Failing to forward the `traceparent` header in internal HTTP clients: a user request takes 12 seconds, but distributed tracing graphs appear as 8 fragmented, disconnected 1-millisecond spans, making it impossible to identify the root cause bottleneck.",
    "tryItFriction": "Construct an API Gateway edge proxy in TypeScript: validate incoming JWTs using local public key verification, inject W3C `traceparent` headers, route requests to backend mock services, and log structured access metrics.",
    "socraticHints": [
      "What is the structure of the W3C `traceparent` header `00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01`?",
      "`00` (Version), `4bf...` (32-hex-char Trace ID identifying the overall request), `00f...` (16-hex-char Parent Span ID identifying the caller), and `01` (Trace Flags: sampled)!",
      "Forwarding this header links all downstream spans into a single tree."
    ],
    "situationalPuzzle": {
      "scenario": "An API Gateway routes 50,000 requests per second. For every request, the gateway makes an HTTP call to an internal Auth Microservice to validate the user's JWT token. Gateway latency is 45ms, and the Auth service is running at 95% CPU. How should the gateway be re-architected to achieve sub-millisecond validation?",
      "options": [
        "Delete authentication.",
        "Edge JWT Cryptographic Verification via Cached JWKS: Because JWTs are cryptographically self-contained and signed with an asymmetric private key, the API Gateway can cache the public key (JWKS) and verify the JWT signature directly in memory in 0.05ms without making any network call to the Auth service.",
        "Cache the user password.",
        "Switch from JWT to session cookies."
      ],
      "answerIdx": 1,
      "debrief": "The primary advantage of asymmetric JWTs is decentralized verification. An API gateway can cache the public key set (JWKS) and verify signatures in memory at the edge, completely eliminating network round trips to an authentication microservice."
    },
    "quests": [
      { "id": "dist-m1-d29-q1", "name": "API Gateway Design: Edge Offloading, Route Matching & W3C Trace Context Specification", "type": "concept", "desc": "Map gateway responsibilities: TLS termination, CORS, rate limiting, JWT verification, and telemetry." },
      { "id": "dist-m1-d29-q2", "name": "Detective Lab: Tracing End-to-End Microservice Requests with OpenTelemetry & Jaeger", "type": "detective", "desc": "Inspect span waterfalls, traceparent header propagation, and identify latency bottleneck spans." },
      { "id": "dist-m1-d29-q3", "name": "Mastery Assignment: TypeScript Edge API Gateway with In-Memory JWT & Trace Propagation", "type": "assignment", "desc": "Build an edge reverse proxy with route matching, JWKS verification, and W3C trace header injection." },
      { "id": "dist-m1-d29-q4", "name": "Production Incident Lab: Broken Distributed Trace Context Blind Spot Investigation", "type": "detective", "desc": "Diagnose and fix a distributed tracing blind spot where dropped context headers broke latency observability." }
    ]
  },
  {
    "day": 30,
    "month": 1,
    "blockNum": 6,
    "title": "\ud83c\udfc6 CAPSTONE 1 / GATEWAY: NexusMesh \u2014 Resilient Distributed Service Mesh & Edge Gateway",
    "stageName": "Stage 4: Crucible & Viva",
    "stageNum": 4,
    "pedagogicalRole": "Open Challenge (Month 1 Gateway Viva Gate)",
    "spokenGoal": "Defend Month 1 Gateway: Deliver and defend 'NexusMesh', an enterprise-grade Distributed Service Mesh and Edge Gateway in TypeScript. Synthesize all Month 1 distributed primitives: gRPC Protobuf binary streaming, Consistent Hashing with virtual nodes, Two-Tier Caching with Singleflight and XFetch, Hybrid Logical Clocks (HLC) for causal ordering, 64-bit Snowflake ID generation, etcd-style lease leader election, P2C Peak EWMA load balancing, atomic sliding-window rate limiting, and Circuit Breakers with Full Jitter.",
    "conceptInvariant": "End-to-End Mesh Resilience Invariant: NexusMesh must maintain sub-millisecond edge routing, guarantee monotonic causal ordering, survive arbitrary node crashes with automated leader failover, prevent cascading failure storms via circuit breakers, and enforce strict rate limits across all distributed client connections.",
    "failureMode": "Failing the Month 1 Gateway Crucible: submitting an edge gateway where a downstream network failure cascades back to exhaust gateway thread pools or where inconsistent HLC timestamps corrupt trace ordering.",
    "tryItFriction": "Pass the NexusMesh Crucible test battery: process 100,000 concurrent client requests across 10 virtual microservice nodes under active failure injections (simulated packet drops, slow backends, clock skew), verifying 100% resilience and defending architectural design in an oral Master Viva.",
    "socraticHints": [
      "What is the single most critical architectural boundary in NexusMesh?",
      "The contract between the Edge Load Balancer and the Downstream Circuit Breakers: ensuring failing backends are pruned from P2C routing tables before thread queues fill up!",
      "Mastery of this contract guarantees true enterprise resilience."
    ],
    "situationalPuzzle": {
      "scenario": "During your NexusMesh Gateway Viva defense, the panel injects a sudden 500ms latency spike on Backend Service 3 while traffic surges by 500%. NexusMesh isolates Service 3 using Circuit Breakers, routes healthy traffic across remaining backends using P2C Peak EWMA, and sheds excess traffic with 429 Too Many Requests. What architectural invariants did your mesh validate?",
      "options": [
        "System crashed and rebooted.",
        "True Distributed Resilience Architecture: The mesh validated Bulkhead isolation and Circuit Breaker fast-failing to protect gateway resources; P2C Peak EWMA dynamically routed around degraded nodes; and atomic token bucket rate limiting protected downstream services from overload.",
        "The computer had high clock speed.",
        "TypeScript handles microservices automatically."
      ],
      "answerIdx": 1,
      "debrief": "NexusMesh demonstrates the full defensive power of modern distributed systems: combining intelligent load balancing, circuit breaking, and rate limiting to maintain system availability even when individual components experience severe degradation."
    },
    "quests": [
      { "id": "dist-m1-d30-q1", "name": "NexusMesh Master System Architecture & Component Blueprint", "type": "concept", "desc": "Document the end-to-end architecture: Edge Gateway, RPC Mesh, Caching Layer, Consensus, and Resilience." },
      { "id": "dist-m1-d30-q2", "name": "Detective Lab: NexusMesh Chaos Audit: Simulating Cascading Failure Storms under Load", "type": "detective", "desc": "Execute automated chaos tests injecting node crashes, slow sockets, and clock skew to verify fault tolerance." },
      { "id": "dist-m1-d30-q3", "name": "Mastery Assignment: NexusMesh Enterprise Distributed Service Mesh Complete Implementation", "type": "assignment", "desc": "Assemble and deliver the complete production-grade NexusMesh TypeScript distributed system." },
      { "id": "dist-m1-d30-q4", "name": "Gateway Viva: Defending NexusMesh Architecture before Senior Distributed Systems Panel", "type": "detective", "desc": "Defend architectural design decisions, consensus trade-offs, and resilience boundaries in a master viva." }
    ]
  }
]
