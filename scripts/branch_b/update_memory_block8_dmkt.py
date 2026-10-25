import datetime

memory_file = r"C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md"
now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def update_memory(commit_hash):
    entry = f"""
## [{now_str}] - Branch B: Course 06 (Digital Marketing Analytics & Performance / bcom_dmkt) Month 2 Block 8 (Days 36–40 & Milestone 8 Capstone) 100% Complete & Certified
- **Branch**: `agent/branch-b-curriculum-commerce-iot` (Branch B: Commerce Month 2 Expansion)
- **Worktree**: `Present-Career-os-commerce`
- **Course**: Course 06: Digital Marketing Analytics & Performance (`bcom_dmkt` / `src/lib/data/bcomDmktLongLessons.ts`)
- **Block**: Month 2 Block 8 (Days 36–40 & Milestone 8 Capstone):
  - Day 36: Server-Side Tagging & Conversions API (CAPI): Server GTM, Cloud Run, Event Deduplication & Event Quality Score (EQS) (3,904 words)
  - Day 37: Privacy-Preserving Ad Tech & The Privacy Sandbox: Topics API, Protected Audience API (PAAPI), Attribution Reporting API & Consent Mode v2 (3,456 words)
  - Day 38: Customer Data Clean Rooms (CDCR): Snowflake, AWS Clean Rooms, Habu, Differential Privacy & Secure Multiparty Computation (SMPC) (3,160 words)
  - Day 39: Advanced Predictive Customer Lifetime Value (pCLV): Buy 'Til You Die (BTYD), Pareto/NBD, BG/NBD & Gamma-Gamma Spend Models (3,467 words)
  - Day 40: 🌟 Milestone 8 Capstone: Enterprise Privacy-Safe Ad Architecture, Clean Room Collaboration & Predictive Lifetime Value War Room (3,102 words; minutes: 60)
- **Total Block Words**: 17,089 words across 25 parts (average 683.6 words/part, 3,417.8 words/day; all 25 parts >= 600 words)
- **Gate v2 Visual Envelopes**: `src/lib/data/lessonVisuals/bcom_dmkt/day-36.json` through `day-40.json` generated with `schemaVersion: 1`, `funnel` template, cryptographic SHA-256 bindings, and ZERO numeric digits in captions (`!/\\d/`, <= 75 chars, period-terminated).
- **Verification & Testing**:
  - `tests/bcom_dmkt_days36_40_expansion.test.ts`: 7/7 tests PASS (100%).
  - Full Regression checks: `tests/bcom_dmkt_days31_35_expansion.test.ts` (7/7 PASS) and `tests/bcom_ecom_dmkt_long_lessons.test.ts` (54/54 PASS).
  - TypeScript Compilation: `npx tsc --noEmit` verified with 0 errors.
- **Task Logging**: Appended non-colliding `TASK-2148` through `TASK-2152` to `agent_tasks.csv` (Commit: `{commit_hash}`).
- **Course Status**: Course 06 (`bcom_dmkt`) now at **40 / 60 Days (66.67% Complete)**.
- **Next Assignment**: Advance immediately to Month 2 Block 9 (Days 41–45: Real-Time Bidding (RTB) Protocol & Programmatic Supply Chain: OpenRTB 2.5/3.0, Header Bidding (Prebid.js), Supply Path Optimization (SPO), Dynamic Flooring & Fee Transparency, and Milestone 9 Capstone).
"""

    with open(memory_file, "a", encoding="utf-8") as f:
        f.write(entry)
    print("Updated PROJECT_MEMORY.md successfully!")

if __name__ == "__main__":
    import sys
    commit = sys.argv[1] if len(sys.argv) > 1 else "PENDING"
    update_memory(commit)
