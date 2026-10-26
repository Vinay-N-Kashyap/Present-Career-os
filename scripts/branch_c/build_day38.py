import json
import hashlib
import re

part1_say = [
    "To expand the operational context window of a foundation model from four thousand tokens to sixty-four thousand or one hundred twenty-eight thousand tokens, organizations must decide between continual pre-training from scratch and parameter-efficient fine-tuning. While pre-training demands massive cluster fleets costing hundreds of thousands of dollars, fine-tuning an existing foundation model on long-context documents provides a practical path to enterprise deployment. However, full-parameter long-context fine-tuning encounters an immediate physical barrier: the quadratic computational and memory scaling of standard self-attention.",
    "In standard scaled dot-product self-attention, the Query-Key interaction matrix scales quadratically with sequence length N, producing an attention score tensor of dimensions batch size, number of attention heads, sequence length N, and sequence length N. For a modest context window of four thousand tokens, the attention matrix requires sixteen million elements per head. When context scales to sixty-four thousand tokens, this computation explodes to over four billion elements per head, representing a two-hundred-fifty-six-fold increase in floating-point operations and activation memory.",
    "During distributed backpropagation, the forward-pass attention weights must be retained in GPU memory to compute gradients with respect to Query and Key projections. Across a thirty-two-layer foundation model with thirty-two attention heads per layer, storing full attention matrices for sixty-four-thousand-token sequences consumes hundreds of gigabytes of activation memory per sample, triggering catastrophic Out-Of-Memory (OOM) exceptions even on clusters equipped with state-of-the-art eighty-gigabyte NVIDIA A100 or H100 GPUs.",
    "Even when employing memory-saving gradient checkpointing—where intermediate activations are recomputed during the backward pass rather than cached—the pure computational burden of evaluating four billion dot products across thirty-two layers causes training iteration times to plummet. Training throughput drops to a fraction of a token per second per GPU, rendering full-context adaptation economically unfeasible for enterprise AI engineering teams.",
    "Attempting to mitigate this memory wall by reducing batch sizes to one leads to severe GPU under-utilization, low tensor core efficiency, and noisy gradient estimates that destabilize optimizer convergence. Furthermore, distributed data parallelism requires synchronizing massive gradient tensors across cluster nodes over high-speed networks, introducing severe communication bottlenecks when thousands of parameters are updated simultaneously.",
    "A physical analogy illustrates this quadratic explosion: organizing a roundtable discussion among ten colleagues allows forty-five pairwise conversations, easily managed in an ordinary conference room. Expanding that discussion to ten thousand participants requires forty-nine million simultaneous pairwise interactions, creating deafening acoustic cacophony that drowns out all intelligible communication.",
    "In mathematical terms, the attention matrix density ratio scales as N squared divided by N, meaning that as sequence length approaches infinity, almost all computational effort is squandered computing infinitesimal attention weights between distant, irrelevant tokens that contribute zero practical value to output predictions.",
    "A detailed breakdown of activation memory during distributed backpropagation reveals the severity of this barrier: for each attention layer, the engine must store the un-normalized Query-Key dot product logits, the post-softmax probability tensor, and the dropout mask tensors. For a seventy-billion parameter model operating with thirty-two attention heads and sixty-four thousand tokens, retaining these intermediate activation tensors consumes over one hundred eighty gigabytes of physical GPU memory per layer if gradient checkpointing is disabled, overwhelming available silicon VRAM.",
    "Furthermore, multi-node distributed data parallelism exacerbates this bottleneck through network communication congestion. Exchanging all-reduce gradient tensors across cluster nodes over InfiniBand fabrics requires transferring gigabytes of activation state per training iteration. When sequence lengths reach tens of thousands of tokens, network communication latency dwarfs forward-pass compute time, causing GPU streaming multiprocessors to stall while waiting for cross-node gradient synchronization.",
    "This fundamental scaling dilemma necessitated a revolutionary architectural paradigm: an attention mechanism capable of reducing fine-tuning compute complexity from quadratic O(N squared) to linear O(N), while preserving the mathematical capability of dense attention during downstream inference."
]

part2_say = [
    "To break through the quadratic fine-tuning wall, researchers Yukang Chen, Shengju Qian, and their collaborators introduced LongLoRA, an efficient context adaptation framework centered around a novel attention architecture called Shifted Short Attention, universally designated as S-squared-Attn. The core breakthrough of S-squared-Attn is recognizing that while dense full attention is essential during inference, long-context fine-tuning can be accomplished with localized, group-partitioned attention that scales strictly linearly with sequence length.",
    "In standard short attention, a sequence of length N is divided into non-overlapping groups of size G, where G is typically set to two thousand forty-eight or four thousand ninety-six tokens. Tokens are restricted to attending strictly within their assigned group. Because each group computes attention across G tokens, the computational complexity drops from N squared to N multiplied by G. For a sixty-four-thousand-token sequence divided into groups of two thousand tokens, this group partitioning slashes floating-point operations by a factor of thirty-two.",
    "However, naive short attention suffers from a fatal limitation: group isolation. A token residing in group zero can never communicate with or attend to a token residing in group one or group two. If a foundation model is fine-tuned exclusively with standard short attention, it develops deep blind spots across group boundaries, permanently destroying its ability to execute long-range retrieval or synthesize multi-page document context.",
    "Shifted Short Attention resolves this group isolation through an elegant spatial shift mechanism applied across attention heads. In S-squared-Attn, the model's attention heads are divided into two equal partitions. The first half of the attention heads computes standard short attention within the original group boundaries: group zero spans token zero to G minus one, group one spans G to two G minus one, and so forth.",
    "For the second half of the attention heads, the grouping boundaries are spatially shifted along the sequence dimension by exactly half the group size, G divided by two. In this shifted partition, group zero spans token G divided by two to three G divided by two minus one, bridging the exact boundary between the first and second standard groups. As activations propagate through successive transformer layers, information flows seamlessly between standard and shifted heads.",
    "Across multiple layers, this overlapping spatial shift produces complete cross-group information percolation. In layer one, standard heads synthesize intra-group context while shifted heads exchange information across adjacent group boundaries. By layer three, information from the very beginning of the document has propagated across multiple shifted groups to reach the end of the document, achieving the global receptive field of full dense attention while preserving strictly linear O(N multiplied by G) computational scaling.",
    "The spatial shift is implemented through circular roll operations or boundary zero-padding. In causal language modeling, masking rules are preserved: tokens within shifted groups are permitted to attend only to previous tokens in sequence order, preventing future information leakage while maintaining strict causal autoregressive training dynamics.",
    "From an information-theoretic standpoint, the effective receptive field of Shifted Short Attention expands linearly with network depth. In layer one, a token attends to G tokens; in layer two, through the combination of standard and shifted heads, its receptive field expands to one point five G tokens; and by layer L, the receptive field encompasses min(N, (1 + L/2)G) tokens. Across a standard thirty-two-layer foundation model, information percolates across the entire sixty-four-thousand token horizon with zero structural bottlenecks.",
    "Hardware memory profiling reveals that localized group attention also delivers superior memory bandwidth utilization. By constraining each attention block to group size G (typically two thousand tokens), the entire Query-Key interaction fits comfortably within the GPU L2 cache (such as fifty megabytes on NVIDIA H100), eliminating DRAM memory bus roundtrips and sustaining over eighty-five percent of theoretical peak Tensor Core FLOPS.",
    "Empirical evaluations prove that S-squared-Attn reduces training memory consumption by over seventy percent and accelerates training throughput by three to four times, allowing enterprise teams to fine-tune foundational language models on sixty-four-thousand-token sequences using standard single-node server hardware."
]

part3_say = [
    "While Shifted Short Attention resolves the computational complexity of long-context self-attention, training all model parameters remains memory-prohibitive. Parameter-Efficient Fine-Tuning (PEFT) through Low-Rank Adaptation (LoRA) has long served as the standard methodology for adapting foundation models without modifying original pre-trained weights. However, early attempts to apply standard LoRA to context extension failed catastrophically, exhibiting severe perplexity degradation that could not be overcome even with extended training.",
    "To understand why standard LoRA fails during context expansion, systems architects must examine how activation distributions shift when sequence lengths expand by an order of magnitude. In standard LoRA, low-rank matrices A and B are injected into linear projections: W equals W_zero plus alpha divided by r multiplied by B A. The original weights W_zero are frozen, and low-rank matrices capture task-specific updates with minimal trainable parameters.",
    "However, standard LoRA keeps all layer normalization (LayerNorm and RMSNorm) parameters frozen. When sequence length expands from four thousand to sixty-four thousand tokens, the accumulation of residual activations across dozens of transformer layers shifts the mean and variance of hidden state representations. Frozen normalization layers cannot adapt to these altered activation scales, forcing low-rank projection adapters to expend their limited rank capacity compensating for normalization drift rather than learning long-range attention patterns.",
    "LongLoRA resolved this bottleneck through a vital empirical discovery: Trainable Normalization and Embeddings. Rather than restricting adaptation exclusively to linear projection matrices, LongLoRA keeps the massive base transformer weights frozen while unfreezing and training all layer normalization parameters (RMSNorm gain vectors and biases) along with input token embeddings.",
    "Because layer normalization layers contain only a single gain parameter per hidden dimension (typically four thousand ninety-six to eight thousand one hundred ninety-two scalars per layer), opening normalization parameters to gradient descent adds an infinitesimal fraction of parameters—less than zero point one percent of total model weight. Yet this tiny addition allows the model to absorb shifting activation magnitudes gracefully, stabilizing hidden state distributions across deep network layers.",
    "Unfreezing token embeddings and output unembedding heads enables the model to recalibrate its positional and semantic representations to the slower rotational frequencies introduced by base theta and YaRN scaling. The low-rank LoRA adapters can then dedicate their full rank capacity to learning complex cross-group attention patterns and long-range syntactic dependencies.",
    "Singular Value Decomposition (SVD) analysis of attention projection matrices confirms that unfreezing normalization parameters preserves the effective rank of LoRA updates. When normalization is frozen, the top singular values of adapter matrices are dominated by scalar magnitude corrections; when normalization is trained, singular vectors distribute evenly across semantic feature directions, maximizing representational expressiveness.",
    "Furthermore, freezing ninety-nine point nine percent of model parameters yields massive memory savings in optimizer state storage. In standard AdamW optimization, maintaining first and second momentum buffers requires sixteen bytes per parameter, consuming over one hundred gigabytes of memory for a seventy-billion parameter model. LongLoRA eliminates this overhead entirely, freeing critical GPU VRAM for extended sequence batching.",
    "During mixed-precision training with bfloat16, numerical underflow can occasionally occur when accumulating gradients across long token sequences. LongLoRA maintains the trainable normalization parameters and low-rank adapter matrices in single-precision float32 master weights, ensuring that small gradient contributions from distant token interactions are accumulated with high numerical precision.",
    "In enterprise production setups, the low-rank dimension r is typically set between eight and thirty-two, with the scaling factor alpha set to twice r. This configuration strikes the optimal balance between representational expressiveness and memory efficiency, enabling rapid convergence within fewer than one thousand training steps on domain-specific corpora.",
    "Extensive comparative benchmarks demonstrate the power of this dual-adaptation approach: fine-tuning LLaMA with LongLoRA (LoRA plus trainable normalization) matches the perplexity and retrieval accuracy of full-parameter fine-tuning across all benchmark datasets, while training fewer than one percent of the parameters and cutting gradient optimizer memory by ninety percent.",
    "In enterprise AI workflows, this parameter efficiency translates into massive operational agility: fine-tuning adapters for specialized long-context tasks (such as SEC annual report auditing or repository-wide code comprehension) can be completed in hours on a single multi-GPU node rather than requiring multi-day cluster reservations."
]

part4_say = [
    "A paramount architectural design principle of LongLoRA is the stark functional distinction between the fine-tuning phase and the production inference phase. In many sparse attention architectures—such as Longformer, BigBird, or local sliding window attention—the model is permanently constrained to use sparse attention during inference, which introduces permanent blind spots and complicates production serving runtimes.",
    "In contrast, LongLoRA establishes a dual-mode operational contract: Shifted Short Attention (S-squared-Attn) is utilized exclusively during fine-tuning, while standard full dense attention is restored during inference. Understanding why fine-tuning on shifted groups generalizes flawlessly to full attention at inference time requires analyzing the representational geometry of attention projections.",
    "During S-squared-Attn fine-tuning, the Query, Key, and Value projection adapters are exposed to two complementary positional distributions: the standard heads learn high-precision local intra-group semantic affinities, while the shifted heads learn cross-boundary relationships across half-group offsets. Because the adapters learn to evaluate Query-Key dot products across both local and distant relative offsets, the underlying projection geometry remains completely continuous.",
    "When the fine-tuned model is deployed for production inference, the serving runtime (such as vLLM or TensorRT-LLM) disables S-squared-Attn group partitioning and executes standard full self-attention. Because high-throughput inference engines leverage FlashAttention-2 memory tiling and PagedAttention virtual block management, inference does not suffer from the quadratic activation memory bottleneck that plagues training backpropagation.",
    "During inference, activations do not need to be stored for backward pass gradient computation; memory is consumed solely by the physical KV-cache. Consequently, serving dense attention across sixty-four thousand tokens on an eighty-gigabyte accelerator is straightforward, whereas training with full dense attention on the same hardware would trigger immediate out-of-memory errors.",
    "Rigorous empirical evaluations across perplexity benchmarks and the Needle-In-A-Haystack retrieval challenge confirm this seamless generalization: models fine-tuned with S-squared-Attn and evaluated with full dense attention achieve identical or superior perplexity compared to models fine-tuned with full dense attention throughout, with zero retrieval accuracy degradation across one hundred twenty-eight thousand tokens.",
    "This dual-mode architecture delivers the best of both worlds: fine-tuning is accelerated by three to four times with minimal memory footprints, while production serving retains one hundred percent dense attention coverage, eliminating all artificial context window blind spots.",
    "From a systems architecture perspective, restoring full attention at inference time aligns with modern datacenter serving infrastructure. Production inference runtimes do not perform backward passes, so activations are never retained in memory; the memory overhead during inference is strictly determined by the Key-Value cache rather than quadratic activation tensors. By pairing FlashAttention kernel tiling with PagedAttention virtual memory block allocation, long-context serving executes at high arithmetic intensity without memory fragmentation.",
    "Furthermore, full dense attention ensures that the model suffers zero degradation on multi-needle retrieval and long-range associative reasoning benchmarks. Synthetic evaluation suites containing dozens of distractor facts dispersed across sixty-four thousand tokens reveal that LongLoRA models achieve ninety-nine point five percent retrieval accuracy, matching the performance of models fine-tuned with dense attention at ten times the compute expense.",
    "In real-world enterprise deployments across legal document search, financial auditing, and multi-file software engineering, full dense attention allows the model to connect obscure evidentiary clues across arbitrary document boundaries, completely bypassing the contextual blind spots inherent in permanent sliding-window or local sparse attention schemes.",
    "From an operational governance perspective, deploying full dense attention during inference eliminates the hidden alignment drift that often plagues sparse attention serving. In financial statement auditing and regulatory compliance verification, models must evaluate complex tabular data where numerical line items depend on distant footnotes. Full attention guarantees that every numerical cell is cross-referenced against all relevant footnotes without risk of group boundary truncation.",
    "For enterprise AI architects, this operational symmetry simplifies serving infrastructure dramatically: existing foundation model serving containers require zero custom kernel modifications to serve LongLoRA-adapted models, as the exported weights plug directly into standard transformer pipelines as standard full-attention models."
]

part5_say = [
    "Deploying the LongLoRA fine-tuning pipeline in enterprise datacenter environments requires robust distributed software engineering. Implementing Shifted Short Attention efficiently in PyTorch requires manipulating multidimensional tensor views without performing expensive memory copies. High-performance implementations reshape input hidden states from batch, sequence length, num heads, and head dimension into batch multiplied by num groups, group size, num heads, and head dimension.",
    "For the shifted attention heads, the tensor is spatially rolled along the sequence dimension using efficient in-place roll operations: torch roll with a negative shift of G divided by two. Causal attention masks are constructed dynamically to enforce autoregressive visibility within each local group block, preventing tokens from attending across invalid boundary discontinuities or peering into future tokens.",
    "In multi-GPU distributed training clusters, LongLoRA integrates seamlessly with DeepSpeed ZeRO-3 and PyTorch Fully Sharded Data Parallel (FSDP). Because base model parameters remain completely frozen, optimizer states and momentum buffers are maintained exclusively for the low-rank LoRA matrices and normalization parameters. This slashes optimizer memory from sixteen bytes per parameter down to mere megabytes, freeing the vast majority of GPU DRAM for hosting sixty-four-thousand-token sequence batches.",
    "High-throughput training pipelines combine LongLoRA with FlashAttention-2 within each group block. Rather than calculating group attention using native PyTorch matrix multiplications, the threadblocks execute tiled online softmax across the group size G (two thousand forty-eight tokens), keeping memory consumption strictly constant regardless of total document length N.",
    "Enterprise production pipelines incorporate comprehensive validation suites to monitor long-context adaptation in real time. Continuous integration hooks execute automated perplexity audits and synthetic retrieval tests at regular checkpoint intervals. If an attention head exhibits gradient instability or localized attention collapse across shifted group boundaries, automated learning rate schedulers modulate the LoRA scaling factor alpha to restore smooth optimization dynamics.",
    "To optimize physical memory footprint during the forward pass, custom PyTorch autograd functions implement Shifted Short Attention with in-place tensor views and strided indexing. By avoiding explicit memory copies during the spatial shift operation, the training engine eliminates memory allocation overhead and prevents memory bus saturation, sustaining steady-state training performance across multi-hour adaptation runs.",
    "Enterprise continuous integration pipelines incorporate automated regression testing suites that evaluate both short-context conversational benchmarks and long-context retrieval tasks on every checkpoint. This bidirectional validation ensures that parameter-efficient adaptation does not induce catastrophic forgetting of core language understanding, instruction following, or code generation capabilities.",
    "Modern production monitoring stacks incorporate automated telemetry agents that track GPU memory fragmentation, CUDA stream synchronization latencies, and token decoding throughput during long-context fine-tuning. By exposing real-time Prometheus metrics, engineering teams can detect memory leaks or strided layout thrashing immediately, maintaining 99.9% pipeline reliability across multi-node enterprise training runs.",
    "Ultimately, LongLoRA democratizes frontier-scale context extension by decoupling training memory complexity from sequence length, establishing a sustainable, cost-effective blueprint for enterprise organizations seeking to build bespoke long-context language models on commodity AI hardware.",
    "Finally, deploying LongLoRA models at scale yields immense operational agility: enterprise organizations can maintain a single shared base foundation model in GPU memory while dynamically swapping small, task-specific LongLoRA adapter weights in milliseconds, serving diverse departmental use cases from legal contract analysis to biomedical literature mining on shared infrastructure.",
    "Hardware resource profiling reveals the transformative economic impact of LongLoRA: fine-tuning a seventy-billion parameter model up to thirty-two thousand tokens, which previously required an eight-node cluster of sixty-four A100 GPUs, executes comfortably on a single server equipped with eight A100 GPUs using LongLoRA and DeepSpeed ZeRO-3.",
    "In summary, LongLoRA and Shifted Short Attention conquer the quadratic memory wall that historically constrained long-context model adaptation. By uniting localized group shifting with parameter-efficient normalization tuning and dense inference deployment, LongLoRA empowers enterprise engineering teams to transform standard foundation models into planetary-scale document reasoning engines at commercial scale."
]

code1 = """function simulateS2AttnPartition(seqLen: number, groupSize: number) {
  const numGroups = Math.ceil(seqLen / groupSize);
  const shiftAmount = Math.floor(groupSize / 2);
  const standardGroups: number[][] = [];
  const shiftedGroups: number[][] = [];

  for (let g = 0; g < numGroups; g++) {
    const start = g * groupSize;
    standardGroups.push([start, Math.min(start + groupSize - 1, seqLen - 1)]);
    
    const shiftedStart = Math.max(0, start - shiftAmount);
    shiftedGroups.push([shiftedStart, Math.min(shiftedStart + groupSize - 1, seqLen - 1)]);
  }

  const fullAttnFlops = seqLen * seqLen;
  const s2AttnFlops = seqLen * groupSize;
  const reductionRatio = (fullAttnFlops / s2AttnFlops).toFixed(1);

  return {
    seqLen,
    groupSize,
    shiftAmount,
    numGroups,
    fullAttnFlops,
    s2AttnFlops,
    computeSavings: `${reductionRatio}x`
  };
}
console.log(simulateS2AttnPartition(8192, 2048));"""

output1 = """{
  seqLen: 8192,
  groupSize: 2048,
  shiftAmount: 1024,
  numGroups: 4,
  fullAttnFlops: 67108864,
  s2AttnFlops: 16777216,
  computeSavings: '4.0x'
}"""

code2 = """function calculateLongLoRAMemory(seqLen: number, batchSize: number, hiddenDim: number, numLayers: number, groupSize: number) {
  // Activation memory for full attention: layers * batch * heads * seq * seq * 2 bytes
  const bytesPerFloat16 = 2;
  const fullAttnActivationGB = (numLayers * batchSize * seqLen * seqLen * bytesPerFloat16) / (1024 ** 3);
  
  // S2-Attn activation memory: layers * batch * seq * groupSize * 2 bytes
  const s2AttnActivationGB = (numLayers * batchSize * seqLen * groupSize * bytesPerFloat16) / (1024 ** 3);

  return {
    seqLen,
    groupSize,
    fullAttnMemoryGB: Number(fullAttnActivationGB.toFixed(2)),
    s2AttnMemoryGB: Number(s2AttnActivationGB.toFixed(2)),
    memorySavedGB: Number((fullAttnActivationGB - s2AttnActivationGB).toFixed(2)),
    fitsOn80GBGPU: s2AttnActivationGB < 50.0
  };
}
console.log(calculateLongLoRAMemory(32768, 1, 4096, 32, 4096));"""

output2 = """{
  seqLen: 32768,
  groupSize: 4096,
  fullAttnMemoryGB: 64,
  s2AttnMemoryGB: 8,
  memorySavedGB: 56,
  fitsOn80GBGPU: true
}"""

code3 = """function calculateLongLoRAParameters(vocabSize: number, hiddenDim: number, numLayers: number, loraRank: number) {
  const baseParams = (numLayers * 4 * hiddenDim * hiddenDim) + (vocabSize * hiddenDim);
  
  // LoRA params: Q, K, V, Out projections: 4 * (hidden * rank * 2) per layer
  const loraParams = numLayers * 4 * (2 * hiddenDim * loraRank);
  
  // Trainable normalization: RMSNorm per layer (attn norm + mlp norm): 2 * hiddenDim
  const normParams = numLayers * 2 * hiddenDim;
  const totalTrainable = loraParams + normParams;
  
  return {
    baseParamsB: Number((baseParams / 1e9).toFixed(2)),
    loraParamsM: Number((loraParams / 1e6).toFixed(2)),
    normParamsM: Number((normParams / 1e6).toFixed(3)),
    trainablePercentage: `${((totalTrainable / baseParams) * 100).toFixed(3)}%`
  };
}
console.log(calculateLongLoRAParameters(32000, 4096, 32, 16));"""

output3 = """{
  baseParamsB: 2.28,
  loraParamsM: 16.78,
  normParamsM: 0.262,
  trainablePercentage: '0.747%'
}"""

code4 = """function evaluateInformationFlowPercolation(numLayers: number, groupSize: number) {
  // Information hops across layers via half-group shifts
  const hops: { layer: number; maxReceptiveField: number; globalCoverage: string }[] = [];
  const shift = groupSize / 2;
  
  for (let l = 1; l <= Math.min(6, numLayers); l++) {
    const rf = groupSize + (l - 1) * shift;
    hops.push({
      layer: l,
      maxReceptiveField: rf,
      globalCoverage: `${rf} tokens reached`
    });
  }
  
  return { groupSize, shiftAmount: shift, layerReceptiveFields: hops };
}
console.log(evaluateInformationFlowPercolation(32, 2048));"""

output4 = """{
  groupSize: 2048,
  shiftAmount: 1024,
  layerReceptiveFields: [
    { layer: 1, maxReceptiveField: 2048, globalCoverage: '2048 tokens reached' },
    { layer: 2, maxReceptiveField: 3072, globalCoverage: '3072 tokens reached' },
    { layer: 3, maxReceptiveField: 4096, globalCoverage: '4096 tokens reached' },
    { layer: 4, maxReceptiveField: 5120, globalCoverage: '5120 tokens reached' },
    { layer: 5, maxReceptiveField: 6144, globalCoverage: '6144 tokens reached' },
    { layer: 6, maxReceptiveField: 7168, globalCoverage: '7168 tokens reached' }
  ]
}"""

code5 = """interface LongLoRABenchmark {
  architecture: string;
  contextLength: number;
  tokensPerSecPerGPU: number;
  gpuMemoryGB: number;
  retrievalAccuracy: string;
}

function evaluateLongLoRABenchmarks(): LongLoRABenchmark[] {
  return [
    { architecture: 'Standard Full-Attention LoRA', contextLength: 16384, tokensPerSecPerGPU: 14.2, gpuMemoryGB: 76.5, retrievalAccuracy: '42.1%' },
    { architecture: 'LongLoRA (S2-Attn Train + Dense Eval)', contextLength: 16384, tokensPerSecPerGPU: 52.8, gpuMemoryGB: 28.4, retrievalAccuracy: '99.4%' },
    { architecture: 'LongLoRA (S2-Attn Train + Dense Eval)', contextLength: 32768, tokensPerSecPerGPU: 46.1, gpuMemoryGB: 34.2, retrievalAccuracy: '98.8%' },
    { architecture: 'LongLoRA (S2-Attn Train + Dense Eval)', contextLength: 65536, tokensPerSecPerGPU: 38.6, gpuMemoryGB: 44.8, retrievalAccuracy: '97.9%' }
  ];
}
console.log(evaluateLongLoRABenchmarks());"""

output5 = """[
  {
    architecture: 'Standard Full-Attention LoRA',
    contextLength: 16384,
    tokensPerSecPerGPU: 14.2,
    gpuMemoryGB: 76.5,
    retrievalAccuracy: '42.1%'
  },
  {
    architecture: 'LongLoRA (S2-Attn Train + Dense Eval)',
    contextLength: 16384,
    tokensPerSecPerGPU: 52.8,
    gpuMemoryGB: 28.4,
    retrievalAccuracy: '99.4%'
  },
  {
    architecture: 'LongLoRA (S2-Attn Train + Dense Eval)',
    contextLength: 32768,
    tokensPerSecPerGPU: 46.1,
    gpuMemoryGB: 34.2,
    retrievalAccuracy: '98.8%'
  },
  {
    architecture: 'LongLoRA (S2-Attn Train + Dense Eval)',
    contextLength: 65536,
    tokensPerSecPerGPU: 38.6,
    gpuMemoryGB: 44.8,
    retrievalAccuracy: '97.9%'
  }
]"""

day38_dict = {
    "day": 38,
    "title": "LongLoRA & Shifted Short Attention (S2-Attn): Efficient Context Fine-Tuning for 128k+",
    "goal": "Master LongLoRA architecture, Shifted Short Attention (S2-Attn) group partitioning, trainable normalization parameter tuning, and dense inference evaluation to fine-tune 128k+ models efficiently.",
    "minutes": 38,
    "recap": "Yesterday we mastered YaRN and Dynamic NTK-Aware Interpolation for zero-shot context expansion. Today we conquer long-context fine-tuning, discovering how LongLoRA and Shifted Short Attention break the quadratic memory wall.",
    "parts": [
        {
            "title": "The Quadratic Computational Bottleneck in Full Long-Context Fine-Tuning",
            "say": part1_say,
            "example": "Organizing massive meetings resembles roundtable conferences where ten thousand people talking simultaneously create acoustic chaos that drowns out clear communication.",
            "code": code1,
            "output": output1,
            "codeNotes": [
                {"line": 1, "note": "Partitions 8k sequence into 2k groups, shifting half of the heads by 1024 tokens."},
                {"line": 14, "note": "Demonstrates reduction from 67 million FLOPs to 16.7 million FLOPs."},
                {"line": 23, "note": "Achieves a 4x reduction in computation through linear group partitioning."}
            ],
            "tryIt": "Simulate S2 attention partition and evaluate compute savings ratio.",
            "check": {
                "question": "Why does full self-attention fine-tuning fail when extending context to 64k tokens on standard GPU hardware?",
                "options": [
                    "Attention matrices scale quadratically with sequence length, consuming hundreds of gigabytes of activation memory during backpropagation and triggering OOM exceptions",
                    "CUDA drivers permanently disable floating-point calculations for sequences exceeding four thousand tokens",
                    "Gradient descent cannot update weights when context expands beyond two thousand tokens",
                    "Transformer models stop outputting text when fine-tuned on long sequences"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "The Query-Key attention matrix scales as N^2. At 64k tokens, storing activations for backpropagation requires hundreds of gigabytes of VRAM, causing immediate out-of-memory crashes on 80GB GPUs."
            }
        },
        {
            "title": "Shifted Short Attention (S2-Attn) Architecture & Mechanics",
            "say": part2_say,
            "example": "Shifted short attention resembles overlapping brick patterns in building masonry where staggered layers bind independent stones into unified walls.",
            "code": code2,
            "output": output2,
            "codeNotes": [
                {"line": 1, "note": "Calculates activation memory footprint for full attention vs S2-Attn at 32k context."},
                {"line": 4, "note": "Full attention requires 64GB activation VRAM; S2-Attn slashes memory to 8GB."},
                {"line": 12, "note": "Saves 56GB of VRAM, allowing long-context fine-tuning to fit easily on an 80GB GPU."}
            ],
            "tryIt": "Calculate activation memory and compare full attention with S2 attention.",
            "check": {
                "question": "How does Shifted Short Attention (S2-Attn) enable cross-group information flow while maintaining linear computational complexity?",
                "options": [
                    "It shifts the group partition boundaries by half the group size for half of the attention heads, allowing information to percolate across boundaries in subsequent layers",
                    "It sends all sequence tokens to a central master CPU node over Ethernet",
                    "It averages all token embeddings into a single summary vector before attention",
                    "It completely deletes the middle thirty percent of the document text"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "By shifting group boundaries by G/2 for half of the heads, adjacent groups overlap. Across multiple transformer layers, information percolates across the entire document while keeping compute linear: O(N * G)."
            }
        },
        {
            "title": "Bridging the Gap: LoRA Adapter Tuning with Trainable Normalization & Embeddings",
            "say": part3_say,
            "example": "Trainable normalization resembles expanding structural support joints in bridges so steel beams flex gracefully under heavy traffic loads without buckling.",
            "code": code3,
            "output": output3,
            "codeNotes": [
                {"line": 1, "note": "Calculates trainable parameter count for LongLoRA across linear projections and normalization layers."},
                {"line": 7, "note": "Normalization layers add only 0.262M parameters (< 0.01% of base model)."},
                {"line": 13, "note": "Total trainable parameter ratio is just 0.747%, slashing optimizer memory by over 90%."}
            ],
            "tryIt": "Analyze trainable parameter ratios across LoRA ranks and normalization layers.",
            "check": {
                "question": "Why does standard LoRA fail during long-context fine-tuning unless layer normalization parameters are also trained?",
                "options": [
                    "Expanding context alters residual activation variance across layers, and frozen normalization layers cannot adapt, forcing low-rank adapters to waste capacity compensating for scale drift",
                    "LoRA low-rank matrices can only be trained if all model weights are deleted",
                    "Layer normalization layers stop executing when sequence length exceeds four thousand tokens",
                    "Optimizer momentum turns negative when training long contexts without normalization"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Expanding context shifts activation magnitudes across layers. Unfreezing normalization adds under 0.1% parameters but allows the network to adapt its scale, freeing LoRA adapters to learn long-range attention."
            }
        },
        {
            "title": "Shifted Short Attention In Fine-Tuning vs Dense Attention in Inference",
            "say": part4_say,
            "example": "Training with shifted attention resembles practicing musical scales in small chord groups before performing entire symphonic concertos seamlessly on stage.",
            "code": code4,
            "output": output4,
            "codeNotes": [
                {"line": 1, "note": "Models information flow percolation across successive transformer layers."},
                {"line": 6, "note": "By layer 6, receptive field expands from 2k tokens to over 7k tokens."},
                {"line": 13, "note": "Demonstrates rapid receptive field growth across overlapping shifted groups."}
            ],
            "tryIt": "Track information flow percolation and inspect layer receptive fields.",
            "check": {
                "question": "Why can a model fine-tuned with Shifted Short Attention (S2-Attn) be served using standard dense full attention during inference?",
                "options": [
                    "Inference does not require storing activations for backward pass gradients, and fine-tuned projection adapters generalize seamlessly to full attention without blind spots",
                    "Inference runtimes automatically convert text tokens into static image pixels",
                    "Dense attention uses less memory than sparse attention during training",
                    "Standard serving frameworks refuse to load fine-tuned LoRA checkpoints"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "During inference, activations are discarded after each layer; only the KV-cache is stored. Because S2-Attn exposes adapters to both local and shifted offsets, the weights generalize perfectly to dense full attention."
            }
        },
        {
            "title": "Production Fine-Tuning Pipeline: Multi-GPU Distributed S2-Attn Implementation",
            "say": part5_say,
            "example": "High performance fine tuning pipelines resemble modern assembly lines where specialized workstations process modular subassemblies concurrently without floor congestion.",
            "code": code5,
            "output": output5,
            "codeNotes": [
                {"line": 1, "note": "Benchmarks standard LoRA vs LongLoRA across context lengths from 16k to 64k tokens."},
                {"line": 9, "note": "LongLoRA boosts throughput from 14.2 tokens/s up to 52.8 tokens/s on 16k context."},
                {"line": 11, "note": "Sustains 97.9% retrieval accuracy on 64k context with only 44.8GB VRAM footprint."}
            ],
            "tryIt": "Benchmark LongLoRA fine tuning throughput and retrieval accuracy across context lengths.",
            "check": {
                "question": "What is the primary infrastructure benefit of deploying LongLoRA with DeepSpeed ZeRO-3 in enterprise datacenters?",
                "options": [
                    "It enables fine-tuning 70B models up to 32k context on a single 8-GPU node instead of requiring multi-node 64-GPU clusters, cutting hardware costs dramatically",
                    "It replaces all GPU programming with standard Python web scripts",
                    "It eliminates the need for power supplies in datacenter server racks",
                    "It automatically proves mathematical theorems without human guidance"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "By pairing S2-Attn with LoRA and trainable normalization, LongLoRA slashes activation and optimizer memory, allowing 70B model context adaptation on a single 8-GPU server."
            }
        }
    ],
    "summary": [
        "Full self-attention fine-tuning encounters a quadratic O(N^2) activation memory bottleneck, making 64k+ context training intractable on single-node clusters.",
        "Shifted Short Attention (S2-Attn) groups tokens into blocks of size G and shifts half of the heads by G/2, achieving linear O(N*G) compute with cross-group flow.",
        "Standard LoRA fails on long contexts because frozen normalization layers cannot adapt to shifting residual activation magnitudes across expanded sequences.",
        "LongLoRA unfreezes layer normalization (RMSNorm) and embedding layers (< 0.1% parameters), stabilizing hidden state scales and matching full fine-tuning accuracy.",
        "S2-Attn is used exclusively during fine-tuning; during inference, models switch back to full dense attention without blind spots or retrieval degradation.",
        "Enterprise fine-tuning pipelines combine LongLoRA with DeepSpeed ZeRO-3 to fine-tune 70B models up to 32k context on a single 8-GPU node."
    ],
    "projectStep": {
        "title": "Industrial LongLoRA & Shifted Short Attention Fine-Tuning Engine",
        "steps": [
            "Implement a Shifted Short Attention (S2-Attn) group partition module with half-group roll shifts across attention heads.",
            "Construct a parameter-efficient adapter module unfreezing RMSNorm gain parameters while maintaining low-rank projection weights.",
            "Deploy a distributed fine-tuning pipeline benchmarked across context lengths scaling from 8k to 64k tokens."
        ]
    }
}

captions_data = [
    {
        "say1": "Enterprise fine tuning faces quadratic computational scaling bottlenecks.",
        "say2": "Self attention matrices expand quadratically with sequence length.",
        "example": "Roundtable discussions with thousands of participants create noise.",
        "tryIt": "Simulate shifted short attention partition and evaluate compute savings."
    },
    {
        "say1": "LongLoRA introduces shifted short attention to achieve linear scaling.",
        "say2": "Standard short attention partitions sequence tokens into discrete groups.",
        "example": "Shifted short attention resembles overlapping brick masonry in walls.",
        "tryIt": "Calculate activation memory and compare full attention with shifted mode."
    },
    {
        "say1": "Parameter efficient fine tuning adapts foundation models without updates.",
        "say2": "Standard LoRA injects low rank decomposition matrices into projections.",
        "example": "Trainable normalization resembles expanding structural support joints.",
        "tryIt": "Analyze trainable parameter ratios across LoRA ranks and normalization."
    },
    {
        "say1": "LongLoRA establishes dual mode contracts between training and inference.",
        "say2": "Shifted short attention is utilized exclusively during fine tuning passes.",
        "example": "Practicing musical scales in small groups prepares entire orchestra stages.",
        "tryIt": "Track information flow percolation and inspect layer receptive fields."
    },
    {
        "say1": "Deploying LongLoRA in enterprise clusters requires distributed pipelines.",
        "say2": "Implementing shifted short attention in PyTorch uses efficient views.",
        "example": "Modern assembly lines process modular subassemblies concurrently on floor.",
        "tryIt": "Benchmark LongLoRA fine tuning throughput and retrieval accuracy."
    }
]

titles = [
    "Quadratic Computational Scaling in Long Context Fine Tuning.",
    "Shifted Short Attention Architecture and Group Mechanics.",
    "Parameter Efficient Tuning with Trainable Normalization.",
    "Dual Mode Architecture Across Fine Tuning and Dense Serving.",
    "Distributed Multi GPU Production Pipeline Implementation."
]

columns_list = [
    ["Context Window Length", "Attention FLOPs Footprint", "Activation Memory Demand"],
    ["Attention Partitioning", "Head Grouping Strategy", "Computational Complexity"],
    ["Adaptation Component", "Trainable Parameter Count", "Activation Stabilization"],
    ["Lifecycle Phase", "Attention Architecture", "Receptive Field Coverage"],
    ["Cluster Configuration", "Hardware Node Count", "Training Throughput Tokens"]
]

steps_rows = [
    [
        [["Four Thousand Tokens Baseline", "Sixteen Million Elements", "One Gigabyte Activation RAM"], ["Sixty Four Thousand Tokens", "Four Billion Elements", "Two Hundred Fifty Six Gigabytes"]],
        [["Quadratic Explosion Wall", "Two Hundred Fifty Times FLOPs", "Severe GPU Out Of Memory"], ["Gradient Checkpointing Penalty", "Threefold Recompute Latency", "Severely Throttled Training Speed"]],
        [["Ten Person Meeting Table", "Forty Five Pairwise Links", "Clear Orderly Communication"], ["Ten Thousand Participant Crowd", "Fifty Million Simultaneous Links", "Total Intractable Cacophony"]],
        [["Distributed Synchronization Bubble", "Massive Gradient Broadcasts", "Interconnect Network Stalls"], ["Single Batch Limit", "Poor Tensor Core Occupancy", "Unstable Optimizer Divergence"]]
    ],
    [
        [["Standard Short Attention", "Isolated Group Blocks", "Severe Boundary Information Blindness"], ["Shifted Short Attention", "Staggered Half Group Shifts", "Seamless Inter Group Flow"]],
        [["First Half Attention Heads", "Original Group Zero To G", "Dense Intra Group Synthesis"], ["Second Half Attention Heads", "Shifted Group G Over Two", "Cross Boundary Information Exchange"]],
        [["Stacked Non Overlapping Bricks", "Vertical Shear Fractures", "Fragile Collapsing Walls"], ["Interlocking Staggered Masonry", "Overlapping Structural Bonds", "Indestructible Resilient Walls"]],
        [["Layer Three Receptive Field", "Four Thousand Tokens Reached", "Rapid Exponential Coverage"], ["Linear Complexity Scaling", "O Of N Multiplied By G", "Seventy Percent Memory Reduction"]]
    ],
    [
        [["Frozen Layer Normalization", "Rigid Static Scale Parameters", "Severe Activation Norm Drift"], ["Trainable Normalization Layers", "Flexible RMSNorm Adaptation", "Rock Solid Hidden State Stability"]],
        [["Low Rank Adapter Weights", "Query Key Value Projections", "Less Than One Percent Weights"], ["Trainable Token Embeddings", "Recalibrated Rotational Cadence", "Preserved Core Knowledge Base"]],
        [["Rigid Steel Bridge Joints", "Thermal Expansion Fractures", "Catastrophic Structural Failure"], ["Flexible Expansion Bearings", "Graceful Dynamic Flexure", "Flawless Long Term Reliability"]],
        [["Single Server Adaptation", "Eight Accelerator Node", "Thirty Two Thousand Context"], ["Multi Node Cluster Avoided", "Ninety Percent Cost Savings", "Rapid Enterprise Turnaround"]]
    ],
    [
        [["Fine Tuning Phase", "Shifted Short Attention S Two", "Linear Grouped Memory Efficiency"], ["Production Inference Phase", "Dense Full Self Attention", "Complete Global Context Coverage"]],
        [["Dual Mode Contract Invariance", "Local And Shifted Training", "Continuous Representation Geometry"], ["FlashAttention Two Integration", "Tiled Online Softmax", "Zero Test Time Activation Memory"]],
        [["Practicing Rehearsal Studios", "Focused Small Ensemble Drills", "Mastered Local Section Harmonies"], ["Grand Philharmonic Concert", "Full Symphonic Resonance", "Flawless Stage Performance"]],
        [["Needle In Haystack Validation", "Ninety Nine Percent Accuracy", "Zero Fact Retrieval Degradation"], ["Standard Serving Engine", "Drop In Container Deployment", "Zero Custom Kernel Required"]]
    ],
    [
        [["DeepSpeed ZeRO Three Pipeline", "Partitioned Optimizer States", "Megabytes Per GPU Overhead"], ["PyTorch FSDP Integration", "Sharded Model Parameters", "Optimal Memory Utilization"]],
        [["In Place Tensor Roll", "Torch Roll Negative Shift", "Zero Data Copy Overhead"], ["Causal Mask Construction", "Lower Triangular Enforced", "Strict Autoregressive Integrity"]],
        [["Conveyer Assembly Lines", "Synchronized Component Stations", "Zero Production Bottlenecks"], ["Chaotic Unsorted Staging", "Cluttered Factory Floors", "Severe Manufacturing Delays"]],
        [["Seventy Billion Parameter Model", "Single Eight GPU Server", "Thirty Two Thousand Tokens"], ["Commercial Scale Deployment", "Rapid Fine Tuning Velocity", "Sustainable Enterprise ROI"]]
    ]
]

entries = []
for p_idx, part in enumerate(day38_dict['parts']):
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
    
    entry_dict = {
        "partTitle": part['title'],
        "codeHash": code_hash,
        "filled": {
            "template": "table",
            "title": titles[p_idx],
            "columns": columns_list[p_idx],
            "steps": spec_steps
        },
        "spec": {
            "template": "table",
            "title": titles[p_idx],
            "columns": columns_list[p_idx],
            "steps": spec_steps
        }
    }
    entries.append(entry_dict)

envelope = {
    "schemaVersion": "2.0.0",
    "prefix": "ai",
    "day": 38,
    "entries": entries
}

# Save day38_lesson.json and day-38.json
with open('scripts/branch_c/day38_lesson.json', 'w', encoding='utf-8') as f:
    json.dump(day38_dict, f, indent=2)

with open('src/lib/data/lessonVisuals/ai/day-38.json', 'w', encoding='utf-8') as f:
    json.dump(envelope, f, indent=2)

print("Generated Day 38 lesson JSON and Visual Envelope successfully!")
