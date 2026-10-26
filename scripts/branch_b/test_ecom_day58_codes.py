"""
Deterministic Python Code Blocks for Course 07 Day 58:
Unified Omnichannel Commerce, POS Synchronization, Distributed Inventory & BOPIS/BORIS Workflows
"""
import json
import hashlib
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple

print("=== PART 1: UNIFIED OMNICHANNEL CUSTOMER & CART STATE SYNC ===")
@dataclass
class ChannelInteraction:
    interaction_id: str
    channel: str # 'MOBILE_APP', 'PHYSICAL_POS', 'WEB_DESKTOP'
    sku: str
    quantity: int
    timestamp: float

class OmnichannelCartSyncEngine:
    def __init__(self, customer_id: str):
        self.customer_id = customer_id
        self.unified_cart: Dict[str, int] = {}
        self.loyalty_points: int = 450

    def apply_channel_action(self, action: ChannelInteraction):
        # Merge physical in-store barcode scan or digital cart modification
        current = self.unified_cart.get(action.sku, 0)
        new_total = current + action.quantity
        if new_total > 0:
            self.unified_cart[action.sku] = new_total
        else:
            self.unified_cart.pop(action.sku, None)

    def get_unified_state(self) -> Dict[str, object]:
        return {
            "customer_id": self.customer_id,
            "cart_items": self.unified_cart,
            "total_units": sum(self.unified_cart.values()),
            "loyalty_balance": self.loyalty_points
        }

sync_engine = OmnichannelCartSyncEngine("CUST-OMNI-771")
# User adds item on web, scans another in physical retail store via POS app
sync_engine.apply_channel_action(ChannelInteraction("ACT-01", "WEB_DESKTOP", "SKU-SMARTWATCH", 1, 1000.0))
sync_engine.apply_channel_action(ChannelInteraction("ACT-02", "PHYSICAL_POS", "SKU-STRAP-LEATHER", 2, 1050.0))

state = sync_engine.get_unified_state()
print(f"Customer: {state['customer_id']} | Loyalty: {state['loyalty_balance']} pts")
print(f"Unified Cart: {state['cart_items']} (Total Units: {state['total_units']})")


print("\n=== PART 2: DISTRIBUTED ATP INVENTORY ALLOCATION ENGINE ===")
@dataclass
class InventoryNodeRecord:
    node_id: str
    node_type: str  # 'REGIONAL_DC', 'RETAIL_STORE_BACKROOM'
    on_hand: int
    allocated: int
    safety_buffer: int
    damaged: int

class DistributedATPEngine:
    @staticmethod
    def calculate_node_atp(node: InventoryNodeRecord) -> Tuple[int, str]:
        # ATP = On-Hand - Allocated - Safety Buffer - Damaged
        usable_atp = max(0, node.on_hand - node.allocated - node.safety_buffer - node.damaged)
        health = "ATP_HEALTHY" if usable_atp >= 15 else "ATP_LOW_STOCK" if usable_atp > 0 else "ATP_DEPLETED"
        return usable_atp, health

node_dc = InventoryNodeRecord("DC-CENTRAL-01", "REGIONAL_DC", 500, 120, 25, 5)
node_store = InventoryNodeRecord("STORE-MANHATTAN-04", "RETAIL_STORE_BACKROOM", 18, 6, 4, 1)

atp_dc, status_dc = DistributedATPEngine.calculate_node_atp(node_dc)
atp_store, status_store = DistributedATPEngine.calculate_node_atp(node_store)

print(f"Regional DC ({node_dc.node_id}): OnHand={node_dc.on_hand} -> Usable ATP: {atp_dc} [{status_dc}]")
print(f"Retail Store ({node_store.node_id}): OnHand={node_store.on_hand} -> Usable ATP: {atp_store} [{status_store}]")


print("\n=== PART 3: BOPIS (BUY ONLINE PICKUP IN STORE) STATE MACHINE ===")
@dataclass
class BOPISOrderRecord:
    order_id: str
    customer_id: str
    assigned_store_id: str
    sku: str
    status: str
    associate_picked_at: Optional[float] = None
    staged_bin_location: Optional[str] = None
    customer_collected_at: Optional[float] = None

class BOPISStateMachine:
    VALID_TRANSITIONS = {
        "ORDER_PLACED": ["ASSOCIATE_PICKING"],
        "ASSOCIATE_PICKING": ["STAGED_READY_FOR_PICKUP", "OUT_OF_STOCK_REROUTED"],
        "STAGED_READY_FOR_PICKUP": ["CUSTOMER_COLLECTED", "PICKUP_EXPIRED_RESTOCKED"]
    }

    @classmethod
    def transition(cls, order: BOPISOrderRecord, new_status: str, timestamp: float, meta: str = "") -> bool:
        allowed = cls.VALID_TRANSITIONS.get(order.status, [])
        if new_status not in allowed:
            return False
        
        order.status = new_status
        if new_status == "STAGED_READY_FOR_PICKUP":
            order.associate_picked_at = timestamp
            order.staged_bin_location = meta
        elif new_status == "CUSTOMER_COLLECTED":
            order.customer_collected_at = timestamp
        return True

bopis = BOPISOrderRecord("ORD-BOPIS-9921", "CUST-OMNI-771", "STORE-MANHATTAN-04", "SKU-SMARTWATCH", "ORDER_PLACED")
ok1 = BOPISStateMachine.transition(bopis, "ASSOCIATE_PICKING", 1000.0)
ok2 = BOPISStateMachine.transition(bopis, "STAGED_READY_FOR_PICKUP", 1020.0, meta="BIN-SHELF-C04")
ok3 = BOPISStateMachine.transition(bopis, "CUSTOMER_COLLECTED", 1080.0)

print(f"BOPIS Lifecycle for {bopis.order_id}:")
print(f"  Final Status: [{bopis.status}]")
print(f"  Staging Bin:  {bopis.staged_bin_location}")
print(f"  Fulfillment:  Associate Picked in 20 min | Collected in 60 min")


print("\n=== PART 4: BORIS (BUY ONLINE RETURN IN STORE) RE-COMMERCE ENGINE ===")
@dataclass
class OnlineOrderOriginalReceipt:
    order_id: str
    sku: str
    purchase_price_cents: int
    tax_paid_cents: int
    payment_token: str

@dataclass
class ReturnInspectionResult:
    condition_grade: str  # 'GRADE_A_MINT', 'GRADE_B_OPEN_BOX', 'GRADE_C_DAMAGED'
    disposition_action: str

class BORISReturnEngine:
    @staticmethod
    def process_store_return(receipt: OnlineOrderOriginalReceipt, grade: str) -> Dict[str, object]:
        if grade == "GRADE_A_MINT":
            # 100% refund, restocked directly to store shelf inventory
            refund_cents = receipt.purchase_price_cents + receipt.tax_paid_cents
            disposition = "RESTOCK_TO_STORE_SHELF"
            restock_fee_cents = 0
        elif grade == "GRADE_B_OPEN_BOX":
            # 100% refund, routed to Open-Box markdown re-commerce
            refund_cents = receipt.purchase_price_cents + receipt.tax_paid_cents
            disposition = "ROUTE_TO_OPEN_BOX_CLEARANCE"
            restock_fee_cents = 0
        else:
            # Damaged / Return to Vendor (RTV) liquidation
            restock_fee_cents = int(receipt.purchase_price_cents * 0.15)
            refund_cents = (receipt.purchase_price_cents - restock_fee_cents) + receipt.tax_paid_cents
            disposition = "ROUTE_TO_RTV_LIQUIDATION"
            
        return {
            "order_id": receipt.order_id,
            "refund_authorized_usd": f"{refund_cents / 100:.2f}",
            "restock_fee_usd": f"{restock_fee_cents / 100:.2f}",
            "inventory_disposition": disposition,
            "reconciliation_channel": "RETAIL_POS_TO_DIGITAL_GATEWAY"
        }

receipt = OnlineOrderOriginalReceipt("ORD-WEB-4412", "SKU-HEADPHONES-BT", 20000, 1600, "tok_visa_882910")
return_result = BORISReturnEngine.process_store_return(receipt, "GRADE_A_MINT")

print("BORIS In-Store Return Processed:")
print(f"  Order ID:    {return_result['order_id']}")
print(f"  Refund Sum:  ${return_result['refund_authorized_usd']} USD (Fee: ${return_result['restock_fee_usd']})")
print(f"  Disposition: [{return_result['inventory_disposition']}]")
print(f"  Ledger Sync: [{return_result['reconciliation_channel']}]")


print("\n=== PART 5: ENTERPRISE OMNICHANNEL STORE COMMAND TOWER ===")
@dataclass
class OmnichannelFleetMetrics:
    total_retail_stores: int
    daily_bopis_orders: int
    bopis_pick_sla_compliance_pct: float
    boris_recommerce_recovery_pct: float
    cross_channel_inventory_accuracy_pct: float
    annual_omnichannel_roi_usd: float

class OmnichannelCommandAuditEngine:
    def audit_fleet_performance(self, metrics: OmnichannelFleetMetrics) -> Dict[str, object]:
        score = 0.0
        if metrics.bopis_pick_sla_compliance_pct >= 95.0:
            score += 25.0
        if metrics.boris_recommerce_recovery_pct >= 85.0:
            score += 25.0
        if metrics.cross_channel_inventory_accuracy_pct >= 99.0:
            score += 25.0
        if metrics.annual_omnichannel_roi_usd >= 10000000.0:
            score += 25.0
            
        status = "APEX_OMNICHANNEL_RETAIL_CERTIFIED" if score == 100.0 else "SUBOPTIMAL_STORE_FULFILLMENT"
        return {
            "stores_active": str(metrics.total_retail_stores),
            "composite_score": score,
            "status": status,
            "daily_bopis": f"{metrics.daily_bopis_orders:,} orders",
            "pick_sla": f"{metrics.bopis_pick_sla_compliance_pct:.1f}%",
            "boris_recovery": f"{metrics.boris_recommerce_recovery_pct:.1f}%",
            "inventory_accuracy": f"{metrics.cross_channel_inventory_accuracy_pct:.1f}%",
            "annual_roi": f"${metrics.annual_omnichannel_roi_usd:,.2f} USD"
        }

cmd_engine = OmnichannelCommandAuditEngine()
fleet_data = OmnichannelFleetMetrics(
    total_retail_stores=480,
    daily_bopis_orders=38500,
    bopis_pick_sla_compliance_pct=97.4,
    boris_recommerce_recovery_pct=91.2,
    cross_channel_inventory_accuracy_pct=99.6,
    annual_omnichannel_roi_usd=24600000.00
)

fleet_report = cmd_engine.audit_fleet_performance(fleet_data)
print("=== OMNICHANNEL STORE COMMAND TOWER REPORT ===")
print(f"Retail Stores:       {fleet_report['stores_active']} locations")
print(f"Daily BOPIS Volume:  {fleet_report['daily_bopis']}")
print(f"Pick SLA Compliance: {fleet_report['pick_sla']}")
print(f"BORIS Recovery Rate: {fleet_report['boris_recovery']}")
print(f"Inventory Accuracy:  {fleet_report['inventory_accuracy']}")
print(f"Omnichannel ROI:     {fleet_report['annual_roi']}")
print(f"Composite Score:     {fleet_report['composite_score']}/100.0 pts")
print(f"Audit Status:        [{fleet_report['status']}]")
