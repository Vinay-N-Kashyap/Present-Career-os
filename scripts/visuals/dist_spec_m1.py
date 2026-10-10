# scripts/visuals/dist_spec_m1.py
# Month 1 Days 1 to 15 for Course 11: High-Scale Distributed System Design (course-distributed-sys)
# Total Quests: 60 Quests (Days 1–15)

DIST_M1_PART1 = [
  # ─── BLOCK 1: Fallacies of Distributed Computing, RPC Protocols & Transport Internals (Days 1–5) ──
  {
    "day": 1,
    "month": 1,
    "blockNum": 1,
    "title": "Fallacies of Distributed Computing, Latency Physics, MTBF & Failure Domains",
    "stageName": "Stage 1: Mental Model Grounding",
    "stageNum": 1,
    "pedagogicalRole": "High Guidance (Distributed Physics & Foundational Fallacies)",
    "spokenGoal": "Shatter monolithic assumptions: analyze L. Peter Deutsch's canonical 8 Fallacies of Distributed Computing (the network is reliable, latency is zero, bandwidth is infinite, the network is secure, topology doesn't change, there is one administrator, transport cost is zero, the network is homogeneous). Calculate physical speed-of-light latency across continental fiber optic routes, define Mean Time Between Failures (MTBF), and map independent failure domains (racks, availability zones, regions).",
    "conceptInvariant": "Partial Failure & Asynchronous Network Invariant: In a distributed system, components fail independently while other components continue running. The network is asynchronous: messages may be delayed arbitrarily, reordered, duplicated, or silently lost. A caller cannot distinguish between a remote node crash, network partition, or extreme processing delay without explicit timeouts.",
    "failureMode": "Designing a microservice payment gateway that makes synchronous HTTP calls to 10 third-party partner services without timeouts: an overseas partner experiences network packet loss, causing all payment worker threads to block indefinitely, exhausting web server thread pools and crashing the entire checkout platform.",
    "tryItFriction": "Construct a distributed network latency simulator in TypeScript: model physical packet propagation delay based on fiber distance (e.g. NYC to London ~35ms one-way), simulate packet loss rates and jitter, and calculate availability SLAs across series vs parallel system architectures.",
    "socraticHints": [
      "Why is calculating availability for services in series multiplicative (A_total = A_1 * A_2 * ... * A_N)?",
      "Because if any single service in a synchronous dependency chain fails, the entire request fails!",
      "If you chain 10 microservices each with 99.9% uptime, your overall system availability collapses to 99.0% (over 7 hours of downtime per month)."
    ],
    "situationalPuzzle": {
      "scenario": "A developer writes: `const user = await fetch('http://user-service/api/profile');` without setting an explicit timeout. In local development, latency is 0.5ms. In staging, a switch failure severs communication to the user service. The API server stops responding to all incoming health checks and crashes. What happened?",
      "options": [
        "The computer ran out of disk space.",
        "Unbounded Socket Timeout Thread Starvation: Default HTTP client socket timeouts are either infinite or several minutes. When the remote endpoint became unreachable due to packet loss, incoming client requests consumed all available worker threads in the Node.js/Java runtime, causing thread pool exhaustion and total server unresponsiveness.",
        "The user profile was too large.",
        "Node.js does not support fetch."
      ],
      "answerIdx": 1,
      "debrief": "In distributed systems, every remote call must have strict connect and read timeouts. Without timeouts, network packet drops cause worker threads to hang indefinitely, resulting in cascading thread starvation across the entire calling service."
    },
    "quests": [
      { "id": "dist-m1-d01-q1", "name": "The 8 Fallacies of Distributed Computing Formal Analysis", "type": "concept", "desc": "Deconstruct each fallacy, its physical hardware root cause, and standard defensive architectural mitigation." },
      { "id": "dist-m1-d01-q2", "name": "Detective Lab: Profiling Cross-AZ vs Cross-Region Latency & Packet Jitter with ping/traceroute", "type": "detective", "desc": "Measure round-trip times (RTT) across cloud availability zones and regions to map physical latency boundaries." },
      { "id": "dist-m1-d01-q3", "name": "Mastery Assignment: TypeScript Distributed Network Simulator & SLA Availability Engine", "type": "assignment", "desc": "Build a network model calculating compound availability, physical speed-of-light bounds, and packet drop probabilities." },
      { "id": "dist-m1-d01-q4", "name": "Production Incident Lab: Unbounded HTTP Socket Hang Cascading Outage Triage", "type": "detective", "desc": "Resolve a high-severity production outage caused by un-timeouted remote API calls freezing backend worker threads." }
    ]
  },
  {
    "day": 2,
    "month": 1,
    "blockNum": 1,
    "title": "Transport & Wire Protocols: TCP Congestion Control (BBR vs CUBIC), Head-of-Line Blocking, HTTP/2 vs HTTP/3 QUIC",
    "stageName": "Stage 1: Mental Model Grounding",
    "stageNum": 1,
    "pedagogicalRole": "High Guidance (Transport Layer & Protocol Physics)",
    "spokenGoal": "Master the transport layer powering high-scale distributed backends: compare TCP Congestion Control algorithms (loss-based CUBIC vs model-based Google BBR), explore TCP 3-way handshakes and TLS 1.3 session resumption, dissect TCP Head-of-Line (HoL) Blocking, and contrast HTTP/2 binary framing multiplexing over TCP against UDP-based HTTP/3 QUIC.",
    "conceptInvariant": "TCP vs QUIC Head-of-Line Blocking Invariant: While HTTP/2 multiplexes multiple logical streams over a single TCP connection, a single dropped TCP packet stalls ALL concurrent streams on that connection until the lost segment is retransmitted. HTTP/3 QUIC operates over UDP, isolating stream loss: a lost packet in Stream A never blocks Stream B.",
    "failureMode": "Deploying HTTP/2 across high-latency, lossy mobile networks: 2% packet loss causes severe TCP head-of-line blocking, stalling all 50 multiplexed UI assets and making HTTP/2 significantly slower than legacy HTTP/1.1 with multiple connections.",
    "tryItFriction": "Build an HTTP/2 vs HTTP/3 stream multiplexing simulator in TypeScript: simulate concurrent stream downloads over a connection with 5% packet drop, measuring stream completion latency between TCP-based and QUIC-based multiplexing.",
    "socraticHints": [
      "Why does Google's BBR congestion control achieve higher throughput than CUBIC on high-bandwidth, high-latency links?",
      "Because CUBIC treats packet loss as a signal of network congestion and cuts its window in half, whereas BBR models the physical bottleneck bandwidth and Round-Trip Propagation Time (BtlBw and RTprop)!",
      "BBR maximizes throughput without filling up buffer queues (bufferbloat)."
    ],
    "situationalPuzzle": {
      "scenario": "A mobile video streaming application switches from HTTP/1.1 to HTTP/2. In urban 5G coverage, video load times improve by 40%. But users on rural 3G networks experience constant video buffering and UI freezes. Wireshark shows 3% packet loss on the rural connections. What transport layer issue is occurring?",
      "options": [
        "The mobile phone battery is degraded.",
        "TCP Head-of-Line Blocking on Multiplexed Streams: Under HTTP/2, all media, thumbnails, and metadata share a single TCP socket. When a packet is lost, the TCP receive buffer blocks the entire connection until the missing packet is retransmitted. In HTTP/1.1, independent sockets allowed non-lost streams to continue downloading.",
        "HTTP/2 disabled video codecs.",
        "The rural cellular towers do not support binary framing."
      ],
      "answerIdx": 1,
      "debrief": "HTTP/2 multiplexes streams over a single TCP connection. When packets drop on lossy networks, TCP's in-order byte stream guarantee blocks all streams on the socket. HTTP/3 QUIC solves this by implementing independent streams over UDP."
    },
    "quests": [
      { "id": "dist-m1-d02-q1", "name": "Transport Protocols: TCP 3-Way Handshake, TLS 1.3 0-RTT & QUIC UDP Architecture", "type": "concept", "desc": "Diagram connection establishment overhead, congestion window growth, and stream frame layouts." },
      { "id": "dist-m1-d02-q2", "name": "Detective Lab: Inspecting TCP Head-of-Line Blocking & Congestion Control with Wireshark", "type": "detective", "desc": "Capture packet traces under simulated packet loss to observe TCP window shrinkage and stream stalls." },
      { "id": "dist-m1-d02-q3", "name": "Mastery Assignment: TypeScript TCP vs QUIC Multiplexed Stream Simulator", "type": "assignment", "desc": "Implement a stream multiplexer simulating packet loss, head-of-line blocking, and independent stream delivery." },
      { "id": "dist-m1-d02-q4", "name": "Production Incident Lab: HTTP/2 High-Loss Network Multiplexing Latency Spike Triage", "type": "detective", "desc": "Remediate a mobile application latency regression caused by TCP HoL blocking on lossy wireless connections." }
    ]
  },
  {
    "day": 3,
    "month": 1,
    "blockNum": 1,
    "title": "High-Performance RPC: Protocol Buffers v3 Binary Wire Encoding (Varints, Tag-Length-Value) & gRPC Streaming",
    "stageName": "Stage 1: Mental Model Grounding",
    "stageNum": 1,
    "pedagogicalRole": "High Guidance (Binary Wire Protocols & RPC Mechanics)",
    "spokenGoal": "Ditch bloated JSON for high-performance internal microservices: master Google Protocol Buffers (Protobuf v3) binary serialization. Examine Varint encoding (7-bit payloads with MSB continuation), ZigZag encoding for signed integers, Tag-Length-Value (TLV) binary layouts, and gRPC's four communication modes (Unary, Server Streaming, Client Streaming, Bidirectional Streaming).",
    "conceptInvariant": "Wire-Compact Serialization Invariant: Protobuf encodes field tags as `(field_number << 3) | wire_type`. Field names are NEVER transmitted over the wire (unlike JSON keys which consume 70% of payload bytes). Integers are compressed dynamically via Varints, yielding 5x smaller payloads and 10x faster deserialization.",
    "failureMode": "Transmitting 50 MB of nested JSON payloads per second between internal microservices: JSON string parsing and serialization consume 60% of CPU cycles across backend servers, increasing P99 latency and doubling cloud compute bills.",
    "tryItFriction": "Construct a binary Protobuf Varint and ZigZag serializer/deserializer in TypeScript from raw bytes: encode 64-bit integers into compact byte arrays and verify tag-wire-type packing.",
    "socraticHints": [
      "Why is negative integer `-1` encoded inefficiently as 10 bytes in standard Varint, and how does ZigZag encoding fix it?",
      "Because in 64-bit two's complement, `-1` has all 64 bits set to 1! ZigZag encoding maps negative numbers to positive odd numbers ($0 \\to 0, -1 \\to 1, 1 \\to 2, -2 \\to 3$), keeping small negative numbers compact.",
      "Always use `sint32` or `sint64` in `.proto` files if fields frequently store negative numbers."
    ],
    "situationalPuzzle": {
      "scenario": "An engineer benchmarks two microservice endpoints transferring 1,000,000 telemetry objects: Endpoint A uses REST JSON; Endpoint B uses gRPC Protobuf. Payload size for JSON is 120 MB; Protobuf is 18 MB. CPU utilization on the consumer drops from 85% to 8%. Why is Protobuf deserialization so much cheaper for the CPU?",
      "options": [
        "Protobuf bypasses the operating system network stack.",
        "Zero-String Parsing & Binary Offsets: JSON requires lexical scanning, string allocations, and ASCII-to-integer parsing. Protobuf is already a structured binary format with fixed tag-wire types and lengths, allowing the CPU to read integers directly and copy byte slices into memory without string parsing.",
        "Protobuf compiles into C++ on the client.",
        "gRPC disables encryption."
      ],
      "answerIdx": 1,
      "debrief": "JSON is a human-readable text format requiring parsing character-by-character. Protobuf is a pre-compiled binary format where fields are identified by compact integer tags and raw binary values, slashing CPU parsing overhead by up to 90%."
    },
    "quests": [
      { "id": "dist-m1-d03-q1", "name": "Protobuf v3 Binary Wire Specification: Varints, ZigZag & Wire Types (0-5)", "type": "concept", "desc": "Map binary encoding rules for Varint, 64-bit fixed, length-delimited strings/embedded messages, and 32-bit fixed." },
      { "id": "dist-m1-d03-q2", "name": "Detective Lab: Hexdump Dissection of Raw gRPC HTTP/2 Frames & Protobuf Payloads", "type": "detective", "desc": "Inspect HTTP/2 DATA frames carrying gRPC 5-byte prefix headers (compressed flag + message length) and binary payload." },
      { "id": "dist-m1-d03-q3", "name": "Mastery Assignment: Pure TypeScript Protobuf Varint & Binary Message Serializer", "type": "assignment", "desc": "Build a binary serializer encoding fields by tag number, computing varints, and unpacking TLV structures." },
      { "id": "dist-m1-d03-q4", "name": "Production Incident Lab: JSON Serialization CPU Bottleneck Migration War Room", "type": "detective", "desc": "Lead the migration of a high-throughput internal billing pipeline from REST JSON to gRPC Protobuf." }
    ]
  },
  {
    "day": 4,
    "month": 1,
    "blockNum": 1,
    "title": "Serialization Frameworks & Schema Evolution: Protobuf vs Avro (Schema Registry) vs FlatBuffers (Zero-Copy)",
    "stageName": "Stage 1: Mental Model Grounding",
    "stageNum": 1,
    "pedagogicalRole": "High Guidance (Schema Evolution & Zero-Copy Deserialization)",
    "spokenGoal": "Master backward and forward schema compatibility across evolving distributed fleets: compare Protocol Buffers, Apache Avro (schema registry and reader/writer schema resolution), and FlatBuffers/Cap'n Proto (zero-copy in-place memory traversal). Define formal Schema Evolution rules (never change field numbers, never reuse tags, handle unknown fields).",
    "conceptInvariant": "Schema Compatibility Invariant: In an actively running distributed fleet, services running Schema Version N and Schema Version N+1 coexist simultaneously. A new field must always be optional or have a default value; deleting a field requires reserving its tag number (`reserved 4, 8;`) so future developers never reuse it.",
    "failureMode": "A developer renames and changes the type of Protobuf field 3 from `string user_name = 3;` to `int32 user_id = 3;`: old client services sending strings cause new services to crash with binary deserialization type errors, taking down the API gateway.",
    "tryItFriction": "Build an Avro-style Schema Evolution resolver in TypeScript: simulate reading a binary payload written with Schema V1 using Schema V2, demonstrating default value substitution and unknown field preservation.",
    "socraticHints": [
      "What is Zero-Copy Deserialization in FlatBuffers and Cap'n Proto?",
      "Accessing fields directly from the binary buffer in memory using pointer offsets without copying or unpacking data into runtime objects!",
      "Zero-copy eliminates memory allocation entirely, making it ideal for ultra-low-latency game engines and financial trading."
    ],
    "situationalPuzzle": {
      "scenario": "An engineer deletes a deprecated Protobuf field: `string legacy_token = 4;`. Six months later, another engineer adds a new field: `int64 account_id = 4;`. What happens when an un-upgraded client sends a message containing field 4 to the updated service?",
      "options": [
        "The compiler prevents the deployment.",
        "Corrupted Data & Type Confusion: The un-upgraded client sends a length-delimited string for field 4, but the updated service attempts to parse it as a 64-bit varint. The deserializer fails or reads corrupted integer values. Field tags must ALWAYS be explicitly reserved: `reserved 4; reserved 'legacy_token';`.",
        "Protobuf automatically detects and translates the field.",
        "The message is routed to an error queue."
      ],
      "answerIdx": 1,
      "debrief": "Protobuf maps data strictly by field numbers, never names. Reusing an old field number for a new field causes silent data corruption or decoding failures when communicating with older services. Always mark deprecated tags with `reserved`."
    },
    "quests": [
      { "id": "dist-m1-d04-q1", "name": "Schema Evolution Rules: Backward, Forward & Full Compatibility Matrix", "type": "concept", "desc": "Formalize schema evolution rules across Protobuf, Avro, and JSON Schema." },
      { "id": "dist-m1-d04-q2", "name": "Detective Lab: Auditing Confluent Schema Registry Compatibility Modes (BACKWARD_TRANSITIVE)", "type": "detective", "desc": "Test schema changes against Schema Registry API and observe compatibility rejections." },
      { "id": "dist-m1-d04-q3", "name": "Mastery Assignment: TypeScript Zero-Copy Binary Buffer Reader (FlatBuffers Style)", "type": "assignment", "desc": "Build an in-place binary reader accessing nested struct fields directly via vtable byte offsets." },
      { "id": "dist-m1-d04-q4", "name": "Production Incident Lab: Reused Protobuf Field Number Cross-Service Corruption Triage", "type": "detective", "desc": "Resolve a high-severity data corruption incident caused by an un-reserved field tag collision." }
    ]
  },
  {
    "day": 5,
    "month": 1,
    "blockNum": 1,
    "title": "\u2b50 MILESTONE 1: High-Throughput gRPC Bi-Directional Streaming Engine with Protocol Buffers",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Milestone Gate: RPC Streaming Infrastructure)",
    "spokenGoal": "Assemble Milestone 1: Build a high-throughput, production-grade gRPC-style RPC communication engine in TypeScript. Implement binary Protobuf serialization with Varint packing, HTTP/2-style multiplexed stream channels, connection keep-alives with ping frames, and bidirectional streaming support with backpressure flow control.",
    "conceptInvariant": "Stream Backpressure & Flow Control Invariant: In a bidirectional RPC stream, the consumer must signal its processing capacity via window update frames. The producer must NEVER buffer unbounded messages in memory; if the consumer's receive window is zero, the producer must pause transmission to prevent out-of-memory crashes.",
    "failureMode": "Streaming 1,000,000 real-time price updates over an unconstrained gRPC stream to a slow client: the server's TCP write buffer exhausts, un-sent messages queue in application memory, and the server crashes with Node.js / JVM Out Of Memory.",
    "tryItFriction": "Pass the Milestone 1 test battery: transmit 100,000 streaming binary messages between client and server across multiplexed virtual channels, verifying zero memory leaks, correct backpressure throttling, and automatic reconnect on socket drop.",
    "socraticHints": [
      "How does gRPC implement application-level flow control on top of HTTP/2?",
      "Via HTTP/2 WINDOW_UPDATE frames: each stream and the overall connection maintain separate receive window credit balances!",
      "When credits reach zero, the sender must stop emitting DATA frames."
    ],
    "situationalPuzzle": {
      "scenario": "During your Milestone 1 streaming benchmark, a client processes messages slowly (taking 10ms per message), while the server generates messages at 10,000/sec. Within 30 seconds, your server memory usage jumps from 50 MB to 1.8 GB and terminates with OOM. What flow control mechanism was missing?",
      "options": [
        "The CPU fan stopped spinning.",
        "Missing Stream Backpressure / Flow Control: The server's streaming producer pushed messages without checking if the client acknowledged them or if the output buffer was drained. Without backpressure throttling, unacknowledged messages accumulated in the server's in-memory transmit queue until memory was exhausted.",
        "The network bandwidth was too fast.",
        "gRPC does not support streaming."
      ],
      "answerIdx": 1,
      "debrief": "Streaming systems must enforce backpressure. When a consumer is slower than the producer, the producer must be paused (e.g. listening to the socket `drain` event or checking window credits) to keep memory usage strictly bounded."
    },
    "quests": [
      { "id": "dist-m1-d05-q1", "name": "Milestone 1 Architecture: High-Throughput RPC Streaming Blueprint", "type": "concept", "desc": "Design connection state machines, binary framing headers, stream multiplexing tables, and flow controllers." },
      { "id": "dist-m1-d05-q2", "name": "Detective Lab: Profiling RPC Stream Memory Buffers under Slow Consumer Emulation", "type": "detective", "desc": "Monitor heap memory allocations and socket buffer sizes when streaming to an intentionally throttled consumer." },
      { "id": "dist-m1-d05-q3", "name": "Mastery Assignment: Full TypeScript gRPC-Style Bidirectional Streaming Engine", "type": "assignment", "desc": "Implement the complete Milestone 1 engine supporting binary serialization, stream multiplexing, and backpressure." },
      { "id": "dist-m1-d05-q4", "name": "Production Incident Lab: Unbounded Stream Producer Memory Exhaustion War Room", "type": "detective", "desc": "Triage and fix a production microservice crash caused by missing backpressure on real-time event streams." }
    ]
  },

  # ─── BLOCK 2: Partitioning, Routing & Distributed Caching (Days 6–10) ──────────
  {
    "day": 6,
    "month": 1,
    "blockNum": 2,
    "title": "Data Placement: Consistent Hashing Ring with Virtual Nodes (Ketama), Bounded-Load Consistent Hashing",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Distributed Partitioning & Routing Topologies)",
    "spokenGoal": "Master the mathematical heart of distributed data routing: analyze David Karger's Consistent Hashing algorithm, explore the Ketama ring implementation used in memcached and Cassandra, allocate Virtual Nodes (VNodes) to achieve uniform $O(1/N)$ load balance, and evaluate Google's Bounded-Load Consistent Hashing to prevent cascading cache server overload.",
    "conceptInvariant": "Consistent Hashing Minimization & Bounded Load Invariant: On a ring with $N$ physical nodes and $V$ virtual nodes per physical host, adding or removing a node migrates strictly $1/N$ fraction of total keys. With Bounded-Load, if the designated node's current load exceeds $(1 + \\epsilon) \\times \\text{average\\_load}$, the request walks clockwise to the next available non-overloaded node.",
    "failureMode": "Using simple modulo hashing (`hash(key) % N`): when 1 cache node out of 20 crashes, the modulus changes for 95% of all keys, causing a catastrophic 95% cache miss wave that immediately crashes the backend database.",
    "tryItFriction": "Implement a Consistent Hashing Ring with 128 virtual nodes in TypeScript: benchmark key distribution variance across 10 nodes, measure key migration percentages when adding an 11th node, and enforce a 125% bounded load ceiling.",
    "socraticHints": [
      "Why are virtual nodes (e.g. 100-256 vnodes per physical server) necessary in consistent hashing?",
      "Because with only 1 point per node on the circle, statistical variance creates severe hot spots where some nodes own 5x more keys than others!",
      "Virtual nodes interleave points around the ring, achieving near-perfect uniform distribution."
    ],
    "situationalPuzzle": {
      "scenario": "A media streaming platform uses consistent hashing to cache video chunks across 50 edge servers. A breaking news video goes viral, receiving 100,000 requests per second. The single server responsible for that video's hash key suffers 100% CPU saturation and crashes. The traffic immediately shifts to the next server on the ring, crashing it too (Cascading Domino Crash). What routing mechanism prevents this?",
      "options": [
        "Increase the server RAM.",
        "Google Bounded-Load Consistent Hashing: Set an upper load threshold (e.g. $1.25 \\times \\text{average load}$) for every node. When the viral key's designated server reaches its load capacity, the ring router automatically overflows excess requests to the next clockwise node, spreading viral load across multiple servers.",
        "Disable caching.",
        "Change the hash function to MD5."
      ],
      "answerIdx": 1,
      "debrief": "Standard consistent hashing routes a specific key to exactly one node. For hot/viral keys, this creates catastrophic single-node saturation. Bounded-Load Consistent Hashing sets a strict maximum capacity per node, gracefully overflowing traffic to secondary nodes."
    },
    "quests": [
      { "id": "dist-m1-d06-q1", "name": "Consistent Hashing Mathematics & Load Variance Analysis", "type": "concept", "desc": "Derive standard deviation formulas for key distribution across virtual node counts V = 1, 10, 100, 256." },
      { "id": "dist-m1-d06-q2", "name": "Detective Lab: Simulating Node Crashes on Modulo vs Consistent Hash Rings", "type": "detective", "desc": "Measure cache miss percentage spikes following node failure across both hashing strategies." },
      { "id": "dist-m1-d06-q3", "name": "Mastery Assignment: TypeScript Consistent Hash Ring with Bounded-Load Overflow", "type": "assignment", "desc": "Build a ring router with binary search ring traversal, virtual nodes, and dynamic load cap enforcement." },
      { "id": "dist-m1-d06-q4", "name": "Production Incident Lab: Hot-Key Cascading Cache Server Domino Outage Triage", "type": "detective", "desc": "Mitigate a cascading failure storm where viral traffic collapsed successive cache nodes on a hash ring." }
    ]
  },
  {
    "day": 7,
    "month": 1,
    "blockNum": 2,
    "title": "Distributed Caching Topologies: Cache-Aside, Read-Through, Write-Through & Write-Behind (Write-Back)",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Caching Patterns & Write Topologies)",
    "spokenGoal": "Architect high-throughput caching layers: analyze the four canonical caching patterns: Cache-Aside (Lazy Loading - application orchestrates cache and DB), Read-Through (cache library encapsulates DB read), Write-Through (synchronous write to cache and DB), and Write-Behind / Write-Back (asynchronous batched database write for extreme write throughput).",
    "conceptInvariant": "Write-Through vs Write-Behind Durability Invariant: Write-Through guarantees zero data loss on cache crash (synchronous DB persistence) at the cost of higher write latency. Write-Behind delivers sub-millisecond writes by queuing updates in cache RAM, but risks data loss if the cache node crashes before flushing dirty buffers to the database.",
    "failureMode": "Adopting Write-Behind caching for a financial ledger balance table without replication: a sudden server power outage erases dirty in-memory cache buffers before they reach disk, permanently losing $2,000,000 of committed customer transactions.",
    "tryItFriction": "Build all four caching patterns in TypeScript against an emulated database: measure write latency and simulate sudden crash scenarios to evaluate data loss risks under Write-Behind versus Write-Through.",
    "socraticHints": [
      "In Cache-Aside, should the application UPDATE the cache or DELETE (invalidate) the cache entry when database data changes?",
      "Always DELETE (invalidate) the cache entry!",
      "Updating the cache introduces dangerous race conditions where concurrent writes can leave stale, out-of-order data permanently in cache."
    ],
    "situationalPuzzle": {
      "scenario": "Two concurrent threads execute under Cache-Aside. Thread 1 updates user name to 'Alice' in DB. Thread 2 updates user name to 'Bob' in DB. If both threads attempt to update the cache directly, what race condition can leave the cache permanently out of sync with the database?",
      "options": [
        "The cache server crashes.",
        "Concurrent Update Race: Thread 2 writes 'Bob' to DB, then Thread 1 writes 'Alice' to DB. But Thread 1's cache update reaches Redis first ('Alice'), followed by Thread 2's cache update ('Bob'). Now the DB has 'Alice' (Thread 1 committed last in DB), but the cache has 'Bob' forever. Deleting the cache key prevents this race.",
        "Redis runs out of memory.",
        "The database rejects the second write."
      ],
      "answerIdx": 1,
      "debrief": "Never update cache values directly on database writes in Cache-Aside. Interleaving network latencies can cause cache updates to arrive in reverse order compared to database commits. Always invalidate (delete) the cache entry."
    },
    "quests": [
      { "id": "dist-m1-d07-q1", "name": "Caching Topologies Matrix: Cache-Aside vs Read-Through vs Write-Through vs Write-Behind", "type": "concept", "desc": "Compare read latency, write latency, concurrency race conditions, and data loss vulnerability." },
      { "id": "dist-m1-d07-q2", "name": "Detective Lab: Reproducing Cache-DB Race Conditions with Concurrent Threads in Redis", "type": "detective", "desc": "Execute concurrent read/write schedules to demonstrate stale data retention during direct cache updates." },
      { "id": "dist-m1-d07-q3", "name": "Mastery Assignment: TypeScript Multi-Pattern Caching Framework with Invalidation Hooks", "type": "assignment", "desc": "Build an extensible caching manager implementing Cache-Aside, Write-Through, and asynchronous Write-Behind." },
      { "id": "dist-m1-d07-q4", "name": "Production Incident Lab: Write-Behind Crash Data Loss Postmortem & Recovery", "type": "detective", "desc": "Perform forensics and salvage unwritten transactions after an un-replicated write-back cache crashed." }
    ]
  },
  {
    "day": 8,
    "month": 1,
    "blockNum": 2,
    "title": "Cache Stampede & Thundering Herd Defense: Singleflight Request Coalescing, Probabilistic Early Expiration (XFetch)",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Stampede Defense & Probabilistic Algorithms)",
    "spokenGoal": "Defend databases from the catastrophic Cache Stampede (Thundering Herd): when a popular cache key expires, thousands of concurrent requests miss cache simultaneously and bombard the database with identical queries. Master Mutex Singleflight (request coalescing), TTL Jitter randomization, and the optimal XFetch probabilistic early recomputation algorithm (Vattani et al.).",
    "conceptInvariant": "Singleflight Request Coalescing Invariant: For any given cache key $K$, exactly ONE concurrent worker is permitted to fetch data from the database. All other concurrent requests for key $K$ must subscribe to the in-flight promise/channel and share the single returned result without touching the database.",
    "failureMode": "A homepage banner cached for 60 seconds expires during peak traffic: 50,000 concurrent incoming requests miss cache in the same 100ms window, all execute `SELECT * FROM homepage_banners`, pinning database CPU at 100% and taking the entire site offline.",
    "tryItFriction": "Implement both Mutex Singleflight and the XFetch probabilistic early expiration algorithm in TypeScript: simulate 10,000 concurrent requests against an expiring key and prove that database queries are capped at exactly 1.",
    "socraticHints": [
      "How does the XFetch formula $-\\beta \\times \\delta \\times \\ln(\\text{rand()}) > \\text{TTL}$ prevent cache stampedes?",
      "As TTL approaches zero, the probability of a read randomly triggering background recomputation approaches 100%!",
      "A worker refreshes the cache *before* it actually expires, so clients never experience a cache miss."
    ],
    "situationalPuzzle": {
      "scenario": "A cache key with 1-hour TTL is accessed 5,000 times per second. An engineer sets a hard TTL of 3600s with no jitter or coalescing. At second 3600, database connections surge from 10 to 4,000 and time out. What two defense mechanisms should be combined to eliminate this stampede permanently?",
      "options": [
        "Increase server memory and disable caching.",
        "Singleflight Coalescing + Probabilistic Early Expiration (XFetch): Use Singleflight so only 1 query can execute at a time for that key, and implement XFetch so background workers refresh the value before the 3600s mark, ensuring the cache key never expires for active readers.",
        "Set TTL to infinite and never update data.",
        "Switch from Redis to Memcached."
      ],
      "answerIdx": 1,
      "debrief": "Singleflight ensures that even if a key expires, only 1 request queries the database while others wait. XFetch refreshes hot keys asynchronously before expiration based on read frequency and computation cost, eliminating misses entirely."
    },
    "quests": [
      { "id": "dist-m1-d08-q1", "name": "Cache Stampede Mathematics & The XFetch Algorithm Proof", "type": "concept", "desc": "Derive the optimal probabilistic early refresh formula: $\\Delta - \\beta \\cdot \\delta \\cdot \\ln(U) > 0$." },
      { "id": "dist-m1-d08-q2", "name": "Detective Lab: Profiling Database Query Spikes on Cache Expiry with k6 Load Testing", "type": "detective", "desc": "Benchmark backend database connection surges during key expiration with and without stampede defenses." },
      { "id": "dist-m1-d08-q3", "name": "Mastery Assignment: TypeScript Mutex Singleflight & XFetch Caching Engine", "type": "assignment", "desc": "Implement a production-grade cache wrapper with promise deduplication and probabilistic early renewal." },
      { "id": "dist-m1-d08-q4", "name": "Production Incident Lab: Black Friday Cache Expiration Thundering Herd Collapse Triage", "type": "detective", "desc": "Rescue a collapsed e-commerce database during a flash sale by hot-patching Singleflight request coalescing." }
    ]
  },
  {
    "day": 9,
    "month": 1,
    "blockNum": 2,
    "title": "Distributed Invalidation & Consistency: Invalidation Buses, Two-Tier Caching (L1 Local / L2 Redis) & Consistency Leaks",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Multi-Tier Caching & Invalidation Pub/Sub)",
    "spokenGoal": "Architect multi-tier caching fleets: analyze Two-Tier Caching (L1 In-Memory process cache like Caffeine/Node-lru with 0.001ms latency, backed by L2 Distributed Redis with 1ms latency). Master distributed invalidation buses using Redis Pub/Sub, Kafka, or Redis Client-Side Caching (Tracking), and identify the subtle race conditions that cause L1 consistency leaks.",
    "conceptInvariant": "L1/L2 Invalidation Invariant: When an application updates a record in Database and invalidates L2 Redis, it must broadcast an invalidation message across the cluster. Every application node must immediately evict that key from its local L1 in-memory cache to prevent serving stale state.",
    "failureMode": "Deploying 50 microservice instances with local in-memory L1 caches without an invalidation bus: an admin updates a user's permissions to 'Revoked', but 30 server pods continue serving active sessions from stale L1 cache for 10 minutes.",
    "tryItFriction": "Construct a Two-Tier (L1 Local Map / L2 Redis mock) cache in TypeScript: implement an Invalidation Bus using pub/sub events, simulate network partition delays, and measure stale read windows.",
    "socraticHints": [
      "What is Redis Client-Side Caching (Tracking mode in Redis 6+)?",
      "A protocol where the Redis server remembers which keys each client has read, and automatically sends invalidation messages (`PUSH`) to that client when the key is mutated by any connection!",
      "It eliminates the need for manual application pub/sub invalidation buses."
    ],
    "situationalPuzzle": {
      "scenario": "A trading platform uses L1 in-memory caching (5-minute TTL) on 20 API servers. Node 1 updates stock price from $100 to $105. It updates DB and deletes the key in L2 Redis. However, Node 5's L1 cache still has $100. A user on Node 5 buys the stock for $100 instead of $105. How should multi-tier cache consistency be enforced?",
      "options": [
        "Disable all caching forever.",
        "Distributed Invalidation Bus via Pub/Sub: When Node 1 mutates the price, it publishes an invalidation event (`price:update:AAPL`) to a Redis Pub/Sub channel. All 20 API server nodes listen to the channel and immediately evict the key from their local L1 memory, eliminating the 5-minute stale window.",
        "Restart all 20 servers on every price update.",
        "Switch to MySQL."
      ],
      "answerIdx": 1,
      "debrief": "Multi-tier caching requires active invalidation. Without an invalidation bus, local process memory caches retain stale data until their local TTL expires, causing severe cross-node inconsistency."
    },
    "quests": [
      { "id": "dist-m1-d09-q1", "name": "Multi-Tier Caching Architecture: L1 Process Memory vs L2 Shared Remote vs DB", "type": "concept", "desc": "Map latency hierarchies (L1 50ns, L2 1ms, DB 15ms), memory bounds, and invalidation topologies." },
      { "id": "dist-m1-d09-q2", "name": "Detective Lab: Dissecting Redis 6 Client-Side Caching (CLIENT TRACKING on)", "type": "detective", "desc": "Inspect RESP3 protocol invalidation push messages and track invalidation latency under high churn." },
      { "id": "dist-m1-d09-q3", "name": "Mastery Assignment: TypeScript Two-Tier (L1/L2) Cache with Pub/Sub Invalidation Engine", "type": "assignment", "desc": "Build a two-tier caching client coordinating local LRU memory with Redis and broadcast invalidations." },
      { "id": "dist-m1-d09-q4", "name": "Production Incident Lab: Stale L1 Cache User Permission Bypass Security Triage", "type": "detective", "desc": "Resolve a critical security vulnerability where revoked admin privileges remained active in stale L1 caches." }
    ]
  },
  {
    "day": 10,
    "month": 1,
    "blockNum": 2,
    "title": "\u2b50 MILESTONE 2: Resilient Distributed Multi-Tier Cache with Singleflight Coalescing & XFetch",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Milestone Gate: Distributed Caching Fleet)",
    "spokenGoal": "Assemble Milestone 2: Build a production-grade, highly resilient Distributed Multi-Tier Caching Engine in TypeScript. Combine Consistent Hashing with virtual nodes and bounded load, Two-Tier L1/L2 cache hierarchy, Mutex Singleflight request coalescing, XFetch probabilistic early renewal, and broadcast pub/sub invalidation.",
    "conceptInvariant": "Cache Fleet Correctness & Zero-Stampede Invariant: The cache fleet must guarantee that under arbitrary concurrent load and sudden key expirations, database query rates remain bounded by $O(1)$ per key. Invalidation broadcasts must evict L1 caches across all simulated cluster nodes within $\\le 5\\text{ms}$.",
    "failureMode": "Failing to release singleflight mutexes when an upstream database query throws an error: all subsequent concurrent requests for that key remain permanently blocked, hanging indefinitely.",
    "tryItFriction": "Pass the Milestone 2 integration suite: simulate 50,000 concurrent requests across 10 virtual client nodes hitting 1,000 expiring keys, verifying zero stampedes, 99.8% cache hit ratios, and zero orphaned singleflight promises.",
    "socraticHints": [
      "What must happen to the singleflight group if the database fetch fails?",
      "The mutex group must delete the in-flight promise and reject all waiting callers immediately!",
      "Never leave an unresolved promise in the singleflight map; always clean up inside a `finally` block."
    ],
    "situationalPuzzle": {
      "scenario": "During your Milestone 2 evaluation, the test harness injects a database timeout error on key 'config_data'. The singleflight call catches the error, but forgets to delete `inFlight.delete(key)`. What happens to the next 5,000 requests for 'config_data' that arrive 10 seconds later?",
      "options": [
        "They succeed immediately.",
        "Permanent Cache Freeze: Because the rejected promise remains cached in the singleflight map, all subsequent callers receive the stale rejected promise or block forever, never attempting a new database fetch until the process is restarted. Proper cleanup in `finally` is mandatory.",
        "The cache converts to SQLite.",
        "The server allocates more CPU."
      ],
      "answerIdx": 1,
      "debrief": "Singleflight tracking maps must be cleaned up in a `finally` block. Leaving failed or completed promises in the map permanently poisons the key, preventing future requests from fetching fresh data."
    },
    "quests": [
      { "id": "dist-m1-d10-q1", "name": "Milestone 2 Architecture: Multi-Tier Distributed Cache Specification", "type": "concept", "desc": "Design component contracts: HashRing, L1Manager, L2Connector, SingleflightCoordinator, and Invalidator." },
      { "id": "dist-m1-d10-q2", "name": "Detective Lab: Auditing Cache Hit Ratios & Singleflight Error Handling under Chaos", "type": "detective", "desc": "Inject network timeouts and verify that singleflight properly propagates errors and resets state." },
      { "id": "dist-m1-d10-q3", "name": "Mastery Assignment: Full TypeScript Resilient Multi-Tier Distributed Cache Engine", "type": "assignment", "desc": "Implement the complete Milestone 2 caching engine integrating consistent hashing, XFetch, and Singleflight." },
      { "id": "dist-m1-d10-q4", "name": "Production Incident Lab: Orphaned Singleflight Lock Microservice Outage Triage", "type": "detective", "desc": "Triage and fix an outage where a failed database query permanently locked an API endpoint's cache fetcher." }
    ]
  },

  # ─── BLOCK 3: Clocks, Ordering & Causality (Days 11–15) ────────────────────────
  {
    "day": 11,
    "month": 1,
    "blockNum": 3,
    "title": "Physical Time Dilemma: NTP Clock Drift, Clock Skew, Leap Seconds & Why Physical Timestamps Break Ordering",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Physical Clock Physics & Failure Modes)",
    "spokenGoal": "Confront the physical impossibility of synchronized time in distributed systems: examine quartz crystal oscillator drift, Network Time Protocol (NTP) synchronization limits (packet jitter, stratum hierarchies), clock slew vs clock step, the chaos of UTC Leap Seconds (which crashed Cloudflare, Qixin, and Reddit), and prove why relying on physical `Date.now()` timestamps for event ordering causes silent data loss.",
    "conceptInvariant": "Physical Clock Asynchrony Invariant: In an asynchronous distributed system, physical clocks on different machines can NEVER be perfectly synchronized. Clock skew (difference between two clocks at an instant) and clock drift (difference in ticking frequency) are unbounded without specialized hardware. Therefore, physical timestamps cannot establish a reliable causal order.",
    "failureMode": "Relying on physical timestamps for Last-Write-Wins (LWW) conflict resolution in Cassandra: Node A's clock is 150ms slow due to NTP drift. Node A updates a record AFTER Node B, but receives an older timestamp, causing the database to silently discard Node A's newer write.",
    "tryItFriction": "Simulate physical clock drift and NTP synchronization in TypeScript: model 5 distributed nodes with random oscillator frequency drifts (+/- 50ppm), simulate NTP sync adjustments, and demonstrate event order inversion when using physical timestamps.",
    "socraticHints": [
      "What is the difference between clock skew and clock drift?",
      "Clock skew is the instantaneous time difference between two clocks; clock drift is the difference in speed at which two clocks tick over time!",
      "A clock with 100 parts-per-million (ppm) drift drifts by 8.6 seconds every single day without NTP synchronization."
    ],
    "situationalPuzzle": {
      "scenario": "A chat application stamps messages using the client device's `Date.now()`. User A sends 'Hi' from a phone whose clock is 2 minutes fast. User B replies 'Hello' 5 seconds later from a phone with accurate time. When the conversation renders sorted by timestamp, User B's reply appears 2 minutes BEFORE User A's question. Why did this occur?",
      "options": [
        "The chat server has a database bug.",
        "Client Clock Skew Inversion: Physical timestamps on independent un-synchronized devices have no guaranteed relationship to true real-world order. User A's fast clock produced a timestamp in the future, causing naive physical timestamp sorting to reverse the causal order of the conversation.",
        "User B sent the message into the past.",
        "The network reversed the TCP packets."
      ],
      "answerIdx": 1,
      "debrief": "Never rely on physical timestamps generated by independent devices to order events. Physical clocks drift and are subject to user tampering, timezone errors, and NTP jumps, inverting causal message history."
    },
    "quests": [
      { "id": "dist-m1-d11-q1", "name": "Physical Clock Physics: Quartz Oscillators, NTP Strata & Leap Second Smearing", "type": "concept", "desc": "Formalize oscillator drift formulas, NTP Marzullo algorithm, and Google Leap Smear architecture." },
      { "id": "dist-m1-d11-q2", "name": "Detective Lab: Measuring Clock Skew & Drift across AWS Cloud Instances with chrony", "type": "detective", "desc": "Use chronyc tracking and sources commands to measure microsecond-level clock offset and jitter." },
      { "id": "dist-m1-d11-q3", "name": "Mastery Assignment: TypeScript Clock Drift & NTP Synchronization Simulator", "type": "assignment", "desc": "Build an oscillator model with ppm drift, network packet jitter, and NTP step/slew correction." },
      { "id": "dist-m1-d11-q4", "name": "Production Incident Lab: Cassandra Last-Write-Wins Silent Data Disappearance Outage", "type": "detective", "desc": "Investigate and resolve data loss caused by clock drift corrupting Cassandra LWW timestamp ordering." }
    ]
  },
  {
    "day": 12,
    "month": 1,
    "blockNum": 3,
    "title": "Logical Time: Lamport Timestamps & Partial Event Ordering (Happens-Before Relation)",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Logical Clocks & Causality Theory)",
    "spokenGoal": "Discover Leslie Lamport's 1978 breakthrough (Time, Clocks, and the Ordering of Events in a Distributed System): abandon physical clocks and define Logical Time based on causality. Master the Happens-Before Relation ($a \\to b$), Lamport Logical Clocks (incrementing local counter on event, transmitting timestamp in messages, taking $\\max(\\text{local}, \\text{msg}) + 1$), and total ordering with tie-breaking.",
    "conceptInvariant": "Lamport Clock Invariant: If event $a$ causally precedes event $b$ ($a \\to b$), then LamportTimestamp($a$) < LamportTimestamp($b$). However, the converse is NOT true: if LamportTimestamp($a$) < LamportTimestamp($b$), we CANNOT infer that $a \\to b$ (they might be concurrent events).",
    "failureMode": "Assuming that a Lamport timestamp comparison proves causality: an engineer assumes event A caused event B because A's Lamport timestamp is smaller, failing to realize they occurred in disconnected branches with no message exchange.",
    "tryItFriction": "Construct a Lamport Logical Clock simulator in TypeScript: model 3 concurrent processes exchanging messages, track counter advancements, and implement deterministic tie-breaking using process IDs: $(L(e), \\text{pid})$.",
    "socraticHints": [
      "What are the three conditions defining the Happens-Before ($a \\to b$) relation?",
      "1) If $a$ and $b$ are in the same process and $a$ occurs before $b$, $a \\to b$. 2) If $a$ is sending a message and $b$ is receiving that message, $a \\to b$. 3) Transitivity: If $a \\to b$ and $b \\to c$, then $a \\to c$!",
      "If neither $a \\to b$ nor $b \\to a$ holds, the events are concurrent ($a \\parallel b$)."
    ],
    "situationalPuzzle": {
      "scenario": "Process 1 has local clock 4 and sends a message to Process 2. Process 2 has local clock 10. When Process 2 receives the message, what does it set its logical clock to according to Lamport's algorithm?",
      "options": [
        "4",
        "11: Process 2 sets its clock to $\\max(\\text{local}, \\text{received}) + 1 = \\max(10, 4) + 1 = 11$. This guarantees that the receive event has a higher logical timestamp than both the send event (4) and all prior local events on Process 2 (10).",
        "15 (the sum of both clocks)",
        "10"
      ],
      "answerIdx": 1,
      "debrief": "Lamport's clock rule requires: on receiving a message with timestamp $T$, the local clock becomes $\\max(\\text{local}, T) + 1$. This mathematical rule preserves causal ordering without physical synchronization."
    },
    "quests": [
      { "id": "dist-m1-d12-q1", "name": "Lamport Clock Formal Proof & The Happens-Before Theorem", "type": "concept", "desc": "Deconstruct partial order graphs, concurrent event pairs ($a \\parallel b$), and total order tie-breaking." },
      { "id": "dist-m1-d12-q2", "name": "Detective Lab: Tracing Logical Timestamps in Distributed Event Message Flows", "type": "detective", "desc": "Map message communication graphs and verify Lamport clock monotonic advancement across simulated nodes." },
      { "id": "dist-m1-d12-q3", "name": "Mastery Assignment: TypeScript Lamport Logical Clock & Event Bus Simulator", "type": "assignment", "desc": "Build a multi-process event bus implementing Lamport clock synchronization and total event ordering." },
      { "id": "dist-m1-d12-q4", "name": "Production Incident Lab: Out-of-Order Distributed Event Processing Bug Forensic Triage", "type": "detective", "desc": "Resolve a severe data pipeline bug where financial ledger events were processed out of causal order." }
    ]
  },
  {
    "day": 13,
    "month": 1,
    "blockNum": 3,
    "title": "Vector Clocks: Causality Tracking, Concurrent Update Detection & Divergent Branch Merging",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Causality Vectors & Concurrency Detection)",
    "spokenGoal": "Solve the limitation of Lamport clocks: master Vector Clocks (Mattern & Fidge 1988), where each node maintains an array of logical counters for every node in the cluster: $V = [c_1, c_2, ..., c_N]$. Formally detect concurrent updates ($V_A \\parallel V_B$), track causal dependencies in Dynamo-style databases, and implement application-level divergent branch merging.",
    "conceptInvariant": "Vector Clock Bi-Directional Causality Invariant: $A$ causally preceded $B$ ($A \\to B$) if and only if for all nodes $k$, $V_A[k] \\le V_B[k]$ AND for at least one node $j$, $V_A[j] < V_B[j]$. If neither $V_A \\le V_B$ nor $V_B \\le V_A$, the updates are strictly CONCURRENT ($V_A \\parallel V_B$), requiring conflict resolution.",
    "failureMode": "Silently overwriting divergent vector clock branches: when two shopping carts are updated concurrently on different nodes ($V_1 = [1, 0]$ and $V_2 = [0, 1]$), the system naively picks one cart, permanently deleting items added by the customer in the other session.",
    "tryItFriction": "Implement Vector Clocks in TypeScript: compare vectors to evaluate causality (`DOMINATES`, `DOMINATED_BY`, `CONCURRENT`), and merge concurrent shopping cart versions using set union.",
    "socraticHints": [
      "Why did Amazon Dynamo originally use Vector Clocks for shopping carts?",
      "Because when network partitions occurred, shoppers could add items to their carts on different replicas; upon reconciliation, Vector Clocks detected concurrency so the application could merge both carts together without losing items!",
      "Vector Clocks preserve all concurrent branches (siblings) until resolved."
    ],
    "situationalPuzzle": {
      "scenario": "Two versions of a document exist in a multi-master database. Version A has Vector Clock `[Node1: 2, Node2: 1]`. Version B has Vector Clock `[Node1: 1, Node2: 2]`. What is the causal relationship between Version A and Version B?",
      "options": [
        "Version A caused Version B.",
        "Concurrent Conflict ($V_A \\parallel V_B$): In Node 1's counter, $A > B$ ($2 > 1$). In Node 2's counter, $B > A$ ($2 > 1$). Neither vector dominates the other across all dimensions. They represent concurrent modifications created independently during a partition, requiring a merge.",
        "Version B caused Version A.",
        "The vector clock is corrupted."
      ],
      "answerIdx": 1,
      "debrief": "A vector clock dominates another only if it is $\\ge$ in all elements and strictly $>$ in at least one. If each has a higher counter in different positions, neither dominates: they are concurrent conflicting versions ($A \\parallel B$)."
    },
    "quests": [
      { "id": "dist-m1-d13-q1", "name": "Vector Clock Mathematical Foundations: Partial Orders & Concurrency Proof", "type": "concept", "desc": "Derive vector comparison theorems, vector dominance, and concurrency detection rules." },
      { "id": "dist-m1-d13-q2", "name": "Detective Lab: Deconstructing Amazon Dynamo Shopping Cart Sibling Generation", "type": "detective", "desc": "Trace how network partitions generate sibling branches and analyze vector clock pruning limits." },
      { "id": "dist-m1-d13-q3", "name": "Mastery Assignment: TypeScript Vector Clock Engine with Concurrent Conflict Resolver", "type": "assignment", "desc": "Build a complete Vector Clock tracker supporting local tick, message send/receive, and sibling resolution." },
      { "id": "dist-m1-d13-q4", "name": "Production Incident Lab: Overwritten Shopping Cart Concurrency Conflict War Room", "type": "detective", "desc": "Resolve a high-severity customer data loss incident caused by improper conflict resolution on vector siblings." }
    ]
  },
  {
    "day": 14,
    "month": 1,
    "blockNum": 3,
    "title": "Hybrid Logical Clocks (HLC): Combining Physical Wall Clocks and Logical Counters (CockroachDB / MongoDB Style)",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Modern Hybrid Clocks & Causality Bound)",
    "spokenGoal": "Unify the best of both worlds: explore Hybrid Logical Clocks (HLC - Kulkarni et al. 2014) as implemented in CockroachDB, MongoDB, and YugabyteDB. Analyze how HLC pairs physical time ($l$, bounded close to NTP physical clock) with a logical counter ($c$) to guarantee causality tracking without unbounded vector array growth, providing $O(1)$ constant-size 64-bit timestamps.",
    "conceptInvariant": "HLC Causality & Physical Closeness Invariant: For any events $e \\to f$, $\\text{HLC}(e) < \\text{HLC}(f)$ (guaranteed causal ordering). Simultaneously, for any event $e$, physical component $l.e$ never drifts far from the physical wall clock ($|l.e - \\text{physical}| \\le \\epsilon$), allowing HLC timestamps to be used for point-in-time snapshot reads.",
    "failureMode": "A server's physical clock jumps forward by 10 years due to a buggy NTP server: because HLC takes $\\max(l, \\text{physical})$, the HLC physical component jumps 10 years into the future and can never tick backward, corrupting all subsequent transaction timestamps.",
    "tryItFriction": "Construct a Hybrid Logical Clock in TypeScript: implement `hlc.now()`, message send, and message receive algorithms, demonstrating strict causality tracking while keeping physical time bounded within 250ms of system clock.",
    "socraticHints": [
      "Why did modern distributed databases switch from Vector Clocks to Hybrid Logical Clocks (HLC)?",
      "Because Vector Clocks grow linearly with the number of cluster nodes ($O(N)$ size), becoming massive on 1,000-node clusters! HLC requires strictly $O(1)$ constant size (two numbers: physical and logical)!",
      "HLC provides single-value timestamps that correlate with real-world time."
    ],
    "situationalPuzzle": {
      "scenario": "A CockroachDB node receives an RPC message with HLC timestamp `(physical: 1050, logical: 3)`. The local node's physical clock is currently `1020`. What does the local node set its HLC to when processing the message?",
      "options": [
        "It crashes.",
        "Set physical to 1050 and logical to 4: Since received physical (1050) is greater than local physical (1020), the HLC advances its physical time component to 1050 and increments logical to 4. As long as $|1050 - 1020| = 30\\text{ms} \\le \\text{max\\_offset}$, the jump is valid and preserves causal order.",
        "It sets physical to 1020.",
        "It rejects the message as a security threat."
      ],
      "answerIdx": 1,
      "debrief": "HLC advances physical time to $\\max(\\text{local\\_hlc.l}, \\text{msg.l}, \\text{physical\\_clock})$ and increments the logical counter if physical times match. If the received time exceeds the local physical clock by more than `max_offset`, the node aborts to prevent runaway clock skew."
    },
    "quests": [
      { "id": "dist-m1-d14-q1", "name": "Hybrid Logical Clock Formal Algorithm Specification & Invariants", "type": "concept", "desc": "Formalize the four HLC update rules: send event, local event, receive event, and max_offset bounds." },
      { "id": "dist-m1-d14-q2", "name": "Detective Lab: Inspecting CockroachDB HLC Timestamp Generation in Cluster Logs", "type": "detective", "desc": "Trace how CockroachDB assigns HLC timestamps to transactions and detects clock jump anomalies." },
      { "id": "dist-m1-d14-q3", "name": "Mastery Assignment: Pure TypeScript Hybrid Logical Clock (HLC) Implementation", "type": "assignment", "desc": "Build an HLC module with 64-bit integer packing, physical bound checks, and causal message integration." },
      { "id": "dist-m1-d14-q4", "name": "Production Incident Lab: Runaway NTP Clock Forward Jump Cluster Halt Triage", "type": "detective", "desc": "Resolve a distributed database cluster halt caused by a faulty NTP server advancing clocks by 3 hours." }
    ]
  },
  {
    "day": 15,
    "month": 1,
    "blockNum": 3,
    "title": "\u2b50 MILESTONE 3: Hybrid Logical Clock (HLC) & Causal Dependency Tracker Engine",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Milestone Gate: Distributed Causality & HLC)",
    "spokenGoal": "Assemble Milestone 3: Build an enterprise-grade Distributed Causality and Hybrid Logical Clock Engine in TypeScript. Support multi-node message passing, monotonic HLC timestamp generation, causal dependency tracking, max physical offset enforcement to detect rogue clocks, and deterministic causal history reconstruction.",
    "conceptInvariant": "HLC Causality Monotonicity Invariant: Across any execution trace of $K$ concurrent distributed nodes, for every message sent at event $S$ and received at event $R$, the engine must guarantee that $\\text{HLC}(S) < \\text{HLC}(R)$ strictly. Sorting any global trace by HLC must never invert a causal dependency.",
    "failureMode": "Failing to check physical clock bounds against `max_offset`: a malicious or desynchronized node with a clock 1 day in the future infects the entire cluster, forcing all nodes to advance their HLCs 1 day ahead, permanently breaking point-in-time snapshot recovery.",
    "tryItFriction": "Pass the Milestone 3 verification suite: execute 10,000 asynchronous message exchanges across 8 simulated nodes with varying physical clock drifts, proving 100% causal correctness and zero inverted dependencies.",
    "socraticHints": [
      "What is `max_offset` in HLC systems like CockroachDB?",
      "The maximum allowed difference between a node's physical clock and the timestamp received from a remote peer (typically 500ms)!",
      "If incoming timestamp - local clock > max_offset, the node self-fences to prevent cluster-wide clock poisoning."
    ],
    "situationalPuzzle": {
      "scenario": "During your Milestone 3 defense, Node 4's physical clock is delayed by 200ms due to CPU throttle. It sends 50 messages to Node 1. Does the causal order of messages invert when sorted by your engine's HLC timestamps?",
      "options": [
        "Yes, because Node 4's physical clock is behind.",
        "No, HLC Logical Counter Monotonicity: Even though Node 4's physical clock is behind, each message transmission advances the local logical counter. Node 1 incorporates the incoming timestamp into its own HLC, guaranteeing strictly ascending timestamps that preserve causal order regardless of physical clock lag.",
        "Node 1 crashes.",
        "The messages are deleted."
      ],
      "answerIdx": 1,
      "debrief": "The primary virtue of Hybrid Logical Clocks is that logical counters guarantee causal progress even when physical clocks lag. Timestamps are guaranteed to increase monotonically along causal chains."
    },
    "quests": [
      { "id": "dist-m1-d15-q1", "name": "Milestone 3 Architecture: HLC & Causality Engine Blueprint", "type": "concept", "desc": "Design HLC timestamp binary formats (48-bit physical ms, 16-bit logical), state machines, and RPC interceptors." },
      { "id": "dist-m1-d15-q2", "name": "Detective Lab: Verifying Causal Order Graph Acyclicity across 10,000 Trace Events", "type": "detective", "desc": "Run automated graph cycle detection to mathematically prove that HLC sorting produces valid topological orders." },
      { "id": "dist-m1-d15-q3", "name": "Mastery Assignment: Full TypeScript Hybrid Logical Clock & Causality Tracker", "type": "assignment", "desc": "Implement the complete Milestone 3 engine with max_offset protections, binary packing, and trace visualizer." },
      { "id": "dist-m1-d15-q4", "name": "Production Incident Lab: Rogue VM Clock Skew Cluster Infection Forensic Triage", "type": "detective", "desc": "Remediate a distributed cluster where a single drifting VM caused transaction timestamp inflation." }
    ]
  }
]
