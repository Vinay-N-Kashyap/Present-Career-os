# -*- coding: utf-8 -*-
"""
Enrich Days 51 to 55 with example, tryIt, and check.answer = 0
Course: Banking, Treasury & Credit Operations (bcom_ban)
"""

import json
import re

examples_and_tryits = {
    51: [
        {
            "example": "An investment-grade corporate CDS trades at a market par spread of 165 bps against a standardized 100 bps running coupon for a $10,000,000 notional with a 5-year risky annuity (PV01) of 4.425. The protection buyer transfers an upfront cash payment of $10,000,000 * (0.0165 - 0.0100) * 4.425 = $287,625 to the protection seller at contract execution.",
            "tryIt": "Adjust par_spread_bps to 220.0 to observe how widening credit risk increases the upfront payment to $531,000."
        },
        {
            "example": "A 5-year senior unsecured corporate bond with a 40% recovery rate trades with a 180 bps CDS par spread and a 3% risk-free rate. Calibrating the reduced-form intensity model yields a constant annual hazard rate of 3.0932%, implying an 85.67% cumulative survival probability and a 14.33% 5-year cumulative default probability.",
            "tryIt": "Modify recovery_rate to 0.20 to witness how a lower recovery assumption elevates the calibrated annual hazard rate to over 4.5%."
        },
        {
            "example": "A portfolio manager audits a 10-constituent basket of an investment-grade index trading at 86.5 bps. The average intrinsic single-name spread of the 10 reference entities is 81.0 bps. The resulting credit index basis is +5.5 bps, signaling a positive basis arbitrage opportunity where the manager sells the expensive index and buys protection on the single names.",
            "tryIt": "Set market_traded_index to 77.0 bps to trigger a negative basis arbitrage signal (-4.0 bps)."
        },
        {
            "example": "Following a corporate insolvency, the ISDA Credit Determinations Committee convenes a two-stage auction. Participating dealer quotes establish an Initial Market Midpoint (IMM) of 29.67%, and client requests create a Net Open Interest (NOI) of $120,000,000 net sell. Limit orders from distressed debt funds clear the NOI at 28.0%, fixing the cash settlement payout to protection buyers at 72.0% of notional.",
            "tryIt": "Increase buy_orders in client_orders to $160,000,000 to flip NOI to NET_BUY and observe how buyer demand lifts the final clearing price."
        },
        {
            "example": "A commercial bank credit desk holds a $50,000,000 corporate loan hedging portfolio with a 145 bps spread. The pricer calculates a CS01 sensitivity of $19,831.63 per 1 bps spread shift. Using benchmark 5Y CDX IG contracts with a unit CS01 of $420 per $1M notional, the desk executes an optimal macro delta hedge of $47,218,167 notional to achieve complete spread neutrality.",
            "tryIt": "Bump spread_bps to 200.0 to evaluate how elevated spread levels expand risky PV01 and shift hedge notional requirements."
        }
    ],
    52: [
        {
            "example": "A commercial bank evaluates a $7,200,000 pool of retail vehicle loans for securitization. The portfolio passes the statutory 6-month Minimum Holding Period (MHP) and zero-delinquency standards. Under regulatory skin-in-the-game rules (5% MRR), the originating bank retains $360,000 of first-loss risk, issuing a maximum of $6,840,000 in market-facing asset-backed securities.",
            "tryIt": "Change mrr_pct_req to 10.0 to model heightened supervisory retention mandates on non-standard asset pools."
        },
        {
            "example": "A structured finance legal team audits an auto loan SPV. The trust documentation confirms non-recourse conveyance, perfected UCC-1 registry filings, distinct accounting records, independent governance directors, and a bankruptcy veto clause. The SPV scores 100/100, securing legal true sale isolation and an unqualified non-consolidation opinion.",
            "tryIt": "Set originator_unlimited_recourse to True to observe how retaining credit default guarantees destroys true sale status and recharacterizes the transaction as secured borrowing."
        },
        {
            "example": "An arranging bank sizes the capital stack for a $100,000,000 consumer loan pool with a 2.5% base expected loss. Applying rating agency stress multiples of 4.5x for AAA and 2.0x for Mezzanine BBB requires an 11.25% AAA credit enhancement cushion. The structured stack comprises $88,750,000 Class A (AAA, 88.75%), $6,250,000 Class B (BBB, 6.25%), and a $5,000,000 Equity First-Loss piece (5.0%).",
            "tryIt": "Increase expected_loss_pct to 4.0% to observe how elevated collateral risk expands required AAA subordination to 18.0%."
        },
        {
            "example": "In Month 14 of an auto ABS transaction, cumulative default losses reach 4.8% (breaching the 4.0% seasoning threshold) and overcollateralization dips to 1.032 (breaching the 1.05 target). The structural trigger trips, automatically flipping the waterfall from pro-rata to mandatory sequential-pay turbo amortization, trapping all excess spread to de-leverage senior notes.",
            "tryIt": "Reduce cumulative_losses_pct to 3.2% and restore oc_ratio_current to 1.06 to return the waterfall to normal pro-rata mode."
        },
        {
            "example": "A $50,000,000 loan pool is simulated over 12 months with a 9.5% loan coupon, 12% CPR prepayment, and 3.5% CDR default. Under a sequential-pay waterfall, senior notes amortize down from $42,500,000 to $23,797,897, while the mezzanine notes remain fully intact at $5,000,000, absorbing zero losses and earning full coupons, while equity captures $1,475,257 in excess spread dividends.",
            "tryIt": "Increase cdr_annual to 0.08 to observe how severe recessionary defaults deplete excess spread and threaten junior tranche principal."
        }
    ],
    53: [
        {
            "example": "A collateral manager oversees a $400,000,000 CLO. The senior management fee of 15 bps generates $600,000 annually at the top of the waterfall, while the 25 bps subordinated fee generates $1,000,000 below debt service. Because the portfolio achieved an Equity IRR of 14.5% (clearing the 12.0% hurdle), the manager earns an additional $900,000 incentive fee from residual cash flows.",
            "tryIt": "Lower equity_irr_actual to 11.0% to observe the complete suspension of the manager's incentive fee."
        },
        {
            "example": "A $400,000,000 CLO portfolio holds 6 syndicated corporate loans. Calculating the weighted average rating factors yields a portfolio WARF of 2603.2 (well within the 2900 limit), a Weighted Average Spread (WAS) of 3.694% (clearing the 3.50% hurdle), and a 5.0% CCC asset concentration (safely below the 7.5% cap).",
            "tryIt": "Increase Loan LN-F par to $40,000,000 to trigger an Excess CCC violation (10.0% > 7.5%) and observe the required market-value haircut."
        },
        {
            "example": "An investment bank structures a $400,000,000 CLO 2.0 liability stack. The debt notes total $362,000,000 across Class A (AAA) down to Class E (BB), paying a blended Weighted Average Cost of Debt (WACD) of 180.79 bps over SOFR. With assets yielding 370 bps, the 189.21 bps arbitrage spread generates an estimated 21.73% annual cash yield on the $38,000,000 equity tranche.",
            "tryIt": "Widen Class A spread to 175 bps to observe how liability cost expansion compresses equity cash yield toward 16%."
        },
        {
            "example": "Under credit stress, a CLO collateral pool suffers $15,000,000 in defaulted loans and holds $10,000,000 in excess CCC assets trading at 65 cents. The adjusted collateral principal drops to $388,250,000. The Class A OC test passes at 1.5655 (threshold 1.22), and the Class E OC test passes at 1.0725 (threshold 1.05), requiring zero curative cash diversion.",
            "tryIt": "Increase defaulted_par to $30,000,000 to breach the Class E OC trigger and observe the mandatory cash diversion required to de-leverage senior debt."
        },
        {
            "example": "A 4-quarter CLO simulation under 5% annual default stress and 45% recovery generates $31,874,451 in total interest collections. Total debt interest absorbs $23,283,200. Because the junior OC ratio stays above 1.060 across all quarters, the waterfall distributes $7,225,219 in cash dividends to equity investors, realizing a 19.01% annual cash-on-cash return.",
            "tryIt": "Set default_rate_annual to 0.08 in Q3 and Q4 to witness how OC test failure redirects residual interest to prepay senior Class A debt."
        }
    ],
    54: [
        {
            "example": "A commercial bank evaluates a $1,000,000,000 corporate revolving credit facility portfolio. Because Fortune 500 corporate borrowers fiercely resist public loan sales and credit lines fluctuate daily, the bank selects Synthetic Credit Risk Transfer (CRT). The structure preserves customer banking relationships, avoids assignment notifications, and achieves regulatory RWA relief.",
            "tryIt": "Set relationship_critical to False and funding_need_pct to 80.0 to model a regional non-bank lender selecting Cash True Sale Securitization."
        },
        {
            "example": "A bank structures an SRT on a $1,000,000,000 corporate loan pool with $8,000,000 expected loss. The bank retains a $15,000,000 first-loss piece and transfers 100% of the $65,000,000 mezzanine tranche to private credit funds. The transferred risk represents 8.12x expected loss, clearing the Mezzanine Risk Transfer Test and receiving full supervisory SRT approval.",
            "tryIt": "Reduce mezzanine_pct to 2.0% to observe how inadequate risk transfer results in supervisory rejection of SRT capital relief."
        },
        {
            "example": "A bank compares transferring a $65,000,000 mezzanine tranche via funded Credit-Linked Notes (CLN) versus an unfunded financial guarantee. In the funded CLN, investors deposit $65M cash in Treasury bills, eliminating counterparty credit risk for the bank. In the unfunded guarantee, the bank saves $2,762,500 in annual fees but assumes $65,000,000 in bilateral counterparty risk.",
            "tryIt": "Increase bank_cva_charge_bps to 250.0 to model heightened counterparty risk charges on private insurance guarantors."
        },
        {
            "example": "Under the Basel SEC-SA framework, a $1,000,000,000 corporate loan book (unhedged RWA = $1B, CET1 required = $80M) is restructured synthetically. The senior retained tranche (92%) attaches at 8% and achieves the 15% supervisory floor RWA ($138M), while the 1.5% retained equity requires a 1250% risk weight ($187.5M). Total post-securitization RWA drops to $325.5M, achieving 67.45% RWA relief and liberating $53,960,000 in CET1 capital.",
            "tryIt": "Lower supervisory_floor_rw to 10.0% to model Simple, Transparent, and Standardised (STS) synthetic securitization capital treatment."
        },
        {
            "example": "A bank optimizes a $1,000,000,000 corporate portfolio with a 15.0% baseline ROE. By executing an SRT, the bank pays $5,525,000 in annual mezzanine protection fees but liberates $67,450,000 in CET1 capital. Redeploying the freed capital at a 13% target return generates $8,768,500 in new earnings, expanding total net earnings by $3,243,500 and lifting portfolio ROE from 15.0% to 18.24% (+324.4 bps).",
            "tryIt": "Increase mezz_spread_bps to 1200.0 to determine the breakeven protection spread beyond which ROE expansion turns negative."
        }
    ],
    55: [
        {
            "example": "Apex Global Continental Bank initializes the Sovereign Structured Credit Command Center with $120,000,000 in core CET1 capital. Pre-flight verification confirms that the Credit Derivatives Engine, the CLO Waterfall Engine, and the Synthetic SRT Optimizer are 100% operational, establishing real-time risk coordination across banking books.",
            "tryIt": "Query status['system_readiness'] to verify that all three specialized subsystems pass architectural sanity checks."
        },
        {
            "example": "The Credit Derivatives Desk prices a $50,000,000 corporate loan hedge at 160 bps. It calibrates an annual hazard rate of 0.0267 and computes a CS01 of $19,713.43 per 1 bps spread shift. The CDX index trades with a +5.5 bps basis, signaling an optimal macro delta hedge of $46,936,739 notional to immunize the commercial loan book against spread widening.",
            "tryIt": "Simulate a 50 bps spread widening shock to verify that the mark-to-market gain on the CDX index hedge offsets portfolio loan markdowns."
        },
        {
            "example": "The CLO Desk executes a 4-quarter waterfall for a $400,000,000 vehicle under 5% annual default stress and $12,000,000 in excess CCC assets. The junior OC ratio stays above 1.063 across all quarters, avoiding curative de-leveraging and distributing $7,025,939 in cash dividends to equity investors, achieving an 18.49% annualized cash yield.",
            "tryIt": "Stress default_rate_annual to 8% to observe how the Class E OC test failure redirects residual interest to de-leverage Class A senior debt."
        },
        {
            "example": "The Synthetic SRT Desk restructures a $1,000,000,000 corporate revolving credit portfolio under Basel SEC-SA rules. Retaining the 92% senior tranche at a 15% risk weight and transferring the 6.5% mezzanine tranche delivers $674,500,000 in RWA relief (-67.45%) and frees up $67,450,000 in CET1 capital, expanding portfolio ROE from 15.0% to 18.24% (+324.4 bps).",
            "tryIt": "Adjust target_cet1_ratio to 0.12 to observe how higher institutional capital targets expand the volume of liberated CET1 capital."
        },
        {
            "example": "Under a simulated Global Credit Contagion scenario (+150 bps spread shock, 7% defaults, 35% recoveries), the command center maintains enterprise solvency: the derivatives desk generates +$2,862,299 in CDX hedge gains, the CLO preserves 100% principal protection for senior debt, and the synthetic SRT structure absorbs defaults, maintaining the bank's CET1 ratio safely at 12.8%.",
            "tryIt": "Run run_grand_capstone_stress_test() with a 200 bps spread shock to verify that multi-desk defenses hold under catastrophic market dislocations."
        }
    ]
}

def enrich():
    for day_num in range(51, 56):
        path = f"scripts/branch_b/day{day_num}_ban_data.json"
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
            
        data.pop("id", None)
        data.pop("courseId", None)
        
        for idx, part in enumerate(data["parts"]):
            part.pop("id", None)
            part.pop("courseId", None)
            
            ex_data = examples_and_tryits[day_num][idx]
            part["example"] = ex_data["example"]
            part["tryIt"] = ex_data["tryIt"]
            
            check = part["check"]
            check["answer"] = 0
            check["answerIndex"] = 0
            
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
            
        print(f"Enriched Day {day_num} successfully!")

if __name__ == "__main__":
    enrich()
