# bcom_ban — claims that need a banking/regulatory expert (not verified)

Source: three AI reviewers who checked every part's narration, quiz and try-it against the real code output. They corrected what they were confident about and listed here what they could NOT verify. Treat each line as "doubtful", not "wrong".

## Probably wrong or outdated
- Day 1: CCF 50% for committed facilities (finalised Basel III uses 40%; 50% is Basel II/US); financial standby LCs listed at 50% CCF (usually 100%). Stage-2 trigger (PD doubling / +200 bps) is now only a rule of thumb.
- Day 14: Rule 15G retention shown with a CLO example, but open-market CLO managers were exempted after the 2018 D.C. Circuit decision (LSTA v. SEC). AAA attachment points of 22–25% are illustrative.
- Day 16: US estate-tax exemption "roughly $13M" (may be $15M from 2026); Reg BI details.
- Day 9: whether the 43% DTI cap is still in force (CFPB moved to a price-based General QM test); "EEOC/ECOA four-fifths rule" applied to lending.
- Day 17: $1M CSA threshold is not consistent with regulatory variation margin (zero).
- Day 18: CCAR 4.5% hurdle under the current stress-capital-buffer regime; CCAR planning horizon; CRE 250% internal limit vs 300% supervisory guidance.
- Day 34: DCCO deferral limits (2 yrs infrastructure / 1 yr non-infrastructure) may be superseded by 2025 RBI project-finance directions; HAM interest benchmark ("repo + 300 bps"; India uses Bank Rate + 3%?); cure period "90–180 days".
- Day 37: RBI CP issuer minimum rating (text A2; current rule may be A3); the part 4 model treats a CP investment as a funding source.
- Day 42: Interest Equalisation Scheme subvention (2–3%) described as current but believed lapsed; EPC tenor 180/270 days; 9-month realisation period; Gold Card "20% buffer".

## Regulatory figures to confirm
- Day 5: Basel G-SIB leverage buffer / US enhanced SLR 5.0%; "qualitative objection" in CCAR may no longer apply.
- Day 6: LSTA "Required Lenders" is usually a simple majority (text gives LMA 66.67%); Revlon facts from memory (about $900M wired, Aug 2020, 2022 Second Circuit reversal, OCC/Fed 2020 penalties).
- Day 8: "$10 trillion repo market"; BNY Mellon as "sole" tri-party agent.
- Day 11: fee split (management 20%, underwriting 20–30%, selling concession 50–60%); 180-day lock-up as market practice; research quiet period (now FINRA 2241, 10 days).
- Day 12: DCM fee schedule (25–87.5 bps); 101% change-of-control put in IG indentures; RJR Nabisco figures ($25B LBO, $19B debt, >$1B bondholder loss).
- Day 13: reverse termination fee range 4–8%; Delaware 2–4% breakup range as a norm; Smith v. Van Gorkom description.
- Day 14: "Gaussian copula correlations 10–15%".
- Day 17: OTC derivatives notional "over $600 trillion"; cross-currency basis direction.
- Day 18: CCyB cap 2.5% and G-SIB surcharges 1.0–3.5% (reviewer believes correct).
- Day 31: Method 1 "entry-level for SMEs"; Chore Committee history and 1997 MPBF withdrawal; QIS form timing and "mandated" 1–2% penal interest.
- Day 35: consortium ICA vote (text 66%/60%; RBI 2019 framework recalled as 75% by value and 60% by number); Basel III CCF 20/50/100%; Large Exposure 20% of Tier 1; CET1 minimum 8.0% India-specific; CET1 13.8% claim uncomputed.
- Day 38: PD underwriting "100% of auction"; "35–50% bank share of G-Secs"; SDL "constitutionally serviced" wording.
- Day 26: Section 385 IRC reference for intercompany loans.
- Day 41: $25M NOPL as a "statutory cap" (RBI sets it per bank); AD Category-III description; VaR 99% / $2.5M risk limit.
- Day 43: aged-Nostro provisioning buckets (90/180/365 days) as regulatory mandate; RBI inward-remittance turnaround of 2 business days.
- Day 45: ECGC WTPS as the bank's claim route (bank policy is ECIB?); "90–270 days" interest-equalisation realisation; 17:00 EST Fedwire cutoff; Sec 206C(1G) TCS reference (new Income-tax Act may renumber); internal CVA models under the floor.
- Day 47: "less than 0.01%" probability for 10 exceptions in 250 days.
- Day 48: RBI AT1 CET1 trigger 6.125% (reviewer changed it from 7.0%, about 80% sure); RBI leverage ratio 3.5%/4.0%; D-SIB surcharge buckets.
- Day 50: 100% claw-back over five years; 7.0% CoCo trigger.
- Day 51: "six" standardised credit events (2014 definitions add Governmental Intervention for financials); standard restructuring clause for North America (Mod-R vs XR).
- Day 52: minimum holding period of 6 months and 5% retention under RBI securitisation rules (tenor-dependent).
- Day 28: code still prints the label "Statutory Four-Fifths Compliance".

## Structural note
- Several capstones were made self-contained by prepending earlier definitions (each slide runs in a fresh Python namespace); day 19 uses a fixed UUID and clock so the demo output is reproducible.
