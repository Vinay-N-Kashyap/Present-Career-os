"""
create_day47_tax.py
Course: bcom_tax (Corporate Tax, GST & Direct Taxation)
Month 2 Block 10 Day 47: Income Escaping Assessment: Reassessment Architecture under Section 147, Section 148, Section 148A Inquiry & Section 149 Limitations
"""

def get_day47_data():
    day47 = {
        "day": 47,
        "coursePrefix": "bcom_tax",
        "title": "Income Escaping Assessment: Reassessment Architecture under Section 147, Section 148, Section 148A Inquiry & Section 149 Limitations",
        "description": "Master the reconstructed statutory regime governing income escaping assessment under the Income-tax Act, 1961, as transformed by the Finance Act, 2021 and Finance Act, 2022. Analyze the fundamental doctrinal shift from 'reason to believe' to 'information with the Assessing Officer suggesting escapement', mandatory preliminary inquiries and show-cause procedures under Section 148A, the landmark Supreme Court ruling in Ashish Agarwal, the three-year and ten-year limitation periods under Section 149, the statutory definition of 'asset' and the fifty-lakh-rupee monetary threshold, Section 151 Specified Authority sanction protocols, and production-grade reassessment defense algorithms.",
        "minutes": 38,
        "parts": [
            {
                "title": "The Reconstructed Section 147 Regime: Shift from 'Reason to Believe' to 'Information Suggesting Escapement'",
                "say": [
                    "For nearly six decades, the legal foundation for reopening concluded tax assessments under Section 147 of the Income-tax Act, 1961, was governed by the venerable jurisprudence of 'reason to believe'. Under the pre-2021 architecture, an Assessing Officer possessed jurisdiction to issue a reassessment notice only if they possessed tangible, cogent material creating an honest belief that taxable income had escaped assessment, subject to the jurisdictional bar against a mere 'change of opinion' established by landmark Supreme Court judgments such as Kelvinator of India Ltd. The Finance Act, 2021, executed the most comprehensive statutory overhaul of the reassessment framework in modern Indian fiscal history, dismantling the subjective 'reason to believe' standard and substituting it with an objective, information-driven paradigm codified in Sections 147, 148, 148A, 149, and 151.",
                    "Under the substituted Section 147, if any income chargeable to tax has escaped assessment for any assessment year, the Assessing Officer may, subject to the provisions of Sections 148 to 153, assess or reassess such income and also any other income chargeable to tax which has escaped assessment and which comes to their notice subsequently in the course of the proceedings under this section. The jurisdictional gateway for initiating reassessment is now strictly controlled by Section 148, which stipulates that no notice under Section 148 shall be issued unless there is 'information with the Assessing Officer which suggests that the income chargeable to tax has escaped assessment' for the relevant assessment year, and the Assessing Officer has obtained the prior approval of the specified authority to issue such notice.",
                    "To prevent arbitrary administrative discretion and ensure technological certainty, Explanation 1 to Section 148 exhaustively defines what constitutes 'information which suggests that income has escaped assessment'. Such information is statutorily restricted to: (1) any information in accordance with the risk management strategy formulated by the Central Board of Direct Taxes (CBDT) from time to time, populated primarily through the automated data-mining algorithms of the Directorate General of Systems and the Insight Portal; (2) any audit objection raised by the Comptroller and Auditor General of India (CAG) to the effect that the assessment has not been made in accordance with the provisions of this Act; (3) any information received under an agreement referred to in Section 90 or Section 90A (Double Taxation Avoidance Agreements or Tax Information Exchange Agreements with foreign jurisdictions); (4) any information made available to the Assessing Officer under any order passed under Section 11 of the Prohibition of Benami Property Transactions Act, 1988; and (5) any information collected or received by the income-tax authority under Section 133B or Section 133C.",
                    "Furthermore, Explanation 2 to Section 148 establishes statutory deeming fictions where the Assessing Officer shall be deemed to have information suggesting escapement of income. Specifically, where a search is initiated under Section 132 or books of account or other assets are requisitioned under Section 132A on or after the first day of April, 2021, or where a survey is conducted under Section 133A (other than surveys under Section 133A(2A) for TDS/TCS or Section 133A(5) for expenditure verification), or where the Assessing Officer is satisfied, with the prior approval of the specified authority, that any money, bullion, jewellery, or other valuable article or thing, seized or requisitioned in case of any other person belongs to the assessee, the Assessing Officer is deemed to possess actionable information for the three assessment years immediately preceding the assessment year relevant to the previous year in which search or survey was conducted.",
                    "For corporate tax practitioners and legal counsel, this fundamental transformation shifts the focus of reassessment defense. In the historical regime, litigation predominantly contested the subjective formation of belief and the existence of a live nexus between the material and the belief. In the post-2021 reconstructed regime, legal challenges center upon whether the underlying data strictly qualifies as 'information' under Explanation 1, whether the information was flagged in strict conformity with the CBDT Risk Management Strategy, and whether the mandatory procedural gates under Section 148A and Section 151 were scrupulously followed prior to the issuance of the Section 148 notice."
                ],
                "check": {
                    "question": "Under the reconstructed Section 148 regime introduced by the Finance Act, 2021, what constitutes 'information suggesting that income has escaped assessment'?",
                    "options": [
                        "Information flagged under the CBDT risk management strategy, CAG audit objections, or DTAA foreign intelligence.",
                        "Any informal verbal discussion between the Assessing Officer and a competitor.",
                        "A newspaper editorial alleging tax evasion by an industry sector.",
                        "An internal handwritten note by an inspector without documented evidentiary basis."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "Under Explanation 1 to Section 148, information suggesting escapement is strictly defined as information flagged in accordance with the CBDT risk management strategy, CAG audit objections, DTAA/TIEA information, or orders under the Benami Property Act."
                }
            },
            {
                "title": "Mandatory Section 148A Preliminary Inquiry Architecture & The Landmark Ashish Agarwal Ruling",
                "say": [
                    "A cornerstone procedural innovation of the post-2021 reassessment architecture is codified in Section 148A. Prior to the issuance of any notice under Section 148, the Assessing Officer is statutorily mandated to conduct a preliminary inquiry, provide the assessee with an opportunity of being heard, and pass a reasoned speaking order determining whether or not it is a fit case to issue a notice under Section 148. This statutory safeguard was enacted by Parliament to eradicate the widespread historical abuse where Section 148 notices were issued arbitrarily without revealing the underlying material to the assessee, thereby subjecting taxpayers to years of protracted, unwarranted litigation.",
                    "The operational framework of Section 148A unfolds in four sequential, non-derogable stages. Under clause (a) of Section 148A, the Assessing Officer may conduct any inquiry, if considered necessary, with the prior approval of the specified authority, with respect to the information which suggests that income chargeable to tax has escaped assessment. Under clause (b), the Assessing Officer shall provide an opportunity of being heard to the assessee, by serving upon them a show-cause notice accompanied by the information and supporting material relied upon by the department, calling upon the assessee to show cause as to why a notice under Section 148 should not be issued. Crucially, the statute specifies a mandatory time limit: the notice must grant a period of not less than seven days and not more than thirty days from the date on which such notice is served, or such extended time as may be allowed on application.",
                    "Under clause (c) of Section 148A, the Assessing Officer is statutorily obligated to consider the reply furnished by the assessee in response to the show-cause notice. Finally, under clause (d), the Assessing Officer shall decide, on the basis of material available on record including the reply of the assessee, whether or not it is a fit case to issue a notice under Section 148, by passing an order with the prior approval of the specified authority, within one month from the end of the month in which the reply is received, or where no reply is furnished, within one month from the end of the month in which the time allowed to furnish the reply expires. Only after passing a positive order under Section 148A(d) can the Assessing Officer issue the substantive notice under Section 148.",
                    "The transitional friction between the old reassessment regime and the new Section 148A architecture triggered the largest judicial controversy in modern Indian direct tax history. Following the enactment of the Finance Act, 2021, with effect from April 1, 2021, the tax department continued issuing tens of thousands of reassessment notices under the unamended Section 148 between April 1, 2021, and June 30, 2021, relying on executive extension notifications issued under the Taxation and Other Laws (Relaxation and Amendment of Certain Provisions) Act, 2020 (TOLA). Over ninety thousand writ petitions were filed across High Courts, resulting in unanimous judgments striking down these notices as void ab initio for violating Parliament's explicit mandate.",
                    "In a historic judgment delivered on May 4, 2022, in Union of India v. Ashish Agarwal (2022) 444 ITR 1 (SC), the Supreme Court invoked its extraordinary constitutional powers under Article 142 to balance equity and statutory legality. The apex court ruled that all Section 148 notices issued between April 1, 2021, and June 30, 2021, under the unamended regime shall be deemed to have been issued as show-cause notices under Section 148A(b) of the new regime. The Assessing Officers were directed to provide the underlying information and material to the assessees within thirty days, the assessees were granted two weeks to reply, and the Revenue was mandated to pass speaking orders under Section 148A(d) before issuing fresh notices under Section 148. This landmark ruling solidified Section 148A as a mandatory, jurisdictional prerequisite that cannot be bypassed by executive notification."
                ],
                "check": {
                    "question": "What procedural rule did the Supreme Court establish in Union of India v. Ashish Agarwal (2022) regarding reassessment notices issued under the old regime after April 1, 2021?",
                    "options": [
                        "Notices were deemed to be show-cause notices under Section 148A(b), requiring supply of material and Section 148A(d) orders.",
                        "All notices were completely quashed without any possibility of departmental inquiry.",
                        "The notices were declared valid without requiring any procedural compliance with Section 148A.",
                        "The assessees were required to deposit fifty percent of the disputed tax in escrow immediately."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "In Ashish Agarwal, the Supreme Court exercised powers under Article 142 to treat the invalidated notices as Section 148A(b) show-cause notices, mandating supply of information and passing of Section 148A(d) speaking orders."
                }
            },
            {
                "title": "Limitation Periods under Section 149 & The Fifty-Lakh-Rupee Asset Threshold",
                "say": [
                    "The statutory limitation periods within which the tax administration can reopen an assessment are codified in Section 149 of the Income-tax Act, 1961. The Finance Act, 2021, substantially compressed the historical limitation periods to provide tax certainty to business enterprises, while establishing rigorous threshold conditions for reopening long-dormant assessments. Under the restructured Section 149(1), there are two distinct limitation windows: a standard three-year window under clause (a), and an extended ten-year window under clause (b).",
                    "Under Section 149(1)(a), no notice under Section 148 shall be issued for the relevant assessment year if three years have elapsed from the end of the relevant assessment year, unless the case falls strictly within the exceptional parameters of clause (b). For instance, for Assessment Year 2021-22 (financial year 2020-21), the standard three-year period expires on March 31, 2025. Within this three-year window, an assessment may be reopened based on any 'information' suggesting escapement, regardless of the quantum of income escaping assessment.",
                    "Under Section 149(1)(b), an assessment can be reopened beyond three years but up to ten years from the end of the relevant assessment year only if specific, cumulative statutory criteria are met. The Assessing Officer must possess in their possession books of account, other documents, or evidence which reveal that the income chargeable to tax, represented in the form of: (1) an asset; (2) expenditure in respect of a transaction or in relation to an event or occasion; or (3) an entry or entries in the books of account, which has escaped assessment amounts to or is likely to amount to fifty lakh rupees or more for that year. If the escaped income is even one rupee below fifty lakh rupees (INR 5,000,000) for that relevant assessment year, the issuance of a Section 148 notice beyond the three-year limit is statutorily prohibited, rendering any notice issued without jurisdiction.",
                    "The Finance Act, 2022, amended Section 149(1)(b) to plug perceived loopholes regarding the scope of escapement. Initially, Section 149(1)(b) referred solely to income represented in the form of an 'asset'. Taxpayers successfully argued before High Courts that bogus expenditure entries, accommodation billing, or dummy book entries did not constitute an 'asset' under general law. In response, Parliament expanded the statutory language to encompass not only assets (defined in the Explanation as including immovable property, shares, securities, loans, advances, or bank deposits) but also expenditure in relation to any transaction, event, or occasion, as well as any book entry. However, the fifty-lakh-rupee monetary threshold remains an absolute annual requirement: the income escaping assessment must meet or exceed fifty lakh rupees for that specific assessment year, and the department cannot aggregate escapements across multiple assessment years to reach the fifty-lakh threshold for an individual year.",
                    "A critical legal shield is codified in the first proviso to Section 149(1): no notice under Section 148 shall be issued at any time in a case for the relevant assessment year, if a notice under Section 148 could not have been issued at that time on account of being beyond the time limit specified under the unamended provisions of Section 149 as they stood prior to the commencement of the Finance Act, 2021. This means that for assessment years prior to AY 2015-16, which had already become time-barred under the old six-year limitation regime prior to April 1, 2021, the new extended ten-year limitation cannot be invoked to revive dead assessments. The Supreme Court and numerous High Courts have affirmed that the new law cannot resuscitate assessments that had already achieved finality and were beyond the limitation period prior to the 2021 amendment.",
                    "Additionally, corporate tax controllers must account for the computation of the period of limitation under the third proviso to Section 149(1). The third proviso establishes that the time or extended time allowed to the assessee as per show-cause notice issued under Section 148A(b), or the period during which the proceeding under Section 148A is stayed by an order or injunction of any court, shall be excluded in computing the period of limitation. Moreover, where immediately after the exclusion of the aforesaid period, the period of limitation available to the Assessing Officer for passing an order under clause (d) of Section 148A does not exceed seven days, such remaining period shall be extended to seven days, and the limitation under Section 149 for issuing a notice under Section 148 shall be deemed to be extended accordingly. This algorithmic tolling rule prevents the Revenue from losing statutory jurisdiction while court injunctions or assessee extension requests remain pending."
                ],
                "check": {
                    "question": "What is the statutory monetary threshold of escaped income required to issue a reassessment notice beyond three years but within ten years under Section 149(1)(b)?",
                    "options": [
                        "Fifty lakh rupees or more for the relevant assessment year.",
                        "Ten lakh rupees across a block of five financial years.",
                        "One crore rupees including all associated interest and penalties.",
                        "Twenty-five lakh rupees of gross turnover."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "Under Section 149(1)(b), a Section 148 notice can be issued beyond three years up to ten years only if the income escaping assessment represented in the form of an asset, expenditure, or book entry amounts to or is likely to amount to fifty lakh rupees or more for that year."
                }
            },
            {
                "title": "Section 151 Specified Authority Protocols, Jurisdictional Writs & Section 153(2) Limitation",
                "say": [
                    "The validity of any reassessment action under the Income-tax Act, 1961, is fundamentally dependent upon obtaining valid statutory approval from the designated 'Specified Authority' under Section 151. Section 151 establishes a strict hierarchical bifurcated protocol based upon the passage of time. If three years or less have elapsed from the end of the relevant assessment year, the Specified Authority for according approval under Section 148A(a), 148A(d), and Section 148 is the Principal Commissioner or Principal Director or Commissioner or Director. However, if more than three years have elapsed from the end of the relevant assessment year, the approval must be accorded by a higher constitutional tier: the Principal Chief Commissioner or Principal Director General or Chief Commissioner or Director General.",
                    "The granting of sanction under Section 151 is not a mechanical, rubber-stamping bureaucratic exercise. Jurisprudence established by the Supreme Court in Chhugamal Rajpal v. S.P. Chaliha and affirmed in dozens of contemporary High Court decisions establishes that the Specified Authority must independently apply their mind to the material placed before them. If the Specified Authority merely records 'Yes, I am satisfied' or 'Approved' without demonstrating independent appraisal of the evidence or verifying whether the fifty-lakh-rupee threshold is met, the approval is legally vitiated. Furthermore, if approval is granted by an authority of incorrect rank—such as a Principal Commissioner granting approval for a notice issued after three years instead of the Principal Chief Commissioner—the Section 148 notice is rendered void ab initio for want of valid statutory sanction.",
                    "When an assessee is served with an invalid Section 148A(b) show-cause notice or an illegal Section 148 reassessment notice, corporate legal counsel must execute a precise litigation strategy. While the Supreme Court's historical ruling in GKN Driveshafts (India) Ltd. required an assessee to file a return, seek reasons, and file objections before approaching the courts, the codification of Section 148A has integrated these procedural safeguards directly into the pre-notice statutory sequence. If the tax department violates mandatory statutory provisions—such as failing to supply underlying information, issuing a notice beyond the Section 149 limitation period, failing to meet the fifty-lakh threshold, or acting without valid Section 151 approval—the assessee is not required to submit to an unlawful assessment. Instead, the assessee may immediately invoke the writ jurisdiction of the jurisdictional High Court under Article 226 of the Constitution of India, seeking a writ of certiorari or prohibition to quash the proceedings at the threshold.",
                    "Once a valid notice under Section 148 is served upon the assessee, the reassessment proceedings must be concluded within the strict statutory time limits codified in Section 153(2). Under Section 153(2), no order of assessment, reassessment, or recomputation under Section 147 shall be made after the expiry of twelve months from the end of the financial year in which the notice under Section 148 was served on the assessee. For notices served on or after April 1, 2019, the time limit is twelve months (with temporary nine-month windows for specific transitional years). If the Assessing Officer fails to pass the final reassessment order within this twelve-month limitation period, the proceedings lapse by operation of law, and any assessment order passed thereafter is time-barred and legally non-existent.",
                    "In defending corporate clients, tax practitioners must maintain meticulous records of electronic service dates. Every electronic transmission on the NeFAC portal generates cryptographic timestamps. By cross-referencing the timestamp of notice delivery, the rank of the approving authority in the digital signature certificate, the fiscal year of alleged escapement, and the itemized valuation of alleged undisclosed assets, counsel can construct an unassailable evidentiary audit demonstrating procedural or substantive invalidity before appellate tribunals and constitutional courts."
                ],
                "check": {
                    "question": "Which authority is statutorily empowered under Section 151 to accord approval for issuing a Section 148 notice if more than three years have elapsed from the end of the relevant assessment year?",
                    "options": [
                        "Principal Chief Commissioner or Principal Director General or Chief Commissioner or Director General.",
                        "Any Income Tax Officer or Assistant Commissioner assigned to the audit circle.",
                        "The local municipal tax collector or sub-registrar.",
                        "The Principal Commissioner or Commissioner of Income Tax without higher escalation."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "Under Section 151(ii), where more than three years have elapsed from the end of the relevant assessment year, the Specified Authority for according approval under Section 148 and Section 148A is the Principal Chief Commissioner, Principal Director General, Chief Commissioner, or Director General."
                }
            },
            {
                "title": "Production Python Architecture: Section 148A Inquiry & Limitation Engine",
                "say": [
                    "To safeguard multinational corporations and large industrial conglomerates against arbitrary reassessment notices and ensure rigorous procedural compliance, enterprise tax departments utilize automated computational legal engines. In this technical module, we implement a production-grade Python class, ReassessmentComplianceEngine, that evaluates Section 148 and Section 148A notices against statutory limitation periods, the fifty-lakh-rupee monetary threshold, Section 151 specified authority approvals, and the foundational precedents of the Supreme Court.",
                    "The engine enforces four non-negotiable statutory invariants: First, the Limitation Rule: calculating the elapsed time from the end of the relevant assessment year to verify whether the notice falls within the standard three-year window or requires the extended ten-year authorization. Second, the Threshold Rule: where the notice is issued beyond three years, verifying that the alleged escaped income represented by an asset, expenditure, or book entry is strictly greater than or equal to fifty lakh rupees (INR 5,000,000) for that individual assessment year. Third, the Specified Authority Rank Rule: verifying that if elapsed years are less than or equal to three, approval is signed by a PCIT or Commissioner, whereas if elapsed years exceed three, approval is executed by a PCCIT, PDGIT, or Chief Commissioner. Fourth, the 148A Procedure Rule: ensuring that a valid show-cause notice under Section 148A(b) was served granting between 7 and 30 days for reply, and that a reasoned order under Section 148A(d) was formally passed before issuing the Section 148 notice.",
                    "Let us examine the complete, executable Python architecture implementing these statutory requirements:",
                    "```python",
                    "import datetime",
                    "from typing import Dict, List, Optional, Tuple",
                    "",
                    "class ReassessmentComplianceEngine:",
                    "    HIGH_AUTHORITIES = {'PCCIT', 'PDGIT', 'CCIT', 'DGIT'}",
                    "    STANDARD_AUTHORITIES = {'PCIT', 'PDGIT', 'CIT', 'DIT'}",
                    "",
                    "    def __init__(self, assessment_year: str, notice_date: datetime.date):",
                    "        self.ay = assessment_year  # Format: '2019-20'",
                    "        self.ay_end_year = int(assessment_year.split('-')[0]) + 1",
                    "        self.ay_end_date = datetime.date(self.ay_end_year, 3, 31)",
                    "        self.notice_date = notice_date",
                    "        self.escaped_items: List[Dict] = []",
                    "        self.approving_authority: Optional[str] = None",
                    "        self.has_148a_scn: bool = False",
                    "        self.scn_reply_days_allowed: int = 0",
                    "        self.has_148a_order: bool = False",
                    "",
                    "    def add_escaped_item(self, item_type: str, description: str, amount_inr: float):",
                    "        valid_types = {'asset', 'expenditure', 'book_entry'}",
                    "        if item_type not in valid_types:",
                    "            raise ValueError(f'Invalid item type: {item_type}. Must be in {valid_types}')",
                    "        self.escaped_items.append({'type': item_type, 'desc': description, 'amount': amount_inr})",
                    "",
                    "    def set_procedural_history(self, approving_auth: str, has_scn: bool, reply_days: int, has_order: bool):",
                    "        self.approving_authority = approving_auth",
                    "        self.has_148a_scn = has_scn",
                    "        self.scn_reply_days_allowed = reply_days",
                    "        self.has_148a_order = has_order",
                    "",
                    "    def evaluate_jurisdiction(self) -> Dict[str, any]:",
                    "        total_escaped = sum(item['amount'] for item in self.escaped_items)",
                    "        elapsed_days = (self.notice_date - self.ay_end_date).days",
                    "        elapsed_years = elapsed_days / 365.25",
                    "",
                    "        violations = []",
                    "        # 1. Limitation Check under Section 149",
                    "        if elapsed_years > 10.0:",
                    "            violations.append(f'Section 149(1)(b) absolute bar: Notice issued {elapsed_years:.1f} years after AY end (max 10 years).')",
                    "        elif elapsed_years > 3.0:",
                    "            if total_escaped < 5000000.0:",
                    "                violations.append(f'Section 149(1)(b) threshold violation: Escaped income INR {total_escaped:,.2f} is below INR 5,000,000 threshold for reopening beyond 3 years.')",
                    "            if self.approving_authority not in self.HIGH_AUTHORITIES:",
                    "                violations.append(f'Section 151(ii) sanction violation: For notices beyond 3 years, authority must be PCCIT/PDGIT/CCIT/DGIT. Found: {self.approving_authority}')",
                    "        else:",
                    "            if self.approving_authority not in self.STANDARD_AUTHORITIES and self.approving_authority not in self.HIGH_AUTHORITIES:",
                    "                violations.append(f'Section 151(i) sanction violation: Authority {self.approving_authority} not authorized under Section 151.')",
                    "",
                    "        # 2. Section 148A Mandatory Procedural Checks",
                    "        if not self.has_148a_scn:",
                    "            violations.append('Section 148A(b) violation: No preliminary show-cause notice was issued with supporting evidence.')",
                    "        elif self.scn_reply_days_allowed < 7 or self.scn_reply_days_allowed > 30:",
                    "            violations.append(f'Section 148A(b) timeline violation: Reply window granted ({self.scn_reply_days_allowed} days) is outside statutory 7-30 days range.')",
                    "        if not self.has_148a_order:",
                    "            violations.append('Section 148A(d) violation: No speaking order on fitness of reassessment was passed prior to Section 148 notice.')",
                    "",
                    "        is_valid = len(violations) == 0",
                    "        recommended_action = 'Proceed with Faceless Reassessment Submissions' if is_valid else 'File Writ Petition under Article 226 before High Court seeking Certiorari to quash notice'",
                    "        return {",
                    "            'assessment_year': self.ay,",
                    "            'notice_date': self.notice_date.isoformat(),",
                    "            'elapsed_years': round(elapsed_years, 2),",
                    "            'total_escaped_inr': total_escaped,",
                    "            'is_jurisdictionally_valid': is_valid,",
                    "            'violations': violations,",
                    "            'recommended_remedy': recommended_action",
                    "        }",
                    "```",
                    "In operational deployment, this software architecture ingests electronic XML notices received via the Income Tax Department's NeFAC application programming interface. The system instantaneously identifies procedural defects, validates statutory limitation windows, and generates automated legal briefs for the Board of Directors, ensuring that no illegal reassessment order compromises corporate financial integrity."
                ],
                "check": {
                    "question": "In our ReassessmentComplianceEngine, what legal remedy is recommended when a Section 148 notice fails statutory limitation or threshold rules?",
                    "options": [
                        "File a Writ Petition under Article 226 before the High Court seeking a writ of certiorari to quash the notice.",
                        "Concede the tax demand immediately to prevent compounding penalties.",
                        "Send an informal email to the local circle inspector requesting cancellation.",
                        "Ignore the notice completely without filing any objections or writ petitions."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "When a reassessment notice suffers from incurable jurisdictional defects—such as exceeding limitation under Section 149, violating the fifty-lakh threshold, or lacking Section 151 sanction—the appropriate constitutional remedy is to file a Writ Petition under Article 226 seeking a writ of certiorari to quash the proceedings."
                }
            }
        ]
    }
    return day47

if __name__ == '__main__':
    data = get_day47_data()
    print(f"Day 47 Title: {data['title']}")
    print(f"Parts count: {len(data['parts'])}")
    for i, p in enumerate(data['parts']):
        words = len(" ".join(p['say']).split())
        print(f"Part {i+1}: {words} words")
