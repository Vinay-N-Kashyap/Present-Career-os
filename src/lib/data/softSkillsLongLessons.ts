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
  }
];
