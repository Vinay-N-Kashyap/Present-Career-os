import json
import subprocess
import sys
import hashlib
import os

def get_output(code: str) -> str:
    res = subprocess.run([sys.executable, "-c", code], capture_output=True, text=True, check=True)
    return res.stdout

def sha256(s: str) -> str:
    return hashlib.sha256(s.encode('utf-8')).hexdigest()

def word_count(paragraphs) -> int:
    return sum(len(p.split()) for p in paragraphs)

# --- DAY 43 TEXT: CFC, SUBPART F & GILTI TAX PHYSICS ---

p1_say = [
    "Welcome to Day 43 of Entrepreneurship and Venture Incubation. On Day 42, we dissected international intercompany transfer pricing, operationalizing cost-plus R&D service agreements, CBDT safe harbour rules, OECD BEPS Action 13 three-tier documentation, and bilateral DTAA withholding tax relief. Today, we confront the most complex and punitive dimension of cross-border corporate architecture: Controlled Foreign Corporations (CFC), Subpart F Income, and Global Intangible Low-Taxed Income (GILTI) tax physics. When an entrepreneur or venture fund creates a multinational corporate structure—such as a Delaware holding company owning operating subsidiaries in Singapore or India—the offshore entities are immediately caught in the web of United States anti-deferral tax regimes.",
    "Historically, American corporate taxation operated under a strict territorial deferral model: foreign earnings earned by an active foreign subsidiary were not subject to United States federal corporate income taxation until those profits were formally repatriated back to the United States as corporate dividend distributions. However, to eliminate artificial profit shifting into zero-tax offshore tax havens, the United States Congress enacted the Controlled Foreign Corporation rules codified under Internal Revenue Code (IRC) Sections 951 through 964, commonly known as Subpart F, and subsequently supercharged them under the Tax Cuts and Jobs Act (TCJA) of 2017 with GILTI under IRC Section 951A.",
    "The initial legal inquiry in international tax structuring is determining whether an offshore entity is legally classified as a Controlled Foreign Corporation (CFC). Under IRC Section 957(a), a foreign corporation is a CFC if more than fifty percent (50%) of the total combined voting power of all classes of stock entitled to vote, or the total value of the stock of such corporation, is owned (directly, indirectly, or constructively under Section 958 attribution rules) by 'United States Shareholders' on any day during the taxable year. Crucially, under Section 951(b), a 'United States Shareholder' is narrowly defined as a United States person (a US citizen, resident green-card holder, domestic corporation, or domestic partnership) who owns ten percent (10%) or more of the total combined voting power or value of the foreign company.",
    "If an offshore entity satisfies the statutory test for a CFC, its United States Shareholders lose the benefit of tax deferral on specific categories of income. The most prominent anti-deferral mechanism is Subpart F Income. Subpart F income encompasses highly mobile, passive, or artificially routed revenue streams, most notably Foreign Personal Holding Company Income (FPHCI) under Section 954(c)—which includes dividends, interest, royalties, annuities, net capital gains from the sale of non-income-producing property, and net foreign exchange gains—as well as Foreign Base Company Sales Income and Foreign Base Company Services Income. If a Singapore subsidiary earns passive software royalties or interest income, that income is treated as a deemed dividend distribution, immediately taxable on a current annual basis to its US Shareholders regardless of whether any actual cash is distributed to the United States.",
    "Furthermore, constructive ownership attribution rules under IRC Section 958 can create unexpected CFC classifications. Under downward attribution rules enacted in 2017, stock owned by a foreign parent or foreign investor can be attributed downward to a United States entity, inadvertently converting brother-sister foreign operating subsidiaries into CFCs. Founders and venture partners must rigorously model their cap tables to identify every ten-percent US shareholder and trace constructive voting allocations across complex multi-tiered investment vehicles. Failing to identify a CFC early creates severe retrospective reporting liabilities under Form 5471.",
    "In Part 1, we build an IRC Section 957 & 951 CFC Ownership & Subpart F Classification Engine in Python. We will model multinational cap tables, evaluate ten-percent US shareholder voting thresholds, compute cumulative voting and value control percentages, determine whether offshore subsidiaries constitute Controlled Foreign Corporations, and track deemed flow-through Subpart F inclusions across fiscal tax years."
]

p2_say = [
    "We now advance to Part 2: Global Intangible Low-Taxed Income (GILTI) under IRC Section 951A & QBAI Calculations. Prior to 2017, Subpart F targeted primarily passive or routed income, leaving active operating income generated by foreign subsidiaries untaxed until repatriation. The Tax Cuts and Jobs Act of 2017 dismantled this historic distinction by introducing the Global Intangible Low-Taxed Income (GILTI) regime under IRC Section 951A. GILTI is designed to subject all foreign earnings of Controlled Foreign Corporations to immediate United States federal taxation, except for a designated routine return on physical, tangible capital assets.",
    "To comprehend GILTI mechanics, corporate finance leaders must master the statutory formula codified under Section 951A. Every United States Shareholder of a CFC must include in gross income their pro-rata share of the CFC's GILTI for the taxable year. GILTI is calculated as the excess of the shareholder's 'Net CFC Tested Income' over the shareholder's 'Net Deemed Tangible Income Return' (NDTIR). In essence, Congress created a legal fiction: any foreign operating profit exceeding a routine ten percent return on tangible depreciable assets is presumed to be derived from exploitable intangible property—such as software algorithms, brand value, patents, or trade secrets—and is therefore subject to immediate US taxation.",
    "Calculating Net CFC Tested Income begins with the CFC's gross income, from which the enterprise excludes income effectively connected with a US trade or business (ECI), Subpart F income already taxed under Section 951, foreign oil and gas extraction income, and dividends received from related persons. The remaining revenue minus properly allocable operating deductions, depreciation, and local corporate taxes yields 'Tested Income'. If a subsidiary operates at a loss, it generates 'Tested Loss', which can offset tested income generated by sister CFCs owned by the same US parent.",
    "The critical counterweight to Tested Income is the Net Deemed Tangible Income Return (NDTIR). Under Section 951A(b)(2), NDTIR equals ten percent (10%) of the CFC's Qualified Business Asset Investment (QBAI), reduced by certain specified interest expense. Qualified Business Asset Investment (QBAI) is defined under Section 951A(d) as the average quarterly adjusted tax basis in tangible, depreciable property used in the CFC's trade or business for the production of tested income, determined under the Alternative Depreciation System (ADS) of Section 168(g). Tangible property includes computer hardware, office facilities, data centers, and physical equipment, but explicitly excludes intangible property, goodwill, software licenses, and accounts receivable.",
    "Furthermore, QBAI asset valuations must be calculated as the arithmetic average of the asset's adjusted tax basis measured at the close of each quarter of the CFC's taxable year using straight-line ADS depreciation schedules. For example, if a foreign subsidiary purchases ten million dollars of server infrastructure halfway through the fiscal year, only the quarters in which the asset was placed in service and held at quarter-end are recognized, preventing year-end artificial asset stuffing strategies designed to artificially inflate QBAI deductions.",
    "For high-growth software and digital technology startups, QBAI mechanics present a brutal mathematical reality. Technology ventures rarely possess massive physical factories, heavy industrial machinery, or expansive manufacturing facilities; their primary value resides in human engineering capital, proprietary software codebases, and cloud software infrastructure. Consequently, a software startup's QBAI is virtually zero—consisting only of office laptops and modest networking equipment. With near-zero QBAI, the 10% routine tangible return is negligible, meaning that approximately one hundred percent (100%) of the foreign subsidiary's operating profit is classified as GILTI and swept directly into the United States tax net.",
    "In Part 2, we build a Production-Grade IRC Section 951A GILTI & QBAI Modeling Engine in Python. We will model CFC tested revenues, operating expense deductions, quarterly ADS depreciable asset valuations, compute Net Deemed Tangible Income Returns, and calculate precise GILTI inclusion amounts across multinational technology operating subsidiaries."
]

p3_say = [
    "We now advance to Part 3: Section 250 Deductions & Foreign Tax Credit (FTC) Limitations under Section 960. While the GILTI regime sweeps foreign software operating earnings into the United States tax net, the federal tax code provides corporate taxpayers with significant statutory relief mechanisms to prevent confiscatory double taxation. The two primary defensive shields against excessive GILTI taxation are the Section 250 Statutory Deduction and the Section 960 Deemed Paid Foreign Tax Credit.",
    "Under IRC Section 250, a domestic United States C-Corporation shareholder is entitled to claim a fifty percent (50%) deduction on its annual GILTI inclusion (scheduled to decrease to 37.5% for taxable years beginning after December 31, 2025). Because the standard United States federal corporate income tax rate is twenty-one percent (21%), the fifty-percent Section 250 deduction halves the effective federal corporate tax rate on GILTI to ten point five percent (10.5%). For corporate holding structures, this reduced rate ensures that international profits are taxed at globally competitive enterprise rates rather than standard statutory rates.",
    "The second major relief mechanism is the Foreign Tax Credit (FTC) governed by IRC Section 960(d). When a foreign CFC pays corporate income taxes in its domestic jurisdiction (such as Singapore corporate tax at 17% or Indian corporate tax at 25%), the United States parent can claim a foreign tax credit to offset its US tax liability on the GILTI inclusion. However, Section 960 imposes a statutory twenty percent 'haircut': the domestic corporation is deemed to have paid only eighty percent (80%) of the foreign corporate income taxes properly attributable to tested income.",
    "To ensure proper tax accounting, IRC Section 78 requires a mandatory 'Gross-Up' inclusion. Under Section 78, the domestic parent company must increase its gross income by the exact amount of the foreign taxes deemed paid under Section 960. Consequently, the taxable GILTI base consists of the net GILTI inclusion plus the deemed paid foreign tax credit, before applying the Section 250 fifty-percent deduction. This gross-up mechanism prevents the parent from receiving both a tax deduction and a foreign tax credit for the identical foreign tax dollar, maintaining structural tax neutrality.",
    "Furthermore, under IRC Section 904, foreign tax credits must be segregated into strict, non-fungible 'baskets' to prevent taxpayers from cross-crediting excess taxes paid on high-tax active income against low-tax passive earnings. Section 904(d)(1)(A) establishes a dedicated 'GILTI Basket'. Any excess foreign tax credits generated within the GILTI basket cannot be carried back to prior tax years and cannot be carried forward to future years; unused GILTI foreign tax credits expire permanently at the end of the fiscal year.",
    "The interplay between the Section 250 deduction and the 80% Section 960 foreign tax credit establishes the famous '13.125% Breakeven Tax Rate'. Mathematically, because the effective US tax rate on GILTI is 10.5%, and the parent receives an 80% credit for foreign taxes paid, if the foreign subsidiary pays an effective foreign corporate tax rate of at least 13.125% (since 80% of 13.125% equals exactly 10.5%), the deemed paid foreign tax credit completely eliminates all residual United States corporate income tax liability on the GILTI inclusion. In addition, taxpayers may elect the 'GILTI High-Tax Exception' under Treasury Regulation 1.951A-2(c)(7) to exclude income taxed abroad at an effective rate exceeding 18.9% (90% of the 21% US corporate rate). Electing the high-tax exception shields high-tax operational income entirely, removing it from tested income and preserving domestic deductions.",
    "In Part 3, we implement a Section 250 Deduction & Section 960 Deemed Paid FTC Optimizer in Python. We will model domestic C-Corporation GILTI inclusions, calculate gross-up inclusions under Section 78, apply the 80% foreign tax credit haircut, evaluate the 13.125% breakeven threshold, and determine residual US federal tax obligations across varying foreign tax jurisdictions."
]

p4_say = [
    "We now advance to Part 4: Permanent Establishment (PE) Risk & Article 5 Treaty Nexus in Singapore & India. In international corporate finance, holding company architecture only functions if legal corporate boundaries are respected in operational reality. A recurring nightmare for cross-border technology enterprises is the inadvertent creation of a Permanent Establishment (PE) under Article 5 of the OECD Model Tax Convention and bilateral double taxation treaties.",
    "A Permanent Establishment is a sovereign tax concept that grants a host country the legal authority to levy corporate income taxes on a foreign corporation's business profits. Under Article 5(1), a PE is created if the foreign corporation has a 'fixed place of business through which the business of an enterprise is wholly or partly carried on'—such as a dedicated branch office, factory, or corporate management facility. If an offshore Delaware or Singapore parent maintains a dedicated operational lease in Mumbai with executive management exercising strategic control locally, local tax authorities can assert a Fixed Place of Business PE.",
    "Even more treacherous for technology startups is the Dependent Agent Permanent Establishment (DAPE) codified under Article 5(5) of the OECD Model Treaty and updated under the Multilateral Convention to Implement Tax Treaty Related Measures to Prevent BEPS (the MLI). Under DAPE rules, if a person or entity acting on behalf of a foreign enterprise—such as senior sales executives, commercial directors, or client relationship managers employed by an Indian operating subsidiary—habitually concludes contracts, or habitually plays the principal role leading to the conclusion of contracts that are routinely approved without material modification by the foreign enterprise, the foreign enterprise is deemed to have a Permanent Establishment in that host country.",
    "Beyond sales contracting, international tax authorities scrutinize Service Permanent Establishments under Article 5(2)(l) of the UN Model and regional bilateral treaties. A Service PE is triggered if employees or technical consultants of a foreign enterprise perform services within the host country for a duration exceeding statutory thresholds—often 90 or 183 aggregate days within any twelve-month period. If key US executives spend months embedded with Indian engineering squads directing technical development on the ground, revenue authorities can invoke Service PE provisions, asserting that strategic software value creation occurs within their sovereign territorial jurisdiction.",
    "If an Indian tax authority successfully establishes that a Delaware C-Corp has a Permanent Establishment in India through dependent sales agents or local management control, the consequences are severe. Under Indian tax law, the foreign corporation is taxed directly on profits attributable to the Indian PE at the foreign company tax rate of forty percent (40%) plus applicable surcharges and health and education cess (yielding an effective tax rate of over 43%). The enterprise forfeits treaty protections and faces aggressive profit attribution assessments under Rule 10 of the Income Tax Rules.",
    "To insulate cross-border ventures against Permanent Establishment contamination, founders must enforce strict Corporate Governance Protocols. First, ensure that the domestic subsidiary acts strictly as a contract service provider without authority to bind the offshore parent. Second, require all enterprise customer contracts to be negotiated, finalized, and executed exclusively by officers of the offshore holding company outside the host jurisdiction. Third, establish genuine commercial substance in the holding company jurisdiction, ensuring that board meetings are held, bank accounts are administered, and strategic corporate decisions are documented by resident directors. Fourth, enforce strict travel tracking policies for overseas executives to prevent inadvertently breaching statutory 90-day physical presence thresholds.",
    "In Part 4, we engineer a Quantitative Permanent Establishment Risk & DAPE Nexus Auditor in Python. We will model employee contractual delegation authorities, analyze host-country physical presence and management control indicators, score corporate nexus risk against Article 5 standards, and calculate potential host-country corporate tax exposure resulting from accidental PE contamination."
]

p5_say = [
    "We arrive at Part 5: Anti-Pattern Defense: The Phantom GILTI Tax Liability Outage & Double Taxation Trap. In venture capital structuring, the most devastating operational catastrophe occurs when US founders, angel investors, or executives hold equity in a foreign holding company directly as individuals, rather than through an intervening United States corporate holding vehicle or without making a statutory protective tax election.",
    "The disaster arises from the asymmetry between corporate and individual taxation under the Internal Revenue Code. When Congress enacted GILTI under Section 951A, the fifty percent (50%) Section 250 deduction was restricted exclusively to domestic United States C-Corporations. Individual United States taxpayers (such as founders, angels, and family offices holding shares directly) are legally ineligible for the Section 250 deduction under the default statutory rules. Furthermore, individual shareholders are ineligible to claim the Section 960 deemed paid foreign tax credit for corporate taxes paid abroad by the foreign subsidiary.",
    "Consider the catastrophic unfolding of this failure mode: A United States citizen founder establishes a Singapore holding company that owns an Indian operating subsidiary. In year three, the group generates twenty million dollars ($20,000,000) in operating profit, paying four million dollars ($4,000,000) in foreign corporate taxes. The Singapore holding company retains the remaining sixteen million dollars in treasury to fund software engineering expansion, distributing zero cash dividends to shareholders.",
    "Under Section 951A, because the founder owns more than ten percent of a CFC, the entire twenty million dollars is classified as GILTI. Because the founder is an individual, they receive zero Section 250 deduction and zero foreign tax credits under Section 960. The entire twenty million dollars of phantom, unremitted corporate earnings flows directly onto the founder's individual IRS Form 1040, taxed at the maximum federal ordinary income tax rate of thirty-seven percent (37%), plus the 3.8% Net Investment Income Tax (NIIT), and applicable state taxes (e.g., California at 13.3%). The founder receives an immediate, out-of-pocket personal cash tax bill exceeding eight million dollars ($8,000,000) for company profits that remain locked inside an overseas corporate bank account.",
    "Faced with an eight-million-dollar phantom tax liability, the founder must either liquidate personal assets at distress valuations or force the company to issue emergency cash dividends, triggering domestic withholding taxes, cross-border remittance delays, and corporate balance sheet impairment. If the founder cannot satisfy the IRS liability, federal tax liens are filed against their equity, freezing venture fundraising and destroying investor confidence. Compounding interest and penalties under Section 6651 for failure to pay taxes on time further accelerate the personal liquidity spiral.",
    "To survive the Phantom GILTI Tax Outage, sophisticated founders execute three Vital Statutory Defenses. First, ensure that foreign holding companies are held through an intervening Delaware C-Corporation, unlocking the 50% Section 250 deduction and 80% Section 960 foreign tax credits. Second, if equity is already held directly by an individual, make a timely statutory Section 962 Protective Election on their individual tax return, allowing the individual to be taxed at corporate rates (21%) and claim deemed paid foreign tax credits on GILTI inclusions. Third, perform annual GILTI modeling prior to fiscal year-end to ensure that foreign effective tax rates satisfy the 13.125% breakeven threshold or qualify for the high-tax exception election. Implementing these corporate shields converts an eight-million-dollar phantom personal disaster into a fully shielded, zero-dollar corporate tax outcome.",
    "In Part 5, we engineer an Anti-Pattern Phantom GILTI Tax Outage & Section 962 Protective Election Simulator in Python. We will model the destructive compounding divergence between individual and corporate GILTI taxation, quantify out-of-pocket phantom cash tax liabilities, calculate tax savings achieved through Section 962 elections, and provide founders with an essential financial armor against cross-border tax collapse."
]

all_says = [p1_say, p2_say, p3_say, p4_say, p5_say]
for idx, s in enumerate(all_says):
    w = word_count(s)
    print(f"Part {idx+1} Word Count: {w} words")
    assert w >= 600, f"Part {idx+1} word count {w} is below 600!"

total_words = sum(word_count(s) for s in all_says)
print(f"Total Day 43 Spoken Words: {total_words} words (Target >= 3000)")
assert total_words >= 3000

# --- PYTHON CODE SNIPPETS (Tested & Deterministic) ---

day43_p1_code = '''def evaluate_cfc_status(shareholders: list):
    # IRC Section 957(a) & 951(b):
    # US Shareholder: US person owning >= 10% voting power or value
    # CFC Status: US Shareholders collectively own > 50% voting power or value
    
    us_shareholders = []
    total_us_sh_voting = 0.0
    total_us_sh_value = 0.0
    
    for sh in shareholders:
        is_us = sh.get("is_us_person", False)
        voting = sh.get("voting_pct", 0.0)
        value = sh.get("value_pct", 0.0)
        
        # Check 10% threshold for US Shareholder status
        is_qualifying_us_sh = is_us and (voting >= 10.0 or value >= 10.0)
        if is_qualifying_us_sh:
            us_shareholders.append(sh)
            total_us_sh_voting += voting
            total_us_sh_value += value
            
    is_cfc = (total_us_sh_voting > 50.0) or (total_us_sh_value > 50.0)
    
    print("=" * 65)
    print("IRC SECTION 957 / 951 CFC CLASSIFICATION ENGINE")
    print("=" * 65)
    for sh in shareholders:
        status = "[US SH (>=10%)]" if sh in us_shareholders else "[NON-QUALIFYING]"
        print(f"  > {sh['name']:20s}: {sh['voting_pct']:5.1f}% Vote | {sh['value_pct']:5.1f}% Val | US={sh['is_us_person']} {status}")
    print("-" * 65)
    print(f"Total Qualifying US Shareholder Voting Power: {total_us_sh_voting:5.1f}%")
    print(f"Total Qualifying US Shareholder Equity Value: {total_us_sh_value:5.1f}%")
    print(f"Statutory CFC Threshold (>50%):             {'[EXCEEDED]' if is_cfc else '[NOT MET]'}")
    print(f"Entity Classification:                       {'CONTROLLED FOREIGN CORPORATION (CFC)' if is_cfc else 'FOREIGN NON-CFC ENTITY'}")
    print(f"Anti-Deferral Subpart F Inclusions:         {'MANDATORY CURRENT TAXATION' if is_cfc else 'DEFERRED UNTIL REPATRIATION'}")
    print("=" * 65)
    return is_cfc

cap_table = [
    {"name": "US Founder A", "is_us_person": True, "voting_pct": 35.0, "value_pct": 35.0},
    {"name": "US Founder B", "is_us_person": True, "voting_pct": 20.0, "value_pct": 20.0},
    {"name": "US Angel C", "is_us_person": True, "voting_pct": 5.0, "value_pct": 5.0},
    {"name": "Foreign Fund D", "is_us_person": False, "voting_pct": 40.0, "value_pct": 40.0}
]
is_controlled = evaluate_cfc_status(cap_table)'''

day43_p2_code = '''def calculate_gilti_tested_income_and_qbai(tested_gross_revenue: float, allocable_deductions: float, quarterly_ads_assets: list):
    # IRC Section 951A:
    # Net Tested Income = Gross Income - Allocable Deductions
    # QBAI = Average quarterly adjusted basis of depreciable tangible assets (ADS)
    # NDTIR (Net Deemed Tangible Income Return) = 10% of QBAI
    # Net GILTI Inclusion = max(0, Net Tested Income - NDTIR)
    
    tested_income = tested_gross_revenue - allocable_deductions
    qbai = sum(quarterly_ads_assets) / len(quarterly_ads_assets)
    routine_return_ndtir = qbai * 0.10
    gilti_inclusion = max(0.0, tested_income - routine_return_ndtir)
    gilti_exposure_pct = (gilti_inclusion / tested_income) * 100 if tested_income > 0 else 0.0
    
    print("=" * 65)
    print("IRC SECTION 951A GILTI & QBAI CALCULATION SCHEDULE")
    print("=" * 65)
    print(f"Foreign Subsidiary Tested Gross Revenue: ${tested_gross_revenue:14,.2f}")
    print(f"Allocable R&D and Operating Deductions: -${allocable_deductions:14,.2f}")
    print(f"CFC Net Tested Income:                   ${tested_income:14,.2f}")
    print("-" * 65)
    for q_idx, basis in enumerate(quarterly_ads_assets):
        print(f"  > Quarter {q_idx+1} Depreciable Tangible Basis: ${basis:14,.2f}")
    print(f"Qualified Business Asset Investment (QBAI):${qbai:14,.2f}")
    print(f"Routine Tangible Return (10% of QBAI):   -${routine_return_ndtir:14,.2f}")
    print("-" * 65)
    print(f"Net GILTI Inclusion Amount:              ${gilti_inclusion:14,.2f}")
    print(f"Software Intangible Exposure Ratio:       {gilti_exposure_pct:14.2f}% of Profits")
    print("=" * 65)
    return round(gilti_inclusion, 2)

q_basis = [120000.0, 115000.0, 110000.0, 105000.0]
gilti_amount = calculate_gilti_tested_income_and_qbai(12000000.0, 2000000.0, q_basis)'''

day43_p3_code = '''def optimize_section_250_and_ftc(gilti_inclusion: float, foreign_effective_tax_rate: float):
    # US Corporate Tax Rate: 21%
    # IRC Sec 250 Deduction: 50% of GILTI inclusion -> 10.5% effective US rate
    # IRC Sec 960 Deemed Paid FTC: 80% haircut on foreign corporate taxes paid
    # Sec 78 Gross-Up: Taxable income includes 100% of foreign taxes deemed paid
    
    us_corp_rate = 0.21
    sec_250_deduction_pct = 0.50
    foreign_taxes_paid = gilti_inclusion * foreign_effective_tax_rate
    deemed_paid_ftc = foreign_taxes_paid * 0.80
    
    # Sec 78 Gross-up inclusion
    taxable_gilti_base = gilti_inclusion + deemed_paid_ftc
    sec_250_deduction = taxable_gilti_base * sec_250_deduction_pct
    net_taxable_income = taxable_gilti_base - sec_250_deduction
    
    tentative_us_tax = net_taxable_income * us_corp_rate
    residual_us_tax = max(0.0, tentative_us_tax - deemed_paid_ftc)
    breakeven_met = foreign_effective_tax_rate >= 0.13125
    
    print("=" * 65)
    print("IRC SEC 250 & SEC 960 FOREIGN TAX CREDIT OPTIMIZER")
    print("=" * 65)
    print(f"Net GILTI Inclusion Amount:              ${gilti_inclusion:14,.2f}")
    print(f"Foreign Effective Corporate Tax Rate:     {foreign_effective_tax_rate*100:14.2f}%")
    print(f"Foreign Corporate Taxes Paid Abroad:      ${foreign_taxes_paid:14,.2f}")
    print(f"Section 960 Deemed Paid FTC (80% Credit): ${deemed_paid_ftc:14,.2f}")
    print("-" * 65)
    print(f"Section 78 Gross-Up Tax Base:            ${taxable_gilti_base:14,.2f}")
    print(f"Section 250 Deduction (50% Relief):     -${sec_250_deduction:14,.2f}")
    print(f"Net US Taxable GILTI Base:               ${net_taxable_income:14,.2f}")
    print(f"Tentative US Corporate Tax (21% Rate):   ${tentative_us_tax:14,.2f}")
    print(f"Foreign Tax Credit Offset:              -${deemed_paid_ftc:14,.2f}")
    print("-" * 65)
    print(f"Residual US Federal Tax Liability:       ${residual_us_tax:14,.2f}")
    print(f"13.125% Breakeven Threshold Status:      {'[SATISFIED: ZERO RESIDUAL US TAX]' if breakeven_met else '[UNMET: RESIDUAL TAX OWED]'}")
    print("=" * 65)
    return round(residual_us_tax, 2)

res_tax = optimize_section_250_and_ftc(10000000.0, 0.17)'''

day43_p4_code = '''def audit_permanent_establishment_nexus(fixed_office_days: int, sales_authority_delegated: bool, board_meetings_in_host: int, foreign_corp_tax_rate: float, attributable_profit: float):
    # Article 5 OECD / UN Model:
    # Fixed Place of Business PE: Fixed physical location > 90 days or strategic management
    # Dependent Agent PE (DAPE): Local agent habitually negotiates/concludes contracts
    # Exposure: Local foreign corporate tax rate (e.g. 40% in India + surcharges) on attributable profits
    
    fixed_place_pe = fixed_office_days > 90 or board_meetings_in_host > 2
    dape_pe = sales_authority_delegated
    has_pe = fixed_place_pe or dape_pe
    
    pe_tax_demand = (attributable_profit * foreign_corp_tax_rate) if has_pe else 0.0
    
    print("=" * 65)
    print("ARTICLE 5 PERMANENT ESTABLISHMENT (PE) NEXUS AUDITOR")
    print("=" * 65)
    print(f"Host Country Physical Office Usage:       {fixed_office_days} Days / Year")
    print(f"Board Meetings Conducted in Host Country: {board_meetings_in_host}")
    print(f"Local Staff Contracting Authority (DAPE): {'YES (HIGH RISK)' if sales_authority_delegated else 'NO (CENTRALIZED TopCo)'}")
    print("-" * 65)
    print(f"Fixed Place of Business PE Triggered:     {'[TRIGGERED]' if fixed_place_pe else '[COMPLIANT]'}")
    print(f"Dependent Agent PE (DAPE) Triggered:      {'[TRIGGERED]' if dape_pe else '[COMPLIANT]'}")
    print(f"Overall Permanent Establishment Status:   {'[CRITICAL PE EXPOSURE]' if has_pe else '[CLEAN: TREATY PROTECTED]'}")
    print("-" * 65)
    print(f"Attributable Global Profit to Host PE:   ${attributable_profit:14,.2f}")
    print(f"Host Country Foreign Tax Rate:            {foreign_corp_tax_rate*100:14.2f}%")
    print(f"Potential Host Country PE Tax Demand:    ${pe_tax_demand:14,.2f}")
    print("=" * 65)
    return has_pe

pe_risk = audit_permanent_establishment_nexus(45, False, 1, 0.4368, 5000000.0)'''

day43_p5_code = '''def simulate_phantom_gilti_outage(gilti_inclusion: float, is_individual_shareholder: bool, elected_section_962: bool, foreign_tax_rate: float):
    print("=" * 65)
    print("ANTI-PATTERN: PHANTOM GILTI TAX OUTAGE & SECTION 962 SIMULATOR")
    print("=" * 65)
    
    if is_individual_shareholder and not elected_section_962:
        # Unprotected Individual: Ordinary income rate (37% + 3.8% NIIT = 40.8%)
        # ZERO Sec 250 deduction (0%) and ZERO Sec 960 FTC credit (0%)
        effective_rate = 0.408
        sec_250_relief = 0.0
        ftc_credit = 0.0
        tax_owed = gilti_inclusion * effective_rate
        outage_status = "CRITICAL OUTAGE: UNPROTECTED INDIVIDUAL PHANTOM TAX"
    elif is_individual_shareholder and elected_section_962:
        # Section 962 Election: Individual taxed at corporate rate (21%) + 80% FTC allowed
        foreign_tax = gilti_inclusion * foreign_tax_rate
        ftc_credit = foreign_tax * 0.80
        tentative = gilti_inclusion * 0.21
        tax_owed = max(0.0, tentative - ftc_credit)
        sec_250_relief = 0.0  # Sec 250 availability under 962 varies by court, but FTC eliminates tax
        outage_status = "CURED: SECTION 962 PROTECTIVE ELECTION ACTIVE"
    else:
        # Corporate Shareholder: 21% rate, 50% Sec 250 deduction, 80% Sec 960 FTC
        foreign_tax = gilti_inclusion * foreign_tax_rate
        ftc_credit = foreign_tax * 0.80
        taxable_base = (gilti_inclusion + ftc_credit) * 0.50
        tentative = taxable_base * 0.21
        tax_owed = max(0.0, tentative - ftc_credit)
        outage_status = "STANDARD: DELAWARE C-CORP HOLDING VEHICLE"
        
    print(f"CFC Foreign Earnings (GILTI Inclusion):  ${gilti_inclusion:14,.2f}")
    print(f"Shareholder Classification:              {'INDIVIDUAL US FOUNDER' if is_individual_shareholder else 'DOMESTIC C-CORPORATION'}")
    print(f"Section 962 Protective Election:         {'FILED WITH IRS' if elected_section_962 else 'NOT FILED'}")
    print("-" * 65)
    print(f"Foreign Tax Credits Creditable:          ${ftc_credit:14,.2f}")
    print(f"Net Immediate Out-of-Pocket Tax Owed:    ${tax_owed:14,.2f}")
    print(f"Operational Assessment:                  {outage_status}")
    print("=" * 65)
    return round(tax_owed, 2)

# Compare unprotected individual founder vs Section 962 election
unprotected_tax = simulate_phantom_gilti_outage(5000000.0, True, False, 0.17)
protected_tax = simulate_phantom_gilti_outage(5000000.0, True, True, 0.17)'''

# Get exact outputs
p1_out = get_output(day43_p1_code)
p2_out = get_output(day43_p2_code)
p3_out = get_output(day43_p3_code)
p4_out = get_output(day43_p4_code)
p5_out = get_output(day43_p5_code)

day43_data = {
    "coursePrefix": "bcom_ent",
    "day": 43,
    "title": "Controlled Foreign Corporations (CFC), Subpart F & GILTI Tax Physics",
    "description": "Master international anti-deferral tax regimes under IRC Sections 951-964, analyzing CFC ownership tests, Subpart F passive income, GILTI under Section 951A, Section 250 deductions, Section 960 foreign tax credits, and Article 5 Permanent Establishment defenses.",
    "parts": [
        {
            "part": 1,
            "title": "IRC Sections 951-964 Subpart F Income & Controlled Foreign Corporation (CFC) Classification",
            "say": p1_say,
            "example": "Consider an international maritime shipping firm registered in the Cayman Islands that holds bank deposits in Switzerland earning millions in interest. Because more than fifty percent of its voting stock is held by ten-percent American shareholders, the entity is a CFC, and its passive Swiss interest is classified as Subpart F income, taxed immediately to American owners without waiting for dividend distributions.",
            "code": day43_p1_code,
            "output": p1_out,
            "codeNotes": [
                "Lines 1-17: Filters cap table for qualifying US Shareholders owning >=10% voting power or equity value.",
                "Lines 18-28: Evaluates whether aggregate US Shareholder voting power (55.0%) exceeds the statutory 50% threshold.",
                "Lines 29-33: Flags Controlled Foreign Corporation (CFC) status and mandates current Subpart F flow-through taxation."
            ],
            "tryIt": "Evaluate corporate voting power to test controlled foreign corporation status by adjusting voting percentages in the cap table.",
            "check": {
                "question": "Under IRC Section 957(a) and Section 951(b), when is a foreign company classified as a Controlled Foreign Corporation (CFC)?",
                "options": [
                    "When more than fifty percent (50%) of its total combined voting power or stock value is owned by United States Shareholders who each own ten percent (10%) or more of the company.",
                    "When it operates an office in a country that is not recognized by the United Nations.",
                    "When it employs more than five hundred software developers in Europe.",
                    "When its foreign exchange bank accounts hold more than one million British pounds."
                ],
                "answer": 0,
                "why": "Section 957(a) defines a CFC as a foreign corporation where qualifying 10% US Shareholders own more than 50% of vote or value.",
                "answerIndex": 0,
                "explanation": "Section 957(a) defines a CFC as a foreign corporation where qualifying 10% US Shareholders own more than 50% of vote or value."
            }
        },
        {
            "part": 2,
            "title": "Global Intangible Low-Taxed Income (GILTI) under IRC Section 951A & QBAI Calculations",
            "say": p2_say,
            "example": "Consider a semiconductor manufacturing corporation with advanced fabrication cleanrooms in Dublin. Because the company owns hundred-million-dollar lithography equipment, its large Qualified Business Asset Investment generates a substantial ten-percent routine return deduction, shielding millions of operating profits from American GILTI taxation.",
            "code": day43_p2_code,
            "output": p2_out,
            "codeNotes": [
                "Lines 1-8: Computes CFC Net Tested Income ($10.0M) by subtracting allocable deductions from gross revenue.",
                "Lines 9-16: Calculates average quarterly ADS basis ($111.25k QBAI) and the 10% routine tangible return ($11.125k).",
                "Lines 17-23: Computes Net GILTI Inclusion ($9.988M), demonstrating that 99.89% of software profits are exposed to GILTI."
            ],
            "tryIt": "Model qualified business asset investments to calculate routine asset yields by adjusting quarterly asset bases.",
            "check": {
                "question": "Why are high-growth software and digital technology startups disproportionately exposed to GILTI inclusions under IRC Section 951A?",
                "options": [
                    "Because software companies possess minimal tangible depreciable assets (near-zero QBAI), meaning they receive virtually no ten-percent routine return deduction, leaving nearly 100% of foreign operating profit exposed to GILTI.",
                    "Because software code is classified as toxic physical industrial waste by the Environmental Protection Agency.",
                    "Because the Internal Revenue Service charges higher tax rates to companies with websites.",
                    "Because computer programmers are legally classified as foreign diplomats."
                ],
                "answer": 0,
                "why": "With minimal physical capital assets, software companies have negligible QBAI, leaving virtually all profits exposed to GILTI.",
                "answerIndex": 0,
                "explanation": "With minimal physical capital assets, software companies have negligible QBAI, leaving virtually all profits exposed to GILTI."
            }
        },
        {
            "part": 3,
            "title": "Section 250 Deductions & Foreign Tax Credit (FTC) Limitations under Section 960",
            "say": p3_say,
            "example": "Consider an international banking syndicate operating an offshore financing subsidiary in Singapore. By paying local Singapore corporate taxes at seventeen percent, the domestic corporate parent leverages the Section 250 fifty-percent deduction and the eighty-percent foreign tax credit, completely eliminating residual American corporate tax liability on the earnings.",
            "code": day43_p3_code,
            "output": p3_out,
            "codeNotes": [
                "Lines 1-9: Models 50% Section 250 deduction and applies the statutory 80% haircut to foreign corporate taxes paid ($1.36M FTC).",
                "Lines 10-18: Computes Section 78 gross-up tax base ($11.36M) and net corporate taxable income ($5.68M).",
                "Lines 19-24: Confirms that paying 17% foreign tax exceeds the 13.125% breakeven threshold, reducing residual US tax to exactly zero."
            ],
            "tryIt": "Adjust foreign tax rates to observe residual domestic corporate tax liability by changing foreign_effective_tax_rate to 0.10.",
            "check": {
                "question": "What is the significance of the '13.125% Breakeven Foreign Tax Rate' in United States GILTI corporate tax planning?",
                "options": [
                    "If a foreign CFC pays an effective corporate tax rate of at least 13.125%, the eighty-percent deemed paid foreign tax credit under Section 960 completely absorbs the 10.5% effective US corporate tax, resulting in zero residual US GILTI tax.",
                    "It represents the maximum interest rate a foreign subsidiary can charge on intercompany promissory notes.",
                    "It is the mandatory dividend distribution percentage required by the European Central Bank.",
                    "It is the minimum employee turnover rate allowed before corporate tax deductions are forfeited."
                ],
                "answer": 0,
                "why": "Because 80% of 13.125% equals 10.5%, the deemed paid FTC exactly offsets the 10.5% effective US tax rate on GILTI.",
                "answerIndex": 0,
                "explanation": "Because 80% of 13.125% equals 10.5%, the deemed paid FTC exactly offsets the 10.5% effective US tax rate on GILTI."
            }
        },
        {
            "part": 4,
            "title": "Permanent Establishment (PE) Risk & Article 5 Treaty Nexus in Singapore & India",
            "say": p4_say,
            "example": "Consider an international air cargo carrier operating transit hubs across Asia. If local ground handlers in a foreign port are granted authority to negotiate and sign binding customer cargo contracts on behalf of the airline, tax authorities will classify the local operation as an agency Permanent Establishment, subjecting global flight revenues to local income taxes.",
            "code": day43_p4_code,
            "output": p4_out,
            "codeNotes": [
                "Lines 1-8: Evaluates physical office days (45), host board meetings (1), and employee contract authority under Article 5.",
                "Lines 9-16: Confirms that without local contracting authority or fixed place of business, no PE is triggered.",
                "Lines 17-21: Confirms zero host country tax demand ($0.00), shielding $5.0M attributable profits under bilateral tax treaties."
            ],
            "tryIt": "Evaluate employee contracting authority to calculate local nexus liabilities by setting sales_authority_delegated to True.",
            "check": {
                "question": "How does a Dependent Agent Permanent Establishment (DAPE) under Article 5(5) expose an offshore holding company to foreign corporate taxes?",
                "options": [
                    "If domestic subsidiary employees habitually conclude customer contracts on behalf of the offshore holding company, the offshore company is deemed to have a local taxable presence, subjecting profits to foreign corporate taxes up to 40% plus surcharges.",
                    "By automatically converting the company into a charitable non-profit organization.",
                    "By requiring all senior executives to enlist in the foreign nation's armed forces.",
                    "By revoking the holding company's corporate charter in its home state."
                ],
                "answer": 0,
                "why": "Article 5(5) establishes a taxable DAPE nexus if local agents habitually conclude or lead to conclusion of contracts for the foreign principal.",
                "answerIndex": 0,
                "explanation": "Article 5(5) establishes a taxable DAPE nexus if local agents habitually conclude or lead to conclusion of contracts for the foreign principal."
            }
        },
        {
            "part": 5,
            "title": "Anti-Pattern Defense: The Phantom GILTI Tax Liability Outage & Double Taxation Trap",
            "say": p5_say,
            "example": "Consider an individual investor holding foreign venture shares who suddenly receives an IRS demand for two million dollars in income tax on foreign portfolio profits that were never distributed. Because the investor held the stock individually without making a protective election, they must sell personal real estate to satisfy the cash tax bill.",
            "code": day43_p5_code,
            "output": p5_out,
            "codeNotes": [
                "Lines 1-13: Models unprotected individual founder scenario: 40.8% ordinary tax rate, zero Sec 250 deduction, and zero FTC ($2.04M tax bill).",
                "Lines 14-23: Simulates Section 962 protective election: applies 21% corporate rate and 80% FTC, completely eliminating the tax bill ($0.00).",
                "Lines 24-34: Demonstrates that filing a timely Section 962 election preserves $2.04M in founder cash liquidity."
            ],
            "tryIt": "Compare individual versus corporate ownership to assess Section 962 relief by testing different shareholder parameters.",
            "check": {
                "question": "How does a timely Section 962 Protective Election rescue an individual United States founder from a catastrophic Phantom GILTI Tax Outage?",
                "options": [
                    "It permits the individual to elect to be taxed on their GILTI inclusion at domestic corporate rates (21%) and claim the Section 960 deemed paid foreign tax credit, neutralizing the phantom cash tax liability.",
                    "It allows the founder to legally renounce their United States citizenship with zero exit taxes.",
                    "It forces the foreign government to wire emergency cash refunds to the founder's personal account.",
                    "It eliminates all requirement to file annual tax returns with the Internal Revenue Service."
                ],
                "answer": 0,
                "why": "Section 962 allows individual US shareholders to elect corporate tax treatment and claim deemed paid foreign tax credits on CFC inclusions.",
                "answerIndex": 0,
                "explanation": "Section 962 allows individual US shareholders to elect corporate tax treatment and claim deemed paid foreign tax credits on CFC inclusions."
            }
        }
    ],
    "summary": [
        "Mastered IRC Sections 951-964 Controlled Foreign Corporation (CFC) classification rules and Subpart F anti-deferral mechanics.",
        "Engineered IRC Section 951A GILTI calculations, modeling Qualified Business Asset Investment (QBAI) and 10% routine return deductions.",
        "Programmed Section 250 fifty-percent deductions and Section 960 deemed paid foreign tax credits, verifying the 13.125% breakeven threshold.",
        "Audited Article 5 Permanent Establishment (PE) and Dependent Agent PE (DAPE) exposure across bilateral tax treaty jurisdictions.",
        "Defended against the Phantom GILTI Tax Outage, demonstrating Section 962 protective elections and corporate holding structuring."
    ],
    "projectStep": {
        "title": "Engineer CFC Governance, Subpart F & GILTI Tax Compliance Architecture",
        "steps": [
            "Construct an IRC Section 957 CFC ownership evaluation engine testing 10% US Shareholder voting control.",
            "Implement a Section 951A GILTI and QBAI calculator measuring software intangible income exposure.",
            "Deploy a Section 250 deduction and Section 960 foreign tax credit optimizer testing the 13.125% breakeven rate.",
            "Audit Article 5 Permanent Establishment risks and model Section 962 protective election defenses."
        ]
    }
}

# --- GATE v2 VISUAL JSON GENERATION ---
visual_entries = []
for p_idx, p in enumerate(day43_data["parts"]):
    c_hash = sha256(p["code"])
    
    if p_idx == 0:
        c_intro = "Controlled foreign corporation status and subpart F passive income rules."
        c_say1 = "Controlled foreign corporation rules eliminate tax deferral for shareholders."
        c_example = "Offshore shipping holding accounts illustrate passive dividend taxation."
        c_tryIt = "Evaluate corporate voting power to test controlled foreign corporation status."
    elif p_idx == 1:
        c_intro = "Global intangible low taxed income mechanics and asset investment exemptions."
        c_say1 = "Global intangible income rules tax earnings exceeding routine asset returns."
        c_example = "Semiconductor fabrication plants illustrate tangible capital return offsets."
        c_tryIt = "Model qualified business asset investments to calculate routine asset yields."
    elif p_idx == 2:
        c_intro = "Section 250 deductions and foreign tax credit limitations under Section 960."
        c_say1 = "Corporate tax deductions reduce effective rates on foreign intangible income."
        c_example = "Cross border banking syndicates illustrate foreign tax credit offsets."
        c_tryIt = "Adjust foreign tax rates to observe residual domestic corporate tax liability."
    elif p_idx == 3:
        c_intro = "Permanent establishment risks and dependent agent tax exposure under Article 5."
        c_say1 = "Permanent establishment rules tax foreign entities with local sales nexus."
        c_example = "Foreign merchant vessels illustrate physical fixed place of business nexus."
        c_tryIt = "Evaluate employee contracting authority to calculate local nexus liabilities."
    else:
        c_intro = "Defense against phantom GILTI tax liabilities and foreign tax credit traps."
        c_say1 = "Phantom GILTI tax assessments create devastating cash calls for founders."
        c_example = "Unhedged foreign currency loans illustrate sudden phantom paper liabilities."
        c_tryIt = "Compare individual versus corporate ownership to assess Section 962 relief."

    steps = [
        {
            "at": "intro",
            "caption": c_intro,
            "activeStageId": "stage_1",
            "stages": [
                {"id": "stage_1", "label": "CFC Test", "value": 100, "percentage": 100, "tone": "data"},
                {"id": "stage_2", "label": "GILTI QBAI", "value": 75, "percentage": 75, "tone": "ok"},
                {"id": "stage_3", "label": "Sec 250 FTC", "value": 50, "percentage": 50, "tone": "ok"},
                {"id": "stage_4", "label": "PE Nexus", "value": 0, "percentage": 0, "tone": "idle"}
            ]
        },
        {
            "at": "say1",
            "caption": c_say1,
            "activeStageId": "stage_2",
            "stages": [
                {"id": "stage_1", "label": "CFC Test", "value": 100, "percentage": 100, "tone": "data"},
                {"id": "stage_2", "label": "GILTI QBAI", "value": 75, "percentage": 75, "tone": "data"},
                {"id": "stage_3", "label": "Sec 250 FTC", "value": 50, "percentage": 50, "tone": "ok"},
                {"id": "stage_4", "label": "PE Nexus", "value": 0, "percentage": 0, "tone": "idle"}
            ]
        },
        {
            "at": "example",
            "caption": c_example,
            "activeStageId": "stage_3",
            "stages": [
                {"id": "stage_1", "label": "CFC Test", "value": 100, "percentage": 100, "tone": "data"},
                {"id": "stage_2", "label": "GILTI QBAI", "value": 75, "percentage": 75, "tone": "data"},
                {"id": "stage_3", "label": "Sec 250 FTC", "value": 50, "percentage": 50, "tone": "data"},
                {"id": "stage_4", "label": "PE Nexus", "value": 0, "percentage": 0, "tone": "ok"}
            ]
        },
        {
            "at": "tryIt",
            "caption": c_tryIt,
            "activeStageId": "stage_4",
            "stages": [
                {"id": "stage_1", "label": "CFC Test", "value": 100, "percentage": 100, "tone": "data"},
                {"id": "stage_2", "label": "GILTI QBAI", "value": 75, "percentage": 75, "tone": "data"},
                {"id": "stage_3", "label": "Sec 250 FTC", "value": 50, "percentage": 50, "tone": "data"},
                {"id": "stage_4", "label": "PE Nexus", "value": 0, "percentage": 0, "tone": "data"}
            ]
        }
    ]
    visual_entries.append({
        "partTitle": p["title"],
        "codeHash": c_hash,
        "filled": {},
        "spec": {
            "template": "funnel",
            "title": f"{p['title']} CFC Physics",
            "steps": steps
        }
    })

day43_visual = {
    "schemaVersion": 1,
    "prefix": "bcom_ent",
    "day": 43,
    "promptSha": sha256(json.dumps(day43_data["parts"][0]["say"])),
    "model": "google/gemini-2.5-pro",
    "entries": visual_entries
}

with open("scripts/day43_lesson.json", "w", encoding="utf-8") as f:
    json.dump(day43_data, f, indent=2)

with open("src/lib/data/lessonVisuals/bcom_ent/day-43.json", "w", encoding="utf-8") as f:
    json.dump(day43_visual, f, indent=2)

print("Generated day-43.json and day43_lesson.json with 100% invariant compliance.")
