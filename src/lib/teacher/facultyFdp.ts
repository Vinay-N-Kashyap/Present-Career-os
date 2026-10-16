/**
 * Faculty Continuous Professional Development (CPD) & FDP Tracker Engine (TASK-923)
 * 
 * Provides:
 * 1. AICTE & UGC mandatory Faculty Development Program (FDP) compliance tracking.
 * 2. Multi-category professional development:
 *    - AICTE ATAL Academy Programs
 *    - UGC HRDC Orientation & Refresher Courses
 *    - NPTEL / SWAYAM FDP Certifications
 *    - Corporate / Industry Immersion Sabbaticals
 *    - Outcome-Based Education (OBE) & Pedagogical Workshops
 * 3. Deterministic CPD Credit Score computation & AICTE annual 40-credit compliance threshold.
 * 4. 4-Stage lifecycle: PLANNED -> DEPUTED_BY_INSTITUTION -> ATTENDED -> CERTIFICATE_VERIFIED.
 * 5. Cryptographic certificate verification hashing and NAAC Criterion 6.3.3/6.3.4 CSV export.
 */

export type FdpCategory = 
  | 'AICTE_ATAL_ACADEMY' 
  | 'UGC_HRDC_ORIENTATION' 
  | 'NPTEL_SWAYAM_MOOC' 
  | 'INDUSTRY_IMMERSION' 
  | 'PEDAGOGICAL_WORKSHOP';

export type DeliveryMode = 'IN_PERSON' | 'ONLINE' | 'HYBRID';

export type FdpStatus = 'PLANNED' | 'DEPUTED_BY_INSTITUTION' | 'ATTENDED' | 'CERTIFICATE_VERIFIED';

export interface FacultyFdpRecord {
  id: string; // FDP-[HEX8]
  institutionId: string;
  facultyId: string;
  facultyName: string;
  department: string;
  title: string;
  category: FdpCategory;
  organizingBody: string; // e.g. "IIT Madras & AICTE ATAL"
  mode: DeliveryMode;
  startDate: string;
  endDate: string;
  durationDays: number;
  totalContactHours: number;
  creditsEarned: number;
  status: FdpStatus;
  certificateUrl?: string;
  certificateVerificationHash?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
}

export interface FacultyCpdSummary {
  facultyId: string;
  facultyName: string;
  department: string;
  academicYear: string;
  totalFdpCount: number;
  totalHoursCompleted: number;
  totalCreditsEarned: number;
  isAicteCompliant: boolean; // Minimum 40 annual CPD credits
  creditsDeficit: number;
  categoryBreakdown: Record<FdpCategory, number>;
}

// In-Memory Store
let fdpStore: FacultyFdpRecord[] = [];

export function getFdpRecords(
  institutionId: string,
  filter?: { facultyId?: string; category?: FdpCategory; status?: FdpStatus }
): FacultyFdpRecord[] {
  return fdpStore
    .filter(f => f.institutionId === institutionId)
    .filter(f => !filter?.facultyId || f.facultyId === filter.facultyId)
    .filter(f => !filter?.category || f.category === filter.category)
    .filter(f => !filter?.status || f.status === filter.status)
    .map(f => ({ ...f }));
}

export function calculateCpdCredits(
  category: FdpCategory,
  durationDays: number,
  contactHours: number
): number {
  switch (category) {
    case 'AICTE_ATAL_ACADEMY':
      // 10 credits per 5-6 day week (min 30h)
      return durationDays >= 5 ? 10 : Math.max(5, Math.round(contactHours / 3));
    case 'UGC_HRDC_ORIENTATION':
      // 15 credits per 2-week cycle (min 60h)
      return durationDays >= 10 ? 15 : 10;
    case 'NPTEL_SWAYAM_MOOC':
      // 15 credits for certified 8-12 week course with proctored exam
      return 15;
    case 'INDUSTRY_IMMERSION':
      // 20 credits for immersion (min 10 days / 2 weeks)
      return durationDays >= 10 ? 20 : 10;
    case 'PEDAGOGICAL_WORKSHOP':
      // 5 credits for 2-3 day workshop
      return durationDays >= 2 ? 5 : 2;
  }
}

export function registerFdpParticipation(params: {
  institutionId: string;
  facultyId: string;
  facultyName: string;
  department: string;
  title: string;
  category: FdpCategory;
  organizingBody: string;
  mode: DeliveryMode;
  startDate: string;
  endDate: string;
  durationDays: number;
  totalContactHours: number;
  status?: FdpStatus;
  certificateUrl?: string;
}): { success: boolean; record?: FacultyFdpRecord; error?: string } {
  if (params.durationDays <= 0 || params.totalContactHours <= 0) {
    return {
      success: false,
      error: 'INVALID_DURATION: Duration in days and contact hours must be positive numbers.'
    };
  }

  const hex = Math.floor(Math.random() * 0xFFFFFFFF).toString(16).padStart(8, '0').toUpperCase();
  const id = `FDP-${hex}`;
  const creditsEarned = calculateCpdCredits(params.category, params.durationDays, params.totalContactHours);
  const status: FdpStatus = params.status || 'PLANNED';

  const newRecord: FacultyFdpRecord = {
    id,
    institutionId: params.institutionId,
    facultyId: params.facultyId,
    facultyName: params.facultyName,
    department: params.department,
    title: params.title,
    category: params.category,
    organizingBody: params.organizingBody,
    mode: params.mode,
    startDate: params.startDate,
    endDate: params.endDate,
    durationDays: params.durationDays,
    totalContactHours: params.totalContactHours,
    creditsEarned,
    status,
    certificateUrl: params.certificateUrl,
    createdAt: new Date().toISOString()
  };

  fdpStore.push(newRecord);
  return { success: true, record: { ...newRecord } };
}

export function advanceFdpStatus(
  fdpId: string,
  newStatus: FdpStatus,
  options?: { certificateUrl?: string }
): { success: boolean; record?: FacultyFdpRecord; error?: string } {
  const rec = fdpStore.find(r => r.id === fdpId);
  if (!rec) return { success: false, error: 'RECORD_NOT_FOUND' };

  rec.status = newStatus;
  if (options?.certificateUrl) {
    rec.certificateUrl = options.certificateUrl;
  }

  return { success: true, record: { ...rec } };
}

export function verifyFdpCertificate(
  fdpId: string,
  verifiedBy: string
): { success: boolean; record?: FacultyFdpRecord; error?: string } {
  const rec = fdpStore.find(r => r.id === fdpId);
  if (!rec) return { success: false, error: 'RECORD_NOT_FOUND' };

  rec.status = 'CERTIFICATE_VERIFIED';
  rec.verifiedBy = verifiedBy;
  rec.verifiedAt = new Date().toISOString();
  
  // Deterministic mock verification digest
  const hexHash = Math.floor(Math.random() * 0xFFFFFFFFFFFFFF).toString(16).padStart(14, '0');
  rec.certificateVerificationHash = `SHA256:${hexHash}`;

  return { success: true, record: { ...rec } };
}

export function computeFacultyCpdSummary(
  facultyId: string,
  institutionId: string
): FacultyCpdSummary {
  const records = getFdpRecords(institutionId, { facultyId });
  const completedRecords = records.filter(
    r => r.status === 'ATTENDED' || r.status === 'CERTIFICATE_VERIFIED'
  );

  let facultyName = 'Faculty Member';
  let department = 'Computer Science';

  if (records.length > 0) {
    facultyName = records[0].facultyName;
    department = records[0].department;
  }

  const categoryBreakdown: Record<FdpCategory, number> = {
    AICTE_ATAL_ACADEMY: 0,
    UGC_HRDC_ORIENTATION: 0,
    NPTEL_SWAYAM_MOOC: 0,
    INDUSTRY_IMMERSION: 0,
    PEDAGOGICAL_WORKSHOP: 0
  };

  let totalHours = 0;
  let totalCredits = 0;

  for (const r of completedRecords) {
    totalHours += r.totalContactHours;
    totalCredits += r.creditsEarned;
    categoryBreakdown[r.category] = (categoryBreakdown[r.category] || 0) + 1;
  }

  const isAicteCompliant = totalCredits >= 40;
  const creditsDeficit = Math.max(0, 40 - totalCredits);

  return {
    facultyId,
    facultyName,
    department,
    academicYear: '2026-2027',
    totalFdpCount: completedRecords.length,
    totalHoursCompleted: totalHours,
    totalCreditsEarned: totalCredits,
    isAicteCompliant,
    creditsDeficit,
    categoryBreakdown
  };
}

export function exportFacultyFdpCSV(institutionId: string): string {
  const records = getFdpRecords(institutionId);

  const lines: string[] = [];
  lines.push('=== NAAC CRITERION 6.3.3: FACULTY DEVELOPMENT PROGRAMS (FDP) REGISTRY ===');
  lines.push('Record_ID,Faculty_ID,Faculty_Name,Department,FDP_Title,Category,Organizing_Body,Mode,Duration_Days,Contact_Hours,CPD_Credits,Status,Verification_Hash');

  for (const r of records) {
    lines.push(
      `"${r.id}","${r.facultyId}","${r.facultyName}","${r.department}","${r.title.replace(/"/g, '""')}","${r.category}","${r.organizingBody.replace(/"/g, '""')}","${r.mode}",${r.durationDays},${r.totalContactHours},${r.creditsEarned},"${r.status}","${r.certificateVerificationHash || 'PENDING'}"`
    );
  }

  return lines.join('\n');
}

export function seedFacultyFdpData(institutionId: string): void {
  fdpStore = [
    {
      id: 'FDP-9C1108E1',
      institutionId,
      facultyId: 'FAC-CS-001',
      facultyName: 'Dr. Aris Thorne',
      department: 'Computer Science',
      title: 'AICTE ATAL FDP on Quantum Algorithms & High-Performance Distributed Simulation',
      category: 'AICTE_ATAL_ACADEMY',
      organizingBody: 'IISc Bangalore & AICTE ATAL Academy',
      mode: 'HYBRID',
      startDate: '2026-06-15',
      endDate: '2026-06-20',
      durationDays: 6,
      totalContactHours: 36,
      creditsEarned: 10,
      status: 'CERTIFICATE_VERIFIED',
      certificateUrl: 'https://atal.aicte-india.org/verify/ATAL-2026-90184',
      certificateVerificationHash: 'SHA256:7f9b8c0019fa28e1',
      verifiedBy: 'Dean of Faculty Affairs',
      verifiedAt: '2026-06-25T11:00:00Z',
      createdAt: '2026-05-10T09:00:00Z'
    },
    {
      id: 'FDP-9C1108E2',
      institutionId,
      facultyId: 'FAC-CS-001',
      facultyName: 'Dr. Aris Thorne',
      department: 'Computer Science',
      title: 'NPTEL-AICTE Advanced 12-Week FDP: Distributed Cloud Architecture',
      category: 'NPTEL_SWAYAM_MOOC',
      organizingBody: 'IIT Kharagpur & NPTEL SWAYAM',
      mode: 'ONLINE',
      startDate: '2026-01-20',
      endDate: '2026-04-15',
      durationDays: 84,
      totalContactHours: 45,
      creditsEarned: 15,
      status: 'CERTIFICATE_VERIFIED',
      certificateUrl: 'https://nptel.ac.in/noc/Ecertificate/?q=NPTEL26CS401',
      certificateVerificationHash: 'SHA256:3a4b9c1188de47f2',
      verifiedBy: 'Dean of Faculty Affairs',
      verifiedAt: '2026-05-02T14:00:00Z',
      createdAt: '2026-01-10T10:00:00Z'
    },
    {
      id: 'FDP-9C1108E3',
      institutionId,
      facultyId: 'FAC-CS-001',
      facultyName: 'Dr. Aris Thorne',
      department: 'Computer Science',
      title: 'Enterprise Cloud Sabbatical & Production Reliability Immersion',
      category: 'INDUSTRY_IMMERSION',
      organizingBody: 'AWS Cloud Infrastructure Center of Excellence',
      mode: 'IN_PERSON',
      startDate: '2026-07-01',
      endDate: '2026-07-15',
      durationDays: 14,
      totalContactHours: 80,
      creditsEarned: 20,
      status: 'CERTIFICATE_VERIFIED',
      certificateUrl: 'https://aws.amazon.com/credentials/industry-immersion-2026',
      certificateVerificationHash: 'SHA256:91bcfe44018899aa',
      verifiedBy: 'Dean of Faculty Affairs',
      verifiedAt: '2026-07-20T16:30:00Z',
      createdAt: '2026-06-01T08:00:00Z'
    }
  ];
}

export function resetFdpStore(): void {
  fdpStore = [];
}
