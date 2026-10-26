"""
Generate Gate v2 Visual Envelopes for Course 07 Block 12 (Days 56-60).
Captions: strictly NO digits (!/\\d/), period-terminated, length <= 75.
CodeHash: SHA-256 of (part.title + part.say.join('') + (part.code || ''))
"""
import json
import hashlib
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
visuals_dir = os.path.join(commerce_dir, "src", "lib", "data", "lessonVisuals", "bcom_ecom")
os.makedirs(visuals_dir, exist_ok=True)

# Captions for Day 56
captions_d56 = [
    # Part 1
    {
        "intro": "The enterprise edge gateway intercepts incoming client requests.",
        "say1": "Decoupled microservice routers dispatch endpoints across the mesh.",
        "example": "Correlation trace headers bind distributed service executions.",
        "tryIt": "Service mesh proxies enforce zero trust mutual transport security."
    },
    # Part 2
    {
        "intro": "Backend adapters inspect incoming mobile device user agent headers.",
        "say1": "Heavyweight desktop markup is pruned to conserve mobile bandwidth.",
        "example": "Optimized image thumbnails accelerate screen rendering on phones.",
        "tryIt": "Edge compute workers dynamically negotiate modern media formats."
    },
    # Part 3
    {
        "intro": "The federated supergraph defines autonomous domain entity schemas.",
        "say1": "Primary entity directives enable decoupled subgraph composition.",
        "example": "Declarative federation routes parallel queries across microservices.",
        "tryIt": "Query planners batch downstream entity loaders to prevent cascades."
    },
    # Part 4
    {
        "intro": "Global edge network servers cache dynamic catalog data near users.",
        "say1": "Stale responses serve instantly while background refreshes run.",
        "example": "Surrogate cache tags invalidate outdated prices across all nodes.",
        "tryIt": "Origin shield tiers collapse duplicate requests to protect databases."
    },
    # Part 5
    {
        "intro": "The composable architecture command tower aggregates mesh telemetry.",
        "say1": "High edge cache hit rates insulate relational database clusters.",
        "example": "Sub millisecond inter service calls eliminate cascading bottlenecks.",
        "tryIt": "The architectural audit confirms enterprise composable excellence."
    }
]

# Captions for Day 57
captions_d57 = [
    # Part 1
    {
        "intro": "Programmatic catalog routers generate clean indexable web addresses.",
        "say1": "Canonical link tags guide search engine crawlers to primary pages.",
        "example": "Robots directives prevent crawl budget exhaustion on deep filters.",
        "tryIt": "Partitioned sitemaps prioritize newly updated inventory listings."
    },
    # Part 2
    {
        "intro": "Semantic schema structures represent product offerings unambiguously.",
        "say1": "Global trade item numbers provide universal product identity.",
        "example": "Real time stock availability tags power rich search engine badges.",
        "tryIt": "Automated feeds maintain price parity across international engines."
    },
    # Part 3
    {
        "intro": "Edge static regeneration pre renders catalog pages at edge points.",
        "say1": "Cached static pages serve users with lightning fast responsiveness.",
        "example": "Asynchronous background workers rebuild stale pages upon expiry.",
        "tryIt": "Selective partial hydration loads client script only when needed."
    },
    # Part 4
    {
        "intro": "Real user telemetry monitors core web vitals across live sessions.",
        "say1": "Hero image preloading accelerates largest contentful paint scores.",
        "example": "Main thread task yielding maintains instant interactive responsiveness.",
        "tryIt": "Fixed dimension media attributes eliminate unexpected layout shifts."
    },
    # Part 5
    {
        "intro": "The enterprise search engine command tower audits catalog indexation.",
        "say1": "High crawl efficiency guarantees fast indexing for new products.",
        "example": "Validated structured data boosts organic search click through rates.",
        "tryIt": "Superior performance scores unlock search engine ranking rewards."
    }
]

# Captions for Day 58
captions_d58 = [
    # Part 1
    {
        "intro": "Omnichannel identity engines unify customer interactions across stores.",
        "say1": "Physical store barcode scans synchronize with online shopping bags.",
        "example": "Centralized loyalty systems reward shoppers across every touchpoint.",
        "tryIt": "Store edge controllers maintain local sales during network outages."
    },
    # Part 2
    {
        "intro": "Distributed inventory engines calculate available to promise stock.",
        "say1": "Dynamic safety buffers account for in store customer foot traffic.",
        "example": "Multi node routing selects optimal stores to ship online orders.",
        "tryIt": "Localized store fulfillment reduces parcel delivery transit zones."
    },
    # Part 3
    {
        "intro": "Store associates receive priority pick tickets on mobile scanners.",
        "say1": "Barcode verification ensures accurate item retrieval from shelves.",
        "example": "Physical staging bins organize customer orders for rapid pickup.",
        "tryIt": "Geofence notifications alert store clerks when shoppers arrive."
    },
    # Part 4
    {
        "intro": "In store return counters accept online merchandise without friction.",
        "say1": "Automated condition grading determines shelf restocking eligibility.",
        "example": "Payment token credits refund original bank cards without cash.",
        "tryIt": "Immediate shelf restocking recovers full retail profit margins."
    },
    # Part 5
    {
        "intro": "The omnichannel retail command tower monitors store fulfillment nodes.",
        "say1": "Strict pick time compliance eliminates service counter waiting lines.",
        "example": "Rapid in store return restocking preserves inventory asset value.",
        "tryIt": "The audit certifies apex omnichannel retail operations across stores."
    }
]

# Captions for Day 59
captions_d59 = [
    # Part 1
    {
        "intro": "Extreme flash sales bombard checkout endpoints with traffic surges.",
        "say1": "Relational database connection limits risk rapid queue starvation.",
        "example": "Row level locking contention triggers catastrophic worker deadlocks.",
        "tryIt": "Asynchronous traffic buffering insulates primary database clusters."
    },
    # Part 2
    {
        "intro": "Edge virtual waiting rooms intercept surge traffic before origin.",
        "say1": "Token bucket algorithms admit shoppers at safe processing rates.",
        "example": "Cryptographically signed tokens prevent queue jumping and forgery.",
        "tryIt": "Client side cryptographic challenges filter out automated scalpers."
    },
    # Part 3
    {
        "intro": "In memory cache layers handle sub millisecond stock reservations.",
        "say1": "Single threaded atomic scripts prevent inventory oversell defects.",
        "example": "Temporary reservation holds release stock if checkouts expire.",
        "tryIt": "Distributed lock consensus protects multi item product bundles."
    },
    # Part 4
    {
        "intro": "The checkout gateway publishes order events to durable partitions.",
        "say1": "Immediate accepted responses return to shoppers without waiting.",
        "example": "Decoupled consumer worker pools persist orders at steady rates.",
        "tryIt": "Deterministic idempotency keys eliminate duplicate transactions."
    },
    # Part 5
    {
        "intro": "The flash sale defense command tower monitors surge event telemetry.",
        "say1": "Zero oversell integrity preserves merchant reputation and customer trust.",
        "example": "Low checkout latency maintains flawless purchasing experiences.",
        "tryIt": "Chaos engineering drills certify military grade platform resilience."
    }
]

# Captions for Day 60
captions_d60 = [
    # Part 1
    {
        "intro": "The executive defense reviews the composable headless edge mesh.",
        "say1": "Autonomous GraphQL subgraphs eliminate monolithic release gridlock.",
        "example": "High edge cache hit rates insulate databases during traffic peaks.",
        "tryIt": "The board ratifies tier one composable architecture certification."
    },
    # Part 2
    {
        "intro": "The committee audits programmatic catalog search engine performance.",
        "say1": "Canonical URL controls prevent duplicate indexation and crawl waste.",
        "example": "Sub second edge rendering satisfies rigorous core web vitals.",
        "tryIt": "The board confirms tier two search engine optimization maturity."
    },
    # Part 3
    {
        "intro": "The candidate defends unified omnichannel retail store fulfillment.",
        "say1": "Distributed inventory buffers prevent store shelf stock depletion.",
        "example": "Rapid curbside pickup and in store returns drive customer loyalty.",
        "tryIt": "The board approves tier three omnichannel enterprise accreditation."
    },
    # Part 4
    {
        "intro": "The defense reviews flash sale surge handling and queue defense.",
        "say1": "Atomic in memory reservation scripts enforce zero oversell integrity.",
        "example": "Asynchronous event queues absorb extreme purchasing avalanches.",
        "tryIt": "The board ratifies tier four high concurrency system resilience."
    },
    # Part 5
    {
        "intro": "The executive boardroom evaluates total enterprise commercial yield.",
        "say1": "Validated annual returns demonstrate superior architectural value.",
        "example": "Unanimous apex scores reward sixty days of rigorous engineering.",
        "tryIt": "The board confers the chief commerce officer credential with honors."
    }
]

all_captions = {
    56: captions_d56,
    57: captions_d57,
    58: captions_d58,
    59: captions_d59,
    60: captions_d60
}

for day_num in range(56, 61):
    data_path = os.path.join(commerce_dir, "scripts", "branch_b", f"day{day_num}_ecom_data.json")
    with open(data_path, "r", encoding="utf-8") as f:
        day_data = json.load(f)
    
    day_caps = all_captions[day_num]
    entries = []
    
    for p_idx, part in enumerate(day_data["parts"]):
        caps = day_caps[p_idx]
        
        # Verify captions
        for k, cap in caps.items():
            assert not re.search(r'\d', cap), f"Day {day_num} Part {p_idx+1} {k} contains digit: '{cap}'"
            assert cap.endswith('.'), f"Day {day_num} Part {p_idx+1} {k} not period-terminated: '{cap}'"
            assert len(cap) <= 75, f"Day {day_num} Part {p_idx+1} {k} length > 75 ({len(cap)}): '{cap}'"
        
        say_str = "".join(part["say"]) if isinstance(part["say"], list) else part["say"]
        raw_hash_input = part["title"] + say_str + (part.get("code") or "")
        code_hash = hashlib.sha256(raw_hash_input.encode("utf-8")).hexdigest()
        
        spec = {
            "template": "funnel",
            "title": part["title"],
            "steps": [
                {
                    "id": "intro",
                    "label": "Synthesis Intake",
                    "at": "intro",
                    "caption": caps["intro"],
                    "stages": ["Signal Ingestion", "Protocol Translation", "Context Normalization", "Intake Ratification"]
                },
                {
                    "id": "say1",
                    "label": "Architectural Analysis",
                    "at": "say1",
                    "caption": caps["say1"],
                    "stages": ["Schema Decomposition", "Boundary Validation", "State Synchronization", "Policy Binding"]
                },
                {
                    "id": "example",
                    "label": "Domain Modeling",
                    "at": "example",
                    "caption": caps["example"],
                    "stages": ["Topology Mapping", "Constraint Verification", "Ledger Ledgering", "Audit Traceability"]
                },
                {
                    "id": "tryIt",
                    "label": "Operational Validation",
                    "at": "tryIt",
                    "caption": caps["tryIt"],
                    "stages": ["Execution Gate", "Consensus Attestation", "Certification Award", "Permanent Ingestion"]
                }
            ]
        }
        
        entries.append({
            "partIndex": p_idx,
            "partTitle": part["title"],
            "codeHash": code_hash,
            "spec": spec
        })
    
    visual_envelope = {
        "schemaVersion": 1,
        "prefix": "bcom_ecom",
        "day": day_num,
        "entries": entries
    }
    
    out_file = os.path.join(visuals_dir, f"day-{day_num}.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(visual_envelope, f, indent=2, ensure_ascii=False)
    
    print(f"Generated Day {day_num} visual envelope at {out_file} (5 entries, all SHA-256 bound)")

print("\nSuccessfully generated all Gate v2 visual envelopes for Block 12 (Days 56-60)!")
