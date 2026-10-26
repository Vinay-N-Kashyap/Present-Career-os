# -*- coding: utf-8 -*-
"""
Deterministic Python test suite for Course 07: bcom_ecom Day 43
Reverse Logistics, Automated Returns Management & Restocking Engines
"""
import sys
sys.stdout.reconfigure(encoding='utf-8')

print("=== PART 1: RMA SELF-SERVICE RETURN AUTHORIZATION ===")
class ReturnAuthorizationEngine:
    def __init__(self, return_window_days: int = 30):
        self.return_window = return_window_days

    def authorize_return(self, order_id: str, days_since_delivery: int, item_price: float, return_reason: str) -> dict:
        eligible = days_since_delivery <= self.return_window
        fee_amount = 0.00 if return_reason in ["DEFECTIVE_PRODUCT", "WRONG_ITEM_SHIPPED"] else 5.99
        estimated_refund = max(0.00, round(item_price - fee_amount, 2)) if eligible else 0.00

        return {
            "order_id": order_id,
            "days_elapsed": days_since_delivery,
            "return_eligible": eligible,
            "rma_number": f"RMA-{order_id[-5:]}-AUTH" if eligible else "INELIGIBLE_EXPIRED",
            "restocking_return_fee_usd": fee_amount if eligible else 0.00,
            "authorized_refund_usd": estimated_refund,
            "status": "RMA_GENERATED" if eligible else "RETURN_WINDOW_EXPIRED"
        }

rma_engine = ReturnAuthorizationEngine(return_window_days=30)
rma_res = rma_engine.authorize_return("ORD-77124", days_since_delivery=14, item_price=120.0, return_reason="SIZE_TOO_SMALL")
print(f"RMA Engine: Order: {rma_res['order_id']} | RMA: {rma_res['rma_number']} | Fee: ${rma_res['restocking_return_fee_usd']} | Net Refund: ${rma_res['authorized_refund_usd']} | Status: {rma_res['status']}")


print("\n=== PART 2: AUTOMATED DISPOSITION TRIAGE ENGINE ===")
class DispositionTriageEngine:
    def __init__(self):
        # Grade definitions and target disposition
        self.grade_actions = {
            "GRADE_A": {"action": "RESTOCK_PRIMARY_CATALOG", "recovery_rate": 1.00},
            "GRADE_B": {"action": "OPEN_BOX_DISCOUNT_OUTLET", "recovery_rate": 0.80},
            "GRADE_C": {"action": "B2B_SECONDARY_LIQUIDATION", "recovery_rate": 0.45},
            "GRADE_D": {"action": "RECYCLE_RAW_MATERIAL_DISPOSAL", "recovery_rate": 0.10}
        }

    def evaluate_item(self, sku: str, retail_price: float, physical_grade: str) -> dict:
        action_data = self.grade_actions.get(physical_grade, self.grade_actions["GRADE_D"])
        recovered_value = round(retail_price * action_data["recovery_rate"], 2)
        return {
            "sku": sku,
            "retail_price_usd": retail_price,
            "inspection_grade": physical_grade,
            "triage_action": action_data["action"],
            "recovered_value_usd": recovered_value,
            "inventory_target": "PRIME_INVENTORY" if physical_grade == "GRADE_A" else "OUTLET_OR_LIQUIDATION"
        }

triage = DispositionTriageEngine()
triage_res = triage.evaluate_item("SKU_AUDIO_HEADPHONES", retail_price=250.0, physical_grade="GRADE_B")
print(f"Disposition Triage: SKU: {triage_res['sku']} | Grade: {triage_res['inspection_grade']} | Action: {triage_res['triage_action']} | Recovered: ${triage_res['recovered_value_usd']} | Target: {triage_res['inventory_target']}")


print("\n=== PART 3: SECONDARY MARKET WHOLESALE LIQUIDATION ===")
class WholesaleLiquidationAuction:
    def __init__(self):
        pass

    def clear_pallet_lot(self, lot_id: str, original_retail_val: float, floor_pct: float, bids: list) -> dict:
        reserve_floor = round(original_retail_val * floor_pct, 2)
        valid_bids = [b for b in bids if b["bid_amount"] >= reserve_floor]
        
        if valid_bids:
            winning_bid = max(valid_bids, key=lambda x: x["bid_amount"])
            return {
                "lot_id": lot_id,
                "original_retail_val": original_retail_val,
                "reserve_floor_usd": reserve_floor,
                "winning_bidder": winning_bid["bidder"],
                "clearing_price_usd": winning_bid["bid_amount"],
                "recovery_pct": round((winning_bid["bid_amount"] / original_retail_val) * 100, 2),
                "auction_status": "AUCTION_SETTLED"
            }
        else:
            return {
                "lot_id": lot_id,
                "reserve_floor_usd": reserve_floor,
                "auction_status": "UNSOLD_BELOW_RESERVE"
            }

auction = WholesaleLiquidationAuction()
bids_received = [
    {"bidder": "OUTLET_KING_WHOLESALE", "bid_amount": 3400.0},
    {"bidder": "CLEARANCE_PALLETS_INC", "bid_amount": 4200.0},
    {"bidder": "BARGAIN_BARN_CORP", "bid_amount": 3800.0}
]
auction_res = auction.clear_pallet_lot("LOT-RET-904", original_retail_val=10000.0, floor_pct=0.35, bids=bids_received)
print(f"Liquidation Auction: Lot: {auction_res['lot_id']} | Winner: {auction_res['winning_bidder']} | Clearing: ${auction_res['clearing_price_usd']:,.2f} | Recovery: {auction_res['recovery_pct']}% | Status: {auction_res['auction_status']}")


print("\n=== PART 4: RETURN FRAUD & WARDROBING DEFENSE ===")
class ReturnFraudDetector:
    def __init__(self, high_risk_threshold: float = 0.65):
        self.threshold = high_risk_threshold

    def evaluate_customer_risk(self, lifetime_orders: int, returns_count: int, serial_mismatch_history: int) -> dict:
        return_rate = returns_count / max(1, lifetime_orders)
        fraud_score = round(return_rate * 0.5 + (serial_mismatch_history * 0.35), 2)
        is_flagged = fraud_score >= self.threshold

        return {
            "lifetime_orders": lifetime_orders,
            "returns_count": returns_count,
            "return_ratio_pct": round(return_rate * 100, 1),
            "fraud_risk_score": fraud_score,
            "action": "BLOCK_INSTANT_REFUND_MANDATORY_INSPECTION" if is_flagged else "INSTANT_REFUND_APPROVED",
            "fraud_category": "SERIAL_WARDROBER" if is_flagged else "NORMAL_BUYER"
        }

fraud_detector = ReturnFraudDetector()
fraud_res = fraud_detector.evaluate_customer_risk(lifetime_orders=20, returns_count=16, serial_mismatch_history=1)
print(f"Return Fraud: Ratio: {fraud_res['return_ratio_pct']}% | Score: {fraud_res['fraud_risk_score']} | Category: {fraud_res['fraud_category']} | Action: {fraud_res['action']}")


print("\n=== PART 5: CIRCULAR ECONOMY COMMAND TOWER ===")
class CircularEconomyCommandTower:
    def __init__(self):
        pass

    def evaluate_circular_logistics(self, total_returns: int, restocked_pct: float, landfill_diversion_pct: float) -> dict:
        certified = restocked_pct >= 65.0 and landfill_diversion_pct >= 95.0
        return {
            "command_tower": "CIRCULAR_ECONOMY_APEX_TOWER",
            "returns_processed": total_returns,
            "restocked_resold_pct": restocked_pct,
            "landfill_diversion_pct": landfill_diversion_pct,
            "esg_accreditation": "CIRCULAR_COMMERCE_CERTIFIED" if certified else "REMEDIAL_ACTION",
            "recovered_annual_capital_usd": 3850000.0
        }

circ_tower = CircularEconomyCommandTower()
circ_res = circ_tower.evaluate_circular_logistics(total_returns=48000, restocked_pct=68.5, landfill_diversion_pct=98.2)
print(f"Circular Tower: Returns: {circ_res['returns_processed']:,} | Resold: {circ_res['restocked_resold_pct']}% | Diverted: {circ_res['landfill_diversion_pct']}% | Status: {circ_res['esg_accreditation']} | Recovered: ${circ_res['recovered_annual_capital_usd']:,.2f}")
