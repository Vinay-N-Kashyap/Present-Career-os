# scripts/visuals/assemble_quant_systems_spec.py
import json
import sys
from pathlib import Path

repo_root = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(repo_root))

from scripts.visuals.quant_systems_spec_m1 import DAYS_1_TO_15
from scripts.visuals.quant_systems_spec_m1_rest import DAYS_16_TO_30
from scripts.visuals.quant_systems_spec_m2_part1 import DAYS_31_TO_45
from scripts.visuals.quant_systems_spec_m2_part2 import DAYS_46_TO_60

m1_days = DAYS_1_TO_15 + DAYS_16_TO_30
m2_days = DAYS_31_TO_45 + DAYS_46_TO_60

assert len(m1_days) == 30, f"Expected 30 days in M1, got {len(m1_days)}"
assert len(m2_days) == 30, f"Expected 30 days in M2, got {len(m2_days)}"

m1_quests = sum(len(d["quests"]) for d in m1_days)
m2_quests = sum(len(d["quests"]) for d in m2_days)
assert m1_quests == 120, f"Expected 120 quests in M1, got {m1_quests}"
assert m2_quests == 120, f"Expected 120 quests in M2, got {m2_quests}"

out_path = repo_root / "scripts" / "visuals" / "quant-systems-masterclass-spec.ts"

content = f"""// scripts/visuals/quant-systems-masterclass-spec.ts
// Exhaustive 60-Day Masterclass Specification for Quantitative Engineering & Low-Latency Trading Systems (course-quant-systems)
// Total Quests: 240 Quests (Month 1: 120 Quests, Month 2: 120 Quests)
// Conforming strictly to Gate v2 semantic standard, 3-Tier Socratic Hint Ladders,
// Market Microstructure Physics (L1/L2/L3), Limit Order Book Price-Time Priority & Matching Engine Kernels,
// Almgren-Chriss Optimal Execution & Market Impact, Order Book Imbalance (OBI) & Micro-Price Estimation,
// Avellaneda-Stoikov High-Frequency Market Making & Inventory Skewing, FIX 4.4 & FAST Protocol Compression,
// NASDAQ TotalView-ITCH 5.0 & OUCH Direct Binary Feeds, CPU 64-Byte Cache Lines & MESI False Sharing Elimination,
// Lock-Free Ring Buffers & LMAX Disruptor Pattern, Kernel-Bypass Networking (Solarflare Onload/DPDK/AF_XDP),
// Linux Real-Time Kernel Tuning (isolcpus, nohz_full, cstate=0, hugepages), Order Flow Toxicity (VPIN),
// Statistical Arbitrage Cointegration & Pairs Trading (Johansen/Engle-Granger/OU Half-Life),
// Dynamic Hedging via Kalman Filtering, L3 Queue Position & Cancellation Hazard Rates,
// Percentage of Volume (POV) & Self-Referential Volume Compounding Defense,
// Smart Order Routing (SOR) across 16 Fragmented Venues & Reg NMS Rule 611, Dark Pools & Anti-Gaming Defense,
// Sub-100ns SEC Rule 15c3-5 Pre-Trade Risk Checks, Historical Outage Forensics (Knight Capital & Flash Crash),
// Black-Scholes-Merton Analytical Pricing & SIMD Implied Volatility Solvers (Newton-Raphson),
// Real-Time First/Second/Cross Order Greeks (Delta, Gamma, Vega, Theta, Rho, Vanna, Volga),
// Delta-Neutral Hedging & Whalley-Wilmott Asymptotic Deadbands, Volatility Surfaces & SABR Model Calibration,
// Cross-Venue Latency Arbitrage & Atomic Legging Risk Defense, Crypto Perpetual Futures & Funding Rates,
// Maker-Taker & Inverted Venue Economics, Zero-Allocation Low-Latency C++/Rust Custom Arenas,
// FPGA Acceleration (SmartNICs & Cycle-Accurate ITCH Hardware Pipelining), Precision PTP Clocks (IEEE 1588v2),
// Single-Threaded Pinned Event Loops & CPU Prefetching, CME SPAN Margin Simulation & Scanning Arrays,
// Fat-Tailed Cornish-Fisher VaR & Basel III Expected Shortfall (CVaR), GARCH(1,1) & HMM Regime Detection,
// FIX Drop Copy & CAT (Consolidated Audit Trail) Surveillance, RDTSC Nanosecond Cycle Profiling,
// Multi-Colocation Failover & Active-Active Fencing Leases, Exchange Chaos Injection & Multicast Gap Replay,
// Columnar Petabyte Tick Backtesting Clusters, and Sovereign Industrial Trading Architectures.

import {{ MasterclassDaySpec }} from './java-masterclass-spec';

export const QUANT_SYSTEMS_MONTH_1_SPECS: MasterclassDaySpec[] = {json.dumps(m1_days, indent=2)};

export const QUANT_SYSTEMS_MONTH_2_SPECS: MasterclassDaySpec[] = {json.dumps(m2_days, indent=2)};
"""

with open(out_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Successfully generated {out_path} ({len(m1_days)} M1 days, {len(m2_days)} M2 days, {m1_quests + m2_quests} total quests)")
