"""
Enrich Day 58 content in generate_ecom_day58.py to ensure every part >= 610 words
"""
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/branch_b/generate_ecom_day58.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Paragraph additions for each part:
p1_extra = '''    "At the store hardware layer, modern omnichannel architectures embrace Headless POS technology running on mobile Android or iPad tablets rather than bulky legacy registers. These mobile POS devices communicate with store edge controllers over local mTLS-secured Wi-Fi, adhering to unified OPOS and JPOS peripheral standards to seamlessly control wireless receipt printers, Bluetooth barcode scanners, and EMV chip-and-PIN credit card terminals. Furthermore, store associate authentication is governed by enterprise Single Sign-On (SSO) with strict Role-Based Access Control (RBAC), allowing floor clerks to execute standard ring-outs while restricting high-risk managerial overrides (such as manual price markdowns or tax exemptions) to verified biometric or supervisor badge scans.",'''

p2_extra = '''    "To fully operationalize physical stores as distributed fulfillment centers, enterprise architectures deploy dedicated Ship-from-Store (SFS) associate packing modules. When the distributed order routing engine assigns a parcel to a retail store, the system automatically aggregates orders into multi-order pick waves, calculates volumetric packing dimensions to select optimal corrugated box sizes, and generates Zebra Programming Language (ZPL) shipping labels for local couriers (FedEx Ground, UPS, or regional gig-economy delivery networks). By routing orders to retail stores located within five miles of customers, the enterprise achieves same-day delivery while cutting carrier shipping transit zones from Zone 8 down to Zone 2, drastically reducing carbon emissions and freight expenditures.",'''

p3_extra = '''    "To maximize curbside pickup convenience, modern BOPIS architectures integrate automated mobile geofencing and vehicle arrival detection. Through native mobile application telemetry (utilizing Apple CoreLocation and Google Play Location Services), the platform detects when a customer's vehicle enters the store parking perimeter. The store associate's handheld scanner emits an auditory chime displaying the customer's name, vehicle make, color, and designated parking stall number (e.g., Curbside Stall 3). This enables the associate to retrieve the staged package from the bin and deliver it directly to the customer's trunk in under two minutes from arrival, achieving maximum Net Promoter Scores (NPS) and total customer satisfaction.",'''

p4_extra = '''    "In-store return processing also serves as the enterprise's primary defense against sophisticated return fraud and wardrobing (the practice of purchasing luxury garments, wearing them once with hidden tags, and returning them for full refunds). The BORIS engine cross-references serial numbers on high-value electronics and scans invisible UV cryptographic tags embedded in luxury apparel tags. If an item fails authenticity checks or exhibits signs of unauthorized wear, the associate's POS terminal discreetly prompts for a manager override, preventing fraudulent cash depletion while offering store credit or routing the item to specialized fraud forensic review.",'''

p5_extra = '''    "Beyond daily operational telemetry, the Command Tower serves as an enterprise strategic planning engine for Chief Operating Officers and retail network planners. By analyzing five-year fulfillment telemetry across 480 retail locations, the system evaluates the real-world micro-fulfillment capacity of each store building, identifying prime suburban locations that should convert under-utilized sales floor space into high-density automated micro-fulfillment centers (MFCs). Furthermore, the Command Tower ties store manager bonus incentives directly to BOPIS pick accuracy and BORIS restock velocity, creating an aligned corporate culture where physical store teams celebrate digital commerce fulfillment as a core driver of their store's financial success and community prominence.",'''

# Inject before the closing bracket of each pX_say
for i, extra in enumerate([p1_extra, p2_extra, p3_extra, p4_extra, p5_extra], start=1):
    pattern = rf'(p{i}_say = \[.*?)(\n\])'
    match = re.search(pattern, text, re.DOTALL)
    if match:
        replacement = match.group(1) + ",\n" + extra + match.group(2)
        text = text[:match.start()] + replacement + text[match.end():]
        print(f"Injected extra paragraph into p{i}_say")
    else:
        print(f"Failed to find match for p{i}_say")

with open('scripts/branch_b/generate_ecom_day58.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated generate_ecom_day58.py successfully!")
