import os
import re

file_path = r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\scripts\branch_b\generate_ecom_day32.py'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Let's inspect where p1_say ends, p2_say ends, etc.
# We will insert the enrichments before the closing bracket of each pX_say

p1_add = '''    "To govern supergraph integrity across hundreds of daily microservice deployments, enterprise organizations integrate Apollo Rover CLI checks directly into automated CI/CD pipelines. Whenever a developer opens a pull request in an individual subgraph repository, the CI runner extracts the proposed schema definition and submits it to Apollo Studio or a local schema registry for composition validation. The composition engine parses all active subgraphs simultaneously, checking for breaking changes such as field removals, incompatible scalar redefinitions, or conflicting type extensions. If a change introduces a composition failure or breaks active client queries detected via live telemetry, the CI pipeline halts immediately, preventing malformed schemas from ever reaching production environments.",
    "At production runtime, the Apollo Router functions as an ultra-high-performance proxy compiled in Rust, designed to eliminate the garbage-collection latency spikes inherent in legacy Node.js GraphQL gateways. The Router leverages asynchronous non-blocking I/O and zero-copy string parsing to process tens of thousands of requests per second with sub-millisecond overhead. It maintains persistent connection pools to underlying backend subgraphs, automatically distributing incoming query fragments across parallel worker threads. By offloading query planning, client authentication, and schema stitching to a dedicated native gateway, the underlying commerce microservices remain focused solely on domain-specific transactional logic and database queries.",
'''

p2_add = '''    "The @key directive defines one or more fields that uniquely identify an entity across the entire supergraph. For instance, in an e-commerce platform, the Product entity is uniquely identified by its id or sku. By marking @key(fields: \\"id\\") on the Product type definition, the Products subgraph declares that it can resolve a Product entity given its unique identifier. Other subgraphs, such as the Reviews or Inventory microservices, can then contribute additional fields to the Product type without needing to duplicate core catalog fields like title or description. When an incoming client request queries both a product name and its real-time warehouse availability, the Apollo Router queries the Products subgraph first, extracts the id, and dispatches an entity resolution query to the Inventory subgraph using the retrieved key.",
    "In Apollo Federation v2, the @shareable directive revolutionized field ownership by permitting multiple subgraphs to resolve the exact same field when desirable for operational locality. In legacy federation models, every field was strictly owned by a single subgraph; if another subgraph required access to that field, it had to declare it @external and configure complex @requires dependency pathways. With @shareable, shared metadata fields can be resolved locally by any subgraph that maintains a local cache or database column for that data. This dramatically reduces inter-service network hops and eliminates cascading dependency bottlenecks during high-concurrency peak traffic periods.",
    "Furthermore, advanced federation directives like @requires and @provides empower domain architects to optimize complex nested queries. The @requires directive specifies that a subgraph requires specific external fields from another subgraph before it can compute a local field. Conversely, @provides allows a parent resolver to pre-populate entity fields, signaling to the Router that it can satisfy downstream dependencies without dispatching an extra network request. Mastering these directives ensures that enterprise graphs maintain strict data boundaries while minimizing execution latency across distributed microservice boundaries.",
'''

p3_add = '''    "When the Apollo Router receives a client query, it does not execute a naive waterfall of HTTP requests. Instead, the query compiler constructs a directed acyclic graph (DAG) representing the Query Execution Plan. The Router inspects the requested abstract syntax tree (AST) and partitions fields according to subgraph ownership. Fields owned by the root query form the initial entry stage. Fields belonging to extended entities form secondary fetch stages. If multiple subgraphs can be queried simultaneously, the Router dispatches asynchronous parallel HTTP/2 requests, bounding total query execution time to the slowest single downstream response rather than the sum of all downstream latencies.",
    "To prevent downstream microservices from being overwhelmed by unoptimized or deeply nested queries, enterprise routers enforce strict static query analysis rules. The Router calculates the query depth and structural complexity before dispatching any network calls. If a malicious or poorly designed client query attempts to fetch recursive relationships, the Router terminates the request immediately with an HTTP 400 complexity error. Furthermore, the Router implements query fingerprinting and automated response caching: identical query fragments are served directly from an in-memory cache or Redis cluster, shielding backend subgraphs from redundant computation.",
    "Cross-subgraph network latency is further minimized through automated connection pooling, HTTP/2 multiplexing, and mutual TLS session reuse. When deploying subgraphs across multi-cloud or hybrid enterprise environments, network jitter between distributed data centers can degrade overall storefront responsiveness. Enterprise architectures mitigate this by collocating subgraph replicas within the same local Kubernetes cluster and availability zone as the Apollo Router. By maintaining local service-mesh routing via Envoy sidecars, internal network hops are resolved over ultra-low-latency connections, ensuring that complex federated queries consistently complete within five to ten milliseconds.",
'''

p4_add = '''    "The classic N+1 query problem is the single greatest performance vulnerability in distributed GraphQL architectures. Consider a category listing page requesting twenty products, where each product item displays its title, price, and inventory availability. In an unoptimized naive resolver implementation, the GraphQL server executes one query to fetch the twenty products, followed by twenty individual queries to the Pricing microservice and twenty individual queries to the Inventory microservice, resulting in forty-one separate network round-trips for a single user request! Under peak flash-sale concurrency, this multiplicative query fan-out saturates database connection pools, spikes CPU utilization, and triggers catastrophic cascading timeouts across downstream microservices.",
    "To eliminate the N+1 problem, modern federated subgraphs mandate the use of the DataLoader pattern across all entity resolvers. Originally developed by Facebook engineering, DataLoader is an open-source utility that provides two indispensable optimizations: request batching and per-request memoization caching. When multiple resolvers throughout the GraphQL execution lifecycle request entities by identifier, DataLoader coalesces these individual requests within a single tick of the event loop. Instead of firing individual queries, DataLoader dispatches a single batched query, dramatically collapsing twenty network round-trips into a single efficient database query.",
    "In addition to batching, DataLoader implements per-request memoization caching to guarantee idempotency and eliminate redundant lookups within a single query execution context. If multiple components on a storefront page request the same product data, DataLoader resolves the entity once and serves all subsequent requests from in-memory cache. Crucially, this cache is strictly scoped to the lifecycle of an individual HTTP request, ensuring that updated transactional state in concurrent user sessions is never contaminated by stale cross-request cached data.",
'''

p5_add = '''    "In our comprehensive Python simulation for Part 5, we construct a fully functional Enterprise Federated Commerce Subgraph Router and Query Planner. The simulation models the entire lifecycle of an enterprise supergraph request: from incoming client GraphQL query ingestion, through abstract syntax tree decomposition and execution plan DAG generation, to parallel subgraph dispatch, DataLoader batching, and unified JSON payload stitching.",
    "The simulated architecture comprises three autonomous microservice subgraphs: the Products Subgraph (managing catalog metadata, SKUs, and category taxonomies), the Pricing Subgraph (computing dynamic wholesale and retail pricing tiers), and the Inventory Subgraph (evaluating multi-warehouse real-time stock levels). When a complex query requesting product titles, localized prices, and stock availability arrives, the Router analyzes entity dependencies, dispatches optimized batched calls to each domain service, and verifies that zero redundant network round-trips occur.",
    "By executing this deterministic benchmark, enterprise commerce architects can empirically verify query plan execution mechanics, evaluate cross-subgraph latency overhead, and validate that federated entity composition preserves strict domain autonomy without sacrificing client performance or scalability. Review the clean, deterministic Python implementation below to master enterprise federated graph architecture.",
'''

# Find p1_say closing bracket
idx1 = text.find('p1_example =')
text = text[:idx1-3] + ',\n' + p1_add + text[idx1-3:]

idx2 = text.find('p2_example =')
text = text[:idx2-3] + ',\n' + p2_add + text[idx2-3:]

idx3 = text.find('p3_example =')
text = text[:idx3-3] + ',\n' + p3_add + text[idx3-3:]

idx4 = text.find('p4_example =')
text = text[:idx4-3] + ',\n' + p4_add + text[idx4-3:]

idx5 = text.find('p5_example =')
text = text[:idx5-3] + ',\n' + p5_add + text[idx5-3:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Enriched generate_ecom_day32.py successfully!")
