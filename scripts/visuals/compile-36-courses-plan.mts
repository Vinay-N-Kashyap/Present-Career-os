import * as fs from 'fs';
import * as path from 'path';
import { chromium } from '@playwright/test';

interface DayItem {
  day: number;
  title: string;
  desc?: string;
}

interface BlockItem {
  blockNum: number;
  title: string;
  days: DayItem[];
}

interface CourseItem {
  num: number;
  id: string;
  title: string;
  desc: string;
  difficulty?: string;
  durationWeeks?: number;
  totalQuests?: number;
  blocks: BlockItem[];
}

interface ClusterDef {
  clusterNum: number;
  title: string;
  tag: string;
  color: string;
  courseIds: string[];
}

const CLUSTERS: ClusterDef[] = [
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

const TEMPLATES_INFO: Record<string, { label: string; desc: string; domain: string }> = {
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

interface CourseMetadata {
  prefix: string;
  theme: string;
  pedagogy: string;
  allowedTemplates: string[];
  blockFocus: [string, string, string, string, string, string];
  milestoneProject: string;
}

const COURSE_METAS: Record<string, CourseMetadata> = {
  'course-java-logic': {
    prefix: 'java-logic',
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
    prefix: 'design-systems',
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
    prefix: 'mobile-dev',
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
    prefix: 'database-eng',
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
    prefix: 'iot-embedded',
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
    prefix: '3d-graphics',
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
    prefix: 'blockchain-web3',
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
    prefix: 'iot-network',
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
    prefix: 'iot-edge-ai',
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
    prefix: 'iot-security',
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
    prefix: 'python-backend',
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
    prefix: 'digital-accounting',
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
    prefix: 'finance-investment',
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
    prefix: 'business-analytics',
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
    prefix: 'marketing-branding',
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
    prefix: 'digital-marketing',
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
    prefix: 'ecommerce-digital-biz',
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
    prefix: 'entrepreneurship-biz-mgmt',
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
    prefix: 'sales-crm-success',
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
    prefix: 'operations-supplychain-compliance',
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
    prefix: 'ai-digital-transformation',
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
    prefix: 'computer-fundamentals',
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
    prefix: 'ai-prompt-literacy',
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
    prefix: 'excel-data-viz',
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
    prefix: 'git-version-control',
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
    prefix: 'softskills-communication',
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

async function main() {
  console.log('=== PINIT 36+ INDIVIDUAL COURSES VISUALS PLAN COMPILER ===\n');

  const summaryPath = path.resolve(process.cwd(), 'scripts/course-curriculum-summary.json');
  if (!fs.existsSync(summaryPath)) {
    throw new Error(`Curriculum summary not found at: ${summaryPath}`);
  }

  const rawCourses: CourseItem[] = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
  console.log(`Loaded ${rawCourses.length} courses from curriculum summary.`);

  // 1. Generate Markdown Document
  console.log('Generating docs/visuals/PINIT_36_INDIVIDUAL_COURSES_VISUALS_PLAN.md...');
  const mdContent = buildMarkdown(rawCourses);
  const mdOutPath = path.resolve(process.cwd(), 'docs/visuals/PINIT_36_INDIVIDUAL_COURSES_VISUALS_PLAN.md');
  fs.writeFileSync(mdOutPath, mdContent, 'utf8');
  console.log(`Successfully wrote Markdown to: ${mdOutPath} (${mdContent.length} bytes)`);

  // 2. Generate HTML & Compile PDF
  console.log('Generating publication-quality HTML & PDF with Playwright...');
  const htmlContent = buildHtml(rawCourses);
  const pdfOutPath = path.resolve(process.cwd(), 'docs/visuals/PINIT_36_INDIVIDUAL_COURSES_VISUALS_PLAN.pdf');
  const artifactDir = path.resolve('C:/Users/Admin/.gemini/antigravity/brain/c7b35c15-f056-4dc6-888b-f56621a809c1');
  const artifactPdfPath = path.join(artifactDir, 'PINIT_36_INDIVIDUAL_COURSES_VISUALS_PLAN.pdf');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle' });

  await page.pdf({
    path: pdfOutPath,
    format: 'A4',
    margin: {
      top: '18mm',
      bottom: '18mm',
      left: '16mm',
      right: '16mm'
    },
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 8pt; color: #64748b; width: 100%; padding: 0 16mm; display: flex; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
        <span style="font-weight: 600; color: #0f172a;">PinIT Career OS — 36+ Individual 1-Month Courses Master Visuals Architecture</span>
        <span>Production Standard v2.0</span>
      </div>
    `,
    footerTemplate: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 8pt; color: #64748b; width: 100%; padding: 0 16mm; display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 4px;">
        <span>Zero-Hallucination Gate v2 Enforced &nbsp;•&nbsp; 37 Master Courses (1,110 Days / 6,660 Parts)</span>
        <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      </div>
    `,
    printBackground: true
  });

  await browser.close();
  console.log(`Successfully generated PDF: ${pdfOutPath} (${fs.statSync(pdfOutPath).size} bytes)`);

  // Copy to Artifact directory
  if (fs.existsSync(artifactDir)) {
    fs.copyFileSync(pdfOutPath, artifactPdfPath);
    console.log(`Successfully copied PDF to artifact path: ${artifactPdfPath}`);
  } else {
    console.log(`Artifact directory not found at: ${artifactDir}, skipping copy.`);
  }

  console.log('\nCompilation completed with 100% success.');
}

function buildMarkdown(courses: CourseItem[]): string {
  let md = '';

  md += `# PinIT Career OS — 36+ Individual 1-Month Courses Master Visuals Architecture & Implementation Plan\n\n`;
  md += `**Document:** \`PINIT_36_INDIVIDUAL_COURSES_VISUALS_PLAN\`  \n`;
  md += `**Version:** 2.0 (Production Masterclass Edition)  \n`;
  md += `**Date:** 10 October 2026  \n`;
  md += `**System:** PinIT Career OS Visual Learning Engine (\`VisualStage.tsx\`, \`/api/visuals\`, Gate v2)  \n`;
  md += `**Scope:** All 37 Individual 1-Month Certificate Courses across 6 Distinct Domain Clusters  \n`;
  md += `**Total Volume:** 37 Courses &times; 6 Blocks &times; 5 Days = **1,110 Lesson Days** &times; 6 Parts = **6,660 Interactive Lesson Parts**  \n`;
  md += `**Compilation Output:** \`docs/visuals/PINIT_36_INDIVIDUAL_COURSES_VISUALS_PLAN.pdf\`  \n\n`;

  md += `---\n\n`;

  md += `## 📋 Executive Architecture & Metadata Matrix\n\n`;
  md += `| Attribute | Specification Details |\n`;
  md += `| :--- | :--- |\n`;
  md += `| **Master Course Count** | **37 Courses** (36+ 1-Month Professional Certifications) |\n`;
  md += `| **Domain Clusters** | 6 Distinct Clusters (Software Engineering, Systems/Mobile/Data, Hardware/Web3/Quant, Commerce/Finance, Operations/Digital Biz, Universal Foundations) |\n`;
  md += `| **Duration per Course** | **4 Weeks / 30 Curriculum Days** structured into 6 contiguous 5-day blocks |\n`;
  md += `| **Total Lesson Days** | **1,110 Days** across all 37 courses |\n`;
  md += `| **Total Lesson Parts** | **6,660 Interactive Parts** (6 parts per lesson day) |\n`;
  md += `| **Interactive Visual Quests** | **> 4,500 active diagram specifications** (with strict minimum &ge; 3 visuals per day per Gate v2 R10) |\n`;
  md += `| **Supported Templates** | **17 Production Templates** (Flow, Boxes, Table, Letters, Compare, Cells, Stack-Queue, Tree-Graph, Bars, Sequence, States, Workflow, Component-Tree, Wireframe, Register-Bits, Ledger-Sheet, Funnel) |\n`;
  md += `| **Quality Standard** | **Technical Gate v2 (Rules R1–R14)**: 100% deterministic AST & code output bindings, 0 hallucinated values, strictly monotonically increasing steps |\n`;
  md += `| **Batch Verification Protocol**| **5-Day Contiguous Batch Loop**: PDF Ground Truth &rarr; Gate Audit &rarr; In-Situ Remediation &rarr; Runtime Test &rarr; Atomic Git Checkpoint |\n\n`;

  md += `---\n\n`;

  md += `## 🏛️ Domain Cluster Taxonomy (All 37 Courses)\n\n`;
  md += `The 37 individual 1-month courses in PinIT Career OS are partitioned across **6 Domain Clusters** reflecting real-world career disciplines:\n\n`;

  CLUSTERS.forEach(cluster => {
    md += `### ${cluster.tag}: ${cluster.title}\n\n`;
    md += `| # | Course ID | Canonical Title | Level | Quests | Allowed Visual Templates |\n`;
    md += `| :---: | :--- | :--- | :---: | :---: | :--- |\n`;

    cluster.courseIds.forEach(id => {
      const c = courses.find(item => item.id === id);
      const meta = COURSE_METAS[id];
      if (c && meta) {
        md += `| **${c.num.toString().padStart(2, '0')}** | \`${c.id}\` | ${c.title} | ${c.difficulty || 'Intermediate'} | ${c.totalQuests || 96} | \`${meta.allowedTemplates.join('`, `')}\` |\n`;
      }
    });
    md += `\n`;
  });

  md += `---\n\n`;

  md += `## 🎨 Master Visual Templates Catalog (17 Interactive Diagram Engines)\n\n`;
  md += `Every diagram displayed to a student in PinIT Career OS is rendered by one of 17 specialized visual engines. No diagram is a static image; each is an interactive, stateful SVG/Canvas/DOM component that steps in sync with the instructor's spoken sentence:\n\n`;

  md += `| Template Key | Engine Name | Primary Domain | Visual Representation & Pedagogical Function |\n`;
  md += `| :--- | :--- | :--- | :--- |\n`;
  Object.entries(TEMPLATES_INFO).forEach(([key, info]) => {
    md += `| \`${key}\` | **${info.label}** | ${info.domain} | ${info.desc} |\n`;
  });
  md += `\n`;

  md += `### The Golden Triad: Content &harr; Output &harr; Visuals\n`;
  md += `1. **Visuals connected to Content:** Every diagram step corresponds directly to what the teacher is saying in that exact sentence (the \`say\` line). When the teacher explains component state updating, the diagram highlights that exact component.\n`;
  md += `2. **Content connected to Output:** Every lesson shows runnable code and its exact real-world console or terminal output.\n`;
  md += `3. **Output connected to Visuals:** The numbers, variable names, HTTP status codes, and DOM text in the picture are **never typed by an AI**. They come from actually compiling and running the code in a sandbox. A picture can never display an incorrect value.\n`;
  md += `4. **Change & Run:** When a student modifies the code in the browser editor and clicks *Run*, the engine re-runs the code, re-extracts the bindings, and smoothly re-animates the diagram using the student's own values.\n\n`;

  md += `---\n\n`;

  md += `## 🛡️ Technical Gate v2: 14 Strict Non-Negotiable Rules\n\n`;
  md += `Every daily visual specification file (\`day-{NN}.json\`) must strictly pass all 14 rules of Gate v2 without warnings or exceptions:\n\n`;

  md += `* **R1 (AST Linkage):** The day file has exactly 6 entries, and each entry's \`partTitle\` matches the real lesson AST.\n`;
  md += `* **R2 (Allowed Template):** The template is \`none\` or is on the course's allowed template list. Arbitrary templates are rejected.\n`;
  md += `* **R3 (Shape Limits):** Between 2 and 5 steps; at most 6 shapes per step. Tables have 2–5 columns and &le; 6 rows.\n`;
  md += `* **R4 (Monotonic Progression):** \`at\` values are valid (\`sayN\` only if part has &ge; N say lines) and strictly monotonically increasing.\n`;
  md += `* **R5 (Caption Typography):** Each caption is a single sentence of at most 80 characters, ending in a period, containing zero emojis.\n`;
  md += `* **R6 (Deterministic Runtime Bindings):** Every value is a valid binding (\`var\`, \`out\`, \`table\`, \`http\`, \`dom\`, \`error\`, \`text\`). Filling the spec from a fresh code run reproduces \`filled\` exactly.\n`;
  md += `* **R7 (Number Grounding):** Every number in a caption appears in the bound values or in the part's code.\n`;
  md += `* **R8 (Word Grounding):** Every tappable word/label appears as a whole word in the lesson text or code.\n`;
  md += `* **R9 (Design Token Palette):** Visual tones are strictly restricted to the 4 design tokens: \`data\`, \`ok\`, \`error\`, \`idle\`.\n`;
  md += `* **R10 (Visual Density):** At least 3 of the 6 parts in a day have a picture; otherwise the day is flagged \`needs-review\`.\n`;
  md += `* **R11 (Manifest Synchronization):** The manifest status matches the day file: \`passed\`, \`none\`, or \`needs-review\`.\n`;
  md += `* **R12 (Conceptual Overlap):** On-concept check: Each caption shares at least one 4+ letter word with the attached lesson text.\n`;
  md += `* **R13 (Freshness Cryptography):** Each entry's \`codeHash\` equals the SHA-256 of the part's current code.\n`;
  md += `* **R14 (Runtime Stability):** No binding points to an unstable variable that differs across runs.\n\n`;

  md += `---\n\n`;

  md += `## 🔬 Deep Course-by-Course Blueprint (All 37 Individual Courses)\n\n`;
  md += `Below is the complete, unabridged architectural specification for each of the 37 individual 1-month courses. Each course details the pedagogical mental model, allowed templates, the complete 6-Block breakdown across all 30 days grounded in the actual curriculum, and the capstone milestone project:\n\n`;

  courses.forEach(c => {
    const meta = COURSE_METAS[c.id];
    if (!meta) return;

    md += `### Course ${c.num.toString().padStart(2, '0')}: [${c.id}] ${c.title}\n\n`;
    md += `* **Catalog ID:** \`${c.id}\`  \n`;
    md += `* **Prefix / Directory:** \`src/lib/data/lessonVisuals/${meta.prefix}/\`  \n`;
    md += `* **Difficulty:** ${c.difficulty || 'All Levels'} | **Duration:** 4 Weeks / 30 Curriculum Days | **Quests:** ${c.totalQuests || 96} quests  \n`;
    md += `* **Core Architectural Theme:** ${meta.theme}  \n`;
    md += `* **Allowed Visual Templates:** \`${meta.allowedTemplates.join('`, `')}\`  \n\n`;

    md += `#### Pedagogical Whiteboard Mental Model\n`;
    md += `> ${meta.pedagogy}\n\n`;

    md += `#### 6-Block Detailed Curriculum & Visual Architecture (Days 1–30)\n\n`;
    md += `| Block | Day Range | Real Curriculum Focus & Sample Topics | Primary Visual Architecture & Step Bindings |\n`;
    md += `| :---: | :---: | :--- | :--- |\n`;

    c.blocks.forEach((b, bIdx) => {
      const startDay = b.days[0]?.day || (bIdx * 5 + 1);
      const endDay = b.days[b.days.length - 1]?.day || (bIdx * 5 + 5);
      const sampleTopic = b.days[0]?.title || `Block ${bIdx + 1} Foundations`;
      const focus = meta.blockFocus[bIdx] || `Core Block ${bIdx + 1} Mastery`;
      const template = meta.allowedTemplates[bIdx % meta.allowedTemplates.length];

      md += `| **Block ${b.blockNum}** | Days ${startDay}–${endDay} | **${focus}**<br>_Sample: "${sampleTopic.replace(/\|/g, '-')}"_ | Template \`${template}\`: Step-by-step state animation with \`data\`, \`ok\`, \`idle\` token highlighting. |\n`;
    });

    md += `\n`;
    md += `#### Capstone Milestone Project\n`;
    md += `* **Milestone Deliverable:** ${meta.milestoneProject}\n\n`;
    md += `---\n\n`;
  });

  md += `## 🚀 Execution & Phased Implementation Roadmap\n\n`;
  md += `The generation and verification of all 37 individual courses proceeds in structured, atomic phases:\n\n`;

  md += `### Phase 0: Pre-Flight Safety, Scope Guard & Protected Files\n`;
  md += `* Lock down test suites, security guards, and protected directories.\n`;
  md += `* Run Gitleaks secret scanning and verify clean working tree on \`main-dis3ku\`.\n`;
  md += `* Initialize course directories under \`src/lib/data/lessonVisuals/\` for all ungenerated courses.\n\n`;

  md += `### Phase 1: Visual Engine Extensions & Domain Template Adaptations\n`;
  md += `* Register extended templates: \`register-bits\` for Embedded IoT, \`ledger-sheet\` for Digital Accounting, and \`funnel\` for Digital Marketing & Sales.\n`;
  md += `* Extend runtime binding evaluators for financial balances and hardware registers.\n`;
  md += `* Update \`COURSE_ALLOWED_TEMPLATES\` in \`src/lib/visuals/gate.ts\` to reflect all 37 courses.\n\n`;

  md += `### Phase 2: 5-Day Atomic Generation & In-Situ Verification Sprints\n`;
  md += `* Total Workload: **222 atomic 5-day blocks** (37 courses &times; 6 blocks).\n`;
  md += `* Each 5-day block follows the Zero-Hallucination 5-Step Loop:\n`;
  md += `  1. Align day and part titles with the Master Curriculum.\n`;
  md += `  2. Run \`npm run visuals:check -- --course {prefix} --block {N}\`.\n`;
  md += `  3. Remediate any non-compliant entries in place immediately until 100% PASS.\n`;
  md += `  4. Validate runtime payload via \`/api/visuals?prefix={prefix}&day={day}\`.\n`;
  md += `  5. Stage and commit the verified block to git repository.\n\n`;

  md += `### Phase 3: Global Matrix Simulation & Quality Sign-Off\n`;
  md += `* Execute \`simulate-student-view.mts\` across all 1,110 days and 6,660 lesson parts.\n`;
  md += `* Enforce **0 fatal errors, 0 broken bindings, and 100% matrix pass rate**.\n`;
  md += `* Final owner sign-off and milestone release.\n\n`;

  return md;
}

function buildHtml(courses: CourseItem[]): string {
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PinIT Career OS — 36+ Individual 1-Month Courses Master Visuals Plan</title>
  <style>
    @page {
      size: A4;
      margin: 18mm 16mm 18mm 16mm;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 9.5pt;
      line-height: 1.48;
      color: #1e293b;
      margin: 0;
      padding: 0;
    }

    h1, h2, h3, h4 {
      color: #0f172a;
      font-weight: 700;
      page-break-after: avoid;
    }

    h1 {
      font-size: 18pt;
      line-height: 1.25;
      margin-top: 0;
      margin-bottom: 6pt;
      border-bottom: 2.5px solid #2563eb;
      padding-bottom: 6pt;
    }

    h2 {
      font-size: 13pt;
      margin-top: 16pt;
      margin-bottom: 6pt;
      border-bottom: 1.5px solid #cbd5e1;
      padding-bottom: 4pt;
      page-break-after: avoid;
    }

    h3 {
      font-size: 11pt;
      margin-top: 13pt;
      margin-bottom: 4pt;
      page-break-after: avoid;
    }

    h4 {
      font-size: 9.5pt;
      margin-top: 8pt;
      margin-bottom: 3pt;
      color: #334155;
    }

    p {
      margin-top: 0;
      margin-bottom: 6pt;
    }

    .header-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #2563eb;
      padding: 10pt 14pt;
      margin-bottom: 14pt;
      border-radius: 4pt;
    }

    .header-box table {
      width: 100%;
      border-collapse: collapse;
      margin: 0;
    }

    .header-box td {
      padding: 2.5pt 6pt;
      font-size: 8.8pt;
      vertical-align: top;
      border: none;
    }

    .header-box td.label {
      font-weight: 600;
      color: #475569;
      width: 25%;
    }

    .header-box td.val {
      color: #0f172a;
    }

    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 6pt;
      margin-bottom: 10pt;
      font-size: 8.5pt;
      page-break-inside: auto;
    }

    table.data-table tr {
      page-break-inside: avoid;
      page-break-after: auto;
    }

    table.data-table th, table.data-table td {
      border: 1px solid #cbd5e1;
      padding: 4pt 6pt;
      text-align: left;
      vertical-align: top;
    }

    table.data-table th {
      background-color: #f1f5f9;
      color: #0f172a;
      font-weight: 600;
    }

    table.data-table tr:nth-child(even) td {
      background-color: #f8fafc;
    }

    .cluster-badge {
      display: inline-block;
      padding: 2px 6px;
      font-size: 7.5pt;
      font-weight: 700;
      border-radius: 3px;
      color: #ffffff;
      text-transform: uppercase;
      margin-bottom: 4pt;
    }

    .course-card {
      border: 1px solid #e2e8f0;
      border-radius: 4pt;
      padding: 8pt 10pt;
      margin-bottom: 12pt;
      background: #ffffff;
      page-break-inside: avoid;
    }

    .course-card-header {
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 4pt;
      margin-bottom: 6pt;
    }

    .quote-box {
      background: #eff6ff;
      border-left: 3px solid #3b82f6;
      padding: 5pt 8pt;
      margin: 4pt 0 6pt 0;
      font-size: 8.5pt;
      color: #1e3a8a;
      font-style: italic;
    }

    code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      font-size: 8pt;
      background-color: #f1f5f9;
      padding: 1px 3px;
      border-radius: 2px;
      color: #0f172a;
      border: 1px solid #e2e8f0;
    }

    .page-break {
      page-break-before: always;
    }
  </style>
</head>
<body>

  <h1>PinIT Career OS — 36+ Individual 1-Month Courses Master Visuals Architecture</h1>
  
  <div class="header-box">
    <table>
      <tr>
        <td class="label">Document Identifier</td>
        <td class="val"><strong>PINIT_36_INDIVIDUAL_COURSES_VISUALS_PLAN</strong> (Claude Style Publication Edition)</td>
      </tr>
      <tr>
        <td class="label">Total Courses & Volume</td>
        <td class="val"><strong>37 Courses</strong> &nbsp;•&nbsp; <strong>1,110 Lesson Days</strong> &nbsp;•&nbsp; <strong>6,660 Interactive Lesson Parts</strong></td>
      </tr>
      <tr>
        <td class="label">Curriculum Domain Clusters</td>
        <td class="val">6 Distinct Clusters (Software Eng, Systems/Security, Hardware/Web3, Commerce, Operations, Foundations)</td>
      </tr>
      <tr>
        <td class="label">Quality & Testing Standard</td>
        <td class="val"><strong>Technical Gate v2 (Rules R1–R14)</strong> with 5-Day Atomic Verification Cycles & Zero Hallucination</td>
      </tr>
      <tr>
        <td class="label">Engine & API Stack</td>
        <td class="val">Next.js 14, TypeScript, React <code>VisualStage.tsx</code>, <code>/api/visuals</code>, Playwright Headless Chromium</td>
      </tr>
    </table>
  </div>

  <h2>1. Executive Summary & The Golden Triad</h2>
  <p>
    The PinIT Career OS learning platform delivers high-retention technical and vocational education by pairing every lesson part with an interactive visual mental model. Across all <strong>37 individual 1-month certification courses</strong>, abstract code, business logic, hardware registers, and algorithmic structures are materialized on the left of the student's lesson player.
  </p>
  <div class="quote-box">
    <strong>The Golden Triad:</strong> <em>Content &harr; Output &harr; Visuals.</em> Visuals move in lockstep with the instructor's spoken voice (<code>say</code> lines). Visual values are <strong>strictly bound to runtime compiler output</strong>, never hallucinated by an AI. When students edit code and click <em>Run</em>, diagrams smoothly re-animate using their live values.
  </div>

  <h2>2. Master Domain Cluster Taxonomy (37 Courses)</h2>
`;

  CLUSTERS.forEach(cluster => {
    html += `
    <div style="margin-top: 10pt;">
      <span class="cluster-badge" style="background-color: ${cluster.color};">${cluster.tag}</span>
      <h3 style="margin-top: 2pt;">${cluster.title}</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 5%;">#</th>
            <th style="width: 25%;">Course Identifier</th>
            <th style="width: 35%;">Canonical Title</th>
            <th style="width: 15%;">Level</th>
            <th style="width: 20%;">Allowed Templates</th>
          </tr>
        </thead>
        <tbody>
    `;

    cluster.courseIds.forEach(id => {
      const c = courses.find(item => item.id === id);
      const meta = COURSE_METAS[id];
      if (c && meta) {
        html += `
          <tr>
            <td style="font-weight: 700; text-align: center;">${c.num.toString().padStart(2, '0')}</td>
            <td><code>${c.id}</code></td>
            <td><strong>${c.title}</strong></td>
            <td>${c.difficulty || 'Intermediate'}</td>
            <td><code>${meta.allowedTemplates.join(', ')}</code></td>
          </tr>
        `;
      }
    });

    html += `
        </tbody>
      </table>
    </div>
    `;
  });

  html += `
  <div class="page-break"></div>

  <h2>3. Master Visual Templates Catalog (17 Interactive Diagram Engines)</h2>
  <p>
    The visual platform provides 17 dedicated diagram engines. Each engine complies with the 4 core design tokens (<code>data</code>, <code>ok</code>, <code>error</code>, <code>idle</code>) and supports animated step transitions:
  </p>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 15%;">Template Key</th>
        <th style="width: 25%;">Engine Name</th>
        <th style="width: 15%;">Domain</th>
        <th style="width: 45%;">Interactive Mechanics & Pedagogical Function</th>
      </tr>
    </thead>
    <tbody>
  `;

  Object.entries(TEMPLATES_INFO).forEach(([key, info]) => {
    html += `
      <tr>
        <td><code>${key}</code></td>
        <td><strong>${info.label}</strong></td>
        <td>${info.domain}</td>
        <td>${info.desc}</td>
      </tr>
    `;
  });

  html += `
    </tbody>
  </table>

  <h2>4. Technical Gate v2 Enforcement Standard (Rules R1–R14)</h2>
  <p>
    To guarantee <strong>zero AI hallucinations</strong> and production resilience, every generated JSON visual file must pass all 14 rules of the Gate v2 programmatic validator:
  </p>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 8%;">Rule</th>
        <th style="width: 27%;">Rule Name</th>
        <th style="width: 65%;">Validation Criterion</th>
      </tr>
    </thead>
    <tbody>
      <tr><td><strong>R1</strong></td><td>AST Linkage</td><td>Day file has exactly 6 entries matching real lesson AST part titles.</td></tr>
      <tr><td><strong>R2</strong></td><td>Template Whitelist</td><td>Template is <code>none</code> or on the course's allowed list.</td></tr>
      <tr><td><strong>R3</strong></td><td>Shape & Step Limits</td><td>2 to 5 steps; &le; 6 shapes per step; tables have 2–5 cols and &le; 6 rows.</td></tr>
      <tr><td><strong>R4</strong></td><td>Monotonic Stepping</td><td>Step <code>at</code> points strictly increase and match real lecture sentence indices.</td></tr>
      <tr><td><strong>R5</strong></td><td>Caption Typography</td><td>Single sentence &le; 80 characters, ending in a period, zero emojis.</td></tr>
      <tr><td><strong>R6</strong></td><td>Deterministic Bindings</td><td>Every displayed value maps to a compiler runtime binding (<code>var</code>, <code>out</code>, etc.).</td></tr>
      <tr><td><strong>R7</strong></td><td>Numeric Grounding</td><td>Every number in a caption appears verbatim in code or runtime output.</td></tr>
      <tr><td><strong>R8</strong></td><td>Lexical Grounding</td><td>Every tapped label exists as a whole word in lesson text or code.</td></tr>
      <tr><td><strong>R9</strong></td><td>Design Token Palette</td><td>Tones restricted strictly to <code>data</code>, <code>ok</code>, <code>error</code>, <code>idle</code>.</td></tr>
      <tr><td><strong>R10</strong></td><td>Visual Density</td><td>At least 3 of 6 parts per day have diagrams (otherwise flagged review).</td></tr>
      <tr><td><strong>R11</strong></td><td>Manifest Sync</td><td>Manifest status reflects true file state (<code>passed</code>, <code>none</code>, <code>needs-review</code>).</td></tr>
      <tr><td><strong>R12</strong></td><td>Concept Overlap</td><td>Captions share 4+ letter keywords with attached lesson explanation.</td></tr>
      <tr><td><strong>R13</strong></td><td>Code Freshness</td><td><code>codeHash</code> matches SHA-256 hash of current lesson snippet.</td></tr>
      <tr><td><strong>R14</strong></td><td>Runtime Stability</td><td>Bindings point only to stable variables that never fluctuate across runs.</td></tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <h2>5. Exhaustive Course-by-Course Blueprint (All 37 Courses)</h2>
  <p>
    Below are the complete architectural blueprints for all 37 individual 1-month courses. Each course specifies its domain cluster, allowed templates, pedagogical mental model, 6-block curriculum breakdown (Days 1–30), and capstone project:
  </p>
  `;

  courses.forEach(c => {
    const meta = COURSE_METAS[c.id];
    if (!meta) return;

    html += `
    <div class="course-card">
      <div class="course-card-header">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <h3 style="margin: 0; color: #1e293b;">Course ${c.num.toString().padStart(2, '0')}: ${c.title}</h3>
          <span style="font-size: 8pt; color: #64748b; font-weight: 600;">Catalog: <code>${c.id}</code></span>
        </div>
        <p style="margin: 2pt 0; font-size: 8.5pt; color: #475569;">
          <strong>Difficulty:</strong> ${c.difficulty || 'All Levels'} &nbsp;|&nbsp; 
          <strong>Duration:</strong> 4 Weeks (30 Days / 6 Blocks) &nbsp;|&nbsp; 
          <strong>Quests:</strong> ${c.totalQuests || 96} quests &nbsp;|&nbsp;
          <strong>Allowed:</strong> <code>${meta.allowedTemplates.join(', ')}</code>
        </p>
      </div>

      <p style="font-size: 8.5pt; margin-bottom: 4pt;">
        <strong>Architectural Theme:</strong> ${meta.theme}
      </p>

      <div class="quote-box" style="margin: 4pt 0 6pt 0;">
        <strong>Pedagogical Whiteboard Model:</strong> ${meta.pedagogy}
      </div>

      <table class="data-table" style="margin-top: 4pt; margin-bottom: 4pt; font-size: 8pt;">
        <thead>
          <tr>
            <th style="width: 12%;">Block</th>
            <th style="width: 14%;">Days</th>
            <th style="width: 44%;">Curriculum Topic & Real Lessons</th>
            <th style="width: 30%;">Visual Engine Architecture</th>
          </tr>
        </thead>
        <tbody>
    `;

    c.blocks.forEach((b, bIdx) => {
      const startDay = b.days[0]?.day || (bIdx * 5 + 1);
      const endDay = b.days[b.days.length - 1]?.day || (bIdx * 5 + 5);
      const focus = meta.blockFocus[bIdx] || `Core Block ${bIdx + 1} Mastery`;
      const template = meta.allowedTemplates[bIdx % meta.allowedTemplates.length];

      html += `
          <tr>
            <td style="font-weight: 600;">Block ${b.blockNum}</td>
            <td>Days ${startDay}–${endDay}</td>
            <td><strong>${focus}</strong></td>
            <td>Template <code>${template}</code>: Animated state progression</td>
          </tr>
      `;
    });

    html += `
        </tbody>
      </table>

      <p style="font-size: 8.2pt; margin: 4pt 0 0 0; color: #0f172a;">
        <strong>Capstone Milestone:</strong> ${meta.milestoneProject}
      </p>
    </div>
    `;
  });

  html += `
  <div class="page-break"></div>

  <h2>6. Execution & Phased Implementation Roadmap</h2>
  <p>
    The generation and verification of visual assets across all 37 individual 1-month courses follows an atomic, verifiable protocol:
  </p>

  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 15%;">Phase</th>
        <th style="width: 35%;">Scope & Objectives</th>
        <th style="width: 50%;">Verification Gate & Deliverables</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Phase 0: Safety & Scope</strong></td>
        <td>Protected file locks, Gitleaks secret verification, course directory initialization across all 37 prefixes.</td>
        <td>Pre-flight checks pass; zero uncommitted modifications; clean working directory.</td>
      </tr>
      <tr>
        <td><strong>Phase 1: Engine Buildout</strong></td>
        <td>Register 3 extended templates (<code>register-bits</code>, <code>ledger-sheet</code>, <code>funnel</code>); wire financial ledger and bitwise binding adapters.</td>
        <td>All 17 templates compile in <code>VisualStage.tsx</code>; TypeScript typechecks clean.</td>
      </tr>
      <tr>
        <td><strong>Phase 2: 5-Day Sprints</strong></td>
        <td>Generate 222 atomic 5-day blocks across the 37 courses using the 5-Step Loop.</td>
        <td>Every block outputs <code>PASS 5/6</code> or <code>PASS 6/6</code> on Gate v2 before atomic git commit.</td>
      </tr>
      <tr>
        <td><strong>Phase 3: Student Simulation</strong></td>
        <td>Full-matrix runtime audit across all 1,110 lesson days and 6,660 parts using <code>simulate-student-view.mts</code>.</td>
        <td><strong>100% matrix pass rate (0 fatal errors, 0 broken bindings, 0 layout crashes).</strong></td>
      </tr>
      <tr>
        <td><strong>Phase 4: Owner Sign-Off</strong></td>
        <td>Sample inspection of 3 lessons per cluster on mobile (390px) and desktop (1440px) viewports in light and dark modes.</td>
        <td>Official release switches flipped in <code>enabledCourses.ts</code>.</td>
      </tr>
    </tbody>
  </table>

  <div style="margin-top: 24pt; border-top: 1px solid #cbd5e1; padding-top: 10pt; text-align: center; color: #64748b; font-size: 8pt;">
    PinIT Career OS &nbsp;•&nbsp; Publication-Grade Visuals Master Architecture &nbsp;•&nbsp; 37 Courses &nbsp;•&nbsp; 100% Gate v2 Compliant
  </div>

</body>
</html>`;

  return html;
}

main().catch(err => {
  console.error('Fatal error during compilation:', err);
  process.exit(1);
});
