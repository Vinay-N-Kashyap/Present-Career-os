"""
Generate Gate v2 Visual JSON files for bcom_tax Days 56 to 60.
Invariants:
- schemaVersion: "2.0.0"
- prefix: "bcom_tax"
- day: 56..60
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
    56: {
        "prefix": "bcom_tax",
        "day": 56,
        "entries": [
            {
                "partIndex": 0,
                "title": "Anti Avoidance Threshold",
                "steps": [
                    {"label": "Arrangement Review", "caption": "Assessing authority identifies complex corporate restructuring steps."},
                    {"label": "Tax Benefit Check", "caption": "System verifies reduction or deferral of statutory tax liabilities."},
                    {"label": "Safe Harbour Audit", "caption": "Authority checks aggregate tax benefit against statutory threshold."},
                    {"label": "Notice Formulation", "caption": "Officer drafts statutory notice to invoke general anti avoidance rules."}
                ]
            },
            {
                "partIndex": 1,
                "title": "Tainted Element Matrix",
                "steps": [
                    {"label": "Substance Test", "caption": "Panel evaluates whether form differs from true economic reality."},
                    {"label": "Round Trip Analysis", "caption": "System traces circular transfer of funds across offshore accounts."},
                    {"label": "Conduit Detection", "caption": "Authority identifies accommodating entities lacking business substance."},
                    {"label": "Tainted Element Finding", "caption": "Panel confirms presence of statutorily tainted transaction element."}
                ]
            },
            {
                "partIndex": 2,
                "title": "Recharacterization Powers",
                "steps": [
                    {"label": "Look Through Order", "caption": "Officer disregards intermediary corporate step in transaction chain."},
                    {"label": "Party Consolidation", "caption": "Authority treats accommodating conduit and parent as identical entity."},
                    {"label": "Hybrid Reclassification", "caption": "Officer recharacterizes hybrid debt instrument into taxable equity."},
                    {"label": "Treaty Denial", "caption": "Domestic anti avoidance rules override bilateral treaty exemptions."}
                ]
            },
            {
                "partIndex": 3,
                "title": "Approving Panel Procedure",
                "steps": [
                    {"label": "Officer Reference", "caption": "Assessing officer submits formal reference to principal commissioner."},
                    {"label": "Statutory Notice", "caption": "Commissioner issues show cause notice granting sixty days for response."},
                    {"label": "Collegiate Hearing", "caption": "Three member panel chaired by high court judge hears oral arguments."},
                    {"label": "Binding Directions", "caption": "Approving panel issues binding directions within six months of receipt."}
                ]
            },
            {
                "partIndex": 4,
                "title": "Anti Avoidance Engine",
                "steps": [
                    {"label": "Safe Harbour Clock", "caption": "Engine verifies whether tax exposure falls below statutory threshold."},
                    {"label": "Substance Indexing", "caption": "Platform scores corporate office leases and local employment records."},
                    {"label": "Recharacterization Model", "caption": "Simulator computes tax adjustments from proposed step disregards."},
                    {"label": "Statutory Docket", "caption": "Module compiles contemporaneous business defense for approving panel."}
                ]
            }
        ]
    },
    57: {
        "prefix": "bcom_tax",
        "day": 57,
        "entries": [
            {
                "partIndex": 0,
                "title": "Minimum Tax Scope",
                "steps": [
                    {"label": "Consolidated Revenue", "caption": "System verifies group revenue against global reporting threshold."},
                    {"label": "Excluded Entity Filter", "caption": "Platform excludes sovereign funds and non profit entities from scope."},
                    {"label": "Constituent Mapping", "caption": "Engine maps all cross border subsidiaries and joint ventures."},
                    {"label": "Multilateral Scope", "caption": "Group enters mandatory compliance under global anti base erosion rules."}
                ]
            },
            {
                "partIndex": 1,
                "title": "Interlocking Charging Rules",
                "steps": [
                    {"label": "Income Inclusion Rule", "caption": "Ultimate parent entity pays top up tax on low taxed foreign income."},
                    {"label": "Top Down Application", "caption": "Taxing right cascades to intermediate entity if parent does not act."},
                    {"label": "Undertaxed Profits Rule", "caption": "Operating entities deny local deductions to collect residual tax."},
                    {"label": "Substance Allocation", "caption": "Residual tax is allocated by relative employee headcount and assets."}
                ]
            },
            {
                "partIndex": 2,
                "title": "Domestic Minimum Tax",
                "steps": [
                    {"label": "Low Tax Calculation", "caption": "Source jurisdiction detects effective tax rate below fifteen percent."},
                    {"label": "Domestic Levy", "caption": "Host nation levies qualified domestic minimum top up tax locally."},
                    {"label": "Priority Absorption", "caption": "Domestic payment reduces parent top up liability down to zero."},
                    {"label": "Safe Harbour Status", "caption": "Certified domestic tax eliminates complex foreign filing obligations."}
                ]
            },
            {
                "partIndex": 3,
                "title": "Effective Tax Rate Math",
                "steps": [
                    {"label": "Net Income Adjustment", "caption": "Accounting profit is adjusted for excluded dividends and net taxes."},
                    {"label": "Covered Tax Audit", "caption": "System calculates adjusted corporate taxes and recapped deferrals."},
                    {"label": "Rate Determination", "caption": "Covered taxes are divided by net income to yield jurisdictional rate."},
                    {"label": "Substance Carve Out", "caption": "Payroll and tangible asset carve outs protect routine profit base."}
                ]
            },
            {
                "partIndex": 4,
                "title": "Global Minimum Tax Engine",
                "steps": [
                    {"label": "Threshold Monitoring", "caption": "Engine audits consolidated revenues across preceding fiscal years."},
                    {"label": "Effective Rate Calculator", "caption": "Platform computes jurisdictional rates for each operating nation."},
                    {"label": "Substance Modeling", "caption": "System applies payroll and plant carve outs to isolate excess profit."},
                    {"label": "Priority Allocator", "caption": "Module directs top up payments to domestic treasury under safe harbour."}
                ]
            }
        ]
    },
    58: {
        "prefix": "bcom_tax",
        "day": 58,
        "entries": [
            {
                "partIndex": 0,
                "title": "Amalgamation Architecture",
                "steps": [
                    {"label": "Asset Transfer", "caption": "All properties and liabilities transfer to the amalgamated company."},
                    {"label": "Shareholder Continuity", "caption": "Three fourths of shareholders in value become continuing owners."},
                    {"label": "Capital Gains Exemption", "caption": "Asset transfers and share exchanges enjoy full statutory exemption."},
                    {"label": "Loss Carry Forward", "caption": "Amalgamated entity inherits accumulated business losses and allowances."}
                ]
            },
            {
                "partIndex": 1,
                "title": "Demerger Undertaking Spin Off",
                "steps": [
                    {"label": "Undertaking Definition", "caption": "Corporate unit transfers as an autonomous viable going concern."},
                    {"label": "Book Value Transfer", "caption": "Assets and liabilities transfer at historic book values without markup."},
                    {"label": "Proportionate Allotment", "caption": "Resulting entity issues shares directly to parent shareholders."},
                    {"label": "Apportioned Tax Shield", "caption": "Accumulated losses are divided proportionately between companies."}
                ]
            },
            {
                "partIndex": 2,
                "title": "Slump Sale Mechanics",
                "steps": [
                    {"label": "Lump Sum Transfer", "caption": "Business undertaking transfers for single unassigned consideration."},
                    {"label": "Net Worth Calculation", "caption": "Depreciable assets at written down value form cost of acquisition."},
                    {"label": "Fair Value Comparison", "caption": "Consideration is benchmarked against market value of assets sold."},
                    {"label": "Capital Gain Assessment", "caption": "Gain is computed without indexation benefit under special code."}
                ]
            },
            {
                "partIndex": 3,
                "title": "Reorganization Clawback Rules",
                "steps": [
                    {"label": "Wholly Owned Exemption", "caption": "Asset transfer between parent and subsidiary is exempt from tax."},
                    {"label": "Eight Year Limitation", "caption": "Holding company must maintain full ownership for eight full years."},
                    {"label": "Share Dilution Event", "caption": "Reduction of equity holding triggers statutory clawback of relief."},
                    {"label": "Retroactive Charge", "caption": "Originally exempt gain becomes taxable income in year of dilution."}
                ]
            },
            {
                "partIndex": 4,
                "title": "Corporate Restructuring Engine",
                "steps": [
                    {"label": "Merger Qualification", "caption": "System verifies statutory asset and shareholder continuity tests."},
                    {"label": "Loss Schedule Audit", "caption": "Engine projects cash tax savings from absorbed industrial losses."},
                    {"label": "Slump Sale Valuation", "caption": "Module calculates net worth and fair market value capital gains."},
                    {"label": "Clawback Watchdog", "caption": "Platform monitors equity retention to prevent statutory tax clawback."}
                ]
            }
        ]
    },
    59: {
        "prefix": "bcom_tax",
        "day": 59,
        "entries": [
            {
                "partIndex": 0,
                "title": "Expat Secondment Defense",
                "steps": [
                    {"label": "Overseas Deployment", "caption": "Foreign parent deploys technical specialists to local production."},
                    {"label": "Lien Examination", "caption": "Authorities inspect whether overseas employment lien remains active."},
                    {"label": "Reverse Charge Notice", "caption": "Revenue demands indirect tax on salary reimbursements under mandate."},
                    {"label": "Revenue Neutrality", "caption": "Full input tax credit eligibility negates corporate tax liability."}
                ]
            },
            {
                "partIndex": 1,
                "title": "Inverted Duty Refund Math",
                "steps": [
                    {"label": "Rate Inversion", "caption": "Higher tax rate on raw materials generates unabsorbed input credit."},
                    {"label": "Formula Application", "caption": "Refund is computed by apportioning output tax against input goods."},
                    {"label": "Service Exclusion", "caption": "Input tax credit on services is statutorily excluded from refund."},
                    {"label": "Treasury Disbursement", "caption": "Verified refund amount is credited directly to enterprise account."}
                ]
            },
            {
                "partIndex": 2,
                "title": "Works Contract Tax Mechanics",
                "steps": [
                    {"label": "Composite Supply", "caption": "Civil construction is classified as a composite supply of service."},
                    {"label": "Credit Block Review", "caption": "Statute blocks input tax credit on construction of civil structures."},
                    {"label": "Functionality Doctrine", "caption": "Court applies functionality test to identify industrial plant items."},
                    {"label": "Deferred Time of Supply", "caption": "Tax liability on development agreements matures upon completion."}
                ]
            },
            {
                "partIndex": 3,
                "title": "Anti Profiteering Compliance",
                "steps": [
                    {"label": "Statutory Rate Cut", "caption": "Tax council notifies official reduction in indirect tax rates."},
                    {"label": "Mandatory Price Cut", "caption": "Enterprise must pass on exact tax saving via reduced retail prices."},
                    {"label": "Regulatory Audit", "caption": "Competition commission investigates pricing records per product line."},
                    {"label": "Consumer Refund Order", "caption": "Authority orders refund of retained gains into consumer welfare fund."}
                ]
            },
            {
                "partIndex": 4,
                "title": "Advanced Indirect Tax Engine",
                "steps": [
                    {"label": "Expat RCM Calculator", "caption": "Engine calculates reverse charge exposure on foreign reimbursements."},
                    {"label": "Inverted Duty Estimator", "caption": "Module models maximum cash refund under amended statutory formula."},
                    {"label": "Guarantee Valuation", "caption": "System computes deemed service values for corporate bank guarantees."},
                    {"label": "Dynamic Price Monitor", "caption": "Platform recalibrates retail prices to guarantee statutory compliance."}
                ]
            }
        ]
    },
    60: {
        "prefix": "bcom_tax",
        "day": 60,
        "entries": [
            {
                "partIndex": 0,
                "title": "Global Command Overview",
                "steps": [
                    {"label": "Multinational Enterprise", "caption": "Conglomerate coordinates cross border hubs across four territories."},
                    {"label": "Regulatory Convergence", "caption": "Enterprise confronts simultaneous direct and indirect tax audits."},
                    {"label": "Statutory Evidence", "caption": "Executive command mobilizes contemporaneous transfer pricing files."},
                    {"label": "Integrated Strategy", "caption": "Chief tax officer orchestrates comprehensive multilateral defense."}
                ]
            },
            {
                "partIndex": 1,
                "title": "Anti Avoidance Panel Victory",
                "steps": [
                    {"label": "Arrangement Challenge", "caption": "Revenue questions commercial substance of overseas financing hub."},
                    {"label": "Substance Validation", "caption": "Defense establishes local office operations and third party credit."},
                    {"label": "Panel Hearing", "caption": "Counsel presents economic paper book before three member panel."},
                    {"label": "Total Vindication", "caption": "Approving panel rejects tax challenge and confirms validity of hub."}
                ]
            },
            {
                "partIndex": 2,
                "title": "Global Minimum Tax Shield",
                "steps": [
                    {"label": "Jurisdictional Audit", "caption": "System computes effective tax rates across global corporate network."},
                    {"label": "Substance Carve Out", "caption": "Payroll and manufacturing assets shield core industrial profits."},
                    {"label": "Domestic Tax Priority", "caption": "Home exchequer collects top up tax under domestic minimum rules."},
                    {"label": "Multilateral Immunity", "caption": "Safe harbour status shields enterprise from foreign tax clawback."}
                ]
            },
            {
                "partIndex": 3,
                "title": "Restructuring and Indirect Victory",
                "steps": [
                    {"label": "Merger Loss Absorption", "caption": "Scheme of arrangement absorbs target business losses tax free."},
                    {"label": "Secondment Defense", "caption": "Dual contracts and full input credit defeat tax penalty demands."},
                    {"label": "Statutory Cash Shield", "caption": "Approved loss set offs deliver multi crore corporate tax savings."},
                    {"label": "Case Closure", "caption": "Tax authorities drop disputed additions and close audit files."}
                ]
            },
            {
                "partIndex": 4,
                "title": "Grand Master Simulator",
                "steps": [
                    {"label": "Command Simulation", "caption": "Simulator executes complete lifecycle of global tax optimization."},
                    {"label": "Exposure Mitigation", "caption": "Platform quantifies total corporate tax shields and penalties saved."},
                    {"label": "Enterprise Protection", "caption": "Multi tier algorithms shield corporate balance sheet capital."},
                    {"label": "Grand Accreditation", "caption": "System awards supreme master credential on triumphant conclusion."}
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
    print("\n>>> ALL VISUAL ENVELOPES FOR DAYS 56-60 PASS 100% OF INVARIANTS! <<<")
else:
    print("\n>>> ERRORS FOUND IN VISUAL ENVELOPES! <<<")
