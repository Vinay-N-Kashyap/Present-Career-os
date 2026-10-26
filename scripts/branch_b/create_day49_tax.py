"""
create_day49_tax.py
Course: bcom_tax (Corporate Tax, GST & Direct Taxation)
Month 2 Block 10 Day 49: Penalties, Prosecutions & Statutory Immunity: Section 270A Under-Reporting vs Misreporting, Section 270AA Immunity & Section 271AAD Penalties
"""

def get_day49_data():
    day49 = {
        "day": 49,
        "coursePrefix": "bcom_tax",
        "title": "Penalties, Prosecutions & Statutory Immunity: Section 270A Under-Reporting vs Misreporting, Section 270AA Immunity & Section 271AAD Penalties",
        "description": "Master the penalty, prosecution, and statutory immunity legal architecture under the Income-tax Act, 1961, as transformed by the Finance Act, 2016 and subsequent fiscal legislation. Analyze the statutory taxonomy of Section 270A distinguishing under-reporting (50% penalty) from misreporting of income (200% penalty), safe harbour carve-outs under Section 270A(6), statutory immunity and waiver of penalty under Section 270AA, draconian penalties for false entries and accommodation bills under Section 271AAD, criminal prosecutions under Chapter XXII, compounding of offenses, and production-grade penalty risk optimization algorithms.",
        "minutes": 38,
        "parts": [
            {
                "title": "Section 270A Penalty Taxonomy: Under-Reporting of Income vs Misreporting of Income",
                "say": [
                    "For more than five decades, direct tax penalty jurisprudence in India was governed by Section 271(1)(c) of the Income-tax Act, 1961, which authorized the levy of penalty for 'concealment of particulars of income' or 'furnishing inaccurate particulars of income'. Because these statutory terms were inherently subjective, decades of litigation produced thousands of conflicting precedents regarding whether an erroneous claim or honest legal disagreement constituted concealment. In a decisive legislative reform, the Finance Act, 2016, repealed Section 271(1)(c) for assessment years commencing on or after April 1, 2017, replacing it with an objective, codified penalty architecture in Section 270A.",
                    "Under Section 270A(1), the Assessing Officer or the Joint Commissioner (Appeals) or the Commissioner (Appeals) or the Principal Commissioner or Commissioner may, during the course of any proceedings under the Act, direct that any person who has under-reported their income shall be liable to pay a penalty in addition to tax, if any, payable by them. Crucially, Section 270A bifurcates tax infractions into two distinct statutory categories characterized by vastly different degrees of culpability and financial severity: (1) 'Under-reporting of income', which attracts a mandatory penalty equal to fifty percent (50%) of the amount of tax payable on under-reported income under Section 270A(7); and (2) 'Misreporting of income', which attracts an escalated penalty equal to two hundred percent (200%) of the amount of tax payable on under-reported income under Section 270A(8).",
                    "Section 270A(2) precisely defines when a person is deemed to have under-reported their income across various assessment scenarios: (a) where the income assessed is greater than the income determined in the return processed under Section 143(1)(a); (b) where the income assessed is greater than the maximum amount not chargeable to tax, in cases where no return of income has been furnished; (c) where the income reassessed is greater than the income assessed or reassessed immediately before such reassessment; (d) where the amount of deemed total income assessed or reassessed under Section 115JB (MAT) or Section 115JC (AMT) is greater than the deemed total income determined in the return processed under Section 143(1)(a); (e) where the deemed total income assessed under Section 115JB or 115JC is greater than the maximum amount not chargeable to tax, where no return was filed; and (f) where the income assessed has the effect of reducing the loss or converting that loss into income.",
                    "The computation of tax payable on under-reported income is governed by Section 270A(10). Under this provision, the tax payable is calculated as if the under-reported income were the total income of the assessee (in cases where no return was filed), or as the difference between the tax on total income including under-reported income and the tax on total income excluding under-reported income. Importantly, where an addition is governed by special provisions such as Section 115BBE (unexplained cash credits and investments), Section 270A does not apply; instead, Section 271AAC governs exclusively, preventing double jeopardy.",
                    "The operational significance of the under-reporting versus misreporting dichotomy cannot be overstated. A 50% penalty for under-reporting represents an administrative surcharge on honest errors or legal disagreements, whereas a 200% penalty for misreporting represents a severe fiscal sanction for fraudulent intent. As established by High Courts across India, the Assessing Officer is statutorily required to specify in the assessment order and penalty show-cause notice whether the penalty is initiated for under-reporting under Section 270A(1) or misreporting under Section 270A(8)/(9). A notice that fails to specify the exact limb or vaguely mentions both violates statutory natural justice, rendering the entire penalty proceeding void ab initio.",
                    "Furthermore, corporate tax departments must master the statutory mechanics of sub-sections (4) and (5) of Section 270A concerning intangible additions and loss adjustments. Under Section 270A(4), where the source of any receipt, deposit, or investment in any assessment year is claimed to be an addition made in an earlier year (past intangible additions), such amount shall be treated as under-reported income for that earlier year if it was not taxed earlier. Under Section 270A(5), the amount of under-reported income is adjusted where an assessment order has the effect of reducing the business loss claimed or converting a loss into positive taxable income. In such scenarios, the tax payable is calculated as if the loss had been reduced to zero, and the tax on under-reported income is computed on the total quantum of reduction at the maximum applicable corporate rate, ensuring that loss-making corporations are not insulated from statutory penalty liabilities."
                ],
                "check": {
                    "question": "What is the statutory penalty rate levied under Section 270A for misreporting of income compared to standard under-reporting of income?",
                    "options": [
                        "Two hundred percent (200%) of the tax payable on under-reported income for misreporting, versus fifty percent (50%) for under-reporting.",
                        "One hundred percent (100%) for misreporting, versus twenty-five percent (25%) for under-reporting.",
                        "Three hundred percent (300%) for misreporting, versus seventy-five percent (75%) for under-reporting.",
                        "A flat penalty of ten lakh rupees regardless of the underlying tax quantum."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "Under Section 270A(7) and Section 270A(8), the penalty for under-reporting of income is exactly fifty percent (50%) of the tax payable, whereas the penalty for misreporting of income is two hundred percent (200%) of the tax payable."
                }
            },
            {
                "title": "The Six Statutory Misreporting Gateways & Safe Harbour Carve-outs",
                "say": [
                    "To prevent revenue authorities from arbitrarily treating ordinary disallowances as fraudulent misreporting, Parliament established an exhaustive statutory definition of 'misreporting of income' in Section 270A(9). Under Section 270A(9), the cases of misreporting of income are strictly confined to six specific operational gateways, and no addition can be classified as misreporting unless it falls squarely within one of these clauses: (a) misrepresentation or suppression of facts; (b) failure to record investments in the books of account; (c) claim of expenditure not substantiated by any evidence; (d) recording of false entry in the books of account; (e) failure to record any receipt in books of account having a bearing on total income; and (f) failure to report any international transaction or any transaction deemed to be an international transaction or any specified domestic transaction, to which the provisions of Chapter X apply.",
                    "If an addition made by the Assessing Officer does not fit within these six enumerated gateways—for example, if a deduction under Section 80-IA was disallowed purely on a differing interpretation of statutory eligibility, or depreciation was recomputed from 40% to 15%—such addition can never be characterized as misreporting. In such cases, the penalty can only be initiated, if at all, under the under-reporting limb under Section 270A(1).",
                    "Equally vital to corporate defense is the statutory safe harbour codified in Section 270A(6). Section 270A(6) carves out specific categories of additions that are statutorily excluded from the definition of 'under-reported income', ensuring that no penalty whatsoever can be levied on them. Under Section 270A(6), under-reported income shall not include: (a) the amount of income in respect of which the assessee offers an explanation and the Assessing Officer or the appellate authority is satisfied that the explanation is bona fide and the assessee has disclosed all the material facts to substantiate the explanation offered; (b) the amount of under-reported income determined on the basis of an estimate, if the accounts are correct and complete to the satisfaction of the Assessing Officer, but the method employed is such that the income cannot properly be deduced therefrom; (c) the amount of under-reported income determined on the basis of an estimate, if the assessee has, on their own, estimated a lower amount of addition or disallowance on the same issue, has included such amount in the computation of their income and has disclosed all the facts material to the addition or disallowance; (d) the amount of under-reported income represented by any addition made in conformity with the arm's length price determined by the Transfer Pricing Officer under Section 92CA, where the assessee had maintained information and documents as prescribed under Section 92D, declared the international transaction under Chapter X, and disclosed all the material facts relating to the transaction; and (e) the amount of undisclosed income referred to in Section 271AAB in search cases.",
                    "The transfer pricing safe harbour under clause (d) of Section 270A(6) is of paramount importance to multinational corporate groups. Where a corporate taxpayer enters into cross-border transactions with associated enterprises and maintains contemporaneous transfer pricing documentation under Section 92D and files Form 3CEB under Section 92E, any upward adjustment made by the Transfer Pricing Officer using an alternative economic benchmark cannot attract Section 270A penalty, provided the taxpayer acted bona fide and disclosed all material facts.",
                    "In defending corporate clients against penalty notices, practitioners must dissect the assessment order paragraph by paragraph. If an addition is supported by complete books of account and accompanied by a bona fide legal interpretation supported by High Court or ITAT precedents, the addition is fully shielded by Section 270A(6)(a). Demonstrating that the assessee disclosed all primary material facts in the return of income and accompanying tax audit report eliminates the legal foundation for both under-reporting and misreporting penalties."
                ],
                "check": {
                    "question": "Which of the following is an explicit statutory exclusion from under-reported income under Section 270A(6)?",
                    "options": [
                        "An addition where the assessee offered a bona fide explanation and disclosed all material facts to substantiate it.",
                        "Unexplained cash discovered during a search where the assessee refused to identify the owner.",
                        "A transfer pricing adjustment where no transfer pricing documentation was maintained under Section 92D.",
                        "Recording of fake purchase invoices obtained from accommodation entry operators."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "Under Section 270A(6)(a), under-reported income does not include the amount of income in respect of which the assessee offers an explanation that is bona fide and where the assessee has disclosed all material facts to substantiate the explanation."
                }
            },
            {
                "title": "Mandatory Statutory Immunity under Section 270AA & Penalty Waiver under Section 273A",
                "say": [
                    "One of the most powerful and transformative statutory remedies enacted for corporate taxpayers is the immunity mechanism codified in Section 270AA of the Income-tax Act, 1961. Introduced by the Finance Act, 2016, Section 270AA provides a statutory route for taxpayers to achieve absolute finality, immunity from penalty under Section 270A, and immunity from criminal prosecution under Section 276C (willful attempt to evade tax) or Section 276CCC (failure to furnish returns in search cases).",
                    "To secure statutory immunity under Section 270AA, the assessee must fulfill three cumulative statutory conditions codified in sub-section (1): First, the assessee must pay the tax and interest payable as per the notice of demand issued under Section 156 within the period specified in such notice (typically thirty days from the date of service). Second, the assessee must not prefer an appeal against the assessment or reassessment order under Section 246A before the Commissioner of Income-tax (Appeals). Third, the assessee must make an electronic application to the Assessing Officer in Form No. 68 within one month from the end of the month in which the assessment order is received.",
                    "The legal effect of a valid Section 270AA application is non-discretionary and mandatory in nature. Under Section 270AA(3), where the application is made in respect of an order where penalty proceedings under Section 270A have not been initiated on the grounds of 'misreporting of income' referred to in sub-section (9) of Section 270A, the Assessing Officer 'shall grant immunity from imposition of penalty under Section 270A and initiation of proceedings under Section 276C or Section 276CCC'. The statute uses the mandatory verb 'shall' rather than discretionary language. As held by High Courts across the country—most notably the Delhi High Court in Schneider Electric and Ultimate Infratech—where the assessment order does not contain a specific charge of misreporting under Section 270A(9), the Assessing Officer has no legal jurisdiction or discretion to reject an immunity application under Section 270AA.",
                    "Conversely, Section 270AA(3) contains an explicit statutory bar: the Assessing Officer shall not grant immunity where the penalty proceedings have been initiated for misreporting of income under Section 270A(9). Where the Assessing Officer rejects an application under Section 270AA, they are statutorily required under Section 270AA(4) to pass an order in writing recording the reasons for such rejection, within a period of one month from the end of the month in which the application in Form 68 was received, after giving the assessee an opportunity of being heard. Crucially, where an application under Section 270AA is rejected, the period between the date of filing Form 68 and the date of receipt of the rejection order is excluded in computing the thirty-day limitation for filing a regular appeal under Section 246A, preserving the taxpayer's constitutional right to appellate review.",
                    "In addition to Section 270AA immunity, Section 273A confers extraordinary discretionary powers upon the Principal Chief Commissioner, Chief Commissioner, Principal Commissioner, or Commissioner to reduce or waive penalties. Under Section 273A(1) and (4), the commissioner may waive penalties if the assessee voluntarily made full and true disclosure of income in good faith prior to detection, paid or made satisfactory arrangements for payment of tax, and co-operated in all subsequent proceedings. While Section 273A represents an extraordinary equitable power invoked in distress cases, Section 270AA is a matter of statutory right that forms the core of modern corporate tax dispute settlements.",
                    "The mandatory nature of Section 270AA was comprehensively reinforced by the Delhi High Court in landmark rulings including Schneider Electric India Pvt. Ltd. and Prem Brothers Infrastructure LLP. The High Court established that where an Assessing Officer merely uses the boilerplate term 'penalty proceedings are initiated separately for under-reporting/misreporting' without specifying the exact statutory clause of Section 270A(9), such notice is legally defective and cannot be converted into a bar against Section 270AA immunity. The Court held that if the assessee satisfies the objective requirements of Section 270AA(1)—payment of demanded tax, waiver of appeal, and filing of Form 68 within thirty days—the Assessing Officer has no statutory power to arbitrarily reject immunity. If the Assessing Officer attempts to reject Form 68 by inventing a retrospective allegation of misreporting, the High Court will issue a writ of mandamus under Article 226 directing the Revenue to grant absolute immunity from penalties and prosecution."
                ],
                "check": {
                    "question": "What is the legal consequence when an assessee files a timely Form 68 under Section 270AA, pays the demanded tax, waives appeal, and the penalty was initiated for under-reporting (not misreporting)?",
                    "options": [
                        "The Assessing Officer is statutorily mandated to grant immunity from penalty and prosecution.",
                        "The Assessing Officer retains discretionary authority to reject the application without stating reasons.",
                        "The case is automatically transferred to the National Investigation Agency for inquiry.",
                        "The assessee must pay an additional twenty percent compounding fee to the CBDT."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "Under Section 270AA(3), the Assessing Officer 'shall' grant immunity from penalty under Section 270A and prosecution under Section 276C/276CCC where the statutory conditions are met and penalty proceedings were not initiated for misreporting under Section 270A(9)."
                }
            },
            {
                "title": "Section 271AAD False Entry Penalties & Criminal Prosecutions under Chapter XXII",
                "say": [
                    "To dismantle the pervasive menace of fake invoicing, bogus accommodation bills, and fraudulent input tax credit syndicates that straddle both direct taxation and GST, Parliament enacted Section 271AAD through the Finance Act, 2020 (further fortified by the Finance Act, 2021). Section 271AAD represents one of the most formidable anti-abuse weapons in the direct tax arsenal, operating with uncompromising strict liability.",
                    "Under Section 271AAD(1), if during any proceeding under the Act, it is found that in the books of account maintained by any person, there is: (i) a false entry; or (ii) an omission of any entry which is relevant for computation of total income of such person, to mitigate tax liability, the Assessing Officer may direct that such person shall pay by way of penalty a sum which shall be equal to the aggregate amount of such false or omitted entry. Notice the financial scale: the penalty under Section 271AAD is not computed as a percentage of tax evaded; it is levied as a flat 100% of the entire invoice or entry amount itself.",
                    "Crucially, Section 271AAD(2) extends this liability beyond the primary assessee to any other person who causes the false entry to be made: 'Without prejudice to the provisions of sub-section (1), the Assessing Officer may direct that any other person, who causes the person referred to in sub-section (1) in any manner to make a false entry or omits or causes to omit any entry, shall pay by way of penalty a sum which shall be equal to the aggregate amount of such false or omitted entry.' This provision enables tax authorities to penalize accommodation entry providers, entry operators, chartered accountants, and dummy directors who orchestrate fake bills, holding them personally liable for a penalty equal to the face value of the bogus transactions.",
                    "The Explanation to Section 271AAD defines 'false entry' to include use or intention to use: (a) forged or falsified documents such as a false invoice or, in general, a false piece of evidence; or (b) invoice in respect of supply or receipt of goods or services or both issued by the person or any other person without actual supply or receipt of such goods or services; or (c) invoice in respect of supply or receipt of goods or services or both to, or from, a person who does not exist. The penalty under Section 271AAD is independent of and in addition to any addition under Section 68 or Section 69C, and falls outside the scope of Section 270AA immunity.",
                    "Where tax evasion transcends civil penalties and involves willful criminal conduct, the tax administration initiates criminal prosecutions under Chapter XXII of the Act. Under Section 276C(1), if a person willfully attempts in any manner to evade any tax, penalty, or interest, they shall be punishable: (i) where the amount sought to be evaded exceeds twenty-five lakh rupees (INR 2,500,000), with rigorous imprisonment for a term which shall not be less than six months but which may extend to seven years and with fine; and (ii) in any other case, with rigorous imprisonment for a term between three months and two years and with fine. Other major prosecution provisions include Section 276B (failure to pay TDS to the government credit), Section 277 (false statement in verification or delivery of false accounts), and Section 278 (abetment of false return).",
                    "To mitigate criminal exposure, corporate directors must understand the statutory defense under Section 278AA: no person shall be punishable for any failure referred to in Section 276A, 276AB, or 276B if they prove that there was 'reasonable cause' for such failure. Furthermore, under Section 279(2), any offense under Chapter XXII may, either before or after the institution of proceedings, be compounded by the Principal Chief Commissioner or Chief Commissioner or Director General in accordance with CBDT compounding guidelines upon payment of prescribed compounding fees and prosecution establishment costs."
                ],
                "check": {
                    "question": "What is the quantum of penalty levied under Section 271AAD on an assessee who records a false purchase entry in their books of account?",
                    "options": [
                        "A penalty equal to one hundred percent of the aggregate amount of the false entry.",
                        "Fifty percent of the tax payable on the resulting income addition.",
                        "A maximum fine of one lakh rupees per financial year.",
                        "Ten percent of the corporate gross turnover."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "Under Section 271AAD(1), the penalty for a false entry or omitted entry is equal to the aggregate amount of such false or omitted entry (100% of the entry value itself, not just the tax)."
                }
            },
            {
                "title": "Production Python Architecture: Section 270A Penalty & Section 270AA Immunity Simulator",
                "say": [
                    "In enterprise tax risk management, calculating potential penalty exposures and executing timely Section 270AA statutory immunity applications requires rigorous algorithmic precision. In this module, we develop a production-grade Python simulation architecture, TaxPenaltyComplianceEngine, that analyzes assessment variations, classifies additions into under-reporting versus misreporting under Section 270A(9), evaluates Section 270A(6) safe harbours, determines Section 270AA Form 68 eligibility, and computes Section 271AAD exposure.",
                    "The engine enforces four statutory workflows: First, the Classification Gate: evaluating each addition against Section 270A(9) misreporting categories (misrepresentation, false entry, omitted receipts, unrecorded investments, unsubstantiated expenditure, or unreported international transactions). If an addition matches any of these gateways, it is classified as misreporting (200% penalty); otherwise, it is classified as under-reporting (50% penalty). Second, the Safe Harbour Evaluator: checking additions against Section 270A(6) criteria (bona fide explanations with substantiated material facts or compliant transfer pricing documentation), exempting compliant items from all Section 270A penalties. Third, the Section 270AA Immunity Evaluator: verifying whether all non-exempt additions consist solely of under-reporting, whether the tax demand was paid within 30 days, whether an appeal was waived, and whether Form 68 was filed within one month. Fourth, the Section 271AAD False Entry Engine: levying a 100% penalty on the face value of accommodation invoices.",
                    "Let us examine the complete, executable Python architecture implementing these statutory mechanics:",
                    "```python",
                    "from dataclasses import dataclass",
                    "from typing import Dict, List, Optional",
                    "",
                    "@dataclass",
                    "class TaxAddition:",
                    "    issue_name: str",
                    "    addition_amount: float",
                    "    is_bona_fide_explanation: bool",
                    "    has_substantiated_facts: bool",
                    "    is_transfer_pricing_compliant: bool",
                    "    misreporting_gateway: Optional[str]  # 'suppression', 'false_entry', 'unrecorded_asset', 'unsubstantiated_exp', etc.",
                    "    is_section_271aad_false_entry: bool = False",
                    "",
                    "class TaxPenaltyComplianceEngine:",
                    "    def __init__(self, assessee_name: str, corporate_tax_rate: float = 0.25168):",
                    "        # Base 22% + 10% surcharge + 4% cess = 25.168% for Section 115BAA companies",
                    "        self.assessee = assessee_name",
                    "        self.tax_rate = corporate_tax_rate",
                    "        self.additions: List[TaxAddition] = []",
                    "        self.tax_demand_paid_within_30d: bool = False",
                    "        self.appeal_waived: bool = False",
                    "        self.form_68_filed_within_1m: bool = False",
                    "",
                    "    def add_variation(self, issue: str, amount: float, bona_fide: bool, substantiated: bool, tp_compliant: bool, misreporting_code: Optional[str], is_false_entry: bool = False):",
                    "        self.additions.append(TaxAddition(issue, amount, bona_fide, substantiated, tp_compliant, misreporting_code, is_false_entry))",
                    "",
                    "    def set_settlement_actions(self, paid_30d: bool, appeal_waived: bool, form68_filed: bool):",
                    "        self.tax_demand_paid_within_30d = paid_30d",
                    "        self.appeal_waived = appeal_waived",
                    "        self.form_68_filed_within_1m = form68_filed",
                    "",
                    "    def audit_penalties(self) -> Dict[str, any]:",
                    "        exempt_additions = 0.0",
                    "        under_reporting_additions = 0.0",
                    "        misreporting_additions = 0.0",
                    "        sec271aad_penalties = 0.0",
                    "        itemized_results = []",
                    "",
                    "        for item in self.additions:",
                    "            # Check Section 271AAD false entry penalties (100% of entry amount)",
                    "            if item.is_section_271aad_false_entry:",
                    "                sec271aad_penalties += item.addition_amount",
                    "",
                    "            # Check Section 270A(6) Safe Harbours",
                    "            if (item.is_bona_fide_explanation and item.has_substantiated_facts) or item.is_transfer_pricing_compliant:",
                    "                exempt_additions += item.addition_amount",
                    "                itemized_results.append({'issue': item.issue_name, 'status': 'EXEMPT_SEC_270A_6', 'penalty_inr': 0.0})",
                    "            elif item.misreporting_gateway is not None:",
                    "                misreporting_additions += item.addition_amount",
                    "                tax_on_item = item.addition_amount * self.tax_rate",
                    "                penalty_200 = tax_on_item * 2.00",
                    "                itemized_results.append({'issue': item.issue_name, 'status': f'MISREPORTING_SEC_270A_9_{item.misreporting_gateway}', 'penalty_inr': round(penalty_200, 2)})",
                    "            else:",
                    "                under_reporting_additions += item.addition_amount",
                    "                tax_on_item = item.addition_amount * self.tax_rate",
                    "                penalty_50 = tax_on_item * 0.50",
                    "                itemized_results.append({'issue': item.issue_name, 'status': 'UNDER_REPORTING_SEC_270A_1', 'penalty_inr': round(penalty_50, 2)})",
                    "",
                    "        # Calculate tax and penalties",
                    "        tax_on_under_reporting = under_reporting_additions * self.tax_rate",
                    "        penalty_under_reporting_50 = tax_on_under_reporting * 0.50",
                    "",
                    "        tax_on_misreporting = misreporting_additions * self.tax_rate",
                    "        penalty_misreporting_200 = tax_on_misreporting * 2.00",
                    "",
                    "        total_base_tax = (under_reporting_additions + misreporting_additions) * self.tax_rate",
                    "        gross_penalty = penalty_under_reporting_50 + penalty_misreporting_200 + sec271aad_penalties",
                    "",
                    "        # Evaluate Section 270AA Immunity Eligibility",
                    "        is_eligible_for_270aa = (",
                    "            misreporting_additions == 0.0 and",
                    "            self.tax_demand_paid_within_30d and",
                    "            self.appeal_waived and",
                    "            self.form_68_filed_within_1m",
                    "        )",
                    "",
                    "        final_penalty = penalty_misreporting_200 + sec271aad_penalties if is_eligible_for_270aa else gross_penalty",
                    "        savings_from_immunity = penalty_under_reporting_50 if is_eligible_for_270aa else 0.0",
                    "",
                    "        return {",
                    "            'assessee': self.assessee,",
                    "            'total_disputed_additions_inr': sum(i.addition_amount for i in self.additions),",
                    "            'exempt_safe_harbour_inr': exempt_additions,",
                    "            'under_reporting_additions_inr': under_reporting_additions,",
                    "            'misreporting_additions_inr': misreporting_additions,",
                    "            'total_base_tax_inr': round(total_base_tax, 2),",
                    "            'penalty_under_reporting_inr': round(penalty_under_reporting_50, 2),",
                    "            'penalty_misreporting_inr': round(penalty_misreporting_200, 2),",
                    "            'section_271aad_penalty_inr': round(sec271aad_penalties, 2),",
                    "            'is_eligible_for_section_270aa_immunity': is_eligible_for_270aa,",
                    "            'savings_from_form_68_immunity_inr': round(savings_from_immunity, 2),",
                    "            'final_net_penalty_payable_inr': round(final_penalty, 2),",
                    "            'itemized_breakdown': itemized_results",
                    "        }",
                    "```",
                    "This computational architecture empowers corporate tax directors to perform real-time sensitivity analysis when evaluating whether to contest an assessment order in appellate litigation or pay the demanded tax and secure permanent immunity under Section 270AA, optimizing enterprise cash flow and insulating executives from criminal liability."
                ],
                "check": {
                    "question": "In TaxPenaltyComplianceEngine, what happens to the fifty percent under-reporting penalty when an assessee qualifies for Section 270AA immunity in Form 68?",
                    "options": [
                        "The under-reporting penalty is completely waived (reduced to zero) by mandatory operation of law.",
                        "The under-reporting penalty is converted into a mandatory twenty-five percent administrative fee.",
                        "The under-reporting penalty is escalated to two hundred percent due to failure to appeal.",
                        "The penalty remains payable but is deferred for three subsequent financial years."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "Under Section 270AA(3), where the statutory conditions are satisfied and penalty was initiated for under-reporting, the Assessing Officer is statutorily required to grant immunity, reducing the Section 270A penalty to zero."
                }
            }
        ]
    }
    return day49

if __name__ == '__main__':
    data = get_day49_data()
    print(f"Day 49 Title: {data['title']}")
    print(f"Parts count: {len(data['parts'])}")
    for i, p in enumerate(data['parts']):
        words = len(" ".join(p['say']).split())
        print(f"Part {i+1}: {words} words")
