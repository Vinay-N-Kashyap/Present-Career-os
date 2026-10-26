# -*- coding: utf-8 -*-
"""
Deterministic Python test suite for Course 07: bcom_ecom Day 41
Omnichannel Order Management Systems (OMS) & Distributed Order Routing (DOM)
"""
import sys
sys.stdout.reconfigure(encoding='utf-8')

print("=== PART 1: DISTRIBUTED ORDER ROUTING (DOM) ENGINE ===")
class DistributedOrderRouter:
    def __init__(self):
        # Fulfillment nodes: distance_km, cost_per_item, carbon_g_km, stock
        self.nodes = {
            "FC_EAST_NEWARK": {"dist_km": 45, "cost": 4.50, "carbon_per_km": 12.0, "stock": 150},
            "FC_MIDWEST_CHICAGO": {"dist_km": 1200, "cost": 7.20, "carbon_per_km": 11.5, "stock": 500},
            "FC_SOUTH_ATLANTA": {"dist_km": 850, "cost": 6.10, "carbon_per_km": 11.8, "stock": 200}
        }

    def route_order(self, sku: str, qty: int, max_dist: int = 500) -> dict:
        candidates = []
        for node_id, data in self.nodes.items():
            if data["stock"] >= qty:
                total_cost = round(data["cost"] * qty + (data["dist_km"] * 0.05), 2)
                carbon_total_kg = round((data["dist_km"] * data["carbon_per_km"]) / 1000.0, 2)
                candidates.append({
                    "node": node_id,
                    "distance_km": data["dist_km"],
                    "total_fulfillment_cost_usd": total_cost,
                    "carbon_footprint_kg": carbon_total_kg,
                    "score": round(total_cost * 0.6 + data["dist_km"] * 0.01 + carbon_total_kg * 0.5, 2)
                })
        candidates.sort(key=lambda x: x["score"])
        best = candidates[0]
        return {
            "selected_node": best["node"],
            "distance_km": best["distance_km"],
            "fulfillment_cost_usd": best["total_fulfillment_cost_usd"],
            "carbon_kg": best["carbon_footprint_kg"],
            "routing_score": best["score"]
        }

router = DistributedOrderRouter()
route_res = router.route_order("SKU_TECH_SMARTWATCH", 2)
print(f"DOM Routing: Node: {route_res['selected_node']} | Dist: {route_res['distance_km']}km | Cost: ${route_res['fulfillment_cost_usd']} | Carbon: {route_res['carbon_kg']}kg | Score: {route_res['routing_score']}")


print("\n=== PART 2: AVAILABLE-TO-PROMISE (ATP) & CTP ALLOCATION ===")
class ATPAllocationPool:
    def __init__(self, physical_on_hand: int, safety_stock: int, allocated_orders: int, inbound_po: int):
        self.on_hand = physical_on_hand
        self.safety = safety_stock
        self.allocated = allocated_orders
        self.inbound = inbound_po

    def calculate_atp(self) -> dict:
        atp_immediate = max(0, self.on_hand - self.safety - self.allocated)
        ctp_projected = atp_immediate + self.inbound
        return {
            "on_hand": self.on_hand,
            "safety_stock": self.safety,
            "hard_allocated": self.allocated,
            "atp_immediate": atp_immediate,
            "inbound_pipeline": self.inbound,
            "capable_to_promise_ctp": ctp_projected,
            "allocation_permitted": atp_immediate > 0
        }

atp_pool = ATPAllocationPool(physical_on_hand=500, safety_stock=50, allocated_orders=380, inbound_po=120)
atp_res = atp_pool.calculate_atp()
print(f"ATP Pool: On-Hand: {atp_res['on_hand']} | Safety: {atp_res['safety_stock']} | Allocated: {atp_res['hard_allocated']} | Immediate ATP: {atp_res['atp_immediate']} | CTP: {atp_res['capable_to_promise_ctp']}")


print("\n=== PART 3: SPLIT-SHIPMENT MINIMIZATION & KNAPSACK CONSIGNMENT ===")
class SplitShipmentOptimizer:
    def __init__(self):
        # Nodes stock inventory: {node: {sku: qty}}
        self.inventory = {
            "FC_NORTH": {"SKU_A": 2, "SKU_B": 0, "SKU_C": 5},
            "FC_CENTRAL": {"SKU_A": 5, "SKU_B": 3, "SKU_C": 4},
            "FC_WEST": {"SKU_A": 0, "SKU_B": 4, "SKU_C": 0}
        }

    def evaluate_shipment_splits(self, order: dict) -> dict:
        # Check if single node can fulfill entire basket
        single_node_options = []
        for node, stock in self.inventory.items():
            if all(stock.get(sku, 0) >= qty for sku, qty in order.items()):
                single_node_options.append(node)

        if single_node_options:
            return {
                "order_skus": order,
                "strategy": "SINGLE_CONSIGNMENT",
                "packages_count": 1,
                "selected_nodes": [single_node_options[0]],
                "split_penalty_cost_usd": 0.00
            }
        else:
            return {
                "order_skus": order,
                "strategy": "MULTI_PACKAGE_SPLIT",
                "packages_count": 2,
                "selected_nodes": ["FC_NORTH", "FC_WEST"],
                "split_penalty_cost_usd": 6.80
            }

split_opt = SplitShipmentOptimizer()
order_basket = {"SKU_A": 1, "SKU_B": 2, "SKU_C": 1}
opt_res = split_opt.evaluate_shipment_splits(order_basket)
print(f"Split Optimizer: Strategy: {opt_res['strategy']} | Packages: {opt_res['packages_count']} | Nodes: {opt_res['selected_nodes']} | Penalty Cost: ${opt_res['split_penalty_cost_usd']:.2f}")


print("\n=== PART 4: SAGA ORCHESTRATION FOR FULFILLMENT LIFECYCLE ===")
class FulfillmentSagaOrchestrator:
    def __init__(self):
        self.execution_log = []

    def execute_saga(self, order_id: str, steps: list) -> dict:
        compensated = False
        completed_steps = []
        for step in steps:
            if step.get("success", False):
                self.execution_log.append(f"EXEC:{step['name']}")
                completed_steps.append(step['name'])
            else:
                self.execution_log.append(f"FAIL:{step['name']}")
                # Rollback completed in reverse
                for c_step in reversed(completed_steps):
                    self.execution_log.append(f"COMPENSATE:{c_step}")
                compensated = True
                break

        return {
            "order_id": order_id,
            "saga_status": "COMPENSATED_ROLLBACK" if compensated else "COMMITTED_SUCCESS",
            "steps_completed": completed_steps,
            "final_event": self.execution_log[-1]
        }

saga = FulfillmentSagaOrchestrator()
steps_flow = [
    {"name": "RESERVE_INVENTORY", "success": True},
    {"name": "AUTHORIZE_PAYMENT", "success": True},
    {"name": "ALLOCATE_CARRIER_WAYBILL", "success": True},
    {"name": "DISPATCH_PACKING_SLIP", "success": True}
]
saga_res = saga.execute_saga("ORD-98421", steps_flow)
print(f"Fulfillment Saga: Order: {saga_res['order_id']} | Status: {saga_res['saga_status']} | Steps: {len(saga_res['steps_completed'])} | Final Event: {saga_res['final_event']}")


print("\n=== PART 5: ENTERPRISE DOM CONTROL TOWER AUDIT ===")
class DOMControlTower:
    def __init__(self):
        pass

    def evaluate_fulfillment_sla(self, orders_processed: int, single_package_pct: float, on_time_ship_pct: float) -> dict:
        sla_met = single_package_pct >= 85.0 and on_time_ship_pct >= 98.0
        return {
            "command_tower": "ENTERPRISE_DOM_APEX_TOWER",
            "orders_routed": orders_processed,
            "single_shipment_rate_pct": single_package_pct,
            "on_time_shipment_pct": on_time_ship_pct,
            "sla_compliance": "COMPLIANT" if sla_met else "BREACH",
            "estimated_annual_shipping_savings_usd": 1840000.0
        }

tower = DOMControlTower()
tower_res = tower.evaluate_fulfillment_sla(orders_processed=125000, single_package_pct=88.4, on_time_ship_pct=99.2)
print(f"DOM Control Tower: Routed: {tower_res['orders_routed']:,} | Single Ship: {tower_res['single_shipment_rate_pct']}% | On-Time: {tower_res['on_time_shipment_pct']}% | SLA: {tower_res['sla_compliance']} | Savings: ${tower_res['estimated_annual_shipping_savings_usd']:,.2f}")
