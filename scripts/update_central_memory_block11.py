import datetime
import os

now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

# 1. Update multi_agent_control.csv
mac_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
if os.path.exists(mac_path):
    with open(mac_path, "a", encoding="utf-8") as f:
        f.write(f"TASK-2009,Branch A,course-3d-graphics,Days 51-55,COMPLETED,{now_str},Block 11 SPH Fluid Dynamics XPBD Cloth CCD Continuous Collision GPU Spatial Hashing & Milestone 11 Capstone (55/60 Days - 91.7%)\n")
    print("Updated multi_agent_control.csv with TASK-2009")

# 2. Update PROJECT_MEMORY.md
pm_path = r"C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md"
if os.path.exists(pm_path):
    with open(pm_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    entry = f"""
### 🚀 Branch A (Tech / IoT): Course 15 (`course-3d-graphics` / `g3d`) - Month 2 Block 11 Complete ({now_str})
- **Scope**: Days 51 to 55 & 🏆 Milestone 11 Capstone:
  - Day 51: Smoothed Particle Hydrodynamics (SPH): Navier-Stokes, Density Kernels & Pressure Solver (3,172 words)
  - Day 52: Position Based Dynamics (PBD) & Extended PBD (XPBD): Distance, Bending Constraints & Cloth Simulation (3,314 words)
  - Day 53: Continuous Collision Detection (CCD) & Convex Hull GJK/EPA Collision Solvers (3,322 words)
  - Day 54: GPU Spatial Hashing & Neighborhood Search: Radix Sort, 3D Grids & Bitonic Sorting (3,126 words)
  - Day 55: 🏆 Milestone 11 Capstone: Real-Time GPU Physics Engine & Interactive Multi-Phase Fluid/Cloth Simulation (3,133 words)
- **Pedagogical Invariant**: All 25 parts strictly >= 600 words/part (Total: 16,067 words, avg 3,213.4 words/day).
- **Gate v2 Visuals**: `day-51.json` through `day-55.json` generated with `compare` template, SHA-256 bindings, and ZERO numeric digits in captions (`!/\\d/`).
- **Tests**: `tests/g3d_days51_55_expansion.test.ts` passed 2/2; full regression test suite passed 39/39 tests.
- **TypeScript**: `npx tsc --noEmit` exited code 0 with 0 errors.
- **Progress**: Course 15 is now **55 / 60 Days Complete (91.7%)**.
"""
    new_content = content + "\n" + entry
    with open(pm_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Updated PROJECT_MEMORY.md with Milestone 11 Capstone details")
