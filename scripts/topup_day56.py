import json
import re

def count_words(text):
    return len(re.findall(r'\b[A-Za-z0-9_-]+\b', text))

with open("scripts/bcom_law_day56.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Part 1 Expansion: Add deep analysis of Miheer Mafatlal, Hindustan Lever v State of Maharashtra (stamp duty on schemes), and Section 230(1) locus standi.
p1_addon = """
To appreciate the legal gravity of Section 230, one must analyze the landmark ruling of the Supreme Court of India in Hindustan Lever v State of Maharashtra (2004). The Apex Court settled a long-standing constitutional controversy by declaring that an order passed by the court sanctioning a scheme of arrangement is an 'instrument' arising from the agreement between parties, and is therefore liable to state stamp duty under the relevant Stamp Acts. This judgment dismantled the legal fiction that court-sanctioned schemes are purely judicial acts exempt from fiscal levies. Corporate legal counsel structuring restructuring transactions must factor in state-specific stamp duty implications, which often impose caps or ad valorem rates ranging from 1% to 5% of the value of shares issued or immovable properties transferred.

Furthermore, locus standi under Section 230(1) requires careful examination. An application can be filed by the company itself, any creditor or class of creditors, or any member or class of members. Where the company is in liquidation, the liquidator appointed under the Companies Act or the Insolvency and Bankruptcy Code (IBC) may also submit an application. In recent corporate practice, Section 230 has been utilized as a pre-packaged resolution route or a post-liquidation revival scheme under Regulation 2B of the IBBI (Liquidation Process) Regulations 2016. The Supreme Court in Arun Kumar Jagatramka v Jindal Steel and Power Ltd (2021) categorically held that a person ineligible to submit a resolution plan under Section 29A of the IBC is also disqualified from proposing a scheme of compromise or arrangement under Section 230 of the Companies Act during liquidation proceedings. This harmonized the IBC's anti-defaulting promoter firewall with the general corporate law restructuring provisions.

When drafting the Scheme of Arrangement, corporate legal architects must meticulously articulate the 'Appointed Date' and the 'Effective Date'. The Appointed Date represents the date with effect from which the Scheme is deemed to be operational for accounting and financial consolidation purposes. The Effective Date represents the date on which the certified copy of the NCLT order is registered with the ROC in Form INC-28. The Ministry of Corporate Affairs, via General Circular No. 09/2019, clarified that the Appointed Date can be a specific calendar date or an event-based date tied to the fulfillment of regulatory preconditions, providing substantial commercial structuring flexibility to dealmakers."""

# Part 2 Expansion: Add analysis of minority squeeze-outs under Section 236 vs Section 230, and CCI gun-jumping risks under Competition Act.
p2_addon = """
In addition to the dual-majority arithmetic, transaction counsel must navigate the delicate equilibrium between Section 230 schemes and minority squeeze-out mechanisms under Section 236 of the Companies Act 2013. Under Section 236, an acquirer or person acting in concert who becomes a 90% majority shareholder has the statutory right to purchase the remaining 10% equity shares from the minority shareholders at a valuation determined by a registered valuer. However, minority shareholders frequently challenge squeeze-outs under Section 230, alleging oppression and mismanagement under Sections 241-242. In Cadbury India Ltd (2015), the Bombay High Court held that a company has the legal right to reorganize its share capital and buy out minority shareholders under a court-sanctioned scheme, provided the valuation is robust, independent, conducted by reputable valuers, and does not demonstrate patent fraud or gross undervaluation designed to expropriate minority wealth.

Another critical regulatory hurdle under Section 230(5) involves the Competition Commission of India (CCI). Mergers and amalgamations crossing the asset or turnover thresholds prescribed under Section 5 of the Competition Act 2002 constitute 'Combinations'. Under Section 6 of the Competition Act, parties to a combination are subject to an ex-ante standstill obligation, colloquially termed the 'gun-jumping' prohibition. Restructuring companies are statutorily prohibited from closing the transaction, transferring voting rights, or integrating operational infrastructure until the CCI has granted clearance or until the statutory review period of 150 calendar days (shortened under recent amendments) has elapsed. The Supreme Court in CCI v Thomas Cook (India) Ltd affirmed that even minor pre-merger steps, such as purchasing market shares or integrating customer databases prior to CCI approval, attract severe financial penalties for gun-jumping under Section 43A of the Competition Act."""

# Part 3 Expansion: Add analysis of Ind AS 103 Business Combinations, pooling of interest method vs acquisition method, and Section 72A tax loss carry-forward.
p3_addon = """
From a corporate accounting and fiscal perspective, the structural differentiation between a Section 232 Demerger and a Section 50B Slump Sale is governed by Indian Accounting Standard (Ind AS) 103 'Business Combinations' and Section 72A of the Income Tax Act 1961. Under Ind AS 103, accounting for corporate reorganizations depends critically on whether the transaction represents a 'common control' combination or a transaction between unrelated parties. Common control business combinations (such as reorganizations between parent companies and subsidiaries or sister entities) must be accounted for using the 'Pooling of Interest' method. Under this method, assets and liabilities are recorded at their existing carrying amounts, no new goodwill is recognized, and comparative financial information is restated as if the combination had occurred from the earliest period presented.

Conversely, acquisitions between unrelated entities must apply the 'Acquisition Method' under Ind AS 103. This necessitates identifying the acquirer, determining the acquisition date, and recognizing the identifiable assets acquired, liabilities assumed, and any non-controlling interest at fair value as of the acquisition date. Any excess of the consideration transferred over the net identifiable assets is recognized as Goodwill on the consolidated balance sheet, subject to annual impairment testing rather than systematic amortization.

Furthermore, Section 72A of the Income Tax Act provides immense fiscal value by permitting the accumulated business loss and unabsorbed depreciation of the transferor company to be carried forward and set off against the profits of the transferee company. However, Section 72A imposes strict post-merger continuity conditions: the transferee company must continue the business of the transferor entity for a minimum period of 5 years from the date of amalgamation, and must maintain at least three-fourths of the book value of fixed assets for a minimum of 5 years. If these post-merger conditions are breached, the set-off of losses is retrospectively revoked and taxed as income in the hands of the transferee company in the year of default."""

# Part 4 Expansion: Add analysis of cross-border tax issues, Section 9(1)(i) indirect transfers (Vodafone case law), and FEMA LRS ceilings.
p4_addon = """
Cross-border corporate restructuring under Section 234 also triggers intricate international tax considerations under Section 9(1)(i) of the Income Tax Act 1961, which codifies the taxation of capital gains arising from the transfer of capital assets situated in India, including indirect transfers of Indian assets. The historical catalyst for this jurisprudence was the landmark Supreme Court decision in Vodafone International Holdings BV v Union of India (2012), where the court initially held that the offshore sale of shares in a Cayman Islands holding company that indirectly held telecom assets in India was not taxable under Section 9(1)(i) as the statute then stood. The Parliament responded with retrospective amendments clarifying that a foreign share derives its value substantially from Indian assets if such assets exceed INR 10 Crores and represent at least 50% of the value of all assets owned by the foreign entity.

Consequently, in an outbound cross-border merger where an Indian enterprise merges into an offshore corporation, or where foreign entities with Indian underlying subsidiaries reorganize, transaction counsel must conduct a detailed indirect transfer analysis under Explanation 5 to Section 9(1)(i). While Section 47(via) and 47(vic) provide specific capital gains exemptions for foreign amalgamations and demergers involving Indian shares, these exemptions apply only if at least 25% of the shareholders of the amalgamating foreign company remain shareholders in the amalgamated entity, and such transfer does not attract capital gains tax in the country where the foreign entity is incorporated.

Moreover, the regulatory interface between the RBI and the NCLT under Section 234 requires careful documentation. When the Scheme of Cross-Border Merger is presented before the NCLT, the applicant company must furnish a comprehensive certificate executed by an Authorized Dealer (AD Category-I Bank) confirming that the cross-border fund flows, issuance of foreign securities to resident individuals, conversion of offshore borrowings into Indian ECB, and disposition of foreign branch assets comply strictly with FEMA regulations. The NCLT will not dispense with this requirement, and any deficit in foreign exchange clearance will lead to an immediate stay or rejection of the restructuring petition."""

# Part 5 Expansion: Add analysis of Section 232(6) appointed date jurisprudence, Marshall Sons & Co v ITO, and final operationalization steps.
p5_addon = """
A foundational jurisprudential anchor governing the effective implementation of Schemes of Arrangement is the Supreme Court judgment in Marshall Sons & Co (India) Ltd v ITO (1997). The Supreme Court held that once a scheme is sanctioned by the court and filed with the Registrar of Companies, the amalgamation takes effect from the Appointed Date specified in the scheme itself, notwithstanding that the final sanction order was passed on a subsequent date. The legal fiction operates retrospectively from the Appointed Date: all profits earned, contracts entered into, and liabilities incurred by the transferor company between the Appointed Date and the Effective Date are legally deemed to have been transacted by and on behalf of the transferee company.

However, modern corporate governance under the Companies Act 2013 has introduced vital checks against retroactivity abuse. Ministry of Corporate Affairs Circular No. 09/2019 stipulates that if the Appointed Date precedes the filing of the scheme by more than one year, the company must provide detailed commercial justifications in the explanatory statement explaining the delay, accompanied by an undertaking that no undue tax advantages or accounting distortions were engineered during the intervening period.

To operationalize the restructuring upon receiving the certified copy of the NCLT order, the corporate secretarial and legal departments must execute the following closing checklist:
1. File e-Form INC-28 on the MCA portal within 30 days, attaching the certified order, the approved Scheme, and the registered valuer report.
2. Deliver physical and electronic notice of the sanction order to the Regional Director, ROC, Official Liquidator, and Income Tax Assessing Officer.
3. Convene a Board Meeting of the transferee company to formally take the NCLT order on record and allot consideration shares to the shareholders of the transferor company in accordance with the approved Share Entitlement Ratio.
4. Notify the depository (NSDL/CDSL) and stock exchanges to execute corporate actions, credit newly issued shares into the demat accounts of shareholders, and secure trading permissions under SEBI Listing Regulations.
5. Effect the formal closure of the transferor company's bank accounts and transfer all operational licenses, intellectual property registrations, and environmental permits to the transferee entity by operation of law as provided in the NCLT sanction decree."""

data["parts"][0]["say"] += p1_addon
data["parts"][1]["say"] += p2_addon
data["parts"][2]["say"] += p3_addon
data["parts"][3]["say"] += p4_addon
data["parts"][4]["say"] += p5_addon

total_words = 0
for p in data["parts"]:
    wc = count_words(p["say"])
    total_words += wc
    print(f"Day 56 Part {p['part']} words: {wc}")
    assert wc >= 580, f"Part {p['part']} word count {wc} < 580"

print(f"Day 56 Total words: {total_words}")
assert total_words >= 3000, f"Total word count {total_words} < 3000"

with open("scripts/bcom_law_day56.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print("Saved updated scripts/bcom_law_day56.json successfully!")
