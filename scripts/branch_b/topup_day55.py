import os

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
builder_path = os.path.join(commerce_dir, "scripts", "branch_b", "build_day55_dmkt.py")

p2_extra2 = '''    "Additionally, the gateway integrates automated Bid Floor Protections and Volatility Guards. If competitive bid inflation causes the estimated clearing "
    "price on a keyword to exceed seventy-five percent of the product contribution margin, the gateway automatically caps bids to prevent negative cash margin "
    "erosion, ensuring that high market volume never compromises corporate operating cash flow.",
'''

p3_extra2 = '''    "To prevent catalog-wide budget waste across multi-brand enterprise portfolios, the harvester enforces Cross-Division Negative Keyword Syndication. "
    "When a non-converting search term is flagged and negated in one brand division, the engine evaluates whether that term represents category-wide non-commercial "
    "intent. If confirmed, the negative keyword is programmatically broadcast across all complementary brand campaigns, creating an enterprise-wide shield "
    "against irrelevant search traffic.",
'''

p4_extra2 = '''    "To bridge disparate retailer identity silos without compromising consumer privacy, the attribution architecture integrates interoperable "
    "Identity Bridging Networks such as Unified ID 2.0 (UID2) and LiveRamp RampID. When consumers interact across multiple retail networks—such as purchasing "
    "online on Amazon while shopping in-store at Walmart—the bridge maps pseudonymized hashed identifiers into unified cross-retailer consumer graphs. "
    "This enables corporate commercial analysts to evaluate total omnichannel brand penetration across all major retail partners, eliminating double-counting "
    "and providing an audited, single source of commercial truth.",
'''

p5_extra2 = '''    "The Capstone Boardroom Defense concludes with an Unanimous Accreditation Verification. By presenting audited proofs of algorithmic Target ACOS "
    "margin governance, circadian dayparting efficiency, clean room closed-loop POS sales lift, and causal incremental iROAS, the candidate demonstrates "
    "mastery over both high-level commercial strategy and low-level ad tech systems engineering, officially conferring full credentialing as an Enterprise "
    "Chief Commercial Officer (CCO) and Sovereign Retail Media Systems Architect.",
'''

with open(builder_path, "r", encoding="utf-8") as f:
    text = f.read()

# Insert into p2_say
idx2 = text.find('p2_example =')
bracket2 = text[:idx2].rstrip().rfind(']')
text = text[:bracket2] + p2_extra2 + text[bracket2:]

# Insert into p3_say
idx3 = text.find('p3_example =')
bracket3 = text[:idx3].rstrip().rfind(']')
text = text[:bracket3] + p3_extra2 + text[bracket3:]

# Insert into p4_say
idx4 = text.find('p4_example =')
bracket4 = text[:idx4].rstrip().rfind(']')
text = text[:bracket4] + p4_extra2 + text[bracket4:]

# Insert into p5_say
idx5 = text.find('p5_example =')
bracket5 = text[:idx5].rstrip().rfind(']')
text = text[:bracket5] + p5_extra2 + text[bracket5:]

with open(builder_path, "w", encoding="utf-8") as f:
    f.write(text)

print("Successfully applied topup2 to build_day55_dmkt.py!")
