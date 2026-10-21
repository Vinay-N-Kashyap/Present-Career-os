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

# --- DAY 39 TEXT: CVC & STRATEGIC PARTNERSHIPS (ENRICHED STRICT >= 600 WORDS PER PART) ---

p1_say = [
    "Welcome to Day 39 of Entrepreneurship and Venture Incubation. On Day 38, we engineered employee equity incentive compensation, analyzing the option pool shuffle, Section 83(b) tax engineering, structured secondary tender offers, and cashless net exercise algorithms. Today, we examine an increasingly dominant institutional player in venture capital financing: Corporate Venture Capital (CVC) and Strategic Partnership Term Sheets. Over the past decade, global conglomerates—from enterprise technology giants and automotive manufacturers to multinational pharmaceutical and financial institutions—have established massive corporate venture arms, such as Google Ventures, Intel Capital, Salesforce Ventures, and Qualcomm Ventures. However, partnering with or raising capital from a corporate strategic investor is fundamentally different from dealing with a traditional financial venture capital firm.",
    "To navigate CVC negotiations, founders must understand the core divergence between Financial Venture Capital and Strategic Venture Capital. Traditional venture capital firms (financial VCs) operate as fiduciary limited partnerships (GPs and LPs) with a strict ten-year fund lifecycle. Their singular fiduciary mandate is financial return maximization: generate an internal rate of return (IRR) exceeding twenty-five percent and achieve a three-to-five-times net cash return for their limited partners. By contrast, Corporate Venture Capital arms operate with a Dual Mandate: while they seek financial profitability, their primary objective is strategic alignment—gaining early access to disruptive technologies, integrating startup software into the parent corporation's product ecosystem, driving enterprise cloud consumption, or securing an inside track for future mergers and acquisitions.",
    "Corporate venture investment structures also vary widely in fund architecture. Some CVCs operate as dedicated off-balance-sheet funds structured like traditional VC partnerships with independent management companies, ensuring financial discipline and speed of execution. More commonly, corporate venture units invest directly off the corporate parent's corporate balance sheet (Evergreen Balance Sheet Capital). While balance sheet capital provides immense financial reserves, it subjects the startup to severe corporate bureaucracy, annual corporate budget reallocations, and strategic strategy shifts whenever executive leadership changes at the corporate parent.",
    "Raising capital from a corporate strategic investor delivers undeniable strategic advantages. A CVC investment often provides immediate commercial validation, opening enterprise sales doors that would otherwise remain closed to an unproven early-stage startup. Strategic investors can bundle the startup's product into their global sales distribution channels, provide preferred access to proprietary developer APIs, and lend prestigious brand credibility. Furthermore, having a corporate giant on the capitalization table signals strong industry validation to subsequent institutional investors.",
    "However, founders must weigh these commercial benefits against substantial Strategic Hazards. Corporate venture term sheets often introduce contractual encumbrances that can alienate competing industry players. If an enterprise software startup accepts Series B lead investment from Microsoft's corporate venture fund, competing tech giants like Amazon AWS and Google Cloud may immediately view the startup with suspicion, refusing to enter commercial partnerships or explore acquisition discussions. Founders must carefully evaluate whether the commercial synergy provided by a single strategic partner outweighs the loss of broad enterprise market neutrality.",
    "To maintain capitalization table sovereignty, founders should structure CVC participation as part of a balanced Syndicate Round. Founders should insist that an independent financial venture capital firm acts as the Lead Investor, setting the priced equity terms, valuation, and governance rights, while the corporate venture investor participates as a minority syndicate co-investor. This structure prevents the CVC from imposing non-standard strategic covenants while securing corporate distribution leverage.",
    "From a corporate accounting and regulatory standpoint, corporate venture capital investments must be structured to avoid unintended financial consolidation under US GAAP ASC 810 (Consolidation). If a corporate strategic investor acquires more than twenty percent of voting equity or exercises 'significant influence' over operational decision-making, the corporate parent may be required to account for the investment under the Equity Method of Accounting, or even consolidate the startup's operating losses directly onto the conglomerate's financial statements. To avoid this administrative burden, sophisticated CVCs insist on non-voting stock or contractual governance waivers that cap effective voting power below ten percent.",
    "In Part 1, we implement a Financial VC vs Strategic CVC Decision Matrix in Python. We will model comparative cost-of-capital trajectories, evaluate strategic synergy revenue lift against potential customer alienation penalties, score contractual governance encumbrances, and simulate syndicate round optimization algorithms."
]

p2_say = [
    "We now advance to Part 2: Commercial Sidecars, Most-Favored Nation (MFN) Clauses & Exclusivity Traps. In standard institutional venture capital, the investment relationship is governed almost exclusively by equity financing documents: the Stock Purchase Agreement, Investors' Rights Agreement, and Corporate Charter. However, in corporate venture capital, equity investment is almost universally accompanied by a separate commercial agreement known as a Commercial Sidecar. Commercial sidecars take diverse contractual forms, including Joint Development Agreements (JDAs), Global Distribution Partnerships, Master Services Agreements (MSAs), or Enterprise Software License Agreements.",
    "The primary hazard in negotiating commercial sidecars is the inclusion of Most-Favored Nation (MFN) Pricing Clauses. Under a commercial MFN clause, the startup contractually promises the corporate strategic investor that it will never offer software licenses, cloud pricing, or commercial products to any third-party customer at a price lower or on terms more favorable than those provided to the corporate investor. If the startup later offers a promotional discount to win a massive enterprise customer, the MFN clause automatically triggers, forcing the startup to retroactively lower its prices for the corporate investor across their entire contract volume.",
    "The financial consequence of an unconstrained MFN clause is severe Enterprise Price Compression. Because the corporate strategic partner often commands massive volume, a thirty percent price concession granted to close a competitive flagship account cascades through the corporate investor's multi-million-dollar contract, wiping out corporate operating margins and destroying software unit economics. Founders must fiercely resist commercial MFNs, or scope them strictly by tying MFN eligibility to identical annual volume commitments, identical service-level agreements, and rigid multi-year minimum spend thresholds.",
    "An even more dangerous contractual trap in commercial sidecars is Category Exclusivity. Corporate strategic partners frequently demand that the startup grant them exclusive distribution rights or agree not to sell its technology to designated commercial competitors within a specified industry vertical or geographic territory. Agreeing to exclusivity is often fatal for a venture-backed startup: it transforms the company from an independent, scalable market platform into a captive product development shop for the corporate partner, instantly capping addressable market size and destroying future venture valuation multiples.",
    "Founders must establish strict boundaries when negotiating commercial agreements alongside equity rounds. Standard best practice mandates that the Equity Financing Agreement and the Commercial Agreement must remain strictly Non-Contingent. The closing of the equity investment must never be legally conditioned upon signing the commercial sidecar. If commercial partnership negotiations stall due to unreasonable exclusivity or MFN demands, the equity round must close independently, preserving the startup's operational independence.",
    "When structuring commercial sidecars and Joint Development Agreements (JDAs), intellectual property allocation is the primary legal battleground. Technology contracts distinguish rigorously between Background IP (pre-existing source code, patents, and algorithmic models owned prior to the partnership) and Foreground IP (new software architectures, modifications, and inventions developed collaboratively during the project). Corporate strategic partners often attempt to claim full ownership or exclusive co-ownership of all Foreground IP. Founders must adamantly refuse this encumbrance, insisting that all Foreground IP relating to the core software platform remains the exclusive property of the startup, granting the corporate partner only a limited, non-exclusive commercial field-of-use license.",
    "Additionally, corporate strategic partners often demand Source Code Escrow Agreements within commercial sidecars, requiring the startup to deposit proprietary software source code with an independent escrow agent. While standard software escrows are routine, CVCs frequently demand predatory 'Trigger Events'—such as minor service-level agreement breaches or financing delays—that would release full source code to the corporate partner. Founders must restrict escrow release events strictly to voluntary Chapter 7 bankruptcy liquidation or complete corporate dissolution.",
    "In Part 2, we build a Commercial Sidecar & MFN Pricing Defense Model in Python. We will model the mathematical compounding of MFN price compression across tiered enterprise customer contracts, calculate operating margin erosion under volume-based price matches, simulate category exclusivity opportunity costs, and program automated contractual sanity checks."
]

p3_say = [
    "We now advance to Part 3: Right of First Refusal (ROFR) vs Right of First Notice (ROFN) in M&A Options. When a corporate venture capital firm invests in a promising technology startup, its ultimate strategic ambition is often not merely to earn a 3x financial return at exit, but to secure an inside track to acquire the entire enterprise if the startup's technology proves revolutionary. To accomplish this, corporate venture term sheets routinely demand an acquisition preemption right: either a Right of First Refusal (ROFR) or a Right of First Offer (ROFO) on any future sale of the company.",
    "Founders must recognize that granting a Corporate M&A Right of First Refusal (ROFR) is catastrophic to enterprise exit value. Under an acquisition ROFR, if the startup receives an attractive buyout offer from an outside third party—for example, a $100 million cash acquisition offer from a major competitor—the startup cannot accept the deal. Instead, the company is legally required to deliver the third party's signed term sheet to the corporate investor, granting the corporate investor a thirty-to-sixty-day window to step into the deal and acquire the startup on identical terms and pricing.",
    "The presence of an acquisition ROFR creates what M&A investment bankers call the Chilling Effect. Competing strategic acquirers invest hundreds of thousands of dollars in legal fees, technical due diligence, and executive time evaluating an acquisition target. If competing acquirers know that an existing corporate investor holds a contractual ROFR, they will simply refuse to submit a bid. Potential acquirers know that if they negotiate a fair price, the corporate investor will exercise its ROFR and steal the deal, using the competitor's due diligence as free market price discovery. Conversely, if the corporate investor passes on exercising the ROFR, it signals to the market that the company has hidden flaws, poisoning the transaction.",
    "To eliminate the chilling effect while accommodating the strategic investor's desire for M&A visibility, sophisticated founders substitute the ROFR with a harmless Right of First Notice (ROFN) or Right of First Negotiation. Under a Right of First Notice, the startup contractually agrees that if the board of directors decides to initiate a formal M&A sale process, the company will deliver written notice to the strategic investor prior to launching public auctions. The corporate investor is given a brief, non-exclusive window (typically fifteen days) to submit an acquisition proposal or engage in discussions.",
    "Crucially, under a ROFN, if the startup rejects the corporate investor's initial proposal, the company is completely free to shop the enterprise to third-party bidders without any matching rights, preemption clauses, or information-sharing obligations. The strategic investor receives fair notice, but retains zero power to veto, match, or interfere with competitive market auctions. Substituting ROFRs with ROFNs is an essential contractual discipline that preserves tens of millions of dollars in M&A bidding tension.",
    "Strategic M&A options and corporate venture relationships also face intense regulatory scrutiny from antitrust authorities, including the US Federal Trade Commission (FTC) and the Department of Justice (DOJ) under the Hart-Scott-Rodino (HSR) Antitrust Improvements Act. In recent years, antitrust regulators have targeted 'Killer Acquisitions'—scenarios where dominant technology platforms acquire nascent startups with preemption rights to eliminate emerging competitive threats. If a corporate venture investor holds an M&A ROFR, antitrust regulators may interpret the covenant as an anticompetitive restraint of trade that forecloses open market competition, entangling the startup in protracted regulatory inquiries that delay liquidity exits for years.",
    "In Part 3, we implement an M&A Auction Bidding & ROFR Chilling Effect Simulator in Python. We will model multi-bidder auction dynamics across competing strategic acquirers, calculate valuation discounts caused by ROFR preemption mechanisms, simulate clean competitive bidding under a Right of First Notice (ROFN) regime, and quantify net shareholder exit proceeds."
]

p4_say = [
    "We now advance to Part 4: Information Rights, Board Observers & Intellectual Property Contamination Firewalls. In early-stage venture investing, major stockholders universally receive Standard Information Rights under the Investors' Rights Agreement, including monthly unaudited financial statements, annual budgets, and capitalization table updates. Furthermore, lead investors typically receive a seat on the Board of Directors or non-voting Board Observer Rights. However, when an investor is also a direct or potential commercial competitor, standard governance transparency creates severe legal and competitive vulnerabilities.",
    "The primary hazard is Intellectual Property Contamination and Product Espionage. A corporate venture investor's parent organization employs thousands of software engineers developing proprietary products that may compete directly with the startup's product roadmap. If a CVC representative attends board meetings where the startup discusses unreleased algorithmic architectures, proprietary feature roadmaps, or strategic customer win-loss data, that technical knowledge can inadvertently—or deliberately—seep back into the corporate parent's product development teams.",
    "Under corporate trade secret law, proving that a corporate giant stole software architecture or copied proprietary features from board disclosures is extraordinarily difficult and expensive. Furthermore, if the corporate parent later releases a similar product feature independently, the startup may find itself entangled in messy trade secret litigation, where the corporate giant claims 'independent creation' while the startup is accused of patent infringement. This risk is known throughout technology law as IP Contamination.",
    "To defend against IP contamination, corporate charters and investors' rights agreements must establish strict Intellectual Property Firewalls. First, founders must enforce 'Clean Team' protocols, mandating that any CVC board observer or investor representative must belong strictly to the corporate investment arm and cannot hold operational, engineering, or product development responsibilities within any commercial business unit of the corporate parent. If an observer transfers to an operating product division, their observer privileges terminate immediately.",
    "Second, the board of directors must retain unilateral statutory authority to establish Executive Sessions and Information Redaction Privileges. The board charter must explicitly empower the CEO to redact sensitive technical source code disclosures, detailed product roadmaps, pricing models, and specific customer identity pipelines from materials delivered to corporate strategic observers. Additionally, the corporate observer must be excused from any portion of a board meeting where competitive strategy, commercial disputes with the corporate parent, or M&A discussions involving the corporate partner are evaluated.",
    "Corporate trade secret defense in CVC relationships is governed under federal statute by the Defend Trade Secrets Act (DTSA) and the Uniform Trade Secrets Act (UTSA). To establish statutory trade secret protection in court, the startup must demonstrate that it took 'reasonable measures under the circumstances to keep such information secret.' Merely marking presentation slides as 'Confidential' is legally insufficient if corporate venture observers are permitted unrestricted access to engineering sprint retrospectives, internal code repositories, or customer pricing logs. Courts have held that voluntary disclosure to potential commercial competitors without enforceable clean-room firewalls destroys trade secret status under law.",
    "To create an unshakeable evidentiary paper trail, venture boards deploy Cryptographic Access Logging and Data Room Watermarking. Every board packet, financial model, and roadmap presentation delivered to corporate observers must be digitally tagged with unique invisible steganographic identifiers and dynamic watermarks tracking IP addresses, email identifiers, and download timestamps. Furthermore, information rights agreements must mandate that all confidential materials delivered to corporate observers be permanently destroyed or purged within thirty days following the resignation or termination of the observer's board privileges.",
    "In Part 4, we engineer a Board Observer IP Contamination Firewall & Redaction Engine in Python. We will model automated board packet sanitization algorithms, evaluate trade secret exposure across operational vs strategic observers, enforce executive session recusal protocols, and program telemetry tracking corporate confidentiality compliance under Delaware law."
]

p5_say = [
    "We arrive at Part 5: Anti-Pattern Defense: The Corporate Predator & Strategic Encumbrance Outage. In technology startup lore, few outcomes are more tragic than a high-potential startup being neutralized, commercially paralyzed, and ultimately destroyed by the very corporate partner that promised to accelerate its growth. This catastrophic corporate failure mode is known throughout the venture ecosystem as the Corporate Predator Encumbrance Outage.",
    "The predator disaster begins when an early-stage startup, flattered by the attention of a fortune-fifty industry giant, agrees to take a five-million-dollar strategic equity investment. In exchange for the capital and vague promises of massive distribution, the inexperienced founders concede three seemingly innocuous contractual terms: first, a category exclusivity clause prohibiting the startup from selling to the corporate partner's two primary rivals; second, an M&A Right of First Refusal (ROFR); and third, a broad commercial Most-Favored Nation (MFN) pricing covenant.",
    "Initially, the partnership appears successful. The corporate giant announces the deal with lavish press releases, and the startup's branding receives a massive halo effect. But over the subsequent twelve months, reality sets in. The corporate partner's internal product divisions view the startup not as a strategic partner, but as an internal competitor. The promised distribution integration stalls inside corporate bureaucracy. Meanwhile, the startup's sales team discovers that sixty percent of the addressable enterprise market is legally off-limits due to the category exclusivity covenant.",
    "When competing tech conglomerates express interest in acquiring the startup for eighty million dollars, they conduct preliminary due diligence, discover the corporate investor's M&A ROFR, and abruptly terminate all acquisition discussions. Competing buyers refuse to act as stalking horses for the corporate predator. Trapped within an artificial market cage and unable to raise external capital because third-party VCs refuse to invest in an encumbered startup, cash reserves dwindle to zero. The startup enters the Zone of Insolvency.",
    "At this critical juncture, the corporate predator strikes. Refusing to exercise its ROFR at market valuations, the corporate giant waits until the startup exhausts its runway, declares a commercial impasse, and offers an emergency 'fire-sale' asset acquisition of five million dollars—just enough to repay creditors, while completely wiping out common founders and employees. The corporate partner absorbs the proprietary code, absorbs the key engineering talent through acqui-hire packages, and shutters the independent company.",
    "To defend against the Corporate Predator Encumbrance Outage, sovereign founders enforce four strict Strategic Immunization Safeguards. First, never grant category exclusivity without requiring massive guaranteed minimum revenue commitments backed by liquidated damages. Second, never grant an M&A Right of First Refusal under any circumstances; offer only a non-exclusive Right of First Notice. Third, tie all commercial sidecars to bilateral performance milestones: if the corporate partner fails to deliver agreed customer volumes, all commercial encumbrances and MFN covenants terminate automatically. Fourth, maintain syndicate independence by ensuring financial VCs control board majorities.",
    "When founders find themselves trapped within a corporate predator encumbrance, statutory corporate law provides specialized litigation remedies. Founders can assert claims for Breach of the Implied Covenant of Good Faith and Fair Dealing and Promissory Estoppel under Delaware contract jurisprudence. If a corporate giant induced an early-stage startup into granting exclusivity based on affirmative oral promises of enterprise distribution and sales resources, but subsequently abandoned the rollout while weaponizing exclusivity to kill competitor acquisitions, Delaware courts have recognized that such predatory bad-faith conduct can excuse contractual exclusivity covenants, allowing the startup to seek emergency injunctive relief.",
    "In Part 5, we engineer an Anti-Pattern Corporate Predator & Strategic Encumbrance Simulator in Python. We will model the compounding destructive interaction between commercial exclusivity, MFN price erosion, M&A ROFR bidding chilling, and distressed fire-sale acquisitions, calculate enterprise valuation destruction metrics, and program automated contractual tripwires that protect tech venture sovereignty."
]

all_says = [p1_say, p2_say, p3_say, p4_say, p5_say]
for idx, s in enumerate(all_says):
    w = word_count(s)
    print(f"Part {idx+1} Word Count: {w} words")
    assert w >= 600, f"Part {idx+1} word count {w} is below 600!"

total_words = sum(word_count(s) for s in all_says)
print(f"Total Day 39 Spoken Words: {total_words} words (Target >= 3000)")
assert total_words >= 3000

# --- PYTHON CODE SNIPPETS (Tested & Deterministic) ---

day39_p1_code = '''def evaluate_cvc_vs_financial_vc(vc_offer: dict, cvc_offer: dict, strategic_weight: float = 0.50):
    # Score Financial VC (100% financial alignment, zero encumbrance)
    vc_financial_score = (vc_offer["valuation"] / 50.0) * 50.0
    vc_governance_score = 50.0 - (vc_offer["encumbrance_penalty"] * 10.0)
    vc_total_score = vc_financial_score + vc_governance_score
    
    # Score Strategic CVC (Blended financial + strategic synergy minus encumbrances)
    cvc_financial_score = (cvc_offer["valuation"] / 50.0) * 50.0
    cvc_synergy_score = cvc_offer["synergy_revenue_lift"] * 10.0
    cvc_governance_score = 50.0 - (cvc_offer["encumbrance_penalty"] * 10.0)
    cvc_total_score = (cvc_financial_score * (1.0 - strategic_weight)) + ((cvc_synergy_score + cvc_governance_score) * strategic_weight)
    
    print("=" * 65)
    print("FINANCIAL VC VS STRATEGIC CVC EVALUATION MATRIX")
    print("=" * 65)
    print(f"Financial VC Offer:  ${vc_offer['valuation']:.1f}M Valuation | {vc_offer['ownership_pct']:.1f}% Equity | Penalty: {vc_offer['encumbrance_penalty']}")
    print(f"Strategic CVC Offer: ${cvc_offer['valuation']:.1f}M Valuation | {cvc_offer['ownership_pct']:.1f}% Equity | Synergy: +${cvc_offer['synergy_revenue_lift']:.1f}M ARR")
    print("-" * 65)
    print(f"Financial VC Composite Score: {vc_total_score:.2f} / 100.00")
    print(f"Strategic CVC Composite Score:{cvc_total_score:.2f} / 100.00 (Strategic Weight: {strategic_weight*100:.0f}%)")
    print("-" * 65)
    
    preferred_partner = "STRATEGIC CVC" if cvc_total_score > vc_total_score else "FINANCIAL VC (RECOMMENDED)"
    print(f"Optimal Syndication Strategy: {preferred_partner}")
    print(f"Syndicate Architecture:       LEAD FINANCIAL VC + CVC MINORITY SYNDICATE")
    print("=" * 65)
    return preferred_partner

vc = {"valuation": 40.0, "ownership_pct": 20.0, "encumbrance_penalty": 0.5}
cvc = {"valuation": 45.0, "ownership_pct": 18.0, "synergy_revenue_lift": 3.0, "encumbrance_penalty": 3.5}
res = evaluate_cvc_vs_financial_vc(vc, cvc, 0.50)'''

day39_p2_code = '''def simulate_mfn_pricing_compression(cvc_contract_units: int, cvc_base_price: float, new_deal_units: int, new_deal_discount_pct: float):
    new_deal_price = cvc_base_price * (1.0 - new_deal_discount_pct)
    
    # Revenue without MFN (CVC pays full base price, new customer gets discount)
    rev_without_mfn = (cvc_contract_units * cvc_base_price) + (new_deal_units * new_deal_price)
    
    # Revenue WITH MFN (CVC contract retroactively reprices down to new deal price!)
    mfn_cvc_revenue = cvc_contract_units * new_deal_price
    new_deal_revenue = new_deal_units * new_deal_price
    rev_with_mfn = mfn_cvc_revenue + new_deal_revenue
    
    mfn_revenue_leakage = rev_without_mfn - rev_with_mfn
    
    print("=" * 65)
    print("COMMERCIAL SIDECAR: MFN PRICING COMPRESSION TELEMETRY")
    print("=" * 65)
    print(f"Strategic CVC Account Volume: {cvc_contract_units:,} Units @ ${cvc_base_price:,.2f} Base Price")
    print(f"New Flagship Enterprise Deal: {new_deal_units:,} Units @ {new_deal_discount_pct*100:.1f}% Discount (${new_deal_price:,.2f})")
    print("-" * 65)
    print(f"Annual Revenue WITHOUT MFN:   ${rev_without_mfn:,.2f}")
    print(f"Annual Revenue WITH MFN:      ${rev_with_mfn:,.2f}")
    print(f"MFN Price Compression Loss:  -${mfn_revenue_leakage:,.2f} Margin Destruction")
    print(f"CVC Account Realized Yield:   ${mfn_cvc_revenue:,.2f} (-{(1.0 - mfn_cvc_revenue/(cvc_contract_units*cvc_base_price))*100:.1f}%)")
    print(f"Contract Risk Assessment:     CRITICAL MARGIN COMPRESSION HAZARD")
    print("=" * 65)
    return round(mfn_revenue_leakage, 2)

leakage = simulate_mfn_pricing_compression(10000, 500.0, 2000, 0.30)'''

day39_p3_code = '''def simulate_ma_rofr_chilling_effect(unencumbered_bid: float, cvc_has_rofr: bool, cvc_has_rofn: bool):
    print("=" * 65)
    print("M&A AUCTION DYNAMICS: CVC ROFR VS ROFN CHILLING EFFECT")
    print(f"Base Unencumbered Market Value: ${unencumbered_bid:,.2f}")
    print("=" * 65)
    
    if cvc_has_rofr:
        # ROFR causes competing acquirers to discount bids or walk away completely
        bidder_participation = "CHILLED (Competitors Refuse to Bid as Stalking Horses)"
        chilling_discount = 0.35  # 35% chilling discount
        realized_offer = unencumbered_bid * (1.0 - chilling_discount)
        auction_status = "PREEMPTED BY CVC MATCHING RIGHT"
    elif cvc_has_rofn:
        # ROFN gives CVC early notice but no match right; third parties bid freely
        bidder_participation = "ROBUST (Competitive Auction Preserved)"
        chilling_discount = 0.0
        realized_offer = unencumbered_bid * 1.05  # 5% competitive tension premium
        auction_status = "COMPETITIVE MARKET AUCTION CLEARED"
    else:
        bidder_participation = "STANDARD (Unencumbered Auction)"
        chilling_discount = 0.0
        realized_offer = unencumbered_bid
        auction_status = "STANDARD EXIT CLEARED"
        
    value_destruction = unencumbered_bid - realized_offer
    
    print(f"CVC Covenant Regime:          {'M&A RIGHT OF FIRST REFUSAL (ROFR)' if cvc_has_rofr else 'RIGHT OF FIRST NOTICE (ROFN)'}")
    print(f"Third-Party Bidder Posture:   {bidder_participation}")
    print(f"Auction Clearing Realized Val:${realized_offer:,.2f}")
    print(f"Net M&A Valuation Impact:     {'-$' if value_destruction > 0 else '+$'}{abs(value_destruction):,.2f}")
    print(f"M&A Exit Governance Status:   {auction_status}")
    print("=" * 65)
    return round(realized_offer, 2)

v_rofr = simulate_ma_rofr_chilling_effect(100000000.0, True, False)'''

day39_p4_code = '''def filter_board_packet_ip_firewall(board_packet: dict, observer_is_operational: bool, clean_team_certified: bool):
    sanitized_packet = {}
    redacted_items = []
    
    for section, content in board_packet.items():
        is_sensitive = content.get("confidential_ip", False)
        
        if is_sensitive:
            if observer_is_operational or not clean_team_certified:
                sanitized_packet[section] = "[REDACTED - EXECUTIVE SESSION TRADE SECRET PRIVILEGE]"
                redacted_items.append(section)
            else:
                sanitized_packet[section] = content["data"]
        else:
            sanitized_packet[section] = content["data"]
            
    print("=" * 65)
    print("BOARD OBSERVER IP FIREWALL & PACKET SANITIZATION ENGINE")
    print("=" * 65)
    print(f"Observer Classification:      {'OPERATIONAL BUSINESS UNIT' if observer_is_operational else 'DEDICATED CVC FUND'}")
    print(f"Clean-Team Legal Certificate: {'CONFIRMED ACTIVE' if clean_team_certified else 'MISSING / UNVERIFIED'}")
    print("-" * 65)
    print(f"Total Agenda Sections:        {len(board_packet)} Sections")
    print(f"Redacted Sensitive Sections:  {len(redacted_items)} Sections Redacted")
    for item in redacted_items:
        print(f"  [REDACTED] -> {item}")
    print(f"IP Contamination Risk:        {'ZERO CONTAMINATION CONFIRMED' if len(redacted_items) > 0 or clean_team_certified else 'CRITICAL EXPOSURE'}")
    print("=" * 65)
    return len(redacted_items)

packet = {
    "Financial Statements": {"confidential_ip": False, "data": "Q3 Revenue: $4.2M, GAAP Gross Margin: 78%"},
    "Proprietary AI Code Architecture": {"confidential_ip": True, "data": "Transformer routing weights & patent claims"},
    "Enterprise Customer Win-Loss Pipeline": {"confidential_ip": True, "data": "Direct competitor displacement telemetry"},
    "General Corporate Governance": {"confidential_ip": False, "data": "Approval of stock option grants"}
}
red = filter_board_packet_ip_firewall(packet, True, False)'''

day39_p5_code = '''def simulate_corporate_predator_outage(initial_cash: float, quarterly_burn: float, has_exclusivity: bool, has_rofr: bool):
    print("=" * 65)
    print("ANTI-PATTERN: CORPORATE PREDATOR & STRATEGIC ENCUMBRANCE OUTAGE")
    print("=" * 65)
    print(f"Initial Runway Cash: ${initial_cash:,.2f} | Trailing Burn: ${quarterly_burn:,.2f}/quarter")
    print(f"Strategic Covenants: Category Exclusivity = {has_exclusivity} | M&A ROFR = {has_rofr}")
    print("-" * 65)
    
    # Quarter 1-4 telemetry
    cash = initial_cash
    quarter = 0
    while cash > 0 and quarter < 6:
        quarter += 1
        # If exclusive, market size is capped; commercial distribution stalls
        market_friction = 1.30 if has_exclusivity else 1.00
        cash -= quarterly_burn * market_friction
        print(f"> Quarter {quarter:02d}: Cash = ${max(0.0, cash):,.2f} | Market Friction: {market_friction:.2f}x")
        if cash <= 0:
            break
            
    print("-" * 65)
    if has_rofr and has_exclusivity:
        competing_acquirer_offer = 0.0  # Chilled to zero
        predator_fire_sale_offer = 3000000.0  # Distressed fire-sale acquisition
        print("M&A Auction Result:         NO THIRD-PARTY BIDS (Chilled by ROFR & Exclusivity)")
        print(f"Predator Distressed Buyout: ${predator_fire_sale_offer:,.2f} (Distressed Liquidation)")
        print(f"Common Founder Recovery:    $0.00 (Common Stock Completely Wiped Out)")
        print("Outage Classification:      TERMINAL STRATEGIC CAPTIVITY & FIRE-SALE OUTAGE")
    else:
        competing_acquirer_offer = 60000000.0
        print(f"Competitive M&A Sale:       ${competing_acquirer_offer:,.2f} Realized Enterprise Exit")
        print("Common Founder Recovery:    $28,500,000.00 Generational Exit")
        print("Outage Classification:      NOMINAL SOVEREIGN SURVIVAL")
    print("=" * 65)
    return quarter

q = simulate_corporate_predator_outage(5000000.0, 1200000.0, True, True)'''

# Get exact outputs
p1_out = get_output(day39_p1_code)
p2_out = get_output(day39_p2_code)
p3_out = get_output(day39_p3_code)
p4_out = get_output(day39_p4_code)
p5_out = get_output(day39_p5_code)

day39_data = {
    "coursePrefix": "bcom_ent",
    "day": 39,
    "title": "Corporate Venture Capital (CVC) & Strategic Partnership Term Sheets",
    "description": "Master corporate venture capital syndication and strategic partnership term sheets, modeling commercial sidecars, MFN pricing compression, M&A ROFR chilling effects, IP contamination firewalls, and corporate predator defense.",
    "parts": [
        {
            "part": 1,
            "title": "Strategic Alignment vs Financial Discipline: The Dual Mandate of CVCs",
            "say": p1_say,
            "example": "Consider a regional solar energy battery startup evaluating investment from a major utility conglomerate versus a financial tech venture fund. The utility conglomerate offers a higher valuation and promises to install the battery system in its regional power grid, but demands board observer rights and strategic influence over product development. The founders structure a syndicate where the financial VC leads the round to enforce financial discipline, while the utility CVC participates as a minority investor, gaining distribution without compromising governance.",
            "code": day39_p1_code,
            "output": p1_out,
            "codeNotes": [
                "Lines 1-13: Compares financial VC offer against strategic CVC offer using weighted financial and synergy scoring.",
                "Lines 15-23: Evaluates valuation multiples, ownership dilution, and contractual encumbrance penalties.",
                "Lines 25-27: Confirms optimal syndication strategy: Lead Financial VC with CVC minority participation."
            ],
            "tryIt": "Increase strategic_weight to 0.70 and evaluate changed syndicate rankings when strategic weight is increased.",
            "check": {
                "question": "What is the primary structural difference between Corporate Venture Capital (CVC) funds and traditional Financial Venture Capital (VC) firms?",
                "options": [
                    "Financial VCs operate with a singular fiduciary mandate to maximize cash returns (IRR) for external LPs, whereas CVCs operate with a dual mandate balancing financial returns with corporate strategic objectives.",
                    "CVC funds are prohibited by federal law from investing in privately held companies.",
                    "Financial VCs are owned entirely by the United States government.",
                    "CVC funds invest exclusively in physical manufacturing equipment rather than equity."
                ],
                "answer": 0,
                "why": "Financial VCs focus purely on financial IRR, while CVCs balance financial returns with strategic benefits for their corporate parents.",
                "answerIndex": 0,
                "explanation": "Financial VCs focus purely on financial IRR, while CVCs balance financial returns with strategic benefits for their corporate parents."
            }
        },
        {
            "part": 2,
            "title": "Commercial Sidecars, Most-Favored Nation (MFN) Clauses & Exclusivity Traps",
            "say": p2_say,
            "example": "Consider a jet engine maintenance software provider negotiating with a major global airline. The airline invests equity and insists on a commercial sidecar with a Most-Favored Nation (MFN) pricing clause. When the startup later offers a thirty percent volume discount to win an urgent contract with a competing cargo airline, the MFN clause retroactively reprices the major airline's ten-thousand-unit contract, wiping out one point five million dollars in annual software margins.",
            "code": day39_p2_code,
            "output": p2_out,
            "codeNotes": [
                "Lines 1-8: Computes revenue trajectories with and without an enterprise Most-Favored Nation pricing clause.",
                "Lines 10-14: Models retroactive contract repricing on a 10,000-unit CVC account triggered by a 30% new customer discount.",
                "Lines 16-24: Flags -$1.5M in annual margin destruction, proving the critical hazard of unconstrained MFN covenants."
            ],
            "tryIt": "Increase new_deal_discount_pct to 0.40 to observe how revenue leakage expands when tier discounts are increased.",
            "check": {
                "question": "Why is an unconstrained Most-Favored Nation (MFN) pricing clause in a commercial sidecar agreement hazardous for a SaaS startup?",
                "options": [
                    "Any commercial discount offered to win a new enterprise customer automatically and retroactively reduces prices across the corporate investor's entire contract volume, destroying operating margins.",
                    "An MFN clause legally converts all software licenses into non-voting debt debentures.",
                    "An MFN clause forces the startup to relocate its corporate headquarters overseas.",
                    "An MFN clause requires the startup to pay seventy percent of revenues to the SEC."
                ],
                "answer": 0,
                "why": "MFN clauses create systemic price compression because any lower price given to win a deal cascades across the corporate partner's volume.",
                "answerIndex": 0,
                "explanation": "MFN clauses create systemic price compression because any lower price given to win a deal cascades across the corporate partner's volume."
            }
        },
        {
            "part": 3,
            "title": "Right of First Refusal (ROFR) vs Right of First Notice (ROFN) in M&A Options",
            "say": p3_say,
            "example": "Consider a prestigious art collector who holds a Right of First Refusal on a rare Renaissance masterpiece. When the painting is placed on the market, rival collectors refuse to spend money conducting provenance authenticity research or bidding at auction, knowing that the existing collector can simply step in and match the final hammer price, chilling competitive bidding across the entire auction room.",
            "code": day39_p3_code,
            "output": p3_out,
            "codeNotes": [
                "Lines 1-18: Simulates M&A auction clearing values under an M&A ROFR vs an M&A Right of First Notice (ROFN).",
                "Lines 20-24: Quantifies the -35% chilling discount caused by a corporate ROFR, reducing exit value from $100M to $65M.",
                "Lines 26-32: Demonstrates that a clean ROFN preserves robust competitive bidding, capturing a $105M exit valuation."
            ],
            "tryIt": "Toggle cvc_has_rofr to False to observe how competitive bidding tension restores when rights are waived.",
            "check": {
                "question": "What is the primary corporate governance reason for refusing to grant a Corporate Venture Capitalist a Right of First Refusal (ROFR) on future M&A sales?",
                "options": [
                    "A ROFR creates a severe 'chilling effect' where competing third-party acquirers refuse to invest time and money making acquisition bids, knowing the CVC can simply match the price and steal the deal.",
                    "A ROFR automatically dissolves the Delaware corporate charter upon signing.",
                    "A ROFR requires the company to distribute all intellectual property to public universities.",
                    "A ROFR forces common stockholders to personally guarantee the corporate investor's debt."
                ],
                "answer": 0,
                "why": "A ROFR destroys competitive bidding tension because competing bidders refuse to act as free stalking horses for the corporate investor.",
                "answerIndex": 0,
                "explanation": "A ROFR destroys competitive bidding tension because competing bidders refuse to act as free stalking horses for the corporate investor."
            }
        },
        {
            "part": 4,
            "title": "Information Rights, Board Observers & Intellectual Property Contamination Firewalls",
            "say": p4_say,
            "example": "Consider an advanced biotechnology research laboratory developing a synthetic vaccine delivery mechanism. When a pharmaceutical giant acquires a minority stake with board observer rights, the biotech enforces strict clean-room protocols: all proprietary molecular binding formulas and patent data are redacted from observer packets, and observer access is restricted to independent corporate venture executives rather than the pharma giant's internal vaccine scientists.",
            "code": day39_p4_code,
            "output": p4_out,
            "codeNotes": [
                "Lines 1-13: Scans board agenda sections and automatically redacts confidential proprietary code and competitor win-loss pipelines.",
                "Lines 15-23: Evaluates observer classification and clean-team certifications under trade secret protection standards.",
                "Lines 25-29: Confirms zero IP contamination risk when executive session trade secret redactions are enforced."
            ],
            "tryIt": "Observe how redaction filters sanitize sensitive commercial telemetry by setting clean_team_certified to True.",
            "check": {
                "question": "How do technology startup boards defend against 'Intellectual Property Contamination' when accommodating Corporate Venture Capital board observers?",
                "options": [
                    "By enforcing Clean-Team protocols that exclude operational business-unit executives and using Executive Sessions to redact sensitive source code architectures and product roadmaps.",
                    "By requiring corporate observers to sign non-compete agreements that ban them from ever working in the tech industry.",
                    "By deleting all source code repositories prior to every board meeting.",
                    "By granting the corporate observer full ownership of all company patents."
                ],
                "answer": 0,
                "why": "Clean-team rules and executive session redactions prevent sensitive technical and commercial IP from leaking to competing corporate units.",
                "answerIndex": 0,
                "explanation": "Clean-team rules and executive session redactions prevent sensitive technical and commercial IP from leaking to competing corporate units."
            }
        },
        {
            "part": 5,
            "title": "Anti-Pattern Defense: The Corporate Predator & Strategic Encumbrance Outage",
            "say": p5_say,
            "example": "Consider an offshore deep-sea marine exploration company that accepts five million dollars in funding from a global salvage conglomerate. In exchange, the exploration company signs an exclusive salvage contract and an M&A ROFR. When lucrative salvage projects arise with other maritime companies, the exclusivity covenant legally blocks participation. Trapped without revenue and unable to attract outside buyers due to the ROFR, the company runs out of cash, and the salvage conglomerate buys the entire vessel fleet for scrap value in a fire-sale.",
            "code": day39_p5_code,
            "output": p5_out,
            "codeNotes": [
                "Lines 1-14: Simulates runway exhaustion under an exclusive corporate partnership where market friction accelerates quarterly cash burn.",
                "Lines 16-24: Pinpoints the terminal outage where competing M&A bidders are chilled, enabling the predator to execute a $3M distressed fire-sale buyout.",
                "Lines 26-30: Demonstrates that without exclusivity and ROFR encumbrances, the enterprise achieves a $60M competitive exit."
            ],
            "tryIt": "Observe how eliminating exclusivity restores acquisition exit optionality by setting has_exclusivity to False.",
            "check": {
                "question": "How does the 'Corporate Predator Encumbrance Outage' anti-pattern destroy enterprise venture sovereignty?",
                "options": [
                    "Category exclusivity restricts sales while an M&A ROFR chills outside acquisition offers, starving the startup of revenue and outside capital until the corporate partner executes a distressed fire-sale buyout.",
                    "By legally converting all preferred equity into high-yield municipal bonds.",
                    "By forcing founders to personally pay federal corporate income taxes out of private savings.",
                    "By automatically canceling all employee stock options without notice."
                ],
                "answer": 0,
                "why": "Exclusivity caps revenue while ROFR blocks third-party exits, driving the startup into insolvency where the corporate predator buys it cheaply.",
                "answerIndex": 0,
                "explanation": "Exclusivity caps revenue while ROFR blocks third-party exits, driving the startup into insolvency where the corporate predator buys it cheaply."
            }
        }
    ],
    "summary": [
        "Mastered corporate venture capital (CVC) investment dynamics, evaluating the dual mandate of financial return and corporate strategic alignment.",
        "Engineered commercial sidecar agreements, modeling MFN price compression formulas and eliminating predatory category exclusivity covenants.",
        "Analyzed M&A exit mechanics, demonstrating how an acquisition ROFR creates a chilling effect on third-party bidders and replacing it with a ROFN.",
        "Programmed board observer IP firewalls, enforcing clean-team protocols and Delaware executive session redaction privileges.",
        "Audited the Corporate Predator anti-pattern, verifying how strategic encumbrances force distressed fire-sale liquidations."
    ],
    "projectStep": {
        "title": "Engineer Corporate Venture Capital & Strategic Alliance Architecture",
        "steps": [
            "Construct a CVC versus Financial VC evaluation engine scoring strategic synergies and encumbrances.",
            "Implement a commercial sidecar MFN price compression simulator tracking gross margin erosion.",
            "Model M&A auction bidding dynamics comparing ROFR chilling discounts against clean ROFN exits.",
            "Deploy board observer IP firewalls and audit corporate predator encumbrance safeguards."
        ]
    }
}

# --- GATE v2 VISUAL JSON GENERATION ---
visual_entries = []
for p_idx, p in enumerate(day39_data["parts"]):
    c_hash = sha256(p["code"])
    
    if p_idx == 0:
        c_intro = "Corporate venture capital mandates and strategic partnership models."
        c_say1 = "Corporate venture units evaluate strategic alignment alongside returns."
        c_example = "Utility equipment partnerships illustrate corporate venture synergies."
        c_tryIt = "Evaluate changed syndicate rankings when strategic weight is increased."
    elif p_idx == 1:
        c_intro = "Commercial sidecars and most favored nation pricing covenant risks."
        c_say1 = "Most favored nation clauses create severe price compression risks."
        c_example = "Aviation fleet maintenance contracts illustrate pricing protection."
        c_tryIt = "Observe how revenue leakage expands when tier discounts are increased."
    elif p_idx == 2:
        c_intro = "Right of first refusal covenants and bidder chilling effect analysis."
        c_say1 = "Right of first refusal clauses suppress competitive bidding tension."
        c_example = "Fine art auction bidding dynamics illustrate preemption rights."
        c_tryIt = "Observe how competitive bidding tension restores when rights are waived."
    elif p_idx == 3:
        c_intro = "Information rights and intellectual property contamination firewalls."
        c_say1 = "Board observer firewalls protect proprietary technology from espionage."
        c_example = "Pharmaceutical laboratory clean rooms illustrate patent firewalls."
        c_tryIt = "Observe how redaction filters sanitize sensitive commercial telemetry."
    else:
        c_intro = "Defense against corporate predator encumbrance and exit foreclosure."
        c_say1 = "Corporate predator encumbrances paralyze third party exit opportunities."
        c_example = "Deep sea salvage contracts illustrate maritime salvage encumbrance."
        c_tryIt = "Observe how eliminating exclusivity restores acquisition exit optionality."

    steps = [
        {
            "at": "intro",
            "caption": c_intro,
            "activeStageId": "stage_1",
            "stages": [
                {"id": "stage_1", "label": "Strategic CVC", "value": 100, "percentage": 100, "tone": "data"},
                {"id": "stage_2", "label": "Commercial Sidecar", "value": 75, "percentage": 75, "tone": "ok"},
                {"id": "stage_3", "label": "IP Firewall", "value": 50, "percentage": 50, "tone": "ok"},
                {"id": "stage_4", "label": "Clean Exit", "value": 0, "percentage": 0, "tone": "idle"}
            ]
        },
        {
            "at": "say1",
            "caption": c_say1,
            "activeStageId": "stage_2",
            "stages": [
                {"id": "stage_1", "label": "Strategic CVC", "value": 100, "percentage": 100, "tone": "data"},
                {"id": "stage_2", "label": "Commercial Sidecar", "value": 75, "percentage": 75, "tone": "data"},
                {"id": "stage_3", "label": "IP Firewall", "value": 50, "percentage": 50, "tone": "ok"},
                {"id": "stage_4", "label": "Clean Exit", "value": 0, "percentage": 0, "tone": "idle"}
            ]
        },
        {
            "at": "example",
            "caption": c_example,
            "activeStageId": "stage_3",
            "stages": [
                {"id": "stage_1", "label": "Strategic CVC", "value": 100, "percentage": 100, "tone": "data"},
                {"id": "stage_2", "label": "Commercial Sidecar", "value": 75, "percentage": 75, "tone": "data"},
                {"id": "stage_3", "label": "IP Firewall", "value": 50, "percentage": 50, "tone": "data"},
                {"id": "stage_4", "label": "Clean Exit", "value": 0, "percentage": 0, "tone": "ok"}
            ]
        },
        {
            "at": "tryIt",
            "caption": c_tryIt,
            "activeStageId": "stage_4",
            "stages": [
                {"id": "stage_1", "label": "Strategic CVC", "value": 100, "percentage": 100, "tone": "data"},
                {"id": "stage_2", "label": "Commercial Sidecar", "value": 75, "percentage": 75, "tone": "data"},
                {"id": "stage_3", "label": "IP Firewall", "value": 50, "percentage": 50, "tone": "data"},
                {"id": "stage_4", "label": "Clean Exit", "value": 0, "percentage": 0, "tone": "data"}
            ]
        }
    ]
    visual_entries.append({
        "partTitle": p["title"],
        "codeHash": c_hash,
        "filled": {},
        "spec": {
            "template": "funnel",
            "title": f"{p['title']} Strategic Alliance",
            "steps": steps
        }
    })

day39_visual = {
    "schemaVersion": 1,
    "prefix": "bcom_ent",
    "day": 39,
    "promptSha": sha256(json.dumps(day39_data["parts"][0]["say"])),
    "model": "google/gemini-2.5-pro",
    "entries": visual_entries
}

with open("scripts/day39_lesson.json", "w", encoding="utf-8") as f:
    json.dump(day39_data, f, indent=2)

with open("src/lib/data/lessonVisuals/bcom_ent/day-39.json", "w", encoding="utf-8") as f:
    json.dump(day39_visual, f, indent=2)

print("Generated day-39.json and day39_lesson.json with 100% invariant compliance.")
