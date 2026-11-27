# bcom_ecom — claims and design points that need an e-commerce / payments expert (not verified)

Source: one AI reviewer who checked every part of the 7 patched days (3, 4, 5, 33, 35, 36, 37) against the real code output. The other 53 days already ran and matched their stored output and were not reviewed part by part. Treat each line as "doubtful", not "wrong".

## Unverified statistics and figures
- Day 3: ATC 8–12% and the funnel step ratios; "30 to 50 percent" platform overclaim; "CM2 35–50% healthy" range.
- Day 4: "marketplace sellers pay no ad networks" framing in part 0; 82/18 Buy Box shares (model assumptions); 20–30% annual inventory holding cost.
- Day 5: P&L marketplace/platform fees $890k vs $1,063,500 in part 0 (different scopes, not reconciled); 18% wholesale CVR; "zone-skipping" used loosely for multi-node fulfilment; Day 1 and Day 2 topics listed in the capstone narration.
- Day 33: 85,000 requests and 14,200 orders example; SOX and 99.99% availability claims in part 4.
- Day 35: $3.85M savings, 92.1% fan-out reduction, 3x velocity, 28.4% conversion lift (hard-coded inputs); "every 100 ms costs over 1% conversion".
- Day 36: Visa/EU interchange figures (up to 2.5% cross-border, 40–60 bps savings); 150 data elements in 3DS2; "$3.2M saved" and "2.4%" example figures; foreign transaction fee softened to "often 1% to 3% or more".
- Day 37: "over 65% of sessions are anonymous"; 69.8–75% cart abandonment range; sub-50 ms, 18 ms, 20 ms latency figures; WebSocket delta subtotal $540 vs the $150 watch used elsewhere.

## Terminology / modelling
- Day 33: output label `ACID_COMPENSATED_DISTRIBUTED_SAFETY` (sagas are not ACID). The Idempotency-Key header is an IETF draft (RFC 7395, which was cited before, is XMPP over WebSocket; replaced throughout).
- Day 4 p3: US suspended Section 321 de minimis treatment for most shipments in August 2025; the code's de minimis test is a simplification (real rule uses fair retail value, not CIF).
- Day 36: engine does not track cumulative low-value limits; cryptogram is a fixed mock (real Mastercard uses ECI 02); TRA exemption does not give an issuer liability shift (corrected).

## What was fixed (summary)
Mislabelled "360-Day" values (really Day-720), hard-coded "8.0%", "1.5%", "$15" labels, OR-Set bug (constant tag meant re-adding a removed item stayed removed), builtin `hash()` replaced by `zlib.crc32` (day 33 p3 and p4), wrong RFC citation, safety-stock claim contradicting the square-root law, dispute-ratio try-it threshold (0.65%, not 1.0%), response codes 05/51 wrongly called hard declines, "Kleppmann proved" softened (Redlock issues no fencing tokens), filler paragraphs, six capstones made self-contained and three broken multi-line strings repaired (days 3, 4, 5), all try-its rewritten with tested variants.

## Structural notes
- No generic-template labs found. Quiz position bias: the correct answer is always option index 0 (not yet fixed).
