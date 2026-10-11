# Course 37: Natural Language Processing & Computational Linguistics (Month 1, Days 1-15)
NLP_M1_DAYS_1_15 = [
  {
    "day": 1,
    "month": 1,
    "blockNum": 1,
    "title": "Computational Linguistics & Information Theory in Human Language",
    "stageName": "Stage 1: Text Representation, Tokenization & Classical Statistical NLP",
    "pedagogicalRole": "Chief Computational Linguist & Principal NLP Scientist",
    "spokenGoal": "Welcome to Course 37: the grand capstone track of the PinIT curriculum. Before computers can understand language, we must understand the mathematical physics of human text. Human language is governed by empirical laws of nature: Zipf's Law (word frequency is inversely proportional to rank), Heaps' Law (vocabulary size grows sublinearly with corpus size: V = k * N^beta), and Shannon Text Entropy. Today, you master the formal levels of linguistics\u2014morphology, syntax, semantics, and pragmatics\u2014and derive the statistical invariants governing natural language corpora.",
    "conceptInvariant": "Human linguistic tokens follow a power-law Zipfian distribution: P(r) proportional to 1 / (r^alpha) with alpha approximately 1.0; a tiny vocabulary tail of stop-words dominates 50% of text mass, while an infinite long tail of hapax legomena appears exactly once.",
    "failureMode": "An engineer builds a text processing pipeline that pre-allocates an in-memory hash table for vocabulary assuming linear vocabulary growth; on an 80GB Common Crawl corpus, Heaps' Law scaling causes the vocabulary to ingest 40 million distinct morphological variants, exhausting 128GB of RAM and crashing the ingestion cluster with an unrecoverable OutOfMemory error.",
    "tryItFriction": "Verify Zipf's Law on the complete text of Melville's Moby Dick: plot log(rank) against log(frequency) and calculate the slope coefficient alpha via ordinary least squares regression.",
    "socraticHints": [
      "What does a log-log plot of word rank versus frequency look like if Zipf's Law holds?",
      "Why is Heaps' Law parameter beta typically between 0.4 and 0.6 for natural Indo-European languages?",
      "Formula: log(f) = log(C) - alpha * log(r). If alpha is approximately 1.0, the slope of the linear fit is exactly -1.0."
    ],
    "situationalPuzzle": {
      "scenario": "You are sizing the vocabulary lookup table for a real-time search indexing engine ingesting 500 million customer support tickets. The product manager suggests allocating a fixed array for 50,000 words because 'the average English speaker only knows 20,000 words.' How do you respond?",
      "options": [
        "Agree with the product manager, because 50,000 words is more than twice what an educated adult knows.",
        "Reject the proposal based on Heaps' Law: human corpora contain typos, technical jargon, URLs, alphanumeric IDs, and morphological inflections that cause unique vocabulary tokens to scale as |V| = k * N^0.5. For 500M tokens, unique terms will exceed 1.5 million. A fixed 50k array will trigger catastrophic hash collisions or drop 30% of rare search keywords. We must use subword tokenization (BPE) with a fixed vocabulary budget.",
        "Use a Python dictionary with infinite memory allocation and let the OS virtual swap handle it.",
        "Convert all words to lowercase and strip all punctuation so the vocabulary stays under 20,000 words."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B applies empirical computational linguistics: Heaps' Law proves that real-world text corpora grow continuously due to technical terms, typos, and proper nouns; choosing subword tokenization (BPE) bounds vocabulary while preserving 100% token coverage."
    },
    "quests": [
      {
        "id": "Q37.1",
        "name": "Zipf & Heaps Empirical Curve Fitting",
        "type": "concept",
        "desc": "Derive the mathematical proofs for Zipf's Law and Heaps' Law, fitting parameters alpha, k, and beta to a 10M token Wikipedia corpus."
      },
      {
        "id": "Q37.2",
        "name": "The Linguistic Entropy Profiler",
        "type": "challenge",
        "desc": "Calculate the Shannon entropy and unigram perplexity across 5 diverse text corpora (Shakespeare, Python source code, Legal briefs, Reddit, Medical clinical notes)."
      },
      {
        "id": "Q37.3",
        "name": "Linguistic Corpus Diagnostic CLI",
        "type": "mastery",
        "desc": "Build a command-line tool that streams multi-gigabyte text files and computes streaming Zipfian slopes, hapax legomena ratios, and Heaps growth curves."
      },
      {
        "id": "Q37.4",
        "name": "Corpus OOM Crash Triage Lab",
        "type": "incident",
        "desc": "Diagnose and rectify a runaway memory leak in a production text ingestion worker caused by unbounded unigram vocabulary indexing."
      }
    ]
  },
  {
    "day": 2,
    "month": 1,
    "blockNum": 1,
    "title": "Subword Tokenization Physics: BPE, WordPiece & SentencePiece Internals",
    "stageName": "Stage 1: Text Representation, Tokenization & Classical Statistical NLP",
    "pedagogicalRole": "Principal Foundation Model Architect & Tokenizer Engineer",
    "spokenGoal": "Modern foundation models (GPT-4, Llama 3, Claude, Gemini) do not read words\u2014they read subword token IDs. If you do not understand tokenization, you cannot understand why language models struggle with character arithmetic, why non-English languages cost 3x more API tokens, or how prompt injection attacks bypass guardrails. Today, you master subword tokenization physics: Byte Pair Encoding (BPE), WordPiece (Google BERT), Unigram Language Model tokenization (SentencePiece), and byte-level regex pre-tokenizers (Tiktoken / GPT-4).",
    "conceptInvariant": "Subword tokenization is an optimal compression algorithm balancing vocabulary size |V| against sequence length L: greedy frequency merge operations iteratively compress recurring byte pairs into single vocabulary tokens.",
    "failureMode": "An engineer trains a BPE tokenizer without a byte-level fallback or regex split rule; in production, a user submits non-breaking Unicode emojis and Cyrillic text, producing millions of `<UNK>` tokens that corrupt the neural network's self-attention context and cause hallucinated gibberish outputs.",
    "tryItFriction": "Implement the core Byte Pair Encoding (BPE) merge loop from scratch in 35 lines of Python: start with character-separated words, count adjacent pair frequencies, and iteratively merge the most frequent pair for 50 iterations.",
    "socraticHints": [
      "Why did Sennrich et al. (2016) adapt the classic 1994 data compression algorithm BPE to neural machine translation?",
      "What is the difference between BPE (merges based on raw frequency) and WordPiece (merges based on maximum likelihood unigram score)?",
      "Byte-level invariant: By treating input as UTF-8 bytes rather than Unicode characters, the base vocabulary is fixed at 256 bytes, guaranteeing zero `<UNK>` out-of-vocabulary tokens."
    ],
    "situationalPuzzle": {
      "scenario": "Your startup's LLM product costs $0.03 per 1,000 tokens. A Japanese customer complains that processing Japanese documentation costs 4x more than equivalent English documentation and runs at one-fourth the inference speed. What is the root cause?",
      "options": [
        "Japanese text inherently contains 4x more linguistic entropy than English.",
        "The foundation model's tokenizer was trained primarily on an English-dominated corpus (e.g., Llama 2 / GPT-2). Japanese kanji and hiragana characters were not merged into frequent subwords, causing Japanese text to be fragmented into single UTF-8 bytes (3 tokens per character instead of 1 token per word). Retraining or expanding the BPE vocabulary with multilingual data (like Llama 3's 128k tokenizer) eliminates this token penalty.",
        "Japanese characters consume 64 bits in memory while ASCII consumes 8 bits.",
        "The API gateway has a bug in its billing counter calculation."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B correctly identifies the 'fertility rate' tokenization discrepancy: tokenizers trained on English split multilingual characters into individual UTF-8 bytes, leading to sequence bloat (high fertility), increased API costs, and degraded transformer context length."
    },
    "quests": [
      {
        "id": "Q37.5",
        "name": "BPE vs WordPiece vs Unigram LM Math",
        "type": "concept",
        "desc": "Formulate the exact objective functions of BPE (frequency greed), WordPiece (likelihood ratio), and Kudo's Unigram LM (pruning from large vocabulary)."
      },
      {
        "id": "Q37.6",
        "name": "The Byte-Level BPE Merger",
        "type": "challenge",
        "desc": "Implement a full byte-level BPE tokenizer from scratch that encodes arbitrary Unicode strings without producing out-of-vocabulary `<UNK>` tokens."
      },
      {
        "id": "Q37.7",
        "name": "High-Throughput SentencePiece Pipeline",
        "type": "mastery",
        "desc": "Build a high-performance tokenizer CLI that trains a 32,000-vocabulary BPE model on a 50MB corpus and benchmarks encoding throughput at >1MB/sec."
      },
      {
        "id": "Q37.8",
        "name": "Tokenizer Glitch Token Exploitation Lab",
        "type": "incident",
        "desc": "Audit a production tokenizer for 'SolidGoldMagikarp' glitch tokens (unrepresented cluster embeddings) that trigger LLM cognitive breakdown."
      }
    ]
  },
  {
    "day": 3,
    "month": 1,
    "blockNum": 1,
    "title": "Text Normalization & Linguistic Cleansing: Unicode Invariants & Morphology",
    "stageName": "Stage 1: Text Representation, Tokenization & Classical Statistical NLP",
    "pedagogicalRole": "Principal Data Engineer & Computational Lexicographer",
    "spokenGoal": "Raw text scraped from the internet is a toxic minefield of corrupt encodings, mixed Unicode normalization forms, mojibake, zero-width spaces, and morphological irregularities. If your NLP pipeline fails to handle Unicode Normalization Forms (NFC vs NFKD vs NFD), two strings that look identical to human eyes ('caf\u00e9' vs 'cafe\\u0301') will have completely different hash representations, degrading search recall and model accuracy. Today, you master text normalization invariants: Unicode normalization, regex cleaning, lemmatization vs stemming (Porter vs Snowball), and stop-word dynamics.",
    "conceptInvariant": "Text equality is an invariant under canonical Unicode equivalence: NFC (Canonical Composition) collapses base characters and combining diacritics into precomposed codepoints, ensuring deterministic vocabulary hashing.",
    "failureMode": "A financial fraud detection model fails to flag fraudulent accounts because attackers register names using Cyrillic homoglyphs ('\u0430' U+0430 instead of Latin 'a' U+0061); lacking NFKD compatibility decomposition and confusable detection, the model treats the names as distinct, allowing $1.2M in unauthorized transfers.",
    "tryItFriction": "Demonstrate Unicode normalization discrepancy in Python: create string A with precomposed '\u00e9' (U+00E9) and string B with 'e' + combining acute (U+0065 U+0301); show `A != B`, then prove `unicodedata.normalize('NFC', A) == unicodedata.normalize('NFC', B)`.",
    "socraticHints": [
      "What is the difference between Canonical Equivalence (NFC/NFD) and Compatibility Equivalence (NFKC/NFKD)?",
      "Why does NFKC convert the single ligature character '\ufb01' (U+FB01) into two separate ASCII characters 'f' and 'i'?",
      "Use `unicodedata.normalize('NFKD', text)` to separate base characters from diacritical marks before stripping accents."
    ],
    "situationalPuzzle": {
      "scenario": "Your legal contract search engine returns zero results when a lawyer searches for 'resume', but finding 15 documents containing 'r\u00e9sum\u00e9'. The search team proposes lowercasing all text. Will that fix the issue?",
      "options": [
        "Yes, because lowercasing automatically removes all accents in English.",
        "No. Lowercasing 'r\u00e9sum\u00e9' results in 'r\u00e9sum\u00e9', which still fails an exact string match with 'resume'. The pipeline requires a two-stage normalization: first, Unicode NFKD decomposition to separate 'e' from the combining acute accent (U+0301); second, stripping all characters in the Unicode Category 'Mn' (Mark, Nonspacing); third, applying case-folding. This guarantees that 'R\u00e9sum\u00e9', 'R\u00c9SUM\u00c9', and 'resume' all resolve to the canonical token 'resume'.",
        "Replace all accented characters with asterisks using regex.",
        "Force the lawyer to type accents on their keyboard."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B applies correct Unicode engineering: decomposes glyphs via NFKD, strips non-spacing diacritical marks ('Mn'), and applies case-folding, creating a deterministic search index that resolves accented variants to their base forms."
    },
    "quests": [
      {
        "id": "Q37.9",
        "name": "Unicode Standard Annex #15 (UAX #15) Deep Dive",
        "type": "concept",
        "desc": "Analyze the formal Unicode Consortium specifications for NFC, NFD, NFKC, and NFKD normalizations and the Unicode Security Considerations (TR39)."
      },
      {
        "id": "Q37.10",
        "name": "The Homoglyph Attack Detector",
        "type": "challenge",
        "desc": "Build a security linter that detects visual spoofing attacks (mixed-script homoglyphs, zero-width spaces, bidirectional text overrides) in user inputs."
      },
      {
        "id": "Q37.11",
        "name": "Enterprise Text Sanitization Engine",
        "type": "mastery",
        "desc": "Build a high-throughput streaming text normalizer that processes multi-lingual text streams, applies NFKC normalization, strips control codes, and benchmarks at >10MB/sec."
      },
      {
        "id": "Q37.12",
        "name": "Corrupt Encoding Mojibake Recovery Lab",
        "type": "incident",
        "desc": "Recover 100,000 corrupt database records affected by double-UTF8 encoding (Mojibake: '\u00c3\u00a9' instead of '\u00e9') without dropping data."
      }
    ]
  },
  {
    "day": 4,
    "month": 1,
    "blockNum": 1,
    "title": "Statistical Language Modeling: N-Grams, Perplexity & Kneser-Ney Smoothing",
    "stageName": "Stage 1: Text Representation, Tokenization & Classical Statistical NLP",
    "pedagogicalRole": "Principal Speech & Language Scientist",
    "spokenGoal": "Before Transformers conquered the world, statistical N-gram language models were the beating heart of speech recognition, autocorrect keyboards, and machine translation. The fundamental challenge of statistical language modeling is the zero-frequency problem: in a trigram model P(w3 | w1, w2), what happens when a valid sentence contains a three-word sequence that never appeared in your training corpus? Maximum Likelihood Estimation gives it probability zero, making the entire sentence impossible. Today, you master the pinnacle of statistical NLP: Laplace smoothing, Good-Turing frequency estimation, and Kneser-Ney Discounting.",
    "conceptInvariant": "Perplexity is the exponentiated cross-entropy of a language model: PP(W) = P(w1...wN)^(-1/N) = 2^(H(W)); it measures the average branching factor of the model's uncertainty at each token prediction.",
    "failureMode": "A mobile keyboard predictive text engine uses raw Maximum Likelihood Estimation for trigrams; when a user types a rare two-word context, the model assigns probability 0 to all completions, divides by zero, and crashes the smartphone's input method service.",
    "tryItFriction": "Implement an interpolated Kneser-Ney trigram probability calculator in Python, incorporating absolute discounting parameter d = 0.75 and continuation probabilities P_continuation(w).",
    "socraticHints": [
      "Why is Add-1 (Laplace) smoothing disastrous for large vocabularies? (It gives far too much probability mass to the millions of unseen N-grams).",
      "What makes Kneser-Ney smoothing uniquely brilliant? (It evaluates how likely a word is to complete an unseen context based on how many *different* histories it follows).",
      "Continuation probability: P_cont(w) = |{w_{i-1} : C(w_{i-1}, w) > 0}| / |{(w_{i-1}, w') : C(w_{i-1}, w') > 0}|."
    ],
    "situationalPuzzle": {
      "scenario": "Consider the word 'Francisco'. In your training corpus, 'Francisco' appears 10,000 times, but almost exclusively preceded by 'San'. If your language model encounters an unseen context like 'I visited the beautiful city of ____', why does standard Good-Turing smoothing predict 'Francisco' while Kneser-Ney correctly suppresses it?",
      "options": [
        "Good-Turing has a bug that doubles the probability of proper nouns.",
        "Good-Turing looks only at raw unigram count: since 'Francisco' has high frequency (10,000), it assigns high backoff probability. Kneser-Ney smoothing uses continuation probability: 'Francisco' only ever completes one single word history ('San'), so its continuation count is 1. In contrast, words like 'Rome' or 'London' complete hundreds of distinct histories, so Kneser-Ney assigns them much higher probability in novel contexts.",
        "Kneser-Ney uses deep neural embeddings to understand geography.",
        "Perplexity is lower for shorter city names."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B states the classic textbook justification for Kneser-Ney discounting: raw unigram frequency is misleading for words that occur frequently in narrow collocations ('San Francisco'); continuation probability correctly measures a word's versatility across diverse contexts."
    },
    "quests": [
      {
        "id": "Q37.13",
        "name": "Kneser-Ney Mathematical Derivation",
        "type": "concept",
        "desc": "Derive the mathematical formulation of Modified Kneser-Ney Interpolated Smoothing with multi-tier absolute discount parameters d1, d2, d3+."
      },
      {
        "id": "Q37.14",
        "name": "The Perplexity Benchmark Suite",
        "type": "challenge",
        "desc": "Train Unigram, Bigram, and Trigram models on the Brown Corpus and benchmark perplexity reduction across Laplace, Good-Turing, and Kneser-Ney smoothing."
      },
      {
        "id": "Q37.15",
        "name": "ApexLanguageModel Trigram Engine CLI",
        "type": "mastery",
        "desc": "Build a high-performance C++ or Rust N-gram language model engine capable of scoring 100,000 sentences per second using quantized KenLM-style binary trie structures."
      },
      {
        "id": "Q37.16",
        "name": "Zero-Probability Catastrophe Recovery Lab",
        "type": "incident",
        "desc": "Fix an active speech-to-text decoder that is rejecting valid audio transcriptions due to an unhandled zero-probability backoff branch in an N-gram LM."
      }
    ]
  },
  {
    "day": 5,
    "month": 1,
    "blockNum": 1,
    "title": "Milestone 1: ApexTokenizer & ApexLanguageModel High-Throughput Engine Suite",
    "stageName": "Stage 1: Text Representation, Tokenization & Classical Statistical NLP",
    "pedagogicalRole": "Principal NLP Systems Evaluator & Chief Scientist",
    "spokenGoal": "Today is Milestone 1 of the Grand NLP track. You will architect, implement, and defend ApexTokenizer and ApexLanguageModel: an enterprise-grade statistical NLP pipeline. You will synthesize subword Byte Pair Encoding, Unicode canonical normalization, and an interpolated Kneser-Ney N-gram language model into a production-grade library capable of tokenizing and scoring millions of tokens per second with zero out-of-vocabulary failures and provable mathematical perplexity bounds.",
    "conceptInvariant": "A production-grade language processing foundation guarantees two invariants: 1. Complete round-trip token reconstruction fidelity (decode(encode(text)) == normalize(text)); 2. Strict non-zero probability bounds for all arbitrary token sequences under Kneser-Ney backoff.",
    "failureMode": "An enterprise search autocomplete engine crashes during peak traffic because an unindexed unicode character triggers an assertion error in the tokenization layer, taking down search for 2.4 million users.",
    "tryItFriction": "Demonstrate the complete roundtrip reconstruction property of your ApexTokenizer on a multi-lingual stress test containing English, Arabic, Chinese, Emoji, and mathematical LaTeX symbols.",
    "socraticHints": [
      "Why must your tokenizer retain exact character offset mappings (span start and end indices) for downstream NER and highlight rendering?",
      "How do binary trie data structures accelerate N-gram probability lookup from O(N) to O(1) in memory?",
      "Assert: `assert apexTokenizer.decode(apexTokenizer.encode(test_string)) == unicode_normalize(test_string)`."
    ],
    "situationalPuzzle": {
      "scenario": "During the ApexTokenizer defense, an evaluator passes a 10MB file consisting entirely of the repeated character 'A' and asks how your BPE training algorithm behaves. What is the optimal algorithmic complexity?",
      "options": [
        "The algorithm will freeze in an infinite loop because there are no distinct characters.",
        "A naive BPE counts pairs in O(N) on every merge iteration, leading to O(k * N) complexity. ApexTokenizer uses a priority queue (min-heap) of pair frequencies and doubly-linked list token nodes: pair frequency updates are performed in O(1) time per merged node, compressing 'AAAA...' into hierarchical powers of two (A^2, A^4, A^8...) in O(N log k) time.",
        "BPE cannot handle repeated characters and requires falling back to regex.",
        "The tokenizer will consume 100% of memory and crash."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B exhibits senior systems mastery: identifies naive O(k * N) bottlenecks and implements the state-of-the-art fast BPE data structure (doubly linked list + indexed frequency heap), executing logarithmic hierarchical pair merging in O(N log k)."
    },
    "quests": [
      {
        "id": "Q37.17",
        "name": "Token Reconstruction & Offset Invariant Proofs",
        "type": "concept",
        "desc": "Prove mathematically that a byte-fallback BPE tokenizer preserves bijective invertibility between byte arrays and token ID sequences."
      },
      {
        "id": "Q37.18",
        "name": "ApexTokenizer Core Architecture Specification",
        "type": "challenge",
        "desc": "Implement the complete ApexTokenizer library: Unicode NFKC cleaner, regex pre-tokenizer, BPE merge trainer, and byte-level fallback encoder."
      },
      {
        "id": "Q37.19",
        "name": "ApexLanguageModel Kneser-Ney Engine",
        "type": "mastery",
        "desc": "Build the ApexLanguageModel binary engine in Python/C++ with interpolated Kneser-Ney smoothing, trie-based prefix storage, and perplexity evaluation."
      },
      {
        "id": "Q37.20",
        "name": "Live ApexTokenizer Stress & Adversarial Audit Lab",
        "type": "incident",
        "desc": "Subject ApexTokenizer and ApexLanguageModel to an adversarial battery of 1,000 fuzzing inputs (homoglyphs, control characters, massive repetitions) under memory profiling."
      }
    ]
  },
  {
    "day": 6,
    "month": 1,
    "blockNum": 2,
    "title": "Part-of-Speech Tagging & Hidden Markov Models: The Viterbi Dynamic Programming Algorithm",
    "stageName": "Stage 1: Text Representation, Tokenization & Classical Statistical NLP",
    "pedagogicalRole": "Principal Computational Syntactician",
    "spokenGoal": "Is the word 'run' a noun ('a home run') or a verb ('they run fast')? Disambiguating the grammatical function of words in context is the classic problem of Part-of-Speech (POS) tagging. Today, you master Hidden Markov Models (HMM): generative graphical models where word tokens are observable emissions generated by hidden latent grammatical states (Noun, Verb, Adjective). You will derive the Viterbi Dynamic Programming algorithm to compute the exact globally optimal sequence of hidden states in O(T * |S|^2) time.",
    "conceptInvariant": "The Viterbi path optimizes global sequence likelihood rather than local greedy transition probability: V[t, j] = max_i (V[t-1, i] * A[i, j]) * B[j, o_t], eliminating locally tempting but globally impossible syntactic paths.",
    "failureMode": "A grammar-checking tool uses a greedy unigram lookup to tag POS tags; encountering 'The old man the boats', it tags 'man' as a noun and 'the' as a determiner, failing to recognize that 'man' is the primary verb of the sentence, generating an erroneous grammar warning.",
    "tryItFriction": "Implement the Viterbi trellis dynamic programming algorithm in 40 lines of Python, accepting transition matrix A, emission matrix B, and initial state distribution pi, decoding the hidden POS tags for an ambiguous 6-word sentence.",
    "socraticHints": [
      "Why does a greedy POS tagger fail on garden-path sentences like 'The horse raced past the barn fell'?",
      "What is the time complexity difference between brute-force hidden state path evaluation (O(|S|^T)) and the Viterbi algorithm (O(T * |S|^2))?",
      "Log-space invariant: To prevent floating-point underflow when multiplying hundreds of small probabilities, compute Viterbi in log-space: log(V[t, j]) = max_i (log(V[t-1, i]) + log(A[i, j])) + log(B[j, o_t])."
    ],
    "situationalPuzzle": {
      "scenario": "You are running the Viterbi algorithm on a 500-word legal document. At token 120, your floating-point probabilities hit 1.4e-320 and trigger underflow to 0.0, causing the backpointer matrix to fail. How do you resolve this?",
      "options": [
        "Upgrade from 64-bit double precision floats to 128-bit quadruple precision floats.",
        "Transform the entire Viterbi dynamic programming trellis into log-space: replace all probability multiplications with additions of log probabilities (`log(p1 * p2) = log(p1) + log(p2)`). In log-space, numbers stay comfortably bounded between 0 and -100,000, eliminating numerical underflow completely.",
        "Normalize the probabilities at every step by multiplying by 10,000.",
        "Truncate the legal document to 50 words so underflow does not occur."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is the foundational computational standard for all probabilistic graphical models: transforming calculations into log-space converts products into sums, maintaining complete precision without numerical underflow across arbitrarily long sequences."
    },
    "quests": [
      {
        "id": "Q37.21",
        "name": "Hidden Markov Model Formalisms",
        "type": "concept",
        "desc": "Derive the three fundamental problems of HMMs: Evaluation (Forward Algorithm), Decoding (Viterbi), and Learning (Baum-Welch / EM)."
      },
      {
        "id": "Q37.22",
        "name": "The Log-Space Viterbi Decoder",
        "type": "challenge",
        "desc": "Implement a log-space Viterbi POS tagger trained on the Penn Treebank (WSJ section) with emission smoothing for out-of-vocabulary words."
      },
      {
        "id": "Q37.23",
        "name": "Baum-Welch Unsupervised POS Learner",
        "type": "mastery",
        "desc": "Build an unsupervised HMM tagger that learns latent syntactic transition and emission matrices from unannotated text using the Expectation-Maximization algorithm."
      },
      {
        "id": "Q37.24",
        "name": "Syntactic Ambiguity Resolution Lab",
        "type": "incident",
        "desc": "Debug a clinical NLP entity extraction pipeline that misclassifies medical drug names as verbs due to uncalibrated HMM emission priors."
      }
    ]
  },
  {
    "day": 7,
    "month": 1,
    "blockNum": 2,
    "title": "Syntactic Parsing & Context-Free Grammars: CYK Chart Parsing & Dependency Trees",
    "stageName": "Stage 1: Text Representation, Tokenization & Classical Statistical NLP",
    "pedagogicalRole": "Lead Computational Grammarian & Parser Architect",
    "spokenGoal": "Sentences are not flat sequences of words; they are hierarchical recursive syntax trees. In the sentence 'I saw the man with the telescope', did I use the telescope to see the man, or did the man have a telescope? This structural prepositional phrase attachment ambiguity cannot be resolved by flat N-grams. Today, you master syntactic parsing: Context-Free Grammars (CFGs) in Chomsky Normal Form (CNF), the Cocke-Younger-Kasami (CYK) dynamic programming chart parser, and modern Universal Dependencies (UD) transition-based dependency parsing.",
    "conceptInvariant": "The CYK chart parsing algorithm solves CFG derivation ambiguity in O(n^3 * |R|) time by recursively combining sub-spans: a constituent spanning [i, j] is derived if there exists a split point k such that A -> B C, where B spans [i, k] and C spans [k, j].",
    "failureMode": "An automated conversational agent relies on keyword matching instead of syntactic dependency parsing; asked 'Can you book a flight from Boston to New York not through Chicago?', it sees 'Chicago' and books a connecting flight through Chicago, infuriating the traveler.",
    "tryItFriction": "Convert a small English grammar with 6 production rules into Chomsky Normal Form (A -> B C or A -> a) and parse the sentence 'she eats fish with a fork' using a CYK 2D chart grid.",
    "socraticHints": [
      "Why must a grammar be in Chomsky Normal Form (CNF) for the CYK algorithm to operate?",
      "What is the difference between Constituency Parsing (phrase structure: NP, VP, PP) and Dependency Parsing (head-dependent relations: nsubj, dobj, amod)?",
      "CYK loop: for length = 2 to n; for start = 1 to n - length + 1; for split = 1 to length - 1: check grammar productions."
    ],
    "situationalPuzzle": {
      "scenario": "You are building a semantic relationship extraction pipeline for legal contracts. You must extract (Subject, Action, Object) triples. Why is a Dependency Parser superior to a Constituency Parser for this task?",
      "options": [
        "Dependency parsers are always written in Python while constituency parsers are written in Java.",
        "Constituency parsers generate nested phrase brackets (NP inside VP), requiring complex traversal rules to find which noun is the subject. Dependency parsers directly output typed grammatical relations between words (e.g., `nsubj(signs, Lessee)` and `dobj(signs, Lease)`), allowing direct O(1) extraction of semantic subject-predicate-object triples regardless of intervening clauses.",
        "Dependency parsing uses deep learning while constituency parsing does not.",
        "Dependency parsers require no training data."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B explains the exact architectural advantage of dependency syntax: it connects the head verb directly to its subject and object with typed functional arcs (`nsubj`, `dobj`), making semantic triple extraction trivial even in complex multi-clause sentences."
    },
    "quests": [
      {
        "id": "Q37.25",
        "name": "Chomsky Hierarchy & Parsing Complexity",
        "type": "concept",
        "desc": "Map the Chomsky Hierarchy of Grammars (Regular, Context-Free, Context-Sensitive, Recursively Enumerable) and analyze the O(n^3) CYK bound."
      },
      {
        "id": "Q37.26",
        "name": "The CYK Chart Parser from Scratch",
        "type": "challenge",
        "desc": "Implement a full CYK chart parser in Python that parses sentences into binary parse trees and resolves prepositional phrase attachments using PCFG probabilities."
      },
      {
        "id": "Q37.27",
        "name": "Universal Dependencies Transition Parser",
        "type": "mastery",
        "desc": "Build an Arc-Standard transition-based dependency parser implementing Shift, Left-Arc, and Right-Arc operations with a feature-based classifier."
      },
      {
        "id": "Q37.28",
        "name": "Legal Contract Parsing Extraction Lab",
        "type": "incident",
        "desc": "Extract obligation relations ('Party A shall pay Party B') from a complex, convoluted 50-word single-sentence indemnification clause using dependency graph traversal."
      }
    ]
  },
  {
    "day": 8,
    "month": 1,
    "blockNum": 2,
    "title": "Vector Space Models & Information Retrieval: TF-IDF & Okapi BM25 Physics",
    "stageName": "Stage 2: Vector Space Models, Distributional Semantics & Dense Embeddings",
    "pedagogicalRole": "Principal Search Engine Architect & Information Retrieval Fellow",
    "spokenGoal": "Before vector databases and dense neural retrieval, the entire web ran on Vector Space Models and Okapi BM25. Today, BM25 remains the undisputed gold standard for keyword retrieval\u2014it powers Elasticsearch, Lucene, and hybrid RAG search architectures. If you do not understand why simple TF-IDF fails on long documents and how BM25 uses saturation parameters (k1) and document length normalization (b) to prevent keyword stuffing, you cannot build production retrieval systems. Today, you master the physics of lexical vector spaces.",
    "conceptInvariant": "Okapi BM25 enforces non-linear term frequency saturation: as term frequency tf increases, relevance score asymptotically approaches (k1 + 1), preventing multi-page documents from dominating search results purely through term repetition.",
    "failureMode": "An e-commerce search engine uses raw TF-IDF; a rogue vendor stuffs the keyword 'iPhone' 5,000 times into an invisible white-text description of a cheap phone case; TF-IDF ranks the phone case #1 for the query 'iPhone', humiliating the search team and degrading conversion.",
    "tryItFriction": "Implement the full Okapi BM25 scoring formula in Python: incorporate inverse document frequency IDF, term frequency saturation parameter k1 = 1.2, and document length normalization b = 0.75.",
    "socraticHints": [
      "Why is the relationship between term frequency and document relevance non-linear in human psychology?",
      "What happens to BM25 when parameter b = 0 vs b = 1? (b=1 completely penalizes document length; b=0 ignores length completely).",
      "Formula: score(D, Q) = sum_{q in Q} IDF(q) * (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * (|D| / avgdl)))."
    ],
    "situationalPuzzle": {
      "scenario": "You are tuning a BM25 search engine for a company knowledge base that contains both short 10-word Slack snippets and 20-page technical design documents. Users complain that short Slack snippets always outrank 20-page authoritative design docs. Which parameter should you adjust?",
      "options": [
        "Increase k1 from 1.2 to 5.0.",
        "Decrease parameter b from 0.75 to 0.3. The parameter b controls the document length penalty (1.0 = full penalty, 0.0 = zero penalty). Setting b too high aggressively penalizes longer documents simply because their length |D| exceeds the average document length avgdl. Lowering b reduces this penalty, allowing high-quality, comprehensive design documents to compete fairly with short chat snippets.",
        "Multiply the query string by 10.",
        "Switch back to raw unnormalized TF-IDF."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B exhibits deep Information Retrieval mastery: parameter b modulates length normalization; lowering b from 0.75 to ~0.3 prevents long, comprehensive technical documents from being unfairly penalized compared to terse Slack snippets."
    },
    "quests": [
      {
        "id": "Q37.29",
        "name": "Probabilistic Relevance Framework (Robertson-Sp\u00e4rck Jones)",
        "type": "concept",
        "desc": "Derive the mathematical origins of Okapi BM25 from the 2-Poisson indexing model and the Binary Independence Model (BIM)."
      },
      {
        "id": "Q37.30",
        "name": "The Inverted Index & Postings List Engine",
        "type": "challenge",
        "desc": "Build an in-memory Inverted Index in Python/Rust with postings lists containing term frequencies and document positions, supporting Boolean and phrase queries."
      },
      {
        "id": "Q37.31",
        "name": "Okapi BM25 Search Engine from Scratch",
        "type": "mastery",
        "desc": "Implement a full BM25 search engine CLI that indexes a 100,000-document corpus and benchmarks sub-10ms query execution across multi-word queries."
      },
      {
        "id": "Q37.32",
        "name": "Search Ranking Manipulation Incident Lab",
        "type": "incident",
        "desc": "Diagnose and neutralize an active SEO keyword stuffing attack on an internal documentation search engine by tuning BM25 saturation parameters."
      }
    ]
  },
  {
    "day": 9,
    "month": 1,
    "blockNum": 2,
    "title": "Latent Semantic Analysis (LSA) & Topic Modeling: Truncated SVD & LDA",
    "stageName": "Stage 2: Vector Space Models, Distributional Semantics & Dense Embeddings",
    "pedagogicalRole": "Principal Data Scientist & Unsupervised Learning Specialist",
    "spokenGoal": "Keywords are imperfect: two documents can share zero vocabulary words but discuss the exact same topic (synonymy: 'automobile' vs 'car'), or a single word can have multiple meanings (polysemy: 'bank' as river bank vs financial bank). Today, you master classical semantic representation: Latent Semantic Analysis (LSA) via Truncated Singular Value Decomposition (SVD), and Latent Dirichlet Allocation (LDA) probabilistic generative modeling. You will learn how to compress high-dimensional sparse term-document matrices into dense semantic concept spaces.",
    "conceptInvariant": "Truncated SVD computes the optimal low-rank matrix approximation under the Eckart-Young-Mirsky theorem: X approx U_k * Sigma_k * V_k^T; it captures latent semantic dimensions by projecting terms and documents into a shared k-dimensional concept subspace.",
    "failureMode": "An analyst applies LDA topic modeling with 50 topics to a small dataset of 200 short tweets; lacking sufficient document length for Dirichlet prior convergence, LDA produces completely incoherent topics with identical top words, leading leadership to abandon topic modeling.",
    "tryItFriction": "Decompose a 10x10 term-document matrix using NumPy's `np.linalg.svd`, truncate to k = 2 latent dimensions, and compute the cosine similarity between two documents that share zero common words.",
    "socraticHints": [
      "What does the Eckart-Young-Mirsky theorem guarantee about Truncated SVD compared to all other rank-k approximations?",
      "What are the Dirichlet prior parameters alpha and beta in LDA? (alpha controls document-topic sparsity; beta controls topic-word sparsity).",
      "SVD projection: Document vector in latent space = D^T * U_k * Sigma_k^(-1)."
    ],
    "situationalPuzzle": {
      "scenario": "You run Truncated SVD on a TF-IDF term-document matrix and inspect the first latent dimension. You notice that all terms have high positive weights regardless of their semantic meaning. What does the first latent dimension represent?",
      "options": [
        "It represents the most important semantic topic in the entire corpus.",
        "In SVD on non-centered positive matrices, the first singular vector predominantly captures document length and general term frequency (the Perron-Frobenius effect). To isolate pure semantic variance, you must either center the matrix by subtracting the mean term vector or skip the first singular dimension when calculating semantic similarities.",
        "It indicates that your matrix has a bug in its floating-point calculations.",
        "It proves that all documents in your corpus are identical."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B is a deep linear algebra insight: the first singular vector of non-centered term-document matrices reflects document length and overall verbosity (the Perron-Frobenius eigenvector); true topic differentiation emerges in subsequent dimensions."
    },
    "quests": [
      {
        "id": "Q37.33",
        "name": "Eckart-Young-Mirsky Theorem & Low-Rank Physics",
        "type": "concept",
        "desc": "Prove why Truncated SVD minimizes the Frobenius norm of reconstruction error ||X - X_k||_F."
      },
      {
        "id": "Q37.34",
        "name": "The Truncated SVD LSA Engine",
        "type": "challenge",
        "desc": "Implement Latent Semantic Analysis from scratch using NumPy SVD, projecting documents into a 50-dimensional space and evaluating semantic retrieval."
      },
      {
        "id": "Q37.35",
        "name": "Collapsed Gibbs Sampling for LDA",
        "type": "mastery",
        "desc": "Implement a full Collapsed Gibbs Sampler for Latent Dirichlet Allocation (LDA) in Python, learning document-topic distributions and topic-word distributions."
      },
      {
        "id": "Q37.36",
        "name": "Customer Support Ticket Topic Extraction Lab",
        "type": "incident",
        "desc": "Uncover the emerging root cause of a sudden customer support ticket surge by extracting 5 coherent, non-overlapping LDA topics from 50,000 raw tickets."
      }
    ]
  },
  {
    "day": 10,
    "month": 1,
    "blockNum": 2,
    "title": "Milestone 2: ApexSearch Probabilistic BM25 & Semantic Topic Retrieval Engine Suite",
    "stageName": "Stage 2: Vector Space Models, Distributional Semantics & Dense Embeddings",
    "pedagogicalRole": "Principal Information Retrieval Systems Evaluator",
    "spokenGoal": "Today is Milestone 2. You will architect, implement, and defend ApexSearch: a hybrid information retrieval platform uniting probabilistic BM25 indexing and Latent Semantic Analysis. You will build an engine that indexes enterprise documents, normalizes queries, scores BM25 relevance with sub-millisecond latency, and leverages latent semantic projections to retrieve relevant documents that share zero lexical keywords with the query.",
    "conceptInvariant": "Hybrid lexical-semantic retrieval maximizes Mean Reciprocal Rank (MRR) by combining high-precision exact keyword matches (BM25) with high-recall semantic concept alignment (LSA): Score_hybrid = alpha * BM25_norm + (1 - alpha) * LSA_cosine.",
    "failureMode": "A search engine relies solely on dense semantic retrieval; when users search for exact part numbers or error codes ('ERR_CONNECTION_REFUSED_503'), the dense model returns semantically 'similar' networking articles instead of the exact error documentation, infuriating engineers.",
    "tryItFriction": "Benchmark your ApexSearch engine: demonstrate that searching for 'cardiac arrest' retrieves documents containing only 'heart failure' and 'myocardial infarction' via LSA, while maintaining exact SKU match accuracy for 'SKU-9942-X'.",
    "socraticHints": [
      "Why is pure dense retrieval often inferior to hybrid BM25 + dense search for technical documentation?",
      "How do you normalize BM25 scores (unbounded positive numbers) and cosine similarity scores (-1 to 1) so they can be linearly combined?",
      "Use Reciprocal Rank Fusion (RRF): RRF_score(d) = sum_{m in models} 1 / (60 + rank_m(d))."
    ],
    "situationalPuzzle": {
      "scenario": "Your ApexSearch engine combines BM25 and LSA. A stakeholder asks: 'Why not just use BM25 for everything since Google started with keyword search?' How do you defend the hybrid architecture?",
      "options": [
        "Because LSA is newer and more fashionable than BM25.",
        "BM25 suffers from the 'vocabulary mismatch problem': if a user searches for 'automobile repair', BM25 assigns a score of 0 to a document that talks extensively about 'car maintenance' if the word 'automobile' never appears. LSA captures the latent concept subspace where 'automobile' and 'car' project to identical vector coordinates. By combining BM25's exact keyword precision with LSA's semantic synonymy recall, ApexSearch achieves a 42% higher Mean Reciprocal Rank across diverse query distributions.",
        "BM25 is too slow for production use.",
        "LSA is required by ISO 27001 data compliance standards."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B provides the authoritative information retrieval justification: highlights the vocabulary mismatch problem, explains how LSA captures semantic synonyms through low-rank concept projections, and demonstrates measurable MRR gains from hybrid fusion."
    },
    "quests": [
      {
        "id": "Q37.37",
        "name": "Reciprocal Rank Fusion (RRF) vs Score Normalization",
        "type": "concept",
        "desc": "Analyze the mathematics of Reciprocal Rank Fusion (Cormack et al.) and compare it to min-max score normalization in hybrid search."
      },
      {
        "id": "Q37.38",
        "name": "ApexSearch Inverted Index & Vector Matrix Blueprint",
        "type": "challenge",
        "desc": "Construct the dual-index storage engine for ApexSearch: a disk-backed inverted index for BM25 and a memory-mapped truncated SVD matrix for LSA."
      },
      {
        "id": "Q37.39",
        "name": "ApexSearch Hybrid Query Router CLI",
        "type": "mastery",
        "desc": "Build the ApexSearch CLI tool implementing RRF rank aggregation, dynamic alpha weighting, and sub-15ms query execution on 250,000 documents."
      },
      {
        "id": "Q37.40",
        "name": "Live Search Ranking Adversarial Defense Lab",
        "type": "incident",
        "desc": "Defend the ApexSearch ranking pipeline before a Senior Review Board, explaining why hybrid fusion outranked both raw Lucene and raw dense vectors on the TREC benchmark."
      }
    ]
  },
  {
    "day": 11,
    "month": 1,
    "blockNum": 3,
    "title": "Distributional Semantics & Word2Vec: Skip-Gram, CBOW & Negative Sampling",
    "stageName": "Stage 2: Vector Space Models, Distributional Semantics & Dense Embeddings",
    "pedagogicalRole": "Principal Deep Learning Scientist & Neural Embeddings Fellow",
    "spokenGoal": "In 1957, linguist J.R. Firth stated the foundational invariant of modern NLP: 'You shall know a word by the company it keeps.' In 2013, Tomas Mikolov and his team at Google revolutionized the field by turning Firth's insight into Word2Vec: learning dense, low-dimensional continuous vector representations where words appearing in similar contexts map to nearby geometric coordinates. Today, you master the mathematical machinery of Word2Vec: Skip-Gram (predicting context from target) vs Continuous Bag of Words (predicting target from context), the computational bottleneck of the full Softmax denominator, and Negative Sampling (Noise Contrastive Estimation).",
    "conceptInvariant": "Negative Sampling transforms an intractable multi-class vocabulary softmax (O(|V|)) into K binary logistic regression classifications (O(K)): L_SGNS = log(sigmoid(v'_wO^T * v_wI)) + sum_{i=1}^K E_{w_i ~ P_n(w)} [log(sigmoid(-v'_wi^T * v_wI))].",
    "failureMode": "An engineer attempts to train Word2Vec using standard categorical cross-entropy softmax on a vocabulary of 500,000 words without negative sampling; calculating the partition function denominator requires summing 500,000 exponentials on every single token, slowing training to a crawl and causing GPU memory thrashing.",
    "tryItFriction": "Implement the Negative Sampling loss function and gradient updates for Word2Vec in NumPy for a single target-context pair with K = 5 negative samples.",
    "socraticHints": [
      "Why is the unigram noise distribution raised to the 3/4 power (P_n(w) proportional to U(w)^(0.75)) in Mikolov's paper?",
      "What is the intuitive geometric difference between Skip-Gram and CBOW? (CBOW averages context vectors, smoothing representations; Skip-Gram works better for rare words).",
      "Formula: The gradient for the true context word is (sigmoid(dot) - 1) * v_target; for negative samples, it is sigmoid(dot) * v_target."
    ],
    "situationalPuzzle": {
      "scenario": "Why does Word2Vec raise word frequencies to the 0.75 power when drawing negative samples, rather than sampling directly from the empirical unigram distribution?",
      "options": [
        "Because 0.75 is an arbitrary constant chosen by Google's compiler.",
        "Empirical text is dominated by stop-words (Zipf's Law: 'the', 'of', 'and' account for 20% of text). If negative samples are drawn directly from the unigram distribution, the model spends 99% of its negative sampling gradient updates telling the model that 'the' is not the context word. Raising frequency to the 0.75 power dampens the probability of ultra-frequent stop-words while giving rare words a significant relative boost, ensuring robust negative discrimination across the entire vocabulary.",
        "To prevent floating-point numbers from exceeding 1.0.",
        "It is required by the Softmax loss function."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B explains Mikolov's brilliant unigram exponentiation trick: taking U(w)^0.75 flattens the Zipfian distribution, suppressing dominant stop-words while increasing the sampling probability of rare words, resulting in dramatically richer semantic embeddings."
    },
    "quests": [
      {
        "id": "Q37.41",
        "name": "Mathematical Derivation of SGNS Gradients",
        "type": "concept",
        "desc": "Derive the full backpropagation gradients for Skip-Gram with Negative Sampling (SGNS) with respect to input and output embedding matrices."
      },
      {
        "id": "Q37.42",
        "name": "The NumPy Word2Vec Implementation",
        "type": "challenge",
        "desc": "Build a fully functional Skip-Gram with Negative Sampling model from scratch in pure NumPy, training it on a mini-corpus to produce 64-dimensional embeddings."
      },
      {
        "id": "Q37.43",
        "name": "High-Throughput PyTorch SGNS Trainer",
        "type": "mastery",
        "desc": "Implement a GPU-accelerated Word2Vec training pipeline in PyTorch using `nn.EmbeddingBag`, custom DataLoader batching, and sub-sampling of frequent words."
      },
      {
        "id": "Q37.44",
        "name": "Embedding Training Divergence Lab",
        "type": "incident",
        "desc": "Diagnose and fix an active Word2Vec training run where embedding vectors are collapsing into a single identical cluster due to an unnormalized negative sampling distribution."
      }
    ]
  },
  {
    "day": 12,
    "month": 1,
    "blockNum": 3,
    "title": "Global Vectors & Subword Embeddings: GloVe & FastText Architecture",
    "stageName": "Stage 2: Vector Space Models, Distributional Semantics & Dense Embeddings",
    "pedagogicalRole": "Principal Machine Learning Engineer & Lexical Semantics Fellow",
    "spokenGoal": "Word2Vec is a local context window model\u2014it processes text linearly and misses global co-occurrence statistics across the entire corpus. LSA captures global co-occurrences, but performs poorly on local word analogy tasks. In 2014, Pennington, Socher, and Manning at Stanford unified both worlds with GloVe: Global Vectors for Word Representation. In 2016, Bojanowski et al. at Facebook AI introduced FastText: enriching word embeddings with character N-gram subwords. Today, you master GloVe's log-bilinear matrix factorization and FastText's morphological subword composition.",
    "conceptInvariant": "GloVe enforces that the dot product of two word vectors equals the logarithm of their co-occurrence probability: w_i^T * w_j + b_i + b_j = log(X_ij); FastText models words as the sum of their character n-gram vectors: v_w = sum_{g in G_w} z_g, providing robust embeddings for unseen OOV words.",
    "failureMode": "A medical NER pipeline uses standard Word2Vec; encountering an out-of-vocabulary drug compound like 'hydroxychloroquine' or 'methylprednisolone', it maps the token to a random `<UNK>` vector, completely missing the morphological prefixes ('hydroxy-', 'methyl-') and misclassifying the prescription.",
    "tryItFriction": "Construct the character n-gram set for the word 'where' (with boundary brackets `<where>`) for n = 3: `<wh`, `whe`, `her`, `ere`, `re>`, plus the special whole-word token `<where>`; compute its composite representation.",
    "socraticHints": [
      "Why does GloVe use a weighting function f(X_ij) that caps the impact of extremely frequent co-occurrences?",
      "How does FastText handle a completely unseen typo like 'computerrr' without throwing an out-of-vocabulary error?",
      "GloVe loss: J = sum_{i,j} f(X_{ij}) * (w_i^T * w_j + b_i + b_j - log(X_{ij}))^2."
    ],
    "situationalPuzzle": {
      "scenario": "You are building a semantic search engine for a German e-commerce website. German is famous for compound nouns ('Donaudampfschifffahrtselektrizit\u00e4tenhauptbetriebswerkbauunterbeamtengesellschaft'). Why does FastText vastly outperform standard Word2Vec for German?",
      "options": [
        "FastText was written by German engineers.",
        "German forms new words through productive morphological compounding. In Word2Vec, every compound noun is treated as a distinct, atomic vocabulary token; rare compounds appear only once or twice and receive poor embeddings, while novel compounds are dropped as `<UNK>`. FastText represents words as sums of character n-grams; it automatically recognizes the constituent subwords ('Dampf' = steam, 'Schiff' = ship, 'Fahrt' = travel), generating rich, accurate semantic representations even for compounds never seen during training.",
        "FastText uses 512 dimensions while Word2Vec uses 300.",
        "German does not follow Zipf's Law."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B highlights the fundamental architectural superpower of FastText: in morphologically rich and compounding languages (German, Turkish, Finnish), character n-gram embeddings allow the model to infer semantic meaning from subword morphemes even for zero-shot unseen compound words."
    },
    "quests": [
      {
        "id": "Q37.45",
        "name": "GloVe Log-Bilinear Matrix Objective Derivation",
        "type": "concept",
        "desc": "Derive the mathematical relationship between co-occurrence probability ratios P(w|i) / P(w|j) and vector space differences (w_i - w_j)."
      },
      {
        "id": "Q37.46",
        "name": "The Global Co-Occurrence Matrix Engine",
        "type": "challenge",
        "desc": "Build a memory-efficient sparse global co-occurrence matrix builder in Python/C++ with symmetric window weighting (weight = 1/distance)."
      },
      {
        "id": "Q37.47",
        "name": "FastText Subword N-Gram Embedder",
        "type": "mastery",
        "desc": "Implement a FastText embedding lookup layer in PyTorch that decomposes arbitrary input tokens into character n-grams and computes averaged composite vectors."
      },
      {
        "id": "Q37.48",
        "name": "Out-of-Vocabulary Clinical Entity Recovery Lab",
        "type": "incident",
        "desc": "Recover semantic representations for 50 rare out-of-vocabulary medical compounds using FastText subword inference, rescuing a clinical trial matching pipeline."
      }
    ]
  },
  {
    "day": 13,
    "month": 1,
    "blockNum": 3,
    "title": "Vector Geometry & Semantic Embeddings: Cosine Geometry & Subspace Bias",
    "stageName": "Stage 2: Vector Space Models, Distributional Semantics & Dense Embeddings",
    "pedagogicalRole": "Principal AI Ethics & Embedding Geometry Scientist",
    "spokenGoal": "One of the most astonishing discoveries in AI was the linear semantic geometry of word embeddings: vector('King') - vector('Man') + vector('Woman') approximately equals vector('Queen'). But this geometric linearity has a dark side: word embeddings trained on human text encode toxic societal biases\u2014associating 'Doctor' with 'Man' and 'Nurse' with 'Woman'. Today, you master the geometry of embedding spaces: cosine similarity manifolds, the linear offset method for solving analogies (3CosAdd vs 3CosMul), and Bolukbasi et al.'s geometric debiasing algorithm via subspace projection.",
    "conceptInvariant": "Semantic gender bias in embedding spaces is a linear directional subspace: bias can be neutralized by isolating the primary gender unit vector v_g via PCA on definitional pairs, and projecting neutral target words onto the orthogonal complement hyperplane: v_neutral_debiased = v_neutral - (v_neutral * v_g) * v_g.",
    "failureMode": "An automated resume screening tool uses pre-trained word embeddings to match candidate resumes with job descriptions; because 'software engineer' has higher cosine similarity to male names than female names, the model systematically penalizes qualified female applicants, triggering an EEOC civil rights audit and multi-million dollar regulatory fines.",
    "tryItFriction": "Implement the 3CosMul analogy formula (Levy & Goldberg, 2014) to solve 'Paris is to France as Tokyo is to ____', demonstrating why multiplicative cosine overcomes additive magnitude dominance.",
    "socraticHints": [
      "Why does the classic 3CosAdd formula (argmax cos(d, b - a + c)) struggle when vector norms vary widely across the vocabulary?",
      "How do definitional pairs ('he'/'she', 'man'/'woman', 'king'/'queen') allow PCA to identify the 1-dimensional gender subspace?",
      "Debiasing formula: Project each gender-neutral word vector onto the orthogonal subspace perpendicular to the gender direction vector."
    ],
    "situationalPuzzle": {
      "scenario": "You are evaluating pre-trained word embeddings for a hiring recommendation model. You find that vector('programmer') has a cosine similarity of 0.42 to vector('man') and only 0.18 to vector('woman'). How do you apply hard debiasing (Bolukbasi et al.)?",
      "options": [
        "Delete the word 'programmer' from the vocabulary.",
        "1. Identify the gender direction vector g by running PCA on the difference vectors of definitional pairs ('she'-'he', 'woman'-'man', 'mother'-'father'); 2. For every gender-neutral profession word w (programmer, doctor, nurse), subtract its projection onto g: `w_neutral = w - (w . g) * g`, then re-normalize; 3. Equalize definitional pairs to ensure neutral words are equidistant from both. This removes linear gender bias while preserving semantic technical relationships.",
        "Invert all vector weights by multiplying by -1.",
        "Fine-tune the model exclusively on science fiction novels."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B implements the rigorous Bolukbasi et al. (NeurIPS 2016) hard debiasing protocol: identifies the 1D gender subspace via PCA on definitional pairs, orthogonally projects gender-neutral words to eliminate gender components, and equalizes paired terms."
    },
    "quests": [
      {
        "id": "Q37.49",
        "name": "Linear Analogical Geometry Proofs (3CosAdd vs 3CosMul)",
        "type": "concept",
        "desc": "Analyze the mathematical foundation of word vector analogies and prove why 3CosMul (multiplicative formulation) prevents dominant norm distortion."
      },
      {
        "id": "Q37.50",
        "name": "The Word Embedding Analogy Benchmark Suite",
        "type": "challenge",
        "desc": "Evaluate 300-dimensional GloVe and Word2Vec models on the Google Analogy Test Set (19,544 analogies across semantic and syntactic categories)."
      },
      {
        "id": "Q37.51",
        "name": "Bolukbasi Hard Debiasing Engine CLI",
        "type": "mastery",
        "desc": "Build an open-source CLI that audits an embedding matrix for gender, racial, and age subspace biases and applies orthogonal neutralization transformations."
      },
      {
        "id": "Q37.52",
        "name": "Algorithmic Hiring Bias Mitigation Lab",
        "type": "incident",
        "desc": "Intervene in an active enterprise recruitment algorithm that is systematically downranking female software engineer candidates due to uncalibrated embedding cosine projections."
      }
    ]
  },
  {
    "day": 14,
    "month": 1,
    "blockNum": 3,
    "title": "Text Classification & Supervised Sentiment Analysis: Linear SVMs, Naive Bayes & Feature Hashing",
    "stageName": "Stage 2: Vector Space Models, Distributional Semantics & Dense Embeddings",
    "pedagogicalRole": "Principal Machine Learning Engineer & Classification Architect",
    "spokenGoal": "Deep learning gets all the headlines, but in high-throughput enterprise production systems processing 50,000 requests per second with sub-5ms latency SLAs, running a 70-billion parameter LLM for spam detection or sentiment routing is financial suicide. Linear classifiers\u2014Multinomial Naive Bayes, Linear Support Vector Machines (SVM) with hinge loss, and Logistic Regression with N-gram Feature Hashing (the Hashing Trick)\u2014deliver 95% of transformer accuracy at 1/1,000th of the computational cost and zero GPU requirements. Today, you master high-throughput linear text classification.",
    "conceptInvariant": "The Hashing Trick (Weinberger et al.) maps an arbitrary, unbounded vocabulary space into a bounded m-dimensional feature vector using a hash function h(w) mod m without maintaining an in-memory dictionary, bounding memory to O(m) regardless of corpus size.",
    "failureMode": "An e-commerce company routes customer review sentiment through a hosted LLM API at $0.01 per call; during Cyber Monday, 15 million reviews are submitted, running up a $150,000 API bill while rate-limit timeouts cause review queues to backlog for 36 hours.",
    "tryItFriction": "Implement the MurmurHash3 feature hashing trick in Python: convert a 100-word text string into a fixed 1,024-dimensional feature vector with signed hash values to eliminate hash collision bias.",
    "socraticHints": [
      "Why is Multinomial Naive Bayes with log-likelihood priors mathematically guaranteed to execute in O(N) time with zero matrix inversions?",
      "What is the role of a second hash function xi(w) in {-1, +1} in the Hashing Trick? (It guarantees that the expected inner product between hashed vectors is unbiased: E[<h(u), h(v)>] = <u, v>).",
      "Formula: phi_i(x) = sum_{j : h(j) == i} xi(j) * x_j."
    ],
    "situationalPuzzle": {
      "scenario": "You must deploy a real-time spam detection filter directly into an edge email gateway proxy running on resource-constrained hardware. The gateway processes 20,000 emails per second with a strict 2-millisecond latency SLA and 100MB RAM ceiling. Which architecture should you deploy?",
      "options": [
        "A fine-tuned BERT-Large transformer model running on local CPU.",
        "A Linear Support Vector Machine (LinearSVC) paired with unigram/bigram TF-IDF features compressed via the Hashing Trick to a fixed 65,536-dimensional array. Feature extraction and dot-product inference execute in under 0.4 milliseconds in C++/Rust, consuming less than 15MB of RAM, comfortably meeting both the 2ms latency SLA and 100MB memory ceiling while achieving 98.2% spam precision.",
        "Call the OpenAI GPT-4 API over HTTPS for every email.",
        "Use a Python dictionary with regex patterns for every known spam word."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B represents elite systems engineering: recognizes the severe edge hardware constraints (2ms latency, 100MB RAM), selects a high-speed linear SVM with feature hashing, and achieves sub-millisecond inference with tiny memory footprint and high accuracy."
    },
    "quests": [
      {
        "id": "Q37.53",
        "name": "The Hashing Trick Unbiased Estimator Proof",
        "type": "concept",
        "desc": "Prove Weinberger's theorem: that the signed hashing trick preserves vector dot products in expectation (E[<h(x), h(y)>] = <x, y>) and bounds variance."
      },
      {
        "id": "Q37.54",
        "name": "High-Throughput Multinomial Naive Bayes Engine",
        "type": "challenge",
        "desc": "Implement a Multinomial Naive Bayes classifier from scratch in Python with log-odds ratios, Laplace smoothing, and sub-1ms batch inference."
      },
      {
        "id": "Q37.55",
        "name": "Edge Email Spam Filter CLI (Linear SVM + Hashing)",
        "type": "mastery",
        "desc": "Build an ultra-fast email spam classification CLI that trains an SGDClassifier (hinge loss) with 131,072-bin feature hashing, processing 50k emails/sec."
      },
      {
        "id": "Q37.56",
        "name": "Phishing Influx Latency Collapse Lab",
        "type": "incident",
        "desc": "Replace a failing, timed-out cloud LLM moderation endpoint with an optimized edge linear classifier during an active 100,000-message phishing attack."
      }
    ]
  },
  {
    "day": 15,
    "month": 1,
    "blockNum": 3,
    "title": "Milestone 3: ApexEmbed Distributed Semantic Vector Space & Word2Vec Engine Suite",
    "stageName": "Stage 2: Vector Space Models, Distributional Semantics & Dense Embeddings",
    "pedagogicalRole": "Principal Neural Embeddings Architect & Lead Evaluator",
    "spokenGoal": "Today is Milestone 3. You will architect, implement, and defend ApexEmbed: a distributed semantic vector space engine. You will build a complete neural embedding suite uniting Skip-Gram with Negative Sampling, FastText subword n-gram composition, and Bolukbasi subspace debiasing. You will prove that your engine can ingest raw text, train dense embeddings, infer representations for unseen out-of-vocabulary compounds, and pass rigorous semantic analogy and fairness benchmarks.",
    "conceptInvariant": "A production-grade neural embedding engine guarantees three geometric invariants: 1. Semantic clustering preservation (cosine similarity matches human word similarity benchmarks > 0.70 Spearman rho); 2. Out-of-vocabulary subword continuity; 3. Bounded demographic subspace projection bias (< 0.05).",
    "failureMode": "An enterprise recommendation engine deploys custom embeddings where unconstrained gradient norms cause vector representations to drift to infinity, producing NaN similarity calculations that disable product recommendations across the storefront.",
    "tryItFriction": "Train ApexEmbed on a 20MB corpus and demonstrate the analogy equation: `vector('berlin') - vector('germany') + vector('france')` yields `vector('paris')` as the nearest neighbor.",
    "socraticHints": [
      "Why must embedding vectors be unit-normalized (||v|| = 1) before computing cosine similarities?",
      "How do subword n-grams allow ApexEmbed to generate an accurate embedding for the made-up word 'unhappiness'?",
      "Assert: `assert cosine_similarity(debias(programmer), gender_subspace) < 0.05`."
    ],
    "situationalPuzzle": {
      "scenario": "During the ApexEmbed milestone defense, an evaluator passes the word 'giga-micro-processor-v4' which never appeared in your training corpus. How does ApexEmbed return a mathematically meaningful vector rather than an error?",
      "options": [
        "It queries Google Search to find the definition.",
        "ApexEmbed implements the FastText subword decomposition invariant: it extracts character n-grams (3 to 6 characters): `<giga`, `micro`, `processor`, `or-v4>`, looks up the pre-trained embedding vectors for each constituent n-gram, and sums them into a composite representation. Because 'micro' and 'processor' have rich pre-trained embeddings, the resulting vector accurately clusters with hardware and computing terms in the vector space.",
        "It assigns a random vector initialized with Gaussian noise.",
        "It returns a zero vector [0, 0, 0, ...]."
      ],
      "correctOptionIndex": 1,
      "explanation": "Option B demonstrates complete mastery of subword embedding architecture: breaks down the out-of-vocabulary compound into character n-grams, aggregates constituent morpheme vectors, and produces a highly accurate semantic embedding without retraining."
    },
    "quests": [
      {
        "id": "Q37.57",
        "name": "Spearman Rank Correlation on WordSim-353",
        "type": "concept",
        "desc": "Calculate the Spearman rank correlation coefficient between cosine similarities of learned word embeddings and human annotator scores on WordSim-353."
      },
      {
        "id": "Q37.58",
        "name": "ApexEmbed Master Neural Architecture Dossier",
        "type": "challenge",
        "desc": "Compile the complete architectural blueprint for ApexEmbed: SGNS training loop, FastText subword hasher, and Bolukbasi orthogonal debiaser."
      },
      {
        "id": "Q37.59",
        "name": "ApexEmbed High-Performance Embedding Engine",
        "type": "mastery",
        "desc": "Implement the ApexEmbed engine in PyTorch/NumPy with multi-threaded training, subword hashing, dynamic negative sampling, and analogy evaluation."
      },
      {
        "id": "Q37.60",
        "name": "Adversarial Embedding Space Defense Lab",
        "type": "incident",
        "desc": "Defend the ApexEmbed vector space before the Senior Review Board against adversarial probes targeting semantic drift, OOV crashes, and latent bias."
      }
    ]
  }
]
