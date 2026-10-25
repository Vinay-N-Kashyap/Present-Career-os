import json
import hashlib
import os
import re

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
visuals_dir = os.path.join(commerce_dir, "src", "lib", "data", "lessonVisuals", "bcom_ecom")
os.makedirs(visuals_dir, exist_ok=True)

# Captions with zero numeric digits (!/\d/), period-terminated, length <= 75
stage_templates = {
    31: [
        {
            "intro": "Storefront presentation requests arrive at global edge network nodes.",
            "say1": "Composable edge workers inspect cached catalog data and templates.",
            "example": "Edge compute serves cached product detail pages with minimal delay.",
            "tryIt": "Benchmark edge cache hit ratios and verify subsecond latency metrics."
        },
        {
            "intro": "Independent domain microservices expose dedicated business APIs.",
            "say1": "API gateway orchestrates incoming requests across decoupled services.",
            "example": "Catalog pricing and inventory squads deploy services independently.",
            "tryIt": "Validate token bucket rate limiters under simulated burst traffic."
        },
        {
            "intro": "Storefront components request dynamic pricing and product metadata.",
            "say1": "Apollo Router decomposes client queries into parallel execution stages.",
            "example": "Edge caches satisfy recurring product queries without database calls.",
            "tryIt": "Verify cache tag invalidation triggers during product price updates."
        },
        {
            "intro": "High concurrency traffic arrives at enterprise edge gateway endpoints.",
            "say1": "Token bucket algorithms evaluate request quotas and burst allowances.",
            "example": "Surge traffic is shaped smoothly while protecting backend clusters.",
            "tryIt": "Simulate rate limiter rejections under sustained burst traffic."
        },
        {
            "intro": "Master headless commerce command tower initiates architecture audit.",
            "say1": "Telemetry monitors verify edge response latency and cache hit rates.",
            "example": "Decoupled presentation tiers absorb surges without backend impact.",
            "tryIt": "Execute end to end headless architecture benchmark in Python."
        }
    ],
    32: [
        {
            "intro": "Distributed engineering squads manage domain specific GraphQL schemas.",
            "say1": "Apollo Federation stitches independent subgraphs into a supergraph.",
            "example": "Catalog pricing and inventory teams deploy without schema conflicts.",
            "tryIt": "Run schema composition verification to confirm conflict free types."
        },
        {
            "intro": "Entity directives establish primary keys across distributed subgraphs.",
            "say1": "Key and shareable directives unify product entities across services.",
            "example": "Reviews and inventory subgraphs extend core product types cleanly.",
            "tryIt": "Validate entity resolver references across distinct microservices."
        },
        {
            "intro": "Router query compiler constructs execution plans for incoming queries.",
            "say1": "Query planning decomposes nested selections into parallel fetch steps.",
            "example": "Parallel requests bound latency to the slowest individual service.",
            "tryIt": "Inspect query execution plans to identify optimization bottlenecks."
        },
        {
            "intro": "Multiple nested resolvers request related entities from databases.",
            "say1": "DataLoader batches individual lookups into single database queries.",
            "example": "Collapsing nested queries eliminates catastrophic query storms.",
            "tryIt": "Verify batch loader execution and cache memoization within requests."
        },
        {
            "intro": "Federated commerce router suite executes comprehensive graph checks.",
            "say1": "Router coordinates schema composition query planning and batching.",
            "example": "Unified API gateway serves mobile and web clients with low latency.",
            "tryIt": "Execute end to end federated graph simulation in Python."
        }
    ],
    33: [
        {
            "intro": "High volume checkout requests arrive at asynchronous order gateways.",
            "say1": "Event driven architecture decouples checkout intake from fulfillment.",
            "example": "Downstream maintenance outages do not block synchronous order intake.",
            "tryIt": "Simulate event driven order pipeline across Kafka commit log topics."
        },
        {
            "intro": "Order services persist business entities and domain event records.",
            "say1": "Transactional outbox pattern commits orders and events atomically.",
            "example": "Change data capture tails database logs to publish events cleanly.",
            "tryIt": "Verify atomic database writes and reliable event log streaming."
        },
        {
            "intro": "Distributed orders span multiple isolated microservice databases.",
            "say1": "Orchestrated Saga state machines manage forward and reverse steps.",
            "example": "Downstream inventory stockouts trigger compensating payment refunds.",
            "tryIt": "Execute Saga orchestrator failure recovery and backward rollbacks."
        },
        {
            "intro": "Client network retries send duplicate order submission requests.",
            "say1": "Idempotency keys and distributed leases prevent duplicate charges.",
            "example": "Duplicate requests are intercepted and served from cache instantly.",
            "tryIt": "Simulate rapid duplicate submissions and verify idempotent caching."
        },
        {
            "intro": "Enterprise order command tower initiates full workflow coordination.",
            "say1": "Tower unites idempotency outbox streaming and Saga orchestration.",
            "example": "High concurrency flash sale orders process with zero dropped events.",
            "tryIt": "Run complete distributed order routing and Saga simulation."
        }
    ],
    34: [
        {
            "intro": "Multi echelon supply networks monitor inventory across global nodes.",
            "say1": "Available to promise calculations deduct reservations and safety stock.",
            "example": "Immediate and projected availability guide accurate promise dates.",
            "tryIt": "Calculate sellable availability using multi echelon inventory math."
        },
        {
            "intro": "Omnichannel sales touchpoints compete for shared physical inventory.",
            "say1": "Virtual warehouse partitions ring fence quotas for key channels.",
            "example": "Direct storefronts retain dedicated stock during marketplace spikes.",
            "tryIt": "Allocate sales against channel quotas and verify boundary limits."
        },
        {
            "intro": "Flash sale traffic creates intense concurrency on limited inventory.",
            "say1": "Redis atomic Lua scripts execute reservations in single thread loop.",
            "example": "Submillisecond memory execution eliminates database lock deadlocks.",
            "tryIt": "Simulate atomic inventory decrements and observe clean stockouts."
        },
        {
            "intro": "Physical warehouse reality diverges from digital ledger balances.",
            "say1": "Rolling cycle counting audits bins and logs variance adjustments.",
            "example": "Double entry adjustments synchronize ledgers without site downtime.",
            "tryIt": "Execute cycle count reconciliation and correct inventory variances."
        },
        {
            "intro": "Global inventory command tower oversees multi tenant stock posture.",
            "say1": "Command tower coordinates node health quotas and atomic reservation.",
            "example": "Multi region fulfillment operates with absolute zero overselling.",
            "tryIt": "Audit global multi node stock posture and sellable capacity."
        }
    ],
    35: [
        {
            "intro": "Executive committee reviews Tier One composable frontend architecture.",
            "say1": "Headless storefront and global edge CDN slash page delivery latency.",
            "example": "Subsecond edge response drives measurable lifts in checkout conversion.",
            "tryIt": "Audit edge response latency and cache hit ratios for Tier One."
        },
        {
            "intro": "Executive committee reviews Tier Two federated GraphQL supergraph.",
            "say1": "Apollo Federation and DataLoader eliminate database query fanout.",
            "example": "Autonomous domain subgraphs compose into a unified client gateway.",
            "tryIt": "Evaluate supergraph query planning and batching metrics for Tier Two."
        },
        {
            "intro": "Executive committee reviews Tier Three event driven order orchestrator.",
            "say1": "Transactional outbox and Saga patterns guarantee financial safety.",
            "example": "Compensating transactions cleanly reverse failed downstream steps.",
            "tryIt": "Audit order throughput and compensating rollback metrics for Tier Three."
        },
        {
            "intro": "Executive committee reviews Tier Four global multi tenant inventory.",
            "say1": "Atomic in memory locking and channel quotas eliminate overselling.",
            "example": "Multi echelon fulfillment balances inventory across regional nodes.",
            "tryIt": "Audit multi node inventory capacity and zero oversell for Tier Four."
        },
        {
            "intro": "Board of Directors convenes for official capstone defense evaluation.",
            "say1": "Executive scorecard synthesizes performance across all four tiers.",
            "example": "Unanimous boardroom approval confers Chief Architect accreditation.",
            "tryIt": "Execute master capstone defense and verify credential conferral."
        }
    ]
}

def make_stages():
    return [
        {"id": "s1", "label": "Edge Intake Stage", "value": "100.0%"},
        {"id": "s2", "label": "Security Validation", "value": "98.5%"},
        {"id": "s3", "label": "Transaction Processing", "value": "95.2%"},
        {"id": "s4", "label": "Fulfillment Dispatch", "value": "94.8%"}
    ]

for day_num in range(31, 36):
    data_file = os.path.join(commerce_dir, "scripts", "branch_b", f"day{day_num}_ecom_data.json")
    with open(data_file, "r", encoding="utf-8") as f:
        day_data = json.load(f)

    entries = []
    day_templates = stage_templates[day_num]

    for p_idx, part in enumerate(day_data["parts"]):
        title = part["title"]
        say_text = "".join(part["say"])
        code = part.get("code", "")
        raw_hash_input = title + say_text + code
        code_hash = hashlib.sha256(raw_hash_input.encode("utf-8")).hexdigest()

        captions = day_templates[p_idx]
        
        # Verify caption invariants
        for at_step in ["intro", "say1", "example", "tryIt"]:
            cap = captions[at_step]
            assert not re.search(r"\d", cap), f"Day {day_num} Part {p_idx+1} caption contains digits: {cap}"
            assert cap.endswith("."), f"Day {day_num} Part {p_idx+1} caption missing period: {cap}"
            assert len(cap) <= 75, f"Day {day_num} Part {p_idx+1} caption > 75 chars: {cap}"

        steps = [
            {"at": "intro", "caption": captions["intro"], "activeStageId": "s1", "stages": make_stages()},
            {"at": "say1", "caption": captions["say1"], "activeStageId": "s2", "stages": make_stages()},
            {"at": "example", "caption": captions["example"], "activeStageId": "s3", "stages": make_stages()},
            {"at": "tryIt", "caption": captions["tryIt"], "activeStageId": "s4", "stages": make_stages()}
        ]

        entries.append({
            "partTitle": title,
            "codeHash": code_hash,
            "spec": {
                "template": "funnel",
                "title": f"Day {day_num} Part {p_idx + 1} Architecture Flow",
                "steps": steps
            }
        })

    visual_doc = {
        "schemaVersion": 1,
        "prefix": "bcom_ecom",
        "day": day_num,
        "entries": entries
    }

    out_visual_path = os.path.join(visuals_dir, f"day-{day_num}.json")
    with open(out_visual_path, "w", encoding="utf-8") as f:
        json.dump(visual_doc, f, indent=2)

    print(f"Generated {out_visual_path} with 5 verified entries.")
