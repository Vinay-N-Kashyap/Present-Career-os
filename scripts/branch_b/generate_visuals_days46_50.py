"""
generate_visuals_days46_50.py
Creates Gate v2 visual JSONs for bcom_tax Days 46 to 50:
- schemaVersion: "2.0.0"
- prefix: "bcom_tax"
- day: {46..50}
- entries: 5 entries (partIndex: 0..4)
- 4 steps per entry
- caption length <= 75 chars, ends with '.', zero digits (!/\d/)
"""

import json
import re
import os

visuals_data = {
    46: {
        "title": "Assessment Architecture: Summary Processing under Section 143(1), Faceless Scrutiny & Best Judgment Assessment",
        "entries": [
            {
                "partIndex": 0,
                "title": "Summary Processing Mechanics",
                "steps": [
                    {"label": "Electronic Return", "caption": "Centralized Processing Centre ingests electronic return records."},
                    {"label": "Algorithmic Check", "caption": "System executes automated verification against internal schedules."},
                    {"label": "Prima Facie Notice", "caption": "Electronic intimation notifies assessee of proposed variance."},
                    {"label": "Final Intimation", "caption": "Processing concludes with automated refund or statutory demand."}
                ]
            },
            {
                "partIndex": 1,
                "title": "Faceless Scrutiny Framework",
                "steps": [
                    {"label": "Automated Allocation", "caption": "Artificial intelligence dynamically assigns case to assessment unit."},
                    {"label": "Verification Support", "caption": "Verification unit executes digital cross checks with vendors."},
                    {"label": "Draft Variation", "caption": "Assessment unit transmits draft variation notice to assessee."},
                    {"label": "Video Conference", "caption": "Assessee presents technical arguments via electronic video hearing."}
                ]
            },
            {
                "partIndex": 2,
                "title": "Best Judgment Adjudication",
                "steps": [
                    {"label": "Statutory Default", "caption": "Assessee fails to comply with statutory notices or summons."},
                    {"label": "Objective Appraisal", "caption": "Officer gathers external material without vindictive caprice."},
                    {"label": "Honest Estimate", "caption": "Total income is assessed using balanced commercial benchmarks."},
                    {"label": "Protective Order", "caption": "Parallel assessment protects revenue pending ownership clarity."}
                ]
            },
            {
                "partIndex": 3,
                "title": "Special Audit Architecture",
                "steps": [
                    {"label": "Account Complexity", "caption": "Specialized audit is directed due to intricate corporate accounts."},
                    {"label": "Prior Sanction", "caption": "Commissioner grants written approval following natural justice."},
                    {"label": "Forensic Inspection", "caption": "Nominated accountant evaluates specialized ledger inventory."},
                    {"label": "Limitation Exclusion", "caption": "Statutory audit duration is excluded from assessment limitation."}
                ]
            },
            {
                "partIndex": 4,
                "title": "Assessment Simulator Workflow",
                "steps": [
                    {"label": "Return Ingestion", "caption": "Python engine parses electronic tax return records."},
                    {"label": "Adjustment Rules", "caption": "Algorithmic rules verify audit disallowances and credit mismatches."},
                    {"label": "Limitation Check", "caption": "System verifies statutory nine month deadline from fiscal year end."},
                    {"label": "Demand Generation", "caption": "Engine computes final tax liability with interest additions."}
                ]
            }
        ]
    },
    47: {
        "title": "Income Escaping Assessment: Reassessment Architecture under Section 147, Section 148, Section 148A Inquiry & Section 149 Limitations",
        "entries": [
            {
                "partIndex": 0,
                "title": "Reassessment Inception Flow",
                "steps": [
                    {"label": "Information Flag", "caption": "Insight portal flags high risk transaction across risk strategy."},
                    {"label": "Escapement Review", "caption": "Officer reviews flagged data suggesting taxable income escaped."},
                    {"label": "Prior Approval", "caption": "Specified authority grants preliminary sanction for inquiry."},
                    {"label": "Jurisdiction Gate", "caption": "Proceedings advance to statutory preliminary inquiry stage."}
                ]
            },
            {
                "partIndex": 1,
                "title": "Section 148A Inquiry Stages",
                "steps": [
                    {"label": "Preliminary Inquiry", "caption": "Officer gathers external data with prior statutory sanction."},
                    {"label": "Show Cause Notice", "caption": "Assessee receives show cause notice with supporting evidence."},
                    {"label": "Assessee Response", "caption": "Assessee files detailed rebuttal supported by commercial records."},
                    {"label": "Speaking Order", "caption": "Officer passes reasoned order on fitness of reassessment."}
                ]
            },
            {
                "partIndex": 2,
                "title": "Limitation Window Analysis",
                "steps": [
                    {"label": "Standard Window", "caption": "Three year window permits reassessment for any escaped sum."},
                    {"label": "Extended Window", "caption": "Ten year window requires fifty lakh rupee asset threshold."},
                    {"label": "Asset Representation", "caption": "Escaped income must be represented by asset or book entry."},
                    {"label": "Statutory Sunset", "caption": "Time barred past years cannot be revived under amended rules."}
                ]
            },
            {
                "partIndex": 3,
                "title": "Sanction & Limitation Protocol",
                "steps": [
                    {"label": "Authority Rank", "caption": "Higher rank approval is mandatory for notices beyond three years."},
                    {"label": "Independent Mind", "caption": "Sanctioning authority records independent appraisal of evidence."},
                    {"label": "Writ Remedy", "caption": "Defective sanction is challenged before constitutional court."},
                    {"label": "Order Deadline", "caption": "Reassessment order must be completed within twelve months."}
                ]
            },
            {
                "partIndex": 4,
                "title": "Reassessment Defense Simulator",
                "steps": [
                    {"label": "Notice Parsing", "caption": "Engine ingests electronic notice and validates digital signature."},
                    {"label": "Limitation Audit", "caption": "Algorithm computes elapsed duration from assessment year end."},
                    {"label": "Threshold Test", "caption": "System checks whether alleged escapement meets statutory limit."},
                    {"label": "Remedy Strategy", "caption": "Platform recommends writ petition or substantive defense response."}
                ]
            }
        ]
    },
    48: {
        "title": "Search, Seizure & Survey Operations: Section 132 Search Powers, Section 133A Surveys, Presumptions & Undisclosed Foreign Income",
        "entries": [
            {
                "partIndex": 0,
                "title": "Search Warrant Execution",
                "steps": [
                    {"label": "Authorization Warrant", "caption": "Director General issues search warrant upon recorded reasons."},
                    {"label": "Premises Entry", "caption": "Search team enters residential and commercial properties."},
                    {"label": "Inventory Taking", "caption": "Officers catalog commercial stock without physical seizure."},
                    {"label": "Asset Restraint", "caption": "Restraint orders preserve bulky assets for limited period."}
                ]
            },
            {
                "partIndex": 1,
                "title": "Survey Distinction & Doctrine",
                "steps": [
                    {"label": "Business Hours", "caption": "Survey entry is restricted exclusively to business operating hours."},
                    {"label": "Book Impounding", "caption": "Books may be impounded for fifteen days without higher approval."},
                    {"label": "Statement Recording", "caption": "Officers record statements without administering formal oath."},
                    {"label": "Retraction Rights", "caption": "Uncorroborated confessions are deleted per Supreme Court ruling."}
                ]
            },
            {
                "partIndex": 2,
                "title": "Evidentiary Presumptions Flow",
                "steps": [
                    {"label": "Possession Presumption", "caption": "Books and valuable assets found are presumed to belong to owner."},
                    {"label": "Truth of Contents", "caption": "Documentary contents and handwriting are presumed genuine."},
                    {"label": "Cash Credit Test", "caption": "Assessee substantiates identity, creditworthiness, and genuineness."},
                    {"label": "Source of Source", "caption": "Closely held entities prove ultimate source of investor capital."}
                ]
            },
            {
                "partIndex": 3,
                "title": "Punitive Taxation Mechanics",
                "steps": [
                    {"label": "Base Tax Levy", "caption": "Unexplained income attracts sixty percent statutory base tax."},
                    {"label": "Surcharge Addition", "caption": "Mandatory twenty five percent surcharge elevates tax burden."},
                    {"label": "Loss Bar Rule", "caption": "Statute strictly bars set off of business or capital losses."},
                    {"label": "Foreign Treble Penalty", "caption": "Undisclosed foreign assets face ninety percent treble penalty."}
                ]
            },
            {
                "partIndex": 4,
                "title": "Enforcement Simulator Engine",
                "steps": [
                    {"label": "Item Cataloging", "caption": "Engine classifies discovered assets into inventory and cash."},
                    {"label": "Seizure Legality", "caption": "System flags illegal seizures of commercial stock in trade."},
                    {"label": "Evidentiary Audit", "caption": "Algorithm filters out uncorroborated survey admissions."},
                    {"label": "Confiscation Summary", "caption": "Engine calculates effective seventy eight percent tax liability."}
                ]
            }
        ]
    },
    49: {
        "title": "Penalties, Prosecutions & Statutory Immunity: Section 270A Under-Reporting vs Misreporting, Section 270AA Immunity & Section 271AAD Penalties",
        "entries": [
            {
                "partIndex": 0,
                "title": "Penalty Taxonomy Structure",
                "steps": [
                    {"label": "Assessed Variance", "caption": "Assessment order determines total additions to returned income."},
                    {"label": "Under Reporting", "caption": "Honest errors attract fifty percent penalty on computed tax."},
                    {"label": "Misreporting Escalation", "caption": "Fraudulent suppression attracts two hundred percent penalty."},
                    {"label": "Notice Specification", "caption": "Show cause notice must state exact statutory limb invoked."}
                ]
            },
            {
                "partIndex": 1,
                "title": "Misreporting Gateways & Carve-outs",
                "steps": [
                    {"label": "Six Gateways", "caption": "Misreporting is strictly confined to six statutory categories."},
                    {"label": "Bona Fide Explanation", "caption": "Substantiated explanations are fully carved out from penalty."},
                    {"label": "Estimate Protection", "caption": "Income additions based on accounting estimates are exempt."},
                    {"label": "Transfer Pricing Shield", "caption": "Contemporaneous economic benchmarking shields cross border terms."}
                ]
            },
            {
                "partIndex": 2,
                "title": "Section 270AA Statutory Immunity",
                "steps": [
                    {"label": "Demand Payment", "caption": "Assessee pays full tax and interest demand within thirty days."},
                    {"label": "Appeal Waiver", "caption": "Assessee executes formal board waiver of appellate challenge."},
                    {"label": "Form Filing", "caption": "Assessee submits electronic application in Form Sixty Eight."},
                    {"label": "Mandatory Grant", "caption": "Officer grants absolute immunity from penalty and prosecution."}
                ]
            },
            {
                "partIndex": 3,
                "title": "False Entry & Prosecution Flow",
                "steps": [
                    {"label": "Fake Invoices", "caption": "Accommodation entries attract hundred percent penalty on amount."},
                    {"label": "Intermediary Liability", "caption": "Entry providers and abettors face equal financial penalties."},
                    {"label": "Criminal Charge", "caption": "Willful tax evasion triggers rigorous imprisonment proceedings."},
                    {"label": "Compounding Relief", "caption": "Competent authority compounds offenses upon statutory fees."}
                ]
            },
            {
                "partIndex": 4,
                "title": "Penalty Optimization Engine",
                "steps": [
                    {"label": "Addition Ingestion", "caption": "Engine catalogs assessment variations and factual disclosures."},
                    {"label": "Safe Harbour Audit", "caption": "Algorithm identifies additions protected by statutory carve outs."},
                    {"label": "Immunity Evaluation", "caption": "System verifies Form Sixty Eight eligibility requirements."},
                    {"label": "Settlement Strategy", "caption": "Platform quantifies savings achieved through statutory immunity."}
                ]
            }
        ]
    },
    50: {
        "title": "Milestone 10 Capstone: Enterprise Tax Dispute Defense, Faceless Assessment Simulator & Dispute Resolution Committee Defense",
        "steps_per_entry": 4,
        "entries": [
            {
                "partIndex": 0,
                "title": "Enterprise Dispute Portfolio",
                "steps": [
                    {"label": "Corporate Profile", "caption": "Aerospace conglomerate manages multi year tax enforcement actions."},
                    {"label": "Concurrent Challenges", "caption": "Tax directorate faces scrutiny, reassessment, and survey orders."},
                    {"label": "Governance Protocol", "caption": "Audit committee establishes rigorous statutory defense strategy."},
                    {"label": "Value Preservation", "caption": "Strategy defends shareholder capital and eliminates unjust claims."}
                ]
            },
            {
                "partIndex": 1,
                "title": "Faceless Scrutiny Resolution",
                "steps": [
                    {"label": "Research Defense", "caption": "Consumables expenditure is substantiated through approval records."},
                    {"label": "Benchmark Defense", "caption": "Transfer pricing study establishes arm length economic terms."},
                    {"label": "Video Presentation", "caption": "Counsel presents technical three dimensional models in hearing."},
                    {"label": "Variation Deletion", "caption": "NeFAC drops major additions and reduces transfer pricing adjustment."}
                ]
            },
            {
                "partIndex": 2,
                "title": "Reassessment & Survey Victory",
                "steps": [
                    {"label": "Sanction Defect", "caption": "Reassessment notice is challenged for incompetent approval rank."},
                    {"label": "Physical Proof", "caption": "Weighbridge receipts confirm physical movement of raw materials."},
                    {"label": "Survey Retraction", "caption": "Forced survey admission is retracted under Supreme Court doctrine."},
                    {"label": "Asset Reconciliation", "caption": "Factory spares are reconciled with audited fixed asset register."}
                ]
            },
            {
                "partIndex": 3,
                "title": "Statutory Immunity Closure",
                "steps": [
                    {"label": "Settlement Choice", "caption": "Directorate resolves warranty dispute via statutory settlement."},
                    {"label": "Demand Discharge", "caption": "Corporate treasury deposits assessed tax demand in full."},
                    {"label": "Form Submission", "caption": "Application in Form Sixty Eight is electronically filed on portal."},
                    {"label": "Immunity Order", "caption": "Officer passes speaking order granting complete immunity."}
                ]
            },
            {
                "partIndex": 4,
                "title": "Master Dispute Simulator",
                "steps": [
                    {"label": "Portfolio Ingestion", "caption": "Simulator ingests dispute portfolio across all fiscal years."},
                    {"label": "Algorithmic Defense", "caption": "Engine evaluates statutory limitation and evidentiary rules."},
                    {"label": "Savings Quantification", "caption": "Platform calculates total tax savings exceeding crores."},
                    {"label": "Master Accreditation", "caption": "System awards enterprise tax dispute master pass credential."}
                ]
            }
        ]
    }
}

def generate_visual_jsons():
    out_dir = os.path.join("src", "lib", "data", "lessonVisuals", "bcom_tax")
    os.makedirs(out_dir, exist_ok=True)
    
    for day_num, ddata in visuals_data.items():
        filepath = os.path.join(out_dir, f"day-{day_num}.json")
        entries = []
        for e in ddata["entries"]:
            steps = []
            for s in e["steps"]:
                caption = s["caption"]
                # Validation checks:
                assert len(caption) <= 75, f"Day {day_num} Part {e['partIndex']} caption too long: {len(caption)} chars -> {caption}"
                assert caption.endswith("."), f"Day {day_num} Part {e['partIndex']} caption missing period: {caption}"
                assert not re.search(r'\d', caption), f"Day {day_num} Part {e['partIndex']} caption contains digit: {caption}"
                steps.append({
                    "label": s["label"],
                    "caption": caption
                })
            entries.append({
                "partIndex": e["partIndex"],
                "spec": {
                    "title": e["title"],
                    "steps": steps
                }
            })
            
        full_json = {
            "schemaVersion": "2.0.0",
            "prefix": "bcom_tax",
            "day": day_num,
            "entries": entries
        }
        
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(full_json, f, indent=2)
        print(f"Generated {filepath} successfully (5 entries, 4 steps each, strict Gate v2 invariants).")

if __name__ == "__main__":
    generate_visual_jsons()
