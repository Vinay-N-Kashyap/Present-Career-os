import json
import os
import hashlib
import re

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
visuals_dir = os.path.join(commerce_dir, "src", "lib", "data", "lessonVisuals", "bcom_dmkt")
os.makedirs(visuals_dir, exist_ok=True)

stages = [
    {"name": "Traffic & Reach Discovery", "description": "Top funnel audience reach and traffic discovery signals"},
    {"name": "Qualified Intent Engagement", "description": "Middle funnel interest evaluation and consideration intent"},
    {"name": "Consideration & Conversion", "description": "High intent conversion actions and secure transaction recording"},
    {"name": "Customer Equity Retention", "description": "Long term customer value optimization and predictive retention"}
]

# Curated captions: zero digits (!/\d/), <= 75 chars, period-terminated
captions_map = {
    46: {
        0: [
            "Web spiders traverse digital networks to discover unindexed pages.",
            "Frontier queues prioritize URL crawling based on domain authority.",
            "Politeness throttles prevent denial of service on remote web hosts.",
            "Sitemaps provide structured canonical indexation feeds to search bots."
        ],
        1: [
            "Lexical parsers extract raw text and tokenize content into stems.",
            "Stop word filters eliminate low information grammatical tokens.",
            "Positional postings record term offsets to support phrase matching.",
            "Compressed inverted indices enable microsecond keyword lookups."
        ],
        2: [
            "Term frequency evaluates keyword density across individual documents.",
            "Inverse document frequency dampens common vocabulary terms.",
            "Length normalization accounts for varying document word counts.",
            "Term saturation curves prevent repetitive keyword stuffing manipulation."
        ],
        3: [
            "Hyperlink topologies represent directed graphs of global web authority.",
            "Random surfer models simulate probabilistic navigation across pages.",
            "Damping factors resolve dangling node link sinks and endless cycles.",
            "Iterative power iterations converge on stationary PageRank distributions."
        ],
        4: [
            "Integrated retrieval architectures score documents against user queries.",
            "Sparse posting lists are evaluated via fast term intersection algorithms.",
            "Document scores combine lexical relevance with global link authority.",
            "Ranked search results deliver relevant landing pages to users."
        ]
    },
    47: {
        0: [
            "Sparse keyword matching fails when consumers search using synonyms.",
            "The semantic gap isolates equivalent concepts across vocabularies.",
            "Polysemous words introduce retrieval noise without contextual cues.",
            "Dense continuous vector spaces project text into conceptual geometries."
        ],
        1: [
            "Bi encoder networks map queries and passages into dense embeddings.",
            "Transformer attention heads capture nuanced contextual relationships.",
            "Document vectors are precomputed and indexed offline for speed.",
            "Cross encoders evaluate joint attention to deliver high precision reranks."
        ],
        2: [
            "High dimensional vector spaces quantify conceptual text proximity.",
            "Cosine similarity measures the angular alignment of dense embeddings.",
            "Dot product operations calculate semantic relevance in sub milliseconds.",
            "Dimensionality reduction techniques compress embeddings to preserve RAM."
        ],
        3: [
            "Linear brute force vector scans become unsustainable at massive scale.",
            "Navigable small world graphs organize vectors into hierarchical layers.",
            "Express highway edges enable logarithmic geometric hops across clusters.",
            "Vector quantization compresses floating point arrays into compact bytes."
        ],
        4: [
            "Hybrid search engines execute parallel lexical and semantic retrievals.",
            "Reciprocal rank fusion harmonizes disparate scoring distributions.",
            "Business logic filters enforce inventory stock and margin requirements.",
            "Production pipelines deliver sub millisecond neural search results."
        ]
    },
    48: {
        0: [
            "Search queries provide concise windows into complex human intent.",
            "Informational searches demand comprehensive guides and documentation.",
            "Commercial exploration seeks comparative reviews and feature matrices.",
            "Transactional queries focus on frictionless checkout and fast conversion."
        ],
        1: [
            "Query normalizers clean raw user input and resolve typographical errors.",
            "Noisy channel language models suggest probabilistic spelling corrections.",
            "Synonym expansion bridges vocabulary gaps without causing semantic drift.",
            "Sub query decomposition splits compound searches into modular intents."
        ],
        2: [
            "Named entity recognition extracts products, brands, and technical terms.",
            "Semantic knowledge graphs link extracted entities to global taxonomies.",
            "Structured schema markup provides machine readable semantic metadata.",
            "Entity disambiguation clarifies user intent across ambiguous terms."
        ],
        3: [
            "Long documents suffer from length dilution under global scoring models.",
            "Sliding window passage segmenters isolate focused semantic chunks.",
            "Maximum passage pooling surfaces relevant text snippets to users.",
            "Extracting concise answer passages accelerates zero click discovery."
        ],
        4: [
            "Multi stage query classification systems route searches dynamically.",
            "Intent classifiers tag queries to apply specialized ranking formulas.",
            "Knowledge graph lookups enrich search results with structured facts.",
            "Optimized query pipelines deliver relevant category results to shoppers."
        ]
    },
    49: {
        0: [
            "Search Console provides authoritative ground truth on search performance.",
            "Web reporting interfaces truncate long tail search query logs.",
            "Restricted retention horizons prevent multi year seasonal comparisons.",
            "Bulk data pipelines export raw search telemetry directly into warehouses."
        ],
        1: [
            "Cloud data lakehouses ingest daily partition records from search logs.",
            "Table partitioning by date slashes query compute costs and scan latency.",
            "Multi column clustering collocates queries and landing pages in storage.",
            "Incremental merge operations ensure idempotent record updates in tables."
        ],
        2: [
            "Organic search click through rates decay exponentially by ranking rank.",
            "Top organic positions capture the dominant share of consumer clicks.",
            "Log logistic models fit non linear attention decay across positions.",
            "Search feature displays push organic listings downward on mobile viewports."
        ],
        3: [
            "Internal landing pages often compete for identical search keywords.",
            "Divided impression shares create ranking volatility across search engines.",
            "URL splitting ratios identify severe keyword cannibalization conflicts.",
            "Consolidating redundant pages restores authoritative search rankings."
        ],
        4: [
            "Automated warehouse pipelines monitor daily search rank fluctuations.",
            "Predictive forecasting models quantify the revenue value of ranking gains.",
            "Automated alert daemons flag emerging cannibalization incidents promptly.",
            "Integrated search analytics transform raw query logs into strategic growth."
        ]
    },
    50: {
        0: [
            "Sovereign search platforms eliminate reliance on external vendors.",
            "In house engines align ranking heuristics with corporate margin goals.",
            "Customer search intent logs remain secure within corporate networks.",
            "Sub thirty millisecond latencies ensure smooth consumer experiences."
        ],
        1: [
            "Change data capture pipelines stream catalog updates in real time.",
            "Positional posting indices compress term offsets to preserve memory.",
            "Double buffering segment merges prevent query locks during index updates.",
            "Distributed index shards scale throughput across search clusters."
        ],
        2: [
            "Dual core search engines query lexical and dense indices concurrently.",
            "Reciprocal rank fusion synthesizes candidate pools without score drift.",
            "Contextual late interaction rerankers evaluate token level attention.",
            "Commercial guardrails suppress out of stock items from final rankings."
        ],
        3: [
            "Search Console bulk exports stream external performance into BigQuery.",
            "Automated cannibalization detectors identify internal page conflicts.",
            "Paid and organic search integrations eliminate redundant ad bidding.",
            "Closed loop telemetry connects external search to internal catalog health."
        ],
        4: [
            "Executive war rooms review audited search solvency and financial metrics.",
            "Unified platforms demonstrate millions in incremental commercial value.",
            "Rigorous service level agreements guarantee high availability uptime.",
            "Enterprise search architectures secure lasting organic market dominance."
        ]
    }
}

def generate_visuals():
    step_keys = ['intro', 'say1', 'example', 'tryIt']
    
    for day in range(46, 51):
        data_path = os.path.join(commerce_dir, "scripts", "branch_b", f"day{day}_dmkt_data.json")
        with open(data_path, "r", encoding="utf-8") as f:
            day_data = json.load(f)

        entries = []
        for idx, part in enumerate(day_data["parts"]):
            p_title = part["title"]
            # SHA-256 binding: part["title"] + "".join(part["say"]) + part.get("code", "")
            raw_hash_input = part["title"] + "".join(part["say"]) + part.get("code", "")
            code_hash = hashlib.sha256(raw_hash_input.encode("utf-8")).hexdigest()

            day_captions = captions_map[day][idx]
            assert len(day_captions) == 4, f"Day {day} Part {idx} must have 4 captions"

            steps_data = []
            for step_idx, step_name in enumerate(step_keys):
                cap = day_captions[step_idx]
                # Enforce visual invariants
                assert not re.search(r'\d', cap), f"Caption contains digit: '{cap}'"
                assert cap.endswith('.'), f"Caption not period-terminated: '{cap}'"
                assert len(cap) <= 75, f"Caption exceeds 75 chars ({len(cap)}): '{cap}'"

                steps_data.append({
                    "at": step_name,
                    "caption": cap,
                    "stages": stages
                })

            entries.append({
                "partTitle": p_title,
                "codeHash": code_hash,
                "spec": {
                    "template": "funnel",
                    "steps": steps_data
                }
            })

        out_obj = {
            "schemaVersion": 1,
            "prefix": "bcom_dmkt",
            "day": day,
            "entries": entries
        }

        out_file = os.path.join(visuals_dir, f"day-{day}.json")
        with open(out_file, "w", encoding="utf-8") as f:
            json.dump(out_obj, f, indent=2)

        print(f"Generated Gate v2 visual envelope: day-{day}.json ({len(entries)} entries)")

if __name__ == "__main__":
    generate_visuals()
    print("All Block 10 visual envelopes generated and validated successfully!")
