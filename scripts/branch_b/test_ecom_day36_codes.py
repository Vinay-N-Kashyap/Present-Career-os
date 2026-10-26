# -*- coding: utf-8 -*-
"""
Deterministic Python test suite for Course 07: bcom_ecom Day 36
Global Multi-Region Payment Gateway Orchestration
"""
import sys
sys.stdout.reconfigure(encoding='utf-8')

print("=== PART 1: SMART PAYMENT ROUTING & CASCADE FALLBACK ===")
class SmartPaymentRouter:
    def __init__(self):
        self.gateways = {
            "ADYEN_GLOBAL": {"priority": 1, "fee_bps": 12, "healthy": True, "auth_rate": 0.94},
            "STRIPE_ENTERPRISE": {"priority": 2, "fee_bps": 18, "healthy": True, "auth_rate": 0.96},
            "CHASE_PAYMENTECH": {"priority": 3, "fee_bps": 10, "healthy": False, "auth_rate": 0.88} # simulated outage
        }

    def route_transaction(self, bin_country: str, amount_usd: float) -> dict:
        sorted_gateways = sorted(
            [g for g in self.gateways.items() if g[1]["healthy"]],
            key=lambda x: (x[1]["priority"], x[1]["fee_bps"])
        )
        
        attempt_log = []
        for name, config in sorted_gateways:
            # Simulate primary gateway transient timeout on specific amounts
            if name == "ADYEN_GLOBAL" and amount_usd > 1000.0:
                attempt_log.append({"gateway": name, "status": "SOFT_DECLINE_TIMEOUT", "retry_eligible": True})
                continue # Cascade to secondary gateway
            
            fee = round(amount_usd * (config["fee_bps"] / 10000.0), 4)
            attempt_log.append({"gateway": name, "status": "AUTHORIZED", "fee_charged": fee})
            return {
                "transaction_status": "SUCCESS",
                "final_gateway": name,
                "fee_usd": fee,
                "attempts": attempt_log,
                "cascaded": len(attempt_log) > 1
            }
        
        return {"transaction_status": "FAILED", "attempts": attempt_log}

router = SmartPaymentRouter()
tx1 = router.route_transaction(bin_country="US", amount_usd=450.0)
tx2 = router.route_transaction(bin_country="US", amount_usd=1250.0)

print(f"TX 1: {tx1['final_gateway']} | Fee: ${tx1['fee_usd']} | Cascaded: {tx1['cascaded']}")
print(f"TX 2: {tx2['final_gateway']} | Fee: ${tx2['fee_usd']} | Cascaded: {tx2['cascaded']}")
print(f"  TX 2 Cascade Trail: {[a['gateway'] + '->' + a['status'] for a in tx2['attempts']]}")


print("\n=== PART 2: DYNAMIC 3DS2 & SCA EXEMPTION ENGINE ===")
class Dynamic3DS2Engine:
    def __init__(self, merchant_fraud_rate_bps: int = 8):
        self.merchant_fraud_rate_bps = merchant_fraud_rate_bps # 0.08% fraud rate

    def evaluate_sca_requirement(self, amount_eur: float, trusted_merchant: bool, risk_score: float) -> dict:
        # Rule 1: Low-value exemption (< 30 EUR)
        if amount_eur < 30.0:
            return {"flow": "FRICTIONLESS", "exemption_type": "LOW_VALUE_TRANSACTION", "challenge_required": False}
        
        # Rule 2: Trusted Beneficiary exemption (Whitelisted Merchant)
        if trusted_merchant and risk_score < 0.20:
            return {"flow": "FRICTIONLESS", "exemption_type": "TRUSTED_BENEFICIARY", "challenge_required": False}
        
        # Rule 3: Transaction Risk Analysis (TRA) exemption based on acquirer fraud rate (< 100 EUR if fraud < 13 bps)
        if amount_eur <= 100.0 and self.merchant_fraud_rate_bps < 13 and risk_score < 0.30:
            return {"flow": "FRICTIONLESS", "exemption_type": "TRANSACTION_RISK_ANALYSIS", "challenge_required": False}
        
        # Default: Step-up authentication challenge required (Biometric / OTP)
        return {"flow": "CHALLENGE_STEP_UP", "exemption_type": "NONE", "challenge_required": True, "auth_mechanism": "FIDO2_WEBAUTHN"}

sca_engine = Dynamic3DS2Engine(merchant_fraud_rate_bps=8)
e1 = sca_engine.evaluate_sca_requirement(amount_eur=24.50, trusted_merchant=False, risk_score=0.15)
e2 = sca_engine.evaluate_sca_requirement(amount_eur=85.00, trusted_merchant=True, risk_score=0.10)
e3 = sca_engine.evaluate_sca_requirement(amount_eur=450.00, trusted_merchant=False, risk_score=0.65)

print(f"Evaluation 1: {e1['flow']} | Exemption: {e1['exemption_type']}")
print(f"Evaluation 2: {e2['flow']} | Exemption: {e2['exemption_type']}")
print(f"Evaluation 3: {e3['flow']} | Exemption: {e3['exemption_type']} | Challenge: {e3['challenge_required']}")


print("\n=== PART 3: NETWORK TOKENIZATION & CRYPTOGRAM VAULT ===")
class NetworkTokenVault:
    def __init__(self):
        self.vault = {}

    def tokenize_pan(self, pan_last4: str, card_brand: str) -> dict:
        token_id = f"NET-TOK-{card_brand[:4]}-{pan_last4}-9902"
        cryptogram = f"AQEBAQEBA{card_brand[:2]}0249F892B" # Simulated TAVV cryptogram
        self.vault[token_id] = {
            "brand": card_brand,
            "pan_last4": pan_last4,
            "token_status": "ACTIVE",
            "pci_dss_scope": "SAQ_A_OUT_OF_SCOPE"
        }
        return {
            "network_token": token_id,
            "eci_indicator": "05", # Fully authenticated network token
            "cryptogram_cavv": cryptogram,
            "pci_compliance": "SAQ_A_MERCHANT_ZERO_CARD_STORAGE"
        }

vault = NetworkTokenVault()
tok = vault.tokenize_pan(pan_last4="4242", card_brand="VISA")
print(f"Network Token:       {tok['network_token']}")
print(f"ECI Indicator:       {tok['eci_indicator']} (Full Liability Shift)")
print(f"Dynamic Cryptogram:  {tok['cryptogram_cavv']}")
print(f"PCI-DSS Governance:  {tok['pci_compliance']}")


print("\n=== PART 4: MULTI-CURRENCY SETTLEMENT & REAL-TIME FX LEDGER ===")
class MultiCurrencySettlementEngine:
    def __init__(self):
        self.fx_rates = {"EUR_TO_USD": 1.0850, "GBP_TO_USD": 1.2750, "JPY_TO_USD": 0.0065}
        self.settlement_accounts = {"USD": 0.0, "EUR": 0.0, "GBP": 0.0}

    def process_international_settlement(self, local_currency: str, amount_local: float, settle_currency: str) -> dict:
        if local_currency == settle_currency:
            converted_amount = amount_local
            fx_rate = 1.0
        else:
            fx_pair = f"{local_currency}_TO_{settle_currency}"
            fx_rate = self.fx_rates.get(fx_pair, 1.0)
            converted_amount = round(amount_local * fx_rate, 2)
            
        # Cross-border interchange cost: 0.8% domestic vs 1.6% cross-border
        is_cross_border = local_currency != settle_currency
        scheme_fee_pct = 0.016 if is_cross_border else 0.008
        scheme_fee = round(converted_amount * scheme_fee_pct, 2)
        net_settled = round(converted_amount - scheme_fee, 2)
        
        self.settlement_accounts[settle_currency] += net_settled
        
        return {
            "source_amount": amount_local,
            "source_currency": local_currency,
            "target_currency": settle_currency,
            "effective_fx_rate": fx_rate,
            "gross_settled": converted_amount,
            "card_scheme_interchange": scheme_fee,
            "net_settled_funds": net_settled
        }

fx_engine = MultiCurrencySettlementEngine()
s1 = fx_engine.process_international_settlement("EUR", 1000.0, "USD")
s2 = fx_engine.process_international_settlement("USD", 500.0, "USD")

print(f"EUR Sale: Gross ${s1['gross_settled']} USD | Interchange: ${s1['card_scheme_interchange']} | Net: ${s1['net_settled_funds']}")
print(f"USD Sale: Gross ${s2['gross_settled']} USD | Interchange: ${s2['card_scheme_interchange']} | Net: ${s2['net_settled_funds']}")
print(f"Settlement Account USD Balance: ${fx_engine.settlement_accounts['USD']:,.2f}")


print("\n=== PART 5: ENTERPRISE GLOBAL PAYMENT ORCHESTRATION ENGINE ===")
class EnterpriseGlobalPaymentOrchestrator:
    def __init__(self):
        self.router = SmartPaymentRouter()
        self.sca_engine = Dynamic3DS2Engine()
        self.vault = NetworkTokenVault()
        self.fx_engine = MultiCurrencySettlementEngine()
        self.audit_log = []

    def execute_payment_pipeline(self, order_id: str, amount_local: float, currency: str, card_brand: str, pan_last4: str) -> dict:
        # Step 1: Network Tokenization
        token_res = self.vault.tokenize_pan(pan_last4, card_brand)
        
        # Step 2: 3DS2 SCA Dynamic Risk Evaluation
        amount_eur = amount_local if currency == "EUR" else round(amount_local * 0.92, 2)
        sca_res = self.sca_engine.evaluate_sca_requirement(amount_eur, trusted_merchant=True, risk_score=0.12)
        
        # Step 3: Smart Gateway Routing & Cascading
        route_res = self.router.route_transaction(bin_country="US", amount_usd=amount_local)
        
        # Step 4: Multi-Currency Settlement
        settle_res = self.fx_engine.process_international_settlement(currency, amount_local, "USD")
        
        record = {
            "order_id": order_id,
            "status": "SETTLED_SUCCESS",
            "token": token_res["network_token"],
            "sca_flow": sca_res["flow"],
            "gateway": route_res["final_gateway"],
            "net_usd": settle_res["net_settled_funds"]
        }
        self.audit_log.append(record)
        return record

orchestrator = EnterpriseGlobalPaymentOrchestrator()
tx_exec = orchestrator.execute_payment_pipeline("ORD-8821", 850.0, "EUR", "MASTERCARD", "5512")
print(f"Order:       {tx_exec['order_id']}")
print(f"Status:      {tx_exec['status']}")
print(f"Token:       {tx_exec['token']}")
print(f"SCA Flow:    {tx_exec['sca_flow']}")
print(f"Acquirer:    {tx_exec['gateway']}")
print(f"Net Settled: ${tx_exec['net_usd']} USD")
