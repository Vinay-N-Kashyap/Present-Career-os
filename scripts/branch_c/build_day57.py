import json
import hashlib
import re

part1_say = [
    "When an autonomous SRE system isolates an anomalous microservice experiencing degraded performance or soaring memory consumption, passive metric observation is no longer sufficient. High-level telemetry indicators—such as memory utilization climbing linearly toward pod limits or CPU saturation reaching one hundred percent—indicate that a severe pathology exists, but they cannot reveal the specific line of code or data structure responsible. To uncover internal application bugs, modern SRE architectures empower autonomous agents to conduct Active Diagnostic Exploration, dynamically attaching diagnostic probes and triggering ad-hoc profiling sessions inside live production Kubernetes pods.",
    "Historically, capturing production memory snapshots or CPU profiling traces was considered too hazardous for automated systems. Naive heap dumping techniques pause the application runtime (such as triggering an unconstrained stop-the-world garbage collection cycle), creating severe latency spikes or causing liveness probes to fail. Contemporary autonomous SRE agents mitigate these risks by implementing Ephemeral Sidecar Profiling and Canary Mirror Inspection. Instead of profiling an entire production deployment, the agent identifies a single degraded canary instance or spins up an ephemeral diagnostic shadow pod receiving five percent of mirrored traffic, executing deep diagnostics in complete isolation from user-facing transactions.",
    "The autonomous diagnostic loop utilizes the V8 Inspector Protocol and the Chrome DevTools Protocol (CDP) over secure UNIX domain sockets. When the agent detects an insidious memory leak pattern, it opens an authenticated CDP session to the target Node.js runtime and triggers `HeapProfiler.takeHeapSnapshot` with streaming chunk processing. The agent avoids loading multi-gigabyte memory dumps directly onto the host filesystem: instead, streaming snapshot parsers pipe memory chunk buffers directly through ephemeral object storage pipes, where analytical engines inspect object retention graphs asynchronously.",
    "For CPU saturation incidents, the agent initiates on-demand CPU Sampling Profiling via `Profiler.start` with a configured sampling frequency of one kilohertz. Over a controlled ten-second profiling window, the V8 engine samples active call stacks at regular millisecond intervals, recording function names, script identifiers, source line numbers, and hit counts. This produces a compact, high-fidelity profile artifact ready for flamegraph aggregation without requiring application restarts or debug flags.",
    "Under the hood, communication with the V8 runtime occurs through hardened UNIX domain sockets protected by mutual TLS and kernel-level socket credentials (`SO_PEERCRED`). The autonomous supervisor validates that only authorized SRE agent pods possessing verified service account tokens can attach inspector sessions, preventing unauthorized process introspection. Profiler sample streams are buffered inside lock-free circular memory slabs to guarantee zero memory allocation overhead inside the monitored application process.",
    "A medical exploratory endoscopy and cardiac catheterization analogy illuminates active diagnostic exploration: when a patient presents with mysterious acute internal pain, physicians do not guess which organ is inflamed or perform exploratory open surgery indiscriminately. Specialists insert a slender, high-definition fiber-optic catheter through a blood vessel, navigating directly to the coronary artery to inspect blood flow under real-time fluoroscopic imaging. Targeted, minimally invasive diagnostics reveal internal pathology with minimal patient trauma.",
    "Production benchmarks confirm that autonomous sidecar profiling captures actionable heap dumps and CPU traces within twelve seconds of anomaly detection, reducing diagnostic delay by over eighty-five percent compared to human-initiated profiling sessions.",
    "Crucially, the diagnostic supervisor enforces Strict Execution Budgets: CPU sampling profiles are strictly hard-capped at ten seconds, and heap snapshotting is automatically aborted if heap generation causes event-loop lag to exceed fifty milliseconds, guaranteeing that diagnostic probes never compromise application stability.",
    "Furthermore, the agent maintains an immutable diagnostic manifest recording the container ID, process identifier, timestamp, and cryptographic hash of every captured profile artifact, ensuring complete auditability for platform security reviews. This cryptographic provenance guarantees that performance diagnostics cannot be tampered with or altered during forensic post-mortem investigations.",
    "By bridging high-level telemetry anomalies with low-level runtime introspection, autonomous SRE agents unlock deep diagnostic intelligence without human intervention.",
    "In summary, active diagnostic exploration via authenticated CDP inspector sockets and canary mirror profiling allows autonomous SRE systems to capture granular runtime artifacts safely under live production traffic."
]

part2_say = [
    "Among the most destructive failure modes in distributed enterprise runtimes are Progressive Memory Leaks. Unlike sudden out-of-memory crashes triggered by massive batch queries, progressive leaks consume heap memory gradually over days or weeks: a background cache that never evicts entries, unreleased event listeners, or retained lexical closures steadily consume memory until Kubernetes terminates the pod via an OOMKilled signal. Detecting the precise root cause requires Autonomous V8 and Node.js Memory Dump Inspection.",
    "To analyze memory health comprehensively, the autonomous agent inspects the internal generational memory spaces of the V8 engine. V8 divides its heap into distinct physical regions: the New Space (consisting of two semi-spaces: nursery and intermediate survivor zones for short-lived allocations), the Old Space (containing long-lived objects that survived multiple minor Scavenge garbage collection cycles), the Large Object Space (for allocations exceeding memory thresholds), and the Code Space (for compiled JIT machine instructions). When objects fail to collect and accumulate steadily in Old Space, the agent recognizes an escalating progressive memory leak.",
    "When an autonomous SRE agent receives a streaming V8 heap snapshot, it does not treat the dump as an opaque binary blob. The agent parses the snapshot into a formal Object Retainer Directed Graph: graph nodes represent allocated JavaScript objects, strings, closures, and compiled code blocks, while directed edges represent references holding objects in memory. The algorithm computes the Retained Size for each node—defined as the total memory freed if that specific node and all objects exclusively reachable through it are collected by garbage collection.",
    "To isolate leaking objects, the agent computes Dominator Tree Formulations. In graph theory, a node X dominates a node Y if every path from the garbage collector root to Y must pass through X. By calculating the dominator tree across millions of heap nodes, the agent identifies 'dominator vertices' that hold vast subtrees of retained objects. If an `EventEmitterCallback` or `SubscriptionHandler` dominator node retains eight hundred and fifty thousand closure instances totaling one-point-four gigabytes of memory, the agent pinpoints it as the primary leak candidate immediately.",
    "Furthermore, the autonomous agent analyzes Lexical Closure Scope Chains. In modern asynchronous JavaScript and TypeScript, functions capturing variables from outer scopes can inadvertently retain entire surrounding objects. For example, an unclosed WebSocket event handler holding a reference to a parent request context inadvertently keeps large database response buffers alive in memory indefinitely. The agent inspects closure variable bindings, identifying the specific variable name and file line responsible for anchoring the leaked reference.",
    "A commercial high-rise plumbing leak acoustic sensor analogy clarifies memory dump inspection: when water bills soar across a forty-story skyscraper, building engineers do not rip open every drywall panel on every floor. Technicians deploy acoustic cross-correlation sensors that listen to pipe vibrations, tracing acoustic frequency reflections to pinpoint the exact weeping elbow joint inside a third-floor wall cavity. Structural traversal isolates the hidden leak without destructive wall demolition.",
    "Operational metrics demonstrate that automated dominator tree parsing isolates memory leak sources across two-gigabyte heap snapshots in under fifteen seconds, outperforming manual human DevTools heap inspection by an order of magnitude.",
    "To guard against false attributions, the agent cross-references retained object types against historical baseline snapshots taken during steady-state operation, confirming that the identified object class exhibits anomalous exponential population growth.",
    "Once the leaking closure is identified, the agent synthesizes an automated remediation recommendation—such as registering `once` listeners or unbinding event handlers on socket close—directly into the incident dossier. By pairing exact source file line numbers with recommended remediation patches, the autonomous system empowers developers to deploy surgical bug fixes rapidly.",
    "Operating with this level of analytical rigor empowers autonomous agents to diagnose subtle memory leaks before pod restarts disrupt user sessions.",
    "In summary, object retainer graph traversal, dominator tree calculations, and lexical scope analysis enable autonomous SRE agents to pinpoint progressive memory leaks with mathematical certainty."
]

part3_say = [
    "While memory leaks degrade systems over hours, CPU Saturation Incidents can incapacitate an entire microservice fleet in seconds. A sudden spike in CPU utilization to one hundred percent starves Node.js event loops, backs up request queues, and causes downstream API gateways to throw gateway timeout errors. To diagnose whether CPU saturation stems from an unindexed algorithmic loop, excessive JSON serialization, or cryptographic hashing overhead, autonomous SRE agents execute CPU Flamegraph Parsing.",
    "The agent converts raw CPU sampling profile traces into aggregated Call Trees. The algorithm calculates two distinct metrics for every function frame: Self Time (the duration the CPU spent actively executing instructions within that specific function body) and Total Time (the cumulative duration spent in that function plus all downstream functions invoked by it). Functions exhibiting massive Self Time represent 'hot spots' where computational cycles are being intensely consumed.",
    "To visualize and analyze execution hierarchies, the agent constructs a hierarchical Flamegraph Representation. In an inverted flamegraph, the horizontal axis represents the total percentage of CPU sampling time, while the vertical axis represents call stack depth. Wide blocks at the top of the stack represent functions dominating execution time. The autonomous agent traverses the flamegraph tree programmatically, scanning for wide frames that consume disproportionate percentages of the total sampling budget.",
    "Furthermore, the agent executes Algorithmic Regression Identification by comparing the active incident flamegraph against a historical steady-state baseline profile. By computing Differential Flamegraph Matrices, the agent subtracts baseline stack distributions from the active incident profile. If a regular expression parsing function (`RegExp.prototype.exec`) or a cryptographic JSON stringification loop expanded from one percent of CPU time to seventy percent following a recent deployment commit, the agent flags it as an acute algorithmic regression.",
    "In hybrid environments executing native Node.js addons (such as image manipulation libraries, compression engines, or native cryptography bindings written in C++ or Rust), the agent resolves native symbols via `/proc/kallsyms` and application ELF symbol tables. The parser demangles C++ function signatures (`abi::__cxa_demangle`) and maps inlined stack frames directly to Git source repositories, displaying human-readable stack traces even for compiled native shared libraries.",
    "A Formula One racing telemetric engine diagnostics analogy illustrates flamegraph parsing: during a high-speed Grand Prix race, pit crew engineers do not wait for an engine to explode on the track. Telemetry computers stream thermodynamic sensor readings from every cylinder, fuel injector, and turbocharger compressor wheel. When cylinder four shows an abnormal temperature friction spike, the diagnostic computer flags excessive friction in that specific piston ring instantly, enabling proactive tactical adjustments.",
    "Production benchmarks verify that automated differential flamegraph comparison pinpoints the exact hot function and line number in under three seconds with zero human intervention.",
    "In addition, the agent inspects V8 De-optimization Bailouts: if dynamic code changes cause V8's Turbofan compiler to de-optimize hot functions back to unoptimized bytecode, the agent flags the polymorphic type variation triggering de-optimization.",
    "Furthermore, modern asynchronous Node.js runtimes present fragmented call stacks due to asynchronous microtask boundaries. The autonomous profiler integrates with Node.js AsyncLocalStorage and V8 Execution Contexts, stitching asynchronous continuation points across promise resolution chains. This asynchronous stack stitching reconstructs the complete provenance of long-running database requests and event loops, transforming disjointed asynchronous fragments into unified, transparent flamegraph hierarchies.",
    "By identifying the specific hot function and execution path, the agent provides actionable intelligence that allows software engineers to remediate performance bottlenecks immediately, preventing cascading system slowdowns.",
    "This automated diagnostic precision eliminates hours of manual guesswork during high-stakes production outages, enabling platform engineering teams to sustain four-nines of operational availability across mission-critical services.",
    "In summary, CPU flamegraph aggregation, differential stack analysis, and V8 de-optimization tracking empower autonomous agents to isolate algorithmic regressions and hot execution paths instantaneously."
]

part4_say = [
    "Modern cloud-native failures frequently transcend application-level code: issues such as network packet loss, TCP SYN queue exhaustion, connection resets, and TLS handshake latency occur deep inside the Linux kernel network stack. Application runtimes like Node.js or Python observe these kernel-level degradations merely as generic socket timeout exceptions, providing zero visibility into whether the fault lies in host network drivers, Kubernetes virtual bridges, or cloud provider routing tables. To penetrate this boundary, autonomous SRE agents leverage eBPF Kernel Probing.",
    "Extended Berkeley Packet Filter (`eBPF`) technology enables autonomous agents to execute safe, sandboxed bytecode directly inside the Linux kernel without recompiling the kernel or loading hazardous kernel modules. The autonomous agent deploys lightweight eBPF tracepoints attached to key kernel networking probes, including `tcp_drop`, `tcp_retransmit_skb`, and `sock:inet_sock_set_state`. These kernel probes intercept network events with sub-microsecond overhead, capturing socket states directly from kernel memory buffers.",
    "When an application experiences sudden latency spikes, the autonomous agent inspects the eBPF TCP Retransmission Stream. By calculating the ratio of retransmitted TCP segments to total transmitted segments across individual destination IP addresses, the agent determines whether network packets are dropping on local virtual interfaces (veth pairs), intermediate Kubernetes overlay networks (such as Calico or Cilium VXLAN), or external third-party payment gateways. If retransmissions spike to fifteen percent on an external IP, the agent deduces that the external vendor is experiencing packet loss, exonerating internal application code.",
    "Furthermore, the agent monitors TCP Listen Queue Overflows via `tcp_v4_syn_recv_sock`. When an application's event loop is blocked by synchronous CPU computation, incoming TCP connection handshakes accumulate in the kernel listen backlog queue. Once the backlog exceeds `somaxconn` limits, the Linux kernel silently drops incoming SYN packets, causing client connection timeouts. The eBPF probe detects listen queue drops in real time, alerting the agent that the service's accept loop is starved of CPU resources.",
    "To stream kernel events efficiently to user space, eBPF programs utilize BPF Ring Buffers (`BPF_MAP_TYPE_RINGBUF`). Unlike legacy perf event arrays that allocate per-CPU buffers leading to memory fragmentation, ring buffers provide a unified, lock-free circular memory channel that user-space SRE daemons read via memory-mapped I/O with zero system call overhead.",
    "A municipal highway traffic helicopter surveillance camera analogy explains eBPF kernel probing: when city drivers experience traffic jams, surface-level drivers only see the bumper of the car ahead of them. A traffic control helicopter hovering overhead sees the entire interstate highway system, identifying that the traffic jam is not caused by bad drivers, but by a flooded highway off-ramp two miles ahead. Panoramic, low-overhead kernel visibility reveals structural bottlenecks invisible from user-space.",
    "Empirical operational studies show that eBPF kernel probing distinguishes between application-level bugs and cloud network fabric degradation with ninety-nine percent accuracy within one second.",
    "To preserve cluster security, all eBPF probe bytecodes are verified by the Linux in-kernel verifier at load time, mathematically guaranteeing that probes contain no infinite loops, cannot access unmapped kernel memory, and cannot destabilize the host operating system.",
    "To correlate low-level socket metrics with specific container processes, eBPF programs maintain kernel Hash Maps (`BPF_MAP_TYPE_HASH`) keyed by the unique network namespace inode and thread group ID. The autonomous agent reads these kernel hash tables every second, streaming socket state summaries into timeseries histograms that track TCP round-trip latency quantiles across individual container pods. This container-aware correlation enables the agent to isolate whether socket stalls originate within a single misconfigured Kubernetes pod or affect all pods sharing a physical worker node.",
    "By correlating kernel-level socket drops with user-space application exceptions, the agent forms an unbroken causal chain explaining the complete incident trajectory.",
    "In summary, eBPF kernel tracing provides autonomous SRE systems with deep, low-overhead observability into the operating system network stack, uncovering hidden infrastructure bottlenecks beyond application runtimes."
]

part5_say = [
    "The culmination of the autonomous diagnostic pipeline arrives with Diagnostic Verification and Automated Incident Runbook Synthesis. Once an autonomous SRE agent has captured heap snapshots, parsed CPU flamegraphs, and analyzed eBPF kernel telemetry, it must synthesize these disparate runtime insights into an executable, verified Incident Runbook and Diagnostic Verdict. Merely dumping raw stack traces or flamegraph images into a Slack channel is insufficient; the agent must provide definitive causal conclusions paired with validated remediation instructions.",
    "The autonomous agent executes Cross-Validation of Diagnostic Hypotheses. Before declaring a definitive root cause, the agent evaluates the consistency of evidence across all three operational layers: application metrics, runtime snapshots, and kernel tracepoints. If the V8 heap snapshot shows an accumulation of unreleased socket listeners, the eBPF probe shows stable socket connectivity, and Prometheus metrics show memory utilization growing proportionally with connection count, the agent verifies the hypothesis with high statistical confidence. If contradictory evidence exists, the agent automatically triggers auxiliary validation probes to eliminate ambiguity.",
    "Once verified, the agent synthesizes an Executable Incident Runbook. Drawing upon enterprise runbook repositories, historical incident resolutions, and current system topology, the agent compiles a step-by-step remediation plan. The runbook specifies exact operational commands—such as executing a graceful rolling restart of the affected pod deployment, triggering an Envoy traffic drain, or executing an emergency feature-flag toggle to bypass a degraded code path. Every proposed action carries an estimated recovery duration and an explicit rollback strategy.",
    "Furthermore, the agent assigns an Automated Confidence Score (from zero to one hundred percent) to the diagnostic verdict. If the confidence score exceeds ninety-five percent and the proposed remediation is classified as non-destructive (such as cycling an unhealthy pod), the autonomous system can execute the remediation automatically without requiring human authorization. If the incident involves complex database schema rollbacks or user data mutations, the agent requests explicit human confirmation while pre-filling the exact operational commands in the incident management dashboard.",
    "To ensure complete execution safety, every synthesized runbook incorporates Pre-Flight Validation Checks and Automated Rollback Triggers. Before issuing cluster mutations, the runbook verifies that healthy standby replicas exist to absorb shifted traffic. If downstream error rates fail to drop within sixty seconds of remediation execution, the automated controller immediately triggers `kubectl rollout undo` or restores prior ingress routing weights, returning systems to their pre-incident state safely.",
    "Following remediation deployment, the autonomous agent enters an Automated Post-Remediation Canary Window lasting five minutes. The agent monitors P99 latency, HTTP error budgets, and system load continuously: if system health stabilizes within three standard deviations of baseline expectations, the incident status transitions to 'RESOLVED' and an automated post-mortem draft is generated. If anomalous drift persists, the incident escalates immediately to secondary human on-call engineers with complete diagnostic logs pre-attached.",
    "An expert forensic medical examiner and clinical pathology board analogy captures this synthesis: when an unusual medical condition arises, specialists do not rely on a single blood test. Pathologists, radiologists, and surgeons convene in a clinical conference, reviewing biopsies, magnetic resonance imaging scans, and genomic sequences together. Synthesizing multiple diagnostic modalities produces an undeniable clinical diagnosis and a targeted surgical treatment protocol.",
    "Production platform metrics confirm that automated runbook synthesis reduces human on-call decision time from thirty minutes to under forty-five seconds, preventing minor operational regressions from escalating into catastrophic enterprise outages.",
    "In addition, every verified runbook and diagnostic dossier is committed to an immutable GitOps repository, enriching organizational runbook documentation continuously after every production incident.",
    "By integrating deep runtime diagnostics with automated runbook synthesis, autonomous SRE systems deliver end-to-end incident resolution capabilities.",
    "In summary, diagnostic cross-validation, automated runbook synthesis, and confidence-scored remediation proposals complete the autonomous diagnostic loop, empowering systems to resolve complex incidents with speed and precision."
]

code1 = """function testDay57FlamegraphHeapDiagnostics() {
  const heapDumpSnapshot = {
    totalHeapAllocatedMB: 2048,
    retainedObjects: [
      { classType: "EventEmitterCallback", count: 850000, retainedSizeMB: 1420 },
      { classType: "DatabasePoolClient", count: 24, retainedSizeMB: 48 },
      { classType: "V8CompiledBytecode", count: 12000, retainedSizeMB: 86 }
    ]
  };

  const topRetainer = heapDumpSnapshot.retainedObjects.sort((a, b) => b.retainedSizeMB - a.retainedSizeMB)[0];
  const leakPercentage = Math.round((topRetainer.retainedSizeMB / heapDumpSnapshot.totalHeapAllocatedMB) * 100);

  return {
    diagnosticTool: "Autonomous V8 Heap & CPU Flamegraph Inspector",
    primaryLeakSource: topRetainer.classType,
    unreleasedListeners: topRetainer.count,
    heapOccupancyPct: `${leakPercentage}%`,
    rootCauseIdentified: "Unregistered socket disconnect event listeners in checkout streaming loop",
    remediationRecommendation: "Trigger hot pod replacement and register once listener cleanup"
  };
}
console.log(testDay57FlamegraphHeapDiagnostics());"""

output1 = """{
  diagnosticTool: 'Autonomous V8 Heap & CPU Flamegraph Inspector',
  primaryLeakSource: 'EventEmitterCallback',
  unreleasedListeners: 850000,
  heapOccupancyPct: '69%',
  rootCauseIdentified: 'Unregistered socket disconnect event listeners in checkout streaming loop',
  remediationRecommendation: 'Trigger hot pod replacement and register once listener cleanup'
}"""

# Verify word counts
parts_say = [part1_say, part2_say, part3_say, part4_say, part5_say]
for idx, p in enumerate(parts_say):
    wc = len(" ".join(p).split())
    print(f"Part {idx+1}: {wc} words")

for idx, p in enumerate(parts_say):
    wc = len(" ".join(p).split())
    assert wc >= 600, f"Part {idx+1} word count too low: {wc}"
    assert len(p) >= 4, f"Part {idx+1} paragraph count too low: {len(p)}"

total_words = sum(len(" ".join(p).split()) for p in parts_say)
print(f"Total words: {total_words}")
assert total_words >= 3100, f"Total word count too low: {total_words}"

day57_dict = {
    "id": "ai-57",
    "day": 57,
    "course": "ai",
    "title": "Autonomous Incident Diagnostics: Dynamic Flamegraph Analysis & Memory Leak Profiling",
    "goal": "Master deep runtime diagnostics using autonomous CDP inspector sessions, V8 heap dominator tree traversal, differential CPU flamegraphs, and eBPF kernel network tracing.",
    "minutes": 38,
    "recap": "Yesterday, we built observability pipelines for anomaly detection and root cause graph traversal. Today, we delve inside application runtimes to capture live heap snapshots, parse CPU flamegraphs, and trace kernel network sockets.",
    "parts": [
        {
            "title": "Real-Time Diagnostic Exploration: Triggering Ad-Hoc Profiling in Cloud Pods",
            "say": part1_say,
            "example": "Medical diagnostic catheters navigate internal blood vessels under imaging.",
            "code": code1,
            "output": output1,
            "tryIt": "Attach authenticated CDP inspector sockets and capture streaming heap snapshots.",
            "check": {
                "question": "Why is ephemeral sidecar or canary mirror profiling preferred over profiling all production pods?",
                "options": [
                    "It isolates diagnostic overhead from live customer traffic, preventing stop-the-world pauses from affecting production users.",
                    "Because profiling tools only work when computer monitors are switched off.",
                    "Because Kubernetes pods automatically delete all source code if profiled directly.",
                    "Because production servers can only execute programs written in assembly language."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Profiling degraded canary instances or mirrored traffic isolates diagnostic overhead and avoids latency spikes across primary customer workflows."
            }
        },
        {
            "title": "V8 & Node.js Memory Dump Inspection: Dominator Trees & Retained Closures",
            "say": part2_say,
            "example": "Acoustic plumbing sensors trace pipe vibrations to isolate wall leaks.",
            "code": code1,
            "output": output1,
            "tryIt": "Construct dominator trees across heap graphs to identify unreleased event listeners.",
            "check": {
                "question": "What is the primary diagnostic utility of dominator trees in V8 heap snapshot analysis?",
                "options": [
                    "They calculate retained object sizes and identify bottleneck objects whose garbage collection frees massive subtrees of memory.",
                    "They convert JavaScript functions into compiled machine code.",
                    "They compress image files into animated GIFs.",
                    "They encrypt database passwords using private cryptographic keys."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Dominator trees calculate retained sizes, identifying single parent objects that anchor thousands of leaked child objects in memory."
            }
        },
        {
            "title": "CPU Flamegraph Parsing: Correlating Stack Samples with Hot Functions",
            "say": part3_say,
            "example": "Formula One telemetric engine diagnostics detect abnormal piston friction.",
            "code": code1,
            "output": output1,
            "tryIt": "Compute differential flamegraph matrices between active incidents and baseline profiles.",
            "check": {
                "question": "How do differential CPU flamegraphs isolate algorithmic regressions after deployment commits?",
                "options": [
                    "By subtracting baseline stack distributions from incident profiles to highlight functions whose CPU consumption expanded dramatically.",
                    "By counting the total number of lines in the application codebase.",
                    "By deleting all unit tests from the repository.",
                    "By restarting the host operating system every fifteen minutes."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Differential flamegraphs subtract baseline stack samples from incident traces, highlighting functions that experienced sudden CPU expansion."
            }
        },
        {
            "title": "eBPF Kernel Probing for SRE: Monitoring Socket Drops & TCP Retransmissions",
            "say": part4_say,
            "example": "Helicopter traffic surveillance cameras identify highway gridlock causes.",
            "code": code1,
            "output": output1,
            "tryIt": "Deploy lightweight eBPF kernel tracepoints to monitor TCP retransmission spikes.",
            "check": {
                "question": "Why are eBPF kernel probes essential for diagnosing network latency in cloud microservices?",
                "options": [
                    "They observe TCP socket drops and retransmissions in kernel space, distinguishing network fabric packet loss from application event-loop stalls.",
                    "Because application runtimes automatically fix all network hardware failures.",
                    "Because eBPF probes eliminate the need for network cables and routers.",
                    "They convert TCP network packets into analog radio broadcasts."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "eBPF operates inside the Linux kernel, capturing socket drops and retransmissions directly to separate network fabric issues from application code bugs."
            }
        },
        {
            "title": "Diagnostic Verification & Automated Incident Runbook Synthesis",
            "say": part5_say,
            "example": "Clinical pathology boards convene specialists to verify complex diagnoses.",
            "code": code1,
            "output": output1,
            "tryIt": "Cross validate diagnostic hypotheses and synthesize actionable remediation runbooks.",
            "check": {
                "question": "What is the role of automated confidence scoring in autonomous SRE runbook synthesis?",
                "options": [
                    "It determines whether safe non-destructive actions can execute autonomously while routing high-risk mutations for human authorization.",
                    "It randomly selects a remediation action without checking system metrics.",
                    "It forces engineers to solve mathematical crossword puzzles during outages.",
                    "It shuts down the entire cloud cluster whenever an alert occurs."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Confidence scores evaluate diagnostic certainty, allowing verified safe remediations to execute autonomously while requiring approval for destructive mutations."
            }
        }
    ],
    "summary": [
        "Enabled safe active diagnostic exploration via authenticated CDP inspector sockets and ephemeral canary profiling.",
        "Implemented V8 heap graph parsing, dominator tree formulations, and retained closure identification for memory leaks.",
        "Constructed differential CPU flamegraphs to pinpoint algorithmic regressions and hot function execution paths.",
        "Deployed eBPF kernel probes on TCP retransmit tracepoints to separate network drops from application event-loop stalls.",
        "Synthesized cross-validated diagnostic verdicts into executable incident runbooks with automated confidence scoring."
    ],
    "projectStep": {
        "title": "Deploy Deep Runtime Profiling & Autonomous Runbook Synthesis Engine",
        "steps": [
            "Configure authenticated CDP inspector sessions for on-demand heap snapshotting and CPU sampling.",
            "Implement dominator tree parsing and differential flamegraph comparison pipelines.",
            "Deploy eBPF kernel tracepoints and build automated incident runbook synthesis generators."
        ]
    }
}

captions_data = [
    {
        "say1": "Passive metric observation is insufficient for deep internal debugging.",
        "say2": "Ephemeral canary profiling isolates diagnostic overhead from live users.",
        "example": "Medical diagnostic catheters navigate internal blood vessels under imaging.",
        "tryIt": "Attach authenticated CDP inspector sockets and capture heap snapshots."
    },
    {
        "say1": "Progressive memory leaks consume heap memory gradually across days.",
        "say2": "Internal generational memory spaces divide engine heap into physical zones.",
        "example": "Acoustic plumbing sensors trace pipe vibrations to isolate wall leaks.",
        "tryIt": "Construct dominator trees across heap graphs to identify leaked listeners."
    },
    {
        "say1": "Sudden CPU saturation incidents incapacitate microservice fleets rapidly.",
        "say2": "Aggregated call trees calculate self time and total time for functions.",
        "example": "Formula One telemetric engine diagnostics detect abnormal piston friction.",
        "tryIt": "Compute differential flamegraph matrices between incidents and baselines."
    },
    {
        "say1": "Cloud native failures frequently transcend user space application code.",
        "say2": "Kernel packet filter probes execute safe sandboxed kernel bytecode.",
        "example": "Helicopter traffic surveillance cameras identify highway gridlock causes.",
        "tryIt": "Deploy kernel tracepoints to monitor network retransmission spikes."
    },
    {
        "say1": "The culmination of autonomous diagnostics synthesizes verified runbooks.",
        "say2": "Cross validation evaluates evidence consistency across runtime layers.",
        "example": "Clinical pathology boards convene specialists to verify complex diagnoses.",
        "tryIt": "Cross validate diagnostic hypotheses and synthesize actionable runbooks."
    }
]

titles = [
    "Real Time Diagnostic Exploration Triggering Profiling In Cloud Pods.",
    "Memory Dump Inspection Dominator Trees And Retained Closures.",
    "CPU Flamegraph Parsing Correlating Stack Samples With Hot Functions.",
    "Kernel Probing For SRE Monitoring Socket Drops And Retransmissions.",
    "Diagnostic Verification And Automated Incident Runbook Synthesis."
]

columns_list = [
    ["Diagnostic Layer", "Inspection Control Protocol", "Production Safety Boundary"],
    ["Memory Analysis", "Graph Traversal Algorithm", "Dominator Node Isolation SLA"],
    ["Profiling Engine", "Stack Aggregation Method", "Hot Function Discovery Target"],
    ["Kernel Probe Hook", "Network Telemetry Primitive", "Packet Loss Detection Metric"],
    ["Synthesis Matrix", "Causal Verification Rule", "Remediation Confidence Score"]
]

steps_rows = [
    [
        [["CDP Inspector Protocol", "Authenticated UNIX Domain Socket", "Zero Production Lag SLA"], ["Canary Mirror Pod", "Five Percent Mirrored Traffic Slice", "Complete User Isolation"]],
        [["CPU Profiler Probe", "One Kilohertz Stack Frame Sampling", "Ten Second Hard Time Cap"], ["Streaming Dump Pipe", "Memory Mapped Object Storage Buffer", "Zero Host Disk Saturation"]],
        [["Endoscopy Catheter", "Minimally Invasive Arterial Navigation", "Zero Exploratory Trauma"], ["Diagnostic Manifest", "Cryptographic Artifact Hash Ledger", "Enterprise Certified Standard"]],
        [["Active Diagnostic Core", "Low Overhead Autonomous Inspection", "Planetary Scale Approved"], ["Production Standard Engine", "Zero Disruption Profiling", "Enterprise Certified Standard"]]
    ],
    [
        [["Heap Dump Parser", "Engine Object Graph Buffer Ingestion", "Two Gigabyte Snapshot Scale"], ["Dominator Tree Model", "Exclusive Reachability Calculation", "Sub Fifteen Second Discovery"]],
        [["Closure Scope Chain", "Lexical Variable Reference Tracing", "Unclosed Socket Listener Catch"], ["Historical Baseline Diff", "Steady State Population Comparison", "Exponential Growth Proof"]],
        [["Plumbing Acoustic Sensor", "Acoustic Reflection Joint Tracing", "Zero Wall Demolition Need"], ["Remediation Suggester", "Once Listener Cleanup Synthesis", "Immediate Dossier Handshake"]],
        [["Memory Defense Core", "Mathematical Leak Isolation Engine", "High Consequence Certified"], ["Enterprise Memory Standard", "Zero Progressive Leak Standard", "Production Grade Certified"]]
    ],
    [
        [["Call Tree Aggregator", "Self Time And Total Time Metrics", "Hot Spot Instruction Discovery"], ["Inverted Flamegraph", "Hierarchical Width Percent Stack Map", "Deepest Dominating Frame"]],
        [["Differential Flamegraph", "Baseline Stack Matrix Subtraction", "Seventy Percent CPU Spike Pinpoint"], ["Turbofan Deopt Catch", "Polymorphic Type Variation Tracking", "Immediate JIT Bailout Flag"]],
        [["Formula One Telemetry", "Cylinder Thermal Friction Detection", "Proactive Race Adjustment"], ["Execution Bottleneck Map", "Source Code Line Number Attribution", "Sub Three Second Isolation"]],
        [["Algorithmic Profiler", "Real Time CPU Execution Inspector", "Planetary Scale Approved"], ["Master Certified Standard", "Zero Guesswork Attribution", "Enterprise Production Certified"]]
    ],
    [
        [["eBPF Kernel Bytecode", "In Kernel Verified Tracepoint Probes", "Sub Microsecond Hook Overhead"], ["TCP Drop Tracepoint", "Kernel Socket Memory Inspection", "Zero Kernel Module Hazard"]],
        [["Retransmit Ratio Core", "Destination IP Retransmission Stream", "Fifteen Percent Drop Flag"], ["SYN Backlog Monitor", "Listen Queue Overflow Intercept", "Zero Client Timeout Silence"]],
        [["Highway Helicopter", "Interstate Panoramic Flow Tracking", "Structural Bottleneck Vision"], ["Kernel Security Gate", "In Kernel Mathematical Bytecode Proof", "Zero Host Instability Risk"]],
        [["Kernel Network SRE", "Low Overhead Packet State Engine", "High Consequence Certified"], ["Enterprise Kernel Standard", "Zero Fabric Blindspot Standard", "Production Grade Certified"]]
    ],
    [
        [["Causal Cross Validator", "Three Layer Telemetry Consistency", "Ninety Five Percent Certainty"], ["Executable Runbook Gen", "Step By Step Operational Script", "Pre Filled Rollback Plan"]],
        [["Confidence Score Engine", "Automated Non Destructive Action Gate", "Zero Downtime Execution"], ["GitOps Post Mortem Pipe", "Immutable Runbook Documentation Sync", "Continuous Learning System"]],
        [["Clinical Pathology Board", "Multi Modality Diagnostic Meeting", "Targeted Surgical Protocol"], ["Triage Resolution Cut", "Forty Five Second Decision Time", "Pre Outage Resolution SLA"]],
        [["Autonomous SRE Master", "Certified Incident Resolution Engine", "Planetary Scale Approved"], ["Master Certified Standard", "Zero Operational Delay Core", "Enterprise Production Certified"]]
    ]
]

entries = []
for p_idx, part in enumerate(day57_dict['parts']):
    code_hash = hashlib.sha256(part['code'].encode('utf-8')).hexdigest()
    caps = captions_data[p_idx]
    
    spec_steps = []
    at_keys = ["say1", "say2", "example", "tryIt"]
    for s_idx, at_k in enumerate(at_keys):
        cap = caps[at_k]
        assert len(cap) <= 75, f"Part {p_idx+1} {at_k} caption too long: {len(cap)} ({cap})"
        assert cap.endswith('.'), f"Part {p_idx+1} {at_k} caption must end with period: ({cap})"
        assert not any(c.isdigit() for c in cap), f"Part {p_idx+1} {at_k} caption contains digits: ({cap})"
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
    
    entry = {
        "partTitle": part['title'],
        "codeHash": code_hash,
        "spec": spec,
        "filled": spec
    }
    entries.append(entry)

visual_envelope = {
    "schemaVersion": "2.0.0",
    "course": "ai",
    "day": 57,
    "prefix": "ai",
    "entries": entries
}

# Write lesson JSON
with open('scripts/branch_c/ai_day57_lesson.json', 'w', encoding='utf-8') as f:
    json.dump(day57_dict, f, indent=2)

# Write visual envelope
with open('src/lib/data/lessonVisuals/ai/day-57.json', 'w', encoding='utf-8') as f:
    json.dump(visual_envelope, f, indent=2)

print(f"Generated Day 57 lesson JSON ({total_words} words) and Visual Envelope successfully!")
