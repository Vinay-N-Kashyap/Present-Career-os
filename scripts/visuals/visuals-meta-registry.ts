// Shared Visuals Metadata & Course Visuals Registry for PinIT Career OS

export interface ClusterDef {
  clusterNum: number;
  title: string;
  tag: string;
  color: string;
  courseIds: string[];
}

export interface AuditRecord {
  num: number;
  id: string;
  title: string;
  prefix: string;
  curriculumType: string;
  hasVisuals: boolean;
  visualPrefix: string;
  visualCount: number;
  avgSpokenMin: number;
  avgActivityMin: number;
  avgTotalMin: number;
  inSweetSpot: boolean;
  status: string;
}

export const CLUSTERS: ClusterDef[] = [
  {
    clusterNum: 1,
    title: 'Core Software Engineering, Web & Cloud Systems',
    tag: 'CLUSTER-1: SE-WEB-CLOUD',
    color: '#2563eb', // Blue
    courseIds: [
      'course-java-logic',
      'course-react-web',
      'course-node-web',
      'course-cloud-native',
      'course-devops-cicd',
      'course-design-systems'
    ]
  },
  {
    clusterNum: 2,
    title: 'Systems, Mobile, Security, DB & Distributed Systems',
    tag: 'CLUSTER-2: SYS-SEC-DATA',
    color: '#7c3aed', // Purple
    courseIds: [
      'course-dsa-optim',
      'course-mobile-dev',
      'course-cybersecurity',
      'course-database-eng',
      'course-distributed-sys',
      'course-ai-eng',
      'course-fullstack-js'
    ]
  },
  {
    clusterNum: 3,
    title: 'Embedded Hardware, 3D, Web3 & High-Frequency Systems',
    tag: 'CLUSTER-3: EMBEDDED-QUANT',
    color: '#059669', // Emerald
    courseIds: [
      'course-iot-embedded',
      'course-3d-graphics',
      'course-blockchain-web3',
      'course-iot-network',
      'course-iot-edge-ai',
      'course-iot-security',
      'course-python-backend',
      'course-quant-systems'
    ]
  },
  {
    clusterNum: 4,
    title: 'Digital Accounting, Corporate Finance & Business Analytics',
    tag: 'CLUSTER-4: FIN-ACCT-BIZ',
    color: '#d97706', // Amber
    courseIds: [
      'course-digital-accounting',
      'course-finance-investment',
      'course-business-analytics',
      'course-marketing-branding',
      'course-digital-marketing'
    ]
  },
  {
    clusterNum: 5,
    title: 'Digital Commerce, Operations, Sales & AI Transformation',
    tag: 'CLUSTER-5: ECOM-OPS-AI',
    color: '#dc2626', // Red
    courseIds: [
      'course-ecommerce-digital-biz',
      'course-entrepreneurship-biz-mgmt',
      'course-sales-crm-success',
      'course-operations-supplychain-compliance',
      'course-ai-digital-transformation'
    ]
  },
  {
    clusterNum: 6,
    title: 'Universal Digital Foundations, Tools & Cognitive Communication',
    tag: 'CLUSTER-6: FOUNDATIONS',
    color: '#0891b2', // Cyan
    courseIds: [
      'course-computer-fundamentals',
      'course-ai-prompt-literacy',
      'course-excel-data-viz',
      'course-git-version-control',
      'course-softskills-communication',
      'course-nlp'
    ]
  }
];

export const TEMPLATES_INFO: Record<string, { label: string; desc: string; domain: string }> = {
  flow: { label: 'Multi-Stage Flow', desc: 'Linear and branching pipelines with stage status highlights', domain: 'Universal' },
  boxes: { label: 'Memory & State Boxes', desc: 'Slots holding named variables, props, register values, or configs', domain: 'Systems / Web' },
  table: { label: 'Relational & Ledger Table', desc: 'Columns and rows with row-by-row or cell-by-cell step illumination', domain: 'Data / Fin / API' },
  letters: { label: 'Character Array', desc: 'Character cells with moving pointers for strings, tokens, and regex', domain: 'CompSci / NLP' },
  compare: { label: 'Comparative Panels', desc: 'Side-by-side comparison with pass/fail indicators and pros/cons', domain: 'Universal' },
  cells: { label: '1D Memory Array Buffer', desc: 'Indexed array blocks with up to 3 named moving pointers', domain: 'DSA / Hardware' },
  'stack-queue': { label: 'LIFO Stack / FIFO Queue', desc: 'Vertical stack frames or horizontal queue with push/pop animations', domain: 'Systems / Trading' },
  'tree-graph': { label: 'Hierarchical Tree / Graph', desc: 'Up to 6 nodes with directional edges and traversal highlighting', domain: 'DSA / Web / 3D' },
  bars: { label: 'Quantitative Metrics Bars', desc: 'Labeled numeric bars comparing latency, ratios, or benchmarks', domain: 'Analytics / SRE' },
  sequence: { label: 'Chronological Sequence', desc: 'Lifeline columns with directional request/response message arrows', domain: 'Network / Auth' },
  states: { label: 'Finite State Machine', desc: 'State bubbles with transitions and active state illumination', domain: 'Protocols / Async' },
  workflow: { label: 'Multi-Tier Topology', desc: 'System architecture topology connecting client, proxy, pods, DB', domain: 'Cloud / DevOps' },
  'component-tree': { label: 'UI Component Hierarchy', desc: 'Component tree displaying props cascading down and events bubbling up', domain: 'Frontend / Mobile' },
  wireframe: { label: 'Box-Model Wireframe', desc: 'Nested UI boxes visualizing layout engines, margin, border, padding', domain: 'Frontend / Design' },
  'register-bits': { label: 'Bitwise Register Simulator', desc: '8/16/32-bit register cells visualizing bitmasks, set/clear operations', domain: 'Embedded / IoT' },
  'ledger-sheet': { label: 'Double-Entry T-Account', desc: 'T-Account debit/credit columns maintaining balancing invariants', domain: 'Commerce / Acct' },
  funnel: { label: 'Conversion Funnel', desc: 'Multi-stage conversion stages showing drop-off percentages and cohorts', domain: 'Marketing / Sales' }
};

export interface CourseMetadata {
  prefix: string;
  theme: string;
  pedagogy: string;
  allowedTemplates: string[];
  blockFocus: [string, string, string, string, string, string];
  milestoneProject: string;
}

export const COURSE_METAS: Record<string, CourseMetadata> = {
  'course-java-logic': {
    prefix: 'java-basics',
    theme: 'JVM Architecture, Primitive Typing, OOP Invariants & Enterprise Modularity',
    pedagogy: 'Illustrate JVM Stack frame pushes/pops, heap reference allocations, and variable mutations during loops. Visuals clarify value vs reference semantics.',
    allowedTemplates: ['boxes', 'flow', 'table', 'cells', 'stack-queue', 'compare'],
    blockFocus: [
      'JVM Bytecode execution, Primitive boxing & System.out printing flow',
      'Conditional branching, Relational operators & Boolean logic tables',
      'While/Do-While loops, Iterative counters & Array indexing cells',
      'For loops, Nested iteration patterns & Matrix coordinate grids',
      'Method call frames, Parameter pass-by-value & Return value routing',
      'OOP Class blueprints, Encapsulation & Milestone Financial Engine'
    ],
    milestoneProject: 'Milestone Financial Utility Engine: A multi-module Java application modeling bank accounts, compound interest calculators, and transactional debit/credit validation.'
  },
  'course-react-web': {
    prefix: 'react-basics',
    theme: 'Fiber Reconciliation, Hook Closures, Virtual DOM Diffing & Component Trees',
    pedagogy: 'Show component trees with props cascading downwards and callback events bubbling up. Highlight component re-renders triggered by state setter dispatches.',
    allowedTemplates: ['component-tree', 'wireframe', 'flow', 'boxes', 'compare', 'states'],
    blockFocus: [
      'Declarative JSX parsing, Component composition & Virtual DOM tree',
      'useState hook closures, Immutable state updates & Re-render triggers',
      'Props contract interfaces, Prop drilling vs Context & Children nodes',
      'useEffect dependency arrays, Async fetch cycles & Cleanup timers',
      'Controlled forms, Validation state machines & UI layout wireframes',
      'Next.js App Router hybrid rendering, Server vs Client components'
    ],
    milestoneProject: 'Production Enterprise SaaS Portal: High-performance Next.js application with dynamic dashboard routing, dark/light theme tokens, and live analytics telemetry.'
  },
  'course-node-web': {
    prefix: 'node-web',
    theme: 'Asynchronous Event Loop, Middleware Pipelines & Relational Microservices',
    pedagogy: 'Map incoming HTTP request flows through Express middleware waterfalls. Show database connection pool acquisitions and async non-blocking I/O queues.',
    allowedTemplates: ['sequence', 'stack-queue', 'flow', 'boxes', 'table', 'states'],
    blockFocus: [
      'V8 Engine Call Stack, libuv Event Loop & Microtask/Macrotask queues',
      'TypeScript strict typing, Interface schemas & Compile-time validation',
      'HTTP Request-Response lifecycles, RESTful routes & Express middleware',
      'Relational PostgreSQL queries, Connection pooling & ACID transactions',
      'JWT HMAC-SHA256 authentication, Bcrypt password hashing & Auth guards',
      'Containerized production Docker build & Health-check endpoint telemetry'
    ],
    milestoneProject: 'High-Concurrency REST Microservice: Authenticated backend API with role-based access control, connection-pooled PostgreSQL persistence, and Docker multi-stage deployment.'
  },
  'course-cloud-native': {
    prefix: 'cloud',
    theme: 'AWS VPC Topologies, Serverless Lifecycles & Highly Available Cloud Systems',
    pedagogy: 'Visualize cloud architecture topologies: VPC subnets, Internet Gateways, Application Load Balancers, and ECS tasks. Clarify IAM role evaluation logic.',
    allowedTemplates: ['workflow', 'sequence', 'states', 'table', 'bars', 'compare'],
    blockFocus: [
      'AWS Global Cloud Infrastructure, Regions, Availability Zones & IAM Policies',
      'VPC CIDR subnets, Public vs Private routing & Security Group firewalls',
      'Compute scaling: EC2 instances, Application Load Balancers & Auto Scaling',
      'Serverless computing: AWS Lambda triggers, API Gateway & DynamoDB NoSQL',
      'Container orchestration: ECR image registries & ECS/Fargate task definitions',
      'Multi-AZ High Availability, Route53 DNS failover & Terraform IaC blueprints'
    ],
    milestoneProject: 'Multi-AZ Serverless Cloud Infrastructure: Terraform-provisioned VPC architecture with ALB traffic distribution, ECS Fargate microservices, and automated health checks.'
  },
  'course-devops-cicd': {
    prefix: 'devops',
    theme: 'Immutable Containerization, Automated CI/CD Pipelines & Kubernetes Orchestration',
    pedagogy: 'Diagram Docker layer caching trees, GitHub Actions stage execution waterfalls, and Kubernetes ReplicaSet pod reconciliation loops.',
    allowedTemplates: ['flow', 'workflow', 'states', 'sequence', 'compare'],
    blockFocus: [
      'POSIX Linux administration, Shell piping & Systemd daemon services',
      'Git trunk-based branching, Semantic versioning & GitOps workflows',
      'Docker engine internals, Multi-stage image builds & Layer caching DAGs',
      'GitHub Actions runners, Lint-Test-Build matrix workflows & Secret vaults',
      'Kubernetes cluster architecture: Control plane, Pods, Services & Ingress',
      'Zero-downtime Blue/Green deployments, Canary rollouts & Prometheus alerts'
    ],
    milestoneProject: 'Enterprise Automated GitOps Pipeline: Multi-stage Docker containerization pipeline with automated GitHub Actions testing, security vulnerability scanning, and Kubernetes deployment.'
  },
  'course-design-systems': {
    prefix: 'design',
    theme: 'Atomic Component Architectures, Design Tokens & Accessible Web Layouts',
    pedagogy: 'Draw CSS box-model margins/borders/padding, Flexbox/Grid spatial coordinates, and accessibility contrast verification ratios across light and dark modes.',
    allowedTemplates: ['wireframe', 'component-tree', 'compare', 'boxes', 'bars'],
    blockFocus: [
      'Visual hierarchy principles, Modular typography scales & 8pt grid geometry',
      'Color space tokens, HSL palette generation & WCAG AAA contrast ratios',
      'Atomic Design methodology: Atoms, Molecules, Organisms & Templates',
      'CSS Layout mechanics: Flexbox axes, CSS Grid fr tracks & Responsive breakpoints',
      'Interactive component state machines: Hover, Focus-visible, Active & Disabled',
      'Design Token architecture: Style Dictionary, JSON token exports & Figma sync'
    ],
    milestoneProject: 'Production Design System Library: Documented, accessible UI component kit featuring tokens, atomic components, and responsive mobile-to-desktop wireframe layouts.'
  },
  'course-dsa-optim': {
    prefix: 'dsa-optim',
    theme: 'Asymptotic Complexity, Memory Buffers, Tree Traversal & Dynamic Programming',
    pedagogy: 'Show memory array buffers with dual pointers shifting, recursion stack frame winding/unwinding, and 2D memoization grids populating optimal substructure solutions.',
    allowedTemplates: ['cells', 'stack-queue', 'tree-graph', 'table', 'bars', 'compare'],
    blockFocus: [
      'Big-O Asymptotic Space-Time analysis, Linear arrays & In-place operations',
      'Two-pointer convergence, Sliding window bounds & Prefix sum caching',
      'Linked memory lists, LIFO Call Stacks & FIFO Circular Queue buffers',
      'Hierarchical Trees, Binary Search Tree balancing & Binary Heap priorities',
      'Graph topologies, Adjacency lists, BFS/DFS traversal & Dijkstra shortest paths',
      'Dynamic Programming: Memoization tables, Tabulation & Knapsack optimization'
    ],
    milestoneProject: 'High-Performance Algorithmic Optimization Suite: Benchmark-validated implementations of cache-conscious searching, graph pathfinding, and dynamic programming schedulers.'
  },
  'course-mobile-dev': {
    prefix: 'mobile',
    theme: 'Cross-Platform React Native, JSI Runtime, Native Modules & Offline SQLite',
    pedagogy: 'Illustrate JavaScript-to-Native bridge execution, Yoga Flexbox layout reflows, and touch gesture responder state transitions.',
    allowedTemplates: ['wireframe', 'component-tree', 'flow', 'sequence', 'states'],
    blockFocus: [
      'React Native architecture: JavaScript thread, JSI, Shadow Tree & Native UI',
      'Core UI primitives: View, Text, FlatList virtualization & Yoga flex layouts',
      'Navigation architectures: Native Stack, Bottom Tabs & Deep-link URI routing',
      'Offline state persistence: MMKV fast key-value & SQLite local transactions',
      'Native hardware bridges: Camera capture, GPS Geolocation & Biometric auth',
      'Performance profiling: Hermes bytecode compilation & Release bundle packaging'
    ],
    milestoneProject: 'Cross-Platform Mobile Utility App: Feature-complete React Native application featuring virtualized infinite feeds, offline SQLite synchronization, and biometric authentication.'
  },
  'course-cybersecurity': {
    prefix: 'cyber',
    theme: 'Cryptographic Protocols, OWASP Top 10 Mitigation & Zero-Trust Defense',
    pedagogy: 'Diagram packet inspection sequences, TLS 1.3 cryptographic key exchanges, JWT tampering detection, and SQL injection sanitization barriers.',
    allowedTemplates: ['flow', 'sequence', 'table', 'compare', 'states'],
    blockFocus: [
      'Threat modeling methodologies, Attack vectors & OWASP Top 10 vulnerabilities',
      'Authentication architecture: Multi-factor auth, Salted Bcrypt & Session stores',
      'Cryptographic systems: Symmetric AES-GCM, Asymmetric RSA & ECC key pairs',
      'Web application hardening: CSP headers, CORS policies & CSRF token validation',
      'Network defense: TLS 1.3 handshake, WAF firewall rules & DDoS rate limiters',
      'Security incident response: Penetration testing workflows & SIEM audit logs'
    ],
    milestoneProject: 'Zero-Trust Secure Authentication Gateway: End-to-end hardened authentication microservice with Argon2id password hashing, rotating JWT signing keys, and brute-force rate limiting.'
  },
  'course-database-eng': {
    prefix: 'sql-mastery',
    theme: 'Relational Theory, B+ Tree Indexes, Transaction Isolation & WAL Logging',
    pedagogy: 'Illustrate B+ Tree node splits, Write-Ahead Log (WAL) sequential flushes, and query execution plans comparing sequential table scans with index lookups.',
    allowedTemplates: ['table', 'tree-graph', 'flow', 'compare', 'bars'],
    blockFocus: [
      'Relational algebra, Entity-Relationship schemas & Normalization (1NF–BCNF)',
      'SQL Query execution engine: Parsing, Query planning & AST optimization',
      'Indexing data structures: B+ Tree page balancing, Hash indexes & Covering indexes',
      'ACID properties, MVCC concurrency control & Transaction isolation anomalies',
      'Query profiling: EXPLAIN ANALYZE interpretation & Buffer cache hit ratios',
      'Horizontal scaling: Table partitioning, Read replication & Connection pools'
    ],
    milestoneProject: 'High-Throughput Financial Ledger Database: Production-tuned PostgreSQL schema with B+ tree composite indexes, strict MVCC isolation, and sub-millisecond query execution plans.'
  },
  'course-distributed-sys': {
    prefix: 'dist',
    theme: 'Consensus Protocols, Consistent Hashing, Distributed State & Fault Tolerance',
    pedagogy: 'Show consistent hashing token rings, Raft leader election heartbeat sequences, and 2-Phase Commit prepare/commit transaction message flows.',
    allowedTemplates: ['sequence', 'workflow', 'states', 'table', 'cells', 'compare'],
    blockFocus: [
      'Fallacies of distributed computing, Network partitions & CAP/PACELC theorems',
      'RPC protocols, Protocol Buffers schema compilation & gRPC streaming channels',
      'Data partitioning: Consistent hashing rings, Virtual nodes & Key distribution',
      'Consensus algorithms: Paxos & Raft leader election, Term leases & Log commits',
      'Distributed transactions: Two-Phase Commit (2PC) & Saga compensating patterns',
      'Resilience patterns: Circuit breakers, Distributed rate limiting & Jaeger tracing'
    ],
    milestoneProject: 'Fault-Tolerant Distributed Key-Value Store: Raft-replicated cluster featuring automated leader failover, consistent hashing shard allocation, and vector clock conflict detection.'
  },
  'course-ai-eng': {
    prefix: 'ai',
    theme: 'Large Language Model Systems, Vector Similarity Search, RAG & Autonomous Agents',
    pedagogy: 'Draw token embedding coordinate spaces, RAG vector retrieval cosine similarity rankings, and agentic tool dispatching request/response loops.',
    allowedTemplates: ['flow', 'table', 'bars', 'sequence', 'compare', 'boxes'],
    blockFocus: [
      'Transformer architecture fundamentals: Tokenization, Embeddings & Self-Attention',
      'Prompt engineering patterns: Few-shot context, System framing & Chain-of-Thought',
      'Vector databases: Dense embeddings, HNSW indexing & Cosine similarity search',
      'Retrieval-Augmented Generation (RAG): Document chunking & Context injection',
      'Agentic tool calling: JSON function signatures, API dispatch & ReAct loops',
      'Evaluation & Guardrails: Hallucination detection, Token budgets & Model routing'
    ],
    milestoneProject: 'Enterprise Document Intelligence Copilot: Production RAG pipeline with semantic document chunking, hybrid vector search, citation synthesis, and guardrail verification.'
  },
  'course-fullstack-js': {
    prefix: 'fullstack-js',
    theme: 'Monolithic to Microservice JS, Next.js Server Components, ORMs & WebSockets',
    pedagogy: 'Show Next.js Server Component streaming hydration boundaries, WebSocket bidirectional frame ping-pong, and database mutation waterfalls.',
    allowedTemplates: ['flow', 'component-tree', 'sequence', 'table', 'states', 'compare'],
    blockFocus: [
      'Modern ESNext language features, Microtasks, Async/Await & Generator functions',
      'Next.js 14 App Router: Server Components, Streaming Suspense & Route Handlers',
      'Server Actions, Client component boundaries & Optimistic UI updates',
      'Type-safe ORM persistence: Prisma schemas, Relational joins & DB migrations',
      'Real-time communication: WebSocket duplex channels & Server-Sent Events (SSE)',
      'Production deployment: Edge middleware, Vercel serverless & Dockerized images'
    ],
    milestoneProject: 'Real-Time Collaborative Workspace: Full-stack application with live multi-user WebSocket editing, Prisma database synchronization, and optimistic UI transitions.'
  },
  'course-iot-embedded': {
    prefix: 'iot_emb',
    theme: 'Hardware Registers, Memory-Mapped I/O, Interrupts & FreeRTOS Schedulers',
    pedagogy: 'Diagram microcontroller memory-mapped registers, bitwise mask operations, interrupt vector dispatching, and FreeRTOS task priority preemption.',
    allowedTemplates: ['flow', 'states', 'cells', 'boxes', 'sequence', 'register-bits'],
    blockFocus: [
      'MCU architectures (ARM Cortex-M), Memory map & GPIO register addressing',
      'Bitwise register manipulation: Bitmasking, Atomic Set/Reset (BSRR) & Pull-ups',
      'Timers, PWM signal generation & Hardware Interrupt Service Routines (ISR)',
      'Analog-to-Digital Conversion (ADC): Quantization step sizing & Two-point scaling',
      'Serial protocols: UART baud rates, I2C 7-bit bus addressing & SPI clock polarity',
      'Real-Time Operating Systems: FreeRTOS preemptive scheduler, Queues & Semaphores'
    ],
    milestoneProject: 'Embedded Industrial Telemetry Controller: FreeRTOS firmware implementing multi-channel ADC sensor acquisition, lock-free ring buffers, and I2C peripheral telemetry.'
  },
  'course-3d-graphics': {
    prefix: 'g3d',
    theme: 'Vector Math, WebGL Render Pipeline, Shaders, Scene Graphs & Skeletal Rigging',
    pedagogy: 'Visualize the 3D Model-View-Projection (MVP) matrix transformation pipeline, shader rasterization stages, and hierarchical skeletal bone transforms.',
    allowedTemplates: ['tree-graph', 'boxes', 'flow', 'compare', 'bars'],
    blockFocus: [
      '3D Coordinate geometry: Cartesian vectors, Dot/Cross products & Matrix transforms',
      'WebGL rendering pipeline: Vertex Shaders, Fragment Shaders & Rasterization',
      'Three.js scene graph architecture: Object3D hierarchy, Meshes & Geometry buffers',
      'Material physics & Lighting: Ambient, Point, Directional & Physically Based Rendering',
      'Skeletal animation: Rigged bone hierarchies, Skinning weights & Keyframe tracks',
      'Rendering optimizations: Draw call batching, Frustum culling & LOD geometries'
    ],
    milestoneProject: 'Interactive 3D Avatar Animation Studio: WebGL-accelerated 3D viewport featuring custom PBR lighting shaders, skeletal bone transforms, and interactive orbital controls.'
  },
  'course-blockchain-web3': {
    prefix: 'blockchain',
    theme: 'Cryptographic Hashing, Merkle Trees, EVM Gas Mechanics & Smart Contracts',
    pedagogy: 'Show Merkle tree cryptographic proof verification, EVM memory/stack gas consumption charts, and reentrancy attack state transition barriers.',
    allowedTemplates: ['tree-graph', 'stack-queue', 'flow', 'sequence', 'compare', 'states'],
    blockFocus: [
      'Cryptographic hash functions (SHA-256, Keccak), Asymmetric signatures & P2P networks',
      'Blockchain ledger structure: Block headers, Merkle Patricia Tries & Consensus',
      'Ethereum Virtual Machine (EVM): Execution stack, Storage slots & Gas accounting',
      'Solidity contract development: Value types, Access modifiers & Event emissions',
      'Smart contract security: Checks-Effects-Interactions, Reentrancy & Integer safety',
      'Decentralized frontend: Ethers.js / Viem, Metamask wallet RPC & Token transactions'
    ],
    milestoneProject: 'Decentralized Escrow Protocol & dApp: Production Solidity smart contract with multi-signature release conditions, reentrancy guards, and reactive Web3 frontend.'
  },
  'course-iot-network': {
    prefix: 'iot_net',
    theme: 'Wireless RF Topologies, BLE GATT Profiles, LoRaWAN Chirps & MQTT Brokers',
    pedagogy: 'Map BLE GATT Service/Characteristic hierarchies, LoRaWAN chirp spread spectrum uplinks, and MQTT publish/subscribe broker message routing.',
    allowedTemplates: ['flow', 'sequence', 'states', 'table', 'compare'],
    blockFocus: [
      'Wireless RF propagation fundamentals, Frequencies (ISM bands) & Network topologies',
      'Bluetooth Low Energy (BLE): GAP advertising, GATT Services & Characteristics',
      'IEEE 802.15.4 & Zigbee Mesh: Multi-hop routing & Self-healing network trees',
      'LoRa & LoRaWAN: Chirp Spread Spectrum (CSS), Gateway uplinks & Join procedures',
      'IoT Application protocols: MQTT QoS 0/1/2 handshakes, CoAP & Lightweight M2M',
      'Ultra-low-power optimization: Deep sleep modes, Duty cycling & Energy budgets'
    ],
    milestoneProject: 'Low-Power LoRaWAN Environmental Gateway: Edge mesh network firmware routing environmental sensor telemetry through encrypted LoRaWAN packets to an MQTT cloud broker.'
  },
  'course-iot-edge-ai': {
    prefix: 'iot_edge',
    theme: 'Digital Signal Processing, Feature Extraction, INT8 Quantization & TinyML',
    pedagogy: 'Show sliding window sensor buffers, Fast Fourier Transform (FFT) spectrograms, and INT8 quantized weight matrices mapped to MCU memory arenas.',
    allowedTemplates: ['flow', 'bars', 'cells', 'table', 'compare'],
    blockFocus: [
      'Edge intelligence paradigms, Microcontroller resource budgets (SRAM/Flash)',
      'Digital Signal Processing (DSP): Discrete filtering, Windowing & Fast Fourier Transform',
      'Time-series feature extraction: Spectral power, Zero-crossing rates & Peak detection',
      'Model optimization for edge: Post-training INT8 quantization & Weight pruning',
      'TensorFlow Lite for Microcontrollers (TFLM): Memory arenas & Flatbuffer models',
      'Real-time inference pipeline: Accelerometer gesture recognition & Anomaly detection'
    ],
    milestoneProject: 'Edge TinyML Gesture Recognition Engine: Microcontroller-deployed model classifying continuous IMU sensor streams in real-time under a 32 KB SRAM memory constraint.'
  },
  'course-iot-security': {
    prefix: 'iot_sec',
    theme: 'Hardware Root of Trust, Secure Boot, Mutual TLS & Secure OTA Lifecycles',
    pedagogy: 'Diagram secure boot cryptographic signature verification chains, mTLS certificate exchanges, and dual-bank OTA firmware flash memory rollback safety.',
    allowedTemplates: ['flow', 'sequence', 'states', 'compare', 'table'],
    blockFocus: [
      'Industrial IoT threat vectors, Purdue Enterprise Reference Model & Attack surfaces',
      'Hardware Root of Trust: Secure Elements (ATECC608), TPMs & Cryptographic coprocessors',
      'Secure Boot architectures: Cryptographic hash validation & Anti-rollback eFuses',
      'Identity & Transport security: X.509 Device certificates & Mutual TLS (mTLS)',
      'Secure Over-The-Air (OTA) updates: Dual-bank flash partitions & Rollback protection',
      'Industrial communication security: Encrypted Modbus-TCP, OPC UA & IEC 62443'
    ],
    milestoneProject: 'Hardened Industrial Edge Controller: Secure boot-verified firmware implementing mutual TLS cloud authentication and failsafe dual-bank OTA update recovery.'
  },
  'course-python-backend': {
    prefix: 'python',
    theme: 'Python Asynchronous Systems, FastAPI, Pydantic & Distributed Task Queues',
    pedagogy: 'Illustrate asyncio event loop coroutine yields, Pydantic JSON schema validations, and Celery asynchronous task distribution across Redis workers.',
    allowedTemplates: ['flow', 'sequence', 'boxes', 'table', 'states', 'compare'],
    blockFocus: [
      'Advanced Python paradigms: Context managers, Decorators & Generator iterables',
      'Asynchronous programming: asyncio event loops, Coroutine tasks & Non-blocking I/O',
      'FastAPI architecture: Path operations, Pydantic type models & Dependency Injection',
      'Database persistence: SQLAlchemy 2.0 Async Session, PostgreSQL & Alembic migrations',
      'Distributed task execution: Celery workers, Redis message brokers & Background tasks',
      'Production engineering: Docker containerization, Pytest unit tests & Rate limiters'
    ],
    milestoneProject: 'High-Performance Asynchronous FastAPI Service: Production microservice featuring async database connection pooling, background Celery processing, and OpenAPI contracts.'
  },
  'course-quant-systems': {
    prefix: 'quant-systems',
    theme: 'Limit Order Books, VWAP Slicing, Low-Latency Sockets & Microsecond Systems',
    pedagogy: 'Show Limit Order Book (LOB) bid/ask price queues, execution algorithms slicing volume over time, and kernel-bypass zero-copy socket buffer flows.',
    allowedTemplates: ['stack-queue', 'table', 'bars', 'flow', 'cells', 'compare'],
    blockFocus: [
      'Market microstructure: Limit Order Books (LOB), Depth of market & Bid-Ask spreads',
      'Financial timeseries analytics: Returns, Rolling volatility & Log price transforms',
      'Algorithmic execution strategies: VWAP, TWAP, Implementation shortfall & Slippage',
      'Low-latency system engineering: Zero-copy buffers, Cache locality & Kernel bypass',
      'Risk modeling & Portfolio metrics: Value at Risk (VaR), Sharpe Ratio & Max Drawdown',
      'High-frequency backtesting engine: Event-driven matching simulation & FIX protocol'
    ],
    milestoneProject: 'Microsecond Limit Order Book Matching Engine: High-frequency order matching engine simulating sub-millisecond price-time priority execution and real-time PnL tracking.'
  },
  'course-digital-accounting': {
    prefix: 'bcom-accounting',
    theme: 'Double-Entry Invariants, Ledger Balancing, GST Taxation & ERP Compliance',
    pedagogy: 'Draw double-entry debit/credit ledger columns maintaining balancing equality, 3-way invoice matching flows, and GST tax credit cascading waterfalls.',
    allowedTemplates: ['table', 'flow', 'compare', 'bars', 'ledger-sheet'],
    blockFocus: [
      'Accounting equation fundamentals: Assets = Liabilities + Equity & Business Entity rule',
      'Golden rules of accounting: Real, Personal & Nominal accounts & Journal posting',
      'Ledger posting: T-Accounts balancing, Closing balances & Trial Balance checksums',
      'Financial reporting: Trading Account, Profit & Loss statement & Balance Sheet layout',
      'Taxation architecture: GST Input Tax Credit cascading & TDS statutory deductions',
      'Modern ERP workflows: Automated bank reconciliations & Suspense account resolution'
    ],
    milestoneProject: 'Automated Corporate Accounting & GST Audit Engine: End-to-end digital accounting ledger with automated journal entries, balancing trial balances, and GST compliance validation.'
  },
  'course-finance-investment': {
    prefix: 'bcom-finance',
    theme: 'Time Value of Money, DCF Valuation, WACC Capital Structures & Portfolio Risk',
    pedagogy: 'Visualize Discounted Cash Flow (DCF) timelines, DuPont 3-stage ROE breakdowns, and debt vs equity cost weights in WACC capital structure models.',
    allowedTemplates: ['table', 'bars', 'flow', 'compare'],
    blockFocus: [
      'Time Value of Money (TVM): Present Value, Future Value & Compounding schedules',
      'Capital budgeting evaluation: Net Present Value (NPV), IRR & Payback period hurdles',
      'Cost of Capital: Weighted Average Cost of Capital (WACC) & Optimal Debt-Equity mix',
      'Working capital dynamics: Cash Conversion Cycle, Operating cycle & Liquidity ratios',
      'Corporate Valuation: DCF terminal values, Multiples analysis & DuPont 3-stage ROE',
      'Modern Portfolio Theory: Efficient frontier, Sharpe ratio & Beta risk sensitivity'
    ],
    milestoneProject: 'Corporate Financial Valuation & Investment Model: Comprehensive DCF valuation model with dynamic WACC sensitivity matrices, scenario planning, and working capital forecasts.'
  },
  'course-business-analytics': {
    prefix: 'bcom_ana',
    theme: 'Statistical Distributions, Pareto ABC Analysis, Regression & Executive KPIs',
    pedagogy: 'Show descriptive distribution curves, Pareto 80/20 ABC classification breakdowns, and linear regression trendlines against executive scorecard KPIs.',
    allowedTemplates: ['bars', 'table', 'flow', 'compare'],
    blockFocus: [
      'Data-driven decision framework: Descriptive statistics, Mean, Median & Standard deviation',
      'Data distributions: Normal curves, Skewness, Outlier detection & Interquartile range',
      'Business KPI architecture: Balanced scorecards, Attribution & Performance variance',
      'Predictive analytics: Simple & Multiple OLS Linear regression & Trend forecasting',
      'Classification & Segmentation: Customer RFM analysis & Logistic regression odds',
      'Executive data storytelling: Automated KPI dashboards & Decision intelligence reports'
    ],
    milestoneProject: 'Executive Business Intelligence & Decision Dashboard: End-to-end analytics report synthesizing customer segmentation, revenue regression forecasts, and automated KPI alert metrics.'
  },
  'course-marketing-branding': {
    prefix: 'bcom-marketing',
    theme: 'Strategic Frameworks, Consumer Psychology, Brand Equity & PLC Lifecycles',
    pedagogy: 'Map customer journey stages, Keller brand equity pyramid levels, BCG growth-share matrix quadrants, and omnichannel campaign ROI bar charts.',
    allowedTemplates: ['flow', 'compare', 'table', 'bars'],
    blockFocus: [
      'Strategic marketing foundations: 4Ps Marketing Mix, STP & Porter’s Five Forces',
      'Consumer psychology: Cognitive decision journey, Perception biases & Social proof',
      'Brand identity architecture: Brand personality, Archetypes & Keller’s Brand Equity',
      'Product portfolio management: Boston Consulting Group (BCG) Matrix & Product Life Cycle',
      'Integrated Marketing Communications (IMC): Omnichannel messaging & Content strategies',
      'Marketing performance measurement: Customer Lifetime Value (CLV) & Brand sentiment'
    ],
    milestoneProject: 'Comprehensive Brand Strategy & Go-To-Market Blueprint: Multi-channel brand positioning framework complete with customer persona journeys, messaging matrices, and ROI forecasts.'
  },
  'course-digital-marketing': {
    prefix: 'bcom_dmkt',
    theme: 'Acquisition Funnels, Ad Auction Rankings, SEO Architectures & CAC/LTV Unit Economics',
    pedagogy: 'Diagram conversion funnel drop-off waterfalls, ad auction rank bid vs quality score calculations, and CAC payback period bar comparisons.',
    allowedTemplates: ['flow', 'bars', 'table', 'compare', 'funnel'],
    blockFocus: [
      'Digital acquisition landscape: Inbound vs Outbound & Customer acquisition funnels',
      'Search Engine Optimization (SEO): Crawl budgets, Technical SEO, On-page & Backlinks',
      'Search Engine Marketing (SEM): Google Ads auction mechanics, Quality Score & CPC bidding',
      'Paid Social Advertising: Meta Ad pixel tracking, Lookalike audiences & ROAS targets',
      'Email marketing automation: Behavioral drip sequences, Open rate & Churn telemetry',
      'Growth analytics: Multi-touch attribution models, A/B testing & CAC-to-LTV payback'
    ],
    milestoneProject: 'Growth Marketing & Performance Campaign Architecture: Complete multi-channel digital acquisition campaign with SEO keyword architecture, ad auction bidding models, and CAC/LTV funnels.'
  },
  'course-ecommerce-digital-biz': {
    prefix: 'bcom_ecom',
    theme: 'SKU Variant Matrices, Volumetric Logistics, Checkout Gateways & Marketplace Scaling',
    pedagogy: 'Illustrate e-commerce checkout conversion funnels, payment gateway authorization handshakes, and dimensional weight shipping cost calculations.',
    allowedTemplates: ['flow', 'table', 'sequence', 'bars', 'compare', 'funnel'],
    blockFocus: [
      'E-Commerce business models: Direct-to-Consumer (D2C), B2B & Multi-vendor marketplaces',
      'Product catalog engineering: Parent-child SKU variants, Attributes & Inventory sync',
      'Checkout optimization: Cart abandonment mitigation, Payment gateways & Webhooks',
      'Supply chain fulfillment: 3PL logistics, Dimensional weight & Last-mile delivery',
      'Marketplace scaling: Amazon Buy Box algorithms, Seller metrics & Commission fees',
      'Cross-border digital commerce: Currency localization, Duties, Taxes & Compliance'
    ],
    milestoneProject: 'Scalable E-Commerce Operations Blueprint: Full operational framework for high-volume digital commerce, including SKU catalog architecture, checkout conversion funnels, and logistics routing.'
  },
  'course-entrepreneurship-biz-mgmt': {
    prefix: 'bcom_ent',
    theme: 'Business Model Canvas, TAM/SAM/SOM Sizing, Cap Table Dilution & Runway Dynamics',
    pedagogy: 'Show Business Model Canvas component linkages, bottom-up TAM/SAM/SOM concentric circles, equity dilution round-by-round cap tables, and monthly burn rate runway curves.',
    allowedTemplates: ['flow', 'table', 'compare', 'bars'],
    blockFocus: [
      'Entrepreneurial mindset, Problem-Solution fit & Lean Startup iterative hypothesis',
      'Business Model Canvas (BMC): Revenue streams, Cost structures & Value propositions',
      'Market opportunity sizing: Total Addressable Market (TAM, SAM, SOM) calculation',
      'Startup financial modeling: Unit economics, Burn rate & Cash runway forecasting',
      'Venture financing mechanics: Term sheets, Convertible notes, SAFEs & Cap table dilution',
      'Operational scaling: Hiring frameworks, Agile organizational design & Milestone gates'
    ],
    milestoneProject: 'Venture Creation & Investor-Ready Business Plan: Comprehensive startup plan featuring validated Business Model Canvas, bottom-up market sizing, unit economics, and 5-year pro forma financials.'
  },
  'course-sales-crm-success': {
    prefix: 'bcom_scrm',
    theme: 'BANT/MEDDIC Qualification, Sales Velocity, CRM Workflows & Customer Retention',
    pedagogy: 'Diagram sales velocity formula components, MEDDIC qualification scorecards, lead-to-opportunity state progression, and customer health score distributions.',
    allowedTemplates: ['flow', 'table', 'states', 'bars', 'compare', 'funnel'],
    blockFocus: [
      'Modern B2B sales methodologies: Consultative selling, Challenger sales & Inbound leads',
      'Opportunity qualification frameworks: BANT (Budget, Authority, Need, Timing) & MEDDIC',
      'Sales pipeline mechanics: Deal stages, Probability weightings & Sales Velocity formula',
      'CRM systems architecture: Lead routing workflows, Activity tracking & Pipeline automation',
      'Commercial negotiation: Objection handling frameworks, Value selling & Closing tactics',
      'Customer Success & Retention: Net Retention Rate (NRR), Churn telemetry & Health scores'
    ],
    milestoneProject: 'Enterprise B2B Sales & CRM Operational Playbook: Configured CRM pipeline architecture with automated MEDDIC qualification scoring, sales velocity tracking, and retention playbooks.'
  },
  'course-operations-supplychain-compliance': {
    prefix: 'bcom_ops',
    theme: 'SIPOC Value Stream Mapping, EOQ Inventory Models, Kraljic Matrices & Quality Control',
    pedagogy: 'Draw SIPOC value stream process flows, Economic Order Quantity (EOQ) cost trade-off curves, Kraljic matrix supplier quadrants, and Six Sigma defect distributions.',
    allowedTemplates: ['flow', 'table', 'bars', 'compare'],
    blockFocus: [
      'Operations strategy: Process architecture, Capacity planning & Bottleneck identification',
      'Value Stream Mapping: SIPOC diagrams, Lead time reduction & Waste elimination (Muda)',
      'Inventory optimization: Economic Order Quantity (EOQ), Safety stock & Reorder points',
      'Strategic procurement: Kraljic purchasing portfolio matrix & Vendor SLA evaluations',
      'Total Quality Management (TQM): Six Sigma DMAIC cycle, Statistical process control & Kaizen',
      'Business compliance: Supply chain ethics, ISO certifications & Regulatory audit governance'
    ],
    milestoneProject: 'End-to-End Supply Chain Optimization Plan: Operations master plan featuring value stream mapping, automated EOQ inventory replenishment models, and supplier quality audits.'
  },
  'course-ai-digital-transformation': {
    prefix: 'bcom_ait',
    theme: 'Enterprise AI Value Equations, Robotic Process Automation & AI Governance',
    pedagogy: 'Illustrate enterprise AI value creation frameworks, RPA bot automation process flows, AI governance risk-level classifications, and digital maturity phase roadmaps.',
    allowedTemplates: ['workflow', 'flow', 'table', 'compare', 'bars'],
    blockFocus: [
      'Digital Transformation imperatives: Legacy modernization vs Digital-first paradigms',
      'Enterprise AI Value Equation: Cost reduction, Revenue acceleration & Customer experience',
      'Robotic Process Automation (RPA): Workflow orchestration & Repetitive task bot automation',
      'Generative AI workplace deployment: Departmental copilot adoption & Prompt standards',
      'AI Governance & Ethics: Bias auditing, Privacy protection, IP safety & EU AI Act compliance',
      'Organizational Change Management: Cultural readiness, Upskilling roadmaps & ROI dashboards'
    ],
    milestoneProject: 'Enterprise AI Transformation Roadmap & Governance Charter: Multi-year digital transformation strategic roadmap with departmental RPA automation blueprints and ethical AI policies.'
  },
  'course-computer-fundamentals': {
    prefix: 'comp_fund',
    theme: 'Von Neumann Architecture, POSIX File Permissions, CLI Pipelines & TCP/IP Networking',
    pedagogy: 'Diagram Input-Process-Output CPU bus flows, Unix command pipe data streams, file system inode permission trees, and TCP/IP 4-layer packet traversals.',
    allowedTemplates: ['flow', 'boxes', 'tree-graph', 'table', 'compare'],
    blockFocus: [
      'Computer architecture: CPU registers, Arithmetic Logic Unit (ALU), RAM & Bus topology',
      'Operating Systems fundamentals: Kernel mode vs User mode, System calls & Process threads',
      'POSIX Command Line: Terminal navigation, File permissions (chmod/chown) & Pipe redirection',
      'Memory and storage hierarchy: L1/L2/L3 CPU Caches, Virtual memory paging & RAID arrays',
      'Computer networking basics: TCP/IP 4-layer model, IPv4 subnetting, DNS & Port routing',
      'Digital security & System health: Process monitoring, SSH keys & Preventive maintenance'
    ],
    milestoneProject: 'Systems Administration & Networking Verification Suite: Practical command-line and systems automation project demonstrating process monitoring, shell scripting, and network diagnostics.'
  },
  'course-ai-prompt-literacy': {
    prefix: 'ai_prompt',
    theme: 'Prompt Engineering Frameworks, Chain-of-Thought Reasoning & Fact Verification',
    pedagogy: 'Show prompt before/after optimization comparisons, Chain-of-Thought reasoning step paths, temperature sampling spaces, and fact-checking verification scorecards.',
    allowedTemplates: ['flow', 'compare', 'boxes', 'table', 'bars'],
    blockFocus: [
      'Generative AI mechanics: Probabilistic language modeling, Tokens & Prediction spaces',
      'Prompt structuring foundations: Context, Persona, Instruction & Constraint frameworks',
      'Advanced prompting techniques: Few-shot examples, Chain-of-Thought (CoT) & Decomposition',
      'Multimodal AI capabilities: Text-to-image prompting, Audio transcription & Visual analysis',
      'Workplace productivity automation: Research synthesis, Executive drafting & Data extraction',
      'Cognitive guardrails: Hallucination identification, Source grounding & Ethical evaluation'
    ],
    milestoneProject: 'Master Prompt Engineering Playbook: Production-grade collection of verified, structured prompt templates for workplace research, communication, data analysis, and validation.'
  },
  'course-excel-data-viz': {
    prefix: 'excel_viz',
    theme: '2D Coordinate Grids, Logical Evaluation, XLOOKUP Intersections & Executive Pivot Dashboards',
    pedagogy: 'Illustrate 2D grid cell referencing, XLOOKUP array search traversals, Pivot Table multidimensional aggregations, and executive waterfall chart components.',
    allowedTemplates: ['table', 'cells', 'bars', 'compare', 'flow'],
    blockFocus: [
      'Spreadsheet grid architecture: 2D coordinate referencing, Absolute ($) vs Relative locks',
      'Statistical functions: SUM, AVERAGE, COUNT, MIN/MAX & Weighted average calculations',
      'Logical evaluations: Single IF, Nested IF statements & Multi-condition AND/OR formulas',
      'Text sanitization & Date calculations: TRIM, CLEAN, TEXTJOIN, CONCAT & DATEDIF math',
      'Lookup & Reference functions: Classic VLOOKUP vs Modern XLOOKUP & 2-Way INDEX-MATCH',
      'Data visualization & Reporting: Pivot Tables, Multi-dimensional slicing & Executive charts'
    ],
    milestoneProject: 'Executive Financial & Operational Excel Model: Fully automated corporate spreadsheet workbook featuring dynamic XLOOKUP models, Pivot Table aggregations, and executive visual dashboards.'
  },
  'course-git-version-control': {
    prefix: 'git_vcs',
    theme: 'Directed Acyclic Graphs, 3-Tier Git Areas, 3-Way Merges & Collaborative PRs',
    pedagogy: 'Draw 3-tier Git architecture (Working directory -> Staging -> Repository), Directed Acyclic Graph (DAG) commit trees, and 3-way merge conflict marker resolutions.',
    allowedTemplates: ['tree-graph', 'flow', 'states', 'compare', 'boxes'],
    blockFocus: [
      'Version control architecture: Working Directory, Staging Area (Index) & Local Repository',
      'Core versioning operations: Commit SHA hashes, Atomic commits, Git log & History inspection',
      'Branching dynamics: Pointer movements, Fast-forward merges & Feature branch isolation',
      'Branch reconciliation: 3-way merge algorithms, Merge conflict resolution & Interactive rebase',
      'Remote collaboration: Git remotes, Push/Pull mechanics, Upstream tracking & Fetching',
      'GitHub team workflows: Pull requests, Code review etiquettes, Branch protection & Tags'
    ],
    milestoneProject: 'Multi-Branch Collaborative Repository Simulation: Realistic engineering project demonstrating trunk-based branching, clean rebase histories, resolved merge conflicts, and peer-reviewed PRs.'
  },
  'course-softskills-communication': {
    prefix: 'soft-skills',
    theme: 'Minto Pyramid Structured Messaging, Active Listening, STAR Method & Tech Interviews',
    pedagogy: 'Diagram Minto Pyramid top-down communication hierarchies, STAR method (Situation, Task, Action, Result) storytelling flows, and email tone before/after comparison tables.',
    allowedTemplates: ['flow', 'compare', 'table', 'states'],
    blockFocus: [
      'Foundations of technical communication: Clarity, Conciseness & The BLUF principle',
      'Structured thinking models: Minto Pyramid, MECE principle & Executive summaries',
      'Professional written correspondence: High-impact emails, Slack etiquette & Documentation',
      'Verbal presentations: Agile standup updates, Technical demos & Slide design principles',
      'Interpersonal dynamics: Active listening, Constructive feedback loops & Conflict de-escalation',
      'Interview mastery: The STAR method, Behavioral question responses & Salary negotiation'
    ],
    milestoneProject: 'Executive Career Portfolio & Interview Masterclass: Comprehensive career communication asset package featuring structured technical project demos, STAR behavioral interview decks, and executive writing samples.'
  },
  'course-nlp': {
    prefix: 'nlp',
    theme: 'Tokenization, TF-IDF Vectors, Word2Vec Semantics & Transformer Self-Attention',
    pedagogy: 'Show token sequence sliding windows, word embedding vector spaces with cosine distance, and Transformer Query-Key-Value self-attention matrix products.',
    allowedTemplates: ['letters', 'cells', 'table', 'flow', 'bars', 'tree-graph'],
    blockFocus: [
      'Text preprocessing pipelines: Unicode normalization, Tokenization, Stemming & Lemmatization',
      'Statistical representation: Bag-of-Words, N-grams & Term Frequency-Inverse Document Frequency',
      'Distributed vector embeddings: Continuous Bag of Words (CBOW), Skip-gram & Word2Vec geometry',
      'Sequence modeling: Recurrent Neural Networks (RNN), Hidden states & LSTM/GRU gating mechanisms',
      'Transformer architecture: Scaled dot-product Self-Attention, Multi-head matrices & Positional encodings',
      'Computational language applications: Named Entity Recognition (NER), Sentiment scoring & Summarization'
    ],
    milestoneProject: 'Production Natural Language Processing Engine: End-to-end computational linguistic pipeline performing text preprocessing, TF-IDF/Dense embedding extraction, and sentiment/NER classification.'
  }
};

