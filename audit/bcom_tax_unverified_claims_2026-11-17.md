# bcom_tax — claims that need a tax expert (not verified, left unchanged)

Source: three AI reviewers who checked every part's narration, quiz and try-it against the real code output. They corrected what they were confident about and listed here what they could NOT verify. Treat each line as "doubtful", not "wrong". Day numbers are lesson days.

## Likely outdated (law changed)
- **Day 22:** Finance (No.2) Act 2024 changed Sec 149 (5-year limit when escaped income is ₹50 lakh or more, not 10) and moved searches from 1 Sep 2024 to block assessment under Sec 158BC. Lesson's "10 years", "searches under 147/148" and "Nov 2024 search" content looks stale.
- **Day 33:** Equalisation Levy 1.0 (6%) was withdrawn from 1 Aug 2024 and EL 2.0 (2%) from 1 Apr 2025, but is presented as current. (Day 19 and Day 4 now carry an "abolished" note.)
- **Days 11–16, 19, 20:** Income Tax Act 1961 section numbers may be outdated because the 2025 Act took effect 1 Apr 2026.
- **Days 6–10:** GST slabs (28% etc.) may predate the 2025 rate rationalisation.
- **Day 14:** indexed cost of acquisition is outdated after July 2024 (also Day 58: post-July-2024 LTCG is 12.5%, code uses 20%/30%).
- **Day 10:** GSTR-1 B2CL threshold (code uses ₹250,000) may be lower now.
- **Day 41:** FEMA 9-month export realisation period may have been revised (also Day 9).
- **Day 38:** effective date of the Sec 20 ISD mandate (believed 1 Apr 2025).
- **Day 57:** QDMTT safe-harbour date (July 2023 in text; final guidance December 2023).

## Section / rate / threshold doubts
- Day 21: Sec 142(2A) special audit "90 days" (142(2C) ceiling may be 180).
- Day 24: whether the 271AAC 10% base includes surcharge and cess (code assumes yes, 6.24%); "about 50% of tax evaded" compounding fee under 279(2).
- Day 26: Form 3CD clause numbers 21(d), 21(g).
- Day 31: Sec 72A "resets the eight-year clock" (8 years likely run from the original loss year); 72A scope list.
- Day 32: "Sec 115JAA(8)" and "Circular 29/2019" on forfeiture of MAT credit under 115BAA (also Day 35).
- Day 33: 40% foreign-company rate, PE profit attribution under Rule 10, Sec 206AA 20% wording.
- Day 34: Rule 10TD safe-harbour margins and ₹100/200 Cr bands, KPO 24%/21% split, loan spread 175–425 bps; 3CEB due dates; CbCR penalty tiers.
- Day 35: "Sec 115JB(5A)"; NPV "₹55 Cr saving" is illustrative only.
- Day 38: number of Rule 33 pure-agent conditions; Circular 199/11/2023 allowing a ₹0 declared value.
- Day 41: Sec 154B rounding citation; shipping-bill colour/code descriptions; 15% warehousing interest and 90 days under Sec 61(2).
- Day 43: MOOWR DTA clearance — text says duty only on imported raw-material content "under Section 65" (also Day 45 parts 1 and 3, Day 43 part 3); under Circular 34/2019 duty may be payable on the manufactured goods, so the quiz could be wrong.
- Days 43/45: Sec 76(1)(c) ₹50 drawback threshold and "Section 154B rounding".
- Day 43: Notification 19/65 sliding-scale percentages (95/85/75/70/65/60 by quarter) may be shifted by one period.
- Day 44: RoDTEP statutory section (51B), Notification 21/2023 and 19/2022, FTP 2023 status-holder performance period (2 vs 3 years).
- Day 45: Appendix 4J composition fees (0.5%/1%).
- Day 46: Sec 142(2A) description (Finance Act 2023, 90/180 days, Rule 14B); Sec 144B restructuring year; video-hearing cites inconsistent across Days 46, 50, 54 (144B(6)(vii), (vii)/(viii), (7)(viii)).
- Day 47: Explanation 1 list to Sec 148; Finance Act 2022 amending 149(1)(b); "over ninety thousand writ petitions"; Sec 153(2) now gives 9 months (not 12) for notices served on or after 1 Apr 2021.
- Day 48: Black Money Act Sec 10 / Chapter V; Sec 68 "resident creditor" wording; Sec 132(4A) said to cover surveys (covers only search/requisition).
- Day 49: Sec 270A(6)(e), 270AA(4) appeal-limitation exclusion.
- Day 56: Rule 10U(1)(d) conditions; Sec 144BA sub-sections; Circular 7/2017 on GAAR/SAAR.
- Day 58: Sec 2(19AA) lists five conditions but the statute has seven; "second proviso to Sec 50B(2)" for no-indexation (statute disregards the second proviso to Sec 48); slump-sale 36-month holding period.
- Day 59: Sec 171(3) as registration-cancellation power (may be Rule 133(3)).
- Day 60: Rule 11UAC as the 56(2)(x) exemption; ECB year-end rate "Article 1.5"; 5% SBIE rates (transition rates are higher in early years).
- Day 8 p3: Sec 17(5)(b) clause carrying the "obligatory under law" exception; whether rent-a-cab and insurance sit in the same sub-clause.
- Day 9: sub-sections of Sec 77 CGST / Sec 19 IGST for refund vs no-interest.
- Day 10 p2: "4(B)(1) permanently extinguished" ignores the Rule 42(2) annual true-up.
- Day 12 p4: Sec 115JB(2A) wording and actuarial gains.
- Day 13 p1: whether 115BAA bars all of Sec 35 or only 35(2AB), 35(1)(ii)/(iia)/(iii), 35(2AA).
- Day 14 p2: which proviso of Sec 50C(1) holds the 10% tolerance.
- Day 7 p2: code treats goods-transport agency as goods RCM, but GTA is a service (Sec 13(3)).
- Day 15 p2: old regime uses a 30% base only; the 25% turnover test is not coded.
- Days 16/20: percentile method in code (`int(p*n)`) may not match the Rule 10CA definition; "Form 3CEB = Local File" conflates the accountant's report with Local File documentation; 3CEB due date (31 Oct vs 30 Nov).
- Day 4: customs value uses CIF (US customs value excludes international freight/insurance); claim that DDP→DAP removes PE risk when local consignment stock exists.
- Day 40: Sec 52 TCS cut to 0.5% from 10 Jul 2024 (changed in code; reviewer "fairly but not fully sure").

## Case-law citations to check
- Day 22: Hotel Blue Moon cited as "void ab initio" authority for the 143(2) time bar.
- Day 40: Safari Retreats and Refex Industries case descriptions.
- Day 42: claim that 1% landing charges were abolished "following Wipro Ltd".
- Day 49: Delhi High Court case names.
- Day 51: whether Kanpur Coal Syndicate and Jute Corporation were Constitution Bench rulings; year of the Faceless Appeal Scheme.
- Day 52: that the Supreme Court "affirmed" Vijay Television and Turner; Finance Act 2020 amendment on foreign companies.
- Day 54: CBDT numbering "Instruction 5/2024 and a Special Order of August 2024" (reviewer recalls Circular 9/2024); Santosh Hazari ITR citation.
- Day 55: Pepsi Foods stay and case number, ₹9.85 Cr demand, 20% deposit proviso placement in Sec 254(2A).
- Day 56: Tiger Global, Bidco, Blackstone GAAR rulings.
- Day 58: Bharat Bijlee reference.
- Day 59: Reckitt Benckiser date and bench; NOS citation.

## Structural content issue (not a fact error)
- Days 31–35, 41, 42 and 43–60 labs run a generic template (`base × rate %`) that does not illustrate the lesson being taught. The code runs and matches its output, but a student does not see the topic's actual logic. Needs rewriting lab by lab.
