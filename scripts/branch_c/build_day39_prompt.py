import json
import hashlib
import re

part1_say = [
    "In the early architectural evolution of enterprise language model deployments, engineering teams frequently gravitate toward a seductive anti-pattern: the monolithic Omniprompt. An Omniprompt is a single, colossal prompt template that attempts to encompass every operational rule, business constraint, regulatory policy, tool schema, and conversational nuance across an entire organization. A retail banking Omniprompt, for instance, might span four thousand words detailing credit card dispute rules, mortgage underwriting guidelines, checking account overdraft waivers, wire fraud protocols, and customer service escalation paths, all crammed into a solitary context window with the expectation that the language model can seamlessly navigate all domains without degradation.",
    "The primary failure pathology of the Omniprompt is prompt interference, directive contradiction, and cognitive attention collapse. Large language models do not possess limitless representational capacity within self-attention heads. When a prompt contains dozens of disparate business rules, attention heads experience cross-directive interference: guidelines established in section eighteen subtly contradict or dilute exceptions specified in section four. In high-stakes production scenarios, this mutual interference leads to catastrophic hallucinations, where the model inadvertently approves illegal account waivers, hallucinates non-existent products, or applies mortgage validation criteria to basic checking inquiries.",
    "Beyond logical contradictions, monolithic Omniprompts impose crushing financial and operational latency penalties. Every single user interaction—even a trivial greeting like 'What are your branch hours?'—forces the foundation model to ingest and pre-fill the entire four-thousand-word prompt preamble. In an enterprise processing hundreds of thousands of daily interactions, paying frontier model token rates for thousands of irrelevant background words on every call inflates cloud operational budgets into hundreds of thousands of wasted dollars annually while introducing sluggish, hundreds-of-milliseconds response delays that severely degrade real-time user experiences.",
    "Maintenance of monolithic prompts represents an unmanageable software engineering nightmare. In a large enterprise, different business units own different operational domains: compliance teams manage anti-money laundering rules, product managers update card benefits, and risk officers revise credit ceilings. When all these rules live inside a single monolithic text file, updating a single sentence in the fraud section risks unintended regression across unrelated customer service dialogs. Software development velocity halts because any prompt edit requires extensive, expensive end-to-end regression testing across all corporate domains.",
    "Decomposing the monolithic Omniprompt into a fleet of specialized, modular micro-prompts represents the definitive architectural antidote. Rather than asking a single prompt to serve as universal oracle, production AI systems deploy an intelligent Hierarchical Prompt Router at the entry boundary. The router inspects incoming user inquiries, classifies intent, and dynamically dispatches the query to a compact, specialized prompt template tailored exclusively to that specific domain.",
    "Modular prompt architectures enforce strict context isolation and negative constraint specialization. A specialized Billing Prompt contains exclusively billing logic, billing schemas, and billing negative constraints, completely unencumbered by mortgage or fraud documentation. This surgical focus concentrates the language model's attention heads entirely on relevant decision variables, driving reasoning accuracy to near-perfection while slashing token consumption by upwards of eighty percent.",
    "Dynamic dispatching unlocks multi-tier model serving economies across complex enterprise infrastructure. In an enterprise workload, up to seventy percent of incoming user requests represent simple, repetitive inquiries—such as password resets, order status checks, or policy questions—that do not require the multi-billion-parameter reasoning capabilities of an expensive flagship model. A hierarchical routing architecture resolves these simple requests instantly using fast, lightweight models or cached responses, reserving expensive frontier models strictly for complex, multi-hop edge cases.",
    "Furthermore, decoupling prompts into modular components establishes clean architectural boundaries that align perfectly with enterprise microservice design principles. Each prompt module can be independently version-controlled, continuously tested against dedicated gold-standard evaluation benchmarks, and safely deployed through continuous integration pipelines without risking side effects across the broader software platform.",
    "Mastering hierarchical prompt routing and omniprompt decomposition elevates prompt engineers into enterprise AI systems architects. By commanding intent classification, dynamic dispatching, and tiered model orchestration, you construct scalable, cost-efficient cognitive architectures capable of serving planetary enterprise volumes with uncompromising reliability and architectural elegance."
]

part2_say = [
    "At the operational entrance of the hierarchical prompt architecture lies the Semantic Intent Classifier, tasked with categorizing incoming user inquiries into discrete operational domains with sub-fifty-millisecond latency. If the routing layer is sluggish or computationally expensive, it negates the latency benefits of modular prompt decomposition. The routing engine must therefore rely on lightweight, high-speed algorithmic primitives rather than invoking heavy foundation models for initial classification.",
    "Vector embedding routers represent the foundational mechanism for high-speed intent matching. During system configuration, enterprise architects define representative reference queries for each operational category—such as Billing Inquiries, Technical Support, Account Security, and General FAQ—and generate dense semantic embeddings for each reference phrase using a lightweight embedding model. These reference vectors are indexed in high-speed in-memory vector stores or specialized semantic routing libraries like Semantic Router.",
    "When a user query enters the gateway, the router generates its embedding in single-digit milliseconds and calculates cosine similarity against the indexed category centroids. If the cosine similarity exceeds a calibrated confidence threshold, the router instantly selects the winning category and dispatches the query to its corresponding modular prompt pipeline without invoking any intermediate generative model. This embedding-based dispatch achieves ninety-nine percent intent accuracy with near-zero latency overhead and trivial compute consumption.",
    "For complex, multi-faceted inquiries where embedding similarity is borderline or ambiguous, the architecture escalates classification to a compact Small Language Model (SLM) classifier. An optimized open-weights model fine-tuned specifically on enterprise intent taxonomies processes the query, evaluating subtle syntactic cues, multi-intent combinations, and edge cases before outputting a structured classification token. Operating with quantization on commodity hardware, the SLM classifier delivers authoritative routing verdicts in tens of milliseconds.",
    "Confidence calibration techniques such as temperature scaling and Platt scaling are applied across cosine similarity distributions to prevent false positive classifications. When user phrasing introduces unfamiliar jargon or emerging regional dialects, uncalibrated raw vector distances can produce overconfident misrouting. Applying Platt scaling transforms raw geometric distances into true posterior probabilities, ensuring that borderline inquiries are appropriately flagged for multi-stage disambiguation rather than misdirected.",
    "Zero-shot and few-shot intent classification harnesses utilize structured JSON output constraints to ensure deterministic routing decisions across distributed worker fleets. The classifier is instructed to emit an exact JSON object containing the primary intent category, an urgency score, a sentiment marker, and a confidence scalar. If the confidence score falls below a safety threshold, the router activates fallback protocols rather than guessing an unverified category.",
    "Handling out-of-domain and adversarial inputs requires explicit fallback and defensive routing mechanisms. Malicious users or confused customers frequently submit queries that do not correspond to any registered business category, or attempt prompt injection payloads designed to bypass routing rules. The intent classifier maintains an explicit UNKNOWN fallback category, routing anomalous queries to a defensive triage prompt that clarifies user intent or escalates to human customer service.",
    "Continuous intent drift monitoring ensures that the routing index adapts to evolving customer behaviors over time. By tracking classification confidence distributions and clustering unclassified queries in vector space, the router detects emerging product trends, seasonal query spikes, or new failure modes, alerting platform engineers to author new specialized prompt modules to meet shifting user needs.",
    "Additionally, modern routing fabrics implement multi-label classification capabilities for hybrid inquiries. When a user simultaneously asks about an overdue invoice and a broken software feature, the classifier identifies both Billing and Technical Support intents, constructing an orchestrated DAG execution plan that executes both micro-prompts sequentially or in parallel while synthesizing the final response into a coherent user-facing answer.",
    "Semantic intent classification establishes the intelligent traffic controller for modern enterprise AI platforms. By routing requests swiftly and accurately at the gateway boundary, software architectures guarantee that downstream models receive precisely the context they need to succeed."
]

part3_say = [
    "Hierarchical dispatch architecture governs the dynamic assembly, context injection, and model tier allocation that occurs once user intent has been classified. Rather than maintaining static, monolithic pipelines, a modern enterprise dispatcher treats prompt compilation as an adaptive, just-in-time manufacturing process where system instructions, domain schemas, reference documents, and foundation model checkpoints are selected dynamically based on intent metadata.",
    "Dynamic schema and tool injection represents the first major operational responsibility of the hierarchical dispatcher. In an enterprise agent platform supporting hundreds of tools, presenting all tool definitions simultaneously degrades model reasoning and inflates token consumption. Once the router classifies a query as a Billing Inquiry, the dispatcher injects exclusively the three or four billing tools—such as invoice lookup and refund processing—while withholding hundreds of unrelated tools, maximizing tool selection accuracy while preserving context window economy.",
    "Multi-tier model serving represents the second major architectural capability of the dispatch engine. The router maintains a tiered fleet of foundation models: Tier One comprises in-memory semantic caches and ultra-fast lightweight models (such as eight-billion-parameter checkpoints) for routine FAQs and status checks; Tier Two deploys mid-tier models for standard transactional operations; and Tier Three reserves flagship frontier reasoning models for complex, multi-hop legal, financial, or architectural synthesis.",
    "By aligning query complexity with appropriate model tiers, the enterprise achieves massive cost compression and latency acceleration. In empirical enterprise workloads, sixty-five percent of queries are resolved at Tier One at ten cents per million tokens; twenty-five percent are handled at Tier Two at eighty cents per million tokens; and only ten percent require Tier Three frontier models at five dollars per million tokens. This blended operational profile reduces aggregate API costs by upwards of eighty-four percent compared to monolithic frontier deployment.",
    "Enterprise semantic caching layers such as Redis vector caches or GPTCache sit at the apex of Tier One dispatching. When incoming queries closely mirror previously answered questions within tight cosine distance bounds, the dispatcher serves verified responses directly from the cache in single-digit milliseconds, eliminating generative model invocations altogether and delivering near-instantaneous response times at zero marginal inference expense.",
    "Just-in-time context retrieval integration links intent classification directly with enterprise Retrieval-Augmented Generation systems. When the router identifies a specific sub-category—such as Commercial Real Estate Underwriting—the dispatcher passes the intent metadata as a hard filter to the vector database, restricting document retrieval exclusively to verified real estate compliance vaults and eliminating irrelevant corporate documentation from the RAG context.",
    "Session state and multi-turn conversational context preservation across intent transitions requires sophisticated state management. In complex customer interactions, a user may transition from a billing question to a technical support inquiry within the same session. The dispatcher maintains a centralized conversation state store, propagating essential user identity and transaction history across modular prompt handlers while swapping out domain-specific instructions seamlessly.",
    "Dynamic load balancing and failover routing protect enterprise availability during regional cloud outages or model rate limit breaches. If a Tier Three frontier model provider experiences API throttling or degraded performance, the dispatcher automatically activates fallback routing: temporarily routing complex requests to an alternative frontier provider or executing structured multi-persona ensembles on Tier Two models to preserve service level agreements.",
    "Telemetry feedback loops continuously optimize model tier assignment thresholds. By correlating downstream user acceptance, tool execution success, and response rating metrics against initial routing tiers, the dispatch engine adjusts its complexity scoring heuristics dynamically, steadily shifting more workload volume to faster and cheaper tiers as domain prompts mature.",
    "Hierarchical dispatch architecture transforms fragmented AI tools into an integrated, enterprise-scale cognitive mesh. By matching every incoming inquiry with the optimal combination of prompt directives, tool schemas, and model power, architectures deliver peak performance at minimal cost."
]

part4_say = [
    "Decomposing a sprawling monolithic Omniprompt into a modular prompt library requires a systematic software engineering methodology. Moving from a single chaotic prompt file to an enterprise-grade prompt architecture demands rigorous domain boundary definition, negative constraint isolation, interface contract standardization, and comprehensive regression test suites.",
    "The first step in omniprompt decomposition is Domain Responsibility Segregation. Systems architects review the monolithic prompt and partition its instructions into cohesive, orthogonal operational domains: Customer Onboarding, Transaction Disputes, Policy Inquiries, and Technical Troubleshooting. Each domain is isolated into its own dedicated modular prompt file maintained by the relevant business unit, establishing clear institutional ownership and eliminating cross-team merge conflicts.",
    "Negative constraint specialization represents one of the most powerful benefits of modular prompt design. In a monolithic prompt, negative constraints—such as 'Never discuss competitors' or 'Do not approve refunds over one hundred dollars'—must apply globally, frequently confusing the model in contexts where exceptions should exist. In modular architectures, negative constraints are tailored with surgical precision: the Refund Handler contains strict refund ceilings, while the Escalation Handler contains explicit override authority, eliminating cognitive confusion.",
    "Standardized prompt interface contracts ensure interoperability across the modular library. Every specialized prompt template is structured with uniform sections: System Role and Tone, Domain Invariant Boundaries, Injected Context Slot, Active Tool Schemas, Output Format Schema, and Few-Shot Exemplars. This standardization allows software engineers to develop automated linting, testing, and deployment pipelines that treat prompts as first-class software artifacts.",
    "Golden evaluation benchmark suites safeguard decomposed prompt modules against silent behavioral regressions. For every modular prompt, engineering teams curate hundreds of historical input-output pairs spanning typical workflows, boundary constraints, and adversarial edge cases. Automated continuous integration runners execute evaluation passes on every pull request, measuring exact match rates, semantic similarity scores, and LLM-as-a-judge alignment metrics before any prompt update reaches production.",
    "Context window hygiene is vastly superior in modular prompts compared to monolithic architectures. Because a specialized prompt contains only the instructions and schemas necessary for its specific domain, the total prompt token count drops from four thousand words down to several hundred tokens. This dramatic context reduction leaves ample capacity for user input and reference documents, while positioning critical directives in peak transformer attention zones.",
    "Negative constraint containment also provides essential defense against cross-domain jailbreaks and adversarial prompt extraction. In an omniprompt, a user prompt exploiting a vulnerability in customer service policies can bleed into administrative privilege escalation directives. In isolated modular architectures, administrative tools and sensitive policies are physically sequestered behind separate authenticated routes, ensuring that an attacker manipulating a general service prompt has zero architectural access to elevated capabilities.",
    "Automated prompt versioning and semantic drift monitoring track the performance of individual modular prompts over time. When a business unit updates the instructions in the Billing Prompt, continuous evaluation pipelines execute automated test suites against historical billing inquiries, measuring accuracy, latency, and compliance. If the modification causes a regression, the deployment pipeline halts, isolating the failure to a single module without affecting other enterprise services.",
    "A/B testing and experimentation become trivial in modular prompt architectures. Rather than risking whole-platform instability by modifying a monolithic prompt, growth and product teams can deploy experimental prompt variants for specific intent categories, routing a fraction of user traffic to the candidate prompt and measuring user satisfaction and task completion rates before promoting the update to full production.",
    "Governance frameworks benefit substantially from this modular separation of concerns. Compliance auditors can examine and sign off on legal and regulatory disclaimers within their isolated modules without needing to re-validate hundreds of pages of technical troubleshooting rules, dramatically accelerating regulatory approval cycles across enterprise deployments.",
    "Modular prompt decomposition establishes the foundation for scalable, enterprise-grade AI governance. By transforming unstructured text prompts into maintainable, testable, and isolated software modules, organizations unlock unprecedented agility and reliability across their artificial intelligence initiatives."
]

part5_say = [
    "Translating hierarchical routing and modular prompt architectures into industrial enterprise reality requires constructing a hardened, high-throughput Python orchestration service. Developing a production routing engine demands sub-fifty-millisecond intent classification, asynchronous parallel task dispatching, pre-compiled schema validation, robust fallback recovery boundaries, and comprehensive distributed telemetry instrumentation.",
    "The software architecture of a production prompt routing service comprises five modular layers: the Request Gateway, the Semantic Intent Classifier, the Hierarchical Dispatcher, the Modular Prompt Engine, and the Telemetry & Provenance Vault. The Request Gateway ingests incoming user requests, validating session tokens and rate limits before passing the payload to the Intent Classifier.",
    "The Semantic Intent Classifier utilizes quantized sentence transformer models running on ONNX Runtime or TensorRT to compute embedding representations with single-digit millisecond latency. The engine executes vector similarity search against pre-compiled category centroids indexed in memory-mapped data structures, achieving instantaneous intent classification without network I/O overhead.",
    "Asynchronous parallel dispatching ensures that intent classification, context retrieval, and model invocation execute with maximum efficiency. Once intent is classified, the Python controller uses asyncio gather to fetch relevant RAG documents from vector databases while simultaneously assembling the modular prompt template and validating tool schemas, eliminating serial waiting times and compressing end-to-end execution to minimum theoretical limits.",
    "Comprehensive OpenTelemetry distributed tracing captures granular metrics across every routing transaction. The Python harness emits spans tracking intent classification duration, category confidence scores, model tier selection, prompt token volume, and downstream execution latency. Enterprise observability dashboards visualize traffic distributions across categories in real time, alerting site reliability engineers to anomalous intent spikes or degraded model endpoints.",
    "Robust fallback and safety boundaries prevent system outages during classification ambiguity or upstream provider degradation. If an intent classifier returns a confidence score below ninety percent, the engine activates defensive triage routines, executing a secondary verification check or routing the request to a conservative multi-purpose prompt with explicit user clarification questions.",
    "Formal cryptographic provenance logging seals every routing decision with an immutable audit trail. The service records the SHA-256 hash of the incoming user query, the classified intent category, the specific modular prompt template version deployed, and the final response payload, archiving the audit record in encrypted enterprise compliance vaults to satisfy regulatory governance standards.",
    "Production resilience also mandates automated health probes, connection pooling with persistent HTTP/2 and gRPC channels, and circuit breakers on downstream foundation model APIs. When an upstream provider exhibits elevated error rates or throttling, the Python service trips circuit breakers locally, re-routing traffic to secondary model providers within milliseconds to preserve platform availability without dropping in-flight user requests.",
    "High-concurrency worker pooling ensures stable throughput under planetary enterprise loads. By deploying the Python routing service behind asynchronous ASGI servers like Uvicorn and Gunicorn worker pools with non-blocking event loops, the architecture effortlessly processes thousands of concurrent intent classification and prompt dispatch requests per second with negligible jitter.",
    "Comprehensive SLA watchdog daemons monitor end-to-end latency histograms across all routing tiers. If tail latency on intent classification exceeds fifty milliseconds or upstream model response times spike beyond acceptable thresholds, the watchdog triggers automated traffic shedding or activates cached fallback responses to safeguard platform responsiveness.",
    "Automated blue-green canary deployments ensure seamless rolling updates to intent taxonomy models and modular prompt templates. When a revised prompt module is published, the orchestration gateway shifts a controlled five-percent slice of live production traffic to the candidate version, validating real-time completion rates, latency envelopes, and user feedback before completing full fleet migration with zero platform downtime.",
    "Mastering hierarchical prompt routing and modular prompt engineering positions you as an elite architect of autonomous enterprise systems. By commanding intent classification, tiered model dispatching, and context isolation, you possess the capability to build planet-scale artificial intelligence platforms that deliver blazing performance, unbreakable reliability, and optimal cost efficiency across global enterprise ecosystems."
]

parts_data = [
    {
        "title": "The Collapse Of Monolithic Omniprompts: Why Single Prompts Fail Across Multi-Domain Systems",
        "say": part1_say,
        "example": "A banking Omniprompt confuses mortgage rules with checking account overdraft exceptions.",
        "tryIt": "Compare a four thousand word monolithic prompt against three specialized modular prompts.",
        "check": {
            "question": "What is the primary failure mode of monolithic Omniprompts in multi-domain applications?",
            "options": [
                "Cross-directive interference and attention collapse where rules contradict and dilute each other",
                "Permanently erasing the computer graphics processing unit memory registers during inference",
                "Forcing all downstream databases to delete their primary keys and foreign key constraints",
                "Converting all natural language words into unreadable binary machine code automatically"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Monolithic prompts suffer from cross-directive interference where rules in separate sections contradict or dilute attention, leading to hallucinations and rule violations."
        }
    },
    {
        "title": "Semantic Intent Classification & Vector Routers: Fast Embeddings & Lightweight Classifiers",
        "say": part2_say,
        "example": "A vector router calculates cosine similarity against category centroids in five milliseconds.",
        "tryIt": "Implement an embedding router that classifies customer queries into Billing, Tech, and Sales.",
        "check": {
            "question": "Why do production routing architectures use embeddings or small models instead of frontier LLMs?",
            "options": [
                "To achieve sub-fifty-millisecond classification latency and minimize operational API token costs",
                "Because small models have access to secret government databases that large models cannot read",
                "Because frontier models refuse to classify text unless the user pays in physical gold coins",
                "Because embeddings consume zero electrical energy and require no computer hardware to compute"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Using fast embeddings or small models enables sub-fifty-millisecond intent classification at trivial cost, preserving latency and budget for downstream tasks."
        }
    },
    {
        "title": "Hierarchical Dispatch Architecture: Dynamic Schema Injection & Multi-Tier Model Serving",
        "say": part3_say,
        "example": "A dispatcher routes routine FAQs to fast lightweight models and reserves frontier models for legal.",
        "tryIt": "Construct a multi-tier dispatcher that routes queries based on intent category and complexity.",
        "check": {
            "question": "How does multi-tier model serving achieve massive enterprise cost reductions?",
            "options": [
                "By resolving the majority of simple queries with fast inexpensive models, reserving frontier LLMs for complex cases",
                "By forcing cloud hosting providers to waive all commercial billing charges for enterprise accounts",
                "By automatically shutting down all corporate computers at five in the afternoon every day",
                "By replacing all database tables with flat text files stored on USB thumb drives"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Resolving simple queries with fast inexpensive models at low cost reserves expensive frontier models strictly for complex tasks, slashing blended costs by over eighty percent."
        }
    },
    {
        "title": "Omniprompt Decomposition & Modular Prompts: Negative Constraint Specialization & Context Isolation",
        "say": part4_say,
        "example": "A decomposed prompt library allows billing and security teams to update rules independently.",
        "tryIt": "Decompose a multi-topic customer service prompt into three isolated modular prompt templates.",
        "check": {
            "question": "What is the primary maintenance advantage of decomposing an Omniprompt into modular prompts?",
            "options": [
                "Different business units can update domain rules independently without risking platform-wide regressions",
                "It eliminates the need for software developers to write documentation or test cases for their code",
                "It allows language models to run without consuming any random access memory on the server",
                "It automatically translates all corporate prompts into seventeen different foreign languages"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Modular prompt decomposition allows separate teams to own and update domain-specific prompts independently, eliminating cross-team merge conflicts and regression risks."
        }
    },
    {
        "title": "Enterprise Routing Engineering: Implementing A Sub-50ms Dynamic Prompt Dispatcher In Python",
        "say": part5_say,
        "example": "An enterprise routing engine dispatches incoming banking requests concurrently with tracing.",
        "tryIt": "Build a modular Python router with ONNX embedding classification, async dispatch, and tracing.",
        "check": {
            "question": "What role do fallback boundaries play in production semantic intent routing engines?",
            "options": [
                "Safeguarding availability by routing low-confidence or anomalous queries to defensive triage routines",
                "Automatically disconnecting the corporate local area network whenever an error is detected",
                "Deleting all incoming user questions that do not contain exactly twelve alphabetical words",
                "Forcing all external software libraries to downgrade their version numbers automatically"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Fallback boundaries intercept low-confidence or out-of-domain queries and steer them to defensive triage or human escalation, preventing erratic routing."
        }
    }
]

code1 = '''def test_day39_hierarchical_prompt_router():
    """
    Day 39: Hierarchical Prompt Routing & Intent Classification: Dynamic Dispatch, Semantic Routers & Omniprompt Decomposition
    """
    categories = {
        "Tier 1: Fast FAQ & Status": {"model": "In-Memory Semantic Cache / 8B Classifier", "share_pct": 65.0, "cost_per_m": 0.10},
        "Tier 2: Specialized Business Ops": {"model": "Domain-Specific Modular Prompts", "share_pct": 25.0, "cost_per_m": 0.80},
        "Tier 3: Complex Multi-Hop Synthesis": {"model": "Frontier Flagship Reasoning Model", "share_pct": 10.0, "cost_per_m": 5.00}
    }

    blended_cost = sum(data["share_pct"] / 100 * data["cost_per_m"] for data in categories.values())
    monolithic_cost = 5.00
    cost_reduction_pct = round(((monolithic_cost - blended_cost) / monolithic_cost) * 100, 1)

    return {
        "routerArchitecture": "Hierarchical Semantic Intent Classifier & Dynamic Dispatch Engine",
        "omnipromptDecompositionStatus": "DECOMPOSED_INTO_THREE_SPECIALIZED_TIERS",
        "blendedCostPerMillionTokensUSD": round(blended_cost, 2),
        "monolithicOmnipromptCostPerMillionTokensUSD": monolithic_cost,
        "enterpriseCostSavingsPct": cost_reduction_pct,
        "intentClassificationAccuracyPct": 99.4,
        "status": "HIERARCHICAL_ROUTING_ACTIVE"
    }'''

output1 = '''{
  "routerArchitecture": "Hierarchical Semantic Intent Classifier & Dynamic Dispatch Engine",
  "omnipromptDecompositionStatus": "DECOMPOSED_INTO_THREE_SPECIALIZED_TIERS",
  "blendedCostPerMillionTokensUSD": 0.77,
  "monolithicOmnipromptCostPerMillionTokensUSD": 5.0,
  "enterpriseCostSavingsPct": 84.7,
  "intentClassificationAccuracyPct": 99.4,
  "status": "HIERARCHICAL_ROUTING_ACTIVE"
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

day39_dict = {
    "id": "prompt-py-39",
    "day": 39,
    "course": "prompt-py",
    "title": "Hierarchical Prompt Routing & Intent Classification: Dynamic Dispatch, Semantic Routers & Omniprompt Decomposition",
    "minutes": 38,
    "parts": parts_data,
    "projectStep": {
        "title": "Implement Hierarchical Semantic Intent Router & Dispatcher",
        "steps": [
            "Decompose monolithic enterprise prompts into modular, domain-specific prompt templates.",
            "Construct a vector embedding intent classifier using in-memory category centroid indexing.",
            "Implement multi-tier model serving that routes simple queries to fast models and complex queries to flagship LLMs.",
            "Incorporate dynamic tool and schema injection that provisions only relevant tools per classified intent.",
            "Deploy the sub-fifty-millisecond routing platform with OpenTelemetry distributed tracing and fallback triage."
        ]
    },
    "summary": [
        "Monolithic Omniprompts suffer from cross-directive interference, latency bloat, and unmanageable maintenance overhead.",
        "Hierarchical semantic routers classify user intent in sub-fifty milliseconds using vector embeddings and lightweight models.",
        "Dynamic schema injection provisions only relevant tools and directives, maximizing reasoning accuracy and saving tokens.",
        "Multi-tier model serving reduces blended enterprise API costs by over eighty percent while accelerating response times.",
        "Production Python routing engines implement asynchronous dispatch, fallback triage, and OpenTelemetry observability."
    ]
}

captions_data = [
    {
        "say1": "Monolithic Omniprompts suffer from cross directive interference.",
        "say2": "The primary failure pathology of the Omniprompt is prompt interference.",
        "example": "Banking prompts confuse mortgage rules with checking overdraft waivers.",
        "tryIt": "Compare a four thousand word monolithic prompt against modular templates."
    },
    {
        "say1": "Semantic intent classifiers categorize inquiries in sub fifty milliseconds.",
        "say2": "Vector embedding routers represent foundational mechanism for speed.",
        "example": "Vector routers calculate cosine similarity against category centroids.",
        "tryIt": "Implement an embedding router classifying queries into discrete domains."
    },
    {
        "say1": "Hierarchical dispatch architecture governs dynamic prompt assembly.",
        "say2": "Dynamic schema and tool injection represents first major responsibility.",
        "example": "Dispatchers route FAQs to fast models and reserve frontier LLMs for legal.",
        "tryIt": "Construct a multi tier dispatcher routing queries based on complexity."
    },
    {
        "say1": "Decomposing monolithic Omniprompts requires systematic engineering.",
        "say2": "The first step in omniprompt decomposition is domain segregation.",
        "example": "Decomposed prompt libraries allow billing and security to update rules.",
        "tryIt": "Decompose a multi topic prompt into three isolated modular templates."
    },
    {
        "say1": "Enterprise routing translates architectures into python services.",
        "say2": "The software architecture comprises five decoupled microservice layers.",
        "example": "Enterprise routing engines dispatch incoming banking requests concurrently.",
        "tryIt": "Build a modular Python router with embedding classification and tracing."
    }
]

titles = [
    "Monolithic Omniprompt Failures And Cross Directive Attention Collapse.",
    "Semantic Intent Classification And Sub Fifty Millisecond Vector Routing.",
    "Hierarchical Dispatch Architecture And Multi Tier Model Serving.",
    "Omniprompt Decomposition And Modular Negative Constraint Specialization.",
    "Enterprise Routing Engineering And Production Python Service Deployment."
]

columns_list = [
    ["Prompt Architectural Strategy", "Context Organization Profile", "Enterprise Operational SLA"],
    ["Routing Mechanism", "Classification Technology", "Latency And Accuracy Profile"],
    ["Serving Model Tier", "Assigned Workload Category", "Cost And Performance Profile"],
    ["Modular Design Dimension", "Engineering Implementation", "Governance Resilience Profile"],
    ["Platform Service Layer", "Component Implementation", "Production Reliability SLA"]
]

steps_rows = [
    [
        [["Monolithic Omniprompt Mode", "Four Thousand Word Colossal Prompt", "High Cross Directive Contradiction Risk"], ["Modular Micro Prompt Fleet", "Domain Specific Isolated Prompt Templates", "Zero Cross Directive Interference"]],
        [["Compounding Latency Penalty", "Hundreds Of Milliseconds Pre Fill Time", "Sluggish Frustrating User Latency"], ["Surgical Prompt Dispatch", "Compact Sub Hundred Word Prompt Preambles", "Crisp Sub Second Interactive Experience"]],
        [["Billing Explosion Risk", "Paying Frontier Token Rates On Every Query", "Tens Of Thousands In Wasted Cloud Costs"], ["Multi Tier Serving Economy", "Blended Model Deployment By Complexity", "Eighty Four Percent Cost Reduction"]],
        [["Engineering Merge Conflicts", "Single Shared Prompt File Across Teams", "Fragile High Risk Deployment Cycle"], ["Domain Ownership Model", "Decoupled Prompt Files Per Business Unit", "Rapid Agility With Zero Cross Regressions"]]
    ],
    [
        [["Vector Embedding Router", "Cosine Similarity Against Category Centroids", "Sub Fifty Millisecond Intent Matching"], ["Lightweight SLM Classifier", "Fine Tuned Small Model On Taxonomies", "Deep Nuanced Intent Disambiguation"]],
        [["Pydantic JSON Contract", "Structured Intent Category Output Schemas", "Deterministic Type Safe Routing Decision"], ["Defensive Fallback Triage", "Route Anomalous Queries To UNKNOWN Handler", "Protects Against Hostile Injection Attacks"]],
        [["Intent Drift Monitor", "Cluster Unclassified Queries In Latent Space", "Proactive Detection Of Shifting Behaviors"], ["Memory Mapped Vector Index", "In Memory Centroid Search In Single Digit Ms", "Zero Network I O Overhead On Classification"]],
        [["Confidence Score Filter", "Enforce Strict Ninety Percent Confidence Bars", "Prevents Erratic Misclassification Traps"], ["Zero Shot Classifier Core", "Semantic Proximity Matching On Embeddings", "Instantaneous High Accuracy Intent Routing"]]
    ],
    [
        [["Dynamic Schema Injector", "Inject Only Relevant Tool Schemas Per Intent", "Maximizes Tool Selection Reasoning Accuracy"], ["Tier One Model Fleet", "In Memory Caches And Eight Billion Classifiers", "Resolves Routine Inquiries At Ten Cents"]],
        [["Tier Two Mid Tier Fleet", "Domain Specific Fine Tuned Operational Models", "Handles Business Tasks At Eighty Cents"], ["Tier Three Frontier LLM", "Flagship Frontier Models For Deep Synthesis", "Reserved For Complex Ten Percent Edge Cases"]],
        [["Just In Time RAG Filter", "Pass Intent Metadata To Vector Retrieval", "Restricts Search To Verified Domain Vaults"], ["Session Context Store", "Maintain Identity Across Intent Swaps", "Seamless Multi Turn Conversational Flow"]],
        [["Failover Load Balancer", "Dynamic Provider Failover Under High Load", "Maintains Uptime During Cloud Outages"], ["Blended Economics Engine", "Optimal Algorithmic Model Tier Matching", "Delivers Planetary Enterprise Scalability"]]
    ],
    [
        [["Domain Responsibility Split", "Partition Instructions Into Cohesive Units", "Establishes Clear Institutional Ownership"], ["Negative Constraint Focus", "Surgically Targeted Rules Per Specialized Task", "Eliminates Overly Broad Negative Clashes"]],
        [["Uniform Interface Contract", "Standardized Sections Across All Prompts", "Enables Automated Linting And CI CD Gates"], ["Context Attention Peak", "Small Prompts Positioning Rules In Polar Zones", "Maximizes Retention On Crucial Directives"]],
        [["Automated Version Control", "Git Backed Prompt Repositories With Tracing", "Enables Instant Rollbacks On Regression"], ["A B Testing Harness", "Route Canary Traffic To Candidate Prompts", "Validates Performance Prior To Rollout"]],
        [["Modular Governance Board", "Dedicated Business Unit Review Ownership", "Eliminates Organizational Deployment Bottlenecks"], ["Prompt Linting Engine", "Automated Structural Quality Checks In CI", "Guarantees Standardized Enterprise Formats"]]
    ],
    [
        [["Request Gateway Layer", "Validate Session Tokens And Rate Limits", "Enforces Strict Enterprise Entry Boundaries"], ["ONNX Embedding Kernel", "Quantized Sentence Transformer Inference", "Single Digit Millisecond Representation"]],
        [["Async Parallel Dispatcher", "Concurrent RAG Retrieval And Prompt Build", "Eliminates Serial Network Idle Times"], ["OpenTelemetry Trace Core", "Distributed Spans Across Intent And LLM Calls", "Provides Granular System Observability"]],
        [["Safety Fallback Sandbox", "Secondary Intent Verification On Ambiguity", "Prevents Erratic Misrouting Incidents"], ["Cryptographic Audit Vault", "SHA Two Fifty Six Hash Of Prompt And Route", "Satisfies External Regulatory Oversight"]],
        [["Automated SLA Watchdog", "Sub Fifty Millisecond Classification SLA", "Maintains High Availability Platform SLA"], ["Dynamic Worker Cluster", "Isolated Distributed Routing Microservices", "Guarantees High Concurrency Throughput"]]
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
    "day": 39,
    "prefix": "prompt-py",
    "entries": entries
}

# Write lesson JSON
with open('C:/Users/Admin/Desktop/projects/Present-Career-os-platform/scripts/branch_c/prompt_day39_lesson.json', 'w', encoding='utf-8') as f:
    json.dump(day39_dict, f, indent=2)

# Write visual envelope
with open('C:/Users/Admin/Desktop/projects/Present-Career-os-platform/src/lib/data/lessonVisuals/prompt-py/day-39.json', 'w', encoding='utf-8') as f:
    json.dump(visual_envelope, f, indent=2)

print(f"Generated Day 39 lesson JSON ({total_words} words) and Visual Envelope successfully!")
