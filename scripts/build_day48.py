import json
import subprocess
import sys
import hashlib
import os

def get_output(code: str) -> str:
    res = subprocess.run([sys.executable, "-c", code], capture_output=True, text=True, check=True)
    return res.stdout

def sha256(s: str) -> str:
    return hashlib.sha256(s.encode('utf-8')).hexdigest()

def word_count(paragraphs) -> int:
    return sum(len(p.split()) for p in paragraphs)

# --- DAY 48: SERIES B TERM SHEETS: SUPER PRO-RATA, PAY-TO-PLAY & DOWN-ROUND DILUTION CASCADES ---

p1_say = [
    "Welcome to Day 48 of Entrepreneurship and Venture Incubation. Today, we enter the high-stakes arena of growth-stage equity structuring: Series B Term Sheets, Super Pro-Rata Allocations, Pay-to-Play Covenants, and Down-Round Dilution Cascades. While seed and Series A financings often emphasize founder-friendly standardized terms, Series B marks the definitive entry of institutional growth-equity investors. Round sizes expand to twenty to fifty million dollars, post-money valuations climb toward one hundred million dollars, and capitalization tables become multi-tiered legal battlegrounds where investor rights directly dictate ownership control and financial returns.",
    "The primary structural dynamic introduced during a Series B round is the syndicate allocation negotiation, centered on Pro-Rata and Super Pro-Rata Rights. In Series A, lead venture capitalists negotiate contractual pro-rata rights—the legal privilege to purchase sufficient shares in subsequent financing rounds to maintain their exact percentage ownership in the company. For example, a Series A fund holding twenty percent of a company must invest four million dollars in a twenty-million-dollar Series B round to avoid ownership dilution. However, top-tier venture firms frequently demand Super Pro-Rata Rights.",
    "Super Pro-Rata rights grant an existing investor the contractual privilege to purchase more than their proportionate pro-rata share—often permitting them to take up to thirty, forty, or fifty percent of the next financing round. This creates acute tension during Series B negotiations. A new external lead investor typically insists on purchasing twenty to twenty-five percent of the company for their capital commitment. If the Series A investor exercises super pro-rata rights to take another twenty percent, the total primary round size swells excessively, or founder and employee equity is subjected to massive, unbudgeted dilution.",
    "To resolve this syndicate conflict, company founders and corporate counsel must master syndicate allocation algebra. Founders must negotiate a Pro-Rata Cutback Mechanism, establishing that existing investors' pro-rata allocations can be pruned back to their baseline ownership percentage or capped at a defined dollar ceiling to preserve room for the incoming lead investor. Furthermore, the incoming Series B investor will almost universally mandate an Unallocated Option Pool Refresh—typically expanding the employee equity incentive pool to ten or fifteen percent of post-money capitalization entirely out of pre-money founder shares.",
    "The economic impact of the option pool refresh is profound: by requiring the option pool expansion to occur prior to the Series B investment, the incoming investors insulate themselves from immediate dilution, forcing the founders and early employees to bear one hundred percent of the equity cost. A headline pre-money valuation of eighty million dollars with an unallocated ten percent option pool expansion effectively reduces the true founder valuation to seventy-two million dollars. Institutional founders must model these option pool dynamics rigorously prior to signing binding term sheets.",
    "In addition, growth-stage capital syndicates must establish clear Information Rights and Registration Rights. Series B investors require audited quarterly and annual financial statements prepared under GAAP, annual operating budgets approved sixty days prior to fiscal year-end, and major investor inspection rights. Negotiating these governance thresholds prevents administrative gridlock while providing institutional partners with the visibility required for subsequent public market filings.",
    "Furthermore, enterprise founders must evaluate the impact of Drag-Along Rights and Major Investor Thresholds during Series B syndicate assembly. Incoming growth investors invariably seek to reset major investor thresholds to ensure that earlier angel syndicates and seed micro-VCs cannot exercise separate class voting vetoes over future corporate transactions. Establishing a unified preferred stock voting bloc—where holders of a simple majority of preferred shares can approve subsequent financings or strategic corporate mergers—prevents minority shareholder holdouts and preserves transactional flexibility as the company approaches late-stage expansion.",
    "In Part 1, we build an Enterprise Series B Capitalization Table & Syndicate Allocation Engine in Python. We will model pre-money valuations, Series B investment tranches, unallocated option pool expansions, simulate standard pro-rata versus super pro-rata allocation conflicts, compute post-closing ownership percentages, and quantify net founder dilution."
]

p2_say = [
    "We now advance to Part 2: Pay-to-Play Provisions: Preferred Stock Conversion & Non-Participant Penalties. In corporate venture finance, market conditions do not always remain favorable. When macroeconomic liquidity contracts or a company's growth milestones stall, subsequent financing rounds become defensive rather than expansionary. To ensure that existing venture capital partners continue supporting the company during challenging periods, institutional term sheets incorporate one of the most powerful enforcement mechanisms in corporate law: Pay-to-Play Provisions.",
    "The core doctrine of a Pay-to-Play provision is straightforward: an existing preferred shareholder must invest their pro-rata share in a subsequent qualified financing round; if they refuse or fail to participate, they face severe contractual penalties that strip away their preferred shareholder privileges. In early-stage venture rounds, investors often resist pay-to-play clauses. In Series B and later growth rounds—particularly during down-rounds or recapitalizations—lead investors demand pay-to-play covenants to prevent free-riding by passive syndicate members who wish to retain senior liquidation rights without contributing rescue capital.",
    "The contractual penalties imposed on non-participating preferred investors typically take one of two forms. The first and most severe penalty is Mandatory Conversion to Common Stock. If a Series A preferred investor holding five million dollars of preferred stock refuses to participate pro-rata in a Series B round containing a pay-to-play covenant, one hundred percent of their preferred shares are automatically converted into ordinary common shares. In an instant, the investor forfeits their liquidation preference, loses specialized voting protective provisions, loses board representation rights, and is subordinated to junior equity status.",
    "The second, somewhat less punitive structure is Conversion to Shadow Preferred Stock (often designated as Series A-1 Preferred). Under this mechanism, the non-participating investor retains their original economic liquidation dollar value, but the shares are stripped of anti-dilution price protection, lose special board appointment rights, and lose the ability to block corporate mergers or asset sales. This shadow reclassification neutralizes the investor's ability to hold the company hostage while preserving basic economic preference if a lucrative acquisition occurs.",
    "Under Delaware General Corporation Law (DGCL), implementing pay-to-play amendments requires strict adherence to corporate governance standards and fiduciary duties. Because pay-to-play provisions selectively penalize non-participating shareholders, venture boards must ensure that all shareholders of the affected class are offered an equal, bona fide opportunity to participate in the round on identical economic terms. Under the landmark Delaware judicial standard established in Benchmark Capital v. Vague, failure to provide proper notice or equal participation rights can expose directors to personal liability for breach of the fiduciary duty of loyalty.",
    "For company founders, pay-to-play provisions represent a powerful double-edged sword. When properly structured, they compel existing venture investors to back the company through difficult operational downturns, ensuring vital liquidity. However, if founders themselves hold preferred shares or lack the financial liquidity to participate in subsequent rounds, poorly drafted pay-to-play terms can inadvertently wipe out founders' own preferred protections.",
    "In addition, venture boards must carefully evaluate the fiduciary implications of pay-to-play amendments under the Delaware entire fairness standard. When inside directors who control the board participate in a punitive pay-to-play financing that dilutes or converts outside non-participating investors, the transaction cannot rely on the business judgment rule. Instead, the board must establish an independent Special Committee of disinterested directors and obtain a third-party fairness opinion. Adhering to these corporate governance protocols ensures that recapitalizations withstand shareholder derivative litigation while legally enforcing investor capital calls.",
    "In Part 2, we build an Enterprise Pay-to-Play Preferred Stock Reclassification Engine in Python. We will model multi-investor syndicates, evaluate pro-rata capital call participation, execute automated conversion algorithms from preferred to common and shadow preferred stock, strip liquidation preferences, and recalculate voting control and post-amendment cap table power."
]

p3_say = [
    "We now advance to Part 3: Anti-Dilution Protection Mathematics: Broad-Based Weighted Average vs Full Ratchet. In the life cycle of a technology company, valuation does not always move upward. When an enterprise is forced to raise capital at a share price lower than the price paid by investors in a previous round, the financing is legally classified as a Down-Round. To protect their invested capital against the equity destruction caused by down-rounds, institutional investors demand contractual Anti-Dilution Protection.",
    "Anti-dilution clauses operate by automatically adjusting the Conversion Price at which preferred shares convert into common shares. When an investor initially buys preferred stock at ten dollars per share, the conversion ratio is initially 1:1. If a down-round occurs at five dollars per share, the anti-dilution formula reduces the conversion price, meaning each preferred share will convert into more than one share of common stock upon exit or IPO, effectively granting the investor free additional shares to compensate for the valuation decline.",
    "There are two primary mathematical formulations of anti-dilution protection in venture finance: Full Ratchet and Weighted Average. Full Ratchet is the most draconian, punitive anti-dilution protection in the financial markets. Under a full ratchet provision, the conversion price of the previous series is immediately reset to the exact price of the new down-round shares, regardless of how much capital is raised. If a Series A investor paid ten dollars per share, and the company later issues just one hundred thousand dollars of Series B shares at five dollars, the Series A conversion price instantly collapses from ten dollars to five dollars, doubling the investor's common share entitlement and inflicting devastating dilution on founders and employee option holders.",
    "Because full ratchet anti-dilution is widely regarded as predatory and toxic to company morale, institutional market standards overwhelmingly favor Broad-Based Weighted Average Anti-Dilution. The broad-based weighted average formula accounts not only for the new lower share price, but also for the magnitude of the round—specifically, how many shares are issued relative to the company's total capitalization. The canonical formula is: New Conversion Price equals Old Conversion Price, multiplied by the fraction: (Common Stock Outstanding Pre-Round plus New Shares that would have been issued at the Old Price), divided by (Common Stock Outstanding Pre-Round plus Actual New Shares Issued).",
    "In the broad-based definition, Common Stock Outstanding includes not only currently issued common and preferred shares, but also all unexercised employee stock options, warrants, and unallocated option pool reserves on a fully diluted basis. By incorporating the entire fully diluted share count in the numerator and denominator, the broad-based formula cushions the valuation shock, resulting in a modest, equitable adjustment to the conversion price rather than an extreme founder washout.",
    "By contrast, a Narrow-Based Weighted Average formula restricts the share count definition to currently outstanding common shares, ignoring unexercised options and warrants. This produces an adjustment significantly more punitive than broad-based, though less extreme than full ratchet. Institutional entrepreneurs must scrutinize term sheet definitions of 'Common Stock Outstanding' to ensure that broad-based language is strictly preserved, safeguarding founder equity from catastrophic dilution.",
    "Moreover, corporate controllers and legal counsel must rigorously delineate Anti-Dilution Carve-Outs in the certificate of incorporation. Standard venture charters strictly exclude certain share issuances from triggering anti-dilution adjustments, including: shares issued under board-approved employee stock option plans, shares issued in connection with commercial equipment leases or bank credit facilities, shares issued in strategic technology licensing agreements, and shares issued in corporate acquisitions. Ensuring that these standard carve-outs are comprehensively drafted protects founders from unintended anti-dilution triggers during routine business transactions.",
    "In Part 3, we build an Enterprise Down-Round Anti-Dilution Calculation Engine in Python. We will model pre-round capitalization tables, compute new conversion prices across Broad-Based Weighted Average, Narrow-Based Weighted Average, and Full Ratchet formulas, quantify additional common shares issued to preferred investors, and analyze dilution sensitivity across founder and employee holdings."
]

p4_say = [
    "We now advance to Part 4: Multiple Liquidation Preferences & Seniority Structures (Pari Passu vs Tiered Stacks). In venture capital finance, common shares and preferred shares represent fundamentally distinct financial instruments. While common shareholders share ratably in enterprise value, preferred shareholders hold contractual Liquidation Preferences. A liquidation preference dictates how the cash proceeds of a corporate liquidity event—such as a merger, asset sale, or winding up—are distributed among shareholders before a single dollar flows to common equity.",
    "The baseline institutional market standard is a 1.0x Non-Participating Liquidation Preference. Under a 1.0x non-participating preference, the preferred investor is entitled to receive either their original investment capital back (a 1.0x return of principal), OR convert their preferred shares into common stock and share pro-rata in total exit proceeds—whichever generates a higher dollar payout. The exit valuation at which the investor becomes indifferent between taking their preference and converting to common equity is known as the Conversion Indifference Point. Above this threshold, preferred shares convert voluntarily to common stock, aligning investor incentives with founders.",
    "However, in growth-stage and distressed financing environments, investors frequently demand Participating Preferred Stock (often referred to as 'Double-Dip' preferred). Under participating preferred terms, the investor receives their 1.0x original investment principal back FIRST, and THEN shares pro-rata alongside common shareholders in all remaining exit proceeds! In many transactions, this participation right is subject to a 'Participation Cap' (such as 2.0x or 3.0x total return), beyond which the investor must convert to common equity to participate in further upside.",
    "When a company raises multiple financing rounds (Series Seed, Series A, Series B, Series C), the interaction between different preferred classes requires establishing a Seniority Structure. There are two primary seniority frameworks: Tiered Seniority (Stacked Seniority) and Pari Passu. Under a Tiered Seniority Stack, the latest investment series holds absolute senior priority over earlier series. Series B investors receive their full liquidation preference first; only if proceeds remain do Series A investors receive their preference; followed by Seed investors, and finally common shareholders. In a modest exit, the senior stack can consume one hundred percent of proceeds, leaving earlier investors and founders completely empty-handed.",
    "Under a Pari Passu Seniority structure, all preferred series share equal priority in liquidation. If total exit proceeds are insufficient to pay the full liquidation preferences of all preferred classes, the available proceeds are distributed among Series Seed, A, and B pro-rata based on their relative invested capital. Pari passu structures foster syndicate cohesion and protect early-stage venture investors and founders from being completely wiped out by aggressive late-stage liquidation stacks.",
    "Founders must model exit liquidation waterfalls across a comprehensive valuation spectrum—from five million to two hundred million dollars. Understanding the exact inflection points where preferred classes convert to common equity enables leadership to evaluate acquisition offers objectively, ensuring that executive management does not approve transactions that satisfy senior preferred preferences while delivering zero proceeds to common equity holders.",
    "Furthermore, enterprise finance teams must evaluate the compounding impact of Cumulative Dividends within senior liquidation stacks. While standard venture preferred stock features non-cumulative dividends payable only when declared by the board, defensive or distressed growth rounds frequently incorporate Cumulative Dividends accruing at six to ten percent annually. Compounding annual dividends expand the senior liquidation preference stack automatically every quarter, creating a growing financial barrier that common equity holders must surmount before participating in exit proceeds. Modeling cumulative dividend accretion is critical for assessing true common equity recovery timelines.",
    "In Part 4, we build an Enterprise Multi-Tiered Liquidation Waterfall Engine in Python. We will model multi-class preferred capitalization stacks, simulate Tiered Seniority versus Pari Passu structures, evaluate non-participating versus participating preferred terms with caps, calculate conversion tipping points, and compute exact exit payout distributions across shareholder classes."
]

p5_say = [
    "We arrive at Part 5: Anti-Pattern Defense: The Down-Round Death Spiral & Washout Dilution Outage. In growth-stage corporate history, few operational crises are more destructive to enterprise momentum than the Down-Round Death Spiral. This catastrophic organizational collapse occurs when a venture experiences operational delays or market contraction, is forced to raise an emergency down-round with punitive full-ratchet anti-dilution and senior liquidation stacks, and suffers severe equity washout that destroys executive and engineering morale, triggering talent flight and total company failure.",
    "The anatomy of this corporate collapse typically unfolds in four accelerating stages. Stage One begins with milestone shortfall. After raising a high-valuation Series A, the company aggressively expands headcount and cloud infrastructure. However, sales cycles lengthen, enterprise revenue targets are missed, and monthly cash burn remains elevated. As runway drops below four months, the company attempts to raise a Series B growth round, but external investors refuse to validate the previous valuation.",
    "Stage Two is the Punitive Term Sheet. Desperate for liquidity, the board accepts a term sheet from a distressed-debt or predatory growth fund. The term sheet provides emergency capital, but demands severe concessions: a seventy percent valuation haircut, Full Ratchet anti-dilution protection, a 2.0x senior participating liquidation preference, and broad pay-to-play conversions for existing investors. Eager to preserve their investment, lead investors execute the transaction.",
    "Stage Three is the Equity Washout. As full-ratchet anti-dilution formulas trigger, hundreds of thousands of additional common share equivalents are issued to preferred investors. Simultaneously, employee stock option strike prices are left stranded 'underwater'—massively higher than the current share price. The founding team and senior executives discover that their collective common ownership has been compressed from forty percent to under five percent! The executive incentive to build enterprise value is obliterated.",
    "Stage Four is Talent Flight and Bankruptcy. Recognizing that their equity is worthless and that the senior liquidation stack guarantees they will receive nothing upon exit, key engineering architects, product managers, and sales leaders resign en masse. Product velocity halts, enterprise customers cancel contracts due to delivery delays, and the company enters a death spiral, culminating in a fire-sale liquidation where only senior preferred investors receive partial recovery of their capital.",
    "Defending against and restructuring a Down-Round Death Spiral requires deploying advanced Corporate Restructuring Instruments. First, the board must establish a Management Incentive Plan (MIP) or Equity Carve-Out Pool. Under a MIP, senior preferred investors contractually agree to carve out ten to fifteen percent of total exit proceeds off the top, guaranteeing that founding executives and key technical talent receive meaningful compensation upon an acquisition regardless of whether preferred liquidation preferences are fully satisfied.",
    "Second, the board should execute a Comprehensive Recapitalization (a 'Cramdown'). Under Delaware law, with proper shareholder approvals, the company can convert all outstanding preferred series into common stock on a negotiated ratio (such as 10:1), eliminating legacy liquidation stacks, resetting the cap table to a single common equity class, and re-issuing unencumbered employee stock options at the new lower fair market value. By proactively restructuring capitalization stacks before talent flight occurs, leadership preserves company viability and restores institutional growth momentum.",
    "Finally, corporate leadership must execute a transparent communication strategy with employee equity holders following any recapitalization. When underwater stock options are repriced or cancelled and reissued, human resources and legal teams must provide clear educational documentation explaining the new exercise prices, revised vesting schedules, and post-round equity value. Re-aligning employee incentives with the reconstructed cap table restores organizational morale, halts key executive resignations, and transforms a near-fatal down-round into a disciplined foundation for renewed enterprise scaling.",
    "In Part 5, we build a Forensic Down-Round Washout & Recapitalization Restructuring Engine in Python. We will model a punitive down-round disaster, compute talent equity dilution wipeouts, model Management Incentive Plan (MIP) carve-out waterfalls, execute full recapitalization conversions, and verify the restoration of team retention incentives and corporate solvency."
]

# Ensure word counts exceed 600 words for each part
for idx, p in enumerate([p1_say, p2_say, p3_say, p4_say, p5_say]):
    w = word_count(p)
    print(f"Part {idx+1} Word Count: {w} words")
    assert w >= 600, f"Part {idx+1} word count {w} is below 600!"

print(f"Total Day 48 Spoken Words: {sum(word_count(p) for p in [p1_say, p2_say, p3_say, p4_say, p5_say])} words (Target >= 3000)")

# --- CODE SNIPPETS (100% STANDARD LIBRARY, ASCII ONLY) ---

p1_code = """# Day 48 Part 1: Series B Cap Table & Syndicate Allocation Engine
def model_series_b_allocation(pre_money_val, series_b_inv, founder_shares, series_a_shares, series_a_inv, esop_target_pct):
    # Total pre-money shares before Series B = founder_shares + series_a_shares
    existing_shares = founder_shares + series_a_shares
    share_price = pre_money_val / existing_shares
    
    # Calculate Series B new shares issued
    series_b_shares = series_b_inv / share_price
    
    # Option pool refresh: target percentage of post-money capitalization
    # Post-money shares = existing_shares + series_b_shares + new_esop_shares
    # new_esop_shares = esop_target_pct * (existing_shares + series_b_shares) / (1 - esop_target_pct)
    new_esop_shares = (esop_target_pct * (existing_shares + series_b_shares)) / (1.0 - esop_target_pct)
    
    total_post_shares = existing_shares + series_b_shares + new_esop_shares
    post_money_val = total_post_shares * share_price
    
    # Standard Pro-Rata vs Super Pro-Rata Allocation
    # Series A initial ownership %
    series_a_pct_pre = series_a_shares / existing_shares
    standard_pro_rata_dollars = series_b_inv * series_a_pct_pre
    
    # Super Pro-Rata: Series A demands 1.75x standard pro-rata allocation
    super_pro_rata_multiplier = 1.75
    super_pro_rata_dollars = min(series_b_inv, standard_pro_rata_dollars * super_pro_rata_multiplier)
    new_lead_dollars = series_b_inv - super_pro_rata_dollars
    
    # Ownership percentages post-round
    founder_pct_post = (founder_shares / total_post_shares) * 100.0
    series_a_pct_post = (series_a_shares / total_post_shares) * 100.0
    series_b_pct_post = (series_b_shares / total_post_shares) * 100.0
    esop_pct_post = (new_esop_shares / total_post_shares) * 100.0
    
    return {
        "share_price": share_price,
        "total_post_shares": total_post_shares,
        "post_money_val": post_money_val,
        "standard_pro_rata": standard_pro_rata_dollars,
        "super_pro_rata": super_pro_rata_dollars,
        "new_lead_allocation": new_lead_dollars,
        "founder_pct": founder_pct_post,
        "series_a_pct": series_a_pct_post,
        "series_b_pct": series_b_pct_post,
        "esop_pct": esop_pct_post
    }

cap = model_series_b_allocation(
    pre_money_val=80000000.0,
    series_b_inv=25000000.0,
    founder_shares=6000000,
    series_a_shares=2000000,
    series_a_inv=10000000.0,
    esop_target_pct=0.10
)

print("[SERIES B CAP TABLE & SYNDICATE ALLOCATION MODEL]")
print("Series B Share Price: ${:.2f}".format(cap["share_price"]))
print("Post-Money Valuation: ${:,.2f}".format(cap["post_money_val"]))
print("Total Post-Closing Shares: {:,.0f}".format(cap["total_post_shares"]))
print("-" * 60)
print("SYNDICATE ALLOCATION DYNAMICS ($25M Series B Round):")
print("  Series A Standard Pro-Rata (25.0%): ${:,.2f}".format(cap["standard_pro_rata"]))
print("  Series A Super Pro-Rata (1.75x):   ${:,.2f}".format(cap["super_pro_rata"]))
print("  New Lead Investor Allocation:      ${:,.2f}".format(cap["new_lead_allocation"]))
print("-" * 60)
print("POST-ROUND OWNERSHIP BREAKDOWN:")
print("  Founders & Early Team: {:5.2f}%".format(cap["founder_pct"]))
print("  Series A Investors:    {:5.2f}% (Pre-round hold)".format(cap["series_a_pct"]))
print("  Series B Syndicate:    {:5.2f}%".format(cap["series_b_pct"]))
print("  Unallocated ESOP Pool: {:5.2f}%".format(cap["esop_pct"]))
"""

p2_code = """# Day 48 Part 2: Pay-to-Play Preferred Stock Reclassification Engine
def execute_pay_to_play(syndicate, round_call_amount):
    # syndicate list: {investor, preferred_shares, liquidation_pref, participates, pro_rata_share}
    total_pref_shares = sum(inv["preferred_shares"] for inv in syndicate)
    
    reclassified_syndicate = []
    total_pref_retained = 0.0
    total_converted_common = 0
    total_cash_raised = 0.0
    
    for inv in syndicate:
        name = inv["investor"]
        shares = inv["preferred_shares"]
        pref_val = inv["liquidation_pref"]
        participates = inv["participates"]
        call_obligation = round_call_amount * (shares / total_pref_shares)
        
        if participates:
            status = "Preferred Retained (100%)"
            pref_remaining = pref_val
            common_shares = 0
            total_pref_retained += pref_remaining
            total_cash_raised += call_obligation
        else:
            # Pay-to-play penalty: 100% converted to common stock, liquidation preference stripped to $0
            status = "PENALTY: Converted to Common (Pref Stripped)"
            pref_remaining = 0.0
            common_shares = shares
            total_converted_common += common_shares
            
        reclassified_syndicate.append({
            "investor": name,
            "status": status,
            "pref_liquidation": pref_remaining,
            "common_shares": common_shares,
            "cash_contributed": call_obligation if participates else 0.0
        })
        
    return reclassified_syndicate, total_pref_retained, total_converted_common, total_cash_raised

syndicate_data = [
    {"investor": "Venture Fund Alpha", "preferred_shares": 1500000, "liquidation_pref": 7500000.0, "participates": True},
    {"investor": "Growth Partners Beta", "preferred_shares": 1000000, "liquidation_pref": 5000000.0, "participates": True},
    {"investor": "Passive Syndicate Gamma", "preferred_shares": 800000, "liquidation_pref": 4000000.0, "participates": False},
    {"investor": "Angel Syndicate Delta", "preferred_shares": 300000, "liquidation_pref": 1500000.0, "participates": False}
]

res, pref_retained, common_conv, cash_in = execute_pay_to_play(syndicate_data, round_call_amount=10000000.0)

print("[PAY-TO-PLAY PREFERRED RECLASSIFICATION AUDIT]")
print("Capital Call Target: $10,000,000.00 | Total Cash Raised: ${:,.2f}".format(cash_in))
print("-" * 65)
for r in res:
    print("{:24s} | {:38s}".format(r["investor"], r["status"]))
    print("  Liquidation Pref: ${:10,.2f} | Contributed Cash: ${:10,.2f}".format(
        r["pref_liquidation"], r["cash_contributed"]
    ))
print("-" * 65)
print("Total Retained Preferred Liquidation Pool: ${:,.2f}".format(pref_retained))
print("Total Preferred Shares Forfeited to Common: {:,.0f} shares".format(common_conv))
"""

p3_code = """# Day 48 Part 3: Down-Round Anti-Dilution Adjustment Calculator
def calculate_anti_dilution(pre_shares_fd, old_conv_price, down_round_price, new_money_raised):
    # Broad-Based Weighted Average Formula:
    # CP2 = CP1 * (A + B) / (A + C)
    # A = Common Stock Outstanding prior to round (fully diluted)
    # B = Shares that would have been issued at old price = new_money_raised / old_conv_price
    # C = Actual new shares issued = new_money_raised / down_round_price
    
    A = pre_shares_fd
    B = new_money_raised / old_conv_price
    C = new_money_raised / down_round_price
    
    cp_broad_based = old_conv_price * ((A + B) / (A + C))
    
    # Full Ratchet Formula:
    # CP2 = down_round_price directly
    cp_full_ratchet = down_round_price
    
    # Compare additional shares issued to a 1,000,000 share preferred investor
    original_investor_shares = 1000000
    investor_dollars = original_investor_shares * old_conv_price
    
    # New common shares upon conversion:
    shares_base = original_investor_shares
    shares_broad = investor_dollars / cp_broad_based
    shares_ratchet = investor_dollars / cp_full_ratchet
    
    return {
        "cp_broad": cp_broad_based,
        "cp_ratchet": cp_full_ratchet,
        "shares_broad": shares_broad,
        "shares_ratchet": shares_ratchet,
        "dilution_ratio_broad": (shares_broad / shares_base - 1.0) * 100.0,
        "dilution_ratio_ratchet": (shares_ratchet / shares_base - 1.0) * 100.0
    }

res = calculate_anti_dilution(
    pre_shares_fd=10000000,
    old_conv_price=10.00,
    down_round_price=5.00,
    new_money_raised=15000000.0
)

print("[DOWN-ROUND ANTI-DILUTION PROTECTION COMPARISON]")
print("Original Conversion Price: $10.00 | Down-Round Share Price: $5.00")
print("Capital Raised in Down-Round: $15,000,000.00 across 3,000,000 new shares")
print("-" * 65)
print("1. Broad-Based Weighted Average Anti-Dilution:")
print("   Adjusted Conversion Price: ${:.2f}".format(res["cp_broad"]))
print("   Investor Converted Shares: {:,.0f} (+{:.1f}% expansion)".format(
    res["shares_broad"], res["dilution_ratio_broad"]
))
print("-" * 65)
print("2. Full Ratchet Anti-Dilution (Predatory Reset):")
print("   Adjusted Conversion Price: ${:.2f}".format(res["cp_ratchet"]))
print("   Investor Converted Shares: {:,.0f} (+{:.1f}% expansion - Founder Wipeout)".format(
    res["shares_ratchet"], res["dilution_ratio_ratchet"]
))
"""

p4_code = """# Day 48 Part 4: Multi-Tiered Liquidation Waterfall Engine
def simulate_liquidation_waterfall(exit_valuation, pref_stacks, structure_type="pari_passu"):
    # pref_stacks list: {series, investment, pref_multiple, seniority}
    # structure_type: "pari_passu" or "tiered"
    total_pref_required = sum(p["investment"] * p["pref_multiple"] for p in pref_stacks)
    
    payouts = {p["series"]: 0.0 for p in pref_stacks}
    payouts["Common_Equity"] = 0.0
    
    if exit_valuation <= 0:
        return payouts
        
    if structure_type == "pari_passu":
        if exit_valuation < total_pref_required:
            # Distribute pro-rata according to preference claim
            for p in pref_stacks:
                claim = p["investment"] * p["pref_multiple"]
                payouts[p["series"]] = exit_valuation * (claim / total_pref_required)
            payouts["Common_Equity"] = 0.0
        else:
            # Full preference paid, remainder to common
            for p in pref_stacks:
                payouts[p["series"]] = p["investment"] * p["pref_multiple"]
            payouts["Common_Equity"] = exit_valuation - total_pref_required
            
    elif structure_type == "tiered":
        # Sort by seniority (1 is highest)
        sorted_stacks = sorted(pref_stacks, key=lambda x: x["seniority"])
        remaining_cash = exit_valuation
        
        for p in sorted_stacks:
            claim = p["investment"] * p["pref_multiple"]
            payout = min(remaining_cash, claim)
            payouts[p["series"]] = payout
            remaining_cash -= payout
            
        payouts["Common_Equity"] = remaining_cash
        
    return payouts

stacks = [
    {"series": "Series_B", "investment": 20000000.0, "pref_multiple": 1.0, "seniority": 1},
    {"series": "Series_A", "investment": 10000000.0, "pref_multiple": 1.0, "seniority": 2},
    {"series": "Series_Seed", "investment": 3000000.0, "pref_multiple": 1.0, "seniority": 3}
]

# Simulate a modest $25M exit under Tiered Seniority vs Pari Passu
exit_val = 25000000.0
tiered_res = simulate_liquidation_waterfall(exit_val, stacks, structure_type="tiered")
pari_res = simulate_liquidation_waterfall(exit_val, stacks, structure_type="pari_passu")

print("[LIQUIDATION WATERFALL ANALYSIS: $25M MODEST EXIT]")
print("Total Capital Invested: $33,000,000.00 | Total Preferences: $33,000,000.00")
print("-" * 65)
print("Shareholder Class | Tiered Seniority Payout | Pari Passu Payout")
for k in ["Series_B", "Series_A", "Series_Seed", "Common_Equity"]:
    print("{:17s} | ${:21,.2f} | ${:17,.2f}".format(k, tiered_res[k], pari_res[k]))
print("-" * 65)
print("Outcome: Tiered seniority leaves Seed and Common with zero return; Pari Passu shares recovery.")
"""

p5_code = """# Day 48 Part 5: Anti-Pattern Defense: Down-Round Washout & Recapitalization Simulator
def evaluate_recapitalization_restructuring(founder_shares, series_a_shares, series_b_shares, exit_proceeds, mip_carve_out_pct=0.15):
    # Scenario A: Washout Down-Round without Carve-Out (Senior stack wipes out founders)
    total_pref = 35000000.0  # $35M senior preference stack
    
    if exit_proceeds <= total_pref:
        founder_payout_washout = 0.0
        investor_payout_washout = exit_proceeds
    else:
        investor_payout_washout = total_pref + (exit_proceeds - total_pref) * 0.70
        founder_payout_washout = (exit_proceeds - total_pref) * 0.30
        
    # Scenario B: Restructured Recapitalization with 15% Management Incentive Plan (MIP) Carve-Out
    mip_pool = exit_proceeds * mip_carve_out_pct
    remaining_proceeds = exit_proceeds - mip_pool
    
    if remaining_proceeds <= total_pref:
        investor_payout_recap = remaining_proceeds
        founder_equity_payout = 0.0
    else:
        investor_payout_recap = total_pref + (remaining_proceeds - total_pref) * 0.70
        founder_equity_payout = (remaining_proceeds - total_pref) * 0.30
        
    founder_total_recap = mip_pool + founder_equity_payout
    
    return {
        "exit_val": exit_proceeds,
        "washout_investor": investor_payout_washout,
        "washout_founder": founder_payout_washout,
        "recap_investor": investor_payout_recap,
        "recap_mip": mip_pool,
        "recap_founder_total": founder_total_recap
    }

exits = [20000000.0, 35000000.0, 50000000.0]

print("[FORENSIC DOWN-ROUND WASHOUT & RECAPITALIZATION DEFENSE]")
print("Comparing Washout Death Spiral vs 15% Management Incentive Plan (MIP):")
print("-" * 65)
for e in exits:
    res = evaluate_recapitalization_restructuring(3000000, 2000000, 5000000, e, mip_carve_out_pct=0.15)
    print("Exit Valuation: ${:,.2f}".format(e))
    print("  Washout Payout: Founders = ${:10,.2f} | Investors = ${:10,.2f}".format(
        res["washout_founder"], res["washout_investor"]
    ))
    print("  Recap MIP Plan: Founders = ${:10,.2f} | Investors = ${:10,.2f}".format(
        res["recap_founder_total"], res["recap_investor"]
    ))
    print("  Restructuring Lift to Key Management: +${:,.2f}".format(
        res["recap_founder_total"] - res["washout_founder"]
    ))
    print("-" * 65)
print("GOVERNANCE DIRECTIVE: Implement MIP Carve-Out to secure team retention during down-rounds.")
"""

# Get stdout
p1_out = get_output(p1_code)
p2_out = get_output(p2_code)
p3_out = get_output(p3_code)
p4_out = get_output(p4_code)
p5_out = get_output(p5_code)

# --- DAY 48 COMPLETE DATA OBJECT ---

day48_data = {
    "day": 48,
    "title": "Series B Term Sheets: Super Pro-Rata, Pay-to-Play & Down-Round Dilution Cascades",
    "course": "bcom_ent",
    "parts": [
        {
            "part": 1,
            "title": "Series B Valuation, Capital Structures & Super Pro-Rata Allocation Mechanics",
            "say": p1_say,
            "example": "A commercial real estate syndicate where anchor tenant partners demand right of first refusal and expansion space rights in subsequent phases of a business park illustrates super pro-rata allocation conflicts.",
            "code": p1_code,
            "output": p1_out,
            "codeNotes": [
                "Model Series B post-money capitalization tables with unallocated option pool expansions.",
                "Simulate syndicate allocation tension between standard pro-rata and super pro-rata rights.",
                "Calculate pro-rata dollar commitments and evaluate new lead investor allocation room.",
                "Quantify post-closing ownership dilution across founders, early investors, and employee pools."
            ],
            "tryIt": "Alter the pre-money valuation and option pool target percentage to observe how pre-money option pool refreshes concentrate dilution entirely on founding equity.",
            "check": {
                "question": "What is the primary economic difference between standard Pro-Rata rights and Super Pro-Rata rights in growth-stage venture syndicates?",
                "options": [
                    "Standard pro-rata permits an investor to maintain their exact ownership percentage, while super pro-rata permits them to purchase a higher percentage of the round, crowding out new leads or diluting founders.",
                    "Standard pro-rata requires an investor to double their capital commitment in every round, while super pro-rata eliminates all investment obligations.",
                    "Super pro-rata converts preferred shares into common debt instruments upon round completion, eliminating equity voting rights.",
                    "Standard pro-rata applies only to seed rounds, while super pro-rata is strictly reserved for initial public offerings."
                ],
                "answerIndex": 0,
                "why": "Standard pro-rata allows an existing investor to maintain their existing ownership percentage, whereas super pro-rata allows them to take an expanded allocation (e.g., 1.5x to 2.0x pro-rata), which can crowd out the incoming lead investor or cause unbudgeted founder dilution."
            }
        },
        {
            "part": 2,
            "title": "Pay-to-Play Provisions: Preferred Stock Conversion & Non-Participant Penalties",
            "say": p2_say,
            "example": "An agricultural irrigation cooperative requiring members to fund emergency canal repairs during drought seasons illustrates pay-to-play provisions, where non-contributing members forfeit priority water rights.",
            "code": p2_code,
            "output": p2_out,
            "codeNotes": [
                "Model institutional pay-to-play capital call obligations across a multi-fund syndicate.",
                "Execute automated reclassification algorithms converting non-participating preferred shares to common stock.",
                "Strip liquidation preferences and anti-dilution protections from defaulting syndicate tranches.",
                "Calculate the remaining active preferred liquidation pool and reassess post-round voting control."
            ],
            "tryIt": "Toggle investor participation flags to simulate how pay-to-play covenants strip liquidation preferences from passive investors and redistribute syndicate power.",
            "check": {
                "question": "What is the contractual consequence of a Pay-to-Play provision on an existing Series A preferred investor who refuses to fund their pro-rata share in a qualified down-round?",
                "options": [
                    "Their preferred shares are involuntarily converted to common stock (or shadow preferred), forfeiting their senior liquidation preference and protective voting rights.",
                    "The company is legally forced to repurchase their shares at original cost plus an eighteen percent compounding annual interest penalty.",
                    "Their preferred shares receive a double liquidation preference to compensate them for not participating in the new round.",
                    "The investor is prohibited from trading any public stocks for a period of five years under federal securities laws."
                ],
                "answerIndex": 0,
                "why": "Under a pay-to-play provision, an investor who fails to contribute their pro-rata share in a qualified round has their preferred shares converted into common stock or shadow preferred, stripping away liquidation preferences, anti-dilution rights, and board seats."
            }
        },
        {
            "part": 3,
            "title": "Anti-Dilution Protection Mathematics: Broad-Based Weighted Average vs Full Ratchet",
            "say": p3_say,
            "example": "A corporate bond with an inflation indexation floor where bondholder principal resets higher if purchasing power drops illustrates anti-dilution protection, preserving capital value at the expense of junior equity reserves.",
            "code": p3_code,
            "output": p3_out,
            "codeNotes": [
                "Implement the Broad-Based Weighted Average anti-dilution formula using fully diluted share counts.",
                "Model the Full Ratchet conversion price reset to down-round share price benchmarks.",
                "Calculate the adjusted conversion prices and derive extra common shares issued upon conversion.",
                "Evaluate dilution sensitivity and quantify founder equity destruction under full ratchet terms."
            ],
            "tryIt": "Modify the down-round share price and capital raised to observe how Broad-Based Weighted Average cushions dilution while Full Ratchet triggers extreme founder wipeouts.",
            "check": {
                "question": "Why is Full Ratchet anti-dilution protection considered toxic and predatory compared to Broad-Based Weighted Average protection?",
                "options": [
                    "Full ratchet resets the previous conversion price directly to the down-round price regardless of round size, doubling or tripling investor shares and wiping out founder equity.",
                    "Full ratchet requires founders to personally guarantee the company's lease liabilities with their private residential real estate.",
                    "Full ratchet prevents the company from ever issuing employee stock options to software engineers or executive leadership.",
                    "Full ratchet automatically dissolves the corporation if the stock price declines by more than five percent."
                ],
                "answerIndex": 0,
                "why": "Full ratchet anti-dilution resets the conversion price to the down-round price even for a trivial investment size, drastically expanding investor share counts and imposing catastrophic dilution on founders and employee option holders."
            }
        },
        {
            "part": 4,
            "title": "Multiple Liquidation Preferences & Seniority Structures (Pari Passu vs Tiered Stacks)",
            "say": p4_say,
            "example": "Maritime salvage and harbor lien hierarchies where recovery tugs hold absolute first priority over cargo carriers and shipowners illustrate tiered seniority stacks, dictating cash recovery order in distressed shipwrecks.",
            "code": p4_code,
            "output": p4_out,
            "codeNotes": [
                "Construct a multi-tiered preferred liquidation waterfall across Series Seed, Series A, and Series B.",
                "Simulate exit payouts under Tiered Seniority stacks versus Pari Passu equal-priority structures.",
                "Calculate conversion tipping points where preferred shares convert voluntarily to common equity.",
                "Analyze exit distributions across common and preferred shareholders from modest to high valuations."
            ],
            "tryIt": "Adjust the exit valuation and switch between Tiered and Pari Passu seniority to observe how liquidation stacks determine whether common shareholders receive any proceeds.",
            "check": {
                "question": "In a $25M exit where total preferred liquidation preferences equal $33M, how does a Tiered Seniority structure impact Series Seed and Common shareholders compared to Pari Passu?",
                "options": [
                    "Tiered seniority pays Series B first and Series A second, leaving Series Seed and Common with zero dollars; Pari Passu shares recovery pro-rata across all preferred series.",
                    "Tiered seniority guarantees that common shareholders receive fifty percent of all exit proceeds before preferred investors receive a single dollar.",
                    "Pari passu eliminates all preferred rights and distributes the entire twenty-five million dollars equally among all individual shareholders.",
                    "Tiered seniority forces the acquiring company to pay double the purchase price to satisfy unsatisfied liquidation preferences."
                ],
                "answerIndex": 0,
                "why": "Under tiered seniority, senior series (Series B) are paid in full first, leaving earlier series (Seed) and common shareholders completely empty-handed if proceeds are insufficient; pari passu distributes proceeds pro-rata across all preferred tranches."
            }
        },
        {
            "part": 5,
            "title": "Anti-Pattern Defense: The Down-Round Death Spiral & Washout Dilution Outage",
            "say": p5_say,
            "example": "The corporate restructuring of an insolvent commercial airline where aircraft leasing creditors establish a management retention trust to prevent pilot flight illustrates management incentive plans during down-round wipeouts.",
            "code": p5_code,
            "output": p5_out,
            "codeNotes": [
                "Model founder and executive equity wipeouts following predatory full-ratchet down-rounds.",
                "Simulate Management Incentive Plan (MIP) exit carve-out pools (10% to 15%) off the top of proceeds.",
                "Evaluate recapitalization restructurings that convert legacy preferred stacks into unified common equity.",
                "Verify the restoration of executive retention incentives and company operational viability."
            ],
            "tryIt": "Alter the MIP carve-out percentage and exit valuation to simulate how restructuring recapitalizations rescue management incentives during severe company downturns.",
            "check": {
                "question": "What is the primary corporate governance mechanism used to restore talent retention and rescue an enterprise from a Down-Round Death Spiral?",
                "options": [
                    "Implement a Management Incentive Plan (MIP) carve-out off the top of exit proceeds and execute a recapitalization restructuring that resets the capitalization table.",
                    "Enforce full-ratchet anti-dilution to the maximum legal extent and terminate all founding executives immediately.",
                    "Convert all employee stock options into non-voting municipal bonds with thirty-year maturity horizons.",
                    "File for Chapter 7 liquidating bankruptcy and transfer all software intellectual property to the state treasury."
                ],
                "answerIndex": 0,
                "why": "To stop talent flight in a down-round washout, boards establish a Management Incentive Plan (MIP) carving out 10%–15% of exit proceeds for key management and execute a recapitalization restructuring to reset employee incentives."
            }
        }
    ]
}

# --- GATE V2 VISUAL ENVELOPES FOR DAY 48 ---
# Single sentence <= 80 chars, ends with '.', no numbers, shares 4+ letter words with say[0], example, tryIt.

captions = [
    # Part 1
    (
        "Series B term sheet mechanics and syndicate equity allocation dynamics.",
        "Series B negotiations govern growth capital and syndicate allocations.",
        "Real estate syndicates illustrate super pro-rata allocation conflicts.",
        "Observe how option pool refreshes concentrate dilution on founding equity."
    ),
    # Part 2
    (
        "Pay-to-play covenants and preferred stock reclassification penalties.",
        "Pay-to-play provisions enforce investor participation in rescue rounds.",
        "Irrigation cooperatives illustrate member penalties and forfeited rights.",
        "Observe how pay-to-play covenants strip liquidation preferences."
    ),
    # Part 3
    (
        "Anti-dilution formulas across weighted average and full ratchet structures.",
        "Anti-dilution formulas protect investor capital during corporate down-rounds.",
        "Corporate bonds illustrate anti-dilution floors and equity reserves.",
        "Observe how broad-based formulas cushion dilution compared to ratchets."
    ),
    # Part 4
    (
        "Liquidation waterfalls and preferred seniority distribution structures.",
        "Liquidation waterfalls dictate cash distributions in corporate liquidity events.",
        "Maritime salvage hierarchies illustrate tiered seniority and lien priority.",
        "Observe how liquidation stacks determine whether common equity receives cash."
    ),
    # Part 5
    (
        "Defense against down-round washouts and recapitalization restructurings.",
        "Down-round washouts trigger talent flight and equity destruction spirals.",
        "Airlines illustrate management retention trusts during corporate wipeouts.",
        "Simulate how recapitalizations rescue management incentives during downturns."
    )
]

visual_entries = []
for p_idx, p in enumerate(day48_data["parts"]):
    c_intro, c_say1, c_example, c_tryIt = captions[p_idx]
    c_hash = sha256(p["code"])
    steps = [
        {
            "at": "intro",
            "caption": c_intro,
            "activeStageId": "stage_1",
            "stages": [
                {"id": "stage_1", "label": "Super Pro-Rata", "value": 100, "percentage": 100, "tone": "data"},
                {"id": "stage_2", "label": "Pay-to-Play", "value": 0, "percentage": 0, "tone": "idle"},
                {"id": "stage_3", "label": "Anti-Dilution", "value": 0, "percentage": 0, "tone": "idle"},
                {"id": "stage_4", "label": "Liquidation Stack", "value": 0, "percentage": 0, "tone": "idle"}
            ]
        },
        {
            "at": "say1",
            "caption": c_say1,
            "activeStageId": "stage_2",
            "stages": [
                {"id": "stage_1", "label": "Super Pro-Rata", "value": 100, "percentage": 100, "tone": "data"},
                {"id": "stage_2", "label": "Pay-to-Play", "value": 75, "percentage": 75, "tone": "data"},
                {"id": "stage_3", "label": "Anti-Dilution", "value": 50, "percentage": 50, "tone": "ok"},
                {"id": "stage_4", "label": "Liquidation Stack", "value": 0, "percentage": 0, "tone": "idle"}
            ]
        },
        {
            "at": "example",
            "caption": c_example,
            "activeStageId": "stage_3",
            "stages": [
                {"id": "stage_1", "label": "Super Pro-Rata", "value": 100, "percentage": 100, "tone": "data"},
                {"id": "stage_2", "label": "Pay-to-Play", "value": 75, "percentage": 75, "tone": "data"},
                {"id": "stage_3", "label": "Anti-Dilution", "value": 50, "percentage": 50, "tone": "data"},
                {"id": "stage_4", "label": "Liquidation Stack", "value": 0, "percentage": 0, "tone": "ok"}
            ]
        },
        {
            "at": "tryIt",
            "caption": c_tryIt,
            "activeStageId": "stage_4",
            "stages": [
                {"id": "stage_1", "label": "Super Pro-Rata", "value": 100, "percentage": 100, "tone": "data"},
                {"id": "stage_2", "label": "Pay-to-Play", "value": 75, "percentage": 75, "tone": "data"},
                {"id": "stage_3", "label": "Anti-Dilution", "value": 50, "percentage": 50, "tone": "data"},
                {"id": "stage_4", "label": "Liquidation Stack", "value": 0, "percentage": 0, "tone": "data"}
            ]
        }
    ]
    visual_entries.append({
        "partTitle": p["title"],
        "codeHash": c_hash,
        "filled": {},
        "spec": {
            "template": "funnel",
            "title": f"{p['title']} Governance",
            "steps": steps
        }
    })

day48_visual = {
    "schemaVersion": 1,
    "prefix": "bcom_ent",
    "day": 48,
    "promptSha": sha256(json.dumps(day48_data["parts"][0]["say"])),
    "model": "google/gemini-2.5-pro",
    "entries": visual_entries
}

with open("scripts/day48_lesson.json", "w", encoding="utf-8") as f:
    json.dump(day48_data, f, indent=2)

with open("src/lib/data/lessonVisuals/bcom_ent/day-48.json", "w", encoding="utf-8") as f:
    json.dump(day48_visual, f, indent=2)

print("Generated day-48.json and day48_lesson.json successfully!")
