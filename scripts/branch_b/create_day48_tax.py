"""
create_day48_tax.py
Course: bcom_tax (Corporate Tax, GST & Direct Taxation)
Month 2 Block 10 Day 48: Search, Seizure & Survey Operations: Section 132 Search Powers, Section 133A Surveys, Presumptions & Undisclosed Foreign Income
"""

def get_day48_data():
    day48 = {
        "day": 48,
        "coursePrefix": "bcom_tax",
        "title": "Search, Seizure & Survey Operations: Section 132 Search Powers, Section 133A Surveys, Presumptions & Undisclosed Foreign Income",
        "description": "Master the direct tax enforcement statutory framework under the Income-tax Act, 1961, encompassing search warrants and seizure powers under Section 132, the statutory prohibition against seizing commercial stock-in-trade, evidentiary presumptions under Section 132(4A) and Section 292C, business surveys under Section 133A, the landmark Supreme Court evidentiary doctrine in Khader Khan, punitive taxation on unexplained cash credits under Section 115BBE, the Black Money (Undisclosed Foreign Income and Assets) and Imposition of Tax Act, 2015, and production-grade tax enforcement simulation algorithms.",
        "minutes": 38,
        "parts": [
            {
                "title": "Section 132 Search & Seizure Jurisprudence: Authorization Warrants & Stock-in-Trade Immunity",
                "say": [
                    "The most intrusive and coercive investigative power conferred upon the direct tax administration in India is codified in Section 132 of the Income-tax Act, 1961. A search and seizure operation—colloquially termed an income tax raid—represents an extraordinary invasion of citizen privacy and corporate sanctity, permissible under constitutional jurisprudence only when executed in strict adherence to statutory safeguards. The initiation of a search under Section 132(1) requires the issuance of a formal 'Warrant of Authorization' executed by a high-ranking authority, specifically the Principal Director General or Director General or Principal Director or Director or Principal Chief Commissioner or Chief Commissioner or Principal Commissioner or Commissioner.",
                    "The competent authority can issue a warrant of authorization only if, in consequence of information in their possession, they have 'reason to believe' that: (a) any person to whom a summons under Section 131(1) or notice under Section 142(1) was issued has failed to produce books of account or other documents; (b) any person to whom such summons or notice has been or might be issued will not or would not produce any books of account or other documents which will be useful for, or relevant to, any proceeding under the Act; or (c) any person is in possession of any money, bullion, jewellery, or other valuable article or thing, and such asset represents either wholly or partly income or property which has not been, or would not be, disclosed for the purposes of this Act (undisclosed income). The Explanation to Section 132(1) (inserted with retrospective effect by the Finance Act, 2017) explicitly declares that the 'reason to believe' or 'reason to suspect' recorded by the income-tax authority shall not be disclosed to any person or any authority or the Appellate Tribunal, thereby insulating the preliminary administrative satisfaction from pre-emptive writ disclosure.",
                    "The executing search officers are vested with sweeping operational powers under Section 132(1), including the authority to enter and search any building, place, vessel, vehicle, or aircraft; break open the lock of any door, box, locker, safe, or almirah; search any person who has got out of, or is in, or is about to get into, such place; place marks of identification on books of account or other documents; and seize any money, bullion, jewellery, or other valuable article or thing found as a result of the search.",
                    "Crucially, corporate tax controllers must master the vital statutory shield codified in the third proviso to Section 132(1): 'Provided also that nothing contained in this sub-section shall authorize the authorized officer to seize any stock-in-trade of the business, but they may make a note or an inventory of such stock-in-trade.' This explicit statutory prohibition prevents search teams from confiscating the raw materials, work-in-progress, or finished goods inventory of a commercial enterprise, which would otherwise paralyze factory operations and disrupt ongoing manufacturing. While search officers are fully empowered to take physical inventory, weigh raw materials, and record discrepancies between physical stock and ERP books, any physical seizure of commercial stock-in-trade is strictly unlawful and liable to be quashed.",
                    "Where it is not practicable to seize any money, bullion, jewellery, or valuable article due to volume, weight, or dangerous physical location, the authorized officer may execute a constructive seizure under the second proviso to Section 132(1) by serving an order on the owner or custodian that they shall not remove, part with, or otherwise deal with it except with prior permission. Alternatively, where seizure is not feasible for reasons other than physical impracticality, the officer may issue a restraint order under Section 132(3). Crucially, a Section 132(3) order cannot be utilized as a substitute for seizure; it is a temporary conservatory order that cannot remain in force for a period exceeding sixty days from the date of the order, as codified in Section 132(8A)."
                ],
                "check": {
                    "question": "Under the third proviso to Section 132(1) of the Income-tax Act, 1961, what category of commercial property is statutorily barred from physical seizure by search officers?",
                    "options": [
                        "Stock-in-trade of the business (commercial inventory of goods, raw materials, and finished products).",
                        "Secret bearer promissory notes and undisclosed bullion hoarded in vaults.",
                        "Personal passbooks of corporate directors showing overseas shell company wires.",
                        "Unaccounted cash discovered hidden inside factory machinery."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "The third proviso to Section 132(1) explicitly prohibits search officers from seizing commercial stock-in-trade of the business, restricting their statutory power to taking notes or preparing an inventory of such stock."
                }
            },
            {
                "title": "Section 133A Surveys vs Section 132 Searches & The Khader Khan Evidentiary Doctrine",
                "say": [
                    "While a Section 132 search represents the zenith of criminal-style direct tax enforcement, Section 133A confers a distinct, administrative investigative power termed a 'Survey'. Understanding the jurisdictional and procedural boundaries separating a search from a survey is fundamental to corporate tax risk management. An income tax survey under Section 133A is an investigative inspection restricted exclusively to the business premises of an assessee, designed to verify current financial transactions, inspect books of account, and verify cash and inventory balances.",
                    "Under Section 133A(1), an income-tax authority may enter any place within the limits of the area assigned to them, or any place occupied by any person in respect of whom they exercise jurisdiction, at which a business or profession is carried on. A critical statutory limitation governs the timing of entry: under Section 133A(1), an officer may enter a business premises only during the hours at which such place is open for the conduct of business, or, in the case of any other place, only after sunrise and before sunset. Unlike search teams under Section 132 who can enter residential premises at any hour of the day or night and break open locks, survey officers cannot enter residential premises unless business books or assets are specifically stated to be kept there, and they possess no statutory power to break open locks or forcibly search personal residences.",
                    "Furthermore, the seizure powers under a survey are severely restricted. Under Section 133A(3)(ia), a survey officer may impound and retain in their custody books of account or other documents inspected by them, provided that they record reasons for doing so. Crucially, under the proviso to Section 133A(3), the officer shall not retain in their custody any books of account or documents for a period exceeding fifteen days (exclusive of holidays) without obtaining the prior approval of the Principal Chief Commissioner or Chief Commissioner or Principal Director General or Director General or Principal Commissioner or Commissioner. Most significantly, survey officers possess absolutely no statutory power to seize any cash, stock, bullion, or other valuable assets found during the survey.",
                    "The most litigated dimension of survey operations concerns the recording of statements. During a Section 132 search, Section 132(4) authorizes the officer to examine any person 'on oath', and explicitly provides that the statement so recorded may thereafter be used in evidence in any proceeding under the Act. In stark contrast, Section 133A(3)(iii) merely authorizes the survey officer to record the statement of any person which may be useful for, or relevant to, any proceeding under this Act. The statute conspicuously omits the words 'on oath' from Section 133A(3)(iii).",
                    "This statutory distinction culminated in the seminal Supreme Court judgment in Commissioner of Income-tax v. S. Khader Khan Son (2013) 352 ITR 480 (SC). The Supreme Court affirmed the Madras High Court's landmark ruling, holding that an admission or confession made in a statement recorded under Section 133A has no evidentiary value in the eyes of law to sustain an addition. The Court established that: (1) Section 133A does not empower any income-tax authority to administer an oath; (2) statements recorded under Section 133A are not substantive evidence and cannot by themselves form the sole foundation for making additions to taxable income; and (3) an addition can be sustained only if the Department uncovers independent, corroborative documentary evidence during the survey. If an assessee subsequently retracts an admission made under coercion during a marathon survey, the retracted confession cannot support a tax demand unless the Assessing Officer proves the undisclosed income through objective corroborating material.",
                    "This judicial doctrine is reinforced by binding administrative instructions issued by the Central Board of Direct Taxes. In CBDT Instruction F. No. 286/2/2003-IT(Inv.) dated March 10, 2003, the Board issued a categorical directive to all investigating officials, explicitly barring them from obtaining confessions or admissions of undisclosed income during search, seizure, or survey operations. The Board observed with grave concern that search and survey parties frequently coerced assessees into signing confessions under duress, subsequently neglecting the collection of tangible documentary evidence, only for such additions to be summarily deleted in appellate proceedings. The CBDT reiterated that assessing officers must focus their efforts exclusively on gathering credible, corroborative material rather than extracting involuntary surrender statements. Where an assessee retracts a statement accompanied by an affidavit demonstrating absence of corroborative evidence, appellate authorities are statutorily bound to evaluate the assessment on the objective merits of the seized records."
                ],
                "check": {
                    "question": "What legal principle was established by the Supreme Court in CIT v. S. Khader Khan Son (2013) regarding statements recorded during a Section 133A survey?",
                    "options": [
                        "Statements under Section 133A are not on oath and cannot form the sole evidentiary basis for additions without corroboration.",
                        "Statements under Section 133A are unchallengeable confessions resulting in automatic summary conviction.",
                        "Statements must be recorded before a Judicial Magistrate within twenty-four hours to be valid.",
                        "Survey statements carry higher evidentiary weight than audited annual financial statements."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "In Khader Khan Son, the Supreme Court ruled that Section 133A does not authorize the administration of an oath, and confessions recorded during surveys have no independent evidentiary value to justify additions without corroborative documentary proof."
                }
            },
            {
                "title": "Evidentiary Presumptions under Section 132(4A) & Section 292C & Unexplained Cash Credits",
                "say": [
                    "In direct tax litigation arising from search and seizure operations, the statutory burden of proof is substantially altered by statutory presumptions enacted in Sections 132(4A) and 292C of the Income-tax Act, 1961. Under Section 132(4A) and Section 292C, where any books of account, other documents, money, bullion, jewellery, or other valuable article or thing are found in the possession or control of any person in the course of a search under Section 132 or a survey under Section 133A, three powerful legal presumptions arise against the assessee.",
                    "First, it shall be presumed that such books of account, documents, and valuable assets belong to such person. Second, it shall be presumed that the contents of such books of account and other documents are true. Third, it shall be presumed that the signature and every other part of such books of account and other documents which purport to be in the handwriting of any particular person, or which may reasonably be assumed to have been in the handwriting of any particular person, are in that person's handwriting, and in the case of a document stamped, executed, or attested, that it was duly stamped and executed or attested by the person by whom it purports to have been so executed or attested. While these presumptions are rebuttable, the burden of rebutting them rests entirely upon the assessee through cogent, affirmative evidence.",
                    "When search or survey teams discover unexplained financial transactions, the Assessing Officer invokes the formidable statutory regime of 'Unexplained Incomes' codified in Sections 68 through 69D. Under Section 68, where any sum is found credited in the books of an assessee maintained for any previous year, and the assessee offers no explanation about the nature and source thereof, or the explanation offered is not, in the opinion of the Assessing Officer, satisfactory, the sum so credited may be charged to income-tax as the income of the assessee of that previous year.",
                    "The legal burden under Section 68 requires the assessee to prove three cumulative ingredients: (1) the identity of the creditor; (2) the creditworthiness of the creditor; and (3) the genuineness of the transaction. For closely held corporate enterprises, the first proviso to Section 68 (inserted by the Finance Act, 2012) and the second proviso (amended by the Finance Act, 2022) impose a rigorous 'source of source' requirement: where the credited sum consists of share application money, share capital, share premium, or any loan or borrowing, the explanation offered by the assessee shall not be deemed to be satisfactory unless the resident creditor also explains the nature and source of such sum credited in their hands.",
                    "Parallel statutory provisions govern non-book discoveries: Section 69 governs unexplained investments not recorded in books; Section 69A governs unexplained money, bullion, jewellery, or other valuable articles; Section 69B governs investments where the actual expenditure exceeds the amount recorded in books; Section 69C governs unexplained business expenditure; and Section 69D governs amounts borrowed or repaid on hundi. Whenever an addition is made under any of these sections, it triggers the catastrophic computational consequences of Section 115BBE.",
                    "In forensic practice, practitioners must also navigate administrative safe harbours such as CBDT Instruction No. 1916 of 1994 regarding jewellery discovered during Section 132 searches. Under Instruction No. 1916, search parties are directed not to seize gold jewellery and ornaments up to 500 grams for each married woman, 250 grams for each unmarried woman, and 100 grams for each male member of the household. Although this instruction strictly governs non-seizure rather than direct tax assessment, judicial precedents across High Courts establish that jewellery within these administrative thresholds creates a strong presumption of customary acquisition through stridhan and gifts, rebutting Section 69A additions unless the department disproves family customary status with concrete documentary evidence. Moreover, in corporate bank account scrutinies involving high-velocity deposits and withdrawals, forensic defense relies upon the Peak Credit Theory, ensuring that additions are confined strictly to the maximum net cash deficit at any single point in time rather than aggregating gross cumulative turnover."
                ],
                "check": {
                    "question": "What three cumulative legal ingredients must an assessee substantiate under Section 68 to prevent a cash credit from being treated as unexplained income?",
                    "options": [
                        "Identity of the creditor, creditworthiness of the creditor, and genuineness of the transaction.",
                        "Physical presence of the creditor, payment of cash, and execution of a handwritten receipt.",
                        "Approval from the local municipal council, banking solvency certificate, and police clearance.",
                        "Filing of a trademark application, submission of GST return, and corporate seal attestation."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "Established jurisprudence under Section 68 requires the assessee to establish three cumulative tests: the identity of the creditor, the creditworthiness of the creditor, and the genuineness of the transaction."
                }
            },
            {
                "title": "Punitive Taxation under Section 115BBE & Black Money Act, 2015 Architecture",
                "say": [
                    "Prior to the enactment of the Taxation Laws (Second Amendment) Act, 2016, income assessed under Sections 68, 69, 69A, 69B, 69C, or 69D was taxed at standard applicable corporate or slab rates, permitting assessees to set off business losses against such additions. To eliminate the commercial incentive for tax evasion and demonetization-era laundering, Parliament amended Section 115BBE, converting it into one of the most punitive tax regimes in the democratic world.",
                    "Under Section 115BBE(1), where the total income of an assessee includes any income referred to in Sections 68, 69, 69A, 69B, 69C, or 69D, the income-tax payable shall be computed at the flat statutory base rate of sixty percent (60%). In addition to the 60% base tax, Section 2(9) of the relevant Finance Act imposes a mandatory surcharge of twenty-five percent (25%) of the tax amount (representing an additional 15% of the income). Furthermore, the Health and Education Cess of four percent (4%) is levied on the aggregate of tax and surcharge. Thus, the effective rate of taxation under Section 115BBE is calculated as: 60% base tax + (60% * 25% = 15% surcharge) = 75% tax and surcharge; 75% + (75% * 4% cess = 3.0%) = 78.00% effective tax rate.",
                    "To compound the financial severity, Section 115BBE(2) establishes an absolute statutory prohibition: 'Notwithstanding anything contained in this Act, no deduction in respect of any expenditure or allowance or set off of any loss shall be allowed to the assessee under any provision of this Act in computing their income referred to in clause (a) of sub-section (1).' An enterprise cannot set off current-year business losses, unabsorbed depreciation, or brought-forward capital losses against Section 115BBE additions. Furthermore, under Section 271AAC, the Assessing Officer shall direct the assessee to pay a penalty equal to ten percent (10%) of the tax payable under Section 115BBE, bringing the total financial confiscation to 84.0% of the unexplained sum.",
                    "Where undisclosed assets are situated outside India, the domestic Income-tax Act is superseded by the draconian architecture of the Black Money (Undisclosed Foreign Income and Assets) and Imposition of Tax Act, 2015. Enacted to combat cross-border tax evasion and secret offshore bank accounts, the Black Money Act operates on zero-tolerance principles. Under Section 3 of the Black Money Act, undisclosed foreign income and assets are subjected to tax at a flat rate of thirty percent (30%). Crucially, under Section 41, a mandatory penalty equal to three times the tax computed under Section 3 is levied—imposing an immediate ninety percent (90%) penalty, resulting in a combined tax and penalty burden of 120% of the asset's fair market value.",
                    "Most critically, Section 10 of the Black Money Act completely eliminates any period of limitation for assessing undisclosed foreign assets: an undisclosed foreign asset is assessed in the previous year in which it comes to the notice of the Assessing Officer, valued at its fair market value on the first day of that financial year, regardless of when the asset was originally acquired. Furthermore, Chapter V of the Black Money Act prescribes rigorous imprisonment for a term ranging between three and ten years, alongside disqualification under anti-money laundering and corporate governance regulations.",
                    "In contrast to the Black Money Act, search assessments under domestic law are governed by Section 271AAB for undisclosed income unearthed during searches initiated under Section 132. Under Section 271AAB(1A), a graduated penalty is levied: thirty percent (30%) of the undisclosed income if the assessee admits the undisclosed income in the statement recorded under Section 132(4), explains the manner in which it was derived, substantiates the manner, and pays the tax along with interest on or before the specified date; or sixty percent (60%) of the undisclosed income in all other cases. When compounded with interest under Sections 234A, 234B, and 234C, the financial burden of a search addition frequently exceeds 100% of the disputed sum, compelling enterprises to seek compounding of offenses under Section 279(2) or invoke Settlement Commission successor mechanisms before the Interim Board for Settlement."
                ],
                "check": {
                    "question": "What is the exact effective rate of direct tax levied on unexplained cash credits and investments under Section 115BBE (including surcharge and cess)?",
                    "options": [
                        "Seventy-eight percent (60% base tax + 25% surcharge + 4% cess).",
                        "Thirty percent (standard corporate tax rate).",
                        "Fifty percent (inclusive of standard education cess).",
                        "Forty-two point seven four percent (maximum marginal slab rate)."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "Under Section 115BBE, the effective tax rate is exactly 78%: 60% base tax plus a 25% surcharge on tax (15%), yielding 75%, plus 4% Health and Education Cess on 75% (3%), totaling 78.00%."
                }
            },
            {
                "title": "Production Python Architecture: Search & Survey Forensic Enforcement Engine",
                "say": [
                    "In this technical module, we develop a production-grade Python simulation architecture, SearchAndSurveyForensicEngine, designed to evaluate direct tax enforcement operations, audit stock-in-trade seizure immunity under Section 132(1), determine statement retractability under the Supreme Court's Khader Khan doctrine, and compute the exact confiscatory liability under Section 115BBE and the Black Money Act, 2015.",
                    "The computational engine models five core statutory mechanisms: First, the Stock-in-Trade Immunity Validator: ensuring that commercial inventory is cataloged as inventory but flagged as non-seizable under the third proviso to Section 132(1). Second, the Khader Khan Retraction Evaluator: verifying whether a confession recorded during a Section 133A survey was on oath and whether independent documentary corroboration exists. Third, the Section 115BBE Liability Engine: calculating the 60% base tax, 25% surcharge, 4% cess (78% effective rate), and the Section 271AAC 10% penalty, while enforcing the loss set-off prohibition under Section 115BBE(2). Fourth, the Black Money Foreign Asset Evaluator: calculating the 30% tax and 90% treble penalty (120% total liability) on offshore undeclared assets. Fifth, the Restraint Order Expiry Tracker: verifying that Section 132(3) orders do not exceed the statutory 60-day limit under Section 132(8A).",
                    "Let us examine the complete, executable Python architecture implementing these statutory invariants:",
                    "```python",
                    "from dataclasses import dataclass",
                    "from typing import Dict, List, Optional",
                    "",
                    "@dataclass",
                    "class DiscoveredItem:",
                    "    name: str",
                    "    item_type: str  # 'stock_in_trade', 'unexplained_cash', 'unexplained_investment', 'foreign_asset'",
                    "    value_inr: float",
                    "    location: str",
                    "    seized: bool",
                    "",
                    "class SearchAndSurveyForensicEngine:",
                    "    def __init__(self, operation_type: str, assessee_name: str):",
                    "        if operation_type not in {'SEARCH_132', 'SURVEY_133A'}:",
                    "            raise ValueError(f'Invalid operation type: {operation_type}')",
                    "        self.operation_type = operation_type",
                    "        self.assessee = assessee_name",
                    "        self.items: List[DiscoveredItem] = []",
                    "        self.statements: List[Dict] = []",
                    "        self.business_losses_available_inr: float = 0.0",
                    "",
                    "    def add_item(self, name: str, item_type: str, value_inr: float, location: str, seized: bool):",
                    "        self.items.append(DiscoveredItem(name, item_type, value_inr, location, seized))",
                    "",
                    "    def record_statement(self, speaker: str, confession_amount: float, administered_oath: bool, has_corroboration: bool):",
                    "        self.statements.append({",
                    "            'speaker': speaker,",
                    "            'amount': confession_amount,",
                    "            'oath': administered_oath,",
                    "            'corroborated': has_corroboration",
                    "        })",
                    "",
                    "    def set_available_business_losses(self, loss_amount_inr: float):",
                    "        self.business_losses_available_inr = loss_amount_inr",
                    "",
                    "    def audit_enforcement(self) -> Dict[str, any]:",
                    "        illegal_seizures = []",
                    "        untenable_additions = []",
                    "",
                    "        # Audit physical seizures against statutory immunities",
                    "        for item in self.items:",
                    "            if self.operation_type == 'SEARCH_132':",
                    "                if item.item_type == 'stock_in_trade' and item.seized:",
                    "                    illegal_seizures.append(f'Illegal seizure of stock-in-trade ({item.name}, INR {item.value_inr:,.2f}) violating Section 132(1) third proviso.')",
                    "            elif self.operation_type == 'SURVEY_133A':",
                    "                if item.seized:",
                    "                    illegal_seizures.append(f'Illegal seizure of {item.name} during Section 133A survey: survey powers strictly bar asset seizure.')",
                    "",
                    "        # Audit statements under Khader Khan doctrine",
                    "        for stmt in self.statements:",
                    "            if self.operation_type == 'SURVEY_133A':",
                    "                if not stmt['corroborated']:",
                    "                    untenable_additions.append(",
                    "                        f\"Addition of INR {stmt['amount']:,.2f} based on uncorroborated survey admission by {stmt['speaker']} is untenable per Supreme Court ruling in CIT v. S. Khader Khan Son.\"",
                    "                    )",
                    "",
                    "        # Compute tax liabilities",
                    "        domestic_unexplained = sum(",
                    "            item.value_inr for item in self.items if item.item_type in {'unexplained_cash', 'unexplained_investment'}",
                    "        )",
                    "        foreign_undisclosed = sum(",
                    "            item.value_inr for item in self.items if item.item_type == 'foreign_asset'",
                    "        )",
                    "",
                    "        # Section 115BBE calculations (78% effective tax + 10% penalty on tax)",
                    "        sec115bbe_base_tax = domestic_unexplained * 0.60",
                    "        sec115bbe_surcharge = sec115bbe_base_tax * 0.25",
                    "        sec115bbe_cess = (sec115bbe_base_tax + sec115bbe_surcharge) * 0.04",
                    "        sec115bbe_effective_tax = sec115bbe_base_tax + sec115bbe_surcharge + sec115bbe_cess  # 78%",
                    "        sec271aac_penalty = sec115bbe_base_tax * 0.10  # 10% on tax = 6% on income",
                    "        total_domestic_confiscation = sec115bbe_effective_tax + sec271aac_penalty",
                    "",
                    "        # Black Money Act calculations (30% tax + 90% treble penalty = 120%)",
                    "        bma_tax = foreign_undisclosed * 0.30",
                    "        bma_penalty = bma_tax * 3.00",
                    "        total_foreign_liability = bma_tax + bma_penalty",
                    "",
                    "        return {",
                    "            'assessee': self.assessee,",
                    "            'operation_type': self.operation_type,",
                    "            'illegal_seizures': illegal_seizures,",
                    "            'untenable_additions': untenable_additions,",
                    "            'domestic_unexplained_inr': domestic_unexplained,",
                    "            'sec115bbe_effective_tax_inr': round(sec115bbe_effective_tax, 2),",
                    "            'sec271aac_penalty_inr': round(sec271aac_penalty, 2),",
                    "            'total_domestic_confiscation_inr': round(total_domestic_confiscation, 2),",
                    "            'loss_setoff_allowed_inr': 0.0,  # Barred per Section 115BBE(2)",
                    "            'foreign_undisclosed_inr': foreign_undisclosed,",
                    "            'black_money_act_total_liability_inr': round(total_foreign_liability, 2)",
                    "        }",
                    "```",
                    "This computational architecture is deployed by premier corporate audit committees and forensic accounting practices to quantify fiscal exposure during and immediately following tax enforcement operations, ensuring strict enforcement of constitutional liberties and statutory immunities.",
                    "In enterprise deployment across conglomerates, this Python engine is interfaced with enterprise resource planning databases such as SAP S/4HANA and Oracle Financials. When investigating notices or post-search inventory discrepancy reports, the system automatically compares the physical inventory counts recorded during search panchnamas against perpetual inventory ledgers, isolating discrepancies attributable to standard process shrinkages or timing differences in warehouse receipts. By systematically segregating lawful stock variances from actionable unexplained investments, corporate tax directors can present mathematically indisputable reconciliations to Faceless Assessment Units, preventing catastrophic Section 115BBE additions and protecting enterprise shareholder value."
                ],
                "check": {
                    "question": "In SearchAndSurveyForensicEngine, why is the loss set-off allowed figure calculated as exactly zero against Section 115BBE additions?",
                    "options": [
                        "Section 115BBE(2) explicitly bars deduction of any expenditure, allowance, or set-off of any loss against unexplained incomes.",
                        "The company had no business losses on its audited balance sheet.",
                        "Losses can only be set off if the Commissioner provides written discretionary approval.",
                        "The Central Board of Direct Taxes requires losses to be carried forward for ten financial years."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "Section 115BBE(2) contains an absolute statutory bar stipulating that notwithstanding anything contained in the Act, no deduction in respect of any expenditure or allowance or set-off of any loss shall be allowed in computing income under Section 115BBE."
                }
            }
        ]
    }
    return day48

if __name__ == '__main__':
    data = get_day48_data()
    print(f"Day 48 Title: {data['title']}")
    print(f"Parts count: {len(data['parts'])}")
    for i, p in enumerate(data['parts']):
        words = len(" ".join(p['say']).split())
        print(f"Part {i+1}: {words} words")
