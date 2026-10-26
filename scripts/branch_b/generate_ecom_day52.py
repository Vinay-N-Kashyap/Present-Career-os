"""
Generate Day 52 for Course 07 (bcom_ecom):
Title: International Trade Compliance, Landed Cost Calculation & Customs Automation
"""
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

commerce_dir = r"C:\Users\Admin\Desktop\projects\Present-Career-os-commerce"

p1_code = '''from dataclasses import dataclass

@dataclass
class LineItemValuation:
    sku: str
    hs_code: str
    item_price_usd_cents: int
    quantity: int
    weight_kg: float
    duty_rate_pct: float
    import_vat_pct: float

@dataclass
class LandedCostBreakdown:
    subtotal_cents: int
    allocated_freight_cents: int
    insurance_cents: int
    cif_value_cents: int
    customs_duty_cents: int
    import_vat_cents: int
    brokerage_disbursement_cents: int
    total_landed_cost_cents: int

class LandedCostEngine:
    def calculate_item_landed_cost(
        self, 
        item: LineItemValuation, 
        freight_per_kg_cents: int = 450, 
        insurance_rate_pct: float = 0.50,
        flat_brokerage_cents: int = 1500
    ) -> LandedCostBreakdown:
        subtotal = item.item_price_usd_cents * item.quantity
        freight = int(round(item.weight_kg * item.quantity * freight_per_kg_cents))
        insurance = int(round(subtotal * (insurance_rate_pct / 100.0)))
        cif_value = subtotal + freight + insurance
        duty = int(round(cif_value * (item.duty_rate_pct / 100.0)))
        taxable_base = cif_value + duty
        vat = int(round(taxable_base * (item.import_vat_pct / 100.0)))
        total = subtotal + freight + insurance + duty + vat + flat_brokerage_cents
        return LandedCostBreakdown(subtotal, freight, insurance, cif_value, duty, vat, flat_brokerage_cents, total)

engine = LandedCostEngine()
item = LineItemValuation("LEATHER_BOOTS", "6403.91.00", 18000, 1, 1.8, 8.0, 20.0)
cost = engine.calculate_item_landed_cost(item)

print(f"Landed Cost Analysis: SKU: {item.sku} (HS: {item.hs_code})")
print(f"  Merchandise Subtotal:    ${cost.subtotal_cents/100:.2f} USD")
print(f"  Freight & Insurance:     ${(cost.allocated_freight_cents + cost.insurance_cents)/100:.2f} USD")
print(f"  CIF Valuation:           ${cost.cif_value_cents/100:.2f} USD")
print(f"  Customs Duty (8.0%):     ${cost.customs_duty_cents/100:.2f} USD")
print(f"  Import VAT (20.0%):      ${cost.import_vat_cents/100:.2f} USD")
print(f"  Carrier Brokerage Fee:   ${cost.brokerage_disbursement_cents/100:.2f} USD")
print(f"  Total Fully Landed Cost: ${cost.total_landed_cost_cents/100:.2f} USD")'''

p1_output = '''Landed Cost Analysis: SKU: LEATHER_BOOTS (HS: 6403.91.00)
  Merchandise Subtotal:    $180.00 USD
  Freight & Insurance:     $9.00 USD
  CIF Valuation:           $189.00 USD
  Customs Duty (8.0%):     $15.12 USD
  Import VAT (20.0%):      $40.82 USD
  Carrier Brokerage Fee:   $15.00 USD
  Total Fully Landed Cost: $259.94 USD'''

p2_code = '''from dataclasses import dataclass
from typing import Dict, Optional, Tuple

@dataclass
class NationalTariffLine:
    full_hts_code: str
    country_iso: str
    description: str
    general_duty_rate_pct: float
    preferential_trade_agreement: Optional[str]
    preferential_duty_rate_pct: Optional[float]

class HTSClassificationRegistry:
    def __init__(self):
        self.tariffs: Dict[Tuple[str, str], NationalTariffLine] = {}

    def register_tariff(self, line: NationalTariffLine):
        self.tariffs[(line.country_iso, line.full_hts_code)] = line

    def resolve_applicable_duty(self, country_iso: str, hts_code: str, origin_country_iso: str) -> Tuple[float, str]:
        line = self.tariffs.get((country_iso, hts_code))
        if not line:
            return 10.0, "DEFAULT_STATUTORY_TARIFF"
        if line.preferential_trade_agreement and origin_country_iso == "MX" and country_iso == "US":
            return line.preferential_duty_rate_pct, f"QUALIFIED_PREFERENTIAL_{line.preferential_trade_agreement}"
        return line.general_duty_rate_pct, "GENERAL_MFN_DUTY_RATE"

registry = HTSClassificationRegistry()
registry.register_tariff(NationalTariffLine("6109.10.00.12", "US", "Cotton T-Shirts, Men's Knitted", 16.5, "USMCA", 0.0))
registry.register_tariff(NationalTariffLine("8517.13.00.00", "US", "Smartphones & Cellular Transceivers", 0.0, "ITA_AGREEMENT", 0.0))

duty_mfn, regime_mfn = registry.resolve_applicable_duty("US", "6109.10.00.12", "VN")
duty_usmca, regime_usmca = registry.resolve_applicable_duty("US", "6109.10.00.12", "MX")

print(f"HTS: 6109.10.00.12 (Vietnam Origin): Duty: {duty_mfn}% | Regime: [{regime_mfn}]")
print(f"HTS: 6109.10.00.12 (Mexico Origin):  Duty: {duty_usmca}% | Regime: [{regime_usmca}]")'''

p2_output = '''HTS: 6109.10.00.12 (Vietnam Origin): Duty: 16.5% | Regime: [GENERAL_MFN_DUTY_RATE]
HTS: 6109.10.00.12 (Mexico Origin):  Duty: 0.0% | Regime: [QUALIFIED_PREFERENTIAL_USMCA]'''

p3_code = '''from dataclasses import dataclass

@dataclass
class IncotermQuote:
    shipping_incoterm: str
    upfront_collected_duties_cents: int
    upfront_collected_taxes_cents: int
    doorstep_delivery_surprise_fee_cents: int
    customer_experience_risk: str

def evaluate_incoterm_strategy(allow_dap: bool, customs_duty: int, import_vat: int) -> IncotermQuote:
    if not allow_dap:
        return IncotermQuote("DDP", customs_duty, import_vat, 0, "ZERO_DOORSTEP_FRICTION")
    else:
        return IncotermQuote("DAP", 0, 0, customs_duty + import_vat + 1500, "HIGH_RETURN_REFUSAL_RISK")

quote_ddp = evaluate_incoterm_strategy(False, 1512, 4082)
quote_dap = evaluate_incoterm_strategy(True, 1512, 4082)

print(f"Strategy DDP (Recommended): Upfront Duty/Tax: ${(quote_ddp.upfront_collected_duties_cents + quote_ddp.upfront_collected_taxes_cents)/100:.2f} | Doorstep Surprise: ${quote_ddp.doorstep_delivery_surprise_fee_cents/100:.2f} [{quote_ddp.customer_experience_risk}]")
print(f"Strategy DAP (Legacy DDU):  Upfront Duty/Tax: ${(quote_dap.upfront_collected_duties_cents + quote_dap.upfront_collected_taxes_cents)/100:.2f} | Doorstep Surprise: ${quote_dap.doorstep_delivery_surprise_fee_cents/100:.2f} [{quote_dap.customer_experience_risk}]")'''

p3_output = '''Strategy DDP (Recommended): Upfront Duty/Tax: $55.94 | Doorstep Surprise: $0.00 [ZERO_DOORSTEP_FRICTION]
Strategy DAP (Legacy DDU):  Upfront Duty/Tax: $0.00 | Doorstep Surprise: $70.94 [HIGH_RETURN_REFUSAL_RISK]'''

p4_code = '''from dataclasses import dataclass

@dataclass
class CommercialInvoiceManifest:
    invoice_number: str
    export_country: str
    import_country: str
    incoterm: str
    currency: str
    total_customs_declared_value_usd: float
    requires_eei_filing: bool

def generate_customs_documentation(order_id: str, dest_country: str, total_usd: float) -> CommercialInvoiceManifest:
    requires_eei = (total_usd > 2500.0) and (dest_country != "CA")
    inv_num = f"CI-{order_id}-EXP"
    return CommercialInvoiceManifest(inv_num, "US", dest_country, "DDP", "USD", total_usd, requires_eei)

inv1 = generate_customs_documentation("ORD-1092", "GB", 450.0)
inv2 = generate_customs_documentation("ORD-9942", "DE", 3400.0)

print(f"Customs Doc {inv1.invoice_number}: Dest: {inv1.import_country} | Declared: ${inv1.total_customs_declared_value_usd:.2f} | AES EEI Required: {inv1.requires_eei_filing}")
print(f"Customs Doc {inv2.invoice_number}: Dest: {inv2.import_country} | Declared: ${inv2.total_customs_declared_value_usd:.2f} | AES EEI Required: {inv2.requires_eei_filing}")'''

p4_output = '''Customs Doc CI-ORD-1092-EXP: Dest: GB | Declared: $450.00 | AES EEI Required: False
Customs Doc CI-ORD-9942-EXP: Dest: DE | Declared: $3400.00 | AES EEI Required: True'''

p5_code = '''from dataclasses import dataclass
from typing import Dict

@dataclass
class TradeComplianceMetrics:
    total_international_consignments: int
    denied_party_hits_blocked: int
    landed_cost_variance_rate_bps: float
    ddp_clearance_success_pct: float
    customs_hold_rate_pct: float

def audit_trade_compliance_tower(m: TradeComplianceMetrics) -> Dict[str, float]:
    score = 0.0
    score += min(35.0, (m.ddp_clearance_success_pct / 99.0) * 35.0)
    score += 35.0 if m.landed_cost_variance_rate_bps <= 20.0 else 20.0
    score += 30.0 if m.customs_hold_rate_pct <= 0.50 else 15.0
    return {
        "consignments": float(m.total_international_consignments),
        "blocked_screenings": float(m.denied_party_hits_blocked),
        "ddp_success_pct": m.ddp_clearance_success_pct,
        "variance_bps": m.landed_cost_variance_rate_bps,
        "customs_hold_pct": m.customs_hold_rate_pct,
        "composite_score": round(score, 2),
        "status": "APEX_TRADE_COMPLIANCE_CERTIFIED" if score >= 90.0 else "SUBOPTIMAL"
    }

fleet = TradeComplianceMetrics(
    total_international_consignments=185_000,
    denied_party_hits_blocked=42,
    landed_cost_variance_rate_bps=12.5,
    ddp_clearance_success_pct=99.6,
    customs_hold_rate_pct=0.18
)

audit = audit_trade_compliance_tower(fleet)
print(f"Trade Fleet Audited: Consignments: {audit['consignments']:,.0f} shipments")
print(f"Denied Parties Neutralized:        {audit['blocked_screenings']:,.0f} hits (OFAC / BIS lists)")
print(f"DDP Customs Clearance Rate:        {audit['ddp_success_pct']}% (Target >= 99.0%)")
print(f"Landed Cost Quote Variance:        {audit['variance_bps']} bps (Target <= 20.0 bps)")
print(f"Customs Regulatory Hold Rate:      {audit['customs_hold_pct']}% (Target <= 0.50%)")
print(f"Composite Architecture Score:      {audit['composite_score']}/100.0 pts")
print(f"Accreditation Status:              [{audit['status']}]")'''

p5_output = '''Trade Fleet Audited: Consignments: 185,000 shipments
Denied Parties Neutralized:        42 hits (OFAC / BIS lists)
DDP Customs Clearance Rate:        99.6% (Target >= 99.0%)
Landed Cost Quote Variance:        12.5 bps (Target <= 20.0 bps)
Customs Regulatory Hold Rate:      0.18% (Target <= 0.50%)
Composite Architecture Score:      100.0/100.0 pts
Accreditation Status:              [APEX_TRADE_COMPLIANCE_CERTIFIED]'''

# Construct the full text with strict >= 620 words per part
day52_data = {
    "coursePrefix": "bcom_ecom",
    "day": 52,
    "title": "International Trade Compliance, Landed Cost Calculation & Customs Automation",
    "goal": "Master global cross-border customs engineering and trade compliance: compute mathematical Total Landed Cost (CIF valuation, compounding ad valorem tariffs, import VAT/GST, carrier disbursement surcharges), engineer automated Harmonized Tariff Schedule (HTS/HS) classification engines exploiting preferential Free Trade Agreements (USMCA, CPTPP, EU-UK TCA), enforce Delivered Duty Paid (DDP) Incoterms 2020 architectures to eliminate doorstep carrier collection friction, automate statutory Electronic Export Information (EEI) filing via AES Direct, and operate an enterprise trade compliance command tower enforcing OFAC/BIS denied party screening.",
    "minutes": 38,
    "recap": "Selling physical merchandise across international borders introduces severe regulatory friction. Unlike domestic shipments, international parcels must clear sovereign customs authorities at ports of entry, where national customs agencies assess tariffs, duties, and import taxes. Historically, cross-border e-commerce operated on a Delivered Duty Unpaid (DDU) model, leaving foreign consumers to be ambushed at their doorstep by couriers demanding unexpected duty payments and brokerage surcharges; this disastrous user experience triggers parcel refusal rates exceeding forty percent. Modern cross-border commerce architectures execute real-time Total Landed Cost calculation at checkout, enabling guaranteed Delivered Duty Paid (DDP) clearance.",
    "parts": [
        {
            "title": "Anatomy of Total Landed Cost: CIF Valuation, Compounding Tariffs & Import Taxes",
            "say": [
                "To deliver complete checkout pricing certainty for international shoppers, software architects must model the precise mathematical valuation methodologies employed by global customs authorities. Total Landed Cost is defined as the comprehensive, all-inclusive financial expenditure required to transport a physical product from the seller's fulfillment center to the foreign consumer's doorstep, encompassing every intermediate regulatory levy, insurance fee, and logistics surcharge. A naive calculation that simply multiplies the product price by a flat duty percentage fails completely, because international customs jurisdictions do not calculate import tariffs solely on the merchant's retail sales price.",
                "Under the World Trade Organization (WTO) Valuation Agreement, the vast majority of international customs authorities (including the European Union, the United Kingdom, Australia, Japan, and China) utilize the CIF Valuation Standard (Cost, Insurance, and Freight). Under CIF rules, the customs duty is assessed not on the standalone Free on Board (FOB) merchandise value, but on the cumulative sum of the product price, the international air/ocean freight charge, and the transit insurance fee. If a merchant sells a pair of leather boots for $180 with $8 allocated freight and $1 transit insurance, the dutiable CIF value is $189. A duty rate of 8.0% assesses $15.12 in customs duty against the $189 CIF base, rather than $14.40 against the product price alone.",
                "Compounding the complexity, national tax agencies calculate Import Value Added Tax (VAT) or Goods and Services Tax (GST) on top of the customs duty. The taxable basis for import VAT is formally defined as the CIF valuation plus the assessed customs duty. In our boots example, with an import VAT rate of 20.0% (standard in the UK and France), the VAT is calculated on $204.12 ($189 CIF + $15.12 duty), yielding an import tax liability of $40.82. Beyond statutory duties and taxes, international express carriers (such as DHL Express, FedEx, and UPS) assess Carrier Brokerage and Disbursement Fees for advancing duty payments to national customs on behalf of the importer. These flat disbursement fees (typically ranging from ten to twenty-five dollars per consignment) must be captured upfront in the landed cost equation.",
                "Failure to accurately model these compounding interactions results in chronic financial leakage. If an e-commerce platform underestimates landed cost at checkout, the merchant must absorb the difference out of their gross profit margin when the carrier bills the corporate account. Conversely, overestimating landed cost inflates checkout prices, unnecessarily suppressing international sales conversion. A high-precision Landed Cost Engine performs real-time SKU-level multi-currency compounding across weight-based freight allocations, CIF basis computations, and statutory tax schedules down to the exact cent.",
                "Examine the Python code below illustrating the Total Landed Cost Calculation Engine. Observe how it takes merchandise attributes, allocates weight-based air freight, establishes the CIF valuation baseline, and computes compounding customs duties, import VAT, and carrier brokerage fees."
            ],
            "code": p1_code,
            "output": p1_output,
            "example": "A direct-to-consumer electronics platform shipped audio equipment from California to London. By precisely calculating the CIF valuation ($189), 8% duty ($15.12), and compounding 20% UK VAT ($40.82), the checkout engine collected exact landed cost upfront, ensuring 100% first-pass customs clearance without a cent of corporate billing variance.",
            "tryIt": "Adjust the item price in the landed cost script to $300.00 USD and the import VAT percentage to 25.0% (standard in Scandinavia), observing how the compounding calculation updates the total fully landed cost.",
            "check": {
                "question": "Under the international WTO CIF (Cost, Insurance, and Freight) customs valuation standard, how is import Value Added Tax (VAT) mathematically calculated?",
                "options": [
                    "Import VAT is calculated on the cumulative sum of the product price, allocated freight, insurance (CIF value), PLUS the assessed customs duty.",
                    "Import VAT is calculated solely on the merchant's wholesale manufacturing cost, ignoring shipping and duties.",
                    "Import VAT is calculated as a flat five-dollar fee regardless of parcel value or destination country.",
                    "Import VAT is only calculated if the parcel is transported via commercial passenger railways."
                ],
                "answer": 0,
                "why": "Under international customs law, import VAT/GST is assessed on the landed tax base, which equals the CIF value (Cost, Insurance, Freight) plus the customs duty assessed by customs authorities."
            }
        },
        {
            "title": "Harmonized Tariff Schedule (HTS / HS Codes) & Preferential Trade Agreements",
            "say": [
                "The bedrock of international customs valuation is the Harmonized Commodity Description and Coding System (HS), maintained globally by the World Customs Organization (WCO). Every physical commodity transported across international borders must be classified under an official HS Code. The global HS framework establishes a standardized six-digit numerical hierarchy: the first two digits designate the broad Chapter (e.g., Chapter 61: Articles of apparel and clothing accessories, knitted); the next two digits define the Heading (e.g., 6109: T-shirts, singlets, and other vests); and the fifth and sixth digits specify the Subheading (e.g., 6109.10: Of cotton).",
                "Beyond the universal six-digit WCO baseline, individual sovereign nations append four to six additional digits to establish National Tariff Lines (such as the 10-digit Harmonized Tariff Schedule of the United States - HTSUS, the 10-digit TARIC code in the European Union, or the 8-digit Combined Nomenclature in the UK). These country-specific statistical suffix digits determine the exact statutory duty percentage applied to the imported good. For example, within the cotton t-shirt subheading, a men's knitted cotton crewneck might face a 16.5% general duty rate under US HTSUS 6109.10.00.12, whereas a distinct technical fabric blend in another tariff line might face 32.0% or 0.0%. Misclassifying a single product SKU can trigger devastating regulatory audits, retroactive tariff penalties, and customs seizure of outbound shipments.",
                "Modern trade compliance architectures automate HS classification using Natural Language Processing (NLP) and computer vision models trained on millions of cross-border customs declaration rulings. The classification engine analyzes merchant catalog metadata—including product title, fabric composition percentages, manufacturing methods, intended consumer gender, and country of origin—mapping raw SKUs to verified 6-digit WCO codes and country-specific 10-digit national tariff lines. Furthermore, the engine evaluates Rules of Origin under multilateral Free Trade Agreements (FTAs).",
                "Under preferential trade agreements like the United States-Mexico-Canada Agreement (USMCA), the Comprehensive and Progressive Agreement for Trans-Pacific Partnership (CPTPP), or the EU-UK Trade and Cooperation Agreement (TCA), commodities manufactured within member states qualify for preferential zero-duty (0.0%) or reduced tariff rates, provided they satisfy rigorous 'tariff shift' or regional value content (RVC) thresholds. If an e-commerce platform ships cotton apparel manufactured in Mexico to a consumer in the United States, the HTS classification engine checks the country of origin, identifies the qualifying USMCA status, and drops the applicable duty rate from the 16.5% Most-Favored-Nation (MFN) rate down to 0.0%. Capturing preferential trade exemptions expands international sales margins by dozens of percentage points.",
                "Review the Python code below to inspect the HTS Classification Registry. Observe how it maps national tariff lines, checks origin countries against free trade agreements, and programmatically resolves whether an import qualifies for preferential zero-duty regimes or standard statutory tariffs."
            ],
            "code": p2_code,
            "output": p2_output,
            "example": "A Canadian outdoor apparel brand integrated automated USMCA origin rules. When shipping Canadian-manufactured wool coats to US buyers, the system automatically applied USMCA preferential tariff codes, eliminating 18.5% in general MFN import duties and saving $420,000 in annual customer duty costs.",
            "tryIt": "Register a new national tariff line for European Union TARIC code '8504.40.95.00' (power supplies) with 0.0% duty, and verify that the registry properly resolves the zero-duty regime for EU consignments.",
            "check": {
                "question": "What is the primary commercial benefit of an automated HTS classification engine that evaluates Rules of Origin under Free Trade Agreements (such as USMCA or CPTPP)?",
                "options": [
                    "It automatically applies preferential zero-percent or reduced tariff rates on qualifying cross-border shipments, substantially lowering landed cost for international buyers.",
                    "It allows merchants to ship hazardous chemical materials without disclosing parcel contents to airlines.",
                    "It forces foreign customs inspectors to clear parcels within two minutes without inspecting shipping containers.",
                    "It exempts e-commerce platforms from maintaining corporate financial bank accounts."
                ],
                "answer": 0,
                "why": "Automated HTS classification engines identify qualifying origins under Free Trade Agreements (like USMCA), legally dropping customs duty rates to 0.0% and dramatically reducing landed costs."
            }
        },
        {
            "title": "Incoterms 2020: Delivered Duty Paid (DDP) vs Delivered at Place (DAP / DDU)",
            "say": [
                "In international commerce, the contractual division of costs, liabilities, and customs responsibilities between buyer and seller is governed by International Commercial Terms (Incoterms), published by the International Chamber of Commerce (ICC). In digital retail, the critical architectural decision centers on the choice between two specific Incoterms 2020 rules: Delivered Duty Paid (DDP) versus Delivered at Place (DAP, historically designated as Delivered Duty Unpaid or DDU). This architectural choice directly dictates the customer experience, conversion rate, and parcel refusal velocity.",
                "Under the legacy Delivered at Place (DAP / DDU) model, the merchant collects only the product price and baseline international shipping cost at checkout, washing their hands of customs compliance. The parcel is shipped across international borders with unpaid customs liabilities. When the parcel arrives at the destination country's airport customs facility, the local customs authority assesses duties, import VAT, and security fees. The international courier (such as DHL, FedEx, or royal postal services) pays these fees on credit, transports the parcel to the consumer's home, and demands payment on the consumer's doorstep before handing over the box.",
                "To make matters worse, the courier slaps an exorbitant Carrier Disbursement and Administrative Fee (often $15 to $30) directly onto the bill. A foreign consumer who believed they bought an eighty-dollar sweater is suddenly ambushed on their doorstep by a delivery driver demanding forty-five dollars in cash or card payment. The consumer feels extorted; between thirty to forty-five percent of DAP parcels are rejected outright at the doorstep. The refused parcel must either be abandoned at customs (resulting in total loss of merchandise) or shipped back to the merchant at astronomical return freight expense, obliterating operating profit margins.",
                "To eliminate this customer experience disaster, modern global e-commerce platforms enforce Delivered Duty Paid (DDP) as an immutable architectural invariant. Under DDP, the merchant acts as the importer of record (or partners with a fiscal representative), calculating and collecting one hundred percent of customs duties, import VAT/GST, and carrier clearance fees directly on the checkout page. The shipping label is printed with electronic DDP EDI barcodes. When the parcel arrives in the foreign country, customs clearance is executed electronically in the air before the plane lands. The courier delivers the parcel directly to the consumer's doorstep with zero friction, zero delays, and zero doorstep surprise fees, driving customer satisfaction and repeat purchase loyalty to domestic-tier benchmarks.",
                "Inspect the Python code below illustrating the Incoterms Decision Router. Observe how it compares DDP against DAP, highlighting the doorstep fee surprises and severe customer return refusal risks associated with legacy DDU fulfillment."
            ],
            "code": p3_code,
            "output": p3_output,
            "example": "A home decor brand transitioned its international fulfillment from DAP (DDU) to guaranteed DDP checkout. Doorstep parcel refusal rates collapsed from 36.4% down to 0.6%, saving $1.2 million in return freight and abandoned merchandise write-offs within the first nine months.",
            "tryIt": "Toggle the `allow_dap` flag in the Incoterm strategy script to True and observe how the doorstep surprise fee rises from zero to over seventy dollars, escalating the customer experience risk to HIGH_RETURN_REFUSAL_RISK.",
            "check": {
                "question": "Why is Delivered Duty Paid (DDP) universally considered the gold standard for cross-border e-commerce checkout architecture compared to Delivered at Place (DAP / DDU)?",
                "options": [
                    "DDP collects all duties, taxes, and clearance fees upfront at checkout, enabling pre-cleared electronic customs entry and eliminating the doorstep surprise fees that cause massive parcel refusal rates.",
                    "DDP allows merchants to avoid paying any import taxes or tariffs to foreign governments legally.",
                    "DDP permits international couriers to deliver parcels via unmanned aerial drone networks exclusively.",
                    "DDP requires the customer to travel to the international airport customs facility to physically inspect their package."
                ],
                "answer": 0,
                "why": "DDP collects all duties and taxes upfront during checkout, guaranteeing zero surprise fees at delivery, enabling fast electronic customs clearance, and eliminating costly doorstep parcel rejections."
            }
        },
        {
            "title": "Automated Customs Documentation: Commercial Invoices, EEI & AES Direct Filing",
            "say": [
                "Physical international parcels cannot move through customs checkpoints on software code alone; they must be accompanied by legally binding international customs documentation. When an order is packed in a warehouse, the fulfillment engine must generate, print, and transmit three critical regulatory documents: the Commercial Invoice, the Customs Declaration Form (CN22 / CN23 for postal mail), and, where required, Electronic Export Information (EEI) filed via national export systems.",
                "The Commercial Invoice is the definitive legal document used by international customs officers to assess import tariffs and enforce import quotas. The invoice must conform to international trade standards, detailing the seller's legal entity and tax ID, the buyer's full name and address, the terms of sale (Incoterm DDP), the currency of sale, and an itemized manifest of every commodity in the shipment. For every single line item, the commercial invoice must explicitly state: the verified 6-to-10-digit HS Code, a detailed non-generic plain-language description (e.g., '100% Cotton Knitted Crewneck T-Shirt' rather than vague terms like 'Samples' or 'Gift'), the quantity, unit weight, unit commercial value, and the Country of Origin (where the product was physically manufactured).",
                "To accelerate transit times and eliminate lost paperwork, modern logistics APIs transmit Paperless Commercial Invoices electronically directly to customs border authorities (such as FedEx Electronic Trade Documents - ETD or DHL Paperless Trade - PLT). The carrier's barcode on the shipping label links directly to the cloud-hosted customs manifest, allowing foreign customs agents to review and clear the shipment while the aircraft is still in flight.",
                "Furthermore, for high-value exports originating in the United States, trade compliance engines must automate Electronic Export Information (EEI) filings under the US Foreign Trade Regulations (15 C.F.R. Part 30). Under US Census Bureau and Customs and Border Protection (CBP) mandates, any cross-border commercial shipment containing a single commodity value exceeding $2,500 USD (or any shipment requiring an export license regardless of value) legally mandates an automated EEI filing through the Automated Export System (AES Direct). The system must submit the export manifest via AES APIs, obtain an Internal Transaction Number (ITN) confirmation string (e.g., 'AES X20261026123456'), and print the ITN directly onto the commercial shipping label before the carrier is permitted to load the parcel onto an international flight.",
                "Examine the Python script below illustrating an Automated Customs Documentation Generator. Observe how it evaluates destination countries and declared values, automatically determining statutory AES EEI filing requirements and minting compliant export manifests."
            ],
            "code": p4_code,
            "output": p4_output,
            "example": "An industrial tool e-commerce distributor automated its AES Direct filings. For international orders exceeding $2,500, the system automatically generated Electronic Export Information payloads, received valid ITN proof-of-filing tokens within four seconds, and avoided mandatory $10,000 CBP civil export penalties.",
            "tryIt": "Modify the declared value of invoice 1 in the customs generator script from $450 to $3,200 USD, observing how crossing the statutory threshold flips `requires_eei_filing` to True.",
            "check": {
                "question": "Under US Foreign Trade Regulations, what statutory threshold triggers the mandatory requirement to file Electronic Export Information (EEI) through the Automated Export System (AES Direct)?",
                "options": [
                    "When a single commodity classification (Schedule B / HTS code) within a shipment has a commercial value exceeding $2,500 USD (to destinations other than Canada).",
                    "Whenever a shipment contains more than two physical cardboard boxes.",
                    "Only when exporting perishable agricultural food products to Antarctica.",
                    "Whenever the shipment is transported across international waters on a Tuesday."
                ],
                "answer": 0,
                "why": "US Foreign Trade Regulations legally mandate an automated EEI filing via AES Direct for any shipment where a single commodity classification value exceeds $2,500 (excluding non-licensable goods to Canada)."
            }
        },
        {
            "title": "Enterprise Trade Compliance Command Tower: Denied Party Screening & Precision Audits",
            "say": [
                "Operating a planetary trade infrastructure exposes an enterprise to severe sovereign geopolitical and national security regulations. In cross-border commerce, selling to the wrong person, shipping to an embargoed entity, or misdeclaring customs values can trigger devastating criminal indictments, multi-million-dollar civil fines, and the complete revocation of international export privileges. The Trade Compliance Command Tower acts as the supreme corporate defense shield, governing denied party screening, tariff classification precision, and customs audit readiness across all global operations.",
                "A foundational mandate enforced by the Command Tower is automated Real-Time Denied Party Screening (DPS). Under international security sanctions enforced by the US Department of the Treasury's Office of Foreign Assets Control (OFAC), the Bureau of Industry and Security (BIS), the European Union, and the United Nations, merchants are strictly prohibited from conducting commercial transactions with individuals or entities on designated watchlists (such as the Specially Designated Nationals - SDN List, Denied Persons List, and Entity List). The Command Tower screens every international customer name, corporate entity, and delivery address against comprehensive global consolidated screening lists using fuzzy string matching and phonetic algorithms, instantly blocking prohibited transactions before orders can be fulfilled.",
                "The second pillar of trade governance is Landed Cost Variance Tracking. The Command Tower continuously audits the precision of upfront landed cost quotes generated at checkout against actual retroactive billing invoices received from international customs brokers and express carriers. In an optimized cross-border architecture, the variance between estimated duties and final customs assessments is defended strictly below twenty basis points (0.20%). If a specific product line begins experiencing unexpected customs billing variances, the Command Tower alerts compliance engineers, identifying tariff schedule updates or carrier reclassification discrepancies for immediate remediation.",
                "The third pillar centers on Customs Regulatory Hold Rate Minimization. The Command Tower monitors international consignments in transit, tracking customs inspection holds across foreign ports of entry. World-class trade compliance operations maintain a customs hold rate of less than zero-point-five percent (0.50%), proving that automated commercial invoices, paperless trade data feeds, and DDP duty payments are accepted without inspection delays. By combining real-time sanctions screening, high-precision tariff engines, and proactive customs audit trails, the Trade Compliance Command Tower guarantees flawless global trade operations, regulatory mastery, and unbroken customer fulfillment across the globe.",
                "Inspect the Python code below to observe the Trade Compliance Command Tower audit suite. Observe how it evaluates global consignments, checks blocked sanctions hits, validates DDP clearance percentages, monitors landed cost variance, and confers official trade compliance certification."
            ],
            "code": p5_code,
            "output": p5_output,
            "example": "A consumer hardware enterprise handling 185,000 international shipments operated a Trade Compliance Command Tower. The system neutralized 42 denied party sanctions attempts, maintained a 99.6% first-pass DDP clearance rate, and kept landed cost billing variance at an industry-leading 12.5 basis points.",
            "tryIt": "Increase the simulated customs regulatory hold rate in the trade metrics from 0.18% to 1.50%, observing how exceeding the regulatory threshold reduces the composite score and revokes compliance certification.",
            "check": {
                "question": "Why is automated Denied Party Screening (DPS) against watchlists such as OFAC SDN and BIS Entity Lists legally mandatory for cross-border e-commerce platforms?",
                "options": [
                    "To strictly comply with international trade sanctions and national security laws, preventing unlawful commercial transactions with sanctioned individuals, terrorist organizations, and embargoed foreign entities.",
                    "To prevent competitors from purchasing products for commercial benchmarking.",
                    "To verify whether customers have paid their municipal water utility bills.",
                    "To determine which customers are eligible for free promotional holiday greeting cards."
                ],
                "answer": 0,
                "why": "Denied Party Screening is a strict legal requirement under OFAC, BIS, and international trade laws to prevent transactions with sanctioned persons, criminal syndicates, and embargoed foreign entities."
            }
        }
    ]
}

output_file = os.path.join(commerce_dir, "scripts", "branch_b", "day52_ecom_data.json")
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(day52_data, f, indent=2, ensure_ascii=False)

print(f"Generated Day 52 data: {output_file}")
