"""
Test and generate deterministic outputs for Course 07 Day 51 (Global Cross-Border E-Commerce, Multi-Currency Pricing & FX Hedging)
"""
import json
import math
import time
from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, List, Optional, Tuple

print("=== PART 1: CROSS-BORDER LOCAL PAYMENT METHOD (LPM) MATRIX ===")
# Part 1 Code: Regional payment method catalog and local clearing route selector

@dataclass
class LocalPaymentMethod:
    method_id: str
    country_iso: str
    currency: str
    local_market_share_pct: float
    fixed_fee_cents: int
    variable_fee_pct: float
    settlement_type: str # INSTANT_ACCOUNT, DEFERRED_DEBIT, WALLET

class RegionalPaymentRouter:
    def __init__(self):
        self.methods: Dict[str, List[LocalPaymentMethod]] = {}

    def register_method(self, method: LocalPaymentMethod):
        self.methods.setdefault(method.country_iso, []).append(method)

    def get_ranked_regional_methods(self, country_iso: str) -> List[LocalPaymentMethod]:
        available = self.methods.get(country_iso, [])
        return sorted(available, key=lambda m: m.local_market_share_pct, reverse=True)

router = RegionalPaymentRouter()
router.register_method(LocalPaymentMethod("IDEAL", "NL", "EUR", 68.5, 25, 0.35, "INSTANT_ACCOUNT"))
router.register_method(LocalPaymentMethod("MASTERCARD_LOCAL", "NL", "EUR", 18.2, 15, 1.40, "CARD"))
router.register_method(LocalPaymentMethod("PIX", "BR", "BRL", 74.0, 10, 0.95, "INSTANT_ACCOUNT"))
router.register_method(LocalPaymentMethod("BOLETO_BANCARIO", "BR", "BRL", 14.5, 30, 1.80, "DEFERRED_DEBIT"))

nl_ranked = router.get_ranked_regional_methods("NL")
br_ranked = router.get_ranked_regional_methods("BR")

print(f"Netherlands (NL) Preferred Local Rails: Top Method: {nl_ranked[0].method_id} ({nl_ranked[0].local_market_share_pct}% share)")
print(f"Brazil (BR) Preferred Local Rails:      Top Method: {br_ranked[0].method_id} ({br_ranked[0].local_market_share_pct}% share)")


print("\n=== PART 2: MULTI-CURRENCY PRICING & DYNAMIC FX BUFFER ENGINE ===")
# Part 2 Code: Multi-currency converter with volatility buffers and psychological rounding

@dataclass
class FXRateRecord:
    currency_pair: str # e.g. USD/EUR
    spot_rate: float
    volatility_buffer_pct: float # e.g. 1.5%
    lock_window_seconds: int

class MultiCurrencyPricingEngine:
    def __init__(self):
        self.rates: Dict[str, FXRateRecord] = {}

    def register_rate(self, record: FXRateRecord):
        self.rates[record.currency_pair] = record

    def convert_and_round_price(self, base_price_usd_cents: int, target_currency: str) -> Tuple[int, float]:
        pair = f"USD/{target_currency}"
        rec = self.rates[pair]
        # Effective conversion rate including protective FX buffer
        effective_rate = rec.spot_rate * (1.0 + (rec.volatility_buffer_pct / 100.0))
        raw_target_cents = (base_price_usd_cents / 100.0) * effective_rate * 100.0
        
        # Psychological rounding (.99 rule)
        target_units = int(math.floor(raw_target_cents / 100.0))
        rounded_target_cents = (target_units * 100) + 99
        return rounded_target_cents, effective_rate

pricing = MultiCurrencyPricingEngine()
pricing.register_rate(FXRateRecord("USD/EUR", 0.9250, 1.5, 3600))
pricing.register_rate(FXRateRecord("USD/GBP", 0.7820, 1.8, 3600))
pricing.register_rate(FXRateRecord("USD/JPY", 154.20, 2.0, 1800))

base_usd = 12900 # $129.00 USD
eur_cents, eur_eff = pricing.convert_and_round_price(base_usd, "EUR")
gbp_cents, gbp_eff = pricing.convert_and_round_price(base_usd, "GBP")
jpy_cents, jpy_eff = pricing.convert_and_round_price(base_usd, "JPY")

print(f"Base Storefront Price: $129.00 USD")
print(f"  Converted EUR: EUR {eur_cents/100:.2f} (Eff Rate: {eur_eff:.4f})")
print(f"  Converted GBP: GBP {gbp_cents/100:.2f} (Eff Rate: {gbp_eff:.4f})")
print(f"  Converted JPY: JPY {jpy_cents/100:,.2f} (Eff Rate: {jpy_eff:.4f})")


print("\n=== PART 3: TREASURY FX HEDGING & FORWARD CONTRACT SIMULATOR ===")
# Part 3 Code: Rolling forward hedging contract simulator mitigating currency settlement slippage

@dataclass
class TreasuryForwardContract:
    contract_id: str
    currency_pair: str
    notional_target_amount: float
    forward_locked_rate: float
    expiration_day: int
    is_settled: bool

class TreasuryFXHedgeManager:
    def __init__(self):
        self.contracts: List[TreasuryForwardContract] = []

    def open_hedge(self, pair: str, notional: float, locked_rate: float, expire_day: int) -> TreasuryForwardContract:
        contract = TreasuryForwardContract(f"HEDGE-{len(self.contracts)+1}", pair, notional, locked_rate, expire_day, False)
        self.contracts.append(contract)
        return contract

    def evaluate_settlement_pnl(self, contract_id: str, spot_rate_at_settlement: float) -> Tuple[float, str]:
        c = next(c for c in self.contracts if c.contract_id == contract_id)
        # Value locked vs spot
        locked_value_usd = c.notional_target_amount / c.forward_locked_rate
        spot_value_usd = c.notional_target_amount / spot_rate_at_settlement
        pnl_usd = locked_value_usd - spot_value_usd
        c.is_settled = True
        verdict = "HEDGE_GAIN_PROTECTED_MARGIN" if pnl_usd >= 0 else "HEDGE_OPPORTUNITY_COST"
        return round(pnl_usd, 2), verdict

treasury = TreasuryFXHedgeManager()
hedge = treasury.open_hedge("USD/EUR", 500_000.0, 0.9200, 30)

# Simulate EUR depreciating against USD to 0.9500 (1 EUR = $1.052 instead of $1.086)
pnl, outcome = treasury.evaluate_settlement_pnl(hedge.contract_id, spot_rate_at_settlement=0.9500)
print(f"Treasury Forward Contract: ID: {hedge.contract_id} | Notional: EUR {hedge.notional_target_amount:,.2f}")
print(f"Forward Rate: {hedge.forward_locked_rate:.4f} vs Settlement Spot: 0.9500")
print(f"Hedging Net P&L: +${pnl:,.2f} USD | Outcome: [{outcome}]")


print("\n=== PART 4: LOCALIZED CHECKOUT & GUARANTEED QUOTE LOCK ===")
# Part 4 Code: Guaranteed FX quote lock session manager tracking rate guarantee expirations

@dataclass
class CheckoutQuoteSession:
    session_id: str
    currency: str
    guaranteed_rate: float
    expires_at_sec: int
    is_expired: bool

class GuaranteedQuoteManager:
    def __init__(self, quote_duration_sec: int = 900): # 15 minutes guaranteed
        self.quote_duration_sec = quote_duration_sec
        self.quotes: Dict[str, CheckoutQuoteSession] = {}

    def lock_quote(self, session_id: str, currency: str, rate: float, current_time: int) -> CheckoutQuoteSession:
        quote = CheckoutQuoteSession(session_id, currency, rate, current_time + self.quote_duration_sec, False)
        self.quotes[session_id] = quote
        return quote

    def validate_quote(self, session_id: str, current_time: int) -> Tuple[bool, str]:
        quote = self.quotes.get(session_id)
        if not quote:
            return False, "QUOTE_NOT_FOUND"
        if current_time > quote.expires_at_sec:
            quote.is_expired = True
            return False, "QUOTE_EXPIRED_REFRESH_REQUIRED"
        return True, "QUOTE_VALID_PROCEED_TO_AUTH"

quote_mgr = GuaranteedQuoteManager(quote_duration_sec=900)
base_time = 10000
q = quote_mgr.lock_quote("SES-88219", "EUR", 0.9388, base_time)

valid_t5m, msg_t5m = quote_mgr.validate_quote("SES-88219", base_time + 300)
valid_t20m, msg_t20m = quote_mgr.validate_quote("SES-88219", base_time + 1200)

print(f"Quote Lock Session: {q.session_id} | Guaranteed EUR Rate: {q.guaranteed_rate}")
print(f"Validation at +5 min:  Valid={valid_t5m} | Status: [{msg_t5m}]")
print(f"Validation at +20 min: Valid={valid_t20m} | Status: [{msg_t20m}]")


print("\n=== PART 5: ENTERPRISE GLOBAL CHECKOUT COMMAND TOWER ===")
# Part 5 Code: Global checkout command tower aggregating international conversion and FX margins

@dataclass
class GlobalCheckoutFleetMetrics:
    total_international_volume_usd: float
    cross_border_conversion_rate_pct: float
    lpm_share_of_international_gmv_pct: float
    treasury_fx_slippage_bps: float # Target < 10 bps
    fx_buffer_margin_captured_usd: float

def audit_global_checkout_tower(m: GlobalCheckoutFleetMetrics) -> Dict[str, float]:
    score = 0.0
    score += min(35.0, (m.cross_border_conversion_rate_pct / 3.8) * 35.0)
    score += min(35.0, (m.lpm_share_of_international_gmv_pct / 65.0) * 35.0)
    score += 30.0 if m.treasury_fx_slippage_bps <= 8.0 else 15.0
    
    return {
        "intl_volume_usd": m.total_international_volume_usd,
        "conversion_pct": m.cross_border_conversion_rate_pct,
        "lpm_share_pct": m.lpm_share_of_international_gmv_pct,
        "slippage_bps": m.treasury_fx_slippage_bps,
        "fx_margin_captured_usd": m.fx_buffer_margin_captured_usd,
        "composite_score": round(score, 2),
        "status": "APEX_GLOBAL_CHECKOUT_CERTIFIED" if score >= 90.0 else "SUBOPTIMAL"
    }

fleet = GlobalCheckoutFleetMetrics(
    total_international_volume_usd=48_000_000.0,
    cross_border_conversion_rate_pct=4.12,
    lpm_share_of_international_gmv_pct=72.5,
    treasury_fx_slippage_bps=4.2,
    fx_buffer_margin_captured_usd=720_000.0
)

audit = audit_global_checkout_tower(fleet)
print(f"Global Checkout Fleet Audited: International Volume: ${audit['intl_volume_usd']:,.2f}")
print(f"Cross-Border Conversion Rate:  {audit['conversion_pct']}% (Target >= 3.8%)")
print(f"Local Payment Method Share:    {audit['lpm_share_pct']}% of global sales")
print(f"Treasury FX Settlement Drift:  {audit['slippage_bps']} bps (Target <= 8.0 bps)")
print(f"Captured FX Buffer Margin:     ${audit['fx_margin_captured_usd']:,.2f}")
print(f"Composite Architecture Score:  {audit['composite_score']}/100.0 pts")
print(f"Accreditation Status:          [{audit['status']}]")
