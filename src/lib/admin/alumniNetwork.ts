/**
 * Institutional Alumni Mentorship & Endowment Network Engine (TASK-888)
 * 
 * Implements:
 * 1. Verified Alumni Directory with career progression tracking (Company, Role, Graduation Year).
 * 2. Intelligent Mentorship Matching Algorithm based on domain expertise and mentee capacity.
 * 3. Cryptographic Endowment & Donation Ledger with SHA-256 tax exemption receipt hashing.
 * 4. PII privacy protection barriers for public directories.
 * 5. Strict multi-tenant institutional isolation and CSV reporting.
 */

import { createHash } from 'crypto';

export type EndowmentDesignation = 
  | 'SCHOLARSHIP_ENDOWMENT'
  | 'RESEARCH_LAB_INFRASTRUCTURE'
  | 'CAMPUS_SPORTS_AND_CULTURE'
  | 'UNRESTRICTED';

export type MentorshipStatus = 'REQUESTED' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

export interface AlumniProfile {
  alumniId: string;
  institutionId: string;
  name: string;
  graduationYear: number;
  degree: string;
  department: string;
  currentCompany: string;
  currentRole: string;
  industry: string;
  location: string;
  willingToMentor: boolean;
  mentorshipDomains: string[];
  activeMenteeCount: number;
  maxMentees: number;
  email: string;
  isPrivacyProtected: boolean; // if true, email is redacted in student/public views
}

export interface MentorshipSession {
  sessionId: string;
  institutionId: string;
  alumniId: string;
  studentId: string;
  studentName: string;
  sessionTopic: string;
  scheduledAt: string; // ISO date
  status: MentorshipStatus;
  meetingLink?: string;
  feedbackRating?: number; // 1 to 5 scale
}

export interface EndowmentContribution {
  giftId: string;
  institutionId: string;
  alumniId: string;
  alumniName: string;
  amount: number;
  designation: EndowmentDesignation;
  contributionDate: string; // ISO date
  receiptHash: string; // SHA-256
}

export class AlumniNetworkStore {
  private alumni: Map<string, AlumniProfile> = new Map();
  private sessions: Map<string, MentorshipSession> = new Map();
  private endowments: Map<string, EndowmentContribution> = new Map();

  /**
   * Register or update an alumnus profile
   */
  public registerAlumni(profile: AlumniProfile): AlumniProfile {
    if (!profile.institutionId || !profile.alumniId || !profile.name) {
      throw new Error('INVALID_ALUMNI_PROFILE');
    }
    this.alumni.set(profile.alumniId, { ...profile });
    return profile;
  }

  /**
   * Match available mentors based on department or target domain
   */
  public findMentors(params: {
    institutionId: string;
    department?: string;
    domain?: string;
    limit?: number;
  }): AlumniProfile[] {
    const results: { profile: AlumniProfile; score: number }[] = [];

    for (const a of this.alumni.values()) {
      if (a.institutionId !== params.institutionId) continue;
      if (!a.willingToMentor) continue;
      if (a.activeMenteeCount >= a.maxMentees) continue;

      let score = 10;
      if (params.department && a.department.toLowerCase() === params.department.toLowerCase()) {
        score += 20;
      }
      if (params.domain) {
        const matches = a.mentorshipDomains.some(d => d.toLowerCase().includes(params.domain!.toLowerCase()));
        if (!matches) continue;
        score += 30;
      }

      // Safe clone with privacy protection if enabled
      const safeProfile: AlumniProfile = {
        ...a,
        email: a.isPrivacyProtected ? 'alumni.relay@institution.edu (Protected)' : a.email,
      };

      results.push({ profile: safeProfile, score });
    }

    results.sort((a, b) => b.score - a.score);
    const limit = params.limit || 20;
    return results.slice(0, limit).map(r => r.profile);
  }

  /**
   * Schedule a new student-alumni mentorship session
   */
  public bookMentorshipSession(params: {
    institutionId: string;
    alumniId: string;
    studentId: string;
    studentName: string;
    sessionTopic: string;
    scheduledAt: string;
  }): MentorshipSession {
    const alumni = this.alumni.get(params.alumniId);
    if (!alumni || alumni.institutionId !== params.institutionId) {
      throw new Error('ALUMNI_NOT_FOUND_OR_TENANT_MISMATCH');
    }

    if (alumni.activeMenteeCount >= alumni.maxMentees) {
      throw new Error('ALUMNI_CAPACITY_EXCEEDED');
    }

    const sessionId = `ses-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const session: MentorshipSession = {
      sessionId,
      institutionId: params.institutionId,
      alumniId: params.alumniId,
      studentId: params.studentId,
      studentName: params.studentName,
      sessionTopic: params.sessionTopic,
      scheduledAt: params.scheduledAt,
      status: 'SCHEDULED',
      meetingLink: `https://meet.career-os.internal/alumni/${sessionId}`,
    };

    alumni.activeMenteeCount++;
    this.alumni.set(alumni.alumniId, alumni);
    this.sessions.set(sessionId, session);

    return session;
  }

  /**
   * Record a financial endowment gift with SHA-256 tax receipt hash
   */
  public recordEndowment(params: {
    institutionId: string;
    alumniId: string;
    alumniName: string;
    amount: number;
    designation: EndowmentDesignation;
  }): EndowmentContribution {
    if (params.amount <= 0) {
      throw new Error('CONTRIBUTION_AMOUNT_POSITIVE');
    }

    const giftId = `gft-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const now = new Date().toISOString();

    const receiptHash = createHash('sha256')
      .update(`${params.institutionId}:${giftId}:${params.amount}:${now}`)
      .digest('hex');

    const contribution: EndowmentContribution = {
      giftId,
      institutionId: params.institutionId,
      alumniId: params.alumniId,
      alumniName: params.alumniName,
      amount: params.amount,
      designation: params.designation,
      contributionDate: now,
      receiptHash,
    };

    this.endowments.set(giftId, contribution);
    return contribution;
  }

  /**
   * Query alumni directory strictly by institution
   */
  public getAlumniByInstitution(institutionId: string): AlumniProfile[] {
    const list: AlumniProfile[] = [];
    for (const a of this.alumni.values()) {
      if (a.institutionId === institutionId) {
        list.push({
          ...a,
          email: a.isPrivacyProtected ? 'alumni.relay@institution.edu (Protected)' : a.email,
        });
      }
    }
    return list;
  }

  /**
   * Query endowments strictly by institution
   */
  public getEndowmentsByInstitution(institutionId: string): EndowmentContribution[] {
    const list: EndowmentContribution[] = [];
    for (const e of this.endowments.values()) {
      if (e.institutionId === institutionId) {
        list.push({ ...e });
      }
    }
    return list.sort((a, b) => new Date(b.contributionDate).getTime() - new Date(a.contributionDate).getTime());
  }

  /**
   * Clear store for tests
   */
  public clear(): void {
    this.alumni.clear();
    this.sessions.clear();
    this.endowments.clear();
  }
}

export const alumniNetworkStore = new AlumniNetworkStore();

/**
 * Standard Alumni Network Directory CSV Export
 */
export function exportAlumniDirectoryCSV(profiles: AlumniProfile[]): string {
  const headers = [
    'Alumni_ID',
    'Institution_ID',
    'Name',
    'Graduation_Year',
    'Degree',
    'Department',
    'Company',
    'Role',
    'Industry',
    'Mentorship_Available',
    'Active_Mentees',
  ];

  const rows = profiles.map(p => [
    `"${p.alumniId}"`,
    `"${p.institutionId}"`,
    `"${p.name}"`,
    p.graduationYear,
    `"${p.degree}"`,
    `"${p.department}"`,
    `"${p.currentCompany}"`,
    `"${p.currentRole}"`,
    `"${p.industry}"`,
    p.willingToMentor ? 'YES' : 'NO',
    p.activeMenteeCount,
  ]);

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}

/**
 * Standard Endowment Contributions CSV Export
 */
export function exportEndowmentLedgerCSV(endowments: EndowmentContribution[]): string {
  const headers = [
    'Gift_ID',
    'Institution_ID',
    'Alumni_ID',
    'Alumni_Name',
    'Amount',
    'Designation',
    'Contribution_Date',
    'Receipt_Hash_SHA256',
  ];

  const rows = endowments.map(e => [
    `"${e.giftId}"`,
    `"${e.institutionId}"`,
    `"${e.alumniId}"`,
    `"${e.alumniName}"`,
    e.amount,
    `"${e.designation}"`,
    `"${e.contributionDate.split('T')[0]}"`,
    `"${e.receiptHash}"`,
  ]);

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}
