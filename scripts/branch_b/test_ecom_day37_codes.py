# -*- coding: utf-8 -*-
"""
Deterministic Python test suite for Course 07: bcom_ecom Day 37
Distributed Shopping Cart Architecture & Real-Time Abandonment Engines
"""
import sys
import uuid
sys.stdout.reconfigure(encoding='utf-8')

print("=== PART 1: OR-SET CRDT DISTRIBUTED SHOPPING CART ===")
class ORSetShoppingCart:
    def __init__(self, replica_id: str):
        self.replica_id = replica_id
        self.add_set = {}
        self.remove_set = set()

    def add_item(self, sku: str, qty: int) -> str:
        tag = f"{self.replica_id}:{sku}:tag1"
        if sku not in self.add_set:
            self.add_set[sku] = {}
        self.add_set[sku][tag] = qty
        return tag

    def remove_item(self, sku: str):
        if sku in self.add_set:
            for tag in self.add_set[sku].keys():
                self.remove_set.add(tag)

    def read_cart(self) -> dict:
        cart = {}
        for sku, tag_map in self.add_set.items():
            active_qty = sum(qty for tag, qty in tag_map.items() if tag not in self.remove_set)
            if active_qty > 0:
                cart[sku] = active_qty
        return cart

    def merge(self, other: "ORSetShoppingCart"):
        for sku, tag_map in other.add_set.items():
            if sku not in self.add_set:
                self.add_set[sku] = {}
            self.add_set[sku].update(tag_map)
        self.remove_set.update(other.remove_set)

# Simulate mobile node and desktop node
mobile = ORSetShoppingCart(replica_id="MOBILE")
desktop = ORSetShoppingCart(replica_id="DESKTOP")

mobile.add_item("SKU-SNEAKER", 1)
desktop.add_item("SKU-HOODIE", 2)
# Desktop user removes hoodie
desktop.remove_item("SKU-HOODIE")

# Converge both replicas via CRDT merge
mobile.merge(desktop)
desktop.merge(mobile)

print(f"Mobile Cart:  {mobile.read_cart()}")
print(f"Desktop Cart: {desktop.read_cart()}")
print(f"CRDT Replicas Converged: {mobile.read_cart() == desktop.read_cart()}")


print("\n=== PART 2: ANONYMOUS-TO-AUTHENTICATED SESSION MERGER ===")
class CartSessionMerger:
    def __init__(self, max_qty_per_item: int = 5):
        self.max_qty_per_item = max_qty_per_item

    def merge_sessions(self, guest_cart: dict, auth_cart: dict, catalog_prices: dict) -> dict:
        merged_items = {}
        all_skus = sorted(set(guest_cart.keys()) | set(auth_cart.keys()))
        
        for sku in all_skus:
            guest_qty = guest_cart.get(sku, {}).get("qty", 0)
            auth_qty = auth_cart.get(sku, {}).get("qty", 0)
            combined_qty = min(self.max_qty_per_item, guest_qty + auth_qty)
            unit_price = catalog_prices.get(sku, 0.0)
            
            merged_items[sku] = {
                "qty": combined_qty,
                "unit_price": unit_price,
                "line_total": round(combined_qty * unit_price, 2)
            }
            
        subtotal = sum(item["line_total"] for item in merged_items.values())
        return {
            "merged_cart_id": "CART-AUTH-USER-801",
            "distinct_skus": len(merged_items),
            "subtotal_usd": round(subtotal, 2),
            "items": merged_items
        }

merger = CartSessionMerger(max_qty_per_item=5)
guest = {"SKU-WATCH": {"qty": 1}, "SKU-BELT": {"qty": 2}}
auth = {"SKU-WATCH": {"qty": 2}, "SKU-WALLET": {"qty": 1}}
prices = {"SKU-WATCH": 150.0, "SKU-BELT": 45.0, "SKU-WALLET": 60.0}

merged = merger.merge_sessions(guest, auth, prices)
print(f"Cart ID: {merged['merged_cart_id']} | Subtotal: ${merged['subtotal_usd']}")
for sku, info in merged['items'].items():
    print(f"  {sku}: Qty {info['qty']} @ ${info['unit_price']} = ${info['line_total']}")


print("\n=== PART 3: WEBSOCKET CART STATE BROADCASTER ===")
class MockWebSocketGateway:
    def __init__(self):
        self.client_connections = {}

    def register_client(self, user_id: str, client_id: str, device: str):
        if user_id not in self.client_connections:
            self.client_connections[user_id] = {}
        self.client_connections[user_id][client_id] = device

    def broadcast_cart_delta(self, user_id: str, delta: dict) -> list[str]:
        delivered = []
        clients = self.client_connections.get(user_id, {})
        for cid, device in clients.items():
            delivered.append(f"Delivered {delta['action']} of {delta['sku']} to {device} ({cid})")
        return delivered

ws_gateway = MockWebSocketGateway()
ws_gateway.register_client("USER-42", "ws-tab-101", "DESKTOP_CHROME")
ws_gateway.register_client("USER-42", "ws-app-202", "MOBILE_IOS")

delta = {"action": "ITEM_ADDED", "sku": "SKU-WATCH", "new_qty": 3, "subtotal": 540.0}
dispatches = ws_gateway.broadcast_cart_delta("USER-42", delta)
for d in dispatches:
    print(f"  {d}")


print("\n=== PART 4: REDIS STREAMS CART ABANDONMENT DETECTOR ===")
class CartAbandonmentTracker:
    def __init__(self):
        self.active_carts = {}

    def record_activity(self, cart_id: str, elapsed_minutes: int, cart_value: float):
        self.active_carts[cart_id] = {
            "elapsed_minutes": elapsed_minutes,
            "cart_value": cart_value,
            "status": "ACTIVE"
        }

    def evaluate_abandonment(self) -> dict:
        results = {"active": 0, "abandoned_stage_1": 0, "abandoned_stage_2": 0}
        for cid, data in self.active_carts.items():
            mins = data["elapsed_minutes"]
            if mins >= 120:
                data["status"] = "ABANDONED_STAGE_2_SMS"
                results["abandoned_stage_2"] += 1
            elif mins >= 15:
                data["status"] = "ABANDONED_STAGE_1_EMAIL"
                results["abandoned_stage_1"] += 1
            else:
                results["active"] += 1
        return results

tracker = CartAbandonmentTracker()
tracker.record_activity("CART-101", elapsed_minutes=5, cart_value=120.0)
tracker.record_activity("CART-102", elapsed_minutes=25, cart_value=350.0)
tracker.record_activity("CART-103", elapsed_minutes=150, cart_value=85.0)

audit = tracker.evaluate_abandonment()
print(f"Active Carts:             {audit['active']}")
print(f"Stage 1 Abandoned (15m):  {audit['abandoned_stage_1']} (Dispatched Recovery Email)")
print(f"Stage 2 Abandoned (2h):   {audit['abandoned_stage_2']} (Dispatched Recovery SMS/Offer)")


print("\n=== PART 5: COMPLETE DISTRIBUTED SHOPPING CART ENGINE ===")
class EnterpriseDistributedCartEngine:
    def __init__(self):
        self.merger = CartSessionMerger()
        self.ws = MockWebSocketGateway()
        self.abandonment = CartAbandonmentTracker()

    def process_customer_cart_action(self, user_id: str, action: str, sku: str, qty: int, price: float) -> dict:
        self.ws.register_client(user_id, "tab-1", "DESKTOP")
        self.ws.register_client(user_id, "app-1", "MOBILE")
        
        delta = {"action": action, "sku": sku, "qty": qty, "price": price}
        delivered = self.ws.broadcast_cart_delta(user_id, delta)
        
        cart_id = f"CART-{user_id}"
        self.abandonment.record_activity(cart_id, elapsed_minutes=0, cart_value=qty * price)
        
        return {
            "cart_id": cart_id,
            "action_executed": action,
            "sku": sku,
            "quantity": qty,
            "total_line_value": round(qty * price, 2),
            "real_time_sync_clients": len(delivered),
            "abandonment_monitoring": "ACTIVE_MONITORING"
        }

engine = EnterpriseDistributedCartEngine()
res = engine.process_customer_cart_action("USER-990", "ADD_ITEM", "SKU-LUXURY-BAG", 1, 1250.0)
print(f"Cart ID:            {res['cart_id']}")
print(f"Action:             {res['action_executed']} {res['sku']} (Qty: {res['quantity']})")
print(f"Line Value:         ${res['total_line_value']} USD")
print(f"Synced Devices:     {res['real_time_sync_clients']} clients connected")
print(f"Abandonment Guard:  {res['abandonment_monitoring']}")
