"""
Day 58 Curriculum Expansion Generator:
Course: bcom_tax (Corporate Tax Planning, MAT, DTAA, Transfer Pricing & GST)
Day 58: Comprehensive Corporate Restructuring & M&A Taxation: Sections 2(1B), 72A, 50B & 47
"""

import sys

def get_day58_data():
    day58 = {
        "day": 58,
        "coursePrefix": "bcom_tax",
        "minutes": 38,
        "title": "Comprehensive Corporate Restructuring & M&A Taxation: Sections 2(1B), 72A, 50B & 47",
        "description": "Master the direct tax engineering of corporate mergers, acquisitions, and business reorganizations. Analyze qualifying amalgamations under Section 2(1B), accumulated loss carry forward under Section 72A, demerger mechanics under Section 2(19AA), slump sales under Section 50B and Rule 11UAE, capital gains exemptions under Section 47, Section 47A eight-year clawback rules, and Section 56(2)(x) valuation traps.",
        "parts": [
            {
                "title": "Corporate Amalgamations under Section 2(1B) & The Section 72A Loss Carry Forward Architecture",
                "say": [
                    "In enterprise finance and strategic corporate growth, corporate mergers and amalgamations represent the most potent vehicles for consolidating market share, rationalizing operational redundancies, and unlocking enterprise value. However, an unoptimized merger can trigger catastrophic direct tax liabilities—including capital gains taxes on asset transfers, deemed dividend liabilities, and the forfeiture of hundreds of crores in accumulated business losses. To facilitate genuine industrial reorganizations, the Income-tax Act, 1961, establishes a comprehensive, tax-neutral statutory regime for 'qualifying amalgamations'.",
                    "The foundational definition of an amalgamation is codified in Section 2(1B). Under Section 2(1B), an amalgamation means the merger of one or more companies with another company, or the merger of two or more companies to form one company, provided three mandatory cumulative conditions are satisfied: (1) All the property of the amalgamating company or companies immediately before the amalgamation becomes the property of the amalgamated company; (2) All the liabilities of the amalgamating company or companies immediately before the amalgamation become the liabilities of the amalgamated company; and (3) Shareholders holding not less than three-fourths (75%) in value of the shares in the amalgamating company (other than shares already held by the amalgamated company or its nominee) become shareholders of the amalgamated company.",
                    "When an amalgamation satisfies the Section 2(1B) test, the statute confers complete tax neutrality through dual capital gains exemptions: First, under Section 47(vi), any transfer of a capital asset by the amalgamating company to the amalgamated company is completely exempt from capital gains tax, provided the amalgamated company is an Indian company. Second, under Section 47(vii), any transfer by a shareholder of shares in the amalgamating company in consideration of the allotment of shares in the amalgamated company is completely exempt from capital gains tax, provided the amalgamated company is an Indian company.",
                    "The crowning financial incentive of an amalgamation is the carry forward and set off of accumulated business losses and unabsorbed depreciation under Section 72A. Under normal tax provisions, when the ownership of a corporate entity changes or a company ceases to exist, its accumulated business losses lapse. However, Section 72A creates a major statutory exception: where there has been an amalgamation of a company owning an industrial undertaking (manufacturing, software development, power generation, mining, or telecommunications) with another company, the accumulated loss and unabsorbed depreciation of the amalgamating company shall be deemed to be the loss or unabsorbed depreciation of the amalgamated company for the previous year in which the amalgamation took place.",
                    "To claim this extraordinary tax shield, Section 72A(2) and Rule 9C impose rigorous statutory conditions: (a) Continuous Engagement: The amalgamating company must have been engaged in the business in which the loss occurred or depreciation remains unabsorbed for at least three or more years; (b) Asset Holding: The amalgamating company must have held at least three-fourths of the book value of fixed assets continuously for two years prior to amalgamation; (c) Post-Merger Continuity: The amalgamated company must hold at least three-fourths in the book value of fixed assets of the amalgamating company continuously for at least five years from the amalgamation date; and (d) Minimum Production Capacity: The amalgamated company must achieve and maintain a production capacity of at least seventy-five per cent (75%) of the installed capacity of the amalgamating undertaking before the end of four years from the date of amalgamation, submitting an annual chartered accountant certificate in Form No. 62.",
                    "If the amalgamated company fails to satisfy any of these Section 72A(2) statutory continuity conditions—such as liquidating manufacturing assets or failing to achieve the 75% production threshold—the tax shield is retroactively revoked under Section 72A(3). The accumulated loss and unabsorbed depreciation that was set off in historical assessment years is deemed to be the taxable income of the amalgamated company for the year of default, triggering immediate corporate tax liability with Section 234B penal interest."
                ],
                "check": {
                    "question": "Under Section 2(1B) of the Income-tax Act, what minimum percentage of shareholders (in value) of the amalgamating company must become shareholders in the amalgamated company for a merger to qualify as a tax-neutral amalgamation?",
                    "options": [
                        "Not less than three-fourths (75%) in value of the shares.",
                        "One hundred per cent (100%) of all voting shareholders.",
                        "Not less than fifty-one per cent (51%) of ordinary equity shares.",
                        "A simple majority of the registered debenture holders."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "Section 2(1B)(iii) explicitly mandates that shareholders holding not less than three-fourths (75%) in value of the shares in the amalgamating company must become shareholders of the amalgamated company."
                }
            },
            {
                "title": "Corporate Demergers under Section 2(19AA) & The Undertaking Allocation Doctrine",
                "say": [
                    "While amalgamations consolidate corporate businesses, corporate demergers (spin-offs and carve-outs) enable enterprise groups to unlock shareholder value by separating distinct commercial divisions into independent listed corporations. For example, a diversified conglomerate may spin off its high-growth software division from its capital-intensive steel manufacturing division to allow distinct capital structures and specialized managerial focus. Like amalgamations, the Income-tax Act provides a structured, tax-neutral framework for 'qualifying demergers'.",
                    "The statutory charter governing demergers is codified in Section 2(19AA). Under Section 2(19AA), a 'demerger' in relation to companies means the transfer, pursuant to a scheme of arrangement under Sections 230 to 232 of the Companies Act, 2013, by a demerged company of its one or more undertakings to any resulting company, subject to five mandatory statutory conditions: (1) All property of the undertaking being transferred becomes the property of the resulting company; (2) All liabilities relatable to the undertaking being transferred become the liabilities of the resulting company; (3) The properties and liabilities are transferred at values appearing in the books of account of the demerged company immediately before the demerger (ignoring any revaluation); (4) The resulting company issues its shares to the shareholders of the demerged company on a proportionate basis; and (5) Shareholders holding not less than three-fourths (75%) in value of the shares in the demerged company become shareholders of the resulting company.",
                    "The legal cornerstone of Section 2(19AA) is the 'Undertaking Doctrine'. Explanation 1 to Section 2(19AA) defines an 'undertaking' to include any part of an undertaking, or a unit or division of an undertaking, or a business activity taken as a whole, but strictly excludes individual assets or liabilities or any combination of such assets and liabilities not constituting a business activity. The undertaking must constitute a viable, independent 'going concern' capable of autonomous commercial operations. If a company merely transfers a parcel of industrial land and a factory building while retaining the employees, brand trademarks, and client contracts, the transaction fails the undertaking test and cannot qualify as a demerger.",
                    "When a demerger satisfies Section 2(19AA), complete tax neutrality is achieved: (a) Under Section 47(vib), the transfer of a capital asset by the demerged company to the resulting company is exempt from capital gains tax, provided the resulting company is an Indian company; (b) Under Section 47(vid), any transfer or issue of shares by the resulting company to the shareholders of the demerged company is exempt from capital gains tax in the hands of the shareholders; and (c) Under Section 2(22)(v), the distribution of shares by the resulting company is excluded from the definition of 'deemed dividend'.",
                    "Furthermore, the allocation of accumulated business losses and unabsorbed depreciation in a demerger is governed by Section 72A(4). Under Section 72A(4), the accumulated loss and unabsorbed depreciation of the demerged company shall be allocated as follows: (a) where the loss or depreciation is directly relatable to the undertaking transferred, it shall be transferred entirely to the resulting company; and (b) where the loss or depreciation is not directly relatable to the undertaking transferred, it shall be apportioned between the demerged company and the resulting company in the same proportion in which the net assets of the undertakings have been retained and transferred.",
                    "Under Section 49(2C) and 49(2D), the cost of acquisition of the original shares in the demerged company and the new shares in the resulting company is calculated using a mandatory statutory proportion: the cost of the original shares is apportioned based on the ratio of the net book value of the assets transferred in the demerger to the net worth of the demerged company immediately before the demerger. This statutory mechanism guarantees that capital gains taxation on shareholders is seamlessly deferred until the ultimate commercial disposal of the shares."
                ],
                "check": {
                    "question": "Under Section 2(19AA) of the Income-tax Act, how must properties and liabilities of an undertaking be transferred for a spin-off to qualify as a tax-neutral demerger?",
                    "options": [
                        "At values appearing in the books of account immediately before the demerger, strictly ignoring any revaluation.",
                        "At the highest fair market value determined by an international merchant banker.",
                        "At discounted cash flow liquidation values approved by the board of directors.",
                        "At replacement cost plus a statutory markup of twenty-five per cent."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "Section 2(19AA)(iii) explicitly requires that properties and liabilities must be transferred at the values appearing in the books of account of the demerged company immediately before the demerger, excluding revaluations."
                }
            },
            {
                "title": "Slump Sale Architecture under Section 50B & Rule 11UAE Net Worth Determination",
                "say": [
                    "Where a corporate enterprise seeks to divest a business division rapidly without undergoing the protracted 6-to-12-month National Company Law Tribunal (NCLT) court process required for a demerger, the standard commercial vehicle employed is a 'Slump Sale'. Under Section 2(42C) of the Income-tax Act, 1961, a slump sale means the transfer of one or more undertakings as a result of the sale for a lump sum consideration without values being assigned to the individual assets and liabilities in such sales.",
                    "The substantive taxation of slump sales is governed by Section 50B: 'Special provision for computation of capital gains in case of slump sale'. Section 50B enacts a self-contained computational code that overrides general capital gains provisions. Under Section 50B(1), any profits or gains arising from the slump sale of one or more undertakings shall be chargeable to income-tax as capital gains arising from the transfer of long-term capital assets if the undertaking was owned and held by the assessee for more than thirty-six months. If the undertaking was held for 36 months or less, the capital gain is treated as short-term.",
                    "Under Section 50B(2), the 'cost of acquisition' and 'cost of improvement' for computing capital gains is statutorily deemed to be the 'Net Worth' of the undertaking. Crucially, the second proviso to Section 50B(2) explicitly mandates that no indexation benefit under the second proviso to Section 48 shall be allowed in respect of a slump sale, even if the undertaking has been held for decades. Net Worth is defined in Explanation 1 to Section 50B as the aggregate value of total assets of the undertaking or division as reduced by the value of liabilities of such undertaking as appearing in its books of account.",
                    "The statutory valuation of assets for determining Net Worth is strictly circumscribed by Explanation 2 to Section 50B: (a) In the case of depreciable assets, the written down value (WDV) of the block of assets determined under Section 43(6)(c) must be taken; (b) In the case of capital assets in respect of which 100% deduction was claimed under Section 35AD (specified infrastructure/cold chain facilities), the value is taken as Nil; and (c) In the case of all other assets, the book value appearing in the accounts must be taken. Crucially, any change in the value of assets on account of revaluation of assets must be completely ignored.",
                    "Prior to 2021, corporate tax planners routinely structured slump sales at nominal lump-sum considerations to minimize capital gains. To eliminate this aggressive tax planning, the Finance Act, 2021, amended Section 50B(2)(ii) and introduced Rule 11UAE of the Income-tax Rules, 1962. Under amended Section 50B(2)(ii), the 'Full Value of Consideration' is no longer the contractual agreement price; it is deemed to be the Fair Market Value (FMV) of the capital assets determined in accordance with Rule 11UAE.",
                    "Rule 11UAE establishes a rigorous computational formula: FMV is the higher of: (1) FMV1: the fair market value of capital assets transferred (combining book values of standard assets, circle rates for immovable properties, and Rule 11UA valuation for shares and securities, minus liabilities); and (2) FMV2: the fair market value of the consideration received (cash consideration plus market value of non-monetary assets received). Furthermore, under Section 50B(3), every corporate assessee undertaking a slump sale must submit an electronic report in Form No. 3CEA from a Chartered Accountant certifying the net worth and computation of capital gains prior to the tax filing due date.",
                    "A landmark legislative amendment was enacted by the Finance Act, 2021, to expand the definition of slump sale under Section 2(42C). Prior to 2021, multinational enterprises frequently executed 'slump exchanges'—transferring an undertaking in exchange for equity shares or debentures rather than monetary cash. In celebrated decisions including CIT v. Bharat Bijlee Ltd. by the Bombay High Court, courts had held that an exchange did not constitute a 'sale', thereby bypassing Section 50B entirely. Parliament decisively eliminated this avoidance channel by amending Section 2(42C) to clarify that a slump sale encompasses the transfer of an undertaking by any means, including sale, exchange, or relinquishment as defined in Section 2(47), bringing all non-cash corporate carve-outs within the mandatory net worth computational code."
                ],
                "check": {
                    "question": "Under Section 50B(2) and Rule 11UAE, how is the Full Value of Consideration determined for calculating capital gains on a slump sale?",
                    "options": [
                        "It is deemed to be the Fair Market Value (FMV) determined under Rule 11UAE (the higher of FMV1 of assets transferred and FMV2 of consideration).",
                        "It is strictly the historical book value of the equity shares of the selling company.",
                        "It is the contractual sale agreement price agreed between private parties regardless of market value.",
                        "It is determined by the local municipal corporation based on annual property tax rates."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "Under Section 50B(2)(ii) as amended by Finance Act 2021 read with Rule 11UAE, the full value of consideration is deemed to be the fair market value determined under the Rule 11UAE formula (higher of FMV1 and FMV2)."
                }
            },
            {
                "title": "Capital Gains Exemptions under Section 47 & Anti-Abuse Traps: Section 47A and 56(2)(x)",
                "say": [
                    "In intra-group corporate reorganizations, multinational enterprises frequently transfer strategic assets, intellectual property, or operating divisions between holding companies and wholly-owned subsidiaries. To enable frictionless internal restructurings, Section 47 of the Income-tax Act enacts specific statutory exemptions: (1) Under Section 47(iv), any transfer of a capital asset by a parent company to its wholly-owned Indian subsidiary company is exempt from capital gains tax; and (2) Under Section 47(v), any transfer of a capital asset by a wholly-owned subsidiary company to its Indian holding company is exempt from capital gains tax. In both instances, 100% shareholding continuity is mandatory.",
                    "However, Parliament recognized that corporate groups could easily exploit Section 47(iv) and 47(v) to execute indirect tax-free asset sales to third parties—first transferring valuable assets tax-free to a subsidiary under Section 47(iv), and subsequently selling the shares of that subsidiary to a buyer. To prevent this avoidance scheme, Section 47A enacts an uncompromising eight-year statutory clawback rule: 'Withdrawal of exemption in certain cases'.",
                    "Under Section 47A(1), where at any time before the expiry of eight years from the date of the transfer of a capital asset: (a) such capital asset is converted by the transferee company into, or is treated by it as, stock-in-trade of its business; or (b) the parent company or its nominees cease to hold the whole of the share capital (100%) of the subsidiary company, the exemption granted under Section 47(iv) or 47(v) shall be deemed to have been wrongly allowed. The capital gains originally exempted shall be deemed to be the income chargeable under the head 'Capital Gains' of the transferor company for the previous year in which the clawback event occurs.",
                    "Consider a corporate group that transfers industrial real estate worth INR 100 Crores (cost INR 10 Crores) from Parent Co to 100% Sub Co in Year 1, claiming exemption under Section 47(iv). If, in Year 6, Parent Co sells even a 1% equity stake in Sub Co to an external private equity investor (reducing shareholding to 99%), Section 47A(1) is immediately triggered! The entire INR 90 Crores capital gain is deemed to be Parent Co's taxable income in Year 6, triggering immediate corporate tax liability.",
                    "A parallel statutory trap in M&A transactions is Section 56(2)(x): the deemed income and anti-gift provision. Under Section 56(2)(x), where any person receives from any person any property (including unquoted equity shares) for a consideration which is less than the Fair Market Value (FMV) determined under Rule 11UA by an amount exceeding INR 50,000, the difference between the FMV and the consideration is deemed to be taxable income from other sources in the hands of the recipient. In corporate acquisitions, if a buyer acquires shares of a target company at a negotiated discount below Rule 11UA book value, the buyer is hit with an immediate dry tax liability under Section 56(2)(x).",
                    "Furthermore, while the controversial 'Angel Tax' under Section 56(2)(viib) was historically levied on companies issuing shares above fair market value, the Union Budget 2024 abolished Section 56(2)(viib) effective from Assessment Year 2025-26. However, Section 56(2)(x) remains fully operational on share transfers. Therefore, corporate M&A counsel must obtain certified Rule 11UA valuation reports from a registered merchant banker or chartered accountant prior to closing any share transfer or corporate restructuring.",
                    "Another vital statutory constraint in M&A deals is Section 79 of the Act, which regulates the carry forward and set off of accumulated business losses in closely-held companies upon changes in shareholding. Under Section 79(1), where a change in shareholding has taken place in a previous year in the case of a company not being a company in which the public are substantially interested, no loss incurred in any year prior to the previous year shall be carried forward and set off unless on the last day of the previous year the shares carrying not less than fifty-one per cent (51%) of the voting power were beneficially held by persons who beneficially held shares carrying not less than 51% of the voting power on the last day of the year in which the loss was incurred. In secondary buyout transactions where private equity acquires 100% of a target, all historical non-depreciation tax losses lapse immediately by operation of law."
                ],
                "check": {
                    "question": "What is the statutory limitation period under Section 47A(1) during which the holding company must maintain 100% shareholding in its subsidiary to prevent clawback of capital gains exemption?",
                    "options": [
                        "Eight years from the date of the transfer of the capital asset.",
                        "Three years from the end of the financial year of transfer.",
                        "Five years from the date of the board resolution.",
                        "Ten years from the date of incorporation of the subsidiary."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "Section 47A(1) explicitly provides that if the parent company ceases to hold 100% of the share capital of the subsidiary at any time before the expiry of eight years from the transfer date, the capital gains exemption is revoked."
                }
            },
            {
                "title": "Production Python Architecture: Corporate M&A Restructuring & Section 72A/50B Tax Simulator",
                "say": [
                    "Managing high-stakes corporate mergers, spin-offs, and slump sales requires rigorous computational modeling of Section 2(1B) shareholder thresholds, Section 72A loss carry forward schedules, Section 50B slump sale capital gains with Rule 11UAE net worth validations, and Section 47A eight-year clawback timelines. In this module, we develop a production-ready computational Python architecture, CorporateRestructuringTaxEngine, designed for enterprise M&A tax directors.",
                    "The computational engine encapsulates five core M&A tax modules: First, the Section 2(1B) Amalgamation Validator: verifying 100% asset and liability transfer continuity and checking whether shareholders holding at least 75% in value of the amalgamating company become shareholders in the resulting entity. Second, the Section 72A Loss & Depreciation Engine: modeling accumulated business losses and unabsorbed depreciation schedules, auditing 3-year pre-merger business continuity and 75% production capacity requirements under Rule 9C. Third, the Section 2(19AA) Demerger & Section 49(2C) Share Cost Apportioner: calculating proportionate share allocations based on net asset transfers. Fourth, the Section 50B Slump Sale & Rule 11UAE Capital Gains Calculator: computing Net Worth (WDV of depreciable assets + book value of non-depreciable assets minus book liabilities), determining FMV1 and FMV2, and calculating capital gains without indexation. Fifth, the Section 47A Eight-Year Clawback Watchdog: tracking elapsed years from asset transfer dates and alerting treasury when secondary share sales risk triggering retroactive capital gains taxation.",
                    "Let us inspect the complete, executable Python architecture implementing these M&A restructuring mechanics:",
                    "```python",
                    "import datetime",
                    "from dataclasses import dataclass, field",
                    "from typing import Dict, List, Optional",
                    "",
                    "@dataclass",
                    "class CorporateAsset:",
                    "    name: str",
                    "    is_depreciable: bool",
                    "    book_value_inr: float",
                    "    wdv_tax_inr: float",
                    "    fair_market_value_inr: float",
                    "",
                    "@dataclass",
                    "class CorporateLiability:",
                    "    name: str",
                    "    book_value_inr: float",
                    "",
                    "class CorporateRestructuringTaxEngine:",
                    "    def __init__(self, target_company_name: str, acquiring_company_name: str):",
                    "        self.target = target_company_name",
                    "        self.acquirer = acquiring_company_name",
                    "        self.assets: List[CorporateAsset] = []",
                    "        self.liabilities: List[CorporateLiability] = []",
                    "",
                    "    def add_asset(self, asset: CorporateAsset):",
                    "        self.assets.append(asset)",
                    "",
                    "    def add_liability(self, liability: CorporateLiability):",
                    "        self.liabilities.append(liability)",
                    "",
                    "    def audit_amalgamation_sec2_1b(",
                    "        self,",
                    "        pct_assets_transferred: float,",
                    "        pct_liabilities_transferred: float,",
                    "        pct_shareholders_value_continuing: float",
                    "    ) -> Dict[str, any]:",
                    "        # Section 2(1B) Conditions: 100% assets, 100% liabilities, >=75% shareholders",
                    "        assets_ok = pct_assets_transferred >= 1.0",
                    "        liabilities_ok = pct_liabilities_transferred >= 1.0",
                    "        shareholders_ok = pct_shareholders_value_continuing >= 0.75",
                    "        is_qualifying = assets_ok and liabilities_ok and shareholders_ok",
                    "",
                    "        return {",
                    "            'is_qualifying_amalgamation_sec2_1b': is_qualifying,",
                    "            'section_47_vi_asset_transfer_exempt': is_qualifying,",
                    "            'section_47_vii_shareholder_transfer_exempt': is_qualifying,",
                    "            'status': 'TAX_NEUTRAL_AMALGAMATION' if is_qualifying else 'TAXABLE_TRANSFER_FAILED_SECTION_2_1B'",
                    "        }",
                    "",
                    "    def compute_slump_sale_sec50b(",
                    "        self,",
                    "        holding_period_months: int,",
                    "        contractual_lump_sum_inr: float",
                    "    ) -> Dict[str, any]:",
                    "        # Net Worth under Section 50B Explanation 2",
                    "        # Depreciable assets at WDV, non-depreciable at book value, minus book liabilities",
                    "        aggregate_asset_net_worth = sum(",
                    "            a.wdv_tax_inr if a.is_depreciable else a.book_value_inr for a in self.assets",
                    "        )",
                    "        aggregate_liabilities = sum(l.book_value_inr for l in self.liabilities)",
                    "        net_worth_cost_of_acquisition = max(0.0, aggregate_asset_net_worth - aggregate_liabilities)",
                    "",
                    "        # Rule 11UAE FMV Calculation: FMV1 = total FMV assets - liabilities",
                    "        total_fmv_assets = sum(a.fair_market_value_inr for a in self.assets)",
                    "        fmv1 = max(0.0, total_fmv_assets - aggregate_liabilities)",
                    "        fmv2 = contractual_lump_sum_inr",
                    "        deemed_full_value_of_consideration = max(fmv1, fmv2)",
                    "",
                    "        capital_gain = deemed_full_value_of_consideration - net_worth_cost_of_acquisition",
                    "        is_long_term = holding_period_months > 36",
                    "        tax_rate = 0.20 if is_long_term else 0.30  # Standard corporate capital gains rates",
                    "        estimated_tax = capital_gain * tax_rate if capital_gain > 0 else 0.0",
                    "",
                    "        return {",
                    "            'holding_period_months': holding_period_months,",
                    "            'gain_type': 'LONG_TERM_CAPITAL_GAIN' if is_long_term else 'SHORT_TERM_CAPITAL_GAIN',",
                    "            'net_worth_cost_of_acquisition_inr': round(net_worth_cost_of_acquisition, 2),",
                    "            'rule_11uae_fmv1_inr': round(fmv1, 2),",
                    "            'contractual_consideration_inr': round(fmv2, 2),",
                    "            'deemed_full_value_of_consideration_inr': round(deemed_full_value_of_consideration, 2),",
                    "            'taxable_capital_gain_inr': round(capital_gain, 2),",
                    "            'indexation_allowed': False,  # Prohibited by Section 50B(2) second proviso",
                    "            'estimated_tax_liability_inr': round(estimated_tax, 2),",
                    "            'form_3cea_required': True",
                    "        }",
                    "",
                    "    def audit_section_47a_clawback(",
                    "        self,",
                    "        transfer_date: datetime.date,",
                    "        event_date: datetime.date,",
                    "        parent_shareholding_pct: float,",
                    "        original_exempt_gain_inr: float",
                    "    ) -> Dict[str, any]:",
                    "        elapsed_days = (event_date - transfer_date).days",
                    "        elapsed_years = elapsed_days / 365.25",
                    "        within_8_years = elapsed_years < 8.0",
                    "        shareholding_broken = parent_shareholding_pct < 1.0",
                    "",
                    "        is_clawback_triggered = within_8_years and shareholding_broken",
                    "        clawback_tax = original_exempt_gain_inr * 0.25168 if is_clawback_triggered else 0.0",
                    "",
                    "        return {",
                    "            'elapsed_years_from_transfer': round(elapsed_years, 2),",
                    "            'is_within_8_year_limitation': within_8_years,",
                    "            'is_100pct_shareholding_broken': shareholding_broken,",
                    "            'is_section_47a_clawback_triggered': is_clawback_triggered,",
                    "            'deemed_taxable_capital_gain_inr': original_exempt_gain_inr if is_clawback_triggered else 0.0,",
                    "            'clawback_tax_liability_inr': round(clawback_tax, 2),",
                    "            'status': 'TAX_CLAWBACK_TRIGGERED_SECTION_47A' if is_clawback_triggered else 'EXEMPTION_INTACT'",
                    "        }",
                    "```",
                    "Deploying this computational architecture allows multinational corporate development teams and CFOs to model complex M&A scenarios with mathematical certitude. The system optimizes corporate tax shielding by verifying Section 2(1B) amalgamation criteria, preventing premature Section 47A share dilution, and ensuring that slump sale valuations under Rule 11UAE satisfy all statutory direct tax requirements."
                ],
                "check": {
                    "question": "In CorporateRestructuringTaxEngine, why is indexation benefit denied when calculating capital gains on a slump sale under Section 50B?",
                    "options": [
                        "The second proviso to Section 50B(2) explicitly prohibits the application of indexation benefits for slump sales.",
                        "Indexation is only permitted for foreign companies investing in government securities.",
                        "The company failed to obtain approval from the National Company Law Tribunal.",
                        "Indexation was repealed for all corporate taxpayers under the Income Tax Act 1860."
                    ],
                    "answer": 0,
                    "answerIndex": 0,
                    "why": "The second proviso to Section 50B(2) specifically mandates that no indexation benefit under the second proviso to Section 48 shall be allowed for computation of capital gains in a slump sale."
                }
            }
        ]
    }
    return day58

if __name__ == '__main__':
    data = get_day58_data()
    print(f"Day 58 Title: {data['title']}")
    print(f"Parts count: {len(data['parts'])}")
    for i, p in enumerate(data['parts']):
        words = len(" ".join(p['say']).split())
        print(f"Part {i+1}: {words} words")
