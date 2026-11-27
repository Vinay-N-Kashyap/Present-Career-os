# bcom_dmkt — claims and design points that need a digital-marketing / ad-tech expert (not verified)

Source: three AI reviewers who checked every part's narration, quiz and try-it against the real code output. They corrected what they were confident about and list here what they could NOT verify. Treat each line as "doubtful", not "wrong".

## Dated or possibly outdated
- Day 37: the whole lesson presents Chrome deprecating third-party cookies and launching the Privacy Sandbox as planned; Google has since scaled this back. Also "event-level delays up to 30 days" and "<2% error".
- Days 40 and 45: "Meta Graph API v19.0" is outdated.
- Day 48 p3: OpenRTB "current_version 3.0" (2.6 is the widely deployed version).
- Days 51, 55: Amazon Sponsored Products described as a generalized second-price auction; days 52, 55: Walmart Connect as first-price (platform behaviour may have changed).
- Day 42: "Over 80% of publishers use GAM 360"; header-bidding uplift 25–50% / 30–45%.
- Day 43: FTC/CMA "mandatory compliance" claim; GroupM "Premium Marketplace" and OpenPath "low single digits" fees; "up to 25% more working media".
- Day 44: ANA/ISBA "$88B / $20B" figures; "85% reaches publishers" SaaS claim.
- Day 45: "FTC attestation", 32% carbon reduction, Core Web Vitals percentages; day 45 p2 title still says "Cryptographic ... Schain" (overstated).
- Day 36: Meta dedup merge behaviour, the 48-hour window, Google Ads "Enhanced Conversions API" naming.

## Privacy / legal wording
- Days 52, 53, 55: "UID2 complies with GDPR" and "ensuring complete compliance" with BIPA/CCPA/GDPR.
- Day 38 p3: Gaussian-mechanism formula σ = Δ·√(2 ln(1.25/δ))/ε is only valid for ε<1, but the code also uses ε=2.
- Day 40 p2: AMD SEV-SNP "inside AWS Clean Rooms".
- Day 38 p1: Snowflake HAVING-style threshold wording and the invented error name 'AGGREGATION_POLICY_VIOLATION'; p2: "100M-record PSI in under 3 minutes", "3x more queries under RDP".
- Day 40 p1: Meta dedup of a late browser ping against the replayed `RECOVERED` event id would not actually merge (the ping has no event_id).

## Modelling / logic notes
- Day 39 p2: `fit()` ignores its optimizer result and hard-sets the parameters; p1: Pareto/NBD P(Alive) is an ad-hoc approximation; p3: example shrunk values ($340, $248) do not follow from the lab's parameters.
- Day 32 p2: the "best control" picker needs both correlation and distance to improve, so it is not guaranteed optimal.
- Day 35 p5: SLSQP stops with marginal ROAS 0.67–0.71 rather than exactly equal (narration says "about").
- Day 46: BM25 `b` ranges and encyclopedia/news tuning values; Day 49 p?: BigQuery MERGE qualified `T.col` on the left of `UPDATE SET` not checked against BigQuery grammar.
- Day 53: "Geopath standards accredited by MRC" wording unverified.
- Day 51 p4: Target and Best Buy named as Criteo customers; CitrusAd "GraphQL"; Criteo/CitrusAd/Kevel offerings.

## Statistics and case-study figures (no source)
- Day 26: "5x to 7x" cost to acquire vs retain. Day 3: "$80B ad fraud". "over 70% of anonymous visits", ">99% blocking reduction", ">90% match rates", "ad blockers 30–45%", Meta EQS/EMQ "8.0 = excellence" band, "25% CAC reduction" claims (days 31, 33–36).
- All case-study figures are invented illustrations (e.g. day 24 $42M/$24M/$11M, day 31 17.4x; day 32 luxury-auto, bank and retail numbers are internally consistent but unchecked).
- Day 49: "20–35% CTR uplift from rich results" and CTR level claims. Day 55: "Buy Box > 85% of transactions". Day 52: "2–6 hour inventory latency". Days 50, 51: "80–90% lower CAC for organic".

## Labs that are thin (on topic, but hard-coded)
- Day 24 p5, day 26 p5, day 35 p4 and p5: boolean or status gateways; day 26 p4: fixed traffic shares, not a real bandit; day 35 p4: hard-coded Fellegi score of 9.8; day 36 p5: hard-coded 4.2 ms latency; day 40 p0 and p4: hard-coded status and credential records. Their try-its were fixed to real behaviour but the code was not rewritten.

## Structural notes
- Five slides in this Python course had been written in TypeScript/JavaScript (days 36 p2–p3, 38 p1, 39 p4, 42 p1); they were rewritten as equivalent Python.
- ~41 labs import numpy/scipy/networkx; they only run because the Python worker now loads Pyodide packages from imports (see `public/python-worker.js` on this branch). **Please test one in the app.**
- Quiz position bias: the correct answer is always option index 0 (not yet fixed).
