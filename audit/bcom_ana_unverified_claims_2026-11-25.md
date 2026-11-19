# bcom_ana — claims and design points that need an analytics / data-engineering expert (not verified)

Source: one AI reviewer who checked every part of the 9 patched days (1, 15, 37, 40, 44, 45, 46, 47, 48) against the real code output. The other 51 days already ran and matched their stored output and were not reviewed part by part. Treat each line as "doubtful", not "wrong".

## Simulated numbers (not measurements)
- Measured wall-clock timings were replaced by labelled deterministic cost models: day 15 p3 (raw scan 700.00 ms vs cube 0.03 ms), 40 p4, 44 p4 (137,362 req/s), 45 p3 and p4, 46 p2, 47 p3, 48 p4. Day 45 p4 Pillar 1 latency is a fixed stub (0.004 + 0.0001*(i%7)) that passes by construction — labelled simulated but not a real test.

## Unverified statistics and claims
- Day 15: "misjudge angles in 3D pie charts by up to forty percent"; "bullet graph gives five times the information density of a gauge"; illustrative ICU response 45 s→8 s, engagement 8%→94%, 20 ms / 250 ms query times.
- Day 37: FinBERT "approaching 90% F1 versus generic ~60%"; "regex tokenization up to 40% of latency"; "reduces padding by over 70%, 3x to 5x throughput".
- Day 40: "eliminating over 95% of branches", "hours to seconds", "sub-5ms Redis".
- Day 44: TreeSHAP "under 5 ms for T=100, L=31, D=6"; the "30,000 years" arithmetic; the claim that Monotonicity makes ranking reversals impossible; the RC_xx reason codes are invented (not real Reg B codes); part 2 code uses exact subset enumeration, not polynomial TreeSHAP (narration says so).
- Day 45: Basel/PSI/IV ranges; "top-3 recommendations" narration vs top-1 in code.
- Day 46: "45 s versus 4 h" salting figures; part 3 evicts all cache under pressure whereas real Spark protects storage within storageFraction (simplification); cost and fleet figures illustrative.
- Day 47: Flink "sub-millisecond", Kafka sendfile and Murmur2 details, the "4.2M lag" story are narrative; part 2 Haversine speed (783,438 mph) is by construction.
- Day 48: SOS2 for step-function discounts; part 3 greedy freight routing is ~$2k above an exact LP (best configuration is the same under an exact LP, checked outside the repo); part 1's greedy LP-relaxation proxy is not a guaranteed valid bound at every node (final optimum 63 matches brute force); "99% tree reduction by cuts" and "90% pruning from warm start" are generic.

## Modelling / logic notes
- Day 15 p4 and day 45 p1: the silo vs ApexPredict comparison assumes every collision account defaults (full EAD × LGD) while the Apex side uses expected losses, so the gain is overstated (comment added only).
- Day 48 p4: pre-existing hard-coded "Warm Start <5.0% gap in Iteration 3" line did not match printed gaps (cold/warm traces rebuilt from an exact subset DP optimum and swap descent: 8 vs 3 iterations, 62.5% fewer).

## What was fixed (summary)
Non-reproducible output (wall-clock timings, set/hash order), a latency check that measured real time (day 45), day 40 FP-Growth that missed {Bread, Milk, Butter} and a lift 1.00 shown as "HIGH VALUE CROSS-SELL" (now lift 0.98 trap verdict), Apriori filter using int(0.10*N) letting a 9.8% pair through (now ceil), SHAP column hard-coded from a different model (now exact Shapley with an additivity line), Dummy axiom hard-coded phi_4 = 0, day 45 Pillar 4 `pass_p4 = True` (now a real additivity check), day 47 late event dropped (end-of-stream flush) and card-testing rule `>= 2` vs documented 3, "ZERO LAG" printed with lag 300, day 48 LP relaxation feasibility and fictional warm-start traces, day 37 hard-coded demo values and misrouted ticket count, lift/IDF/cosine wording, quizzes got a 4th option on day 1, generic examples and try-its replaced with tested ones.

## Structural notes
- No generic-template labs found. Quiz position bias: the correct answer is always option index 0 (not yet fixed).
