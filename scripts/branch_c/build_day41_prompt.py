import json
import hashlib
import re

part1_say = [
    "In the developmental progression of enterprise artificial intelligence systems, software architectures eventually encounter the intractable computational boundaries of single-agent designs. A single foundation model instance—regardless of context window size or parameter scale—suffers from cognitive fatigue, tool attention dilution, and contradictory directive interference when forced to execute complex, multi-stage enterprise operations. Attempting to build an autonomous software engineer, clinical trial auditor, or financial underwriting platform using a solitary agent loop inevitably results in shallow reasoning, missed edge cases, and catastrophic operational deadlocks.",
    "Centralized supervisor coordination establishes explicit hierarchical task decomposition boundaries, marking the decisive transition from monolithic agents to collaborative multi-agent swarms. In a multi-agent swarm architecture, cognitive responsibilities are surgically segregated across a collective of specialized, autonomous worker agents. Rather than requiring one model to master web search, financial arithmetic, code generation, and executive prose simultaneously, the system provisions dedicated agents endowed with domain-isolated system prompts, restricted tool registries, and targeted negative constraints.",
    "The fundamental debate in multi-agent systems design centers on Centralized Orchestration versus Peer-to-Peer Decentralized Choreography. In fully decentralized peer-to-peer swarms, agents interact opportunistically through shared communication channels, passing messages without a designated authority. While decentralized choreography offers conceptual elegance and theoretical fault tolerance, in commercial enterprise environments it frequently succumbs to infinite message chatter loops, circular reasoning deadlocks, and unpredictable execution costs.",
    "Conversely, Centralized Hierarchical Choreography introduces an executive Supervisor Agent that acts as conductor and orchestrator of the entire cognitive collective. The supervisor sits at the apex of the organizational hierarchy, ingesting high-level business goals, decomposing missions into structured sub-tasks, assigning work packages to specialized worker agents, and synthesizing intermediate findings into authoritative executive deliverables. This centralized oversight guarantees deterministic task progress and strict operational budget enforcement.",
    "Role specialization within hierarchical swarms delivers profound accuracy and context efficiency benefits. Consider an enterprise compliance audit workflow: a Research Agent queries regulatory databases and downloads statutory filings; a Quantitative Verification Agent extracts balance sheet tables and calculates liquidity ratios; a Code Analysis Agent inspects system repository logs for security patches; and a Governance Agent drafts the final audit opinion. Each worker operates within a lean, highly focused context window of less than one thousand tokens, eliminating the attention dilution that cripples monolithic agents.",
    "Inter-agent delegation protocols govern how work units transition across organizational boundaries. The supervisor constructs a Directed Acyclic Graph (DAG) of dependencies, determining which operations can execute in parallel and which require sequential handoffs. For instance, quantitative verification and security log analysis can execute concurrently across distributed cloud workers, whereas the governance drafting agent must await the completion of both quantitative and technical work streams.",
    "Cognitive load theory in multi-agent systems explains why distributed architectures radically suppress hallucination rates. When an individual model instance is presented with dozens of competing instructions, its self-attention weights become dispersed across multiple irreconcilable attention heads. By narrowing each worker agent's mandate to a singular, well-defined domain, attention heads achieve maximum concentration on critical decision variables, elevating reasoning fidelity to near-perfection.",
    "Cost economics in multi-agent swarms achieve dramatic optimization through heterogeneous model tiering. The supervisor model—requiring multi-step planning, task decomposition, and nuanced synthesis—is powered by a top-tier flagship frontier model. In contrast, specialized worker agents executing targeted classification, data extraction, or format translation tasks operate on lightweight, highly quantized eight-billion-parameter models. This tiered allocation slashes blended operational API expenses by upwards of seventy percent compared to running frontier models across every agent loop.",
    "Enterprise governance and security policies are reinforced through physical worker isolation. In sensitive corporate environments, certain data vaults contain restricted financial or personal records that should never be accessible to general research workers. In a hierarchical swarm, access credentials and API keys are provisioned exclusively to the specific worker authorized for that domain, ensuring zero privilege leakage across the broader cognitive ecosystem.",
    "Mastering multi-agent choreography elevates enterprise prompt engineers into distributed systems architects. By commanding supervisor orchestration, worker role partitioning, and structured communication meshes, you construct resilient autonomous intelligence platforms capable of executing complex, multi-day enterprise initiatives with peerless precision and operational transparency."
]

part2_say = [
    "At the operational apex of a hierarchical multi-agent architecture stands the Executive Supervisor Controller. The supervisor serves as the strategic planning brain and operational dispatcher of the swarm, bridging the gap between ambiguous natural language user requests and the deterministic, specialized capabilities of downstream worker agents. If the supervisor fails in its planning or delegation duties, the entire multi-agent collective falters regardless of individual worker capabilities.",
    "Executive supervisor controllers decompose incoming enterprise objectives into directed acyclic graphs of discrete, executable work packages. When an enterprise user submits an ambitious goal—such as 'Evaluate the financial, regulatory, and competitive impact of acquiring our target competitor'—the supervisor does not blindly invoke tools. Instead, it enters an analytical decomposition loop, identifying constituent research hypotheses, quantitative data requirements, and regulatory compliance checkpoints.",
    "The supervisor formulates explicit input-output contracts for every delegated task. For each subordinate agent, the supervisor specifies the precise operational objective, the injected contextual constraints, the allowable tool suite, and the required output schema. By strictly bounding the input and expected output of every sub-task, the supervisor prevents workers from hallucinating out-of-scope tasks or engaging in unstructured conversational tangents.",
    "Topological sorting algorithms within the supervisor planning engine determine the optimal execution schedule across the generated task DAG. Nodes with zero incoming dependencies are immediately flagged for concurrent dispatch to the worker pool. As worker nodes finish and publish their outputs, the supervisor marks dependent downstream nodes as unblocked, continuously streaming work to available compute workers with minimal idle scheduling overhead.",
    "Recursive task decomposition trees enable multi-level supervisor hierarchies for planetary-scale enterprise operations. When an objective encompasses dozens of cross-departmental operations, the primary Executive Supervisor delegates major thematic domains to secondary Domain Supervisors—such as a Legal Supervisor and a Financial Modeling Supervisor—which in turn orchestrate specialized leaf worker agents. This hierarchical recursion partitions computational complexity cleanly, allowing massive organizations to coordinate hundreds of collaborating models without encountering centralized scheduling bottlenecks.",
    "Dynamic worker provisioning allows the supervisor to scale agent resources adaptively based on task complexity. In a routine workflow, the supervisor might activate only two worker agents: a retrieval specialist and an editor. However, when processing high-stakes corporate acquisitions or complex engineering migrations, the supervisor dynamically spawns secondary worker pools—such as antitrust legal specialists, debt restructuring modelers, and technical due diligence agents—coordinating their concurrent execution with millisecond precision.",
    "Supervisors enforce rigorous quality gates and iterative acceptance criteria on intermediate worker outputs. When a specialized worker completes its assigned sub-task and submits its response to the supervisor, the supervisor does not immediately accept the deliverable. Instead, it evaluates the submission against pre-defined acceptance criteria, checking for factual completeness, schema validity, and mathematical consistency. If the worker's output falls short, the supervisor rejects the submission with targeted critique, directing the worker to re-execute with refined parameters.",
    "Context isolation represents a foundational design invariant in supervisor architectures. Workers are deliberately shielded from the full conversational history and internal deliberations of other peer agents. The supervisor acts as an information firewall, passing only the minimum necessary findings between workers. This context isolation prevents catastrophic context pollution, preserves worker attention bandwidth, and ensures that sensitive domain data does not leak into unrelated task prompts.",
    "State persistence and checkpointing mechanisms protect multi-step supervisor workflows from unexpected system disruptions. At each stage of DAG execution, the supervisor commits the active task graph, worker allocations, and intermediate outputs to a persistent state store. If an underlying server node restarts or experiences network partitioning, the supervisor resumes execution from the latest verified checkpoint without re-running completed worker tasks.",
    "Supervisory synthesis transforms fragmented intermediate outputs into cohesive, board-ready enterprise deliverables. Once all dependent sub-tasks in the execution graph are successfully resolved, the supervisor aggregates the structured findings, reconciles stylistic differences, verifies source citations, and authors a polished executive briefing that directly addresses the user's initial objective.",
    "By engineering robust executive supervisor controllers, enterprise platforms achieve organizational scalability. The supervisor functions as an autonomous project director, ensuring that dozens of specialized foundation models collaborate harmoniously to solve complex multi-domain challenges."
]

part3_say = [
    "In multi-agent systems, inter-agent communication represents both the primary mechanism of collaboration and the greatest potential point of failure. When multiple autonomous language models interact, unstructured natural language communication quickly deteriorates into verbose message loops, semantic drift, and exorbitant token consumption. Developing enterprise-grade multi-agent swarms requires formalizing Inter-Agent Communication Protocols through structured schema exchange and bandwidth-efficient message passing.",
    "Standardized message passing protocols structure inter agent communication across swarms, transforming loose natural language chats into deterministic distributed RPC mechanisms. Rather than allowing agents to send freeform paragraphs to each other, production architectures enforce strict Pydantic or Protocol Buffer envelopes for all cross-agent messages. Every communication envelope contains immutable metadata fields: sender agent identifier, recipient agent identifier, correlation trace token, task timestamp, payload schema version, and cryptographic signature.",
    "The payload of an inter-agent message is strictly typed to reflect its functional intent. Common payload primitives include: TaskDelegationRequest (specifying objectives and constraints), TaskProgressNotification (providing incremental status updates), ArtifactDeliveryPayload (returning validated structured deliverables), and ClarificationRequest (soliciting guidance on ambiguous parameters). Enforcing typed payloads eliminates parsing ambiguity and allows automated routing intermediaries to process messages without generative model intervention.",
    "Schema registry services maintain version-controlled interface definitions across evolving enterprise swarms. When software teams update the data schema of a Quantitative Analysis Agent, the schema registry verifies backward compatibility with existing supervisor models. If a worker emits an incompatible payload format, the gateway intercepts the message and routes it to an automated translation adapter rather than propagating a corrupt payload to downstream agents.",
    "Mitigating communication overhead and token bloat is essential for economic viability. In naive multi-agent implementations, agents quote previous messages in their entirety, causing conversational context to grow exponentially with every round of dialogue. Production communication protocols employ Message Delta Compression and Pointer-Based Memory Passing: agents exchange lightweight references and cryptographic content hashes pointing to shared blackboard data stores, completely avoiding the transmission of bloated raw text payloads.",
    "Idempotency management and dead-letter routing safeguard message delivery reliability across distributed broker channels. Every inter-agent RPC call carries a unique idempotency key generated from its correlation token and payload hash. If a network blip causes duplicate message delivery, worker nodes detect the duplicate key and return cached results without re-executing expensive model inferences. Furthermore, un-routable messages or malformed payloads are automatically directed to isolated dead-letter queues for forensic audit.",
    "Asynchronous message broker architectures decouple agent execution from network transit latency. In high-throughput enterprise platforms, inter-agent messages are published to distributed message brokers such as Redis Streams, Apache Kafka, or RabbitMQ. Workers consume messages from dedicated topic partitions, processing tasks asynchronously and publishing completion events back to the broker, ensuring that transient network hiccups or individual worker crashes never corrupt the wider swarm state.",
    "Zero-copy in-memory buffers optimize high-bandwidth inter-agent data sharing across co-located GPU nodes. When an agent produces large tensor embeddings, detailed source code repositories, or high-resolution document scans, the data is placed in shared memory segments. Downstream agents access the artifacts directly through memory pointers, eliminating serialization and deserialization overhead across machine boundaries.",
    "Backpressure regulation prevents fast-producing supervisor agents from overwhelming downstream specialized workers. If a complex decomposition generates dozens of concurrent data processing tasks, the message broker buffers incoming payloads and applies concurrency throttling, ensuring that worker task queues remain within calibrated GPU memory and API rate limits.",
    "Cryptographic message provenance logging provides an unalterable audit trail of inter-agent deliberations. Every message dispatched across the swarm is stamped with an SHA-256 hash of its payload and committed to an append-only transaction ledger. In regulated banking, medical, or legal applications, compliance investigators can reconstruct the exact conversational chain of custody that led to an autonomous corporate decision.",
    "Standardized inter-agent communication protocols transform fragmented prompt loops into hardened distributed software networks. By enforcing structured schemas, asynchronous brokers, and cryptographic tracing, enterprise architectures guarantee that multi-agent swarms communicate with mathematical precision and peak operational efficiency."
]

part4_say = [
    "Real-world enterprise environments are inherently dynamic, noisy, and unpredictable. External APIs experience rate limits, retrieved documents contain conflicting facts, and specialized workers occasionally produce invalid hypotheses or get caught in self-referential reasoning loops. A multi-agent system that relies on rigid, static execution graphs will inevitably crash when faced with real-world anomalies. Production swarms demand sophisticated Dynamic Re-Planning and Conflict Resolution mechanisms.",
    "Dynamic replanning algorithms resolve worker deadlocks and conflicting intermediate hypotheses across complex multi-step enterprise workflows. When an assigned sub-task encounters an unrecoverable exception—such as an external web service returning an HTTP 503 error or a data retrieval query yielding zero matches—the supervisor intercepts the failure and dynamically restructures the active task DAG. The supervisor can re-route the task to an alternative worker, query secondary data providers, or synthesize a fallback hypothesis without failing the overall mission.",
    "Wait-for graph analysis and deadlock detection algorithms continuously monitor agent dependency chains for circular waiting conditions. In complex workflows where agents request mutual peer reviews or collaborate bidirectionally, circular dependencies can accidentally form, freezing the execution pipeline. The supervisor periodically analyzes the active wait-for graph; upon detecting a cycle, it preemptively terminates the lowest-priority dependency and enforces an authoritative arbitration judgment.",
    "Worker stall detection and automated watchdog timers prevent catastrophic system hangs. In distributed agent swarms, a worker agent might enter an infinite tool-calling loop or stall indefinitely on a hanging network socket. The supervisor maintains active heartbeat monitors and timeout thresholds for every delegated task. If a worker fails to emit a progress event within its calibrated SLA window, the watchdog trips, terminating the stalled worker instance, sequestering its state into a diagnostic log, and re-spawning the task on a healthy worker node.",
    "Conflict resolution and multi-agent arbitration become vital when specialized workers arrive at contradictory conclusions. For example, during a corporate risk assessment, the Financial Analysis Agent might project robust revenue expansion based on historical earnings, while the Market Sentiment Agent predicts an imminent downturn based on social media trend analysis. The supervisor resolves this impasse not by flipping an arbitrary coin, but by activating an Arbitration Sub-Protocol.",
    "The Arbitration Sub-Protocol convenes a structured socratic debate between the dissenting worker agents. The supervisor prompts each agent to present its primary evidence, identify underlying assumptions, and critique the opposing perspective's methodology. The supervisor—or a designated Independent Arbiter Agent—evaluates the evidential rigor of each argument, applying calibrated evidential scoring to determine the prevailing conclusion or synthesizing a balanced probabilistic assessment.",
    "Bayesian evidence updating formalizes the arbitration process into a mathematical decision framework. Rather than treating claims as binary truths, the arbiter assigns prior probabilities to competing hypotheses based on historical domain model accuracy, updating posterior probabilities as workers present empirical evidence and verified citations.",
    "Dynamic confidence calibration dynamically weights worker votes during arbitration based on historical performance records. Agents that demonstrate high factual accuracy on specific problem archetypes receive elevated influence, ensuring that consensus outcomes reflect domain expertise rather than naive democratic majorities.",
    "Self-reflection and iterative hypothesis refinement empower workers to correct their own mistakes before escalating to the supervisor. High-performing agent architectures implement dual-loop cognition: an Action Loop that executes tasks and a Reflection Loop that audits intermediate results. Before returning a deliverable, the worker compares its output against known negative constraints and historical gold-standard examples, catching logic errors and formatting anomalies locally.",
    "Dynamic budget re-allocation ensures that unexpected replanning cycles do not breach corporate operational expense limits. When a complex sub-task requires multiple replanning iterations or arbitration debates, the supervisor dynamically borrows token budget from lower-priority downstream tasks, ensuring that the total inference expenditure for the entire session remains strictly within the pre-authorized enterprise budget envelope.",
    "Dynamic re-planning and conflict resolution transform fragile multi-agent scripts into resilient, self-healing cognitive organisms. By engineering autonomous deadlock recovery, watchdog monitoring, and evidential arbitration, architectures achieve the bulletproof reliability required for mission-critical enterprise operations."
]

part5_say = [
    "Translating multi-agent choreography, supervisor coordination, and dynamic replanning into industrial production reality requires building a hardened, asynchronous Python orchestration engine. In this capstone implementation, we construct an industrial-strength Hierarchical Multi-Agent Supervisor service that orchestrates specialized research, quantitative verification, code synthesis, and compliance workers with sub-second task delegation and complete distributed telemetry.",
    "Asynchronous event loops empower production python supervisors to coordinate workers concurrently across high-throughput enterprise pipelines. Utilizing Python's native asyncio and modern async worker primitives, the supervisor dispatches parallel task packages without blocking operating system threads. By leveraging non-blocking network I/O and connection pooling, the orchestration harness sustains dozens of concurrent agent sessions across distributed GPU clusters with negligible CPU overhead.",
    "The software architecture of the Python supervisor service consists of four decoupled layers: the Mission Ingestion Gateway, the Task DAG Decomposition Engine, the Asynchronous Worker Pool, and the Telemetry & Provenance Ledger. The Mission Ingestion Gateway validates enterprise requests and instantiates an isolated Session Context carrying tenant permissions and token budget limits.",
    "The Task DAG Decomposition Engine evaluates user objectives using structured JSON output constraints, generating a typed dependency graph where each node represents an isolated work unit assigned to a specific worker archetype. The engine dynamically evaluates topological sorting orders, immediately dispatching independent root nodes to the asynchronous worker pool while queuing dependent tasks.",
    "Structured concurrency primitives using Python's asyncio TaskGroup guarantee clean lifecycle management and exception propagation. When a group of parallel workers executes concurrent research tasks, the supervisor monitors the entire task group atomically. If an unhandled exception occurs in one worker, the supervisor cancels sibling operations cleanly, cleans up network connections, and activates designated fallback handlers without leaking orphan coroutines.",
    "Specialized worker agents are implemented as stateless, isolated async worker classes equipped with dedicated system prompts, local memory buffers, and restricted tool registries. When a worker completes its sub-task, it emits a strongly-typed Pydantic result envelope that is validated by the supervisor before being written to the shared session state and propagated to dependent downstream tasks.",
    "Production ASGI deployments leverage asynchronous server fabrics such as Uvicorn worker clusters managed by Gunicorn process managers. By decoupling request ingestion from background swarm execution via asynchronous task queues, the service effortlessly sustains thousands of inbound transactions per minute while maintaining sub-fifty-millisecond response latency for interactive client status polling.",
    "Circuit breaker controllers wrap external worker API invocations to protect against cascading platform failures. If downstream foundation model providers or third-party search APIs exhibit elevated error rates or throttling, the circuit breaker trips into an OPEN state, shielding the swarm from retry storms and routing pending sub-tasks to local fallback models or cached response banks.",
    "Automated canary deployment pipelines enable seamless blue-green upgrades of supervisor prompts and worker agent definitions. DevOps engineers can deploy revised decomposition heuristics to a ten-percent canary slice of production traffic, continuously verifying DAG execution success rates and latency metrics before promoting the release fleet-wide with zero downtime.",
    "Distributed tracing via OpenTelemetry captures the complete multi-agent lifecycle across microservice boundaries. Spans track supervisor planning latency, worker execution durations, inter-agent message payload sizes, token consumption volumes, and arbitration rounds. Real-time observability dashboards display active swarm topologies, allowing DevOps engineers to pinpoint bottlenecks and optimize worker concurrency limits.",
    "Cryptographic provenance auditing seals every multi-agent interaction with immutable verification ledgers. The Python service calculates SHA-256 hashes of initial user prompts, intermediate task DAG definitions, worker message envelopes, and synthesized executive reports, storing the signed audit trail in enterprise compliance archives to fulfill regulatory accountability mandates.",
    "Mastering multi-agent choreography and hierarchical supervisor engineering establishes you as a foremost authority in enterprise artificial intelligence architecture. By harmonizing executive planning, worker role isolation, structured communication, and self-healing replanning, you possess the elite capability to design and deploy autonomous swarm intelligence platforms that transform global enterprise operations."
]

parts_data = [
    {
        "title": "Centralized Vs Decentralized Choreography: Monolithic Limits And Swarm Architecture",
        "say": part1_say,
        "example": "Supervisors route research tasks to specialized intelligence agents.",
        "tryIt": "Compare monolithic agent execution against hierarchical swarm models.",
        "check": {
            "question": "What is the primary advantage of centralized hierarchical swarms over peer-to-peer swarms?",
            "options": [
                "A dedicated supervisor prevents circular reasoning loops and enforces task budgets",
                "It eliminates the need for computer networks by using satellite radio frequencies",
                "It allows foundation models to execute without consuming electrical power",
                "It automatically converts all English text into ancient Latin prose"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Centralized supervisor architectures introduce an executive planner that prevents infinite message chatter loops, circular reasoning deadlocks, and unpredictable token expense."
        }
    },
    {
        "title": "Hierarchical Supervisor Architectures: Executive Delegation & Task DAG Decomposition",
        "say": part2_say,
        "example": "Supervisors parse financial reports by delegating sections to workers.",
        "tryIt": "Construct a supervisor prompt that partitions tasks across four roles.",
        "check": {
            "question": "Why does context isolation between specialized worker agents improve reasoning accuracy?",
            "options": [
                "It keeps worker contexts lean and focused, eliminating attention dilution and cross-task noise",
                "It permanently erases the memory of the supervisor agent after every interaction",
                "It forces all external API tools to return data formatted exclusively in binary numbers",
                "It prevents the language model from learning any new programming languages"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Context isolation shields workers from extraneous peer deliberation history, keeping attention heads focused exclusively on relevant decision variables."
        }
    },
    {
        "title": "Inter-Agent Communication Protocols: Structured Schema Exchange & Message Passing",
        "say": part3_say,
        "example": "Agents exchange typed json envelopes containing claims and citations.",
        "tryIt": "Implement a pydantic communication protocol for agent collaboration.",
        "check": {
            "question": "How do pointer-based memory passing and delta compression prevent token bloat in swarms?",
            "options": [
                "Agents exchange lightweight references to shared memory rather than repeating full historical text",
                "By deleting ninety percent of all natural language words from every message payload",
                "By converting all inter-agent messages into low-resolution audio waveforms",
                "By forcing all communication to take place over physical copper telephone cables"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Pointer-based memory passing allows agents to reference shared data stores via lightweight hashes and IDs, eliminating exponential context growth."
        }
    },
    {
        "title": "Dynamic Re-Planning & Conflict Resolution: Worker Deadlocks & Socratic Arbitration",
        "say": part4_say,
        "example": "Arbitration agents reconcile contradictory market forecast projections.",
        "tryIt": "Build an automated conflict arbiter that evaluates competing claims.",
        "check": {
            "question": "How does a supervisor resolve conflicting conclusions between specialized workers?",
            "options": [
                "By convening a structured Socratic debate and evaluating evidential rigor",
                "By terminating all worker agents and restarting the entire computer operating system",
                "By randomly choosing the conclusion generated by the newest model checkpoint",
                "By asking external internet search users to vote on the preferred answer"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "The supervisor activates an arbitration sub-protocol that convenes a Socratic debate, evaluates evidential rigor, and synthesizes a calibrated assessment."
        }
    },
    {
        "title": "Enterprise Swarm Engineering: Implementing An Asynchronous Python Supervisor",
        "say": part5_say,
        "example": "Enterprise swarms orchestrate concurrent research and code synthesis.",
        "tryIt": "Deploy an asynchronous multi worker supervisor cluster in Python.",
        "check": {
            "question": "What role does OpenTelemetry distributed tracing play in production multi-agent systems?",
            "options": [
                "Tracking planning latency, worker execution times, and message volumes across agent boundaries",
                "Automatically compiling Python source code into machine assembly instructions",
                "Encrypting the computer hard drive with a twenty-four-character master password",
                "Restricting server access exclusively to authorized company board members"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "OpenTelemetry spans capture the lifecycle across supervisor planning, worker execution, message sizes, and arbitration, enabling granular production observability."
        }
    }
]

code1 = '''def test_day41_multi_agent_choreography():
    """
    Day 41: Multi-Agent Choreography & Supervisor Swarms: Centralized Orchestration vs Hierarchical Agent Swarms
    """
    return {
        "orchestrationPattern": "Hierarchical Supervisor Multi-Agent Swarm",
        "supervisorModel": "Tier 1 Executive Supervisor Controller",
        "specializedWorkers": [
            "Research & Intelligence Retrieval Agent",
            "Quantitative Analysis & Verification Agent",
            "Code Synthesis & Refactoring Agent",
            "Editorial & Governance Compliance Agent"
        ],
        "metrics": {
            "taskDelegationEfficiencyPct": 98.7,
            "interAgentCommunicationOverheadPct": 4.2,
            "parallelTaskConcurrency": 8,
            "conflictResolutionRatePct": 100.0
        },
        "status": "CHOREOGRAPHY_MESH_ACTIVE"
    }'''

output1 = '''{
  "orchestrationPattern": "Hierarchical Supervisor Multi-Agent Swarm",
  "supervisorModel": "Tier 1 Executive Supervisor Controller",
  "specializedWorkers": [
    "Research & Intelligence Retrieval Agent",
    "Quantitative Analysis & Verification Agent",
    "Code Synthesis & Refactoring Agent",
    "Editorial & Governance Compliance Agent"
  ],
  "metrics": {
    "taskDelegationEfficiencyPct": 98.7,
    "interAgentCommunicationOverheadPct": 4.2,
    "parallelTaskConcurrency": 8,
    "conflictResolutionRatePct": 100.0
  },
  "status": "CHOREOGRAPHY_MESH_ACTIVE"
}'''

# Compute total words
total_words = 0
for i, p in enumerate(parts_data):
    w_count = sum(len(s.split()) for s in p['say'])
    print(f"Part {i+1}: {w_count} words")
    assert w_count >= 600, f"Part {i+1} has {w_count} words, expected >= 600"
    total_words += w_count
print(f"Total words: {total_words}")
assert total_words >= 3100, f"Total words {total_words} < 3100"

# Attach code and output to each part
for part in parts_data:
    part["code"] = code1
    part["output"] = output1

day41_dict = {
    "id": "prompt-py-41",
    "day": 41,
    "course": "prompt-py",
    "title": "Multi-Agent Choreography & Supervisor Swarms: Centralized Orchestration vs Hierarchical Agent Swarms",
    "minutes": 38,
    "parts": parts_data,
    "projectStep": {
        "title": "Engineer Hierarchical Multi-Agent Supervisor Swarm",
        "steps": [
            "Construct an executive supervisor controller that ingests complex missions and generates structured task DAGs.",
            "Deploy specialized worker agents with domain-isolated prompts, restricted tools, and context firewalls.",
            "Implement standardized Pydantic communication envelopes with delta compression and pointer-based memory passing.",
            "Build automated watchdog stall monitors, deadlock recovery handlers, and Socratic conflict arbitration protocols.",
            "Deploy the asynchronous Python orchestration engine with OpenTelemetry tracing and cryptographic provenance logging."
        ]
    },
    "summary": [
        "Hierarchical supervisor swarms overcome monolithic agent fatigue by delegating tasks across specialized worker fleets.",
        "Executive supervisor controllers decompose complex missions into structured DAGs and enforce input-output contracts.",
        "Standardized message passing protocols and pointer-based memory eliminate inter-agent communication bloat and latency.",
        "Dynamic replanning and Socratic arbitration resolve worker deadlocks, stalls, and contradictory findings reliably.",
        "Asynchronous Python orchestration engines provide non-blocking event loops, OpenTelemetry tracing, and audit provenance."
    ]
}

captions_data = [
    {
        "say1": "Multi agent swarms transcend single model context and reasoning limits.",
        "say2": "Centralized supervisor coordination establishes explicit task boundaries.",
        "example": "Supervisors route research tasks to specialized intelligence agents.",
        "tryIt": "Compare monolithic agent execution against hierarchical swarm models."
    },
    {
        "say1": "Hierarchical supervisors decompose complex missions into structured graphs.",
        "say2": "Executive supervisor controllers decompose incoming enterprise objectives.",
        "example": "Supervisors parse financial reports by delegating sections to workers.",
        "tryIt": "Construct a supervisor prompt that partitions tasks across four roles."
    },
    {
        "say1": "Structured communication contracts prevent inter agent message bloat.",
        "say2": "Standardized message passing protocols structure inter agent communication.",
        "example": "Agents exchange typed json envelopes containing claims and citations.",
        "tryIt": "Implement a pydantic communication protocol for agent collaboration."
    },
    {
        "say1": "Replanning protocols resolve worker bottlenecks and conflicting findings.",
        "say2": "Dynamic replanning algorithms resolve worker deadlocks and conflicts.",
        "example": "Arbitration agents reconcile contradictory market forecast projections.",
        "tryIt": "Build an automated conflict arbiter that evaluates competing claims."
    },
    {
        "say1": "Production python swarms leverage asynchronous queues for coordination.",
        "say2": "Asynchronous event loops empower production python supervisors.",
        "example": "Enterprise swarms orchestrate concurrent research and code synthesis.",
        "tryIt": "Deploy an asynchronous multi worker supervisor cluster in Python."
    }
]

titles = [
    "Centralized Versus Decentralized Multi Agent Choreography Dynamics.",
    "Executive Supervisor Planning And Structured Task Directed Acyclic Graphs.",
    "Inter Agent Communication Protocols And Structured Message Schema Exchange.",
    "Dynamic Replanning Algorithms And Socratic Multi Agent Conflict Resolution.",
    "Enterprise Swarm Engineering In High Concurrency Asynchronous Python."
]

columns_list = [
    ["Coordination Architecture", "Structural Organization", "Scalability Boundary"],
    ["Supervisor Responsibility", "Task Allocation Strategy", "Operational Governance SLA"],
    ["Communication Standard", "Envelope Format Specification", "Bandwidth Overhead Profile"],
    ["Conflict Resolution Mechanism", "Arbitration Algorithm", "Convergence Guarantee"],
    ["Production Platform Component", "Async Implementation", "Throughput And Latency SLA"]
]

steps_rows = [
    [
        [["Monolithic Agent System", "Single Context Loop For All Operations", "Severe Cognitive Fatigue And High Latency"], ["Hierarchical Supervisor Swarm", "Executive Orchestrator Over Specialized Workers", "Near Linear Multi Task Throughput Scaling"]],
        [["Decentralized Mesh Model", "Unstructured Peer To Peer Message Flooding", "High Risk Of Circular Reasoning Deadlocks"], ["Centralized Supervisor Pattern", "Deterministic Directed Acyclic Graph Execution", "Guaranteed Task Progress And Budget Caps"]],
        [["Domain Context Firewall", "Strictly Isolated Per Worker Context Buffers", "Zero Cross Directive Attention Dilution"], ["Heterogeneous Model Serving", "Flagship Executive Model With Lightweight Workers", "Seventy Percent Operational Token Cost Savings"]],
        [["Dynamic Task DAG Engine", "Topological Sorting Of Multi Worker Sub Tasks", "Optimal Concurrent Cloud Worker Dispatch"], ["Executive Synthesis Hub", "Reconciles Intermediate Deliverables Into Briefings", "Delivers Polished Board Ready Enterprise Assets"]]
    ],
    [
        [["Mission Decomposition Layer", "Converts Ambiguous Prompts Into Concrete Steps", "Eliminates Hallucinated Out Of Scope Tasks"], ["Input Output Contract Enforcer", "Enforces Rigid Pydantic Schemas On Worker IO", "Guarantees Syntactic Downstream Integration"]],
        [["Adaptive Worker Provisioner", "Scales Agent Fleets Dynamically By Mission Depth", "Allocates Compute Proportional To Complexity"], ["Automated Acceptance Gate", "Audits Worker Deliverables Prior To Downstream Use", "Rejects Sub Standard Work With Targeted Critique"]],
        [["Information Firewall Broker", "Filters Cross Agent Communication History", "Prevents Context Pollution Across Workers"], ["Recursive Decomposition Loop", "Partitions Massive Tasks Into Atomic Units", "Accelerates Parallel Multi Worker Execution"]],
        [["Strategic Execution Monitor", "Tracks Milestone Progress Across Active Graphs", "Enforces Global Session Latency Envelopes"], ["Autonomous Project Director", "Synthesizes Multi Domain Intermediate Findings", "Drives Mission Critical Objectives To Completion"]]
    ],
    [
        [["Typed Communication Envelope", "Enforces Immutable Headers And Structured Body", "Eliminates Natural Language Parsing Ambiguities"], ["Delta Message Compression", "Transmits Only State Changes Between Agent Turns", "Slashes Network Bandwidth Consumption"]],
        [["Pointer Based Memory Hub", "Passes Content Hashes Pointing To Shared Stores", "Prevents Exponential Context Growth In Swarms"], ["Asynchronous Broker Backbone", "Publishes Events To Redis Streams Or Apache Kafka", "Decouples Worker Processing From Network Transit"]],
        [["Backpressure Flow Regulator", "Buffers Spikes And Throttles Concurrent Tasks", "Shields Backend Microservices From Thundering Herds"], ["Cryptographic Message Ledger", "Logs SHA Two Fifty Six Hashes Of Every Payload", "Provides Immutable Regulatory Compliance Audit Trails"]],
        [["Correlation Trace Injector", "Propagates Distributed Session Tokens Across Workers", "Enables Seamless End To End Distributed Tracing"], ["Standardized Protocol Buffer", "Serializes Agent Payloads Into Compact Binary", "Delivers Ultra Low Latency Machine Communication"]]
    ],
    [
        [["Dynamic DAG Restructurer", "Re Routes Failed Sub Tasks To Secondary Workers", "Recovers Transparently From Transient Outages"], ["Heartbeat Stall Watchdog", "Monitors Progress Events Against Calibrated SLAs", "Terminates And Re Spawns Stalled Workers"]],
        [["Socratic Deliberation Quorum", "Convenes Structured Debate Between Dissenting Agents", "Reconciles Contradictory Domain Hypotheses"], ["Consensus Synthesis Arbiter", "Evaluates Evidential Rigor Across Claims", "Produces Unified Analytical Findings"]],
        [["Dual Loop Cognitive Engine", "Executes Tasks Followed By Internal Audit Passes", "Catches Logic Errors Prior To Supervisor Escalation"], ["Dynamic Budget Reallocator", "Borrows Token Quota From Lower Priority Operations", "Maintains Global Session Cost Within Caps"]],
        [["Evidential Rigor Evaluator", "Scores Quality And Validity Of Competing Claims", "Synthesizes Calibrated Probabilistic Judgments"], ["Self Healing Fault Sandboxes", "Isolates Broken Tool Invocations In Safe Enclaves", "Prevents System Wide Cascading Platform Crashes"]]
    ],
    [
        [["AsyncIO Supervisor Controller", "Coordinates Parallel Workers Via Non Blocking Loops", "Sustains High Concurrency Across Clusters"], ["Mission Ingestion Gateway", "Validates Enterprise Requests And Session Context", "Enforces Tenant Security And Quotas"]],
        [["Topological Dispatch Router", "Immediately Dispatches Independent Graph Roots", "Minimizes Idle Execution Waiting Time"], ["Non Blocking Event Pipeline", "Streams Intermediate Task Outputs Asynchronously", "Eliminates Thread Blocking Delays"]],
        [["Stateless Worker Microservices", "Isolates Worker Agents In Standalone Containers", "Enables Elastic Horizontal Cloud Auto Scaling"], ["OpenTelemetry Trace Hub", "Emits Spans Across Planning, Work, And Synthesis", "Delivers Comprehensive Operational Visibility"]],
        [["Cryptographic Provenance Vault", "Signs Final Briefings With SHA Two Fifty Six Seal", "Satisfies Demanding Regulatory Audit Mandates"], ["Enterprise Swarm Mesh Core", "Integrates Planning, Communication, And Execution", "Delivers Industrial Autonomous Intelligence Scalability"]]
    ]
]

# Verify lengths and digits
for p_idx, cap_dict in enumerate(captions_data):
    for k, text_str in cap_dict.items():
        assert len(text_str) <= 75, f"Part {p_idx+1} {k} caption too long: {len(text_str)} ({text_str})"
        assert text_str.endswith('.'), f"Part {p_idx+1} {k} caption must end with dot: {text_str}"
        assert not any(c.isdigit() for c in text_str), f"Part {p_idx+1} {k} caption has digits: {text_str}"

for t in titles:
    assert len(t) <= 75, f"Title too long: {len(t)} ({t})"
    assert t.endswith('.'), f"Title must end with dot: {t}"
    assert not any(c.isdigit() for c in t), f"Title has digits: {t}"

for cols in columns_list:
    for c in cols:
        assert not any(ch.isdigit() for ch in c), f"Column has digits: {c}"

for p_i, step_row in enumerate(steps_rows):
    assert len(step_row) == 4, f"Part {p_i+1} must have 4 step rows, found {len(step_row)}"
    for s_i, row in enumerate(step_row):
        assert len(row) == 2, f"Part {p_i+1} Step {s_i+1} must have 2 rows, found {len(row)}"
        for pair in row:
            for cell in pair:
                assert not any(ch.isdigit() for ch in cell), f"Cell has digits: {cell}"

entries = []
for p_idx, part in enumerate(parts_data):
    spec_steps = []
    for s_idx, at_k in enumerate(["say1", "say2", "example", "tryIt"]):
        cap = captions_data[p_idx][at_k]
        spec_steps.append({
            "at": at_k,
            "caption": cap,
            "rows": steps_rows[p_idx][s_idx]
        })
        
    spec = {
        "template": "table",
        "title": titles[p_idx],
        "columns": columns_list[p_idx],
        "steps": spec_steps
    }
    assert len(spec['title']) <= 75, f"Title too long: {spec['title']}"
    assert spec['title'].endswith('.'), f"Title must end with dot: {spec['title']}"
    assert not any(c.isdigit() for c in spec['title']), f"Title has digits: {spec['title']}"
    
    code_hash = hashlib.sha256(part['code'].encode('utf-8')).hexdigest()
    entry = {
        "partTitle": part['title'],
        "codeHash": code_hash,
        "spec": spec,
        "filled": spec
    }
    entries.append(entry)

visual_envelope = {
    "schemaVersion": "2.0.0",
    "course": "prompt-py",
    "day": 41,
    "prefix": "prompt-py",
    "entries": entries
}

# Write lesson JSON
with open('C:/Users/Admin/Desktop/projects/Present-Career-os-platform/scripts/branch_c/prompt_day41_lesson.json', 'w', encoding='utf-8') as f:
    json.dump(day41_dict, f, indent=2)

# Write visual envelope
with open('C:/Users/Admin/Desktop/projects/Present-Career-os-platform/src/lib/data/lessonVisuals/prompt-py/day-41.json', 'w', encoding='utf-8') as f:
    json.dump(visual_envelope, f, indent=2)

print(f"Generated Day 41 lesson JSON ({total_words} words) and Visual Envelope successfully!")
