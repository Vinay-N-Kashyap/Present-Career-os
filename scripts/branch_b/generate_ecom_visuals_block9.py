import json
import hashlib
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
visuals_dir = os.path.join(commerce_dir, "src", "lib", "data", "lessonVisuals", "bcom_ecom")
os.makedirs(visuals_dir, exist_ok=True)

# Captions with zero numeric digits (!/\d/), period-terminated, length <= 75
stage_templates = {
    41: [
        {
            "intro": "Incoming customer orders arrive at distributed order routing engine.",
            "say1": "Routing matrix balances geographic distance freight cost and carbon.",
            "example": "Candidate fulfillment nodes evaluate proximity and carrier tariffs.",
            "tryIt": "Execute distributed order routing and verify optimal node selection."
        },
        {
            "intro": "Storefront components query real time inventory allocation counters.",
            "say1": "Available to promise engine deducts safety stock and allocations.",
            "example": "Inbound purchase orders project capable to promise stock velocity.",
            "tryIt": "Calculate immediate available stock and projected incoming units."
        },
        {
            "intro": "Multi item shopping baskets evaluate fulfillment node availability.",
            "say1": "Knapsack optimizer seeks single facility containing complete basket.",
            "example": "Consolidated shipments eliminate redundant carrier residential fees.",
            "tryIt": "Evaluate multi node stock coverage and assert single package dispatch."
        },
        {
            "intro": "Fulfillment orchestrator initiates sequential transaction workflow.",
            "say1": "Saga coordinates local transactions across decoupled microservices.",
            "example": "Compensating transactions execute reverse rollbacks on failures.",
            "tryIt": "Simulate fulfillment lifecycle saga and verify state progression."
        },
        {
            "intro": "Control tower monitors network throughput and carrier dispatch nodes.",
            "say1": "Autonomous exception heuristics reallocate inventory on pick shorts.",
            "example": "Real time telemetry safeguards customer delivery agreement promises.",
            "tryIt": "Audit enterprise fulfillment network metrics and freight cost savings."
        }
    ],
    42: [
        {
            "intro": "Inbound supplier shipments arrive at receiving bay dock doors.",
            "say1": "Cross dock engine checks active customer backorders in real time.",
            "example": "Merchandise diverts directly to outbound lanes without storage.",
            "tryIt": "Simulate cross dock flow through and verify putaway cost avoidance."
        },
        {
            "intro": "Trading partner transmits electronic document over secure gateway.",
            "say1": "EDI translator parses structured segments into internal domain events.",
            "example": "Functional acknowledgments confirm valid message envelope delivery.",
            "tryIt": "Parse electronic shipping notice envelope and extract purchase order."
        },
        {
            "intro": "Inbound freight trailer docks at automated facility receiving doors.",
            "say1": "Laser scanners read exterior container barcodes in real time.",
            "example": "Automated reconciliation validates physical counts against manifest.",
            "tryIt": "Execute receiving reconciliation and isolate shipment discrepancies."
        },
        {
            "intro": "Order management system dispatches fulfillment webhooks to partners.",
            "say1": "Rate shopping engine evaluates multiple carrier contract tariffs.",
            "example": "Reliability scores guide carrier selection to meet delivery targets.",
            "tryIt": "Simulate multi carrier rate shopping and reserve optimal transport."
        },
        {
            "intro": "Global command tower tracks purchase orders across international nodes.",
            "say1": "Inbound tracking monitors port dwell times and vendor compliance.",
            "example": "High cross dock utilization drives massive operating cost savings.",
            "tryIt": "Evaluate inbound logistics performance and verify corporate savings."
        }
    ],
    43: [
        {
            "intro": "Customer initiates return request on digital self service portal.",
            "say1": "Return rules engine validates policy window and calculates fees.",
            "example": "Dynamic carrier labels provide trackable return waybills seamlessly.",
            "tryIt": "Authorize return request and verify return merchandise tracking code."
        },
        {
            "intro": "Returned parcels arrive at specialized facility inspection benches.",
            "say1": "Triage engine inspects physical condition and assigns grade tiers.",
            "example": "Pristine items restock to prime catalog while open box units discount.",
            "tryIt": "Evaluate returned item and assign optimal secondary sales channel."
        },
        {
            "intro": "Salvage inventory aggregates into manifested wholesale pallet lots.",
            "say1": "Wholesale auction console evaluates buyer bids against price floor.",
            "example": "Competitive wholesale bidding maximizes secondary capital recovery.",
            "tryIt": "Clear wholesale clearance lot and declare winning bidder clearing sum."
        },
        {
            "intro": "Return authorization engine inspects customer historical behavior.",
            "say1": "Anomaly detection flags excessive return rates and serial mismatches.",
            "example": "High risk returns divert to mandatory warehouse physical inspection.",
            "tryIt": "Evaluate customer return velocity and block instant refund abuse."
        },
        {
            "intro": "Circular command tower monitors return disposition across all nodes.",
            "say1": "Component harvesting and recycling divert merchandise from landfills.",
            "example": "Restocking and resale recapture millions in corporate working capital.",
            "tryIt": "Audit circular economy metrics and verify landfill diversion ratios."
        }
    ],
    44: [
        {
            "intro": "Post purchase operations record state changes as immutable events.",
            "say1": "Append only event logs preserve complete temporal transaction history.",
            "example": "State replay reconstructs exact order status without database locks.",
            "tryIt": "Append lifecycle events and replay active order operational status."
        },
        {
            "intro": "Checkout requests generate unique distributed tracing identifiers.",
            "say1": "Context propagation injects standard headers across microservices.",
            "example": "Linked child spans illuminate latency bottlenecks across services.",
            "tryIt": "Create distributed trace spans and verify context header propagation."
        },
        {
            "intro": "Carrier tracking scans stream to enterprise ingestion endpoints.",
            "say1": "Normalization engine maps disparate codes into canonical statuses.",
            "example": "Delivery exception events route directly to dedicated alert streams.",
            "tryIt": "Normalize raw carrier status codes and isolate exception events."
        },
        {
            "intro": "Customer notification engine listens for canonical milestone events.",
            "say1": "Dynamic predictor adjusts delivery arrival dates for weather delays.",
            "example": "Proactive exception alerts inform customers before delays escalate.",
            "tryIt": "Calculate dynamic delivery arrival window and trigger proactive alert."
        },
        {
            "intro": "Command tower monitors active parcel deliveries across carrier zones.",
            "say1": "On time delivery telemetry and automated refund claims protect margins.",
            "example": "Proactive communication drives superior customer satisfaction ratings.",
            "tryIt": "Audit post purchase operational performance and customer satisfaction."
        }
    ],
    45: [
        {
            "intro": "Executive committee convenes for Tier One order routing review.",
            "say1": "Distributed order management optimizes multi node freight routing.",
            "example": "Single shipment consolidation protects operating profit margins.",
            "tryIt": "Audit order routing scorecard and inventory allocation accuracy."
        },
        {
            "intro": "Executive committee reviews Tier Two inbound logistics performance.",
            "say1": "Cross docking flow through eliminates putaway warehousing labor.",
            "example": "Automated electronic manifests accelerate dock receiving throughput.",
            "tryIt": "Audit inbound logistics compliance and cross dock cost avoidance."
        },
        {
            "intro": "Executive committee reviews Tier Three circular reverse logistics.",
            "say1": "Automated disposition triage recaptures valuable working capital.",
            "example": "Zero landfill initiatives divert returned goods to secondary resale.",
            "tryIt": "Audit reverse logistics scorecard and secondary market recovery."
        },
        {
            "intro": "Executive committee reviews Tier Four post purchase observability.",
            "say1": "Distributed tracing and carrier normalization track parcel transit.",
            "example": "Proactive delivery notifications deflect customer support tickets.",
            "tryIt": "Audit post purchase telemetry and customer satisfaction scorecards."
        },
        {
            "intro": "Board of Directors convenes for official capstone accreditation.",
            "say1": "Composite scorecard evaluates performance across all four tiers.",
            "example": "Unanimous boardroom approval confers Chief Architect authority.",
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

for day_num in range(41, 46):
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
