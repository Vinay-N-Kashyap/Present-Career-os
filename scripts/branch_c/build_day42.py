import json
import hashlib
import re

part1_say = [
    "To resolve the deep structural impasse between the coarse-grained information loss of pooled Bi-Encoders and the astronomical computational latency of full Cross-Encoders, Stanford researchers Omar Khattab and Matei Zaharia introduced ColBERT, an acronym for Contextualized Late Interaction over BERT. ColBERT pioneered a transformative neural retrieval paradigm that decouples the representation of queries and documents while preserving fine-grained token-level interaction, establishing the theoretical and engineering foundation for modern multi-vector search.",
    "In traditional Bi-Encoder architectures, token representations are collapsed into a single pooled vector before retrieval occurs, destroying mutual information and triggering vector smearing. In Cross-Encoder architectures, query and document tokens interact at every transformer layer, but this full cross-attention prevents offline document indexing. ColBERT resolves this conflict through a profound architectural insight: delay the query-document interaction until the very final step of the retrieval pipeline, a principle formalized as Late Interaction.",
    "Under the ColBERT late interaction paradigm, the query and document are encoded by separate, decoupled transformer towers, exactly like a Bi-Encoder. However, instead of passing the contextualized hidden states through a mean pooling or classification token reduction layer, ColBERT retains a distinct vector representation for every single token in the input text. If a document contains two hundred tokens, ColBERT outputs two hundred individual vectors, preserving the complete contextualized token sequence.",
    "Crucially, because the document encoder operates independently of the query, all token vectors for every document in the corporate corpus can be pre-computed offline during background indexing jobs. The resulting token embeddings are stored in high-performance multi-vector indexes, eliminating runtime document forward passes entirely.",
    "At query execution time, the incoming user prompt passes through the query encoder in a single forward pass, producing a set of token vectors representing the query terms. The search engine then computes token-level similarity scores directly between the query token vectors and the pre-computed document token vectors using a lightweight, highly parallelizable mathematical operator known as MaxSim.",
    "A mechanical analogy illuminates this paradigm shift: rather than forcing two scholars to summarize their respective libraries into a single cryptic glyph before comparing notes, late interaction allows each scholar to bring a deck of cards containing key contextual phrases. When meeting in the reading room, each card from the inquiry deck is rapidly cross-referenced against all cards in the reference deck, pinpointing exact conceptual alignments in seconds.",
    "In high-dimensional representation geometry, preserving token-level embeddings preserves the geometric manifold of language. Each token vector resides in a contextual subspace that reflects its immediate syntax, grammatical role, and relational dependencies, allowing the retrieval engine to distinguish between different senses of polysemous words based on their contextual neighborhoods.",
    "Furthermore, late interaction completely eradicates the candidate recall bottleneck: because token-level interactions are evaluated directly over candidate documents during first-stage retrieval, subtle evidentiary clues that would be obliterated by vector pooling trigger strong, decisive similarity matches.",
    "A formal mathematical comparison between Bi-Encoder inner product scoring and late interaction highlights this expressiveness: while Bi-Encoders collapse document representations into a single vector d and evaluate a solitary scalar product s equals q dot d, ColBERT models the document as a matrix of contextualized token vectors and evaluates the full bipartite affinity graph between query and document terms, capturing multi-faceted semantic alignments.",
    "From an indexing throughput and scalability perspective, encoding millions of corporate documents with ColBERT scales strictly linearly with corpus length. Background indexing pipelines process raw text through batched forward passes on GPU worker fleets, emitting normalized token matrices that are serialized directly into disk-backed multi-vector indexes without requiring expensive iterative clustering at ingestion time.",
    "From a hardware engineering standpoint, ColBERT shifts the computational bottleneck from compute-heavy matrix multiplications across dozens of transformer layers to memory-bandwidth-friendly vector reductions across low-dimensional embeddings, aligning perfectly with the architectural strengths of modern GPU streaming multiprocessors.",
    "This elegant synthesis of decoupled offline encoding and granular online interaction establishes ColBERT as the premier multi-vector retrieval architecture, unlocking Cross-Encoder fidelity at sub-millisecond retrieval speeds."
]

part2_say = [
    "The mathematical heartbeat of ColBERT is the MaxSim operator, an elegant and expressive similarity formulation that quantifies the semantic relevance between a query and a document at token-level granularity. Given a query Q represented by a sequence of N contextualized vectors q_one through q_N, and a document D represented by a sequence of M contextualized vectors d_one through d_M, the ColBERT relevance score is defined as the sum of maximum cosine similarities across all query tokens.",
    "Formally, for each query token vector q_i, the MaxSim operator evaluates the inner product between q_i and every document token vector d_j across the entire document length M: inner product equals q_i dot d_j. The operator identifies the maximum scalar value across all M candidate document tokens: max score equals the maximum over all j of (q_i dot d_j). The overall document relevance score S(Q, D) is the summation of these maximum scores across all N query tokens: S(Q, D) equals the sum from i equals one to N of max_j (q_i dot d_j).",
    "Analyzing the mathematical properties of the MaxSim operator reveals why it achieves unmatched retrieval precision. First, the maximum operation acts as an automatic semantic soft-alignment mechanism: each query token independently searches the entire document to find the single document token that shares the closest contextual affinity, regardless of physical token position or sentence order.",
    "For example, if the query contains the term 'transformer', the MaxSim operator scans all two hundred document tokens, identifies the specific token in paragraph three that represents 'transformer' or 'attention mechanism', and records its high similarity score (such as zero point nine five). Document tokens that discuss unrelated concepts produce lower dot products and are ignored by the maximum operator.",
    "Second, the outer summation ensures that every query token contributes to the final relevance score. If a user submits a four-word query containing 'pediatric cardiac dosage guidelines', a relevant document must contain strong contextual matches for all four concepts. A document that mentions 'pediatric' and 'cardiac' fifty times but fails to mention 'dosage' will achieve lower total score than a document that concisely addresses all four query dimensions, penalizing partial topic coverage.",
    "Third, the MaxSim formulation naturally handles word order variations and syntactic paraphrases without degradation. Because query tokens align independently with their optimal document counterparts, active-to-passive voice transformations or clause inversions do not disturb the inner product alignments, allowing models to recognize semantic equivalence across complex syntactic structures.",
    "In contrast to full cross-attention—which computes an N-by-M attention matrix and multiplies it by Value projections across thirty-two layers—MaxSim evaluates a single N-by-M dot-product matrix at the output layer. For a query of ten tokens and a document of two hundred tokens, this requires only two thousand vector dot products, completing in microseconds on standard GPU tensor cores.",
    "During end-to-end model fine-tuning with cross-entropy or margin MSE loss, gradient backpropagation through the MaxSim operator behaves as a subgradient selection operator. Gradients flow exclusively through the winning token pairs that achieved the maximum similarity, reinforcing alignments for relevant factual pairs while dynamically suppressing non-matching background tokens.",
    "Rigorous empirical evaluations on the MS-MARCO passage ranking benchmark demonstrate the potency of MaxSim: ColBERT matches ninety-nine percent of the retrieval performance of a full BERT-large Cross-Encoder while executing more than one hundred times faster during online search.",
    "Furthermore, because token vectors are L2-normalized during embedding generation, the maximum dot product is mathematically bounded within the interval negative one to positive one, guaranteeing numerical stability and preventing individual high-magnitude dimensions from dominating the aggregate relevance score.",
    "In conclusion, the MaxSim operator provides an optimal mathematical balance: it delivers token-to-token semantic precision without the quadratic computational penalty of deep cross-attention, establishing the benchmark standard for multi-vector information retrieval."
]

part3_say = [
    "A profound and innovative capability of the ColBERT architecture is Query Augmentation through Mask Token Expansion. In real-world enterprise search, user queries are notoriously concise, incomplete, and ambiguous. If a search engine relies exclusively on the literal words provided by the user, it remains vulnerable to lexical mismatch when documents explain the target concept using technical synonyms or related contextual terms.",
    "Traditional retrieval systems addressed this through explicit query expansion, using thesauri or pseudo-relevance feedback to append synonymous keywords to the query string. However, discrete keyword expansion frequently introduces semantic drift: appending 'bank' to 'river' might inadvertently retrieve financial institutions if the expansion algorithm lacks contextual nuance.",
    "ColBERT resolves this limitation through continuous, soft query expansion implemented directly within the query encoder. During query tokenization, the query is prefixed with a special marker token [Q] to signal query encoding mode. If the input query is shorter than a predefined target length (typically thirty-two tokens), ColBERT pads the remaining positions with special [MASK] tokens from the BERT vocabulary.",
    "When the padded query sequence passes through the bidirectional query transformer encoder, the self-attention mechanism allows the literal query words to attend to and interact with the surrounding [MASK] tokens. Over twelve transformer layers, each [MASK] token absorbs contextual signals from the actual query words, transforming its uninitialized representation into a rich, specialized embedding vector that represents latent semantic concepts related to the query.",
    "For example, when the query 'transformer self-attention' is padded with mask tokens, the query encoder transforms the mask tokens into vectors that represent 'multi-head', 'key value projection', and 'quadratic complexity'. During downstream MaxSim evaluation, these augmented mask vectors actively search the document for relevant background concepts, retrieving passages that explain the underlying mechanics even if the literal words 'self-attention' appear sparsely.",
    "A geometric perspective illustrates this expansion: rather than evaluating the query as three isolated points in vector space, query augmentation generates a constellation of thirty-two coordinated vectors that span the entire semantic subspace surrounding the user's intent. This constellation captures the primary concepts, supporting technical terminology, and contextual prerequisites of the topic.",
    "Detailed inspection of attention maps across transformer layers reveals a clear functional division of labor: in early transformer layers (layers one through four), mask tokens extract local syntactic markers and grammatical structures; in intermediate and deep layers (layers eight through twelve), self-attention heads route abstract semantic associations into the mask representations, producing rich clusters of domain-specific technical terminology.",
    "Systems architects determined thirty-two tokens to be the optimal query padding budget through extensive empirical benchmarking. Sizing the query sequence to thirty-two tokens provides sufficient representational capacity to capture complex multifaceted information needs while maintaining a compact vector footprint that executes within sub-millisecond MaxSim latency limits.",
    "Empirical ablation studies confirm the decisive impact of mask expansion: disabling [MASK] token padding reduces ColBERT retrieval performance on technical datasets by over seven percentage points in MRR@10, proving that soft query augmentation is essential for resolving vocabulary mismatch.",
    "Crucially, query augmentation occurs entirely within the query encoder during the single online forward pass. The document index remains completely untouched, ensuring that soft expansion adds zero storage overhead to the corpus index while significantly expanding retrieval recall.",
    "In multi-lingual enterprise environments, mask expansion also bridges cross-lingual boundaries: query mask vectors learn to align with translated equivalents in multilingual corpora, allowing an English query to retrieve German or Japanese documentation seamlessly.",
    "From an information-theoretic viewpoint, mask token expansion functions as a differentiable associative memory lookup. By spreading the query's semantic energy across thirty-two coordinated vectors, the encoder minimizes the risk of single-token retrieval bottlenecks, ensuring that multi-faceted enterprise queries retrieve documents that satisfy both explicit requirements and implicit contextual dependencies.",
    "By harmonizing bidirectional self-attention with mask token expansion, ColBERT transforms sparse user prompts into rich multi-vector semantic constellations, dramatically improving factual recall across heterogeneous enterprise document collections."
]

part4_say = [
    "While preserving individual token vectors unlocks unprecedented retrieval fidelity, it introduces a severe physical storage challenge: Multi-Vector Index Bloat. In standard BERT-base representations, each token is represented by a hidden state of dimension seven hundred sixty-eight. In thirty-two-bit floating-point precision, storing seven hundred sixty-eight floats requires three thousand seventy-two bytes per token. For a moderate enterprise corpus containing ten million passages of two hundred tokens each, storing raw token embeddings would consume over six terabytes of memory.",
    "Hosting six terabytes of vector data in high-bandwidth GPU memory or fast system RAM is economically prohibitive for most enterprise organizations. To make multi-vector retrieval commercially viable, the architects of ColBERT engineered a highly effective Dimensionality Reduction and Linear Compression pipeline that slashes storage footprints while preserving representational fidelity.",
    "The primary compression mechanism is Linear Dimension Projection. Immediately following the final transformer layer of the query and document encoders, ColBERT introduces a trainable linear projection layer W_proj without bias. This projection layer maps the seven-hundred-sixty-eight-dimensional contextualized token embeddings down to a compact hidden dimension d_out, conventionally set to one hundred twenty-eight dimensions (or even ninety-six dimensions in ultra-compact models).",
    "Following the linear projection, every token vector is passed through an L2-normalization layer, constraining its Euclidean norm to exactly one point zero: v_normalized equals v divided by the Euclidean norm of v. This unit-sphere normalization ensures that vector inner products remain perfectly equivalent to cosine similarities, eliminating magnitude skew and stabilizing dot-product calculations.",
    "Projecting from seven hundred sixty-eight down to one hundred twenty-eight dimensions achieves an immediate six-fold compression in raw tensor volume. However, systems engineers wondered whether discarding eighty-three percent of the hidden dimensions would degrade retrieval accuracy. Extensive empirical ablations revealed a surprising result: reducing dimensionality to one hundred twenty-eight causes less than zero point five percent degradation in NDCG@10 compared to unprojected seven-hundred-sixty-eight-dimensional embeddings.",
    "To understand why dimensionality reduction preserves accuracy so effectively, systems architects must examine the intrinsic dimensionality of contextualized language representations. While transformer hidden states occupy seven hundred sixty-eight mathematical dimensions, the intrinsic manifold of natural language semantics is substantially lower-dimensional. The trainable projection matrix learns to capture the principal axes of semantic variance, discarding redundant activations and high-frequency noise.",
    "Singular Value Decomposition (SVD) of the token covariance matrix reveals that the leading one hundred twenty-eight principal components capture over ninety-four percent of total semantic energy across the corpus. The remaining six hundred forty dimensions consist predominantly of isotropic noise and redundant syntactic activations that contribute negligible discriminatory power to downstream retrieval.",
    "In high-throughput inference runtimes, these one-hundred-twenty-eight-dimensional vectors are further compressed using half-precision (bfloat16 or float16) representation, reducing the storage requirement from five hundred twelve bytes down to two hundred fifty-six bytes per token.",
    "Furthermore, ColBERT incorporates Punctuation and Stopword Pruning during document indexing. Tokens corresponding to common punctuation marks (such as commas, periods, and semicolons) or uninformative syntactic filler words are systematically stripped from the document index. Because punctuation tokens rarely contribute meaningful discriminatory signal during MaxSim evaluation, pruning them reduces index size by an additional fifteen to twenty percent with zero loss of retrieval accuracy.",
    "During corpus ingestion, passages are cleanly segmented into chunks of one hundred eighty to two hundred twenty tokens. Sizing document chunks to this length preserves local contextual coherence while guaranteeing that each document emits a bounded number of token vectors, preventing memory allocation spikes and enabling predictable index capacity planning.",
    "Combined, linear projection, half-precision encoding, and punctuation pruning shrink the physical memory footprint of a multi-vector index by over twelve-fold compared to naive representations, transforming multi-vector search into an accessible, production-ready technology.",
    "This elegant compression architecture proves that multi-vector retrieval does not require prohibitive hardware expenditure: through intelligent dimensionality reduction and token filtering, enterprises achieve Cross-Encoder accuracy within practical memory envelopes."
]

part5_say = [
    "Deploying the ColBERT late interaction architecture in high-throughput enterprise serving environments requires specialized GPU kernel engineering. In a production search engine processing thousands of concurrent user queries per second against millions of candidate documents, calculating millions of MaxSim reductions using naive PyTorch loops would trigger thousands of kernel launches, stalling GPU streaming multiprocessors and violating interactive latency service-level agreements.",
    "High-performance ColBERT serving runtimes eliminate this latency overhead through custom fused MaxSim CUDA and Triton kernels. A fused MaxSim kernel executes the entire matrix multiplication, maximum reduction, and outer summation within high-speed local GPU SRAM and register space, avoiding intermediate global memory round-trips entirely.",
    "To understand how a fused MaxSim kernel operates on modern GPU hardware, consider the execution of a query containing thirty-two tokens evaluated against a batch of candidate documents. The CUDA threadblock loads the query token vectors into fast shared memory (SRAM), where they remain permanently resident throughout the computation. For a query of thirty-two tokens in one hundred twenty-eight dimensions at half-precision, the entire query tile consumes only eight kilobytes of SRAM, leaving ample shared memory for threadblock synchronization and double-buffering.",
    "The threadblock then streams tiles of document token vectors directly from global GPU DRAM into local registers. Warp threads execute vectorized half-precision dot products (using half2 or bfloat162 instructions), evaluating the inner product between each query token and the incoming document tokens simultaneously. As each dot product is computed, the thread updates a local register holding the running maximum score for that specific query token, utilizing fast hardware register shuffle primitives (__shfl_down_sync) to synchronize maxima across the warp.",
    "Once all document tokens have streamed through registers, the final step computes the outer summation: the threadblock sums the running maximums across all thirty-two query tokens, emitting a single scalar relevance score for each candidate document directly into the output buffer. By fusing dot products, maximum tracking, and summation into a single execution pass, memory bandwidth utilization reaches over ninety percent of theoretical peak throughput.",
    "In distributed serving clusters, ColBERT late interaction scales across multi-GPU architectures using data-parallel sharding: the multi-vector index is partitioned evenly across GPU worker nodes, where each node evaluates fused MaxSim scores over its local candidate partition in parallel. A lightweight root aggregator collects the top candidate scores via high-speed NVLink or InfiniBand interconnects and executes a fast heap merge in under one millisecond.",
    "Hardware profiling on NVIDIA A100 and H100 accelerators demonstrates that fused MaxSim kernels process tens of thousands of document comparisons per millisecond, delivering a hundred-fold acceleration over naive framework implementations and easily satisfying the sub-ten-millisecond latency guarantees required by Tier-1 enterprise search platforms.",
    "Furthermore, production runtimes deploy dynamic batching and candidate pruning at the kernel level: candidate documents whose preliminary MaxSim scores fall below an adaptive early-exit threshold are immediately evicted from the threadblock queue, freeing GPU execution units for high-relevance documents.",
    "Continuous integration suites validate kernel correctness by comparing fused GPU outputs against double-precision reference implementations, verifying that register optimizations introduce zero numerical divergence across millions of test queries.",
    "In enterprise cloud environments, serving runtimes incorporate automated kernel tuning harnesses that evaluate threadblock dimensions (such as thirty-two, sixty-four, or one hundred twenty-eight threads per block) across heterogeneous GPU generations from NVIDIA Ampere to Hopper. This dynamic auto-tuning maximizes streaming multiprocessor occupancy, ensuring deterministic latency SLAs regardless of underlying cloud hardware allocations.",
    "Furthermore, integrated telemetry daemons monitor GPU kernel launch latencies, register spill rates, and memory bus utilization in real time, exposing granular Prometheus metrics that alert platform reliability engineers to localized thermal throttling or workload skew before service degradation impacts end users.",
    "In conclusion, the combination of token-level late interaction, MaxSim semantic alignment, and high-performance fused GPU kernels establishes ColBERT as the gold standard for enterprise neural search, bridging the chasm between Bi-Encoder velocity and Cross-Encoder precision."
]

code1 = """function simulateColBertMaxSim(queryTokens: string[], docTokens: string[]) {
  // Simplified token embedding dot-product interaction matrix
  const matrix: number[][] = [
    [0.92, 0.45, 0.12, 0.38], // 'transformer' vs doc tokens
    [0.31, 0.88, 0.22, 0.41], // 'attention' vs doc tokens
    [0.15, 0.29, 0.95, 0.18]  // 'mechanism' vs doc tokens
  ];

  const maxSimScores: { queryToken: string; maxScore: number; matchedToken: string }[] = [];
  let totalScore = 0;

  for (let q = 0; q < queryTokens.length; q++) {
    let maxVal = -Infinity;
    let bestMatchIdx = 0;
    for (let d = 0; d < docTokens.length; d++) {
      if (matrix[q][d] > maxVal) {
        maxVal = matrix[q][d];
        bestMatchIdx = d;
      }
    }
    maxSimScores.push({
      queryToken: queryTokens[q],
      maxScore: maxVal,
      matchedToken: docTokens[bestMatchIdx]
    });
    totalScore += maxVal;
  }

  return {
    queryLength: queryTokens.length,
    documentLength: docTokens.length,
    maxSimInteractions: maxSimScores,
    colBertScore: Number(totalScore.toFixed(3)),
    fidelity: "Token-level granular late interaction preserved"
  };
}
console.log(simulateColBertMaxSim(["transformer", "attention", "mechanism"], ["deep", "attention", "transformer", "network"]));"""

output1 = """{
  queryLength: 3,
  documentLength: 4,
  maxSimInteractions: [
    { queryToken: 'transformer', maxScore: 0.92, matchedToken: 'deep' },
    {
      queryToken: 'attention',
      maxScore: 0.88,
      matchedToken: 'attention'
    },
    {
      queryToken: 'mechanism',
      maxScore: 0.95,
      matchedToken: 'transformer'
    }
  ],
  colBertScore: 2.75,
  fidelity: 'Token-level granular late interaction preserved'
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
assert total_words >= 3100, f"Day 42 total word count too low: {total_words}"

day42_dict = {
    "day": 42,
    "title": "ColBERT Late Interaction Architecture: Token-Level Embeddings, MaxSim Operator & Pruning",
    "goal": "Master the ColBERT late interaction paradigm, dissect the mathematical formulation of the MaxSim operator, analyze query mask augmentation, and evaluate linear dimensionality reduction and fused GPU kernel acceleration.",
    "minutes": 38,
    "recap": "Yesterday we exposed the severe information bottleneck of pooled Bi-Encoders. Today we engineer the revolutionary ColBERT architecture, which preserves token-level embeddings and leverages the MaxSim operator for high-precision retrieval.",
    "parts": [
        {
            "title": "The Token-Level Late Interaction Paradigm",
            "say": part1_say,
            "example": "Scholars cross-referencing decks of contextual phrase cards rather than reading compressed summary cards.",
            "code": code1,
            "output": output1,
            "tryIt": "Evaluate token interaction matrix dimensions and inspect decoupled encoding advantages.",
            "check": {
                "question": "How does ColBERT's late interaction paradigm fundamentally differ from traditional Bi-Encoders and Cross-Encoders?",
                "options": [
                    "It decouples query and document encoding for offline indexing like a Bi-Encoder, but preserves token-level vectors and computes interaction via MaxSim at query time.",
                    "It computes full cross-attention across all thirty-two transformer layers before storing vectors in a relational database.",
                    "It pools all document token vectors into a single scalar value and executes pure lexical string matching.",
                    "It replaces all neural network layers with static BM25 keyword frequency lookup tables."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "ColBERT preserves token-level embeddings through decoupled encoding towers, pre-computing document vectors offline while evaluating granular token-to-token similarity at query time via MaxSim."
            }
        },
        {
            "title": "The MaxSim Operator & Sum-of-Max Similarity Formulation",
            "say": part2_say,
            "example": "A student scanning an entire textbook chapter to find the single best matching sentence for each homework question.",
            "code": code1,
            "output": output1,
            "tryIt": "Compute the sum-of-max similarity score across query tokens and identify aligned document words.",
            "check": {
                "question": "What is the mathematical formulation and operational behavior of the ColBERT MaxSim operator?",
                "options": [
                    "For each query token vector, it finds the maximum inner product across all document token vectors, and sums these maximums across the query.",
                    "It multiplies all query and document vectors together into a single scalar product and takes the square root.",
                    "It computes the average cosine similarity between the first query token and the last document token.",
                    "It sorts document tokens alphabetically and selects the token with the highest ASCII value."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "MaxSim evaluates the inner product between each query token and all document tokens, identifies the maximum match per query term, and sums these maximum scores to determine document relevance."
            }
        },
        {
            "title": "Query Augmentation & Mask Token Expansion",
            "say": part3_say,
            "example": "A search engine expanding a brief query with related technical terms to catch synonymous concepts.",
            "code": code1,
            "output": output1,
            "tryIt": "Observe how padding query sequences with mask tokens enables soft query expansion in embedding space.",
            "check": {
                "question": "How does ColBERT utilize special [MASK] tokens during query encoding to achieve soft query expansion?",
                "options": [
                    "Padded mask tokens interact with query words via bidirectional self-attention, generating vectors that search for latent synonymous concepts.",
                    "Mask tokens erase thirty percent of the query to prevent user privacy leakage during search.",
                    "Mask tokens convert the query into an encrypted hash string that cannot be intercepted on public networks.",
                    "Mask tokens permanently remove punctuation and numbers from the document index."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Through bidirectional self-attention across transformer layers, padded [MASK] tokens absorb contextual signals from the query, emitting specialized vectors that search for latent related terms."
            }
        },
        {
            "title": "Token Vector Dimensionality Reduction & Linear Compression",
            "say": part4_say,
            "example": "An audio engineer compressing multi-track studio recordings into compact stereo master files without perceptible loss.",
            "code": code1,
            "output": output1,
            "tryIt": "Calculate the storage savings of projecting 768-dimensional token vectors down to 128 dimensions.",
            "check": {
                "question": "Why can ColBERT project 768-dimensional contextualized token embeddings down to 128 dimensions with less than 0.5% loss in retrieval accuracy?",
                "options": [
                    "The intrinsic semantic manifold of natural language is lower-dimensional, allowing linear projection to discard redundant activations and noise.",
                    "Modern GPUs are incapable of processing vectors with more than one hundred twenty-eight dimensions.",
                    "Dimensionality reduction forces the model to use integer arithmetic instead of floating-point numbers.",
                    "BERT-base models only use the first sixty-four dimensions of their hidden state during self-attention."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "The intrinsic dimensionality of contextualized language representations is far lower than 768; a trained linear projection captures the principal semantic variance while slashing index storage by 6x."
            }
        },
        {
            "title": "GPU Acceleration of Late Interaction Kernels",
            "say": part5_say,
            "example": "A modern graphics card rendering thousands of textured polygons in parallel on dedicated silicon cores.",
            "code": code1,
            "output": output1,
            "tryIt": "Simulate fused MaxSim reductions and observe warp-level register synchronization.",
            "check": {
                "question": "How do custom fused MaxSim CUDA kernels achieve over 90% peak memory bandwidth utilization during multi-vector search?",
                "options": [
                    "By keeping query vectors resident in high-speed SRAM, streaming document tiles through registers, and fusing dot products with reduction.",
                    "By writing intermediate dot-product matrices to disk before computing maximum values.",
                    "By evaluating all mathematical operations on the host CPU using standard Python loops.",
                    "By disabling GPU error-correcting memory to allow overclocked floating-point arithmetic."
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Fused MaxSim kernels hold query tokens in fast SRAM, stream document vector tiles through registers, and fuse dot-product calculations with maximum tracking, eliminating DRAM round-trips."
            }
        }
    ],
    "summary": [
        "ColBERT introduces Contextualized Late Interaction over BERT, decoupling query and document encoding into independent towers while preserving fine-grained token-level vectors for granular query-time scoring.",
        "The MaxSim operator computes the relevance score by identifying the maximum inner product match for each query token across all document tokens and summing these maximums, achieving soft semantic alignment.",
        "Query Augmentation leverages [MASK] token padding and bidirectional self-attention to generate specialized contextual vectors that search for latent synonymous concepts without index modification.",
        "Linear dimension projection maps 768-dimensional hidden states down to compact 128-dimensional unit-norm vectors, slaving index storage by 6x with less than 0.5% loss in retrieval precision.",
        "Punctuation and stopword pruning strip non-informative syntactic tokens from document representations, achieving an additional 20% index compression with zero retrieval degradation.",
        "Custom fused MaxSim CUDA and Triton kernels hold query tokens in SRAM, stream document vectors through registers, and fuse inner products with reductions, executing 100x faster than Cross-Encoders."
    ],
    "projectStep": {
        "title": "ColBERT Multi-Vector Late Interaction Engine Simulator",
        "steps": [
            "Construct a token-level late interaction scoring engine implementing the MaxSim operator over synthetic multi-vector embeddings.",
            "Implement a query augmentation simulator demonstrating [MASK] token expansion and contextual concept enrichment.",
            "Benchmark retrieval throughput comparing naive PyTorch MaxSim reductions against vectorized fused GPU kernel executions."
        ]
    }
}

captions_data = [
    {
        "say1": "Late interaction decouples encoding while preserving token vectors.",
        "say2": "Decoupled offline encoding enables sub millisecond multi vector search.",
        "example": "Scholars cross reference decks of phrase cards during research sessions.",
        "tryIt": "Evaluate token interaction matrices and inspect decoupled advantages."
    },
    {
        "say1": "MaxSim operator evaluates token to token inner product similarity scores.",
        "say2": "Maximum reduction identifies optimal semantic alignment across sequences.",
        "example": "Students scan textbook chapters to find matching answers for assignments.",
        "tryIt": "Compute sum of max similarity scores across query and document tokens."
    },
    {
        "say1": "Query augmentation pads sequences with special mask token representations.",
        "say2": "Discrete keyword expansion causes semantic drift and contextual errors.",
        "example": "Search engines expand brief queries with related technical concepts.",
        "tryIt": "Observe how padding query sequences with mask tokens enables expansion."
    },
    {
        "say1": "Linear projection maps hidden states down to compact vector dimensions.",
        "say2": "Dimensionality reduction and compression slash vector storage footprints.",
        "example": "Audio engineers compress multi track recordings into compact master tracks.",
        "tryIt": "Calculate storage savings of projecting token vectors down to dimensions."
    },
    {
        "say1": "Fused MaxSim kernels hold query tokens in high speed shared memory.",
        "say2": "Warp level register shuffles synchronize running maximums in registers.",
        "example": "Modern graphics cards render textured polygons in parallel on silicon.",
        "tryIt": "Simulate fused MaxSim reductions and observe warp level synchronization."
    }
]

titles = [
    "Token Level Late Interaction Architecture and Decoupled Processing.",
    "MaxSim Mathematical Formulation and Semantic Alignment Operator.",
    "Query Augmentation Architecture and Mask Token Expansion Pipeline.",
    "Linear Dimension Projection and Multi Vector Index Compression.",
    "Fused MaxSim GPU Kernel Acceleration and Register Level Reductions."
]

columns_list = [
    ["Encoder Layer Component", "Output Representation Type", "Offline Ingestion Capability"],
    ["Query Token Vector", "Maximum Matching Document Token", "Inner Product Alignment Score"],
    ["Query Token Position", "Contextualized Semantic Concept", "Latent Retrieval Role"],
    ["Compression Technique", "Dimensionality Reduction Ratio", "Information Loss Margin"],
    ["GPU Memory Hierarchy", "Kernel Execution Pathway", "Throughput Acceleration Factor"]
]

steps_rows = [
    [
        [["Query Transformer Tower", "Thirty Two Token Vectors", "Real Time Inference Stream"], ["Document Transformer Tower", "Two Hundred Token Vectors", "Offline Batch Indexing"]],
        [["Shared Multi Vector Space", "One Hundred Twenty Eight Floats", "Unit Norm L Two Constrained"], ["Multi Vector Storage Index", "Token Level Inverted Lists", "Sub Millisecond Multi Search"]],
        [["Inquiry Phrase Deck", "Contextual Flash Cards", "Targeted Investigation Clues"], ["Reference Library Deck", "Exhaustive Subject Cards", "Comprehensive Corpus Archive"]],
        [["Late Interaction Scoring", "Token To Token MaxSim", "Cross Encoder Matching Quality"], ["Decoupled Search Speed", "Single Query Forward Pass", "High Concurrency Serving Ready"]]
    ],
    [
        [["First Query Token Vector", "Deep Learning Architectures", "Zero Point Nine Two Score"], ["Second Query Token Vector", "Attention Mechanism Layers", "Zero Point Eight Eight Score"]],
        [["Third Query Token Vector", "Transformer Self Attention", "Zero Point Nine Five Score"], ["Aggregate ColBERT Score", "Sum Of Maximum Inner Products", "Two Point Seven Five Overall"]],
        [["Homework Question Term", "Exhaustive Chapter Search", "Best Matching Text Sentence"], ["Textbook Chapter Body", "Dozens Of Topic Paragraphs", "Comprehensive Context Base"]],
        [["Semantic Soft Alignment", "Automatic Token Pairing", "Exact Keyword And Synonym Match"], ["Positional Invariance", "Arbitrary Clause Placement", "Zero Syntactic Penalty"]]
    ],
    [
        [["Literal Query Term Token", "Transformer Self Attention", "Core User Search Intent"], ["First Padded Mask Token", "Multi Head Key Value Projections", "Latent Topic Expansion"]],
        [["Second Padded Mask Token", "Quadratic Computational Complexity", "Prerequisite Context Retrieval"], ["Third Padded Mask Token", "Softmax Probability Normalization", "Supporting Technical Depth"]],
        [["Initial Brief Search Query", "Three Word Prompt Fragment", "Sparse User Information Need"], ["Expanded Semantic Cloud", "Thirty Two Coordinated Vectors", "Comprehensive Search Field"]],
        [["Soft Vector Augmentation", "Continuous Embedding Space", "Zero Index Storage Penalty"], ["Cross Lingual Alignment", "Multilingual Semantic Bridges", "Seamless Polyglot Search"]]
    ],
    [
        [["Linear Dimension Projection", "Six Fold Volume Compression", "Zero Point Five Percent Loss"], ["Unit Norm L Two Scaling", "One Hundred Twenty Eight Floats", "Zero Magnitude Variance Skew"]],
        [["Half Precision Encoding", "Two Byte Float Sixteen", "Two Fold Additional Savings"], ["Punctuation Token Pruning", "Common Delimiter Removal", "Twenty Percent Index Shrink"]],
        [["Multi Track Studio Master", "Dozens Of Raw Audio Stems", "Massive Raw Storage Footprint"], ["Compact Stereo Master Track", "High Fidelity Two Channel Mix", "Flawless Acoustic Fidelity"]],
        [["Total Storage Optimization", "Twelve Fold Index Compression", "Commodity RAM Compatibility"], ["Production Multi Vector", "Millions Of Indexed Passages", "Enterprise Hardware Viable"]]
    ],
    [
        [["GPU Shared Memory SRAM", "Query Token Permanent Residency", "Zero Global Memory Latency"], ["GPU Register File Storage", "Warp Level Running Maxima", "Single Cycle Update Speed"]],
        [["Global GPU Memory DRAM", "Tiled Document Vector Streaming", "Coalesced Memory Bus Access"], ["Fused MaxSim CUDA Kernel", "Combined GEMM And Reduction", "One Hundred Fold Speedup"]],
        [["Silicon Hardware Architecture", "Thousands Of Streaming Multiprocessors", "Massive Thread Parallelism"], ["Dedicated Graphics Engine", "Parallel Triangle Rasterization", "Silky Smooth Rendering"]],
        [["Candidate Early Exit", "Adaptive Threshold Eviction", "Sub Ten Millisecond Search"], ["Distributed Query Routing", "Disaggregated Worker Nodes", "Enterprise Production Certified"]]
    ]
]

entries = []
for p_idx, part in enumerate(day42_dict['parts']):
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
    assert len(spec["title"]) <= 75, f"Part {p_idx+1} title too long: {len(spec['title'])}"
    assert spec["title"].endswith('.'), f"Part {p_idx+1} title must end with period"
    assert not any(c.isdigit() for c in spec["title"]), f"Part {p_idx+1} title contains digits"
    
    entries.append({
        "partTitle": part["title"],
        "codeHash": code_hash,
        "spec": spec,
        "filled": spec
    })

visual_envelope = {
    "schemaVersion": "2.0.0",
    "prefix": "ai",
    "day": 42,
    "entries": entries
}

# Write lesson JSON
with open("scripts/branch_c/day42_lesson.json", "w", encoding="utf-8") as f:
    json.dump(day42_dict, f, indent=2)

# Write visual envelope
with open("src/lib/data/lessonVisuals/ai/day-42.json", "w", encoding="utf-8") as f:
    json.dump(visual_envelope, f, indent=2)

print(f"Generated Day 42 lesson JSON ({total_words} words) and Visual Envelope successfully!")
