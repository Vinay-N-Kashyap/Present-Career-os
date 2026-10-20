const fs = require('fs');

// 1. Update src/lib/data/nodeWebDays.ts
console.log('--- 1. Updating src/lib/data/nodeWebDays.ts ---');
let daysContent = fs.readFileSync('src/lib/data/nodeWebDays.ts', 'utf-8');
const daysLastBracket = daysContent.lastIndexOf('];');
if (daysLastBracket === -1) throw new Error("Could not find '];' in nodeWebDays.ts");

const beforeDaysClose = daysContent.slice(0, daysLastBracket).trimEnd();

const dayConfigs = [
  {
    day: 51,
    title: "High-Throughput Stream Processing & Reactive Pipelines: Transform Streams, Backpressure & Memory Bounds",
    desc: "Master high-throughput stream processing in Node.js: architect Duplex and Transform stream pipelines, engineer backpressure controls with highWaterMark tuning and drain event synchronization, implement length-prefixed binary framing, and build windowed batch aggregators.",
    syllabus: [
      "Stream engine architecture: Readable, Writable, Duplex, and Transform primitives with bounded memory.",
      "Backpressure engineering: highWaterMark thresholds, write() return semantics, and 'drain' event synchronization.",
      "Object Mode streams vs length-prefixed binary framing: packing variable-length records with 4-byte headers.",
      "Reactive stream multiplexing: stream forking, fan-in merging, and dual-trigger windowed batch aggregation."
    ]
  },
  {
    day: 52,
    title: "Edge Security, TLS Offloading & Zero-Trust Identity: mTLS, Ephemeral Certificates, JWKS & RBAC",
    desc: "Master enterprise edge security and zero-trust identity architectures in Node.js: implement TLS 1.3 handshakes, mutual TLS (mTLS) with client certificate validation and CA pinning, asymmetric JWKS token verification, and granular RBAC matrices.",
    syllabus: [
      "Zero-trust security at the edge: TLS 1.3 handshake lifecycle, AEAD cipher suites, and ALPN protocol negotiation.",
      "Mutual TLS (mTLS) client certificate verification: Subject Alternative Name (SAN) parsing and CRL revocation checking.",
      "Cryptographic token verification: asymmetric RS256/ES256 signatures, Key ID (kid) lookups, and JWKS key rotation.",
      "Fine-grained role-based access control (RBAC): scope validation, role inheritance, and defense-in-depth security."
    ]
  },
  {
    day: 53,
    title: "Full-Lifecycle Distributed Observability: OpenTelemetry SDK, Trace Context Injection & Prometheus Histograms",
    desc: "Master full-lifecycle distributed observability in Node.js: implement OpenTelemetry semantic conventions, engineer W3C TraceContext propagation across parent-child span hierarchies, instrument Prometheus counters, gauges, and latency histograms, and build structured correlation logging.",
    syllabus: [
      "Modern observability foundations: Three Pillars (traces, metrics, logs) and vendor-neutral OpenTelemetry conventions.",
      "W3C TraceContext propagation: 16-byte traceId parsing, child span creation, and downstream header injection.",
      "Prometheus metrics instrumentation: Counter, Gauge, and exponential Histogram latency bucket percentiles.",
      "High-throughput structured JSON logging: AsyncLocalStorage ambient context binding and automatic trace correlation."
    ]
  },
  {
    day: 54,
    title: "Dynamic Reverse Proxying, Protocol Translation & WebSocket Multiplexing: HTTP/1.1 to gRPC & WebSocket Hubs",
    desc: "Master dynamic reverse proxying, protocol translation, and real-time WebSocket multiplexing in Node.js: implement Radix route dispatching and header rewriting, construct gRPC-JSON transcoding with 5-byte framing and status mapping, and build least-connections load balancing with circuit breakers.",
    syllabus: [
      "Reverse proxy fundamentals: Radix prefix route matching, untrusted header stripping, and X-Forwarded-* injection.",
      "Protocol translation: RESTful JSON over HTTP/1.1 to binary gRPC over HTTP/2 with bidirectional status code mapping.",
      "WebSocket connection multiplexing: RFC 6455 upgrade handshakes, heartbeat ping/pong tracking, and channel pub/sub.",
      "Load balancing & circuit breaking: least-connections distribution, active health probes, and outlier ejection."
    ]
  },
  {
    day: 55,
    title: "🏆 Milestone 10 (Core): High-Throughput Edge Routing & Policy Engine with Transcoding & Adaptive Rate Limiting",
    desc: "Architect, build, and certify the Milestone 10 Core Engine: a unified high-throughput edge routing and policy gateway uniting multi-tenant Radix prefix routing, zero-trust mTLS and JWKS security enforcement, adaptive token bucket rate limiting with latency backpressure, bidirectional REST-to-gRPC transcoding, and resilient least-connections dispatching with circuit breakers and W3C distributed tracing.",
    syllabus: [
      "Milestone architecture: linear ingress pipeline, pipeline invariants, and multi-tenant Radix route isolation.",
      "Zero-trust security enforcement: mTLS transport barrier, JWKS signature verification, and RBAC matrix evaluation.",
      "Protocol transcoding & adaptive rate limiting: token bucket throttling with downstream latency backpressure feedback.",
      "Resilient edge cluster dispatching & capstone SLA certification: least-connections balancing, circuit breakers, and Grade A+ certification."
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
console.log('Updated src/lib/data/nodeWebDays.ts successfully!');

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

const block11Configs = `
  // ── DAY 51: High-Throughput Stream Processing & Reactive Pipelines ─────────────
  {
    ...NODE_WEB_DAYS[50],
    eTitle: "Calculate Stream Backpressure State",
    eDesc: "Write \`calculateStreamBackpressureState(bufferedBytes: number, highWaterMark: number): { shouldPause: boolean; ratio: number }\` calculating ratio as Number((bufferedBytes / highWaterMark).toFixed(2)) and shouldPause as bufferedBytes >= highWaterMark.",
    eLanguage: "typescript",
    eStarter: lines("function calculateStreamBackpressureState(bufferedBytes, highWaterMark) {", "  // Return backpressure state", "  return { shouldPause: false, ratio: 0 };", "}"),
    eHint: "const ratio = Number((bufferedBytes / highWaterMark).toFixed(2)); return { shouldPause: bufferedBytes >= highWaterMark, ratio };",
    eTest: lines(
      "if (typeof calculateStreamBackpressureState !== 'function') throw new Error('calculateStreamBackpressureState not found');",
      "const s1 = calculateStreamBackpressureState(16384, 16384);",
      "if (s1.shouldPause !== true || s1.ratio !== 1.0) throw new Error('Failed at highWaterMark: ' + JSON.stringify(s1));",
      "const s2 = calculateStreamBackpressureState(8192, 16384);",
      "if (s2.shouldPause !== false || s2.ratio !== 0.5) throw new Error('Failed below highWaterMark: ' + JSON.stringify(s2));",
      "const s3 = calculateStreamBackpressureState(24576, 16384);",
      "if (s3.shouldPause !== true || s3.ratio !== 1.5) throw new Error('Failed above highWaterMark: ' + JSON.stringify(s3));"
    ),
    aTitle: "Certify Stream Processing Pipeline SLA",
    aDesc: "Write \`certifyStreamPipelineSla(metrics: { peakMemoryBytes: number; maxAllowedMemoryBytes: number; droppedChunks: number; backpressurePauses: number }): { certified: boolean; grade: string }\` verifying peakMemoryBytes <= maxAllowedMemoryBytes, droppedChunks === 0, and backpressurePauses >= 1.",
    aLanguage: "typescript",
    aStarter: lines("function certifyStreamPipelineSla(metrics) {", "  // Return SLA certification", "  return { certified: false, grade: 'FAIL' };", "}"),
    aHint: "const pass = metrics.peakMemoryBytes <= metrics.maxAllowedMemoryBytes && metrics.droppedChunks === 0 && metrics.backpressurePauses >= 1; return { certified: pass, grade: pass ? 'A+' : 'FAIL' };",
    aTest: lines(
      "if (typeof certifyStreamPipelineSla !== 'function') throw new Error('certifyStreamPipelineSla not found');",
      "const cert1 = certifyStreamPipelineSla({ peakMemoryBytes: 32768, maxAllowedMemoryBytes: 65536, droppedChunks: 0, backpressurePauses: 2 });",
      "if (cert1.certified !== true || cert1.grade !== 'A+') throw new Error('Failed cert1 Grade A+: ' + JSON.stringify(cert1));",
      "const cert2 = certifyStreamPipelineSla({ peakMemoryBytes: 131072, maxAllowedMemoryBytes: 65536, droppedChunks: 0, backpressurePauses: 2 });",
      "if (cert2.certified !== false || cert2.grade !== 'FAIL') throw new Error('Failed cert2 memory limit: ' + JSON.stringify(cert2));"
    )
  },

  // ── DAY 52: Edge Security, TLS Offloading & Zero-Trust Identity ─────────────────
  {
    ...NODE_WEB_DAYS[51],
    eTitle: "Validate Client Certificate Expiration",
    eDesc: "Write \`validateCertificateValidity(notBefore: number, notAfter: number, currentMs: number): boolean\` returning true if currentMs is between notBefore and notAfter (inclusive).",
    eLanguage: "typescript",
    eStarter: lines("function validateCertificateValidity(notBefore, notAfter, currentMs) {", "  // Return whether certificate timestamp is valid", "  return false;", "}"),
    eHint: "return currentMs >= notBefore && currentMs <= notAfter;",
    eTest: lines(
      "if (typeof validateCertificateValidity !== 'function') throw new Error('validateCertificateValidity not found');",
      "if (validateCertificateValidity(1000, 2000, 1500) !== true) throw new Error('Failed valid timestamp check');",
      "if (validateCertificateValidity(1000, 2000, 500) !== false) throw new Error('Failed premature timestamp check');",
      "if (validateCertificateValidity(1000, 2000, 2500) !== false) throw new Error('Failed expired timestamp check');"
    ),
    aTitle: "Evaluate RBAC Scope Authorization",
    aDesc: "Write \`evaluateRbacAuthorization(userScopes: string[], requiredAction: string): boolean\` returning true if userScopes includes '*' or requiredAction, or a wildcard prefix matching requiredAction (e.g., 'orders:*' matches 'orders:read').",
    aLanguage: "typescript",
    aStarter: lines("function evaluateRbacAuthorization(userScopes, requiredAction) {", "  // Return whether user is authorized for action", "  return false;", "}"),
    aHint: "return userScopes.some(scope => scope === '*' || scope === requiredAction || (scope.endsWith(':*') && requiredAction.startsWith(scope.slice(0, -1))));",
    aTest: lines(
      "if (typeof evaluateRbacAuthorization !== 'function') throw new Error('evaluateRbacAuthorization not found');",
      "if (evaluateRbacAuthorization(['*'], 'payments:create') !== true) throw new Error('Failed global wildcard check');",
      "if (evaluateRbacAuthorization(['orders:*'], 'orders:read') !== true) throw new Error('Failed prefix wildcard check');",
      "if (evaluateRbacAuthorization(['orders:read'], 'orders:delete') !== false) throw new Error('Failed unauthorized action check');"
    )
  },

  // ── DAY 53: Full-Lifecycle Distributed Observability ───────────────────────────
  {
    ...NODE_WEB_DAYS[52],
    eTitle: "Parse W3C Traceparent Header",
    eDesc: "Write \`parseW3cTraceparent(header: string): { isValid: boolean; traceId: string | null; parentSpanId: string | null; sampled: boolean }\` parsing '00-{32hex}-{16hex}-{flags}'.",
    eLanguage: "typescript",
    eStarter: lines("function parseW3cTraceparent(header) {", "  // Parse W3C traceparent header", "  return { isValid: false, traceId: null, parentSpanId: null, sampled: false };", "}"),
    eHint: "const parts = header.split('-'); if (parts.length === 4 && parts[0] === '00' && parts[1].length === 32 && parts[2].length === 16) return { isValid: true, traceId: parts[1], parentSpanId: parts[2], sampled: parts[3] === '01' }; return { isValid: false, traceId: null, parentSpanId: null, sampled: false };",
    eTest: lines(
      "if (typeof parseW3cTraceparent !== 'function') throw new Error('parseW3cTraceparent not found');",
      "const t1 = parseW3cTraceparent('00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01');",
      "if (t1.isValid !== true || t1.traceId !== '4bf92f3577b34da6a3ce929d0e0e4736' || t1.sampled !== true) throw new Error('Failed valid traceparent parse: ' + JSON.stringify(t1));",
      "const t2 = parseW3cTraceparent('invalid-header-format');",
      "if (t2.isValid !== false) throw new Error('Failed invalid traceparent rejection');"
    ),
    aTitle: "Place Histogram Observation in Discrete Buckets",
    aDesc: "Write \`placeHistogramObservation(durationMs: number, buckets: number[]): number[]\` returning array of upper bounds (le) that durationMs is less than or equal to.",
    aLanguage: "typescript",
    aStarter: lines("function placeHistogramObservation(durationMs, buckets) {", "  // Return matching bucket bounds", "  return [];", "}"),
    aHint: "return buckets.filter(b => durationMs <= b);",
    aTest: lines(
      "if (typeof placeHistogramObservation !== 'function') throw new Error('placeHistogramObservation not found');",
      "const b1 = placeHistogramObservation(42, [10, 25, 50, 100, 250, 500]);",
      "if (b1.length !== 4 || b1[0] !== 50 || b1[1] !== 100) throw new Error('Failed bucket placement 42ms: ' + JSON.stringify(b1));",
      "const b2 = placeHistogramObservation(5, [10, 25, 50]);",
      "if (b2.length !== 3) throw new Error('Failed bucket placement 5ms');"
    )
  },

  // ── DAY 54: Dynamic Reverse Proxying & WebSocket Multiplexing ──────────────────
  {
    ...NODE_WEB_DAYS[53],
    eTitle: "Translate gRPC Status to HTTP Status",
    eDesc: "Write \`translateGrpcStatus(grpcCode: number): number\` mapping 0 -> 200, 3 -> 400, 5 -> 404, 7 -> 403, 14 -> 503, default -> 500.",
    eLanguage: "typescript",
    eStarter: lines("function translateGrpcStatus(grpcCode) {", "  // Return mapped HTTP status code", "  return 500;", "}"),
    eHint: "const map = { 0: 200, 3: 400, 5: 404, 7: 403, 14: 503 }; return map[grpcCode] || 500;",
    eTest: lines(
      "if (typeof translateGrpcStatus !== 'function') throw new Error('translateGrpcStatus not found');",
      "if (translateGrpcStatus(0) !== 200) throw new Error('0 should map to 200');",
      "if (translateGrpcStatus(3) !== 400) throw new Error('3 should map to 400');",
      "if (translateGrpcStatus(5) !== 404) throw new Error('5 should map to 404');",
      "if (translateGrpcStatus(14) !== 503) throw new Error('14 should map to 503');",
      "if (translateGrpcStatus(99) !== 500) throw new Error('99 should default to 500');"
    ),
    aTitle: "Select Least-Connections Upstream Node",
    aDesc: "Write \`selectLeastConnectionsNode(nodes: Array<{ id: string; activeConnections: number; state: string }>): string | null\` selecting healthy node (state !== 'OPEN') with lowest activeConnections.",
    aLanguage: "typescript",
    aStarter: lines("function selectLeastConnectionsNode(nodes) {", "  // Return selected node ID", "  return null;", "}"),
    aHint: "const healthy = nodes.filter(n => n.state !== 'OPEN'); if (healthy.length === 0) return null; healthy.sort((a, b) => a.activeConnections - b.activeConnections); return healthy[0].id;",
    aTest: lines(
      "if (typeof selectLeastConnectionsNode !== 'function') throw new Error('selectLeastConnectionsNode not found');",
      "const n1 = selectLeastConnectionsNode([",
      "  { id: 'node_a', activeConnections: 5, state: 'CLOSED' },",
      "  { id: 'node_b', activeConnections: 2, state: 'CLOSED' },",
      "  { id: 'node_c', activeConnections: 1, state: 'OPEN' }",
      "]);",
      "if (n1 !== 'node_b') throw new Error('Failed least-connections selection (node_c is OPEN): ' + n1);",
      "const n2 = selectLeastConnectionsNode([{ id: 'node_x', activeConnections: 0, state: 'OPEN' }]);",
      "if (n2 !== null) throw new Error('Should return null if all nodes OPEN');"
    )
  },

  // ── DAY 55: Milestone 10 (Core): High-Throughput Edge Routing & Policy Engine ───
  {
    ...NODE_WEB_DAYS[54],
    eTitle: "Calculate Adaptive Token Bucket Refill",
    eDesc: "Write \`calculateAdaptiveTokenRefill(currentTokens: number, capacity: number, elapsedSec: number, refillRatePerSec: number, upstreamLatencyMs: number): number\` where refill rate is halved if upstreamLatencyMs > 200, capped at capacity.",
    eLanguage: "typescript",
    eStarter: lines("function calculateAdaptiveTokenRefill(currentTokens, capacity, elapsedSec, refillRatePerSec, upstreamLatencyMs) {", "  // Return updated token count", "  return 0;", "}"),
    eHint: "const effectiveRefill = upstreamLatencyMs > 200 ? refillRatePerSec * 0.5 : refillRatePerSec; return Number(Math.min(capacity, currentTokens + elapsedSec * effectiveRefill).toFixed(2));",
    eTest: lines(
      "if (typeof calculateAdaptiveTokenRefill !== 'function') throw new Error('calculateAdaptiveTokenRefill not found');",
      "const tok1 = calculateAdaptiveTokenRefill(10, 50, 2, 5, 50);",
      "if (tok1 !== 20.0) throw new Error('Failed normal refill: ' + tok1);",
      "const tok2 = calculateAdaptiveTokenRefill(10, 50, 2, 5, 250);",
      "if (tok2 !== 15.0) throw new Error('Failed throttled refill under latency backpressure: ' + tok2);",
      "const tok3 = calculateAdaptiveTokenRefill(48, 50, 2, 5, 50);",
      "if (tok3 !== 50.0) throw new Error('Failed capacity cap: ' + tok3);"
    ),
    aTitle: "Certify Milestone 10 Capstone Edge Gateway SLA",
    aDesc: "Write \`certifyMilestone10Capstone(results: { routePassed: boolean; securityPassed: boolean; rateLimitPassed: boolean; grpcPassed: boolean; circuitBreakerPassed: boolean; otelPassed: boolean; gatewayLatencyMs: number }): { certified: boolean; grade: string }\` requiring all flags true and gatewayLatencyMs < 1.0.",
    aLanguage: "typescript",
    aStarter: lines("function certifyMilestone10Capstone(results) {", "  // Return Milestone 10 certification", "  return { certified: false, grade: 'FAIL' };", "}"),
    aHint: "const pass = results.routePassed && results.securityPassed && results.rateLimitPassed && results.grpcPassed && results.circuitBreakerPassed && results.otelPassed && results.gatewayLatencyMs < 1.0; return { certified: pass, grade: pass ? 'A+' : 'FAIL' };",
    aTest: lines(
      "if (typeof certifyMilestone10Capstone !== 'function') throw new Error('certifyMilestone10Capstone not found');",
      "const c1 = certifyMilestone10Capstone({",
      "  routePassed: true, securityPassed: true, rateLimitPassed: true, grpcPassed: true, circuitBreakerPassed: true, otelPassed: true, gatewayLatencyMs: 0.42",
      "});",
      "if (c1.certified !== true || c1.grade !== 'A+') throw new Error('Failed c1 Grade A+: ' + JSON.stringify(c1));",
      "const c2 = certifyMilestone10Capstone({",
      "  routePassed: true, securityPassed: true, rateLimitPassed: true, grpcPassed: true, circuitBreakerPassed: true, otelPassed: true, gatewayLatencyMs: 1.5",
      "});",
      "if (c2.certified !== false || c2.grade !== 'FAIL') throw new Error('Failed c2 gatewayLatencyMs limit: ' + JSON.stringify(c2));"
    )
  }
`;

thirtyContent = beforeConfigs + ',\n' + block11Configs + afterConfigs;
fs.writeFileSync('src/lib/data/nodeWeb30DayData.ts', thirtyContent, 'utf-8');
console.log('Updated src/lib/data/nodeWeb30DayData.ts successfully!');

// 3. Update src/lib/data/nodeWebLongLessons.ts
console.log('\n--- 3. Updating src/lib/data/nodeWebLongLessons.ts ---');
let longContent = fs.readFileSync('src/lib/data/nodeWebLongLessons.ts', 'utf-8');
const longLastBracket = longContent.lastIndexOf('];');
if (longLastBracket === -1) throw new Error("Could not find '];' in nodeWebLongLessons.ts");

const beforeLongClose = longContent.slice(0, longLastBracket).trimEnd();

const newLessons = [];
for (const day of [51, 52, 53, 54, 55]) {
  const lessonData = JSON.parse(fs.readFileSync(`scripts/node_day${day}.json`, 'utf-8'));
  newLessons.push(JSON.stringify(lessonData, null, 2));
}

const lessonsJoined = ',\n' + newLessons.join(',\n') + '\n];\n';
longContent = beforeLongClose + lessonsJoined;
fs.writeFileSync('src/lib/data/nodeWebLongLessons.ts', longContent, 'utf-8');
console.log('Updated src/lib/data/nodeWebLongLessons.ts successfully with Days 51-55!');
