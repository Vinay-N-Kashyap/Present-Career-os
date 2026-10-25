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
    36: {
        0: [
            "Client scripts execute in browser contexts with high tracking loss.",
            "Server containers act as first party proxies for incoming beacons.",
            "First party endpoints shield conversion signals from browser blocks.",
            "Sanitized server events route securely to downstream advertising APIs."
        ],
        1: [
            "Server APIs establish authenticated direct connections to networks.",
            "Data payloads encapsulate hashed customer attributes and event data.",
            "Encrypted customer parameters match authenticated platform profiles.",
            "Attribution engines credit historical campaign touchpoints accurately."
        ],
        2: [
            "Browser pixels and server webhooks emit parallel conversion events.",
            "Matching identifiers prevent duplicate transaction registration.",
            "Ingestion engines merge browser context with enriched server data.",
            "Attribution reporting captures full revenue without double counting."
        ],
        3: [
            "Raw customer inputs contain inconsistent casing and whitespace.",
            "Normalization algorithms standardize emails and telephone formats.",
            "Cryptographic hashing protects personal privacy before transmission.",
            "High quality match scores maximize algorithmic campaign optimization."
        ],
        4: [
            "Serverless containers scale dynamically with incoming traffic spikes.",
            "Load balancers distribute requests across warm multi region nodes.",
            "Central telemetry pipelines stream raw records to data warehouses.",
            "Auditable first party infrastructure guarantees operational stability."
        ]
    },
    37: {
        0: [
            "Legacy cookies enabled invasive cross site behavioral tracking.",
            "Modern privacy standards restrict data collection to local devices.",
            "Browser sandboxes compute interest signals without data leakage.",
            "Sustainable media architectures replace legacy third party cookies."
        ],
        1: [
            "Local classification models map visited hostnames to taxonomy topics.",
            "Weekly epochs identify top commercial interests across recent visits.",
            "Differential privacy noise guarantees plausible deniability.",
            "Callers receive coarse interest signals without cross site history."
        ],
        2: [
            "Shoppers join interest groups stored privately in local browsers.",
            "Sandboxed worker threads evaluate real time publisher ad auctions.",
            "Cryptographic key value servers return pricing signals securely.",
            "Fenced frames isolate winning creatives from host publisher pages."
        ],
        3: [
            "Client browsers record ad source events and subsequent conversions.",
            "Event level reports provide coarse signals for bidding optimization.",
            "Encrypted contributions aggregate inside trusted cloud enclaves.",
            "Differential privacy noise guarantees individual purchase anonymity."
        ],
        4: [
            "Statutory mandates require explicit affirmative consumer authorization.",
            "Consent management banners capture granular privacy preference flags.",
            "Server proxies inspect consent parameters before signal dispatching.",
            "Compliant architectures protect enterprises from regulatory liability."
        ]
    },
    38: {
        0: [
            "Enterprises possess proprietary first party transactional databases.",
            "Commercial collaboration demands zero risk of customer data leakage.",
            "Clean rooms federate computations directly to distributed data stores.",
            "Minimum cohort thresholds prevent individual customer re identification."
        ],
        1: [
            "Cloud data platforms establish secure analytical collaboration spaces.",
            "Analysis rules restrict queries to pre approved aggregate functions.",
            "Identity connectors translate disparate identifiers without exposure.",
            "Data sharing agreements govern multi party commercial queries."
        ],
        2: [
            "Commutative encryption allows secure calculation of set intersections.",
            "Only overlapping records produce identical cryptographic ciphertexts.",
            "Secret sharing schemes distribute mathematical computations securely.",
            "Zero knowledge protocols unlock multi party analytics without risk."
        ],
        3: [
            "Malicious analysts attempt differencing attacks across queries.",
            "Parameterized analysis templates prevent arbitrary query submission.",
            "Calibrated Laplace noise preserves formal differential privacy bounds.",
            "Epsilon budget tracking prevents cumulative statistical leakage."
        ],
        4: [
            "Retail media networks link digital ad exposures with store sales.",
            "Joint audience queries uncover high propensity conquesting cohorts.",
            "SKU level register scans calculate verified return on media spend.",
            "Closed loop measurement proves omnichannel incremental retail lift."
        ]
    },
    39: {
        0: [
            "Non contractual commerce exhibits unobservable silent customer churn.",
            "Probabilistic models treat customer purchasing as stochastic arrivals.",
            "Recency frequency and tenure statistics capture customer histories.",
            "Forward looking lifetime estimates guide capital allocation decisions."
        ],
        1: [
            "Transaction rates vary across customer populations via distributions.",
            "Dropout probabilities model post purchase customer attrition risk.",
            "The model calculates exact conditional active customer probabilities.",
            "Recent purchases signal active status while long gaps imply churn."
        ],
        2: [
            "Transaction frequency alone does not reflect monetary customer value.",
            "Bayesian shrinkage pulls extreme small sample spend toward the mean.",
            "Historical spend evidence dampens shrinkage as transactions mount.",
            "Discounted cash flows derive true net present customer asset value."
        ],
        3: [
            "Cost per acquisition models treat all customer cohorts identically.",
            "Value based bidding optimizes auctions against predicted lifetime margin.",
            "Smart bidding engines multiply bids to win high equity VIP profiles.",
            "Dispatched value vectors improve portfolio customer acquisition margins."
        ],
        4: [
            "Historical transactional ledgers split into calibration windows.",
            "Holdout evaluation verifies forward looking predictive generalizability.",
            "Diagnostic regression residuals confirm model statistical health.",
            "Production machine learning scoring updates customer equity vectors."
        ]
    },
    40: {
        0: [
            "First party proxies and clean rooms unify into enterprise gateways.",
            "Multi channel pipelines dispatch conversion events across endpoints.",
            "Cryptographic boundaries govern real time telemetry transformations.",
            "Auditable data architectures power automated commercial optimization."
        ],
        1: [
            "Client side browser anomalies degrade raw conversion signal flows.",
            "Server fallback routines recover missing identifiers from parameters.",
            "Dead letter queues replay dropped transactions with normalized hashes.",
            "Automated recovery restores campaign quality scores and bid pacing."
        ],
        2: [
            "Correlated query streams attempt customer differencing attacks.",
            "Security monitors trip circuit breakers to halt suspicious sessions.",
            "Differential privacy noise shields individual customer records.",
            "Parameterized stored procedures eliminate ad hoc security risks."
        ],
        3: [
            "Historical customer records calibrate frequency and spend models.",
            "Predictive value deciles distinguish VIPs from high churn cohorts.",
            "Reverse ETL pipelines stream value vectors to ad network engines.",
            "Algorithmic value based bidding expands contribution profit margins."
        ],
        4: [
            "Executive leadership reviews verified multi channel performance.",
            "First party data assets yield durable competitive market advantages.",
            "Continuous compliance testing guarantees statutory privacy integrity.",
            "Enterprise marketing architectures earn prestigious accreditation."
        ]
    }
}

print("=== GENERATING GATE V2 VISUAL ENVELOPES FOR DAYS 36 TO 40 ===")
for day_num in range(36, 41):
    d_path = os.path.join(commerce_dir, "scripts", "branch_b", f"day{day_num}_dmkt_data.json")
    with open(d_path, "r", encoding="utf-8") as f:
        lesson = json.load(f)
        
    entries = []
    day_caps = captions_map[day_num]
    
    for p_idx, part in enumerate(lesson["parts"]):
        p_title = part["title"]
        p_say = "".join(part["say"])
        p_code = part.get("code", "")
        
        # Invariant: codeHash = sha256(part.title + part.say.join('') + (part.code || ''))
        h = hashlib.sha256((p_title + p_say + p_code).encode("utf-8")).hexdigest()
        
        caps = day_caps[p_idx]
        step_names = ["intro", "say1", "example", "tryIt"]
        steps = []
        for s_idx, s_name in enumerate(step_names):
            c_text = caps[s_idx]
            # Verify Gate v2 invariants
            assert not re.search(r"\d", c_text), f"Caption contains digits: {c_text}"
            assert c_text.endswith("."), f"Caption must end with period: {c_text}"
            assert len(c_text) <= 75, f"Caption exceeds 75 chars ({len(c_text)}): {c_text}"
            
            steps.append({
                "at": s_name,
                "caption": c_text,
                "stages": stages
            })
            
        entries.append({
            "partTitle": p_title,
            "codeHash": h,
            "spec": {
                "template": "funnel",
                "steps": steps
            }
        })
        
    visual_envelope = {
        "schemaVersion": 1,
        "prefix": "bcom_dmkt",
        "day": day_num,
        "entries": entries
    }
    
    out_file = os.path.join(visuals_dir, f"day-{day_num}.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(visual_envelope, f, indent=2)
    print(f"Generated {out_file} with {len(entries)} verified entries.")

print("ALL GATE V2 VISUAL ENVELOPES FOR DAYS 36 TO 40 GENERATED AND VERIFIED!")
