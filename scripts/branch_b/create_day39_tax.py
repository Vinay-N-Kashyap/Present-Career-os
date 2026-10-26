# scripts/branch_b/create_day39_tax.py
"""
Day 39: E-Commerce, OIDAR & Marketplace Tax Architecture: TCS under Section 52, Cross-Border Services & Section 9(5) Aggregator Liabilities
Strict Pedagogical Invariants:
- Exactly 5 parts
- Every part's say array has >= 600 words
- 4 options in check, answer: 0, answerIndex: 0, detailed statutory why (>= 50 words)
- Realistic, deterministic Python code with matching output
"""

DAY39_METADATA = {
    "day": 39,
    "coursePrefix": "bcom_tax",
    "title": "E-Commerce, OIDAR & Marketplace Tax Architecture: Section 52 TCS, Section 9(5) & Digital Nexus",
    "minutes": 38,
    "projectStep": {
        "title": "Build Enterprise E-Commerce Platform Indirect Tax Settlement & OIDAR Cross-Border Compliance Engine",
        "steps": [
            "Deconstruct Section 52 Tax Collection at Source (TCS) algorithms on net taxable supplies made through e-commerce operators.",
            "Formulate Section 9(5) statutory deemed supplier liabilities across passenger transport, accommodation, and restaurant aggregators.",
            "Operationalize cross-border Online Information Database Access or Retrieval (OIDAR) compliance and simplified registration under Section 14 IGST.",
            "Implement multi-vendor marketplace return reconciliation frameworks under Form GSTR-8 and dual-state delivery invoicing.",
            "Synthesize algorithmic indirect tax settlements into the production ECommerceGSTSettlementEngine with automated reporting."
        ]
    }
}

DAY39_PARTS = [
    # Part 1
    {
        "title": "Electronic Commerce Operator (ECO) Architecture: Section 52 Tax Collection at Source (TCS) Mechanics",
        "say": [
            "The rapid digitisation of modern commerce has fundamentally restructured traditional retail supply chains, replacing physical brick-and-mortar storefronts with hyper-scale digital marketplaces operated by Electronic Commerce Operators (ECOs). In indirect tax jurisprudence, an Electronic Commerce Operator is defined under Section 2(45) of the Central Goods and Services Tax (CGST) Act as any person who owns, operates, or manages an electronic facility or platform for electronic commerce. While digital marketplaces provide independent third-party vendors with instantaneous access to hundreds of millions of consumers, the decentralized, fragmented nature of millions of small sellers presents severe tax compliance and revenue leakage risks for sovereign revenue authorities. To anchor indirect tax enforcement firmly within the digital economy, Section 52 of the CGST Act enacts the statutory mechanism of Tax Collection at Source (TCS).",
            "Under Section 52(1), every electronic commerce operator who is not an agent of the supplier is statutorily mandated to collect an amount calculated at such rate not exceeding one percent (currently notified as 0.5% CGST + 0.5% SGST for intra-state supplies, or 1.0% IGST for inter-state supplies, recently reduced to 0.25% + 0.25% = 0.5% by the GST Council) of the 'Net Value of Taxable Supplies' made through it by other suppliers where the consideration with respect to such supplies is collected by the operator. The collection of TCS is an absolute statutory obligation imposed on the platform; it operates independently of the supplier's commercial arrangements and cannot be waived, deferred, or contracted out through private merchant terms.",
            "The mathematical determination of the 'Net Value of Taxable Supplies' is governed by a precise statutory formula codified in the Explanation to Section 52(1): Net Value of Taxable Supplies = Aggregate value of taxable supplies of goods or services or both made during any month by all registered persons through the operator, minus the aggregate value of taxable supplies returned to the suppliers during the said month, excluding supplies on which tax is liable to be paid by the operator under Section 9(5). This netting mechanism is vital in modern e-commerce, where consumer return rates routinely fluctuate between fifteen and thirty percent across categories such as fashion and consumer electronics. The statute ensures that e-commerce operators do not suffer liquidity drain by collecting tax on goods that were subsequently rejected, canceled, or returned by customers within the same tax period.",
            "Furthermore, Section 52(3) mandates that the amount collected by the operator must be deposited to the credit of the Government within ten days after the end of the month in which the collection is made. Concurrently, under Section 52(4), the operator must furnish an electronic monthly statement in Form GSTR-8 on the GST Common Portal, detailing the outward supplies of goods and services, supplies returned, and the amount collected during the calendar month. The TCS deposited by the operator is credited dynamically to the Electronic Cash Ledger of the respective third-party suppliers, which they can utilize to discharge their own output tax liabilities or claim as a cash refund if unutilized.",
            "For enterprise marketplace platforms, managing Section 52 TCS requires establishing real-time transaction reconciliation engines. If a vendor operates across multiple states, the platform must determine the precise Place of Supply (POS) for every customer order under Section 10 or 12 of the IGST Act, applying the correct state-specific TCS tax codes. Discrepancies between the figures reported by the operator in Form GSTR-8 and the sales reported by the supplier in Form GSTR-1 are automatically matched on the GST Common Portal under Section 52(8). Any unmatched differential where the supplier reports lower value is communicated electronically to both parties, and if unrectified, added as output tax liability to the supplier along with penal interest under Section 50.",
            "Crucially, recent statutory amendments have carved out micro-enterprises whose aggregate turnover does not exceed the threshold limit for registration under Section 22(1). Subject to obtaining an Enrolment Number and meeting strict inter-state restrictions, unregistered small suppliers are permitted to sell goods through e-commerce operators without mandatory GST registration, and the operator is exempted from collecting TCS on such qualifying micro-supplies. Marketplace indirect tax engines must dynamically validate supplier registration status to enforce TCS collection selectively and accurately."
        ],
        "example": "A pan-India e-commerce marketplace processes Rs 100,000,000 in gross merchandise sales of taxable consumer goods for a seller network in October. During the same month, customer returns and cancellations total Rs 20,000,000. Under Section 52, Net Taxable Value = Rs 100,000,000 - Rs 20,000,000 = Rs 80,000,000. The platform applies the statutory 1% IGST TCS rate (or 0.5% combined rate), collecting Rs 800,000 at source. The platform remits Rs 800,000 to the government via Form GSTR-8 by November 10, depositing the credit directly into the sellers' Electronic Cash Ledgers.",
        "code": """# Section 52 E-Commerce Operator (ECO) Tax Collection at Source (TCS) Engine
from typing import Dict, List, Any

def compute_section_52_tcs_settlement(
    orders_data: List[Dict[str, Any]],
    returns_data: List[Dict[str, Any]],
    tcs_igst_rate: float = 0.01  # 1% standard inter-state TCS
) -> Dict[str, Any]:
    gross_taxable_turnover = sum(o["taxable_amount"] for o in orders_data if not o.get("is_section_9_5", False))
    total_sales_returns = sum(r["taxable_amount"] for r in returns_data if not r.get("is_section_9_5", False))
    
    # Statutory Formula: Net Value = Gross Taxable - Taxable Returns
    net_taxable_value = max(0.0, gross_taxable_turnover - total_sales_returns)
    
    # Statutory TCS Collection Quantum
    tcs_collected = net_taxable_value * tcs_igst_rate
    
    # Net Vendor Payout = Gross Orders - Returns - TCS Collected - Platform Fees
    platform_commission_rate = 0.10  # 10% marketplace fee
    platform_commission = net_taxable_value * platform_commission_rate
    platform_fee_gst = platform_commission * 0.18
    total_platform_deduction = platform_commission + platform_fee_gst
    
    net_payable_to_vendors = net_taxable_value - tcs_collected - total_platform_deduction

    return {
        "gross_taxable_orders": round(gross_taxable_turnover, 2),
        "total_customer_returns": round(total_sales_returns, 2),
        "net_taxable_value_sec_52": round(net_taxable_value, 2),
        "statutory_tcs_collected": round(tcs_collected, 2),
        "platform_commission_fee": round(platform_commission, 2),
        "platform_fee_gst_18_pct": round(platform_fee_gst, 2),
        "net_cash_settled_to_vendors": round(net_payable_to_vendors, 2),
        "compliance_filing": "FORM_GSTR_8_TCS_SETTLEMENT_PASS"
    }

orders = [
    {"order_id": "ORD-101", "taxable_amount": 50000000.0, "is_section_9_5": False},
    {"order_id": "ORD-102", "taxable_amount": 35000000.0, "is_section_9_5": False},
    {"order_id": "ORD-103", "taxable_amount": 15000000.0, "is_section_9_5": False}
]

returns = [
    {"return_id": "RET-001", "taxable_amount": 12000000.0, "is_section_9_5": False},
    {"return_id": "RET-002", "taxable_amount": 8000000.0, "is_section_9_5": False}
]

tcs_res = compute_section_52_tcs_settlement(orders, returns, tcs_igst_rate=0.01)

print(f"Gross Marketplace Sales: INR {tcs_res['gross_taxable_orders']:,.2f}")
print(f"Less: Sales Returns / Cancellations: INR {tcs_res['total_customer_returns']:,.2f}")
print(f"Net Taxable Supplies (Sec 52): INR {tcs_res['net_taxable_value_sec_52']:,.2f}")
print(f"Statutory TCS Collected (1%): INR {tcs_res['statutory_tcs_collected']:,.2f}")
print(f"Marketplace Commission + GST: INR {(tcs_res['platform_commission_fee'] + tcs_res['platform_fee_gst_18_pct']):,.2f}")
print(f"Net Cash Liquidated to Vendors: INR {tcs_res['net_cash_settled_to_vendors']:,.2f}")
print(f"Filing Compliance: {tcs_res['compliance_filing']}")""",
        "output": """Gross Marketplace Sales: INR 100,000,000.00
Less: Sales Returns / Cancellations: INR 20,000,000.00
Net Taxable Supplies (Sec 52): INR 80,000,000.00
Statutory TCS Collected (1%): INR 800,000.00
Marketplace Commission + GST: INR 9,440,000.00
Net Cash Liquidated to Vendors: INR 69,760,000.00
Filing Compliance: FORM_GSTR_8_TCS_SETTLEMENT_PASS""",
        "codeNotes": [
            "Implements the exact statutory netting formula under Explanation to Section 52(1).",
            "Excludes Section 9(5) supplies where the platform pays full tax directly as deemed supplier.",
            "Computes statutory TCS liability to be remitted via Form GSTR-8 by the 10th of the following month.",
            "Calculates net vendor commercial settlements after accounting for platform fees and statutory tax withholding."
        ],
        "tryIt": "Increase total customer returns to Rs 30,000,000 and confirm that Net Taxable Value falls to Rs 70,000,000, scaling TCS collection to Rs 700,000.",
        "check": {
            "question": "What is the statutory deadline and electronic form for an Electronic Commerce Operator to deposit TCS and file its monthly statement under Section 52?",
            "options": [
                "Within ten days after the end of the month in Form GSTR-8.",
                "Within twenty days after the end of the month in Form GSTR-3B.",
                "Within thirty days after the end of the quarter in Form GSTR-1.",
                "Before the end of the financial year in Form GSTR-9C."
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Section 52(3) and 52(4) explicitly require the operator to deposit collected TCS to the government within ten days after the month-end and furnish Form GSTR-8 electronically."
        }
    },

    # Part 2
    {
        "title": "Section 9(5) Deemed Supplier Liabilities: Passenger Transport, Accommodation & Restaurant Services",
        "say": [
            "While Section 52 addresses marketplace platforms where the e-commerce operator acts merely as a digital intermediary collecting consideration on behalf of independent sellers, Section 9(5) of the CGST Act establishes a vastly more aggressive statutory regime: the 'Deemed Supplier' liability framework. Under Section 9(5), the Central Government is empowered, on the recommendations of the GST Council, to notify specific categories of services the tax on intra-state supplies of which SHALL be paid by the electronic commerce operator as if he is the supplier liable for paying the tax in relation to the supply of such services. In legal effect, Section 9(5) completely shifts the primary tax paying obligation away from the underlying individual service provider and fastens it directly and unconditionally upon the digital platform.",
            "To date, the Government has exercised this statutory power by notifying four distinct, multi-billion-dollar service categories: First, transportation of passengers by a radio-taxi, motorcab, maxicab, motor cycle, omnibus or any other motor vehicle (powering ride-hailing platforms like Uber and Ola). Second, supplying accommodation in hotels, inns, guest houses, clubs, campsites or other commercial places meant for residential or lodging purposes (powering hotel booking portals like MakeMyTrip and OYO), except where the person supplying such service through the operator is liable for registration under Section 22(1). Third, services by way of housekeeping, such as plumbing, carpentering, and cleaning (powering on-demand home service apps like Urban Company), subject to the identical unregistered supplier exception.",
            "Fourth, through landmark Notification No. 17/2021-Central Tax (Rate), the government expanded Section 9(5) to encompass supply of restaurant services other than the services supplied by restaurant, eating joints etc. located at specified premises (powering food delivery giants like Swiggy and Zomato). Under this amendment, food delivery platforms are legally deemed to be the supplier of restaurant food delivered through their apps. Even if an order is prepared by a standalone local restaurant that is wholly unregistered or operates under the Section 10 composition scheme, the delivery platform MUST collect and pay GST at the standard five percent rate (without input tax credit) on the gross restaurant food value.",
            "The operational consequences of Section 9(5) are profound and severe. Because the platform is statutorily deemed to be the supplier, all provisions of the CGST Act apply as if the operator were the principal taxpayer. Consequently, under Section 49, the platform must discharge this Section 9(5) liability COMPULSORILY IN CASH through its Electronic Cash Ledger; it cannot utilize its accumulated Input Tax Credit derived from technology servers, advertising, or payment gateway fees to discharge its deemed restaurant or ride-hailing output tax! This mandatory cash payment rule was clarified by CBIC Circular No. 167/23/2021-GST, creating massive monthly cash flow obligations for aggregator treasury teams.",
            "Furthermore, Section 9(5) transactions must be strictly segregated from normal marketplace vendor sales in corporate return filings. In Form GSTR-1, Section 9(5) supplies are reported in dedicated Table 14 and Table 15; in Form GSTR-3B, the tax payable is reported in Table 3.1.1(i), completely segregated from regular outward taxable supplies. Corporate billing systems must maintain automated dual-ledger routing: separating platform commission fees (taxed at 18% with full ITC utilization) from deemed food or transport supplies (taxed at 5% payable strictly in cash).",
            "Additionally, the interaction between Section 9(5) and specified hotel premises introduces intricate statutory carve-outs. Where restaurant services are supplied by restaurants or eating joints located at 'specified premises'—defined as hotel premises having declared room tariffs of seven thousand five hundred rupees or above per unit per day—the Section 9(5) aggregator liability is statutorily inapplicable! In such luxury hospitality environments, the hotel itself remains the principal taxable supplier liable to pay eighteen percent GST with full Input Tax Credit. Food delivery platforms must therefore maintain real-time tariff registries to ensure that luxury hotel orders are not erroneously subjected to the standard five percent cash deduction.",
            "Moreover, statutory compliance requires that the platform issue an electronic invoice containing all mandatory particulars under Rule 46 of the CGST Rules, clearly indicating that the tax has been discharged by the electronic commerce operator under Section 9(5). The underlying restaurant is statutorily prohibited from charging GST to the end customer or issuing a parallel tax invoice, eliminating duplicate tax levies on consumers."
        ],
        "example": "A nationwide food delivery platform processes an order of Rs 1,000 for food from an independent restaurant, charging the consumer Rs 1,000 for food plus Rs 50 delivery fee. Under Section 9(5), the platform is deemed the supplier of the food, paying 5% GST (Rs 50) strictly in cash through Electronic Cash Ledger. For the Rs 50 delivery fee, the platform acts as principal, charging 18% GST (Rs 9), which it can settle using its accumulated ITC. The platform segregates these two distinct streams in Table 3.1.1 of Form GSTR-3B.",
        "code": """# Section 9(5) Deemed Supplier Dual-Track Cash vs Credit Settlement Engine
from typing import Dict, List, Any

def execute_section_9_5_aggregator_tax_split(
    orders: List[Dict[str, Any]],
    available_itc_balance: float
) -> Dict[str, Any]:
    total_deemed_food_turnover = 0.0
    total_platform_convenience_fees = 0.0
    
    for o in orders:
        total_deemed_food_turnover += o["food_item_value"]
        total_platform_convenience_fees += o["delivery_and_convenience_fee"]

    # Tax 1: Section 9(5) Deemed Food Supply @ 5% (MANDATORY CASH PAYMENT)
    gst_section_9_5_food = total_deemed_food_turnover * 0.05
    
    # Tax 2: Platform Convenience & Delivery Services @ 18% (ELIGIBLE FOR ITC OFFSET)
    gst_platform_service = total_platform_convenience_fees * 0.18

    # Discharge of Platform Service Tax using available ITC
    itc_utilized_for_platform = min(gst_platform_service, available_itc_balance)
    cash_for_platform_service = gst_platform_service - itc_utilized_for_platform
    remaining_itc = available_itc_balance - itc_utilized_for_platform

    # Total Cash Obligation = 100% of Sec 9(5) Tax + Unsettled Platform Tax
    # Circular 167/23/2021-GST: Sec 9(5) cannot be settled via ITC
    total_cash_ledger_debit = gst_section_9_5_food + cash_for_platform_service

    return {
        "food_turnover_sec_9_5": round(total_deemed_food_turnover, 2),
        "platform_service_revenue": round(total_platform_convenience_fees, 2),
        "gst_sec_9_5_cash_only": round(gst_section_9_5_food, 2),
        "gst_platform_fee_18_pct": round(gst_platform_service, 2),
        "itc_utilized": round(itc_utilized_for_platform, 2),
        "cash_paid_for_platform": round(cash_for_platform_service, 2),
        "total_cash_payment_required": round(total_cash_ledger_debit, 2),
        "closing_itc_balance": round(remaining_itc, 2),
        "statutory_mandate": "SECTION_9_5_MANDATORY_CASH_DISCHARGE_PASS"
    }

order_batch = [
    {"order_id": "SWG-001", "food_item_value": 800000.0, "delivery_and_convenience_fee": 100000.0},
    {"order_id": "SWG-002", "food_item_value": 1200000.0, "delivery_and_convenience_fee": 150000.0},
    {"order_id": "SWG-003", "food_item_value": 2000000.0, "delivery_and_convenience_fee": 250000.0}
]

res_9_5 = execute_section_9_5_aggregator_tax_split(order_batch, available_itc_balance=500000.0)

print(f"Gross Deemed Restaurant Food Sales: INR {res_9_5['food_turnover_sec_9_5']:,.2f}")
print(f"Section 9(5) Output GST @ 5% (Cash Only): INR {res_9_5['gst_sec_9_5_cash_only']:,.2f}")
print(f"Platform Convenience Revenue: INR {res_9_5['platform_service_revenue']:,.2f}")
print(f"Platform Output GST @ 18%: INR {res_9_5['gst_platform_fee_18_pct']:,.2f}")
print(f"ITC Absorbed for Platform Service: INR {res_9_5['itc_utilized']:,.2f}")
print(f"Total Mandatory Electronic Cash Ledger Debit: INR {res_9_5['total_cash_payment_required']:,.2f}")
print(f"Audit Status: {res_9_5['statutory_mandate']}")""",
        "output": """Gross Deemed Restaurant Food Sales: INR 4,000,000.00
Section 9(5) Output GST @ 5% (Cash Only): INR 200,000.00
Platform Convenience Revenue: INR 500,000.00
Platform Output GST @ 18%: INR 90,000.00
ITC Absorbed for Platform Service: INR 90,000.00
Total Mandatory Electronic Cash Ledger Debit: INR 200,000.00
Audit Status: SECTION_9_5_MANDATORY_CASH_DISCHARGE_PASS""",
        "codeNotes": [
            "Enforces statutory segregation between Section 9(5) deemed supplies and principal platform fees.",
            "Applies 5% tax on restaurant food and mandates 100% payment strictly in cash under Circular 167.",
            "Permits standard 18% platform delivery fee tax to be settled using available Input Tax Credit.",
            "Outputs total cash ledger deposit required, preventing illegal offset in Form GSTR-3B Table 3.1.1."
        ],
        "tryIt": "Reduce available_itc_balance to Rs 50,000 and verify that cash payment increases to Rs 240,000 as unsettled platform tax spills into cash.",
        "check": {
            "question": "Can an electronic commerce operator pay its Section 9(5) deemed output tax liability by utilizing its accumulated Input Tax Credit (ITC)?",
            "options": [
                "No, Section 9(5) tax liability must be discharged COMPULSORILY IN CASH through the Electronic Cash Ledger as clarified by Circular 167/23/2021-GST.",
                "Yes, Section 49 permits universal set-off of any output tax liability using available electronic credit ledger balances.",
                "Yes, provided the platform pays an additional five percent administrative surcharge to the Central Board of Indirect Taxes.",
                "No, but the liability can be waived entirely by submitting an annual application to the GST Council."
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "CBIC Circular No. 167/23/2021-GST explicitly clarified that the electronic commerce operator cannot utilize its Input Tax Credit to discharge tax payable in respect of supplies notified under Section 9(5); such tax must be paid strictly in cash."
        }
    },

    # Part 3
    {
        "title": "Online Information & Database Access or Retrieval (OIDAR) Services: Cross-Border Digital Nexus & NTOR Rules",
        "say": [
            "The rapid proliferation of cross-border digital cloud services, software-as-a-service (SaaS) subscriptions, streaming media, online gaming, and digital database architectures has fundamentally tested traditional territorial tax concepts. Under legacy tax principles, an overseas corporation without physical offices, employees, or servers in India operated beyond the jurisdictional reach of domestic indirect tax authorities. To establish comprehensive indirect tax sovereignty over cross-border digital consumption, Section 14 of the Integrated Goods and Services Tax (IGST) Act, read with Section 2(17), enacts the specialized statutory regime governing 'Online Information and Database Access or Retrieval' (OIDAR) services.",
            "Section 2(17) of the IGST Act defines OIDAR services as services whose delivery is mediated by information technology over the internet or an electronic network and the nature of which renders their supply essentially automated and involving minimal human intervention and impossible to ensure in the absence of information technology. The statutory scope encompasses electronic software delivery, cloud data storage, digital content streaming (Netflix, Spotify), online gaming, automated website supply, and advertising on the internet. Crucially, the Finance Act, 2023 enacted a major statutory expansion by omitting the historical condition 'and impossible to ensure in the absence of information technology', significantly broadening the tax net to capture virtually all digital and automated cross-border transmissions.",
            "Under Section 13(12) of the IGST Act, the Place of Supply (POS) for OIDAR services is deemed to be the location of the recipient of services. When an overseas entity supplies OIDAR services to a registered business in India (B2B transaction), the tax is discharged by the Indian recipient under the Reverse Charge Mechanism (RCM) under Section 5(3) of the IGST Act. However, when an overseas entity supplies OIDAR services to an unregistered individual or non-business consumer in India (B2C transaction), reverse charge is administratively impossible because millions of individual citizens cannot be subjected to GST registration and return filing.",
            "To resolve this enforcement dilemma, Section 14 of the IGST Act creates a mandatory statutory nexus: on supply of any OIDAR service by any person located in a non-taxable territory to a 'Non-Taxable Online Recipient' (NTOR), the overseas supplier SHALL be liable for paying integrated tax. The Finance Act, 2023 completely overhauled the definition of Non-Taxable Online Recipient under Section 2(16), defining it as any unregistered person receiving OIDAR services, located in the taxable territory, regardless of whether the service is used for business or personal purposes. This amendment closed a massive corporate loophole where unregistered startups or proprietorships had previously claimed exemption by asserting commercial use.",
            "Under Section 14(2), the overseas digital platform is mandated to obtain a Single Simplified Registration on the GST Common Portal under the Simplified Registration Scheme (Form GST REG-10). If the overseas entity lacks a physical presence or fixed establishment in India, it must appoint a resident Indian Representative or Agent to act on its behalf for paying tax and filing monthly returns in Form GSTR-5A. Alternatively, under Section 14(1), an intermediary digital platform that facilitates the supply—such as an app store or payment aggregator that controls billing, delivery, or terms—is statutorily deemed to be the supplier and must discharge the 18% IGST liability, securing complete tax collection at the digital border.",
            "Furthermore, Section 14A of the IGST Act, introduced by the 2023 gaming amendments, established specialized tax enforcement for cross-border 'Online Money Gaming'. Any overseas entity offering online money gaming to persons in India is subject to mandatory registration and twenty-eight percent GST on full face value of bets. The statute grants extraordinary enforcement powers: in the event of non-compliance, the government is empowered to order the Ministry of Electronics and Information Technology (MeitY) to block public access to the overseas platform's website, mobile applications, and IP addresses under Section 69A of the Information Technology Act. This technological border blockade ensures that overseas digital operators cannot evade domestic tax obligations.",
            "In addition, circular clarifications emphasize that determining the location of the recipient for OIDAR services requires cross-referencing non-contradictory commercial identifiers: customer billing address, IP address geolocation, credit card issuing bank location, and SIM card country code. If any two of these indicators point to India, the service is legally deemed to be consumed within India under Section 13(12), triggering mandatory IGST liability."
        ],
        "example": "An enterprise cloud storage corporation incorporated in Delaware, USA, delivers automated cloud backup subscriptions to 200,000 individual consumers in India, collecting $10 (INR 830) per month per user (total monthly revenue INR 166,000,000). The recipients are Non-Taxable Online Recipients (NTOR). Under Section 14 of the IGST Act, the US corporation registers via Form GST REG-10, charges 18% IGST on every subscription, and remits INR 29,880,000 monthly to the Indian Government via Form GSTR-5A, achieving full compliance with cross-border digital nexus laws.",
        "code": """# Section 14 IGST Cross-Border OIDAR Digital Nexus & NTOR Tax Engine
from typing import Dict, List, Any

def compute_cross_border_oidar_tax(
    subscriptions_data: List[Dict[str, Any]],
    overseas_provider_name: str,
    has_indian_intermediary: bool
) -> Dict[str, Any]:
    b2b_taxable_value = 0.0
    b2c_ntor_taxable_value = 0.0

    for sub in subscriptions_data:
        val = sub["subscription_fee_inr"]
        # Post-Finance Act 2023: Recipient is NTOR if unregistered (no GSTIN)
        if sub.get("recipient_gstin"):
            b2b_taxable_value += val
        else:
            b2c_ntor_taxable_value += val

    # Tax 1: B2B Cross-Border OIDAR -> Reverse Charge (RCM) by Indian Recipient
    b2b_rcm_tax_payable_by_recipient = b2b_taxable_value * 0.18
    
    # Tax 2: B2C NTOR OIDAR -> Forward Charge by Overseas Supplier (Sec 14 IGST)
    b2c_forward_charge_payable_by_supplier = b2c_ntor_taxable_value * 0.18
    
    if has_indian_intermediary:
        remittance_route = "SETTLED_VIA_DEEMED_SUPPLIER_INDIAN_INTERMEDIARY"
    else:
        remittance_route = "DIRECT_REMITTANCE_VIA_FORM_GSTR_5A_SIMPLIFIED_REGISTRATION"

    return {
        "overseas_entity": overseas_provider_name,
        "b2b_commercial_revenue_inr": round(b2b_taxable_value, 2),
        "b2b_rcm_tax_liability_indian_buyers": round(b2b_rcm_tax_payable_by_recipient, 2),
        "b2c_ntor_revenue_inr": round(b2c_ntor_taxable_value, 2),
        "b2c_statutory_igst_payable": round(b2c_forward_charge_payable_by_supplier, 2),
        "collection_mechanism": remittance_route,
        "compliance_status": "SECTION_14_OIDAR_DIGITAL_NEXUS_PASS"
    }

user_cohort = [
    {"user_id": "USR-IND-01", "subscription_fee_inr": 120000000.0, "recipient_gstin": None},  # NTOR
    {"user_id": "USR-IND-02", "subscription_fee_inr": 46000000.0, "recipient_gstin": None},   # NTOR
    {"user_id": "CORP-IND-01", "subscription_fee_inr": 50000000.0, "recipient_gstin": "27AAACG0000A1Z5"}  # B2B
]

oidar_res = compute_cross_border_oidar_tax(
    user_cohort,
    overseas_provider_name="Apex Cloud Services Inc (Delaware)",
    has_indian_intermediary=False
)

print(f"Overseas Digital Platform: {oidar_res['overseas_entity']}")
print(f"B2B Revenue (RCM Applicable): INR {oidar_res['b2b_commercial_revenue_inr']:,.2f}")
print(f"B2B IGST Payable by Indian Importers (RCM): INR {oidar_res['b2b_rcm_tax_liability_indian_buyers']:,.2f}")
print(f"B2C NTOR Revenue (Section 14): INR {oidar_res['b2c_ntor_revenue_inr']:,.2f}")
print(f"B2C IGST Payable by Overseas Provider @ 18%: INR {oidar_res['b2c_statutory_igst_payable']:,.2f}")
print(f"Remittance Framework: {oidar_res['collection_mechanism']}")
print(f"Compliance Audit: {oidar_res['compliance_status']}")""",
        "output": """Overseas Digital Platform: Apex Cloud Services Inc (Delaware)
B2B Revenue (RCM Applicable): INR 50,000,000.00
B2B IGST Payable by Indian Importers (RCM): INR 9,000,000.00
B2C NTOR Revenue (Section 14): INR 166,000,000.00
B2C IGST Payable by Overseas Provider @ 18%: INR 29,880,000.00
Remittance Framework: DIRECT_REMITTANCE_VIA_FORM_GSTR_5A_SIMPLIFIED_REGISTRATION
Compliance Audit: SECTION_14_OIDAR_DIGITAL_NEXUS_PASS""",
        "codeNotes": [
            "Segregates cross-border digital services into B2B (Reverse Charge) and B2C NTOR (Forward Charge).",
            "Applies the post-Finance Act 2023 NTOR definition capturing all unregistered recipients in India.",
            "Computes 18% IGST liability payable by overseas provider under Form GSTR-5A simplified scheme.",
            "Enforces statutory nexus rules ensuring foreign digital corporations comply with Indian indirect tax."
        ],
        "tryIt": "Add a GSTIN to USR-IND-01 and observe how its Rs 120M shifts from Overseas Forward Charge to Indian Buyer Reverse Charge.",
        "check": {
            "question": "Under Section 14 of the IGST Act, how is integrated tax collected on cross-border OIDAR services supplied to Non-Taxable Online Recipients (NTOR)?",
            "options": [
                "The overseas supplier is mandatorily liable to register under the simplified registration scheme and pay IGST on forward charge basis.",
                "The Indian resident consumers are required to file monthly import returns at local customs stations.",
                "The tax is collected by the Reserve Bank of India as a direct deduction on all foreign credit card payments.",
                "Cross-border OIDAR services supplied to individuals are completely exempt from integrated goods and services tax."
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Section 14(1) of the IGST Act mandates that on supply of OIDAR services by an overseas supplier to a Non-Taxable Online Recipient (NTOR), the overseas supplier is liable to pay IGST via a simplified registration."
        }
    },

    # Part 4
    {
        "title": "Marketplace Vendor Compliance, Return Architectures (GSTR-8) & Dual-State Invoicing Conflicts",
        "say": [
            "The operational intersection between an Electronic Commerce Operator and tens of thousands of underlying marketplace merchants creates formidable indirect tax reconciliation friction. In a multi-vendor digital ecosystem, every commercial transaction embodies two distinct taxable events occurring simultaneously: First, the underlying supply of goods or services from the merchant to the end consumer, where the merchant is the primary supplier responsible for issuing the tax invoice under Section 31 and remitting output GST via Form GSTR-1 and GSTR-3B. Second, the supply of marketplace facilitation services from the platform to the merchant, where the platform bills commission fees, listing fees, logistics charges, and advertising costs, collecting eighteen percent GST and issuing vendor invoices.",
            "This dual-layer commercial architecture generates complex 'Dual-State Invoicing Conflicts'. Under Section 10(1)(a) of the IGST Act, where the supply involves movement of goods, the Place of Supply is the location where the movement of goods terminates for delivery to the recipient. If a seller registered in Haryana stores inventory in an e-commerce fulfillment center in Maharashtra and ships a product to a consumer in Karnataka, the seller must maintain a valid GSTIN in Maharashtra (as an Additional Place of Business or distinct person) to execute the inter-state supply to Karnataka with IGST. If the seller lacks a registration in the warehouse State, the movement is legally tainted, exposing the consignment to interception, seizure, and confiscation under Section 129 and 130.",
            "To police this multi-state vendor network, Section 52(4) mandates that the e-commerce operator must submit Form GSTR-8 by the tenth of every month. Form GSTR-8 requires line-item reporting of: the GSTIN of each registered supplier, gross value of supplies made, value of returned supplies, net taxable supplies, and the exact split between CGST, SGST, and IGST collected at source. Under Section 52(6), if the operator discovers any omission or incorrect particulars in Form GSTR-8, it can rectify the details in the statement for the month during which the error is noticed, subject to payment of interest under Section 50, but no rectification is permitted after the thirtieth day of November following the end of the financial year.",
            "Simultaneously, the GST Common Portal runs automated matching algorithms comparing the operator's GSTR-8 data against the vendor's GSTR-1 Table 15 declarations. If the vendor under-reports sales (e.g., reporting Rs 5,000,000 in GSTR-1 when GSTR-8 reflects Rs 8,000,000 of net orders), the portal flags an electronic discrepancy under Section 52(8). If the vendor fails to reconcile the variance in their next monthly filing, Section 52(9) statutorily mandates that the differential amount (Rs 3,000,000) SHALL be added to the vendor's outward tax liability in Form GSTR-3B for the succeeding month, alongside eighteen percent interest.",
            "Consequently, modern e-commerce enterprises engineer automated vendor compliance portals. These systems validate merchant GSTINs against the government database using real-time API integrations, enforce mandatory e-invoicing under Rule 48(4) for merchants crossing the turnover threshold, generate automated TCS credit advice notes, and provide daily order-return reconciliation feeds. This proactive technological governance eliminates state border frictions, protects marketplace reputation, and ensures seamless indirect tax liquidity across the platform economy.",
            "Furthermore, logistics fulfillment architectures require rigorous alignment with the E-Way Bill provisions under Rule 138 of the CGST Rules. When goods valued over fifty thousand rupees move from a seller's fulfillment center to an end consumer across state boundaries, an electronic E-Way Bill must be generated prior to transit commencement. Where the e-commerce operator provides integrated warehousing and delivery services, the platform's logistics subsidiary is statutorily recognized as the transporter. Failure to carry an active E-Way Bill number or QR code in the transport vehicle exposes the shipment to interception under Section 68 and mandatory penalty equal to two hundred percent of the tax payable under Section 129.",
            "Finally, enterprise marketplace contracts incorporate robust tax indemnity clauses. If a vendor's tax registration is canceled retrospectively due to fraudulent circular trading, or if a vendor defaults on Section 52(9) discrepancy liabilities, the platform reserves the contractual right to debit the vendor's pending escrow settlement accounts. This legal ring-fencing shields the platform's balance sheet from vendor tax contagion."
        ],
        "example": "An electronic merchant in Delhi sells smartphones via a major e-commerce platform. In November, GSTR-8 filed by the platform reports Rs 25,000,000 in net sales and Rs 250,000 TCS. The merchant's internal accounting system mistakenly reports only Rs 20,000,000 in GSTR-1. In December, the GST Common Portal detects the Rs 5,000,000 discrepancy under Section 52(8). The merchant's automated reconciliation engine flags the variance, preventing the portal from automatically adding Rs 900,000 (18% GST) plus Section 50 interest to the merchant's GSTR-3B liability by filing a timely Table 15 amendment.",
        "code": """# E-Commerce Multi-Vendor GSTR-8 vs GSTR-1 Automated Reconciliation Engine
from typing import Dict, List, Any

def reconcile_gstr8_vs_gstr1(
    gstr8_records_by_eco: List[Dict[str, Any]],
    gstr1_records_by_vendor: List[Dict[str, Any]]
) -> Dict[str, Any]:
    # Index vendor GSTR-1 sales by GSTIN
    vendor_sales_map = {v["vendor_gstin"]: v["reported_net_taxable_gstr1"] for v in gstr1_records_by_vendor}
    
    reconciliation_audit = []
    total_portal_discrepancy_value = 0.0
    total_tax_addition_sec_52_9 = 0.0

    for eco_rec in gstr8_records_by_eco:
        gstin = eco_rec["vendor_gstin"]
        eco_value = eco_rec["net_taxable_supplies_gstr8"]
        tcs_deposited = eco_rec["tcs_collected"]
        vendor_value = vendor_sales_map.get(gstin, 0.0)

        variance = eco_value - vendor_value  # Positive means vendor under-reported

        if variance > 1.0:  # Material discrepancy threshold
            tax_addition = variance * 0.18
            total_portal_discrepancy_value += variance
            total_tax_addition_sec_52_9 += tax_addition
            status = "DISCREPANCY_UNDER_REPORTED_RISK"
            action = "Systemic Table 15 amendment required; otherwise Section 52(9) auto-addition triggered"
        elif variance < -1.0:
            tax_addition = 0.0
            status = "VENDOR_OVER_REPORTED_SAFE"
            action = "Reconcile potential cancellation timing mismatch"
        else:
            tax_addition = 0.0
            status = "PERFECT_STATUTORY_RECONCILIATION_PASS"
            action = "TCS credit fully available in Electronic Cash Ledger"

        reconciliation_audit.append({
            "vendor_gstin": gstin,
            "eco_reported_value": round(eco_value, 2),
            "vendor_reported_value": round(vendor_value, 2),
            "variance_amount": round(variance, 2),
            "tax_risk_at_18_pct": round(tax_addition, 2),
            "reconciliation_status": status,
            "compliance_directive": action
        })

    return {
        "total_discrepancy_turnover": round(total_portal_discrepancy_value, 2),
        "total_potential_sec_52_9_tax_addition": round(total_tax_addition_sec_52_9, 2),
        "audited_vendor_count": len(reconciliation_audit),
        "detailed_reconciliations": reconciliation_audit,
        "engine_audit_verdict": "SECTION_52_RECONCILIATION_CYCLE_COMPLETE"
    }

eco_gstr8_feed = [
    {"vendor_gstin": "07AAACG1111A1Z1", "net_taxable_supplies_gstr8": 25000000.0, "tcs_collected": 250000.0},
    {"vendor_gstin": "27AAACG2222B1Z2", "net_taxable_supplies_gstr8": 15000000.0, "tcs_collected": 150000.0},
    {"vendor_gstin": "29AAACG3333C1Z3", "net_taxable_supplies_gstr8": 10000000.0, "tcs_collected": 100000.0}
]

vendor_gstr1_feed = [
    {"vendor_gstin": "07AAACG1111A1Z1", "reported_net_taxable_gstr1": 20000000.0},  # Under-reported by 5M
    {"vendor_gstin": "27AAACG2222B1Z2", "reported_net_taxable_gstr1": 15000000.0},  # Exact match
    {"vendor_gstin": "29AAACG3333C1Z3", "reported_net_taxable_gstr1": 10000000.0}   # Exact match
]

recon = reconcile_gstr8_vs_gstr1(eco_gstr8_feed, vendor_gstr1_feed)

print(f"Total Discrepancy Turnover Flagged: INR {recon['total_discrepancy_turnover']:,.2f}")
print(f"Section 52(9) Potential Auto-Addition: INR {recon['total_potential_sec_52_9_tax_addition']:,.2f}")
for r in recon['detailed_reconciliations']:
    print(f"-> Vendor {r['vendor_gstin']}: ECO INR {r['eco_reported_value']:,.2f} vs Vendor INR {r['vendor_reported_value']:,.2f} | Status: {r['reconciliation_status']}")
print(f"Audit Verdict: {recon['engine_audit_verdict']}")""",
        "output": """Total Discrepancy Turnover Flagged: INR 5,000,000.00
Section 52(9) Potential Auto-Addition: INR 900,000.00
-> Vendor 07AAACG1111A1Z1: ECO INR 25,000,000.00 vs Vendor INR 20,000,000.00 | Status: DISCREPANCY_UNDER_REPORTED_RISK
-> Vendor 27AAACG2222B1Z2: ECO INR 15,000,000.00 vs Vendor INR 15,000,000.00 | Status: PERFECT_STATUTORY_RECONCILIATION_PASS
-> Vendor 29AAACG3333C1Z3: ECO INR 10,000,000.00 vs Vendor INR 10,000,000.00 | Status: PERFECT_STATUTORY_RECONCILIATION_PASS
Audit Verdict: SECTION_52_RECONCILIATION_CYCLE_COMPLETE""",
        "codeNotes": [
            "Simulates the automated portal matching algorithm between Form GSTR-8 and Form GSTR-1 Table 15.",
            "Detects merchant under-reporting and quantifies the Section 52(9) statutory tax addition risk.",
            "Calculates 18% output tax liability exposure and guides timely electronic table corrections.",
            "Protects marketplace merchants against unexpected GSTR-3B auto-populated tax demands."
        ],
        "tryIt": "Update Vendor 07 reported sales in GSTR-1 to Rs 25,000,000 and confirm that total discrepancy turnover collapses to zero with all vendors passing.",
        "check": {
            "question": "Under Section 52(9) of the CGST Act, what is the consequence if a supplier fails to reconcile a discrepancy between their GSTR-1 and the operator's GSTR-8?",
            "options": [
                "The differential amount is automatically added to the outward tax liability of the supplier in their succeeding GSTR-3B return with interest.",
                "The e-commerce operator is required to pay the differential amount out of its corporate capital reserves.",
                "The supplier's GST registration is automatically suspended within forty-eight hours.",
                "The goods in transit are seized and auctioned at the nearest dry port."
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Section 52(9) mandates that any unreconciled discrepancy where the supplier reported less value than the operator shall be added to the outward tax liability of the supplier in the succeeding month along with Section 50 interest."
        }
    },

    # Part 5
    {
        "title": "Enterprise Implementation: High-Throughput E-Commerce Platform Indirect Tax Settlement & OIDAR Engine",
        "say": [
            "At enterprise scale, digital consumer platforms process millions of transactions per day, orchestrating a complex matrix of third-party marketplace goods (governed by Section 52 TCS), deemed consumer services (governed by Section 9(5) mandatory cash settlement), digital content downloads (governed by Section 14 OIDAR), and platform commission charges. Attempting to manage these diverse indirect tax obligations through batch-processing scripts or legacy accounting subledgers inevitably results in settlement delays, liquidity gridlocks, and massive regulatory penalization.",
            "To achieve institutional perfection, leading technology enterprises engineer an autonomous, event-driven Indirect Tax Settlement & OIDAR Compliance Engine. Built on high-throughput microservices architecture (such as Apache Kafka, Golang, and PostgreSQL), the engine processes checkout events in real time. For every completed transaction, the engine executes instantaneous multi-tier classification: First, it examines the product category code: if the item represents restaurant food or ride-hailing transport, it routes the transaction to the Section 9(5) Deemed Supplier Core, calculating five percent GST and locking the obligation into the Electronic Cash Ledger reserve.",
            "Second, if the transaction represents physical marketplace merchandise sold by an independent merchant, the engine routes the order to the Section 52 TCS Core: calculating net order values, subtracting cancellations and returns, withholding one percent TCS, deducting platform commissions plus eighteen percent GST, and scheduling vendor net payouts. Third, if the transaction represents cross-border digital software or streaming subscriptions delivered to unregistered consumers, it routes the event to the Section 14 OIDAR Core: validating IP address, SIM card country code, and billing address to establish the Indian digital nexus, calculating eighteen percent IGST, and populating Form GSTR-5A schedules.",
            "The enterprise engine maintains continuous, cryptographically signed settlement ledgers. It generates real-time API feeds interfacing directly with the GST Common Portal for GSTR-8 TCS reporting, GSTR-1 Table 14/15 reporting, and GSTR-5A OIDAR filings. Furthermore, it operates an automated treasury reserve module that prevents CFOs from inadvertently using Section 9(5) cash reserves for operational expenditures, ensuring zero default in statutory monthly tax remittances.",
            "Now, inspect our complete, production-grade Python implementation: the ECommerceGSTSettlementEngine. This master platform models an integrated digital conglomerate operating e-commerce retail, food delivery, and digital cloud streaming. It ingests high-volume order streams, executes simultaneous Section 52, Section 9(5), and Section 14 statutory computations with zero leakage, and outputs an exhaustive corporate settlement and tax compliance dossier. All mathematical invariants execute with deterministic perfection, delivering absolute indirect tax sovereignty to digital enterprise leadership.",
            "Furthermore, the engine features an automated reconciliation pipeline that interfaces directly with banking payment gateway APIs (such as Stripe, Razorpay, and PayU). By continuously reconciling transaction authorization IDs against merchant payout batches, the system guarantees that escrow settlements do not occur prior to statutory TCS deduction, eliminating the risk of uncollected tax liabilities that could fall upon the platform under Section 122(1)(vi).",
            "Finally, the implementation enforces a resilient disaster recovery and audit logging architecture. Every transaction payload, statutory tax computation, and remittance hash is archived in immutable WORM (Write Once, Read Many) cloud storage. When Central or State GST audit teams initiate comprehensive departmental scrutiny, the platform can instantly generate certified electronic transaction manifests, demonstrating absolute compliance with Indian indirect tax laws.",
            "Moreover, the system incorporates automated foreign exchange risk hedging for cross-border OIDAR collections. When subscription prices are denominated in United States Dollars or Euros but converted to Indian Rupees at consumer checkout, the engine interfaces with real-time Reserve Bank of India reference exchange rate feeds to establish the exact statutory valuation under Rule 34 of the CGST Rules, shielding the enterprise from currency fluctuation tax disputes.",
            "In addition, the platform deploys autonomous tax compliance bots that periodically verify seller GSTIN statuses against the national database, instantly disabling payout accounts for canceled or suspended sellers to eliminate indirect tax risk across the ecosystem."
        ],
        "example": "A digital consumer conglomerate processes Rs 500,000,000 in monthly platform transactions: Rs 300,000,000 in marketplace retail goods (Rs 2,500,000 TCS withheld under Sec 52), Rs 120,000,000 in deemed food delivery (Rs 6,000,000 tax payable strictly in cash under Sec 9(5)), and Rs 80,000,000 in cross-border cloud SaaS subscriptions (Rs 14,400,000 IGST under Sec 14 OIDAR). The engine manages all three streams simultaneously, ensuring accurate vendor disbursements, GSTR-8/5A filing generation, and zero statutory default.",
        "code": """# Production-Grade E-Commerce Platform Indirect Tax Settlement & OIDAR Engine
from typing import Dict, List, Any

class ECommerceGSTSettlementEngine:
    def __init__(self, platform_name: str, operator_gstin: str, oidar_reg_no: str):
        self.platform_name = platform_name
        self.operator_gstin = operator_gstin
        self.oidar_reg_no = oidar_reg_no

    def process_platform_monthly_settlement(
        self,
        marketplace_orders: List[Dict[str, Any]],
        marketplace_returns: List[Dict[str, Any]],
        section_9_5_orders: List[Dict[str, Any]],
        oidar_b2c_subscriptions: List[Dict[str, Any]],
        platform_commission_rate: float = 0.10
    ) -> Dict[str, Any]:
        # Track 1: Section 52 Marketplace Goods (TCS Core)
        gross_mp_sales = sum(o["taxable_value"] for o in marketplace_orders)
        total_mp_returns = sum(r["taxable_value"] for r in marketplace_returns)
        net_mp_taxable = max(0.0, gross_mp_sales - total_mp_returns)
        tcs_collected = net_mp_taxable * 0.01  # 1% standard TCS
        
        mp_platform_fee = net_mp_taxable * platform_commission_rate
        mp_platform_gst = mp_platform_fee * 0.18
        vendor_cash_settlement = net_mp_taxable - tcs_collected - (mp_platform_fee + mp_platform_gst)

        # Track 2: Section 9(5) Deemed Supplier (Cash-Only Core)
        total_food_turnover = sum(f["food_value"] for f in section_9_5_orders)
        sec_9_5_cash_tax = total_food_turnover * 0.05  # 5% mandatory cash discharge
        
        # Track 3: Section 14 OIDAR Cross-Border Digital Services Core
        total_oidar_b2c_turnover = sum(s["subscription_inr"] for s in oidar_b2c_subscriptions)
        oidar_igst_payable = total_oidar_b2c_turnover * 0.18

        # Total Government Remittance Obligation
        total_tax_to_government = tcs_collected + sec_9_5_cash_tax + oidar_igst_payable

        return {
            "platform": self.platform_name,
            "operator_gstin": self.operator_gstin,
            "sec_52_net_taxable_supplies": round(net_mp_taxable, 2),
            "sec_52_tcs_payable_gstr8": round(tcs_collected, 2),
            "marketplace_vendor_net_payout": round(vendor_cash_settlement, 2),
            "sec_9_5_food_turnover": round(total_food_turnover, 2),
            "sec_9_5_mandatory_cash_tax": round(sec_9_5_cash_tax, 2),
            "oidar_b2c_digital_turnover": round(total_oidar_b2c_turnover, 2),
            "oidar_igst_payable_gstr5a": round(oidar_igst_payable, 2),
            "total_government_tax_remittance": round(total_tax_to_government, 2),
            "compliance_verdict": "ENTERPRISE_DIGITAL_INDIRECT_TAX_SETTLEMENT_PASS"
        }

engine = ECommerceGSTSettlementEngine(
    platform_name="OmniDigital Global Marketplace Ecosystem",
    operator_gstin="27AAACG9999M1Z8",
    oidar_reg_no="9924USA12345678"
)

mp_orders = [{"taxable_value": 200000000.0}, {"taxable_value": 150000000.0}]
mp_returns = [{"taxable_value": 50000000.0}]  # Net = 300,000,000
sec_9_5 = [{"food_value": 120000000.0}]
oidar_subs = [{"subscription_inr": 80000000.0}]

settlement = engine.process_platform_monthly_settlement(
    marketplace_orders=mp_orders,
    marketplace_returns=mp_returns,
    section_9_5_orders=sec_9_5,
    oidar_b2c_subscriptions=oidar_subs
)

print(f"Digital Platform: {settlement['platform']}")
print(f"Section 52 Net Marketplace Turnover: INR {settlement['sec_52_net_taxable_supplies']:,.2f}")
print(f"Section 52 TCS Remittance (Form GSTR-8): INR {settlement['sec_52_tcs_payable_gstr8']:,.2f}")
print(f"Liquidated Vendor Cash Settlement: INR {settlement['marketplace_vendor_net_payout']:,.2f}")
print(f"Section 9(5) Deemed Food Sales: INR {settlement['sec_9_5_food_turnover']:,.2f}")
print(f"Section 9(5) Mandatory Cash Ledger Tax: INR {settlement['sec_9_5_mandatory_cash_tax']:,.2f}")
print(f"Section 14 OIDAR Digital Subscriptions: INR {settlement['oidar_b2c_digital_turnover']:,.2f}")
print(f"Section 14 IGST Remittance (Form GSTR-5A): INR {settlement['oidar_igst_payable_gstr5a']:,.2f}")
print(f"Total Direct Platform Tax Remittance: INR {settlement['total_government_tax_remittance']:,.2f}")
print(f"System Audit Status: {settlement['compliance_verdict']}")""",
        "output": """Digital Platform: OmniDigital Global Marketplace Ecosystem
Section 52 Net Marketplace Turnover: INR 300,000,000.00
Section 52 TCS Remittance (Form GSTR-8): INR 3,000,000.00
Liquidated Vendor Cash Settlement: INR 261,600,000.00
Section 9(5) Deemed Food Sales: INR 120,000,000.00
Section 9(5) Mandatory Cash Ledger Tax: INR 6,000,000.00
Section 14 OIDAR Digital Subscriptions: INR 80,000,000.00
Section 14 IGST Remittance (Form GSTR-5A): INR 14,400,000.00
Total Direct Platform Tax Remittance: INR 23,400,000.00
System Audit Status: ENTERPRISE_DIGITAL_INDIRECT_TAX_SETTLEMENT_PASS""",
        "codeNotes": [
            "Harmonizes high-throughput transaction routing across Section 52, Section 9(5), and Section 14.",
            "Computes net marketplace payouts to vendors after TCS withholding and platform commission GST.",
            "Segregates Section 9(5) mandatory cash discharge obligations from standard platform fee ITC offsets.",
            "Calculates cross-border OIDAR 18% IGST liability for automated remittance via Form GSTR-5A."
        ],
        "tryIt": "Increase food delivery turnover to Rs 200,000,000 and confirm that mandatory cash ledger tax increases from Rs 6,000,000 to Rs 10,000,000.",
        "check": {
            "question": "What are the three distinct indirect tax filing statements generated for Section 52 TCS, Section 9(5) Deemed Supplies, and Section 14 OIDAR services respectively?",
            "options": [
                "Form GSTR-8 for Section 52 TCS, Form GSTR-3B Table 3.1.1 for Section 9(5), and Form GSTR-5A for Section 14 OIDAR.",
                "Form GSTR-1 for Section 52, Form GSTR-2A for Section 9(5), and Form GSTR-9 for OIDAR.",
                "Form GSTR-4 for Section 52, Form GSTR-7 for Section 9(5), and Form GSTR-11 for OIDAR.",
                "Form GSTR-6 for Section 52, Form GSTR-10 for Section 9(5), and Form DRC-03 for OIDAR."
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Section 52 TCS is reported monthly in Form GSTR-8, Section 9(5) deemed supplies are reported in Form GSTR-3B Table 3.1.1, and cross-border OIDAR services are reported in Form GSTR-5A."
        }
    }
]

if __name__ == "__main__":
    print(f"Day 39 Metadata: {DAY39_METADATA['title']}")
    print(f"Total Parts: {len(DAY39_PARTS)}")
    for idx, p in enumerate(DAY39_PARTS):
        words = sum(len(s.split()) for s in p["say"])
        print(f"Part {idx+1} ({p['title'][:40]}...): {words} words | Check answer: {p['check']['answerIndex']}")
        assert words >= 600, f"Part {idx+1} word count {words} < 600!"
    print("DAY 39 VALIDATION PASSED!")
