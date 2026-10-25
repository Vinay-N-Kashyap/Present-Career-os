import datetime
import os

now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

# 1. Update multi_agent_control.csv
mac_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
if os.path.exists(mac_path):
    with open(mac_path, "a", encoding="utf-8") as f:
        f.write(f"TASK-2008,Branch A,course-3d-graphics,Days 46-50,COMPLETED,{now_str},Block 10 Subsurface Scattering Thin-Film Iridescence Marschner Hair Volumetric Clouds & Milestone 10 Capstone (50/60 Days - 83.3%)\n")
    print("Updated multi_agent_control.csv with TASK-2008")

# 2. Update PROJECT_MEMORY.md
pm_path = r"C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md"
if os.path.exists(pm_path):
    with open(pm_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    entry = f"""
### 🚀 Branch A (Tech / IoT): Course 15 (`course-3d-graphics` / `g3d`) - Month 2 Block 10 Complete ({now_str})
- **Scope**: Days 46 to 50 & 🏆 Milestone 10 Capstone:
  - Day 46: Subsurface Scattering (SSS): Normalized Diffusion, Separable Screen-Space Filters & Skin Shading (3,152 words)
  - Day 47: Thin-Film Wave Interference & Iridescence: Airy Formula, Optical Path Difference (OPD) & Soap Bubbles (3,117 words)
  - Day 48: Anisotropic Microfacet BRDFs & Hair/Fur Scattering: Marschner Fiber Model, Kajiya-Kay & Melanin Pigmentation (3,304 words)
  - Day 49: Real-Time Volumetric Cloud & Atmosphere Simulation: Ray Marching 3D Worley Noise & The Powder Effect (3,396 words)
  - Day 50: 🏆 Milestone 10 Capstone: Photorealistic Multi-Layered Material & Volumetric Atmospheric Rendering Engine (3,192 words)
- **Pedagogical Invariant**: All 25 parts strictly >= 600 words/part (Total: 16,161 words, avg 3,232.2 words/day).
- **Gate v2 Visuals**: `day-46.json` through `day-50.json` generated with `compare` template, SHA-256 bindings, and ZERO numeric digits in captions (`!/\\d/`).
- **Tests**: `tests/g3d_days46_50_expansion.test.ts` passed 2/2; full regression test suite passed 37/37 tests.
- **TypeScript**: `npx tsc --noEmit` exited code 0 with 0 errors.
- **Progress**: Course 15 is now **50 / 60 Days Complete (83.3%)**.
"""
    new_content = content + "\n" + entry
    with open(pm_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Updated PROJECT_MEMORY.md with Milestone 10 Capstone details")
