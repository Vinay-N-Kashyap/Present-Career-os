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
    51: [
        {
            "intro": "Regional payment routers evaluate international market share metrics.",
            "say1": "Dominant local clearing methods are ranked by regional penetration.",
            "example": "Account to account rails eliminate card scheme cross border fees.",
            "tryIt": "Configurable catalogs prioritize preferred payment options per country."
        },
        {
            "intro": "Multi currency engines ingest base catalog prices in domestic currency.",
            "say1": "Dynamic volatility buffers absorb foreign exchange rate fluctuations.",
            "example": "Psychological rounding rules produce clean localized retail price points.",
            "tryIt": "Edge workers inject converted currencies while preserving cache rates."
        },
        {
            "intro": "Corporate treasury managers initiate rolling forward hedging contracts.",
            "say1": "Anticipated foreign sales volumes are pre sold at guaranteed rates.",
            "example": "Hedging gains protect operating profit when foreign currencies drop.",
            "tryIt": "Automated algorithmic sweeps repatriate surplus cash into base balances."
        },
        {
            "intro": "Guaranteed quote lock sessions freeze exchange rates during checkout.",
            "say1": "Locked quotes prevent price slippage between browsing and payment.",
            "example": "Localized checkout forms capture mandatory regional tax identifiers.",
            "tryIt": "Session validators refresh quotes smoothly after lock windows expire."
        },
        {
            "intro": "Global checkout command towers monitor international sales corridors.",
            "say1": "Localized payment rails drive superior cross border conversion yield.",
            "example": "Captured currency volatility buffers generate healthy operating margin.",
            "tryIt": "Treasury audits verify minimal settlement slippage across global rails."
        }
    ],
    52: [
        {
            "intro": "Landed cost calculation engines model international customs valuations.",
            "say1": "Freight and insurance allocations establish the dutiable valuation base.",
            "example": "Compounding customs duties and import taxes are calculated precisely.",
            "tryIt": "All inclusive landed cost figures eliminate post shipment fee variances."
        },
        {
            "intro": "Harmonized tariff schedules classify physical merchandise commodities.",
            "say1": "National tariff lines determine specific statutory import duty rates.",
            "example": "Rules of origin under trade agreements unlock preferential duty rates.",
            "tryIt": "Automated classification registries verify tariff eligibility rules."
        },
        {
            "intro": "Incoterms decision routers evaluate cross border fulfillment models.",
            "say1": "Delivered duty paid terms collect all duties and taxes at checkout.",
            "example": "Pre cleared customs shipments prevent unexpected doorstep collections.",
            "tryIt": "Eliminating surprise delivery surcharges collapses parcel refusal rates."
        },
        {
            "intro": "Customs documentation generators produce structured export manifests.",
            "say1": "Paperless trade integrations transmit commercial invoices electronically.",
            "example": "High value export consignments trigger automated statutory filings.",
            "tryIt": "Electronic export documentation accelerates international air clearance."
        },
        {
            "intro": "Trade compliance command towers screen international consignments.",
            "say1": "Real time watchlists intercept prohibited parties before dispatch.",
            "example": "Continuous audits defend low landed cost quote billing variances.",
            "tryIt": "Comprehensive trade reviews confer official trade compliance status."
        }
    ],
    53: [
        {
            "intro": "De minimis valuation rules evaluate national customs exemption ceilings.",
            "say1": "Low value consignments enter destination countries free of customs tariffs.",
            "example": "Centralized tax portals streamline low value tax remittance schedules.",
            "tryIt": "Configurable threshold matrices route international parcels compliantly."
        },
        {
            "intro": "Customs bonded warehouses defer import tariffs until domestic entry.",
            "say1": "Foreign trade zones permit raw component assembly and kitting inside.",
            "example": "Inverted tariff rules yield massive savings on finished goods entry.",
            "tryIt": "Consolidated weekly entry filings slash customs administrative overhead."
        },
        {
            "intro": "International line haul logistics evaluate postal versus air injection.",
            "say1": "Chartered air cargo flights pre clear customs manifests while airborne.",
            "example": "Airport gateway cross docks inject parcels directly into domestic hubs.",
            "tryIt": "Commercial direct injection achieves express global delivery speeds."
        },
        {
            "intro": "Dynamic global sourcing allocators analyze individual stock turnover rates.",
            "say1": "Fast moving merchandise forward deploys into regional fulfillment hubs.",
            "example": "Long tail specialty items fulfill via centralized direct air flights.",
            "tryIt": "Hybrid inventory placement models balance speed against holding expense."
        },
        {
            "intro": "Global logistics command towers monitor cross border fulfillment health.",
            "say1": "High de minimis utilization yields eliminate excessive customs duties.",
            "example": "Pre cleared air cargo manifests maintain rapid customs clearance velocity.",
            "tryIt": "Continuous logistics audits confer official global fulfillment status."
        }
    ],
    54: [
        {
            "intro": "Statutory withdrawal engines evaluate international return eligibility.",
            "say1": "Mandatory cooling off directives enforce unconditional return policies.",
            "example": "Unsealed hygiene items trigger statutory return policy exemptions.",
            "tryIt": "Automated return portals issue compliant labels and statutory notices."
        },
        {
            "intro": "Duty drawback calculators track original import entry declarations.",
            "say1": "Verified re exportations unlock statutory customs tariff refunds.",
            "example": "Cross border returns re claim paid value added tax assessments.",
            "tryIt": "Electronic drawback dossiers eliminate margin leaks on returned units."
        },
        {
            "intro": "Regional privacy validators enforce jurisdictional consent mandates.",
            "say1": "Transnational data pipelines require verified contractual protections.",
            "example": "Non essential tracking scripts halt pending explicit consumer opt in.",
            "tryIt": "Decoupled privacy gates route customer profiles into sovereign zones."
        },
        {
            "intro": "Internationalization formatters configure localized typographic styles.",
            "say1": "Bidirectional text wrappers protect complex scripts from layout shift.",
            "example": "Locale aware rules position currency symbols and numeric separators.",
            "tryIt": "Culturally native presentation layers boost global checkout confidence."
        },
        {
            "intro": "Governance command towers monitor cross border fulfillment metrics.",
            "say1": "Consent compliance audits shield platforms from regulatory penalties.",
            "example": "Automated customs duty drawback maximizes net enterprise capital recovery.",
            "tryIt": "Synthetic multi market audits confirm seamless global operations."
        }
    ],
    55: [
        {
            "intro": "Treasury pricing systems monitor foreign exchange market volatility.",
            "say1": "Institutional forward contracts lock in guaranteed conversion rates.",
            "example": "Localized psychological rounding preserves catalog price stability.",
            "tryIt": "Automated liquidity sweeping routines shield balance sheet margins."
        },
        {
            "intro": "Algorithmic classification maps products to destination customs tariffs.",
            "say1": "Penny perfect landed cost engines calculate destination value added tax.",
            "example": "Compounded tax bases prevent retroactive customs audit liabilities.",
            "tryIt": "Prepaid duty clearance delivers frictionless doorstep parcel arrivals."
        },
        {
            "intro": "Logistics routers evaluate national statutory de minimis thresholds.",
            "say1": "Chartered direct air flights inject low value parcels tariff free.",
            "example": "Bonded warehousing defers duty until domestic commercial entry.",
            "tryIt": "Consolidated weekly entries slash administrative customs expenses."
        },
        {
            "intro": "Automated return portals enforce statutory cooling off withdrawal rights.",
            "say1": "Electronic duty drawback dossiers recover previously paid customs fees.",
            "example": "Destination tax credits offset open value added tax balance sheets.",
            "tryIt": "Decoupled edge privacy gates guarantee sovereign data protection."
        },
        {
            "intro": "The executive capstone board evaluates total global commerce yield.",
            "say1": "Foreign exchange hedging and tariff avoidance preserve operating capital.",
            "example": "Automated duty drawback and tax credits deliver massive annual savings.",
            "tryIt": "The defense certifies chief global commerce architect accreditation."
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

for day_num in range(51, 56):
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

print("All 5 visual files generated and verified!")
