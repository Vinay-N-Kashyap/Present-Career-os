import json
import hashlib
import re

part1_say = [
    "In the early architectural iterations of foundation model applications, tool integration was restricted to crude, synchronous single-turn function calling. A user prompt was submitted, the language model determined whether a single external tool was needed, emitted a formatted string representing the function name and arguments, and paused while the application executed the call synchronously before returning an observation string to the model context. While functional for trivial tasks like single-city weather lookups or basic dictionary queries, sequential single-tool invocation completely fails when applied to enterprise workflows requiring complex real-time data aggregation, multi-system synchronization, or high-throughput distributed automation.",
    "The primary operational bottleneck of sequential tool invocation is compounding network and I/O latency. Consider an enterprise travel booking or financial portfolio rebalancing assistant: to formulate a coherent recommendation, the agent must check user preferences in a customer relationship database, fetch real-time flight quotes from two competing airline APIs, query hotel inventory, verify rental car rates, and inspect payment fraud registries. If each external network request consumes five hundred milliseconds, executing these calls sequentially accumulates over three seconds of idle network waiting time. If a single upstream API experiences latency degradation or hangs on a connection timeout, the entire user request breaches enterprise API gateway thresholds and terminates in failure.",
    "Transitioning to modern autonomous agent architectures requires elevating function calling into a high-concurrency, asynchronous tool mesh. In modern frontier foundation models, the neural architecture is explicitly trained to emit multiple independent tool calls in parallel within a single generation turn. When presented with a multi-variable inquiry, the model emits an array of tool call specifications—each bearing a unique invocation identifier, a target tool name, and an isolated JSON argument payload—instructing the external orchestrator to dispatch all operations concurrently.",
    "Parallel function calling fundamentally compresses end-to-end deliberative latencies into the duration of the single slowest tool invocation. Rather than accumulating the serial sum of individual tool latencies, the asynchronous orchestrator executes all dispatched operations simultaneously across non-blocking worker threads. If three external database queries take forty milliseconds, sixty milliseconds, and eighty milliseconds respectively, the total elapsed wall-clock latency is approximately eighty milliseconds rather than one hundred eighty milliseconds, representing a dramatic sixty percent latency reduction that preserves crisp, interactive user experiences.",
    "Beyond raw speed, parallel tool calling enables holistic multi-source information synthesis that prevents cognitive hallucination. When an autonomous agent receives observations from multiple orthogonal data sources simultaneously within the same conversational turn, the model's multi-head attention layers can cross-reference facts, identify inconsistencies, and synthesize a unified factual conclusion. In contrast, sequential execution forces the model to reason incrementally with partial information, creating cognitive gaps where early assumptions bias subsequent tool parameters.",
    "The architectural role of the tool orchestrator expands from a passive HTTP dispatcher into an active execution supervisor. The orchestrator must parse incoming parallel tool call arrays, enforce concurrency ceilings, validate parameter schemas, dispatch network requests across asynchronous worker pools, enforce per-tool timeout boundaries, catch execution exceptions, and format structured observation payloads back into the model context in a strictly coordinated turn.",
    "Enterprise security demands strict isolation and least-privilege authorization across parallel tool execution environments. When an autonomous agent is authorized to invoke external APIs, each individual tool call must carry cryptographically signed identity tokens that restrict access exclusively to authorized tenant data scopes. The orchestrator verifies these security claims before dispatching requests, ensuring that parallel tool invocations cannot be exploited for privilege escalation or unauthorized data exfiltration.",
    "Mastering advanced function calling and multi-tool orchestration transforms prompt engineers into distributed systems architects. By commanding asynchronous execution, parameter validation, and fault-tolerant turn management, you unlock the ability to construct resilient autonomous agent platforms capable of operating reliably across planet-scale enterprise API ecosystems."
    "Asynchronous parallel dispatching fundamentally transforms how autonomous planning agents interact with enterprise knowledge graphs and distributed microservices. By empowering the language model to emit multiple simultaneous tool requests in a single turn, the architecture eliminates the artificial sequentiality of conversational chat interfaces, establishing a direct parallel bus between neural reasoning and cloud infrastructure.",
]

part2_say = [
    "At the mechanical core of high-throughput tool orchestration lies the asynchronous worker pool, powered by non-blocking event loops such as Python asyncio. Naive multi-threading architectures that spawn dedicated operating system threads for each tool invocation incur substantial memory overhead and context-switching penalties. In high-concurrency enterprise environments where hundreds of autonomous agents execute dozens of parallel tool calls simultaneously, thread-based dispatching rapidly exhausts system resources. An asynchronous event-driven architecture multiplexes thousands of concurrent network sockets over a compact pool of worker threads, delivering maximum throughput with minimal hardware overhead.",
    "The Python asyncio gather pattern serves as the primary concurrency primitive for parallel tool dispatching. When the language model emits an array of tool calls, the orchestrator unpacks the invocation list, maps each tool name to its registered execution coroutine, wraps each coroutine in an individual timeout shield, and submits the batch to asyncio gather with return_exceptions set to true. This design ensures that if one third-party API call experiences a socket timeout or network drop, the exception is captured as an isolated error object rather than aborting the parallel batch.",
    "Enforcing strict per-tool timeout boundaries prevents slow or unresponsive upstream dependencies from causing cascading pipeline freezes. Different enterprise APIs exhibit wildly divergent operational characteristics: an in-memory Redis cache lookup completes in under five milliseconds, while a legacy enterprise mainframe query may require two seconds. The orchestrator maintains a granular configuration catalog defining maximum allowable latencies for each tool; if a specific tool exceeds its latency deadline, the worker cancels the underlying task and returns a structured timeout observation, allowing the agent to proceed with available data.",
    "Dynamic worker pool sizing and token-aware rate limiting protect downstream APIs from being overwhelmed by unexpected concurrency bursts. If an autonomous planning agent decomposes a complex inquiry into twenty parallel database queries, dispatching all twenty requests instantaneously could trip rate limits, exhaust connection pools, or trigger automated DDoS defenses on internal enterprise services. The orchestrator routes tool invocations through bounded asynchronous semaphores, ensuring that concurrent requests remain strictly within negotiated service level agreements.",
    "Idempotency management represents an indispensable safeguard when executing parallel operations that modify external state. Read-only query tools—such as search or database lookups—can be dispatched and retried without risk. However, state-modifying tools—such as financial fund transfers, inventory allocations, or notification dispatches—must be protected against duplicate execution. The orchestrator computes unique idempotency keys combining the user session identifier, tool name, and argument hash, guaranteeing that repeated or re-dispatched tool calls execute exactly once in external systems.",
    "Observation aggregation protocols dictate how parallel tool results are serialized and re-injected into the language model context window. Modern foundation models expect each tool result to be encapsulated in a dedicated tool observation message bearing the exact tool_call_id emitted in the original dispatch. The orchestrator aligns returned payloads with their respective identifiers, assembling a unified multi-observation turn that preserves perfect causal provenance across the conversational history.",
    "Telemetry instrumentation across the worker pool provides granular visibility into distributed tool performance and failure modes. The orchestrator emits distributed OpenTelemetry spans for every tool dispatch, tracking invocation counts, parameter serialization overhead, network transport latencies, and error rates. Enterprise dashboards visualize tool call waterfalls, alerting site reliability engineers to degrading third-party endpoints before they impact user experience.",
    "Asynchronous parallel tool execution establishes the essential infrastructure backbone for high-performance agentic workflows. By decoupling concurrency management from model reasoning, software architectures achieve sub-second execution speeds while maintaining absolute control over downstream network stability."
    "Connection pooling and TCP socket reuse minimize network handshake latency across high-frequency tool invocations. The orchestrator maintains warm HTTP/2 and gRPC connection pools across internal microservices, eliminating the overhead of repeated TLS handshakes. When parallel tools are dispatched, requests travel over pre-established multiplexed streams, ensuring that network transport adds mere single-digit milliseconds to overall execution time.",
    "Dynamic load shedding and backpressure propagation protect backend infrastructure during unexpected traffic surges. If downstream database clusters report high CPU utilization or replication lag, the tool orchestrator automatically throttles concurrency semaphores, queuing non-critical tool calls or substituting cached observations, ensuring that autonomous agent workloads never destabilize core transactional systems.",
]

part3_say = [
    "Parameter schema validation represents the primary defensive barrier against hallucinated, malformed, or hostile inputs in autonomous function calling. Language models do not natively understand Python type systems or database constraints; they generate text based on probabilistic associations. Consequently, models frequently emit arguments with subtle schema defects: passing strings where numbers are required, omitting mandatory fields, supplying out-of-range values, or inventing non-existent parameters. Dispatching unvalidated arguments directly to enterprise backend services leads to unhandled exceptions, database corruption, or security vulnerabilities.",
    "Declarative schema definition via Pydantic models provides an elegant, type-safe contract that bridges Python application code with model tool definitions. By defining tools as strongly typed Pydantic classes with detailed field descriptions, default values, and validation decorators, software engineers establish a single source of truth for both runtime execution and model prompting. During server startup, the orchestrator automatically compiles these Pydantic models into standardized JSON Schema specifications that are submitted to the foundation model API.",
    "Runtime parameter validation executes instantly upon receiving tool call arguments from the model. The orchestrator deserializes the raw JSON string emitted by the model and validates it against the registered Pydantic model. Pydantic performs rigorous type coercion: converting numeric strings like the string one hundred into genuine integers, parsing ISO formatted strings into datetime objects, and validating complex regex patterns. If the emitted arguments satisfy all schema rules, a typed instance is passed to the execution function with absolute safety.",
    "Strict schema enforcement eliminates injection attacks and parameter pollution vulnerabilities. An adversarial prompt might attempt to manipulate an autonomous agent into passing malicious SQL fragments, shell metacharacters, or path traversal sequences into tool arguments. By enforcing strict regex patterns, allowed enum lists, and bounded string lengths at the Pydantic validation boundary, the orchestrator sanitizes and disarms hostile payloads before they can interact with underlying infrastructure.",
    "Zero-shot tool argument generation relies heavily on the quality and clarity of JSON Schema field descriptions. Transformer attention heads utilize description strings as semantic guidance tokens to infer expected units, formatting conventions, and domain constraints. A field named start_date with a description specifying year month day format will achieve vastly higher parameter accuracy than a bare field name without contextual documentation.",
    "Dynamic schema filtering curates the active tool catalog based on conversational context and user authorization scopes. Presenting a model with hundreds of tool schemas simultaneously degrades reasoning accuracy, increases token consumption, and raises the probability that the model will select an inappropriate tool. The orchestrator uses lightweight semantic classifiers to select and inject only the five or ten most relevant tool schemas into the active context, maximizing tool selection accuracy while preserving context window economy.",
    "Automated schema versioning ensures backward compatibility as enterprise tool interfaces evolve over time. When a microservice updates its API parameters, the orchestrator maintains versioned schemas, allowing autonomous agents operating in long-running conversational sessions to continue invoking legacy parameter signatures while new sessions transition smoothly to modern contracts.",
    "Strongly typed parameter validation transforms function calling from an experimental novelty into a hardened enterprise integration protocol. By ensuring that every tool parameter is verified against rigid schema rules, platforms guarantee that autonomous agents interact with production systems with flawless operational integrity."
    "Automated schema transpilation bridges diverse enterprise data modeling standards into unified JSON Schema contracts. Modern enterprise systems maintain schemas in Protocol Buffers, GraphQL SDL, Avro, and OpenAPI specifications. The parameter validation gateway ingests these heterogeneous definitions, compiles them into normalized Pydantic models with exhaustive field documentation, and produces standardized JSON schemas that foundation models can reliably navigate without ambiguity.",
    "Runtime semantic constraint validation extends beyond basic type checking to enforce domain-specific business invariants. In financial trading or medical dosing tools, a parameter may be syntactically valid as a floating-point number but operationally disastrous if it exceeds risk limits. Custom Pydantic validator functions inspect argument values against live risk matrices and user entitlement scopes, halting non-compliant executions before transactions can dispatch.",
]

part4_say = [
    "In real-world enterprise computing environments, external tool invocations inevitably encounter errors: network sockets drop, downstream databases experience lock contention, third-party APIs return rate limit warnings, and language models occasionally pass invalid parameters. A naive agent that crashes or outputs a generic error message upon encountering a tool failure is fundamentally unusable in mission-critical settings. Autonomous enterprise systems must possess resilient automated error recovery handlers that transform tool failures into actionable diagnostic observations, enabling models to dynamically self-correct without human intervention.",
    "The core architectural pattern for self-healing tool execution is the Socratic Error Feedback Loop. When a tool invocation fails—whether due to a Pydantic schema validation error or an HTTP 400 Bad Request returned by a backend API—the orchestrator does not raise an unhandled exception. Instead, it catches the error, extracts the specific failure reason, formats the diagnostic data into a structured error payload, and injects it back into the model context as the tool observation.",
    "Providing precise schema feedback enables foundation models to execute dynamic argument correction with remarkable accuracy. If an agent calls a flight search API passing date: 'March 15th' and the tool returns a structured error stating 'Validation Error: Expected date in YYYY-MM-DD format', the model's self-attention heads process the error message in the next turn, recognize its mistake, convert the date to the correct format, and re-invoke the tool successfully. Empirical benchmarks prove that structured error feedback enables autonomous models to recover from ninety percent of schema errors on the second attempt.",
    "Categorizing tool failures into transient and permanent error classes dictates appropriate recovery workflows. Transient errors—such as network timeouts, connection resets, and HTTP 429 rate limit exceptions—should be handled automatically by the orchestrator using exponential backoff with jitter, retrying the call without bothering the language model. Permanent errors—such as invalid credentials, resource not found, or missing mandatory business parameters—must be surfaced directly to the model with clear explanatory context so the agent can adjust its strategy or query the user for clarification.",
    "Circuit breaker patterns protect enterprise ecosystems against cascading tool failure loops. If an external service experiences an extended outage, an autonomous agent caught in an automated retry loop could repeatedly hammer the failing endpoint, exacerbating the outage and consuming valuable API tokens. The orchestrator implements stateful circuit breakers that monitor failure rates; if a tool fails consistently across several consecutive calls, the breaker trips to open status, instantly failing subsequent calls and instructing the agent to adopt alternative workflows.",
    "Fallback tool routing provides alternative paths when primary operational tools become unavailable. An enterprise customer support platform may register two independent search tools: a high-speed internal semantic vector index and a secondary keyword search database. If the primary vector search tool trips its circuit breaker due to high load, the orchestrator dynamically steers the agent toward the secondary tool, preserving application availability without degrading user experience.",
    "Forensic error logging archives complete execution context for every failed tool invocation. The orchestrator records the raw prompt, the model's emitted tool arguments, the exact exception traceback, the structured feedback returned to the model, and the subsequent self-correction outcome in secure audit logs. Platform engineers inspect these records to identify recurring schema ambiguities, improve parameter documentation, and harden external API connectors.",
    "Automated error recovery and dynamic self-healing turn autonomous agents into durable, self-reliant digital workers. By gracefully navigating network hiccups and correcting parameter flaws in flight, multi-tool agent platforms deliver unbroken enterprise availability under real-world production conditions."
    "Automated parameter correction telemetry tracks the convergence efficiency of Socratic error feedback loops across different foundation model versions. By measuring how many turns and tokens each model requires to resolve specific categories of schema errors—such as date formatting mismatches, missing required enum values, or array bounds violations—systems engineers identify prompt documentation gaps and optimize schema descriptions to maximize single-turn accuracy.",
    "Hierarchical exception categorization separates recoverable network blips from unrecoverable logic flaws. When an external service returns an HTTP 503 Service Unavailable, the orchestrator handles the retry transparently using exponential backoff; when a service returns an HTTP 403 Forbidden indicating authorization failure, the orchestrator immediately alerts the model that credentials are insufficient, enabling the agent to adjust its execution plan without futile retries.",
]

part5_say = [
    "Translating the principles of parallel execution, parameter schema validation, and automated error recovery into industrial production requires constructing a robust, scalable Python orchestration framework. Moving from academic scripts to enterprise reality demands modular software engineering: separating dispatch harnesses from execution workers, enforcing asynchronous concurrency boundaries, instrumenting distributed telemetry, and maintaining strict adherence to enterprise security and reliability standards.",
    "The software architecture of a production multi-tool orchestration platform comprises four decoupled microservices managed by a central Python controller: the Tool Registry & Schema Catalog, the Asynchronous Worker Pool, the Parameter Validation Sandbox, and the Resilient Error Recovery Gateway. The Tool Registry maintains the repository of registered Pydantic tools and their compiled JSON schemas, while the Worker Pool manages concurrent asyncio tasks and network connections.",
    "The Parameter Validation Sandbox executes schema verification in an isolated execution thread, preventing untrusted inputs from reaching internal business logic. When an LLM response contains tool calls, the sandbox deserializes the argument JSON, executes Pydantic type coercion, sanitizes string parameters against injection attacks, and produces strongly typed parameter objects ready for immediate execution by the worker pool.",
    "Resilient exception handling is baked into every layer of the Python harness. The worker pool wraps all external network interactions in exponential backoff decorators configured with randomized jitter, gracefully absorbing transient network blips and rate limit exceptions. When a permanent error occurs, the Error Recovery Gateway synthesizes structured diagnostic feedback, ensuring that the active language model receives clear, actionable guidance to execute in-flight self-correction.",
    "Native OpenTelemetry instrumentation provides end-to-end distributed tracing across all multi-tool workflows. The Python engine emits granular spans for every tool dispatch, tracking schema validation latency, network transit duration, self-correction iterations, and tool output token sizes. Enterprise operations dashboards visualize tool execution waterfalls in real time, alerting site reliability engineers to latency anomalies or elevated failure rates across individual microservice endpoints.",
    "Enterprise role-based access control and token authorization boundaries are verified before every tool invocation. When an enterprise user interacts with an autonomous agent, the user's authorization claims are propagated to the tool orchestrator. The engine verifies that the user possesses valid permission scopes to access the requested data or execute the target operation, preventing autonomous agents from inadvertently bypassing corporate security policies.",
    "Comprehensive synthetic regression testing suites run continuous automated stress tests against all registered tools. The testing framework simulates network delays, drops connections, and injects malformed parameter payloads to verify that the orchestration harness and error recovery loops perform flawlessly under adverse conditions, certifying the platform for mission-critical deployment.",
    "Mastering advanced function calling and resilient multi-tool orchestration establishes you as a leader in enterprise autonomous systems engineering. By commanding asynchronous parallelism, type-safe schema contracts, and self-healing error loops, you possess the capability to build robust digital workforces that integrate seamlessly with the world's most complex enterprise computing infrastructures."
    "Distributed transaction coordination utilizes the Saga pattern to manage multi-tool operations that span multiple independent databases. If an autonomous booking workflow successfully charges a customer payment tool but fails during hotel reservation dispatch, the orchestrator triggers compensating transactions—such as issuing an automated refund—guaranteeing eventual data consistency across distributed enterprise systems.",
    "Comprehensive OpenTelemetry distributed tracing propagates W3C trace context headers across all dispatched tool HTTP and gRPC requests. This end-to-end trace propagation links the user's initial prompt submission, intermediate model reasoning tokens, individual parallel tool executions, and final synthesis generation into a unified, navigable trace waterfall in enterprise observability suites.",
    "Enterprise compliance vaults store immutable, cryptographically signed audit logs of all tool parameters and returned observations. By hashing prompt contexts and tool payloads using SHA-256 and storing them in tamper-evident storage, the platform provides complete forensic transparency, satisfying external regulatory auditing mandates and institutional governance policies.",
]

parts_data = [
    {
        "title": "The Evolution Of LLM Function Calling: From Single-Turn Tool Invocation To Autonomous Agent Meshes",
        "say": part1_say,
        "example": "A travel booking assistant checks flights, hotels, and fraud registries concurrently.",
        "tryIt": "Compare serial synchronous tool latency against parallel asynchronous tool dispatching.",
        "check": {
            "question": "What is the primary operational advantage of parallel tool execution over sequential invocation?",
            "options": [
                "It compresses wall-clock latency to the duration of the slowest tool rather than summing all latencies",
                "It eliminates the need for computer servers to connect to the external internet entirely",
                "It forces all external API providers to waive their commercial billing charges automatically",
                "It permanently prevents the language model from generating responses in human natural language"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Parallel execution dispatches independent tool calls concurrently across asynchronous worker threads, compressing total latency to the slowest individual call instead of summing them serially."
        }
    },
    {
        "title": "Parallel Tool Execution Architecture: Asynchronous Worker Pools & Concurrency Optimization",
        "say": part2_say,
        "example": "An async worker pool executes three database lookups concurrently under strict per-tool timeouts.",
        "tryIt": "Implement an asyncio gather dispatcher that wraps multiple tool coroutines with timeout guards.",
        "check": {
            "question": "Why is enforcing per-tool timeout boundaries critical when executing parallel tools?",
            "options": [
                "To prevent slow or hanging third-party APIs from causing cascading timeouts across the entire user request",
                "To force the computer monitor to refresh its display pixels twice as fast during execution",
                "To delete the user account automatically whenever a network query takes longer than one second",
                "To convert all outgoing network packets into unencrypted plain text for faster transmission"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Per-tool timeout boundaries prevent a single slow or unresponsive third-party API from stalling the entire asynchronous batch and causing gateway timeout failures."
        }
    },
    {
        "title": "Parameter Schema Validation: Pydantic Contracts, Type Coercion & Zero-Shot Tool Arguments",
        "say": part3_say,
        "example": "A Pydantic validator coerces string postal codes and blocks path traversal injection attacks.",
        "tryIt": "Define a strongly typed Pydantic tool model with field descriptions and custom validators.",
        "check": {
            "question": "What role does Pydantic type coercion play in hardening autonomous tool execution?",
            "options": [
                "Coercing model emitted strings into genuine typed integers and datetimes while sanitizing input",
                "Translating Python functions into machine readable binary punch cards for mainframe computers",
                "Deleting all non-alphanumeric characters from database tables before executing queries",
                "Forcing all external software libraries to run on battery power rather than electrical outlets"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Pydantic type coercion safely translates model-emitted strings into typed primitives (integers, datetimes) while validating constraints and disarming injection payloads."
        }
    },
    {
        "title": "Automated Tool Error Recovery: Self-Correction Loops, Idempotency Keys & Fault Handlers",
        "say": part4_say,
        "example": "An agent corrects an invalid date format after receiving structured schema error feedback from a tool.",
        "tryIt": "Construct an error recovery handler that catches API 400 errors and feeds diagnostic hints back to the LLM.",
        "check": {
            "question": "How does the Socratic Error Feedback Loop enable autonomous language models to self-correct?",
            "options": [
                "By returning structured error messages explaining schema mismatches so the model can correct its arguments",
                "By shutting down the application server and emailing the software developer to fix the code",
                "By deleting the problem prompt and forcing the user to retype their entire question from scratch",
                "By automatically generating random numbers until one happens to satisfy the database schema"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Returning structured diagnostic feedback in the tool observation allows the model's self-attention heads to understand the parameter flaw and emit corrected arguments in the next turn."
        }
    },
    {
        "title": "Enterprise Orchestration Engineering: Building A Resilient Multi-Tool Python Engine",
        "say": part5_say,
        "example": "An enterprise multi-tool gateway routes parallel queries across internal banking microservices with tracing.",
        "tryIt": "Build a modular Python class with asynchronous dispatching, parameter validation, and telemetry spans.",
        "check": {
            "question": "What is the primary function of circuit breaker patterns in enterprise tool orchestration?",
            "options": [
                "To stop hammering failing endpoints during outages, preventing cascading failures and token waste",
                "To increase electrical power delivery to the graphics processing units during peak inference",
                "To permanently disconnect the database server from the corporate local area network",
                "To delete all compiled software code whenever an external API returns a server error"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Circuit breakers monitor failure rates and temporarily open to halt invocations to failing services, protecting downstream infrastructure and eliminating token waste during outages."
        }
    }
]

code1 = '''def test_day37_parallel_tool_orchestration():
    """
    Day 37: Advanced Function Calling & Multi-Tool Orchestration: Parallel Tool Execution & Error Recovery Handlers
    """
    tools = [
        {"name": "fetch_user_profile", "status": "SUCCESS", "latency_ms": 42},
        {"name": "query_credit_score", "status": "SUCCESS", "latency_ms": 68},
        {"name": "check_fraud_registry", "status": "RECOVERED_AFTER_RETRY", "latency_ms": 89}
    ]

    total_serial_latency = sum(t["latency_ms"] for t in tools)
    parallel_wall_clock_latency = max(t["latency_ms"] for t in tools)

    return {
        "orchestrationPattern": "Asynchronous Parallel Function Calling & Resilient Error Recovery",
        "dispatchedToolsCount": len(tools),
        "executionMode": "asyncio.gather with per-tool timeout guards",
        "totalSequentialLatencyMs": total_serial_latency,
        "parallelWallClockLatencyMs": parallel_wall_clock_latency,
        "latencyCompressionPct": round(((total_serial_latency - parallel_wall_clock_latency) / total_serial_latency) * 100, 1),
        "schemaErrorSelfCorrection": "AUTO_REPAIRED_VIA_JSON_SCHEMA_FEEDBACK",
        "status": "PARALLEL_TOOL_ORCHESTRATION_COMPLETED"
    }'''

output1 = '''{
  "orchestrationPattern": "Asynchronous Parallel Function Calling & Resilient Error Recovery",
  "dispatchedToolsCount": 3,
  "executionMode": "asyncio.gather with per-tool timeout guards",
  "totalSequentialLatencyMs": 199,
  "parallelWallClockLatencyMs": 89,
  "latencyCompressionPct": 55.3,
  "schemaErrorSelfCorrection": "AUTO_REPAIRED_VIA_JSON_SCHEMA_FEEDBACK",
  "status": "PARALLEL_TOOL_ORCHESTRATION_COMPLETED"
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

day37_dict = {
    "id": "prompt-py-37",
    "day": 37,
    "course": "prompt-py",
    "title": "Advanced Function Calling & Multi-Tool Orchestration: Parallel Tool Execution & Error Recovery Handlers",
    "minutes": 38,
    "parts": parts_data,
    "projectStep": {
        "title": "Implement Asynchronous Parallel Tool Orchestration Engine",
        "steps": [
            "Define strongly typed Pydantic tool models with field descriptions and type validation rules.",
            "Construct an asynchronous dispatcher using asyncio gather with per-tool timeout guards.",
            "Implement parameter validation sandboxes that execute type coercion and sanitize input strings.",
            "Build an automated Socratic Error Feedback Loop that returns structured schema diagnostics.",
            "Incorporate stateful circuit breakers and OpenTelemetry distributed tracing across all tool calls."
        ]
    },
    "summary": [
        "Sequential tool execution introduces compounding latency bottlenecks and exposes workflows to gateway timeouts.",
        "Parallel tool calling dispatches multiple independent tool invocations concurrently, compressing latency to the slowest call.",
        "Pydantic contracts enforce strict type validation, sanitize inputs against injection, and provide clear schema guidance.",
        "Automated error recovery loops intercept execution failures and feed structured diagnostic hints back to the model.",
        "Enterprise orchestration engines implement circuit breakers, idempotency keys, and distributed OpenTelemetry tracing."
    ]
}

captions_data = [
    {
        "say1": "Sequential tool invocations compound network latency across workflows.",
        "say2": "Compounding network latency creates severe operational bottlenecks.",
        "example": "Travel booking assistants check flights and hotel databases concurrently.",
        "tryIt": "Compare serial synchronous tool latency against parallel dispatching."
    },
    {
        "say1": "Asynchronous worker pools multiplex concurrent network sockets efficiently.",
        "say2": "The Python asyncio gather pattern serves as primary concurrency primitive.",
        "example": "Async worker pools execute three database lookups under strict timeouts.",
        "tryIt": "Implement an asyncio gather dispatcher wrapping coroutines with timeouts."
    },
    {
        "say1": "Parameter schema validation represents primary defense against errors.",
        "say2": "Declarative schema definition via Pydantic provides type safe contracts.",
        "example": "Pydantic validators coerce string postal codes and block injections.",
        "tryIt": "Define a strongly typed Pydantic tool model with field descriptions."
    },
    {
        "say1": "Enterprise computing environments inevitably encounter tool errors.",
        "say2": "The core architectural pattern is the Socratic error feedback loop.",
        "example": "Agents correct invalid date formats after receiving schema diagnostics.",
        "tryIt": "Construct an error recovery handler catching API errors with hints."
    },
    {
        "say1": "Enterprise orchestration engineering translates principles into systems.",
        "say2": "The software architecture comprises four decoupled microservice layers.",
        "example": "Multi tool gateways route parallel queries across banking services.",
        "tryIt": "Build a modular Python class with asynchronous dispatching and tracing."
    }
]

titles = [
    "Function Calling Evolution And Parallel Tool Execution Fundamentals.",
    "Asynchronous Worker Pools And Concurrency Optimization Architectures.",
    "Parameter Schema Validation And Pydantic Type Coercion Contracts.",
    "Automated Error Recovery Handlers And Dynamic Self Correction Loops.",
    "Enterprise Multi Tool Orchestration And Production System Deployment."
]

columns_list = [
    ["Orchestration Mode", "Execution Trajectory Profile", "Enterprise Latency Impact"],
    ["Concurrency Primitive", "Runtime Mechanism", "System Resource Profile"],
    ["Validation Layer", "Contract Specification", "Data Integrity Guarantee"],
    ["Fault Handling Mode", "Diagnostic Feedback Pattern", "System Resilience Profile"],
    ["Platform Service Layer", "Component Implementation", "Production Reliability SLA"]
]

steps_rows = [
    [
        [["Sequential Single Tool Mode", "Serial Blocking Invocations Across APIs", "Severe Compounding Network Latency"], ["Parallel Multi Tool Mesh", "Concurrent Asynchronous Invocations", "Compresses Latency To Slowest Call"]],
        [["Compounding Latency Risk", "Cumulative Idle Network Waiting Times", "Frequent Gateway Timeout Disconnects"], ["Asynchronous Concurrency", "Simultaneous Non Blocking Socket Execution", "Preserves Interactive Sub Second Speeds"]],
        [["Partial Information Gap", "Incremental Reasoning With Incomplete Data", "Early Misconceptions Warping Later Calls"], ["Holistic Multi Source Turn", "Cross Reference Facts Simultaneously", "Suppresses Intermediate Hallucinations"]],
        [["Passive HTTP Dispatcher", "Simple Synchronous Request Forwarding", "Zero Protection Against Slow Endpoints"], ["Active Execution Supervisor", "Coordinate Timeouts And Parameter Validation", "Guarantees Predictable API Economics"]]
    ],
    [
        [["Asynchronous Event Loop", "Multiplex Sockets Across Compact Workers", "Minimal Memory And Context Switch Cost"], ["Asyncio Gather Primitive", "Concurrent Coroutine Execution Pattern", "Non Blocking Batch Task Dispatching"]],
        [["Per Tool Timeout Shield", "Granular Latency Deadlines Per Endpoint", "Prevents Cascading Worker Pool Freezes"], ["Bounded Semaphore Lock", "Token Aware Rate Limiting Throttles", "Protects Downstream Internal APIs"]],
        [["Idempotency Key Manager", "Hash Session Tool And Argument Parameters", "Guarantees State Modifying Safety"], ["Multi Observation Turn", "Align Tool Call Identifiers With Results", "Preserves Strict Causal Provenance"]],
        [["Distributed Tracer Core", "OpenTelemetry Spans On Tool Waterfalls", "Real Time Visibility Across Dependencies"], ["Non Blocking Task Worker", "Lightweight Asynchronous Coroutine Pool", "High Throughput Multi Tenant Scaling"]]
    ],
    [
        [["Pydantic Contract Validator", "Declarative Strongly Typed Schema Models", "Single Source Of Truth For APIs"], ["Runtime Parameter Coercion", "Convert String Primitives Into True Types", "Eliminates Schema Mismatch Exceptions"]],
        [["Security Boundary Sanitizer", "Enforce Regex Enums And Length Bounds", "Disarms Parameter Injection Attacks"], ["Zero Shot Semantic Guidance", "Field Descriptions Acting As Prompt Cues", "Maximizes Initial Parameter Accuracy"]],
        [["Dynamic Schema Filter", "Context Aware Tool Catalog Subsetting", "Preserves Precious Context Window Tokens"], ["Schema Versioning Manager", "Maintain Backward Compatible Signatures", "Smooth Transition Across API Updates"]],
        [["Type Safe Execution Gateway", "Strict Type Checking On Function Arguments", "Prevents Backend Database Corruption"], ["JSON Schema Transpiler", "Convert Models Into OpenAPI Specifications", "Standardizes Model Tool Definitions"]]
    ],
    [
        [["Socratic Feedback Loop", "Inject Structured Errors Back As Observations", "Enables Autonomous Dynamic Correction"], ["Structured Diagnostic Payload", "Specify Exact Failed Field And Expected Type", "Ninety Percent Second Turn Recovery Rate"]],
        [["Transient Error Handler", "Exponential Backoff With Jitter Retries", "Absorbs Network Drops Transparently"], ["Permanent Error Classifier", "Surface Business Logic Flaws To Model", "Guides Model To Adjust Strategy Intelligently"]],
        [["Circuit Breaker Pattern", "Stateful Monitoring Tripping On Outages", "Halts Invocations To Downstream Outages"], ["Fallback Tool Routing", "Dynamic Redirection To Secondary Tools", "Maintains Uptime During Provider Outages"]],
        [["Forensic Audit Logger", "Tamper Evident Storage Of Error Traces", "Enables Continuous Connector Hardening"], ["Self Healing Agent Mesh", "In Flight Argument And Strategy Adaptation", "Delivers Unbroken Enterprise Availability"]]
    ],
    [
        [["Tool Registry Microservice", "Repository Of Pydantic Tools And Schemas", "Standardizes Enterprise Tool Assets"], ["Async Worker Pool Manager", "Bounded Concurrency And Connection Pools", "Maintains Predictable Infrastructure Load"]],
        [["Validation Sandbox Kernel", "Isolated Pre Execution Schema Validation", "Protects Business Logic From Bad Inputs"], ["Error Recovery Gateway", "Synthesize Structured Diagnostic Feedback", "Guides Real Time Model Self Healing"]],
        [["OpenTelemetry Trace Emitter", "Granular Distributed Spans Across Calls", "Real Time Observability And Monitoring"], ["Role Based Access Guard", "Validate Identity Tokens And Scopes", "Enforces Strict Tenant Data Boundaries"]],
        [["Synthetic Chaos Runner", "Automated Fault Injection Stress Testing", "Certifies Production Readiness Under Load"], ["Enterprise Service SLA", "Sub Second Parallel Execution Guarantee", "Maintains High Availability Platform SLA"]]
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

for step_row in steps_rows:
    for row in step_row:
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
    "day": 37,
    "prefix": "prompt-py",
    "entries": entries
}

# Write lesson JSON
with open('C:/Users/Admin/Desktop/projects/Present-Career-os-platform/scripts/branch_c/prompt_day37_lesson.json', 'w', encoding='utf-8') as f:
    json.dump(day37_dict, f, indent=2)

# Write visual envelope
with open('C:/Users/Admin/Desktop/projects/Present-Career-os-platform/src/lib/data/lessonVisuals/prompt-py/day-37.json', 'w', encoding='utf-8') as f:
    json.dump(visual_envelope, f, indent=2)

print(f"Generated Day 37 lesson JSON ({total_words} words) and Visual Envelope successfully!")
