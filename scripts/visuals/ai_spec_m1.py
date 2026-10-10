# scripts/visuals/ai_spec_m1.py
# Course 12: AI Engineering & LLM Integration (course-ai-eng)
# Month 1: Days 1-15 (Blocks 1-3) - 60 Quests Total

AI_M1_PART1 = [
  # =========================================================================
  # BLOCK 1: TRANSFORMER ARCHITECTURE & ATTENTION PHYSICS (Days 1-5)
  # =========================================================================
  {
    "day": 1,
    "month": 1,
    "blockNum": 1,
    "title": "Tokenization Mechanics: Byte-Pair Encoding (BPE), WordPiece & Context Window Geometry",
    "stageName": "Stage 1: Mental Model Grounding",
    "stageNum": 1,
    "pedagogicalRole": "Foundational Intuition (Tokenization & Vocabularies)",
    "spokenGoal": "Deconstruct how language models ingest text: examine Byte-Pair Encoding (BPE) and SentencePiece, understand how subword merging transforms raw UTF-8 byte streams into discrete token IDs, calculate tokenizer fertility across natural languages and code, and analyze why token boundaries directly govern prompt efficiency, regex parsing, and mathematical reasoning failures.",
    "conceptInvariant": "Subword Compression Invariant: Tokenization is an irreversible statistical compression step where semantic meaning is mapped to integer vocabularies; models never perceive raw characters or whitespace directly, and leading whitespaces or trailing spaces generate distinct token IDs that alter attention distributions.",
    "failureMode": "Designing a prompt template with trailing whitespace before few-shot examples or variable interpolations, resulting in split multi-token IDs (e.g., ' 123' vs ' ' + '123') that degrade downstream classification accuracy by 28% due to out-of-distribution token transitions.",
    "tryItFriction": "Write a pure TypeScript Byte-Pair Encoding (BPE) tokenizer that takes a training corpus, iteratively counts character pair frequencies, merges the most frequent bigram into a single subword token, and encodes arbitrary text into an array of vocabulary IDs.",
    "socraticHints": [
      "Why does an LLM struggle to count the number of letters 'r' in the word 'strawberry'?",
      "Because the tokenizer compresses 'strawberry' into subword chunks like ['straw', 'berry'], hiding individual character boundaries from the self-attention heads!",
      "To inspect token boundaries, feed the text through the tokenizer vocabulary map and inspect the individual decoded string slices."
    ],
    "situationalPuzzle": {
      "scenario": "A production prompt injection filter strips the word 'DELETE' from incoming user inputs using a naive regex. However, an attacker submits inputs that bypass the filter while still triggering malicious database actions in the downstream LLM agent. What tokenization quirk explains this vulnerability?",
      "options": [
        "The LLM ignored the prompt because of temperature settings.",
        "Token Splitting Bypass: The attacker injected zero-width spaces or Unicode byte mutations (e.g., Cyrillic homoglyphs or multi-byte UTF-8 fragments) that evade the regex string match but are normalized or tokenized into equivalent semantic subwords by the BPE tokenizer.",
        "The model's context window was exceeded.",
        "Byte-Pair Encoding only supports ASCII characters."
      ],
      "answerIdx": 1,
      "debrief": "String-based regex filters inspect raw characters, whereas LLMs operate on token embeddings. Attackers exploit Unicode normalization differences, zero-width characters, or homoglyphs that fail regex matches but produce identical or near-identical subword tokens during BPE processing."
    },
    "quests": [
      {
        "id": "ai-m1-d01-q1",
        "name": "BPE Merge Table Constructor",
        "type": "concept",
        "desc": "Implement frequency counting over character pairs and construct a 500-token BPE merge table from sample corpus."
      },
      {
        "id": "ai-m1-d01-q2",
        "name": "Tokenizer Fertility & Cost Analyzer",
        "type": "detective",
        "desc": "Calculate token-to-word compression ratios across multilingual scripts and measure API cost disparities."
      },
      {
        "id": "ai-m1-d01-q3",
        "name": "Subword Token Boundary Visualizer",
        "type": "mastery",
        "desc": "Build an interactive CLI tool that highlights token chunks in alternating colors and surfaces whitespace anomalies."
      },
      {
        "id": "ai-m1-d01-q4",
        "name": "3 AM SRE: Trailing Space Classification Outage",
        "type": "incident",
        "desc": "Diagnose an outage where subtle formatting changes introduced trailing spaces, breaking production classification."
      }
    ]
  },
  {
    "day": 2,
    "month": 1,
    "blockNum": 1,
    "title": "Scaled Dot-Product Self-Attention: Query-Key-Value Physics & Quadratic Complexity",
    "stageName": "Stage 1: Mental Model Grounding",
    "stageNum": 1,
    "pedagogicalRole": "Mechanistic Core (Attention Physics & Linear Algebra)",
    "spokenGoal": "Demystify the mathematical engine of the Transformer: walk through Query, Key, and Value linear projections, calculate Scaled Dot-Product Attention Softmax((Q * K^T) / sqrt(d_k)) * V, understand why scaling by sqrt(d_k) prevents vanishing gradients, and analyze the O(N^2) memory and compute bottleneck of full dense self-attention.",
    "conceptInvariant": "Attention Normalization Invariant: Dot products of high-dimensional queries and keys grow with dimension d_k; scaling by 1/sqrt(d_k) preserves unit variance across logits prior to Softmax, preventing extreme activation peaks that collapse attention entropy to one-hot distributions.",
    "failureMode": "Omitting the 1/sqrt(d_k) scaling factor in a custom attention implementation, causing dot product logits to explode to values > 100, which drives Softmax outputs to zero everywhere except one position, freezing backpropagation gradients and causing NaN loss spikes.",
    "tryItFriction": "Implement scaled dot-product attention in TypeScript using 2D matrix math: project input embedding vectors into Q, K, and V matrices, compute dot products, apply scale and causal mask, compute Softmax row-wise, and multiply by Value vectors.",
    "socraticHints": [
      "What happens to the variance of the dot product of two independent random vectors of dimension d_k?",
      "The variance equals d_k! When d_k is large (e.g., 128), dot products have standard deviation 11.3, pushing Softmax inputs into saturated regions with near-zero gradients.",
      "Divide the raw dot product matrix by Math.sqrt(d_k) before calling softmax."
    ],
    "situationalPuzzle": {
      "scenario": "A development team attempts to increase the context window of a Transformer model from 4,096 tokens to 32,768 tokens for document analysis. However, their GPU server immediately crashes with an Out-Of-Memory (OOM) error during the forward pass, even with a batch size of 1. What physical law was triggered?",
      "options": [
        "The model weights expanded by 8x.",
        "Quadratic Attention Memory Explosion: Full self-attention computes an N x N attention matrix. Increasing N from 4k to 32k increases the attention score matrix memory by (32,768 / 4,096)^2 = 64x, exceeding available high-bandwidth GPU SRAM and VRAM.",
        "The embedding table ran out of dimensions.",
        "PyTorch does not support context lengths over 8k."
      ],
      "answerIdx": 1,
      "debrief": "Full self-attention materializes an N x N attention matrix per head per layer. An 8x increase in sequence length yields a 64x increase in intermediate activation memory for the attention matrix, necessitating FlashAttention or sparse attention kernels."
    },
    "quests": [
      {
        "id": "ai-m1-d02-q1",
        "name": "Scaled Dot-Product Attention Engine",
        "type": "concept",
        "desc": "Implement scaled dot-product attention with causal triangular masking and numerical Softmax stability."
      },
      {
        "id": "ai-m1-d02-q2",
        "name": "Attention Score Heatmap Generator",
        "type": "detective",
        "desc": "Extract and visualize attention weights across multi-head projections to verify syntactic dependency focus."
      },
      {
        "id": "ai-m1-d02-q3",
        "name": "FlashAttention IO-Aware Memory Simulator",
        "type": "mastery",
        "desc": "Simulate tiling and online Softmax scaling to compute attention in SRAM blocks without materializing the N x N matrix."
      },
      {
        "id": "ai-m1-d02-q4",
        "name": "3 AM SRE: Exploding Logit Gradient Outage",
        "type": "incident",
        "desc": "Debug a production fine-tuning run that collapsed into NaN loss after omitting the sqrt(d_k) normalization divisor."
      }
    ]
  },
  {
    "day": 3,
    "month": 1,
    "blockNum": 1,
    "title": "KV-Cache Mechanics, Memory Bandwidth Bottlenecks & Autoregressive Decoding",
    "stageName": "Stage 1: Mental Model Grounding",
    "stageNum": 1,
    "pedagogicalRole": "Performance Engineering (KV Cache & Memory Physics)",
    "spokenGoal": "Analyze autoregressive token generation: understand why prefill is compute-bound while token generation is memory-bandwidth bound, calculate the exact VRAM footprint of Key-Value (KV) caching across layers and batch sizes, and contrast Multi-Head Attention (MHA), Multi-Query Attention (MQA), and Grouped-Query Attention (GQA).",
    "conceptInvariant": "KV-Cache Retention Invariant: During autoregressive generation, prior token keys and values never change; recomputing them for every generated token wastes O(N^2) compute, requiring persistent KV caches in GPU memory where memory bandwidth, not FLOPS, bounds generation throughput.",
    "failureMode": "Deploying an LLM inference service with Multi-Head Attention without memory allocation bounds, causing high concurrency to exhaust GPU VRAM due to linear KV cache expansion (2 * layers * heads * d_head * seq_len * batch_size * bytes_per_elem), triggering kernel panics.",
    "tryItFriction": "Build an in-memory KV-cache simulator in TypeScript that allocates Key and Value ring buffers per layer, stores projected vectors during prefill, and appends single new token keys and values during autoregressive decoding steps.",
    "socraticHints": [
      "Why does generating token 100 take longer if you don't save the Key and Value vectors of tokens 1 to 99?",
      "Because without a KV cache, you must run forward passes on all 99 prior tokens again just to compute the attention weights for token 100!",
      "Cache the K and V tensors in memory and only pass the latest single token query vector through attention."
    ],
    "situationalPuzzle": {
      "scenario": "A 70B parameter model uses 80 layers, 64 attention heads, and a head dimension of 128 with 16-bit floating point precision. With 100 concurrent users generating 4,096 tokens, how much VRAM is consumed purely by the KV cache using standard Multi-Head Attention?",
      "options": [
        "Around 1.2 GB of VRAM.",
        "KV Cache VRAM Calculation: Footprint = 2 (K & V) * 80 layers * 64 heads * 128 dim * 4,096 tokens * 2 bytes * 100 users = 1.07 Terabytes of VRAM! This exceeds multiple GPU nodes, explaining why modern models switch to Grouped-Query Attention (GQA).",
        "Around 140 GB of VRAM.",
        "KV Cache uses negligible memory compared to weights."
      ],
      "answerIdx": 1,
      "debrief": "With MHA, every head stores its own K and V vectors. For 100 concurrent streams at 4k context, 1.07 TB of KV cache is required. Grouped-Query Attention (GQA) shares key-value heads across query head groups (e.g., 8 KV heads for 64 query heads), slashing KV memory by 8x."
    },
    "quests": [
      {
        "id": "ai-m1-d03-q1",
        "name": "KV-Cache VRAM Dimensioning Formula",
        "type": "concept",
        "desc": "Derive the mathematical formula for KV cache memory footprint across MHA, MQA, and GQA architectures."
      },
      {
        "id": "ai-m1-d03-q2",
        "name": "Memory Bandwidth Bound Profiler",
        "type": "detective",
        "desc": "Profile GPU memory bandwidth utilization during prefill versus autoregressive decode phases."
      },
      {
        "id": "ai-m1-d03-q3",
        "name": "GQA Multi-Head KV-Cache Allocator",
        "type": "mastery",
        "desc": "Implement an efficient grouped-query attention KV-cache manager with static memory pre-allocation."
      },
      {
        "id": "ai-m1-d03-q4",
        "name": "3 AM SRE: Concurrent KV-Cache OOM Cluster Crash",
        "type": "incident",
        "desc": "Mitigate a production serving outage caused by unexpected concurrent long-context requests exhausting GPU memory."
      }
    ]
  },
  {
    "day": 4,
    "month": 1,
    "blockNum": 1,
    "title": "Positional Encodings: Sinusoidal, Rotary Position Embeddings (RoPE) & Context Extrapolation",
    "stageName": "Stage 1: Mental Model Grounding",
    "stageNum": 1,
    "pedagogicalRole": "Architectural Mechanism (Spatial Attention & Extrapolation)",
    "spokenGoal": "Deconstruct how Transformers encode sequence order: evaluate absolute Sinusoidal embeddings, contrast them with relative positional encodings, analyze the mathematics of Rotary Position Embeddings (RoPE), explore complex vector rotation in 2D subspaces, and master frequency scaling techniques (YaRN, NTK-aware) for context window extension.",
    "conceptInvariant": "Relative Rotation Invariant: RoPE multiplies Query and Key vectors by orthogonal rotation matrices such that their dot product depends strictly on the relative distance (m - n) between token positions, rather than their absolute index coordinates.",
    "failureMode": "Fine-tuning a model on 8k context lengths using naive linear position interpolation without adjusting high-frequency RoPE components, causing catastrophic degradation of code syntax parsing and curly brace matching.",
    "tryItFriction": "Implement Rotary Position Embeddings (RoPE) in TypeScript: pair vector dimensions into 2D chunks, calculate frequency angles theta_i = base^(-2(i-1)/d), apply the 2D rotation matrix [[cos, -sin], [sin, cos]], and demonstrate that the dot product preserves relative distance.",
    "socraticHints": [
      "Why did early Transformer models with absolute positional encodings fail when given texts longer than their training length?",
      "Because the model had never seen positional vectors for index 2,049 and above, so query-key dot products became completely out-of-distribution garbage!",
      "RoPE uses rotation angles based on relative distance (m - n), enabling mathematical scaling and extrapolation."
    ],
    "situationalPuzzle": {
      "scenario": "An AI team extends a 4k context model to 32k context using NTK-Aware RoPE scaling. Why does NTK-aware scaling outperform naive linear interpolation (Position Interpolation / PI)?",
      "options": [
        "NTK scaling increases the number of attention heads.",
        "Non-Uniform Frequency Preservation: Naive linear interpolation compresses all positional frequencies equally, destroying high-frequency local ordering. NTK scaling scales low frequencies (long-range context) while leaving high frequencies (immediate neighboring token syntax) largely untouched.",
        "NTK scaling eliminates the need for attention masks.",
        "Linear interpolation requires double precision floating point."
      ],
      "answerIdx": 1,
      "debrief": "Local token order (syntax, grammar, punctuation) relies on high-frequency components of RoPE. Compressing them linearly blurs immediate neighbor relationships. NTK-aware scaling preserves high frequencies for local precision while stretching low frequencies to accommodate long-range documents."
    },
    "quests": [
      {
        "id": "ai-m1-d04-q1",
        "name": "RoPE 2D Rotation Subspace Math",
        "type": "concept",
        "desc": "Derive the mathematical proof showing why RoPE dot product Q_m * K_n^T depends solely on relative offset (m - n)."
      },
      {
        "id": "ai-m1-d04-q2",
        "name": "Attention Distance Degradation Probe",
        "type": "detective",
        "desc": "Measure how attention scores decay across token distance under vanilla Sinusoidal vs RoPE encodings."
      },
      {
        "id": "ai-m1-d04-q3",
        "name": "NTK-Aware Dynamic RoPE Scaler",
        "type": "mastery",
        "desc": "Implement an NTK-aware RoPE scaling module in TypeScript that dynamically extends context limits."
      },
      {
        "id": "ai-m1-d04-q4",
        "name": "3 AM SRE: Corrupted Syntax Long-Context Outage",
        "type": "incident",
        "desc": "Root cause an outage where a naive position scaling deployment destroyed the model's ability to balance JSON brackets."
      }
    ]
  },
  {
    "day": 5,
    "month": 1,
    "blockNum": 1,
    "title": "Milestone 1: Minimalist Transformer Attention & KV-Cache Engine",
    "stageName": "Stage 2: Applied Architecture",
    "stageNum": 2,
    "pedagogicalRole": "Architectural Synthesis (Milestone Gate 1)",
    "spokenGoal": "Synthesize the foundational components of the Transformer: build a standalone, end-to-end self-attention module in TypeScript with RoPE positional rotation, causal masking, scaled dot-product attention, and an explicit KV-cache ring buffer supporting low-latency autoregressive token generation.",
    "conceptInvariant": "Architectural Synthesis Invariant: An autoregressive generation step must yield identical probability distributions whether executed token-by-token using the KV cache or evaluated in a single forward pass over the full accumulated sequence.",
    "failureMode": "Failing to update the KV cache write pointer during generation steps, causing subsequent tokens to overwrite earlier keys and values, producing repetitive garbage loops ('the the the the').",
    "tryItFriction": "Construct the complete Milestone 1 engine test suite: generate 10 tokens autoregressively with KV caching, compare against a full-sequence recomputation, and assert that output logits match within floating-point epsilon 1e-5.",
    "socraticHints": [
      "How can you verify that your KV cache implementation is completely bug-free?",
      "Run inference with KV caching enabled and compare the generated tokens against a reference run with zero caching!",
      "If the logits differ by more than 1e-5, your positional embedding offsets or KV cache insertion indices are mismatched."
    ],
    "situationalPuzzle": {
      "scenario": "During code review of a custom Transformer inference engine, an engineer notices that the developer applied RoPE to the Value (V) projection vectors in addition to Query (Q) and Key (K). What is the architectural consequence?",
      "options": [
        "It improves translation quality across languages.",
        "Fatal Semantic Corruption: RoPE is designed strictly for Q and K to compute relative attention scores. Rotating Value vectors rotates the semantic representation subspace itself, corrupting the weighted sum context vector produced by attention.",
        "It speeds up GPU matrix multiplication.",
        "It has no mathematical effect because matrices are orthogonal."
      ],
      "answerIdx": 1,
      "debrief": "Attention computes Softmax(Q * K^T / sqrt(d)) * V. RoPE embeds position into the inner product of Q and K. Rotating V imparts arbitrary positional rotations onto the actual features being aggregated, destroying representation semantics."
    },
    "quests": [
      {
        "id": "ai-m1-d05-q1",
        "name": "Milestone 1 Specification & Proof",
        "type": "concept",
        "desc": "Formalize the architecture and tensor invariants for the Minimalist Transformer Attention & KV-Cache Engine."
      },
      {
        "id": "ai-m1-d05-q2",
        "name": "Logit Equivalence Verification Suite",
        "type": "detective",
        "desc": "Write an automated test harness comparing cached vs uncached forward pass outputs to 5 decimal places."
      },
      {
        "id": "ai-m1-d05-q3",
        "name": "Milestone 1 Core Implementation",
        "type": "mastery",
        "desc": "Deliver the complete TypeScript Minimalist Transformer Attention Engine with RoPE and dynamic KV cache."
      },
      {
        "id": "ai-m1-d05-q4",
        "name": "Milestone 1 Viva Defense Gate",
        "type": "incident",
        "desc": "Defend the KV-cache memory allocation and RoPE mathematical invariants before the AI Systems Review Board."
      }
    ]
  },

  # =========================================================================
  # BLOCK 2: ADVANCED PROMPT ENGINEERING & STRUCTURED OUTPUTS (Days 6-10)
  # =========================================================================
  {
    "day": 6,
    "month": 1,
    "blockNum": 2,
    "title": "In-Context Learning (ICL) Mechanics, Few-Shot Calibration & Prompt Priming",
    "stageName": "Stage 2: Applied Architecture",
    "stageNum": 2,
    "pedagogicalRole": "Cognitive Alignment (In-Context Calibration)",
    "spokenGoal": "Master the physics of In-Context Learning (ICL): analyze how few-shot examples induce virtual task sub-spaces without gradient updates, understand label bias, recency bias, and common token priors, and design calibrated few-shot prompts that eliminate hallucinated format drift.",
    "conceptInvariant": "In-Context Prior Invariant: Few-shot demonstrations do not teach new facts; they calibrate the model's output distribution, suppress pre-training priors, and ground output formatting within the model's existing latent space.",
    "failureMode": "Presenting unbalanced few-shot examples (e.g., 4 Positive examples and 1 Negative example), causing the model's prior to heavily skew toward predicting 'Positive' regardless of the actual semantic content of the query.",
    "tryItFriction": "Build a prompt calibration utility in TypeScript that evaluates output class distributions across permutations of few-shot example orderings, detecting and correcting recency and frequency bias.",
    "socraticHints": [
      "Does changing the order of few-shot examples change the model's output?",
      "Yes! Models exhibit strong recency bias—they are more likely to mimic the format and label of the final few-shot demonstration.",
      "Calibrate few-shot prompts by balancing label distributions and testing multiple demonstration orderings."
    ],
    "situationalPuzzle": {
      "scenario": "A sentiment analysis pipeline uses a 3-shot prompt. In production, accuracy fluctuates wildly depending on the specific user input. Diagnostics show that the model predicts the label of the third demonstration example 72% of the time. What prompt defect is causing this?",
      "options": [
        "The model's temperature is set to 0.0.",
        "Recency Bias Exploitation: Autoregressive attention gives higher attention weight to tokens closer to the generation boundary. When demonstrations are unbalanced or lack clear delimiter boundaries, the final example dominates the attention context.",
        "The vocabulary does not support sentiment words.",
        "Few-shot prompting only works with 10 or more examples."
      ],
      "answerIdx": 1,
      "debrief": "Recency bias is a well-documented phenomenon in in-context learning. Mitigations include balanced class representations, randomized demonstration ordering, and inserting content-free null prompts (e.g., 'N/A') to calibrate baseline class probabilities."
    },
    "quests": [
      {
        "id": "ai-m1-d06-q1",
        "name": "ICL Attention Distribution Mapping",
        "type": "concept",
        "desc": "Map how cross-attention heads attend to demonstration query-response pairs versus zero-shot system prompts."
      },
      {
        "id": "ai-m1-d06-q2",
        "name": "Few-Shot Permutation Bias Auditor",
        "type": "detective",
        "desc": "Measure variance in model accuracy across all N! permutations of an N-shot demonstration prompt."
      },
      {
        "id": "ai-m1-d06-q3",
        "name": "Context-Calibrated Few-Shot Builder",
        "type": "mastery",
        "desc": "Implement a TypeScript prompt builder that enforces balanced class distributions and optimal exemplar ordering."
      },
      {
        "id": "ai-m1-d06-q4",
        "name": "3 AM SRE: Classification Drift After Prompt Tweak",
        "type": "incident",
        "desc": "Investigate a production incident where adding one helpful example skewed a classifier into an 85% false-positive rate."
      }
    ]
  },
  {
    "day": 7,
    "month": 1,
    "blockNum": 2,
    "title": "Reasoning Trajectories: Chain-of-Thought (CoT), Self-Consistency & Tree-of-Thoughts",
    "stageName": "Stage 2: Applied Architecture",
    "stageNum": 2,
    "pedagogicalRole": "Cognitive Scaffolding (Reasoning Topologies)",
    "spokenGoal": "Architect multi-step reasoning systems: dissect Chain-of-Thought (CoT) prompting to understand how intermediate reasoning tokens increase computational budget, implement Self-Consistency sampling (majority voting across diverse decoding paths), and construct Tree-of-Thoughts (ToT) search algorithms with breadth-first and depth-first tree traversal.",
    "conceptInvariant": "Compute-at-Inference Invariant: Autoregressive Transformers perform a fixed number of FLOPs per generated token; generating explicit intermediate reasoning tokens expands the effective compute budget allocated to solving complex problems.",
    "failureMode": "Forcing an LLM to output a direct final answer in a single token for a multi-step logic problem, causing immediate hallucination because the fixed depth of the feed-forward network cannot compress recursive deduction into a single forward pass.",
    "tryItFriction": "Implement a Tree-of-Thoughts (ToT) solver in TypeScript: prompt an LLM to generate 3 candidate intermediate thoughts, evaluate each thought's promise with a scoring prompt, prune dead branches, and backtrack to find the optimal solution.",
    "socraticHints": [
      "Why does 'Think step-by-step' dramatically improve math and logic performance?",
      "Because each generated reasoning token acts as a working memory scratchpad, allowing subsequent attention heads to attend to intermediate deductions!",
      "Structure prompts so the model writes its deduction scratchpad first before emitting the final answer tag."
    ],
    "situationalPuzzle": {
      "scenario": "A medical coding assistant frequently outputs wrong billing codes when generating a single answer. An engineer introduces Self-Consistency sampling: generating 10 independent reasoning paths at temperature 0.7 and taking the majority vote of the final codes. Accuracy jumps from 64% to 91%. Why did this succeed?",
      "options": [
        "Temperature 0.7 makes the model deterministic.",
        "Error Distribution Independence: Correct logical reasoning paths tend to converge on the same conclusion, whereas hallucinations and arithmetic errors disperse across diverse, inconsistent conclusions. Majority voting effectively cancels out uncorrelated reasoning errors.",
        "Self-Consistency trains new model weights on the fly.",
        "Sampling 10 times bypasses the safety filters."
      ],
      "answerIdx": 1,
      "debrief": "Self-Consistency leverages the fact that there are many ways to make an error, but logical reasoning paths frequently converge on the correct answer. Aggregating diverse sampling paths cancels out stochastic mistakes."
    },
    "quests": [
      {
        "id": "ai-m1-d07-q1",
        "name": "CoT Reasoning Complexity Math",
        "type": "concept",
        "desc": "Analyze the formal computational bounds of single-pass versus multi-token autoregressive scratchpads."
      },
      {
        "id": "ai-m1-d07-q2",
        "name": "Reasoning Error Dispersal Tracer",
        "type": "detective",
        "desc": "Trace 50 sampled reasoning paths to map convergence clusters versus divergent hallucination paths."
      },
      {
        "id": "ai-m1-d07-q3",
        "name": "Tree-of-Thoughts Search Orchestrator",
        "type": "mastery",
        "desc": "Build an end-to-end ToT search engine in TypeScript with heuristic state evaluation and pruning."
      },
      {
        "id": "ai-m1-d07-q4",
        "name": "3 AM SRE: Latency & Cost Explosion in CoT Loop",
        "type": "incident",
        "desc": "Resolve a runaway production bill where unbounded reasoning loops generated 8,000 tokens per trivial query."
      }
    ]
  },
  {
    "day": 8,
    "month": 1,
    "blockNum": 2,
    "title": "Constrained Decoding & Grammar-Guided Generation (JSON Schema, GBNF & AST Masks)",
    "stageName": "Stage 2: Applied Architecture",
    "stageNum": 2,
    "pedagogicalRole": "Deterministic Interfacing (Grammar Masking & Constrained Decoding)",
    "spokenGoal": "Eliminate JSON parsing errors forever: understand constrained decoding at the logit level, analyze how context-free grammars (CFGs, GBNF) convert JSON schemas into deterministic finite state automatons (DFAs), dynamically mask invalid vocabulary tokens before Softmax, and guarantee 100% syntactically valid JSON output with zero retry loops.",
    "conceptInvariant": "Logit Masking Invariant: To guarantee valid grammar adherence, logits for all vocabulary tokens that would violate the current state of the grammar automaton must be set to -infinity prior to Softmax; post-hoc regex retry loops are an architectural anti-pattern.",
    "failureMode": "Relying on system prompt instructions like 'Return valid JSON only' without logit constraints, leading to a 3% random failure rate where the LLM prefaces JSON with markdown backticks (```json) or conversational text, crashing backend JSON.parse().",
    "tryItFriction": "Build a token-level JSON grammar state machine in TypeScript: given a target JSON schema, track open brackets, keys, and values, and compute a boolean mask over allowed character tokens for the next step.",
    "socraticHints": [
      "Why is retrying failed JSON responses with a prompt fix an anti-pattern in high-throughput production systems?",
      "Because it multiplies latency by 2x to 5x, costs extra API tokens, and still leaves a non-zero probability of failure!",
      "Mask out invalid tokens directly during decoding so the model is physically incapable of emitting an invalid character."
    ],
    "situationalPuzzle": {
      "scenario": "A payments gateway requires structured JSON extraction from invoices. An engineer implements JSON mode using prompt engineering and retries. Under peak load, 1.8% of requests fail with 'SyntaxError: Unexpected token in JSON at position 412', causing failed payment Webhooks. How does grammar-guided decoding permanently resolve this?",
      "options": [
        "By increasing the temperature to 1.5 to encourage better creativity.",
        "Automaton-Guided Logit Masking: At each decoding step, the JSON Schema is compiled into a grammar automaton. Tokens that would produce invalid JSON syntax (e.g., a comma where a closing quote is required) are masked to -infinity in the logit vector, making syntactic syntax errors mathematically impossible.",
        "By switching from JSON to XML formatting.",
        "By allocating a larger GPU instance."
      ],
      "answerIdx": 1,
      "debrief": "Grammar-guided generation (such as Outlines or GBNF in llama.cpp) constructs an index of valid token IDs for each parser state. By masking illegal tokens prior to Softmax, the model can only choose tokens that form valid JSON, eliminating parse errors without retries."
    },
    "quests": [
      {
        "id": "ai-m1-d08-q1",
        "name": "CFG to DFA Token Mask Compiler",
        "type": "concept",
        "desc": "Explain how a JSON Schema compiles into a pushdown automaton that filters next-token vocabulary logits."
      },
      {
        "id": "ai-m1-d08-q2",
        "name": "Syntax Error Rate Benchmark",
        "type": "detective",
        "desc": "Benchmark JSON syntax validity across standard prompt instructions vs grammar-constrained decoding across 1,000 runs."
      },
      {
        "id": "ai-m1-d08-q3",
        "name": "In-Memory Grammar Masking Simulator",
        "type": "mastery",
        "desc": "Implement a TypeScript logit filter that enforces a strict TypeScript interface schema during simulated generation."
      },
      {
        "id": "ai-m1-d08-q4",
        "name": "3 AM SRE: Broken Webhook Due to Trailing Comma",
        "type": "incident",
        "desc": "Remediate a production outage where an LLM emitted trailing commas in JSON arrays, crashing legacy microservices."
      }
    ]
  },
  {
    "day": 9,
    "month": 1,
    "blockNum": 2,
    "title": "Function Calling Protocols: Tool Definitions, Parallel Execution & Argument Parsing",
    "stageName": "Stage 2: Applied Architecture",
    "stageNum": 2,
    "pedagogicalRole": "External System Integration (Tool Orchestration)",
    "spokenGoal": "Implement production function calling: format OpenAPI tool specifications, understand the special token protocols used by modern models (e.g., <tool_call>, functions schema), handle multi-tool parallel calls, validate arguments against runtime Zod/TypeBox schemas, and safely handle tool execution errors and timeouts.",
    "conceptInvariant": "Tool Invocation Decoupling Invariant: The LLM only generates the INTENT and ARGUMENTS for a tool invocation; actual execution must occur strictly within an isolated runtime environment with rigorous input validation and error handling before results are returned to context.",
    "failureMode": "Directly evaluating strings returned by an LLM function call using eval() or unparameterized SQL queries, allowing an attacker via prompt injection to trigger arbitrary code execution or drop database tables.",
    "tryItFriction": "Write a TypeScript Tool Registry that registers functions with Zod schemas, generates JSON Schema tool definitions, parses LLM tool call payloads, validates arguments, executes the handlers in parallel with Promise.allSettled, and formats tool outputs back into the chat history.",
    "socraticHints": [
      "What should your agent do when a tool execution throws an unhandled network error?",
      "Do NOT crash the agent! Catch the error, serialize the error message into a tool result message, and feed it back to the LLM so it can retry or explain the issue.",
      "The LLM needs to know the tool failed in order to reason about alternative approaches."
    ],
    "situationalPuzzle": {
      "scenario": "A financial customer support bot is equipped with a tool: transferMoney(accountId, amount). A user inputs: 'Can you please check my balance, and if it's over $1000, transfer $500 to account 9999?' The LLM immediately emits a tool call for transferMoney. What architectural safeguard was violated?",
      "options": [
        "The model's max token limit was too low.",
        "Missing Human-in-the-Loop & Confirmation Barrier: High-consequence side-effecting actions must never execute autonomously on unverified intent. The agent should require explicit user confirmation or step through a 2-phase authorization gate before dispatching write operations.",
        "The tool schema did not include the currency code.",
        "Function calling only works for read-only operations."
      ],
      "answerIdx": 1,
      "debrief": "High-impact actions (financial transactions, data deletion, sending external emails) must require explicit confirmation barriers or human-in-the-loop authorization gates rather than immediate autonomous execution."
    },
    "quests": [
      {
        "id": "ai-m1-d09-q1",
        "name": "OpenAPI to Tool Definition Translator",
        "type": "concept",
        "desc": "Map OpenAPI 3.0 REST endpoint specifications into OpenAI/Anthropic tool definition JSON schemas."
      },
      {
        "id": "ai-m1-d09-q2",
        "name": "Tool Call Argument Injection Detector",
        "type": "detective",
        "desc": "Analyze adversarial inputs designed to inject path traversals or shell commands into tool argument payloads."
      },
      {
        "id": "ai-m1-d09-q3",
        "name": "Parallel Tool Execution Engine",
        "type": "mastery",
        "desc": "Implement an asynchronous tool dispatcher supporting parallel calls, timeouts, and Zod validation in TypeScript."
      },
      {
        "id": "ai-m1-d09-q4",
        "name": "3 AM SRE: Infinite Tool Call Execution Loop",
        "type": "incident",
        "desc": "Diagnose an outage where an LLM repeatedly called a failing weather tool 400 times in an unbounded loop."
      }
    ]
  },
  {
    "day": 10,
    "month": 1,
    "blockNum": 2,
    "title": "Milestone 2: Constrained Grammar-Guided Structured Extraction Engine",
    "stageName": "Stage 2: Applied Architecture",
    "stageNum": 2,
    "pedagogicalRole": "Architectural Synthesis (Milestone Gate 2)",
    "spokenGoal": "Synthesize advanced prompting and deterministic generation: build an end-to-end Structured Extraction Engine in TypeScript that compiles arbitrary Zod schemas into strict grammar constraints, executes parallel tool invocations, and guarantees 100% type-safe extraction with zero JSON syntax errors.",
    "conceptInvariant": "Type-Safe Ingestion Invariant: An extraction pipeline must guarantee end-to-end type safety; raw LLM string output must never enter downstream business logic without passing strict schema validation and runtime constraint checks.",
    "failureMode": "Deploying an extraction service that swallows Zod validation errors and returns null, leading to silent data corruption in production data warehouses.",
    "tryItFriction": "Build and verify the Milestone 2 engine: extract complex nested resume data (experience, education, skills, dates) from 10 messy unstructured text snippets, verifying that 100% of extractions parse into valid TypeScript types on the first attempt.",
    "socraticHints": [
      "How do you handle optional fields versus required fields in constrained extraction?",
      "Encode optionality directly into the grammar automaton: allowed tokens at state S must include both the value tokens and the closing delimiter!",
      "Test edge cases where text contains missing fields to ensure the extractor emits null rather than hallucinating plausible values."
    ],
    "situationalPuzzle": {
      "scenario": "A medical record extraction engine experiences a 4% failure rate where numeric lab values (e.g., hemoglobin = 14.2) are extracted as strings ('14.2 g/dL') despite the schema requesting number. What is the root cause and optimal architectural fix?",
      "options": [
        "The model does not know what numbers are.",
        "Type Schema Ambiguity & Grammar Enforcement: The prompt lacked explicit few-shot normalization examples, and the extraction engine relied on soft prompting rather than an enforced numeric regex pattern [0-9]+(\\.[0-9]+)? in the constrained grammar. Enforcing a numeric DFA mask eliminates unit string pollution.",
        "The medical text was encrypted.",
        "The model temperature was too low."
      ],
      "answerIdx": 1,
      "debrief": "When models are prompted loosely, they often extract units alongside values. Defining the schema field with a strict regex constraint or numeric token mask forces the decoder to emit only digits and decimal points, ensuring clean numeric parsing."
    },
    "quests": [
      {
        "id": "ai-m1-d10-q1",
        "name": "Milestone 2 Specification & Architecture",
        "type": "concept",
        "desc": "Document the complete architectural specification for the Constrained Structured Extraction Engine."
      },
      {
        "id": "ai-m1-d10-q2",
        "name": "Schema Conformance Fuzzing Suite",
        "type": "detective",
        "desc": "Fuzz the extractor with 200 adversarial and poorly formatted text samples to test type recovery."
      },
      {
        "id": "ai-m1-d10-q3",
        "name": "Milestone 2 Core Implementation",
        "type": "mastery",
        "desc": "Deliver the production-ready TypeScript extraction engine integrating Zod schemas and tool dispatch."
      },
      {
        "id": "ai-m1-d10-q4",
        "name": "Milestone 2 Viva Defense Gate",
        "type": "incident",
        "desc": "Defend the schema extraction reliability and logit masking strategy before the Engineering Review Board."
      }
    ]
  },

  # =========================================================================
  # BLOCK 3: EMBEDDINGS & DENSE VECTOR RETRIEVAL (Days 11-15)
  # =========================================================================
  {
    "day": 11,
    "month": 1,
    "blockNum": 3,
    "title": "Dense Vector Embeddings: Contrastive Learning (InfoNCE), Pooling & Metric Geometry",
    "stageName": "Stage 3: Systems & Optimization",
    "stageNum": 3,
    "pedagogicalRole": "Representation Theory (Vector Geometry & Contrastive Training)",
    "spokenGoal": "Explore dense vector representations: understand how bi-encoders project text into continuous metric spaces, analyze the InfoNCE contrastive loss function, contrast CLS-token pooling with Mean pooling, examine the anisotropy problem (embedding collapse), and compare distance metrics (Cosine Similarity, Dot Product, Euclidean Distance).",
    "conceptInvariant": "Metric Space Equivalence Invariant: For unit-normalized vectors (||u|| = 1, ||v|| = 1), Cosine Similarity, Dot Product, and Squared Euclidean Distance are monotonically equivalent: ||u - v||^2 = 2 - 2*(u . v); calculating dot products over normalized vectors avoids expensive sqrt divisions during search.",
    "failureMode": "Computing cosine similarity on raw embedding vectors without prior normalization, or using dot product on unnormalized vectors of varying lengths, causing long documents to artificially dominate search rankings due to larger vector magnitudes.",
    "tryItFriction": "Implement an embedding normalization and similarity utility in TypeScript: compute L2 norm ||v|| = sqrt(sum(v_i^2)), normalize vectors to unit length, and demonstrate that dot product produces identical rankings to cosine similarity while running 3x faster.",
    "socraticHints": [
      "Why is dot product faster than cosine similarity on high-dimensional vectors?",
      "Cosine similarity computes (u . v) / (||u|| * ||v||), requiring two square roots and divisions for EVERY candidate! Pre-normalizing vectors allows you to compute only the dot product.",
      "Always normalize vectors when storing them in the vector database."
    ],
    "situationalPuzzle": {
      "scenario": "A company generates embeddings for customer reviews. They notice that the cosine similarity between random, unrelated reviews is consistently between 0.82 and 0.95. Why are the embeddings clustering in a narrow cone, and how does this affect retrieval?",
      "options": [
        "The GPU precision was set to INT8.",
        "Embedding Anisotropy (Representation Degeneracy): Unregularized transformer embeddings often collapse into a narrow cone in vector space due to high-frequency token dominance. This compresses dynamic range, degrading fine-grained semantic differentiation unless post-processed via whitening or mean-centering.",
        "The reviews were written in English.",
        "Cosine similarity cannot exceed 0.5 for different documents."
      ],
      "answerIdx": 1,
      "debrief": "Anisotropy is a known issue where embeddings occupy a narrow cone rather than being uniformly distributed across the unit sphere. Solutions include mean subtraction, PCA whitening, or training with contrastive objective functions like InfoNCE."
    },
    "quests": [
      {
        "id": "ai-m1-d11-q1",
        "name": "InfoNCE Loss Mathematical Formulation",
        "type": "concept",
        "desc": "Derive the InfoNCE loss formula and explain how negative temperature parameters control hardness scaling."
      },
      {
        "id": "ai-m1-d11-q2",
        "name": "Embedding Anisotropy Measurement Tool",
        "type": "detective",
        "desc": "Measure the average cosine similarity of 1,000 random document pairs to detect representation collapse."
      },
      {
        "id": "ai-m1-d11-q3",
        "name": "SIMD-Optimized Vector Math Library",
        "type": "mastery",
        "desc": "Implement a high-throughput vector normalization and dot-product library in TypeScript."
      },
      {
        "id": "ai-m1-d11-q4",
        "name": "3 AM SRE: Search Ranking Inversion Incident",
        "type": "incident",
        "desc": "Investigate why search relevance collapsed after an unnormalized embedding model was deployed to production."
      }
    ]
  },
  {
    "day": 12,
    "month": 1,
    "blockNum": 3,
    "title": "High-Dimensional Vector Spaces & The Curse of Dimensionality",
    "stageName": "Stage 3: Systems & Optimization",
    "stageNum": 3,
    "pedagogicalRole": "Mathematical Underpinnings (High-Dimensional Geometry)",
    "spokenGoal": "Analyze the bizarre geometry of high-dimensional spaces: understand why all vectors become nearly orthogonal in 1536-dimensional space, analyze concentration of measure and why distance ratios converge to 1, and evaluate dimensionality reduction techniques (PCA, Matryoshka Embeddings) to reduce storage and index costs by 75% without sacrificing recall.",
    "conceptInvariant": "Matryoshka Representation Invariant: Matryoshka Embeddings (MRL) train the model so that earlier vector dimensions (e.g., first 256 of 1536) capture primary semantic variance; truncating vectors to lower dimensions preserves high retrieval recall while slashing storage and search compute.",
    "failureMode": "Storing full 1536-dimensional FP32 vectors for 50 million documents (307 GB RAM) without dimensionality reduction or quantization, causing vector index hosting costs to exceed the entire engineering infrastructure budget.",
    "tryItFriction": "Implement Matryoshka vector truncation in TypeScript: take 1536-dim embeddings, slice to 256 and 512 dimensions, re-normalize, compute Top-10 nearest neighbors, and measure recall retention compared to the full 1536-dim baseline.",
    "socraticHints": [
      "Can you simply truncate vanilla BERT or Ada-002 embeddings to 256 dimensions?",
      "No! Vanilla embeddings spread information evenly across all dimensions. Only models trained with Matryoshka Representation Loss concentrate variance into early dimensions.",
      "Check model specifications to ensure MRL training before applying vector truncation."
    ],
    "situationalPuzzle": {
      "scenario": "In a 1024-dimensional vector space, a developer tests Euclidean distance between random normalized vectors. They discover that the minimum distance is 1.39 and the maximum distance is 1.43. Why are all vector distances nearly identical, and how does this impact brute-force search?",
      "options": [
        "The random number generator was defective.",
        "Curse of Dimensionality (Concentration of Measure): In high dimensions, the volume of a sphere concentrates entirely on its thin surface shell. As dimension d approaches infinity, the relative difference between nearest and farthest neighbors approaches zero, making Euclidean distance discrimination fragile without contrastive angle metrics.",
        "The vectors were not converted to integers.",
        "High-dimensional spaces always cause memory leaks."
      ],
      "answerIdx": 1,
      "debrief": "Concentration of measure causes distances in high dimensions to bunch tightly together. In 1000+ dimensions, random vectors are almost always orthogonal (dot product near 0, distance near sqrt(2) approx 1.414). Effective search relies on angular separation."
    },
    "quests": [
      {
        "id": "ai-m1-d12-q1",
        "name": "High-Dimensional Orthogonality Proof",
        "type": "concept",
        "desc": "Prove mathematically why the expected dot product of two random normalized vectors in d-dimensional space is zero."
      },
      {
        "id": "ai-m1-d12-q2",
        "name": "Distance Concentration Profiler",
        "type": "detective",
        "desc": "Profile the distribution of distances across dimensions d = 2, 16, 128, 768, and 1536 to demonstrate clustering."
      },
      {
        "id": "ai-m1-d12-q3",
        "name": "Matryoshka Truncation & Recall Benchmark",
        "type": "mastery",
        "desc": "Build an automated benchmark comparing MRL truncated vector recall (256d vs 1536d) on 10,000 documents."
      },
      {
        "id": "ai-m1-d12-q4",
        "name": "3 AM SRE: Vector Database OOM Crisis",
        "type": "incident",
        "desc": "Remediate a vector database cluster running out of memory by implementing MRL truncation and re-indexing."
      }
    ]
  },
  {
    "day": 13,
    "month": 1,
    "blockNum": 3,
    "title": "Approximate Nearest Neighbors (ANN): Hierarchical Navigable Small World (HNSW) Graphs",
    "stageName": "Stage 3: Systems & Optimization",
    "stageNum": 3,
    "pedagogicalRole": "Algorithmic Engineering (HNSW Graphs & Proximity Routing)",
    "spokenGoal": "Deconstruct the gold standard of vector search: Hierarchical Navigable Small World (HNSW) graphs. Understand multi-layer skip-list graph topologies, analyze greedy routing heuristics, explore the construction parameters M (max connections) and efConstruction (beam search width), and tune the speed vs recall trade-off curve (efSearch).",
    "conceptInvariant": "Small World Navigability Invariant: HNSW builds hierarchical layers where upper layers have sparse, long-range highway edges for logarithmic routing, while layer 0 contains dense, local neighbor edges for fine-grained convergence; search cost scales as O(log N) rather than brute-force O(N).",
    "failureMode": "Setting efSearch to 16 in a production HNSW index to achieve sub-millisecond latency, resulting in search recall dropping to 62% because the greedy beam search gets trapped in local minima before reaching true nearest neighbors.",
    "tryItFriction": "Build a single-layer Navigable Small World (NSW) graph in TypeScript: insert vectors, connect each new node to its M nearest existing neighbors, and implement greedy search starting from an entry point node.",
    "socraticHints": [
      "Why does HNSW use multiple layers instead of just a single flat graph?",
      "Think of a skip list! High layers let you take huge leaps across vector space without getting stuck in dense clusters of irrelevant vectors.",
      "Search begins at the top layer, descends greedily to layer 0, and then executes a wider beam search controlled by efSearch."
    ],
    "situationalPuzzle": {
      "scenario": "A vector search cluster handles 5,000 queries per second. Under peak load, P99 latency spikes from 8ms to 350ms. Profiling reveals that efSearch is set to 500, and CPU utilization is at 100%. What is the optimal tuning adjustment?",
      "options": [
        "Increase M from 16 to 128 to add more edges.",
        "efSearch Dynamic Tuning: efSearch controls the size of the priority queue during search. Lowering efSearch from 500 to 64 reduces CPU distance computations by ~75% while typically maintaining > 98% recall. efSearch should be dynamically adjusted based on SLA.",
        "Switch to brute-force linear scan.",
        "Disable index persistence to disk."
      ],
      "answerIdx": 1,
      "debrief": "efSearch governs the exploration beam width at query time. High values (500) provide negligible recall gains over moderate values (64-128) but multiply distance computations and CPU load, causing queuing delays under high concurrency."
    },
    "quests": [
      {
        "id": "ai-m1-d13-q1",
        "name": "HNSW Graph Topology & Complexity Proof",
        "type": "concept",
        "desc": "Explain the multi-layer skip-list hierarchy and prove logarithmic O(log N) search complexity in HNSW graphs."
      },
      {
        "id": "ai-m1-d13-q2",
        "name": "Recall vs Latency Pareto Frontier Probe",
        "type": "detective",
        "desc": "Plot the recall-vs-QPS trade-off curve across efSearch values from 16 to 512 on a 100k vector corpus."
      },
      {
        "id": "ai-m1-d13-q3",
        "name": "TypeScript HNSW Greedy Search Router",
        "type": "mastery",
        "desc": "Implement a functional 3-layer HNSW graph in TypeScript supporting insertion and greedy search traversal."
      },
      {
        "id": "ai-m1-d13-q4",
        "name": "3 AM SRE: Graph Disconnection Recall Outage",
        "type": "incident",
        "desc": "Diagnose an outage where concurrent node deletions fragmented an HNSW graph, causing queries to miss 40% of records."
      }
    ]
  },
  {
    "day": 14,
    "month": 1,
    "blockNum": 3,
    "title": "Vector Compression: Inverted File (IVF), Product Quantization (PQ) & Scalar Quantization",
    "stageName": "Stage 3: Systems & Optimization",
    "stageNum": 3,
    "pedagogicalRole": "Memory Optimization (Quantization & Compression)",
    "spokenGoal": "Master vector compression techniques for billion-scale search: analyze Inverted File Flat (IVF) clustering with Voronoi cells, dissect Product Quantization (PQ) which decomposes vectors into sub-vectors and encodes them as byte centroids, evaluate Scalar Quantization (SQ8: FP32 to INT8), and compare memory savings against distance distortion.",
    "conceptInvariant": "Asymmetric Distance Computation (ADC) Invariant: In PQ, database vectors are compressed into compact byte codes; query vectors remain uncompressed FP32, allowing distances to be computed using precomputed centroid lookup tables in fast CPU cache.",
    "failureMode": "Setting the number of IVF Voronoi centroids (nlist) too low (e.g., 100 for 10 million vectors), resulting in massive cell sizes that require scanning 100,000 vectors per query, defeating the purpose of indexing.",
    "tryItFriction": "Implement Scalar Quantization (SQ8) in TypeScript: take FP32 embedding vectors, calculate min/max range, quantize to uint8 values (0-255), and implement fast integer dot-product decompression.",
    "socraticHints": [
      "How does Product Quantization achieve 16x to 32x memory compression?",
      "It splits a 1024-dim vector into 64 sub-vectors of 16 dimensions each. Each sub-vector is replaced by a 1-byte index pointing to one of 256 learned cluster centroids!",
      "Instead of 1024 * 4 = 4096 bytes per vector, PQ stores only 64 bytes!"
    ],
    "situationalPuzzle": {
      "scenario": "A company must index 100 million 768-dimensional embeddings on a budget. In FP32, this requires 100M * 768 * 4 bytes = 307 GB RAM. By applying Product Quantization (PQ64), memory drops to 6.4 GB RAM. However, Top-1 search recall drops to 74%. How do they recover 95%+ recall while keeping memory low?",
      "options": [
        "Increase the GPU clock speed.",
        "Two-Stage Re-Ranking (IVF-PQ + Full Precision Rescore): Use fast, compressed IVF-PQ to retrieve Top-100 candidate IDs in memory, then fetch uncompressed (or SQ8) vectors from SSD to re-rank the top 100 candidates with exact distance math.",
        "Double the number of sub-vectors to 1536.",
        "Switch from Euclidean distance to Manhattan distance."
      ],
      "answerIdx": 1,
      "debrief": "Two-stage retrieval is standard in production vector databases (like Milvus and FAISS). Fast compressed indexes quickly narrow down millions of candidates to a short candidate list (e.g., Top-100), which is then re-ranked using exact vectors loaded from NVMe SSD."
    },
    "quests": [
      {
        "id": "ai-m1-d14-q1",
        "name": "Product Quantization Codebook Math",
        "type": "concept",
        "desc": "Derive the mathematical mechanics of sub-vector clustering, codebook creation, and Asymmetric Distance Computation."
      },
      {
        "id": "ai-m1-d14-q2",
        "name": "Quantization Distortion Analyzer",
        "type": "detective",
        "desc": "Measure mean squared error and cosine similarity drift introduced by FP32 -> SQ8 -> PQ32 quantization."
      },
      {
        "id": "ai-m1-d14-q3",
        "name": "Two-Stage IVF-PQ Re-Rank Engine",
        "type": "mastery",
        "desc": "Build a simulated two-stage vector retrieval engine in TypeScript combining PQ screening with exact re-ranking."
      },
      {
        "id": "ai-m1-d14-q4",
        "name": "3 AM SRE: Centroid Drift After Data Re-indexing",
        "type": "incident",
        "desc": "Diagnose an issue where adding millions of new code documents distorted old PQ centroids, degrading text search."
      }
    ]
  },
  {
    "day": 15,
    "month": 1,
    "blockNum": 3,
    "title": "Milestone 3: In-Memory HNSW Vector Index & Search Engine",
    "stageName": "Stage 3: Systems & Optimization",
    "stageNum": 3,
    "pedagogicalRole": "Architectural Synthesis (Milestone Gate 3)",
    "spokenGoal": "Synthesize dense vector retrieval: engineer a complete, high-performance in-memory HNSW Vector Database Engine in TypeScript. Implement multi-layer graph construction, heuristic neighbor selection, dynamic efSearch beam traversal, vector normalization, and cosine distance evaluation delivering sub-5ms search over 10,000 vectors.",
    "conceptInvariant": "Graph Connectivity Invariant: Every inserted node must establish bidirectional connections to at least min_M neighbors across layers up to its assigned maximum level; isolated nodes or disconnected subgraphs permanently destroy retrieval recall.",
    "failureMode": "Failing to update bidirectional reverse links when inserting a new neighbor into an existing node's neighbor list, causing dead-end paths during greedy graph traversal.",
    "tryItFriction": "Execute the Milestone 3 benchmark: insert 10,000 128-dimensional normalized vectors into your HNSW index, execute 500 random query searches, compare against brute-force linear search, and assert that recall@10 exceeds 98% with latency < 5ms.",
    "socraticHints": [
      "How do you assign the maximum layer for a newly inserted vector in HNSW?",
      "Use an exponential decay probability distribution: level = floor(-ln(uniform_random()) * mL). Most vectors go only to layer 0, while very few reach top layers!",
      "This creates the logarithmic skip-list structure that enables fast O(log N) highway routing."
    ],
    "situationalPuzzle": {
      "scenario": "During an oral architecture review, an architect asks: 'In HNSW, what happens if two clusters of vectors are separated by a large distance gap with no intermediate vectors between them?' How does HNSW maintain navigability?",
      "options": [
        "It crashes with a null pointer exception.",
        "Long-Range Highway Links & Entry Points: The upper layers of HNSW maintain long-range connections with higher probability of bridging inter-cluster gaps. Additionally, maintaining multiple entry points or executing searches with efSearch > 1 ensures the beam search does not get trapped in one cluster.",
        "It merges the two clusters into one coordinate.",
        "HNSW only works on convex datasets."
      ],
      "answerIdx": 1,
      "debrief": "HNSW's hierarchical layers are specifically designed to bridge wide cluster gaps. Top layers act like express highways spanning large coordinate distances, while lower layers handle local navigation within dense clusters."
    },
    "quests": [
      {
        "id": "ai-m1-d15-q1",
        "name": "Milestone 3 Architectural Specification",
        "type": "concept",
        "desc": "Specify data structures, concurrency invariants, and routing algorithms for the In-Memory HNSW Vector Engine."
      },
      {
        "id": "ai-m1-d15-q2",
        "name": "HNSW Recall & Latency Benchmark Harness",
        "type": "detective",
        "desc": "Build an automated harness testing recall@1, recall@10, and P99 latency against ground-truth brute-force scans."
      },
      {
        "id": "ai-m1-d15-q3",
        "name": "Milestone 3 Core Implementation",
        "type": "mastery",
        "desc": "Deliver the complete TypeScript in-memory HNSW Vector Database Engine with multi-layer construction."
      },
      {
        "id": "ai-m1-d15-q4",
        "name": "Milestone 3 Viva Defense Gate",
        "type": "incident",
        "desc": "Defend the graph construction complexity, memory footprint, and recall guarantees before the Principal AI Architect."
      }
    ]
  }
]
