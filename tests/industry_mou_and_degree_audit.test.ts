/**
 * Industry MoUs & Academic Degree Audit Verification Suite (TASK-895)
 * 
 * Verifies:
 * 1. Industry MoU lifecycle, renewal status calculation, and internship allocation invariants.
 * 2. NAAC Criterion 3.5 & NBA Criterion 10 corporate collaboration CSV export.
 * 3. 160-credit degree requirements, active backlogs, honors classification, and administrative holds.
 * 4. Cryptographic SHA-256 Dean Degree Clearance Digest integrity.
 * 5. Strict multi-tenant isolation and convocation graduation roster CSV export.
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  industryMoUStore,
  exportIndustryMoUCSV,
  IndustryMoURecord,
} from '../src/lib/admin/industryMOU.js';
import {
  degreeAuditStore,
  auditStudentDegree,
  exportConvocationRosterCSV,
  DEFAULT_BTECH_RULES,
  StudentTranscript,
} from '../src/lib/admin/degreeAudit.js';

describe('TASK-895: Industry MoUs & Academic Degree Audit Suite', () => {
  beforeEach(() => {
    industryMoUStore.clear();
    degreeAuditStore.clear();
  });

  const MOCK_MOU: IndustryMoURecord = {
    mouId: 'mou-cisco-01',
    institutionId: 'inst-apex-001',
    partnerCompanyName: 'Cisco Systems Inc',
    partnerIndustry: 'Networking & Cybersecurity',
    partnershipTier: 'STRATEGIC_GLOBAL',
    signedDate: '2025-01-01T00:00:00Z',
    expiryDate: '2028-01-01T00:00:00Z',
    status: 'ACTIVE',
    primaryContactPerson: 'Vikram Joshi',
    contactEmail: 'vjoshi@cisco.com',
    committedInternshipsPerYear: 20,
    filledInternshipsCount: 10,
    averageStipendPerMonth: 50000,
    ppoConversionRatePercentage: 80.0,
    jointLabEstablished: true,
    jointLabName: 'Apex Cisco IoT & Routing Lab',
    curriculumAdvisoryParticipation: true,
  };

  it('manages Industry MoU lifecycle, renewal status, and student allocation', () => {
    // 1. Register MoU
    const registered = industryMoUStore.registerMoU(MOCK_MOU);
    assert.strictEqual(registered.partnerCompanyName, 'Cisco Systems Inc');
    assert.strictEqual(registered.status, 'ACTIVE');

    // 2. Allocate student
    const alloc = industryMoUStore.allocateInternship({
      institutionId: 'inst-apex-001',
      mouId: 'mou-cisco-01',
      studentId: 'CS2026-050',
      studentName: 'Sanjay Kumar',
      department: 'Computer Science',
      stipendAmount: 50000,
      startDate: '2026-06-01',
      endDate: '2026-08-31',
    });

    assert.strictEqual(alloc.partnerCompanyName, 'Cisco Systems Inc');
    assert.strictEqual(alloc.studentName, 'Sanjay Kumar');

    // Allocation should increment filled count
    const updatedMoU = industryMoUStore.getMoUsByInstitution('inst-apex-001')[0];
    assert.strictEqual(updatedMoU.filledInternshipsCount, 11);

    // 3. Expiry status auto-calculation
    const expiredMoU = industryMoUStore.registerMoU({
      ...MOCK_MOU,
      mouId: 'mou-old-02',
      expiryDate: '2023-01-01T00:00:00Z', // in past
    });
    assert.strictEqual(expiredMoU.status, 'EXPIRED');

    // Allocation to expired MoU must fail
    assert.throws(() => {
      industryMoUStore.allocateInternship({
        institutionId: 'inst-apex-001',
        mouId: 'mou-old-02',
        studentId: 'CS2026-051',
        studentName: 'Priya N',
        department: 'CSE',
        stipendAmount: 40000,
        startDate: '2026-06-01',
        endDate: '2026-08-31',
      });
    }, /MOU_NOT_ACTIVE/);
  });

  it('exports valid NAAC Criterion 3.5 collaboration CSV reports', () => {
    industryMoUStore.registerMoU(MOCK_MOU);
    const list = industryMoUStore.getMoUsByInstitution('inst-apex-001');
    const csv = exportIndustryMoUCSV(list);

    assert.ok(csv.includes('MoU_ID,Institution_ID,Partner_Company,Industry_Domain,Tier'));
    assert.ok(csv.includes('"mou-cisco-01","inst-apex-001","Cisco Systems Inc"'));
    assert.ok(csv.includes('STRATEGIC_GLOBAL'));
  });

  it('evaluates graduation eligibility, credit requirements, and honors classifications', () => {
    // 1. Cleared for Graduation with Distinction
    const topStudent: StudentTranscript = {
      studentId: 'CS2026-001',
      institutionId: 'inst-apex-001',
      studentName: 'Aarav Patel',
      degreeName: 'B.Tech CSE',
      department: 'Computer Science',
      admissionYear: 2022,
      expectedGraduationYear: 2026,
      coreCreditsEarned: 104,
      electiveCreditsEarned: 42,
      capstoneCreditsEarned: 20, // Total 166 >= 160
      cgpa: 9.15,
      activeBacklogsCount: 0,
      pendingFeeDues: 0,
      disciplinaryHold: false,
    };

    const topAudit = auditStudentDegree(topStudent, DEFAULT_BTECH_RULES);
    assert.strictEqual(topAudit.status, 'CLEARED_FOR_GRADUATION');
    assert.strictEqual(topAudit.honors, 'FIRST_CLASS_WITH_DISTINCTION');
    assert.strictEqual(topAudit.deanCleared, true);
    assert.strictEqual(topAudit.unmetRequirements.length, 0);

    // 2. Credit Deficit Student
    const deficitStudent: StudentTranscript = {
      ...topStudent,
      studentId: 'CS2026-002',
      studentName: 'Deficit Candidate',
      coreCreditsEarned: 90, // Deficit! (needs 100)
      electiveCreditsEarned: 35,
      capstoneCreditsEarned: 15, // Total 140 < 160
    };

    const deficitAudit = auditStudentDegree(deficitStudent, DEFAULT_BTECH_RULES);
    assert.strictEqual(deficitAudit.status, 'DEFICIT_CREDITS');
    assert.strictEqual(deficitAudit.honors, 'NOT_QUALIFIED');
    assert.strictEqual(deficitAudit.deanCleared, false);
    assert.ok(deficitAudit.unmetRequirements.some(r => r.includes('Credit Deficit')));

    // 3. Active Backlog Student
    const backlogStudent: StudentTranscript = {
      ...topStudent,
      studentId: 'CS2026-003',
      activeBacklogsCount: 2,
    };
    const backlogAudit = auditStudentDegree(backlogStudent, DEFAULT_BTECH_RULES);
    assert.strictEqual(backlogAudit.status, 'ACTIVE_BACKLOGS');
    assert.strictEqual(backlogAudit.deanCleared, false);

    // 4. Financial Hold Student
    const holdStudent: StudentTranscript = {
      ...topStudent,
      studentId: 'CS2026-004',
      pendingFeeDues: 12000,
    };
    const holdAudit = auditStudentDegree(holdStudent, DEFAULT_BTECH_RULES);
    assert.strictEqual(holdAudit.status, 'FINANCIAL_HOLD');
    assert.strictEqual(holdAudit.deanCleared, false);

    // 5. Disciplinary Hold Student
    const discStudent: StudentTranscript = {
      ...topStudent,
      studentId: 'CS2026-005',
      disciplinaryHold: true,
    };
    const discAudit = auditStudentDegree(discStudent, DEFAULT_BTECH_RULES);
    assert.strictEqual(discAudit.status, 'DISCIPLINARY_HOLD');
    assert.strictEqual(discAudit.deanCleared, false);

    // 6. Out-of-bounds CGPA error
    assert.throws(() => {
      auditStudentDegree({
        ...topStudent,
        cgpa: 11.5,
      });
    }, /CGPA_OUT_OF_BOUNDS/);
  });

  it('generates cryptographic SHA-256 audit hashes and supports Dean sign-off override', () => {
    const student: StudentTranscript = {
      studentId: 'IT2026-099',
      institutionId: 'inst-apex-001',
      studentName: 'Kunal Sen',
      degreeName: 'B.Tech IT',
      department: 'Information Technology',
      admissionYear: 2022,
      expectedGraduationYear: 2026,
      coreCreditsEarned: 100,
      electiveCreditsEarned: 40,
      capstoneCreditsEarned: 20,
      cgpa: 8.2,
      activeBacklogsCount: 0,
      pendingFeeDues: 5000, // on hold
      disciplinaryHold: false,
    };

    const initialAudit = degreeAuditStore.recordAudit(student);
    assert.strictEqual(initialAudit.status, 'FINANCIAL_HOLD');
    assert.strictEqual(initialAudit.deanCleared, false);
    assert.strictEqual(initialAudit.cryptographicAuditHash.length, 64); // Valid SHA-256

    // Dean clearance override once fee is cleared
    const cleared = degreeAuditStore.overrideDeanClearance({
      studentId: 'IT2026-099',
      institutionId: 'inst-apex-001',
      deanName: 'Prof. R. Venkatraman',
    });

    assert.strictEqual(cleared.status, 'CLEARED_FOR_GRADUATION');
    assert.strictEqual(cleared.deanCleared, true);
    assert.strictEqual(cleared.deanApprovedBy, 'Prof. R. Venkatraman');
    assert.strictEqual(cleared.cryptographicAuditHash.length, 64);
  });

  it('enforces multi-tenant isolation across Industry MoUs and Convocation audits', () => {
    // Register in Tenant 1
    industryMoUStore.registerMoU(MOCK_MOU);
    degreeAuditStore.recordAudit({
      studentId: 'CS2026-001',
      institutionId: 'inst-apex-001',
      studentName: 'Aarav Patel',
      degreeName: 'B.Tech CSE',
      department: 'Computer Science',
      admissionYear: 2022,
      expectedGraduationYear: 2026,
      coreCreditsEarned: 104,
      electiveCreditsEarned: 42,
      capstoneCreditsEarned: 20,
      cgpa: 9.24,
      activeBacklogsCount: 0,
      pendingFeeDues: 0,
      disciplinaryHold: false,
    });

    // Query Tenant 2
    const t2MoUs = industryMoUStore.getMoUsByInstitution('inst-global-002');
    const t2Audits = degreeAuditStore.getAuditsByInstitution('inst-global-002');
    assert.strictEqual(t2MoUs.length, 0);
    assert.strictEqual(t2Audits.length, 0);

    // Cross-tenant clearance override attempt
    assert.throws(() => {
      degreeAuditStore.overrideDeanClearance({
        studentId: 'CS2026-001',
        institutionId: 'inst-global-002', // Wrong tenant!
        deanName: 'Dean Global',
      });
    }, /AUDIT_NOT_FOUND_OR_TENANT_MISMATCH/);

    // Convocation CSV Export verification
    const apexAudits = degreeAuditStore.getAuditsByInstitution('inst-apex-001');
    const csv = exportConvocationRosterCSV(apexAudits);
    assert.ok(csv.includes('Student_ID,Student_Name,Institution_ID,Degree,Department'));
    assert.ok(csv.includes('"CS2026-001","Aarav Patel","inst-apex-001"'));
  });
});
