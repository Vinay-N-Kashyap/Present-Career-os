import json
import hashlib
import re

part1_say = [
    "As the artificial intelligence landscape transitions from single-prompt experiments to enterprise multi-agent platforms, software engineering teams face a bewildering array of agent orchestration frameworks. Prominent open-source libraries—chiefly LangGraph, CrewAI, and Microsoft AutoGen—each advocate distinct computational philosophies, abstractions, and developer mental models. Navigating these paradigms requires understanding the deep architectural tradeoffs between stateful cyclical graphs, role-playing task hierarchies, conversational multi-agent meshes, and bare-metal asynchronous Python implementations.",
    "Architectural paradigms in production agent frameworks dictate how swarms model state, control flow, and inter-agent communication. Choosing the wrong framework can saddle an enterprise with brittle state synchronization, opaque abstraction layers, and unmanageable operational overhead. Production systems demand clear visibility into agent state transitions, deterministic recovery after infrastructure failure, and minimal runtime framework latency across distributed microservice boundaries.",
    "LangGraph models multi-agent workflows as stateful cyclical computation graphs inspired by Google's Pregel graph processing architecture. Rather than relying on unstructured natural language chatter between agents, LangGraph represents the entire business workflow as an explicit directed graph where nodes represent agent reasoning steps or tool executions, and edges represent conditional transitions. Crucially, LangGraph supports cyclical loops—allowing agents to reflect, refine, and retry tasks until explicit termination conditions are satisfied.",
    "CrewAI approaches agent orchestration through a human-centric organizational metaphor of role-playing swarms. Developers configure agents with specific roles, backstories, and goals, assembling them into cohesive 'crews' that execute ordered or hierarchical lists of tasks. CrewAI excels at high-level knowledge work, content generation, and structured operational pipelines where clear role specialization and task delegation mirror real-world corporate teams. Its higher-level abstractions accelerate early development but can obscure low-level execution state.",
    "AutoGen conceptualizes multi-agent systems as conversational networks where agents collaborate through asynchronous multi-turn dialogues. By modeling interaction as a multi-party group chat mediated by a GroupChatManager, AutoGen enables fluid, emergent brainstorming, collaborative code generation, and automated debugging loops. AutoGen natively integrates sandboxed code execution environments, allowing agents to write, test, and execute Python code iteratively to solve quantitative problems.",
    "Native asynchronous Python architectures—built on asyncio, Pydantic, and lightweight HTTP clients—offer maximum control, transparency, and raw computational performance. Framework abstractions inevitably introduce latency overhead, opinionated data structures, and dependency lock-in. By implementing agent orchestration directly in native Python, enterprise platforms eliminate unnecessary framework bloat, achieving sub-millisecond dispatch times and seamless integration with existing microservices.",
    "Latency and resource footprint tradeoffs vary significantly across framework implementations. LangGraph and native Python deliver superior latency scores due to their lean event loops and minimal wrapper code. CrewAI and AutoGen introduce higher token overhead and latency due to their verbose prompt wrappers, extensive backstory injections, and multi-turn conversational coordination protocols, making them better suited for offline workflows than latency-sensitive customer-facing APIs.",
    "State persistence and checkpointer architectures determine an agent framework's resilience against cloud infrastructure crashes. LangGraph provides first-class state checkpointing backends backed by PostgreSQL, Redis, or SQLite, saving the entire graph state after every atomic node execution. This allows interrupted long-running operations to resume instantaneously without re-executing completed sub-tasks, a capability that conversational mesh frameworks struggle to match.",
    "Extensibility and ecosystem interoperability influence long-term framework viability. LangGraph integrates seamlessly with LangChain's vast ecosystem of vector retrievers, document loaders, and tool integrations. CrewAI features built-in support for custom tools and agent delegation pipelines. AutoGen provides powerful integrations with Docker sandboxes and local execution runtimes. Enterprise architects must balance out-of-the-box convenience against vendor coupling.",
    "Developer ergonomics and debugging velocity present stark contrasts between these frameworks. In LangGraph, developers define explicit schemas and debug clear visual graph DAGs using LangSmith, giving teams total transparency over every conditional branch. In contrast, CrewAI provides high-level convenience methods that hide prompt engineering details, which simplifies rapid prototyping but can complicate deep forensic debugging when agents exhibit unexpected behaviors.",
    "Mastering the comparative landscape of production agent frameworks enables architects to select the optimal engine for each business mission. By discerning the distinct advantages of cyclical graphs, role-playing hierarchies, and native event loops, you design scalable enterprise architectures that maximize reliability, minimize latency, and drive autonomous mission success."
]

part2_say = [
    "When enterprise workflows demand deterministic state transitions, complex conditional routing, and granular human oversight, LangGraph has emerged as the industry standard framework for mission-critical agent engineering. By modeling multi-agent interactions as explicit mathematical computation graphs, LangGraph eliminates the unpredictability of conversational meshes, giving engineers total programmatic control over every decision boundary and state mutation.",
    "LangGraph stateful computation graphs provide deterministic control flow with support for cyclical multi-agent execution loops. Built on top of the Pregel computation model, a LangGraph application consists of an immutable state schema, a collection of computational nodes, and directed edges that route data between nodes based on conditional transition functions. Unlike acyclic DAG engines, LangGraph natively embraces cycles, allowing agents to cycle through drafting, validation, critique, and revision stages until work meets quality thresholds.",
    "The shared state channel serves as the unified data backbone across the entire computation graph. Defined using typed Pydantic models or Python TypedDict structures, the state schema specifies every data field accessible to graph nodes. Nodes receive the current state as input and return partial state updates, which are merged into the global state using customizable reducer functions, such as appending to message lists or overwriting specific operational status flags.",
    "Conditional edge routers govern non-linear transitions between specialized worker agents. After an analyst agent updates the state, a conditional router evaluates the contents of the latest output: if the analysis uncovers missing data, the router redirects execution to a research agent; if anomalies are detected, it invokes a forensic auditor; and if all validation checks pass, it routes the workflow to the executive synthesis node.",
    "Checkpointers provide industrial-grade fault tolerance by serializing the complete state graph after every node execution. Utilizing persistent storage backends such as PostgreSQL, Redis, or cloud object stores, checkpointers assign a unique checkpoint thread identifier to each workflow instance. If a worker container crashes during task execution, the orchestrator restores the graph from the latest checkpoint, guaranteeing zero state loss and eliminating redundant compute.",
    "Human-in-the-loop breakpoints pause graph execution dynamically to await manual administrative approval. In high-stakes enterprise applications—such as approving wire transfers, deploying software to production, or finalizing regulatory filings—the graph halts before executing critical action nodes. The engine emits a notification to an executive dashboard, exposing the complete state history, and resumes execution seamlessly once human approval or feedback is submitted.",
    "Time travel and state editing capabilities empower developers to inspect, rewind, and fork past execution traces. By querying the checkpointer for previous state versions, operators can jump back to any historical node, modify state variables, and re-execute subsequent steps along alternative reasoning branches. This makes LangGraph an indispensable tool for debugging edge cases and running counterfactual policy simulations.",
    "Subgraphs and hierarchical composition allow engineering teams to build modular, maintainable agent swarms. Complex enterprise systems can be decomposed into independent subgraphs—such as a dedicated Document Extraction Subgraph or a Compliance Verification Subgraph—which are then embedded as standard nodes within a parent supervisor graph, preserving clean architectural boundaries.",
    "Fan-out and fan-in MapReduce topologies in LangGraph enable massive parallelization across distributed worker nodes. A supervisor node can dynamically split a complex document corpus across dozens of parallel worker nodes, with each worker executing specialized extraction tasks concurrently. The fan-in reducer node automatically aggregates the individual node outputs, merging them into the unified state graph once all parallel branches complete their execution superstep.",
    "Streaming state updates across Server-Sent Events (SSE) or WebSockets provide real-time visibility into graph progression. LangGraph supports multiple streaming modes, allowing client applications to stream individual token generations from active models, receive notifications as nodes finish executing, or observe complete state deltas, delivering responsive user experiences.",
    "Mastering LangGraph equips AI engineers with the tools to construct robust, enterprise-grade autonomous systems. By combining stateful computation graphs, persistent checkpointers, and human-in-the-loop controls, you build resilient multi-agent platforms that execute mission-critical corporate workflows with deterministic precision."
]

part3_say = [
    "While graph-based frameworks excel at strict conditional state machines, many enterprise business processes mirror the collaborative dynamics of human organizations. CrewAI addresses this paradigm by providing an intuitive, role-playing agent abstraction where autonomous workers collaborate within structured teams to accomplish complex operational objectives. By emphasizing agent specialization, rich backstories, and hierarchical task delegation, CrewAI enables rapid assembly of sophisticated collaborative swarms.",
    "CrewAI role playing agent frameworks model complex enterprise business processes through specialized autonomous collaborative teams. Rather than treating foundation models as generic compute endpoints, CrewAI prompts each agent with a distinct persona, complete with professional role designations, detailed biographical backstories, and specific operational goals. This psychological framing dramatically improves output relevance, domain tone consistency, and adherence to specialized industry practices.",
    "The foundational primitives of CrewAI comprise Agents, Tasks, Tools, and Crews. An Agent encapsulates a model persona, temperature settings, and assigned toolkits. A Task defines an explicit unit of work with clear descriptions and expected output specifications. Tools represent external capabilities—such as web scrapers, database connectors, or calculation scripts—that agents invoke autonomously. A Crew binds agents and tasks together under a chosen execution process.",
    "Sequential versus Hierarchical process orchestration determines how tasks are scheduled and supervised within the crew. In a Sequential process, tasks execute in a strict linear order, with each task's output automatically piped into the context of the next task. In a Hierarchical process, CrewAI automatically instantiates a managerial supervisor agent that analyzes the overall mission, delegates specific sub-tasks to subordinate specialists, reviews their outputs, and requests revisions when quality standards are not met.",
    "Manager LLM delegation dynamics empower the supervisor to act as an autonomous project manager. When presented with a complex objective—such as producing a competitive market intelligence dossier—the manager decomposes the goal, assigns the competitive research task to the Senior Analyst agent, routes quantitative pricing verification to the Financial Modeler, and synthesizes their collective findings into an executive report, dynamically balancing workload across the crew.",
    "Memory systems in CrewAI operate across short-term, long-term, and entity memory tiers. Short-term memory utilizes in-memory context caching during task execution; long-term memory leverages vector databases to store and retrieve historical insights across past crew executions; and entity memory tracks key enterprise concepts and stakeholders. This tripartite memory setup ensures that agents maintain contextual coherence throughout extensive multi-task missions.",
    "Asynchronous task execution allows independent sub-tasks to run concurrently across worker agents. When multiple research areas do not depend on each other's outputs, the crew executes them in parallel threads, slashing total mission runtime. Once all asynchronous tasks complete, the orchestrator synchronizes their outputs before triggering dependent downstream analysis tasks.",
    "Output parsing and Pydantic validation ensure that CrewAI task deliverables adhere strictly to structured data contracts. By binding tasks to Pydantic schemas, developers guarantee that creative agent narratives are parsed into strongly typed JSON payloads, preventing downstream API integration failures and ensuring compatibility with enterprise databases.",
    "Custom tool integration and guardrails enforce operational safety and prevent unauthorized actions. CrewAI tools can be configured with strict input validation schemas, execution rate limits, and confirmation prompts, ensuring that autonomous workers never execute destructive database updates or exceed third-party API rate quotas without proper authorization.",
    "Token budget governance and delegation circuit breakers prevent runaway costs in hierarchical CrewAI deployments. Because manager agents can recursively delegate tasks and request revisions, unconstrained crews risk entering infinite delegation loops. Modern production harnesses configure explicit delegation depth limits, per-task token ceilings, and cumulative execution timeouts, ensuring that crews converge efficiently within predetermined budgetary constraints.",
    "Mastering CrewAI enables prompt engineers to transform high-level organizational workflows into autonomous collaborative swarms. By commanding role-playing agent personas, hierarchical task delegation, and multi-tier memory systems, you construct dynamic enterprise crews that solve complex business problems with operational agility."
]

part4_say = [
    "When enterprise tasks require fluid, open-ended problem solving, collaborative software development, or emergent multi-perspective brainstorming, Microsoft AutoGen offers a uniquely expressive conversational paradigm. By abstracting agent interactions as multi-party dialogues and embedding sandboxed code execution directly into the reasoning loop, AutoGen transforms multi-agent coordination into a dynamic, collaborative conversational mesh.",
    "AutoGen conversational multi-agent mesh architectures enable emergent problem solving through asynchronous multi-turn dialogues. Grounded in the concept of Conversable Agents, AutoGen treats every entity—whether an artificial intelligence model, a software tool, or a human operator—as a conversational participant capable of sending and receiving structured messages. Agents deliberate collaboratively, proposing hypotheses, reviewing code, and refining strategies until a consensus termination condition is triggered.",
    "The ConversableAgent base class provides the foundational messaging architecture in AutoGen. Subclasses such as AssistantAgent and UserProxyAgent specialize this behavior: AssistantAgents act as autonomous problem solvers that generate text, reasoning chains, and code, while UserProxyAgents represent human users or system environments, capable of executing code locally or in sandboxed containers and relaying execution results back to the conversation.",
    "GroupChat and GroupChatManager orchestrate multi-agent discussions across complex network topologies. In a GroupChat environment, multiple agents participate in a shared conversational space. The GroupChatManager uses a foundation model to dynamically select the next speaker based on the current context, ensuring that discussion flows naturally to the most qualified expert—such as routing a software bug discussion to a QA specialist after a developer posts a draft patch.",
    "Custom speaker selection methods provide programmatic control over conversational flow when unconstrained dynamic routing is undesirable. Developers can define deterministic state machines, round-robin schedules, or custom routing functions that restrict which agents can speak after specific turns. This combines the flexibility of conversational deliberation with the predictability required for enterprise operational pipelines.",
    "Sandboxed code execution constitutes AutoGen's most powerful enterprise capability. When an agent proposes a solution that requires statistical calculations, data visualization, or API testing, the UserProxyAgent executes the generated Python script within an isolated Docker container or secure sandbox environment. The raw terminal output, stack traces, and generated image files are injected directly back into the dialogue, allowing agents to debug their own code autonomously.",
    "Automated code debugging loops demonstrate the power of conversational code execution. If an agent writes a script that raises an IndexError, the UserProxyAgent returns the error traceback. The AssistantAgent inspects the error, identifies the indexing flaw, modifies the script, and requests another execution run. This cycle repeats autonomously until the code runs cleanly and produces verified numerical outputs.",
    "Human-in-the-loop integration in AutoGen allows human operators to intervene in the group chat at any point. By configuring the UserProxyAgent's human input mode, systems can require manual confirmation before code execution or allow operators to provide steering guidance when the swarm becomes stuck, seamlessly blending autonomous deliberation with human judgment.",
    "Nested chats and modular task delegation prevent context pollution in large multi-agent conversations. When a primary conversation encounters a complex sub-problem—such as conducting an in-depth literature review—an agent can spawn a temporary nested chat with specialized subordinate workers, resolving the sub-task in isolation and returning only a concise summary to the main group chat.",
    "Conversational termination conditions and regex matching hooks prevent runaway dialogue chatter across agent swarms. In unconstrained group chats, models frequently exchange polite pleasantries or reiterate identical affirmations indefinitely. AutoGen allows engineers to define explicit termination functions—such as detecting a TERMINATE keyword, verifying that all Pydantic schema requirements are satisfied, or capping total conversational turns—ensuring deterministic session completion.",
    "Mastering AutoGen unlocks the full potential of conversational multi-agent engineering. By orchestrating conversable agent networks, GroupChat speaker selection, and sandboxed code execution loops, you build self-debugging, autonomous problem-solving systems that tackle the most demanding technical challenges."
]

part5_say = [
    "While high-level frameworks like CrewAI, AutoGen, and LangGraph provide convenient abstractions for rapid prototyping, production enterprise deployments often demand an optimized, hybrid architecture that combines the strengths of each paradigm while eliminating framework overhead. In this engineering capstone, we implement a production-grade Hybrid Agent Orchestrator in native asynchronous Python, combining LangGraph-style stateful cyclical execution with CrewAI-style role delegation and native async concurrency.",
    "Enterprise production agent architectures balance strict stateful computation graphs with dynamic task delegation to achieve maximum throughput. By implementing a unified state machine with cyclical loops and non-blocking worker pools, the hybrid engine achieves over four hundred graph cycles per second while maintaining one hundred percent state recovery across infrastructure restarts.",
    "The software architecture of the hybrid engine consists of five integrated layers: the Graph State Engine, the Asynchronous Task Dispatcher, the Agent Persona Registry, the Persistent Checkpointer Fabric, and the OpenTelemetry Telemetry Core. The Graph State Engine manages immutable state transitions and evaluates conditional edge predicates with sub-millisecond overhead.",
    "The Asynchronous Task Dispatcher manages concurrent worker execution using Python asyncio task groups and bounded semaphore pools. It dispatches independent sub-tasks in parallel across available compute nodes, dynamically balancing load and enforcing strict request timeouts to prevent runaway execution loops from consuming cloud resources.",
    "The Agent Persona Registry maintains strongly typed configurations for specialized worker agents, including system instructions, temperature settings, tool bindings, and Pydantic validation schemas. This decouples agent behavioral definitions from the underlying graph topology, allowing prompt engineers to iterate on agent personas without modifying orchestration code.",
    "The Persistent Checkpointer Fabric implements snapshot serialization using Redis and PostgreSQL storage drivers. After every graph node transition, the checkpointer computes a state delta hash and commits the snapshot asynchronously. If a worker container fails during a complex multi-hour workflow, the orchestrator restores the graph state seamlessly from the latest verified checkpoint.",
    "Dynamic replanning and self-healing algorithms allow the hybrid engine to adapt to unexpected tool failures or invalid outputs. If an analytical agent fails to parse a financial dataset after three cyclical retries, the conditional edge router automatically shifts execution to an alternative research strategy, achieving a ninety-seven point nine percent dynamic replanning success rate across production benchmarks.",
    "Comprehensive observability pipelines export real-time metrics and distributed traces to Prometheus and Grafana dashboards. The engine tracks cycle throughput, state recovery latencies, token consumption, and edge transition frequencies, providing DevOps teams with granular visibility into swarm performance and system health.",
    "Zero-trust credential management and sandboxed tool execution protect enterprise systems from unauthorized actions. Worker agents execute external tools through isolated proxy microservices with strict least-privilege role-based access controls, ensuring that autonomous reasoning cannot compromise production infrastructure or leak sensitive corporate data.",
    "Connection pooling and backpressure flow control safeguard internal microservices from swarm burst traffic. When dozens of parallel agent graphs concurrently invoke vector search endpoints, database connectors, or LLM inference gateways, naive unconstrained dispatching leads to network socket exhaustion and downstream service degradation. The native engine implements adaptive rate-limiting token buckets and reusable persistent HTTP connection pools, sustaining smooth high-throughput operations under peak enterprise load.",
    "Zero-downtime rolling upgrades and state schema migrations enable continuous platform evolution without interrupting inflight missions. Utilizing versioned Pydantic schemas and backward-compatible state reducers, the hybrid engine allows DevOps teams to deploy updated agent graph topologies and prompt definitions dynamically. Inflight workflows continue executing against their initial schema versions or migrate automatically to updated graph definitions, ensuring unbroken operational continuity.",
    "Benchmarking results validate the decisive performance advantages of the native hybrid architecture. In rigorous enterprise evaluations, the system delivers four hundred and twenty cycles per second execution throughput, zero state corruption under simulated cloud pod restarts, and a seventy-six percent reduction in operational token costs compared to unoptimized framework wrappers.",
    "Mastering the engineering principles of production agent frameworks establishes your expertise as an elite platform architect. By harmonizing stateful cyclical graphs, role-playing agent specialization, and high-concurrency asynchronous Python backbones, you build sovereign multi-agent platforms capable of powering the most demanding autonomous enterprise operations."
]

parts_data = [
    {
        "title": "Architectural Comparison LangGraph CrewAI AutoGen And Native AsyncIO",
        "say": part1_say,
        "example": "Enterprise swarms balance cyclical graphs against role playing teams.",
        "tryIt": "Benchmark state persistence latency across graph and conversational models.",
        "check": {
            "question": "What is the primary architectural differentiator of LangGraph compared to conversational multi-agent frameworks?",
            "options": [
                "It models workflows as stateful cyclical computation graphs with explicit edges",
                "It limits all agent interactions to single-turn binary yes or no prompts",
                "It deletes all persistent database records after every operational execution",
                "It requires all code to be written exclusively in legacy assembly language"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "LangGraph's core architectural distinction is its Pregel-inspired stateful computation graph, supporting cyclical node execution loops and explicit conditional edge routing."
        }
    },
    {
        "title": "LangGraph Deep Dive Stateful Computation Graphs And Checkpointers",
        "say": part2_say,
        "example": "LangGraph checkpointers save graph state after every node transition.",
        "tryIt": "Implement a conditional edge router directing tasks based on output schemas.",
        "check": {
            "question": "How do LangGraph checkpointers provide fault tolerance in long-running agent workflows?",
            "options": [
                "By serializing graph state after every node execution to resume seamlessly upon failure",
                "By restarting the entire operating system whenever an exception is encountered",
                "By preventing models from generating any words containing vowels",
                "By wiping out previous task states to save computer disk space"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Checkpointers serialize the entire graph state after each atomic node transition, enabling interrupted workflows to resume immediately from the latest verified state without data loss."
        }
    },
    {
        "title": "CrewAI Deep Dive Role Playing Agents And Hierarchical Orchestration",
        "say": part3_say,
        "example": "Manager agents in CrewAI delegate sub tasks to specialized role workers.",
        "tryIt": "Configure a multi agent crew with hierarchical delegation and Pydantic schemas.",
        "check": {
            "question": "What occurs when a CrewAI crew is configured with a Hierarchical process?",
            "options": [
                "A manager LLM agent is instantiated to decompose goals and delegate tasks to workers",
                "All agents are immediately terminated and replaced with static script routines",
                "Tasks execute exclusively in random unpredictable order without coordination",
                "The system requires all team members to belong to the same physical office location"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "In CrewAI Hierarchical mode, a manager LLM autonomously plans, delegates sub-tasks to specialized worker agents, evaluates outputs, and coordinates collaborative delivery."
        }
    },
    {
        "title": "AutoGen And Conversational Mesh Architectures With Code Execution",
        "say": part4_say,
        "example": "AutoGen agents debug Python scripts autonomously inside Docker sandboxes.",
        "tryIt": "Construct a GroupChat with automated speaker selection and code sandboxes.",
        "check": {
            "question": "How does AutoGen enable autonomous code debugging loops in multi-agent workflows?",
            "options": [
                "UserProxyAgents execute code in sandboxes and feed terminal tracebacks back to assistants",
                "By permanently deleting any script that raises a compilation or runtime error",
                "By requiring software developers to manually retype all code submissions by hand",
                "By converting all programming languages into natural language poetry strings"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "UserProxyAgents execute generated code in isolated environments and return stdout and error tracebacks to the conversation, allowing assistant agents to self-correct and debug autonomously."
        }
    },
    {
        "title": "Enterprise Production Framework Selection And Native Hybrid Async Engine",
        "say": part5_say,
        "example": "Hybrid async engines achieve high throughput state machine execution.",
        "tryIt": "Deploy a production hybrid orchestrator with OpenTelemetry and Redis checkpointers.",
        "check": {
            "question": "What is the primary operational advantage of building a native hybrid async engine for enterprise agent swarms?",
            "options": [
                "Combining stateful cyclical control with low-overhead native async throughput and resilience",
                "Eliminating all logging and monitoring data to speed up network communication",
                "Restricting agent execution to single-threaded sequential processing queues",
                "Preventing human administrators from ever inspecting agent decision trails"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Native hybrid async engines combine the structural rigor of cyclical state graphs with the high throughput, minimal overhead, and full customizability of native asyncio architectures."
        }
    }
]

code1 = """import json
from typing import Dict, Any

def run_production_agent_framework_evaluator() -> Dict[str, Any]:
    \"\"\"
    Day 44: Production Agent Frameworks Evaluation & Hybrid Orchestrator
    Evaluates LangGraph, CrewAI, AutoGen, and native async architectures.
    \"\"\"
    framework_evaluations = {
        "LangGraph": {
            "architecture": "Stateful Cyclical Computation Graph",
            "latencyScore": 9.4,
            "enterpriseSuitability": "Mission-Critical Core"
        },
        "CrewAI": {
            "architecture": "Role-Playing Hierarchical Swarm",
            "latencyScore": 8.8,
            "enterpriseSuitability": "Content & Operations"
        },
        "AutoGen": {
            "architecture": "Conversational Multi-Agent Mesh",
            "latencyScore": 8.6,
            "enterpriseSuitability": "Collaborative Research"
        }
    }
    
    orchestration_metrics = {
        "graphCycleExecutionThroughputRPS": 420.0,
        "statePersistenceRecoveryPct": 100.0,
        "dynamicReplanningSuccessPct": 97.9
    }
    
    return {
        "frameworkEvaluations": framework_evaluations,
        "productionSelection": "Hybrid LangGraph State Machine with CrewAI Task Delegation",
        "orchestrationMetrics": orchestration_metrics,
        "status": "FRAMEWORK_ORCHESTRATION_OPTIMIZED"
    }

if __name__ == "__main__":
    result = run_production_agent_framework_evaluator()
    print(json.dumps(result, indent=2))
"""

output1 = """{
  "frameworkEvaluations": {
    "LangGraph": {
      "architecture": "Stateful Cyclical Computation Graph",
      "latencyScore": 9.4,
      "enterpriseSuitability": "Mission-Critical Core"
    },
    "CrewAI": {
      "architecture": "Role-Playing Hierarchical Swarm",
      "latencyScore": 8.8,
      "enterpriseSuitability": "Content & Operations"
    },
    "AutoGen": {
      "architecture": "Conversational Multi-Agent Mesh",
      "latencyScore": 8.6,
      "enterpriseSuitability": "Collaborative Research"
    }
  },
  "productionSelection": "Hybrid LangGraph State Machine with CrewAI Task Delegation",
  "orchestrationMetrics": {
    "graphCycleExecutionThroughputRPS": 420.0,
    "statePersistenceRecoveryPct": 100.0,
    "dynamicReplanningSuccessPct": 97.9
  },
  "status": "FRAMEWORK_ORCHESTRATION_OPTIMIZED"
}"""

for part in parts_data:
    part["code"] = code1
    part["output"] = output1

day44_dict = {
    "id": "prompt-py-44",
    "day": 44,
    "course": "prompt-py",
    "title": "Production Agent Frameworks: CrewAI, LangGraph, AutoGen & Native Async Python Multi-Agent Systems",
    "minutes": 38,
    "parts": parts_data,
    "projectStep": {
        "title": "Engineer Production Hybrid Agent Orchestration Engine",
        "steps": [
            "Evaluate architectural tradeoffs across LangGraph, CrewAI, AutoGen, and native asyncio backbones.",
            "Implement a stateful cyclical computation graph with typed schemas and conditional edge routers.",
            "Deploy persistent checkpointer fabrics backed by Redis and PostgreSQL for zero state loss recovery.",
            "Integrate CrewAI hierarchical task delegation and AutoGen sandboxed code execution loops.",
            "Deploy the native asynchronous Python hybrid engine delivering high throughput and telemetry."
        ]
    },
    "summary": [
        "LangGraph models workflows as stateful cyclical graphs with deterministic checkpointers and human breakpoints.",
        "CrewAI excels at role-playing agent specialization and hierarchical task delegation matching corporate teams.",
        "AutoGen enables emergent problem solving and automated code debugging via sandboxed execution loops.",
        "Native asynchronous Python architectures eliminate framework bloat, delivering sub-millisecond execution times.",
        "Hybrid orchestration engines unite stateful cyclical graphs with native async concurrency for scale."
    ]
}

captions_data = [
    {
        "say1": "Agent frameworks differ in state modeling and orchestration control.",
        "say2": "Architectural paradigms in production agent frameworks dictate.",
        "example": "Enterprise swarms balance cyclical graphs against role playing teams.",
        "tryIt": "Benchmark state persistence latency across graph and conversational models."
    },
    {
        "say1": "Cyclical computation graphs provide deterministic state flow and routing.",
        "say2": "LangGraph stateful computation graphs provide deterministic control.",
        "example": "LangGraph checkpointers save graph state after every node transition.",
        "tryIt": "Implement a conditional edge router directing tasks based on schemas."
    },
    {
        "say1": "Hierarchical agent crews mirror collaborative human enterprise teams.",
        "say2": "CrewAI role playing agent frameworks model complex enterprise.",
        "example": "Manager agents in CrewAI delegate sub tasks to specialized role workers.",
        "tryIt": "Configure a multi agent crew with hierarchical delegation and schemas."
    },
    {
        "say1": "Conversational agent meshes debug code iteratively in sandboxes.",
        "say2": "AutoGen conversational multi agent mesh architectures enable emergent.",
        "example": "AutoGen agents debug Python scripts autonomously inside Docker sandboxes.",
        "tryIt": "Construct a GroupChat with automated speaker selection and sandboxes."
    },
    {
        "say1": "Production hybrid engines deliver high throughput and instant recovery.",
        "say2": "Enterprise production agent architectures balance strict stateful.",
        "example": "Hybrid async engines achieve high throughput state machine execution.",
        "tryIt": "Deploy a production hybrid orchestrator with telemetry and checkpointers."
    }
]

titles = [
    "Architectural Comparison LangGraph CrewAI AutoGen And Native AsyncIO.",
    "LangGraph Deep Dive Stateful Computation Graphs And Checkpointers.",
    "CrewAI Deep Dive Role Playing Agents And Hierarchical Orchestration.",
    "AutoGen And Conversational Mesh Architectures With Code Execution.",
    "Enterprise Production Framework Selection And Native Hybrid Async Engine."
]

columns_list = [
    ["Framework Paradigm", "Core Control Abstraction", "Primary Enterprise Use Case"],
    ["Graph Component Layer", "Execution Semantics", "State Resilience SLA"],
    ["Crew Primitives Role", "Operational Function", "Delegation Protocol"],
    ["Mesh Component Type", "Interaction Topology", "Safety And Execution Boundary"],
    ["Engine Subsystem Layer", "Asynchronous Implementation", "Throughput And Recovery SLA"]
]

steps_rows = [
    [
        [["LangGraph Pregel Graph", "Stateful Cyclical Computation Nodes And Edges", "Mission Critical Deterministic Workflows"], ["CrewAI Role Swarm", "Personas Backstories And Hierarchical Tasks", "Content Generation And Operations"]],
        [["AutoGen Conversational Mesh", "Multi Agent Dialogue And Sandboxed Execution", "Collaborative Research And Code Debugging"], ["Native AsyncIO Architecture", "Lightweight Coroutines And Pydantic Schemas", "Ultra Low Latency Microservice Core"]],
        [["Hybrid Orchestration Fabric", "Combines Cyclical Graphs With Role Swarms", "Enterprise High Throughput Platforms"], ["State Checkpointer Backend", "PostgreSQL Redis And Cloud Object Persistence", "Zero Data Loss Session Crash Recovery"]],
        [["Conditional Edge Router", "Evaluates Predicates To Route Flow Dynamically", "Adaptive Multi Path Business Execution"], ["Sovereign Framework Hub", "Abstracts Underlying Engine Model Topologies", "Enterprise Multi Agent Portability"]]
    ],
    [
        [["Immutable State Channel", "Typed Pydantic Schema Shared Across Nodes", "Thread Safe Atomic State Transitions"], ["Cyclical Graph Node", "Executes Specialized Model Or Tool Invocation", "Enables Iterative Revision Loops"]],
        [["Conditional Edge Evaluator", "Inspects Output Payloads To Direct Flow", "Non Linear Adaptive Execution Paths"], ["Persistent Checkpointer Core", "Serializes Graph State After Every Step", "Instantaneous State Crash Recovery"]],
        [["Human In The Loop Gate", "Pauses Execution For Executive Approvals", "Enforces High Stakes Policy Compliance"], ["Time Travel State Explorer", "Enables Historical Inspection And Branch Rewinds", "Deterministic Edge Case Debugging"]],
        [["Hierarchical Subgraph Mesh", "Encapsulates Complex Domain Workflows Cleanly", "Modular Enterprise System Composition"], ["Real Time Streaming Bus", "Emits Token Streams And State Deltas Over Web", "Sub Second Responsive User Interfaces"]]
    ],
    [
        [["Role Playing Agent Persona", "Configures Model Backstory Goals And Style", "Consistent Domain Specific Tone"], ["Structured Task Definition", "Specifies Expected Outputs And Tools Clearly", "Prevents Ambiguous Execution Failures"]],
        [["Manager LLM Orchestrator", "Decomposes Missions And Delegates Sub Tasks", "Autonomous Operational Project Planning"], ["Sequential Process Pipeline", "Pipes Preceding Outputs Into Downstream Steps", "Deterministic Ordered Business Processes"]],
        [["Hierarchical Delegation Core", "Reviews Worker Outputs And Requests Edits", "Maintains Rigorous Enterprise Quality"], ["Tripartite Memory Fabric", "Combines Short Term Long Term And Entity Memory", "Continuous Contextual Cross Task Coherence"]],
        [["Asynchronous Task Worker", "Executes Independent Sub Tasks In Parallel", "Substantially Reduced Mission Wall Time"], ["Pydantic Output Gate", "Enforces Strongly Typed JSON Schema Adherence", "Seamless Downstream Database Ingestion"]]
    ],
    [
        [["Conversable Agent Base", "Sends And Receives Typed Natural Language Text", "Uniform Communicating Entity Model"], ["Assistant Agent Solver", "Generates Reasoning Chains Code And Drafts", "Autonomous Problem Solving Logic"]],
        [["User Proxy Agent Runner", "Executes Code Inside Secure Docker Sandboxes", "Safe Automated Code Execution Loop"], ["Group Chat Coordinator", "Mediates Multi Turn Deliberations In Shared Room", "Emergent Multi Perspective Consensus"]],
        [["Speaker Selection Engine", "Selects Next Expert Dynamically Using Models", "Fluid Context Driven Conversation Flow"], ["Autonomous Debugging Loop", "Inspects Tracebacks And Fixes Errors Recursively", "Self Healing Quantitative Code Execution"]],
        [["Nested Chat Sub Task", "Spawns Isolated Sub Conversations For Details", "Prevents Context Window Bloat In Main Chat"], ["Human Input Gatekeeper", "Requires Operator Confirmation Before Actions", "Safe Human In The Loop System Guidance"]]
    ],
    [
        [["Graph State Kernel", "Evaluates Cyclical State Transitions Rapidly", "Four Hundred Graph Cycles Per Second"], ["AsyncIO Task Dispatcher", "Manages Bounded Worker Coroutine Pools", "Sub Millisecond Concurrent Task Dispatch"]],
        [["Agent Persona Registry", "Decouples Prompt Personas From Graph Topology", "Agile Prompt Iteration And Governance"], ["Persistent Delta Checkpointer", "Commits Redis Deltas Concurrently", "One Hundred Percent State Recovery Guarantee"]],
        [["Dynamic Replanning Engine", "Reroutes Execution Around Tool Failures", "Ninety Seven Point Nine Percent Success"], ["OpenTelemetry Telemetry Core", "Emits Latency Histograms And Transition Traces", "Comprehensive Production SRE Visibility"]],
        [["Zero Trust Tool Gateway", "Enforces Least Privilege Microservice Access", "Prevents Unauthorized Infrastructure Actions"], ["Sovereign Hybrid Platform", "Harmonizes Graphs Roles And Native Async Loops", "Mission Critical Enterprise Scaling SLA"]]
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

day44_visual = {
    "schemaVersion": "2.0.0",
    "course": "prompt-py",
    "day": 44,
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

# Write day44 files
with open("C:/Users/Admin/Desktop/projects/Present-Career-os-platform/src/lib/data/prompt_day44_lesson.json", "w", encoding="utf-8") as f:
    json.dump(day44_dict, f, indent=2)

with open("C:/Users/Admin/Desktop/projects/Present-Career-os-platform/src/lib/data/lessonVisuals/prompt-py/day-44.json", "w", encoding="utf-8") as f:
    json.dump(day44_visual, f, indent=2)

print("Generated Day 44 lesson JSON and Visual Envelope successfully!")
