# scripts/visuals/ai_spec_m2_part1.py
# Course 12: AI Engineering & LLM Integration (course-ai-eng)
# Month 2: Days 31-45 (Blocks 7-9) - 60 Quests Total

AI_M2_PART1 = [
  # =========================================================================
  # BLOCK 7: FINE-TUNING & PARAMETER-EFFICIENT ADAPTATION (LoRA / QLoRA) (Days 31-35)
  # =========================================================================
  {
    "day": 31,
    "month": 2,
    "blockNum": 7,
    "title": "Full Fine-Tuning vs PEFT: Catastrophic Forgetting, Gradient Memory & Parameter Budgets",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Advanced Model Adaptation (Fine-Tuning Trade-offs)",
    "spokenGoal": "Analyze modern model adaptation: contrast Full Fine-Tuning (updating all weights W) with Parameter-Efficient Fine-Tuning (PEFT). Understand Catastrophic Forgetting—where fine-tuning on a specialized domain destroys general reasoning and instruction following. Calculate optimizer state memory footprints for AdamW (16 bytes per parameter: FP16 weights, FP16 gradients, FP32 master weights, FP32 momentum, FP32 variance).",
    "conceptInvariant": "Optimizer Memory Invariant: Training a model with AdamW requires at least 4x to 6x the VRAM of pure inference; for an N-parameter model, weights take 2N bytes, gradients take 2N bytes, and AdamW optimizer states take 12N bytes, demanding 16N bytes before activations.",
    "failureMode": "Attempting full parameter fine-tuning of a 7B model on a single 24GB GPU, resulting in immediate CUDA OOM during the backward pass because AdamW optimizer states alone require 7B * 12 bytes = 84 GB VRAM.",
    "tryItFriction": "Build a VRAM Training Footprint Calculator in TypeScript that takes parameter count, precision (FP32, FP16, INT8, INT4), optimizer type (AdamW, SGD, 8-bit Adam), and batch size, computing exact VRAM requirements across weights, gradients, optimizer states, and KV activations.",
    "socraticHints": [
      "Why does AdamW require 12 bytes of optimizer state per model parameter?",
      "Adam maintains two running averages in full FP32 (4 bytes for first moment m, 4 bytes for second moment v) plus FP32 master copy weights (4 bytes) to prevent underflow during gradient updates!",
      "PEFT methods freeze the base model, eliminating optimizer states for 99%+ of weights."
    ],
    "situationalPuzzle": {
      "scenario": "A company fine-tunes an open-source 13B model on medical diagnostic text using full fine-tuning. The model achieves high accuracy on medical terminology, but users discover it can no longer write basic Python code or follow conversational formatting. What neural network failure mode occurred?",
      "options": [
        "The model's vocabulary file was deleted.",
        "Catastrophic Forgetting (Weight Drift): Full fine-tuning overwrites pre-trained weight representations across all layers without regularization. The model's representations shift entirely toward the medical distribution, erasing general reasoning, coding, and instruction-following abilities.",
        "The learning rate was set to 0.0.",
        "Medical text is incompatible with transformer models."
      ],
      "answerIdx": 1,
      "debrief": "Catastrophic forgetting occurs when unconstrained gradient updates shift pre-trained weights away from their original general-purpose manifold. Solutions include Parameter-Efficient Fine-Tuning (LoRA), low learning rates, and mixing in a 10-20% replay buffer of general instruction data."
    },
    "quests": [
      {
        "id": "ai-m2-d31-q1",
        "name": "AdamW Training Memory Mathematical Proof",
        "type": "concept",
        "desc": "Derive the mathematical memory formula for FP16 training with FP32 master weights and AdamW states."
      },
      {
        "id": "ai-m2-d31-q2",
        "name": "Catastrophic Forgetting Benchmark Suite",
        "type": "detective",
        "desc": "Evaluate general benchmark benchmarks (MMLU, HumanEval) before and after domain-specific fine-tuning."
      },
      {
        "id": "ai-m2-d31-q3",
        "name": "Comprehensive VRAM Training Estimator",
        "type": "mastery",
        "desc": "Implement a TypeScript CLI utility that calculates exact training hardware requirements across architectures."
      },
      {
        "id": "ai-m2-d31-q4",
        "name": "3 AM SRE: Out-Of-Memory Crash in Training Cluster",
        "type": "incident",
        "desc": "Diagnose an OOM crash on a multi-node GPU cluster caused by unexpected activation memory explosion."
      }
    ]
  },
  {
    "day": 32,
    "month": 2,
    "blockNum": 7,
    "title": "Low-Rank Adaptation (LoRA) Mathematics: Weight Updates Delta W = B * A, Rank r & Scaling Alpha",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "PEFT Mechanics (LoRA Mathematics & Matrix Factorization)",
    "spokenGoal": "Master the mathematics of Low-Rank Adaptation (LoRA): freeze base model weights W_0 in R^{d x k}, represent weight updates as low-rank matrix decomposition Delta W = B * A where A in R^{r x k} and B in R^{d x r} with rank r << min(d, k), explore random Gaussian initialization for A and zero initialization for B, understand scaling factor alpha/r, and analyze zero inference latency via weight merging.",
    "conceptInvariant": "Low-Rank Intrinsic Dimension Invariant: Over-parameterized neural networks reside on a low intrinsic dimension manifold during task adaptation; decomposing Delta W into rank r << d allows adapting < 0.1% of parameters while matching 99% of full fine-tuning performance.",
    "failureMode": "Initializing matrix B with random Gaussian values rather than exact zeros at step 0, causing the model's forward pass to be immediately corrupted by random noise before the first training step begins.",
    "tryItFriction": "Implement a pure TypeScript LoRA Linear Layer: wrap a frozen base weight matrix W_0, maintain trainable low-rank matrices A and B, implement forward pass Y = X * W_0 + (alpha / r) * (X * A^T * B^T), and implement a mergeWeights() function that computes W_merged = W_0 + (alpha / r) * (B * A).",
    "socraticHints": [
      "Why must matrix B be initialized to all zeros while matrix A is initialized with random Gaussian values?",
      "Because at step 0, Delta W = B * A must equal exactly ZERO! This ensures the model begins training with the exact unmodified pre-trained representations!",
      "If both A and B were zero, gradients would vanish; if both were random, the model would output garbage on the first forward pass."
    ],
    "situationalPuzzle": {
      "scenario": "A developer trains a LoRA adapter with rank r=8 and alpha=16. In production, they need to serve 1,000 requests per second with sub-20ms latency. Serving the model by calculating X * W_0 and X * A * B separately adds 12% compute latency. How do they eliminate this latency overhead with zero performance penalty?",
      "options": [
        "Increase GPU temperature.",
        "Zero-Cost Weight Merging: Prior to deploying to production inference, multiply the low-rank matrices B and A to materialize Delta W = (alpha / r) * (B * A), and add it directly into the frozen base weights W_new = W_0 + Delta W. This restores the exact standard linear layer architecture with zero extra matrix multiplications.",
        "Set rank r to 1.",
        "LoRA models cannot be merged."
      ],
      "answerIdx": 1,
      "debrief": "A major operational benefit of LoRA is that at inference time, Delta W can be directly merged into base weights W_0 via simple matrix addition (W_merged = W_0 + (alpha/r)*B*A). This eliminates the low-rank branch completely, yielding zero additional latency during inference."
    },
    "quests": [
      {
        "id": "ai-m2-d32-q1",
        "name": "LoRA Matrix Factorization Proof",
        "type": "concept",
        "desc": "Prove parameter reduction ratios: compare d * k against r * (d + k) across typical attention projection layers."
      },
      {
        "id": "ai-m2-d32-q2",
        "name": "Adapter Weight Drift Visualizer",
        "type": "detective",
        "desc": "Compute the Frobenius norm of Delta W across training epochs to track parameter movement away from W_0."
      },
      {
        "id": "ai-m2-d32-q3",
        "name": "TypeScript LoRA Layer with Weight Merging",
        "type": "mastery",
        "desc": "Implement a functional LoRA linear layer module in TypeScript with forward pass and zero-overhead weight merging."
      },
      {
        "id": "ai-m2-d32-q4",
        "name": "3 AM SRE: Output Corruption on Step 0 of Training",
        "type": "incident",
        "desc": "Debug a training run that produced 100% NaN loss on step 0 after an engineer initialized matrix B with non-zero values."
      }
    ]
  },
  {
    "day": 33,
    "month": 2,
    "blockNum": 7,
    "title": "QLoRA Mechanics: 4-bit NormalFloat (NF4), Double Quantization & Paged Optimizers",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Extreme Memory Optimization (QLoRA & 4-bit Precision)",
    "spokenGoal": "Demystify QLoRA: quantize base model weights to 4-bit precision while fine-tuning 16-bit LoRA adapters. Understand NormalFloat4 (NF4)—an information-theoretically optimal quantile quantization for normally distributed neural network weights. Analyze Double Quantization (quantizing the quantization constants) to save 0.37 bits per parameter, and examine Paged Optimizers (using CUDA unified memory to page optimizer states to CPU RAM during activation spikes).",
    "conceptInvariant": "Information-Theoretic Quantile Invariant: NF4 maps neural network weights (which follow zero-mean Gaussian distributions) into 16 discrete bins having equal probability mass (1/16 per bin), preserving significantly more information entropy than linear integer quantization (INT4).",
    "failureMode": "Fine-tuning a quantized model using standard INT4 quantization instead of NF4, causing severe precision loss in outlier weight channels and dropping fine-tuning benchmark performance by 8%.",
    "tryItFriction": "Implement an NF4 Quantization and Dequantization simulator in TypeScript: construct the 16 theoretical NF4 quantile points based on standard normal inverse CDF, map FP32 weights into 4-bit nibbles, and dequantize back to FP16 during forward pass multiplication.",
    "socraticHints": [
      "Why is NormalFloat4 (NF4) better than standard uniform INT4 for neural network weights?",
      "Because neural network weights are NOT uniformly distributed! They cluster around 0 in a bell curve. NF4 places more quantization bins near 0 and fewer bins in the tails, minimizing reconstruction error!",
      "NF4 allocates equal probability mass to each of the 16 quantization bins."
    ],
    "situationalPuzzle": {
      "scenario": "A research team fine-tunes a 70B parameter model on a single 48GB GPU using QLoRA. Occasionally, during long sequence batches, the GPU VRAM peaks by 4GB, causing a CUDA Out-Of-Memory crash. The team activates Paged Optimizers. The run completes without crashing. What mechanism saved the training job?",
      "options": [
        "Paged Optimizers deleted the gradients.",
        "CUDA Unified Memory Paging to CPU RAM: Paged Optimizers leverage CUDA Unified Memory to automatically page non-critical optimizer state tensors from GPU VRAM to host CPU system memory during peak allocation spikes, paging them back when memory pressure subsides.",
        "The model was converted to 1-bit weights.",
        "The GPU automatically bought more VRAM."
      ],
      "answerIdx": 1,
      "debrief": "Paged Optimizers work similarly to operating system page tables. When GPU VRAM approaches exhaustion due to long-context activation spikes, AdamW states are transparently paged out to CPU system RAM over PCIe, preventing fatal CUDA OOM crashes at the cost of minor transfer overhead."
    },
    "quests": [
      {
        "id": "ai-m2-d33-q1",
        "name": "NF4 Quantile Derivation Mathematics",
        "type": "concept",
        "desc": "Calculate the exact numerical values of the 16 NF4 quantization bins using standard normal inverse CDF integrals."
      },
      {
        "id": "ai-m2-d33-q2",
        "name": "Double Quantization Memory Savings Proof",
        "type": "detective",
        "desc": "Calculate the exact byte savings of quantizing 32-bit quantization constants into 8-bit integers across a 70B model."
      },
      {
        "id": "ai-m2-d33-q3",
        "name": "TypeScript NF4 Quantizer & Dequantizer",
        "type": "mastery",
        "desc": "Build an NF4 4-bit quantization and dequantization module in TypeScript with block-wise scaling factors."
      },
      {
        "id": "ai-m2-d33-q4",
        "name": "3 AM SRE: PCIe Bus Saturation with Paged Optimizers",
        "type": "incident",
        "desc": "Diagnose an issue where excessive optimizer paging over PCIe slowed training throughput by 80%."
      }
    ]
  },
  {
    "day": 34,
    "month": 2,
    "blockNum": 7,
    "title": "Instruction Tuning Datasets: ChatML Formatting, Special Tokens & Masked Cross-Entropy Loss",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Data Engineering for Training (Chat Templates & Loss Masking)",
    "spokenGoal": "Prepare instruction-tuning datasets for production training: understand ChatML and standard chat templates (System, User, Assistant), analyze the role of special tokens (<|im_start|>, <|im_end|>), and implement Masked Cross-Entropy Loss—ensuring the loss is computed ONLY on the assistant's generated response tokens, ignoring system instructions and user prompt tokens during backpropagation.",
    "conceptInvariant": "Target-Only Loss Masking Invariant: Gradients must only backpropagate through the model's target response tokens; computing cross-entropy loss over user prompt tokens wastes training capacity and forces the model to memorize user queries rather than learning response generation.",
    "failureMode": "Failing to mask user prompt tokens with label ID -100 in the training dataset, causing the model to memorize specific prompt phrasing and penalizing the model for not predicting the user's arbitrary wording.",
    "tryItFriction": "Build an Instruction Dataset Preprocessor in TypeScript: parse multi-turn chat dialogues, format with ChatML special tokens, tokenize, generate input_ids and labels arrays, and replace all prompt token labels with -100 so cross-entropy loss evaluates only assistant tokens.",
    "socraticHints": [
      "Why does PyTorch CrossEntropyLoss ignore label index -100 by default?",
      "-100 is the standard ignore_index in PyTorch! Setting labels[i] = -100 ensures that token position i contributes 0 to the loss and produces 0 gradients during backward passes.",
      "Mask all prompt and system instruction token positions with -100."
    ],
    "situationalPuzzle": {
      "scenario": "A fine-tuned support model frequently echoes the user's question back to them, or hallucinates '<|im_end|>' inside its responses. Inspection of the training pipeline reveals that the tokenizer did not register '<|im_start|>' and '<|im_end|>' as special tokens. What happened during tokenization?",
      "options": [
        "The model became self-aware.",
        "Special Token Split De-synchronization: Because '<|im_start|>' was not in the special tokens list, the BPE tokenizer split it into multiple subwords (e.g., ['<', '|', 'im', '_', 'start', '|', '>']). The model never learned the atomic boundary role tokens, corrupting dialogue turn transitions.",
        "The dataset had too many rows.",
        "The learning rate was too high."
      ],
      "answerIdx": 1,
      "debrief": "Chat template boundaries require atomic special tokens with dedicated token IDs. If special tokens are not registered with the tokenizer, BPE decomposes them into constituent punctuation subwords, preventing the model from recognizing structural role delimiters."
    },
    "quests": [
      {
        "id": "ai-m2-d34-q1",
        "name": "Masked Cross-Entropy Gradient Derivation",
        "type": "concept",
        "desc": "Derive the mathematical loss function showing how label masking eliminates prompt gradients from weight updates."
      },
      {
        "id": "ai-m2-d34-q2",
        "name": "Chat Template Parsing & Tokenizer Auditor",
        "type": "detective",
        "desc": "Audit 500 formatted training records to ensure zero prompt token leakage into active training labels."
      },
      {
        "id": "ai-m2-d34-q3",
        "name": "Production ChatML Dataset Tokenizer",
        "type": "mastery",
        "desc": "Implement a robust ChatML tokenization and label-masking pipeline in TypeScript with validation checks."
      },
      {
        "id": "ai-m2-d34-q4",
        "name": "3 AM SRE: Special Token Bleed in Fine-Tuned Output",
        "type": "incident",
        "desc": "Remediate a production issue where a model fine-tuned without proper special tokens printed raw delimiter markers."
      }
    ]
  },
  {
    "day": 35,
    "month": 2,
    "blockNum": 7,
    "title": "Milestone 6: Distributed Parameter-Efficient Fine-Tuning Engine",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Architectural Synthesis (Milestone Gate 6)",
    "spokenGoal": "Synthesize parameter-efficient training: build an end-to-end Parameter-Efficient Fine-Tuning (PEFT/LoRA) Engine in TypeScript. Implement frozen base model weights, trainable low-rank adapters (A and B matrices), ChatML prompt formatting with -100 label masking, forward pass with scaling alpha/r, backpropagation over adapter weights, and weight merging for zero-latency deployment.",
    "conceptInvariant": "Adapter Convergence Invariant: Over training epochs on a consistent instruction dataset, training loss must monotonically decrease while base model weights W_0 remain bit-for-bit bitwise identical to their initial values.",
    "failureMode": "Accidentally enabling requires_grad on base model weights, causing base weights to update and blowing up GPU VRAM past physical limits during the backward pass.",
    "tryItFriction": "Execute the Milestone 6 test harness: train a LoRA adapter on 100 sample instruction pairs for 5 epochs in TypeScript, verify that training loss drops by > 40%, assert that frozen base weights are completely unchanged, merge weights, and assert identical output.",
    "socraticHints": [
      "How do you verify that base model weights were never modified during training?",
      "Compute the SHA-256 hash of the base weight tensor before training and assert that the hash after training is bitwise identical!",
      "Only the adapter matrices A and B should have updated values."
    ],
    "situationalPuzzle": {
      "scenario": "During the Milestone 6 defense, an architect asks: 'You trained 5 different LoRA adapters for 5 different enterprise clients on the same 70B base model. How do you serve all 5 clients concurrently on a single GPU cluster without storing 5 copies of the 70B model in VRAM?' What is the architectural solution?",
      "options": [
        "Deploy 5 separate GPU clusters.",
        "Dynamic Multi-LoRA Serving (Base Model Sharing): Keep ONE copy of the 70B base model in GPU VRAM (140 GB). Store the 5 LoRA adapters as tiny files (50 MB each) in CPU memory. At request time, route requests through the shared base forward pass and apply the client's specific LoRA adapter dynamically using batched matrix multiplication (S-LoRA / Punica).",
        "Merge all 5 adapters into a single weight matrix.",
        "LoRA adapters cannot be served concurrently."
      ],
      "answerIdx": 1,
      "debrief": "Multi-LoRA serving frameworks (like S-LoRA or vLLM) load one base model into GPU memory and dynamically apply small client-specific LoRA adapters per request batch. This enables multi-tenant customization at negligible VRAM overhead."
    },
    "quests": [
      {
        "id": "ai-m2-d35-q1",
        "name": "Milestone 6 System Architecture Blueprint",
        "type": "concept",
        "desc": "Document data structures, gradient propagation paths, and memory footprints for the PEFT/LoRA Engine."
      },
      {
        "id": "ai-m2-d35-q2",
        "name": "Base Weight Immutability Verification Suite",
        "type": "detective",
        "desc": "Build an automated test suite verifying SHA-256 immutability of base weights across 100 training steps."
      },
      {
        "id": "ai-m2-d35-q3",
        "name": "Milestone 6 Core PEFT Implementation",
        "type": "mastery",
        "desc": "Deliver the complete TypeScript PEFT/LoRA training engine with forward/backward passes and adapter merging."
      },
      {
        "id": "ai-m2-d35-q4",
        "name": "Milestone 6 Viva Defense Gate",
        "type": "incident",
        "desc": "Defend the training convergence, gradient math, and multi-LoRA serving economics before the Principal ML Architect."
      }
    ]
  },

  # =========================================================================
  # BLOCK 8: MULTI-AGENT ORCHESTRATION & SWARM TOPOLOGIES (Days 36-40)
  # =========================================================================
  {
    "day": 36,
    "month": 2,
    "blockNum": 8,
    "title": "Multi-Agent Architectures: Router, Orchestrator-Workers & Hierarchical Topologies",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Distributed Agent Systems (Topologies & Delegation)",
    "spokenGoal": "Architect multi-agent systems: contrast single monolithic agents with specialized multi-agent swarms. Analyze the Router pattern (directing queries to domain agents), Orchestrator-Workers (a lead agent breaks goals into sub-tasks and dispatches to specialized workers), and Hierarchical Topologies. Understand context isolation, token economics, and error blast radius containment.",
    "conceptInvariant": "Context Isolation Invariant: Specialized sub-agents must execute in isolated context windows with domain-specific toolsets; sharing a single bloated context across multiple tasks causes token exhaustion, hallucinated tool confusion, and quadratic cost growth.",
    "failureMode": "Giving a single monolithic agent 50 different tools (database access, file operations, web browsing, email, calculations), causing the model to hallucinate tool arguments and pick the wrong tool 30% of the time due to tool definition distraction.",
    "tryItFriction": "Build an Orchestrator-Worker Multi-Agent System in TypeScript: an Orchestrator agent breaks a user research request into 3 parallel sub-tasks, dispatches each sub-task to an isolated Worker agent with specialized tools, and synthesizes the worker outputs into a cohesive final brief.",
    "socraticHints": [
      "Why does a team of 3 specialized small agents often outperform 1 massive agent with all tools?",
      "Specialized agents have compact, focused system prompts and only 2-3 tools, maximizing precision and minimizing tool selection errors!",
      "The orchestrator only sees the distilled answers, keeping its context clean and uncluttered."
    ],
    "situationalPuzzle": {
      "scenario": "A development team builds a code-review agent. Version 1 gives one agent access to GitHub PR tools, linter tools, security scanner tools, and test runner tools. Version 2 uses an Orchestrator that spawns a Security Agent, a Performance Agent, and a Style Agent in parallel, then merges their comments. Why does Version 2 find 40% more critical bugs?",
      "options": [
        "Version 2 uses more GPUs.",
        "Role Specialization & Cognitive Focus: Sub-agents operate with specialized system prompts tuned to specific vulnerability categories without cognitive interference from competing instructions. Parallel execution also reduces wall-clock review time by 65%.",
        "GitHub API blocks Version 1.",
        "Multiple agents automatically eliminate hallucinations."
      ],
      "answerIdx": 1,
      "debrief": "Prompting an LLM with too many competing objectives causes attention dilution. Dividing responsibilities across specialized agents allows each model to focus its attention budget on a single domain (e.g., security vs style), yielding higher thoroughness and precision."
    },
    "quests": [
      {
        "id": "ai-m2-d36-q1",
        "name": "Multi-Agent Topology Trade-Off Taxonomy",
        "type": "concept",
        "desc": "Compare Router, Network, Hierarchical, and Peer-to-Peer topologies across latency, token cost, and failure domains."
      },
      {
        "id": "ai-m2-d36-q2",
        "name": "Tool Confusion Rate Profiler",
        "type": "detective",
        "desc": "Measure tool selection error rates as tool count grows from 3 to 10 to 30 tools within a single prompt."
      },
      {
        "id": "ai-m2-d36-q3",
        "name": "TypeScript Orchestrator-Worker Dispatcher",
        "type": "mastery",
        "desc": "Implement an asynchronous multi-agent orchestrator in TypeScript with task decomposition and parallel worker execution."
      },
      {
        "id": "ai-m2-d36-q4",
        "name": "3 AM SRE: Cascading Failure in Multi-Agent Swarm",
        "type": "incident",
        "desc": "Resolve a production outage where a failing worker agent caused the orchestrator to lock in an infinite retry loop."
      }
    ]
  },
  {
    "day": 37,
    "month": 2,
    "blockNum": 8,
    "title": "Inter-Agent Communication: Structured Message Passing, Event Buses & Shared State",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Distributed Agent Messaging (Protocols & State Synchronization)",
    "spokenGoal": "Design inter-agent communication protocols: replace unstructured natural language babble between agents with structured message passing (typed JSON envelopes, actor model semantics). Implement asynchronous Event Buses (publish-subscribe topics for agents), handle message ordering, and synchronize shared blackboard state across distributed agent nodes.",
    "conceptInvariant": "Typed Message Envelope Invariant: Inter-agent messages must adhere to a strictly validated envelope schema containing senderId, recipientId, correlationId, intent, and structured payload; natural language chatter without typed contracts causes semantic drift.",
    "failureMode": "Allowing agents to communicate via free-form text, leading to misunderstandings where Agent B interprets Agent A's colloquial sarcasm as a literal command to delete a production resource.",
    "tryItFriction": "Build an Agent Message Bus in TypeScript: implement an Actor Model where agents register mailboxes, send strongly typed message envelopes with Zod validation, publish events to topics, and coordinate asynchronously using correlation IDs.",
    "socraticHints": [
      "Why is free-form conversational chat between AI agents an anti-pattern in production software?",
      "Because free-form text wastes tokens, has ambiguous semantics, cannot be verified by static types, and easily drifts into repetitive conversational pleasantries ('Thank you!', 'You are welcome!')!",
      "Use structured JSON envelopes with explicit action types and typed arguments."
    ],
    "situationalPuzzle": {
      "scenario": "In a customer claims swarm, Agent A (intake) publishes an event: 'NewClaimCreated'. Agent B (fraud detector) and Agent C (policy validator) both process the claim in parallel. When both approve, Agent D (payout) must trigger the refund. How does the event bus ensure Agent D only fires when BOTH B and C have approved?",
      "options": [
        "Agent D polls the database every 1 millisecond.",
        "Correlation ID & Aggregation Barrier (Scatter-Gather Join): The event bus routes messages using a correlationId. An Aggregation Barrier component tracks incoming approval events for correlationId. When both FRAUD_CLEARED and POLICY_VALIDATED events are received, it emits a synthesized CLAIM_READY event to Agent D.",
        "Agent B calls Agent D directly and ignores Agent C.",
        "AI agents cannot handle parallel workflows."
      ],
      "answerIdx": 1,
      "debrief": "Complex multi-agent workflows require standard distributed systems patterns. An Aggregation Barrier matches events on a shared correlationId and only triggers downstream agents when all prerequisite condition events have been successfully received."
    },
    "quests": [
      {
        "id": "ai-m2-d37-q1",
        "name": "Agent Actor Model Formal Specification",
        "type": "concept",
        "desc": "Specify formal actor model mechanics for AI agents: mailbox semantics, state mutability, and message envelopes."
      },
      {
        "id": "ai-m2-d37-q2",
        "name": "Semantic Message Drift Tracer",
        "type": "detective",
        "desc": "Track 100 inter-agent communication exchanges to measure information degradation between typed JSON vs free-form text."
      },
      {
        "id": "ai-m2-d37-q3",
        "name": "TypeScript Typed Agent Event Bus",
        "type": "mastery",
        "desc": "Build an in-memory event bus in TypeScript supporting publish/subscribe, correlation IDs, and aggregation barriers."
      },
      {
        "id": "ai-m2-d37-q4",
        "name": "3 AM SRE: Deadlock in Multi-Agent Circular Wait",
        "type": "incident",
        "desc": "Debug a production dead-lock where Agent A was waiting for Agent B, while Agent B was blocked waiting for Agent A."
      }
    ]
  },
  {
    "day": 38,
    "month": 2,
    "blockNum": 8,
    "title": "Multi-Agent Consensus, Debate & Voting Protocols: Majority Agreement & Self-Refinement",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Collaborative Reasoning (Multi-Agent Debate & Consensus)",
    "spokenGoal": "Harness multi-agent collective intelligence: implement Multi-Agent Debate protocols where multiple distinct agent personas (e.g., Optimist, Skeptic, Domain Specialist) cross-examine each other's reasoning trajectories. Understand convergence dynamics, implement Borda count and Condorcet voting mechanisms, and analyze how adversarial debate reduces factual hallucinations by 45%.",
    "conceptInvariant": "Adversarial Cross-Examination Invariant: An assertion that survives structured cross-examination by an adversarial critic agent has a statistically higher probability of factual correctness than an assertion produced by an unexamined single-agent trajectory.",
    "failureMode": "Running an unmoderated multi-agent debate loop where agents agree with each other sycophantically ('I completely agree with my colleague's brilliant point'), amplifying an initial hallucination into an accepted false conclusion.",
    "tryItFriction": "Implement a Multi-Agent Debate Protocol in TypeScript: run 3 independent agents on a complex medical or legal question, allow 2 rounds of rebuttal and cross-examination, and implement a Judge Agent that synthesizes the final verified consensus.",
    "socraticHints": [
      "How do you prevent sycophancy in multi-agent debate?",
      "Assign explicit adversarial personas! Instruct Agent B specifically: 'Your job is to identify flaws, missing assumptions, and calculation errors in Agent A's proposal.'",
      "Adversarial tension forces models to substantiate their claims with hard evidence."
    ],
    "situationalPuzzle": {
      "scenario": "A financial fraud detection swarm uses 5 diverse LLM agents to review flagged transactions. For a suspicious transaction, 3 agents vote 'Legitimate' and 2 agents vote 'Fraudulent'. The lead investigator notices the 2 dissenting agents identified an obscure shell company pattern. What voting protocol should be used instead of simple majority?",
      "options": [
        "Ignore the dissenting agents because 3 > 2.",
        "Weighted Risk-Asymmetric Voting & Veto Protocol: In fraud and security, the cost of a false negative (missing a fraudster) is vastly higher than a false positive. Any agent presenting high-confidence forensic evidence should trigger an escalation veto or require unanimous supermajority for automated clearance.",
        "Run the vote 100 times until all agree.",
        "Flip a coin to break the tie."
      ],
      "answerIdx": 1,
      "debrief": "Simple majority voting is dangerous in risk-asymmetric domains. High-risk decisions should employ veto mechanisms, weighted Borda counts, or confidence-thresholded rules where substantiated forensic evidence from a minority agent triggers human review."
    },
    "quests": [
      {
        "id": "ai-m2-d38-q1",
        "name": "Social Choice Theory & Voting Math in AI",
        "type": "concept",
        "desc": "Analyze Condorcet paradoxes, Arrow's impossibility theorem, and Borda voting applied to multi-agent consensus."
      },
      {
        "id": "ai-m2-d38-q2",
        "name": "Sycophancy & Groupthink Vulnerability Auditor",
        "type": "detective",
        "desc": "Measure how prompt framing alters agreement rates across agents in collaborative decision-making."
      },
      {
        "id": "ai-m2-d38-q3",
        "name": "TypeScript Multi-Agent Debate & Judge Engine",
        "type": "mastery",
        "desc": "Build an end-to-end multi-agent debate system in TypeScript with rebuttal rounds and judge synthesis."
      },
      {
        "id": "ai-m2-d38-q4",
        "name": "3 AM SRE: Runaway Debate Loop Token Burn",
        "type": "incident",
        "desc": "Remediate a production billing emergency where two debating agents argued back and forth for 80 iterations."
      }
    ]
  },
  {
    "day": 39,
    "month": 2,
    "blockNum": 8,
    "title": "Distributed Task Queues for Long-Running Agents: BullMQ, Redis & Durable State Machines",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Production Infrastructure (Durable Agent Execution)",
    "spokenGoal": "Scale agent workloads to production: decouple agent execution from HTTP request-response cycles. Implement distributed task queues using Redis and BullMQ, persist agent state checkpoints to disk at every step, support resume-on-failure after server crashes, handle human-in-the-loop wait states spanning days, and implement exponential backoff with dead-letter queues.",
    "conceptInvariant": "Durable Step Checkpointing Invariant: An agent's complete execution state (conversation history, tool observations, step index, pending goals) must be persisted to a durable store after every step; a worker crash must allow another worker to resume execution with zero lost progress.",
    "failureMode": "Running long-running multi-step agents in ephemeral Node.js memory, causing a Kubernetes pod restart to terminate 200 in-flight 5-minute agent workflows, leaving client tasks permanently stranded.",
    "tryItFriction": "Build a Durable Agent Task Queue in TypeScript: queue long-running agent tasks in Redis, checkpoint state after each thought/action step, simulate worker pod termination (SIGKILL), and verify that a newly spawned worker recovers state and finishes the task.",
    "socraticHints": [
      "Why can't a 10-step agent run inside a standard Express HTTP request handler?",
      "Because HTTP requests time out after 30-60 seconds, and if the client loses connection or the pod restarts, the entire in-memory execution is lost!",
      "Accept the request with 202 Accepted, push a job to BullMQ, and stream updates over WebSockets/polling."
    ],
    "situationalPuzzle": {
      "scenario": "An agent executes a multi-step data migration. At step 4, the agent executes an external API call to charge a customer $50. Immediately following the charge, the worker container crashes before saving its checkpoint. When the new worker restarts, it replays step 4 and charges the customer again ($100). What distributed systems pattern was missing?",
      "options": [
        "Increase worker memory from 2GB to 8GB.",
        "Idempotency Keys & Two-Phase Action Checkpointing: External side-effecting actions must submit a unique deterministic idempotency key (derived from taskId + stepIndex) to external APIs. Furthermore, the intent to execute must be recorded before dispatch so recovery logic does not duplicate uncommitted side effects.",
        "Disable automated worker restarts.",
        "Payments should never be handled by AI."
      ],
      "answerIdx": 1,
      "debrief": "Durable execution requires idempotency. Without idempotency keys, replaying a failed or interrupted step will duplicate external side effects (like payments or emails). Passing taskId-stepIndex ensures the external service rejects duplicate operations."
    },
    "quests": [
      {
        "id": "ai-m2-d39-q1",
        "name": "Durable Execution State Machine Proof",
        "type": "concept",
        "desc": "Prove state consistency and exactly-once execution invariants under arbitrary worker fail-stop crashes."
      },
      {
        "id": "ai-m2-d39-q2",
        "name": "Worker Crash Recovery Simulator",
        "type": "detective",
        "desc": "Inject random SIGKILL signals during agent execution to verify that 100% of jobs recover without state duplication."
      },
      {
        "id": "ai-m2-d39-q3",
        "name": "BullMQ Distributed Agent Job Engine",
        "type": "mastery",
        "desc": "Build a production TypeScript agent worker system on Redis and BullMQ with state checkpointing."
      },
      {
        "id": "ai-m2-d39-q4",
        "name": "3 AM SRE: Zombie Agent Job Accumulation in Redis",
        "type": "incident",
        "desc": "Clean up an operational crisis where 10,000 stalled agent jobs accumulated in Redis due to unhandled promise rejections."
      }
    ]
  },
  {
    "day": 40,
    "month": 2,
    "blockNum": 8,
    "title": "Milestone 7: Multi-Agent Consensus & Hierarchical Swarm Engine",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Architectural Synthesis (Milestone Gate 7)",
    "spokenGoal": "Synthesize distributed multi-agent systems: build an enterprise Multi-Agent Consensus & Hierarchical Swarm Engine in TypeScript. Deliver an Orchestrator that breaks complex research and analysis tasks into sub-problems, dispatches to domain-specialized Worker agents across an asynchronous BullMQ queue, moderates structured inter-agent debate with cross-examination, and enforces durable Redis checkpointing with recovery.",
    "conceptInvariant": "Swarm Convergence Invariant: A multi-agent swarm must guarantee deterministic termination; regardless of conflicting worker outputs, the consensus debate protocol must converge on a synthesized, validated conclusion within a bounded number of communication rounds.",
    "failureMode": "Deploying an unmonitored swarm where worker agents spawn child agents recursively without a global depth limit, causing an exponential process fork bomb that exhausts all database connections.",
    "tryItFriction": "Execute the Milestone 7 benchmark: submit a complex multi-domain task (e.g., 'Analyze competitor pricing, evaluate legal risks, and generate an executive memo'), verify that 3 specialized workers execute in parallel, cross-examine findings in a structured debate, and deliver a coherent final report in under 30 seconds.",
    "socraticHints": [
      "How do you enforce a maximum agent recursion depth?",
      "Pass a context metadata object containing depth: current_depth. If depth >= max_depth (e.g., 2), disallow spawning new child agents and force direct execution!",
      "This prevents runaway agent fork bombs."
    ],
    "situationalPuzzle": {
      "scenario": "During an enterprise architecture review, a client asks: 'If one of your specialized worker agents encounters a persistent network outage, does the entire multi-agent swarm halt and fail the client's request?' How does your engine respond?",
      "options": [
        "Yes, all agents fail together.",
        "Partial Degradation & Graceful Fallback: The Orchestrator enforces timeout budgets per worker. If a worker fails or times out, the Aggregation Barrier marks that section as 'temporarily unavailable', synthesizes the remaining high-confidence findings from healthy workers, and highlights the partial degradation in the final report.",
        "The orchestrator waits indefinitely for the worker to recover.",
        "The worker restarts the entire server."
      ],
      "answerIdx": 1,
      "debrief": "Enterprise swarms must be resilient to partial worker failure. Timeouts and fallback policies ensure that if a non-critical worker (e.g., social media sentiment agent) fails, the remaining workers (e.g., financial analysis agents) complete their synthesis gracefully."
    },
    "quests": [
      {
        "id": "ai-m2-d40-q1",
        "name": "Milestone 7 Architecture Specification",
        "type": "concept",
        "desc": "Document the complete system architecture, actor protocols, and failure recovery procedures for the Swarm Engine."
      },
      {
        "id": "ai-m2-d40-q2",
        "name": "Swarm Deadlock & Fork Bomb Stress Test",
        "type": "detective",
        "desc": "Subject the swarm to 100 concurrent tasks with simulated network partitions and worker failures."
      },
      {
        "id": "ai-m2-d40-q3",
        "name": "Milestone 7 Core Swarm Implementation",
        "type": "mastery",
        "desc": "Deliver the production TypeScript Multi-Agent Consensus Swarm Engine with BullMQ queues and debate consensus."
      },
      {
        "id": "ai-m2-d40-q4",
        "name": "Milestone 7 Viva Defense Gate",
        "type": "incident",
        "desc": "Defend the swarm coordination protocols, fault tolerance, and token economics before the AI Directorate."
      }
    ]
  },

  # =========================================================================
  # BLOCK 9: HIGH-THROUGHPUT LLM SERVING & SPECULATIVE DECODING (Days 41-45)
  # =========================================================================
  {
    "day": 41,
    "month": 2,
    "blockNum": 9,
    "title": "LLM Serving Physics: Continuous Batching, Dynamic Cell Allocation & Cellular Memory",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Serving Infrastructure (Batching Physics & Memory Cell Management)",
    "spokenGoal": "Analyze high-throughput LLM serving: understand why static batching (waiting for all requests to finish generating before starting new ones) wastes up to 70% of GPU compute due to output length variance. Master Continuous (Iteration-Level) Batching (Orca architecture), where finished sequences are evicted and newly arriving requests are injected at every decoding iteration.",
    "conceptInvariant": "Iteration-Level Scheduling Invariant: In continuous batching, the inference scheduler executes one forward pass per iteration over all currently active sequences; sequences that emit an EOS token are evicted immediately, and queued requests enter the batch with zero pipeline bubble delay.",
    "failureMode": "Deploying an LLM inference service using naive static batching with batch size 16, where one long request generating 1,000 tokens forces 15 short requests (generating 20 tokens) to remain locked in GPU memory idling for 30 seconds.",
    "tryItFriction": "Build a Continuous Batching Scheduler simulator in TypeScript: maintain an active batch queue of requests with varying prompt lengths and max token limits, execute step-by-step decoding, evict completed requests upon EOS, and inject new requests without stalling.",
    "socraticHints": [
      "What is a 'pipeline bubble' in static GPU batching?",
      "When a batch of 8 requests finishes generating at different times, the GPU continues computing forward passes on the completed requests (masked out) while waiting for the single slowest request to finish!",
      "Continuous batching eliminates this bubble by replacing finished requests on the very next token iteration."
    ],
    "situationalPuzzle": {
      "scenario": "A company switches from static batching to continuous iteration-level batching on an H100 GPU server. Serving throughput jumps from 120 tokens/sec to 480 tokens/sec (a 4x gain). However, Time-To-First-Token (TTFT) for incoming requests occasionally spikes from 40ms to 900ms. What is causing the TTFT latency spike?",
      "options": [
        "The GPU fan stopped spinning.",
        "Prefill-Decode Interference: Computing the prefill (initial prompt attention) for a long new request requires massive compute FLOPs, which stalls the ongoing token-by-token generation (decode phase) of all existing requests in the batch unless Chunked Prefill is enabled.",
        "Continuous batching disables CUDA cores.",
        "The model weights were reloaded from disk."
      ],
      "answerIdx": 1,
      "debrief": "Prefill is compute-bound, while decoding is memory-bandwidth bound. Running a massive prefill forward pass in the same batch as active decoding steps causes a latency hiccup for generating tokens. Chunked Prefill solves this by splitting long prompts across multiple iterations."
    },
    "quests": [
      {
        "id": "ai-m2-d41-q1",
        "name": "Continuous Batching Throughput Speedup Proof",
        "type": "concept",
        "desc": "Prove mathematically why continuous batching throughput scales inversely with sequence length variance."
      },
      {
        "id": "ai-m2-d41-q2",
        "name": "Static vs Continuous Batching Efficiency Profiler",
        "type": "detective",
        "desc": "Benchmark GPU FLOP utilization and memory bubble ratios across static vs continuous schedulers."
      },
      {
        "id": "ai-m2-d41-q3",
        "name": "TypeScript Continuous Batching Engine",
        "type": "mastery",
        "desc": "Implement a full continuous batching scheduler in TypeScript with dynamic request injection and EOS eviction."
      },
      {
        "id": "ai-m2-d41-q4",
        "name": "3 AM SRE: TTFT Latency Outage on Long Prompt Bursts",
        "type": "incident",
        "desc": "Mitigate a production serving incident where sudden bursts of 8k prompt requests starved interactive chat streams."
      }
    ]
  },
  {
    "day": 42,
    "month": 2,
    "blockNum": 9,
    "title": "PagedAttention (vLLM Architecture): Virtual Memory, Logical/Physical Blocks & Zero Waste",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Serving Infrastructure (Virtual Memory & Paged KV-Cache)",
    "spokenGoal": "Deconstruct the revolutionary vLLM architecture: understand why traditional serving wastes 60-80% of GPU memory on internal fragmentation (pre-allocating contiguous memory for max context length). Master PagedAttention: partitioning the KV cache into fixed-size physical memory blocks (e.g., 16 tokens), mapping non-contiguous physical blocks to logical tokens via block tables, and sharing memory blocks for parallel sampling.",
    "conceptInvariant": "Zero-Internal-Fragmentation Invariant: In PagedAttention, KV-cache memory is allocated dynamically in small, discrete physical blocks (e.g., 16 tokens per block); only the final block of an active sequence can suffer memory waste (<= 15 tokens), eliminating contiguous pre-allocation waste completely.",
    "failureMode": "Allocating static contiguous KV-cache arrays for every request sized to max_context_length (e.g., 4,096 tokens), allowing only 4 concurrent streams before GPU memory is exhausted even when requests only generate 50 tokens.",
    "tryItFriction": "Build a PagedAttention Block Manager in TypeScript: maintain a pool of free physical GPU blocks, allocate logical-to-physical block tables for incoming requests, append tokens dynamically, and implement Copy-on-Write (CoW) block sharing for parallel sampling.",
    "socraticHints": [
      "How is PagedAttention inspired by traditional operating system virtual memory?",
      "In operating systems, virtual memory maps logical pages to non-contiguous physical RAM frames. PagedAttention maps logical token positions to non-contiguous physical KV-cache blocks!",
      "This allows GPU memory to be used like flexible heap memory with zero wasted reservation buffers."
    ],
    "situationalPuzzle": {
      "scenario": "A user asks an LLM to generate 5 diverse creative continuations of a 1,000-token prompt using parallel sampling (n=5). In vanilla serving, this requires 5 separate KV-cache buffers (5 * 1000 tokens). How does PagedAttention handle this with nearly zero additional memory?",
      "options": [
        "It generates 1 answer and copies it 5 times.",
        "Copy-on-Write (CoW) Block Sharing: All 5 output streams share the exact same physical memory blocks for the initial 1,000 prompt tokens. Physical blocks are only duplicated and allocated when the individual generation streams diverge during autoregressive decoding, saving 80% of KV memory.",
        "It compresses all tokens into 1 byte.",
        "PagedAttention deletes the prompt tokens after generation begins."
      ],
      "answerIdx": 1,
      "debrief": "PagedAttention enables Copy-on-Write block sharing. Multiple sequences originating from the same prompt share the identical physical prompt blocks. New physical blocks are only allocated when a stream generates a unique new token, enabling massive throughput gains for parallel sampling."
    },
    "quests": [
      {
        "id": "ai-m2-d42-q1",
        "name": "PagedAttention Memory Efficiency Proof",
        "type": "concept",
        "desc": "Calculate theoretical memory waste: compare contiguous pre-allocation against block-based allocation with block size B=16."
      },
      {
        "id": "ai-m2-d42-q2",
        "name": "Block Fragmentation Analyzer",
        "type": "detective",
        "desc": "Profile physical block utilization across varying block sizes (B = 8, 16, 32, 64) under production workloads."
      },
      {
        "id": "ai-m2-d42-q3",
        "name": "TypeScript Paged Block Table Manager",
        "type": "mastery",
        "desc": "Implement a full virtual memory block manager in TypeScript with allocation, freeing, and Copy-on-Write fork semantics."
      },
      {
        "id": "ai-m2-d42-q4",
        "name": "3 AM SRE: GPU Block Pool Starvation Outage",
        "type": "incident",
        "desc": "Resolve a production serving outage where sudden traffic spikes exhausted the physical block pool, deadlocking the scheduler."
      }
    ]
  },
  {
    "day": 43,
    "month": 2,
    "blockNum": 9,
    "title": "Speculative Decoding: Small Drafter Models + Large Verifiers, Rejection Sampling & Speedup Proofs",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Serving Acceleration (Speculative Decoding & Verification)",
    "spokenGoal": "Break the memory-bandwidth speed barrier: master Speculative Decoding. Understand how a small, ultra-fast Drafter model (e.g., 1B model) speculatively proposes K tokens ahead in time, and a large Target model (e.g., 70B model) verifies all K tokens in parallel in a single forward pass using modified causal masks and Rejection Sampling, guaranteeing exact mathematical equivalence to sampling from the target model directly.",
    "conceptInvariant": "Exact Distribution Equivalence Invariant: In speculative decoding with modified rejection sampling, the probability distribution of accepted tokens is mathematically and provably identical to the true output distribution of the large target model; speculative decoding is lossless acceleration.",
    "failureMode": "Using naive greedy matching instead of rejection sampling in speculative decoding with temperature > 0, introducing subtle probability skew that degrades reasoning quality and creativity over long generations.",
    "tryItFriction": "Implement the Speculative Decoding Rejection Sampling algorithm in TypeScript: simulate drafting K tokens from a draft distribution q(x), verify against target distribution p(x) in a single step, accept token x with probability min(1, p(x) / q(x)), and resample from max(0, p(x) - q(x)) upon rejection.",
    "socraticHints": [
      "Why can a large target model verify K tokens in ONE forward pass when it can only generate 1 token per forward pass normally?",
      "Because verifying K tokens is parallel compute (like prefill)! Computing attention over K already-proposed tokens uses the parallel matrix cores of the GPU without autoregressive sequential waiting!",
      "If the drafter predicts 4 tokens accurately, the target model gets 4 tokens for the latency cost of 1 forward pass."
    ],
    "situationalPuzzle": {
      "scenario": "A team deploys speculative decoding using a 70B target model and a 1B drafter model on a code generation service. The average acceptance rate is 82%, achieving a 2.8x wall-clock generation speedup. However, on creative writing prompts, the acceptance rate drops to 34%, and generation becomes SLOWER than standard inference (0.85x). Why did speedup collapse?",
      "options": [
        "The GPU ran out of power.",
        "Drafter Speculation Overhead Collapse: In highly stochastic creative writing with high temperature, target token distributions have high entropy. When acceptance rate drops below ~40%, the latency of the rejected drafting steps plus target verification exceeds the time of simply generating from the target model directly.",
        "The 1B model cannot generate English.",
        "Speculative decoding only works on math problems."
      ],
      "answerIdx": 1,
      "debrief": "Speculative decoding delivers massive speedups (2x to 3x) when the draft model accurately predicts target tokens (code, structured data, deterministic answers). When target entropy is high and acceptance drops below ~40%, the overhead of running the draft model hurts performance, requiring dynamic drafter bypassing."
    },
    "quests": [
      {
        "id": "ai-m2-d43-q1",
        "name": "Leviathan Rejection Sampling Proof",
        "type": "concept",
        "desc": "Prove the mathematical theorem demonstrating exact distribution preservation in speculative rejection sampling."
      },
      {
        "id": "ai-m2-d43-q2",
        "name": "Acceptance Rate vs Speedup Frontier Tracer",
        "type": "detective",
        "desc": "Calculate the critical acceptance rate alpha_min where speculative decoding transitions from acceleration to slowdown."
      },
      {
        "id": "ai-m2-d43-q3",
        "name": "TypeScript Speculative Decoding Engine",
        "type": "mastery",
        "desc": "Implement a full speculative decoding verification loop in TypeScript with draft proposal and rejection sampling."
      },
      {
        "id": "ai-m2-d43-q4",
        "name": "3 AM SRE: Drafter Desynchronization Outage",
        "type": "incident",
        "desc": "Diagnose an outage where a mismatch in tokenizer vocabularies between drafter and verifier caused infinite assertion loops."
      }
    ]
  },
  {
    "day": 44,
    "month": 2,
    "blockNum": 9,
    "title": "Model Parallelism: Tensor Parallelism (Megatron-LM), Pipeline Parallelism & Communications",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Distributed GPU Infrastructure (Tensor & Pipeline Parallelism)",
    "spokenGoal": "Scale models beyond single GPU limits: dissect Tensor Parallelism (Megatron-LM column and row parallel linear layers with All-Reduce operations across high-speed NVLink), contrast with Pipeline Parallelism (splitting model layers across GPU stages with micro-batch schedules like 1F1B to minimize pipeline bubble overhead), and evaluate communication costs.",
    "conceptInvariant": "Tensor Parallel All-Reduce Invariant: In Megatron-LM, the attention projection splits QKV columns across GPUs with no communication, and the output projection splits rows with an All-Reduce sum; each Transformer layer requires exactly two All-Reduce communication barriers in the forward pass.",
    "failureMode": "Deploying Tensor Parallelism across GPUs connected via standard PCIe or Ethernet instead of high-speed NVLink (900 GB/s), causing GPU compute cores to spend 85% of their time waiting for All-Reduce communication sync barriers.",
    "tryItFriction": "Build a Tensor Parallel Matrix Simulator in TypeScript: partition a 4096-dim weight matrix across 4 simulated GPU workers using column and row splits, execute local matrix multiplications in parallel, and simulate the All-Reduce sum collective operation.",
    "socraticHints": [
      "Why is Tensor Parallelism strictly confined to GPUs inside a single server node (NVLink)?",
      "Because Tensor Parallelism executes an All-Reduce collective operation TWICE per transformer layer! At 80 layers, that's 160 network sync barriers per generated token, which requires the massive 900 GB/s bandwidth of NVLink!",
      "For cross-node distribution, use Pipeline Parallelism or Data Parallelism."
    ],
    "situationalPuzzle": {
      "scenario": "A 70B model is deployed across 8 GPUs using Tensor Parallelism (TP=8). Profiling reveals that P99 token latency is 80ms, but total GPU compute utilization is only 18%. Telemetry shows that 65ms of every iteration is spent in ncclAllReduce. What hardware or topology defect explains this?",
      "options": [
        "The model weights were corrupted.",
        "Cross-NUMA / Non-NVLink Interconnect Bottleneck: The 8 GPUs are placed on a PCIe bus without NVLink bridges, or cross a NUMA node boundary. Transferring 70B layer activation tensors over PCIe (32 GB/s) rather than NVLink (900 GB/s) creates an overwhelming communication bottleneck.",
        "The temperature parameter was set too low.",
        "All-Reduce only works on 4 GPUs."
      ],
      "answerIdx": 1,
      "debrief": "Tensor Parallelism requires frequent, low-latency all-reduce operations on every single layer. Without NVLink, PCIe or Ethernet bandwidth quickly saturates, leaving tensor cores idle while waiting for collective communication barriers."
    },
    "quests": [
      {
        "id": "ai-m2-d44-q1",
        "name": "Megatron-LM Column-Row Factorization Math",
        "type": "concept",
        "desc": "Derive the mathematical proof showing why column-parallel followed by row-parallel linear layers requires only 1 All-Reduce."
      },
      {
        "id": "ai-m2-d44-q2",
        "name": "Pipeline Parallel Bubble Ratio Calculator",
        "type": "detective",
        "desc": "Calculate the bubble fraction F = (p - 1) / (m + p - 1) across pipeline stages p and micro-batches m in 1F1B scheduling."
      },
      {
        "id": "ai-m2-d44-q3",
        "name": "TypeScript Multi-GPU Collective Simulator",
        "type": "mastery",
        "desc": "Implement simulated All-Reduce, All-Gather, and Scatter collectives in TypeScript for multi-worker simulation."
      },
      {
        "id": "ai-m2-d44-q4",
        "name": "3 AM SRE: NCCL Watchdog Timeout in Distributed Cluster",
        "type": "incident",
        "desc": "Diagnose an NCCL communication deadlock where one lagging GPU caused the entire 64-GPU cluster to crash."
      }
    ]
  },
  {
    "day": 45,
    "month": 2,
    "blockNum": 9,
    "title": "Milestone 8: High-Throughput PagedAttention Serving Engine",
    "stageName": "Stage 4: Autonomous Production Readiness",
    "stageNum": 4,
    "pedagogicalRole": "Architectural Synthesis (Milestone Gate 8)",
    "spokenGoal": "Synthesize high-throughput LLM serving: build a production-grade High-Throughput Serving Engine in TypeScript. Implement continuous iteration-level batching, a virtual memory PagedAttention block manager with non-contiguous physical blocks, a speculative decoding verification loop with a simulated drafter model, and dynamic request scheduling handling 100 concurrent streams.",
    "conceptInvariant": "Serving Throughput Maximization Invariant: The serving engine must maximize GPU token generation throughput by combining zero-waste PagedAttention memory management with continuous iteration batching and speculative decoding verification.",
    "failureMode": "Failing to release physical KV-cache blocks back to the free pool when a client disconnects mid-stream, leaking GPU memory blocks until the server enters permanent allocation deadlock.",
    "tryItFriction": "Execute the Milestone 8 benchmark: simulate 100 concurrent requests with randomized prompt lengths (50 to 500 tokens) and target lengths (20 to 200 tokens), verify that 100% of memory blocks are safely recycled, and demonstrate a > 3x throughput gain over static batching.",
    "socraticHints": [
      "How do you ensure zero memory leaks in your PagedAttention block pool?",
      "Wrap request completion and cancellation in a strict try/finally block: when a sequence finishes or throws, call blockManager.free(seq.logicalBlocks) immediately!",
      "Assert that active_blocks == 0 when all requests finish."
    ],
    "situationalPuzzle": {
      "scenario": "During the Milestone 8 architecture review, an engineer proposes using a physical block size of B=1 token in PagedAttention to achieve 'zero internal fragmentation'. Why does the Principal Architect reject this proposal?",
      "options": [
        "1 token cannot be stored in RAM.",
        "Block Table Overhead & Kernel Launch Overhead: A block size of B=1 eliminates fragmentation but explodes block table metadata size by 16x. Worse, reading 1 token per block fragments GPU memory access into millions of tiny non-coalesced memory transactions, destroying GPU memory bandwidth efficiency.",
        "Block size 1 violates PyTorch licensing.",
        "The compiler cannot optimize odd block sizes."
      ],
      "answerIdx": 1,
      "debrief": "Block size selection is an engineering trade-off: larger blocks (16-32) sacrifice a few tokens of memory at the tail of sequences, but enable high-throughput coalesced memory reads on GPU tensor cores. Block size B=1 destroys memory bandwidth."
    },
    "quests": [
      {
        "id": "ai-m2-d45-q1",
        "name": "Milestone 8 Architecture Specification",
        "type": "concept",
        "desc": "Document the complete architecture, memory allocator state machine, and scheduling loop for the Paged Serving Engine."
      },
      {
        "id": "ai-m2-d45-q2",
        "name": "Continuous Batching Concurrency Stress Harness",
        "type": "detective",
        "desc": "Stress test the engine with 200 rapid bursts of concurrent requests to verify zero block pool memory leaks."
      },
      {
        "id": "ai-m2-d45-q3",
        "name": "Milestone 8 Core Serving Implementation",
        "type": "mastery",
        "desc": "Deliver the complete TypeScript High-Throughput Serving Engine with PagedAttention and speculative decoding."
      },
      {
        "id": "ai-m2-d45-q4",
        "name": "Milestone 8 Viva Defense Gate",
        "type": "incident",
        "desc": "Defend the serving throughput benchmarks, speculative acceleration metrics, and memory bounds before the AI Review Board."
      }
    ]
  }
]
