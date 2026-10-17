/**
 * Faculty Research Publications, Patents & Grants Tracking Engine (TASK-901)
 * 
 * Provides:
 * 1. Tracking and verification of peer-reviewed publications across Scopus, Web of Science, IEEE/ACM, and UGC-CARE.
 * 2. Intellectual Property Rights (IPR) patent lifecycle engine (FILED -> PUBLISHED -> EXAMINED -> GRANTED -> COMMERCIALIZED).
 * 3. Sponsored research grant disbursements from national agencies (DST, SERB, AICTE, ISRO) and corporate sponsors.
 * 4. Algorithmic computation of Faculty Research Impact Score (FRIS: 0-100) and h-index metrics.
 * 5. NAAC Criterion 3.3/3.4 and NBA Criterion 5 AQAR statutory CSV export.
 */

export type PublicationType = 'JOURNAL' | 'CONFERENCE' | 'BOOK_CHAPTER' | 'BOOK';
export type IndexingTier = 'UGC_CARE' | 'SCOPUS' | 'WEB_OF_SCIENCE' | 'IEEE_ACM' | 'PEER_REVIEWED';
export type PatentStatus = 'FILED' | 'PUBLISHED' | 'EXAMINED' | 'GRANTED' | 'COMMERCIALIZED';
export type GrantStatus = 'ACTIVE' | 'COMPLETED' | 'PROPOSED';
export type FundingAgency = 'DST' | 'SERB' | 'AICTE' | 'ISRO' | 'INDUSTRY' | 'INSTITUTIONAL_SEED';

export interface Publication {
  id: string;
  institutionId: string;
  facultyId: string;
  facultyName: string;
  department: string;
  title: string;
  type: PublicationType;
  venue: string; // Journal or conference name
  indexing: IndexingTier[];
  publicationYear: number;
  doi?: string;
  impactFactor?: number;
  citationCount: number;
  isFirstOrCorrespondingAuthor: boolean;
  coAuthors: string[];
  createdAt: string;
}

export interface Patent {
  id: string;
  institutionId: string;
  facultyId: string;
  facultyName: string;
  department: string;
  title: string;
  applicationNumber: string; // e.g. "PAT-2026-104921"
  filingDate: string;
  status: PatentStatus;
  grantDate?: string;
  patentOffice: 'INDIAN_PATENT_OFFICE' | 'USPTO' | 'EPO' | 'WIPO';
  inventors: string[];
  commercializedLicenseAmountINR?: number;
  createdAt: string;
}

export interface ResearchGrant {
  id: string;
  institutionId: string;
  facultyId: string;
  facultyName: string;
  department: string;
  projectTitle: string;
  fundingAgency: FundingAgency;
  sanctionedAmountINR: number;
  durationMonths: number;
  startDate: string;
  status: GrantStatus;
  createdAt: string;
}

export interface FacultyResearchMetrics {
  facultyId: string;
  facultyName: string;
  totalPublications: number;
  scopusCount: number;
  webOfScienceCount: number;
  totalCitations: number;
  hIndex: number;
  totalPatents: number;
  patentsGranted: number;
  activeGrantsINR: number;
  frisScore: number; // 0 to 100
}

// In-Memory Data Store
let publicationsStore: Publication[] = [];
let patentsStore: Patent[] = [];
let grantsStore: ResearchGrant[] = [];

/**
 * Calculates standard Hirsch index (h-index) from an array of citation counts.
 */
export function calculateHIndex(citations: number[]): number {
  if (!citations || citations.length === 0) return 0;
  
  // Sort citations descending
  const sorted = [...citations].sort((a, b) => b - a);
  let h = 0;
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i] >= i + 1) {
      h = i + 1;
    } else {
      break;
    }
  }
  return h;
}

/**
 * Computes Faculty Research Impact Score (FRIS: 0-100)
 * Weighs indexing tier quality, citations, granted patents, and sanctioned grant funding.
 */
export function calculateFRIS(
  facultyPubs: Publication[],
  facultyPatents: Patent[],
  facultyGrants: ResearchGrant[]
): number {
  let points = 0;

  // 1. Publications contribution (Max ~40 pts)
  for (const pub of facultyPubs) {
    let tierMax = 2;
    if (pub.indexing.includes('WEB_OF_SCIENCE')) tierMax = 10;
    else if (pub.indexing.includes('SCOPUS')) tierMax = 8;
    else if (pub.indexing.includes('IEEE_ACM')) tierMax = 7;
    else if (pub.indexing.includes('UGC_CARE')) tierMax = 5;

    points += tierMax;
    if (pub.isFirstOrCorrespondingAuthor) {
      points += 2;
    }
  }

  // 2. Citations contribution (Capped at 25 pts)
  const totalCitations = facultyPubs.reduce((acc, p) => acc + (p.citationCount || 0), 0);
  const citationPoints = Math.min(25, Math.floor(totalCitations * 0.5));
  points += citationPoints;

  // 3. Patents contribution (Max ~25 pts)
  for (const pat of facultyPatents) {
    if (pat.status === 'GRANTED' || pat.status === 'COMMERCIALIZED') {
      points += 15;
    } else if (pat.status === 'EXAMINED' || pat.status === 'PUBLISHED') {
      points += 6;
    } else {
      points += 3; // FILED
    }
  }

  // 4. Grants contribution (Max 20 pts: 2 pts per 1,00,000 INR active/completed)
  const totalGrantINR = facultyGrants
    .filter(g => g.status === 'ACTIVE' || g.status === 'COMPLETED')
    .reduce((acc, g) => acc + g.sanctionedAmountINR, 0);
  const grantPoints = Math.min(20, Math.floor(totalGrantINR / 50000));
  points += grantPoints;

  // Clamped to 0 - 100
  return Math.min(100, Math.max(0, points));
}

export function addPublication(pub: Omit<Publication, 'id' | 'createdAt'>): Publication {
  const newPub: Publication = {
    ...pub,
    id: `PUB-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString()
  };
  publicationsStore.push(newPub);
  return { ...newPub };
}

export function updatePublication(id: string, updates: Partial<Publication>): Publication | null {
  const index = publicationsStore.findIndex(p => p.id === id);
  if (index === -1) return null;
  publicationsStore[index] = { ...publicationsStore[index], ...updates };
  return { ...publicationsStore[index] };
}

export function deletePublication(id: string): boolean {
  const initialLen = publicationsStore.length;
  publicationsStore = publicationsStore.filter(p => p.id !== id);
  return publicationsStore.length < initialLen;
}

export function getPublicationsByInstitution(institutionId: string): Publication[] {
  return publicationsStore
    .filter(p => p.institutionId === institutionId)
    .map(p => ({ ...p }));
}

export function getPublicationsByFaculty(facultyId: string): Publication[] {
  return publicationsStore
    .filter(p => p.facultyId === facultyId)
    .map(p => ({ ...p }));
}

export function addPatent(patent: Omit<Patent, 'id' | 'createdAt'>): Patent {
  const newPatent: Patent = {
    ...patent,
    id: `PAT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString()
  };
  patentsStore.push(newPatent);
  return { ...newPatent };
}

export function updatePatentStatus(id: string, status: PatentStatus, grantDate?: string): Patent | null {
  const index = patentsStore.findIndex(p => p.id === id);
  if (index === -1) return null;
  patentsStore[index] = {
    ...patentsStore[index],
    status,
    grantDate: grantDate || patentsStore[index].grantDate
  };
  return { ...patentsStore[index] };
}

export function getPatentsByInstitution(institutionId: string): Patent[] {
  return patentsStore
    .filter(p => p.institutionId === institutionId)
    .map(p => ({ ...p }));
}

export function getPatentsByFaculty(facultyId: string): Patent[] {
  return patentsStore
    .filter(p => p.facultyId === facultyId)
    .map(p => ({ ...p }));
}

export function addResearchGrant(grant: Omit<ResearchGrant, 'id' | 'createdAt'>): ResearchGrant {
  const newGrant: ResearchGrant = {
    ...grant,
    id: `GRT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString()
  };
  grantsStore.push(newGrant);
  return { ...newGrant };
}

export function getGrantsByInstitution(institutionId: string): ResearchGrant[] {
  return grantsStore
    .filter(g => g.institutionId === institutionId)
    .map(g => ({ ...g }));
}

export function getGrantsByFaculty(facultyId: string): ResearchGrant[] {
  return grantsStore
    .filter(g => g.facultyId === facultyId)
    .map(g => ({ ...g }));
}

export function computeFacultyMetrics(facultyId: string, institutionId: string): FacultyResearchMetrics {
  const pubs = getPublicationsByFaculty(facultyId).filter(p => p.institutionId === institutionId);
  const pats = getPatentsByFaculty(facultyId).filter(p => p.institutionId === institutionId);
  const grants = getGrantsByFaculty(facultyId).filter(g => g.institutionId === institutionId);

  const facultyName = pubs[0]?.facultyName || pats[0]?.facultyName || grants[0]?.facultyName || 'Dr. Faculty Member';
  const citations = pubs.map(p => p.citationCount || 0);
  const totalCitations = citations.reduce((sum, c) => sum + c, 0);
  const hIndex = calculateHIndex(citations);
  const scopusCount = pubs.filter(p => p.indexing.includes('SCOPUS')).length;
  const webOfScienceCount = pubs.filter(p => p.indexing.includes('WEB_OF_SCIENCE')).length;
  const patentsGranted = pats.filter(p => p.status === 'GRANTED' || p.status === 'COMMERCIALIZED').length;
  const activeGrantsINR = grants
    .filter(g => g.status === 'ACTIVE')
    .reduce((sum, g) => sum + g.sanctionedAmountINR, 0);

  const frisScore = calculateFRIS(pubs, pats, grants);

  return {
    facultyId,
    facultyName,
    totalPublications: pubs.length,
    scopusCount,
    webOfScienceCount,
    totalCitations,
    hIndex,
    totalPatents: pats.length,
    patentsGranted,
    activeGrantsINR,
    frisScore
  };
}

/**
 * Generates NAAC Criterion 3.3 & 3.4 compliant CSV report for accreditation auditing.
 */
export function exportResearchPublicationsCSV(institutionId: string): string {
  const pubs = getPublicationsByInstitution(institutionId);
  const pats = getPatentsByInstitution(institutionId);

  const lines: string[] = [];
  lines.push('=== NAAC CRITERION 3.4: RESEARCH PUBLICATIONS AUDIT ===');
  lines.push('Publication_ID,Faculty_Name,Department,Title,Type,Venue,Indexing_Tiers,Year,DOI,Citations,First_Or_Corresponding');

  for (const p of pubs) {
    const indexingStr = p.indexing.join(';');
    lines.push(`"${p.id}","${p.facultyName}","${p.department}","${p.title.replace(/"/g, '""')}","${p.type}","${p.venue.replace(/"/g, '""')}","${indexingStr}",${p.publicationYear},"${p.doi || 'N/A'}",${p.citationCount},"${p.isFirstOrCorrespondingAuthor ? 'YES' : 'NO'}"`);
  }

  lines.push('');
  lines.push('=== NAAC CRITERION 3.3: INTELLECTUAL PROPERTY & PATENTS AUDIT ===');
  lines.push('Patent_ID,Faculty_Name,Department,Title,Application_Number,Patent_Office,Status,Filing_Date,Grant_Date,Commercialized_INR');

  for (const pat of pats) {
    lines.push(`"${pat.id}","${pat.facultyName}","${pat.department}","${pat.title.replace(/"/g, '""')}","${pat.applicationNumber}","${pat.patentOffice}","${pat.status}","${pat.filingDate}","${pat.grantDate || 'PENDING'}",${pat.commercializedLicenseAmountINR || 0}`);
  }

  return lines.join('\n');
}

/**
 * Seeding helper for testing and development
 */
export function seedResearchData(institutionId: string): void {
  publicationsStore = [
    {
      id: 'PUB-101',
      institutionId,
      facultyId: 'FAC-CSE-001',
      facultyName: 'Dr. Aris Thorne',
      department: 'Computer Science & Engineering',
      title: 'Scalable Byz-Quorum Consensus for Heterogeneous Edge Distributed Ledgers',
      type: 'JOURNAL',
      venue: 'IEEE Transactions on Parallel and Distributed Systems',
      indexing: ['SCOPUS', 'WEB_OF_SCIENCE', 'IEEE_ACM'],
      publicationYear: 2025,
      doi: '10.1109/TPDS.2025.1092837',
      impactFactor: 4.8,
      citationCount: 42,
      isFirstOrCorrespondingAuthor: true,
      coAuthors: ['K. V. Rao', 'E. Vance'],
      createdAt: '2025-03-12T10:00:00Z'
    },
    {
      id: 'PUB-102',
      institutionId,
      facultyId: 'FAC-CSE-001',
      facultyName: 'Dr. Aris Thorne',
      department: 'Computer Science & Engineering',
      title: 'Sub-Microsecond Zero-Copy IPC Pipelines in Linux Kernel Runtimes',
      type: 'CONFERENCE',
      venue: 'ACM SIGCOMM 2025 Workshop on Low Latency Systems',
      indexing: ['SCOPUS', 'IEEE_ACM'],
      publicationYear: 2025,
      doi: '10.1145/3651890.3653920',
      impactFactor: 0,
      citationCount: 18,
      isFirstOrCorrespondingAuthor: true,
      coAuthors: ['M. Alistair'],
      createdAt: '2025-08-20T14:30:00Z'
    },
    {
      id: 'PUB-103',
      institutionId,
      facultyId: 'FAC-ECE-002',
      facultyName: 'Dr. Sunita Raman',
      department: 'Electronics & Communication',
      title: 'Energy-Efficient 28nm Cryogenic CMOS Low-Noise Amplifier for Quantum Interfacing',
      type: 'JOURNAL',
      venue: 'IEEE Journal of Solid-State Circuits',
      indexing: ['SCOPUS', 'WEB_OF_SCIENCE', 'IEEE_ACM'],
      publicationYear: 2024,
      doi: '10.1109/JSSC.2024.3382910',
      impactFactor: 5.6,
      citationCount: 65,
      isFirstOrCorrespondingAuthor: true,
      coAuthors: ['P. Deshmukh', 'T. Gallagher'],
      createdAt: '2024-11-05T09:15:00Z'
    }
  ];

  patentsStore = [
    {
      id: 'PAT-201',
      institutionId,
      facultyId: 'FAC-CSE-001',
      facultyName: 'Dr. Aris Thorne',
      department: 'Computer Science & Engineering',
      title: 'Lock-Free SPSC Ring Buffer Architecture with Hardware-Level Cache Coherence Optimization',
      applicationNumber: 'PAT-2025-883912',
      filingDate: '2025-01-14',
      status: 'GRANTED',
      grantDate: '2026-02-18',
      patentOffice: 'INDIAN_PATENT_OFFICE',
      inventors: ['Dr. Aris Thorne', 'PinIT Labs Inc.'],
      commercializedLicenseAmountINR: 1200000,
      createdAt: '2025-01-14T08:00:00Z'
    },
    {
      id: 'PAT-202',
      institutionId,
      facultyId: 'FAC-ECE-002',
      facultyName: 'Dr. Sunita Raman',
      department: 'Electronics & Communication',
      title: 'Ultra-Low Voltage Bias Circuit for Sub-Kelvin Sensor Nodes',
      applicationNumber: 'PAT-2025-994018',
      filingDate: '2025-06-30',
      status: 'EXAMINED',
      patentOffice: 'INDIAN_PATENT_OFFICE',
      inventors: ['Dr. Sunita Raman'],
      createdAt: '2025-06-30T11:00:00Z'
    }
  ];

  grantsStore = [
    {
      id: 'GRT-301',
      institutionId,
      facultyId: 'FAC-CSE-001',
      facultyName: 'Dr. Aris Thorne',
      department: 'Computer Science & Engineering',
      projectTitle: 'Deterministic Sub-Millisecond Cloud Schedulers for Autonomous Vehicular Fleets',
      fundingAgency: 'SERB',
      sanctionedAmountINR: 3500000,
      durationMonths: 36,
      startDate: '2024-04-01',
      status: 'ACTIVE',
      createdAt: '2024-03-25T12:00:00Z'
    }
  ];
}

export function resetResearchStore(): void {
  publicationsStore = [];
  patentsStore = [];
  grantsStore = [];
}
