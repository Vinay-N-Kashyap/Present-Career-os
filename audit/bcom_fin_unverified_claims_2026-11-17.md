# bcom_fin — claims and design points that need a finance expert (not verified)

Source: three AI reviewers who checked every part's narration, quiz and try-it against the real code output. Treat each line as "doubtful", not "wrong".

## Formula / modelling doubts
- Day 5 p1: `maximized_firm_value` is the firm value at the minimum-WACC tier, but firm value is actually higher at 50–65% debt ($1,329M at 65%); the quiz text "beyond the optimum destroys value" reads against that table.
- Day 8 p4: narration lists three ALM invariants including convexity; the code checks only PV and duration.
- Day 9 p3: the "50% IRR / $4,000 NPV vs 25% IRR / $15,000 NPV" scale example is hypothetical and not consistent with any one discount rate.
- Day 10 p2: the MIRR code accepts `financing_rate_pct` but never uses it.
- Day 12 p2–3: flotation adjustment i/(1−F) and the redeemable-debt approximation are textbook simplifications; the redemption premium amortisation is not tax-adjusted.
- Day 13 p4: new-equity cost is CAPM Ke/(1−F); the textbook form is D1/(P0(1−F)) + g, so this overstates it.
- Day 14 p3: "optimal" is only the lowest of the 3–4 tested mixes; "enterprise value peaks where WACC is lowest" not checked.
- Day 19 p3: leverage "rarely exceeds 40–60%" and distress-cost percentages unchecked; the default-probability curve (changed to exp(6r) so the optimum is interior at 60%) is a made-up illustration.
- Day 20 p3 / Day 21 p3: buyback keeps P/E constant and net income unchanged, so the post-buyback price ($76.53 / $15.52) is an accounting artefact, not a market prediction.
- Day 21 p2: credit-line draws are never repaid in later months in the code; the 6% and 4.5% rates in the narration are not used.
- Day 15 p2: assumes a $10 share price (100k vs 50k shares for $500k); numbers unrealistic.
- Day 25 p3: information-ratio bands (0.5/0.75/1.0 labelled good/very good/exceptional) may be shifted from Grinold–Kahn.
- Day 26 p1: "70–75% of initial margin" maintenance range is a generalisation.
- Day 60: LBO bridge EBITDA-growth value $652M vs 10 × $65M = $650M; the $220M paydown cannot be reconciled with a 75% ECF sweep on about $68M of CFADS; PIK accretion on the mezzanine is ignored in the $1.28B net debt; sovereign post-workout 58% / GFN 11% vs 55.2% in Day 59's code; the 35% devaluation pushing debt above 110%; CMBS vacancy/price-collapse stress scenario.

## Factual figures to confirm
- Day 6 p0: "fixed income dwarfs equity markets in size".
- Day 19 p3: distress-cost percentages.
- Day 28: multilateral netting "typically reduces bilateral volumes by 70–90%".
- Day 51: GPFG headline figures ($1.6T, over 9,000 companies, 70 countries); SWF hurdle rate 8–12%; NIIF as a "development sovereign wealth fund".
- Day 52: EPC delay and performance LDs capped at 20–30%; PRI/MDB fees of +20–50 bp against 100–300 bp of spread compression; quiz says IFC B-lenders get "sovereign immunity"; five MIGA risk types vs four listed.
- Day 54: Chile's SLB described as "dual-direction"; typical greenium (2–15 bp) and SLL ratchet sizes; EU ETS surrender deadline now 30 September (changed from 30 April).
- Day 56: StatArb history credited to "Bamberger and David Shaw" (usually Bamberger and Tartaglia); 5–15 day half-life as "optimal"; Dickey–Fuller critical-value statement for estimated residuals (reworded by reviewer).
- Day 57: B-piece buyer "must" underwrite every loan under risk-retention rules.
- Day 58: 12–18 month IPO process; 15–25% average first-day pop; 5–7% spread.
- Day 59: fan-chart 75th percentile above 80% of GDP as a restructuring trigger; Paris Club principle list; Collective Action Clause history and G20 Common Framework cases (Ethiopia replaced Sri Lanka).

## Structural content issues (not fact errors)
- **Generic template labs:** parts 0–3 of days 51, 52, 54, 56, 57, 58, 59, 60 run a generic `base × rate` template unrelated to the lesson. Their try-its were fixed to the real parameters, but the code itself does not illustrate the topic. Needs rewriting lab by lab.
- **Hard-coded capstones:** day 56 part 4 and day 60 part 4 print typed-in numbers (no regression, simulation or ANOVA as the narration implied; narration was rewritten to match).
- **Placeholder examples:** days 15–20 `example` fields are only labels, and their try-its are still the generic "modify the parameters" text.
- **Quiz position bias:** the correct answer is always option index 0 in every day.
