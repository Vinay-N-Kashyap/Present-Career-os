class EnterprisePrivacyAdEngine:
    def __init__(self, brand_name: str, epsilon_budget: float):
        self.brand = brand_name
        self.epsilon_budget = epsilon_budget
        self.consumed_epsilon = 0.0
        self.event_log: list[str] = []

    def process_incoming_event(self, event: dict) -> dict:
        has_consent = event.get("consent_granted", False)
        user_id = event.get("raw_user_id", "")
        
        if has_consent:
            # Hash identifier using SHA-256 for privacy-safe server-side CAPI dispatch
            import hashlib
            hashed_id = hashlib.sha256(user_id.encode("utf-8")).hexdigest()
            self.event_log.append(f"CAPI_DISPATCH: Consented conversion hashed -> {hashed_id[:16]}... dispatched via Server CAPI")
            return {"status": "DISPATCHED_SERVER_CAPI", "hashed_id": hashed_id, "amount": event.get("amount", 0.0)}
        else:
            self.event_log.append("CONSENT_DENIED: Routed to anonymous aggregate modeling pipeline")
            return {"status": "ROUTED_ANONYMOUS_MODELING", "hashed_id": "NONE", "amount": event.get("amount", 0.0)}

    def execute_private_clean_room_query(self, total_revenue: float, query_epsilon: float = 0.5) -> dict:
        if self.consumed_epsilon + query_epsilon > self.epsilon_budget:
            return {"status": "BLOCKED_EPSILON_EXHAUSTED"}
        
        # Add Laplace noise with sensitivity = $1000
        import random, math
        sensitivity = 1000.0
        scale = sensitivity / query_epsilon
        u = random.random() - 0.5
        noise = -scale * math.copysign(1.0, u) * math.log(1.0 - 2.0 * abs(u))
        
        noisy_revenue = max(0.0, round(total_revenue + noise, 2))
        self.consumed_epsilon += query_epsilon

        return {
            "status": "CLEAN_ROOM_QUERY_SUCCESS",
            "true_revenue": total_revenue,
            "differentially_private_revenue": noisy_revenue,
            "consumed_epsilon": round(self.consumed_epsilon, 2),
            "remaining_epsilon": round(self.epsilon_budget - self.consumed_epsilon, 2)
        }

import random
random.seed(42)
engine = EnterprisePrivacyAdEngine(brand_name="Sovereign Retail Global", epsilon_budget=2.0)

events = [
    {"raw_user_id": "sarah.connor@cyber.com", "amount": 145.0, "consent_granted": True},
    {"raw_user_id": "john.doe@unknown.net", "amount": 89.0, "consent_granted": False},
    {"raw_user_id": "elena.rostova@global.eu", "amount": 320.0, "consent_granted": True}
]

print("=== ENTERPRISE PRIVACY-FIRST AD ENGINE AUDIT ===")
for ev in events:
    res = engine.process_incoming_event(ev)
    print(f"User '{ev['raw_user_id']}': Action = {res['status']} | Amount = ${res['amount']}")

print()
clean_room_res = engine.execute_private_clean_room_query(total_revenue=250000.0, query_epsilon=0.5)
print("Clean Room Differential Privacy Result:")
print(f"  True Attributed Revenue: ${clean_room_res['true_revenue']:,.2f}")
print(f"  DP Clean Room Revenue:   ${clean_room_res['differentially_private_revenue']:,.2f}")
print(f"  Epsilon Budget Consumed: {clean_room_res['consumed_epsilon']} / {engine.epsilon_budget} (Remaining: {clean_room_res['remaining_epsilon']})")
print()
print("Engine Event Telemetry Trail:")
for log in engine.event_log:
    print(f"  [TELEMETRY] {log}")
