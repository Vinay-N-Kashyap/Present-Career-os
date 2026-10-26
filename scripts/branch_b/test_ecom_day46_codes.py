"""
Test and generate deterministic outputs for Course 07 Day 46 (Marketplace Payment Gateways & Smart Routing)
"""
import json
import math
import time
from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, List, Optional, Tuple

print("=== PART 1: PAYMENT ORCHESTRATION LAYER (POL) ARCHITECTURE ===")
# Part 1 Code: Payment Orchestration Router abstraction and multi-gateway normalization

class PaymentMethodType(Enum):
    CREDIT_CARD = "credit_card"
    DEBIT_CARD = "debit_card"
    DIGITAL_WALLET = "digital_wallet"
    INSTANT_BANK = "instant_bank"

@dataclass
class PaymentRequest:
    transaction_id: str
    amount_cents: int
    currency: str
    method_type: PaymentMethodType
    card_brand: str
    country_iso: str
    is_recurring: bool

@dataclass
class GatewayConfig:
    gateway_id: str
    supported_currencies: List[str]
    supported_countries: List[str]
    fixed_fee_cents: int
    variable_fee_pct: float
    health_score: float # 0.0 to 1.0
    latency_ms: int

class PaymentOrchestrationLayer:
    def __init__(self):
        self.gateways: Dict[str, GatewayConfig] = {}

    def register_gateway(self, config: GatewayConfig):
        self.gateways[config.gateway_id] = config

    def estimate_processing_cost(self, gateway_id: str, amount_cents: int) -> int:
        gw = self.gateways[gateway_id]
        return gw.fixed_fee_cents + int(round(amount_cents * (gw.variable_fee_pct / 100.0)))

    def evaluate_eligible_gateways(self, req: PaymentRequest) -> List[Tuple[str, int, float]]:
        eligible = []
        for gid, gw in self.gateways.items():
            if req.currency in gw.supported_currencies and req.country_iso in gw.supported_countries:
                if gw.health_score >= 0.70:
                    cost = self.estimate_processing_cost(gid, req.amount_cents)
                    eligible.append((gid, cost, gw.health_score))
        return sorted(eligible, key=lambda x: (x[1], -x[2]))

pol = PaymentOrchestrationLayer()
pol.register_gateway(GatewayConfig("GATEWAY_STRIPE", ["USD", "EUR", "GBP"], ["US", "GB", "DE"], 30, 2.9, 0.99, 120))
pol.register_gateway(GatewayConfig("GATEWAY_ADYEN", ["USD", "EUR", "GBP", "JPY"], ["US", "GB", "DE", "FR", "JP"], 12, 1.8, 0.98, 145))
pol.register_gateway(GatewayConfig("GATEWAY_CHECKOUT", ["USD", "EUR"], ["US", "DE"], 20, 2.1, 0.95, 110))

req = PaymentRequest("TX-109482", 15000, "USD", PaymentMethodType.CREDIT_CARD, "VISA", "US", False)
eligible_routes = pol.evaluate_eligible_gateways(req)
top_gw = eligible_routes[0]

print(f"POL Inbound: Tx: {req.transaction_id} | Amount: ${req.amount_cents/100:.2f} {req.currency}")
print(f"Eligible Gateways Evaluated: {len(eligible_routes)}")
for gid, cost, health in eligible_routes:
    print(f"  Route: {gid:16} | Cost: ${cost/100:.2f} | Health: {health*100:.1f}%")
print(f"Selected Prime Gateway: {top_gw[0]} | Lowest Fee: ${top_gw[1]/100:.2f}")


print("\n=== PART 2: SMART TRANSACTION ROUTING & CASCADE LOGIC ===")
# Part 2 Code: Multi-dimensional routing score incorporating cost, authorization rate, and latency

@dataclass
class GatewayMetrics:
    gateway_id: str
    auth_rate_pct: float
    avg_latency_ms: float
    cost_basis_points: int # 1 bps = 0.01%

def calculate_smart_routing_score(
    metrics: GatewayMetrics, 
    auth_weight: float = 0.50, 
    cost_weight: float = 0.35, 
    latency_weight: float = 0.15
) -> float:
    # Normalize auth rate (higher is better: 80% to 100% -> 0.0 to 1.0)
    auth_norm = max(0.0, min(1.0, (metrics.auth_rate_pct - 80.0) / 20.0))
    # Normalize cost (lower is better: 100 bps to 350 bps -> 1.0 to 0.0)
    cost_norm = max(0.0, min(1.0, (350.0 - metrics.cost_basis_points) / 250.0))
    # Normalize latency (lower is better: 50ms to 450ms -> 1.0 to 0.0)
    latency_norm = max(0.0, min(1.0, (450.0 - metrics.avg_latency_ms) / 400.0))
    
    score = (auth_norm * auth_weight) + (cost_norm * cost_weight) + (latency_norm * latency_weight)
    return round(score * 100.0, 2)

gw_candidates = [
    GatewayMetrics("GW_GLOBAL_APEX", 96.5, 115.0, 195),
    GatewayMetrics("GW_LOW_COST_CLEAR", 91.2, 180.0, 135),
    GatewayMetrics("GW_ULTRA_FAST", 94.0, 65.0, 220),
    GatewayMetrics("GW_LEGACY_PROCESSOR", 88.5, 320.0, 280),
]

scored_routes = []
for gw in gw_candidates:
    s = calculate_smart_routing_score(gw)
    scored_routes.append((gw.gateway_id, s, gw.auth_rate_pct, gw.cost_basis_points, gw.avg_latency_ms))

scored_routes.sort(key=lambda x: x[1], reverse=True)

print("Smart Routing Leaderboard:")
for rank, (gid, score, auth, bps, lat) in enumerate(scored_routes, 1):
    print(f"  Rank {rank}: {gid:18} | Score: {score:5.2f}/100 | Auth: {auth}% | Cost: {bps}bps | Latency: {lat}ms")
primary_route = scored_routes[0][0]
secondary_route = scored_routes[1][0]
print(f"Optimal Cascade Sequence: 1st -> {primary_route} | Fallback -> {secondary_route}")


print("\n=== PART 3: EMVCo NETWORK TOKENIZATION & ACCOUNT UPDATER ===")
# Part 3 Code: Network Token provisioning, cryptogram generation, and Account Updater lifecycle

@dataclass
class NetworkToken:
    token_reference_id: str
    dpan_last4: str
    fpan_last4: str
    card_brand: str
    expiry_month: int
    expiry_year: int
    token_status: str
    par_id: str # Payment Account Reference

class TokenizationVault:
    def __init__(self):
        self.tokens: Dict[str, NetworkToken] = {}

    def provision_network_token(self, fpan_last4: str, brand: str, exp_m: int, exp_y: int) -> NetworkToken:
        token_id = f"TKN_EMV_{brand}_{fpan_last4}_998"
        par = f"PAR_{brand}_{abs(hash(fpan_last4 + str(exp_m))) % 10000000:08d}"
        token = NetworkToken(token_id, "4112", fpan_last4, brand, exp_m, exp_y, "ACTIVE", par)
        self.tokens[token_id] = token
        return token

    def process_account_updater_notification(self, token_id: str, new_exp_m: int, new_exp_y: int, reason: str) -> NetworkToken:
        token = self.tokens[token_id]
        token.expiry_month = new_exp_m
        token.expiry_year = new_exp_y
        return token

vault = TokenizationVault()
token = vault.provision_network_token("1842", "MASTERCARD", 11, 2026)
print(f"Network Token Provisioned: ID: {token.token_reference_id}")
print(f"DPAN Last4: {token.dpan_last4} | FPAN Last4: {token.fpan_last4} | PAR: {token.par_id}")
print(f"Initial Expiration: {token.expiry_month:02d}/{token.expiry_year} | Status: {token.token_status}")

updated_token = vault.process_account_updater_notification(token.token_reference_id, 11, 2030, "CARD_RENEWED")
print(f"Account Updater Lifecycle: Card Reissued -> New Expiration: {updated_token.expiry_month:02d}/{updated_token.expiry_year}")


print("\n=== PART 4: CIRCUIT BREAKER & CASCADING RETRY ENGINE ===")
# Part 4 Code: Resilient circuit breaker state machine for payment gateway endpoints

class CircuitState(Enum):
    CLOSED = "CLOSED"     # Normal operation
    OPEN = "OPEN"         # Gateway failing, traffic diverted immediately
    HALF_OPEN = "HALF_OPEN" # Testing recovery with limited traffic

class GatewayCircuitBreaker:
    def __init__(self, failure_threshold: int = 3, recovery_time_sec: float = 30.0):
        self.failure_threshold = failure_threshold
        self.recovery_time_sec = recovery_time_sec
        self.state = CircuitState.CLOSED
        self.failure_count = 0
        self.last_failure_time = 0.0

    def record_success(self):
        self.failure_count = 0
        self.state = CircuitState.CLOSED

    def record_failure(self, current_time: float):
        self.failure_count += 1
        self.last_failure_time = current_time
        if self.failure_count >= self.failure_threshold:
            self.state = CircuitState.OPEN

    def allow_request(self, current_time: float) -> bool:
        if self.state == CircuitState.CLOSED:
            return True
        elif self.state == CircuitState.OPEN:
            if current_time - self.last_failure_time >= self.recovery_time_sec:
                self.state = CircuitState.HALF_OPEN
                return True
            return False
        elif self.state == CircuitState.HALF_OPEN:
            return True
        return False

cb = GatewayCircuitBreaker(failure_threshold=3, recovery_time_sec=20.0)
sim_time = 100.0

print(f"Initial Circuit State: {cb.state.value} | Failures: {cb.failure_count}")
# Simulate consecutive gateway network drops
cb.record_failure(sim_time + 1.0)
cb.record_failure(sim_time + 2.0)
cb.record_failure(sim_time + 3.0)
print(f"After 3 Consecutive Timeouts -> State: {cb.state.value} (Traffic Diverted)")

# Test immediate subsequent call
allowed = cb.allow_request(sim_time + 5.0)
print(f"Immediate Call at t+5s: Allowed={allowed} -> Trigger Automated Fallback Gateway")

# Fast forward beyond recovery time
probe_allowed = cb.allow_request(sim_time + 25.0)
print(f"Probe Call at t+25s: Allowed={probe_allowed} -> State: {cb.state.value} (Canary Recovery)")
cb.record_success()
print(f"Canary Succeeded -> Reset State: {cb.state.value}")


print("\n=== PART 5: PAYMENT ORCHESTRATION COMMAND TOWER AUDIT ===")
# Part 5 Code: Enterprise Payment Orchestration Command Tower metric aggregation

@dataclass
class PaymentFleetMetrics:
    total_volume_cents: int
    total_transactions: int
    authorized_transactions: int
    interchange_saved_cents: int
    cascaded_recoveries: int
    chargeback_count: int

def compile_payment_tower_audit(metrics: PaymentFleetMetrics) -> Dict[str, float]:
    auth_rate = (metrics.authorized_transactions / metrics.total_transactions) * 100.0
    cascade_recovery_pct = (metrics.cascaded_recoveries / metrics.total_transactions) * 100.0
    chargeback_rate = (metrics.chargeback_count / metrics.total_transactions) * 100.0
    volume_usd = metrics.total_volume_cents / 100.0
    interchange_savings_usd = metrics.interchange_saved_cents / 100.0
    
    score = 0.0
    score += min(30.0, (auth_rate / 98.0) * 30.0)
    score += min(25.0, (cascade_recovery_pct / 4.0) * 25.0)
    score += min(25.0, (interchange_savings_usd / 2000000.0) * 25.0)
    score += 20.0 if chargeback_rate < 0.65 else 0.0
    
    return {
        "auth_rate_pct": round(auth_rate, 2),
        "cascade_recovery_pct": round(cascade_recovery_pct, 2),
        "chargeback_rate_pct": round(chargeback_rate, 3),
        "volume_usd": volume_usd,
        "interchange_savings_usd": interchange_savings_usd,
        "composite_score": round(score, 2),
        "status": "APEX_PAYMENT_ORCHESTRATION_CERTIFIED" if score >= 90.0 else "SUBOPTIMAL"
    }

fleet = PaymentFleetMetrics(
    total_volume_cents=125_000_000_00, # $125M USD
    total_transactions=1_850_000,
    authorized_transactions=1_801_900,
    interchange_saved_cents=2_450_000_00, # $2.45M saved
    cascaded_recoveries=79_550,
    chargeback_count=4_625
)

audit = compile_payment_tower_audit(fleet)
print(f"Payment Fleet Audited: Total Volume: ${audit['volume_usd']:,.2f}")
print(f"Authorization Rate: {audit['auth_rate_pct']}% (Target >= 97.0%)")
print(f"Cascaded Failure Recoveries: {audit['cascade_recovery_pct']}% of transactions")
print(f"Network Token Interchange Savings: ${audit['interchange_savings_usd']:,.2f}")
print(f"Chargeback Rate: {audit['chargeback_rate_pct']}% (Card Scheme Ceiling: 0.90%)")
print(f"Composite Architecture Score: {audit['composite_score']}/100.0 pts")
print(f"Governance Accreditation: [{audit['status']}]")
