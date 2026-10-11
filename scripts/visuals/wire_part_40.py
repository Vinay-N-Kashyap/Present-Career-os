import os

file_path = 'scripts/visuals/compile-500p-srs-pdf.mts'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add import
import_stmt = "import { SOFTSKILLS_COMMUNICATION_MONTH_1_SPECS, SOFTSKILLS_COMMUNICATION_MONTH_2_SPECS } from './softskills-communication-masterclass-spec';\n"
git_import = "import { GIT_VERSION_CONTROL_MONTH_1_SPECS, GIT_VERSION_CONTROL_MONTH_2_SPECS } from './git-version-control-masterclass-spec';"

assert git_import in text, "Could not find git import!"
text = text.replace(git_import, git_import + "\n" + import_stmt, 1)

# 2. Add capstone mapping
capstone_stmt = "  if (courseId.includes('softskills') || courseId.includes('communication')) return 'ApexExecutiveComms: Enterprise Cross-Functional Alignment, Crisis Escalation & Principal Engineer Interview Portfolio Suite';\n"
git_capstone = "  if (courseId.includes('git')) return 'ApexEnterpriseGitOps: Sovereign Distributed Version Control & Enterprise Release Engineering Suite';"

assert git_capstone in text, "Could not find git capstone!"
text = text.replace(git_capstone, git_capstone + "\n" + capstone_stmt, 1)

# 3. Add card renderer
card_renderer = """
function renderSoftskillsCommunicationDayCard(day: any): string {
  const questsHtml = day.quests.map((q: any, i: number) => `
    <div style="margin-bottom: 2px;">
      <span style="font-family: monospace; font-size: 6.8pt; background: #ede9fe; color: #4338ca; padding: 1px 3px; border-radius: 2px;">${q.id || ('Q' + day.day + '.' + (i + 1))}</span>
      <strong>${q.name || q.title}</strong> <em>(${q.type})</em>: <span style="color: #475569;">${q.desc || q.description}</span>
    </div>
  `).join('');

  const ansIdx = day.situationalPuzzle.correctOptionIndex !== undefined ? day.situationalPuzzle.correctOptionIndex : (day.situationalPuzzle.answerIdx ?? 0);
  const debrief = day.situationalPuzzle.explanation || day.situationalPuzzle.debrief || '';

  return `
    <div class="daily-card" style="margin-bottom: 10pt; page-break-inside: avoid; border-left: 3px solid #4f46e5;">
      <div class="daily-card-header">
        <div>
          <span style="background: #4338ca; color: #e0e7ff; font-size: 7.5pt; font-weight: 700; padding: 1px 5px; border-radius: 2px;">Day ${day.day}</span>
          <strong style="margin-left: 6pt; font-size: 8.8pt; color: #312e81;">${day.title}</strong>
          <span class="stage-pill" style="background: #ede9fe; color: #4338ca;">${day.stageName}</span>
        </div>
        <span style="font-size: 7.2pt; color: #64748b;">Month ${day.month} &bull; Block ${day.blockNum} &bull; <strong>${day.quests.length} Quests</strong></span>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5pt; margin-bottom: 4pt; font-size: 7.2pt;">
        <div style="background: #f5f3ff; padding: 4pt 6pt; border-radius: 3px; border: 1px solid #ddd6fe;">
          <strong>🎯 Spoken Goal &amp; Invariant:</strong><br>
          <span style="color: #4338ca; font-weight: 600;">Goal:</span> ${day.spokenGoal}<br>
          <span style="color: #312e81; font-weight: 600;">Invariant:</span> <code>${day.conceptInvariant}</code>
        </div>
        <div style="background: #fef2f2; padding: 4pt 6pt; border-radius: 3px; border: 1px solid #fecaca; color: #991b1b;">
          <strong>⚠️ Failure Mode &amp; tryIt Bug:</strong><br>
          <strong>Failure:</strong> ${day.failureMode}<br>
          <strong>tryIt Friction:</strong> ${day.tryItFriction}
        </div>
      </div>

      <div style="background: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 3px; padding: 3pt 6pt; margin-bottom: 4pt; font-size: 7.0pt;">
        <strong style="color: #4338ca;">🪜 Socratic Hint Ladder:</strong>
        <ol style="margin: 2px 0 2px 14px; padding: 0; color: #312e81;">
          ${day.socraticHints.map((hint: string) => `<li>${hint}</li>`).join('')}
        </ol>
      </div>

      <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 3px; padding: 3pt 6pt; margin-bottom: 4pt; font-size: 7.0pt;">
        <strong style="color: #4338ca;">🧩 Situational Production Puzzle:</strong>
        <p style="margin: 2px 0; color: #1e293b;">${day.situationalPuzzle.scenario || day.situationalPuzzle.prompt}</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3pt; margin: 2px 0;">
          ${day.situationalPuzzle.options.map((opt: string, i: number) => `
            <div style="background: ${i === ansIdx ? '#ede9fe' : '#ffffff'}; border: 1px solid ${i === ansIdx ? '#4f46e5' : '#e2e8f0'}; padding: 2px 4px; border-radius: 2px; font-size: 6.8pt;">
              <strong>${String.fromCharCode(65 + i)}:</strong> ${opt} ${i === ansIdx ? '<strong style="color: #4338ca;">✓ [Optimal Systems Leadership Decision]</strong>' : ''}
            </div>
          `).join('')}
        </div>
        <div style="margin-top: 2px; color: #4338ca; font-size: 6.8pt;"><strong>Strategic Debrief:</strong> ${debrief}</div>
      </div>

      <div style="margin-top: 4pt; font-size: 7.2pt; border-top: 1px dashed #e2e8f0; padding-top: 3pt;">
        <strong style="color: #312e81;">4 Rigorous Quests (Concept &bull; Detective &bull; Mastery Assignment &bull; Incident Lab):</strong>
        <div style="margin-top: 2pt;">
          ${questsHtml}
        </div>
      </div>
    </div>
  `;
}
"""

anchor_card = "function renderGitVersionControlDayCard(day: any): string {"
assert anchor_card in text, "Could not find renderGitVersionControlDayCard!"
text = text.replace(anchor_card, card_renderer + "\n" + anchor_card, 1)

# 4. Add Part XL Section to buildDeepMasterclassesHtml
part40_code = """
  h += `
  <!-- ========================================================================= -->
  <!-- PART XL: PROFESSIONAL TECH COMMUNICATION & INTERVIEW MASTERY (60 DAYS) -->
  <!-- ========================================================================= -->
  <div class="page-break"></div>
  <div style="background: #0f172a; color: #ffffff; padding: 10pt 14pt; border-radius: 4pt; margin-bottom: 12pt; border-left: 6px solid #4f46e5;">
    <div style="display: flex; justify-content: space-between; align-items: baseline;">
      <h1 style="color: #e0e7ff; margin: 0; font-size: 14pt; border: none; padding: 0;">Part XL: Deep Masterclass Blueprint &mdash; Professional Tech Communication &amp; Interview Mastery (60 Days &bull; 240 Quests)</h1>
      <span style="font-size: 9pt; color: #c7d2fe; font-weight: 700;"><code>course-softskills-communication</code> &bull; Gate v2 True 9.8 Standard</span>
    </div>
    <p style="margin: 4pt 0 0 0; font-size: 8.5pt; color: #e0e7ff;">
      <strong>Directorate:</strong> VP of Engineering Leadership, Principal Systems Architect &amp; Global Head of Technical Talent Evaluation &bull; <strong>Pedagogical Cadence:</strong> Month 1 (Days 01&ndash;30 / 120 Quests) + Month 2 (Days 31&ndash;60 / 120 Quests) &bull; <strong>Volume:</strong> 240 Quests Total &bull; <strong>Sovereign Capstones:</strong> ApexSpeaker (M1) &amp; ApexExecutiveComms (M2)
    </p>
  </div>

  <h2>40.1 Month 1: Verbal Precision, Behavioral Interviewing, Written RFCs, Async Collaboration &amp; Incident Communications (Days 01&ndash;30 / 120 Quests)</h2>
  <p style="font-size: 8.2pt; color: #475569; margin-bottom: 8pt;">
    Month 1 establishes foundational and architectural mastery across technical communication physics: Information Theory in engineering discourse (Shannon entropy, signal-to-noise ratio, cognitive load minimization), structured verbal frameworks (PREP: Point Reason Example Point, Barbara Minto's Pyramid Principle, MECE arguments), technical precision vs jargon across cross-functional domains (metaphorical isomorphism), active listening, psychological safety (Amy Edmondson) and Non-Violent Communication (NVC) in high-stakes reviews, Milestone 1: ApexVoice Technical Executive Briefing Engine Suite, the art of de-risking technical questioning (Socratic inquiry, boundary discovery), constructive feedback and Conventional Comments PR review etiquette, Architecture Decision Records (ADRs: Context, Decision, Consequences, anti-amnesia), Request for Comments (RFC) engineering and multi-stakeholder consensus building, Milestone 2: ApexRFC Enterprise Architectural Consensus Engine Suite, production runbooks and zero-ambiguity disaster recovery procedures, asynchronous written communication hygiene (no-hello, self-contained dispatches, RACI matrices), technical release notes and breaking API deprecation workflows, blameless engineering post-mortems (Sydney Dekker systems safety, Five Whys, closed-loop action items), Milestone 3: ApexIncident Institutional Blameless Post-Mortem &amp; Runbook Suite, behavioral interview architecture and engineering leveling matrices (L4 to L7 scope), the STAR+L framework (15/10/50/15/10 time allocation rule), story mining and the 15-story Career Master Matrix, mastering conflict resolution stories (Andy Grove's Disagree and Commit), quantifying engineering impact into revenue and cost metrics, addressing production failure and vulnerability authentically, Milestone 4: ApexBehavioral Institutional Behavioral Interview Simulation &amp; Story Bank Suite, facilitating Architecture Review Boards (ARBs: Nemawashi, timeboxing, parking lots), engineering 1-on-1 upward management, principled technical negotiation (Iron Triangle, Chris Voss tactical empathy), crisis incident command communication (ICS bridge discipline, status pages), cross-functional alignment (Product, Design, Legal, Compliance), technical presentations and Edward Tufte visual storytelling, high-signal reverse-interviewing to detect toxic teams, and Capstone 1: ApexSpeaker Institutional Executive Technical Communication &amp; Behavioral Leadership Master Capstone Viva Gate.
  </p>

  ${(() => {
    let out = '';
    SOFTSKILLS_COMMUNICATION_MONTH_1_SPECS.forEach((day: any) => {
      out += renderSoftskillsCommunicationDayCard(day);
    });
    return out;
  })()}

  <div class="page-break"></div>
  <div style="background: #0f172a; color: #ffffff; padding: 10pt 14pt; border-radius: 4pt; margin-bottom: 12pt; border-left: 6px solid #4f46e5;">
    <div style="display: flex; justify-content: space-between; align-items: baseline;">
      <h1 style="color: #e0e7ff; margin: 0; font-size: 14pt; border: none; padding: 0;">Part XL: Professional Tech Communication &mdash; Month 2: System Design Whiteboarding, Staff+ Influence, Negotiation &amp; Governance (Days 31&ndash;60 / 120 Quests)</h1>
      <span style="font-size: 9pt; color: #c7d2fe; font-weight: 700;">Stage 4 &bull; Global Scale &amp; Principal Systems Architect Viva Gate</span>
    </div>
    <p style="margin: 4pt 0 0 0; font-size: 8.5pt; color: #e0e7ff;">
      <strong>Month 2 Scope:</strong> System design interview protocol (scope clarification, functional/non-functional bounds, back-of-the-envelope capacity estimations), driving the virtual whiteboard (top-down visual hierarchy, API contracts, iterative deep dives), communicating architectural trade-offs under pressure (CAP, PACELC, latency vs consistency, cost vs throughput), handling interviewer pushback and curveballs (graceful pivots, intellectual flexibility), Milestone 4 (M2): ApexDesign System Design Whiteboard Communication &amp; Live Trade-Off Suite, live coding communication during pair programming (thinking out loud without syntactic noise, milestone narration, test-driven exposition), scientific debugging under interview pressure (methodical hypothesis testing, trace tables), the four Staff Engineer archetypes (Will Larson: Tech Lead, Architect, Solver, Right Hand) and style modulation, building grassroots coalitions and bottom-up technology adoption (lighthouse teams, diffusion curves), Milestone 5: ApexInfluence Grassroots Engineering Coalition &amp; Tech Strategy Suite, managing executive C-suite stakeholders (Amazon 6-page narrative memos, risk heat maps, financial ROI translation), authoring 3-year North Star engineering strategy documents (Richard Rumelt Strategy Kernel, phased roadmaps), organizational culture and technical sponsorship (engineering career ladders, multiplication), navigating reorganizations, layoffs, and strategy pivots (preserving morale, asset salvage), Milestone 6: ApexStrategy Multi-Year Technical Vision &amp; Strategic Alignment Suite, tech offer evaluation (base, liquid RSUs, ISO/NSO options, 409A, liquidation preferences, AMT taxes), the compensation negotiation playbook (competing offers, non-monetary dials, polite closing triggers), navigating difficult performance conversations (Radical Candor, objective documentation, PIPs), delivering bad news to leadership (early escalation, mitigation options), Milestone 7: ApexNegotiation High-Stakes Tech Compensation &amp; Executive Negotiation Engine Suite, public speaking and tech conference CFPs, viral technical writing for publication (Hacker News mechanics, reproducible benchmarks), remote and distributed asynchronous sovereignty (GitLab handbook-first, Loom walkthroughs, global time zone hygiene), the complete Staff+ 5-round onsite interview gauntlet (Bayesian independence, mental resets), Historic Communication Catastrophe 1: Space Shuttle Challenger O-Ring Disaster (Edward Tufte data visualization critique), Historic Communication Catastrophe 2: Three Mile Island Nuclear Meltdown (command vs verified physical state telemetry), Historic Communication Catastrophe 3: Knight Capital $440M 45-Minute Algorithmic Bankruptcy (failed deployment communication, missing circuit breakers), Historic Communication Catastrophe 4: Mars Climate Orbiter Metric/Imperial Crash (unvalidated interface units, type-level dimensional branding), The Principal Engineer Modernization RFC: Restructuring Global Communication, ARBs &amp; Promotion Ladders ($5M Blueprint), and Capstone 2: ApexExecutiveComms Enterprise Cross-Functional Alignment, Crisis Escalation &amp; Principal Engineer Interview Portfolio Master Capstone Viva Gate.
    </p>
  </div>

  <h2>40.2 Month 2: System Design Whiteboarding, Staff+ Influence, Negotiation &amp; Governance (Days 31&ndash;60 / 120 Quests)</h2>

  ${(() => {
    let out = '';
    SOFTSKILLS_COMMUNICATION_MONTH_2_SPECS.forEach((day: any) => {
      out += renderSoftskillsCommunicationDayCard(day);
    });
    return out;
  })()}

  <div class="page-break"></div>
  <h2>40.3 Professional Tech Communication &amp; Interview Mastery Milestone &amp; Capstone Viva Gates (Milestones 1&ndash;7 + 2 Capstone Vivas)</h2>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 12%;">Milestone</th>
        <th style="width: 10%;">Day</th>
        <th style="width: 28%;">Milestone Gate Title</th>
        <th style="width: 50%;">Architectural Deliverable &amp; Invariant Defense</th>
      </tr>
    </thead>
    <tbody>
      <tr><td><strong>Milestone 1</strong></td><td>Day 05</td><td>ApexVoice Technical Executive Briefing Engine Suite</td><td>Executive technical communication suite synthesizing Information Theory, Minto Pyramid, cross-domain semantic translation, and financial risk quantification.</td></tr>
      <tr><td><strong>Milestone 2</strong></td><td>Day 10</td><td>ApexRFC Enterprise Architectural Consensus Engine Suite</td><td>Production-grade architectural proposal suite specifying mission-critical billing migration to an event-driven ledger with multi-stakeholder consensus.</td></tr>
      <tr><td><strong>Milestone 3</strong></td><td>Day 15</td><td>ApexIncident Institutional Blameless Post-Mortem &amp; Runbook Suite</td><td>Integrated reliability suite featuring a 6-page blameless incident retrospective, Five Whys trajectory, and zero-ambiguity disaster recovery runbook.</td></tr>
      <tr><td><strong>Milestone 4</strong></td><td>Day 22</td><td>ApexBehavioral Institutional Behavioral Interview Simulation &amp; Story Bank Suite</td><td>Fully indexed 15-story Career Master Matrix with STAR+L time allocations, business metric quantifications, and Bar Raiser leveling calibration.</td></tr>
      <tr><td><strong>Capstone 1</strong></td><td>Day 30</td><td><strong>Month 1 Capstone Viva Gate</strong></td><td><strong>ApexSpeaker Institutional Executive Technical Communication &amp; Behavioral Leadership Master Capstone:</strong> Comprehensive technical leadership platform uniting executive briefings, STAR+L behavioral war stories, and live P0 crisis incident command defended before Senior Review Board.</td></tr>
      <tr><td><strong>Milestone 4 (M2)</strong></td><td>Day 35</td><td>ApexDesign System Design Whiteboard Communication &amp; Live Trade-Off Suite</td><td>Planetary-scale distributed system design communication suite featuring capacity math, top-down whiteboard navigation, CAP/PACELC trade-off defense, and graceful curveball pivots.</td></tr>
      <tr><td><strong>Milestone 5</strong></td><td>Day 40</td><td>ApexInfluence Grassroots Engineering Coalition &amp; Tech Strategy Suite</td><td>Grassroots technical influence framework driving bottom-up enterprise adoption of foundational architecture across 300+ engineers without direct managerial authority.</td></tr>
      <tr><td><strong>Milestone 6</strong></td><td>Day 45</td><td>ApexStrategy Multi-Year Technical Vision &amp; Strategic Alignment Suite</td><td>3-year North Star architecture strategy and self-funding roadmap synchronizing architectural evolution with corporate capital allocation and headcount capacity.</td></tr>
      <tr><td><strong>Milestone 7</strong></td><td>Day 50</td><td>ApexNegotiation High-Stakes Tech Compensation &amp; Executive Negotiation Engine Suite</td><td>High-stakes compensation negotiation playbook and executive bad-news escalation protocol securing top-tier compensation terms while preserving executive trust.</td></tr>
      <tr><td><strong>Master Capstone</strong></td><td>Day 60</td><td><strong>Month 2 Master Capstone Viva</strong></td><td><strong>ApexExecutiveComms Enterprise Cross-Functional Alignment, Crisis Escalation &amp; Principal Engineer Interview Portfolio Master Capstone:</strong> Complete sovereign enterprise communication and Principal Engineer interview portfolio uniting system design whiteboarding, executive negotiation, crisis command, and the $5M Modernization RFC defended under live adversarial viva voce examination.</td></tr>
    </tbody>
  </table>
  `;
"""

part39_end_table = "      <tr><td><strong>Master Capstone</strong></td><td>Day 60</td><td><strong>Month 2 Master Capstone Viva</strong></td><td><strong>ApexEnterpriseGitOps Sovereign Distributed Version Control &amp; Enterprise Release Engineering Suite Master Capstone:</strong> Institutional monorepo release engineering and governance platform unifying SHA-256 migration, multi-tenant submodules/subtrees, GitOps reconciliation with ArgoCD/Flux, SLSA Level 3 provenance attestation, and disaster recovery RFC defended under live adversarial viva voce examination.</td></tr>"
assert part39_end_table in text, "Could not find part39_end_table!"

idx = text.find(part39_end_table)
end_table_idx = text.find("</table>", idx)
end_backtick_idx = text.find("`;", end_table_idx)

slice_to_replace = text[end_table_idx:end_backtick_idx+2]
text = text[:end_backtick_idx+2] + part40_code + text[end_backtick_idx+2:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Successfully wired Course 36 (Part XL) into compile-500p-srs-pdf.mts!")
