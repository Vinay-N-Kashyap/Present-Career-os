"""
create_day52_tax.py
Course: bcom_tax (Corporate Tax, GST & Direct Taxation)
Month 2 Block 11 Day 52: Dispute Resolution Panel (DRP) Architecture under Section 144C
"""

def get_day52_data():
    day52 = {
        "day": 52,
        "coursePrefix": "bcom_tax",
        "title": "Dispute Resolution Panel (DRP) Architecture under Section 144C: Collegiate Review & Direct ITAT Gateway",
        "description": "Master the specialized dispute resolution mechanism under Section 144C of the Income-tax Act, 1961, for eligible corporate assessees. Analyze the statutory definition of 'eligible assessee' (foreign companies and resident entities with transfer pricing variations under Section 92CA), the mandatory draft assessment order procedure under Section 144C(1), the strict thirty-day window for filing objections in Form 35A under Section 144C(2), the collegiate constitution and powers of the three-member Panel of Commissioners, the non-extendable nine-month statutory deadline under Section 144C(12), the binding character of DRP directions on the Assessing Officer under Section 144C(10), the bar on departmental appeals, direct appeals by the assessee to the ITAT under Section 253(1)(d), and production-grade DRP litigation modeling algorithms.",
        "minutes": 38,
        "parts": [
            {
                "title": "The Section 144C Statutory Gateway: Eligible Assessees & The Mandatory Draft Assessment Order",
                "say": [
                    "To provide an expedited, specialized, and high-level administrative alternative to the protracted multi-tier appellate litigation system for multinational enterprises and cross-border commercial operators, Parliament enacted Section 144C through the Finance (No. 2) Act, 2009. Codified under Chapter XIV of the Income-tax Act, 1961, Section 144C establishes the 'Dispute Resolution Panel' (DRP) architecture. The DRP is not an ordinary appellate authority; it is a specialized statutory collegium comprising three Principal Commissioners or Commissioners of Income-tax constituted by the Central Board of Direct Taxes (CBDT) to resolve complex transfer pricing and international tax controversies prior to the finalization of the assessment.",
                    "The invocation of Section 144C is conditioned upon the taxpayer qualifying as an 'eligible assessee' as exhaustively defined in Section 144C(15)(b). Under this definition, an eligible assessee encompasses two distinct categories: (i) any person in whose case the variation proposed in the assessment order arises as a consequence of the order of the Transfer Pricing Officer (TPO) passed under Section 92CA(3) in respect of international transactions or specified domestic transactions; and (ii) any foreign company (non-resident corporate entity), regardless of whether transfer pricing adjustments are proposed in their assessment.",
                    "Where an assessee is an eligible assessee and the Assessing Officer proposes to make any variation in the income or loss returned which is prejudicial to the interest of such assessee, Section 144C(1) imposes an uncompromising, mandatory procedural obligation: 'The Assessing Officer shall, notwithstanding anything to the contrary contained in this Act, in the first instance, forward a draft of the proposed order of assessment (hereafter in this section referred to as the draft order) to the eligible assessee.' The draft assessment order must itemize every proposed variation, specify the statutory provisions under which additions are proposed, and include the computational schedules of tax and interest.",
                    "The issuance of a draft assessment order under Section 144C(1) is a mandatory, jurisdictional condition precedent that cannot be bypassed or waived by the Revenue. In landmark constitutional rulings—most notably Vijay Television Pvt. Ltd. v. DIT by the Madras High Court, Turner International India Pvt. Ltd. v. DCIT by the Delhi High Court, and affirmed by the Supreme Court—it has been established that where an Assessing Officer passes a final assessment order directly under Section 143(3) or Section 144B against an eligible assessee without first issuing a draft assessment order under Section 144C(1), such order is void ab initio, illegal, and without statutory jurisdiction.",
                    "Furthermore, courts have ruled that passing a final assessment order with a notice of demand under Section 156 is not a mere procedural irregularity curable under Section 292B. Because it deprives the taxpayer of their statutory right to approach the collegiate Dispute Resolution Panel, the defect is incurable and fatal to the assessment. Corporate tax counsel confronted with a premature final assessment order must immediately challenge its validity before the High Court under Article 226, securing a writ of certiorari quashing the entire assessment without being compelled to litigate the substantive merits.",
                    "This mandatory procedural protection applies with equal rigor to reassessment proceedings under Section 147. In landmark rulings including JCB India Ltd. v. DCIT by the Delhi High Court, the judiciary held that whenever an Assessing Officer proposes to vary the income of an eligible assessee in a reassessment proceeding, the mandate of Section 144C(1) overrides general reassessment procedures. If the Assessing Officer bypasses the draft order in a Section 147 proceeding, the entire reassessment collapses. Moreover, by virtue of amendments introduced by the Finance Act, 2020, Parliament clarified that foreign companies qualify as eligible assessees in respect of any variation whatsoever—whether involving transfer pricing adjustments, royalty characterization, permanent establishment profit attributions, or standard business deductions—reinforcing Section 144C as an expansive international charter."
                ],
                "check": {
                    "question": "What is the legal consequence if an Assessing Officer issues a final assessment order with a demand notice directly against an eligible assessee without first issuing a draft assessment order under Section 144C(1)?",
                    "options": [
                        "The final assessment order is void ab initio, illegal, and without statutory jurisdiction, liable to be quashed under Article 226.",
                        "The defect is automatically cured under Section 292B upon paying a ten-thousand-rupee administrative penalty.",
                        "The assessee is deemed to have consented to the variations and forfeits all rights of appeal.",
                        "The assessment is automatically referred to the Central Board of Direct Taxes for re-issuance."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "Judicial precedents including Vijay Television and Turner International establish that issuing a final order without first forwarding a draft order under Section 144C(1) is an incurable jurisdictional defect rendering the order void ab initio."
                }
            },
            {
                "title": "The Bifurcated Statutory Choice under Section 144C(2) & Form 35A Objections Architecture",
                "say": [
                    "Upon receipt of the draft assessment order forwarded under Section 144C(1), the eligible assessee is presented with a critical statutory crossroad codified in Section 144C(2). The statute prescribes a strict, non-extendable window: within thirty days of the date of receipt of the draft order, the assessee must exercise one of two mutually exclusive statutory options: (a) file their acceptance of the variations to the Assessing Officer; or (b) file their objections, if any, to such variations with the Dispute Resolution Panel and the Assessing Officer.",
                    "If the corporate assessee chooses Option A—either by formally communicating acceptance of the draft variations or by remaining silent and failing to file objections within thirty days—Section 144C(3) mandates that the Assessing Officer shall complete the assessment on the basis of the draft order within one month from the end of the month in which the acceptance is received or the period of filing objections expires. In this scenario, the Assessing Officer passes a final assessment order with a notice of demand under Section 156, and the assessee's remedy lies in filing a traditional first appeal before the Commissioner of Income-tax (Appeals) in Form 35 under Section 246A.",
                    "Conversely, if the assessee chooses Option B—opting to challenge the proposed variations before the Dispute Resolution Panel—they must file comprehensive electronic objections in Form No. 35A under Rule 44G of the Income-tax Rules, 1962. Form 35A must be submitted simultaneously to the designated DRP secretariat and the Assessing Officer. Crucially, the thirty-day limitation period prescribed under Section 144C(2) is absolute and jurisdictional. Neither the DRP nor the Assessing Officer possesses statutory power under Section 144C to condone delay in filing Form 35A. An objection filed on the thirty-first day is legally invalid, compelling the Assessing Officer to proceed under Section 144C(3) as if no objections were received.",
                    "Form 35A requires meticulous drafting and forensic organization. It must contain: (1) a comprehensive Statement of Facts detailing the enterprise profile, corporate supply chain, and international transactions; (2) itemized Objections to Variations, sequentially addressing each transfer pricing adjustment, corporate tax disallowance, or permanent establishment finding; (3) certified copies of the draft assessment order, the Transfer Pricing Officer's order under Section 92CA(3), and Form 3CEB; and (4) an exhaustive Paper Book containing economic benchmarking studies, functional-asset-risk (FAR) analyses, audited segmentals, and technical contracts.",
                    "Corporate tax directors must conduct a rigorous strategic assessment when deciding between the DRP route and the CIT(Appeals) route. The DRP route offers three decisive strategic advantages: (a) a collegiate bench of three senior Commissioners providing higher judicial independence than a single jurisdictional officer; (b) a statutory, non-extendable nine-month time limit guaranteeing swift resolution; and (c) if additions are sustained, the assessee appeals directly to the Income Tax Appellate Tribunal under Section 253(1)(d), bypassing years of delay at the first appellate stage. However, because DRP directions are binding on the Department, the DRP route is unsuited for taxpayers seeking to preserve factual ambiguities.",
                    "Procedurally, the electronic filing of Form 35A is governed by Rule 44G and the Income-tax (Dispute Resolution Panel) Rules, 2009. The objections must be accompanied by an electronic index, a concise summary of the business operations, and an audited reconciliation between the Transfer Pricing Officer's economic benchmark and the taxpayer's functional analysis. The Delhi High Court in Nokia India Pvt. Ltd. reaffirmed that because the thirty-day limitation under Section 144C(2) is statutory and contains no condonation clause, enterprise tax teams must maintain automated alerting systems that calculate the deadline from the exact timestamp of email delivery or portal notification, ensuring that electronic filings are uploaded before midnight of the thirtieth day. Failure to lodge Form 35A within this unyielding statutory window extinguishes the assessee's right to collegiate DRP review, irrevocably forcing the taxpayer into the traditional first appellate channel under Section 246A."
                ],
                "check": {
                    "question": "What is the statutory limitation period for filing objections in Form 35A before the Dispute Resolution Panel under Section 144C(2)?",
                    "options": [
                        "Within thirty days of the date of receipt of the draft assessment order by the eligible assessee.",
                        "Within sixty days of the end of the financial year in which the draft order was forwarded.",
                        "Within ninety days from the date of the Transfer Pricing Officer's preliminary hearing.",
                        "Within forty-five days of obtaining board of directors approval."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "Section 144C(2) explicitly provides that the eligible assessee must file their acceptance or objections with the Dispute Resolution Panel within thirty days of the date of receipt of the draft order."
                }
            },
            {
                "title": "Collegiate Powers, Proceedings & The Nine-Month Limitation Period under Section 144C",
                "say": [
                    "Once valid objections in Form 35A are lodged by an eligible assessee, the Dispute Resolution Panel assumes exclusive statutory jurisdiction over the contested variations. The DRP operates as a collegiate quasi-judicial tribunal governed by Section 144C(5) through Section 144C(12). Under Section 144C(5), the DRP shall issue such directions as it thinks fit for the guidance of the Assessing Officer to enable them to complete the assessment. In formulating its directions, Section 144C(6) mandates that the Panel shall consider: (a) the draft assessment order; (b) the objections filed by the assessee; (c) the evidence furnished by the assessee; (d) the report, if any, of the Assessing Officer, Valuation Officer, or Transfer Pricing Officer; (e) records relating to the draft order; and (f) evidence collected by the Panel on its own motion.",
                    "Under Section 144C(7), the DRP is vested with extensive investigative powers, including the authority to make further inquiries, direct any income-tax authority to conduct inquiries and report back, and inspect corporate facilities. The substantive adjudicatory powers of the Panel are codified in Section 144C(8): 'The Dispute Resolution Panel may confirm, reduce or enhance the variations proposed in the draft order.' Crucially, Section 144C(8) contains an explicit statutory prohibition: 'so, however, that it shall not set aside any proposed variation or issue any direction under sub-section (5) for further inquiry and passing of the assessment order.' Just like the CIT(Appeals), the DRP cannot remand issues back to the Assessing Officer; it must decide the variations conclusively.",
                    "Where the DRP proposes to enhance any variation—for example, increasing a transfer pricing markup or disallowing an additional expense item—Section 144C(11) enacts a mandatory procedural safeguard: no direction shall be issued for enhancement unless the eligible assessee has been given an opportunity of being heard. Furthermore, under Section 144C(11), the DRP is strictly prohibited from considering any issue or variation that was not raised in the draft order. The Panel cannot invent a new issue outside the four corners of the draft assessment order.",
                    "A defining statutory invariant of the DRP regime is the strict, non-extendable limitation period codified in Section 144C(12): 'No direction under sub-section (5) shall be issued after the expiry of nine months from the end of the month in which the draft order is forwarded to the eligible assessee.' Notice the precise statutory formulation: the nine-month clock begins ticking from the end of the month in which the draft order was forwarded by the Assessing Officer, not from the date the assessee filed Form 35A. For example, if a draft order is forwarded on December 15, 2023, the end of the month is December 31, 2023, and the nine-month period expires definitively on September 30, 2024.",
                    "The legal effect of the expiry of the nine-month limitation is absolute. In landmark decisions including Louis Dreyfus Company India and InnoVen Capital, High Courts have held that if the DRP fails to issue directions within the statutory nine-month period under Section 144C(12), the Panel becomes functus officio and loses all legal authority to issue directions. Any directions issued after the expiry of nine months are void ab initio. In such event, the Assessing Officer is statutorily barred from implementing late DRP directions and must complete the assessment without giving effect to any enhancements, or the entire proceeding lapses by operation of law under Section 153.",
                    "This jurisdictional principle was reinforced by the Madras High Court in Roca Bathroom Products Pvt. Ltd. and the Delhi High Court in Ensco Maritime. The courts held that the limitation of nine months under Section 144C(12) is absolute and non-derogable; Parliament deliberately did not provide any power of extension or exclusion of time, except for narrow court stay situations. When the DRP exceeds the nine-month limitation, any subsequent direction is legally non-existent. If the Assessing Officer nevertheless proceeds to pass a final assessment order implementing the invalid directions, the final order is void ab initio and must be quashed under Article 226 of the Constitution, restoring the assessed income to the figure returned by the corporate assessee."
                ],
                "check": {
                    "question": "What is the statutory limitation period within which the Dispute Resolution Panel must issue its binding directions under Section 144C(12)?",
                    "options": [
                        "Nine months from the end of the month in which the draft order was forwarded to the eligible assessee.",
                        "Twelve months from the date of filing Form 35A by the corporate appellant.",
                        "Six months from the conclusion of the final oral video hearing.",
                        "Two years from the end of the relevant assessment year."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "Section 144C(12) explicitly mandates that no direction shall be issued after the expiry of nine months from the end of the month in which the draft order is forwarded to the eligible assessee."
                }
            },
            {
                "title": "Implementation of DRP Directions under Section 144C(13) & Direct Gateway to ITAT",
                "say": [
                    "Once the Dispute Resolution Panel concludes its collegiate review and issues directions under Section 144C(5), the proceedings transition to the final statutory execution phase codified in sub-sections (10) and (13) of Section 144C. Section 144C(10) establishes the cardinal legal principle of the DRP regime: 'Every direction issued by the Dispute Resolution Panel shall be binding on the Assessing Officer.' Unlike administrative recommendations or advisory opinions, DRP directions possess absolute statutory primacy. The Assessing Officer possesses zero discretion to question, modify, dilute, or ignore the findings of the Panel.",
                    "The timeline for implementing DRP directions is strictly circumscribed by Section 144C(13). Under Section 144C(13), upon receipt of the directions issued under sub-section (5), the Assessing Officer shall, in conformity with the directions, complete the assessment within one month from the end of the month in which such direction is received. Crucially, the statute specifies that this final assessment shall be completed 'without providing any further opportunity of being heard to the assessee, notwithstanding anything contained in section 153'. The Assessing Officer merely performs a ministerial computation: applying the DRP directions to recalculate total income, computing tax and interest, and serving the final assessment order along with the notice of demand under Section 156.",
                    "If the Assessing Officer fails to pass the final assessment order within the one-month period prescribed under Section 144C(13), the assessment order is time-barred and legally dead. As affirmed by the Delhi High Court in ESPN Star Sports and the Bombay High Court in Shell India Markets, the limitation under Section 144C(13) is mandatory; an order passed even one day after the expiry of the one-month window is null, void, and without jurisdiction.",
                    "A profound systemic feature of the Section 144C framework is the statutory asymmetry regarding appeals. Under the Indian direct tax scheme, the Income Tax Department is strictly prohibited from filing an appeal against the directions of the Dispute Resolution Panel. Because the DRP is an internal collegium of three senior Commissioners, the Revenue cannot litigate against its own high-ranking authority. If the DRP directs the full deletion of an astronomical transfer pricing adjustment of INR 500 Crores, that deletion is final and unappealable by the tax department before any tribunal or court. Furthermore, the Supreme Court and High Courts have consistently held that the Department cannot invoke extraordinary writ jurisdiction under Article 226 of the Constitution to challenge or nullify DRP directions, cementing the binding character established by Parliament.",
                    "Conversely, where the DRP sustains variations prejudicial to the eligible assessee, the taxpayer is conferred an extraordinary direct appellate gateway. Under Section 253(1)(d), any assessee aggrieved by an order passed by an Assessing Officer under sub-section (3) of Section 143 or Section 144 or Section 147 in pursuance of the directions of the Dispute Resolution Panel may appeal directly to the Income Tax Appellate Tribunal (ITAT). The assessee bypasses the CIT(Appeals) tier completely, saving years of intermediate litigation. The appeal must be filed in Form No. 36 within sixty days of the date on which the final assessment order is communicated to the assessee, accompanied by the prescribed tribunal fee under Section 253(6).",
                    "During the implementation under Section 144C(13), the Assessing Officer is strictly restricted to the four corners of the DRP directions. As ruled by the Karnataka High Court in CIT v. Cisco Systems India Pvt. Ltd. and the Delhi High Court in Sony Mobile Communications, the Assessing Officer has no jurisdiction to re-compute adjustments, deviate from the economic comparables accepted by the Panel, or inject fresh disallowances under the guise of giving effect to the order. Any deviation or unauthorized addition made by the Assessing Officer in violation of DRP directions renders that portion of the assessment ultra vires and liable to immediate summary deletion by the ITAT, positioning the corporate enterprise to contest international tax controversies before the highest fact-finding tribunal with rigorous procedural protection."
                ],
                "check": {
                    "question": "Can the Income Tax Department file an appeal before the ITAT or High Court against the directions issued by the Dispute Resolution Panel?",
                    "options": [
                        "No, DRP directions are strictly binding on the Assessing Officer, and the Department has no statutory right of appeal against them.",
                        "Yes, the Department may appeal to the ITAT if the Principal Chief Commissioner provides written authorization.",
                        "Yes, but only if the disputed tax variation exceeds five crore rupees.",
                        "Yes, the Department files an automatic appeal before the Commissioner of Income-tax (Appeals)."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "Under Section 144C(10), DRP directions are strictly binding on the Assessing Officer, and the Income Tax Act provides no statutory mechanism for the Department to appeal against DRP directions."
                }
            },
            {
                "title": "Production Python Architecture: Section 144C DRP Objection & Timeline Orchestrator",
                "say": [
                    "In multinational enterprise tax practice, orchestrating Dispute Resolution Panel proceedings across cross-border subsidiaries requires rigorous algorithmic tracking of draft order dates, Form 35A objection windows, DRP nine-month limitation deadlines, and Section 144C(13) final order timelines. In this module, we develop a production-grade Python simulation architecture, DisputeResolutionPanelEngine, designed to manage enterprise DRP litigation portfolios.",
                    "The computational engine models five core statutory mechanisms: First, the Eligible Assessee Validator: verifying that the taxpayer qualifies as a foreign company or that variations arise from a Section 92CA(3) TPO order. Second, the Draft Order Compliance Gate: verifying that the lower authority issued a valid Section 144C(1) draft order rather than an illegal premature final order, flagging void ab initio assessments under the Vijay Television doctrine. Third, the Form 35A 30-Day Objection Tracker: calculating elapsed days from draft order receipt and enforcing the non-extendable Section 144C(2) limitation. Fourth, the Section 144C(12) 9-Month Statutory Deadline Clock: computing the exact expiry date from the end of the forwarding month and flagging functus officio directions under Louis Dreyfus. Fifth, the Section 144C(13) Implementation Monitor: auditing the one-month final assessment order deadline and structuring direct ITAT Form 36 appeals under Section 253(1)(d).",
                    "Let us examine the complete, executable Python architecture implementing these statutory mechanics:",
                    "```python",
                    "import calendar",
                    "import datetime",
                    "from dataclasses import dataclass, field",
                    "from typing import Dict, List, Optional",
                    "",
                    "@dataclass",
                    "class ProposedVariation:",
                    "    issue_code: str",
                    "    description: str",
                    "    amount_inr: float",
                    "    is_transfer_pricing: bool",
                    "",
                    "class DisputeResolutionPanelEngine:",
                    "    def __init__(self, corporate_name: str, is_foreign_company: bool, ay: str, draft_order_forwarded_date: datetime.date, draft_order_received_date: datetime.date):",
                    "        self.company = corporate_name",
                    "        self.is_foreign = is_foreign_company",
                    "        self.ay = ay",
                    "        self.forwarded_date = draft_order_forwarded_date",
                    "        self.received_date = draft_order_received_date",
                    "        self.variations: List[ProposedVariation] = []",
                    "        self.has_demand_notice_attached: bool = False  # If True, indicates illegal premature final order",
                    "",
                    "    def add_variation(self, code: str, desc: str, amount_inr: float, is_tp: bool):",
                    "        self.variations.append(ProposedVariation(code, desc, amount_inr, is_tp))",
                    "",
                    "    def set_order_characteristics(self, has_demand_notice: bool):",
                    "        self.has_demand_notice_attached = has_demand_notice",
                    "",
                    "    def audit_drp_workflow(self, form_35a_filing_date: datetime.date, drp_direction_date: Optional[datetime.date] = None, final_order_date: Optional[datetime.date] = None) -> Dict[str, any]:",
                    "        # 1. Eligible Assessee Verification under Section 144C(15)(b)",
                    "        has_tp_variation = any(v.is_transfer_pricing for v in self.variations)",
                    "        is_eligible_assessee = self.is_foreign or has_tp_variation",
                    "",
                    "        # 2. Draft Order Legality under Vijay Television Doctrine",
                    "        is_premature_final_order = self.has_demand_notice_attached and is_eligible_assessee",
                    "        order_validity_status = (",
                    "            'VOID_AB_INITIO_VIJAY_TELEVISION_DOCTRINE' if is_premature_final_order else 'VALID_SECTION_144C_1_DRAFT_ORDER'",
                    "        )",
                    "",
                    "        # 3. Form 35A 30-Day Limitation Check under Section 144C(2)",
                    "        elapsed_days_filing = (form_35a_filing_date - self.received_date).days",
                    "        is_form_35a_timely = elapsed_days_filing <= 30",
                    "",
                    "        # 4. DRP 9-Month Statutory Limitation under Section 144C(12)",
                    "        forwarded_year = self.forwarded_date.year",
                    "        forwarded_month = self.forwarded_date.month",
                    "        last_day_of_forwarding_month = calendar.monthrange(forwarded_year, forwarded_month)[1]",
                    "        start_of_9m_clock = datetime.date(forwarded_year, forwarded_month, last_day_of_forwarding_month)",
                    "",
                    "        # Add 9 calendar months to end of month",
                    "        month_target = forwarded_month + 9",
                    "        year_target = forwarded_year + (month_target - 1) // 12",
                    "        month_final = ((month_target - 1) % 12) + 1",
                    "        last_day_target = calendar.monthrange(year_target, month_final)[1]",
                    "        drp_9m_deadline = datetime.date(year_target, month_final, last_day_target)",
                    "",
                    "        is_drp_direction_valid = True",
                    "        if drp_direction_date:",
                    "            is_drp_direction_valid = drp_direction_date <= drp_9m_deadline",
                    "",
                    "        # 5. Final Assessment Order 1-Month Limitation under Section 144C(13)",
                    "        final_order_deadline = None",
                    "        is_final_order_timely = True",
                    "        if drp_direction_date and is_drp_direction_valid:",
                    "            dir_year = drp_direction_date.year",
                    "            dir_month = drp_direction_date.month",
                    "            month_after = dir_month + 1",
                    "            year_after = dir_year + (month_after - 1) // 12",
                    "            month_after_final = ((month_after - 1) % 12) + 1",
                    "            last_day_after = calendar.monthrange(year_after, month_after_final)[1]",
                    "            final_order_deadline = datetime.date(year_after, month_after_final, last_day_after)",
                    "            if final_order_date:",
                    "                is_final_order_timely = final_order_date <= final_order_deadline",
                    "",
                    "        return {",
                    "            'company': self.company,",
                    "            'assessment_year': self.ay,",
                    "            'is_eligible_assessee': is_eligible_assessee,",
                    "            'order_validity_status': order_validity_status,",
                    "            'form_35a_elapsed_days': elapsed_days_filing,",
                    "            'is_form_35a_timely': is_form_35a_timely,",
                    "            'drp_9m_statutory_deadline': drp_9m_deadline.isoformat(),",
                    "            'is_drp_direction_timely': is_drp_direction_valid,",
                    "            'final_order_1m_deadline': final_order_deadline.isoformat() if final_order_deadline else None,",
                    "            'is_final_order_timely': is_final_order_timely,",
                    "            'next_appellate_forum': 'Direct Appeal to ITAT under Section 253(1)(d) within 60 days'",
                    "        }",
                    "```",
                    "In cross-border enterprise practice, this computational architecture is deployed across global shared service centers to track international transfer pricing variations. The system automatically verifies that DRP collegiate panels act strictly within their non-extendable nine-month statutory mandate, ensuring that corporate rights under the Indian Income-tax Act are preserved and defended with mathematical certitude."
                ],
                "check": {
                    "question": "In DisputeResolutionPanelEngine, what is the next appellate forum available to an assessee once a final order is passed implementing DRP directions?",
                    "options": [
                        "Direct Appeal to the Income Tax Appellate Tribunal (ITAT) under Section 253(1)(d) within sixty days.",
                        "First Appeal before the Commissioner of Income-tax (Appeals) in Form 35.",
                        "Arbitration petition before the International Court of Justice in The Hague.",
                        "Civil suit filed before the local District Munsif Court."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "Under Section 253(1)(d), an order passed in pursuance of DRP directions is appealable directly to the Income Tax Appellate Tribunal (ITAT) within sixty days, bypassing the CIT(Appeals)."
                }
            }
        ]
    }
    return day52

if __name__ == '__main__':
    data = get_day52_data()
    print(f"Day 52 Title: {data['title']}")
    print(f"Parts count: {len(data['parts'])}")
    for i, p in enumerate(data['parts']):
        words = len(" ".join(p['say']).split())
        print(f"Part {i+1}: {words} words")
