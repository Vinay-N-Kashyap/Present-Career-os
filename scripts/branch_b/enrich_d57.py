import json

with open("scripts/branch_b/day57_ban_data.json", "r", encoding="utf-8") as f:
    d = json.load(f)

# Enrich Part 1
extra_p1 = (
    " Delving deeper into the statutory capital framework governing Primary Dealers, central bank regulations impose rigid "
    "prudential capital adequacy requirements on standalone PDs. Under international standards and RBI guidelines, Primary Dealers "
    "must maintain a minimum Capital to Risk-Weighted Assets Ratio (CRAR) of 15.0%, significantly higher than the standard 9.0% or 11.5% "
    "ratio required for diversified commercial banks. This elevated capital buffer is mandatory because a Primary Dealer's balance sheet "
    "is overwhelmingly concentrated in market risk—specifically interest rate duration risk and yield curve basis risk. A sudden upward "
    "shift of fifty basis points across the sovereign yield curve can inflict massive marked-to-market trading losses on a PD's multi-thousand-crore "
    "government bond inventory, rapidly eroding Tier 1 capital. To mitigate this volatility, PD trading desks utilize interest rate swaps "
    "(IRS), overnight indexed swaps (OIS), and bond futures to dynamically hedge the duration of their underwriting pipeline."
)
d["parts"][0]["say"].append(extra_p1)

# Enrich Part 2
extra_p2 = (
    " Delving further into the strategic bidding behavior of primary dealers, empirical auction theory demonstrates that the choice "
    "between Uniform Price and Multiple Price formats profoundly shapes market concentration and bidding collusion risks. In Multiple "
    "Price auctions, large institutional bidders with superior market intelligence—such as the largest state-owned banks and dominant "
    "primary dealers—enjoy a decisive informational advantage over smaller market participants. They can submit multi-tiered bids across "
    "a wide yield distribution, capturing portions of the issue at low yields while cherry-picking the marginal cut-off. In sharp contrast, "
    "Uniform Price auctions level the playing field by eliminating price discrimination, encouraging broader participation by regional "
    "cooperative banks, corporate treasuries, and foreign institutional investors. Furthermore, debt management offices closely monitor "
    "the 'bid-to-cover ratio'—calculated as total competitive bids submitted divided by the total issuance notional. A healthy sovereign "
    "auction typically achieves a bid-to-cover ratio of two to three times, signaling robust systemic appetite and pricing confidence."
)
d["parts"][1]["say"].append(extra_p2)

# Enrich Part 3
extra_p3 = (
    " Delving deeper into the tax and accounting mechanics of STRIPS, institutional investors must account for the unique treatment "
    "of zero-coupon imputed interest (original issue discount, OID). Under standard tax codes, the annual accretion in the present "
    "value of a zero-coupon STRIP is treated as taxable interest income each year, even though the investor receives zero physical "
    "cash until the security matures. For tax-paying commercial corporations, this creates an adverse 'phantom income' tax liability, "
    "requiring them to pay taxes on cash flows they have not yet collected. However, for tax-exempt pension funds, sovereign wealth "
    "entities, and life insurance annuity reserves, phantom income is completely irrelevant. These tax-exempt institutions represent the "
    "natural, long-term buy-and-hold investor base for STRIPS. Moreover, treasury quantitative desks actively monitor the 'STRIPS basis'—the "
    "pricing differential between the sum of individual stripped components and the unstripped physical bond. When yield curve twists "
    "create momentary pricing anomalies, arbitrage desks rapidly assemble or disassemble bond packages to capture riskless profits."
)
d["parts"][2]["say"].append(extra_p3)

# Enrich Part 4
extra_p4 = (
    " Furthermore, quantitative fixed-income desks must address the mathematical limitations of the basic three-factor Nelson-Siegel "
    "model when fitting complex, multi-peaked sovereign yield curves. During periods of macroeconomic transition or segmented market "
    "liquidity, sovereign yield curves often exhibit multiple local humps or troughs that cannot be captured by a single curvature "
    "parameter $\\beta_2$. To overcome this restriction, Lars Svensson extended the framework into the six-parameter 'Nelson-Siegel-Svensson "
    "(NSS) model' by introducing a second curvature component $\\beta_3$ and a second scale parameter $\\tau_2$. The NSS model formulation "
    "is expressed as: $y(t) = \\beta_0 + \\beta_1 \\left( \\frac{1 - e^{-t/\\tau_1}}{t/\\tau_1} \\right) + \\beta_2 \\left( \\frac{1 - e^{-t/\\tau_1}}{t/\\tau_1} - e^{-t/\\tau_1} \\right) + \\beta_3 \\left( \\frac{1 - e^{-t/\\tau_2}}{t/\\tau_2} - e^{-t/\\tau_2} \\right)$. "
    "This dual-curvature architecture enables sovereign debt offices to fit both short-end money market liquidity dislocations and long-end "
    "pension duration demand humps simultaneously, ensuring flawless calibration across thirty distinct benchmark tenors."
)
d["parts"][3]["say"].append(extra_p4)

# Enrich Part 5
extra_p5 = (
    " Delving into the comprehensive institutional risk governance of the sovereign primary war room, primary dealers must establish "
    "strict intraday Value-at-Risk (VaR) and stop-loss limits to manage devolvement exposure. When a devolvement occurs, the primary "
    "dealer's balance sheet is suddenly saddled with hundreds of crores in unhedged, long-duration sovereign debt. If global bond markets "
    "continue to sell off during the subsequent trading sessions, the dealer's proprietary capital can be rapidly decimated. Therefore, "
    "sophisticated PD trading desks maintain pre-authorized 'macro duration hedging protocols'. Immediately upon receiving confirmation "
    "of a devolvement allocation from the central bank, the desk initiates proxy hedges—such as paying fixed in 10-year or 5-year Overnight "
    "Indexed Swaps (OIS) or shorting benchmark bond futures contracts on electronic exchanges. These derivative overlays immunize the "
    "dealer's net inventory against further interest rate spikes while the quantitative distribution desk executes its STRIPS decoupling "
    "and institutional private placement. Mastering this high-stakes interplay between primary auction underwriting, derivative hedging, "
    "and zero-coupon structural engineering is what distinguishes premier sovereign market makers from vulnerable trading casualties."
)
d["parts"][4]["say"].append(extra_p5)

with open("scripts/branch_b/day57_ban_data.json", "w", encoding="utf-8") as f:
    json.dump(d, f, indent=2)

print("Enriched Day 57 successfully!")
