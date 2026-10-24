"""
Day 33: Cross-Border Taxation & Double Taxation Avoidance Agreements (DTAA): Section 90/91 Relief & Multilateral Instrument (MLI)
"""

DAY33_METADATA = {'coursePrefix': 'bcom_tax',
 'day': 33,
 'minutes': 38,
 'projectStep': {'steps': ['Determine corporate tax residency under Place of Effective Management (POEM) rules.',
                           'Map physical and agency operations against Article 5 Permanent Establishment (PE) '
                           'thresholds.',
                           'Compute withholding tax (TDS) under Section 195 reconciling DTAA rates with Section 115A.',
                           'Apply the Multilateral Instrument (MLI) Principal Purpose Test (PPT) to cross-border '
                           'holding structures.'],
                 'title': 'Cross-Border Tax Treaty (DTAA) & Permanent Establishment Engine'},
 'title': 'Cross-Border Taxation & DTAA Treaties: Permanent Establishment, MLI & Digital Taxation'}

DAY33_PARTS = [{'check': {'answer': 0,
            'answerIndex': 0,
            'options': ['The provisions of the domestic Income-tax Act apply to the taxpayer only to the extent they '
                        'are more beneficial than the provisions of the DTAA.',
                        'Domestic income-tax rates automatically supersede international treaties in all cross-border '
                        'transactions.',
                        'DTAA treaties apply exclusively to non-profit charitable trusts and exempt public '
                        'universities.',
                        'Taxpayers must pay both the domestic tax and the treaty tax simultaneously without relief.'],
            'question': 'What is the foundational legal principle established by Section 90(2) of the Income-tax Act '
                        'regarding the relationship between domestic tax law and Double Taxation Avoidance Agreements '
                        '(DTAA)?',
            'why': 'Section 90(2) enshrines the principle of treaty superiority: in relation to an assessee to whom a '
                   'DTAA applies, the provisions of the domestic Income-tax Act apply only to the extent they are more '
                   'beneficial than the treaty provisions.'},
  'say': ['Welcome to Day 33 of Corporate Taxation and Strategic Tax Planning. Today, we venture into the global '
          'domain of Cross-Border Taxation and International Tax Treaties. In international fiscal law, global '
          'economic activity is governed by two competing jurisdictional principles: the Residence Principle (where a '
          'nation asserts the right to tax its residents on their worldwide income, regardless of where that income is '
          'earned) and the Source Principle (where a nation asserts the right to tax income that originates, arises, '
          'or accrues within its sovereign geographic borders, regardless of the residency of the recipient). When '
          'both principles operate simultaneously, an enterprise operating across borders faces the grave threat of '
          'Juridical Double Taxation, where identical income is taxed twice by two sovereign states.',
          'The jurisdictional anchor determining corporate tax liability in India is Corporate Residency, codified in '
          'Section 6(3) of the Income-tax Act. An enterprise is deemed to be an Indian Resident Company in any '
          'previous year if: (i) it is an Indian company incorporated under the Companies Act; or (ii) its Place of '
          'Effective Management (POEM) in that year is in India. Codified in Explanation to Section 6(3), POEM is '
          'defined as the place where key management and commercial decisions that are necessary for the conduct of '
          'the business of an entity as a whole are, in substance, made. The Central Board of Direct Taxes (CBDT) '
          'issued extensive POEM guidelines establishing an Active Business Outside India (ABOI) test: if a foreign '
          "subsidiary's passive income is not more than 50% of total income and key board meetings occur abroad, its "
          'POEM remains outside India, insulating it from worldwide taxation.',
          'To mitigate international double taxation and foster bilateral trade, nations enter into Double Taxation '
          'Avoidance Agreements (DTAA), authorized under Section 90 and Section 90A of the Income-tax Act. Under '
          'Section 90(2), where the Central Government has entered into a tax treaty with another country, the '
          'provisions of the Income-tax Act shall apply to the taxpayer only to the extent they are MORE BENEFICIAL '
          "than the provisions of the treaty. This foundational principle—known internationally as 'Treaty "
          "Superiority'—ensures that an enterprise can elect to be governed by the DTAA whenever treaty provisions "
          'grant lower tax rates, wider exemptions, or higher deduction thresholds than domestic tax law.',
          'To claim the benefits of a DTAA, Section 90(4) mandates that a non-resident taxpayer must obtain and '
          'furnish a Tax Residency Certificate (TRC) issued by the government of the country of which it claims to be '
          'a resident, containing prescribed particulars. Furthermore, under Section 90(5) read with Rule 21AB, if the '
          'TRC does not contain all statutory particulars (such as taxpayer status, nationality, tax identification '
          'number, and address), the taxpayer must furnish an electronic self-declaration in Form 10F. In the absence '
          'of a valid TRC and Form 10F, treaty benefits are denied, and domestic withholding tax rates apply in full.',
          'Where an Indian resident enterprise derives income from a foreign country with which India does NOT have a '
          'bilateral tax treaty, the enterprise is protected from double taxation by Unilateral Relief under Section '
          '91. Under Section 91(1), if an Indian resident proves that it has paid income-tax in a non-treaty country '
          'on doubly taxed income, it is entitled to a deduction from its Indian tax liability calculated at the '
          'Indian tax rate OR the foreign tax rate, WHICHEVER IS LOWER. Section 91 guarantees that domestic '
          'multinationals expanding into frontier non-treaty markets are not penalized by unmitigated double taxation.',
          'In enterprise cross-border transaction structuring, tax counsels must rigorously verify the interaction '
          'between domestic law and treaty provisions. Under Section 206AA, non-residents lacking a Permanent Account '
          'Number (PAN) in India are subject to punitive withholding tax rates of twenty percent (20%). However, '
          'following extensive litigation, the Special Bench of the ITAT in Nagarjuna Fertilizers and subsequent High '
          'Court rulings affirmed that Section 90(2) overrides Section 206AA: if a DTAA prescribes a lower withholding '
          'tax rate (e.g., 10% on royalties), the treaty rate prevails even if the non-resident lacks an Indian PAN, '
          'provided alternative identity documentation is furnished under Rule 37BC.'],
  'title': 'Residence Rules, Source vs. Residence Taxation & Section 90 vs. Section 91 Relief'},
 {'check': {'answer': 0,
            'answerIndex': 0,
            'options': ['A dependent agent in the source state habitually exercises authority to conclude contracts, '
                        'or habitually plays the principal role leading to contract conclusion, in the name of the '
                        'foreign enterprise.',
                        'The foreign enterprise purchases advertising space in local newspapers once every fiscal '
                        'quarter.',
                        'An independent broker acting in the ordinary course of business charges standard commercial '
                        'brokerage commissions.',
                        'The foreign enterprise maintains an informational marketing website accessible via public '
                        'internet browsers.'],
            'question': 'Under Article 5 of standard double taxation treaties (such as the India-US DTAA), what legal '
                        "condition establishes an 'Agency Permanent Establishment' for a foreign enterprise?",
            'why': 'Article 5(5) establishes that a dependent agent triggers an Agency PE if they habitually conclude '
                   'contracts on behalf of the foreign enterprise, or habitually play the principal role leading to '
                   'the conclusion of contracts that are routinely approved without material modification.'},
  'say': ['In international corporate taxation, the single most critical legal threshold dictating whether a foreign '
          'enterprise can be taxed on its business profits in a source country is the existence of a Permanent '
          'Establishment (PE). Codified in Article 5 and Article 7 of the OECD and UN Model Tax Conventions, the PE '
          'concept establishes that the business profits of an enterprise of one Contracting State are taxable ONLY in '
          'that State, UNLESS the enterprise carries on business in the other Contracting State through a Permanent '
          'Establishment situated therein. If a PE exists, the source state acquires sovereign jurisdiction to tax the '
          'profits of the enterprise, but strictly to the extent those profits are attributable to the PE.',
          "Article 5(1) defines the classic 'Fixed Place PE': a permanent establishment means a fixed place of "
          'business through which the business of an enterprise is wholly or partly carried on. To establish a Fixed '
          'Place PE, three cumulative legal tests must be satisfied: (i) The Existence Test (there must be physical '
          'premises, facilities, or installations, such as an office, factory, workshop, or warehouse); (ii) The '
          'Fixedness Test (the place of business must have a degree of permanence in a distinct geographic location); '
          'and (iii) The Disposal Test (the premises must be at the disposal of the foreign enterprise, meaning the '
          'enterprise has the legal or factual power to use the premises for its business activities).',
          "A major source of corporate exposure in modern project contracting is the 'Construction or Installation PE' "
          'under Article 5(3). A building site, construction, installation, or assembly project constitutes a PE only '
          'if it lasts for a specified statutory duration—typically exceeding six months under the UN Model, or twelve '
          'months under the OECD Model (e.g., nine months under the India-US DTAA). Multinational engineering '
          'conglomerates frequently attempt to circumvent this threshold by artificial contract-splitting: subdividing '
          'an 18-month EPC project into three separate 6-month contracts assigned to distinct group entities. Tax '
          'authorities aggressively consolidate these artificial splits under General Anti-Avoidance Rules (GAAR) and '
          'treaty anti-abuse provisions.',
          "In human capital-intensive service sectors, foreign corporations face severe 'Service PE' exposure under "
          "the UN Model Convention (Article 5(2)(l) of India's treaties). A Service PE is triggered where an overseas "
          'enterprise furnishes services (including consultancy services) within the source state through employees or '
          'other personnel engaged for such purpose, provided those activities continue for a period or periods '
          'aggregating more than a specified threshold (typically 90 days or 183 days within any twelve-month period). '
          'Even if the foreign company owns zero physical real estate in India, sending foreign software architects or '
          'management consultants on temporary client-site visits exceeding the statutory threshold triggers a '
          'full-blown Service PE.',
          "The most heavily litigated PE category is the 'Agency Permanent Establishment' under Article 5(5) and "
          'Article 5(6). Traditionally, an Agency PE was triggered when a person acting on behalf of a foreign '
          'enterprise had, and habitually exercised, authority to conclude contracts in the name of the enterprise. '
          'However, under the OECD Base Erosion and Profit Shifting (BEPS) Action 7 reforms, the definition was '
          "expanded to capture 'Commissionaire Arrangements'. An Agency PE now arises where an agent habitually "
          'concludes contracts, or habitually plays the principal role leading to the conclusion of contracts that are '
          'routinely approved by the enterprise without material modification.',
          'The consequences of triggering an unintended Permanent Establishment are financially devastating. The '
          'foreign corporation is subjected to full Indian corporate tax (historically 40%, plus surcharge and cess) '
          'on profits attributed to the PE under Rule 10 of the Income-tax Rules. Furthermore, the Indian customer is '
          'penalized under Section 40(a)(i) for failure to deduct appropriate withholding tax under Section 195, '
          'resulting in massive disallowances, interest penalties under Section 201, and potential prosecution '
          'exposure under Chapter XXII. International tax directors must implement strict global mobility tracking and '
          'contract governance to ensure foreign personnel and liaison offices do not cross PE thresholds.'],
  'title': 'Permanent Establishment (PE) Dynamics: Fixed Place, Agency & Service PE Risks (Article 5)'},
 {'check': {'answer': 0,
            'answerIndex': 0,
            'options': ["Purchasing software gives the buyer a 'copyrighted article' (the right to use the program), "
                        "which does not constitute the transfer of an underlying 'copyright' under the treaty "
                        'definition.',
                        'Software code is legally classified as an intangible public utility exempt from all domestic '
                        'and international tax laws.',
                        'Non-resident software corporations are permanently exempt from filing tax returns in '
                        'developing economies.',
                        'The payments are treated as personal gifts between corporate executives rather than '
                        'commercial business transactions.'],
            'question': "According to the Supreme Court's landmark ruling in Engineering Analysis Centre of Excellence "
                        'Pvt. Ltd. v. CIT (2021), why are payments for packaged off-the-shelf software not taxable as '
                        "'Royalty' under Article 12 of standard DTAAs?",
            'why': 'In Engineering Analysis, the Supreme Court held that buying a software license is the acquisition '
                   "of a 'copyrighted article' rather than a transfer of the 'copyright' itself. Under Article 12 of "
                   'standard DTAAs, only payments for the transfer or use of the underlying copyright constitute '
                   'royalties.'},
  'say': ['In cross-border technology transfers, software distribution, and global engineering management, '
          'international tax flows are dominated by Royalties and Fees for Technical Services (FTS). In domestic law, '
          'Royalties and FTS are governed by Section 9(1)(vi) and Section 9(1)(vii), read with the special '
          'concessional tax rates prescribed in Section 115A of the Income-tax Act. However, when payments are made to '
          'residents of treaty partner jurisdictions, Article 12 of the relevant DTAA provides specialized '
          'definitions, source rules, and capped withholding tax rates that fundamentally alter corporate tax '
          'liabilities.',
          "Under Section 9(1)(vi) of the Income-tax Act, the domestic definition of 'Royalty' is extraordinarily "
          'expansive. It encompasses consideration for the transfer of all or any rights in respect of a patent, '
          'invention, design, secret formula, trademark, copyright, or scientific work. Crucially, through '
          'retrospective explanations introduced by the Finance Act, 2012, Parliament established that consideration '
          'for the use of any software, transmission by satellite, cable, or optic fiber, and use of computer servers '
          'constitutes royalty regardless of whether the possession, control, or location of the underlying asset is '
          'in India. Conversely, under Article 12 of most DTAAs (e.g., OECD Model), Royalty is defined more narrowly '
          'as payments received for the use of, or the right to use, copyright of literary, artistic, or scientific '
          'work.',
          'This critical discrepancy between broad domestic law and narrow treaty definitions led to the landmark '
          'Supreme Court ruling in Engineering Analysis Centre of Excellence Pvt. Ltd. v. CIT (2021). The Supreme '
          'Court resolved decades of litigation by ruling that payments made by Indian end-users or distributors to '
          'non-resident software owners for the use or distribution of shrink-wrapped or packaged software '
          "(off-the-shelf software) do NOT constitute 'Royalty' under Article 12 of the DTAA. The Court held that "
          "purchasing a copy of software grants the customer a 'copyrighted article' (a right to use the software "
          "program), which is fundamentally distinct from acquiring the underlying 'copyright' itself. Consequently, "
          'no withholding tax is deductible under Section 195 on off-the-shelf software purchases from treaty '
          'jurisdictions.',
          'Similarly, Fees for Technical Services (FTS)—termed Fees for Included Services (FIS) in treaties like the '
          'India-US DTAA—exhibit sharp statutory divergence. Under domestic Section 9(1)(vii), FTS encompasses any '
          'consideration for managerial, technical, or consultancy services. However, under many bilateral treaties '
          "(including the US, UK, Singapore, and Canada treaties), the 'Make Available' clause is embedded into "
          'Article 12. Under the Make Available standard, technical or consultancy services are taxable as FTS ONLY IF '
          "the service provider 'makes available' technical knowledge, experience, skill, know-how, or processes to "
          'the customer, enabling the customer to apply the technology independently in the future without ongoing '
          'reliance on the service provider.',
          'The statutory tax rate applied to Royalties and FTS has experienced significant legislative fluctuation. In '
          'the Finance Act, 2023, Parliament amended Section 115A, doubling the domestic tax rate on non-resident '
          'royalties and FTS from ten percent (10%) to twenty percent (20%) (plus applicable surcharge and cess). This '
          'domestic rate hike immediately elevated the strategic importance of tax treaties. Many Indian DTAAs (such '
          'as those with Germany, France, Japan, and Singapore) prescribe capped withholding tax rates of 10% or 15%. '
          'Under Section 90(2), non-resident service providers possessing a valid TRC and Form 10F can claim the lower '
          '10% treaty rate, saving millions of dollars in withholding tax.',
          'When executing cross-border remittances for technical services or software licenses, the payer must ensure '
          'absolute compliance with Section 195 withholding tax procedures. Prior to remitting funds overseas, the '
          'payer must obtain an electronic certification in Form 15CB from an independent Chartered Accountant '
          "certifying the appropriate treaty rate, backed by the non-resident's TRC, Form 10F, and No-PE declaration. "
          'The payer then submits Form 15CA to the tax department. Failure to deduct tax under Section 195 triggers '
          'severe statutory consequences under Section 40(a)(i): one hundred percent (100%) of the expense is '
          "disallowed in the payer's corporate tax computation, and the payer is treated as an 'assessee in default' "
          'liable for penalty interest under Section 201.'],
  'title': 'Taxation of Royalties & Fees for Technical Services (FTS) under Article 12 vs. Section 115A'},
 {'check': {'answer': 0,
            'answerIndex': 0,
            'options': ['Treaty benefits are denied if obtaining the tax benefit was one of the principal purposes of '
                        'the transaction, unless granting the benefit aligns with the object and purpose of the '
                        'treaty.',
                        'Treaty benefits are denied only if the taxpayer has been convicted of criminal fraud in a '
                        'court of international law.',
                        'Treaty benefits are denied if the taxpayer operates in more than three sovereign nations '
                        'simultaneously.',
                        'Treaty benefits are denied whenever corporate profits are paid out as dividends to individual '
                        'shareholders.'],
            'question': 'Under Article 7 of the OECD Multilateral Instrument (MLI), what legal standard is applied by '
                        'tax authorities to deny tax treaty benefits under the Principal Purpose Test (PPT)?',
            'why': 'The Principal Purpose Test (PPT) in Article 7(1) of the MLI denies treaty benefits if it is '
                   'reasonable to conclude that obtaining that benefit was one of the principal purposes of the '
                   "arrangement, unless establishing that granting the benefit is consistent with the treaty's object "
                   'and purpose.'},
  'say': ['For over half a century, multinational enterprises exploited gaps and mismatches in bilateral tax treaties '
          'to engage in Base Erosion and Profit Shifting (BEPS)—artificially shifting corporate profits to low-tax '
          "jurisdictions where there was little or no real economic activity. A classic vehicle was 'Treaty Shopping': "
          'routing investments through intermediary holding companies established in tax havens (such as Mauritius, '
          'Cyprus, or the Cayman Islands) solely to exploit bilateral tax treaties that offered zero capital gains '
          'taxes or rock-bottom withholding rates, despite the intermediary holding company having zero physical '
          'substance, employees, or commercial rationale.',
          'In response, the OECD and G20 launched the BEPS Project, formulating fifteen comprehensive Action Plans. To '
          'implement these anti-abuse measures across thousands of existing bilateral treaties without requiring '
          'decades of bilateral renegotiations, the OECD developed Action 15: the Multilateral Convention to Implement '
          'Tax Treaty Related Measures to Prevent Base Erosion and Profit Shifting, universally known as the '
          'Multilateral Instrument (MLI). India signed the MLI in 2017 and deposited its instrument of ratification in '
          '2019, modifying over ninety of its bilateral tax treaties simultaneously.',
          'The crowning anti-avoidance weapon introduced by the MLI into bilateral tax treaties is the Principal '
          'Purpose Test (PPT), codified as a minimum standard in Article 7 of the MLI. Under the PPT, a benefit under '
          'a Covered Tax Agreement (CTA)—such as a lower withholding tax rate on dividends or capital gains '
          'exemption—shall be DENIED if it is reasonable to conclude, having regard to all relevant facts and '
          'circumstances, that obtaining that tax benefit was one of the principal purposes of any arrangement or '
          'transaction that resulted directly or indirectly in that benefit, UNLESS the taxpayer establishes that '
          'granting the benefit is in accordance with the object and purpose of the treaty.',
          'The Principal Purpose Test fundamentally redefines international tax planning by replacing rigid mechanical '
          'rules with broad subjective anti-abuse scrutiny. Prior to the MLI, multinational groups established '
          'intermediate holding companies in jurisdictions like the Netherlands or Singapore with minimal nominal '
          'presence (a rented mailbox, local corporate secretarial services, and nominee directors). Under the PPT, '
          'tax authorities look past paper registrations to evaluate Economic Substance: Does the holding entity '
          'maintain senior commercial executives with genuine decision-making authority? Does it possess adequate '
          'operational expenditure, physical office infrastructure, and commercial business purpose beyond tax '
          'minimization? If not, treaty benefits are denied under the PPT.',
          'In addition to the PPT, the MLI and modernized bilateral treaties incorporate Limitation on Benefits (LOB) '
          'clauses. An LOB clause is an objective, mechanical anti-treaty-shopping rule that restricts treaty benefits '
          "to 'Qualified Persons'—such as publicly traded corporations, governmental entities, or operating entities "
          'that satisfy specific Active Business Tests and Base Erosion Tests. Under a typical base erosion test, an '
          'entity is disqualified from treaty benefits if more than fifty percent of its gross income is paid out to '
          'non-residents as deductible payments (such as interest, royalties, or management fees).',
          'Operating in the post-MLI international tax landscape demands that multinational enterprises overhaul their '
          'global corporate structures to ensure audit-proof Economic Substance. Cross-border holding structures '
          'lacking demonstrable commercial rationale face catastrophic treaty denial, leading to punitive domestic '
          'withholding taxes and aggressive scrutiny under domestic General Anti-Avoidance Rules (GAAR) codified in '
          'Chapter X-A of the Income-tax Act. Corporate tax leadership must ensure that international operating '
          'entities maintain local executive management, independent governance records, and documented commercial '
          'utility that withstands scrutiny from both Indian and foreign tax administrations.',
          'In operational tax audits, navigating the Principal Purpose Test requires assembling an exhaustive Defense '
          'Dossier before cross-border dividends or capital flows are remitted. The dossier must substantiate the '
          'commercial history of the holding entity: minutes of board meetings demonstrating substantive debate by '
          'local directors, employment contracts of qualified personnel residing in the treaty jurisdiction, and '
          'audited bank statements showing local operational expenditures. If an entity was incorporated merely months '
          'prior to an acquisition without genuine commercial substance, tax authorities will inevitably apply the PPT '
          'to pierce the corporate veil, disallowing preferential treaty withholding rates and triggering aggressive '
          'penalty proceedings under Section 270A.'],
  'title': 'BEPS Action Plans & Multilateral Instrument (MLI): Principal Purpose Test (PPT) & LOB'},
 {'check': {'answer': 0,
            'answerIndex': 0,
            'options': ['Transaction value exceeding Rs 2 Crore from Indian transactions, OR systematic engagement '
                        'with 300,000 or more users in India.',
                        'Maintaining an owned physical corporate headquarters with at least one thousand full-time '
                        'employees in New Delhi.',
                        'Operating a listed public corporation on the Bombay Stock Exchange with fifty percent '
                        'promoter shareholding.',
                        'Exporting physical manufactured hardware across Indian maritime customs ports exceeding fifty '
                        'crore rupees.'],
            'question': 'Under Explanation 2A to Section 9(1)(i) of the Income-tax Act, what are the statutory '
                        "thresholds that establish a 'Significant Economic Presence' (SEP) for a non-resident in "
                        'India?',
            'why': 'Explanation 2A to Section 9(1)(i) prescribes dual alternative thresholds for Significant Economic '
                   'Presence: (a) revenue exceeding Rs 2 Crore in respect of goods, services, or property; OR (b) '
                   'systematic and continuous business solicitation engaging 300,000 or more users in India.'},
  'say': ['The rapid digitisation of the global economy has shattered traditional international tax frameworks '
          'anchored in physical brick-and-mortar nexus. In the digital era, global technology giants—such as search '
          'engines, social media platforms, cloud providers, and e-commerce marketplaces—extract billions of dollars '
          'in economic value from Indian consumers and advertisers without maintaining a physical office, warehouse, '
          'or employee in India. Under classical Article 5 rules, these corporations paid zero corporate income tax in '
          'India because they operated completely without a Fixed Place Permanent Establishment. In response to this '
          'fiscal injustice, India pioneered unilateral digital taxation measures.',
          'In the Finance Act, 2016, India introduced the Equalisation Levy 1.0 (codified in Chapter VIII of the '
          'Finance Act, 2016). Equalisation Levy 1.0 imposes a six percent (6%) tax on the gross amount received or '
          "receivable by a non-resident for 'Specified Services'—defined as online advertising, provision for digital "
          'advertising space, or any other facility for online advertising. Equalisation Levy 1.0 is deductible by the '
          'resident payer if the aggregate annual payments to a single non-resident exceed one lakh rupees (Rs '
          '1,00,000). Crucially, the Equalisation Levy is not part of the Income-tax Act; it is a separate statutory '
          'levy, which means foreign corporations cannot claim foreign tax credits (FTC) against it in their home '
          'jurisdictions under bilateral DTAAs.',
          'In the Finance Act, 2020, India dramatically expanded digital taxation by introducing Equalisation Levy 2.0 '
          '(E-Commerce Equalisation Levy). Under Section 165A of the Finance Act, 2016, Equalisation Levy 2.0 levies a '
          "two percent (2%) tax on the gross consideration received or receivable by a non-resident 'E-Commerce "
          "Operator' from an 'e-commerce supply or services' made or provided or facilitated by it to an Indian "
          "resident or an IP address located in India. The levy applies if the operator's annual gross turnover from "
          'Indian digital supplies exceeds two crore rupees (Rs 2 Crore), covering global marketplaces, app stores, '
          'software-as-a-service (SaaS) platforms, and digital streaming subscriptions.',
          'In parallel with the Equalisation Levy, Parliament incorporated digital nexus directly into the Income-tax '
          'Act by enacting the Significant Economic Presence (SEP) provisions under Explanation 2A to Section 9(1)(i). '
          "SEP establishes that a non-resident is deemed to have a 'business connection' in India—and hence taxable "
          'business profits in India—if it crosses either of two statutory thresholds: Threshold 1 '
          '(Transaction-based): Aggregate payments arising from transactions in goods, services, or property with any '
          'person in India exceed two crore rupees (Rs 2 Crore) during the previous year; OR Threshold 2 (User-based): '
          'Systematic and continuous soliciting of business activities or engaging in interaction with three lakh '
          '(300,000) or more users in India.',
          'However, the operational impact of Significant Economic Presence is currently constrained by Section 90(2) '
          'and international tax treaties. Because most existing bilateral DTAAs have not yet incorporated SEP into '
          'their Article 5 definitions of Permanent Establishment, non-resident digital enterprises residing in treaty '
          'partner countries (such as the US, UK, or Singapore) can claim treaty protection under Section 90(2), '
          'avoiding SEP taxation in India as long as they lack a traditional physical PE. Consequently, unilateral SEP '
          'rules primarily impact non-residents operating from non-treaty jurisdictions or entities disqualified from '
          'treaty benefits under the MLI Principal Purpose Test.',
          'The future of international digital taxation is converging toward the OECD/G20 Inclusive Framework on '
          "Two-Pillar Solution. Pillar One reallocates twenty-five percent of the residual profits of the world's "
          'largest multinational enterprises (global turnover exceeding 20 billion euros and profitability above 10%) '
          'to market jurisdictions where consumers are located. In exchange for implementing Pillar One, participating '
          'nations (including India) have committed to repealing unilateral digital services taxes, including the '
          'Equalisation Levy. Until Pillar One multilateral conventions are fully ratified, corporate tax directors '
          'must maintain active digital tracking of user counts, IP addresses, and digital advertising gross receipts '
          "to ensure continuous compliance with India's evolving digital tax architecture."],
  'title': 'Equalisation Levy & Significant Economic Presence (SEP) for Digital Business Models'}]
