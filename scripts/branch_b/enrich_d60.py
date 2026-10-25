import json

with open("scripts/branch_b/day60_ban_data.json", "r", encoding="utf-8") as f:
    d = json.load(f)

# Enrich Part 1
extra_p1 = (
    " Delving deeper into the executive fiduciary responsibilities of the G-SIFI leadership team, enterprise bank management "
    "requires a continuous, holistic alignment between the bank's risk appetite framework (RAF) and its strategic business plan. "
    "Under Basel Committee corporate governance guidelines for commercial banks, the board of directors must establish clear, non-negotiable "
    "risk boundaries across credit concentration, interest rate risk in the banking book (IRRBB), foreign exchange open positions, "
    "and liquidity coverage ratios. In a systemically important bank, every capital deployment decision—whether expanding the corporate loan "
    "book, underwriting sovereign debt auctions, or funding fintech lending initiatives—must be evaluated through the lens of Risk-Adjusted "
    "Return on Capital (RAROC) and Economic Value Added (EVA). By pricing all products with rigorous capital Hurdle Rates that account for "
    "both regulatory minimums and unexpected economic shocks, the executive command team ensures long-term institutional survival and "
    "sustained shareholder value creation across multi-year macroeconomic credit cycles."
)
d["parts"][0]["say"].append(extra_p1)

# Enrich Part 2
extra_p2 = (
    " Delving further into the microstructural mechanics of sovereign bond trading, the treasury trading desk must actively manage "
    "'repo market liquidity' and collateral velocity. In addition to primary auction bidding and STRIPS decoupling, modern bank treasury "
    "divisions operate active collateral management and securities financing transaction (SFT) desks. When the bank absorbs primary "
    "auction devolvements of government securities, those sovereign bonds become eligible for immediate mobilization in the tri-party "
    "repo market or the central bank's standing liquidity facilities. By lending out scarce, on-the-run benchmark bonds in the bilateral "
    "repo market against general collateral (GC), the desk captures a lucrative 'special repo spread'. This active collateral optimization "
    "ensures that sovereign bond inventory is never allowed to sit as idle deadweight on the balance sheet, but instead operates as a high-velocity "
    "engine of liquidity and net interest margin enhancement."
)
d["parts"][1]["say"].append(extra_p2)

# Enrich Part 3
extra_p3 = (
    " Examining the broader digital transformation across digital public infrastructure (DPI), Open Banking is now rapidly expanding "
    "into 'Open Finance' and 'Open Data'. In advanced digital financial architectures, the Account Aggregator framework is being extended "
    "beyond banking deposit accounts to encompass securities investment holdings, mutual fund folios, insurance policy cash values, "
    "pension wealth ledgers, and real-time electronic goods and services tax (GST) invoice streams. When an algorithmic underwriting "
    "engine can cross-reconcile a commercial borrower's bank account cash flows against their audited electronic tax filings and GST "
    "invoicing data in real time, the probability of fraudulent misrepresentation plummets to near zero. Furthermore, this multi-source data "
    "fusion enables the bank to introduce dynamic, cash-flow-linked revolving credit lines that automatically expand during seasonal "
    "sales peaks and contract during inventory build-up cycles, delivering unprecedented credit velocity to the real economy."
)
d["parts"][2]["say"].append(extra_p3)

# Enrich Part 4
extra_p4 = (
    " Furthermore, quantitative credit modeling teams must address the complex challenges of 'climate-related credit rating downgrades' "
    "and portfolio transition alignment. Under the Glasgow Financial Alliance for Net Zero (GFANZ) and international regulatory mandates, "
    "commercial banks must establish science-based decarbonization pathways aligned with the Paris Agreement's 1.5°C threshold. If a large "
    "corporate borrower refuses to adopt an audited low-carbon transition plan, credit rating agencies will systematically downgrade the "
    "obligor's credit rating due to impending carbon border taxes and stranded asset risks. Under IFRS 9 staging rules, a significant "
    "increase in credit risk (SICR) forces the bank to migrate the exposure from Stage 1 (12-month expected credit loss) to Stage 2 "
    "(lifetime expected credit loss), multiplying required loan provisions. By proactively structuring Sustainability-Linked Loans with "
    "enforceable decarbonization covenants, the bank protects the borrower from rating downgrades, safeguards its own balance sheet from "
    "provisioning spikes, and drives systemic decarbonization in the real economy."
)
d["parts"][3]["say"].append(extra_p4)

# Enrich Part 5
extra_p5 = (
    " Delving into the ultimate historical significance of the Milestone 12 Capstone, mastering this unified banking architecture "
    "elevates you into the highest echelon of global financial leadership. Across the sixty days of this curriculum, you have journeyed "
    "from the foundational mechanics of double-entry bookkeeping and statutory credit underwriting to the commanding heights of sovereign "
    "debt management, central bank monetary steering, digital public infrastructure, and climate risk resilience. In the simulated crisis, "
    "a lesser institution would have succumbed to liquidity gridlock, suffered crippling auction devolvement losses, or faced regulatory "
    "conservatorship due to climate credit impairments. In sharp contrast, your decisive, synchronized command across all five pillars "
    "turned a severe multi-dimensional crisis into an overwhelming institutional triumph. You have demonstrated that when quantitative "
    "rigor, regulatory mastery, technological innovation, and ethical fiduciary stewardship converge, commercial banking becomes the "
    "indispensable engine of societal progress and global economic stability. Congratulations, Grand Master!"
)
d["parts"][4]["say"].append(extra_p5)

with open("scripts/branch_b/day60_ban_data.json", "w", encoding="utf-8") as f:
    json.dump(d, f, indent=2)

print("Enriched Day 60 successfully!")
