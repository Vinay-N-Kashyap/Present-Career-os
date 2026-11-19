# bcom_acc (also bcom-accounting) — claims that need an accounting / GST / tax expert (not verified)

Source: two AI reviewers who checked every part of the 15 patched days (5, 15, 16, 18–23, 25–30) against the real code output. The other 45 days already ran and matched their stored output and were not part-by-part reviewed. Treat each line as "doubtful", not "wrong".

## Likely outdated law / rates
- Days 18, 21: GST slabs 0/5/12/18/28% plus compensation cess reflect the regime before the 22 Sep 2025 reform (reviewer recalls 5/18/40%); the code uses 28% + 22% cess and 12%.
- Day 20 p1: B2C Large threshold ₹2,50,000 (believed cut to ₹1,00,000 for inter-state B2C large invoices in 2024).
- Day 25: new-regime slabs, ₹75,000 standard deduction, ₹7L rebate and ₹25,000 rebate are FY2024-25 (Budget 2024); Budget 2025 changed them (₹12L rebate, new slabs). Section 115BAC(6) as the opt-out reference unverified.
- Day 23: Karnataka PT threshold ₹15,000 (revised upward in 2025; new figure not verified). Employer ESI "paid over and above CTC" unverified. EPS contribution in code ₹1,249.50 vs statutory ₹1,250 (noted in codeNotes only).
- Day 26: holding periods simplified (equipment 36 months, no Section 50 block treatment); rounding uses Python round-half-even (48,425 → 48,420) whereas Section 288B rounds up.
- Day 18 p3 and GSTR-1 Table 12: exact HSN digit requirement by turnover band.

## Section / clause / threshold doubts
- Day 18 p1: Section 77 CGST for a wrong tax head (CGST/SGST vs IGST).
- Day 20 p2: what exactly lands in GSTR-2B Part B.
- Day 22 p3: e-way bill intra-state thresholds (Maharashtra, Karnataka); whether the 200% penalty under Section 129 applies in all cases.
- Day 29: ~60-day total in the Section 143(12) quiz option is approximate (2 + 45 + 15 days).
- Day 30: Form 3CD clause numbers (21(a), 21(b), 34, 44) from memory; Section 49 "in that order" wording for IGST credit (Rule 88A); Companies Act references on day 29 were corrected (audit trail: Rule 3(1) Companies (Accounts) Rules and Rule 11(g) Audit and Auditors Rules; fraud reporting threshold ₹1 crore or more).

## Modelling / logic notes
- Day 22 p2 (RCM posting): Step 1 as narrated and coded credits Output RCM 45,000 without a matching debit; it balances only after Step 3. The narrated "RCM Tax Paid Clearing Account" credit does not exist in the code (a real flow would debit an "ITC pending" account).
- Day 21 capstone: the cash challan (32,000) comes from a separate hard-coded set-off (IGST 50,000 outward, 45,000 credit each), unrelated to the invoice (117,000 GST) or purchase ITC (90,000) shown in the same dossier.
- Day 20 p4: the "15d" delay label is hard-coded and does not change if `delay_days` is changed.
- Day 5: NCI deducted only on subsidiary income (no allocation of unrealized profit); EBITDA part hard-codes `tax_provision` to match the ASC 740 part.
- Day 28: FCFF/FCFE formulas add interest back even though this lesson's CFO excludes it (simplification); the "Wirecard cash hemorrhaging" claim is unverified.
- Day 30: several verdict lines (UNQUALIFIED opinion, Altman Z) are fixed text, not computed; PF and ESI are simplified.

## What was fixed (summary)
Books that did not balance (day 15 balance sheet and trial balance; day 30 balance sheet), ROCE mismatch, hard-coded verdicts and values, invisible regex bug (`\b` stored as backspace) on day 29, `vendor` vs `vendor_id` key, mis-cited Companies Act sections, filler paragraphs, placeholder code notes, and 14 capstones that crashed because each slide runs alone.

## Structural notes
- No generic-template labs were found in the reviewed days.
- Quiz position bias: the correct answer is always option index 0 (not yet fixed).
