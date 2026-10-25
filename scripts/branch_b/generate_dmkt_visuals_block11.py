import json
import os
import hashlib
import re

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
visuals_dir = os.path.join(commerce_dir, "src", "lib", "data", "lessonVisuals", "bcom_dmkt")
scripts_dir = os.path.join(commerce_dir, "scripts", "branch_b")
os.makedirs(visuals_dir, exist_ok=True)

stages = [
    {"name": "Traffic & Reach Discovery", "description": "Top funnel audience reach and traffic discovery signals"},
    {"name": "Qualified Intent Engagement", "description": "Middle funnel interest evaluation and consideration intent"},
    {"name": "Consideration & Conversion", "description": "High intent conversion actions and secure transaction recording"},
    {"name": "Customer Equity Retention", "description": "Long term customer value optimization and predictive retention"}
]

# Curated captions: zero digits (!/\d/), <= 75 chars, period-terminated
captions_map = {
    51: {
        0: [
            "Retail media monetizes deterministic purchase data at point of sale.",
            "First party grocery receipts eliminate probabilistic attribution.",
            "Trade marketing budgets shift from print circulars into digital media.",
            "Model pre ad gross profit margins to establish target bid boundaries."
        ],
        1: [
            "Generalized second price auctions balance relevance and clearing prices.",
            "Buy box ownership is mandatory to qualify for sponsored product auctions.",
            "Top of search placement boosts elevate catalog discovery velocity.",
            "Compute placement multipliers to capture top page search impressions."
        ],
        2: [
            "Target cost of sales formulas calculate profit maximizing bid boundaries.",
            "Dynamic bid shading models prevent margin dilution during peak hours.",
            "Catalog flywheel dynamics expand organic ranking through paid velocity.",
            "Calibrate bid adjustment vectors against historical conversion rates."
        ],
        3: [
            "Modular retail ad servers empower regional chains to launch ad networks.",
            "White label ad engines power sponsored search and display carousels.",
            "Standardized protocols connect brand media buyers to grocery networks.",
            "Configure enterprise retail ad server microservices for instant scale."
        ],
        4: [
            "Production bidding systems automate keyword bid adjustments at scale.",
            "Automated controllers enforce bid ceilings and inventory guardrails.",
            "Continuous optimization lifts return on ad spend across retail brands.",
            "Execute autonomous bidding algorithms to preserve net operating margin."
        ]
    },
    52: {
        0: [
            "First price auction models require strategic bid shading algorithms.",
            "Advertisers pay their exact submitted bid upon winning ad auctions.",
            "Bid shading protects profitability by estimating clearing thresholds.",
            "Implement dynamic bid shading curves to minimize media acquisition costs."
        ],
        1: [
            "Retail intelligence platforms unlock granular category market share.",
            "Basket affinity analytics expose high frequency product co purchases.",
            "Merchandising telemetry aligns paid search spend with on shelf inventory.",
            "Extract customer journey insights to optimize retail media allocation."
        ],
        2: [
            "Automated killswitches monitor real time warehouse inventory levels.",
            "Lost buy box status triggers immediate programmatic ad suppression.",
            "Inventory routing prevents wasting ad spend on out of stock products.",
            "Deploy automated webhooks to pause bids during distribution outages."
        ],
        3: [
            "Off site syndication extends retail shopper data to streaming video.",
            "Deterministic purchase histories power precision open web targeting.",
            "Connected television ads drive measurable in store grocery purchases.",
            "Bridge retailer loyalty segments to demand side platforms using tokens."
        ],
        4: [
            "Production retail control towers unify first price bidding and inventory.",
            "Real time telemetry halts campaigns when catalog supply drops low.",
            "Bid shading engines deliver double digit cost savings on search ads.",
            "Run the full Walmart Connect control tower to safeguard trade budgets."
        ]
    },
    53: {
        0: [
            "Digital storefront screens bring programmatic video into physical aisles.",
            "Standard video ad tags orchestrate dynamic retail screen playlists.",
            "Shoppers view contextually relevant promotions while browsing shelves.",
            "Configure digital out of home playlist schedulers for retail networks."
        ],
        1: [
            "Interactive shopping carts provide personalized aisle recommendations.",
            "Optical sensors measure shopper dwell time before physical endcaps.",
            "Proximity ad triggers display dynamic coupons as shoppers approach.",
            "Process sensor telemetry streams to evaluate in store ad engagement."
        ],
        2: [
            "Dynamic creative engines adjust video ads based on local weather shifts.",
            "High foot traffic surges trigger accelerated digital screen rotations.",
            "Local temperature drops promote warm beverage brands across store screens.",
            "Deploy rule based trigger engines to synchronize ads with store footfall."
        ],
        3: [
            "Wireless beacon telemetry measures store footfall without collecting PII.",
            "Differential privacy algorithms inject noise into store visit counts.",
            "Aggregated foot traffic data verifies offline advertising exposure.",
            "Audit physical store audience metrics under strict privacy standards."
        ],
        4: [
            "Unified in store media suites orchestrate physical screen networks.",
            "Automated schedulers coordinate brand video loops across departments.",
            "In store video exposure generates measurable physical sales lift.",
            "Simulate grocery store digital screen campaigns and footfall lift."
        ]
    },
    54: {
        0: [
            "Loyalty card scans link digital ad impressions to cash register receipts.",
            "Point of sale data captures universal product codes and purchase totals.",
            "Offline sales reconciliation eliminates reliance on probabilistic models.",
            "Match timestamped ad impressions with register receipts using hashed IDs."
        ],
        1: [
            "Retail clean rooms provide privacy safe environments for SQL analytics.",
            "Event level tables enable multi touch path to purchase exploration.",
            "Aggregation thresholds suppress micro cohorts to protect consumer privacy.",
            "Execute cross channel attribution queries inside secure clean rooms."
        ],
        2: [
            "Causal incrementality isolates true net new revenue from cannibalization.",
            "Synthetic control methods construct counterfactual baselines from donors.",
            "Geo matched experiments verify real sales lift across market clusters.",
            "Calculate incremental return on ad spend from regional testing flights."
        ],
        3: [
            "New to brand metrics distinguish genuine market expansion from loyalty.",
            "Lookback windows track whether buyers purchased in the prior year.",
            "Conquesting campaigns capture high value first time category shoppers.",
            "Segment attributed sales into new versus repeat customer revenue."
        ],
        4: [
            "Production clean room engines automate complex multi touch SQL pipelines.",
            "Automated compilers output verified incremental return on ad spend.",
            "Executive dashboards synthesize online and in store financial returns.",
            "Run the full closed loop attribution suite to audit trade marketing."
        ]
    },
    55: {
        0: [
            "The capstone bidding engine optimizes multi platform marketplace spend.",
            "Bid shading and target cost formulas protect corporate gross margins.",
            "Placement multipliers capture top of search visibility across portals.",
            "Initialize the enterprise retail media bidding orchestrator in Python."
        ],
        1: [
            "Autonomous telemetry switches monitor buy box share and inventory health.",
            "Out of stock conditions trigger instantaneous ad suppression rules.",
            "Inventory aware bidding prevents wasting trade capital on unavailable SKUs.",
            "Simulate automated killswitch triggers across regional warehouse nodes."
        ],
        2: [
            "Digital storefront video loops engage shoppers directly in physical aisles.",
            "Contextual screen triggers adjust video ads based on store foot traffic.",
            "In store digital displays lift product sales at physical checkouts.",
            "Deploy dynamic in store creative playlists to drive aisle conversion."
        ],
        3: [
            "Clean room SQL compilers join digital media views with physical receipts.",
            "Differential privacy noise protects individual shopper transaction logs.",
            "Omnichannel matching demonstrates substantial offline revenue expansion.",
            "Compile multi touch clean room queries to isolate true causal lift."
        ],
        4: [
            "The executive command matrix provides C suite commercial visibility.",
            "Causal incrementality proofs justify strategic retail media investments.",
            "Boardroom defense reports confer accredited commercial leadership.",
            "Synthesize full retail media operations into an executive defense brief."
        ]
    }
}

step_names = ["intro", "say1", "example", "tryIt"]

for day_num in range(51, 56):
    day_file = os.path.join(scripts_dir, f"day{day_num}_dmkt_data.json")
    with open(day_file, "r", encoding="utf-8") as f:
        day_data = json.load(f)
        
    entries = []
    for p_idx, part in enumerate(day_data["parts"]):
        p_title = part["title"]
        code_str = part.get("code", "")
        # Standard SHA-256 hash: part.title + part.say.join('') + (part.code || '')
        raw_hash_input = p_title + "".join(part["say"]) + code_str
        h = hashlib.sha256(raw_hash_input.encode("utf-8")).hexdigest()
        
        caps = captions_map[day_num][p_idx]
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

print("ALL GATE V2 VISUAL ENVELOPES FOR DAYS 51 TO 55 GENERATED AND VERIFIED!")
