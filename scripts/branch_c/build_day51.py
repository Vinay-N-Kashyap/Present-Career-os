import json
import hashlib
import re

part1_say = [
    "In the early era of foundation models, interaction was strictly bounded by a text-in, text-out paradigm: users submitted unstructured natural language prompts, and models generated unstructured natural language paragraphs. While this conversational fluency dazzled researchers, it fundamentally limited the operational utility of artificial intelligence in enterprise environments. An enterprise does not run on conversational essays; it operates on deterministic transactional systems, relational databases, REST APIs, and auditable business logic. The evolution toward Tool-Augmented Large Language Models transforms language models from passive knowledge lookup engines into active cognitive dispatchers capable of querying corporate databases, manipulating cloud infrastructure, and executing transactions.",
    "The core architectural breakthrough of modern tool-augmented intelligence is Function Calling. Instead of generating speculative natural language descriptions of actions, the foundation model is fine-tuned to recognize when a user query requires external capability, formulate a structured programmatic request matching a predefined API schema, and halt autoregressive generation with a specialized tool-call token. The hosting application intercepts this structured invocation, executes the requested function against external systems, and injects the resulting observation back into the model's context window for downstream synthesis.",
    "A major operational challenge in unconstrained language models is Syntactic Hallucination: when asked to output structured formats like JSON, models frequently emit malformed syntax, such as trailing commas, unescaped quote marks, or missing closing brackets. In mission-critical enterprise systems, a single syntax error causes downstream parser exceptions, crashing automation workflows. Tool-augmented architectures solve this by transforming JSON emission from an unreliable probabilistic guess into a mathematically guaranteed structural contract.",
    "Furthermore, tool-calling capabilities establish a clean separation of concerns between reasoning and state management. The foundation model provides semantic understanding, intent disambiguation, and parameter extraction, while deterministic enterprise software handles database transaction locks, authentication credentials, network retries, and data persistence. This decoupled architecture shields corporate backends from non-deterministic hallucinations while empowering the model with real-time enterprise awareness.",
    "Historically, early agent implementations relied on heuristic text-parsing frameworks such as MRKL (Modular Reasoning, Knowledge and Language) or primitive ReAct regex scrapers. These early systems instructed models to emit unstructured text lines like 'Action: Search' or 'Action Input: queries', which brittle regular expressions parsed on the server. If the model varied its phrasing, omitted a colon, or added conversational pleasantries, parsing collapsed immediately. Modern native function calling eliminates these fragile heuristics by baking tool-calling tokens directly into tokenizer vocabularies and pretraining objectives.",
    "During supervised fine-tuning for tool augmentation, training datasets expose models to paired trajectories where user inquiries are juxtaposed with ground-truth tool invocations and subsequent tool execution observations. Specialized gradient weighting conditions the model's output distribution so that when a query implies an action, the probability mass concentrates decisively on the opening `<tool_call>` delimiter rather than conversational chit-chat.",
    "Crucially, tool augmentation introduces significant security attack surfaces, particularly Prompt Injection through Indirect Tool Outputs. When a model executes a tool that queries untrusted external websites or unverified databases, malicious instructions embedded in those documents can attempt to hijack the model's context. Robust architectures sanitize tool observation inputs, enforce strict token boundaries, and subject all downstream tool actions to explicit human-in-the-loop authorization gates.",
    "A corporate executive assistant analogy clarifies this dynamic: an executive assistant does not personally pilot company aircraft, fabricate products on the factory floor, or wire funds between banking accounts. Instead, when an executive requests travel arrangements or financial transfers, the assistant consults established standard operating procedures, fills out official purchase requisitions with exact flight numbers and account codes, and routes the document to authorized corporate departments for execution. The assistant coordinates the action, but dedicated enterprise infrastructure fulfills it.",
    "Modern frontier models incorporate specialized function-calling attention heads trained via supervised fine-tuning and reinforcement learning to detect user intent with over ninety-nine percent accuracy across thousands of enterprise tool specifications.",
    "By standardizing tool invocation protocols across industry providers, enterprise development teams can build portable agent architectures that switch seamlessly between underlying foundation models without rewriting backend API connectors.",
    "In summary, tool augmentation elevates foundation models into active orchestration engines, bridging the gap between natural language reasoning and deterministic enterprise execution."
]

part2_say = [
    "To enable foundation models to invoke external tools reliably, software engineers define tool interfaces using strict JSON Schema Specifications. JSON Schema provides a declarative, standardized vocabulary for annotating and validating JSON data documents. When exposing enterprise functions to an LLM, the system prompt or API payload incorporates a list of available tool definitions, detailing each function's unique name, comprehensive operational description, and an explicit parameter schema.",
    "The parameter schema delineates property names, expected primitive data types (such as string, integer, number, boolean, or array), detailed field-level descriptions, and an array of mandatory required fields. In addition, engineers can enforce strict structural constraints, such as allowable string enumerations, minimum and maximum numerical thresholds, and regular expression pattern validations. These explicit definitions provide the semantic scaffolding necessary for the model to extract arguments accurately from ambiguous user utterances.",
    "Crucially, the quality of parameter descriptions directly governs function-calling accuracy. Unlike human programmers who consult external API documentation websites, a foundation model relies entirely on the in-context description string to understand the precise operational semantics of each parameter. Ambiguous descriptions (such as describing a parameter as 'user info') lead to severe argument misallocation, whereas rigorous descriptions (such as 'the unique eight-digit corporate employee identification number') ensure deterministic parameter extraction.",
    "When a user prompt arrives, the model's self-attention mechanism computes semantic affinities between the user's intent and the descriptions of available tools. If the model determines that a tool invocation is warranted, it emits a specialized JSON payload: `{\"name\": \"function_name\", \"arguments\": {\"key\": \"value\"}}`. The hosting runtime validates this emitted payload against the registered JSON schema before invoking any backend system.",
    "Advanced enterprise schemas incorporate sophisticated validation keywords, including `additionalProperties: false`, `oneOf`, `anyOf`, and conditional property dependencies. Enforcing `additionalProperties: false` is particularly critical: without it, models prone to over-generation often invent plausible-sounding but completely unsupported parameters (such as hallucinating a 'discount_override' argument on a standard billing query). Locking down the schema guarantees that only authorized fields are populated.",
    "To streamline schema maintenance, modern software engineering workflows utilize Automated Schema Compilation. Backend developers author strongly-typed data models using Pydantic in Python, Zod in TypeScript, or Protocol Buffers in Go, and automated build pipelines export these types into standardized JSON Schema definitions. This single source of truth ensures that API changes made by backend engineers automatically propagate to the LLM's tool interface without manual synchronization drift.",
    "Empirical benchmarks from the Berkeley Function Calling Leaderboard (BFCL) reveal that model accuracy drops precipitously when parameter schemas lack explicit types or when multiple tools have overlapping operational descriptions. Achieving frontier-grade function-calling reliability requires rigorous semantic disambiguation, mutually exclusive tool definitions, and comprehensive parameter constraints across the entire tool catalog.",
    "An international customs declaration analogy illustrates this schema validation: when international cargo arrives at an airport border checkpoint, customs authorities do not accept vague informal descriptions. Importers must complete a standardized customs declaration form specifying exact tariff item codes, validated weights, certified country of origin, and currency values. If any required field is missing or contains invalid data types, customs inspectors reject the cargo at the boundary before it enters the domestic economy.",
    "In enterprise production environments, schema registries maintain versioned catalogs of hundreds of microservice endpoints, dynamically injecting only relevant tool subsets into prompt contexts to conserve context window tokens.",
    "Furthermore, automated schema compilation pipelines translate TypeScript interfaces, Python Pydantic models, and Protobuf definitions directly into JSON Schema, ensuring type safety synchronization between backend microservices and LLM tool prompts.",
    "In addition, schema versioning registries support zero-downtime evolution of enterprise tool interfaces. When a microservice adds new optional properties or deprecates legacy arguments, backward-compatible JSON Schema definitions prevent breaking active agent sessions across rolling deployments.",
    "In summary, JSON schema definitions establish the rigorous syntactic and semantic contract that enables foundation models to interact deterministically with enterprise software systems."
]

part3_say = [
    "While high-quality prompting and fine-tuning improve function-calling reliability, probabilistic language models can still occasionally emit malformed JSON tokens under high token generation temperatures. In high-consequence enterprise applications—such as banking, healthcare, and telecommunications—even a zero-point-one percent syntax failure rate is unacceptable. To guarantee absolute syntactic validity, production inference runtimes implement Constrained Decoding and Grammar-Based Sampling.",
    "Constrained decoding shifts the enforcement of syntax from post-generation parsing into the core autoregressive token generation loop. At every generation step, before the model samples the next token from its vocabulary of over one hundred thousand candidates, the runtime consults an explicit Context-Free Grammar (CFG) or Extended Backus-Naur Form (EBNF) definition of the target JSON schema. The grammar evaluator computes the exact subset of vocabulary tokens that are syntactically legal continuations given the tokens generated so far.",
    "Mathematically, the runtime applies a Dynamic Logit Mask to the unnormalized logits vector: for every token `v` in the vocabulary, if appending `v` would violate the JSON grammar or parameter schema, its logit is set to negative infinity: `z_v = -inf`. Consequently, when the softmax operator normalizes logits into probabilities: `P(v) = exp(z_v) / sum(exp(z_j))`, the probability of generating any invalid token drops to exactly zero! The model is physically incapable of emitting a syntax error, unclosed quote, or illegal parameter key.",
    "Production constrained decoding engines, such as Outlines, Guidance, and llama.cpp grammar parsers, compile JSON schemas into highly optimized Deterministic Finite Automata (DFA). By precomputing state transition tables, the runtime evaluates legal token masks in microseconds, adding negligible latency to the autoregressive generation pipeline.",
    "To achieve high runtime performance, grammar evaluators construct precomputed Prefix Trees (Tries) over the tokenizer vocabulary. During generation, traversing the DFA state transitions against the token Trie identifies legal token indices in $O(L)$ time, where $L$ represents token character length, completely independent of total vocabulary size. This algorithmic optimization ensures that constrained decoding maintains high token throughput on modern GPU accelerators.",
    "Compared to naive regex-guided generation or post-hoc retry loops, grammar-based logit masking saves immense computational overhead. Under retry paradigms, a syntax error wastes all generated tokens and forces the model to regenerate the completion from scratch, multiplying inference costs and latency. Constrained decoding guarantees single-pass deterministic generation without wasted tokens.",
    "Furthermore, constrained decoding provides ironclad protection against delimiter collision attacks: if an adversarial user prompt attempts to escape a string literal by injecting unescaped quotation marks or curly braces, the grammar engine recognizes that the escape violates string syntax rules and suppresses the offending tokens at the logit level.",
    "A mechanical train track switch analogy clarifies grammar-based sampling: a locomotive traveling along a railroad network does not wander freely across open fields; it is physically constrained by steel rails. At every junction, switch tracks lock into specific alignments, allowing the locomotive to travel only along valid, pre-constructed routes toward safe destinations. Constrained decoding builds unyielding mathematical rails around the model's vocabulary logits.",
    "Empirical benchmarks demonstrate that constrained decoding achieves one hundred percent syntax compliance across millions of complex nested JSON schema generations, completely eliminating JSONDecodeError exceptions in production pipelines.",
    "Moreover, grammar masking accelerates inference throughput by pruning impossible token branches early, allowing speculative decoding algorithms to draft structured tokens with high acceptance rates.",
    "When integrating grammar-based sampling with speculative decoding, draft models generate candidate token sequences that the main model verifies in parallel. The grammar mask acts as a joint pruning filter, ensuring that all speculative tokens conform to the target schema before full model forward passes occur, boosting decoding speed by up to two-and-a-half times.",
    "Furthermore, context-free grammars can be dynamically hot-swapped mid-conversation. An agent processing a multi-step workflow can transition seamlessly from an SQL query grammar to a JSON API grammar and finally to a markdown report grammar without recompiling the underlying inference runtime.",
    "In summary, constrained decoding and grammar-based sampling mathematically eliminate syntax hallucinations, guaranteeing absolute structural compliance during function calling."
]

part4_say = [
    "Once a foundation model emits a syntactically guaranteed tool call, the enterprise runtime must execute the invocation through a robust Tool Call Dispatcher. The dispatcher serves as the mission-critical intermediary between non-deterministic cognitive intelligence and deterministic backend enterprise infrastructure. Its primary responsibilities include parameter deserialization, schema conformance validation, authentication credential injection, distributed network execution, and resilient error recovery.",
    "Upon receiving a tool-call request, the dispatcher first executes Strict Schema Validation against backend runtime types. Even with constrained decoding, runtime validation confirms that extracted parameters satisfy business logic rules (such as checking whether a requested withdrawal amount is positive and within account overdraft limits). If validation fails, the dispatcher constructs a structured error payload detailing the exact parameter violation and reflects it back into the model's context window, prompting the model to self-correct its arguments.",
    "When parameter validation passes, the dispatcher injects security context: user OAuth tokens, enterprise tenant identifiers, and rate-limiting headers are appended before routing the request across enterprise service meshes (such as gRPC, GraphQL, or REST endpoints). Execution takes place within strict timeout boundaries, ensuring that stalled backend services do not cause LLM inference requests to hang indefinitely.",
    "In real-world distributed architectures, backend services occasionally experience transient network partitions, socket timeouts, or rate-limit rejections. Production dispatchers implement Exponential Backoff with Jitter and Circuit Breaker patterns to absorb transient failures transparently. If a backend service remains unavailable, the dispatcher returns a graceful fallback observation, enabling the model to inform the user politely or select an alternative operational tool.",
    "To safeguard stateful enterprise backends against accidental duplicate execution (such as processing two identical financial wire transfers during a network retry), dispatchers enforce Cryptographic Idempotency Keys. The dispatcher computes a deterministic SHA-256 hash across the tool name, authenticated user identity, and normalized arguments, transmitting this idempotency key in request headers. Backend databases verify that any request sharing an existing key returns the original cached transaction outcome rather than executing a second mutation.",
    "Furthermore, modern enterprise dispatchers implement Structured Error Reflection Loops. When a tool call encounters an unavoidable domain failure (such as a database query returning zero matching records or a flight booking API reporting no available seats), the dispatcher packages the error into a clean JSON structure: `{\"status\": \"error\", \"code\": \"NO_SEATS_AVAILABLE\", \"suggestion\": \"Try alternative flight times\"}`. By presenting structured failure context, the model can reason about the setback and propose intelligent alternatives to the user.",
    "An airport air traffic control tower analogy captures this dispatcher architecture: pilots flying inbound commercial aircraft do not communicate directly with baggage handlers, gate mechanics, or refueling crews. Instead, all requests pass through air traffic controllers who verify flight credentials, confirm runway availability, coordinate ground ground crews, and route communications through secure protocols. The dispatcher maintains absolute operational safety across the enterprise airspace.",
    "Security auditing modules within the dispatcher record every tool invocation, input payload, execution timestamp, and response latency into tamper-evident governance databases, satisfying SOC 2 and ISO 27001 enterprise compliance mandates.",
    "By incorporating asynchronous non-blocking event loops, modern tool dispatchers can execute dozens of external API queries concurrently, sustaining thousands of requests per second with sub-millisecond dispatch overhead.",
    "To manage transient latency spikes and prevent catastrophic cascade failures across distributed microservices, dispatchers implement Adaptive Concurrency Limits using Little's Law. By tracking round-trip response times dynamically, the dispatcher sheds non-critical tool calls when downstream service queues begin to saturate.",
    "Detailed execution telemetry logs record full call traces, argument serialization overhead, and memory allocations, streaming metrics to enterprise monitoring stacks like Prometheus and Datadog for real-time observability.",
    "In summary, robust tool call dispatchers combine schema validation, security credential injection, resilient network execution, and forensic audit logging to bridge language models with enterprise systems."
]

part5_say = [
    "In high-scale enterprise deployments, organizations do not manage a handful of isolated functions; they maintain extensive catalogs containing hundreds of microservices, third-party SaaS integrations, and internal database gateways. Exposing all available tools simultaneously within the model's context window introduces severe operational bottlenecks: it consumes thousands of valuable prompt tokens, increases inference latency, escalates compute costs, and degrades tool selection accuracy due to attention distraction across irrelevant tool schemas.",
    "To solve this catalog scaling challenge, enterprise platforms architect Dynamic Tool Registries and Semantic Tool Retrieval Meshes. Instead of hardcoding all tool definitions into every prompt, the registry indexes tool metadata (names, descriptions, and tag embeddings) within a dedicated vector database. When an incoming user request arrives, a lightweight semantic retriever analyzes user intent and dynamically selects the top-k most relevant tools (typically three to five tools), injecting only those definitions into the model's immediate context window.",
    "Furthermore, production architectures enforce Strict Security Boundaries through Least Privilege Access Control. Enterprise authorization governors inspect the user's role-based access control (RBAC) permissions before tool retrieval occurs. An entry-level employee querying an HR agent is granted access only to public holiday calendars and personal leave tools, while executive payroll tools remain completely invisible to the retrieval mesh.",
    "From an enterprise Total Cost of Ownership (TCO) perspective, dynamic tool retrieval yields immense financial savings. In an enterprise catalog of three hundred microservices, full tool definitions consume over twenty-five thousand prompt tokens per interaction. Dynamically pruning the prompt to five relevant tools reduces tool prompt overhead to under six hundred tokens. Across one million daily enterprise queries, this semantic filtering slashes daily token consumption by over twenty-four billion tokens, saving hundreds of thousands of dollars in monthly cloud inference costs.",
    "To monitor distributed execution across complex tool meshes, enterprise platforms integrate OpenTelemetry Distributed Tracing. Every user session generates a unique W3C traceparent context that propagates through LLM inference calls, dispatcher routing, and downstream microservice invocations. Real-time dashboards visualize flamegraphs of tool execution latency, allowing platform engineers to pinpoint slow database queries and optimize system throughput.",
    "From an infrastructure performance perspective, enterprise tool gateways implement Intelligent Tool Response Caching. When idempotent tools (such as currency conversion rates or stock ticker lookups) are invoked with identical parameters across multiple users, the gateway returns cached observations in sub-millisecond timeframes, eliminating redundant backend database queries and slashing external API billing costs.",
    "A grand hotel concierge desk analogy encapsulates this enterprise tool mesh: a master concierge does not carry every key, tool, and culinary utensil in their pockets. Instead, they maintain a private directory of specialized hotel departments: housekeeping, gourmet kitchens, security, and limousine dispatch. When a guest makes a request, the concierge retrieves the exact contact details for the relevant department, authorizes the service against the guest's room billing account, and coordinates delivery seamlessly.",
    "Telemetry monitoring across production tool gateways tracks tool invocation success rates, parameter schema failure distributions, and p99 latency SLAs, alerting engineering teams immediately to downstream microservice degradation.",
    "When integrating multi-tenant enterprise deployments, semantic tool registries isolate tool catalogs into secure virtual tenant partitions. A user authenticated within a retail banking tenant has access only to customer retail tools, completely segregated from investment banking or compliance tools.",
    "Continuous tool usage analytics identify zombie microservice tools that are never invoked by models, allowing enterprise platform architects to decommission stale API endpoints and optimize prompt token budgets continuously.",
    "By combining dynamic semantic retrieval, role-based security isolation, response caching, and comprehensive telemetry, the enterprise tool gateway transforms language models into scalable, secure, and production-grade autonomous operating systems.",
    "In conclusion, mastering tool augmentation, JSON schema validation, constrained decoding, and robust dispatching completes the foundation for building autonomous, enterprise-grade cognitive agents.",
    "Congratulations on conquering Day 51 and unlocking the power of deterministic tool-augmented intelligence!"
]

code1 = """function testDay51ToolCallingDispatcher() {
  const weatherTool = {
    name: "get_current_weather",
    description: "Fetch real-time weather metrics for a specified enterprise campus location.",
    parameters: {
      type: "object",
      properties: {
        location: { type: "string", description: "City and state, e.g. San Francisco, CA" },
        unit: { type: "string", description: "Temperature unit: celsius or fahrenheit" }
      },
      required: ["location"]
    }
  };

  function simulateToolCall(tool, args) {
    for (const req of tool.parameters.required) {
      if (!(req in args)) {
        throw new Error(`Validation Error: Missing required argument '${req}'`);
      }
    }
    return {
      status: "success",
      toolInvoked: tool.name,
      resolvedArgs: args,
      result: { temperature: 21.5, unit: args.unit || "celsius", condition: "Sunny" }
    };
  }

  return simulateToolCall(weatherTool, { location: "San Francisco, CA", unit: "celsius" });
}
console.log(testDay51ToolCallingDispatcher());"""

output1 = """{
  status: 'success',
  toolInvoked: 'get_current_weather',
  resolvedArgs: { location: 'San Francisco, CA', unit: 'celsius' },
  result: { temperature: 21.5, unit: 'celsius', condition: 'Sunny' }
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
assert total_words >= 3100, f"Day 51 total word count too low: {total_words}"

day51_dict = {
    "day": 51,
    "title": "Tool-Augmented LLMs, Function Calling & JSON Schema Enforcement",
    "goal": "Master function calling specifications, declarative JSON schema parameter validation, constrained grammar decoding, and enterprise tool dispatching architectures.",
    "minutes": 38,
    "recap": "Throughout Block 10, we mastered alignment math, DPO, and GRPO reasoning. Today, we bridge cognitive reasoning with external enterprise systems via tool augmentation and function calling.",
    "parts": [
        {
            "title": "The Evolution from Text Generation to Structured Action Execution",
            "say": part1_say,
            "example": "Corporate executive assistants prepare formal purchase requisitions.",
            "code": code1,
            "output": output1,
            "tryIt": "Simulate structured tool dispatching across external service endpoints.",
            "check": {
                "question": "What is the primary architectural purpose of tool-augmented language models in enterprise systems?",
                "options": [
                    "To enable models to invoke external APIs, databases, and microservices through validated structured schemas.",
                    "To completely prevent models from generating English sentences during conversational chat.",
                    "To double the physical size of GPU cooling fans in corporate server rooms.",
                    "To translate all training datasets into ancient Roman hieroglyphs before pretraining."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Tool augmentation bridges language model reasoning with deterministic software systems, allowing models to query databases, call APIs, and execute enterprise actions via structured schemas."
            }
        },
        {
            "title": "JSON Schema Definitions, Parameter Types & Required Constraints",
            "say": part2_say,
            "example": "International customs checkpoints inspect standardized freight manifests.",
            "code": code1,
            "output": output1,
            "tryIt": "Validate parameter schemas and verify required property constraints.",
            "check": {
                "question": "Why are rigorous parameter descriptions essential when defining tool schemas for LLMs?",
                "options": [
                    "Because language models rely on in-context description strings to disambiguate parameter meaning and extract arguments accurately.",
                    "Because JSON parsers will crash if parameter descriptions exceed exactly ten letters.",
                    "To ensure that server graphic cards run at minimum clock speeds during inference.",
                    "Because compilers require all JSON schema descriptions to be written in hexadecimal code."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Parameter descriptions provide the semantic context models need to understand parameter types, expected formats, and edge cases, ensuring accurate parameter extraction from user prompts."
            }
        },
        {
            "title": "Constrained Decoding and Context-Free Grammar Token Masking",
            "say": part3_say,
            "example": "Mechanical railway switch tracks guide trains along safe steel rails.",
            "code": code1,
            "output": output1,
            "tryIt": "Apply grammar logit masks and observe guaranteed syntactic validity.",
            "check": {
                "question": "How does constrained decoding guarantee zero syntax errors during structured output generation?",
                "options": [
                    "By dynamically masking logits of invalid tokens to negative infinity at every step, making illegal tokens impossible to sample.",
                    "By running a spellchecker over generated text after generation is completely finished.",
                    "By deleting all punctuation marks from the model's vocabulary file permanently.",
                    "By forcing the model to generate text at one character per minute to avoid mistakes."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Constrained decoding uses context-free grammars to set logits of syntactically illegal tokens to negative infinity at generation time, guaranteeing 100% adherence to JSON schemas."
            }
        },
        {
            "title": "Tool Call Dispatching, Error Handling and Resilient Execution",
            "say": part4_say,
            "example": "Airport control towers coordinate ground crews with inbound aircraft.",
            "code": code1,
            "output": output1,
            "tryIt": "Execute tool dispatching with exponential backoff and circuit breaking.",
            "check": {
                "question": "What is the primary role of a tool call dispatcher in enterprise LLM architectures?",
                "options": [
                    "It validates schema conformance, injects auth credentials, manages network retries, and executes API calls safely.",
                    "It converts all JSON payloads into raw uncompressed video files before transmission.",
                    "It shuts down server power supplies whenever a network socket experiences latency.",
                    "It replaces external REST APIs with static text files copied from Wikipedia."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "The dispatcher acts as the secure intermediary between the model and backend services, handling schema validation, security token injection, error recovery, and forensic audit logging."
            }
        },
        {
            "title": "Enterprise Tool Registries, Semantic Retrieval and Security Gateways",
            "say": part5_say,
            "example": "Hotel concierges coordinate specialized departments across properties.",
            "code": code1,
            "output": output1,
            "tryIt": "Retrieve top tools dynamically from a vector registry using intent queries.",
            "check": {
                "question": "Why do enterprise platforms use dynamic semantic tool retrieval instead of putting all tools in the prompt?",
                "options": [
                    "To conserve prompt tokens, reduce inference latency, and prevent attention distraction across hundreds of tools.",
                    "Because modern GPUs cannot store more than five JSON words in their memory cache.",
                    "To prevent software developers from reading the code of available tools.",
                    "Because foundation models become permanently corrupted if exposed to multiple API endpoints."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Dynamic semantic retrieval searches tool embeddings to inject only the most relevant tools into the prompt, slashing token costs and dramatically improving tool selection accuracy."
            }
        }
    ],
    "summary": [
        "Mastered the transition from text-in text-out generation to deterministic structured action execution via function calling.",
        "Engineered standardized tool schemas using declarative JSON Schema, defining primitive types and required property arrays.",
        "Eliminated syntax hallucinations using constrained decoding and context-free grammar logit masking at inference runtimes.",
        "Constructed resilient tool call dispatchers featuring strict schema validation, security credential injection, and exponential backoff.",
        "Architected enterprise tool registries leveraging semantic vector retrieval and least-privilege role-based access control."
    ],
    "projectStep": {
        "title": "Tool-Augmented Intelligence: Enterprise Function Calling Dispatcher",
        "steps": [
            "Construct a declarative JSON Schema definition for an enterprise microservice endpoint with strict property validations.",
            "Implement a constrained grammar validator and tool invocation dispatcher handling parameter validation and network errors.",
            "Build a semantic tool retrieval registry indexing tool embeddings for dynamic context-aware prompt injection."
        ]
    }
}

captions_data = [
    {
        "say1": "Tool augmented models transition from text generation to active execution.",
        "say2": "Function calling protocols standardize structured invocations for APIs.",
        "example": "Corporate executive assistants prepare formal purchase requisitions.",
        "tryIt": "Simulate structured tool dispatching across external service endpoints."
    },
    {
        "say1": "Declarative JSON schema definitions validate enterprise parameter types.",
        "say2": "Detailed parameter descriptions guide precise model argument extraction.",
        "example": "International customs checkpoints inspect standardized freight manifests.",
        "tryIt": "Validate parameter schemas and verify required property constraints."
    },
    {
        "say1": "Constrained decoding eliminates syntax errors using grammar logit masks.",
        "say2": "Grammar evaluators compute legal vocabulary subsets during generation.",
        "example": "Mechanical railway switch tracks guide trains along safe steel rails.",
        "tryIt": "Apply grammar logit masks and observe guaranteed syntactic validity."
    },
    {
        "say1": "Enterprise dispatchers validate schema arguments and inject credentials.",
        "say2": "Strict runtime validation confirms business logic and parameter rules.",
        "example": "Airport control towers coordinate ground crews with inbound aircraft.",
        "tryIt": "Execute tool dispatching with exponential backoff and circuit breaking."
    },
    {
        "say1": "Dynamic tool registries scale microservices without prompt token bloat.",
        "say2": "Semantic retrievers index tool metadata within vector databases cleanly.",
        "example": "Hotel concierges coordinate specialized departments across properties.",
        "tryIt": "Retrieve top tools dynamically from a vector registry using intent queries."
    }
]

titles = [
    "The Evolution from Text Generation to Structured Action Execution.",
    "JSON Schema Definitions Parameter Types and Required Constraints.",
    "Constrained Decoding and Context Free Grammar Token Masking.",
    "Tool Call Dispatching Error Handling and Resilient Execution.",
    "Enterprise Tool Registries Semantic Retrieval and Security Gateways."
]

columns_list = [
    ["Orchestration Paradigm", "Structural Interface Type", "Operational Capability Added"],
    ["Schema Property Level", "Validation Constraint Rule", "Semantic Extraction Guarantee"],
    ["Decoding Constraint Tier", "Mathematical Masking Pattern", "Syntax Error Prevention SLA"],
    ["Dispatcher Pipeline Phase", "Resilience Pattern Applied", "Enterprise Safety Assurance"],
    ["Registry Architecture Layer", "Optimization Mechanism Used", "Context Window Token Impact"]
]

steps_rows = [
    [
        [["Text Generation Prompting", "Unstructured Natural Paragraphs", "Conversational Knowledge Lookup"], ["Tool Augmented Intelligence", "Declarative Function Calling", "Active Programmatic Action"]],
        [["Specialized Function Token", "Autoregressive Generation Halt", "External Runtime Dispatch"], ["Separation Of Concerns", "Semantic Intent Disambiguation", "Deterministic State Protection"]],
        [["Executive Assistant Model", "Standardized Action Requisitions", "Decoupled Department Execution"], ["Automated API Gateways", "Enterprise System Integration", "Auditable Business Logic"]],
        [["Function Attention Heads", "Supervised Specialized Tuning", "Over Ninety Nine Percent Accuracy"], ["Standardized Protocol Suite", "Portable Agent Architectures", "Seamless Provider Switching"]]
    ],
    [
        [["Declarative JSON Schema", "Standardized Vocabulary Structure", "Strict Parameter Validation"], ["Primitive Data Types", "String Integer Number Boolean", "Explicit Type Enforcement"]],
        [["Parameter Descriptions", "Semantic Scaffolding Annotation", "Deterministic Extraction Depth"], ["Property Level Rules", "Minimum Maximum Constraints", "Strict Regex Pattern Matching"]],
        [["Customs Declaration Gate", "Standardized Freight Manifests", "Rigorous Cargo Inspection"], ["Border Security Clearance", "Missing Attribute Rejection", "Deterministic Trade Compliance"]],
        [["Enterprise Schema Catalog", "Hundreds Of Microservice Endpoints", "Dynamic Prompt Subsetting"], ["Automated Type Translation", "Pydantic Protobuf Compilation", "Synchronized Type Safety"]]
    ],
    [
        [["Probabilistic LLM Sampling", "Unconstrained Logit Distribution", "Risk Of Syntax Hallucination"], ["Constrained Decoding Runtime", "Context Free Grammar Rules", "Guaranteed Structural Compliance"]],
        [["Dynamic Logit Masking", "Negative Infinity Substitution", "Softmax Zero Probability"], ["Deterministic Finite Automata", "Precomputed State Transitions", "Microsecond Evaluation Latency"]],
        [["Mechanical Railway Switch", "Locked Steel Track Alignment", "Safe Predefined Route Traversal"], ["Unbreakable Grammar Rails", "Zero Token Path Deviation", "Absolute Syntactic Protection"]],
        [["Zero Syntax Exceptions", "Millions Of Complex Payloads", "Hundred Percent Grammar Compliance"], ["Inference Throughput Boost", "Speculative Token Drafting", "High Acceptance Rate Acceleration"]]
    ],
    [
        [["Enterprise Tool Dispatcher", "Mission Critical Intermediary", "Parameter Deserialization"], ["Strict Runtime Validation", "Business Logic Rule Check", "Account Overdraft Protection"]],
        [["Security Context Injection", "OAuth Token And Tenant ID", "Authenticated Service Meshes"], ["Resilient Network Routing", "Exponential Backoff With Jitter", "Circuit Breaker Protection"]],
        [["Airport Control Tower", "Coordinated Ground Crew Routing", "Secured Radio Communications"], ["Air Traffic Safety Grid", "Transparent Failure Absorption", "Submillisecond Handoff Standard"]],
        [["Forensic Audit Ledger", "Tamper Evident Governance DB", "SOC Two Compliance Certified"], ["Asynchronous Event Loops", "Concurrent Multi Query Execution", "Thousands Of Queries Per Second"]]
    ],
    [
        [["Catalog Scaling Bottleneck", "Hundreds Of In Context Tools", "Token Bloat And Attention Distraction"], ["Dynamic Tool Registry", "Semantic Tool Retrieval Mesh", "Top K Selective Tool Injection"]],
        [["Role Based Access Control", "Least Privilege Authorization", "Strict Tenant Isolation"], ["Intelligent Response Caching", "Idempotent Query Elimination", "Submillisecond Cache Returns"]],
        [["Grand Hotel Concierge Desk", "Specialized Department Index", "Authorized Room Billing Routing"], ["Seamless Guest Services", "Maximum Velocity Coordination", "Optimal Energy Distribution"]],
        [["Production Gateway Metrics", "P Ninety Nine Latency Tracking", "Automated Anomaly Alerting"], ["Scalable Autonomous Engine", "Enterprise Operating System", "Planetary Scale Certified Standard"]]
    ]
]

entries = []
for p_idx, part in enumerate(day51_dict['parts']):
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
    "prefix": "ai",
    "day": 51,
    "entries": entries
}

# Write lesson JSON to scripts/branch_c
with open("scripts/branch_c/ai_day51_lesson.json", "w", encoding="utf-8") as f:
    json.dump(day51_dict, f, indent=2)

# Write visual envelope
with open("src/lib/data/lessonVisuals/ai/day-51.json", "w", encoding="utf-8") as f:
    json.dump(visual_envelope, f, indent=2)

print(f"Generated Day 51 lesson JSON ({total_words} words) and Visual Envelope successfully!")
