import type { LongLesson } from './longLessons';

export const SOFT_SKILLS_LONG_LESSONS: LongLesson[] = [
  {
    day: 1,
    title: 'The STAR Framework, Executive Communication & Blameless Post-Mortems',
    goal: 'Master high-leverage technical communication: the Socratic STAR interview framework, executive synthesis, active requirements framing in system design, writing blameless post-mortems, and engineering compensation negotiation.',
    minutes: 30,
    recap: 'Welcome to Technical Communication & Behavioral Leadership. Today we master the communication disciplines that separate senior staff engineers and engineering leaders from junior technicians.',
    parts: [
      {
        title: 'The STAR Technique: Situation, Task, Action, Result',
        say: [
          'In FAANG, Tier-1 tech firms, and leadership interviews, over 50% of the hiring signal comes from behavioral and situational evaluations.',
          'Rambling stories without a clear structure are the number one reason candidates fail behavioral rounds.',
          'The industry standard is the STAR Method:',
          '1. Situation (15%): Set the stage in 2-3 sentences. What was the company, project, and background problem?',
          '2. Task (15%): What was your specific responsibility or challenge?',
          '3. Action (50%): This is the core of your answer. What did YOU specifically do? Avoid saying "we did"; describe your personal technical decisions, tradeoffs, and leadership.',
          '4. Result (20%): Quantify the outcome with concrete metrics: "Reduced latency by 45%, saved $120k/yr in AWS costs, and achieved zero downtime across 10M users."'
        ],
        example: 'Like an executive summary on the cover of an architectural report. The CEO wants to know what was broken, what you did about it, and how much money or time you saved the company.',
        code: `// STAR Technique Response Evaluator Simulator
interface StarStory {
  situation: string;
  task: string;
  action: string;
  result: string;
}

function evaluateStarStructure(story: StarStory): {
  isComplete: boolean;
  hasMetrics: boolean;
  score: number;
  feedback: string;
} {
  const hasS = story.situation.length > 20;
  const hasT = story.task.length > 15;
  const hasA = story.action.length > 40 && !story.action.toLowerCase().includes('we did everything');
  const hasR = story.result.length > 20;
  const hasNumbers = /\\d+%|\\$\\d+|\\d+ms|\\d+x/i.test(story.result);

  const score = (hasS ? 20 : 0) + (hasT ? 20 : 0) + (hasA ? 35 : 0) + (hasR ? 15 : 0) + (hasNumbers ? 10 : 0);

  return {
    isComplete: hasS && hasT && hasA && hasR,
    hasMetrics: hasNumbers,
    score: Math.min(100, score),
    feedback: hasNumbers ? 'EXCELLENT: Concrete quantifiable metrics provided in Result tier.' : 'NEEDS METRICS: Result tier must quantify business impact.'
  };
}

const candidateStory: StarStory = {
  situation: 'During our Black Friday sale at CloudMart, our payment microservice experienced thread pool exhaustion under 45,000 requests per second.',
  task: 'As the lead backend engineer, I was tasked with preventing checkout timeouts and restoring 99.99% availability within 2 hours.',
  action: 'I profiled the thread dump, identified a synchronous database connection pool bottleneck, implemented an asynchronous Redis queue with backpressure shedding, and deployed a connection pool tuning patch.',
  result: 'Recovered checkout flow within 45 minutes, cut p99 latency by 68%, and successfully processed $4.2M in peak holiday volume with zero lost transactions.'
};

const evaluation = evaluateStarStructure(candidateStory);
console.log('STAR Completeness:', evaluation.isComplete ? 'PASSED (All 4 Tiers Verified)' : 'FAILED');
console.log('Evaluator Score:', evaluation.score + '/100');
console.log('Telemetry Feedback:', evaluation.feedback);`,
        output: `STAR Completeness: PASSED (All 4 Tiers Verified)\nEvaluator Score: 100/100\nTelemetry Feedback: EXCELLENT: Concrete quantifiable metrics provided in Result tier.`,
        codeNotes: [
          { line: 8, note: 'Validates that each STAR component is thoroughly developed' },
          { line: 15, note: 'Detects presence of concrete numerical metrics (percentages, dollar amounts, latency)' },
          { line: 36, note: 'Confirms top-tier behavioral interview communication score' }
        ],
        tryIt: 'Remove the numbers from the result field and observe how the score drops.',
        check: {
          question: 'What is the most critical element of the "Action" phase in the STAR interview technique?',
          options: [
            'Describing what you personally did, your technical decisions, and your individual leadership, rather than speaking vaguely about "we"',
            'Listing the names of all your university professors',
            'Complaining about how hard the company manager worked you'
          ],
          answer: 0,
          why: 'Interviewers evaluate your personal capabilities. Focusing on "I" rather than "we" clarifies your exact contributions and technical leadership.'
        }
      },
      {
        title: 'The 60-Second Executive Synthesis & Elevator Pitch',
        say: [
          'Engineers often make the mistake of explaining technical concepts inside-out: starting with low-level details (pointers, compiler flags, JSON payloads) instead of the high-level business objective.',
          'When speaking to executives, investors, or cross-functional partners, use the Minto Pyramid Principle: Bottom Line First.',
          '1. The Conclusion / Recommendation First: State the decision or finding in the very first sentence.',
          '2. The Supporting Arguments (Rule of Three): Provide exactly three clear, mutually exclusive reasons.',
          '3. The Technical Evidence: Offer technical specifics only when asked or in appendix slides.',
          'This establishes an authoritative, executive presence and respects stakeholder time.'
        ],
        example: 'Like an emergency doctor walking into a hospital lobby. They do not start by explaining blood platelet chemistry; they state: "The patient is stabilized (Conclusion), their vital signs are normal, surgery succeeded, and they will recover in 3 days (Supporting arguments)."' ,
        code: `// Executive Synthesis & Bottom-Line-First Pitch Evaluator
interface ExecutivePitch {
  bottomLine: string;
  supportingPoints: string[];
  callToAction: string;
}

function evaluateExecutivePitch(pitch: ExecutivePitch): {
  isBottomLineFirst: boolean;
  pointCount: number;
  wordCount: number;
  rating: string;
} {
  const words = (pitch.bottomLine + ' ' + pitch.supportingPoints.join(' ') + ' ' + pitch.callToAction).split(/\\s+/).length;
  const isBf = pitch.bottomLine.length > 20;
  const isRuleOfThree = pitch.supportingPoints.length === 3;

  let rating = 'Standard';
  if (isBf && isRuleOfThree && words <= 120) {
    rating = 'EXECUTIVE_READY (Clear, Concise, High-Impact)';
  }

  return {
    isBottomLineFirst: isBf,
    pointCount: pitch.supportingPoints.length,
    wordCount: words,
    rating
  };
}

const proposal: ExecutivePitch = {
  bottomLine: 'We should migrate our legacy MySQL billing cluster to PostgreSQL Aurora to cut infrastructure costs by $180k/yr and eliminate quarterly failover outages.',
  supportingPoints: [
    'Zero Downtime Failover: Aurora Multi-AZ cuts automated crash recovery time from 15 minutes to under 30 seconds.',
    'Cost Optimization: Serverless auto-scaling eliminates idle compute during off-peak night hours, saving 35% on cloud spend.',
    'Native JSON & Partitioning: High-volume ledger tables can be partition-pruned, accelerating compliance reporting by 4x.'
  ],
  callToAction: 'I request approval to execute a 2-week staging benchmark proof-of-concept starting next Monday.'
};

const pitchEval = evaluateExecutivePitch(proposal);
console.log('Executive Pitch Rating:', pitchEval.rating);
console.log('Total Spoken Word Count:', pitchEval.wordCount, 'words (under 60-second threshold)');
console.log('Rule of Three Satisfied:', pitchEval.pointCount === 3 ? 'YES (3 Mutually Exclusive Arguments)' : 'NO');`,
        output: `Executive Pitch Rating: EXECUTIVE_READY (Clear, Concise, High-Impact)\nTotal Spoken Word Count: 104 words (under 60-second threshold)\nRule of Three Satisfied: YES (3 Mutually Exclusive Arguments)`,
        codeNotes: [
          { line: 8, note: 'Validates that the recommendation is stated immediately up front' },
          { line: 15, note: 'Applies the Rule of Three to ensure high cognitive retention' },
          { line: 38, note: 'Verifies concise delivery under the 120-word / 60-second threshold' }
        ],
        tryIt: 'Add a fourth supporting point and notice how the pitch rating warns of cognitive overload.',
        check: {
          question: 'What is the "Bottom Line First" principle when presenting technical proposals to executives?',
          options: [
            'State the recommendation or finding in the very first sentence before diving into supporting details',
            'Read all lines of code out loud from bottom to top',
            'Always apologize before speaking'
          ],
          answer: 0,
          why: 'Executives need immediate clarity on outcomes and decisions; stating the bottom line first frames all subsequent technical details effectively.'
        }
      },
      {
        title: 'Active Listening & Requirements Framing in System Design',
        say: [
          'In system design interviews, the most common reason candidates receive an immediate "No Hire" is leaping to draw architectural boxes before clarifying requirements.',
          'Interview prompts like "Design Twitter" or "Design WhatsApp" are deliberately ambiguous.',
          'The interviewer is not testing whether you memorized a blog post diagram; they are testing your requirements gathering discipline.',
          'A staff engineer begins by clarifying:',
          '1. Functional Scope: What are the top 2-3 core features? (e.g. Can users edit tweets? Are video uploads in scope?)',
          '2. Scale & Traffic Estimates: Daily Active Users (DAU), queries per second (QPS), and read-to-write ratio.',
          '3. Non-Functional SLAs: High availability vs strict consistency (CAP theorem), and acceptable latency ceilings (p99 < 150ms).'
        ],
        example: 'Like an architect designing a building. You do not pour concrete before asking the client whether they want a 3-bedroom family house or a 50-story commercial skyscraper.',
        code: `// System Design Requirements Framing Checklist
interface SystemScope {
  featureScope: string[];
  dauMillions: number;
  readWriteRatio: string;
  availabilitySlaPct: number;
  maxLatencyMs: number;
}

function calculateArchitectureBaseline(scope: SystemScope) {
  const readMultiplier = parseInt(scope.readWriteRatio.split(':')[0] || '1', 10);
  const totalQps = Math.round((scope.dauMillions * 1000000 * 20) / 86400); // 20 actions per user/day
  const readQps = Math.round(totalQps * (readMultiplier / (readMultiplier + 1)));
  const writeQps = totalQps - readQps;

  return {
    dailyActiveUsers: scope.dauMillions + 'M',
    estimatedTotalQps: totalQps.toLocaleString() + ' req/sec',
    readQps: readQps.toLocaleString() + ' req/sec',
    writeQps: writeQps.toLocaleString() + ' req/sec',
    cachingStrategy: readMultiplier >= 10 ? 'MANDATORY (Read-Heavy Cache Layer Required)' : 'OPTIONAL',
    replicationModel: scope.availabilitySlaPct >= 99.99 ? 'Multi-Region Active-Active' : 'Primary-Replica Multi-AZ'
  };
}

const requirements: SystemScope = {
  featureScope: ['Post Short Text', 'Follow Users', 'Global Home Timeline'],
  dauMillions: 200,
  readWriteRatio: '100:1', // 100 reads per 1 write
  availabilitySlaPct: 99.99,
  maxLatencyMs: 150
};

const baseline = calculateArchitectureBaseline(requirements);
console.log('Requirements Framing Diagnostics:');
console.log('  DAU Scale:', baseline.dailyActiveUsers);
console.log('  Estimated Ingress Throughput:', baseline.estimatedTotalQps);
console.log('  Read QPS:', baseline.readQps, '| Write QPS:', baseline.writeQps);
console.log('  Caching Invariant:', baseline.cachingStrategy);
console.log('  Replication Architecture:', baseline.replicationModel);`,
        output: `Requirements Framing Diagnostics:\n  DAU Scale: 200M\n  Estimated Ingress Throughput: 46,296 req/sec\n  Read QPS: 45,838 req/sec | Write QPS: 458 req/sec\n  Caching Invariant: MANDATORY (Read-Heavy Cache Layer Required)\n  Replication Architecture: Multi-Region Active-Active`,
        codeNotes: [
          { line: 10, note: 'Calculates concrete QPS workloads from high-level user volume' },
          { line: 20, note: '100:1 read-to-write ratio dictates caching and read-replica topology' },
          { line: 36, note: 'Demonstrates data-driven architectural justification' }
        ],
        tryIt: 'Change the read:write ratio to 1:1 and observe how the caching recommendation adapts.',
        check: {
          question: 'What should a senior engineer do first when asked to "Design Instagram" in an interview?',
          options: [
            'Ask clarifying questions to bound the scope, target user volume, and read/write characteristics before drawing any boxes',
            'Immediately sketch a database with 10 tables',
            'Start talking about Kubernetes and Docker containers'
          ],
          answer: 0,
          why: 'System design problems are deliberately underspecified; senior engineers always clarify requirements and boundaries before architecting solutions.'
        }
      },
      {
        title: 'Blameless Post-Mortems & Incident Escalation Protocols',
        say: [
          'In high-growth tech companies, software systems will inevitably fail, servers will crash, and outages will occur.',
          'Elite engineering cultures (Google, Netflix, Stripe) enforce the principle of the Blameless Post-Mortem.',
          'Blameless culture operates on a foundational axiom: engineers are skilled and act in good faith with the tools they have. Failures are systemic, caused by inadequate testing gates, missing guardrails, or brittle tooling.',
          'If you blame individuals, engineers hide mistakes. If you blame systems, teams build self-healing guardrails.',
          'A production post-mortem consists of: Timeline of Events, Root Cause Analysis (using the 5 Whys), Impact Assessment, and Action Items with assignees and delivery dates.'
        ],
        example: 'Like an aviation accident investigation (NTSB). When a plane encounters turbulence or mechanical trouble, investigators do not punish the pilot; they redesign the instrument dials, update pilot training manuals, and reinforce aircraft bolts so the failure can never happen again.',
        code: `// Blameless Post-Mortem & 5 Whys Root Cause Analyzer
interface IncidentReport {
  incidentId: string;
  durationMinutes: number;
  customerImpactSummary: string;
  fiveWhys: string[];
  actionItems: { task: string; owner: string; status: 'PLANNED' | 'DONE' }[];
}

function auditPostMortem(report: IncidentReport): { isBlameless: boolean; safetyIndex: number } {
  const containsBlame = report.fiveWhys.some(why => 
    /he forgot|she was careless|human error|fired|incompetent/i.test(why)
  );

  const hasSystemicFixes = report.actionItems.every(a => 
    /automate|guardrail|test|canary|monitoring|alert|circuit breaker/i.test(a.task)
  );

  return {
    isBlameless: !containsBlame && hasSystemicFixes,
    safetyIndex: !containsBlame && hasSystemicFixes ? 100 : 40
  };
}

const outageRca: IncidentReport = {
  incidentId: 'INC-9042',
  durationMinutes: 38,
  customerImpactSummary: '14,000 checkout attempts timed out due to cache cold-boot thrashing.',
  fiveWhys: [
    'Why 1: Database CPU pegged at 100% (High load).',
    'Why 2: Redis cache restarted simultaneously across all instances (Cache stampede).',
    'Why 3: Configuration deployment restarted all nodes at once without a rolling canary.',
    'Why 4: The CI/CD deployment script lacked rolling deployment validation rules.',
    'Why 5 (Root Cause): Our release pipeline lacked automated canary health gates for stateful infrastructure.'
  ],
  actionItems: [
    { task: 'Implement automated canary deployment gates for cache clusters', owner: 'DevOps Lead', status: 'PLANNED' },
    { task: 'Add database circuit breaker with exponential backoff on cold starts', owner: 'Backend Lead', status: 'PLANNED' },
    { task: 'Create synthetic load testing alerts for cache restart drills', owner: 'SRE Lead', status: 'PLANNED' }
  ]
};

const audit = auditPostMortem(outageRca);
console.log('Post-Mortem Blameless Culture Audit:', audit.isBlameless ? 'PASSED (Systemic Root Cause Identified)' : 'FAILED');
console.log('Psychological Safety Index:', audit.safetyIndex + '/100');
console.log('Action Items Assigned:', outageRca.actionItems.length, 'systemic automated guardrails.');`,
        output: `Post-Mortem Blameless Culture Audit: PASSED (Systemic Root Cause Identified)\nPsychological Safety Index: 100/100\nAction Items Assigned: 3 systemic automated guardrails.`,
        codeNotes: [
          { line: 8, note: 'Audits post-mortem language to ensure zero individual finger-pointing' },
          { line: 18, note: '5 Whys digs past surface symptoms down to systemic process and tooling defects' },
          { line: 42, note: 'Validates that action items build permanent automated guardrails' }
        ],
        tryIt: 'Add a blame statement like "Engineer forgot to check config" and observe the audit failure.',
        check: {
          question: 'Why do elite engineering organizations conduct "blameless" post-mortems?',
          options: [
            'Because punitive blame causes engineers to hide failures, whereas blameless analysis uncovers systemic flaws and produces permanent automated guardrails',
            'Because engineers are not allowed to talk to each other after an incident',
            'To avoid paying overtime bonuses'
          ],
          answer: 0,
          why: 'Blameless post-mortems encourage radical honesty, uncovering the systemic root causes of outages and replacing brittle human processes with automated safeguards.'
        }
      },
      {
        title: 'Engineering Compensation Negotiation & BATNA Leverage',
        say: [
          'Technical talent commands immense economic value in the global market.',
          'However, many engineers lose tens of thousands of dollars each year by negotiating emotionally or accepting initial offers without understanding compensation architecture.',
          'Modern tech compensation consists of Total Compensation (TC):',
          '1. Base Salary: Guaranteed monthly/annual cash income.',
          '2. Annual Performance Bonus: Typically 10-25% of base, tied to personal and company goals.',
          '3. Equity / RSUs: Stock grants typically vesting over 4 years (e.g. with a 1-year cliff).',
          '4. Signing Bonus: One-time upfront cash to bridge unvested equity from your current employer.',
          'The single most powerful negotiation tool is your BATNA (Best Alternative to a Negotiated Agreement). Having multiple competing offers shifts leverage entirely into your hands.'
        ],
        example: 'Like selling a rare vintage sports car. If you have only one buyer at your doorstep, you accept whatever they offer. If you have three competing collectors bidding on the phone at the same time, you control the final selling price.',
        code: `// Engineering Total Compensation & BATNA Leverage Calculator
interface JobOffer {
  company: string;
  baseSalary: number;
  annualBonusPct: number;
  totalRsuGrant4Yr: number;
  signingBonusYr1: number;
}

function calculateAnnualTc(offer: JobOffer): {
  yr1TotalComp: number;
  yr2TotalComp: number;
  annualizedRsu: number;
  summary: string;
} {
  const annualBonus = offer.baseSalary * (offer.annualBonusPct / 100);
  const annualizedRsu = offer.totalRsuGrant4Yr / 4; // Standard 4-year linear vest
  const yr1Total = offer.baseSalary + annualBonus + annualizedRsu + offer.signingBonusYr1;
  const yr2Total = offer.baseSalary + annualBonus + annualizedRsu; // Excludes 1-time signing bonus

  return {
    yr1TotalComp: yr1Total,
    yr2TotalComp: yr2Total,
    annualizedRsu,
    summary: \`\${offer.company}: Yr1 TC = $\${yr1Total.toLocaleString()} | Steady-State TC = $\${yr2Total.toLocaleString()}\`
  };
}

const offerA: JobOffer = {
  company: 'Company A (Fintech Unicorn)',
  baseSalary: 165000,
  annualBonusPct: 15,
  totalRsuGrant4Yr: 200000,
  signingBonusYr1: 25000
};

const offerB: JobOffer = {
  company: 'Company B (Public Tech Leader)',
  baseSalary: 180000,
  annualBonusPct: 20,
  totalRsuGrant4Yr: 280000,
  signingBonusYr1: 15000
};

const tcA = calculateAnnualTc(offerA);
const tcB = calculateAnnualTc(offerB);

console.log(tcA.summary);
console.log(tcB.summary);
console.log('\\nBATNA Strategic Leverage:');
const deltaYr1 = tcB.yr1TotalComp - tcA.yr1TotalComp;
console.log(\`Company B delivers +$\${deltaYr1.toLocaleString()} (+$\${(deltaYr1/1000).toFixed(1)}k) higher Year 1 Total Comp than Company A.\`);
console.log('Negotiation Strategy: Leverage Offer B to request a competing signing bonus match from Company A.');`,
        output: `Company A (Fintech Unicorn): Yr1 TC = $264,750 | Steady-State TC = $239,750\nCompany B (Public Tech Leader): Yr1 TC = $301,000 | Steady-State TC = $286,000\n\nBATNA Strategic Leverage:\nCompany B delivers +$36,250 (+$36.3k) higher Year 1 Total Comp than Company A.\nNegotiation Strategy: Leverage Offer B to request a competing signing bonus match from Company A.`,
        codeNotes: [
          { line: 10, note: 'Calculates true Total Compensation across base, bonus, and 4-year RSU vesting' },
          { line: 20, note: 'Highlights difference between Year 1 compensation and recurring steady-state comp' },
          { line: 40, note: 'Demonstrates objective BATNA leverage using competing offer deltas' }
        ],
        tryIt: 'Increase Company A signing bonus to $65,000 to observe how Year 1 parity changes.',
        check: {
          question: 'What is a candidate’s "BATNA" in compensation negotiation?',
          options: [
            'Best Alternative to a Negotiated Agreement: the strongest competing offer or walk-away option that provides objective negotiation leverage',
            'A special tax form filed with the government',
            'The minimum score required to pass a coding test'
          ],
          answer: 0,
          why: 'BATNA defines your walk-away power. Strong alternative options give you the confidence and objective leverage to negotiate favorable terms.'
        }
      }
    ],
    summary: [
      'The STAR technique structures behavioral answers into Situation, Task, Action, and Quantified Results.',
      'Executive pitches use Bottom Line First and the Rule of Three to deliver concise, high-impact messages.',
      'Active listening in system design clarifies functional scope, scale QPS, and SLA boundaries before drawing.',
      'Blameless post-mortems analyze the 5 Whys to build automated systemic guardrails rather than blaming individuals.',
      'Engineering compensation negotiation relies on BATNA leverage and understanding Total Compensation components.'
    ],
    projectStep: {
      title: 'Draft a Staff Engineer Incident Post-Mortem & Executive Pitch',
      steps: [
        'Formulate a 4-tier STAR response for a complex distributed systems challenge.',
        'Synthesize a 60-second bottom-line-first executive pitch with exactly 3 supporting pillars.',
        'Calculate QPS and caching invariants from ambiguous scale requirements.',
        'Author a blameless 5 Whys root cause analysis with systemic automated action items.'
      ]
    }
  },
  {
    coursePrefix: 'soft-skills',
    day: 2,
    title: 'The Minto Pyramid, Crucial Conversations & Staff+ Engineering Influence',
    goal: 'Master Staff-level technical leadership: the Minto Pyramid Principle and BLUF executive writing, resolving high-stakes architectural stalemates via Disagree and Commit, cross-functional Iron Triangle capacity negotiation, high-leverage code reviews with psychological safety, and driving multi-team organizational migrations without direct authority.',
    minutes: 45,
    recap: 'In Day 1, we mastered the STAR behavioral interview framework, bottom-line-first executive pitches, active listening in system design, 5 Whys blameless post-mortems, and compensation BATNA negotiation. Now, we advance into Staff+ leadership: pyramid technical writing, resolving contentious debates, engineering capacity allocation, empathetic mentorship, and driving cross-org change.',
    parts: [
      {
        title: 'The Minto Pyramid Principle & Bottom-Line-Up-Front (BLUF) Writing',
        say: [
          'In engineering organizations, the biggest source of wasted time is poorly structured technical documentation. Junior engineers often write RFCs chronologically: they describe all the rabbit holes they explored, all the failed experiments, and bury their actual recommendation at the very end of page 12.',
          'Executives, principal architects, and engineering managers do not have time to read narrative mystery novels. The industry standard for high-leverage technical writing is Barbara Minto Pyramid Principle and the Bottom-Line-Up-Front (BLUF) protocol.',
          'Under the Minto Pyramid, your core recommendation or answer MUST appear in the very first sentence. Once the reader understands the bottom line, the document branches downward into exactly three logically grouped supporting pillars: for example, Scalability, Availability, and Cost Efficiency.',
          'Each supporting pillar is backed by concrete data, architectural proofs, and trade-off analyses. Beneath the pillars sit the implementation details, risk mitigations, and operational rollout timelines.',
          'Documents structured this way respect the reader cognitive bandwidth: a CTO can read the first paragraph and approve the strategic direction in 60 seconds, while an infrastructure engineer can drill down into the low-level sharding math in Section 3.',
          'Adopting BLUF transforms your technical documents from confusing data dumps into persuasive decision instruments that get approved rapidly.'
        ],
        example: 'Think of a newspaper article versus a detective novel. A detective novel hides the identity of the culprit until the last page (chronological writing). A newspaper headline and lead paragraph shout: "EARTHQUAKE HITS COAST AT 4 AM; BRIDGES CLOSED" (BLUF), followed by smaller subheadings detailing emergency shelters, traffic detours, and meteorological reports.',
        code: `// Simulation: Technical RFC Document Evaluator using the Minto Pyramid Principle
interface TechnicalRfc {
  title: string;
  blufRecommendation: string;
  situation: string;
  complication: string;
  pillars: string[];
  riskMitigations: string[];
}

function evaluateRfcStructure(rfc: TechnicalRfc): {
  hasBlufFirst: boolean;
  pillarCount: number;
  cognitiveReadabilityScore: number;
  verdict: string;
} {
  const hasBluf = rfc.blufRecommendation.length > 30 && !rfc.blufRecommendation.toLowerCase().startsWith('in conclusion');
  const validPillars = rfc.pillars.length >= 3;
  const hasScqa = rfc.situation.length > 20 && rfc.complication.length > 20;

  let score = (hasBluf ? 40 : 10) + (validPillars ? 35 : 15) + (hasScqa ? 25 : 10);
  score = Math.min(100, score);

  return {
    hasBlufFirst: hasBluf,
    pillarCount: rfc.pillars.length,
    cognitiveReadabilityScore: score,
    verdict: score >= 90 ? 'EXECUTIVE READY: Decision makers can approve in 60 seconds.' : 'REWRITE NEEDED: Recommendation is buried.'
  };
}

const rfc: TechnicalRfc = {
  title: 'RFC-412: Database Sharding & Migration to Vitess',
  blufRecommendation: 'We recommend migrating our primary Aurora PostgreSQL cluster to Vitess by Q3 to support 10x Black Friday query volume while eliminating single-master replication lag.',
  situation: 'Our global transaction volume has grown 280% year-over-year, approaching 18,000 writes/sec.',
  complication: 'Our vertical database instance reaches 92% CPU during traffic spikes, and read-replica replication lag exceeds 4.5 seconds.',
  pillars: [
    'Horizontal Scalability: Vitess partitions write traffic across 16 shards with zero application query rewrites.',
    'Availability: Eliminates single point of failure (SPOF) with automatic shard failover under 500ms.',
    'Cost Efficiency: Reduces provisioned cloud compute overhead by 35% via dynamic auto-scaling pods.'
  ],
  riskMitigations: [
    'Dual-writing to shadow cluster during Q2 to verify consistency before cutting over.'
  ]
};

const evalResult = evaluateRfcStructure(rfc);

console.log('=== MINTO PYRAMID & BLUF TECHNICAL COMMUNICATION ===');
console.log('Document: ' + rfc.title);
console.log('BLUF Stated in Sentence 1: ' + (evalResult.hasBlufFirst ? 'YES (Immediate Cognitive Clarity)' : 'NO'));
console.log('Supporting Pillars (Rule of 3): ' + evalResult.pillarCount + ' Distinct Architectural Pillars');
console.log('Readability Score: ' + evalResult.cognitiveReadabilityScore + '/100 (' + evalResult.verdict + ')');
console.log('Core Takeaway: Lead with the decision recommendation, not the chronological journey.');`,
        output: `=== MINTO PYRAMID & BLUF TECHNICAL COMMUNICATION ===\nDocument: RFC-412: Database Sharding & Migration to Vitess\nBLUF Stated in Sentence 1: YES (Immediate Cognitive Clarity)\nSupporting Pillars (Rule of 3): 3 Distinct Architectural Pillars\nReadability Score: 100/100 (EXECUTIVE READY: Decision makers can approve in 60 seconds.)\nCore Takeaway: Lead with the decision recommendation, not the chronological journey.`,
        tryIt: 'Rewrite the BLUF recommendation to bury the lead with "After many meetings, in conclusion..." and observe how the score drops.',
        check: {
          question: 'What is the core structural rule of the Minto Pyramid Principle in technical engineering proposals?',
          options: [
            'State the bottom-line architectural recommendation in the very first sentence, supported by exactly three logical pillars',
            'Always format documents in reverse alphabetical order',
            'Write at least 50 pages before requesting team feedback'
          ],
          answer: 0,
          why: 'The Minto Pyramid dictates that the core conclusion or recommendation must be stated at the apex of the pyramid (sentence 1), allowing decision-makers to immediately grasp the takeaway before drilling down into supporting evidence.'
        }
      },
      {
        title: 'Managing Technical Disagreements: Disagree & Commit',
        say: [
          'In high-performing engineering teams, passionate technical disagreements are inevitable and healthy. When choosing between technologies—such as Kafka versus SQS, or GraphQL versus REST—smart engineers often champion opposing philosophies.',
          'Dysfunctional teams fall into one of two traps: either consensus paralysis (months of endless meetings with zero decision made) or passive-aggressive sabotage (engineers silently hoping the chosen architecture fails to say "I told you so").',
          'High-velocity technology companies resolve this using the Amazon leadership principle: "Have Backbone; Disagree and Commit."',
          'Having backbone means during the debate phase, you are obligated to vigorously articulate your technical concerns, surface trade-offs with empirical data, and challenge assumptions without fear of offending hierarchy.',
          'However, once the decision owner (often the Tech Lead, Staff Architect, or consensus majority) makes the call, the debate is officially over. Everyone—especially the dissenting engineers—must commit 100% of their energy to executing the chosen path flawlessly.',
          'Commitment means zero passive-aggressive foot-dragging, zero retrospective finger-pointing, and complete focus on building the guardrails to ensure the selected architecture succeeds.'
        ],
        example: 'Think of a rowing crew navigating a raging river fork. As you approach the fork, rowers can passionately debate whether to steer left around the rocks or right through the rapids. But the instant the coxswain shouts "STEER LEFT!", every rower must pull on the left oars with 100% force. If half the crew sulks and paddles right, the entire boat capsizes.',
        code: `// Simulation: Engineering Debate Resolution & Disagree and Commit Velocity
interface TechnicalDebate {
  topic: string;
  options: { name: string; advocate: string; pros: string[]; cons: string[] }[];
  finalDecision: string;
  teamCommitmentScore: number;
  status: 'STALEMATE' | 'CONSENSUS' | 'DISAGREE_AND_COMMIT';
}

function resolveEngineeringDisagreement(
  topic: string,
  options: { name: string; advocate: string; pros: string[]; cons: string[] }[],
  chosenOption: string
): TechnicalDebate {
  // If all advocates agree, it's consensus. If one compromises with full support, it's disagree & commit.
  return {
    topic,
    options,
    finalDecision: chosenOption,
    teamCommitmentScore: 100, // 100% velocity commitment once decided
    status: 'DISAGREE_AND_COMMIT'
  };
}

const debate = resolveEngineeringDisagreement(
  'Event Bus Migration: Apache Kafka vs AWS SQS/SNS',
  [
    { name: 'Kafka', advocate: 'Staff Infra Eng', pros: ['Exact ordering', 'Replayability', '1M msg/s'], cons: ['Self-managed ops overhead'] },
    { name: 'AWS SQS', advocate: 'Lead Backend Eng', pros: ['Serverless zero-ops', 'Native IAM auth'], cons: ['FIFO throughput limits'] }
  ],
  'Apache Kafka (with Confluent Cloud managed service to eliminate ops burden)'
);

console.log('=== MANAGING TECHNICAL DISAGREEMENTS: DISAGREE & COMMIT ===');
console.log('Architectural Debate: ' + debate.topic);
console.log('Final Engineering Decision: ' + debate.finalDecision);
console.log('Resolution State: ' + debate.status);
console.log('Execution Velocity: ' + debate.teamCommitmentScore + '% Team Commitment (Zero Passive-Aggressive Second-Guessing)');
console.log('Leadership Principle: Voice technical objections forcefully with evidence, then rally behind the chosen path 100%.');`,
        output: `=== MANAGING TECHNICAL DISAGREEMENTS: DISAGREE & COMMIT ===\nArchitectural Debate: Event Bus Migration: Apache Kafka vs AWS SQS/SNS\nFinal Engineering Decision: Apache Kafka (with Confluent Cloud managed service to eliminate ops burden)\nResolution State: DISAGREE_AND_COMMIT\nExecution Velocity: 100% Team Commitment (Zero Passive-Aggressive Second-Guessing)\nLeadership Principle: Voice technical objections forcefully with evidence, then rally behind the chosen path 100%.`,
        tryIt: 'Simulate what happens to execution velocity if a dissenting engineer second-guesses the decision during sprint implementation.',
        check: {
          question: 'What does the engineering principle "Disagree and Commit" require once a technical architecture decision has been finalized?',
          options: [
            'Dissenting engineers must continue writing memos trying to reverse the decision during the entire project',
            'Engineers who argued against the decision must fully support and commit 100% of their effort to make the chosen architecture succeed without second-guessing',
            'The project manager must fire anyone who disagreed'
          ],
          answer: 1,
          why: 'Disagree and Commit recognizes that total consensus is impossible. Once debate concludes and a decision is rendered, all team members must align 100% to execute the plan with velocity, eliminating destructive second-guessing and passive resistance.'
        }
      },
      {
        title: 'Cross-Functional Stakeholder Alignment & The Iron Triangle',
        say: [
          'Senior and Staff engineers do not operate in an isolated technical vacuum. They partner daily with Product Managers (PMs), Designers, Marketing, and Executive Leadership.',
          'A pervasive source of team burnout and acrimony occurs when Product Managers demand new features faster than engineering can responsibly deliver, leading to accumulating technical debt and fragile production deployments.',
          'Effective tech leads manage this tension using the classical Project Management Iron Triangle: Scope, Time, and Resources, with Quality as the fixed boundary invariant.',
          'When a PM asks to pull forward a deadline, an inexperienced engineer simply says an emotional "No, that’s impossible," alienating stakeholders. A Staff engineer reframes the conversation objectively through trade-offs: "We can hit the June 1st release date if we descope the bulk-export feature to Phase 2, or if we allocate two contractor engineers to build the data migration."',
          'Furthermore, world-class engineering teams protect systemic health using the 70/20/10 capacity rule: 70% of sprint hours are allocated to new product features, 20% is strictly reserved for technical debt, refactoring, and automated test hardening, and 10% is buffered for on-call triage and production anomalies.',
          'Protecting that 20% tech debt budget is non-negotiable: ignoring it produces compounding latency regressions, developer attrition, and catastrophic production outages.'
        ],
        example: 'Think of maintaining a high-performance commercial airliner. You can fly 70% of flights carrying paying passengers (product features), but you must reserve 20% of the hangar schedule for jet engine overhauls and software maintenance (tech debt), plus 10% weather contingency buffer. If the airline CEO tries to fly 100% passenger routes with zero maintenance, the engines will fail mid-flight.',
        code: `// Simulation: Cross-Functional Sprint Capacity Allocation & Iron Triangle Model
interface SprintCapacityPlan {
  totalHours: number;
  featureWorkPct: number;
  techDebtHardeningPct: number;
  unplannedBufferPct: number;
}

function evaluateCapacityBalance(plan: SprintCapacityPlan): {
  featureHours: number;
  techDebtHours: number;
  bufferHours: number;
  isSustainable: boolean;
  recommendation: string;
} {
  const featureHours = (plan.totalHours * plan.featureWorkPct) / 100;
  const techDebtHours = (plan.totalHours * plan.techDebtHardeningPct) / 100;
  const bufferHours = (plan.totalHours * plan.unplannedBufferPct) / 100;

  const isSustainable = plan.techDebtHardeningPct >= 20 && plan.unplannedBufferPct >= 10;

  return {
    featureHours,
    techDebtHours,
    bufferHours,
    isSustainable,
    recommendation: isSustainable
      ? 'BALANCED: Sustainable 70/20/10 allocation prevents burnout and system degradation.'
      : 'HIGH RISK: Insufficient tech debt investment will accelerate developer churn and incident rates.'
  };
}

const teamPlan: SprintCapacityPlan = {
  totalHours: 400, // 5 engineers * 2 weeks * 40 hours
  featureWorkPct: 70,
  techDebtHardeningPct: 20,
  unplannedBufferPct: 10
};

const balance = evaluateCapacityBalance(teamPlan);

console.log('=== CROSS-FUNCTIONAL ALIGNMENT & SPRINT CAPACITY TRIANGLE ===');
console.log('Total Engineering Capacity: ' + teamPlan.totalHours + ' Hours (5-Engineer Sprint)');
console.log('Allocated Product Features (70%): ' + balance.featureHours + ' Hours');
console.log('Allocated Tech Debt & Refactoring (20%): ' + balance.techDebtHours + ' Hours');
console.log('Unplanned On-Call & Bug Buffer (10%): ' + balance.bufferHours + ' Hours');
console.log('Sustainability Status: ' + (balance.isSustainable ? 'HEALTHY & BALANCED' : 'UNSUSTAINABLE'));
console.log('Stakeholder Negotiation: Frame trade-offs objectively rather than saying an emotional "no".');`,
        output: `=== CROSS-FUNCTIONAL ALIGNMENT & SPRINT CAPACITY TRIANGLE ===\nTotal Engineering Capacity: 400 Hours (5-Engineer Sprint)\nAllocated Product Features (70%): 280 Hours\nAllocated Tech Debt & Refactoring (20%): 80 Hours\nUnplanned On-Call & Bug Buffer (10%): 40 Hours\nSustainability Status: HEALTHY & BALANCED\nStakeholder Negotiation: Frame trade-offs objectively rather than saying an emotional "no".`,
        tryIt: 'Adjust the plan to 95% feature work and 5% tech debt to observe why the model flags it as HIGH RISK.',
        check: {
          question: 'Why should engineering teams reserve approximately 20% of their recurring sprint capacity for technical debt and hardening?',
          options: [
            'To ensure engineers can browse social media during work hours',
            'To continuously remediate architectural bottlenecks, refactor brittle code, and prevent compounding system instability that degrades future shipping velocity',
            'Because agile frameworks require exactly 20% unused time by law'
          ],
          answer: 1,
          why: 'Failing to continuously service technical debt leads to compounding code fragility, slower feature velocity, and frequent production outages. A consistent 20% investment preserves codebase health and sustains long-term delivery speed.'
        }
      },
      {
        title: 'High-Leverage Code Reviews & Psychological Safety',
        say: [
          'Code review is the most frequent cross-engineer communication touchpoint in tech. Unfortunately, many teams treat Pull Request reviews as bureaucratic gatekeeping or intellectual competitions where reviewers hunt for trivial syntax nitpicks to assert dominance.',
          'According to research by Amy Edmondson on Psychological Safety, teams with high psychological safety outperform low-safety teams by a wide margin. In a psychologically safe team, engineers feel safe taking risks, admitting knowledge gaps, and proposing bold architectural changes without fear of ridicule.',
          'High-leverage engineering reviewers adhere to three foundational code review invariants: Speed, Empathy, and Clear Labeling.',
          'First is review speed: PR turnaround time should be measured in hours, not days. Stale PRs create context-switching tax and merge conflicts.',
          'Second is labeling: reviewers should explicitly tag their feedback into three categories: BLOCKER (critical security hole, data loss risk, or broken logic that blocks merging), QUESTION (curious exploration: "Could we consider caching here?"), and NITPICK (purely cosmetic preferences: "nit: extra blank line").',
          'Crucially, prefixing cosmetic items with "nit:" communicates that the author is free to merge without addressing them, eliminating unnecessary review round-trips while separating critical defects from stylistic opinions.'
        ],
        example: 'Think of an architectural building inspection. The city inspector marks broken fire escape bolts as a mandatory code violation that stops building opening (BLOCKER). But they might mention in passing that painted blue trim would look nicer than grey (NITPICK), without blocking the grand opening ribbon-cutting ceremony over a paint color preference.',
        code: `// Simulation: Code Review Feedback Classification & Psychological Safety Evaluator
interface CodeReviewComment {
  type: 'BLOCKER' | 'QUESTION' | 'NITPICK';
  file: string;
  comment: string;
}

function classifyReviewComments(comments: CodeReviewComment[]): {
  blockers: number;
  questions: number;
  nitpicks: number;
  approvalRecommendation: 'APPROVE' | 'REQUEST_CHANGES' | 'COMMENT';
} {
  const blockers = comments.filter(c => c.type === 'BLOCKER').length;
  const questions = comments.filter(c => c.type === 'QUESTION').length;
  const nitpicks = comments.filter(c => c.type === 'NITPICK').length;

  const rec = blockers > 0 ? 'REQUEST_CHANGES' : 'APPROVE';

  return { blockers, questions, nitpicks, approvalRecommendation: rec };
}

const comments: CodeReviewComment[] = [
  { type: 'BLOCKER', file: 'payment.ts', comment: 'Security: Missing idempotency key check; double-clicking submit button could charge user twice.' },
  { type: 'QUESTION', file: 'orderService.ts', comment: 'Could we consider using an enum here instead of string literals to prevent typo bugs?' },
  { type: 'NITPICK', file: 'utils.ts', comment: 'nit: Extra blank line on line 42.' },
];

const analysis = classifyReviewComments(comments);

console.log('=== HIGH-LEVERAGE CODE REVIEWS & PSYCHOLOGICAL SAFETY ===');
console.log('Total Review Comments: ' + comments.length);
console.log('  Blockers (Critical Bugs/Security): ' + analysis.blockers);
console.log('  Architectural Questions (Collaborative Inquiries): ' + analysis.questions);
console.log('  Non-blocking Nitpicks: ' + analysis.nitpicks + ' (Labeled "nit:" so author is not blocked)');
console.log('Review Decision: ' + analysis.approvalRecommendation + ' (Changes requested strictly on blocker)');
console.log('Psychological Safety Invariant: Criticize the code, respect the person; frame feedback with empathy.');`,
        output: `=== HIGH-LEVERAGE CODE REVIEWS & PSYCHOLOGICAL SAFETY ===\nTotal Review Comments: 3\n  Blockers (Critical Bugs/Security): 1\n  Architectural Questions (Collaborative Inquiries): 1\n  Non-blocking Nitpicks: 1 (Labeled "nit:" so author is not blocked)\nReview Decision: REQUEST_CHANGES (Changes requested strictly on blocker)\nPsychological Safety Invariant: Criticize the code, respect the person; frame feedback with empathy.`,
        tryIt: 'Remove the blocker comment and observe how the review decision automatically transitions to APPROVE with questions answered asynchronously.',
        check: {
          question: 'Why should code reviewers explicitly label non-essential cosmetic feedback with the prefix "nit:"?',
          options: [
            'It signals to the PR author that the comment is an optional stylistic preference and does NOT block the pull request from being merged',
            'It tells the automated linter to delete the line of code',
            'It converts the comment into an automated Git commit'
          ],
          answer: 0,
          why: 'Labeling comments with "nit:" provides psychological clarity and prevents unnecessary review stalls. The author knows they can address the minor feedback if convenient, but the PR can proceed to deployment without another round-trip review gate.'
        }
      },
      {
        title: 'Staff+ Influence Without Authority & Driving Cross-Org Migrations',
        say: [
          'As software engineers advance to Staff, Principal, and Distinguished levels, their scope shifts from writing individual pull requests to driving company-wide architectural initiatives.',
          'Crucially, Staff engineers are individual contributors (ICs)—they have zero direct reports. They cannot order anyone to do anything. They must master the discipline of Influence Without Authority.',
          'When driving a massive cross-organizational migration—such as deprecating a legacy REST monolith in favor of gRPC microservices across 30 domain teams—mandating adoption from above almost always triggers covert passive resistance and missed deadlines.',
          'Effective Staff engineers use Coalition Building and Lighthouse Pilots. Instead of pitching all 30 teams at once, they partner with one friendly early-adopter team (the Lighthouse).',
          'The Staff engineer rolls up their sleeves, embeds with that team, builds ergonomic developer tooling, and solves all early pain points until that team achieves a demonstrable 5x throughput win in production.',
          'With concrete proof in hand, the Staff engineer showcases the win at engineering all-hands meetings. Other teams proactively volunteer to migrate, transforming an unpopular top-down mandate into organic, bottom-up organizational momentum that crosses the 80% adoption threshold effortlessly.'
        ],
        example: 'Think of introducing electric vehicles to a fleet of delivery drivers. If corporate executives issue a stern memo ordering everyone to abandon their gas trucks, drivers resist and complain. But if the company gives two enthusiastic drivers shiny electric vans for a month, and those drivers rave about how fast, quiet, and cheap they are, all the other drivers line up outside the depot asking for their own electric van.',
        code: `// Simulation: Cross-Organizational Initiative Adoption Curve & Coalition Tracker
interface ServiceMigrationStatus {
  serviceName: string;
  team: string;
  adoptedNewStandard: boolean;
  blockerReason?: string;
}

function trackCrossOrgAdoption(services: ServiceMigrationStatus[]): {
  totalServices: number;
  migratedCount: number;
  adoptionPct: number;
  readyForDeprecation: boolean;
} {
  const migrated = services.filter(s => s.adoptedNewStandard).length;
  const pct = Math.round((migrated / services.length) * 100);

  return {
    totalServices: services.length,
    migratedCount: migrated,
    adoptionPct: pct,
    readyForDeprecation: pct >= 80
  };
}

const enterpriseServices: ServiceMigrationStatus[] = [
  { serviceName: 'Auth-Gateway', team: 'Identity Team', adoptedNewStandard: true },
  { serviceName: 'Billing-Engine', team: 'Fintech Team', adoptedNewStandard: true },
  { serviceName: 'Search-Indexer', team: 'Search Team', adoptedNewStandard: true },
  { serviceName: 'Recommendation-API', team: 'ML Team', adoptedNewStandard: true },
  { serviceName: 'Legacy-Reporting', team: 'Data Team', adoptedNewStandard: false, blockerReason: 'Scheduled for Q4' },
];

const migration = trackCrossOrgAdoption(enterpriseServices);

console.log('=== STAFF+ INFLUENCE WITHOUT AUTHORITY (CROSS-ORG ADOPTION) ===');
console.log('Initiative: Enterprise Monolith to gRPC Microservices Standardization');
console.log('Total Domain Teams Coordinated: ' + migration.totalServices);
console.log('Services Migrated via Coalition Building: ' + migration.migratedCount + '/' + migration.totalServices + ' (' + migration.adoptionPct + '%)');
console.log('Legacy Protocol Deprecation Gate (80% Threshold): ' + (migration.readyForDeprecation ? 'PASSED (Deprecation Window Scheduled)' : 'BLOCKED'));
console.log('Influence Mechanics: Build early lighthouse pilots with one friendly team, demonstrate 5x win, then scale adoption.');`,
        output: `=== STAFF+ INFLUENCE WITHOUT AUTHORITY (CROSS-ORG ADOPTION) ===\nInitiative: Enterprise Monolith to gRPC Microservices Standardization\nTotal Domain Teams Coordinated: 5\nServices Migrated via Coalition Building: 4/5 (80%)\nLegacy Protocol Deprecation Gate (80% Threshold): PASSED (Deprecation Window Scheduled)\nInfluence Mechanics: Build early lighthouse pilots with one friendly team, demonstrate 5x win, then scale adoption.`,
        tryIt: 'Add another unmigrated service to drop the adoption percentage below 80% and observe the deprecation gate trigger.',
        check: {
          question: 'How do Staff+ engineers effectively drive company-wide technical migrations without direct managerial authority over other teams?',
          options: [
            'By partnering with an early-adopter team on a lighthouse pilot, demonstrating undeniable production wins, and providing tooling that makes adoption effortless',
            'By secretly deleting other teams’ production repositories over the weekend',
            'By waiting for the CEO to personally mandate the migration in an email'
          ],
          answer: 0,
          why: 'Influence without authority relies on coalition building and proof. By co-developing a lighthouse pilot that delivers real production wins, Staff engineers generate voluntary enthusiasm and organic peer adoption across organizational silos.'
        }
      }
    ],
    summary: [
      'The Minto Pyramid Principle and BLUF protocol state the core architectural conclusion in sentence 1, supported by three distinct pillars.',
      'Disagree and Commit requires engineers to voice data-driven objections forcefully during debate, then commit 100% to executing the chosen path.',
      'The Iron Triangle model balances Scope, Time, and Resources, using the 70/20/10 sprint rule to protect technical debt and on-call capacity.',
      'High-leverage code reviews build psychological safety by separating critical BLOCKERS from collaborative QUESTIONS and non-blocking NITPICKS.',
      'Staff+ engineers drive cross-org architectural migrations through lighthouse pilots, coalition building, and influence without authority.'
    ],
    projectStep: {
      title: 'Author a Staff-Level Architectural RFC & Cross-Org Migration Blueprint',
      steps: [
        'Structure a technical RFC using the Minto Pyramid with a 60-second BLUF executive summary and 3 supporting pillars.',
        'Model an architectural trade-off document establishing Disagree and Commit consensus across competing proposals.',
        'Draft a 70/20/10 sprint capacity allocation plan negotiating tech debt remediation with product managers.',
        'Conduct a mock code review categorizing feedback into Blockers, Collaborative Questions, and non-blocking Nitpicks.',
        'Formulate a multi-team migration strategy identifying early lighthouse pilot teams and deprecation metrics.'
      ]
    }
  },
  {
    coursePrefix: 'soft-skills',
    day: 3,
    title: 'Executive Leadership, Crucial Conversations & Cross-Functional Alignment',
    goal: 'Master the interpersonal and organizational leadership required of Principal and Staff engineers: navigating Radical Candor feedback loops, defusing high-stakes incident tension with Non-Violent Communication (NVC), driving consensus across cross-functional RFCs and PRDs, executing clean stakeholder escalations without burning bridges, and delivering compelling C-suite executive briefings.',
    minutes: 45,
    recap: 'In Day 2, we mastered the Minto Pyramid Principle, Disagree and Commit consensus models, Iron Triangle capacity planning, psychological safety in code reviews, and influence without authority. In Day 3, we elevate to executive-grade interpersonal communication: delivering radical candor, conducting crucial conversations during production fire drills, driving cross-functional product alignment through formal RFC/ADR lifecycles, navigating clean stakeholder escalation ladders, and framing technical proposals for boardroom buy-in.',
    parts: [
      {
        title: 'Radical Candor: Balancing Caring Personally with Challenging Directly',
        say: [
          'Giving and receiving critical feedback is the ultimate litmus test of engineering leadership. Many senior engineers mistake harsh bluntness for honesty, destroying psychological safety and leaving teammates demoralized and defensive.',
          'Kim Scott Radical Candor framework provides a 2x2 matrix defined by two orthogonal axes: Caring Personally on the vertical axis and Challenging Directly on the horizontal axis. Radical Candor sits in the upper-right quadrant, where high personal care is combined with uncompromising directness.',
          'When you care personally but fail to challenge directly, you slide into Ruinous Empathy: you avoid giving tough feedback to spare temporary feelings, which ultimately allows substandard work to persist and hurts the engineer career trajectory.',
          'When you challenge directly without caring personally, you land in Obnoxious Aggression: public insults, patronizing code review comments, and dressing down peers in post-mortems trigger fight-or-flight reactions that paralyze team collaboration.',
          'Manipulative Insincerity sits in the bottom-left corner where someone neither cares nor speaks the truth, playing political games and gossiping behind backs. Radical Candor is kind, direct, timely, and actionable: it critiques the work and the code behavior, never the human character or intelligence.',
          'Practicing Radical Candor creates an environment where high technical standards and emotional safety coexist naturally.'
        ],
        example: 'Imagine a teammate who repeatedly commits code without integration tests, breaking the staging build. Ruinous Empathy says: "Great effort, don’t worry about the build failure, we will fix it later." Obnoxious Aggression says: "Your code is garbage and you are incompetent." Radical Candor says: "I know how hard you worked on this PR and I value your domain insight, but the missing test coverage puts the release at risk. Let’s sit together today and write those integration tests before merging."',
        code: `// Simulation: Radical Candor Feedback Evaluator Matrix
type CandorQuadrant = 'RADICAL_CANDOR' | 'RUINOUS_EMPATHY' | 'OBNOXIOUS_AGGRESSION' | 'MANIPULATIVE_INSINCERITY';

interface FeedbackProfile {
  carePersonally: number;   // 1 to 10
  challengeDirectly: number; // 1 to 10
  statement: string;
}

class RadicalCandorEngine {
  classifyFeedback(profile: FeedbackProfile): {
    quadrant: CandorQuadrant;
    actionable: boolean;
    diagnosis: string;
  } {
    const highCare = profile.carePersonally >= 6;
    const highChallenge = profile.challengeDirectly >= 6;

    if (highCare && highChallenge) {
      return {
        quadrant: 'RADICAL_CANDOR',
        actionable: true,
        diagnosis: 'Kind, direct, and actionable: challenges behavior without demeaning identity.'
      };
    }
    if (highCare && !highChallenge) {
      return {
        quadrant: 'RUINOUS_EMPATHY',
        actionable: false,
        diagnosis: 'Protects feelings in the short term but allows performance to fail long term.'
      };
    }
    if (!highCare && highChallenge) {
      return {
        quadrant: 'OBNOXIOUS_AGGRESSION',
        actionable: false,
        diagnosis: 'Brutally honest without empathy; triggers fight-or-flight defensiveness.'
      };
    }
    return {
      quadrant: 'MANIPULATIVE_INSINCERITY',
      actionable: false,
      diagnosis: 'Political and passive-aggressive: neither cares nor speaks the truth.'
    };
  }
}

const candor = new RadicalCandorEngine();
const example1 = candor.classifyFeedback({
  carePersonally: 9,
  challengeDirectly: 8,
  statement: 'I know how hard you worked on this PR, but the missing test coverage puts the release at risk. Let’s add the integration tests today.'
});
const example2 = candor.classifyFeedback({
  carePersonally: 9,
  challengeDirectly: 2,
  statement: 'It’s fine, don’t worry about the missing tests, I am sure production will be fine.'
});

console.log('=== RADICAL CANDOR FEEDBACK MATRIX ===');
console.log('Example 1 Classification: ' + example1.quadrant + ' (Actionable: ' + example1.actionable + ')');
console.log('Diagnosis 1: ' + example1.diagnosis);
console.log('Example 2 Classification: ' + example2.quadrant + ' (Actionable: ' + example2.actionable + ')');
console.log('Core Insight: Radical Candor requires high personal care AND high direct challenge simultaneously.');`,
        output: `=== RADICAL CANDOR FEEDBACK MATRIX ===
Example 1 Classification: RADICAL_CANDOR (Actionable: true)
Diagnosis 1: Kind, direct, and actionable: challenges behavior without demeaning identity.
Example 2 Classification: RUINOUS_EMPATHY (Actionable: false)
Core Insight: Radical Candor requires high personal care AND high direct challenge simultaneously.`,
        tryIt: 'Adjust the carePersonally and challengeDirectly sliders to simulate how obnoxious aggression damages engineering trust.',
        check: {
          question: 'In the Radical Candor framework, what quadrant occurs when a tech lead cares deeply about an engineer feelings but avoids challenging their low-quality code directly?',
          options: [
            'Radical Candor',
            'Ruinous Empathy',
            'Obnoxious Aggression',
            'Manipulative Insincerity'
          ],
          answer: 1,
          why: 'Ruinous Empathy occurs when someone cares personally but fails to challenge directly. By withholding constructive criticism to avoid temporary discomfort, the leader prevents the engineer from learning and allows code quality to degrade.'
        }
      },
      {
        title: 'Crucial Conversations & Non-Violent Communication (NVC) in Outages',
        say: [
          'When a multi-region database outage strikes and thousands of customers are failing transactions, adrenaline spikes and cognitive bandwidth narrows. Under acute crisis stress, engineering retrospectives frequently devolve into blame attribution and emotional finger-pointing.',
          'The Non-Violent Communication (NVC) framework, developed by Marshall Rosenberg, offers a reliable conversational protocol designed to de-escalate tension and restore collaborative problem-solving through four distinct steps: Observation, Feeling, Need, and Request (OFNR).',
          'First, the Observation must be purely factual, observable, and stripped of moral judgments, generalizations, or accusatory language such as "always" or "careless." For instance, "The database migration script was committed 20 minutes before cutoff without peer review" is an objective fact, not an accusation.',
          'Second, articulate the Feeling as an emotional state rather than a veiled accusation: "I feel anxious and concerned about production database downtime," rather than "I feel that you are reckless."',
          'Third, identify the underlying Need: "We need predictable, stress-free deployments and verified schema migrations that protect our SLA." This connects back to shared engineering values that everyone on the team agrees with.',
          'Fourth, issue a concrete, actionable Request: "Can we agree to a 24-hour code freeze for all SQL migrations prior to release?" By separating factual observations from emotional interpretations, NVC neutralizes defensiveness and builds lasting psychological safety.'
        ],
        example: 'Contrast a toxic outage retrospective comment ("You always push reckless migrations and break everything!") with an NVC statement: "During the last 3 releases, migrations ran without peer sign-off (Observation). I feel anxious about stability (Feeling). We need reliable uptime and safe schema transitions (Need). Can we mandate two DBA approvals on all schema changes going forward? (Request)."',
        code: `// Simulation: Crucial Conversations NVC Protocol Validator
interface NvcMessage {
  observation: string;
  feeling: string;
  need: string;
  request: string;
}

class NvcValidator {
  validateEngineeringFeedback(msg: NvcMessage): {
    isValidNvc: boolean;
    containsMoralJudgments: boolean;
    psychologicalSafetyScore: number;
  } {
    // Check for judgmental red flags in observation (e.g. "always", "lazy", "careless")
    const judgmentWords = ['always', 'never', 'lazy', 'careless', 'sloppy', 'stupid'];
    const hasJudgment = judgmentWords.some(w => msg.observation.toLowerCase().includes(w));

    const isComplete = Boolean(msg.observation && msg.feeling && msg.need && msg.request);
    const score = isComplete && !hasJudgment ? 100 : hasJudgment ? 35 : 60;

    return {
      isValidNvc: isComplete && !hasJudgment,
      containsMoralJudgments: hasJudgment,
      psychologicalSafetyScore: score
    };
  }
}

const nvc = new NvcValidator();
const validNvcMessage: NvcMessage = {
  observation: 'In the last 3 sprint releases, the database migration script was committed 20 minutes before cutoff without peer review.',
  feeling: 'I feel anxious and concerned about production database downtime.',
  need: 'We need predictable, stress-free deployments and verified schema migrations.',
  request: 'Can we agree to a 24-hour code freeze for all SQL migrations prior to release?'
};

const evaluation = nvc.validateEngineeringFeedback(validNvcMessage);

console.log('=== CRUCIAL CONVERSATIONS & NON-VIOLENT COMMUNICATION (NVC) ===');
console.log('OFNR Protocol Completeness: ' + (evaluation.isValidNvc ? '100% VALID NVC STRUCTURE' : 'INVALID'));
console.log('Contains Moral Judgments: ' + evaluation.containsMoralJudgments);
console.log('Psychological Safety Score: ' + evaluation.psychologicalSafetyScore + '/100');
console.log('Actionable Request: ' + validNvcMessage.request);`,
        output: `=== CRUCIAL CONVERSATIONS & NON-VIOLENT COMMUNICATION (NVC) ===
OFNR Protocol Completeness: 100% VALID NVC STRUCTURE
Contains Moral Judgments: false
Psychological Safety Score: 100/100
Actionable Request: Can we agree to a 24-hour code freeze for all SQL migrations prior to release?`,
        tryIt: 'Inject an accusatory word like "sloppy" or "lazy" into the observation to see the psychological safety score drop to 35.',
        check: {
          question: 'What are the four sequential components of Marshall Rosenberg Non-Violent Communication (NVC) framework?',
          options: [
            'Opinion, Frustration, Negotiation, Resolution',
            'Observation, Feeling, Need, Request (OFNR)',
            'Obstacle, Feedback, Nuance, Reaction',
            'Order, Fact, Nullification, Redirection'
          ],
          answer: 1,
          why: 'The NVC protocol consists of Observation (objective facts without judgment), Feeling (emotion expressed without blame), Need (universal requirement or value), and Request (actionable, positive proposal).'
        }
      },
      {
        title: 'Cross-Functional RFC & PRD Engineering Alignment',
        say: [
          'Large-scale engineering initiatives rarely fail due to technical insufficiency; they fail due to misaligned expectations between Engineering, Product Management, Design, and Operations. When engineers write architectural proposals in isolation, they build elegant solutions to the wrong problems.',
          'A mature engineering organization uses a standardized Request for Comments (RFC) and Architecture Decision Record (ADR) lifecycle to bridge technical architecture with Product Requirement Documents (PRDs).',
          'The RFC lifecycle begins with a problem statement tied directly to product metrics, such as user latency, conversion rate, or infrastructure COGS. It outlines proposed technical alternatives, trade-off matrices, data models, and migration paths.',
          'To prevent endless review cycles and bikeshedding, an RFC must have a time-boxed review window, designated decision-makers (such as the Lead Architect or Staff Engineer), and explicit criteria for resolving blocker comments.',
          'Once all blocker comments are resolved or arbitrated, the RFC is sealed as an Architecture Decision Record (ADR), creating an immutable, historical record of why specific technical decisions and compromises were chosen.',
          'This alignment process ensures product stakeholders understand technical constraints while engineers remain accountable to business outcomes.'
        ],
        example: 'Think of an RFC as a legislative bill and an ADR as a signed law. While the bill is in draft and committee review (RFC stage), stakeholders debate amendments and resolve objections. Once consensus is reached and signed off, it becomes permanent law (ADR), unblocking engineering teams to execute without revisiting settled debates every sprint.',
        code: `// Simulation: Cross-Functional RFC Lifecycle Engine
type RfcStatus = 'DRAFT' | 'IN_REVIEW' | 'BLOCKERS_RESOLVED' | 'APPROVED_ADR';

interface RfcDocument {
  id: string;
  title: string;
  author: string;
  reviewers: string[];
  blockerCommentsCount: number;
  daysInReview: number;
  maxReviewWindowDays: number;
}

class RfcLifecycleEngine {
  evaluateRfcStatus(rfc: RfcDocument): {
    status: RfcStatus;
    readyForImplementation: boolean;
    recommendation: string;
  } {
    if (rfc.daysInReview > rfc.maxReviewWindowDays && rfc.blockerCommentsCount > 0) {
      return {
        status: 'IN_REVIEW',
        readyForImplementation: false,
        recommendation: 'REVIEW_TIMEOUT: Escalate unaddressed blockers to Principal Architect for tie-breaking decision.'
      };
    }
    if (rfc.blockerCommentsCount === 0 && rfc.daysInReview >= 3) {
      return {
        status: 'APPROVED_ADR',
        readyForImplementation: true,
        recommendation: 'CONSENSUS_ACHIEVED: Architecture Decision Record signed off; create Jira epics.'
      };
    }
    return {
      status: 'IN_REVIEW',
      readyForImplementation: false,
      recommendation: 'ACTIVE_REVIEW: ' + rfc.blockerCommentsCount + ' blocker comments pending resolution.'
    };
  }
}

const rfcEngine = new RfcLifecycleEngine();
const rfcDoc: RfcDocument = {
  id: 'RFC-104',
  title: 'Migrating Search Indexing from Elasticsearch to Vector Search',
  author: 'Staff Backend Eng',
  reviewers: ['Lead Infra Eng', 'Security Architect', 'Principal PM'],
  blockerCommentsCount: 0,
  daysInReview: 5,
  maxReviewWindowDays: 7
};

const rfcResult = rfcEngine.evaluateRfcStatus(rfcDoc);

console.log('=== CROSS-FUNCTIONAL RFC LIFECYCLE & ADR SIGN-OFF ===');
console.log('RFC Document: [' + rfcDoc.id + '] ' + rfcDoc.title);
console.log('Current Status: ' + rfcResult.status);
console.log('Implementation Ready: ' + rfcResult.readyForImplementation);
console.log('Next Step: ' + rfcResult.recommendation);`,
        output: `=== CROSS-FUNCTIONAL RFC LIFECYCLE & ADR SIGN-OFF ===
RFC Document: [RFC-104] Migrating Search Indexing from Elasticsearch to Vector Search
Current Status: APPROVED_ADR
Implementation Ready: true
Next Step: CONSENSUS_ACHIEVED: Architecture Decision Record signed off; create Jira epics.`,
        tryIt: 'Introduce an unresolved blocker comment to see the status revert to IN_REVIEW.',
        check: {
          question: 'What is the primary function of converting an approved RFC into an Architecture Decision Record (ADR)?',
          options: [
            'To automatically generate frontend TypeScript components from the database schema',
            'To establish an immutable historical record of the context, trade-offs, and consensus reached for an architectural choice',
            'To immediately delete legacy code without unit testing',
            'To bypass all product management roadmap review gates'
          ],
          answer: 1,
          why: 'An Architecture Decision Record (ADR) serves as a persistent, version-controlled document that records why a specific architectural path was selected, what trade-offs were accepted, and which alternatives were rejected.'
        }
      },
      {
        title: 'High-Stakes Stakeholder Escalation Matrix',
        say: [
          'In any growing organization, teams will eventually encounter irreconcilable trade-offs: team A needs a payment API completed this sprint to hit an enterprise customer contract, while team B is in the middle of a mandatory database migration and refuses to take on new work.',
          'Junior engineers often view escalation as a personal failure or an aggressive declaration of war against another team. In contrast, Staff and Principal engineers understand that escalation is an essential governance protocol to route trade-off decisions to the leaders who hold budget and priority authority.',
          'The key to a "clean escalation" is transparency, speed, and shared problem ownership. You must never escalate behind another team back or surprise a peer lead in an executive meeting.',
          'A structured escalation ladder defines clear tiers: Level 1 is a direct peer lead sync to explore compromise; Level 2 is Engineering Manager alignment on sprint capacity and backlog sequencing; Level 3 is a joint VP/Director executive review with a pre-circulated trade-off memo.',
          'In a clean escalation, both team leads author the memo together, laying out Option A (prioritize payments, delay DB migration) and Option B (prioritize DB migration, defer payments contract) with objective impacts, and present it jointly to leadership.',
          'When done properly, escalation removes emotional resentment and empowers executive leadership to make clear, data-informed prioritization choices.'
        ],
        example: 'Imagine a railway track switch where two trains are heading toward the same junction. Instead of train conductors arguing over the radio about who deserves to go first, the track dispatcher evaluates the overall network schedule and switches the track. Escalation is alerting the dispatcher with full visibility so the system runs smoothly.',
        code: `// Simulation: Stakeholder Escalation Matrix & Conflict Resolution Router
type EscalationLevel = 'LEVEL_1_PEER_SYNC' | 'LEVEL_2_MANAGER_ALIGN' | 'LEVEL_3_VP_EXECUTIVE_ESC';

interface ProjectRoadblock {
  blockingTeam: string;
  impactOnTargetLaunchDays: number;
  crossTeamDisagreementDays: number;
}

class StakeholderEscalationRouter {
  routeRoadblock(roadblock: ProjectRoadblock): {
    level: EscalationLevel;
    recommendedAction: string;
    cleanEscalationProtocol: string;
  } {
    if (roadblock.impactOnTargetLaunchDays > 14 || roadblock.crossTeamDisagreementDays > 5) {
      return {
        level: 'LEVEL_3_VP_EXECUTIVE_ESC',
        recommendedAction: 'Schedule joint 30-min VP review with pre-circulated trade-off memo presenting two viable options.',
        cleanEscalationProtocol: 'Notify blocking team lead in advance; attend meeting together as joint partners.'
      };
    }
    if (roadblock.impactOnTargetLaunchDays > 5 || roadblock.crossTeamDisagreementDays > 2) {
      return {
        level: 'LEVEL_2_MANAGER_ALIGN',
        recommendedAction: 'Engineering Managers align on sprint capacity reallocation and dependency sequencing.',
        cleanEscalationProtocol: 'Share factual dependency log without finger-pointing.'
      };
    }
    return {
      level: 'LEVEL_1_PEER_SYNC',
      recommendedAction: 'Direct tech lead 1-on-1 working session to unblock API schema contract.',
      cleanEscalationProtocol: 'Work directly with peer engineer to find compromise.'
    };
  }
}

const escRouter = new StakeholderEscalationRouter();
const criticalRoadblock: ProjectRoadblock = {
  blockingTeam: 'Core Payments Team',
  impactOnTargetLaunchDays: 20,
  crossTeamDisagreementDays: 6
};

const escDecision = escRouter.routeRoadblock(criticalRoadblock);

console.log('=== HIGH-STAKES STAKEHOLDER ESCALATION MATRIX ===');
console.log('Blocking Entity: ' + criticalRoadblock.blockingTeam + ' (Impact: +' + criticalRoadblock.impactOnTargetLaunchDays + ' days)');
console.log('Escalation Tier: ' + escDecision.level);
console.log('Action: ' + escDecision.recommendedAction);
console.log('Clean Escalation Rule: ' + escDecision.cleanEscalationProtocol);`,
        output: `=== HIGH-STAKES STAKEHOLDER ESCALATION MATRIX ===
Blocking Entity: Core Payments Team (Impact: +20 days)
Escalation Tier: LEVEL_3_VP_EXECUTIVE_ESC
Action: Schedule joint 30-min VP review with pre-circulated trade-off memo presenting two viable options.
Clean Escalation Rule: Notify blocking team lead in advance; attend meeting together as joint partners.`,
        tryIt: 'Reduce impactOnTargetLaunchDays to 3 and disagreement days to 1 to verify routing to a Level 1 Peer Sync.',
        check: {
          question: 'What is the golden rule of a "clean escalation" when resolving a cross-team blocking dependency?',
          options: [
            'Send an anonymous complaint directly to human resources',
            'Escalate secretly to the CEO without informing the other team lead',
            'Inform the blocking team lead in advance and present a joint trade-off memo to leadership as collaborative partners',
            'Block their pull requests on GitHub in retaliation'
          ],
          answer: 2,
          why: 'A clean escalation is transparent and blameless. By notifying the blocking team lead in advance and authoring a joint memo presenting concrete trade-offs, both leads preserve trust and empower executives to make business-level priority calls.'
        }
      },
      {
        title: 'Executive Presentation Framing & Boardroom Delivery',
        say: [
          'Presenting architectural roadmaps or budget proposals to the C-suite and Board of Directors requires an entirely different cognitive vocabulary than presenting to an engineering sprint demo. Executives do not evaluate projects based on Kafka partitions, Kubernetes namespaces, or TypeScript strict typing.',
          'Boardrooms operate on three primary currencies: Revenue Growth, Risk Mitigation, and Cost Efficiency. If your presentation begins with 15 slides explaining microservice networking diagrams, you will lose your executive audience in the first five minutes.',
          'An effective executive briefing leads with the financial and strategic bottom line: "We are requesting a $400K engineering investment over two quarters to build an AI-powered interview copilot, projected to generate $2.5M in enterprise ARR, delivering a 6.3x return on capital."',
          'Follow the bottom line with the primary strategic risk and your concrete mitigation plan, showing that you have thought like an owner and stress-tested worst-case scenarios.',
          'Keep technical architecture relegated to the appendix: if the CTO or Head of Security wants to drill into data residency or compliance boundaries, pull up the supporting slides on demand.',
          'Framing your technical proposals in terms of ROI, bounded risk, and capital efficiency earns engineering leadership the credibility to secure funding for critical infrastructure initiatives.'
        ],
        example: 'Compare an engineer telling a CEO: "We need to rewrite the search pipeline in Rust because C++ memory leaks are annoying," versus: "Migrating our search indexing engine will reduce cloud infrastructure spend by $400K annually and improve p99 query latency from 800ms to 120ms, boosting checkout conversions by 4.2%."',
        code: `// Simulation: Executive Boardroom Briefing & ROI Formatter
interface ExecutiveProjectProposal {
  initiative: string;
  projectedRevenueGainUsd: number;
  engineeringCostUsd: number;
  implementationQuarters: number;
  primaryRisk: string;
}

class ExecutiveBriefingFormatter {
  formatCSuiteSummary(proposal: ExecutiveProjectProposal): {
    roiMultiple: number;
    bottomLineSummary: string;
    decisionRecommendation: string;
  } {
    const roi = Number((proposal.projectedRevenueGainUsd / proposal.engineeringCostUsd).toFixed(1));
    const summary = 'Investment of $' + (proposal.engineeringCostUsd / 1000).toFixed(0) + 'K yields $' +
      (proposal.projectedRevenueGainUsd / 1e6).toFixed(1) + 'M return (' + roi + 'x ROI) over ' +
      proposal.implementationQuarters + ' quarters.';

    return {
      roiMultiple: roi,
      bottomLineSummary: summary,
      decisionRecommendation: roi >= 3.0 ? 'FUND_IMMEDIATELY' : 'RE-EVALUATE_PRIORITIES'
    };
  }
}

const execFormatter = new ExecutiveBriefingFormatter();
const proposal: ExecutiveProjectProposal = {
  initiative: 'AI-Powered Interview Copilot Tier',
  projectedRevenueGainUsd: 2500000,
  engineeringCostUsd: 400000,
  implementationQuarters: 2,
  primaryRisk: 'Third-party LLM latency spikes during peak user load'
};

const execScorecard = execFormatter.formatCSuiteSummary(proposal);

console.log('=== EXECUTIVE PRESENTATION FRAMING & BOARDROOM DELIVERY ===');
console.log('Executive Initiative: ' + proposal.initiative);
console.log('Bottom-Line Impact: ' + execScorecard.bottomLineSummary);
console.log('C-Suite ROI Metric: ' + execScorecard.roiMultiple + 'x Return on Capital');
console.log('Executive Recommendation: ' + execScorecard.decisionRecommendation + ' (Clear ROI, bounded risk)');`,
        output: `=== EXECUTIVE PRESENTATION FRAMING & BOARDROOM DELIVERY ===
Executive Initiative: AI-Powered Interview Copilot Tier
Bottom-Line Impact: Investment of $400K yields $2.5M return (6.3x ROI) over 2 quarters.
C-Suite ROI Metric: 6.3x Return on Capital
Executive Recommendation: FUND_IMMEDIATELY (Clear ROI, bounded risk)`,
        tryIt: 'Increase engineeringCostUsd to $1.2M to observe how the ROI drops and flips the recommendation to RE-EVALUATE_PRIORITIES.',
        check: {
          question: 'When presenting a major engineering infrastructure proposal to C-level executives, what should form the core opening focus?',
          options: [
            'A 20-slide deep dive into Kafka consumer group partition rebalancing',
            'Direct business outcomes, ROI, capital efficiency, and bounded risk mitigation',
            'A line-by-line critique of the previous architecture team failures',
            'A request for unlimited budget with no delivery timelines'
          ],
          answer: 1,
          why: 'Executive decision-makers operate on business metrics, return on invested capital, and risk management. Technical implementation details should be kept in the appendix, while the presentation opens with bottom-line strategic value.'
        }
      }
    ],
    summary: [
      'Radical Candor balances high personal care with uncompromising direct challenge, avoiding ruinous empathy and obnoxious aggression.',
      'The NVC framework enforces the OFNR protocol (Observation, Feeling, Need, Request) to de-escalate blame during outage retrospectives.',
      'Cross-functional RFC lifecycles align engineering constraints with PRDs, creating immutable Architecture Decision Records (ADRs).',
      'Clean stakeholder escalations are transparent and joint, bringing pre-circulated trade-off memos to leadership without surprises.',
      'Executive presentations frame technical infrastructure investments around ROI, capital efficiency, and bounded risk mitigations.'
    ],
    projectStep: {
      title: 'Author an Executive Briefing Memo & Cross-Functional Alignment Blueprint',
      steps: [
        'Formulate a 2x2 Radical Candor feedback matrix diagnosing team code review behaviors.',
        'Apply the 4-step OFNR protocol to draft a blameless retrospective communication for a tier-1 outage.',
        'Structure a formal RFC lifecycle transition document resolving blocker comments into an approved ADR.',
        'Model a Level 3 joint executive escalation memo outlining trade-offs between competing team roadmaps.',
        'Draft a 60-second C-suite executive briefing calculating ROI multiple and financial payback for an AI initiative.'
      ]
    }
  },
  {
    day: 4,
    title: 'Principled Negotiation, Strategic Roadmap Prioritization & Engineering Org Leadership',
    goal: 'Master advanced engineering leadership: Principled negotiation (Fisher-Ury BATNA and ZOPA dynamics), quantitative roadmap prioritization (RICE scoring & Opportunity Solution Trees), performance coaching & constructive PIP design, Staff+ career archetype navigation, and blameless postmortem facilitation under high incident pressure.',
    minutes: 36,
    recap: 'Welcome to Advanced Engineering Org Leadership. Today we elevate our influence beyond technical design into organizational diplomacy, executive negotiation, roadmap economics, and psychological safety under pressure.',
    parts: [
      {
        title: 'Principled Negotiation & Fisher-Ury Framework (BATNA & ZOPA)',
        say: [
          'Technical leadership frequently requires intense negotiation: securing headcount allocations, aligning on API release deadlines with product managers, or negotiating cross-team dependency commitments. Inexperienced engineers often approach negotiation as a zero-sum tug-of-war, digging into rigid positions (such as "We refuse to support this endpoint until Q3") that damage cross-functional relationships.',
          'The Harvard Principled Negotiation method, pioneered by Roger Fisher and William Ury in Getting to Yes, replaces positional warfare with four core principles: separate the people from the problem, focus on underlying interests rather than entrenched positions, invent creative options for mutual gain, and insist on objective evaluation criteria.',
          'Two concepts anchor effective negotiation: BATNA (Best Alternative To a Negotiated Agreement) and ZOPA (Zone of Possible Agreement). Your BATNA represents your walk-away power: what you will do if no agreement is reached. The ZOPA is the mathematical overlap between the maximum concessions party A is willing to make and the minimum acceptable terms of party B. Identifying the ZOPA transforms heated political debates into collaborative problem-solving exercises.'
        ],
        example: 'Like purchasing a commercial building: instead of arguing angrily over a fixed sticker price, you explore flexible closing dates, seller financing, and shared maintenance credits until both sides discover a mutually profitable transaction inside the ZOPA.',
        code: `// Principled Negotiation & BATNA/ZOPA Dynamics Simulator
interface NegotiationParameters {
  partyAName: string;
  partyBName: string;
  partyABatnaMinHours: number;
  partyABatnaMaxHours: number;
  partyBBatnaMinHours: number;
  partyBBatnaMaxHours: number;
}

class PrincipledNegotiationEngine {
  calculateZopa(params: NegotiationParameters): { hasZopa: boolean; zopaRange: [number, number]; outcome: string } {
    // ZOPA exists if party A's max acceptable delivery overlaps party B's min commitment
    const overlapMin = Math.max(params.partyABatnaMinHours, params.partyBBatnaMinHours);
    const overlapMax = Math.min(params.partyABatnaMaxHours, params.partyBBatnaMaxHours);

    if (overlapMin <= overlapMax) {
      return {
        hasZopa: true,
        zopaRange: [overlapMin, overlapMax],
        outcome: 'AGREEMENT_REACHED: Mutual ZOPA identified between ' + overlapMin + 'h and ' + overlapMax + 'h'
      };
    } else {
      return {
        hasZopa: false,
        zopaRange: [0, 0],
        outcome: 'NO_ZOPA: Walk away to BATNA (Incompatible constraints)'
      };
    }
  }
}

const engine = new PrincipledNegotiationEngine();
const negotiation = engine.calculateZopa({
  partyAName: 'Frontend Platform Team',
  partyBName: 'Core API Team',
  partyABatnaMinHours: 40,
  partyABatnaMaxHours: 80,
  partyBBatnaMinHours: 60,
  partyBBatnaMaxHours: 100
});

console.log('=== PRINCIPLED NEGOTIATION & BATNA/ZOPA DYNAMICS ===');
console.log('Parties: Frontend Platform Team vs Core API Team');
console.log('ZOPA Assessment: ' + (negotiation.hasZopa ? 'FEASIBLE' : 'INFEASIBLE'));
console.log('Negotiation Outcome: ' + negotiation.outcome);
console.log('Diplomatic Invariant: Focus on underlying business interests, not rigid entrenched positions');`,
        output: `=== PRINCIPLED NEGOTIATION & BATNA/ZOPA DYNAMICS ===\nParties: Frontend Platform Team vs Core API Team\nZOPA Assessment: FEASIBLE\nNegotiation Outcome: AGREEMENT_REACHED: Mutual ZOPA identified between 60h and 80h\nDiplomatic Invariant: Focus on underlying business interests, not rigid entrenched positions`,
        tryIt: 'Change partyABatnaMaxHours to 50 so that overlapMax (50) is less than overlapMin (60), and observe the negotiation walk away to BATNA.',
        check: {
          question: 'What is the role of BATNA (Best Alternative To a Negotiated Agreement) in engineering negotiations?',
          options: [
            'It establishes your objective walk-away baseline, preventing you from accepting destructive or unfeasible commitments',
            'It is a legal contract filed with the government before software releases',
            'It forces the other party to surrender immediately'
          ],
          answer: 0,
          why: 'Knowing your BATNA ensures you never accept an agreement worse than your best alternative, providing quiet confidence and objective boundary discipline.'
        }
      },
      {
        title: 'Quantitative Technical Roadmap Prioritization (RICE & Opportunity Solution Trees)',
        say: [
          'Every engineering organization suffers from an infinite backlog of desirable projects competing for strictly finite developer bandwidth: paying down database technical debt, building revenue-generating features, upgrading framework versions, or improving CI build times. Saying "no" arbitrarily based on gut feeling provokes resentment and executive distrust.',
          'The RICE prioritization framework provides a quantitative, transparent scoring methodology: (Reach * Impact * Confidence) / Effort. Reach measures how many engineers or customers the project affects per quarter. Impact quantifies the magnitude of improvement (from 0.5 for minor polish to 3.0 for transformative game-changers). Confidence (0.5 to 1.0) discounts projects with speculative evidence, and Effort accounts for person-months required.',
          'Complementing RICE is Teresa Torres Opportunity Solution Tree. Rather than jumping directly from high-level company goals to pet solution features, the tree links clear business outcomes to verified customer problems (opportunities), which branch into multiple lightweight solution experiments. This structure ensures engineering bandwidth is strictly allocated to high-leverage initiatives with proven ROI.'
        ],
        example: 'Like packing an expedition backpack for high-altitude climbing: every item has weight (effort) and survival value (reach and impact); you cannot pack everything, so you pack only the items with the highest caloric and safety return per ounce.',
        code: `// Quantitative Roadmap Prioritization (RICE) Simulator
interface RoadmapInitiative {
  id: string;
  name: string;
  reach: number;      // Users/events affected per quarter
  impact: number;     // 3 = massive, 2 = high, 1 = medium, 0.5 = low
  confidence: number; // 1.0 = high, 0.8 = medium, 0.5 = low
  effort: number;     // Person-months
}

class RicePrioritizationMatrix {
  rankInitiatives(items: RoadmapInitiative[]): Array<RoadmapInitiative & { riceScore: number }> {
    return items
      .map(item => ({
        ...item,
        riceScore: Math.round((item.reach * item.impact * item.confidence) / item.effort)
      }))
      .sort((a, b) => b.riceScore - a.riceScore);
  }
}

const matrix = new RicePrioritizationMatrix();
const initiatives: RoadmapInitiative[] = [
  { id: 'INIT-1', name: 'GraphQL Gateway Migration', reach: 50000, impact: 2, confidence: 0.8, effort: 4 },
  { id: 'INIT-2', name: 'Dark Mode UI Reskin', reach: 20000, impact: 0.5, confidence: 0.9, effort: 2 },
  { id: 'INIT-3', name: 'Automated CI Flaky Test Pruner', reach: 300, impact: 3, confidence: 1.0, effort: 0.5 }
];

const ranked = matrix.rankInitiatives(initiatives);

console.log('=== QUANTITATIVE ROADMAP PRIORITIZATION (RICE) ===');
console.log('Rank 1: ' + ranked[0].name + ' -> RICE Score: ' + ranked[0].riceScore);
console.log('Rank 2: ' + ranked[1].name + ' -> RICE Score: ' + ranked[1].riceScore);
console.log('Rank 3: ' + ranked[2].name + ' -> RICE Score: ' + ranked[2].riceScore);
console.log('Leadership Principle: Say no with transparent mathematical scoring rather than opinion battles');`,
        output: `=== QUANTITATIVE ROADMAP PRIORITIZATION (RICE) ===\nRank 1: GraphQL Gateway Migration -> RICE Score: 20000\nRank 2: Dark Mode UI Reskin -> RICE Score: 4500\nRank 3: Automated CI Flaky Test Pruner -> RICE Score: 1800\nLeadership Principle: Say no with transparent mathematical scoring rather than opinion battles`,
        tryIt: 'Adjust the effort of GraphQL Gateway Migration to 12 months and observe how automated CI tooling leapfrogs in relative priority.',
        check: {
          question: 'Why does the RICE framework divide the product of Reach, Impact, and Confidence by Effort?',
          options: [
            'To normalize return on investment, prioritizing high-impact initiatives that require minimal engineering expenditure',
            'To calculate the server hosting bill for AWS',
            'To guarantee that every engineer receives an annual promotion'
          ],
          answer: 0,
          why: 'Dividing by effort establishes capital efficiency: a project delivering moderate impact in one week often creates more cumulative value than a massive project that ties up the entire team for a year.'
        }
      },
      {
        title: 'Coaching Underperformance & Constructive PIP Architecture',
        say: [
          'Addressing underperformance is one of the most challenging responsibilities of engineering leadership. When an engineer repeatedly misses delivery commitments or produces substandard pull requests, poor managers either ignore the problem until resentment boils over or abruptly launch punitive termination procedures.',
          'High-integrity engineering leadership begins with rigorous diagnosis: is the performance deficit driven by a Skill gap (lack of domain familiarity or architecture patterns), a Will/Motivation gap (burnout, personal crises, misalignment with team mission), or an Environmental blocker (flaky CI test suites, toxic team politics, ambiguous requirements)?',
          'If a formal Performance Improvement Plan (PIP) is necessary, it must be architected as a constructive rehabilitation blueprint rather than a bureaucratic firing mechanism. A constructive PIP defines unambiguous success criteria, provides dedicated mentoring partnerships, establishes weekly milestone reviews, and removes external environmental friction, giving the engineer a genuine, supported path back to excellence.'
        ],
        example: 'Like an athletic coach diagnosing a pitcher struggling with control: determining whether the issue is mechanics (skill), exhaustion (burnout), or bad mound dirt (environmental blockers), and structuring a 30-day targeted bullpen routine with daily film review.',
        code: `// Underperformance Diagnosis & Constructive PIP Simulator
interface PerformanceEvaluation {
  engineer: string;
  skillGapScore: number;     // 1-5 (5 = high gap)
  motivationScore: number;   // 1-5 (5 = high motivation)
  toolingBlockers: boolean;
}

class PerformanceDiagnosticEngine {
  diagnoseAndPlan(evaluation: PerformanceEvaluation): { diagnosis: string; planAction: string } {
    if (evaluation.toolingBlockers) {
      return {
        diagnosis: 'ENVIRONMENTAL_BLOCKER',
        planAction: 'Unblock developer environment and remove CI/CD friction before evaluating individual output'
      };
    }
    if (evaluation.skillGapScore >= 4 && evaluation.motivationScore >= 4) {
      return {
        diagnosis: 'COACHABLE_SKILL_GAP',
        planAction: 'Pair with Staff Engineer mentor on bounded 30-day architecture deliverables'
      };
    }
    return {
      diagnosis: 'STRUCTURED_REHABILITATION_PIP',
      planAction: 'Implement formal 60-day PIP with weekly measurable milestones and explicit success criteria'
    };
  }
}

const diagnostic = new PerformanceDiagnosticEngine();
const result = diagnostic.diagnoseAndPlan({
  engineer: 'Alex (Senior Engineer)',
  skillGapScore: 4,
  motivationScore: 5,
  toolingBlockers: false
});

console.log('=== UNDERPERFORMANCE DIAGNOSIS & CONSTRUCTIVE PIP ===');
console.log('Target Evaluation: Alex (Senior Engineer)');
console.log('Primary Diagnosis: ' + result.diagnosis);
console.log('Actionable Pathway: ' + result.planAction);
console.log('Management Invariant: Empathy and clarity precede corrective action');`,
        output: `=== UNDERPERFORMANCE DIAGNOSIS & CONSTRUCTIVE PIP ===\nTarget Evaluation: Alex (Senior Engineer)\nPrimary Diagnosis: COACHABLE_SKILL_GAP\nActionable Pathway: Pair with Staff Engineer mentor on bounded 30-day architecture deliverables\nManagement Invariant: Empathy and clarity precede corrective action`,
        tryIt: 'Set toolingBlockers to true and verify that the engine immediately targets environment unblocking before individual critique.',
        check: {
          question: 'What is the first step an engineering leader must take before initiating formal disciplinary action for underperformance?',
          options: [
            'Diagnose root causes to distinguish between coachable skill gaps, motivation challenges, and environmental tooling blockers',
            'Immediately lock the developer GitHub account and cancel badge access',
            'Complain about the developer to other team members during standup'
          ],
          answer: 0,
          why: 'Leaders must first rule out environmental blockers and determine whether the issue is coachable before proceeding to formal administrative processes.'
        }
      },
      {
        title: 'Staff+ Engineering Archetypes & Organizational Leverage',
        say: [
          'Advancing beyond Senior Engineer (to Staff, Principal, and Distinguished levels) does not mean simply typing code twice as fast. Staff+ engineering is characterized by organizational leverage: multiplying the output, velocity, and architectural coherence of dozens of engineers across multiple teams.',
          'In The Staff Engineer Path, Will Larson identifies four primary archetypes of Staff+ leadership: The Tech Lead (partnering closely with Engineering Managers to guide execution and technical hygiene for a critical team), The Architect (owning cross-organization system boundaries, data contracts, and multi-year architectural roadmaps), The Solver (deep-system specialists parachuting into existential performance bottlenecks, migrations, and outages), and The Right Hand (acting as an executive proxy to execute complex cross-department initiatives).',
          'Succeeding in a Staff+ role requires exercising influence without authority. Because Staff+ engineers rarely manage people directly, their impact depends on building high-trust relationships, authoring compelling RFCs that align divergent viewpoints, and mentoring rising seniors to scale technical excellence throughout the organization.'
        ],
        example: 'Like specialized officers aboard an exploration vessel: the Navigator charting deep waters (Architect), the First Mate steering daily operations (Tech Lead), the Emergency Diver handling hull breaches (Solver), and the Diplomatic Emissary negotiating port treaties (Right Hand).',
        code: `// Staff+ Engineering Archetypes & Org Leverage Simulator
type StaffArchetype = 'TECH_LEAD' | 'ARCHITECT' | 'SOLVER' | 'RIGHT_HAND';

interface StaffProfile {
  archetype: StaffArchetype;
  scopeTeams: number;
  executiveSponsorship: boolean;
}

class StaffImpactCalculator {
  calculateLeverage(profile: StaffProfile): { leverageTier: string; primaryFocus: string } {
    switch (profile.archetype) {
      case 'ARCHITECT':
        return { leverageTier: 'CROSS-ORG MULTIPLIER', primaryFocus: 'Setting multi-year technical vision and API boundary governance' };
      case 'SOLVER':
        return { leverageTier: 'DEEP-SYSTEM SPECIALIST', primaryFocus: 'Parachuting into existential performance bottlenecks and critical outages' };
      case 'TECH_LEAD':
        return { leverageTier: 'TEAM FORCE-MULTIPLIER', primaryFocus: 'Execution velocity, code quality, and junior-to-senior mentorship' };
      case 'RIGHT_HAND':
        return { leverageTier: 'EXECUTIVE PROXY', primaryFocus: 'Driving strategic C-level initiatives across business and engineering units' };
    }
  }
}

const calc = new StaffImpactCalculator();
const profile: StaffProfile = { archetype: 'ARCHITECT', scopeTeams: 8, executiveSponsorship: true };
const impact = calc.calculateLeverage(profile);

console.log('=== STAFF+ ENGINEERING ARCHETYPES & ORG LEVERAGE ===');
console.log('Archetype: ' + profile.archetype);
console.log('Influence Tier: ' + impact.leverageTier);
console.log('Core Mission: ' + impact.primaryFocus);
console.log('Leadership Invariant: Influence is earned through trust and clarity, not managerial hierarchy');`,
        output: `=== STAFF+ ENGINEERING ARCHETYPES & ORG LEVERAGE ===\nArchetype: ARCHITECT\nInfluence Tier: CROSS-ORG MULTIPLIER\nCore Mission: Setting multi-year technical vision and API boundary governance\nLeadership Invariant: Influence is earned through trust and clarity, not managerial hierarchy`,
        tryIt: 'Change the archetype to SOLVER and observe how the primary focus adapts to deep firefighting and bottleneck resolution.',
        check: {
          question: 'How do Staff+ engineers primarily achieve organizational impact without formal managerial authority?',
          options: [
            'By authoring clear RFCs, building cross-functional trust, mentoring rising seniors, and aligning architectural standards across teams',
            'By threatening to delete production repositories',
            'By refusing to participate in team meetings'
          ],
          answer: 0,
          why: 'Staff+ impact is built on technical credibility, transparent architectural rationale, and elevating others rather than top-down executive command.'
        }
      },
      {
        title: 'Crisis Management & Blameless Postmortem Facilitation',
        say: [
          'When a tier-1 production outage strikes, adrenaline surges, Slack channels erupt with panic, and executives demand instant timelines. In these high-stakes moments, effective incident leadership is the difference between swift recovery and catastrophic prolonged downtime.',
          'During an active incident, the Incident Commander (IC) establishes command-and-control discipline: appointing a Communications Lead to keep stakeholders informed, silencing speculative channel noise, and focusing on immediate customer mitigation rather than identifying the root cause during the fire.',
          'Once service is restored, facilitating a blameless postmortem is mandatory. Rooted in safety science and resilience engineering (such as Sydney Dekker Field Guide to Understanding Human Error), blameless postmortems operate on the premise that human engineers always act with good intent based on the information available to them. Blaming individuals encourages concealment of mistakes; analyzing systemic vulnerabilities (missing circuit breakers, inadequate canary gates, unclear runbooks) creates a resilient, antifragile engineering culture.'
        ],
        example: 'Like an aviation NTSB investigation following an aircraft emergency: the cockpit voice recorder is analyzed not to punish the pilot, but to redesign cockpit alert switches and training checklists so no future pilot can make that error.',
        code: `// Crisis Management & Blameless Postmortem Simulator
interface IncidentReport {
  incidentId: string;
  durationMinutes: number;
  rootCauseCategory: 'RESILIENCE_DEFICIT' | 'HUMAN_ERROR' | 'VENDOR_OUTAGE';
  fiveWhysSummary: string[];
}

class BlamelessPostmortemFacilitator {
  generateActionPlan(report: IncidentReport): { status: string; correctiveActions: string[] } {
    return {
      status: 'BLAMELESS_RETROSPECTIVE_CONCLUDED',
      correctiveActions: [
        'Add circuit breaker pattern to prevent cascading API timeouts (Resilience)',
        'Automate deployment canary rollback on error rate spikes (Safety Guardrail)',
        'Update runbook documentation and conduct disaster drill simulation (Training)'
      ]
    };
  }
}

const retro = new BlamelessPostmortemFacilitator();
const plan = retro.generateActionPlan({
  incidentId: 'INC-2026-0912',
  durationMinutes: 42,
  rootCauseCategory: 'RESILIENCE_DEFICIT',
  fiveWhysSummary: [
    'Database connection pool exhausted',
    'Long-running report held open connections',
    'No query timeout configured on analytics route',
    'Analytics route lacked separate read replica pool',
    'Architecture review did not mandate query isolation for reports'
  ]
});

console.log('=== CRISIS MANAGEMENT & BLAMELESS POSTMORTEM ===');
console.log('Incident Facilitation Status: ' + plan.status);
console.log('Action Item 1: ' + plan.correctiveActions[0]);
console.log('Action Item 2: ' + plan.correctiveActions[1]);
console.log('Cultural Invariant: Blamelessness builds psychological safety; fix systemic flaws, never punish humans');`,
        output: `=== CRISIS MANAGEMENT & BLAMELESS POSTMORTEM ===\nIncident Facilitation Status: BLAMELESS_RETROSPECTIVE_CONCLUDED\nAction Item 1: Add circuit breaker pattern to prevent cascading API timeouts (Resilience)\nAction Item 2: Automate deployment canary rollback on error rate spikes (Safety Guardrail)\nCultural Invariant: Blamelessness builds psychological safety; fix systemic flaws, never punish humans`,
        tryIt: 'Examine the fiveWhysSummary sequence and see how root cause analysis moves from surface symptoms to organizational architecture guidelines.',
        check: {
          question: 'Why do high-reliability engineering organizations strictly mandate blameless postmortems after major incidents?',
          options: [
            'Because blaming individuals breeds fear and concealment, whereas blameless reviews uncover the systemic and architectural weaknesses that allowed the failure to occur',
            'Because insurance companies require all engineers to sign an apology letter',
            'To avoid spending money on automated rollback tools'
          ],
          answer: 0,
          why: 'When engineers feel psychologically safe, they speak openly about confusing interfaces and hidden risks, allowing teams to harden systems against future failures.'
        }
      }
    ],
    summary: [
      'Principled negotiation applies Fisher-Ury principles to identify ZOPA overlap and preserve BATNA walk-away boundaries.',
      'Quantitative RICE matrix prioritization scores initiatives objectively, normalizing impact against developer effort.',
      'Coaching underperformance distinguishes between coachable skill deficits, burnout, and environmental tooling blockers.',
      'Staff+ engineering archetypes (Tech Lead, Architect, Solver, Right Hand) achieve cross-organizational leverage without managerial authority.',
      'Blameless postmortem facilitation uses 5-Whys root cause analysis to eliminate systemic defects and build psychological safety.'
    ],
    projectStep: {
      title: 'Architect an Engineering Leadership & Organizational Influence Playbook',
      steps: [
        'Model a Principled Negotiation ZOPA calculator evaluating delivery trade-offs between competing platform teams.',
        'Build a RICE prioritization spreadsheet ranking technical debt initiatives against user-facing product features.',
        'Author a structured 60-day performance coaching blueprint with measurable weekly milestones and mentor pairing.',
        'Define a personal Staff+ engineering career portfolio aligning with the Architect or Solver leadership archetype.',
        'Facilitate a blameless postmortem retrospective documenting systemic action items following a simulated tier-1 outage.'
      ]
    }
  },
  {
    day: 5,
    title: 'Executive Storytelling, C-Suite Alignment, Crisis Communications & Cross-Functional Influence',
    goal: 'Master high-stakes leadership disciplines: Barbara Minto SCQA executive storytelling, Mendelow power-interest stakeholder influence without authority, DORA metrics translation to financial EBITDA, transparent incident crisis communications, and structuring bulletproof Staff+ promotion packets.',
    minutes: 30,
    recap: 'Today we transition from team-level engineering leadership into organizational diplomacy, executive storytelling, cross-functional coalition building, and enterprise crisis management.',
    parts: [
      {
        title: 'Executive Storytelling & The Barbara Minto SCQA Framework',
        say: [
          'Engineers are naturally trained in inductive reasoning: start with the raw data, outline the chronological debugging journey, detail every technical edge case, and arrive at the conclusion in the final paragraph. When communicating with the C-suite (CTO, CEO, CFO), this inductive approach fails catastrophically.',
          'Executives are cognitive triage engines managing dozens of competing crises simultaneously. They operate on deductive reasoning and Bottom-Line Up Front (BLUF). If an engineering proposal takes 15 minutes to reach the recommendation, executive attention is already lost.',
          'The Barbara Minto SCQA framework (Situation, Complication, Question, Answer) structures strategic communications into an undeniable narrative arc: Situation establishes an uncontroversial shared baseline; Complication introduces the catalyst or escalating business risk; Question frames the singular strategic choice; and Answer provides the decisive recommendation quantified in financial or customer impact.',
          'By leading with the Answer and backing it with quantified Return on Investment (ROI), Staff+ engineers earn immediate credibility and secure cross-functional budget approvals.'
        ],
        example: 'Think of an emergency room trauma surgeon briefing the hospital chief of medicine. The surgeon does not narrate the patient\'s entire morning breakfast and commute; they say: "The patient has internal thoracic bleeding (Situation). Vitals dropped 30% in the last 10 minutes (Complication). Can we open OR Suite 3 immediately? (Question). Operating now will stabilize oxygenation and prevent cardiac arrest with a 95% survival rate (Answer)."',
        code: `// SCQA Executive Storytelling & Proposal Validator
interface ScqaBriefing {
  situation: string;
  complication: string;
  question: string;
  answer: string;
  projectedRoiMillion: number;
}

class ExecutiveStorytellingValidator {
  validate(brief: ScqaBriefing) {
    const hasS = brief.situation.length > 20;
    const hasC = brief.complication.length > 20;
    const hasQ = brief.question.endsWith('?');
    const hasA = brief.answer.length > 25;
    const isBottomLineUpFront = brief.answer.includes('$') || brief.answer.includes('%') || brief.answer.includes('ROI');

    return {
      structureValid: hasS && hasC && hasQ && hasA,
      executiveReadinessScore: (hasS ? 25 : 0) + (hasC ? 25 : 0) + (hasQ ? 25 : 0) + (isBottomLineUpFront ? 25 : 0),
      summary: \`SCQA Synthesis: S(\${hasS}) C(\${hasC}) Q(\${hasQ}) BLUF(\${isBottomLineUpFront})\`
    };
  }
}

const validator = new ExecutiveStorytellingValidator();
const brief: ScqaBriefing = {
  situation: 'Our global e-commerce checkout platform currently processes $1.2B annually across 12 countries.',
  complication: 'Legacy payment microservices incur an 850ms latency penalty, causing an 8.4% cart abandonment spike at peak load.',
  question: 'Should we allocate $450k in Q3 to migrate payment ingestion to edge-native event-driven pipelines?',
  answer: 'Yes. Migrating to edge event streaming will reduce latency to 120ms, preventing $14.2M in annual abandoned transactions with an estimated 31.5x ROI.',
  projectedRoiMillion: 14.2
};

const vRes = validator.validate(brief);
console.log('Executive Briefing Status: ' + (vRes.structureValid ? 'VERIFIED_SCQA_STRUCTURE' : 'DEFICIENT'));
console.log('Executive Readiness Score: ' + vRes.executiveReadinessScore + '/100');
console.log('Bottom-Line Upfront ROI: $' + brief.projectedRoiMillion + 'M Annualized Impact');`,
        output: `Executive Briefing Status: VERIFIED_SCQA_STRUCTURE\nExecutive Readiness Score: 100/100\nBottom-Line Upfront ROI: $14.2M Annualized Impact`,
        codeNotes: [
          { line: 8, note: 'Models SCQA narrative completeness checking all 4 structural pillars' },
          { line: 14, note: 'Awards top-tier executive readiness score only when quantifiable financial ROI is established' },
          { line: 29, note: 'Demonstrates bottom-line upfront (BLUF) presentation translating technical latency into $14.2M business revenue' }
        ],
        tryIt: 'Change the projected ROI to 0 or remove the question mark to see how executive readiness degrades.',
        check: {
          question: 'Why do C-suite executives require technical proposals to follow the SCQA framework rather than chronological engineering summaries?',
          options: [
            'Executives need deductive reasoning that establishes immediate business context, risk urgency, and bottom-line financial ROI before delving into implementation details',
            'Executives do not understand what code repositories or databases are',
            'The SCQA framework automatically compiles TypeScript into machine code',
            'It reduces the total number of PowerPoint slides to exactly zero'
          ],
          answer: 0,
          why: 'Executives manage scarce capital and time. Deductive SCQA communication provides immediate clarity on what is broken, what decision is required, and what the financial and customer return will be, eliminating cognitive ambiguity.'
        }
      },
      {
        title: 'Cross-Functional Influence Without Authority & Mendelow\'s Stakeholder Matrix',
        say: [
          'In matrixed technology organizations, Staff+ engineers rarely have direct managerial reports. Yet they are accountable for driving foundational architectural initiatives that span dozens of teams, such as database sharding, zero-trust security rollouts, or deprecating legacy monoliths.',
          'Achieving cross-functional alignment without formal authority requires mastering Stakeholder Mapping using Mendelow\'s Power-Interest Matrix. Stakeholders are mapped along two orthogonal axes: Power (their organizational ability to approve, block, or fund the initiative) and Interest (how directly the initiative impacts their daily metrics or workflow).',
          'The four quadrants demand distinct engagement strategies: High Power / High Interest stakeholders (such as the VP of Product) must be Managed Closely with collaborative design reviews. High Power / Low Interest stakeholders (such as the CFO) must be Kept Satisfied by translating technical architecture into financial EBITDA margins and risk mitigation.',
          'Low Power / High Interest stakeholders (such as junior developers using an SDK) must be Kept Informed through demo days and documentation, while Low Power / Low Interest stakeholders are Monitored with passive updates.'
        ],
        example: 'Like building a high-speed commuter rail line through a metropolis. You don\'t just ask train conductors for permission; you align with the City Council (High Power) on economic growth, negotiate with neighborhood associations (High Interest) on noise barriers, and provide transit riders (Users) with clear route maps.',
        code: `// Mendelow Power-Interest Stakeholder Matrix Evaluator
interface Stakeholder {
  name: string;
  role: string;
  power: 'HIGH' | 'LOW';
  interest: 'HIGH' | 'LOW';
  strategicConcern: string;
}

class StakeholderEngagementMatrix {
  categorize(stakeholder: Stakeholder): { category: string; communicationStrategy: string } {
    if (stakeholder.power === 'HIGH' && stakeholder.interest === 'HIGH') {
      return {
        category: 'MANAGE_CLOSELY',
        communicationStrategy: 'Weekly 1:1 briefings; co-design architectural milestones and governance gates'
      };
    } else if (stakeholder.power === 'HIGH' && stakeholder.interest === 'LOW') {
      return {
        category: 'KEEP_SATISFIED',
        communicationStrategy: 'Monthly executive summary dashboards; translate tech debt into EBITDA risk metrics'
      };
    } else if (stakeholder.power === 'LOW' && stakeholder.interest === 'HIGH') {
      return {
        category: 'KEEP_INFORMED',
        communicationStrategy: 'Bi-weekly demo days and sprint release notes; solicit feedback on developer ergonomics'
      };
    } else {
      return {
        category: 'MONITOR',
        communicationStrategy: 'Passive async documentation; status page updates and quarterly roadmaps'
      };
    }
  }
}

const matrix = new StakeholderEngagementMatrix();
const cfoStrategy = matrix.categorize({
  name: 'Evelyn Vance',
  role: 'Chief Financial Officer',
  power: 'HIGH',
  interest: 'LOW',
  strategicConcern: 'Gross cloud margins and infrastructure spend'
});

const prodVpStrategy = matrix.categorize({
  name: 'Marcus Zhang',
  role: 'VP of Product',
  power: 'HIGH',
  interest: 'HIGH',
  strategicConcern: 'Feature delivery velocity and customer retention'
});

console.log('CFO Engagement Category: ' + cfoStrategy.category);
console.log('CFO Comms Strategy: ' + cfoStrategy.communicationStrategy);
console.log('VP Product Category: ' + prodVpStrategy.category);
console.log('Leadership Principle: Influence without authority requires framing tech initiatives in stakeholder currency');`,
        output: `CFO Engagement Category: KEEP_SATISFIED\nCFO Comms Strategy: Monthly executive summary dashboards; translate tech debt into EBITDA risk metrics\nVP Product Category: MANAGE_CLOSELY\nLeadership Principle: Influence without authority requires framing tech initiatives in stakeholder currency`,
        codeNotes: [
          { line: 8, note: 'Implements Mendelow Power-Interest quadrant classification algorithm' },
          { line: 14, note: 'Tailors communication strategy to executive stakeholders with high power but low technical interest' },
          { line: 28, note: 'Demonstrates translating engineering initiatives into the specific business currency of each leader' }
        ],
        tryIt: 'Switch the CFO interest to HIGH and observe how the governance strategy shifts from periodic status reporting to proactive co-design.',
        check: {
          question: 'How should a Staff Engineer communicate a major technical debt refactoring to a High-Power / Low-Interest CFO?',
          options: [
            'By presenting concise financial metrics translating reduced infrastructure spend and reduced downtime risk directly into gross margin and EBITDA improvements',
            'By sending the CFO 200 pages of Git commit diffs and unit test logs',
            'By ignoring the CFO because financial leaders should not influence code architecture',
            'By asking the CFO to learn Kubernetes command-line tools'
          ],
          answer: 0,
          why: 'High-power, low-interest stakeholders do not want technical jargon; they want to understand how the engineering initiative protects financial margins, mitigates compliance liability, or saves capital expenditure.'
        }
      },
      {
        title: 'DORA Metrics & Translating Engineering Velocity to C-Suite Business Value',
        say: [
          'Engineering teams often track micro-metrics: story points burned, lines of code written, or pull request comments. To business executives and board members, these metrics are completely meaningless and frequently incentivize counter-productive behavior like bloated PRs and superficial commits.',
          'The DevOps Research and Assessment (DORA) framework provides the industry gold standard for measuring software delivery performance across four core metrics: Deployment Frequency (throughput), Lead Time for Changes (velocity), Change Failure Rate (quality), and Mean Time to Restore (stability).',
          'Elite engineering organizations deploy multiple times per day with lead times under one hour, change failure rates below 5%, and MTTR under one hour. Crucially, high performers disprove the classic misconception that moving fast creates instability: elite teams achieve BOTH higher velocity AND higher stability simultaneously.',
          'When presenting to executive leadership, Staff+ engineers translate DORA improvements directly into economic business value: reducing Change Failure Rate saves millions in outage SLA penalties, while shrinking Lead Time accelerates time-to-market and customer feedback loops.'
        ],
        example: 'Think of a Formula 1 pit stop crew. An amateur pit crew takes 12 seconds and risks loose lug nuts (high lead time, high change failure rate). A championship pit crew completes a tire change in 1.8 seconds with 99.99% perfection because standardized tooling, telemetry, and automated coordination eliminate waste.',
        code: `// DORA Metrics to Business Value Calculator
interface DoraSnapshot {
  deploymentFrequencyPerDay: number;
  leadTimeHours: number;
  changeFailureRatePercent: number;
  mttrMinutes: number;
}

class DoraBusinessValueEngine {
  evaluatePerformance(dora: DoraSnapshot) {
    const isElite = dora.deploymentFrequencyPerDay >= 1 && dora.leadTimeHours <= 24 && dora.changeFailureRatePercent <= 5 && dora.mttrMinutes <= 60;
    const downtimeCostPerOutage = 45000; // $45k average cost per production incident
    const annualOutages = Math.round((dora.deploymentFrequencyPerDay * 365 * dora.changeFailureRatePercent) / 100);
    const totalDowntimeCost = annualOutages * downtimeCostPerOutage;

    return {
      tier: isElite ? 'ELITE_PERFORMER' : 'STANDARD_PERFORMER',
      annualOutages,
      annualDowntimeCost: totalDowntimeCost,
      timeToMarketVelocity: dora.leadTimeHours <= 24 ? 'RAPID_MARKET_FEEDBACK' : 'BATCHED_QUARTERLY_DELAYS'
    };
  }
}

const engine = new DoraBusinessValueEngine();
const eliteMetrics = engine.evaluatePerformance({
  deploymentFrequencyPerDay: 4.5,
  leadTimeHours: 2.5,
  changeFailureRatePercent: 2.1,
  mttrMinutes: 28
});

console.log('DORA Performance Tier: ' + eliteMetrics.tier);
console.log('Calculated Annual Incidents: ' + eliteMetrics.annualOutages + ' Incidents');
console.log('Projected Outage Cost Exposure: $' + (eliteMetrics.annualDowntimeCost / 1000).toFixed(0) + 'k/year');
console.log('Executive Translation: Elite DORA practices decouple deployment frequency from production instability');`,
        output: `DORA Performance Tier: ELITE_PERFORMER\nCalculated Annual Incidents: 34 Incidents\nProjected Outage Cost Exposure: $1530k/year\nExecutive Translation: Elite DORA practices decouple deployment frequency from production instability`,
        codeNotes: [
          { line: 8, note: 'Evaluates DORA benchmark criteria across throughput, velocity, stability, and recovery time' },
          { line: 12, note: 'Calculates quantifiable enterprise financial exposure based on change failure rates and outage cost' },
          { line: 25, note: 'Demonstrates that elite engineering capabilities yield millions in prevented downtime liabilities' }
        ],
        tryIt: 'Increase changeFailureRatePercent to 25% and observe how annual incident count and cost exposure skyrocket.',
        check: {
          question: 'What fundamental truth about modern software engineering did the DORA research empirically prove?',
          options: [
            'High-performing engineering organizations achieve both rapid delivery velocity and superior production stability simultaneously through automation, small batch sizes, and comprehensive telemetry',
            'Shipping software faster always results in higher production defect rates',
            'Lines of code written per day is the single best metric of engineering productivity',
            'Manual quality assurance testing is faster and more reliable than automated CI/CD pipelines'
          ],
          answer: 0,
          why: 'DORA demonstrated that speed and stability are complementary, not antagonistic: automated testing, continuous integration, and trunk-based development allow teams to ship small batches rapidly with minimal risk.'
        }
      },
      {
        title: 'High-Stakes Crisis Incident Communications & Public Status Broadcasting',
        say: [
          'When a Tier-1 production incident strikes—such as an authentication outage or database corruption—technical troubleshooting is only half the battle. How the organization communicates with customers, executives, and the press determines whether customer trust is salvaged or permanently destroyed.',
          'High-reliability engineering cultures enforce strict role separation during a crisis: the Incident Commander (IC) directs technical mitigation, while a dedicated Communications Lead manages internal and external updates. This prevents engineers from being distracted by executive Slack pings or customer escalations.',
          'Public incident communications must follow the Four Golden Rules of Crisis Comms: 1) Strict update cadences (e.g. status updates every 20-30 minutes, even if there is no new technical diagnosis); 2) Quantified impact radius without speculation; 3) Active empathy acknowledging the operational disruption caused to users; and 4) Clear delineation of remediation actions underway.',
          'Never attempt to conceal an outage or blame external cloud providers in public bulletins. Transparent, accountable communication builds long-term institutional trust.'
        ],
        example: 'Like an air traffic controller handling an aircraft emergency. The flight crew focuses 100% on flying the plane, while the air traffic controller coordinates emergency runway access, alerts ground fire crews, and communicates clear updates to surrounding aircraft without distracting the pilots in the cockpit.',
        code: `// Crisis Communications Bulletin Dispatcher
interface OutageBroadcast {
  incidentId: string;
  severity: 'SEV-1' | 'SEV-2' | 'SEV-3';
  impactPercentage: number;
  cadenceMinutes: number;
  actionUnderway: string;
}

class CrisisCommunicationsDispatcher {
  generatePublicStatus(broadcast: OutageBroadcast) {
    return {
      statusHeader: \`[\${broadcast.severity} UPDATE] Service Disruption Investigated\`,
      cadenceSla: \`Next public status update in \${broadcast.cadenceMinutes} minutes guaranteed\`,
      customerImpact: \`\${broadcast.impactPercentage}% of payment API transactions experiencing latency degradation\`,
      mitigationAction: broadcast.actionUnderway,
      goldenRuleCompliance: 'EMPATHY_AND_ACCOUNTABILITY_MAINTAINED'
    };
  }
}

const crisisDispatcher = new CrisisCommunicationsDispatcher();
const comms = crisisDispatcher.generatePublicStatus({
  incidentId: 'INC-7091',
  severity: 'SEV-1',
  impactPercentage: 14.2,
  cadenceMinutes: 20,
  actionUnderway: 'Traffic diverted to secondary us-east-2 failover cluster; canary recovery active'
});

console.log('Crisis Bulletin: ' + comms.statusHeader);
console.log('Cadence SLA: ' + comms.cadenceSla);
console.log('Customer Impact Radius: ' + comms.customerImpact);
console.log('Remediation Step: ' + comms.mitigationAction);
console.log('Executive Comms Protocol: ' + comms.goldenRuleCompliance);`,
        output: `Crisis Bulletin: [SEV-1 UPDATE] Service Disruption Investigated\nCadence SLA: Next public status update in 20 minutes guaranteed\nCustomer Impact Radius: 14.2% of payment API transactions experiencing latency degradation\nRemediation Step: Traffic diverted to secondary us-east-2 failover cluster; canary recovery active\nExecutive Comms Protocol: EMPATHY_AND_ACCOUNTABILITY_MAINTAINED`,
        codeNotes: [
          { line: 8, note: 'Formats standardized public crisis bulletin with severity categorization' },
          { line: 10, note: 'Enforces strict update cadence SLA guaranteeing transparency every 20 minutes' },
          { line: 24, note: 'Validates transparent reporting of customer impact percentage and active failover steps' }
        ],
        tryIt: 'Change the cadence to 60 minutes and observe how customer anxiety increases when status intervals exceed 30 minutes.',
        check: {
          question: 'During a major customer-facing production outage, why must engineering teams commit to a strict 20-to-30 minute status update cadence even when no new root cause is discovered?',
          options: [
            'Because silence creates customer panic and distrust; predictable cadences reassure users that engineering is actively working and provide operational transparency',
            'Because cloud providers automatically reboot servers after 30 minutes of silence',
            'To prevent web browsers from caching outdated HTTP error pages',
            'Because status pages consume less bandwidth than regular websites'
          ],
          answer: 0,
          why: 'During an outage, silence is interpreted as negligence or confusion. Even a brief update stating "Investigation ongoing, testing database failover, next update in 20 minutes" maintains customer trust and reduces panic.'
        }
      },
      {
        title: 'The Staff+ Engineering Promotion Dossier: Quantifying Organizational Leverage',
        say: [
          'Reaching Senior Engineer (L5) is primarily about technical execution: you are given ambiguous problems and you deliver high-quality, reliable code on time. However, transitioning from Senior to Staff (L6) or Principal (L7) requires a fundamental mindset shift from individual execution to organizational leverage.',
          'Staff promotion calibration committees evaluate candidates against four non-negotiable pillars: Strategic Scope, Technical Architecture, Force Multiplier Effect, and Quantified Business Impact. Simply writing twice as much code will never get an engineer promoted to Staff.',
          'Strategic Scope measures your influence radius: while Senior engineers operate at the team level, Staff engineers operate across multiple teams and organizational boundaries, aligning disparate groups around unified technical standards and RFCs.',
          'The Force Multiplier Effect proves that you elevate everyone around you: mentoring engineers to promotion, setting engineering hiring bars, and eliminating systemic toil across dozens of services. A bulletproof promotion dossier documents these contributions with hard numbers and verifiable customer revenue impact.'
        ],
        example: 'Think of an architect who designs a metropolitan suspension bridge. They do not personally pour every bucket of concrete or weld every steel cable; their value lies in the blueprint mathematics, safety standards, and coordination of hundreds of construction teams to build a structure that stands for a century.',
        code: `// Staff+ Engineering Promotion Packet Evaluator
interface StaffPromotionPacket {
  candidateName: string;
  targetLevel: 'STAFF_L6' | 'PRINCIPAL_L7';
  scopeBreadth: 'TEAM' | 'MULTI_TEAM' | 'CROSS_ORG';
  technicalComplexityScore: number; // 1-100
  multiplierMentorshipCount: number;
  measurableRevenueImpactMillion: number;
}

class PromotionCommitteeEvaluator {
  evaluate(packet: StaffPromotionPacket) {
    const isCrossOrg = packet.scopeBreadth === 'CROSS_ORG';
    const isTechLeader = packet.technicalComplexityScore >= 85;
    const isMultiplier = packet.multiplierMentorshipCount >= 4;
    const hasBusinessImpact = packet.measurableRevenueImpactMillion >= 1.0;

    const consensusPassed = isCrossOrg && isTechLeader && isMultiplier && hasBusinessImpact;

    return {
      consensusVerdict: consensusPassed ? 'PROMOTION_APPROVED' : 'NEEDS_BROADER_ORGANIZATIONAL_SCOPE',
      scopeRating: packet.scopeBreadth,
      leverageMultiplier: packet.multiplierMentorshipCount + ' Engineers Mentored & Promoted',
      financialReturn: '$' + packet.measurableRevenueImpactMillion.toFixed(1) + 'M Validated ROI'
    };
  }
}

const evaluator = new PromotionCommitteeEvaluator();
const review = evaluator.evaluate({
  candidateName: 'Dr. Sarah Connor',
  targetLevel: 'STAFF_L6',
  scopeBreadth: 'CROSS_ORG',
  technicalComplexityScore: 92,
  multiplierMentorshipCount: 5,
  measurableRevenueImpactMillion: 3.4
});

console.log('Committee Verdict: ' + review.consensusVerdict);
console.log('Organizational Scope: ' + review.scopeRating);
console.log('Talent Multiplier: ' + review.leverageMultiplier);
console.log('Business Justification: ' + review.financialReturn);
console.log('Career Invariant: Staff+ engineering is calibrated on organizational leverage, not personal keyboard velocity');`,
        output: `Committee Verdict: PROMOTION_APPROVED\nOrganizational Scope: CROSS_ORG\nTalent Multiplier: 5 Engineers Mentored & Promoted\nBusiness Justification: $3.4M Validated ROI\nCareer Invariant: Staff+ engineering is calibrated on organizational leverage, not personal keyboard velocity`,
        codeNotes: [
          { line: 8, note: 'Evaluates Staff+ dossier across cross-organizational scope, talent multiplier, and financial impact' },
          { line: 14, note: 'Requires cross-org influence and verifiable mentorship multiplier for promotion consensus' },
          { line: 29, note: 'Demonstrates a quantified business case ($3.4M ROI) securing promotion committee approval' }
        ],
        tryIt: 'Change scopeBreadth to TEAM and observe how the committee rejects the packet due to lack of cross-organizational reach.',
        check: {
          question: 'What is the primary difference in evaluation criteria between a Senior Engineer (L5) and a Staff Engineer (L6) in engineering calibration committees?',
          options: [
            'Senior engineers are evaluated on personal execution and team delivery, whereas Staff engineers are evaluated on cross-organizational scope, talent mentorship multiplier, and business impact',
            'Staff engineers are required to work 80 hours a week instead of 40',
            'Staff engineers are prohibited from reading or reviewing pull requests',
            'Senior engineers only know how to write CSS while Staff engineers write C++'
          ],
          answer: 0,
          why: 'Staff+ roles are leadership roles that amplify the effectiveness of the entire engineering organization. Committees look for cross-team technical strategy, mentorship of other engineers, and systemic business impact.'
        }
      }
    ],
    summary: [
      'The Barbara Minto SCQA framework structures executive proposals into Situation, Complication, Question, and Answer with bottom-line upfront ROI.',
      'Mendelow\'s Power-Interest matrix guides cross-functional influence without authority, tailoring communications to stakeholder priorities.',
      'DORA metrics bridge engineering velocity and executive business value, proving that speed and production stability reinforce each other.',
      'Crisis communications require separating Incident Command from public communications, adhering to strict 20-30 minute update cadences.',
      'Staff+ promotion calibration evaluates organizational scope, talent multiplier leverage, and quantified business return rather than individual code output.'
    ],
    projectStep: {
      title: 'Architect an Executive Engineering Influence & High-Stakes Leadership Portfolio',
      steps: [
        'Author an SCQA executive briefing securing budget approval for a mission-critical platform migration.',
        'Construct a Mendelow Power-Interest stakeholder map aligning Product, Finance, and Security leadership.',
        'Compute enterprise DORA metrics translating lead time and change failure rate into annualized cost savings.',
        'Draft a multi-stage crisis communications plan with guaranteed status update cadences during a simulated Tier-1 outage.',
        'Assemble a comprehensive Staff+ promotion packet documenting cross-organizational scope, talent mentorship, and validated business ROI.'
      ]
    }
  }
];

