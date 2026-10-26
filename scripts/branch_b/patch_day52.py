# -*- coding: utf-8 -*-
"""
Patch build_day52_ban.py with >= 640 words per part.
"""

with open("scripts/branch_b/build_day52_ban.py", "r", encoding="utf-8") as f:
    text = f.read()

# Part 1 Extra
p1_extra = (
    "Furthermore, sovereign debt architecture integrates fiscal sustainability benchmarks established under national statutes such as the Fiscal Responsibility and Budget Management (FRBM) Act. Governments monitor the Debt-to-GDP ratio—targeting sustainable thresholds such as 60 percent for general government debt (comprising 40% central government and 20% state governments)—to preserve sovereign creditworthiness and avoid debt-trap dynamics. In addition to conventional dated securities, sovereign issuers increasingly offer specialized debt instruments: Sovereign Green Bonds (SGrBs), whose proceeds are strictly ring-fenced for renewable energy and climate mitigation projects, Inflation-Indexed Bonds (IIBs), and Floating Rate Bonds (FRBs) linked to Treasury Bill benchmarks. "
    "Concurrently, sovereign debt managers coordinate the issuance of State Development Loans (SDLs) on behalf of provincial and state governments. While SDLs carry sovereign-equivalent safety, they trade at a structural credit spread of 30 to 60 basis points over central government benchmark bonds due to lower secondary market liquidity and variations in regional fiscal discipline. Commercial bank treasuries actively exploit these yield differentials, accumulating high-yielding SDLs to satisfy statutory liquidity ratio quotas while enhancing net portfolio interest returns."
)

# Part 2 Extra
p2_extra = (
    "The regulatory taxonomy of the primary dealer ecosystem distinguishes between Standalone Primary Dealers (SPDs)—independent non-banking financial companies whose sole business is government bond underwriting and secondary market trading—and Bank Primary Dealers (BPDs)—commercial banks licensed to operate integrated primary dealership desks within their treasury departments. Standalone PDs operate under stringent capital supervision, requiring continuous monitoring of their Net Owned Funds and exposure limits, but enjoy operational agility in specialized proprietary trading. "
    "Furthermore, Primary Dealers serve as the critical transmission channel for sovereign debt rebalancing through central bank Debt Switch and Buyback Operations. In a debt switch, the central bank buys back illiquid, short-dated sovereign bonds from primary dealers and simultaneously issues liquid, long-dated benchmark securities of equivalent value. Primary Dealers facilitate these balance sheet restructuring operations, helping the sovereign government smooth out impending redemption spikes and reduce annual debt rollover risks without requiring net cash budget outlays."
)

# Part 3 Extra
p3_extra = (
    "The ongoing debate in monetary economics between Multiple-Price and Uniform-Price auction formats is underpinned by Milton Friedman's canonical auction hypothesis. Friedman famously posited that Multiple-Price (discriminatory) auctions induce substantial 'bid-shading'—where rational market participants intentionally submit lower price bids to protect themselves against the Winner's Curse. Friedman argued that switching to a Uniform-Price auction eliminates this defensive bid-shading, encouraging broader investor participation, fostering aggressive bidding, and ultimately lowering the sovereign's long-term borrowing costs. "
    "In institutional trading rooms, treasury portfolio managers employ quantitative yield curve econometric models to determine their auction bidding schedules. Dealers analyze the spread between 'On-the-Run' bonds (the most recently issued benchmark securities, which trade with high liquidity and tight bid-ask spreads) and 'Off-the-Run' seasoned bonds (older, less liquid issuances that trade at higher yields). By mapping auction offerings against prevailing off-the-run yield curves, bank traders identify relative-value arbitrage opportunities, submitting laddered bid schedules that maximize acquisition yields while protecting trading books against adverse market volatility."
)

# Part 4 Extra
p4_extra = (
    "In modern digital sovereign debt markets, retail participation has been revolutionized through direct-access central bank infrastructure (such as the RBI Retail Direct portal or US TreasuryDirect). Retail investors can open specialized Gilt Accounts directly with the central bank, enabling individuals to participate seamlessly in non-competitive auction biddings and secondary market trading without incurring commercial brokerage fees or custody charges. This direct retail distribution mechanism expands national savings mobilization, reduces sovereign reliance on volatile foreign institutional flows, and fosters broad-based public investment in national capital assets. "
    "The operational timeline of Greenshoe Option exercise requires rapid executive decision-making. Following the close of competitive bidding at 12:00 PM, the central bank public debt committee reviews the aggregate bid book. If the auction exhibits massive demand with bid-to-cover ratios exceeding 2.0x and bids tightly clustered around the reserve price, the committee announces the Greenshoe overallotment by 2:00 PM. This tactical window allows the sovereign to capture cheap institutional liquidity while signaling strong fiscal confidence to domestic and international capital markets."
)

# Part 5 Extra
p5_extra1 = (
    "At an enterprise level, the master sovereign auction simulator integrates directly with commercial bank fixed-income portfolio risk systems. Every bond won at auction is immediately categorized into the bank's investment classifications: Held to Maturity (HTM), Available for Sale (AFS), or Held for Trading (HFT). The simulator projects the immediate balance sheet impact: bonds placed in AFS and HFT books are marked to market on a daily basis, directly influencing Common Equity Tier 1 (CET1) capital through Other Comprehensive Income (OCI) reserves, while HTM bonds are shielded from mark-to-market volatility and carried at amortized cost. "
    "Furthermore, the simulator models the post-auction secondary market liquidity rollout. Once primary allocations settle on T+1, primary dealers and commercial bank trading desks provide immediate two-way market-making on electronic order-matching platforms (NDS-OM). The engine calculates the expected bid-ask spread and liquidity turnover over the subsequent five trading days, evaluating whether the primary syndicate can profitably distribute excess inventory to institutional pension funds, corporate treasuries, and retail gilt accounts."
)
p5_extra2 = (
    "Ultimately, commanding the full architecture of sovereign debt issuance, Primary Dealer underwriting mandates, competitive auction clearing algorithms, and devolvement protocols transforms banking practitioners into elite sovereign debt strategists. By bridging the critical gap between macroeconomic fiscal policy and tactical treasury execution, enterprise market specialists optimize sovereign financing, safeguard institutional liquidity, and reinforce national financial stability."
)

text = text.replace(
    'p1_say = [',
    f'p1_say = [\n    """{p1_extra}""",\n'
)

text = text.replace(
    'p2_say = [',
    f'p2_say = [\n    """{p2_extra}""",\n'
)

text = text.replace(
    'p3_say = [',
    f'p3_say = [\n    """{p3_extra}""",\n'
)

text = text.replace(
    'p4_say = [',
    f'p4_say = [\n    """{p4_extra}""",\n'
)

text = text.replace(
    'p5_say = [',
    f'p5_say = [\n    """{p5_extra1}""",\n    """{p5_extra2}""",\n'
)

with open("scripts/branch_b/build_day52_ban.py", "w", encoding="utf-8") as f:
    f.write(text)

print("Updated build_day52_ban.py successfully!")
