"""
Day 53 Curriculum Expansion Generator:
Course: bcom_tax (Corporate Tax Planning, MAT, DTAA, Transfer Pricing & GST)
Day 53: Income Tax Appellate Tribunal (ITAT) Architecture: Constitution, Jurisdiction & Appeals under Section 253 & 254
"""

import sys

def get_day53_data():
    day53 = {
        "day": 53,
        "coursePrefix": "bcom_tax",
        "minutes": 38,
        "title": "Income Tax Appellate Tribunal (ITAT) Architecture: Constitution, Jurisdiction & Appeals under Section 253 & 254",
        "description": "Master the institutional constitution, jurisdictional powers, and appellate advocacy before the Income Tax Appellate Tribunal (ITAT). Understand Section 252 bench structures, Section 253 appealable orders, Form 36 and Form 36A cross-objections mechanics, Section 254(2A) stay of demand regimes post-Pepsi Foods, and Section 254(2) rectification protocols.",
        "parts": [
            {
                "title": "Institutional Hierarchy & The Final Fact-Finding Authority Doctrine under Section 252 & 253",
                "say": [
                    "The Income Tax Appellate Tribunal (ITAT) occupies a preeminent constitutional and statutory position in the Indian direct tax administration. Established in 1941 under Section 252 of the Income-tax Act, 1961, the ITAT is the oldest quasi-judicial tribunal in the country, operating not under the Ministry of Finance, but under the administrative supervision of the Ministry of Law and Justice. This institutional separation is a deliberate constitutional design that guarantees judicial independence from the executive revenue administration. Under Section 252, the Tribunal consists of Judicial Members and Accountant Members appointed by the Central Government, headed by a President and Senior Vice-Presidents. A standard Division Bench consists of one Judicial Member and one Accountant Member, ensuring a sophisticated synthesis of legal jurisprudence and commercial accounting acumen.",
                    "The cardinal principle governing the ITAT's jurisdiction is its status as the supreme and final fact-finding authority in the direct tax hierarchy. In an unbroken line of constitutional jurisprudence—from the Supreme Court's landmark rulings in CIT v. Scindia Steam Navigation Co. Ltd. to Ajay Gandhi v. B. Singh—it has been settled beyond debate that the findings of fact recorded by the Tribunal are final, conclusive, and binding on both the taxpayer and the Revenue. Neither the High Court under Section 260A nor the Supreme Court under Article 136 can reappreciate, reweigh, or substitute its own factual inferences for those arrived at by the Tribunal, unless the appellant demonstrates that the Tribunal's findings are perverse, based on no evidence, or arrived at by ignoring vital material on record.",
                    "Because higher constitutional courts exercise jurisdiction solely over 'substantial questions of law', the ITAT represents the assessee's final judicial forum for marshalling factual evidence, cross-examining valuations, establishing commercial substance, and proving economic nexus. If a corporate assessee fails to establish its factual case before the Tribunal—such as establishing the arm's length nature of a cross-border management fee or proving the commercial rationale for a corporate restructuring—that factual door is irrevocably slammed shut for all future appellate tiers.",
                    "The appellate jurisdiction of the Tribunal is codified in Section 253. Under Section 253(1), an assessee aggrieved by specific statutory orders possesses an absolute right of appeal to the ITAT. The appealable orders include: (a) orders passed by the Commissioner of Income-tax (Appeals) under Section 250 or Section 270A; (b) final assessment orders passed by the Assessing Officer in pursuance of directions of the Dispute Resolution Panel under Section 144C(13); (c) revisionary orders passed by the Principal Commissioner or Commissioner under Section 263 exercising revisionary powers prejudicial to revenue; (d) orders passed by the Principal Commissioner or Commissioner under Section 271 or Section 272A; and (e) orders rejecting registration of charitable trusts under Section 12AB or Section 80G.",
                    "Crucially, under Section 253(2), the direct tax statute grants a reciprocal right of appeal to the Revenue. The Principal Commissioner or Commissioner may, if they object to any order passed by the CIT(Appeals) under Section 250, direct the Assessing Officer to lodge an appeal to the Appellate Tribunal against that order. However, unlike the assessee who can appeal against any adverse order, departmental appeals are circumscribed by mandatory CBDT monetary limits and litigation policy guidelines designed to eliminate frivolous low-value tax litigation.",
                    "Furthermore, under Section 255, the President of the ITAT is empowered to constitute Special Benches consisting of three or more members to resolve substantial legal conflicts between coordinate Division Benches. When two Division Benches of the Tribunal take diametrically conflicting views on an intricate corporate tax question—such as the characterization of software payments under Section 9(1)(vi) or the deductibility of ESOP expenses under Section 37(1)—the President refers the question to a Special Bench, whose ruling binds all Division Benches across the territory of India."
                ],
                "check": {
                    "question": "What is the legal significance of the ITAT being the final fact-finding authority in the direct tax judicial hierarchy?",
                    "options": [
                        "Findings of fact recorded by the ITAT are conclusive and cannot be disturbed by the High Court under Section 260A unless proven perverse.",
                        "The ITAT can override the Constitution of India and issue criminal warrants against tax officers.",
                        "The High Court automatically conducts a de novo factual trial for every appeal decided by the ITAT.",
                        "The Assessing Officer has the legal authority to revise the ITAT's factual findings under Section 154."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "The ITAT is the supreme and final fact-finding authority; under Section 260A, High Courts only hear substantial questions of law, meaning ITAT factual determinations cannot be disturbed unless legally perverse."
                }
            },
            {
                "title": "Form 36 Mechanics, Timelines & Cross-Objections Architecture under Section 253(4)",
                "say": [
                    "Initiating an appeal before the Income Tax Appellate Tribunal requires strict adherence to statutory pleadings, standardized formats, and mandatory procedural timelines codified in Section 253 and the Income-tax (Appellate Tribunal) Rules, 1963. Under Section 253(3), every appeal to the Appellate Tribunal must be filed within sixty days of the date on which the order sought to be appealed against is communicated to the assessee or to the Principal Commissioner or Commissioner. While the Tribunal is vested with discretionary power under Section 253(5) to condone delays upon showing 'sufficient cause', corporate appellants must treat the sixty-day window as an uncompromised statutory imperative.",
                    "The appeal is lodged by filing Form No. 36 electronically through the ITAT e-filing portal, accompanied by physical paper books where required by local bench standing orders. Form 36 embodies the formal memorandum of appeal and must be drafted with precision. It comprises two foundational components: the Statement of Facts and the Grounds of Appeal. In ITAT advocacy, the Grounds of Appeal must be concise, distinct, and sequentially numbered, setting forth each challenge to the impugned order without argumentative prose. For example, in a transfer pricing appeal, grounds must specifically challenge the cherry-picking of comparables, erroneous turnover filters, denial of working capital adjustments, and non-grant of the +/- 3% arm's length tolerance range under the second proviso to Section 92C(2).",
                    "Under Section 253(6), the filing of Form 36 must be accompanied by the prescribed statutory fee, which is scaled according to the total income assessed by the Assessing Officer: (a) where the assessed income is INR 1,00,000 or less, the fee is INR 500; (b) where the assessed income is between INR 1,00,000 and INR 2,00,000, the fee is INR 1,500; (c) where the assessed income exceeds INR 2,00,000, the fee is calculated at 1% of the assessed income, subject to a statutory cap of INR 10,000; (d) for penalty or miscellaneous appeals, the fee is INR 500. This graduated fee structure reflects Parliament's policy of keeping the tribunal accessible while imposing moderate costs on high-value corporate disputes.",
                    "A vital strategic weapon in ITAT litigation is the Memorandum of Cross-Objections codified in Section 253(4). The direct tax statute recognizes that when one party appeals against an order, the opposing party may have grievances regarding findings that went against them or may wish to support the order on alternative grounds. Under Section 253(4), upon receipt of notice that an appeal has been preferred to the Appellate Tribunal by the other party, the respondent may, notwithstanding that they have not appealed against such order, file a memorandum of cross-objections in Form No. 36A within thirty days of the date of receipt of notice.",
                    "The legal character of a cross-objection under Section 253(4) is profound: it is treated in law as an independent cross-appeal. Under the direct tax code, no statutory fee is payable on a memorandum of cross-objections. Furthermore, even if the main appeal is subsequently withdrawn or dismissed for default, the cross-objection survives and must be adjudicated on merits by the Tribunal. For corporate assessees who received substantial relief from the CIT(Appeals) but lost on a minor threshold issue, filing Form 36A upon receiving the Department's appeal notice provides an indispensable vehicle to re-open the adverse finding without paying appeal fees.",
                    "Additionally, under Rule 27 of the Income-tax (Appellate Tribunal) Rules, 1963, a respondent who has neither appealed nor filed cross-objections may still support the order appealed against on any of the grounds decided against them by the lower authority. This procedural shield allows corporate counsel to defend a favorable tax order by urging alternative legal grounds that the CIT(Appeals) may have erroneously rejected or omitted to consider."
                ],
                "check": {
                    "question": "What is the statutory limitation period and form for filing a Memorandum of Cross-Objections before the ITAT under Section 253(4)?",
                    "options": [
                        "Within thirty days of receipt of notice of appeal from the ITAT, filed in Form No. 36A with zero filing fee.",
                        "Within sixty days of the draft assessment order, filed in Form 35 with a ten-thousand-rupee fee.",
                        "Within ninety days of the financial year end, filed in Form 3CEB with the Central Board of Direct Taxes.",
                        "Within forty-five days of the board meeting, filed as a High Court writ petition under Article 226."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "Under Section 253(4), cross-objections must be filed in Form No. 36A within thirty days of receipt of notice of appeal, and no statutory fee is payable under Section 253(6)."
                }
            },
            {
                "title": "Stay of Demand Jurisprudence under Section 254(2A) & The 20% Mandatory Deposit Regime",
                "say": [
                    "In high-stake corporate direct tax disputes, the issuance of a final assessment order with a Section 156 notice of demand poses immediate insolvency and liquidity risks. The filing of an appeal before the ITAT does not operate as an automatic stay of demand. Consequently, corporate appellants must invoke the statutory stay jurisdiction of the Appellate Tribunal codified under Section 254(2A) of the Act. Historically, the ITAT exercised inherent judicial power to grant unconditional or conditional stays of demand to protect the subject matter of the appeal and prevent irreparable injury to the taxpayer.",
                    "However, direct tax legislation introduced stringent statutory restrictions through successive Finance Acts, culminating in the controversial first proviso to Section 254(2A) enacted by the Finance Act, 2020. Under this amended proviso: 'the Appellate Tribunal may, after considering the merits of the application made by the assessee, pass an order of stay for a period not exceeding one hundred and eighty days, subject to the condition that the assessee deposits not less than twenty per cent of the amount of tax, interest, fee, penalty, or any other sum payable under the provisions of this Act, or furnishes security of equal value.' This 20% deposit requirement transformed the discretionary stay jurisdiction into a rigid statutory pre-condition.",
                    "Prior to this amendment, the CBDT had issued administrative Office Memoranda (dated February 29, 2016, and July 31, 2017) instructing Assessing Officers to grant administrative stay upon the taxpayer depositing 15% (subsequently raised to 20%) of the disputed demand. In the landmark ruling of Principal CIT v. LG Electronics India Pvt. Ltd., the Supreme Court held that the administrative instruction does not fetter the quasi-judicial discretion of appellate authorities to grant a stay on lower deposits or zero deposit in cases of patent illegality or severe financial hardship. However, with the explicit incorporation of the 20% condition into the first proviso to Section 254(2A), the statutory requirement became mandatory for the Tribunal.",
                    "The duration of stay orders is governed by the second and third provisos to Section 254(2A). Under the second proviso, if the appeal is not disposed of within the initial stay period (up to 180 days), the Tribunal may extend the stay upon an application by the assessee, provided the delay in disposing of the appeal is not attributable to the assessee. The total period of stay granted, including any extensions, cannot exceed three hundred and sixty-five days. Under the original third proviso, if the appeal was not disposed of within 365 days, the stay stood automatically vacated by operation of law, even if the delay was caused entirely by the Tribunal's roster or the Revenue's adjournments.",
                    "This draconian automatic vacation clause was subjected to fierce constitutional challenge. In the historic judgment of Deputy Commissioner of Income-tax v. Pepsi Foods Ltd. (Civil Appeal No. 1106 of 2021), the Supreme Court of India struck down the third proviso to Section 254(2A) as unconstitutional, discriminatory, and violative of Article 14 of the Constitution. The Supreme Court held that automatically vacating a stay of demand when the taxpayer was blameless and ready to proceed with the hearing is arbitrary and irrational. The court ruled that where the delay in disposing of the appeal is not attributable to the assessee, the Appellate Tribunal retains the constitutional and inherent power to extend the stay beyond 365 days until the final disposal of the appeal.",
                    "To secure a stay of demand before the ITAT, corporate counsel must file a formal Stay Petition under Rule 35A of the ITAT Rules. The petition must prove three foundational legal tests: (1) Prima Facie Case: establishing that the assessment order is based on perverse findings, settled judicial contradictions, or clear jurisdictional defects; (2) Balance of Convenience: demonstrating that the Revenue will not suffer prejudice if recovery is deferred, supported by corporate balance sheet solvency; and (3) Irreparable Injury: proving that recovering the disputed demand (often running into hundreds of crores) will disrupt ongoing operations, trigger working capital default, or freeze vital credit lines."
                ],
                "check": {
                    "question": "What was the landmark ruling of the Supreme Court of India in DCIT v. Pepsi Foods Ltd. regarding Section 254(2A)?",
                    "options": [
                        "The Supreme Court struck down the automatic vacation of stay after 365 days as unconstitutional where delay is not attributable to the assessee.",
                        "The Supreme Court declared that all ITAT stay petitions are illegal and assessees must pay 100% demand upfront.",
                        "The Supreme Court held that the ITAT possesses no power to grant any stay of demand under the Income-tax Act.",
                        "The Supreme Court ruled that foreign companies are exempt from all tax demands during the pendency of appeals."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "In DCIT v. Pepsi Foods Ltd. (2021), the Supreme Court struck down the third proviso to Section 254(2A) as arbitrary and unconstitutional, holding that stay can be extended beyond 365 days if the delay is not attributable to the assessee."
                }
            },
            {
                "title": "Rectification of Mistake Apparent from the Record under Section 254(2) & Miscellaneous Applications",
                "say": [
                    "Once the Income Tax Appellate Tribunal pronounces its final order under Section 254(1), it becomes functus officio with respect to that proceeding. The Tribunal possesses no statutory power of substantive review; it cannot reconsider its judicial findings, re-evaluate evidence, or overturn its conclusions on merits merely because a party is dissatisfied with the outcome. However, Parliament recognized that inadvertent administrative, factual, or clerical errors may infect tribunal orders. To remedy such specific defects without necessitating an expensive High Court appeal, Section 254(2) provides a targeted statutory mechanism: Rectification of Mistake Apparent from the Record.",
                    "Under Section 254(2), the Appellate Tribunal may, 'at any time within six months from the end of the month in which the order was passed, with a view to rectifying any mistake apparent from the record, amend any order passed by it under sub-section (1), and shall make such amendment if the mistake is brought to its notice by the assessee or the Assessing Officer.' This proceeding is formally initiated by filing a Miscellaneous Application (MA) before the specific Division Bench that authored the original appellate order. Prior to the Finance Act, 2016, the limitation period was four years; Parliament drastically truncated this to six months from the end of the month in which the order was passed, enforcing rapid finality in tribunal proceedings.",
                    "The jurisdictional boundary of Section 254(2) is defined by the strict legal phrase 'mistake apparent from the record'. In an unbroken line of Supreme Court jurisprudence—including T.S. Balaram v. Volkart Brothers and CIT v. Reliance Telecom Ltd.—it has been established that a mistake apparent from the record must be an obvious, patent, and glaring error. It cannot be something that requires a protracted process of reasoning, elaborate argument, or debate on points where two opinions are conceivable. An application under Section 254(2) cannot be a disguised appeal or an attempt to seek a rehearing of the matter.",
                    "Crucially, judicial precedents have firmly established what qualifies as a mistake apparent from the record under Section 254(2). The following situations constitute classic rectifiable errors: (a) Non-consideration of a specific, recorded ground of appeal or vital piece of evidence argued during the hearing; (b) Non-consideration of a binding judgment of the jurisdictional High Court or the Supreme Court rendered prior to the date of the Tribunal's order; (c) Retrospective statutory amendments enacted by Parliament that alter the legal basis of the issue decided; (d) Arithmetical, clerical, or computational errors in the Tribunal's operative directions; and (e) Disposal of an appeal ex parte without proper service of notice on the assessee in violation of Rule 24 of the ITAT Rules.",
                    "Where the Tribunal admits a Miscellaneous Application under Section 254(2), the scope of its remedial power is strictly circumscribed. Under the second proviso to Section 254(2), an amendment which has the effect of enhancing an assessment or reducing a refund or otherwise increasing the liability of the assessee shall not be made unless the Tribunal has given notice to the assessee of its intention to do so and has allowed the assessee a reasonable opportunity of being heard. If an MA is filed on grounds of non-consideration of a binding precedent, the Tribunal typically recalls the specific portion of the order and fixes the appeal for a limited rehearing on that isolated issue.",
                    "If the six-month limitation period under Section 254(2) expires, the Tribunal loses all statutory jurisdiction to entertain a Miscellaneous Application. As held by the Special Bench in Manoj Ahuja and affirmed by various High Courts, the six-month timeline is absolute; neither the Tribunal nor the Registry has power to condone delay in filing an MA under Section 254(2). In such instances, the aggrieved party's sole remaining legal remedy is to file an appeal before the High Court under Section 260A on a substantial question of law, contending that the Tribunal committed a grave error of law by ignoring binding precedents or material evidence."
                ],
                "check": {
                    "question": "What is the statutory limitation period for filing a Miscellaneous Application for rectification of mistake under Section 254(2)?",
                    "options": [
                        "Within six months from the end of the month in which the order was passed by the ITAT.",
                        "Within four years from the date of filing the original Form 36 appeal.",
                        "Within sixty days from the date of receiving the draft assessment order.",
                        "Within one year from the end of the financial year in which tax was deducted."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "Under Section 254(2) as amended by Finance Act 2016, a rectification application must be brought within six months from the end of the month in which the order was passed."
                }
            },
            {
                "title": "Production Python Architecture: ITAT Appeal & Stay of Demand Litigation Engine",
                "say": [
                    "Managing an enterprise portfolio of high-stakes corporate tax appeals before the Income Tax Appellate Tribunal requires automated tracking of limitation deadlines, filing fees, cross-objection windows, and statutory stay requirements. In this final module, we develop a production-ready computational Python architecture, ITATAppellateEngine, that operationalizes Section 253, Section 254(2A), and Section 254(2) workflows for corporate tax directors.",
                    "The system encapsulates five core statutory modules: First, the Form 36 Appeal & Fee Calculator: verifying the sixty-day limitation from communication of the lower order, calculating graduated filing fees under Section 253(6) with the INR 10,000 statutory cap, and auditing ground-formatting invariants. Second, the Form 36A Cross-Objection Orchestrator: monitoring the thirty-day limitation window from receipt of departmental appeal notice under Section 253(4) and tracking independent survival of cross-objections. Third, the Section 254(2A) Stay of Demand Compliance Engine: computing the mandatory 20% statutory deposit on disputed demand, generating stay petition parameters under Rule 35A, and modeling liquidity exposure. Fourth, the 365-Day Pepsi Foods Limitation Watchdog: tracking elapsed stay days and applying the Supreme Court Pepsi Foods doctrine to prevent automatic vacation when delays are attributable to court rosters or revenue requests. Fifth, the Section 254(2) Rectification Clock: computing the absolute six-month deadline from the end of the order month and vetting applications against the Volkart Brothers patent mistake test.",
                    "Let us inspect the complete, executable Python architecture implementing these tribunal mechanics:",
                    "```python",
                    "import calendar",
                    "import datetime",
                    "from dataclasses import dataclass, field",
                    "from typing import Dict, List, Optional",
                    "",
                    "@dataclass",
                    "class DisputedTaxDemand:",
                    "    assessment_year: str",
                    "    base_tax_inr: float",
                    "    interest_234_inr: float",
                    "    penalty_inr: float",
                    "    total_assessed_income_inr: float",
                    "",
                    "    @property",
                    "    def total_demand_inr(self) -> float:",
                    "        return self.base_tax_inr + self.interest_234_inr + self.penalty_inr",
                    "",
                    "class ITATAppellateEngine:",
                    "    def __init__(self, corporate_name: str, demand: DisputedTaxDemand):",
                    "        self.company = corporate_name",
                    "        self.demand = demand",
                    "        self.grounds_of_appeal: List[str] = []",
                    "",
                    "    def add_ground(self, ground_text: str):",
                    "        self.grounds_of_appeal.append(ground_text)",
                    "",
                    "    def calculate_form36_fee(self) -> float:",
                    "        income = self.demand.total_assessed_income_inr",
                    "        if income <= 100000:",
                    "            return 500.0",
                    "        elif income <= 200000:",
                    "            return 1500.0",
                    "        else:",
                    "            fee = income * 0.01",
                    "            return min(fee, 10000.0)",
                    "",
                    "    def audit_appeal_timelines(self, order_communicated_date: datetime.date, filing_date: datetime.date) -> Dict[str, any]:",
                    "        elapsed_days = (filing_date - order_communicated_date).days",
                    "        is_timely = elapsed_days <= 60",
                    "        statutory_fee = self.calculate_form36_fee()",
                    "        return {",
                    "            'elapsed_days': elapsed_days,",
                    "            'is_timely_section_253_3': is_timely,",
                    "            'statutory_fee_inr': statutory_fee,",
                    "            'fee_status': 'CAPPED_AT_MAXIMUM_INR_10000' if statutory_fee == 10000.0 else 'STANDARD_SCALE'",
                    "        }",
                    "",
                    "    def audit_cross_objection(self, notice_received_date: datetime.date, co_filing_date: datetime.date) -> Dict[str, any]:",
                    "        elapsed_co_days = (co_filing_date - notice_received_date).days",
                    "        is_co_timely = elapsed_co_days <= 30",
                    "        return {",
                    "            'co_elapsed_days': elapsed_co_days,",
                    "            'is_co_timely_section_253_4': is_co_timely,",
                    "            'statutory_fee_inr': 0.0,  # Zero fee under direct tax code",
                    "            'survival_status': 'SURVIVES_INDEPENDENTLY_OF_MAIN_APPEAL'",
                    "        }",
                    "",
                    "    def compute_stay_requirements(self, deposit_percentage: float = 0.20) -> Dict[str, float]:",
                    "        mandatory_deposit = self.demand.total_demand_inr * deposit_percentage",
                    "        stayed_amount = self.demand.total_demand_inr - mandatory_deposit",
                    "        return {",
                    "            'total_demand_inr': self.demand.total_demand_inr,",
                    "            'mandatory_20pct_deposit_inr': mandatory_deposit,",
                    "            'stayed_balance_inr': stayed_amount,",
                    "            'initial_stay_max_days': 180,",
                    "            'max_statutory_stay_days': 365",
                    "        }",
                    "",
                    "    def evaluate_pepsi_foods_extension(self, elapsed_stay_days: int, delay_caused_by_assessee: bool) -> Dict[str, any]:",
                    "        # Supreme Court ruling in DCIT v. Pepsi Foods Ltd. (2021)",
                    "        if elapsed_stay_days > 365:",
                    "            if not delay_caused_by_assessee:",
                    "                status = 'EXTENDABLE_BEYOND_365_DAYS_PEPSI_FOODS_DOCTRINE'",
                    "                valid = True",
                    "            else:",
                    "                status = 'STAY_VACATED_DELAY_ATTRIBUTABLE_TO_ASSESSEE'",
                    "                valid = False",
                    "        else:",
                    "            status = 'WITHIN_STATUTORY_365_DAY_LIMIT'",
                    "            valid = True",
                    "        return {",
                    "            'elapsed_stay_days': elapsed_stay_days,",
                    "            'stay_valid': valid,",
                    "            'pepsi_foods_doctrine_status': status",
                    "        }",
                    "",
                    "    def audit_rectification_ma_deadline(self, order_passed_date: datetime.date, ma_filing_date: datetime.date) -> Dict[str, any]:",
                    "        passed_year = order_passed_date.year",
                    "        passed_month = order_passed_date.month",
                    "        last_day_of_order_month = calendar.monthrange(passed_year, passed_month)[1]",
                    "        end_of_order_month = datetime.date(passed_year, passed_month, last_day_of_order_month)",
                    "",
                    "        # 6 calendar months from end of month",
                    "        target_month = passed_month + 6",
                    "        target_year = passed_year + (target_month - 1) // 12",
                    "        target_month_final = ((target_month - 1) % 12) + 1",
                    "        target_last_day = calendar.monthrange(target_year, target_month_final)[1]",
                    "        ma_deadline = datetime.date(target_year, target_month_final, target_last_day)",
                    "",
                    "        is_ma_timely = ma_filing_date <= ma_deadline",
                    "        return {",
                    "            'order_passed_date': order_passed_date.isoformat(),",
                    "            'ma_statutory_deadline_section_254_2': ma_deadline.isoformat(),",
                    "            'is_ma_timely': is_ma_timely,",
                    "            'standard_of_review': 'VOLKART_BROTHERS_PATENT_MISTAKE_ONLY_NO_SUBSTANTIVE_REVIEW'",
                    "        }",
                    "```",
                    "Deploying this computational architecture allows multinational corporate treasuries and taxation departments to manage complex tribunal litigation portfolios with complete procedural integrity. The engine ensures that statutory appeals in Form 36, protective cross-objections in Form 36A, 20% Section 254(2A) stay calculations, and Section 254(2) rectification timelines are calculated with absolute mathematical accuracy, safeguarding enterprise capital against aggressive executive tax demands."
                ],
                "check": {
                    "question": "What is the maximum statutory fee payable under Section 253(6) for filing an appeal in Form 36 before the ITAT where assessed income exceeds two lakh rupees?",
                    "options": [
                        "One per cent of the assessed income, subject to a statutory maximum cap of ten thousand rupees.",
                        "A fixed fee of fifty thousand rupees regardless of income.",
                        "Ten per cent of the disputed tax demand without any cap.",
                        "Five hundred rupees as a nominal administrative charge."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "Under Section 253(6)(c), where the total income assessed exceeds two lakh rupees, the fee is 1% of the assessed income subject to a maximum cap of ten thousand rupees."
                }
            }
        ]
    }
    return day53

if __name__ == '__main__':
    data = get_day53_data()
    print(f"Day 53 Title: {data['title']}")
    print(f"Parts count: {len(data['parts'])}")
    for i, p in enumerate(data['parts']):
        words = len(" ".join(p['say']).split())
        print(f"Part {i+1}: {words} words")
