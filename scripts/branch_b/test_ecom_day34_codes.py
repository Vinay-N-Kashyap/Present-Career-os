# Test code snippets for bcom_ecom Day 34
print("=== PART 1: AVAILABLE-TO-PROMISE (ATP) ENGINE ===")
class ATPEngine:
    def __init__(self, on_hand: int, allocated: int, safety_stock: int, in_transit: int):
        self.on_hand = on_hand
        self.allocated = allocated
        self.safety_stock = safety_stock
        self.in_transit = in_transit

    def calculate_atp(self) -> dict:
        unreserved = self.on_hand - self.allocated - self.safety_stock
        current_atp = max(0, unreserved)
        projected_atp = max(0, unreserved + self.in_transit)
        return {
            "on_hand_physical": self.on_hand,
            "allocated_unshipped": self.allocated,
            "safety_stock_reserve": self.safety_stock,
            "in_transit_purchase_orders": self.in_transit,
            "immediate_atp_sellable": current_atp,
            "projected_atp_future": projected_atp,
            "stockout_risk": "SAFE" if current_atp > 50 else "WARNING"
        }

engine = ATPEngine(on_hand=500, allocated=180, safety_stock=50, in_transit=200)
atp_res = engine.calculate_atp()
for k, v in atp_res.items():
    print(f"  {k}: {v}")

print("\n=== PART 2: CHANNEL QUOTA RING-FENCING ===")
class ChannelQuotaManager:
    def __init__(self, total_stock: int):
        self.total_stock = total_stock
        self.quotas = {
            "D2C_STOREFRONT": int(total_stock * 0.50),
            "AMAZON_MARKETPLACE": int(total_stock * 0.30),
            "B2B_WHOLESALE": int(total_stock * 0.20)
        }
        self.sales = {k: 0 for k in self.quotas}

    def allocate_sale(self, channel: str, quantity: int) -> bool:
        available = self.quotas[channel] - self.sales[channel]
        if available >= quantity:
            self.sales[channel] += quantity
            return True
        return False

manager = ChannelQuotaManager(total_stock=1000)
manager.allocate_sale("D2C_STOREFRONT", 250)
manager.allocate_sale("AMAZON_MARKETPLACE", 280)
manager.allocate_sale("B2B_WHOLESALE", 150)

print(f"Total Stock: {manager.total_stock}")
for ch, q in manager.quotas.items():
    sold = manager.sales[ch]
    rem = q - sold
    print(f"  Channel: {ch:<20} | Quota: {q:4d} | Sold: {sold:4d} | Remaining: {rem:4d}")

print("\n=== PART 3: REDIS ATOMIC CAS LUA SCRIPT DECREMENT ===")
class MockRedisAtomicDecrement:
    def __init__(self, initial_stock: int):
        self.stock = initial_stock
        self.version = 1

    def execute_lua_atomic_decrement(self, requested_qty: int, client_token: str) -> dict:
        # Atomic Lua script logic running inside single Redis thread
        if self.stock >= requested_qty:
            self.stock -= requested_qty
            self.version += 1
            return {
                "success": True,
                "token": client_token,
                "remaining_stock": self.stock,
                "version": self.version,
                "status": "ATOMIC_DECREMENT_SUCCESS"
            }
        return {
            "success": False,
            "token": client_token,
            "remaining_stock": self.stock,
            "version": self.version,
            "status": "STOCKOUT_REJECTED"
        }

redis_mock = MockRedisAtomicDecrement(initial_stock=3)
r1 = redis_mock.execute_lua_atomic_decrement(2, "order-tok-101")
r2 = redis_mock.execute_lua_atomic_decrement(1, "order-tok-102")
r3 = redis_mock.execute_lua_atomic_decrement(1, "order-tok-103")

print(f"Transaction 1: {r1['status']} | Stock: {r1['remaining_stock']}")
print(f"Transaction 2: {r2['status']} | Stock: {r2['remaining_stock']}")
print(f"Transaction 3: {r3['status']} | Stock: {r3['remaining_stock']}")

print("\n=== PART 4: ASYNCHRONOUS CYCLE COUNT RECONCILIATION ===")
class LedgerReconciliation:
    def __init__(self):
        self.digital_ledger = {"SKU-A": 150, "SKU-B": 320, "SKU-C": 85}
        self.physical_counts = {"SKU-A": 148, "SKU-B": 320, "SKU-C": 80}

    def reconcile_variances(self) -> dict:
        adjustments = {}
        total_shrinkage = 0
        for sku, digital_qty in self.digital_ledger.items():
            physical_qty = self.physical_counts.get(sku, digital_qty)
            variance = physical_qty - digital_qty
            if variance != 0:
                adjustments[sku] = {
                    "digital_before": digital_qty,
                    "physical_count": physical_qty,
                    "variance": variance,
                    "reason": "SHRINKAGE_OR_DAMAGE" if variance < 0 else "SURPLUS"
                }
                total_shrinkage += abs(variance)
                self.digital_ledger[sku] = physical_qty
        return {
            "discrepant_skus": len(adjustments),
            "total_variance_units": total_shrinkage,
            "audit_adjustments": adjustments,
            "reconciliation_status": "LEDGER_SYNCHRONIZED"
        }

recon = LedgerReconciliation()
res = recon.reconcile_variances()
print(f"Status: {res['reconciliation_status']}")
print(f"Discrepant SKUs: {res['discrepant_skus']} | Total Variance Units: {res['total_variance_units']}")
for sku, info in res['audit_adjustments'].items():
    print(f"  {sku}: Digital {info['digital_before']} -> Physical {info['physical_count']} (Delta: {info['variance']})")

print("\n=== PART 5: ENTERPRISE GLOBAL INVENTORY COMMAND TOWER ===")
class EnterpriseInventoryCommandTower:
    def __init__(self):
        self.nodes = {
            "WH-US-EAST": {"physical": 1000, "allocated": 350, "safety": 100},
            "WH-US-WEST": {"physical": 800,  "allocated": 200, "safety": 80},
            "WH-EU-CENTRAL": {"physical": 600, "allocated": 150, "safety": 60}
        }

    def evaluate_global_inventory_posture(self) -> dict:
        total_physical = sum(n["physical"] for n in self.nodes.values())
        total_allocated = sum(n["allocated"] for n in self.nodes.values())
        total_safety = sum(n["safety"] for n in self.nodes.values())
        total_sellable_atp = total_physical - total_allocated - total_safety
        
        node_health = {}
        for name, n in self.nodes.items():
            atp = n["physical"] - n["allocated"] - n["safety"]
            node_health[name] = {
                "sellable_atp": atp,
                "utilization_pct": round((n["allocated"] / n["physical"]) * 100, 2)
            }
            
        return {
            "enterprise_nodes": len(self.nodes),
            "total_physical_stock": total_physical,
            "total_allocated_stock": total_allocated,
            "total_safety_reserves": total_safety,
            "global_sellable_atp": total_sellable_atp,
            "node_metrics": node_health,
            "oversell_protection": "STRICT_RING_FENCE_ENFORCED"
        }

tower = EnterpriseInventoryCommandTower()
audit = tower.evaluate_global_inventory_posture()
print(f"Total Physical Stock:   {audit['total_physical_stock']} units")
print(f"Total Allocated Stock:  {audit['total_allocated_stock']} units")
print(f"Global Sellable ATP:    {audit['global_sellable_atp']} units")
print(f"Oversell Protection:    {audit['oversell_protection']}")
for node, metrics in audit['node_metrics'].items():
    print(f"  Node {node}: ATP {metrics['sellable_atp']} | Util: {metrics['utilization_pct']}%")
