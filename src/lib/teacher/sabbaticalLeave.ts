/**
 * Faculty Sabbatical, Academic Deputation & Research Leave Engine (TASK-913)
 * 
 * Provides:
 * 1. Statutory UGC/AICTE sabbatical leave governance (6-year continuous service rule, 1-year max per cycle).
 * 2. Academic deputations to premier institutes (IITs, IISc, CSIR, International Universities) with lien preservation.
 * 3. 5-Stage governance lifecycle (REQUESTED -> HOD_RECOMMENDED -> COMMITTEE_APPROVED -> SANCTIONED -> COMPLETED).
 * 4. Post-sabbatical outcome reporting (Monographs, Books, Patents, Visiting Research Collaborations).
 * 5. Statutory academic leave registry CSV export for institutional accreditation.
 */

export type LeaveType = 'SABBATICAL_RESEARCH' | 'ACADEMIC_DEPUTATION' | 'POSTDOC_FELLOWSHIP' | 'STUDY_LEAVE';
export type LeaveStatus = 'REQUESTED' | 'HOD_RECOMMENDED' | 'COMMITTEE_APPROVED' | 'SANCTIONED' | 'REJECTED' | 'COMPLETED_REPORT_SUBMITTED';

export interface SabbaticalApplication {
  id: string;
  institutionId: string;
  facultyId: string;
  facultyName: string;
  department: string;
  currentDesignation: string;
  yearsOfContinuousService: number; // Invariant: Must be >= 6 for Sabbatical
  leaveType: LeaveType;
  hostInstitution: string; // e.g. "MIT CSAIL" or "IISc Bangalore"
  hostCountry: string;
  researchPlanTitle: string;
  startDate: string;
  endDate: string;
  durationMonths: number; // Max 12 months
  salarySupportPercent: number; // 100% full pay or lien unpaid
  status: LeaveStatus;
  hodRecommendationDate?: string;
  hodNotes?: string;
  sanctionOrderNumber?: string;
  sanctionedDate?: string;
  completionReportAbstract?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveGovernanceSummary {
  institutionId: string;
  totalApplications: number;
  activeFacultyOnSabbatical: number;
  totalDeputations: number;
  pendingApprovalsCount: number;
}

// In-Memory Data Store
let sabbaticalStore: SabbaticalApplication[] = [];

export function getSabbaticalApplications(institutionId: string): SabbaticalApplication[] {
  return sabbaticalStore
    .filter(s => s.institutionId === institutionId)
    .map(s => ({ ...s }));
}

export function requestSabbaticalLeave(params: {
  institutionId: string;
  facultyId: string;
  facultyName: string;
  department: string;
  currentDesignation: string;
  yearsOfContinuousService: number;
  leaveType: LeaveType;
  hostInstitution: string;
  hostCountry: string;
  researchPlanTitle: string;
  startDate: string;
  endDate: string;
  durationMonths: number;
}): { success: boolean; application?: SabbaticalApplication; error?: string } {
  // 1. UGC Sabbatical Continuous Service Invariant (>= 6 Years)
  if (params.leaveType === 'SABBATICAL_RESEARCH' && params.yearsOfContinuousService < 6) {
    return {
      success: false,
      error: `UGC_SERVICE_RULE_VIOLATION: Sabbatical leave requires at least 6 years of continuous active service (Current: ${params.yearsOfContinuousService} years)`
    };
  }

  // 2. Maximum Duration Invariant (<= 12 Months per cycle)
  if (params.durationMonths > 12) {
    return {
      success: false,
      error: 'DURATION_LIMIT_EXCEEDED: Maximum sabbatical duration is 12 continuous months per cycle'
    };
  }

  // 3. Duplicate Active Leave Invariant
  const existing = sabbaticalStore.find(s =>
    s.institutionId === params.institutionId &&
    s.facultyId === params.facultyId &&
    (s.status === 'SANCTIONED' || s.status === 'HOD_RECOMMENDED' || s.status === 'COMMITTEE_APPROVED')
  );
  if (existing) {
    return {
      success: false,
      error: 'ACTIVE_LEAVE_ALREADY_EXISTS: Faculty currently has an ongoing or active sabbatical request'
    };
  }

  const newApp: SabbaticalApplication = {
    id: `SAB-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    institutionId: params.institutionId,
    facultyId: params.facultyId,
    facultyName: params.facultyName,
    department: params.department,
    currentDesignation: params.currentDesignation,
    yearsOfContinuousService: params.yearsOfContinuousService,
    leaveType: params.leaveType,
    hostInstitution: params.hostInstitution,
    hostCountry: params.hostCountry,
    researchPlanTitle: params.researchPlanTitle,
    startDate: params.startDate,
    endDate: params.endDate,
    durationMonths: params.durationMonths,
    salarySupportPercent: params.leaveType === 'SABBATICAL_RESEARCH' ? 100 : 0,
    status: 'REQUESTED',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  sabbaticalStore.push(newApp);
  return { success: true, application: { ...newApp } };
}

export function updateSabbaticalStatus(
  applicationId: string,
  newStatus: LeaveStatus,
  options?: {
    notes?: string;
    sanctionOrder?: string;
    reportAbstract?: string;
  }
): { success: boolean; application?: SabbaticalApplication; error?: string } {
  const app = sabbaticalStore.find(s => s.id === applicationId);
  if (!app) return { success: false, error: 'APPLICATION_NOT_FOUND' };

  app.status = newStatus;
  app.updatedAt = new Date().toISOString();

  if (newStatus === 'HOD_RECOMMENDED') {
    app.hodRecommendationDate = new Date().toISOString();
    app.hodNotes = options?.notes || 'Recommended without reservation.';
  } else if (newStatus === 'SANCTIONED') {
    app.sanctionedDate = new Date().toISOString();
    app.sanctionOrderNumber = options?.sanctionOrder || `ORD-UGC-${Math.floor(10000 + Math.random() * 90000)}`;
  } else if (newStatus === 'COMPLETED_REPORT_SUBMITTED') {
    app.completionReportAbstract = options?.reportAbstract || 'Sabbatical research project completed successfully.';
  }

  return { success: true, application: { ...app } };
}

export function computeLeaveSummary(institutionId: string): LeaveGovernanceSummary {
  const apps = getSabbaticalApplications(institutionId);

  const activeSabbaticals = apps.filter(a => a.status === 'SANCTIONED' && a.leaveType === 'SABBATICAL_RESEARCH').length;
  const deputations = apps.filter(a => a.leaveType === 'ACADEMIC_DEPUTATION').length;
  const pending = apps.filter(a => a.status === 'REQUESTED' || a.status === 'HOD_RECOMMENDED' || a.status === 'COMMITTEE_APPROVED').length;

  return {
    institutionId,
    totalApplications: apps.length,
    activeFacultyOnSabbatical: activeSabbaticals,
    totalDeputations: deputations,
    pendingApprovalsCount: pending
  };
}

export function exportSabbaticalLeaveCSV(institutionId: string): string {
  const apps = getSabbaticalApplications(institutionId);

  const lines: string[] = [];
  lines.push('=== UGC/AICTE FACULTY SABBATICAL & DEPUTATION LEAVE AUDIT ===');
  lines.push('Leave_ID,Faculty_Name,Department,Designation,Years_Service,Leave_Type,Host_Institution,Country,Duration_Months,Status,Sanction_Order,Start_Date,End_Date');

  for (const a of apps) {
    lines.push(
      `"${a.id}","${a.facultyName}","${a.department}","${a.currentDesignation}",${a.yearsOfContinuousService},"${a.leaveType}","${a.hostInstitution}","${a.hostCountry}",${a.durationMonths},"${a.status}","${a.sanctionOrderNumber || 'PENDING'}","${a.startDate}","${a.endDate}"`
    );
  }

  return lines.join('\n');
}

export function seedSabbaticalData(institutionId: string): void {
  sabbaticalStore = [
    {
      id: 'SAB-101',
      institutionId,
      facultyId: 'FAC-CSE-001',
      facultyName: 'Dr. Aris Thorne',
      department: 'Computer Science & Engineering',
      currentDesignation: 'Associate Professor',
      yearsOfContinuousService: 7,
      leaveType: 'SABBATICAL_RESEARCH',
      hostInstitution: 'Max Planck Institute for Informatics',
      hostCountry: 'Germany',
      researchPlanTitle: 'Formal Verification of Byzantine Consensus under Asynchronous Network Partitions',
      startDate: '2026-06-01',
      endDate: '2027-05-31',
      durationMonths: 12,
      salarySupportPercent: 100,
      status: 'SANCTIONED',
      sanctionOrderNumber: 'ORD-UGC-98214',
      sanctionedDate: '2026-03-20T10:00:00Z',
      hodRecommendationDate: '2026-03-10T11:00:00Z',
      hodNotes: 'Strong research synergy with European labs; substitute faculty arranged.',
      createdAt: '2026-02-15T09:00:00Z',
      updatedAt: '2026-03-20T10:00:00Z'
    }
  ];
}

export function resetSabbaticalStore(): void {
  sabbaticalStore = [];
}
