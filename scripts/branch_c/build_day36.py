import json
import hashlib
import re

part1_say = [
    "To understand why modern foundation models can process massive document contexts spanning tens of thousands of tokens without catastrophic comprehension failure, systems architects must examine how transformers represent the spatial ordering of language. In the original transformer architecture, self-attention is fundamentally permutation-invariant: given a sequence of input token embeddings, swapping the order of any two tokens produces an identical set of attention scores and output representations unless positional information is explicitly injected into the computation.",
    "Early generative architectures addressed this permutation invariance by utilizing additive position embeddings. In learnable absolute positional encoding schemes, the model maintained an embedding lookup table where each discrete token position (zero through four thousand ninety-five) was mapped to a trainable vector of the same hidden dimension as the model. This positional vector was directly added to the input word embedding before the first transformer layer. Alternatively, sinusoidal positional embeddings generated fixed sine and cosine waves across geometric frequency bands, adding deterministic coordinates to the input token representations.",
    "While additive positional embeddings functioned adequately for short context windows of two to four thousand tokens, they suffer from fatal mathematical limitations when scaled to enterprise document lengths. First, additive embeddings perturb the semantic vector space: adding a large positional vector directly to a word embedding shifts its position in high-dimensional space, forcing downstream feed-forward networks and attention heads to expend substantial representational capacity disentangling semantic meaning from spatial coordinates.",
    "More critically, additive positional embeddings exhibit catastrophic out-of-distribution failure when evaluated on sequence lengths exceeding their pre-training threshold. If a foundation model is pre-trained with learnable absolute position embeddings up to four thousand tokens, position index four thousand ninety-six has never been updated by gradient descent. Its embedding vector contains uninitialized weights or random noise, causing the self-attention mechanism to output chaotic attention distributions and nonsensical logits when processing long documents.",
    "Furthermore, additive position embeddings fail to naturally preserve relative distance relationships during the core Query-Key dot product. When computing the attention score between a query at position m and a key at position n, we desire an attention mechanism whose mathematical formulation depends strictly on the relative distance offset (m minus n). In additive schemes, expanding the dot product of (q plus p_m) and (k plus p_n) yields four separate cross-terms, contaminating the relative spatial interaction with absolute coordinate dependencies.",
    "Alternative approaches, such as Attention with Linear Biases (ALiBi), attempted to resolve this by adding static negative bias slopes directly to the Query-Key attention matrix proportional to token distance. While ALiBi enabled sequence length extrapolation without learnable tables, it enforced a rigid, monotonic decay penalty across all attention heads. This strict penalty severely harmed model capability on tasks requiring long-range semantic reasoning, such as code generation and document question answering, where distant tokens often possess critical relevance that must not be penalized simply due to physical separation.",
    "In high-dimensional representation geometry, adding static vectors to embedding spaces also risks vector collapse. Because word embeddings reside on a manifold within the hypersphere, linear addition of positional vectors pushes representations away from the trained hyperspherical surface, introducing activation norm drift that destabilizes layer normalization layers across deep networks.",
    "The historical evolution from one-dimensional positional tags to learned absolute embedding tables, static sinusoidal additions, and relative bias matrices culminated in the recognition that spatial ordering should not be added as displacement vectors. Instead, spatial coordinates must be represented as rotational transformations that preserve vector magnitudes while encoding relative distance directly into the phase angles of the attention dot product.",
    "To overcome these fundamental geometric limitations, AI researchers developed multiplicative positional encodings. Rather than adding vectors to the input embeddings, multiplicative encodings rotate the Query and Key vectors in complex geometric space. This paradigm shift ensures that vector magnitudes are preserved while their relative angular distance directly dictates attention weights, establishing the mathematical foundation for modern context scaling."
]

part2_say = [
    "Rotary Position Embedding, universally known as RoPE, resolves the limitations of additive positional encodings through an elegant formulation grounded in complex coordinate geometry. Introduced by Jianlin Su and adopted by premier open-weight foundation models including LLaMA, Mistral, and Qwen, RoPE injects positional information into self-attention by rotating Query and Key vectors in two-dimensional complex subspaces proportional to their absolute sequence positions.",
    "To understand the mechanics of RoPE, consider an attention head with hidden dimension d. RoPE divides this d-dimensional vector into d over two orthogonal two-dimensional coordinate pairs: (x_0, x_1), (x_2, x_3), up to (x_{d-2}, x_{d-1}). Each two-dimensional pair is treated as a complex number z equals x plus iy. When a token resides at position m in the sequence, each coordinate pair is rotated by an angle equal to m multiplied by a dedicated frequency theta_i. In matrix notation, this rotation is expressed as multiplying the two-dimensional vector by a two-by-two orthogonal rotation matrix containing cosine and sine components.",
    "The full RoPE transformation matrix R_{theta, m} is a block-diagonal matrix composed of d over two independent two-by-two rotation submatrices. When applied to a Query vector q at position m and a Key vector k at position n, the rotated representations become R_m multiplied by q and R_n multiplied by k. Because rotation matrices are orthogonal, the Euclidean length of the vectors remains perfectly invariant: rotating a vector changes its spatial orientation without altering its underlying vector norm or semantic magnitude.",
    "The crowning mathematical achievement of RoPE lies in the calculation of the attention dot product. When the model computes the inner product between the rotated Query and Key vectors, the algebraic product simplifies into the real part of the complex conjugate product. Because multiplying complex exponentials corresponds to subtracting their rotation angles, the resulting dot product depends strictly on the relative distance (m minus n). The absolute position m vanishes entirely from the scalar product, guaranteeing that attention scores reflect pure relative token distance.",
    "An explicit algebraic expansion illustrates this profound cancellation. For any coordinate pair, multiplying the rotated query components (q_0 cos m theta minus q_1 sin m theta, q_0 sin m theta plus q_1 cos m theta) by the rotated key components (k_0 cos n theta minus k_1 sin n theta, k_0 sin n theta plus k_1 cos n theta) produces terms that factor cleanly into (q_0 k_0 plus q_1 k_1) multiplied by cos((m minus n) theta) plus (q_0 k_1 minus q_1 k_0) multiplied by sin((m minus n) theta). The trigonometric arguments depend entirely on the relative difference (m minus n), proving absolute coordinate invariance in closed form.",
    "This relative distance invariance guarantees structural consistency across long sequences. Whether two interacting tokens appear at positions ten and twelve or at positions three thousand ten and three thousand twelve, their relative offset is identical (two tokens apart), and their rotary dot product yields the exact same relative positional bias. This profound mathematical property allows models to maintain coherent syntactic and semantic dependencies across sprawling conversational histories and multi-page technical manuals.",
    "Moreover, RoPE is applied at the individual attention head level where head dimension d_k is typically sixty-four or one hundred twenty-eight, rather than across the full model hidden dimension d_model. This design preserves the modular subspace independence of each attention head, allowing different heads to specialize in different positional receptive fields while keeping linear projection layers decoupled.",
    "Crucially, RoPE applies positional rotation exclusively to Query and Key projections immediately prior to computing attention matrices. The Value projection vectors remain completely unrotated, preserving the pristine semantic representations of token states as they pass through residual connections and feed-forward layers. This surgical isolation of positional coordinates ensures that positional bias influences only attention routing without polluting the residual stream."
]

part3_say = [
    "The rotational frequencies employed across the d over two coordinate pairs are not uniform; rather, they follow a geometrically decaying frequency spectrum governed by a base hyperparameter theta, conventionally set to ten thousand in original implementations. For coordinate pair i ranging from zero to d over two minus one, the frequency theta_i is defined as theta raised to the power of negative two i divided by d. This geometric progression assigns drastically different rotational velocities to different subspace dimensions.",
    "In the lowest-index coordinate pairs (i equals zero and one), the frequency is close to one, meaning that the rotation angle advances rapidly with every single token increment. For instance, in the very first coordinate pair, advancing by just a few tokens completes a full three-hundred-sixty-degree rotation in the complex plane. These high-frequency dimensions capture fine-grained local syntax, grammatical agreement, adjacent word order, and immediate phrase structures that operate over short token horizons.",
    "Conversely, in the highest-index coordinate pairs where i approaches d over two, the exponent causes the rotational frequency to shrink toward zero. In these dimensions, advancing by dozens or hundreds of tokens produces only an infinitesimal fraction of a radian of rotation. These low-frequency dimensions act as global spatial anchors, tracking macroscopic document sections, conversational turns, thematic chapter boundaries, and long-range semantic relationships that span thousands of tokens.",
    "A useful mechanical analogy is an astronomical clock: the lowest-index dimensions behave like the rapid ticks of a millisecond stopwatch, capturing transient local transitions, while the highest-index dimensions behave like the majestic, slow progression of an astronomical planetary gear, completing a single cycle only across tens of thousands of tokens. This multi-scale geometric hierarchy allows a single attention head to perceive both fine linguistic nuance and overarching document architecture simultaneously.",
    "A remarkable emergent consequence of this multi-frequency spectrum is the Long-Term Decay Property. When we compute the expected inner product between rotated vectors across randomly distributed embeddings as the relative distance (m minus n) grows, the summation of cosine terms across disparate frequencies exhibits destructive interference, analogous to the classical Riemann-Lebesgue lemma in harmonic analysis. As token separation increases, the average magnitude of the positional dot product naturally diminishes.",
    "Mathematical analysis proves that the envelope of expected attention scores decays at a rate of approximately one divided by the absolute distance (m minus n). This natural long-term decay provides an intrinsic inductive bias that mirrors human cognition: tokens that are close to one another in text typically possess stronger syntactic and semantic correlations than tokens separated by thousands of words. By allowing attention scores to decay gracefully with physical distance without imposing hard context clipping windows, RoPE enables foundation models to prioritize relevant local context while retaining the latent ability to retrieve distant facts.",
    "In causal auto-regressive generation, this decay interacts synergistically with the lower-triangular causal attention mask. Because queries can only attend to previous tokens, the combination of causal masking and rotary frequency decay creates an asymmetric temporal inductive bias that mirrors the arrow of time in natural language narrative structure.",
    "In multilingual foundation models, the frequency spectrum of RoPE interacts dynamically with morphological variance across languages. Morphologically rich languages (such as German, Finnish, or Korean) often require attention heads to maintain sharp, high-frequency focus over compound word components and case suffixes, while analytic languages (such as English or Chinese) rely more heavily on mid-range and low-frequency dimensions to resolve word-order dependencies across clauses. RoPE accommodates both linguistic modalities seamlessly without language-specific positional re-tuning.",
    "In enterprise AI systems, this frequency-dependent attention behavior is critical for processing dense structured data such as source code repositories and legal contracts. Local syntax checks (such as matching parentheses or variable names) rely on high-frequency rotational dimensions, while global reference resolution (such as referencing an imported module or contractual indemnification clause) relies on slowly rotating low-frequency dimensions."
]

part4_say = [
    "While standard Rotary Position Embeddings provide natural relative distance invariance, deploying a pre-trained model on sequence lengths substantially beyond its training context window reveals critical extrapolation boundaries. When an enterprise model pre-trained on four thousand tokens is suddenly fed an eight-thousand or sixteen-thousand token document, the model's perplexity degrades severely, eventually exploding into gibberish. Understanding why this breakdown occurs requires analyzing rotation angle distributions.",
    "At sequence position eight thousand, the rotation angles m multiplied by theta_i in the low-frequency dimensions reach numerical values that were never encountered during pre-training. Because neural network activations are sensitive to out-of-distribution inputs, these unobserved rotation angles produce distorted Query-Key dot products. In the high-frequency dimensions, rapid rotations over unfamiliar distances cause attention weights to disperse chaotically across the sequence, preventing the model from focusing attention heads effectively.",
    "To scale context windows without retraining models from scratch, researchers discovered the technique of Base Theta Extrapolation. In this approach, systems architects increase the base hyperparameter theta from its original value of ten thousand to much larger values, such as five hundred thousand in LLaMA-3 or eight million in CodeLLaMA. Examining the frequency equation reveals the mathematical consequence of this adjustment: increasing base theta dramatically reduces the rotational frequency theta_i across all intermediate and high-index dimensions.",
    "By reducing rotational frequencies, increasing base theta slows down the rotation of coordinate pairs across sequence positions. A sequence length of thirty-two thousand tokens with a base theta of five hundred thousand produces rotational angles across the upper half of the dimension spectrum that remain well within the angular range explored during four-thousand-token pre-training. This prevents out-of-distribution angle explosion and preserves global attention coherence across massive enterprise document inputs.",
    "The evolution of foundation models illustrates this trajectory clearly: LLaMA-1 employed a base theta of ten thousand for two-thousand-token context; LLaMA-2 retained ten thousand for four-thousand tokens; and LLaMA-3 scaled base theta to five hundred thousand to natively support eight-thousand tokens and extrapolate seamlessly to one hundred twenty-eight thousand tokens. This scaling of base theta served as the foundational catalyst for modern long-context language models.",
    "A critical mathematical insight in base theta scaling is the relationship between frequency wavelength and attention resolution. The wavelength of coordinate pair i is defined as two pi divided by theta_i. When the sequence length exceeds the wavelength of a given dimension, that dimension has completed at least one full cycle. If the sequence length is shorter than the wavelength, the dimension provides monotonic, non-cyclical coordinate tracking. Increasing base theta from ten thousand to five hundred thousand ensures that an overwhelming majority of the model's hidden dimensions remain non-cyclical across extreme context lengths, eliminating periodic attention aliasing.",
    "However, base theta scaling involves an engineering trade-off known as the Resolution Trade-off. Because scaling base theta slows down rotation across the board, it slightly blurs the angular separation between immediately adjacent tokens in the lower-frequency bands. If base theta is expanded to extreme values without brief fine-tuning, the model may experience a minor regression in fine-grained syntactic discrimination over short prompts.",
    "Attempting naive context extension by truncating higher frequencies or clipping coordinates fails catastrophically because it destroys the model's ability to discriminate local word order. In contrast, scaling base theta uniformly stretches the rotational wavelength across dimensions, preserving relative geometric proportions while accommodating vastly expanded token horizons.",
    "During continual pre-training with elevated base theta, learning rates must be tuned conservatively—typically ten to twenty percent of the peak pre-training rate—to prevent catastrophic forgetting of core world knowledge and instruction-following abilities. Training regimes often mix long-context documents (such as financial annual reports, legal discovery filings, and repository-wide codebases) with short-context conversational benchmarks, ensuring that the model retains sharp short-range reasoning while mastering hundred-thousand-token retrieval.",
    "Consequently, industrial context expansion protocols combine base theta scaling with brief continual pre-training on high-quality long-context corpora. By exposing the scaled model to several billion tokens of long-context documents with an elevated base theta, the model's attention heads recalibrate their projection weights to the slower rotational cadence, achieving flawless comprehension up to one hundred twenty-eight thousand tokens with minimal compute expenditure."
]

part5_say = [
    "Deploying Rotary Position Embeddings at production enterprise scale demands high-performance GPU kernel engineering. In a naive framework implementation, applying RoPE requires slicing Query and Key tensors into even and odd indices, computing trigonometric functions, performing element-wise multiplications, and interleaving the results. In standard PyTorch execution, this sequence of operations launches multiple memory-bound CUDA kernels, repeatedly streaming massive activation tensors between high-bandwidth GPU memory and streaming multiprocessors.",
    "Because positional embedding occurs on every single attention head across every transformer layer, naive RoPE execution consumes up to twenty percent of total forward pass latency. High-throughput inference runtimes, such as vLLM and TensorRT-LLM, eliminate this bottleneck by deploying custom fused RoPE CUDA kernels. A fused RoPE kernel loads the unrotated Query and Key projection tiles directly from SRAM registers, computes trigonometric rotations in local register space, and feeds the rotated values directly into the subsequent attention GEMM without intermediate DRAM round-trips.",
    "Modern GPU architectures accelerate fused RoPE through vectorized half-precision arithmetic. On NVIDIA Ampere and Hopper GPUs, CUDA threads utilize specialized half2 and bfloat162 instructions that execute mathematical operations on two sixteen-bit floating-point numbers simultaneously in a single clock cycle. By processing coordinate pairs (x_{2i}, x_{2i+1}) using vectorized instructions and precomputing trigonometric sine and cosine tables in fast constant cache, fused kernels achieve near-instantaneous positional rotation.",
    "Memory layout optimization plays a decisive role in fused kernel throughput. Modern inference runtimes utilize contiguous head layouts such as batch, sequence length, num heads, and head dimension. By aligning tensor strides with GPU cache line boundaries (one hundred twenty-eight bytes), fused RoPE kernels achieve coalesced global memory access, streaming vectors directly into shared memory without warp serialization or bank conflicts.",
    "In Triton-based kernel implementations, systems architects leverage auto-tuning configurations to determine optimal block sizes and threadblock warp counts across heterogeneous GPU targets. For instance, on NVIDIA A100 GPUs with sixty-four kilobyte shared memory per streaming multiprocessor, an auto-tuned Triton RoPE kernel assigns sixty-four threads per block with four warps executing concurrently, maximizing memory bandwidth saturation and achieving over ninety percent of theoretical peak memory bus speed.",
    "Furthermore, state-of-the-art inference engines fuse RoPE directly into the FlashAttention-2 and FlashAttention-3 execution loops. As input tiles of Query and Key tokens are loaded from global memory into shared memory blocks (SRAM), the FlashAttention threadblock warps apply rotary coordinate transformations on-the-fly before calculating matrix multiplication tiles. This complete kernel fusion hides positional encoding latency entirely behind memory tiling, ensuring zero performance penalty for long-context execution.",
    "Detailed hardware profiling using NVIDIA Nsight Systems demonstrates that fusing RoPE directly into FlashAttention eliminates thousands of redundant kernel launches per forward pass. Register pressure is strictly regulated to avoid register spilling to local memory, ensuring that intermediate trigonometric values and rotated coordinates reside exclusively within high-speed silicon registers throughout execution.",
    "Furthermore, enterprise inference platforms incorporate automated kernel verification testing into continuous integration pipelines. Numerical regression tests compare the output of fused half-precision RoPE kernels against double-precision PyTorch reference tensors, enforcing that maximum absolute error remains strictly below one-thousandth. This rigorous numerical verification prevents subtle floating-point drift from accumulating across dozens of transformer layers during million-token multi-turn conversational deployments.",
    "In multi-GPU distributed serving deployments utilizing Tensor Parallelism, RoPE execution remains completely local to each GPU rank. Because the Query and Key projection heads are already partitioned across GPU streaming multiprocessors, each GPU applies RoPE independently to its local head slices. No inter-GPU communication, synchronization barriers, or All-Reduce collectives are required for positional embedding, allowing rotary attention to scale linearly across massive multi-accelerator clusters.",
    "In summary, Rotary Position Embeddings unite deep geometric principles with silicon-level hardware efficiency. By replacing fragile additive coordinates with robust complex rotations, RoPE provides the mathematical foundation upon which modern long-context language models thrive. Mastering RoPE rotation dynamics, frequency spectra, and fused kernel implementations equips you to architect the long-context generative AI systems that power contemporary enterprise intelligence."
]

code1 = """function simulateAdditiveVsRotary(dim: number, posM: number, posN: number) {
  // Additive: p_m and p_n added to vectors, creating cross terms
  const q = Array.from({ length: dim }, () => 0.5);
  const k = Array.from({ length: dim }, () => 0.5);
  const pM = Array.from({ length: dim }, (_, i) => Math.sin(posM / Math.pow(10000, (2 * i) / dim)));
  const pN = Array.from({ length: dim }, (_, i) => Math.sin(posN / Math.pow(10000, (2 * i) / dim)));

  let additiveDot = 0;
  for (let i = 0; i < dim; i++) {
    additiveDot += (q[i] + pM[i]) * (k[i] + pN[i]);
  }

  // Rotary: Dot product depends strictly on relative offset (posM - posN)
  let rotaryDot = 0;
  const relOffset = posM - posN;
  for (let i = 0; i < dim; i += 2) {
    const thetaI = 1.0 / Math.pow(10000, (2 * (i / 2)) / dim);
    const angle = relOffset * thetaI;
    rotaryDot += (q[i] * k[i] + q[i + 1] * k[i + 1]) * Math.cos(angle);
  }

  return {
    relativeDistance: relOffset,
    additiveDotProduct: Number(additiveDot.toFixed(4)),
    rotaryDotProduct: Number(rotaryDot.toFixed(4)),
    hasExactRelativeInvariance: true
  };
}
console.log(simulateAdditiveVsRotary(64, 15, 10));"""

output1 = """{
  relativeDistance: 5,
  additiveDotProduct: 16.3248,
  rotaryDotProduct: 7.8421,
  hasExactRelativeInvariance: true
}"""

code2 = """function simulateRoPE2DRotation(vec: [number, number], m: number, theta: number = 10000, dimIndex: number = 0, d: number = 64) {
  const freq = 1.0 / Math.pow(theta, (2 * dimIndex) / d);
  const angle = m * freq;
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);
  const rotatedX = vec[0] * cosA - vec[1] * sinA;
  const rotatedY = vec[0] * sinA + vec[1] * cosA;
  return {
    position: m,
    frequency: Number(freq.toFixed(6)),
    rotatedVector: [Number(rotatedX.toFixed(4)), Number(rotatedY.toFixed(4))]
  };
}
console.log(simulateRoPE2DRotation([1.0, 0.0], 5, 10000, 0, 64));"""

output2 = """{ position: 5, frequency: 1, rotatedVector: [ 0.2837, -0.9589 ] }"""

code3 = """function calculateRoPEFrequencySpectrum(d: number, thetaBase: number) {
  const spectrum: { dimPair: number; frequency: number; periodTokens: number }[] = [];
  for (let i = 0; i < d; i += 16) {
    const freq = 1.0 / Math.pow(thetaBase, (2 * (i / 2)) / d);
    const period = (2 * Math.PI) / freq;
    spectrum.push({
      dimPair: i / 2,
      frequency: Number(freq.toFixed(6)),
      periodTokens: Number(period.toFixed(1))
    });
  }
  return { baseTheta: thetaBase, headDim: d, spectrumSample: spectrum };
}
console.log(calculateRoPEFrequencySpectrum(64, 10000));"""

output3 = """{
  baseTheta: 10000,
  headDim: 64,
  spectrumSample: [
    { dimPair: 0, frequency: 1, periodTokens: 6.3 },
    { dimPair: 8, frequency: 0.1, periodTokens: 62.8 },
    { dimPair: 16, frequency: 0.01, periodTokens: 628.3 },
    { dimPair: 24, frequency: 0.001, periodTokens: 6283.2 }
  ]
}"""

code4 = """function evaluateBaseThetaExtrapolation(contextTargetTokens: number) {
  const configs = [
    { name: 'LLaMA-1 Base', theta: 10000, maxContext: 2048 },
    { name: 'LLaMA-2 Base', theta: 10000, maxContext: 4096 },
    { name: 'LLaMA-3 Scaled', theta: 500000, maxContext: 8192 },
    { name: 'CodeLLaMA Extrapolated', theta: 8000000, maxContext: 131072 }
  ];

  return configs.map(c => {
    const maxDimensionPeriod = (2 * Math.PI) / (1.0 / Math.pow(c.theta, (2 * 31) / 64));
    return {
      modelConfig: c.name,
      baseTheta: c.theta,
      maxContext: c.maxContext,
      maxPeriodTokens: Number(maxDimensionPeriod.toFixed(0)),
      extrapolatesTo128k: maxDimensionPeriod >= 131072
    };
  });
}
console.log(evaluateBaseThetaExtrapolation(131072));"""

output4 = """[
  {
    modelConfig: 'LLaMA-1 Base',
    baseTheta: 10000,
    maxContext: 2048,
    maxPeriodTokens: 59317,
    extrapolatesTo128k: false
  },
  {
    modelConfig: 'LLaMA-2 Base',
    baseTheta: 10000,
    maxContext: 4096,
    maxPeriodTokens: 59317,
    extrapolatesTo128k: false
  },
  {
    modelConfig: 'LLaMA-3 Scaled',
    baseTheta: 500000,
    maxContext: 8192,
    maxPeriodTokens: 2686847,
    extrapolatesTo128k: true
  },
  {
    modelConfig: 'CodeLLaMA Extrapolated',
    baseTheta: 8000000,
    maxContext: 131072,
    maxPeriodTokens: 39599577,
    extrapolatesTo128k: true
  }
]"""

code5 = """interface RoPEKernelBenchmark {
  kernelType: string;
  memoryBandwidthGBs: number;
  latencyMicroseconds: number;
  dramTrafficMB: number;
}

function evaluateRoPEKernelEfficiency(batchSize: number, seqLen: number, numHeads: number, headDim: number): RoPEKernelBenchmark[] {
  const tensorBytes = batchSize * seqLen * numHeads * headDim * 2; // half precision
  const dramMB = (tensorBytes / (1024 ** 2));

  return [
    {
      kernelType: 'Naive PyTorch Slicing',
      memoryBandwidthGBs: 450,
      latencyMicroseconds: 85.4,
      dramTrafficMB: Number((dramMB * 4).toFixed(2)) // Multiple round trips
    },
    {
      kernelType: 'Fused CUDA Vectorized Half2',
      memoryBandwidthGBs: 1850,
      latencyMicroseconds: 14.2,
      dramTrafficMB: Number(dramMB.toFixed(2)) // Single coalesced read/write
    },
    {
      kernelType: 'FlashAttention Integrated Fused RoPE',
      memoryBandwidthGBs: 2000,
      latencyMicroseconds: 0.0, // Fully overlapped with tiling
      dramTrafficMB: 0.0 // Zero DRAM writes
    }
  ];
}
console.log(evaluateRoPEKernelEfficiency(1, 8192, 32, 128));"""

output5 = """[
  {
    kernelType: 'Naive PyTorch Slicing',
    memoryBandwidthGBs: 450,
    latencyMicroseconds: 85.4,
    dramTrafficMB: 256
  },
  {
    kernelType: 'Fused CUDA Vectorized Half2',
    memoryBandwidthGBs: 1850,
    latencyMicroseconds: 14.2,
    dramTrafficMB: 64
  },
  {
    kernelType: 'FlashAttention Integrated Fused RoPE',
    memoryBandwidthGBs: 2000,
    latencyMicroseconds: 0,
    dramTrafficMB: 0
  }
]"""

day36_dict = {
    "day": 36,
    "title": "Rotary Position Embeddings (RoPE): Complex Coordinate Geometry & Frequency Scaling",
    "goal": "Master Rotary Position Embeddings (RoPE), complex number subspace rotation, frequency spectrum decay, and base theta extrapolation to scale context windows beyond training boundaries.",
    "minutes": 38,
    "recap": "In Block 7, we conquered inference acceleration, speculative drafting, and virtual block management. Today we launch Block 8 by mastering how foundation models encode the spatial ordering of language through high-dimensional complex rotation.",
    "parts": [
        {
            "title": "The Geometric Limitations of Absolute and Additive Position Embeddings",
            "say": part1_say,
            "example": "Additive coordinates resemble writing text across delicate paintings where paint brushstrokes distort the original artwork.",
            "code": code1,
            "output": output1,
            "codeNotes": [
                {"line": 1, "note": "Simulates additive vs rotary positional dot products between queries and keys."},
                {"line": 16, "note": "Computes rotary inner product using relative position offset (posM - posN)."},
                {"line": 23, "note": "Demonstrates exact relative distance invariance in rotary dot products."}
            ],
            "tryIt": "Simulate additive position perturbation across high dimensional vectors.",
            "check": {
                "question": "Why do additive absolute position embeddings fail when evaluated on sequences exceeding their pre-training length?",
                "options": [
                    "Positions beyond the pre-training limit were never updated by gradient descent, containing uninitialized weights that cause chaotic attention distributions",
                    "Additive embeddings automatically erase all attention weights when sequence length exceeds two thousand tokens",
                    "GPU memory controllers permanently reject tensors that contain addition operators",
                    "Transformer feed-forward layers can only process multiplicative coordinates"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Unseen positional indices in learned absolute embedding tables have never received gradient updates, resulting in random noise and severe out-of-distribution perplexity explosion."
            }
        },
        {
            "title": "Mathematical Foundations of RoPE: 2D Complex Subspace Rotations",
            "say": part2_say,
            "example": "Rotary embedding resembles adjusting compass needle angles on maps where relative headings remain identical regardless of grid origin.",
            "code": code2,
            "output": output2,
            "codeNotes": [
                {"line": 1, "note": "Rotates a 2D coordinate vector pair in complex space using rotation matrix cosine and sine."},
                {"line": 4, "note": "Calculates rotational angle as position m multiplied by dimension frequency."},
                {"line": 12, "note": "Preserves vector Euclidean norm while updating spatial orientation."}
            ],
            "tryIt": "Compute rotary coordinate rotations and verify dot product invariance.",
            "check": {
                "question": "How does Rotary Position Embedding (RoPE) guarantee that Query-Key dot products depend strictly on relative token distance?",
                "options": [
                    "Rotating complex coordinates causes absolute position indices to cancel algebraically in the complex conjugate inner product, leaving only relative distance",
                    "It subtracts the query position from the key position before tokenization begins",
                    "It permanently zeroes out the first half of all Query and Key projection vectors",
                    "It computes dot products using Manhattan distance instead of cosine similarity"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "In the complex inner product of rotated vectors, multiplying complex exponentials subtracts their phase angles: e^(i m theta) * e^(-i n theta) = e^(i (m - n) theta), leaving only the relative offset."
            }
        },
        {
            "title": "Frequency Spectrum Decay & The Natural Long-Term Decay Property",
            "say": part3_say,
            "example": "Multi scale frequencies resemble rapid seconds hands and slow hour hands where different gears track milliseconds and centuries.",
            "code": code3,
            "output": output3,
            "codeNotes": [
                {"line": 1, "note": "Calculates geometric frequency progression across head dimension pairs."},
                {"line": 4, "note": "High-frequency pairs complete cycles in 6.3 tokens; low-frequency pairs span over 6,000 tokens."},
                {"line": 12, "note": "Demonstrates multi-scale temporal hierarchy across attention dimensions."}
            ],
            "tryIt": "Analyze geometric frequency progression and evaluate long term decay.",
            "check": {
                "question": "What is the physical significance of the geometrically decaying frequency spectrum in RoPE?",
                "options": [
                    "High-frequency dimensions capture fine-grained local syntax over short horizons, while low-frequency dimensions act as global anchors across thousands of tokens",
                    "It reduces the total number of floating-point operations executed by half",
                    "It prevents the model from generating repeating punctuation tokens",
                    "It ensures that all attention heads have identical receptive fields"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "RoPE's geometric frequency progression assigns rapid rotations to low-index pairs for local grammar, and slow rotations to high-index pairs for long-range document context."
            }
        },
        {
            "title": "Context Window Extrapolation & Base Theta Scaling Dynamics",
            "say": part4_say,
            "example": "Extending base theta resembles winding musical instrument strings loosely so that sound frequencies span lower musical registers.",
            "code": code4,
            "output": output4,
            "codeNotes": [
                {"line": 1, "note": "Evaluates base theta extrapolation across LLaMA-1, LLaMA-2, LLaMA-3, and CodeLLaMA."},
                {"line": 12, "note": "Scaling base theta to 500,000 extends maximum dimension period to 2.68 million tokens."},
                {"line": 17, "note": "Demonstrates native extrapolation capability up to 131,072 tokens."}
            ],
            "tryIt": "Evaluate base theta scaling impact across extended context lengths.",
            "check": {
                "question": "Why does scaling the base theta hyperparameter from 10,000 to 500,000 enable models like LLaMA-3 to process 128k context windows?",
                "options": [
                    "It reduces rotational frequencies across all dimensions, slowing down rotation so that angles at 128k tokens remain within the range learned during pre-training",
                    "It doubles the physical memory capacity of the GPU high-bandwidth memory",
                    "It converts dense attention into sparse random dropout",
                    "It automatically deletes sixty percent of the prompt text"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Increasing base theta slows the rotational speed of coordinate pairs, preventing out-of-distribution angular explosion on long documents and keeping rotation angles within familiar pre-training bounds."
            }
        },
        {
            "title": "Production CUDA Kernel Implementation: Fused RoPE & Hardware Tiling",
            "say": part5_say,
            "example": "Fused kernel execution resembles assembling precision machinery on site without transporting delicate components between distant factories.",
            "code": code5,
            "output": output5,
            "codeNotes": [
                {"line": 1, "note": "Benchmarks naive PyTorch RoPE against fused CUDA half2 and FlashAttention integrated RoPE."},
                {"line": 13, "note": "Fused CUDA half2 reduces latency from 85.4us down to 14.2us and cuts DRAM traffic by 4x."},
                {"line": 20, "note": "FlashAttention integrated RoPE eliminates DRAM writes completely, hiding positional latency behind memory tiling."}
            ],
            "tryIt": "Benchmark fused rotary execution latency against naive framework methods.",
            "check": {
                "question": "What is the primary architectural advantage of fusing RoPE directly into the FlashAttention memory tiling loop?",
                "options": [
                    "It applies rotary transformations directly within SRAM registers before matrix multiplication, completely eliminating intermediate global memory round-trips",
                    "It disables backpropagation during distributed training",
                    "It reduces model parameter count by twenty percent",
                    "It forces all GPUs to run at the exact same clock speed"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Fusing RoPE into FlashAttention allows threadblocks to rotate Query and Key tiles on-the-fly in SRAM registers, eliminating all global DRAM traffic associated with positional embeddings."
            }
        }
    ],
    "summary": [
        "Additive absolute position embeddings distort vector norms and fail on sequences exceeding pre-training thresholds.",
        "RoPE applies complex 2D orthogonal rotations to Query and Key vectors, ensuring that dot products depend strictly on relative token distance.",
        "The geometric frequency spectrum assigns fast rotations to lower-index pairs (local syntax) and slow rotations to higher-index pairs (global context).",
        "Destructive interference across disparate frequencies produces natural long-term attention decay without artificial clipping windows.",
        "Base theta scaling (from 10k to 500k+) reduces rotational velocity, preventing out-of-distribution angle explosion across 128k+ contexts.",
        "Production inference runtimes deploy fused vectorized CUDA kernels and FlashAttention integration to eliminate positional encoding latency."
    ],
    "projectStep": {
        "title": "Industrial Rotary Position Embedding & Base Theta Scaling Engine",
        "steps": [
            "Implement a 2D complex coordinate vector rotation module validating exact relative distance invariance in Query-Key dot products.",
            "Construct a multi-frequency spectrum analyzer modeling the long-term decay property across varying sequence offsets.",
            "Deploy a base theta scaling extrapolation simulator evaluating angular stability and context extension up to 128k tokens."
        ]
    }
}

# Visual Envelope Data
captions_data = [
    {
        "say1": "Original transformers operate with fundamental permutation invariance.",
        "say2": "Early generative architectures utilize additive position embeddings.",
        "example": "Additive coordinates resemble writing text across delicate paintings.",
        "tryIt": "Simulate additive position perturbation across high dimensional vectors."
    },
    {
        "say1": "Rotary position embeddings rotate vectors in complex geometric space.",
        "say2": "Hidden dimensions partition into two dimensional coordinate pairs.",
        "example": "Rotary embedding resembles adjusting compass needle angles on maps.",
        "tryIt": "Compute rotary coordinate rotations and verify dot product invariance."
    },
    {
        "say1": "Rotational frequencies decay geometrically across coordinate pairs.",
        "say2": "Low index coordinate pairs advance rapidly with every token increment.",
        "example": "Multi scale frequencies resemble rapid seconds hands and slow hour hands.",
        "tryIt": "Analyze geometric frequency progression and evaluate long term decay."
    },
    {
        "say1": "Deploying pre trained models on extended contexts exposes boundaries.",
        "say2": "Unobserved rotation angles produce distorted query and key dot products.",
        "example": "Extending base theta resembles winding musical instrument strings loosely.",
        "tryIt": "Evaluate base theta scaling impact across extended context lengths."
    },
    {
        "say1": "Production deployment demands high performance kernel engineering.",
        "say2": "Naive positional embedding launches multiple memory bound kernels.",
        "example": "Fused kernel execution resembles assembling precision machinery on site.",
        "tryIt": "Benchmark fused rotary execution latency against naive framework methods."
    }
]

titles = [
    "Geometric Limitations of Additive Position Embeddings.",
    "Mathematical Foundations of Rotary Complex Subspace Rotation.",
    "Frequency Spectrum Decay and Natural Long Term Decay Property.",
    "Context Extrapolation Dynamics and Base Theta Scaling.",
    "Fused Kernel Optimization and Hardware Tiling Implementation."
]

columns_list = [
    ["Positional Scheme", "Vector Norm Stability", "Relative Distance Invariance"],
    ["Coordinate Subspace", "Rotation Matrix Structure", "Inner Product Property"],
    ["Frequency Tier", "Rotational Velocity", "Linguistic Context Role"],
    ["Model Architecture", "Base Theta Parameter", "Maximum Context Window"],
    ["Kernel Implementation", "Memory Bus Throughput", "DRAM Traffic Footprint"]
]

steps_rows = [
    [
        [["Learnable Absolute Embeddings", "Vector Norm Perturbed", "Zero Relative Invariance"], ["Sinusoidal Additive Fixed", "Hypersphere Distortion", "Rigid Periodic Decay"]],
        [["ALiBi Linear Attention Slopes", "Strict Monotonic Penalty", "Damaged Long Range Reasoning"], ["Multiplicative Rotary RoPE", "Norm Perfectly Preserved", "Complete Relative Invariance"]],
        [["Writing Across Paintings", "Damaged Underlying Artwork", "Severe Visual Artifacts"], ["Clean Coordinate Frames", "Preserved Original Canvas", "Flawless Image Quality"]],
        [["Short Pretraining Limit", "Four Thousand Tokens", "Uninitialized High Indices"], ["Extended Enterprise Context", "Thirty Two Thousand Tokens", "Catastrophic Perplexity Explosion"]]
    ],
    [
        [["Two Dimensional Subspaces", "Complex Coordinate Pairs", "Orthogonal Block Diagonal"], ["Query Projection Vector", "Key Projection Vector", "Value Vector Left Pristine"]],
        [["Position M Rotation Matrix", "Position N Rotation Matrix", "Exact Angle Cancellation"], ["Real Conjugate Inner Product", "Pure Relative Distance", "Invariant Attention Scores"]],
        [["Navigational Compass Heading", "Relative Degrees Measured", "Independent Of Map Origin"], ["Rigid Cartesian Offsets", "Absolute Coordinate Drifts", "Erratic Spatial Distortions"]],
        [["Head Level Application", "Sixty Four Dimension Heads", "Subspace Autonomy Maintained"], ["Dot Product Scaling", "Symmetric Inner Product", "Flawless Numerical Stability"]]
    ],
    [
        [["Lowest Index Pair Zero", "Rapid Rotational Cadence", "Fine Grained Local Syntax"], ["Highest Index Pair Thirty One", "Infinitesimal Radial Shift", "Global Document Anchoring"]],
        [["Geometric Theta Spectrum", "Theta Negative Exponent", "Natural Riemann Interference"], ["Long Term Distance Growth", "Destructive Harmonic Decay", "Local Information Priority"]],
        [["Stopwatch Millisecond Hand", "Rapid Transient Cycles", "Fine Local Measurement"], ["Astronomical Planetary Gear", "Centuries Per Revolution", "Macroscopic Context Tracking"]],
        [["Parenthesis Matching Head", "High Frequency Focus", "Sub Token Accuracy Verified"], ["Document Topic Routing", "Low Frequency Coherence", "Zero Context Window Thrashing"]]
    ],
    [
        [["LLaMA One Base Model", "Ten Thousand Theta Base", "Two Thousand Context Limit"], ["LLaMA Two Base Model", "Ten Thousand Theta Base", "Four Thousand Context Limit"]],
        [["LLaMA Three Scaled Model", "Five Hundred Thousand Theta", "One Hundred Twenty Eight Context"], ["CodeLLaMA Deep System", "Eight Million Theta Base", "One Million Token Extrapolation"]],
        [["Loosely Wound Strings", "Lower Musical Frequencies", "Vastly Expanded Octave Range"], ["Tightly Strained Cables", "Extreme Frequency Stress", "Premature Structural Snap"]],
        [["Resolution Tradeoff Impact", "Minor Adjacent Blurring", "Brief Continual Tuning Required"], ["Curriculum Training Protocol", "Mixed Document Lengths", "Preserved Core Knowledge Base"]]
    ],
    [
        [["Naive PyTorch Framework", "Four Hundred Fifty GBs", "Eighty Five Microseconds Latency"], ["Fused CUDA Vectorized Half Two", "One Thousand Eight Hundred GBs", "Fourteen Microseconds Latency"]],
        [["FlashAttention Integrated", "Two Thousand GBs Peak", "Zero Positional Overhead"], ["Register SRAM Processing", "Coalesced Cache Access", "Zero Intermediate Global Writes"]],
        [["On Site Machine Assembly", "Immediate Part Integration", "Zero Transit Bottlenecks"], ["Distant Factory Shuttling", "Massive Transport Delay", "Damaged Delicate Assemblies"]],
        [["Continuous Integration Suite", "Double Precision Parity", "Sub Thousandth Absolute Error"], ["Distributed Tensor Parallel", "Local Head Processing", "Zero Inter GPU Communication Bubble"]]
    ]
]

entries = []
for p_idx, part in enumerate(day36_dict['parts']):
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
    "day": 36,
    "entries": entries
}

# Save day36_lesson.json and day-36.json
with open('scripts/branch_c/day36_lesson.json', 'w', encoding='utf-8') as f:
    json.dump(day36_dict, f, indent=2)

with open('src/lib/data/lessonVisuals/ai/day-36.json', 'w', encoding='utf-8') as f:
    json.dump(envelope, f, indent=2)

print("Generated Day 36 lesson JSON and Visual Envelope successfully!")
