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
    41: {
        0: [
            "Programmatic media buying automates real time impression trading.",
            "Publisher ad servers coordinate inventory across competing demand sources.",
            "Supply platforms broadcast auction opportunities across digital exchanges.",
            "Bidding algorithms evaluate impression values within millisecond windows."
        ],
        1: [
            "Open protocols establish standardized message payloads across ad tech.",
            "Impression arrays define slot dimensions and minimum reserve pricing.",
            "Contextual parameters declare publisher domains and user attributes.",
            "Synchronized bid responses return creative markup and clearing prices."
        ],
        2: [
            "Auction theory dictates clearing price efficiency across exchanges.",
            "Legacy mechanisms cleared winning bids at the second highest valuation.",
            "Modern marketplaces standardize on generalized first price mechanics.",
            "Bid shading algorithms calculate price discounts to capture surplus."
        ],
        3: [
            "High throughput exchanges process massive bid request volumes every second.",
            "Low latency network architectures enforce strict timeout cascades.",
            "Persistent socket pooling eliminates repetitive connection handshakes.",
            "Edge circuit breakers drop delayed bids to preserve page render speed."
        ],
        4: [
            "Machine learning models infer expected conversion rates in real time.",
            "Valuation algorithms calculate maximum economic willingness to pay.",
            "Dynamic shading models compress bids toward competitive market density.",
            "Structured response payloads deliver winning creatives to ad servers."
        ]
    },
    42: {
        0: [
            "Legacy waterfall setups evaluated demand partners in rigid sequences.",
            "Passback delays caused massive revenue leakage and slow page loads.",
            "Header bidding libraries execute concurrent auctions ahead of ad servers.",
            "Democratized competition lifts publisher yields across all inventory tiers."
        ],
        1: [
            "Client wrappers initialize asynchronous auctions inside browser headers.",
            "Parallel bidder adapters query supply partners without blocking content.",
            "Enforced timeout ceilings drop tardy bidders to protect user experience.",
            "Winning bid parameters translate into standardized ad server key values."
        ],
        2: [
            "Running numerous client adapters strains mobile device processors.",
            "Server to server architectures offload auction processing to the cloud.",
            "Datacenter relays broadcast bids over high speed optical connections.",
            "Hybrid wrappers balance client identity matching with cloud efficiency."
        ],
        3: [
            "Ad servers require discrete price buckets to evaluate programmatic bids.",
            "Fine granularity bucketing maps continuous prices to discrete intervals.",
            "Price priority line items compete dynamically against direct demand.",
            "Universal creative templates render winning third party ad markups."
        ],
        4: [
            "Adaptive timeout engines adjust deadlines based on client connection speed.",
            "Bidder health telemetry tracks response rates and timeout drop ratios.",
            "Lazy loading controllers trigger auctions as ad slots approach viewports.",
            "Unified wrapper orchestration maximizes publisher revenue per pageview."
        ]
    },
    43: {
        0: [
            "Opaque supply chains expose programmatic markets to intermediary fees.",
            "Domain spoofing schemes forge premium URLs on low quality websites.",
            "Arbitrage cascades deduct compounding commissions across multiple hops.",
            "Transparency standards eradicate hidden margin markups across ad paths."
        ],
        1: [
            "Publishers host declarative records on sovereign root web servers.",
            "Machine readable files declare authorized seller account identifiers.",
            "Direct relationships confirm publisher account ownership and control.",
            "Bidding algorithms reject requests from unlisted exchange accounts."
        ],
        2: [
            "Supply chain manifests document every intermediary transaction hop.",
            "Public seller directories confirm intermediary corporate identities.",
            "Directed graphs trace impression custody from publisher to exchange.",
            "Auditing engines cross reference chain nodes against public directories."
        ],
        3: [
            "Bidding platforms evaluate multiple competing routes to identical slots.",
            "Optimization algorithms prioritize direct single hop publisher paths.",
            "Eliminating intermediary hops compresses overall ad tech tax burdens.",
            "Consolidated supply paths lift working media efficiency for advertisers."
        ],
        4: [
            "Automated audit engines inspect streaming bid requests in real time.",
            "Verification filters block pixel stuffing and invalid traffic sources.",
            "Supply chain graph traversal confirms complete and authentic paths.",
            "Transparent routing policies protect advertising capital from fraud."
        ]
    },
    44: {
        0: [
            "Yield management optimizes revenue across perishable digital ad units.",
            "Reserve price floors establish minimum clearing thresholds for auctions.",
            "Price elasticity dictates the trade off between fill rate and unit yield.",
            "Optimized floor strategies protect inventory value from lowball bids."
        ],
        1: [
            "Static floors fail to capture shifting real time advertising demand.",
            "Machine learning models predict buyer valuation curves from context.",
            "Temporal surge factors lift reserve floors during peak buying windows.",
            "Dynamic pricing algorithms maximize expected revenue per impression."
        ],
        2: [
            "First price auctions incentivize buyers to deploy bid shading models.",
            "Censored regression models estimate competitive clearing distributions.",
            "Surplus maximization functions solve for optimal discounted bid prices.",
            "Dynamic floors establish firm valuation boundaries against buyer shading."
        ],
        3: [
            "Ad tech transaction cascades deduct compounding intermediary fees.",
            "Platform licensing and data verification surcharges erode working media.",
            "Log level audits trace gross ad spend to net publisher bank receipts.",
            "Direct purchasing partnerships compress overall supply chain margins."
        ],
        4: [
            "Unified yield engines synchronize floor rules with ad server systems.",
            "Continuous bid density sampling adapts floor pricing to market shifts.",
            "Unified pricing rules enforce fair competition across all auction tiers.",
            "Automated testing frameworks confirm incremental revenue expansion."
        ]
    },
    45: {
        0: [
            "Enterprise publishing stacks orchestrate hybrid client and server demand.",
            "Client fast paths preserve direct browser cookie identity match rates.",
            "Server relays execute high volume auctions without browser CPU bloat.",
            "Unified price buckets pass winning bids to ad servers seamlessly."
        ],
        1: [
            "High throughput auction microservices sustain extreme query volumes.",
            "Persistent socket pooling eliminates repetitive handshake latency.",
            "Decoupled media specifications compress real time payload weights.",
            "Strict execution timeouts guarantee sub eighty millisecond latency."
        ],
        2: [
            "Declarative seller files confirm authorized exchange relationships.",
            "Single hop supply chain objects prove direct publisher origin.",
            "Automated verification filters eliminate hidden iframe pixel stuffing.",
            "Cryptographic path validation ensures pristine media brand safety."
        ],
        3: [
            "Edge machine learning models predict contextual buyer bid distributions.",
            "Multi armed bandit controllers balance price exploration with yield.",
            "Unified pricing rules enforce dynamic floors across all demand sources.",
            "Automated synchronization protects revenue against buyer bid shading."
        ],
        4: [
            "Executive leadership reviews comprehensive monetization performance.",
            "Programmatic yield expansion delivers significant annual net profit.",
            "Supply path optimization increases advertiser working media ratios.",
            "Audited programmatic architecture achieves sovereign market leadership."
        ]
    }
}

print("=== GENERATING GATE V2 VISUAL ENVELOPES FOR DAYS 41 TO 45 ===")
for day_num in range(41, 46):
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

print("ALL GATE V2 VISUAL ENVELOPES FOR DAYS 41 TO 45 GENERATED AND VERIFIED!")
