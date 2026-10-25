with open("scripts/branch_b/generate_ecom_day33.py", "r", encoding="utf-8") as f:
    text = f.read()

# Part 2 replacement
p2_add = '''    "To guarantee reliable event propagation between Saga steps without risking dual-write inconsistencies, modern checkout architectures enforce the "
    "Transactional Outbox Pattern. When a local transaction executes (such as the Inventory service committing an inventory reservation), it writes the "
    "corresponding domain event to an outbox table within the exact same local database transaction. A Change Data Capture (CDC) engine (such as Debezium "
    "tailing the PostgreSQL write-ahead log) streams these outbox records into Apache Kafka with guaranteed at-least-once delivery, triggering the next Saga "
    "step asynchronously while ensuring that database updates and event publications never diverge.",
    "Additionally, enterprise Saga Orchestrators must be engineered to handle catastrophic Edge Failures: what happens if a Backward Compensating Transaction "
    "itself fails? For example, if the Payment step fails and the Orchestrator attempts to release the reserved inventory, but the Inventory service is "
    "temporarily unreachable due to a network partition. In this scenario, the Orchestrator retries the compensating action using exponential backoff with "
    "jitter. If retries are exhausted, the transaction is routed to a persistent Dead Letter Queue (DLQ) and an automated alert is dispatched to operations "
    "engineers, ensuring that no inventory reservation or customer charge ever remains unresolved."
]'''

old_p2_end = '''    "and clean backward compensating rollbacks."
]'''

new_p2_end = '''    "and clean backward compensating rollbacks.",
''' + p2_add

if old_p2_end in text:
    text = text.replace(old_p2_end, new_p2_end, 1)
    print("Enriched Part 2 successfully!")
else:
    print("Could not find old_p2_end!")

# Part 3 replacement
p3_add = '''    "The theoretical validity of the Redlock algorithm has been the subject of profound academic debate in distributed systems, most notably between "
    "Martin Kleppmann (author of Designing Data-Intensive Applications) and Redis creator Salvatore Sanfilippo. Kleppmann demonstrated that in asynchronous "
    "distributed systems with unconstrained process pauses (e.g., long garbage collection pauses or virtual machine live migrations) and unpredictable "
    "NTP clock drift, a lock client might believe it still holds a valid lease long after the remote Redis nodes have expired the key due to local clock skew. "
    "If the delayed worker then attempts to write to a shared database, data corruption can occur.",
    "To achieve absolute linearizability and mathematical safety in financial and inventory accounting, enterprise architectures mandate the use of Fencing "
    "Tokens alongside Redlock leases. When a worker successfully acquires a Redlock quorum, the cluster issues a monotonically increasing sequence number. "
    "When the worker submits its inventory reservation update to the database, the database verifies that the incoming fencing token is strictly greater "
    "than the last processed token. If a zombie worker with an expired lease wakes up and attempts a delayed write, the database rejects the update, "
    "providing absolute mathematical protection against split-brain concurrency."
]'''

old_p3_end = '''    "validity time."
]'''

new_p3_end = '''    "validity time.",
''' + p3_add

if old_p3_end in text:
    text = text.replace(old_p3_end, new_p3_end, 1)
    print("Enriched Part 3 successfully!")
else:
    print("Could not find old_p3_end!")

# Part 4 replacement
p4_add = '''    "In production enterprise payment gateways (such as Stripe, Adyen, and PayPal), Idempotency Key architecture includes Payload Hashing to detect "
    "and reject parameter tampering. When a client submits a request with an Idempotency-Key header, the gateway not only indexes the key in Redis, but "
    "also computes a cryptographic SHA-256 hash of the entire HTTP request body (the items, pricing, currency, and customer ID). If a malicious client or "
    "compromised script submits a second request sharing the exact same idempotency key but with modified payload attributes (e.g., attempting to change "
    "the item price from $250.00 to $1.00), the gateway detects the hash mismatch and immediately aborts the transaction with an HTTP 400 Bad Request error.",
    "Furthermore, production idempotency stores implement strict State Locking during in-flight transaction execution. When the initial request arrives, "
    "the gateway writes the key with an atomic SETNX lock and a status of IN_PROGRESS. If a rapid duplicate request arrives while the original checkout "
    "Saga is still executing (e.g., an impatient shopper double-clicking the Pay Now button within 200 milliseconds), the gateway detects the IN_PROGRESS "
    "state and returns an HTTP 409 Conflict with a Retry-After: 2 header, ensuring that parallel threads never execute duplicate concurrent charges."
]'''

old_p4_end = '''    "charge payloads and mathematically preventing duplicate billing."
]'''

new_p4_end = '''    "charge payloads and mathematically preventing duplicate billing.",
''' + p4_add

if old_p4_end in text:
    text = text.replace(old_p4_end, new_p4_end, 1)
    print("Enriched Part 4 successfully!")
else:
    print("Could not find old_p4_end!")

# Part 5 replacement
p5_add = '''    "From an enterprise audit and financial compliance perspective, the Enterprise Distributed Checkout Suite maintains an immutable, cryptographically "
    "verifiable transaction ledger. Every state transition within the Saga state machine—from initial idempotency key registration and Redlock quorum acquisition, "
    "to third-party payment gateway authorization tokens and local inventory decrements—is signed with SHA-256 message authentication codes and archived into "
    "append-only data stores. This provides corporate finance directors, internal compliance auditors, and external regulatory bodies with absolute "
    "mathematical proof that every dollar captured matches verified physical inventory allocations in strict adherence to Sarbanes-Oxley (SOX) accounting controls.",
    "Finally, the platform incorporates Automated Disaster Recovery and Circuit Breakers across all payment gateway and inventory connections. If an acquiring "
    "bank or payment gateway experiences elevated error rates exceeding three percent, the checkout suite dynamically shifts in-flight transactions to secondary "
    "failover payment rails, while the Saga orchestrator automatically adjusts timeout budgets, guaranteeing ninety-nine point nine-nine percent checkout availability "
    "during high-stakes global retail shopping holidays."
]'''

old_p5_end = '''    "executing end-to-end idempotency checking, Redlock quorum acquisition, and Saga transaction coordination."
]'''

new_p5_end = '''    "executing end-to-end idempotency checking, Redlock quorum acquisition, and Saga transaction coordination.",
''' + p5_add

if old_p5_end in text:
    text = text.replace(old_p5_end, new_p5_end, 1)
    print("Enriched Part 5 successfully!")
else:
    print("Could not find old_p5_end!")

with open("scripts/branch_b/generate_ecom_day33.py", "w", encoding="utf-8") as f:
    f.write(text)
