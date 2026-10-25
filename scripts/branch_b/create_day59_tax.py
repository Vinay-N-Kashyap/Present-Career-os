"""
Day 59 Curriculum Expansion Generator:
Course: bcom_tax (Corporate Tax Planning, MAT, DTAA, Transfer Pricing & GST)
Day 59: Advanced GST Controversies, Cross-Border Secondment & Anti-Profiteering under Section 171
"""

import sys

def get_day59_data():
    day59 = {
        "day": 59,
        "coursePrefix": "bcom_tax",
        "minutes": 38,
        "title": "Advanced GST Controversies, Cross-Border Secondment & Anti-Profiteering under Section 171",
        "description": "Master advanced indirect tax controversies and high-stakes enterprise GST litigation. Analyze cross-border expat secondment under the landmark Supreme Court Northern Operating Systems doctrine, Rule 28(2) 1% corporate guarantee valuations, Rule 89(5) inverted duty structure refund mathematics post-VKC Footsteps, Section 17(5)(c)/(d) works contract ITC restrictions post-Safari Retreats, and Competition Commission of India anti-profiteering enforcement under Section 171.",
        "parts": [
            {
                "title": "Cross-Border Expat Secondment, Corporate Guarantees & The Northern Operating Systems Doctrine",
                "say": [
                    "In multinational enterprise operations in India, managing indirect tax compliance under the Central Goods and Services Tax (CGST) Act, 2017, and the Integrated Goods and Services Tax (IGST) Act, 2017, has evolved into a high-stakes litigation arena. Among cross-border intercompany transactions, no issue has triggered greater financial turbulence than the secondment of expatriate managerial personnel by foreign parent corporations to their Indian operating subsidiaries. Historically, Indian subsidiaries treated seconded personnel as their bona fide employees, invoking Entry 1 of Schedule III to the CGST Act—which declares that 'services by an employee to the employer in the course of or in relation to his employment' shall be treated neither as a supply of goods nor a supply of services.",
                    "However, this widespread corporate tax practice was completely overturned by the historic judgment of the Supreme Court of India in Commissioner of Customs, Central Excise & Service Tax v. Northern Operating Systems Pvt. Ltd. (NOS) ((2022) 61 GSTL 129). In a definitive ruling, the Supreme Court dissected the economic substance of global secondment agreements. The Court held that where foreign group companies deploy highly skilled overseas specialists to an Indian entity while maintaining the employee's overseas social security, lien on employment, pension rights, and basic salary disbursed overseas (subsequently reimbursed by the Indian company on a cost-to-cost basis without markup), the true relationship between the foreign parent and the Indian subsidiary is that of a service provider and service recipient.",
                    "The Supreme Court ruled that the overseas entity provides a taxable 'manpower supply service' to the Indian company. Under Section 5(3) of the IGST Act read with Notification No. 10/2017-Integrated Tax (Rate), import of services between related persons is subject to GST under the Reverse Charge Mechanism (RCM) at the rate of 18%. Following the NOS ruling, the Directorate General of GST Intelligence (DGGI) issued tax notices running into thousands of crores across automotive, pharmaceutical, IT, and financial multinational subsidiaries across India.",
                    "To mitigate extreme industry dislocation, the Central Board of Indirect Taxes and Customs (CBIC) issued Circular No. 210/4/2024-GST (clarifying earlier Instruction No. 05/2023), establishing crucial procedural guidelines: (a) Revenue authorities cannot mechanically apply the NOS judgment to all secondment contracts; each agreement must be evaluated to determine whether the Indian entity exercises ultimate operational control, issues local appointment letters, and bears employment risks; and (b) Where the Indian subsidiary is entitled to full Input Tax Credit (ITC), the invoice issued by the foreign parent or the reimbursement accounting entry shall be accepted as the open market value under the second proviso to Rule 28, neutralizing tax demands except for pure interest exposure.",
                    "A parallel controversy surrounds corporate guarantees issued by parent companies for credit facilities sanctioned to subsidiaries. To establish statutory finality, CBIC inserted Rule 28(2) into the CGST Rules, 2017, with effect from October 26, 2023. Under Rule 28(2), the value of supply of services by a corporate entity to a related person by way of providing a corporate guarantee to any banking company or financial institution on behalf of the said related person shall be deemed to be: one per cent (1%) of the amount of such guarantee offered, or the actual consideration, whichever is higher, payable annually.",
                    "Furthermore, under CBIC Circular No. 204/16/2023-GST, where an Indian holding company provides a guarantee for its domestic or foreign subsidiary, GST at 18% is payable on 1% of the guaranteed amount per annum. For an Indian group guaranteeing an INR 1,000 Crore credit line for its overseas subsidiary, the deemed service value is INR 10 Crores, generating an annual GST liability of INR 1.80 Crores under RCM or forward charge, permanently altering the economics of cross-border corporate treasury operations."
                ],
                "check": {
                    "question": "What was the landmark ruling of the Supreme Court of India in Northern Operating Systems Pvt. Ltd. (NOS) regarding expat secondment?",
                    "options": [
                        "Secondment of overseas personnel where employment lien remains with the foreign parent is a taxable manpower supply service subject to 18% GST under RCM.",
                        "All expatriate employees are permanently exempt from all Indian direct and indirect taxes.",
                        "Reimbursement of salaries between multinational subsidiaries is classified as a tax-free charitable donation.",
                        "Indian subsidiaries are prohibited from hiring foreign nationals under the Companies Act."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "In Northern Operating Systems (2022), the Supreme Court ruled that expat secondment with overseas employment liens constitutes a taxable supply of manpower services subject to GST under RCM, overriding the Schedule III employee exemption."
                }
            },
            {
                "title": "Inverted Duty Structure (IDS) Refunds & Rule 89(5) Mathematical Mechanics",
                "say": [
                    "In capital-intensive industrial manufacturing sectors—such as footwear, textiles, fertilizers, solar equipment, and specialized chemicals—enterprises frequently suffer from a severe indirect tax distortion known as an Inverted Duty Structure (IDS). An inverted duty structure arises when the tax rate on inputs procured by a manufacturer is significantly higher than the tax rate on the finished output supplies sold in the market. For instance, a footwear manufacturer procures synthetic leather, specialized adhesives, and rubber soles taxed at 18% GST, but sells finished shoes taxed at the concessional rate of 5% or 12%. Because output tax collections are insufficient to absorb the incoming tax credits, massive unutilized Input Tax Credit (ITC) accumulates on the corporate balance sheet, creating an acute working capital blockage.",
                    "To alleviate this liquidity freeze, Section 54(3)(ii) of the CGST Act, 2017, enacts a statutory refund mechanism: a registered person may claim a refund of any unutilized input tax credit at the end of any tax period where the credit has accumulated on account of the rate of tax on inputs being higher than the rate of tax on output supplies (other than nil rated or fully exempt supplies).",
                    "For years, corporate taxpayers litigated whether 'inputs' in Section 54(3) encompassed both input goods and input services (such as factory power, logistics, and legal fees). In the landmark judgment of Union of India v. VKC Footsteps India Pvt. Ltd. ((2021) 52 GSTL 513), the Supreme Court of India decisively resolved the controversy. The Supreme Court upheld the constitutional validity of Rule 89(5) of the CGST Rules, ruling that Parliament deliberately used the word 'inputs' (defined in Section 2(59) as goods only) rather than 'input services' (defined in Section 2(60)). Therefore, unutilized ITC accumulated on input services is statutorily ineligible for refund under an inverted duty structure.",
                    "Following the VKC Footsteps decision, the GST Council recognized that the historical formula in Rule 89(5) unfairly disadvantaged manufacturers by allocating output tax liability disproportionately against input goods. Consequently, Notification No. 14/2022-Central Tax amended Rule 89(5), establishing the modern mathematical formula for inverted duty structure refunds: Maximum Refund Amount = {(Turnover of inverted rated supply of goods and services) multiplied by (Net ITC) divided by (Adjusted Total Turnover)} MINUS {Tax payable on such inverted rated supply of goods and services multiplied by (Net ITC divided by the sum of Net ITC on inputs plus ITC on input services)}.",
                    "This revised formula ensures that output tax liability on the finished product is apportioned equitably between input goods and input services, significantly increasing the net cash refund payable to the manufacturing enterprise. To claim an IDS refund, the corporate tax team must file Form GST RFD-01 on the GST Common Portal within two years from the relevant date (the due date for furnishing the return under Section 39 for the relevant period).",
                    "The refund application must be accompanied by an exhaustive reconciliation statement: (a) GSTR-2B inward supply invoices matched against purchase registers; (b) chartered accountant certificate in Annexure 2 of Circular No. 125/44/2019-GST certifying that the incidence of tax has not been passed on to customers (negating unjust enrichment under Section 54(5)); and (c) an itemized statement showing inverse tax rate differentials across HSN codes. Once verified by the jurisdictional GST tax officer, the refund is directly credited into the enterprise's designated bank account, releasing crores of locked working capital back into active commercial production.",
                    "Procedurally, claiming inverted duty structure refunds requires continuous, algorithmic auditing of supplier compliance under Section 16(2)(aa) of the CGST Act. The tax department strictly verifies that every rupee of input tax credit claimed in Form GST RFD-01 is reflected in the taxpayer's auto-populated GSTR-2B statement. Where suppliers have defaulted in filing GSTR-1 or where circular trading or fake invoice networks are suspected, the refund is withheld under Section 54(10), and show cause notices are served under Section 73 or Section 74. Manufacturing enterprises must therefore maintain real-time automated vendor risk scorecards that block payment of the GST component to vendors until invoice matching in GSTR-2B is electronically confirmed."
                ],
                "check": {
                    "question": "What was the ruling of the Supreme Court of India in Union of India v. VKC Footsteps India Pvt. Ltd. regarding Section 54(3) IDS refunds?",
                    "options": [
                        "Refund of unutilized ITC under an inverted duty structure is restricted solely to input goods, excluding input services.",
                        "Input services are eligible for two hundred per cent cash refund under all circumstances.",
                        "Inverted duty structures are declared illegal and all manufacturing units must pay a uniform 28% GST.",
                        "Footwear manufacturers are exempt from filing monthly GST returns."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "In VKC Footsteps (2021), the Supreme Court held that Section 54(3)(ii) restricts IDS refunds strictly to 'inputs' (goods), excluding 'input services', upholding the validity of Rule 89(5)."
                }
            },
            {
                "title": "Real Estate, Works Contracts & Section 17(5) ITC Restrictions post-Safari Retreats",
                "say": [
                    "The construction, real estate, and engineering procurement and construction (EPC) sectors represent one of the most intricate and litigious domains in Indian indirect taxation. Under Section 2(119) of the CGST Act, 2017, a 'works contract' means a contract for building, construction, fabrication, completion, erection, installation, fitting out, improvement, modification, repair, maintenance, renovation, alteration, or commissioning of any immovable property wherein transfer of property in goods is involved in the execution of such contract. Under Schedule II Entry 6(a), a works contract is statutorily classified as a composite supply of service, taxable at 18% GST.",
                    "In real estate operations, the primary battleground centers on the severe statutory restrictions on Input Tax Credit (ITC) codified in clauses (c) and (d) of Section 17(5) of the CGST Act. Under Section 17(5)(c), input tax credit is blocked in respect of: 'works contract services when supplied for construction of an immovable property (other than plant and machinery) except where it is an input service for further supply of works contract service'. Under Section 17(5)(d), input tax credit is blocked in respect of: 'goods or services or both received by a taxable person for construction of an immovable property (other than plant or machinery) on his own account including when such goods or services or both are used in the course or furtherance of business'.",
                    "For commercial real estate developers constructing massive shopping malls, office tech parks, and warehousing logistics hubs intended for leasing, Section 17(5)(d) created an acute economic injustice: while the leasing of commercial real estate is subject to 18% output GST, the developer was denied hundreds of crores of input tax credit incurred on steel, cement, architectural design, and civil construction, breaking the continuous chain of value-added taxation.",
                    "This statutory blockage was challenged in the landmark constitutional litigation of Safari Retreats Pvt. Ltd. v. Chief Commissioner of Central Goods & Service Tax. The High Court of Orissa read down Section 17(5)(d), holding that where a commercial building is constructed specifically for letting out and earning taxable rental income, the developer cannot be denied ITC, as doing so defeats the core objective of the GST enactments. The Revenue appealed this monumental ruling to the Supreme Court of India.",
                    "In a landmark judgment pronounced in October 2024 (Chief Commissioner of Central Goods & Service Tax v. Safari Retreats Pvt. Ltd., Civil Appeal No. 2948 of 2023), the Supreme Court of India delivered a nuanced and historic verdict. The Supreme Court upheld the constitutional validity of Section 17(5)(d), refusing to strike it down. However, the Court provided an expansive, pro-taxpayer interpretation of the statutory exception 'plant and machinery' contained within Section 17(5)(d). The Supreme Court held that whether a building or civil structure qualifies as a 'plant' is a question of fact to be determined by applying the 'Functionality Test': if the building or structure is an apparatus or tool with which the commercial activity of the business is carried on (rather than merely the setting where it takes place), it qualifies as plant, and ITC cannot be denied!",
                    "The Supreme Court remanded the matter to factual authorities to examine whether modern commercial complexes—equipped with centralized air conditioning, escalators, power backup substations, and specialized fire safety frameworks—function as integral plants. Furthermore, in Joint Development Agreements (JDAs) between landowners and developers, Notification No. 4/2018-Central Tax (Rate) governs the time of supply: liability arises on the date of issuance of the completion certificate (CC) or first occupancy, allowing developers to defer GST until project delivery.",
                    "Additionally, for residential real estate projects, the GST regime was completely overhauled effective April 1, 2019, through Notification No. 3/2019-Central Tax (Rate). The notification introduced mandatory concessional tax rates: 1% for affordable housing and 5% for other residential properties, subject to the condition that no Input Tax Credit is claimed. Crucially, the scheme enforces a strict procurement condition: developers must procure at least eighty per cent (80%) of inputs and input services from registered suppliers. If procurement falls below 80%, the developer is statutorily liable to pay GST at 18% under reverse charge under Section 9(4), with cement shortfalls taxed at the peak punitive rate of 28% under RCM."
                ],
                "check": {
                    "question": "What is the crucial legal standard established by the Supreme Court in Safari Retreats (2024) to determine whether construction ITC can be claimed under Section 17(5)(d)?",
                    "options": [
                        "The Functionality Test: whether the immovable structure functions as an integral apparatus/tool (plant) with which commercial business is conducted.",
                        "Whether the real estate developer has paid ten crore rupees in corporate income tax.",
                        "Whether the construction was completed within twelve calendar months of municipal approval.",
                        "Whether the project was financed through foreign direct investment."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "In Safari Retreats (2024), the Supreme Court applied the Functionality Test to determine whether a building or civil structure qualifies as 'plant and machinery' under the exception to Section 17(5)(d)."
                }
            },
            {
                "title": "Anti-Profiteering Architecture under Section 171 & Competition Commission Enforcement",
                "say": [
                    "When India transitioned to the Goods and Services Tax on July 1, 2017, Parliament recognized that unscrupulous corporate enterprises might pocket the benefits of lower tax rates and enhanced Input Tax Credit (ITC) without passing them on to consumers, fueling inflationary price shocks. To mandate consumer price transmission, Parliament enacted Section 171 of the CGST Act, 2017: 'Anti-profiteering measure'. Section 171 establishes an uncompromising statutory obligation: 'Any reduction in rate of tax on any supply of goods or services or the benefit of input tax credit shall be passed on to the recipient by way of commensurate reduction in prices.'",
                    "Section 171 establishes a strict dual-trigger mandate: whenever (1) the GST Council reduces the tax rate on a product (for example, slashing restaurant GST from 18% to 5%, or white goods from 28% to 18%); OR (2) a business obtains an increased benefit of Input Tax Credit due to the seamless input tax chain, the enterprise is statutorily compelled to reduce the selling price of each individual stock keeping unit (SKU) to reflect the exact tax saving. An enterprise cannot justify non-reduction of prices by arguing that its operational costs, wages, or raw material prices have risen; anti-profiteering audits examine tax changes in total isolation.",
                    "Historically, anti-profiteering investigations were conducted by the Directorate General of Anti-Profiteering (DGAP) and adjudicated by the National Anti-Profiteering Authority (NAA). The NAA levied hundreds of penalty orders across fast-moving consumer goods (FMCG), consumer electronics, cinema multiplexes, and real estate developers (ordering refunds exceeding INR 500 Crores in landmark cases involving Hindustan Unilever, Nestlé, and Johnson & Johnson). However, effective December 1, 2022, the Central Government dissolved the NAA and transferred all anti-profiteering adjudication powers to the Competition Commission of India (CCI).",
                    "The constitutional validity of Section 171 was fiercely litigated before constitutional courts. In the historic judgment of Reckitt Benckiser India Pvt. Ltd. v. Union of India (2024), the High Court of Delhi upheld the constitutional validity of Section 171 and Chapter XV of the CGST Rules. The High Court affirmed that Section 171 is a valid consumer protection measure enacted in public interest to prevent unjust enrichment. However, the Court ruled that the CCI and DGAP cannot act arbitrarily: they must adopt transparent, mathematically consistent benchmarking methodologies, take into account cost increases where directly linked, and apply anti-profiteering rules SKU-by-SKU rather than on an entity-wide basis.",
                    "Under Section 171(3A), where the Competition Commission of India determines that any registered person has profited by failing to pass on tax reductions or ITC benefits, the authority is empowered to order: (a) a commensurate reduction in prices; (b) the refund to the recipient of an amount equivalent to the profiteered sum along with interest at eighteen per cent (18%) from the date of collection to the date of deposit; (c) where the recipient cannot be identified, the deposit of the profiteered amount plus 18% interest into the Consumer Welfare Fund; and (d) a statutory penalty equal to ten per cent (10%) of the profiteered amount, provided that no penalty is leviable if the profiteered amount is deposited within thirty days of the order.",
                    "In severe cases of persistent non-compliance, Section 171(3) empowers the authority to order the cancellation of the registered person's GST registration. Corporate pricing committees must therefore maintain automated algorithmic pricing engines that continuously monitor GST Council rate notifications, dynamically recalibrating maximum retail prices (MRP) on supply chain ERPs within hours of statutory changes.",
                    "In forensic defense before the Competition Commission of India, enterprise counsel must present audited mathematical proof demonstrating that the benefit of tax rate cuts was passed on to consumers. Defense teams model the exact relationship between the pre-reduction base price and post-reduction price across millions of billing invoices. The Delhi High Court in Reckitt Benckiser affirmed that where an enterprise simultaneously offers higher product grammage, promotional quantity discounts, or offsets direct raw material inflation that occurred contemporaneously, the regulatory authority must evaluate whether commercial equivalence was achieved, protecting corporations from draconian profiteering decrees."
                ],
                "check": {
                    "question": "What is the statutory obligation imposed on registered persons under Section 171(1) of the CGST Act?",
                    "options": [
                        "Any reduction in tax rate or benefit of input tax credit must be passed on to recipients via commensurate price reductions.",
                        "Companies must donate five per cent of their net profits to the Central Goods and Services Tax Council.",
                        "All retail prices must be approved annually by the local municipal collector.",
                        "Enterprises must maintain a uniform twenty-five per cent gross profit margin across all commercial products."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "Section 171(1) explicitly mandates that any reduction in the rate of tax or benefit of input tax credit must be passed on to the recipient by way of a commensurate reduction in prices."
                }
            },
            {
                "title": "Production Python Architecture: Advanced Enterprise GST Controversy & Compliance Engine",
                "say": [
                    "Managing high-stakes indirect tax controversy in modern enterprise operations demands automated algorithmic tracking of expat secondment RCM liabilities, Rule 28(2) 1% corporate guarantee computations, Rule 89(5) inverted duty structure refund allocations, and Section 171 anti-profiteering SKU price recalibrations. In this module, we develop a production-ready computational Python architecture, AdvancedGSTControversyEngine, engineered for enterprise indirect tax heads.",
                    "The computational engine encapsulates four core statutory indirect tax capabilities: First, the Expat Secondment RCM Engine: applying the Supreme Court Northern Operating Systems doctrine, evaluating foreign employer liens, and calculating 18% RCM liability on salary reimbursements with input tax credit eligibility flags under Circular 210/2024. Second, the Corporate Guarantee Rule 28(2) Valuation Engine: computing the deemed 1% per annum service valuation on banking credit lines and generating annual GST liability schedules. Third, the Inverted Duty Structure (IDS) Rule 89(5) Refund Calculator: executing the amended mathematical formula post-VKC Footsteps, segregating input goods from input services, and computing maximum cash refund entitlements. Fourth, the Section 171 Anti-Profiteering Recalibrator: computing commensurate price reductions per SKU upon tax rate cuts and calculating interest and 10% penalty liabilities under Section 171(3A).",
                    "Let us inspect the complete, executable Python architecture implementing these advanced GST mechanics:",
                    "```python",
                    "from dataclasses import dataclass, field",
                    "from typing import Dict, List, Optional",
                    "",
                    "@dataclass",
                    "class ExpatSecondmentAgreement:",
                    "    employee_id: str",
                    "    overseas_entity_name: str",
                    "    annual_salary_reimbursement_inr: float",
                    "    lien_on_overseas_employment: bool",
                    "    indian_entity_has_full_itc: bool",
                    "",
                    "@dataclass",
                    "class ProductSKU:",
                    "    sku_id: str",
                    "    description: str",
                    "    pre_reduction_base_price_inr: float",
                    "    old_gst_rate: float",
                    "    new_gst_rate: float",
                    "    units_sold_post_reduction: int",
                    "",
                    "class AdvancedGSTControversyEngine:",
                    "    def __init__(self, corporate_name: str, gstin: str):",
                    "        self.company = corporate_name",
                    "        self.gstin = gstin",
                    "",
                    "    def compute_secondment_rcm_liability(self, secondment: ExpatSecondmentAgreement) -> Dict[str, any]:",
                    "        # Supreme Court doctrine in Northern Operating Systems (2022)",
                    "        is_taxable_manpower_service = secondment.lien_on_overseas_employment",
                    "        tax_rate = 0.18 if is_taxable_manpower_service else 0.0",
                    "        rcm_liability = secondment.annual_salary_reimbursement_inr * tax_rate",
                    "        itc_available = rcm_liability if secondment.indian_entity_has_full_itc else 0.0",
                    "        net_cash_impact = rcm_liability - itc_available",
                    "",
                    "        return {",
                    "            'employee_id': secondment.employee_id,",
                    "            'is_taxable_under_nos_doctrine': is_taxable_manpower_service,",
                    "            'annual_reimbursement_inr': secondment.annual_salary_reimbursement_inr,",
                    "            'rcm_gst_rate_pct': 18.0 if is_taxable_manpower_service else 0.0,",
                    "            'gross_rcm_tax_payable_inr': round(rcm_liability, 2),",
                    "            'itc_credit_admissible_inr': round(itc_available, 2),",
                    "            'net_revenue_exposure_inr': round(net_cash_impact, 2),",
                    "            'circular_210_safe_harbour': 'FULL_ITC_REVENUE_NEUTRAL_INVOICE_ACCEPTED' if secondment.indian_entity_has_full_itc else 'REVENUE_EXPOSURE'",
                    "        }",
                    "",
                    "    def compute_corporate_guarantee_gst_sec28_2(self, guarantee_amount_inr: float, actual_fee_charged_inr: float = 0.0) -> Dict[str, any]:",
                    "        # Rule 28(2) Valuation: Higher of 1% of guarantee amount per annum or actual fee",
                    "        deemed_value = guarantee_amount_inr * 0.01",
                    "        taxable_value = max(deemed_value, actual_fee_charged_inr)",
                    "        annual_gst_payable = taxable_value * 0.18",
                    "",
                    "        return {",
                    "            'guarantee_amount_inr': guarantee_amount_inr,",
                    "            'statutory_deemed_1pct_value_inr': round(deemed_value, 2),",
                    "            'actual_fee_inr': actual_fee_charged_inr,",
                    "            'final_taxable_value_inr': round(taxable_value, 2),",
                    "            'annual_gst_payable_18pct_inr': round(annual_gst_payable, 2),",
                    "            'valuation_rule': 'CGST Rule 28(2) mandatory deemed valuation'",
                    "        }",
                    "",
                    "    def compute_inverted_duty_structure_refund(",
                    "        self,",
                    "        turnover_inverted_supplies_inr: float,",
                    "        adjusted_total_turnover_inr: float,",
                    "        net_itc_inputs_goods_inr: float,",
                    "        itc_input_services_inr: float,",
                    "        tax_payable_inverted_supplies_inr: float",
                    "    ) -> Dict[str, any]:",
                    "        # Amended Rule 89(5) formula post-VKC Footsteps",
                    "        # Max Refund = (Turnover_Inv * Net_ITC_Goods / Adj_Turnover) - [Tax_Payable * (Net_ITC_Goods / (Net_ITC_Goods + ITC_Services))]",
                    "        net_itc_ratio = turnover_inverted_supplies_inr / adjusted_total_turnover_inr if adjusted_total_turnover_inr > 0 else 0.0",
                    "        gross_refund_component = net_itc_ratio * net_itc_inputs_goods_inr",
                    "",
                    "        total_itc = net_itc_inputs_goods_inr + itc_input_services_inr",
                    "        tax_apportionment_ratio = net_itc_inputs_goods_inr / total_itc if total_itc > 0 else 0.0",
                    "        tax_reduction_component = tax_payable_inverted_supplies_inr * tax_apportionment_ratio",
                    "",
                    "        max_refund_entitlement = max(0.0, gross_refund_component - tax_reduction_component)",
                    "",
                    "        return {",
                    "            'turnover_inverted_inr': turnover_inverted_supplies_inr,",
                    "            'adjusted_total_turnover_inr': adjusted_total_turnover_inr,",
                    "            'net_itc_goods_inr': net_itc_inputs_goods_inr,",
                    "            'itc_services_excluded_vkc_footsteps_inr': itc_input_services_inr,",
                    "            'tax_payable_inverted_inr': tax_payable_inverted_supplies_inr,",
                    "            'max_ids_cash_refund_inr': round(max_refund_entitlement, 2),",
                    "            'governing_rule': 'Amended CGST Rule 89(5) post-VKC Footsteps'",
                    "        }",
                    "",
                    "    def audit_anti_profiteering_sec171(self, sku: ProductSKU, actual_selling_price_charged_inr: float) -> Dict[str, any]:",
                    "        # Section 171: Mandatory commensurate price reduction",
                    "        old_mrp = sku.pre_reduction_base_price_inr * (1 + sku.old_gst_rate)",
                    "        commensurate_new_mrp = sku.pre_reduction_base_price_inr * (1 + sku.new_gst_rate)",
                    "        required_reduction_per_unit = old_mrp - commensurate_new_mrp",
                    "",
                    "        profiteered_per_unit = max(0.0, actual_selling_price_charged_inr - commensurate_new_mrp)",
                    "        total_profiteered = profiteered_per_unit * sku.units_sold_post_reduction",
                    "        is_profiteering_detected = total_profiteered > 0.0",
                    "        penalty_10pct = total_profiteered * 0.10 if is_profiteering_detected else 0.0",
                    "",
                    "        return {",
                    "            'sku_id': sku.sku_id,",
                    "            'description': sku.description,",
                    "            'old_mrp_inr': round(old_mrp, 2),",
                    "            'mandatory_commensurate_new_mrp_inr': round(commensurate_new_mrp, 2),",
                    "            'actual_price_charged_inr': actual_selling_price_charged_inr,",
                    "            'is_section_171_violation': is_profiteering_detected,",
                    "            'profiteered_amount_inr': round(total_profiteered, 2),",
                    "            'statutory_interest_18pct_due': is_profiteering_detected,",
                    "            'potential_penalty_sec171_3a_inr': round(penalty_10pct, 2),",
                    "            'compliance_status': 'COMPLIANT_WITH_SECTION_171' if not is_profiteering_detected else 'ILLEGAL_PROFITEERING_DETECTED'",
                    "        }",
                    "```",
                    "Deploying this computational architecture across multinational enterprise supply chains guarantees total compliance with cutting-edge indirect tax jurisprudence. Corporate tax teams can compute secondment RCM exposures within seconds, claim maximum inverted duty structure cash refunds under amended Rule 89(5), and prevent devastating Section 171 anti-profiteering investigations by the Competition Commission of India."
                ],
                "check": {
                    "question": "In AdvancedGSTControversyEngine, under amended Rule 89(5) post-VKC Footsteps, what is the maximum refund entitlement for an inverted duty structure?",
                    "options": [
                        "Calculated by apportioning output tax equitably between input goods and services, refunding accumulated ITC on input goods.",
                        "One hundred per cent of all input services including legal, consulting, and catering fees.",
                        "Zero refund, because all inverted duty structures are penalized under the Goods and Services Tax code.",
                        "A flat administrative refund of five lakh rupees per tax period."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "Under amended Rule 89(5) upholding VKC Footsteps, output tax is equitably apportioned between input goods and services, and the refund is granted strictly on accumulated ITC from input goods."
                }
            }
        ]
    }
    return day59

if __name__ == '__main__':
    data = get_day59_data()
    print(f"Day 59 Title: {data['title']}")
    print(f"Parts count: {len(data['parts'])}")
    for i, p in enumerate(data['parts']):
        words = len(" ".join(p['say']).split())
        print(f"Part {i+1}: {words} words")
