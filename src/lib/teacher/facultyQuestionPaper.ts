/**
 * Faculty Question Paper Authoring & Bloom's Taxonomy Moderation Studio Engine
 * Statutory Compliance: UGC Outcome-Based Education (OBE) Framework,
 * AICTE Examination Reforms Policy & Bloom's Revised Taxonomy (Anderson & Krathwohl).
 *
 * Platform: PinIT Career OS - Teacher Portal & Faculty Governance
 * Zero-Collision Invariant: Pure Branch C administrative and faculty governance.
 */

import { createHash } from 'crypto';

export type CognitiveLevel =
  | 'L1_REMEMBER'
  | 'L2_UNDERSTAND'
  | 'L3_APPLY'
  | 'L4_ANALYZE'
  | 'L5_EVALUATE'
  | 'L6_CREATE';

export type CourseOutcomeCode = 'CO1' | 'CO2' | 'CO3' | 'CO4' | 'CO5';

export type PaperSet = 'SET_A' | 'SET_B' | 'SET_C';

export type ModerationStatus =
  | 'DRAFTED'
  | 'SUBMITTED_TO_DMC'
  | 'MODERATION_IN_PROGRESS'
  | 'APPROVED_FOR_COE'
  | 'REVISION_REQUESTED';

export interface QuestionItem {
  questionId: string;
  questionNumber: number;
  subQuestionPart?: string; // e.g. "a", "b", "c"
  text: string;
  marks: number;
  cognitiveLevel: CognitiveLevel;
  courseOutcome: CourseOutcomeCode;
  unitModuleNumber: number;
  rubricKeyOutline?: string; // Answer scheme outline
  moderatorComments?: string;
}

export interface CognitiveDistribution {
  lotsMarks: number; // L1 + L2 + L3
  hotsMarks: number; // L4 + L5 + L6
  totalMarks: number;
  lotsPercentage: number;
  hotsPercentage: number;
  levelBreakdown: Record<CognitiveLevel, number>;
  coBreakdown: Record<CourseOutcomeCode, number>;
  isBalanced: boolean; // AICTE guideline: HOTS >= 30% and LOTS <= 70%
  allCosCovered: boolean; // All CO1 to CO5 mapped with > 0 marks
}

export interface FacultyQuestionPaper {
  paperId: string;
  submissionToken: string; // QP-[DEPT]-[COURSE]-[HEX6]
  courseCode: string;
  courseTitle: string;
  department: string;
  facultySetterName: string;
  facultySetterEmpId: string;
  paperSet: PaperSet;
  targetTotalMarks: number; // Standard: 50 or 100 marks
  examDurationMinutes: number; // Standard: 180 min (3 hrs)
  questions: QuestionItem[];
  status: ModerationStatus;
  cognitiveDistribution: CognitiveDistribution;
  dmcRemarks?: string;
  dmcConvenorName?: string;
  dmcApprovedDate?: string;
  cryptographicSeal?: string; // SHA-256 seal
  lastUpdated: string;
}

/**
 * Generate unique encrypted submission token: QP-[DEPT]-[COURSE]-[HEX6]
 */
export function generateQuestionPaperToken(department: string, courseCode: string): string {
  const deptCode = department.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 4) || 'DEPT';
  const cleanCourse = courseCode.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 6);
  const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
  return `QP-${deptCode}-${cleanCourse}-${randomHex}`;
}

/**
 * Calculate cognitive taxonomy distribution and Course Outcome coverage
 * AICTE Examination Reform guideline:
 * - LOTS (Lower Order Thinking Skills): L1 Remember, L2 Understand, L3 Apply
 * - HOTS (Higher Order Thinking Skills): L4 Analyze, L5 Evaluate, L6 Create
 * - Target Balance: HOTS >= 30%
 */
export function calculateCognitiveDistribution(questions: QuestionItem[]): CognitiveDistribution {
  const levelBreakdown: Record<CognitiveLevel, number> = {
    L1_REMEMBER: 0,
    L2_UNDERSTAND: 0,
    L3_APPLY: 0,
    L4_ANALYZE: 0,
    L5_EVALUATE: 0,
    L6_CREATE: 0,
  };

  const coBreakdown: Record<CourseOutcomeCode, number> = {
    CO1: 0,
    CO2: 0,
    CO3: 0,
    CO4: 0,
    CO5: 0,
  };

  let totalMarks = 0;
  let lotsMarks = 0;
  let hotsMarks = 0;

  for (const q of questions) {
    totalMarks += q.marks;
    levelBreakdown[q.cognitiveLevel] = (levelBreakdown[q.cognitiveLevel] || 0) + q.marks;
    coBreakdown[q.courseOutcome] = (coBreakdown[q.courseOutcome] || 0) + q.marks;

    if (
      q.cognitiveLevel === 'L1_REMEMBER' ||
      q.cognitiveLevel === 'L2_UNDERSTAND' ||
      q.cognitiveLevel === 'L3_APPLY'
    ) {
      lotsMarks += q.marks;
    } else {
      hotsMarks += q.marks;
    }
  }

  const lotsPercentage = totalMarks > 0 ? Math.round((lotsMarks / totalMarks) * 100) : 0;
  const hotsPercentage = totalMarks > 0 ? Math.round((hotsMarks / totalMarks) * 100) : 0;

  const isBalanced = totalMarks > 0 && hotsPercentage >= 30 && lotsPercentage <= 70;
  const allCosCovered =
    coBreakdown.CO1 > 0 &&
    coBreakdown.CO2 > 0 &&
    coBreakdown.CO3 > 0 &&
    coBreakdown.CO4 > 0 &&
    coBreakdown.CO5 > 0;

  return {
    lotsMarks,
    hotsMarks,
    totalMarks,
    lotsPercentage,
    hotsPercentage,
    levelBreakdown,
    coBreakdown,
    isBalanced,
    allCosCovered,
  };
}

/**
 * Generate cryptographic SHA-256 seal for question paper submission & moderation
 */
export function generateQuestionPaperSeal(paper: Omit<FacultyQuestionPaper, 'cryptographicSeal'>): string {
  const canonicalPayload = [
    paper.paperId,
    paper.submissionToken,
    paper.courseCode,
    paper.department,
    paper.facultySetterEmpId,
    paper.paperSet,
    paper.targetTotalMarks,
    paper.questions.length,
    paper.cognitiveDistribution.totalMarks,
    paper.cognitiveDistribution.hotsPercentage,
    paper.status,
    paper.dmcConvenorName || 'NO_CONVENOR',
    paper.lastUpdated,
  ].join('|');

  return createHash('sha256').update(canonicalPayload).digest('hex');
}

/**
 * Initialize a new Faculty Question Paper
 */
export function createFacultyQuestionPaper(params: {
  courseCode: string;
  courseTitle: string;
  department: string;
  facultySetterName: string;
  facultySetterEmpId: string;
  paperSet?: PaperSet;
  targetTotalMarks?: number;
  examDurationMinutes?: number;
  questions?: QuestionItem[];
}): FacultyQuestionPaper {
  const questions = params.questions || [];
  const cognitiveDistribution = calculateCognitiveDistribution(questions);
  const now = new Date().toISOString();
  const submissionToken = generateQuestionPaperToken(params.department, params.courseCode);

  const basePaper: Omit<FacultyQuestionPaper, 'cryptographicSeal'> = {
    paperId: `QP-${Date.now().toString(36).toUpperCase()}`,
    submissionToken,
    courseCode: params.courseCode.toUpperCase(),
    courseTitle: params.courseTitle,
    department: params.department,
    facultySetterName: params.facultySetterName,
    facultySetterEmpId: params.facultySetterEmpId,
    paperSet: params.paperSet || 'SET_A',
    targetTotalMarks: params.targetTotalMarks || 100,
    examDurationMinutes: params.examDurationMinutes || 180,
    questions,
    status: 'DRAFTED',
    cognitiveDistribution,
    lastUpdated: now,
  };

  const cryptographicSeal = generateQuestionPaperSeal(basePaper);
  return { ...basePaper, cryptographicSeal };
}

/**
 * Add or update a question item in the paper
 */
export function addOrUpdateQuestionItem(
  paper: FacultyQuestionPaper,
  item: Omit<QuestionItem, 'questionId'> & { questionId?: string }
): FacultyQuestionPaper {
  const questionId = item.questionId || `Q-${Date.now().toString(36).toUpperCase()}`;
  const newItem: QuestionItem = { ...item, questionId };

  let updatedQuestions: QuestionItem[];
  if (item.questionId && paper.questions.some((q) => q.questionId === item.questionId)) {
    updatedQuestions = paper.questions.map((q) => (q.questionId === item.questionId ? newItem : q));
  } else {
    updatedQuestions = [...paper.questions, newItem];
  }

  // Sort questions by questionNumber
  updatedQuestions.sort((a, b) => a.questionNumber - b.questionNumber);

  const cognitiveDistribution = calculateCognitiveDistribution(updatedQuestions);
  const now = new Date().toISOString();

  const updated: Omit<FacultyQuestionPaper, 'cryptographicSeal'> = {
    ...paper,
    questions: updatedQuestions,
    cognitiveDistribution,
    lastUpdated: now,
  };

  const cryptographicSeal = generateQuestionPaperSeal(updated);
  return { ...updated, cryptographicSeal };
}

/**
 * Submit question paper to Departmental Moderation Committee (DMC)
 */
export function submitQuestionPaperToDmc(paper: FacultyQuestionPaper): FacultyQuestionPaper {
  if (paper.questions.length === 0) {
    throw new Error('Cannot submit empty question paper: At least 1 question is required.');
  }

  if (paper.cognitiveDistribution.totalMarks !== paper.targetTotalMarks) {
    throw new Error(
      `Mark mismatch: Question paper total marks (${paper.cognitiveDistribution.totalMarks}) must equal target total marks (${paper.targetTotalMarks}).`
    );
  }

  const now = new Date().toISOString();
  const updated: Omit<FacultyQuestionPaper, 'cryptographicSeal'> = {
    ...paper,
    status: 'SUBMITTED_TO_DMC',
    lastUpdated: now,
  };

  const cryptographicSeal = generateQuestionPaperSeal(updated);
  return { ...updated, cryptographicSeal };
}

/**
 * Review by Departmental Moderation Committee (DMC)
 */
export function reviewByDmc(
  paper: FacultyQuestionPaper,
  params: {
    decision: 'APPROVE' | 'REQUEST_REVISION';
    dmcConvenorName: string;
    remarks: string;
  }
): FacultyQuestionPaper {
  if (params.decision === 'APPROVE') {
    if (!paper.cognitiveDistribution.allCosCovered) {
      throw new Error('DMC Moderation Error: All 5 Course Outcomes (CO1..CO5) must be mapped with >0 marks before approval.');
    }
  }

  const now = new Date().toISOString();
  const nextStatus: ModerationStatus =
    params.decision === 'APPROVE' ? 'APPROVED_FOR_COE' : 'REVISION_REQUESTED';

  const updated: Omit<FacultyQuestionPaper, 'cryptographicSeal'> = {
    ...paper,
    status: nextStatus,
    dmcConvenorName: params.dmcConvenorName,
    dmcRemarks: params.remarks,
    dmcApprovedDate: params.decision === 'APPROVE' ? now : undefined,
    lastUpdated: now,
  };

  const cryptographicSeal = generateQuestionPaperSeal(updated);
  return { ...updated, cryptographicSeal };
}

/**
 * Export Faculty Question Paper Moderation Ledger as statutory CSV
 */
export function exportFacultyQuestionPapersCSV(papers: FacultyQuestionPaper[]): string {
  const headers = [
    'Paper ID',
    'Submission Token',
    'Course Code',
    'Course Title',
    'Department',
    'Faculty Setter',
    'Setter ID',
    'Set',
    'Target Marks',
    'Actual Marks',
    'HOTS %',
    'LOTS %',
    'OBE Balanced',
    'All COs Covered',
    'Status',
    'DMC Convenor',
    'Cryptographic Seal',
  ];

  const rows = papers.map((p) => [
    `"${p.paperId}"`,
    `"${p.submissionToken}"`,
    `"${p.courseCode}"`,
    `"${p.courseTitle.replace(/"/g, '""')}"`,
    `"${p.department.replace(/"/g, '""')}"`,
    `"${p.facultySetterName.replace(/"/g, '""')}"`,
    `"${p.facultySetterEmpId}"`,
    `"${p.paperSet}"`,
    p.targetTotalMarks,
    p.cognitiveDistribution.totalMarks,
    p.cognitiveDistribution.hotsPercentage,
    p.cognitiveDistribution.lotsPercentage,
    p.cognitiveDistribution.isBalanced ? 'YES' : 'NO',
    p.cognitiveDistribution.allCosCovered ? 'YES' : 'NO',
    `"${p.status}"`,
    `"${p.dmcConvenorName || 'N/A'}"`,
    `"${p.cryptographicSeal || ''}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

/**
 * Initial demonstration question papers
 */
export const INITIAL_FACULTY_PAPERS: FacultyQuestionPaper[] = [
  {
    paperId: 'QP-2026-CS401-A',
    submissionToken: 'QP-CSED-CS401-8A1C20',
    courseCode: 'CS401',
    courseTitle: 'Advanced Distributed Operating Systems & Cloud Computing',
    department: 'Computer Science & Engineering',
    facultySetterName: 'Dr. Siddharth Sen',
    facultySetterEmpId: 'EMP-CSE-042',
    paperSet: 'SET_A',
    targetTotalMarks: 100,
    examDurationMinutes: 180,
    questions: [
      {
        questionId: 'Q1',
        questionNumber: 1,
        subQuestionPart: 'a',
        text: 'Define state machine replication (SMR) and state the fundamental safety invariant of Paxos consensus under partial synchrony.',
        marks: 10,
        cognitiveLevel: 'L1_REMEMBER',
        courseOutcome: 'CO1',
        unitModuleNumber: 1,
        rubricKeyOutline: 'Formal SMR definition (4m), Paxos Synod safety theorem and quorum overlap (6m).',
      },
      {
        questionId: 'Q2',
        questionNumber: 2,
        subQuestionPart: 'a',
        text: 'Contrast the Raft randomized election safety model with Paxos multi-decree leader leases. Illustrate split-vote handling.',
        marks: 15,
        cognitiveLevel: 'L2_UNDERSTAND',
        courseOutcome: 'CO2',
        unitModuleNumber: 2,
        rubricKeyOutline: 'Key comparative table (6m), leader election term incrementation diagram (5m), heartbeat timeouts (4m).',
      },
      {
        questionId: 'Q3',
        questionNumber: 3,
        subQuestionPart: 'a',
        text: 'Given a distributed geo-replicated database spanning 3 continents, apply the Raft log compaction technique to prune logs exceeding 100GB without halting active transactions.',
        marks: 15,
        cognitiveLevel: 'L3_APPLY',
        courseOutcome: 'CO3',
        unitModuleNumber: 3,
        rubricKeyOutline: 'InstallSnapshot RPC schema (5m), memory state serialisation (5m), follower snapshot reconciliation (5m).',
      },
      {
        questionId: 'Q4',
        questionNumber: 4,
        subQuestionPart: 'a',
        text: 'Analyze the performance impact of Byzantine Fault Tolerance (PBFT) $3f+1$ replica messages during view-change phases under high network latency.',
        marks: 20,
        cognitiveLevel: 'L4_ANALYZE',
        courseOutcome: 'CO4',
        unitModuleNumber: 4,
        rubricKeyOutline: 'Pre-prepare, prepare, commit message complexity $O(n^2)$ derivation (10m), view change latency bottleneck proof (10m).',
      },
      {
        questionId: 'Q5',
        questionNumber: 5,
        subQuestionPart: 'a',
        text: 'Critique the Spanner TrueTime API vs Hybrid Logical Clocks (HLC) for external consistency in multi-datacenter distributed transactions.',
        marks: 20,
        cognitiveLevel: 'L5_EVALUATE',
        courseOutcome: 'CO5',
        unitModuleNumber: 5,
        rubricKeyOutline: 'GPS/Atomic clock uncertainty bounds $[t.earliest, t.latest]$ (10m), commit-wait latency trade-off evaluation (10m).',
      },
      {
        questionId: 'Q6',
        questionNumber: 6,
        subQuestionPart: 'a',
        text: 'Design an end-to-end resilient distributed lock manager supporting fencing tokens and automatic failover over an untrusted network.',
        marks: 20,
        cognitiveLevel: 'L6_CREATE',
        courseOutcome: 'CO4',
        unitModuleNumber: 4,
        rubricKeyOutline: 'Monotonic fencing token generation (6m), storage node validation protocol (7m), pseudo-code and failure recovery (7m).',
      },
    ],
    status: 'APPROVED_FOR_COE',
    cognitiveDistribution: {
      lotsMarks: 40,
      hotsMarks: 60,
      totalMarks: 100,
      lotsPercentage: 40,
      hotsPercentage: 60,
      levelBreakdown: {
        L1_REMEMBER: 10,
        L2_UNDERSTAND: 15,
        L3_APPLY: 15,
        L4_ANALYZE: 20,
        L5_EVALUATE: 20,
        L6_CREATE: 20,
      },
      coBreakdown: {
        CO1: 10,
        CO2: 15,
        CO3: 15,
        CO4: 40,
        CO5: 20,
      },
      isBalanced: true,
      allCosCovered: true,
    },
    dmcRemarks: 'Excellent cognitive balance. HOTS ratio is 60%, strictly compliant with AICTE recommendations. All 5 COs comprehensively mapped.',
    dmcConvenorName: 'Prof. Arvind Swaminathan (DMC Chair)',
    dmcApprovedDate: '2026-05-02T14:30:00Z',
    cryptographicSeal: 'c71e298517208d193f4127c59a3e81792642b58291a271891cf28738102a1291',
    lastUpdated: '2026-05-02T15:00:00Z',
  },
  {
    paperId: 'QP-2026-EE202-A',
    submissionToken: 'QP-EEED-EE202-12CF40',
    courseCode: 'EE202',
    courseTitle: 'Signals, Systems & Digital Signal Processing',
    department: 'Electrical & Electronics Engineering',
    facultySetterName: 'Dr. Neha Kulkarni',
    facultySetterEmpId: 'EMP-EEE-018',
    paperSet: 'SET_A',
    targetTotalMarks: 100,
    examDurationMinutes: 180,
    questions: [
      {
        questionId: 'Q201',
        questionNumber: 1,
        subQuestionPart: 'a',
        text: 'State the Nyquist-Shannon Sampling Theorem and define aliasing with frequency spectrum sketches.',
        marks: 10,
        cognitiveLevel: 'L1_REMEMBER',
        courseOutcome: 'CO1',
        unitModuleNumber: 1,
        rubricKeyOutline: 'Theorem statement (5m), spectral aliasing illustration and anti-aliasing filter explanation (5m).',
      },
      {
        questionId: 'Q202',
        questionNumber: 2,
        subQuestionPart: 'a',
        text: 'Explain the properties of Discrete-Time Fourier Transform (DTFT) with emphasis on frequency periodicity.',
        marks: 15,
        cognitiveLevel: 'L2_UNDERSTAND',
        courseOutcome: 'CO2',
        unitModuleNumber: 2,
        rubricKeyOutline: 'Periodicity proof (5m), linearity and time-shifting properties (10m).',
      },
      {
        questionId: 'Q203',
        questionNumber: 3,
        subQuestionPart: 'a',
        text: 'Compute the 8-point radix-2 Decimation-in-Time Fast Fourier Transform (DIT-FFT) for sequence x[n] = {1, 0, 1, 0, 1, 0, 1, 0}.',
        marks: 20,
        cognitiveLevel: 'L3_APPLY',
        courseOutcome: 'CO3',
        unitModuleNumber: 3,
        rubricKeyOutline: 'Butterfly diagram signal flow (10m), twiddle factor multiplications (10m).',
      },
      {
        questionId: 'Q204',
        questionNumber: 4,
        subQuestionPart: 'a',
        text: 'Analyze the coefficient quantization roundoff noise in Direct Form II vs Cascade IIR digital filter structures.',
        marks: 25,
        cognitiveLevel: 'L4_ANALYZE',
        courseOutcome: 'CO4',
        unitModuleNumber: 4,
        rubricKeyOutline: 'Noise variance transfer function derivations (15m), comparative pole sensitivity analysis (10m).',
      },
      {
        questionId: 'Q205',
        questionNumber: 5,
        subQuestionPart: 'a',
        text: 'Formulate an optimal Parks-McClellan equiripple FIR filter specification for low-pass biomedical EEG filtering.',
        marks: 30,
        cognitiveLevel: 'L6_CREATE',
        courseOutcome: 'CO5',
        unitModuleNumber: 5,
        rubricKeyOutline: 'Chebyshev alternation theorem application (15m), passband/stopband ripple optimization equations (15m).',
      },
    ],
    status: 'SUBMITTED_TO_DMC',
    cognitiveDistribution: {
      lotsMarks: 45,
      hotsMarks: 55,
      totalMarks: 100,
      lotsPercentage: 45,
      hotsPercentage: 55,
      levelBreakdown: {
        L1_REMEMBER: 10,
        L2_UNDERSTAND: 15,
        L3_APPLY: 20,
        L4_ANALYZE: 25,
        L5_EVALUATE: 0,
        L6_CREATE: 30,
      },
      coBreakdown: {
        CO1: 10,
        CO2: 15,
        CO3: 20,
        CO4: 25,
        CO5: 30,
      },
      isBalanced: true,
      allCosCovered: true,
    },
    dmcRemarks: 'Pending review by Departmental Moderation Committee meeting on May 10.',
    cryptographicSeal: '592f76823901bca28471e9821a0072b83c5180f293021748281093847291a829',
    lastUpdated: '2026-05-04T11:20:00Z',
  },
];
