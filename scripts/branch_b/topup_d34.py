file_path = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\scripts\branch_b\generate_ecom_day34.py'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

p4_topup = '''    "Moreover, modern cycle counting platforms employ machine learning algorithms to predict inventory inaccuracy before physical picking failures occur. By analyzing historical pick discrepancy logs, return frequency, product physical dimensions, and seasonal employee turnover across specific warehouse zones, the anomaly detection engine generates dynamic cycle count prioritization schedules. Bins exhibiting high velocity combined with frequent manual picker overrides are scheduled for automated re-counting within forty-eight hours, catching stock variances proactively and ensuring that digital availability signals presented on consumer storefronts maintain ninety-nine point nine percent accuracy.",
'''

p5_topup = '''    "To ensure high availability and disaster resilience across global multi-tenant fulfillment networks, the Command Tower maintains multi-region active-active database replication. If an entire cloud region or physical distribution hub suffers a catastrophic power outage or fiber cut, the global traffic director and routing engine automatically redirects pending fulfillment requests to secondary regional nodes within seconds. Automated cross-region inventory replication guarantees that localized node failures never cause split-brain inventory states or lost customer allocations.",
    "Furthermore, the Command Tower enforces comprehensive role-based access control (RBAC), multi-factor authentication, and end-to-end cryptographic audit logging across all inventory adjustment endpoints. Every manual stock override, quota adjustment, and physical write-down is cryptographically signed and archived to immutable write-once-read-many (WORM) storage, providing full traceability for corporate governance, enterprise risk management, and statutory financial audits.",
'''

idx4 = text.find('p4_example =')
text = text[:idx4-3] + ',\n' + p4_topup + text[idx4-3:]

idx5 = text.find('p5_example =')
text = text[:idx5-3] + ',\n' + p5_topup + text[idx5-3:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Added topup paragraphs to Part 4 and Part 5.")
