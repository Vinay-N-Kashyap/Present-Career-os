# bcom_aud — claims that need an auditing / assurance expert (not verified)

Source: three AI reviewers who checked every part of the 29 patched days (1, 5, 9, 10, 12, 17, 19, 20, 22, 24, 25, 28, 30–36, 38, 39, 42, 46, 49, 51, 53, 54, 56, 57) against the real code output. The other 31 days already ran and matched their stored output and were not reviewed part by part. Treat each line as "doubtful", not "wrong".

## Paragraph-level citations to verify (quoted in say/quiz "why")
- ISA/SA: ISA 315 paras 12/15/19/21/31; ISA 320 paras 2/4/6; ISA 330 paras 13/15/20/22 + A26/A35 (para 20 may be 21); ISA 520 paras 5/7/A16; ISA 500 paras 6/A30/A31; ISA 450 A2; ISA 240 A53 and 40–43; ISA 530 A11/A22; ISA 600 paras 11, 19–24, 21–23, 24–29, 32–37, 40 and IFRS 10 B86(c) for NCI allocation (B94 may be right); SA 570 paras 13/16/22/A2; SA 580 paras 4 and 20; SA 705 paras 8/9/21/29; SA 701 para 11; SA 299 paras 9/11/13; SA 220 para 19; SA 550 paras 3/22/23; SA 230 para A23; SA 505 para 12; Ind AS 115 para 31 and B81.
- PCAOB: AS 2315.23, AS 2105 paras 6/8, AS 2110 para 32, AS 2201 paras 20, 21, 23–27, 28, 29, 34–38 and 2201.69, AS 2415.05–09/.12, AS 2805 (.06/.08/.09/.13/.14), AS 1301.18–21, AS 2810.09, AS 2801.03(a), AS 3101.07/.09/.10/.13/.14/.18/.19, AS 2610, AS 1205/1206 description, ASC 606, ASC 205-40-50-6 to -11.
- Day 53: the claim that the 12-month waiver rule is identical under ASC 470 and IAS 1 (IAS 1 needs the waiver by the reporting date). Day 54: a refusal "automatically means disclaimer or withdrawal"; the code label `FILE_SEC_FORM_8K` still reads as if the auditor files it. Day 56: "five" mandatory explanatory-paragraph circumstances in AS 3101.18; Part 4 cites $76.4M posted adjustments vs Day 54's $44.4M. Day 57: AS 3101.13/.14 "prohibitions", "strictly prohibited" quiz premise, CAMs required at all exempt/non-exempt filers.

## Law / regulation to confirm
- Companies Act s143(15): penalty for failing to report fraud (reviewer believes Rs 1 lakh–25 lakh; the Rs 5 lakh figure was removed). Day 10: ADT-4 clause corrected to (xi)(b).
- Day 22 p3: "Emphasis of Matter prohibited when the matter is already a KAM" — reviewer believes SA 706 does not say this; the code encodes it, only the try-it was softened. Day 22 p2: "no ICFR (143(3)(i)) opinion when disclaiming".
- Day 24: SA 600 title ("Using the Work of Another Auditor", old ICAI numbering; a revised group-audit SA 600 may now apply).
- Day 20 p1: whether refusing only the SA 240 fraud representation forces a disclaimer or a qualification via SA 580 para 19 (lab models a disclaimer).
- SEBI LODR Reg 30 cyber-incident timeline "generally 24 hours" (day 30). ISA 230 "60-day" and PCAOB "45-day" documentation periods; SQC 1/SA 230 seven-year retention (days 17, 20); attribute sample sizes "25 to 40" at 90–95% confidence (day 33 p1); day 28 p0 claim that regulators demand cryptographic seeds for random selection.
- Day 1 p1: calling Benford analysis "admissible prima facie evidence" is overstated.

## Modelling / logic notes
- Day 12 p3: the code books the full onerous provision (Rs 80 Cr) on top of the revenue reversal; strictly, the loss already recognised via percentage-of-completion would be netted off.
- Day 49: Part 2 narration says a $12.2M lease understatement while the code gives $12.30M and Part 4 hard-codes 12.2M; IAS 16.19–20 cite approximate.
- Day 35 p0: default total_debt_usd is 380M while narration says a 3.8B facility (unused). Day 25 p4 says "30-day curriculum" though the folder goes to day 57. Day 30 p4 "Course 33".
- Illustrative figures that cannot be verified: day 32 p2 "sample sizes +45%", day 34's $45M and $28M cases, day 36's $420M mining case.
- Not touched: `summary` and `projectStep` fields (day 9's projectStep is generic template filler; some summaries use placeholder phrasing). Fictional credentials such as "CFE-SI" are narrative only.

## What was fixed (summary)
15 labs that could not run (unescaped double quotes inside f-strings), missing closing parentheses (days 33, 34, 35, 38), wrong dict keys (days 12, 32), Beneish M-Score coefficients (day 5: TATA 4.679, LVGI −0.327; M-Score now +0.56), hard-coded verdicts and labels (days 19, 49, 54), KeyError in a try-it (day 24), Chi-Square quoted as 184.62 but 70,452.94 in the code (day 30), wrong sample sizes and totals in many examples, AS 2201/AS 5/AS 2 history, Form AP is PCAOB not SEC, auditor does not file the 8-K, ASC 205-40-50-12, filler paragraphs, and try-its that now describe tested results.

## Structural notes
- No generic-template labs found. Quiz position bias: the correct answer is always option index 0 (not yet fixed).
