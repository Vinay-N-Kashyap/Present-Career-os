"""
Day 56 Curriculum Expansion Generator:
Course: bcom_tax (Corporate Tax Planning, MAT, DTAA, Transfer Pricing & GST)
Day 56: General Anti-Avoidance Rules (GAAR) under Chapter X-A: Impermissible Avoidance Arrangements & Section 95-102
"""

import sys

def get_day56_data():
    day56 = {
        "day": 56,
        "coursePrefix": "bcom_tax",
        "minutes": 38,
        "title": "General Anti-Avoidance Rules (GAAR) under Chapter X-A: Impermissible Avoidance Arrangements & Treaty Overrides",
        "description": "Master the direct tax statutory architecture of General Anti-Avoidance Rules (GAAR) under Chapter X-A (Sections 95 to 102). Understand the definition of Impermissible Avoidance Arrangements (IAA) under Section 96, the four tainted element tests, lack of commercial substance under Section 97, round-trip financing and accommodating parties, Section 98 consequences, the interplay between GAAR, SAAR, and DTAA Principal Purpose Test (PPT), the INR 3 Crore safe harbour threshold under Rule 10U, and the statutory Approving Panel procedure.",
        "parts": [
            {
                "title": "The Statutory Architecture of GAAR: Chapter X-A, Section 95 & The Main Purpose Threshold",
                "say": [
                    "Direct tax systems worldwide continually grapple with the boundary between legitimate tax planning, aggressive tax avoidance, and illegal tax evasion. Historically, under the classic common law doctrine enunciated by the House of Lords in Duke of Westminster and affirmed in India by the Supreme Court in McDowell & Co. Ltd. v. CTO ((1985) 154 ITR 148) and Vodafone International Holdings B.V. v. Union of India ((2012) 341 ITR 1), taxpayers possessed the legal right to arrange their affairs within the four corners of the law so as to minimize tax liability. However, to dismantle sophisticated corporate structures that complied with the literal text of the statute while violating its economic intent, Parliament introduced Chapter X-A into the Income-tax Act, 1961, containing Sections 95 through 102, officially enacting India's General Anti-Avoidance Rules (GAAR), effective from Assessment Year 2018-19.",
                    "The overarching charging mandate of GAAR is codified in Section 95(1): 'Notwithstanding anything contained in the Act, an arrangement entered into by an assessee may be declared to be an impermissible avoidance arrangement and the consequence in relation to tax arising therefrom may be determined subject to the provisions of this Chapter.' Notice the sweeping non-obstante clause ('Notwithstanding anything contained in the Act'): Section 95 overrides every other provision of the domestic tax law and, by virtue of Section 90(2A), explicitly overrides bilateral Double Tax Avoidance Agreements (DTAAs). Even if an international tax treaty confers a complete tax exemption—such as Article 13 capital gains relief under a legacy DTAA—the Indian tax authority may invoke GAAR to deny treaty benefits if the transaction constitutes an impermissible avoidance arrangement.",
                    "The core statutory threshold for triggering GAAR is codified in Section 96(1). Under Section 96(1), an arrangement is declared to be an Impermissible Avoidance Arrangement (IAA) if it satisfies a mandatory two-tier cumulative statutory test: Tier 1: The Main Purpose Test: the main purpose, or one of the main purposes, of the arrangement is to obtain a 'tax benefit'; AND Tier 2: The Tainted Element Test: the arrangement exhibits at least one of four statutorily tainted characteristics codified in clauses (a) through (d) of Section 96(1).",
                    "Under Section 102(10), a 'tax benefit' is defined expansively to include: (a) a reduction, avoidance, or deferral of tax or other amounts payable under the Act; (b) an increase in a refund of tax or other amounts under the Act; (c) a reduction, avoidance, or deferral of tax resulting from tax treaty relief; (d) an increase in a refund of tax resulting from tax treaty relief; or (e) any tax consequence which results in an increase in loss, deduction, allowance, or relief. Crucially, the statutory phrase 'one of the main purposes' represents an aggressive legislative standard; the Revenue does not have to prove that obtaining a tax benefit was the sole or primary purpose of the structure, but merely that tax mitigation was one of the principal commercial drivers.",
                    "To prevent arbitrary executive harassment and protect routine commercial transactions, Parliament and the Central Board of Direct Taxes enacted explicit statutory safe harbours under Rule 10U of the Income-tax Rules, 1962. Under Rule 10U(1)(a), Chapter X-A shall not apply to any arrangement where the aggregate tax benefit in the relevant assessment year arising to all parties to the arrangement does not exceed INR 3 Crores (three crore rupees). This monetary safe harbour insulates small and mid-sized enterprises, restricting GAAR investigations to high-value corporate restructurings, multi-tiered private equity investments, and cross-border holding company transfers.",
                    "Furthermore, under Rule 10U(1)(d), GAAR cannot be invoked to question the tax consequences of an arrangement that has been sanctioned by the High Court or the National Company Law Tribunal (NCLT) in a formal scheme of corporate amalgamation or demerger under the Companies Act, provided the tax department was served notice and failed to raise objections, or where the court specifically examined the commercial substance of the transaction."
                ],
                "check": {
                    "question": "What is the statutory monetary safe harbour threshold under Rule 10U(1)(a) below which Chapter X-A (GAAR) cannot be invoked?",
                    "options": [
                        "Where the aggregate tax benefit arising from the arrangement does not exceed three crore rupees in the relevant assessment year.",
                        "Where the corporate turnover of the taxpayer is less than one hundred crore rupees.",
                        "Where the foreign direct investment inflow is below ten million US dollars.",
                        "Where the company maintains fewer than fifty full-time employees."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "Rule 10U(1)(a) explicitly provides that GAAR provisions under Chapter X-A shall not apply to an arrangement where the aggregate tax benefit arising to all parties in the relevant year does not exceed INR 3 Crores."
                }
            },
            {
                "title": "The Four Tainted Element Tests & Lack of Commercial Substance under Section 96 and 97",
                "say": [
                    "Once the Revenue establishes that one of the main purposes of an arrangement is obtaining a tax benefit, it must satisfy the second cumulative statutory prong under Section 96(1): proving that the arrangement embodies at least one of the four 'Tainted Elements'. These tainted elements represent the statutory codification of economic substance doctrines: (1) Clause (a) - Non-Arm's Length Rights and Obligations: the arrangement creates rights, or obligations, which would not normally be created between persons dealing at arm's length; (2) Clause (b) - Abuse or Misuse of the Act: the arrangement results, directly or indirectly, in the misuse, or abuse, of the provisions of the Income-tax Act; (3) Clause (c) - Lack of Commercial Substance: the arrangement lacks commercial substance or is deemed to lack commercial substance under Section 97, in whole or in part; or (4) Clause (d) - Non-Bona Fide Manner: the arrangement is entered into, or carried out, by means, or in a manner, which are not ordinarily employed for bona fide purposes.",
                    "Among these four tainted gateways, Section 97's 'Lack of Commercial Substance' constitutes the operational engine of Indian GAAR. Under Section 97(1), an arrangement is deemed to lack commercial substance if: (a) the substance or effect of the arrangement as a whole is inconsistent with, or differs significantly from, the form of its individual steps or a whole; or (b) it involves round-trip financing, an accommodating party, elements that have the effect of offsetting or cancelling each other, or transactions conducted through one or more persons disguised in form; or (c) it involves the location of an asset or of a transaction or of the place of residence of any party which is without significant commercial purpose other than obtaining a tax benefit; or (d) it does not have a significant effect upon the business risks or net cash flows of any party to the arrangement, apart from any effect attributable to the tax benefit.",
                    "Section 97(2) provides a rigorous statutory definition of 'Round-Trip Financing'. Round-trip financing includes any arrangement in which series of transactions involve the transfer of funds among parties where: (i) transactions do not have any substantial commercial purpose other than obtaining a tax benefit; and (ii) transactions do not take into account the means by which funds are provided, or the source or location of funds, or the relation between parties. For example, if an Indian operating entity routes funds through a conduit company in a low-tax treaty jurisdiction to reinvest those exact funds back into India as tax-exempt external commercial borrowings or hybrid debt instruments, the transaction constitutes round-trip financing and lacks commercial substance by legislative fiat.",
                    "Similarly, Section 97(3) defines an 'Accommodating Party'. A party to an arrangement is an accommodating party if the main purpose of the direct or indirect participation of that party in the arrangement is to obtain, directly or indirectly, a tax benefit for any person, whether or not that party is a related party. In corporate tax structuring, shell companies established in zero-tax jurisdictions that possess no physical office, zero local employees, no independent board governance, and negligible commercial risks are classic accommodating parties designed purely to intercept cross-border cash flows.",
                    "Crucially, Section 97(4) establishes statutory factors that are legally irrelevant when determining whether an arrangement lacks commercial substance. The statute declares that the following factors shall not be taken into account: (a) the period or time for which the arrangement exists (a structure cannot claim commercial substance merely because it has existed for five years); (b) the fact of payment of taxes, directly or indirectly under the arrangement; and (c) the fact that an exit route is provided by the arrangement.",
                    "In judicial interpretation, the Authority for Advance Rulings (AAR) and High Courts—most notably in Tiger Global International II Holdings and Blackstone FP Capital Partners—have held that where foreign entities operate merely as 'paper companies' with funds flowing out immediately upon receipt, the corporate veil is pierced under Section 97, stripping treaty residency certificates (TRCs) of their protective shield and exposing the true beneficial owners to direct taxation in India."
                ],
                "check": {
                    "question": "Which of the following is deemed to lack commercial substance under Section 97(1)(b) of the Income-tax Act?",
                    "options": [
                        "An arrangement involving round-trip financing, accommodating parties, or offsetting elements with no commercial purpose.",
                        "A company manufacturing automobile parts in an industrial park with local labor.",
                        "An enterprise raising working capital loans from a commercial scheduled bank at market interest rates.",
                        "A public company paying dividend distributions approved by its annual general meeting."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "Section 97(1)(b) explicitly provides that an arrangement is deemed to lack commercial substance if it involves round-trip financing, an accommodating party, or elements that offset or cancel each other."
                }
            },
            {
                "title": "Consequences of GAAR under Section 98 & The Interplay between GAAR, SAAR and DTAAs",
                "say": [
                    "When an arrangement is officially declared to be an Impermissible Avoidance Arrangement under Section 96, the taxing authority is vested with extraordinary, surgical powers codified in Section 98: 'Consequences of Impermissible Avoidance Arrangement'. Section 98 empowers the Assessing Officer to look through the corporate form, disregard legal steps, and recharacterize the entire transaction according to its true economic substance, in order to deny any tax benefit claimed by the assessee.",
                    "Under Section 98(1), the statutory consequences that the Assessing Officer may determine include: (a) disregarding, looking through, or combining any step in, or a part of, the impermissible avoidance arrangement; (b) treating the impermissible avoidance arrangement as if it had not been entered into or carried out; (c) disregarding any accommodating party or treating any accommodating party and any other party as one and the same person; (d) deeming persons who are connected persons in relation to each other to be one and the same person; (e) reallocating any accrual, receipt, expenditure, deduction, relief, or rebate between the parties to the arrangement; (f) treating any place of residence of any party or the situs of an asset or the place of transaction at another place; or (g) recharacterizing any equity into debt or debt into equity, or recharacterizing any income, expense, or deduction.",
                    "To appreciate the magnitude of Section 98 powers, consider an international restructuring where an Indian corporate group injects capital into an offshore subsidiary as 'quasi-equity convertible preference shares', which are then treated as debt in the foreign jurisdiction to generate tax-deductible interest payments while claiming tax-exempt capital repatriation in India. Under Section 98(1)(g), the Assessing Officer can recharacterize the hybrid instrument purely as equity or taxable dividend income, disallow all intercompany interest deductions, and reallocate the tax liabilities retrospectively.",
                    "A critical doctrinal battleground in corporate taxation is the relationship between GAAR, Specific Anti-Avoidance Rules (SAAR), and Double Tax Avoidance Agreements (DTAAs). In direct tax legislation, SAAR refers to targeted statutory provisions designed to combat specific avoidance schemes: for example, Section 92 to 92F (Transfer Pricing), Section 94B (Thin Capitalization limitation on interest deductions), Section 94(7) (Dividend Stripping), Section 56(2)(x) (Deemed gifts and undervaluation of property), and Section 50CA (Fair market value of unquoted shares).",
                    "For years, taxpayers argued under the legal maxim *generalia specialibus non derogant* (general provisions do not override specific provisions) that where a specific anti-avoidance provision exists, the general rules of GAAR cannot be invoked. However, the CBDT issued Circular No. 7/2017 (dated January 27, 2017), definitively clarifying that GAAR and SAAR operate concurrently. The Revenue has the statutory discretion to invoke GAAR even if a transaction falls within the purview of a SAAR, or vice versa, provided the conditions of Chapter X-A are satisfied. GAAR serves as a backstop where clever tax engineering bypasses the mechanical parameters of a SAAR.",
                    "Furthermore, the interplay between GAAR and international tax treaties was fundamentally reshaped by the Multilateral Convention to Implement Tax Treaty Related Measures to Prevent Base Erosion and Profit Shifting (MLI). Article 7 of the MLI introduced the Principal Purpose Test (PPT) into India's bilateral tax treaties. While the PPT operates within the treaty text, Section 90(2A) ensures that domestic GAAR overrides the treaty. If an arrangement satisfies the domestic main purpose and tainted element tests under Section 96, treaty relief is automatically denied under domestic law, rendering double tax treaties subordinate to Chapter X-A.",
                    "In landmark jurisprudence including the Authority for Advance Rulings decisions in Tiger Global and Bidco, courts examined whether the existence of a Tax Residency Certificate (TRC) issued under Section 90(4) insulates a foreign investor from GAAR scrutiny. The judiciary affirmed that while a TRC serves as conclusive evidence of residence for treaty eligibility under the circulars following Azadi Bachao Andolan, it does not bar the Revenue from piercing the corporate veil under GAAR if the entity is an accommodating conduit devoid of economic substance. GAAR therefore operates as a paramount statutory anti-abuse doctrine, overriding both bilateral tax treaties and conventional residency certificates whenever aggressive tax avoidance is established."
                ],
                "check": {
                    "question": "Under Section 98(1) of the Income-tax Act, what statutory power is granted to the Assessing Officer upon declaring an arrangement to be an impermissible avoidance arrangement?",
                    "options": [
                        "The power to disregard accommodating parties, recharacterize debt as equity, look through steps, and reallocate income according to economic substance.",
                        "The power to seize corporate assets without judicial notice and dissolve the company immediately.",
                        "The power to transfer the corporate case to the International Monetary Fund for international arbitration.",
                        "The authority to double the company's gross sales turnover on its commercial invoices."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "Section 98(1) provides extensive remedial powers to look through steps, disregard accommodating parties, recharacterize debt as equity or income, and determine tax consequences based on true economic substance."
                }
            },
            {
                "title": "Procedural Safeguards & The Statutory Approving Panel Architecture under Section 144BA",
                "say": [
                    "Recognizing that the expansive, discretionary powers of GAAR could easily degenerate into administrative overreach, coercive tax terrorism, and unpredictable business disruption, Parliament established an extraordinary, multi-tiered procedural filter codified in Section 144BA of the Act: 'Reference to Principal Commissioner or Commissioner in certain cases'. Unlike regular scrutiny additions or transfer pricing adjustments, an Assessing Officer possesses zero statutory authority to declare an arrangement to be an impermissible avoidance arrangement on their own accord. GAAR can only be invoked following rigorous institutional scrutiny and approval by a high-powered, independent statutory body known as the Approving Panel.",
                    "The statutory workflow under Section 144BA proceeds through four structured stages: Stage 1: The Initial Reference by the Assessing Officer: Under Section 144BA(1), if the Assessing Officer, at any stage of the assessment or reassessment proceedings, having regard to the material and evidence available, considers that it is necessary to declare an arrangement as an impermissible avoidance arrangement and to determine consequences under Section 98, they shall make a reference to the Principal Commissioner or Commissioner (PCIT/CIT).",
                    "Stage 2: The Section 144BA(2) Show Cause Notice: If the PCIT/CIT, on receipt of the reference, is of the opinion that the provisions of Chapter X-A are required to be invoked, they shall issue a statutory notice in Form No. 3CEG to the assessee, setting forth the reasons and grounds upon which the arrangement is proposed to be declared an IAA, and granting the assessee a period not exceeding sixty days to file objections. Stage 3: The PCIT's Determination: If the assessee does not object, or accepts the notice, the PCIT issues directions under Section 144BA(3). However, if the assessee files objections contesting the invocation of GAAR—arguing that the tax benefit is below INR 3 Crores, that the structure possesses bona fide commercial substance, or that the main purpose was not tax mitigation—and the PCIT remains unsatisfied with the assessee's explanations, the PCIT cannot decide the matter. Section 144BA(4) mandates that the PCIT shall refer the matter to the Approving Panel.",
                    "Stage 4: The Approving Panel Adjudication: The Approving Panel is constituted under Section 144BA(16) by the Central Government. The Panel is a three-member collegium designed to guarantee absolute judicial independence: (a) A Chairperson who is or has been a Judge of a High Court; (b) One member who is a member of the Indian Revenue Service (Income-tax) not below the rank of Principal Chief Commissioner or Chief Commissioner; and (c) One member who is an academic or scholar having special knowledge of matters relating to direct taxes and business accounts.",
                    "Under Section 144BA(6), the Approving Panel shall, on receipt of the reference, call for records, issue notices, and provide the assessee as well as the Assessing Officer an opportunity of being heard. Under Section 144BA(12), the Approving Panel shall issue such directions as it deems fit in respect of the declaration of the arrangement as an IAA, including specifying the assessment years to which directions apply. Crucially, under Section 144BA(13), directions issued by the Approving Panel shall be binding on the assessee and the income-tax authorities, and no appeal shall lie under the Income-tax Act against any direction issued by the Approving Panel.",
                    "Under Section 144BA(14), the Assessing Officer shall, on receipt of directions from the Approving Panel, proceed to complete the assessment proceedings in conformity with the directions. Under Section 144BA(11), the Approving Panel is statutorily mandated to issue directions within six months from the end of the month in which the reference was received, ensuring that corporate restructurings are not kept in perpetual legal limbo. This collegiate framework ensures that GAAR is applied solely to abusive tax engineering."
                ],
                "check": {
                    "question": "What is the statutory composition of the Approving Panel constituted under Section 144BA(16) to adjudicate GAAR references?",
                    "options": [
                        "A three-member panel chaired by a retired High Court Judge, with a Chief Commissioner of Income Tax and an independent tax/accounting academic.",
                        "Three Assessing Officers selected by the local jurisdictional tax commissioner.",
                        "The Finance Minister of India, the Revenue Secretary, and the Governor of the Reserve Bank of India.",
                        "A bench consisting of two chartered accountants and one corporate trade union representative."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "Section 144BA(16) mandates that the Approving Panel consists of a Chairperson who is or has been a High Court Judge, one IRS officer of Chief Commissioner rank, and one direct tax/business accounts scholar."
                }
            },
            {
                "title": "Production Python Architecture: Enterprise GAAR Risk Assessment & Approving Panel Simulator",
                "say": [
                    "In enterprise direct tax practice, multinational corporate groups and private equity funds must subject every cross-border corporate restructuring, overseas direct investment (ODI), and financing transaction to algorithmic GAAR stress testing. In this module, we develop a production-ready computational Python architecture, GAARRiskAssessmentEngine, that operationalizes Chapter X-A statutory rules, Rule 10U safe harbours, tainted element validations, and Section 144BA Approving Panel workflows.",
                    "The computational engine encapsulates five core direct tax modules: First, the Rule 10U Safe Harbour Validator: calculating the aggregate tax benefit across all transaction participants and verifying whether the exposure is insulated below the INR 3 Crore statutory threshold. Second, the Main Purpose Analyzer: auditing commercial contemporaneous documentation, evaluating non-tax business justifications versus tax savings, and determining if tax mitigation represents 'one of the main purposes'. Third, the Tainted Element Matrix: evaluating the four Section 96(1) tainted characteristics (non-arm's length rights, abuse of law, lack of commercial substance under Section 97, and non-bona fide manner), flagging round-trip financing and accommodating shell entities. Fourth, the Section 98 Recharacterization Engine: modeling tax consequence adjustments, debt-to-equity conversions, step-disregards, and treaty benefit denials. Fifth, the Section 144BA Approving Panel Workflow: managing Form 3CEG limitation windows, 60-day response clocks, and the 6-month statutory adjudication deadline.",
                    "Let us inspect the complete, executable Python architecture implementing these GAAR mechanics:",
                    "```python",
                    "import calendar",
                    "import datetime",
                    "from dataclasses import dataclass, field",
                    "from enum import Enum",
                    "from typing import Dict, List, Optional",
                    "",
                    "class TaintedElement(Enum):",
                    "    NON_ARMS_LENGTH_RIGHTS = 'SECTION_96_1_A_NON_ARMS_LENGTH_RIGHTS_OBLIGATIONS'",
                    "    ABUSE_OF_PROVISIONS = 'SECTION_96_1_B_ABUSE_OR_MISUSE_OF_ACT'",
                    "    LACK_OF_COMMERCIAL_SUBSTANCE = 'SECTION_96_1_C_LACK_OF_COMMERCIAL_SUBSTANCE'",
                    "    NON_BONA_FIDE_MANNER = 'SECTION_96_1_D_NON_BONA_FIDE_MANNER'",
                    "",
                    "@dataclass",
                    "class CorporateStep:",
                    "    step_number: int",
                    "    description: str",
                    "    entity_involved: str",
                    "    jurisdiction: str",
                    "    is_accommodating_party: bool = False",
                    "    is_round_trip_financing: bool = False",
                    "",
                    "class GAARRiskAssessmentEngine:",
                    "    SAFE_HARBOUR_THRESHOLD_INR = 30000000.0  # INR 3 Crores under Rule 10U(1)(a)",
                    "",
                    "    def __init__(self, corporate_structure_name: str, assessment_year: str, aggregate_tax_benefit_inr: float):",
                    "        self.name = corporate_structure_name",
                    "        self.ay = assessment_year",
                    "        self.tax_benefit_inr = aggregate_tax_benefit_inr",
                    "        self.steps: List[CorporateStep] = []",
                    "        self.tainted_elements_detected: List[TaintedElement] = []",
                    "        self.is_main_purpose_tax_benefit: bool = False",
                    "",
                    "    def add_transaction_step(self, step: CorporateStep):",
                    "        self.steps.append(step)",
                    "",
                    "    def evaluate_safe_harbour_rule10u(self) -> Dict[str, any]:",
                    "        is_safe = self.tax_benefit_inr <= self.SAFE_HARBOUR_THRESHOLD_INR",
                    "        return {",
                    "            'aggregate_tax_benefit_inr': self.tax_benefit_inr,",
                    "            'statutory_threshold_inr': self.SAFE_HARBOUR_THRESHOLD_INR,",
                    "            'is_protected_by_safe_harbour': is_safe,",
                    "            'status': 'EXEMPT_FROM_GAAR_UNDER_RULE_10U_1_A' if is_safe else 'SUBJECT_TO_CHAPTER_X_A_SCRUTINY'",
                    "        }",
                    "",
                    "    def evaluate_tainted_elements(",
                    "        self,",
                    "        is_main_purpose_tax: bool,",
                    "        has_non_arms_length_terms: bool,",
                    "        has_abuse_of_act: bool,",
                    "        has_non_bona_fide_manner: bool",
                    "    ) -> Dict[str, any]:",
                    "        self.is_main_purpose_tax_benefit = is_main_purpose_tax",
                    "        self.tainted_elements_detected.clear()",
                    "",
                    "        # Section 97 Lack of Commercial Substance Audit",
                    "        has_shell_conduit = any(s.is_accommodating_party for s in self.steps)",
                    "        has_round_trip = any(s.is_round_trip_financing for s in self.steps)",
                    "        lacks_commercial_substance = has_shell_conduit or has_round_trip",
                    "",
                    "        if has_non_arms_length_terms:",
                    "            self.tainted_elements_detected.append(TaintedElement.NON_ARMS_LENGTH_RIGHTS)",
                    "        if has_abuse_of_act:",
                    "            self.tainted_elements_detected.append(TaintedElement.ABUSE_OF_PROVISIONS)",
                    "        if lacks_commercial_substance:",
                    "            self.tainted_elements_detected.append(TaintedElement.LACK_OF_COMMERCIAL_SUBSTANCE)",
                    "        if has_non_bona_fide_manner:",
                    "            self.tainted_elements_detected.append(TaintedElement.NON_BONA_FIDE_MANNER)",
                    "",
                    "        is_iaa = self.is_main_purpose_tax_benefit and (len(self.tainted_elements_detected) > 0)",
                    "        return {",
                    "            'is_main_purpose_tax_benefit': self.is_main_purpose_tax_benefit,",
                    "            'tainted_elements_count': len(self.tainted_elements_detected),",
                    "            'tainted_elements': [e.value for e in self.tainted_elements_detected],",
                    "            'lacks_commercial_substance_sec97': lacks_commercial_substance,",
                    "            'is_impermissible_avoidance_arrangement_sec96': is_iaa,",
                    "            'verdict': 'IMPERMISSIBLE_AVOIDANCE_ARRANGEMENT' if is_iaa else 'LEGITIMATE_COMMERCIAL_ARRANGEMENT'",
                    "        }",
                    "",
                    "    def compute_section_98_consequences(self, treaty_relief_claimed_inr: float, disallowable_deductions_inr: float) -> Dict[str, any]:",
                    "        tax_effect_treaty_denial = treaty_relief_claimed_inr * 0.20  # Domestic rate on capital gains / royalties",
                    "        tax_effect_deduction_denial = disallowable_deductions_inr * 0.25168  # 25% + surcharge + cess",
                    "        total_adjusted_tax_liability = tax_effect_treaty_denial + tax_effect_deduction_denial",
                    "        return {",
                    "            'treaty_override_section_90_2a': 'TREATY_BENEFITS_DENIED_UNDER_GAAR',",
                    "            'treaty_relief_tax_effect_inr': tax_effect_treaty_denial,",
                    "            'deduction_disallowance_tax_effect_inr': tax_effect_deduction_denial,",
                    "            'total_recharacterized_tax_inr': total_adjusted_tax_liability,",
                    "            'recharacterization_powers_invoked': [",
                    "                'Disregard of conduit accommodating entities under Section 98(1)(c)',",
                    "                'Recharacterization of hybrid equity instruments under Section 98(1)(g)',",
                    "                'Reallocation of treaty capital gains to Indian tax jurisdiction under Section 98(1)(f)'",
                    "            ]",
                    "        }",
                    "",
                    "    def audit_approving_panel_timeline(self, reference_received_date: datetime.date, panel_direction_date: datetime.date) -> Dict[str, any]:",
                    "        ref_year = reference_received_date.year",
                    "        ref_month = reference_received_date.month",
                    "        last_day_ref_month = calendar.monthrange(ref_year, ref_month)[1]",
                    "        end_of_ref_month = datetime.date(ref_year, ref_month, last_day_ref_month)",
                    "",
                    "        target_month = ref_month + 6",
                    "        target_year = ref_year + (target_month - 1) // 12",
                    "        final_month = ((target_month - 1) % 12) + 1",
                    "        last_day_target = calendar.monthrange(target_year, final_month)[1]",
                    "        panel_statutory_deadline = datetime.date(target_year, final_month, last_day_target)",
                    "",
                    "        is_timely = panel_direction_date <= panel_statutory_deadline",
                    "        return {",
                    "            'reference_date': reference_received_date.isoformat(),",
                    "            'approving_panel_deadline_sec144ba_11': panel_statutory_deadline.isoformat(),",
                    "            'panel_direction_date': panel_direction_date.isoformat(),",
                    "            'is_panel_direction_timely': is_timely,",
                    "            'statutory_status': 'BINDING_ON_REVENUE_AND_ASSESSEE_UNDER_SECTION_144BA_13'",
                    "        }",
                    "```",
                    "In multinational enterprise treasury and corporate tax operations, deploying this computational engine guarantees that cross-border holding structures, overseas direct investments, and corporate reorganizations are vetted against GAAR tainted element thresholds with mathematical rigor. By pre-emptively auditing commercial substance, identifying conduit risks under Section 97, and enforcing the Rule 10U monetary safe harbour, corporate tax leaders defend enterprise capital against arbitrary recharacterization and guarantee compliance with direct tax jurisprudence."
                ],
                "check": {
                    "question": "In GAARRiskAssessmentEngine, what statutory condition causes an arrangement to be declared an Impermissible Avoidance Arrangement (IAA) under Section 96?",
                    "options": [
                        "Obtaining a tax benefit is one of the main purposes AND at least one tainted element test is satisfied.",
                        "The company's statutory auditors issue a qualified audit report on internal financial controls.",
                        "The company fails to hold four quarterly meetings of its board of directors.",
                        "The corporate tax liability is less than the net accounting profit before depreciation."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "Under Section 96(1), an arrangement is an IAA if its main purpose (or one of its main purposes) is obtaining a tax benefit AND it satisfies at least one of the four tainted element tests."
                }
            }
        ]
    }
    return day56

if __name__ == '__main__':
    data = get_day56_data()
    print(f"Day 56 Title: {data['title']}")
    print(f"Parts count: {len(data['parts'])}")
    for i, p in enumerate(data['parts']):
        words = len(" ".join(p['say']).split())
        print(f"Part {i+1}: {words} words")
