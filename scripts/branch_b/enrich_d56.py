import json

with open("scripts/branch_b/day56_ban_data.json", "r", encoding="utf-8") as f:
    d = json.load(f)

# Enrich Part 1
extra_p1 = (
    " Delving deeper into the quantitative dynamics of reserve money, high-powered money ($M_0$) is mathematically defined as "
    "currency in circulation ($CIC$) plus bankers' deposits with the central bank plus other deposits with the central bank. "
    "When a commercial bank experiences a deposit withdrawal at an ATM or branch counter, the central bank debits the commercial "
    "bank's settlement reserve account and credits currency in circulation. This transformation changes the composition of $M_0$ "
    "without altering its total volume, but it directly drains the commercial banking system's lendable excess reserves. "
    "Furthermore, central bank foreign exchange interventions require sophisticated sterilization techniques. When the central "
    "bank purchases foreign exchange reserves, it injects domestic high-powered money. If this reserve expansion threatens the "
    "central bank's monetary stance by stoking excess domestic credit creation, the central bank must immediately execute 'sterilization' "
    "by conducting outright OMO bond sales or issuing Market Stabilization Scheme (MSS) treasury bonds, absorbing the newly created "
    "domestic liquidity and keeping the total money supply strictly aligned with macroeconomic stability objectives."
)
d["parts"][0]["say"].append(extra_p1)

# Enrich Part 3
extra_p3 = (
    " Delving further into the microstructural dynamics of sovereign bond markets during large-scale central bank asset purchases, "
    "quantitative easing and outright OMOs profoundly alter the behavior of primary dealers and institutional bond market participants. "
    "When the central bank initiates an aggressive sovereign bond purchase program, it systematically removes 'duration risk' from the "
    "private marketplace. Duration measures the sensitivity of a bond's price to fluctuations in interest rates. By vacuuming up "
    "high-duration ten-year, twenty-year, and thirty-year sovereign benchmark bonds, the central bank compresses the term premium—the "
    "excess yield compensation that long-term investors demand for bearing interest rate volatility over multi-decade horizons. "
    "This term premium compression cascades across the entire fixed-income universe: investment-grade corporate bond yields drop, "
    "commercial mortgage spreads narrow, and municipal financing costs decline. However, central bank market desks must be careful "
    "not to create 'market illiquidity' or collateral scarcity. If the central bank buys up too large a fraction of the outstanding "
    "float of a specific benchmark security, repo market participants will struggle to borrow that bond for settlement, causing "
    "repo rates on that specific issue to trade 'on special' (well below the general collateral repo rate)."
)
d["parts"][2]["say"].append(extra_p3)

# Enrich Part 4
extra_p4 = (
    " Furthermore, commercial bank ALCO executives must navigate the statutory 'repricing mismatch' inherent in bank balance sheets "
    "when analyzing the Interest Rate Channel. Most commercial banks operate with an asset-liability duration mismatch: their deposit "
    "liabilities are predominantly short-term (savings accounts, current accounts, and short-tenor fixed deposits), whereas their "
    "loan assets encompass multi-year floating or fixed-rate facilities. When the central bank slashes the policy repo rate during an "
    "economic downturn, loans tied to external benchmarks immediately reprice downward, causing interest income to drop sharply. "
    "However, term deposits reprice downward only as existing contracts mature and roll over over six to eighteen months. In the interim, "
    "the bank suffers a temporary margin squeeze known as 'lagged repricing compression'. Conversely, during an aggressive tightening "
    "cycle, floating loan yields leap upward overnight while deposit interest rates climb sluggishly, generating a windfall surge in "
    "net interest margin (NIM) before retail depositors awaken to competitive yields and shift funds into higher-yielding wholesale paper."
)
d["parts"][3]["say"].append(extra_p4)

# Enrich Part 5
extra_p5 = (
    " Delving into the executive governance of the joint Central Bank and Commercial Bank War Room, participants must understand "
    "how regulatory liquidity buffers—specifically the Liquidity Coverage Ratio (LCR) and Net Stable Funding Ratio (NSFR) under Basel III—interact "
    "with central bank standing facilities. Under Basel III LCR mandates, commercial banks must maintain an unencumbered stock of High-Quality "
    "Liquid Assets (HQLA) sufficient to withstand a 30-day severe liquidity stress scenario. Sovereign government securities held under "
    "Statutory Liquidity Ratio (SLR) requirements qualify as Level 1 HQLA (attracting a 0% haircut). However, when a commercial bank "
    "pledges its excess G-Secs at the central bank repo window to borrow cash, those pledged securities become encumbered and are removed "
    "from the bank's stock of HQLA, while the cash borrowed replaces them as Level 1 assets. In contrast, borrowing via the Marginal "
    "Standing Facility (MSF) by carving out an exemption from statutory SLR mandates requires meticulous regulatory disclosure and board "
    "oversight, as prolonged reliance on penalty standing facilities signals severe structural funding vulnerabilities to supervisory inspectors. "
    "Mastering this delicate equilibrium between central bank liquidity facilities, statutory reserve ratios, and dynamic balance sheet "
    "yield optimization is the definitive hallmark of an elite banking treasurer."
)
d["parts"][4]["say"].append(extra_p5)

with open("scripts/branch_b/day56_ban_data.json", "w", encoding="utf-8") as f:
    json.dump(d, f, indent=2)

print("Enriched Day 56 successfully!")
