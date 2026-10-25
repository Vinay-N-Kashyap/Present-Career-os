import os

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
builder_path = os.path.join(commerce_dir, "scripts", "branch_b", "build_day55_dmkt.py")

p2_extra = '''    "To prevent capital destruction on suppressed listings, the placement gateway maintains real-time webhooks with marketplace Buy Box APIs. "
    "On platforms like Amazon and Walmart, if a third-party unauthorized reseller wins the Buy Box—or if the retailer temporarily suppresses the Buy Box "
    "due to off-platform price parity violations—sponsored product ad units are either deactivated or serve ads that drive traffic to a competitor's checkout. "
    "The gateway checks Buy Box ownership status every sixty seconds: if ownership drops below one hundred percent, all sponsored product bids for that ASIN "
    "are instantly suspended, preventing the brand from subsidizing unauthorized third-party gray-market sales.",
    "Furthermore, the gateway incorporates Dynamic Bidding Strategy Optimization. In second-price marketplace auctions, algorithms evaluate whether to deploy "
    "'Dynamic Bids - Down Only' (conservative margin protection) or 'Dynamic Bids - Up and Down' (aggressive market share conquesting). When competing for "
    "dominant Top of Search slots during seasonal retail holidays, the gateway combines placement multipliers with upward dynamic adjustments, ensuring the "
    "brand maintains unshakeable category leadership while automated bid ceilings prevent runaway auction inflation.",
'''

p3_extra = '''    "To ensure robust statistical validity across low-volume catalog items, the circadian dayparting controller applies Bayesian Empirical Smoothing. "
    "For niche products where individual hourly traffic is sparse, the algorithm regularizes hourly conversion rates toward the broader category circadian "
    "distribution. This prevents the bidding engine from overreacting to single-click anomalies—such as a single order placed at 3:00 AM artificially inflating "
    "graveyard bids—while ensuring that macro circadian consumer purchasing waves are accurately reflected in bid pricing.",
    "Concurrently, the automated search term harvester manages a multi-tier Campaign Migration Lifecycle. When a search query graduates from an auto "
    "discovery campaign to an exact match performance campaign, the engine establishes an initial Target CPC based on its historical clearing price, "
    "simultaneously inserting negative exact keywords into the source discovery campaign. This strict negative gating architecture guarantees that the brand "
    "never competes against itself in internal ad auctions, preserving margin efficiency across large, complex product portfolios.",
'''

p4_extra = '''    "Within the Amazon Marketing Cloud SQL environment, the attribution bridge evaluates path-to-purchase customer journeys using advanced SQL analytical "
    "operators. Analysts execute multi-touch attribution queries that calculate the optimal advertising frequency cap. By analyzing conversion probability "
    "curves as a function of cumulative ad exposures, the bridge identifies the exact point of diminishing returns—typically four to six exposures per "
    "household per week—automatically feeding frequency cap limits back to demand-side platforms to eliminate wasteful over-exposure.",
    "Furthermore, the closed-loop bridge performs In-Store Geographic Radius Lift Modeling. By joining mobile device ad exposure coordinates with the "
    "retailer's physical store geofences, the bridge evaluates whether high digital ad density within a three-mile radius of a supermarket drives localized "
    "store foot traffic and register sales lift. This proves conclusively to regional retail store managers that digital advertising drives physical store "
    "inventory velocity, aligning brand marketing with retail merchandising operations.",
'''

p5_extra = '''    "The commercial command matrix serves as the primary strategic weapon in Joint Business Planning (JBP) negotiations with major retail merchants. "
    "Armed with audited closed-loop attribution telemetry proving that every dollar of brand retail media advertising unlocks $3.80 in physical store "
    "cash register sales, commercial directors negotiate superior retail terms: securing guaranteed endcap displays, secondary product placements, "
    "reduced distribution co-op fees, and priority shelf positioning in high-volume retail locations.",
    "Finally, the executive suite incorporates Multi-Year Capital Allocation Simulation and Discounted Cash Flow (DCF) Modeling. Corporate leadership can "
    "simulate the long-term enterprise valuation impact of scaling retail media capital investments over a three-to-five-year horizon. By modeling New-to-Brand "
    "customer lifetime value (LTV), repeat purchase retention curves, and organic search rank compounding, the platform proves that retail media delivers "
    "high-margin, predictable cash flows that maximize overall enterprise shareholder value.",
'''

with open(builder_path, "r", encoding="utf-8") as f:
    text = f.read()

# Insert into p2_say
idx2 = text.find('p2_example =')
bracket2 = text[:idx2].rstrip().rfind(']')
text = text[:bracket2] + p2_extra + text[bracket2:]

# Insert into p3_say
idx3 = text.find('p3_example =')
bracket3 = text[:idx3].rstrip().rfind(']')
text = text[:bracket3] + p3_extra + text[bracket3:]

# Insert into p4_say
idx4 = text.find('p4_example =')
bracket4 = text[:idx4].rstrip().rfind(']')
text = text[:bracket4] + p4_extra + text[bracket4:]

# Insert into p5_say
idx5 = text.find('p5_example =')
bracket5 = text[:idx5].rstrip().rfind(']')
text = text[:bracket5] + p5_extra + text[bracket5:]

with open(builder_path, "w", encoding="utf-8") as f:
    f.write(text)

print("Successfully enriched build_day55_dmkt.py!")
