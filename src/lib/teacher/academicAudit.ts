/**
 * Faculty Academic Audit & Peer Classroom Teaching Observation Engine
 * Statutory Compliance: NAAC Criterion 2.3.1 (Student-Centric Learning),
 * UGC Guidelines on Academic & Administrative Audit (AAA) & University IQAC Framework.
 *
 * Platform: PinIT Career OS - Teacher Portal & Faculty Governance
 * Zero-Collision Invariant: Pure Branch C administrative and faculty governance.
 */

import { createHash } from 'crypto';

export type AcademicAuditType =
  | 'PEER_CLASSROOM_TEACHING_OBSERVATION'
  | 'ANNUAL_DEPARTMENTAL_ACADEMIC_AUDIT'
  | 'COURSE_FILE_AND_SYLLABUS_AUDIT';

export type ObservationStage =
  | 'OBSERVATION_SCHEDULED'
  | 'CLASSROOM_OBSERVED'
  | 'REPORT_SUBMITTED'
  | 'FACULTY_ACKNOWLEDGED'
  | 'IQAC_ACTION_LOCKED';

export interface RubricScores {
  coursePlanAdherence: number; // 1.0 to 5.0
  activeLearningEngagement: number; // 1.0 to 5.0
  ictIntegration: number; // 1.0 to 5.0
  formativeAssessment: number; // 1.0 to 5.0
  inclusivityAndSupport: number; // 1.0 to 5.0
}

export interface PeerObservationRecord {
  auditId: string;
  auditRefNumber: string; // AAA-[YEAR]-[DEPT]-[HEX6]
  auditType: AcademicAuditType;
  facultyInstructor: string;
  peerAuditor: string;
  department: string;
  courseCode: string;
  courseTitle: string;
  topicTaught: string;
  classBatch: string; // e.g. B.Tech CSE 6th Sem, Sec A
  scheduledDate: string; // YYYY-MM-DD
  observationDate?: string;
  scores?: RubricScores;
  compositeAqi?: number; // Academic Quality Index (out of 5.0)
  qualityGrade?: string; // Exemplary (A++), Commendable (A+), etc.
  commendations?: string; // Strong pedagogical practices
  recommendations?: string; // Areas for pedagogical enhancement
  facultyRemarks?: string; // Instructor acknowledgement feedback
  stage: ObservationStage;
  cryptographicSeal?: string; // SHA-256 seal
}

/**
 * Validates that all 5 rubric scores are within 1.0 to 5.0 range
 */
export function validateRubricScores(scores: RubricScores): boolean {
  const vals = [
    scores.coursePlanAdherence,
    scores.activeLearningEngagement,
    scores.ictIntegration,
    scores.formativeAssessment,
    scores.inclusivityAndSupport,
  ];
  return vals.every((v) => typeof v === 'number' && !isNaN(v) && v >= 1.0 && v <= 5.0);
}

/**
 * Computes composite Academic Quality Index (AQI) out of 5.0 and NAAC grade banding
 */
export function calculateCompositeAqi(scores: RubricScores): {
  aqi: number;
  grade: string;
  band: 'A++' | 'A+' | 'A' | 'B' | 'C';
} {
  if (!validateRubricScores(scores)) {
    throw new Error('Rubric scores must each be between 1.0 and 5.0');
  }

  const sum =
    scores.coursePlanAdherence +
    scores.activeLearningEngagement +
    scores.ictIntegration +
    scores.formativeAssessment +
    scores.inclusivityAndSupport;

  const aqi = Math.round((sum / 5.0) * 100) / 100;

  if (aqi >= 4.5) {
    return { aqi, grade: 'EXEMPLARY', band: 'A++' };
  } else if (aqi >= 4.0) {
    return { aqi, grade: 'COMMENDABLE', band: 'A+' };
  } else if (aqi >= 3.5) {
    return { aqi, grade: 'SATISFACTORY', band: 'A' };
  } else if (aqi >= 3.0) {
    return { aqi, grade: 'NEEDS_IMPROVEMENT', band: 'B' };
  } else {
    return { aqi, grade: 'UNSATISFACTORY_INTERVENTION_REQUIRED', band: 'C' };
  }
}

/**
 * Generates unique Academic Audit Token: AAA-[YEAR]-[DEPT]-[HEX6]
 */
export function generateAuditToken(department: string): string {
  const deptCode = department
    .replace(/[^A-Za-z]/g, '')
    .slice(0, 4)
    .toUpperCase() || 'ACAD';
  const year = new Date().getFullYear();
  const hex = createHash('sha256')
    .update(`${deptCode}-${Date.now()}-${Math.random()}`)
    .digest('hex')
    .slice(0, 6)
    .toUpperCase();
  return `AAA-${year}-${deptCode}-${hex}`;
}

/**
 * Computes tamper-proof SHA-256 seal authenticating peer observation
 */
export function generateAcademicAuditSeal(
  auditRef: string,
  instructor: string,
  auditor: string,
  courseCode: string,
  aqi: number,
  date: string
): string {
  const payload = [
    auditRef,
    instructor,
    auditor,
    courseCode,
    aqi.toFixed(2),
    date,
  ].join('||');

  return createHash('sha256').update(payload).digest('hex');
}

/**
 * Schedules a peer classroom teaching observation session
 */
export function schedulePeerObservation(params: {
  facultyInstructor: string;
  peerAuditor: string;
  department: string;
  courseCode: string;
  courseTitle: string;
  topicTaught: string;
  classBatch: string;
  scheduledDate: string;
  auditType?: AcademicAuditType;
}): PeerObservationRecord {
  const auditRefNumber = generateAuditToken(params.department);
  const auditId = `AAA-${Date.now().toString(36)}`;

  return {
    auditId,
    auditRefNumber,
    auditType: params.auditType || 'PEER_CLASSROOM_TEACHING_OBSERVATION',
    facultyInstructor: params.facultyInstructor,
    peerAuditor: params.peerAuditor,
    department: params.department,
    courseCode: params.courseCode,
    courseTitle: params.courseTitle,
    topicTaught: params.topicTaught,
    classBatch: params.classBatch,
    scheduledDate: params.scheduledDate,
    stage: 'OBSERVATION_SCHEDULED',
  };
}

/**
 * Submits peer observer scoring report and computes cryptographic seal
 */
export function submitObservationReport(
  obs: PeerObservationRecord,
  report: {
    scores: RubricScores;
    commendations: string;
    recommendations: string;
    observationDate: string;
  }
): PeerObservationRecord {
  const { aqi, grade, band } = calculateCompositeAqi(report.scores);
  const qualityGrade = `${grade} (${band})`;

  const seal = generateAcademicAuditSeal(
    obs.auditRefNumber,
    obs.facultyInstructor,
    obs.peerAuditor,
    obs.courseCode,
    aqi,
    report.observationDate
  );

  return {
    ...obs,
    stage: 'REPORT_SUBMITTED',
    observationDate: report.observationDate,
    scores: report.scores,
    compositeAqi: aqi,
    qualityGrade,
    commendations: report.commendations,
    recommendations: report.recommendations,
    cryptographicSeal: seal,
  };
}

/**
 * Records faculty acknowledgement feedback
 */
export function facultyAcknowledgeAudit(
  obs: PeerObservationRecord,
  facultyRemarks: string
): PeerObservationRecord {
  return {
    ...obs,
    stage: 'FACULTY_ACKNOWLEDGED',
    facultyRemarks,
  };
}

/**
 * Exports NAAC Criterion 2.3.1 / IQAC Compliant Academic Audit Ledger CSV
 */
export function exportAcademicAuditLedgerCSV(records: PeerObservationRecord[]): string {
  const headers = [
    'Audit Reference',
    'Audit Type',
    'Instructor Faculty',
    'Peer Auditor',
    'Department',
    'Course Code',
    'Course Title',
    'Topic Taught',
    'Observation Date',
    'Course Plan Score (5.0)',
    'Active Learning Score (5.0)',
    'ICT Integration Score (5.0)',
    'Formative Assessment Score (5.0)',
    'Inclusivity Score (5.0)',
    'Composite AQI',
    'Quality Grade',
    'Stage',
    'Cryptographic SHA-256 Seal',
  ];

  const escapeField = (val: string | number | undefined) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = records.map((r) =>
    [
      escapeField(r.auditRefNumber),
      escapeField(r.auditType),
      escapeField(r.facultyInstructor),
      escapeField(r.peerAuditor),
      escapeField(r.department),
      escapeField(r.courseCode),
      escapeField(r.courseTitle),
      escapeField(r.topicTaught),
      escapeField(r.observationDate ?? 'SCHEDULED'),
      escapeField(r.scores?.coursePlanAdherence ?? 'N/A'),
      escapeField(r.scores?.activeLearningEngagement ?? 'N/A'),
      escapeField(r.scores?.ictIntegration ?? 'N/A'),
      escapeField(r.scores?.formativeAssessment ?? 'N/A'),
      escapeField(r.scores?.inclusivityAndSupport ?? 'N/A'),
      escapeField(r.compositeAqi ?? 'N/A'),
      escapeField(r.qualityGrade ?? 'PENDING'),
      escapeField(r.stage),
      escapeField(r.cryptographicSeal ?? 'N/A'),
    ].join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Seed Dataset for Peer Teaching Observations
 */
export const SEED_OBSERVATIONS: PeerObservationRecord[] = [
  {
    auditId: 'AAA-001',
    auditRefNumber: 'AAA-2026-COMP-9011AB',
    auditType: 'PEER_CLASSROOM_TEACHING_OBSERVATION',
    facultyInstructor: 'Prof. Arvind Swaminathan',
    peerAuditor: 'Dr. Rajiv Malhotra (Senior Professor CSE)',
    department: 'Computer Science & Engineering',
    courseCode: 'CS-402',
    courseTitle: 'Distributed Systems & Cloud Computing',
    topicTaught: 'Raft Consensus Algorithm: Leader Election & Log Replication',
    classBatch: 'B.Tech CSE 8th Sem (Sec A)',
    scheduledDate: '2026-02-12',
    observationDate: '2026-02-12',
    scores: {
      coursePlanAdherence: 4.8,
      activeLearningEngagement: 4.6,
      ictIntegration: 4.9,
      formativeAssessment: 4.5,
      inclusivityAndSupport: 4.7,
    },
    compositeAqi: 4.7,
    qualityGrade: 'EXEMPLARY (A++)',
    commendations: 'Outstanding interactive live visualization of Raft term elections using distributed terminal clusters. Students actively simulated network partition scenarios.',
    recommendations: 'Could allocate 5 minutes for peer-to-peer discussion before voting rounds.',
    facultyRemarks: 'Feedback gratefully acknowledged. Peer-discussion breakout timer implemented in subsequent sessions.',
    stage: 'FACULTY_ACKNOWLEDGED',
    cryptographicSeal: 'e8192a0149586b7c9d0124958194a85b6c7d8e9f0123456789abcdef01234567',
  },
  {
    auditId: 'AAA-002',
    auditRefNumber: 'AAA-2026-ELEC-4412CD',
    auditType: 'PEER_CLASSROOM_TEACHING_OBSERVATION',
    facultyInstructor: 'Dr. Meenakshi Sundaram',
    peerAuditor: 'Prof. S. R. Iyengar (Dean Infrastructure)',
    department: 'Electrical & Electronics Engineering',
    courseCode: 'EE-304',
    courseTitle: 'Power Electronics & Inverter Drives',
    topicTaught: 'Space Vector PWM Modulation for Three-Phase Inverters',
    classBatch: 'B.Tech EEE 6th Sem',
    scheduledDate: '2026-02-18',
    observationDate: '2026-02-18',
    scores: {
      coursePlanAdherence: 4.5,
      activeLearningEngagement: 4.2,
      ictIntegration: 4.4,
      formativeAssessment: 4.0,
      inclusivityAndSupport: 4.3,
    },
    compositeAqi: 4.28,
    qualityGrade: 'COMMENDABLE (A+)',
    commendations: 'Rigorous derivation of voltage space vectors with clear physical intuition. Good pace control.',
    recommendations: 'Include in-class diagnostic quiz via mobile LMS to assess harmonic distortion comprehension.',
    stage: 'REPORT_SUBMITTED',
    cryptographicSeal: 'b4a694f83726591024e58b19a12c4193856112948c264a9712bfd91e846011c3',
  },
  {
    auditId: 'AAA-003',
    auditRefNumber: 'AAA-2026-BIOT-8899EF',
    auditType: 'PEER_CLASSROOM_TEACHING_OBSERVATION',
    facultyInstructor: 'Dr. Vivek Bhattacharya',
    peerAuditor: 'Dr. Aruna Chatterjee (HoD Biotechnology)',
    department: 'Biotechnology & Biomedical Engineering',
    courseCode: 'BT-302',
    courseTitle: 'Genetic Engineering & Recombinant DNA',
    topicTaught: 'CRISPR-Cas9 Guide RNA Design and Off-Target Prevention',
    classBatch: 'B.Tech Biotech 6th Sem',
    scheduledDate: '2026-03-05',
    stage: 'OBSERVATION_SCHEDULED',
  },
];
