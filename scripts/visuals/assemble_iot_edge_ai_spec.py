# scripts/visuals/assemble_iot_edge_ai_spec.py
import json
import sys
from pathlib import Path

repo_root = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(repo_root))

from scripts.visuals.iot_edge_ai_spec_m1 import DAYS_1_TO_15
from scripts.visuals.iot_edge_ai_spec_m1_rest import DAYS_16_TO_30
from scripts.visuals.iot_edge_ai_spec_m2_part1 import DAYS_31_TO_45
from scripts.visuals.iot_edge_ai_spec_m2_part2 import DAYS_46_TO_60

m1_days = DAYS_1_TO_15 + DAYS_16_TO_30
m2_days = DAYS_31_TO_45 + DAYS_46_TO_60

assert len(m1_days) == 30, f"Expected 30 days in M1, got {len(m1_days)}"
assert len(m2_days) == 30, f"Expected 30 days in M2, got {len(m2_days)}"

out_path = repo_root / "scripts" / "visuals" / "iot-edge-ai-masterclass-spec.ts"

content = f"""// scripts/visuals/iot-edge-ai-masterclass-spec.ts
// Exhaustive 60-Day Masterclass Specification for Edge AI, DSP & TinyML Systems (course-iot-edge-ai)
// Total Quests: 240 Quests (Month 1: 120 Quests, Month 2: 120 Quests)
// Conforming strictly to Gate v2 semantic standard, 3-Tier Socratic Hint Ladders, ADC Physics & Nyquist-Shannon,
// CMSIS-DSP SIMD & Fixed-Point Math, STFT/MFCC Spectral Pipelines, Classical Edge ML & TinyML Quantization (INT8 PTQ/QAT),
// TFLM Static Tensor Arenas, CMSIS-NN Kernel Acceleration, Micro-Vision DVP/FOMO, Digital Audio PDM/Beamforming,
// MicroTVM / TinyEngine AOT NPU Compilation, Micro-Transformers & Linear Attention, Dilated Causal TCNs,
// State-Space Models (S4/Mamba O(1) Recurrent Memory), On-Device Continual Learning (EWC & Experience Replay),
// Streaming Drift Detection (PSI / KS-Test), and Differential Model FOTA.

import {{ MasterclassDaySpec }} from './java-masterclass-spec';

export const EDGE_AI_MONTH_1_SPECS: MasterclassDaySpec[] = {json.dumps(m1_days, indent=2)};

export const EDGE_AI_MONTH_2_SPECS: MasterclassDaySpec[] = {json.dumps(m2_days, indent=2)};
"""

with open(out_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Successfully generated {out_path} ({len(content)} chars)")
