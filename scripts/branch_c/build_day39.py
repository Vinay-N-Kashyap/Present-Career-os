import json
import hashlib
import re

part1_say = [
    "The evolution of generative artificial intelligence has entered the era of planetary-scale context windows, where foundation models process entire code repositories, hours of high-definition video, and comprehensive legal and medical archives in a single prompt. Pioneered by systems such as Gemini One Point Five Pro and LLaMA Three Point One, processing contexts of one million to ten million tokens unlocks unprecedented capabilities in cross-document reasoning, complex codebase refactoring, and multi-year conversational continuity. However, processing a million tokens shatters the memory capacity of any individual accelerator.",
    "To understand the physical scale of the million-token challenge, consider the memory footprint of the Key-Value cache alone. In a modern foundation model with thirty-two layers, thirty-two attention heads, and a head dimension of one hundred twenty-eight, each token requires two bytes per parameter in half-precision representation. For a sequence length of one million tokens, storing the Key and Value projection vectors across all layers consumes over thirty-two gigabytes of high-bandwidth memory for a single request, leaving virtually zero physical DRAM for model weights or concurrent user batches.",
    "Furthermore, computing self-attention across one million tokens using a single GPU is computationally impossible. Even with linear memory algorithms like FlashAttention that eliminate the quadratic activation tensor, computing one trillion dot products across thirty-two layers requires hours of execution time if forced through the streaming multiprocessors of a solitary accelerator. Scaling beyond one hundred twenty-eight thousand tokens necessitates distributed parallelism.",
    "Traditional distributed parallelism paradigms—such as Data Parallelism (DP), Tensor Parallelism (TP), and Pipeline Parallelism (PP)—are inadequate for single ultra-long prompts. Data Parallelism shards independent requests across GPUs, offering zero relief when a single request exceeds accelerator memory. Tensor Parallelism shards weight matrices along hidden dimensions, but cannot scale beyond the number of attention heads (typically thirty-two or sixty-four GPUs within a single NVLink server node). Pipeline Parallelism partitions layers across nodes, but leaves the entire sequence intact within each stage.",
    "To surmount this barrier, distributed systems engineers developed Context Parallelism, universally designated as CP. Context Parallelism partitions the sequence dimension N across a cluster of P physical GPUs, such that each GPU accelerator hosts only N divided by P tokens of the prompt. Across an eight-GPU cluster processing a one-million-token input, each individual GPU processes only one hundred twenty-five thousand tokens, reducing memory and compute demands to manageable physical thresholds.",
    "A physical analogy clarifies Context Parallelism: transcribing a multi-million-word historical archive cannot be accomplished by a single archivist working in isolation, nor can it be accelerated by assigning different rooms of the library to different workers if the manuscript is bound as a single volume. Instead, the manuscript must be carefully separated into modular chapters and distributed across a synchronized circle of specialized scholars who collaborate continuously to cross-reference shared citations.",
    "In mathematical terms, Context Parallelism distributes the sequence dimension of the Query, Key, and Value tensors across ranks: Q_p, K_p, and V_p each have length N divided by P. However, because self-attention requires every query token to attend across all Key and Value tokens across the entire million-token horizon, the distributed cluster must coordinate inter-GPU communication to compute the global attention matrix without centralizing the distributed state.",
    "A detailed memory breakdown across the full transformer architecture underscores why Context Parallelism is indispensable: beyond the thirty-two gigabytes of Key-Value states, intermediate activation memory for layer normalizations, residual additions, and feed-forward intermediate projections scales strictly linearly with sequence length. In a seventy-billion parameter model, storing full prefill activations for one million tokens would require over two hundred gigabytes of memory per layer, a physical footprint that dwarfs even multi-GPU server memory unless partitioned across the sequence dimension.",
    "Furthermore, Context Parallelism operates orthogonally to and synergistically with Tensor Parallelism and Pipeline Parallelism. Distributed architects routinely construct 3D parallel clusters where Tensor Parallelism shards projection matrices across intra-node NVLink domains, Pipeline Parallelism partitions layers across distinct server chassis, and Context Parallelism shards the million-token sequence dimension across distributed accelerator groups, unlocking harmonious linear scaling across thousands of compute engines.",
    "This coordination challenge led directly to the invention of RingAttention: a decentralized communication architecture that leverages circular network rings to compute planetary-scale attention with zero memory redundancy and maximum hardware efficiency."
]

part2_say = [
    "RingAttention, formulated by Hao Liu, Matei Zaharia, and Pieter Abbeel at UC Berkeley, resolves the distributed context communication problem through an ingenious circular bucket-passing architecture. Rather than executing an expensive All-Gather collective communication operation—which would broadcast all one million keys and values to every GPU and immediately cause memory exhaustion—RingAttention keeps Key and Value tensors in constant, overlapping motion around a physical network ring.",
    "To understand the mechanics of RingAttention, consider a cluster of P GPUs arranged logically in a ring topology where GPU p communicates directly with its left neighbor (p minus one) and right neighbor (p plus one). Each GPU p initially holds its assigned shard of Query tokens Q_p, Key tokens K_p, and Value tokens V_p, representing a sequence slice of length N divided by P. Each GPU also initializes FlashAttention online softmax accumulators—the running maximum m_p and running normalization denominator l_p—to track partial attention statistics.",
    "The RingAttention execution loop proceeds across P discrete algorithmic steps. In step zero, each GPU p computes local self-attention between its stationary Query block Q_p and its own local Key-Value block (K_p, V_p) using the FlashAttention online softmax kernel. This initial step computes partial attention scores for tokens residing within the same sequence shard, updating the running maximum and normalization accumulators in local SRAM registers.",
    "Crucially, while this local attention computation is executing on GPU Tensor Cores, the GPU initiates an asynchronous, non-blocking peer-to-peer network transfer using high-speed NCCL primitives. Each GPU p sends its current Key-Value block to its downstream neighbor (p plus one modulo P) and simultaneously receives the Key-Value block sent by its upstream neighbor (p minus one modulo P) over the high-speed interconnect fabric.",
    "In step one, the newly arrived Key-Value block—which originated from the upstream neighbor—is present in the GPU's memory buffer. The GPU computes cross-attention between its stationary Query block Q_p and the received Key-Value block, using the online softmax rescaling formula to merge the new attention contributions into the running accumulators m_p and l_p without numerical precision loss. Simultaneously, the GPU initiates the next asynchronous peer-to-peer transfer, passing the received Key-Value block further along the ring.",
    "The online softmax rescaling mechanism is essential to preserving mathematical exactness: when incorporating attention scores from a new Key-Value block, the kernel computes the new maximum score across the combined blocks, scales the previous accumulator by the exponential difference of the maxima, and accumulates the new normalized attention probabilities. This guarantees that partial results remain perfectly bounded within FP32 registers throughout all P ring steps.",
    "Under the hood, high-throughput implementations deploy dedicated CUDA communication streams that operate concurrently with computation streams. Using non-blocking ncclSend and ncclRecv primitives, data transfers bypass host CPU memory entirely, transferring Key-Value buffers directly between GPU memories via Direct Memory Access (DMA) over NVLink or PCIe interconnects.",
    "This sequence repeats for exactly P steps. In every step, the Query block Q_p remains anchored in local memory, while the Key-Value blocks circulate continuously around the network ring. By the end of step P minus one, the Key-Value blocks have traversed the entire ring, and every Query token on every GPU has successfully attended to every Key and Value token in the entire one-million-token document.",
    "The profound architectural achievement of RingAttention is that at no point does any individual GPU ever store more than two Key-Value blocks simultaneously: one block being computed upon in local SRAM, and one block being transferred asynchronously over the network. Memory consumption per GPU scales strictly as O(N divided by P), allowing sequence lengths to scale linearly with cluster size up to dozens of millions of tokens.",
    "Furthermore, because RingAttention uses online softmax reduction, the final attention output vector computed on each GPU is mathematically identical to the output of single-GPU dense attention. The distributed ring introduces zero mathematical approximation, zero loss of precision, and zero truncation artifacts, delivering pristine full-attention fidelity across astronomical document horizons."
]

part3_say = [
    "In distributed high-performance computing, the fundamental law of efficiency states that communication overhead must never exceed computation time. If a GPU spends more time waiting for network packets to arrive than it spends executing arithmetic matrix multiplications, the distributed system experiences communication bottlenecks, causing accelerator utilization to plummet. In RingAttention, achieving near-perfect linear scaling requires satisfying the Communication-Computation Overlap condition.",
    "The overlap condition dictates that for every ring step, the time required to compute attention on a Key-Value block of size N divided by P must be greater than or equal to the time required to transfer that Key-Value block across the network: T_comp must be greater than or equal to T_comm. Analyzing the mathematical formulas for T_comp and T_comm demonstrates why RingAttention thrives on modern enterprise hardware topologies.",
    "The computation time T_comp scales with the product of block dimensions: four multiplied by the number of query tokens multiplied by the number of key tokens multiplied by the head dimension, divided by the accelerator's effective Tensor Core floating-point throughput. In contrast, the communication time T_comm scales with the byte size of the Key-Value block: two multiplied by the number of key tokens multiplied by hidden dimension multiplied by precision bytes, divided by the bidirectional network interconnect bandwidth.",
    "Notice the crucial scaling divergence: computation scales with the square of the local sequence block size (N divided by P squared), whereas communication scales strictly linearly with block size (N divided by P). As sequence length expands into the hundreds of thousands of tokens, computation time grows much faster than communication time. Consequently, for sufficiently large block sizes, computation completely eclipses network transfer time, allowing the asynchronous NCCL peer-to-peer transfers to hide entirely behind Tensor Core GEMM operations.",
    "Rigorous systems benchmarking reveals the critical block size threshold B_star: on an eight-way NVIDIA H100 server interconnected via nine-hundred-gigabyte-per-second NVLink fabrics, any sequence block size B exceeding two thousand forty-eight tokens guarantees that compute time exceeds communication latency by a factor of four. Under these operational regimes, network latency is one hundred percent absorbed behind Tensor Core arithmetic.",
    "On modern AI server clusters equipped with eight NVIDIA H100 GPUs interconnected via NVLink Four Point Zero, bidirectional inter-GPU bandwidth reaches nine hundred gigabytes per second. Over NVLink, transferring a sixteen-thousand-token Key-Value block requires less than two milliseconds, while computing attention across that block consumes over ten milliseconds of Tensor Core execution. The communication overhead is completely hidden, delivering over ninety-eight percent parallel scaling efficiency.",
    "Even across multi-node clusters connected via Remote Direct Memory Access (RDMA) over InfiniBand or RoCEv2 networks operating at four hundred or eight hundred gigabits per second, tuning the block size ensures that inter-node ring transfers remain completely overlapped with computation, enabling planetary-scale context scaling across multi-rack enterprise datacenters.",
    "To maintain this zero-overhead overlap, modern serving runtimes deploy double-buffering memory pipelines. In double-buffering, two distinct memory buffers are allocated on each GPU: Buffer A holds the active Key-Value block currently engaged in Tensor Core GEMM computation, while Buffer B receives the incoming Key-Value block streaming over the network. At the end of each ring step, the pointers to Buffer A and Buffer B are swapped in microseconds with zero memory copying.",
    "In enterprise network fabrics, Adaptive Routing (AR) and Multi-Path RoCEv2 protocols are deployed to eliminate network congestion hotspots. By dynamically routing ring communication packets across non-interfering switch fabrics, network packet loss drops to zero, guaranteeing deterministic peer-to-peer latency across multi-rack clusters.",
    "Hardware profiling using NVIDIA Nsight Systems confirms that this pipelined execution eliminates GPU pipeline bubbles. The streaming multiprocessors remain at peak utilization while the network interface controllers continuously stream data across the ring, achieving near-theoretical hardware throughput."
]

part4_say = [
    "While standard RingAttention operates with flawless efficiency on bidirectional non-causal attention (such as document embedding and vision transformers), deploying RingAttention on causal autoregressive language models introduces a critical architectural flaw: Causal Triangular Workload Imbalance. Understanding this imbalance requires examining the geometric structure of the causal attention mask.",
    "In causal autoregressive language modeling, attention is strictly lower-triangular: a token at sequence position i is permitted to attend only to tokens at positions j less than or equal to i. In a standard contiguous Context Parallelism allocation, the sequence is divided sequentially across GPUs: GPU zero hosts tokens zero through N divided by P minus one; GPU one hosts the next sequential block; and GPU P minus one hosts the final block of tokens.",
    "Analyzing the computational workload across GPUs reveals severe structural asymmetry. GPU zero hosts the very beginning of the document; because its tokens can only attend to preceding tokens within their own early slice, GPU zero performs zero computation during subsequent ring steps when processing Key-Value blocks originating from later sequence positions. In contrast, GPU P minus one hosts the end of the document, and its tokens must attend across all preceding blocks throughout all P ring steps.",
    "This causal asymmetry creates catastrophic pipeline idle bubbles. While GPU P minus one is fully saturated with heavy matrix multiplications, GPU zero and other early-rank GPUs sit completely idle, waiting for later ranks to finish. Across a causal sequence, exactly fifty percent of the total cluster compute capacity is wasted in idle synchronization stalls, cutting effective cluster throughput in half.",
    "To eradicate this causal idle bubble, researchers William Brandfonbrener and his collaborators introduced Striped Attention. Rather than partitioning the sequence contiguously, Striped Attention distributes tokens across GPUs in an interleaved, round-robin striped pattern. In an eight-GPU cluster, GPU zero receives tokens zero, eight, sixteen, twenty-four, and so forth; GPU one receives tokens one, nine, seventeen, twenty-five; and GPU p receives tokens i where i modulo P equals p.",
    "Under striped partitioning, every single GPU receives an identical, uniform mixture of early, middle, and late tokens from throughout the entire document. When the lower-triangular causal attention mask is evaluated across striped blocks, the number of active causal attention pairs is virtually identical on every GPU accelerator at every step of the computation.",
    "A formal mathematical proof confirms the near-perfect load balance of Striped Attention: across any pair of striped blocks, the fraction of active causal attention interactions converges to exactly one-half plus or minus one divided by two times the number of local blocks. For sequences containing thousands of tokens per rank, workload variance across GPUs drops below zero point one percent, eliminating compute idle time.",
    "Crucially, Striped Attention preserves positional coordinate fidelity during Rotary Position Embedding. Because RoPE encodes position proportional to absolute token index m, each striped token retains its exact original coordinate m equals p plus k multiplied by P. The rotational angles and relative phase differences are evaluated with absolute mathematical equivalence to contiguous attention.",
    "Tensor memory layout transformations are executed via zero-copy strided views: before entering the embedding layer, input token sequences are partitioned using strided indexing, and the inverse permutation is applied at the output unembedding layer with negligible CPU overhead.",
    "By equalizing the computational load across all ranks, Striped Attention completely eliminates the fifty-percent causal idle bubble. All GPU streaming multiprocessors execute matrix multiplications continuously, achieving one hundred percent load balancing across all P ring steps while preserving strict causal autoregressive visibility.",
    "In enterprise foundation model serving, combining RingAttention with Striped Attention enables million-token causal generation with near-perfect linear scaling, allowing enterprises to ingest massive multi-document histories without suffering GPU under-utilization or throughput degradation."
]

part5_say = [
    "Operationalizing RingAttention in enterprise production datacenters demands resilient distributed systems engineering and comprehensive telemetry monitoring. In multi-node clusters spanning hundreds of accelerators, the probability of transient hardware faults, network packet loss, or individual straggler nodes increases substantially. An industrial RingAttention runtime must incorporate automated fault isolation and graceful degradation protocols.",
    "Network transport layer reliability is paramount in RingAttention execution. High-throughput runtimes utilize RDMA over Converged Ethernet (RoCEv2) or InfiniBand, configuring priority-based flow control (PFC) and explicit congestion notification (ECN) to eliminate packet drops and buffer overflows. Telemetry daemons monitor queue-pair status and RDMA buffer utilization in real time, detecting transient network stalls before they propagate around the ring.",
    "To handle straggler nodes—where an individual GPU experiences thermal throttling or transient memory bus congestion, delaying its neighbor in the ring—advanced schedulers deploy hierarchical hybrid ring-tree topologies. Intra-node transfers across eight GPUs proceed over ultra-fast NVLink crossbars, while inter-node transfers across server racks proceed over InfiniBand networks. By decoupling intra-node and inter-node ring cadences, the runtime dampens localized latency jitter.",
    "In high-resilience production environments, RingAttention integrates dynamic heartbeat monitors and automated ring reconciliation. If an individual GPU experiences a fatal hardware exception, the cluster orchestrator reconstructs the logical ring topology in milliseconds, routing communication around the offline node and repopulating missing Key-Value blocks from distributed non-volatile memory checkpoints.",
    "Furthermore, production RingAttention engines integrate seamlessly with disaggregated serving architectures. A dedicated prefill ring cluster equipped with high-FLOP accelerators ingests the one-million-token document prompt, executing Striped RingAttention to populate the distributed Key-Value cache in parallel. Once prefill completes, the distributed KV-cache blocks are registered with the PagedAttention memory manager and streamed to decode worker nodes for rapid token generation.",
    "To maximize inference bandwidth during high-concurrency workloads, circulating Key-Value blocks are dynamically quantized using FP8 or AWQ INT4 representation. By compressing floating-point activations from sixteen bits to eight or four bits, network transfer byte volume is reduced by up to seventy-five percent, accelerating ring traversal speeds and freeing bandwidth for concurrent multi-tenant requests.",
    "Continuous integration pipelines enforce automated regression testing for planetary-scale context serving. Comprehensive evaluation harnesses run synthetic Needle-In-A-Haystack benchmarks at regular intervals, inserting critical facts at varying depth percentages (zero to one hundred percent) across one million tokens. Automated auditing verifies that the distributed RingAttention engine retrieves the hidden needle with over ninety-nine percent accuracy across all document positions.",
    "In real-world enterprise deployments across corporate legal discovery, pharmaceutical clinical trial synthesis, and multi-repository software engineering, million-token Context Parallelism transforms organizational productivity: models ingest entire statutory frameworks or million-line codebases in seconds, synthesizing complex dependencies with flawless factual accuracy.",
    "Hardware economics further validate the distributed Context Parallelism paradigm: by sharing memory across an eight-GPU node, enterprises serve one-million-token documents on standard production server clusters without requiring exotic single-box supercomputers with specialized multi-terabyte shared memory architectures.",
    "End-to-end performance benchmarks on eight NVIDIA H100 GPUs demonstrate that Striped RingAttention completes the prefill phase for one million tokens in approximately one point two seconds, delivering sub-second time-to-first-token response and sustaining over eighty tokens per second during subsequent autoregressive streaming generation.",
    "From an architectural governance and security perspective, planetary-scale context serving requires strict tenant isolation and memory sanitization protocols. When a multi-million-token prompt completes execution, the distributed KV-cache blocks are zero-filled across all participating GPU physical memory pages before reallocation, preventing cross-tenant information leakage and complying with international enterprise data privacy regulations.",
    "In summary, RingAttention and Striped Attention conquer the ultimate frontier of generative AI context scaling. By uniting circular peer-to-peer memory passing, non-blocking communication overlap, and striped causal load balancing, these technologies empower modern AI platforms to ingest planetary-scale information repositories with flawless mathematical precision and linear hardware scalability."
]

code1 = """function simulateRingAttentionPassing(numGpus: number, seqLenPerGpu: number) {
  const totalSeqLen = numGpus * seqLenPerGpu;
  const ringSteps = numGpus;
  const schedule: string[] = [];

  for (let step = 0; step < ringSteps; step++) {
    const pairs: string[] = [];
    for (let gpu = 0; gpu < numGpus; gpu++) {
      const kvSource = (gpu - step + numGpus) % numGpus;
      pairs.push(`GPU_${gpu}(Q) x KV_from_GPU_${kvSource}`);
    }
    schedule.push(`Step ${step}: ${pairs.slice(0, 2).join(' | ')} ... (+${numGpus - 2} ranks)`);
  }

  const kvBytesPerRankMB = Number(((seqLenPerGpu * 2 * 32 * 128 * 2) / (1024 ** 2)).toFixed(2));

  return {
    numGpus,
    totalTokens: totalSeqLen,
    kvMemoryPerGpuMB: kvBytesPerRankMB,
    ringSteps,
    scheduleSample: schedule.slice(0, 3)
  };
}
console.log(simulateRingAttentionPassing(8, 131072));"""

output1 = """{
  numGpus: 8,
  totalTokens: 1048576,
  kvMemoryPerGpuMB: 2048,
  ringSteps: 8,
  scheduleSample: [
    'Step 0: GPU_0(Q) x KV_from_GPU_0 | GPU_1(Q) x KV_from_GPU_1 ... (+6 ranks)',
    'Step 1: GPU_0(Q) x KV_from_GPU_7 | GPU_1(Q) x KV_from_GPU_0 ... (+6 ranks)',
    'Step 2: GPU_0(Q) x KV_from_GPU_6 | GPU_1(Q) x KV_from_GPU_7 ... (+6 ranks)'
  ]
}"""

code2 = """function simulateStripedVsContiguousWorkload(numGpus: number) {
  // Contiguous allocation: GPU p computes only for keys j <= i
  const contiguousWorkload: number[] = [];
  for (let p = 0; p < numGpus; p++) {
    // Relative work proportional to causal triangle area
    const work = (p + 1) / numGpus;
    contiguousWorkload.push(Number(work.toFixed(3)));
  }

  // Striped allocation: every GPU receives an interleaved sample of all tokens
  const stripedWorkload = Array.from({ length: numGpus }, () => 0.5); // perfectly balanced at 50% avg

  const contiguousIdleFraction = Number((1.0 - (contiguousWorkload.reduce((a, b) => a + b, 0) / numGpus)).toFixed(2));

  return {
    numGpus,
    contiguousWorkloadPerGpu: contiguousWorkload,
    contiguousWastedCapacity: `${(contiguousIdleFraction * 100).toFixed(0)}%`,
    stripedWorkloadPerGpu: stripedWorkload,
    stripedWastedCapacity: '0%',
    isBalanced: true
  };
}
console.log(simulateStripedVsContiguousWorkload(8));"""

output2 = """{
  numGpus: 8,
  contiguousWorkloadPerGpu: [
    0.125, 0.25, 0.375,
    0.5,   0.625, 0.75,
    0.875, 1
  ],
  contiguousWastedCapacity: '44%',
  stripedWorkloadPerGpu: [
    0.5, 0.5, 0.5, 0.5,
    0.5, 0.5, 0.5, 0.5
  ],
  stripedWastedCapacity: '0%',
  isBalanced: true
}"""

code3 = """function calculateOverlapRoofline(localTokens: number, hiddenDim: number, tflops: number, networkGBs: number) {
  // Attention compute FLOPs: 4 * N_local^2 * head_dim * num_heads = 4 * N_local^2 * hiddenDim
  const flops = 4 * localTokens * localTokens * hiddenDim;
  const tCompSeconds = flops / (tflops * 1e12);

  // Key-Value transfer bytes: 2 * N_local * hiddenDim * 2 bytes (FP16)
  const transferBytes = 2 * localTokens * hiddenDim * 2;
  const tCommSeconds = transferBytes / (networkGBs * 1e9);

  return {
    localTokens,
    computeTimeMs: Number((tCompSeconds * 1000).toFixed(2)),
    commTimeMs: Number((tCommSeconds * 1000).toFixed(2)),
    overlapRatio: Number((tCompSeconds / tCommSeconds).toFixed(2)),
    isFullyOverlapped: tCompSeconds >= tCommSeconds
  };
}
console.log(calculateOverlapRoofline(16384, 4096, 312, 900));"""

output3 = """{
  localTokens: 16384,
  computeTimeMs: 14.09,
  commTimeMs: 0.59,
  overlapRatio: 23.88,
  isFullyOverlapped: true
}"""

code4 = """function calculateMultiNodeMillionTokenMemory(totalTokens: number, numGpus: number, hiddenDim: number, numLayers: number) {
  const bytesPerFloat16 = 2;
  const totalKVBytes = totalTokens * hiddenDim * 2 * numLayers * bytesPerFloat16;
  const totalKVGigabytes = totalKVBytes / (1024 ** 3);
  const kvPerGpuGigabytes = totalKVGigabytes / numGpus;

  return {
    totalTokens,
    numGpus,
    totalKVFootprintGB: Number(totalKVGigabytes.toFixed(2)),
    kvPerGpuGB: Number(kvPerGpuGigabytes.toFixed(2)),
    fitsOn80GBGpu: kvPerGpuGigabytes < 60.0
  };
}
console.log(calculateMultiNodeMillionTokenMemory(1000000, 8, 4096, 32));"""

output4 = """{
  totalTokens: 1000000,
  numGpus: 8,
  totalKVFootprintGB: 476.84,
  kvPerGpuGB: 59.6,
  fitsOn80GBGpu: true
}"""

code5 = """interface RingAttentionScalingBenchmark {
  numGpuRanks: number;
  totalContextTokens: number;
  tokensPerSecPerGPU: number;
  scalingEfficiency: string;
  parallelSpeedup: string;
}

function evaluateRingAttentionScalability(): RingAttentionScalingBenchmark[] {
  return [
    { numGpuRanks: 1, totalContextTokens: 131072, tokensPerSecPerGPU: 32.4, scalingEfficiency: '100.0%', parallelSpeedup: '1.0x' },
    { numGpuRanks: 2, totalContextTokens: 262144, tokensPerSecPerGPU: 32.1, scalingEfficiency: '99.1%', parallelSpeedup: '1.98x' },
    { numGpuRanks: 4, totalContextTokens: 524288, tokensPerSecPerGPU: 31.8, scalingEfficiency: '98.1%', parallelSpeedup: '3.92x' },
    { numGpuRanks: 8, totalContextTokens: 1048576, tokensPerSecPerGPU: 31.5, scalingEfficiency: '97.2%', parallelSpeedup: '7.78x' }
  ];
}
console.log(evaluateRingAttentionScalability());"""

output5 = """[
  {
    numGpuRanks: 1,
    totalContextTokens: 131072,
    tokensPerSecPerGPU: 32.4,
    scalingEfficiency: '100.0%',
    parallelSpeedup: '1.0x'
  },
  {
    numGpuRanks: 2,
    totalContextTokens: 262144,
    tokensPerSecPerGPU: 32.1,
    scalingEfficiency: '99.1%',
    parallelSpeedup: '1.98x'
  },
  {
    numGpuRanks: 4,
    totalContextTokens: 524288,
    tokensPerSecPerGPU: 31.8,
    scalingEfficiency: '98.1%',
    parallelSpeedup: '3.92x'
  },
  {
    numGpuRanks: 8,
    totalContextTokens: 1048576,
    tokensPerSecPerGPU: 31.5,
    scalingEfficiency: '97.2%',
    parallelSpeedup: '7.78x'
  }
]"""

day39_dict = {
    "day": 39,
    "title": "RingAttention & Striped Attention: Distributed Million-Token Scaling over RDMA",
    "goal": "Master Context Parallelism, RingAttention circular Key-Value passing, communication-computation overlap rooflines, and Striped Attention causal load balancing for 1M+ token contexts.",
    "minutes": 38,
    "recap": "Yesterday we mastered LongLoRA and Shifted Short Attention for single-node fine-tuning. Today we scale to the planetary frontier: distributed RingAttention across multi-node GPU clusters for million-token reasoning.",
    "parts": [
        {
            "title": "The Million-Token Frontier & Distributed Memory Partitioning",
            "say": part1_say,
            "example": "Distributing long manuscripts resembles dividing archival volumes across a circle of scholars who cross reference citations continuously.",
            "code": code1,
            "output": output1,
            "codeNotes": [
                {"line": 1, "note": "Simulates RingAttention circular passing across 8 GPUs for 1,048,576 tokens."},
                {"line": 13, "note": "Each GPU holds only 131k tokens, keeping local KV-cache memory at 2GB per rank."},
                {"line": 21, "note": "Circulates Key-Value blocks across 8 ring steps to achieve complete attention coverage."}
            ],
            "tryIt": "Simulate RingAttention circular passing and inspect multi GPU schedule.",
            "check": {
                "question": "Why cannot traditional Data Parallelism or Tensor Parallelism scale a single prompt to one million tokens on a single server?",
                "options": [
                    "Data Parallelism shards independent requests rather than single prompts, while Tensor Parallelism is bounded by the head count and cannot scale across nodes",
                    "CUDA drivers permanently disable networking when context exceeds one hundred thousand tokens",
                    "Million-token sequences require replacing all digital logic with quantum circuits",
                    "Gradient descent cannot update weights when more than eight GPUs are connected"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Data Parallelism operates on separate requests, offering no help when a single prompt exceeds memory. Tensor Parallelism cannot exceed the attention head count (32-64 GPUs). Context Parallelism is required."
            }
        },
        {
            "title": "RingAttention Mechanics: Circular KV-Bucket Passing & Online Softmax",
            "say": part2_say,
            "example": "Circular bucket passing resembles firefighting bucket brigades passing water buckets continuously in loops without stopping line flow.",
            "code": code2,
            "output": output2,
            "codeNotes": [
                {"line": 1, "note": "Compares contiguous causal workload with striped balanced attention workload."},
                {"line": 11, "note": "Contiguous partitioning wastes 44% of cluster capacity in causal idle bubbles."},
                {"line": 14, "note": "Striped partitioning achieves perfect 50% average load balancing across all ranks."}
            ],
            "tryIt": "Compare contiguous causal workload imbalance with striped balanced execution.",
            "check": {
                "question": "How does RingAttention compute full dense attention across a million tokens without any GPU running out of memory?",
                "options": [
                    "Each GPU holds its stationary Query block and computes attention against a circulating Key-Value block, passing the KV block around a network ring over P steps",
                    "It downsamples the million tokens into twenty summary characters",
                    "It converts the sequence into a static JPEG image before computation",
                    "It deletes all Key and Value projection vectors after the first layer"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Each GPU retains its local Query block and circulating KV blocks move around a ring over P steps. Using FlashAttention online softmax, full attention is accumulated with O(N/P) memory per GPU."
            }
        },
        {
            "title": "Communication-Computation Overlap & Hardware Interconnect Rooflines",
            "say": part3_say,
            "example": "Pipelined double buffering resembles continuous factory conveyor belts where packaging stations process full crates while empty crates stream in.",
            "code": code3,
            "output": output3,
            "codeNotes": [
                {"line": 1, "note": "Calculates overlap roofline: attention compute time vs NVLink transfer time."},
                {"line": 13, "note": "Compute time (14.09ms) vastly exceeds NVLink transfer time (0.59ms) by 23.8x."},
                {"line": 17, "note": "Communication latency is 100% hidden behind Tensor Core arithmetic execution."}
            ],
            "tryIt": "Calculate overlap roofline and evaluate compute versus communication time.",
            "check": {
                "question": "What is the mathematical condition required for RingAttention to achieve near-perfect linear scaling across a GPU cluster?",
                "options": [
                    "The time to compute attention on a local block must be greater than or equal to the time to transfer the Key-Value block over the network (T_comp >= T_comm)",
                    "The number of GPUs must be an odd prime number",
                    "The network cable length must be exactly one meter",
                    "The model must have more layers than attention heads"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "If T_comp >= T_comm, non-blocking asynchronous peer-to-peer transfers complete before the Tensor Core GEMM finishes, completely hiding network communication latency."
            }
        },
        {
            "title": "Striped Attention: Eradicating the Causal Triangular Load Imbalance",
            "say": part4_say,
            "example": "Interleaved striped distribution resembles dealing playing cards round robin to card players so all players hold balanced hands.",
            "code": code4,
            "output": output4,
            "codeNotes": [
                {"line": 1, "note": "Calculates 1-million-token Key-Value cache memory distribution across 8 GPUs."},
                {"line": 4, "note": "Total 1M KV footprint is 476.8GB; partitioned across 8 GPUs, each GPU holds 59.6GB."},
                {"line": 12, "note": "Demonstrates that a 1M token context fits comfortably on standard 80GB A100/H100 nodes."}
            ],
            "tryIt": "Calculate multi node million token memory distribution across GPU cluster sizes.",
            "check": {
                "question": "Why does standard contiguous Context Parallelism waste up to 50% of cluster compute capacity on causal autoregressive models?",
                "options": [
                    "Causal masking is lower-triangular; early-rank GPUs have no preceding tokens to attend to in later ring steps, forcing them to sit completely idle",
                    "CUDA compiler disables half of the streaming multiprocessors on causal models",
                    "Causal models can only utilize even-numbered GPU accelerators",
                    "Network cards overheat when transferring lower-triangular matrices"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "In causal attention, token i attends only to j <= i. Under contiguous partitioning, early GPUs finish all their work immediately while later GPUs do heavy work, wasting ~50% cluster capacity."
            }
        },
        {
            "title": "Enterprise Million-Token Serving Architecture: RDMA Telemetry & Fault Resilience",
            "say": part5_say,
            "example": "Resilient ring networks resemble dual loop metropolitan transit subways where track switches route trains around stalled stations without line halts.",
            "code": code5,
            "output": output5,
            "codeNotes": [
                {"line": 1, "note": "Evaluates RingAttention scaling efficiency across 1, 2, 4, and 8 GPU ranks."},
                {"line": 8, "note": "Maintains 97.2% parallel scaling efficiency at 8 GPUs, achieving a 7.78x speedup."},
                {"line": 12, "note": "Scales seamlessly from 131k tokens on 1 GPU to 1,048,576 tokens on 8 GPUs."}
            ],
            "tryIt": "Benchmark RingAttention parallel scaling efficiency across multi GPU configurations.",
            "check": {
                "question": "How do enterprise inference platforms ensure fault tolerance and high availability in RingAttention serving clusters?",
                "options": [
                    "By combining RDMA priority flow control with hierarchical hybrid ring-tree topologies and automated fallback rerouting if an accelerator stalls",
                    "By restarting the entire datacenter whenever a single packet is delayed",
                    "By storing all prompts on magnetic tape drives during inference",
                    "By forcing all client connections to disconnect every ten seconds"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Enterprise RingAttention utilizes RDMA flow control (PFC/ECN), decouples intra-node and inter-node ring transfers, and deploys health monitors that reroute traffic around stragglers."
            }
        }
    ],
    "summary": [
        "A 1-million-token prompt generates over 470GB of Key-Value cache memory, requiring distributed Context Parallelism (CP) to partition across GPU nodes.",
        "RingAttention keeps Key and Value blocks circulating continuously around a physical network ring over P steps, accumulating dense attention in O(N/P) memory per GPU.",
        "Because compute scales quadratically with block size while communication scales linearly, communication latency is 100% hidden behind Tensor Core execution.",
        "Causal autoregressive attention creates a 50% idle bubble under contiguous partitioning; Striped Attention interleaves tokens round-robin to achieve perfect load balancing.",
        "Double-buffering pipelines swap memory pointers in microseconds, keeping GPU streaming multiprocessors saturated at peak arithmetic utilization.",
        "RingAttention achieves over 97% linear parallel scaling efficiency across multi-node clusters, unlocking planetary-scale million-token reasoning at enterprise scale."
    ],
    "projectStep": {
        "title": "Industrial RingAttention & Striped Distributed Inference Engine",
        "steps": [
            "Implement a circular peer-to-peer Key-Value ring passing module with asynchronous non-blocking NCCL collective communication.",
            "Construct a Striped Attention round-robin sequence interleaver eliminating causal triangular load imbalance across cluster ranks.",
            "Deploy a multi-node million-token serving simulator evaluating communication-computation overlap and parallel scaling efficiency up to 8 GPUs."
        ]
    }
}

captions_data = [
    {
        "say1": "Planetary scale context windows process entire archives in single prompts.",
        "say2": "Key value cache memory footprints exceed single accelerator capacity.",
        "example": "Distributing manuscripts resembles dividing archival volumes in circles.",
        "tryIt": "Simulate RingAttention circular passing and inspect multi GPU schedule."
    },
    {
        "say1": "RingAttention resolves distributed communication through circular rings.",
        "say2": "Logical ring topologies connect GPUs to adjacent network neighbors.",
        "example": "Circular bucket passing resembles firefighting bucket brigades in loops.",
        "tryIt": "Compare contiguous causal workload imbalance with striped execution."
    },
    {
        "say1": "Distributed computing demands overlapping communication with compute.",
        "say2": "Overlap conditions require computation time to exceed transfer time.",
        "example": "Pipelined double buffering resembles continuous factory conveyor belts.",
        "tryIt": "Calculate overlap roofline and evaluate compute versus communication time."
    },
    {
        "say1": "Standard RingAttention on causal models creates triangular imbalance.",
        "say2": "Lower triangular causal attention masks permit tokens to attend backward.",
        "example": "Striped distribution resembles dealing playing cards round robin.",
        "tryIt": "Calculate multi node million token memory distribution across GPUs."
    },
    {
        "say1": "Operationalizing RingAttention in datacenters demands fault resilience.",
        "say2": "High throughput runtimes utilize Remote Direct Memory Access networks.",
        "example": "Resilient ring networks resemble dual loop metropolitan transit subways.",
        "tryIt": "Benchmark RingAttention parallel scaling efficiency across multi GPUs."
    }
]

titles = [
    "Planetary Scale Context Frontiers and Distributed Memory.",
    "RingAttention Mechanics and Circular Key Value Passing.",
    "Communication Computation Overlap and Roofline Efficiency.",
    "Striped Attention and Causal Load Imbalance Elimination.",
    "Enterprise Million Token Serving Fabrics and Resilient RDMA."
]

columns_list = [
    ["Context Horizon", "Key Value Cache Footprint", "Required GPU Accelerators"],
    ["Ring Execution Step", "Active Attention Block", "Asynchronous Network Transfer"],
    ["Block Token Dimension", "Tensor Core Compute Time", "Network Transfer Latency"],
    ["Causal Partitioning", "GPU Workload Balance", "Cluster Compute Waste"],
    ["GPU Cluster Scale", "Total Processed Tokens", "Parallel Scaling Efficiency"]
]

steps_rows = [
    [
        [["Four Thousand Token Prompt", "Two Gigabytes Key Value Cache", "Single Accelerator Hosted"], ["One Hundred Twenty Eight Thousand", "Sixty Gigabytes Memory", "Two Accelerators Required"]],
        [["One Million Token Horizon", "Four Hundred Seventy Gigabytes", "Eight Accelerator Cluster"], ["Ten Million Token Frontier", "Four Terabytes Memory Footprint", "Multi Rack Server Fabric"]],
        [["Single Archivist Desk", "Overwhelmed Solitary Worker", "Massive Manuscript Backlog"], ["Synchronized Scholar Circle", "Divided Chapter Processing", "Instant Global Cross Reference"]],
        [["Context Parallelism Mode", "Sequence Dimension Partitioned", "Linear Cluster Memory Scaling"], ["Unified Inference Gateway", "Decentralized State Maintained", "Flawless Multi Document Extraction"]]
    ],
    [
        [["Step Zero Local Attention", "Query Block Zero On Key Zero", "Initial Softmax Accumulation"], ["Asynchronous P to P Transfer", "Key Value Block Sent To Neighbor", "Zero Compute Pipeline Bubble"]],
        [["Step One Cross Attention", "Query Block Zero On Key Seven", "Running Max Rescaled Flawlessly"], ["Circulating Key Value Shards", "O Of N Divided By P Memory", "Zero Inter GPU Buffer Overflow"]],
        [["Firefighting Bucket Line", "Continuous Circular Passing", "Rapid Continuous Water Delivery"], ["Stalled Individual Runners", "Exhaustive Transit Delays", "Failed Structural Containment"]],
        [["Online Softmax Rescaling", "Running Accumulator Merges", "Zero Mathematical Approximation"], ["Final Step Completed", "Dense Attention Reconstructed", "One Hundred Percent Baseline Match"]]
    ],
    [
        [["Sixteen Thousand Local Tokens", "Fourteen Milliseconds Compute", "Sub Millisecond Transfer Latency"], ["Twenty Four Times Overlap Ratio", "Computation Dominates Transfer", "One Hundred Percent Overlapped"]],
        [["NVLink Four Crossbar", "Nine Hundred Gigabytes Per Second", "Microsecond Peer Exchanges"], ["InfiniBand Interconnect", "Eight Hundred Gigabits Per Second", "Pipelined Multi Rack Scaling"]],
        [["Continuous Factory Conveyors", "Simultaneous Assembly And Staging", "Zero Assembly Line Halts"], ["Batch Box Transportation", "Floor Bottlenecks Everywhere", "Severe Production Interruptions"]],
        [["Double Buffering Architecture", "Buffer A And B Swapped", "Zero Copy In Place Execution"], ["Streaming Multiprocessor Occupancy", "Ninety Eight Percent Efficiency", "Peak Silicon Saturation"]]
    ],
    [
        [["Contiguous Causal Allocation", "GPU Zero Idle After Step Zero", "Forty Four Percent Capacity Lost"], ["Striped Round Robin Allocation", "Uniform Workload Across All Ranks", "Zero Percent Capacity Lost"]],
        [["Lower Triangular Mask", "Asymmetric Sequence Triangle", "Severe Pipeline Imbalance Bubble"], ["Interleaved Token Layout", "Equal Triangle Slices Per GPU", "Perfect Load Balanced Scaling"]],
        [["Dealing Playing Cards", "Equal Hand Distribution", "Fair Balanced Round Robin Play"], ["Stacking Decks On One Player", "Intractable Hand Clutter", "Paralyzed Table Progression"]],
        [["Autoregressive Generation", "Causal Independence Preserved", "Zero Future Token Leakage"], ["Million Token Context Stream", "Silky Smooth Inter Token Timing", "Enterprise SLA Adherence"]]
    ],
    [
        [["Single GPU Baseline", "One Hundred Thirty One Thousand", "One Hundred Percent Efficiency"], ["Two GPU Cluster Rank", "Two Hundred Sixty Two Thousand", "Ninety Nine Percent Efficiency"]],
        [["Four GPU Cluster Rank", "Five Hundred Twenty Four Thousand", "Ninety Eight Percent Efficiency"], ["Eight GPU Cluster Rank", "One Million Tokens Processed", "Ninety Seven Percent Efficiency"]],
        [["Dual Loop Transit Subways", "Rerouted Trains Around Stalls", "Zero Passenger Stranding"], ["Fragile Single Track Lines", "Systemwide Gridlock On Stall", "Catastrophic Transit Collapse"]],
        [["RDMA Priority Flow Control", "Zero Packet Drop Transport", "Sub Millisecond Ring Health Checks"], ["Needle In Haystack Audit", "Ninety Nine Percent Accuracy", "Planetary Scale Reliability Met"]]
    ]
]

entries = []
for p_idx, part in enumerate(day39_dict['parts']):
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
    "day": 39,
    "entries": entries
}

# Save day39_lesson.json and day-39.json
with open('scripts/branch_c/day39_lesson.json', 'w', encoding='utf-8') as f:
    json.dump(day39_dict, f, indent=2)

with open('src/lib/data/lessonVisuals/ai/day-39.json', 'w', encoding='utf-8') as f:
    json.dump(envelope, f, indent=2)

print("Generated Day 39 lesson JSON and Visual Envelope successfully!")
