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
    46: [
        {
            "intro": "Corporate buyers start purchasing sessions from procurement tools.",
            "say1": "Mutual security handshakes validate inbound corporate identity tokens.",
            "example": "Ephemeral buyer sessions bind securely to tenant memory spaces.",
            "tryIt": "Authenticated redirect links launch custom corporate catalog portals."
        },
        {
            "intro": "Procurement systems initiate classical catalog sessions.",
            "say1": "Browsers redirect with hidden enterprise parameters and secrets.",
            "example": "Shopping cart contents serialize into procurement table formats.",
            "tryIt": "Form postbacks dispatch line item payloads directly to buyer systems."
        },
        {
            "intro": "Catalog engines inspect active procurement master agreements.",
            "say1": "Pricing precedence rules evaluate customer price contracts first.",
            "example": "Quantity break tiers dynamically discount large industrial orders.",
            "tryIt": "Fallback list prices apply when custom agreements are absent."
        },
        {
            "intro": "Selected catalog items assemble into structured enterprise orders.",
            "say1": "Commodity classification codes tag every industrial component.",
            "example": "Accounting cost centers and project codes bind to line items.",
            "tryIt": "Order XML envelopes transmit securely to buyer approval queues."
        },
        {
            "intro": "Integration towers monitor telemetry across procurement systems.",
            "say1": "Payload validation engines trap schema errors before cart dispatch.",
            "example": "Circuit breakers protect backend catalogs from timeout delays.",
            "tryIt": "Executive dashboards summarize order conversion and system uptime."
        }
    ],
    47: [
        {
            "intro": "Multinational corporations configure multi tier legal structures.",
            "say1": "Global master agreements cascade down through division nodes.",
            "example": "Localized manufacturing facilities inherit negotiated contract terms.",
            "tryIt": "Hierarchical trees partition departmental billing profiles."
        },
        {
            "intro": "Statutory rules mandate separation between requisitioners and approvers.",
            "say1": "Role permissions evaluate access rights against policy tables.",
            "example": "Self approval interceptors immediately block unauthorized releases.",
            "tryIt": "Immutable audit journals record every organizational decision."
        },
        {
            "intro": "Submitted requisitions enter dynamic financial routing pipelines.",
            "say1": "Small departmental orders release automatically without human delay.",
            "example": "Elevated transaction totals escalate to executive controllers.",
            "tryIt": "Electronic signatures seal approval trails for statutory review."
        },
        {
            "intro": "Corporate departments assign annual operational purchasing funds.",
            "say1": "Cart checkout queries available cost center reserves in real time.",
            "example": "Requisitions exceeding available funds trigger formal budget exceptions.",
            "tryIt": "Automated ledger holds safeguard corporate liquidity from overdrafts."
        },
        {
            "intro": "Central procurement command centers visualize corporate spend streams.",
            "say1": "Pending multi tier approvals aggregate across global operating teams.",
            "example": "Automated timeout alerts escalate stalled approvals to managers.",
            "tryIt": "Executive analytics reveal departmental purchasing patterns."
        }
    ],
    48: [
        {
            "intro": "Delivered purchase orders generate formal commercial tax invoices.",
            "say1": "Standard credit agreements establish deferred payment time horizons.",
            "example": "Early cash discount formulas calculate prompt settlement savings.",
            "tryIt": "Electronic invoice records synchronize directly with buyer accounting."
        },
        {
            "intro": "Underwriting engines assess corporate financial health and history.",
            "say1": "Approved credit facilities establish hard aggregate spending limits.",
            "example": "Outstanding unpaid invoices and unbilled orders sum to total exposure.",
            "tryIt": "Automated credit checks block shipment release when limits breach."
        },
        {
            "intro": "Accounts receivable ledgers categorize open invoices into aging tiers.",
            "say1": "Statutory credit loss standards mandate forward risk allowances.",
            "example": "Historical default loss matrices apply against delinquent balances.",
            "tryIt": "Treasury balance sheets adjust general ledger reserves for risk."
        },
        {
            "intro": "Overdue commercial invoices transition into formal dunning sequences.",
            "say1": "Courteous digital reminders notify accounts payable of due dates.",
            "example": "Formal warning statements dispatch as delinquency horizons lengthen.",
            "tryIt": "Automated credit hold locks prevent delinquent accounts from buying."
        },
        {
            "intro": "Executive treasury dashboards display trade credit portfolio health.",
            "say1": "Days sales outstanding metrics measure cash collection efficiency.",
            "example": "Collection workflows prioritize high value delinquent accounts.",
            "tryIt": "Real time cash projections empower corporate liquidity optimization."
        }
    ],
    49: [
        {
            "intro": "Inbound quote requests query negotiated customer contracts.",
            "say1": "Deterministic precedence hierarchy selects the most specific rule.",
            "example": "Account specific price lists take priority over general catalogs.",
            "tryIt": "Precomputed pricing indexes return resolved unit costs rapidly."
        },
        {
            "intro": "Bulk procurement orders evaluate defined quantity purchase tiers.",
            "say1": "Stepped pricing models apply volume rates across entire order lots.",
            "example": "Marginal bracket calculators discount incremental units progressively.",
            "tryIt": "Comparative margin calculators highlight profitability impacts."
        },
        {
            "intro": "Master vendor agreements establish retrospective volume targets.",
            "say1": "Cumulative corporate spend tracks continuously across fiscal periods.",
            "example": "Statutory revenue standards mandate quarterly rebate reserves.",
            "tryIt": "Year end settlement ledgers issue earned credit notes to buyers."
        },
        {
            "intro": "Field sales teams assemble customized product configuration proposals.",
            "say1": "Special discount requests evaluate against gross margin thresholds.",
            "example": "Proposals below profitability hurdles divert automatically to leaders.",
            "tryIt": "Cryptographically bound quote tokens lock approved pricing for buyers."
        },
        {
            "intro": "Executive pricing waterfalls track revenue from list to pocket price.",
            "say1": "On invoice discounts and freight allowances deduct from revenue.",
            "example": "Off invoice retrospective rebates expose hidden net margin leakage.",
            "tryIt": "Strategic pocket margin dashboards defend bottom line profitability."
        }
    ],
    50: [
        {
            "intro": "External enterprise procurement systems start inbound PunchOut setups.",
            "say1": "Mutual security handshakes validate shared secrets and cookies.",
            "example": "Customer specific price contracts resolve volume breaks in real time.",
            "tryIt": "Enriched order messages return carts directly to corporate queues."
        },
        {
            "intro": "Corporate organizational trees route requisitions through cost centers.",
            "say1": "Statutory separation of duties rules intercept potential self approvals.",
            "example": "Multi tier authority matrices escalate large orders to senior leaders.",
            "tryIt": "Cryptographic approval journals establish immutable audit trails."
        },
        {
            "intro": "Corporate revolving credit facilities evaluate live aggregate exposure.",
            "say1": "Automated credit limit checks prevent overdrafts on open trade terms.",
            "example": "Prompt settlement terms calculate cash savings for early invoice payment.",
            "tryIt": "Delinquent invoice state machines escalate collections to credit hold."
        },
        {
            "intro": "Complex quotation proposals submit to automated margin hurdle gates.",
            "say1": "Pricing requests falling below target floors divert for executive signoff.",
            "example": "Retrospective volume rebate engines compute cumulative spend tiers.",
            "tryIt": "Quarterly variable consideration reserves accrue under accounting rules."
        },
        {
            "intro": "Corporate boardrooms evaluate synthesized enterprise commerce systems.",
            "say1": "Multi disciplinary architecture tiers earn unanimous perfect scores.",
            "example": "Audited financial telemetry documents millions in annual enterprise return.",
            "tryIt": "Boardroom authorities formally confer sovereign architect credentials."
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

for day_num in range(46, 51):
    data_file = os.path.join(commerce_dir, "scripts", "branch_b", f"day{day_num}_ecom_data.json")
    with open(data_file, "r", encoding="utf-8") as f:
        day_data = json.load(f)

    entries = []
    day_templates = stage_templates[day_num]

    for p_idx, part in enumerate(day_data["parts"]):
        title = part["title"]
        say_text = "".join(part["say"]) if isinstance(part["say"], list) else part["say"]
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
