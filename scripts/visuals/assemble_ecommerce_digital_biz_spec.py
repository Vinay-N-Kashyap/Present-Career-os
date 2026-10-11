# scripts/visuals/assemble_ecommerce_digital_biz_spec.py
import json
import sys
from pathlib import Path

repo_root = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(repo_root))

from scripts.visuals.ecommerce_digital_biz_spec_m1 import DAYS_1_TO_15
from scripts.visuals.ecommerce_digital_biz_spec_m1_rest import DAYS_16_TO_30
from scripts.visuals.ecommerce_digital_biz_spec_m2_part1 import DAYS_31_TO_45
from scripts.visuals.ecommerce_digital_biz_spec_m2_part2 import DAYS_46_TO_60

m1_days = DAYS_1_TO_15 + DAYS_16_TO_30
m2_days = DAYS_31_TO_45 + DAYS_46_TO_60

assert len(m1_days) == 30, f"Expected 30 days in M1, got {len(m1_days)}"
assert len(m2_days) == 30, f"Expected 30 days in M2, got {len(m2_days)}"

m1_quests = sum(len(d["quests"]) for d in m1_days)
m2_quests = sum(len(d["quests"]) for d in m2_days)

assert m1_quests == 120, f"Expected 120 quests in M1, got {m1_quests}"
assert m2_quests == 120, f"Expected 120 quests in M2, got {m2_quests}"

for d in m1_days + m2_days:
    assert len(d["quests"]) == 4, f"Day {d['day']} has {len(d['quests'])} quests"
    assert "situationalPuzzle" in d, f"Day {d['day']} missing situationalPuzzle"
    assert len(d["socraticHints"]) == 3, f"Day {d['day']} has {len(d['socraticHints'])} socraticHints"
    assert "conceptInvariant" in d, f"Day {d['day']} missing conceptInvariant"
    assert "failureMode" in d, f"Day {d['day']} missing failureMode"
    assert "tryItFriction" in d, f"Day {d['day']} missing tryItFriction"

out_path = Path(__file__).resolve().parent / "ecommerce-digital-biz-masterclass-spec.ts"

content = f"""// scripts/visuals/ecommerce-digital-biz-masterclass-spec.ts
// Complete 60-Day Masterclass Specification for E-Commerce & Digital Business (course-ecommerce-digital-biz)
// Conforming strictly to Gate v2 semantic standard across all 60 days (240 quests total).
// Generated automatically from Python specifications.
// Month 1: D2C Gross Margin Economics, PIM Architecture, Dynamic Pricing, PDP Ergonomics, Composable Storefronts, Distributed Carts, One-Page Checkout, Payment Gateways (Stripe/Adyen), OMS State Machines, Real-Time Inventory (Redis Lua), Reverse Logistics, Omnichannel Support (Gorgias), Conversational AI (RAG), UGC Reviews, Loyalty Programs, E-Commerce Analytics (GA4), Retention Cohorts, Ad Attribution (mROAS), CRO Physics, AI Recommenders, Storefront Search (BM25), Fraud Defense & Cross-Border Landed Cost (Days 1–30 / 120 Quests).
// Month 2: Multi-Vendor Marketplace Architecture, Stripe Connect Escrow, Marketplace Commissions & Take Rates, Buy Box Algorithms, Seller Quality Governance, Digital Wallets (Apple/Google Pay), BNPL Fintech Economics, Subscription Dunning & Involuntary Churn, Enterprise ATO Defense, Social Commerce (TikTok/Meta), Live Video Streaming, Affiliate Attribution, Omnichannel Retail BOPIS & POS Safety Buffers, Flash Sale Concurrency & Virtual Waiting Rooms, Edge Middleware (Cloudflare Workers/Fastly), Headless CMS (Sanity/Contentful), Modern Data Stack (Snowflake/dbt/CDP), Global Freight Logistics & Port Demurrage, Multi-Currency Treasury & FX Hedging, Forensic Disaster Audits ($15M Stockout, $8M Gateway Lockup, $5M Customs Shock), Global Tax Nexus (Wayfair/Avalara), PCI-DSS v4.0 & Privacy, Subscription Regulatory Laws (FTC Click-to-Cancel), CDO Strategic Architecture RFC & Capstone 2 ApexEnterpriseOS Master Capstone Defense (Days 31–60 / 120 Quests).
// Capstone 1: ApexCommerce Sovereign Full-Stack Storefront & Fulfillment Engine Master Capstone Viva Gate.
// Capstone 2: ApexEnterpriseOS Master Capstone & Senior CDO Defense Viva Gate.

import {{ MasterclassDaySpec }} from './java-masterclass-spec';

export const ECOMMERCE_DIGITAL_BIZ_MONTH_1_SPECS: MasterclassDaySpec[] = {json.dumps(m1_days, indent=2)};

export const ECOMMERCE_DIGITAL_BIZ_MONTH_2_SPECS: MasterclassDaySpec[] = {json.dumps(m2_days, indent=2)};
"""

with open(out_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Successfully generated {out_path} ({len(m1_days)} M1 days, {len(m2_days)} M2 days, {m1_quests + m2_quests} total quests)")
