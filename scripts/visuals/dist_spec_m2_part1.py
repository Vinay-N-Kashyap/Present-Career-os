# scripts/visuals/dist_spec_m2_part1.py
# Month 2 Days 31 to 45 for Course 11: High-Scale Distributed System Design (course-distributed-sys)
# Total Quests: 60 Quests (Days 31–45)

DIST_M2_PART1 = [
  # ─── BLOCK 7: Distributed Event Streaming & Log Storage (Days 31–35) ──────────
  {
    "day": 31,
    "month": 2,
    "blockNum": 7,
    "title": "Distributed Commit Log Architecture: Append-Only Partition Logs, Segment Files & Zero-Copy Sendfile (Apache Kafka)",
    "stageName": "Stage 1: Mental Model Grounding",
    "stageNum": 1,
    "pedagogicalRole": "High Guidance (Event Log Physics & Hardware Sympathy)",
    "spokenGoal": "Shift mental models from traditional message queues (RabbitMQ/JMS where messages are deleted on read) to Distributed Commit Logs (Apache Kafka, Redpanda). Analyze append-only partition files, 1GB rolling segment files with index (.index, .timeindex), sequential disk I/O physics (matching memory throughput), the OS page cache, and the Linux `sendfile()` zero-copy syscall that bypasses user-space memory.",
    "conceptInvariant": "Zero-Copy Disk-to-NIC Invariant: In traditional servers, reading from disk to network requires 4 context switches and 3 memory copies (Disk -> OS Buffer -> User RAM -> Socket Buffer -> NIC). With Linux `sendfile()`, data transfers directly from OS Page Cache to the Network Interface Card (NIC) via DMA with zero CPU memory copying, enabling multi-gigabit throughput per broker.",
    "failureMode": "Building a high-throughput event streaming broker where every consumed message is loaded into user-space heap memory, parsed as a JSON object, and re-serialized to the network: the JVM/Node process collapses under extreme garbage collection pauses and CPU thrashing at 10,000 msg/sec.",
    "tryItFriction": "Construct an append-only commit log storage engine in TypeScript: write messages sequentially to fixed-size segment files, maintain a sparse binary index mapping message offsets to physical byte positions, and execute fast binary search offset lookups.",
    "socraticHints": [
      "Why is sequential disk I/O on modern spinning disks or NVMe SSDs nearly as fast as random RAM access?",
      "Because sequential reads and writes avoid mechanical disk head seeks and flash block erase cycles; modern OS read-ahead algorithms prefetch sequential pages into RAM automatically!",
      "Kafka treats sequential disk as an infinite append-only buffer."
    ],
    "situationalPuzzle": {
      "scenario": "A financial analytics service streams 500,000 market ticks per second. The engineering team measures Kafka broker CPU utilization during peak consumer reads and is shocked to see CPU is at only 4%. How can a server stream gigabytes of data per second with near-zero CPU usage?",
      "options": [
        "The CPU metrics are broken.",
        "Linux Zero-Copy sendfile() DMA Transfer: Kafka does not copy message bytes into user-space application memory during reads. It invokes the OS `sendfile()` system call, allowing the network card's Direct Memory Access (DMA) engine to pull data directly from the Linux kernel page cache straight into network packets without CPU intervention.",
        "Kafka compresses the data into zero bytes.",
        "The consumers are not reading data."
      ],
      "answerIdx": 1,
      "debrief": "Zero-copy architecture is Kafka's fundamental performance secret. By keeping data in the OS page cache and streaming it directly to network sockets via `sendfile()`, the CPU is bypassed entirely, achieving line-rate network throughput."
    },
    "quests": [
      { "id": "dist-m2-d31-q1", "name": "Distributed Commit Log Architecture: Partitions, Segment Files & Sparse Indexes", "type": "concept", "desc": "Deconstruct segment rollover, .index offset mapping, and OS page cache read-ahead mechanics." },
      { "id": "dist-m2-d31-q2", "name": "Detective Lab: Profiling Linux sendfile() vs read/write Syscall Context Switches", "type": "detective", "desc": "Use `strace` and `perf` to compare CPU cycles and context switches between standard I/O and zero-copy." },
      { "id": "dist-m2-d31-q3", "name": "Mastery Assignment: TypeScript Append-Only Partition Log & Sparse Index Engine", "type": "assignment", "desc": "Build an append-only log manager rolling 10MB segments and maintaining a sparse binary index." },
      { "id": "dist-m2-d31-q4", "name": "Production Incident Lab: User-Space Buffer Copy GC Collapse Outage Triage", "type": "detective", "desc": "Remediate a message pipeline outage caused by heap memory exhaustion during unconstrained message parsing." }
    ]
  },
  {
    "day": 32,
    "month": 2,
    "blockNum": 7,
    "title": "Consumer Group Mechanics: Partition Rebalancing (Eager vs Cooperative Sticky) & Consumer Offsets",
    "stageName": "Stage 1: Mental Model Grounding",
    "stageNum": 1,
    "pedagogicalRole": "High Guidance (Consumer Group Protocol & Rebalance Algorithms)",
    "spokenGoal": "Scale event consumption across worker fleets: deconstruct Kafka Consumer Groups. Master the Group Coordinator (broker) and Group Leader (consumer), partition assignment strategies (Range, Round-Robin, Sticky, Cooperative Sticky), the dreaded Stop-The-World Eager Rebalance vs incremental Cooperative Sticky Rebalancing, and offset management in the internal `__consumer_offsets` topic.",
    "conceptInvariant": "Partition-Consumer Exclusivity Invariant: Within a single consumer group, each topic partition is assigned to strictly ONE active consumer instance at any given time. If a topic has $P$ partitions, adding more than $P$ consumers to the group results in idle consumers with zero assigned partitions.",
    "failureMode": "Deploying a consumer application that processes long-running batch tasks taking 60 seconds per message: the consumer fails to send heartbeats within `max.poll.interval.ms`, causing the broker to declare it dead and trigger continuous cascading rebalance storms across the entire worker fleet.",
    "tryItFriction": "Build a Consumer Group Rebalance simulator in TypeScript: simulate 4 consumers sharing 12 partitions, simulate a consumer death, and compare partition revocations between Eager Rebalance (revokes all 12) versus Cooperative Sticky (revokes only 3).",
    "socraticHints": [
      "Why was the traditional Eager Rebalance protocol catastrophic for large microservice clusters?",
      "Because Eager Rebalancing forces ALL consumers to revoke ALL partitions and stop processing immediately (Stop-the-World pause) while the leader recalculates assignments!",
      "Cooperative Sticky Rebalance allows healthy consumers to keep processing untouched partitions uninterrupted."
    ],
    "situationalPuzzle": {
      "scenario": "A payments consumer group has 10 worker pods consuming 10 partitions. An engineer notices that when one pod restarts during a deployment, all 10 pods freeze for 45 seconds, message lag surges, and the cluster enters a continuous rebalance loop. What configuration caused this rebalance storm?",
      "options": [
        "The pods ran out of disk space.",
        "max.poll.interval.ms Timeout Under Eager Rebalance: The consumers were processing heavy payment tasks that exceeded `max.poll.interval.ms`. The coordinator assumed the workers were dead and triggered an Eager Rebalance, revoking all partitions. While rebalancing, tasks took longer, triggering further timeouts and an infinite rebalance loop. Increasing the interval and enabling CooperativeStickyAssignor fixes this.",
        "Kafka does not support Kubernetes pods.",
        "The consumer group name had invalid characters."
      ],
      "answerIdx": 1,
      "debrief": "Long-running tasks that exceed `max.poll.interval.ms` cause the coordinator to boot consumers from the group, triggering Stop-The-World rebalances. The Cooperative Sticky Assignor isolates partition reassignment, eliminating cluster-wide processing halts."
    },
    "quests": [
      { "id": "dist-m2-d32-q1", "name": "Consumer Group Protocols: JoinGroup, SyncGroup, Heartbeat & Assignor Strategies", "type": "concept", "desc": "Map consumer group coordination handshakes and compare partition assignment algorithms." },
      { "id": "dist-m2-d32-q2", "name": "Detective Lab: Profiling Kafka Consumer Lag & Offset Commits with kafka-consumer-groups", "type": "detective", "desc": "Analyze consumer lag metrics (LOG-END-OFFSET vs CURRENT-OFFSET) to detect slow worker partitions." },
      { "id": "dist-m2-d32-q3", "name": "Mastery Assignment: TypeScript Cooperative Sticky Consumer Group Rebalance Engine", "type": "assignment", "desc": "Build a consumer coordinator implementing incremental cooperative partition rebalancing with zero stop-the-world pauses." },
      { "id": "dist-m2-d32-q4", "name": "Production Incident Lab: Rebalance Storm Consumer Freeze High-Severity War Room", "type": "detective", "desc": "Resolve a high-severity production incident where a consumer fleet was locked in an infinite rebalance storm." }
    ]
  },
  {
    "day": 33,
    "month": 2,
    "blockNum": 7,
    "title": "Producer Delivery Guarantees: At-Most-Once, At-Least-Once, Exactly-Once Semantics (EOS / Idempotent Producers & 2PC)",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Message Delivery Guarantees & Transactional Logging)",
    "spokenGoal": "Master the spectrum of delivery semantics: At-Most-Once (fire-and-forget, zero duplicates, data loss risk), At-Least-Once (acknowledgments and retries, duplicate risk), and the holy grail: Exactly-Once Semantics (EOS). Deconstruct Kafka Idempotent Producers (Producer ID + Monotonic Sequence Number per partition) and Distributed Transactional Producers (Two-Phase Commit across partitions via the Transaction Coordinator).",
    "conceptInvariant": "Idempotent Producer Deduplication Invariant: Every producer is assigned a 64-bit Producer ID (PID). For each partition, the producer tags messages with a strictly incrementing 32-bit Sequence Number ($0, 1, 2, ...$). The broker rejects any message whose sequence number is $\\le$ the last committed sequence number, mathematically deduplicating network retries.",
    "failureMode": "A network timeout occurs after the broker commits a payment message: the client retries the message under At-Least-Once without idempotent producer enabled. The broker writes the duplicate payment message, charging the customer's credit card twice.",
    "tryItFriction": "Construct an Idempotent Producer and Partition Broker in TypeScript: simulate network ACK drops, trigger client retries, and prove that the broker's sequence number tracking eliminates duplicate writes.",
    "socraticHints": [
      "Why isn't At-Least-Once sufficient for financial transactions on its own?",
      "Because when network acknowledgments drop, the client cannot know if the broker committed the message or dropped it; retrying guarantees duplicates unless deduplication is enforced!",
      "Idempotent producers make network retries completely safe."
    ],
    "situationalPuzzle": {
      "scenario": "A payment service produces messages with `acks = all` and retries enabled. A transient network hiccup causes the broker's TCP ACK to be lost after saving the message. The producer retries and receives success. The consumer reads the topic and finds TWO identical payment records for Order #1001. How should the producer be configured to prevent this duplicate?",
      "options": [
        "Set `acks = 0`.",
        "Enable Idempotent Producer (`enable.idempotence = true`): When enabled, the producer attaches its PID and sequence number to each batch. When the retry arrives, the broker recognizes that sequence number 42 has already been committed to disk, drops the duplicate payload, and returns an ACK to the producer without duplicating the write.",
        "Disable retries entirely.",
        "Delete the topic."
      ],
      "answerIdx": 1,
      "debrief": "Network ACK loss is the canonical cause of message duplication in At-Least-Once pipelines. Enabling idempotent producer semantics allows the broker to detect and drop duplicate retries via sequence number tracking."
    },
    "quests": [
      { "id": "dist-m2-d33-q1", "name": "Delivery Semantics Matrix: At-Most-Once vs At-Least-Once vs Exactly-Once (EOS)", "type": "concept", "desc": "Formalize failure modes, duplicate probabilities, and the 2PC transactional commit marker protocol." },
      { "id": "dist-m2-d33-q2", "name": "Detective Lab: Tracing PID & Sequence Numbers in Kafka Broker Log Dumps with DumpLogSegments", "type": "detective", "desc": "Use kafka-run-class.sh DumpLogSegments to inspect producerId, producerEpoch, and baseSequence fields." },
      { "id": "dist-m2-d33-q3", "name": "Mastery Assignment: TypeScript Idempotent Producer & Deduplicating Partition Engine", "type": "assignment", "desc": "Build an event producer and broker tracking sequence numbers and rejecting duplicate network retries." },
      { "id": "dist-m2-d33-q4", "name": "Production Incident Lab: Duplicate Credit Card Charge At-Least-Once Disaster Triage", "type": "detective", "desc": "Resolve a high-severity customer billing crisis where network retries caused 10,000 double-charge events." }
    ]
  },
  {
    "day": 34,
    "month": 2,
    "blockNum": 7,
    "title": "Stream Processing & Windowing: Tumbling, Hopping, Sliding Windows, Watermarks & Late Data (Apache Flink)",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Stream Processing Physics & Time Semantics)",
    "spokenGoal": "Compute continuous analytics over infinite unbounded event streams: deconstruct Tyler Akidau's Streaming Systems model (The Dataflow Model / Apache Flink / Kafka Streams). Differentiate Event Time (when event occurred on device) from Processing Time (when event hits server), master Windowing strategies (Tumbling, Hopping, Sliding, Session), and handle out-of-order late-arriving events using Watermarks and Allowed Lateness.",
    "conceptInvariant": "Watermark Event-Time Progress Invariant: A Watermark $W(t)$ is a monotonically increasing metadata marker flowing through the event stream stating: 'The engine asserts that no subsequent events with event-time $< t$ will arrive'. When a watermark passes window end $T_{\\text{end}}$, the window is finalized and emitted.",
    "failureMode": "Aggregating mobile clickstream data using Processing Time instead of Event Time: mobile devices go into airplane mode and upload a day's worth of clicks simultaneously upon reconnecting, causing yesterday's clicks to corrupt today's real-time analytics window.",
    "tryItFriction": "Build an Event-Time Stream Processor in TypeScript: process out-of-order event streams, generate bounded-out-of-orderness watermarks, and aggregate tumbling 1-minute revenue windows, routing late events to a side-output stream.",
    "socraticHints": [
      "What is Allowed Lateness in stream processing engines?",
      "A configured grace period (e.g. 5 minutes) after a window closes where late-arriving events can still trigger window updates rather than being discarded!",
      "Events arriving after the allowed lateness are emitted to a Dead Letter / Side-Output stream."
    ],
    "situationalPuzzle": {
      "scenario": "An IoT temperature anomaly detector groups sensor readings into 5-minute tumbling windows based on Event Time. Sensor A experiences network jitter and sends a reading stamped `12:02:15` that arrives at the server at `12:08:00`. The watermark is currently at `12:07:00`. The window for `[12:00, 12:05)` has already closed. What happens to this late reading?",
      "options": [
        "It is included in the 12:05-12:10 window.",
        "Late Data Drop or Side-Output: Because the reading's event time (`12:02:15`) is strictly less than the current watermark (`12:07:00`), the window has already fired. Without an Allowed Lateness policy or Side-Output stream, the engine drops the event as late data, omitting it from the historical aggregation.",
        "The stream processor crashes.",
        "The system rewinds time for all sensors."
      ],
      "answerIdx": 1,
      "debrief": "Watermarks define when windows close. Once a watermark passes a window's boundary, the window fires. Events arriving with timestamps older than the watermark are considered late data and are dropped unless explicit side-outputs are configured."
    },
    "quests": [
      { "id": "dist-m2-d34-q1", "name": "The Dataflow Model: Event Time, Processing Time, Watermarks & Windowing Algebra", "type": "concept", "desc": "Deconstruct Tyler Akidau's 4 questions: What is computed? Where in event time? When in processing time? How do results relate?" },
      { "id": "dist-m2-d34-q2", "name": "Detective Lab: Inspecting Flink Event-Time Window Triggers & Watermark Generation", "type": "detective", "desc": "Trace watermark propagation across multi-operator DAGs under artificial network latency injection." },
      { "id": "dist-m2-d34-q3", "name": "Mastery Assignment: TypeScript Event-Time Window Aggregator with Bounded Watermarks", "type": "assignment", "desc": "Build a streaming engine supporting Tumbling/Sliding windows, watermark tracking, and late-data side-outputs." },
      { "id": "dist-m2-d34-q4", "name": "Production Incident Lab: Airplane Mode Event Burst Processing Time Window Contamination Triage", "type": "detective", "desc": "Fix a telemetry pipeline where mobile reconnection surges corrupted real-time dashboard analytics." }
    ]
  },
  {
    "day": 35,
    "month": 2,
    "blockNum": 7,
    "title": "\u2b50 MILESTONE 6: High-Throughput Distributed Event Log Streamer with Idempotent Producer Semantics",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Milestone Gate: Distributed Event Streaming Fleet)",
    "spokenGoal": "Assemble Milestone 6: Build a production-grade Distributed Event Streaming Engine in TypeScript. Implement partitioned append-only commit logs with rolling segment files and sparse binary indexing, an Idempotent Producer with PID and sequence tracking, a Consumer Group coordinator with cooperative partition assignment, and an Event-Time windowing processor with bounded watermarks.",
    "conceptInvariant": "End-to-End Streaming Correctness Invariant: The streaming fleet must guarantee that: 1) Every partition preserves total append-only order, 2) Producer retries never introduce duplicate records, 3) Consumer rebalances reassign partitions without stop-the-world stalls, and 4) Stream window aggregations yield mathematically identical results regardless of message arrival order.",
    "failureMode": "Failing to persist consumer offsets atomically: during consumer pod restart, uncommitted offsets cause the new consumer to re-read 1,000,000 historical messages, flooding downstream microservices with duplicate events.",
    "tryItFriction": "Pass the Milestone 6 verification crucible: stream 100,000 messages across 8 partitions, inject 10% network drop to trigger producer retries, kill consumer pods mid-stream to trigger cooperative rebalancing, and verify 100% exactly-once processing integrity.",
    "socraticHints": [
      "How do you guarantee that stream window results are deterministic despite network packet reordering?",
      "By basing all window boundaries strictly on the immutable Event Time embedded in each message, never on server arrival time!",
      "Watermarks ensure that windows only close after sufficient buffer time has elapsed."
    ],
    "situationalPuzzle": {
      "scenario": "During your Milestone 6 benchmark, a consumer crashes while processing a batch of 500 events. A new consumer is assigned the partition and restarts from the last committed offset. 100 events that were processed before the crash but not yet committed are processed a second time by the new consumer. How should the consumer handle this?",
      "options": [
        "Delete the messages.",
        "Idempotent Consumer Processing: While the broker ensures idempotent production, consumers under At-Least-Once offset commit must implement idempotent processing (e.g. using a unique business key in the database with `ON CONFLICT DO NOTHING` or recording processed IDs in Redis) to ensure duplicate consumption causes zero side-effects.",
        "Crash the consumer.",
        "Switch to single-threaded processing."
      ],
      "answerIdx": 1,
      "debrief": "Offset commits in distributed streaming are inherently asynchronous. Consumers must be designed to be idempotent: processing the same event multiple times must yield identical system state."
    },
    "quests": [
      { "id": "dist-m2-d35-q1", "name": "Milestone 6 Architecture: Event Streamer Master System Blueprint", "type": "concept", "desc": "Design component contracts: PartitionBroker, IdempotentProducer, ConsumerCoordinator, and WindowProcessor." },
      { "id": "dist-m2-d35-q2", "name": "Detective Lab: Stress Testing Producer Retries & Offset Commit Recovery under Chaos", "type": "detective", "desc": "Inject random network drops during high-volume streaming and verify zero duplicate writes in partition logs." },
      { "id": "dist-m2-d35-q3", "name": "Mastery Assignment: Full TypeScript Distributed Event Log Streaming Engine", "type": "assignment", "desc": "Implement the complete Milestone 6 engine supporting partitioned storage, idempotent producers, and streaming windows." },
      { "id": "dist-m2-d35-q4", "name": "Production Incident Lab: Uncommitted Offset Replay Duplicate Notification Storm Triage", "type": "detective", "desc": "Resolve a high-severity customer incident where uncommitted offset replays sent 500,000 duplicate SMS notifications." }
    ]
  },

  # ─── BLOCK 8: Distributed Storage Systems & Wide-Column NoSQL (Days 36–40) ────
  {
    "day": 36,
    "month": 2,
    "blockNum": 8,
    "title": "Dynamo Architecture: Masterless Peered Topologies, Sloppy Quorums & Hinted Handoff (Amazon Dynamo / Cassandra)",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Masterless NoSQL & Peered Architectures)",
    "spokenGoal": "Analyze peer-to-peer storage architectures where every node is equal (zero single point of failure): explore the landmark 2007 Amazon Dynamo paper (DeCandia et al.). Dissect Masterless Peered Topologies, consistent hash ring replication across $N$ successors, Sloppy Quorums (routing writes to temporary fallback nodes during outages), and Hinted Handoff (delivering queued writes once the primary node recovers).",
    "conceptInvariant": "Sloppy Quorum Availability Invariant: In a masterless cluster, if designated replica nodes are unreachable due to network partitions, the coordinator node does NOT reject the write; it writes to healthy alternate nodes on the hash ring with a 'hint'. This guarantees extreme write availability at the cost of temporary read staleness.",
    "failureMode": "Accumulating millions of hinted handoff mutations during a prolonged 3-day node outage: when the dead node finally boots, the cluster floods it with gigabytes of hinted handoff replays, saturating its network and crashing it immediately upon restart.",
    "tryItFriction": "Construct a Masterless Peered Key-Value Cluster in TypeScript: model 5 nodes on a consistent hash ring with replication factor $N=3$, implement Sloppy Quorums and Hinted Handoff, and simulate node partition and healing.",
    "socraticHints": [
      "What is the difference between a Strict Quorum and a Sloppy Quorum?",
      "A Strict Quorum requires responses from a majority of the specific designated replica nodes for that key; a Sloppy Quorum accepts responses from ANY healthy nodes on the ring to preserve write availability during partitions!",
      "Sloppy quorums prioritize Availability over Consistency (AP system)."
    ],
    "situationalPuzzle": {
      "scenario": "A 5-node Cassandra cluster (Nodes A, B, C, D, E) has replication factor $N=3$ for key 'user_42' (assigned to A, B, C). Node C is offline. Client writes with `ConsistencyLevel = ONE`. The coordinator writes to Node A and stores a hinted handoff for Node C on Node D. Client then reads 'user_42' from Node B with `ConsistencyLevel = ONE`. What value does the client see?",
      "options": [
        "The client always sees the new value.",
        "Stale Read (Old Value): Because the write was only acknowledged by Node A and Node D (hint), Node B has not yet received the update. Reading from Node B with Consistency Level ONE returns the stale pre-update value. Strong consistency was sacrificed for write availability.",
        "The read throws an exception.",
        "Cassandra crashes."
      ],
      "answerIdx": 1,
      "debrief": "Sloppy quorums and low consistency levels (ONE) prioritize availability. If a write hits Node A and is hinted on Node D, reading from Node B with Consistency ONE returns stale data until background hinted handoff or read repair completes."
    },
    "quests": [
      { "id": "dist-m2-d36-q1", "name": "The Amazon Dynamo 2007 Paper Formal Deconstruction", "type": "concept", "desc": "Map key placement, preference lists, sloppy quorums, hinted handoff, and read repair mechanics." },
      { "id": "dist-m2-d36-q2", "name": "Detective Lab: Inspecting Cassandra Hinted Handoff Mutations with nodetool", "type": "detective", "desc": "Use nodetool statushandoff and view mutation queues during simulated node partition events." },
      { "id": "dist-m2-d36-q3", "name": "Mastery Assignment: TypeScript Masterless Peered Cluster with Hinted Handoff", "type": "assignment", "desc": "Build a peer-to-peer storage cluster routing writes across preference lists and delivering hinted mutations." },
      { "id": "dist-m2-d36-q4", "name": "Production Incident Lab: Hinted Handoff Storm Post-Restart Node Death Triage", "type": "detective", "desc": "Resolve a cascading failure where a recovering node was crushed by an unconstrained hinted handoff flood." }
    ]
  },
  {
    "day": 37,
    "month": 2,
    "blockNum": 8,
    "title": "Quorum Mathematics & Tunable Consistency: R + W > N (Strong Consistency) vs R + W <= N (Eventual Consistency)",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Quorum Mathematics & Read/Write Overlap)",
    "spokenGoal": "Master the mathematical algebra of distributed quorums: analyze Werner Vogels' Tunable Consistency equation. Given replication factor $N$, read quorum $R$, and write quorum $W$, prove why $R + W > N$ mathematically guarantees that the read set and write set must overlap by at least one node ($|Q_R \\cap Q_W| \\ge 1$), delivering Strong Consistency. Explore why $R + W \\le N$ introduces Eventual Consistency and stale reads.",
    "conceptInvariant": "Pigeonhole Quorum Overlap Invariant: If a system writes to $W$ replicas and reads from $R$ replicas out of $N$ total replicas, and $R + W > N$, the Pigeonhole Principle guarantees that at least ONE node in the read quorum witnessed the latest write. The client resolves the latest version using timestamps or vector clocks.",
    "failureMode": "Configuring a cluster with $N=3, W=1, R=1$ ($R + W = 2 \\le 3$) for an account balance service: writes succeed on Node 1; reads query Node 2. The read misses the write entirely, returning $0 balance after a $500 deposit, causing duplicate charges.",
    "tryItFriction": "Build a Tunable Consistency Quorum simulator in TypeScript: simulate read/write operations across $N=5$ replicas under varying $(R, W)$ configurations (e.g. $W=1, R=1$ vs $W=3, R=3$ vs $W=5, R=1$), measuring latency and stale read frequencies under network partitions.",
    "socraticHints": [
      "Why do high-read systems often choose $W=N$ (write to all) and $R=1$ (read from any)?",
      "Because reads are ultra-fast ($R=1$, local read) and 100% strongly consistent ($R + W = 1 + N > N$)!",
      "The trade-off is that writes become slower and unavailable if even a single node goes down."
    ],
    "situationalPuzzle": {
      "scenario": "A 5-node Cassandra cluster is configured with replication factor $N=5$. An architect configures writes with `ConsistencyLevel = QUORUM` and reads with `ConsistencyLevel = QUORUM`. In Cassandra, `QUORUM = floor(N/2) + 1`. What are $W$ and $R$? Does $R + W > N$? What consistency guarantee is achieved?",
      "options": [
        "$W=2, R=2$; Eventual Consistency.",
        "$W=3, R=3$; Strong Consistency: $\\text{floor}(5/2) + 1 = 3$. $R + W = 3 + 3 = 6 > 5$. The read quorum and write quorum are guaranteed to overlap on at least 1 node ($6 - 5 = 1$). That overlapping node returns the latest write, guaranteeing Strong Consistency across node failures.",
        "$W=5, R=5$; Strict Serializability.",
        "The cluster is misconfigured."
      ],
      "answerIdx": 1,
      "debrief": "With $N=5$, QUORUM is 3. Since $3 + 3 = 6 > 5$, any read quorum of 3 nodes is guaranteed to intersect with any write quorum of 3 nodes by at least 1 node. As long as monotonic timestamps/vector clocks identify the latest version, reads are strongly consistent."
    },
    "quests": [
      { "id": "dist-m2-d37-q1", "name": "Quorum Intersection Proof & Probabilistic Bounded Staleness (PBS)", "type": "concept", "desc": "Derive the Pigeonhole proof and analyze Bailis et al.'s PBS metrics for latency vs consistency trade-offs." },
      { "id": "dist-m2-d37-q2", "name": "Detective Lab: Profiling Read Repair Latency Spikes during Asymmetric Quorum Reads", "type": "detective", "desc": "Measure how background Read Repair impacts P99 read latency when divergent replicas are detected." },
      { "id": "dist-m2-d37-q3", "name": "Mastery Assignment: TypeScript Tunable Consistency Simulator with Quorum Evaluator", "type": "assignment", "desc": "Build a multi-replica simulator executing configurable (R, W, N) queries with read repair triggers." },
      { "id": "dist-m2-d37-q4", "name": "Production Incident Lab: Sub-Quorum Stale Read Financial Ledger Audit Mismatch Triage", "type": "detective", "desc": "Remediate a financial reconciliation crisis caused by misconfigured sub-quorum (R+W <= N) read consistency." }
    ]
  },
  {
    "day": 38,
    "month": 2,
    "blockNum": 8,
    "title": "Conflict Resolution: Last-Write-Wins (LWW) Clock Skew Perils vs Conflict-Free Replicated Data Types (CRDTs)",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Conflict Resolution & Mathematical Convergence)",
    "spokenGoal": "Eliminate data corruption in multi-master and eventually consistent systems: uncover why Last-Write-Wins (LWW) using physical timestamps is fundamentally flawed (clock drift silently destroys concurrent updates). Master Marc Shapiro's Conflict-Free Replicated Data Types (CRDTs): State-based (CvRDT) vs Operation-based (CmRDT), Grow-Only Counters (G-Counter), Positive-Negative Counters (PN-Counter), and Observed-Removed Sets (OR-Set).",
    "conceptInvariant": "CRDT Join-Semilattice Convergence Invariant: A state-based CRDT defines a mathematical partial order with a merge function $\\sqcup$ that is strictly Commutative ($A \\sqcup B = B \\sqcup A$), Associative ($(A \\sqcup B) \\sqcup C = A \\sqcup (B \\sqcup C)$), and Idempotent ($A \\sqcup A = A$). Regardless of message arrival order, duplicates, or network partitions, all replicas converge to the EXACT same state without central coordination.",
    "failureMode": "Building a collaborative document editor or like-counter using Last-Write-Wins: concurrent increments from two users on different nodes result in one increment being silently discarded because its physical timestamp was 1ms earlier, losing 50% of user interactions.",
    "tryItFriction": "Implement a PN-Counter (Positive-Negative Counter) and an OR-Set (Observed-Removed Set) in TypeScript: simulate concurrent additions and removals across 3 partitioned nodes and prove that merging states converges deterministically.",
    "socraticHints": [
      "Why can't a simple counter decrement just subtract from a single number in an eventually consistent distributed system?",
      "Because subtraction is not idempotent! If a decrement message is duplicated or delivered multiple times across partitions, the count decrements repeatedly, corrupting state!",
      "A PN-Counter maintains two separate Grow-Only counters: $P$ (increments) and $N$ (decrements); value is $\\sum P - \\sum N$."
    ],
    "situationalPuzzle": {
      "scenario": "A collaborative todo app allows users to add and remove items offline. User A adds 'Buy Milk' (tagged with unique tag T1). User B concurrently deletes 'Buy Milk' while offline. When both reconnect, how does an Observed-Removed Set (OR-Set) resolve this conflict?",
      "options": [
        "The app crashes with a merge conflict.",
        "Add-Wins Semantics via Unique Element Tags: An OR-Set tags each added element with a unique UUID. A delete operation only removes the specific tags observed at the time of deletion. If User A added 'Buy Milk' concurrently (new tag T1 that User B had not observed), the addition wins! 'Buy Milk' remains in the set with tag T1, preventing accidental deletion of concurrent additions.",
        "The item is renamed to NULL.",
        "User with the smaller user ID wins."
      ],
      "answerIdx": 1,
      "debrief": "The Observed-Removed Set (OR-Set) provides add-wins semantics by assigning unique tags to every added item. A remove operation only deletes the specific tags observed locally, ensuring concurrent additions survive clean merges."
    },
    "quests": [
      { "id": "dist-m2-d38-q1", "name": "CRDT Mathematical Foundations: Join-Semilattices & The Convergence Theorem", "type": "concept", "desc": "Prove Commutativity, Associativity, and Idempotence for G-Counter, PN-Counter, and LWW-Element-Set." },
      { "id": "dist-m2-d38-q2", "name": "Detective Lab: Deconstructing Automerge & Yjs CRDT Wire Encodings in Collaborative Apps", "type": "detective", "desc": "Inspect binary delta formats and measure memory overhead of CRDT operation histories in collaborative text editors." },
      { "id": "dist-m2-d38-q3", "name": "Mastery Assignment: TypeScript Conflict-Free Replicated Data Types (PN-Counter & OR-Set)", "type": "assignment", "desc": "Build fully functional PN-Counter and OR-Set classes with state merging, tombstones, and serialization." },
      { "id": "dist-m2-d38-q4", "name": "Production Incident Lab: Cassandra Last-Write-Wins Concurrent Overwrite Data Loss Triage", "type": "detective", "desc": "Resolve a high-severity customer inventory discrepancy caused by Cassandra LWW timestamp conflicts." }
    ]
  },
  {
    "day": 39,
    "month": 2,
    "blockNum": 8,
    "title": "Anti-Entropy Protocols: Merkle Trees (Hash Trees) for Background Peer Data Synchronization",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Cryptographic Data Structures & Peer Synchronization)",
    "spokenGoal": "Synchronize out-of-sync distributed replicas with minimal network bandwidth: analyze Ralph Merkle's 1979 Merkle Trees (Cryptographic Hash Trees). Examine how Cassandra, Dynamo, and Git use hierarchical hash trees over key ranges: leaf nodes contain hashes of individual key-values, and parent nodes contain hashes of their children. Detect divergent data between replicas in $O(\\log N)$ comparisons without transferring raw data across the network.",
    "conceptInvariant": "Merkle Tree Tree-Comparison Invariant: If two replicas possess identical datasets across a key range, their Merkle root hashes are strictly identical ($H_A = H_B$, zero data transfer required). If the root hashes differ, the replicas compare child hashes level-by-level, isolating the exact differing key ranges in $O(\\log N)$ network round-trips.",
    "failureMode": "Running anti-entropy repair by transmitting raw tables across the network: comparing two 10 TB database replicas by streaming all rows consumes 100% of inter-datacenter bandwidth and takes 48 hours, incurring massive cloud egress bills.",
    "tryItFriction": "Construct a Merkle Tree in TypeScript over 10,000 key-value pairs: simulate a single modified key on Replica B, compare root hashes, and execute recursive tree traversal to pinpoint the exact corrupted key in under 15 hash comparisons.",
    "socraticHints": [
      "Why is a Merkle tree exponentially faster than sending raw row checksums?",
      "Because comparing root hashes takes 1 network exchange! If roots match, 100% of data is verified identical in 1 step.",
      "If roots differ, binary tree branching prunes 50% of the dataset at each level, zeroing in on the difference with logarithmic efficiency."
    ],
    "situationalPuzzle": {
      "scenario": "Two database replicas each store 1,000,000 customer records. Replica A and Replica B compare data using a Merkle Tree of depth 20. Exactly 1 record has a different phone number. How many hash comparisons does the anti-entropy protocol execute across the network to locate the differing record?",
      "options": [
        "1,000,000 comparisons.",
        "Approximately 40 comparisons ($2 \\times \\text{depth}$): The root comparison fails ($1$). At each level of the binary tree, the protocol compares the 2 child hashes, identifies which child branch differs, and recurses down that branch. With depth 20, it executes $\\approx 40$ comparisons, avoiding checking 999,999 identical records.",
        "500,000 comparisons.",
        "Zero comparisons."
      ],
      "answerIdx": 1,
      "debrief": "Merkle Trees turn massive dataset comparisons into logarithmic searches. By comparing parent hashes and only recursing into branches where hashes mismatch, anti-entropy protocols locate data divergences with minimal network traffic."
    },
    "quests": [
      { "id": "dist-m2-d39-q1", "name": "Merkle Tree Cryptographic Theory & Anti-Entropy Bandwidth Mathematics", "type": "concept", "desc": "Formalize hash tree construction, range partitioning, and network bandwidth asymptotic bounds." },
      { "id": "dist-m2-d39-q2", "name": "Detective Lab: Profiling Cassandra nodetool repair Merkle Tree Generation Overhead", "type": "detective", "desc": "Monitor CPU and disk I/O metrics during active anti-entropy repair tree calculation on production nodes." },
      { "id": "dist-m2-d39-q3", "name": "Mastery Assignment: TypeScript Merkle Tree Anti-Entropy Synchronization Engine", "type": "assignment", "desc": "Build an in-memory Merkle tree generator and recursive peer-to-peer sync protocol locating divergent keys." },
      { "id": "dist-m2-d39-q4", "name": "Production Incident Lab: Un-Repaired Replica Silent Drift Customer Data Discrepancy Triage", "type": "detective", "desc": "Remediate a replica desynchronization crisis by orchestrating an emergency Merkle-tree anti-entropy repair." }
    ]
  },
  {
    "day": 40,
    "month": 2,
    "blockNum": 8,
    "title": "\u2b50 MILESTONE 7: CRDT-Replicated Masterless Key-Value Store with Merkle Tree Anti-Entropy",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Milestone Gate: Peer-to-Peer Resilient Storage)",
    "spokenGoal": "Assemble Milestone 7: Build a complete Masterless Distributed Key-Value Storage Engine in TypeScript inspired by Amazon Dynamo and Apache Cassandra. Support consistent hash ring placement with replication factor $N=3$, tunable consistency quorums ($R, W$), Sloppy Quorums and Hinted Handoff, CRDT data structures (PN-Counter, OR-Set) for zero-conflict convergence, and background Merkle Tree Anti-Entropy synchronization.",
    "conceptInvariant": "Masterless Eventual Convergence Invariant: The storage cluster must guarantee that under active network partitions, writes to sloppy quorums succeed without blocking. When partitions heal, hinted handoff delivery and Merkle tree anti-entropy must converge all replicas to mathematically identical state with zero lost updates.",
    "failureMode": "Failing to account for tombstone deletion in Merkle trees: deleted records are removed from the tree immediately, causing background repair to see the record missing on one replica and 'resurrect' the deleted record from another replica.",
    "tryItFriction": "Pass the Milestone 7 chaos validation battery: deploy 5 virtual storage nodes, sever network links between nodes while executing 50,000 concurrent CRDT counter increments and set operations, heal the partition, and verify 100% deterministic state convergence across all 5 nodes.",
    "socraticHints": [
      "Why must deleted items in an eventually consistent store retain tombstones in Merkle trees?",
      "Because without a tombstone, an anti-entropy protocol cannot distinguish between 'this item was deleted' and 'this item was newly added on the other replica and needs to be copied here'!",
      "Tombstones ensure deletions propagate correctly during background repair."
    ],
    "situationalPuzzle": {
      "scenario": "During your Milestone 7 defense, the evaluation harness deletes key 'user_99' on Node 1. Node 2 is partitioned and still has the key. When the partition heals, the anti-entropy Merkle repair runs. Node 1 does not store tombstones. What happens to key 'user_99' on Node 1?",
      "options": [
        "It remains deleted.",
        "Deleted Key Resurrection: Because Node 1 simply deleted the key from memory without leaving a tombstone, Node 2's Merkle tree reports that it has a key Node 1 lacks. The anti-entropy engine assumes Node 1 missed a write and copies 'user_99' back onto Node 1, resurrecting the deleted data!",
        "Node 2 deletes the key.",
        "The cluster crashes."
      ],
      "answerIdx": 1,
      "debrief": "In distributed eventually consistent systems, deletions must be recorded as Tombstones. Deleting data immediately without tombstones causes anti-entropy protocols to treat the missing data as an un-replicated write, resurrecting deleted items."
    },
    "quests": [
      { "id": "dist-m2-d40-q1", "name": "Milestone 7 Architecture: Masterless NoSQL Storage Engine Blueprint", "type": "concept", "desc": "Design node ring interfaces, sloppy quorum coordinators, CRDT merge protocols, and Merkle tree sync." },
      { "id": "dist-m2-d40-q2", "name": "Detective Lab: Auditing Data Convergence under Simulated Bipartite Network Partitions", "type": "detective", "desc": "Measure convergence latency and verify mathematical identity of replica states after partition healing." },
      { "id": "dist-m2-d40-q3", "name": "Mastery Assignment: Full TypeScript Masterless CRDT Storage Engine with Merkle Trees", "type": "assignment", "desc": "Implement the complete Milestone 7 storage system with tunable consistency, hinted handoffs, and anti-entropy." },
      { "id": "dist-m2-d40-q4", "name": "Production Incident Lab: Tombstone Resurrection Ghost Customer Data Crisis Triage", "type": "detective", "desc": "Triage and fix a GDPR violation where deleted customer records were resurrected by an anti-entropy sync." }
    ]
  },

  # ─── BLOCK 9: Distributed Transactions & Workflows (Days 41–45) ───────────────
  {
    "day": 41,
    "month": 2,
    "blockNum": 9,
    "title": "Atomic Commitment: Two-Phase Commit (2PC) Deep Dive, Coordinator Crash Scenarios & In-Doubt Resolution",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Atomic Commitment Protocols & In-Doubt States)",
    "spokenGoal": "Deep-dive into the classic atomic commitment protocol: Two-Phase Commit (2PC - Jim Gray 1978). Analyze Phase 1 (Prepare: Coordinator asks cohorts to vote and hold locks) and Phase 2 (Commit or Abort). Dissect all failure combinations: Participant crash during Prepare, Coordinator crash after collecting votes, and master In-Doubt Transaction recovery.",
    "conceptInvariant": "2PC In-Doubt Blocking Invariant: Once a participant votes VOTE-COMMIT, it enters the PREPARED state. In this state, the participant has surrendered its autonomy: it CANNOT unilaterally abort (the coordinator might have decided commit) and CANNOT unilaterally commit (another participant might have voted abort). If the coordinator crashes, the participant is BLOCKED in-doubt.",
    "failureMode": "A centralized 2PC coordinator crashes after receiving 'VOTE-COMMIT' from 10 database participants: the coordinator stays down for 4 hours. All 10 databases hold exclusive row locks on critical accounts, blocking thousands of concurrent customer transactions and causing a total operational shutdown.",
    "tryItFriction": "Construct a Two-Phase Commit coordinator and participant engine in TypeScript: inject simulated coordinator crashes immediately before and after writing the commit log record, and implement participant timeout and peer-interrogation recovery.",
    "socraticHints": [
      "Can a participant in 2PC unilaterally abort if it has NOT yet voted PREPARED?",
      "Yes! Prior to sending VOTE-COMMIT, a participant retains full autonomy and can vote VOTE-ABORT at any time (e.g. on disk error or constraint violation)!",
      "Autonomy is lost only after voting YES in Phase 1."
    ],
    "situationalPuzzle": {
      "scenario": "In a 2PC transaction, Coordinator sends PREPARE to Cohorts A and B. Both vote YES. Coordinator's server suffers a kernel panic and shuts down before writing any commit record to disk. Cohort A and Cohort B time out waiting for Phase 2. Can Cohort A and Cohort B contact each other to resolve the transaction?",
      "options": [
        "No, they must wait for the coordinator forever.",
        "Peer-Interrogation Protocol: Cohort A asks Cohort B: 'Did you receive a commit/abort decision from the coordinator?' If Cohort B says 'No, I am also in PREPARED', neither knows what the coordinator decided. However, if the coordinator did not write a commit record before crashing, it will abort upon restart. But without knowing if the coordinator sent COMMIT to a third participant, they cannot safely commit.",
        "Cohort A flips a coin.",
        "Both automatically commit."
      ],
      "answerIdx": 1,
      "debrief": "2PC's fundamental vulnerability is coordinator failure during the in-doubt window. If all reachable participants are in the PREPARED state, they cannot know whether the coordinator committed or aborted, forcing them to remain blocked."
    },
    "quests": [
      { "id": "dist-m1-d41-q1", "name": "The Two-Phase Commit Formal Specification & Finite State Machine Matrix", "type": "concept", "desc": "Map state transitions, persistent WAL requirements, and message timeout matrices for 2PC." },
      { "id": "dist-m1-d41-q2", "name": "Detective Lab: Auditing XA Distributed Transactions in Java/Postgres with pg_prepared_xacts", "type": "detective", "desc": "Inspect stuck XA transactions in PostgreSQL and trace held locks and memory footprints." },
      { "id": "dist-m1-d41-q3", "name": "Mastery Assignment: TypeScript 2PC Coordinator with Peer-Interrogation Recovery", "type": "assignment", "desc": "Build a 2PC coordinator and cohort state machine implementing persistent logging and recovery." },
      { "id": "dist-m1-d41-q4", "name": "Production Incident Lab: Orphaned 2PC Prepared Transaction Lock Avalanche Triage", "type": "detective", "desc": "Resolve a high-severity database stall caused by orphaned prepared transactions holding locks for 12 hours." }
    ]
  },
  {
    "day": 42,
    "month": 2,
    "blockNum": 9,
    "title": "Non-Blocking Commitment: Three-Phase Commit (3PC: Can-Commit, Pre-Commit, Do-Commit) & Partition Flaws",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Non-Blocking Consensus & Asynchronous Limitations)",
    "spokenGoal": "Attempt to solve 2PC's blocking problem: examine Dale Skeen's 1981 Three-Phase Commit (3PC) protocol. Add the intermediate 'Pre-Commit' state to break the synchronous deadlock: Phase 1 (Can-Commit?), Phase 2 (Pre-Commit / Ready), Phase 3 (Do-Commit). Uncover why 3PC is non-blocking under fail-stop crash failures, but completely fails under asynchronous network partitions (FLP Impossibility).",
    "conceptInvariant": "3PC Non-Blocking vs Partition Vulnerability Invariant: 3PC eliminates blocking under node crashes because no state transitions directly from uncertainty to commitment without passing through Pre-Commit. However, under network partitions, 3PC can split into two groups where one group aborts and the other group commits, violating consistency.",
    "failureMode": "Deploying 3PC across public cloud networks expecting non-blocking safety: a transient network partition occurs, causing partitioned nodes to time out and commit while the other partition times out and aborts, permanently corrupting financial balances.",
    "tryItFriction": "Build a Three-Phase Commit protocol in TypeScript: demonstrate non-blocking termination when the coordinator crashes in Pre-Commit, and then demonstrate split-brain inconsistency when injecting a network partition.",
    "socraticHints": [
      "Why did the industry abandon 3PC in favor of Paxos/Raft-backed consensus?",
      "Because 3PC only works in synchronous networks with reliable failure detectors; on the real-world Internet with asynchronous network partitions, 3PC can violate consistency and cause split-brain!",
      "Consensus protocols (Paxos/Raft) guarantee safety under arbitrary network partitions."
    ],
    "situationalPuzzle": {
      "scenario": "A system implements 3PC. A network partition splits the cluster: Partition 1 contains the Coordinator and Cohort A (in PRE-COMMIT state); Partition 2 contains Cohort B and Cohort C (still in CAN-COMMIT state). What conflicting decisions can occur?",
      "options": [
        "The cluster automatically heals.",
        "Split-Brain Commitment Violation: Partition 1 has reached PRE-COMMIT, so it proceeds to DO-COMMIT. Partition 2 has not received PRE-COMMIT, times out, and decides to ABORT. The transaction commits on Cohort A and aborts on Cohort B/C, permanently destroying atomicity.",
        "Both partitions wait forever.",
        "PostgreSQL converts to SQLite."
      ],
      "answerIdx": 1,
      "debrief": "3PC assumes synchronous network bounds. When an asynchronous network partition occurs, timeout-based non-blocking recovery can lead one partition to commit while another aborts, violating atomic commitment."
    },
    "quests": [
      { "id": "dist-m1-d42-q1", "name": "Three-Phase Commit Formal Protocol & State Transition Geometry", "type": "concept", "desc": "Diagram 3PC states: Initial, Waiting, PreCommit, Committed, Aborted, and derivation proofs." },
      { "id": "dist-m1-d42-q2", "name": "Detective Lab: Simulating Network Partitions on 3PC to Prove Inconsistency Leaks", "type": "detective", "desc": "Write automated partition tests demonstrating conflicting commit and abort decisions in 3PC." },
      { "id": "dist-m1-d42-q3", "name": "Mastery Assignment: TypeScript Three-Phase Commit Protocol Implementation", "type": "assignment", "desc": "Build a 3PC state machine with timeout transitions, pre-commit acknowledgments, and partition detection." },
      { "id": "dist-m1-d42-q4", "name": "Production Incident Lab: 3PC Split-Brain Divergence Financial Audit Triage", "type": "detective", "desc": "Investigate an audit discrepancy caused by an experimental 3PC implementation splitting under network lag." }
    ]
  },
  {
    "day": 43,
    "month": 2,
    "blockNum": 9,
    "title": "Long-Running Distributed Transactions: Saga Pattern (Orchestrator vs Choreography) & Compensation Trees (Temporal/Cadence)",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Eventual Consistency & Workflow Orchestration)",
    "spokenGoal": "Escape synchronous 2PC blocking across modern microservice workflows: master Hector Garcia-Molina's Saga Pattern (1987). Compare Choreography (event-driven pub/sub, decentralized but hard to monitor) versus Orchestration (centralized state machine like Temporal.io, AWS Step Functions, Cadence). Implement Compensating Transactions, backward recovery (rollbacks), and forward recovery (retries to completion).",
    "conceptInvariant": "Compensating Transaction Semantic Equivalence Invariant: A compensating transaction $C_i$ does NOT restore physical database state (unlike `ROLLBACK`); it applies a forward business operation that semantically reverses the business effect of completed transaction $T_i$ (e.g. refunding a credit card, un-reserving inventory). Compensating transactions must be idempotent and guaranteed to succeed.",
    "failureMode": "Designing a travel booking saga where a compensating transaction (Cancel Flight) fails due to an unhandled 500 API error: the saga coordinator gives up, leaving the user with a charged flight and cancelled hotel (Inconsistent Partial State Disaster).",
    "tryItFriction": "Construct a Saga Orchestrator in TypeScript: execute a 4-step distributed e-commerce workflow (Order Created -> Inventory Reserved -> Payment Processed -> Shipping Booked), simulate payment failure, and execute compensating transactions in reverse order.",
    "socraticHints": [
      "Why must compensating transactions in a Saga be idempotent?",
      "Because network failures can occur while executing the compensation, requiring the orchestrator to retry the compensation multiple times!",
      "If `refund()` is not idempotent, retrying might refund the customer twice."
    ],
    "situationalPuzzle": {
      "scenario": "A food delivery saga executes: 1) Charge Card ($30), 2) Reserve Restaurant, 3) Dispatch Driver. Step 3 fails because no drivers are available. The orchestrator triggers compensations: Cancel Restaurant, Refund Card. The payment gateway returns `504 Gateway Timeout` during the refund. What must the Saga orchestrator do?",
      "options": [
        "Give up and log an error.",
        "Retry the Compensating Transaction Indefinitely (Forward Recovery): Compensating transactions are legally contracted to succeed. The orchestrator must persist state, apply exponential backoff with jitter, and retry the refund until it succeeds (or escalate to a human dead-letter queue), guaranteeing eventual consistency.",
        "Charge the customer again.",
        "Crash the server."
      ],
      "answerIdx": 1,
      "debrief": "In a Saga, compensating transactions cannot simply fail and be abandoned. The orchestrator must guarantee forward recovery of compensations via persistent retry loops until the system reaches a consistent terminal state."
    },
    "quests": [
      { "id": "dist-m1-d43-q1", "name": "The Saga Pattern Architecture: Orchestration vs Choreography & State Machines", "type": "concept", "desc": "Compare coupling, observability, deadlock risks, and compensation tree structures across topologies." },
      { "id": "dist-m1-d43-q2", "name": "Detective Lab: Deconstructing Temporal.io Workflow Histories & Replay Mechanics", "type": "detective", "desc": "Inspect how Temporal records deterministic event histories and replays code to reconstruct execution state." },
      { "id": "dist-m1-d43-q3", "name": "Mastery Assignment: TypeScript Saga Orchestrator with Persistent State & Compensations", "type": "assignment", "desc": "Build an orchestration engine managing multi-step workflows, compensation stacks, and retry policies." },
      { "id": "dist-m1-d43-q4", "name": "Production Incident Lab: Failed Compensation Orphaned State Customer Balance Outage Triage", "type": "detective", "desc": "Resolve a high-severity customer balance incident caused by an abandoned compensating transaction." }
    ]
  },
  {
    "day": 44,
    "month": 2,
    "blockNum": 9,
    "title": "Transactional Messaging: Outbox Pattern, Change Data Capture (CDC / Debezium) & Idempotent Consumer Deduplication",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Dual-Write Elimination & CDC Architecture)",
    "spokenGoal": "Solve the distributed dual-write problem forever: master the Transactional Outbox Pattern. Commit business state updates and event messages into the same local database transaction (`orders` table and `outbox` table). Read outbox records using Change Data Capture (CDC / Debezium) by tailing the database Write-Ahead Log (WAL), stream events to Kafka, and implement Idempotent Consumer state tables to deduplicate incoming messages.",
    "conceptInvariant": "Outbox CDC Atomicity Invariant: An application must NEVER update a database and publish an event to Kafka in separate application code statements. The event must be staged inside the local database transaction. The CDC engine guarantees that if and only if the database transaction commits, the event will be extracted from WAL and published to the message broker.",
    "failureMode": "An application writes `await db.orders.create()` and then `await kafka.send()`: the database commits, but the application container is killed by Kubernetes OOM before sending to Kafka. The order exists in DB, but no event is ever published, permanently breaking downstream fulfillment.",
    "tryItFriction": "Build an end-to-end Transactional Outbox and Idempotent Consumer pipeline in TypeScript: stage outbox records in an emulated ACID table, simulate a CDC poller streaming events to a broker, and deduplicate messages at the consumer using a processed-events tracking table.",
    "socraticHints": [
      "Why is tailing the database WAL (Log-based CDC like Debezium) superior to polling the outbox table (`SELECT * FROM outbox WHERE status = 'PENDING'`)?",
      "Because polling queries create heavy database CPU load, table lock contention, and table bloat! Log-based CDC reads sequentially from the WAL on disk with zero impact on transactional database queries.",
      "Log-based CDC provides sub-millisecond event streaming."
    ],
    "situationalPuzzle": {
      "scenario": "A payments microservice receives an event: `PaymentInitiated(orderId: 42, amount: $100)`. Network delay causes the message to be delivered twice. The consumer executes: `INSERT INTO processed_events (event_id, order_id) VALUES ($1, $2);` inside the payment transaction. If the second message arrives, what does the database do?",
      "options": [
        "It processes the payment again.",
        "Unique Constraint Violation (Idempotent Deduplication): The second message has the same `event_id`. The unique index on `processed_events.event_id` throws a constraint violation, rolling back the duplicate payment transaction immediately. The consumer recognizes the duplicate and safely acknowledges the message without double-charging.",
        "The database deletes the order.",
        "The consumer crashes."
      ],
      "answerIdx": 1,
      "debrief": "Idempotent consumers use atomic database constraints (e.g. unique event tracking tables) within the business transaction. If a duplicate message arrives, the unique constraint aborts the transaction, preventing duplicate processing."
    },
    "quests": [
      { "id": "dist-m1-d44-q1", "name": "Transactional Outbox & Change Data Capture (CDC) Architecture Blueprint", "type": "concept", "desc": "Compare polling publisher vs transaction log miner (Debezium/pgoutput) and consumer deduplication tables." },
      { "id": "dist-m1-d44-q2", "name": "Detective Lab: Deconstructing Debezium PostgreSQL WAL Logical Decoding Events", "type": "detective", "desc": "Inspect raw JSON change events emitted by Debezium containing before, after, and transaction metadata." },
      { "id": "dist-m1-d44-q3", "name": "Mastery Assignment: TypeScript Transactional Outbox Relay & Idempotent Consumer", "type": "assignment", "desc": "Build an outbox processor tailing simulated WAL commits and an idempotent consumer with deduplication." },
      { "id": "dist-m1-d44-q4", "name": "Production Incident Lab: Dual-Write Out of Sync Ghost Order Customer Complaint Triage", "type": "detective", "desc": "Remediate a critical production discrepancy caused by application code dual-writing to database and Kafka." }
    ]
  },
  {
    "day": 45,
    "month": 2,
    "blockNum": 9,
    "title": "\u2b50 MILESTONE 8: Distributed Saga Workflow Orchestration Engine with Compensating Actions",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Milestone Gate: Distributed Workflow Engine)",
    "spokenGoal": "Assemble Milestone 8: Build an enterprise-grade Distributed Saga Workflow Orchestration Engine in TypeScript. Support multi-step long-running business workflows, persistent execution state logging, forward retry policies with exponential backoff and jitter, backward compensation execution upon terminal failure, and integration with the Transactional Outbox pattern.",
    "conceptInvariant": "Saga Workflow Terminal Consistency Invariant: The orchestrator must guarantee that every workflow reaches a clean terminal state: either ALL forward steps commit successfully (COMPLETED), or all executed steps are rolled back via compensating transactions in reverse order (COMPENSATED). Workflows must never remain abandoned in intermediate states.",
    "failureMode": "Failing to persist workflow execution state to durable storage before executing steps: if the orchestrator server crashes mid-workflow, all active workflows are wiped from memory, leaving partial transactions permanently unreconciled across microservices.",
    "tryItFriction": "Pass the Milestone 8 integration suite: execute 10,000 distributed multi-step checkout sagas under simulated microservice failure rates (20% step failures), verify 100% compensation completion, and recover active workflows after simulated orchestrator process kills.",
    "socraticHints": [
      "In what order must compensating transactions be executed when a workflow fails at Step 4?",
      "In strict reverse chronological order: Step 3's compensation, then Step 2's compensation, then Step 1's compensation!",
      "Reverse execution unwinds dependencies cleanly."
    ],
    "situationalPuzzle": {
      "scenario": "Your Milestone 8 orchestrator executes Step 1 (Book Flight) and Step 2 (Book Hotel). Step 3 (Book Car) fails. The orchestrator triggers Step 2's compensation (Cancel Hotel), but the hotel API returns `503 Service Unavailable`. What must the orchestrator do next?",
      "options": [
        "Skip the hotel and cancel the flight.",
        "Pause and Retry Hotel Compensation with Backoff: Compensations must be executed in order. Skipping Step 2 to cancel Step 1 could violate business dependencies. The orchestrator must persist the compensation backlog and retry the hotel cancellation until confirmed before moving to cancel the flight.",
        "Declare the workflow successful.",
        "Terminate the orchestrator process."
      ],
      "answerIdx": 1,
      "debrief": "Compensating transactions must follow disciplined ordering. If a compensation encounters a transient error, the orchestrator must retry that compensation rather than skipping steps, ensuring system state unwinds cleanly."
    },
    "quests": [
      { "id": "dist-m1-d45-q1", "name": "Milestone 8 Architecture: Saga Workflow Orchestrator Specification", "type": "concept", "desc": "Design workflow state machines, persistent transaction journals, compensation stacks, and retry engines." },
      { "id": "dist-m1-d45-q2", "name": "Detective Lab: Auditing Orchestrator Recovery from Mid-Flight Process Kills", "type": "detective", "desc": "Inject SIGKILL into the orchestrator process and verify that restarted workers resume pending sagas from journal." },
      { "id": "dist-m1-d45-q3", "name": "Mastery Assignment: Full TypeScript Distributed Saga Orchestration Engine", "type": "assignment", "desc": "Implement the complete Milestone 8 workflow engine with persistent journaling and automated compensations." },
      { "id": "dist-m1-d45-q4", "name": "Production Incident Lab: Stuck Workflow Inconsistent State E-Commerce Audit War Room", "type": "detective", "desc": "Resolve a high-severity financial audit crisis where failed sagas were left in uncompensated limbo." }
    ]
  }
]
