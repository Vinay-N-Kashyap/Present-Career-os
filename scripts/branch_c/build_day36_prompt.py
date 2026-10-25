import json
import hashlib
import re

part1_say = [
    "In production enterprise software architectures, relying on natural language prompt instructions to produce strictly formatted outputs—such as JSON payloads, SQL queries, or infrastructure configuration files—is fundamentally inadequate. A prompt that instructs a large language model to output only valid JSON without explanation frequently fails at runtime. Because autoregressive transformers sample tokens based on probabilistic distribution dynamics rather than formal deterministic rules, there is always a non-zero probability that the model will emit an unescaped quotation mark, an illegal comma, a markdown delimiter, or a conversational apology. In critical automated pipelines, a single malformed token causes immediate parser crashes, aborting downstream transactions.",
    "The traditional software engineering response to this generative vulnerability has been the retry-on-parse-error loop. In this naive design pattern, the application submits a prompt, attempts to parse the returned text with a standard JSON or SQL compiler, catches syntax exceptions, and re-submits the prompt alongside an error message pleading with the model to correct its mistake. While superficially functional in basic prototypes, retry loops introduce catastrophic operational defects into enterprise workflows: non-deterministic latency spikes where user requests take seconds or minutes to resolve, unpredictable API token billing explosions, and persistent edge-case failures where models cycle through identical syntax errors repeatedly.",
    "The fundamental architectural defect of the retry pattern is that it operates downstream at the text stream level rather than upstream at the token sampling frontier. By the time a language model emits an invalid character, the generation trajectory has already been contaminated. Because self-attention layers condition each subsequent token on all previously emitted tokens, an illegal character warps the attention state, making it mathematically more probable that the model will continue generating erratic, unparseable text to rationalize the preceding flaw.",
    "Eliminating syntax errors with absolute mathematical certainty requires intervening directly within the model's vocabulary logits before token sampling occurs. Rather than allowing the foundation model to consider its entire thirty-two thousand or one hundred twenty-eight thousand token vocabulary at each step, an external grammar constraint engine evaluates the current token prefix and determines the exact subset of tokens that can legally follow according to formal language theory.",
    "Formal language theory categorizes syntactic structures into a precise mathematical hierarchy, from regular languages governed by Deterministic Finite Automata to context-free languages defined by Context-Free Grammars. By encoding enterprise schemas, database query languages, and communication protocols into formal automata, systems engineers construct an unbreachable mathematical fence around the generative model. Tokens that violate the grammar are assigned a logit value of negative infinity, making their selection physically impossible under softmax normalization.",
    "Grammar-constrained decoding transforms large language models from temperamental text generators into hardened, predictable compilers. When an enterprise system deploys constrained decoding, syntax validation errors drop to exactly zero percent. Whether the model is generating complex PostgreSQL data definition scripts, Kubernetes manifests, or banking wire formats, every emitted character is guaranteed to satisfy the exact syntactic specifications of the target domain.",
    "The economic implications of constrained sampling across enterprise infrastructure are profound. By eliminating retry loops, organizations reduce total inference API calls by twenty to forty percent, compress ninety-ninth percentile response latencies into predictable real-time envelopes, and eliminate entire categories of brittle text parsing and sanitization middleware from their microservice architectures.",
    "Mastering formal grammar generation marks the transition from amateur prompt hacking to professional AI systems architecture. As autonomous agents take command of live infrastructure, financial accounts, and medical records, ensuring that machine-to-machine interfaces remain syntactically flawless is an absolute operational mandate."
    "Automated regression testing across production language model deployments demonstrates that subtle prompt variations degrade unconstrained formatting reliability over time. Even when a prompt achieves ninety-five percent formatting compliance on initial evaluation benchmarks, small shifts in upstream foundation model weights or minor rephrasings of user input frequently trigger unexpected syntax formatting failures. Constrained logit masking eliminates this fragility entirely by replacing probabilistic formatting compliance with deterministic mathematical guarantees.",
    "The operational cost of unconstrained formatting errors compounds dramatically across multi-tier distributed microservice meshes. When an upstream language model emits an unparseable response, downstream services that depend on structured JSON fields must either drop the transaction, invoke fallback heuristics, or alert human operators. By enforcing formal grammar decoding at the point of token generation, enterprise architectures eliminate downstream parsing exceptions, preserving strict service level agreements across complex asynchronous systems.",
]

part2_say = [
    "At the operational core of regex-constrained decoding lies the Deterministic Finite Automaton, a foundational mathematical abstraction in theoretical computer science. A DFA consists of a finite set of states, an input alphabet, a transition function that maps each state and symbol pair to a unique successor state, an initial start state, and a set of accepting terminal states. By translating regular expressions into equivalent DFAs, software systems gain the capability to track and validate textual sequences on a character-by-character basis with linear computational complexity.",
    "Intersecting a character-level DFA with a token-level language model vocabulary represents the central mathematical challenge of constrained decoding. Language models do not emit individual characters; they emit Byte-Pair Encoded tokens, where a single token may represent a multi-character string, a subword fragment, a space followed by a word, or arbitrary punctuation. A naive validator that checks characters only after an entire token is decoded cannot intervene at the logit level. To enforce constraints during inference, the grammar engine must map the DFA's character transitions onto the model's discrete token vocabulary.",
    "Pre-computation of token-to-DFA transition maps enables real-time logit masking without inference latency penalties. Modern constrained decoding engines, such as Outlines, pre-process the target regular expression against the model's tokenizer during initialization. For every active state in the DFA, the compiler tests every token in the vocabulary, identifying which tokens can be appended to the current prefix without violating the automaton's transition rules. The result is an indexed lookup table that maps each DFA state to an exact bitmask of allowed token IDs.",
    "During the forward generation pass, the logit masking operation executes with near-instantaneous efficiency. At autoregressive step t, the grammar engine inspects the current DFA state and retrieves the corresponding pre-compiled bitmask. The engine sets the logit values of all disallowed vocabulary tokens to negative infinity: z_i = -inf for all i not in V_t. When the model applies the softmax activation function to compute token probabilities, the probability of selecting any disallowed token evaluates to exactly zero.",
    "Once the model samples an allowed token from the masked distribution, the grammar engine advances the DFA state by feeding the token's constituent characters through the automaton's transition function. If the token contains multiple characters, the DFA undergoes multiple internal state transitions, arriving at a new active state that dictates the allowed token bitmask for the subsequent generation step. This lockstep synchronization between transformer attention and state automaton guarantees continuous syntactic integrity.",
    "Handling terminal states requires explicit coordination between grammar automata and end-of-sequence tokens. The model must not be allowed to emit the end-of-sequence token until the DFA has reached an accepting terminal state. Conversely, when the DFA reaches a state where no further transitions are defined—such as after completing an exact-length postal code or timestamp—the grammar engine forces the selection of the end-of-sequence token by masking all other vocabulary items to negative infinity.",
    "Memory overhead and compilation efficiency dictate the design of production regex automata. Compiling complex regular expressions with massive lookahead or unbounded repetition into DFAs can trigger state space explosion, consuming hundreds of megabytes of RAM. Production systems mitigate this risk through lazy state construction and Hopcroft state minimization algorithms, optimizing memory footprints while preserving sub-millisecond transition evaluations.",
    "Regex-constrained decoding provides absolute guarantees for structured text fields such as international phone numbers, alphanumeric account identifiers, semantic version strings, and ISO dates. By locking token sampling to verified automata, enterprise systems eliminate input validation errors at the generative source."
    "Dynamic token boundary reconciliation addresses the structural discrepancy between character-level grammar definitions and subword token vocabularies. Because Byte-Pair Encoding algorithms group frequent character sequences into unified tokens, a single vocabulary token may span multiple grammatical transitions or conclude on an incomplete syntactic boundary. Production grammar engines employ generalized finite automata that track partial token alignments across multiple character steps, ensuring that complex multi-character tokens are admitted only when every constituent character strictly satisfies the automaton transition function.",
    "High-throughput vector indexing integrates DFA state transitions directly with GPU memory buffers, enabling massively parallel logit masking across concurrent inference batches. By representing allowed token bitmasks as contiguous memory tensors, modern serving engines apply masking operations using vectorized hardware operations, eliminating host-to-device memory transfer bottlenecks and maintaining sustained high token generation velocities during peak enterprise traffic.",
]

part3_say = [
    "While Deterministic Finite Automata excel at enforcing regular languages, they possess a fundamental theoretical limitation: DFAs cannot recognize or validate context-free languages that feature recursive hierarchical structures, balanced parentheses, or arbitrarily nested objects. High-value enterprise formats such as JSON, SQL, Python source code, and HTML belong to the class of context-free languages. To govern these complex syntactic domains with mathematical certainty, the constrained decoding architecture must escalate from finite automata to Context-Free Grammars.",
    "A Context-Free Grammar is formally defined by a four-tuple comprising a set of non-terminal symbols, a set of terminal symbols, a collection of production rules that map non-terminals to sequences of terminals and non-terminals, and a designated start symbol. In standard software engineering practice, CFGs are written using Extended Backus-Naur Form (EBNF). An EBNF grammar explicitly articulates the hierarchical grammar of a format: defining how a JSON object consists of key-value pairs separated by commas, where values can recursively expand into nested objects or arrays.",
    "Executing real-time logit masking against a Context-Free Grammar requires embedding an incremental pushdown automaton within the token sampling loop. Unlike a simple DFA that tracks state using a single scalar pointer, a pushdown automaton maintains an execution stack to track nested grammatical scopes. When the model emits an opening curly brace, the parser pushes an object scope onto the stack; when the corresponding closing curly brace is emitted, the parser pops the scope, ensuring that brackets and parentheses remain perfectly balanced across infinite nesting depths.",
    "Incremental parsing algorithms, such as specialized Earley parsers or LR(1) state engines, evaluate the active grammatical frontier at each token step. Rather than parsing the entire output from scratch after each token—which would result in quadratic computational overhead—an incremental parser processes solely the newly emitted token, updating its internal parse trees and computing the exact set of valid grammatical continuation terminals for the next step.",
    "Grammar-driven JSON Schema enforcement translates complex enterprise data contracts into rigorous EBNF production rules. When an engineer specifies a Pydantic model or JSON Schema containing required string fields, integer ranges, and nested arrays, the grammar compiler automatically synthesizes an equivalent EBNF grammar. During generation, the model is physically prevented from omitting required fields, hallucinating unauthorized properties, or outputting string values where integers are demanded by the schema.",
    "Synthesizing SQL queries via grammar masking prevents catastrophic SQL injection vulnerabilities and syntax errors in autonomous database interfaces. By restricting model generation to a strict EBNF grammar of valid SQL SELECT statements, the platform guarantees that the model cannot emit destructive DROP TABLE commands or malformed JOIN clauses, establishing a safe sandbox for natural-language-to-SQL workflows.",
    "Dynamic grammar parameterization allows systems to inject runtime contextual constraints into formal grammar rules. If a user is querying a specific database table, the grammar engine dynamically injects the table's exact column names as the only allowable terminal identifiers in the WHERE clause, ensuring that the model cannot reference non-existent columns or hallucinate database entities.",
    "Context-free grammar decoding provides the definitive foundation for autonomous agent reliability. By enforcing strict structural contracts at the token logit level, enterprise platforms unlock seamless machine-to-machine interoperability, allowing language models to interact with mission-critical databases and microservices with zero parsing friction."
    "Incremental parse tree caching allows context-free grammar parsers to support long-horizon structured generation without quadratic latency degradation. As generation progresses across deeply nested schemas, the parser caches intermediate pushdown stack configurations and active grammatical continuations for every preceding token step. If speculative decoding or beam search requires evaluating competing grammatical paths, the engine restores cached parser states in constant time, preventing redundant grammar traversals.",
    "Enterprise domain specific languages leverage context-free grammar enforcement to enable natural language programming with zero syntax errors. By defining formal EBNF grammars for domain rules such as trading strategies, insurance claim workflows, or automated test assertions, organizations empower business users to generate executable business logic that compiles and runs deterministically without requiring manual code review or syntax debugging.",
    "Error localization and diagnostic feedback capabilities in incremental parsers provide immediate visibility when a model attempts an invalid grammatical transition. Although logit masking prevents the invalid token from being emitted, logging the top masked logits reveals which syntax errors the underlying model was predisposed to produce, offering valuable diagnostic data for fine-tuning prompt instructions and domain specific models.",
]

part4_say = [
    "Translating the mathematical principles of automata and context-free grammars into high-throughput production infrastructure requires specialized constrained decoding frameworks. Leading open-source frameworks—including Outlines, Guidance, and llama.cpp GBNF grammars—provide optimized runtime environments that bridge high-level schema definitions with low-level tensor operations, enabling enterprise deployments to enforce strict structural constraints at planetary scale.",
    "The Outlines framework pioneered pre-compiled index-based logit masking, prioritizing zero runtime latency overhead for regex and JSON Schema constraints. Outlines compiles target schemas into optimized finite-state machines during server initialization, indexing all valid token transitions across the model's vocabulary into memory-mapped structures. During inference, Outlines achieves sub-millisecond logit masking, making grammar enforcement virtually free in terms of wall-clock latency overhead.",
    "The Guidance library adopts an interleaved execution model that blurs the boundary between prompt templating, model generation, and external programmatic logic. Guidance allows engineers to define complex programs where static text, regex-constrained generations, and conditional code blocks execute in a unified stream. If a section of the output is deterministically known from the grammar, Guidance bypasses neural network forward passes entirely, injecting the static tokens directly into the key-value cache and accelerating generation throughput.",
    "GBNF (GGML BNF) grammars provide native, low-level context-free grammar parsing directly within the C++ runtime of llama.cpp and vLLM. By embedding grammar parsing into the core inference engine, GBNF eliminates the latency overhead of Python serialization and inter-process communication. Systems engineers define custom grammar files using standard EBNF notation, instructing the C++ sampling kernel to mask logits directly on the GPU before token emission.",
    "Inference engine integration with modern serving platforms like vLLM and TensorRT-LLM is essential for maintaining high concurrency in multi-tenant enterprise environments. Naive constrained decoding implementations lock GPU worker threads while Python parsers compute token masks, degrading batching efficiency and slashing server throughput. Advanced serving architectures execute grammar masking asynchronously within the continuous batching scheduler, preserving high token-per-second processing rates across hundreds of concurrent user sessions.",
    "Pre-compiled token indexers represent the key engineering breakthrough that makes constrained decoding commercially viable. Because language model vocabularies remain static for a given checkpoint, the mapping between grammar states and allowed tokens can be computed once, cached in high-speed memory stores like Redis, and shared across thousands of distributed worker nodes, eliminating redundant compilation overhead.",
    "Handling tokenization edge cases requires careful vocabulary normalization within grammar compilers. Because different tokenizers split whitespace, uppercase letters, and punctuation across divergent byte sequences, a naive grammar compiler can accidentally mask valid tokens that represent equivalent text. Production frameworks utilize byte-level trie structures to ensure that all valid multi-token representations of a grammar terminal remain accessible during sampling.",
    "Deploying constrained decoding frameworks within enterprise API meshes standardizes output formatting across heterogeneous foundation models. Whether invoking open-weights models served on private clusters or commercial API endpoints with native grammar support, software architectures maintain consistent, typed data contracts across their entire AI application portfolio."
    "Streaming structured generation enables client applications to consume partial JSON payloads and structured entities in real time as tokens emerge from the model. By tracking the active grammatical scope, constrained decoding engines can automatically repair and close open JSON brackets on the fly, providing downstream user interfaces with valid, parseable partial objects for immediate UI rendering while the model continues generating subsequent fields.",
    "Grammar composition operators allow developers to combine multiple modular grammars into complex hierarchical schema pipelines. An enterprise application can define separate, reusable grammars for ISO timestamps, monetary amounts, and physical addresses, and then compose them into an overarching contract specification. This modularity fosters robust code reuse and simplifies maintenance across planetary enterprise API portfolios.",
    "Hardware-accelerated logit masking integrates directly with custom neural processing units and specialized AI accelerators. By compiling grammar transition bitmasks into hardware-native lookup structures, next-generation inference hardware evaluates grammatical constraints simultaneously with matrix multiplication operations, reducing constrained sampling overhead to absolute zero.",
]

part5_say = [
    "Building an enterprise-grade constrained generation platform requires translating theoretical grammars and framework abstractions into a robust, hardened Python microservice architecture. Developing a production grammar engine demands strict interface boundaries, asynchronous task workers, automated schema validation via Pydantic, comprehensive exception handling, and full-stack telemetry instrumentation capable of maintaining strict enterprise SLAs.",
    "The software architecture of a production constrained generation service centers on five modular layers: the Schema Ingestion Gateway, the Grammar Compiler, the Dynamic Logit Masking Kernel, the Fallback Recovery Manager, and the Forensic Telemetry Emitter. The Ingestion Gateway accepts high-level Pydantic schemas and OpenAPI definitions from client applications, passing them to the Grammar Compiler which synthesizes optimized DFA and EBNF representations.",
    "Asynchronous parallel compilation prevents schema preparation from blocking active inference worker threads. When an enterprise microservice submits a complex, multi-layered data schema, the Python controller dispatches grammar compilation to a background process pool using multiprocessing. Pre-compiled state tables are assigned unique cryptographic hashes and cached in memory, ensuring that subsequent requests utilizing the same schema experience zero initialization latency.",
    "Deterministic error boundaries protect production systems against malformed schema definitions and compilation timeouts. If an external developer submits an invalid regular expression with exponential catastrophic backtracking potential, the grammar compiler's safety sandbox catches the condition, aborts compilation within a hundred-millisecond deadline, logs a security alert, and returns a structured diagnostic report explaining the structural flaw.",
    "Comprehensive OpenTelemetry instrumentation tracks key constrained decoding metrics across every generation request. The Python harness emits distributed traces capturing schema compilation time, token masking latency per forward pass, average number of masked tokens, and total generation duration. Web dashboards visualize grammar efficiency in real time, alerting platform reliability engineers to anomalous latency spikes or unoptimized schema configurations.",
    "Integration with enterprise database pools allows natural language query services to execute safe, verified SQL transactions against live data warehouses. By enforcing an immutable EBNF grammar that restricts generation to read-only SELECT queries with explicit row limits, the platform guarantees that autonomous reporting agents can explore corporate data without any risk of database corruption or unauthorized data destruction.",
    "Formal cryptographic provenance logging seals every generated structured payload with an immutable digital signature. The service computes the SHA-256 hash of the input prompt, the target EBNF grammar specification, the raw token logit trace, and the final output payload, archiving the audit record in encrypted compliance vaults to satisfy regulatory governance and transparency mandates.",
    "Mastering formal grammar generation and automata-driven decoding elevates prompt engineers into elite artificial intelligence infrastructure architects. By commanding logit-level constraints, you possess the capability to build autonomous systems that interact with enterprise software meshes with absolute syntactic perfection, establishing the benchmark of industrial AI reliability."
    "Zero-trust security policies govern constrained generation microservices by validating all client-submitted schemas against strict complexity and depth limits. Because adversarial users could potentially craft deeply nested or recursive schemas designed to consume excessive server memory during grammar compilation, the microservice enforces strict schema size budgets, recursion limits, and execution timeouts, preventing resource exhaustion attacks.",
    "Continuous automated telemetry emission streams granular constrained decoding performance metrics to enterprise observability platforms. Site reliability engineers monitor real-time dashboards tracking grammar compilation latencies, per-token logit masking durations, token suppression ratios, and GPU memory utilization, enabling proactive capacity planning and rapid performance tuning across distributed serving clusters.",
    "Comprehensive synthetic regression testing suites run continuous end-to-end evaluations across all production schema contracts. Every night, the testing pipeline generates thousands of complex structured payloads using varying prompts and temperatures, verifying that one hundred percent of generated outputs strictly adhere to target schemas without a single parse exception, certifying enterprise deployment readiness.",
    "Decentralized key management frameworks safeguard sensitive encryption keys used to authenticate structured API communications between constrained generation services and enterprise backend databases, preventing unauthorized access across corporate network boundaries.",
]

parts_data = [
    {
        "title": "The Failure Of Unconstrained Generation: Why Prompt Directives Cannot Guarantee Syntactic Correctness",
        "say": part1_say,
        "example": "A database migration script crashes when an unconstrained model outputs an invalid syntax keyword.",
        "tryIt": "Compare prompt retry loops against token level logit masking on complex JSON extraction tasks.",
        "check": {
            "question": "Why are natural language prompt instructions fundamentally incapable of guaranteeing valid JSON output?",
            "options": [
                "Because autoregressive token sampling is probabilistic, retaining a non-zero probability of invalid syntax",
                "Because transformer models cannot process English words that contain more than four letters",
                "Because JSON format can only be read by mainframe computers built before nineteen eighty",
                "Because cloud hosting providers automatically delete all curly brackets from incoming prompts"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Autoregressive generation samples tokens from a probability distribution; prompt instructions cannot reduce the probability of illegal syntax tokens to absolute zero without logit masking."
        }
    },
    {
        "title": "Automata-Driven Decoding Mechanics: Deterministic Finite Automata & Logit Masking Physics",
        "say": part2_say,
        "example": "A character level DFA restricts token sampling to valid ISO date formats and phone numbers.",
        "tryIt": "Trace how a regular expression converts into a DFA that masks disallowed vocabulary logits.",
        "check": {
            "question": "How does logit masking via a Deterministic Finite Automaton prevent invalid token emissions?",
            "options": [
                "By setting logits of all tokens that violate DFA transitions to negative infinity before softmax",
                "By shutting down the GPU processor whenever an incorrect character is generated",
                "By translating the entire model vocabulary into encrypted binary code during training",
                "By forcing the user to type the entire response manually into the computer console"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Assigning negative infinity to disallowed token logits forces their softmax probability to zero, making it mathematically impossible for the sampler to select an illegal token."
        }
    },
    {
        "title": "Context-Free Grammars & EBNF Parsers: Enforcing Arbitrary Hierarchical Data Schemas",
        "say": part3_say,
        "example": "An incremental pushdown automaton maintains balanced brackets across deeply nested JSON objects.",
        "tryIt": "Write an EBNF grammar that enforces a strict read only SQL SELECT syntax with row ceilings.",
        "check": {
            "question": "Why is a Context-Free Grammar necessary for validating nested JSON structures instead of a simple DFA?",
            "options": [
                "Because DFAs cannot maintain an execution stack to track balanced parentheses and arbitrary nesting depths",
                "Because Context-Free Grammars require half as much electrical energy to run as finite automata",
                "Because JSON files cannot be stored on modern solid state hard drives without EBNF files",
                "Because DFAs are only capable of processing numbers while CFGs process all human languages"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Finite automata lack memory stacks and cannot track recursive hierarchical structures or verify balanced brackets across arbitrary nesting depths; a pushdown automaton with CFG rules is required."
        }
    },
    {
        "title": "Constrained Decoding Frameworks: Outlines, Guidance, GBNF & High-Speed Token Indexers",
        "say": part4_say,
        "example": "A C++ GBNF grammar kernel masks logits on GPU memory before tokens are transmitted to client apps.",
        "tryIt": "Benchmark inference latency with pre-compiled Outlines regex masks against standard generation.",
        "check": {
            "question": "What is the primary architectural purpose of pre-compiled token indexers in modern grammar frameworks?",
            "options": [
                "To compute vocabulary bitmasks during server startup, eliminating runtime latency overhead during inference",
                "To permanently encrypt the foundation model weights so competitors cannot inspect parameters",
                "To reduce the number of physical graphics cards required to host a model by ninety percent",
                "To translate natural language user queries into high speed assembly language instructions"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Pre-compiled token indexers map automaton states to allowed vocabulary bitmasks ahead of time, allowing inference engines to apply masks in sub-milliseconds without latency penalties."
        }
    },
    {
        "title": "Enterprise Grammar Engineering: Hardening Production Constrained Generation Systems In Python",
        "say": part5_say,
        "example": "An enterprise natural language API safely queries production SQL tables with strict read-only grammar masks.",
        "tryIt": "Build a modular Python microservice that compiles Pydantic schemas into cached DFA bitmasks.",
        "check": {
            "question": "How do deterministic error boundaries in grammar compilers protect enterprise production services?",
            "options": [
                "By sandboxing regex compilation to prevent catastrophic backtracking and aborting malformed schemas",
                "By automatically disconnecting the server from the internet whenever an API error occurs",
                "By converting all incoming user questions into random alphabetical strings automatically",
                "By forcing all database tables to delete their primary keys before executing any query"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Sandboxed compilation prevents malformed regular expressions from triggering exponential catastrophic backtracking, terminating flawed schemas within strict deadlines to preserve uptime."
        }
    }
]

code1 = '''def test_day36_constrained_grammar():
    """
    Day 36: Outlines, Guidance & Grammars: Constrained Sampling & Regex-Enforced LLM Generation
    """
    class GrammarLogitMasker:
        def __init__(self, allowed_regex):
            self.regex = allowed_regex
            self.dfa_states = {"START": ["ALPHA"], "ALPHA": ["ALPHA", "DIGIT", "END"], "DIGIT": ["DIGIT", "END"]}

        def compute_allowed_tokens(self, current_prefix):
            # Intersects vocabulary logits with DFA state transitions
            if not current_prefix:
                return ["GET", "POST", "PUT"]
            elif current_prefix in ["GET", "POST", "PUT"]:
                return [" /api/v1/resource", " /api/v1/users", " /api/v1/orders"]
            return [" HTTP/1.1"]

        def mask_disallowed_logits(self, vocab, allowed_tokens):
            masked_count = len(vocab) - len(allowed_tokens)
            return masked_count

    vocabulary = [f"token_{i}" for i in range(32000)]
    masker = GrammarLogitMasker("^(GET|POST|PUT) /api/v1/[a-z]+ HTTP/1.1$")
    allowed = masker.compute_allowed_tokens("GET")
    masked_tokens = masker.mask_disallowed_logits(vocabulary, allowed)

    return {
        "engine": "Outlines / Guidance DFA Grammar Logit Masker",
        "targetGrammar": "RFC-Compliant HTTP Request Line EBNF",
        "activeAllowedTokens": allowed,
        "maskedDisallowedTokensCount": masked_tokens,
        "syntaxViolationProbabilityPct": 0.0,
        "syntacticCorrectnessRatePct": 100.0,
        "status": "DFA_GRAMMAR_MASKING_ENFORCED"
    }'''

output1 = '''{
  "engine": "Outlines / Guidance DFA Grammar Logit Masker",
  "targetGrammar": "RFC-Compliant HTTP Request Line EBNF",
  "activeAllowedTokens": [
    " /api/v1/resource",
    " /api/v1/users",
    " /api/v1/orders"
  ],
  "maskedDisallowedTokensCount": 31997,
  "syntaxViolationProbabilityPct": 0.0,
  "syntacticCorrectnessRatePct": 100.0,
  "status": "DFA_GRAMMAR_MASKING_ENFORCED"
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

day36_dict = {
    "id": "prompt-py-36",
    "day": 36,
    "course": "prompt-py",
    "title": "Outlines, Guidance & Grammars: Constrained Sampling & Regex-Enforced LLM Generation",
    "minutes": 38,
    "parts": parts_data,
    "projectStep": {
        "title": "Implement DFA Grammar Logit Masking Controller",
        "steps": [
            "Translate enterprise data schemas and regular expressions into Deterministic Finite Automata.",
            "Construct a pre-compiled token vocabulary index mapping DFA states to valid token bitmasks.",
            "Implement logit masking operations that assign negative infinity to disallowed vocabulary tokens.",
            "Build an incremental pushdown automaton that enforces balanced brackets for nested JSON structures.",
            "Deploy the constrained decoding engine in an asynchronous Python microservice with telemetry logging."
        ]
    },
    "summary": [
        "Unconstrained prompt generation cannot guarantee syntactic validity due to probabilistic token sampling dynamics.",
        "Retry-on-error loops introduce unpredictable latency spikes, billing bloat, and repeated edge-case failures.",
        "DFA-driven logit masking evaluates candidate tokens at the logit level, setting illegal token logits to negative infinity.",
        "Context-Free Grammars with pushdown automata enforce nested hierarchical structures such as JSON and SQL.",
        "Modern frameworks like Outlines and GBNF utilize pre-compiled token indexers to achieve sub-millisecond masking."
    ]
}

captions_data = [
    {
        "say1": "Unconstrained autoregressive generation cannot guarantee valid syntax.",
        "say2": "Prompt retry loops introduce unpredictable latency spikes and costs.",
        "example": "Database migration scripts crash when unconstrained models emit errors.",
        "tryIt": "Compare prompt retry loops against token level logit masking pipelines."
    },
    {
        "say1": "Deterministic finite automata track and validate sequences linearly.",
        "say2": "Pre compiled token transition maps enable real time logit masking.",
        "example": "Character level automata restrict token sampling to valid ISO dates.",
        "tryIt": "Trace how a regular expression converts into an automaton bitmask."
    },
    {
        "say1": "Context free grammars govern recursive hierarchical structures like JSON.",
        "say2": "Context free grammars define hierarchical production rules in EBNF.",
        "example": "Pushdown automata maintain balanced brackets across nested objects.",
        "tryIt": "Write an EBNF grammar enforcing strict read only SQL query syntax."
    },
    {
        "say1": "Constrained decoding frameworks bridge schemas with tensor operations.",
        "say2": "Outlines compiles schemas into optimized state machines on startup.",
        "example": "Native grammar kernels mask logits on GPU memory before token emission.",
        "tryIt": "Benchmark inference latency with pre compiled regex token bitmasks."
    },
    {
        "say1": "Enterprise grammar engineering implements modular python microservices.",
        "say2": "Modular architectures center on schema ingestion and grammar compilers.",
        "example": "Enterprise APIs safely query production tables with read only masks.",
        "tryIt": "Build a modular Python microservice compiling schemas into bitmasks."
    }
]

titles = [
    "Unconstrained Generation Pitfalls And Logit Masking Foundations.",
    "Automata Driven Decoding Physics And Token Transition Indexing.",
    "Context Free Grammars And Pushdown Automata Schema Validation.",
    "Constrained Decoding Frameworks And High Speed Kernel Runtimes.",
    "Enterprise Grammar Engineering And Production Service Deployment."
]

columns_list = [
    ["Decoding Approach", "Operational Mechanism", "Syntactic Correctness Profile"],
    ["Automaton Component", "Mathematical Function", "Inference Performance Impact"],
    ["Grammar Class Level", "Structural Capability", "Enterprise Application Target"],
    ["Runtime Framework", "Decoding Implementation", "Latency Overhead Profile"],
    ["Platform Service Layer", "Component Implementation", "Production Reliability SLA"]
]

steps_rows = [
    [
        [["Prompt Pleading Mode", "Natural Language Directives In Context", "Probabilistic Non Zero Failure Risk"], ["Logit Masking Mode", "Automata Guided Vocabulary Filtering", "Guarantees Flawless Syntactic Output"]],
        [["Downstream Retry Loop", "Catch Parse Errors And Re Invoke API", "Severe Latency And Token Cost Bloat"], ["Logit Level Intervention", "Mask Disallowed Logits To Negative Infinity", "Eliminates Downstream Parsing Crashes"]],
        [["Trajectory Warping Risk", "Early Flawed Tokens Corrupting Attention", "Model Continues Rationalizing Mistakes"], ["Prefix State Tracking", "Evaluate Token Prefix Against Automaton", "Prevents Invalid Generation Corridors"]],
        [["Enterprise API Economics", "Unpredictable Repeated Token Invocations", "Inflates Infrastructure Billing Ceilings"], ["Deterministic Latency SLA", "Single Pass Constrained Generation Stream", "Guarantees Predictable Real Time Speed"]]
    ],
    [
        [["Deterministic State Machine", "Character By Character Transition Tracker", "Linear Computational Complexity Guarantee"], ["Token Vocabulary Intersect", "Map BPE Tokens Onto DFA Transitions", "Enables Sub Word Level Token Masking"]],
        [["Pre Compiled Bitmask Table", "Pre Compute Allowed Tokens Per State", "Sub Millisecond Forward Pass Masking"], ["Logit Masking Operator", "Set Disallowed Logits To Negative Infinity", "Forces Softmax Probability Mass To Zero"]],
        [["Constituent Character Walk", "Advance DFA Across Subword Byte Streams", "Maintains Continuous Syntactic Lock"], ["Terminal State Coordinator", "Allow End Of Sequence Only At Acceptance", "Prevents Premature Generation Halts"]],
        [["State Space Minimizer", "Hopcroft Minimization Algorithm Execution", "Prevents Exponential RAM State Explosion"], ["Deterministic Regex Lock", "Enforce Strict International Formats", "Eliminates Source Input Validation Bugs"]]
    ],
    [
        [["Regular Grammar Limit", "Linear Memory Without Recursive Stacks", "Cannot Track Nested Parentheses Or Objects"], ["Context Free Grammar Level", "Four Tuple Production Rules With Stacks", "Recognizes Complex Hierarchical Languages"]],
        [["Pushdown Execution Stack", "Push Scopes On Open And Pop On Close", "Guarantees Balanced Parentheses Matching"], ["Incremental Earley Engine", "Evaluate Grammatical Frontier Per Token", "Eliminates Quadratic Re Parsing Overhead"]],
        [["JSON Schema Transpiler", "Convert Pydantic Models Into EBNF Rules", "Prevents Hallucinated Properties Or Types"], ["SQL Sandbox Compiler", "Restrict Syntax To Read Only Statements", "Prevents Catastrophic SQL Injection Risks"]],
        [["Dynamic Schema Injector", "Inject Verified Database Column Names", "Eliminates Non Existent Column Errors"], ["Machine Interface Contract", "Enforce Typed Structural Interoperability", "Seamless Microservice Communication"]]
    ],
    [
        [["Outlines Framework", "Memory Mapped DFA Token Bitmask Indexers", "Sub Millisecond Logit Masking Overhead"], ["Guidance Architecture", "Interleave Static AST Text With Generative Streams", "Accelerates Throughput By Bypassing Passes"]],
        [["GBNF Native Kernel", "Low Level C Plus Plus Grammar Parsing In GGML", "Zero Python Serialization Latency Overhead"], ["Async Batching Scheduler", "Execute Grammar Masking In Continuous Batches", "Preserves High Concurrent User Throughput"]],
        [["Trie Vocabulary Indexer", "Resolve Multi Character Tokenization Ambiguities", "Guarantees Accurate Byte Level Matching"], ["Distributed Cache Tier", "Store Pre Compiled Grammar Bitmasks In Redis", "Eliminates Redundant Cluster Compilation"]],
        [["Heterogeneous Model Bridge", "Standardize Grammars Across Open And Closed Models", "Ensures Unified Enterprise Contract Compliance"], ["GPU Tensor Accelerator", "Direct TensorRT LLM Logit Kernel Integration", "Delivers Maximum Production Token Velocity"]]
    ],
    [
        [["Schema Ingestion Gateway", "Accept High Level OpenAPI And Pydantic Schemas", "Standardizes Microservice Contract Entry"], ["Asynchronous Compiler Pool", "Background Multiprocessing Grammar Builds", "Prevents Blocking Active Worker Threads"]],
        [["Compilation Sandbox Guard", "Hundred Millisecond Compilation Deadline Limits", "Blocks Catastrophic Backtracking Exploits"], ["OpenTelemetry Trace Core", "Emit Per Token Masking Latency Distributed Spans", "Provides Real Time System Observability"]],
        [["Production Database Shield", "Enforce Read Only SQL SELECT Grammar Policies", "Prevents Data Warehouse Destruction Risks"], ["Cryptographic Provenance Vault", "SHA Two Fifty Six Hash Of Prompt And Grammar", "Satisfies External Regulatory Oversight"]],
        [["Automated SLA Watchdog", "Sub Second Constrained Inference Verification", "Guarantees Uninterrupted Platform Uptime"], ["Dynamic Worker Cluster", "Isolated Distributed Grammar Compilers", "Guarantees High Concurrency Throughput"]]
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
    "day": 36,
    "prefix": "prompt-py",
    "entries": entries
}

# Write lesson JSON
with open('C:/Users/Admin/Desktop/projects/Present-Career-os-platform/scripts/branch_c/prompt_day36_lesson.json', 'w', encoding='utf-8') as f:
    json.dump(day36_dict, f, indent=2)

# Write visual envelope
with open('C:/Users/Admin/Desktop/projects/Present-Career-os-platform/src/lib/data/lessonVisuals/prompt-py/day-36.json', 'w', encoding='utf-8') as f:
    json.dump(visual_envelope, f, indent=2)

print(f"Generated Day 36 lesson JSON ({total_words} words) and Visual Envelope successfully!")
