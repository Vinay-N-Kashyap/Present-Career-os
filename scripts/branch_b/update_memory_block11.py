"""
Update agent_tasks.csv and PROJECT_MEMORY.md with Block 11 (Days 51-55 & Milestone 11 Capstone).
"""

import datetime

TASKS_CSV = r"C:\Users\Admin\Desktop\projects\memory of agent\agent_tasks.csv"
PROJECT_MEMORY = r"C:\Users\Admin\Desktop\projects\memory of agent\PROJECT_MEMORY.md"

now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

new_tasks = [
    f'TASK-1981,"bcom_tax Day 51: First Appellate Architecture: CIT(Appeals) Sec 246A & Faceless Appeals Scheme Sec 250",Completed,57b67847,Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,{now_str}\n',
    f'TASK-1982,"bcom_tax Day 52: Dispute Resolution Panel (DRP) Architecture Sec 144C Collegiate Review & Direct ITAT Gateway",Completed,57b67847,Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,{now_str}\n',
    f'TASK-1983,"bcom_tax Day 53: Income Tax Appellate Tribunal (ITAT) Architecture Sec 253 Sec 254 & Sec 254(2A) Stay Regime",Completed,57b67847,Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,{now_str}\n',
    f'TASK-1984,"bcom_tax Day 54: High Court & Supreme Court Tax Litigation Architecture Sec 260A Substantial Question of Law & Art 226 Writs",Completed,57b67847,Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,{now_str}\n',
    f'TASK-1985,"bcom_tax Day 55: Milestone 11 Capstone: Enterprise Multi-Tier Appellate Litigation DRP Objections & ITAT Defense Simulator",Completed,57b67847,Present-Career-os-commerce,agent/branch-b-curriculum-commerce-iot,{now_str}\n',
]

with open(TASKS_CSV, "a", encoding="utf-8") as f:
    for t in new_tasks:
        f.write(t)

print("Appended tasks 1981-1985 to agent_tasks.csv!")

memory_entry = f"""

### [2026-10-25] Branch B Milestone: Course 03 `bcom_tax` Month 2 Block 11 (Days 51–55 & Milestone 11 Capstone) CONQUERED & PUSHED (57b67847)
- **Worktree**: `Present-Career-os-commerce`
- **Branch**: `agent/branch-b-curriculum-commerce-iot`
- **Scope**: Month 2 Block 11 (Days 51–55) of Course 03: Corporate Tax, GST & Direct Taxation (`bcomTaxLongLessons.ts`):
  - **Day 51**: First Appellate Architecture: Commissioner of Income-tax (Appeals) under Section 246A, electronic Form 35 filing within 30 days, mandatory payment of admitted tax under Section 249(4), condonation of delay under Section 249(3), appellate powers under Section 251 (annulment, enhancement, statutory bar on remand), admission of additional evidence under Rule 46A, and the Faceless Appeal Scheme under Section 250 (3,320 words across 5 parts; 5 Socratic checks).
  - **Day 52**: Dispute Resolution Panel (DRP) Architecture under Section 144C: Eligible assessee taxonomy under Section 144C(15)(b), mandatory draft assessment order under Section 144C(1) (*Vijay Television* doctrine), bifurcated choice under Section 144C(2), electronic Form 35A objections, collegiate bench of three Commissioners under Section 144C(5), non-extendable 9-month limitation under Section 144C(12) (*Louis Dreyfus* / *Roca Bathroom Products*), binding directions under Section 144C(10), AO 1-month final order under Section 144C(13), and direct ITAT gateway under Section 253(1)(d) (3,155 words across 5 parts; 5 Socratic checks).
  - **Day 53**: Income Tax Appellate Tribunal (ITAT) Architecture: Section 252 constitution under Ministry of Law and Justice, doctrine of final fact-finding authority (*Ajay Gandhi* / *Scindia Steam*), Section 253 appealable orders, Form 36 e-filing within 60 days, graduated fees under Section 253(6) capped at ₹10,000, Memorandum of Cross-Objections in Form 36A within 30 days with zero fee under Section 253(4), Rule 27 defense, Section 254(2A) mandatory 20% stay deposit regime, Supreme Court ruling in *DCIT v. Pepsi Foods Ltd.* striking down automatic vacation after 365 days, and Section 254(2) rectification of mistake apparent from record (*Volkart Brothers*) within 6 months (3,152 words across 5 parts; 5 Socratic checks).
  - **Day 54**: High Court & Supreme Court Tax Litigation Architecture: Section 260A statutory appeals within 120 days, 'Substantial Question of Law' test in *Sir Chunilal Mehta* and *Santosh Hazari*, bar on reappreciating pure findings of fact absent perversity (*P. Mohanakala* / *Softbrands India*), CBDT litigation policy monetary limits under Section 268A (Circular 17/2019 / 5/2024: ₹50L ITAT, ₹1 Cr HC, ₹2 Cr SC) and carve-out exceptions, Section 261 appeals on certificate of fitness, Article 136 Special Leave Petitions (SLP) and *Kunhayammed* doctrine of merger, and Article 226/227 constitutional writ petitions under four *Whirlpool Corporation* exceptions (3,212 words across 5 parts; 5 Socratic checks).
  - **Day 55**: 🏆 **Milestone 11 Capstone: Enterprise Multi-Tier Appellate Litigation, DRP Objections & ITAT Defense Simulator**: Multi-year corporate tax defense for Apex Precision Technologies Ltd. (APTL, ₹1,800 Cr turnover, Indo-Japanese robotics manufacturer); Section 144C draft order defense on ₹45 Cr intra-group engineering services TP addition and ₹15 Cr software royalty disallowance under Section 40(a)(ia); Form 35A collegiate DRP defense deleting ₹30 Cr of TP addition under *EKL Appliances*; Section 144C(13) final order compliance audit; direct ITAT appeal in Form 36 under Section 253(1)(d); Section 254(2A) stay petition calculating 20% deposit of ₹1.97 Cr with 180-day stay and *Pepsi Foods* protection; ITAT final deletion of remaining ₹30 Cr additions under *Engineering Analysis*; High Court Section 260A preliminary objection dismissing Revenue appeal in limine for lack of substantial law; Section 240 refund with Section 244A statutory interest; master accreditation: `ENTERPRISE_TAX_APPELLATE_MASTER_PASS` (3,192 words across 5 parts; 5 Socratic checks).
- **Pedagogical Invariants**:
  - Exactly 5 parts per day; every part $\ge 600$ words (total Block 11 volume: **16,031 words**).
  - 5 Socratic checks per day with 4 options, `answer: 0, answerIndex: 0`, and detailed statutory `why` ($\ge 25$ words).
  - 5 Gate v2 visual JSON files in `src/lib/data/lessonVisuals/bcom_tax/day-{{51..55}}.json` with 25 entries, 100 synchronized steps, caption length $\le 75$, ending with `.`, zero digits (`!/\\d/`).
- **Verification**:
  - `tests/bcom_tax_days51_55_expansion.test.ts`: **10 / 10 PASS**.
  - All `bcom_tax` test suites across platform: **79 / 79 PASS**.
  - TypeScript compilation `npx tsc --noEmit`: **0 errors (Exit code 0)**.
- **Course Status**: Course 03 `bcom_tax` is now at **55 / 60 Days (91.67% complete)**. Exactly 5 days remain to 100% course conquest (Block 12: Days 56–60 & Grand Master Capstone).
"""

with open(PROJECT_MEMORY, "a", encoding="utf-8") as f:
    f.write(memory_entry)

print("Updated PROJECT_MEMORY.md with Block 11 milestone!")
