# bcom_ops — claims and design points that need an operations / supply-chain expert (not verified)

Source: four AI reviewers who checked every part's narration, quiz and try-it against the real code output. They corrected what they were confident about and list here what they could NOT verify. Treat each line as "doubtful", not "wrong".

## Standards, law and trade terms to confirm
- Day 17 p1: the code applies the UCP 600 Art. 30 ±5% tolerance to the invoice amount; Art. 30 applies the 5% to quantity, with the credit amount not to be exceeded. Day 17 p3: 30–70% General Average deposit figures.
- Day 22 p2: GS1 Digital Link URI order in the text and code is /01/21/10/17; canonical GS1 puts lot (10) before serial (21) and expiry as a query.
- Day 21 p2: MKT cited as USP <1159> (probably <1079>); example MKT / geofence numbers (7.2 °C, 18.2 km) differ from the code's output.
- Day 26: 20–35% cost-of-poor-quality reduction; 15–25% insurance discount; audit sampling and escalation narrative.
- Day 27: credit-rating, CHIPS Act and "SCRI qualifies for subsidies" claims (SCRI is a course-invented index).
- Day 29: 50–70% downtime reduction; "up to 40% longer asset life"; ISO 10816 thresholds (superseded by ISO 20816); p0 calls the escape rate a false-negative rate though the code computes it per total inspections.
- Day 41: 20–35% holding-cost reduction.
- Day 43: GDP and ASTM/ISTA details; hard-coded "100% VIABLE" and "SIGNED" print lines; day 43 p1 USP reference generalised.
- Day 44: EU WEEE and Battery Regulation percentages; 40–60% freight savings.
- Day 49 p3: title says "Autonomous Maintenance (Jishuken)" while the narration and quiz use Jishu Hozen (the correct term).
- Day 52: "Informed Compliance" quiz treats the importer of record as having "sole" liability (US-centric framing).
- Day 54: quiz mentions "IMDG Segregation Level 2" (not confirmed as IMDG terminology); 49 CFR, 250 mm placard and 250 kPa figures unchecked.
- Day 55: HS 8517.62.90 called an "8-digit international tariff code" (only the first 6 digits are international).
- Day 56 p1: Hayes–Wheelwright matrix orientation (above/below the diagonal) changed to the standard orientation; reviewer only moderately sure.
- Day 58 p2: narration mixes methane GWP 28 (AR5) with N2O 273 and SF6 25,200 (AR6).
- Day 59 p3: ISO 20816-3 limit "7.1 mm/s RMS for rigid-mounted medium machines" (probably zone C/D for group 1; group 2 would be 4.5).
- Day 25 p0: RAMI 4.0 has six layers; the five-layer stack is now described as "in the spirit of" it.
- Day 15 p2: AES-128, 21 CFR Part 11, BRSR/CSDDD claims are narrative and unverified.

## Modelling / logic notes
- Day 16 p1: "purchase price is less than 40% of lifecycle cost" conflicts with the 76–90% shown in the output; vendor A/B $965 / $810 TCO figures cannot be reproduced.
- Day 18 p4: narration says the engine blocks vendors under 90% OTIF or over 100 PPM, but the code only tiers by score (Balkan 84.5% OTIF, 185 PPM is just "Approved").
- Day 20 p1: code is a weighted score with no AHP pairwise matrix or consistency ratio, though narration and quiz describe AHP.
- Day 22 p1: escrow code lets M4 pay out before M2 and M3 with no ordering check.
- Day 23 p1: narration says dual cycling adds 30–45%; the model prints 22.6%.
- Day 24 p4: hard-coded DES inputs (MODERATE, 0 overflows) do not match part 1's real output (CRITICAL, 244 overflows); left in place so the capstone gate passes. Day 24 p3: example sigma figures inconsistent.
- Day 10 p4: quality score gives only 50/100 at the stated 0.5% scrap target (looks like a design flaw).
- Day 11 p2: "NP-hard TSP" and "heuristics within 2–7% of optimum" claims; example counts a 72 m saving as if the picker enters Aisle 2 from the depot end.
- Day 12: packaging "dampening" is a toy model; "up to 10x R-value" for VIP vs EPS foam and "50–65% of labor cost" unverified.
- Day 13 p1: $24M→$89M recovery figures do not reconcile with its own percentages; p3 `is_fully_compliant` is always True by construction and "Regulatory Fine Avoided" prints net savings. Day 15 p3: "Statutory Penalty Avoided" prints net saving after credit cost.
- Day 8 p2/p3: "Forward/Backward Pre-building" wording is confusing. Day 7 p3: PPB code forces merging through zero-demand weeks.
- Day 40 p3: code is right-shift only; `catchup_overtime_capacity_hourly` unused. Day 41 p1: two independent newsvendor calculations, not a true Clark–Scarf recursion (`h2` unused, Stage 2 z fixed); p4 fixed-z closed form with hard-coded 99.4% fill rate. Day 29 p3: route compression is a fixed 18% constant, not a VRPTW solver.
- Days 46–48 narration was only skimmed by the reviewer; only the three arithmetic quiz answers (Critical Ratio 0.75, takt 60 s, PCE 0.625%) were verified.

## Structural content issue (not a fact error)
- **Generic template labs:** all 15 parts of days 46, 47, 48 and all 55 parts of days 49–52 and 54–60 run the same `evaluate_<word>(base, rate)` template (`base × rate %`), unrelated to their topics (including OEE, Lean, Incoterms). They run and match their output, and the quizzes and narration carry the real lesson, but the code does not illustrate the topic. Try-its were rewritten to the real call and tagged generic. Needs rewriting lab by lab.
- Quiz position bias: the correct answer is always option index 0 (not yet fixed).
