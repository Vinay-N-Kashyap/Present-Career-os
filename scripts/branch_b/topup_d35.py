file_path = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\scripts\branch_b\generate_ecom_day35.py'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

p2_topup = '''    "To guarantee maximum resilience against localized cloud availability zone failures, the Apollo Router tier is deployed as a multi-region active-active cluster fronted by Anycast DNS and Cloudflare load balancing. If an entire cloud region experiences an outage, incoming GraphQL traffic fails over to alternate geographical clusters in under three seconds with zero dropped connections. Furthermore, the router leverages Redis-backed response caching for shared non-personalized catalog queries, serving over sixty percent of category browsing queries directly from in-memory cache with sub-five-millisecond response times.",
'''

p3_topup = '''    "From an enterprise auditability and compliance standpoint, every transition within the Distributed Order Saga state machine is cryptographically hashed and recorded to an immutable financial audit ledger. Regulators and enterprise auditors can reconstruct the exact microsecond chronological timeline of any customer order: verifying the original idempotency token, the payment authorization token, the warehouse reservation lease, and any compensating refund transactions. This level of forensic precision satisfies statutory requirements under SOC 1, SOC 2, and PCI DSS Level 1 frameworks while eliminating manual customer service dispute investigations.",
'''

p4_topup = '''    "Moreover, the Global Inventory Command Tower incorporates predictive AI forecasting models to optimize safety stock allocation across multi-echelon warehouse nodes. By analyzing historical regional order velocities, seasonal weather disruptions, and carrier transit performance, the inventory intelligence engine dynamically adjusts buffer thresholds, automatically transferring stock between regional fulfillment centers before projected stockouts occur. This proactive rebalancing reduces cross-zone parcel shipments by thirty-eight percent, dramatically cutting corporate carbon footprints while optimizing fulfillment speed.",
'''

p5_topup = '''    "As you conclude your boardroom defense, you emphasize that the Sovereign Enterprise Composable E-Commerce Platform Architecture establishes an enduring competitive advantage for the global enterprise. By replacing monolithic fragility with composable agility, the organization can enter new international markets, integrate emerging sales channels like conversational AI agents and spatial computing commerce, and execute high-concurrency seasonal promotions with absolute confidence. The Chief E-Commerce Architect & Principal Commerce Systems Engineer (CEA-PCSE) accreditation stands as testament to this transformational technical achievement.",
'''

idx2 = text.find('p2_example =')
text = text[:idx2-3] + ',\n' + p2_topup + text[idx2-3:]

idx3 = text.find('p3_example =')
text = text[:idx3-3] + ',\n' + p3_topup + text[idx3-3:]

idx4 = text.find('p4_example =')
text = text[:idx4-3] + ',\n' + p4_topup + text[idx4-3:]

idx5 = text.find('p5_example =')
text = text[:idx5-3] + ',\n' + p5_topup + text[idx5-3:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Added topup paragraphs to Parts 2, 3, 4, 5 in Day 35.")
