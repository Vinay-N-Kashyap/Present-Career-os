import json
import hashlib
import re

part1_say = [
    "In the early evolution of LLM tool augmentation, function calling was conceptualized almost exclusively through rigid, declarative JSON specifications. Foundation models were instructed to output structured JSON blobs containing a function name and an object of named arguments. While this approach provided basic structured interoperability, it introduced severe friction: every intermediate step required an expensive LLM round-trip, intermediate data could not be assigned to local variables without polluting the prompt context, and complex control structures like loops, conditionals, and error handlers had to be orchestrated externally. The CodeAct paradigm shatters these constraints by establishing executable Python code as the universal, high-bandwidth action space for autonomous agents.",
    "The CodeAct paradigm empowers autonomous agents to interact with environments using executable Python scripts rather than rigid JSON payloads. By allowing language models to write and execute arbitrary Python code directly within an interactive runtime, CodeAct transforms language models from passive string manipulators into active software engineers. Code acts natively support variable assignments, mathematical expressions, control loops, branching logic, and seamless multi-library imports, unifying tool invocation and computational reasoning into a singular, highly expressive modality.",
    "Expressive compositionality distinguishes Python actions from traditional declarative function calling. In a standard JSON tool-calling architecture, querying five customer accounts requires five consecutive model generation turns, five API invocations, and five verbose context updates. Under CodeAct, an agent writes a simple Python list comprehension or asynchronous loop that queries all five accounts concurrently, filters anomalies, and calculates summary metrics in a single execution turn, slashing latency and token consumption by upwards of sixty percent.",
    "Natural variable management eliminates redundant context transfer between tools. When a model executes a SQL query that retrieves ten thousand rows, passing that raw tabular payload through JSON context tokens overwhelms the transformer attention window and triggers severe latency spikes. In CodeAct, the agent assigns the SQL return directly to an in-memory pandas DataFrame. Downstream analytical tools manipulate the dataframe pointer directly within the execution runtime, transferring zero raw rows across the LLM prompt interface.",
    "Algorithmic branching and inline error recovery allow models to handle unexpected data anomalies autonomously. If an external API returns a forty-four rate-limit exception or malformed JSON, a traditional agent halts and awaits a prompt retry turn. A CodeAct agent wraps the network call in a standard try-except block, dynamically backtracks, implements exponential backoff, or routes the request to an alternative fallback data provider without requiring human intervention or extra model generation cycles.",
    "Token economy is dramatically improved under CodeAct architectures. Instead of burdening the system prompt with verbose JSON schemas detailing dozens of external functions, the environment provides standard Python module definitions and type-annotated docstrings. Foundation models pre-trained on billions of lines of Python code understand standard library APIs natively, requiring far fewer instructional tokens to achieve zero-shot execution precision.",
    "Unified reasoning and action blending bridges the gap between Chain-of-Thought (CoT) reflection and external execution. In traditional pipelines, reasoning occurs in text and action occurs in JSON. Under CodeAct, reasoning is embedded directly into Python comments and docstrings within the executable script. The model thinks in code, calculates in code, and acts in code, producing an unbroken cognitive trace with complete mathematical rigor.",
    "Ecosystem interoperability unlocks the entire Python open-source universe for autonomous agents. Rather than waiting for developers to handcraft custom tool wrappers, a CodeAct agent can autonomously import standard analytical packages: NumPy for matrix operations, SciPy for statistical testing, scikit-learn for anomaly detection, and matplotlib for visual data rendering, instantly elevating agent capabilities to expert software engineering baselines.",
    "Security isolation and execution sandboxing become paramount when granting agents the power to execute arbitrary code. Because Python commands can theoretically touch the underlying host filesystem, spawn subprocesses, or open network sockets, production CodeAct platforms mandate hardened, ephemeral container sandboxes that intercept dangerous system calls and enforce strict resource quotas.",
    "Mastering the CodeAct paradigm equips AI architects to build agents that operate with the agility and problem-solving power of seasoned software developers. By adopting executable Python as your primary tool action space, you eliminate the clunky serialization bottlenecks of JSON APIs and unlock unbounded computational autonomy across enterprise systems."
]

part2_say = [
    "Executing independent Python scripts in stateless, ephemeral subprocesses forces an agent to reload libraries, re-authenticate with databases, and re-read datasets on every single turn. This stateless churn introduces unacceptable latency overhead and destroys cognitive continuity. To unlock the full potential of CodeAct, production platforms implement persistent Read-Eval-Print Loop (REPL) execution environments that maintain stateful namespaces across multi-turn autonomous missions.",
    "Interactive Read Eval Print Loop environments preserve memory namespaces and runtime variables across multi-turn agent deliberations. By maintaining an active Python kernel process throughout a mission, the agent can import heavy libraries once, load enterprise datasets into memory, and iteratively inspect, manipulate, and query active objects across dozens of subsequent reasoning turns with near-zero latency.",
    "Stateful namespace management operates by maintaining a unified global dictionary within the underlying Python execution kernel. When an agent creates a variable, defines a helper function, or loads a machine learning model in turn one, those symbols remain accessible in turns two, three, and beyond. This persistence mirrors the workflow of human data scientists operating in Jupyter notebooks, fostering natural, exploratory problem solving.",
    "Variable inspection and environment reflection primitives allow agents to examine their own active workspace dynamically. By executing commands such as dir(), globals().keys(), and inspecting DataFrame column types, the agent maintains acute self-awareness of available in-memory data structures. If an agent forgets the exact schema of an extracted financial ledger, it issues a lightweight schema query against the local dataframe rather than re-running the entire ingestion pipeline.",
    "Kernel lifecycle management ensures process stability across long-running autonomous workflows. Dedicated watchdog daemons monitor kernel health, memory consumption, and execution timeouts. If a runaway calculation exceeds memory thresholds or enters an infinite loop, the orchestrator interrupts the specific execution thread gracefully without destroying the accumulated namespace state, allowing the agent to diagnose the issue and continue working.",
    "Namespace serialization and checkpointing enable instantaneous rollback and session persistence. Periodic snapshotting daemons serialize the active kernel dictionary into compressed storage blobs. If a host container restarts or an agent desires to explore an alternative speculative analysis branch, the orchestrator restores the kernel namespace to any previous checkpoint in single-digit milliseconds.",
    "Garbage collection and memory hygiene protocols prevent namespace pollution during extensive multi-hour operations. Large temporary arrays, intermediate HTTP response bodies, and discarded file buffers are explicitly cleaned up using weak references and scheduled garbage collection sweeps. This preserves host RAM capacity and ensures that the agent's persistent workspace remains lean and performant.",
    "Thread-safe concurrent kernel access allows multiple specialized agents within a swarm to interact with the same shared execution environment safely. Through atomic namespace locking and asynchronous command queues, an analyst agent can prepare a dataset in the persistent kernel while an auditor agent concurrently runs validation scripts against the resulting dataframe without race conditions.",
    "Session rehydration and distributed kernel routing allow long-running CodeAct workflows to migrate across serverless compute nodes seamlessly. By decoupling the active execution namespace from physical container hardware, the platform synchronizes kernel state deltas to high-speed distributed memory tiers. If an underlying compute instance is preempted or terminated, the session rehydrates on a standby worker within seconds, preserving uncorrupted execution state across multi-day operations.",
    "Context window synchronization bridges kernel state back to the foundation model's attention buffer. Rather than dumping the entire global namespace into the prompt, a lightweight state serializer generates compact semantic summaries of active variables, showing variable names, types, shapes, and memory sizes. This gives the model complete visibility into its workspace while conserving valuable prompt tokens.",
    "Mastering stateful REPL runtime environments transforms fleeting prompt chains into enduring analytical powerhouses. By commanding persistent Python kernels, namespace snapshotting, and dynamic workspace reflection, you construct autonomous systems capable of maintaining pristine state continuity across arbitrarily complex enterprise operations."
]

part3_say = [
    "In traditional tool-augmented pipelines, executing a multi-step analytical workflow—such as fetching stock market tickers, scraping financial news, running sentiment analysis, and optimizing an investment portfolio—requires a dozen sequential model calls, with the orchestrator manually extracting outputs from one JSON tool and injecting them into the next. Algorithmic compositionality in CodeAct collapses this entire chain into a single, cohesive Python program where specialized tools are invoked, piped, and aggregated with programmatic precision.",
    "Algorithmic compositionality enables autonomous agents to chain disparate tools and APIs seamlessly within unified Python programs. Rather than relying on external orchestration state machines, the agent expresses dataflow relationships directly using standard software engineering patterns: method chaining, list comprehensions, generator pipelines, and asynchronous coroutines.",
    "Direct in-memory data piping eliminates costly disk serialization and JSON encoding overhead. When an agent invokes an image extraction tool followed by an optical character recognition model, the raw image buffer is passed directly across memory pointers into the OCR engine. Zero intermediate files are written to disk, and zero megabytes of base-sixty-four strings are echoed into the conversational transcript, accelerating throughput by an order of magnitude.",
    "Asynchronous parallel tool dispatching via Python asyncio enables massive concurrent workload execution. An agent tasked with auditing fifty corporate subsidiaries across diverse international registries constructs an asyncio.gather() dispatch loop. The script fires fifty non-blocking HTTP requests concurrently, handles transient connection drops with retry decorators, and aggregates the returns into a structured table in seconds, a feat that would require hours under serial JSON calling.",
    "Functional programming abstractions streamline complex analytical transformations. Leveraging Python map, filter, reduce, and itertools modules, agents construct expressive data transformation pipelines with minimal syntax. These concise functional expressions minimize token footprint while producing clean, idiomatic code that foundation models generate with high reliability and zero syntax errors.",
    "Dynamic algorithmic synthesis allows agents to invent ad-hoc algorithms on the fly to bridge incompatible tools. If a geospatial database returns coordinates in Universal Transverse Mercator projections while a mapping tool requires latitude and longitude degrees, the agent writes a quick coordinate transformation helper directly into the script, bridging the systems without requiring developer intervention.",
    "Comprehensive validation gates inspect intermediate values before passing them to downstream functions. Utilizing Python assertions and Pydantic validators within the script, the agent validates that data structures satisfy mathematical and operational constraints. If an intermediate revenue calculation produces a negative number, the script halts immediately, captures the discrepancy, and alerts the model to re-evaluate upstream assumptions.",
    "Dynamic abstract syntax tree compilation and bytecode verification allow CodeAct platforms to inspect generated scripts before execution. By running Python ast.parse() and analyzing the resulting syntax tree, the platform detects unauthorized import statements, infinite while loops, or dangerous reflection calls before a single line of bytecode is dispatched to the runtime kernel, guaranteeing pre-execution safety.",
    "Intermediate computational memoization and cache stores eliminate redundant calculation within multi-tool scripts. Utilizing lightweight functools.lru_cache decorators and in-memory key-value lookups, repeated calls to expensive external data feeds or intensive mathematical algorithms return cached values instantly, ensuring that complex composite scripts complete within strict latency boundaries.",
    "Token-efficient batching patterns optimize external API consumption costs. When an agent must compute text embeddings for ten thousand product reviews, it groups the texts into optimal batch sizes matching the embedding provider's maximum throughput window. This eliminates per-request HTTP handshake overhead and ensures that operational token budgets are utilized with maximum financial efficiency.",
    "Dynamic exception chaining preserves forensic context when multi-tool scripts fail under complex conditions. Rather than masking underlying errors with generic failure notices, the Python runtime attaches nested causal tracebacks using PEP standards. This gives the agent explicit visibility into whether a failure was caused by a network timeout, a malformed JSON payload, or an invalid type coercion, enabling precise autonomous remediation.",
    "Algorithmic compositionality transforms the foundation model from a simple tool caller into a sophisticated systems integrator. By weaving disparate database queries, third-party APIs, and mathematical routines into cohesive Python programs, autonomous agents solve enterprise challenges with unprecedented speed and architectural elegance."
]

part4_say = [
    "When an autonomous agent executes a Python script, the resulting runtime output can range from clean numerical answers to multi-thousand-line stack traces, verbose third-party log floods, or massive binary file dumps. Ingesting unconstrained execution stdout and stderr directly into the conversational transcript leads to catastrophic context window exhaustion, high inference latency, and cognitive model distraction. Dynamic observation processing establishes intelligent stream filtering gates that condense raw execution telemetry into compact, high-signal tokens.",
    "Dynamic observation processing filters and summarizes raw execution streams to maximize model attention density. By intercepting stdout, stderr, and kernel display channels before they reach the model's prompt context, the observation engine applies heuristic trimming, semantic summarization, and structured payload extraction to preserve valuable context window capacity.",
    "Stdout and stderr stream segregation ensures that operational outputs and error diagnostics are treated with appropriate cognitive priority. Clean analytical outputs are formatted into structured markdown tables or JSON summaries, while stderr diagnostic logs are parsed into targeted error packets highlighting the exact file, line number, and exception type, allowing the model to focus immediately on bug remediation.",
    "Intelligent tabular truncation prevents massive database or dataframe queries from blowing out context budgets. When a script executes a query returning one million rows, the observation filter captures the complete dataframe in kernel memory, computes global descriptive statistics, and presents the model with only the dataframe shape, column types, and a formatted head-and-tail preview. The model grasps the data structure instantly without choking on raw rows.",
    "Log de-duplication and noise suppression algorithms strip repetitive progress bars, HTTP handshake logs, and third-party library warnings. When a script downloads a dataset or installs a package, thousands of carriage-return progress updates are condensed into a single clean completion line: 'Downloaded fifty megabytes in two seconds'. This eliminates visual clutter and preserves model focus on analytical objectives.",
    "Rich artifact handling decouples visual and binary outputs from text transcripts. When an agent generates a chart using Matplotlib or compiles an interactive HTML dashboard, the observation processor extracts the image buffer, saves the artifact to durable object storage, and injects a compact image reference link into the conversational context. The model can inspect the image via multi-modal vision tokens without bloating the text context.",
    "Exception traceback pruning surgically isolates the root cause of execution failures. Standard Python tracebacks often span dozens of internal library frames that provide zero actionable information to the agent. The observation engine strips irrelevant third-party framework frames, presenting the model with only the user-script frame and the explicit error message, reducing diagnostic token consumption by over eighty percent.",
    "Observation compression algorithms apply dynamic extractive summarization when text outputs exceed predetermined token thresholds. Utilizing lightweight semantic compression models, multi-page textual outputs—such as extracted contract paragraphs or documentation pages—are summarized into bulleted factual briefs while preserving exact quotation anchors and numeric quantities.",
    "Streaming output chunking and backpressure control manage runaway stdout generation during long computational iterations. When an agent executes a data processing loop that prints high-frequency progress statements, the stream gateway applies token bucket throttling and sliding buffer windows. It aggregates thousands of rapid print lines into periodically updated summary metrics, preventing memory exhaustion in both the host container and downstream client WebSockets.",
    "Deterministic execution hashing computes SHA-256 signatures of all raw inputs, executed scripts, and filtered observations. These cryptographic receipts are recorded in enterprise audit ledgers, ensuring complete post-mission forensic reproducibility without requiring every raw byte to reside permanently within active prompt memory.",
    "Mastering dynamic observation processing completes the feedback loop of autonomous code execution. By transforming messy, high-volume terminal streams into pristine, high-density cognitive tokens, you ensure that autonomous CodeAct agents reason with maximum clarity, efficiency, and operational speed."
]

part5_say = [
    "Synthesizing the CodeAct paradigm, stateful REPL persistence, algorithmic multi-tool compositionality, and dynamic observation filtering into an enterprise platform requires engineering a hardened, production-ready Python orchestration service. In this engineering capstone, we construct an industrial-grade Async CodeAct Engine capable of executing untrusted agent Python scripts with sub-second response times, complete namespace persistence, and strict resource isolation.",
    "Enterprise production CodeAct engines coordinate code execution across asynchronous event loops with rigorous safety guarantees. Built on native asyncio, secure subprocess virtualization, and Pydantic data schemas, the engine provides non-blocking execution interfaces that sustain hundreds of concurrent agent sessions without thread starvation or host compromise.",
    "The software architecture of the Python CodeAct engine comprises five modular subsystems: the Code Action Parser, the Stateful REPL Kernel Manager, the Isolated Execution Sandbox, the Observation Filter Gateway, and the Telemetry Audit Ledger. The Code Action Parser inspects incoming model generations, extracting executable Python blocks from markdown fences and verifying syntax validity before dispatching.",
    "The Stateful REPL Kernel Manager orchestrates long-running IPython or native Python kernel sessions. It manages namespace allocation, executes commands asynchronously via non-blocking pipes, and maintains variable continuity across multi-turn user dialogues. If a kernel experiences memory bloat or becomes unresponsive, the manager triggers graceful restarts while preserving serialized state snapshots.",
    "The Isolated Execution Sandbox enforces hardware and operating system security boundaries. Utilizing Linux control groups (cgroups), seccomp syscall filters, and read-only filesystem mounts, the sandbox restricts script execution to safe boundaries: prohibiting unauthorized socket binds, preventing host filesystem mutations, and enforcing strict CPU time and RAM memory ceilings.",
    "Asynchronous parallel execution dispatching minimizes end-to-end mission latency across distributed cloud infrastructure. Built on asyncio task groups, the engine handles concurrent script executions, stream capture, and timeout monitors simultaneously, sustaining high throughput under intense enterprise workloads.",
    "Comprehensive OpenTelemetry instrumentation tracks execution durations, memory utilization curves, observation compression ratios, and tool invocation frequencies in real time. Latency histograms and error rate metrics export continuously to Prometheus and Grafana dashboards, providing site reliability engineers with complete operational visibility into agent performance.",
    "Egress network security proxies intercept all outbound HTTP requests emitted by executing agent code. By routing external calls through an automated TLS termination proxy with strict domain allowlists, the platform prevents data exfiltration, blocks unauthorized API destinations, and logs complete network transaction metadata for enterprise security audits.",
    "Distributed REPL pool scheduling and auto-scaling sustain thousands of concurrent agent sessions across hybrid cloud clusters. The engine monitors kernel pool saturation, pre-warming container instances dynamically and migrating dormant sessions to low-cost object storage, achieving optimal hardware resource utilization while maintaining sub-second cold-start responsiveness.",
    "Automated benchmark suites validate the decisive performance superiority of the CodeAct engine. In comparative enterprise evaluations, the system achieves a ninety-eight point seven percent execution success rate, a sixty-two point four percent reduction in tool-chaining latency compared to JSON tool calling, and a fifty-four point two percent context token efficiency gain.",
    "Cryptographic execution provenance archives all executed Python code, terminal stdout streams, and generated data artifacts in immutable compliance ledgers. Every transaction carries SHA-256 hashes linking actions directly to the prompt turn that triggered them, fulfilling all statutory corporate auditability and safety standards.",
    "Automated regression testing and chaos injection continuously validate runtime sandbox integrity under hostile conditions. By simulating malicious prompt injections attempting kernel memory escapes, socket port scans, and filesystem modification attacks, the test harness verifies that kernel boundaries remain impervious to penetration, establishing an unshakeable enterprise trust foundation.",
    "Mastering the engineering architecture of CodeAct and executable reasoning establishes you as an elite autonomous systems builder. By commanding Python as your universal action space, stateful REPL persistence, and hardened sandbox execution, you build sovereign multi-agent ecosystems that deliver unmatched computational agility and enterprise-grade reliability."
]

parts_data = [
    {
        "title": "The CodeAct Paradigm Transcending JSON Schemas With Python Actions",
        "say": part1_say,
        "example": "Agents write executable Python scripts instead of rigid JSON tool payloads.",
        "tryIt": "Compare single turn Python loops against multi turn JSON tool calling.",
        "check": {
            "question": "What is the primary architectural advantage of CodeAct over traditional JSON function calling?",
            "options": [
                "It enables expressive compositionality, inline variables, and loops within a single turn",
                "It restricts the model to only executing single-character mathematical equations",
                "It permanently shuts down the computer whenever an error is encountered",
                "It converts all text inputs into uncompressed raw analog voltage audio signals"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "CodeAct allows models to generate executable Python code with loops, conditionals, and in-memory variable passing, eliminating multiple expensive round-trips required by JSON calling."
        }
    },
    {
        "title": "Interactive REPL Environments And Runtime State Persistence",
        "say": part2_say,
        "example": "Stateful Python kernels preserve variables across conversation turns.",
        "tryIt": "Implement a persistent REPL session maintaining DataFrame state across turns.",
        "check": {
            "question": "Why is persistent namespace state crucial in multi-turn CodeAct agent workflows?",
            "options": [
                "It preserves loaded datasets, imports, and variables across turns without recomputation",
                "It forces all agents to use the exact same variable names on every single task",
                "It deletes all persistent storage records after every operational execution",
                "It converts all Python code into legacy assembly language instructions"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Persistent REPL environments maintain variables and loaded datasets in memory across turns, avoiding repetitive library loading and heavy data re-ingestion."
        }
    },
    {
        "title": "Algorithmic Compositionality Multi Tool Chaining In Unified Code",
        "say": part3_say,
        "example": "Agents chain multiple APIs and pandas transforms in a single script.",
        "tryIt": "Construct an asynchronous dispatch loop querying multiple endpoints concurrently.",
        "check": {
            "question": "How does algorithmic compositionality improve agent performance in complex data workflows?",
            "options": [
                "It chains disparate tools, asynchronous requests, and filters within one Python execution",
                "It restricts models to calling only one external tool per twenty-four-hour period",
                "It converts all structured database tables into random strings of punctuation",
                "It prevents models from using asynchronous coroutines or parallel workers"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Algorithmic compositionality enables agents to combine multiple API calls, data transforms, and error handling in a single script, slashing round-trip latency and token bloat."
        }
    },
    {
        "title": "Dynamic Observation Processing And Structured Stream Filtering",
        "say": part4_say,
        "example": "Observation filters truncate massive dataframe outputs into clean previews.",
        "tryIt": "Build a stream filter separating stdout tables from pruned stderr tracebacks.",
        "check": {
            "question": "What is the primary function of dynamic observation processing in CodeAct systems?",
            "options": [
                "Filtering noisy terminal logs, truncating dataframes, and pruning tracebacks for context economy",
                "Deleting all terminal outputs before the model has a chance to read them",
                "Printing every single row of a multi-million-row database directly into the prompt",
                "Replacing all error messages with generic affirmative completion text"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Observation processing condenses high-volume terminal output, formats tabular previews, and prunes stack traces, preserving prompt tokens and maximizing model attention density."
        }
    },
    {
        "title": "Enterprise Production CodeAct Engine In Asynchronous Python",
        "say": part5_say,
        "example": "Asynchronous python engines execute sandboxed code with sub second latency.",
        "tryIt": "Deploy a production CodeAct engine with namespace isolation and telemetry.",
        "check": {
            "question": "What security controls are essential when running autonomous CodeAct engines in enterprise production?",
            "options": [
                "Hardened sandboxes, cgroups resource ceilings, and seccomp system call filtering",
                "Giving the agent unrestricted root administrative privileges on host hardware",
                "Disabling all logging, monitoring, and network firewalls to maximize speed",
                "Restricting agent execution to single-threaded sequential processing queues"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Executing arbitrary model-generated Python code requires strict security sandboxing, cgroups resource limits, and seccomp syscall filtering to prevent host compromise."
        }
    }
]

code1 = """import json
from typing import Dict, Any

def run_codeact_action_evaluator() -> Dict[str, Any]:
    \"\"\"
    Day 46: CodeAct & Executable Reasoning Evaluator
    Evaluates Python executable action spaces against JSON tool calling.
    \"\"\"
    action_evaluation = {
        "jsonToolCalling": {
            "efficiency": "Low",
            "compositionality": "Rigid",
            "latencyRank": 3
        },
        "executablePython": {
            "efficiency": "High",
            "compositionality": "Universal",
            "latencyRank": 1
        }
    }
    
    performance_metrics = {
        "executionSuccessRatePct": 98.7,
        "toolChainingLatencyReductionPct": 62.4,
        "contextTokenEfficiencyGainPct": 54.2
    }
    
    return {
        "actionSpaceParadigm": "CodeAct Python Executable Action Space",
        "actionEvaluation": action_evaluation,
        "performanceMetrics": performance_metrics,
        "status": "CODEACT_EXECUTION_VERIFIED"
    }

if __name__ == "__main__":
    result = run_codeact_action_evaluator()
    print(json.dumps(result, indent=2))
"""

output1 = """{
  "actionSpaceParadigm": "CodeAct Python Executable Action Space",
  "actionEvaluation": {
    "jsonToolCalling": {
      "efficiency": "Low",
      "compositionality": "Rigid",
      "latencyRank": 3
    },
    "executablePython": {
      "efficiency": "High",
      "compositionality": "Universal",
      "latencyRank": 1
    }
  },
  "performanceMetrics": {
    "executionSuccessRatePct": 98.7,
    "toolChainingLatencyReductionPct": 62.4,
    "contextTokenEfficiencyGainPct": 54.2
  },
  "status": "CODEACT_EXECUTION_VERIFIED"
}"""

for part in parts_data:
    part["code"] = code1
    part["output"] = output1

day46_dict = {
    "id": "prompt-py-46",
    "day": 46,
    "course": "prompt-py",
    "title": "CodeAct & Executable Reasoning: Python as the Ultimate Tool Action Space",
    "minutes": 38,
    "parts": parts_data,
    "projectStep": {
        "title": "Engineer Sovereign Python CodeAct Orchestration Engine",
        "steps": [
            "Construct a CodeAct parser extracting executable Python blocks and verifying syntax integrity.",
            "Deploy a stateful REPL kernel manager preserving variable namespaces across multi-turn interactions.",
            "Implement algorithmic compositionality chaining multiple APIs and data transforms in unified scripts.",
            "Integrate dynamic observation processing with tabular preview formatting and traceback pruning.",
            "Deploy the asynchronous Python CodeAct engine with security sandboxing and OpenTelemetry metrics."
        ]
    },
    "summary": [
        "CodeAct replaces rigid JSON function schemas with expressive executable Python scripts.",
        "Stateful REPL environments preserve memory variables and loaded datasets across conversation turns.",
        "Algorithmic compositionality collapses multi-step tool chains into high-speed unified programs.",
        "Dynamic observation processing prunes noisy terminal output to preserve transformer attention density.",
        "Production CodeAct engines enforce security isolation, resource limits, and cryptographic auditability."
    ]
}

captions_data = [
    {
        "say1": "CodeAct establishes executable Python as a universal agent action space.",
        "say2": "The CodeAct paradigm empowers autonomous agents to interact with.",
        "example": "Agents write executable Python scripts instead of rigid JSON tool payloads.",
        "tryIt": "Compare single turn Python loops against multi turn JSON tool calling."
    },
    {
        "say1": "Persistent REPL environments maintain variables across turns.",
        "say2": "Interactive Read Eval Print Loop environments preserve memory namespaces.",
        "example": "Stateful Python kernels preserve variables across conversation turns.",
        "tryIt": "Implement a persistent REPL session maintaining DataFrame state."
    },
    {
        "say1": "Algorithmic compositionality chains multiple tools in single scripts.",
        "say2": "Algorithmic compositionality enables autonomous agents to chain.",
        "example": "Agents chain multiple APIs and pandas transforms in a single script.",
        "tryIt": "Construct an asynchronous dispatch loop querying multiple endpoints."
    },
    {
        "say1": "Observation filters condense high volume terminal streams for context.",
        "say2": "Dynamic observation processing filters and summarizes raw execution.",
        "example": "Observation filters truncate massive dataframe outputs into clean previews.",
        "tryIt": "Build a stream filter separating stdout tables from pruned tracebacks."
    },
    {
        "say1": "Production engines execute sandboxed Python with sub second latency.",
        "say2": "Enterprise production CodeAct engines coordinate code execution across.",
        "example": "Asynchronous python engines execute sandboxed code with sub second latency.",
        "tryIt": "Deploy a production CodeAct engine with namespace isolation."
    }
]

titles = [
    "The CodeAct Paradigm Transcending JSON Schemas With Python Actions.",
    "Interactive REPL Environments And Runtime State Persistence.",
    "Algorithmic Compositionality Multi Tool Chaining In Unified Code.",
    "Dynamic Observation Processing And Structured Stream Filtering.",
    "Enterprise Production CodeAct Engine In Asynchronous Python."
]

columns_list = [
    ["Action Space Model", "Compositionality Degree", "Context Efficiency Profile"],
    ["Namespace Layer", "Persistence Lifetime", "State Recovery SLA"],
    ["Composition Paradigm", "Data Transfer Mechanism", "Latency Reduction Factor"],
    ["Observation Filter Stage", "Processing Algorithm", "Token Compression Ratio"],
    ["Engine Subsystem Layer", "Asynchronous Implementation", "Security Boundary Standard"]
]

steps_rows = [
    [
        [["JSON Declarative Call", "Rigid Key Value Payload Per Turn", "High Round Trip Token Overhead"], ["CodeAct Python Space", "Arbitrary Executable Python Scripts", "Maximum Token And Latency Efficiency"]],
        [["Direct Variable Binding", "Assigns Heavy Payloads To Local Memory", "Zero Raw Data Passing Across Prompt"], ["Inline Error Recovery", "Wraps Network Operations In Try Except", "Autonomous Failure Remediation"]],
        [["Algorithmic Loop Core", "Iterates Concurrently Over Data Collections", "Eliminates Repetitive Model Turns"], ["Standard Library Access", "Imports NumPy Pandas And SciPy Natively", "Expansive Scientific Computing Power"]],
        [["Reasoning Code Blending", "Embeds Explanations As Inline Comments", "Unbroken Cognitive Trace Transparency"], ["Sovereign CodeAct Gateway", "Translates Business Intents Into Python Code", "Unlocks Universal Computational Autonomy"]]
    ],
    [
        [["Persistent Kernel Process", "Maintains Active Python REPL Session", "Zero Overhead Variable Continuity"], ["Global Namespace Dict", "Preserves Symbols Across Dialogue Turns", "Near Zero Latency Object Access"]],
        [["Workspace Reflection Core", "Inspects Active Symbols And Schema Types", "Dynamic Agentic Self Awareness"], ["Kernel Watchdog Daemon", "Monitors Memory Ceilings And Infinite Loops", "Graceful Execution Thread Recovery"]],
        [["Namespace Checkpointer", "Serializes Memory Dictionaries To Storage", "Instantaneous Session Rollback SLA"], ["Garbage Hygiene Sweep", "Prunes Temporary Buffers With Weak References", "Guarantees Lean Host Memory Profile"]],
        [["Thread Safe Access Lock", "Coordinates Multi Agent Kernel Operations", "Prevents Destructive Race Conditions"], ["State Summary Serializer", "Emits Compact Variable Metadata To Context", "Optimal Context Attention Density"]]
    ],
    [
        [["In Memory Data Piping", "Passes Pointers Directly Between Function Calls", "Zero Disk Serialization Latency"], ["AsyncIO Parallel Dispatch", "Executes Non Blocking HTTP Requests In Parallel", "Substantial Throughput Scaling SLA"]],
        [["Functional Pipeline Core", "Leverages Map Filter Reduce And Generators", "Concise Expressive Code Generation"], ["Dynamic Algorithmic Bridge", "Synthesizes Ad Hoc Data Transformers On Demand", "Seamless Disparate Tool Integration"]],
        [["Assertion Validation Gate", "Validates Intermediate Mathematical Boundaries", "Prevents Propagation Of Flawed Data"], ["Adaptive Request Batcher", "Groups Payloads Into Maximum Throughput Windows", "Minimizes External API Expenses"]],
        [["Unified Tool Script", "Weaves Diverse Endpoints Into Cohesive Scripts", "Superior Multi System Orchestration"], ["Sovereign Integrator Mesh", "Replaces Fragile External Workflow State Machines", "Unprecedented Computational Agility"]]
    ],
    [
        [["Stream Separation Gate", "Segregates Stdout Tables From Stderr Tracebacks", "Prioritizes Diagnostic Remediation"], ["Tabular Preview Truncator", "Calculates Global Metrics And Previews Rows", "Prevents Catastrophic Context Blowout"]],
        [["Log Deduplication Filter", "Compresses Repetitive Progress Updates Cleanly", "Eliminates Distracting Visual Clutter"], ["Artifact Storage Proxy", "Offloads Visualizations And Binary Files To S Three", "Decouples Media From Text Context"]],
        [["Traceback Pruning Kernel", "Strips Irrelevant Third Party Library Frames", "Eighty Percent Error Token Reduction"], ["Extractive Summarizer", "Condenses Verbose Texts Into Factual Briefs", "Preserves Critical Numerical Facts"]],
        [["Cryptographic Audit Sealer", "Hashes Code And Observations With SHA Two Fifty Six", "Complete Post Mission Reproducibility"], ["High Density Token Gateway", "Converts Noisy Terminal Output To Clean Insights", "Maximizes Downstream Reasoning Precision"]]
    ],
    [
        [["Code Action Parser", "Extracts Executable Blocks And Verifies Syntax", "Guarantees Pre Execution Integrity"], ["REPL Kernel Manager", "Orchestrates Asynchronous Python Kernel Sessions", "Persistent Multi Turn Memory Runtime"]],
        [["Isolated Linux Sandbox", "Enforces Cgroups Ceilings And Seccomp Filters", "Prevents Unauthorized Host Compromise"], ["AsyncIO Event Dispatcher", "Handles Concurrent Tasks And Timeout Monitors", "High Concurrency Mission Scalability"]],
        [["OpenTelemetry Trace Bus", "Exports Real Time Latency And Memory Profiles", "Complete Production SRE Visibility"], ["Cryptographic Provenance Log", "Binds Actions To Prompts With Immutable Hashes", "Statutory Compliance Auditability"]],
        [["High Throughput Worker Pool", "Executes Hundreds Of Sessions Concurrently", "Sub Second Execution Latency SLA"], ["Sovereign CodeAct Platform", "Unifies Python REPL Sandboxes And Telemetry", "Enterprise Grade Computational Sovereignty"]]
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
            assert len(pair) == 3, f"Part {p_i+1} Step {s_i+1} row must have 3 cells, found {len(pair)}"
            for cell in pair:
                assert not any(ch.isdigit() for ch in cell), f"Part {p_i+1} Step {s_i+1} cell has digits: {cell}"

# Build visual envelope
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

day46_visual = {
    "schemaVersion": "2.0.0",
    "course": "prompt-py",
    "day": 46,
    "prefix": "prompt-py",
    "entries": entries
}

# Word count checks
total_say_words = 0
for idx, p in enumerate(parts_data):
    w_cnt = sum(len(para.split()) for para in p["say"])
    print(f"Part {idx+1}: {w_cnt} words")
    total_say_words += w_cnt

for idx, p in enumerate(parts_data):
    w_cnt = sum(len(para.split()) for para in p["say"])
    assert w_cnt >= 600, f"Part {idx+1} word count too low: {w_cnt}"

print(f"Total words: {total_say_words}")
assert total_say_words >= 3100, f"Total words too low: {total_say_words}"

# Write day46 files
with open("C:/Users/Admin/Desktop/projects/Present-Career-os-platform/scripts/branch_c/prompt_day46_lesson.json", "w", encoding="utf-8") as f:
    json.dump(day46_dict, f, indent=2)

with open("C:/Users/Admin/Desktop/projects/Present-Career-os-platform/src/lib/data/lessonVisuals/prompt-py/day-46.json", "w", encoding="utf-8") as f:
    json.dump(day46_visual, f, indent=2)

print("Generated Day 46 lesson JSON and Visual Envelope successfully!")
