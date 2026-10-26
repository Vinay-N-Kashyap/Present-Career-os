"""
Day 34: Advanced Transfer Pricing & Dispute Resolution: BEPS, Safe Harbours & APA Mechanisms
"""

DAY34_METADATA = {'coursePrefix': 'bcom_tax',
 'day': 34,
 'minutes': 38,
 'projectStep': {'steps': ["Select and execute the Most Appropriate Method (MAM) to compute Arm's Length Price under "
                           'Section 92C.',
                           'Model unilateral and bilateral Advance Pricing Agreements (APAs) including 4-year rollback '
                           'provisions.',
                           'Audit Thin Capitalisation interest deductions against the 30% EBITDA statutory ceiling '
                           'under Section 94B.',
                           'Compile three-tier transfer pricing documentation (Local File Form 3CEB, Master File, and '
                           'CbCR Form 3CEAD).'],
                 'title': 'Global Transfer Pricing Defense & Thin Capitalisation Simulation'},
 'title': 'Advanced Transfer Pricing & Dispute Resolution: APAs, Safe Harbours & Section 94B'}

DAY34_PARTS = [{'check': {'answer': 0,
            'answerIndex': 0,
            'options': ["The arm's length range is defined between the 35th percentile and the 65th percentile; if the "
                        'tested margin falls within this range, it is accepted; otherwise, it is adjusted to the '
                        'Median (50th percentile).',
                        'The range encompasses all companies within three standard deviations of the global industry '
                        'average.',
                        'The taxpayer is automatically required to adopt the highest margin found among all comparable '
                        'companies.',
                        'The Assessing Officer selects any arbitrary three companies from the local district and '
                        'computes their geometric mean.'],
            'question': "Under Rule 10CA of the Income-tax Rules, how is the Arm's Length Range applied when a search "
                        'yields six or more independent comparable companies?',
            'why': "Rule 10CA mandates that if there are 6 or more comparables, an arm's length range from the 35th to "
                   "65th percentile is constructed. If the tested party's margin falls within this dataset range, it "
                   "is deemed arm's length; if outside, the price is adjusted to the 50th percentile (median)."},
  'say': ['Welcome to Day 34 of Corporate Taxation and Strategic Tax Planning. Today, we confront the primary '
          'battleground of global corporate tax controversy: International Transfer Pricing. In multinational '
          'enterprise networks, parent corporations and subsidiary entities engage in colossal volumes of cross-border '
          'intercompany commerce: selling raw materials, licensing intellectual property, sharing centralized '
          'corporate management services, and extending cross-border debt. If left unregulated, multinationals could '
          'arbitrarily set transfer prices—artificially inflating expenses in high-tax jurisdictions and parking '
          'profits in low-tax havens. To ensure that international transactions between Associated Enterprises (AEs) '
          'are evaluated on an objective commercial basis, Chapter X of the Income-tax Act, 1961 mandates strict '
          "compliance with the 'Arm's Length Principle'.",
          "Codified in Section 92C(1) and Rule 10B of the Income-tax Rules, the Arm's Length Price (ALP) in relation "
          "to an international transaction must be determined by the 'Most Appropriate Method' (MAM), chosen from six "
          'statutorily prescribed methods: (i) Comparable Uncontrolled Price (CUP) Method; (ii) Resale Price Method '
          '(RPM); (iii) Cost Plus Method (CPM); (iv) Profit Split Method (PSM); (v) Transactional Net Margin Method '
          '(TNMM); and (vi) Any other method (Other Method) as prescribed under Rule 10AB. Under Rule 10C, the '
          'selection of the MAM is not a matter of subjective convenience; it must be justified based on the nature of '
          'the transaction, availability of reliable comparable data, degree of comparability, and the extent of '
          'functional, asset, and risk (FAR) alignment.',
          'Among these methods, the Transactional Net Margin Method (TNMM) has emerged as the dominant transfer '
          'pricing methodology in India, representing over eighty percent of corporate transfer pricing filings. TNMM '
          "examines the net profit margin realized by the 'Tested Party' relative to an appropriate base (costs, "
          'sales, or assets) in comparison to the net profit margin realized by independent comparable companies in '
          'similar transactions. The Tested Party is almost universally chosen as the least complex entity—typically '
          'the Indian captive service provider or contract manufacturer that does not own valuable unique intellectual '
          'property or assume entrepreneurial market risks. Operating Profit over Total Cost (OP/TC) serves as the '
          'primary Profit Level Indicator (PLI) for Indian captive software and back-office service hubs.',
          "Crucially, the Indian transfer pricing regulations apply the 'Arm's Length Range' concept under Rule 10CA. "
          'Introduced to align Indian rules with international OECD standards, Rule 10CA establishes that where a '
          "search of independent comparable companies yields six or more valid comparables, the arm's length price is "
          'determined using a statistical dataset based on the 35th percentile to the 65th percentile of the dataset. '
          "If the tested party's actual operating margin falls within this 35th-to-65th percentile range, the transfer "
          "price is accepted as fully arm's length. If the actual margin falls outside the range, the transfer price "
          'is statutorily adjusted to the Median (50th percentile) of the dataset, triggering an upward transfer '
          'pricing adjustment and immediate tax reassessment.',
          'Where the comparable search yields fewer than six valid comparables, Rule 10CA mandates the application of '
          'the Arithmetic Mean. In such cases, the taxpayer is protected by a statutory tolerance band under the third '
          'proviso to Section 92C(2): no transfer pricing adjustment is made if the actual transaction price differs '
          'from the arithmetic mean by an amount not exceeding three percent (3%) of the transaction value (or one '
          'percent for wholesale traders). Furthermore, under Section 92(3), transfer pricing provisions are strictly '
          'one-way: an adjustment can be made only if it has the effect of increasing the total income or reducing the '
          'loss of the taxpayer; an adjustment that would reduce taxable income in India is permanently barred.',
          'In high-stakes transfer pricing audits, the Transfer Pricing Officer (TPO) frequently challenges the '
          "taxpayer's comparable selection by applying aggressive quantitative and qualitative filters. The TPO "
          'eliminates low-margin comparables using arbitrary filters: turnover filters (rejecting companies with '
          'revenue under ten times the tested party), export revenue filters (>75% exports), employee cost filters '
          '(>25% of sales), and persistent loss filters. To defend against multi-crore TPO adjustments, corporate tax '
          'teams must maintain bulletproof economic search matrices on commercial databases (such as Prowess and '
          'Capitalline), documenting explicit rejection rationales for every excluded entity.'],
  'title': "Determination of Arm's Length Price (ALP) under Section 92C: Selection of Most Appropriate Method"},
 {'check': {'answer': 0,
            'answerIndex': 0,
            'options': ['Up to four (4) assessment years immediately preceding the first prospective year covered by '
                        'the APA.',
                        'Up to eight (8) assessment years, matching the statutory business loss carryforward window.',
                        'Indefinitely for all open assessment years since corporate incorporation.',
                        'Only one (1) preceding assessment year, provided a ten percent surcharge penalty is paid.'],
            'question': "Under Section 92CC(9A) of the Income-tax Act, for how many assessment years can the 'Rollback "
                        "Provision' of an Advance Pricing Agreement (APA) be applied retroactively?",
            'why': 'Section 92CC(9A) and Rule 10MA provide that an APA may include rollback provisions covering up to '
                   'four (4) assessment years immediately preceding the first of the previous years covered by the '
                   'prospective APA.'},
  'say': ['Given the intense subjectivity, protracted litigation, and billions of dollars in disputed tax adjustments '
          'characteristic of transfer pricing audits, multinational enterprises increasingly turn to Advance Pricing '
          'Agreements (APAs) to secure certainty. Codified in Section 92CC of the Income-tax Act, read with Rules 10F '
          'to 10T, an APA is a formal, legally binding contract entered into between the Central Board of Direct Taxes '
          "(CBDT) and a taxpayer. The APA determines the arm's length price or specifies the methodology by which the "
          "arm's length price shall be calculated in relation to specified international transactions for a "
          'prospective period of up to five (5) consecutive assessment years.',
          'The APA framework provides three structural variants: (i) Unilateral APA, entered into exclusively between '
          'the Indian CBDT and the Indian taxpayer. While rapid to negotiate, a unilateral APA binds only the Indian '
          'tax authority, leaving the foreign associated enterprise vulnerable to double taxation in its home '
          'jurisdiction. (ii) Bilateral APA, entered into between the Indian CBDT, the foreign competent authority '
          'under the Mutual Agreement Procedure (MAP) article of the relevant DTAA, and the respective corporate '
          'entities. A bilateral APA guarantees complete tax symmetry and eliminates double taxation across both '
          'sovereign nations. (iii) Multilateral APA, involving three or more sovereign competent authorities, '
          'designed for complex global value chains.',
          "A transformative innovation introduced by the Finance (No. 2) Act, 2014 is the 'Rollback Provision' under "
          'Section 92CC(9A) and Rule 10MA. Under the rollback mechanism, the transfer pricing methodology agreed upon '
          'in an APA can be applied retroactively to up to four (4) assessment years immediately preceding the first '
          'prospective year covered by the APA. By combining five prospective years with four rollback years, a single '
          'APA negotiation can provide comprehensive, audit-proof transfer pricing certainty across nine (9) '
          'consecutive assessment years, completely neutralizing active litigation before the CIT(Appeals) and the '
          'Income Tax Appellate Tribunal (ITAT).',
          'To qualify for rollback relief under Rule 10RA, four mandatory statutory conditions must be satisfied: (a) '
          'The international transaction in the rollback years must be the same as the covered transaction in the '
          'prospective APA; (b) The return of income for each rollback year must have been filed on or before the due '
          "date specified under Section 139(1); (c) The accountant's report in Form 3CEB must have been timely "
          'furnished; and (d) Applying the rollback provisions must not have the effect of reducing the total income '
          'or increasing the loss disclosed in the original return of income for that rollback year.',
          'The procedural journey of an APA involves four sequential phases: First, an optional Pre-Filing '
          'Consultation (Form 3CEC) to discuss transaction scope and methodology; Second, the formal APA Application '
          '(Form 3CED) accompanied by detailed functional analyses, economic benchmarking studies, and proposed '
          'transfer pricing formulas; Third, intensive technical negotiations with the APA Team, including site visits '
          'to evaluate physical operations and FAR realities; and Fourth, execution of the binding agreement approved '
          'by the Central Government. Once signed, the taxpayer files an annual Compliance Report in Form 3CEF, and '
          'the jurisdictional TPO conducts a streamlined compliance audit restricted solely to verifying adherence to '
          'the agreed terms.',
          'The legal sanctity of an APA is absolute. Under Section 92CC(5), an APA is binding on the taxpayer and the '
          'Commissioner of Income Tax (and subordinate tax authorities) in respect of the specified transaction. The '
          'tax authority cannot audit, question, or challenge the agreed transfer pricing methodology during the '
          'covered years, unless the agreement is canceled by the CBDT due to fraud, misrepresentation of facts, or '
          'failure to comply with agreed operational terms. For multinational corporations operating in India, signing '
          'an APA transforms transfer pricing from a chronic corporate risk into a stable, predictable foundation for '
          'strategic long-term capital investment.'],
  'title': 'Advance Pricing Agreements (APA): Unilateral, Bilateral & Rollback Provisions (Section 92CC)'},
 {'check': {'answer': 0,
            'answerIndex': 0,
            'options': ['Seventeen percent (17%) on operating expenses.',
                        'Thirty percent (30%) on gross revenue.',
                        'Ten percent (10%) on pre-tax accounting EBITDA.',
                        'Zero percent (0%), as software development is completely exempt from transfer pricing rules.'],
            'question': 'Under Rule 10TD of the Income-tax Rules, what is the prescribed Safe Harbour operating profit '
                        'margin on operating costs (OP/OC) for an Indian software development service provider with '
                        'transaction value up to Rs 100 Crore?',
            'why': 'Rule 10TD prescribes that for software development services where the value of international '
                   'transactions does not exceed Rs 100 Crore, the safe harbour operating profit margin is seventeen '
                   'percent (17%) on operating costs.'},
  'say': ['For small and mid-sized enterprises, or corporations seeking immediate transfer pricing certainty without '
          'incurring the substantial legal, economic, and administrative costs of an APA (which often span two to four '
          'years in negotiations), the Income-tax Act provides an alternative administrative off-ramp: Safe Harbour '
          "Rules. Authorized under Section 92CB and codified in Rules 10TA to 10TG of the Income-tax Rules, a 'Safe "
          "Harbour' is defined as circumstances in which the tax authority shall accept the transfer price declared by "
          'the taxpayer by operation of law, without subjecting the transaction to economic benchmarking scrutiny or '
          'TPO adjustments.',
          'Safe harbour regimes establish pre-determined, statutory operating profit margins for specific categories '
          'of international transactions. If an eligible taxpayer reports an operating profit margin that meets or '
          'exceeds the prescribed safe harbour threshold, the Transfer Pricing Officer is legally prohibited from '
          'challenging the price or making any upward adjustments. Eligible international transactions under Rule 10TD '
          'encompass: (i) Provision of software development services; (ii) Provision of Information Technology enabled '
          'Services (ITeS); (iii) Provision of Knowledge Process Outsourcing (KPO) services; (iv) Contract R&D '
          'services relating to software development; (v) Contract R&D services relating to generic pharmaceuticals; '
          '(vi) Manufacture and export of core and non-core auto components; and (vii) Extending intra-group '
          'cross-border loans and corporate guarantees.',
          'For Information Technology and ITeS providers, Rule 10TD establishes graduated safe harbour thresholds '
          'based on annual transaction value: For software development and ITeS transactions where the aggregate value '
          'does not exceed Rs 100 Crore, the prescribed safe harbour operating margin is seventeen percent (17%) on '
          'operating costs (OP/OC). Where the aggregate transaction value exceeds Rs 100 Crore but does not exceed Rs '
          '200 Crore, the required operating margin increases to eighteen percent (18%). For Knowledge Process '
          'Outsourcing (KPO) services—involving complex data analytics, actuarial valuation, or financial research—the '
          'safe harbour margin is twenty-four percent (24%) on operating cost (or 21% where employee cost exceeds 60% '
          'of total cost).',
          'In contract research and development (R&D) sectors, safe harbour thresholds reflect higher risk profiles. '
          'For software contract R&D services, the safe harbour margin is twenty-four percent (24%) on operating cost '
          'for transactions up to Rs 200 Crore. For contract R&D services relating to generic pharmaceuticals, the '
          'prescribed safe harbour margin is twenty-four percent (24%). For manufacturing enterprises, safe harbour '
          'rules govern the export of automotive components: for core auto components (engines, gearboxes), the safe '
          'harbour margin is twelve percent (12%), while for non-core auto components (accessories, stampings), the '
          'margin is eight-and-a-half percent (8.5%).',
          'Safe harbour rules also provide standardized safe harbor interest rates for intra-group corporate loans and '
          'guarantees under Rule 10TD(2A). For loans denominated in Indian Rupees extended to an overseas AE, the safe '
          'harbour interest rate is tied to the 1-year Marginal Cost of Funds based Lending Rate (MCLR) of the State '
          'Bank of India plus a risk spread (ranging from 175 to 425 basis points based on the credit rating of the '
          'foreign borrower). For foreign-currency denominated loans (e.g., US Dollars or Euros), the interest rate is '
          'tied to the 6-month Alternative Reference Rate (such as SOFR) plus a risk spread. For corporate guarantees '
          'extended on behalf of a foreign AE, the safe harbour commission fee is one percent (1%) per annum on the '
          'guaranteed amount.',
          'To elect into the safe harbour regime, the taxpayer must furnish Form 3CEFA electronically on or before the '
          'due date for filing the return of income under Section 139(1). The TPO conducts a streamlined '
          'jurisdictional check to verify that the transaction is an eligible transaction and that the declared margin '
          'satisfies the statutory threshold. If satisfied, the TPO passes an order accepting the safe harbour '
          'election. While safe harbour margins are often higher than what an aggressive taxpayer might defend in an '
          'APA, they provide absolute, immediate immunity from transfer pricing litigation, penalty scrutiny, and '
          'professional advisory overhead, making them highly attractive for risk-averse multinational subsidiaries.'],
  'title': 'Safe Harbour Rules (Rule 10TD) for IT/ITeS, R&D Services & Auto Components'},
 {'check': {'answer': 0,
            'answerIndex': 0,
            'options': ["Capped at thirty percent (30%) of the company's Earnings Before Interest, Taxes, "
                        'Depreciation, and Amortization (EBITDA), with unabsorbed interest carrying forward for up to '
                        '8 assessment years.',
                        'Capped at exactly fifty percent of total annual gross sales revenue.',
                        'Capped at the statutory repo rate of the Reserve Bank of India multiplied by total employee '
                        'payroll.',
                        'Permanently limited to one crore rupees regardless of company size or profitability.'],
            'question': 'Under Section 94B of the Income-tax Act (Thin Capitalisation Rules), what is the statutory '
                        'ceiling on the deduction of interest expenditure paid to non-resident Associated Enterprises?',
            'why': 'Section 94B caps the deductible interest paid or payable to non-resident Associated Enterprises at '
                   '30% of tax EBITDA (for interest exceeding Rs 1 Crore). Excess interest is disallowed and carried '
                   'forward for up to 8 assessment years.'},
  'say': ['Among the most pervasive base erosion techniques historically deployed by multinational enterprise groups '
          "was 'Thin Capitalisation'—the strategic practice of financing an operating subsidiary with an excessive "
          'proportion of debt relative to equity. Because dividend distributions to equity shareholders are paid out '
          'of post-tax profits (non-deductible), while interest payments on corporate debt are deductible business '
          'expenses under Section 36(1)(iii), multinationals loaded their Indian operating entities with massive '
          'intercompany debt from tax-haven affiliates. The massive cross-border interest payments wiped out Indian '
          'taxable profits, transferring untaxed cash to overseas holding entities.',
          'To implement BEPS Action 4 recommendations and eliminate debt-induced base erosion, Parliament enacted '
          'Section 94B of the Income-tax Act: the Thin Capitalisation Interest Limitation Rule. Section 94B applies '
          'where an Indian company (or a Permanent Establishment of a foreign company in India), being the borrower, '
          'incurs any expenditure by way of interest or of similar nature exceeding one crore rupees (Rs 1 Crore) in '
          'respect of any debt issued by a non-resident Associated Enterprise (AE). Crucially, the rule also applies '
          'where debt is issued by an independent third-party lender (such as an international bank) if a non-resident '
          'AE provides an explicit or implicit corporate guarantee to the lender or deposits matching funds with the '
          'lender.',
          'Section 94B(1) establishes a strict mathematical ceiling on allowable interest deductions: the allowable '
          'interest deduction in respect of debt from non-resident AEs is capped at thirty percent (30%) of the '
          "borrower's Earnings Before Interest, Taxes, Depreciation, and Amortization (EBITDA), computed under normal "
          'tax provisions. Any interest expenditure incurred by the entity in excess of 30% of EBITDA is statutorily '
          'disallowed in the current assessment year. For example, if an Indian company generates tax EBITDA of Rs 100 '
          'Crore and incurs overseas AE interest expense of Rs 42 Crore, its deductible interest is capped at Rs 30 '
          'Crore (30% of Rs 100 Crore). The remaining Rs 12 Crore is disallowed and added back to taxable business '
          'profits.',
          'However, Section 94B(4) provides a vital relief mechanism: Disallowance Carryforward. Any interest expense '
          'disallowed in a current assessment year under the 30% EBITDA cap is NOT permanently lost; instead, it is '
          'carried forward to following assessment years for a maximum period of eight (8) consecutive assessment '
          'years immediately succeeding the year of disallowance. In any subsequent year, the brought-forward '
          'disallowed interest can be set off against taxable profits to the extent that total AE interest in that '
          'year remains below the 30% EBITDA ceiling.',
          'Section 94B contains specific statutory carve-outs designed to protect specialized financial sectors. Under '
          'Section 94B(3), the interest limitation rules DO NOT apply to Indian companies engaged in the business of '
          'banking or insurance, recognizing that debt, deposits, and financial leverage constitute the primary raw '
          'materials of financial intermediation. Similarly, non-banking financial companies (NBFCs) meeting specific '
          'regulatory criteria enjoy statutory exemptions, ensuring that domestic credit availability is not '
          'constrained by cross-border anti-abuse limitations.',
          'In capital structure architecture, Chief Financial Officers must coordinate closely with international tax '
          'directors to model debt-to-equity ratios. When structuring outbound acquisition financing or funding '
          'domestic greenfield capital expenditure, reliance on overseas shareholder loans must be calibrated against '
          'five-year EBITDA projections. If operational EBITDA is expected to be depressed during the initial two-year '
          'factory ramp-up phase, loading the entity with overseas AE debt will trigger massive Section 94B interest '
          'disallowances, stranding tax deductions and destroying after-tax project returns. Utilizing equity '
          'capitalization, local rupee debt, or qualifying hybrid instruments ensures optimized interest deductibility '
          'without breaching statutory thin capitalisation caps.',
          'In cross-border audit enforcement, the interaction between Section 94B thin capitalisation disallowances '
          "and arm's length interest rate benchmarking under Section 92C operates sequentially. The Transfer Pricing "
          'Officer first audits the nominal interest rate charged on the shareholder loan (e.g., reducing a 12% coupon '
          "rate down to an arm's length rate of 7.5% based on prevailing SOFR spreads). Only AFTER the transfer "
          'pricing adjustment is made to the base interest expense does the Assessing Officer apply the Section 94B '
          "30% EBITDA cap. Corporate tax counsels must prepare dual-layered defenses: justifying the arm's length "
          'interest rate using credit rating benchmark curves under Section 92C, while simultaneously optimizing '
          'capital expenditure depreciation to preserve robust tax EBITDA.'],
  'title': 'Thin Capitalisation Rules under Section 94B: 30% EBITDA Interest Caps & Disallowance'},
 {'check': {'answer': 0,
            'answerIndex': 0,
            'options': ['Consolidated group revenue exceeding Rs 6,400 Crore (approximately 750 million euros) in the '
                        'preceding accounting year.',
                        'Consolidated group revenue exceeding fifty crore rupees in the current assessment year.',
                        'Total domestic sales turnover exceeding one thousand crore rupees within territorial India.',
                        'Total shareholder market capitalization exceeding ten billion US dollars on public stock '
                        'exchanges.'],
            'question': 'Under Section 286 of the Income-tax Act, what is the consolidated global group revenue '
                        'threshold that mandates the filing of a Country-by-Country Report (CbCR - Form 3CEAD)?',
            'why': 'Section 286(7) and Rule 10DB prescribe that CbCR reporting applies to an international group whose '
                   'total consolidated group revenue exceeds Rs 6,400 Crore in the accounting year preceding the '
                   'reporting accounting year.'},
  'say': ['The international consensus forged under OECD BEPS Action 13 revolutionized transfer pricing documentation '
          'worldwide, replacing fragmented, uncoordinated local tax filings with a transparent, standardized '
          'Three-Tier Documentation Framework. Codified in Section 92D of the Income-tax Act, read with Rules 10DA and '
          '10DB, India adopted the three-tier documentation structure to provide tax administrations with a holistic, '
          'macro-level and micro-level picture of multinational enterprise operations: Tier 1 (The Local File), Tier 2 '
          '(The Master File), and Tier 3 (The Country-by-Country Report - CbCR).',
          'Tier 1: The Local File (Form 3CEB). The local file represents the traditional foundation of Indian transfer '
          'pricing compliance. Under Section 92E, every person who has entered into an international transaction or '
          "specified domestic transaction during a previous year must obtain an accountant's report in Form 3CEB from "
          'an independent Chartered Accountant and furnish it electronically on or before the statutory due date (31st '
          'October of the assessment year, or 30th November). Form 3CEB provides granular transaction-level details: '
          'contract values, tested party financial statements, transfer pricing methodology selected, economic search '
          "matrices, and comparable company margins substantiating arm's length compliance.",
          'Tier 2: The Master File (Form 3CEAA and Form 3CEAB). Standardized under Rule 10DA, the Master File provides '
          'high-level panoramic visibility into the global business operations and transfer pricing policies of the '
          'entire Multinational Enterprise (MNE) group. The Master File must be filed by an Indian constituent entity '
          'if the MNE group crosses dual statutory thresholds: (i) Consolidated Global Group Revenue exceeds five '
          'hundred crore rupees (Rs 500 Crore) in the accounting year; AND (ii) Aggregate value of international '
          'transactions in India exceeds fifty crore rupees (Rs 50 Crore) (or intangible property transactions '
          'exceeding Rs 10 Crore).',
          'The Master File is divided into two parts: Part A (Form 3CEAA), which contains basic identification '
          'particulars required from every constituent entity, and Part B (Form 3CEAA), which requires deep narrative '
          "disclosures across five mandatory areas: (a) The MNE group's organizational structure and legal ownership "
          "charts; (b) Detailed descriptions of the group's business, main drivers of business profit, supply chain "
          "architectures, and key service arrangements; (c) The group's strategy for the development, ownership, and "
          'exploitation of Intangible Property (including list of all patents and trademarks, and DEMPE functions); '
          "(d) The group's intercompany financial activities and centralized treasury structures; and (e) The group's "
          'financial and tax positions (including consolidated financial statements).',
          'Tier 3: The Country-by-Country Report (CbCR - Form 3CEAD). Codified in Section 286 and Rule 10DB, CbCR is '
          'the most powerful tax transparency instrument in modern history. CbCR must be filed by the Ultimate Parent '
          'Entity (UPE) of an international group if the consolidated group revenue in the preceding accounting year '
          'exceeds six thousand four hundred crore rupees (Rs 6,400 Crore—the Indian equivalent of the 750 million '
          'euro OECD threshold). CbCR aggregates quantitative financial and tax data broken down '
          'jurisdiction-by-jurisdiction across every country where the MNE operates.',
          'Table 1 of CbCR requires reporting for each tax jurisdiction: (i) Unrelated party revenue; (ii) Related '
          'party revenue; (iii) Total revenue; (iv) Profit or loss before income tax; (v) Income tax paid (on cash '
          'basis); (vi) Current year income tax accrued; (vii) Stated capital; (viii) Accumulated earnings; (ix) '
          'Number of full-time employees; and (x) Net book value of tangible assets. Table 2 lists all constituent '
          'entities resident in each jurisdiction and their main business activities. CbCR data is exchanged '
          'automatically between tax administrations worldwide under Multilateral Competent Authority Agreements '
          '(MCAA), allowing Indian tax authorities to instantly spot discrepancies where high profits are booked in '
          'zero-tax jurisdictions that possess zero employees and zero tangible assets, triggering targeted transfer '
          'pricing audits.',
          'Failure to comply with three-tier documentation mandates triggers severe, non-negotiable statutory monetary '
          'penalties. Under Section 271AA, failure to keep and maintain information and documentation required under '
          'Section 92D attracts a penalty of two percent (2%) of the value of each international transaction. Under '
          'Section 271BA, failure to furnish Form 3CEB attracts an automatic penalty of one lakh rupees (Rs 1,00,000). '
          'Furthermore, under Section 271GB, failure to furnish the Master File in Form 3CEAA attracts a penalty of '
          'five lakh rupees (Rs 5,00,000), while failure to furnish CbCR in Form 3CEAD attracts escalating daily '
          'penalties of up to fifty thousand rupees per day. Maintaining rigorous centralized digital master data '
          'pipelines is an indispensable corporate necessity to shield the executive board from severe statutory '
          'compliance exposure.'],
  'title': 'Three-Tier Transfer Pricing Documentation: Master File, Local File & Country-by-Country (CbCR)'}]
