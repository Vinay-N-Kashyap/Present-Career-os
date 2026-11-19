# bcom_ent — claims and design points that need a startup-finance / venture expert (not verified)

Source: one AI reviewer who checked every part of the 8 patched days (1, 3, 4, 5, 6, 7, 9, 10) against the real code output. The other 52 days already ran and matched their stored output and were not reviewed part by part. Treat each line as "doubtful", not "wrong".

## Metric definitions and formulas to confirm
- Days 4 and 9: Magic Number is defined as (quarterly net new ARR × 4) / prior-quarter S&M. If net new ARR is already annualized, the ×4 overstates it (code and text agree).
- Day 4 p1: burn-multiple bands (1.5–2.0 "suspect", >2.0 "dangerous") differ from Craft Ventures' commonly cited scale (2–3 suspect, >3 bad); code uses the same bands.
- Day 5 p1: pro-rata modelled as 25% of the round for a 24% holder, so Series A ends at 24.2% rather than exactly 24%.
- Day 9 p2: NRR/GRR sum 6 months of flows against month-1 MRR (rough method); the status is DEFICIT (GRR 79.0% vs the 88% gate), but the Part 4 capstone feeds illustrative inputs (NRR 136.5, GRR 81.5, Quick Ratio 8.51) that pass and do not match Part 2 (133.5 / 79.0 / 7.48). With Part 2's real values Gate 3 would fail; left as is.
- Day 6 p3: "fit" is only a count comparison.
- Day 9 p3: the Boeing 787 break-even narrative looks inaccurate.

## Unverified company / market claims
- Day 5 p4: narration references Day 2 content (venture debt, 409A) that the reviewer could not see.
- Day 6: Slack "fastest-growing enterprise SaaS in history" and 2,000+ integrations; Stripe "$95B" framed as 2012; "Course 28" in part 4.
- Day 7: Casper (CAC over $300, LTV/CAC under 1.5x) and Zoom (72 NPS, LTV/CAC above 8x, 9-month payback); Casper date corrected to early 2020.
- Day 9 p0: Southwest "70% fewer spare parts" and "25-minute turnaround"; Atlassian "no venture capital" claim removed.
- Day 10: Osterwalder's "four shift archetypes"; the Shopify/Bessemer memo story ($25M valuation, Alex Ferrara); the Stripe "capstone gates" example; Airbnb "returned to profitability within six months" (softened); false Adobe claims removed (piracy eliminated, +800% market cap, +300% LTV).

## What was fixed (summary)
Effective pre-money bug (day 1 p3: pre×(1−pool%) $6.8M → pre − pool%×post $6.5M), hard-coded "+100.0% / +10.7% dilution protection" and "(5 Seats)", "1.35x", "28+ MONTH" labels (now computed), down-round result ($9.7391 / +13,393 shares, not $9.6429), cohort-profit drop ($372k, not $1.2M), lead/Series A percentages aligned to the code (12% lead, 25% pro-rata), wrong code-note values (days 7, 9, 10), capstone hard-coded inputs aligned to real part outputs, try-its that did not deliver the promised result, 25+ filler paragraphs and "Qualification filter retains 45%" asides, three capstones with broken multi-line strings made self-contained (days 3, 4, 5).

## Structural notes
- No generic-template labs found; several capstones and day 9/10 gate parts use hard-coded dict inputs but are topic-relevant. Quiz position bias: the correct answer is always option index 0 (not yet fixed).
