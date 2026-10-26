"""
Generate Gate v2 Visual JSON files for bcom_tax Days 51 to 55.
Invariants:
- schemaVersion: "2.0.0"
- prefix: "bcom_tax"
- day: 51..55
- entries: 5 entries (partIndex 0..4)
- 4 steps per entry
- caption length <= 75 characters
- caption ends with '.'
- zero digits in captions (!re.search(r'\\d', caption))
"""

import json
import os
import re

VISUALS_DIR = os.path.join(
    os.getcwd(), "src", "lib", "data", "lessonVisuals", "bcom_tax"
)
os.makedirs(VISUALS_DIR, exist_ok=True)

visuals_data = {
    51: {
        "prefix": "bcom_tax",
        "day": 51,
        "entries": [
            {
                "partIndex": 0,
                "title": "First Appeal Gateway",
                "steps": [
                    {"label": "Adverse Order", "caption": "Assessing officer transmits adverse order and statutory demand notice."},
                    {"label": "Form Thirty Five", "caption": "Corporate appellant drafts electronic appeal memo with statement of facts."},
                    {"label": "Portal Upload", "caption": "Appellant submits electronic appeal within thirty days of service."},
                    {"label": "Registry Intake", "caption": "National Faceless Appeal Centre acknowledges electronic lodgment."}
                ]
            },
            {
                "partIndex": 1,
                "title": "Tax Payment Protocols",
                "steps": [
                    {"label": "Admitted Tax Check", "caption": "Appellant verifies full payment of admitted tax due on returned income."},
                    {"label": "Stay Application", "caption": "Appellant petitions appellate authority for stay of disputed balance."},
                    {"label": "Discretionary Waiver", "caption": "Appellate authority examines substantial hardship for partial deposit."},
                    {"label": "Interim Injunction", "caption": "Authority grants protection against coercive bank attachment recovery."}
                ]
            },
            {
                "partIndex": 2,
                "title": "Appellate Adjudication Powers",
                "steps": [
                    {"label": "Record Review", "caption": "Appellate authority examines assessment records and grounds of appeal."},
                    {"label": "Confirmation or Relief", "caption": "Authority decides to confirm or delete disputed assessment additions."},
                    {"label": "Enhancement Notice", "caption": "Authority issues mandatory show cause notice prior to enhancement."},
                    {"label": "Final Annulment", "caption": "Authority strikes down void assessment without remanding to officer."}
                ]
            },
            {
                "partIndex": 3,
                "title": "Faceless Appellate Workflow",
                "steps": [
                    {"label": "Automated Assignment", "caption": "System dynamically routes appeal to faceless appellate unit."},
                    {"label": "Written Submissions", "caption": "Appellant submits detailed legal rebuttal and statutory authorities."},
                    {"label": "Virtual Hearing", "caption": "Appellant presents oral arguments through secure video conference."},
                    {"label": "Draft Order Review", "caption": "Review unit approves draft before digital signing and portal delivery."}
                ]
            },
            {
                "partIndex": 4,
                "title": "Appellate Compliance Engine",
                "steps": [
                    {"label": "Deadline Tracking", "caption": "System monitors limitation period for electronic appeal lodgment."},
                    {"label": "Hardship Assessment", "caption": "Engine models corporate balance sheet ratios for deposit waiver."},
                    {"label": "Evidence Categorization", "caption": "Platform indexes supporting contracts and technical affidavits."},
                    {"label": "Executive Dashboard", "caption": "Appellate portfolio dashboard visualizes enterprise dispute status."}
                ]
            }
        ]
    },
    52: {
        "prefix": "bcom_tax",
        "day": 52,
        "entries": [
            {
                "partIndex": 0,
                "title": "Draft Order Gateway",
                "steps": [
                    {"label": "Eligible Entity Check", "caption": "System validates foreign corporation status or transfer pricing scope."},
                    {"label": "Draft Formulation", "caption": "Assessing officer prepares proposed variations with tax schedules."},
                    {"label": "Mandatory Forwarding", "caption": "Officer transmits statutory draft order without demand notice."},
                    {"label": "Statutory Protection", "caption": "Omission of draft order renders entire assessment void ab initio."}
                ]
            },
            {
                "partIndex": 1,
                "title": "Strategic Path Selection",
                "steps": [
                    {"label": "Draft Order Receipt", "caption": "Corporate assessee receives draft assessment order via tax portal."},
                    {"label": "Thirty Day Window", "caption": "Assessee reviews proposed adjustments within thirty calendar days."},
                    {"label": "Form Thirty Five A", "caption": "Appellant prepares electronic objections with economic paper book."},
                    {"label": "Parallel Lodgment", "caption": "Objections are lodged simultaneously with panel secretariat and officer."}
                ]
            },
            {
                "partIndex": 2,
                "title": "Collegiate Panel Review",
                "steps": [
                    {"label": "Collegiate Intake", "caption": "Three senior commissioners assemble to evaluate corporate objections."},
                    {"label": "Oral Hearing", "caption": "Taxpayer counsel argues economic comparability before collegiate bench."},
                    {"label": "Enhancement Safeguard", "caption": "Panel gives reasonable opportunity before enhancing any variation."},
                    {"label": "Statutory Limitation", "caption": "Panel must issue binding directions within nine months of draft month."}
                ]
            },
            {
                "partIndex": 3,
                "title": "Directions Implementation",
                "steps": [
                    {"label": "Directions Receipt", "caption": "Assessing officer receives binding directions from panel secretariat."},
                    {"label": "One Month Deadline", "caption": "Officer must complete assessment within one month from receipt month."},
                    {"label": "Final Assessment", "caption": "Officer passes final order in strict conformity with directions."},
                    {"label": "Tribunal Gateway", "caption": "Taxpayer appeals directly to appellate tribunal without first appeal."}
                ]
            },
            {
                "partIndex": 4,
                "title": "Dispute Resolution Engine",
                "steps": [
                    {"label": "Limitation Watchdog", "caption": "Engine calculates precise deadline for collegiate panel directions."},
                    {"label": "Draft Order Audit", "caption": "System flags illegal premature assessment orders with demand notices."},
                    {"label": "Economic Verification", "caption": "Engine compares transfer pricing adjustments against arm length margins."},
                    {"label": "Tribunal Notice Alert", "caption": "Platform schedules direct tribunal appeal upon final order delivery."}
                ]
            }
        ]
    },
    53: {
        "prefix": "bcom_tax",
        "day": 53,
        "entries": [
            {
                "partIndex": 0,
                "title": "Tribunal Hierarchy",
                "steps": [
                    {"label": "Judicial Composition", "caption": "Division bench combines judicial member and accountant member."},
                    {"label": "Fact Finding Finality", "caption": "Findings of fact recorded by tribunal are conclusive and binding."},
                    {"label": "Special Bench Power", "caption": "President constitutes larger bench to resolve coordinate conflicts."},
                    {"label": "Independent Forum", "caption": "Tribunal functions under ministry of law guaranteeing judicial neutrality."}
                ]
            },
            {
                "partIndex": 1,
                "title": "Tribunal Appeal Mechanics",
                "steps": [
                    {"label": "Form Thirty Six", "caption": "Appellant files electronic memorandum of appeal within sixty days."},
                    {"label": "Graduated Filing Fee", "caption": "Fee scales with assessed income subject to statutory maximum cap."},
                    {"label": "Grounds Formulation", "caption": "Counsel drafts distinct grounds challenging specific legal additions."},
                    {"label": "Cross Objections", "caption": "Respondent files cross objections in form thirty six A within thirty days."}
                ]
            },
            {
                "partIndex": 2,
                "title": "Stay of Demand Regime",
                "steps": [
                    {"label": "Disputed Liability", "caption": "Assessee faces coercive recovery under statutory demand notice."},
                    {"label": "Twenty Percent Deposit", "caption": "Assessee deposits statutory twenty percent into central tax treasury."},
                    {"label": "Stay Application", "caption": "Counsel presents prima facie case and balance of convenience."},
                    {"label": "Constitutional Shield", "caption": "Stay continues beyond statutory period if delay is not from assessee."}
                ]
            },
            {
                "partIndex": 3,
                "title": "Rectification Architecture",
                "steps": [
                    {"label": "Patent Mistake Discovery", "caption": "Counsel identifies obvious error apparent from the judicial record."},
                    {"label": "Six Month Limitation", "caption": "Application must be submitted within six months from order month end."},
                    {"label": "Bench Listing", "caption": "Specific division bench that passed order considers rectification memo."},
                    {"label": "Operative Amendment", "caption": "Tribunal corrects computational error or recalls order for rehearing."}
                ]
            },
            {
                "partIndex": 4,
                "title": "Tribunal Portfolio Engine",
                "steps": [
                    {"label": "Limitation Tracking", "caption": "System alerts counsel to sixty day deadline from order communication."},
                    {"label": "Fee Calculation", "caption": "Engine computes graduated tribunal fee based on assessed corporate income."},
                    {"label": "Stay Monitor", "caption": "Module tracks elapsed stay duration and flags constitutional extension."},
                    {"label": "Precedent Indexing", "caption": "Knowledge base organizes jurisdictional high court binding authorities."}
                ]
            }
        ]
    },
    54: {
        "prefix": "bcom_tax",
        "day": 54,
        "entries": [
            {
                "partIndex": 0,
                "title": "High Court Appeal Gateway",
                "steps": [
                    {"label": "Tribunal Order Service", "caption": "Party receives final appellate tribunal order initiating timeline."},
                    {"label": "Substantial Law Filter", "caption": "Court admits appeal strictly on substantial questions of law."},
                    {"label": "Question Formulation", "caption": "High court formulates specific question of law for formal hearing."},
                    {"label": "Factual Immunity", "caption": "Court declines to reweigh pure findings of fact absent perversity."}
                ]
            },
            {
                "partIndex": 1,
                "title": "Litigation Policy Limits",
                "steps": [
                    {"label": "Tax Effect Analysis", "caption": "Revenue calculates disputed tax effect excluding interest and penalty."},
                    {"label": "Monetary Filter", "caption": "Appeal is barred if tax effect is below statutory board limits."},
                    {"label": "Carve Out Verification", "caption": "Authorities check for constitutional challenges or audit objections."},
                    {"label": "Summary Dismissal", "caption": "Court dismisses low tax effect appeals in limine preserving capital."}
                ]
            },
            {
                "partIndex": 2,
                "title": "Apex Court Jurisdiction",
                "steps": [
                    {"label": "Certificate of Fitness", "caption": "High court considers whether case is fit for supreme court appeal."},
                    {"label": "Special Leave Petition", "caption": "Appellant petitions apex court within ninety days under constitution."},
                    {"label": "Preliminary Hearing", "caption": "Court evaluates whether special leave should be granted for hearing."},
                    {"label": "Law of the Land", "caption": "Final apex judgment merges lower order and binds all national courts."}
                ]
            },
            {
                "partIndex": 3,
                "title": "Constitutional Writ Shield",
                "steps": [
                    {"label": "Jurisdictional Excess", "caption": "Tax authority issues patently illegal order without statutory power."},
                    {"label": "Natural Justice Breach", "caption": "Officer fails to grant mandatory electronic personal video hearing."},
                    {"label": "Writ of Certiorari", "caption": "Taxpayer petitions high court to quash ultra vires assessment order."},
                    {"label": "Immediate Injunction", "caption": "High court stays recovery proceedings restoring corporate rights."}
                ]
            },
            {
                "partIndex": 4,
                "title": "Judicial Litigation Engine",
                "steps": [
                    {"label": "High Court Deadline", "caption": "Engine tracks one hundred twenty day limitation for statutory appeal."},
                    {"label": "Monetary Limit Audit", "caption": "System verifies whether departmental appeal complies with board policy."},
                    {"label": "Writ Prerequisite Check", "caption": "Module vets natural justice violations for constitutional filings."},
                    {"label": "Precedent Alignment", "caption": "Platform links corporate arguments with landmark apex court doctrines."}
                ]
            }
        ]
    },
    55: {
        "prefix": "bcom_tax",
        "day": 55,
        "entries": [
            {
                "partIndex": 0,
                "title": "Enterprise Case Strategy",
                "steps": [
                    {"label": "Draft Order Audit", "caption": "Enterprise counsel analyzes proposed transfer pricing additions."},
                    {"label": "Strategic Election", "caption": "Counsel selects collegiate panel route over traditional first appeal."},
                    {"label": "Limitation Control", "caption": "System enforces thirty day objection deadline from draft order receipt."},
                    {"label": "Paper Book Assembly", "caption": "Team gathers technical logs and economic comparability studies."}
                ]
            },
            {
                "partIndex": 1,
                "title": "Collegiate Panel Defense",
                "steps": [
                    {"label": "Collegiate Hearing", "caption": "Counsel argues economic methodology before three commissioners."},
                    {"label": "Substantial Relief", "caption": "Panel deletes majority of transfer pricing addition under precedent."},
                    {"label": "Binding Directions", "caption": "Panel issues directions within nine months of draft forwarding month."},
                    {"label": "Final Assessment Order", "caption": "Officer passes final order in one month without altering directions."}
                ]
            },
            {
                "partIndex": 2,
                "title": "Tribunal Appeal and Stay",
                "steps": [
                    {"label": "Direct Tribunal Filing", "caption": "Enterprise appeals sustained adjustments directly to tribunal bench."},
                    {"label": "Mandatory Deposit", "caption": "Treasury deposits statutory twenty percent into central tax treasury."},
                    {"label": "Stay Injunction", "caption": "Tribunal grants unconditional stay on remaining eighty percent balance."},
                    {"label": "Constitutional Shield", "caption": "Stay remains effective beyond three hundred sixty five days."}
                ]
            },
            {
                "partIndex": 3,
                "title": "Judicial Victory and Refund",
                "steps": [
                    {"label": "Full Tribunal Relief", "caption": "Tribunal deletes all remaining adjustments applying apex precedents."},
                    {"label": "High Court Challenge", "caption": "Revenue files appeal challenging factual transfer pricing findings."},
                    {"label": "Summary Dismissal", "caption": "High court dismisses appeal in limine for lack of substantial law."},
                    {"label": "Treasury Refund", "caption": "Officer refunds stay deposit with statutory interest into bank account."}
                ]
            },
            {
                "partIndex": 4,
                "title": "Master Defense Simulator",
                "steps": [
                    {"label": "Multi Tier Simulation", "caption": "Simulator executes complete lifecycle of corporate appellate defense."},
                    {"label": "Limitation Clock Audit", "caption": "Engine validates compliance with all statutory procedural windows."},
                    {"label": "Financial Exposure Model", "caption": "Platform calculates tax shield and interest recovery for enterprise."},
                    {"label": "Master Accreditation", "caption": "System grants master certification upon triumphant corporate defense."}
                ]
            }
        ]
    }
}

all_ok = True

for day, day_data in visuals_data.items():
    entries_list = []
    for entry in day_data["entries"]:
        spec_entry = {
            "partIndex": entry["partIndex"],
            "spec": {
                "title": entry["title"],
                "steps": entry["steps"]
            }
        }
        entries_list.append(spec_entry)
        
        # Verify step invariants
        if len(entry["steps"]) != 4:
            print(f"ERROR: Day {day} Part {entry['partIndex']} has {len(entry['steps'])} steps (expected 4)")
            all_ok = False
        for s_idx, step in enumerate(entry["steps"]):
            cap = step["caption"]
            if len(cap) > 75:
                print(f"ERROR: Day {day} Part {entry['partIndex']} Step {s_idx+1} caption > 75 chars ({len(cap)}): '{cap}'")
                all_ok = False
            if not cap.endswith("."):
                print(f"ERROR: Day {day} Part {entry['partIndex']} Step {s_idx+1} caption does not end with '.': '{cap}'")
                all_ok = False
            if re.search(r"\d", cap):
                print(f"ERROR: Day {day} Part {entry['partIndex']} Step {s_idx+1} caption contains digits: '{cap}'")
                all_ok = False

    output_obj = {
        "schemaVersion": "2.0.0",
        "prefix": day_data["prefix"],
        "day": day_data["day"],
        "entries": entries_list
    }
    
    file_path = os.path.join(VISUALS_DIR, f"day-{day}.json")
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(output_obj, f, indent=2)
    print(f"Successfully generated {file_path}")

if all_ok:
    print("\n>>> ALL VISUAL ENVELOPES FOR DAYS 51-55 PASS 100% OF INVARIANTS! <<<")
else:
    print("\n>>> ERRORS FOUND IN VISUAL ENVELOPES! <<<")
