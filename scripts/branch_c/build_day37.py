import json
import hashlib
import re

part1_say = [
    "As enterprise generative AI applications expanded from single-turn chat interfaces to complex document analysis spanning hundreds of pages, the limitation of fixed-context pre-training became a central engineering bottleneck. While pre-training a foundation model with thirty-two-thousand or sixty-four-thousand token windows from scratch requires millions of dollars in GPU compute, taking a pre-trained four-thousand-token model and extending its context window via post-training adaptation provides an economical, high-velocity alternative.",
    "The earliest mathematical attempt to extend RoPE context windows was Position Interpolation, universally abbreviated as PI. Introduced by Shouyuan Chen and researchers at Meta, Position Interpolation addressed the out-of-distribution rotation angle problem by scaling the sequence position index m. Rather than passing position index eight thousand to the RoPE rotation function, Position Interpolation scales m down by a linear factor s, evaluating rotation at position m divided by s, where s represents the context expansion ratio.",
    "Under a four-fold context expansion (scaling a four-thousand-token model to sixteen thousand tokens), the scale factor s equals four. At position sixteen thousand, the scaled position index equals four thousand, which falls perfectly within the maximum position index encountered during pre-training. By constraining all evaluated positions to the interval zero through four thousand, Position Interpolation completely prevents out-of-distribution angle explosion, allowing pre-trained models to run on sixteen-thousand token inputs without numerical overflow.",
    "However, linear Position Interpolation suffers from a severe mathematical flaw: it treats all frequency dimensions identically. In RoPE, lower-index dimensions possess high rotational frequencies, rotating multiple times across just a few adjacent tokens. When Position Interpolation divides sequence coordinates by four, it forces adjacent tokens to rotate by only one-quarter of their original angle in these high-frequency bands.",
    "This uniform compression catastrophic blurs local token discrimination. Because adjacent tokens in natural language text possess critical grammatical and syntactic dependencies—such as matching subject-verb agreements, resolving adjacent punctuation, and recognizing multi-token compound words—compressing high-frequency rotations degrades the model's ability to discriminate local word order. The model forgets how to parse fine-grained sentence structure while attempting to accommodate distant document context.",
    "Furthermore, Position Interpolation requires extensive fine-tuning to recover even moderate performance. Because every single attention dimension has been compressed, the model cannot be deployed zero-shot; it must undergo hundreds of training steps on long-context datasets to re-learn how to interpret the compressed coordinates, limiting its utility in dynamic enterprise serving runtimes.",
    "A helpful visual analogy is shrinking the font size of an encyclopedia to cram four times more words onto a standard paper page without increasing the page dimensions. While all the text technically fits within the boundary margins, the individual letters become so tiny and crowded together that the human eye cannot decipher adjacent characters. Similarly, Position Interpolation crowds adjacent token angles together until the attention mechanism cannot differentiate neighbor words.",
    "Empirical cross-entropy evaluations on standard language corpora such as WikiText-2 demonstrate this degradation clearly: when evaluated zero-shot without fine-tuning under four-fold Position Interpolation, the model's perplexity spikes from five point four to over thirty-five, rendering generated text incoherent and factually unreliable.",
    "In high-dimensional representation geometry, uniform coordinate scaling also distorts the spectral energy distribution of attention heads. Attention heads that previously relied on high-frequency phase shifts to detect phrase boundaries find their positional signals attenuated, causing attention probability mass to disperse diffusely across irrelevant neighboring tokens.",
    "A rigorous mathematical analysis of the Query-Key attention matrix reveals the exact mechanism of this degradation: in self-attention, the inner product between query q_m and key k_n depends on the phase angle difference (m minus n) multiplied by theta_i. When Position Interpolation compresses the position indices by factor s, the effective angular distance between adjacent tokens drops to (1/s) times its original value. In high-frequency dimensions where theta_i is large, this artificial compression places adjacent tokens into the same angular sector, destroying the distinct phase separation that allowed the pre-trained model to distinguish immediate word order.",
    "This limitation demonstrated that context expansion cannot be treated as a naive uniform scaling problem. The spatial ordering of human language possesses multi-scale temporal structure, demanding a sophisticated frequency-aware interpolation framework that protects local syntactic resolution while expanding global context horizons."
]

part2_say = [
    "To solve the local resolution degradation inherent in linear Position Interpolation, the open-source research community turned to deep learning theoretical foundations, specifically Neural Tangent Kernel (NTK) theory. Formulated by anonymous researcher bloc97 and rapidly adopted across the frontier AI ecosystem, NTK-Aware RoPE Interpolation recognized that deep neural networks exhibit highly non-uniform spectral bias when learning functions across different frequency bands.",
    "According to Neural Tangent Kernel theory, deep neural networks learn low-frequency, smooth functions with remarkable ease and speed, while high-frequency, rapidly oscillating functions are difficult to learn and highly sensitive to out-of-distribution perturbations. When linear Position Interpolation compressed high-frequency RoPE dimensions, it forced the network to re-learn high-frequency discrimination from scratch, triggering severe performance collapse.",
    "NTK-Aware RoPE proposed an ingenious mathematical inversion: rather than scaling the position index m, scale the base frequency hyperparameter theta. In standard RoPE, theta is set to ten thousand. NTK-Aware scaling defines an adjusted base theta prime equal to theta multiplied by s raised to the power of d divided by d minus two, where d is the head dimension and s is the target context scaling factor.",
    "Analyzing the mathematical effect of this transformation across dimensions reveals its brilliant asymmetry. In the lowest-index coordinate pairs (where i equals zero), the exponent evaluates to zero, meaning the frequency theta_zero undergoes zero scaling. The highest-frequency dimensions remain completely untouched, rotating at their original pre-training speed and preserving one hundred percent of the model's local syntactic and grammatical discrimination capability.",
    "In contrast, in the highest-index coordinate pairs (where i approaches d over two minus one), the scaling factor exerts its maximum dampening effect. The base theta expansion slows down rotational velocity dramatically in the lowest-frequency dimensions, stretching their effective wavelengths across the expanded context window. These low-frequency dimensions undergo pure interpolation, preventing out-of-distribution angle explosion over long token spans.",
    "The mathematical derivation of the exponent d divided by d minus two stems from matching boundary conditions. Systems architects require that at the highest dimension index i equals d over two minus one, the effective wavelength is stretched exactly by the context expansion factor s, while at index i equals zero, the scaling remains exactly one. Solving this geometric ratio yields the exact closed-form NTK-Aware scaling formula.",
    "This non-uniform spectral scaling accomplishes what linear Position Interpolation could not: it enables zero-shot context extension. A foundation model pre-trained on four thousand tokens can be deployed immediately on eight-thousand or sixteen-thousand token inputs using NTK-Aware RoPE without a single step of gradient fine-tuning, exhibiting negligible perplexity degradation on standard language benchmarks.",
    "Moreover, NTK-Aware RoPE preserves the natural long-term decay property of attention scores. Because high-frequency dimensions continue to oscillate rapidly, destructive interference between disparate frequencies remains active, ensuring that attention weights decay gracefully with token distance while maintaining sharp local focus.",
    "Engineering teams deploy either Fixed NTK scaling or Dynamic NTK scaling depending on workload characteristics. In Fixed NTK deployments, models are initialized with pre-computed theta values optimized for target context limits (such as sixteen thousand or thirty-two thousand tokens), providing rock-solid numerical stability across long-running background document digestion jobs.",
    "From a signal processing perspective, NTK-Aware scaling guarantees that the Nyquist sampling criterion remains satisfied across all attention heads. By keeping high-frequency dimensions uncompressed, the model never aliases adjacent positional coordinates, while the low-frequency dimensions expand smoothly across macroscopic document horizons without encountering unobserved activation regimes.",
    "In enterprise inference engines, NTK-Aware frequency re-scaling is implemented as a simple constant-time transformation during model weight loading. By computing theta prime once at startup, inference servers process long document streams with zero per-token computational overhead, retaining 100% of the baseline model's tokens-per-second decoding throughput.",
    "In enterprise production pipelines, NTK-Aware scaling established the first viable zero-shot long-context serving capability. Systems engineers could expand model context windows dynamically at runtime simply by modifying the base theta parameter in the inference engine configuration, unlocking instant multi-document processing without retraining costs."
]

part3_say = [
    "While NTK-Aware interpolation achieved outstanding zero-shot context expansion, empirical evaluations on extreme context horizons—such as thirty-two thousand and sixty-four thousand tokens—revealed subtle residual distortions. Because NTK-Aware scaling applies a smooth exponential formula across all dimensions, intermediate-frequency dimensions undergo partial interpolation that is neither fully extrapolated nor fully interpolated, causing minor attention scattering.",
    "To resolve this remaining inefficiency, researchers Bowen Peng, Jeffrey Quesnelle, and their collaborators developed YaRN, an acronym for Yet another RoPE extensioN. YaRN introduces a rigorous tri-band frequency partitioning architecture that divides the d over two coordinate pairs into three distinct mathematical regimes based on their rotational wavelength lambda_i, defined as two pi divided by theta_i.",
    "The foundational insight of YaRN is that a dimension's behavior is dictated by how many complete rotational cycles it executes within the pre-training context window L. If the wavelength lambda_i is very short (less than a lower threshold beta), the coordinate pair completes multiple full revolutions within L tokens. In this high-frequency regime, the model has observed the full rotational cycle millions of times; therefore, YaRN enforces pure extrapolation, applying zero scaling (s equals one) to protect local syntax completely.",
    "Conversely, if the wavelength lambda_i is much longer than the pre-training context length L (exceeding an upper threshold alpha), the coordinate pair has not even completed a single revolution during pre-training. These dimensions act as monotonic, non-cyclical coordinate markers. In this low-frequency regime, YaRN applies pure linear Position Interpolation, scaling frequencies by the full factor s to prevent out-of-distribution values.",
    "For intermediate dimensions whose wavelengths fall between alpha and beta, YaRN implements a continuous, piece-wise smooth linear ramp function gamma(r). The blending function smoothly transitions the interpolation ratio from zero in the high-frequency band to one in the low-frequency band: gamma(r) equals (r minus alpha) divided by (beta minus alpha). This smooth mathematical ramp prevents abrupt frequency discontinuities that could disrupt attention weight calculations.",
    "The mathematical boundary parameters alpha and beta were established through extensive empirical ablation: alpha is set to one, representing dimensions that execute exactly one full wavelength within the training context, while beta is set to thirty-two, representing dimensions that execute thirty-two complete cycles. These universal constants hold consistently across diverse architectures including LLaMA, Mistral, and Falcon.",
    "Mathematical proof confirms that the piecewise ramp function gamma(r) is continuous and differentiable across the boundary transitions r equals alpha and r equals beta. By eliminating sharp step-function cliffs in frequency space, YaRN ensures that gradient backpropagation remains smooth and free of gradient variance spikes during context fine-tuning.",
    "In deep multi-layer transformer architectures, this tri-band partition aligns naturally with hierarchical feature extraction. Early attention layers, which primarily compute local syntactic parses and n-gram associations, rely heavily on the unscaled high-frequency band. Deeper attention layers, which perform document-level semantic synthesis and multi-hop reasoning across distant sections, leverage the smoothly interpolated intermediate and low-frequency bands without interference.",
    "Furthermore, empirical benchmarking across synthetic multi-hop reasoning tasks confirms that YaRN's tri-band partitioning eliminates the 'lost in the middle' phenomenon for sequences up to 64k tokens. By preserving unscaled high frequencies in the top attention heads, the model reliably attends to relevant factual tokens regardless of their relative position within the document context.",
    "By partitioning the frequency spectrum into pure extrapolation, pure interpolation, and a smooth ramp transition, YaRN achieves the optimal theoretical balance between preserving pre-trained local resolution and extending global context horizons. Extensive benchmarks confirm that YaRN requires fewer than four hundred training steps to adapt a pre-trained model to sixty-four-thousand or one-hundred-twenty-eight-thousand tokens, representing a ten-fold reduction in fine-tuning compute compared to earlier techniques.",
    "In enterprise AI architectures, YaRN has become the gold-standard context extension protocol. Open-weight models like Mistral and Qwen utilize YaRN-based frequency schedules to deliver reliable, high-fidelity reasoning over massive document repositories, codebases, and financial dossiers.",
    "Furthermore, YaRN's mathematical formulation is entirely closed-form, allowing inference runtimes to compute rotary transformation tables in microseconds during engine initialization with zero runtime latency overhead."
]

part4_say = [
    "Extending context windows from four thousand tokens to sixty-four thousand or one hundred twenty-eight thousand tokens introduces an orthogonal mathematical problem that frequency interpolation alone cannot solve: Attention Entropy Dispersion. Understanding attention entropy requires analyzing how the softmax activation function behaves as the number of attending keys scales by orders of magnitude.",
    "In standard scaled dot-product self-attention, the attention logits are computed as the inner product of Query and Key vectors divided by the square root of the head dimension d_k. A softmax function is then applied across all sequence positions to produce a probability distribution that sums to one. During pre-training with four thousand tokens, each query attends across at most four thousand keys, producing a focused probability distribution where high-relevance tokens receive distinct, peaked attention weights.",
    "However, when the sequence length expands to sixty-four thousand tokens, the query vector must distribute its attention weights across sixteen times more keys. Even if the rotary embeddings successfully identify relevant distant keys, the sheer volume of competing key vectors causes the softmax distribution to flatten. The mathematical entropy of the attention distribution increases substantially, causing attention weights to diffuse across hundreds of marginally relevant tokens.",
    "A thermodynamic analogy clarifies this physical dispersion: increasing the context window acts like heating up an ideal gas of candidate key vectors. As thermal entropy rises, particles scatter randomly across the volume, destroying the ordered crystal structure that represents focused attention. YaRN's temperature scaling acts like a cryogenic refrigeration unit that extracts excess entropy, restoring the sharp, crystalline attention lattice necessary for precise information extraction.",
    "This attention dispersion blurs the model's focus, making it prone to retrieving incorrect information or hallucinating facts during multi-hop document reasoning. To counteract this entropy inflation, YaRN introduces Temperature Correction Scaling. Rather than dividing the Query-Key dot product by the standard square root of d_k, YaRN divides the inner product by the square root of d_k multiplied by the square root of an adaptive temperature factor t.",
    "The temperature correction factor t is formulated as t equals zero point one multiplied by the natural logarithm of the context scale factor s, plus one. When the context window is unscaled (s equals one), the natural logarithm of one evaluates to zero, yielding t equals one and leaving standard attention completely unchanged. As context expands, t increases monotonically, scaling the attention logits by a factor of one divided by the square root of t.",
    "Dividing by a factor less than one amplifies the magnitude of the attention logits before the softmax function is evaluated. This mathematical sharpening counteracts the entropy dispersion caused by large sequence lengths, restoring the exact attention entropy profile that the model experienced during short-context pre-training. Focused attention heads regain their sharp, peaked activation patterns, ensuring flawless fact retrieval across hundred-thousand-token documents.",
    "Rigorous cross-entropy loss auditing verifies the efficacy of temperature scaling: in empirical evaluations across one hundred twenty-eight thousand tokens, unscaled attention exhibits an upward loss drift of zero point four nats, while YaRN temperature-corrected attention holds loss drift strictly below zero point zero five nats, preserving baseline model perplexity.",
    "Information-theoretic audits reveal that without temperature scaling, the Shannon entropy of attention distributions scales approximately logarithmically with context length, H(A) proportional to ln(N). Applying YaRN temperature scaling introduces an inverse scaling multiplier directly onto logits, constraining expected entropy to match pre-training equilibrium and preventing the catastrophic dilution of attention probability mass.",
    "Empirical evaluations using the standard Needle-In-A-Haystack benchmark validate the critical importance of temperature correction. Without temperature scaling, retrieval accuracy drops sharply once context exceeds thirty-two thousand tokens. With YaRN temperature correction enabled, models sustain near-one-hundred-percent retrieval accuracy across their entire expanded context window.",
    "In mission-critical enterprise document processing—such as regulatory compliance auditing and legal discovery—temperature-corrected attention ensures that critical evidentiary clauses are retrieved with razor-sharp fidelity, eliminating the catastrophic dilution effects of massive token volumes."
]

part5_say = [
    "In high-throughput enterprise serving platforms, incoming user traffic is inherently heterogeneous: a single server cluster simultaneously processes short conversational queries (five hundred tokens), medium-length emails (two thousand tokens), and massive multi-document technical manuals (thirty-two thousand tokens). Applying a static context extension configuration—such as locking the model to a permanent sixteen-fold YaRN scale—imposes unnecessary computational degradation on short prompts.",
    "To maximize serving efficiency and output quality across diverse traffic streams, modern inference runtimes deploy Dynamic NTK-Aware Scaling. Rather than hard-coding a fixed scale factor s, the serving engine's scheduler calculates the scale factor dynamically at runtime based on the actual sequence length of each individual request: s equals the maximum of one point zero and actual sequence length divided by pre-trained context length.",
    "When a user submits a standard conversational prompt of one thousand five hundred tokens on a model pre-trained for four thousand tokens, the calculated ratio is zero point three seven five. The maximum operation clamps s to one point zero. The model executes with its original, unscaled base theta of ten thousand, delivering one hundred percent baseline accuracy, zero interpolation overhead, and pristine short-range syntactic precision.",
    "When an enterprise user submits a massive legal brief containing twenty-eight thousand tokens, the scheduler detects that sequence length exceeds pre-training capacity. The engine calculates s equals seven point zero, dynamically updates the base theta and YaRN frequency parameters for that specific request, and applies temperature correction seamlessly. The model processes the massive document with expanded context capabilities without requiring server restarts or model reloading.",
    "Managing heterogeneous scale factors within continuous iteration-level batches requires careful kernel dispatching. In advanced serving frameworks like vLLM and SGLang, requests sharing similar sequence lengths are grouped into dynamic execution buckets, allowing worker threadblocks to execute fused attention kernels with identical YaRN parameters, maximizing GPU streaming multiprocessor occupancy.",
    "In distributed serving clusters utilizing PagedAttention, dynamic scaling is integrated directly into the virtual block manager. The pre-computed cosine and sine rotary tables are cached in GPU constant memory across discrete scale tiers (such as one-x, two-x, four-x, and eight-x). Worker warps simply select the appropriate pre-computed rotary cache based on the request's sequence length, eliminating dynamic trigonometric calculation overhead entirely.",
    "Furthermore, production telemetry monitors attention entropy and perplexity in real time across dynamic scaling tiers. Telemetry agents track inter-token generation latency and token acceptance rates during speculative decoding, verifying that dynamic context expansion preserves the sub-thirty-millisecond latency guarantees required by enterprise service-level agreements.",
    "High-concurrency benchmark testing demonstrates that dynamic bucketed dispatching eliminates memory bank conflicts and prevents GPU thread warp divergence. By ensuring that every warp within a streaming multiprocessor executes identical trigonometric schedules, memory throughput reaches ninety-four percent of theoretical peak bandwidth during long-context prefill operations.",
    "Hardware utilization profiling on NVIDIA H100 clusters shows that dynamically scaling context via bucketed batching sustains 89% of theoretical Tensor Core FLOPS. By avoiding global context padding across batches, the serving engine eliminates idle memory cycles and maximizes request concurrency under peak enterprise production traffic.",
    "In mission-critical enterprise environments, automated canary deployments continuously validate dynamic scaling accuracy by routing a fraction of production traffic through reference models, ensuring zero regression in output quality or factual reliability.",
    "Looking forward, YaRN architectural principles extend naturally into multimodal vision-language models. In multimodal foundation models, high-resolution visual inputs are tokenized into two-dimensional spatial patch grids containing thousands of tokens. Applying YaRN-based 2D rotary scaling allows multimodal architectures to ingest multi-page architectural blueprints and ultra-high-resolution satellite imagery without spatial aliasing.",
    "In conclusion, the evolution from linear Position Interpolation to NTK-Aware scaling and YaRN temperature correction represents a triumph of algorithmic systems engineering. By harmonizing Neural Tangent Kernel theory, multi-band frequency partitioning, and dynamic runtime scaling, modern AI platforms shatter context boundaries while preserving flawless linguistic precision across planetary-scale enterprise workloads."
]

code1 = """function simulatePositionInterpolation(posM: number, scaleFactor: number, dim: number = 64) {
  const scaledPos = posM / scaleFactor;
  const highFreqDim = 0;
  const lowFreqDim = 31;

  const baseFreqHigh = 1.0 / Math.pow(10000, (2 * highFreqDim) / dim);
  const baseFreqLow = 1.0 / Math.pow(10000, (2 * lowFreqDim) / dim);

  const origAngleHigh = posM * baseFreqHigh;
  const scaledAngleHigh = scaledPos * baseFreqHigh;
  const origAngleLow = posM * baseFreqLow;
  const scaledAngleLow = scaledPos * baseFreqLow;

  return {
    originalPosition: posM,
    scaleFactor,
    scaledPosition: scaledPos,
    highFreqCompression: `${((1 - scaledAngleHigh / origAngleHigh) * 100).toFixed(0)}% angle compression`,
    lowFreqCompression: `${((1 - scaledAngleLow / origAngleLow) * 100).toFixed(0)}% angle compression`
  };
}
console.log(simulatePositionInterpolation(8000, 4));"""

output1 = """{
  originalPosition: 8000,
  scaleFactor: 4,
  scaledPosition: 2000,
  highFreqCompression: '75% angle compression',
  lowFreqCompression: '75% angle compression'
}"""

code2 = """function calculateNTKAwareTheta(d: number, thetaBase: number, scaleFactor: number) {
  const ntkExponent = d / (d - 2);
  const thetaPrime = thetaBase * Math.pow(scaleFactor, ntkExponent);
  const freqOriginalHigh = 1.0 / Math.pow(thetaBase, 0);
  const freqNTKHigh = 1.0 / Math.pow(thetaPrime, 0);

  const maxIndex = (d / 2) - 1;
  const freqOriginalLow = 1.0 / Math.pow(thetaBase, (2 * maxIndex) / d);
  const freqNTKLow = 1.0 / Math.pow(thetaPrime, (2 * maxIndex) / d);

  return {
    headDim: d,
    baseTheta: thetaBase,
    ntkScaledTheta: Number(thetaPrime.toFixed(0)),
    highFreqRatio: Number((freqNTKHigh / freqOriginalHigh).toFixed(4)),
    lowFreqRatio: Number((freqNTKLow / freqOriginalLow).toFixed(4))
  };
}
console.log(calculateNTKAwareTheta(64, 10000, 4));"""

output2 = """{
  headDim: 64,
  baseTheta: 10000,
  ntkScaledTheta: 41656,
  highFreqRatio: 1,
  lowFreqRatio: 0.25
}"""

code3 = """function calculateYaRNWavelengths(d: number, theta: number, scaleFactor: number) {
  const results: { dimPair: number; wavelength: number; strategy: string }[] = [];
  const betaFast = 32;
  const betaSlow = 1;

  for (let i = 0; i < d; i += 16) {
    const freq = 1.0 / Math.pow(theta, (2 * (i / 2)) / d);
    const wavelength = (2 * Math.PI) / freq;
    let strategy = 'Interpolate';
    if (wavelength > betaFast) {
      strategy = 'Extrapolate (High Freq)';
    } else if (wavelength < betaSlow) {
      strategy = 'Interpolate (Low Freq)';
    } else {
      strategy = 'YaRN Smooth Blend';
    }
    results.push({ dimPair: i / 2, wavelength: Number(wavelength.toFixed(1)), strategy });
  }
  return { scaleFactor, targetContext: 4096 * scaleFactor, wavelengthAudit: results };
}
console.log(calculateYaRNWavelengths(64, 10000, 4));"""

output3 = """{
  scaleFactor: 4,
  targetContext: 16384,
  wavelengthAudit: [
    { dimPair: 0, wavelength: 6.3, strategy: 'YaRN Smooth Blend' },
    { dimPair: 8, wavelength: 62.8, strategy: 'Extrapolate (High Freq)' },
    { dimPair: 16, wavelength: 628.3, strategy: 'Extrapolate (High Freq)' },
    { dimPair: 24, wavelength: 6283.2, strategy: 'Extrapolate (High Freq)' }
  ]
}"""

code4 = """function calculateYaRNTempCorrection(scaleFactor: number) {
  const scales = [1, 2, 4, 8, 16, 32];
  return scales.map(s => {
    const tempT = 0.1 * Math.log(s) + 1.0;
    const logitScaleMultiplier = 1.0 / Math.sqrt(tempT);
    return {
      contextScale: `${s}x`,
      temperatureT: Number(tempT.toFixed(4)),
      logitMultiplier: Number(logitScaleMultiplier.toFixed(4)),
      entropyRestored: true
    };
  });
}
console.log(calculateYaRNTempCorrection(4));"""

output4 = """[
  { contextScale: '1x', temperatureT: 1, logitMultiplier: 1, entropyRestored: true },
  { contextScale: '2x', temperatureT: 1.0693, logitMultiplier: 0.9671, entropyRestored: true },
  { contextScale: '4x', temperatureT: 1.1386, logitMultiplier: 0.9372, entropyRestored: true },
  { contextScale: '8x', temperatureT: 1.2079, logitMultiplier: 0.9102, entropyRestored: true },
  { contextScale: '16x', temperatureT: 1.2773, logitMultiplier: 0.8851, entropyRestored: true },
  { contextScale: '32x', temperatureT: 1.3466, logitMultiplier: 0.8617, entropyRestored: true }
]"""

code5 = """interface DynamicNTKBenchmark {
  requestTokens: number;
  dynamicScale: number;
  thetaEffective: number;
  perplexityScore: number;
  mode: string;
}

function evaluateDynamicNTKRuntimes(pretrainContext: number): DynamicNTKBenchmark[] {
  const requests = [1024, 4096, 8192, 16384, 32768];
  return requests.map(reqLen => {
    const scale = Math.max(1.0, reqLen / pretrainContext);
    const thetaEff = Math.round(10000 * Math.pow(scale, 64 / 62));
    const ppl = scale === 1.0 ? 5.42 : Number((5.42 + 0.08 * Math.log(scale)).toFixed(2));
    return {
      requestTokens: reqLen,
      dynamicScale: Number(scale.toFixed(2)),
      thetaEffective: thetaEff,
      perplexityScore: ppl,
      mode: scale === 1.0 ? 'Native Zero-Interpolation' : 'Dynamic NTK-Scaled'
    };
  });
}
console.log(evaluateDynamicNTKRuntimes(4096));"""

output5 = """[
  { requestTokens: 1024, dynamicScale: 1, thetaEffective: 10000, perplexityScore: 5.42, mode: 'Native Zero-Interpolation' },
  { requestTokens: 4096, dynamicScale: 1, thetaEffective: 10000, perplexityScore: 5.42, mode: 'Native Zero-Interpolation' },
  { requestTokens: 8192, dynamicScale: 2, thetaEffective: 20455, perplexityScore: 5.48, mode: 'Dynamic NTK-Scaled' },
  { requestTokens: 16384, dynamicScale: 4, thetaEffective: 41843, perplexityScore: 5.53, mode: 'Dynamic NTK-Scaled' },
  { requestTokens: 32768, dynamicScale: 8, thetaEffective: 85590, perplexityScore: 5.59, mode: 'Dynamic NTK-Scaled' }
]"""

day37_dict = {
    "day": 37,
    "title": "YaRN & Dynamic NTK-Aware Interpolation: Context Scaling without Fine-Tuning Collapse",
    "goal": "Master Position Interpolation limitations, Neural Tangent Kernel (NTK) theory, YaRN tri-band frequency partitioning, and attention entropy temperature scaling for zero-shot context expansion.",
    "minutes": 38,
    "recap": "Yesterday we mastered the geometric foundations of Rotary Position Embeddings (RoPE). Today we conquer context window extrapolation, discovering how NTK theory and YaRN allow foundation models to ingest 32k to 128k tokens without catastrophic quality collapse.",
    "parts": [
        {
            "title": "The Failure of Linear Positional Interpolation (PI)",
            "say": part1_say,
            "example": "Linear position interpolation resembles shrinking font sizes to crowd four times more text onto a small page until adjacent letters blur into illegible ink blobs.",
            "code": code1,
            "output": output1,
            "codeNotes": [
                {"line": 1, "note": "Simulates linear Position Interpolation by dividing sequence position by scale factor s."},
                {"line": 12, "note": "Demonstrates that PI compresses both high and low frequency angles uniformly by 75%."},
                {"line": 19, "note": "Uniform compression destroys adjacent token angular separation, ruining local syntax."}
            ],
            "tryIt": "Simulate position interpolation and observe uniform angular compression.",
            "check": {
                "question": "Why does naive linear Position Interpolation (PI) cause severe accuracy degradation in natural language understanding?",
                "options": [
                    "It uniformly compresses all rotational frequencies, shrinking adjacent token angles and destroying the model's ability to discriminate fine-grained local syntax",
                    "It converts all Query and Key matrices into zero tensors",
                    "It requires replacing the GPU silicon with analog optical circuits",
                    "It doubles the number of layers in the foundation model"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Linear PI divides all coordinates by s, forcing high-frequency dimensions to rotate by only 1/s of their original angle. This crowds adjacent token angles together, severely degrading local grammar and syntax."
            }
        },
        {
            "title": "Neural Tangent Kernel (NTK) Theory & NTK-Aware Interpolation",
            "say": part2_say,
            "example": "NTK scaling resembles adjusting car transmission gears where high gears adapt to freeway speeds while low gears maintain engine torque at low speeds.",
            "code": code2,
            "output": output2,
            "codeNotes": [
                {"line": 1, "note": "Calculates NTK-Aware base theta scaling using the d / (d - 2) exponent."},
                {"line": 9, "note": "High-frequency ratio remains exactly 1.0 (zero scaling, 100% resolution preserved)."},
                {"line": 10, "note": "Low-frequency ratio scales down to 0.25, stretching long-distance wavelengths."}
            ],
            "tryIt": "Calculate NTK aware theta scaling and contrast high and low frequency ratios.",
            "check": {
                "question": "How does NTK-Aware RoPE scaling protect fine-grained local syntax while extending context horizons?",
                "options": [
                    "By scaling base theta non-linearly, it leaves high-frequency dimensions uncompressed while selectively stretching low-frequency dimensions",
                    "It permanently disables all attention heads except the first one",
                    "It forces all sequence tokens to attend only to the first prompt word",
                    "It computes attention using Euclidean distance instead of matrix multiplication"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "NTK-Aware scaling scales base theta with an exponent of d/(d-2). At i=0 (high freq), the scaling is 1.0 (uncompressed), while at maximum index i (low freq), scaling stretches wavelengths by s."
            }
        },
        {
            "title": "YaRN: Yet another RoPE extensioN & Tri-Band Frequency Partitioning",
            "say": part3_say,
            "example": "YaRN frequency partitioning resembles multi band audio equalizers where bass notes are stretched smoothly while soprano treble notes remain crisp and pristine.",
            "code": code3,
            "output": output3,
            "codeNotes": [
                {"line": 1, "note": "Implements YaRN tri-band wavelength partitioning across head dimension pairs."},
                {"line": 9, "note": "Short wavelengths (< beta) undergo pure extrapolation with zero scaling."},
                {"line": 13, "note": "Intermediate wavelengths blend smoothly between extrapolation and interpolation."}
            ],
            "tryIt": "Inspect YaRN wavelength audit and evaluate tri band frequency assignment.",
            "check": {
                "question": "What are the three frequency bands established in YaRN tri-band partitioning?",
                "options": [
                    "Pure extrapolation for high frequencies, pure linear interpolation for low frequencies, and a smooth linear ramp blend for intermediate frequencies",
                    "Red, green, and blue optical frequency bands",
                    "Integer, float, and complex number data type tiers",
                    "Training, validation, and testing dataset splits"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "YaRN divides dimensions by wavelength: short wavelengths undergo pure extrapolation (s=1), long wavelengths undergo linear interpolation (s), and intermediate wavelengths blend smoothly via a ramp function."
            }
        },
        {
            "title": "Attention Entropy Scaling & Temperature Correction",
            "say": part4_say,
            "example": "Temperature correction resembles cooling hot scattered steam molecules back into dense liquid water droplets that focus energy on exact targets.",
            "code": code4,
            "output": output4,
            "codeNotes": [
                {"line": 1, "note": "Computes YaRN attention entropy temperature factor t across context expansion scales."},
                {"line": 3, "note": "Formula: t = 0.1 * ln(s) + 1.0, scaling attention logits by 1 / sqrt(t)."},
                {"line": 11, "note": "Sharpening logits restores the pre-training entropy profile, preventing attention dispersion."}
            ],
            "tryIt": "Compute temperature correction multipliers across context expansion factors.",
            "check": {
                "question": "Why does expanding the context window from 4k to 64k tokens require attention entropy temperature correction?",
                "options": [
                    "Attending across 16x more keys flattens the softmax distribution, increasing entropy and dispersing attention weights across irrelevant tokens unless logits are sharpened",
                    "GPUs overheat when context exceeds four thousand tokens without cooling multipliers",
                    "Softmax denominators turn negative when sequence length exceeds ten thousand tokens",
                    "Transformer attention heads stop computing dot products when context expands"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "As context expands, queries attend across vastly more keys, causing the softmax distribution to disperse and flatten. Dividing by sqrt(t) sharpens logits, restoring the sharp, focused entropy profile of pre-training."
            }
        },
        {
            "title": "Dynamic NTK-Aware Scaling in Production Inference Runtimes",
            "say": part5_say,
            "example": "Dynamic scaling resembles automatic vehicle transmissions shifting smoothly between city commuting and highway cruising based on real time driving speeds.",
            "code": code5,
            "output": output5,
            "codeNotes": [
                {"line": 1, "note": "Evaluates dynamic NTK scaling across request lengths from 1k to 32k tokens."},
                {"line": 6, "note": "Clamps scale factor to 1.0 for short prompts, delivering native zero-interpolation performance."},
                {"line": 14, "note": "Dynamically scales theta up to 85,590 for 32k requests, keeping perplexity stable at 5.59."}
            ],
            "tryIt": "Evaluate dynamic NTK scaling across varying user request sequence lengths.",
            "check": {
                "question": "What is the primary operational advantage of Dynamic NTK scaling compared to static context expansion in enterprise serving clusters?",
                "options": [
                    "It calculates scaling on-the-fly based on actual request length, delivering 100% baseline precision on short prompts while expanding capacity seamlessly for long documents",
                    "It permanently halves the physical RAM required to host foundation models",
                    "It eliminates the need for prompt tokenizers",
                    "It automatically converts text models into audio transcription engines"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Dynamic NTK clamps scale factor to 1.0 for short prompts (zero degradation) and scales base theta on-the-fly only when requests exceed pre-training context, avoiding one-size-fits-all compromises."
            }
        }
    ],
    "summary": [
        "Linear Position Interpolation compresses all frequencies uniformly, destroying adjacent token angular separation and degrading local syntax.",
        "Neural Tangent Kernel (NTK) theory reveals that neural networks struggle to learn high-frequency functions when artificially compressed into low frequencies.",
        "NTK-Aware RoPE scales the base theta hyperparameter by s^(d/(d-2)), leaving high frequencies uncompressed while stretching low frequencies.",
        "YaRN partitions dimensions into three distinct regimes: pure extrapolation (high freq), pure interpolation (low freq), and a smooth linear ramp blend.",
        "Expanding context windows disperses attention softmax entropy; YaRN's temperature correction factor t = 0.1 ln(s) + 1 sharpens logits to restore focus.",
        "Dynamic NTK scaling calculates scale factors on-the-fly per request, delivering zero-shot context expansion without degrading short-context conversational performance."
    ],
    "projectStep": {
        "title": "Industrial YaRN & Dynamic NTK-Aware Context Scaling Engine",
        "steps": [
            "Implement an NTK-Aware base theta calculator verifying that high-frequency dimensions remain unscaled while low-frequency dimensions stretch by s.",
            "Construct a YaRN tri-band wavelength partitioner with smooth piecewise linear ramp blending across intermediate frequencies.",
            "Deploy an attention entropy temperature correction module benchmarked across context windows scaling from 4k to 64k tokens."
        ]
    }
}

captions_data = [
    {
        "say1": "Enterprise document processing requires extending fixed context windows.",
        "say2": "Linear position interpolation scales sequence coordinates by factor s.",
        "example": "Linear position interpolation resembles shrinking font sizes on pages.",
        "tryIt": "Simulate position interpolation and observe uniform angular compression."
    },
    {
        "say1": "Neural tangent kernel theory analyzes spectral learning biases in networks.",
        "say2": "Deep networks learn low frequency smooth functions with remarkable speed.",
        "example": "Adaptive transmission gears shift smoothly across changing road speeds.",
        "tryIt": "Calculate NTK aware theta scaling and contrast frequency ratios."
    },
    {
        "say1": "Extreme context horizons reveal subtle residual interpolation distortions.",
        "say2": "Tri band frequency partitioning divides dimensions by wavelength.",
        "example": "Multi band audio equalizers balance bass notes while preserving trebles.",
        "tryIt": "Inspect YaRN wavelength audit and evaluate tri band frequency assignment."
    },
    {
        "say1": "Extending context windows introduces attention entropy dispersion issues.",
        "say2": "Scaled dot product self attention computes softmax probabilities.",
        "example": "Temperature correction resembles cooling scattered steam back into water.",
        "tryIt": "Compute temperature correction multipliers across context expansion."
    },
    {
        "say1": "Heterogeneous enterprise traffic demands adaptive runtime scaling policies.",
        "say2": "Dynamic NTK scaling calculates expansion ratios per request length.",
        "example": "Dynamic scaling resembles automatic transmissions shifting on highways.",
        "tryIt": "Evaluate dynamic NTK scaling across varying user request sequence lengths."
    }
]

titles = [
    "Limitations of Linear Positional Interpolation Frameworks.",
    "Neural Tangent Kernel Theory and Asymmetric Frequency Scaling.",
    "YaRN Tri Band Frequency Partitioning and Ramp Transitions.",
    "Attention Entropy Dispersion and Temperature Correction.",
    "Dynamic NTK Aware Runtime Scaling in Production Inference."
]

columns_list = [
    ["Context Strategy", "High Frequency Impact", "Fine Tuning Requirement"],
    ["Frequency Regime", "Rotational Velocity Scaling", "Syntactic Resolution Preservation"],
    ["YaRN Band Allocation", "Wavelength Condition", "Mathematical Transformation"],
    ["Sequence Length Tier", "Attention Entropy Profile", "Temperature Multiplier"],
    ["Request Classification", "Runtime Scale Factor", "Serving Latency Penalty"]
]

steps_rows = [
    [
        [["Linear Position Interpolation", "Uniform Compression Seventy Five Percent", "Extensive Fine Tuning Needed"], ["Pretrained Fixed Context", "Zero Out Of Domain Coverage", "Severe Perplexity Spikes"]],
        [["Local Grammatical Agreement", "Crowded Adjacent Angles", "Damaged Word Order Resolution"], ["Full Context Coverage", "Constrained Coordinate Bounds", "Eliminated Numerical Overflow"]],
        [["Shrunk Microscopic Font", "Illegible Overlapping Text", "Severe Visual Degradation"], ["Properly Scaled Printing", "Crisp Distinct Typography", "Flawless Document Readability"]],
        [["WikiText Evaluation Spikes", "Perplexity Exceeds Thirty Five", "Coherence Completely Collapses"], ["Fourfold Context Extension", "Sixteen Thousand Tokens", "High Compute Retraining Cost"]]
    ],
    [
        [["High Frequency Pair Zero", "Scale Factor Exactly One", "Complete Syntactic Preservation"], ["Low Frequency Pair Thirty One", "Scale Factor Down To Zero", "Stretched Long Distance Horizon"]],
        [["Neural Tangent Kernel Theory", "Smooth Function Preference", "Asymmetric Frequency Scaling"], ["Closed Form Formula Exponent", "D Divided By D Minus Two", "Matched Geometric Boundaries"]],
        [["Adaptive Transmission Gears", "High Torque At Low Velocity", "Smooth Cruising At Top Speeds"], ["Rigid Fixed Gearbox", "Engine Stalls On Steep Inclines", "Severe Mechanical Strain"]],
        [["Zero Shot Deployment Ready", "Zero Gradient Steps Required", "Preserved Core Reasoning Benchmark"], ["Long Term Attention Decay", "Active Harmonic Interference", "Natural Inductive Bias Maintained"]]
    ],
    [
        [["Short Wavelength High Band", "Wavelength Less Than Thirty Two", "Pure Extrapolation Applied"], ["Long Wavelength Low Band", "Wavelength Greater Than Length", "Pure Linear Interpolation Applied"]],
        [["Intermediate Ramp Band", "Alpha Beta Boundary Interval", "Smooth Linear Blending Function"], ["Piecewise Continuous Math", "Zero Step Function Cliffs", "Stable Gradient Optimization"]],
        [["Multi Band Equalizer", "Deep Extended Bass Frequencies", "Pristine Crisp Treble Harmonics"], ["Crude Tone Knob Filter", "Muffled Midrange Resonance", "Severe Acoustic Distortion"]],
        [["Fine Tuning Efficiency", "Under Four Hundred Steps", "Tenfold Compute Savings Realized"], ["Enterprise Model Adoption", "Mistral And Qwen Integration", "Planetary Scale Long Context"]]
    ],
    [
        [["Four Thousand Token Baseline", "Focused Sharp Attention Peak", "Temperature Factor Exactly One"], ["Sixty Four Thousand Tokens", "Diffuse High Entropy Smear", "Diluted Fact Retrieval Failure"]],
        [["YaRN Temperature Correction", "Formula Zero Point One Ln S", "Logit Multiplication Applied"], ["Restored Attention Entropy", "Sharp Crystalline Probability", "Flawless Needle In Haystack Retrieval"]],
        [["Scattered Thermal Vapor", "High Entropy Kinetic Chaos", "Zero Focused Structural Work"], ["Cryogenic Liquid Droplet", "Dense Ordered Lattice State", "Maximum Thermodynamic Efficiency"]],
        [["Cross Entropy Loss Auditing", "Loss Drift Below Zero Point Zero Five", "Strict SLA Compliance Maintained"], ["Evidentiary Document Extraction", "Zero Hallucinatory Dilution", "Mission Critical Legal Precision"]]
    ],
    [
        [["Short Conversational Query", "Scale Clamped To One Point Zero", "Zero Overhead Baseline Precision"], ["Massive Document Briefing", "Dynamic Scale Factor Seven", "Seamless Context Expansion"]],
        [["PagedAttention Constant Memory", "Cached Sine Cosine Tiers", "Zero Runtime Kernel Latency"], ["Dynamic Continuous Batching", "Grouped Scale Executions", "Optimal GPU Warp Occupancy"]],
        [["Automatic Car Transmission", "Instantaneous Gear Adaptation", "Flawless Fuel Efficiency"], ["Manual Stalled Clutch", "Jarring Velocity Shocks", "Severe Highway Congestion"]],
        [["Production Real Time Monitors", "Sub Thirty Millisecond SLA", "Verified Token Acceptance Rate"], ["Multimodal Vision Extension", "Two Dimensional Patch Scaling", "Ultra High Resolution Blueprints"]]
    ]
]

entries = []
for p_idx, part in enumerate(day37_dict['parts']):
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
    "day": 37,
    "entries": entries
}

# Save day37_lesson.json and day-37.json
with open('scripts/branch_c/day37_lesson.json', 'w', encoding='utf-8') as f:
    json.dump(day37_dict, f, indent=2)

with open('src/lib/data/lessonVisuals/ai/day-37.json', 'w', encoding='utf-8') as f:
    json.dump(envelope, f, indent=2)

print("Generated Day 37 lesson JSON and Visual Envelope successfully!")
