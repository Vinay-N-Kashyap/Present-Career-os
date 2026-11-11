# PinIT Career OS — The Complete Student Guide

> Everything a student needs to know: what PinIT is, how to start, how learning works, how you earn and spend Pins and XP, how you get proof of your skills, and how that proof reaches recruiters.
>
> **How this guide was made:** it is written from the project's own code and docs (`docs/`, `src/`). Where a feature is marked **(planned)** the app itself says it is not live yet. Numbers such as Pin costs come straight from the code and may change — the app is always the final word.

---

## 1. What is PinIT Career OS?

PinIT Career OS is a career-training platform. Instead of just watching videos, you **learn a little every day, prove it, and collect verified evidence** of what you can do. That evidence becomes your **Skill Passport**, which recruiters and your college can trust.

The core idea (the "evidence loop"):

```
LEARN → PRACTICE → BUILD → DEBUG → TRANSFER → ASSESS → EVIDENCE → COMPETENCY → CREDENTIAL
```

You are never marked as "done" because you sat through a class. You are marked as done when you **perform**: solve an unfamiliar problem, defend your design, pass a proctored check.

**Who is it for?**
- Engineering / IT students (web, cloud, AI, IoT, security, and more)
- B.Com / BBA / MBA students (accounting, finance, marketing, analytics, operations, and more)
- Anyone who needs basics first (computer literacy, everyday AI, Excel, Git, communication)

---

## 2. Your first 10 minutes

### 2.1 Sign up and onboarding
1. Create an account at `/signup` (or log in at `/login`).
2. You go to **Onboarding** (`/onboarding`) — **10 short questions in plain language**, no technical words:
   - **3 "About you" questions:** what you study, what you want next, which kind of work sounds fun. These pick your **career track**.
   - **6 "Daily life" questions:** everyday situations (a broken phone, a trip, learning something new, an exam, a quarrel, a sudden change). Each answer shows one of four thinking styles.
   - **1 tie-breaker:** asked only if two styles are level.
3. You get a plain result card, e.g. *"You are an Explorer."* Your mentor avatar says it too.

### 2.2 The four thinking styles (your "persona")

| Style | Short name | What it means | The lesson music matches it |
|---|---|---|---|
| Thinker | Pattern Hunter | Spots patterns, digs into causes | Deep focus synth |
| Explorer | Explorer | Curious, tries new things | Chill lo-fi beats |
| Planner | Stabilizer | Steady, organised, calm under pressure | Ambient zen drone |
| People Person | Social IQ | Learns and works through people | Soft piano |

There are also six **Career DNA archetypes** (`/career-dna`) — Strategist, Builder, Visionary, Operator, Analyst and more — each with best-fit roles (e.g. Builder → Software Engineer, Full-Stack, DevOps). Your persona shapes how lessons are explained to you and which roadmap is recommended. It is a guide, not a label — you can change your path later.

### 2.3 Meet your mentor
A 3D **floating avatar mentor** lives in the corner of every page. On your first visit to the dashboard it gives an **11-step tour** of every tab. Afterwards it explains whichever page you are on, congratulates you after quests/interviews/discussions, and understands simple commands like "take me to interview". It hides itself in full-screen sessions (lessons, interviews, simulations) so it never gets in the way.

You can pick your teacher/mentor from a cast of 15 characters (friendly mentors, strict interviewers, a security auditor, a UX expert, and more).

---

## 3. The map: what is in the sidebar

| Tab | Address | What it is for |
|---|---|---|
| Home Dashboard | `/dashboard` | Your streak, XP, progress, verified achievements |
| Career Builder | `/career-builder` | Builds your personal roadmap + ATS resume intelligence |
| Quests | `/quests` | Your daily lessons, exams and assignments (main learning) |
| Daily Missions | `/missions` | Workplace-crisis simulations (soft skills + judgment) |
| AI Interview | `/interview` | Practice interviews with an AI interviewer |
| Career Twin | `/career-twin` | Simulates your future career path |
| Career DNA | `/career-dna` | Your archetype and strengths |
| Opportunities | `/opportunities` | Jobs / internships matched to you |
| Group Discussion | `/group-discussion` | Boardroom debate with AI colleagues |
| Code Arena / Code Wars | `/arena`, `/code-wars` | 1v1 coding battles and Elo rating |
| Projects & Squads | `/projects`, `/teams` | Real projects, alone or with a squad |
| Leaderboard | `/leaderboard` | Weekly league standings |
| Friends | `/friends` | Connect with classmates |
| Pins | `/pins` | Your balance, history and top-ups |
| Passport | `/passport` → `/quests?tab=passport` | Your verified skill transcript |

> **Sidebar rule:** only one sidebar (left or right) can be open at a time — opening one closes the other. The floating avatar moves so it never covers content.

---

## 4. Learning: Tracks, Quests and the S-Curve Method

### 4.1 Choose a track
PinIT has **36 career roadmaps ("tracks")**, each built as **30 hand-crafted daily quests**. Examples:

**Technology:** Java · Full-Stack React · Full-Stack JavaScript · Python & Backend · Cloud Native (AWS) · DevOps & CI/CD · Data Structures & Algorithms · Databases · Distributed Systems · Mobile Apps · Cybersecurity · AI Engineering & LLMs · NLP · UI/UX Design Systems · 3D Graphics · Blockchain/Web3 · Quant/Low-latency Trading · IoT (embedded, wireless networks, Edge AI/TinyML, industrial security)

**Commerce / Business (B.Com · BBA · MBA):** Digital Accounting & Taxation · Business Finance & Investment · Business Analytics · Marketing & Brand · Digital Marketing & Growth · E-Commerce · Entrepreneurship · Sales, CRM & Customer Success · Operations, Supply Chain & Compliance · AI & Digital Transformation

**Foundations for everyone:** Computer Literacy & OS · Everyday AI & Prompt Engineering · Excel & Data Analysis · Git & GitHub · Professional Communication & Interview Mastery

There is also a long-form **24-month Professional Advanced Program** (Full-Stack Software Engineering) with a **12-month Professional Certificate** exit at the halfway point: Year 1 = foundations + full-stack core (computers, browser & networking, HTML/CSS/accessibility/Git, JavaScript, async, React, Node, databases, DevOps…); Year 2 = 3 industry projects, a verified internship/practicum, a specialisation and a capstone with a live viva.

### 4.2 The 5-step S-Curve Method
1. **Pick a track** — one concept at a time, so you never burn out (a "1-concept cognitive budget").
2. **Do the 30 daily micro-quests.** Each day has 3 blocks:
   - a Socratic dialogue using everyday metaphors,
   - interactive practice with live test checks,
   - a proctored challenge judged in an isolated in-browser sandbox.
3. **Get unstuck the kind way.** When you fail, you get: ① a hint with a real-world analogy → ② a check of the rule you broke → ③ a small guided scaffold. No scary stack traces.
4. **Milestones and capstone.** Every 5 days: a milestone project. Day 30: a capstone, checked by automated code analysis. The longer program ends with an **oral defense** where you explain your decisions.
5. **Get matched.** Your verified passport and Code Wars rating go into the recruiter pipeline.

### 4.3 What a lesson looks like (`/quests/lesson`)
- Full-screen, distraction-free classroom with your chosen teacher avatar speaking.
- The teacher walks through code **line by line, out loud**.
- Background music matches your persona and **automatically ducks** (goes quiet) when the teacher talks. Adjust the volume in **Profile → Preferences**.
- Ends with a **5-question exam**: questions 1–3 are generated from the syllabus; 4–5 are fixed benchmark questions (e.g., speed/complexity and safety).
- On phones, tap **"Tap to Unmute Teacher Voice"** once (iOS/Android block auto-sound).

Quest types you will see on your roadmap:
- 🎓 **Learning Class** — the guided lecture
- 📝 **Coding Exam** — timed
- 💻 **Assignment** — a coding sandbox

Your roadmap is grouped into Beginner → Intermediate → Advanced stages with progress bars (e.g., "1 / 2 quests completed").

### 4.4 Tips
- One quest a day beats five on Sunday. Streaks matter (see §6).
- If you are stuck, use the 3-step recovery before asking for the answer.
- Take exams honestly — they are proctored and the result is your evidence.

---

## 5. Practice arenas

### 5.1 AI Interview (`/interview`)
- A multi-round interview (roles-weighted) with an AI interviewer, spoken aloud.
- Includes a **coding round** — and importantly, the coding round is **judged from the code you actually recorded**, not from a score the page reports. The server records each interview and scores that record, so results are trustworthy.
- Verdicts are "Hire" or "No Hire" with feedback. A "No Hire" is a learning result — retry.
- Costs Pins (see §7).

### 5.2 Group Discussion (`/group-discussion`)
- A Zoom-style boardroom with up to 14 AI colleagues, each with a role and a voice.
- Hands-free: after each speaker, your mic turns on.
- **Difficulty:** Easy = 16 s to reply · Medium = 12 s · Hard = 8 s and the AIs interrupt.
- Type **any** topic you like; the debate is built around it.
- Your report is scored; 70+ counts as a strong session.

### 5.3 Daily Missions — Mindset Simulator (`/missions`)
- Real workplace crises: an outage, pressure from a boss, scope creep, blame-shifting.
- 8 turns, ~7 minutes, 25 seconds per decision (the timer waits while the avatar speaks).
- A **Cognitive Stress Index** rises when you choose panicked, rushed answers and falls when you choose calm, analytical ones. It teaches you to slow down under pressure.
- Ends with a Socratic Evolution Report.

### 5.4 Code Arena & Code Wars (`/arena`, `/code-wars`)
- 1v1 coding battles; wins move your Elo rating, which recruiters can see.
- Your code runs in a sandbox; the judge decides, not the browser.

### 5.5 Attention Span game, ATS resume screener, JD match
- **Attention Span** game: short focus training.
- **ATS Resume audit:** paste/upload your resume → score, missing sections, quick wins.
- **JD Match:** compare your resume with a job description.

### 5.6 Projects & Squads (`/projects`, `/teams`)
Build real projects alone or in a squad. Submitted work is verified and reviewed (costs Pins) — it becomes portfolio evidence.

---

## 6. XP, levels, streaks, leagues and badges

- **XP (experience points)** — earned for verified activity. The **server** grants XP after it verifies the work; your browser cannot decide the amount. Each grant is written to an XP ledger, so it is auditable.
- **Level** — rises with total XP.
- **Daily streak** — do at least one mission/quest daily. Face check-in on the attendance page (if your college uses it) also keeps your **Focus Streak Multiplier**.
- **Weekly Leagues** — five tiers: **Browns → Silver → Gold → Platinum → Ruby**. Only students are ranked. At the end of the week, the top ~10% of a tier move up, and (in tiers of 10+) the bottom ~10% move down. Your weekly XP decides everything — a fresh week is a fresh chance.
- **Badges & prestige milestones** — awarded only when the server confirms you qualify. Examples: **7-Day Streak Master**, **Trust Guardian 90**, **Trust Sentinel 99** (each with an XP bonus). Categories: trust, streak, quest, interview, academic, special.
- **Trust Score** — grows with verified proofs and honest behaviour. Cheating hurts it.

---

## 7. Pins — the platform's currency

Pins pay for the premium, AI-heavy activities (AI voice, interviews, simulations).

| Activity | Pin cost | Access |
|---|---|---|
| Quest | 20 | 30 minutes |
| Daily Mission | 20 | 30 minutes |
| AI Interview | 35 | 30 minutes |
| Group Discussion | 35 | 30 minutes |
| Code Arena 1v1 | 10 | per battle |
| Project verification & review | 10 | per submission |
| Group project collaboration | 10 | — |
| Attention Span game | 5 | per play |
| Resume AI enhancement | 15 | — |
| Career Twin simulation | 30 | — |
| Career Assets generation | 20 | — |
| Personality analysis / Career DNA recalculation | 10 | — |
| JD match | 5 | — |
| Extend AI session by 30 min | 100 | — |
| 1-month fast-track course plan | 500 | — |

**Getting Pins**
- Basic-plan students receive **120 free Pins every day at 1:00 AM IST**.
- Top up any time at **₹1 = 10 Pins**: 100 (₹10) · 300 (₹30) · 500 (₹50) · 1000 (₹99).
- Bonus Pins may be granted (e.g., pack bonuses) and are spent along with your normal Pins.

**Budgeting tip:** 120 daily Pins ≈ one quest (20) + one mission (20) + one interview (35) + one discussion (35) + a little left over.

Everything you spend or earn is listed on `/pins` with an efficiency summary and breakdown.

---

## 8. Your proof: Skill Passport, certificates, portfolio

- **Skill Passport** (`/passport`, or `/profile?tab=passport`): a verified transcript of what you have proven — competencies, quest and interview evidence, and course-outcome matrices.
- **Certificates:** a **course certificate** when you finish a track and a **roadmap certificate** for completing a whole roadmap. Each has a credential ID, so anyone can verify it at `/verify/<credentialId>`.
- **Portfolio** (`/portfolio`): completed quests and verified projects appear automatically as "verified achievements".
- **Credential fairness:** the platform has published policies for issuance, appeals and revocation (see `docs/PINIT_CREDENTIAL_*` files). If you believe an assessment was wrong, you can appeal.

---

## 9. Career side: resume, opportunities, recruiters

1. **Career Builder** → builds your roadmap and shows ATS intelligence for your target role (e.g., *React Frontend SDE*, *Java Backend SDE*, *DevOps Cloud SDE*).
2. **ATS Resume Screener** → fix your resume until the score is strong.
3. **Opportunities / Internships** → matched roles; verified project and internship standards are documented in `docs/PINIT_PROJECT_AND_INTERNSHIP_VERIFICATION_STANDARD.md`.
4. **Recruiter pipeline** — recruiters move candidates through six stages: *Submitted → ATS Screened → AI Interviewed → Shortlisted → Offered → Hired*, and can send you an **AI interview invitation**.
5. **Placement drive** module and paid plans on the pricing page are marked **planned for Q3 2026** — check the app for current availability.

---

## 10. College, teachers and parents

If your institution uses PinIT:

- **Attendance** (`/attendance`): AI face check-in each day; apply for leave (Medical, Academic, Personal) and your teacher approves or rejects it.
- **Teacher Studio:** teachers mark attendance, approve leave, and see class progress.
- **Parent Portal:** linked guardians can see your ATS score, CGPA, streak and alerts, and acknowledge notices. (Ask your parents to use the parent login, never your own.)
- **Consultant / advisor:** if your engagement or attendance drops, an advisor may reach out to help — it is support, not punishment.
- **Finance desk:** term fees, receipts and vouchers. Fee records are visible to the finance office (admins), not to other teachers.
- **Other services:** library, hostel, transport, events, exams and results, grievances — available under the university portals.
- **University analytics:** your college sees anonymised/aggregated placement readiness by department and batch.

---

## 11. Rules that keep it fair (please read)

- **Do your own work.** Coding rounds and exams are proctored and the platform records your real attempts. Faking evidence lowers your Trust Score and can revoke credentials.
- **AI is a tutor, not the answer key.** Read `docs/PINIT_CANDIDATE_ASSESSMENT_RULES_AND_AI_POLICY.md` for what AI help is allowed in assessments.
- **Face and mic data:** used for attendance and interview practice; permissions are requested by your browser and can be revoked in browser settings.
- **Leaderboards rank real students only** — no bots, no made-up students.

---

## 12. Troubleshooting (FAQ)

| Problem | Try this |
|---|---|
| No teacher voice on phone | Tap **"Tap to Unmute Teacher Voice"** once |
| Not enough Pins | Wait for the 1:00 AM IST refill or top up on `/pins` |
| Avatar shows a flat 2D card | Refresh; switch mentor; check WebGL/GPU is enabled in your browser |
| Mic not working in Group Discussion | Allow microphone for the site; use Chrome/Edge (uses browser speech recognition) |
| Interview stuck on a round | Refresh once; your recorded work is saved server-side |
| League rank looks wrong | Ranks are decided once weekly from a snapshot; check next reset |
| Leave request not approved | Your teacher approves it in Teacher Studio — follow up with them |
| Payment done but no Pins | Wait a minute for the payment webhook; then contact support with the receipt |
| Found a bug or a wrong answer | Report it — accuracy of assessments is taken seriously; you can appeal a result |

---

## 13. A suggested first-week plan

| Day | Do this |
|---|---|
| 1 | Sign up, finish onboarding (10 questions), take the mentor tour, choose a track |
| 2 | Quest Day 1 + upload your resume to the ATS screener |
| 3 | Quest Day 2 + one Daily Mission |
| 4 | Quest Day 3 + read your Career DNA |
| 5 | Quest Day 4 + first Group Discussion (Easy) |
| 6 | Quest Day 5 (milestone) + practice AI Interview |
| 7 | Check `/leaderboard`, `/pins`, and your Passport; plan next week |

Consistency beats intensity: 30 days of one quest a day gives you a finished track, a capstone and a verified passport.

---

## 14. Quick glossary

- **Quest** — one day's guided lesson + practice + challenge
- **Track / Roadmap** — a full 30-day course for one career
- **Persona** — your thinking style from onboarding
- **Pins** — spendable currency for AI-powered activities
- **XP** — points for verified work; drives levels and leagues
- **League** — weekly ranking tier (Browns → Ruby)
- **Passport** — your verified skill transcript
- **Credential ID** — code that lets anyone verify your certificate
- **Trust Score** — integrity score built from verified evidence
- **Capstone / Viva** — final project and oral defense
- **Socratic** — learning by guided questions instead of being told the answer
- **ATS** — the software companies use to filter resumes

---

*Guide generated from the repository (docs/, src/) on 2026-09-29. Feature names, prices and limits are taken from the code at that time.*
