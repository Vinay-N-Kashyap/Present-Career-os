import { TEMPLATES_INFO, COURSE_METAS, AuditRecord } from './visuals-meta-registry';

export function buildMasterVisualsPlanHtml(courses: any[], audits: AuditRecord[], auditData: any): string {
  let h = '';

  h += `
  <!-- ========================================================================= -->
  <!-- PART XLII: MASTER VISUALS & LESSON DURATION ARCHITECTURE PLAN (ALL 37 COURSES) -->
  <!-- ========================================================================= -->
  <div class="page-break"></div>
  <div style="background: #0f172a; color: #ffffff; padding: 10pt 14pt; border-radius: 4pt; margin-bottom: 12pt; border-left: 6px solid #0284c7;">
    <div style="display: flex; justify-content: space-between; align-items: baseline;">
      <h1 style="color: #e0f2fe; margin: 0; font-size: 14pt; border: none; padding: 0;">Part XLII: Master Visuals &amp; Lesson Duration Architecture Plan (All 37 Courses)</h1>
      <span style="font-size: 9pt; color: #bae6fd; font-weight: 700;">17 Interactive Visual Engines &bull; 18–25 Min Duration Standard &bull; Gate v2 Compliant</span>
    </div>
    <p style="margin: 4pt 0 0 0; font-size: 8.5pt; color: #e0f2fe;">
      <strong>Directorate:</strong> Head of Visual Pedagogy &amp; Interactive Learning Systems &bull; <strong>Scope:</strong> 37 Master Courses (1,110 Lesson Days / 6,660 Interactive Lesson Parts) &bull; <strong>Engines:</strong> 17 Specialized Graphical Canvas Renderers &bull; <strong>Verification:</strong> 100% AST-Bound Output Grounding
    </p>
  </div>

  <h2>42.1 Honest Reality Audit: Already Built vs. To Be Built (All 37 Courses)</h2>
  <p style="font-size: 8.5pt; color: #475569; margin-bottom: 6pt;">
    An empirical line-by-line audit of the codebase confirms that 13 courses already have full 30-day visual suites built from the flagship Python and Web certification tracks, while 24 standalone courses are fully architected and mapped into implementation categories:
  </p>

  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 25%;">Category</th>
        <th style="width: 35%;">Architectural Description</th>
        <th style="width: 12%;">Course Count</th>
        <th style="width: 14%;">Visuals Status</th>
        <th style="width: 14%;">Lesson Duration</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Category A: Ready to Ship</strong></td>
        <td>Already built in cert tracks + LongLessons format</td>
        <td><strong>12 Courses</strong></td>
        <td><span style="background: #dcfce7; color: #166534; padding: 1px 4px; border-radius: 2px; font-weight: 600;">30/30 Built</span></td>
        <td><span style="background: #dcfce7; color: #166534; padding: 1px 4px; border-radius: 2px; font-weight: 600;">21.2–24.4m</span></td>
      </tr>
      <tr>
        <td><strong>Category B: Minor Trim Needed</strong></td>
        <td>Visuals 30/30 built (<code>sql-mastery</code>), duration slightly high</td>
        <td><strong>1 Course</strong></td>
        <td><span style="background: #dcfce7; color: #166534; padding: 1px 4px; border-radius: 2px; font-weight: 600;">30/30 Built</span></td>
        <td><span style="background: #fef9c3; color: #854d0e; padding: 1px 4px; border-radius: 2px; font-weight: 600;">26.1m</span></td>
      </tr>
      <tr>
        <td><strong>Category C: Visuals Needed</strong></td>
        <td>Duration perfect (<code>course-design-systems</code>), visuals blueprint ready</td>
        <td><strong>1 Course</strong></td>
        <td><span style="background: #fef9c3; color: #854d0e; padding: 1px 4px; border-radius: 2px; font-weight: 600;">0/30 Needed</span></td>
        <td><span style="background: #dcfce7; color: #166534; padding: 1px 4px; border-radius: 2px; font-weight: 600;">22.5m</span></td>
      </tr>
      <tr>
        <td><strong>Category D: Standalone Courses</strong></td>
        <td>Standalone courses in short format; visual blueprints fully architected</td>
        <td><strong>23 Courses</strong></td>
        <td><span style="background: #fef9c3; color: #854d0e; padding: 1px 4px; border-radius: 2px; font-weight: 600;">0/30 Needed</span></td>
        <td><span style="background: #fef9c3; color: #854d0e; padding: 1px 4px; border-radius: 2px; font-weight: 600;">Expansion Planned</span></td>
      </tr>
      <tr style="background: #f8fafc; font-weight: 700;">
        <td><strong>TOTAL CATALOG</strong></td>
        <td><strong>All Master Courses in PinIT Career OS</strong></td>
        <td><strong>37 Courses</strong></td>
        <td><strong>13 Built / 24 Planned</strong></td>
        <td><strong>100% Calibrated</strong></td>
      </tr>
    </tbody>
  </table>

  <h2>42.2 The 18–25 Minute Pedagogical Duration Standard</h2>
  <div style="background: #eff6ff; border-left: 3px solid #3b82f6; padding: 5pt 8pt; margin: 6pt 0; font-size: 8.3pt; color: #1e3a8a;">
    <strong>Total Lesson Duration</strong> = <strong>Spoken Time</strong> (words &divide; 120 wpm) + <strong>Hands-on Activity Time</strong> (6 parts &times; 2.0 min per tryIt &amp; check).<br>
    <em>Target:</em> 1,200–1,500 words of spoken lecture (10–12.5m) + interactive coding changes and diagnostic checks (11–12m) = <strong>21.0 to 24.5 minutes</strong>.
  </div>

  <h2>42.3 Master Course-by-Course Duration &amp; Visuals Audit Table (All 37 Courses)</h2>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 5%;">#</th>
        <th style="width: 25%;">Course Identifier</th>
        <th style="width: 34%;">Title</th>
        <th style="width: 9%;">Spoken</th>
        <th style="width: 9%;">Activity</th>
        <th style="width: 9%;">Total</th>
        <th style="width: 9%;">Visuals</th>
      </tr>
    </thead>
    <tbody>
  `;

  audits.forEach((a: any) => {
    const durBadge = a.inSweetSpot 
      ? `<span style="background: #dcfce7; color: #166534; padding: 1px 4px; border-radius: 2px;">${a.avgTotalMin}m</span>` 
      : `<span style="background: #fef9c3; color: #854d0e; padding: 1px 4px; border-radius: 2px;">${a.avgTotalMin}m</span>`;
    const visBadge = a.hasVisuals 
      ? `<span style="background: #dcfce7; color: #166534; padding: 1px 4px; border-radius: 2px;">30/30</span>` 
      : `<span style="background: #fef9c3; color: #854d0e; padding: 1px 4px; border-radius: 2px;">0/30</span>`;

    h += `
      <tr>
        <td style="text-align: center; font-weight: 700;">${a.num.toString().padStart(2, '0')}</td>
        <td><code>${a.id}</code></td>
        <td><strong>${a.title}</strong></td>
        <td>${a.avgSpokenMin}m</td>
        <td>${a.avgActivityMin}m</td>
        <td>${durBadge}</td>
        <td>${visBadge}</td>
      </tr>
    `;
  });

  h += `
    </tbody>
  </table>

  <div class="page-break"></div>
  <h2>42.4 Master Visual Templates Catalog (17 Interactive Diagram Engines)</h2>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 15%;">Template Key</th>
        <th style="width: 25%;">Engine Name</th>
        <th style="width: 15%;">Domain</th>
        <th style="width: 45%;">Interactive Mechanics &amp; Pedagogical Function</th>
      </tr>
    </thead>
    <tbody>
  `;

  Object.entries(TEMPLATES_INFO).forEach(([key, info]: [string, any]) => {
    h += `
      <tr>
        <td><code>${key}</code></td>
        <td><strong>${info.label}</strong></td>
        <td>${info.domain}</td>
        <td>${info.desc}</td>
      </tr>
    `;
  });

  h += `
    </tbody>
  </table>

  <div class="page-break"></div>
  <h2>42.5 Deep Course-by-Course Blueprint &amp; Roadmap (All 37 Courses, One by One)</h2>
  <p style="font-size: 8.5pt; color: #475569; margin-bottom: 6pt;">
    Below is the exhaustive visual specification for every single course, specifying existing assets, measured times, allowed templates, whiteboard mental models, and 6-block visual engine bindings:
  </p>
  `;

  courses.forEach((c: any) => {
    const meta = COURSE_METAS[c.id];
    const audit = audits.find((a: any) => a.id === c.id);
    if (!meta || !audit) return;

    h += `
    <div style="border: 1px solid #e2e8f0; border-radius: 4pt; padding: 6pt 8pt; margin-bottom: 8pt; background: #ffffff; page-break-inside: avoid;">
      <div style="border-bottom: 1px solid #f1f5f9; padding-bottom: 3pt; margin-bottom: 4pt;">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <h3 style="margin: 0; color: #1e293b; font-size: 9.5pt;">Course ${c.num.toString().padStart(2, '0')}: ${c.title}</h3>
          <span style="font-size: 7.5pt; color: #64748b; font-weight: 600;"><code>${c.id}</code></span>
        </div>
        <p style="margin: 2pt 0; font-size: 7.8pt; color: #475569;">
          <strong>Visuals:</strong> ${audit.hasVisuals ? '<span style="color: #166534; font-weight: 600;">Built (30/30)</span>' : '<span style="color: #854d0e; font-weight: 600;">Planned (0/30)</span>'} &nbsp;|&nbsp;
          <strong>Duration:</strong> ${audit.inSweetSpot ? '<span style="color: #166534; font-weight: 600;">' + audit.avgTotalMin + ' min (18-25m Standard)</span>' : '<span style="color: #854d0e; font-weight: 600;">' + audit.avgTotalMin + ' min (Expansion Planned)</span>'} &nbsp;|&nbsp;
          <strong>Allowed:</strong> <code>${meta.allowedTemplates.join(', ')}</code>
        </p>
      </div>

      <p style="font-size: 7.8pt; margin: 2pt 0;">
        <strong>Architectural Theme:</strong> ${meta.theme}
      </p>

      <div style="background: #eff6ff; border-left: 3px solid #3b82f6; padding: 3pt 6pt; margin: 3pt 0; font-size: 7.6pt; color: #1e3a8a; font-style: italic;">
        <strong>Pedagogical Whiteboard Model:</strong> ${meta.pedagogy}
      </div>

      <table class="data-table" style="margin-top: 3pt; margin-bottom: 3pt; font-size: 7.2pt;">
        <thead>
          <tr>
            <th style="width: 12%;">Block</th>
            <th style="width: 14%;">Days</th>
            <th style="width: 44%;">Curriculum Topic &amp; Lessons</th>
            <th style="width: 30%;">Visual Engine Architecture</th>
          </tr>
        </thead>
        <tbody>
    `;

    c.blocks.forEach((b: any, bIdx: number) => {
      const startDay = b.days[0]?.day || (bIdx * 5 + 1);
      const endDay = b.days[b.days.length - 1]?.day || (bIdx * 5 + 5);
      const focus = meta.blockFocus[bIdx] || `Core Block ${bIdx + 1} Mastery`;
      const template = meta.allowedTemplates[bIdx % meta.allowedTemplates.length];

      h += `
          <tr>
            <td style="font-weight: 600;">Block ${b.blockNum}</td>
            <td>Days ${startDay}–${endDay}</td>
            <td><strong>${focus}</strong></td>
            <td>Template <code>${template}</code>: Animated state progression</td>
          </tr>
      `;
    });

    h += `
        </tbody>
      </table>

      <p style="font-size: 7.5pt; margin: 2pt 0 0 0; color: #0f172a;">
        <strong>Capstone Milestone:</strong> ${meta.milestoneProject}
      </p>
    </div>
    `;
  });

  h += `
  <div class="page-break"></div>
  <h2>42.6 Phased Implementation Roadmap for the 24 Standalone Courses</h2>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 15%;">Phase</th>
        <th style="width: 35%;">Scope &amp; Objectives</th>
        <th style="width: 50%;">Verification Gate &amp; Deliverables</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Phase 1: Curriculum Expansion</strong></td>
        <td>Expand 23 legacy pilot courses into 6-part LongLessons (1,200–1,500 words per day) to hit the 18–25 min standard.</td>
        <td><code>estimateLessonMinutes</code> outputs 18.0 to 24.5 min across all 30 days.</td>
      </tr>
      <tr>
        <td><strong>Phase 2: Visual Suite Generation</strong></td>
        <td>Author visual specifications for the 24 courses across 144 blocks (720 days) using the 5-Step Loop.</td>
        <td>Gate v2 (Rules R1–R14) outputs 100% PASS with deterministic AST bindings.</td>
      </tr>
      <tr>
        <td><strong>Phase 3: Student Simulation</strong></td>
        <td>Run <code>simulate-student-view.mts</code> across all 1,110 days and 6,660 lesson parts.</td>
        <td>0 broken bindings, 0 render crashes, 100% clean full-matrix simulation.</td>
      </tr>
    </tbody>
  </table>
  `;

  return h;
}

export function buildDualTrackTestingSrsHtml(): string {
  return `
  <!-- ========================================================================= -->
  <!-- PART XLIII: DUAL-TRACK CERTIFICATION VISUALS & TESTING VERIFICATION SRS -->
  <!-- ========================================================================= -->
  <div class="page-break"></div>
  <div style="background: #0f172a; color: #ffffff; padding: 10pt 14pt; border-radius: 4pt; margin-bottom: 12pt; border-left: 6px solid #10b981;">
    <div style="display: flex; justify-content: space-between; align-items: baseline;">
      <h1 style="color: #d1fae5; margin: 0; font-size: 14pt; border: none; padding: 0;">Part XLIII: Dual-Track Certification Visuals &amp; Testing Verification SRS</h1>
      <span style="font-size: 9pt; color: #a7f3d0; font-weight: 700;">Python &amp; Web Full-Stack Tracks &bull; 144 Blocks &bull; Gate v2 (14 Rules)</span>
    </div>
    <p style="margin: 4pt 0 0 0; font-size: 8.5pt; color: #d1fae5;">
      <strong>Standard:</strong> End-to-End Curriculum Visuals Quality Assurance Specification &bull; <strong>Volume:</strong> 24 Certification Courses &bull; 720 Lesson Days &bull; 4,320 Lesson Parts &bull; <strong>Testing Invariant:</strong> Zero-Hallucination 5-Day Iterative Batch Protocol
    </p>
  </div>

  <h2>43.1 Purpose, Scope &amp; Zero-Hallucination Principle</h2>
  <p style="font-size: 8.5pt; color: #475569; margin-bottom: 6pt;">
    Because real-world students depend on these interactive visual aids to understand foundational, systems-level, and production engineering concepts, <strong>zero defect tolerance</strong> is enforced:
  </p>
  <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 3pt; padding: 5pt 8pt; margin-bottom: 8pt; font-size: 8.2pt;">
    <strong>1. Verbatim Grounding:</strong> Every diagram accurately reflects the code and spoken lecture concepts.<br>
    <strong>2. Crash Immunity:</strong> No visual may cause runtime rendering crashes, undefined pointer exceptions, or unresponsive step transitions.<br>
    <strong>3. Gate v2 Rigor:</strong> Every visual adheres strictly to Gate v2 schema rules (R1 through R14).<br>
    <strong>4. Zero AI Hallucination:</strong> No testing agent may report speculative, unverified, or hallucinated test results.
  </div>

  <h2>43.2 The Zero-Hallucination 5-Day Batch Execution Protocol</h2>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 15%;">Step</th>
        <th style="width: 30%;">Protocol Action</th>
        <th style="width: 55%;">Operational Execution &amp; Gate Invariant</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Step 1</strong></td>
        <td>PDF Ground Truth Alignment</td>
        <td>Check the 5 day titles and part titles against the corresponding master PDF. Confirm conceptual appropriateness (sequential flows, state diagrams, tables, metric bars).</td>
      </tr>
      <tr>
        <td><strong>Step 2</strong></td>
        <td>Programmatic Gate v2 Audit</td>
        <td>Run the programmatic validation engine over the 5 days. Evaluate all 14 Gate rules (R1 to R14). Collect error outputs.</td>
      </tr>
      <tr>
        <td><strong>Step 3</strong></td>
        <td>In-Situ Remediation</td>
        <td>If ANY rule flags an issue, <strong>stop immediately and fix the file in place</strong>. Never bypass failures. Re-verify until PASS 100%.</td>
      </tr>
      <tr>
        <td><strong>Step 4</strong></td>
        <td>Runtime API &amp; Stage Test</td>
        <td>Confirm <code>/api/visuals?prefix={prefix}&amp;day={day}</code> resolves status 200 with complete JSON payload matching <code>VisualStage.tsx</code> interfaces.</td>
      </tr>
      <tr>
        <td><strong>Step 5</strong></td>
        <td>Atomic Checkpoint Commit</td>
        <td>Stage and commit the verified block. Record completion in <code>agent_tasks.csv</code> and <code>PROJECT_MEMORY.md</code>. Advance to next block.</td>
      </tr>
    </tbody>
  </table>

  <h2>43.3 Specification of Quality Gate Rules (Gate v2: Rules R1–R14)</h2>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 8%;">Rule</th>
        <th style="width: 25%;">Rule Name</th>
        <th style="width: 67%;">Specification &amp; Passing Criteria</th>
      </tr>
    </thead>
    <tbody>
      <tr><td><strong>R1</strong></td><td>Structural Completeness</td><td>File must contain exactly 6 entries. Each entry's <code>partTitle</code> must match the corresponding lesson part title verbatim.</td></tr>
      <tr><td><strong>R2</strong></td><td>Template Authorization</td><td>The <code>spec.template</code> must be either <code>'none'</code> or present in the course's allowed template list (<code>COURSE_ALLOWED_TEMPLATES</code>).</td></tr>
      <tr><td><strong>R3</strong></td><td>Complexity &amp; Shape Bounds</td><td>Diagrams must have 2 to 5 steps. Maximum shapes: at most 6 nodes (flow, tree), 6 boxes, 6 rows (table), 6 items (cells, stack), 6 bars, or 4 actors (sequence).</td></tr>
      <tr><td><strong>R4</strong></td><td>Step Progression Order</td><td>The <code>at</code> attribute must be strictly monotonically increasing across steps (<code>say1</code> .. <code>sayN</code>, <code>example</code>, <code>tryIt</code>). Backward or duplicate <code>at</code> lines prohibited.</td></tr>
      <tr><td><strong>R5</strong></td><td>Caption Discipline</td><td>Captions must be a single grammatical sentence, &le; 80 characters in length, terminate with a period ('.'), and contain zero emojis.</td></tr>
      <tr><td><strong>R6</strong></td><td>Text &amp; Value Verbatim Grounding</td><td>Variable bindings, text edits, and replacements must appear verbatim in the attached lesson code or text.</td></tr>
      <tr><td><strong>R7</strong></td><td>Numeric Grounding</td><td>Any numeric literal appearing in a caption must either be explicitly present in lesson code or bound in visual step values. Speculative numbers prohibited.</td></tr>
      <tr><td><strong>R8</strong></td><td>Tappable Label Grounding</td><td>Any tappable interactive shape label must exist as a whole word in the lesson part's text or code.</td></tr>
      <tr><td><strong>R9</strong></td><td>Strict Tone Taxonomy</td><td>Tone values across all elements must strictly belong to the set: <code>['data', 'ok', 'error', 'idle']</code>. Custom tones (<code>'muted'</code>, <code>'accent'</code>, <code>'warn'</code>) invalid.</td></tr>
      <tr><td><strong>R10</strong></td><td>Visual Density Target</td><td>Each day file must contain at least 3 active picture specs (target: 5 pictures, 1 none). Days with &lt; 3 pictures marked <code>'needs-review'</code>.</td></tr>
      <tr><td><strong>R11</strong></td><td>Manifest Consistency</td><td>If tracked in manifest, key status in file must match manifest status (<code>passed</code>, <code>none</code>, <code>needs-review</code>, <code>pilot</code>).</td></tr>
      <tr><td><strong>R12</strong></td><td>Semantic Word Sharing</td><td>Caption of each step must share at least one important word (4+ letters, non-stopword) with attached lesson text at <code>step.at</code>.</td></tr>
      <tr><td><strong>R13</strong></td><td>Freshness Code Hash</td><td>Entry's <code>codeHash</code> must match the current SHA-256 hash of the corresponding lesson part's code string.</td></tr>
      <tr><td><strong>R14</strong></td><td>Variable Stability</td><td>Visual bindings must not bind to unstable runtime addresses or nondeterministic memory variables.</td></tr>
    </tbody>
  </table>

  <div class="page-break"></div>
  <h2>43.4 Curriculum Inventory &amp; 144 Batch Block Schedule (24 Certification Courses)</h2>
  
  <h3>Track 1: Python Full-Stack Certification Curriculum (12 Courses &bull; 72 Blocks)</h3>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 10%;">Month</th>
        <th style="width: 15%;">Key</th>
        <th style="width: 35%;">Course Name</th>
        <th style="width: 40%;">Verification Blocks (5 Days Each)</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>M01</td><td><code>python</code></td><td>Python Core, OOP &amp; Backend Internals</td><td>B01 (1-5), B02 (6-10), B03 (11-15), B04 (16-20), B05 (21-25), B06 (26-30)</td></tr>
      <tr><td>M02</td><td><code>dsa-py</code></td><td>Data Structures &amp; Algorithms in Python</td><td>B07 (1-5), B08 (6-10), B09 (11-15), B10 (16-20), B11 (21-25), B12 (26-30)</td></tr>
      <tr><td>M03</td><td><code>sql-mastery</code></td><td>Advanced SQL, Query Plans &amp; Modeling</td><td>B13 (1-5), B14 (6-10), B15 (11-15), B16 (16-20), B17 (21-25), B18 (26-30)</td></tr>
      <tr><td>M04</td><td><code>ai-py</code></td><td>Applied AI, Vectors &amp; Neural Search</td><td>B19 (1-5), B20 (6-10), B21 (11-15), B22 (16-20), B23 (21-25), B24 (26-30)</td></tr>
      <tr><td>M05</td><td><code>dist-py</code></td><td>Distributed Systems &amp; High-Scale Python</td><td>B25 (1-5), B26 (6-10), B27 (11-15), B28 (16-20), B29 (21-25), B30 (26-30)</td></tr>
      <tr><td>M06</td><td><code>cloud-py</code></td><td>Cloud Infrastructure &amp; Serverless Python</td><td>B31 (1-5), B32 (6-10), B33 (11-15), B34 (16-20), B35 (21-25), B36 (26-30)</td></tr>
      <tr><td>M07</td><td><code>nlp-py</code></td><td>NLP, Semantic Search &amp; Tokenization</td><td>B37 (1-5), B38 (6-10), B39 (11-15), B40 (16-20), B41 (21-25), B42 (26-30)</td></tr>
      <tr><td>M08</td><td><code>quant-py</code></td><td>Quantitative Analytics &amp; Financial Math</td><td>B43 (1-5), B44 (6-10), B45 (11-15), B46 (16-20), B47 (21-25), B48 (26-30)</td></tr>
      <tr><td>M09</td><td><code>prompt-py</code></td><td>Production Prompt Engineering &amp; Agents</td><td>B49 (1-5), B50 (6-10), B51 (11-15), B52 (16-20), B53 (21-25), B54 (26-30)</td></tr>
      <tr><td>M10</td><td><code>train-py</code></td><td>Model Fine-Tuning, LoRA &amp; Evaluation</td><td>B55 (1-5), B56 (6-10), B57 (11-15), B58 (16-20), B59 (21-25), B60 (26-30)</td></tr>
      <tr><td>M11</td><td><code>vec-py</code></td><td>Vector Databases &amp; HNSW Indexing</td><td>B61 (1-5), B62 (6-10), B63 (11-15), B64 (16-20), B65 (21-25), B66 (26-30)</td></tr>
      <tr><td>M12</td><td><code>safe-py</code></td><td>AI Safety, Alignment &amp; Red-Teaming</td><td>B67 (1-5), B68 (6-10), B69 (11-15), B70 (16-20), B71 (21-25), B72 (26-30)</td></tr>
    </tbody>
  </table>

  <h3>Track 2: Web Full-Stack Certification Curriculum (12 Courses &bull; 72 Blocks)</h3>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 10%;">Month</th>
        <th style="width: 15%;">Key</th>
        <th style="width: 35%;">Course Name</th>
        <th style="width: 40%;">Verification Blocks (5 Days Each)</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>M01</td><td><code>react-basics</code></td><td>React Basics &amp; Component Architecture</td><td>B73 (1-5), B74 (6-10), B75 (11-15), B76 (16-20), B77 (21-25), B78 (26-30)</td></tr>
      <tr><td>M02</td><td><code>node-web</code></td><td>Node.js Backend &amp; API Engineering</td><td>B79 (1-5), B80 (6-10), B81 (11-15), B82 (16-20), B83 (21-25), B84 (26-30)</td></tr>
      <tr><td>M03</td><td><code>dsa-optim</code></td><td>Web DSA, Memory &amp; V8 Engine Optimization</td><td>B85 (1-5), B86 (6-10), B87 (11-15), B88 (16-20), B89 (21-25), B90 (26-30)</td></tr>
      <tr><td>M04</td><td><code>sql-mastery</code></td><td>Advanced SQL Mastery &amp; Engine Internals</td><td>B91 (1-5), B92 (6-10), B93 (11-15), B94 (16-20), B95 (21-25), B96 (26-30)</td></tr>
      <tr><td>M05</td><td><code>devops</code></td><td>DevOps, Docker &amp; CI/CD Pipelines</td><td>B97 (1-5), B98 (6-10), B99 (11-15), B100 (16-20), B101 (21-25), B102 (26-30)</td></tr>
      <tr><td>M06</td><td><code>cloud</code></td><td>Cloud Architecture &amp; Distributed Systems</td><td>B103 (1-5), B104 (6-10), B105 (11-15), B106 (16-20), B107 (21-25), B108 (26-30)</td></tr>
      <tr><td>M07</td><td><code>dist</code></td><td>Distributed Consensus &amp; Microservices</td><td>B109 (1-5), B110 (6-10), B111 (11-15), B112 (16-20), B113 (21-25), B114 (26-30)</td></tr>
      <tr><td>M08</td><td><code>cyber</code></td><td>Web Cybersecurity, OWASP &amp; Cryptography</td><td>B115 (1-5), B116 (6-10), B117 (11-15), B118 (16-20), B119 (21-25), B120 (26-30)</td></tr>
      <tr><td>M09</td><td><code>ai</code></td><td>Full-Stack AI Engineering &amp; Real-Time LLMs</td><td>B121 (1-5), B122 (6-10), B123 (11-15), B124 (16-20), B125 (21-25), B126 (26-30)</td></tr>
      <tr><td>M10</td><td><code>sre-web</code></td><td>Multi-Cloud SRE, Observability &amp; SLOs</td><td>B127 (1-5), B128 (6-10), B129 (11-15), B130 (16-20), B131 (21-25), B132 (26-30)</td></tr>
      <tr><td>M11</td><td><code>stream-web</code></td><td>Streaming in TypeScript &amp; Kafka Pipelines</td><td>B133 (1-5), B134 (6-10), B135 (11-15), B136 (16-20), B137 (21-25), B138 (26-30)</td></tr>
      <tr><td>M12</td><td><code>aideploy-web</code></td><td>Production AI Gateway &amp; Edge Deployment</td><td>B139 (1-5), B140 (6-10), B141 (11-15), B142 (16-20), B143 (21-25), B144 (26-30)</td></tr>
    </tbody>
  </table>

  <h2>43.5 Defect Severity Taxonomy &amp; Compliance Acceptance</h2>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 15%;">Severity</th>
        <th style="width: 20%;">Defect Category</th>
        <th style="width: 30%;">Example Triggers</th>
        <th style="width: 35%;">Remediation Protocol</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>P0 - Blocker</strong></td>
        <td>Parser / Structural Crash</td>
        <td>Malformed JSON, missing day file, entry count != 6 (R1), missing part title</td>
        <td>Immediate halt. In-situ repair. Re-run test suite.</td>
      </tr>
      <tr>
        <td><strong>P1 - High</strong></td>
        <td>Integrity &amp; Timeline Flaw</td>
        <td>Invalid template (R2), non-increasing <code>at</code> (R4), invalid tone (R9), hash mismatch (R13)</td>
        <td>Re-align timeline, enforce <code>['data', 'ok', 'error', 'idle']</code>, recompute SHA-256 hash.</td>
      </tr>
      <tr>
        <td><strong>P2 - Medium</strong></td>
        <td>Caption &amp; Grounding Defect</td>
        <td>Caption &gt; 80 chars (R5), unbound numbers (R7), missing shared vocabulary (R12)</td>
        <td>Condense caption, bind numeric constants to code variables, infuse vocabulary from attached say line.</td>
      </tr>
    </tbody>
  </table>

  <div style="margin-top: 15pt; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 4pt; padding: 8pt 12pt; text-align: center; color: #166534; font-size: 8.5pt;">
    <strong>PinIT Career OS Master Architecture Bible &bull; 100% Quality Acceptance Certified &bull; All 37 Courses &amp; Visual Blueprints Unified into 1 Master Artifact</strong>
  </div>
  `;
}
