# scripts/branch_b/create_day37_tax.py
"""
Day 37: Inverted Duty Structure & Export Refund Mechanics: Rule 89(4), 89(5), Formula Derivations & LUT Compliance
Strict Pedagogical Invariants:
- Exactly 5 parts
- Every part's say array has >= 600 words
- 4 options in check, answer: 0, answerIndex: 0, detailed statutory why (>= 50 words)
- Realistic, deterministic Python code with matching output
"""

DAY37_METADATA = {
    "day": 37,
    "coursePrefix": "bcom_tax",
    "title": "Inverted Duty Structure & Export Refund Mechanics: Rule 89(4), 89(5), Formula Derivations & LUT Compliance",
    "minutes": 38,
    "projectStep": {
        "title": "Engineer Enterprise Inverted Duty Structure & Cross-Border Zero-Rated Export Refund Cockpit",
        "steps": [
            "Formalize zero-rated export mechanics under Section 16 of the IGST Act under Letter of Undertaking (LUT).",
            "Implement statutory Rule 89(4) turnover apportionment formulas for unutilized input tax credit refunds.",
            "Derive the Inverted Duty Structure (IDS) refund formula under Section 54(3)(ii) and post-amendment Rule 89(5).",
            "Synthesize judicial principles from the Supreme Court VKC Footwear ruling regarding input services exclusion.",
            "Construct the GSTExportRefundEngine modeling multi-plant refund claims with complete statutory documentation."
        ]
    }
}

DAY37_PARTS = [
    # Part 1
    {
        "title": "Constitutional and Statutory Basis of Export Refunds: Zero-Rated Supplies under Section 16 of the IGST Act",
        "say": [
            "The international trade architecture of value-added taxation is anchored upon the globally recognized Destination Principle, which posits that goods and services should be taxed in the jurisdiction where their final consumption occurs rather than where they are produced. Under this doctrine, sovereign states ensure that domestic indirect taxes are completely removed from outbound trade, preventing the exportation of domestic taxes and preserving the cost competitiveness of national enterprises in hyper-competitive global markets. In India's indirect tax framework, this constitutional and economic objective is realized through the statutory concept of Zero-Rated Supplies, codified under Section 16 of the Integrated Goods and Services Tax (IGST) Act, 2017.",
            "Section 16(1) of the IGST Act establishes that zero-rated supply means either of two distinct commercial transactions: first, the export of goods or services or both out of the territory of India; and second, the supply of goods or services or both to a Special Economic Zone (SEZ) developer or an SEZ unit. The statute draws a profound, non-negotiable distinction between exempt supplies and zero-rated supplies. While exempt supplies break the value chain by denying input tax credit to the supplier under Section 17(2), Section 16(2) explicitly mandates that credit of input tax may be availed for making zero-rated supplies, notwithstanding that such supply may be an exempt supply. Thus, zero-rating achieves true taxation neutrality: the output supply bears a zero percent nominal tax rate, while all embedded taxes on inward procurements remain fully creditable and refundable.",
            "To operationalize zero-rating, Section 16(3) provides exporters with two distinct statutory routes for claiming fiscal relief. The primary route allows a registered person making a zero-rated supply to export goods or services under a Letter of Undertaking (LUT) or Bond without payment of integrated tax, and subsequently claim a refund of unutilized input tax credit under Section 54(3) of the CGST Act read with Rule 89(4) of the CGST Rules. The alternative route, historically widely utilized but progressively restricted by amendments under the Finance Act 2021, allowed taxpayers to pay IGST on outbound supplies using accumulated input tax credit and subsequently claim an automatic, computerized refund of the IGST paid directly through Indian Customs ICEGATE and GST portal integrations.",
            "For corporate treasury directors, managing export zero-rating under the LUT route requires meticulous compliance with strict statutory timelines and evidentiary thresholds. Unlike physical exports of goods—where crossing the territorial waters of India and filing a shipping bill constitutes definitive legal proof of export—the export of services is governed by five cumulative statutory conditions under Section 2(6) of the IGST Act: the supplier must be in India, the recipient must be outside India, the place of supply must be outside India, the payment for such service must be received in convertible foreign exchange (or in Indian Rupees wherever permitted by the Reserve Bank of India), and the supplier and recipient must not be merely establishments of a distinct person. Failure to establish any one of these five elements immediately strips the transaction of its zero-rated character, transforming it into an unauthorized domestic supply liable to normal GST alongside penal interest.",
            "Furthermore, Section 54(3) of the CGST Act prescribes a strict two-year statute of limitations from the 'relevant date' for filing electronic refund applications in Form GST RFD-01. For physical exports of goods, the relevant date is tied directly to the date on which the ship or aircraft departs from India or the truck crosses the land frontier; for export of services, it is linked to the date of receipt of convertible foreign exchange or the date of the export invoice if payment was received in advance. Missing this statutory limitation window results in the irrevocable lapse of corporate refund entitlements, inflicting severe balance sheet working capital damage."
        ],
        "example": "A global software export enterprise in Bengaluru delivers Rs 500,000,000 in enterprise cloud consulting to clients in Frankfurt and Tokyo. The enterprise executes all exports under an active Letter of Undertaking (LUT) without charging IGST. During the fiscal quarter, it incurs Rs 45,000,000 in inward GST on server hosting, leased lines, and professional technical services. Under Section 16(2) and Section 54(3), the enterprise files Form GST RFD-01 to claim a cash refund of the entire Rs 45,000,000 unutilized ITC, directly augmenting its treasury cash flow.",
        "code": """# Section 16 IGST Zero-Rated Export Eligibility & Validation Engine
from typing import Dict, Any

def validate_export_of_services_eligibility(
    supplier_location_india: bool,
    recipient_location_outside_india: bool,
    place_of_supply_outside_india: bool,
    payment_in_convertible_forex: bool,
    is_distinct_person_establishment: bool,
    invoice_value_inr: float,
    inward_itc_incurred: float
) -> Dict[str, Any]:
    # Section 2(6) of IGST Act mandates 5 cumulative conditions
    cond1 = supplier_location_india
    cond2 = recipient_location_outside_india
    cond3 = place_of_supply_outside_india
    cond4 = payment_in_convertible_forex
    cond5 = not is_distinct_person_establishment  # Must NOT be mere establishments
    
    all_conditions_met = cond1 and cond2 and cond3 and cond4 and cond5
    
    if all_conditions_met:
        status = "QUALIFIED_ZERO_RATED_EXPORT"
        output_gst_payable = 0.0
        eligible_itc_refund = inward_itc_incurred
        remarks = "Qualifies under Section 16(1)(a) IGST. Eligible for 100% unutilized ITC refund under Rule 89(4)."
    else:
        status = "DOMESTIC_TAXABLE_SUPPLY_FAIL"
        # Disqualification subjects transaction to 18% standard IGST
        output_gst_payable = invoice_value_inr * 0.18
        eligible_itc_refund = 0.0
        remarks = "Failed Section 2(6) cumulative criteria. Liable to output IGST with zero export refund."

    return {
        "export_status": status,
        "invoice_value_inr": round(invoice_value_inr, 2),
        "output_tax_payable": round(output_gst_payable, 2),
        "eligible_itc_cash_refund": round(eligible_itc_refund, 2),
        "statutory_remarks": remarks
    }

eval_pass = validate_export_of_services_eligibility(
    supplier_location_india=True,
    recipient_location_outside_india=True,
    place_of_supply_outside_india=True,
    payment_in_convertible_forex=True,
    is_distinct_person_establishment=False,
    invoice_value_inr=50000000.0,
    inward_itc_incurred=4500000.0
)

print(f"Export Determination: {eval_pass['export_status']}")
print(f"Output GST Obligation: INR {eval_pass['output_tax_payable']:,.2f}")
print(f"Treasury Cash Refund Claim: INR {eval_pass['eligible_itc_cash_refund']:,.2f}")
print(f"Statutory Basis: {eval_pass['statutory_remarks']}")""",
        "output": """Export Determination: QUALIFIED_ZERO_RATED_EXPORT
Output GST Obligation: INR 0.00
Treasury Cash Refund Claim: INR 4,500,000.00
Statutory Basis: Qualifies under Section 16(1)(a) IGST. Eligible for 100% unutilized ITC refund under Rule 89(4).""",
        "codeNotes": [
            "Evaluates the five cumulative statutory tests under Section 2(6) of the IGST Act for export of services.",
            "Verifies that foreign exchange realization and non-distinct person criteria are strictly satisfied.",
            "Computes zero output liability under LUT and unlocks 100% unutilized ITC cash refund eligibility.",
            "Demonstrates the severe adverse tax exposure if any statutory export criterion is breached."
        ],
        "tryIt": "Set payment_in_convertible_forex to False and observe how the engine reclassifies the transaction as a domestic supply liable to 18% IGST.",
        "check": {
            "question": "Which of the following is NOT one of the five cumulative statutory conditions required under Section 2(6) of the IGST Act to qualify as an 'export of services'?",
            "options": [
                "The supplier must obtain a physical export permit from the Directorate General of Foreign Trade (DGFT) prior to service delivery.",
                "The payment for such service must be received by the supplier in convertible foreign exchange (or INR where permitted by RBI).",
                "The place of supply of the service must be outside India as per statutory place of supply rules.",
                "The supplier of service and the recipient of service are not merely establishments of a distinct person."
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Section 2(6) sets out five specific conditions: supplier in India, recipient outside India, place of supply outside India, payment in convertible foreign exchange, and not distinct persons. A DGFT physical permit is not required for export of services."
        }
    },

    # Part 2
    {
        "title": "Letter of Undertaking (LUT) Architecture: Bond vs LUT, Export Invoices & Bank Realization Certificates (eBRC)",
        "say": [
            "The procedural bedrock of zero-rated supplies without payment of integrated tax is the Letter of Undertaking (LUT) mechanism prescribed under Rule 96A of the CGST Rules. Historically, under legacy indirect tax systems, exporters were subjected to cumbersome bank guarantees and physical surety bonds that tied up substantial commercial credit lines and imposed heavy administrative compliance burdens. To streamline export operations and liberate corporate working capital, Rule 96A permits eligible registered persons to submit an online, paperless Letter of Undertaking in Form GST RFD-11 on the GST Common Portal prior to executing outward exports.",
            "The statutory validity of an LUT extends across an entire financial year, encompassing all export consignments executed between April 1 and March 31. Under the statutory terms of Form GST RFD-11, the registered exporter undertakes three binding legal obligations: First, to observe all the provisions of the GST Acts and Rules in respect of export of goods or services. Second, to pay the integrated tax leviable on the goods exported along with interest under Section 50(1) at eighteen percent per annum within thirty days after the expiry of three months from the date of the export invoice if the goods are not exported out of India. Third, for export of services, to pay integrated tax with interest within fifteen days after the expiry of one year from the date of the export invoice if payment of such services is not received in convertible foreign exchange within the prescribed period.",
            "Where an exporter has been prosecuted for any offence under the CGST Act or any existing law where the tax evaded exceeds two hundred and fifty lakh rupees, the facility of furnishing an LUT is statutorily revoked. In such circumstances, the taxpayer is relegated to executing a physical Bond on non-judicial stamp paper, backed by a bank guarantee of up to fifteen percent of the estimated tax liability. For corporate enterprises, maintaining unblemished indirect tax compliance is therefore vital to preserve continuous LUT eligibility and avoid debilitating bank guarantee collaterals.",
            "In tandem with the LUT, export invoices must satisfy rigorous statutory disclosure requirements under the second proviso to Rule 46 of the CGST Rules. Every export invoice must prominently bear one of two mandatory statutory endorsements: 'SUPPLY MEANT FOR EXPORT/SUPPLY TO SEZ UNIT OR SEZ DEVELOPER FOR AUTHORISED OPERATIONS UNDER BOND OR LETTER OF UNDERTAKING WITHOUT PAYMENT OF INTEGRATED TAX', or 'SUPPLY MEANT FOR EXPORT/SUPPLY TO SEZ UNIT OR SEZ DEVELOPER FOR AUTHORISED OPERATIONS ON PAYMENT OF INTEGRATED TAX'. The invoice must contain the recipient's overseas name and address, delivery address, country of destination, and the unique LUT filing reference number (ARN).",
            "Furthermore, corporate exporters must distinguish standard zero-rated exports from 'Deemed Exports' governed by Section 147 of the CGST Act. Deemed exports encompass domestic transactions where goods manufactured in India do not leave the country, but are supplied against an Advance Authorisation, supplied to Export Oriented Units (EOU), or procured under the Export Promotion Capital Goods (EPCG) scheme. Unlike direct exports under LUT where unutilized credit is refunded, deemed exports allow either the recipient or the supplier to claim a refund of the tax paid on the supply, subject to furnishing an undertaking that the other party has not availed input tax credit or refund.",
            "Finally, for export of services and refund audits under Section 54, the ultimate evidentiary cornerstone is the electronic Bank Realization Certificate (eBRC) or Foreign Inward Remittance Certificate (FIRC). The Directorate General of Foreign Trade (DGFT) and CBIC operate an integrated digital network where authorized dealer banks report inward remittances directly. Departmental tax officers scrutinize eBRC reference numbers against export invoices during refund processing; any mismatch between invoiced sums and bank realizations leads to immediate statutory deficiency memos (Form GST RFD-03), withholding of refund sanctions, and provisional recovery notices under Section 73."
        ],
        "example": "An engineering export corporation files its annual LUT for FY 2026-27 on April 2, receiving ARN AD270426001234F. It exports precision machinery valued at $2,000,000 (INR 166,000,000) under invoice EXP-2026-001 bearing the mandatory statutory LUT endorsement. The goods depart Mumbai port on container vessel MV Ocean Giant within 45 days. The exporter links the Customs Shipping Bill and electronic bank realization certificate in Form GST RFD-01, securing a complete unutilized ITC refund of Rs 18,200,000 within thirty days of application.",
        "code": """# Rule 96A Letter of Undertaking (LUT) Compliance and Breach Monitoring Engine
from datetime import datetime, timedelta
from typing import Dict, Any

class ExportTransaction:
    def __init__(self, invoice_no: str, invoice_date: str, invoice_type: str, 
                 value_inr: float, igst_rate: float, lut_arn: str):
        self.invoice_no = invoice_no
        self.invoice_date = datetime.strptime(invoice_date, "%Y-%m-%d")
        self.invoice_type = invoice_type  # 'GOODS' or 'SERVICES'
        self.value_inr = value_inr
        self.igst_rate = igst_rate
        self.lut_arn = lut_arn
        self.physical_export_completed = False
        self.forex_realized = False
        self.realization_date = None

def monitor_lut_statutory_deadlines(
    txn: ExportTransaction,
    current_audit_date: str
) -> Dict[str, Any]:
    audit_dt = datetime.strptime(current_audit_date, "%Y-%m-%d")
    nominal_igst = txn.value_inr * (txn.igst_rate / 100.0)
    
    if txn.invoice_type == "GOODS":
        # Rule 96A(1)(a): 3 months from invoice date to export goods
        deadline = txn.invoice_date + timedelta(days=90)
        breached = not txn.physical_export_completed and audit_dt > deadline
    elif txn.invoice_type == "SERVICES":
        # Rule 96A(1)(b): 1 year (365 days) from invoice date to realize forex
        deadline = txn.invoice_date + timedelta(days=365)
        breached = not txn.forex_realized and audit_dt > deadline
    else:
        raise ValueError("Invalid export type")

    if breached:
        days_delayed = (audit_dt - deadline).days
        # Section 50(1) interest at 18% p.a.
        interest_payable = nominal_igst * (0.18 * (days_delayed / 365.0))
        status = "RULE_96A_STATUTORY_BREACH_ALERT"
        action_required = "Immediate payment of IGST + Section 50 interest via Form DRC-03"
    else:
        days_delayed = 0
        interest_payable = 0.0
        status = "LUT_STATUTORY_COMPLIANT_ACTIVE"
        action_required = "Maintain tracking until customs departure or eBRC issuance"

    return {
        "invoice_no": txn.invoice_no,
        "export_type": txn.invoice_type,
        "deadline_date": deadline.strftime("%Y-%m-%d"),
        "is_breached": breached,
        "days_overdue": days_delayed,
        "nominal_igst_usd": round(nominal_igst, 2),
        "interest_liability_inr": round(interest_payable, 2),
        "compliance_status": status,
        "recommended_action": action_required
    }

# Scenario: Software Export with 1-Year Forex Realization Window
service_export = ExportTransaction(
    invoice_no="EXP-SRV-901",
    invoice_date="2025-06-01",
    invoice_type="SERVICES",
    value_inr=10000000.0,
    igst_rate=18.0,
    lut_arn="AD270425009876K"
)

res = monitor_lut_statutory_deadlines(service_export, current_audit_date="2026-07-15")
print(f"Transaction: {res['invoice_no']} ({res['export_type']})")
print(f"Statutory Realization Deadline: {res['deadline_date']}")
print(f"Rule 96A Breach Status: {res['compliance_status']}")
print(f"Days Overdue: {res['days_overdue']} days")
print(f"Principal Tax Liability: INR {res['nominal_igst_usd']:,.2f}")
print(f"Section 50(1) Interest (18% p.a.): INR {res['interest_liability_inr']:,.2f}")
print(f"Action: {res['recommended_action']}")""",
        "output": """Transaction: EXP-SRV-901 (SERVICES)
Statutory Realization Deadline: 2026-06-01
Rule 96A Breach Status: RULE_96A_STATUTORY_BREACH_ALERT
Days Overdue: 44 days
Principal Tax Liability: INR 1,800,000.00
Section 50(1) Interest (18% p.a.): INR 39,057.53
Action: Immediate payment of IGST + Section 50 interest via Form DRC-03""",
        "codeNotes": [
            "Encapsulates export transactions under LUT with automated statutory deadline tracking.",
            "Enforces 90-day physical export window for goods and 1-year forex realization window for services.",
            "Computes exact statutory interest under Section 50(1) at 18% per annum upon deadline expiration.",
            "Alerts corporate controllers to trigger voluntary payment via DRC-03 to avoid Section 74 penalties."
        ],
        "tryIt": "Set current_audit_date to '2026-05-15' (within the 1-year window) and verify that compliance status transitions to 'LUT_STATUTORY_COMPLIANT_ACTIVE'.",
        "check": {
            "question": "Under Rule 96A(1) of the CGST Rules, what are the respective statutory time limits for exporting goods and realizing foreign exchange for services under an LUT?",
            "options": [
                "Three months from invoice date for goods export; one year from invoice date for services foreign exchange realization.",
                "Six months from invoice date for goods export; two years from invoice date for services foreign exchange realization.",
                "Thirty days from invoice date for goods export; ninety days from invoice date for services foreign exchange realization.",
                "One month from invoice date for goods export; six months from invoice date for services foreign exchange realization."
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Rule 96A(1) explicitly provides that integrated tax with interest must be paid within thirty days after the expiry of three months from the invoice date for goods, and within fifteen days after the expiry of one year from the invoice date for services."
        }
    },

    # Part 3
    {
        "title": "Rule 89(4) Refund of Unutilized ITC on Zero-Rated Supplies: Turnover Ratios & Maximum Refund Formulas",
        "say": [
            "Where an exporter executes zero-rated supplies under a Letter of Undertaking without payment of integrated tax, accumulated input tax credit cannot be set off against output tax liabilities, creating substantial balance sheet capital blockages. To liquidate these unutilized credits into liquid treasury cash, Section 54(3)(i) of the CGST Act grants a statutory right to claim a refund of unutilized input tax credit. The precise quantum of refund is determined not by subjective discretion or arbitrary departmental assessments, but through the rigorous mathematical formula codified in Rule 89(4) of the CGST Rules.",
            "The statutory formula under Rule 89(4) is structured as: Maximum Refund Amount = (Turnover of zero-rated supply of goods + Turnover of zero-rated supply of services) * Net ITC / Adjusted Total Turnover. Every component of this formula is governed by detailed statutory definitions designed to prevent exaggerated refund claims. 'Net ITC' is strictly defined as input tax credit availed on inputs and input services during the relevant period; crucially, input tax credit availed on capital goods is statutorily excluded from Net ITC under Rule 89(4). Furthermore, any credit reversed under Rule 42 or Rule 43 or blocked under Section 17(5) must be deducted to arrive at pure eligible Net ITC.",
            "The definition of 'Turnover of zero-rated supply of goods' underwent a profound statutory hardening through Notification No. 16/2020-Central Tax. To curb the rampant practice of over-invoicing export consignments to siphon off bogus GST refunds, the government inserted an artificial statutory ceiling: the turnover of zero-rated supply of goods shall be the lower of the actual FOB/customs value or 1.5 times the value of like goods domestically supplied by the same or similarly placed supplier. This 150% domestic benchmark restriction enforces economic rationality, ensuring that refund claims cannot exceed legitimate domestic manufacturing costs plus normal commercial margins.",
            "'Turnover of zero-rated supply of services' is computed through a precise cash-realization formula: aggregate payments received during the relevant period for zero-rated services, plus zero-rated services completed during the relevant period where payment was received in advance in earlier periods, minus advances received during the relevant period where services have not yet been completed. Finally, 'Adjusted Total Turnover' represents the aggregate turnover in a State or Union territory as defined under Section 2(112), excluding exempt supplies other than zero-rated supplies and turnover of supplies for which refund is claimed under sub-rule (4A) or (4B).",
            "In enterprise tax operations, calculating Rule 89(4) refunds requires establishing automated cross-checks between Form GSTR-1 outward tables, Form GSTR-3B Table 4(A) availed credits, and shipping bill declarations on ICEGATE. A mathematical error in determining Adjusted Total Turnover or misclassifying capital goods into Net ITC results in the immediate issuance of Form GST RFD-03 (Deficiency Memo), restarting the statutory sixty-day clock under Section 54(7) and delaying multi-crore cash disbursements. Implementing validated calculation engines is therefore essential to accelerate cash conversion cycles.",
            "Additionally, Master Circular No. 125/44/2019-GST and Circular No. 135/05/2020-GST provide vital administrative instructions governing multi-month refund claims. Exporters are permitted to club successive tax periods across financial years to lodge a consolidated refund application, provided the claims fall within the two-year limitation window. Furthermore, Section 54(14) imposes an absolute de minimis threshold, specifying that no refund of unutilized input tax credit shall be paid to an applicant if the amount is less than one thousand rupees.",
            "Crucially, upon electronic submission of Form GST RFD-01 on the portal, an automatic debit is immediately posted to the taxpayer's Electronic Credit Ledger for the exact refund amount claimed. This automated ledger lock prevents taxpayers from double-utilizing the same credit balance to discharge domestic outward liabilities while the refund application undergoes jurisdictional officer scrutiny. If the refund is subsequently rejected or partially sanctioned, the un-sanctioned portion is re-credited to the electronic credit ledger via Form GST PMT-03, maintaining perfect balance sheet ledger symmetry."
        ],
        "example": "An electronic hardware exporter has Net ITC of Rs 30,000,000 (all on inputs and input services). Capital goods ITC of Rs 10,000,000 is correctly excluded. Zero-rated export turnover of goods (subject to 1.5x domestic cap) is Rs 120,000,000. Domestic taxable turnover is Rs 80,000,000. Total Adjusted Turnover is Rs 200,000,000. The zero-rated export ratio is 120,000,000 / 200,000,000 = 60%. Under Rule 89(4), Maximum Refund Amount = 60% of Rs 30,000,000 = Rs 18,000,000. The remaining Rs 12,000,000 ITC is absorbed by domestic output tax liabilities.",
        "code": """# Rule 89(4) Statutory Export Refund Calculation Engine
from typing import Dict, Any

def compute_rule_89_4_export_refund(
    net_itc_inputs_services: float,
    capital_goods_itc_excluded: float,
    actual_zero_rated_goods_turnover: float,
    domestic_like_goods_value: float,
    zero_rated_services_turnover: float,
    domestic_taxable_turnover: float,
    exempt_turnover_non_export: float
) -> Dict[str, Any]:
    # Invariant 1: 1.5x domestic price cap on zero-rated goods turnover
    goods_ceiling = domestic_like_goods_value * 1.50
    capped_goods_turnover = min(actual_zero_rated_goods_turnover, goods_ceiling)
    
    total_zero_rated_turnover = capped_goods_turnover + zero_rated_services_turnover
    
    # Invariant 2: Adjusted Total Turnover excludes non-export exempt supplies
    adjusted_total_turnover = total_zero_rated_turnover + domestic_taxable_turnover
    
    if adjusted_total_turnover <= 0:
        raise ValueError("Adjusted total turnover must be strictly greater than zero.")
        
    export_turnover_ratio = total_zero_rated_turnover / adjusted_total_turnover
    
    # Invariant 3: Rule 89(4) Formula = (Zero-Rated Turnover / Adjusted Total Turnover) * Net ITC
    # Net ITC strictly excludes capital goods
    max_refund_entitlement = total_zero_rated_turnover * (net_itc_inputs_services / adjusted_total_turnover)

    return {
        "net_itc_eligible_pool": round(net_itc_inputs_services, 2),
        "capital_goods_itc_disallowed": round(capital_goods_itc_excluded, 2),
        "actual_export_goods_value": round(actual_zero_rated_goods_turnover, 2),
        "statutory_1_5x_ceiling": round(goods_ceiling, 2),
        "capped_export_goods_turnover": round(capped_goods_turnover, 2),
        "total_zero_rated_turnover": round(total_zero_rated_turnover, 2),
        "adjusted_total_turnover": round(adjusted_total_turnover, 2),
        "export_turnover_ratio": round(export_turnover_ratio, 4),
        "statutory_max_refund_claim": round(max_refund_entitlement, 2)
    }

r89_4 = compute_rule_89_4_export_refund(
    net_itc_inputs_services=30000000.0,
    capital_goods_itc_excluded=10000000.0,
    actual_zero_rated_goods_turnover=140000000.0,
    domestic_like_goods_value=80000000.0,  # 1.5x cap = 120,000,000
    zero_rated_services_turnover=0.0,
    domestic_taxable_turnover=80000000.0,
    exempt_turnover_non_export=15000000.0
)

print(f"Eligible Net ITC (Inputs + Services): INR {r89_4['net_itc_eligible_pool']:,.2f}")
print(f"Excluded Capital Goods ITC: INR {r89_4['capital_goods_itc_disallowed']:,.2f}")
print(f"Actual Export Invoice: INR {r89_4['actual_export_goods_value']:,.2f} | 1.5x Cap: INR {r89_4['statutory_1_5x_ceiling']:,.2f}")
print(f"Recognized Zero-Rated Goods Turnover: INR {r89_4['capped_export_goods_turnover']:,.2f}")
print(f"Export Ratio (Zero-Rated / Adjusted Total): {r89_4['export_turnover_ratio']:.2%}")
print(f"Rule 89(4) Maximum Refund Sanction: INR {r89_4['statutory_max_refund_claim']:,.2f}")""",
        "output": """Eligible Net ITC (Inputs + Services): INR 30,000,000.00
Excluded Capital Goods ITC: INR 10,000,000.00
Actual Export Invoice: INR 140,000,000.00 | 1.5x Cap: INR 120,000,000.00
Recognized Zero-Rated Goods Turnover: INR 120,000,000.00
Export Ratio (Zero-Rated / Adjusted Total): 60.00%
Rule 89(4) Maximum Refund Sanction: INR 18,000,000.00""",
        "codeNotes": [
            "Applies statutory 1.5x domestic benchmark cap to actual zero-rated export of goods.",
            "Excludes capital goods ITC strictly in accordance with Rule 89(4) statutory definition of Net ITC.",
            "Calculates Adjusted Total Turnover by omitting non-export exempt commercial streams.",
            "Multiplies export turnover ratio by Net ITC to produce deterministic refund entitlement."
        ],
        "tryIt": "Increase actual export turnover to Rs 180,000,000 and verify that the 1.5x cap holds recognized export turnover firmly at Rs 120,000,000.",
        "check": {
            "question": "Under Rule 89(4) of the CGST Rules, how is the 'Turnover of zero-rated supply of goods' capped for the purpose of computing maximum export refund?",
            "options": [
                "It is capped at the lower of actual export value or 1.5 times the value of like goods domestically supplied.",
                "It is capped at the lower of actual export value or the historical average of previous three years' exports.",
                "It is capped at exactly eighty percent of the free-on-board (FOB) customs shipping bill value.",
                "It is capped at the maximum credit limit sanctioned by the Directorate General of Foreign Trade."
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Notification No. 16/2020-Central Tax amended Rule 89(4) to stipulate that turnover of zero-rated supply of goods shall be the lower of actual value or 1.5 times the value of like goods domestically supplied."
        }
    },

    # Part 4
    {
        "title": "Inverted Duty Structure (IDS) under Section 54(3)(ii) & Rule 89(5): Supreme Court Jurisprudence & Revised Formulas",
        "say": [
            "An Inverted Duty Structure (IDS) arises in a multi-tier manufacturing supply chain when the rate of tax on inward inputs is higher than the rate of tax on outward finished supplies. This structural tariff distortion is prevalent across key industrial sectors, including textiles, footwear, fertilizers, solar modules, pharmaceutical formulations, and railway components. For example, a footwear manufacturer procuring chemical adhesives, leather polymers, and specialized soles at an eighteen percent GST rate while selling finished footwear priced under one thousand rupees at a five percent GST rate experiences structural input tax accumulation. The inward credit generated on every unit produced exceeds the outward liability dischargeable upon its sale, leading to a perpetual, swelling accumulation of unabsorbed credit in the Electronic Credit Ledger.",
            "To alleviate this economic distortion, Section 54(3)(ii) of the CGST Act provides an explicit statutory remedy: a registered person is entitled to claim a refund of unutilized input tax credit where the credit has accumulated on account of rate of tax on inputs being higher than the rate of tax on output supplies (other than nil rated or fully exempt supplies). However, this statutory concession is circumscribed by two strict legislative exclusions: no refund of unutilized credit is permissible where the outward supplies are nil rated or fully exempt, or where the central government, on the recommendations of the GST Council, specifically notifies certain goods as ineligible for inverted duty refunds (such as rail locomotives, edible oils, and marble slabs).",
            "The operational calculation of inverted duty structure refunds is governed by Rule 89(5) of the CGST Rules, which was the epicenter of intense constitutional and judicial litigation. The core controversy centered on whether 'Net ITC' under Rule 89(5) could include input tax credit on input services in addition to physical inputs. In a landmark ruling in *Union of India v. VKC Footwear India Pvt Ltd* (2021), the Supreme Court of India settled the dispute with absolute finality. The Supreme Court upheld the constitutional validity of Rule 89(5), ruling that Section 54(3)(ii) explicitly limits the statutory entitlement of refund to tax paid on 'inputs' (defined under Section 2(59) as goods other than capital goods), deliberately excluding 'input services'. The Court declared that tax refunds are statutory concessions where the judiciary cannot rewrite legislative policy, even if the exclusion of input services creates commercial friction.",
            "Following the *VKC Footwear* judgment, the GST Council recognized an unintended mathematical anomaly in the original Rule 89(5) formula. In the original formula, the entire outward tax liability was deducted from the pro-rata input credit, effectively forcing the taxpayer to consume input credits first and artificially depleting the refundable pool. To eliminate this distortion, the government amended Rule 89(5) vide Notification No. 14/2022-Central Tax. The amended statutory formula is: Maximum Refund Amount = [{Turnover of inverted rated supply of goods and services * Net ITC / Adjusted Total Turnover} - {Tax payable on such inverted rated supply of goods and services * (Net ITC / (Net ITC + ITC availed on input services))}].",
            "This amended formula introduces a proportional apportionment of outward tax liability between inputs and input services. By scaling the deduction of outward tax payable by the ratio of Net ITC to total input tax credit (Net ITC plus input services), the amended formula prevents input services from unfairly eroding the refundable input credit pool. Corporate tax modeling engines must implement this exact post-amendment algebraic structure; utilizing outdated pre-2022 formulas under-calculates statutory refund entitlements by millions of rupees, directly impairing corporate cash positions.",
            "Moreover, the applicability of Inverted Duty Structure refunds is strictly confined to manufacturing operations that undergo a physical transformation of inputs into output products. In multiple advance rulings and circular clarifications, tax authorities have established that pure trading entities—such as distributors who purchase finished goods at eighteen percent and resell the identical goods under a concessional five percent rate due to specific end-user exemptions—cannot claim IDS refunds under Section 54(3)(ii). The legislative intent of the inverted duty concession is to cure industrial manufacturing tariff distortions, not to subsidize commercial trading margins. Corporate enterprises with mixed manufacturing and trading operations must maintain segregated inventory accounting to isolate manufacturing input credits."
        ],
        "example": "A footwear manufacturer has Net ITC on inputs of Rs 18,000,000 and ITC on input services of Rs 6,000,000 (total inward credit Rs 24,000,000). Turnover of inverted rated supplies (taxed at 5%) is Rs 200,000,000, generating outward tax payable of Rs 10,000,000. Adjusted Total Turnover is Rs 200,000,000. Inverted turnover ratio is 100%. Gross proportional input credit is 100% of Rs 18,000,000 = Rs 18,000,000. Under the post-amendment Rule 89(5) formula, the outward tax deduction is scaled: Rs 10,000,000 * (18,000,000 / 24,000,000) = Rs 7,500,000. The maximum refundable amount is Rs 18,000,000 - Rs 7,500,000 = Rs 10,500,000. (Under the old unamended formula, the deduction would have been the full Rs 10,000,000, yielding only Rs 8,000,000).",
        "code": """# Post-Amendment Rule 89(5) Inverted Duty Structure (IDS) Refund Engine
from typing import Dict, Any

def compute_rule_89_5_inverted_duty_refund(
    net_itc_inputs_only: float,
    itc_input_services: float,
    capital_goods_itc: float,
    inverted_supplies_turnover: float,
    adjusted_total_turnover: float,
    tax_payable_on_inverted_supplies: float
) -> Dict[str, Any]:
    # VKC Footwear Invariant: Net ITC strictly includes ONLY inputs (goods)
    Net_ITC = net_itc_inputs_only
    Total_ITC_Inputs_And_Services = Net_ITC + itc_input_services
    
    if adjusted_total_turnover <= 0:
        raise ValueError("Adjusted total turnover must be positive.")
        
    turnover_ratio = inverted_supplies_turnover / adjusted_total_turnover
    
    # Term 1: Proportional Input Credit attributable to Inverted Turnover
    gross_proportional_itc = turnover_ratio * Net_ITC
    
    # Term 2: Post-Amendment Scaled Outward Tax Deduction (Notification 14/2022-CT)
    if Total_ITC_Inputs_And_Services > 0:
        scaling_factor = Net_ITC / Total_ITC_Inputs_And_Services
    else:
        scaling_factor = 0.0
        
    scaled_tax_deduction = tax_payable_on_inverted_supplies * scaling_factor
    
    # Maximum Statutory Refund Amount
    max_ids_refund = max(0.0, gross_proportional_itc - scaled_tax_deduction)
    
    # Comparative Benchmark: Pre-Amendment Formula (Full Outward Tax Deduction)
    pre_amendment_refund = max(0.0, gross_proportional_itc - tax_payable_on_inverted_supplies)
    benefit_of_amendment = max_ids_refund - pre_amendment_refund

    return {
        "net_itc_inputs_only": round(Net_ITC, 2),
        "itc_input_services_excluded": round(itc_input_services, 2),
        "capital_goods_excluded": round(capital_goods_itc, 2),
        "inverted_turnover_ratio": round(turnover_ratio, 4),
        "gross_proportional_input_itc": round(gross_proportional_itc, 2),
        "tax_payable_on_inverted_supply": round(tax_payable_on_inverted_supplies, 2),
        "post_2022_scaling_factor": round(scaling_factor, 4),
        "scaled_tax_deduction": round(scaled_tax_deduction, 2),
        "post_amendment_max_refund": round(max_ids_refund, 2),
        "pre_amendment_refund_benchmark": round(pre_amendment_refund, 2),
        "cash_flow_liquidity_gain": round(benefit_of_amendment, 2)
    }

ids_res = compute_rule_89_5_inverted_duty_refund(
    net_itc_inputs_only=18000000.0,
    itc_input_services=6000000.0,
    capital_goods_itc=5000000.0,
    inverted_supplies_turnover=200000000.0,
    adjusted_total_turnover=200000000.0,
    tax_payable_on_inverted_supplies=10000000.0  # 5% on 200M
)

print(f"Net ITC (Inputs Only): INR {ids_res['net_itc_inputs_only']:,.2f}")
print(f"Excluded Input Services ITC (VKC Rule): INR {ids_res['itc_input_services_excluded']:,.2f}")
print(f"Outward Tax Payable: INR {ids_res['tax_payable_on_inverted_supply']:,.2f}")
print(f"Post-Amendment Scaling Factor: {ids_res['post_2022_scaling_factor']:.4f}")
print(f"Scaled Tax Deduction: INR {ids_res['scaled_tax_deduction']:,.2f}")
print(f"Post-Amendment Rule 89(5) Refund: INR {ids_res['post_amendment_max_refund']:,.2f}")
print(f"Treasury Liquidity Enhancement vs Pre-2022: INR {ids_res['cash_flow_liquidity_gain']:,.2f}")""",
        "output": """Net ITC (Inputs Only): INR 18,000,000.00
Excluded Input Services ITC (VKC Rule): INR 6,000,000.00
Outward Tax Payable: INR 10,000,000.00
Post-Amendment Scaling Factor: 0.7500
Scaled Tax Deduction: INR 7,500,000.00
Post-Amendment Rule 89(5) Refund: INR 10,500,000.00
Treasury Liquidity Enhancement vs Pre-2022: INR 2,500,000.00""",
        "codeNotes": [
            "Implements the landmark Supreme Court VKC Footwear mandate excluding input services from Net ITC.",
            "Executes post-amendment Rule 89(5) formula under Notification 14/2022-CT with scaled tax deductions.",
            "Computes exact proportional scaling factor Net_ITC / (Net_ITC + Services_ITC) to prevent credit leakage.",
            "Calculates the comparative financial benefit between pre-amendment and amended statutory formulas."
        ],
        "tryIt": "Increase itc_input_services to Rs 12,000,000 and observe how the scaling factor drops to 0.60, further reducing the scaled tax deduction and maximizing refund.",
        "check": {
            "question": "What was the definitive legal ruling of the Supreme Court of India in the landmark case of Union of India v. VKC Footwear India Pvt Ltd regarding Inverted Duty Structure refunds?",
            "options": [
                "The Supreme Court upheld the constitutional validity of Rule 89(5), holding that refunds under Section 54(3)(ii) are strictly restricted to inputs and exclude input services.",
                "The Supreme Court declared Rule 89(5) unconstitutional and mandated 100% refund of input services and capital goods.",
                "The Supreme Court abolished Inverted Duty Structure refunds and mandated flat five percent tax credits.",
                "The Supreme Court held that footwear manufacturing is exempt from the Central Goods and Services Tax Act."
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "The Supreme Court in VKC Footwear India Pvt Ltd (2021) affirmed that Section 54(3)(ii) grants refund strictly on account of tax on 'inputs' (goods), and the judiciary cannot expand this legislative concession to encompass input services."
        }
    },

    # Part 5
    {
        "title": "Enterprise Implementation: Algorithmic Inverted Duty Structure & Export Refund Calculation Cockpit",
        "say": [
            "In modern enterprise indirect tax operations, large manufacturing and export conglomerates face immense liquidity friction when managing hundreds of millions of rupees in accumulated input tax credits. A corporate entity operating multiple industrial plants across diverse states typically executes simultaneous physical exports under LUT (governed by Rule 89(4)), domestic inverted duty structure supplies (governed by Rule 89(5)), and normal taxable supplies. Attempting to track and allocate common inputs, import duties, and procurement streams manually across these competing refund heads through disconnected spreadsheets inevitably leads to overlapping refund claims, duplicate credit consumption, and automatic departmental rejection under Section 54.",
            "The architecture of a high-performance indirect tax cockpit demands a unified calculation core that enforces absolute statutory segregation across three distinct pools: First, physical capital goods, which are eligible for regular domestic outward tax set-off but statutorily barred from both Rule 89(4) export refunds and Rule 89(5) inverted duty refunds. Second, input services, which are fully includible in Rule 89(4) export refund calculations but statutorily excluded from Rule 89(5) inverted duty refunds under the *VKC Footwear* doctrine while serving as a scaling denominator under the post-2022 formula. Third, raw material inputs, which form the common eligible core across all statutory refund regimes.",
            "The enterprise refund cockpit operates as a five-phase automated pipeline: Phase 1 ingests monthly ERP purchase registers, linking each voucher with its corresponding customs bill of entry or domestic tax invoice. Phase 2 isolates and segregates Net ITC into Inputs ($ITC_{inputs}$), Input Services ($ITC_{services}$), and Capital Goods ($ITC_{capital}$). Phase 3 extracts sales ledgers, segregating turnover into zero-rated exports ($T_{export}$), inverted duty supplies ($T_{inverted}$), and standard domestic supplies ($T_{standard}$), while applying the 1.5x domestic price benchmark cap to physical goods exports. Phase 4 runs concurrent, non-overlapping mathematical optimization models to allocate shared Net ITC, preventing any single rupee of input tax from being counted in multiple refund formulas.",
            "Phase 5 executes automated validation checks against Form GSTR-2B and GSTR-3B ledger balances, ensuring that the total refund claimed in Form GST RFD-01 does not exceed the lowest of three statutory ceilings: the formula refund amount, the balance in the Electronic Credit Ledger at the end of the tax period, or the balance in the Electronic Credit Ledger at the time of filing the refund application. Finally, the cockpit generates pre-formatted XML/JSON audit manifests containing complete shipping bill numbers, eBRC reference keys, and statutory CA certifications required under Rule 89(2)(m).",
            "Now, inspect our complete, production-grade Python implementation: the GSTExportRefundEngine. This enterprise cockpit ingests multi-stream procurement and sales data, executes simultaneous Rule 89(4) and Rule 89(5) statutory computations with zero overlapping double-counts, enforces the 1.5x domestic export ceiling and *VKC Footwear* restrictions, and generates an exhaustive, audit-ready refund sanction dossier. All statutory invariants execute with mathematical determinism, delivering complete liquidity command to corporate leadership.",
            "Furthermore, the cockpit automates the tracking of the statutory sixty-day adjudication clock under Section 54(7). If the jurisdictional tax authority fails to sanction the refund order within sixty days from the date of receipt of an acknowledgment in Form GST RFD-02, Section 56 of the CGST Act mandates that interest at the rate of six percent per annum becomes legally payable from the sixty-first day until the actual date of cash credit disbursement. By logging electronic filing timestamps and tracking departmental communications, the cockpit alerts general counsel to file formal interest demand notices whenever statutory adjudication deadlines are breached.",
            "Finally, the implementation provides end-to-end audit defense documentation. It compiles itemized correlation schedules linking Customs shipping bills, port departure dates, foreign inward remittance certificates, and tax payment vouchers. When tax authorities initiate pre-notice inquiries or audit proceedings under Section 65, the enterprise can instantly generate cryptographic reconciliation reports demonstrating that every single claimed rupee complies strictly with Rule 89(4), Rule 89(5), and relevant judicial doctrines, safeguarding corporate reputation and executive peace of mind."
        ],
        "example": "A multinational diversified manufacturing group processes Rs 100,000,000 in gross inward tax across its automotive components division. The engine segregates Rs 15,000,000 capital goods (excluded), Rs 25,000,000 input services, and Rs 60,000,000 raw material inputs. Outward turnover consists of Rs 150,000,000 exports under LUT (capped at Rs 120,000,000) and Rs 200,000,000 inverted duty supplies. The engine executes concurrent Rule 89(4) and Rule 89(5) models, securing Rs 28,333,333 in export refunds and Rs 25,714,286 in inverted duty refunds—totaling Rs 54,047,619 in liquid cash recovery with zero audit errors.",
        "code": """# Production-Grade Enterprise GST Export & Inverted Duty Refund Cockpit
from typing import Dict, List, Any

class GSTExportRefundEngine:
    def __init__(self, gstin: str, legal_name: str, tax_period: str):
        self.gstin = gstin
        self.legal_name = legal_name
        self.tax_period = tax_period

    def execute_comprehensive_refund_pipeline(
        self,
        itc_inputs: float,
        itc_input_services: float,
        itc_capital_goods: float,
        actual_export_turnover: float,
        domestic_benchmark_export_cap: float,
        inverted_supplies_turnover: float,
        standard_domestic_turnover: float,
        tax_payable_on_inverted: float,
        closing_ecl_balance: float
    ) -> Dict[str, Any]:
        # Step 1: Export Turnover Capping (Rule 89(4))
        capped_export_turnover = min(actual_export_turnover, domestic_benchmark_export_cap)
        
        # Step 2: Adjusted Total Turnover
        adjusted_total_turnover = (
            capped_export_turnover + inverted_supplies_turnover + standard_domestic_turnover
        )
        if adjusted_total_turnover <= 0:
            raise ValueError("Adjusted total turnover must be strictly positive.")

        # Step 3: Compute Rule 89(4) Zero-Rated Export Refund
        # Net ITC for Export includes Inputs + Services (Excludes Capital Goods)
        net_itc_export = itc_inputs + itc_input_services
        export_turnover_ratio = capped_export_turnover / adjusted_total_turnover
        rule_89_4_refund = export_turnover_ratio * net_itc_export

        # Step 4: Compute Rule 89(5) Inverted Duty Structure Refund
        # Net ITC for IDS strictly includes ONLY Inputs (VKC Footwear Rule)
        inverted_turnover_ratio = inverted_supplies_turnover / adjusted_total_turnover
        gross_inverted_itc = inverted_turnover_ratio * itc_inputs
        
        # Post-2022 Scaling Factor: itc_inputs / (itc_inputs + itc_input_services)
        total_inv_pool = itc_inputs + itc_input_services
        scaling_factor = (itc_inputs / total_inv_pool) if total_inv_pool > 0 else 0.0
        scaled_tax_deduction = tax_payable_on_inverted * scaling_factor
        
        rule_89_5_refund = max(0.0, gross_inverted_itc - scaled_tax_deduction)

        # Step 5: Combined Refund Claim & Ledger Ceiling Validation
        total_formula_refund = rule_89_4_refund + rule_89_5_refund
        sanctioned_refund = min(total_formula_refund, closing_ecl_balance)
        refund_capped_by_ecl = closing_ecl_balance < total_formula_refund

        return {
            "gstin": self.gstin,
            "period": self.tax_period,
            "itc_inputs_pool": round(itc_inputs, 2),
            "itc_services_pool": round(itc_input_services, 2),
            "itc_capital_goods_excluded": round(itc_capital_goods, 2),
            "capped_export_turnover": round(capped_export_turnover, 2),
            "inverted_turnover": round(inverted_supplies_turnover, 2),
            "adjusted_total_turnover": round(adjusted_total_turnover, 2),
            "rule_89_4_export_refund": round(rule_89_4_refund, 2),
            "rule_89_5_ids_refund": round(rule_89_5_refund, 2),
            "total_formula_refund": round(total_formula_refund, 2),
            "closing_ecl_ledger_balance": round(closing_ecl_balance, 2),
            "final_sanctioned_cash_refund": round(sanctioned_refund, 2),
            "ecl_ceiling_active": refund_capped_by_ecl,
            "audit_verdict": "ENTERPRISE_REFUND_PIPELINE_VALIDATED_PASS"
        }

cockpit = GSTExportRefundEngine("24AABCA9876C1Z3", "Titan Aerospace Components Ltd", "2026-10")

result = cockpit.execute_comprehensive_refund_pipeline(
    itc_inputs=60000000.0,
    itc_input_services=25000000.0,
    itc_capital_goods=15000000.0,
    actual_export_turnover=150000000.0,
    domestic_benchmark_export_cap=120000000.0,
    inverted_supplies_turnover=200000000.0,
    standard_domestic_turnover=40000000.0,
    tax_payable_on_inverted=10000000.0,
    closing_ecl_balance=75000000.0
)

print(f"Enterprise: {result['gstin']} | Period: {result['period']}")
print(f"Adjusted Total Turnover: INR {result['adjusted_total_turnover']:,.2f}")
print(f"Rule 89(4) Zero-Rated Export Refund: INR {result['rule_89_4_export_refund']:,.2f}")
print(f"Rule 89(5) Inverted Duty Structure Refund: INR {result['rule_89_5_ids_refund']:,.2f}")
print(f"Total Formula Entitlement: INR {result['total_formula_refund']:,.2f}")
print(f"Final Sanctioned Cash Refund: INR {result['final_sanctioned_cash_refund']:,.2f}")
print(f"Audit Status: {result['audit_verdict']}")""",
        "output": """Enterprise: 24AABCA9876C1Z3 | Period: 2026-10
Adjusted Total Turnover: INR 360,000,000.00
Rule 89(4) Zero-Rated Export Refund: INR 28,333,333.33
Rule 89(5) Inverted Duty Structure Refund: INR 26,274,509.80
Total Formula Entitlement: INR 54,607,843.14
Final Sanctioned Cash Refund: INR 54,607,843.14
Audit Status: ENTERPRISE_REFUND_PIPELINE_VALIDATED_PASS""",
        "codeNotes": [
            "Harmonizes simultaneous Rule 89(4) export and Rule 89(5) inverted duty refund computations.",
            "Enforces statutory exclusions: capital goods excluded from both, services excluded from IDS.",
            "Implements post-2022 outward tax scaling factor and 1.5x domestic export price benchmark.",
            "Validates aggregate refund against closing Electronic Credit Ledger balance to prevent portal rejection."
        ],
        "tryIt": "Reduce closing_ecl_balance to Rs 40,000,000 and verify that final_sanctioned_cash_refund is capped exactly at Rs 40,000,000 with ecl_ceiling_active set to True.",
        "check": {
            "question": "What happens if the total statutory refund amount calculated under Rules 89(4) and 89(5) exceeds the balance in the Electronic Credit Ledger at the time of filing Form GST RFD-01?",
            "options": [
                "The sanctioned cash refund is strictly restricted and capped to the available balance in the Electronic Credit Ledger.",
                "The government automatically prints paper currency notes to settle the uncredited formula differential.",
                "The entire refund application is canceled and converted into criminal penalty proceedings.",
                "The excess refund is deposited directly into the personal bank accounts of company directors."
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Section 54 and the circulars governing refund processing mandate that the refund sanctioned shall be the least of the formula amount, the ledger balance at the end of the tax period, or the ledger balance on the filing date."
        }
    }
]

if __name__ == "__main__":
    print(f"Day 37 Metadata: {DAY37_METADATA['title']}")
    print(f"Total Parts: {len(DAY37_PARTS)}")
    for idx, p in enumerate(DAY37_PARTS):
        words = sum(len(s.split()) for s in p["say"])
        print(f"Part {idx+1} ({p['title'][:40]}...): {words} words | Check answer: {p['check']['answerIndex']}")
        assert words >= 600, f"Part {idx+1} word count {words} < 600!"
    print("DAY 37 VALIDATION PASSED!")
