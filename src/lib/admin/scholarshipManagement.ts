/**
 * Student Scholarship, Financial Aid & Freeship Disbursement Engine (TASK-911)
 * 
 * Provides:
 * 1. NAAC Criterion 5.1.1 / 5.1.2 compliant financial aid and scholarship governance.
 * 2. Multi-tier funding sources: Government (NSP/State), Institutional Freeships, Merit-cum-Means, Corporate CSR, and Alumni Endowments.
 * 3. Algorithmic eligibility verification: CGPA threshold, annual household income ceiling, and attendance compliance.
 * 4. 5-Stage disbursement lifecycle (APPLIED -> DOCUMENTS_VERIFIED -> COMMITTEE_APPROVED -> DISBURSED -> REJECTED).
 * 5. Direct Beneficiary Transfer (DBT) UTR transaction logging and statutory NAAC/AICTE scholarship ledger CSV export.
 */

export type ScholarshipType = 'GOVERNMENT_SCHEME' | 'INSTITUTIONAL_FREESHIP' | 'MERIT_CUM_MEANS' | 'CORPORATE_CSR' | 'ALUMNI_ENDOWMENT';
export type ScholarshipStatus = 'APPLIED' | 'DOCUMENTS_VERIFIED' | 'COMMITTEE_APPROVED' | 'DISBURSED' | 'REJECTED';

export interface ScholarshipScheme {
  schemeId: string;
  institutionId: string;
  name: string; // e.g. "Tata Trust STEM Merit Fellowship"
  type: ScholarshipType;
  fundingBody: string;
  annualBudgetINR: number;
  disbursedAmountINR: number;
  awardAmountPerStudentINR: number;
  minCgpa: number; // e.g. 8.0
  maxFamilyIncomeINR?: number; // e.g. 600000
  minAttendancePercent: number; // e.g. 75
  activeAcademicYear: string;
}

export interface StudentScholarshipApplication {
  id: string;
  institutionId: string;
  schemeId: string;
  studentId: string;
  studentName: string;
  enrollmentNumber: string;
  department: string;
  semester: number;
  cgpa: number;
  annualFamilyIncomeINR: number;
  attendancePercent: number;
  bankAccountNumber: string;
  bankIfsc: string;
  awardAmountINR: number;
  status: ScholarshipStatus;
  rejectionReason?: string;
  utrTransactionNumber?: string;
  disbursedAt?: string;
  committeeReviewDate?: string;
  createdAt: string;
}

export interface FinancialAidSummary {
  institutionId: string;
  totalSchemes: number;
  totalAllocatedBudgetINR: number;
  totalDisbursedAmountINR: number;
  totalBeneficiariesCount: number;
  pendingApplicationsCount: number;
  budgetUtilizationPercent: number;
}

// In-Memory Data Store
let schemesStore: ScholarshipScheme[] = [];
let applicationsStore: StudentScholarshipApplication[] = [];

export function getSchemes(institutionId: string): ScholarshipScheme[] {
  return schemesStore
    .filter(s => s.institutionId === institutionId)
    .map(s => ({ ...s }));
}

export function getApplications(institutionId: string): StudentScholarshipApplication[] {
  return applicationsStore
    .filter(a => a.institutionId === institutionId)
    .map(a => ({ ...a }));
}

export function registerScholarshipScheme(params: Omit<ScholarshipScheme, 'schemeId' | 'disbursedAmountINR'>): ScholarshipScheme {
  const newScheme: ScholarshipScheme = {
    ...params,
    schemeId: `SCH-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    disbursedAmountINR: 0
  };
  schemesStore.push(newScheme);
  return { ...newScheme };
}

export function applyForScholarship(params: {
  institutionId: string;
  schemeId: string;
  studentId: string;
  studentName: string;
  enrollmentNumber: string;
  department: string;
  semester: number;
  cgpa: number;
  annualFamilyIncomeINR: number;
  attendancePercent: number;
  bankAccountNumber: string;
  bankIfsc: string;
}): { success: boolean; application?: StudentScholarshipApplication; error?: string } {
  const scheme = schemesStore.find(s => s.schemeId === params.schemeId && s.institutionId === params.institutionId);
  if (!scheme) {
    return { success: false, error: 'SCHOLARSHIP_SCHEME_NOT_FOUND' };
  }

  // Duplicate Application Invariant
  const existing = applicationsStore.find(a =>
    a.institutionId === params.institutionId &&
    a.schemeId === params.schemeId &&
    a.studentId === params.studentId &&
    a.status !== 'REJECTED'
  );
  if (existing) {
    return { success: false, error: 'APPLICATION_ALREADY_EXISTS' };
  }

  // 1. Minimum CGPA Check
  if (params.cgpa < scheme.minCgpa) {
    return {
      success: false,
      error: `INELIGIBLE_CGPA: Requires CGPA >= ${scheme.minCgpa} (Current: ${params.cgpa})`
    };
  }

  // 2. Family Income Ceiling Check
  if (scheme.maxFamilyIncomeINR && params.annualFamilyIncomeINR > scheme.maxFamilyIncomeINR) {
    return {
      success: false,
      error: `INCOME_CEILING_EXCEEDED: Annual family income must be <= ₹${scheme.maxFamilyIncomeINR.toLocaleString('en-IN')}`
    };
  }

  // 3. Minimum Attendance Compliance
  if (params.attendancePercent < scheme.minAttendancePercent) {
    return {
      success: false,
      error: `ATTENDANCE_DEFICIT: Requires >= ${scheme.minAttendancePercent}% attendance (Current: ${params.attendancePercent}%)`
    };
  }

  const app: StudentScholarshipApplication = {
    id: `APP-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    institutionId: params.institutionId,
    schemeId: params.schemeId,
    studentId: params.studentId,
    studentName: params.studentName,
    enrollmentNumber: params.enrollmentNumber,
    department: params.department,
    semester: params.semester,
    cgpa: params.cgpa,
    annualFamilyIncomeINR: params.annualFamilyIncomeINR,
    attendancePercent: params.attendancePercent,
    bankAccountNumber: params.bankAccountNumber,
    bankIfsc: params.bankIfsc.toUpperCase(),
    awardAmountINR: scheme.awardAmountPerStudentINR,
    status: 'APPLIED',
    createdAt: new Date().toISOString()
  };

  applicationsStore.push(app);
  return { success: true, application: { ...app } };
}

export function updateApplicationStatus(
  applicationId: string,
  newStatus: ScholarshipStatus,
  options?: {
    rejectionReason?: string;
    utrNumber?: string;
  }
): { success: boolean; application?: StudentScholarshipApplication; error?: string } {
  const app = applicationsStore.find(a => a.id === applicationId);
  if (!app) return { success: false, error: 'APPLICATION_NOT_FOUND' };

  const scheme = schemesStore.find(s => s.schemeId === app.schemeId);

  if (newStatus === 'DISBURSED') {
    if (!options?.utrNumber) {
      return { success: false, error: 'UTR_TRANSACTION_NUMBER_REQUIRED' };
    }
    if (scheme) {
      // Check budget
      if (scheme.disbursedAmountINR + app.awardAmountINR > scheme.annualBudgetINR) {
        return { success: false, error: 'SCHEME_BUDGET_EXHAUSTED' };
      }
      scheme.disbursedAmountINR += app.awardAmountINR;
    }
    app.utrTransactionNumber = options.utrNumber;
    app.disbursedAt = new Date().toISOString();
  }

  if (newStatus === 'COMMITTEE_APPROVED') {
    app.committeeReviewDate = new Date().toISOString();
  }

  if (newStatus === 'REJECTED') {
    app.rejectionReason = options?.rejectionReason || 'Did not meet institutional priority standards';
  }

  app.status = newStatus;
  return { success: true, application: { ...app } };
}

export function computeFinancialAidSummary(institutionId: string): FinancialAidSummary {
  const schemes = getSchemes(institutionId);
  const apps = getApplications(institutionId);

  const totalBudget = schemes.reduce((sum, s) => sum + s.annualBudgetINR, 0);
  const totalDisbursed = apps
    .filter(a => a.status === 'DISBURSED')
    .reduce((sum, a) => sum + a.awardAmountINR, 0);
  const beneficiaries = apps.filter(a => a.status === 'DISBURSED').length;
  const pending = apps.filter(a => a.status === 'APPLIED' || a.status === 'DOCUMENTS_VERIFIED' || a.status === 'COMMITTEE_APPROVED').length;
  const utilization = totalBudget > 0 ? Math.round((totalDisbursed / totalBudget) * 100) : 0;

  return {
    institutionId,
    totalSchemes: schemes.length,
    totalAllocatedBudgetINR: totalBudget,
    totalDisbursedAmountINR: totalDisbursed,
    totalBeneficiariesCount: beneficiaries,
    pendingApplicationsCount: pending,
    budgetUtilizationPercent: Math.min(100, utilization)
  };
}

export function exportScholarshipLedgerCSV(institutionId: string): string {
  const apps = getApplications(institutionId);
  const schemes = getSchemes(institutionId);
  const schemeMap = new Map(schemes.map(s => [s.schemeId, s]));

  const lines: string[] = [];
  lines.push('=== NAAC CRITERION 5.1: STUDENT FINANCIAL AID & SCHOLARSHIP AUDIT ===');
  lines.push('Application_ID,Student_Name,Enrollment_No,Department,Scheme_Name,Scheme_Type,CGPA,Family_Income_INR,Award_Amount_INR,Status,UTR_Number,Disbursed_Date');

  for (const a of apps) {
    const s = schemeMap.get(a.schemeId);
    lines.push(
      `"${a.id}","${a.studentName}","${a.enrollmentNumber}","${a.department}","${s?.name || 'N/A'}","${s?.type || 'N/A'}",${a.cgpa},${a.annualFamilyIncomeINR},${a.awardAmountINR},"${a.status}","${a.utrTransactionNumber || 'PENDING'}","${a.disbursedAt || 'N/A'}"`
    );
  }

  return lines.join('\n');
}

export function seedScholarshipData(institutionId: string): void {
  schemesStore = [
    {
      schemeId: 'SCH-01',
      institutionId,
      name: 'Dr. APJ Abdul Kalam STEM Merit Fellowship',
      type: 'INSTITUTIONAL_FREESHIP',
      fundingBody: 'University Corpus Fund',
      annualBudgetINR: 2000000,
      disbursedAmountINR: 50000,
      awardAmountPerStudentINR: 50000,
      minCgpa: 8.5,
      maxFamilyIncomeINR: 800000,
      minAttendancePercent: 80,
      activeAcademicYear: '2025-2026'
    },
    {
      schemeId: 'SCH-02',
      institutionId,
      name: 'Merit-cum-Means Economic Upliftment Grant',
      type: 'MERIT_CUM_MEANS',
      fundingBody: 'Alumni Endowment Trust',
      annualBudgetINR: 1500000,
      disbursedAmountINR: 0,
      awardAmountPerStudentINR: 35000,
      minCgpa: 7.0,
      maxFamilyIncomeINR: 400000,
      minAttendancePercent: 75,
      activeAcademicYear: '2025-2026'
    }
  ];

  applicationsStore = [
    {
      id: 'APP-1001',
      institutionId,
      schemeId: 'SCH-01',
      studentId: 'STU-1001',
      studentName: 'Aarav Sharma',
      enrollmentNumber: 'ENG-2023-014',
      department: 'Computer Science & Engineering',
      semester: 6,
      cgpa: 9.1,
      annualFamilyIncomeINR: 450000,
      attendancePercent: 92,
      bankAccountNumber: '91823091820',
      bankIfsc: 'HDFC0001092',
      awardAmountINR: 50000,
      status: 'DISBURSED',
      utrTransactionNumber: 'UTR-2026-981249018',
      disbursedAt: '2026-03-15T11:00:00Z',
      committeeReviewDate: '2026-03-01T10:00:00Z',
      createdAt: '2026-02-15T09:00:00Z'
    }
  ];
}

export function resetScholarshipStore(): void {
  schemesStore = [];
  applicationsStore = [];
}
