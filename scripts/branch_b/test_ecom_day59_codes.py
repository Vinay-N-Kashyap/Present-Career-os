"""
Test and verify Python code blocks for Course 07 Day 59:
E-Commerce Enterprise Architecture Strategy, Total Cost of Ownership (TCO), Platform Migration & Scalability Roadmaps
"""
from dataclasses import dataclass
from typing import Dict, List, Tuple

print("=== PART 1: MONOLITH VS COMPOSABLE MACH ARCHITECTURE EVALUATION ===")
@dataclass
class ArchitectureEvaluationInput:
    annual_gmv_usd: float
    engineering_team_size: int
    deployment_frequency_per_week: int
    customization_complexity_score: float # 1.0 to 10.0

class ArchitectureStrategyEngine:
    def evaluate_architectural_fit(self, inp: ArchitectureEvaluationInput) -> Tuple[str, float, str]:
        # Weighted MACH suitability index (0 to 100)
        mach_index = 0.0
        mach_index += min(35.0, (inp.annual_gmv_usd / 50_000_000.0) * 35.0)
        mach_index += min(25.0, (inp.engineering_team_size / 40.0) * 25.0)
        mach_index += min(20.0, (inp.deployment_frequency_per_week / 20.0) * 20.0)
        mach_index += (inp.customization_complexity_score / 10.0) * 20.0
        
        mach_index = round(mach_index, 1)
        if mach_index >= 70.0:
            recommendation = "COMPOSABLE_MACH_HEADLESS_ARCHITECTURE"
            rationale = "HIGH_COMPLEXITY_HIGH_SCALE_DEMANDS_MODULAR_DECOUPLING"
        elif mach_index >= 40.0:
            recommendation = "HYBRID_HEADLESS_MONOLITH"
            rationale = "DECOUPLE_FRONTEND_KEEP_CORE_MONOLITH_COMMERCE_BACKEND"
        else:
            recommendation = "PACKAGED_ENTERPRISE_MONOLITH"
            rationale = "SPEED_TO_MARKET_OUTWEIGHS_MODULAR_COMPOSABILITY_OVERHEAD"
        return recommendation, mach_index, rationale

strat_engine = ArchitectureStrategyEngine()
client_enterprise = ArchitectureEvaluationInput(120_000_000.0, 65, 35, 8.5)
client_midmarket = ArchitectureEvaluationInput(15_000_000.0, 12, 2, 4.0)

rec_ent, score_ent, rat_ent = strat_engine.evaluate_architectural_fit(client_enterprise)
rec_mid, score_mid, rat_mid = strat_engine.evaluate_architectural_fit(client_midmarket)

print(f"Enterprise Client ($120M GMV): Score: {score_ent}/100 -> [{rec_ent}] ({rat_ent})")
print(f"Mid-Market Client ($15M GMV):  Score: {score_mid}/100 -> [{rec_mid}] ({rat_mid})")


print("\n=== PART 2: STRANGLER FIG MIGRATION TRAFFIC ROUTER ===")
@dataclass
class MigrationRouteContext:
    request_path: str
    traffic_migration_pct: float # e.g. 85.0 for 85% migrated to headless
    session_hash_value: int # 0 to 99

class StranglerFigTrafficGateway:
    def route_traffic(self, ctx: MigrationRouteContext) -> Tuple[str, str]:
        # Decoupled routes fully migrated to headless microservices
        headless_paths = {"/cart", "/checkout", "/catalog", "/search"}
        
        is_path_migrated = any(ctx.request_path.startswith(p) for p in headless_paths)
        if not is_path_migrated:
            return "LEGACY_MONOLITH_CORE", "LEGACY_UNMIGRATED_PATH"
        
        # Canary traffic routing based on session hash
        if ctx.session_hash_value < ctx.traffic_migration_pct:
            return "HEADLESS_MODERN_MICROSERVICE", "CANARY_TRAFFIC_ACTIVE"
        else:
            return "LEGACY_MONOLITH_CORE", "CANARY_FALLBACK_ACTIVE"

strangler = StranglerFigTrafficGateway()
route_1, msg_1 = strangler.route_traffic(MigrationRouteContext("/checkout/pay", 80.0, 42))
route_2, msg_2 = strangler.route_traffic(MigrationRouteContext("/checkout/pay", 80.0, 92))
route_3, msg_3 = strangler.route_traffic(MigrationRouteContext("/account/settings", 80.0, 10))

print(f"Traffic Decision 1 (/checkout/pay, Hash 42): [{route_1}] | Reason: [{msg_1}]")
print(f"Traffic Decision 2 (/checkout/pay, Hash 92): [{route_2}] | Reason: [{msg_2}]")
print(f"Traffic Decision 3 (/account/settings):     [{route_3}] | Reason: [{msg_3}]")


print("\n=== PART 3: 5-YEAR TOTAL COST OF OWNERSHIP (TCO) MODEL ===")
@dataclass
class TCOParameters:
    annual_software_license_usd: float
    cloud_hosting_and_cdn_annual_usd: float
    implementation_dev_capex_usd: float # Year 1 CapEx
    annual_maintenance_dev_opex_usd: float
    unplanned_downtime_loss_annual_usd: float

def calculate_5year_tco(params: TCOParameters) -> Dict[str, float]:
    year_1 = (
        params.annual_software_license_usd +
        params.cloud_hosting_and_cdn_annual_usd +
        params.implementation_dev_capex_usd +
        params.annual_maintenance_dev_opex_usd +
        params.unplanned_downtime_loss_annual_usd
    )
    years_2_to_5_annual = (
        params.annual_software_license_usd +
        params.cloud_hosting_and_cdn_annual_usd +
        params.annual_maintenance_dev_opex_usd +
        params.unplanned_downtime_loss_annual_usd
    )
    total_5yr = year_1 + (years_2_to_5_annual * 4)
    
    return {
        "year_1_cost": year_1,
        "annual_run_cost": years_2_to_5_annual,
        "total_5year_tco": total_5yr
    }

# Legacy Monolith: high licenses, high maintenance, high downtime
tco_legacy = calculate_5year_tco(TCOParameters(450_000.0, 180_000.0, 1_200_000.0, 850_000.0, 250_000.0))
# Modern Composable MACH: pay-as-you-go APIs, serverless hosting, low maintenance, zero downtime
tco_mach = calculate_5year_tco(TCOParameters(180_000.0, 95_000.0, 1_500_000.0, 380_000.0, 15_000.0))

savings_5yr = tco_legacy['total_5year_tco'] - tco_mach['total_5year_tco']
print(f"5-Year TCO Comparison:")
print(f"  Legacy Monolith 5-Year TCO:   ${tco_legacy['total_5year_tco']:,.2f} USD")
print(f"  Composable MACH 5-Year TCO:   ${tco_mach['total_5year_tco']:,.2f} USD")
print(f"  Net 5-Year Architecture ROI:  ${savings_5yr:,.2f} USD [MACH_FINANCIAL_SUPERIORITY]")


print("\n=== PART 4: HIGH-CONCURRENCY SCALABILITY & PEAK LOAD ENGINE ===")
@dataclass
class PeakTrafficLoadProfile:
    baseline_requests_per_sec: int
    peak_multiplier: float
    edge_cache_hit_ratio_pct: float # e.g. 0.92 for 92%
    origin_server_capacity_rps: int

def evaluate_peak_load_resilience(p: PeakTrafficLoadProfile) -> Tuple[bool, int, float, str]:
    peak_ingress_rps = int(p.baseline_requests_per_sec * p.peak_multiplier)
    # Origin load = Peak RPS * (1 - Cache Hit Ratio)
    origin_load_rps = int(round(peak_ingress_rps * (1.0 - p.edge_cache_hit_ratio_pct)))
    headroom_pct = round(((p.origin_server_capacity_rps - origin_load_rps) / p.origin_server_capacity_rps) * 100, 1)
    
    is_resilient = origin_load_rps <= p.origin_server_capacity_rps and headroom_pct >= 20.0
    status = "SYSTEM_PEAK_CERTIFIED_SURGE_RESILIENT" if is_resilient else "CRITICAL_ORIGIN_OVERLOAD_RISK"
    return is_resilient, origin_load_rps, headroom_pct, status

# Black Friday Peak: 50,000 baseline RPS surged 12x = 600,000 ingress RPS with 95% edge caching
profile_black_friday = PeakTrafficLoadProfile(50_000, 12.0, 0.95, 45_000)
resilient, origin_rps, headroom, status_str = evaluate_peak_load_resilience(profile_black_friday)

print(f"Peak Scalability Evaluation (Black Friday Surge):")
print(f"  Peak Ingress Inflow:       600,000 RPS (12x Baseline)")
print(f"  Shielded Origin Load:      {origin_rps:,} RPS (95.0% Edge Cached)")
print(f"  Origin Server Headroom:    {headroom}% (Target >= 20.0%)")
print(f"  Architectural Verdict:     [{status_str}]")


print("\n=== PART 5: ENTERPRISE ARCHITECTURE COMMAND TOWER ===")
@dataclass
class ArchitectureGovernanceMetrics:
    total_enterprise_systems_audited: int
    tco_5year_savings_usd: float
    strangler_migration_progress_pct: float
    peak_traffic_resilience_margin_pct: float
    mean_time_to_recovery_minutes: float

def audit_enterprise_architecture_tower(m: ArchitectureGovernanceMetrics) -> Dict[str, float]:
    score = 0.0
    score += 35.0 if m.tco_5year_savings_usd >= 4_000_000.0 else 20.0
    score += 35.0 if m.strangler_migration_progress_pct >= 80.0 else 20.0
    score += 30.0 if (m.peak_traffic_resilience_margin_pct >= 25.0 and m.mean_time_to_recovery_minutes <= 10.0) else 15.0
    
    return {
        "systems_audited": float(m.total_enterprise_systems_audited),
        "tco_savings_usd": m.tco_5year_savings_usd,
        "migration_progress_pct": m.strangler_migration_progress_pct,
        "headroom_pct": m.peak_traffic_resilience_margin_pct,
        "mttr_minutes": m.mean_time_to_recovery_minutes,
        "composite_score": round(score, 1),
        "status": "APEX_ENTERPRISE_ARCHITECTURE_CERTIFIED" if score == 100.0 else "SUBOPTIMAL"
    }

arch_metrics = ArchitectureGovernanceMetrics(
    total_enterprise_systems_audited=48,
    tco_5year_savings_usd=4_245_000.0,
    strangler_migration_progress_pct=85.0,
    peak_traffic_resilience_margin_pct=33.3,
    mean_time_to_recovery_minutes=4.2
)

arch_audit = audit_enterprise_architecture_tower(arch_metrics)
print(f"Enterprise Architecture Command Tower:")
print(f"  Enterprise Microservices Audited: {arch_audit['systems_audited']:,.0f}")
print(f"  5-Year TCO Capital Saved:         ${arch_audit['tco_savings_usd']:,.2f} USD")
print(f"  Strangler Migration Progress:     {arch_audit['migration_progress_pct']}% (Target >= 80.0%)")
print(f"  Peak Traffic Resilience Margin:   {arch_audit['headroom_pct']}% (Target >= 25.0%)")
print(f"  Mean Time to Recovery (MTTR):     {arch_audit['mttr_minutes']} min (Target <= 10.0m)")
print(f"  Composite Architecture Score:     {arch_audit['composite_score']}/100.0 pts")
print(f"  Accreditation Status:             [{arch_audit['status']}]")
