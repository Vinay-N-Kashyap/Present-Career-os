import time

print("=== PART 1 ===")
class InventoryConcurrencyModel:
    def __init__(self, initial_stock: int):
        self.stock = initial_stock

    def simulate_flash_sale_race(self, concurrent_requests: int, quantity_each: int) -> dict:
        # Without distributed locking: naive race condition
        oversold_units = max(0, (concurrent_requests * quantity_each) - self.stock)
        successful_orders = min(concurrent_requests, self.stock // quantity_each)
        
        return {
            "initial_physical_stock": self.stock,
            "concurrent_buyers": concurrent_requests,
            "units_requested_per_buyer": quantity_each,
            "naive_oversold_danger": oversold_units,
            "actual_safe_capacity": successful_orders,
            "concurrency_protection_required": "DISTRIBUTED_MUTEX_LOCK"
        }

model = InventoryConcurrencyModel(initial_stock=100)
res = model.simulate_flash_sale_race(concurrent_requests=150, quantity_each=1)
for k, v in res.items():
    print(f"  {k}: {v}")

print("\n=== PART 2 ===")
class CheckoutSagaOrchestrator:
    def __init__(self):
        self.execution_log = []

    def execute_checkout_saga(self, order_id: str, payment_success: bool) -> dict:
        # Step 1: Reserve Inventory
        self.execution_log.append("STEP_1: INVENTORY_RESERVED (Hold 15 mins)")
        
        # Step 2: Authorize Payment
        if payment_success:
            self.execution_log.append("STEP_2: PAYMENT_AUTHORIZED")
            self.execution_log.append("STEP_3: ORDER_CONFIRMED")
            saga_status = "SAGA_COMPLETED_SUCCESS"
        else:
            self.execution_log.append("STEP_2: PAYMENT_FAILED (Card Declined)")
            # Backward Compensating Transaction
            self.execution_log.append("COMPENSATING_STEP_1: RELEASE_INVENTORY_RESERVATION")
            saga_status = "SAGA_ROLLED_BACK_CLEANLY"
            
        return {
            "order_id": order_id,
            "final_saga_status": saga_status,
            "audit_trail": self.execution_log
        }

saga = CheckoutSagaOrchestrator()
fail_saga = saga.execute_checkout_saga("ORD-90210", payment_success=False)
for k, v in fail_saga.items():
    if k == "audit_trail":
        print(f"  {k}:")
        for step in v:
            print(f"    - {step}")
    else:
        print(f"  {k}: {v}")

print("\n=== PART 3 ===")
class MockRedlock:
    def __init__(self, nodes_count: int = 5):
        self.nodes = nodes_count
        self.quorum = (nodes_count // 2) + 1 # 3 out of 5 nodes

    def acquire_lock(self, resource_key: str, ttl_ms: int) -> dict:
        # Simulate lock acquisition across independent Redis nodes
        acquired_nodes = 4 # 4 out of 5 nodes respond within drift window
        elapsed_drift_ms = 4.5
        validity_time_ms = ttl_ms - elapsed_drift_ms
        
        is_locked = acquired_nodes >= self.quorum and validity_time_ms > 0
        return {
            "resource": resource_key,
            "total_nodes": self.nodes,
            "nodes_acquired": acquired_nodes,
            "quorum_required": self.quorum,
            "clock_drift_elapsed_ms": elapsed_drift_ms,
            "remaining_validity_ms": validity_time_ms,
            "lock_acquired": is_locked
        }

redlock = MockRedlock(nodes_count=5)
lock_res = redlock.acquire_lock("lock:inventory:SKU_LIMITED_SNEAKER", ttl_ms=100)
for k, v in lock_res.items():
    print(f"  {k}: {v}")

print("\n=== PART 4 ===")
class IdempotencyGateway:
    def __init__(self):
        self.processed_keys = {}

    def process_charge(self, idempotency_key: str, amount_usd: float) -> dict:
        if idempotency_key in self.processed_keys:
            cached = self.processed_keys[idempotency_key]
            return {
                "idempotency_key": idempotency_key,
                "status": "CACHED_IDEMPOTENT_RESPONSE",
                "charge_id": cached["charge_id"],
                "duplicate_charge_prevented": True
            }
        
        charge_id = f"ch_mock_{abs(hash(idempotency_key)) % 1000000}"
        self.processed_keys[idempotency_key] = {"charge_id": charge_id, "amount": amount_usd}
        return {
            "idempotency_key": idempotency_key,
            "status": "NEW_CHARGE_PROCESSED",
            "charge_id": charge_id,
            "duplicate_charge_prevented": False
        }

idemp = IdempotencyGateway()
req1 = idemp.process_charge("idem_key_abc_123", 149.99)
req2 = idemp.process_charge("idem_key_abc_123", 149.99) # Network retry
print(f"Request 1: {req1['status']} (Charge: {req1['charge_id']})")
print(f"Request 2: {req2['status']} (Prevented Duplicate: {req2['duplicate_charge_prevented']})")

print("\n=== PART 5 ===")
class EnterpriseDistributedCheckoutSuite:
    def __init__(self, store_name: str):
        self.store = store_name
        self.redlock = MockRedlock(5)
        self.idemp = IdempotencyGateway()
        self.saga = CheckoutSagaOrchestrator()

    def process_high_concurrency_checkout(self, idempotency_key: str, order_id: str, sku: str) -> dict:
        # 1. Idempotency Check
        idemp_check = self.idemp.process_charge(idempotency_key, 250.0)
        if idemp_check["duplicate_charge_prevented"]:
            return {"status": "DUPLICATE_IGNORED", "order_id": order_id}
            
        # 2. Acquire Distributed Lock
        lock = self.redlock.acquire_lock(f"lock:inventory:{sku}", ttl_ms=200)
        if not lock["lock_acquired"]:
            return {"status": "LOCK_CONTENTION_RETRY", "order_id": order_id}
            
        # 3. Execute Saga (Simulate Payment Success)
        saga_res = self.saga.execute_checkout_saga(order_id, payment_success=True)
        
        return {
            "enterprise": self.store,
            "order_id": order_id,
            "idempotency_enforced": True,
            "redlock_nodes_quorum": f"{lock['nodes_acquired']}/{lock['total_nodes']}",
            "saga_outcome": saga_res["final_saga_status"],
            "transaction_integrity": "ACID_COMPENSATED_DISTRIBUTED_SAFETY"
        }

checkout_suite = EnterpriseDistributedCheckoutSuite("OmniCommerce Enterprise Global")
order_res = checkout_suite.process_high_concurrency_checkout("idem_tx_9988", "ORD-5544", "SKU-EDITION-01")
print("--- Enterprise Distributed Checkout Telemetry ---")
for k, v in order_res.items():
    print(f"  {k}: {v}")
