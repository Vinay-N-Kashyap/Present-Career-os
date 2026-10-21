/**
 * Institutional Industry MoUs & Corporate Internship Governance Engine (TASK-891)
 * 
 * Provides:
 * 1. Industry Memorandum of Understanding (MoU) lifecycle management & compliance tracking.
 * 2. Corporate partnership tiering (STRATEGIC_GLOBAL, TIER_1_ENTERPRISE, RESEARCH_CONSORTIUM, REGIONAL_STARTUP).
 * 3. Internship quota enforcement (committed seats, filled seats, average stipend, PPO conversion rate).
 * 4. Collaborative research labs, guest lecture hours, and curriculum advisory board tracking.
 * 5. Strict multi-tenant isolation and NAAC Criterion 3.5 & NBA Criterion 10 CSV export.
 */

export type PartnershipTier = 
  | 'STRATEGIC_GLOBAL'
  | 'TIER_1_ENTERPRISE'
  | 'RESEARCH_CONSORTIUM'
  | 'REGIONAL_STARTUP';

export type MoUStatus = 'ACTIVE' | 'PENDING_RENEWAL' | 'EXPIRED' | 'TERMINATED';

export interface IndustryMoURecord {
  mouId: string;
  institutionId: string;
  partnerCompanyName: string;
  partnerIndustry: string; // e.g. "Cloud & AI", "Fintech", "Semiconductor"
  partnershipTier: PartnershipTier;
  signedDate: string; // ISO date
  expiryDate: string; // ISO date
  status: MoUStatus;
  primaryContactPerson: string;
  contactEmail: string;
  // Key deliverables under MoU
  committedInternshipsPerYear: number;
  filledInternshipsCount: number;
  averageStipendPerMonth: number; // in USD or INR
  ppoConversionRatePercentage: number; // Pre-Placement Offers
  jointLabEstablished: boolean;
  jointLabName?: string;
  curriculumAdvisoryParticipation: boolean;
}

export interface InternshipAllocation {
  allocationId: string;
  institutionId: string;
  mouId: string;
  partnerCompanyName: string;
  studentId: string;
  studentName: string;
  department: string;
  stipendAmount: number;
  startDate: string;
  endDate: string;
  ppoReceived: boolean;
}

export class IndustryMoUStore {
  private mous: Map<string, IndustryMoURecord> = new Map();
  private allocations: Map<string, InternshipAllocation[]> = new Map();

  /**
   * Register or renew an Industry MoU
   */
  public registerMoU(record: IndustryMoURecord): IndustryMoURecord {
    if (!record.institutionId || !record.partnerCompanyName || !record.mouId) {
      throw new Error('INVALID_MOU_PAYLOAD');
    }

    if (record.committedInternshipsPerYear < 0 || record.filledInternshipsCount < 0) {
      throw new Error('INTERNSHIP_COUNTS_NON_NEGATIVE');
    }

    // Auto-compute status based on expiry date
    const now = Date.now();
    const expiry = new Date(record.expiryDate).getTime();
    const daysRemaining = (expiry - now) / (1000 * 60 * 60 * 24);

    let status = record.status;
    if (daysRemaining < 0) {
      status = 'EXPIRED';
    } else if (daysRemaining <= 60 && status === 'ACTIVE') {
      status = 'PENDING_RENEWAL';
    }

    const saved: IndustryMoURecord = {
      ...record,
      status,
    };

    this.mous.set(record.mouId, saved);
    return saved;
  }

  /**
   * Allocate a verified student to an approved corporate internship under MoU
   */
  public allocateInternship(params: {
    institutionId: string;
    mouId: string;
    studentId: string;
    studentName: string;
    department: string;
    stipendAmount: number;
    startDate: string;
    endDate: string;
    ppoReceived?: boolean;
  }): InternshipAllocation {
    const mou = this.mous.get(params.mouId);
    if (!mou || mou.institutionId !== params.institutionId) {
      throw new Error('MOU_NOT_FOUND_OR_TENANT_MISMATCH');
    }

    if (mou.status === 'EXPIRED' || mou.status === 'TERMINATED') {
      throw new Error('MOU_NOT_ACTIVE');
    }

    const allocationId = `alc-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const allocation: InternshipAllocation = {
      allocationId,
      institutionId: params.institutionId,
      mouId: params.mouId,
      partnerCompanyName: mou.partnerCompanyName,
      studentId: params.studentId,
      studentName: params.studentName,
      department: params.department,
      stipendAmount: params.stipendAmount,
      startDate: params.startDate,
      endDate: params.endDate,
      ppoReceived: params.ppoReceived || false,
    };

    // Increment filled count
    mou.filledInternshipsCount++;
    this.mous.set(mou.mouId, mou);

    const list = this.allocations.get(params.mouId) || [];
    list.push(allocation);
    this.allocations.set(params.mouId, list);

    return allocation;
  }

  /**
   * Query MoUs strictly isolated by institutionId
   */
  public getMoUsByInstitution(
    institutionId: string,
    filter?: { tier?: PartnershipTier; status?: MoUStatus }
  ): IndustryMoURecord[] {
    const results: IndustryMoURecord[] = [];

    for (const mou of this.mous.values()) {
      if (mou.institutionId !== institutionId) continue;
      if (filter?.tier && mou.partnershipTier !== filter.tier) continue;
      if (filter?.status && mou.status !== filter.status) continue;
      results.push({ ...mou });
    }

    return results.sort((a, b) => new Date(b.signedDate).getTime() - new Date(a.signedDate).getTime());
  }

  /**
   * Query allocations for an institution
   */
  public getAllocationsByInstitution(institutionId: string): InternshipAllocation[] {
    const results: InternshipAllocation[] = [];
    for (const list of this.allocations.values()) {
      for (const item of list) {
        if (item.institutionId === institutionId) {
          results.push({ ...item });
        }
      }
    }
    return results;
  }

  /**
   * Clear store for test isolation
   */
  public clear(): void {
    this.mous.clear();
    this.allocations.clear();
  }
}

export const industryMoUStore = new IndustryMoUStore();

/**
 * Standard NAAC Criterion 3.5 & NBA Criterion 10 Collaboration Audit CSV Export
 */
export function exportIndustryMoUCSV(mous: IndustryMoURecord[]): string {
  const headers = [
    'MoU_ID',
    'Institution_ID',
    'Partner_Company',
    'Industry_Domain',
    'Tier',
    'Signed_Date',
    'Expiry_Date',
    'Status',
    'Committed_Seats',
    'Filled_Seats',
    'Avg_Stipend',
    'PPO_Conversion_Pct',
    'Joint_Lab',
    'Curriculum_Board',
  ];

  const rows = mous.map(m => [
    `"${m.mouId}"`,
    `"${m.institutionId}"`,
    `"${m.partnerCompanyName}"`,
    `"${m.partnerIndustry}"`,
    `"${m.partnershipTier}"`,
    `"${m.signedDate.split('T')[0]}"`,
    `"${m.expiryDate.split('T')[0]}"`,
    `"${m.status}"`,
    m.committedInternshipsPerYear,
    m.filledInternshipsCount,
    m.averageStipendPerMonth,
    m.ppoConversionRatePercentage,
    m.jointLabEstablished ? 'YES' : 'NO',
    m.curriculumAdvisoryParticipation ? 'YES' : 'NO',
  ]);

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}
