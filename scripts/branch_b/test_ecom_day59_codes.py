"""
Deterministic Python Code Blocks for Course 07 Day 59:
High-Concurrency Flash Sale Architecture, Distributed Queues, Virtual Waiting Rooms & Inventory Race Condition Prevention
"""
import json
import hashlib
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple

print("=== PART 1: FLASH SALE CONCURRENCY & CONNECTION BOTTLENECK MODEL ===")
@dataclass
class FlashSaleTrafficProfile:
    peak_requests_per_second: int
    db_connection_pool_limit: int
    avg_db_query_latency_ms: float

class ConcurrencySaturationModeler:
    @staticmethod
    def analyze_bottleneck(profile: FlashSaleTrafficProfile) -> Dict[str, object]:
        # Maximum transactions per second database can sustain before starvation:
        # Max TPS = Pool Limit / (Latency in seconds)
        max_sustainable_tps = profile.db_connection_pool_limit / (profile.avg_db_query_latency_ms / 1000.0)
        overload_factor = profile.peak_requests_per_second / max_sustainable_tps
        
        is_saturated = overload_factor > 1.0
        return {
            "peak_rps": profile.peak_requests_per_second,
            "max_db_tps": round(max_sustainable_tps, 1),
            "overload_multiplier": round(overload_factor, 1),
            "architectural_verdict": "CRITICAL_DATABASE_STARVATION" if is_saturated else "STABLE_TRANSACTIONAL_CORE"
        }

profile = FlashSaleTrafficProfile(peak_requests_per_second=85000, db_connection_pool_limit=250, avg_db_query_latency_ms=12.5)
analysis = ConcurrencySaturationModeler.analyze_bottleneck(profile)

print(f"Traffic Influx:  {analysis['peak_rps']} RPS | Max DB Capacity: {analysis['max_db_tps']} TPS")
print(f"Overload Ratio:  {analysis['overload_multiplier']}x origin capacity | Verdict: [{analysis['architectural_verdict']}]")


print("\n=== PART 2: VIRTUAL WAITING ROOM & TOKEN-BUCKET ADMISSION ===")
@dataclass
class QueueShopper:
    shopper_id: str
    arrival_timestamp: float

class VirtualWaitingRoomEngine:
    def __init__(self, admission_rate_per_sec: int, secret_signing_key: str):
        self.admission_rate = admission_rate_per_sec
        self.secret_key = secret_signing_key
        self.queue: List[QueueShopper] = []

    def enqueue_shopper(self, shopper: QueueShopper):
        self.queue.append(shopper)

    def admit_next_batch(self, batch_size: int, now: float) -> List[Dict[str, str]]:
        admitted = []
        for _ in range(min(batch_size, len(self.queue))):
            shopper = self.queue.pop(0)
            token_payload = f"{shopper.shopper_id}:{now}:{self.secret_key}"
            signature = hashlib.sha256(token_payload.encode('utf-8')).hexdigest()[:16]
            
            admitted.append({
                "shopper_id": shopper.shopper_id,
                "admission_pass_token": f"pass_{shopper.shopper_id}_{signature}",
                "admitted_at": str(now)
            })
        return admitted

vwr = VirtualWaitingRoomEngine(admission_rate_per_sec=500, secret_signing_key="enterprise_secret_flash_2026")
for i in range(1, 6):
    vwr.enqueue_shopper(QueueShopper(f"USER-FL-{i:03d}", 1000.0 + i))

passes = vwr.admit_next_batch(2, 1005.0)
print(f"Queue Status: Admitted {len(passes)} shoppers, {len(vwr.queue)} remaining in FIFO queue")
for p in passes:
    print(f"  Issued Pass: {p['shopper_id']} -> Token: [{p['admission_pass_token']}]")


print("\n=== PART 3: ATOMIC INVENTORY RESERVATION & ZERO-OVERSELL ===")
@dataclass
class AtomicInventoryItem:
    sku: str
    available_units: int
    version: int

class AtomicInventoryLockEngine:
    def __init__(self, sku: str, initial_stock: int):
        self.item = AtomicInventoryItem(sku, initial_stock, version=1)

    def attempt_reservation(self, shopper_id: str, quantity: int) -> Tuple[bool, str]:
        # Atomic decrement logic (simulating Redis Lua single-threaded atomic execution)
        if self.item.available_units >= quantity:
            self.item.available_units -= quantity
            self.item.version += 1
            return True, f"RESERVED_LOCK_ACQUIRED_V{self.item.version}"
        else:
            return False, "REJECTED_SOLD_OUT"

lock_engine = AtomicInventoryLockEngine("LIMITED-SNEAKER-100", 3)
shoppers = ["SHO-ALICE", "SHO-BOB", "SHO-CHARLIE", "SHO-DAVID", "SHO-EMILY"]

print(f"Starting Flash Inventory for {lock_engine.item.sku}: {lock_engine.item.available_units} units")
for s in shoppers:
    ok, msg = lock_engine.attempt_reservation(s, 1)
    status_label = "SUCCESS" if ok else "DENIED"
    print(f"  Shopper {s}: {status_label} -> [{msg}] (Remaining: {lock_engine.item.available_units})")


print("\n=== PART 4: ASYNCHRONOUS ORDER QUEUE & IDEMPOTENT WORKERS ===")
@dataclass
class FlashOrderMessage:
    order_id: str
    shopper_id: str
    sku: str
    amount_cents: int
    idempotency_key: str

class IdempotentOrderConsumerWorker:
    def __init__(self):
        self.processed_idempotency_keys: set = set()
        self.persisted_orders: List[str] = []

    def consume_order_event(self, msg: FlashOrderMessage) -> Tuple[bool, str]:
        # Check idempotency to eliminate duplicate payment or order insertions
        if msg.idempotency_key in self.processed_idempotency_keys:
            return False, "DUPLICATE_EVENT_IGNORED"
        
        # Persist order to database
        self.processed_idempotency_keys.add(msg.idempotency_key)
        self.persisted_orders.append(msg.order_id)
        return True, "ORDER_PERSISTED_SUCCESSFULLY"

consumer = IdempotentOrderConsumerWorker()
order_1 = FlashOrderMessage("ORD-1001", "SHO-ALICE", "LIMITED-SNEAKER-100", 25000, "idem_key_alice_99")
order_dup = FlashOrderMessage("ORD-1001-RETRY", "SHO-ALICE", "LIMITED-SNEAKER-100", 25000, "idem_key_alice_99")

res1, msg1 = consumer.consume_order_event(order_1)
res2, msg2 = consumer.consume_order_event(order_dup)

print(f"First Attempt:  Processed={res1} | Status: [{msg1}]")
print(f"Retry Attempt:  Processed={res2} | Status: [{msg2}]")
print(f"Total Unique Orders Persisted: {len(consumer.persisted_orders)}")


print("\n=== PART 5: ENTERPRISE FLASH SALE COMMAND TOWER ===")
@dataclass
class FlashSaleAuditTelemetry:
    event_name: str
    peak_concurrency_rps: int
    total_shopper_arrivals: int
    oversell_incidents: int
    p99_checkout_latency_ms: float
    gross_merchandise_value_usd: float

class FlashSaleCommandAuditEngine:
    def audit_flash_event(self, tele: FlashSaleAuditTelemetry) -> Dict[str, object]:
        score = 0.0
        if tele.oversell_incidents == 0:
            score += 25.0
        if tele.peak_concurrency_rps >= 50000:
            score += 25.0
        if tele.p99_checkout_latency_ms <= 85.0:
            score += 25.0
        if tele.gross_merchandise_value_usd >= 10000000.0:
            score += 25.0
            
        status = "APEX_FLASH_SALE_CONCURRENCY_CERTIFIED" if score == 100.0 else "CONCURRENCY_REMEDIATION_REQUIRED"
        return {
            "event": tele.event_name,
            "composite_score": score,
            "status": status,
            "peak_traffic": f"{tele.peak_concurrency_rps:,} RPS",
            "shoppers_served": f"{tele.total_shopper_arrivals:,} shoppers",
            "oversell_defects": str(tele.oversell_incidents),
            "p99_latency": f"{tele.p99_checkout_latency_ms} ms",
            "total_gmv": f"${tele.gross_merchandise_value_usd:,.2f} USD"
        }

audit_engine = FlashSaleCommandAuditEngine()
tele_data = FlashSaleAuditTelemetry(
    event_name="Global-Midnight-Black-Friday-Drop",
    peak_concurrency_rps=85000,
    total_shopper_arrivals=1250000,
    oversell_incidents=0,
    p99_checkout_latency_ms=64.2,
    gross_merchandise_value_usd=16800000.00
)

audit_report = audit_engine.audit_flash_event(tele_data)
print("=== ENTERPRISE FLASH SALE COMMAND TOWER REPORT ===")
print(f"Event Audited:     {audit_report['event']}")
print(f"Peak Traffic:      {audit_report['peak_traffic']}")
print(f"Shoppers Served:   {audit_report['shoppers_served']}")
print(f"Oversell Defects:  {audit_report['oversell_defects']} (Zero-Oversell Invariant Preserved)")
print(f"P99 Latency:       {audit_report['p99_latency']}")
print(f"Event GMV:         {audit_report['total_gmv']}")
print(f"Composite Score:   {audit_report['composite_score']}/100.0 pts")
print(f"Audit Status:      [{audit_report['status']}]")
