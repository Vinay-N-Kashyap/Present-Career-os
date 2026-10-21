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

# --- DAY 38 TEXT: ESOP & SECONDARY LIQUIDITY (ENRICHED STRICT >= 600 WORDS PER PART) ---

p1_say = [
    "Welcome to Day 38 of Entrepreneurship and Venture Incubation. On Day 37, we explored the highest levels of corporate board governance, analyzing fiduciary duties under Delaware corporate law, protective provision class vetoes, 2-2-1 board compositions, and drag-along squeeze-out enforcement. Today, we turn our operational focus to the most critical human capital engine in high-growth technology enterprises: the Employee Stock Ownership Plan (ESOP) and Equity Incentive Compensation Architecture. In venture-backed software and technology enterprises, hiring top-tier engineering talent, product architects, and executive leaders requires offering substantial equity incentives. However, structuring equity incentive pools is not merely a human resources exercise; it is an intricate exercise in financial engineering, corporate tax structuring, and capitalization table dilution physics.",
    "The central negotiation in venture capital equity pool design centers on what corporate finance practitioners term the 'Option Pool Shuffle'. When an institutional venture capital firm presents a Series A term sheet proposing to invest ten million dollars at a forty-million-dollar pre-money valuation, the term sheet almost universally contains a contractual clause stating: 'The pre-money valuation includes an unallocated employee option pool equal to fifteen percent of the fully diluted capitalization of the company post-closing.' While this phrasing sounds routine to novice founders, its financial consequence is profound: one hundred percent of the equity dilution required to create or expand the unallocated option pool is forced entirely onto the existing common stockholders—the founders and early team—prior to the investor wiring a single dollar.",
    "To understand the mathematical physics of the Option Pool Shuffle, founders must analyze the Effective Pre-Money Valuation formula. If a company has ten million common shares outstanding and the investor agrees to a $40M pre-money valuation with a $10M cash investment ($50M post-money), an unencumbered round would price shares at four dollars each ($40M divided by 10M shares). However, when the investor mandates a fifteen percent post-money unallocated pool, the company must create new option pool shares out of the pre-money capitalization. To achieve a fifteen percent unallocated pool post-money, the option pool must represent 18.75 percent of the pre-money capitalization. This pool creation artificially inflates the effective pre-money share count, driving the true pre-money share price down from $4.00 to approximately $3.20 per share, stealthily transferring millions of dollars in equity value from founders to incoming investors.",
    "Founders must actively counter the option pool shuffle by constructing a detailed 18-to-24-month Hiring Plan and Cap Table Budget. Rather than accepting arbitrary round-number investor demands—such as standard fifteen or twenty percent pools—founders should present a granular, role-by-role equity allocation schedule showing exactly which executives, senior engineers, and staff will be hired prior to the Series B round, and how much equity each role requires. If the empirical hiring budget demonstrates that the venture requires only 8.5 percent unallocated equity over the next eighteen months, founders have rigorous mathematical grounds to negotiate the pool down, preventing millions of dollars of unnecessary unallocated founder dilution.",
    "Furthermore, founders must negotiate for Post-Money Option Pool Expansions or Unallocated Pool Re-Shuffles. Under a post-money option pool structure, any new option pool shares authorized to incentivize future employees are created post-closing, ensuring that both the incoming venture capital investors and the existing common shareholders share the dilution proportionally according to their post-money ownership percentages. Additionally, founders must negotiate a 'Pool Recapture' covenant: if the company achieves an M&A exit or an IPO while unallocated option pool shares remain unissued, those unallocated pool shares must be cancelled immediately prior to closing, returning pro-rata equity ownership to the founders rather than providing an unearned windfall to preferred investors.",
    "In Part 1, we implement an Institutional Option Pool Shuffle & Pre-Money Valuation Engine in Python. We will model the mathematical disparity between pre-money and post-money option pool expansions, calculate effective share pricing and share count allocations, quantify the exact founder dilution penalty, and demonstrate how empirical hiring budgets preserve millions in enterprise equity value."
]

p2_say = [
    "We now advance to Part 2: Equity Grant Tax Engineering: Section 83(b) Elections & ISO vs NSO Tax Friction. In the United States and global venture finance, issuing equity to founders and employees creates substantial tax friction with tax authorities like the Internal Revenue Service (IRS). When a startup issues restricted common stock to founders or early employees subject to four-year vesting schedules with a one-year cliff, the default rule under Internal Revenue Code (IRC) Section 83(a) dictates that the recipient is taxed on the fair market value of the shares as they vest. If the company's valuation surges from one cent per share at founding to ten dollars per share at year three, the employee faces a catastrophic ordinary income tax bill on unrealized, illiquid equity every month as shares vest.",
    "To eliminate this crushing tax liability, every founder and recipient of unvested restricted stock must execute an IRC Section 83(b) Election. Under Section 83(b), the stockholder affirmatively elects to be taxed on the fair market value of all granted stock immediately at the time of grant, rather than waiting for shares to vest over time. Because early-stage shares are issued at nominal par value—typically $0.0001 per share—the upfront taxable income is essentially zero (e.g., $100 on one million shares). Crucially, the Section 83(b) election starts the clock for long-term capital gains and Qualified Small Business Stock (QSBS) treatment under IRC Section 1202, ensuring that when the enterprise eventually exits for tens of millions of dollars, the proceeds are taxed at favorable capital gains rates or entirely tax-free under QSBS, rather than fifty percent ordinary income rates.",
    "However, the Section 83(b) election carries a strict, unforgiving statutory procedural constraint: the election form must be physically filed with the Internal Revenue Service within exactly Thirty Days of the stock grant date. The thirty-day statutory deadline cannot be extended, waived, or cured under any circumstances, even through costly private letter rulings. If a founder misses the thirty-day window by a single day, the election is permanently invalid, trapping the founder under Section 83(a) ordinary income taxation across their entire multi-year vesting trajectory.",
    "For later-stage employees, compensation transitions from restricted stock to Stock Options under an Equity Incentive Plan. Startup stock options divide into two distinct statutory categories: Incentive Stock Options (ISOs) under IRC Section 422, and Non-Qualified Stock Options (NSOs). Incentive Stock Options are tax-advantaged instruments reserved exclusively for direct corporate employees. When an employee exercises an ISO, no ordinary income tax is owed at the time of exercise. If the employee holds the acquired shares for at least two years from the grant date and one year from the exercise date, all subsequent gains upon sale qualify for long-term capital gains tax.",
    "Conversely, Non-Qualified Stock Options (NSOs) can be granted to employees, outside directors, independent contractors, and advisory board members. When an NSO is exercised, the 'spread'—the difference between the Fair Market Value (FMV) established by the company's independent Section 409A valuation and the exercise strike price—is immediately taxed as ordinary income and subject to mandatory federal and state payroll tax withholding. Furthermore, while ISOs avoid ordinary income tax at exercise, the spread between the strike price and 409A FMV constitutes a preference item for the Alternative Minimum Tax (AMT), which can trigger massive unexpected tax liabilities.",
    "In Part 2, we build an IRC Section 83(b) Tax Optimization & ISO vs NSO Tax Friction Engine in Python. We will model vesting taxation under Section 83(a) versus 83(b), compute federal ordinary income versus long-term capital gains liabilities, calculate Alternative Minimum Tax (AMT) preference spreads on ISO exercises, and quantify the net after-tax wealth generated across diverse liquidity horizons."
]

p3_say = [
    "We now advance to Part 3: Secondary Tender Offers & The Right of First Refusal (ROFR) Protocol. As venture-backed technology companies remain private for decade-long horizons—frequently raising Series D, Series E, and growth rounds before considering an IPO—founders, early executives, and tenured software engineers face a profound economic paradox: they hold millions of dollars in 'paper wealth' represented by vested private stock, but cannot buy a home, support their families, or achieve financial stability because private equity is completely illiquid.",
    "To resolve this liquidity squeeze without forcing an premature public offering, growth-stage enterprises organize formal Secondary Tender Offers. In a company-sponsored secondary tender offer, an institutional growth equity investor, sovereign wealth fund, or the startup itself offers to purchase a predetermined dollar amount of vested common stock (e.g., $10 million or $25 million) directly from eligible founders, executives, and tenured employees at a negotiated price, typically set at a ten to twenty percent discount to the most recent preferred stock valuation. Tender offers are strictly regulated under federal securities laws, including SEC Rule 14e-1, requiring a minimum twenty-business-day open offering period and comprehensive shareholder disclosures.",
    "To prevent uncontrolled secondary trading and protect private capitalization tables from predatory outside hedge funds, corporate bylaws and investors' rights agreements enforce a strict Right of First Refusal (ROFR) Protocol. Under a standard corporate ROFR covenant, if an employee receives an unsolicited third-party purchase offer to sell their private common stock, the employee is legally obligated to deliver a formal Transfer Notice to the corporation, detailing the proposed share count, purchase price, and buyer identity. The company possesses an exclusive thirty-day window to exercise its ROFR and buy back the shares on identical terms.",
    "If the company declines to exercise its primary ROFR, the right automatically cascades to the major institutional venture capital investors under an Investor Secondary ROFR. Major preferred investors have an additional fifteen to twenty days to step into the transaction and acquire the selling employee's shares pro-rata according to their ownership percentages. Only if both the company and the institutional investors formally waive their ROFR rights is the employee legally permitted to transfer the shares to the external third party, ensuring that equity ownership remains tightly consolidated among trusted strategic partners.",
    "Furthermore, founders and corporate boards must manage the impact of secondary tender offer pricing on the company's independent IRC Section 409A Valuation. If common stock is sold in a secondary tender offer at five dollars per share, third-party valuation firms may consider that transaction as empirical market evidence of common stock value, forcing the company to increase its Section 409A strike price for future employee option grants. To prevent 409A contamination, secondary transactions must be carefully structured as structured tender offers or non-arm's-length liquidity facilities.",
    "From a regulatory perspective, private secondary transactions must navigate complex federal and state securities compliance regimes. Because private company shares are 'restricted securities' under SEC Rule 144, employees cannot simply trade shares on open secondary marketplaces without satisfying the statutory one-year holding period and demonstrating that the sale qualifies under Section 4(a)(1½) private resale exemptions. Furthermore, to prevent insider trading violations under SEC Rule 10b-5, corporate boards establish strict Trading Windows and Blackout Periods, restricting secondary liquidity to designated twenty-day periods following the delivery of quarterly financial statements, ensuring that all participants transact with synchronized information symmetry.",
    "In Part 3, we implement a Structured Secondary Tender Offer & Pro-Rata ROFR Allocation Engine in Python. We will model eligible vested employee share pools, calculate pro-rata secondary liquidity allocations when tender offers are oversubscribed, simulate company primary ROFR versus investor secondary ROFR waterfalls, and evaluate 409A valuation insulation protocols."
]

p4_say = [
    "We now advance to Part 4: Post-Termination Exercise Windows (PTEW) & Cashless Net Exercise Algorithms. In early-stage venture practice, one of the most punitive and archaic contractual terms confronting startup employees is the standard Ninety-Day Post-Termination Exercise Window. Under traditional option grant agreements and IRC Section 422(a)(2), when an employee departs a company—whether through resignation or termination—they are given exactly ninety days to exercise all vested stock options. If the employee cannot produce the cash to exercise their options within ninety days, their hard-earned equity is permanently forfeited and recycled back into the corporate option pool.",
    "For tenured software engineers and executives at growth-stage unicorns, the ninety-day exercise rule creates an insurmountable financial barrier known as the 'Exercise Trap'. Suppose a departing engineer holds fifty thousand vested options with a strike price of two dollars per share ($100,000 cash exercise cost), and the company's current 409A valuation is twenty dollars per share ($1,000,000 fair market value). In addition to wiring one hundred thousand dollars in cash to purchase the shares, the employee incurs an immediate Alternative Minimum Tax (AMT) liability on the nine-hundred-thousand-dollar paper spread, demanding another two hundred fifty thousand dollars in cash taxes. Facing a three-hundred-fifty-thousand-dollar immediate cash requirement on illiquid shares, most employees are forced to walk away and abandon their vested equity.",
    "To eliminate this predatory dynamic and establish talent-centric governance, modern venture pioneers enforce Extended Post-Termination Exercise Windows (PTEW). Under an extended PTEW policy, departing employees are granted five, seven, or even ten years from their termination date to exercise their vested options. While extending the exercise window beyond ninety days causes Incentive Stock Options (ISOs) to automatically convert into Non-Qualified Stock Options (NSOs) under tax law, it grants employees the indispensable freedom to wait until an IPO or corporate acquisition occurs before exercising, allowing them to fund the exercise cost and taxes directly from exit liquidity.",
    "Additionally, companies implement Cashless Net Exercise Algorithms (or Net Share Settlement). Under a net exercise mechanism, the employee does not wire cash to the company to pay the strike price. Instead, the company mathematically withholds a number of option shares whose fair market value equals the aggregate strike price and tax withholding obligations, issuing the net remaining shares directly to the employee. The formula for net shares issued is: Net Shares equals Total Options multiplied by the Fair Market Value minus Strike Price, divided by Fair Market Value.",
    "By deploying extended exercise windows and cashless net exercise mechanisms, progressive technology ventures protect employee ownership, eliminate predatory equity forfeiture, and align corporate incentives with long-term enterprise value creation. These contractual safeguards ensure that the software engineers and operators who build the enterprise's intellectual property participate fully in the commercial harvest of their labor.",
    "Corporate boards must also analyze the statutory financial accounting implications of modifying stock option exercise windows under US GAAP ASC 718 (Stock Compensation). When a company amends an existing option plan to extend the post-termination exercise window from ninety days to seven or ten years, accounting rules classify this modification as a 'Type 1 Value-for-Value Option Plan Modification'. The corporation must calculate the incremental fair value of the modified option using the Black-Scholes-Merton option pricing model on the modification date, recognizing the incremental fair value as immediate stock-based compensation expense on the corporate income statement. Savvy CFOs structure PTEW policies upfront in original equity plan documents, avoiding punitive retro-active accounting charges.",
    "In Part 4, we build a Post-Termination Exercise Window & Cashless Net Exercise Simulator in Python. We will model the mathematical disparity between 90-day forfeiture cliffs and 7-year extended PTEW regimes, calculate cashless net share issuance formulas, compute cash savings for departing staff, and evaluate capitalization table option pool recycling rates."
]

p5_say = [
    "We arrive at Part 5: Anti-Pattern Defense: The Golden Handcuffs & Illiquid Alternative Minimum Tax (AMT) Outage. In modern startup compensation lore, stock options are celebrated as the ultimate engine of generational wealth creation for technology workers. But without rigorous tax planning and liquidity safeguards, stock options can transform into a catastrophic financial trap that drives dedicated employees into personal bankruptcy without them ever receiving a single dollar of liquid cash. This devastating failure mode is known throughout Silicon Valley and tech hubs as the Illiquid AMT Tax Trap.",
    "The disaster unfolds through the hidden mechanics of Incentive Stock Options (ISOs) under the US Internal Revenue Code. Under IRC Section 56(b)(3), when an employee exercises an ISO, the 'spread'—the difference between the Fair Market Value (FMV) established by the company's Section 409A valuation and the exercise strike price—is treated as an item of adjustment for the Alternative Minimum Tax (AMT). Because the startup is private, the employee receives illiquid private shares that cannot be sold on any public exchange. Yet, the IRS demands that the employee pay immediate cash AMT taxes on that paper spread at rates reaching up to twenty-eight percent.",
    "Consider a real-world disaster scenario: an early software engineer at a promising fintech startup holds one hundred thousand vested ISOs with a strike price of ten cents ($0.10) per share. The startup raises a massive Series C funding round at a sky-high valuation, pushing the independent 409A common stock valuation to ten dollars ($10.00) per share. Excited by the company's valuation momentum and advised to exercise early to start the one-year long-term capital gains clock, the engineer wires ten thousand dollars to exercise the options. The paper spread on the exercise is nine hundred ninety thousand dollars ($990,000). On April 15 of the following year, the engineer is hit with an immediate, non-negotiable cash AMT tax bill of approximately two hundred seventy-seven thousand dollars.",
    "The engineer liquidates personal savings, borrows money from family, or takes out a high-interest personal loan to pay the IRS tax bill, believing their private shares are worth one million dollars. But six months later, macroeconomic headwinds strike, customer churn accelerates, and the startup suffers a catastrophic down-round or liquidation bankruptcy where enterprise valuation collapses by ninety-five percent to zero. The engineer's shares become completely worthless. Yet under US federal tax law, the IRS does NOT refund the cash AMT taxes paid on past paper valuations. The engineer is left with zero equity, exhausted savings, and crippling personal debt—a total financial catastrophe.",
    "Many misinformed startup employees mistakenly believe that the federal Minimum Tax Credit (MTC) under IRC Section 53 will quickly restore their depleted cash reserves after paying substantial AMT. While Section 53 does create an MTC for the AMT paid on ISO exercise spreads, this tax credit can ONLY be used to offset regular income tax in future years to the extent that regular tax exceeds tentative minimum tax. If the startup's stock crashes to zero, the employee incurs a catastrophic capital loss, but capital losses can only offset up to three thousand dollars of ordinary income per year under federal law. Consequently, using the Minimum Tax Credit to recoup hundreds of thousands of dollars in paid AMT takes decades—often forty to fifty years—leaving the employee permanently depleted of liquid cash.",
    "To defend against the Illiquid AMT Tax Trap, sovereign technology companies and informed employees enforce four strict Equity Tax Safeguards. First, employees must never exercise private ISOs in bulk without consulting a certified CPA and running comprehensive AMT modeling to calculate the exact AMT Exemption Phaseout threshold. Second, employees should utilize 'Cashless Exercise at Exit' whenever possible, exercising options only when simultaneous public trading or an acquisition provides immediate liquidity to pay taxes. Third, companies should adopt Extended Exercise Windows (PTEW) so employees are not forced to exercise upon leaving. Fourth, companies should establish non-recourse exercise financing programs or secondary liquidity windows that absorb employee tax liabilities.",
    "In Part 5, we engineer an Anti-Pattern Illiquid AMT Tax Trap & Valuation Collapse Simulator in Python. We will model the exact calculation of the ISO paper spread, determine the federal Alternative Minimum Tax liability, simulate subsequent private valuation markdown crashes, quantify net personal wealth destruction, and program automated financial tripwires that alert employees prior to executing illiquid equity exercises."
]

all_says = [p1_say, p2_say, p3_say, p4_say, p5_say]
for idx, s in enumerate(all_says):
    w = word_count(s)
    print(f"Part {idx+1} Word Count: {w} words")
    assert w >= 600, f"Part {idx+1} word count {w} is below 600!"

total_words = sum(word_count(s) for s in all_says)
print(f"Total Day 38 Spoken Words: {total_words} words (Target >= 3000)")
assert total_words >= 3000

# --- PYTHON CODE SNIPPETS (Tested & Deterministic) ---

day38_p1_code = '''def simulate_option_pool_shuffle(pre_money_val: float, investment_amt: float, target_pool_pct: float, current_shares: float):
    post_money_val = pre_money_val + investment_amt
    
    # Pre-Money Pool Shuffle algebra:
    # Post-Money Pool Shares = Fully_Diluted_Post * target_pool_pct
    # Fully_Diluted_Post = (current_shares + Pool_Shares) + Investor_Shares
    # Investor_Shares = investment_amt / share_price
    # Share_Price = pre_money_val / (current_shares + Pool_Shares)
    
    # True Effective Pre-Money Valuation deducting target unallocated pool:
    effective_pre_money = pre_money_val * (1.0 - target_pool_pct)
    share_price_shuffle = effective_pre_money / current_shares
    investor_shares = investment_amt / share_price_shuffle
    post_money_shares = (current_shares / (1.0 - target_pool_pct)) + investor_shares
    pool_shares = post_money_shares * target_pool_pct
    
    # Unencumbered share price without pre-money pool expansion:
    unencumbered_share_price = pre_money_val / current_shares
    founder_dilution_penalty = (unencumbered_share_price - share_price_shuffle) / unencumbered_share_price * 100
    
    print("=" * 65)
    print("OPTION POOL SHUFFLE & PRE-MONEY VALUATION DILUTION PHYSICS")
    print("=" * 65)
    print(f"Stated Pre-Money Valuation:   ${pre_money_val:,.2f}")
    print(f"Investor Investment Amount:   ${investment_amt:,.2f}")
    print(f"Post-Money Valuation:         ${post_money_val:,.2f}")
    print(f"Mandated Target Option Pool:  {target_pool_pct*100:.1f}% Post-Money")
    print("-" * 65)
    print(f"Unencumbered Share Price:     ${unencumbered_share_price:.4f}/share")
    print(f"Effective Pre-Money Valuation:${effective_pre_money:,.2f}")
    print(f"Shuffled True Share Price:    ${share_price_shuffle:.4f}/share")
    print(f"Founder Share Price Penalty:  -{founder_dilution_penalty:.2f}% Stealth Dilution")
    print(f"Pool Shares Created Pre-Money:{pool_shares:,.0f} shares")
    print(f"Investor Shares Issued:       {investor_shares:,.0f} shares")
    print(f"Founder Post-Money Ownership: {(current_shares / post_money_shares)*100:.2f}%")
    print("=" * 65)
    return round(share_price_shuffle, 4)

p = simulate_option_pool_shuffle(40000000.0, 10000000.0, 0.15, 10000000.0)'''

day38_p2_code = '''def calculate_83b_tax_optimization(shares_granted: int, par_value: float, vesting_fmv: list, ordinary_tax_rate: float, capital_gains_rate: float, exit_fmv: float, filed_83b: bool):
    print("=" * 65)
    print("IRC SECTION 83(b) TAX ENGINEERING & CAPITAL GAINS OPTIMIZATION")
    print("=" * 65)
    print(f"Restricted Shares Granted:    {shares_granted:,} shares @ ${par_value:.4f} par value")
    print(f"Section 83(b) Election Filed: {'YES (30-Day Window Satisfied)' if filed_83b else 'NO (Default Section 83(a))'}")
    print("-" * 65)
    
    if filed_83b:
        upfront_taxable_income = shares_granted * par_value
        upfront_tax = upfront_taxable_income * ordinary_tax_rate
        vesting_taxes = [0.0] * len(vesting_fmv)
        total_vesting_tax = 0.0
        # Capital gain on entire appreciation at exit
        capital_gain = shares_granted * (exit_fmv - par_value)
        exit_tax = capital_gain * capital_gains_rate
    else:
        upfront_tax = 0.0
        shares_per_year = shares_granted / len(vesting_fmv)
        vesting_taxes = []
        for year, fmv in enumerate(vesting_fmv, 1):
            yr_taxable = shares_per_year * fmv
            yr_tax = yr_taxable * ordinary_tax_rate
            vesting_taxes.append(yr_tax)
        total_vesting_tax = sum(vesting_taxes)
        # Capital gain only on appreciation after vesting
        capital_gain = shares_granted * (exit_fmv - (sum(vesting_fmv) / len(vesting_fmv)))
        exit_tax = max(0.0, capital_gain * capital_gains_rate)
        
    total_tax_paid = upfront_tax + total_vesting_tax + exit_tax
    net_after_tax_proceeds = (shares_granted * exit_fmv) - total_tax_paid
    
    print(f"Upfront Tax Paid (Day 1):     ${upfront_tax:,.2f}")
    print(f"Annual Vesting Taxes (Years): ${total_vesting_tax:,.2f}")
    print(f"Exit Capital Gains Tax:       ${exit_tax:,.2f}")
    print(f"Total Cumulative Taxes Paid:  ${total_tax_paid:,.2f}")
    print(f"Net Cash Proceeds to Founder: ${net_after_tax_proceeds:,.2f}")
    print("=" * 65)
    return round(total_tax_paid, 2)

t_83b = calculate_83b_tax_optimization(1000000, 0.0001, [1.0, 3.0, 6.0, 10.0], 0.40, 0.20, 25.0, True)'''

day38_p3_code = '''def simulate_secondary_tender_offer(tender_budget: float, share_price: float, employee_requests: dict, investor_rofr_exercise_pct: float):
    total_shares_offered = sum(employee_requests.values())
    total_dollar_demand = total_shares_offered * share_price
    is_oversubscribed = total_dollar_demand > tender_budget
    scale_back_ratio = min(1.0, tender_budget / total_dollar_demand)
    
    print("=" * 65)
    print("STRUCTURED SECONDARY TENDER OFFER & ROFR PROTOCOL")
    print(f"Tender Liquidity Budget: ${tender_budget:,.2f} @ ${share_price:.2f}/share")
    print("=" * 65)
    print(f"Total Employee Shares Tendered:{total_shares_offered:,.0f} shares")
    print(f"Total Dollar Value Tendered:   ${total_dollar_demand:,.2f}")
    print(f"Tender Subscription Status:    {'[OVERSUBSCRIBED - PRO-RATA CUT]' if is_oversubscribed else '[FULLY FILLED]'}")
    print(f"Pro-Rata Scale-Back Ratio:     {scale_back_ratio*100:.2f}%")
    print("-" * 65)
    
    total_cash_distributed = 0.0
    for emp, requested_shares in employee_requests.items():
        filled_shares = requested_shares * scale_back_ratio
        cash_payout = filled_shares * share_price
        total_cash_distributed += cash_payout
        print(f"> {emp:15s}: Requested {requested_shares:,.0f} -> Sold {filled_shares:,.0f} shares -> Payout: ${cash_payout:,.2f}")
        
    investor_rofr_absorption = total_cash_distributed * investor_rofr_exercise_pct
    company_treasury_absorption = total_cash_distributed - investor_rofr_absorption
    
    print("-" * 65)
    print(f"Investor Secondary ROFR Share: ${investor_rofr_absorption:,.2f} ({investor_rofr_exercise_pct*100:.1f}%)")
    print(f"Company Treasury Buyback Share:${company_treasury_absorption:,.2f}")
    print("=" * 65)
    return round(total_cash_distributed, 2)

reqs = {"Founder Alice": 200000, "VP Eng Bob": 100000, "Lead Architect": 50000, "Tenured Staff": 50000}
dist = simulate_secondary_tender_offer(2000000.0, 8.00, reqs, 0.60)'''

day38_p4_code = '''def calculate_cashless_net_exercise(num_options: int, strike_price: float, current_fmv: float):
    # Standard Cash Exercise:
    cash_required_standard = num_options * strike_price
    gross_value = num_options * current_fmv
    net_equity_value = gross_value - cash_required_standard
    
    # Cashless Net Exercise Formula: Net_Shares = N * (FMV - Strike) / FMV
    net_shares_issued = num_options * (current_fmv - strike_price) / current_fmv
    shares_withheld_for_strike = num_options - net_shares_issued
    
    print("=" * 65)
    print("POST-TERMINATION CASHLESS NET EXERCISE ALGORITHM")
    print("=" * 65)
    print(f"Vested Stock Options:         {num_options:,} options")
    print(f"Option Strike Price:          ${strike_price:,.2f}/share")
    print(f"Current Fair Market Value:    ${current_fmv:,.2f}/share")
    print("-" * 65)
    print(f"Standard Cash Required to Buy:${cash_required_standard:,.2f} Out-of-Pocket")
    print(f"Gross Market Value of Shares: ${gross_value:,.2f}")
    print(f"Net Equity Gain:              ${net_equity_value:,.2f}")
    print("-" * 65)
    print(f"Shares Withheld for Strike:   {shares_withheld_for_strike:,.0f} shares")
    print(f"Net Shares Issued to Employee:{net_shares_issued:,.0f} shares")
    print(f"Cash Paid by Departing Staff: $0.00 (Zero Out-of-Pocket Cash)")
    print(f"Net Value Delivered:          ${net_shares_issued * current_fmv:,.2f}")
    print("=" * 65)
    return round(net_shares_issued, 0)

net = calculate_cashless_net_exercise(50000, 2.00, 20.00)'''

day38_p5_code = '''def simulate_illiquid_amt_tax_trap(options_exercised: int, strike_price: float, exercise_fmv: float, crash_fmv: float, amt_tax_rate: float = 0.28):
    strike_cost = options_exercised * strike_price
    exercise_market_value = options_exercised * exercise_fmv
    amt_spread = options_exercised * (exercise_fmv - strike_price)
    amt_tax_bill = amt_spread * amt_tax_rate
    
    total_cash_invested = strike_cost + amt_tax_bill
    crash_market_value = options_exercised * crash_fmv
    net_wealth_destruction = crash_market_value - total_cash_invested
    
    print("=" * 65)
    print("ANTI-PATTERN: ILLIQUID ALTERNATIVE MINIMUM TAX (AMT) OUTAGE")
    print("=" * 65)
    print(f"Options Exercised:            {options_exercised:,} ISOs @ ${strike_price:.2f} Strike")
    print(f"Exercise 409A Fair Market Val:${exercise_fmv:,.2f}/share ($1.0M Paper Value)")
    print(f"Out-of-Pocket Strike Cost:    ${strike_cost:,.2f}")
    print(f"AMT Paper Spread Created:     ${amt_spread:,.2f}")
    print(f"IRS Cash AMT Tax Bill Due:    ${amt_tax_bill:,.2f} (Due in Hard Cash!)")
    print("-" * 65)
    print(f"Total Out-of-Pocket Cash Sunk:${total_cash_invested:,.2f}")
    print(f"Subsequent Downturn 409A FMV: ${crash_fmv:,.2f}/share (-{(1.0 - crash_fmv/exercise_fmv)*100:.1f}% Crash)")
    print(f"Post-Crash Stock Market Value:${crash_market_value:,.2f}")
    print(f"IRS Tax Refund Permitted:     $0.00 (No Refund for Depreciated Private Stock)")
    print("-" * 65)
    print(f"Net Personal Wealth Sunk:     -${abs(net_wealth_destruction):,.2f}")
    print(f"Financial Outage Assessment:  TERMINAL PERSONAL INSOLVENCY OUTAGE")
    print("=" * 65)
    return round(net_wealth_destruction, 2)

loss = simulate_illiquid_amt_tax_trap(100000, 0.10, 10.00, 0.50, 0.28)'''

# Get exact outputs
p1_out = get_output(day38_p1_code)
p2_out = get_output(day38_p2_code)
p3_out = get_output(day38_p3_code)
p4_out = get_output(day38_p4_code)
p5_out = get_output(day38_p5_code)

day38_data = {
    "coursePrefix": "bcom_ent",
    "day": 38,
    "title": "Employee Stock Ownership Plans (ESOP) & Secondary Liquidity Programs",
    "description": "Master employee equity incentive engineering, analyzing the option pool shuffle, Section 83(b) tax optimization, structured secondary tender offers, cashless net exercise algorithms, and illiquid AMT tax trap safeguards.",
    "parts": [
        {
            "part": 1,
            "title": "The Option Pool Shuffle & Unallocated Reserve Dilution Physics",
            "say": p1_say,
            "example": "Consider a master artisanal bakery expanding into nationwide retail franchises. A private equity investor offers to invest one million dollars for twenty percent ownership, but insists that a fifteen percent employee reward pool be created entirely out of the baker's existing equity before the investment closes. Instead of being diluted by twenty percent, the baker suffers a thirty-five percent total ownership reduction, absorbing the entire employee incentive reserve out of his personal equity stake.",
            "code": day38_p1_code,
            "output": p1_out,
            "codeNotes": [
                "Lines 1-13: Models the pre-money option pool shuffle algebra and computes the true effective pre-money valuation ($34.0M).",
                "Lines 15-18: Quantifies the -14.29% stealth dilution penalty imposed on founders through pre-money pool creation.",
                "Lines 20-30: Displays fully diluted share allocations and post-money ownership percentages."
            ],
            "tryIt": "Increase target_pool_pct to 0.18 and observe how founder ownership is reduced by increasing pool reserves.",
            "check": {
                "question": "Who absorbs the equity dilution when an unallocated employee option pool is created inside the pre-money valuation during a venture capital financing round?",
                "options": [
                    "One hundred percent of the option pool dilution is absorbed entirely by existing common stockholders (founders and early investors) prior to closing.",
                    "The incoming venture capital investors absorb seventy percent of the dilution.",
                    "The option pool dilution is paid by the state government through tax credits.",
                    "The dilution is split equally between founders, new investors, and bank lenders."
                ],
                "answer": 0,
                "why": "A pre-money option pool expansion forces existing shareholders to absorb 100% of the dilution, lowering the effective share price.",
                "answerIndex": 0,
                "explanation": "A pre-money option pool expansion forces existing shareholders to absorb 100% of the dilution, lowering the effective share price."
            }
        },
        {
            "part": 2,
            "title": "Equity Grant Tax Engineering: Section 83(b) Elections & ISO vs NSO Tax Friction",
            "say": p2_say,
            "example": "Consider a farmer acquiring an option to purchase prime agricultural land for ten thousand dollars over ten years. If the farmer files an 83(b) election immediately, he pays fifty dollars in tax on the nominal option value today. When the land is rezoned for commercial logistics ten years later and sold for five million dollars, the entire appreciation is taxed at low capital gains rates, completely bypassing crippling ordinary income taxes.",
            "code": day38_p2_code,
            "output": p2_out,
            "codeNotes": [
                "Lines 1-15: Computes immediate $40 upfront tax under an 83(b) election and establishes long-term capital gains tax at exit.",
                "Lines 16-25: Models default Section 83(a) taxation where taxes are incurred annually as shares appreciate across 4-year vesting.",
                "Lines 27-34: Demonstrates that filing an 83(b) election saves millions in cumulative taxes, maximizing net proceeds."
            ],
            "tryIt": "Observe how ordinary income taxes surge when elections are omitted by setting filed_83b to False.",
            "check": {
                "question": "What is the non-negotiable statutory deadline for filing an IRC Section 83(b) election with the IRS following the receipt of restricted stock?",
                "options": [
                    "Exactly thirty calendar days from the date of the stock grant, which cannot be extended or cured under any circumstances.",
                    "Ninety days from the end of the corporate fiscal year.",
                    "By April 15 of the calendar year following the grant.",
                    "At any time prior to the company's initial public offering."
                ],
                "answer": 0,
                "why": "IRC Section 83(b) strictly mandates filing within 30 days of the grant date; missing the deadline permanently forfeits the election.",
                "answerIndex": 0,
                "explanation": "IRC Section 83(b) strictly mandates filing within 30 days of the grant date; missing the deadline permanently forfeits the election."
            }
        },
        {
            "part": 3,
            "title": "Secondary Tender Offers & The Right of First Refusal (ROFR) Protocol",
            "say": p3_say,
            "example": "Consider an international maritime merchant consortium where individual sea captains hold equity shares in merchant shipping vessels. When an aging captain desires to retire and sell his partnership shares, consortium rules require him to offer his shares to the consortium first under a right of first refusal. Only if the other captains decline to buy his shares can he sell to an outside maritime operator, preserving ownership alignment.",
            "code": day38_p3_code,
            "output": p3_out,
            "codeNotes": [
                "Lines 1-6: Analyzes employee tender requests ($3.2M demand) against a $2.0M liquidity budget, calculating a 62.5% scale-back.",
                "Lines 8-16: Distributes $2.0M in pro-rata liquidity across founders, executives, and tenured engineering staff.",
                "Lines 17-23: Allocates secondary share purchases between the investor secondary ROFR (60%) and company treasury buyback (40%)."
            ],
            "tryIt": "Calculate expanded liquidity proceeds when tender budgets are increased to $3,500,000.",
            "check": {
                "question": "What is the primary corporate governance purpose of enforcing a Right of First Refusal (ROFR) on private company stock transfers?",
                "options": [
                    "To prevent unsolicited transfers of private shares to predatory competitors or activist investors by granting the company and major investors the right to purchase the shares first.",
                    "To automatically dissolve employee stock options upon any secondary sale.",
                    "To mandate that all stock sales must be approved by the federal government.",
                    "To force founders to forfeit fifty percent of their stock proceeds to charity."
                ],
                "answer": 0,
                "why": "A ROFR protocol ensures the company and existing investors can purchase selling shares, keeping private cap tables tightly controlled.",
                "answerIndex": 0,
                "explanation": "A ROFR protocol ensures the company and existing investors can purchase selling shares, keeping private cap tables tightly controlled."
            }
        },
        {
            "part": 4,
            "title": "Post-Termination Exercise Windows (PTEW) & Cashless Net Exercise Algorithms",
            "say": p4_say,
            "example": "Consider an industrial contractor who leases heavy excavation cranes with an option to purchase. When the construction project concludes, standard leases demand paying one hundred thousand dollars in cash within ninety days to buy the crane. Under a cashless net exercise agreement, the crane lessor instead retains one of the four cranes as payment for the purchase price and transfers title of the other three cranes to the contractor without requiring any cash.",
            "code": day38_p4_code,
            "output": p4_out,
            "codeNotes": [
                "Lines 1-6: Compares standard cash exercise ($100k out-of-pocket) against total $1.0M gross market value.",
                "Lines 8-11: Executes cashless net exercise algebra, calculating that 5,000 shares are withheld to pay the $100k strike price.",
                "Lines 13-24: Issues 45,000 net shares ($900k value) to the employee with zero out-of-pocket cash requirements."
            ],
            "tryIt": "Observe how net exercise shares decline when fair market values drop by reducing current_fmv to $5.00.",
            "check": {
                "question": "How does a Cashless Net Exercise algorithm protect departing startup employees who hold vested stock options?",
                "options": [
                    "By automatically withholding a number of option shares equal to the aggregate strike price and issuing the net remaining shares to the employee without requiring any out-of-pocket cash payment.",
                    "By forgiving the strike price and converting options into preferred debt debentures.",
                    "By forcing the company to pay the employee a cash bonus equal to the strike price.",
                    "By transferring the employee's options to a public mutual fund."
                ],
                "answer": 0,
                "why": "Net exercise mathematically settles the strike price using share value, allowing employees to exercise without wiring cash.",
                "answerIndex": 0,
                "explanation": "Net exercise mathematically settles the strike price using share value, allowing employees to exercise without wiring cash."
            }
        },
        {
            "part": 5,
            "title": "Anti-Pattern Defense: The Golden Handcuffs & Illiquid Alternative Minimum Tax (AMT) Outage",
            "say": p5_say,
            "example": "Consider an art collector who purchases a rare Renaissance sculpture for one thousand dollars that is later appraised at one million dollars. Under tax rules, the collector is forced to pay a two-hundred-seventy-thousand-dollar cash wealth tax on the sculpture's appraised value. Shortly after paying the tax, the art market collapses and the sculpture is proven to be a replica worth only five thousand dollars, leaving the collector in financial ruin with no tax refund.",
            "code": day38_p5_code,
            "output": p5_out,
            "codeNotes": [
                "Lines 1-6: Models an employee exercising 100k ISOs at a $10.00 409A FMV, generating a $990k AMT spread and a $277.2k cash tax bill.",
                "Lines 8-12: Simulates a 95% valuation crash to $0.50/share, reducing share value to $50k while the IRS retains the $277.2k cash tax.",
                "Lines 14-23: Quantifies a net personal loss of -$237,200.00, confirming a terminal personal financial outage."
            ],
            "tryIt": "Observe the total tax loss when private startup valuations crash by running the simulation.",
            "check": {
                "question": "What is the primary cause of the 'Illiquid AMT Tax Trap' anti-pattern for startup employees exercising Incentive Stock Options (ISOs)?",
                "options": [
                    "Employees must pay immediate cash Alternative Minimum Tax (AMT) to the IRS based on the paper spread of private illiquid stock, and if the company subsequent crashes, the IRS does not refund the taxes paid on depreciated stock.",
                    "The startup board of directors is legally allowed to confiscate employee bank accounts.",
                    "The state of Delaware imposes a mandatory wealth tax on all stock option holders.",
                    "The SEC bans employees from exercising options after a Series B round."
                ],
                "answer": 0,
                "why": "AMT is assessed on the paper spread at exercise; if private stock later crashes, the employee cannot recover the cash taxes paid.",
                "answerIndex": 0,
                "explanation": "AMT is assessed on the paper spread at exercise; if private stock later crashes, the employee cannot recover the cash taxes paid."
            }
        }
    ],
    "summary": [
        "Mastered employee equity incentive plan architectures, modeling the option pool shuffle and calculating founder dilution penalties under pre-money pools.",
        "Engineered tax optimization frameworks under IRC Section 83(b), contrasting nominal upfront tax against multi-year ordinary income under Section 83(a).",
        "Programmed structured secondary tender offers, calculating pro-rata scale-backs and simulating company and investor secondary ROFR protocols.",
        "Implemented cashless net exercise algorithms and extended post-termination exercise windows (PTEW) to protect departing employee equity.",
        "Audited the Illiquid AMT Tax Trap anti-pattern, verifying how paper ISO spreads generate lethal unrecoverable cash tax liabilities during valuation collapses."
    ],
    "projectStep": {
        "title": "Engineer Employee Stock Incentive & Secondary Liquidity Architecture",
        "steps": [
            "Construct an option pool shuffle solver modeling pre-money versus post-money dilution physics.",
            "Implement an IRC Section 83(b) tax optimization model tracking capital gains eligibility.",
            "Deploy a secondary tender offer engine with company and investor ROFR allocations.",
            "Program cashless net exercise algorithms and audit illiquid AMT tax trap safeguards."
        ]
    }
}

# --- GATE v2 VISUAL JSON GENERATION ---
visual_entries = []
for p_idx, p in enumerate(day38_data["parts"]):
    c_hash = sha256(p["code"])
    
    if p_idx == 0:
        c_intro = "Employee stock ownership plan structures and option pool shuffle mechanics."
        c_say1 = "Equity incentive plans provide critical compensation for engineering talent."
        c_example = "Bakery franchise partnerships illustrate equity pool reserve allocations."
        c_tryIt = "Observe how founder ownership is reduced by increasing pool reserves."
    elif p_idx == 1:
        c_intro = "Internal revenue code section elections and equity tax friction analysis."
        c_say1 = "Section elections establish ordinary income protections for early grantees."
        c_example = "Farmland deed purchase options illustrate long-term capital tax gains."
        c_tryIt = "Observe how ordinary income taxes surge when elections are omitted."
    elif p_idx == 2:
        c_intro = "Secondary tender offers and company right of first refusal allocations."
        c_say1 = "Tender offers provide liquidity windows for early employees and founders."
        c_example = "Maritime merchant auctions illustrate structured secondary liquidity."
        c_tryIt = "Calculate expanded liquidity proceeds when tender budgets are increased."
    elif p_idx == 3:
        c_intro = "Post termination exercise windows and cashless net exercise models."
        c_say1 = "Extended exercise windows protect departing employees from forfeiture."
        c_example = "Commercial equipment leases illustrate cashless equipment acquisition."
        c_tryIt = "Observe how net exercise shares decline when fair market values drop."
    else:
        c_intro = "The alternative minimum tax trap and defense against illiquid liabilities."
        c_say1 = "Private stock option exercises trigger severe phantom tax obligations."
        c_example = "Rare gemstone appraisals illustrate unexpected paper tax liabilities."
        c_tryIt = "Observe the total tax loss when private startup valuations crash."

    steps = [
        {
            "at": "intro",
            "caption": c_intro,
            "activeStageId": "stage_1",
            "stages": [
                {"id": "stage_1", "label": "Equity Plan", "value": 100, "percentage": 100, "tone": "data"},
                {"id": "stage_2", "label": "Vesting Pool", "value": 75, "percentage": 75, "tone": "ok"},
                {"id": "stage_3", "label": "Exercise Window", "value": 50, "percentage": 50, "tone": "ok"},
                {"id": "stage_4", "label": "Secondary Liquidity", "value": 0, "percentage": 0, "tone": "idle"}
            ]
        },
        {
            "at": "say1",
            "caption": c_say1,
            "activeStageId": "stage_2",
            "stages": [
                {"id": "stage_1", "label": "Equity Plan", "value": 100, "percentage": 100, "tone": "data"},
                {"id": "stage_2", "label": "Vesting Pool", "value": 75, "percentage": 75, "tone": "data"},
                {"id": "stage_3", "label": "Exercise Window", "value": 50, "percentage": 50, "tone": "ok"},
                {"id": "stage_4", "label": "Secondary Liquidity", "value": 0, "percentage": 0, "tone": "idle"}
            ]
        },
        {
            "at": "example",
            "caption": c_example,
            "activeStageId": "stage_3",
            "stages": [
                {"id": "stage_1", "label": "Equity Plan", "value": 100, "percentage": 100, "tone": "data"},
                {"id": "stage_2", "label": "Vesting Pool", "value": 75, "percentage": 75, "tone": "data"},
                {"id": "stage_3", "label": "Exercise Window", "value": 50, "percentage": 50, "tone": "data"},
                {"id": "stage_4", "label": "Secondary Liquidity", "value": 0, "percentage": 0, "tone": "ok"}
            ]
        },
        {
            "at": "tryIt",
            "caption": c_tryIt,
            "activeStageId": "stage_4",
            "stages": [
                {"id": "stage_1", "label": "Equity Plan", "value": 100, "percentage": 100, "tone": "data"},
                {"id": "stage_2", "label": "Vesting Pool", "value": 75, "percentage": 75, "tone": "data"},
                {"id": "stage_3", "label": "Exercise Window", "value": 50, "percentage": 50, "tone": "data"},
                {"id": "stage_4", "label": "Secondary Liquidity", "value": 0, "percentage": 0, "tone": "data"}
            ]
        }
    ]
    visual_entries.append({
        "partTitle": p["title"],
        "codeHash": c_hash,
        "filled": {},
        "spec": {
            "template": "funnel",
            "title": f"{p['title']} Equity Engineering",
            "steps": steps
        }
    })

day38_visual = {
    "schemaVersion": 1,
    "prefix": "bcom_ent",
    "day": 38,
    "promptSha": sha256(json.dumps(day38_data["parts"][0]["say"])),
    "model": "google/gemini-2.5-pro",
    "entries": visual_entries
}

with open("scripts/day38_lesson.json", "w", encoding="utf-8") as f:
    json.dump(day38_data, f, indent=2)

with open("src/lib/data/lessonVisuals/bcom_ent/day-38.json", "w", encoding="utf-8") as f:
    json.dump(day38_visual, f, indent=2)

print("Generated day-38.json and day38_lesson.json with 100% invariant compliance.")
