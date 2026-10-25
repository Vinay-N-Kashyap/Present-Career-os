import os

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"
builder_path = os.path.join(commerce_dir, "scripts", "branch_b", "build_day54_dmkt.py")

p2_extra2 = '''    "When assembling candidate donor pools for retail geo-testing, data scientists enforce strict Market Matching Criteria. Candidate markets are screened "
    "for historical sales volume correlation (minimum Pearson r >= 0.85 across the pre-treatment baseline), retail store density parity, and geographical "
    "isolation to prevent cross-market broadcast signal bleeding. If two adjacent metropolitan areas share local television or radio broadcast coverage, "
    "they cannot be assigned to opposite experimental arms without contaminating the unexposed donor baseline. Enforcing pristine geographic separation "
    "ensures that observed sales deviations reflect pure causal ad impact rather than media spillover.",
'''

p3_extra2 = '''    "To process ghost bid telemetry at wire speed without introducing latency into live programmatic auctions, ad tech platforms execute ghost logging "
    "asynchronously. The auction evaluation engine computes the winning price, passes the live impression to the external exchange winner, and writes the "
    "ghost impression event to an in-memory queue. This decoupled architecture guarantees sub-millisecond auction throughput while logging millions of "
    "high-fidelity counterfactual records daily.",
'''

p4_extra2 = '''    "Crucially, sophisticated retail brands extend Brand Halo modeling across Multi-Period Customer Lifetime Horizons. When an advertising campaign "
    "acquires a new customer through a promoted hero product, the customer's downstream value does not terminate with their initial shopping basket. "
    "By tracking cohort repeat purchase behavior over six, twelve, and twenty-four months, econometric models calculate the Long-Term Brand Halo Yield. "
    "Empirical retail analytics demonstrate that customers acquired through hero product ads generate two to three times their initial basket value in "
    "repeat purchases of complementary catalog items, fundamentally transforming the long-term economics of customer acquisition.",
'''

p5_extra2 = '''    "To ensure broad organizational alignment across cross-functional commercial leadership, the platform provides an Automated Executive Reporting "
    "and BI Integration Layer. The platform compiles complex econometric findings into clear, C-suite synthesis briefs, automatically populating enterprise "
    "business intelligence dashboards (such as Looker, Tableau, and PowerBI) with interactive incrementality curves, cannibalization heatmaps, and halo "
    "flow diagrams. Chief Marketing Officers, Chief Financial Officers, and retail sales directors review unified, audited performance figures, aligning "
    "on data-driven advertising strategies that eliminate internal friction and drive cohesive commercial growth.",
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

print("Successfully applied topup2 to build_day54_dmkt.py!")
