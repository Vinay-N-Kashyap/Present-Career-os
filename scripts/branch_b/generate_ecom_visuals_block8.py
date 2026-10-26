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
    36: [
        {
            "intro": "Multi currency checkout requests arrive at payment orchestration layer.",
            "say1": "Routing engine inspects card brand and currency for optimal gateway.",
            "example": "European acquiring licenses slash cross border interchange surcharges.",
            "tryIt": "Execute smart routing benchmark and verify lowest interchange fees."
        },
        {
            "intro": "Payment requests enter Strong Customer Authentication evaluation.",
            "say1": "Risk scoring engine determines friction free exemptions for low risk.",
            "example": "Transaction risk analysis enables seamless frictionless authentication.",
            "tryIt": "Simulate frictionless challenge escalation under elevated risk."
        },
        {
            "intro": "Checkout tier initiates token exchange with card brand token service.",
            "say1": "Primary account numbers convert into merchant scoped network tokens.",
            "example": "Cryptographic cryptograms eliminate card storage liabilities safely.",
            "tryIt": "Verify token lifecycle updates and automated card reissuance sync."
        },
        {
            "intro": "Payment gateway emits transient network timeout or soft bank decline.",
            "say1": "Autonomous circuit breaker cascades request to secondary acquirer.",
            "example": "Secondary gateway achieves immediate successful transaction capture.",
            "tryIt": "Execute gateway fallback simulation and verify capture continuity."
        },
        {
            "intro": "International settlement engine ingests cross currency gross receipts.",
            "say1": "Treasury microservice locks wholesale spot rates via liquidity pools.",
            "example": "Automated hedging mitigates overnight foreign currency fluctuations.",
            "tryIt": "Audit multi currency settlement ledger and foreign exchange margins."
        }
    ],
    37: [
        {
            "intro": "Concurrent shoppers submit cart mutations across global edge nodes.",
            "say1": "In memory Redis clusters absorb high throughput line item mutations.",
            "example": "Asynchronous write behind syncs cart snapshots to database clusters.",
            "tryIt": "Benchmark edge cart mutation latency under high flash traffic."
        },
        {
            "intro": "Multi device shoppers update cart quantities across phones and tablets.",
            "say1": "State based counter models decompose additions and removal vectors.",
            "example": "Commutative merge operations achieve eventual consistency without locks.",
            "tryIt": "Execute distributed counter merge and assert conflict free totals."
        },
        {
            "intro": "Anonymous shopper authenticates with credentials at checkout page.",
            "say1": "Identity graph session merger reconciles guest and customer items.",
            "example": "Live pricing and available inventory revalidate merged cart items.",
            "tryIt": "Simulate identity cart merging and verify real time price checks."
        },
        {
            "intro": "Customer cart events stream continuously to distributed event logs.",
            "say1": "Consumer groups monitor customer inactivity and checkout progression.",
            "example": "Sixty minute inactivity timer flags session as abandoned candidate.",
            "tryIt": "Verify abandonment stream events and automated recovery triggers."
        },
        {
            "intro": "Mobile customer updates item quantity on portable cellular device.",
            "say1": "Pub sub channels broadcast state delta to connected browser sessions.",
            "example": "Desktop cart drawer renders updated quantities without page reload.",
            "tryIt": "Audit bidirectional sync latency across concurrent client sessions."
        }
    ],
    38: [
        {
            "intro": "Incoming cart payload arrives at high speed promotions engine.",
            "say1": "Alpha nodes filter item categories while beta nodes evaluate totals.",
            "example": "Shared condition nodes prevent redundant rule processing overhead.",
            "tryIt": "Benchmark pattern matching evaluation across hundreds of rules."
        },
        {
            "intro": "Order discounts enter deterministic waterfall execution pipeline.",
            "say1": "Engine applies volume tiers then coupons in mathematical sequence.",
            "example": "Sequential deductions protect gross profit margins from erosion.",
            "tryIt": "Execute discount waterfall and verify net subtotal calculations."
        },
        {
            "intro": "Shopper enters multiple promotional vouchers at checkout drawer.",
            "say1": "Incompatibility matrix enforces mutually exclusive coupon rules.",
            "example": "Knapsack optimizer selects best discount combination for shopper.",
            "tryIt": "Simulate coupon stacking evaluation and verify exclusion barriers."
        },
        {
            "intro": "Multi item product bundle combinations arrive at checkout engine.",
            "say1": "Pricing calculator computes package discount and proration weights.",
            "example": "Proportional cost allocation ensures accurate refund accounting.",
            "tryIt": "Verify prorated bundle discounts across distinct item line totals."
        },
        {
            "intro": "Syndicate attempts automated referral voucher farming attacks.",
            "say1": "Device canvas fingerprinting and velocity checks detect anomalies.",
            "example": "Disposable email heuristics neutralize circular referral schemes.",
            "tryIt": "Execute promotional abuse defense audit and confirm threat blocks."
        }
    ],
    39: [
        {
            "intro": "Checkout engine dispatches tax quote request to tax microservice.",
            "say1": "Spatial in memory cache checks precomputed jurisdiction tax rates.",
            "example": "Circuit breaker falls back to local tables during vendor outages.",
            "tryIt": "Benchmark tax calculation latency and verify cache hit ratios."
        },
        {
            "intro": "Order ships to destination state within United States boundaries.",
            "say1": "Nexus tracker evaluates statutory sales thresholds and tax rates.",
            "example": "Geocoded address coordinates pinpoint exact municipal tax rates.",
            "tryIt": "Calculate destination tax amounts across mixed municipal borders."
        },
        {
            "intro": "Cross border order originates between European Union member states.",
            "say1": "One Stop Shop mechanism applies destination value added tax rates.",
            "example": "Real time VIES validation confirms corporate tax exemption status.",
            "tryIt": "Audit European value added tax compliance and reverse charges."
        },
        {
            "intro": "Catalog products submit descriptions for customs classification.",
            "say1": "Classification engine maps items to six digit harmonized codes.",
            "example": "National tariff schedules append statutory duty rate extensions.",
            "tryIt": "Verify commodity classification accuracy and duty rate bindings."
        },
        {
            "intro": "International cross border parcel enters landed cost calculation.",
            "say1": "Valuation engine combines cost freight insurance and customs duty.",
            "example": "Delivered Duty Paid terms guarantee zero doorstep surprise fees.",
            "tryIt": "Execute landed cost calculation and verify international charges."
        }
    ],
    40: [
        {
            "intro": "Executive board convenes for Tier One payment orchestration review.",
            "say1": "Smart routing elevates authorization rates and cuts interchange.",
            "example": "Network tokenization and dynamic exemptions ensure smooth flow.",
            "tryIt": "Audit payment orchestration scorecard and interchange savings."
        },
        {
            "intro": "Executive committee reviews Tier Two distributed cart architecture.",
            "say1": "Conflict free replicated types eliminate race conditions cleanly.",
            "example": "Event streaming telemetry reduces cart abandonment significantly.",
            "tryIt": "Verify cart state convergence and automated abandonment recovery."
        },
        {
            "intro": "Executive committee reviews Tier Three promotional rules engine.",
            "say1": "In memory pattern matching evaluates complex rules without lag.",
            "example": "Waterfall sequencing and abuse defense preserve business margins.",
            "tryIt": "Audit discount waterfall execution and coupon security barriers."
        },
        {
            "intro": "Executive committee reviews Tier Four international trade engine.",
            "say1": "Guaranteed landed cost eliminates unexpected international fees.",
            "example": "Statutory tax ledgers satisfy global audit compliance mandates.",
            "tryIt": "Audit cross border tax compliance and customs duty calculations."
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

for day_num in range(36, 41):
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
