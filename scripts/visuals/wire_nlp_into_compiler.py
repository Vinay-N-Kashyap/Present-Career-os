import sys

def wire_nlp():
    file_path = 'scripts/visuals/compile-500p-srs-pdf.mts'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add import
    import_target = "import { SOFTSKILLS_COMMUNICATION_MONTH_1_SPECS, SOFTSKILLS_COMMUNICATION_MONTH_2_SPECS } from './softskills-communication-masterclass-spec';"
    import_replacement = (
        "import { SOFTSKILLS_COMMUNICATION_MONTH_1_SPECS, SOFTSKILLS_COMMUNICATION_MONTH_2_SPECS } from './softskills-communication-masterclass-spec';\n"
        "import { NLP_MONTH_1_SPECS, NLP_MONTH_2_SPECS } from './nlp-masterclass-spec';"
    )
    if import_target not in content:
        print("Error: import target not found!")
        sys.exit(1)
    content = content.replace(import_target, import_replacement, 1)

    # 2. Add capstone project
    capstone_target = "if (courseId.includes('softskills') || courseId.includes('communication')) return 'ApexExecutiveComms: Enterprise Cross-Functional Alignment, Crisis Escalation & Principal Engineer Interview Portfolio Suite';"
    capstone_replacement = (
        "if (courseId.includes('softskills') || courseId.includes('communication')) return 'ApexExecutiveComms: Enterprise Cross-Functional Alignment, Crisis Escalation & Principal Engineer Interview Portfolio Suite';\n"
        "  if (courseId.includes('nlp')) return 'ApexTransformer: Sovereign Foundation Transformer Architecture, Alignment, RAG & LLMOps Engine';"
    )
    if capstone_target not in content:
        print("Error: capstone target not found!")
        sys.exit(1)
    content = content.replace(capstone_target, capstone_replacement, 1)

    # 3. Add renderNlpDayCard
    renderer_target = "function renderSoftskillsCommunicationDayCard(day: any): string {"
    nlp_renderer = """function renderNlpDayCard(day: any): string {
  const questsHtml = day.quests.map((q: any, i: number) => `
    <div style="margin-bottom: 2px;">
      <span style="font-family: monospace; font-size: 6.8pt; background: #cffafe; color: #0e7490; padding: 1px 3px; border-radius: 2px;">${q.id || ('Q' + day.day + '.' + (i + 1))}</span>
      <strong>${q.name || q.title}</strong> <em>(${q.type})</em>: <span style="color: #475569;">${q.desc || q.description}</span>
    </div>
  `).join('');

  const ansIdx = day.situationalPuzzle.correctOptionIndex !== undefined ? day.situationalPuzzle.correctOptionIndex : (day.situationalPuzzle.answerIdx ?? 0);
  const debrief = day.situationalPuzzle.explanation || day.situationalPuzzle.debrief || '';

  return `
    <div class="daily-card" style="margin-bottom: 10pt; page-break-inside: avoid; border-left: 3px solid #0891b2;">
      <div class="daily-card-header">
        <div>
          <span style="background: #0e7490; color: #ecfeff; font-size: 7.5pt; font-weight: 700; padding: 1px 5px; border-radius: 2px;">Day ${day.day}</span>
          <strong style="margin-left: 6pt; font-size: 8.8pt; color: #155e75;">${day.title}</strong>
          <span class="stage-pill" style="background: #cffafe; color: #0e7490;">${day.stageName}</span>
        </div>
        <span style="font-size: 7.2pt; color: #64748b;">Month ${day.month} &bull; Block ${day.blockNum} &bull; <strong>${day.quests.length} Quests</strong></span>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5pt; margin-bottom: 4pt; font-size: 7.2pt;">
        <div style="background: #ecfeff; padding: 4pt 6pt; border-radius: 3px; border: 1px solid #a5f3fc;">
          <strong>🎯 Spoken Goal &amp; Invariant:</strong><br>
          <span style="color: #0e7490; font-weight: 600;">Goal:</span> ${day.spokenGoal}<br>
          <span style="color: #155e75; font-weight: 600;">Invariant:</span> <code>${day.conceptInvariant}</code>
        </div>
        <div style="background: #fef2f2; padding: 4pt 6pt; border-radius: 3px; border: 1px solid #fecaca; color: #991b1b;">
          <strong>⚠️ Failure Mode &amp; tryIt Bug:</strong><br>
          <strong>Failure:</strong> ${day.failureMode}<br>
          <strong>tryIt Friction:</strong> ${day.tryItFriction}
        </div>
      </div>

      <div style="background: #ecfeff; border: 1px solid #a5f3fc; border-radius: 3px; padding: 3pt 6pt; margin-bottom: 4pt; font-size: 7.0pt;">
        <strong style="color: #0e7490;">🪜 Socratic Hint Ladder:</strong>
        <ol style="margin: 2px 0 2px 14px; padding: 0; color: #155e75;">
          ${day.socraticHints.map((hint: string) => `<li>${hint}</li>`).join('')}
        </ol>
      </div>

      <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 3px; padding: 3pt 6pt; margin-bottom: 4pt; font-size: 7.0pt;">
        <strong style="color: #0e7490;">🧩 Situational Production Puzzle:</strong>
        <p style="margin: 2px 0; color: #1e293b;">${day.situationalPuzzle.scenario || day.situationalPuzzle.prompt}</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3pt; margin: 2px 0;">
          ${day.situationalPuzzle.options.map((opt: string, i: number) => `
            <div style="background: ${i === ansIdx ? '#cffafe' : '#ffffff'}; border: 1px solid ${i === ansIdx ? '#0891b2' : '#e2e8f0'}; padding: 2px 4px; border-radius: 2px; font-size: 6.8pt;">
              <strong>${String.fromCharCode(65 + i)}:</strong> ${opt} ${i === ansIdx ? '<strong style="color: #0e7490;">✓ [Optimal Systems Leadership Decision]</strong>' : ''}
            </div>
          `).join('')}
        </div>
        <div style="margin-top: 2px; color: #0e7490; font-size: 6.8pt;"><strong>Strategic Debrief:</strong> ${debrief}</div>
      </div>

      <div style="margin-top: 4pt; font-size: 7.2pt; border-top: 1px dashed #e2e8f0; padding-top: 3pt;">
        <strong style="color: #155e75;">4 Rigorous Quests (Concept &bull; Detective &bull; Mastery Assignment &bull; Incident Lab):</strong>
        <div style="margin-top: 2pt;">
          ${questsHtml}
        </div>
      </div>
    </div>
  `;
}

"""
    if renderer_target not in content:
        print("Error: renderer target not found!")
        sys.exit(1)
    content = content.replace(renderer_target, nlp_renderer + renderer_target, 1)

    # 4. Add Part XLI
    part_xl_end = """      <tr><td><strong>Master Capstone</strong></td><td>Day 60</td><td><strong>Month 2 Master Capstone Viva</strong></td><td><strong>ApexExecutiveComms Enterprise Cross-Functional Alignment, Crisis Escalation &amp; Principal Engineer Interview Portfolio Master Capstone:</strong> Complete sovereign enterprise communication and Principal Engineer interview portfolio uniting system design whiteboarding, executive negotiation, crisis command, and the $5M Modernization RFC defended under live adversarial viva voce examination.</td></tr>
    </tbody>
  </table>
  `;"""

    part_xli = """      <tr><td><strong>Master Capstone</strong></td><td>Day 60</td><td><strong>Month 2 Master Capstone Viva</strong></td><td><strong>ApexExecutiveComms Enterprise Cross-Functional Alignment, Crisis Escalation &amp; Principal Engineer Interview Portfolio Master Capstone:</strong> Complete sovereign enterprise communication and Principal Engineer interview portfolio uniting system design whiteboarding, executive negotiation, crisis command, and the $5M Modernization RFC defended under live adversarial viva voce examination.</td></tr>
    </tbody>
  </table>
  `;

  h += `
  <!-- ========================================================================= -->
  <!-- PART XLI: NATURAL LANGUAGE PROCESSING & COMPUTATIONAL LINGUISTICS (60 DAYS) -->
  <!-- ========================================================================= -->
  <div class="page-break"></div>
  <div style="background: #0f172a; color: #ffffff; padding: 10pt 14pt; border-radius: 4pt; margin-bottom: 12pt; border-left: 6px solid #0891b2;">
    <div style="display: flex; justify-content: space-between; align-items: baseline;">
      <h1 style="color: #ecfeff; margin: 0; font-size: 14pt; border: none; padding: 0;">Part XLI: Deep Masterclass Blueprint &mdash; Natural Language Processing &amp; Computational Linguistics (60 Days &bull; 240 Quests)</h1>
      <span style="font-size: 9pt; color: #cffafe; font-weight: 700;"><code>course-nlp</code> &bull; Gate v2 True 9.8 Standard</span>
    </div>
    <p style="margin: 4pt 0 0 0; font-size: 8.5pt; color: #ecfeff;">
      <strong>Directorate:</strong> Principal Research Scientist in Foundation Models, Head of Computational Linguistics &amp; Chief AI Systems Architect &bull; <strong>Pedagogical Cadence:</strong> Month 1 (Days 01&ndash;30 / 120 Quests) + Month 2 (Days 31&ndash;60 / 120 Quests) &bull; <strong>Volume:</strong> 240 Quests Total &bull; <strong>Sovereign Capstones:</strong> ApexLinguist (M1) &amp; ApexTransformer (M2)
    </p>
  </div>

  <h2>41.1 Month 1: Classical Computational Linguistics, Statistical NLP, Vector Embeddings &amp; Sequence Modeling (Days 01&ndash;30 / 120 Quests)</h2>
  <p style="font-size: 8.2pt; color: #475569; margin-bottom: 8pt;">
    Month 1 establishes foundational and architectural mastery across the physics of human language processing: Unicode UTF-8 byte representations and canonical normalization forms (NFC/NFD/NFKC/NFKD), deterministic tokenization, regex lexical boundary engines, and Zipf's Law power-law vocabulary distributions, subword segmentation mechanics (Byte-Pair Encoding, WordPiece, and SentencePiece unigram models), morphological analysis, Porter vs Snowball stemmers, and lemmatization via wordnet constraint graphs, n-gram statistical language modeling, maximum likelihood estimation, and out-of-vocabulary smoothing (Laplace, Good-Turing, and Kneser-Ney backoff), Milestone 1: ApexTokenizer &amp; ApexLanguageModel High-Throughput Statistical NLP Engine Suite, vector space representation and TF-IDF term weighting (sublinear scaling, document frequency damping), probabilistic information retrieval and BM25 ranking (length normalization, saturation constants), Latent Semantic Analysis (LSA) via truncated SVD and low-rank semantic manifolds, probabilistic topic modeling via Latent Dirichlet Allocation (LDA) and collapsed Gibbs sampling, text classification architectures (Multinomial Naive Bayes, Logistic Regression, calibration curves), Milestone 2: ApexSearch Probabilistic BM25 &amp; Semantic Topic Retrieval Engine Suite, distributed representation and the Distributional Hypothesis (Harris &amp; Firth), Word2Vec Skip-Gram architecture with Negative Sampling (SGNS) and hierarchical softmax, Word2Vec Continuous Bag-of-Words (CBOW) and sub-sampling of frequent words, GloVe global log-bilinear matrix factorization and co-occurrence graphs, FastText subword n-gram embeddings and out-of-vocabulary generalization, Milestone 3: ApexEmbed Distributed Semantic Vector Space &amp; Word2Vec Neural Engine Suite, evaluating vector spaces through cosine similarity, word analogies, and intrinsic vs extrinsic benchmark suites, Part-of-Speech (POS) tagging with Hidden Markov Models (HMM) and the Viterbi decoding algorithm, Maximum Entropy Markov Models (MEMM) and the label bias vulnerability, Linear-Chain Conditional Random Fields (CRF) and global partition function normalization, Named Entity Recognition (NER) with Bidirectional LSTM-CRF architectures, Milestone 4: ApexNER BiLSTM-CRF Named Entity Recognition &amp; Information Extraction Engine Suite, constituency parsing, context-free grammars (CFG), and the CYK dynamic programming chart parser, dependency parsing and transition-based shift-reduce algorithms with arc-standard / arc-eager transitions, Recurrent Neural Networks (RNN) and exploding/vanishing gradients in long context language modeling, Long Short-Term Memory (LSTM) gating mechanics (forget, input, output gates, cell state highway), Gated Recurrent Units (GRU) and computational efficiency vs LSTM parameter complexity, Sequence-to-Sequence (Seq2Seq) encoder-decoder architectures and information bottlenecks, Bahdanau additive attention mechanisms, Luong multiplicative attention mechanisms, and Capstone 1: Month 1 Capstone Viva Gate (ApexLinguist High-Throughput Statistical NLP, Neural Embeddings &amp; Sequence Modeling Master Capstone).
  </p>

  ${(() => {
    let out = '';
    NLP_MONTH_1_SPECS.forEach((day: any) => {
      out += renderNlpDayCard(day);
    });
    return out;
  })()}

  <div class="page-break"></div>
  <div style="background: #0f172a; color: #ffffff; padding: 10pt 14pt; border-radius: 4pt; margin-bottom: 12pt; border-left: 6px solid #0891b2;">
    <div style="display: flex; justify-content: space-between; align-items: baseline;">
      <h1 style="color: #ecfeff; margin: 0; font-size: 14pt; border: none; padding: 0;">Part XLI: Natural Language Processing &mdash; Month 2: Transformers, Large Language Models, Alignment &amp; Enterprise LLMOps (Days 31&ndash;60 / 120 Quests)</h1>
      <span style="font-size: 9pt; color: #cffafe; font-weight: 700;">Stage 4 &bull; Global Scale &amp; Principal AI Systems Architect Viva Gate</span>
    </div>
    <p style="margin: 4pt 0 0 0; font-size: 8.5pt; color: #ecfeff;">
      <strong>Month 2 Scope:</strong> Transformer foundational architecture and Scaled Dot-Product Attention (Vaswani et al.), Multi-Head Attention (MHA) projections and parallel subspace representations, Positional encodings (Sinusoidal vs learned vs Rotary Position Embeddings RoPE), Transformer decoder architectures, causal masking, and KV-cache autoregressive inference optimization, Milestone 4 (M2): ApexTransformer Core Decoder &amp; KV-Cache Engine Suite, BERT bidirectional encoder pre-training (Masked LM &amp; Next Sentence Prediction), GPT autoregressive generative pre-training and scaling laws (Kaplan &amp; Chinchilla compute-optimal frontiers), T5 encoder-decoder unified text-to-text framework and Span Corruption pre-training, RoBERTa, ALBERT, DeBERTa (disentangled attention), and modern encoder optimizations, parameter-efficient fine-tuning (PEFT) with LoRA (Low-Rank Adaptation) and QLoRA, Milestone 5: ApexLoRA Parameter-Efficient Fine-Tuning &amp; Quantized Model Engine Suite, FlashAttention-1, 2 &amp; 3 (tiling, SRAM memory hierarchy, IO-awareness), Multi-Query Attention (MQA) and Grouped-Query Attention (GQA) for memory-bandwidth bound LLM serving, LLM quantization techniques (GPTQ, AWQ, FP8, INT4 weight-only vs weight-activation), dense vector search and approximate nearest neighbors (HNSW, IVFPQ, ScaNN), Retrieval-Augmented Generation (RAG) architecture and advanced chunking strategies, Milestone 6: ApexRAG Enterprise Retrieval-Augmented Generation &amp; Dense Semantic Suite, hybrid search (BM25 lexical + dense vector) and cross-encoder re-ranking pipelines, instruction fine-tuning and synthetic data generation (Alpaca, UltraChat), Reinforcement Learning from Human Feedback (RLHF) via PPO and reward modeling, Direct Preference Optimization (DPO) and Odds Ratio Preference Optimization (ORPO), speculative decoding and draft model verification for accelerated LLM inference, continuous batching and PagedAttention inference engines (vLLM architecture), Milestone 7: ApexServe High-Throughput LLM Inference &amp; Serving Platform Suite, function calling, tool use, and structured JSON output decoding (Grammar-constrained sampling), multi-agent orchestration frameworks and ReAct cognitive loops, safety guardrails, prompt injection defenses, and jailbreak mitigations (Llama Guard, NeMo Guardrails), hallucination detection, faithfulness metrics, and RAG evaluation frameworks (Ragas, TruLens), LLMOps monitoring, prompt versioning, latency/token tracing, and cost governance, and Capstone 2: Month 2 Master Capstone Viva (ApexTransformer Sovereign Foundation Transformer Architecture, Alignment, RAG &amp; LLMOps Master Capstone).
    </p>
  </div>

  <h2>41.2 Month 2: Transformers, Large Language Models, Alignment &amp; Enterprise LLMOps (Days 31&ndash;60 / 120 Quests)</h2>

  ${(() => {
    let out = '';
    NLP_MONTH_2_SPECS.forEach((day: any) => {
      out += renderNlpDayCard(day);
    });
    return out;
  })()}

  <div class="page-break"></div>
  <h2>41.3 Natural Language Processing &amp; Computational Linguistics Milestone &amp; Capstone Viva Gates (Milestones 1&ndash;7 + 2 Capstone Vivas)</h2>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 12%;">Milestone</th>
        <th style="width: 10%;">Day</th>
        <th style="width: 28%;">Milestone Gate Title</th>
        <th style="width: 50%;">Architectural Deliverable &amp; Invariant Defense</th>
      </tr>
    </thead>
    <tbody>
      <tr><td><strong>Milestone 1</strong></td><td>Day 05</td><td>ApexTokenizer &amp; ApexLanguageModel High-Throughput Statistical NLP Engine Suite</td><td>Production-grade Unicode-normalized BPE tokenizer and modified Kneser-Ney smoothed n-gram language model processing multi-gigabyte text corpora with mathematical perplexity bounds.</td></tr>
      <tr><td><strong>Milestone 2</strong></td><td>Day 10</td><td>ApexSearch Probabilistic BM25 &amp; Semantic Topic Retrieval Engine Suite</td><td>Inverted index probabilistic search and topic discovery platform uniting BM25 Okapi term ranking and collapsed Gibbs-sampled LDA topic distribution inference.</td></tr>
      <tr><td><strong>Milestone 3</strong></td><td>Day 15</td><td>ApexEmbed Distributed Semantic Vector Space &amp; Word2Vec Neural Engine Suite</td><td>High-throughput Skip-Gram with Negative Sampling (SGNS) and subword FastText neural embedding engine with low-level matrix SIMD optimizations and semantic evaluation benchmarks.</td></tr>
      <tr><td><strong>Milestone 4</strong></td><td>Day 22</td><td>ApexNER BiLSTM-CRF Named Entity Recognition &amp; Information Extraction Engine Suite</td><td>Bidirectional LSTM sequence tagger with exact Linear-Chain CRF Viterbi decoding and global partition normalization for clinical and enterprise named entity recognition.</td></tr>
      <tr><td><strong>Capstone 1</strong></td><td>Day 30</td><td><strong>Month 1 Capstone Viva Gate</strong></td><td><strong>ApexLinguist High-Throughput Statistical NLP, Neural Embeddings &amp; Sequence Modeling Master Capstone:</strong> Sovereign computational linguistics and sequence modeling engine uniting subword tokenization, probabilistic retrieval, distributed embeddings, and attention-augmented sequence-to-sequence translation defended before Senior AI Review Board.</td></tr>
      <tr><td><strong>Milestone 4 (M2)</strong></td><td>Day 35</td><td>ApexTransformer Core Decoder &amp; KV-Cache Engine Suite</td><td>Industrial from-scratch autoregressive Transformer decoder engine with causal masking, Rotary Position Embeddings (RoPE), and dynamic KV-cache memory management.</td></tr>
      <tr><td><strong>Milestone 5</strong></td><td>Day 40</td><td>ApexLoRA Parameter-Efficient Fine-Tuning &amp; Quantized Model Engine Suite</td><td>Distributed parameter-efficient fine-tuning platform implementing low-rank matrix decomposition adapter kernels and 4-bit NormalFloat (NF4) quantization workflows.</td></tr>
      <tr><td><strong>Milestone 6</strong></td><td>Day 45</td><td>ApexRAG Enterprise Retrieval-Augmented Generation &amp; Dense Semantic Suite</td><td>Enterprise RAG pipeline combining hierarchical document chunking, HNSW vector search, hybrid reciprocal rank fusion (RRF), cross-encoder re-ranking, and grounded generation.</td></tr>
      <tr><td><strong>Milestone 7</strong></td><td>Day 50</td><td>ApexServe High-Throughput LLM Inference &amp; Serving Platform Suite</td><td>Production LLM serving engine featuring PagedAttention virtual memory block allocation, continuous iteration batching, and speculative draft decoding.</td></tr>
      <tr><td><strong>Master Capstone</strong></td><td>Day 60</td><td><strong>Month 2 Master Capstone Viva</strong></td><td><strong>ApexTransformer Sovereign Foundation Transformer Architecture, Alignment, RAG &amp; LLMOps Master Capstone:</strong> Complete enterprise foundation model platform uniting custom decoder architecture, DPO preference alignment, multi-agent tool execution, and production observability defended under live adversarial viva voce examination.</td></tr>
    </tbody>
  </table>
  `;"""

    if part_xl_end not in content:
        print("Error: part_xl_end not found!")
        sys.exit(1)
    content = content.replace(part_xl_end, part_xli, 1)

    # 5. Update HTML title
    title_target = "<title>PinIT Career OS — 36+ Courses Masterclass SRS & Pedagogical Architecture</title>"
    title_replacement = "<title>PinIT Career OS — 37 Courses Masterclass SRS & Pedagogical Architecture</title>"
    content = content.replace(title_target, title_replacement, 1)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully wired Course 37 (Part XLI) into compile-500p-srs-pdf.mts!")

if __name__ == '__main__':
    wire_nlp()
