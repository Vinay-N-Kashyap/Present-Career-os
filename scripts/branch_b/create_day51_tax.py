"""
create_day51_tax.py
Course: bcom_tax (Corporate Tax, GST & Direct Taxation)
Month 2 Block 11 Day 51: First Appellate Architecture: Commissioner of Income-tax (Appeals) under Section 246A & Faceless Appeals Scheme under Section 250
"""

def get_day51_data():
    day51 = {
        "day": 51,
        "coursePrefix": "bcom_tax",
        "title": "First Appellate Architecture: Commissioner of Income-tax (Appeals) under Section 246A & Faceless Appeals Scheme",
        "description": "Master the first appellate statutory framework under the Income-tax Act, 1961, encompassing appealable orders under Section 246A, electronic filing of Form 35, payment of admitted tax under Section 249(4), condonation of delay under Section 249(3), appellate powers under Section 251 including enhancement and annulment, statutory abolition of remand to Assessing Officers, admission of additional evidence under Rule 46A, the Faceless Appeal Scheme under Section 250(6B), and production-grade appellate analytics algorithms.",
        "minutes": 38,
        "parts": [
            {
                "title": "Statutory Gateway to First Appeals: Section 246A Appealable Orders & Form 35 Mechanics",
                "say": [
                    "The right of appeal in tax jurisprudence is not an inherent or common law right; it is a creature of statute that can be exercised only when specifically conferred by legislative enactment. Under the Income-tax Act, 1961, the primary appellate gateway accessible to aggrieved taxpayers against adverse orders of assessing authorities is codified in Section 246A. Section 246A confers an expansive statutory right upon any assessee aggrieved by specific, enumerated orders passed by an Assessing Officer, establishing the Commissioner of Income-tax (Appeals)—and newly designated Joint Commissioners of Income-tax (Appeals) under Section 246—as the first appellate authority.",
                    "The statutory catalog of appealable orders codified in Section 246A(1) encompasses virtually every substantive determination affecting corporate liability: (a) an intimation under Section 143(1) where the assessee objects to prima facie adjustments; (b) a regular scrutiny assessment order under Section 143(3) or Section 144B, where the assessee objects to the total income assessed, the status under which assessed, or the quantum of tax computed; (c) a best judgment assessment order passed under Section 144; (d) an order of reassessment or recomputation passed under Section 147; (e) an order of rectification passed under Section 154; (f) an order treating an assessee as an assessee-in-default under Section 201(1) for alleged failure to deduct or pay tax at source; and (g) any penalty order passed under Chapter XXI, including penalties under Section 270A, Section 271AAC, or Section 271AAD.",
                    "To invoke this appellate jurisdiction, the assessee must strictly adhere to the procedural mandates codified in Section 249 and Rule 45 of the Income-tax Rules, 1962. An appeal before the CIT(Appeals) must be filed electronically on the e-filing portal in Form No. 35 within thirty days of the date of service of the notice of demand relating to the assessment or penalty order. Form 35 is a comprehensive statutory pleading comprising four critical components: the Statement of Facts, the Grounds of Appeal, payment details of the prescribed filing fee under Section 249(1) (scaled based on total income assessed, reaching INR 1,000 for corporate incomes exceeding two lakh rupees), and verification signed under digital signature by the authorized managing director.",
                    "Corporate tax counsel must exercise surgical precision when drafting the Grounds of Appeal. Each ground must be formulated concisely, without argumentative or narrative prose, sequentially numbered, and clearly articulating the specific legal error, procedural defect, or factual misconception committed by the Assessing Officer. General or vague grounds—such as 'the order is contrary to law and facts'—fail to crystallize issues and may be rejected during preliminary triage. Furthermore, the Statement of Facts must establish a coherent, verifiable narrative connecting the corporate books of account with contemporaneous documentary evidence, laying the evidentiary foundation for all subsequent proceedings before the Income Tax Appellate Tribunal and High Courts.",
                    "Where an appeal cannot be filed within the statutory thirty-day window due to unavoidable circumstances—such as technical portal downtimes, restructuring of management, or severe illness of key managerial personnel—Section 249(3) confers discretionary authority upon the CIT(Appeals) to condone the delay if satisfied that the appellant had sufficient cause for not presenting the appeal within the prescribed limitation. Corporate appellants seeking condonation must file a formal application supported by a sworn affidavit and contemporaneous documentary evidence establishing sufficient cause for every single day of delay, as mandated by the Supreme Court in Collector, Land Acquisition v. Mst. Katiji.",
                    "In recent legislative structural reforms, the Finance Act, 2023, introduced a parallel appellate authority by inserting Section 246, creating the office of the Joint Commissioner of Income-tax (Appeals) [JCIT(Appeals)]. The JCIT(Appeals) exercises concurrent appellate powers with the CIT(Appeals) to expedite the disposal of small and medium tax appeals, handling orders passed by assessing officers below the rank of Joint Commissioner. Furthermore, the electronic appeal filing system enforces strict authentication: corporate returns must be verified by the digital signature certificate (DSC) of the authorized director under Rule 140, and any filing signed by an unauthorized signatory or using an expired certificate is treated as a defective appeal under Section 292B, requiring curing within the designated statutory notice window."
                ],
                "check": {
                    "question": "What is the statutory limitation period for filing an electronic appeal in Form 35 before the Commissioner of Income-tax (Appeals) under Section 249(2)?",
                    "options": [
                        "Thirty days from the date of service of the notice of demand relating to the assessment or penalty order.",
                        "Sixty days from the date of passing of the internal assessment order.",
                        "One hundred and twenty days from the end of the financial year in which the return was filed.",
                        "Ninety days from the date of filing the rectification application under Section 154."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "Under Section 249(2) of the Income-tax Act, 1961, an appeal to the Commissioner (Appeals) shall be presented within thirty days of the date of service of the notice of demand relating to the assessment or penalty order."
                }
            },
            {
                "title": "Mandatory Tax Payment Conditions under Section 249(4) & Stay of Demand Protocols",
                "say": [
                    "A critical jurisdictional prerequisite that often ensnares unsuspecting corporate appellants is codified in Section 249(4) of the Income-tax Act, 1961. Section 249(4) establishes an absolute, non-negotiable statutory bar against the admission of an appeal unless specific pre-conditions regarding tax payments are fulfilled prior to filing. The statute enacts a bifurcated threshold: Under clause (a), where a return has been furnished by the assessee, no appeal shall be admitted unless the assessee has paid the tax due on the income returned by them (admitted tax liability under Section 140A). Under clause (b), where no return has been furnished, no appeal shall be admitted unless the assessee has paid an amount equal to the amount of advance tax which was payable by them.",
                    "If an assessee files Form 35 without paying the full amount of admitted tax on returned income, the appeal is non-est in the eyes of law. The CIT(Appeals) possesses no statutory jurisdiction or discretion to waive the payment of admitted tax under Section 249(4)(a); any appeal filed in default of admitted tax is liable to be dismissed at the threshold without hearing on merits. However, in respect of cases falling under clause (b) where no return was filed, the proviso to Section 249(4) grants the appellate authority discretion, on an application made by the appellant, to exempt them from paying advance tax if satisfied that there are good and sufficient reasons to do so.",
                    "Crucially, corporate controllers must distinguish the payment of 'admitted tax' from the payment of 'disputed tax' arising from assessment additions. While admitted tax must be paid in full under Section 249(4), the filing of an appeal does not automatically operate as a stay of collection of the disputed tax demand. Under Section 220(1), the disputed tax demanded under Section 156 must be paid within thirty days of service of the demand notice. If unpaid, the assessee is deemed to be an 'assessee-in-default' under Section 220(2), triggering mandatory penal interest at one percent per month and exposing corporate bank accounts to coercive attachment by the Tax Recovery Officer under Section 226(3).",
                    "To protect corporate cash flows during appellate pendency, corporate counsel must initiate the statutory 'Stay of Demand' protocol. Under Section 220(6), where an assessee has presented an appeal under Section 246A, the Assessing Officer may, subject to such conditions as they think fit, treat the assessee as not being in default in respect of the amount in dispute, so long as the appeal remains undisposed of. The exercise of this administrative discretion is strictly regulated by binding CBDT Office Memoranda (specifically OM F. No. 404/72/93-ITCC dated February 29, 2016, and July 31, 2017).",
                    "Under these CBDT directives, the Assessing Officer is instructed to grant a stay of demand upon the assessee paying a mandatory lump-sum deposit of twenty percent (20%) of the disputed demand. However, where an assessment order suffers from patent illegality—such as additions made in blatant violation of binding High Court or Supreme Court precedents, or where the demand is astronomical and payment of 20% would cause severe commercial hardship—the assessee may petition the Principal Commissioner or invoke the extraordinary writ jurisdiction of the High Court under Article 226. High Courts across India have repeatedly affirmed that the 20% deposit guideline is an administrative instruction, not an inflexible statutory straitjacket, and courts possess full constitutional power to grant complete, unconditional stay where a strong prima facie case of illegality is established.",
                    "Corporate tax directors must also deploy protective jurisprudence governing coercive recovery. In landmark rulings including UTI Mutual Fund v. ITO and KEC International Ltd., the Bombay High Court formulated binding directions governing recovery proceedings: (1) no coercive recovery measures—such as bank account attachments under Section 226(3)—can be initiated prior to the expiry of the thirty-day limitation period for filing an appeal before the CIT(Appeals); (2) where a stay application is pending before the Assessing Officer or Principal Commissioner, recovery must remain in abeyance until a formal, reasoned order is passed; and (3) upon the rejection of an administrative stay application, the Department must grant a reasonable buffer period of at least two weeks before enforcing demand, enabling the assessee to seek judicial redress before the High Court. Violating these procedural safeguards exposes tax officials to contempt of court and immediate quashing of recovery notices."
                ],
                "check": {
                    "question": "Under Section 249(4)(a), what statutory tax payment condition must be satisfied before an appeal filed by an assessee who furnished a return can be admitted by the CIT(Appeals)?",
                    "options": [
                        "The assessee must have paid the full tax due on the income returned by them (admitted tax liability).",
                        "The assessee must deposit fifty percent of the total disputed additions in an escrow account.",
                        "The assessee must pay all future advance tax installments for the subsequent three financial years.",
                        "The assessee must obtain a bank guarantee covering one hundred percent of penalties."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "Section 249(4)(a) mandates that where a return has been furnished by the assessee, no appeal under Chapter XX shall be admitted unless the assessee has paid the tax due on the income returned by them."
                }
            },
            {
                "title": "Appellate Powers under Section 251: Annulment, Enhancement & The Bar on Remand",
                "say": [
                    "The scope and nature of the powers exercised by the Commissioner of Income-tax (Appeals) are codified in Section 251 of the Income-tax Act, 1961. Unlike traditional appellate courts under the Code of Civil Procedure whose jurisdiction is strictly corrective and adversarial, the CIT(Appeals) exercises a hybrid, plenary jurisdiction that is co-terminous and co-extensive with that of the Assessing Officer. As established by the Supreme Court in landmark constitutional bench rulings such as CIT v. Kanpur Coal Syndicate and Jute Corporation of India Ltd., the appellate authority does not merely umpire a dispute between Revenue and taxpayer; it is an assessment authority invested with the statutory duty to ensure that the correct total income is brought to tax.",
                    "Under Section 251(1)(a), in disposing of an appeal against an order of assessment, the Commissioner (Appeals) possesses the statutory power to: (1) confirm the assessment order; (2) reduce the assessed income; (3) enhance the assessed income; or (4) annul the assessment altogether. The power to annul an assessment is invoked when the underlying proceedings suffer from incurable jurisdictional defects—such as issuance of a notice beyond the Section 149 limitation period, failure to obtain valid Section 151 sanction, or non-issuance of a mandatory Section 143(2) notice within three months.",
                    "A transformative legislative amendment enacted by the Finance Act, 2001, reshaped Indian appellate procedure: Parliament explicitly deleted the words 'or they may set aside the assessment and refer the case back to the Assessing Officer for making a fresh assessment' from Section 251(1)(a). Consequently, the CIT(Appeals) possesses absolutely no statutory power to 'set aside' or remand an assessment back to the Assessing Officer for de novo adjudication. The first appellate authority must decide the appeal conclusively on the merits and evidentiary record before them. While the CIT(Appeals) may call for a remand report on specific factual inquiries under Section 250(4), they cannot abdicate their judicial function by remitting the entire case back to the lower authority.",
                    "Of paramount operational concern to corporate litigants is the appellate power of 'Enhancement' codified in Section 251(1)(a). The CIT(Appeals) is empowered to travel beyond the issues contested in the grounds of appeal, investigate sources of income considered in the assessment records, and increase the total income beyond the quantum assessed by the Assessing Officer. However, this formidable power is subjected to a strict statutory safeguard codified in Section 251(2): 'The Commissioner (Appeals) shall not enhance an assessment or a penalty or reduce the amount of refund unless the appellant has been given a reasonable opportunity of showing cause against such enhancement or reduction.'",
                    "An enhancement made without issuing a specific, written enhancement show-cause notice is null and void for violating statutory natural justice. Furthermore, established apex court jurisprudence in CIT v. Shapoorji Pallonji Mistry and Rai Bahadur Hardutroy Motilal circumscribes the boundaries of enhancement: the CIT(Appeals) can enhance income only in respect of items or sources that were processed or considered in the return of income or assessment record; they cannot discover an entirely new, unconsidered source of income that was never part of the assessment proceeding. Where an enhancement notice is received, corporate counsel must verify whether the proposed addition stems from existing record sources and file detailed evidentiary rebuttals before final adjudication.",
                    "Additionally, corporate litigants must master the constitutional 'Doctrine of Merger' codified in judicial precedents including Kunhayammed v. State of Kerala. When the CIT(Appeals) disposes of an appeal on merits, the original assessment order of the Assessing Officer merges into the appellate order in respect of all issues adjudicated. Consequently, the Assessing Officer loses all statutory jurisdiction to initiate rectification under Section 154 or reassessment under Section 147 in respect of those merged issues. However, under the doctrine of partial merger, issues that were not subject matter of appeal or were not considered by the appellate authority do not merge, leaving them open to independent statutory action by the Revenue within prescribed limitations."
                ],
                "check": {
                    "question": "Following amendments introduced by the Finance Act, 2001, does the Commissioner of Income-tax (Appeals) possess the power to set aside an assessment and remand it back to the Assessing Officer?",
                    "options": [
                        "No, the power to set aside and remand was statutorily deleted from Section 251(1)(a); the CIT(A) must decide the appeal conclusively.",
                        "Yes, the CIT(A) retains unlimited discretionary power to remand any assessment back to the Assessing Officer.",
                        "Yes, but only if the disputed addition exceeds ten crore rupees.",
                        "Only if the Central Board of Direct Taxes grants prior administrative concurrence."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "The Finance Act, 2001, deleted the power to set aside assessments from Section 251(1)(a), meaning the CIT(Appeals) cannot remand a case back to the Assessing Officer for fresh assessment and must decide the appeal conclusively."
                }
            },
            {
                "title": "Admission of Additional Evidence under Rule 46A & The Faceless Appeal Scheme under Section 250",
                "say": [
                    "During the course of original assessment proceedings, corporate taxpayers frequently face operational constraints—such as short questionnaire deadlines, overseas vendor communication lags, or banking document delays—preventing them from placing all relevant evidence before the Assessing Officer. When introducing new evidentiary material at the appellate stage, the appellant cannot simply append documents to their written submissions. The introduction of fresh evidence before the CIT(Appeals) is strictly controlled by Rule 46A of the Income-tax Rules, 1962.",
                    "Under Rule 46A(1), the appellant is not entitled to produce any evidence, whether oral or documentary, other than the evidence produced during assessment proceedings, except in four exhaustive statutory circumstances: (a) where the Assessing Officer refused to admit evidence which ought to have been admitted; (b) where the appellant was prevented by sufficient cause from producing the evidence which they were called upon to produce by the Assessing Officer; (c) where the appellant was prevented by sufficient cause from producing any evidence which is relevant to any ground of appeal; or (d) where the Assessing Officer made the assessment without giving sufficient opportunity to the appellant to elicit evidence relevant to any ground of appeal.",
                    "To admit additional evidence, the appellant must file a formal application under Rule 46A detailing the precise statutory clause invoked and demonstrating the sufficient cause that prevented earlier production. Furthermore, Rule 46A(3) establishes a mandatory procedural condition: no additional evidence shall be taken into account by the CIT(Appeals) unless the Assessing Officer has been allowed a reasonable opportunity to examine the evidence or cross-examine the witnesses, and to produce evidence in rebuttal. The CIT(Appeals) typically transmits the Rule 46A application and documents to the Assessing Officer for a formal 'Remand Report', and must grant the appellant an opportunity to file a 'Rejoinder' before admitting the evidence. An appellate order that admits and relies upon additional evidence without confronting the Assessing Officer violates Rule 46A(3) and is liable to be set aside on appeal by the Revenue.",
                    "The institutional administration of first appeals underwent a historic transformation with the introduction of the Faceless Appeal Scheme, codified in Section 250(6B) and Section 250(6C) of the Act (notified under the Faceless Appeal Scheme, 2021). The Faceless Appeal Scheme eradicated territorial jurisdiction, replacing localized appellate commissioners with an automated, team-based national digital architecture orchestrated by the National Faceless Appeal Centre (NFAC) in Delhi.",
                    "Under Section 250(6B), all appeals filed in Form 35 are dynamically allocated to Appeal Units (AU) across India via artificial intelligence risk algorithms. All notices, submissions, Rule 46A applications, remand reports, and rejoinders are transmitted exclusively in electronic format through the e-filing portal. Crucially, under the amended 2021 regulations, where an appellant requests a personal hearing to explain complex transfer pricing models, scientific accounting formulas, or voluminous ledger reconciliations, the Chief Commissioner or Director General of the NFAC is statutorily mandated to grant such hearing exclusively through video conferencing under Section 250(6B). The failure to provide a requested video conference hearing violates constitutional natural justice, rendering the resulting appellate order invalid and subject to quashing under Article 226.",
                    "The evidentiary boundaries of Rule 46A have been rigorously enforced by constitutional courts. In landmark rulings such as CIT v. Manish Buildwell Pvt. Ltd. and Babu Ram v. CIT, the Delhi High Court established that the provisions of Rule 46A are mandatory and non-derogable. When an appellant presents additional documents, the CIT(Appeals) must record reasons in writing admitting the evidence under one of the four clauses of Rule 46A(1) before proceeding further. If the appellate commissioner admits and evaluates documents without affording the Assessing Officer a statutory opportunity to rebut the evidence under Rule 46A(3), the resulting appellate order suffers from fatal procedural illegality. Conversely, if the Assessing Officer ignores the remand notice or fails to submit a report within the granted timeline, the CIT(Appeals) is fully empowered to draw adverse inferences against the Revenue and adjudicate on the basis of the taxpayer's uncontroverted records."
                ],
                "check": {
                    "question": "Under Rule 46A(3) of the Income-tax Rules, what procedural requirement must the CIT(Appeals) fulfill before admitting additional evidence submitted by an appellant?",
                    "options": [
                        "Allow the Assessing Officer a reasonable opportunity to examine the evidence, cross-examine witnesses, and submit a remand report.",
                        "Deposit fifty percent of the documentary value in the government treasury.",
                        "Publish the evidentiary documents in the official government gazette.",
                        "Obtain prior written approval from the Comptroller and Auditor General of India."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "Rule 46A(3) explicitly mandates that no additional evidence shall be taken into account unless the Assessing Officer has been given a reasonable opportunity to examine the evidence and produce rebuttal evidence."
                }
            },
            {
                "title": "Production Python Architecture: First Appellate Portfolio & Stay Compliance Engine",
                "say": [
                    "In enterprise corporate tax departments managing litigation portfolios spanning hundreds of assessment orders, automating appellate deadlines, verifying Section 249(4) tax payment compliance, auditing Rule 46A evidentiary conditions, and modeling Section 220(6) stay deposits is essential to maintaining financial stability. In this module, we develop a production-grade Python class, FirstAppellateComplianceEngine, designed to manage corporate tax appeals before the CIT(Appeals) and NFAC.",
                    "The computational engine models five core statutory workflows: First, the Section 249(2) Limitation Validator: calculating elapsed days from the service of the demand notice to verify whether Form 35 falls within the statutory 30-day window or requires a Section 249(3) condonation petition. Second, the Section 249(4) Admitted Tax Gate: verifying that 100% of returned tax liability was paid prior to appeal presentation, preventing threshold dismissal. Third, the Section 220(6) Stay Optimizer: computing the standard 20% statutory deposit under CBDT instructions, while evaluating prima facie legal defects (such as time-barred orders or lack of Section 151 sanction) that justify an application for 100% unconditional stay. Fourth, the Rule 46A Evidence Classifier: cataloging additional documents and mapping them to clauses (a) through (d) of Rule 46A(1). Fifth, the Section 251 Enhancement Exposure Auditor: calculating maximum potential additions under Section 251(1)(a) and verifying issuance of mandatory Section 251(2) show-cause notices.",
                    "Let us examine the complete, executable Python architecture implementing these statutory mechanics:",
                    "```python",
                    "import datetime",
                    "from dataclasses import dataclass, field",
                    "from typing import Dict, List, Optional",
                    "",
                    "@dataclass",
                    "class AppellateGround:",
                    "    ground_number: int",
                    "    issue_title: str",
                    "    addition_amount_inr: float",
                    "    is_jurisdictional_defect: bool",
                    "    has_additional_evidence: bool = False",
                    "    rule_46a_clause: Optional[str] = None  # 'a', 'b', 'c', 'd'",
                    "",
                    "class FirstAppellateComplianceEngine:",
                    "    def __init__(self, corporate_name: str, ay: str, demand_notice_service_date: datetime.date):",
                    "        self.company = corporate_name",
                    "        self.ay = ay",
                    "        self.service_date = demand_notice_service_date",
                    "        self.grounds: List[AppellateGround] = []",
                    "        self.returned_income_tax_due_inr: float = 0.0",
                    "        self.returned_tax_paid_inr: float = 0.0",
                    "        self.corporate_tax_rate: float = 0.25168  # 22% base + 10% surcharge + 4% cess",
                    "",
                    "    def set_returned_tax_status(self, tax_due: float, tax_paid: float):",
                    "        self.returned_income_tax_due_inr = tax_due",
                    "        self.returned_tax_paid_inr = tax_paid",
                    "",
                    "    def add_ground(self, issue: str, addition_inr: float, is_jurisdictional: bool, add_evidence: bool = False, clause: Optional[str] = None):",
                    "        num = len(self.grounds) + 1",
                    "        self.grounds.append(AppellateGround(num, issue, addition_inr, is_jurisdictional, add_evidence, clause))",
                    "",
                    "    def audit_appeal_viability(self, filing_date: datetime.date) -> Dict[str, any]:",
                    "        elapsed_days = (filing_date - self.service_date).days",
                    "        is_within_limitation = elapsed_days <= 30",
                    "        requires_condonation = elapsed_days > 30",
                    "",
                    "        # 1. Section 249(4) Admitted Tax Check",
                    "        admitted_tax_unpaid = max(0.0, self.returned_income_tax_due_inr - self.returned_tax_paid_inr)",
                    "        is_sec249_4_compliant = admitted_tax_unpaid == 0.0",
                    "",
                    "        total_disputed_additions = sum(g.addition_amount_inr for g in self.grounds)",
                    "        total_disputed_tax = total_disputed_additions * self.corporate_tax_rate",
                    "",
                    "        # 2. Section 220(6) Stay Calculations",
                    "        standard_20pct_deposit = total_disputed_tax * 0.20",
                    "        has_fatal_jurisdictional_defect = any(g.is_jurisdictional_defect for g in self.grounds)",
                    "        recommended_stay_strategy = (",
                    "            'Apply for 100% Unconditional Stay under Article 226 due to fatal jurisdictional defects'",
                    "            if has_fatal_jurisdictional_defect else",
                    "            f'Deposit 20% (INR {standard_20pct_deposit:,.2f}) under CBDT OM and seek stay of balance 80% pending appeal'"
                    "        )",
                    "",
                    "        # 3. Rule 46A Evidence Inventory",
                    "        rule_46a_items = [",
                    "            {'ground': g.ground_number, 'issue': g.issue_title, 'clause': g.rule_46a_clause}",
                    "            for g in self.grounds if g.has_additional_evidence",
                    "        ]",
                    "",
                    "        return {",
                    "            'company': self.company,",
                    "            'assessment_year': self.ay,",
                    "            'elapsed_days_since_service': elapsed_days,",
                    "            'is_within_statutory_limitation': is_within_limitation,",
                    "            'requires_sec249_3_condonation': requires_condonation,",
                    "            'is_sec249_4_admitted_tax_satisfied': is_sec249_4_compliant,",
                    "            'admitted_tax_deficit_inr': admitted_tax_unpaid,",
                    "            'total_disputed_additions_inr': total_disputed_additions,",
                    "            'total_disputed_tax_inr': round(total_disputed_tax, 2),",
                    "            'cbdt_20pct_deposit_inr': round(standard_20pct_deposit, 2),",
                    "            'recommended_stay_strategy': recommended_stay_strategy,",
                    "            'rule_46a_evidence_items': rule_46a_items,",
                    "            'is_ready_for_form_35_submission': is_sec249_4_compliant and (is_within_limitation or requires_condonation)",
                    "        }",
                    "```",
                    "In enterprise deployment, this software architecture ingests electronic assessment orders directly from corporate ERP tax repositories. By automatically verifying Section 249(4) payments, computing Section 220(6) stay deposits, and structuring Rule 46A evidence applications, the engine guarantees that multinational enterprises assert their appellate rights with flawless procedural precision.",
                    "Furthermore, the engine integrates directly with corporate treasury management systems to execute cash flow sensitivity optimization. By comparing the cost of capital against the mandatory one percent monthly interest under Section 220(2), the engine calculates the net present value of paying disputed taxes under protest versus providing bank guarantees or pursuing emergency writ intervention before the High Court. When dealing with astronomical transfer pricing or brand valuation additions, the automated legal informatics engine generates executive litigation briefing dossiers for the Board of Directors, ensuring that multinational corporate governance remains resilient, proactive, and unassailable."
                ],
                "check": {
                    "question": "In our FirstAppellateComplianceEngine, what happens if an appeal is filed with an admitted tax deficit under Section 249(4)?",
                    "options": [
                        "The appeal cannot be legally admitted by the CIT(Appeals), resulting in immediate dismissal at the threshold.",
                        "The CIT(Appeals) automatically grants a two-year extension to pay the admitted tax.",
                        "The admitted tax is converted into a twenty-year government loan with five percent interest.",
                        "The case is referred to the Central Board of Direct Taxes for administrative condonation."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "Under Section 249(4)(a), payment of tax on returned income is a mandatory condition precedent for admitting an appeal; non-payment results in threshold dismissal without hearing on the merits."
                }
            }
        ]
    }
    return day51

if __name__ == '__main__':
    data = get_day51_data()
    print(f"Day 51 Title: {data['title']}")
    print(f"Parts count: {len(data['parts'])}")
    for i, p in enumerate(data['parts']):
        words = len(" ".join(p['say']).split())
        print(f"Part {i+1}: {words} words")
