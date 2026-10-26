# -*- coding: utf-8 -*-
"""
Deterministic Python test suite for Course 07: bcom_ecom Day 44
Post-Purchase Telemetry, Distributed Tracing & Event-Driven Notification Pipelines
"""
import sys
sys.stdout.reconfigure(encoding='utf-8')

print("=== PART 1: EVENT-SOURCED ORDER LIFECYCLE REPLAY ===")
class EventSourcedOrderLedger:
    def __init__(self, order_id: str):
        self.order_id = order_id
        self.events = []

    def append_event(self, event_type: str, payload: dict):
        self.events.append({"type": event_type, "payload": payload})

    def replay_state(self) -> dict:
        state = {"order_id": self.order_id, "status": "INITIALIZED", "items": {}, "tracking_id": None}
        for ev in self.events:
            ev_type = ev["type"]
            if ev_type == "ORDER_CREATED":
                state["status"] = "CREATED"
                state["items"] = ev["payload"].get("items", {})
            elif ev_type == "INVENTORY_ALLOCATED":
                state["status"] = "ALLOCATED"
            elif ev_type == "SHIPPED":
                state["status"] = "IN_TRANSIT"
                state["tracking_id"] = ev["payload"].get("tracking_number")
            elif ev_type == "DELIVERED":
                state["status"] = "DELIVERED"
        return state

ledger = EventSourcedOrderLedger("ORD-55421")
ledger.append_event("ORDER_CREATED", {"items": {"SKU_LAPTOP": 1}})
ledger.append_event("INVENTORY_ALLOCATED", {"node": "FC_NEWARK"})
ledger.append_event("SHIPPED", {"carrier": "FEDEX", "tracking_number": "TRK-99882244"})
current_state = ledger.replay_state()
print(f"Event Sourcing: Order: {current_state['order_id']} | Status: {current_state['status']} | Tracking: {current_state['tracking_id']} | Event Count: {len(ledger.events)}")


print("\n=== PART 2: OPENTELEMETRY TRACE PROPAGATION ===")
class OpenTelemetryTracePropagator:
    def __init__(self):
        pass

    def create_span(self, trace_id: str, span_name: str, parent_span_id: str = None) -> dict:
        span_id = f"span_{span_name.lower()[:8]}"
        w3c_traceparent = f"00-{trace_id}-{span_id[:16].ljust(16, '0')}-01"
        return {
            "trace_id": trace_id,
            "span_id": span_id,
            "span_name": span_name,
            "parent_span_id": parent_span_id,
            "w3c_traceparent": w3c_traceparent,
            "trace_context_injected": True
        }

otel = OpenTelemetryTracePropagator()
root_span = otel.create_span(trace_id="4bf92f3577b34da6a3ce929d0e0e4736", span_name="checkout_submit")
child_span = otel.create_span(trace_id="4bf92f3577b34da6a3ce929d0e0e4736", span_name="dom_order_routing", parent_span_id=root_span["span_id"])
print(f"OTel Tracing: Trace: {child_span['trace_id'][:12]}... | Span: {child_span['span_name']} | Parent: {child_span['parent_span_id']} | W3C: {child_span['w3c_traceparent']}")


print("\n=== PART 3: CARRIER STATUS WEBHOOK NORMALIZATION ===")
class CarrierWebhookNormalizer:
    def __init__(self):
        self.code_mappings = {
            "FDX_PU": "PACKAGE_PICKED_UP",
            "FDX_IT": "IN_TRANSIT",
            "FDX_OD": "OUT_FOR_DELIVERY",
            "FDX_DL": "DELIVERED",
            "UPS_I": "IN_TRANSIT",
            "UPS_X": "DELIVERY_EXCEPTION",
            "UPS_D": "DELIVERED"
        }

    def normalize_event(self, carrier: str, raw_code: str, tracking_id: str) -> dict:
        canonical_status = self.code_mappings.get(f"{carrier}_{raw_code}", "UNKNOWN_STATUS")
        is_exception = "EXCEPTION" in canonical_status
        return {
            "carrier": carrier,
            "tracking_number": tracking_id,
            "raw_code": raw_code,
            "canonical_status": canonical_status,
            "exception_flag": is_exception,
            "downstream_topic": "orders.events.exception" if is_exception else "orders.events.tracking"
        }

normalizer = CarrierWebhookNormalizer()
norm_res = normalizer.normalize_event(carrier="UPS", raw_code="X", tracking_id="1Z9999999999999999")
print(f"Webhook Normalizer: Carrier: {norm_res['carrier']} | Raw: {norm_res['raw_code']} | Canonical: {norm_res['canonical_status']} | Target: {norm_res['downstream_topic']}")


print("\n=== PART 4: DYNAMIC DELIVERY ETA PREDICTOR ===")
class DynamicETAPredictor:
    def __init__(self):
        pass

    def compute_projected_eta(self, origin_zone: int, dest_zone: int, base_transit_days: int, weather_delay_days: int) -> dict:
        zone_delta = abs(dest_zone - origin_zone)
        transit_days = base_transit_days + (1 if zone_delta >= 4 else 0) + weather_delay_days
        confidence_pct = 95.0 if weather_delay_days == 0 else 82.5
        
        return {
            "origin_zone": origin_zone,
            "dest_zone": dest_zone,
            "projected_transit_days": transit_days,
            "confidence_pct": confidence_pct,
            "proactive_notification_needed": weather_delay_days > 0,
            "eta_message": f"Expected delivery in {transit_days} business days"
        }

eta_predictor = DynamicETAPredictor()
eta_res = eta_predictor.compute_projected_eta(origin_zone=2, dest_zone=7, base_transit_days=3, weather_delay_days=1)
print(f"ETA Predictor: Zones: {eta_res['origin_zone']}->{eta_res['dest_zone']} | Transit: {eta_res['projected_transit_days']} days | Confidence: {eta_res['confidence_pct']}% | Alert: {eta_res['proactive_notification_needed']}")


print("\n=== PART 5: POST-PURCHASE TELEMETRY COMMAND TOWER ===")
class PostPurchaseOperationsCommandTower:
    def __init__(self):
        pass

    def evaluate_telemetry_kpis(self, tracked_orders: int, on_time_delivery_pct: float, proactive_alert_pct: float, csat_score: float) -> dict:
        conforms = on_time_delivery_pct >= 96.0 and csat_score >= 4.5
        return {
            "command_tower": "POST_PURCHASE_APEX_TOWER",
            "active_orders_monitored": tracked_orders,
            "on_time_delivery_rate_pct": on_time_delivery_pct,
            "proactive_exception_coverage_pct": proactive_alert_pct,
            "customer_satisfaction_csat": csat_score,
            "operational_status": "EXEMPLARY_CUSTOMER_EXPERIENCE" if conforms else "OPERATIONAL_REVIEW",
            "support_ticket_reduction_usd": 1420000.0
        }

post_tower = PostPurchaseOperationsCommandTower()
tower_res = post_tower.evaluate_telemetry_kpis(tracked_orders=85000, on_time_delivery_pct=97.4, proactive_alert_pct=99.1, csat_score=4.82)
print(f"Post-Purchase Tower: Orders: {tower_res['active_orders_monitored']:,} | On-Time: {tower_res['on_time_delivery_rate_pct']}% | Proactive: {tower_res['proactive_exception_coverage_pct']}% | CSAT: {tower_res['customer_satisfaction_csat']}/5.0 | Savings: ${tower_res['support_ticket_reduction_usd']:,.2f}")
