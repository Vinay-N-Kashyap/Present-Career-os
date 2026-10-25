import os
import re

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
builder_path = os.path.join(commerce_dir, "scripts", "branch_b", "build_day50_dmkt.py")

new_p1_say = """p1_say = [
    "Welcome to the Milestone 10 Capstone War Room: Enterprise Semantic Search Engine, Neural Vector Retrieval & Search Console Analytics Control Tower. "
    "In this mission-critical operational capstone, you assume the role of Chief Search Systems Architect and Vice President of Organic Discovery for a "
    "multinational enterprise managing over fifty global digital properties, generating billions of organic impressions and hundreds of millions in direct "
    "e-commerce and SaaS subscription revenue. Over the preceding four intensive training modules, you have mastered the complete theoretical and "
    "engineering stack of modern search: web crawling architectures and robots.txt politeness protocols, inverted indices and Okapi BM25 lexical ranking, "
    "Markov chain PageRank link topology, dense bi-encoder sentence transformers, high-dimensional vector spaces and HNSW Approximate Nearest Neighbor "
    "indexing, search intent classification across Broder's taxonomy, Schema.org knowledge graph entities, sliding-window passage ranking, and Google "
    "Search Console BigQuery data lakehouse pipelines with non-linear organic CTR modeling.",
    "Today, your objective is to architect, deploy, verify, and stress-test an end-to-end Autonomous Search & Information Retrieval Infrastructure. "
    "In modern digital commerce, search is no longer a passive utility; it is the primary engine of customer discovery, content engagement, and digital "
    "revenue. When an enterprise operates with fragmented search infrastructure—where on-site search fails due to vocabulary mismatch, internal pages "
    "cannibalize each other's search rankings, and marketing leadership relies on subjective guesswork rather than actuarial search forecasting—the "
    "organization hemorrhages millions of dollars in customer acquisition value to competitors.",
    "The executive mandate for this capstone is comprehensive: build a unified Python platform that integrates real-time query understanding and intent "
    "classification, executes dual-retriever hybrid search combining sparse Okapi BM25 with dense neural vector embeddings via Reciprocal Rank Fusion, "
    "extracts relevant featured snippet passages, audits Google Search Console BigQuery telemetry for keyword cannibalization, and renders executive-level "
    "organic search ROI forecasts with statistical confidence bounds. The system must operate under strict enterprise service level agreements (SLAs): "
    "answering hybrid search queries in under thirty milliseconds and processing hundreds of thousands of search telemetry logs with zero memory leaks.",
    "The architecture of our Capstone Control Tower comprises four integrated processing engines: Engine 1 is the Query Understanding & Intent Classifier, "
    "normalizing noisy user strings, correcting spelling via noisy-channel language models, and categorizing intent into Informational, Commercial, "
    "Transactional, or Navigational archetypes. Engine 2 is the Dual-Retriever Hybrid Search Engine, querying inverted indices and dense vector spaces "
    "concurrently and synthesizing candidate lists via Reciprocal Rank Fusion (RRF $k=60$). Engine 3 is the Passage-Level MaxP Extractor, segmenting "
    "long-form documents into semantic windows to eliminate length dilution and surface exact answer snippets. Engine 4 is the Search Console BigQuery "
    "Analytics & Cannibalization Control Tower, modeling log-logistic CTR decay curves, detecting URL splitting conflicts, and projecting commercial ROI.",
    "To ensure high availability and sub-thirty-millisecond p99 latency across distributed data centers, the infrastructure incorporates multi-tiered "
    "caching and read replication. An in-memory Redis cluster caches top query candidate lists, serialized inverted index postings, and vector centroid "
    "assignments with aggressive time-to-live invalidation hooks. Write operations—such as newly crawled product pages or modified editorial articles—are "
    "streamed through an asynchronous message broker, updating inverted index postings lists and generating vector embeddings in parallel worker pools "
    "without blocking live query evaluation threads.",
    "To succeed in this war room deployment, you must apply rigorous systems engineering discipline. You must anticipate edge cases: queries with zero "
    "lexical matches that require dense semantic retrieval, conflicting internal landing pages alternating in search rankings, and severe SERP feature "
    "cannibalization. Your software must execute deterministically, with modular component interfaces, comprehensive error boundaries, and auditable "
    "telemetry logs.",
    "As you lead your engineering and analytics squads through this capstone, remember that information retrieval is the cognitive backbone of digital "
    "marketing. By unifying classical lexical algorithms with modern deep learning representations and forensic data warehousing, you protect your "
    "organization's organic search dominance, eliminate digital friction, and establish an unshakeable competitive moat in the global search ecosystem."
]"""

new_p2_say = """p2_say = [
    "The foundation of our search infrastructure is the Dual-Retriever Hybrid Engine. In enterprise environments, relying solely on classical lexical "
    "search (such as BM25) causes severe vocabulary mismatch failures: users searching for 'cloud server orchestration' fail to retrieve articles titled "
    "'Kubernetes container management' despite complete semantic alignment. Conversely, relying solely on dense neural vector search causes precision "
    "degradation on exact keywords: users searching for specific alphanumeric part numbers, legal clause citations, or proprietary SDK method names "
    "receive fuzzy conceptual matches rather than the exact target document.",
    "To overcome this fundamental dilemma, the Capstone engine operationalizes a Dual-Retriever Architecture that executes sparse lexical search and "
    "dense neural vector search in parallel. This design combines the lightning speed and exact-match precision of inverted indices with the deep "
    "conceptual comprehension of continuous high-dimensional vector spaces. Both retrieval paths execute concurrently against identical document corpora, "
    "producing independent candidate rankings within strict five-to-ten-millisecond execution budgets.",
    "On the Lexical Retrieval side, the engine constructs an in-memory Positional Inverted Index. Ingested documents undergo strict text normalization: "
    "stripping punctuation, converting to lower case, tokenizing on whitespace boundaries, and filtering rare non-informative tokens. Each unique term "
    "maps to a postings list containing document identifiers ($D_i$), term frequencies ($f_{t,d}$), and positional offsets. When a query arrives, the "
    "engine computes exact Okapi BM25 relevance scores. It incorporates term frequency saturation controlled by parameter $k_1 = 1.5$ and document length "
    "normalization controlled by $b = 0.75$, calibrated against the corpus average document length ($\\text{avgdl}$). The lexical retriever extracts "
    "the top candidate documents with sub-five-millisecond execution times.",
    "Concurrently, on the Dense Retrieval side, the engine maintains an Approximate Nearest Neighbor (ANN) Vector Store. During document ingestion, "
    "each document's title and body are encoded through a sentence-transformer bi-encoder into a dense continuous embedding vector (e.g., 384 or 768 "
    "dimensions). Crucially, all document vectors are immediately normalized to unit Euclidean length ($\\|v\\|_2 = 1.0$). At query time, the incoming user "
    "query is embedded into the identical semantic space and normalized. Under unit normalization, cosine similarity reduces to an ultra-fast inner dot "
    "product: $$\\text{sim}(q, d) = \\langle \\hat{q}, \\hat{d} \\rangle$$. This enables the dense retriever to identify documents with shared semantic "
    "meaning even when query and document share zero lexical tokens.",
    "To ensure horizontal scalability across millions of enterprise documents, the dense vector store implements Inverted File (IVF) clustering with "
    "Hierarchical Navigable Small World (HNSW) graphs. The continuous vector space is partitioned into Voronoi cells around $K$ cluster centroids. Query "
    "vectors are evaluated against centroids to prune ninety percent of distant document clusters, searching only the nearest $n_{\\text{probe}}$ partitions. "
    "Within each partition, multi-layer HNSW graphs guide greedy logarithmic routing, guaranteeing that nearest neighbor candidates are identified in "
    "sub-twenty milliseconds without exhaustive brute-force distance scans across the entire corpus.",
    "The output of this dual-retriever pipeline is two distinct ranked candidate streams: $R_{\\text{lex}}$ (the top lexical keyword matches) and "
    "$R_{\\text{dense}}$ (the top semantic nearest neighbors). By maintaining both candidate streams in parallel, the engine guarantees that subsequent "
    "re-ranking stages have access to both exact lexical matches and deep conceptual context."
]"""

new_p3_say = """p3_say = [
    "Once candidate document lists have been retrieved by the dual lexical and dense engines, the platform enters its third phase: the Query Intelligence "
    "& Reciprocal Rank Fusion (RRF) Re-Ranking Pipeline. Raw candidates from disparate retrieval models cannot be presented directly to users; they "
    "must be unified, deduplicated, re-ranked, and enriched with query intent context. This pipeline represents the decision-making brain of the search "
    "engine, transforming disparate model signals into an optimal, high-precision Search Engine Results Page (SERP).",
    "The first mathematical responsibility of the pipeline is Reciprocal Rank Fusion (RRF). As established in information retrieval science, directly "
    "summing raw lexical BM25 scores (which are unbounded positive floats typically ranging from 0.0 to 35.0+) and dense cosine similarity scores "
    "(which are strictly bounded between -1.0 and +1.0) produces severe scale distortion and catastrophic model dominance. RRF solves this by translating "
    "each model's output into an Ordinal Rank Position ($r_m(D) \\in \\{1, 2, \\dots, K\\}$) and computing the reciprocal sum: "
    "$$\\text{RRF\\_Score}(D) = \\sum_{m \\in \\{\\text{BM25}, \\text{Dense}\\}} \\frac{1}{k + r_m(D)}$$, where the constant $k$ is set to the industry "
    "standard $k = 60$. The parameter $k = 60$ acts as a smoothing factor, dampening the advantage of top-ranked items and preventing single-model outliers "
    "from hijacking the final SERP while strongly rewarding documents that achieve consensus high rankings across both models.",
    "Simultaneously, the pipeline applies Intent-Aware Dynamic Re-Weighting based on Andrei Broder's search intent taxonomy. By inspecting the user query "
    "through a multi-class intent classifier, the pipeline classifies the session into Informational, Commercial Investigation, Transactional, or "
    "Navigational archetypes. An Adaptive Intent Multiplier ($\\omega_I$) is dynamically applied to candidate documents based on their Schema.org content "
    "type. For instance, when a query expresses Transactional intent (e.g., 'buy enterprise prebid server license'), candidate documents tagged as "
    "Product Detail Pages or Pricing Tables receive a 1.30x score multiplier. Conversely, if the query expresses Informational intent (e.g., 'how does "
    "header bidding work'), Technical Guides and Whitepapers receive a 1.25x multiplier, perfectly aligning user intent with landing page semantics.",
    "The pipeline then executes Sliding-Window Passage Extraction (MaxP). When long-form technical or educational documents rank in the top candidate pool, "
    "evaluating the document as a monolithic text block dilutes relevance due to length normalization penalties. To extract maximum granular precision, "
    "the engine segments each candidate document into 40-word sliding windows with 10-word overlaps. It scores each passage against the query tokens, "
    "selecting the single highest-scoring passage ($P_{\\text{best}} = \\arg\\max_p \\text{Score}(p, q)$) to serve as the Featured Answer Snippet on the "
    "SERP. This surfaces immediate, high-relevance textual answers directly to the user.",
    "Furthermore, the re-ranking pipeline implements Deduplication and Brand Safety Filtering. If multiple URLs from the same domain or subdomain "
    "occupy adjacent rank positions, the pipeline applies Diversity Clustering: suppressing redundant secondary pages to promote diverse viewpoints "
    "and prevent internal keyword cannibalization on the SERP.",
    "The output of this pipeline is a fully synthesized, intent-aligned SERP payload containing ranked URLs, composite RRF scores, lexical and dense "
    "rank provenance, extracted passage snippets, and structured Schema.org breadcrumbs, ready for sub-millisecond delivery to user browsers or APIs."
]"""

new_p4_say = """p4_say = [
    "The fourth pillar of our Capstone Control Tower is the Search Console BigQuery Analytics, Position Decay & Cannibalization Detector. While online "
    "retrieval and re-ranking pipelines answer live user queries, an enterprise search platform must continuously monitor and govern its real-world "
    "organic search performance across Google, Bing, and external search engines. The BigQuery analytics engine ingests daily Search Console bulk "
    "export telemetry, fitting empirical organic click-through rate models and auditing the domain's keyword footprint for ranking pathologies.",
    "Enterprise search organizations operate at massive data scale: Google Search Console Bulk Export streams billions of daily impression and click records "
    "directly into Google BigQuery partitioned tables (`searchdata_url_impression` and `searchdata_site_impression`). The analytical engine structures "
    "these tables with date partitioning on `data_date` and clustering on `query` and `url`. This partitioning strategy ensures that multi-year historical "
    "queries execute in seconds while minimizing BigQuery byte scanning costs across petabyte-scale search datasets.",
    "The analytical engine evaluates Organic Click-Through Rate Decay by fitting a non-linear Log-Logistic Sigmoidal Model across empirical click and "
    "impression data. Rather than assuming static CTR baselines, the model fits parameters $\\alpha$ (maximum ceiling), $\\beta$ (decay slope), and "
    "$\\gamma$ (inflection position) segmented by device type (desktop vs mobile) and search appearance (rich snippet vs plain text). When marketing "
    "teams evaluate content optimization initiatives, the engine forecasts incremental organic traffic by projecting CTR shifts across target positions.",
    "Simultaneously, the engine runs an Automated Keyword Cannibalization Audit across all active queries. Cannibalization occurs when Google splits "
    "impressions between two or more competing URLs on the domain for the same query. The engine computes the URL Splitting Ratio ($S_Q$) and "
    "Position Variance ($\\sigma^2_{\\text{pos}}$):",
    "$$S_Q = 1.0 - \\frac{\\text{Impressions}(U_{\\text{primary}}, Q)}{\\sum_{i} \\text{Impressions}(U_i, Q)}$$",
    "If $S_Q \\ge 0.25$ and $\\sigma^2_{\\text{pos}} \\ge 2.0$, the engine flags a Confirmed Cannibalization Conflict. Conflicted queries exhibit severe "
    "ranking volatility: Googlebot alternates between competing pages, diluting authority and depressing overall organic traffic. The engine outputs "
    "specific architectural remediation directives: 301 Redirect Consolidation, Canonicalization, or Internal Link Restructuring.",
    "Furthermore, the engine detects and quantifies SERP Feature Click Dilution. By comparing baseline CTR expectations against observed performance "
    "on queries with paid search ad clusters, local map packs, or competitor featured snippets, the engine isolates the exact percentage of organic "
    "clicks siphoned away by SERP visual features. This provides paid search (PPC) and organic search (SEO) squads with unified telemetry to coordinate "
    "bidding strategies and eliminate paid/organic search cannibalization."
]"""

new_p5_say = """p5_say = [
    "The culminating operational tier of our Milestone 10 Capstone War Room is the Executive Search Performance Dashboard & Strategic Organic ROI "
    "Telemetry. An elite enterprise search organization is judged not merely by technical elegance or latency metrics, but by its measurable commercial "
    "impact on enterprise revenue, capital efficiency, and customer acquisition. While machine learning retrievers and BigQuery pipelines process millions "
    "of daily transactions at wire speed, senior corporate leadership—Chief Executive Officers, Chief Marketing Officers, and Chief Financial Officers—require "
    "synthesis-grade financial telemetry demonstrating the direct business ROI of organic search technology investments.",
    "The Capstone Executive Dashboard synthesizes search performance across five strategic Key Performance Indicators (KPIs): Organic Revenue Attribution "
    "(total e-commerce and subscription revenue driven directly by organic search visits), Search Engine Market Share (organic share of voice relative "
    "to primary industry competitors across target keyword clusters), Cannibalization Remediation Yield (incremental revenue unlocked by consolidating "
    "conflicted internal URLs), Featured Snippet Conquest Rate (the percentage of high-value informational queries where our passage ranking captures "
    "Position 0 on the SERP), and Query Understanding Precision (the percentage of search sessions successfully routed to high-converting content archetypes).",
    "In traditional, un-optimized digital organizations, organic search is treated as an unpredictable marketing black box. Traffic surges and drops are "
    "viewed with fatalism, and content is published blindly without intent alignment or structured data. Through our Autonomous Search Infrastructure, "
    "every search dollar is engineered with quantitative precision. By joining BigQuery Search Console performance logs with downstream CRM transaction "
    "data, the dashboard quantifies the Customer Acquisition Cost (CAC) of organic search relative to paid advertising channels: proving that organic "
    "search delivers high-margin customer acquisitions at eighty to ninety percent lower marginal cost than paid Google Ads or Meta PPC campaigns.",
    "To establish verifiable multi-touch attribution, the analytics platform applies algorithmic Shapley Value and Markov Chain attribution models to "
    "user journey clickstreams. Rather than relying on naive last-click attribution—which chronically undervalues top-of-funnel informational queries—the "
    "Markov model calculates the Removal Effect of each organic search touchpoint. This proves conclusively to executive stakeholders that informational "
    "and commercial guide pages nurture high-intent buyers, directly contributing to terminal conversion events and warranting sustained engineering investment.",
    "Furthermore, the executive suite provides Scenario Simulation and Capital Allocation Models. Corporate leadership can interactively model: 'What is "
    "the financial return of a $500,000 engineering investment to expand our knowledge graph structured data and optimize core web vitals across two "
    "million product pages?'. The engine simulates expected ranking elevations across the parametric log-logistic CTR curve, forecasts incremental "
    "traffic gains, applies historical conversion rates, and projects net multi-year discounted cash flows (NPV and IRR) with actuarial rigor.",
    "By completing the Milestone 10 Capstone War Room, you have successfully mastered the complete vertical stack of modern Search Engine Architecture "
    "and Semantic Information Retrieval. You have bridged the gap between low-level network crawlers, inverted indices, high-dimensional vector spaces, "
    "deep transformer bi-encoders, and high-level corporate financial governance. You possess the elite technical and strategic capabilities required "
    "to lead enterprise digital marketing, data engineering, and search discovery organizations at the highest global standards."
]"""

with open(builder_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace p1_say
content = re.sub(r"p1_say = \[.*?\]\np1_example", new_p1_say + "\np1_example", content, flags=re.DOTALL)
# Replace p2_say
content = re.sub(r"p2_say = \[.*?\]\np2_example", new_p2_say + "\np2_example", content, flags=re.DOTALL)
# Replace p3_say
content = re.sub(r"p3_say = \[.*?\]\np3_example", new_p3_say + "\np3_example", content, flags=re.DOTALL)
# Replace p4_say
content = re.sub(r"p4_say = \[.*?\]\np4_example", new_p4_say + "\np4_example", content, flags=re.DOTALL)
# Replace p5_say
content = re.sub(r"p5_say = \[.*?\]\np5_example", new_p5_say + "\np5_example", content, flags=re.DOTALL)

with open(builder_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Successfully updated build_day50_dmkt.py with enriched paragraphs!")
