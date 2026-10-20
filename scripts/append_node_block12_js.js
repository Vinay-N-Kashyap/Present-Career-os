const fs = require('fs');

// 1. Update src/lib/data/nodeWebDays.ts
console.log('--- 1. Updating src/lib/data/nodeWebDays.ts ---');
let daysContent = fs.readFileSync('src/lib/data/nodeWebDays.ts', 'utf-8');
const daysLastBracket = daysContent.lastIndexOf('];');
if (daysLastBracket === -1) throw new Error("Could not find '];' in nodeWebDays.ts");

const beforeDaysClose = daysContent.slice(0, daysLastBracket).trimEnd();

const dayConfigs = [
  {
    day: 56,
    title: "Event-Driven Microservices with Kafka: Consumer Groups, Partition Offsets & Rebalance Listeners",
    desc: "Master Apache Kafka event streaming in Node.js: architect high-throughput producers with batching and Snappy compression, configure consumer groups with cooperative sticky rebalance protocols, handle partition revocation listeners, and enforce strictly ordered at-least-once message processing.",
    syllabus: [
      "Kafka architecture: Distributed commit logs, brokers, partitions, replication factors, and ISR quorums.",
      "Producer semantics: linger.ms, batch.size, snappy compression, idempotent producers, and acks=all durability.",
      "Consumer groups & partition rebalancing: Eager vs Cooperative Sticky protocols and manual offset commit checkpoints.",
      "Rebalance listeners & graceful shutdown: onPartitionsRevoked offset flushing, timeout budgets, and seek recovery."
    ]
  },
  {
    day: 57,
    title: "CQRS, Event Sourcing & Transactional Outbox: Event Stores & Change Data Capture",
    desc: "Master distributed data consistency in Node.js: eliminate dual-write hazards with the Transactional Outbox pattern, harvest uncommitted database events via Debezium CDC and SKIP LOCKED relays, architect append-only Event Sourcing stores with optimistic versioning, and build asynchronous CQRS read projections.",
    syllabus: [
      "Dual-write vulnerability: Race conditions, partial write splits, and Transactional Outbox atomic local ACID transactions.",
      "Change Data Capture (CDC): Debezium WAL log tailing, PostgreSQL SKIP LOCKED polling, and table partitioning.",
      "Event Sourcing core: Append-only immutable event store, aggregate rehydration, and periodic snapshotting.",
      "Command Query Responsibility Segregation (CQRS): Asynchronous read projections and sub-millisecond query materialization."
    ]
  },
  {
    day: 58,
    title: "Distributed Sagas & Compensation Workflows: Orchestrator vs Choreography & Idempotent Retries",
    desc: "Master distributed transaction architecture in Node.js: analyze ACID limitations across microservices, contrast Choreography vs Orchestration saga patterns, construct durable state-machine-backed orchestrators, implement compensating transactions with reverse LIFO execution, and enforce strict idempotency barriers with semantic fencing against out-of-order events.",
    syllabus: [
      "ACID limits in distributed microservices: 2PC locking bottlenecks, BASE consistency, and Hector Garcia-Molina Sagas.",
      "Choreography vs Orchestration: Decentralized domain events, distributed spaghetti deadlocks, and central state machines.",
      "Compensating transactions & state machines: Durable step transitions, reverse LIFO compensation stacks, and rollback guarantees.",
      "Failure handling & idempotency: Unique idempotency keys, semantic fencing epochs, and jittered exponential backoff."
    ]
  },
  {
    day: 59,
    title: "High-Throughput Caching & Write-Behind Pipelines: Redis Cluster, Cache Invalidation & Stampede Protection",
    desc: "Master high-throughput distributed caching in Node.js: architect Redis Cluster with 16384 hash slots and hash tags, implement race-free cache-aside invalidation patterns, eliminate thundering herd cache stampedes using distributed mutex locking, and design write-behind pipelines with batch mutation coalescing.",
    syllabus: [
      "Redis Cluster architecture: 16,384 hash slots, CRC16 hashing, hash tag colocation, and master-replica failover.",
      "Cache invalidation patterns: Cache-Aside lazy loading, delete vs update race hazards, and write-through caching.",
      "Cache stampede (thundering herd) protection: Distributed mutex locking with SETNX, and probabilistic early expiration (XFetch).",
      "High-throughput write-behind pipelines: In-memory mutation buffers, batch coalescing, and bulk database synchronization."
    ]
  },
  {
    day: 60,
    title: "🏆 Milestone 10 Capstone: High-Throughput Event-Driven Microservices Hub with Kafka Streaming, Outbox Pattern & Distributed Sagas",
    desc: "Architect, build, and certify the Milestone 10 Capstone Hub: a unified high-throughput event-driven microservices platform integrating atomic Transactional Outbox with CDC streaming, distributed checkout sagas with LIFO compensation, strict idempotency barriers, Redis Cluster hash tag sharding with stampede mutex locks, and high-speed write-behind batch coalescing.",
    syllabus: [
      "Milestone architecture blueprint: Unified event-driven hub, service topology registry, and Kafka cluster integration.",
      "Transactional Outbox & event streaming core: Atomic PostgreSQL ACID transactions, CDC relay, and deterministic partition routing.",
      "Distributed Saga Orchestrator & compensation engine: Centralized state machine, LIFO backward rollbacks, and idempotency.",
      "High-throughput caching & write-behind tier: Redis Cluster hash tags, stampede mutex suppression, batch coalescing, and Grade A+ certification."
    ]
  }
];

const formattedDayConfigs = dayConfigs.map(cfg => {
  const syll = cfg.syllabus.map(s => `      "${s}"`).join(',\n');
  return `  {
    day: ${cfg.day},
    title: "${cfg.title}",
    desc: "${cfg.desc}",
    syllabus: [
${syll}
    ]
  }`;
}).join(',\n');

daysContent = beforeDaysClose + ',\n' + formattedDayConfigs + '\n];\n';
fs.writeFileSync('src/lib/data/nodeWebDays.ts', daysContent, 'utf-8');
console.log('Updated src/lib/data/nodeWebDays.ts successfully with Days 56-60!');

// 2. Update src/lib/data/nodeWeb30DayData.ts
console.log('\n--- 2. Updating src/lib/data/nodeWeb30DayData.ts ---');
let thirtyContent = fs.readFileSync('src/lib/data/nodeWeb30DayData.ts', 'utf-8');
const marker = 'export const NODE_WEB_30_DAYS_QUESTS';
const markerIdx = thirtyContent.indexOf(marker);
if (markerIdx === -1) throw new Error("Could not find marker in nodeWeb30DayData.ts");

const configsCloseBracket = thirtyContent.lastIndexOf('];', markerIdx);
if (configsCloseBracket === -1) throw new Error("Could not find '];' before quests in nodeWeb30DayData.ts");

const beforeConfigs = thirtyContent.slice(0, configsCloseBracket).trimEnd();
const afterConfigs = thirtyContent.slice(configsCloseBracket);

const block12Configs = `
  // ── DAY 56: Event-Driven Microservices with Kafka ──────────────────────────────
  {
    ...NODE_WEB_DAYS[55],
    eTitle: "Calculate Kafka Partition Key Hash",
    eDesc: "Write \`calculateKafkaPartition(key: string, partitionCount: number): number\` computing deterministic hash = \`(hash * 31 + charCode) & 0x7fffffff\` and returning \`hash % partitionCount\`.",
    eLanguage: "typescript",
    eStarter: lines("function calculateKafkaPartition(key, partitionCount) {", "  // Return partition index", "  return 0;", "}"),
    eHint: "let hash = 0; for (let i = 0; i < key.length; i++) { hash = (hash * 31 + key.charCodeAt(i)) & 0x7fffffff; } return hash % partitionCount;",
    eTest: lines(
      "if (typeof calculateKafkaPartition !== 'function') throw new Error('calculateKafkaPartition not found');",
      "const p1 = calculateKafkaPartition('cust_101', 4);",
      "const p2 = calculateKafkaPartition('cust_101', 4);",
      "if (p1 !== p2) throw new Error('Hashing must be deterministic');",
      "if (p1 < 0 || p1 >= 4) throw new Error('Partition out of range: ' + p1);",
      "const p3 = calculateKafkaPartition('cust_202', 4);",
      "if (typeof p3 !== 'number') throw new Error('Partition must be a number');"
    ),
    aTitle: "Evaluate Consumer Lag & Throttle State",
    aDesc: "Write \`evaluateConsumerLag(logEndOffset: number, currentOffset: number, maxAllowedLag: number): { lag: number; shouldThrottle: boolean }\` calculating \`lag = logEndOffset - currentOffset\` and \`shouldThrottle = lag > maxAllowedLag\`.",
    aLanguage: "typescript",
    aStarter: lines("function evaluateConsumerLag(logEndOffset, currentOffset, maxAllowedLag) {", "  // Return lag state", "  return { lag: 0, shouldThrottle: false };", "}"),
    aHint: "const lag = logEndOffset - currentOffset; return { lag, shouldThrottle: lag > maxAllowedLag };",
    aTest: lines(
      "if (typeof evaluateConsumerLag !== 'function') throw new Error('evaluateConsumerLag not found');",
      "const l1 = evaluateConsumerLag(1000, 950, 100);",
      "if (l1.lag !== 50 || l1.shouldThrottle !== false) throw new Error('Failed under lag threshold: ' + JSON.stringify(l1));",
      "const l2 = evaluateConsumerLag(1000, 800, 100);",
      "if (l2.lag !== 200 || l2.shouldThrottle !== true) throw new Error('Failed over lag threshold: ' + JSON.stringify(l2));",
      "const l3 = evaluateConsumerLag(500, 500, 50);",
      "if (l3.lag !== 0 || l3.shouldThrottle !== false) throw new Error('Failed zero lag: ' + JSON.stringify(l3));"
    )
  },

  // ── DAY 57: CQRS, Event Sourcing & Transactional Outbox ────────────────────────
  {
    ...NODE_WEB_DAYS[56],
    eTitle: "Create Outbox Event Record",
    eDesc: "Write \`createOutboxRecord(aggregateType: string, aggregateId: string, eventType: string, payload: any, sequence: number): { outboxId: string; aggregateType: string; aggregateId: string; eventType: string; payload: any; status: string }\` returning outbox object with \`outboxId = 'out_' + sequence\` and \`status = 'PENDING'\`.",
    eLanguage: "typescript",
    eStarter: lines("function createOutboxRecord(aggregateType, aggregateId, eventType, payload, sequence) {", "  // Return staged outbox record", "  return {};", "}"),
    eHint: "return { outboxId: 'out_' + sequence, aggregateType, aggregateId, eventType, payload, status: 'PENDING' };",
    eTest: lines(
      "if (typeof createOutboxRecord !== 'function') throw new Error('createOutboxRecord not found');",
      "const r1 = createOutboxRecord('Order', 'ord_501', 'OrderPlaced', { amount: 150 }, 1);",
      "if (r1.outboxId !== 'out_1' || r1.aggregateId !== 'ord_501' || r1.status !== 'PENDING') throw new Error('Failed r1: ' + JSON.stringify(r1));",
      "if (r1.eventType !== 'OrderPlaced' || r1.payload.amount !== 150) throw new Error('Failed payload matching: ' + JSON.stringify(r1));"
    ),
    aTitle: "Verify CQRS Optimistic Version Guard",
    aDesc: "Write \`verifyOptimisticVersion(expectedVersion: number, currentVersion: number): { canAppend: boolean; conflictReason: string | null }\` returning \`{ canAppend: true, conflictReason: null }\` if \`currentVersion === expectedVersion\`, else \`{ canAppend: false, conflictReason: 'VERSION_MISMATCH' }\`.",
    aLanguage: "typescript",
    aStarter: lines("function verifyOptimisticVersion(expectedVersion, currentVersion) {", "  // Return version check result", "  return { canAppend: false, conflictReason: null };", "}"),
    aHint: "if (currentVersion === expectedVersion) return { canAppend: true, conflictReason: null }; return { canAppend: false, conflictReason: 'VERSION_MISMATCH' };",
    aTest: lines(
      "if (typeof verifyOptimisticVersion !== 'function') throw new Error('verifyOptimisticVersion not found');",
      "const v1 = verifyOptimisticVersion(5, 5);",
      "if (v1.canAppend !== true || v1.conflictReason !== null) throw new Error('Failed matching version: ' + JSON.stringify(v1));",
      "const v2 = verifyOptimisticVersion(5, 4);",
      "if (v2.canAppend !== false || v2.conflictReason !== 'VERSION_MISMATCH') throw new Error('Failed mismatch version: ' + JSON.stringify(v2));"
    )
  },

  // ── DAY 58: Distributed Sagas & Compensation Workflows ─────────────────────────
  {
    ...NODE_WEB_DAYS[57],
    eTitle: "Evaluate Idempotency Key Duplicate State",
    eDesc: "Write \`evaluateIdempotencyKey(key: string, processedMap: Record<string, any>): { isDuplicate: boolean; cachedResult: any }\` checking if \`key\` exists in \`processedMap\`. If yes, returns \`{ isDuplicate: true, cachedResult: processedMap[key] }\`; else \`{ isDuplicate: false, cachedResult: null }\`.",
    eLanguage: "typescript",
    eStarter: lines("function evaluateIdempotencyKey(key, processedMap) {", "  // Return idempotency evaluation", "  return { isDuplicate: false, cachedResult: null };", "}"),
    eHint: "if (Object.prototype.hasOwnProperty.call(processedMap, key)) return { isDuplicate: true, cachedResult: processedMap[key] }; return { isDuplicate: false, cachedResult: null };",
    eTest: lines(
      "if (typeof evaluateIdempotencyKey !== 'function') throw new Error('evaluateIdempotencyKey not found');",
      "const map = { 'saga_1:pay': { charged: 100 } };",
      "const e1 = evaluateIdempotencyKey('saga_1:pay', map);",
      "if (e1.isDuplicate !== true || e1.cachedResult.charged !== 100) throw new Error('Failed cached duplicate: ' + JSON.stringify(e1));",
      "const e2 = evaluateIdempotencyKey('saga_2:pay', map);",
      "if (e2.isDuplicate !== false || e2.cachedResult !== null) throw new Error('Failed fresh key: ' + JSON.stringify(e2));"
    ),
    aTitle: "Execute Reverse LIFO Compensation Stack",
    aDesc: "Write \`executeLifoCompensations(compensations: Array<{ step: string; executed: boolean }>): string[]\` popping each compensation and returning array of step names in reverse order (LIFO).",
    aLanguage: "typescript",
    aStarter: lines("function executeLifoCompensations(compensations) {", "  // Return rolled back step names in LIFO order", "  return [];", "}"),
    aHint: "const stack = [...compensations]; const rolledBack = []; while (stack.length > 0) { const item = stack.pop(); rolledBack.push(item.step); } return rolledBack;",
    aTest: lines(
      "if (typeof executeLifoCompensations !== 'function') throw new Error('executeLifoCompensations not found');",
      "const comps = [{ step: 'CANCEL_ORDER', executed: false }, { step: 'REFUND_PAYMENT', executed: false }];",
      "const res = executeLifoCompensations(comps);",
      "if (res.length !== 2 || res[0] !== 'REFUND_PAYMENT' || res[1] !== 'CANCEL_ORDER') throw new Error('Failed LIFO reversal: ' + JSON.stringify(res));",
      "const empty = executeLifoCompensations([]);",
      "if (empty.length !== 0) throw new Error('Failed empty stack: ' + JSON.stringify(empty));"
    )
  },

  // ── DAY 59: High-Throughput Caching & Write-Behind Pipelines ────────────────────
  {
    ...NODE_WEB_DAYS[58],
    eTitle: "Compute Redis Cluster Hash Slot with Hash Tags",
    eDesc: "Write \`computeRedisClusterSlot(key: string): number\` extracting \`{tag}\` if present, computing hash with \`hash = ((hash << 5) - hash + charCode) & 0xffff\` and returning \`Math.abs(hash) % 16384\`.",
    eLanguage: "typescript",
    eStarter: lines("function computeRedisClusterSlot(key) {", "  // Return CRC16 hash slot 0..16383", "  return 0;", "}"),
    eHint: "let hKey = key; const m = key.match(/\\\\{([^\\\\}]+)\\\\}/); if (m) hKey = m[1]; let hash = 0; for (let i = 0; i < hKey.length; i++) { hash = ((hash << 5) - hash + hKey.charCodeAt(i)) & 0xffff; } return Math.abs(hash) % 16384;",
    eTest: lines(
      "if (typeof computeRedisClusterSlot !== 'function') throw new Error('computeRedisClusterSlot not found');",
      "const s1 = computeRedisClusterSlot('{user:991}.profile');",
      "const s2 = computeRedisClusterSlot('{user:991}.orders');",
      "if (s1 !== s2) throw new Error('Hash tags must collocate on identical slot: ' + s1 + ' vs ' + s2);",
      "if (s1 < 0 || s1 >= 16384) throw new Error('Slot out of bounds: ' + s1);",
      "const s3 = computeRedisClusterSlot('standaloneKey');",
      "if (typeof s3 !== 'number') throw new Error('Slot must be number');"
    ),
    aTitle: "Coalesce Write-Behind Delta Increments",
    aDesc: "Write \`coalesceWriteBehindDeltas(updates: Array<{ id: string; delta: number }>): Record<string, number>\` aggregating all deltas for each distinct \`id\`.",
    aLanguage: "typescript",
    aStarter: lines("function coalesceWriteBehindDeltas(updates) {", "  // Return coalesced map of id -> totalDelta", "  return {};", "}"),
    aHint: "const res = {}; for (const u of updates) { res[u.id] = (res[u.id] || 0) + u.delta; } return res;",
    aTest: lines(
      "if (typeof coalesceWriteBehindDeltas !== 'function') throw new Error('coalesceWriteBehindDeltas not found');",
      "const batch = [",
      "  { id: 'item_1', delta: 2 },",
      "  { id: 'item_1', delta: 3 },",
      "  { id: 'item_2', delta: 5 }",
      "];",
      "const coalesced = coalesceWriteBehindDeltas(batch);",
      "if (coalesced['item_1'] !== 5 || coalesced['item_2'] !== 5) throw new Error('Failed delta coalescing: ' + JSON.stringify(coalesced));",
      "if (Object.keys(coalesced).length !== 2) throw new Error('Must contain exactly 2 distinct keys');"
    )
  },

  // ── DAY 60: Milestone 10 Capstone: High-Throughput Event-Driven Microservices Hub 
  {
    ...NODE_WEB_DAYS[59],
    eTitle: "Verify Outbox Partition Key Integrity",
    eDesc: "Write \`verifyOutboxPartition(aggregateId: string, partitionCount: number, expectedPartition: number): boolean\` computing \`hash = (hash * 31 + charCode) & 0x7fffffff\` and checking if \`(hash % partitionCount) === expectedPartition\`.",
    eLanguage: "typescript",
    eStarter: lines("function verifyOutboxPartition(aggregateId, partitionCount, expectedPartition) {", "  // Return boolean match", "  return false;", "}"),
    eHint: "let hash = 0; for (let i = 0; i < aggregateId.length; i++) { hash = (hash * 31 + aggregateId.charCodeAt(i)) & 0x7fffffff; } return (hash % partitionCount) === expectedPartition;",
    eTest: lines(
      "if (typeof verifyOutboxPartition !== 'function') throw new Error('verifyOutboxPartition not found');",
      "let computed = 0; for (let i = 0; i < 'ord_99'.length; i++) { computed = (computed * 31 + 'ord_99'.charCodeAt(i)) & 0x7fffffff; }",
      "const expectedP = computed % 4;",
      "const v1 = verifyOutboxPartition('ord_99', 4, expectedP);",
      "if (v1 !== true) throw new Error('Failed expected partition match: ' + v1);",
      "const v2 = verifyOutboxPartition('ord_99', 4, (expectedP + 1) % 4);",
      "if (v2 !== false) throw new Error('Failed non-matching partition');"
    ),
    aTitle: "Certify Milestone 10 Capstone Hub Architecture",
    aDesc: "Write \`certifyMilestone10Capstone(results: { outboxPassed: boolean; sagaPassed: boolean; idempotencyPassed: boolean; redisSlotPassed: boolean; writeBehindPassed: boolean; hubLatencyMs: number }): { certified: boolean; grade: string }\` requiring all 5 passed flags true and \`hubLatencyMs < 1.0\`.",
    aLanguage: "typescript",
    aStarter: lines("function certifyMilestone10Capstone(results) {", "  // Return Milestone 10 Capstone certification", "  return { certified: false, grade: 'FAIL' };", "}"),
    aHint: "const pass = results.outboxPassed && results.sagaPassed && results.idempotencyPassed && results.redisSlotPassed && results.writeBehindPassed && results.hubLatencyMs < 1.0; return { certified: pass, grade: pass ? 'A+' : 'FAIL' };",
    aTest: lines(
      "if (typeof certifyMilestone10Capstone !== 'function') throw new Error('certifyMilestone10Capstone not found');",
      "const c1 = certifyMilestone10Capstone({",
      "  outboxPassed: true, sagaPassed: true, idempotencyPassed: true, redisSlotPassed: true, writeBehindPassed: true, hubLatencyMs: 0.35",
      "});",
      "if (c1.certified !== true || c1.grade !== 'A+') throw new Error('Failed Grade A+ Capstone check: ' + JSON.stringify(c1));",
      "const c2 = certifyMilestone10Capstone({",
      "  outboxPassed: true, sagaPassed: true, idempotencyPassed: true, redisSlotPassed: true, writeBehindPassed: true, hubLatencyMs: 2.1",
      "});",
      "if (c2.certified !== false || c2.grade !== 'FAIL') throw new Error('Failed hubLatencyMs limit check: ' + JSON.stringify(c2));"
    )
  }
`;

thirtyContent = beforeConfigs + ',\n' + block12Configs + afterConfigs;
fs.writeFileSync('src/lib/data/nodeWeb30DayData.ts', thirtyContent, 'utf-8');
console.log('Updated src/lib/data/nodeWeb30DayData.ts successfully with Days 56-60!');

// 3. Update src/lib/data/nodeWebLongLessons.ts
console.log('\n--- 3. Updating src/lib/data/nodeWebLongLessons.ts ---');
let longContent = fs.readFileSync('src/lib/data/nodeWebLongLessons.ts', 'utf-8');
const longLastBracket = longContent.lastIndexOf('];');
if (longLastBracket === -1) throw new Error("Could not find '];' in nodeWebLongLessons.ts");

const beforeLongClose = longContent.slice(0, longLastBracket).trimEnd();

const newLessons = [];
for (const day of [56, 57, 58, 59, 60]) {
  const lessonData = JSON.parse(fs.readFileSync(`scripts/node_day${day}.json`, 'utf-8'));
  newLessons.push(JSON.stringify(lessonData, null, 2));
}

const lessonsJoined = ',\n' + newLessons.join(',\n') + '\n];\n';
longContent = beforeLongClose + lessonsJoined;
fs.writeFileSync('src/lib/data/nodeWebLongLessons.ts', longContent, 'utf-8');
console.log('Updated src/lib/data/nodeWebLongLessons.ts successfully with Days 56-60!');
