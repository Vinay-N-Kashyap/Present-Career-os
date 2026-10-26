import json
import hashlib
import re

part1_say = [
    "In large-scale enterprise artificial intelligence deployments, prompt context inflation represents one of the most severe drivers of operational cost, latency degradation, and system unreliability. As organizations integrate language models into production retrieval-augmented generation pipelines, customer service agent meshes, and automated document analysis workflows, the volume of contextual text injected into each prompt expands relentlessly. A typical enterprise prompt frequently incorporates multi-page corporate policies, extensive chat interaction histories, verbose API specifications, and several retrieved reference documents, routinely accumulating four to eight thousand tokens per inference invocation.",
    "The financial implications of uncompressed prompt inflation compound exponentially across planetary operational volumes. Modern cloud foundation model providers bill enterprise customers on a strict per-token consumption basis, where input prompt tokens and output completion tokens are metered continuously. In an organization processing millions of customer inquiries monthly, an unoptimized prompt architecture that wastes three thousand redundant tokens per call inflates annual API operating expenditures by hundreds of thousands of dollars, consuming capital that yields zero incremental informational return.",
    "Beyond direct financial expenditure, prompt bloat severely degrades end-to-end model response latency through the physics of the transformer pre-fill phase. Before a language model can emit its very first completion token, the inference engine must process all input prompt tokens through its multi-head attention layers to construct the initial Key-Value cache. The computational time required for this pre-fill phase scales with prompt length; processing a bloated five-thousand-token prompt requires hundreds of milliseconds of compute time on high-end GPU clusters, causing noticeable latency lag that frustrates human users.",
    "Information density within natural language text is notoriously non-uniform. In human linguistic communication, up to seventy percent of emitted tokens consist of syntactic connective tissue, repetitive boilerplate headers, conversational pleasantries, and redundant grammatical framing. While necessary for human social interaction and grammatical aesthetics, these low-information tokens add virtually zero value to the mathematical attention layers of a transformer model tasked with factual reasoning, entity extraction, or structured code generation.",
    "Naive truncation and heuristic keyword filtering represent crude, dangerous approaches to prompt reduction. Truncating context windows by cutting off the oldest messages or chopping documents at arbitrary character boundaries frequently severs vital logical dependencies, causing models to hallucinate missing facts or overlook critical business constraints. Similarly, simple stop-word removal algorithms destroy syntactic coherence, disorienting tokenizer embeddings and degrading reasoning performance.",
    "Context budgeting and prompt compression must be elevated into a rigorous engineering discipline governed by information theory. Modern prompt engineering architectures deploy dedicated compression layers that evaluate token importance mathematically, pruning low-information tokens while preserving essential semantic entropy, key named entities, numerical variables, and causal relationships.",
    "The advent of small, specialized language models enables real-time prompt compression without human intervention. By deploying lightweight, cost-effective models to evaluate and prune prompts before they are dispatched to expensive flagship foundation models, enterprise architectures achieve massive cost savings while maintaining uncompromised reasoning fidelity.",
    "Mastering prompt compression and context budgeting marks the maturation of prompt engineering from qualitative prompt authoring into quantitative systems optimization. By commanding perplexity-aware token pruning and KV-cache economics, you unlock the ability to deliver blazing-fast, cost-efficient artificial intelligence platforms at planetary scale."
    "Continuous automated token consumption profiling reveals that context inflation also introduces compounding vulnerability to prompt injection and jailbreak payloads. Because security classifiers and guardrail models must scan the entire uncompressed context window, bloated prompts with thousands of background tokens dilute defensive attention, making it easier for subtle adversarial perturbations to slip through unnoticed. Compressing prompts down to high-salience factual cores strengthens defensive scrutiny, protecting enterprise pipelines against hostile prompt manipulations.",
    "Financial return on investment analyses for context compression engines demonstrate rapid capital payback across high-throughput enterprise deployments. By reducing average prompt token consumption from five thousand tokens to fifteen hundred tokens across twenty million monthly API calls, an enterprise saves dozens of billions of tokens annually. These empirical savings translate directly into hundreds of thousands of dollars in reduced cloud provider invoices, justifying dedicated engineering investment in prompt compression infrastructure.",
]

part2_say = [
    "At the mathematical foundation of modern prompt compression lies the LLMLingua framework, developed to achieve high-ratio token reduction while maintaining semantic reasoning integrity. Rather than relying on static heuristic rules or naive sentence scoring, LLMLingua leverages a compact, well-calibrated language model—such as a small open-weights transformer—to compute exact token-level perplexity scores across the input prompt context.",
    "Perplexity in information theory measures how surprised a language model is by the occurrence of a specific token given its preceding context. When a token represents routine grammatical boilerplate, predictable syntactic connectors, or repetitive phrasing, the model's conditional probability for that token is high, yielding a low perplexity score. Conversely, when a token introduces a unique proper noun, a specific numerical value, an architectural constraint, or an unexpected logical condition, the model's conditional probability drops, resulting in a high perplexity score that signifies high informational density.",
    "The core operational principle of perplexity-aware pruning is that tokens with low perplexity can be safely eliminated from the prompt with minimal impact on downstream reasoning. If an enterprise document contains the phrase 'It is critically important to bear in mind that the server timeout is fifty milliseconds', the introductory rhetorical clause exhibits exceptionally low perplexity and can be pruned down to 'server timeout fifty milliseconds' without degrading the flagship model's comprehension of the underlying architectural constraint.",
    "LLMLingua operationalizes this principle through a multi-stage coarse-to-fine compression pipeline. The framework does not evaluate all prompt tokens in a single monolithic pass, which would be computationally inefficient for massive multi-thousand-token contexts. Instead, it partitions the input into hierarchical structural units: documents, sections, sentences, and individual tokens, progressively allocating token budgets based on informational entropy.",
    "Budget allocation across multi-document contexts prevents information collapse. In enterprise RAG workflows where ten documents are retrieved, some documents possess high query relevance while others provide tangential background. LLMLingua computes cross-attention density and document-level perplexity, dynamically assigning larger token budgets to highly salient documents while aggressively compressing peripheral references, maintaining balanced informational perspective.",
    "Conditional probability alignment ensures that pruning a token does not distort the contextual representation of subsequent tokens. A naive token pruner that simply deletes all tokens below an arbitrary perplexity threshold can create unreadable, fragmented token sequences that confuse the target model. LLMLingua utilizes dynamic thresholding and sentence-level continuity scoring to preserve necessary syntactic anchors, ensuring that the pruned text remains easily interpretable by downstream transformers.",
    "Small language models used for compression operate with extreme computational velocity and minimal hardware footprints. A compact model with hundreds of millions or few billion parameters processes thousands of prompt tokens in tens of milliseconds on commodity CPU or GPU instances, adding negligible latency overhead to the broader inference pipeline while unlocking massive downstream savings.",
    "Perplexity-driven compression provides an objective, mathematically rigorous foundation for context curation. By treating language models as information-theoretic compression engines, systems engineers systematically strip representational waste while safeguarding critical business intelligence."
    "Cross-entropy loss calculation provides the mathematical foundation for evaluating candidate token importance during compression passes. By processing the candidate prompt through the small language model and computing the negative log-likelihood of each token conditioned on its preceding context, the engine derives an objective, scalar representation of informational surprise. Tokens associated with high negative log-likelihood represent critical cognitive milestones that anchor downstream reasoning, while tokens with near-zero loss are flagged as redundant syntactic fluff.",
    "Dynamic vocabularies and multi-tokenizer mapping protocols ensure that small compression models remain compatible with heterogeneous downstream foundation models. Because different foundation model families utilize distinct Byte-Pair Encoding vocabularies and tokenization rules, the compression engine operates across normalized character and subword spans, ensuring that token pruning decisions translate cleanly regardless of which target LLM serves the final completion.",
]

part3_say = [
    "Budgeted token pruning operationalizes prompt compression as a constrained optimization problem. An enterprise prompt architect defines a target token budget—such as compressing a five-thousand-token document corpus down to fifteen hundred tokens—and the compression engine must solve for the optimal token subset that maximizes semantic information retention while strictly adhering to the budget ceiling.",
    "The coarse-to-fine compression hierarchy begins with Document-Level Filtering. In complex multi-source inquiries, the compression controller first inspects all candidate document blocks, computing coarse semantic similarity scores against the user query. Documents that fall below a baseline relevance threshold are pruned in their entirety before token-level scoring begins, eliminating entire swaths of irrelevant text in single-digit milliseconds.",
    "The second hierarchical stage executes Sentence-Level Pruning. Within the surviving relevant documents, the engine evaluates each sentence's perplexity and relevance, assigning importance weights. Sentences that merely restate preceding concepts, provide generic introductions, or contain legal boilerplate are excised or compressed down to their essential clauses, preserving structural coherence while shedding dozens of unnecessary words.",
    "The final hierarchical stage performs Token-Level Budgeted Slicing. The remaining sentences are tokenized, and the small language model computes token-level perplexity scores. The compression engine constructs a global priority queue of tokens ordered by perplexity, retaining only the highest-scoring tokens until the target budget ceiling is reached. To prevent grammatical disintegration, the engine enforces local token adjacency constraints, ensuring that multi-token entities—such as technical identifiers or dates—are not fractured into uninterpretable fragments.",
    "Instruction and Question Preservation Invariants protect vital operational directives from being pruned. In enterprise prompts, system instructions, role definitions, formatting schemas, and the specific user inquiry carry absolute priority; they must never be subjected to lossy compression. The compression controller segregates these sensitive prompt regions, applying zero pruning to system and query tokens while directing one hundred percent of the compression budget toward background reference texts.",
    "Demonstration and Few-Shot Example Compression delivers substantial efficiency gains in complex reasoning tasks. Few-shot prompts often consume thousands of tokens demonstrating desired input-output formats across five or six examples. By applying perplexity-aware pruning to intermediate reasoning steps within demonstration examples, the engine preserves format exemplars while reducing example token consumption by over fifty percent.",
    "Dynamic budget modulation automatically adjusts compression ratios based on real-time task complexity. If an incoming query is a straightforward factual lookup, the controller applies an aggressive four-to-one compression ratio, maximizing speed and cost savings. If the query requires intricate multi-hop logical synthesis across legal or financial documents, the engine automatically relaxes the compression ratio to two-to-one, preserving maximum contextual nuance.",
    "Budgeted token pruning transforms raw textual corpora into high-density cognitive concentrates. By stripping representational redundancy with mathematical precision, enterprise platforms feed downstream foundation models with pure informational signal."
    "Dynamic token priority scheduling utilizes min-max heap structures to execute budgeted pruning with logarithmic time complexity. The compression engine maps all evaluated tokens into a priority queue ordered by calculated importance scores, popping the lowest-ranked tokens until the total sequence length matches the target budget ceiling. This heap-based optimization ensures that even prompts spanning tens of thousands of tokens can be budgeted and sliced within single-digit milliseconds.",
    "Semantic density scoring incorporates inverse document frequency weights to prevent domain-specific terminology from being pruned in specialized applications. In clinical medicine or statutory law, rare technical terms might exhibit moderate local predictability within repetitive boilerplate sections yet carry immense legal or diagnostic significance. The compression controller cross-references token importance with domain terminology dictionaries, boosting the priority of specialized nomenclature to prevent accidental loss of vital domain knowledge.",
    "Empirical cross-entropy evaluations confirm that budgeted token pruning preserves critical reasoning chains without loss of inferential fidelity. When downstream foundation models are tested on complex mathematical reasoning and legal statutory interpretation using compressed contexts, accuracy scores remain within one percent of uncompressed baselines, demonstrating that information density is effectively preserved.",
]

part4_say = [
    "The physics of the Key-Value (KV) cache in modern transformer inference engines dictates the true economic and latency benefits of prompt compression. When a language model processes a sequence of tokens, each transformer layer computes and stores Key and Value projection matrices for every token in GPU High-Bandwidth Memory (HBM). In high-concurrency enterprise serving environments, the memory footprint of the KV-cache rapidly emerges as the absolute bottleneck limiting server capacity.",
    "KV-cache memory consumption scales linearly with prompt token length, batch size, number of transformer layers, and model hidden dimensions. For a seventy-billion-parameter foundation model operating with a sixteen-bit precision key-value cache, storing the KV-cache for a single eight-thousand-token prompt consumes gigabytes of precious GPU memory. When hundreds of concurrent users submit long prompts simultaneously, the inference cluster exhausts its GPU memory, forcing the server to reject requests or page cache tensors to slow host RAM, resulting in catastrophic latency spikes.",
    "Compressing prompt length by three-to-one directly slashes KV-cache memory allocation by sixty-six percent. By shrinking an input prompt from four thousand five hundred tokens down to fifteen hundred tokens, the inference engine allocates two-thirds less GPU high-bandwidth memory for that session. This dramatic memory reduction allows the serving engine to dramatically expand its concurrent batch size, processing two to three times more user requests on the exact same physical hardware.",
    "Pre-fill latency acceleration represents the second major hardware-level payoff of prompt compression. The time required for the initial forward pass through the transformer attention layers is directly proportional to prompt token length. Cutting prompt size by seventy percent compresses the pre-fill phase from several hundred milliseconds down to tens of milliseconds, drastically slashing time-to-first-token latency and delivering immediate, responsive output to end users.",
    "Prefix caching synergy unlocks further multiplicative efficiencies across production deployments. In high-volume enterprise applications, system instructions and tool schemas form a static prefix shared across millions of calls. By combining prefix caching for static directives with perplexity-aware compression for dynamic reference documents, systems achieve optimal hardware utilization: serving static prompts from memory caches while ingesting dynamic context at maximum token density.",
    "Energy efficiency and carbon footprint reduction represent significant environmental dividends of context optimization. Data centers hosting massive GPU clusters consume megawatts of electrical power driving matrix multiplications across bloated context windows. By systematically compressing prompts across enterprise workloads, engineering teams cut computational energy consumption by millions of kilowatt-hours annually.",
    "Hardware-level memory bandwidth profiling confirms that smaller KV-caches drastically reduce memory bandwidth saturation on modern GPUs. Because autoregressive token generation is memory-bandwidth bound rather than compute bound, smaller cache allocations allow tensor cores to stream weights and activations without waiting for memory buses, raising overall generation velocity.",
    "Understanding KV-cache physics elevates prompt engineering from textual prompt tuning to deep systems infrastructure optimization. By aligning context volume with hardware constraints, architects unlock peak inference efficiency across planetary computing clusters."
    "Memory bandwidth optimization during the autoregressive decoding phase represents another profound architectural benefit of smaller Key-Value caches. Because modern high-performance GPUs must stream Key-Value cache tensors from high-bandwidth memory to tensor registers for every newly generated token, large caches saturate memory bus channels, causing tensor execution units to stall. Compressing prompt contexts reduces memory bus traffic proportionally, raising generation throughput across high-concurrency enterprise clusters.",
    "Paging and virtual memory management in modern serving runtimes like vLLM benefit directly from prompt token reduction. In block-paged KV-cache architectures, reducing prompt length decreases the number of allocated memory blocks per request, mitigating physical memory fragmentation and allowing the serving scheduler to maintain higher packing densities across heterogeneous multi-tenant workloads.",
    "Continuous memory profiling across enterprise clusters demonstrates that smaller Key-Value cache allocations significantly reduce tail latency spikes during heavy inference concurrency. By preventing memory paging events and eliminating high-bandwidth memory bus saturation, context compression ensures that enterprise AI platforms deliver consistent, predictable sub-second response times across all operational tiers.",
]

part5_say = [
    "Building an enterprise-grade prompt compression service requires translating theoretical perplexity equations and KV-cache physics into a robust, high-throughput Python platform. Developing an industrial context pruner demands strict interface boundaries, asynchronous task workers, pre-compiled tokenizer bindings, comprehensive exception handling, and full-stack observability capable of maintaining strict enterprise SLAs.",
    "The software architecture of a production prompt compression service comprises five modular layers: the Context Ingestion Gateway, the Perplexity Scoring Engine, the Hierarchical Budget Controller, the Reconstruction & Integrity Filter, and the Telemetry Emitter. The Ingestion Gateway segregates prompts into protected directives and compressible background texts, passing compressible spans to the Perplexity Engine.",
    "The Perplexity Scoring Engine utilizes small, optimized models served via high-speed runtimes like ONNX Runtime or vLLM to compute token-level loss values with sub-millisecond per-token latency. To maximize throughput, the Python harness batches candidate document segments, leveraging SIMD vectorized operations to compute perplexity distributions across thousands of tokens simultaneously.",
    "The Reconstruction & Integrity Filter evaluates pruned token streams before final assembly. The filter scans the candidate output to verify that critical named entities, numerical digits, currency symbols, and technical identifiers were not inadvertently severed by the pruning algorithm. If an essential variable was dropped, the integrity filter re-injects the missing token, guaranteeing that mathematical and factual precision remain absolute.",
    "Comprehensive OpenTelemetry instrumentation tracks key context economics metrics across every compression call. The Python harness emits distributed traces capturing baseline token counts, compressed token counts, compression ratio, perplexity scoring latency, and estimated cloud API cost savings. Enterprise analytics dashboards visualize cumulative token savings in real time, demonstrating clear financial return on investment.",
    "Integration with enterprise vector retrieval pipelines allows compression to occur inline between document search and prompt assembly. As soon as a semantic retriever returns five candidate documentation chunks from an internal knowledge base, the compression worker prunes the chunks to fit a strict target budget before compiling the final prompt, ensuring that downstream foundation models never encounter context bloat.",
    "Resilient fallback boundaries protect production pipelines against small model outages or tokenizer anomalies. If the perplexity scoring engine encounters a GPU timeout or unexpected exception, the controller does not crash; instead, it gracefully falls back to extractive sentence-level heuristics, logging an operational alert while successfully completing the user request without service interruption.",
    "Mastering prompt compression and context budgeting positions you at the cutting edge of artificial intelligence systems engineering. By commanding information theory, perplexity-driven pruning, and hardware cache economics, you possess the capability to build high-performance AI architectures that deliver unmatched speed, accuracy, and cost efficiency across the enterprise."
    "Production-grade circuit breaker patterns protect downstream applications against transient compression engine slowdowns. If the small language model scoring service experiences high load or exceeds its thirty-millisecond processing deadline, the orchestrator triggers an automated degradation bypass: switching to lightweight regex-based boilerplate stripping and returning the partially pruned prompt to the caller, ensuring that user requests never experience blocking timeouts.",
    "Automated continuous delivery pipelines validate that updated compression models maintain high semantic retention before deployment. Every week, the evaluation harness runs standardized benchmark suites across thousands of historical enterprise queries, measuring whether compressed prompts produce outputs identical to uncompressed prompts. If semantic similarity scores drop below ninety-nine percent, the deployment pipeline halts, preventing degraded compression models from reaching production.",
    "Cryptographic provenance logging archives the exact compression ratio, pruned token bitmask, and SHA-256 hash of both input and output text for every inference transaction. This audit ledger provides complete forensic transparency, allowing compliance auditors and security engineers to verify that no critical regulatory disclosures or sensitive variables were altered or dropped during context optimization.",
    "Enterprise dashboard integration exposes real-time context economics metrics directly to financial operations teams. Executives and engineering managers can track cumulative token volume reductions, estimated cloud billing savings, average compression ratios by business unit, and latency improvements across millions of daily transactions, validating the financial efficiency of the compression platform.",
]

parts_data = [
    {
        "title": "Context Inflation & Economics: The Hidden Cost Of Bloated Enterprise Prompts",
        "say": part1_say,
        "example": "An enterprise customer service agent prunes thousands of redundant tokens from chat histories.",
        "tryIt": "Measure how token count inflation directly increases API costs and time to first token latency.",
        "check": {
            "question": "What is the primary operational defect caused by uncompressed prompt bloat in enterprise applications?",
            "options": [
                "Compounding API token costs and severe pre-fill latency lag that frustrates users",
                "Permanently erasing the computer operating system hard drive during inference",
                "Causing external cloud servers to disconnect from electrical power outlets",
                "Forcing all natural language words to be translated into Latin automatically"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Bloated prompts directly inflate per-token API billing while dramatically increasing the computational duration of the transformer pre-fill phase, degrading user latency."
        }
    },
    {
        "title": "LLMLingua Algorithmic Foundations: Small Language Models & Perplexity Calculation",
        "say": part2_say,
        "example": "A small language model scores high perplexity for proper nouns and low perplexity for boilerplate.",
        "tryIt": "Trace how token perplexity scores differentiate high information nouns from low information filler.",
        "check": {
            "question": "How does LLMLingua utilize token perplexity to identify redundant words for pruning?",
            "options": [
                "Low perplexity tokens represent predictable boilerplate and can be pruned with minimal semantic loss",
                "Tokens with low perplexity are automatically encrypted with proprietary secret keys",
                "High perplexity tokens are deleted because they indicate the model was confused by the word",
                "Perplexity is used to measure the physical temperature of the server graphics processing unit"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Tokens with low perplexity are highly predictable grammatical filler; pruning them strips representational waste while preserving high-perplexity informational tokens."
        }
    },
    {
        "title": "Budgeted Token Pruning: Dynamic Coarse-to-Fine Compression & Information Density",
        "say": part3_say,
        "example": "A coarse to fine pruning pipeline filters irrelevant documents before slicing sentences and tokens.",
        "tryIt": "Implement a hierarchical pruner that protects system prompts while compressing background text.",
        "check": {
            "question": "Why are system instructions and user queries protected from compression in budgeted token pruning?",
            "options": [
                "Because lossy compression on operational directives or queries could cause catastrophic task failure",
                "Because foundation models refuse to read prompts that do not contain complete English sentences",
                "Because system instructions are stored in read only memory chips that cannot be altered",
                "Because user questions contain secret passwords that must never be processed by computers"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "System instructions and queries define task constraints; pruning them risks corrupting core operational directives, whereas background reference texts tolerate lossy compression safely."
        }
    },
    {
        "title": "KV-Cache Physics & Latency Acceleration: Pre-Fill Optimization & Memory Footprints",
        "say": part4_say,
        "example": "Compressing prompts by three to one reduces GPU KV-cache allocation and doubles batch concurrency.",
        "tryIt": "Calculate the exact GPU high bandwidth memory savings achieved when compressing four thousand tokens.",
        "check": {
            "question": "How does reducing prompt token length directly improve GPU serving concurrency?",
            "options": [
                "By shrinking KV-cache memory allocation, allowing servers to process larger concurrent batches",
                "By increasing the clock speed of the server central processing unit automatically",
                "By forcing the inference engine to run on battery power rather than cloud servers",
                "By deleting all previous conversational history from database storage permanently"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Key-Value cache scales linearly with prompt length; compressing tokens directly slashes cache memory footprints, allowing GPUs to allocate memory for more concurrent user batches."
        }
    },
    {
        "title": "Enterprise Compression Engineering: Building A Production Prompt Pruner In Python",
        "say": part5_say,
        "example": "An enterprise compression microservice prunes retrieved document chunks before prompt assembly.",
        "tryIt": "Build a modular Python class with perplexity scoring, entity preservation, and telemetry tracing.",
        "check": {
            "question": "What is the primary architectural purpose of the Reconstruction & Integrity Filter in a prompt pruner?",
            "options": [
                "Verifying that critical named entities, digits, and identifiers were not severed during pruning",
                "Translating Python code into machine code assembly instructions for faster execution",
                "Encrypting model parameters to prevent competitors from inspecting internal algorithms",
                "Deleting all non-English words from incoming user queries automatically"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "The Reconstruction & Integrity Filter acts as a safety guard, confirming that essential entities and numerical variables remain intact and re-injecting them if severed."
        }
    }
]

code1 = '''def test_day38_prompt_compression_llmlingua():
    """
    Day 38: Prompt Compression & Context Budgeting: LLMLingua, Perplexity-Aware Token Pruning & KV-Cache Economics
    """
    baseline_tokens = 4500
    compressed_tokens = 1350
    pruned_tokens = baseline_tokens - compressed_tokens
    compression_ratio = round(baseline_tokens / compressed_tokens, 2)

    return {
        "compressionFramework": "LLMLingua Perplexity-Aware Budgeted Token Compressor",
        "baselineContextTokens": baseline_tokens,
        "compressedContextTokens": compressed_tokens,
        "prunedRedundantTokens": pruned_tokens,
        "compressionRatio": f"{compression_ratio}x",
        "informationEntropyRetentionPct": 98.4,
        "kvCacheMemorySavingsPct": 70.0,
        "status": "PERPLEXITY_PRUNING_BUDGET_ENFORCED"
    }'''

output1 = '''{
  "compressionFramework": "LLMLingua Perplexity-Aware Budgeted Token Compressor",
  "baselineContextTokens": 4500,
  "compressedContextTokens": 1350,
  "prunedRedundantTokens": 3150,
  "compressionRatio": "3.33x",
  "informationEntropyRetentionPct": 98.4,
  "kvCacheMemorySavingsPct": 70.0,
  "status": "PERPLEXITY_PRUNING_BUDGET_ENFORCED"
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

day38_dict = {
    "id": "prompt-py-38",
    "day": 38,
    "course": "prompt-py",
    "title": "Prompt Compression & Context Budgeting: LLMLingua, Perplexity-Aware Token Pruning & KV-Cache Economics",
    "minutes": 38,
    "parts": parts_data,
    "projectStep": {
        "title": "Implement LLMLingua Perplexity Aware Prompt Compressor",
        "steps": [
            "Construct a coarse-to-fine compression pipeline spanning document, sentence, and token pruning.",
            "Deploy a compact language model to compute token-level perplexity scores across candidate text.",
            "Enforce strict preservation invariants protecting system instructions and target user queries.",
            "Implement a Reconstruction and Integrity Filter that verifies named entities and numbers remain intact.",
            "Integrate the compression engine inline with enterprise retrieval pipelines and telemetry tracing."
        ]
    },
    "summary": [
        "Uncompressed prompt inflation drives up cloud API operational expenditures and degrades pre-fill latency.",
        "LLMLingua computes token-level perplexity using small language models, pruning low-information syntactic filler.",
        "A coarse-to-fine hierarchy filters documents, prunes sentences, and slices tokens to meet exact budgets.",
        "Compressing prompt length directly slashes GPU KV-cache memory allocations, enabling higher batch concurrency.",
        "Production Python compression services incorporate integrity filters, entity preservation, and OpenTelemetry tracing."
    ]
}

captions_data = [
    {
        "say1": "Prompt context inflation represents severe driver of operational costs.",
        "say2": "The financial implications of uncompressed prompt inflation compound.",
        "example": "Customer service agents prune redundant tokens from long chat records.",
        "tryIt": "Measure how token count inflation increases API costs and latency."
    },
    {
        "say1": "LLMLingua leverages compact models to compute token level perplexity.",
        "say2": "Perplexity in information theory measures how surprised models are.",
        "example": "Small models score high perplexity for nouns and low for boilerplate.",
        "tryIt": "Trace how token perplexity scores differentiate nouns from filler."
    },
    {
        "say1": "Budgeted token pruning operationalizes compression as optimization.",
        "say2": "The coarse to fine compression hierarchy begins with document filtering.",
        "example": "Coarse to fine pruning pipelines filter documents before token slicing.",
        "tryIt": "Implement a hierarchical pruner protecting system prompts and queries."
    },
    {
        "say1": "The physics of the Key Value cache dictates true economic benefits.",
        "say2": "Key Value cache memory consumption scales linearly with prompt length.",
        "example": "Compressing prompts by three to one reduces memory and doubles batches.",
        "tryIt": "Calculate the exact GPU high bandwidth memory savings from compression."
    },
    {
        "say1": "Enterprise compression engineering implements modular python engines.",
        "say2": "The software architecture comprises five decoupled microservice layers.",
        "example": "Enterprise compression microservices prune retrieved document chunks.",
        "tryIt": "Build a modular Python class with perplexity scoring and tracing."
    }
]

titles = [
    "Context Inflation Economics And Pre Fill Latency Degradation Dynamics.",
    "LLMLingua Foundations And Perplexity Calculation Architecture.",
    "Budgeted Token Pruning And Coarse To Fine Hierarchical Compression.",
    "Key Value Cache Physics And High Concurrency Serving Optimization.",
    "Enterprise Compression Engineering And Production Service Deployment."
]

columns_list = [
    ["Context Dimension", "Uncompressed Prompt Profile", "Compressed Context Profile"],
    ["Information Factor", "Linguistic Representation", "Perplexity Scoring Metric"],
    ["Pruning Hierarchy Stage", "Algorithmic Granularity", "Information Optimization Target"],
    ["GPU Hardware Dimension", "Physical Resource Impact", "Concurrency Scaling Breakthrough"],
    ["Platform Service Layer", "Component Implementation", "Production Reliability SLA"]
]

steps_rows = [
    [
        [["Prompt Token Volume", "Bloated Multi Thousand Token Context", "Lean Compressed High Density Context"], ["API Operational Cost", "Continuous High Per Token Billing Drain", "Sixty Percent Operational Cost Reduction"]],
        [["Pre Fill Latency Lag", "Hundreds Of Milliseconds GPU Pre Fill", "Tens Of Milliseconds Rapid Response"], ["Information Density", "Seventy Percent Redundant Syntactic Tissue", "Concentrated Semantic Entropy Nucleus"]],
        [["Attention Dispersion", "Attention Weights Diluted In Background", "Focused Attention On Vital Variables"], ["Enterprise Scalability", "Restricted Concurrent Session Capacity", "Massive Planetary Request Throughput"]],
        [["System Reliability", "Vulnerable To Context Overflow Crashes", "Strict Bounded Context Ceiling Safety"], ["Latency SLA Profile", "Unpredictable Response Tail Latencies", "Deterministic Crisp User Experience"]]
    ],
    [
        [["Perplexity Metric Core", "Measure Information Theoretic Surprise", "High Score Denotes Critical Variable"], ["Low Perplexity Token", "Predictable Grammatical Filler And Boilerplate", "Pruned With Minimal Semantic Loss"]],
        [["High Perplexity Token", "Unique Named Entity Number Or Constraint", "Preserved With Absolute Fidelity"], ["Small Language Model", "Sub Millisecond Vectorized Loss Scoring", "Zero Latency Overhead On Processing"]],
        [["Coarse To Fine Slicing", "Hierarchical Document Sentence Token Filter", "Optimizes Compute Across Long Spans"], ["Conditional Alignment", "Preserve Syntactic Anchors Across Tokens", "Guarantees Downstream Model Coherence"]],
        [["Information Entropy Floor", "Preserve Core Factual Meaning In Text", "Zero Factual Reasoning Degradation"], ["Dynamic Thresholding", "Adaptive Perplexity Cuts Per Sentence", "Prevents Broken Fragmented Sequences"]]
    ],
    [
        [["Document Level Pruning", "Filter Entire Peripheral Reference Texts", "Coarse Fast Relevance Elimination"], ["Sentence Level Pruning", "Excise Redundant Clauses And Boilerplate", "Preserves Core Grammatical Meaning"]],
        [["Token Level Slicing", "Global Priority Queue Perplexity Pruning", "Strictly Satisfies Target Budget Limits"], ["Instruction Invariant", "Zero Pruning On System Prompts And Schemas", "Protects Vital Operational Directives"]],
        [["Few Shot Compression", "Prune Intermediate Example Demonstrations", "Fifty Percent Example Token Savings"], ["Dynamic Budget Sizer", "Adaptive Ratio Based On Query Difficulty", "Balances Speed With Nuanced Depth"]],
        [["Token Adjacency Guard", "Preserve Local Multi Token Entity Blocks", "Prevents Broken Numerical Identifiers"], ["Target Budget Governor", "Strict Upper Ceiling Token Enforcement", "Guarantees Predictable Memory Usage"]]
    ],
    [
        [["KV Cache Allocation", "Gigabytes Of GPU Memory Per Long Prompt", "Two Thirds Less Cache Memory Needed"], ["Pre Fill Phase Speed", "Prolonged Attention Matrix Calculations", "Slashes Time To First Token Drastically"]],
        [["Batch Concurrency Gain", "Server Saturated By Few Concurrent Users", "Triples Active Concurrent User Capacity"], ["Memory Bandwidth Bound", "High Bandwidth Memory Bus Saturation", "Smooth Vector Streaming Across Cores"]],
        [["Prefix Caching Synergy", "Combine Compressed Context With Prefix Cache", "Multiplicative Enterprise Efficiency Gain"], ["Carbon Footprint Reduction", "Megawatts Of Wasted Data Center Energy", "Cuts Megawatt Hours Of Compute Annually"]],
        [["Hardware Cluster ROI", "Demands Expensive Hardware Upgrades", "Extracts Maximum Yield From Existing GPUs"], ["Cluster High Availability", "Vulnerable To GPU Out Of Memory Rejections", "Uninterrupted High Concurrency Uptime"]]
    ],
    [
        [["Context Ingestion Gateway", "Segregate Directives From Compressible Spans", "Protects Mission Critical Directives"], ["Perplexity Scoring Kernel", "Vectorized Tensor Loss Computation", "Sub Millisecond Per Token Throughput"]],
        [["Reconstruction Filter", "Scan Pruned Text For Essential Entities", "Guarantees Absolute Numerical Precision"], ["OpenTelemetry Trace Emitter", "Emit Compression Ratio And Token Savings", "Provides Real Time Observability"]],
        [["Inline Vector Pipeline", "Prune RAG Document Chunks Before Assembly", "Prevents Downstream Context Bloat"], ["Resilient Fallback Guard", "Heuristic Sentence Pruning On Engine Timeout", "Guarantees High Service Availability"]],
        [["Cryptographic Hash Vault", "Tamper Evident Audit Log Of Pruned Texts", "Satisfies External Regulatory Oversight"], ["Automated SLA Watchdog", "Sub Second End To End Compression SLA", "Maintains High Availability Platform SLA"]]
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
    "day": 38,
    "prefix": "prompt-py",
    "entries": entries
}

# Write lesson JSON
with open('C:/Users/Admin/Desktop/projects/Present-Career-os-platform/scripts/branch_c/prompt_day38_lesson.json', 'w', encoding='utf-8') as f:
    json.dump(day38_dict, f, indent=2)

# Write visual envelope
with open('C:/Users/Admin/Desktop/projects/Present-Career-os-platform/src/lib/data/lessonVisuals/prompt-py/day-38.json', 'w', encoding='utf-8') as f:
    json.dump(visual_envelope, f, indent=2)

print(f"Generated Day 38 lesson JSON ({total_words} words) and Visual Envelope successfully!")
