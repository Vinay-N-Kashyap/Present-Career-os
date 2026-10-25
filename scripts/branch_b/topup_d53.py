import os
import re

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
builder_path = os.path.join(commerce_dir, "scripts", "branch_b", "build_day53_dmkt.py")

p2_extra = '''    "To master placement economics fully, media architects must understand the interaction between Placement Multipliers and Dynamic Bidding Strategies. "
    "Marketplaces provide three core dynamic bidding modes: Dynamic Bids - Down Only (where the algorithm reduces bids in real time when conversion probability "
    "is low), Dynamic Bids - Up and Down (where the algorithm can inflate bids by up to 100% for Top of Search placements and up to 50% for other placements "
    "in addition to configured placement multipliers), and Fixed Bids. When an advertiser selects 'Up and Down' alongside a +200% Top of Search multiplier, "
    "a $1.00 base bid can surge to an effective bid of $6.00 ($1.00 * 3.0 placement factor * 2.0 dynamic factor). Enterprise systems mandate strict "
    "safeguards to prevent unexpected bid compounding from triggering budget burn during volatile auction conditions.",
'''

p3_extra = '''    "In addition to intra-day circadian cycles, sophisticated dayparting models incorporate Day-of-Week Seasonality and Calendar Payday Cycles. "
    "Consumer purchasing velocity exhibits pronounced weekly rhythms: Sunday evenings typically generate the highest conversion rates and largest basket sizes "
    "of the week as households prepare for the upcoming work week, whereas Friday afternoons frequently suffer from low intent and distracted browsing. "
    "Furthermore, consumer packaged goods and discretionary retail categories experience predictable conversion surges around bi-weekly corporate payroll "
    "dates (the 1st and 15th of each month). Enterprise circadian controllers synchronize hourly modifiers with day-of-week multipliers, ensuring that "
    "advertising capital expands during Sunday evening pay-week shopping surges while contracting during Friday afternoon conversion lulls.",
'''

p4_extra = '''    "Beyond standard textual search queries, automated harvesting engines mine Competitor ASIN and Product Targeting Reports. When an auto-targeting "
    "campaign matches a brand's sponsored ad on a competitor's product detail page, the transaction report logs the target product's unique marketplace "
    "identifier (such as Amazon ASIN or Walmart Item ID). The harvesting engine evaluates these product-level interactions against actuarial thresholds. "
    "If advertising against a specific competitor SKU generates three or more orders at an ACOS below the target boundary, the engine automatically promotes "
    "that competitor ASIN into a Dedicated Product Attribute Targeting (PAT) campaign while adding it as a negative product target in the discovery campaign. "
    "This programmatic conquesting locks in high-value shelf conquesting gains across complementary and competitor catalog listings.",
'''

p5_extra = '''    "To solve the exploration-versus-exploitation dilemma in dynamic bid discovery, the production engine implements Multi-Armed Bandit (MAB) algorithms, "
    "specifically Upper Confidence Bound (UCB1) and Thompson Sampling. When newly harvested keywords enter the performance engine with zero historical "
    "performance data, deterministic Target ACOS formulas cannot accurately price bids due to unknown conversion rates. The bandit subsystem allocates "
    "a controlled exploration budget (typically five to ten percent of total campaign spend) to test varying bid levels, balancing the exploitation of "
    "proven high-converting bids with the exploration of uncertain bid frontiers. As statistical confidence narrows, the algorithm converges on the "
    "globally optimal, profit-maximizing clearing price with minimal capital waste.",
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

print("Successfully applied secondary top-ups to build_day53_dmkt.py!")
