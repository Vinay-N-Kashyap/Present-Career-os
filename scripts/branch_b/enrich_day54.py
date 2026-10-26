import os
import re

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
builder_path = os.path.join(commerce_dir, "scripts", "branch_b", "build_day54_dmkt.py")

p1_extra = '''    "To resolve the defensive dilemma on branded search terms, media architects apply Game-Theoretic Conquest Defense Modeling. When a rival brand "
    "actively bids on your trademarked brand name, forfeiting the sponsored ad slot allows the competitor to siphon away fifteen to twenty percent of "
    "prospective buyers who click the top ad out of convenience or confusion. However, defending the slot does not require matching aggressive competitor "
    "bids dollar-for-dollar. Because the trademark owner enjoys vastly superior historical click-through rates and relevance scores, the marketplace auction "
    "awards the brand an Ad Rank advantage. The brand can defend its top placement with a calibrated, modest bid that preserves shelf dominance without "
    "paying an inflated toll on its own customer base.",
'''

p2_extra = '''    "To prevent overfitting in the Synthetic Control Method when operating with high-dimensional donor pools, econometricians incorporate Penalized "
    "Regularization terms—such as Ridge (L2) and Elastic Net penalties—into the objective function. When thirty to fifty donor markets are available, an "
    "unconstrained optimization might assign erratic, non-zero weights to distant, unrelated cities that happened to correlate spuriously during the "
    "pre-treatment window. Regularization ensures that the algorithm selects a sparse, economically coherent subset of donor markets with similar geographic "
    "and demographic profiles. Furthermore, the model performs Rolling Cross-Validation across historical pseudo-treatment periods to verify that the "
    "synthetic control predicts test market trajectories with minimal Root Mean Squared Scaled Error (RMSSE) under varying baseline conditions.",
'''

p3_extra = '''    "A critical methodological consideration in user-level holdout experiments is Audience Decay and Experiment Duration Management. If a user-level "
    "holdout flight is maintained for too long (e.g., beyond forty-five to sixty days), natural consumer identity churn—such as cleared browser caches, "
    "resets of mobile advertising IDs, or transitions between home and work IP addresses—gradually contaminates the control cohort. A consumer originally "
    "assigned to the holdout group may encounter an ad on a secondary device, inadvertently receiving ad exposure and degrading the purity of the control "
    "baseline. Enterprise measurement architects cap user-level holdout flights at thirty to forty-five days, pairing them with frequent cohort refresh cycles "
    "to maintain pristine experimental boundaries.",
'''

p4_extra = '''    "To systematically uncover hidden cross-SKU product affinities across massive retail catalogs, data engineering teams deploy Association Rule "
    "Mining and Market Basket Analysis algorithms (such as the Apriori and FP-Growth algorithms). The engine analyzes millions of multi-item shopping "
    "baskets, calculating three key association metrics: Support (the frequency of basket co-occurrence), Confidence (the conditional probability that "
    "purchasing SKU-A leads to purchasing SKU-B), and Lift (the ratio of observed co-occurrence to expected independent purchasing). When the engine identifies "
    "an anchor SKU with high positive lift toward a high-margin complementary accessory, it programmatically bundles the products into virtual marketplace "
    "multipacks and escalates sponsored ad bids on the anchor product, confident that downstream halo revenue will multiply campaign profitability.",
'''

p5_extra = '''    "In mission-critical enterprise environments, the Causal Incrementality Engine integrates directly with corporate Enterprise Resource Planning (ERP) "
    "and financial databases (such as SAP, Oracle, and NetSuite). Rather than relying on estimated margin averages, the platform ingests exact, dynamic "
    "Cost of Goods Sold (COGS), inbound freight surcharges, and localized retail distribution center fulfillment fees for every SKU in real time. This ensures "
    "that every incremental revenue calculation translates directly into net GAAP operating income. When supply chain shocks or freight tariffs alter a product's "
    "gross margin, the engine automatically adjusts incremental ROAS thresholds, ensuring advertising capital is deployed only behind products with positive "
    "net contribution margins.",
    "Furthermore, the engine features Automated Executive Alerting and Continuous Retesting Schedules. Because consumer purchasing elasticity and competitor "
    "bidding behaviors evolve continuously, incrementality factors are never treated as static constants. The platform schedules automated quarterly "
    "geo-testing flights and ghost-bid audits, alerting media traders and executive leadership via webhook notifications whenever a channel's incremental "
    "yield drifts outside approved confidence intervals. This automated feedback loop transforms retail media into a continuously self-calibrating financial "
    "asset that systematically maximizes enterprise commercial growth.",
'''

with open(builder_path, "r", encoding="utf-8") as f:
    text = f.read()

# Insert into p1_say
idx1 = text.find('p1_example =')
bracket1 = text[:idx1].rstrip().rfind(']')
text = text[:bracket1] + p1_extra + text[bracket1:]

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

print("Successfully applied top-ups to build_day54_dmkt.py!")
