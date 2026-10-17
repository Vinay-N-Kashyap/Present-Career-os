/**
 * Faculty Annual Appraisal & Academic Performance Indicator (API) Engine (TASK-908)
 * 
 * Implements:
 * 1. UGC Regulations on Career Advancement Scheme (CAS) across 3 statutory categories:
 *    - Category I: Teaching, Learning & Evaluation Activities (L-T-P compliance, exam duties, pedagogy).
 *    - Category II: Co-Curricular, Extension & Institutional Governance (Mentorship, NBA/NAAC roles, FDPs).
 *    - Category III: Research, Academic Contributions & Research Guidance (Publications, Patents, Grants).
 * 2. Deterministic Annual API score calculation with minimum cutoff validations per career stage.
 * 3. CAS Promotion Eligibility evaluation (Stage 1 -> 2, Stage 2 -> 3, Associate Professor, Full Professor).
 * 4. 4-Stage institutional appraisal governance state machine (DRAFT -> SUBMITTED -> HOD_REVIEWED -> DEAN_APPROVED).
 * 5. Statutory UGC CAS Annual Self-Assessment Report (PBAS) CSV export.
 */

export type AppraisalStatus = 'DRAFT' | 'SUBMITTED_BY_FACULTY' | 'HOD_REVIEWED' | 'DEAN_APPROVED' | 'REVISION_REQUESTED';
export type FacultyDesignation = 'ASSISTANT_PROFESSOR_STAGE_1' | 'ASSISTANT_PROFESSOR_STAGE_2' | 'ASSISTANT_PROFESSOR_STAGE_3' | 'ASSOCIATE_PROFESSOR' | 'PROFESSOR';
export type AppraisalRating = 'NOT_SATISFACTORY' | 'SATISFACTORY' | 'GOOD' | 'OUTSTANDING';

export interface CategoryITeachingMetrics {
  lecturesDeliveredHours: number;
  lecturesTargetHours: number; // e.g. 180 hours
  examDutiesCompleted: number; // invigilation, paper setting, grading
  pedagogyInnovationScore: number; // 0 - 20 (interactive modules, LMS design)
}

export interface CategoryIIGovernanceMetrics {
  studentClubMentorshipHours: number;
  institutionalCommitteesCount: number; // e.g. NAAC/NBA cell, anti-ragging, admissions
  fdpConferencesOrganizedOrAttended: number; // Faculty Development Programs
}

export interface CategoryIIIResearchMetrics {
  scopusWosPapersCount: number; // 15 pts each
  ugcCarePapersCount: number; // 10 pts each
  patentsGrantedCount: number; // 25 pts each
  phdScholarsGuided: number; // 10 pts each
  sponsoredResearchFundsINR: number; // 5 pts per 1,00,000 INR
}

export interface FacultyAppraisalReport {
  id: string;
  institutionId: string;
  facultyId: string;
  facultyName: string;
  department: string;
  currentDesignation: FacultyDesignation;
  academicYear: string; // e.g. "2025-2026"
  categoryI: CategoryITeachingMetrics;
  categoryII: CategoryIIGovernanceMetrics;
  categoryIII: CategoryIIIResearchMetrics;
  categoryIScore: number; // Max 100
  categoryIIScore: number; // Max 50
  categoryIIIScore: number; // Uncapped API Score
  totalCompositeApiScore: number;
  overallRating: AppraisalRating;
  eligibleForCasPromotion: boolean;
  targetPromotionDesignation?: FacultyDesignation;
  status: AppraisalStatus;
  facultySignatureDate?: string;
  hodComments?: string;
  hodSignatureDate?: string;
  deanComments?: string;
  deanSignatureDate?: string;
  createdAt: string;
  updatedAt: string;
}

// In-Memory Data Store
let appraisalStore: FacultyAppraisalReport[] = [];

/**
 * Computes Category I (Teaching, Learning & Evaluation) score. Max 100.
 */
export function calculateCategoryIScore(catI: CategoryITeachingMetrics): number {
  const lectureRatio = catI.lecturesTargetHours > 0 ? (catI.lecturesDeliveredHours / catI.lecturesTargetHours) : 0;
  const lecturePoints = Math.min(60, Math.round(lectureRatio * 60));
  const examPoints = Math.min(20, catI.examDutiesCompleted * 4);
  const pedagogyPoints = Math.min(20, Math.max(0, catI.pedagogyInnovationScore));

  return Math.min(100, lecturePoints + examPoints + pedagogyPoints);
}

/**
 * Computes Category II (Co-curricular, Extension & Governance) score. Max 50.
 */
export function calculateCategoryIIScore(catII: CategoryIIGovernanceMetrics): number {
  const mentorshipPoints = Math.min(15, Math.floor(catII.studentClubMentorshipHours / 2));
  const committeePoints = Math.min(20, catII.institutionalCommitteesCount * 5);
  const fdpPoints = Math.min(15, catII.fdpConferencesOrganizedOrAttended * 5);

  return Math.min(50, mentorshipPoints + committeePoints + fdpPoints);
}

/**
 * Computes Category III (Research & Academic Contributions API) score.
 */
export function calculateCategoryIIIScore(catIII: CategoryIIIResearchMetrics): number {
  const papersWoS = catIII.scopusWosPapersCount * 15;
  const papersUGC = catIII.ugcCarePapersCount * 10;
  const patents = catIII.patentsGrantedCount * 25;
  const phd = catIII.phdScholarsGuided * 10;
  const grantPoints = Math.floor(catIII.sponsoredResearchFundsINR / 100000) * 5;

  return papersWoS + papersUGC + patents + phd + grantPoints;
}

/**
 * Evaluates UGC CAS promotion eligibility based on current rank and API score thresholds.
 */
export function evaluateCasPromotion(
  designation: FacultyDesignation,
  catIScore: number,
  catIIScore: number,
  catIIIScore: number
): { eligible: boolean; targetDesignation?: FacultyDesignation; reason: string } {
  // Baseline prerequisite: Category I >= 75 and Category II >= 20
  if (catIScore < 75) {
    return { eligible: false, reason: 'Category I (Teaching) score must be >= 75 for promotion consideration' };
  }
  if (catIIScore < 20) {
    return { eligible: false, reason: 'Category II (Governance & Co-Curricular) score must be >= 20' };
  }

  switch (designation) {
    case 'ASSISTANT_PROFESSOR_STAGE_1':
      // Requires Cat III >= 20 points
      if (catIIIScore >= 20) {
        return { eligible: true, targetDesignation: 'ASSISTANT_PROFESSOR_STAGE_2', reason: 'Satisfies Stage 1 to 2 CAS benchmarks' };
      }
      return { eligible: false, reason: 'Requires at least 20 Category III Research API points (Current: ' + catIIIScore + ')' };

    case 'ASSISTANT_PROFESSOR_STAGE_2':
      // Requires Cat III >= 50 points
      if (catIIIScore >= 50) {
        return { eligible: true, targetDesignation: 'ASSISTANT_PROFESSOR_STAGE_3', reason: 'Satisfies Stage 2 to 3 CAS benchmarks' };
      }
      return { eligible: false, reason: 'Requires at least 50 Category III Research API points (Current: ' + catIIIScore + ')' };

    case 'ASSISTANT_PROFESSOR_STAGE_3':
      // Requires Cat III >= 75 points
      if (catIIIScore >= 75) {
        return { eligible: true, targetDesignation: 'ASSOCIATE_PROFESSOR', reason: 'Satisfies Associate Professor CAS promotion benchmark' };
      }
      return { eligible: false, reason: 'Requires at least 75 Category III Research API points (Current: ' + catIIIScore + ')' };

    case 'ASSOCIATE_PROFESSOR':
      // Requires Cat III >= 110 points
      if (catIIIScore >= 110) {
        return { eligible: true, targetDesignation: 'PROFESSOR', reason: 'Satisfies Full Professor CAS promotion benchmark' };
      }
      return { eligible: false, reason: 'Requires at least 110 Category III Research API points (Current: ' + catIIIScore + ')' };

    case 'PROFESSOR':
      return { eligible: false, reason: 'Already at highest academic rank (Professor)' };
  }
}

/**
 * Derives overall Performance Appraisal Rating
 */
export function determineAppraisalRating(catIScore: number, catIIScore: number, catIIIScore: number): AppraisalRating {
  const total = catIScore + catIIScore + Math.min(100, catIIIScore); // normalized out of 250
  if (total >= 210 && catIScore >= 85) return 'OUTSTANDING';
  if (total >= 170 && catIScore >= 75) return 'GOOD';
  if (total >= 130 && catIScore >= 65) return 'SATISFACTORY';
  return 'NOT_SATISFACTORY';
}

export function createFacultyAppraisal(params: {
  institutionId: string;
  facultyId: string;
  facultyName: string;
  department: string;
  currentDesignation: FacultyDesignation;
  academicYear: string;
  categoryI: CategoryITeachingMetrics;
  categoryII: CategoryIIGovernanceMetrics;
  categoryIII: CategoryIIIResearchMetrics;
}): FacultyAppraisalReport {
  const catIScore = calculateCategoryIScore(params.categoryI);
  const catIIScore = calculateCategoryIIScore(params.categoryII);
  const catIIIScore = calculateCategoryIIIScore(params.categoryIII);
  const totalComposite = catIScore + catIIScore + catIIIScore;
  const rating = determineAppraisalRating(catIScore, catIIScore, catIIIScore);
  const promotion = evaluateCasPromotion(params.currentDesignation, catIScore, catIIScore, catIIIScore);

  const report: FacultyAppraisalReport = {
    id: `CAS-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    institutionId: params.institutionId,
    facultyId: params.facultyId,
    facultyName: params.facultyName,
    department: params.department,
    currentDesignation: params.currentDesignation,
    academicYear: params.academicYear,
    categoryI: { ...params.categoryI },
    categoryII: { ...params.categoryII },
    categoryIII: { ...params.categoryIII },
    categoryIScore: catIScore,
    categoryIIScore: catIIScore,
    categoryIIIScore: catIIIScore,
    totalCompositeApiScore: totalComposite,
    overallRating: rating,
    eligibleForCasPromotion: promotion.eligible,
    targetPromotionDesignation: promotion.targetDesignation,
    status: 'DRAFT',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  appraisalStore.push(report);
  return { ...report };
}

export function getAppraisalsByInstitution(institutionId: string): FacultyAppraisalReport[] {
  return appraisalStore
    .filter(a => a.institutionId === institutionId)
    .map(a => ({
      ...a,
      categoryI: { ...a.categoryI },
      categoryII: { ...a.categoryII },
      categoryIII: { ...a.categoryIII }
    }));
}

export function getAppraisalById(id: string): FacultyAppraisalReport | null {
  const rep = appraisalStore.find(a => a.id === id);
  if (!rep) return null;
  return {
    ...rep,
    categoryI: { ...rep.categoryI },
    categoryII: { ...rep.categoryII },
    categoryIII: { ...rep.categoryIII }
  };
}

export function advanceAppraisalStatus(
  id: string,
  newStatus: AppraisalStatus,
  comments?: string
): FacultyAppraisalReport | null {
  const report = appraisalStore.find(a => a.id === id);
  if (!report) return null;

  report.status = newStatus;
  report.updatedAt = new Date().toISOString();

  if (newStatus === 'SUBMITTED_BY_FACULTY') {
    report.facultySignatureDate = new Date().toISOString();
  } else if (newStatus === 'HOD_REVIEWED') {
    report.hodComments = comments;
    report.hodSignatureDate = new Date().toISOString();
  } else if (newStatus === 'DEAN_APPROVED') {
    report.deanComments = comments;
    report.deanSignatureDate = new Date().toISOString();
  }

  return {
    ...report,
    categoryI: { ...report.categoryI },
    categoryII: { ...report.categoryII },
    categoryIII: { ...report.categoryIII }
  };
}

export function exportUgcCasAppraisalCSV(institutionId: string): string {
  const reports = getAppraisalsByInstitution(institutionId);

  const lines: string[] = [];
  lines.push('=== UGC CAREER ADVANCEMENT SCHEME (CAS) ANNUAL APPRAISAL AUDIT ===');
  lines.push('Report_ID,Faculty_Name,Department,Designation,Academic_Year,Cat_I_Teaching,Cat_II_Governance,Cat_III_Research_API,Total_API,Rating,CAS_Eligible,Target_Rank,Status');

  for (const r of reports) {
    lines.push(
      `"${r.id}","${r.facultyName}","${r.department}","${r.currentDesignation}","${r.academicYear}",${r.categoryIScore},${r.categoryIIScore},${r.categoryIIIScore},${r.totalCompositeApiScore},"${r.overallRating}","${r.eligibleForCasPromotion ? 'YES' : 'NO'}","${r.targetPromotionDesignation || 'N/A'}","${r.status}"`
    );
  }

  return lines.join('\n');
}

export function seedAppraisalData(institutionId: string): void {
  appraisalStore = [
    {
      id: 'CAS-101',
      institutionId,
      facultyId: 'FAC-CSE-001',
      facultyName: 'Dr. Aris Thorne',
      department: 'Computer Science & Engineering',
      currentDesignation: 'ASSISTANT_PROFESSOR_STAGE_2',
      academicYear: '2025-2026',
      categoryI: {
        lecturesDeliveredHours: 175,
        lecturesTargetHours: 180,
        examDutiesCompleted: 5,
        pedagogyInnovationScore: 18
      },
      categoryII: {
        studentClubMentorshipHours: 24,
        institutionalCommitteesCount: 3,
        fdpConferencesOrganizedOrAttended: 2
      },
      categoryIII: {
        scopusWosPapersCount: 3,
        ugcCarePapersCount: 1,
        patentsGrantedCount: 1,
        phdScholarsGuided: 1,
        sponsoredResearchFundsINR: 3500000
      },
      categoryIScore: 96,
      categoryIIScore: 47,
      categoryIIIScore: 265, // 45 + 10 + 25 + 10 + 175 = 265
      totalCompositeApiScore: 408,
      overallRating: 'OUTSTANDING',
      eligibleForCasPromotion: true,
      targetPromotionDesignation: 'ASSISTANT_PROFESSOR_STAGE_3',
      status: 'HOD_REVIEWED',
      facultySignatureDate: '2026-04-10T10:00:00Z',
      hodComments: 'Exceptional teaching performance, high-impact research, and strong departmental governance.',
      hodSignatureDate: '2026-04-15T14:30:00Z',
      createdAt: '2026-04-01T09:00:00Z',
      updatedAt: '2026-04-15T14:30:00Z'
    }
  ];
}

export function resetAppraisalStore(): void {
  appraisalStore = [];
}
