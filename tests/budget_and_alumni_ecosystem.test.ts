/**
 * Department Budget & Alumni Ecosystem Verification Audit Suite (TASK-890)
 * 
 * Verifies:
 * 1. Departmental OPEX/CAPEX allocation, expense burn rate, and overspending diagnostics.
 * 2. NAAC/NBA Criterion 4 financial resource CSV export formatting.
 * 3. Alumni mentor matching scoring, capacity invariants, and session scheduling.
 * 4. Cryptographic SHA-256 endowment tax receipt hashing and financial audit ledger.
 * 5. PII privacy protection barriers and cross-tenant isolation defense.
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  budgetPlanningStore,
  exportBudgetPlanCSV,
  BudgetLineItem,
} from '../src/lib/admin/budgetPlanning.js';
import {
  alumniNetworkStore,
  exportAlumniDirectoryCSV,
  exportEndowmentLedgerCSV,
  AlumniProfile,
} from '../src/lib/admin/alumniNetwork.js';

describe('TASK-890: Budget Planning & Alumni Ecosystem Audit Suite', () => {
  beforeEach(() => {
    budgetPlanningStore.clear();
    alumniNetworkStore.clear();
  });

  const MOCK_ITEMS: BudgetLineItem[] = [
    {
      id: 'li-1',
      category: 'FACULTY_SALARIES_AND_BENEFITS',
      allocatedAmount: 100000,
      expendedAmount: 60000,
      isCapex: false,
      description: 'Salaries',
    },
    {
      id: 'li-2',
      category: 'LAB_AND_RESEARCH_EQUIPMENT',
      allocatedAmount: 50000,
      expendedAmount: 30000,
      isCapex: true,
      description: 'Lab gear',
    },
  ];

  it('calculates departmental budget allocation, burn rate, and logs expenses', () => {
    const plan = budgetPlanningStore.createOrUpdatePlan({
      institutionId: 'inst-apex-001',
      department: 'Computer Science',
      fiscalYear: '2026-2027',
      lineItems: MOCK_ITEMS,
    });

    assert.strictEqual(plan.totalAllocated, 150000);
    assert.strictEqual(plan.totalExpended, 90000);
    assert.strictEqual(plan.remainingBalance, 60000);
    assert.strictEqual(plan.burnRatePercentage, 60.0);
    assert.strictEqual(plan.isOverspent, false);

    // Record an expense
    const updated = budgetPlanningStore.recordExpense({
      expenseId: 'exp-01',
      institutionId: 'inst-apex-001',
      department: 'Computer Science',
      fiscalYear: '2026-2027',
      category: 'LAB_AND_RESEARCH_EQUIPMENT',
      amount: 15000,
      vendorOrPayee: 'Lab Tech Instruments',
      invoiceNumber: 'INV-101',
      approvedBy: 'Dean',
      incurredAt: new Date().toISOString(),
    });

    assert.strictEqual(updated.totalExpended, 105000);
    assert.strictEqual(updated.remainingBalance, 45000);
    assert.strictEqual(updated.burnRatePercentage, 70.0);
    assert.strictEqual(updated.isOverspent, false);
  });

  it('detects overspending when expenses exceed allocated categorical funds', () => {
    budgetPlanningStore.createOrUpdatePlan({
      institutionId: 'inst-apex-001',
      department: 'Computer Science',
      fiscalYear: '2026-2027',
      lineItems: [
        {
          id: 'li-soft',
          category: 'SOFTWARE_LICENSES_AND_CLOUD',
          allocatedAmount: 10000,
          expendedAmount: 8000,
          isCapex: false,
          description: 'Cloud credits',
        },
      ],
    });

    // Incur expense that breaches allocation ($8,000 + $3,000 = $11,000 > $10,000)
    const overspentPlan = budgetPlanningStore.recordExpense({
      expenseId: 'exp-over',
      institutionId: 'inst-apex-001',
      department: 'Computer Science',
      fiscalYear: '2026-2027',
      category: 'SOFTWARE_LICENSES_AND_CLOUD',
      amount: 3000,
      vendorOrPayee: 'Cloud Provider',
      invoiceNumber: 'INV-AWS-99',
      approvedBy: 'Dean',
      incurredAt: new Date().toISOString(),
    });

    assert.strictEqual(overspentPlan.isOverspent, true);
    assert.ok(overspentPlan.overspentCategories.includes('SOFTWARE_LICENSES_AND_CLOUD'));
    assert.strictEqual(overspentPlan.remainingBalance, -1000);
  });

  it('exports valid NAAC/NBA financial CSV reports', () => {
    const plan = budgetPlanningStore.createOrUpdatePlan({
      institutionId: 'inst-apex-001',
      department: 'Computer Science',
      fiscalYear: '2026-2027',
      lineItems: MOCK_ITEMS,
    });

    const csv = exportBudgetPlanCSV([plan]);
    assert.ok(csv.includes('Institution_ID,Department,Fiscal_Year'));
    assert.ok(csv.includes('"inst-apex-001","Computer Science","2026-2027",150000,90000,60000,60'));
  });

  it('matches alumni mentors by domain expertise and enforces capacity limits', () => {
    alumniNetworkStore.registerAlumni({
      alumniId: 'alm-01',
      institutionId: 'inst-apex-001',
      name: 'Aditya Rao',
      graduationYear: 2021,
      degree: 'B.Tech CSE',
      department: 'Computer Science',
      currentCompany: 'Google',
      currentRole: 'Software Engineer',
      industry: 'Cloud',
      location: 'Bangalore',
      willingToMentor: true,
      mentorshipDomains: ['Distributed Systems', 'System Design'],
      activeMenteeCount: 1,
      maxMentees: 2,
      email: 'aditya@google.com',
      isPrivacyProtected: true,
    });

    alumniNetworkStore.registerAlumni({
      alumniId: 'alm-02',
      institutionId: 'inst-apex-001',
      name: 'Siddharth Sen',
      graduationYear: 2019,
      degree: 'B.Tech CSE',
      department: 'Computer Science',
      currentCompany: 'Microsoft',
      currentRole: 'Principal Engineer',
      industry: 'AI',
      location: 'Hyderabad',
      willingToMentor: true,
      mentorshipDomains: ['Machine Learning'],
      activeMenteeCount: 3,
      maxMentees: 3, // Full capacity
      email: 'siddharth@microsoft.com',
      isPrivacyProtected: true,
    });

    // Find mentors for 'Distributed Systems'
    const mentors = alumniNetworkStore.findMentors({
      institutionId: 'inst-apex-001',
      domain: 'Distributed Systems',
    });

    assert.strictEqual(mentors.length, 1);
    assert.strictEqual(mentors[0].alumniId, 'alm-01');
    // Privacy protected email check
    assert.ok(mentors[0].email.includes('(Protected)'));

    // alm-02 should be excluded because activeMenteeCount == maxMentees
    const aiMentors = alumniNetworkStore.findMentors({
      institutionId: 'inst-apex-001',
      domain: 'Machine Learning',
    });
    assert.strictEqual(aiMentors.length, 0);

    // Book session with alm-01
    const session = alumniNetworkStore.bookMentorshipSession({
      institutionId: 'inst-apex-001',
      alumniId: 'alm-01',
      studentId: 'stu-101',
      studentName: 'Rohan Varma',
      sessionTopic: 'Mock Interview Prep',
      scheduledAt: '2026-10-28T14:00:00Z',
    });

    assert.strictEqual(session.status, 'SCHEDULED');
    assert.ok(session.meetingLink?.startsWith('https://meet.career-os.internal'));

    // alm-01 now has 2 mentees (max capacity), so another booking should fail
    assert.throws(() => {
      alumniNetworkStore.bookMentorshipSession({
        institutionId: 'inst-apex-001',
        alumniId: 'alm-01',
        studentId: 'stu-102',
        studentName: 'Ananya Deshmukh',
        sessionTopic: 'Career Advice',
        scheduledAt: '2026-10-29T14:00:00Z',
      });
    }, /ALUMNI_CAPACITY_EXCEEDED/);
  });

  it('records endowment contributions with cryptographic SHA-256 receipt hashes', () => {
    const gift = alumniNetworkStore.recordEndowment({
      institutionId: 'inst-apex-001',
      alumniId: 'alm-01',
      alumniName: 'Aditya Rao',
      amount: 25000,
      designation: 'SCHOLARSHIP_ENDOWMENT',
    });

    assert.strictEqual(gift.amount, 25000);
    assert.strictEqual(gift.designation, 'SCHOLARSHIP_ENDOWMENT');
    assert.strictEqual(gift.receiptHash.length, 64); // Valid SHA-256 hex string

    const list = alumniNetworkStore.getEndowmentsByInstitution('inst-apex-001');
    assert.strictEqual(list.length, 1);
    assert.strictEqual(list[0].alumniName, 'Aditya Rao');

    // Reject negative donation amounts
    assert.throws(() => {
      alumniNetworkStore.recordEndowment({
        institutionId: 'inst-apex-001',
        alumniId: 'alm-01',
        alumniName: 'Aditya Rao',
        amount: -500,
        designation: 'UNRESTRICTED',
      });
    }, /CONTRIBUTION_AMOUNT_POSITIVE/);

    // Verify CSV export
    const csv = exportEndowmentLedgerCSV(list);
    assert.ok(csv.includes('Gift_ID,Institution_ID,Alumni_ID,Alumni_Name,Amount,Designation'));
    assert.ok(csv.includes('"inst-apex-001","alm-01","Aditya Rao",25000,"SCHOLARSHIP_ENDOWMENT"'));
  });

  it('enforces multi-tenant isolation across budget and alumni systems', () => {
    // Register alumni in tenant 1
    alumniNetworkStore.registerAlumni({
      alumniId: 'alm-t1',
      institutionId: 'inst-apex-001',
      name: 'Apex Alum',
      graduationYear: 2022,
      degree: 'B.Tech',
      department: 'CSE',
      currentCompany: 'Tech Corp',
      currentRole: 'Engineer',
      industry: 'Software',
      location: 'Delhi',
      willingToMentor: true,
      mentorshipDomains: ['Cloud'],
      activeMenteeCount: 0,
      maxMentees: 2,
      email: 'alum@apex.edu',
      isPrivacyProtected: false,
    });

    // Query from tenant 2
    const tenant2List = alumniNetworkStore.getAlumniByInstitution('inst-global-002');
    assert.strictEqual(tenant2List.length, 0);

    // Attempt to book session in tenant 2 with tenant 1 alum
    assert.throws(() => {
      alumniNetworkStore.bookMentorshipSession({
        institutionId: 'inst-global-002', // Wrong tenant!
        alumniId: 'alm-t1',
        studentId: 'stu-global',
        studentName: 'Global Student',
        sessionTopic: 'Advisory',
        scheduledAt: '2026-10-30T10:00:00Z',
      });
    }, /ALUMNI_NOT_FOUND_OR_TENANT_MISMATCH/);
  });
});
