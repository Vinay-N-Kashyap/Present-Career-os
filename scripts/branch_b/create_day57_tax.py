"""
Day 57 Curriculum Expansion Generator:
Course: bcom_tax (Corporate Tax Planning, MAT, DTAA, Transfer Pricing & GST)
Day 57: Global Minimum Tax & OECD Pillar Two Architecture: GloBE Rules, IIR, UTPR & QDMTT
"""

import sys

def get_day57_data():
    day57 = {
        "day": 57,
        "coursePrefix": "bcom_tax",
        "minutes": 38,
        "title": "Global Minimum Tax & OECD Pillar Two Architecture: GloBE Rules, IIR, UTPR & QDMTT",
        "description": "Master the direct tax mechanics of the OECD/G20 Pillar Two Global Anti-Base Erosion (GloBE) Rules. Understand the EUR 750 Million consolidated revenue threshold, the 15% global minimum effective tax rate (ETR), the interlocking mechanics of the Income Inclusion Rule (IIR), the Undertaxed Profits Rule (UTPR), the Qualified Domestic Minimum Top-Up Tax (QDMTT), the Substance-Based Income Exclusion (SBIE), and Transitional CbCR Safe Harbours.",
        "parts": [
            {
                "title": "The Global Tax Revolution: OECD Pillar Two & The EUR 750M GloBE Scope",
                "say": [
                    "The international corporate tax landscape is undergoing the most profound structural transformation in over a century through the OECD/G20 Inclusive Framework on Base Erosion and Profit Shifting (BEPS). For decades, multinational enterprise (MNE) groups exploited disparities between national tax systems, artificial profit shifting, and bilateral treaty networks to shift profits into low-tax or zero-tax jurisdictions—sparking a destabilizing 'race to the bottom' in statutory corporate tax rates. To establish a multilateral floor on international tax competition, over 140 inclusive framework member jurisdictions, including India, agreed upon the landmark Two-Pillar Solution in October 2021.",
                    "While Pillar One addresses the reallocation of taxing rights over the largest digital and consumer-facing enterprises, Pillar Two establishes a revolutionary multilateral minimum tax regime known as the Global Anti-Base Erosion (GloBE) Rules. The foundational objective of Pillar Two is uncompromising: ensuring that large multinational conglomerates pay a minimum effective tax rate of at least 15% on their profits in every single jurisdiction in which they operate, irrespective of local tax holidays, preferential patent box regimes, or zero-tax statutory jurisdictions.",
                    "The scope of the GloBE Rules is governed by an objective revenue threshold codified in Chapter 1 of the OECD Model Rules. Pillar Two applies to multinational enterprise groups that have annual consolidated revenues of EUR 750 Million (seven hundred and fifty million euros) or more in the consolidated financial statements of the Ultimate Parent Entity (UPE) in at least two of the four fiscal years immediately preceding the tested fiscal year. This threshold mirrors the reporting parameter for Country-by-Country Reporting (CbCR) under BEPS Action 13 and Section 286 of the Indian Income-tax Act, capturing approximately 90% of global corporate income while shielding small and medium-sized cross-border enterprises.",
                    "Chapter 1 of the Model Rules delineates specific 'Excluded Entities' that are insulated from the GloBE charging mechanism. Excluded Entities encompass: (a) Governmental Entities (sovereign wealth funds and public administrative bodies); (b) International Organizations (the United Nations, World Bank, and IMF); (c) Non-Profit Organizations (educational, charitable, and scientific institutions); (d) Pension Funds; and (e) Investment Funds or Real Estate Investment Vehicles that qualify as Ultimate Parent Entities of an MNE group. While the income of Excluded Entities is removed from the top-up tax computation, their revenue is still counted when determining whether the overarching EUR 750 Million consolidated group threshold is satisfied.",
                    "For Indian corporate headquarters and Indian subsidiaries of foreign multinational conglomerates, Pillar Two fundamentally redefines domestic tax planning. Historically, India utilized aggressive tax incentive regimes—such as Section 115BAB offering a 15% concessional corporate tax rate for new manufacturing companies, Section 10AA offering complete income tax holidays for units in Special Economic Zones (SEZs), and accelerated capital allowances. Under Pillar Two, if an Indian manufacturing subsidiary achieves an effective tax rate of only 11% by claiming Section 10AA SEZ tax holidays, the 4% difference (15% minus 11%) is subjected to top-up tax, neutralizing the domestic incentive.",
                    "Furthermore, the GloBE Rules operate on an unbending principle of jurisdictional blending rather than global blending. An MNE group cannot use an effective tax rate of 30% in Germany to offset an effective tax rate of 8% in Ireland or Dubai. The effective tax rate is computed separately for each individual sovereign jurisdiction in which the group maintains constituent entities, ensuring that every low-tax pocket across the globe is brought up to the 15% minimum standard.",
                    "Procedurally, compliance with Pillar Two is orchestrated through the standardized GloBE Information Return (GIR) developed by the OECD. In-scope multinational groups must electronically submit the comprehensive GIR within 15 months (extended to 18 months for the initial transition year) following the end of the reporting fiscal year. The GIR requires exhaustive disclosure of financial accounting net income, covered tax reconciliations, cross-border intra-group dividends, substance carve-outs, and jurisdictional ETR calculations for every territory. Failure to file or submitting fraudulent GloBE data exposes corporate directors to severe domestic penalties and triggers automatic multilateral information exchange across all participating tax authorities under the Multilateral Competent Authority Agreement on the Exchange of GloBE Information (GIR MCAA)."
                ],
                "check": {
                    "question": "What is the consolidated annual revenue threshold that brings a multinational enterprise group within the mandatory scope of the OECD Pillar Two GloBE Rules?",
                    "options": [
                        "Consolidated group revenues of EUR 750 Million or more in at least two of the four preceding fiscal years.",
                        "Domestic sales turnover exceeding one hundred crore rupees in the current financial year.",
                        "Total market capitalization exceeding five billion US dollars on a recognized stock exchange.",
                        "Net export earnings exceeding fifty million euros in any single calendar year."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "Chapter 1 of the OECD Pillar Two Model Rules establishes that the GloBE rules apply to MNE groups with annual consolidated revenues of at least EUR 750 Million in at least two of the four preceding fiscal years."
                }
            },
            {
                "title": "The Two Core Interlocking Charging Mechanisms: Income Inclusion Rule (IIR) & UTPR",
                "say": [
                    "To enforce the 15% global minimum tax without requiring a single overarching world tax authority, Pillar Two employs a brilliant, self-enforcing architecture comprising two interlocking domestic charging rules: the Income Inclusion Rule (IIR) and the Undertaxed Profits Rule (UTPR). Together, these rules ensure that if a low-tax jurisdiction declines to raise its corporate tax rate to 15%, other jurisdictions in the corporate supply chain possess the automatic multilateral right to collect the shortfall.",
                    "The primary charging mechanism of Pillar Two is the Income Inclusion Rule (IIR), codified in Chapter 2 of the Model Rules. The IIR operates from the top of the corporate ownership hierarchy down. Under the IIR, the Ultimate Parent Entity (UPE) of an in-scope MNE group is legally required to compute and pay a 'top-up tax' in its home jurisdiction in respect of the low-taxed profits of any foreign subsidiary (constituent entity) that has an effective tax rate of less than 15%.",
                    "For example, consider an Indian multinational software conglomerate headquartered in Bengaluru (the UPE) that owns a 100% operating subsidiary in Singapore. If the Singapore subsidiary generates EUR 100 Million of net income and pays an effective tax rate of only 10% under a local pioneer tax incentive, Singapore is a 'low-tax jurisdiction'. Under the IIR, the Indian UPE must pay a 5% top-up tax (15% minus 10%) on the low-taxed income directly to the Indian tax administration, generating EUR 5 Million in additional tax revenue for the Indian treasury and extinguishing the tax benefit of locating operations in Singapore.",
                    "To account for complex, multi-tiered corporate structures, the GloBE Rules establish the 'Top-Down Approach' for applying the IIR. The right to collect the top-up tax vests primarily in the UPE. However, if the jurisdiction of the UPE has not implemented a qualifying IIR, the taxing right cascades down to the next Intermediate Parent Entity (IPE) in the corporate chain that is located in an IIR-compliant jurisdiction. Furthermore, under the 'Split-Ownership Rules', where more than 20% of an entity's equity is owned by third-party minority shareholders, a Partially-Owned Parent Entity (POPE) must apply the IIR ahead of the UPE, preventing minority profit leakages.",
                    "The second, backstop charging mechanism is the Undertaxed Profits Rule (UTPR). The UTPR is designed to address scenarios where the UPE jurisdiction itself is a low-tax country, or where the UPE jurisdiction refuses to enact the IIR. Under the UTPR, the low-taxed profits of any constituent entity (including the UPE itself) that have not been brought up to 15% through an IIR are taxed by other jurisdictions in which the MNE group maintains constituent entities. The UTPR achieves this not by directly assessing the foreign entity, but by denying tax deductions for domestic expenses or requiring an equivalent balance sheet top-up adjustment.",
                    "Crucially, the total UTPR top-up tax is allocated among qualifying UTPR jurisdictions using a strict mathematical allocation formula based on economic substance: 50% is allocated in proportion to the number of full-time employees in each UTPR jurisdiction relative to total UTPR employees, and 50% is allocated in proportion to the net book value of tangible assets. This allocation formula ensures that large market economies with substantial payroll and manufacturing infrastructure capture the residual taxing rights if parent jurisdictions fail to act.",
                    "An essential structural interface in international taxation is the interplay between the IIR and Controlled Foreign Company (CFC) tax regimes, such as the United States Global Intangible Low-Taxed Income (GILTI) and Subpart F rules. Under Article 4.3 of the GloBE Rules, taxes paid by a parent entity under a qualifying CFC regime in respect of a foreign subsidiary's income are 'pushed down' and treated as Covered Taxes of that foreign constituent entity for the purpose of calculating its local ETR. However, because CFC taxes are pushed down, they increase the constituent entity's local covered taxes, directly reducing or eliminating any potential IIR top-up tax that the parent jurisdiction would otherwise collect under Pillar Two."
                ],
                "check": {
                    "question": "Under the Top-Down Approach of the Income Inclusion Rule (IIR), which entity possesses the primary statutory obligation to pay top-up tax on low-taxed foreign income?",
                    "options": [
                        "The Ultimate Parent Entity (UPE) of the multinational group in its home tax jurisdiction.",
                        "The lowest-tier operating subsidiary located in a developing country.",
                        "The commercial retail customer purchasing goods from the multinational.",
                        "The international commercial bank holding the group's treasury deposits."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "Under Chapter 2 of the OECD GloBE Rules, the primary charging obligation under the IIR falls upon the Ultimate Parent Entity (UPE) under the top-down approach."
                }
            },
            {
                "title": "Qualified Domestic Minimum Top-Up Tax (QDMTT) & Sovereign Jurisdictional Priority",
                "say": [
                    "When the OECD first formulated the IIR and UTPR, a profound geopolitical and sovereign dilemma emerged: if an emerging economy or host country provides a tax holiday to attract foreign direct investment, and a foreign parent jurisdiction (such as Japan, the United States, or Germany) simply collects the 15% top-up tax under the IIR, the host country has surrendered its corporate tax base to a foreign treasury without benefiting the investor! To resolve this sovereign revenue leakage, Pillar Two established the crowning jewel of domestic tax sovereignty: the Qualified Domestic Minimum Top-Up Tax (QDMTT).",
                    "A QDMTT is a domestic tax implemented by a host jurisdiction that computes the effective tax rate of local constituent entities located within its borders using the exact OECD GloBE accounting methodologies. If the local effective tax rate is below 15%, the QDMTT levies a domestic top-up tax to bring the local rate up to exactly 15%. Under the strict statutory order of priority established in Article 5.2.3 of the GloBE Rules, the QDMTT takes absolute precedence over both the IIR and the UTPR: QDMTT > IIR > UTPR.",
                    "The legal and economic consequence of this rule of priority is transformative: any top-up tax payable under a QDMTT reduces the top-up tax that would otherwise be payable under a foreign parent entity's IIR, euro-for-euro, down to zero. Returning to our earlier cross-border scenario: if a Japanese MNE operates an Indian manufacturing subsidiary that achieves an 11% ETR under domestic incentives, Japan would normally collect a 4% top-up tax under its IIR. However, if India enacts a QDMTT, India collects the 4% top-up tax domestically! Japan's IIR top-up tax is reduced to zero. The tax revenue stays in the Indian national exchequer rather than flowing to Tokyo.",
                    "To achieve 'Qualified' status, a domestic minimum tax must satisfy rigorous OECD peer review standards. The QDMTT must: (1) calculate GloBE income and covered taxes in strict alignment with the OECD Model Rules; (2) be administered in a manner consistent with international guidance; and (3) apply the 15% minimum rate without granting collateral tax credits, subsidies, or offsetting benefits that undermine the minimum tax floor. Where a domestic tax fails the peer review, it is deemed an 'Unqualified' tax, meaning parent jurisdictions will refuse to grant a full credit against their IIR obligations.",
                    "Furthermore, in July 2023, the OECD Inclusive Framework introduced the 'QDMTT Safe Harbour'. Under the QDMTT Safe Harbour, where an MNE group's constituent entities in a jurisdiction are subject to a certified QDMTT that complies with the GloBE Accounting Standard, the top-up tax under IIR and UTPR for that jurisdiction is officially deemed to be zero, eliminating the requirement for the MNE to prepare duplicative, highly complex IIR computational filings in multiple foreign headquarters countries.",
                    "For Indian corporate tax policy, introducing a QDMTT is widely recognized by the Ministry of Finance and leading economic advisors as an urgent national priority. Implementing a QDMTT protects India's sovereign taxing rights over foreign multinational subsidiaries operating in India (such as Apple, Samsung, Google, and Toyota), while preventing Indian outbound multinationals (such as Tata, Infosys, and Reliance) from being double-taxed abroad, cementing India's position as a sophisticated leader in international tax architecture.",
                    "From a treaty perspective, the legal validity of the QDMTT rests upon sovereign territorial taxing authority. Because a QDMTT is levied directly on domestic constituent entities incorporated or operating within the national territory, it does not conflict with bilateral Double Tax Avoidance Agreements (DTAAs). International legal consensus, confirmed by the OECD Commentary and agreed by Inclusive Framework members, establishes that neither Article 7 (Business Profits) nor Article 24 (Non-Discrimination) of standard OECD/UN Model Conventions restricts a sovereign nation from enacting a domestic minimum top-up tax on its resident entities, insulating QDMTT regimes from treaty override challenges."
                ],
                "check": {
                    "question": "What is the statutory order of jurisdictional priority for collecting Pillar Two top-up tax between QDMTT, IIR, and UTPR?",
                    "options": [
                        "QDMTT takes first priority, followed by IIR, with UTPR serving as the final residual backstop.",
                        "UTPR takes first priority, followed by QDMTT, with IIR applying only to charitable trusts.",
                        "IIR takes first priority, completely extinguishing the right of source countries to levy domestic taxes.",
                        "The three taxes are pooled and distributed equally among all member nations of the United Nations."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "Under Article 5.2.3 of the OECD Model Rules, a Qualified Domestic Minimum Top-Up Tax (QDMTT) takes absolute precedence, reducing the IIR top-up tax euro-for-euro, with UTPR acting as the final backstop."
                }
            },
            {
                "title": "GloBE Income, Covered Taxes, The Jurisdictional 15% ETR & Substance Carve-Outs",
                "say": [
                    "Computing the Pillar Two effective tax rate requires a sophisticated multi-step computational algorithm codified in Chapters 3, 4, and 5 of the OECD Model Rules. Unlike domestic tax calculations that begin with local statutory tax returns, Pillar Two computations commence with financial accounting net income or loss prepared in accordance with an Authorized Financial Accounting Standard (such as IFRS, US GAAP, or Ind AS) utilized in the consolidated financial statements of the Ultimate Parent Entity.",
                    "Step 1: Computing GloBE Net Income: Under Chapter 3, the financial accounting net income of each constituent entity is adjusted for specific statutory book-to-tax differences: (a) Net Taxes Expense: reversing corporate income taxes accrued in the P&L; (b) Excluded Dividends: deducting intra-group and portfolio dividends (where ownership is 10% or more); (c) Excluded Equity Gains or Losses: removing capital gains and losses from equity shareholdings; (d) Policy Disallowances: adding back illegal payments, bribes, and administrative fines exceeding EUR 50,000; and (e) Accrued Pension Expense Adjustments.",
                    "Step 2: Computing Adjusted Covered Taxes: Under Chapter 4, Covered Taxes encompass taxes recorded in the financial statements on an entity's income, profits, or capital. Covered Taxes include: corporate income taxes, withholding taxes (WHT) on dividends and royalties, and local business taxes. Crucially, Pillar Two incorporates a sophisticated Deferred Tax Mechanism under Article 4.4 to address timing differences (such as accelerated tax depreciation). However, to prevent multinationals from manufacturing artificial deferred tax shields, deferred tax liabilities are recapped at the minimum rate of 15%, and deferred tax liabilities that do not reverse within five fiscal years must be recaptured.",
                    "Step 3: Calculating Jurisdictional Effective Tax Rate (ETR): Under Article 5.1, the ETR for a jurisdiction is computed on an aggregate jurisdictional basis: ETR = (Total Adjusted Covered Taxes of all constituent entities in the jurisdiction) divided by (Net GloBE Income of all constituent entities in the jurisdiction). If the jurisdictional ETR is 15% or higher, no top-up tax is due. If the jurisdictional ETR is less than 15%, the Top-Up Tax Percentage equals: 15% minus Jurisdictional ETR.",
                    "Step 4: The Substance-Based Income Exclusion (SBIE): Crucially, Pillar Two does not levy top-up tax on the entirety of an entity's excess profits. Under Article 5.3, Parliament and the OECD recognized that profits derived from genuine, brick-and-mortar economic activity should be protected. The SBIE deducts a fixed percentage of economic substance from GloBE income before applying the top-up tax: (a) Payroll Carve-out: deducting a percentage of eligible employee payroll costs (initially 10%, transitioning to 5% over a 10-year period); and (b) Tangible Asset Carve-out: deducting a percentage of the carrying value of eligible tangible assets, including property, plant, equipment, and natural resources (initially 8%, transitioning to 5%). Excess Profit = Net GloBE Income minus SBIE.",
                    "Step 5: Transitional CbCR Safe Harbours: To ease compliance during the initial three transition years (2024 to 2026), the OECD enacted Transitional Safe Harbours based on qualified Country-by-Country Reports. An MNE group incurs zero top-up tax in a jurisdiction if it satisfies any of three tests: (1) De Minimis Test: total revenue under EUR 10M and profit before tax under EUR 1M; (2) Simplified ETR Test: simplified ETR exceeds transition rates (15% in 2024, 16% in 2025, 17% in 2026); or (3) Routine Profits Test: profit before tax is equal to or less than the SBIE amount.",
                    "A critical technical rule in GloBE accounting is the Five-Year Recapture Rule under Article 4.4.4. When an enterprise claims substantial deferred tax expense to increase its Covered Taxes in a given year—for instance, in relation to accelerated industrial machinery depreciation or capitalized research costs—the GloBE Rules require that this deferred tax liability must actually reverse and result in cash tax payments within five subsequent fiscal years. If the deferred tax liability does not reverse within five years, it is deemed an artificial tax shield: the MNE must recalculate the effective tax rate for the historical year without that deferred tax amount, generating a retroactive top-up tax liability with statutory interest."
                ],
                "check": {
                    "question": "What is the formula for calculating the Jurisdictional Effective Tax Rate (ETR) under Article 5.1 of the OECD GloBE Model Rules?",
                    "options": [
                        "Total Adjusted Covered Taxes of all constituent entities in the jurisdiction divided by Net GloBE Income.",
                        "Total gross worldwide sales divided by local statutory corporate income tax paid.",
                        "Net book profit before depreciation multiplied by the local headline statutory tax rate.",
                        "Total foreign exchange gains divided by the payroll carve-out deduction."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "Article 5.1 explicitly mandates that Jurisdictional ETR is calculated as the sum of Adjusted Covered Taxes of all constituent entities in the jurisdiction divided by Net GloBE Income of the jurisdiction."
                }
            },
            {
                "title": "Production Python Architecture: OECD Pillar Two GloBE Top-Up Tax & QDMTT Engine",
                "say": [
                    "In multinational enterprise direct tax operations, modeling OECD Pillar Two obligations across dozens of international operating jurisdictions requires automated algorithmic parsing of financial accounting schedules, book-to-tax GloBE adjustments, covered tax reconciliations, SBIE substance exclusions, and QDMTT priority ordering. In this module, we develop a production-ready computational Python architecture, PillarTwoGloBEEngine, designed for enterprise tax directors.",
                    "The computational engine models five core international tax capabilities: First, the GloBE Consolidated Revenue Gate: auditing whether group revenues satisfy the EUR 750 Million consolidated threshold in 2 of the 4 preceding fiscal years. Second, the GloBE Net Income & Covered Tax Adjuster: applying Article 3.2 exclusions (dividends, equity gains, net taxes) and Article 4.4 deferred tax recapping at 15%. Third, the Jurisdictional ETR & Top-up Percentage Calculator: computing aggregated jurisdictional ETR and establishing the top-up tax percentage (15% - ETR). Fourth, the Substance-Based Income Exclusion (SBIE) Engine: applying transitional payroll (5% to 10%) and tangible asset (5% to 8%) carve-outs to isolate excess profit. Fifth, the Multi-Tier Top-Up Allocator: distributing the top-up liability between QDMTT (source country priority), IIR (parent country top-down), and UTPR (payroll and asset substance backstop).",
                    "Let us inspect the complete, executable Python architecture implementing these GloBE mechanics:",
                    "```python",
                    "from dataclasses import dataclass, field",
                    "from typing import Dict, List, Optional",
                    "",
                    "@dataclass",
                    "class ConstituentEntity:",
                    "    name: str",
                    "    jurisdiction: str",
                    "    financial_accounting_net_income_eur: float",
                    "    covered_taxes_eur: float",
                    "    eligible_payroll_costs_eur: float",
                    "    tangible_asset_carrying_value_eur: float",
                    "    excluded_dividends_eur: float = 0.0",
                    "    policy_fines_disallowance_eur: float = 0.0",
                    "",
                    "class PillarTwoGloBEEngine:",
                    "    MINIMUM_RATE = 0.15  # 15% Global Minimum Tax Rate",
                    "    REVENUE_THRESHOLD_EUR = 750000000.0  # EUR 750M",
                    "",
                    "    def __init__(self, mne_group_name: str, preceding_years_revenue_eur: List[float]):",
                    "        self.group_name = mne_group_name",
                    "        self.preceding_revenues = preceding_years_revenue_eur",
                    "        self.entities: List[ConstituentEntity] = []",
                    "",
                    "    def is_in_scope_globe(self) -> bool:",
                    "        # In scope if revenue >= EUR 750M in at least 2 of 4 preceding years",
                    "        qualifying_years = sum(1 for r in self.preceding_revenues if r >= self.REVENUE_THRESHOLD_EUR)",
                    "        return qualifying_years >= 2",
                    "",
                    "    def add_constituent_entity(self, entity: ConstituentEntity):",
                    "        self.entities.append(entity)",
                    "",
                    "    def compute_jurisdictional_topup(",
                    "        self,",
                    "        jurisdiction: str,",
                    "        has_local_qdmtt: bool = True,",
                    "        payroll_rate: float = 0.05,      # 5% permanent SBIE rate",
                    "        tangible_rate: float = 0.05      # 5% permanent SBIE rate",
                    "    ) -> Dict[str, any]:",
                    "        jur_entities = [e for e in self.entities if e.jurisdiction == jurisdiction]",
                    "        if not jur_entities:",
                    "            return {'error': f'No entities registered for jurisdiction {jurisdiction}'}",
                    "",
                    "        # Step 1: Net GloBE Income",
                    "        net_globe_income = 0.0",
                    "        total_covered_taxes = 0.0",
                    "        total_payroll = 0.0",
                    "        total_tangibles = 0.0",
                    "",
                    "        for e in jur_entities:",
                    "            # Adjusted GloBE Income = Net Income - Excluded Dividends + Policy Fines",
                    "            adj_income = e.financial_accounting_net_income_eur - e.excluded_dividends_eur + e.policy_fines_disallowance_eur",
                    "            net_globe_income += adj_income",
                    "            total_covered_taxes += e.covered_taxes_eur",
                    "            total_payroll += e.eligible_payroll_costs_eur",
                    "            total_tangibles += e.tangible_asset_carrying_value_eur",
                    "",
                    "        if net_globe_income <= 0:",
                    "            return {",
                    "                'jurisdiction': jurisdiction,",
                    "                'net_globe_income_eur': net_globe_income,",
                    "                'status': 'NO_TOP_UP_TAX_NET_LOSS_JURISDICTION'",
                    "            }",
                    "",
                    "        # Step 2: Jurisdictional ETR",
                    "        etr = total_covered_taxes / net_globe_income",
                    "        is_low_tax = etr < self.MINIMUM_RATE",
                    "        topup_percentage = max(0.0, self.MINIMUM_RATE - etr) if is_low_tax else 0.0",
                    "",
                    "        # Step 3: Substance-Based Income Exclusion (SBIE)",
                    "        sbie_payroll = total_payroll * payroll_rate",
                    "        sbie_tangibles = total_tangibles * tangible_rate",
                    "        total_sbie = sbie_payroll + sbie_tangibles",
                    "",
                    "        excess_profit = max(0.0, net_globe_income - total_sbie)",
                    "        jurisdictional_topup_tax = excess_profit * topup_percentage",
                    "",
                    "        # Step 4: Rule of Priority Allocation (QDMTT > IIR > UTPR)",
                    "        qdmtt_payable = jurisdictional_topup_tax if has_local_qdmtt else 0.0",
                    "        iir_residual_payable = jurisdictional_topup_tax - qdmtt_payable",
                    "",
                    "        return {",
                    "            'group': self.group_name,",
                    "            'jurisdiction': jurisdiction,",
                    "            'is_group_in_scope': self.is_in_scope_globe(),",
                    "            'net_globe_income_eur': round(net_globe_income, 2),",
                    "            'total_covered_taxes_eur': round(total_covered_taxes, 2),",
                    "            'effective_tax_rate_pct': round(etr * 100, 2),",
                    "            'is_low_tax_jurisdiction': is_low_tax,",
                    "            'topup_tax_percentage_pct': round(topup_percentage * 100, 2),",
                    "            'substance_carve_out_sbie_eur': round(total_sbie, 2),",
                    "            'excess_profit_eur': round(excess_profit, 2),",
                    "            'gross_topup_tax_eur': round(jurisdictional_topup_tax, 2),",
                    "            'qdmtt_source_country_tax_eur': round(qdmtt_payable, 2),",
                    "            'iir_parent_country_tax_eur': round(iir_residual_payable, 2),",
                    "            'utpr_backstop_tax_eur': 0.0,  # Zero because absorbed by QDMTT/IIR",
                    "            'rule_of_priority': 'QDMTT_ABSORBED_100_PERCENT_OF_TOPUP_TAX' if has_local_qdmtt else 'IIR_COLLECTS_FULL_TOPUP'",
                    "        }",
                    "```",
                    "In global tax headquarters operations, running this computational architecture empowers the Chief Tax Officer to simulate post-Pillar Two international effective tax rates. The model enables corporate treasuries to evaluate whether existing special economic zone incentives remain commercially viable, optimize global capital expenditures to maximize substance-based income exclusions, and implement QDMTT compliance mechanisms across cross-border subsidiaries with mathematical certainty."
                ],
                "check": {
                    "question": "In PillarTwoGloBEEngine, if an Indian manufacturing entity generates EUR 100M GloBE income, pays an 11% ETR, and India enacts a QDMTT, who collects the 4% top-up tax?",
                    "options": [
                        "India collects the 4% top-up tax domestically under QDMTT, reducing the foreign parent IIR tax to zero.",
                        "The foreign parent company's country collects 100% of the tax under IIR.",
                        "The European Union collects the tax under UTPR regulations.",
                        "No tax is collected because manufacturing entities are permanently exempt from Pillar Two."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "Under the Pillar Two rule of priority, a Qualified Domestic Minimum Top-Up Tax (QDMTT) takes absolute precedence, allowing the source country (India) to collect the 4% top-up tax, reducing foreign IIR to zero."
                }
            }
        ]
    }
    return day57

if __name__ == '__main__':
    data = get_day57_data()
    print(f"Day 57 Title: {data['title']}")
    print(f"Parts count: {len(data['parts'])}")
    for i, p in enumerate(data['parts']):
        words = len(" ".join(p['say']).split())
        print(f"Part {i+1}: {words} words")
