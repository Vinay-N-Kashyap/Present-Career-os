import json
import hashlib
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
visuals_dir = os.path.join(commerce_dir, "src", "lib", "data", "lessonVisuals", "bcom_ecom")
os.makedirs(visuals_dir, exist_ok=True)

stage_templates = {
    56: [
        {
            "intro": "Marketplace onboarding gates ingest seller business attestation records.",
            "say1": "Sanctions list screenings intercept prohibited legal entities immediately.",
            "example": "Beneficial ownership records establish verified corporate provenance.",
            "tryIt": "Cleared seller entities receive automated marketplace selling status."
        },
        {
            "intro": "Continuous seller scorecards evaluate operational fulfillment health.",
            "say1": "Order defect rate metrics track cancellation and dispatch failures.",
            "example": "Breaching defect rate boundaries triggers algorithmic listing throttles.",
            "tryIt": "Probationary seller profiles require formal remediation plan approvals."
        },
        {
            "intro": "Multi factor Buy Box engines rank competing merchant offers in real time.",
            "say1": "Landed product pricing and fast fulfillment speeds earn primary weights.",
            "example": "Merchant reputation and pristine defect histories secure winning placement.",
            "tryIt": "Dynamic allocation algorithms drive superior customer conversion rates."
        },
        {
            "intro": "Seller suspension pipelines trigger automated enforcement interventions.",
            "say1": "Severe policy breaches freeze active listings and payout authorizations.",
            "example": "Structured appeal workflows ingest formal merchant plans of action.",
            "tryIt": "Verified remediation documentation restores merchant catalog privileges."
        },
        {
            "intro": "Seller operations command towers monitor marketplace fleet compliance.",
            "say1": "Automated fleet audits maintain healthy fulfillment performance levels.",
            "example": "High performing merchant cohorts capture dominant platform sales volume.",
            "tryIt": "Continuous operational reviews certify master marketplace seller health."
        }
    ],
    57: [
        {
            "intro": "Multi party checkout engines capture unified customer payment charges.",
            "say1": "Parent payment authorizations split into atomic child merchant transfers.",
            "example": "Processing fees and commission deductions are allocated transparently.",
            "tryIt": "Idempotent payment orchestrators prevent duplicate fund movements."
        },
        {
            "intro": "Dynamic commission waterfall engines calculate category take rates.",
            "say1": "High margin categories absorb higher baseline platform commissions.",
            "example": "Rolling merchant sales volume tiers unlock progressive fee rebates.",
            "tryIt": "Minimum closing fee floors protect platforms on low value transactions."
        },
        {
            "intro": "Regulatory escrow engines segregate merchant sales funds from operations.",
            "say1": "Segregated custodial trust accounts comply with statutory payment rules.",
            "example": "Dynamic rolling reserve buffers absorb potential dispute liabilities.",
            "tryIt": "Matured escrow vintages release automatically into merchant balances."
        },
        {
            "intro": "Merchant settlement pipelines compile consolidated daily payout batches.",
            "say1": "Sales credits offset customer return debits and monthly software fees.",
            "example": "Automated clearinghouse transfers dispatch funds to verified accounts.",
            "tryIt": "Continuous tracking streamlines statutory tax information reporting."
        },
        {
            "intro": "Marketplace treasury observatories enforce daily three way balances.",
            "say1": "Internal transactional ledgers reconcile against banking cash assets.",
            "example": "Near zero clearing variance error rates defend custodial solvency.",
            "tryIt": "Forensic treasury audits certify pristine financial platform governance."
        }
    ],
    58: [
        {
            "intro": "Asynchronous feed ingestion gates absorb massive multi vendor catalogs.",
            "say1": "Streaming validation workers isolate malformed rows into error queues.",
            "example": "Compliant product listings flow into downstream catalog pipelines.",
            "tryIt": "Distributed rate limiters protect backend databases from feed traffic."
        },
        {
            "intro": "Universal barcode deduplication engines evaluate international standards.",
            "say1": "Check digit algorithms intercept forged and invalid barcode sequences.",
            "example": "Valid barcodes consolidate competing merchant offers under one master.",
            "tryIt": "Canonical master products eliminate duplicate listing clutter on web."
        },
        {
            "intro": "Product information managers normalize chaotic multi vendor attributes.",
            "say1": "Synonym dictionaries map descriptive shades into standard color families.",
            "example": "Automated taxonomy classifiers map raw paths into master category trees.",
            "tryIt": "Structured attribute models power high converting faceted search filters."
        },
        {
            "intro": "Brand protection gating engines restrict listings for protected brands.",
            "say1": "Unvetted third party merchants must submit authentic manufacturer proof.",
            "example": "Authorized reseller credentials unlock gated brand catalog permissions.",
            "tryIt": "Automated brand gating policies shield platforms from trademark claims."
        },
        {
            "intro": "Omnichannel syndication observatories monitor global catalog health.",
            "say1": "Change data capture pipelines stream real time updates to search nodes.",
            "example": "Sub second search indexing latency prevents out of stock purchases.",
            "tryIt": "Continuous catalog telemetry awards master catalog compliance status."
        }
    ],
    59: [
        {
            "intro": "Counterfeit risk scoring engines evaluate multi factor threat signals.",
            "say1": "Extreme price discounts on luxury goods trigger high severity warnings.",
            "example": "New seller tenure and suspicious shipping corridors escalate risk flags.",
            "tryIt": "Automated quarantine protocols intercept illicit goods before publication."
        },
        {
            "intro": "Review fraud detection engines uncover coordinated brushing campaigns.",
            "say1": "High ratios of unverified purchases and burst review spikes raise alerts.",
            "example": "Linguistic text entropy algorithms identify duplicate template phrases.",
            "tryIt": "Graph analytics isolate and neutralize collusive review syndicates."
        },
        {
            "intro": "Notice and takedown compliance gates process formal infringement claims.",
            "say1": "Sworn trademark infringement declarations trigger expedited suspensions.",
            "example": "Automated statutory notifications initiate counter notice windows.",
            "tryIt": "Expeditious takedown execution preserves essential safe harbor immunity."
        },
        {
            "intro": "Cryptographic provenance verifiers inspect digital product passports.",
            "say1": "Brand master keys generate unique digital signatures for serial numbers.",
            "example": "Mathematical verification blocks forged counterfeit certificates easily.",
            "tryIt": "Digital passport ownership transfers seamlessly upon consumer checkout."
        },
        {
            "intro": "Trust and safety fleet observatories monitor platform health metrics.",
            "say1": "Consumer fraud dispute rates remain strictly below industry thresholds.",
            "example": "Expedited takedown resolutions protect brand intellectual property.",
            "tryIt": "Comprehensive trust telemetry confers apex trusted marketplace status."
        }
    ],
    60: [
        {
            "intro": "The grand capstone synthesizes enterprise multi vendor catalog intake.",
            "say1": "Asynchronous gates isolate defective rows while accepting clean items.",
            "example": "Universal barcode deduplication consolidates offers into master records.",
            "tryIt": "Streaming change data capture maintains sub second search synchronization."
        },
        {
            "intro": "Multi party financial clearinghouses capture unified consumer payments.",
            "say1": "Variable category waterfalls compute platform take rate commissions.",
            "example": "Segregated custodial escrow accounts hold regulatory rolling reserves.",
            "tryIt": "Near zero clearing variances confirm exemplary financial discipline."
        },
        {
            "intro": "Algorithmic seller scorecards continuously track fulfillment defect rates.",
            "say1": "Multi factor scoring functions evaluate price speed and seller reputation.",
            "example": "Dynamic Buy Box allocations reward high performing merchant offers.",
            "tryIt": "Meritocratic allocation algorithms drive maximum customer retention."
        },
        {
            "intro": "Multimodal defense perimeters intercept counterfeit listings pre publish.",
            "say1": "Review fraud algorithms dismantle collusive brushing syndicates swiftly.",
            "example": "Notice and takedown compliance gates resolve claims in sub four hours.",
            "tryIt": "Cryptographic digital product passports verify authentic provenance."
        },
        {
            "intro": "The executive boardroom defense reviews total enterprise value creation.",
            "say1": "Catalog deduplication and treasury clearing deliver massive cash yields.",
            "example": "Fraud dispute avoidance and regulatory shields defend operating margins.",
            "tryIt": "The defense confers distinguished chief commerce architect accreditation."
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

for day_num in range(56, 61):
    data_path = os.path.join(commerce_dir, "scripts", "branch_b", f"day{day_num}_ecom_data.json")
    with open(data_path, "r", encoding="utf-8") as f:
        day_data = json.load(f)

    entries = []
    day_templates = stage_templates[day_num]

    for p_idx, part in enumerate(day_data["parts"]):
        title = part["title"]
        say_val = part["say"]
        say_text = "".join(say_val) if isinstance(say_val, list) else say_val
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
        json.dump(visual_doc, f, indent=2, ensure_ascii=False)

    print(f"Generated Gate v2 visual envelope for Day {day_num} at {out_visual_path}")

print("All 5 Block 12 visual files generated and verified!")
