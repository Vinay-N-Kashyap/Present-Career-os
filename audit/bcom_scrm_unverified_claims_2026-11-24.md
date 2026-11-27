# bcom_scrm — claims that need a sales-ops / customer-success / RevOps expert (not verified)

Source: four AI reviewers who checked every part of the 42 patched days (1, 3–13, 16–21, 23–25, 31, 32, 34–41, 45–47, 49, 50, 55–60) against the real code output. The other 18 days already ran and matched their stored output and were not reviewed part by part. Treat each line as "doubtful", not "wrong".

## Metric definitions and formulas to confirm
- Day 20 p3: SaaS Magic Number multiplies quarterly net new ARR by 4 in narration and code; ARR is already annual, so this likely double-annualizes (CAC payback inherits it).
- Day 1 p1: narration says CAC payback must be under 12 months; the code's pass threshold is 14 months.
- Day 3 p0: narration drop-off percentages (36% for 72→46, 20% for 32→25) vs the unused stage list (35% and 20%; actual 22%).
- Day 19 p3: SPIFF acronym ("Sales Performance Incentive Fund" vs "Special Performance Incentive Fund").
- Day 37 p1: "Tiered" defined as cliff pricing and "Slab" as graduated; most vendors use the reverse naming (the lab's own convention).
- Day 6: Gini thresholds 0.25 / 0.30 and their attrition effects. Day 8: BANT "formulated by IBM".

## Narration vs code inconsistencies left as written
- Day 18 p1: persona match compares "VP_ENGINEERING" with "VP OF ENGINEERING" (never matches; output is right only through a fallback).
- Day 23 p4 and day 25 p2: narration gives discount approval tiers of 15% / 25%, the code uses a 20% cap. Day 24 p1/p4: code qualifies a QBR at 75% forward-looking, narration says 80%. Day 38 p1: Yellow lane "VP sign-off" at 22% vs the day 37 DoA matrix (VP at 25–35%); Green lane ≤15% discount but code keeps Green to risk score 10.
- Day 39: story headline and part 1 still say an $8.5M restatement while the lab and edited narrative show $12M (could not be reconciled). Day 40 p2: story figures ($6.2M inventory write-down, $18.4M total) differ from the lab ($33.1M across five vectors, $1.6M hardware rework); p1: 70% gross-margin floor in narration vs 40% max discount in the lab.
- Day 32 p4: 15 and 20 lead-backlog thresholds inconsistent. Day 35 p1: story $14.2M across 120 accounts vs lab single account $770,000 (illustrative). Day 41 p3: hysteresis 55.0 and cooldown 14 days not backed by the lab code.
- Day 13 p3: narration has a "Day-45 re-survey" but the code's milestone is a "30-day post-resolution audit".
- Day 58 p2: code comments number stages 1–3 while narration says 2–4 (an identity-verification stage 1 not in the code).
- Day 49 p3 still uses `time.time()` as default event time (does not affect output); day 46 p3 retains `random.uniform` and an unused backoff value (do not affect output).
- Day 60 p4: the ten scenario results are hard-coded `True` (so "10/10" is not a live check) and it prints a self-conferred "CCSA-SOVEREIGN" accreditation.

## Law / policy wording
- Day 57 p3: DSAR export strips `internal_confidential_` fields; under GDPR Article 15 and CCPA, notes about the person may legally have to be disclosed. Day 57: "over 21 under FTC regulations"-style claims and ECJ/EDPB wording on key destruction as erasure (softened).
- Day 35 p1: GDPR "Article 44" for transfers (it is Chapter V, Arts 44–50) and "SOX 802" not checked.
- Day 49: crypto-shredding "commonly treated as" erasure; GDPR fine wording ("up to €20M or 4%, whichever is higher").
- Day 58 p0 quiz: Sales Engineers must report to technical leadership rather than sales (many companies keep SEs under sales). Day 55 p1: 5% admin-to-seat ratio as a "best practice".

## Unverified statistics and benchmarks
- Day 1/6: Snowflake/Datadog NRR "well above 130%"; "21x" (5 min vs 30 min); "up to 60% of inbound submissions are non-target". Day 7: "300% higher meeting booking rates", "400% higher positive reply rates", Google/Yahoo 0.3% / 0.1% complaint thresholds, warm-up ramp numbers. Day 8: "No Decision accounts for more than 40% of stalled pipeline". Day 9: "80% drop in conversion past 30 days", "TCO up 300%", ">70% close rate for certified deals". Day 10: "probability of closing drops 65% at 2x median days-in-stage", benchmark stage conversion ranges, GDPR/Works Council "30 to 60 days". Day 11: "60–75% of accounts churn after champion departure", "salvage rates 55–65%".
- Day 12: valuation-multiple regressions; "LTV more than triple"; expansion cost 22–30 cents per dollar vs $1.15–1.40 for new ARR. Day 13: Gong "5 million calls"; 38%/24% win-rate and cycle claims; Promoters expand 25% / Detractors contract 35%; "churn below 5%". Day 16: "34% less data entry", "4x forecasting precision". Day 17: InsideSales/HBR response-time figures (21x / about 100x). Day 18: ">85% win probability" from RFP shaping; "90% content graveyard"; "35% higher win rate, 22% faster". Day 21: Crossbeam-style overlap claims. Day 23: "over 85% of procurement teams accept the packet"; "80% of redlines resolved live". Day 24: SaaS revenue multiples (6–8x vs 15–20x); "99% forecast reliability". Day 25: AWS private offers drawing down "100%" of cloud commitments.
- Days 32–41: Gartner "over 80% of quotes have errors", "3–5% revenue leakage"; "80% drop in qualification after 5 minutes"; "over 5,000 webmail domains"; "MQL <2% vs PQL 25–40%, 15x"; "4.2% close-probability loss per 24h"; "80% more likely to retain with 4-hour outreach"; "35% shorter cycles, 2.4x win rate"; "400% lead velocity"; "98% fewer API calls".
- Days 45–60: "over 40% of opportunities end in Closed-Lost to the status quo", rep attainment distributions, "20–35% of SaaS seats are dormant", "95% of polling queries return zero deltas", "sub-50 ms latency", "20 min to 40 s" warehouse queries, "up to 70% faster proposals", Bulk API "200,000 records per batch", and invented example stats (conversion +42%, cycle 180 to 62 days).

## What was fixed (summary)
~35 non-reproducible snippets (wall clock, random tokens, set/dict order, builtin hash), inverted tests (day 60 S1/S2 now 10/10), missing-field-as-None conflict bug (days 46, 50), security-gatekeeper check order (day 4: SECURITY_RISK before EXPEDITE_DEAL), concessions applied on rejected trades (day 59), threshold 70/45 vs 75/50 (day 41), risk score capped at 100 (day 38), wrong method signature (day 12), broken strings and missing json imports, narration describing modules the code does not have, wrong SPICED expansion, wrong figures in many examples, generic try-its and code notes (replaced with tested ones).

## Structural notes
- No generic-template labs found. Day 2 is not in the patched set and days 12–15 were not checked against the new day 10 preview.
- Quiz position bias: the correct answer is always option index 0 (not yet fixed).
