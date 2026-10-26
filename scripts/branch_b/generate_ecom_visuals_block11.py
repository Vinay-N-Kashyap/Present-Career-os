# -*- coding: utf-8 -*-
"""
Generate Gate v2 visual envelopes for Course 07 Block 11 (Days 51-55 & Milestone 11 Capstone).
Schema: schemaVersion: 1, prefix: 'bcom_ecom', day: N, entries: 5
Captions: zero numeric digits (!/\\d/), period-terminated, length <= 75.
"""
import json
import hashlib
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
scripts_dir = os.path.join(commerce_dir, "scripts", "branch_b")
visuals_dir = os.path.join(commerce_dir, "src", "lib", "data", "lessonVisuals", "bcom_ecom")
os.makedirs(visuals_dir, exist_ok=True)

caps_51_55 = {
    51: [
        ["Regional payment routers evaluate international market share metrics.",
         "Dominant local clearing methods are ranked by regional penetration.",
         "Account to account rails eliminate card scheme cross border fees.",
         "Configurable catalogs prioritize preferred payment options per country."],
        ["Multi currency engines ingest base catalog prices in domestic currency.",
         "Dynamic volatility buffers absorb foreign exchange rate fluctuations.",
         "Psychological rounding rules produce clean localized retail price points.",
         "Edge workers inject converted currencies while preserving cache rates."],
        ["Corporate treasury managers initiate rolling forward hedging contracts.",
         "Anticipated foreign sales volumes are pre sold at guaranteed rates.",
         "Hedging gains protect operating profit when foreign currencies drop.",
         "Automated algorithmic sweeps repatriate surplus cash into base balances."],
        ["Guaranteed quote lock sessions freeze exchange rates during checkout.",
         "Locked quotes prevent price slippage between browsing and payment.",
         "Localized checkout forms capture mandatory regional tax identifiers.",
         "Quote validation prevents processing when lock window duration lapses."],
        ["Global checkout command towers monitor international payment conversion.",
         "Real time telemetry flags routing anomalies and regional settlement gaps.",
         "Consolidated treasury views display currency balances across world banks.",
         "Executive reports quantify currency volatility savings and gross margins."]
    ],
    52: [
        ["Classification engines parse catalog product descriptions and attributes.",
         "Taxonomy trees map commercial commodities to standard tariff codes.",
         "Regulatory updates synchronize international customs classification rules.",
         "Audited tariff code bindings guarantee accurate baseline duty schedules."],
        ["Landed cost engines evaluate total transport and import obligations.",
         "Delivered duty paid terms collect all taxes directly within checkout.",
         "Pre paid duties eliminate surprise delivery fees at customer doorsteps.",
         "Clearance brokers receive advance tax guarantees for immediate release."],
        ["Landed cost algorithms aggregate merchandise cost freight and insurance.",
         "Ad valorem duty rates apply directly against total shipping valuations.",
         "Import value added taxes calculate on duty inclusive transaction totals.",
         "Itemized tax breakdowns provide transparent billing to global shoppers."],
        ["Fulfillment gateways compile advance electronic customs declarations.",
         "Secure automated broker interfaces transmit pre arrival manifest files.",
         "Air cargo manifests clear customs while shipments are in transit.",
         "Automated clearance confirmations release packages for courier delivery."],
        ["Trade compliance towers screen international recipients against watchlists.",
         "Denied party algorithms intercept orders bound for sanctioned entities.",
         "Real time customs audits verify export documentation and tariff filings.",
         "Executive dashboards display customs clearance speeds and compliance rates."]
    ],
    53: [
        ["Cross border logistics routers inspect declared retail package values.",
         "Low value consignments qualify for statutory informal entry treatment.",
         "Informal entry eliminates duty payments and speeds border clearance.",
         "Expedited air cargo manifests deliver packages directly to regional hubs."],
        ["European checkout engines collect destination value added taxes upfront.",
         "Consolidated monthly electronic returns replace per parcel filings.",
         "Valid identification numbers bypass destination courier handling fees.",
         "Pre cleared parcels transfer directly to local postal injection routes."],
        ["Logistics coordinators assemble parcels into consolidated air pallets.",
         "Commercial line haul flights bypass intermediate postal transit hubs.",
         "Domestic carrier injection hubs receive pre sorted international freight.",
         "Direct flight routing cuts intercontinental transit times significantly."],
        ["Bonded warehouse facilities store international merchandise duty deferred.",
         "Customs duties apply only when products enter domestic consumption.",
         "Re exported inventory avoids national import duty expenses entirely.",
         "Lot tracking ledgers maintain strict inventory chain of custody."],
        ["Logistics command towers track intercontinental freight line hauls.",
         "Airport dwell time analytics highlight customs inspection bottlenecks.",
         "Carrier performance scorecards evaluate delivery reliability and cost.",
         "Executive supply chain views optimize global freight lane allocation."]
    ],
    54: [
        ["European consumer protection directives establish cooling off windows.",
         "Return authorization engines validate mandatory withdrawal timeframes.",
         "Statutory exemptions protect unsealed hygiene items and custom products.",
         "Automated return portals generate official withdrawal confirmation forms."],
        ["Reverse logistics networks route returns to regional inspection hubs.",
         "Re exported international merchandise qualifies for customs drawback.",
         "Government filings reclaim up to ninety nine percent of paid duties.",
         "Reconciled export records recover valuable corporate working capital."],
        ["Privacy gateways evaluate consumer consent across world jurisdictions.",
         "Standard contractual clauses safeguard cross border personal data flows.",
         "Granular consent managers record customer tracking and marketing choices.",
         "Cryptographic audit ledgers demonstrate full statutory compliance."],
        ["Storefront rendering engines adapt currency symbols and decimal formats.",
         "Bidirectional isolation tags protect right to left typographical flow.",
         "Mirrored navigation menus deliver authentic local customer experiences.",
         "Localized address components format forms for destination countries."],
        ["Governance command towers monitor international regulatory compliance.",
         "Automated audits verify privacy consent and consumer right disclosures.",
         "Duty drawback ledgers track recovered customs tax capital over time.",
         "Customer satisfaction analytics evaluate localized checkout performance."]
    ],
    55: [
        ["Storefront currency engines calculate localized international prices.",
         "Volatility buffers protect edge transactions from short term shifts.",
         "Treasury forward contracts lock guaranteed exchange rates for revenue.",
         "Locked checkout quotes protect shoppers from foreign exchange slippage."],
        ["Customs engines classify product catalog items under tariff schedules.",
         "Landed cost equations combine transport tariffs and import value taxes.",
         "Guaranteed delivery duty paid locks prevent surprise courier fees.",
         "Clearance broker integrations speed cross border customs inspections."],
        ["Customs routing engines evaluate consignments against de minimis rules.",
         "Sub threshold shipments clear duty free through informal air channels.",
         "European import one stop shop rules streamline destination tax filing.",
         "Bonded warehouse networks manage duty deferred inventory strategic stock."],
        ["Return engines enforce statutory cooling off rights for global buyers.",
         "Re exported international goods qualify for customs duty drawback claims.",
         "Government drawback forms reclaim paid import duties and tax capital.",
         "Localized refund credits issue rapidly across world currency accounts."],
        ["Executive boardrooms evaluate comprehensive international trade systems.",
         "Synthesized architecture pillars earn unanimous perfect audit marks.",
         "Audited enterprise telemetry documents millions in annual return value.",
         "Boardroom authorities formally confer sovereign global credentials."]
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
    data_file = os.path.join(scripts_dir, f"day{day_num}_ecom_data.json")
    with open(data_file, "r", encoding="utf-8") as f:
        day_data = json.load(f)

    entries = []
    day_templates = caps_51_55[day_num]

    for p_idx, part in enumerate(day_data["parts"]):
        title = part["title"]
        say_text = "".join(part["say"]) if isinstance(part["say"], list) else part["say"]
        code = part.get("code", "")
        raw_hash_input = title + say_text + code
        code_hash = hashlib.sha256(raw_hash_input.encode("utf-8")).hexdigest()

        captions = day_templates[p_idx]
        
        # Verify caption invariants
        for cap in captions:
            assert not re.search(r"\d", cap), f"Day {day_num} Part {p_idx+1} caption contains digits: {cap}"
            assert cap.endswith("."), f"Day {day_num} Part {p_idx+1} caption missing period: {cap}"
            assert len(cap) <= 75, f"Day {day_num} Part {p_idx+1} caption > 75 chars: {cap}"

        steps = [
            {"at": "intro", "caption": captions[0], "activeStageId": "s1", "stages": make_stages()},
            {"at": "say1", "caption": captions[1], "activeStageId": "s2", "stages": make_stages()},
            {"at": "example", "caption": captions[2], "activeStageId": "s3", "stages": make_stages()},
            {"at": "tryIt", "caption": captions[3], "activeStageId": "s4", "stages": make_stages()}
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
