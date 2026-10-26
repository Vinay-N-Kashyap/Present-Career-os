"""
Day 54 Curriculum Expansion Generator:
Course: bcom_tax (Corporate Tax Planning, MAT, DTAA, Transfer Pricing & GST)
Day 54: High Court & Supreme Court Tax Litigation Architecture: Substantial Question of Law under Section 260A & Constitutional Remedies
"""

import sys

def get_day54_data():
    day54 = {
        "day": 54,
        "coursePrefix": "bcom_tax",
        "minutes": 38,
        "title": "High Court & Supreme Court Tax Litigation Architecture: Substantial Question of Law under Section 260A & Constitutional Remedies",
        "description": "Master corporate tax advocacy before the higher judiciary. Analyze the Section 260A substantial question of law doctrine, the Chunilal Mehta and Santosh Hazari tests, CBDT departmental monetary limits, Section 261 and Article 136 Supreme Court jurisdiction, and Article 226 writ petitions under the Whirlpool Corporation doctrine.",
        "parts": [
            {
                "title": "The Section 260A Statutory Gateway & The Substantial Question of Law Doctrine",
                "say": [
                    "Direct tax litigation enters the constitutional judicial sphere upon ascending beyond the Income Tax Appellate Tribunal to the High Court under Section 260A of the Income-tax Act, 1961. Enacted by the Finance (No. 2) Act, 1998, Section 260A fundamentally reformed direct tax appeals by replacing the archaic and protracted 'reference application' procedure with a direct statutory appeal. Under Section 260A(1), an appeal shall lie to the High Court from every order passed in appeal by the Appellate Tribunal, if the High Court is satisfied that the case involves a 'substantial question of law'. This statutory phrasing establishes an uncompromising jurisdictional filter: the High Court does not function as a third court of fact, nor does it conduct an open appellate rehearing on the general merits of the assessment.",
                    "Under Section 260A(2), an appeal must be filed within one hundred and twenty days from the date on which the order appealed against is received by the assessee or the Principal Chief Commissioner or Commissioner. While Section 260A(2A) empowers the High Court to condone delays upon demonstration of sufficient cause, corporate litigation teams must treat the 120-day window as an exacting deadline. The memorandum of appeal must precisely formulate the substantial questions of law upon which the challenge is founded. Under Section 260A(3), where the High Court is satisfied that a substantial question of law is involved, it shall formulate that question. The appeal is then heard strictly on the question so formulated under Section 260A(4), though the Court retains discretion to hear any other substantial question of law if it records reasons.",
                    "The decisive legal question in Section 260A jurisprudence is: What constitutes a 'substantial question of law'? In a landmark Constitution Bench ruling in Sir Chunilal V. Mehta & Sons Ltd. v. Century Spinning & Manufacturing Co. Ltd. (AIR 1962 SC 1314), reiterated in the direct tax domain in Santosh Hazari v. Purushottam Tiwari ((2001) 251 ITR 84) and Hero Cycles Ltd. v. CIT, the Supreme Court established the definitive constitutional tests. A question of law is 'substantial' if: (1) it is of general public importance; or (2) it directly and substantially affects the rights of the parties; and (3) it is an open question that is not settled by the Supreme Court or the Privy Council or the Federal Court, or the statutory provision is capable of two plausible interpretations.",
                    "Conversely, if the legal principle is already settled by the highest court, or its application to the facts of the case is merely a matter of routine deduction, it does not constitute a substantial question of law. Crucially, the Supreme Court in CIT v. P. Mohanakala ((2007) 291 ITR 278) and Vijay Kumar Talwar v. CIT ((2011) 330 ITR 1) ruled that the High Court cannot disturb findings of fact recorded by the ITAT unless the appellant establishes that the findings are legally 'perverse'. A finding of fact is perverse only when it is based on no evidence, or arrived at by ignoring vital material on record, or is so manifestly absurd that no reasonable person judicially instructed could ever reach it.",
                    "In corporate tax practice, framing the substantial question of law requires surgical legal precision. An appellant cannot challenge an unfavorable transfer pricing adjustment merely by arguing that the comparables selected by the ITAT were inappropriate; that is a pure question of fact. To cross the Section 260A threshold, the appellant must demonstrate that the Tribunal applied an illegal turnover filter contrary to Rule 10B, committed an error of law by failing to grant mandatory working capital adjustments, or inverted the statutory burden of proof. By demonstrating that the Tribunal committed a systematic error of law, corporate counsel converts an adverse factual finding into an admissible substantial question of law.",
                    "Under Section 260A(7), the provisions of the Code of Civil Procedure, 1908 (CPC) relating to second appeals under Section 100 apply, so far as may be, to appeals under Section 260A. This cross-statutory integration emphasizes the rigorous standard applied by High Courts: unless a demonstrable error of law permeates the Tribunal's decision, the High Court will summarily dismiss the appeal at the admission stage without issuing notice to the opposing side."
                ],
                "check": {
                    "question": "What is the definitive constitutional test established in Chunilal Mehta and Santosh Hazari to determine whether a case involves a 'substantial question of law' under Section 260A?",
                    "options": [
                        "The question is not settled by binding precedent, directly affects parties' rights or is of general public importance, and is capable of debate.",
                        "The disputed tax demand exceeds one hundred crore rupees regardless of legal principles.",
                        "The Assessing Officer and the Commissioner of Income-tax (Appeals) took conflicting views on a pure question of fact.",
                        "The appellant is a multinational corporation operating in more than three foreign jurisdictions."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "Under the Chunilal Mehta and Santosh Hazari doctrines, a question is a substantial question of law if it is not settled by precedent, affects the rights of parties or has general importance, and involves debatable legal interpretation."
                }
            },
            {
                "title": "Departmental Litigation Policy & CBDT Monetary Thresholds Architecture",
                "say": [
                    "To curb rampant, uncoordinated, and resource-draining litigation by the Revenue, Parliament and the Central Board of Direct Taxes (CBDT) institutionalized a binding National Litigation Policy. Under Section 268A of the Income-tax Act, inserted by the Finance Act, 2008, with retrospective effect from April 1, 1999, the CBDT is statutorily empowered to issue orders, instructions, or directions fixing monetary limits for the purpose of regulating the filing of appeals by income-tax authorities before the ITAT, High Courts, and Supreme Court. Section 268A(2) explicitly provides that where an authority has not filed an appeal against an adverse order solely on ground of monetary limits, that non-filing does not preclude the Department from filing an appeal in any other case involving the same legal question.",
                    "Over the past decade, the CBDT has progressively raised these monetary thresholds to eliminate low-value tax disputes. Under CBDT Circular No. 17/2019 (reiterated and revised in Instruction No. 5/2024 and Special Order of August 2024), the monetary limits for departmental appeals were fixed at unprecedented levels: (1) Before the Income Tax Appellate Tribunal (ITAT): tax effect exceeding INR 50 Lakhs (raised to INR 60 Lakhs in latest revisions); (2) Before the High Court under Section 260A: tax effect exceeding INR 1 Crore (raised to INR 2 Crores); and (3) Before the Supreme Court under Section 261 or Article 136: tax effect exceeding INR 2 Crores (raised to INR 5 Crores in 2024 revisions).",
                    "The term 'tax effect' is defined with mathematical specificity in the CBDT circulars. Tax effect means the difference between the tax on the total income assessed and the tax that would have been chargeable had such total income been reduced by the amount of income in respect of the issues against which the appeal is intended to be filed. Crucially, tax effect includes applicable surcharge and education cess, but strictly excludes interest, penalty, or any other addition unless the order contested is an independent penalty order. Where the dispute involves multiple assessment years, the monetary limit must be satisfied for each assessment year separately, unless it is a composite search block assessment.",
                    "Crucially, the CBDT circulars delineate exhaustive 'carve-outs' or exceptions where the monetary limits do not apply, and departmental appeals must be filed on merits regardless of the quantum of tax involved. The key statutory exceptions include: (a) Where the constitutional validity of an Act, rule, or notification is challenged; (b) Where the Board's order, notification, instruction, or circular has been held to be illegal or ultra vires; (c) Where revenue audit objections have been accepted by the Department; (d) In cases involving organized tax evasion, accommodation entries, or bogus donations under Section 68 or Section 69; (e) Where the dispute involves undisclosed foreign income and assets covered by the Black Money Act, 2015, or Benami Transactions law; and (f) Matters involving transfer pricing where a systemic question of economic methodology is at stake.",
                    "The legal impact of these CBDT monetary limits is sweeping and legally binding on the Revenue. In hundreds of judgments across the High Courts and the Supreme Court, it has been held that CBDT circulars issued under Section 268A possess statutory force. When a departmental appeal is called for hearing and corporate counsel demonstrates that the tax effect is below the prevailing monetary threshold, the High Court or Tribunal is duty-bound to dismiss the Revenue's appeal in limine, without entering into the substantive legal merits.",
                    "Furthermore, the CBDT circulars specify that the monetary thresholds apply retrospectively to all pending appeals. Consequently, when the CBDT issues a circular raising the High Court limit from INR 1 Crore to INR 2 Crores, corporate tax directors can file interim miscellaneous applications across all pending High Court appeals where the tax effect falls below INR 2 Crores, securing immediate withdrawal or dismissal of historical departmental appeals and extinguishing contingent balance sheet tax liabilities."
                ],
                "check": {
                    "question": "What is the legal effect if the tax effect in a departmental appeal pending before the High Court falls below the prevailing CBDT monetary threshold under Section 268A?",
                    "options": [
                        "The appeal is liable to be dismissed in limine on grounds of low tax effect without adjudicating the substantive merits.",
                        "The High Court must refer the matter to the Law Commission of India for advisory opinion.",
                        "The Assessing Officer is personally fined twenty per cent of the disputed amount.",
                        "The appeal is automatically transferred to the local District Court for summary adjudication."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "Under Section 268A and binding CBDT circulars, departmental appeals where the tax effect is below the prescribed threshold are dismissed in limine without deciding the legal merits."
                }
            },
            {
                "title": "Supreme Court Appellate Architecture under Section 261 & Article 136 Special Leave Petitions",
                "say": [
                    "At the apex of the Indian judicial system, the Supreme Court of India exercises dual appellate jurisdiction over direct tax controversies: statutory appeals under Section 261 of the Income-tax Act, 1961, and extraordinary constitutional appeals by Special Leave under Article 136 of the Constitution of India. Because the Supreme Court is the final arbiter of constitutional and statutory interpretation, its pronouncements on corporate tax law become the 'law of the land' under Article 141 of the Constitution, binding all courts, tribunals, and tax authorities across the entire territory of India.",
                    "Under Section 261, an appeal shall lie to the Supreme Court from any judgment of the High Court delivered on an appeal made under Section 260A in any case which the High Court certifies to be a fit one for appeal to the Supreme Court. The grant of a 'certificate of fitness' under Section 261 is an extraordinary and rare judicial act. The High Court will grant a certificate only when the case involves a question of widespread public importance, where divergent High Court interpretations have created an acute nationwide impasse, or where the question requires authoritative reconsideration of earlier judicial doctrines. If the High Court refuses to grant a certificate of fitness, Section 261 statutory route is extinguished.",
                    "When a certificate of fitness under Section 261 is refused or bypassed, the primary vehicle for reaching the Supreme Court is Article 136 of the Constitution: the Special Leave Petition (SLP). Under Article 136(1), 'the Supreme Court may, in its discretion, grant special leave to appeal from any judgment, decree, determination, sentence or order in any cause or matter passed or made by any court or tribunal in the territory of India.' Notice the expansive scope of Article 136: special leave can be sought not only against final High Court judgments, but also against interim High Court orders, or even directly against an order of the Income Tax Appellate Tribunal in cases of extraordinary jurisdictional overreach.",
                    "An SLP must be filed within ninety days from the date of the High Court judgment under Supreme Court Rules. The adjudication of an SLP proceeds in two distinct stages. In the first stage, the Supreme Court hears preliminary arguments to decide whether 'Special Leave' should be granted. If the Court finds no substantial constitutional or legal merit, it summarily dismisses the SLP in limine. As established by the Supreme Court in Kunhayammed v. State of Kerala ((2000) 245 ITR 360), a summary dismissal of an SLP at the threshold does not constitute an affirmation of the legal reasoning of the High Court; it merely signifies that the Supreme Court declined to exercise its discretionary jurisdiction.",
                    "However, if the Supreme Court grants Special Leave, the petition is converted into a regular Civil Appeal. In this second stage, the Supreme Court exercises full appellate jurisdiction on merits. The doctrine of merger then applies: the judgment of the High Court merges into the final judgment of the Supreme Court. Crucial tax doctrines—such as the characterization of software royalties in Engineering Analysis Centre of Excellence Pvt. Ltd. v. CIT ((2021) 432 ITR 471), corporate reorganizations in Vodafone International Holdings B.V. v. Union of India ((2012) 341 ITR 1), or Section 14A expenditure disallowances in Maxopp Investment Ltd. v. CIT—were established through this definitive Article 136 civil appeal process.",
                    "Once a final judgment is pronounced by the Supreme Court, the losing party's domestic legal remedies are virtually exhausted. The party may file a Review Petition under Article 137 within thirty days, but review is restricted to glaring errors apparent on the face of the record. Beyond review, in vanishingly rare instances of gross miscarriage of justice or judicial bias, an aggrieved corporate litigant may file a Curative Petition under the doctrine established in Rupa Ashok Hurra v. Ashok Hurra ((2002) 4 SCC 388), requiring certification by a Senior Advocate and unanimous consideration by the Chief Justice of India and senior colleagues."
                ],
                "check": {
                    "question": "Under the Supreme Court doctrine in Kunhayammed v. State of Kerala, what is the legal effect of a summary dismissal of a Special Leave Petition (SLP) in limine at the threshold stage?",
                    "options": [
                        "It does not operate as an affirmation of the High Court's legal reasoning; it merely reflects the Court's refusal to exercise discretion.",
                        "It automatically overrules all conflicting High Court judgments nationwide.",
                        "The High Court judgment is declared null and void ab initio.",
                        "The corporate assessee is granted automatic immunity from all future income-tax audits."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "In Kunhayammed (2000), the Supreme Court ruled that summary dismissal of an SLP in limine does not lay down binding law under Article 141 and does not merge the High Court order; it merely declines discretionary leave."
                }
            },
            {
                "title": "Constitutional Writ Remedies under Article 226 & 227 against Jurisdictional Flaws",
                "say": [
                    "While the Income-tax Act provides a structured, multi-tiered statutory appellate hierarchy—running from CIT(Appeals) or DRP to the ITAT, High Court under Section 260A, and Supreme Court under Article 136—there are critical junctures where statutory processes are poisoned by fatal jurisdictional errors, patent lack of authority, or gross violations of natural justice. Forcing an enterprise through ten years of multi-tiered statutory appeals to correct a patent executive illegality would cause irreparable commercial harm. To remedy such systemic failures, the Constitution of India provides an extraordinary supervisory shield: the Writ Jurisdiction of the High Court under Article 226 and Article 227.",
                    "Under Article 226 of the Constitution, every High Court possesses the power to issue prerogative writs—including writs of Certiorari (quashing an illegal order), Mandamus (compelling the performance of a public duty), and Prohibition (restraining an authority from acting without jurisdiction)—against any government authority, including income-tax authorities. In tax jurisprudence, the fundamental hurdle to maintaining an Article 226 writ petition is the well-established doctrine of exhaustion of alternative statutory remedies: courts will generally decline to entertain a writ when a comprehensive statutory appellate channel exists under the Income-tax Act.",
                    "However, in the seminal Constitution Bench and landmark judgments of Whirlpool Corporation v. Registrar of Trade Marks ((1998) 8 SCC 1), Calcutta Discount Co. Ltd. v. ITO ((1961) 41 ITR 191), and Godrej Sara Lee Ltd. v. Excise and Taxation Officer (2023), the Supreme Court carved out four celebrated exceptions where an Article 226 writ petition is maintainable despite the existence of an alternative statutory appellate remedy: (1) Where the writ petition is filed for the enforcement of any of the Fundamental Rights; (2) Where there has been a violation of the principles of natural justice (audi alteram partem); (3) Where the order or proceedings are wholly without jurisdiction or ultra vires; and (4) Where the vires of an Act or subordinate legislation is challenged.",
                    "In modern corporate tax administration—particularly under the Faceless Assessment Scheme under Section 144B and the Reassessment Scheme under Section 148/148A—Article 226 writ petitions have become the foremost frontline defense. Common grounds for securing immediate writs of certiorari quashing tax orders include: (a) Passing a final assessment order without issuing a mandatory draft assessment order to an eligible assessee under Section 144C(1), as held in Vijay Television; (b) Issuing a Section 148 reassessment notice without complying with the mandatory preliminary inquiry and show cause requirements of Section 148A, or without obtaining prior sanction from the Specified Authority under Section 151; (c) Refusing a statutory personal video hearing requested by the taxpayer under Section 144B(7)(viii) before making adverse additions; and (d) Passing an assessment order that is barred by statutory limitation under Section 153.",
                    "Under Article 227 of the Constitution, the High Court exercises power of superintendence over all courts and tribunals throughout its territorial jurisdiction, including the Income Tax Appellate Tribunal. While Article 226 focuses on quashing illegal executive orders or statutory notices, Article 227 is invoked to correct grave procedural derelictions or jurisdictional overreach by the ITAT—such as when a Tribunal bench arbitrarily refuses to follow a binding jurisdictional High Court ruling or dismisses an appeal without granting a hearing.",
                    "When corporate tax counsel invokes Article 226, the relief sought typically includes an immediate interim stay of all recovery proceedings and assessment actions. If the High Court finds a prima facie case of jurisdictional invalidity, it issues a Rule Nisi and stays the operation of the impugned demand notice. In hundreds of modern corporate disputes, writ petitions have successfully quashed reassessment notices involving thousands of crores of rupees at the threshold, vindicating the principle that the taxing authority must act strictly within the statutory boundaries established by Parliament."
                ],
                "check": {
                    "question": "Under the landmark Supreme Court doctrine in Whirlpool Corporation, what are the established exceptions where an Article 226 writ petition is maintainable despite the availability of an alternative statutory remedy?",
                    "options": [
                        "Breach of fundamental rights, violation of natural justice, total lack of jurisdiction, or challenging statutory vires.",
                        "Whenever the disputed tax liability exceeds ten per cent of the company's gross annual turnover.",
                        "Only when the Assessing Officer is an IRS officer of less than five years of administrative service.",
                        "Only if the assessee has first deposited fifty per cent of the disputed tax demand with the High Court Registry."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "In Whirlpool Corporation (1998), the Supreme Court held that alternative remedy does not bar an Article 226 writ where fundamental rights are breached, natural justice is violated, proceedings are without jurisdiction, or vires is challenged."
                }
            },
            {
                "title": "Production Python Architecture: Higher Judiciary Tax Litigation & CBDT Threshold Engine",
                "say": [
                    "Navigating multi-tier corporate tax litigation across the High Courts and Supreme Court demands rigorous algorithmic validation of limitation periods, substantial questions of law, CBDT monetary thresholds, and constitutional writ prerequisites. In this module, we engineer a production-ready computational Python architecture, HigherJudiciaryLitigationEngine, designed to manage high-stakes corporate tax litigation portfolios.",
                    "The computational engine encapsulates four primary constitutional and statutory capabilities: First, the Section 260A High Court Appeal & Limitation Monitor: auditing the 120-day filing window from ITAT order receipt, checking for substantial question of law criteria, and tracking perversity grounds against factual findings. Second, the CBDT Monetary Threshold Validator: enforcing Section 268A policy limits across ITAT (INR 50L), High Court (INR 1 Cr / 2 Cr), and Supreme Court (INR 2 Cr / 5 Cr), and evaluating statutory carve-out exceptions (vires challenges, audit objections, transfer pricing systemic issues). Third, the Article 226 Writ Maintainability Evaluator: applying the four-pillar Whirlpool Corporation test to determine whether a writ of certiorari lies directly against an assessment or reassessment order without exhausting statutory appellate remedies. Fourth, the Section 261 & Article 136 Supreme Court Appeal Tracker: managing the 90-day SLP limitation clock and modeling the Kunhayammed doctrine regarding threshold dismissals versus full civil appeal mergers.",
                    "Let us inspect the complete, executable Python architecture implementing these advanced litigation mechanics:",
                    "```python",
                    "import datetime",
                    "from dataclasses import dataclass, field",
                    "from enum import Enum",
                    "from typing import Dict, List, Optional",
                    "",
                    "class JudicialTier(Enum):",
                    "    ITAT = 'ITAT'",
                    "    HIGH_COURT = 'HIGH_COURT'",
                    "    SUPREME_COURT = 'SUPREME_COURT'",
                    "",
                    "@dataclass",
                    "class CorporateTaxDispute:",
                    "    case_id: str",
                    "    assessment_year: str",
                    "    disputed_tax_effect_inr: float",
                    "    is_constitutional_vires_challenged: bool = False",
                    "    is_audit_objection_accepted: bool = False",
                    "    is_bogus_accommodation_entry: bool = False",
                    "    is_systemic_transfer_pricing_issue: bool = False",
                    "",
                    "class HigherJudiciaryLitigationEngine:",
                    "    # Standard CBDT Circular Monetary Limits under Section 268A (in INR)",
                    "    CBDT_THRESHOLDS = {",
                    "        JudicialTier.ITAT: 5000000.0,         # INR 50 Lakhs",
                    "        JudicialTier.HIGH_COURT: 10000000.0,   # INR 1 Crore (revisable to 2 Cr)",
                    "        JudicialTier.SUPREME_COURT: 20000000.0 # INR 2 Crores (revisable to 5 Cr)",
                    "    }",
                    "",
                    "    def __init__(self, corporate_name: str, dispute: CorporateTaxDispute):",
                    "        self.company = corporate_name",
                    "        self.dispute = dispute",
                    "",
                    "    def evaluate_cbdt_departmental_maintainability(self, tier: JudicialTier) -> Dict[str, any]:",
                    "        threshold = self.CBDT_THRESHOLDS[tier]",
                    "        tax_effect = self.dispute.disputed_tax_effect_inr",
                    "",
                    "        # Check statutory carve-outs / exceptions where limits do not apply",
                    "        has_carve_out = (",
                    "            self.dispute.is_constitutional_vires_challenged or",
                    "            self.dispute.is_audit_objection_accepted or",
                    "            self.dispute.is_bogus_accommodation_entry or",
                    "            self.dispute.is_systemic_transfer_pricing_issue",
                    "        )",
                    "",
                    "        is_appeal_barred_by_threshold = (tax_effect <= threshold) and not has_carve_out",
                    "        return {",
                    "            'tier': tier.value,",
                    "            'disputed_tax_effect_inr': tax_effect,",
                    "            'statutory_threshold_inr': threshold,",
                    "            'has_applicable_carve_out': has_carve_out,",
                    "            'is_departmental_appeal_barred': is_appeal_barred_by_threshold,",
                    "            'litigation_remedy': (",
                    "                'FILE_MOTION_FOR_DISMISSAL_IN_LIMINE_UNDER_CBDT_CIRCULAR' ",
                    "                if is_appeal_barred_by_threshold else 'DEFEND_APPEAL_ON_SUBSTANTIVE_LEGAL_MERITS'",
                    "            )",
                    "        }",
                    "",
                    "    def audit_section_260a_appeal(self, itat_order_date: datetime.date, filing_date: datetime.date, is_substantial_question_formulated: bool, is_pure_finding_of_fact: bool) -> Dict[str, any]:",
                    "        elapsed_days = (filing_date - itat_order_date).days",
                    "        is_timely = elapsed_days <= 120",
                    "",
                    "        # Chunilal Mehta & Santosh Hazari test",
                    "        is_admissible_law_question = is_substantial_question_formulated and not is_pure_finding_of_fact",
                    "        return {",
                    "            'elapsed_days': elapsed_days,",
                    "            'is_timely_120_days': is_timely,",
                    "            'is_substantial_question_formulated': is_substantial_question_formulated,",
                    "            'is_pure_finding_of_fact': is_pure_finding_of_fact,",
                    "            'admissibility_status': (",
                    "                'ADMISSIBLE_UNDER_SECTION_260A' if (is_timely and is_admissible_law_question) ",
                    "                else 'VULNERABLE_TO_SUMMARY_DISMISSAL_AT_ADMISSION'",
                    "            ),",
                    "            'governing_jurisprudence': 'Sir Chunilal Mehta & Santosh Hazari doctrines'",
                    "        }",
                    "",
                    "    def evaluate_article_226_writ_maintainability(",
                    "        self,",
                    "        fundamental_right_breached: bool,",
                    "        natural_justice_violated: bool,",
                    "        total_lack_of_jurisdiction: bool,",
                    "        statutory_vires_challenged: bool",
                    "    ) -> Dict[str, any]:",
                    "        # 4 Whirlpool Corporation Exceptions",
                    "        qualifies_for_writ = (",
                    "            fundamental_right_breached or",
                    "            natural_justice_violated or",
                    "            total_lack_of_jurisdiction or",
                    "            statutory_vires_challenged",
                    "        )",
                    "        reasons = []",
                    "        if fundamental_right_breached: reasons.append('BREACH_OF_FUNDAMENTAL_RIGHTS')",
                    "        if natural_justice_violated: reasons.append('VIOLATION_OF_NATURAL_JUSTICE_AUDI_ALTERAM_PARTEM')",
                    "        if total_lack_of_jurisdiction: reasons.append('TOTAL_LACK_OF_JURISDICTION_OR_ULTRA_VIRES')",
                    "        if statutory_vires_challenged: reasons.append('CHALLENGE_TO_STATUTORY_VIRES')",
                    "",
                    "        return {",
                    "            'is_writ_maintainable_article_226': qualifies_for_writ,",
                    "            'whirlpool_exceptions_invoked': reasons,",
                    "            'alternative_remedy_bar': (",
                    "                'ALTERNATIVE_REMEDY_BYPASSED_SUCCESSFULLY' if qualifies_for_writ ",
                    "                else 'BARRED_BY_EXISTENCE_OF_STATUTORY_APPELLATE_REMEDY'",
                    "            )",
                    "        }",
                    "",
                    "    def audit_supreme_court_slp_timeline(self, hc_order_date: datetime.date, slp_filing_date: datetime.date) -> Dict[str, any]:",
                    "        elapsed_days = (slp_filing_date - hc_order_date).days",
                    "        is_timely = elapsed_days <= 90",
                    "        return {",
                    "            'elapsed_days': elapsed_days,",
                    "            'is_timely_90_days': is_timely,",
                    "            'jurisdiction_article': 'Article 136 of the Constitution of India',",
                    "            'doctrine_of_merger': 'Applies upon grant of Special Leave and regular Civil Appeal hearing under Kunhayammed'",
                    "        }",
                    "```",
                    "Deploying this computational architecture across multinational tax conglomerates provides real-time judicial intelligence. The system empowers corporate tax directors to quash ultra vires assessments via Article 226 writ petitions within hours of service, identify departmental appeals liable to summary dismissal under CBDT monetary thresholds, and craft airtight substantial questions of law under Section 260A for High Court adjudication."
                ],
                "check": {
                    "question": "What is the statutory limitation period for filing an appeal before the High Court under Section 260A(2)?",
                    "options": [
                        "Within one hundred and twenty days from the date of communication of the ITAT order.",
                        "Within thirty days of receiving the draft assessment order.",
                        "Within sixty days of the end of the financial year.",
                        "Within forty-five days of passing board resolution."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "Under Section 260A(2)(a), an appeal to the High Court must be filed within one hundred and twenty days from the date on which the order appealed against is received."
                }
            }
        ]
    }
    return day54

if __name__ == '__main__':
    data = get_day54_data()
    print(f"Day 54 Title: {data['title']}")
    print(f"Parts count: {len(data['parts'])}")
    for i, p in enumerate(data['parts']):
        words = len(" ".join(p['say']).split())
        print(f"Part {i+1}: {words} words")
