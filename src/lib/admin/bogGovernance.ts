/**
 * Central University Statutory Governance & Board of Governors (BoG) Resolution Engine
 *
 * Statutory Alignment:
 * - Central Universities Act / State University Acts & Statutes
 * - University Grants Commission (UGC) Governance Regulations for Higher Education
 * - AICTE Mandatory Governance Norms & Board of Governors Constitution Rules
 *
 * Capabilities:
 * 1. Statutory University Governance Bodies (Board of Governors, Academic Council,
 *    Finance Committee, Building & Works Committee).
 * 2. Meeting quorum verification engine (mandatory >= 50% voting members present).
 * 3. Formal Resolutions State Machine:
 *    DRAFTED -> TABLED_IN_MEETING -> UNANIMOUSLY_PASSED | PASSED_BY_MAJORITY | DEFERRED | REJECTED.
 * 4. Action Taken Report (ATR) tracking with statutory officer assignment & overdue watchdog.
 * 5. Official University Gazette Notification Number issuance (GAZ-[YEAR]-[BODY]-[HEX6]).
 * 6. Cryptographic digital tamper-proof digest (SHA-256) authenticating passed resolutions.
 * 7. University Governance & Board Resolution Gazette CSV export.
 */

import crypto from 'crypto';

export type StatutoryBody =
  | 'BOARD_OF_GOVERNORS'
  | 'ACADEMIC_COUNCIL'
  | 'FINANCE_COMMITTEE'
  | 'BUILDING_AND_WORKS_COMMITTEE';

export type ResolutionStatus =
  | 'DRAFTED'
  | 'TABLED_IN_MEETING'
  | 'UNANIMOUSLY_PASSED'
  | 'PASSED_BY_MAJORITY'
  | 'DEFERRED'
  | 'REJECTED';

export type ResolutionCategory =
  | 'ACADEMIC_REGULATIONS'
  | 'CAPITAL_INFRASTRUCTURE'
  | 'FACULTY_RECRUITMENT_CADRE'
  | 'FINANCE_AND_ENDOWMENT'
  | 'STUDENT_STATUTE_AND_WELFARE'
  | 'DISCIPLINARY_AND_INTEGRITY';

export type AtrStatus =
  | 'ATR_PENDING'
  | 'IN_PROGRESS'
  | 'IMPLEMENTED'
  | 'SUPERSEDED';

export interface GovernanceMember {
  id: string;
  name: string;
  designation: string; // e.g. "Chairman, BoG", "Vice Chancellor", "Govt Nominee"
  affiliation: string; // e.g. "Ministry of Education", "Industry Leader", "Professor of Physics"
  body: StatutoryBody;
  isExOfficio: boolean;
  isVotingMember: boolean;
}

export interface GovernanceMeeting {
  id: string;
  body: StatutoryBody;
  meetingNumber: string; // e.g. "BOG-68", "AC-42", "FC-35"
  title: string;
  meetingDate: string; // YYYY-MM-DD
  venue: string;
  totalVotingMembers: number;
  presentVotingMembers: number;
  quorumRequired: number; // >= 50%
  isQuorumMet: boolean;
  isMinutesAdopted: boolean;
  presidedBy: string;
}

export interface VotingTally {
  votesFor: number;
  votesAgainst: number;
  abstentions: number;
}

export interface BogResolution {
  id: string;
  resolutionNumber: string; // e.g. "RES-BOG-68-01", "RES-AC-42-04"
  meetingId: string;
  meetingNumber: string;
  body: StatutoryBody;
  category: ResolutionCategory;
  title: string;
  agendaItemNumber: string; // e.g. "Agenda Item 68.4"
  summary: string;
  mover: string;
  seconder: string;
  tabledDate: string;
  status: ResolutionStatus;
  voting: VotingTally;
  gazetteNotificationNumber?: string;
  cryptographicDigest?: string; // SHA-256
  atrStatus: AtrStatus;
  implementationOfficer?: string; // e.g. "Registrar", "Dean Academics", "Finance Officer"
  implementationDeadline?: string; // YYYY-MM-DD
  atrRemarks?: string;
  lastUpdatedDate: string;
}

/**
 * Calculates mandatory quorum threshold (>= 50% of voting members, rounded up).
 */
export function calculateQuorum(totalVotingMembers: number): number {
  if (totalVotingMembers <= 0) return 0;
  return Math.ceil(totalVotingMembers * 0.50);
}

/**
 * Verifies if meeting attendance satisfies statutory quorum.
 */
export function verifyMeetingQuorum(
  totalVotingMembers: number,
  presentVotingMembers: number
): boolean {
  if (totalVotingMembers <= 0) return false;
  const quorum = calculateQuorum(totalVotingMembers);
  return presentVotingMembers >= quorum;
}

/**
 * Evaluates voting tally to determine formal resolution state.
 */
export function evaluateResolutionVoting(voting: VotingTally): ResolutionStatus {
  const { votesFor, votesAgainst, abstentions } = voting;

  if (votesFor === 0 && votesAgainst === 0 && abstentions === 0) {
    return 'TABLED_IN_MEETING';
  }

  if (votesFor > 0 && votesAgainst === 0) {
    return 'UNANIMOUSLY_PASSED';
  }

  if (votesFor > votesAgainst) {
    return 'PASSED_BY_MAJORITY';
  }

  if (votesFor === votesAgainst && votesFor > 0) {
    return 'DEFERRED';
  }

  return 'REJECTED';
}

/**
 * Formats body code for gazette reference.
 */
function getBodyShortCode(body: StatutoryBody): string {
  switch (body) {
    case 'BOARD_OF_GOVERNORS':
      return 'BOG';
    case 'ACADEMIC_COUNCIL':
      return 'AC';
    case 'FINANCE_COMMITTEE':
      return 'FC';
    case 'BUILDING_AND_WORKS_COMMITTEE':
      return 'BWC';
    default:
      return 'BOG';
  }
}

/**
 * Generates an official University Gazette Notification Number for passed resolutions.
 * Format: GAZ-[YEAR]-[BODY]-[HEX6]
 */
export function generateGazetteNumber(
  body: StatutoryBody,
  year: number,
  resolutionId: string
): string {
  const bodyCode = getBodyShortCode(body);
  const hash = crypto
    .createHash('sha256')
    .update(`${body}::${year}::${resolutionId}`)
    .digest('hex')
    .substring(0, 6)
    .toUpperCase();
  return `GAZ-${year}-${bodyCode}-${hash}`;
}

/**
 * Computes tamper-proof SHA-256 cryptographic digest binding resolution metadata.
 */
export function generateCryptographicSeal(res: {
  id: string;
  resolutionNumber: string;
  body: StatutoryBody;
  status: ResolutionStatus;
  voting: VotingTally;
  gazetteNotificationNumber?: string;
}): string {
  const payload = [
    res.id,
    res.resolutionNumber,
    res.body,
    res.status,
    `FOR:${res.voting.votesFor}`,
    `AGAINST:${res.voting.votesAgainst}`,
    `ABS:${res.voting.abstentions}`,
    res.gazetteNotificationNumber || 'NO_GAZETTE',
  ].join('::');

  return crypto.createHash('sha256').update(payload).digest('hex');
}

/**
 * Checks whether an Action Taken Report (ATR) is overdue.
 */
export function isAtrOverdue(
  deadline?: string,
  atrStatus?: AtrStatus,
  currentDate: string = new Date().toISOString().split('T')[0]
): boolean {
  if (!deadline || !atrStatus) return false;
  if (atrStatus === 'IMPLEMENTED' || atrStatus === 'SUPERSEDED') return false;
  return currentDate > deadline;
}

/**
 * Exports university governance resolution register to standard CSV.
 */
export function exportBogResolutionsCSV(resolutions: BogResolution[]): string {
  const headers = [
    'Resolution Number',
    'Statutory Body',
    'Meeting Ref',
    'Agenda Item',
    'Category',
    'Title',
    'Mover',
    'Status',
    'Votes (For/Against/Abstain)',
    'Gazette Notification Number',
    'ATR Status',
    'Implementation Officer',
    'Implementation Deadline',
    'Cryptographic SHA-256 Digest',
  ];

  const rows = resolutions.map((r) => [
    `"${r.resolutionNumber}"`,
    `"${r.body}"`,
    `"${r.meetingNumber}"`,
    `"${r.agendaItemNumber}"`,
    `"${r.category}"`,
    `"${r.title.replace(/"/g, '""')}"`,
    `"${r.mover.replace(/"/g, '""')}"`,
    `"${r.status}"`,
    `"${r.voting.votesFor}/${r.voting.votesAgainst}/${r.voting.abstentions}"`,
    `"${r.gazetteNotificationNumber || 'N/A'}"`,
    `"${r.atrStatus}"`,
    `"${r.implementationOfficer || 'UNASSIGNED'}"`,
    `"${r.implementationDeadline || 'N/A'}"`,
    `"${r.cryptographicDigest || 'UNSIGNED'}"`,
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}

// ---------------------------------------------------------------------------
// DEFAULT STATUTORY SEED DATA
// ---------------------------------------------------------------------------

export const DEFAULT_STATUTORY_MEMBERS: GovernanceMember[] = [
  {
    id: 'MEM-01',
    name: 'Dr. Vikramaditya Sen',
    designation: 'Chairman, Board of Governors',
    affiliation: 'Distinguished Scientist & Chancellor Emeritus',
    body: 'BOARD_OF_GOVERNORS',
    isExOfficio: false,
    isVotingMember: true,
  },
  {
    id: 'MEM-02',
    name: 'Prof. Anita Deshmukh',
    designation: 'Vice Chancellor',
    affiliation: 'PinIT University Executive Head',
    body: 'BOARD_OF_GOVERNORS',
    isExOfficio: true,
    isVotingMember: true,
  },
  {
    id: 'MEM-03',
    name: 'Shri R. K. Srivastava',
    designation: 'Joint Secretary (Higher Education)',
    affiliation: 'Ministry of Education, Govt. of India',
    body: 'BOARD_OF_GOVERNORS',
    isExOfficio: true,
    isVotingMember: true,
  },
  {
    id: 'MEM-04',
    name: 'Dr. Preeti Vasudevan',
    designation: 'Director, IIT Delhi Nominee',
    affiliation: 'External Academic Expert',
    body: 'BOARD_OF_GOVERNORS',
    isExOfficio: false,
    isVotingMember: true,
  },
  {
    id: 'MEM-05',
    name: 'Mr. Arvind Narayanan',
    designation: 'Corporate Sector Nominee',
    affiliation: 'Managing Director, Infosys EdgeLabs',
    body: 'BOARD_OF_GOVERNORS',
    isExOfficio: false,
    isVotingMember: true,
  },
  {
    id: 'MEM-06',
    name: 'Prof. Harish Chandra',
    designation: 'Dean, Academic Affairs',
    affiliation: 'PinIT University Senate Representative',
    body: 'BOARD_OF_GOVERNORS',
    isExOfficio: true,
    isVotingMember: true,
  },
  {
    id: 'MEM-07',
    name: 'Prof. Sangeeta Rao',
    designation: 'Dean of Faculty & Research',
    affiliation: 'PinIT University Senate Representative',
    body: 'BOARD_OF_GOVERNORS',
    isExOfficio: true,
    isVotingMember: true,
  },
  {
    id: 'MEM-08',
    name: 'Dr. M. S. Kulkarni',
    designation: 'Registrar & Member-Secretary',
    affiliation: 'PinIT University Administration',
    body: 'BOARD_OF_GOVERNORS',
    isExOfficio: true,
    isVotingMember: false, // Non-voting Member Secretary
  },
];

export const DEFAULT_GOVERNANCE_MEETINGS: GovernanceMeeting[] = [
  {
    id: 'MTG-BOG-68',
    body: 'BOARD_OF_GOVERNORS',
    meetingNumber: 'BOG-68',
    title: '68th Ordinary Meeting of the Board of Governors',
    meetingDate: '2026-09-18',
    venue: 'Executive Council Chambers, VC Secretariat',
    totalVotingMembers: 7,
    presentVotingMembers: 6,
    quorumRequired: 4,
    isQuorumMet: true,
    isMinutesAdopted: true,
    presidedBy: 'Dr. Vikramaditya Sen (Chairman)',
  },
  {
    id: 'MTG-AC-42',
    body: 'ACADEMIC_COUNCIL',
    meetingNumber: 'AC-42',
    title: '42nd Meeting of the Academic Council',
    meetingDate: '2026-10-05',
    venue: 'Senate Hall, Central Administrative Block',
    totalVotingMembers: 16,
    presentVotingMembers: 14,
    quorumRequired: 8,
    isQuorumMet: true,
    isMinutesAdopted: true,
    presidedBy: 'Prof. Anita Deshmukh (Vice Chancellor)',
  },
  {
    id: 'MTG-FC-35',
    body: 'FINANCE_COMMITTEE',
    meetingNumber: 'FC-35',
    title: '35th Annual Budget & Audit Review Committee',
    meetingDate: '2026-08-22',
    venue: 'Finance Conference Room, West Wing',
    totalVotingMembers: 6,
    presentVotingMembers: 5,
    quorumRequired: 3,
    isQuorumMet: true,
    isMinutesAdopted: true,
    presidedBy: 'Prof. Anita Deshmukh (Vice Chancellor)',
  },
  {
    id: 'MTG-BWC-29',
    body: 'BUILDING_AND_WORKS_COMMITTEE',
    meetingNumber: 'BWC-29',
    title: '29th Infrastructure & Master Plan Works Meeting',
    meetingDate: '2026-09-30',
    venue: 'Estate Office Boardroom',
    totalVotingMembers: 8,
    presentVotingMembers: 7,
    quorumRequired: 4,
    isQuorumMet: true,
    isMinutesAdopted: true,
    presidedBy: 'Prof. S. R. Raman (Chair, BWC)',
  },
];

export const DEFAULT_BOG_RESOLUTIONS: BogResolution[] = [
  {
    id: 'RES-001',
    resolutionNumber: 'RES-BOG-68-01',
    meetingId: 'MTG-BOG-68',
    meetingNumber: 'BOG-68',
    body: 'BOARD_OF_GOVERNORS',
    category: 'CAPITAL_INFRASTRUCTURE',
    title: 'Sanction for 500-kW Rooftop Solar Photovoltaic Grid & Zero Carbon Campus Phase II',
    agendaItemNumber: 'Agenda Item 68.2',
    summary:
      'Approval of Rs. 4.85 Crore capital expenditure under Green Campus Initiative for 500-kW solar grid with net-metering integration.',
    mover: 'Prof. Anita Deshmukh',
    seconder: 'Mr. Arvind Narayanan',
    tabledDate: '2026-09-18',
    status: 'UNANIMOUSLY_PASSED',
    voting: { votesFor: 6, votesAgainst: 0, abstentions: 0 },
    gazetteNotificationNumber: 'GAZ-2026-BOG-9B21FA',
    cryptographicDigest:
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    atrStatus: 'IN_PROGRESS',
    implementationOfficer: 'University Superintending Engineer & CFO',
    implementationDeadline: '2026-12-31',
    atrRemarks: 'CPWD tendering initiated; technical bids under technical review.',
    lastUpdatedDate: '2026-09-25',
  },
  {
    id: 'RES-002',
    resolutionNumber: 'RES-BOG-68-02',
    meetingId: 'MTG-BOG-68',
    meetingNumber: 'BOG-68',
    body: 'BOARD_OF_GOVERNORS',
    category: 'FACULTY_RECRUITMENT_CADRE',
    title: 'Establishment of 12 New Professor & Associate Professor Cadres in Artificial Intelligence',
    agendaItemNumber: 'Agenda Item 68.3',
    summary:
      'Sanctioning of 4 Chair Professors, 4 Associate Professors, and 4 Assistant Professors for School of Autonomous Intelligent Systems under UGC 7th CPC.',
    mover: 'Prof. Harish Chandra',
    seconder: 'Dr. Preeti Vasudevan',
    tabledDate: '2026-09-18',
    status: 'PASSED_BY_MAJORITY',
    voting: { votesFor: 5, votesAgainst: 1, abstentions: 0 },
    gazetteNotificationNumber: 'GAZ-2026-BOG-F4C910',
    cryptographicDigest:
      '78d9b1a03e6f9821a8cd34ef91b2c4e5129038475a6102938475610293847561',
    atrStatus: 'IMPLEMENTED',
    implementationOfficer: 'Registrar & Head HR',
    implementationDeadline: '2026-10-15',
    atrRemarks: 'Statutory rolling national advertisement published in Employment News.',
    lastUpdatedDate: '2026-10-10',
  },
  {
    id: 'RES-003',
    resolutionNumber: 'RES-AC-42-01',
    meetingId: 'MTG-AC-42',
    meetingNumber: 'AC-42',
    body: 'ACADEMIC_COUNCIL',
    category: 'ACADEMIC_REGULATIONS',
    title: 'Adoption of National Credit Framework (NCrF) & Multiple Entry/Exit B.Tech Guidelines',
    agendaItemNumber: 'Agenda Item 42.1',
    summary:
      'Ratification of 4-year undergraduate structure with Academic Bank of Credits (ABC) integration and 1-year certificate / 2-year diploma exit provisions.',
    mover: 'Prof. Harish Chandra',
    seconder: 'Prof. Sangeeta Rao',
    tabledDate: '2026-10-05',
    status: 'UNANIMOUSLY_PASSED',
    voting: { votesFor: 14, votesAgainst: 0, abstentions: 0 },
    gazetteNotificationNumber: 'GAZ-2026-AC-78A34E',
    cryptographicDigest:
      '1298374aefb38472910384756102938475610293847561029384756102938475',
    atrStatus: 'IN_PROGRESS',
    implementationOfficer: 'Dean Academic Affairs & Controller of Examinations',
    implementationDeadline: '2026-11-30',
    atrRemarks: 'Curriculum syllabus committee updating course credits across 14 departments.',
    lastUpdatedDate: '2026-10-08',
  },
  {
    id: 'RES-004',
    resolutionNumber: 'RES-FC-35-01',
    meetingId: 'MTG-FC-35',
    meetingNumber: 'FC-35',
    body: 'FINANCE_COMMITTEE',
    category: 'FINANCE_AND_ENDOWMENT',
    title: 'Annual Research Seed Fund Allocation of Rs. 2.50 Crores for Early-Career Faculty',
    agendaItemNumber: 'Agenda Item 35.4',
    summary:
      'Allocation of seed grant pool up to Rs. 25 Lakhs per assistant professor for establishing computational and experimental research laboratories.',
    mover: 'Prof. Anita Deshmukh',
    seconder: 'Prof. Sangeeta Rao',
    tabledDate: '2026-08-22',
    status: 'PASSED_BY_MAJORITY',
    voting: { votesFor: 4, votesAgainst: 1, abstentions: 0 },
    gazetteNotificationNumber: 'GAZ-2026-FC-31E7D9',
    cryptographicDigest:
      'aabbccdd11223344556677889900112233445566778899001122334455667788',
    atrStatus: 'IMPLEMENTED',
    implementationOfficer: 'Dean Research & Finance Officer',
    implementationDeadline: '2026-09-30',
    atrRemarks: '12 faculty proposals sanctioned and first tranche disbursed.',
    lastUpdatedDate: '2026-09-28',
  },
  {
    id: 'RES-005',
    resolutionNumber: 'RES-BOG-68-03',
    meetingId: 'MTG-BOG-68',
    meetingNumber: 'BOG-68',
    body: 'BOARD_OF_GOVERNORS',
    category: 'STUDENT_STATUTE_AND_WELFARE',
    title: 'Revision of Student Health Insurance Coverage & Telemedicine Endowment Policy',
    agendaItemNumber: 'Agenda Item 68.6',
    summary:
      'Proposal to enhance student medical cover from Rs. 1.0 Lakh to Rs. 5.0 Lakhs per annum with 24x7 psychiatric helpline counseling.',
    mover: 'Dr. Preeti Vasudevan',
    seconder: 'Prof. Anita Deshmukh',
    tabledDate: '2026-09-18',
    status: 'TABLED_IN_MEETING',
    voting: { votesFor: 0, votesAgainst: 0, abstentions: 0 },
    atrStatus: 'ATR_PENDING',
    implementationOfficer: 'Dean Student Welfare',
    implementationDeadline: '2026-11-15',
    atrRemarks: 'Awaiting actuarial quotations from national insurance consortium.',
    lastUpdatedDate: '2026-09-18',
  },
  {
    id: 'RES-006',
    resolutionNumber: 'RES-BWC-29-01',
    meetingId: 'MTG-BWC-29',
    meetingNumber: 'BWC-29',
    body: 'BUILDING_AND_WORKS_COMMITTEE',
    category: 'CAPITAL_INFRASTRUCTURE',
    title: 'Tender Cancellation & Penalty Forfeiture for Campus Multi-Tier Parking Facility',
    agendaItemNumber: 'Agenda Item 29.3',
    summary:
      'Contractor default under Clause 14; forfeiture of performance bank guarantee of Rs. 42 Lakhs and fresh global e-tender issuance.',
    mover: 'Prof. S. R. Raman',
    seconder: 'Prof. Anita Deshmukh',
    tabledDate: '2026-09-30',
    status: 'UNANIMOUSLY_PASSED',
    voting: { votesFor: 7, votesAgainst: 0, abstentions: 0 },
    gazetteNotificationNumber: 'GAZ-2026-BWC-5D88C2',
    cryptographicDigest:
      'ccddeeff11223344556677889900112233445566778899001122334455667788',
    atrStatus: 'IN_PROGRESS',
    implementationOfficer: 'University Legal Advisor & Estate Officer',
    implementationDeadline: '2026-10-31',
    atrRemarks: 'Legal notice served; forfeiture demand submitted to State Bank of India.',
    lastUpdatedDate: '2026-10-04',
  },
];

// ---------------------------------------------------------------------------
// IN-MEMORY STATE REPOSITORY & MANAGEMENT
// ---------------------------------------------------------------------------

let membersStore: GovernanceMember[] = [...DEFAULT_STATUTORY_MEMBERS];
let meetingsStore: GovernanceMeeting[] = [...DEFAULT_GOVERNANCE_MEETINGS];
let resolutionsStore: BogResolution[] = [...DEFAULT_BOG_RESOLUTIONS];

export function resetGovernanceStore(): void {
  membersStore = [...DEFAULT_STATUTORY_MEMBERS];
  meetingsStore = [...DEFAULT_GOVERNANCE_MEETINGS];
  resolutionsStore = [...DEFAULT_BOG_RESOLUTIONS];
}

export function getAllMembers(): GovernanceMember[] {
  return [...membersStore];
}

export function getAllMeetings(): GovernanceMeeting[] {
  return [...meetingsStore];
}

export function getAllResolutions(): BogResolution[] {
  return [...resolutionsStore];
}

export function getResolutionsByBody(body: StatutoryBody): BogResolution[] {
  return resolutionsStore.filter((r) => r.body === body);
}

export function registerGovernanceResolution(
  input: Omit<BogResolution, 'id' | 'lastUpdatedDate'> & { id?: string }
): BogResolution {
  const id = input.id || `RES-${Date.now().toString().slice(-4)}`;
  const now = new Date().toISOString().split('T')[0];

  const newRes: BogResolution = {
    ...input,
    id,
    lastUpdatedDate: now,
  };

  resolutionsStore.unshift(newRes);
  return newRes;
}

export function recordResolutionVoting(
  resolutionId: string,
  voting: VotingTally
): BogResolution | null {
  const idx = resolutionsStore.findIndex((r) => r.id === resolutionId);
  if (idx === -1) return null;

  const current = resolutionsStore[idx];
  const newStatus = evaluateResolutionVoting(voting);
  const now = new Date().toISOString().split('T')[0];
  const currentYear = new Date().getFullYear();

  let gazetteNumber = current.gazetteNotificationNumber;
  if (
    (newStatus === 'UNANIMOUSLY_PASSED' || newStatus === 'PASSED_BY_MAJORITY') &&
    !gazetteNumber
  ) {
    gazetteNumber = generateGazetteNumber(current.body, currentYear, current.id);
  }

  const updated: BogResolution = {
    ...current,
    voting,
    status: newStatus,
    gazetteNotificationNumber: gazetteNumber,
    lastUpdatedDate: now,
  };

  if (newStatus === 'UNANIMOUSLY_PASSED' || newStatus === 'PASSED_BY_MAJORITY') {
    updated.cryptographicDigest = generateCryptographicSeal(updated);
  }

  resolutionsStore[idx] = updated;
  return updated;
}

export function updateResolutionAtr(
  resolutionId: string,
  atrStatus: AtrStatus,
  implementationOfficer?: string,
  implementationDeadline?: string,
  atrRemarks?: string
): BogResolution | null {
  const idx = resolutionsStore.findIndex((r) => r.id === resolutionId);
  if (idx === -1) return null;

  const current = resolutionsStore[idx];
  const now = new Date().toISOString().split('T')[0];

  const updated: BogResolution = {
    ...current,
    atrStatus,
    implementationOfficer: implementationOfficer ?? current.implementationOfficer,
    implementationDeadline: implementationDeadline ?? current.implementationDeadline,
    atrRemarks: atrRemarks ?? current.atrRemarks,
    lastUpdatedDate: now,
  };

  resolutionsStore[idx] = updated;
  return updated;
}
