# bcom_ait — claims that need an AI-governance / regulation / enterprise-AI expert (not verified)

Source: three AI reviewers who checked every part of the 28 patched days (1, 6, 7, 9, 10, 12, 13, 16–31, 33, 34, 38, 40, 52) against the real code output. The other 32 days already ran and matched their stored output and were not reviewed part by part. Treat each line as "doubtful", not "wrong".

## Regulation / standards wording to confirm
- Day 6: "enterprises are strictly liable ... under the White House AI Bill of Rights, NYC LL144 and the EU AI Act" is probably overstated (the Blueprint for an AI Bill of Rights is non-binding); the 0.82 AIR threshold is an invented policy; part 4 says Gate 4 triggers below 0.82 while the code only checks >= 0.82.
- Day 9 / 29: four-fifths rule applied to lending/ML (EEOC rule of thumb); Caremark and Marchand v. Barnhill used as described (day 29 p0).
- Days 16, 17, 20: OWASP LLM numbering (LLM02, LLM06, LLM08) is the 2023 v1.1 list; the 2025 edition renumbers these.
- Day 19: ISO 42001 Annex A control IDs in the lab (A.5/A.6/A.7) are illustrative (real: A.2 policies, A.5 impact assessment, A.6 life cycle, A.7 data, A.10 third parties); Kleinberg impossibility theorem is stated loosely (calibration vs balance); EU AI Act Articles 5, 6, 9–15 and fines (€35M/7%, €15M/3%) look right but biometric categorization is treated as outright prohibited (simplification).
- Day 40: mandatory_legal_action string cites "EU CSDDD Article 8" (reviewer believes terminating or re-routing falls under Articles 10 and 11); CSDDD thresholds/dates (1000 employees, €450M, 2027) may be changed by the 2025 EU Omnibus; SEC climate-rule status (stayed, defence withdrawn 2025) rests on reviewer knowledge; W-8BEN-E and GDPR wording was corrected.
- Days 38, 40: sourcing for "OFAC 50 Percent Rule" and the Caremark/Disney references is from memory.
- Day 34 p2: multi-agent-debate gains attributed to Du et al., 2023, from memory.
- Day 52: Llama Guard 3 has 14 categories (corrected); latencies and "40–90 ms Llama-Guard", "FP8 plus TensorRT", "10 Gbps per core Hyperscan", "Colang 2.0 runtime" figures unverified.

## Invented credentials and unsupported figures
- Invented accreditations: "CEATA" (day 10; the code prints it even when accreditation fails), "Enterprise AI Cybersecurity Verified" and "Enterprise AI Red-Team Certified" (day 16), course-internal CEAIGD wording (day 20).
- Day 10: "Annex IV" snippet in the document registry; ">94% retrieval accuracy with a cross-encoder".
- Day 9: "ROC-AUC > 0.88" and "NRR >= 115% as gold standard". Day 12: quadratic-token claim ("8 agents x 10 turns > 500,000 tokens") and "over 90% friction reduction". Day 13: "self-hosting slashes unit cost by over 70%", "semantic caching hit rates of 35 to 50%", "up to 40% of questions are equivalent".
- Day 22: 80/15/5 ABC thresholds and "top 20% / next 30% / bottom 50%" vary by company; "15–25% working capital reduction" is hedged as vendor claims. Day 21: bullwhip examples (5%→10%/20%/40%) illustrative.
- Day 23: last-mile "41–53% of shipping cost", 12% failed-delivery rate, "30 drops per locker". Day 24: "procurement = 50–70% of revenue", "15–30% maverick discount", "18% premium".
- Day 28: "70% of transformations fail" softened.

## Modelling / logic notes
- Day 34 p2: grounding scores are hard-coded and `claims_challenged` ("40% margin") does not match the 35% TCO thesis.
- Day 22 p5: the lab still executes a negative-benefit transfer. Day 26 p3: allocated capital can exceed the budget with no check; part 2 uses three hard-coded scores for the CoE models.
- Day 25: coherence is hard-coded True (narration no longer claims it is verified).
- Day 6 p4: AIR 2.0556 (protected rate above the majority rate) follows the code's inputs but is odd.
- Day 18 p4 and day 22 p3: quiz wording remains somewhat loose though each has one defensible answer.

## Generic / thin labs (code does not match the title)
- Day 21 p1–p3: titles say Holt-Winters/ARIMA/XGBoost, Prophet and MinT, but the code is a 3-week moving average, a linear trend with a fixed ±8% band, and bottom-up only.
- Days 20 and 25 parts 1–4: simple threshold or scoring templates around the pillar names; day 25 parts 1–4 do not run any forecasting, routing or procurement logic. Day 26 p2: three hard-coded scores.
- Eight capstones (day 6, 7, 9, 10, 12, 13, 16, 17 part 5) are simple threshold-check gates.
- Their try-its were fixed to the real parameters; the code was not rewritten.

## What was fixed (summary)
PII masking that never masked (`\b` stored as backspace, day 16), forecast with the wrong weekday (day 21), negotiation round count (day 24), circuit breaker that never tripped (day 31), cosine computed as a raw dot product (day 38), regex missing "guarantees" (day 52), always-"FREE CACHE HIT" label (day 13), set-order and uuid nondeterminism, many wrong examples/try-its, filler paragraphs and placeholder code notes.

## Structural notes
- Quiz position bias: the correct answer is always option index 0 (not yet fixed).
