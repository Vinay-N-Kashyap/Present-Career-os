import datetime

now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

# 1. Update multi_agent_control.csv
mac_path = r"C:\Users\Admin\Desktop\projects\memory of agent\multi_agent_control.csv"
task_line = f"TASK-2007,Branch A,course-3d-graphics,Days 41-45,COMPLETED,{now_str},Block 9 Hardware Ray Tracing BVH Binned SAH Any-Hit Monte Carlo MIS & Milestone 9 Capstone (45/60 Days - 75.0%)\n"

with open(mac_path, "a", encoding="utf-8") as f:
    f.write(task_line)
print("Updated multi_agent_control.csv!")

# 2. Update PROJECT_MEMORY.md
pm_path = r"C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md"
update_text = f"""

### Session Update: {datetime.date.today().strftime('%Y-%m-%d')} (Branch A - Tech / IoT Expansion)
- **Course**: Course 15: 3D Computer Graphics, WebGL2 & GPU Shader Architecture (`course-3d-graphics` / `g3d`)
- **Block**: Month 2 Block 9 (Days 41–45 & Milestone 9 Capstone)
- **Task Logged**: `TASK-2007`
- **Worktree**: `Present-Career-os` (Branch `main`)
- **Curriculum Delivered**:
  - **Day 41**: Hardware Ray Tracing Architecture, Ray Generation & Ray Queries (WebGPU / DXR) (3,101 words, all 5 parts >= 600w).
  - **Day 42**: Bounding Volume Hierarchy (BVH): Binned SAH Construction, Tree Compaction & GPU Traversal (3,163 words, all 5 parts >= 600w).
  - **Day 43**: Any-Hit Shaders, Alpha-Testing Cutouts & Shadow Rays (Ray Traced Hard & Soft Shadows) (3,238 words, all 5 parts >= 600w).
  - **Day 44**: Monte Carlo Ray Tracing, Importance Sampling (BRDF & Cosine Hemispheres) & Multiple Importance Sampling (MIS) (3,264 words, all 5 parts >= 600w).
  - **Day 45**: Milestone 9 Capstone: Real-Time Hardware-Accelerated Hybrid Ray Tracer & SVGF Spatio-Temporal Denoiser Engine (3,266 words, all 5 parts >= 600w).
- **Total Block Words**: 16,032 words added (avg 3,206.4 words/day, all 25 parts >= 600w).
- **Visuals**: On-disk Gate v2 envelopes `day-41.json` through `day-45.json` generated in `src/lib/data/lessonVisuals/g3d/` with `compare` template, zero numeric digits in captions (`!/\\d/`), and SHA-256 bindings.
- **Verification**:
  - `tests/g3d_days41_45_expansion.test.ts` (2/2 pass, 100%).
  - Full `tests/g3d_*.test.ts` suite (35/35 pass, 100%).
  - `npx tsc --noEmit` exited code 0 with 0 errors across the entire repository.
- **Status of Course 15 (`g3d`)**: **45 / 60 Days Complete (75.0%)**.
- **Next Target**: Course 15 Month 2 Block 10 (Days 46–50 & Milestone 10 Capstone): *Advanced Material Systems, Subsurface Scattering, Thin-Film Wave Interference & Real-Time Volumetric Clouds*.
"""

with open(pm_path, "a", encoding="utf-8") as f:
    f.write(update_text)
print("Updated PROJECT_MEMORY.md!")
